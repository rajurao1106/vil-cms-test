import mongoose from "mongoose";

const HeroSliderSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    subtitle: { type: String },
    ctaText: { type: String },
    ctaLink: { type: String },
    backgroundImagePath: { type: String, required: true },
    animation: { type: String, default: "Fade" },
  },
  { timestamps: true },
);

// CommonJS hata kar ES Module export use karein
const HeroSlider = mongoose.models.HeroSlider || mongoose.model("HeroSlider", HeroSliderSchema);

export default HeroSlider;