// src/followers/followers.service.ts

import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { BaseClient, Issuer, TokenSet } from 'openid-client';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class AuthService {
  private client: BaseClient;
  private AUTH_SERVER_URL = this.configService.get<string>('auth.serverUrl');
  private AUTH_CLIENT_ID = this.configService.get<string>('auth.clientId');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.setupClient();
  }

  async setupClient() {
    this.client = await Issuer.discover(this.AUTH_SERVER_URL).then((issuer) => {
      return new issuer.Client({
        client_id: this.AUTH_CLIENT_ID,
      });
    });
  }

  async validateToken(token: string) {
    try {
      const cacheKey = `validateToken:${token}`;
      const cachedResult = await this.cacheManager.get(cacheKey);
      if (cachedResult) {
        Logger.log('Returning cached result');
        return cachedResult;
      }

      Logger.log('Validating token');
      const userinfo = await this.client.userinfo(token); // This validates the token
      await this.cacheManager.set(cacheKey, userinfo, 300);
      return userinfo;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
