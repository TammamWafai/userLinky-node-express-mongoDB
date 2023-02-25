const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const connectDB = (url) => {
    console.log("connected to DB");
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = connectDB