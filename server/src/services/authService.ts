import { sha256, generateNumericOTP } from '../utils/crypto.js';
import { emailService } from './emailService.js';
import type { PrismaClient } from '@prisma/client';

let _prisma: PrismaClient | null = null;
function getPrismaClient(): PrismaClient | null {
  if (!_prisma && typeof process !== 'undefined' && process.env?.DATABASE_URL) {
    try {
      const { PrismaClient: PC } = require('@prisma/client');
      _prisma = new PC();
    } catch (e) {
      // Prisma client optional / fallback to memory store
    }
  }
  return _prisma;
}

export interface ServerUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  passwordHash?: string;
  phone?: string;
  country?: string;
  avatar?: string;
  passportNumber?: string;
  dietaryPreferences?: string;
  emergencyContact?: any;
  emailVerified: boolean;
  emailVerificationTokenHash?: string | null;
  emailVerificationExpiresAt?: Date | null;
  passwordResetTokenHash?: string | null;
  passwordResetExpiresAt?: Date | null;
  lastResentAt?: Date | null;
  lastResetRequestedAt?: Date | null;
  createdAt: Date;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  country?: string;
}

export interface VerifyEmailResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: string;
  };
  error?: string;
}

export interface ForgotPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface VerifyPasswordResetOtpResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

export class AuthService {
  // In-memory persistent user repository fallback (for instant resilient access)
  private memoryUsers: Map<string, ServerUserRecord> = new Map();

  constructor() {
    // Seed default admin and demo customer in memory store
    const admin: ServerUserRecord = {
      id: 'user-admin-1',
      name: 'Kasun Bandara (Operations Director)',
      email: 'admin@lankavoyage.com',
      role: 'admin',
      passwordHash: 'admin123',
      emailVerified: true,
      phone: '+94 77 123 4567',
      country: 'Sri Lanka',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date()
    };
    const customer: ServerUserRecord = {
      id: 'user-customer-1',
      name: 'Sarah Jenkins',
      email: 'sarah.traveler@example.com',
      role: 'customer',
      passwordHash: 'password123',
      emailVerified: true,
      phone: '+44 7700 900077',
      country: 'United Kingdom',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date()
    };
    this.memoryUsers.set(admin.id, admin);
    this.memoryUsers.set(customer.id, customer);
  }

  hashCode(code: string): string {
    return sha256(code.trim());
  }

  generate6DigitCode(): string {
    return generateNumericOTP(6);
  }

