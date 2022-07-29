'use strict';
const {Model, DataTypes } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) => 
    queryInterface.createTable('customers', {
      id : {
        type: DataTypes.STRING,
        primaryKey: true,
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
      address:{
          type: DataTypes.TEXT,
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

  down: (queryInterface, Sequelize) => queryInterface.dropTable('customers'),

};
