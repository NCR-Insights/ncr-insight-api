import { apiHandler } from "@/utils/api-handler";

export const adminLogout = apiHandler((request, response) => {
	response.clearCookie(
		process.env["ADMIN_AUTH_COOKIE_NAME"] ?? "admin-token",
	);

	return response.status(200).json({
		success: true,
		code: 200,
	});
});
