import { sha256, generateRandomHex } from '../utils/crypto.js';
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
  createdAt: Date;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  country?: string;
  origin?: string;
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

  hashToken(token: string): string {
    return sha256(token);
  }

  generateSecureToken(): string {
    return generateRandomHex(32);
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

  private async findUserByTokenHash(tokenHash: string): Promise<ServerUserRecord | null> {
    // 1. Try Prisma DB
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const dbUser = await prisma.user.findFirst({
          where: { emailVerificationTokenHash: tokenHash }
        });
        if (dbUser) return dbUser as any;
      } catch (err) {
        // Fall through to memory store
      }
    }

    // 2. Memory store
    for (const u of this.memoryUsers.values()) {
      if (u.emailVerificationTokenHash === tokenHash) {
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
   * Register a customer account with emailVerified = false and send real verification email via Resend
   */
  async register(input: RegisterInput): Promise<{ success: boolean; message?: string; error?: string; user?: any }> {
    const { name, email, password, phone, country, origin } = input;

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

      // If user exists but is NOT verified, refresh token and resend verification email
      const token = this.generateSecureToken();
      const tokenHash = this.hashToken(token);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

      existing.name = name.trim();
      existing.passwordHash = password;
      existing.phone = phone || existing.phone;
      existing.country = country || existing.country;
      existing.emailVerificationTokenHash = tokenHash;
      existing.emailVerificationExpiresAt = expiresAt;

      await this.saveUser(existing);

      const frontendBaseUrl = origin || process.env.FRONTEND_URL || 'http://localhost:5174';
      const verificationLink = `${frontendBaseUrl}/verify-email?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

      await emailService.sendVerificationEmail({
        to: cleanEmail,
        name: existing.name,
        verificationLink,
        expiresInHours: 24
      });

      return {
        success: true,
        message: 'Account updated. A new verification link has been sent to your email.',
        user: {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          emailVerified: false,
          role: existing.role
        }
      };
    }

    // Generate secure single-use token
    const token = this.generateSecureToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

    const newUser: ServerUserRecord = {
      id: `user-cust-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'customer', // Strictly customer
      passwordHash: password,
      phone: phone || '',
      country: country || 'International',
      emailVerified: false,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: expiresAt,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date()
    };

    await this.saveUser(newUser);

    const frontendBaseUrl = origin || process.env.FRONTEND_URL || 'http://localhost:5174';
    const verificationLink = `${frontendBaseUrl}/verify-email?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

    const emailResult = await emailService.sendVerificationEmail({
      to: cleanEmail,
      name: newUser.name,
      verificationLink,
      expiresInHours: 24
    });

    if (!emailResult.success) {
      console.warn(`⚠️ [AuthService] Account created for ${cleanEmail}, but email sending failed: ${emailResult.error}`);
    }

    return {
      success: true,
      message: 'Registration successful. Please verify your email before signing in.',
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
   * Resend verification email for an unverified account
   */
  async resendVerification(email: string, origin?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await this.findUserByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.emailVerified) {
      return { success: false, error: 'This email is already verified. You can sign in immediately.' };
    }

    // Generate new token & invalidate old one
    const token = this.generateSecureToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationTokenHash = tokenHash;
    user.emailVerificationExpiresAt = expiresAt;
    await this.saveUser(user);

    const frontendBaseUrl = origin || process.env.FRONTEND_URL || 'http://localhost:5174';
    const verificationLink = `${frontendBaseUrl}/verify-email?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

    const emailResult = await emailService.sendVerificationEmail({
      to: cleanEmail,
      name: user.name,
      verificationLink,
      expiresInHours: 24
    });

    if (!emailResult.success) {
      return { success: false, error: emailResult.error || 'Failed to send verification email.' };
    }

    return { success: true, message: 'A fresh verification link has been sent to your email.' };
  }

  /**
   * Verify single-use token, mark emailVerified = true, clear token hash
   */
  async verifyEmail(token: string, email?: string): Promise<VerifyEmailResult> {
    if (!token || !token.trim()) {
      return { success: false, error: 'Verification token is required.', message: 'Invalid verification token.' };
    }

    const tokenHash = this.hashToken(token.trim());

    // Find user with this token hash
    let user = await this.findUserByTokenHash(tokenHash);

    // If not found by hash, check if user by email is already verified
    if (!user && email) {
      const existingUser = await this.findUserByEmail(email);
      if (existingUser && existingUser.emailVerified) {
        return {
          success: true,
          message: 'Your email address is already verified. Please sign in.',
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            emailVerified: true,
            role: existingUser.role
          }
        };
      }
    }

    if (!user) {
      return {
        success: false,
        error: 'Invalid or already used verification token.',
        message: 'This verification link is invalid or has already been used.'
      };
    }

    // Check if token has expired
    if (user.emailVerificationExpiresAt && new Date() > user.emailVerificationExpiresAt) {
      return {
        success: false,
        error: 'Verification token has expired.',
        message: 'This verification link has expired. Please request a new verification link.'
      };
    }

    // Mark as verified and invalidate token (single-use)
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
   * Login method verifying credentials AND requiring emailVerified = true for customers
   */
  async login(email: string, password?: string): Promise<{ success: boolean; user?: any; error?: string; requiresVerification?: boolean }> {
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
        error: 'Please verify your email before signing in.'
      };
    }

    const { passwordHash: _hash, emailVerificationTokenHash: _tHash, ...safeUser } = user;
    return {
      success: true,
      user: safeUser
    };
  }

  /**
   * Get all users for admin management
   */
  async getAllUsers() {
    const users: any[] = [];
    for (const u of this.memoryUsers.values()) {
      const { passwordHash: _p, emailVerificationTokenHash: _t, ...safe } = u;
      users.push(safe);
    }
    return users;
  }
}

export const authService = new AuthService();
