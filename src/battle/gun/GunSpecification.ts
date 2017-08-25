export default class GunSpecification {

    constructor(readonly radius: number, readonly projectile: string,
                readonly shotsCount: number = 1, readonly shotDelay: number = 0) { }
}
