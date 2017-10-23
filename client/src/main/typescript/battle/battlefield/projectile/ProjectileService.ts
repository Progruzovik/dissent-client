import Beam from "./Beam";
import Projectile from "./Projectile";
import Shell from "./Shell";
import { ActionType, Cell, Gun } from "../../util";
import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class ProjectileService extends PIXI.utils.EventEmitter {

    private static readonly BEAM = "beam";
    private static readonly SHELL = "shell";

    private static createProjectile(gun: Gun, to: Cell, from: Cell): Projectile {
        switch (gun.gunTypeName) {
            case ProjectileService.BEAM: return new Beam(to, from);
            case ProjectileService.SHELL: return new Shell(to, from);
        }
    }

    shoot(gun: Gun, to: Cell, from: Cell, shotNumber: number = 1) {
        const projectile: Projectile = ProjectileService.createProjectile(gun, to, from);
        this.emit(ActionType.Shot, projectile);
        if (shotNumber < projectile.shotsCount) {
            projectile.once(ActionType.Shot, () => this.shoot(gun, to, from, shotNumber + 1));
        } else {
            projectile.once(game.Event.DONE, () => this.emit(game.Event.DONE));
        }
    }
}