import { SupabaseAuthGuard } from '@/supabase/supabase.guard';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { CreateMarketplaceDTO } from './dto/marketplace.dto';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private marketplaceService: MarketplaceService) {}

  @Get('')
  getMarketplaces() {
    return this.marketplaceService.getMarketplaces();
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('')
  createMarketplace(@Req() req, @Body() body: CreateMarketplaceDTO) {
    const user = req.user;

    const payload: CreateMarketplaceDTO = {
      ...body,
      user_id: user.id,
    };

    return this.marketplaceService.createMarketplace(payload);
  }
}
