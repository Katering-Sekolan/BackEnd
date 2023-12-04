const { User, Deposit } = require("../models");


module.exports = {
  create: async (req, res) => {
    try {
      const { nama, kelas, nomor_hp } = req.body;

      const user = await User.findOne({
        where: {
          nomor_hp,
        },
      });

      if (user) {
        return res.status(409).json({
          status: "failed",
          message: `Pelanggan dengan nomor hp ${nomor_hp} sudah terdaftar`,
        });
      }

      const newUser = await User.create({
        nama,
        kelas,
        nomor_hp,
      });

      const newDeposit = await Deposit.create({
        user_id: newUser.id,
        tanggal_deposit: new Date(),
        jumlah_deposit: 0,
      });

      return res.status(201).json({
        status: "success",
        message: `Berhasil menambah pelanggan baru dengan nama ${nama}`,
        data: newUser,
      });
    } catch (err) {
      console.log(err);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, kelas, nomor_hp } = req.body;

      const cekUser = await User.findOne({
        where: {
          id,
        },
      });

      if (!cekUser) {
        return res.status(404).json({
          status: "failed",
          message: `User dengan id ${id} tidak ditemukan`,
        });
      }

      const user = await User.update(
        {
          nama,
          kelas,
          nomor_hp,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: `Berhasil mengubah data pelanggan dengan nama ${cekUser.nama}`,
        data: user,
      });
    } catch (err) {
      console.log(err);
    }
  },

  deleteOne: async (req, res) => {
    try {
      const { id } = req.params;

      const cekUser = await User.findOne({
        where: {
          id,
        },
      });

      if (!cekUser) {
        return res.status(404).json({
          status: "failed",
          message: `User dengan id ${id} tidak ditemukan`,
        });
      }

      await Deposit.destroy({
        where: {
          user_id: id,
        },
      });

      await User.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        status: "success",
        message: `Berhasil menghapus pelanggan dengan nama ${cekUser.nama}`,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan semua pelanggan",
        data: users,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: `User dengan id ${id} tidak ditemukan`,
        });
      }

      return res.status(200).json({
        status: "success",
        message: `Berhasil mendapatkan user dengan id ${id}`,
        data: user,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
