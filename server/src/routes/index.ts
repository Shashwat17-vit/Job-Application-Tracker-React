import { Router } from "express";
import authRoutes from "./auth.routes.js";
import jobRoutes from "./job.routes.js";
import activityRoutes from "./activity.routes.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import * as jobController from "../controllers/job.controller.js";
import * as activityController from "../controllers/activity.controller.js";
import * as aiController from "../controllers/ai.controller.js";
import { parseDescriptionSchema } from "../validators/ai.validator.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);
router.use("/jobs", activityRoutes);

// Standalone activity delete (not nested under /jobs/:jobId)
router.delete("/activities/:id", authenticate, activityController.deleteActivity);

// Dashboard
router.get("/dashboard/stats", authenticate, jobController.getDashboardStats);

// AI - Parse job description
router.post("/ai/parse-job", authenticate, validate(parseDescriptionSchema), aiController.parseJobDescription);

export default router;
