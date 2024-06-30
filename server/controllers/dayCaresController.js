const DayCare = require("../models/dayCareModel.js");

const getAllDayCares = async (req, res) => {
  try {
    const dayCares = await DayCare.find();
    res.status(200).json(dayCares);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving day cares", error });
  }
};

const getDayCareById = async (req, res) => {
  try {
    const { id } = req.params;

    const daycare = await DayCare.findOne({ id });

    if (!daycare) {
      return res.status(404).json({ message: "Day Care not found" });
    }

    res.status(200).json({ daycare });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Day Care  by ID", error });
  }
};

module.exports = {
  getAllDayCares,
  getDayCareById
};
