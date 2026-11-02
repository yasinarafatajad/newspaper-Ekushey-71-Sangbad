import mongoose from "mongoose";

const { Schema } = mongoose;

const Admin = new Schema(
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
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
      sparse: true,
    },
    passwordResetExpires: {
      type: Number,
      default: null,
      sparse: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const adminSchema = mongoose.model("Admin", Admin);

export default adminSchema;
