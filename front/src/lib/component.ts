import { Selection } from './selection'
import { ElementBuilder } from './namespaced'
export { Selection }

interface CustomElementTemplateInt extends Element {
    self:Selection;
    shadowElem: ShadowRoot
    shadow:Selection;
    setShadowTemplate(tmpl:HTMLTemplateElement):void
}

function shadowTemplateFrom(obj:CustomElementTemplateInt, type:string): HTMLTemplateElement {
    const name = `${type}-${obj.constructor.name}-template`
    let tmpl:HTMLTemplateElement = document.getElementById(name) as HTMLTemplateElement
    if (tmpl === null) {
        tmpl = document.createElement('template') as HTMLTemplateElement
        tmpl.setAttribute('id', name)
        document.body.appendChild(tmpl)
        obj.setShadowTemplate(tmpl)
        let txt = ""
        document.querySelectorAll('link[rel=stylesheet]').forEach(x => txt+=`@import "${(x as HTMLLinkElement).href}";`)
        const st = document.createElement('style')
        st.innerHTML = txt
        tmpl.content.insertBefore(st,tmpl.content.firstChild)
    }
    return tmpl
}

export abstract class ComponentBase {
    node:Element;
    self:Selection;
    constructor(node?:Element|null, tag="div") {
        if (node !== null && node !== undefined)
            this.node = node
        else
            this.node = new ElementBuilder(tag).create()
        this.self = new Selection([this.node])
    }
}

export abstract class App extends ComponentBase {
    constructor(selector = 'body') {
        super(document.querySelector(selector))
    }
}
export abstract class Component extends ComponentBase {
    app:App
    constructor(app:App, selector?:string, node?:Element, tag="div") {
        super(selector!==undefined?app.node.querySelector(selector):node, tag)
        this.app = app
    }
}

export abstract class HtmlComponent extends HTMLElement {
    shadowElem: ShadowRoot;
    shadow:Selection;
    self:Selection;
    protected constructor(mode?: ShadowRootMode) {
        super()
        this.shadowElem = this.attachShadow({mode: mode!==undefined?mode:'open'})
        this.shadow = new Selection([this.shadowRoot as unknown as HTMLElement])
        this.self = new Selection([this])
    }
    static get componentName() {
        return "html-component-"+this.prototype.constructor.name.toLowerCase()
    }
}

export abstract class HtmlTemplatedComponent extends HtmlComponent implements CustomElementTemplateInt {
    protected constructor(mode?: ShadowRootMode, type='HtmlComponent') {
        super(mode)
        const template = shadowTemplateFrom(this,type)
        this.shadowElem.appendChild(template.content.cloneNode(true));
        this.shadowElem.adoptedStyleSheets = document.adoptedStyleSheets
    }
    abstract setShadowTemplate(tmpl:HTMLTemplateElement):void
}

export function component<T extends HtmlComponent>(classRef: typeof HtmlComponent) {
    return document.createElement(classRef.componentName) as T
}
