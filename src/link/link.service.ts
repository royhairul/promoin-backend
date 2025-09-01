import { SupabaseService } from '@/supabase/supabase.client';
import { Injectable } from '@nestjs/common';
import { CreateLinkDTO } from './dto/link.dto';
import { detectPlatform } from '@/common/utils/detect-platform';

@Injectable()
export class LinkService {
  constructor(private supabaseService: SupabaseService) {}

  async getLinks() {
    const { data, error } = await this.supabaseService.supabase
      .from('links')
      .select('*');
    if (error) throw error;
    return data;
  }

  async getLinkUser(user_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('links')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw error;
    return data;
  }

  async getLinkUserInstagram(user_id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('links')
      .select('*')
      .eq('platform', 'instagram')
      .eq('user_id', user_id);
    if (error) throw error;
    return data;
  }

  async getLink(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('links')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createLink(link: CreateLinkDTO) {
    const { data, error } = await this.supabaseService.supabase
      .from('links')
      .insert([link])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createLinks(links: (CreateLinkDTO & { user_id: string })[]) {
    const preparedLinks = links.map((link) => ({
      ...link,
      platform: detectPlatform(link.url),
    }));

    const { data, error } = await this.supabaseService.supabase
      .from('links')
      .upsert(preparedLinks, {
        onConflict: 'user_id,platform',
        returning: 'representation',
      })
      .select();

    if (error) throw error;
    return data;
  }
}
