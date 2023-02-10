import { DBComponent, Component, Selection, GraphQLClient, gql } from '../lib/component'
import { App } from './app'

const listAll = gql`
query listAllRecipes {
  recipes {
    id
    name
    description
  }
}
`
interface listAllRecipesReturnItem {
    id: number
    name: string
    description: string
}
interface listAllRecipesReturn {
    recipes:Array<listAllRecipesReturnItem>
}


export class RecipeListView extends DBComponent {
    list: Selection
    constructor(client: GraphQLClient, parent: Component, root: Selection) {
        super(client, parent, root.add('div').classed('column is-2').add('aside').classed('menu section is-primary'))
        this.add('p').classed('menu-label').text('Menage')
        this.list = this.add('ul').classed('menu-list')
        this.update()
    }

    highlight(id: number) {
        this.list.select('li>a').classed('is-active',false)
        this.list.select(`li>a#rec${id}`).classed('is-active')
    }

    update() {
        var app = this.parent as App
        this.list.clearContents()
        this.client.request(listAll).then((data: listAllRecipesReturn) => {
            data.recipes.forEach(recipe => {
                this.list.add('li').add('a').text(recipe.name).attr('id',`rec${recipe.id}`)
                  .on('click',(item: Element, event:Event)=>{
                    app.viewer.display(recipe.id)
                })
            })
            if (data.recipes.length>0)
                app.viewer.display(data.recipes[0].id)
        })
    }
}
