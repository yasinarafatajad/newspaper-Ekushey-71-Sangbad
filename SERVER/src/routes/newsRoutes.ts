import express, { Router } from "express";
import { DeleteNews, GetAllNews, GetNews, PostNews, UpdateNews } from "../controllers/newsControllers.js";

const router : Router = express.Router();

router.post('/newPost' , PostNews)
router.get('/news/:id' , GetNews)
router.get('/AllNews' , GetAllNews)
router.delete('/DeleteNews/:id' , DeleteNews)
router.put('/UpdateNews/:id' , UpdateNews)

export default router;