import {
	createAsset,
	deleteAsset,
	getAllAssets,
	getAssetById,
	updateAsset,
} from "@/controllers/asset";
import { isAdmin } from "@/middlewares/auth";
import { Router } from "express";

export const assetRouter = Router();

assetRouter.route("/").post(isAdmin, createAsset);
assetRouter.route("/assets").get(isAdmin, getAllAssets);
assetRouter
	.route("/:assetId")
	.get(isAdmin, getAssetById)
	.delete(isAdmin, deleteAsset)
	.put(isAdmin, updateAsset);
