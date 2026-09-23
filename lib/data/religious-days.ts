// Upcoming religious days. Names are i18n keys under `religiousDays.names.*`.
//
// 2026: official Diyanet list (vakithesaplama.diyanet.gov.tr/dinigunler.php?yil=2026).
// 2027: not published by Diyanet yet; computed with Aladhan's DIYANET Hijri calendar and
// marked `estimated`. In 2026 that calendar matched the official list except Ramadan
// start/Kadir/Arefe (one day early), so replace these rows once Diyanet publishes 2027.

export type ReligiousDayKey =
  | 'regaib'
  | 'threeMonths'
  | 'mirac'
  | 'berat'
  | 'ramadanStart'
  | 'kadir'
  | 'arafah'
  | 'ramadanEid'
  | 'kurbanEid'
  | 'hijriNewYear'
  | 'ashura'
  | 'mevlid';

export interface ReligiousDay {
  date: string;
  key: ReligiousDayKey;
  type: 'kandil' | 'eid' | 'other';
  /** Day number for multi-day holidays (Bayram 1st/2nd/... day). */
  day?: number;
  estimated?: boolean;
}

// Turkish-tradition observances that are not marked in most other countries.
export const TURKEY_ONLY_DAYS: ReadonlySet<ReligiousDayKey> = new Set(['regaib', 'threeMonths']);

export const religiousDays: ReligiousDay[] = [
  // 2026 — official Diyanet
  { date: '2026-01-15', key: 'mirac', type: 'kandil' },
  { date: '2026-02-02', key: 'berat', type: 'kandil' },
  { date: '2026-02-19', key: 'ramadanStart', type: 'other' },
  { date: '2026-03-16', key: 'kadir', type: 'kandil' },
  { date: '2026-03-19', key: 'arafah', type: 'other' },
  { date: '2026-03-20', key: 'ramadanEid', type: 'eid', day: 1 },
  { date: '2026-03-21', key: 'ramadanEid', type: 'eid', day: 2 },
  { date: '2026-03-22', key: 'ramadanEid', type: 'eid', day: 3 },
  { date: '2026-05-26', key: 'arafah', type: 'other' },
  { date: '2026-05-27', key: 'kurbanEid', type: 'eid', day: 1 },
  { date: '2026-05-28', key: 'kurbanEid', type: 'eid', day: 2 },
  { date: '2026-05-29', key: 'kurbanEid', type: 'eid', day: 3 },
  { date: '2026-05-30', key: 'kurbanEid', type: 'eid', day: 4 },
  { date: '2026-06-16', key: 'hijriNewYear', type: 'other' },
  { date: '2026-06-25', key: 'ashura', type: 'other' },
  { date: '2026-08-24', key: 'mevlid', type: 'kandil' },
  { date: '2026-12-10', key: 'threeMonths', type: 'other' },
  { date: '2026-12-10', key: 'regaib', type: 'kandil' },

  // 2027 — estimated
  { date: '2027-01-04', key: 'mirac', type: 'kandil', estimated: true },
  { date: '2027-01-22', key: 'berat', type: 'kandil', estimated: true },
  { date: '2027-02-08', key: 'ramadanStart', type: 'other', estimated: true },
  { date: '2027-03-05', key: 'kadir', type: 'kandil', estimated: true },
  { date: '2027-03-08', key: 'arafah', type: 'other', estimated: true },
  { date: '2027-03-09', key: 'ramadanEid', type: 'eid', day: 1, estimated: true },
  { date: '2027-03-10', key: 'ramadanEid', type: 'eid', day: 2, estimated: true },
  { date: '2027-03-11', key: 'ramadanEid', type: 'eid', day: 3, estimated: true },
  { date: '2027-05-15', key: 'arafah', type: 'other', estimated: true },
  { date: '2027-05-16', key: 'kurbanEid', type: 'eid', day: 1, estimated: true },
  { date: '2027-05-17', key: 'kurbanEid', type: 'eid', day: 2, estimated: true },
  { date: '2027-05-18', key: 'kurbanEid', type: 'eid', day: 3, estimated: true },
  { date: '2027-05-19', key: 'kurbanEid', type: 'eid', day: 4, estimated: true },
  { date: '2027-06-06', key: 'hijriNewYear', type: 'other', estimated: true },
  { date: '2027-06-15', key: 'ashura', type: 'other', estimated: true },
  { date: '2027-08-13', key: 'mevlid', type: 'kandil', estimated: true },
  { date: '2027-11-29', key: 'threeMonths', type: 'other', estimated: true },
  { date: '2027-12-02', key: 'regaib', type: 'kandil', estimated: true },
  { date: '2027-12-24', key: 'mirac', type: 'kandil', estimated: true },
];

/** Next `count` days from today (inclusive), skipping Turkey-only observances outside Turkish. */
export function getUpcomingReligiousDays(language: string, count = 3, today = new Date()): ReligiousDay[] {
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const turkish = language.startsWith('tr');
  return religiousDays
    .filter((d) => d.date >= todayIso && (turkish || !TURKEY_ONLY_DAYS.has(d.key)))
    .slice(0, count);
}
