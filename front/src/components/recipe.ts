import { gql } from 'graphql-request'
import { Recipe, Ingredient, Material, Unit } from '../../../node_modules/@generated/type-graphql/models';
import { Selection, HtmlTemplatedComponent, Component } from '../lib/component'
import { Recettes } from './app';


export interface voidCallback {
    ():void
}

export class BoxedList extends HtmlTemplatedComponent {
    setShadowTemplate(template:HTMLTemplateElement) {
        template.innerHTML = /*html*/`<article class="message">
            <div class="message-header"><p></p></div>
            <div class="message-body"><ul><slot></slot></ul></div>
        </article>`
    }
    constructor() {
        super()
        if (this.hasAttribute("title"))
            this.shadow.select('.message-header p').text(this.getAttribute('title'))
        else
            this.shadow.select('.message-header p').text('Etapes')
        if (this.hasAttribute("color"))
            this.shadow.select('article').classed('is-'+this.getAttribute('color'))
    }
    add(id:string,text:string, over:voidCallback, out:voidCallback) {
        this.self.add(`<li id="${id}">${text}</li>`)
          .on('mouseover',(item: Element) => {new Selection([item]).classed('is-hover');over()})
          .on('mouseout', (item: Element) => {new Selection([item]).classed('is-hover', false);out()})
    }
    out(){this.self.select('li').classed('is-hover', false)}
    hover(id:string) {this.self.select(`li#${id}`).classed('is-hover')}
}
customElements.define(BoxedList.componentName, BoxedList);

export class BoxedOrderList extends BoxedList {
    setShadowTemplate(template:HTMLTemplateElement) {
        template.innerHTML = /*html*/`<article class="message">
            <div class="message-header"><p></p></div>
            <div class="message-body"><ol><slot></slot></ol></div>
        </article>`
    }
    constructor() {
        super()
    }
}
customElements.define(BoxedOrderList.componentName, BoxedOrderList);


export const recipeQuery = gql`
query recipeQuery($where: RecipeWhereUniqueInput!, $orderBy: [StepOrderByWithRelationInput!]) {
  recipe(where: $where) {
    name
    description
    ingredients {
      ingredientId
      quantity
      unit {
        name
      }
      ingredient {
        name
      }
      Steps {
        stepNo
      }
    }
    materials {
      materialId
      material {
        name
      }
      Steps {
        stepNo
      }
    }
    steps(orderBy: $orderBy) {
      stepNo
      description
      ingredients {
        ingredientId
      }
      materials {
        materialId
      }
    }
  }
}
`

export class RecipeView extends Component {
    app:Recettes
    constructor(app:Recettes, selector:string) {
        app.self.select(selector).add('<section class="section" />')
        super(app, selector+' .section')
        this.app = app
        this.node.innerHTML = /*html*/`<div class="columns" >
            <div class="column is-half"><html-component-boxedlist id="ingredient" color="success"></html-component-boxedlist></div>
            <div class="column is-half"><html-component-boxedlist id="material" color="warning"></html-component-boxedlist></div>
        </div>
        <html-component-boxedorderlist id="step" title="Etapes" color='primary'></html-component-boxedorderlist>`
    }

    display(id:number) {
        const vars = {"where": {"id": id},"orderBy": [{"stepNo": "asc"}]}
        const ingredient = this.node.querySelector("#ingredient") as BoxedList
        const materiel = this.node.querySelector("#material") as BoxedList
        const step = this.node.querySelector("#step") as BoxedOrderList
        this.app.client.request(recipeQuery, vars).then((data: {recipe: Partial<Recipe>}) => {
            materiel.innerHTML=''
            ingredient.innerHTML=''
            step.innerHTML=''
            if (data.recipe.ingredients !== undefined) data.recipe.ingredients.forEach(ing => ingredient.add(`ing${ing.ingredientId}`,`${(ing.ingredient as Ingredient).name} (${ing.quantity}${(ing.unit as Unit).name})`,
                () => {if (ing.Steps !== undefined) ing.Steps.forEach(stp => step.hover(`stp${stp.stepNo}`))},
                () => {step.out()}
            ))
            if (data.recipe.materials !== undefined) data.recipe.materials.forEach(mat => materiel.add(`mat${mat.materialId}`, (mat.material as Material).name,
                () => {if (mat.Steps !== undefined) mat.Steps.forEach(stp => step.hover(`stp${stp.stepNo}`))},
                () => {step.out()}
            ))
            if (data.recipe.steps !== undefined) data.recipe.steps.forEach(stp => step.add(`stp${stp.stepNo}`, stp.description,
                () => {
                    if (stp.ingredients !== undefined) stp.ingredients.forEach(ing => ingredient.hover(`ing${ing.ingredientId}`))
                    if (stp.materials !== undefined) stp.materials.forEach(mat => materiel.hover(`mat${mat.materialId}`))
                },() => {
                    materiel.out()
                    ingredient.out()
                }
            ))
        })
        this.app.list.highlight(id)
    }
}
