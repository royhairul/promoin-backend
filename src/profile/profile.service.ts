import { SupabaseService } from '@/supabase/supabase.client';
import { Injectable } from '@nestjs/common';
import {
  CreateProfileDTO,
  UpdateProfileDTO,
  UpdateProfileSiteDTO,
} from './dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private supabaseService: SupabaseService) {}

  async getProfiles() {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('*');
    if (error) throw error;
    return data;
  }

  async getProfile(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProfileMe(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProfileSlug(slug: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async createProfile(
    profile: CreateProfileDTO & { logo?: Express.Multer.File },
  ) {
    let logoUrl: string | null = null;

    if (profile.logo) {
      const file = profile.logo;
      const fileName = `${Date.now()}_${file.originalname}`;

      // Upload file ke Supabase Storage
      const { data: uploadData, error: uploadError } =
        await this.supabaseService.supabase.storage
          .from('logos')
          .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Ambil public URL
      logoUrl = this.supabaseService.supabase.storage
        .from('logos')
        .getPublicUrl(fileName).publicURL;
    }

    // Simpan ke tabel profiles
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .insert([{ ...profile, logo: logoUrl }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(id: string, profile: UpdateProfileDTO) {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .update(profile)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfileSite(profile: UpdateProfileSiteDTO) {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .update(profile)
      .eq('user_id', profile.user_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single(); // pasti hanya 1 row

    if (error) throw error;
    return data;
  }

  async deleteProfile(id: string) {
    const { data, error } = await this.supabaseService.supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
