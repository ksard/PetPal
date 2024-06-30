const router = require("express").Router();
const { getLoginUrl, getTokens, getUserData, isAuthenticated, logout }= require("../controllers/authController");

router.route("/login").get(getLoginUrl);
router.route("/callback").get(getTokens);
router.route("/userinfo").get(isAuthenticated, getUserData);
router.route("/logout").get(logout);

module.exports=router;

