import jwt from "jsonwebtoken";
import { isTokenValid } from "../utils/index.js";
import { UnAuthenticatedError, UnAuthorizedError } from "../errors/index.js";

const authorizeUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = req.signedCookies.token; // signed cookies will be in req.signedCookies and regular cookies or unsigned cookies will be in req.cookies
  if (!token) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }

  try {
    const payload = isTokenValid({ token });
    const { name, email, userId, role } = payload;
    req.user = { userId, name, email, role };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(roles.includes(req.user.role));
      throw new UnAuthorizedError("Not authorized to access this route");
    }
    next();
  };
};

export { authorizeUser, authorizePermission };
