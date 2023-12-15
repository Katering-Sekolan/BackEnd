const client = require("../app");
const { User } = require("../models");

module.exports = {
  sendMessage: async (req, res) => {
    try {
      const { number, message } = req.body;
      const formattedPhone = number + "@c.us";
      client.sendMessage(formattedPhone, message);

      return res.status(200).json({
        status: "success",
        message: `Berhasil mengirim pesan ke nomor hp ${formattedPhone}`,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
