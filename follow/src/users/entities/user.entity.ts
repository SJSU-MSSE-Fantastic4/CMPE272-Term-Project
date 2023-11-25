import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: 'auth0|5f3c2c3a5e6e5d0069e9e5e0',
    description: 'The unique identifier of the user',
  })
  userId: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: "The user's email address",
  })
  email: string;

  @ApiProperty({
    example: 'testuser',
    description: 'The unique name of the User',
  })
  name: string;

  @ApiProperty({
    example:
      'https://s.gravatar.com/avatar/5dd4e620ff09450cd4866d8726da24b3?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fja.png',
    description: 'A link to the users profile image',
  })
  picture: string;

  @ApiProperty({
    example: 'testuser',
    description: 'The non-unique name of the User',
  })
  nickname: string;

  @ApiProperty({
    example: '2023-11-24T22:04:07.664Z',
    description: 'The date the user was created in auth0',
  })
  created_at: string;

  @ApiProperty({
    example: '2023-11-24T22:04:07.664Z',
    description: 'The date the user was last updated in auth0',
  })
  updated_at: string;

  @ApiProperty({
    examples: ['user', 'admin'],
    description: 'The users role',
  })
  role: 'user' | 'admin';
}
