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
    async getCustomer(req, res){
        try {
            const users = await User.findAll({
                where:{
                    user_type: 'customer'
                }
            })
            const customers = await Customer.findAll()
            return res.status(200).json({
                status: {
                    code: resCode.OK_228,
                    message: i18n.__('GetCustomerSuccess'),
                },
                data:{
                    users: users,
                    customers: customers,
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_3298,
                    message: i18n.__('GetCustomerFail')
                }
            })
        }
    }

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


    async registerInfo(req, res){
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

        if(queryPhoneNumber)
            return res.status(200).json({
                status:{
                    code: resCode.ERR_327,
                    message: i18n.__('PhoneNumberUsed')
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
            const username = req.body.phone_number
            console.log(username)

            const user = await User.create({
                id: v4(),
                user_type: 'customer',
                user_fullname: req.body.user_fullname,
                email: req.body.email,
                phone_number:req.body.phone_number,
                username: username,
            })
          
            const customer = await Customer.create({
                id: v4(),
                user_id: user.id,
            },{
                returning: true
            })

            const accesstoken = jwt.sign({
                phone_number: req.body.phone_number,
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
                    customer: user,
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

            const user = await User.findOne({
                where:{
                    phone_number: decodedToken.phone_number,
                    user_type: 'customer'
                }
            })

            return res.status(200).json({
                status:{
                    code: resCode.OK_226,
                    message: i18n.__("CreateCustomerPasswordSuccess")
                },
                data:{...user.dataValues, password: undefined}
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
        console.log(req.body)

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
            expiresIn: '1d'
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

    async deleteCustomer(req, res){
        try {
            const user = await User.findOne({
                where:{
                    phone_number: req.params.phone_number,
                    user_type: 'customer',
                }
            })
            await Customer.destroy({
                where:{
                    user_id: user.id
                }
            })

            await User.destroy({
                where:{
                    phone_number: req.params.phone_number,
                }
            })

            return res.status(200).json({
                status: {
                    code: resCode.OK_228,
                    message: i18n.__('DeleteCustomerSuccess'),
                }
            })
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_3298,
                    message: i18n.__("DeleteCustomerFail")
                }
            })
        }
    }
}

module.exports = new CustomerController()