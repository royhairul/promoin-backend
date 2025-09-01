import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  providers: [ProgressService],
  imports: [SupabaseModule],
  controllers: [ProgressController],
})
export class ProgressModule {}
