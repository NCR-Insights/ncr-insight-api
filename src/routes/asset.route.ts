import { createAsset, deleteAsset } from "@/controllers/asset";
import { isAdmin } from "@/middlewares/auth";
import { Router } from "express";

export const assetRouter = Router();

assetRouter.route("/").post(isAdmin, createAsset);
assetRouter.route("/:assetId").delete(isAdmin, deleteAsset);
