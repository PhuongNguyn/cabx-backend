const {Model, DataTypes } = require('sequelize')
const sequelize = require('../inflastructure/database/conn')


class Users extends Model{}

Users.init({
    id : {
        type: DataTypes.STRING,
        autoIncrement: true,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
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
    }
},{
    sequelize,
    modelName: 'users',
    timestamps: true,
})

module.exports = Users
