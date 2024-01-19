import { CategoryModel } from "@/types/models";
import { Model, Schema, model } from "mongoose";

const categorySchema = new Schema<CategoryModel>(
	{
		name: {
			type: String,
			min: 3,
			max: 40,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			min: 3,
			max: 60,
			required: true,
			trim: true,
			unique: true,
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

export const Category: Model<CategoryModel> = model<CategoryModel>(
	"category",
	categorySchema,
);
