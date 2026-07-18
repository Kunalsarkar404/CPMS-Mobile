import { BMI_NEXT_REVIEW_DATE } from '@/constants/bmi';
import { MOCK_GIVE_FEEDBACK } from '@/constants/feedback360';
import { MOCK_PIPS } from '@/constants/pip';
import { MOCK_TASKS } from '@/constants/tasks';

import { isPastOrToday, parseCpmsDate } from './dates';
import {
  notifyBmiReviewApproaching,
  notifyPending360Feedback,
  notifyPipNextAction,
  notifyTaskDueApproaching,
  notifyTaskOverdue,
} from './events';

/**
 * Syncs date-driven local reminders from current app data.
 * Event-driven notifiers (appraisal, disciplinary, rewards, new task)
 * are not auto-fired here to avoid fake repeated events at startup.
 */
export async function syncLocalReminders(): Promise<void> {
  await syncTaskDueReminders();
  await syncPending360Reminders();
  await syncPipNextActionReminders();
  await syncBmiReviewReminder();
}

async function syncTaskDueReminders(): Promise<void> {
  const activeTasks = MOCK_TASKS.filter(
    (task) => task.status === 'open' || task.status === 'pending'
  );

  for (const task of activeTasks) {
    const dueDate = parseCpmsDate(task.actionDue);
    if (!dueDate) continue;

    if (isPastOrToday(dueDate) || task.section === 'delayed') {
      await notifyTaskOverdue({
        taskId: task.id,
        title: task.title,
        dueDate,
      });
      continue;
    }

    await notifyTaskDueApproaching({
      taskId: task.id,
      title: task.title,
      dueDate,
    });
  }
}

async function syncPending360Reminders(): Promise<void> {
  const pending = MOCK_GIVE_FEEDBACK.filter((item) => item.status === 'pending');

  for (const item of pending) {
    await notifyPending360Feedback({
      feedbackId: item.id,
      code: item.code,
      dated: item.dated,
    });
  }
}

async function syncPipNextActionReminders(): Promise<void> {
  const openPips = MOCK_PIPS.filter((pip) => pip.status === 'open');

  for (const pip of openPips) {
    const nextActionDate = parseCpmsDate(pip.nextActionDate);
    if (!nextActionDate) continue;

    await notifyPipNextAction({
      pipId: pip.id,
      code: pip.code,
      nextActionDate,
    });
  }
}

async function syncBmiReviewReminder(): Promise<void> {
  const nextReviewDate = parseCpmsDate(BMI_NEXT_REVIEW_DATE);
  if (!nextReviewDate) return;

  await notifyBmiReviewApproaching({ nextReviewDate });
}
