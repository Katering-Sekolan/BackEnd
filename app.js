require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const { PORT, URL_FRONTEND } = process.env;
const socketIO = require("socket.io");
const { Client, LocalAuth } = require("whatsapp-web.js");
const http = require("http");
const qrcode = require("qrcode");
const whatsappController = require("./controllers/whatsappController");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(routes);

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: URL_FRONTEND,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

whatsappController.connection(io);

// module.exports = client;

// app.post("/wa/sendMessage", async (req, res) => {
//   const { number, message } = req.body;
//   const formattedPhone = number + "@c.us";
//   console.log(formattedPhone);
//   console.log(message);
//   try {
//     await client.sendMessage(formattedPhone, message);
//     res.json({ status: true, message: message, msg: "ok" });
//   } catch (error) {
//     console.error("Kesalahan pengiriman pesan:", error);
//     res.status(500).json({ error: "Kesalahan pengiriman pesan", msg: "error" });
//   }
// });

// Home route
app.get("/", (req, res) => {
  return res.send("Hello welcome to our API, WS Team");
});

// Error handling 400
app.use((_req, res) => {
  return res.status(404).json({
    status: false,
    message: "Are you lost?",
  });
});

// Eror handling 500
app.use((err, _req, res) => {
  return res.status(500).json({
    status: false,
    message: "Internal server error " + err.message,
    data: null,
  });
});

server.listen(PORT, () => {
  return console.log(`Server running on http://localhost:${PORT}`);
});
