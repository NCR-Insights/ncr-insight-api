import { Document } from "mongoose";

export type AdminModel = Document & {
	name: string;
	email: string;
	password: string;
	isActive: boolean;
};
