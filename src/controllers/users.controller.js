import { StatusCodes } from "http-status-codes";
import { checkUsernameDuplicate, deleteSingleUser, getAllUsersData, getCurrentUserInfo, getSingleUser, getSingleUserContents, updateCurrentUser } from "../services/user.service.js";

const getUser = async (req, res) => {
  
  const user = await getSingleUser(req)

  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await getAllUsersData(req)
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getUserContents = async (req, res) => {
  
  const contents = await getSingleUserContents(req)

  res.status(StatusCodes.OK).json({ user: req.user.id, contents });
};

const deleteUser = async (req, res) => {
  await deleteSingleUser(req)

  res.status(StatusCodes.OK).json({ msg: "User deleted" });
};

const checkUsername = async (req, res) => {
  const isUserExists = await checkUsernameDuplicate(req)
  if (!isUserExists) {
    res.status(StatusCodes.OK).json({ available: true });
    return;
  }
  res.status(StatusCodes.OK).json({ available: false });
};

const getCurrentUser = async (req, res) => {
  const user = await getCurrentUserInfo(req)
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const user = await updateCurrentUser(req)

  res.status(StatusCodes.OK).json({ user });
};

export {
  getUser,
  getAllUsers,
  getUserContents,
  deleteUser,
  checkUsername,
  getCurrentUser,
  updateUser,
};
