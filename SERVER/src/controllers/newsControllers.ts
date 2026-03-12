import type { Request, Response } from "express";
import newsSchema from "../models/newsSchema.js";

export const PostNews = async (req: Request, res: Response) => {
  try {
    const newsData = req.body;
    // Save to MongoDB
    const news = await newsSchema.create(newsData);

    res.status(201).json({ message: "News posted", data: news });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error saving news:", err.message);
      console.error(err.stack); // optional, shows full stack
      res.status(500).json({ message: `SERVER: couldn't post this news`, error: err.message });
    } else {
      res.status(500).json({ message: "SERVER: unknown error" });
    }
  }
};

export const GetNews = async (req : Request, res : Response) => {
  try {
    const { id } = req.params;
    const result = await newsSchema.findOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    throw new Error('SERVER: couldn\'t get this news');
  }
};

export const GetAllNews = async (req : Request, res : Response) => {
  try {
    const AllProducts = await newsSchema.find();
    res.status(200).json(AllProducts);
  } catch (err) {
    throw new Error('SERVER: couldn\'t get all news');
  }
};

export const DeleteNews = async (req : Request, res : Response) => {
  try {
    const { id } = req.params;
    const result = await newsSchema.findOneAndDelete({ _id: id });
    if (!result) {
      res.status(500).json('Product Doesn\'t exist in Database.')
    }
    res.status(200).json("Deleted..!");
  } catch (err) {
    throw new Error('SERVER: couldn\'t delete this news');
  }
};

// Update a news by ID
export const UpdateNews = async (req: Request, res: Response) => {
  const { id } = req.params;
  const formData = req.body; // Partial<NEWS>, only fields to update

  try {
    // Find and update the news
    const updatedNews = await newsSchema.findByIdAndUpdate(
      id,
      { $set: formData },
      { new: true, runValidators: true } // return updated doc & validate
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News not found in database." });
    }

    res.status(200).json({ message: "News updated successfully.", data: updatedNews });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      res.status(500).json({ message: "SERVER: couldn't update this news.", error: err.message });
    } else {
      res.status(500).json({ message: "SERVER: unknown error during update." });
    }
  }
};
