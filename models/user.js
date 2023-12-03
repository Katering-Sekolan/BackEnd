"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Deposit, {
        foreignKey: "user_id",
        as: "user",
      });

      this.hasMany(models.RiwayatPesan, {
        foreignKey: "user_id",
        as: "user_riwayat",
      });

      this.hasMany(models.TagihanBulanan, {
        foreignKey: "user_id",
        as: "user_tagihan_bulanan",
      });
    }
  }
  User.init(
    {
      nama: DataTypes.STRING,
      kelas: DataTypes.STRING,
      nomor_hp: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
