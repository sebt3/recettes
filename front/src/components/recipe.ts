import { App } from './app'
import { DBComponent, Component, Selection, GraphQLClient } from '../lib/component'
import { recipeQuery, recipeReturn } from './queries'

export class RecipeView extends DBComponent {
    materiel: Selection
    ingredient: Selection
    step: Selection
    constructor(client: GraphQLClient, parent: Component, root: Selection) {
        super(client, parent, root.add('div').classed('column').add('section').classed('section'))
        const cols = this.add('div').classed('columns')
        const imess = cols.add('div').classed('column is-half').add('article').classed('message is-success').attr('id', 'ingredient')
        const tmess = cols.add('div').classed('column is-half').add('article').classed('message is-warning').attr('id', 'material')
        const smess = this.add('article').classed('message is-primary').attr('id', 'step')
        tmess.add('div').classed('message-header').add('p').text('Matériel')
        imess.add('div').classed('message-header').add('p').text('Ingrédients')
        smess.add('div').classed('message-header').add('p').text('Etapes')
        this.materiel = tmess.add('div').classed('message-body').add('ul')
        this.ingredient = imess.add('div').classed('message-body').add('ul')
        this.step = smess.add('div').classed('message-body').add('ol')
    }

    display(id:number) {
        const app = this.parent as App
        const vars = {"where": {"id": id},"orderBy": [{"stepNo": "asc"}]}
        this.materiel.clearContents()
        this.ingredient.clearContents()
        this.step.clearContents()
        this.client.request(recipeQuery, vars).then((data: recipeReturn) => {
            data.recipe.ingredients.forEach(ing => {
                this.ingredient.add('li').text(`${ing.ingredient.name} (${ing.quantity}${ing.unit.name})`).attr('id',`ing${ing.ingredientId}`)
                  .on('mouseover',(item: Element) => {
                    new Selection([item]).classed('is-hover')
                    ing.Steps.forEach(stp => {
                        this.step.select(`li#stp${stp.stepNo}`).classed('is-hover')
                    })
                }).on('mouseout',(item: Element) => {
                    new Selection([item]).classed('is-hover', false)
                    this.step.select('li').classed('is-hover', false)
                })
            })
            data.recipe.materials.forEach(mat => {
                this.materiel.add('li').text(mat.material.name).attr('id',`mat${mat.materialId}`)
                .on('mouseover',(item: Element) => {
                    new Selection([item]).classed('is-hover')
                    mat.Steps.forEach(stp => {
                        this.step.select(`li#stp${stp.stepNo}`).classed('is-hover')
                    })
                }).on('mouseout',(item: Element) => {
                    new Selection([item]).classed('is-hover', false)
                    this.step.select('li').classed('is-hover', false)
                })
            })
            data.recipe.steps.forEach(stp => {
                this.step.add('li').text(stp.description).attr('id',`stp${stp.stepNo}`)
                  .on('mouseover',(item: Element) => {
                    new Selection([item]).classed('is-hover')
                    stp.ingredients.forEach(ing => {
                        this.ingredient.select(`li#ing${ing.ingredientId}`).classed('is-hover')
                    })
                    stp.materials.forEach(mat => {
                        this.materiel.select(`li#mat${mat.materialId}`).classed('is-hover')
                    })
                }).on('mouseout',(item: Element) => {
                    new Selection([item]).classed('is-hover', false)
                    this.materiel.select('li').classed('is-hover', false)
                    this.ingredient.select('li').classed('is-hover', false)
                })
            })
        })
        app.list.highlight(id)
    }
}
