import { Component, Selection, GraphQLClient } from '../lib/component'
//import { Navbar } from './navbar'
import { RecipeView } from './recipe'
import { RecipeListView } from './recipeList'

export class App extends Component {
    viewer : RecipeView
    list : RecipeListView
    //nav : Navbar
    client : GraphQLClient
    constructor(selector: string = '#app') {
        super(new Selection().select(selector))
        this.client = new GraphQLClient('/graphql/', { headers: {} })
        //this.nav = new Navbar(this)
        var section = this.add('section').classed('section is-paddingless columns')
        this.list = new RecipeListView(this.client, this, section)
        this.viewer = new RecipeView(this.client, this, section)
    }
}
