// Adds home.dailyMessage ("message of the day" label) to every locale.
import fs from 'node:fs';
import path from 'node:path';

const T = {
  tr: 'Günün Mesajı', en: 'Message of the day', ar: 'رسالة اليوم', fa: 'پیام روز', ur: 'آج کا پیغام',
  de: 'Botschaft des Tages', fr: 'Message du jour', es: 'Mensaje del día', it: 'Messaggio del giorno',
  ru: 'Послание дня', uk: 'Послання дня', pl: 'Przesłanie dnia', nl: 'Boodschap van de dag',
  pt: 'Mensagem do dia', sv: 'Dagens budskap', el: 'Μήνυμα της ημέρας', hu: 'A nap üzenete',
  bg: 'Послание на деня', ro: 'Mesajul zilei', bs: 'Poruka dana', az: 'Günün mesajı',
  uz: 'Kun xabari', kk: 'Күн хабары', id: 'Pesan Hari Ini', ms: 'Pesanan Hari Ini',
  bn: 'আজকের বার্তা', hi: 'आज का संदेश', zh: '今日寄语', ja: '今日のメッセージ', ko: '오늘의 메시지',
};
const dir = path.resolve('lib/i18n/locales');
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const lang = file.replace('.json', '');
  if (!T[lang]) throw new Error(`No translation for ${lang}`);
  const full = path.join(dir, file);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));
  json.home = { ...(json.home ?? {}), dailyMessage: T[lang] };
  fs.writeFileSync(full, JSON.stringify(json, null, 2) + '\n');
}
console.log('updated', Object.keys(T).length, 'locales');
