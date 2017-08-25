import Beam from "./Beam";
import GunSpecification from "./GunSpecification";
import * as game from "../../game";
import Shell from "./Shell";

export default class GunManager extends PIXI.utils.EventEmitter {

    static readonly BEAM = "beam";
    static readonly SHELL = "shell";

    private static createProjectile(type: string, from: PIXI.Point, to: PIXI.Point): game.Actor {
        switch (type) {
            case GunManager.BEAM:
                return new Beam(from, to);
            case GunManager.SHELL:
                return new Shell(from, to);
        }
    }

    constructor(private readonly guns: GunSpecification[]) {
        super();
    }

    getRadius(gun: number): number {
        return this.guns[gun].radius;
    }

    shoot(gun: number, from: PIXI.Point, to: PIXI.Point, container: PIXI.Container) {
        const projectile: game.Actor = GunManager.createProjectile(this.guns[gun].projectile, from, to);
        container.addChild(projectile);
        projectile.once(game.Event.DONE, () => this.emit(game.Event.DONE));
    }
}
