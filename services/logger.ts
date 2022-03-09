import logger, { pretty } from "https://deno.land/x/garn_logger/mod.ts";

logger.setFilter("DEBUG");
logger.use(pretty({ multiline: true }));

export { logger };
export default logger;
