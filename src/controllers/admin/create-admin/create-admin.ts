import { Admin } from "@/models";
import { APIError } from "@/types/errors";
import { AdminModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { genSalt, hash } from "bcrypt";
// import { MongooseError } from "mongoose";
import { z } from "zod";

const RequestBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(4, "The name should be at least 4 characters long!!")
		.max(50, "The name can be at most 50 characters long!!"),
	email: z.string().trim().email("Please provide a valid email address"),
	password: z
		.string()
		.trim()
		.min(8, "The password should be at least 8 characters long!!")
		.max(30, "The password can be at most 30 characters long!!"),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

interface ResponseData {
	admin: Omit<AdminModel, "password">;
}

export const createAdmin = apiHandler<
	Record<string, never>,
	ResponseData,
	RequestBody
>(async (request, response) => {
	const requestBodyValidationResult = RequestBodySchema.safeParse(
		request.body,
	);

	if (!requestBodyValidationResult.success) {
		throw new APIError(
			requestBodyValidationResult.error.errors[0]?.message ??
				"Something went wrong!!",
			400,
		);
	}

	const { name, email, password } = requestBodyValidationResult.data;

	const salt = await genSalt(12);
	const hashedPassword = await hash(password.trim(), salt);

	// let createdAdmin: AdminModel;

	// try {
	// 	const createdAdmin = await Admin.create({
	// 		name: name.trim(),
	// 		password: hashedPassword,
	// 		email: email.trim(),
	// 	});
	// } catch (error) {
	// 	console.log("HERE");

	// 	if (error instanceof MongooseError) {
	// 		throw new APIError(error.message, 400);
	// 	}

	// 	if (error instanceof Error) {
	// 		throw new APIError(error.message, 400);
	// 	}
	// }

	const createdAdmin = await Admin.create({
		name: name.trim(),
		password: hashedPassword,
		email: email.trim(),
	});

	const admin = await Admin.findById(createdAdmin._id).select("-password");

	if (!admin) {
		throw new APIError("NO admin found!!", 404);
	}

	return response.status(200).json({
		success: true,
		data: {
			admin,
		},
		code: 200,
	});
});
