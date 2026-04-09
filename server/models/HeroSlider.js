import mongoose from "mongoose";

const HeroSliderSchema = new mongoose.Schema(
  {
    heading: { type: String },
    subtitle: { type: String },
    ctaText: { type: String }, 
    ctaLink: { type: String },
    backgroundImagePath: { type: String },
    animation: { type: String, default: "Fade" },
  },
  { timestamps: true },
);

// CommonJS hata kar ES Module export use karein
const HeroSlider = mongoose.models.HeroSlider || mongoose.model("HeroSlider", HeroSliderSchema);

export default HeroSlider;