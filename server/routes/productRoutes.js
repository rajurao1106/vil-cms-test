import express from 'express';
import { createProduct, getProducts, getProductBySlug } from '../controllers/productController.js';

const router = express.Router();

router.route('/')
    .post(createProduct)
    .get(getProducts);

router.get('/:slug', getProductBySlug);

export default router;