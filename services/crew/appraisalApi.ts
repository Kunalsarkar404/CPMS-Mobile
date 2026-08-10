import { apiRequest, API_BASE_URL } from '@/services/api/client';
import { uploadFile, downloadFile, type FileAttachment } from '@/services/api/fileTransfer';

export type AppraisalAttachment = FileAttachment;

// Raw shape of a CREW_APPRAISALS row (see schema.prisma) — field names/casing
// (e.g. MID_APRAISERCOMMENTS, no double-P) are exactly as stored, mirroring
// the web app's CrewAppraisal.jsx field usage.
export interface CrewAppraisal {
  APPRAISALID: string;
  StaffId: string | null;
  OrgId: string | null;
  AppraisalYear: string | null;
  GradeId: string | null;
  MID_CrewComments: string | null;
  Mid_CrewAttachments: AppraisalAttachment[];
  MID_APRAISERCOMMENTS: string | null;
  MID_RATING: string | null;
  MID_RATINGBY: string | null;
  IsMID_RATING_FREEZE: boolean | null;
  Year_End_Crew_Attachments: AppraisalAttachment[];
  Year_END_PM_Attachment: AppraisalAttachment[];
  YEAR_END_CrewComments: string | null;
  Year_END_PM_COMMENTS: string | null;
  Year_End_Rating: string | null;
  Year_End_RatingBy: string | null;
  IsYearEndRatingFreeze: boolean | null;
  IsObjectivesEditable: boolean | null;
  MID_APRAISER_ATTACHMENTS: AppraisalAttachment[];
  APPRAISER_STAFF: string | null;
  AppraiserName?: string | null;
}

export interface AppraisalObjective {
  AppraisalId: string;
  StaffId: string | null;
  Org_Id: string | null;
  Sequence: number | null;
  AppraisalYear: string | null;
  AREA_OF_FOCUS: string | null;
  OBJ_DESC: string | null;
  OBJ_CREW_COMMENTS: string | null;
  OBJ_PM_COMMENTS: string | null;
}

export type AppraisalSectionMode = 'HIDE' | 'VIEW' | 'EDIT';

export interface AppraisalCycleFlags {
  OBJECTIVE_FLAG: AppraisalSectionMode;
  MID_YEAR_COMMENTS_FLAG: AppraisalSectionMode;
  MID_YEAR_RATING_FLAG: AppraisalSectionMode;
  YEAR_END_COMMENTS_FLAG: AppraisalSectionMode;
  YEAR_END_RATING_FLAG: AppraisalSectionMode;
}

// Resolved server-side from the caller's own JWT — this is what "My
// Appraisal" means for crew self-service, distinct from the manager-facing
// CrewAppraisal.jsx page which takes an arbitrary StaffId from the URL.
export function getMyAppraisal(appraisalYear: string): Promise<CrewAppraisal | null> {
  return apiRequest<CrewAppraisal | null>(`/crew/my-appraisal/${encodeURIComponent(appraisalYear)}`);
}

// Narrow update — only ever touches the crew-owned comment/attachment
// fields, never the PM's comments, ratings, freeze flags, or appraiser
// assignment (enforced server-side regardless of what's sent here).
export function updateMyAppraisal(
  appraisalYear: string,
  data: Partial<
    Pick<CrewAppraisal, 'MID_CrewComments' | 'Mid_CrewAttachments' | 'YEAR_END_CrewComments' | 'Year_End_Crew_Attachments'>
  >
): Promise<CrewAppraisal> {
  return apiRequest<CrewAppraisal>(`/crew/my-appraisal/${encodeURIComponent(appraisalYear)}`, {
    method: 'PUT',
    body: data,
  });
}

export function getMyAppraisalObjectives(): Promise<AppraisalObjective[]> {
  return apiRequest<AppraisalObjective[]>('/crew/my-appraisal-objectives');
}

// Narrow update — only OBJ_CREW_COMMENTS, never OBJ_PM_COMMENTS.
export function updateMyAppraisalObjective(appraisalId: string, objCrewComments: string): Promise<AppraisalObjective> {
  return apiRequest<AppraisalObjective>(`/crew/my-appraisal-objectives/${encodeURIComponent(appraisalId)}`, {
    method: 'PUT',
    body: { OBJ_CREW_COMMENTS: objCrewComments },
  });
}

// Per-section HIDE/VIEW/EDIT flags for a given appraisal year — org-wide
// config, not staff-specific, so the existing (unmodified) endpoint is safe
// to call directly from crew self-service.
export function getAppraisalCycle(appraisalYear: string): Promise<AppraisalCycleFlags> {
  return apiRequest<AppraisalCycleFlags>(`/crew/appraisal-cycle/${encodeURIComponent(appraisalYear)}`);
}

export function uploadAppraisalFile(localUri: string, mimeType?: string, originalName?: string): Promise<AppraisalAttachment> {
  return uploadFile(`${API_BASE_URL}/crew/appraisal/upload`, localUri, mimeType, originalName);
}

export function downloadAppraisalFile(attachment: AppraisalAttachment): Promise<string> {
  const url = `${API_BASE_URL}/crew/appraisal/files/${encodeURIComponent(attachment.fileName)}`;
  return downloadFile(url, attachment.originalName || attachment.fileName);
}
