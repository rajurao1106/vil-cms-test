import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobTitle: { 
        type: String, 
        required: [true, 'Job title is required'],
        trim: true 
    },
    department: { 
        type: String, 
        trim: true 
    },
    location: { 
        type: String, 
        default: 'Raipur, CG',
        trim: true 
    },
    experience: { 
        type: String, 
        trim: true 
    },
    salary: { 
        type: String, 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'Job description is required'] 
    },
    requirements: [{ 
        type: String // Screenshot mein "Add requirement + Enter" hai, isliye array rakha hai
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;