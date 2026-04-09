import express from 'express';
import { addReview, getReviews, deleteReview ,updateReview} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
    .get(getReviews)
    .post(addReview);

router.delete('/:id', deleteReview);
// routes/reviewRoutes.js
router.route('/:id')
    .put(updateReview) // Ensure this is exported in your controller
    .delete(deleteReview);

export default router;