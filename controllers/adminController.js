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
        nomor_hp: admin.nomor_hp,
      };

      const token = jwt.sign(payload, JWT_SECRET);

      const data = {
        username: admin.username,
        nomor_hp: admin.nomor_hp,
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
};
