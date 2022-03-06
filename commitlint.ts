import { parse } from "https://deno.land/x/commit/mod.ts";

const text = Deno.args[0] ?? Deno.readTextFileSync("./.git/COMMIT_EDITMSG");

const commit = parse(text);

if (!commit.type) {
  console.error("Invalid type");
  Deno.exit(1);
}
