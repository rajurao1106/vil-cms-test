import Post from '../models/Post.js';

// @desc    Create a new post
export const createPost = async (req, res) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post by slug
export const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (post) res.json(post);
        else res.status(404).json({ message: 'Post not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post by ID
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (post) res.status(200).json(post);
        else res.status(404).json({ message: 'Post not found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete post by ID
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (post) res.status(200).json({ message: 'Post removed' });
        else res.status(404).json({ message: 'Post not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};