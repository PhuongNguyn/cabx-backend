const employeeRoute = require('../modules/employee/router/index')
const driverRoute = require('../modules/driver/router/index')
const customerRoute = require('../modules/customer/router/index')

module.exports = (app) =>{
  app.use('/api/v1/user/employee', employeeRoute)
  app.use('/api/v1/user/driver', driverRoute)
  app.use('/api/v1/user/customer', customerRoute)
}
