import { seedAdmin } from "@/db/seeders";
import { APIError } from "@/types/errors";
import { apiHandler } from "@/utils/api-handler";
import { logger } from "@/utils/logger";
import { z } from "zod";

const RequestBodySchema = z.object({
	admin_postman_password: z.string(),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

export const seedDbController = apiHandler<
	Record<string, never>,
	undefined,
	RequestBody
>(async (request, response) => {
	const requestBodyValidationResult = RequestBodySchema.safeParse(
		request.body,
	);

	if (!requestBodyValidationResult.success) {
		logger.error(requestBodyValidationResult.error.errors);

		throw new APIError(
			requestBodyValidationResult.error.errors[0]?.message ??
				"Something went wrong!!",
			400,
		);
	}

	const { admin_postman_password } = requestBodyValidationResult.data;

	if (admin_postman_password !== process.env["ADMIN_POSTMAN_PASSWORD"]) {
		throw new APIError("You are not authorized to take such steps!!", 403);
	}

	await seedAdmin();

	return response.status(200).json({
		success: true,
		code: 200,
	});
});
