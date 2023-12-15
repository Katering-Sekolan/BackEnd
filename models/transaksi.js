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
    tanggal_transaksi: DataTypes.DATE,
    status_transaksi: DataTypes.ENUM("LUNAS", "MENUNGGU PEMBAYARAN", "BELUM LUNAS")
  }, {
    sequelize,
    modelName: 'Transaksi',
  });
  return Transaksi;
};