import mongoose from "mongoose";

const { Schema } = mongoose;

const Author = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    src: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
  },{timestamps: true, versionKey:false}
);

const authorSchema = mongoose.model("Author", Author);

export default authorSchema;