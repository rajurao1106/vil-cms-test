import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    type: { type: String, enum: ['News', 'Blog', 'Update'], default: 'News' },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    author: { type: String, default: 'Admin' },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true }, // Rich Text HTML
    coverImage: { type: String }, // Path or URL to the image
    tags: [{ type: String }] // Array of strings for "Add tag" feature
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;