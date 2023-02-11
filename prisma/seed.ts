import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

interface IHash<T> {
    [index: string]: T;
}

async function unitUpsert(unitList: Array<string>, units: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>) {
    for (const u of unitList) {
        units[u] = await prisma.unit.upsert({
            where: { name: u },
            update: {},
            create: { name: u },
          })
    }
}

async function ingredientUpsert(ingredientList: Array<Prisma.IngredientUncheckedCreateInput>, ingredients: Array<Prisma.IngredientGetPayload<Prisma.IngredientUpsertArgs>>) {
    for (const r of ingredientList) {
        ingredients.push(await prisma.ingredient.upsert({
            where:  {name:   r.name},
            update: {unitId: r.unitId},
            create: r,
        }))
    }
}

async function materialUpsert(materialList: Array<Prisma.MaterialUncheckedCreateInput>, materials: Array<Prisma.MaterialGetPayload<Prisma.MaterialUpsertArgs>>) {
    for (const r of materialList) {
        materials.push(await prisma.material.upsert({
            where: {
                name: r.name
            },
            update: {},
            create: r,
        }))
    }
}

async function catUpsert(catList: Array<string>, cats: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>) {
    for (const u of catList) {
        cats[u] = await prisma.category.upsert({
            where: { name: u },
            update: {},
            create: { name: u },
          })
    }
}

async function recipeUpsert(recipeList: Array<Prisma.RecipeUncheckedCreateInput>, recipes: Array<Prisma.RecipeGetPayload<Prisma.RecipeUpsertArgs>>) {
    for (const r of recipeList) {
        recipes.push(await prisma.recipe.upsert({
            where: {
                name: r.name
            },
            update: {
                description: r.description,
                categoryId:  r.categoryId
            },
            create: r,
        }))
    }
}

async function recipeMaterialUpsert(recMaterialList: Array<Prisma.RecipeMaterialUncheckedCreateInput>, recipeMaterials: Array<Prisma.RecipeMaterialGetPayload<Prisma.RecipeMaterialUpsertArgs>>) {
    for (const r of recMaterialList) {
        recipeMaterials.push(await prisma.recipeMaterial.upsert({
            where: {
                recipeId_materialId: {
                    recipeId: r.recipeId,
                    materialId: r.materialId
                }
            },
            update: {},
            create: r,
        }))
    }
}

async function recipeIngredientUpsert(recIngredientList: Array<Prisma.RecipeIngredientUncheckedCreateInput>, recipeIngredients: Array<Prisma.RecipeIngredientGetPayload<Prisma.RecipeIngredientUpsertArgs>>) {
    for (const r of recIngredientList) {
        recipeIngredients.push(await prisma.recipeIngredient.upsert({
            where: {
                recipeId_ingredientId: {
                    recipeId: r.recipeId,
                    ingredientId: r.ingredientId
                }
            },
            update: {
                unitId: r.unitId,
                quantity: r.quantity
            },
            create: r,
        }))
    }
}

async function stepUpsert(stepList: Array<Prisma.StepUncheckedCreateInput>, steps: Array<Prisma.StepGetPayload<Prisma.StepUpsertArgs>>) {
    for (const r of stepList) {
        steps.push(await prisma.step.upsert({
            where: {
                recipeId_stepNo: {
                    recipeId: r.recipeId,
                    stepNo: r.stepNo !== undefined ? r.stepNo : 1
                }
            },
            update: {
                description: r.description
            },
            create: r,
        }))
    }
}

async function stepMaterialUpsert(stepMaterialList: Array<Prisma.StepMaterialUncheckedCreateInput>, stepMaterials: Array<Prisma.StepMaterialGetPayload<Prisma.StepMaterialUpsertArgs>>) {
    for (const r of stepMaterialList) {
        stepMaterials.push(await prisma.stepMaterial.upsert({
            where: {
                recipeId_stepNo_materialId: {
                    recipeId: r.recipeId,
                    materialId: r.materialId,
                    stepNo: r.stepNo
                }
            },
            update: {},
            create: r,
        }))
    }
}

