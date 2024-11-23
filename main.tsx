import { Hono, type Context } from "hono";
import { logger } from 'hono/logger'
import { StatusCode } from "hono/utils/http-status";
import { raw, } from "hono/utils/html";
import { Style, css } from "hono/css";
import * as FakerNameSpace from "npm:@faker-js/faker";
import type { LocaleDefinition } from "npm:@faker-js/faker";
import { jsxRenderer } from 'hono/jsx-renderer'
const Faker = FakerNameSpace.Faker;

const app = new Hono();
app.use(logger());
// set main layout
app.use(
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <Style>{css`
          html {
            font-family: Arial, Helvetica, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            line-height: 1.6;
          }
          body {
            margin: 0;
            padding: 20px;
            text-align: center;
            background-color: var(--background-color);
          }
          .max-width {
            max-width: 1000px;
            margin: auto;
            text-align: left;
            padding: 1em 2em;
            border-radius: 5px;
            background-color: var(--content-background-color);
          }
          h1, h2, h3 {
            color: var(--heading-color);
          }
          a {
            color: var(--link-color);
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          pre {
            background: var(--pre-background-color);
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
          ul {
            list-style-type: disc;
            padding-left: 20px;
          }
          section {
            margin-bottom: 20px;
          }
          div {
            margin-bottom: 10px;
          }
          #grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
          :root {
            --light--background-color: #f4f4f9;
            --light--text-color: #333;
            --light--content-background-color: #fff;
            --light--heading-color: #444;
            --light--link-color: #007acc;
            --light--pre-background-color: #e8e8e8;
            --dark--background-color: #333;
            --dark--text-color: #f4f4f9;
            --dark--content-background-color: #444;
            --dark--heading-color: #f4f4f9;
            --dark--link-color: #1e90ff;
            --dark--pre-background-color: #555;
            --light--input-background-color: #fff;
            --light--input-text-color: #000;
            --dark--input-background-color: #444;
            --dark--input-text-color: #f4f4f9;
          }
          @media (prefers-color-scheme: dark) {
            :root {
            --background-color: var(--dark--background-color);
            --text-color: var(--dark--text-color);
            --content-background-color: var(--dark--content-background-color);
            --heading-color: var(--dark--heading-color);
            --link-color: var(--dark--link-color);
            --pre-background-color: var(--dark--pre-background-color);
            --input-background-color: var(--dark--input-background-color);
            --input-text-color: var(--dark--input-text-color);
            }
          }
          @media (prefers-color-scheme: light) {
            :root {
            --background-color: var(--light--background-color);
            --text-color: var(--light--text-color);
            --content-background-color: var(--light--content-background-color);
            --heading-color: var(--light--heading-color);
            --link-color: var(--light--link-color);
            --pre-background-color: var(--light--pre-background-color);
            --input-background-color: var(--light--input-background-color);
            --input-text-color: var(--light--input-text-color);
            }
          }
          form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            border-radius: 5px;
            background-color: var(--content-background-color);
          }
          form div {
            display: flex;
            flex-direction: column;
          }
          .row {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
          }
          form label {
            font-weight: bold;
            margin-bottom: 5px;
          }
          form input, form textarea {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1em;
            background-color: var(--input-background-color);
            color: var(--input-text-color);
          }
          form textarea {
            resize: vertical;
          }
          form input[type="number"] {
            width: 100px;
          }
          #copy-url {
            background: none;
            border: none;
            cursor: copy;
            padding: 0;
            position: absolute;
            right: 0.8em;
            top: 0.8em;
          }
          .url {
             position: relative;
             cursor: copy;

          }
          #copy-url,
          #copy-url svg path{
            fill: var(--text-color, 'green');
            cursor: copy;
          }
          form input:invalid, form textarea:invalid {
            border-color: red;
          }
        `}</Style>
        </head>
        <body className="">

          <div className="max-width">
            {children}
          </div>
        </body>

      </html>
    )
  })
)
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
    let _headers;
    try {
      _headers = JSON.parse(headers || "{}");
    } catch {
      _headers = {};
    }
    return context.text(body, overrrideStatusCode, _headers);
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
  return context.render(<Help categories={categories} />);
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
    context.status(400);
    return context.render(<ErrorHelp error={error as Error} category={category} method={method} args={args} />);
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
    <div className="help">
      <h1>Faker API REST</h1>
      <section id="intro">
        <p>An API REST to fake any other one.</p>
        <h2>Goals:</h2>
        <ul>
          <li>Be responded with a specific body, status, or headers.</li>
          <li>Get random fake data using faker.js</li>
          <li>Get delayed response.</li>
          <li>Live at: <a href="https://faker.deno.dev/">https://faker.deno.dev/</a></li>
          <li>Source at: <a href="https://github.com/jupegarnica/faker">https://github.com/jupegarnica/faker</a></li>
        </ul>
        <h2>Usage</h2>
        <p>Make an HTTP request with search params like status, body, header, or delay to get the response you want.</p>
        <h3>Example:</h3>
        <pre>
          {raw(`GET https://faker.deno.dev/?body=hola&delay=1000&status=400
HTTP/1.1 400 Bad Request
content-type: text/plain
content-length: 4

hola`)}
        </pre>
        <p>Try yourself: <a href="https://faker.deno.dev?body=hola&status=569">https://faker.deno.dev?body=hola&status=569</a></p>
      </section>
      <section id="creation">
        <h2>Create Your Request</h2>
        <h3>URL:</h3>
        <div className="url">
          <span id="copy-url">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM20 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V7C22 5.9 21.1 5 20 5ZM20 21H8V7H20V21Z" fill="currentColor" />
            </svg>
          </span>
          <pre id="dynamic-url">https://faker.deno.dev/</pre>
        </div>
        <form id="creation-form">
          <div className="row">
            <label htmlFor="status">Status:</label>
            <input type="number" id="status" name="status" min="200" max="599" />
            <label htmlFor="delay">Delay (ms):</label>
            <input type="number" id="delay" name="delay" min="0" step="100" />
          </div>
          <div>
            <label htmlFor="body">Body:</label>
            <textarea id="body" name="body" rows="4"></textarea>
          </div>
          <div>
            <label htmlFor="headers">Headers (JSON):</label>
            <textarea id="headers" name="headers" rows="4">{`{}`}</textarea>
          </div>
        </form>
      </section>
      <section id="params">
        <h3>Body</h3>
        <p>Specify a search body param to retrieve a response with that body.</p>
        <pre>
          {raw(`GET https://faker.deno.dev/?body=hola
HTTP/1.1 200 OK
content-type: text/plain
content-length: 4

hola`)}
        </pre>
        <h3>Response Status</h3>
        <p>Specify a search status param to get back that code status. The status must be inside the range 200 to 599.</p>
        <pre>
          {raw(`GET https://faker.deno.dev/?status=301
HTTP/1.1 301 Moved Permanently
content-type: text/plain
content-length: 0`)}
        </pre>
        <h3>Headers</h3>
        <p>Specify a search header param as a JSON string to get them back.</p>
        <pre>
          {raw(`GET https://faker.deno.dev/?headers={"x-hello":"world"}
HTTP/1.1 200 OK
x-hello: world
content-length: 0`)}
        </pre>
        <h3>Delay</h3>
        <p>Specify a search delay param in milliseconds in order to delay the response.</p>
        <pre>
          {raw(`GET https://faker.deno.dev/?delay=1000`)}
        </pre>
        <h3>/pong</h3>
        <p>Replay with the same body and header as the request</p>
        <pre>
          {raw(`POST https://faker.deno.dev/pong
?status=201
&delay=100
&body=willBeIgnored
&headers={"x-hola":"mundo"}
X-hello: world
content-type: text/plain

{"a":1}

HTTP/1.1 201 Created
X-hello: world
x-hola: mundo
content-type: text/plain

{"a":1}`)}
        </pre>
      </section>
      <section id="faker">
        <h1>Fakerjs</h1>
        <h2>Oficial docs:</h2>
        <p>
          Official docs: <a href="https://fakerjs.dev">https://fakerjs.dev</a>
        </p>
        <h2>Language:</h2>
        <p>
          Default language is <strong>es</strong>, but can be specified with the <code>accept-language</code> header.
        </p>
        <p>
          To know the languages included, check out the docs at <a href="https://fakerjs.dev/guide/localization.html#available-locales">https://fakerjs.dev/guide/localization.html#available-locales</a>
        </p>
        <pre>
          {raw(`GET https://faker.deno.dev/name/firstName
accept-language: en

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

"Chesley"`)}
        </pre>
        <h2>Passing Arguments:</h2>
        <p>
          Once a path finds a method on Faker, the rest of the path will be used as arguments.
        </p>
        <p>
          Using path <code>phone/number/###-###-####</code> will call <code>faker.phone.number('###-###-####')</code>
        </p>
        <pre>
          {raw(`GET https://faker.deno.dev/phone/number/###-###-####
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8

"956 687 564"`)}
        </pre>
        <p>
          It can receive any type of argument, like object, array, string, number.
        </p>
        <p>
          But keep in mind that objects and arrays must be passed as JSON strings.
        </p>
        <pre>
          {raw(`GET https://faker.deno.dev/datatype/number/{"max":3,"min":1}`)}
        </pre>
        <p>
          If needed, use <code>encodeURIComponent</code> to pass an argument with special characters.
        </p>
        <h2>Endpoints:</h2>
        <p>
          The following endpoints are available to get random data using faker.js. The API will return a JSON response with the data generated.
        </p>
        <div id="grid">
          {categories.map(({ category, methods }) => (
            <div key={category}>
              <h4>{category}:</h4>
              {methods.map((method) => (
                <p key={method}>
                  <a href={`/${category}/${method}/`}>/{category}/{method}/</a>
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
      <script dangerouslySetInnerHTML={{
        __html: `
        document.addEventListener('DOMContentLoaded', () => {
          const form = document.getElementById('creation-form');
          const dynamicUrl = document.getElementById('dynamic-url');
          const headersTextarea = form.headers;
          const bodyTextarea = form.body;
          const copyButton = document.querySelector('.url');
          const baseUrl = window.location.origin;

          function validateInput(input) {
            try {
              JSON.parse(input.value);
              input.style.borderColor = '';
            } catch {
              input.style.borderColor = 'red';
            }
          }

          bodyTextarea.addEventListener('input', () => {
            const body = form.body.value;
            let headers;
            try {
              headers = JSON.parse(headersTextarea.value);
            } catch {
              headers = {};
            }
            try {
              JSON.parse(body);
              headers["Content-Type"] = "application/json";
            } catch {
              if (body.trim().startsWith('<?xml') && body.trim().endsWith('>')) {
                headers["Content-Type"] = "application/xml";
              } else if (body.trim().startsWith('<') && body.trim().endsWith('>')) {
                headers["Content-Type"] = "text/html";
              } else if (body.trim().startsWith('---') || body.trim().includes(':')) {
                headers["Content-Type"] = "application/x-yaml";
              } else {
                headers["Content-Type"] = "text/plain";
              }
            }
            headersTextarea.value = JSON.stringify(headers, null, 2);
            validateInput(bodyTextarea);
          });

          headersTextarea.addEventListener('input', () => {
            validateInput(headersTextarea);
          });

          form.addEventListener('input', () => {
            const status = form.status.value;
            const body = form.body.value;
            const headers = form.headers.value;
            const delay = form.delay.value;

            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (body) {
              params.append('body', body);
            }
            if (headers) params.append('headers', headers);
            if (delay) params.append('delay', delay);

            dynamicUrl.textContent = \`\${baseUrl}/?\${params.toString()}\`;
          });

          function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
              document.execCommand('copy');
            } catch (err) {
              console.error('Could not copy text: ', err);
            }
            document.body.removeChild(textarea);
          }

          copyButton.addEventListener('click', () => {
            copyToClipboard(dynamicUrl.innerText);
          });
        });
        `}}></script>
    </div>
  );
}

function ErrorHelp({ error, category, method, args }: { error: Error, category: string, method: string, args: any[] }) {
  return (
    <div id="error">
      <h1>Method {category}.{method} failed:</h1>
      <p>{error}</p>
      <p>Faker docs: <a href={`https://fakerjs.dev/api/${category}.html#${method}`}>https://fakerjs.dev/api/{category}.html#{method}</a></p>
      <h2>Arguments:</h2>
      <pre>{JSON.stringify(args, null, 2)}</pre>
    </div >
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
