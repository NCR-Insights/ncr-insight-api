import { adminLogin, adminLogout } from "@/controllers/auth";
import { isAdmin } from "@/middlewares/auth";
import { Router } from "express";

export const authRouter = Router();

authRouter.route("/login/admin").post(adminLogin);
authRouter.route("/logout/admin").post(isAdmin, adminLogout);
