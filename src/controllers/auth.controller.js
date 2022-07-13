import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import User from "../models/User.js";

const register = async (req, res) => {
  const user = await User.create({ ...req.body, role: "user" });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { username: user.username, id: user._id }, token });
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide email and password");
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Invalid email or password");
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Invalid email or password");
  const token = user.createJWT();
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