import type { Request, Response, NextFunction } from "express";
import * as jobService from "../services/job.service.js";

export async function getJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as string | undefined;
    const jobs = await jobService.getJobs(req.user!.userId, status);
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err);
  }
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobService.getJob(req.params.id as string, req.user!.userId);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
}

export async function createJob(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobService.createJob(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
}

export async function updateJob(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobService.updateJob(req.params.id as string, req.user!.userId, req.body);
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req: Request, res: Response, next: NextFunction) {
  try {
    await jobService.deleteJob(req.params.id as string, req.user!.userId);
    res.json({ success: true, message: "Job application deleted" });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobService.updateStatus(
      req.params.id as string,
      req.user!.userId,
      req.body.status
    );
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
  try {
    await jobService.reorder(req.user!.userId, req.body);
    res.json({ success: true, message: "Reorder successful" });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await jobService.getDashboardStats(req.user!.userId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
