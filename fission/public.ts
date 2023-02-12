import express, { Request, Response } from 'express'
import * as path from 'path'

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export async function main(context:any, _cb:any) {
    const req = context.request as Request
    const res = context.response as Response
    express.static(path.resolve(__dirname, '../public'))(req,res, () => {
        res.status(404).send('Not found')
    })
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
module.exports = main