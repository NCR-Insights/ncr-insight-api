import { Express, Request } from "express";

declare global {
	namespace Express {
		interface Request {
			admin?: {
				id: string;
				email: string;
			};
			user?: {
				id: string;
				email: string;
				providerId: string;
			};
		}
	}
}
