import Beam from "./Beam";
import Gun from "./Gun";
import Shell from "./Shell";
import Unit from "../unit/Unit";
import * as game from "../../game";

export default class ProjectileService extends PIXI.utils.EventEmitter {

    static readonly BEAM = "beam";
    static readonly SHELL = "shell";

    private static createProjectile(specification: Gun, to: PIXI.Point, from: PIXI.Point): game.Actor {
        switch (specification.projectileType) {
            case ProjectileService.BEAM:
                return new Beam(to, from);
            case ProjectileService.SHELL:
                return new Shell(specification.shotDelay, to, from);
        }
    }

    shoot(gun: Gun, to: PIXI.Point, from: PIXI.Point, shotNumber: number = 1) {
        const projectile: game.Actor = ProjectileService.createProjectile(gun, to, from);
        this.emit(Unit.SHOT, projectile);
        if (shotNumber < gun.shotsCount) {
            projectile.once(Unit.SHOT, () => this.shoot(gun, to, from, shotNumber + 1));
        } else {
            projectile.once(game.Event.DONE, () => this.emit(game.Event.DONE));
        }
    }
}
