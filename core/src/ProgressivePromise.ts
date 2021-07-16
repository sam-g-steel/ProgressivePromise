import { Timeout } from "./Timeout";


type Message = string;
type ProgressSetter = (info: number | Message | { progress?: number; message: Message }, message?: Message) => void;

/** */
// @ts-ignore
export class ProgressivePromise<T = any> extends Promise<T> {
    private _lastUpdate: number = 0;
    private _key: string;
    private _progress: number;
    private _message?: Message;

    private _progressListeners: Array<(progress: number, message: Message) => void> = [];

    get key() {
        return this._key;
    }
    get progress() {
        return this._progress;
    }
    get message() {
        return this._message;
    }

    /** */
    constructor(
        executor: (
            resolve: (value?: T | PromiseLike<T>) => void,
            reject: (reason?: any) => void,
            progress: ProgressSetter
        ) => void,
        key?: string
    ) {
        super((resolve, reject) => {
            executor(
                resolve,
                reject,
                (info: number | Message | { progress?: number; message: Message }, message?: Message) => {
                    const requestTime = Date.now();
                    Timeout(0).then(()=>{
                        const isNewer = requestTime > this._lastUpdate;
                        if (typeof info === "number") {
                            // Only update progress if the info is newer
                            if(isNewer)this._progress = info;
                            // Only update progress if the info is newer or the promise's message is empty
                            if (message && (isNewer || !this._message))if (message) this._message = message;
                            
                        } else if (typeof info === "string" ) {
                            // Only update progress if the info is newer or the promise's message is empty
                            if(isNewer || !this._message) this._message = info;
                        } else {
                            // Only update progress if the info is newer
                            if (info.progress !== undefined && isNewer) this._progress = info.progress;
                            // Only update progress if the info is newer or the promise's message is empty
                            if (info.message && (isNewer || !this._message)) this._message = info.message;
                        }

                        // Call all of the listeners
                        this._progressListeners.forEach((l) => l(this.progress, this.message));
                        if(isNewer) this._lastUpdate = requestTime;
                    })
                    // try {
                    // } catch (ex) {}
                }
            );
        });

        this._key = key;
        this._progress = 0;
    }

    onProgress(onProgress: (progress: number, message: Message) => void) {
        this._progressListeners.push(onProgress);
        return this;
    }

    removeProgressListener(onProgress: (progress: number, message: Message) => void) {
        const index = this._progressListeners.indexOf(onProgress);

        if (index >= 0) this._progressListeners.splice(index, 1);
    }

    // private setProgress: ProgressSetter = ;
}
