import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import OAuth2Server from 'oauth2-server';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private readonly oauth2Server: OAuth2Server,
    private readonly cls: ClsService
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);
    const data = await this.oauth2Server.authenticate(request, response);
    this.cls.set('auth', data.user);
    next();
  }
}
