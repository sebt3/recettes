import { Selection } from './selection'
import { GraphQLClient } from 'graphql-request'
export { GraphQLClient, gql } from 'graphql-request'
export { Selection } from './selection'
export class Component extends Selection {
    constructor(root?: Selection) {
        super(root !== undefined ? root.items : [document.documentElement])
    }
}

export class ChildComponent extends Component {
    parent: Component
    constructor(parent: Component, root?: Selection) {
        super(root !== undefined ? root : parent)
        this.parent = parent
    }
}

export class DBComponent extends ChildComponent {
    client: GraphQLClient
    constructor(client: GraphQLClient, parent: Component, root?: Selection) {
        super(parent, root)
        this.client = client
    }
}
