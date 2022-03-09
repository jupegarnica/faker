import logger, { pretty } from "https://deno.land/x/garn_logger/mod.ts";

logger.setFilter(Deno.env.get('LOG_LEVEL') || 'DEBUG');
logger.use(pretty({ multiline: false }));

export { logger };
export default logger;
