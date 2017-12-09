import Shell from "./Shell";
import Beam from "./Beam";
import Projectile from "./Projectile";
import { Cell, Gun, GunType } from "../../util";
import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class ProjectileService extends PIXI.utils.EventEmitter {

    private static createProjectile(gun: Gun, to: Cell, from: Cell): Projectile {
        switch (gun.typeName) {
            case GunType.Artillery: return new Shell(15, 2, 14, 4, to, from);
            case GunType.Beam: return new Beam(to, from);
            case GunType.Shell: return new Shell(3, 4, 7, 2, to, from);
        }
    }

    shoot(gun: Gun, to: Cell, from: Cell, shotNumber: number = 1) {
        const projectile: Projectile = ProjectileService.createProjectile(gun, to, from);
        this.emit(Projectile.NEW_SHOT, projectile);
        if (shotNumber < projectile.shotsCount) {
            projectile.once(Projectile.NEW_SHOT, () => this.shoot(gun, to, from, shotNumber + 1));
        } else {
            projectile.once(game.Event.DONE, () => this.emit(game.Event.DONE));
        }
    }
}
