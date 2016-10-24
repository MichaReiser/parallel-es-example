import parallel, {IParallelOptions} from "parallel-es";
import {IMandelbrotOptions} from "../dynamic/mandelbrot";

interface IComplexNumber {
    i: number;
    real: number;
}

export function mandelbrot({ imageWidth, imageHeight, iterations }: IMandelbrotOptions, options?: IParallelOptions) {
    // X axis shows real numbers, y axis imaginary
    const min = { i: -1.2, real: -2.0 };
    const max = { i: 0, real: 1.0 };
    max.i = min.i + (max.real - min.real) * imageHeight / imageWidth;

    const scalingFactor = {
        i: (max.i - min.i) / (imageHeight - 1),
        real: (max.real - min.real) / (imageWidth - 1)
    };

    function calculateZ(c: IComplexNumber): number {
        const z = { i: c.i, real: c.real };
        let n = 0;

        for (; n < iterations; ++n) {
            if (z.real * z.real + z.i * z.i > 4) {
                break;
            }

            // z ** 2 + c
            const zI = z.i;
            z.i = 2 * z.real * z.i + c.i;
            z.real = z.real * z.real - zI * zI + c.real;
        }

        return n;
    }

    return parallel
        .range(0, imageHeight, 1, options)
        .map(y => {
            const line = new Uint8ClampedArray(imageWidth * 4);
            const cI = max.i - y * scalingFactor.i;

            for (let x = 0; x < imageWidth; ++x) {
                const c = {
                    i: cI,
                    real: min.real + x * scalingFactor.real
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
        });
}
