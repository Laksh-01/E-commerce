const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Your name"],
        maxLength:[30 , "Can't exceed 30 char"],
        minLength:[4,"should have more than 4"]
    },
    email:{
        type:String,
        unique:true,
        required:[true,"Please Enter Your email"],
        validate : [validator.isEmail , "Please enter a valid Email"]
    },
    password : {
        type:String , 
        required:[true , "Enter Your password"],
        minLength : [8,"Password should be greater than 8 characters"],
        select:false,
    },
    avatar : {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
    },
    role:{
        type:String,
        required:true
    },

    resetPasswordToken : String,
    resestPasswordExpire : Date,
    
});

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password , 10)
})


//JWT TOKEN
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id:this._id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRE,
    })
}

//COMPARE PASSWORDS
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
}

//GENERATING PASSWORD RESET TOKEN
userSchema.methods.getResetPasswordToken = async function(){
    //hex makes string
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding to user Schema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");


    this.resestPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User" , userSchema);