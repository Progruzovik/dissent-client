import * as m from "mithril";

export interface HyperNode {
    readonly attrs?: any, readonly children?: string | m.Children;
}

export class PageWrapper implements m.RouteResolver {

    constructor(private readonly layout: m.ClassComponent,
                private readonly page: m.ClassComponent, private readonly location?: string) {}

    render(vnode: m.Vnode<any>): m.Children {
        if (this.location) {
            vnode.attrs.location = this.location;
        }
        return m(this.layout, vnode.attrs, m(this.page, vnode.attrs));
    }
}
