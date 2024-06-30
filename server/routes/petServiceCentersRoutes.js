const router = require("express").Router();
const { getAllServiceCenters, getAvailableSlots, bookAppointment, getAllAppointments }= require("../controllers/petServiceCentersController");
const { isAuthenticated }= require("../controllers/authController");

router.route("/").get(getAllServiceCenters);
router.route("/available-slots").get(getAvailableSlots);
router.route("/petcare-appointments").get(isAuthenticated, getAllAppointments);
router.route("/book-appointment").post(isAuthenticated, bookAppointment);

module.exports=router;
