import express, { Router } from "express";
import {
  login,
  resetPassword,
  signup,
  forgotPassword,
  verifyResetCode,
  resetPasswordByCode,
} from "../controllers/authControllers.js";

const router: Router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password-by-code", resetPasswordByCode);

export default router;
