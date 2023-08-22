import { prodLogger, devLogger } from "../utils/logger.js";

class LoggerTestController {
  async prodLoggerTest(req, res) {
    prodLogger.info("Production logger test process");
    try {
      noExistingFunction();
    } catch (error) {
      prodLogger.info({
        message: error.message,
      });
    }
    res.send({ message: "Finished testing." });
  }

  async devLoggerTest(req, res) {
    devLogger.debug("Development logger test process");
    try {
      noExistingFunction();
    } catch (error) {
      devLogger.debug({
        message: error.message,
      });
    }
    res.send({ message: "Finished testing." });
  }
}

export const loggerTestController = new LoggerTestController();
