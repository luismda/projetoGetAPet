const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
    const token =  jwt.sign({
        userId: user._id,
        name: user.name
    }, 'getapetsecret')

    res.status(200).json({
        message: 'Você está autenticado',
        token,
        userId: user._id
    })
}

module.exports = createUserToken