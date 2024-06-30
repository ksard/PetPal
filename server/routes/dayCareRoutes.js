const express = require("express");
const dayCaresController = require("../controllers/dayCaresController");
const { isAuthenticated } = require('../controllers/authController');

const router = express.Router();

router.get("/dayCares", dayCaresController.getAllDayCares);
router.get("/dayCareByID/:id",isAuthenticated, dayCaresController.getDayCareById);

module.exports = router;