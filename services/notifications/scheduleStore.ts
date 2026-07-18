import { storage } from '@/utils/storage';

import type { ScheduledNotificationRecord } from './types';

const STORAGE_KEY = '@cpms/notification_schedule';

export async function getScheduledRecords(): Promise<
  Record<string, ScheduledNotificationRecord>
> {
  const records = await storage.get<Record<string, ScheduledNotificationRecord>>(
    STORAGE_KEY
  );
  return records ?? {};
}

export async function saveScheduledRecords(
  records: Record<string, ScheduledNotificationRecord>
): Promise<void> {
  await storage.set(STORAGE_KEY, records);
}

export async function upsertScheduledRecord(
  record: ScheduledNotificationRecord
): Promise<void> {
  const records = await getScheduledRecords();
  records[record.dedupeKey] = record;
  await saveScheduledRecords(records);
}

export async function removeScheduledRecord(dedupeKey: string): Promise<void> {
  const records = await getScheduledRecords();
  if (!records[dedupeKey]) return;
  delete records[dedupeKey];
  await saveScheduledRecords(records);
}

export async function clearScheduledRecords(): Promise<void> {
  await storage.remove(STORAGE_KEY);
}
