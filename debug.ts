import logger, {
  formatToAnsiColors,
} from "https://deno.land/x/garn_logger@0.0.14/mod.ts";

import { transportToEmail } from "https://deno.land/x/garn_logger@0.0.14/src/middleware/transport_to_email.ts";

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
    debounceTime: 100,
  }),
);

logger.log("hola mundo",Deno.env.get("SMTP_HOST"));
logger.dim("hola mundo", Deno.env.toObject());
logger.error("hola mundo", 'error');
logger.important("hola important");

export { logger };
export default logger;
