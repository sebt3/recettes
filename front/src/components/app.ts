import { App } from '../lib/component'
import { RecipeView } from './recipe'
import { RecipeListView } from './recipeList'
import { GraphQLClient } from 'graphql-request'

export class Recettes extends App {
    viewer : RecipeView
    list : RecipeListView
    client: GraphQLClient
    constructor(selector = '#app') {
        super(selector)
        this.client = new GraphQLClient('graphql/', { headers: {} })
        this.node.innerHTML = '<section class="section is-paddingless columns"><div class="column is-2" id="listView"></div><div class="column" id="recipeView"></div></section>'
        this.list = new RecipeListView(this, "#listView")
        this.viewer = new RecipeView(this, "#recipeView")
    }
}
