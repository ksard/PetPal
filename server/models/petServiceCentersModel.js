const mongoose = require('mongoose');
const { Schema } = mongoose;

const AvailabilitySchema = new Schema({
  weekdays: {
    type: [String],
    required: true
  },
  weekends: {
    type: [String],
    required: true
  }
});

const PetServiceCentersSchema = new Schema({
  logo: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  operating_hours: {
    type: String,
    required: true
  },
  ratings: {
    type: Number,
    required: true
  },
  specialties: {
    type: [String],
    required: true
  },
  type: {
    type: String,
    enum: ['veterinarian', 'grooming'],
    required: true
  },
  availability: {
    type: AvailabilitySchema,
    required: true
  },
  bookings: {
    type: Map,
    of: [String],
    default: {}
  }
});

const PetServiceCenters = mongoose.model('PetServiceCenters', PetServiceCentersSchema);

module.exports = PetServiceCenters;