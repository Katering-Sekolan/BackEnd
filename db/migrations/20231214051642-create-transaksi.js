'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pembayaran_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Pembayarans",
          key: "id"
        }
      },
      snap_token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tanggal_transaksi: {
        allowNull: false,
        type: Sequelize.DATE
      },
      status_transaksi: {
        allowNull: false,
        type: Sequelize.ENUM("LUNAS", "MENUNGGU PEMBAYARAN", "BELUM LUNAS")
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
    await queryInterface.dropTable('Transaksis');
  }
};