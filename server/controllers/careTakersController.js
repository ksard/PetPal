
const CareTaker = require("../models/careTakersModel");

const getAllCareTakers = async (req, res) => {
  try {
    const careTakers = await CareTaker.find();
    res.status(200).json(careTakers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving caretakers", error });
  }
};

const getCareTakerById = async (req, res) => {
  try {
    const { id } = req.params;

    const caretaker = await CareTaker.findOne({ id });

    if (!caretaker) {
      return res.status(404).json({ message: "Care Taker not found" });
    }

    res.status(200).json({ caretaker });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Care Taker by ID", error });
  }
};

module.exports = {
  getAllCareTakers,
  getCareTakerById,
};