const express = require("express");
const router = express.Router();
const careTakersBookingController = require("../controllers/careTakersBookingController");
const { isAuthenticated } = require('../controllers/authController');

router.post("/addcaretakersbookings", isAuthenticated, careTakersBookingController.createBooking);
router.get("/bookings/:date/:careTakerId", careTakersBookingController.getAllBookingsByDateAndCaretaker);
router.get("/bookingsuseremail/:userEmail", isAuthenticated, careTakersBookingController.getAllBookingsByUseremail);

module.exports = router;