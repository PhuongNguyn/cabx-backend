const { Sequelize} = require('sequelize')
const config = require('../../config/appconfig');
const { env } = config.db


const sequelize = new Sequelize(env?.database, 'cabx-dev', 'cabx2022%@', {
    host: env?.host,
    dialect: 'postgres',
    define:{
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
  });

module.exports = sequelize