import * as mithril from "mithril";

export interface HyperNode {
    readonly attrs?: object, children?: string | mithril.Children;
}

export abstract class MenuComponent implements mithril.ClassComponent {

    constructor(m: mithril.Hyperscript) {}

    abstract view(vnode?: mithril.CVnode): mithril.Children;
}

export class PageWrapper implements mithril.RouteResolver {

    constructor(private readonly layout: MenuComponent, private readonly content: MenuComponent) {}

    render(vnode: mithril.CVnode) {
        return mithril(this.layout, mithril(this.content, vnode.attrs));
    }
}