async function stepIngredientUpsert(stepIngredientList: Array<Prisma.StepIngredientUncheckedCreateInput>, stepIngredients: Array<Prisma.StepIngredientGetPayload<Prisma.StepIngredientUpsertArgs>>) {
    for (const r of stepIngredientList) {
        stepIngredients.push(await prisma.stepIngredient.upsert({
            where: {
                recipeId_stepNo_ingredientId: {
                    recipeId: r.recipeId,
                    ingredientId: r.ingredientId,
                    stepNo: r.stepNo
                }
            },
            update: {},
            create: r,
        }))
    }
}

async function lessive_liquide(cats: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, units: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, ingredients: Array<Prisma.IngredientGetPayload<Prisma.IngredientUpsertArgs>>, materials: Array<Prisma.MaterialGetPayload<Prisma.MaterialUpsertArgs>>) {
    let recipes: Array<Prisma.RecipeGetPayload<Prisma.RecipeUpsertArgs>> = []
    await recipeUpsert([{
            name: 'Lessive liquide',
            description: 'Lessive liquide. A mettre dans une demi visirette, secouer avant usage.',
            categoryId: cats['Ménage'].id
    }], recipes)
    let r = recipes[0].id, bidon = materials[0].id, sceau = materials[3].id, mixeur = materials[5].id
    let hoteau = ingredients[0].id, eau = ingredients[1].id, savon = ingredients[8].id, soude = ingredients[3].id

    await recipeMaterialUpsert([
        { recipeId: r, materialId: bidon },
        { recipeId: r, materialId: sceau },
        { recipeId: r, materialId: mixeur },
    ], [])
    await recipeIngredientUpsert([
        { recipeId: r, ingredientId: hoteau, quantity: 2,   unitId: units['l'].id },
        { recipeId: r, ingredientId: eau,    quantity: 1,   unitId: units['l'].id },
        { recipeId: r, ingredientId: savon,  quantity: 100, unitId: units['g'].id },
        { recipeId: r, ingredientId: soude,  quantity: 10,  unitId: units['g'].id },
    ], [])
    await stepUpsert([
        { recipeId: r, stepNo: 1, description: 'Mélanger savon, bicarbonate et l\'eau très chaude dans un sceau' },
        { recipeId: r, stepNo: 2, description: 'Laisser reposer 24h' },
        { recipeId: r, stepNo: 3, description: 'Mixer au mixer à soupe' },
        { recipeId: r, stepNo: 4, description: 'Ajouter l\'eau froide' },
        { recipeId: r, stepNo: 5, description: 'Mélanger' },
        { recipeId: r, stepNo: 6, description: 'Verser dans un bidon' },
    ], [])
    await stepMaterialUpsert([
        { recipeId: r, materialId: sceau,  stepNo: 1 },
        { recipeId: r, materialId: mixeur, stepNo: 1 },
        { recipeId: r, materialId: mixeur, stepNo: 3 },
        { recipeId: r, materialId: mixeur, stepNo: 5 },
        { recipeId: r, materialId: bidon,  stepNo: 6 },
    ], [])
    await stepIngredientUpsert([
        { recipeId: r, ingredientId: hoteau, stepNo: 1 },
        { recipeId: r, ingredientId: savon,  stepNo: 1 },
        { recipeId: r, ingredientId: soude,  stepNo: 1 },
        { recipeId: r, ingredientId: eau,    stepNo: 4 },
    ], [])
}
async function dentifrice(cats: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, units: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, ingredients: Array<Prisma.IngredientGetPayload<Prisma.IngredientUpsertArgs>>, materials: Array<Prisma.MaterialGetPayload<Prisma.MaterialUpsertArgs>>) {
    let recipes: Array<Prisma.RecipeGetPayload<Prisma.RecipeUpsertArgs>> = []
    await recipeUpsert([{
            name: 'Dentifrice',
            description: 'Un dentifrice à la menthe simple et efficace',
            categoryId: cats['Ménage'].id
    }], recipes)
    let r = recipes[0].id, bocal = materials[1].id, soude = ingredients[3].id, coco = ingredients[6].id, huile = ingredients[5].id

    await recipeMaterialUpsert([
        { recipeId: r, materialId: bocal },
    ], [])
    await recipeIngredientUpsert([
        { recipeId: r, ingredientId: soude, quantity: 100, unitId: units['g'].id },
        { recipeId: r, ingredientId: coco,  quantity: 100, unitId: units['ml'].id },
        { recipeId: r, ingredientId: huile, quantity: 2,   unitId: units['goutte'].id },
    ], [])
    await stepUpsert([
        { recipeId: r, stepNo: 1, description: 'Dans un bocal stérile, mélanger tous les ingrédients' },
        { recipeId: r, stepNo: 2, description: 'C\'est pret' },
    ], [])
    await stepMaterialUpsert([
        { recipeId: r, materialId: bocal, stepNo: 1 },
    ], [])
    await stepIngredientUpsert([
        { recipeId: r, ingredientId: soude, stepNo: 1 },
        { recipeId: r, ingredientId: coco, stepNo: 1 },
        { recipeId: r, ingredientId: huile, stepNo: 1 },
    ], [])
}
async function pastille_wc(cats: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, units: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, ingredients: Array<Prisma.IngredientGetPayload<Prisma.IngredientUpsertArgs>>, materials: Array<Prisma.MaterialGetPayload<Prisma.MaterialUpsertArgs>>) {
    let recipes: Array<Prisma.RecipeGetPayload<Prisma.RecipeUpsertArgs>> = []
    await recipeUpsert([{
            name: 'Pastille WC',
            description: 'Pastille pour WC. Mettre dans la cuvette, revenir 15mn après pour frotter.',
            categoryId: cats['Ménage'].id
    }], recipes)
    let r = recipes[0].id, moule = materials[2].id, spray = materials[4].id
    let eau = ingredients[1].id, soude = ingredients[3].id, acide = ingredients[2].id, huile = ingredients[5].id

    await recipeMaterialUpsert([
        { recipeId: r, materialId: moule },
        { recipeId: r, materialId: spray },
    ], [])
    await recipeIngredientUpsert([
        { recipeId: r, ingredientId: acide, quantity: 45,  unitId: units['g'].id },
        { recipeId: r, ingredientId: soude, quantity: 130, unitId: units['g'].id },
        { recipeId: r, ingredientId: eau,   quantity: 10,  unitId: units['ml'].id },
        { recipeId: r, ingredientId: huile, quantity: 2,   unitId: units['goutte'].id },
    ], [])
    await stepUpsert([
        { recipeId: r, stepNo: 1, description: 'Mettre dans le spray l\'eau et l\'essence de menthe (ou citron), et secouer' },
        { recipeId: r, stepNo: 2, description: 'Mélanger les poudres' },
        { recipeId: r, stepNo: 3, description: 'Humecter le mélange et mélanger. Ca doit être légèrement humide' },
        { recipeId: r, stepNo: 4, description: 'Répartir dans les moules silicone pour faire des pastilles sans trop remplir (ca va gonfler un peu)' },
        { recipeId: r, stepNo: 5, description: 'Metter a sécher 24h' },
    ], [])
    await stepMaterialUpsert([
        { recipeId: r, materialId: spray, stepNo: 1 },
        { recipeId: r, materialId: moule, stepNo: 4 },
    ], [])
    await stepIngredientUpsert([
        { recipeId: r, ingredientId: eau, stepNo: 1 },
        { recipeId: r, ingredientId: huile, stepNo: 1 },
        { recipeId: r, ingredientId: acide, stepNo: 2 },
        { recipeId: r, ingredientId: soude, stepNo: 2 },
    ], [])
}
async function spray(cats: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, units: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>>, ingredients: Array<Prisma.IngredientGetPayload<Prisma.IngredientUpsertArgs>>, materials: Array<Prisma.MaterialGetPayload<Prisma.MaterialUpsertArgs>>) {
    let recipes: Array<Prisma.RecipeGetPayload<Prisma.RecipeUpsertArgs>> = []
    await recipeUpsert([{
            name: 'Spray nettoyant',
            description: 'Un spray nettoyant/désinfectant tout usage',
            categoryId: cats['Ménage'].id
    }], recipes)
    let r = recipes[0].id, spray = materials[4].id
    let vinaigre = ingredients[9].id, jus = ingredients[7].id, huile = ingredients[4].id

    await recipeMaterialUpsert([
        { recipeId: r, materialId: spray },
    ], [])
    await recipeIngredientUpsert([
        { recipeId: r, ingredientId: vinaigre, quantity: 550, unitId: units['ml'].id },
        { recipeId: r, ingredientId: jus,      quantity: 115, unitId: units['ml'].id },
        { recipeId: r, ingredientId: huile,    quantity: 10,  unitId: units['goutte'].id },
    ], [])
    await stepUpsert([
        { recipeId: r, stepNo: 1, description: 'Tout verser dans le spray' },
        { recipeId: r, stepNo: 2, description: 'Secouer pour mélanger et c \'est pret' },
    ], [])
    await stepMaterialUpsert([
        { recipeId: r, materialId: spray, stepNo: 1 },
    ], [])
    await stepIngredientUpsert([
        { recipeId: r, ingredientId: vinaigre, stepNo: 1 },
        { recipeId: r, ingredientId: jus,      stepNo: 1 },
        { recipeId: r, ingredientId: huile,    stepNo: 1 },
    ], [])
}

