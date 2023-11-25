export default () => ({
  amqp: {
    url: process.env.AMQP_URL || 'amqp://localhost',
  },
});
