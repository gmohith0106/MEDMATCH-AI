export function getCurrentIsoDate(): string {
  return new Date().toISOString();
}

export function formatDaysDifference(targetDate: Date, fromDate: Date = new Date()): number {
  const diffTime = targetDate.getTime() - fromDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0] ?? date.toISOString();
}
