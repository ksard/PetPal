const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactInfoSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

const lostAndFoundSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  petName: { type: String },
  species: { type: String },
  breed: { type: String },
  age: { type: Number },
  description: { type: String, required: true },
  status: { type: String, enum: ["lost", "found", "reunited"], required: true },
  message: { type: String },
  dateLostOrFound: { type: Date, required: true },
  contactInfo: { type: contactInfoSchema, required: true },
  imageUrl: { type: String },
});

const LostAndFound = mongoose.model("LostAndFound", lostAndFoundSchema);

module.exports = LostAndFound;
