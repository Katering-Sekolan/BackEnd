const { Harga } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { harga, jenis } = req.body;

      const newJenis = await Harga.create({
        harga,
        jenis,
      });

      return res.status(200).json({
        status: "success",
        message: `Berhasil menambahkan jenis katering`,
        data: newJenis,
      });
    } catch (err) {
      console.log(err);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { harga, jenis } = req.body;

      const cekJenis = await Harga.findOne({
        where: {
          id,
        },
      });

      if (!cekJenis) {
        return res.status(404).json({
          status: "failed",
          message: `Jenis tidak ditemukan`,
        });
      }

      const jenisBaru = await Harga.update(
        {
          harga,
          jenis,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: "Berhasil data mengubah jenis katering",
        data: {
          jenisBaru,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const jenis = await Harga.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan data jenis katering",
        data: jenis,
      });
    } catch (err) {
      console.log(err);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const cekJenis = await Harga.findOne({
        where: {
          id,
        },
      });

      if (!cekJenis) {
        return res.status(404).json({
          status: "failed",
          message: `Jenis dengan id ${id} tidak ditemukan`,
        });
      }

      await Harga.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        status: "success",
        message: `Berhasil menghapus jenis katering dengan id ${id}`,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      const jenis = await Harga.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (!jenis) {
        return res.status(404).json({
          status: "failed",
          message: `Jenis dengan id ${id} tidak ditemukan`,
        });
      }

      return res.status(200).json({
        status: "success",
        message: `Berhasil mendapatkan data jenis dengan id ${id}`,
        data: jenis,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
