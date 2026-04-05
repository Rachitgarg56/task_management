import jwt from 'jsonwebtoken';
import config from '../config/env';
import { JwtPayload, TokenPair } from '../types';

export const generateAccessToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const generateTokenPair = (payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
};

export const getRefreshTokenExpiry = (): Date => {
  const expiresIn = config.jwt.refreshExpiresIn;
  const days = parseInt(expiresIn.replace('d', ''), 10);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
