import winston from "winston";

export const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "./errors.log",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

export const devLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `[${info.timestamp}] ${info.level}: ${info.message}`;
        })
      ),
    }),
  ],
});
