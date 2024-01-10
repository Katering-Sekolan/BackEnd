const fs = require("fs");
const PDFDocument = require("pdfkit");



async function createInvoice(invoiceData) {
    try {
        await fs.promises.mkdir('./temp', { recursive: true });

        const invoice = invoiceData.invoiceData[0];
        const fileName = `invoice_${Date.now()}.pdf`;
        const filePath = `./temp/${fileName}`;

        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        return new Promise((resolve, reject) => {
            writeStream.on('error', (error) => {
                console.error(error);
                reject(error);
            });

            writeStream.on('finish', () => {
                console.log(`PDF created successfully at ${filePath}`);
                resolve(filePath);
            });

            generateHeader(doc);
            generateInvoiceInformation(doc, invoice);
            generateInvoiceTable(doc, invoice);
            generateFooter(doc);

            doc.end();
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}
function generateHeader(doc) {
    doc
        .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("Katering Qita", 110, 57)
        .fontSize(10)
        .text("Sekolah Qaryah Thayyibah Purwokerto", 200, 50, { align: "right" })
        .text("Dusun III, Karangsalam Kidul, Kec. Kedungbanteng,", 200, 65, { align: "right" })
        .text("Banyumas, Jawa Tengah 53152", 200, 80, { align: "right" })
        .moveDown();

    generateHr(doc, 130);
}

function generateInvoiceInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("INVOICE", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)

        .text("Nama", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(": " + invoice.transaksi_pembayaran.tagihan_bulanan.user_tagihan_bulanan.nama, 150, customerInformationTop)
        .font("Helvetica")
        .text("Kelas", 50, customerInformationTop + 15)
        .text(": " + invoice.transaksi_pembayaran.tagihan_bulanan.user_tagihan_bulanan.kelas, 150, customerInformationTop + 15)
        .text("Bulan", 50, customerInformationTop + 30)
        .text(": " + formatDate(new Date(invoice.transaksi_pembayaran.tagihan_bulanan.bulan)), 150, customerInformationTop + 30)
        .text("Status", 50, customerInformationTop + 45)
        .text(": " + invoice.transaksi_pembayaran.status_pembayaran, 150, customerInformationTop + 45)

        .text("Nomor Invoice", 50, customerInformationTop + 60)
        .font("Helvetica-Bold")
        .text(": " + invoice.order_id, 150, customerInformationTop + 60)
        .font("Helvetica")
        .text("Tanggal Invoice", 50, customerInformationTop + 75)
        .text(": " + formatDate(new Date(invoice.tanggal_transaksi)), 150, customerInformationTop + 75)
        .text("Bayar Tunai", 50, customerInformationTop + 90)
        .text(": " +
            formatCurrency(invoice.transaksi_pembayaran.jumlah_pembayaran_cash),
            150,
            customerInformationTop + 90
        )
        .text("Total Pembayaran", 50, customerInformationTop + 105)
        .text(": " +
            formatCurrency(invoice.transaksi_pembayaran.total_pembayaran),
            150,
            customerInformationTop + 105
        )
        .moveDown();

}

function generateInvoiceTable(doc, invoice) {
    const invoiceTableTop = 330;
    generateHr(doc, 320);
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    // Add rows for each item in the invoice
    generateTableRow(
        doc,
        invoiceTableTop + 30,
        "Snack",
        "Makanan Ringan",
        formatCurrency(invoice.transaksi_pembayaran.tagihan_bulanan.total_snack / invoice.transaksi_pembayaran.tagihan_bulanan.jumlah_snack),
        invoice.transaksi_pembayaran.tagihan_bulanan.jumlah_snack,
        formatCurrency(invoice.transaksi_pembayaran.tagihan_bulanan.total_snack)
    );

    generateTableRow(
        doc,
        invoiceTableTop + 60,
        "Makanan",
        "Makan Siang",
        formatCurrency(invoice.transaksi_pembayaran.tagihan_bulanan.total_makanan / invoice.transaksi_pembayaran.tagihan_bulanan.jumlah_makanan),
        invoice.transaksi_pembayaran.tagihan_bulanan.jumlah_makanan,
        formatCurrency(invoice.transaksi_pembayaran.tagihan_bulanan.total_makanan)
    );
    generateHr(doc, invoiceTableTop + 86);

    const totalTagihanPosition = invoiceTableTop + 90;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        totalTagihanPosition,
        "",
        "",
        "Total Tagihan",
        "",
        formatCurrency(invoice.transaksi_pembayaran.tagihan_bulanan.total_tagihan)
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Pembayaran jatuh tempo setiap awal bulan. Terima kasih telah berlangganan katering Qita.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(amount) {
    // Format amount as Rupiah (IDR)
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

// Module export
module.exports = {
    createInvoice
};
