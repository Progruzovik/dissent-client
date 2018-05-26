import { Status } from "../model/util";
import { StatusService } from "./service/StatusService";
import * as m from "mithril";

export interface HyperNode {
    readonly attrs?: any, readonly children?: string | m.Children;
}

export class DissentResolver implements m.RouteResolver {

    constructor(private readonly statusService: StatusService, private readonly page: m.ClassComponent) {}

    onmatch(args: any, requestedPath: string) {
        if (!this.statusService.currentStatus) {
        }
        if (this.statusService.currentStatus == Status.Queued && requestedPath != "/queue/") {
            m.route.set("/queue/");
            return;
        }
        if (this.statusService.currentStatus == Status.InBattle && requestedPath != "/battle/") {
            m.route.set("/battle/");
            return;
        }
        if (this.statusService.currentStatus != Status.InBattle && requestedPath == "/battle/") {
            m.route.set("/hangar/");
            return;
        }
        return this.page;
    }
}

export class PageWrapper extends DissentResolver {

    constructor(statusService: StatusService, private readonly layout: m.ClassComponent,
                page: m.ClassComponent, private readonly location: string) {
        super(statusService, page);
    }

    render(vnode: m.CVnode<any>): m.Children {
        vnode.attrs.location = this.location;
        return m(this.layout, vnode.attrs, vnode);
    }
}
