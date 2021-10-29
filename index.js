let app,
  server,
  express = require("express"),
  path = require("path"),
  host = process.env.HOST || "http://localhost",
  port = process.env.PORT || 3000,
  root = path.resolve(__dirname, ".");

const devBuild =
  (process.env.NODE_ENV || "development").trim().toLowerCase() !== "production";

const dist = devBuild ? "/builds/development" : "/dist";

app = express();
/* app.use(function (req, res, next) {
  console.log(req.url);
  next();
}); */
app.use(express.static(root + dist));
server = app.listen(port, serverStarted);

function serverStarted() {
  console.log("Server started", `port: ${port}`, `link: ${host}:${port}`);
}
