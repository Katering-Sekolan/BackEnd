'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Riwayat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Riwayat.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Riwayat.init({
    tanggal_bayar: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Riwayat',
  });
  return Riwayat;
};