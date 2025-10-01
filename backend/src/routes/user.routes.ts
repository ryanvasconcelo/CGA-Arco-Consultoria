// backend/src/routes/user.routes.ts
import { Router } from 'express';
import UserController from '../controllers/UserController';
import { checkRole } from '../middleware/authorization';

const userRouter = Router();

userRouter.use(checkRole(['ADMIN', 'SUPER_ADMIN']));

userRouter.get('/', UserController.index);
userRouter.post('/', UserController.create);
userRouter.put('/:id', UserController.update);
// userRouter.delete('/:id', UserController.delete);

export default userRouter;