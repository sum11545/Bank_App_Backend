const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: { type: String, enum: ["deposit", "withdraw"] },
    amount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
