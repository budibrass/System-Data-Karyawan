'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Karyawan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Karyawan.hasMany(models.Gaji)
      Karyawan.hasMany(models.PengajuanLembur)
      Karyawan.hasMany(models.Cuti)
      Karyawan.hasMany(models.Reimbursement)
      Karyawan.hasOne(models.Presensi)
      Karyawan.hasOne(models.Performance)
      Karyawan.belongsTo(models.Golongan)
      Karyawan.belongsTo(models.Project)
    }
  }
  Karyawan.init({
    GolonganId: DataTypes.INTEGER,
    ProjectId: DataTypes.INTEGER,
    nip: DataTypes.STRING,
    email: DataTypes.STRING,
    namaDepan: DataTypes.STRING,
    namaBelakang: DataTypes.STRING,
    tempatLahir: DataTypes.STRING,
    tanggalLahir: DataTypes.DATE,
    jenisKelamin: DataTypes.STRING,
    agama: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    pendidikan: DataTypes.STRING,
    noHandphone: DataTypes.STRING,
    alamat: DataTypes.STRING,
    statusPernikahan: DataTypes.STRING,
    statusKerja: DataTypes.STRING,
    tanggalMasuk: DataTypes.DATE,
    jumlahTanggunganAnak: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Karyawan',
  });
  return Karyawan;
};