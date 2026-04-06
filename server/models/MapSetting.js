import mongoose from 'mongoose';

const mapSettingSchema = new mongoose.Schema({
    embedUrl: { type: String, required: true },
    height: { type: Number, default: 400 },
    title: { type: String, trim: true }
}, { timestamps: true });

const MapSetting = mongoose.models.MapSetting || mongoose.model('MapSetting', mapSettingSchema);

export default MapSetting;