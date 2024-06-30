const mongoose = require("mongoose");

const careTakersBookingSchema = new mongoose.Schema({
  careTakerId: {
    type: Number,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  date: Date,
  typeOfPet: String,
  address: String
});

const CareTakersBooking = mongoose.model("CareTakersBooking", careTakersBookingSchema);

module.exports = CareTakersBooking;