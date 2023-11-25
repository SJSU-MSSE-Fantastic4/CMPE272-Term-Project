import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/entities/authUser.entity';
import { CurrentUser } from 'src/auth/current-user.decorator';
import mongoose from 'mongoose';
import { ObjectIdPipe } from '../database/object-id.pipe';
import { HttpCode } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Controller('')
export class PostsController {
  constructor(
    private readonly postService: PostsService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Get('post/:postId')
  async getPostById(@Param('postId', ObjectIdPipe) postId: string) {
    const post = await this.postService.getPostById(postId);
    if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
    return post;
  }

  @Get('posts')
  async getPostsByIds(@Query('ids') ids: string) {
    if (!ids) throw new BadRequestException('No post IDs provided');
    let postIds = ids.split(',').map((item) => item.trim());
    const posts = await this.postService.getPostsByIds(postIds);
    if (!posts)
      throw new NotFoundException(`No posts found with the given IDs`);
    return posts;
  }

  @Get('me/posts')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getUsersPosts(@CurrentUser() user: AuthUser) {
    const posts = await this.postService.getUsersPosts(user.sub);
    if (!posts)
      throw new NotFoundException(`No posts found with the given IDs`);
    return posts;
  }

  @Post('me/post')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createPost(@CurrentUser() user: AuthUser, @Body() body: any) {
    const post = await this.postService.createPost(user.sub, body.content);
    this.rabbitMQService.postCreated(post._id, user.sub);
    return post;
  }

  @Patch('me/post/:postId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async updatePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
    @Body() body: any,
  ) {
    const post = await this.postService.updatePost(
      postId,
      user.sub,
      body.content,
    );
    return post;
  }

  @Delete('me/post/:postId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  async deletePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
    @Body() body: any,
  ) {
    const result = await this.postService.deletePost(postId, user.sub);
    if (result.deletedCount === 0)
      throw new NotFoundException(`Post with ID ${postId} not found`);

    return result;
  }

  @Post('post/:postId/like')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  async likePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
  ) {
    const like = await this.postService.likePost(postId, user.sub);
    if (!like) throw new NotFoundException(`Post with ID ${postId} not found`);
    console.log(like);
    return like;
  }

  @Delete('post/:postId/like')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  async unlikePost(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
  ) {
    const like = await this.postService.unlikePost(postId, user.sub);
    if (!like) throw new NotFoundException(`Post with ID ${postId} not found`);
    console.log(like);
    return like;
  }

  @Post('post/:postId/comment')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createComment(
    @CurrentUser() user: AuthUser,
    @Param('postId', ObjectIdPipe) postId: string,
    @Body() body: any,
  ) {
    const comment = await this.postService.createComment(
      postId,
      user.sub,
      body.content,
    );
    console.log(comment);
    return comment;
  }

  @Delete('post/:postId/comment/:commentId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
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