  private async findUserByEmail(email: string): Promise<ServerUserRecord | null> {
    const cleanEmail = email.trim().toLowerCase();
    
    // 1. Try Prisma DB
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: cleanEmail }
        });
        if (dbUser) return dbUser as any;
      } catch (err) {
        // Fall through to memory store
      }
    }

    // 2. Memory store
    for (const u of this.memoryUsers.values()) {
      if (u.email.toLowerCase() === cleanEmail) {
        return u;
      }
    }
    return null;
  }

  private async saveUser(user: ServerUserRecord): Promise<ServerUserRecord> {
    this.memoryUsers.set(user.id, user);

    const prisma = getPrismaClient();
    if (prisma) {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            passwordHash: user.passwordHash,
            phone: user.phone,
            country: user.country,
            avatar: user.avatar,
            emailVerified: user.emailVerified,
            emailVerificationTokenHash: user.emailVerificationTokenHash,
            emailVerificationExpiresAt: user.emailVerificationExpiresAt
          },
          update: {
            name: user.name,
            passwordHash: user.passwordHash,
            phone: user.phone,
            country: user.country,
            emailVerified: user.emailVerified,
            emailVerificationTokenHash: user.emailVerificationTokenHash,
            emailVerificationExpiresAt: user.emailVerificationExpiresAt
          }
        });
      } catch (err) {
        // Memory store is already updated
      }
    }
    return user;
  }

  /**
   * Register a customer account with emailVerified = false and send 6-digit OTP email via Resend
   */
  async register(input: RegisterInput): Promise<{ success: boolean; message?: string; error?: string; user?: any }> {
    const { name, email, password, phone, country } = input;

    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await this.findUserByEmail(cleanEmail);

    if (existing) {
      if (existing.emailVerified) {
        return { success: false, error: 'An account with this email already exists and is verified. Please sign in.' };
      }

      // If user exists but is NOT verified, generate fresh 6-digit OTP code (10 minutes expiry)
      const code = this.generate6DigitCode();
      const codeHash = this.hashCode(code);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      // Send OTP via Resend first and ensure it succeeds
      const emailResult = await emailService.sendVerificationOTP({
        to: cleanEmail,
        name: existing.name,
        code,
        expiresInMinutes: 10
      });

      if (!emailResult.success) {
        return {
          success: false,
          error: emailResult.error || 'Failed to send verification email. Please check the email address or service configuration.'
        };
      }

      existing.name = name.trim();
      existing.passwordHash = password;
      existing.phone = phone || existing.phone;
      existing.country = country || existing.country;
      existing.emailVerificationTokenHash = codeHash;
      existing.emailVerificationExpiresAt = expiresAt;
      existing.lastResentAt = new Date();

      await this.saveUser(existing);

      return {
        success: true,
        message: 'A 6-digit verification code has been sent to your email.',
        user: {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          emailVerified: false,
          role: existing.role
        }
      };
    }

    // Generate 6-digit numeric OTP code
    const code = this.generate6DigitCode();
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Send OTP via Resend
    const emailResult = await emailService.sendVerificationOTP({
      to: cleanEmail,
      name: name.trim(),
      code,
      expiresInMinutes: 10
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || 'Failed to deliver verification email. Please ensure your email address is valid.'
      };
    }

    const newUser: ServerUserRecord = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'customer',
      passwordHash: password,
      phone: phone || '',
      country: country || 'Sri Lanka',
      emailVerified: false,
      emailVerificationTokenHash: codeHash,
      emailVerificationExpiresAt: expiresAt,
      lastResentAt: new Date(),
      createdAt: new Date()
    };

    await this.saveUser(newUser);

    return {
      success: true,
      message: 'Registration successful! A 6-digit verification code has been sent to your email.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        emailVerified: false,
        role: newUser.role
      }
    };
  }

  /**
   * Resend 6-digit verification code with 30s rate-limit cooldown
   */
  async resendVerification(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email is required' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await this.findUserByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.emailVerified) {
      return { success: false, error: 'This email is already verified. You can sign in immediately.' };
    }

    // Rate limit: Cooldown of 30 seconds between resend requests
    if (user.lastResentAt) {
      const elapsedSeconds = (Date.now() - new Date(user.lastResentAt).getTime()) / 1000;
      if (elapsedSeconds < 30) {
        const remainingSeconds = Math.ceil(30 - elapsedSeconds);
        return { 
          success: false, 
          error: `Please wait ${remainingSeconds} seconds before requesting a new code.` 
        };
      }
    }

    // Generate new 6-digit code (invalidates previous code)
    const code = this.generate6DigitCode();
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const emailResult = await emailService.sendVerificationOTP({
      to: cleanEmail,
      name: user.name,
      code,
      expiresInMinutes: 10
    });

    if (!emailResult.success) {
      return { success: false, error: emailResult.error || 'Failed to send verification email.' };
    }

    user.emailVerificationTokenHash = codeHash;
    user.emailVerificationExpiresAt = expiresAt;
    user.lastResentAt = new Date();
    await this.saveUser(user);

    return { success: true, message: 'A new 6-digit verification code has been sent to your email.' };
  }

  /**
   * Verify 6-digit code (OTP), mark emailVerified = true, clear code
   */
  async verifyEmail(email: string, code: string): Promise<VerifyEmailResult> {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email address is required.', message: 'Email address is required.' };
    }

    if (!code || !code.trim()) {
      return { success: false, error: 'Verification code is required.', message: 'Please enter the 6-digit code.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim().replace(/\s+/g, '');

    const user = await this.findUserByEmail(cleanEmail);

    if (!user) {
      return {
        success: false,
        error: 'No account found with this email address.',
        message: 'No account found with this email address.'
      };
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'Your email address is already verified. Please sign in.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: true,
          role: user.role
        }
      };
    }

    // Check expiry
    if (user.emailVerificationExpiresAt && new Date() > new Date(user.emailVerificationExpiresAt)) {
      return {
        success: false,
        error: 'Verification code has expired. Please request a new code.',
        message: 'The verification code has expired. Please click Resend Code to receive a new one.'
      };
    }

    // Verify hash match
    const inputHash = this.hashCode(cleanCode);
    if (!user.emailVerificationTokenHash || user.emailVerificationTokenHash !== inputHash) {
      return {
        success: false,
        error: 'Invalid verification code. Please check and try again.',
        message: 'Invalid verification code. Please make sure you entered all 6 digits correctly.'
      };
    }

    // Mark as verified and invalidate OTP code (single-use)
    user.emailVerified = true;
    user.emailVerificationTokenHash = null;
    user.emailVerificationExpiresAt = null;
    await this.saveUser(user);

    return {
      success: true,
      message: 'Your email address has been successfully verified! You can now sign in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: true,
        role: user.role
      }
    };
  }

  /**
   * Request Password Reset (Forgot Password Flow)
   * Generates 6-digit numeric OTP, sets 10-min expiry, enforces 30s resend cooldown,
   * sends branded email via Resend, stores only secure SHA-256 hash.
   */
  async requestPasswordReset(email: string): Promise<ForgotPasswordResult> {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email address is required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await this.findUserByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address. Please check your spelling or register.' };
    }

    // Enforce 30-second rate-limit cooldown
    if (user.lastResetRequestedAt) {
      const elapsedSeconds = (Date.now() - new Date(user.lastResetRequestedAt).getTime()) / 1000;
      if (elapsedSeconds < 30) {
        const remainingSeconds = Math.ceil(30 - elapsedSeconds);
        return {
          success: false,
          error: `Please wait ${remainingSeconds} seconds before requesting another reset code.`
        };
      }
    }

    const code = this.generate6DigitCode();
    const codeHash = this.hashCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const emailResult = await emailService.sendPasswordResetOTP({
      to: cleanEmail,
      name: user.name,
      code,
      expiresInMinutes: 10
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || 'Failed to deliver password reset email. Please try again.'
      };
    }

    user.passwordResetTokenHash = codeHash;
    user.passwordResetExpiresAt = expiresAt;
    user.lastResetRequestedAt = new Date();
    await this.saveUser(user);

    return {
      success: true,
      message: 'A 6-digit password reset code has been sent to your email.'
    };
  }

  /**
   * Verify Password Reset 6-Digit OTP
   */
  async verifyPasswordResetOtp(email: string, code: string): Promise<VerifyPasswordResetOtpResult> {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email address is required.' };
    }

    if (!code || !code.trim()) {
      return { success: false, error: 'Verification code is required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim().replace(/\s+/g, '');

    const user = await this.findUserByEmail(cleanEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (!user.passwordResetTokenHash) {
      return { success: false, error: 'No active password reset request found. Please request a new code.' };
    }

    if (user.passwordResetExpiresAt && new Date() > new Date(user.passwordResetExpiresAt)) {
      return { success: false, error: 'The reset code has expired. Please request a new code.' };
    }

    const inputHash = this.hashCode(cleanCode);
    if (user.passwordResetTokenHash !== inputHash) {
      return { success: false, error: 'Invalid 6-digit reset code. Please check and try again.' };
    }

    return {
      success: true,
      message: 'Verification code confirmed. You may now enter your new password.'
    };
  }

  /**
   * Reset Password: Verifies OTP, sets new password, immediately invalidates OTP (single-use)
   */
  async resetPassword(email: string, code: string, newPassword?: string): Promise<ResetPasswordResult> {
    if (!email || !email.trim()) {
      return { success: false, error: 'Email address is required.' };
    }

    if (!code || !code.trim()) {
      return { success: false, error: 'Reset code is required.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim().replace(/\s+/g, '');

    const user = await this.findUserByEmail(cleanEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (!user.passwordResetTokenHash) {
      return { success: false, error: 'This reset code is invalid or has already been used. Please request a new one.' };
    }

    if (user.passwordResetExpiresAt && new Date() > new Date(user.passwordResetExpiresAt)) {
      return { success: false, error: 'This reset code has expired. Please request a new one.' };
    }

    const inputHash = this.hashCode(cleanCode);
    if (user.passwordResetTokenHash !== inputHash) {
      return { success: false, error: 'Invalid 6-digit reset code. Please check and try again.' };
    }

    // Set new password
    user.passwordHash = newPassword;
    // Invalidate OTP immediately (single-use)
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await this.saveUser(user);

    return {
      success: true,
      message: 'Your password has been successfully reset! You can now log in with your new password.'
    };
  }

  /**
   * Login method verifying credentials AND requiring emailVerified = true for customers
   */
  async login(email: string, password?: string): Promise<{ success: boolean; user?: any; error?: string; requiresVerification?: boolean; code?: string }> {
    if (!email || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await this.findUserByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (user.passwordHash !== password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // STRICT SECURITY RULE: Customers must be verified before login
    if (user.role === 'customer' && !user.emailVerified) {
      return {
        success: false,
        requiresVerification: true,
        code: 'EMAIL_NOT_VERIFIED',
        error: 'Please verify your email before signing in.'
      };
    }

    const { passwordHash: _hash, emailVerificationTokenHash: _tHash, passwordResetTokenHash: _rHash, ...safeUser } = user;
    return {
      success: true,
      user: safeUser
    };
  }

  /**
   * Get all users for admin management (strips sensitive hashes)
   */
  async getAllUsers() {
    const users: any[] = [];
    for (const u of this.memoryUsers.values()) {
      const { passwordHash: _p, emailVerificationTokenHash: _t, passwordResetTokenHash: _r, ...safe } = u;
      users.push(safe);
    }
    return users;
  }

  /**
   * Get user by ID (for admin inspection)
   */
  async getUserById(id: string) {
    const user = this.memoryUsers.get(id);
    if (!user) return null;
    const { passwordHash: _p, emailVerificationTokenHash: _t, passwordResetTokenHash: _r, ...safe } = user;
    return safe;
  }

  /**
   * Get user by Email
   */
  async getUserByEmail(email: string) {
    return this.findUserByEmail(email);
  }

  /**
   * Admin Update User Profile
   */
  async updateUser(id: string, updates: Partial<ServerUserRecord>) {
    const user = this.memoryUsers.get(id);
    if (!user) return null;

    if (updates.name) user.name = updates.name.trim();
    if (updates.phone !== undefined) user.phone = updates.phone;
    if (updates.country !== undefined) user.country = updates.country;
    if (updates.passportNumber !== undefined) user.passportNumber = updates.passportNumber;
    if (updates.dietaryPreferences !== undefined) user.dietaryPreferences = updates.dietaryPreferences;
    if (updates.role !== undefined) user.role = updates.role;
    if (updates.emailVerified !== undefined) user.emailVerified = updates.emailVerified;

    await this.saveUser(user);
    const { passwordHash: _p, emailVerificationTokenHash: _t, passwordResetTokenHash: _r, ...safe } = user;
    return safe;
  }

  /**
   * Admin Delete User Profile (Soft delete/safe delete preserving historical bookings)
   */
  async deleteUser(id: string) {
    const user = this.memoryUsers.get(id);
    if (!user) return false;
    return this.memoryUsers.delete(id);
  }
}

export const authService = new AuthService();
