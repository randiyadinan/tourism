import type { Context } from 'hono';
import { authService } from '../services/authService.js';

export async function registerController(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const origin = c.req.header('origin') || c.req.header('referer');

    const result = await authService.register({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      country: body.country,
      origin: origin ? new URL(origin).origin : undefined
    });

    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json(result, 201);
  } catch (error: any) {
    console.error('Error in registration controller:', error);
    return c.json({ success: false, error: error.message || 'Internal registration error' }, 500);
  }
}

export async function loginController(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const result = await authService.login(body.email, body.password);

    if (!result.success) {
      if (result.requiresVerification) {
        return c.json({
          success: false,
          requiresVerification: true,
          error: result.error || 'Please verify your email before signing in.'
        }, 403);
      }
      return c.json({ success: false, error: result.error || 'Invalid credentials' }, 401);
    }

    return c.json(result, 200);
  } catch (error: any) {
    console.error('Error in login controller:', error);
    return c.json({ success: false, error: error.message || 'Internal login error' }, 500);
  }
}

export async function verifyEmailController(c: Context) {
  try {
    const token = c.req.query('token') || (await c.req.json().catch(() => ({}))).token;
    const email = c.req.query('email') || (await c.req.json().catch(() => ({}))).email;

    if (!token) {
      return c.json({ success: false, error: 'Verification token is required.', message: 'Invalid verification token.' }, 400);
    }

    const result = await authService.verifyEmail(token, email);

    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json(result, 200);
  } catch (error: any) {
    console.error('Error in email verification controller:', error);
    return c.json({ success: false, error: error.message || 'Failed to verify email', message: 'Verification error' }, 500);
  }
}

export async function resendVerificationController(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const origin = c.req.header('origin') || c.req.header('referer');

    const result = await authService.resendVerification(
      body.email,
      origin ? new URL(origin).origin : undefined
    );

    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json(result, 200);
  } catch (error: any) {
    console.error('Error in resend verification controller:', error);
    return c.json({ success: false, error: error.message || 'Failed to resend verification email' }, 500);
  }
}

export async function getAllUsersController(c: Context) {
  try {
    const users = await authService.getAllUsers();
    return c.json({ success: true, data: users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return c.json({ success: false, error: error.message || 'Failed to fetch users' }, 500);
  }
}
