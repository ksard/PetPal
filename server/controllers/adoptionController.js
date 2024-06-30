// server/controllers/adoptionController.js

const { AdoptionRequest } = require('../models/adoptionRequestModel');
const { _Pet } = require('../models/petsModel');

const addAdoptionRequest = async (req, res) => {
  try {
    const { pet } = req.body;
    const user = req.session.user; // Get user from session


    const existingRequest = await AdoptionRequest.findOne({ pet, user });

    if (existingRequest) {
      return res.status(400).json({ message: 'Adoption request already exists for this pet by this user' });
    }

    const newRequest = new AdoptionRequest({ pet, user, status: 'pending', requestDate: new Date() });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error adding adoption request', error });
  }
};

const getAdoptionRequestForPet = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ petId: req.params.petId })
      .sort({ requestDate: -1 }); 
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching adoption requests', error });
  }
};

const getAllAdoptionRequests = async (req, res) => {
  try {
    const allAdoptionRequests = await AdoptionRequest.find({})
      .sort({ requestDate: -1 }); 
    res.status(200).json(allAdoptionRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching allAdoptionRequests', error });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const request = await AdoptionRequest.findByIdAndUpdate(requestId, { status }, { new: true });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request status', error });
  }
};

module.exports = { addAdoptionRequest, getAdoptionRequests: getAdoptionRequestForPet, updateRequestStatus, getAllAdoptionRequests };

