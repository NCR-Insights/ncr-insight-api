import {
	createAdmin,
	getAllAdmins,
	getCurrentAdmin,
	updatePassword,
} from "@/controllers/admin";
import { isAdmin } from "@/middlewares/auth";
import { Router } from "express";

export const adminRouter = Router();

adminRouter.route("/").get(isAdmin, getCurrentAdmin).post(isAdmin, createAdmin);
adminRouter.route("/update-password").put(isAdmin, updatePassword);
adminRouter.route("/admins").get(isAdmin, getAllAdmins);
