export interface StaffMember {
  id: string;
  name: string;
  nationality: string;
  grade: string;
}

export const MOCK_STAFF: StaffMember[] = [
  {
    id: 'CP2203',
    name: 'Rohan Gupta',
    nationality: 'India',
    grade: 'CA',
  },
  {
    id: 'CP2204',
    name: 'Aisha Khan',
    nationality: 'Morocco',
    grade: 'CS',
  },
  {
    id: 'CP2205',
    name: "Liam O'Connor",
    nationality: 'Ireland',
    grade: 'CS',
  },
  {
    id: 'CP2206',
    name: 'Ming Li',
    nationality: 'China',
    grade: 'CA',
  },
  {
    id: 'CP2207',
    name: 'Fatima Ali',
    nationality: 'Egypt',
    grade: 'CS',
  },
  {
    id: 'CP2208',
    name: 'David Smith',
    nationality: 'USA',
    grade: 'CS',
  },
];
