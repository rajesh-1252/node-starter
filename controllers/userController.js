import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request.js";
import UnAuthenticatedError from "../errors/unauthenticated.js";
import User from "../models/User.js";
import { allValuesError } from "../utils/allValuesError.js";
import checkPermission from "../utils/checkPermission.js";
import createTokenUser from "../utils/createTokenUser.js";
import { attachCookiesToResponse } from "../utils/jwt.js";

const getAllUser = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

//--------------------------------------------------------------//

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    throw new BadRequestError("No user with the give id");
  }
  checkPermission(req.user, userId);

  res.status(StatusCodes.OK).json({ user });
};

//--------------------------------------------------------------//

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

//--------------------------------------------------------------//

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  allValuesError([name, email]);

  const updateUser = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(updateUser);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//--------------------------------------------------------------//

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  console.log(req.user);
  allValuesError([oldPassword, newPassword]);

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("old password is wrong");
  }
  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};
export {
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
