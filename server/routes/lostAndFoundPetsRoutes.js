const express = require("express");
const router = express.Router();
const lostAndFoundPetsController = require("../controllers/lostAndFoundPetsController");
const { isAuthenticated } = require("../controllers/authController");

router
  .route("/lost-pet")
  .post(isAuthenticated, lostAndFoundPetsController.reportLostPet);

router
  .route("/found-pet")
  .post(isAuthenticated, lostAndFoundPetsController.reportFoundPet);

router
  .route("/pet-remove/:id")
  .delete(isAuthenticated, lostAndFoundPetsController.deletePetReport);

router.route("/all-lost-pets").get(lostAndFoundPetsController.getAllLostPets);

router.route("/all-found-pets").get(lostAndFoundPetsController.getAllFoundPets);

module.exports = router;
