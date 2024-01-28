import express from "express";
import { connectToDB } from "@/db";
import { logger } from "@/utils/logger";
import { morganConfig } from "@/middlewares/morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getOrigins } from "@/utils/get-origins";
import { apiHandler } from "@/utils/api-handler";
import { adminRouter, assetRouter, authRouter } from "./routes";
import fileUpload from "express-fileupload";

export const startServer = async () => {
	const app = express();
	const PORT = process.env["PORT"];
	const ORIGINS_STRING =
		process.env["REQUEST_ORIGINS"] ?? "http://localhost:8000";

	await connectToDB();

	app.use(
		cors({
			credentials: true,
			origin: getOrigins(ORIGINS_STRING),
		}),
	);
	app.use(express.json());
	app.use(cookieParser());
	app.use(morganConfig);
	app.use(
		fileUpload({
			useTempFiles: true,
		}),
	);

	app.get(
		"/",
		apiHandler((req, res) => {
			return res.status(200).json({
				success: true,
				code: 200,
				message: "Hello from Daily NCR API!!",
			});
		}),
	);

	app.use("/api/v1/auth", authRouter);
	app.use("/api/v1/admin", adminRouter);
	app.use("/api/v1/asset", assetRouter);

	app.listen(PORT, () => logger.info(`App is running at ${PORT}`));
};
