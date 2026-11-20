'use strict';
let info = require("../datajson/info.json");

module.exports = {
  async up (queryInterface, Sequelize) {
   const formattedinfos = info.map((item) => {
      return {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
   await queryInterface.bulkInsert('Infos', formattedinfos,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('info', null, {});
  }
};
