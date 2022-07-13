import BadRequestError from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import { createTokenUser } from "../utils/createTokenUser.js";
import { attachCookiesToResponse } from '../utils/jwt.js'
import crypto from 'crypto'

const registerUser = async (req, res) => {
  const user = await User.create({ ...req.body, role: "user" });

  const tokenUser = createTokenUser(user);

  const refreshToken = crypto.randomBytes(40).toString('hex');
  const userToken = { refreshToken, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  return tokenUser
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError("Please provide email and password");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("Invalid email or password");
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("Invalid email or password");

  const tokenUser = createTokenUser(user);

  let refreshToken = '';

  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError('Invalid Credentials');
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return tokenUser;
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  const userToken = { refreshToken, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  return tokenUser
}

export { registerUser, loginUser }