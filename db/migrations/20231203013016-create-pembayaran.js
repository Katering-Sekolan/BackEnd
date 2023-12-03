"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Pembayarans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tagihanBulanan_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "TagihanBulanans",
          key: "id",
        },
      },
      jumlah_pembayaran: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status_pembayaran: {
        allowNull: false,
        type: Sequelize.ENUM("LUNAS", "BELUM LUNAS"),
      },
      tanggal_pembayaran: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Pembayarans");
  },
};
