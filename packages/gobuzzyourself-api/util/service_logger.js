const path = require('path');
const { createLogger, format, transports } = require('winston');

// set up the logFormats
let logFormat;

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
  // development - more human readable.
  logFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
  );
} else {
  // production, we add timestamps to the json output
  logFormat = format.combine(format.timestamp(), format.json());
}

function logger(serviceName) {
  // Initialize Logger Options
  const options = {
    file: {
      level: 'debug',
      filename: `${path.dirname(require.main.filename)}/logs/${serviceName}.log`,
      handleExceptions: true,
      maxsize: 1024 * 1024 * 100, // 100MB
      maxFiles: 5,
      tailable: true,
      format: logFormat
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      format: logFormat
    }
  };

  // Instantiate Logger
  const myLogger = createLogger({
    transports: [new transports.File(options.file)],
    exitOnError: true // do not exit on handled exceptions
  });

  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  if (process.env.NODE_ENV !== 'production') {
    myLogger.add(new transports.Console(options.console));
  }

  return myLogger;
}

exports.logger = logger;

