'use strict';
const cutis = require("../datajson/cuti.json"); 

module.exports = {
  async up (queryInterface, Sequelize) {
    const formattedCutis = cutis.map((item) => {
      return {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('Cutis', formattedCutis, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cutis', null, {});
  }
};
