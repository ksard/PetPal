const mongoose = require("mongoose");
const CareTakersBooking = require("../models/CareTakersBooking");

const createBooking = async (req, res) => {
  try {
    const {
      careTakerId,
      userEmail,
      firstName,
      lastName,
      email,
      phone,
      date,
      typeOfPet,
      address,
    } = req.body;

    const newBooking = new CareTakersBooking({
      id: new mongoose.Types.ObjectId().toString(),
      careTakerId,
      userEmail,
      firstName,
      lastName,
      email,
      phone,
      date,
      typeOfPet,
      address,
    });

    // Saving the new booking to the database
    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllBookingsByDateAndCaretaker = async (req, res) => {
  try {
    const { date, careTakerId } = req.params;

    // Query bookings for the provided date and caretaker ID
    const bookings = await CareTakersBooking.find({ date, careTakerId });

    if (bookings.length > 0) {
      res.status(200).json({ isBooked: true });
    } else {
      res.status(200).json({ isBooked: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookings by date and caretaker ID", error });
  }
};

const getAllBookingsByUseremail = async (req,res) => {
  try {
    const {userEmail} = req.params;
    
    const bookings = await CareTakersBooking.find({ userEmail});

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookings by user Email Id", error });
  }
};

module.exports = {
  createBooking,
  getAllBookingsByDateAndCaretaker,
  getAllBookingsByUseremail
};
