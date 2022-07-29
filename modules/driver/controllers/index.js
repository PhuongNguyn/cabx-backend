const Driver = require('../../../models/driver')
const User = require('../../../models/user')
const resCode = require('../../../rescode/driver')
const validator = require('validator')
const bcrypt = require('bcrypt')
const config = require('../../../config/appconfig')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const libPhoneNumber = require('libphonenumber-js')
const i18n = require('../../../i18n/i18n')
const {uuid} = require('uuidv4')
const {v4} = require('uuid')

class DriverController{
    async getDrivers(req, res){
        try {
            const users = await User.findAll({
                where:{
                    user_type: 'driver'
                }
            })
            const drivers = await Driver.findAll()
            return res.status(200).json({
                status: {
                    code: resCode.OK_218,
                    message: i18n.__('GetDriverSuccess'),
                },
                data:{
                    users: users,
                    drivers: drivers,
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_3197,
                    message: i18n.__('GetDriverFail')
                }
            })
        }
    }

    async inputPhoneNumber(req, res){
        
       
        const accesstoken = jwt.sign({
            phone_number: req.body.phone_number,
        }, config.auth.access_token_secret,
        {
            expiresIn: '15m',
        })

        try {
            if(!queryPhoneNumber){
                const result = await User.create({
                    id: uuid(),
                    phone_number: req.body.phone_number,
                    country_code: req.body.country_code,
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_318,
                    message: i18n.__('FailedRegistPhoneNumber')
                }
            })
        }

        return res.status(200).json({
            status:{
                code: resCode.OK_213,
                message: i18n.__('ValidPhoneNumber')
            },
            data: {
                phone_number: req.body.phone_number,
                token:{
                    accesstoken: accesstoken
                }
            }
        })
    }

    async registerInfo(req, res){
        const accesstoken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accesstoken)
        const phoneNumber = `${req.body.country_code}${req.body.phone_number}`
        const phoneNumberInfo = libPhoneNumber.parsePhoneNumber(phoneNumber)
        const checkPhone = libPhoneNumber.isValidPhoneNumber(phoneNumber, `${phoneNumberInfo.country}`)
        
        if(!checkPhone)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_316,
                    message: i18n.__('IncorrectPhoneNumber')
                }
            })

        const queryPhoneNumber = await User.findOne({
            where: {
                phone_number: req.body.phone_number
            }
        })

        if(queryPhoneNumber)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_317,
                    message: i18n.__('PhoneNumberUsed')
                }
            })
        

        if(!validator.isEmail(req.body.email))
            return res.status(200).json({
                status: {
                    code: resCode.ERR_3192,
                    message: i18n.__('EmailInvalid')
                }
            })
        
        try {

            const checkEmailExits = await User.findOne({
                where:{
                    email: req.body.email
                }
            })

            if(checkEmailExits){
                return res.status(200).json({
                    status:{
                        code: resCode.ERR_3193,
                        message: i18n.__('EmailExisted')
                    }
                })
            }

            const user = await User.create({
                id: uuid(),
                user_type: 'driver',
                user_fullname: req.body.user_fullname,
                email: req.body.email,
                username: phoneNumber,
                phone_number: phoneNumber
            })
            
            const resultUser = await User.findOne({
                where:{
                    phone_number: phoneNumber
                }
            })

            const driver = await Driver.create({
                id: v4(),
                user_id: resultUser.id,
            })

            
            const accesstoken = jwt.sign({
                phone_number: decodedToken.phone_number,
                driver_id: driver.id,
            }, config.auth.access_token_secret,
            {
                expiresIn: '1d',
            })
         
            return res.status(200).json({
                status:{
                    code: resCode.OK_217,
                    message: i18n.__('CreateCustomerNameAndEmailSuccess')
                },
                data:{
                    driver: driver,
                    token:{
                        accesstoken: accesstoken
                    }
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_3195,
                    message: i18n.__('CreateCustomerNameAndEmailFail')
                }
            })
        } 
    }

    async register(req, res){
        
        const accesstoken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accesstoken)

        if(!decodedToken.driver_id)
            return res.status(200).json({
                code: resCode.ERR_3195,
                message: i18n.__('EmailIsNotRegisted')
            })
        

        if(req.body.password.length < 6 || req.body.password.length > 32)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_313,
                    messsage: i18n.__('PasswordError')
                }
            })

        try {
            const salt = await bcrypt.genSalt(config.auth.saltRounds)
            const hash = await bcrypt.hash(req.body.password, salt)

            await User.update({
                password: hash,
            },{
                where: {
                    phone_number: decodedToken.phone_number
                }
            })

            return res.status(200).json({
                status:{
                    code: resCode.OK_216,
                    message: i18n.__("CreateCustomerPasswordSuccess")
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_3194,
                    message: i18n.__("CreateCustomerPasswordFail")
                }
            })
        }
    }

    async login(req, res){


        if(req.body.password.length < 6 || req.body.password.length > 32)
             return res.status(200).json({
                 status: {
                     code: resCode.ERR_313,
                     message: i18n.__('PasswordError')
                 }
             })

             
         const result = await User.findOne({
             where:{
                username: req.body.username,
                user_type: 'driver',
             }
         })
 
         if(!result)
             return res.status(200).json({
                 status: {
                     code: resCode.ERR_315,
                     message: i18n.__('UserNotExist')
                 }
             })
 
         const checkPassword = await bcrypt.compare(req.body.password, result.password)
         if(!checkPassword)
             return res.status(200).json({
                 status: {
                     code: resCode.ERR_314,
                     message: i18n.__("PasswordIncorrect")
                 },
             })
 
         const accessToken = jwt.sign({
             userId: result.id,
             userType: 'driver',
         }, config.auth.access_token_secret,{
             expiresIn: '1d'
         })
 
         const refreshToken = jwt.sign({
             userId: result.id,
             userType: 'driver',
         }, config.auth.refresh_token_secret,{
             expiresIn: '2d'
         })

         return res.status(200).json({
             status: {
                 code: resCode.OK_211,
                 message: i18n.__("LoginSuccess")
             },
            data: {
                ...result.dataValues,
                token:{
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
                password: undefined,
                count_verify: undefined,
            },
            })
     }

     async getProfile(req, res){
        const accessToken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accessToken)
        const userId = decodedToken.userId
        try {
            const driver = await Driver.findOne({
                where:{
                    user_id: userId
                }
            })
            
            if(!driver)
                return res.status(200).json({
                    status: {
                        code: resCode.ERR_315,
                        message: i18n.__('UserNotExist')
                    }
                })
            
            return res.status(200).json({
                status: {
                    code: resCode.OK_212,
                    message: i18n.__('GetCustomerProfileSuccess')
                },
                data: {
                    driver: driver
                }
            })
            
        } catch (error) {
            console.log(error)
        }

    }
    
}

module.exports = new DriverController()