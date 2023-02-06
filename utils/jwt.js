import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
const createJwt = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => {
  const isValid = jwt.verify(token, process.env.JWT_SECRET);
  return isValid;
};

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJwt({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production", // https only
    signed: true, // it can detuct if the client modify the cookie
  });
};
export { createJwt, attachCookiesToResponse, isTokenValid };
