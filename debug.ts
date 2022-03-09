// import { faker } from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";
import { faker } from "https://cdn.skypack.dev/@faker-js/faker";
import console from "./services/logger.ts";

// const allMethods = new Map();
const skipNamespaces = [
  "definitions",
  "locale",
  "locales",
  "localeFallback",
];
const namespaces = [];
for (const namespace in faker) {
  if (skipNamespaces.includes(namespace)) continue;
  namespaces.push(namespace);
  // for (const method in faker[namespace]) {
  //   if (typeof faker[namespace][method] !== "function") continue;
  //   const otherNamespace = allMethods.get(method);
  //   if (
  //     otherNamespace
  //   ) {
  //     console.error(namespace, method, "repeated at", otherNamespace);
  //     console.new(faker[namespace][method]());
  //     console.older(faker[otherNamespace][method]());
  //     // confirm();
  //     console.count("");
  //   }
  //   allMethods.set(method, namespace);
  // }
}

console.log(JSON.stringify(namespaces, null, 2));
