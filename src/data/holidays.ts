// US National Holidays for 2024-2027
export interface Holiday {
  date: string; // YYYY-MM-DD format
  name: string;
}

export const usHolidays: Holiday[] = [
  // 2024
  { date: '2024-01-01', name: "New Year's Day" },
  { date: '2024-01-15', name: 'Martin Luther King Jr. Day' },
  { date: '2024-02-19', name: "Presidents' Day" },
  { date: '2024-05-27', name: 'Memorial Day' },
  { date: '2024-06-19', name: 'Juneteenth' },
  { date: '2024-07-04', name: 'Independence Day' },
  { date: '2024-09-02', name: 'Labor Day' },
  { date: '2024-10-14', name: 'Columbus Day' },
  { date: '2024-11-11', name: 'Veterans Day' },
  { date: '2024-11-28', name: 'Thanksgiving Day' },
  { date: '2024-12-25', name: 'Christmas Day' },
  // 2025
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-01-20', name: 'Martin Luther King Jr. Day' },
  { date: '2025-02-17', name: "Presidents' Day" },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-06-19', name: 'Juneteenth' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-10-13', name: 'Columbus Day' },
  { date: '2025-11-11', name: 'Veterans Day' },
  { date: '2025-11-27', name: 'Thanksgiving Day' },
  { date: '2025-12-25', name: 'Christmas Day' },
  // 2026
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-19', name: 'Martin Luther King Jr. Day' },
  { date: '2026-02-16', name: "Presidents' Day" },
  { date: '2026-05-25', name: 'Memorial Day' },
  { date: '2026-06-19', name: 'Juneteenth' },
  { date: '2026-07-04', name: 'Independence Day' },
  { date: '2026-09-07', name: 'Labor Day' },
  { date: '2026-10-12', name: 'Columbus Day' },
  { date: '2026-11-11', name: 'Veterans Day' },
  { date: '2026-11-26', name: 'Thanksgiving Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  // 2027
  { date: '2027-01-01', name: "New Year's Day" },
  { date: '2027-01-18', name: 'Martin Luther King Jr. Day' },
  { date: '2027-02-15', name: "Presidents' Day" },
  { date: '2027-05-31', name: 'Memorial Day' },
  { date: '2027-06-19', name: 'Juneteenth' },
  { date: '2027-07-04', name: 'Independence Day' },
  { date: '2027-09-06', name: 'Labor Day' },
  { date: '2027-10-11', name: 'Columbus Day' },
  { date: '2027-11-11', name: 'Veterans Day' },
  { date: '2027-11-25', name: 'Thanksgiving Day' },
  { date: '2027-12-25', name: 'Christmas Day' },
];

export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  return usHolidays.filter(h => h.date.startsWith(prefix));
}

export function isHoliday(date: Date): Holiday | undefined {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return usHolidays.find(h => h.date === dateStr);
}
