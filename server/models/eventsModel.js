const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
  name: { type: String, required: true },
  email: { type: String, required:true },
  picture: { type: String, required: true }
})

const location = new Schema({
  street1: { type: String, required: true },
  street2: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true }
})

const eventSchema = new Schema({
  name: { type: String, required: true },
  hostedBy: user,
  details: { type: String, required: true },
  tags: { type: [String] },
  attendees: [ user ],
  location: location,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  pictures: { type: [String]}
});


const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
