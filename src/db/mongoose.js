const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

console.log(process.env.MONGODB_URL)

const connection = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology :true,
    useFindAndModify: false
})

module.exports = connection