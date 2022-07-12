const express = require("express");
const router = express.Router();
const {
  getContent,
  createContent,
  deleteContent,
  deleteAllContents,
  updateContent,
  getPaginatedContents,
} = require("../controllers/contents.controller");
const { authorizePermissions } = require("../middlewares/authentication");

router
  .route("/")
  .get(getPaginatedContents)
  .post(createContent)
  .delete(authorizePermissions("admin"), deleteAllContents);

router.route("/:id").get(getContent).delete(deleteContent).patch(updateContent);

module.exports = router;
