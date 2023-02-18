interface Hash<T> {
    [key: string]: T
}
export class Namespaced {
    name: string;
    space = "";
    static namespaces: Hash<string> = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    }
    
    constructor(name:string) {
        let prefix = name += ""
        const i = prefix.indexOf(":");
        if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
        this.name = name
        // eslint-disable-next-line no-prototype-builtins
        if (Namespaced.namespaces.hasOwnProperty(prefix))
            this.space = Namespaced.namespaces[prefix]
    }
}
export class Attribute extends Namespaced {
    set(obj: Element, value: string) {
        if (this.space !== "")
            obj.setAttributeNS(this.space, this.name, value)
        else if(obj.namespaceURI == Namespaced.namespaces.xhtml && obj.ownerDocument.documentElement.namespaceURI == Namespaced.namespaces.xhtml)
            obj.setAttributeNS(Namespaced.namespaces.xhtml, this.name, value)
        else
            obj.setAttribute(this.name, value)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj[this.name] = value
    }
    get(obj: Element) {
        if (this.space !== "")
            return obj.getAttributeNS(this.space, this.name)
        else if(obj.namespaceURI == Namespaced.namespaces.xhtml && obj.ownerDocument.documentElement.namespaceURI == Namespaced.namespaces.xhtml)
            return obj.getAttributeNS(Namespaced.namespaces.xhtml, this.name)
        else
            return obj.getAttribute(this.name)
    }
    remove(obj: Element) {
        if (this.space !== "")
            obj.removeAttributeNS(this.space, this.name)
        else if(obj.namespaceURI == Namespaced.namespaces.xhtml && obj.ownerDocument.documentElement.namespaceURI == Namespaced.namespaces.xhtml)
            obj.removeAttributeNS(Namespaced.namespaces.xhtml, this.name)
        else
            obj.removeAttribute(this.name)
    }
}
export class ElementBuilder extends Namespaced {
    create(): Element {
        let elem : Element
        if (this.space !== "")
            elem = document.createElementNS(this.space, this.name)
        else if(document.documentElement.namespaceURI == Namespaced.namespaces.xhtml)
            elem = document.createElementNS(Namespaced.namespaces.xhtml, this.name)
        else
            elem = document.createElement(this.name)
        return elem
    }
    appendTo(parent: Element): Element {
        let elem : Element
        if (this.space !== "")
            elem = parent.ownerDocument.createElementNS(this.space, this.name)
        else if(parent.namespaceURI == Namespaced.namespaces.xhtml && parent.ownerDocument.documentElement.namespaceURI == Namespaced.namespaces.xhtml)
            elem = parent.ownerDocument.createElementNS(Namespaced.namespaces.xhtml, this.name)
        else
            elem = parent.ownerDocument.createElement(this.name)
        return parent.appendChild(elem)
    }
}
