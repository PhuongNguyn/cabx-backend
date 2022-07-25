const route = require('express').Router()
const EmployeeController = require('../controllers/index')

// route.post('/register', EmployeeController.register)
route.post('/login', EmployeeController.login)
route.get('/getProfile',EmployeeController.getProfile)

module.exports = route