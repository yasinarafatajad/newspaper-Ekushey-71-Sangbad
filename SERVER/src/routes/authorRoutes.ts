import express, { Router } from "express";
import { createAuthor, deleteAuthor, getAllAuthors, getAuthor, updateAuthor } from "../controllers/authorControllers.js";

const router : Router = express.Router();

router.post("/addAuthor", createAuthor);
router.get("/getAllAuthor", getAllAuthors);
router.get("/author/:id", getAuthor);
router.put("/author/:id", updateAuthor);
router.delete("/author/:id", deleteAuthor);

export default router;