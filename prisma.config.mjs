export default {
  datasources: [
    {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
    },
  ],
};