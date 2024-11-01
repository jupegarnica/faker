import { Hono, type Context } from "hono";
import * as FakerNameSpace from "npm:@faker-js/faker";
import type { LocaleDefinition } from "npm:@faker-js/faker";
// create a Faker instance with only es data and no en fallback (=> smaller bundle size)

const Faker = FakerNameSpace.Faker;

const app = new Hono();

app.get("/", (context: Context) => {
  const language = context.req.header("Accept-Language") || "es";
  const faker = createFaker(language);
  let helpText = `<html><body><h1>Available endpoints:</h1>`;
  // extract category and method from the faker instance
  const categories = Object.keys(faker);
  for (const category of categories) {
    if (category === "locale") continue;
    if (category === "definitions") continue;
    if (category.startsWith('_')) continue;
    helpText += `<h2>${category.toUpperCase()}:</h2>`;
    const methods = Object.keys((faker as any)[category]);
    for (const method of methods) {
      console.log(faker[category][method].toString());

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
      language,
    });
  } else {
    return context.json({ error: "Invalid endpoint" }, 404);
  }
});

function createFaker(language: string): typeof Faker {
  const languageParsed = language.split(",")[0].split("-")[0];
  // @ts-ignore
  const lang: LocaleDefinition = FakerNameSpace[languageParsed] || FakerNameSpace.es;

  return new Faker({ locale: [lang] }) as unknown as typeof Faker;
}

Deno.serve(app.fetch);
