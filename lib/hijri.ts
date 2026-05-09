/**
 * Simple and relatively accurate Hijri date calculation (Kuwaiti Algorithm)
 */
export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
}

const hijriMonths = [
  'Muharrem', 'Safer', 'Rebiulevvel', 'Rebiulahir',
  'Cemaziyelevvel', 'Cemaziyelahir', 'Recep', 'Şaban',
  'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce'
];

export function getHijriDate(date: Date = new Date()): HijriDate {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (month < 3) {
    year -= 1;
    month += 12;
  }

  let a = Math.floor(year / 100);
  let b = 2 - a + Math.floor(a / 4);

  let jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524;

  // Kuwaiti Algorithm adjustments
  let epoch = 1948439.5;
  let step = (jd - epoch);
  let cyc = Math.floor(step / 10631);
  step = step - cyc * 10631;
  
  let jyear = Math.floor((step - 0.5) / 354.36667);
  let step2 = step - Math.round(jyear * 354.36667);
  let jmonth = Math.floor((step2 - 28.5) / 29.5);
  let jday = Math.floor(step2 - 29.5001 * jmonth - 29);
  
  let hYear = cyc * 30 + jyear;
  let hMonth = jmonth + 1;
  let hDay = jday;

  // Final range corrections
  if (hDay <= 0) {
     hMonth -= 1;
     hDay += 30; // Approximation
  }
  if (hMonth <= 0) {
     hYear -= 1;
     hMonth += 12;
  }

  return {
    day: hDay,
    month: hMonth,
    monthName: hijriMonths[hMonth - 1] || 'Ramazan',
    year: hYear
  };
}
