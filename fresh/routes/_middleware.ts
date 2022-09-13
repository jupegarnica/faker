import { delay as wait } from "https://deno.land/std@0.130.0/async/mod.ts";

// import logger from "./services/logger.ts";
import { faker } from "https://unpkg.com/@faker-js/faker@6.0.0/dist/esm/index.js";
// import { faker } from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";
// import { faker } from "https://cdn.skypack.dev/@faker-js/faker@6.0.0";

import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
    data: string;
}

const logger = console;

export async function handler(
    request: Request,
    ctx: MiddlewareHandlerContext<State>,
) {
    const { pathname, searchParams, protocol, host } = new URL(request.url);
    const baseUrl = `${protocol}//${host}`;
    let body = searchParams.get("body") as BodyInit;
    const requestedHeaders = searchParams.get("headers");
    const _headers = requestedHeaders
        ? JSON.parse(requestedHeaders)
        : undefined;
    let status = Number(searchParams.get("status")) || null;
    const _delay = searchParams.get("delay");
    const delay = _delay ? Number(_delay) : 0;
    const headers = new Headers(_headers);
    headers.set(
        "Access-Control-Allow-Origin",
        "*",
    );

    // logger.log({ pathname, searchParams, protocol, host, baseUrl });
    logger.warn({ body, status, delay, pathname })

    if (delay) {
        await wait(delay);
    }
    if (pathname.toLowerCase() === "/pong") {
        // PONG
        body = request.body ?? body;
        request.headers.forEach((value, key) => headers.set(key, value));
        return new Response(body, {
            status: status || 200,
            headers,
        });
    }
    if (pathname !== "/") {
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
                // docs: createDocsLink(fakerPath),
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
    // logger.dim(request.headers.get("x-forwarded-for"));
    // logger[status](request.method, pathname, {
    //     body: searchParams.get("body"),
    //     status: searchParams.get("status"),
    //     headers: searchParams.get("headers"),
    // });
    return new Response(body, {
        status,
        headers,
    });


}

const resp = await ctx.next();
return resp;
}
