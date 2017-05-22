import {hamsters, HamsterClosure} from "hamsters.js";
import * as _ from "lodash";

export interface IComplexNumber {
    i: number;
    real: number;
}

export interface IMandelbrotOptions {
    imageHeight: number;
    imageWidth: number;
    iterations: number;
    max: IComplexNumber;
    min: IComplexNumber;
    scalingFactor: IComplexNumber;
}
function computeMandelbrotLine (this: HamsterClosure<{ array: number[], options: IMandelbrotOptions }, Uint8ClampedArray>) {
    const options = this.params.options;
    // Function inline is up to 30% faster than if the function is not inline
    // https://jsperf.com/mandelbrot-env3 https://jsperf.com/mandelbrot-env4
    function calculateZ(c: IComplexNumber): number {
        const z = { i: c.i, real: c.real };
        let n = 0;

        for (; n < options.iterations; ++n) {
            if (z.real ** 2 + z.i ** 2 > 4) {
                break;
            }

            // z ** 2 + c
            const zI = z.i;
            z.i = 2 * z.real * z.i + c.i;
            z.real = z.real ** 2 - zI ** 2 + c.real;
        }

        return n;
    }

    const array = this.params.array;

    for (let i = 0; i < array.length; ++i) {
        const y = array[i];
        const line = new Uint8ClampedArray(options.imageWidth * 4);
        const cI = options.max.i - y * options.scalingFactor.i;

        for (let x = 0; x < options.imageWidth; ++x) {
            const c = {
                i: cI,
                real: options.min.real + x * options.scalingFactor.real
            };

            const n = calculateZ(c);
            const base = x * 4;
            /* tslint:disable:no-bitwise */
            line[base] = n & 0xFF;
            line[base + 1] = n & 0xFF00;
            line[base + 2] = n & 0xFF0000;
            line[base + 3] = 255;
        }
        this.rtn.data.push(line);
    }
}

export function mandelbrot(options: IMandelbrotOptions): Promise<any> {
    let resolve: (result: Uint8ClampedArray[]) => void;
    let reject: (error: any) => void;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    const range = _.range(options.imageHeight);
    const params = {
        array: range,
        options
    };

    hamsters.run(params, computeMandelbrotLine, result => resolve(result), hamsters.maxThreads, true);
    return promise;
}
