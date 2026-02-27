import express from "express";
import { changePassword } from "../controllers/user.controller.js";

const router = express.Router();

router.put("/change-password", changePassword);

export default router;

