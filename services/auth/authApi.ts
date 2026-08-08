import { apiRequest } from '@/services/api/client';

export interface RoleSummary {
  roleId: string;
  roleName: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface StaffLoginResult {
  staff: {
    staffId: string;
    orgId: string;
    fullName: string;
  };
  tokens: TokenPair;
}

export interface ManagerLoginResult {
  user: {
    id: string;
    userId: string;
    staffId: string;
    orgId: string;
    email: string;
    userName: string;
    roles: RoleSummary[];
  };
  tokens?: TokenPair;
  needsRoleSelection: boolean;
  roles?: RoleSummary[];
}

// Cabin crew — authenticates against mstr_staff.
export function login(staffId: string, password: string): Promise<StaffLoginResult> {
  return apiRequest<StaffLoginResult>('/auth/staff-login', {
    method: 'POST',
    body: { staffId, password },
    skipAuth: true,
  });
}

// Performance manager — authenticates against mstr_user (same as web).
export function managerLogin(staffId: string, password: string): Promise<ManagerLoginResult> {
  return apiRequest<ManagerLoginResult>('/auth/login', {
    method: 'POST',
    body: { staffId, password },
    skipAuth: true,
  });
}

export function selectRoleAfterLogin(userId: string, orgId: string, roleId: string): Promise<TokenPair> {
  return apiRequest<TokenPair>('/auth/select-role-after-login', {
    method: 'POST',
    body: { userId, orgId, roleId },
    skipAuth: true,
  });
}

// Performance manager acting as one of their direct reports.
export function loginAsStaff(staffId: string): Promise<StaffLoginResult> {
  return apiRequest<StaffLoginResult>('/auth/login-as-staff', {
    method: 'POST',
    body: { staffId },
  });
}

export function refresh(refreshToken: string): Promise<TokenPair> {
  return apiRequest<TokenPair>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    skipAuth: true,
  });
}

export interface LineManager {
  staffId: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
}

// Line manager for the currently-authenticated staff identity, resolved
// server-side from mstr_staff.Line_MGR_STAFFID → mstr_users.
export function getLineManager(): Promise<LineManager | null> {
  return apiRequest<LineManager | null>('/auth/me/line-manager');
}
