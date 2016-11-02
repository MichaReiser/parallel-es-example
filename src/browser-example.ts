import {mandelbrot as transpiledParallelMandelbrot} from "./transpiled/mandelbrot";
import {parallelKnightTours as transpiledParallelKnightTour, syncKnightTours} from "./transpiled/knights-tour";
import {parallelKnightTours as dynamicKnightTour} from "./dynamic/knights-tour";
import {syncMandelbrot, createMandelOptions, parallelMandelbrot as dynamicParallelMandelbrot} from "./dynamic/mandelbrot";
import {syncMonteCarlo as simJsMonteCarlo, parallelMonteCarlo as transpiledParallelMonteCarlo} from "./transpiled/monte-carlo";
import {syncMonteCarlo as randomMonteCarlo, parallelMonteCarlo as dynamicParallelMonteCarlo, IProjectResult} from "./dynamic/monte-carlo";

/* tslint:disable:no-console */

let parallelMandelbrot = transpiledParallelMandelbrot;
let parallelKnightTour = transpiledParallelKnightTour;
let parallelMonteCarlo = transpiledParallelMonteCarlo;
let syncMonteCarlo = simJsMonteCarlo;

const mandelbrotCanvas = document.querySelector("#mandelbrot-canvas") as HTMLCanvasElement;
const mandelbrotContext = mandelbrotCanvas.getContext("2d");
const mandelbrotOptions = createMandelOptions(mandelbrotCanvas.width, mandelbrotCanvas.height, 10000);

const monteCarloOptions = {
    investmentAmount: 620000,
    numRuns: 10000,
    numYears: 15,
    performance: 0.0340000,
    projects: [
        {
            startYear: 0,
            totalAmount: 10000
        }, {
            startYear: 1,
            totalAmount: 10000
        }, {
            startYear: 2,
            totalAmount: 10000
        }, {
            startYear: 5,
            totalAmount: 50000
        }, {
            startYear: 15,
            totalAmount: 800000
        }
    ],
    seed: 10,
    volatility: 0.0896000
};
const monteCarloTable = document.querySelector("#montecarlo-table") as HTMLTableElement;

document.querySelector("#mandelbrot-run-parallel").addEventListener("click", function (event) {
    event.preventDefault();

    mandelbrotContext!.putImageData(mandelbrotContext!.createImageData(mandelbrotCanvas.width, mandelbrotCanvas.height), 0, 0);
    const valuesPerTask = parseInt((document.querySelector("#mandelbrot-values-per-task") as HTMLInputElement).value, 10);

    console.time("mandelbrot-parallel");
    parallelMandelbrot(mandelbrotOptions, { minValuesPerTask: valuesPerTask, maxValuesPerTask: valuesPerTask })
        .subscribe((lines, index, blockSize) => {
            for (let i = 0; i < lines.length; ++i) {
                mandelbrotContext!.putImageData(new ImageData(lines[i], mandelbrotCanvas.width, 1), 0, index * blockSize + i);
            }
        })
        .then(() => console.timeEnd("mandelbrot-parallel"), reason => console.error(reason));
});

document.querySelector("#mandelbrot-run-sync").addEventListener("click", function () {
    mandelbrotContext!.putImageData(mandelbrotContext!.createImageData(mandelbrotCanvas.width, mandelbrotCanvas.height), 0, 0);

    setTimeout(() => {
        console.time("mandelbrot-sync");
        syncMandelbrot(mandelbrotOptions, function (line, y) {
            mandelbrotContext!.putImageData(new ImageData(line, mandelbrotCanvas.width, 1), 0, y);
        });
        console.timeEnd("mandelbrot-sync");
    }, 0);

});

document.querySelector("#montecarlo-run-sync").addEventListener("click", function () {
    console.time("montecarlo-sync");
    const result = syncMonteCarlo(monteCarloOptions);
    console.timeEnd("montecarlo-sync");
    paintMonteCarloResult(result);
    console.log(result);
});

document.querySelector("#montecarlo-run-parallel").addEventListener("click", function () {
    console.time("montecarlo-parallel");
    parallelMonteCarlo(monteCarloOptions).then((result) => {
        console.timeEnd("montecarlo-parallel");
        paintMonteCarloResult(result);
        console.log(result);
    });
});

function paintMonteCarloResult(results: IProjectResult[]) {
    while (monteCarloTable.rows.length > 1) {
        monteCarloTable.deleteRow(1);
    }

    for (const result of results) {
        const row = monteCarloTable.insertRow();
        row.insertCell().innerText = result.project.startYear.toLocaleString();
        row.insertCell().innerText = result.project.totalAmount.toLocaleString();

        for (const groupName of ["green", "yellow", "gray", "red"]) {
            const group = result.groups.find(g => g.name === groupName);
            row.insertCell().innerText = group ? (group.percentage * 100).toFixed(2) : "-";
        }
    }
}

const knightBoardResult = document.querySelector("#knight-board-result") as HTMLParagraphElement;

document.querySelector("#knight-run-sync").addEventListener("click", function () {
    const boardSize = parseInt((document.querySelector("#knight-board-size")  as HTMLInputElement).value, 10);
    knightBoardResult.innerText = "Calculating...";

    setTimeout(() => {
        console.time("knight-run-sync");
        const solutions = syncKnightTours({ x: 0, y: 0}, boardSize);
        console.timeEnd("knight-run-sync");

        knightBoardResult.innerText = `Found ${solutions} solutions for ${boardSize}x${boardSize} board`;
    }, 0);
});

document.querySelector("#knight-run-parallel").addEventListener("click", function () {
    const boardSize = parseInt((document.querySelector("#knight-board-size")  as HTMLInputElement).value, 10);
    knightBoardResult.innerText = "Calculating...";

    console.time("knight-run-parallel");
    parallelKnightTour({ x: 0, y: 0}, boardSize)
        .then(solutions => {
            console.timeEnd("knight-run-parallel");
            knightBoardResult.innerText = `Found ${solutions} solutions for ${boardSize}x${boardSize} board`;
        }, (reason) => console.log(reason));
});

function onTranspiledChanged(transpiled: boolean) {
    if (transpiled) {
        parallelMandelbrot = transpiledParallelMandelbrot;
        parallelKnightTour = transpiledParallelKnightTour;
        syncMonteCarlo = simJsMonteCarlo;
        parallelMonteCarlo = transpiledParallelMonteCarlo;
    } else {
        parallelMandelbrot = dynamicParallelMandelbrot;
        parallelKnightTour = dynamicKnightTour;
        syncMonteCarlo = randomMonteCarlo;
        parallelMonteCarlo = dynamicParallelMonteCarlo;
    }
}

document.querySelector("#transpiled-parallel")!.addEventListener("change", function (event: Event) {
    const transpiled = (event.currentTarget as HTMLInputElement).checked;
    onTranspiledChanged(transpiled);
});

onTranspiledChanged(true);
