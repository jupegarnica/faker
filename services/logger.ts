import logger, {
  formatToAnsiColors,
} from "https://deno.land/x/garn_logger@0.0.11/mod.ts";

import { transportToEmail } from "https://deno.land/x/garn_logger@0.0.13/src/middleware/transport_to_email.ts";
logger.setFilter(
  Deno.env.get("LOG_LEVEL") || "DEBUG",
);
logger.use(
  formatToAnsiColors({
    multiline: false,
  }),
  transportToEmail({
    hostname:
      Deno.env.get("SMTP_HOST") || "",
    port: Deno.env.get("SMTP_PORT") ||
      "",
    user: Deno.env.get("SMTP_USER"),
    password: Deno.env.get("SMTP_PASS"),
  }),
);

export { logger };
export default logger;
