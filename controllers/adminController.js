const { Admin } = require("../models");
const { JWT_SECRET } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await Admin.findOne({
        where: {
          username,
        },
      });

      if (!admin) {
        return res.status(404).json({
          status: "failed",
          message: "Username tidak ada",
        });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);

      if (!isValidPassword) {
        return res.status(404).json({
          status: "failed",
          message: "Password salah",
        });
      }

      const payload = {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      };

      const token = jwt.sign(payload, JWT_SECRET);

      const data = {
        username: admin.username,
        role: admin.role,
      };

      return res.status(200).send({
        status: true,
        message: `Selamat datang ${admin.username}`,
        data,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },

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
      const { username, password } = req.body;

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

      const passwordLength = password.length;

      if (passwordLength < 6) {
        return res.status(400).json({
          status: "failed",
          message: "Password minimal 6 karakter",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const admin = await Admin.update(
        {
          username,
          password: hashPassword,
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
