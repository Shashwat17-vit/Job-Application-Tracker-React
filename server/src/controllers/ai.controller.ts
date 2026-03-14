import type { Request, Response, NextFunction } from "express";
import * as aiService from "../services/ai.service.js";

export async function parseJobDescription(req: Request, res: Response, next: NextFunction) {
  try {
    const { description } = req.body;
    const parsed = await aiService.parseJobDescription(description);
    res.json({ success: true, data: parsed });
  } catch (err) {
    next(err);
  }
}
