const express = require("express");
const router = express.Router();
const careTakersController = require("../controllers/careTakersController");
const { isAuthenticated } = require('../controllers/authController');

router.get("/careTakers", careTakersController.getAllCareTakers);
router.get("/careTakerByID/:id",isAuthenticated, careTakersController.getCareTakerById);


module.exports = router;