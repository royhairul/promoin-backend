import { SupabaseService } from '@/supabase/supabase.client';
import { Injectable } from '@nestjs/common';
import { CreateMarketplaceDTO } from './dto/marketplace.dto';

@Injectable()
export class MarketplaceService {
  constructor(private supabaseService: SupabaseService) {}

  async getMarketplaces() {
    const { data, error } = await this.supabaseService.supabase
      .from('marketplaces')
      .select('*');
    if (error) throw error;
    return data;
  }

  async getMarketplace(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('marketplaces')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createMarketplace(marketplace: CreateMarketplaceDTO) {
    const { data, error } = await this.supabaseService.supabase
      .from('marketplaces')
      .insert([marketplace])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
