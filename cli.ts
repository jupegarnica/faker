import { opn } from "https://denopkg.com/hashrock/deno-opn/opn.ts";

const args = Deno.args.join(" ");

if (import.meta.main) {
  await opn(args);
}
