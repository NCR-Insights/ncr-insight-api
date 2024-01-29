import { Category } from "@/models";
import { APIError } from "@/types/errors";
import { CategoryModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

const RequestBodySchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, "The name should be at least 3 characters long!!")
		.max(40, "The name can be at most 40 characters long!!")
		.optional(),
	slug: z
		.string()
		.trim()
		.min(3, "The slug should be at least 3 characters long!!")
		.max(60, "The slug can be at most 60 characters long!!")
		.optional(),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

interface RequestParams {
	categoryId?: string;
}

interface ResponseData {
	updatedCategory: CategoryModel;
}

export const updateCategory = apiHandler<
	RequestParams,
	ResponseData,
	RequestBody
>(async (request, response) => {
	const { categoryId } = request.params;

	if (!isValidObjectId(categoryId)) {
		throw new APIError(
			"Please provide a valid ObjectID for categoryId",
			400,
		);
	}

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

	if (!name && !slug) {
		throw new APIError("Please provide something to update!!", 400);
	}

	const updateObject: Record<string, string> = {};

	if (name) updateObject["name"] = name.trim();
	if (slug)
		updateObject["slug"] = slug.trim().toLowerCase().split(" ").join("-");

	const updatedCategory = await Category.findByIdAndUpdate(
		categoryId,
		{
			$set: updateObject,
		},
		{
			new: true,
		},
	);

	if (!updatedCategory) {
		throw new APIError("No Category found!!", 404);
	}

	return response.status(200).json({
		success: true,
		code: 200,
		data: {
			updatedCategory,
		},
	});
});
