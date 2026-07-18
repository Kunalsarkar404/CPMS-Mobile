export type TaskStatus = 'open' | 'pending' | 'closed';
export type TaskSection = 'current' | 'delayed' | 'closed' | 'future';

export interface Task {
  id: string;
  title: string;
  workflowType: string;
  actionDue: string;
  status: TaskStatus;
  section: TaskSection;
  sectionDate: string;
  showAcknowledge?: boolean;
}

export const TASK_SECTIONS: {
  key: TaskSection;
  title: string;
}[] = [
  { key: 'current', title: 'Current Tasks' },
  { key: 'delayed', title: 'Delayed Tasks' },
  { key: 'closed', title: 'Closed Tasks' },
  { key: 'future', title: 'Future Tasks' },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Submit Crew Statement',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'open',
    section: 'current',
    sectionDate: '16 May 2026',
  },
  {
    id: 'task-2',
    title: 'Meeting Notification (Acknowledgement Required)',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'open',
    section: 'current',
    sectionDate: '16 May 2026',
    showAcknowledge: true,
  },
  {
    id: 'task-3',
    title: 'Submit Crew Statement',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'pending',
    section: 'delayed',
    sectionDate: '20 May 2026',
  },
  {
    id: 'task-6',
    title: 'Meeting Notification (Acknowledgement Required)',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'pending',
    section: 'delayed',
    sectionDate: '20 May 2026',
    showAcknowledge: true,
  },
  {
    id: 'task-7',
    title: 'Submit Crew Statement',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'open',
    section: 'current',
    sectionDate: '16 May 2026',
  },
  {
    id: 'task-8',
    title: 'Meeting Notification (Acknowledgement Required)',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'open',
    section: 'current',
    sectionDate: '16 May 2026',
    showAcknowledge: true,
  },
  {
    id: 'task-9',
    title: 'Submit Crew Statement',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'open',
    section: 'current',
    sectionDate: '16 May 2026',
  },
  {
    id: 'task-4',
    title: 'Submit Crew Statement',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'closed',
    section: 'closed',
    sectionDate: '08 May 2026',
  },
  {
    id: 'task-5',
    title: 'Submit Crew Statement',
    workflowType:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    actionDue: '03 June 2026',
    status: 'pending',
    section: 'future',
    sectionDate: '22 Aug 2026',
  },
];

export function getTaskById(id: string): Task | undefined {
  return MOCK_TASKS.find((task) => task.id === id);
}
