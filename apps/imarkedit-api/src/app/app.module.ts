import {
  ExecutionContext,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ClsMiddleware, ClsModule, ClsService } from 'nestjs-cls';
import { ZenStackModule } from '@zenstackhq/server/nestjs';
import { enhance } from '@zenstackhq/runtime';
import { CrudMiddleware } from './crud.middleware';
import { AuthMiddleware } from './auth.middleware';
import { createId } from '@paralleldrive/cuid2';
import { AuthService } from './auth.service';
import { PublicKeyStrategy } from './auth/public-key.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '60s' },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: false,
        generateId: true,
        idGenerator: (req: Request) =>
          req.headers['X-Request-Id'] ?? createId(),
      },
      guard: {
        mount: false,
        generateId: true,
        idGenerator: (req: ExecutionContext) =>
          req.switchToHttp().getRequest().headers['X-Request-Id'] ?? createId(),
      },
      interceptor: {
        mount: false,
        generateId: true,
        idGenerator: (req: ExecutionContext) =>
          req.switchToHttp().getRequest().headers['X-Request-Id'] ?? createId(),
      },
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
  controllers: [AuthController],
  providers: [PrismaService, AuthService, PublicKeyStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, AuthMiddleware, CrudMiddleware)
      .forRoutes('/model');
  }
}
