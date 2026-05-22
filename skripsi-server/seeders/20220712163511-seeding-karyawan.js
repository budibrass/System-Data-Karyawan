'use strict';

let karyawan = require("../datajson/karyawan.json");
karyawan = karyawan.map((e)=>{
  e.createdAt=new Date();
  e.updatedAt=new Date();
  return e;
})

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('Karyawans', karyawan,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Karyawans', null, {});
  }
};
