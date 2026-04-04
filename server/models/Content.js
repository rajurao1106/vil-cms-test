import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
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
        type: String, // Storing Rich Text as HTML string
        required: true 
    },
    sectionImage: { 
        type: String, // URL/Path of the image
        required: true
    }
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);
export default Content;