const { createInvoice } = require('./createInvoice');
const { Transaksi, Pembayaran, TagihanBulanan, User } = require("../models");
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const generatePdfController = {
    generatePdf: async (req, res) => {
        try {
            const { paymentId } = req.body;

            const transaction = await Transaksi.findOne({
                where: {
                    pembayaran_id: paymentId,
                    status_transaksi: "PEMBAYARAN BERHASIL",
                },
                include: [
                    {
                        model: Pembayaran,
                        as: "transaksi_pembayaran",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                        include: [
                            {
                                model: TagihanBulanan,
                                as: "tagihan_bulanan",
                                attributes: {
                                    exclude: ["createdAt", "updatedAt"],
                                },
                                include: [
                                    {
                                        model: User,
                                        as: "user_tagihan_bulanan",
                                        attributes: ["nama", "kelas", "nomor_hp"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    message: 'Transaction not found or payment unsuccessful.',
                });
            }

            const invoiceData = { "invoiceData": [transaction.toJSON()] };

            const filePath = await createInvoice(invoiceData);

            const pdfContent = fs.readFileSync(filePath);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice_${transaction.id_transaksi}.pdf`);

            res.send(pdfContent);

            try {
                await unlinkAsync(filePath);
            } catch (unlinkError) {
                console.error('Error while unlinking the file:', unlinkError);
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    },
};

module.exports = generatePdfController;
