import { Router } from "express";
import {
  testRoute,
  getUsers,
  signUp,
} from "../controllers/auth/authController";

const router = Router();

router.get("/test", testRoute);
router.get("/users", getUsers);
router.post("/signup", signUp);

export default router;
