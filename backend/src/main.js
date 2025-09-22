import { web } from "./applications/web.js"
import { logger } from "./applications/logging.js"

web.listen(3000, () => {
    logger.info("App start");
});
