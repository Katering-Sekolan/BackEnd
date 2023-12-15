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

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(routes);

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: URL_FRONTEND,
    methods: ["GET", "POST"],
  },
});

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-one" }),
  // clientId: "client-one",
});

module.exports = client;

io.on("connection", (socket) => {
  socket.emit("message", "Connecting...");
  // emitNewQRCode();

  client.on("qr", handleQRCode);

  client.on("disconnected", handleClientDisconnect);

  client.on("authenticated", handleClientAuthentication);

  client.on("ready", handleClientReady);

  client.initialize();
});

// const emitNewQRCode = async () => {
//   const qrCode = await client.generateQR();
//   const qrCodeDataUrl = await qrcode.toDataURL(qrCode);
//   io.emit("qrCode", qrCodeDataUrl);
//   console.log("New QR Code emitted");
// };

const handleQRCode = async (qrCode) => {
  const qrCodeDataUrl = await qrcode.toDataURL(qrCode);
  io.emit("qrCode", qrCodeDataUrl);
  console.log("QR RECEIVED", qrCode);
};

const handleClientDisconnect = (reason) => {
  console.log("Client disconnected:", reason);
  emitNewQRCode();
  client.initialize();
};

const handleClientAuthentication = (session) => {
  io.emit("message", "Authenticated");
  console.log("AUTHENTICATED", session);
};

const handleClientReady = () => {
  io.emit("message", "Connected");
  console.log("Klien WhatsApp Web telah terhubung.");
};

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
