import { Component, Selection, GraphQLClient } from '../lib/component'
import { RecipeView } from './recipe'
import { RecipeListView } from './recipeList'

export class App extends Component {
    viewer : RecipeView
    list : RecipeListView
    client : GraphQLClient
    constructor(selector = '#app') {
        super(new Selection().select(selector))
        this.client = new GraphQLClient('graphql/', { headers: {} })
        const section = this.add('section').classed('section is-paddingless columns')
        this.list = new RecipeListView(this.client, this, section)
        this.viewer = new RecipeView(this.client, this, section)
    }
}
