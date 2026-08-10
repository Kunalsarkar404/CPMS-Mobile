import { apiRequest, API_BASE_URL } from '@/services/api/client';
import { uploadFile, downloadFile, type FileAttachment } from '@/services/api/fileTransfer';

export type TaskAttachment = FileAttachment;

// Raw shape of a MstrTask row as enriched by the backend (see
// performance.service.ts's enrichTask) — same shape whether it comes from
// GET /performance/tasks (owner-based) or GET /performance/staff-tasks (subject-based).
export interface PerformanceTask {
  TaskId: string;
  TaskTypeId: string;
  TaskTypeName: string | null;
  TaskOwnerUserId: string;
  StaffId: string | null;
  Task_Status: string | null;
  TargetDate: string | null;
  NextActionDueDate: string | null;
  ActualCompletionDate: string | null;
  Created_Date: string | null;
  Title: string | null;
  Description: string | null;
  VAR2: string | null;
  isDelayed: boolean;
  crewName: string | null;
  attachments: TaskAttachment[];
}

// Tasks the logged-in staff member is the SUBJECT of (MstrTask.StaffId),
// resolved server-side from their own JWT — this is what "My Tasks" means
// for crew self-service, distinct from the manager-facing owner-based view.
export function getMyTasks(): Promise<PerformanceTask[]> {
  return apiRequest<PerformanceTask[]>('/performance/staff-tasks');
}

// Single task, authorized server-side against the logged-in staff member's
// own StaffId — returns a 404 (thrown as ApiError) for a task that exists
// but belongs to someone else, same as one that doesn't exist at all.
export function getMyTaskById(
  taskId: string,
  taskTypeId: string,
  taskOwnerUserId: string
): Promise<PerformanceTask> {
  return apiRequest<PerformanceTask>(
    `/performance/staff-tasks/${encodeURIComponent(taskId)}/${encodeURIComponent(taskTypeId)}/${encodeURIComponent(taskOwnerUserId)}`
  );
}

// Narrow update — only ever touches attachments/notes, never status or
// ownership, same StaffId authorization as getMyTaskById.
export function updateMyTaskAttachments(
  taskId: string,
  taskTypeId: string,
  taskOwnerUserId: string,
  data: { attachments?: TaskAttachment[]; notes?: string }
): Promise<PerformanceTask> {
  return apiRequest<PerformanceTask>(
    `/performance/staff-tasks/${encodeURIComponent(taskId)}/${encodeURIComponent(taskTypeId)}/${encodeURIComponent(taskOwnerUserId)}`,
    { method: 'PUT', body: data }
  );
}

// Uploads a locally-picked file to generic task storage and hands back an
// identifier — mirrors the web app's pattern of uploading on selection, then
// including the returned {fileName, originalName} in a later save call.
export function uploadTaskFile(localUri: string, mimeType?: string, originalName?: string): Promise<TaskAttachment> {
  return uploadFile(`${API_BASE_URL}/performance/tasks/upload`, localUri, mimeType, originalName);
}

// Downloads an already-attached file to the device (see services/api/fileTransfer.ts
// for how this lands somewhere the user can actually find on each platform).
export function downloadTaskFile(attachment: TaskAttachment): Promise<string> {
  const url = `${API_BASE_URL}/performance/tasks/files/${encodeURIComponent(attachment.fileName)}`;
  return downloadFile(url, attachment.originalName || attachment.fileName);
}
