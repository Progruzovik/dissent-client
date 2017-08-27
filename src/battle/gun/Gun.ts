export default class Gun {

    constructor(readonly name: string, readonly radius: number, readonly projectileType: string,
                readonly shotsCount: number = 1, readonly shotDelay: number = 0) { }
}
