import express from "express";
import {
  login,
  register,
  verifyToken,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify-token", verifyToken);

export default router;
