export type AppraisalTab = 'objectives' | 'mid_year' | 'annual_year';

export const APPRAISAL_TABS: { id: AppraisalTab; label: string }[] = [
  { id: 'objectives', label: 'Objectives' },
  { id: 'mid_year', label: 'Mid Year\nReview' },
  { id: 'annual_year', label: 'Annual Year\nReview' },
];
