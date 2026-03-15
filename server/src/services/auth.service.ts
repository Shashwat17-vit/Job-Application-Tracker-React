import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import type { AuthResponse, TokenPayload } from "@tracker/shared";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function register(
  rawEmail: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  const email = rawEmail.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.googleId && !existing.passwordHash) {
      throw ApiError.conflict("This email is registered with Google. Please sign in with Google.");
    }
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

export async function login(rawEmail: string, password: string): Promise<AuthResponse> {
  const email = rawEmail.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.passwordHash) {
    throw ApiError.unauthorized("This account uses Google sign-in. Please log in with Google.");
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

export async function googleLogin(credential: string): Promise<AuthResponse> {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  }).catch(() => {
    throw ApiError.unauthorized("Invalid Google token");
  });

  const googlePayload = ticket.getPayload();
  if (!googlePayload || !googlePayload.email) {
    throw ApiError.unauthorized("Could not retrieve Google account info");
  }

  const { sub: googleId, email: rawEmail, name: googleName } = googlePayload;
  const email = rawEmail!.toLowerCase();
  const name = googleName || email.split("@")[0];

  // Check if user exists by googleId or email
  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (user) {
    // Link Google account if user registered with email/password
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }
  } else {
    // Create new Google user (no password)
    user = await prisma.user.create({
      data: { email, name, googleId },
    });
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
