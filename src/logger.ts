const { Logger } = require("tslog");

// Create a logger instance
const logger = new Logger();

export function logRequest(handler: Function) {
  return function (req: any, res: any, next: Function) {
    logger.info(`Request to ${req.method} ${req.originalUrl}`);
    handler(req, res, next);
    logger.info(`Response from ${req.method} ${req.originalUrl}`);
  };
}
