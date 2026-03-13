import express, { Router } from "express";
import {
  login,
  resetPassword,
  signup,
} from "../controllers/authControllers.js";

const router: Router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/reset-password", resetPassword);

export default router;
