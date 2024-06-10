const express = require("express")
const { getAllProducts, createProduct ,updateProduct, deleteProduct, getProductDetails } = require("../contollers/productController.js")

const {isAuthenticatedUser , authorizeRoles} = require("../middlewares/auth.js")
const router = express.Router()


router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser ,authorizeRoles("admin") , createProduct);
router.route("/product/:id")
.put(isAuthenticatedUser ,authorizeRoles("admin")  , updateProduct)
.delete(isAuthenticatedUser ,authorizeRoles("admin")  , deleteProduct)
.get(getProductDetails);

module.exports = router