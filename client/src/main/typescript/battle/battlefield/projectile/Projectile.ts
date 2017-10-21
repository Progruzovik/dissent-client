import * as game from "../../../game";

export default abstract class Projectile extends game.Actor {

    constructor(readonly shotsCount: number) {
        super();
    }
}
