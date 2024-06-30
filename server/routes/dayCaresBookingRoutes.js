const express = require("express");
const router = express.Router();
const dayCaresBookingController = require("../controllers/dayCaresBookingController");
const { isAuthenticated } = require('../controllers/authController');

router.post("/adddaycarebookings",isAuthenticated, dayCaresBookingController.createDCBooking);
router.get("/dcbookings/:date/:dayCareId", dayCaresBookingController.getAllBookingsByDateAndCaretaker);
router.get("/dcbookingsuseremail/:userEmail", isAuthenticated, dayCaresBookingController.getAllBookingsByUseremail );

module.exports = router;