import { apiRequest, API_BASE_URL } from '@/services/api/client';
import { downloadFile } from '@/services/api/fileTransfer';

// One crew self-service reward row, shaped by the backend (/crew/my-rewards) for
// the mobile "Rewards" card. The staff member is resolved server-side from their
// JWT; this list only ever contains their own rewards.
export interface CrewReward {
  id: string;
  code: string;
  type: string;
  // Raw ISO reward date (or null) — formatted for display on screen.
  date: string | null;
  grade: string | null;
  points: number | null;
  notes: string | null;
  // Award-letter file name, when one has been attached (else null).
  letterFileName: string | null;
}

// All rewards awarded to the logged-in staff member, resolved from their JWT.
export function getMyRewards(): Promise<CrewReward[]> {
  return apiRequest<CrewReward[]>('/crew/my-rewards');
}

// Downloads a reward's award letter — keyed by opaque fileName only, same as the
// other crew attachment downloads.
export function downloadRewardLetter(fileName: string): Promise<string> {
  const url = `${API_BASE_URL}/crew/rewards/files/${encodeURIComponent(fileName)}`;
  return downloadFile(url, fileName);
}
