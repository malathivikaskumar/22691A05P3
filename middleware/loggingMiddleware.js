const fs = require('fs');
const path = require('path');
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
 fs.mkdirSync(logDir);
}
const logFile = path.join(logDir, 'server.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });
function formatLog(stack, level, pkg, message) {
 return `Log(${stack}, ${level}, ${pkg}, ${message})\n`;
}
const baseURL = 'http://20.244.56.144/evaluation-service'
let token = '';
async function getToken() {
 const authBody = {
    "email": "22691a05p3@mits.ac.in",
    "name": "vikas kumar malathi",
    "rollNo": "22691a05p3",
    "accessCode": "caVvNH",
    "clientID": "f3954825-5758-436a-ba42-8319090874a8",
    "clientSecret": "QHzgqARTFcQtEpGf"
};
 const response = await axios.post(`${baseURL}/auth`, authBody);
 token = response.data.access_token;
}
function loggingMiddleware(req, res, next) {
 const start = new Date();
 const stack = "url-shortener";
 const level = "DEBUG";
 const pkg = "middleware";
 res.on('finish', async () => {
  const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${req.ip} @ ${start.toISOString()}`;
  const logEntry = formatLog(stack, level, pkg, message);
  logStream.write(logEntry);
   if (!token) await getToken();
  const url = `${baseURL}/logs`;
  const body = {
   "stack" : stack,
   "level" : level,
   "package" :pkg,
   "message" : "Successfully sent response"
  }
  const response = await axios.post(url, body , {
   headers: {
    Authorization: `Bearer ${token}`
   }
  });
  console.log(response);
 });
 next();
}

module.exports = loggingMiddleware;

