'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tagihan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tagihan.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Tagihan.init({
    total_tagihan: DataTypes.INTEGER,
    tagihan_dibayar: DataTypes.INTEGER,
    tagihan_belum_dibayar: DataTypes.INTEGER,
    status_tagihan: DataTypes.ENUM("BELUM_DIBAYAR", "BELUM_LUNAS", "LUNAS"),
    tanggal_tagihan: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Tagihan',
  });
  return Tagihan;
};