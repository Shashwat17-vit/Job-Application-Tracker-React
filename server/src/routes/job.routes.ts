import { Router } from "express";
import * as jobController from "../controllers/job.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createJobSchema,
  updateJobSchema,
  updateStatusSchema,
  reorderSchema,
} from "../validators/job.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", jobController.getJobs);
router.get("/:id", jobController.getJob);
router.post("/", validate(createJobSchema), jobController.createJob);
router.put("/:id", validate(updateJobSchema), jobController.updateJob);
router.delete("/:id", jobController.deleteJob);
router.patch("/:id/status", validate(updateStatusSchema), jobController.updateStatus);
router.patch("/reorder", validate(reorderSchema), jobController.reorder);

export default router;
