const { Admin } = require("../models");
const bcrypt = require("bcrypt");

module.exports = {
  create: async (req, res) => {
    try {
      const { username, password } = req.body;

      const cekAdmin = await Admin.findOne({
        where: {
          username,
        },
      });

      if (cekAdmin) {
        return res.status(400).json({
          status: "failed",
          message: "Username sudah ada",
        });
      }

      const passwordLength = password.length;

      if (passwordLength < 6) {
        return res.status(400).json({
          status: "failed",
          message: "Password minimal 6 karakter",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const admin = await Admin.create({
        username,
        password: hashPassword,
        role: "ADMIN",
      });

      return res.status(200).json({
        status: "success",
        message: `Berhasil menambahkan admin dengan username ${admin.username}`,
        data: admin,
      });
    } catch (err) {
      console.log(err);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { username } = req.body;

      const cekAdmin = await Admin.findOne({
        where: {
          id,
        },
      });

      if (!cekAdmin) {
        return res.status(404).json({
          status: "failed",
          message: `Admin dengan id ${id} tidak ditemukan`,
        });
      }

      const admin = await Admin.update(
        {
          username,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        status: "success",
        message: `Berhasil mengubah data admin dengan username ${cekAdmin.username}`,
        data: {
          admin,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const cekAdmin = await Admin.findOne({
        where: {
          id,
        },
      });

      if (!cekAdmin) {
        return res.status(404).json({
          status: "failed",
          message: `Admin dengan id ${id} tidak ditemukan`,
        });
      }

      await Admin.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        status: "success",
        message: `Berhasil menghapus data admin dengan username ${cekAdmin.username}`,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const admins = await Admin.findAll({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan data semua admin",
        data: admins,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;

      const admin = await Admin.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      if (!admin) {
        return res.status(404).json({
          status: "failed",
          message: `Admin dengan id ${id} tidak ditemukan`,
        });
      }

      return res.status(200).json({
        status: "success",
        message: `Berhasil mendapatkan data admin dengan username ${admin.username}`,
        data: admin,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
