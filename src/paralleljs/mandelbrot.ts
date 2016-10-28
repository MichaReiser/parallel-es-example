const Parallel = require("paralleljs");
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

export function computeMandelbrotLine(y: number, options: IMandelbrotOptions): Uint8ClampedArray {
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
    return line;
}

declare const global: { env: IMandelbrotOptions};

export function parallelJSMandelbrot(mandelbrotOptions: IMandelbrotOptions) {
    const lines = _.range(mandelbrotOptions.imageHeight);
    return new Parallel(lines, { env: mandelbrotOptions }).require(computeMandelbrotLine)
        .map(function (line: number): Uint8ClampedArray {
            return computeMandelbrotLine(line, global.env);
        });
}
