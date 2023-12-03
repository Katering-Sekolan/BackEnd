const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = {
  register: async (req, res) => {
    try {
      const { nama, password, nomor_hp } = req.body;

      const user = await User.findOne({
        where: {
          nomor_hp,
        },
      });

      if (user) {
        return res.status(409).json({
          status: "failed",
          message: `Akun dengan nomor hp ${nomor_hp} sudah terdaftar`,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        nama,
        password: hashedPassword,
        nomor_hp,
      });

      return res.status(201).json({
        status: "success",
        message: "Berhasil register",
        data: {
          user: {
            nama: newUser.nama,
            nomor_hp: newUser.nomor_hp,
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  },

  login: async (req, res) => {
    try {
      const { nomor_hp, password } = req.body;

      const user = await User.findOne({
        where: {
          nomor_hp,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: `Akun dengan nomor hp ${nomor_hp} tidak ditemukan`,
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(404).json({
          status: "failed",
          message: "Password salah",
        });
      }

      const payload = {
        id: user.id,
        nama: user.nama,
        nomor_hp: user.nomor_hp,
      };

      const token = jwt.sign(payload, JWT_SECRET);

      const data = {
        nama: user.nama,
        nomor_hp: user.nomor_hp,
      };

      return res.status(200).send({
        status: true,
        message: `Hallo ${user.nama}! Kamu Berhasil Login`,
        data,
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan semua user",
        data: {
          users,
        },
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
          exclude: ["password", "createdAt", "updatedAt"],
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
        data: {
          user,
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};
