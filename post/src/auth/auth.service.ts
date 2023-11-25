// src/followers/followers.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseClient, Issuer, TokenSet } from 'openid-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private client: BaseClient;
  private AUTH_SERVER_URL = this.configService.get<string>('auth.serverUrl');
  private AUTH_CLIENT_ID = this.configService.get<string>('auth.clientId');

  constructor(private configService: ConfigService) {
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
      const userinfo = await this.client.userinfo(token); // This validates the token
      return userinfo;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
