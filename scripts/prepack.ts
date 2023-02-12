import def from '../package.json'
import fs from 'fs'

function genPackage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dest = def as any
    const match = process.version.match(/^v(\d+)/)
    const vers = (match!=null?match:['','16'])[1]
    dest.scripts = {
        "postinstall": "prisma generate"
    }
    dest.main = "server/index.js"
    dest.engines= {
        "node": `>=${vers}.0.0`
    }
    dest.devDependencies = {}
    dest.prisma = {
        "seed": "node prisma/seed.js"
    }
    delete (dest.files)
    fs.writeFile("dist/package.json", JSON.stringify(dest), () =>{
        console.log('Generated "dist/package.json"')
    })
}

function main() {
    genPackage()
}

main()