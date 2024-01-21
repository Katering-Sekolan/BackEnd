const { Sequelize, Op } = require("sequelize");
const { User, Admin, TagihanBulanan, Pembayaran } = require("../models");

module.exports = {
  countUser: async (req, res) => {
    try {
      const user = await User.count();

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan jumlah pelanggan",
        data: user,
      });
    } catch (err) {
      console.log(err);
    }
  },
  countAdmin: async (req, res) => {
    try {
      const admin = await Admin.count();

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan jumlah admin",
        data: admin,
      });
    } catch (err) {
      console.log(err);
    }
  },
  countBill: async (req, res) => {
    try {

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const totalTagihan = await TagihanBulanan.sum("total_tagihan", {
        where: Sequelize.and(
          Sequelize.fn("MONTH", Sequelize.col("bulan")),
          currentMonth
        ),
      });

      return res.status(200).json({
        status: "success",
        message: `Total tagihan bulan ini (${currentMonth}-${currentYear}): ${totalTagihan}`,
        data: totalTagihan,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error.",
      });
    }
  },
  countLunas: async (req, res) => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const countLunasPayments = await Pembayaran.count({
        where: {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn("MONTH", Sequelize.col("tanggal_pembayaran")),
              currentMonth
            ),
            Sequelize.where(
              Sequelize.fn("YEAR", Sequelize.col("tanggal_pembayaran")),
              currentYear
            ),
            { status_pembayaran: "LUNAS" },
          ],
        },
      });

      return res.status(200).json({
        status: "success",
        message: `Total number of payments with status 'LUNAS' for the current month (${currentMonth}-${currentYear}): ${countLunasPayments}`,
        data: countLunasPayments,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error.",
      });
    }
  },
};
