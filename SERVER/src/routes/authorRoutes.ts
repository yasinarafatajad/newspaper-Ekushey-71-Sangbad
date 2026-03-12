import express from "express";
import { AddProduct, DeleteProduct, GetAllProducts, GetProduct } from "../controllers/product.js";

const router = express.Router();

router.get('/AllProducts' , GetAllProducts)
router.get('/Product/:id' , GetProduct)
router.post('/AddProduct' , AddProduct)
router.delete('/DeleteProduct/:id' , DeleteProduct)

export default router;