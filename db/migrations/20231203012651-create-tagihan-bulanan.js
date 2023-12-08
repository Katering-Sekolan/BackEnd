"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TagihanBulanans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      total_tagihan: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      bulan: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      jumlah_snack: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      jumlah_makanan: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      total_snack: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      total_makanan: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TagihanBulanans");
  },
};
