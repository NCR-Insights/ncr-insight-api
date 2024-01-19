import express from "express";
import { connectToDB } from "./db";

export const startServer = async () => {
	const app = express();
	const PORT = process.env["PORT"];

	await connectToDB();

	app.get("/", (req, res) => {
		return res.status(200).json({
			success: true,
			code: 200,
			message: "Hello from Daily NCR API!!",
		});
	});

	app.listen(PORT, () => console.log(`App is running at ${PORT}`));
};
