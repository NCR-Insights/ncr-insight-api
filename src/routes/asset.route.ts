import { createAsset } from "@/controllers/asset";
import { isAdmin } from "@/middlewares/auth";
import { Router } from "express";

export const assetRouter = Router();

assetRouter.route("/").post(isAdmin, createAsset);
