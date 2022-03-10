import logger, {
  formatToAnsiColors,
} from "https://deno.land/x/garn_logger@0.0.13/mod.ts";

import { transportToEmail } from "../garn-logger/src/middleware/transport_to_email.ts";

logger.setFilter(
  Deno.env.get("LOG_LEVEL") || "DEBUG",
);
logger.use(
  formatToAnsiColors({
    multiline: false,
  }),
  transportToEmail({
    hostname: Deno.env.get("SMTP_HOST") || "localhost",
    port: Deno.env.get("SMTP_PORT") || "1025",
    username: Deno.env.get("SMTP_USER"),
    password: Deno.env.get("SMTP_PASS"),
    to: "juan@garn.dev",
    from: "juan@garn.dev",
    logLevel: "DEBUG",
    debounceTime: 3000,
  }),
);

logger.log("hola mundo");

export { logger };
export default logger;
