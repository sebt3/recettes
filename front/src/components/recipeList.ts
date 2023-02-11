import { DBComponent, Component, Selection, GraphQLClient } from '../lib/component'
import { App } from './app'
import { listAll, listAllCategoriesReturn } from './queries'

export class RecipeListView extends DBComponent {
    constructor(client: GraphQLClient, parent: Component, root: Selection) {
        super(client, parent, root.add('div').classed('column is-2').add('aside').classed('menu section is-primary'))
        this.update()
    }

    highlight(id: number) {
        this.select('li>a').classed('is-active',false)
        this.select(`li>a#rec${id}`).classed('is-active')
    }

    update() {
        const app = this.parent as App
        let recId = -1
        this.clearContents()
        this.client.request(listAll).then((data: listAllCategoriesReturn) => {
            data.categories.forEach(cat => {
                this.add('p').classed('menu-label').text(cat.name)
                const lst = this.add('ul').classed('menu-list')
                cat.recipes.forEach(recipe => {
                    if (recId<0)
                        recId = recipe.id
                    lst.add('li').add('a').text(recipe.name).attr('id',`rec${recipe.id}`)
                    .on('click',()=>{
                      app.viewer.display(recipe.id)
                  })
                });
            })
            if (recId>=0)
                app.viewer.display(recId)
        })
    }
}
