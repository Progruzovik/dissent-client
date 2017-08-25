import Beam from "./Beam";
import GunSpecification from "./GunSpecification";
import Shell from "./Shell";
import * as game from "../../game";
import Unit from "../unit/Unit";

export default class GunManager extends PIXI.utils.EventEmitter {

    static readonly BEAM = "beam";
    static readonly SHELL = "shell";

    private static createProjectile(specification: GunSpecification, to: PIXI.Point, from: PIXI.Point): game.Actor {
        switch (specification.projectile) {
            case GunManager.BEAM:
                return new Beam(to, from);
            case GunManager.SHELL:
                return new Shell(specification.shotDelay, to, from);
        }
    }

    constructor(private readonly guns: GunSpecification[]) {
        super();
    }

    getRadius(gun: number): number {
        return this.guns[gun].radius;
    }

    shoot(gun: number, to: PIXI.Point, from: PIXI.Point, shotNumber: number = 1) {
        const projectile: game.Actor = GunManager.createProjectile(this.guns[gun], to, from);
        this.emit(Unit.SHOT, projectile);
        if (shotNumber < this.guns[gun].shotsCount) {
            projectile.once(Unit.SHOT, () => this.shoot(gun, to, from, shotNumber + 1));
        } else {
            projectile.once(game.Event.DONE, () => this.emit(game.Event.DONE));
        }
    }
}
