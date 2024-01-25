import { APIError } from "@/types/errors";
import { logger } from "@/utils/logger";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JWTAdminPayload extends JwtPayload {
	admin?: {
		id: string;
		email: string;
	};
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	const adminCookie =
		req.cookies[process.env["ADMIN_AUTH_COOKIE_NAME"] ?? "admin-token"];

	try {
		if (!adminCookie) {
			throw new APIError("Access Denied!!", 401);
		}

		const jwtPayload = jwt.verify(
			adminCookie,
			process.env["ADMIN_SECRET"] ?? "",
		) as JWTAdminPayload;

		if (!jwtPayload.admin) {
			res.clearCookie(
				process.env["ADMIN_AUTH_COOKIE_NAME"] ?? "admin-token",
				{
					httpOnly: true,
					secure: process.env["NODE_ENV"] === "production",
					domain:
						process.env["NODE_ENV"] === "production"
							? req.get("host")
							: "localhost",
				},
			);

			throw new APIError("Invalid JWT credentials", 401);
		}

		req.admin = jwtPayload.admin;

		return next();
	} catch (error) {
		if (error instanceof APIError) {
			logger.error(error.message);

			return res.status(error.code).json({
				success: false,
				error: error.message,
				code: error.code,
			});
		}

		if (error instanceof jwt.JsonWebTokenError) {
			logger.error(error.message);

			return res.status(401).json({
				success: false,
				error: "Access Denied!!",
				code: 401,
			});
		}

		if (error instanceof Error) {
			logger.error(error.message);

			return res.status(400).json({
				success: false,
				error: error.message,
				code: 400,
			});
		}

		logger.error(error);

		return res.status(500).json({
			success: false,
			error: "Internal Server Error!!",
			code: 500,
		});
	}
};
