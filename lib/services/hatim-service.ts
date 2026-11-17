import { supabase } from '../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SharedHatim {
  id: string;
  title: string;
  description?: string;
  total_juz: number;
  completed_count: number;
  participants_count: number;
  ends_at: string;
}

export interface SharedHatimJuz {
  id: string;
  hatim_id: string;
  juz_number: number;
  user_id?: string;
  user_name?: string;
  is_completed: boolean;
  completed_at?: string;
}

/** Thrown when someone else took the juz between loading the list and tapping it. */
export class JuzTakenError extends Error {
  constructor() {
    super('juz already taken');
    this.name = 'JuzTakenError';
  }
}

const OFFLINE_HATIMS_KEY = 'offline_shared_hatims_list';
const OFFLINE_PROGRESS_PREFIX = 'offline_hatim_progress_';

const SEED_HATIMS: SharedHatim[] = [
  {
    id: 'seed-hatim-1',
    title: 'Haftalık Genel Kuran Hatmi',
    description: 'Tüm kardeşlerimizle birlikte Kuran-ı Kerim hatmi.',
    total_juz: 30,
    completed_count: 6,
    participants_count: 5,
    ends_at: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
  {
    id: 'seed-hatim-2',
    title: 'Şifa & Huzur Hatm-i Şerifi',
    description: 'Hastalarımızın şifası ve niyetlerimizin kabulü vesilesiyle.',
    total_juz: 30,
    completed_count: 10,
    participants_count: 7,
    ends_at: new Date(Date.now() + 14 * 86400000).toISOString(),
  },
  {
    id: 'seed-hatim-3',
    title: 'Geçmişlerimizin Ruhuna Hatim',
    description: 'Ahirete irtihal etmiş anne, baba ve yakınlarımızın ruhuna bağışlanmak üzere.',
    total_juz: 30,
    completed_count: 4,
    participants_count: 3,
    ends_at: new Date(Date.now() + 21 * 86400000).toISOString(),
  },
];

const SEED_PROGRESS: Record<string, SharedHatimJuz[]> = {
  'seed-hatim-1': [
    { id: 'sp-1', hatim_id: 'seed-hatim-1', juz_number: 1, user_name: 'Ahmet Y.', is_completed: true },
    { id: 'sp-2', hatim_id: 'seed-hatim-1', juz_number: 2, user_name: 'Fatma K.', is_completed: true },
    { id: 'sp-3', hatim_id: 'seed-hatim-1', juz_number: 5, user_name: 'Mehmet S.', is_completed: true },
    { id: 'sp-4', hatim_id: 'seed-hatim-1', juz_number: 10, user_name: 'Zeynep D.', is_completed: true },
    { id: 'sp-5', hatim_id: 'seed-hatim-1', juz_number: 20, user_name: 'Mustafa C.', is_completed: true },
    { id: 'sp-6', hatim_id: 'seed-hatim-1', juz_number: 30, user_name: 'Ahmet Y.', is_completed: true },
  ],
  'seed-hatim-2': [
    { id: 'sp-7', hatim_id: 'seed-hatim-2', juz_number: 1, user_name: 'Hüseyin B.', is_completed: true },
    { id: 'sp-8', hatim_id: 'seed-hatim-2', juz_number: 2, user_name: 'Ayşe T.', is_completed: true },
    { id: 'sp-9', hatim_id: 'seed-hatim-2', juz_number: 3, user_name: 'Ömer A.', is_completed: true },
    { id: 'sp-10', hatim_id: 'seed-hatim-2', juz_number: 4, user_name: 'Emine G.', is_completed: true },
    { id: 'sp-11', hatim_id: 'seed-hatim-2', juz_number: 7, user_name: 'Ali V.', is_completed: true },
  ],
  'seed-hatim-3': [
    { id: 'sp-12', hatim_id: 'seed-hatim-3', juz_number: 1, user_name: 'Kadir M.', is_completed: true },
    { id: 'sp-13', hatim_id: 'seed-hatim-3', juz_number: 15, user_name: 'Selim B.', is_completed: true },
    { id: 'sp-14', hatim_id: 'seed-hatim-3', juz_number: 30, user_name: 'Hatice Y.', is_completed: true },
  ],
};

async function getOfflineHatims(): Promise<SharedHatim[]> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_HATIMS_KEY);
    const stored: SharedHatim[] = raw ? JSON.parse(raw) : [];
    const all = [...stored];
    for (const seed of SEED_HATIMS) {
      if (!all.some((h) => h.id === seed.id)) {
        all.push(seed);
      }
    }

    // Refresh completed counts from local progress
    for (const h of all) {
      const prog = await getOfflineProgress(h.id);
      h.completed_count = prog.length;
      h.participants_count = new Set(prog.map((p) => p.user_name?.trim().toLowerCase()).filter(Boolean)).size;
    }
    return all;
  } catch {
    return SEED_HATIMS;
  }
}

