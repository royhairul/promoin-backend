import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { CreateProfileDTO, UpdateProfileSiteDTO } from './dto/profile.dto';
import { SupabaseAuthGuard } from '@/supabase/supabase.guard';
import { memoryStorage } from 'multer';
import { InstagramService } from '@/scraper/instagram/instagram.service';
import { LinkService } from '@/link/link.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly instagramService: InstagramService,
    private readonly linkService: LinkService,
  ) {}

  // GET profiles
  @Get('')
  getProfiles() {
    return this.profileService.getProfiles();
  }
  @UseGuards(SupabaseAuthGuard)
  @Get('/u/:slug')
  async getProfileBySlug(@Param('slug') slug: string) {
    const profile = await this.profileService.getProfileSlug(slug);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const links = await this.linkService.getLinkUser(profile.id);
    const social = await this.instagramService.scrapePost(profile.name);

    return {
      profile,
      links,
      social,
    };
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('/me')
  async getProfileMe(@Req() req) {
    const user = req.user;

    const links = await this.linkService.getLinkUser(user.id);
    const profile = await this.profileService.getProfileMe(user.id);
    const social = await this.instagramService.scrapePost(profile.name);

    return {
      profile,
      links,
      social,
    };
  }

  // GET profile by ID
  @Get(':id')
  getProfile(@Param('id') id: string) {
    return this.profileService.getProfile(id);
  }

  // POST create profile (dengan file logo)
  @UseGuards(SupabaseAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('logo', { storage: memoryStorage() }))
  async createProfile(
    @Req() req,
    @UploadedFile() logo: Express.Multer.File,
    @Body() body: CreateProfileDTO,
  ) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Kirim file + body ke service
    return this.profileService.createProfile({
      ...body,
      logo,
      user_id: user.id,
    });
  }

  @UseGuards(SupabaseAuthGuard)
  @Post('/site')
  async updateSiteProfile(@Req() req, @Body() body: UpdateProfileSiteDTO) {
    const user = req.user;

    const payload: UpdateProfileSiteDTO = {
      ...body,
      user_id: user.id,
    };

    return this.profileService.updateProfileSite(payload);
  }
}
