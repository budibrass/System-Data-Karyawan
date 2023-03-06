'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gaji extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Gaji.belongsTo(models.Karyawan)
    }
  }
  Gaji.init({
    KaryawanId: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    gajiPokok: DataTypes.INTEGER,
    lembur: DataTypes.BOOLEAN,
    lamaLembur: DataTypes.INTEGER,
    potongan: DataTypes.JSON,
    gajiTunjangan: DataTypes.INTEGER,
    totalPotongan: DataTypes.INTEGER,
    totalGajiLembur: DataTypes.INTEGER,
    totalGaji: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Gaji',
  });
  return Gaji;
};