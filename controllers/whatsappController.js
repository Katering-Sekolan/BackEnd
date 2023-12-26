const { Client, LocalAuth } = require("whatsapp-web.js");
const { TagihanBulanan, User } = require("../models");
const qrcode = require("qrcode");
const { Sequelize } = require("sequelize");
const { URL_FRONTEND } = process.env;

const client = new Client({
  puppeteer: {
    headless: true,
  },
  authStrategy: new LocalAuth({ clientId: "client-one" }),
});

module.exports = {
  connection: (io) => {
    io.on("connection", function (socket) {
      socket.emit("message", "Connecting...");

      client.on("qr", async (qrCode) => {
        const qrCodeDataUrl = await qrcode.toDataURL(qrCode);
        io.emit("qrCode", qrCodeDataUrl);
        console.log("QR RECEIVED", qrCode);
      });

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
  },
  broadcastBill: async (req, res) => {
    try {
      const tagihan = await TagihanBulanan.findAll({
        attributes: [
          "id",
          "total_tagihan",
          [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%Y-%m"),
            "bulan",
          ],
        ],
        exclude: ["user_id", "createdAt", "updatedAt"],
        include: {
          model: User,
          as: "user_tagihan_bulanan",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      });

      for (let i = 0; i < tagihan.length; i++) {
        const { total_tagihan, bulan, user_tagihan_bulanan } = tagihan[i];
        const { id, nomor_hp, nama, kelas } = user_tagihan_bulanan;
        const formattedPhone = nomor_hp + "@c.us";
        const template = `Hallo, kami dari pengurus Katering Sekolah Qaryah Thayyibah Purwokerto akan memberitahukan kepada orang tua siswa/siswi dari:\nNama: ${nama}\nKelas: ${kelas}\n\nTerkait dengan tagihan katering bulan ini adalah total Rp. ${total_tagihan} dan dapat dibayarkan pada link berikut: \n${URL_FRONTEND}/user/bayarTagihan?userId=${id}&month=${bulan}\n\n Terima kasih`;

        setTimeout(async () => {
          await client.sendMessage(formattedPhone, template);
        }, i * 1000); // Delay each message by i seconds
      }

      return res.status(200).json({
        status: "success",
        message: "Berhasil mengirim pesan broadcast ke orang tua siswa/siswi",
      });
    } catch (err) {
      console.log(err);
    }
  },
  messageIfPaid: async (nama, kelas, nomor_hp) => {
    try {
      const formattedPhone = nomor_hp + "@c.us";
      const pesan = `Halo orang tua dari ${nama}, kelas ${kelas}, pembayaran anda sudah kami terima. Terima kasih sudah membayar tagihan katering pada bulan ini.`;
      await client.sendMessage(formattedPhone, pesan);
    } catch (err) {
      console.log(err);
    }
  },
  logOut: async (req, res) => {
    try {
      await client.logout();
      return res.status(200).json({
        status: "success",
        message: "Berhasil logout dari whatsapp",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
