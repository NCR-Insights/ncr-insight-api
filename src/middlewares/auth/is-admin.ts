import { APIError } from "@/types/errors";
import { apiHandler } from "@/utils/api-handler";
import jwt, { JwtPayload } from "jsonwebtoken";

interface JWTAdminPayload extends JwtPayload {
	admin?: {
		id: string;
		email: string;
	};
}

export const isAdmin = apiHandler((req, res, next) => {
	const adminCookie =
		req.cookies[process.env["ADMIN_AUTH_COOKIE_NAME"] ?? "admin-token"];

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
});
