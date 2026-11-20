'use strict';

let karyawan = require("../datajson/karyawan.json");
karyawan = karyawan.map((e) => {
  e.createdAt = new Date();
  e.updatedAt = new Date();
  return e;
});

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Karyawans', karyawan, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Karyawans', null, {});
  }
};