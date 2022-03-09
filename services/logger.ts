import logger, { formatToAnsiColors } from "https://deno.land/x/garn_logger@0.0.11/mod.ts";

logger.setFilter(Deno.env.get("LOG_LEVEL") || "DEBUG");
logger.use(formatToAnsiColors({ multiline: false }));

export { logger };
export default logger;
