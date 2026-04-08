import mongoose from 'mongoose';

const visionMissionSchema = new mongoose.Schema({
    sectionTitle: { 
        type: String, 
        required: true,
        trim: true 
    }, 
    visionStatement: { 
        type: String, 
        required: true 
    },
    missionStatement: { 
        type: String, 
        required: true 
    },
    backgroundImage: { 
        type: String, // URL/Path to the image
        required: true 
    }
}, { timestamps: true });

const VisionMission = mongoose.model('VisionMission', visionMissionSchema);
export default VisionMission;