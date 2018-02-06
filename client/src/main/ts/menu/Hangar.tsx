import WebSocketClient from "../WebSocketClient";
import { MenuComponent, ShipData } from "../util";
import * as m from "mithril";

export default class Hangar extends MenuComponent {

    readonly ships = new Array<ShipData>(0);

    constructor(private readonly webSocketClient: WebSocketClient) {
        super(m);
    }

    view(): m.Children {
        return (
            <div>
                <div class="flex title">
                    <i class="text-title">Dissent [tech demo]</i>
                </div>
                <div class="container u-centered">
                    <h2><b>Hangar</b></h2>
                    {this.ships.map((s, i) => {
                        return (
                            <a href={`/mithril/#!/hangar/ship/${i}/`}>
                                <img src={`../img/${s.hull.texture.name}.png`} class="ship-icon" />
                            </a>
                        )
                    })}
                </div>
            </div>
        );
    }

    oninit() {
        this.webSocketClient.requestShips(s => {
            this.ships.length = 0;
            this.ships.push(...s);
            m.redraw();
        });
    }
};
