import express from 'express';
// deleteJob ko controller se import karna na bhoolein
import { postJob, getJobs, updateJob, deleteJob } from '../controllers/jobController.js';

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(postJob);

// Is section ko update karein
router.route('/:id')
    .put(updateJob)
    .delete(deleteJob); // <-- Yeh line add karein

export default router;