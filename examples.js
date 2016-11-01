webpackJsonp([1],{

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__transpiled_mandelbrot__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transpiled_knights_tour__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dynamic_knights_tour__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dynamic_mandelbrot__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dynamic_monte_carlo__ = __webpack_require__(5);






/* tslint:disable:no-console */
var parallelMandelbrot = __WEBPACK_IMPORTED_MODULE_0__transpiled_mandelbrot__["a" /* mandelbrot */];
var parallelKnightTour = __WEBPACK_IMPORTED_MODULE_1__transpiled_knights_tour__["a" /* parallelKnightTours */];
var parallelMonteCarlo = __WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["a" /* parallelMonteCarlo */];
var syncMonteCarlo = __WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["b" /* syncMonteCarlo */];
var mandelbrotCanvas = document.querySelector("#mandelbrot-canvas");
var mandelbrotContext = mandelbrotCanvas.getContext("2d");
var mandelbrotOptions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__dynamic_mandelbrot__["a" /* createMandelOptions */])(mandelbrotCanvas.width, mandelbrotCanvas.height, 10000);
var monteCarloOptions = {
    investmentAmount: 620000,
    numRuns: 10000,
    numYears: 15,
    performance: 0.0340000,
    projects: [{
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
    }],
    seed: 10,
    volatility: 0.0896000
};
var monteCarloTable = document.querySelector("#montecarlo-table");
document.querySelector("#mandelbrot-run-parallel").addEventListener("click", function (event) {
    event.preventDefault();
    mandelbrotContext.putImageData(mandelbrotContext.createImageData(mandelbrotCanvas.width, mandelbrotCanvas.height), 0, 0);
    var maxValuesPerTask = parseInt(document.querySelector("#mandelbrot-values-per-task").value, 10);
    console.time("mandelbrot-parallel");
    parallelMandelbrot(mandelbrotOptions, { maxValuesPerTask: maxValuesPerTask }).subscribe(function (lines, index, blockSize) {
        for (var i = 0; i < lines.length; ++i) {
            mandelbrotContext.putImageData(new ImageData(lines[i], mandelbrotCanvas.width, 1), 0, index * blockSize + i);
        }
    }).then(function () {
        return console.timeEnd("mandelbrot-parallel");
    }, function (reason) {
        return console.error(reason);
    });
});
document.querySelector("#mandelbrot-run-sync").addEventListener("click", function () {
    mandelbrotContext.putImageData(mandelbrotContext.createImageData(mandelbrotCanvas.width, mandelbrotCanvas.height), 0, 0);
    setTimeout(function () {
        console.time("mandelbrot-sync");
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__dynamic_mandelbrot__["b" /* syncMandelbrot */])(mandelbrotOptions, function (line, y) {
            mandelbrotContext.putImageData(new ImageData(line, mandelbrotCanvas.width, 1), 0, y);
        });
        console.timeEnd("mandelbrot-sync");
    }, 0);
});
document.querySelector("#montecarlo-run-sync").addEventListener("click", function () {
    console.time("montecarlo-sync");
    var result = syncMonteCarlo(monteCarloOptions);
    console.timeEnd("montecarlo-sync");
    paintMonteCarloResult(result);
    console.log(result);
});
document.querySelector("#montecarlo-run-parallel").addEventListener("click", function () {
    console.time("montecarlo-parallel");
    parallelMonteCarlo(monteCarloOptions).then(function (result) {
        console.timeEnd("montecarlo-parallel");
        paintMonteCarloResult(result);
        console.log(result);
    });
});
function paintMonteCarloResult(results) {
    while (monteCarloTable.rows.length > 1) {
        monteCarloTable.deleteRow(1);
    }
    for (var _iterator = results, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var result = _ref;

        var row = monteCarloTable.insertRow();
        row.insertCell().innerText = result.project.startYear.toLocaleString();
        row.insertCell().innerText = result.project.totalAmount.toLocaleString();
        var _arr = ["green", "yellow", "gray", "red"];

        var _loop = function _loop() {
            var groupName = _arr[_i2];
            var group = result.groups.find(function (g) {
                return g.name === groupName;
            });
            row.insertCell().innerText = group ? (group.percentage * 100).toFixed(2) : "-";
        };

        for (var _i2 = 0; _i2 < _arr.length; _i2++) {
            _loop();
        }
    }
}
var knightBoardResult = document.querySelector("#knight-board-result");
document.querySelector("#knight-run-sync").addEventListener("click", function () {
    var boardSize = parseInt(document.querySelector("#knight-board-size").value, 10);
    knightBoardResult.innerText = "Calculating...";
    setTimeout(function () {
        console.time("knight-run-sync");
        var solutions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__transpiled_knights_tour__["b" /* syncKnightTours */])({ x: 0, y: 0 }, boardSize);
        console.timeEnd("knight-run-sync");
        knightBoardResult.innerText = "Found " + solutions + " solutions for " + boardSize + "x" + boardSize + " board";
    }, 0);
});
document.querySelector("#knight-run-parallel").addEventListener("click", function () {
    var boardSize = parseInt(document.querySelector("#knight-board-size").value, 10);
    knightBoardResult.innerText = "Calculating...";
    console.time("knight-run-parallel");
    parallelKnightTour({ x: 0, y: 0 }, boardSize).then(function (solutions) {
        console.timeEnd("knight-run-parallel");
        knightBoardResult.innerText = "Found " + solutions + " solutions for " + boardSize + "x" + boardSize + " board";
    }, function (reason) {
        return console.log(reason);
    });
});
function onTranspiledChanged(transpiled) {
    if (transpiled) {
        parallelMandelbrot = __WEBPACK_IMPORTED_MODULE_0__transpiled_mandelbrot__["a" /* mandelbrot */];
        parallelKnightTour = __WEBPACK_IMPORTED_MODULE_1__transpiled_knights_tour__["a" /* parallelKnightTours */];
        syncMonteCarlo = __WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["b" /* syncMonteCarlo */];
        parallelMonteCarlo = __WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["a" /* parallelMonteCarlo */];
    } else {
        parallelMandelbrot = __WEBPACK_IMPORTED_MODULE_3__dynamic_mandelbrot__["c" /* parallelMandelbrot */];
        parallelKnightTour = __WEBPACK_IMPORTED_MODULE_2__dynamic_knights_tour__["a" /* parallelKnightTours */];
        syncMonteCarlo = __WEBPACK_IMPORTED_MODULE_5__dynamic_monte_carlo__["a" /* syncMonteCarlo */];
        parallelMonteCarlo = __WEBPACK_IMPORTED_MODULE_5__dynamic_monte_carlo__["b" /* parallelMonteCarlo */];
    }
}
document.querySelector("#transpiled-parallel").addEventListener("change", function (event) {
    var transpiled = event.currentTarget.checked;
    onTranspiledChanged(transpiled);
});
onTranspiledChanged(true);

/***/ }

},[18]);
//# sourceMappingURL=examples.js.map