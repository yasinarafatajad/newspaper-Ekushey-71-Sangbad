// server/routes/pdf.ts
import express, { Router } from "express";
import { newsPdf } from "../controllers/newsPdfControllers.js";

const router : Router = express.Router();

// Generate PDF for a news article
router.get("/news/pdf/:slug", newsPdf);

export default router;