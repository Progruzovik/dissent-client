import * as PIXI from "pixi.js";

export class LongPoller<T> extends PIXI.utils.EventEmitter {

    public static NEXT_RESPONSE = "nextResponse";

    private readonly remainingResponses = new Array<T>(0);

    private isProcessingResponse = false;

    constructor(private readonly getResponse:
                    (number: number, callback: (response: T) => void, onError: () => void) => void,
                private _isRunning = false, private nextResponseNumber: number = 0) {
        super();
        this.waitForNextResponse();
    }

    public get isRunning(): boolean {
        return this._isRunning;
    }

    public set isRunning(value: boolean) {
        this._isRunning = value;
        this.waitForNextResponse();
    }

    public finishCurrentResponseProcessing() {
        if (this.remainingResponses.length == 0) {
            this.isProcessingResponse = false;
        } else {
            this.startNextResponseProcessing();
        }
    }

    private startNextResponseProcessing() {
        this.isProcessingResponse = true;
        this.emit(LongPoller.NEXT_RESPONSE, this.remainingResponses.shift());
    }

    private waitForNextResponse() {
        if (this.isRunning) {
            this.getResponse(this.nextResponseNumber, response => {
                this.nextResponseNumber++;
                this.remainingResponses.push(response);
                if (!this.isProcessingResponse) {
                    this.startNextResponseProcessing();
                }
                this.waitForNextResponse();
            }, () => this.waitForNextResponse());
        }
    }
}
