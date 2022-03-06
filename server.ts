import { delay as wait } from "https://deno.land/std@0.128.0/async/mod.ts";
import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
import { CSS, render } from "https://deno.land/x/gfm@0.1.19/mod.ts";
import "https://esm.sh/prismjs@1.27.0/components/prism-http?no-check";
// import "https://esm.sh/prismjs@1.27.0/components/prism-rest?no-check";
import console from "./services/logger.ts";
import { faker } from "https://deno.land/x/deno_faker@v1.0.3/locale/es.ts";
faker.setLocale("es");

const markdown: string = await Deno.readTextFile("README.md");

const readmeContent: string = render(markdown, {
  baseUrl: "/",
  allowIframes: false,
});

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

console.info("listen http://localhost:8000/");
await serve(async (request: Request) => {
  const { pathname, searchParams } = new URL(request.url);
  let body = searchParams.get("body") as BodyInit;
  const requestedHeaders = searchParams.get("headers");
  const _headers = requestedHeaders ? JSON.parse(requestedHeaders) : undefined;
  let status = Number(searchParams.get("status"));
  const _delay = searchParams.get("delay");
  const delay = _delay ? Number(_delay) : 0;
  let headers = { "Access-Control-Allow-Origin": "*", ..._headers };
  try {
    if (delay) {
      await wait(delay);
    }
    // show readme
    if (pathname === "/" && !body) {
      body = createHtml({ CSS, body: readmeContent });
      headers = { ...headers, "content-type": "text/html; charset=utf-8" };
    } else if (pathname.toLowerCase() === "/pong") {
      body = request.body ?? body;
      headers = {
        ...headers,
        ...Object.fromEntries(request.headers.entries()),
      } as Headers;
    } else if (pathname !== "/") {
      // FAKER
      const fakerPath = pathname.split("/");

      let [path, ...restPath] = fakerPath;
      // deno-lint-ignore no-explicit-any
      let node: any = faker;
      for (let index = 0; index < fakerPath.length; index++) {
        [path, ...restPath] = restPath;
        node = node[path] ? node[path] : node;
        console.log(path, typeof node);
        if (typeof node === "function") {
          break;
        }
      }

      const data = typeof node === "function" ? node(...restPath) : null;
      body = JSON.stringify({
        data: data ?? `faker${fakerPath.join(".")} not found`,
        docs: `https://fakerjsdocs.netlify.app/api/${fakerPath
          ?.[1]}.html#${fakerPath?.[2]}`,
        status,
      });
      if (!data) {
        status = 404;
      } else {
        headers = {
          ...headers,
          "content-type": "application/json; charset=utf-8",
        };
      }
    }

    status ||= 200;
    console[request.method](status, pathname);

    return new Response(body, {
      status,
      headers,
    });
  } catch (error) {
    console.error(error);
    return new Response(String(error), {
      status: 500,
      headers,
    });
  }
});
