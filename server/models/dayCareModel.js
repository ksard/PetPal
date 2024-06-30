const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dayCareSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  slot: { type: String, required: true }
});

const Daycare = mongoose.model("Daycare", dayCareSchema);

module.exports = Daycare;
