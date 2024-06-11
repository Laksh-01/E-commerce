const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const { ApiFeatures } = require("../utils/apiFeatures.js");



exports.createProduct = catchAsyncErrors(async(req,res,next) =>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body);

    return res
    .status(201)
    .json({
        success:true,
        product
    })
})



exports.getAllProducts = catchAsyncErrors(async(req,res) =>{
    const resultPerPage = 5;

    const productCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find() , req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const products = await apiFeature.query;
     return res
    .status(200)
    .json({
        success:true,
        products,
        productCount
    })

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


//Create New Review or Update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId  } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    // Check if the product is already reviewed by the user
    const isReviewed = product.reviews.some((rev) => rev._id.toString() === req.user._id.toString());

    
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculate the average rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Review added/updated successfully'
    });
});




exports.getProductReviews = catchAsyncErrors(async(req,res,next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next (new ErrorHandler("Product not found" , 404));
    }

    
    res
    .status(200)
    .json({
        success:true,
        reviews : product.reviews,
    });
});



exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;
    let ratings = 0;

    if (numOfReviews > 0) {
        ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;
    }


    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: false,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});
