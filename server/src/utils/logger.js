const { createLogger, format, transports } = require('winston')

const loggerFormat = format.combine(
  format.colorize(),
  format.simple()
)

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: loggerFormat,
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.Console({ level: process.env.LOG_LEVEL })
  ]
})

export default logger
