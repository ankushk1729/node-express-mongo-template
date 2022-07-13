import jwt from "jsonwebtoken";
import UnauthenticatedError from "../errors/unauthenticated.js";
import { isTokenValid, attachCookiesToResponse } from '../utils/jwt.js'
import Token from '../models/token.model.js'

export const auth = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError('Authentication Invalid');
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid');
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthenticatedError("Access Forbidden");
    next();
  };
};


