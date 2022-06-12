const mongoose = require('mongoose')

const main = async () => {
    await mongoose.connect('mongodb://localhost:27017/getapet')
}

main().catch(error => console.log(error))

module.exports = mongoose