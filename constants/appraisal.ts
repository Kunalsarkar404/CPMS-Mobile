export type AppraisalTab = 'objectives' | 'mid_year' | 'annual_year';

export interface AppraisalObjective {
  id: string;
  category: string;
  title: string;
  description: string;
  crewComments: string;
  appraiserComments: string;
}

export const APPRAISAL_TABS: { id: AppraisalTab; label: string }[] = [
  { id: 'objectives', label: 'Objectives' },
  { id: 'mid_year', label: 'Mid Year\nReview' },
  { id: 'annual_year', label: 'Annual Year\nReview' },
];

export const MOCK_OBJECTIVES: AppraisalObjective[] = [
  {
    id: 'obj-1',
    category: 'CUSTOMER SERVICE',
    title: 'Objectives 1234',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    crewComments:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
    appraiserComments:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    id: 'obj-2',
    category: 'ON TIME PERFORMANCE',
    title: 'Objectives 1234',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    crewComments:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    appraiserComments:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    id: 'obj-3',
    category: 'SAFETY COMPLIANCE',
    title: 'Objectives 1234',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    crewComments: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    appraiserComments:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 'obj-4',
    category: 'TEAMWORK',
    title: 'Objectives 1234',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    crewComments: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    appraiserComments:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
];

export const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
