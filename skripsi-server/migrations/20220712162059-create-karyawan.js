'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Karyawans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      GolonganId: {
        type: Sequelize.INTEGER
      },
      ProjectId: {
        type: Sequelize.INTEGER
      },
      nip: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      namaDepan: {
        type: Sequelize.STRING
      },
      namaBelakang: {
        type: Sequelize.STRING
      },
      tempatLahir: {
        type: Sequelize.STRING
      },
      tanggalLahir: {
        type: Sequelize.DATE
      },
      jenisKelamin: {
        type: Sequelize.STRING
      },
      agama: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
      pendidikan: {
        type: Sequelize.STRING
      },
      noHandphone: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      statusPernikahan: {
        type: Sequelize.STRING
      },
      statusKerja: {
        type: Sequelize.STRING
      },
      tanggalMasuk: {
        type: Sequelize.DATE
      },
      jumlahTanggunganAnak: {
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
    await queryInterface.dropTable('Karyawans');
  }
};