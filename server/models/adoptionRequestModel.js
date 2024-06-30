// server/models/adoptionRequestModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdoptionRequestSchema = new Schema({
  pet: {
    type: Object,
  },
  user: {
    type: Object,
    // required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
});

AdoptionRequestSchema.index({ pet: 1, user: 1 }, { unique: true });

const AdoptionRequest = mongoose.model('AdoptionRequest', AdoptionRequestSchema);

module.exports = { AdoptionRequest };