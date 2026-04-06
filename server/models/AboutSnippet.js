import mongoose from "mongoose";

const aboutSnippetSchema = new mongoose.Schema(
  {
    tagLine: { type: String, trim: true },
    heading: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    ctaText: { type: String },
    ctaLink: { type: String },
    sectionImage: { type: String }, // Path to the image
    quote: { type: String },
    // SEO Fields
    seo: {
      seoTitle: { type: String },
      metaDescription: { type: String },
      keywords: { type: String },
    },
  },
  { timestamps: true }
);

const AboutSnippet = mongoose.models.AboutSnippet || mongoose.model("AboutSnippet", aboutSnippetSchema);

export default AboutSnippet;