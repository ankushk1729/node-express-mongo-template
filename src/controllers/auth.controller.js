import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { loginUser, registerUser } from "../services/auth.service.js";

const register = async (req, res) => {
  const {user, token} = await registerUser(req)
  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username, id: user._id }, token });
}

const login = async (req, res) => {

  const {user, token} = await loginUser(req)

  res
    .status(StatusCodes.OK)
    .json({ user: { username: user.username, id: user._id }, token });
};

const verifyToken = async (req, res) => {
  const token = req.body.token;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
    return res.status(200).json({ verified: true });
  } catch (error) {
    return res.status(200).json({ verified: false });
  }
};

export { login, register, verifyToken }