export type DisciplinaryStatus = 'open' | 'closed';
export type DisciplinaryFilter = 'all' | DisciplinaryStatus;

export interface DisciplinaryAction {
  id: string;
  code: string;
  title: string;
  description: string;
  ownerName: string;
  openDate: string;
  outcome: string;
  status: DisciplinaryStatus;
  year: string;
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const MOCK_DISCIPLINARY: DisciplinaryAction[] = [
  {
    id: 'disc-1',
    code: 'USLV',
    title: 'Title of Disciplinary Action',
    description: LOREM,
    ownerName: 'Mark John',
    openDate: '09-04-2026',
    outcome: 'To be decided',
    status: 'open',
    year: '2026',
  },
  {
    id: 'disc-2',
    code: 'USLV',
    title: 'Title of Disciplinary Action',
    description: LOREM,
    ownerName: 'Mark John',
    openDate: '09-04-2026',
    outcome: 'Warning Letter Issued',
    status: 'closed',
    year: '2026',
  },
  {
    id: 'disc-3',
    code: 'ABPC',
    title: 'Attendance Related Action',
    description: LOREM,
    ownerName: 'Sarah Johnson',
    openDate: '15-02-2026',
    outcome: 'To be decided',
    status: 'open',
    year: '2026',
  },
  {
    id: 'disc-4',
    code: 'DPKL',
    title: 'Policy Compliance Review',
    description: LOREM,
    ownerName: 'Michael Smith',
    openDate: '22-11-2025',
    outcome: 'Counseling Completed',
    status: 'closed',
    year: '2025',
  },
];
