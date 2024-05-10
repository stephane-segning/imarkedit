import { Strategy } from 'passport-publickey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';
import crypto from 'node:crypto';
import { Request } from 'express';
import { Account } from '@prisma/client';

@Injectable()
export class PublicKeyStrategy extends PassportStrategy(Strategy, 'public-key') {
  private readonly logger = new Logger(PublicKeyStrategy.name);

  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true
    });
  }

  public async validate(req: Request, id: string, signature: string): Promise<Account> {
    const kid = req.body.kid;
    const accountKey = await this.authService.getAccountKey(kid, id);

    const verifier = crypto.createVerify(accountKey.algo);
    verifier.update(accountKey.nonce);

    const publicKeyBuf = new Buffer(accountKey.key, 'base64');
    const result = verifier.verify(publicKeyBuf, signature, 'base64');

    if (!result) {
      this.logger.error('Signature verification failed');
      return null;
    }

    return this.authService.getAccount(id);
  }
}
