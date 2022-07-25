const { Sequelize} = require('sequelize')
const config = require('../../config/appconfig');
const { env } = config.db


const sequelize = new Sequelize('sbrbabst', 'sbrbabst', 'FOfAajwuZjVtxKag0ECUiMawYjZjQa1m', {
  host: 'kandula.db.elephantsql.com',
  dialect: 'postgres',
  define:{
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
  }
});

module.exports = sequelize