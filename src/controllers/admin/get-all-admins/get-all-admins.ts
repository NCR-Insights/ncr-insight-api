import { Admin } from "@/models";
import { APIError } from "@/types/errors";
import { AdminModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";
import { z } from "zod";

const RequestQuerySchema = z.object({
	sortBy: z.string().optional(),
	sort: z.union([z.literal("asc"), z.literal("desc")]).optional(),
});

type RequestQuery = z.infer<typeof RequestQuerySchema> & {
	page?: string;
	limit?: string;
};

interface ResponseBody {
	admins: Array<Omit<AdminModel, "password">>;
}

export const getAllAdmins = apiHandler<
	Record<string, never>,
	ResponseBody,
	RequestQuery
>(async (request, response) => {
	const requestBodyValidationResult = RequestQuerySchema.safeParse(
		request.query,
	);

	if (!requestBodyValidationResult.success) {
		throw new APIError(
			requestBodyValidationResult.error.errors[0]?.message ??
				"Some Error Occurred!!",
			400,
		);
	}

	const sortBy = requestBodyValidationResult.data.sortBy ?? "createdAt";
	const sort = requestBodyValidationResult.data.sort ?? "desc";
	const pageNumber =
		request.query["page"] && Number(request.query["page"])
			? Number.parseInt(request.query["page"])
			: 1;
	const limitSize =
		request.query["limit"] && Number(request.query["limit"])
			? Number.parseInt(request.query["limit"])
			: 15;

	if (limitSize > 100) {
		throw new APIError("Cannot give more than 100 admins at a time", 400);
	}

	const sortObject: Record<string, 1 | -1> = {};

	sortObject[sortBy] = sort === "asc" ? 1 : -1;

	console.log(sortObject);

	const admins = await Admin.aggregate([
		{
			$match: {},
		},
		{
			$project: {
				_id: 1,
				name: 1,
				email: 1,
				createdAt: 1,
				updatedAt: 1,
			},
		},
		{
			$sort: sortObject,
		},
		{
			$skip: (pageNumber - 1) * limitSize,
		},
		{
			$limit: limitSize,
		},
	]);

	return response.status(200).json({
		success: true,
		code: 200,
		data: {
			admins,
		},
	});
});
