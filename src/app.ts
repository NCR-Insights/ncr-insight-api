import express from "express";
import { connectToDB } from "@/db";
import { logger } from "@/utils/logger";
import { morganConfig } from "@/middlewares/morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getOrigins } from "@/utils/get-origins";

export const startServer = async () => {
	const app = express();
	const PORT = process.env["PORT"];

	await connectToDB();

	app.use(
		cors({
			credentials: true,
			origin: getOrigins(),
		}),
	);
	app.use(express.json());
	app.use(cookieParser());
	app.use(morganConfig);

	app.get("/", (req, res) => {
		return res.status(200).json({
			success: true,
			code: 200,
			message: "Hello from Daily NCR API!!",
		});
	});

	app.listen(PORT, () => logger.info(`App is running at ${PORT}`));
};
