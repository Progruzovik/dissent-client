import * as game from "../../../game";

export default abstract class Projectile extends game.AbstractActor {

    static readonly NEW_SHOT = "newShot";

    constructor(readonly shotsCount: number, private timeToLive: number = 0) {
        super();
    }

    get isTimeOver(): boolean {
        return this.timeToLive <= 0;
    }
    
    protected update(deltaTime: number) {
        this.timeToLive -= deltaTime;
    }

    protected resetTimer(timeToLive: number) {
        this.timeToLive = timeToLive;
    }
}
