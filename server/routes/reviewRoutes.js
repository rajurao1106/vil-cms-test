import express from 'express';
import { addReview, getReviews, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
    .get(getReviews)
    .post(addReview);

router.delete('/:id', deleteReview);

export default router;