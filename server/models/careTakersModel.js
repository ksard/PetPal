const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const careTakerSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
});

const CareTaker = mongoose.model("CareTaker", careTakerSchema);

module.exports = CareTaker;
