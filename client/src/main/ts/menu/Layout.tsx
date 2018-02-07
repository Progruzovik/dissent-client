import Controls from "./Controls";
import { MenuComponent } from "./util";
import * as mithril from "mithril";

export default class Layout extends MenuComponent {

    constructor(private readonly controls: Controls) {
        super(mithril);
    }

    view(vnode: mithril.CVnode): mithril.Children {
        return (
            <div class="page">
                <div class="flex title">
                    <i class="text-title">Dissent [tech demo]</i>
                </div>
                <div class="page flex flex-column flex-space">
                    {vnode.children}
                    {this.controls.view()}
                </div>
            </div>
        );
    }
}
