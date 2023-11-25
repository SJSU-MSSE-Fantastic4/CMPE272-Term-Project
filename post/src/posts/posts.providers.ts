import { Connection } from 'mongoose';
import { PostSchema } from './schemas/post.schema';
import { LikeSchema } from './schemas/like.schema';
import { CommentSchema } from './schemas/comment.schema';

export const postsProviders = [
  {
    provide: 'POST_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Post', PostSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'LIKE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Like', LikeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'COMMENT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Comment', CommentSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
