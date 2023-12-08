const { TagihanBulanan, Harga, User, Pembayaran } = require("../models");
const { Sequelize, Op } = require("sequelize");

module.exports = {
  create: async (req, res) => {
    try {
      const { user_id, tanggal_tagihan, efektif_snack, efektif_makanSiang } =
        req.body;

      // Validate tanggal_tagihan format (assuming 'YYYY-MM' format)
      const bulanRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!tanggal_tagihan.match(bulanRegex)) {
        return res.status(400).json({
          status: "error",
          message:
            "Invalid tanggal_tagihan format. Please use 'YYYY-MM' format.",
        });
      }

      const bulanDate = new Date(tanggal_tagihan);
      const bulanYear = bulanDate.getFullYear();
      const bulanMonth = bulanDate.getMonth() + 1;

      const existingTagihan = await TagihanBulanan.findAll({
        where: {
          user_id: {
            [Op.in]: user_id,
          },
          [Op.and]: [
            Sequelize.literal(`YEAR(bulan) = ${bulanYear}`),
            Sequelize.literal(`MONTH(bulan) = ${bulanMonth}`),
          ],
        },
      });

      if (existingTagihan.length > 0) {
        return res.status(400).json({
          status: "error",
          message: `Tagihan untuk pelanggan tersebut pada bulan yang dipilih sudah ada.`,
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

      const newTagihanBulanans = await Promise.all(
        user_id.map(async (userId) => {
          const newTagihanBulanan = await TagihanBulanan.create({
            user_id: userId,
            bulan: tanggal_tagihan,
            total_tagihan: total,
            jumlah_snack: efektif_snack,
            jumlah_makanan: efektif_makanSiang,
            total_snack: totalSnack,
            total_makanan: totalMakanSiang,
          });

          await Pembayaran.create({
            tagihanBulanan_id: newTagihanBulanan.id,
            jumlah_pembayaran: 0,
            tanggal_pembayaran: new Date(),
            status_pembayaran: "BELUM LUNAS",
          });

          return newTagihanBulanan;
        })
      );
      return res.status(201).json({
        status: "success",
        message: "Berhasil menambahkan tagihan bulanan",
        data: newTagihanBulanans,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
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
          jumlah_snack: efektif_snack,
          jumlah_makanan: efektif_makanSiang,
          total_snack: totalSnack,
          total_makanan: totalMakanSiang,
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
            Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%m-%Y"),
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
            Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%m-%Y"),
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

  getAllByMonth: async (req, res) => {
    try {
      const { month } = req.params;

      // Validate month format (assuming 'YYYY-MM' format)
      const bulanRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!month.match(bulanRegex)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid month format. Please use 'YYYY-MM' format.",
        });
      }

      const tagihanBulanans = await TagihanBulanan.findAll({
        attributes: [
          "id",
          "total_tagihan",
          "jumlah_snack",
          "jumlah_makanan",
          [
            Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%m-%Y"),
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

      return res.status(200).json({
        status: "success",
        message: `Successfully retrieved monthly billing data for ${month}`,
        data: tagihanBulanans,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: "Internal server error.",
      });
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
