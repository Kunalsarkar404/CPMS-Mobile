import { storage } from '@/utils/storage';
import { clearTokens, setTokens } from '@/services/api/client';
import type { StaffSession } from '@/store/slices/authSlice';

const AUTH_SESSION_KEY = '@cpms/auth_session';

function isStaffSession(value: unknown): value is StaffSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as Partial<StaffSession>;
  return Boolean(
    typeof session.staffId === 'string' &&
      typeof session.orgId === 'string' &&
      typeof session.fullName === 'string' &&
      typeof session.accessToken === 'string' &&
      typeof session.refreshToken === 'string' &&
      typeof session.actingAsStaff === 'boolean'
  );
}

export async function saveAuthSession(session: StaffSession): Promise<void> {
  await storage.set(AUTH_SESSION_KEY, session);
  await setTokens(session.accessToken, session.refreshToken);
}

export async function getAuthSession(): Promise<StaffSession | null> {
  const session = await storage.get<unknown>(AUTH_SESSION_KEY);
  return isStaffSession(session) ? session : null;
}

export async function clearAuthSession(): Promise<void> {
  await storage.remove(AUTH_SESSION_KEY);
  await clearTokens();
}
