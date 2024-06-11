const express = require("express")
const router = express.Router();
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUsers } = require("../contollers/userController.js")
const {isAuthenticatedUser , authorizeRoles} = require("../middlewares/auth.js");

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get( isAuthenticatedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatedUser,updatePassword )
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin") , getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin") , getSingleUsers);
module.exports = router;