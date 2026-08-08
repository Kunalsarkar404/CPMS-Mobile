import { apiRequest, API_BASE_URL } from '@/services/api/client';
import { downloadFile, type FileAttachment } from '@/services/api/fileTransfer';

export type DisciplinaryAttachment = FileAttachment;

// One crew self-service disciplinary row — a flattened view of a CREW_WORKFLOW
// the logged-in crew member is involved in, shaped by the backend
// (/crew/my-disciplinary) to match the "My Disciplinary File" card. The crew
// member is resolved server-side from their own JWT; this list only ever
// contains workflows their StaffId appears against in CREW_WORKFLOW_CREWLIST.
export interface CrewDisciplinary {
  id: string;
  code: string;
  title: string;
  description: string;
  ownerName: string;
  // Raw ISO incident date (or null) — formatted for display on screen, same
  // convention as CrewPip dates in pip.tsx.
  openDate: string | null;
  appraisalYear: number | null;
  outcome: string;
  status: 'open' | 'closed';
  attachments: DisciplinaryAttachment[];
}

// One decision in a workflow's outcome history (ordered oldest-first). Reopen
// inserts a new sequence rather than editing, so multiple rows form the trail.
export interface CrewDisciplinaryOutcome {
  seq: number;
  name: string | null;
  status: string | null;
  finalPoints: string | null;
  decisionNotes: string | null;
  closedBy: string | null;
  closedAt: string | null;
  reopenReason: string | null;
}

// Full detail for a single disciplinary workflow — the list row plus the
// incident/flight fields, the crew involved, and the outcome history.
export interface CrewDisciplinaryDetail extends CrewDisciplinary {
  incidentLocation: string | null;
  incidentReportedBy: string | null;
  points: number | null;
  flightNumber: string | null;
  flightDate: string | null;
  flightRoute: string | null;
  crewInvolved: { staffId: string; name: string | null; grade: string | null }[];
  outcomes: CrewDisciplinaryOutcome[];
}

// All disciplinary workflows the logged-in staff member is a subject of,
// resolved server-side from their JWT.
export function getMyDisciplinary(): Promise<CrewDisciplinary[]> {
  return apiRequest<CrewDisciplinary[]>('/crew/my-disciplinary');
}

// Full detail for one workflow the crew member is involved in (404s otherwise).
export function getMyDisciplinaryDetail(wfId: string): Promise<CrewDisciplinaryDetail> {
  return apiRequest<CrewDisciplinaryDetail>(`/crew/my-disciplinary/${encodeURIComponent(wfId)}`);
}

// Downloads a workflow incident attachment — the /crew/disciplinary/files/:fileName
// endpoint is keyed by opaque fileName only, same as task/PIP attachments, so it's
// safe to reuse unmodified.
export function downloadDisciplinaryFile(attachment: DisciplinaryAttachment): Promise<string> {
  const url = `${API_BASE_URL}/crew/disciplinary/files/${encodeURIComponent(attachment.fileName)}`;
  return downloadFile(url, attachment.originalName || attachment.fileName);
}
