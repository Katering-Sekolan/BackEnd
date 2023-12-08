"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TagihanBulanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Pembayaran, {
        foreignKey: "tagihanBulanan_id",
        as: "tagihan_bulanan",
      });

      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user_tagihan_bulanan",
      });
    }
  }
  TagihanBulanan.init(
    {
      user_id: DataTypes.INTEGER,
      total_tagihan: DataTypes.INTEGER,
      bulan: DataTypes.DATE,
      jumlah_snack: DataTypes.INTEGER,
      jumlah_makanan: DataTypes.INTEGER,
      total_snack: DataTypes.INTEGER,
      total_makanan: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TagihanBulanan",
    }
  );
  return TagihanBulanan;
};
