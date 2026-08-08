import { apiRequest, API_BASE_URL } from '@/services/api/client';
import { downloadFile, type FileAttachment } from '@/services/api/fileTransfer';

export type PipAttachment = FileAttachment;

// Raw shape of a CREW_PIP row (see schema.prisma) — field names/casing exactly
// as stored, mirroring the web app's PipManager.jsx field usage. A specific
// PIP is identified by the composite PIP_id + Staff_id + Appraisal_year.
export interface CrewPip {
  PIP_id: string;
  Staff_id: string;
  OrgId: string;
  Appraisal_year: string;
  Start_Date: string;
  PIP_TYPE: string;
  End_Date: string | null;
  Desc_underperformance: string;
  AIM_PIP: string;
  PIPStatus: string;
  PIP_Closure_Comments: string;
  PIP_ClosedBy: string | null;
  PIP_Owner_StaffId: string;
  PIP_TYPENAME: string;
  TargetDate: string;
  Attachments: PipAttachment[];
  WorkFlowId: string | null;
  // Resolved server-side from MstrUser's username (PIP owners are managers,
  // not crew) — only present via getMyPips(), the manager-facing
  // /crew/:staffId/pips endpoint doesn't include it.
  OwnerName: string | null;
}

export interface CrewPipObjective {
  PIP_id: string;
  StaffId: string;
  OrgId: string;
  ObjectiveID: string;
  Obj_Improvement_Obj: string;
  Success_Criteria: string;
  SupportRequired: string;
  Crew_Statement: string;
  Appraiser_Statement: string;
}

// The PIP record itself is manager-authored (dates, status, closure) — crew
// self-service is read-only for it. This mirrors the web app's own read-only
// posture until an Edit is explicitly clicked by a manager, and the current
// mobile screen never offered PIP-level editing even in its mock form.
// All PIPs the logged-in staff member is the subject of, resolved
// server-side from their own JWT.
export function getMyPips(): Promise<CrewPip[]> {
  return apiRequest<CrewPip[]>('/crew/my-pips');
}

export function getMyPipObjectives(pipId: string): Promise<CrewPipObjective[]> {
  return apiRequest<CrewPipObjective[]>(`/crew/my-pips/${encodeURIComponent(pipId)}/objectives`);
}

// Narrow update — only ever touches Crew_Statement, never Appraiser_Statement
// or any other objective field. Same StaffId authorization as getMyPips.
export function updateMyPipObjective(pipId: string, objectiveId: string, crewStatement: string): Promise<CrewPipObjective> {
  return apiRequest<CrewPipObjective>(
    `/crew/my-pips/objectives/${encodeURIComponent(pipId)}/${encodeURIComponent(objectiveId)}`,
    { method: 'PUT', body: { Crew_Statement: crewStatement } }
  );
}

// Raw MSTR_TASKS row shape for a PIP review (TaskTypeId PIP_REVIEW_SCH,
// REF_ID=pipId) — distinct from performanceApi's PerformanceTask, which is a
// separately-enriched shape for the generic task endpoints. VAR3 is that
// review's own owner StaffId — reviews can be reassigned to a different
// manager over time, so it can differ from the PIP's own PIP_Owner_StaffId
// and from other reviews on the same PIP.
export interface CrewPipReviewTask {
  TaskId: string;
  TaskTypeId: string;
  TaskOwnerUserId: string;
  Task_Status: string | null;
  TargetDate: string | null;
  ActualCompletionDate: string | null;
  VAR3: string | null;
  // Resolved server-side from MSTR_USERS/username for VAR3, same convention
  // as CrewPip.OwnerName.
  OwnerName: string | null;
}

// Review schedule for one specific PIP. Creating/editing a review goes
// through the generic performance task endpoints on the backend (not
// duplicated here), same as on web.
export function getMyPipReviewTasks(pipId: string): Promise<CrewPipReviewTask[]> {
  return apiRequest<CrewPipReviewTask[]>(`/crew/my-pips/${encodeURIComponent(pipId)}/review-tasks`);
}

// Downloads an existing PIP attachment — the generic /crew/pips/files/:fileName
// endpoint is keyed by opaque fileName only (no staffId association), so it's
// safe to reuse unmodified, same reasoning as task/appraisal attachments.
export function downloadPipFile(attachment: PipAttachment): Promise<string> {
  const url = `${API_BASE_URL}/crew/pips/files/${encodeURIComponent(attachment.fileName)}`;
  return downloadFile(url, attachment.originalName || attachment.fileName);
}
