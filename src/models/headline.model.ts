import { HeadlineModel } from "@/types/models";
import { Model, Schema, model } from "mongoose";

const headlineSchema = new Schema<HeadlineModel>(
	{
		title: {
			type: String,
			min: 15,
			max: 70,
			trim: true,
			required: true,
		},
		coverImage: {
			type: String,
			trim: true,
			required: true,
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

export const Headline: Model<HeadlineModel> = model<HeadlineModel>(
	"headline",
	headlineSchema,
);
