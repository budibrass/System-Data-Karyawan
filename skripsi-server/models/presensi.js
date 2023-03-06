'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Presensi.belongsTo(models.Karyawan)
    }
  }
  Presensi.init({
    KaryawanId: DataTypes.INTEGER,
    clockin: DataTypes.STRING,
    clockout: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};