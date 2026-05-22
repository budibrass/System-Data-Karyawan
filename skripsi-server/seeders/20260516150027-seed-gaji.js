'use strict';
let gajis = require("../datajson/gaji.json");

module.exports = {
  async up (queryInterface, Sequelize) {
    // Mapping data agar kompatibel dengan raw SQL insert
    const formattedGajis = gajis.map((gaji) => {
      return {
        ...gaji,
        // 🌟 KUNCI PERBAIKAN: Ubah object/array menjadi string JSON
        potongan: typeof gaji.potongan === 'object' ? JSON.stringify(gaji.potongan) : gaji.potongan,
        
        // Tambahkan timestamp bawaan Sequelize (opsional tapi sangat disarankan)
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('Gajis', formattedGajis, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Gajis', null, {});
  }
};