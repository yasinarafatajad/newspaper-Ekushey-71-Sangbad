import type { Request, Response } from "express";
import Author from "../models/authorSchema.js";
import NewsModel from "../models/newsSchema.js";
import adminSchema from "../models/adminSchema.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

    // Hash password if provided
    if (author.password) {
      const salt = await bcrypt.genSalt(10);
      author.password = await bcrypt.hash(author.password, salt);
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
    const authors = await Author.find().sort({ createdAt: -1 }).lean();

    // Also fetch admins and format them like authors
    const admins = await adminSchema.find().sort({ createdAt: -1 }).lean();

    // Combine them
    const combined = [...authors, ...admins].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.status(200).json({
      success: true,
      count: combined.length,
      data: combined,
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
    let author = await Author.findById(id);

    if (!author) {
      // Check Admin model if not found in Author
      author = await adminSchema.findById(id);
    }

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
      "author._id": new mongoose.Types.ObjectId(id),
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
    const updateData = { ...req.body };

    // Hash password if provided
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      // Don't overwrite with empty password
      delete updateData.password;
    }

    let updatedAuthor = await Author.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAuthor) {
      // Check Admin model
      updatedAuthor = await adminSchema.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    }

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
    let deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      // Check Admin model
      deletedAuthor = await adminSchema.findByIdAndDelete(id);
    }

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
