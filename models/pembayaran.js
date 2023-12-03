"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pembayaran.init(
    {
      jumlah_pembayaran: DataTypes.INTEGER,
      status_pembayaran: DataTypes.ENUM("LUNAS", "BELUM LUNAS"),
      tanggal_pembayaran: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Pembayaran",
    }
  );
  return Pembayaran;
};
