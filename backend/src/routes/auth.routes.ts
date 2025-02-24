import { Router } from "express";
import { register, login, logout } from "../controllers/auth/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

interface ProtectedRouteReqBody {
  userId: number;
}

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.post("/protected-route", authMiddleware, async (req, res) => {
  try {
    const { userId }: ProtectedRouteReqBody = req.body;

    console.log("user id received for protected route:", userId);

    res.status(200).json({ success: true, userId });
  } catch (error) {
    console.log("error:", error);
  }
});

export default router;
