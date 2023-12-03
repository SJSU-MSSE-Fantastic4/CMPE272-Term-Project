import { Module } from '@nestjs/common';
import { Neo4jModule } from '../neo4j/neo4j.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // seconds - time to live
      max: 100, // maximum number of items in cache
    }),
    Neo4jModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
