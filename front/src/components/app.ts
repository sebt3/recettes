import { Component, Selection, GraphQLClient } from '../lib/component'
import { RecipeView } from './recipe'
import { RecipeListView } from './recipeList'

export class App extends Component {
    viewer : RecipeView
    list : RecipeListView
    constructor(selector = '#app') {
        super(new Selection().select(selector))
        const client = new GraphQLClient('graphql/', { headers: {} })
        const section = this.add('<section class="section is-paddingless columns" />')
        this.list = new RecipeListView(client, this, section)
        this.viewer = new RecipeView(client, this, section)
    }
}
