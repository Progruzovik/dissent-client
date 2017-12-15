import Shell from "./Shell";
import Beam from "./Beam";
import Projectile from "./Projectile";
import { Gun, GunType } from "../../util";
import * as game from "../../../game";
import * as PIXI from "pixi.js";

export default class ProjectileService extends PIXI.utils.EventEmitter {

    private static createProjectile(gun: Gun, from: game.Point, to: game.Point): Projectile {
        switch (gun.typeName) {
            case GunType.Artillery: return new Shell(15, 2, 14, 4, from, to);
            case GunType.Beam: return new Beam(from, to);
            case GunType.Shell: return new Shell(3, 4, 7, 2, from, to);
        }
    }

    shoot(gun: Gun, from: game.Point, to: game.Point, shotNumber: number = 1) {
        const projectile: Projectile = ProjectileService.createProjectile(gun, from, to);
        this.emit(Projectile.NEW_SHOT, projectile);
        if (shotNumber < projectile.shotsCount) {
            projectile.once(Projectile.NEW_SHOT, () => this.shoot(gun, from, to, shotNumber + 1));
        } else {
            projectile.once(game.Event.DONE, () => this.emit(game.Event.DONE));
        }
    }
}
