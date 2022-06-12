const jwt = require('jsonwebtoken')

const User = require('../models/User')

const getUserByToken = async token => {
    const decoded = jwt.verify(token, 'getapetsecret')
    const userId = decoded.userId

    return await User.findById(userId)
}

module.exports = getUserByToken