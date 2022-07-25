const Customer = require('../../../models/customer')
const { QueryTypes, Sequelize, UUIDV4 } = require('sequelize')
const sequelize = require('../../../inflastructure/database/conn')
const User = require('../../../models/user')
const resCode = require('../../../rescode/customer')
const validator = require('validator')
const bcrypt = require('bcrypt')
const config = require('../../../config/appconfig')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const libPhoneNumber = require('libphonenumber-js')
const i18n = require('../../../i18n/i18n')
const {uuid} = require('uuidv4')
const {v4} = require('uuid')

class CustomerController{
  

    async getProfile(req, res){
        const accessToken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accessToken)
        const userId = decodedToken.userId
        try {
            const customer = await Customer.findOne({
                where:{
                    user_id: userId
                }
            })
            
            if(!customer)
                return res.status(200).json({
                    status: {
                        code: resCode.ERR_325,
                        message: i18n.__('UserNotExist')
                    }
                })
            
            return res.status(200).json({
                status: {
                    code: resCode.OK_222,
                    message: i18n.__('GetCustomerProfileSuccess')
                },
                data: {
                    customer: customer
                }
            })
            
        } catch (error) {
            console.log(error)
        }

    }

    async inputPhoneNumber(req, res){
        const phoneNumber = `${req.body.country_code}${req.body.phone_number}`
        const phoneNumberInfo = libPhoneNumber.parsePhoneNumber(phoneNumber)
        const checkPhone = libPhoneNumber.isValidPhoneNumber(phoneNumber, `${phoneNumberInfo.country}`)
        
        if(!checkPhone)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_326,
                    message: i18n.__('IncorrectPhoneNumber')
                }
            })

        const queryPhoneNumber = await User.findOne({
            where: {
                phone_number: req.body.phone_number
            }
        })

        if(queryPhoneNumber && queryPhoneNumber.username)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_327,
                    message: i18n.__('PhoneNumberUsed')
                }
            })
        
       

        const min = 100000;
        const max = 900000;
        const verification_code = Math.floor(Math.random() * min) + max

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
                    verify_code: verification_code,
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_328,
                    message: i18n.__('FailedRegistPhoneNumber')
                }
            })
        }


        return res.status(200).json({
            status:{
                code: resCode.OK_224,
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

    async verifyPhoneNumber(req, res){
        const accesstoken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accesstoken)
        try {

            const verify_code = User.findOne({
                where:{
                    verify_code: req.body.verify_code,
                    phone_number: req.body.phone_number,
                }
            })
           
            if(!verify_code)
                return res.status(200).json({
                    status: {
                        code: resCode.ERR_3291,
                        message: i18n.__('InvalidVerifyCode')
                    }
                })

            const accesstoken = jwt.sign({
                phone_number: decodedToken.phone_number,
                verified: true,
            }, config.auth.access_token_secret,
            {
                expiresIn: '60m',
            })

            return res.status(200).json({
                status: {
                    code: resCode.OK_225,
                    message: i18n.__('VerifySuccess')
                },
                data:{
                    phone_number: decodedToken.phone_number,
                    token: accesstoken,
                }
            })
        } catch (error) {
            console.log(error)   
            return res.status(200).json({
                status:{
                    code: resCode.ERR_329,
                    message: i18n.__('InvalidPhoneNumberToken'),
                }
            })
        }
       
    }

    async registerNameAndEmail(req, res){
        const accesstoken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accesstoken)

        if(!decodedToken.verified)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_3297,
                    message: i18n.__('PhoneNumberIsNotVerified')
                }
            })

        if(!validator.isEmail(req.body.email))
            return res.status(200).json({
                status: {
                    code: resCode.ERR_3292,
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
                        code: resCode.ERR_3296,
                        message: i18n.__('EmailExisted')
                    }
                })
            }

            await User.update({
                user_type: 'customer',
                user_fullname: req.body.user_fullname,
                email: req.body.email,
                username: decodedToken.phone_number,
            },{
                where: {
                    phone_number: decodedToken.phone_number
                }
            })
            
            const resultUser = await User.findOne({
                where:{
                    phone_number: decodedToken.phone_number
                }
            })

            const customer = await Customer.create({
                id: v4(),
                user_id: resultUser.id,
                address: req.body.address
            })

            
            const accesstoken = jwt.sign({
                phone_number: decodedToken.phone_number,
                customer_id: customer.id,
            }, config.auth.access_token_secret,
            {
                expiresIn: '1d',
            })
         
            return res.status(200).json({
                status:{
                    code: resCode.OK_227,
                    message: i18n.__('CreateCustomerNameAndEmailSuccess')
                },
                data:{
                    customer: customer,
                    token:{
                        accesstoken: accesstoken
                    }
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_3295,
                    message: i18n.__('CreateCustomerNameAndEmailFail')
                }
            })
        } 
    }

    async register(req, res){
        
        const accesstoken = req.headers.accesstoken.split(' ')[1]
        const decodedToken = jwt_decode(accesstoken)

        if(!decodedToken.customer_id)
            return res.status(200).json({
                code: resCode.ERR_3296,
                message: i18n.__('EmailIsNotRegisted')
            })
        

        if(req.body.password.length < 6 || req.body.password.length > 32)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_3293,
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
                    code: resCode.OK_226,
                    message: i18n.__("CreateCustomerPasswordSuccess")
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_3294,
                    message: i18n.__("CreateCustomerPasswordFail")
                }
            })
        }
    }

    async login(req, res){
       

        if( req.body.password.length < 6 || 
            req.body.password.length > 32 )
            return res.status(200).json({
                code: resCode.ERR_3293,
                message: i18n.__('PasswordError')
            })

        const result = await User.findOne({where:{
                username: req.body.username,
                user_type: 'customer'
            }
        })

        if(!result)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_325,
                    message: i18n.__('UserNotExist')
                }
            })

        const checkPassword = await bcrypt.compare(req.body.password, result.password)
        if(!checkPassword)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_324,
                    message: i18n.__("PasswordIncorrect")
                },
            })

        const accessToken = jwt.sign({
            userId: result.id,
            userType: 'customer',
        }, config.auth.access_token_secret,{
            expiresIn: '1d',
        })

        const refreshToken = jwt.sign({
            userId: result.id,
            userType: 'customer',
        }, config.auth.refresh_token_secret,{
            expiresIn: '2d',
        })

        return res.status(200).json({
            status: {
                code: resCode.OK_221,
                message: i18n.__("LoginSuccess")
            },
                data:{
                    customer: {...result.dataValues, password: undefined},
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            })
    }
}

module.exports = new CustomerController()