async function relationUpsert(relationList: Array<Prisma.UnitRelationUncheckedCreateInput>, relations: Array<Prisma.UnitRelationGetPayload<Prisma.UnitRelationUpsertArgs>>) {
    for (const r of relationList) {
        relations.push(await prisma.unitRelation.upsert({
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
}

async function main() {
    let units: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>> = {}
    await unitUpsert(['g','kg','ml','l','goutte'], units)

    await relationUpsert([
        {
            fromId: units['kg'].id,
            toId: units['g'].id,
            ratio: 1000
        },
        {
            fromId: units['l'].id,
            toId: units['ml'].id,
            ratio: 1000
        },
        {
            fromId: units['ml'].id,
            toId: units['goutte'].id,
            ratio: 5
        }
    ],[])


    let ingredients: Array<Prisma.IngredientGetPayload<Prisma.IngredientUpsertArgs>> = []
    await ingredientUpsert([
            { name: 'Eau chaude', unitId: units['l'].id },
            { name: 'Eau',        unitId: units['l'].id },
            { name: 'Acide citrique',unitId: units['g'].id },
            { name: 'Bicarbonate de soude', unitId: units['g'].id },
            { name: 'Huile essentielle de citron', unitId: units['ml'].id },
            { name: 'Huile essentielle de menthe', unitId: units['g'].id },
            { name: 'Huile de coco', unitId: units['l'].id },
            { name: 'Jus de citron', unitId: units['ml'].id },
            { name: 'Savon de marseille en copeau', unitId: units['kg'].id },
            { name: 'Vinaigre blanc', unitId: units['l'].id },
        ], ingredients)

    let materials: Array<Prisma.MaterialGetPayload<Prisma.MaterialUpsertArgs>> = []
    await materialUpsert([
            { name: 'Bidon de 5l' },
            { name: 'Bocal' },
            { name: 'Moule en silicone' },
            { name: 'Sceau' },
            { name: 'Bouteille avec spray' },
            { name: 'Mixeur plongeant' },
        ], materials)

    let cats: IHash<Prisma.UnitGetPayload<Prisma.UnitUpsertArgs>> = {}
    await catUpsert(['Ménage'], cats)

    await lessive_liquide(cats, units, ingredients, materials)
    await dentifrice(cats, units, ingredients, materials)
    await pastille_wc(cats, units, ingredients, materials)
    await spray(cats, units, ingredients, materials)
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
