import { APIError } from "@/types/errors";
import { Controller } from "@/types/express";
import { logger } from "../logger";
import { MongooseError } from "mongoose";

export const apiHandler =
	<
		Params = Record<string, never>,
		ResponseData = void,
		RequestBody = void,
		Query = Record<string, never>,
	>(
		controller: Controller<Params, ResponseData, RequestBody, Query>,
	): Controller<Params, ResponseData, RequestBody, Query> =>
	async (request, response, next) => {
		try {
			return await Promise.resolve(controller(request, response, next));
		} catch (error) {
			if (error instanceof MongooseError) {
				logger.error(error.message);

				return response.status(400).json({
					success: false,
					error: error.message,
					code: 400,
				});
			}

			if (error instanceof APIError) {
				logger.error(error.message);

				return response.status(error.code).json({
					success: false,
					error: error.message,
					code: error.code,
				});
			}

			if (error instanceof Error) {
				logger.error(error.message);

				if (error.message.includes("E11000")) {
					return response.status(400).json({
						success: false,
						error: "Duplicate record found!!",
						code: 400,
					});
				}

				return response.status(400).json({
					success: false,
					error: error.message,
					code: 400,
				});
			}

			logger.error(error);

			return response.status(500).json({
				success: false,
				error: "Internal Server Error!!",
				code: 500,
			});
		}
	};
