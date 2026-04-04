import express from 'express';
import { postJob, getJobs, updateJob } from '../controllers/jobController.js';

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(postJob);

router.put('/:id', updateJob);

export default router;