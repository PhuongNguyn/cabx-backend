const { Sequelize} = require('sequelize')
const config = require('../../config/appconfig');
const { env } = config.db


const sequelize = new Sequelize('deidqukskpsftr', 'bxsjnsbkfwjmmx', 'f77455dbfc0f2c9eeeae518f89625d32a8f9a361221df147fc58585f17f9cc92', {
    host: 'ec2-44-208-88-195.compute-1.amazonaws.com',
    dialect: 'postgres',
    define:{
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
  });

module.exports = sequelize