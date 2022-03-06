// import { faker } from "https://deno.land/x/deno_faker@v1.0.3/mod.ts";
import { faker } from "https://deno.land/x/deno_faker@v1.0.3/locale/es.ts";
faker.setLocale("es");
console.log(
  // faker.internet.email('juan', 'perez', 'domain.com');
  faker.finance.account(12),
);
