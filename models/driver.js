const {Model, DataTypes } = require('sequelize')
const sequelize = require('../inflastructure/database/conn')

class Driver extends Model{}

Driver.init({
    id: {
        type: DataTypes.STRING,
        autoIncrement: true,
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
        defaultValue: ''
    },
    lastactivity: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
},{
    sequelize,
    modelName: 'drivers',
})

module.exports = Driver