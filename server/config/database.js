// db
const mongoose = require("mongoose");
const URI = process.env.DB_URI;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};


const { Storage } = require("@google-cloud/storage");

//google cloud storage
const storage = new Storage({

  projectId: "projectname",
  keyFilename: "./service-account.json",

});

module.exports = { connectMongoDB, storage };
