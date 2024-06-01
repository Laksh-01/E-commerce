const express = require("express")
const { getAllProducts, createProduct ,updateProduct, deleteProduct, getProductDetails } = require("../contollers/productController.js")

const {isAuthenticatedUser} = require("../middlewares/auth.js")
const router = express.Router()


router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser , createProduct);
router.route("/product/:id").put(isAuthenticatedUser , updateProduct).delete(isAuthenticatedUser , deleteProduct).get(getProductDetails);

module.exports = router