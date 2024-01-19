import { Document } from "mongoose";

export type HeadlineModel = Document & {
	title: string;
	coverImage: string;
};
