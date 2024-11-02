import { Hono, type Context } from "hono";
import * as FakerNameSpace from "npm:@faker-js/faker";
import type { LocaleDefinition } from "npm:@faker-js/faker";

const Faker = FakerNameSpace.Faker;

const app = new Hono();
type HelpProps = {
  categories: { category: string; methods: string[] }[];
};

export function Help({ categories }: HelpProps) {
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

app.get("/", (context: Context) => {
  const language = context.req.header("Accept-Language") || "en";
  const faker = createFaker(language);
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