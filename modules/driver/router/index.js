const route = require('express').Router()
const DriverController = require('../controllers/index')
const authController = require('../../../middlewares/auth')


route.post('/register-info', DriverController.registerInfo)
route.patch('/register', authController.authentication, DriverController.register)
route.post('/login', DriverController.login)
route.get('/getProfile', authController.authentication,DriverController.getProfile)
route.get('/getDriver', authController.authentication, DriverController.getDrivers)

module.exports = route