import { logger } from "@/utils/logger";
import { connectToDB } from "../connect-to-db";
import { genSalt, hash } from "bcrypt";
import { Admin } from "@/models";

const seedAdmin = async () => {
	try {
		await connectToDB();

		const ADMIN_PASSWORD = process.env["DUMMY_ADMIN_PASSWORD"] ?? "";
		const salt = await genSalt(12);
		const hashedPassword = await hash(ADMIN_PASSWORD, salt);

		await Admin.create({
			name: "Ankan Bhattacharya",
			email: "ankanbhattacharya89@gmail.com",
			password: hashedPassword,
		});

		logger.info("Admin Seeded");
		process.exit(0);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(error.message);
			return;
		}

		logger.error(error);
	}
};

seedAdmin();
