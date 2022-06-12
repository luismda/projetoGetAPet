const getToken = (req) => {
    const reqHeader = req.headers.authorization
    return reqHeader.split(' ')[1]
}

module.exports = getToken