async function getOfflineProgress(hatimId: string): Promise<SharedHatimJuz[]> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_PROGRESS_PREFIX + hatimId);
    if (raw) return JSON.parse(raw);
    return SEED_PROGRESS[hatimId] || [];
  } catch {
    return SEED_PROGRESS[hatimId] || [];
  }
}

async function saveOfflineProgress(hatimId: string, progress: SharedHatimJuz[]): Promise<void> {
  try {
    await AsyncStorage.setItem(OFFLINE_PROGRESS_PREFIX + hatimId, JSON.stringify(progress));
  } catch (err) {
    console.warn('saveOfflineProgress error:', err);
  }
}

export const hatimService = {
  /**
   * Active shared hatims with counts computed from their progress rows:
   * Falls back gracefully to offline storage if remote Supabase backend is unreachable.
   */
  async getSharedHatims(): Promise<SharedHatim[]> {
    try {
      const { data, error } = await supabase
        .from('shared_hatims')
        .select('*, shared_hatim_progress(juz_number, user_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const now = Date.now();
      const remoteList = (data || [])
        .filter((h: any) => !h.ends_at || new Date(h.ends_at).getTime() > now)
        .map(({ shared_hatim_progress: progress = [], ...hatim }: any) => ({
          ...hatim,
          completed_count: new Set(progress.map((p: any) => p.juz_number)).size,
          participants_count: new Set(progress.map((p: any) => (p.user_name || '').trim().toLocaleLowerCase()).filter(Boolean)).size,
        }));

      if (remoteList.length > 0) {
        return remoteList;
      }
    } catch (err) {
      console.log('[hatimService] Supabase unavailable, falling back to local/cached hatims:', (err as any)?.message || err);
    }

    return getOfflineHatims();
  },

  async getHatimDetails(hatimId: string): Promise<SharedHatimJuz[]> {
    try {
      const { data, error } = await supabase
        .from('shared_hatim_progress')
        .select('*')
        .eq('hatim_id', hatimId)
        .order('juz_number', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.log('[hatimService] Remote getHatimDetails error, falling back to offline:', (err as any)?.message || err);
    }

    return getOfflineProgress(hatimId);
  },

  async joinHatim(hatimId: string, juzNumber: number, userName: string) {
    let remoteSuccess = false;
    try {
      const { data: existing, error: checkError } = await supabase
        .from('shared_hatim_progress')
        .select('id')
        .eq('hatim_id', hatimId)
        .eq('juz_number', juzNumber)
        .limit(1);

      if (checkError) throw checkError;
      if (existing && existing.length > 0) throw new JuzTakenError();

      const { error } = await supabase
        .from('shared_hatim_progress')
        .insert([
          {
            hatim_id: hatimId,
            juz_number: juzNumber,
            user_name: userName.trim(),
            is_completed: true,
            completed_at: new Date().toISOString(),
          }
        ]);

      if (error?.code === '23505') throw new JuzTakenError();
      if (error) throw error;
      remoteSuccess = true;
    } catch (err) {
      if (err instanceof JuzTakenError) throw err;
      console.log('[hatimService] Remote joinHatim failed, applying offline join:', (err as any)?.message || err);
    }

    // Always update local cache/state so the user gets instant feedback
    const localProg = await getOfflineProgress(hatimId);
    if (localProg.some((p) => p.juz_number === juzNumber)) {
      throw new JuzTakenError();
    }

    const newEntry: SharedHatimJuz = {
      id: `local-p-${Date.now()}-${juzNumber}`,
      hatim_id: hatimId,
      juz_number: juzNumber,
      user_name: userName.trim(),
      is_completed: true,
      completed_at: new Date().toISOString(),
    };

    localProg.push(newEntry);
    await saveOfflineProgress(hatimId, localProg);

    return { success: true };
  },

  async createSharedHatim(title: string, description: string, endsAt: string): Promise<SharedHatim> {
    try {
      const { data, error } = await supabase
        .from('shared_hatims')
        .insert([
          {
            title,
            description,
            ends_at: endsAt,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) return data;
    } catch (err) {
      console.log('[hatimService] Remote createSharedHatim failed, creating local shared hatim:', (err as any)?.message || err);
    }

    const newHatim: SharedHatim = {
      id: `offline-hatim-${Date.now()}`,
      title: title.trim(),
      description: (description || '').trim(),
      total_juz: 30,
      completed_count: 0,
      participants_count: 0,
      ends_at: endsAt,
    };

    const current = await getOfflineHatims();
    const updated = [newHatim, ...current];
    await AsyncStorage.setItem(OFFLINE_HATIMS_KEY, JSON.stringify(updated));

    return newHatim;
  }
};
