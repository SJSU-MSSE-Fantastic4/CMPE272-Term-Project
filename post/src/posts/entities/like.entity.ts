import { ApiProperty } from '@nestjs/swagger';

export class Like {
  @ApiProperty({
    example: '6561c10fd5d828913a58ba2f',
    description: 'The unique identifier of the like',
  })
  _id: string;

  @ApiProperty({
    example: '6561c10fd5d828913a58ba2f',
    description: 'The unique identifier of the liked post',
  })
  postId: string;

  @ApiProperty({
    example: 'auth0|655ae7e187cb3003c86f0f41',
    description: 'The unique identifier of the user who liked the post',
  })
  likerId: string;

  @ApiProperty({
    example: '2023-11-24T22:04:07.664Z',
    description: 'The date the like was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '6561c10fd5d828913a58ba2f',
    description: 'The date the like was last updated',
  })
  updatedAt: Date;
}
