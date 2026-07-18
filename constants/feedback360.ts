export interface RatingLevel {
  label: string;
  count: number | null;
}

export interface FeedbackCategory {
  id: string;
  title: string;
  avg: number;
  levels: RatingLevel[];
  yourAvg?: number;
  yourVotes?: number;
  ovAvg?: number;
  totalVotes?: number;
  totalFlights?: number;
  totalCrew?: number;
}

export interface FlightFeedback {
  id: string;
  date: string;
  dateShort: string;
  flightCode: string;
  avgRating: number;
  totalVotes: number;
  categories: FeedbackCategory[];
}

const DEFAULT_LEVELS: RatingLevel[] = [
  { label: '1 - Not Acceptable', count: 3 },
  { label: '2 - Improvement Required', count: 2 },
  { label: '3 - Meets', count: null },
  { label: '4 - Exceeds', count: 5 },
  { label: '5 - Outstanding', count: 3 },
];

const FLIGHT_CATEGORIES: FeedbackCategory[] = [
  {
    id: 'attitude',
    title: 'Attitude & Leadership',
    avg: 4.1,
    levels: DEFAULT_LEVELS,
  },
  {
    id: 'discipline',
    title: 'Discipline',
    avg: 4.1,
    levels: DEFAULT_LEVELS,
  },
  {
    id: 'kpi3',
    title: 'KPI 3',
    avg: 4.1,
    levels: DEFAULT_LEVELS,
  },
  {
    id: 'compliance',
    title: 'Compliance & Knowledge of Policies & Procedures',
    avg: 4.1,
    levels: DEFAULT_LEVELS,
  },
];

export const MOCK_FLIGHTS: FlightFeedback[] = [
  {
    id: 'flight-1',
    date: '03-06-2026',
    dateShort: '03-Jun-2026',
    flightCode: 'OV1783',
    avgRating: 2.9,
    totalVotes: 20,
    categories: FLIGHT_CATEGORIES,
  },
  {
    id: 'flight-2',
    date: '23-06-2026',
    dateShort: '23-Jun-2026',
    flightCode: 'OV8895',
    avgRating: 3.4,
    totalVotes: 18,
    categories: FLIGHT_CATEGORIES,
  },
  {
    id: 'flight-3',
    date: '15-05-2026',
    dateShort: '15-May-2026',
    flightCode: 'OV2104',
    avgRating: 3.1,
    totalVotes: 22,
    categories: FLIGHT_CATEGORIES,
  },
  {
    id: 'flight-4',
    date: '02-04-2026',
    dateShort: '02-Apr-2026',
    flightCode: 'OV4521',
    avgRating: 2.7,
    totalVotes: 16,
    categories: FLIGHT_CATEGORIES,
  },
];

export const TREND_OVERALL: FeedbackCategory = {
  id: 'overall',
  title: 'Overall Rating',
  avg: 2.9,
  levels: [],
  yourAvg: 2.9,
  yourVotes: 120,
  totalFlights: 6,
  ovAvg: 3.2,
  totalCrew: 103,
  totalVotes: 567,
};

export const TREND_CATEGORIES: FeedbackCategory[] = [
  {
    id: 'attitude',
    title: 'Attitude & Leadership',
    avg: 2.9,
    levels: [],
    yourAvg: 2.9,
    yourVotes: 120,
    totalFlights: 6,
    ovAvg: 3.2,
    totalCrew: 103,
    totalVotes: 567,
  },
  {
    id: 'productivity',
    title: 'Productivity & Punctuality',
    avg: 2.9,
    levels: [],
    yourAvg: 2.9,
    yourVotes: 120,
    totalFlights: 6,
    ovAvg: 3.2,
    totalCrew: 103,
    totalVotes: 567,
  },
  {
    id: 'customer',
    title: 'Customer Focus',
    avg: 2.9,
    levels: [],
    yourAvg: 2.9,
    yourVotes: 120,
    totalFlights: 6,
    ovAvg: 3.2,
    totalCrew: 103,
    totalVotes: 567,
  },
  {
    id: 'compliance',
    title: 'Compliance',
    avg: 2.9,
    levels: [],
    yourAvg: 2.9,
    yourVotes: 120,
    totalFlights: 6,
    ovAvg: 3.2,
    totalCrew: 103,
    totalVotes: 567,
  },
];

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
