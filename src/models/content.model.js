import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema(
  {
    text: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // ... other properties
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);
