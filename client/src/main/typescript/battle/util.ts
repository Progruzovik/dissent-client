export const MOVE: string = "move";
export const SHOT: string = "shot";
export const NEXT_TURN: string = "nextTurn";
export const FINISH: string = "finish";

export enum ActionType {
    Move, Shot, NextTurn, Finish
}

export class Action {
    constructor(readonly number: number, readonly type: ActionType) {}
}
