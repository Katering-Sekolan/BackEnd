const { where } = require("sequelize");
const { User, Admin, TagihanBulanan } = require("../models");

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
    const { month } = req.params;

    try {
      const bill = await TagihanBulanan.count(
        where(
          Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%Y-%m"),
          month
        )
      );

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan jumlah tagihan",
        data: bill,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
