import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { SupabaseAuthGuard } from '@/supabase/supabase.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  getUser(@Req() req) {
    const data = req.user.user;
    return { id: data.id, email: data.email };
  }

  @Post('register')
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { session, user } = await this.authService.login(
      dto.email,
      dto.password,
    );

    if (!session) throw new UnauthorizedException('Login gagal');

    // set HTTP-only cookie
    res.cookie('accessToken', session.access_token, {
      httpOnly: true,
      secure: false, // development
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { session };
  }
}
