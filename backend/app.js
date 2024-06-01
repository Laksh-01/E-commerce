const express = require("express")
const app = express()
const errorMiddleware = require("../backend/middlewares/error.js")

app.use(express.json());

//ROUTE imports

const product = require("./routes/productRoute.js")
const user = require("./routes/userRoute.js")

app.use("/api/v1" , product);
app.use("/api/v1" , user);
app.use(errorMiddleware);

module.exports = app