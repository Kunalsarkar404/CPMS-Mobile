import { apiRequest, API_BASE_URL } from '@/services/api/client';
import { downloadFile, type FileAttachment } from '@/services/api/fileTransfer';

export type BmiRagStatus = 'red' | 'amber' | 'green';
export type BmiAttachment = FileAttachment;

// One BMI reading, with its RAG status resolved server-side from the org's
// configured BMI ranges (BMI_RAG_INDICATOR).
export interface CrewBmiReading {
  seq: number;
  bmi: string;
  // Raw ISO reading date (or null) — formatted for display on screen.
  date: string | null;
  status: BmiRagStatus;
  notes: string;
  // Uploaded reading images/documents (BMI_Pictures).
  attachments: BmiAttachment[];
}

// The full crew self-service BMI view: reading history plus the target BMI and
// next-review date from the open BMI_NEXT_CHECK task (null until one exists).
export interface CrewBmiView {
  readings: CrewBmiReading[];
  targetBmi: string | null;
  nextReviewDate: string | null;
}

// BMI view for the logged-in staff member, resolved from their JWT.
export function getMyBmi(): Promise<CrewBmiView> {
  return apiRequest<CrewBmiView>('/crew/my-bmi');
}

// Downloads a BMI reading attachment — the /crew/bmi/files/:fileName endpoint is
// keyed by opaque fileName only, same as the other crew attachment downloads.
export function downloadBmiFile(attachment: BmiAttachment): Promise<string> {
  const url = `${API_BASE_URL}/crew/bmi/files/${encodeURIComponent(attachment.fileName)}`;
  return downloadFile(url, attachment.originalName || attachment.fileName);
}
