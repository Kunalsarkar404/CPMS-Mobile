import * as bmiApi from '@/services/crew/bmiApi';
import * as pipApi from '@/services/crew/pipApi';
import { getMyTasks } from '@/services/performance/performanceApi';
import { mapTaskToDisplay } from '@/services/performance/taskMapping';

import { isPastOrToday } from './dates';
import {
  notifyBmiReviewApproaching,
  notifyPipNextAction,
  notifyTaskDueApproaching,
  notifyTaskOverdue,
} from './events';

/**
 * Syncs date-driven local reminders from the crew member's real data (tasks,
 * PIPs, BMI) fetched from the backend. Runs once at startup after auth.
 *
 * Event-driven notifiers (appraisal, disciplinary, rewards, new task) are not
 * auto-fired here to avoid fake repeated events at startup. The old "pending
 * 360 feedback" reminder was dropped: Give-feedback has no backend, so there's
 * no real source for it.
 *
 * Each source is fetched independently and wrapped so a failure (offline, an
 * expired session, a 500) only skips that one reminder set rather than aborting
 * notification initialization.
 */
export async function syncLocalReminders(): Promise<void> {
  await Promise.all([
    syncTaskDueReminders(),
    syncPipNextActionReminders(),
    syncBmiReviewReminder(),
  ]);
}

function toValidDate(isoDate: string | null | undefined): Date | null {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  return Number.isNaN(d.getTime()) ? null : d;
}

async function syncTaskDueReminders(): Promise<void> {
  try {
    const tasks = await getMyTasks();
    for (const task of tasks) {
      const display = mapTaskToDisplay(task);
      // Only remind on active tasks (current / delayed / future), never closed.
      if (display.section === 'closed') continue;

      const dueDate = toValidDate(task.TargetDate ?? task.NextActionDueDate);
      if (!dueDate) continue;

      if (display.section === 'delayed' || isPastOrToday(dueDate)) {
        await notifyTaskOverdue({ taskId: display.id, title: display.title, dueDate });
      } else {
        await notifyTaskDueApproaching({ taskId: display.id, title: display.title, dueDate });
      }
    }
  } catch (err) {
    console.error('[notifications] task reminders sync failed', err);
  }
}

async function syncPipNextActionReminders(): Promise<void> {
  try {
    const pips = await pipApi.getMyPips();
    for (const pip of pips) {
      if ((pip.PIPStatus || '').toLowerCase() === 'closed') continue;

      const nextActionDate = toValidDate(pip.TargetDate);
      if (!nextActionDate) continue;

      await notifyPipNextAction({
        pipId: pip.PIP_id,
        code: pip.PIP_TYPENAME || pip.PIP_id,
        nextActionDate,
      });
    }
  } catch (err) {
    console.error('[notifications] PIP reminders sync failed', err);
  }
}

async function syncBmiReviewReminder(): Promise<void> {
  try {
    const bmi = await bmiApi.getMyBmi();
    const nextReviewDate = toValidDate(bmi.nextReviewDate);
    if (!nextReviewDate) return;

    await notifyBmiReviewApproaching({ nextReviewDate });
  } catch (err) {
    console.error('[notifications] BMI reminder sync failed', err);
  }
}
