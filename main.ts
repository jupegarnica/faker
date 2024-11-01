import { Hono, type Context } from "hono";
import * as FakerNameSpace from "npm:@faker-js/faker";
import type { LocaleDefinition } from "npm:@faker-js/faker";
// create a Faker instance with only es data and no en fallback (=> smaller bundle size)

const Faker = FakerNameSpace.Faker;

const app = new Hono();

app.get("/", (context: Context) => {
  const helpText = `
    Basic
    GET https://faker.deno.dev/name/firstName

    Language
    Default language is es, but can be specified with the accept-language header.

    Passing arguments
    Once a path found a method on faker the rest of the path will be used as arguments.
  `;
  return context.text(helpText);
});

app.all("/:category/:method/*", async (context: Context) => {
  const language = context.req.header("Accept-Language") || "es";
  const languageParsed = language.split(",")[0].split("-")[0];
  // @ts-ignore
  const lang: LocaleDefinition = FakerNameSpace[languageParsed] || FakerNameSpace.es;

  const faker = new Faker({ locale: [lang] });

  const { category, method } = context.req.param();
  const args = context.req.param("*")?.split("/").map(arg => {
    try {
      return JSON.parse(decodeURIComponent(arg));
    } catch {
      return decodeURIComponent(arg);
    }
  }) || [];

  if (faker[category] && typeof faker[category][method] === "function") {
    const data = faker[category][method](...args);
    return context.json({
      data,
      docs: `https://fakerjs.dev/api/${category}.md#${method}`,
      status: 200,
      language: languageParsed
    });
  } else {
    return context.json({ error: "Invalid endpoint" }, 404);
  }
});

Deno.serve(app.fetch);
