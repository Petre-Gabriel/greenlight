const liveServer = require("live-server");

liveServer.start({
  port: 5500,
  file: "index.html",
  open: false,
  host: "127.0.0.1",
});
