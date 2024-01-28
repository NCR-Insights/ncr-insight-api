import { Asset } from "@/models";
import { APIError } from "@/types/errors";
import { apiHandler } from "@/utils/api-handler";
import { getCloudinary } from "@/utils/get-cloudinary";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

const RequestParamsSchema = z.object({
	assetId: z.string(),
});

type RequestParams = z.infer<typeof RequestParamsSchema>;

// TODO: Need to decide if we can put password verification before deletion.

export const deleteAsset = apiHandler<RequestParams>(
	async (request, response) => {
		const requestParamsValidationResult = RequestParamsSchema.safeParse(
			request.params,
		);

		if (!requestParamsValidationResult.success) {
			throw new APIError(
				requestParamsValidationResult.error.errors[0]?.message ??
					"Something went wrong!!",
				400,
			);
		}

		const { assetId } = requestParamsValidationResult.data;

		if (!isValidObjectId(assetId)) {
			throw new APIError(
				"Please provide a valid objectID for assetId",
				400,
			);
		}

		const deletedAsset = await Asset.findOneAndDelete({
			_id: assetId,
		});

		if (!deletedAsset) {
			throw new APIError("No asset found!!", 404);
		}

		const cloudinary = getCloudinary();

		const imagePublicId = deletedAsset.assetUrl
			.split("/")
			[deletedAsset.assetUrl.split("/").length - 1]?.split(".")[0];

		await cloudinary.uploader.destroy(
			`${process.env["CLOUDINARY_ASSETS_FOLDER_NAME"] ?? ""}/${imagePublicId}`,
		);

		response.status(200).json({
			success: true,
			code: 200,
		});
	},
);
