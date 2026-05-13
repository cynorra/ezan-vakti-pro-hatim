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

export const hatimService = {
  async getSharedHatims(): Promise<SharedHatim[]> {
    const { data, error } = await supabase
      .from('shared_hatims')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
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
    const { error } = await supabase
      .from('shared_hatim_progress')
      .insert([
        {
          hatim_id: hatimId,
          juz_number: juzNumber,
          user_name: userName,
          is_completed: true,
          completed_at: new Date().toISOString(),
        }
      ]);

    if (error) throw error;
    
    // Ayrıca participants_count ve completed_count güncellenebilir (opsiyonel, şu an client-side hesaplanıyor)
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
