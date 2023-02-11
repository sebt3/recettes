import 'reflect-metadata'
import cors from 'cors'
import * as tq from 'type-graphql'
import * as promClient from 'prom-client'
import * as promBundle from 'express-prom-bundle'
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { expressMiddleware } from '@apollo/server/express4'
import { json } from 'body-parser';
import express, { Response } from 'express'
import { Context, createContext, prisma } from './context'
import { resolvers } from '@generated/type-graphql'
import { prometheusPlugin } from '@talabes/apollo-prometheus-plugin'


const main = async () => {
  const port = 4000;
  const app = express();
  const metricsMiddleware = promBundle.default({
    includeMethod: true, metricsPath: '/metricsApp', includeUp: false, includePath: true,
    normalizePath: [['^/graphql/.*', '/graphql/#query'],['^/main.*\\.js', '/main.js'],['^/main.*\\.css', '/main.css'],['^/index\\.html', '/'],]
  });
  const apolloProm = prometheusPlugin(promClient.register, {enableNodeMetrics: true})
  const schema = await tq.buildSchema({resolvers, validate: false})
  const server = new ApolloServer<Context>({ schema , plugins: process.env.NODE_ENV !== 'production'?[apolloProm]:[apolloProm,ApolloServerPluginLandingPageDisabled()]})
  await server.start();
  app.use(metricsMiddleware);
  app.use(express.static('public'));
  app.get("/metrics", async (_req, res: Response) => {
    const metrics = await prisma.$metrics.prometheus();
    const appMetrics = await promClient.register.metrics();
    res.end(metrics + appMetrics);
  });
  
  app.use('/graphql', cors(), json(), expressMiddleware(server, {context: createContext}));
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main()