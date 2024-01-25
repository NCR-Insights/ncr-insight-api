import { getCurrentAdmin } from "@/controllers/admin";
import { isAdmin } from "@/middlewares/auth";
import { Router } from "express";

export const adminRouter = Router();

adminRouter.route("/").get(isAdmin, getCurrentAdmin);
