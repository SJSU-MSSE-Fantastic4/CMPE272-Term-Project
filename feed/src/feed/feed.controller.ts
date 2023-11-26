import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { FeedService } from './feed.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get(':userId')
  @ApiOperation({
    summary: `
    Gets the ids of the posts in the user with id: userId 's feed. 
    These can be used in conjunction with the post
    service to get full posts
    `,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'An array of the postId of the posts in the user feed',
    type: [String],
  })
  async getFeed(@Param('userId') userId: string) {
    let feed = await this.feedService.getFeed(userId);
    return feed.posts;
  }
}
