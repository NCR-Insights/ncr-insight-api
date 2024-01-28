import { Asset } from "@/models";
import { APIError } from "@/types/errors";
import { AssetModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { getCloudinary } from "@/utils/get-cloudinary";
import { UploadedFile } from "express-fileupload";
import { unlink } from "fs/promises";
import { isValidObjectId } from "mongoose";
import { z } from "zod";

const RequestBodySchema = z.object({
	tag: z
		.string()
		.trim()
		.min(3, "The tag should be at least 3 characters long!!")
		.max(70, "The tag can be at most 70 characters long!!")
		.optional(),
});

const RequestParamsSchema = z.object({
	assetId: z.string(),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

type RequestParams = z.infer<typeof RequestParamsSchema>;

interface ResponseBody {
	asset: AssetModel;
}

export const updateAsset = apiHandler<RequestParams, ResponseBody, RequestBody>(
	async (request, response) => {
		const requestParamsValidationResult = RequestParamsSchema.safeParse(
			request.params,
		);

		if (!requestParamsValidationResult.success) {
			throw new APIError(
				requestParamsValidationResult.error.errors[0]?.message ??
					"Something went wrong",
				400,
			);
		}

		const { assetId } = requestParamsValidationResult.data;

		if (!isValidObjectId(assetId)) {
			throw new APIError(
				"Please provide a valid ObjectID as assetId",
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

		const { tag } = requestBodyValidationResult.data;

		const assetData = request.files?.["asset"] as unknown as
			| UploadedFile
			| undefined
			| null;

		if (!assetData && !tag) {
			throw new APIError("Nothing to update!!", 400);
		}

		const updateObject: Record<string, string> = {};

		if (tag) updateObject["tag"] = tag;
		const cloudinary = getCloudinary();

		if (assetData) {
			const uploadedImage = await cloudinary.uploader.upload(
				assetData.tempFilePath,
				{
					folder: process.env["CLOUDINARY_ASSETS_FOLDER_NAME"] ?? "",
				},
			);

			updateObject["assetUrl"] = uploadedImage.url;

			await unlink(assetData.tempFilePath);
		}

		const updatedAsset = await Asset.findByIdAndUpdate(
			{
				_id: assetId,
			},
			{
				$set: updateObject,
			},
			{
				new: false,
			},
		);

		if (!updatedAsset) {
			throw new APIError("No such asset found!!", 4004);
		}

		if (assetData) {
			const imagePublicId = updatedAsset.assetUrl
				.split("/")
				[updatedAsset.assetUrl.split("/").length - 1]?.split(".")[0];

			await cloudinary.uploader.destroy(
				`${process.env["CLOUDINARY_ASSETS_FOLDER_NAME"] ?? ""}/${imagePublicId}`,
			);
		}

		if (tag) updatedAsset["tag"] = tag;
		if (assetData)
			updatedAsset["assetUrl"] = updateObject["assetUrl"] as string;

		return response.status(200).json({
			success: true,
			code: 200,
			data: {
				asset: updatedAsset,
			},
		});
	},
);
