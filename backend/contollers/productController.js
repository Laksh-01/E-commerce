const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js")



exports.createProduct = catchAsyncErrors(async(req,res,next) =>{
    const product = await Product.create(req.body);

    return res
    .status(201)
    .json({
        success:true,
        product
    })
})



exports.getAllProducts = catchAsyncErrors(async(req,res) =>{
    const products = await Product.find({});
     return res
    .status(200)
    .json(products)
})


exports.updateProduct = catchAsyncErrors(async(req,res,next) => {
    let product = Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorHandler("Product not found" , 500));
     }

    product = await Product.findByIdAndUpdate(req.params.id , req.body , {
        new:true,
        runValidators : true,
        useFindAndModify : false
    });

    return res
    .status(200)
    .json({
        success: true,
        product
    })
})



exports.deleteProduct = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found" , 404));
     }

    await Product.findByIdAndDelete(req.params.id)

    return res
    .status(200)
    .json({
        success:true,
        message:"Product deleted successfully"
    })
})

exports.getProductDetails = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
       return next(new ErrorHandler("Product not found" , 404));
    }
    return res
    .status(200)
    .json({
        success:true,
        product
    })


})