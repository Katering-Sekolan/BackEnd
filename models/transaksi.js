'use strict';
const {
  Model
} = require('sequelize');
const pembayaran = require('./pembayaran');
module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Pembayaran, {
        foreignKey: "pembayaran_id",
        as: "transaksi_pembayaran"
      });
    }
  }
  Transaksi.init({
    pembayaran_id: DataTypes.INTEGER,
    snap_token: DataTypes.STRING,
    order_id: DataTypes.STRING,
    tanggal_transaksi: DataTypes.DATE,
    status_transaksi: DataTypes.ENUM("PEMBAYARAN BERHASIL", "PEMBAYARAN GAGAL", "PEMBAYARAN DITOLAK",
      "PEMBAYARAN MENUNGGU KONFIRMASI", "PEMBAYARAN DIPROSES", "PEMBAYARAN DIBATALKAN",
      "PEMBAYARAN DITUNDA", "PEMBAYARAN EXPIRED", "PEMBAYARAN REFUND", "MENUNGGU PEMBAYARAN")
  }, {
    sequelize,
    modelName: 'Transaksi',
  });
  return Transaksi;
};