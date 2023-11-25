import { Connection } from 'mongoose';
import { FeedSchema } from './schemas/feed.schema';

export const feedsProviders = [
  {
    provide: 'FEED_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Feed', FeedSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
