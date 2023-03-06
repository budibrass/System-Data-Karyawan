'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Gajis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      KaryawanId: {
        type: Sequelize.INTEGER
      },
      tanggal: {
        type: Sequelize.DATE
      },
      gajiPokok: {
        type: Sequelize.INTEGER
      },
      lembur: {
        type: Sequelize.BOOLEAN
      },
      lamaLembur: {
        type: Sequelize.INTEGER
      },
      potongan: {
        type: Sequelize.JSON
      },
      gajiTunjangan: {
        type: Sequelize.INTEGER
      },
      totalPotongan: {
        type: Sequelize.INTEGER
      },
      totalGaji: {
        type: Sequelize.INTEGER
      },
      totalGajiLembur: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Gajis');
  }
};