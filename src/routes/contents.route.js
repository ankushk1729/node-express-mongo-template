import express from "express";

import {
  getContent,
  createContent,
  deleteContent,
  deleteAllContents,
  updateContent,
  getPaginatedContents,
} from "../controllers/contents.controller.js";
import { authorizePermissions } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .get(getPaginatedContents)
  .post(createContent)
  .delete(authorizePermissions("admin"), deleteAllContents);

router.route("/:id").get(getContent).delete(deleteContent).patch(updateContent);

export default router;
