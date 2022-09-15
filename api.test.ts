import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertMatch,
  assertStringIncludes,
} from "https://deno.land/std@0.155.0/testing/asserts.ts";
// import "./server.ts";
const BASE_URL = "http://localhost:8000";

Deno.test({
  name: "base path should respond with the readme",
  fn: async () => {
    const response = await fetch(BASE_URL + "/");
    const body = await response.text();
    assertEquals(response.status, 200);

    assertStringIncludes(body, `content="faker js api rest"`);
    assertEquals(
      response.headers.get("content-type"),
      "text/html; charset=utf-8",
    );
  },
});

Deno.test({
  name: "should mirror body and headers on /pong",
  only: false,
  fn: async () => {
    const body = JSON.stringify({ a: 1 });
    const response = await fetch(BASE_URL + "/pong", {
      method: "POST",
      headers: {
        "x-test": "test",
      },
      body,
    });
    const _body = await response.text();
    assertEquals(response.status, 200);
    assertEquals(_body, body);
    assertEquals(response.headers.get("x-test"), "test");
  },
});

Deno.test({
  // only:true,
  name: "should respond with status specified",
  fn: async () => {
    const response = await fetch(BASE_URL + "/?status=201");
    await response.text();
    assertEquals(response.status, 201);
    // assertEquals(body, "");
  },
});

Deno.test({
  name: "shouldn't matter method",
  fn: async () => {
    const response = await fetch(BASE_URL + "/?status=201", { method: "PATH" });
    await response.text();
    assertEquals(response.status, 201);
    // assertEquals(body, "");
  },
});
Deno.test({
  // only: true,
  name: "should fail if the status is out of range [200, 599]",
  fn: async () => {
    const response = await fetch(BASE_URL + "/?status=601");
    const body = await response.text();
    assertEquals(response.status, 400);
    assertStringIncludes(
      body,
      "[200, 599]",
    );
  },
});
Deno.test({
  name: "should respond with body specified",
  fn: async () => {
    const response = await fetch(BASE_URL + "/?body=hello%20world");
    const body = await response.text();
    assertEquals(response.status, 200);
    assertEquals(body, "hello world");
    assertEquals(
      response.headers.get("content-type"),
      "text/plain;charset=UTF-8",
    );
  },
});
Deno.test({
  name: "should respond with headers specified",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/?headers={"x-hello":"world"}`,
    );
    await response.text();
    assertEquals(response.headers.get("x-hello"), "world");
  },
});

Deno.test({
  name: "should respond with json body",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/?body={"a":1}&headers={"content-type":"application/json"}`,
    );
    const body = await response.json();
    assertEquals(response.status, 200);
    assertEquals(body, { a: 1 });
    assertEquals(response.headers.get("content-type"), "application/json");
  },
});

Deno.test({
  name: "response should be delayed at least the delay",
  fn: async () => {
    const delay = 100;
    const start = Date.now();
    const response = await fetch(
      BASE_URL + `/?delay=${delay}`,
    );
    const duration = Date.now() - start;
    await response.text();
    assertEquals(response.status, 200);
    assertEquals(duration > delay, true);
  },
});

Deno.test({
  name: "[faker] should find method",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/image/city`,
    );
    const body = await response.json();
    assertEquals(response.status, 200);
    assertEquals(typeof body.data, "string");
  },
});

Deno.test({
  name: "[faker] not found method",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/not/found/method`,
    );
    const body = await response.json();
    assertEquals(response.status, 404);
    assertEquals(body.data, null);
    assertEquals(body.message, "faker.not.found.method() not valid");
  },
});

Deno.test({
  name: "[faker] pass args to method",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/finance/account/3`,
    );
    const body = await response.json();
    assertEquals(response.status, 200);
    assertEquals(body.data.length, 3);
  },
});

// Deno.test({
//   name: "[faker] work userCard",
//   fn: async () => {
//     const response = await fetch(
//       BASE_URL + `/helpers/userCard`,
//     );
//     const body = await response.json();
//     assertEquals(response.status, 200);
//     assertEquals(typeof body.data.address, "object");
//     assertEquals(typeof body.data.address.city, "string");
//     assertEquals(typeof body.data.website, "string");
//   },
// });

Deno.test({
  name: "[faker] docs must work",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/docs/helpers`,
    );
    await response.text();
    assertEquals(response.status, 200);
    // assertEquals(body.length > 5000, true);
  },
});

Deno.test({
  name:
    "[faker] should be able to specify language as a header accept-language",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/name/firstName`,
      { headers: { "accept-language": "pt_BR" } },
    );
    const body = await response.json();
    assertEquals(body.language, "pt_BR");
    assertEquals(!!body.data, true);
  },
});

Deno.test({
  name: "[faker] should decode url argumentes",
  fn: async () => {
    const response = await fetch(
      BASE_URL + `/phone/phoneNumber/${encodeURIComponent("(###) ###-####")}`,
    );
    const body = await response.json();
    assertMatch(body.data, /\(\d{3}\) \d{3}-\d{4}/);
  },
});

Deno.test({
  name: "[faker] should decode url argumentes as object",
  fn: async () => {
    // faker.helpers.mustache('{{foo}} was {{baz}}', {foo: 'bar', baz: 42}); // bar was 42

    const response = await fetch(
      BASE_URL +
        `/helpers/mustache/${encodeURIComponent("{{foo}} was {{baz}}")}/${
          encodeURIComponent('{"foo": "bar", "baz": 42}')
        }`,
    );
    const body = await response.json();
    assertEquals(body.data, "bar was 42");
  },
});

Deno.test({
  // only:true,
  name: "[faker] should decode url argumentes as array",
  fn: async () => {
    const array = ["bob", "joe", "tim"];
    const response = await fetch(
      BASE_URL +
        `/helpers/shuffle/${encodeURIComponent(JSON.stringify(array))}/`,
    );
    const body = await response.json();
    assertArrayIncludes(array, body.data);
  },
});

Deno.test({
  name: "[faker] git/commitMessage should work ",
  fn: async () => {
    const response = await fetch(
      BASE_URL +
        `/git/commitMessage`,
    );
    const body = await response.json();
    assertEquals(body.data.length > 4, true);
  },
});

Deno.test({
  name: "[faker] should work with and accept-language not valid",
  fn: async () => {
    const response = await fetch(
      BASE_URL +
        `/git/branch`,
      { headers: { "accept-language": "es_ES;q=0.9,en_US;q=0.8,en;q=0.7" } },
    );
    const body = await response.json();
    assertEquals(body.data.length > 2, true);
  },
});

Deno.test({
  name: "[faker] unique should work",
  // only: true,
  // ignore: true,
  fn: async () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const path = BASE_URL +
      `/helpers/unique/datatype/number/{"max":${arr.length},"min":1}`;
    const set = new Set(arr);

    for (let index = 0; index < arr.length; index++) {
      const { data } = await (await fetch(path)).json();
      assert(set.has(data));
      set.delete(data);
    }
  },
});

Deno.test({
  only: true,
  name: "[faker] HELPERS FAKE should work",
  fn: async () => {
    const response = await fetch(
      BASE_URL +
        `/helpers/fake/${
          encodeURIComponent("Good Morning {{name.firstName}}!")
        }`,
    );
    const body = await response.json();
    assertStringIncludes(body.data, "Good Morning ");
  },
});
