import { Hono } from 'hono';
import {
  registerController,
  loginController,
  verifyEmailController,
  resendVerificationController,
  forgotPasswordController,
  verifyResetOtpController,
  resetPasswordController
} from '../controllers/authController.js';

const authRouter = new Hono();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/verify-email', verifyEmailController);
authRouter.post('/verify-email', verifyEmailController);
authRouter.post('/resend-verification', resendVerificationController);
authRouter.post('/forgot-password', forgotPasswordController);
authRouter.post('/verify-reset-otp', verifyResetOtpController);
authRouter.post('/reset-password', resetPasswordController);

export { authRouter };
