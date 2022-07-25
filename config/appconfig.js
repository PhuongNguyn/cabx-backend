require('dotenv').config()

// config.js
module.exports = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
        appName: process.env.APP_NAME || 'CabX',
        env: process.env.NODE_ENV || 'development',
        lang: 'vi'
    },
    db: {
        port: 5432,
        database: 'cabxDB',
        password: 'cabx2022%@',
        username: 'cabx-data',
        host: 'localhost',
        dialect: 'postgres',
        logging: true,
    },
    winiston: {
        logpath: '/log_files/logs/',
    },
    auth: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_expiresin: process.env.JWT_EXPIRES_IN || 2 * 24*60*60,
        saltRounds: process.env.SALT_ROUND || 10,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'VmVyeVBvd2VyZnVsbFNlY3JldA==',
        access_token_secret: process.env.ACCESS_TOKEN_SECRET || 'VmVyeVdjkasbfk2VyZnVsbFNlY3JldA==',
        refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || 2 * 24*60*60, // 2 days
        access_token_expiresin: process.env.ACCESS_TOKEN_EXPIRES_IN || 2* 24*60*60, // 2 days
    },
};