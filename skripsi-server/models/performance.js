'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Performance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Performance.belongsTo(models.Karyawan)
      Performance.belongsTo(models.Project)
    }
  }
  Performance.init({
    KaryawanId: DataTypes.INTEGER,
    bulan: DataTypes.DATE,
    presensiJumlahKehadiran: DataTypes.INTEGER,
    presensiIzinSakit: DataTypes.INTEGER,
    presensiAlfa: DataTypes.INTEGER,
    presensiNilai: DataTypes.INTEGER,
    ProjectId: DataTypes.INTEGER,
    kinerja: DataTypes.STRING,
    totalNilai: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Performance',
  });
  return Performance;
};