'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.belongsTo(models.role, {
        foreignKey: 'roleId',
        as: 'role',
      });
    }
  };
  user.init({
    username: {
      type: DataTypes.STRING
    },
    roleId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING
    },
    profile: {
      type: DataTypes.JSONB
    },
  }, {
    paranoid: true,
    sequelize,
    modelName: 'user',
  });
  return user;
};
