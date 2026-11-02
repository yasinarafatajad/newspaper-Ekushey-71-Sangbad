import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import adminSchema from "../models/adminSchema.js";
import Author from "../models/authorSchema.js";
import { sendVerificationEmail } from "../lib/mailer.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your_super_secret_key_which_should_be_in_env";

const RESET_CODE_TTL_MS = 10 * 60 * 1000;

type AccountDoc = {
  _id: unknown;
  email?: string | null;
  phone?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: number | null;
};

// Find an account by email or phone number in Admin first, then Author.
const findAccount = async (
  identifier: string,
): Promise<{ user: AccountDoc; isAdmin: boolean } | null> => {
  const query = {
    $or: [{ email: identifier }, { phone: identifier }],
  };

  const adminUser = await adminSchema.findOne(query).lean();
  if (adminUser) return { user: adminUser as AccountDoc, isAdmin: true };

  const authorUser = await Author.findOne(query).lean();
  if (authorUser) return { user: authorUser as AccountDoc, isAdmin: false };

  return null;
};

// Returns true when the stored (hashed) code matches and has not expired.
const isCodeValid = async (
  user: AccountDoc,
  code: string,
): Promise<boolean> => {
  if (!user.passwordResetToken || !user.passwordResetExpires) return false;
  if (user.passwordResetExpires < Date.now()) return false;
  return bcrypt.compare(code, user.passwordResetToken);
};

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

// Step 1: check that the account exists, then generate and email a code.
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, phone } = req.body;
    const identifier = String(email || phone || "").trim();

    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Email or phone number is required" });
    }

    const account = await findAccount(identifier);
    if (!account) {
      return res
        .status(404)
        .json({ message: "No account found with this email or phone number" });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const hashedCode = await bcrypt.hash(code, 10);

    const model: any = account.isAdmin ? adminSchema : Author;
    await model.updateOne(
      { _id: account.user._id },
      {
        $set: {
          passwordResetToken: hashedCode,
          passwordResetExpires: Date.now() + RESET_CODE_TTL_MS,
        },
      },
    );

    const sent = await sendVerificationEmail({
      email: identifier,
      code,
      type: "reset",
    });

    if (!sent) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.status(200).json({
      message: "Verification code sent to your email",
      email: identifier,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Step 2: verify the emailed code.
export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const { email, phone, code } = req.body;
    const identifier = String(email || phone || "").trim();

    if (!identifier || !code) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required" });
    }

    const account = await findAccount(identifier);
    if (!account) {
      return res
        .status(404)
        .json({ message: "No account found with this email or phone number" });
    }

    const valid = await isCodeValid(account.user, String(code));
    if (!valid) {
      return res
        .status(400)
        .json({ valid: false, message: "Invalid or expired code" });
    }

    res.status(200).json({ valid: true, message: "Code verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Step 3: reset the password after the code has been verified.
export const resetPasswordByCode = async (req: Request, res: Response) => {
  try {
    const { email, phone, code, newPassword } = req.body;
    const identifier = String(email || phone || "").trim();

    if (!identifier || !code || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, code and new password are required" });
    }

    const account = await findAccount(identifier);
    if (!account) {
      return res
        .status(404)
        .json({ message: "No account found with this email or phone number" });
    }

    const valid = await isCodeValid(account.user, String(code));
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const model: any = account.isAdmin ? adminSchema : Author;

    await model.updateOne(
      { _id: account.user._id },
      {
        $set: { password: hashedPassword },
        $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
      },
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Legacy endpoint: reset without a verification code.
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
