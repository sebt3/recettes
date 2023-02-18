import { gql } from 'graphql-request'
import { Category } from '../../../node_modules/@generated/type-graphql/models'

import { Component } from '../lib/component'
import { Recettes } from './app';

const listAll = gql`
query listAllCategories {
  categories {
    id
    name
    recipes {
      id
      name
      description
    }
  }
}
`

export class RecipeListView extends Component {
    app:Recettes
    constructor(app:Recettes, selector:string) {
        app.self.select(selector).add('<aside class="menu section is-primary" />')
        super(app, selector+' aside.menu')
        this.app = app
        this.update()
    }

    highlight(id: number) {
        this.self.select('li>a').classed('is-active',false)
        this.self.select(`li>a#rec${id}`).classed('is-active')
    }

    update() {
        let recId = -1
        this.node.innerHTML=""
        this.app.client.request(listAll).then((data: {categories:Array<Partial<Category>>}) => {
            data.categories.forEach(cat => {
                this.self.add(`<p class="menu-label">${cat.name}</p>`)
                const lst = this.self.add('<ul class="menu-list" />')
                if (cat.recipes !== undefined) cat.recipes.forEach(recipe => {
                    if (recId<0)
                        recId = recipe.id
                    lst.add('<li />').add(`<a id="rec${recipe.id}">${recipe.name}</a>`).on('click',()=>{
                        this.app.viewer.display(recipe.id)
                    })
                });
            })
            if (recId>=0)
                this.app.viewer.display(recId)
        })
    }
}
