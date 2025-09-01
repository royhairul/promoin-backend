import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healtcheck')
  getHealtCheck() {
    return this.appService.getHealthCheck();
  }

  @Get('/proxy-image')
  async proxyImage(@Query('url') url: string, @Res() res: Response) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(response.data);
  }
}
