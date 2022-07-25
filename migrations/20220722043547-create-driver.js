'use strict';
const {Model, DataTypes } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) => 
    queryInterface.createTable('drivers', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      user_id:{
          type: DataTypes.STRING,
          allowNull: false,
      },
      status:{
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
      },
      cloud_service_id:{
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "",
      },
      address:{
          type: DataTypes.TEXT,
          allowNull: false,
      },
      lastactivity: {
          type: DataTypes.DATE,
          defaultValue: new Date()
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
    })
  ,

  down: (queryInterface, Sequelize) => queryInterface.dropTable('drivers'),

};
