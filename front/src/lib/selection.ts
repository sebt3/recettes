import {Attribute} from './namespaced'

interface Hash<T> {
    [key: string]: T
}
export type EachHandler = (item: Element, i: number, all:Array<Element>) => void;
export type EventHandler = (item: Element, event:Event) => void;
type InternalEventHandler = (event:Event) => void;
interface InternalEventHandlersItem {
        type: string
        handler: InternalEventHandler
}

export class Selection {
    private group: Array<Element>;
    private handlers: Hash<InternalEventHandlersItem>;

    constructor(items?: Array<Element>) {
        this.group = items !== undefined ? items : [document.documentElement];
        this.handlers = {};
    }

    public select(selector: string): Selection {
        let group: Array<Element> = [];
        this.group.forEach(node => {
            group = [...group, ...Array.from(node.querySelectorAll(selector))]
        })
        return new Selection(group)
    }

    public on(id:string, handle:EventHandler):Selection {
        const type = id.trim().split('.')[0];
        this.group.forEach((node, i) => {
            this.handlers[`${id}-${i}`] = {type: type, handler: (event:Event) => {
                handle(node,event)
            }} as InternalEventHandlersItem
            node.addEventListener(type, this.handlers[`${id}-${i}`].handler)
        })
        return this
    }
    public removeHandler(id:string):Selection {
        this.group.forEach((node, i) => { node.removeEventListener(this.handlers[`${id}-${i}`].type, this.handlers[`${id}-${i}`].handler) })
        return this
    }

    public classed(classes: string, active = true) : Selection {
        classes.trim().split(/^|\s+/).forEach(cl => {
            this.group.forEach(node => {
                if (active)
                    node.classList.add(cl)
                else
                    node.classList.remove(cl)
            })
        })
        return this
    }

    public each(handle:EachHandler): Selection {
        this.group.forEach(handle)
        return this
    }

    public text(text: string|null) : Selection {
        this.group.forEach(node => node.textContent = text)
        return this
    }

    public url(url: string) : Selection {
        this.group.forEach(node => {
            if (node instanceof HTMLAnchorElement) (node as HTMLAnchorElement).href = url
        })
        return this
    }
    public attr(name: string, value: string) : Selection {
        const attr = new Attribute(name)
        this.group.forEach(node => attr.set(node, value))
        return this
    }

    get items(): Array<Element> { 
        return this.group
    }

    public add(html:string) : Selection {
        const template = document.createElement('template') as HTMLTemplateElement
        template.innerHTML = html.trim()
        const group: Array<Element> = [];
        this.group.forEach(node => {
            Array.from(template.content.childNodes).forEach(e => {
                const elem = e.cloneNode(true) as Element
                node.appendChild(elem)
                group.push(elem)
            })
        })
        return new Selection(group)
    }
    /*
    public clearContents(): Selection {
        this.group.forEach(node => {
            while (node.firstChild) 
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                node.removeChild(node.lastChild)
        })
        return this
    }
    public addChild(type:string) : Selection {
        const builder = new ElementBuilder(type)
        const group: Array<Element> = [];
        this.group.forEach(node => group.push(builder.appendTo(node)))
        return new Selection(group)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public property(name: string, value: any) : Selection {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.group.forEach(node => node[name] = value)
        return this
    }
    */
}