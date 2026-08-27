import type { Context } from 'hono';
import { authService } from '../services/authService.js';
import { emailService } from '../services/emailService.js';

export async function registerController(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));

    const result = await authService.register({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      country: body.country
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
          code: 'EMAIL_NOT_VERIFIED',
          email: body.email,
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
    const body = await c.req.json().catch(() => ({}));
    const queryEmail = c.req.query('email');
    const queryCode = c.req.query('code') || c.req.query('token');

    const email = body.email || queryEmail;
    const code = body.code || body.token || queryCode;

    if (!email || !code) {
      return c.json({ 
        success: false, 
        error: 'Both email and 6-digit verification code are required.', 
        message: 'Please enter your email and the 6-digit code.' 
      }, 400);
    }

    const result = await authService.verifyEmail(email, code);

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
    const email = body.email;

    if (!email) {
      return c.json({ success: false, error: 'Email is required' }, 400);
    }

    const result = await authService.resendVerification(email);

    if (!result.success) {
      return c.json(result, 400);
    }

    return c.json(result, 200);
  } catch (error: any) {
    console.error('Error in resend verification controller:', error);
    return c.json({ success: false, error: error.message || 'Failed to resend verification email' }, 500);
  }
}

/**
 * Diagnostic endpoint for testing real Resend delivery
 * POST /api/auth/test-email
 */
export async function testEmailController(c: Context) {
  try {
    const body = await c.req.json().catch(() => ({}));
    const email = body.email;

    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'A valid email address is required for testing.' }, 400);
    }

    const result = await emailService.sendTestEmail(email.trim().toLowerCase());

    if (!result.success) {
      return c.json({
        success: false,
        error: result.error,
        fromEmail: result.fromEmail
      }, 400);
    }

    return c.json({
      success: true,
      message: 'Test email successfully dispatched to Resend delivery network.',
      messageId: result.id,
      fromEmail: result.fromEmail
    }, 200);
  } catch (error: any) {
    return c.json({ success: false, error: error.message || 'Failed to dispatch test email' }, 500);
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
