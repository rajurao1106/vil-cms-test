import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    pageTitle: { 
        type: String, 
        required: true,
        trim: true 
    },
    subtitle: { 
        type: String,
        trim: true 
    },
    mainContent: { 
        type: String, // Rich Text content stored as HTML string
        required: true 
    },
    sectionImage: { 
        type: String // URL of the image
    },
    category: {
        type: String,
        enum: ['The Company', 'Vision & Mission', 'Chairman Message', 'Board of Directors', 'Committees', 'Familiarization'],
        required: true
    }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);
export default Company;