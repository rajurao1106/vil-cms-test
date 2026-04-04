import mongoose from 'mongoose';

const boardMemberSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: [true, 'Full name is required'],
        trim: true 
    },
    designation: { 
        type: String, 
        required: [true, 'Designation is required'],
        trim: true 
    },
    shortBio: { 
        type: String, 
        trim: true 
    },
    profileImageUrl: { 
        type: String, 
        required: [true, 'Profile image is required'] 
    },
    detailedCvPdfLink: { 
        type: String, // PDF storage path or URL
        trim: true 
    },
    order: {
        type: Number, // Display sequence set karne ke liye
        default: 0
    }
}, { timestamps: true });

const BoardMember = mongoose.model('BoardMember', boardMemberSchema);
export default BoardMember;