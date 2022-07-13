import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { loginUser, registerUser } from "../services/auth.service.js";

const register = async (req, res) => {
  const user = await registerUser(req, res)
  res
    .status(StatusCodes.CREATED)
    .json({ user });
}

const login = async (req, res) => {

  const user = await loginUser(req, res)

  res
    .status(StatusCodes.OK)
    .json({ user });
};


export { login, register, verifyToken }