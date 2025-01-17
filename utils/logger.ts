import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize } = format;

/*
Example usage of different log levels
Info level for general application information
logger.info("This is an info message");

Error level for application errors and exceptions
logger.error("This is an error message");

Warning level for potentially problematic situations
logger.warn("This is a warning message"); 

Debug level for detailed debugging information
logger.debug("This is a debug message");
*/

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

export default logger;
