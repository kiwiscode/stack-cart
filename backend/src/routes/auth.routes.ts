import { Router } from "express";
import { register, login, logout } from "../controllers/auth/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

export default router;
