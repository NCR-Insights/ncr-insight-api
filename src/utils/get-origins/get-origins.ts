export const getOrigins = () => {
	const originsString =
		process.env["REQUEST_ORIGINS"] ?? "http://localhost:8000";

	return originsString.split(",").map((origin) => origin.trim());
};
