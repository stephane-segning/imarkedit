import {
  AbstractGrantType,
  Client,
  Falsey,
  Request,
  Token,
} from 'oauth2-server';
import { OauthModelService } from './oauth-model.service';
import { Logger } from '@nestjs/common';

export function generatePublicKeyGrantType(service: OauthModelService) {
  return class extends AbstractGrantType {
    private readonly logger = new Logger(generatePublicKeyGrantType.name);

    async handle(request: Request, client: Client): Promise<Falsey | Token> {
      const signature = request.body.signature;
      const timestamp = request.body.timestamp;
      const kid = request.body.kid;
      const scope = request.body.scope;

      if (!signature) {
        throw new Error('Missing `signature`');
      }

      if (!timestamp) {
        throw new Error('Missing `timestamp`');
      }

      if (!kid) {
        throw new Error('Missing `kid`');
      }

      try {
        return await service.publicKeyGrantType(
          client,
          kid,
          signature,
          timestamp,
          scope
        );
      } catch (e) {
        this.logger.error(e);
        throw new Error('Invalid credentials');
      }
    }
  };
}
