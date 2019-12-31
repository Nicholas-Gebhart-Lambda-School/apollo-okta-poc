const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { prisma } = require('../prisma/generated/prisma-client');
const authReq = require('./auth/');

(async () => {
  const resolvers = {
    Query: {
      info: async (parent, args, context) => {
        const { headers } = context;
        // Sanity check here
        const result = await authReq(headers, 'Everyone');
        return result ? 'You have access' : 'You are not authorized';
      },
    },
  };

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
      };
    },
  });

  const { url } = await server.listen();
  console.log(url);
})();
