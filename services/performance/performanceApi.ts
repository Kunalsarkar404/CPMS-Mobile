import { Platform } from 'react-native';
import { File, Paths, UploadType } from 'expo-file-system';
import { StorageAccessFramework, readAsStringAsync, EncodingType } from 'expo-file-system/legacy';

import {
  apiRequest,
  API_BASE_URL,
  getAccessToken,
  refreshAccessToken,
  ApiError,
  AuthSessionExpiredError,
} from '@/services/api/client';
import { storage } from '@/utils/storage';

const DOWNLOAD_DIR_KEY = '@cpms/download_dir_uri';

export interface TaskAttachment {
  fileName: string;
  originalName: string;
}

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

async function authHeader(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Uploads a locally-picked file to generic task storage and hands back an
// identifier — mirrors the web app's pattern of uploading on selection, then
// including the returned {fileName, originalName} in a later save call.
export async function uploadTaskFile(localUri: string, mimeType?: string): Promise<TaskAttachment> {
  const file = new File(localUri);
  const url = `${API_BASE_URL}/performance/tasks/upload`;

  const attempt = () =>
    authHeader().then((headers) =>
      file.upload(url, {
        httpMethod: 'POST',
        uploadType: UploadType.MULTIPART,
        fieldName: 'file',
        mimeType,
        headers,
      })
    );

  let result = await attempt();
  if (result.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) throw new AuthSessionExpiredError();
    result = await attempt();
  }

  const json = result.body ? JSON.parse(result.body) : null;
  if (result.status >= 400 || !json || json.success === false) {
    throw new ApiError(
      json?.error?.code ?? 'UPLOAD_FAILED',
      json?.error?.message ?? 'Upload failed',
      result.status
    );
  }

  return { fileName: json.data.fileName, originalName: json.data.originalName };
}

const EXTENSION_MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  txt: 'text/plain',
};

function guessMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_MIME_TYPES[ext] ?? 'application/octet-stream';
}

// The "Downloads" shortcut in the system folder picker's sidebar hands back
// a content://com.android.providers.downloads.documents URI, which looks
// selectable but rejects file creation at the OS level. Steer the picker
// straight at the real, writable "Internal Storage > Download" folder instead,
// and reject that broken provider outright if the user picks it anyway.
async function getOrRequestDownloadDir(forceReprompt: boolean): Promise<string> {
  if (!forceReprompt) {
    const cached = await storage.get<string>(DOWNLOAD_DIR_KEY);
    if (cached) return cached;
  }

  const initialUri = StorageAccessFramework.getUriForDirectoryInRoot('Download');
  const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync(initialUri);
  if (!permissions.granted) {
    throw new ApiError('DOWNLOAD_PERMISSION_DENIED', 'Choose a folder to allow downloads', 0);
  }
  if (permissions.directoryUri.includes('com.android.providers.downloads.documents')) {
    throw new ApiError(
      'DOWNLOAD_PERMISSION_DENIED',
      'That "Downloads" shortcut can\'t be written to — please pick "Internal Storage" then "Download" instead',
      0
    );
  }
  await storage.set(DOWNLOAD_DIR_KEY, permissions.directoryUri);
  return permissions.directoryUri;
}

// Android has no equivalent of iOS's "make the app's document dir visible in
// Files" — writing somewhere the user can actually find requires the Storage
// Access Framework, which means asking the user to pick a folder once (the
// choice is then remembered) and writing into it via a content:// URI.
async function saveToAndroidPublicStorage(localUri: string, displayName: string): Promise<void> {
  const base64 = await readAsStringAsync(localUri, { encoding: EncodingType.Base64 });
  const nameWithoutExtension = displayName.replace(/\.[^./]+$/, '');
  const mimeType = guessMimeType(displayName);

  const createFile = async (forceReprompt: boolean): Promise<string> => {
    const dirUri = await getOrRequestDownloadDir(forceReprompt);
    return StorageAccessFramework.createFileAsync(dirUri, nameWithoutExtension, mimeType);
  };

  let targetUri: string;
  try {
    targetUri = await createFile(false);
  } catch (err) {
    // The cached folder is most likely stale (permission revoked outside the
    // app, folder deleted/moved) — forget it and ask the user to pick again
    // right away instead of just failing and making them tap a second time.
    await storage.remove(DOWNLOAD_DIR_KEY);
    try {
      targetUri = await createFile(true);
    } catch (retryErr) {
      const message = retryErr instanceof Error ? retryErr.message : String(retryErr);
      throw new ApiError('DOWNLOAD_PERMISSION_DENIED', `Could not save to download folder: ${message}`, 0);
    }
  }

  await StorageAccessFramework.writeAsStringAsync(targetUri, base64, { encoding: EncodingType.Base64 });
}

// Downloads an already-attached file to the device. On iOS this lands in the
// app's document storage, which (with UIFileSharingEnabled set) shows up in
// the Files app under "On My iPhone/iPad". On Android it's additionally
// copied into a user-chosen public folder via the Storage Access Framework,
// since the app's private storage is never visible outside the app there.
export async function downloadTaskFile(attachment: TaskAttachment): Promise<string> {
  const url = `${API_BASE_URL}/performance/tasks/files/${encodeURIComponent(attachment.fileName)}`;
  const displayName = attachment.originalName || attachment.fileName;
  const destination = new File(Paths.document, displayName);

  const doDownload = async (): Promise<File> => {
    const headers = await authHeader();
    const task = File.createDownloadTask(url, destination, { headers });
    const result = await task.downloadAsync();
    if (!result) throw new ApiError('DOWNLOAD_FAILED', 'Download did not complete', 0);
    return result;
  };

  let downloaded: File;
  try {
    downloaded = await doDownload();
  } catch {
    // Download failures don't cleanly surface a status code — a single
    // proactive refresh+retry covers the common expired-token case; if the
    // refresh itself fails (no valid session), that's a real error either way.
    const newToken = await refreshAccessToken();
    if (!newToken) throw new AuthSessionExpiredError();
    downloaded = await doDownload();
  }

  if (Platform.OS === 'android') {
    await saveToAndroidPublicStorage(downloaded.uri, displayName);
  }

  return downloaded.uri;
}
