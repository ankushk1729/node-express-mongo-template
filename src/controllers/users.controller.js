import { StatusCodes } from "http-status-codes";
import { checkUsernameDuplicate, deleteSingleUserData, getAllUsersData, getCurrentUserData, getSingleUserData, getSingleUserContentsData, updateCurrentUserData } from "../services/user.service.js";

const getUser = async (req, res) => {
  
  const user = await getSingleUserData(req)

  res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await getAllUsersData(req)
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const getUserContents = async (req, res) => {
  
  const contents = await getSingleUserContentsData(req)

  res.status(StatusCodes.OK).json({ user: req.user.id, contents });
};

const deleteUser = async (req, res) => {
  await deleteSingleUserData(req)

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
  const user = await getCurrentUserData(req)
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const user = await updateCurrentUserData(req)

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
