'use strict';
const {Model, DataTypes } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('employees', {
    id : {
      type: DataTypes.STRING,
      primaryKey: true
    },
    user_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
    },
    status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    
    created_at:{
      type: DataTypes.DATE,
    },
    updated_at:{
        type: DataTypes.DATE,
    },
    deleted_at:{
      type: DataTypes.DATE,
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('employees'),
};