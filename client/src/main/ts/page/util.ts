import * as mithril from "mithril";

export interface HyperNode {
    readonly attrs?: any, children?: string | mithril.Children;
}

export abstract class MenuComponent implements mithril.ClassComponent {

    constructor(m: mithril.Hyperscript) {}

    abstract view(vnode?: mithril.CVnode): mithril.Children;
}

export class PageWrapper implements mithril.RouteResolver {

    constructor(private readonly layout: MenuComponent,
                private readonly content: MenuComponent, private readonly location?: string) {}

    render(vnode: mithril.CVnode<any>) {
        if (this.location) {
            vnode.attrs.location = this.location;
        } else {
            vnode.attrs.location = window.location.href.split("/")[4];
        }
        return mithril(this.layout, vnode.attrs, mithril(this.content, vnode.attrs));
    }
}
