const midtransClient = require("midtrans-client");
const { Transaksi, Pembayaran } = require("../models");
const crypto = require("crypto");
const whatsappController = require("./whatsappController");

const { SERVER_KEY, CLIENT_KEY } = process.env;

// Create snap API instance
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: SERVER_KEY,
  clientKey: CLIENT_KEY,
});

module.exports = {
  createTransaction: async (req, res) => {
    try {
      const {
        id_pembayaran,
        total_tagihann,
        jumlah_makanan,
        jumlah_snack,
        total_makanan,
        total_snack,
        nama,
        nomor_hp,
        kelas,
      } = req.body;

      const orderId = `TAGIHAN-${nama}-${id_pembayaran}-${Date.now()}`;
      const totalMakanan = total_makanan / jumlah_makanan;
      const totalSnack = total_snack / jumlah_snack;
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: total_tagihann,
        },
        credit_card: {
          secure: true,
        },
        item_details: [
          {
            id: 1,
            price: totalSnack,
            quantity: jumlah_snack,
            name: "Snack",
          },
          {
            id: 2,
            price: totalMakanan,
            quantity: jumlah_makanan,
            name: "Makan Siang",
          },
        ],
        customer_details: {
          first_name: nama,
          phone: nomor_hp,
          billing_address: {
            first_name: nama,
            phone: nomor_hp,
            address: kelas,
          },
          shipping_address: {
            first_name: nama,
            phone: nomor_hp,
            address: `${kelas}, Sekolah Qita`,
            city: "Banyumas",
            postal_code: "53152",
            country_code: "IDN",
          },
        },
      };

      const transaction = await snap.createTransaction(parameter);

      const transactionToken = transaction.token;

      await Transaksi.create({
        pembayaran_id: id_pembayaran,
        order_id: orderId,
        snap_token: transactionToken,
        tanggal_transaksi: new Date(),
        status_transaksi: "MENUNGGU PEMBAYARAN",
      });

      console.log("transactionToken:", transactionToken);

      return res.status(201).json({
        status: "success",
        message: "Berhasil membuat transaksi",
        token: transactionToken,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  },

  notificationHandler: async (req, res) => {
    try {
      const {
        order_id,
        transaction_status,
        status_code,
        gross_amount,
        signature_key,
      } = req.body;
      const orderId = order_id;
      const transactionStatus = transaction_status;

      const expectedSignature = crypto
        .createHash("sha512")
        .update(order_id + status_code + gross_amount + SERVER_KEY)
        .digest("hex");
      // console.log('orderId:', orderId);
      // console.log('transactionStatus:', transactionStatus);
      // console.log('signature_key:', signature_key);
      // console.log('expectedSignature:', expectedSignature);

      if (signature_key !== expectedSignature) {
        console.error("Invalid Signature");
        return res.status(400).json({
          status: "error",
          message: "Invalid Signature",
        });
      }

      // console.log('Received notification: ' + transactionStatus + ' for order: ' + orderId);

      let mappedStatus;
      switch (transactionStatus) {
        case "capture":
          mappedStatus = "PEMBAYARAN DIREKONFIRMASI";
          break;
        case "settlement":
          mappedStatus = "PEMBAYARAN BERHASIL";
          break;
        case "deny":
          mappedStatus = "PEMBAYARAN DITOLAK";
          break;
        case "cancel":
          mappedStatus = "PEMBAYARAN DIBATALKAN";
          break;
        case "expire":
          mappedStatus = "PEMBAYARAN EXPIRED";
          break;
        case "failure":
          mappedStatus = "PEMBAYARAN GAGAL";
          break;
        case "pending":
          mappedStatus = "PEMBAYARAN MENUNGGU KONFIRMASI";
          break;
        default:
          mappedStatus = "MENUNGGU PEMBAYARAN";
          break;
      }

      await Transaksi.update(
        { status_transaksi: mappedStatus },
        { where: { order_id: orderId } }
      );
      const transaksi = await Transaksi.findOne({
        where: { order_id: orderId },
      });

      if (mappedStatus === "PEMBAYARAN BERHASIL") {
        await Pembayaran.update(
          { status_pembayaran: "LUNAS" },
          { where: { id: transaksi.pembayaran_id } }
        );
        whatsappController.messageIfPaid(transaksi.pembayaran_id);
      }
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  },
};
