const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema(
  {
    text: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // ... other properties
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", ContentSchema);
