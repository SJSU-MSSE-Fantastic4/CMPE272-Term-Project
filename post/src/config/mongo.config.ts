export default () => ({
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017',
    dbName: process.env.MONGO_DB_NAME || 'postDb',
    username: process.env.MONGO_USERNAME || 'root',
    password: process.env.MONGO_PASSWORD || 'password',
  },
});
