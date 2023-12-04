const { Deposit, User } = require("../models");
const { sequelize } = require("../models");

module.exports = {
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, tanggal_deposit, jumlah_deposit } = req.body;

      const cekDeposit = await Deposit.findOne({
        where: {
          id,
        },
      });

      if (!cekDeposit) {
        return res.status(404).json({
          status: "failed",
          message: `Deposit tidak ditemukan`,
        });
      }

      const deposit = await Deposit.update(
        {
          tanggal_deposit,
          jumlah_deposit,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: "Berhasil data mengubah deposit",
        data: {
          deposit,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const deposits = await Deposit.findAll({
        attributes: [
          "id",
          "jumlah_deposit",
          [
            sequelize.literal(
              'DATE_FORMAT(`tanggal_deposit`, "%d %M %Y")'
            ),
            'f_tanggal_deposit'
          ],
        ],
        include: {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan data semua deposit",
        data: deposits,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: "Terjadi kesalahan internal.",
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const deposit = await Deposit.findOne({
        where: {
          id,
        },
        attributes: [
          "id",
          "jumlah_deposit",
          "tanggal_deposit",
        ],
        exclude: ["user_id", "createdAt", "updatedAt"],
        include: {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      });

      if (!deposit) {
        return res.status(404).json({
          status: "failed",
          message: `Deposit dengan id ${id} tidak ditemukan`,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan deposit",
        data: deposit,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
