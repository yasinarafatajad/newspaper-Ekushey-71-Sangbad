import type { Request, Response } from "express";
import Author from "../models/authorSchema.js";
import NewsModel from "../models/newsSchema.js";
import mongoose from "mongoose";

// CREATE AUTHOR
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const author = req.body;

    // Guard: check for existing author with same name + title
    const existingAuthor = await Author.findOne(author);
    if (existingAuthor) {
      return res.status(400).json({
        success: false,
        message: `This author is already exists`,
      });
    }

    const newAuthor = new Author(author);
    const savedAuthor = await newAuthor.save();

    res.status(201).json({
      success: true,
      message: "Author created successfully",
      data: savedAuthor,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create author",
      error: err.message,
    });
  }
};

// GET ALL AUTHORS
export const getAllAuthors = async (req: Request, res: Response) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: authors.length,
      data: authors,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch authors",
      error: err.message,
    });
  }
};

// GET SINGLE AUTHOR
export const getAuthor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const author = await Author.findById(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(200).json(author);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch author",
      error: err.message,
    });
  }
};

// GET NEWS BY AUTHOR
export const getNewsByAuthor = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Guard: id must exist and must be a string
  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing author ID",
    });
  }

  // Guard: valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid author ID format",
    });
  }

  try {
    // find news by author
    const news = await NewsModel.find({
      "author._id" : new mongoose.Types.ObjectId(id),
    }).sort({ createdAt: -1 });

    // send response
    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch author Articles",
      error: err.message,
    });
  }
};

// UPDATE AUTHOR
export const updateAuthor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updatedAuthor = await Author.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Author updated successfully",
      data: updatedAuthor,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update author",
      error: err.message,
    });
  }
};

// DELETE AUTHOR
export const deleteAuthor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Author deleted successfully",
      data: deletedAuthor,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete author",
      error: err.message,
    });
  }
};
