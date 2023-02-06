import express from "express";
import {
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController.js";
import { authorizeUser, authorizePermission } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(authorizeUser, authorizePermission("admin"), getAllUser);

router.route("/showMe").get(authorizeUser, showCurrentUser);
router.route("/updateUser").post(authorizeUser, updateUser);
router.route("/updateUserPassword").post(authorizeUser, updateUserPassword);

router.route("/:id").get(authorizeUser, getSingleUser);
export default router;
