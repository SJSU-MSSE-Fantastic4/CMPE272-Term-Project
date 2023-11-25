import * as mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'feedDb';
const MONGO_USER = process.env.MONGO_USER || 'root';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'password';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(MONGO_URL, {
        dbName: MONGO_DB_NAME,
        user: MONGO_USER,
        pass: MONGO_PASSWORD,
      }),
  },
];
