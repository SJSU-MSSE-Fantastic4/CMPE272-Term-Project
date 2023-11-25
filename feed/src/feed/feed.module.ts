import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { DatabaseModule } from '../database/database.module';
import { feedsProviders } from './feed.providers';

@Module({
  imports: [DatabaseModule],
  providers: [FeedService, ...feedsProviders],
  controllers: [FeedController],
  exports: [FeedService],
})
export class FeedModule {}
