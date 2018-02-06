import { MenuComponent } from "../util";
import * as m from "mithril";
import { l } from "../localizer";

export default class Layout extends MenuComponent {

    constructor() {
        super(m);
    }

    view(vnode: m.CVnode): m.Children {
        return (
            <div class="page">
                <div class="flex title">
                    <i class="text-title">Dissent [tech demo]</i>
                </div>
                {vnode.children}
            </div>
        );
    }
}
