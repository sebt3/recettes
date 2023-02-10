interface Hash<T> {
    [key: string]: T
}
const namespaces: Hash<string> = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
}
class Namespaced {
    name: string;
    space: string = "";
    constructor(name:string) {
        var prefix = name += "", i = prefix.indexOf(":");
        if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
        this.name = name
        if (namespaces.hasOwnProperty(prefix))
            this.space = namespaces[prefix]
    }
}
class AttrHandler extends Namespaced {
    add(obj: Element, value: string) {
        if (this.space !== "")
            obj.setAttributeNS(this.space, this.name, value)
        else if(obj.namespaceURI == namespaces.xhtml && obj.ownerDocument.documentElement.namespaceURI == namespaces.xhtml)
            obj.setAttributeNS(namespaces.xhtml, this.name, value)
        else
            obj.setAttribute(this.name, value)
        // @ts-ignore
        obj[this.name] = value
    }
    remove(obj: Element) {
        if (this.space !== "")
            obj.removeAttributeNS(this.space, this.name)
        else if(obj.namespaceURI == namespaces.xhtml && obj.ownerDocument.documentElement.namespaceURI == namespaces.xhtml)
            obj.removeAttributeNS(namespaces.xhtml, this.name)
        else
            obj.removeAttribute(this.name)
    }
}
class Builder extends Namespaced {
    add(parent: Element): Element {
        var elem : Element
        if (this.space !== "")
            elem = parent.ownerDocument.createElementNS(this.space, this.name)
        else if(parent.namespaceURI == namespaces.xhtml && parent.ownerDocument.documentElement.namespaceURI == namespaces.xhtml)
            elem = parent.ownerDocument.createElementNS(namespaces.xhtml, this.name)
        else
            elem = parent.ownerDocument.createElement(this.name)
        return parent.appendChild(elem)
    }
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
        var group: Array<Element> = [];
        this.group.forEach(node => {
            group.push.apply(group, Array.from(node.querySelectorAll(selector)))
        })
        return new Selection(group)
    }

    public add(type:string) : Selection {
        var builder = new Builder(type)
        var group: Array<Element> = [];
        this.group.forEach(node => group.push(builder.add(node)))
        return new Selection(group)
    }

    public on(id:string, handle:EventHandler):Selection {
        var type:string = id.trim().split('.')[0];
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

    public classed(classes: string, active: boolean = true) : Selection {
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

    public text(text: string) : Selection {
        this.group.forEach(node => node.textContent = text)
        return this
    }

    public url(url: string) : Selection {
        this.group.forEach(node => {
            if (node instanceof HTMLAnchorElement) {
                (node as HTMLAnchorElement).href = url
            }
        })
        return this
    }
    public attr(name: string, value: string) : Selection {
        var handler = new AttrHandler(name)
        this.group.forEach(node => handler.add(node, value))
        return this
    }
    public property(name: string, value: any) : Selection {
        // @ts-ignore
        this.group.forEach(node => node[name] = value)
        return this
    }

    public clearContents(): Selection {
        this.group.forEach(node => {
            while (node.firstChild) 
                // @ts-ignore
                node.removeChild(node.lastChild)
        })
        return this
    }

    get items(): Array<Element> { 
        return this.group
    }

    get first(): Selection {
        if (this.group.length>1)
            return new Selection([this.group[0]])
        return this
    }
}
