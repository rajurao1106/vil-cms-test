import mongoose from 'mongoose';

const footerLinkSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Link title is required'],
        trim: true 
    },
    url: { 
        type: String, 
        required: [true, 'URL is required'],
        trim: true 
    },
    section: { 
        type: String, 
        enum: ['Quick Links', 'Services', 'Company', 'Legal'], 
        default: 'Quick Links' 
    },
    order: {
        type: Number,
        default: 0 // Links ki sequence maintain karne ke liye
    }
}, { timestamps: true });

const FooterLink = mongoose.model('FooterLink', footerLinkSchema);
export default FooterLink;