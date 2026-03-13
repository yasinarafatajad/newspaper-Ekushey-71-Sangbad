import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminSchema from "../models/adminSchema.js";
import Author from "../models/authorSchema.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your_super_secret_key_which_should_be_in_env";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, title, location, src, email, username, password } = req.body;

    // Check if user exists by username or email
    const existingAdmin = await adminSchema.findOne({
      $or: [{ username }, { email }],
    });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminSchema({
      name,
      title,
      location,
      src,
      email,
      username,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Admin account created successfully",
      admin: { name, username },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Create case-insensitive regex for the search term
    const searchRegex = new RegExp(`^${username}$`, "i");

    // Check Admin model first
    let user: any = await adminSchema.findOne({
      $or: [
        { username: searchRegex },
        { email: searchRegex },
        { name: searchRegex },
      ],
    });
    let role = "admin";

    // If not found in Admin, check Author model
    if (!user) {
      user = await Author.findOne({
        $or: [
          { username: searchRegex },
          { email: searchRegex },
          { name: searchRegex },
        ],
      });
      role = "author";
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: role,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          name: user.name,
          title: user.title,
          location: user.location,
          src: user.src,
          username: user.username,
          email: user.email,
          role,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    // Check Admin model first
    let user: any = await adminSchema.findOne({ email });
    let model: any = adminSchema;

    // If not found in Admin, check Author model
    if (!user) {
      user = await Author.findOne({ email });
      model = Author;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await model.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
