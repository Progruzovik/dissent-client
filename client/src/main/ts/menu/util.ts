import * as mithril from "mithril";

export interface HyperNode {
    readonly attrs?: any, readonly children?: string | mithril.Children;
}

export abstract class MenuComponent implements mithril.ClassComponent {

    constructor(m: mithril.Hyperscript) {}

    abstract view(vnode?: mithril.Vnode): mithril.Children;
}

export class PageWrapper implements mithril.RouteResolver {

    constructor(private readonly layout: MenuComponent,
                private readonly page: MenuComponent, private readonly location?: string) {}

    render(vnode: mithril.Vnode<any>) {
        if (this.location) {
            vnode.attrs.location = this.location;
        }
        return mithril(this.layout, vnode.attrs, mithril(this.page, vnode.attrs));
    }
}
