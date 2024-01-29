import {
	createCategory,
	deleteCategory,
	getCategoryById,
	updateCategory,
} from "@/controllers/category";
import { isAdmin } from "@/middlewares/auth";
import { Router } from "express";

export const categoryRouter = Router();

categoryRouter.route("/").post(isAdmin, createCategory);

categoryRouter
	.route("/:categoryId")
	.get(getCategoryById)
	.put(isAdmin, updateCategory)
	.delete(isAdmin, deleteCategory);
