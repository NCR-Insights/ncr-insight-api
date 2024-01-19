import { Document } from "mongoose";

export type AssetModel = Document & {
	tag: string;
	assetUrl: string;
	assetType: "image" | "video";
};
