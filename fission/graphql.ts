
import 'reflect-metadata'
import * as tq from 'type-graphql'
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import { expressMiddleware } from '@apollo/server/express4'
import { Request, Response } from 'express'
import { Context, createContext } from '../server/context'
import { resolvers } from '@generated/type-graphql'

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export async function main(context:any, _cb:any) {
    const req = context.request as Request
    const res = context.response as Response
    const schema = await tq.buildSchema({resolvers, validate: false})
    const server = new ApolloServer<Context>({ schema , plugins: [ApolloServerPluginLandingPageDisabled()]})
    server.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests()
    expressMiddleware(server, {context: createContext})(req,res, () => {
        res.status(200).send(req.originalUrl)
    })
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
module.exports = main