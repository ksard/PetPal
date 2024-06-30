const mongoose = require("mongoose");
const LostAndFoundPets = require("../models/lostAndFoundPetsModel");
const { uploadImageToStorage } = require("../utils/imageUtil");

const reportLostPet = async (req, res) => {
  try {
    const {
      petName,
      species,
      breed,
      age,
      description,
      status,
      message,
      dateLostOrFound,
      contactInfo,
      imageUrl,
    } = req.body;

    const files = req.files;
    let resMessage = null;
    const uploadedUrls = await uploadImageToStorage(
      files,
      process.env.LOSTANDFOUND_FOLDER
    );
    if (files?.length > 0 && !uploadedUrls) {
      resMessage = "Failed to upload images &";
    }

    const newLostReport = new LostAndFoundPets({
      id: new mongoose.Types.ObjectId().toString(),
      petName,
      species,
      breed,
      age,
      description,
      status: "lost",
      message,
      dateLostOrFound,
      contactInfo: JSON.parse(req.body.contactInfo),
      imageUrl: uploadedUrls[0],
    });

    // Saving the new report to the database
    await newLostReport.save();

    res.status(201).json({
      message: "Lost pet report created successfully",
      report: newLostReport,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const reportFoundPet = async (req, res) => {
  try {
    const {
      petName,
      species,
      breed,
      age,
      description,
      status,
      message,
      dateLostOrFound,
      contactInfo,
      imageUrl,
    } = req.body;

    const files = req.files;
    let resMessage = null;
    const uploadedUrls = await uploadImageToStorage(
      files,
      process.env.LOSTANDFOUND_FOLDER
    );
    if (files?.length > 0 && !uploadedUrls) {
      resMessage = "Failed to upload images &";
    }
    const newReport = new LostAndFoundPets({
      id: new mongoose.Types.ObjectId().toString(),
      petName,
      species,
      breed,
      age,
      description,
      status: "found",
      message,
      dateLostOrFound,
      contactInfo: JSON.parse(req.body.contactInfo),
      imageUrl: uploadedUrls[0],
    });
    await newReport.save();
    res.status(201).json({
      message: "Found pet report created successfully",
      report: newReport,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllLostPets = async (req, res) => {
  try {
    const lostPets = await LostAndFoundPets.find({ status: "lost" });
    res.status(200).json(lostPets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving lost pets", error });
  }
};

const getAllFoundPets = async (req, res) => {
  try {
    const foundPets = await LostAndFoundPets.find({ status: "found" });
    res.status(200).json(foundPets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving found pets", error });
  }
};

const deletePetReport = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await LostAndFoundPets.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Pet report not found" });
    }

    res.status(200).json({ message: "Pet report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pet report", error });
  }
};

module.exports = {
  reportLostPet,
  reportFoundPet,
  getAllLostPets,
  getAllFoundPets,
  deletePetReport,
};
