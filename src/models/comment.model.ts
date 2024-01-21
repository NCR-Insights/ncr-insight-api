import { CommentModel } from "@/types/models";
import { Model, Schema, model } from "mongoose";

const commentSchema = new Schema<CommentModel>(
	{
		news: {
			type: Schema.Types.ObjectId,
			ref: "news",
			required: true,
		},
		parentComment: {
			type: Schema.Types.ObjectId,
			ref: "comment",
			required: false,
			default: null,
		},
		content: {
			type: String,
			required: true,
			trim: true,
			min: 10,
			max: 50000,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "user",
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

export const Comment: Model<CommentModel> = model<CommentModel>(
	"comment",
	commentSchema,
);
