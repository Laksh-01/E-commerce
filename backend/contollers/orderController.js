const Order = require ("../models/orderModel.js");
const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const { ApiFeatures } = require("../utils/apiFeatures.js");


//Create new order

exports.newOrder = catchAsyncErrors(async(req,res,next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo , 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo , 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id,
    });

    res
    .status(201)
    .json({
        success:true,
        order,
    })
})


//get single order

exports.getSingleOrder = catchAsyncErrors(async(req,res,next) => {

    //user  ka name aur email miljayega
    const order = await Order.findById(req.params.id).populate("user" , "name email");

    if(!order){
        return next(new ErrorHandler("Order not found with this id") , 404);
    }

    res
    .status(200)
    .json({
        success:true,
        order,
    })
})


//get logged in users orders

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user : req.user._id});

    res
    .status(200)
    .json({
        success:true,
        orders
    })
})


//all orders for admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();
    
    let totalAmt = 0;
    orders.forEach((order) => {
        totalAmt += order.totalPrice;
    })


    res
    .status(200)
    .json({
        success:true,
        totalAmt,
        orders
    })
})

//update order status - admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this Id") , 404);
    }

    if(order.orderStatus === "Delivered"){
        return next( new ErrorHandler("You have already delivered this order", 404));
    }

    order.orderItems.forEach(async(val) => {
        await updateStock(val.Product , val.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.status === 'Delivered'){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave : false});

    res
    .status(200)
    .json({
        success:true,
    })
})


async function updateStock (id,quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({validateBeforeSave : false});
}


//delete order  - admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this Id") , 404);
    }

    await order.deleteOne();

    res
    .status(200)
    .json({
        success:true,
    })
})
