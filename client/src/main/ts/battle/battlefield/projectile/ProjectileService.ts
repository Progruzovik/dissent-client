import { Shell } from "./Shell";
import { Beam } from "./Beam";
import { AbstractProjectile } from "./AbstractProjectile";
import { Gun, GunType } from "../../../model/util";
import * as druid from "pixi-druid";
import * as PIXI from "pixi.js";

export class ProjectileService extends PIXI.utils.EventEmitter {

    private static createProjectile(gun: Gun, from: druid.Point, to: druid.Point): AbstractProjectile {
        switch (gun.typeName) {
            case GunType.Artillery: return new Shell(15, 2, 14, 4, from, to);
            case GunType.Beam: return new Beam(from, to);
            case GunType.Shell: return new Shell(3, 4, 7, 2, from, to);
        }
    }

    shoot(gun: Gun, from: druid.Point, to: druid.Point, shotNumber: number = 1) {
        const projectile: AbstractProjectile = ProjectileService.createProjectile(gun, from, to);
        this.emit(AbstractProjectile.NEW_SHOT, projectile);
        if (shotNumber < projectile.shotsCount) {
            projectile.once(AbstractProjectile.NEW_SHOT, () => this.shoot(gun, from, to, shotNumber + 1));
        } else {
            projectile.once(druid.Event.DONE, () => this.emit(druid.Event.DONE));
        }
    }
}
