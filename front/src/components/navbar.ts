import { ChildComponent, Component, Selection } from '../lib/component'

export class Navbar extends ChildComponent {
    bar: Selection
    menu: Selection
    end: Selection
    constructor(parent: Component, root?: Selection) {
        super(parent, root)
        this.bar = this.add('nav').classed('navbar is-primary')
        this.menu = this.bar.add('div').classed('navbar-menu')
        this.end = this.bar.add('div').classed('navbar-end')
    }
}
