import express, { Router } from "express";
import { CreateCategory, DeleteCategory, GetAllCategory, UpdateCategory } from "../controllers/categoryControllers.js";

const router : Router = express.Router();

router.post('/addCategory' , CreateCategory)
router.get('/AllCategory' , GetAllCategory)
router.put('/UpdateCategory/:id' , UpdateCategory)
router.delete('/DeleteCategory/:id' , DeleteCategory)

export default router;