import { delay as wait } from "https://deno.land/std@0.128.0/async/mod.ts";
import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
import { CSS, render } from "https://deno.land/x/gfm@0.1.19/mod.ts";
import "https://esm.sh/prismjs@1.27.0/components/prism-http?no-check";
// import "https://esm.sh/prismjs@1.27.0/components/prism-rest?no-check";
import console from "./services/logger.ts";

const markdown: string = Deno.readTextFileSync("README.md");

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
  const status = searchParams.get("status");
  const _delay = searchParams.get("delay");
  const delay = _delay ? Number(_delay) : 0;
  let headers = { "Access-Control-Allow-Origin": "*", ..._headers };

  try {
    if (delay) {
      await wait(delay);
    }
    // show readme

    if (pathname === "/" && !body && !_headers && !status) {
      const body = createHtml({ CSS, body: readmeContent });
      headers = new Headers(headers);
      headers.set("content-type", "text/html; charset=utf-8");

      return new Response(body, { headers });
    }
    // faker
    // if (pathname.toLowerCase().startsWith("/faker")) {
    //   return new Response("faker");
    // }

    // pong
    if (pathname.toLowerCase() === "/pong") {
      body = request.body ?? body;
      headers = {
        ...headers,
        ...Object.fromEntries(request.headers.entries()),
      } as Headers;
      return new Response(body, { headers });
    }

    const responseStatus = status ? Number(status) : 200;
    console[request.method](responseStatus, request.url);

    return new Response(body, {
      status: responseStatus,
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
