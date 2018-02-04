import * as m from "mithril";

export abstract class ClassComponent implements m.ClassComponent {

    constructor(m: m.Hyperscript) {}

    abstract view(): m.Children;
}
