'use strict';
const lemburs = require("../datajson/lembur.json"); 

module.exports = {
  async up (queryInterface, Sequelize) {
    const formattedLemburs = lemburs.map((item) => {
      return {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Jalankan insert menggunakan data yang sudah diformat
    await queryInterface.bulkInsert('PengajuanLemburs', formattedLemburs, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PengajuanLemburs', null, {});
  }
};