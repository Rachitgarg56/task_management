import { Router, Request, Response, NextFunction } from 'express';
import taskController from '../controllers/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validators/task.validator';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Wrapper to cast request type for authenticated routes
const auth = (req: Request, res: Response, next: NextFunction) =>
  authenticate(req as AuthenticatedRequest, res, next);

// All task routes require authentication
router.use(auth);

router.get('/', (req: Request, res: Response, next: NextFunction) =>
  taskController.getTasks(req as AuthenticatedRequest, res, next)
);

router.post('/', validate(createTaskSchema), (req: Request, res: Response, next: NextFunction) =>
  taskController.createTask(req as AuthenticatedRequest, res, next)
);

router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  taskController.getTaskById(req as AuthenticatedRequest, res, next)
);

router.patch('/:id', validate(updateTaskSchema), (req: Request, res: Response, next: NextFunction) =>
  taskController.updateTask(req as AuthenticatedRequest, res, next)
);

router.delete('/:id', (req: Request, res: Response, next: NextFunction) =>
  taskController.deleteTask(req as AuthenticatedRequest, res, next)
);

router.patch('/:id/toggle', (req: Request, res: Response, next: NextFunction) =>
  taskController.toggleTask(req as AuthenticatedRequest, res, next)
);

export default router;

