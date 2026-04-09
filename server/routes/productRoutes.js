import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(createProduct); // Frontend yahan POST karega

router.route('/:id')
    .put(updateProduct)
    .delete(deleteProduct);

export default router;