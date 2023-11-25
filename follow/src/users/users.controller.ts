import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  BadRequestException,
  Logger,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/entities/authUser.entity';
import { CurrentUser } from '../auth/current-user.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/me')
  @ApiOperation({
    summary: 'Creates/Updates the current user based on their auth0 profile',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'The Created User',
    type: User,
  })
  create(@CurrentUser() user: AuthUser) {
    this.logger.verbose(`Creating user ${user.sub}`);
    return this.usersService.addUser({
      userId: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      nickname: user.nickname,
      created_at: user.created_at,
      updated_at: user.updated_at,
      role: 'user',
    });
  }

  @Get('search')
  @ApiOperation({
    summary: 'Finds users matching the search term',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of users matching the search term',
    type: [User],
  })
  async search(@Query('search') searchTerm: string) {
    this.logger.verbose(`Fetching user's matching ${searchTerm}`);
    let users = await this.usersService.find(searchTerm);
    if (!users) {
      return [];
    }
    return users;
  }

  @Get()
  @ApiOperation({
    summary: 'Finds users from a comma separated list of ids',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of users with the given ids',
    type: [User],
  })
  async findAll(@Query('ids') ids: string) {
    this.logger.verbose(`Fetching users ${ids}`);
    if (ids) {
      let users = await this.usersService.findManyByIds(ids.split(','));
      if (!users) {
        throw new NotFoundException(`Users with ids: ${ids} not found`);
      }
      return users;
    } else {
      throw new BadRequestException('Comma separated list of ids is required');
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Gets a user by id',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A users with the given id',
    type: User,
  })
  async findOne(@Param('id') id: string) {
    this.logger.verbose(`Fetching user ${id}`);
    let user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Adds a follower -> followee relationship between the currentUser and the user with followeeId',
  })
  @HttpCode(204)
  @Post('/me/follow/:followeeId')
  async follow(
    @CurrentUser() user: AuthUser,
    @Param('followeeId') followeeId: string,
  ) {
    this.logger.verbose(`User ${user.sub} following ${followeeId}`);
    let result = await this.usersService.follow(user.sub, followeeId);
    return result;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Removes a follower -> followee relationship between the currentUser and the user with followeeId',
  })
  @HttpCode(204)
  @Delete('/me/follow/:followeeId')
  async unfollow(
    @CurrentUser() user: AuthUser,
    @Param('followeeId') followeeId: string,
  ) {
    this.logger.verbose(`User ${user.sub} unfollowing ${followeeId}`);
    return await this.usersService.unfollow(user.sub, followeeId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a list of the current users followers',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of users following the current user',
    type: [User],
  })
  @Get('/me/followers')
  async currentUserfollowers(@CurrentUser() user: AuthUser) {
    this.logger.verbose(`Fetching followers for user ${user.sub}`);
    return await this.usersService.getFollowers(user.sub);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets a list of the users the current user follows',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of users  the current user is following',
    type: [User],
  })
  @Get('/me/following')
  async currentUserfollowing(@CurrentUser() user: AuthUser) {
    this.logger.verbose(`Fetching users following user ${user.sub}`);
    return await this.usersService.getFollowing(user.sub);
  }

  @ApiOperation({
    summary: 'Gets a list of the users the user with userId follows',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of users  the user with userId is following',
    type: [User],
  })
  @Get('/:userId/followers')
  async followers(@Param('userId') userId: string) {
    this.logger.verbose(`Fetching followers for user ${userId}`);
    let result = await this.usersService.getFollowers(userId);
    return result;
  }

  @ApiOperation({
    summary: 'Gets a list of the users the user with userId follows',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'A list of users the user with userId is following',
    type: [User],
  })
  @Get('/:userId/following')
  async following(@Param('userId') userId: string) {
    this.logger.verbose(`Fetching users following user ${userId}`);
    let result = await this.usersService.getFollowing(userId);
    return result;
  }
}
