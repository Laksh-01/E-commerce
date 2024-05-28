const app = require("./app.js")
const dotenv = require("dotenv")
const connectDatabase = require("./config/database.js")
const { connect } = require("http2")
const { Server } = require("http")


//Handling uncaught exceptions
process.on("uncaughtException" , (err) => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to uncaughtException");
    process.exit(1);
})


//config
dotenv.config({
    path:"backend/config/config.env"
})

connectDatabase();

app.listen(process.env.PORT , ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})



//Unhandled Promise Rejection
process.on("unhandledRejection" , err => {
    console.log(`Error ${err.message}`);
    console.log("Shutting down the server due to unhandled Promise rejection");
    process.exit(1);
})
