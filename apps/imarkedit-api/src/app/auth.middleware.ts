import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly cls: ClsService) {
  }

  use(req: any, _: any, next: () => void) {
    const userId = req.headers['x-user-id'];
    this.logger.log(`userId-${userId}`);
    if (userId) {
      this.cls.set('auth', { id: userId });
    }
    next();
  }
}
