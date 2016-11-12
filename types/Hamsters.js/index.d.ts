declare module "Hamsters.js" {

    type DataType = "Int8" | "Int16" | "Int32" | "Uint8" | "Uint8Clamped" | "Uint16" | "Uint32" | "Float32" | "Float64";

    export interface Params<T> {
        array: T[];
        [name: string]: any;
    }

    export interface HamsterClosure<Par, R> {
        rtn: { data: R[] };
        params: Par;
    }

    export interface Hamsters {
        cache: boolean;
        maxThreads: number;
        persistence: boolean;
        run<T, TPar extends Params<T>, R>(params: TPar, workerFunction: (this: HamsterClosure<TPar, R>) => void, callback: (output: any) => void, threads: number, aggregate?: boolean, dataType?: DataType | null, memoize?: boolean, sort?: "asc" | "desc" | "ascAlpha" | "descAlpha"): void;
    }

    export interface Tools {
        aggregate<T>(input: T[], dataType: DataType): T;
        split<T>(input: T[], n: number): T[][];
        loop<T, R>(options: LoopOptions<T, R>, callback: (output: R[]) => void): void;
        parseJson(input: string, callback: (json: any) => void): void;
        stringifyJson(input: any, callback: (stringified: string) => void): void;
    }

    export interface LoopOptions<T, R> {
        operator: (element: T) => R;
        array: T[];
        startIndex?: number;
        limit?: number;
        dataType?: DataType;
        incrementBy?: number;
        threads?: number;
    }

    export const hamsters: Hamsters;
}
