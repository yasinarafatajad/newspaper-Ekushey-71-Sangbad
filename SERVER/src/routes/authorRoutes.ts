import express, { Router } from "express";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthor,
  getNewsByAuthor,
  updateAuthor,
} from "../controllers/authorControllers.js";

const router: Router = express.Router();

// Add Author
router.post("/addAuthor", createAuthor);

// Get All Authors
router.get("/AllAuthors", getAllAuthors);

// Get Single Author
router.get("/author/:id", getAuthor);

// Get News By Author
router.get("/NewsByAuthor/:id", getNewsByAuthor);

// Update Author
router.put("/author/:id", updateAuthor);

// Delete Author
router.delete("/author/:id", deleteAuthor);

export default router;
