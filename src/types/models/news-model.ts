import { Document, Types } from "mongoose";

export type NewsModel = Document & {
	content: string;
	heading: string | null;
	author: Types.ObjectId | null;
	isPublished: boolean;
};
