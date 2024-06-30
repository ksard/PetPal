const mongoose = require("mongoose");
const DayCaresBooking = require("../models/dayCaresBooking");

const createDCBooking = async (req, res) => {
  try {
    const {
      dayCareId,
      userEmail,
      firstName,
      lastName,
      email,
      phone,
      date,
      typeOfPet,
      address,
    } = req.body;

    const newBooking = new DayCaresBooking({
      dayCareId,
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
      const { date, dayCareId } = req.params;
  
      // Query bookings for the provided date and daycare ID
      const bookings = await DayCaresBooking.find({ date: new Date(date), dayCareId });
  
      const bookingCount = bookings.length;
  
      res.status(200).json({ bookingCount });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving bookings by date and daycare ID", error });
    }
  };

const getAllBookingsByUseremail = async (req,res) => {
  try {
    const {userEmail} = req.params;
    
    const bookings = await DayCaresBooking.find({ userEmail});

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bookings by user Email Id", error });
  }
};
  

module.exports = {
  createDCBooking,
  getAllBookingsByDateAndCaretaker,
  getAllBookingsByUseremail
};
