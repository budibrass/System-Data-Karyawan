'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PengajuanLembur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PengajuanLembur.belongsTo(models.Karyawan)
    }
  }
  PengajuanLembur.init({
    KaryawanId: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    lamaJam: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PengajuanLembur',
  });
  return PengajuanLembur;
};