import { NewsModel } from "@/types/models";
import { Model, Schema, model } from "mongoose";

const newsSchema = new Schema<NewsModel>(
	{
		heading: {
			type: String,
			required: false,
			default: null,
			min: 10,
			max: 90,
			trim: true,
		},
		content: {
			type: String,
			trim: true,
			required: true,
			min: 50,
			max: 50000,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: false,
			default: null,
		},
		isPublished: {
			type: Boolean,
			required: true,
			default: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_, returningDoc) => {
				returningDoc["id"] = returningDoc["_id"];
				delete returningDoc["id"];
			},
		},
	},
);

export const News: Model<NewsModel> = model<NewsModel>("news", newsSchema);
