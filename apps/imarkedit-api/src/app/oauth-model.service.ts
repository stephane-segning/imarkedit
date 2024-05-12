import { Injectable } from '@nestjs/common';
import { BaseModel, Client, ExtensionModel, Falsey, RefreshToken, RefreshTokenModel, Token, User } from 'oauth2-server';
import { PrismaService } from './prisma.service';
import type { Account, OAuth2Client, OAuth2Token, Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { Algorithm } from 'jsonwebtoken';
import { AuthService } from './auth.service';
import moment from 'moment';

@Injectable()
export class OauthModelService
  implements BaseModel, ExtensionModel, RefreshTokenModel {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService
  ) {
  }

  public async generateRefreshToken(
    client: Client,
    user: User,
    scope: string | string[]
  ): Promise<string> {
    return await this.generateRefreshTokenString(
      user as Account,
      client as OAuth2Client,
      scope
    );
  }

  public async getRefreshToken(
    refreshToken: string
  ): Promise<Falsey | RefreshToken> {
    const found = await this.prismaService.oAuth2Token.findFirstOrThrow({
      where: {
        refreshToken
      }
    });
    return await this.convertToOauthToken(found) as RefreshToken;
  }

  public async revokeToken(token: Token | RefreshToken): Promise<boolean> {
    await this.prismaService.oAuth2Token.deleteMany({
      where: {
        OR: [
          { accessToken: token.accessToken },
          { refreshToken: token.refreshToken }
        ]
      }
    });
    return true;
  }

  public async getAccessToken(accessToken: string): Promise<Falsey | Token> {
    const found = await this.prismaService.oAuth2Token.findFirstOrThrow({
      where: {
        accessToken
      }
    });
    return await this.convertToOauthToken(found) as Token;
  }

  // TODO test this
  public async verifyScope(
    token: Token,
    scope: string | string[]
  ): Promise<boolean> {
    const tokenScopes = Array.isArray(token.scope)
      ? token.scope
      : (token.scope ?? '').split(',');
    return Array.isArray(scope)
      ? scope.every((s) => tokenScopes.includes(s))
      : tokenScopes.includes(scope);
  }

  public async generateAccessToken(
    client: Client,
    user: User,
    scope: string | string[]
  ): Promise<string> {
    return await this.generateAccessTokenString(
      user as Account,
      client as OAuth2Client,
      scope
    );
  }

  public async getClient(
    clientId: string,
    clientSecret: string
  ): Promise<Client | Falsey> {
    return this.prismaService.oAuth2Client.findFirst({
      where: {
        id: clientId,
        secret: clientSecret,
        disabled: false
      }
    });
  }

  public async saveToken(
    token: Token,
    client: Client,
    user: User
  ): Promise<Falsey | Token> {
    const scope = Array.isArray(token.scope)
      ? token.scope.join(',')
      : token.scope ?? '';
    const saved = await this.prismaService.oAuth2Token.create({
      data: {
        accessToken: token.accessToken,
        accessTokenExpiresAt: moment(token.accessTokenExpiresAt).unix(),
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: moment(token.refreshTokenExpiresAt).unix(),
        scope: scope.split(','),
        client: {
          connect: {
            id: client.id
          }
        },
        account: {
          connect: {
            id: user.id
          }
        }
      }
    });

    return {
      ...saved,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      user,
      client
    };
  }

  public async publicKeyGrantType(
    client: Client,
    kid: string,
    signature: string,
    timestamp: string,
    scope: string
  ) {
    // Check the signature using timestamp and user's public key
    const account: User = await this.authService.auth(
      kid,
      signature,
      timestamp
    );

    // Generate a token with refresh token and access token
    const [accessToken, refreshToken] = await Promise.all([
      await this.generateAccessToken(client, account, scope),
      await this.generateRefreshToken(client, account, scope)
    ]);

    // Save the token
    const token: Token = {
      accessToken,
      accessTokenExpiresAt: moment().add(client.accessTokenLifetime, 'seconds').toDate(),
      refreshToken,
      refreshTokenExpiresAt: moment().add(client.refreshTokenLifetime, 'seconds').toDate(),
      scope,
      client,
      user: account
    };
    return this.saveToken(token, client, account);
  }

  private async convertToOauthToken(token: OAuth2Token): Promise<Token | RefreshToken> {
    return {
      ...token,
      accessTokenExpiresAt: moment({ seconds: token.accessTokenExpiresAt }).toDate(),
      refreshTokenExpiresAt: moment({ seconds: token.refreshTokenExpiresAt }).toDate(),
      user: await this.getPrismaUser(token.accountId),
      client: await this.getPrismaClient(token.clientId)
    };
  }

  private async getPrismaClient(id: string): Promise<Client> {
    return this.prismaService.oAuth2Client.findFirst({
      where: {
        id
      }
    });
  }

  private async getPrismaUser(userId: string): Promise<User> {
    return this.prismaService.account.findFirst({
      where: {
        id: userId
      }
    });
  }

  private async generateAccessTokenString(
    account: Account,
    client: OAuth2Client,
    scope: string | string[]
  ) {
    const [privateKey, algo] = await this.getLastPrismaKeyPrivateKey();
    const scopes = Array.isArray(scope) ? scope : [scope];
    const payload: Record<string, string | string[]> = {
      username: account.username,
      sub: account.id,
      iss: 'imarkedit',
      aud: client.id,
      scopes: scopes.filter((s) => !!s)
    };
    return jwt.sign(payload, privateKey, {
      algorithm: algo,
      expiresIn: client.accessTokenLifetime
    });
  }

  private async generateRefreshTokenString(
    account: Account,
    client: OAuth2Client,
    scope: string | string[]
  ) {
    const [privateKey, algo] = await this.getLastPrismaKeyPrivateKey();
    const scopes = Array.isArray(scope) ? scope : [scope];
    const payload: Record<string, string | string[]> = {
      sub: account.id,
      iss: 'imarkedit',
      aud: client.id,
      scopes: scopes.filter((s) => !!s)
    };
    return jwt.sign(payload, privateKey, {
      algorithm: algo,
      expiresIn: client.refreshTokenLifetime
    });
  }

  private async getLastPrismaKeyPrivateKey(): Promise<[string, Algorithm]> {
    const { privateData } = await this.prismaService.oAuth2Key.findFirstOrThrow(
      {
        orderBy: {
          createdAt: 'desc'
        },
        where: {
          enabled: true
        }
      }
    );
    return [
      (privateData! as Prisma.JsonObject).privateKey as string,
      (privateData! as Prisma.JsonObject).algo as Algorithm
    ];
  }
}
