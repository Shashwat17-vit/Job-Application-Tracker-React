import type { Request, Response, NextFunction } from "express";
import * as activityService from "../services/activity.service.js";

export async function getActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const activities = await activityService.getActivities(
      req.params.jobId as string,
      req.user!.userId
    );
    res.json({ success: true, data: activities });
  } catch (err) {
    next(err);
  }
}

export async function createActivity(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await activityService.createActivity(
      req.params.jobId as string,
      req.user!.userId,
      req.body
    );
    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
}

export async function deleteActivity(req: Request, res: Response, next: NextFunction) {
  try {
    await activityService.deleteActivity(req.params.id as string, req.user!.userId);
    res.json({ success: true, message: "Activity deleted" });
  } catch (err) {
    next(err);
  }
}
