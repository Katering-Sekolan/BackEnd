'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tagihans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total_tagihan: {
        type: Sequelize.INTEGER
      },
      tagihan_dibayar: {
        type: Sequelize.INTEGER
      },
      tagihan_belum_dibayar: {
        type: Sequelize.INTEGER
      },
      status_tagihan: {
        type: Sequelize.ENUM,
        values: ["BELUM_DIBAYAR", "BELUM_LUNAS", "LUNAS"],
      },
      tanggal_tagihan: {
        type: Sequelize.DATE
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tagihans');
  }
};