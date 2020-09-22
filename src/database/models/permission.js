'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.permission.belongsTo(models.role, {
        foreignKey: 'roleId',
        as: 'role',
      });
    }
  };
  permission.init({
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING
    },
    endpoint: {
      type: DataTypes.STRING
    },
    isBackend: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'permission',
  });
  return permission;
};
