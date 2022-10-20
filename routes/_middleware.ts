import { delay as wait } from "https://deno.land/std@0.155.0/async/mod.ts";

import logger from "../services/logger.ts";

import { faker } from "https://cdn.skypack.dev/@faker-js/faker@v7.5.0";
// import { faker } from "https://unpkg.com/@faker-js/faker@7.5.0/dist/esm/index.js";
// import { faker } from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";
// import { faker } from "https://cdn.skypack.dev/@faker-js/faker@7.5.0";

import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
  data: string;
}
function logRequest(
  status: number,
  pathname: string,
  searchParams: URLSearchParams,
  request: Request,
) {
  // logger.dim(request.headers.get("x-forwarded-for"));
  logger[status](request.method, pathname, {
    body: searchParams.get("body"),
    status: searchParams.get("status"),
    headers: searchParams.get("headers"),
  });
  // logger.timeEnd(request.url);
}

const validFakerNameSpaces: string[] = [];
const doNotInclude = ["_localeFallback", "_locale", "definitions", "locales"];
for (const key in faker) {
  if (doNotInclude.includes(key)) continue;
  validFakerNameSpaces.push(key);
}

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
export async function handler(
  request: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  // logger.time(request.url);
  const { pathname, searchParams, protocol, host } = new URL(request.url);
  // const baseUrl = `${protocol}//${host}`;
  let body = searchParams.get("body") as BodyInit;
  const requestedHeaders = searchParams.get("headers");
  const _headers = requestedHeaders ? JSON.parse(requestedHeaders) : undefined;
  let status = Number(searchParams.get("status")) || null;
  const _delay = searchParams.get("delay");
  const delay = _delay ? Number(_delay) : 0;
  const headers = new Headers(_headers);
  headers.set(
    "Access-Control-Allow-Origin",
    "*",
  );
  const quiteMode = searchParams.get("quiet") ||
    request.headers.get("x-quiet") || request.headers.get("quiet") ||
    request.headers.get("quiteMode");

  let logLevel = request.headers.get("logLevel") || "";

  if (quiteMode) {
    logLevel = "CRITICAL";
  }
  if (logLevel) {
    logger.setFilter(logLevel);
  }

  if (delay) {
    await wait(delay);
  }
  if (pathname.toLowerCase() === "/pong") {
    // PONG
    body = request.body ?? body;
    request.headers.forEach((value, key) => headers.set(key, value));
    status ||= 200;
    logRequest(status, pathname, searchParams, request);
    return new Response(body, {
      status,
      headers,
    });
  }
  if (
    pathname !== "/" &&
    !pathname.startsWith("/docs") &&
    !pathname.startsWith("/_frsh") &&
    !pathname.startsWith("/static")
  ) {
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
    const isUnique = fakerPath[0] === "helpers" && fakerPath[1] === "unique";
    let pathToFindMethod = ["", ...fakerPath];

    if (isUnique) {
      [, ...pathToFindMethod] = fakerPath;
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
        data = faker.helpers.unique(method, args, {
          maxRetries: 50,
          maxTime: 100,
        });
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
    logRequest(status, pathname, searchParams, request);
    return new Response(body, {
      status,
      headers,
    });
  }
  if (status || body || _headers) {
    try {
      status ||= 200;

      return new Response(body, {
        status,
        headers,
      });
    } catch (error) {
      // logger.error(error.message);
      status = 400;
      return new Response(error.message, {
        status,
        headers,
      });
    } finally {
      logRequest(status || 200, pathname, searchParams, request);
    }
  }
  const resp = await ctx.next();
  logRequest(status || 200, pathname, searchParams, request);
  return resp;
}
