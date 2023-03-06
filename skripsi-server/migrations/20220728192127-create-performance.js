'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Performances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      KaryawanId: {
        type: Sequelize.INTEGER
      },
      bulan: {
        type: Sequelize.DATE
      },
      presensiJumlahKehadiran: {
        type: Sequelize.INTEGER
      },
      presensiIzinSakit: {
        type: Sequelize.INTEGER
      },
      presensiAlfa: {
        type: Sequelize.INTEGER
      },
      presensiNilai: {
        type: Sequelize.INTEGER
      },
      ProjectId: {
        type: Sequelize.INTEGER
      },
      kinerja: {
        type: Sequelize.STRING
      },
      totalNilai: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Performances');
  }
};