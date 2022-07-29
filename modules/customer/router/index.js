const route = require('express').Router()
const CustomerController = require('../controllers/index')
const authController = require('../../../middlewares/auth')

route.post('/login', CustomerController.login)
route.get('/getProfile', authController.authentication,CustomerController.getProfile)
route.post('/register-info', CustomerController.registerInfo)
route.patch('/register', authController.authentication, CustomerController.register)
route.get('/getCustomer', authController.authentication, CustomerController.getCustomer)
route.get('/deleteCustomer/:phone_number', CustomerController.deleteCustomer)

module.exports = route