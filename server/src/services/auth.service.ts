import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import type { AuthResponse, TokenPayload } from "@tracker/shared";

export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  const payload: TokenPayload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const payload: TokenPayload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
}

export async function refresh(token: string): Promise<{ accessToken: string; refreshToken: string }> {
  try {
    const payload = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw ApiError.unauthorized("User not found");
    }

    const newPayload: TokenPayload = { userId: user.id, email: user.email };
    const accessToken = signAccessToken(newPayload);
    const refreshToken = signRefreshToken(newPayload);

    return { accessToken, refreshToken };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw ApiError.unauthorized("Invalid refresh token");
  }
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
}
