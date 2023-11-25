export default () => ({
  auth: {
    serverUrl:
      process.env.AUTH_SERVER_URL ||
      'https://dev-2ttpe83i3lninaj8.us.auth0.com',
    clientId: process.env.AUTH_CLIENT_ID || 'ZRU5C0kWtPWbs41hBPgFecP7I1OyBJ0z',
  },
});
