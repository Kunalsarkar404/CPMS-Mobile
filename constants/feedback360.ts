// The "View My 360 Rating" mode is now driven by the real API
// (services/crew/threeSixtyApi.ts). Only the Give-feedback mock below and the
// TrendChart fallback (TREND_MONTHS / TREND_SERIES) remain here.

export const TREND_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
];

export const TREND_SERIES = [
  {
    id: 'attitude',
    label: 'Attitude & Leadership',
    color: '#3B82F6',
    data: [2.2, 2.5, 2.8, 3.0, 2.7, 2.9, 3.1, 2.8, 3.0, 2.9, 3.2],
  },
  {
    id: 'customer',
    label: 'Customer Focus',
    color: '#22C55E',
    data: [2.0, 2.3, 2.6, 2.8, 3.0, 2.7, 2.9, 3.1, 2.8, 3.0, 3.1],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    color: '#A16207',
    data: [1.8, 2.0, 2.4, 2.6, 2.5, 2.8, 2.7, 2.9, 3.0, 2.8, 3.0],
  },
  {
    id: 'punctuality',
    label: 'Punctuality',
    color: '#A855F7',
    data: [2.4, 2.6, 2.9, 3.1, 3.0, 3.2, 3.3, 3.1, 3.4, 3.2, 3.5],
  },
];

export type GiveFeedbackStatus = 'pending' | 'submitted';

export interface GiveFeedbackCrewMember {
  id: string;
  name: string;
  grade: string;
  ratings: number[];
  comments: string;
}

export interface GiveFeedbackItem {
  id: string;
  code: string;
  status: GiveFeedbackStatus;
  dated: string;
  submittedOn?: string;
  destination: string;
  crew: GiveFeedbackCrewMember[];
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const MOCK_GIVE_FEEDBACK: GiveFeedbackItem[] = [
  {
    id: 'give-1',
    code: 'OV1783',
    status: 'pending',
    dated: '04-04-2026',
    destination: 'BOM - BLR',
    crew: [
      {
        id: 'c1',
        name: 'Martin Smith',
        grade: 'CA',
        ratings: [4, 2, 4, 2],
        comments: LOREM,
      },
      {
        id: 'c2',
        name: 'Jacob Lewis',
        grade: 'CS',
        ratings: [3, 3, 4, 3],
        comments: 'N/A',
      },
      {
        id: 'c3',
        name: 'Tom Cook',
        grade: 'CA',
        ratings: [4, 4, 3, 4],
        comments: LOREM,
      },
      {
        id: 'c4',
        name: 'Rodriguez',
        grade: 'CS',
        ratings: [3, 2, 4, 3],
        comments: LOREM,
      },
      {
        id: 'c5',
        name: 'Mathew Fisher',
        grade: 'CA',
        ratings: [5, 4, 4, 3],
        comments: LOREM,
      },
    ],
  },
  {
    id: 'give-2',
    code: 'OV2291',
    status: 'pending',
    dated: '12-05-2026',
    destination: 'MCT - DXB',
    crew: [
      {
        id: 'c1',
        name: 'Martin Smith',
        grade: 'CS',
        ratings: [4, 2, 5, 3],
        comments: LOREM,
      },
    ],
  },
  {
    id: 'give-3',
    code: 'OV3340',
    status: 'pending',
    dated: '20-05-2026',
    destination: 'DXB - BOM',
    crew: [
      {
        id: 'c1',
        name: 'Aisha Khan',
        grade: 'CA',
        ratings: [4, 4, 4, 4],
        comments: LOREM,
      },
    ],
  },
  {
    id: 'give-4',
    code: 'OV4567',
    status: 'submitted',
    dated: '04-04-2026',
    submittedOn: '04-04-2026',
    destination: 'BOM - DEL',
    crew: [
      {
        id: 'c1',
        name: 'David Smith',
        grade: 'CS',
        ratings: [4, 3, 4, 3],
        comments: LOREM,
      },
    ],
  },
  {
    id: 'give-5',
    code: 'OV9029',
    status: 'submitted',
    dated: '05-03-2026',
    submittedOn: '05-03-2026',
    destination: 'MCT - BOM',
    crew: [
      {
        id: 'c1',
        name: 'Ming Li',
        grade: 'CA',
        ratings: [5, 4, 4, 5],
        comments: LOREM,
      },
    ],
  },
  {
    id: 'give-6',
    code: 'OV1092',
    status: 'submitted',
    dated: '19-02-2026',
    submittedOn: '19-02-2026',
    destination: 'DEL - MCT',
    crew: [
      {
        id: 'c1',
        name: 'Fatima Ali',
        grade: 'CS',
        ratings: [3, 3, 4, 3],
        comments: LOREM,
      },
    ],
  },
  {
    id: 'give-7',
    code: 'OV7781',
    status: 'submitted',
    dated: '20-01-2026',
    submittedOn: '20-01-2026',
    destination: 'BOM - MCT',
    crew: [
      {
        id: 'c1',
        name: 'Liam OConnor',
        grade: 'CA',
        ratings: [4, 4, 3, 4],
        comments: LOREM,
      },
    ],
  },
];

export function getGiveFeedbackById(id: string): GiveFeedbackItem | undefined {
  return MOCK_GIVE_FEEDBACK.find((item) => item.id === id);
}
