import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import RPCHandler from '@zenstackhq/server/api/rpc';
import { ZenStackMiddleware } from '@zenstackhq/server/express';
import { Request, Response } from 'express';
import { PrismaService } from './prisma.service';
import { ENHANCED_PRISMA } from '@zenstackhq/server/nestjs';

@Injectable()
export class CrudMiddleware implements NestMiddleware {
  constructor(
    @Inject(ENHANCED_PRISMA)
    private readonly prismaService: PrismaService
  ) { }

  public use(req: Request, _res: Response, next: (error?: any) => void) {
    // construct an Express middleware and forward the request/response
    const inner = ZenStackMiddleware({
      // get an enhanced PrismaClient for the current user
      getPrisma: () => this.prismaService,
      // use RPC style API
      handler: RPCHandler()
    });
    inner(req, _res, next);
  }
}
