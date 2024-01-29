import { Document, Types } from "mongoose";

export type HeadlineModel = Document & {
	title: string;
	coverImage: Types.ObjectId;
	isPublished: boolean;
	category: Types.ObjectId | null;
};
