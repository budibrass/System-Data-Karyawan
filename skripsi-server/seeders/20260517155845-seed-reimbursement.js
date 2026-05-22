'use strict';
let reimbursements = require("../datajson/reimbursement.json");

module.exports = {
  async up (queryInterface, Sequelize) {
   const formattedreimbursements = reimbursements.map((item) => {
      return {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
   await queryInterface.bulkInsert('Reimbursements', formattedreimbursements,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Reimbursements', null, {});
  }
};
