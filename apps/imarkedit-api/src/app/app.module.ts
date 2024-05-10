import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ClsModule, ClsService } from 'nestjs-cls';
import { AuthInterceptor } from './auth.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import { enhance } from '@zenstackhq/runtime';
import { CrudMiddleware } from './crud.middleware';
import { createId } from '@paralleldrive/cuid2';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) =>
          req.headers['X-Request-Id'] ?? createId(),
      },
      guard: {
        mount: true,
      }
    }),
    ZenStackModule.registerAsync({
      useFactory: (prisma: PrismaService, cls: ClsService) => {
        return {
          getEnhancedPrisma: () => enhance(prisma, { user: cls.get('auth') }),
        };
      },
      inject: [PrismaService, ClsService],
      extraProviders: [PrismaService],
    }),
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CrudMiddleware)
      .forRoutes('/model');
  }
}
