export type PipStatus = 'open' | 'closed';

export interface PipObjective {
  id: string;
  title: string;
  improvementObjectives: string;
  successCriteria: string;
  crewComments: string;
  appraiserComments: string;
}

export interface PipRecord {
  id: string;
  code: string;
  status: PipStatus;
  nextActionDate: string;
  opsCode: string;
  type: string;
  appraisalYear: string;
  underPerformanceDescription: string;
  startDateFirst: string;
  startDateSecond: string;
  aim: string;
  owner: string;
  objectives: PipObjective[];
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export const MOCK_PIPS: PipRecord[] = [
  {
    id: 'pip-1',
    code: 'PIP ABPC 1234',
    status: 'open',
    nextActionDate: '03-06-2026',
    opsCode: 'USLV',
    type: '1234',
    appraisalYear: '2026',
    underPerformanceDescription: `${LOREM}\n\n${LOREM}`,
    startDateFirst: '06-10-2025',
    startDateSecond: '15-12-2026',
    aim: `${LOREM}\n\nUt enim ad minim veniam, quis nostrud exercitation.`,
    owner: 'Michael Robert Smith (CP-2001)',
    objectives: [
      {
        id: 'obj-1',
        title: 'Objective 1',
        improvementObjectives: LOREM,
        successCriteria: LOREM,
        crewComments: LOREM,
        appraiserComments: LOREM,
      },
      {
        id: 'obj-2',
        title: 'Objective 2',
        improvementObjectives: LOREM,
        successCriteria: LOREM,
        crewComments: LOREM,
        appraiserComments: LOREM,
      },
    ],
  },
  {
    id: 'pip-2',
    code: 'PIP DPKL 5678',
    status: 'open',
    nextActionDate: '15-07-2026',
    opsCode: 'DPKL',
    type: '5678',
    appraisalYear: '2026',
    underPerformanceDescription: LOREM,
    startDateFirst: '01-03-2026',
    startDateSecond: '30-09-2026',
    aim: LOREM,
    owner: 'Sarah Johnson (CP-2002)',
    objectives: [
      {
        id: 'obj-1',
        title: 'Objective 1',
        improvementObjectives: LOREM,
        successCriteria: LOREM,
        crewComments: LOREM,
        appraiserComments: LOREM,
      },
    ],
  },
  {
    id: 'pip-3',
    code: 'PIP MNLP 9101',
    status: 'open',
    nextActionDate: '28-10-2026',
    opsCode: 'MNLP',
    type: '9101',
    appraisalYear: '2026',
    underPerformanceDescription: LOREM,
    startDateFirst: '10-05-2026',
    startDateSecond: '10-11-2026',
    aim: LOREM,
    owner: 'David Smith (CP-2003)',
    objectives: [
      {
        id: 'obj-1',
        title: 'Objective 1',
        improvementObjectives: LOREM,
        successCriteria: LOREM,
        crewComments: LOREM,
        appraiserComments: LOREM,
      },
    ],
  },
  {
    id: 'pip-4',
    code: 'PIP 019191121',
    status: 'open',
    nextActionDate: '01-12-2026',
    opsCode: '0191',
    type: '1121',
    appraisalYear: '2026',
    underPerformanceDescription: LOREM,
    startDateFirst: '20-06-2026',
    startDateSecond: '20-12-2026',
    aim: LOREM,
    owner: 'Aisha Khan (CP-2004)',
    objectives: [
      {
        id: 'obj-1',
        title: 'Objective 1',
        improvementObjectives: LOREM,
        successCriteria: LOREM,
        crewComments: LOREM,
        appraiserComments: LOREM,
      },
    ],
  },
  {
    id: 'pip-5',
    code: 'PIP CLSD 3344',
    status: 'closed',
    nextActionDate: '12-01-2026',
    opsCode: 'CLSD',
    type: '3344',
    appraisalYear: '2025',
    underPerformanceDescription: LOREM,
    startDateFirst: '01-01-2025',
    startDateSecond: '31-12-2025',
    aim: LOREM,
    owner: 'Ming Li (CP-2005)',
    objectives: [
      {
        id: 'obj-1',
        title: 'Objective 1',
        improvementObjectives: LOREM,
        successCriteria: LOREM,
        crewComments: LOREM,
        appraiserComments: LOREM,
      },
    ],
  },
];

export function getPipById(id: string): PipRecord | undefined {
  return MOCK_PIPS.find((pip) => pip.id === id);
}
