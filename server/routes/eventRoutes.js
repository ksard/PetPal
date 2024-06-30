const router = require("express").Router();
const { getAllEvents, filterEvents, insertEvent, fetchUserEvents, attendEvent }= require("../controllers/eventController");
const { isAuthenticated }= require("../controllers/authController");

router.route("/").get(getAllEvents);
router.route("/search").post(filterEvents);
router.route("/").post(insertEvent);
router.route("/userevents").get(isAuthenticated,fetchUserEvents);
router.route("/attend").post(isAuthenticated, attendEvent);

module.exports=router;
