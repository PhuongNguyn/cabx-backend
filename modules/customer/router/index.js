const route = require('express').Router()
const CustomerController = require('../controllers/index')
const authController = require('../../../middlewares/auth')

route.post('/login', CustomerController.login)
route.get('/getProfile', authController.authentication,CustomerController.getProfile)
route.patch('/register-name-and-email', authController.authentication, CustomerController.registerNameAndEmail)
route.post('/registerPhoneNumber', CustomerController.inputPhoneNumber)
route.post('/verifyPhoneNumber', authController.authentication, CustomerController.verifyPhoneNumber)
route.patch('/register', authController.authentication, CustomerController.register)


module.exports = route