import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    // Basic Info
    productName: { type: String, trim: true },
    urlSlug: { type: String, unique: true, trim: true },
    category: { type: String },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    isActive: { type: Boolean, default: true },
    shortDescription: { type: String },
    fullDescription: { type: String },

    // Dynamic Specifications (Array of objects for "Add" button)
    specifications: [{
        label: { type: String }, // e.g., 10x12 Square
        value: { type: String }  // e.g., 1100 kg
    }],

    // SEO Settings
    seoSettings: {
        seoTitle: { type: String },
        metaDescription: { type: String }
    }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;