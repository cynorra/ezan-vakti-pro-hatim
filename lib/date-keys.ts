// Calendar keys in the user's local time. `toISOString()` is UTC, so it changes the
// day at 03:00 in Turkey, 07:00 in Indonesia, or the evening in the Americas.

/** YYYY-MM-DD for the local calendar day of `date`. */
export function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** YYYY-MM-DD of the local Monday starting the week of `date`. */
export function localWeekStartKey(date: Date = new Date()): string {
  const day = date.getDay();
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (day === 0 ? 6 : day - 1));
  return localDateKey(monday);
}
