// server/routes/adoptionRoutes.js
const express = require('express');
const { addAdoptionRequest, getAllAdoptionRequests, getAdoptionRequests, updateRequestStatus } = require('../controllers/adoptionController');
const { isAuthenticated } = require('../controllers/authController');

const router = express.Router();

// router.use((req, res, next) => {
//     console.log("Incoming request:", req.method, req.url, req.body);
//     next(); 
// });

// Route to add an adoption request
router.post('/', isAuthenticated, addAdoptionRequest);

// Route to get all adoption requests
router.get('/getAllAdoptionRequests', isAuthenticated, getAllAdoptionRequests);

// Route to get adoption requests for a specific pet
router.get('/:petId', isAuthenticated, getAdoptionRequests);

// Route to update the status of an adoption request
router.patch('/', isAuthenticated, updateRequestStatus);

module.exports = router;


