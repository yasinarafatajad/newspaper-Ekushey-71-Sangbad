import type { Request, Response } from "express";
import CategorySchema from "../models/categorySchema.js";

export const CreateCategory = async (req: Request, res: Response) => {
  try {
    const { nameEN, nameBN } = req.body;

    // Check if category already exists
    const existing = await CategorySchema.findOne({ nameEN });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category with nameEN "${nameEN}" already exists.`,
      });
    }

    const category = await CategorySchema.create(req.body);
    res.status(200).json({ success: true, category });
  } catch (err: unknown) {
    console.error("Create category error:", err);
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, message });
  }
};

export const GetAllCategory = async (req: Request, res: Response) => {
  try {
    // Fetch all categories from DB, sorted by nameEN
    const categories = await CategorySchema.find().sort({ nameEN: 1 });

    // Send success response
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err: unknown) {
    console.error("GetAllCategory error:", err);

    // Send error response
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong while fetching categories.",
    });
  }
};
export const UpdateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nameEN, nameBN } = req.body;

    // validate id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
      });
    }

    // optional validation
    if (!nameEN || !nameBN) {
      return res.status(400).json({
        success: false,
        message: "nameEN and nameBN are required.",
      });
    }

    // check duplicate nameEN (excluding current category)
    const existing = await CategorySchema.findOne({
      nameEN,
      _id: { $ne: id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Category with nameEN "${nameEN}" already exists.`,
      });
    }

    const updatedCategory = await CategorySchema.findByIdAndUpdate(
      id,
      { nameEN, nameBN },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (err: unknown) {
    console.error("UpdateCategory error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Failed to update category.";

    res.status(500).json({
      success: false,
      message,
    });
  }
};
export const DeleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // validate id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
      });
    }

    const deletedCategory = await CategorySchema.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
      data: deletedCategory,
    });

  } catch (err: unknown) {
    console.error("DeleteCategory error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Failed to delete category.";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};