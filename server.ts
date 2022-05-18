import { delay as wait } from "https://deno.land/std@0.130.0/async/mod.ts";
import { serve } from "https://deno.land/std@0.130.0/http/server.ts";
import { CSS, render } from "https://deno.land/x/gfm@0.1.20/mod.ts";
import "https://esm.sh/prismjs@1.27.0/components/prism-http?no-check";
// import "https://esm.sh/prismjs@1.27.0/components/prism-rest?no-check";
import logger from "./services/logger.ts";
import { faker } from "https://unpkg.com/@faker-js/faker@6.0.0/dist/esm/index.js";
// import { faker } from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";
// import { faker } from "https://cdn.skypack.dev/@faker-js/faker@6.0.0";

const validFakerNameSpaces = [
  "fake",
  "unique",
  "mersenne",
  "random",
  "helpers",
  "datatype",
  "address",
  "animal",
  "commerce",
  "company",
  "database",
  "date",
  "finance",
  "git",
  "hacker",
  "image",
  "internet",
  "lorem",
  "music",
  "name",
  "phone",
  "system",
  "time",
  "vehicle",
  "word",
];
const docsBaseUrl = "https://fakerjs.dev";
function createDocsLink(fakerPath: string[]) {
  let namespace = fakerPath[0];
  const method = fakerPath[1];
  if (!validFakerNameSpaces.includes(namespace)) {
    namespace = "helpers";
  }
  return `${docsBaseUrl}/api/${namespace}.html#${method}`;
}
function stringToItsType(
  value: string,
): string | number | boolean | null | undefined | Record<string, unknown> {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (value === "undefined") return undefined;
  if (value === "NaN") return NaN;
  if (!isNaN(Number(value))) return Number(value);
  try {
    const result = JSON.parse(value);
    return typeof result === "object" ? result : value;
  } catch {
    return value;
  }
}

const html = String.raw;
const createHtml = ({ CSS, body }: { CSS: string; body: string }) =>
  html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        main {
          max-width: 800px;
          margin: 0 auto;
          padding: 1em;
        }
        html, body {
            margin: 0;
            padding: 0;
        }
        ${CSS}
      </style>
    </head>
    <body data-color-mode="auto" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
      <main>
        ${body}
      </main>
    </body>
  </html>
  `;
async function renderMarkdownToHtml(
  path: string,
  baseUrl = "/",
): Promise<string> {
  // const timer = `Render path ${path} on`;
  try {
    // console.time(timer);
    const markdown: string = await Deno.readTextFile(path);
    const readmeContent: string = render(markdown, {
      baseUrl,
      allowIframes: false,
    });
    const text = createHtml({ CSS, body: readmeContent });
    return text;
  } catch (error) {
    throw error;
  } finally {
    // console.timeEnd(timer);
  }
}

if (import.meta.main) {
  // logger.info("Listen at http://localhost:8000/");

  await serve(async (request: Request) => {
    const { pathname, searchParams, protocol, host } = new URL(request.url);
    const baseUrl = `${protocol}//${host}`;
    let body = searchParams.get("body") as BodyInit;
    const requestedHeaders = searchParams.get("headers");
    const _headers = requestedHeaders
      ? JSON.parse(requestedHeaders)
      : undefined;
    let status = Number(searchParams.get("status"));
    const _delay = searchParams.get("delay");
    const delay = _delay ? Number(_delay) : 0;
    const headers = new Headers(_headers);
    headers.set(
      "Access-Control-Allow-Origin",
      "*",
    );
    try {
      if (delay) {
        await wait(delay);
      }
      if (!body && pathname === "/" || pathname.startsWith("/docs")) {
        // RENDER DOCS
        const path = pathname === "/" ? "./README.md" : "." + pathname;
        body = await renderMarkdownToHtml(path, baseUrl);
        headers.set("content-type", "text/html; charset=utf-8");
      } else if (pathname.toLowerCase() === "/pong") {
        // PONG
        body = request.body ?? body;
        request.headers.forEach((value, key) => headers.set(key, value));
      } else if (pathname !== "/") {
        // FAKER
        const fakerPath = pathname.replace(".", "/").split("/").filter(Boolean);
        const language = request.headers.get("accept-language") || "";
        const locale = language in faker.locales ? language : "es";
        faker.setLocale(locale);

        // deno-lint-ignore no-explicit-any
        let node: any = faker;
        // deno-lint-ignore ban-types
        let method: Function = () => null;
        let data;
        let message;
        // deno-lint-ignore no-explicit-any
        let args: any[] = [];
        const isUnique = fakerPath[0] === "unique";
        let pathToFindMethod = ["", ...fakerPath];

        if (isUnique) {
          pathToFindMethod = fakerPath;
        }

        let [path, ...restPath] = pathToFindMethod;
        for (let index = 0; index < fakerPath.length; index++) {
          [path, ...restPath] = restPath || [];
          const nextNode = node[path] ? node[path] : node;
          if (typeof nextNode === "function") {
            method = nextNode.bind(node);
            break;
          }
          node = nextNode;
        }
        try {
          args = restPath
            .filter(Boolean)
            .map(decodeURIComponent)
            .map(stringToItsType);

          if (isUnique) {
            data = faker.unique(method, args, { maxRetries: 10 });
          } else {
            data = method(...args);
          }

          status ||= 200;
          if (!data) {
            message = `faker.${fakerPath.join(".")}() not valid`;
            status = 404;
          }
        } catch (error) {
          logger.error(error.message);
          logger.debug(error, {
            restPath,
            fakerPath,
            args,
            methodName: method.name,
          });
          status = 400;
          message = error.message;
        }
        body = JSON.stringify(
          {
            data: data,
            docs: createDocsLink(fakerPath),
            status,
            message,
            language: faker.locale,
          },
          null,
          2,
        );
        headers.set("content-type", "application/json; charset=utf-8");
      }

      status ||= 200;
      logger.dim(request.headers.get("x-forwarded-for"));
      logger[status](request.method, pathname, JSON.stringify(searchParams));
      return new Response(body, {
        status,
        headers,
      });
    } catch (error) {
      if (error instanceof RangeError) {
        return new Response(String(error), {
          status: 400,
          headers,
        });
      }
      logger.critical(error);
      return new Response(String(error), {
        status: 500,
        headers,
      });
    }
  });
}
