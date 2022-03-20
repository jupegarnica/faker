import logger, {
  formatToAnsiColors,
} from "https://deno.land/x/garn_logger@0.0.16/mod.ts";

import { transportToEmail } from "https://deno.land/x/garn_logger@0.0.16/src/middleware/transport_to_email.ts";

logger.setFilter(
  Deno.env.get("LOG_LEVEL") || "DEBUG",
);

logger.use(
  formatToAnsiColors({
    multiline: false,
  }),
  transportToEmail({
    hostname: Deno.env.get("SMTP_HOST") || "localhost",
    port: Deno.env.get("SMTP_PORT") || "2525",
    username: Deno.env.get("SMTP_USER"),
    password: Deno.env.get("SMTP_PASS"),
    to: Deno.env.get("SMTP_TO") || "",
    from: Deno.env.get("SMTP_FROM") || "",
    logLevel: Deno.env.get("EMAIL_LOG_LEVEL") || "CRITICAL",
    debounceTime: 3000,
    subject: "FAKER LOGS",
  }),
);

export { logger };
export default logger;
