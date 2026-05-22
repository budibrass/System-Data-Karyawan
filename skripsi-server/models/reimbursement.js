'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reimbursement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reimbursement.belongsTo(models.Karyawan)
    }
  }
  Reimbursement.init({
    KaryawanId: DataTypes.INTEGER,
    tanggal: DataTypes.DATE,
    namaReimbursement: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    status: DataTypes.STRING,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reimbursement',
  });
  return Reimbursement;
};