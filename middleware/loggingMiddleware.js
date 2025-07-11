// backend/middleware/loggingMiddleware.js

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'server.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log format: Log(stack, level, package, message)
function formatLog(stack, level, pkg, message) {
  return `Log(${stack}, ${level}, ${pkg}, ${message})\n`;
}

function loggingMiddleware(req, res, next) {
  const start = new Date();
  const stack = "url-shortener";
  const level = "DEBUG";
  const pkg = "middleware";

  res.on('finish', () => {
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${req.ip} @ ${start.toISOString()}`;
    const logEntry = formatLog(stack, level, pkg, message);
    logStream.write(logEntry);
  });

  next();
}

module.exports = loggingMiddleware;