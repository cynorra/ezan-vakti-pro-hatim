import fs from 'fs';
import path from 'path';

const DIR = 'lib/i18n/locales';

function deepMerge(target, source) {
  for (const k in source) {
    if (typeof source[k] === 'object' && source[k] !== null && !Array.isArray(source[k])) {
      if (typeof target[k] !== 'object' || target[k] === null) target[k] = {};
      deepMerge(target[k], source[k]);
    } else if (!(k in target)) {
      target[k] = source[k];
    }
  }
  return target;
}

const trNew = {
  ramadan: {
    badge: 'RAMAZAN',
    untilIftar: 'İftara Kalan Süre',
    untilSahur: 'Sahura Kalan Süre',
    hours: 'Saat',
    minutes: 'Dk.',
    seconds: 'Sn.',
  },
  zekat: {
    title: 'ZEKAT HESAPLAMA',
    amountDue: 'Verilecek Zekat',
    wealthBase: 'Zekata Tabi Varlık',
    nisabInfo: 'Zekat, nisap miktarına (yaklaşık 85 gr altın değeri) ulaşan ve üzerinden bir yıl geçen varlıklardan %2,5 oranında verilir. Borçlar toplam varlıktan düşülür.',
    cash: 'Nakit / Banka',
    gold: 'Altın',
    silver: 'Gümüş',
    trade: 'Ticari Mal',
    debt: 'Borçlar',
  },
  abdest: {
    title: 'Abdest Nasıl Alınır',
    subtitle: 'Farz ve sünnetleriyle adım adım abdest rehberi',
    step1: 'Niyet et ve "Bismillah" diyerek başla.',
    step2: 'Elleri bileklere kadar üçer kez yıka, parmak aralarını ovala.',
    step3: 'Ağza üç kez su vererek ağzı çalkala (mazmaza).',
    step4: 'Buruna üç kez su çekip temizle (istinşak).',
    step5: 'Yüzü saçların bittiği yerden çeneye, kulaktan kulağa kadar üç kez yıka.',
    step6: 'Önce sağ, sonra sol kolu dirseklerle birlikte üçer kez yıka.',
    step7: 'Başın dörtte birini meshet, kulakları ve ense/boynu meshet.',
    step8: 'Önce sağ, sonra sol ayağı topuklarla birlikte üçer kez yıka.',
    note: 'Abdest bozulduğunda (tuvalet ihtiyacı, uyku, kan çıkması vb.) yeniden alınması gerekir. Bu rehber genel bilgi amaçlıdır, mezhebe göre küçük farklılıklar olabilir.',
  },
  mosques: {
    title: 'Yakın Camiler',
    locationDenied: 'Yakın camileri gösterebilmek için konum izni gerekiyor.',
    loadError: 'Camiler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
    loading: 'Yakındaki camiler aranıyor...',
    retry: 'TEKRAR DENE',
    empty: 'Yakınında kayıtlı cami bulunamadı.',
  },
  quickAccess: {
    mosques: 'Yakın Camiler',
    zekat: 'Zekat Hesapla',
    abdest: 'Abdest Rehberi',
  },
};

const enNew = {
  ramadan: {
    badge: 'RAMADAN',
    untilIftar: 'Time Until Iftar',
    untilSahur: 'Time Until Suhoor',
    hours: 'Hours',
    minutes: 'Min',
    seconds: 'Sec',
  },
  zekat: {
    title: 'ZAKAT CALCULATOR',
    amountDue: 'Zakat Due',
    wealthBase: 'Zakatable Wealth',
    nisabInfo: 'Zakat is due at 2.5% on wealth that reaches the nisab threshold (roughly the value of 85g of gold) and has been held for a full lunar year. Debts are subtracted from total wealth.',
    cash: 'Cash / Bank',
    gold: 'Gold',
    silver: 'Silver',
    trade: 'Trade Goods',
    debt: 'Debts',
  },
  abdest: {
    title: 'How to Perform Wudu',
    subtitle: 'A step-by-step guide with its obligatory and recommended acts',
    step1: 'Make the intention and begin by saying "Bismillah".',
    step2: 'Wash both hands up to the wrists three times, rubbing between the fingers.',
    step3: 'Rinse the mouth with water three times (madmada).',
    step4: 'Sniff water into the nose and clean it three times (istinshaq).',
    step5: 'Wash the face three times, from the hairline to the chin and ear to ear.',
    step6: 'Wash the right then the left arm, including the elbows, three times each.',
    step7: 'Wipe a quarter of the head, then wipe the ears and the back of the neck.',
    step8: 'Wash the right then the left foot, including the ankles, three times each.',
    note: 'Wudu is invalidated by things like using the toilet, sleeping, or bleeding, and must be renewed. This guide is for general information; minor differences may exist between schools of thought.',
  },
  mosques: {
    title: 'Nearby Mosques',
    locationDenied: 'Location permission is needed to show nearby mosques.',
    loadError: 'Something went wrong loading mosques. Please try again.',
    loading: 'Searching for nearby mosques...',
    retry: 'RETRY',
    empty: 'No registered mosques found nearby.',
  },
  quickAccess: {
    mosques: 'Nearby Mosques',
    zekat: 'Zakat Calculator',
    abdest: 'Wudu Guide',
  },
};

const trPath = path.join(DIR, 'tr.json');
const enPath = path.join(DIR, 'en.json');
const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

deepMerge(tr, trNew);
deepMerge(en, enNew);

fs.writeFileSync(trPath, JSON.stringify(tr, null, 2) + '\n');
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');

console.log('tr.json and en.json updated with round-2 keys.');
