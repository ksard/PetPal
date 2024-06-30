const mongoose = require('mongoose');
const { Schema } = mongoose;

const OwnerInfoSchema = new Schema({
  fName: {
    type: String,
    required: true
  },
  lName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

const PetInfoSchema = new Schema({
  petName: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  breed: {
    type: String
  },
  weight: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String
  }
});

const PetCareCenterAppointmentSchema = new Schema({
  centerId: {
    type: String,
    required: true
  },
  centerName: {
    type: String,
    required: true
  },
  centerAddress: {
    type: String,
    required: true
  },
  centerType: {
    type: String,
    enum: ['veterinarian', 'grooming'],
    required: true
  },
  date: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  ownerInfo: {
    type: OwnerInfoSchema,
    required: true
  },
  petInfo: {
    type: PetInfoSchema,
    required: true
  }
});

const PetCareCenterAppointment = mongoose.model('PetCareCenterAppointment', PetCareCenterAppointmentSchema);

module.exports = PetCareCenterAppointment;