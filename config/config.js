const mongoose = require("mongoose");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed To Connect MongoDB", err);
  });

module.exports;
