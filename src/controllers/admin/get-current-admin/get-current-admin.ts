import { Admin } from "@/models";
import { APIError } from "@/types/errors";
import { AdminModel } from "@/types/models";
import { apiHandler } from "@/utils/api-handler";

interface ResponseBody {
	admin: Omit<AdminModel, "password">;
}

export const getCurrentAdmin = apiHandler<Record<string, never>, ResponseBody>(
	async (request, response) => {
		const { id } = request.admin!;

		const admin = await Admin.findById(id).select("-password");

		if (!admin) {
			throw new APIError("No such admin found!!", 404);
		}

		return response.status(200).json({
			success: true,
			data: {
				admin,
			},
			code: 200,
		});
	},
);
