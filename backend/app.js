const express = require("express")
const app = express()
const errorMiddleware = require("../backend/middlewares/error.js")

app.use(express.json());

//ROUTE imports

const product = require("./routes/productRoute.js")


app.use("/api/v1" , product);
app.use(errorMiddleware);

module.exports = app