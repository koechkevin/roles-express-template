'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.role.hasMany(models.user, {
        foreignKey: 'roleId',
        as: 'users',
      });
      models.role.hasMany(models.permission, {
        foreignKey: 'roleId',
        as: 'permissions',
      });
    }
  }
  role.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'role',
      paranoid: true,
    },
  );
  return role;
};
