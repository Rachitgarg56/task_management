import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await authService.register(req.body);

      sendSuccess(
        res,
        'Registration successful',
        { user, ...tokens },
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await authService.login(req.body);

      sendSuccess(res, 'Login successful', { user, ...tokens });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const { accessToken } = await authService.refresh(refreshToken);

      sendSuccess(res, 'Token refreshed successfully', { accessToken });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);

      sendSuccess(res, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
