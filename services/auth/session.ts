import { storage } from '@/utils/storage';
import type { AuthSession, UserRole } from '@/store/slices/authSlice';

const AUTH_SESSION_KEY = '@cpms/auth_session';

const VALID_ROLES: UserRole[] = [
  'cabin_crew',
  'system_admin',
  'performance_manager',
  'super_user',
];

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as Partial<AuthSession>;
  return Boolean(
    session.user &&
      typeof session.user.id === 'string' &&
      typeof session.user.email === 'string' &&
      typeof session.user.name === 'string' &&
      typeof session.token === 'string' &&
      session.selectedRole &&
      VALID_ROLES.includes(session.selectedRole) &&
      session.selectedStaff &&
      typeof session.selectedStaff.id === 'string' &&
      typeof session.selectedStaff.name === 'string'
  );
}

export async function saveAuthSession(session: AuthSession): Promise<void> {
  await storage.set(AUTH_SESSION_KEY, session);
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await storage.get<unknown>(AUTH_SESSION_KEY);
  return isAuthSession(session) ? session : null;
}

export async function clearAuthSession(): Promise<void> {
  await storage.remove(AUTH_SESSION_KEY);
}
