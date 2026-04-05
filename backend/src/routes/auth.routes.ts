import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/refresh', validate(refreshTokenSchema), authController.refresh.bind(authController));
router.post('/logout', validate(refreshTokenSchema), authController.logout.bind(authController));

export default router;
