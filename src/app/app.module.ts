import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from '@/supabase/supabase.module';
import { InstagramModule } from '@/scraper/instagram/instagram.module';
import { ProfileModule } from '@/profile/profile.module';
import { LinkModule } from '@/link/link.module';
import { ProgressModule } from '@/progress/progress.module';
import { MarketplaceModule } from '@/marketplace/marketplace.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ConfigModule,
    SupabaseModule,
    ProfileModule,
    LinkModule,
    ProgressModule,
    MarketplaceModule,

    // Scraper
    InstagramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
