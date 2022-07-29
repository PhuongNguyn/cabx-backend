const route = require('express').Router()
const CustomerController = require('../controllers/index')
const authController = require('../../../middlewares/auth')

route.post('/login', CustomerController.login)
route.get('/getProfile', authController.authentication,CustomerController.getProfile)
route.post('/register-info', CustomerController.registerInfo)
route.patch('/register', authController.authentication, CustomerController.register)
route.get('/getEmployee', authController.authentication, CustomerController.getCustomer)


module.exports = route