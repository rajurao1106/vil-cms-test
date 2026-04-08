import express from 'express';
import { 
    createPost, 
    getPosts, 
    getPostBySlug, 
    updatePost, 
    deletePost 
} from '../controllers/postController.js';

const router = express.Router();

// Base routes: /api/posts
router.route('/')
    .get(getPosts)
    .post(createPost);

// Move the ID route ABOVE the slug route
router.route('/:id')
    .put(updatePost)
    .delete(deletePost);

router.get('/:slug', getPostBySlug);

export default router;