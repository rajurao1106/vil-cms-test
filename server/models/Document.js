import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    financialYear: { 
        type: String, 
        required: true,
        default: "2025-2026" 
    },
    status: { 
        type: String, 
        enum: ['Published', 'Draft'], 
        default: 'Published' 
    },
    documentTitle: { 
        type: String, 
        required: [true, 'Document title is required'],
        trim: true 
    },
    pdfPath: { 
        type: String, 
        required: [true, 'PDF file path is required'] 
    }
}, { timestamps: true });

const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);

export default Document;