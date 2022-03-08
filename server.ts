import { delay as wait } from "https://deno.land/std@0.128.0/async/mod.ts";
import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
import { CSS, render } from "https://deno.land/x/gfm@0.1.19/mod.ts";
import "https://esm.sh/prismjs@1.27.0/components/prism-http?no-check";
// import "https://esm.sh/prismjs@1.27.0/components/prism-rest?no-check";
import logger from "./services/logger.ts";
import { faker } from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";

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
  logger.info("Listen at http://localhost:8000/");

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
    let headers = { "Access-Control-Allow-Origin": "*", ..._headers };
    try {
      if (delay) {
        await wait(delay);
      }
      if (!body && pathname === "/" || pathname.startsWith("/docs")) {
        // RENDER DOCS
        const path = pathname === "/" ? "./README.md" : "." + pathname;
        body = await renderMarkdownToHtml(path, baseUrl);
        headers = { ...headers, "content-type": "text/html; charset=utf-8" };
      } else if (pathname.toLowerCase() === "/pong") {
        // PONG
        body = request.body ?? body;
        headers = {
          ...headers,
          ...Object.fromEntries(request.headers.entries()),
        } as Headers;
      } else if (pathname !== "/") {
        // FAKER
        const fakerPath = pathname.replace(".", "/").split("/").filter(Boolean);
        const language = request.headers.get("accept-language") || "es";
        faker.setLocale(language);

        let [path, ...restPath] = ["", ...fakerPath];
        // deno-lint-ignore no-explicit-any
        let node: any = faker;
        // deno-lint-ignore ban-types
        let method: Function = () => null;
        for (let index = 0; index < fakerPath.length; index++) {
          [path, ...restPath] = restPath || [];
          const nextNode = node[path] ? node[path] : node;
          if (typeof nextNode === "function") {
            method = nextNode.bind(node);
            break;
          }
          node = nextNode;
        }
        let data, message;
        try {
          data = method(
            ...restPath
              .map(decodeURIComponent)
              .map((arg) => {
                try {
                  const result = JSON.parse(arg);
                  return typeof result === "object" ? result : arg;
                } catch {
                  return arg;
                }
              }),
          );
          status ||= 200;
          if (!data) {
            message = `faker.${fakerPath.join(".")}() not valid`;
            status = 404;
          }
        } catch (error) {
          status = 400;
          message = error.message;
        }
        body = JSON.stringify(
          {
            data: data,
            docs: `${baseUrl}/docs/${fakerPath
              ?.[0]}.md#${fakerPath?.[1] || ""}`,
            status,
            message,
            language: faker.locale,
          },
          null,
          2,
        );
        headers = {
          ...headers,
          "content-type": "application/json; charset=utf-8",
        };
      }

      status ||= 200;
      return new Response(body, {
        status,
        headers,
      });
    } catch (error) {
      logger.error(error);
      return new Response(String(error), {
        status: 500,
        headers,
      });
    }
  });
}
