import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  providers: [LinkService],
  imports: [SupabaseModule],
  controllers: [LinkController],
})
export class LinkModule {}
