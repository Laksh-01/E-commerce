const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel.js")

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=> {

    const {token} = req.cookies;
    
    if(!token) {
        return next(new ErrorHandler("Please login to access this resource" , 401));
    }

    const decodedData = jwt.verify(token , process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next();
})