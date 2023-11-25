import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Neo4jModule } from 'src/neo4j/neo4j.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [Neo4jModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
