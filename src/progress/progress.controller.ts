import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { SupabaseAuthGuard } from '@/supabase/supabase.guard';

@Controller('progress')
@UseGuards(SupabaseAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // GET /progress → ambil semua progress (admin use-case)
  @Get()
  async getAll() {
    return await this.progressService.getAll();
  }

  // GET /progress/me → ambil progress user saat ini
  @Get('me')
  async getMyProgress(@Req() req: any) {
    const userId = req.user?.id;
    return await this.progressService.getByUserId(userId);
  }

  // POST /progress → insert atau update progress user saat ini
  @Post()
  async upsertMyProgress(
    @Req() req: any,
    @Body('current_step') current_step: number,
  ) {
    const userId = req.user?.id;
    return await this.progressService.upsertProgress(userId, current_step);
  }
}
