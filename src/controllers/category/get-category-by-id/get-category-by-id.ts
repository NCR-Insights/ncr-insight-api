import { Category } from "@/models";
import { APIError } from "@/types/errors";
import { CategoryModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { isValidObjectId } from "mongoose";

interface RequestParams {
	categoryId?: string;
}

interface ResponseData {
	category: CategoryModel;
}

export const getCategoryById = apiHandler<RequestParams, ResponseData>(
	async (request, response) => {
		const { categoryId } = request.params;

		if (!isValidObjectId(categoryId)) {
			throw new APIError(
				"Please provide a valid ObjectID for categoryId",
				400,
			);
		}

		const category = await Category.findById(categoryId);

		if (!category) {
			throw new APIError("No category found!!", 404);
		}

		return response.status(200).json({
			success: true,
			code: 200,
			data: {
				category,
			},
		});
	},
);
