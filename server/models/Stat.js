import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g., Sponge Iron Manufacturing
    value: { type: String, required: true }, // e.g., 90,000
    unit: { type: String },                 // e.g., MT, MW
    order: { type: Number, default: 0 }     // Sequence maintain karne ke liye
  },
  { timestamps: true }
);

const Stat = mongoose.models.Stat || mongoose.model("Stat", statSchema);

export default Stat;