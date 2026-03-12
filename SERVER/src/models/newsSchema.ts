import mongoose, { Schema, model, Document } from "mongoose";

// TypeScript interfaces
import type { AUTHOR, NEWS } from "../lib/type.js";

// Mongoose Author schema
const authorSchema = new Schema<AUTHOR & Document>({
  name: { type: String, required: true },
  src: { type: String, required: true },
  location: { type: String, required: true },
});

// Mongoose News schema
const newsSchema = new Schema<NEWS & Document>({
  bnTitle: { type: String, required: true },
  enTitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true, },
  content: { type: String, required: true },
  categoryEN: { type: String, required: true },
  categoryBN: { type: String, required: true },
  author: { type: authorSchema, required: true }, 
  featuredImage: { type: String, required: true },
  imageCaption: { type: String },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, required: true, default: "draft" },

}, { timestamps: true, versionKey: false });

// Create model
const NewsModel = model<NEWS & Document>("News", newsSchema);

export default NewsModel;