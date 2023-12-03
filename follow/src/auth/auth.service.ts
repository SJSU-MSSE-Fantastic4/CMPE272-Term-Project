// src/followers/followers.service.ts

import {
  Injectable,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { BaseClient, Issuer, TokenSet } from 'openid-client';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';

const AUTH_SERVER_URL =
  process.env.AUTH_SERVER_URL || 'https://dev-2ttpe83i3lninaj8.us.auth0.com';
const AUTH_CLIENT_ID =
  process.env.AUTH_CLIENT_ID || 'ZRU5C0kWtPWbs41hBPgFecP7I1OyBJ0z';

@Injectable()
export class AuthService {
  private client: BaseClient;

  constructor(@Inject(CACHE_MANAGER) private cacheManager) {
    this.setupClient();
  }

  async setupClient() {
    this.client = await Issuer.discover(AUTH_SERVER_URL).then((issuer) => {
      return new issuer.Client({
        client_id: AUTH_CLIENT_ID,
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
      await this.cacheManager.set(cacheKey, userinfo, { ttl: 300 });
      return userinfo;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
