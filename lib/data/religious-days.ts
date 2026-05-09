export interface ReligiousDay {
  date: string;
  name: string;
  type: 'kandil' | 'eid' | 'other';
}

export const religiousDays: ReligiousDay[] = [
  // 2024
  { date: '2024-01-11', name: 'Regaib Kandili', type: 'kandil' },
  { date: '2024-01-12', name: 'Üç Ayların Başlangıcı', type: 'other' },
  { date: '2024-02-06', name: 'Mirac Kandili', type: 'kandil' },
  { date: '2024-02-24', name: 'Berat Kandili', type: 'kandil' },
  { date: '2024-03-11', name: 'Ramazan Başlangıcı', type: 'other' },
  { date: '2024-04-05', name: 'Kadir Gecesi', type: 'kandil' },
  { date: '2024-04-09', name: 'Arife (Ramazan)', type: 'other' },
  { date: '2024-04-10', name: 'Ramazan Bayramı (1. Gün)', type: 'eid' },
  { date: '2024-04-11', name: 'Ramazan Bayramı (2. Gün)', type: 'eid' },
  { date: '2024-04-12', name: 'Ramazan Bayramı (3. Gün)', type: 'eid' },
  { date: '2024-06-15', name: 'Arife (Kurban)', type: 'other' },
  { date: '2024-06-16', name: 'Kurban Bayramı (1. Gün)', type: 'eid' },
  { date: '2024-06-17', name: 'Kurban Bayramı (2. Gün)', type: 'eid' },
  { date: '2024-06-18', name: 'Kurban Bayramı (3. Gün)', type: 'eid' },
  { date: '2024-06-19', name: 'Kurban Bayramı (4. Gün)', type: 'eid' },
  { date: '2024-07-07', name: 'Hicri Yılbaşı', type: 'other' },
  { date: '2024-07-16', name: 'Aşure Günü', type: 'other' },
  { date: '2024-09-14', name: 'Mevlid Kandili', type: 'kandil' },

  // 2025
  { date: '2025-01-01', name: 'Üç Ayların Başlangıcı', type: 'other' },
  { date: '2025-01-02', name: 'Regaib Kandili', type: 'kandil' },
  { date: '2025-01-27', name: 'Mirac Kandili', type: 'kandil' },
  { date: '2025-02-13', name: 'Berat Kandili', type: 'kandil' },
  { date: '2025-03-01', name: 'Ramazan Başlangıcı', type: 'other' },
  { date: '2025-03-26', name: 'Kadir Gecesi', type: 'kandil' },
  { date: '2025-03-29', name: 'Arife (Ramazan)', type: 'other' },
  { date: '2025-03-30', name: 'Ramazan Bayramı (1. Gün)', type: 'eid' },
  { date: '2025-03-31', name: 'Ramazan Bayramı (2. Gün)', type: 'eid' },
  { date: '2025-04-01', name: 'Ramazan Bayramı (3. Gün)', type: 'eid' },
  { date: '2025-06-05', name: 'Arife (Kurban)', type: 'other' },
  { date: '2025-06-06', name: 'Kurban Bayramı (1. Gün)', type: 'eid' },
  { date: '2025-06-07', name: 'Kurban Bayramı (2. Gün)', type: 'eid' },
  { date: '2025-06-08', name: 'Kurban Bayramı (3. Gün)', type: 'eid' },
  { date: '2025-06-09', name: 'Kurban Bayramı (4. Gün)', type: 'eid' },
  { date: '2025-06-26', name: 'Hicri Yılbaşı', type: 'other' },
  { date: '2025-07-05', name: 'Aşure Günü', type: 'other' },
  { date: '2025-09-03', name: 'Mevlid Kandili', type: 'kandil' },
];
