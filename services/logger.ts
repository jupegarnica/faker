import logger, { pretty } from "https://deno.land/x/garn_logger/mod.ts";

logger.setFilter("debug");
logger.use(pretty({ multiline: false }));

export { logger };
export default logger;
