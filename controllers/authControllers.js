import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
import { allValuesError } from "../utils/allValuesError.js";
import { attachCookiesToResponse, createTokenUser } from "../utils/index.js";
const register = async (req, res) => {
  const { email, name, password } = req.body;
  allValuesError([email, name, password]);
  const emailAlreadyExist = User.findOne({ email });

  if (!emailAlreadyExist) {
    throw new BadRequestError("Email already Exist");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// ------------------------------------------------------------//

const login = async (req, res) => {
  const { email, password } = req.body;
  allValuesError([email, password]);
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("User not found");
  }
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invaild Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// ------------------------------------------------------------//

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged Out" });
};
export { register, login, logout };
