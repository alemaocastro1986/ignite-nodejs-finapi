const express = require("express");
const routes = require("./routes");

const server = express();

server.use(express.json());
server.use("/api", routes);

server.listen(5000);
