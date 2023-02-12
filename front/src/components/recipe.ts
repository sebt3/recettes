import { App } from './app'
import { DBComponent, Component, Selection, GraphQLClient } from '../lib/component'
import { recipeQuery, recipeReturn } from './queries'

export class RecipeView extends DBComponent {
    materiel: Selection
    ingredient: Selection
    step: Selection
    private article(on:Selection, id:string, color:string, title:string):Selection {
        const art = on.add(`<article id="${id}" class="message is-${color}" />`)
        art.add(`<div class="message-header"><p>${title}</p></div>`)
        return art.add('<div class="message-body" />')
    }
    constructor(client: GraphQLClient, parent: Component, root: Selection) {
        super(client, parent, root.add('<div class="column" />').add('<section class="section" />'))
        const cols = this.add('<div class="columns" />')
        this.ingredient = this.article(cols.add('<div class="column is-half" />'),'ingredient','success','Ingrédients').addChild('ul')
        this.materiel = this.article(cols.add('<div class="column is-half" />'),'material','warning', 'Matériel').addChild('ul')
        this.step = this.article(this,'step','primary','Etapes').addChild('ol')
    }

    display(id:number) {
        const app = this.parent as App
        const vars = {"where": {"id": id},"orderBy": [{"stepNo": "asc"}]}
        this.materiel.clearContents()
        this.ingredient.clearContents()
        this.step.clearContents()
        this.client.request(recipeQuery, vars).then((data: recipeReturn) => {
            data.recipe.ingredients.forEach(ing => {
                this.ingredient.add(`<li id="ing${ing.ingredientId}">${ing.ingredient.name} (${ing.quantity}${ing.unit.name})</li>`)
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
                this.materiel.add(`<li id="mat${mat.materialId}">${mat.material.name}</li>`)
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
                this.step.add(`<li id="stp${stp.stepNo}">${stp.description}</li>`)
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
