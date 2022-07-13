import express from "express";

import {
  getAllUsers,
  getUser,
  getUserContents,
  deleteUser,
  checkUsername,
  getCurrentUser,
  updateUser,
} from "../controllers/users.controller.js";
import { auth, authorizePermissions } from "../middlewares/authentication.js";

const router = express.Router();

router.route("/").get([auth, getAllUsers]).patch(auth, updateUser);
router.route("/checkUsername").post(checkUsername);
router.route("/currentUser").get(auth, getCurrentUser);
router.route("/:id").get(auth, getUser).delete(auth, deleteUser);
router
  .route("/:id/contents")
  .get(auth, getUserContents);

export default router;
