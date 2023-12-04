import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthUser } from 'src/auth/entities/authUser.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ObjectIdPipe } from '../database/object-id.pipe';
import { HttpCode } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { ContentDto } from './dto/content.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { PopulatedPost, UnpopulatedPost } from './entities/post.entity';
import { Comment } from './entities/comment.entity';

@Controller('')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Get('post/:postId')
  @ApiOperation({
    summary: 'Gets a post by its ID',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The post with the given ID',
    type: PopulatedPost,
  })
  async getPostById(@Param('postId', ObjectIdPipe) postId: string) {
    const post = await this.postService.getPostById(postId);
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    return post;
  }

  @Get('posts')
  @ApiOperation({
    summary: 'Gets a list of post by a comma separated list of IDs',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of posts with the given IDs',
    type: [UnpopulatedPost],
  })
  async getPostsByIds(@Query('ids') ids: string) {
    if (!ids) throw new BadRequestException('No post IDs provided');
    let postIds = ids.split(',').map((item) => item.trim());
    const posts = await this.postService.getPostsByIds(postIds);
    if (!posts)
      throw new NotFoundException(`No posts found with the given IDs`);
    return posts;
  }

  @Get('me/posts')
  @Auth()
  @ApiOperation({
    summary: 'Gets a list of post created by the authenticated user',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of posts with the given IDs',
    type: [UnpopulatedPost],
  })
  async getUsersPosts(@CurrentUser() user: AuthUser) {
    const posts = await this.postService.getUsersPosts(user.sub);
    if (!posts)
      throw new NotFoundException(`No posts found with the given IDs`);
    return posts;
  }

  @Get(':userId/posts')
  @ApiOperation({
    summary: 'Gets a list of post created by the user with userId',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of posts created by user with userId',
    type: [UnpopulatedPost],
  })
  async getPostsByUser(@Param('userId') userId: string) {
    const posts = await this.postService.getUsersPosts(userId);
    if (!posts)
      throw new NotFoundException(`No posts for User with ID ${userId} found`);
    return posts;
  }

  @Post('me/post')
  @Auth()
  @ApiOperation({
    summary: 'Creates a post with the given content',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The created Post',
    type: PopulatedPost,
  })
  async createPost(@CurrentUser() user: AuthUser, @Body() body: ContentDto) {
    const post = await this.postService.createPost(user.sub, body.content);
    this.rabbitMQService.postCreated(post._id, user.sub);
    return post;
  }

  @Patch('me/post/:postId')
  @Auth()
  @ApiOperation({
    summary: 'Updates a post with the id of :postId with the given content',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The created Post',
    type: PopulatedPost,
  })
  async updatePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
    @Body() body: ContentDto,
  ) {
    const post = await this.postService.updatePost(
      postId,
      user.sub,
      body.content,
    );
    return post;
  }

  @Delete('me/post/:postId')
  @Auth()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Deletes a post with the id of :postId',
  })
  @ApiOkResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async deletePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
  ) {
    const result = await this.postService.deletePost(postId, user.sub);
    if (result.deletedCount === 0)
      throw new NotFoundException(`Post with ID ${postId} not found`);

    return result;
  }

  @Get('post/:postId/like')
  @Auth()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Checks is the authenticated user has liked the post with :postId',
  })
  @ApiOkResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async userLikesPost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
  ) {
    const like = await this.postService.findLikeByUser(postId, user.sub);
    if (!like)
      throw new NotFoundException(
        `No Like found for user ${user.sub} on post ${postId}`,
      );
    return like;
  }

  @Post('post/:postId/like')
  @Auth()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Adds a like to a post with the id of :postId',
  })
  @ApiOkResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async likePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
  ) {
    const like = await this.postService.likePost(postId, user.sub);
    if (!like) throw new NotFoundException(`Post with ID ${postId} not found`);
    return like;
  }

  @Delete('post/:postId/like')
  @Auth()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Removes a like to a post with the id of :postId',
  })
  @ApiOkResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async unlikePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
  ) {
    const like = await this.postService.unlikePost(postId, user.sub);
    if (!like) throw new NotFoundException(`Post with ID ${postId} not found`);
    return like;
  }

  @Post('post/:postId/comment')
  @Auth()
  @ApiOperation({
    summary:
      'Adds a comment with the given content to a post with the id of :postId',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The created comment',
    type: Comment,
  })
  async createComment(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
    @Body() body: ContentDto,
  ) {
    const comment = await this.postService.createComment(
      postId,
      user.sub,
      body.content,
    );
    return comment;
  }

  @Delete('post/:postId/comment/:commentId')
  @Auth()
  @HttpCode(204)
  @ApiOperation({
    summary: 'Removes a comment from the post with the id of :postId',
  })
  @ApiOkResponse({
    status: HttpStatus.NO_CONTENT,
  })
  async deleteComment(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
    @Param('commentId', ObjectIdPipe) commentId: string,
  ) {
    const comment = await this.postService.deleteComment(
      postId,
      commentId,
      user.sub,
    );

    if (!comment)
      throw new NotFoundException(`Comment with ID ${commentId} not found`);

    return comment;
  }
}
