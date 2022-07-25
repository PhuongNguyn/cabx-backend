const jwt = require('jsonwebtoken')
const resCode = require('../rescode/app')
const i18n = require('../i18n/i18n')
const config = require('../config/appconfig')

class AuthClass{
    authentication(req, res, next){
        const accessToken = req.headers.accesstoken.split(' ')[1]

        if(!accessToken){
            return res.status(200).json({
                status: {
                    code: resCode.ERR_401,
                    message: i18n.__('NotHaveToken')
                }
            })
        }
        try {
            const verifyJwt = jwt.verify(accessToken, config.auth.access_token_secret)
            if(!verifyJwt)
                return res.status(200).json({
                    status: {
                        code: resCode.ERR_402,
                        message: i18n.__("InvalidToken")
                    }
                })

            next()
            
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                status: {
                    code: resCode.ERR_402,
                    message: i18n.__("InvalidToken")
                }
            })
        }

        
    }
}

module.exports = new AuthClass()