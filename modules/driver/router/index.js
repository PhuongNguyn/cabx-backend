const route = require('express').Router()
const DriverController = require('../controllers/index')
const authController = require('../../../middlewares/auth')


route.patch('/register-name-and-email', authController.authentication, DriverController.registerNameAndEmail)
route.post('/registerPhoneNumber', DriverController.inputPhoneNumber)
route.post('/verifyPhoneNumber', authController.authentication, DriverController.verifyPhoneNumber)
route.patch('/register', authController.authentication, DriverController.register)
route.post('/login', DriverController.login)
route.get('/getProfile', DriverController.getProfile)

module.exports = route