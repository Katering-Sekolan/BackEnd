// const client = require("../app");
// const { User } = require("../models");
// const io = require("../app");

// module.exports = {
// 	sendMessage: async (req, res) => {
// 		const { number, message } = req.body;
// 		const formattedPhone = number + "@c.us";
// 		console.log(formattedPhone);
// 		console.log(message);
// 		try {
// 			await client.sendMessage(formattedPhone, message);

// 			return res.status(200).json({
// 				status: "success",
// 				message: `Berhasil mengirim pesan ke nomor hp ${formattedPhone}`,
// 			});
// 		} catch (err) {
// 			console.log(err);
// 		}
// 	},
// };