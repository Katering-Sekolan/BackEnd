const { Client, LocalAuth } = require("whatsapp-web.js");
// const { User } = require("../models");
// const io = require("../app");
const qrcode = require("qrcode");

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "client-one" }),
    // clientId: "client-one",
});

module.exports = {
    connection: (io) => {

        io.on("connection", function (socket) {
            socket.emit("message", "Connecting...");
            // Function to emit a new QR code
            // const emitNewQRCode = async () => {
            // 	const qrCode = await client.generateQR();
            // 	const qrCodeDataUrl = await qrcode.toDataURL(qrCode);
            // 	io.emit("qrCode", qrCodeDataUrl);
            // 	console.log("New QR Code emitted");
            // };

            client.on("qr", async (qrCode) => {
                const qrCodeDataUrl = await qrcode.toDataURL(qrCode);
                io.emit("qrCode", qrCodeDataUrl);
                console.log("QR RECEIVED", qrCode);
            });

            // Listen for disconnected event
            // client.on("disconnected", (reason) => {
            // 	console.log("Client disconnected:", reason);

            // 	// Automatically provide a new QR code after disconnecting
            // 	// emitNewQRCode();

            // 	// Reinitialize the client after disconnecting
            // 	client.initialize();

            // });

            client.on("authenticated", (session) => {
                io.emit("authenticated", "Whatsapp is authenticated!");
                io.emit("message", "Authenticated");
                console.log("AUTHENTICATED", session);
            });

            client.on("ready", () => {
                io.emit("ready", "Whatsapp is ready!");
                io.emit("message", "Connected");
                console.log("Klien WhatsApp Web telah terhubung.");
            });

            client.initialize();

            // module.exports = client;
        });

    },
    sendMessage: async (req, res) => {
        const { number, message } = req.body;
        const formattedPhone = number + "@c.us";
        console.log(formattedPhone);
        console.log(message);
        try {
            await client.sendMessage(formattedPhone, message);

            return res.status(200).json({
                status: "success",
                message: `Berhasil mengirim pesan ke nomor hp ${formattedPhone}`,
            });
        } catch (err) {
            console.log(err);
        }
    }
};