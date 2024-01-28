import { apiHandler } from "@/utils/api-handler";
import { unlink } from "fs/promises";
import { UploadedFile } from "express-fileupload";
import { z } from "zod";
import { APIError } from "@/types/errors";
import { AssetModel } from "@/types/models";
import { Asset } from "@/models";
import { getCloudinary } from "@/utils/get-cloudinary";

const RequestBodySchema = z.object({
	tag: z
		.string()
		.trim()
		.min(3, "The tag should be at least 3 characters long!!")
		.max(70, "The tag can be at most 70 characters long!!")
		.optional(),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

interface ResponseData {
	asset: AssetModel;
}

export const createAsset = apiHandler<
	Record<string, never>,
	ResponseData,
	RequestBody
>(async (request, response) => {
	const assetData = request.files?.["asset"] as unknown as
		| UploadedFile
		| undefined
		| null;

	const requestBodyValidationResult = RequestBodySchema.safeParse(
		request.body,
	);

	if (!assetData) {
		throw new APIError("Please provide a valid asset", 400);
	}

	if (!requestBodyValidationResult.success) {
		throw new APIError(
			requestBodyValidationResult.error.errors[0]?.message ??
				"Something went wrong!!",
			400,
		);
	}

	const { tag } = requestBodyValidationResult.data;
	const cloudinary = getCloudinary();
	const uploadedImage = await cloudinary.uploader.upload(
		assetData.tempFilePath,
		{
			folder: process.env["CLOUDINARY_ASSETS_FOLDER_NAME"] ?? "",
		},
	);

	await unlink(assetData.tempFilePath);

	const assetUploadData: Record<string, string> = {};

	if (tag) assetUploadData["tag"] = tag.trim();
	assetUploadData["assetUrl"] = uploadedImage.url;

	const asset = await Asset.create(assetUploadData);

	return response.status(200).json({
		success: true,
		code: 200,
		data: {
			asset,
		},
	});
});
