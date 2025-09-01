import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { SupabaseModule } from '@/supabase/supabase.module';
import { InstagramModule } from '@/scraper/instagram/instagram.module';
import { LinkModule } from '@/link/link.module';
import { LinkService } from '@/link/link.service';
import { InstagramService } from '@/scraper/instagram/instagram.service';

@Module({
  controllers: [ProfileController],
  imports: [SupabaseModule, InstagramModule, LinkModule],
  providers: [ProfileService, LinkService, InstagramService],
})
export class ProfileModule {}
