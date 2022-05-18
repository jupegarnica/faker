import logger, {
  formatToAnsiColors,
} from "https://deno.land/x/garn_logger@0.0.21/mod.ts";

import { transportToEmail } from "https://deno.land/x/garn_logger@0.0.16/src/middleware/transport_to_email.ts";

logger.setFilter(
  Deno.env.get("LOG_LEVEL") || "DEBUG",
);
const options = {
  hostname: Deno.env.get("SMTP_HOST") || "localhost",
  port: Deno.env.get("SMTP_PORT") || "1025",
  username: Deno.env.get("SMTP_USER"),
  password: Deno.env.get("SMTP_PASS"),
  to: Deno.env.get("SMTP_TO") || "",
  from: Deno.env.get("SMTP_FROM") || "",
  logLevel: Deno.env.get("EMAIL_LOG_LEVEL") || "CRITICAL",
  debounceTime: 3000,
  subject: "FAKER LOGS",
};

logger.use(
  formatToAnsiColors({
    multiline: false,
  }),
  transportToEmail(options),
);

export { logger };
export default logger;
