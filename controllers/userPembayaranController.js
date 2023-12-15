const midtransClient = require('midtrans-client');
const env = require('dotenv').config();

const { SERVER_KEY, CLIENT_KEY } = process.env;

// Create snap API instance
let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: SERVER_KEY,
    clientKey: CLIENT_KEY,
});

module.exports = {
    createTransaction: async (req, res) => {
        try {
            const { id_pembayaran, total_tagihann, jumlah_makanan, jumlah_snack, total_makanan, total_snack, nama, nomor_hp, kelas } = req.body;

            const orderId = `TAGIHAN-${nama}-${id_pembayaran}-${Date.now()}`;
            const totalMakanan = total_makanan / jumlah_makanan;
            const totalSnack = total_snack / jumlah_snack;
            const parameter = {
                "transaction_details": {
                    "order_id": orderId,
                    "gross_amount": total_tagihann
                },
                "credit_card": {
                    "secure": true
                },
                "item_details": [
                    {
                        "id": 1,
                        "price": totalSnack,
                        "quantity": jumlah_snack,
                        "name": "Snack"
                    },
                    {
                        "id": 2,
                        "price": totalMakanan,
                        "quantity": jumlah_makanan,
                        "name": "Makan Siang"
                    }
                ],
                "customer_details": {
                    "first_name": nama,
                    "phone": nomor_hp,
                    "billing_address": {
                        "first_name": nama,
                        "phone": nomor_hp,
                        "address": kelas,
                    },
                    "shipping_address": {
                        "first_name": nama,
                        "phone": nomor_hp,
                        "address": `${kelas}, Sekolah Qita`,
                        "city": "Banyumas",
                        "postal_code": "53152",
                        "country_code": "IDN"
                    }
                },
            };

            const transaction = await snap.createTransaction(parameter);

            const transactionToken = transaction.token;
            console.log('transactionToken:', transactionToken);

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
        let notification = req.body;

        snap.transaction.notification(notification)
            .then((statusResponse) => {
                let orderId = statusResponse.order_id;
                let transactionStatus = statusResponse.transaction_status;
                let fraudStatus = statusResponse.fraud_status;

                console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

                // gimana nich

                res.status(200).json(statusResponse);
            })
            .catch((error) => {
                console.log('Error:', error);
                res.status(500).json(error);
            });
    }
};