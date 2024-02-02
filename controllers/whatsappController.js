const { Client, LocalAuth } = require("whatsapp-web.js");
const { TagihanBulanan, User } = require("../models");
const qrcode = require("qrcode");
const { Sequelize } = require("sequelize");
const { URL_FRONTEND } = process.env;

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-one" }),
  clientId: "client-one",
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
    const { month } = req.params;

    try {
      const tagihan = await TagihanBulanan.findAll({
        attributes: [
          "id",
          "total_tagihan",
          "jumlah_snack",
          "jumlah_makanan",
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
        where: Sequelize.where(
          Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%Y-%m"),
          month
        ),
      });

      for (let i = 0; i < tagihan.length; i++) {
        const {
          total_tagihan,
          bulan,
          jumlah_snack,
          jumlah_makanan,
          user_tagihan_bulanan,
        } = tagihan[i];
        const { id, nomor_hp, nama, kelas } = user_tagihan_bulanan;
        const formattedPhone = nomor_hp + "@c.us";

        // Format total_tagihan with currency IDR
        const formattedTotalTagihan = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(total_tagihan);

        const template = `Assalamu'alaikum Wr. Wb., kami selaku pengurus Katering Sekolah Qaryah Thayyibah Purwokerto, ingin menginformasikan kepada orang tua siswa/siswi terkait tagihan katering pada bulan ini dengan detail sebagai berikut:\nNama: ${nama}\nKelas: ${kelas}\nJumlah Snack: ${jumlah_snack}\nJumlah Makan Siang: ${jumlah_makanan}\nTotal Tagihan: ${formattedTotalTagihan}\n\nTagihan dapat dibayarkan melalui transfer pada link berikut: \n${URL_FRONTEND}/user/bayarTagihan?userId=${id}&month=${bulan}\n Jika bapak/ibu orang tua mengalami kendala dalam pembayaran transfer bisa menghubungi kami lebih lanjut.\n\nTerima kasih atas perhatiannya. Wassalamu'alaikum Wr. Wb.`;
        setTimeout(async () => {
          await client.sendMessage(formattedPhone, template);
        }, i * 500); // Delay each message by i seconds
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
