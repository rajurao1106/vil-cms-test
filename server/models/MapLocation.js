import mongoose from 'mongoose';

const mapLocationSchema = new mongoose.Schema({
    mapIframeLink: { 
        type: String, 
        required: [true, 'Map Iframe link is required'],
        trim: true 
    },
    mapLocationLink: { 
        type: String, 
        required: [true, 'Map Location link is required'],
        trim: true 
    }
}, { timestamps: true });

const MapLocation = mongoose.models.MapLocation || mongoose.model('MapLocation', mapLocationSchema);

export default MapLocation;