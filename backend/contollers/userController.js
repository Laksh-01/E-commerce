const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js")


exports.registerUser = catchAsyncErrors(async(req,res,next) =>{
    const {name , email , password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepic"
        }
    });

    const token = user.getJWTToken();

   sendToken(user,201,res)
})


exports.loginUser = catchAsyncErrors(async(req,res,next) => {

    const {email , password} = req.body;

    //checking if user has given both pass and email
    if(!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password" , 400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or password" , 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password" , 401));
    }

    const token = user.getJWTToken();

    sendToken(user,200,res);
})