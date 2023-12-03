"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RiwayatPesan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  RiwayatPesan.init(
    {
      user_id: DataTypes.INTEGER,
      pesan: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "RiwayatPesan",
    }
  );
  return RiwayatPesan;
};
