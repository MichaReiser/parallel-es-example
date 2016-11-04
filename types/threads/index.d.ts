declare module "threads" {
    export class Worker {
        initWorker(): void;
        run(file: string, importScripts: string[]): Worker;
        run(method: Function, importScripts: string[]): Worker;
        send(param: any, transferable?: any): Worker;
        kill(): Worker;
        promise(): PromiseLike<any>;
    }

    export function spawn(): Worker;

    export interface Done {
        (result: any): void;
        transfer(result: any, transferables: any[]): void;
    }

    export class Pool {
        run(file: string): Job;
        run(method: (input: any, done: Done, progress: (progress: any) => void) => void, dependencies?: { [localName: string]: string } | string[]): Pool;

        on(event: "finished", handler: () => void): Pool;
        on(event: "done", handler: (job: Job, result: any) => void): Pool;
        on(event: "error", handler: (job: Job, error: any) => void): Pool;
        on(event: "progress", handler: (job: Job, progress: any) => void): Pool;
        send(value: any, transferables?: any): Job;
        killAll(): void;
        spawn(count: number): Worker[];
    }

    export class Job {
        on(event: "message", handler: (response: any) => void): Job;
        on(event: "error", handler: (error: any) => void): Job;
        on(event: "progress", handler: (progress: any) => void): Job;
        on(event: "exit", handler: () => void): Job;
        on(event: "done", handler: (result: any, input: any) => void): Job;
        run(method: (input: any, done: (result: any) => void) => void, dependencies?: { [localName: string]: string }): Job;
        send(arg: any): Job;
        executeOn(thread: Worker): Job;
        promise(): PromiseLike<any>;
    }
}
