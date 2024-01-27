import { Admin } from "@/models";
import { APIError } from "@/types/errors";
import { apiHandler } from "@/utils/api-handler";
import { compare, genSalt, hash } from "bcrypt";
import { Types } from "mongoose";
import { z } from "zod";

const RequestBodySchema = z.object({
	oldPassword: z
		.string()
		.trim()
		.min(8, "The password should be at least 8 characters long!!")
		.max(30, "The password can be at most 30 characters long!!"),
	newPassword: z
		.string()
		.trim()
		.min(8, "The password should be at least 8 characters long!!")
		.max(30, "The password can be at most 30 characters long!!"),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

export const updatePassword = apiHandler<
	Record<string, never>,
	undefined,
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

	const { id } = request.admin!;
	const { newPassword, oldPassword } = requestBodyValidationResult.data;

	const adminFound = await Admin.findById(id);

	if (!adminFound) {
		throw new APIError("No Admin Found!!", 404);
	}

	const isPasswordCorrect = await compare(oldPassword, adminFound.password);

	if (!isPasswordCorrect) {
		throw new APIError("Incorrect Credentials!!", 401);
	}

	const salt = await genSalt(12);
	const hashedPassword = await hash(newPassword, salt);

	const updateResult = await Admin.updateOne(
		{ _id: new Types.ObjectId(id) },
		{
			$set: {
				password: hashedPassword,
			},
		},
	);

	if (updateResult.modifiedCount < 1) {
		throw new APIError("Update Failed!!", 400);
	}

	return response.status(200).json({
		success: true,
		code: 200,
	});
});
