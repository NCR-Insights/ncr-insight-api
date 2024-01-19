import { UserModel } from "@/types/models";
import { Model, Schema, model } from "mongoose";

const userSchema = new Schema<UserModel>(
	{
		name: {
			type: String,
			min: 3,
			max: 50,
			trim: true,
			required: true,
		},
		username: {
			type: String,
			min: 3,
			max: 60,
			trim: true,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		avatar: {
			type: String,
			trim: true,
			required: true,
		},
		providerId: {
			type: String,
			trim: true,
			required: true,
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

export const User: Model<UserModel> = model<UserModel>("user", userSchema);
