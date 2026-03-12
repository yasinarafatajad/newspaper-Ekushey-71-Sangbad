import mongoose, { Schema, Model } from "mongoose";
import type { Category } from "../lib/type.js";

const Category: Schema<Category> = new Schema(
  {
    nameEN: {
      type: String,
      required: true,
      trim: true,
    },
    nameBN: {
      type: String,
      required: true,
      trim: true,
    },
    postCount: {
      type: Number,
      default: 0,
    },
  },{timestamps: true,versionKey:false}
);

const CategorySchema: Model<Category> =
  mongoose.models.Category || mongoose.model<Category>("Categorie", Category);

export default CategorySchema;