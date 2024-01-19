import { AssetModel } from "@/types/models";
import { Model, Schema, model } from "mongoose";

const assetSchema = new Schema<AssetModel>(
	{
		tag: {
			type: String,
			min: 3,
			max: 70,
			trim: true,
			required: false,
			default: null,
		},
		assetUrl: {
			type: String,
			required: true,
			trim: true,
		},
		assetType: {
			type: String,
			enum: ["image", "video"],
			required: false,
			trim: true,
			default: "image",
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_, returningDoc) => {
				returningDoc["id"] = returningDoc["_id"];
				delete returningDoc["_id"];
			},
		},
	},
);

export const Asset: Model<AssetModel> = model<AssetModel>("asset", assetSchema);
