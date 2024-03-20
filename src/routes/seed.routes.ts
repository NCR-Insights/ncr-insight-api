import { seedDbController } from "@/controllers/seed";
import { Router } from "express";

export const seedRouter = Router();

seedRouter.route("/seed-db").post(seedDbController);
