export interface BmiReading {
  id: string;
  date: string;
  bmi: string;
  statusColor: string;
  statusLabel: string;
}

export const BMI_READINGS: BmiReading[] = [
  {
    id: 'bmi-1',
    date: '10-05-2026',
    bmi: '23.0',
    statusColor: '#65B33B',
    statusLabel: 'Healthy',
  },
  {
    id: 'bmi-2',
    date: '09-01-2026',
    bmi: '22.0',
    statusColor: '#E1D71C',
    statusLabel: 'Review',
  },
  {
    id: 'bmi-3',
    date: '23-11-2025',
    bmi: '19.0',
    statusColor: '#E60012',
    statusLabel: 'Action required',
  },
];

export const BMI_TARGET = '21';
export const BMI_NEXT_REVIEW_DATE = '12-11-2027';
