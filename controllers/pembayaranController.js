const { Pembayaran, TagihanBulanan, User } = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { jumlah_pembayaran, status_pembayaran, tanggal_pembayaran } = req.body;

      const cekPembayaran = await Pembayaran.findOne({
        where: {
          id,
        },
      });

      if (!cekPembayaran) {
        return res.status(404).json({
          status: "failed",
          message: `Pembayaran tidak ditemukan`,
        });
      }

      const updatedPembayaran = await Pembayaran.update(
        {
          jumlah_pembayaran,
          status_pembayaran,
          tanggal_pembayaran,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: "Berhasil memperbaharui data pembayaran",
        data: updatedPembayaran,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  },

  getByUserIdBulan: async (req, res) => {
    try {
      const { id, month } = req.params;

      if (!month) {
        return res.status(400).json({
          status: "error",
          message: "Month parameter is missing.",
        });
      }

      const bulanRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!month.match(bulanRegex)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid month format. Please use 'YYYY-MM' format.",
        });
      }

      const tagihanBulanan = await TagihanBulanan.findAll({
        where: {
          user_id: id,
        },
        include: [
          {
            model: User,
            as: "user_tagihan_bulanan",
            attributes: ["nama", "kelas", "nomor_hp"],
          },
        ],
      });

      const tagihanBulananIds = tagihanBulanan.map((tagihan) => tagihan.id);

      const pembayaran = await Pembayaran.findAll({
        where: {
          tagihanBulanan_id: tagihanBulananIds,
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
            where: Sequelize.where(
              Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%Y-%m"),
              month
            ),
          },
        ],
        attributes: {
          exclude: ["tagihanBulanan_id", "createdAt", "updatedAt"],
        },
      });
      return res.status(200).json(pembayaran);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  },

  getByUserId: async (req, res) => {
    try {
      const { id } = req.params;

      const tagihanBulanan = await TagihanBulanan.findAll({
        where: {
          user_id: id,
        },
        include: [
          {
            model: User,
            as: "user_tagihan_bulanan",
            attributes: ["nama", "kelas", "nomor_hp"],
          },
        ],
      });

      const tagihanBulananIds = tagihanBulanan.map((tagihan) => tagihan.id);

      const pembayaran = await Pembayaran.findAll({
        where: {
          tagihanBulanan_id: tagihanBulananIds,
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
        attributes: {
          exclude: ["tagihanBulanan_id", "createdAt", "updatedAt"],
        },
      });

      // const formattedResponse = {
      //   status: "success",
      //   message: "Berhasil mendapatkan data pembayaran",
      //   data: {
      //     pembayaran: pembayaran.map((item) => ({
      //       id: item.id,
      //       jumlah_pembayaran: item.jumlah_pembayaran,
      //       status_pembayaran: item.status_pembayaran,
      //       tanggal_pembayaran: item.tanggal_pembayaran,
      //       tagihan_bulanan: {
      //         id: item.tagihan_bulanan.id,
      //         user_id: item.tagihan_bulanan.user_id,
      //         nama: item.tagihan_bulanan.user_tagihan_bulanan.nama,
      //         kelas: item.tagihan_bulanan.user_tagihan_bulanan.kelas,
      //         nomor_hp: item.tagihan_bulanan.user_tagihan_bulanan.nomor_hp,
      //         total_tagihan: item.tagihan_bulanan.total_tagihan,
      //         bulan: item.tagihan_bulanan.bulan,
      //       },
      //     })),
      //   },
      // };

      return res.status(200).json(pembayaran);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const pembayaran = await Pembayaran.findAll({
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
        attributes: {
          exclude: ["tagihanBulanan_id", "createdAt", "updatedAt"],
        },
      });

      // const formattedResponse = {
      //   status: "success",
      //   message: "Berhasil mendapatkan semua data pembayaran",
      //   data: {
      //     pembayaran: pembayaran.map((item) => ({
      //       id: item.id,
      //       jumlah_pembayaran: item.jumlah_pembayaran,
      //       status_pembayaran: item.status_pembayaran,
      //       tanggal_pembayaran: item.tanggal_pembayaran,
      //       tagihan_bulanan: {
      //         id: item.tagihan_bulanan.id,
      //         user_id: item.tagihan_bulanan.user_id,
      //         nama: item.tagihan_bulanan.user_tagihan_bulanan.nama,
      //         kelas: item.tagihan_bulanan.user_tagihan_bulanan.kelas,
      //         nomor_hp: item.tagihan_bulanan.user_tagihan_bulanan.nomor_hp,
      //         jumlah_snack: item.tagihan_bulanan.jumlah_snack,
      //         jumlah_makanan: item.tagihan_bulanan.jumlah_makanan,
      //         total_tagihan: item.tagihan_bulanan.total_tagihan,
      //         bulan: item.tagihan_bulanan.bulan,
      //       },
      //     })),
      //   },
      // };

      return res.status(200).json(pembayaran);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  },

  getByMonth: async (req, res) => {
    try {
      const { month } = req.params;

      if (!month) {
        return res.status(400).json({
          status: "error",
          message: "Month parameter is missing.",
        });
      }

      const bulanRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!month.match(bulanRegex)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid month format. Please use 'YYYY-MM' format.",
        });
      }

      const pembayaran = await Pembayaran.findAll({
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
            where: Sequelize.where(
              Sequelize.fn("DATE_FORMAT", Sequelize.col("bulan"), "%Y-%m"),
              month
            ),
          },
        ],
        attributes: {
          exclude: ["tagihanBulanan_id", "createdAt", "updatedAt"],
        },
      });

      return res.status(200).json(pembayaran);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  }

};
