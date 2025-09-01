import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.client';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async getUserFromToken(token: string) {
    const { data, error } =
      await this.supabaseService.supabase.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return data.user; // pastikan return langsung objek user
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }

  async login(email: string, password: string) {
    const { data, error } =
      await this.supabaseService.supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (error) throw new UnauthorizedException(error.message);
    return data;
  }
}
