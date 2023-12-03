'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TagihanBulanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TagihanBulanan.init({
    total_tagihan: DataTypes.INTEGER,
    bulan: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TagihanBulanan',
  });
  return TagihanBulanan;
};