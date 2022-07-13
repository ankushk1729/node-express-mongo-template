const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  getUserContents,
  deleteUser,
  checkUsername,
  getCurrentUser,
  updateUser,
} = require("../controllers/users.controller");
const { auth, authorizePermissions } = require("../middlewares/authentication");

router.route("/").get([auth, getAllUsers]).patch(auth, updateUser);
router.route("/checkUsername").post(checkUsername);
router.route("/currentUser").get(auth, getCurrentUser);
router.route("/:id").get(auth, getUser).delete(auth, deleteUser);
router
  .route("/:id/contents")
  .get(auth, getUserContents);

module.exports = router;
