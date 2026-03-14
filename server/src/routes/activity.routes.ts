import { Router } from "express";
import * as activityController from "../controllers/activity.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createActivitySchema } from "../validators/activity.validator.js";

const router = Router();

router.use(authenticate);

router.get("/:jobId/activities", activityController.getActivities);
router.post(
  "/:jobId/activities",
  validate(createActivitySchema),
  activityController.createActivity
);

export default router;
