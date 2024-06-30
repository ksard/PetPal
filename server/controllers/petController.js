// server/controllers/petController.js
const { _Pet } = require('../models/petsModel');
const { AdoptionRequest } = require('../models/adoptionRequestModel');

// Get all pets
const getAllPets = async (req, res) => {
  try {
    const pets = await _Pet.find({}).sort({ createdAt: -1 });

    // Fetch all adoption requests
    const adoptionRequests = await AdoptionRequest.find({});

    // Create a map of petId to status
    const adoptionStatusMap = adoptionRequests.reduce((acc, request) => {
      acc[request.pet._id] = request.status;
      return acc;
    }, {});

    // Add status to each pet
    pets.forEach(pet => {
      pet.status = adoptionStatusMap[pet._id] || 'no status';
    });

    res.status(200).json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: 'Error fetching pets', error });
  }
};


// Add a new pet
const addPet = async (req, res) => {
  try {
    const petData = req.body;
    petData.ownerDetails = req.session.user;
    const newPet = new _Pet(petData);
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ message: 'Error adding pet', error });
  }
};

module.exports = { getAllPets, addPet };
