import express from "express";
import { login, logout, register } from "../controllers/authControllers.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
export default router;
