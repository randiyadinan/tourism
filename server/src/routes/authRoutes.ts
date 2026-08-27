import { Hono } from 'hono';
import {
  registerController,
  loginController,
  verifyEmailController,
  resendVerificationController,
  testEmailController,
  getAllUsersController
} from '../controllers/authController.js';

const authRouter = new Hono();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/verify-email', verifyEmailController);
authRouter.post('/verify-email', verifyEmailController);
authRouter.post('/resend-verification', resendVerificationController);
authRouter.post('/test-email', testEmailController);
authRouter.get('/users', getAllUsersController);

export { authRouter };
