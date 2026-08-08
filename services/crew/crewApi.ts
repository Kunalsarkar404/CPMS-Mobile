import { apiRequest } from '@/services/api/client';

export interface ManagedStaffMember {
  StaffId: string;
  OrgId: string;
  Full_Name: string;
  PrimaryNationality: string;
  CurrentGrade: string;
  LineMgrStaffId: string;
}

export interface StaffProfile {
  StaffId: string;
  OrgId: string;
  Full_Name: string;
  PrimaryNationality: string;
  CurrentGrade: string;
  DOJ: string;
  LineMgrStaffId: string;
}

// Staff reporting to the currently-authenticated performance manager,
// filtered server-side from the manager's own JWT — never client-supplied.
export function getManagedStaff(): Promise<ManagedStaffMember[]> {
  return apiRequest<ManagedStaffMember[]>('/crew/managed-staff');
}

// Existing endpoint shared with the web app — used here read-only, for the
// currently-authenticated staff member's own StaffId.
export function getStaffById(staffId: string): Promise<StaffProfile> {
  return apiRequest<StaffProfile>(`/crew/mstr-staff/${encodeURIComponent(staffId)}`);
}
