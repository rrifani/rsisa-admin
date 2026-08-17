import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from './auth.decorator';
import { CredentialDto, LoginResultDto, UserIdentityDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Body() payload: CredentialDto): Promise<LoginResultDto> {
    return this.authService.login(payload);
  }

  @Get('/user')
  getCurrentUser(@Req() req: Request): UserIdentityDto {
    return (req as any).user as UserIdentityDto;
  }
}
