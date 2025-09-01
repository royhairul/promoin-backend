import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  providers: [MarketplaceService],
  imports: [SupabaseModule],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
