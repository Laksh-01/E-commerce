const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

exports.registerUser = catchAsyncErrors(async(req,res,next) =>{
    const {name , email , password , role} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepic"
        },
        role
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

exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token" , null , {
        expires:new Date(Date.now()),
        httpOnly:true
    })


    res
    .status(200)
    .json({
        success:true,
        message:"Logged Out"
    })
})





//FORGOT PASSWORD
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email : req.body.email})

    if(!user){
        return next(new ErrorHandler("User not Found" , 404));
    }


    //GET Reset Password
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")} /api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then , please ignore it`;

    try{
        await sendEmail ({
            email : user.email,
            subject : 'Ecommerce Password Recovery',
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
    }catch(error){
        user.resestPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message , 500));
    }

})



exports.resetPassword = catchAsyncErrors(async(req,res,next) => {

    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
        resetPasswordToken , 
        resestPasswordExpire : {$gt : Date.now()} ,
    })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired" , 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match" , 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resestPasswordExpire = undefined;

    await user.save();
    
    sendToken(user,200,res);
})


exports.getUserDetails = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.user.id)

    res
    .status(200)
    .json({
        success:true,
        user,
    })
})

//update password

exports.updatePassword = catchAsyncErrors(async(req,res,next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect" , 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not matches" , 400));
    }

    user.password = req.body.newPassword


    await user.save();

    sendToken(user , 200 , res);
})


exports.updateProfile = catchAsyncErrors(async(req,res,next) => {
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }

    //will add cloudinary later

    const user = await User.findByIdAndUpdate(req.user.id , newUserData , {
        new:true,
        runValidators:true,
        useFindAndModify : false,
    })


    res
    .status(200)
    .json({
        success : true,
    });
})

//ADMIN if he wishes to see all users
exports.getAllUsers = catchAsyncErrors(async(req,res,next) => {
    const user = await User.find();

    res
    .status(200)
    .json({success:true , user})
})

//ADMIN if he wishes to see a particular user
exports.getSingleUsers = catchAsyncErrors(async(req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not exits with this id : ${req.body.params}`))
    }


    res
    .status(200)
    .json({
        success:true ,
         user
    })
})

//update user role
exports.updateUserRole = catchAsyncErrors(async(req,res,next) => {
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role : req.body.role
    }


    const user = await User.findByIdAndUpdate(req.user.id , newUserData , {
        new:true,
        runValidators:true,
        useFindAndModify : false,
    })


    res
    .status(200)
    .json({
        success : true,
    });
})

//delete user-admin
exports.deleteUser = catchAsyncErrors(async(req,res,next) => {
    
    //remove cloudinary

    


    const user = await User.findById(req.params.id);
    
    if(!user){
        return next (new ErrorHandler(`User does not exists with id : ${req.params.id}`))
    }

    await user.remove();

    res
    .status(200)
    .json({
        success : true,
    });
})