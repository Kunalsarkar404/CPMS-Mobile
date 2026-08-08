import { Platform } from 'react-native';
import { File, Paths, UploadType } from 'expo-file-system';
import { StorageAccessFramework, readAsStringAsync, EncodingType } from 'expo-file-system/legacy';

import { getAccessToken, refreshAccessToken, ApiError, AuthSessionExpiredError } from '@/services/api/client';
import { storage } from '@/utils/storage';

// Shared upload/download machinery for any "generic file storage" backend
// endpoint (task attachments, appraisal attachments, ...) — every one of
// these follows the same shape: POST multipart -> {fileName, originalName},
// GET /files/:fileName -> raw bytes, no per-resource association at transfer
// time (that's handled separately by whichever record the caller attaches
// {fileName, originalName} to).

export interface FileAttachment {
  fileName: string;
  originalName: string;
}

const DOWNLOAD_DIR_KEY = '@cpms/download_dir_uri';

async function authHeader(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadFile(uploadUrl: string, localUri: string, mimeType?: string): Promise<FileAttachment> {
  const file = new File(localUri);

  const attempt = () =>
    authHeader().then((headers) =>
      file.upload(uploadUrl, {
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
export async function downloadFile(downloadUrl: string, displayName: string): Promise<string> {
  const destination = new File(Paths.document, displayName);

  const doDownload = async (): Promise<File> => {
    const headers = await authHeader();
    const task = File.createDownloadTask(downloadUrl, destination, { headers });
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
