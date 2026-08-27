import type { Context, Next } from 'hono';
import { authService, type ServerUserRecord } from '../services/authService.js';

/**
 * Server-side Admin Authorization Middleware
 * Verifies that the requesting user presents an authentic, cryptographically verified session token
 * and that the user record has role === 'admin'.
 *
 * Rules:
 * 1. Missing or empty token -> 401 Unauthorized
 * 2. Invalid, forged, or expired token -> 401 Unauthorized
 * 3. Authenticated customer (role !== 'admin') -> 403 Forbidden
 * 4. Authenticated admin -> Allowed (c.set('user', adminUser))
 *
 * Note: Never trusts client-supplied headers (x-user-role, x-user-email, x-user-id) without verified token.
 */
export async function requireAdmin(c: Context, next: Next) {
  const authHeader = c.req.header('authorization') || c.req.header('Authorization');

  if (!authHeader) {
    return c.json({
      success: false,
      error: '401 Unauthorized: Authentication token required.'
    }, 401);
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return c.json({
      success: false,
      error: '401 Unauthorized: Authentication token required.'
    }, 401);
  }

  const result = await authService.verifySessionToken(token);
  if (!result.valid || !result.user) {
    return c.json({
      success: false,
      error: '401 Unauthorized: Invalid or expired session token.'
    }, 401);
  }

  if (result.user.role !== 'admin') {
    return c.json({
      success: false,
      error: '403 Forbidden: Administrator authorization required to perform this action.'
    }, 403);
  }

  c.set('user' as any, result.user);
  await next();
}

/**
 * Server-side User Authentication Middleware
 * Verifies that the requesting user presents an authentic session token.
 */
export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('authorization') || c.req.header('Authorization');

  if (!authHeader) {
    return c.json({
      success: false,
      error: '401 Unauthorized: Authentication token required.'
    }, 401);
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return c.json({
      success: false,
      error: '401 Unauthorized: Authentication token required.'
    }, 401);
  }

  const result = await authService.verifySessionToken(token);
  if (!result.valid || !result.user) {
    return c.json({
      success: false,
      error: '401 Unauthorized: Invalid or expired session token.'
    }, 401);
  }

  c.set('user' as any, result.user);
  await next();
}

/**
 * Optional Auth helper to extract authentic user if token is provided
 */
export async function getOptionalAuthUser(c: Context): Promise<ServerUserRecord | null> {
  const authHeader = c.req.header('authorization') || c.req.header('Authorization');
  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  const result = await authService.verifySessionToken(token);
  return result.valid && result.user ? result.user : null;
}
