import { Asset } from "@/models";
import { APIError } from "@/types/errors";
import { AssetModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { z } from "zod";

const RequestParamsSchema = z.object({
	assetId: z.string(),
});

type RequestParams = z.infer<typeof RequestParamsSchema>;

interface ResponseBody {
	asset: AssetModel;
}

export const getAssetById = apiHandler<RequestParams, ResponseBody>(
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

		const asset = await Asset.findById(assetId);

		if (!asset) {
			throw new APIError("No asset found!!", 404);
		}

		return response.status(200).json({
			success: true,
			code: 200,
			data: {
				asset,
			},
		});
	},
);
