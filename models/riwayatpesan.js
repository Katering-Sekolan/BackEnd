'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RiwayatPesan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RiwayatPesan.init({
    pesan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RiwayatPesan',
  });
  return RiwayatPesan;
};