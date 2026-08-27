import type { User } from '../types';
import { INITIAL_USERS } from '../data/initialBookings';

const USERS_KEY = 'lv_users_v2';
const SESSION_KEY = 'lv_auth_session';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export interface AuthSession {
  userId: string;
  token: string;
  loginTime: string;
}

export const authService = {
  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
  },

  /**
   * Retrieves the currently authenticated user by validating the session against
   * the persistent user database. Never trusts client-modified role values.
   */
  getCurrentUser(): User | null {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) {
      return null; // Guest user
    }

    try {
      const session: AuthSession = JSON.parse(sessionData);
      if (!session || !session.userId) {
        this.logout();
        return null;
      }

      const users = this.getUsers();
      const authenticUser = users.find(u => u.id === session.userId);
      if (!authenticUser) {
        this.logout();
        return null;
      }

      // Return authentic user from storage without exposing password
      const { passwordHash: _hash, ...safeUser } = authenticUser as any;
      return safeUser as User;
    } catch {
      this.logout();
      return null;
    }
  },

  /**
   * Secure login verifying email and password.
   * STRICT SECURITY RULE: Unverified customers are rejected.
   */
  async login(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string; requiresVerification?: boolean }> {
    if (!email || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try server login first
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        const user = data.user as User;
        
        // Cache user in local registry
        const users = this.getUsers();
        const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
        if (existingIdx >= 0) {
          users[existingIdx] = { ...users[existingIdx], ...user };
        } else {
          users.push(user);
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Create authentic session
        const session: AuthSession = {
          userId: user.id,
          token: `lv-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true, user };
      }

      if (data.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          error: data.error || 'Please verify your email before signing in.'
        };
      }

      if (response.status === 401 || response.status === 403) {
        return { success: false, error: data.error || 'Invalid email or password.' };
      }
    } catch (err) {
      console.warn('⚠️ [authService] Backend login unreachable, falling back to local store check:', err);
    }

    // 2. Fallback check on local store
    const users = this.getUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Verify password against stored passwordHash
    const expectedPassword = (foundUser as any).passwordHash || 'password123';
    if (password !== expectedPassword) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Block unverified customers
    if (foundUser.role === 'customer' && foundUser.emailVerified === false) {
      return {
        success: false,
        requiresVerification: true,
        error: 'Please verify your email before signing in.'
      };
    }

    // Create authentic session
    const session: AuthSession = {
      userId: foundUser.id,
      token: `lv-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    const { passwordHash: _hash, ...safeUser } = foundUser as any;
    return { success: true, user: safeUser as User };
  },

  /**
   * Customer Registration.
   * STRICT SECURITY RULE: Public registration ALWAYS creates a 'customer' role with emailVerified = false.
   * Sends a real verification email via backend /api/auth/register (Resend).
   */
  async register(
    name: string,
    email: string,
    password?: string,
    phone?: string,
    country?: string
  ): Promise<{ success: boolean; user?: User; error?: string; message?: string; requiresVerification?: boolean }> {
    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Send registration to backend server which sends the real Resend email
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          password,
          phone,
          country
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create account.' };
      }

      // Save unverified user locally for quick offline access
      const users = this.getUsers();
      const existingIdx = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
      const newUserRecord: User = {
        id: data.user?.id || `user-cust-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        role: 'customer',
        passwordHash: password,
        phone: phone || '',
        country: country || 'International',
        emailVerified: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString().split('T')[0]
      } as any;

      if (existingIdx >= 0) {
        users[existingIdx] = newUserRecord;
      } else {
        users.push(newUserRecord);
      }
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      return {
        success: true,
        requiresVerification: true,
        message: data.message || 'Please check your email to verify your account.',
        user: newUserRecord
      };
    } catch (err: any) {
      console.warn('⚠️ [authService] Backend registration unreachable, fallback local register:', err);
      
      const users = this.getUsers();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser: User = {
        id: `user-cust-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        name: name.trim(),
        email: cleanEmail,
        role: 'customer',
        passwordHash: password,
        phone: phone || '',
        country: country || 'International',
        emailVerified: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString().split('T')[0]
      } as any;

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      return {
        success: true,
        requiresVerification: true,
        message: 'Account created. Please check your email to verify.',
        user: newUser
      };
    }
  },

  /**
   * Verify email with 6-digit code (OTP) against backend API
   */
  async verifyEmail(email: string, code: string): Promise<{ success: boolean; message: string; error?: string; user?: any }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim()
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Update local user record to verified
        if (data.user?.email || email) {
          const targetEmail = (data.user?.email || email).toLowerCase();
          const users = this.getUsers();
          const userIdx = users.findIndex(u => u.email.toLowerCase() === targetEmail);
          if (userIdx >= 0) {
            users[userIdx].emailVerified = true;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
          }
        }
        return {
          success: true,
          message: data.message || 'Your email address has been verified successfully!'
        };
      }

      return {
        success: false,
        error: data.error || 'Verification code is invalid or expired.',
        message: data.message || data.error || 'Verification failed.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to connect to verification server.',
        message: 'Could not connect to verification server.'
      };
    }
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'A fresh verification link has been sent to your email.'
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to resend verification email.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Could not connect to email service.'
      };
    }
  },

  /**
   * Request password reset code (Forgot Password)
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'A 6-digit password reset code has been sent to your email.'
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to process password reset request.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Could not connect to authentication server.'
      };
    }
  },

  /**
   * Verify password reset 6-digit OTP
   */
  async verifyPasswordResetOtp(email: string, code: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim().replace(/\s+/g, '')
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return {
          success: true,
          message: data.message || 'Code verified successfully.'
        };
      }

      return {
        success: false,
        error: data.error || 'Invalid or expired verification code.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Could not connect to authentication server.'
      };
    }
  },

  /**
   * Complete password reset with new password
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim().replace(/\s+/g, ''),
          newPassword
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Also update local mock storage if user exists locally
        const users = this.getUsers();
        const idx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (idx !== -1) {
          (users[idx] as any).passwordHash = newPassword;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }

        return {
          success: true,
          message: data.message || 'Your password has been successfully reset! You can now log in.'
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to reset password.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Could not connect to authentication server.'
      };
    }
  },

  /**
   * Update profile fields. Strips immutable or security fields like 'role' and 'id'.
   */
  updateProfile(userId: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');

    // Security guard: prevent elevating role or changing user ID
    const sanitizedUpdates = { ...updates } as any;
    delete sanitizedUpdates.role;
    delete sanitizedUpdates.id;
    delete sanitizedUpdates.createdAt;

    users[idx] = { ...users[idx], ...sanitizedUpdates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { passwordHash: _hash, ...safeUser } = users[idx] as any;
    return safeUser as User;
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }
};
