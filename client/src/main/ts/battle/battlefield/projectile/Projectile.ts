import * as druid from "pixi-druid";

export default abstract class Projectile extends druid.AbstractActor {

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
