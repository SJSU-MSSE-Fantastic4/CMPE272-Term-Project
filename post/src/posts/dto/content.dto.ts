import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ContentDto {
  @IsString()
  @MaxLength(280)
  @ApiProperty({
    example:
      'This is a post and or comment, it is a very good post and or comment',
    description: 'The content of a post or comment',
  })
  content: string;
}
