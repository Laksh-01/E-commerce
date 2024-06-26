const mongoose = require("mongoose")

const connectDataBase = ()=>{
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`MonogDb connected with server : ${data.connection.host}`)
    })
}

module.exports = connectDataBase