import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema({
    programmeTitle: { 
        type: String, 
        required: [true, 'Programme title is required'],
        trim: true 
    },
    reviewDate: { 
        type: Date, 
        required: [true, 'Review date is required'] 
    },
    programmeContent: { 
        type: String, // Rich Text (HTML)
        required: true 
    },
    pdfUrl: { 
        type: String, // Link to the uploaded PDF file
        required: true 
    }
}, { timestamps: true });

const Programme = mongoose.models.Programme || mongoose.model('Programme', programmeSchema);

export default Programme;