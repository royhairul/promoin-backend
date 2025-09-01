import { SupabaseService } from '@/supabase/supabase.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgressService {
  constructor(private supabaseService: SupabaseService) {}

  // Ambil semua progress
  async getAll() {
    const { data, error } = await this.supabaseService.supabase
      .from('user_progress')
      .select('*');

    if (error) throw error;
    return data;
  }

  // Ambil progress user berdasarkan user_id
  async getByUserId(user_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user_id)
      .single(); // karena 1 user hanya punya 1 progress

    if (error) throw error;
    return data;
  }

  // Update atau insert progress user
  async upsertProgress(user_id: string, current_step: number) {
    const { data, error } = await this.supabaseService.supabase
      .from('user_progress')
      .upsert(
        { user_id, current_step, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
