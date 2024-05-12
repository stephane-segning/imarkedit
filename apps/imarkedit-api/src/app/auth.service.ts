import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterPublicKeyDto } from './register-public-key.dto';
import { authenticator } from 'otplib';
import { verifySignature } from '@imarkedit/lib/imarkedit-crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prismService: PrismaService) {
  }

  public getAccountKey(kid: string) {
    return this.prismService.accountKey.findFirst({
      where: {
        kid: kid
      }
    });
  }

  async savePublicKey(dto: RegisterPublicKeyDto) {
    const check = await this.confirmTotp(dto.username, dto.otp);
    if (!check) {
      throw new BadRequestException('Invalid OTP');
    }

    return this.prismService.accountKey.create({
      data: {
        account: {
          connect: {
            username: dto.username
          }
        },
        kid: dto.kid,
        key: dto.publicKey,
        // In a distant future, we might want to support other algorithms
        algo: 'RSA-SHA256'
      }
    });
  }

  async create(username: string) {
    return await this.prismService.$transaction(async (prisma) => {
      const secret = authenticator.generateSecret();
      const account = await prisma.account.create({
        data: {
          username,
          name: username
        }
      });
      await prisma.toptAccount.create({
        data: {
          account: {
            connect: {
              id: account.id
            }
          },
          secret
        }
      });
      return authenticator.keyuri(account.username, 'imarkedit', secret);
    });
  }

  async confirmTotp(username: string, token: string) {
    const totpAccount = await this.prismService.toptAccount.findFirstOrThrow({
      where: {
        account: {
          username
        },
        enabled: true
      }
    });
    return authenticator.verify({
      token,
      secret: totpAccount.secret
    });
  }

  async enableAccount(username: string) {
    return this.prismService.account.update({
      where: {
        username
      },
      data: {
        disabled: false
      }
    });
  }

  async auth(kid: string, signature: string, timestamp: string) {
    const accountKey = await this.getAccountKey(kid);
    if (!accountKey) {
      throw new BadRequestException(`Account key [${kid}] not found`);
    }

    const result = await verifySignature(accountKey.key, timestamp, signature);

    if (!result) {
      throw new BadRequestException('Signature verification failed');
    }

    return this.getAccount(accountKey.accountId);
  }

  async getAccount(username: string) {
    return this.prismService.account.findFirstOrThrow({
      where: {
        OR: [
          {
            username
          },
          {
            id: username
          }
        ]
      }
    });
  }
}
