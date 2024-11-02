import { Hono, type Context } from "hono";
import { logger } from 'hono/logger'
import { StatusCode } from "hono/utils/http-status";
import * as FakerNameSpace from "npm:@faker-js/faker";
import type { LocaleDefinition } from "npm:@faker-js/faker";

const Faker = FakerNameSpace.Faker;

const app = new Hono();
app.use(logger());
// Middleware to handle status, body, headers, and delay
app.use(async (context: Context, next) => {
  const url = new URL(context.req.url);
  const status = url.searchParams.get("status");
  const body = url.searchParams.get("body");
  const headers = url.searchParams.get("headers");
  const delay = url.searchParams.get("delay");

  if (headers) {
    try {
      const parsedHeaders = JSON.parse(headers);
      for (const [key, value] of Object.entries(parsedHeaders)) {
        context.res.headers.set(key, value as string);
      }
    } catch (error) {
      return context.text("Invalid headers format", 400);
    }
  }

  if (delay) {
    const delayMs = parseInt(delay, 10);
    if (!isNaN(delayMs)) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  let overrrideStatusCode: StatusCode | undefined;
  if (status) {
    const statusCode = parseInt(status, 10);
    if (statusCode >= 200 && statusCode <= 599) {
      overrrideStatusCode = statusCode as StatusCode;
    } else {
      return context.text("Invalid status code", 400);
    }
  }

  if (overrrideStatusCode && context.res.status !== overrrideStatusCode) {
    context.status(overrrideStatusCode);
  }
  if (body) {
    return context.text(body);
  }
  await next();

});

app.get("/", (context: Context) => {
  const language = context.req.header("Accept-Language") || "en";
  const { faker } = createFaker(language);
  const categories: { category: string; methods: string[] }[] = [];

  // extract category and method from the faker instance
  const categoryKeys = Object.keys(faker);
  for (const category of categoryKeys) {
    if (category === "rawDefinitions") continue;
    if (category === "definitions") continue;
    if (category === "helpers") continue;
    if (category.startsWith("_")) continue;
    const methods = Object.keys((faker as any)[category]);
    const validMethods = methods.filter((method) => {
      if (method.startsWith("_")) return false;
      if ((faker as any)[category][method] instanceof Faker) return false;
      if (typeof (faker as any)[category][method] !== "function") return false;
      return true;
    });
    if (validMethods.length > 0) {
      categories.push({ category, methods: validMethods });
    }
  }
  return context.html(<Help categories={categories} />);
});

app.all("/:category/:method/*", async (context: Context) => {
  const langRaw = context.req.header("Accept-Language") || "en";
  const { faker, language } = createFaker(langRaw);

  const { category, method } = context.req.param();
  const args =
    context.req
      .param("*")
      ?.split("/")
      .map((arg) => {
        try {
          return JSON.parse(decodeURIComponent(arg));
        } catch {
          return decodeURIComponent(arg);
        }
      }) || [];

  try {
    // @ts-ignore
    const fn = faker[category][method];
    if (!fn || typeof fn !== "function") {
      throw new Error(`Method ${category}.${method} not found. ${typeof fn}`);
    }
    const data = fn(...args);
    console.log({ category, method, args, data });
    return context.json(data);
  } catch (error: unknown) {
    console.error({ category, method, args, error, language });
    return context.html(<ErrorHelp error={error as Error} category={category} method={method} args={args} />, 400);
  }
});

app.all("/pong", async (context: Context) => {
  const body = await context.req.text();
  const headers = context.req.raw.headers;

  headers.forEach((value, key) => {
    context.res.headers.set(key, value);
  });

  return context.text(body);
});

Deno.serve(app.fetch);

type HelpProps = {
  categories: { category: string; methods: string[] }[];
};

function Help({ categories }: HelpProps) {
  return (
    <html>
      <body>
        <h1>Available endpoints:</h1>
        {categories.map(({ category, methods }) => (
          <div key={category}>
            <h2>{category.toUpperCase()}:</h2>
            {methods.map((method) => (
              <p key={method}>
                <a href={`/${category}/${method}/`}>/{category}/{method}/</a>
              </p>
            ))}
          </div>
        ))}
      </body>
    </html>
  );
}

function ErrorHelp({ error, category, method, args }: { error: Error, category: string, method: string, args: any[] }) {
  // const errorMessage = `Method ${category}.${method} failed:
  //   ${error}

  //   Faker docs: https://fakerjs.dev/api/${category}.html#${method}
  //   `;
  return (
    <html>
      <body>
        <h1>Method {category}.{method} failed:</h1>
        <p>{error}</p>
        <p>Faker docs: <a href={`https://fakerjs.dev/api/${category}.html#${method}`}>https://fakerjs.dev/api/{category}.html#{method}</a></p>
        <h2>Arguments:</h2>
        <pre>{JSON.stringify(args, null, 2)}</pre>
      </body>
    </html>

  );
}

function createFaker(languageRaw: string): { faker: typeof Faker, language: string } {
  const language = languageRaw.split(",")[0].split("-")[0];
  const lang: LocaleDefinition =
    // @ts-ignore
    FakerNameSpace[language] || FakerNameSpace.en;

  const faker = new Faker({ locale: [lang, FakerNameSpace.en] }) as unknown as typeof Faker;
  return { faker, language };
}
