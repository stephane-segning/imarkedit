import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmRegisterAccount,
  RegisterAccount,
  RegisterPublicKeyDto,
  RegisterPublicKeyResponse
} from './register-public-key.dto';
import OAuth2Server from 'oauth2-server';
import { Response } from 'express';
import { fromOauthToken } from '@imarkedit/lib/imarkedit-crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauth2Server: OAuth2Server
  ) {
  }

  @Post('token')
  async token(@Req() req: Request, @Res() res: Response) {
    try {
      const request = new OAuth2Server.Request(req);
      const response = new OAuth2Server.Response(res);
      const token = await this.oauth2Server.token(request, response);
      res.send(fromOauthToken(token));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get('authenticate')
  async authenticate(@Req() req: Request, @Res() res: Response) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    const token = await this.oauth2Server.authenticate(request, response);
    res.send(fromOauthToken(token));
  }

  @Post('register')
  async registerAccount(@Body() { username }: RegisterAccount) {
    const data = await this.authService.create(username);
    return { data };
  }

  @HttpCode(204)
  @Post('confirm-register')
  async confirmRegisterAccount(
    @Body() { token, username }: ConfirmRegisterAccount
  ) {
    const check = await this.authService.confirmTotp(username, token);
    if (!check) {
      return;
    }
    await this.authService.enableAccount(username);
  }

  @Post('register-device')
  async registerPublicKey(
    @Body() dto: RegisterPublicKeyDto
  ): Promise<RegisterPublicKeyResponse> {
    const { kid, accountId } = await this.authService.savePublicKey(dto);
    return { kid, accountId };
  }
}
