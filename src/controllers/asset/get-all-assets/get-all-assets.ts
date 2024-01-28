import { Asset } from "@/models";
import { APIError } from "@/types/errors";
import { AssetModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { z } from "zod";

const RequestQuerySchema = z.object({
	query: z.string().optional(),
	sortBy: z.string().optional(),
	sort: z.union([z.literal("asc"), z.literal("desc")]).optional(),
});

type RequestQuery = z.infer<typeof RequestQuerySchema> & {
	page?: string;
	limit?: string;
};

interface ResponseBody {
	assets: Array<AssetModel>;
}

export const getAllAssets = apiHandler<
	Record<string, never>,
	ResponseBody,
	undefined,
	RequestQuery
>(async (request, response) => {
	const requestQueryValidationResult = RequestQuerySchema.safeParse(
		request.query,
	);

	if (!requestQueryValidationResult.success) {
		throw new APIError(
			requestQueryValidationResult.error.errors[0]?.message ??
				"Something went wrong!!",
			400,
		);
	}

	const { sort, sortBy, query } = requestQueryValidationResult.data;
	const { page, limit } = request.query;

	const pageNumber = page && Number(page) ? Number.parseInt(page) : 1;
	const sizeLimit = limit && Number(limit) ? Number.parseInt(limit) : 10;

	const sortFactor = sortBy ?? "createdAt";
	const sortParameter = sort ?? "desc";

	const matchObject: Record<string, string | Record<string, string>> = {};
	const sortObject: Record<string, 1 | -1> = {};

	if (query) {
		matchObject["tag"] = {
			$regex: query,
			$options: "i",
		};
	}

	sortObject[sortFactor] = sortParameter === "asc" ? 1 : -1;

	const assets = await Asset.aggregate([
		{
			$match: matchObject,
		},
		{
			$sort: sortObject,
		},
		{
			$skip: (pageNumber - 1) * sizeLimit,
		},
		{
			$limit: sizeLimit,
		},
	]);

	return response.status(200).json({
		success: true,
		code: 200,
		data: {
			assets,
		},
	});
});
