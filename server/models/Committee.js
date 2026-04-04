import mongoose from 'mongoose';

const committeeSchema = new mongoose.Schema({
    committeeName: { 
        type: String, 
        required: [true, 'Committee name is required'],
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    members: [{
        name: { type: String, required: true },
        designation: { type: String }, // e.g., Chairman, Member
    }]
}, { timestamps: true });

const Committee = mongoose.model('Committee', committeeSchema);
export default Committee;