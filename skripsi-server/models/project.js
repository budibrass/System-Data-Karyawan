'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasMany(models.Karyawan)
      Project.hasOne(models.Performance)
    }
  }
  Project.init({
    nama: DataTypes.STRING,
    productManager: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};