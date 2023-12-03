"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Deposit extends Model {
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
  Deposit.init(
    {
      user_id: DataTypes.INTEGER,
      tanggal_deposit: DataTypes.DATE,
      jumlah_deposit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Deposit",
    }
  );
  return Deposit;
};
