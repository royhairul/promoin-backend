import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDTO } from './dto/link.dto';
import { SupabaseAuthGuard } from '@/supabase/supabase.guard';

@Controller('link')
export class LinkController {
  constructor(private linkService: LinkService) {}

  // Mendapatkan semua link
  @Get('')
  getLinks() {
    return this.linkService.getLinks();
  }

  // Mendapatkan link user saat ini
  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  getLinkUser(@Req() req) {
    const user = req.user;
    return this.linkService.getLinkUser(user.id);
  }

  // Membuat link baru untuk user
  @UseGuards(SupabaseAuthGuard)
  @Post('')
  createLink(@Req() req, @Body() body: CreateLinkDTO[]) {
    const user = req.user;
    const linksWithUser = body.map((link) => ({
      ...link,
      user_id: user.id,
    }));
    return this.linkService.createLinks(linksWithUser);
  }
}
