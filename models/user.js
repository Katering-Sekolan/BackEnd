'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Tagihan, {
        foreignKey: "user_id",
      });
      User.hasMany(models.Riwayat, {
        foreignKey: "user_id",
      })
    }
  }
  User.init({
    nama: DataTypes.STRING,
    password: DataTypes.STRING,
    nomor_hp: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};