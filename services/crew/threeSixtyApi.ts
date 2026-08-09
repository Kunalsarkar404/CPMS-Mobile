import { apiRequest } from '@/services/api/client';

// One rating level within a category (e.g. "4 - Exceeds"); count is null when no
// votes landed at that level (the screen renders null as "-").
export interface ThreeSixtyLevel {
  label: string;
  count: number | null;
}

export interface ThreeSixtyFlightCategory {
  id: string;
  title: string;
  avg: number;
  levels: ThreeSixtyLevel[];
}

// One flight the crew member was rated on (Flight Level view).
export interface ThreeSixtyFlight {
  id: string;
  date: string | null;
  flightCode: string;
  avgRating: number;
  totalVotes: number;
  categories: ThreeSixtyFlightCategory[];
}

// One category in the Trend view — the crew member's YTD numbers alongside the
// org-wide (OV) numbers.
export interface ThreeSixtyTrendCategory {
  id: string;
  title: string;
  yourAvg: number;
  yourVotes: number;
  totalFlights: number;
  ovAvg: number;
  totalCrew: number;
  totalVotes: number;
}

export interface ThreeSixtyChartSeries {
  id: string;
  label: string;
  data: (number | null)[];
}

// Full "View My 360 Rating" payload for the mobile screen.
export interface MyThreeSixty {
  year: number;
  categories: { id: string; title: string }[];
  flights: ThreeSixtyFlight[];
  trend: {
    overall: Omit<ThreeSixtyTrendCategory, 'id' | 'title'>;
    categories: ThreeSixtyTrendCategory[];
    chart: { months: string[]; series: ThreeSixtyChartSeries[] };
  };
}

// The logged-in crew member's 360 view for the given year (defaults server-side
// to the current year). staffId is resolved from the JWT.
export function getMyThreeSixty(year?: number): Promise<MyThreeSixty> {
  const qs = year ? `?year=${year}` : '';
  return apiRequest<MyThreeSixty>(`/crew/my-360-feedback${qs}`);
}
