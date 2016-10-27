webpackJsonp([1],{

/***/ 13:
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ./src/browser-example.ts ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__transpiled_mandelbrot__ = __webpack_require__(/*! ./transpiled/mandelbrot */ 5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transpiled_knights_tour__ = __webpack_require__(/*! ./transpiled/knights-tour */ 4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dynamic_knights_tour__ = __webpack_require__(/*! ./dynamic/knights-tour */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dynamic_mandelbrot__ = __webpack_require__(/*! ./dynamic/mandelbrot */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__ = __webpack_require__(/*! ./transpiled/monte-carlo */ 6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dynamic_monte_carlo__ = __webpack_require__(/*! ./dynamic/monte-carlo */ 3);






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

},[13]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYnJvd3Nlci1leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWtGO0FBQzRCO0FBQy9CO0FBQzBDO0FBQ0s7QUFDVztBQUUxRztBQUUvQixJQUFzQixxQkFBZ0M7QUFDdEQsSUFBc0IscUJBQWdDO0FBQ3RELElBQXNCLHFCQUFnQztBQUN0RCxJQUFrQixpQkFBbUI7QUFFckMsSUFBc0IsbUJBQVcsU0FBYyxjQUE0QztBQUMzRixJQUF1QixvQkFBbUIsaUJBQVcsV0FBTztBQUM1RCxJQUF1QixvQkFBc0Isd0dBQWlCLGlCQUFNLE9BQWtCLGlCQUFPLFFBQVM7QUFFdEcsSUFBdUI7QUFDSCxzQkFBUTtBQUNqQixhQUFPO0FBQ04sY0FBSTtBQUNELGlCQUFXO0FBQ2Q7QUFFUyxtQkFBRztBQUNELHFCQUNkO0FBSEQsS0FETTtBQUtPLG1CQUFHO0FBQ0QscUJBQ2Q7QUFIRTtBQUlVLG1CQUFHO0FBQ0QscUJBQ2Q7QUFIRTtBQUlVLG1CQUFHO0FBQ0QscUJBQ2Q7QUFIRTtBQUlVLG1CQUFJO0FBQ0YscUJBRWxCO0FBSk07QUFLSCxVQUFJO0FBQ0UsZ0JBQ1o7QUF6QndCO0FBMEIxQixJQUFxQixrQkFBVyxTQUFjLGNBQTBDO0FBRWhGLFNBQWMsY0FBNEIsNEJBQWlCLGlCQUFRLFNBQUUsVUFBZTtBQUNuRixVQUFrQjtBQUVMLHNCQUFhLGFBQW1CLGtCQUFnQixnQkFBaUIsaUJBQU0sT0FBa0IsaUJBQVEsU0FBRyxHQUFLO0FBQzNILFFBQXNCLG1CQUFXLFNBQVUsU0FBYyxjQUFvRCwrQkFBTSxPQUFNO0FBRWxILFlBQUssS0FBd0I7QUFDbEIsdUJBQWtCLG1CQUFFLEVBQXFCLHNDQUM3QyxVQUFDLFVBQU0sT0FBTyxPQUFXO0FBQzNCLGFBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUSxNQUFPLFFBQUUsRUFBRyxHQUFHO0FBQ2xCLDhCQUFhLGFBQUMsSUFBYSxVQUFNLE1BQUcsSUFBa0Is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cyB0cmFuc3BpbGVkUGFyYWxsZWxNYW5kZWxicm90fSBmcm9tIFwiLi90cmFuc3BpbGVkL21hbmRlbGJyb3RcIjtcbmltcG9ydCB7cGFyYWxsZWxLbmlnaHRUb3VycyBhcyB0cmFuc3BpbGVkUGFyYWxsZWxLbmlnaHRUb3VyLCBzeW5jS25pZ2h0VG91cnN9IGZyb20gXCIuL3RyYW5zcGlsZWQva25pZ2h0cy10b3VyXCI7XG5pbXBvcnQge3BhcmFsbGVsS25pZ2h0VG91cnMgYXMgZHluYW1pY0tuaWdodFRvdXJ9IGZyb20gXCIuL2R5bmFtaWMva25pZ2h0cy10b3VyXCI7XG5pbXBvcnQge3N5bmNNYW5kZWxicm90LCBjcmVhdGVNYW5kZWxPcHRpb25zLCBwYXJhbGxlbE1hbmRlbGJyb3QgYXMgZHluYW1pY1BhcmFsbGVsTWFuZGVsYnJvdH0gZnJvbSBcIi4vZHluYW1pYy9tYW5kZWxicm90XCI7XG5pbXBvcnQge3N5bmNNb250ZUNhcmxvIGFzIHNpbUpzTW9udGVDYXJsbywgcGFyYWxsZWxNb250ZUNhcmxvIGFzIHRyYW5zcGlsZWRQYXJhbGxlbE1vbnRlQ2FybG99IGZyb20gXCIuL3RyYW5zcGlsZWQvbW9udGUtY2FybG9cIjtcbmltcG9ydCB7c3luY01vbnRlQ2FybG8gYXMgcmFuZG9tTW9udGVDYXJsbywgcGFyYWxsZWxNb250ZUNhcmxvIGFzIGR5bmFtaWNQYXJhbGxlbE1vbnRlQ2FybG8sIElQcm9qZWN0UmVzdWx0fSBmcm9tIFwiLi9keW5hbWljL21vbnRlLWNhcmxvXCI7XG5cbi8qIHRzbGludDpkaXNhYmxlOm5vLWNvbnNvbGUgKi9cblxubGV0IHBhcmFsbGVsTWFuZGVsYnJvdCA9IHRyYW5zcGlsZWRQYXJhbGxlbE1hbmRlbGJyb3Q7XG5sZXQgcGFyYWxsZWxLbmlnaHRUb3VyID0gdHJhbnNwaWxlZFBhcmFsbGVsS25pZ2h0VG91cjtcbmxldCBwYXJhbGxlbE1vbnRlQ2FybG8gPSB0cmFuc3BpbGVkUGFyYWxsZWxNb250ZUNhcmxvO1xubGV0IHN5bmNNb250ZUNhcmxvID0gc2ltSnNNb250ZUNhcmxvO1xuXG5jb25zdCBtYW5kZWxicm90Q2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYW5kZWxicm90LWNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbmNvbnN0IG1hbmRlbGJyb3RDb250ZXh0ID0gbWFuZGVsYnJvdENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5jb25zdCBtYW5kZWxicm90T3B0aW9ucyA9IGNyZWF0ZU1hbmRlbE9wdGlvbnMobWFuZGVsYnJvdENhbnZhcy53aWR0aCwgbWFuZGVsYnJvdENhbnZhcy5oZWlnaHQsIDEwMDAwKTtcblxuY29uc3QgbW9udGVDYXJsb09wdGlvbnMgPSB7XG4gICAgaW52ZXN0bWVudEFtb3VudDogNjIwMDAwLFxuICAgIG51bVJ1bnM6IDEwMDAwLFxuICAgIG51bVllYXJzOiAxNSxcbiAgICBwZXJmb3JtYW5jZTogMC4wMzQwMDAwLFxuICAgIHByb2plY3RzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN0YXJ0WWVhcjogMCxcbiAgICAgICAgICAgIHRvdGFsQW1vdW50OiAxMDAwMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBzdGFydFllYXI6IDEsXG4gICAgICAgICAgICB0b3RhbEFtb3VudDogMTAwMDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc3RhcnRZZWFyOiAyLFxuICAgICAgICAgICAgdG90YWxBbW91bnQ6IDEwMDAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHN0YXJ0WWVhcjogNSxcbiAgICAgICAgICAgIHRvdGFsQW1vdW50OiA1MDAwMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBzdGFydFllYXI6IDE1LFxuICAgICAgICAgICAgdG90YWxBbW91bnQ6IDgwMDAwMFxuICAgICAgICB9XG4gICAgXSxcbiAgICBzZWVkOiAxMCxcbiAgICB2b2xhdGlsaXR5OiAwLjA4OTYwMDBcbn07XG5jb25zdCBtb250ZUNhcmxvVGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vbnRlY2FybG8tdGFibGVcIikgYXMgSFRNTFRhYmxlRWxlbWVudDtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYW5kZWxicm90LXJ1bi1wYXJhbGxlbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIG1hbmRlbGJyb3RDb250ZXh0IS5wdXRJbWFnZURhdGEobWFuZGVsYnJvdENvbnRleHQhLmNyZWF0ZUltYWdlRGF0YShtYW5kZWxicm90Q2FudmFzLndpZHRoLCBtYW5kZWxicm90Q2FudmFzLmhlaWdodCksIDAsIDApO1xuICAgIGNvbnN0IG1heFZhbHVlc1BlclRhc2sgPSBwYXJzZUludCgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYW5kZWxicm90LXZhbHVlcy1wZXItdGFza1wiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuXG4gICAgY29uc29sZS50aW1lKFwibWFuZGVsYnJvdC1wYXJhbGxlbFwiKTtcbiAgICBwYXJhbGxlbE1hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnMsIHsgbWF4VmFsdWVzUGVyVGFzayB9KVxuICAgICAgICAuc3Vic2NyaWJlKChsaW5lcywgaW5kZXgsIGJsb2NrU2l6ZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIG1hbmRlbGJyb3RDb250ZXh0IS5wdXRJbWFnZURhdGEobmV3IEltYWdlRGF0YShsaW5lc1tpXSwgbWFuZGVsYnJvdENhbnZhcy53aWR0aCwgMSksIDAsIGluZGV4ICogYmxvY2tTaXplICsgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUudGltZUVuZChcIm1hbmRlbGJyb3QtcGFyYWxsZWxcIiksIHJlYXNvbiA9PiBjb25zb2xlLmVycm9yKHJlYXNvbikpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFuZGVsYnJvdC1ydW4tc3luY1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIG1hbmRlbGJyb3RDb250ZXh0IS5wdXRJbWFnZURhdGEobWFuZGVsYnJvdENvbnRleHQhLmNyZWF0ZUltYWdlRGF0YShtYW5kZWxicm90Q2FudmFzLndpZHRoLCBtYW5kZWxicm90Q2FudmFzLmhlaWdodCksIDAsIDApO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUudGltZShcIm1hbmRlbGJyb3Qtc3luY1wiKTtcbiAgICAgICAgc3luY01hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnMsIGZ1bmN0aW9uIChsaW5lLCB5KSB7XG4gICAgICAgICAgICBtYW5kZWxicm90Q29udGV4dCEucHV0SW1hZ2VEYXRhKG5ldyBJbWFnZURhdGEobGluZSwgbWFuZGVsYnJvdENhbnZhcy53aWR0aCwgMSksIDAsIHkpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS50aW1lRW5kKFwibWFuZGVsYnJvdC1zeW5jXCIpO1xuICAgIH0sIDApO1xuXG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtb250ZWNhcmxvLXJ1bi1zeW5jXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS50aW1lKFwibW9udGVjYXJsby1zeW5jXCIpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHN5bmNNb250ZUNhcmxvKG1vbnRlQ2FybG9PcHRpb25zKTtcbiAgICBjb25zb2xlLnRpbWVFbmQoXCJtb250ZWNhcmxvLXN5bmNcIik7XG4gICAgcGFpbnRNb250ZUNhcmxvUmVzdWx0KHJlc3VsdCk7XG4gICAgY29uc29sZS5sb2cocmVzdWx0KTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vbnRlY2FybG8tcnVuLXBhcmFsbGVsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS50aW1lKFwibW9udGVjYXJsby1wYXJhbGxlbFwiKTtcbiAgICBwYXJhbGxlbE1vbnRlQ2FybG8obW9udGVDYXJsb09wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoXCJtb250ZWNhcmxvLXBhcmFsbGVsXCIpO1xuICAgICAgICBwYWludE1vbnRlQ2FybG9SZXN1bHQocmVzdWx0KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBwYWludE1vbnRlQ2FybG9SZXN1bHQocmVzdWx0czogSVByb2plY3RSZXN1bHRbXSkge1xuICAgIHdoaWxlIChtb250ZUNhcmxvVGFibGUucm93cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIG1vbnRlQ2FybG9UYWJsZS5kZWxldGVSb3coMSk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCByZXN1bHQgb2YgcmVzdWx0cykge1xuICAgICAgICBjb25zdCByb3cgPSBtb250ZUNhcmxvVGFibGUuaW5zZXJ0Um93KCk7XG4gICAgICAgIHJvdy5pbnNlcnRDZWxsKCkuaW5uZXJUZXh0ID0gcmVzdWx0LnByb2plY3Quc3RhcnRZZWFyLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgICAgIHJvdy5pbnNlcnRDZWxsKCkuaW5uZXJUZXh0ID0gcmVzdWx0LnByb2plY3QudG90YWxBbW91bnQudG9Mb2NhbGVTdHJpbmcoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGdyb3VwTmFtZSBvZiBbXCJncmVlblwiLCBcInllbGxvd1wiLCBcImdyYXlcIiwgXCJyZWRcIl0pIHtcbiAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gcmVzdWx0Lmdyb3Vwcy5maW5kKGcgPT4gZy5uYW1lID09PSBncm91cE5hbWUpO1xuICAgICAgICAgICAgcm93Lmluc2VydENlbGwoKS5pbm5lclRleHQgPSBncm91cCA/IChncm91cC5wZXJjZW50YWdlICogMTAwKS50b0ZpeGVkKDIpIDogXCItXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGtuaWdodEJvYXJkUmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNrbmlnaHQtYm9hcmQtcmVzdWx0XCIpIGFzIEhUTUxQYXJhZ3JhcGhFbGVtZW50O1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2tuaWdodC1ydW4tc3luY1wiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJvYXJkU2l6ZSA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2tuaWdodC1ib2FyZC1zaXplXCIpICBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuICAgIGtuaWdodEJvYXJkUmVzdWx0LmlubmVyVGV4dCA9IFwiQ2FsY3VsYXRpbmcuLi5cIjtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLnRpbWUoXCJrbmlnaHQtcnVuLXN5bmNcIik7XG4gICAgICAgIGNvbnN0IHNvbHV0aW9ucyA9IHN5bmNLbmlnaHRUb3Vycyh7IHg6IDAsIHk6IDB9LCBib2FyZFNpemUpO1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoXCJrbmlnaHQtcnVuLXN5bmNcIik7XG5cbiAgICAgICAga25pZ2h0Qm9hcmRSZXN1bHQuaW5uZXJUZXh0ID0gYEZvdW5kICR7c29sdXRpb25zfSBzb2x1dGlvbnMgZm9yICR7Ym9hcmRTaXplfXgke2JvYXJkU2l6ZX0gYm9hcmRgO1xuICAgIH0sIDApO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIja25pZ2h0LXJ1bi1wYXJhbGxlbFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGJvYXJkU2l6ZSA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2tuaWdodC1ib2FyZC1zaXplXCIpICBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuICAgIGtuaWdodEJvYXJkUmVzdWx0LmlubmVyVGV4dCA9IFwiQ2FsY3VsYXRpbmcuLi5cIjtcblxuICAgIGNvbnNvbGUudGltZShcImtuaWdodC1ydW4tcGFyYWxsZWxcIik7XG4gICAgcGFyYWxsZWxLbmlnaHRUb3VyKHsgeDogMCwgeTogMH0sIGJvYXJkU2l6ZSlcbiAgICAgICAgLnRoZW4oc29sdXRpb25zID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZChcImtuaWdodC1ydW4tcGFyYWxsZWxcIik7XG4gICAgICAgICAgICBrbmlnaHRCb2FyZFJlc3VsdC5pbm5lclRleHQgPSBgRm91bmQgJHtzb2x1dGlvbnN9IHNvbHV0aW9ucyBmb3IgJHtib2FyZFNpemV9eCR7Ym9hcmRTaXplfSBib2FyZGA7XG4gICAgICAgIH0sIChyZWFzb24pID0+IGNvbnNvbGUubG9nKHJlYXNvbikpO1xufSk7XG5cbmZ1bmN0aW9uIG9uVHJhbnNwaWxlZENoYW5nZWQodHJhbnNwaWxlZDogYm9vbGVhbikge1xuICAgIGlmICh0cmFuc3BpbGVkKSB7XG4gICAgICAgIHBhcmFsbGVsTWFuZGVsYnJvdCA9IHRyYW5zcGlsZWRQYXJhbGxlbE1hbmRlbGJyb3Q7XG4gICAgICAgIHBhcmFsbGVsS25pZ2h0VG91ciA9IHRyYW5zcGlsZWRQYXJhbGxlbEtuaWdodFRvdXI7XG4gICAgICAgIHN5bmNNb250ZUNhcmxvID0gc2ltSnNNb250ZUNhcmxvO1xuICAgICAgICBwYXJhbGxlbE1vbnRlQ2FybG8gPSB0cmFuc3BpbGVkUGFyYWxsZWxNb250ZUNhcmxvO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmFsbGVsTWFuZGVsYnJvdCA9IGR5bmFtaWNQYXJhbGxlbE1hbmRlbGJyb3Q7XG4gICAgICAgIHBhcmFsbGVsS25pZ2h0VG91ciA9IGR5bmFtaWNLbmlnaHRUb3VyO1xuICAgICAgICBzeW5jTW9udGVDYXJsbyA9IHJhbmRvbU1vbnRlQ2FybG87XG4gICAgICAgIHBhcmFsbGVsTW9udGVDYXJsbyA9IGR5bmFtaWNQYXJhbGxlbE1vbnRlQ2FybG87XG4gICAgfVxufVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RyYW5zcGlsZWQtcGFyYWxsZWxcIikhLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IHRyYW5zcGlsZWQgPSAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkO1xuICAgIG9uVHJhbnNwaWxlZENoYW5nZWQodHJhbnNwaWxlZCk7XG59KTtcblxub25UcmFuc3BpbGVkQ2hhbmdlZCh0cnVlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9icm93c2VyLWV4YW1wbGUudHMiXSwic291cmNlUm9vdCI6IiJ9