import { Router } from "express";
import { testRoute } from "../controllers/auth/authController";

const router = Router();

router.get("/test", testRoute);

export default router;
