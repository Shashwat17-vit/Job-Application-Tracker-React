import type { Response, CookieOptions } from "express";
import { env } from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

const baseOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
};

const ACCESS_TOKEN_OPTIONS: CookieOptions = {
  ...baseOptions,
  path: "/api",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_TOKEN_OPTIONS: CookieOptions = {
  ...baseOptions,
  path: "/api/auth/refresh",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("accessToken", accessToken, ACCESS_TOKEN_OPTIONS);
  res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS);
}

export function clearTokenCookies(res: Response) {
  res.clearCookie("accessToken", { path: "/api" });
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
}
