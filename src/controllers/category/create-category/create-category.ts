import { Category } from "@/models";
import { APIError } from "@/types/errors";
import { CategoryModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { z } from "zod";

const RequestBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "The name should be at least 3 characters long!!")
		.max(40, "The name can be at most 40 characters long!!"),
	slug: z
		.string()
		.trim()
		.min(3, "The slug should be at least 3 characters long!!")
		.max(60, "The slug can be at most 60 characters long!!"),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

interface ResponseData {
	category: CategoryModel;
}

export const createCategory = apiHandler<
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

	const { name, slug } = requestBodyValidationResult.data;

	const category = await Category.create({
		name: name.trim(),
		slug: slug.trim().toLowerCase().split(" ").join("-"),
	});

	return response.status(200).json({
		success: true,
		code: 200,
		data: {
			category,
		},
	});
});
