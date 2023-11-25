import { Controller, Get, Param } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get(':userId')
  async getFeed(@Param('userId') userId: string) {
    let feed = await this.feedService.getFeed(userId);
    return feed;
  }
}
