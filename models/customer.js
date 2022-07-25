const {Model, DataTypes } = require('sequelize')
const sequelize = require('../inflastructure/database/conn')

class Customer extends Model{}

Customer.init({
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
        allowNull: false,
    },
},{
    sequelize,
    modelName: 'customers',
})

module.exports = Customer