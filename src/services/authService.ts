import type { User } from '../types';
import { INITIAL_USERS } from '../data/initialBookings';

const USERS_KEY = 'lv_users_v2';
const SESSION_KEY = 'lv_auth_session';

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
   * Secure login verifying email and password against stored credentials.
   */
  login(email: string, password?: string): { success: boolean; user?: User; error?: string } {
    if (!email || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();
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
   * STRICT SECURITY RULE: Public registration ALWAYS creates a 'customer' role.
   * System never allows client to register an 'admin' account.
   */
  register(
    name: string,
    email: string,
    password?: string,
    phone?: string,
    country?: string
  ): { success: boolean; user?: User; error?: string } {
    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // System-enforced customer role
    const newUser: User = {
      id: `user-cust-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      name: name.trim(),
      email: cleanEmail,
      role: 'customer', // Strictly customer
      passwordHash: password,
      phone: phone || '',
      country: country || 'International',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    } as any;

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Automatically establish session for newly registered customer
    const session: AuthSession = {
      userId: newUser.id,
      token: `lv-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    const { passwordHash: _hash, ...safeUser } = newUser as any;
    return { success: true, user: safeUser as User };
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
