import { Controller, Get, Query } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import axios from 'axios';

@Controller('scraper/instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Get('login')
  login() {
    return this.instagramService.login(
      process.env.INSTAGRAM_USERNAME as string,
      process.env.INSTAGRAM_PASSWORD as string,
    );
  }

  @Get('profile')
  scrapeProfile(@Query('target') target: string) {
    return this.instagramService.scrapeProfile(target);
  }

  @Get('post')
  scrapePost(@Query('target') target: string) {
    return this.instagramService.scrapePost(target);
  }
}
