import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true 
    },
    rating: { 
        type: Number, 
        required: [true, 'Rating is required'],
        min: 1,
        max: 5,
        default: 5
    },
    heading: { 
        type: String, 
        trim: true 
    },
    reviewText: { 
        type: String, 
        required: [true, 'Review text is required'],
        trim: true 
    },
    isApproved: {
        type: Boolean,
        default: false // Admin approval ke liye feature
    }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;