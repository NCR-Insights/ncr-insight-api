import { Category } from "@/models";
import { APIError } from "@/types/errors";
import { CategoryModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { isValidObjectId } from "mongoose";

interface RequestParams {
	categoryId?: string;
}

interface ResponseData {
	deletedCategory: CategoryModel;
}

export const deleteCategory = apiHandler<RequestParams, ResponseData>(
	async (request, response) => {
		const { categoryId } = request.params;

		if (!isValidObjectId(categoryId)) {
			throw new APIError(
				"Please provide a valid ObjectID ofr categoryId",
				400,
			);
		}

		const deletedCategory = await Category.findByIdAndDelete(categoryId);

		if (!deletedCategory) {
			throw new APIError("No such category found!!", 404);
		}

		return response.status(200).json({
			success: true,
			code: 200,
			data: {
				deletedCategory,
			},
		});
	},
);
