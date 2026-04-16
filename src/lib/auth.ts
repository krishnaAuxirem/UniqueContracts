import type { User, UserRole } from '@/types';

const USERS_KEY = 'uc_users';
const SESSION_KEY = 'uc_session';

const DEFAULT_USERS: User[] = [
  {
    id: 'u1',
    name: 'Aryan Kapoor',
    email: 'creator@demo.com',
    role: 'creator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan',
    company: 'ContentHub',
    plan: 'pro',
    createdAt: '2024-10-01',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'brand@demo.com',
    role: 'brand',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    company: 'BrandEdge Corp',
    plan: 'enterprise',
    createdAt: '2024-08-15',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'Rohit Mehta',
    email: 'analyst@demo.com',
    role: 'analyst',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit',
    company: 'DataInsights Labs',
    plan: 'pro',
    createdAt: '2024-09-20',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'u4',
    name: 'Admin User',
    email: 'admin@demo.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    company: 'UniqueContracts',
    plan: 'enterprise',
    createdAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  },
];

function getUsers(): User[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  const users = JSON.parse(stored) as User[];
  // Ensure defaults are always present
  const emails = users.map(u => u.email);
  DEFAULT_USERS.forEach(du => {
    if (!emails.includes(du.email)) users.push(du);
  });
  return users;
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(name: string, email: string, password: string, role: UserRole, company?: string): User {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('Email already registered. Please login.');
  }
  const newUser: User = {
    id: `u_${Date.now()}`,
    name,
    email,
    role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    company,
    plan: 'free',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  // Store password (in real app, this would be hashed)
  localStorage.setItem(`uc_pwd_${email}`, password);
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function login(email: string, password: string): User {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('No account found with this email. Please register first.');
  }
  const storedPwd = localStorage.getItem(`uc_pwd_${email}`);
  // For demo users, password is 'demo123'
  const isDemoUser = DEFAULT_USERS.find(u => u.email === email);
  const validPwd = isDemoUser ? password === 'demo123' : password === storedPwd;
  if (!validPwd) {
    throw new Error('Invalid password. Please try again.');
  }
  user.lastLogin = new Date().toISOString();
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function loginWithGoogle(role: UserRole = 'brand'): User {
  const users = getUsers();
  const googleUser: User = {
    id: `google_${Date.now()}`,
    name: 'Google User',
    email: `google_${Date.now()}@gmail.com`,
    role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Google${Date.now()}`,
    plan: 'free',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  users.push(googleUser);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(googleUser));
  return googleUser;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  return JSON.parse(session) as User;
}

export function updateProfile(updates: Partial<User>): User {
  const current = getCurrentUser();
  if (!current) throw new Error('Not authenticated');
  const users = getUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) throw new Error('User not found');
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
  return users[idx];
}

export function getAllUsers(): User[] {
  return getUsers();
}

export function deleteUser(userId: string): void {
  const users = getUsers().filter(u => u.id !== userId);
  saveUsers(users);
}

export function updateUserRole(userId: string, role: UserRole): void {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx !== -1) {
    users[idx].role = role;
    saveUsers(users);
  }
}
