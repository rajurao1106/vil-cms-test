import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    filePath: { type: String, required: true }, // Server par file ka path
    category: { 
        type: String, 
        enum: ['Factory', 'Products', 'Office', 'General'], 
        default: 'Factory' 
    },
    altText: { type: String, trim: true },
    fileType: { type: String }, // e.g., image/jpeg
    fileSize: { type: Number }  // Size in bytes
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema);
export default Media;