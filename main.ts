import { Hono, type Context } from "hono";
import * as FakerNameSpace from "npm:@faker-js/faker";
import type { LocaleDefinition } from "npm:@faker-js/faker";

const Faker = FakerNameSpace.Faker;

const app = new Hono();

app.get("/", (context: Context) => {
  const language = context.req.header("Accept-Language") || "en";
  const faker = createFaker(language);
  let helpText = `<html><body><h1>Available endpoints:</h1>`;
  // extract category and method from the faker instance
  const categories = Object.keys(faker);
  for (const category of categories) {
    if (category === "rawDefinitions") continue;
    if (category === "definitions") continue;
    if (category === "helpers") continue;
    if (category.startsWith("_")) continue;
    helpText += `<h2>${category.toUpperCase()}:</h2>`;
    const methods = Object.keys((faker as any)[category]);
    for (const method of methods) {
      if (method.startsWith("_")) continue;
      if ( (faker as any)[category][method] instanceof Faker) {
        continue;
      }
      if (typeof (faker as any)[category][method] !== "function") {
        continue;
      }

      helpText += `<p><a href="/${category}/${method}/">/${category}/${method}/</a></p>`;
    }
  }
  helpText += `</body></html>`;
  return context.html(helpText);
});

app.all("/:category/:method/*", async (context: Context) => {
  const language = context.req.header("Accept-Language") || "es";
  const faker = createFaker(language);

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
    const fn = faker[category][method];
    if (!fn || typeof fn !== "function") {
      throw new Error(`Method ${category}.${method} not found. ${typeof fn}`);
    }
    const data = fn(...args);
    console.log({ category, method, args, data });
    return context.json(data);
  } catch (error: unknown) {
    console.error({ category, method, args, error });
    const errorMessage = `Method ${category}.${method} failed:
    ${error}

    Faker docs: https://fakerjs.dev/api/${category}.html#${method}
    `;
    return context.text(errorMessage, 400);
  }
});

function serialize(obj: any) {
  return JSON.stringify(obj, null, 2);
}

function createFaker(language: string): any {
  const languageParsed = language.split(",")[0].split("-")[0];
  const lang: LocaleDefinition =
    // @ts-ignore
    FakerNameSpace[languageParsed] || FakerNameSpace.es;

  return new Faker({ locale: [lang] }) as unknown as typeof Faker;
}

Deno.serve(app.fetch);
