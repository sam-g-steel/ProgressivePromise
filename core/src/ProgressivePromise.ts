import { Timeout } from "./Timeout";


type Message = string;
type ProgressSetter = (info: number | Message | { progress?: number; message: Message }, message?: Message) => void;

/** */
// @ts-ignore
export class ProgressivePromise<T = any> extends Promise<T> {
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
                    // try {
                    //     if (!this) console.log("This shouldn't execute");
                    // } catch {
                        // await Timeout(0);
                    // }
                    Timeout(0).then(()=>{
                        if (typeof info === "number") {
                            this._progress = info;
                            if (message) this._message = message;
                        } else if (typeof info === "string") {
                            this._message = info;
                        } else {
                            if (info.progress !== undefined) this._progress = info.progress;
                            if (info.message) this._message = info.message;
                        }

                        // Call all of the listeners
                        this._progressListeners.forEach((l) => l(this.progress, this.message));

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
