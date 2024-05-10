import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import { RegisterPublicKeyDto } from './register-public-key.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismService: PrismaService,
    private readonly jwtService: JwtService
  ) {
  }

  public getAccount(id?: string) {
    return this.prismService.account.findUnique({ where: { id } });
  }

  public getAccountKey(kid: string, accountId: string) {
    return this.prismService.accountKey.findFirstOrThrow({
      where: {
        accountId: accountId,
        kid: kid
      }
    });
  }

  async login(user: Account) {
    const payload = { username: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async savePublicKey(dto: RegisterPublicKeyDto) {
    return this.prismService.accountKey.create({
      data: {
        account: {
          create: { }
        },
        kid: dto.kid,
        key: dto.publicKey,
        nonce: 'nonce', // TODO
        algo: 'RSA-SHA256' // TODO
      }
    });
  }
}
