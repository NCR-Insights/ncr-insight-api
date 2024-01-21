import { Document, Types } from "mongoose";

export type CommentModel = Document & {
	news: Types.ObjectId;
	parentComment: Types.ObjectId | null;
	content: string;
	author: Types.ObjectId;
};
