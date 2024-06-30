const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PetSchema = new Schema({
  id: {
    type: Number,
  },

  name: {
    type: String,
  },

  species: {
    type: String,
  },

  age: {
    type: Number,
  },

  description: {
    type: String,
  },

  contact: {
    type: String,
  },

  imageUrl: {
    type: String,
  },

  ownerDetails: {
    type: Object,
  },
  status: {
    type: String, 
    default: 'no status'
  }
}, {
    timestamps: true 
});

const _Pet = mongoose.model('pets', PetSchema);

module.exports = { _Pet };
