import { logger } from "../utils/logger.js";

class LoggerTestController {
  async loggerTest(req, res) {
    logger.info("Logger test process");
    try {
      noExistingFunction();
    } catch (error) {
      logger.info({
        message: error.message,
      });
    }
    res.send({ message: "Finished testing." });
  }
}

export const loggerTestController = new LoggerTestController();
