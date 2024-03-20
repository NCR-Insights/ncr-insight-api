import { logger } from "@/utils/logger";
import { genSalt, hash } from "bcrypt";
import { Admin } from "@/models";

export const seedAdmin = async () => {
	const ADMIN_PASSWORD = process.env["DUMMY_ADMIN_PASSWORD"] ?? "";
	const salt = await genSalt(12);
	const hashedPassword = await hash(ADMIN_PASSWORD, salt);

	await Admin.create({
		name: "Ankan Bhattacharya",
		email: "ankanbhattacharya89@gmail.com",
		password: hashedPassword,
		isActive: true,
	});

	logger.info("Admin Seeded");
};
