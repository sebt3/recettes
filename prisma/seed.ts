import { PrismaClient, Prisma } from '@prisma/client'
interface IHash<T> {
    [index: string]: T;
}

const prisma = new PrismaClient()
async function main() {
    let unitReturn: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>> = {}
    let unitList: Array<string>
    unitList = ['g','kg','ml','l','goutte']
    for (const u of unitList) {
        unitReturn[u] = await prisma.unit.upsert({
            where: { name: u },
            update: {},
            create: {
              name: u,
            },
          })
    }
    let relationReturn: Array<Prisma.UnitRelationGetPayload<Prisma.UnitRelationUpsertArgs>> = []
    let relationList: Array<Prisma.UnitRelationUncheckedCreateInput> = [
        {
            fromId: unitReturn['kg'].id,
            toId: unitReturn['g'].id,
            ratio: 1000
        },
        {
            fromId: unitReturn['l'].id,
            toId: unitReturn['ml'].id,
            ratio: 1000
        },
        {
            fromId: unitReturn['ml'].id,
            toId: unitReturn['goutte'].id,
            ratio: 5
        }
    ]
    for (const r of relationList) {
        relationReturn.push(await prisma.unitRelation.upsert({
            where: {
                fromId_toId: {
                    fromId: r.fromId,
                    toId: r.toId
                }
            },
            update: {
                ratio: r.ratio
            },
            create: r,
        }))
    }
    console.log(unitReturn)
    console.log(relationReturn)
}

main()
 .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })