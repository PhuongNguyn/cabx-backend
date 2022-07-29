'use strict';
const {Model, DataTypes } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id : {
      type: DataTypes.STRING,
      primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
    },
    username:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    verify_code: {
        type: DataTypes.INTEGER,
    },
    count_verify:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    user_type: {
        type: DataTypes.STRING,
    },
    user_fullname:{
        type: DataTypes.STRING, 
    },
    phone_number:{
        type: DataTypes.STRING,
    },
    email:{
        type: DataTypes.STRING,
        defaultValue: '',
    },
    country_code: {
        type: DataTypes.STRING
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users'),
};
