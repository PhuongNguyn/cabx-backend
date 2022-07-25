const {Model, DataTypes } = require('sequelize')
const sequelize = require('../inflastructure/database/conn')

class Employee extends Model{}

Employee.init({
    id : {
        type: DataTypes.STRING,
        autoIncrement: true,
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
},{
    sequelize,
    modelName: 'employees',
})

module.exports = Employee