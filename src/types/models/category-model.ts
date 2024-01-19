import { Document } from "mongoose";

export type CategoryModel = Document & {
	name: string;
	slug: string;
};
