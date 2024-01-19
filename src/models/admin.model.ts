import { AdminModel } from "@/types/models";
import { Model, Schema, model } from "mongoose";

const adminSchema = new Schema<AdminModel>(
	{
		name: {
			type: String,
			min: 3,
			max: 40,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
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

export const Admin: Model<AdminModel> = model<AdminModel>("admin", adminSchema);
