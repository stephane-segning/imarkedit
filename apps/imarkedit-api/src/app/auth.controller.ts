import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Account } from '@prisma/client';
import { RegisterPublicKeyDto, RegisterPublicKeyResponse } from './register-public-key.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @UseGuards(AuthGuard('public-key'))
  @Post('public-key')
  async login(@Req() req: Request & { user: Account }) {
    return this.authService.login(req.user);
  }

  @Post('register-public-key')
  async registerPublicKey(@Body() dto: RegisterPublicKeyDto): Promise<RegisterPublicKeyResponse> {
    const accountKey = await this.authService.savePublicKey(dto);
    const response = new RegisterPublicKeyResponse();
    response.kid = accountKey.kid;
    response.accountId = accountKey.accountId;
    return response;
  }
}
