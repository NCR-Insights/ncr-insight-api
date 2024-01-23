import { APIError } from "@/types/errors";
import { Controller } from "@/types/express";
import { logger } from "../logger";

export const apiHandler =
	<
		Params = Record<string, never>,
		ResponseData = void,
		RequestBody = void,
		Query = Record<string, never>,
	>(
		controller: Controller<Params, ResponseData, RequestBody, Query>,
	): Controller<Params, ResponseData, RequestBody, Query> =>
	(request, response, next) => {
		try {
			return controller(request, response, next);
		} catch (error) {
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
