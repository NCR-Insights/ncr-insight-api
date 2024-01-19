import express from "express";

export const startServer = () => {
	const app = express();
	const PORT = process.env["PORT"];

	app.get("/", (req, res) => {
		return res.status(200).json({
			success: true,
			code: 200,
			message: "Hello from Daily NCR API!!",
		});
	});

	app.listen(PORT, () => console.log(`App is running at ${PORT}`));
};
