import { adminLogin } from "@/controllers/auth";
import { Router } from "express";

export const authRouter = Router();

authRouter.route("/login/admin").post(adminLogin);
