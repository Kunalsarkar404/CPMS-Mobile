const MONTHS: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sep: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
};

function atLocalMorning(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 9, 0, 0, 0);
}

/**
 * Parses CPMS display dates such as:
 * - "03 June 2026"
 * - "03-Jun-2026"
 * - "03-06-2026" / "12-11-2027" (DD-MM-YYYY)
 */
export function parseCpmsDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const dashed = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dashed) {
    const day = Number(dashed[1]);
    const month = Number(dashed[2]) - 1;
    const year = Number(dashed[3]);
    if (month < 0 || month > 11 || day < 1 || day > 31) return null;
    return atLocalMorning(year, month, day);
  }

  const named = trimmed.match(/^(\d{1,2})[-\s]([A-Za-z]+)[-\s](\d{4})$/);
  if (named) {
    const day = Number(named[1]);
    const month = MONTHS[named[2].toLowerCase()];
    const year = Number(named[3]);
    if (month === undefined || day < 1 || day > 31) return null;
    return atLocalMorning(year, month, day);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return atLocalMorning(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  );
}

export function daysUntil(date: Date, from: Date = new Date()): number {
  const start = atLocalMorning(from.getFullYear(), from.getMonth(), from.getDate());
  const target = atLocalMorning(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((target.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}

export function subtractDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() - days);
  return atLocalMorning(next.getFullYear(), next.getMonth(), next.getDate());
}

export function isPastOrToday(date: Date, from: Date = new Date()): boolean {
  return daysUntil(date, from) <= 0;
}
