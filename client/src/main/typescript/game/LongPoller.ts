import * as PIXI from "pixi.js";

export class LongPoller<T> extends PIXI.utils.EventEmitter {

    public static NEXT_RESPONSE = "nextResponse";

    private readonly remainingResponses = new Array<T>(0);

    private isProcessingResponse = false;
    private isRunning = true;

    constructor(private nextResponseNumber: number,
                private readonly getResponse:
                    (number: number, onSuccess: (response: T) => void, onError: () => void) => void) {
        super();
        this.waitForNextResponse();
    }

    public finishCurrentResponseProcessing() {
        if (this.remainingResponses.length == 0) {
            this.isProcessingResponse = false;
        } else {
            this.startNextResponseProcessing();
        }
    }

    public stop() {
        this.isRunning = false;
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
