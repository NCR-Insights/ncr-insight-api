import { logger } from "@/utils/logger";
import { connect as connectMongoDB } from "mongoose";

export const connectToDB = async () => {
	try {
		const CONNECTION_URL = process.env["DB_URI"] ?? "";
		const DB_NAME = process.env["DB_NAME"] ?? "the-ncr-daily";

		const mongoDBConnection = await connectMongoDB(
			`${CONNECTION_URL}/${DB_NAME}`,
		);

		logger.info(
			`DB Connected Successfully: ${mongoDBConnection.connection.host}`,
		);
	} catch (error) {
		logger.error(`MONGO DB CONNECTION FAILED: ${error}`);
		process.exit(1);
	}
};
