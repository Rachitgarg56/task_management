import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokenPair, generateAccessToken, verifyRefreshToken, getRefreshTokenExpiry } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { TokenPair } from '../types';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: object; tokens: TokenPair }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    const hashedPassword = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return { user, tokens };
  }

  async login(input: LoginInput): Promise<{ user: object; tokens: TokenPair }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await comparePassword(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    const { password: _password, ...safeUser } = user;

    return { user: safeUser, tokens };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new AppError('Refresh token not found or already revoked', 401);
    }

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new AppError('Refresh token has expired', 401);
    }

    const accessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    });

    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new AppError('Refresh token not found', 400);
    }

    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
  }
}

export default new AuthService();
