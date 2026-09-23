import { supabase } from '../supabase';

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

export const hatimService = {
  /**
   * Active shared hatims with counts computed from their progress rows: the
   * completed_count / participants_count columns are never updated server-side,
   * so they always read 0.
   */
  async getSharedHatims(): Promise<SharedHatim[]> {
    const { data, error } = await supabase
      .from('shared_hatims')
      .select('*, shared_hatim_progress(juz_number, user_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const now = Date.now();
    return (data || [])
      .filter((h: any) => !h.ends_at || new Date(h.ends_at).getTime() > now)
      .map(({ shared_hatim_progress: progress = [], ...hatim }: any) => ({
        ...hatim,
        completed_count: new Set(progress.map((p: any) => p.juz_number)).size,
        participants_count: new Set(progress.map((p: any) => (p.user_name || '').trim().toLocaleLowerCase()).filter(Boolean)).size,
      }));
  },

  async getHatimDetails(hatimId: string): Promise<SharedHatimJuz[]> {
    const { data, error } = await supabase
      .from('shared_hatim_progress')
      .select('*')
      .eq('hatim_id', hatimId)
      .order('juz_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async joinHatim(hatimId: string, juzNumber: number, userName: string) {
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

    // 23505 = unique violation, if the (hatim_id, juz_number) constraint exists.
    if (error?.code === '23505') throw new JuzTakenError();
    if (error) throw error;
    return { success: true };
  },

  async createSharedHatim(title: string, description: string, endsAt: string): Promise<SharedHatim> {
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
    return data;
  }
};
