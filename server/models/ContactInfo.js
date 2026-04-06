import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema({
    hrPhone: { type: String, trim: true },
    adminPhone: { type: String, trim: true },
    primaryEmailHR: { type: String, trim: true, lowercase: true },
    adminEmail: { type: String, trim: true, lowercase: true },
    websiteUrl: { type: String, trim: true }
}, { timestamps: true });

const ContactInfo = mongoose.models.ContactInfo || mongoose.model('ContactInfo', contactInfoSchema);

export default ContactInfo;