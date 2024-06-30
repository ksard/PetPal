const mongoose = require("mongoose");

const dayCaresBookingSchema = new mongoose.Schema({
  dayCareId: {
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

const DayCaresBooking = mongoose.model("DayCaresBooking", dayCaresBookingSchema);

module.exports = DayCaresBooking;