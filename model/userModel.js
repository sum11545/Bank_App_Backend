const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "banker"],
      default: "user",
    },
    accountNumber: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    accountType: {
      type: String,
      enum: ["Current", "Saving"],
      default: "Saving",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
