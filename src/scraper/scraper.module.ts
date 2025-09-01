import { Module } from '@nestjs/common';
import { InstagramModule } from './instagram/instagram.module';
import { ShopeeModule } from './shopee/shopee.module';

@Module({
  imports: [InstagramModule, ShopeeModule]
})
export class ScraperModule {}
