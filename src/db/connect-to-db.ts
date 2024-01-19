import { connect as connectMongoDB } from "mongoose";

export const connectToDB = async () => {
	try {
		const CONNECTION_URL = process.env["DB_URI"] ?? "";
		const DB_NAME = process.env["DB_NAME"] ?? "the-ncr-daily";

		const mongoDBConnection = await connectMongoDB(
			`${CONNECTION_URL}/${DB_NAME}`,
		);

		console.log(
			"\nDB Connected Successfully:",
			mongoDBConnection.connection.host,
		);
	} catch (error) {
		console.log("MONGO DB CONNECTION FAILED:", error);
		process.exit(1);
	}
};
