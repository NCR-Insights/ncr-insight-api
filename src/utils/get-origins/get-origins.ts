export const getOrigins = (originsString: string) => {
	return originsString.split(",").map((origin) => origin.trim());
};
