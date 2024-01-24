import { Admin } from "@/models";
import { APIError } from "@/types/errors";
import { apiHandler } from "@/utils/api-handler";
import { compare } from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";

const RequestBodySchema = z.object({
	email: z.string().trim().email("Please provide a valid email address"),
	password: z
		.string()
		.trim()
		.min(8, "The password should be at least 8 characters long!!")
		.max(30, "The password can be at most 30 characters long!!"),
});

type RequestBodyType = z.infer<typeof RequestBodySchema>;

export const adminLogin = apiHandler<
	Record<string, never>,
	undefined,
	RequestBodyType
>(async (request, response) => {
	const requestBodyValidationResult = RequestBodySchema.safeParse(
		request.body,
	);

	if (!requestBodyValidationResult.success) {
		throw new APIError(
			requestBodyValidationResult.error.errors[0]?.message ??
				"Some Error Occurred!!",
			400,
		);
	}

	const { email, password } = requestBodyValidationResult.data;

	const adminFound = await Admin.findOne({
		email,
	});

	if (!adminFound) {
		throw new APIError("No user found!!", 404);
	}

	const isCorrectPassword = await compare(password, adminFound.password);

	if (!isCorrectPassword) {
		throw new APIError("Incorrect Credentials!!", 401);
	}

	const data = {
		admin: {
			id: adminFound._id?.toString(),
			email: adminFound.email,
		},
	};

	const adminAuthToken = jwt.sign(data, process.env["SECRET"] ?? "");

	response.cookie(
		process.env["ADMIN_AUTH_COOKIE_NAME"] ?? "admin-token",
		adminAuthToken,
		{
			httpOnly: true,
			expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
			secure: process.env["NODE_ENV"] === "production",
			domain:
				process.env["NODE_ENV"] === "production"
					? request.get("host")
					: "localhost",
		},
	);

	return response.status(200).json({
		success: true,
		code: 200,
	});
});
