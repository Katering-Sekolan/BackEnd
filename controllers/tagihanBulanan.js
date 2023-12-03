const { TagihanBulanan, Harga } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { user_id, bulan, efektif_snack, efektif_makanSiang } = req.body;

      const hargaSnack = await Harga.findOne({
        where: {
          jenis: "SNACK",
        },
      });

      const hargaMakanSiang = await Harga.findOne({
        where: {
          jenis: "MAKAN SIANG",
        },
      });

      const totalSnack = hargaSnack.harga * efektif_snack;
      const totalMakanSiang = hargaMakanSiang.harga * efektif_makanSiang;
      const total = totalSnack + totalMakanSiang;

      const newTagihanBulanan = await TagihanBulanan.create({
        user_id,
        bulan,
        total_tagihan: total,
      });

      return res.code(201).json({
        status: "success",
        message: `Berhasil menambahkan tagihan bulanan`,
        data: newTagihanBulanan,
      });
    } catch (err) {
      console.log(err);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, bulan, efektif_snack, efektif_makanSiang } = req.body;

      const cekTagihanBulanan = await TagihanBulanan.findOne({
        where: {
          id,
        },
      });

      if (!cekTagihanBulanan) {
        return res.status(404).json({
          status: "failed",
          message: `Tagihan bulanan tidak ditemukan`,
        });
      }

      const hargaSnack = await Harga.findOne({
        where: {
          jenis: "SNACK",
        },
      });

      const hargaMakanSiang = await Harga.findOne({
        where: {
          jenis: "MAKAN SIANG",
        },
      });

      const totalSnack = hargaSnack.harga * efektif_snack;
      const totalMakanSiang = hargaMakanSiang.harga * efektif_makanSiang;
      const total = totalSnack + totalMakanSiang;

      const tagihanBulanan = await TagihanBulanan.update(
        {
          user_id,
          bulan,
          total_tagihan: total,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: "Berhasil data mengubah tagihan bulanan",
        data: {
          tagihanBulanan,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const tagihanBulanans = await TagihanBulanan.findAll({
        attributes: [
          "id",
          "total_tagihan",
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("bulan"), "%m-%Y"),
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

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan data tagihan bulanan",
        data: tagihanBulanans,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const tagihanBulanan = await TagihanBulanan.findOne({
        where: {
          id,
        },
        attributes: [
          "id",
          "total_tagihan",
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("bulan"), "%m-%Y"),
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

      return res.status(200).json({
        status: "success",
        message: `Berhasil mendapatkan data tagihan bulanan dengan id ${id}`,
        data: tagihanBulanan,
      });
    } catch (err) {
      console.log(err);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const cekTagihanBulanan = await TagihanBulanan.findOne({
        where: {
          id,
        },
      });

      if (!cekTagihanBulanan) {
        return res.status(404).json({
          status: "failed",
          message: `Tagihan bulanan tidak ditemukan`,
        });
      }

      await TagihanBulanan.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        status: "success",
        message: `Berhasil menghapus tagihan bulanan`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
