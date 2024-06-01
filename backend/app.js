const express = require("express")
const app = express()
const errorMiddleware = require("../backend/middlewares/error.js")
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
//ROUTE imports

const product = require("./routes/productRoute.js")
const user = require("./routes/userRoute.js")

app.use("/api/v1" , product);
app.use("/api/v1" , user);
app.use(errorMiddleware);

module.exports = app