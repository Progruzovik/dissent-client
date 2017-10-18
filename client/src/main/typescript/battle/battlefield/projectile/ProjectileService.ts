import Beam from "./Beam";
import Shell from "./Shell";
import { Cell, Gun } from "../../request";
import { ActionType } from "../../util";
import * as game from "../../../game";

export default class ProjectileService extends PIXI.utils.EventEmitter {

    static readonly BEAM = "beam";
    static readonly SHELL = "shell";

    private static createProjectile(specification: Gun, to: Cell, from: Cell): game.Actor {
        switch (specification.gunTypeName) {
            case ProjectileService.BEAM:
                return new Beam(to, from);
            case ProjectileService.SHELL:
                return new Shell(specification.shotDelay, to, from);
        }
    }

    shoot(gun: Gun, to: Cell, from: Cell, shotNumber: number = 1) {
        const projectile: game.Actor = ProjectileService.createProjectile(gun, to, from);
        this.emit(ActionType[ActionType.Shot], projectile);
        if (shotNumber < gun.shotsCount) {
            projectile.once(ActionType[ActionType.Shot],
                () => this.shoot(gun, to, from, shotNumber + 1));
        } else {
            projectile.once(game.Event.DONE, () => this.emit(game.Event.DONE));
        }
    }
}
