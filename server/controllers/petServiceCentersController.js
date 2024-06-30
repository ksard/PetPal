const PetServiceCenters = require("../models/petServiceCentersModel")
const PetCareCenterAppointment = require('../models/petServiceAppoitment');
const dotenv = require("dotenv");
dotenv.config();

const getAllServiceCenters = async (req, res) => {
    try {
      const serviceCenters = await PetServiceCenters.find();
      res.status(200).json({serviceCenters});
    } catch (error) {
      res.status(500).json({ message: "Error retrieving caretakers", error });
    }
  };

const getAvailableSlots = async (req, res) => {
  const { petServiceCenterId, date } = req.query;
  try {
    const petServiceCenter = await PetServiceCenters.findOne({ _id: petServiceCenterId }).exec();
    if (!petServiceCenter) return res.status(404).send('Pet Service Center not found');
    const day = new Date(date).getDay();

    let slots;
    if (day === 0 || day === 6) { 
      slots = petServiceCenter.availability.weekends;
    } else {
      slots = petServiceCenter.availability.weekdays;
    }

    const bookedSlots = petServiceCenter.bookings.get(date) || [];

    const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).send('Internal server error');
  }
}

const getAllAppointments = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send('Email query parameter is required');
  }

  try {
    const appointments = await PetCareCenterAppointment.find({ 'ownerInfo.email': email });
    if (appointments.length === 0) {
      return res.status(200).send('You Do not have any appointments made');
    }
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send('Internal server error');
  }
}

const bookAppointment = async (req, res) => {
  const {
    centerId,
    centerName,
    centerAddress,
    centerType,
    date,
    slot,
    ownerInfo,
    petInfo
  } = req.body;

  try {
    const petServiceCenter = await PetServiceCenters.findOne({ _id: centerId }).exec();
    if (!petServiceCenter) return res.status(404).send('Pet Service Center not found');

    const day = new Date(date).getDay();
    let slots;
    if (day === 0 || day === 6) {
      slots = petServiceCenter.availability.weekends;
    } else {
      slots = petServiceCenter.availability.weekdays;
    }

    const bookedSlots = petServiceCenter.bookings.get(date) || [];
    if (bookedSlots.includes(slot)) return res.status(200).send('Slot already booked');

    const slotIndex = slots.indexOf(slot);
    if (slotIndex === -1) return res.status(200).send('Slot not available');

    bookedSlots.push(slot);
    petServiceCenter.bookings.set(date, bookedSlots);

    await petServiceCenter.save();

    const petCareCenterappointment = new PetCareCenterAppointment({
      centerId,
      centerName,
      centerAddress,
      centerType,
      date,
      slot,
      ownerInfo,
      petInfo
    });
    await petCareCenterappointment.save();
    res.send('Booking confirmed');
  } catch (error) {
    console.error('Error booking slot:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  getAllServiceCenters,
  getAvailableSlots,
  bookAppointment,
  getAllAppointments
};