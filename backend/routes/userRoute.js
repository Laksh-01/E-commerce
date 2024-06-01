const express = require("express")
const router = express.Router();
const { registerUser, loginUser } = require("../contollers/userController.js")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

module.exports = router;