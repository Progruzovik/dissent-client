import WebSocketClient from "./WebSocketClient";
import { ClassComponent } from "./util";
import * as m from "mithril";
import { ShipData } from "./battle/util";

export default class Hangar extends ClassComponent {

    private readonly ships = new Array<ShipData>(0);

    constructor(private readonly webSocketClient: WebSocketClient) {
        super(m);
    }

    view(): m.Children {
        return (
            <div>
                <div class="title">
                    <i class="title-text">Dissent [tech demo]</i>
                </div>
                <div class="container u-centered">
                    <h2><b>Hangar</b></h2>
                    {this.ships.map(s => {
                        return <img src={`../img/${s.hull.texture.name}.png`} class="ship-icon" />
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
