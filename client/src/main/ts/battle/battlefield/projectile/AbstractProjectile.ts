import * as druid from "pixi-druid";

export abstract class AbstractProjectile extends druid.AbstractActor {

    static readonly NEW_SHOT = "newShot";

    protected constructor(readonly shotsCount: number, private timeToLive: number = 0) {
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
