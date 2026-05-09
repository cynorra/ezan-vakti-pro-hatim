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

const IS_MOCK = !process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

export const hatimService = {
  async getSharedHatims(): Promise<SharedHatim[]> {
    if (IS_MOCK) {
      const mockData: SharedHatim[] = [
        {
          id: '1',
          title: 'Ramazan Ayı Genel Hatim',
          description: 'Hep birlikte Ramazan ayını hatimle taçlandırıyoruz.',
          total_juz: 30,
          completed_count: 18,
          participants_count: 12,
          ends_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Filistin İçin Fetih Suresi Hatmi',
          description: 'Zulüm altındaki kardeşlerimiz için dualarımızla birleşiyoruz.',
          total_juz: 30,
          completed_count: 25,
          participants_count: 28,
          ends_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      return mockData;
    }

    const { data, error } = await supabase
      .from('shared_hatims')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getHatimDetails(hatimId: string): Promise<SharedHatimJuz[]> {
    if (IS_MOCK) {
      // Return 30 juz with some completed
      return Array.from({ length: 30 }, (_, i) => ({
        id: `${hatimId}-${i + 1}`,
        hatim_id: hatimId,
        juz_number: i + 1,
        is_completed: i < (hatimId === '1' ? 18 : 25),
        user_name: i < (hatimId === '1' ? 18 : 25) ? 'Kullanıcı' : undefined,
      }));
    }

    const { data, error } = await supabase
      .from('shared_hatim_progress')
      .select('*')
      .eq('hatim_id', hatimId)
      .order('juz_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async joinHatim(hatimId: string, juzNumber: number, userName: string) {
    if (IS_MOCK) {
      console.log(`Joined hatim ${hatimId}, juz ${juzNumber} as ${userName}`);
      return { success: true };
    }

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
    return { success: true };
  }
};
