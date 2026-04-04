import express from 'express';
import { createPost, getPosts, getPostBySlug } from '../controllers/postController.js';

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(createPost);

router.get('/:slug', getPostBySlug);

export default router;