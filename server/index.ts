const express = require("express");
const next = require("next");
const route = require("./routes");
const compression = require("compression");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const server = express();
const handle = route.getRequestHandler(app);

app
  .prepare()
  .then(() => {
    server.use(compression());
    server.get("*", (req, res) => handle(req, res));
    server.listen(process.env.PORT || 3000);
    console.log("Server Running");
  })

  .catch(e => {
    console.log(e.message); // "oh, no!"
  });
