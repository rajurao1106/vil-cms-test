import mongoose from 'mongoose';

const chairmanMessageSchema = new mongoose.Schema({
    sectionTitle: { 
        type: String, 
        required: true,
        trim: true,
        default: "Chairman's Message"
    },
    authorName: { 
        type: String, 
        required: true,
        trim: true 
    },
    messageContent: { 
        type: String, // Rich Text content stored as HTML string
        required: true 
    },
    signatureImagePath: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const ChairmanMessage = mongoose.model('ChairmanMessage', chairmanMessageSchema);
export default ChairmanMessage;