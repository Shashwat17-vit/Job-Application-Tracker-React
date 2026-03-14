import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { setTokenCookies, clearTokenCookies } from "../utils/cookies.js";
import { ApiError } from "../utils/ApiError.js";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    setTokenCookies(res, result.accessToken, result.refreshToken);
    res.status(201).json({ success: true, data: { user: result.user } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    setTokenCookies(res, result.accessToken, result.refreshToken);
    res.json({ success: true, data: { user: result.user } });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw ApiError.unauthorized("No refresh token provided");
    }
    const result = await authService.refresh(refreshToken);
    setTokenCookies(res, result.accessToken, result.refreshToken);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  clearTokenCookies(res);
  res.json({ success: true, message: "Logged out successfully" });
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
