const { QueryTypes, Sequelize } = require('sequelize')
const sequelize = require('../../../inflastructure/database/conn')
const User = require('../../../models/user')
const Employee = require('../../../models/employee')
const resCode = require('../../../rescode/employee')
const validator = require('validator')
const bcrypt = require('bcrypt')
const config = require('../../../config/appconfig')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const libPhoneNumber = require('libphonenumber-js')
const i18n = require('../../../i18n/i18n')



class EmployeeController{

    async getProfile(req, res){
        const accessToken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accessToken)
        const userId = decodedToken.userId
        try {
            const employee = await Employee.findOne({
                where:{
                    user_id: userId
                }
            })
            
            if(!employee)
                return res.status(200).json({
                    status: {
                        code: resCode.ERR_305,
                        message: i18n.__('UserNotExist')     
                    }
                })
            
            return res.status(200).json({
                status: {
                    code: resCode.OK_202,
                    message: i18n.__('GetEmployeeProfileSuccess')
                },
                data: {
                    employee: employee
                }
            })
            
        } catch (error) {
            console.log(error)
        }

    }

    // async register(req, res){
    //     if(
    //         !validator.isEmail(req.body.email) || 
    //         !validator.isNumeric(req.body.verify_code) || 
    //         req.body.username.length < 6 || 
    //         req.body.password.length < 6 ||
    //         !validator.isAlphanumeric(req.body.phone_number)||
    //         !validator.isNumeric(req.body.role_id)
    //     )
    //         return res.status(200).json({
    //             status: {
    //                 code: resCode.ERR_302,
    //                 messsage: 'Sai thông tin đăng kí'
    //             }
    //         })
    //     try {
    //         const checkUser = await User.findOne({
    //             where: {
    //                 username: req.body.username
    //             }
    //         })
    //         if(checkUser)
    //             return res.status(200).json({
    //                 message: 'Existed'
    //             })

    //         const salt = await bcrypt.genSalt(config.auth.saltRounds)
    //         const hash = await bcrypt.hash(req.body.password, salt)
    //         const result = await User.create({
    //             id: req.body.user_id,
    //             username: req.body.username,
    //             password: hash,
    //             verify_code: req.body.verify_code,
    //             user_type: 'employee',
    //             user_fullname: req.body.user_fullname,
    //             phone_number: req.body.phone_number,
    //             email: req.body.email,
    //         })
    //         const employee = await Employee.create({
    //             id: req.body.id,
    //             user_id: req.body.user_id,
    //             role_id: req.body.role_id,
    //         })
    //         return res.status(200).json({
    //             status:{
    //                 code: resCode.OK_200,
    //                 message: 'Tạo nhân viên thành công'
    //             },
    //             data:{
    //                 employee: employee,
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(200).json({
    //             status:{
    //                 code: resCode.ERR_301,
    //                 message: 'Tạo nhân viên thất bại'
    //             }
    //         })
    //     } 
    // }

    async login(req, res){
        if( req.body.password.length < 6 || 
            req.body.password.length > 32 )
            return res.status(200).json({
                code: resCode.ERR_306,
                message: i18n.__('PasswordError')
            })

        
        const result = await User.findOne({where:{
            username: req.body.username,
            user_type: 'employee',
        }})

        if(!result)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_305,
                    message: i18n.__('UserNotExist')
                }
            })

        const checkPassword = await bcrypt.compare(req.body.password, result.password)
        if(!checkPassword)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_304,
                    message: i18n.__('PasswordIncorrect')
                },
            })

        const accessToken = jwt.sign({
            userId: result.id,
            userType: 'employee',
        }, config.auth.access_token_secret,{
            expiresIn: '1d',
        })

        const refreshToken = jwt.sign({
            userId: result.id,
            userType: 'employee',
        }, config.auth.refresh_token_secret,{
            expiresIn: '2d',
        })

        return res.status(200).json({
            status: {
                code: resCode.OK_201,
                message: i18n.__("LoginSuccess")
            },
                data:{
                    employee: {...result.dataValues, password: undefined},
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            })
    }
}

module.exports = new EmployeeController()