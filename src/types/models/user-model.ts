import { Document } from "mongoose";

export type UserModel = Document & {
	username: string;
	name: string;
	avatar: string;
	email: string;
	providerId: string;
	isActive: boolean;
	isBanned: boolean;
};
