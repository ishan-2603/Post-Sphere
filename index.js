const {ApolloServer}=require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const mongoose=require('mongoose');
const typeDefs=require('./graphql/typeDefs.js');
const resolvers=require('./graphql/resolvers');
const {MONGODB}=require('./config.js');

const pubsub=new PubSub();
const server=new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req,pubsub})
});


mongoose.connect(MONGODB)
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({port : 5000});
  })
  .then(res => {
    console.log(`Server running at ${res.url}`);
  });

  


// const { ApolloServer } = require('@apollo/server');
// const { expressMiddleware } = require('@apollo/server/express4');
// const { makeExecutableSchema } = require('@graphql-tools/schema');
// const { PubSub } = require('graphql-subscriptions');
// const { WebSocketServer } = require('ws');
// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const typeDefs = require('./graphql/typeDefs');
// const resolvers = require('./graphql/resolvers');
// const { MONGODB } = require('./config');

// (async () => {
//   // ✅ FIX: Import useServer from correct subpath
//   const { useServer } = await import('graphql-ws/lib/use/ws');

//   const pubsub = new PubSub();
//   const app = express();
//   const httpServer = http.createServer(app);

//   const schema = makeExecutableSchema({ typeDefs, resolvers });

//   const wsServer = new WebSocketServer({
//     server: httpServer,
//     path: '/graphql',
//   });

//   // ✅ Use useServer correctly
//   useServer(
//     {
//       schema,
//       context: async () => ({ pubsub }),
//     },
//     wsServer
//   );

//   const server = new ApolloServer({ schema });
//   await server.start();

//   app.use(
//     '/graphql',
//     cors(),
//     bodyParser.json(),
//     expressMiddleware(server, {
//       context: async ({ req }) => ({ req, pubsub }),
//     })
//   );

//   await mongoose.connect(MONGODB);
//   console.log('MongoDB connected');

//   const PORT = 5000;
//   httpServer.listen(PORT, () =>
//     console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
//   );
// })();


