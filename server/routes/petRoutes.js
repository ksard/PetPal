//server/routes/petRoutes.js

const express = require('express');
const { getAllPets, addPet } = require('../controllers/petController');
const { isAuthenticated } = require('../controllers/authController');

const router = express.Router();

// router.use((req, res, next) => {
//     console.log("Incoming request:", req.method, req.url, req.body);
//     next(); 
// });

// Route to get all pets
router.get('/pets', getAllPets);

// Route to add a new pet
router.post('/pets', isAuthenticated, addPet);

module.exports = router;
