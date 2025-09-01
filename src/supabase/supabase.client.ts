import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SupabaseService {
  public supabase;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL') || '';
    const key = this.config.get<string>('SUPABASE_KEY') || '';
    this.supabase = createClient(url, key);
  }

  async verifyToken(token: string) {
    const { data: user, error } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid Supabase token');
    }

    return user;
  }
}
