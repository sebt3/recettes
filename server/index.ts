import 'reflect-metadata'
import * as tq from 'type-graphql'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import express from 'express';
import { Context, createContext } from './context'
import { resolvers } from '@generated/type-graphql'

const main = async () => {
  const port = 4000;
  const app = express();
  const schema = await tq.buildSchema({resolvers, validate: false})
  const server = new ApolloServer<Context>({ schema })
  await server.start();
  app.use(express.static('public'));
  app.use('/graphql', json(), expressMiddleware(server, {context: createContext}));
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main()