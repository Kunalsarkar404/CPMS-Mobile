import { deliverNotification } from './delivery';
import { subtractDays } from './dates';

export async function notifyNewTaskAssigned(input: {
  taskId: string;
  title: string;
}): Promise<string | null> {
  return deliverNotification({
    title: 'New task assigned',
    body: `${input.title} has been assigned to you.`,
    channelId: 'cpms-assignments',
    payload: {
      type: 'new_task_assigned',
      route: '/(tabs)/task-detail',
      params: { id: input.taskId },
      dedupeKey: `new_task:${input.taskId}`,
    },
  });
}

export async function notifyTaskDueApproaching(input: {
  taskId: string;
  title: string;
  dueDate: Date;
}): Promise<string | null> {
  const fireAt = subtractDays(input.dueDate, 1);
  return deliverNotification(
    {
      title: 'Task approaching due date',
      body: `${input.title} is due soon.`,
      channelId: 'cpms-reminders',
      payload: {
        type: 'task_due_approaching',
        route: '/(tabs)/task-detail',
        params: { id: input.taskId },
        dedupeKey: `task_due_approaching:${input.taskId}:${input.dueDate.toISOString()}`,
      },
    },
    fireAt
  );
}

export async function notifyTaskOverdue(input: {
  taskId: string;
  title: string;
  dueDate: Date;
}): Promise<string | null> {
  return deliverNotification({
    title: 'Task overdue',
    body: `${input.title} is past its due date.`,
    channelId: 'cpms-reminders',
    payload: {
      type: 'task_overdue',
      route: '/(tabs)/task-detail',
      params: { id: input.taskId },
      dedupeKey: `task_overdue:${input.taskId}:${input.dueDate.toISOString()}`,
    },
  });
}

export async function notifyPending360Feedback(input: {
  feedbackId: string;
  code: string;
  dated: string;
}): Promise<string | null> {
  return deliverNotification({
    title: 'Pending 360 feedback reminder',
    body: `Feedback for ${input.code} (dated ${input.dated}) is still pending.`,
    channelId: 'cpms-reminders',
    payload: {
      type: 'pending_360_feedback',
      route: '/(tabs)/feedback-360-provide',
      params: { id: input.feedbackId },
      dedupeKey: `pending_360:${input.feedbackId}`,
    },
  });
}

export async function notifyAppraisalRatingReleased(input: {
  year: string;
}): Promise<string | null> {
  return deliverNotification({
    title: 'Appraisal rating released',
    body: `Your ${input.year} appraisal rating is now available.`,
    channelId: 'cpms-reviews',
    payload: {
      type: 'appraisal_rating_released',
      route: '/(tabs)/my-appraisal',
      params: { year: input.year },
      dedupeKey: `appraisal_rating:${input.year}`,
    },
  });
}

export async function notifyPipStatusChanged(input: {
  pipId: string;
  code: string;
  status: string;
  nextActionDate?: string;
}): Promise<string | null> {
  const nextAction = input.nextActionDate
    ? ` Next action: ${input.nextActionDate}.`
    : '';
  return deliverNotification({
    title: 'PIP status updated',
    body: `${input.code} is now ${input.status}.${nextAction}`,
    channelId: 'cpms-outcomes',
    payload: {
      type: 'pip_status_changed',
      route: '/(tabs)/pip-detail',
      params: { id: input.pipId },
      dedupeKey: `pip_status:${input.pipId}:${input.status}:${input.nextActionDate ?? ''}`,
    },
  });
}

export async function notifyPipNextAction(input: {
  pipId: string;
  code: string;
  nextActionDate: Date;
}): Promise<string | null> {
  const fireAt = subtractDays(input.nextActionDate, 1);
  return deliverNotification(
    {
      title: 'PIP next action approaching',
      body: `${input.code} has a next action date soon.`,
      channelId: 'cpms-reminders',
      payload: {
        type: 'pip_next_action',
        route: '/(tabs)/pip-detail',
        params: { id: input.pipId },
        dedupeKey: `pip_next_action:${input.pipId}:${input.nextActionDate.toISOString()}`,
      },
    },
    fireAt.getTime() <= Date.now() ? null : fireAt
  );
}

export async function notifyDisciplinaryOutcome(input: {
  disciplinaryId: string;
  code: string;
  outcome: string;
}): Promise<string | null> {
  return deliverNotification({
    title: 'Disciplinary outcome issued',
    body: `${input.code}: ${input.outcome}`,
    channelId: 'cpms-outcomes',
    payload: {
      type: 'disciplinary_outcome',
      route: '/(tabs)/disciplinary',
      params: { id: input.disciplinaryId },
      dedupeKey: `disciplinary_outcome:${input.disciplinaryId}:${input.outcome}`,
    },
  });
}

export async function notifyNewRewardGranted(input: {
  rewardId: string;
  type: string;
}): Promise<string | null> {
  return deliverNotification({
    title: 'New reward granted',
    body: `You received a new reward: ${input.type}.`,
    channelId: 'cpms-assignments',
    payload: {
      type: 'new_reward_granted',
      route: '/(tabs)/rewards',
      params: { id: input.rewardId },
      dedupeKey: `new_reward:${input.rewardId}`,
    },
  });
}

export async function notifyBmiReviewApproaching(input: {
  nextReviewDate: Date;
}): Promise<string | null> {
  const fireAt = subtractDays(input.nextReviewDate, 7);
  return deliverNotification(
    {
      title: 'BMI review approaching',
      body: 'Your next BMI review is coming up soon.',
      channelId: 'cpms-reminders',
      payload: {
        type: 'bmi_review_approaching',
        route: '/(tabs)/my-bmi',
        dedupeKey: `bmi_review:${input.nextReviewDate.toISOString()}`,
      },
    },
    fireAt.getTime() <= Date.now() ? null : fireAt
  );
}
