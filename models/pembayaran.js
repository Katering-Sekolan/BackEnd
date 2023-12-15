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
      this.belongsTo(models.TagihanBulanan, {
        foreignKey: "tagihanBulanan_id",
        as: "tagihan_bulanan",
      });
      this.hasMany(models.Transaksi, {
        foreignKey: "pembayaran_id",
        as: "transaksi_pembayaran",
      });
    }
  }
  Pembayaran.init(
    {
      tagihanBulanan_id: DataTypes.INTEGER,
      metode_pembayaran: DataTypes.ENUM("TRANSFER", "TUNAI"),
      jumlah_pembayaran_cash: DataTypes.INTEGER,
      status_pembayaran: DataTypes.ENUM("LUNAS", "BELUM LUNAS"),
      total_pembayaran: DataTypes.INTEGER,
      tanggal_pembayaran: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Pembayaran",
    }
  );
  return Pembayaran;
};
