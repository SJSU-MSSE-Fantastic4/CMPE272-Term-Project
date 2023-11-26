import { ApiProperty } from '@nestjs/swagger';
import { Like } from './like.entity';

export class Post {
  @ApiProperty({
    example: '6561c10fd5d828913a58ba2f',
    description: 'The unique identifier of the post',
  })
  _id: string;

  @ApiProperty({
    example: 'This is a posts, it is a very good post',
    description: 'The content/tweet of the post',
  })
  content: string;

  @ApiProperty({
    example: '2023-11-24T22:04:07.664Z',
    description: 'The date the user was created in auth0',
  })
  createdAt: string;

  @ApiProperty({
    example: '2023-11-24T22:04:07.664Z',
    description: 'The date the user was last updated in auth0',
  })
  updatedAt: string;
}

export class UnpopulatedPost extends Post {
  @ApiProperty({
    example: '120',
    description: 'The number of likes on the post',
  })
  likesCount: number;

  @ApiProperty({
    example: '10',
    description: 'The number of comments on the post',
  })
  commentsCount: number;
}

export class PopulatedPost extends Post {
  @ApiProperty({
    example: `[
        { _id: "123", 
            _id: "6563abcfa59f9af017cbbe39
            likerId: "auth0|655ae7e187cb3003c86f0f41", 
            postId: "6561c10fd5d828913a58ba2f", 
            createdAt: "2020-11-24T22:04:07.664Z", 
            updatedAt: "2020-11-24T22:04:07.664Z" 
        }
    ]`,
    description: 'A list of all the likes on the post',
  })
  likes: [Like];

  @ApiProperty({
    example: `[
        { _id: "123", 
            commenterId: "auth0|655ae7e187cb3003c86f0f41", 
            content: "This is a comment", 
            createdAt: "2020-11-24T22:04:07.664Z", 
            updatedAt: "2020-11-24T22:04:07.664Z" 
        }
    ]`,
    description: 'A list of all the comments on the post',
  })
  comments: [Comment];
}
