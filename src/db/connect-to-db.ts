import { logger } from "@/utils/logger";
import { connect as connectMongoDB } from "mongoose";

export const connectToDB = async () => {
	try {
		const CONNECTION_URL = process.env["DB_URI"] ?? "";

		const mongoDBConnection = await connectMongoDB(`${CONNECTION_URL}`);

		logger.info(
			`DB Connected Successfully: ${mongoDBConnection.connection.host}`,
		);
	} catch (error) {
		logger.error(`MONGO DB CONNECTION FAILED: ${error}`);
		process.exit(1);
	}
};
