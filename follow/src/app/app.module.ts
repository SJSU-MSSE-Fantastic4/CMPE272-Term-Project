import { Module } from '@nestjs/common';
import { Neo4jModule } from '../neo4j/neo4j.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // seconds - time to live
      max: 100, // maximum number of items in cache
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      auth_pass: process.env.REDIS_PASS || '',
    }),
    Neo4jModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
