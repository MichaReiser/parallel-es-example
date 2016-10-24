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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var result = _step.value;

            var row = monteCarloTable.insertRow();
            row.insertCell().innerText = result.project.startYear.toLocaleString();
            row.insertCell().innerText = result.project.totalAmount.toLocaleString();
            var _arr = ["green", "yellow", "gray", "red"];

            var _loop = function _loop() {
                var groupName = _arr[_i];
                var group = result.groups.find(function (g) {
                    return g.name === groupName;
                });
                row.insertCell().innerText = group ? (group.percentage * 100).toFixed(2) : "-";
            };

            for (var _i = 0; _i < _arr.length; _i++) {
                _loop();
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYnJvd3Nlci1leGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQWtGO0FBQzRCO0FBQy9CO0FBQzBDO0FBQ0s7QUFDVztBQUUxRztBQUUvQixJQUFzQixxQkFBZ0M7QUFDdEQsSUFBc0IscUJBQWdDO0FBQ3RELElBQXNCLHFCQUFnQztBQUN0RCxJQUFrQixpQkFBbUI7QUFFckMsSUFBc0IsbUJBQVcsU0FBYyxjQUE0QztBQUMzRixJQUF1QixvQkFBbUIsaUJBQVcsV0FBTztBQUM1RCxJQUF1QixvQkFBc0Isd0dBQWlCLGlCQUFNLE9BQWtCLGlCQUFPLFFBQVM7QUFFdEcsSUFBdUI7QUFDSCxzQkFBUTtBQUNqQixhQUFPO0FBQ04sY0FBSTtBQUNELGlCQUFXO0FBQ2Q7QUFFUyxtQkFBRztBQUNELHFCQUNkO0FBSEQsS0FETTtBQUtPLG1CQUFHO0FBQ0QscUJBQ2Q7QUFIRTtBQUlVLG1CQUFHO0FBQ0QscUJBQ2Q7QUFIRTtBQUlVLG1CQUFHO0FBQ0QscUJBQ2Q7QUFIRTtBQUlVLG1CQUFJO0FBQ0YscUJBRWxCO0FBSk07QUFLSCxVQUFJO0FBQ0UsZ0JBQ1o7QUF6QndCO0FBMEIxQixJQUFxQixrQkFBVyxTQUFjLGNBQTBDO0FBRWhGLFNBQWMsY0FBNEIsNEJBQWlCLGlCQUFRLFNBQUUsVUFBZTtBQUNuRixVQUFrQjtBQUVMLHNCQUFhLGFBQW1CLGtCQUFnQixnQkFBaUIsaUJBQU0sT0FBa0IsaUJBQVEsU0FBRyxHQUFLO0FBQzNILFFBQXNCLG1CQUFXLFNBQVUsU0FBYyxjQUFvRCwrQkFBTSxPQUFNO0FBRWxILFlBQUssS0FBd0I7QUFDbEIsdUJBQWtCLG1CQUFFLEVBQXFCLHNDQUM3QyxVQUFDLFVBQU0sT0FBTyxPQUFXO0FBQzNCLGFBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUSxNQUFPLFFBQUUsRUFBRyxHQUFHO0FBQ2xCLDhCQUFhLGFBQUMsSUFBYSxVQUFNLE1BQUcsSUFBa0Is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IHttYW5kZWxicm90IGFzIHRyYW5zcGlsZWRQYXJhbGxlbE1hbmRlbGJyb3R9IGZyb20gXCIuL3RyYW5zcGlsZWQvbWFuZGVsYnJvdFwiO1xuaW1wb3J0IHtwYXJhbGxlbEtuaWdodFRvdXJzIGFzIHRyYW5zcGlsZWRQYXJhbGxlbEtuaWdodFRvdXIsIHN5bmNLbmlnaHRUb3Vyc30gZnJvbSBcIi4vdHJhbnNwaWxlZC9rbmlnaHRzLXRvdXJcIjtcbmltcG9ydCB7cGFyYWxsZWxLbmlnaHRUb3VycyBhcyBkeW5hbWljS25pZ2h0VG91cn0gZnJvbSBcIi4vZHluYW1pYy9rbmlnaHRzLXRvdXJcIjtcbmltcG9ydCB7c3luY01hbmRlbGJyb3QsIGNyZWF0ZU1hbmRlbE9wdGlvbnMsIHBhcmFsbGVsTWFuZGVsYnJvdCBhcyBkeW5hbWljUGFyYWxsZWxNYW5kZWxicm90fSBmcm9tIFwiLi9keW5hbWljL21hbmRlbGJyb3RcIjtcbmltcG9ydCB7c3luY01vbnRlQ2FybG8gYXMgc2ltSnNNb250ZUNhcmxvLCBwYXJhbGxlbE1vbnRlQ2FybG8gYXMgdHJhbnNwaWxlZFBhcmFsbGVsTW9udGVDYXJsb30gZnJvbSBcIi4vdHJhbnNwaWxlZC9tb250ZS1jYXJsb1wiO1xuaW1wb3J0IHtzeW5jTW9udGVDYXJsbyBhcyByYW5kb21Nb250ZUNhcmxvLCBwYXJhbGxlbE1vbnRlQ2FybG8gYXMgZHluYW1pY1BhcmFsbGVsTW9udGVDYXJsbywgSVByb2plY3RSZXN1bHR9IGZyb20gXCIuL2R5bmFtaWMvbW9udGUtY2FybG9cIjtcblxuLyogdHNsaW50OmRpc2FibGU6bm8tY29uc29sZSAqL1xuXG5sZXQgcGFyYWxsZWxNYW5kZWxicm90ID0gdHJhbnNwaWxlZFBhcmFsbGVsTWFuZGVsYnJvdDtcbmxldCBwYXJhbGxlbEtuaWdodFRvdXIgPSB0cmFuc3BpbGVkUGFyYWxsZWxLbmlnaHRUb3VyO1xubGV0IHBhcmFsbGVsTW9udGVDYXJsbyA9IHRyYW5zcGlsZWRQYXJhbGxlbE1vbnRlQ2FybG87XG5sZXQgc3luY01vbnRlQ2FybG8gPSBzaW1Kc01vbnRlQ2FybG87XG5cbmNvbnN0IG1hbmRlbGJyb3RDYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3QtY2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuY29uc3QgbWFuZGVsYnJvdENvbnRleHQgPSBtYW5kZWxicm90Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbmNvbnN0IG1hbmRlbGJyb3RPcHRpb25zID0gY3JlYXRlTWFuZGVsT3B0aW9ucyhtYW5kZWxicm90Q2FudmFzLndpZHRoLCBtYW5kZWxicm90Q2FudmFzLmhlaWdodCwgMTAwMDApO1xuXG5jb25zdCBtb250ZUNhcmxvT3B0aW9ucyA9IHtcbiAgICBpbnZlc3RtZW50QW1vdW50OiA2MjAwMDAsXG4gICAgbnVtUnVuczogMTAwMDAsXG4gICAgbnVtWWVhcnM6IDE1LFxuICAgIHBlcmZvcm1hbmNlOiAwLjAzNDAwMDAsXG4gICAgcHJvamVjdHM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgc3RhcnRZZWFyOiAwLFxuICAgICAgICAgICAgdG90YWxBbW91bnQ6IDEwMDAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHN0YXJ0WWVhcjogMSxcbiAgICAgICAgICAgIHRvdGFsQW1vdW50OiAxMDAwMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBzdGFydFllYXI6IDIsXG4gICAgICAgICAgICB0b3RhbEFtb3VudDogMTAwMDBcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgc3RhcnRZZWFyOiA1LFxuICAgICAgICAgICAgdG90YWxBbW91bnQ6IDUwMDAwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHN0YXJ0WWVhcjogMTUsXG4gICAgICAgICAgICB0b3RhbEFtb3VudDogODAwMDAwXG4gICAgICAgIH1cbiAgICBdLFxuICAgIHNlZWQ6IDEwLFxuICAgIHZvbGF0aWxpdHk6IDAuMDg5NjAwMFxufTtcbmNvbnN0IG1vbnRlQ2FybG9UYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9udGVjYXJsby10YWJsZVwiKSBhcyBIVE1MVGFibGVFbGVtZW50O1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3QtcnVuLXBhcmFsbGVsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbWFuZGVsYnJvdENvbnRleHQhLnB1dEltYWdlRGF0YShtYW5kZWxicm90Q29udGV4dCEuY3JlYXRlSW1hZ2VEYXRhKG1hbmRlbGJyb3RDYW52YXMud2lkdGgsIG1hbmRlbGJyb3RDYW52YXMuaGVpZ2h0KSwgMCwgMCk7XG4gICAgY29uc3QgbWF4VmFsdWVzUGVyVGFzayA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3QtdmFsdWVzLXBlci10YXNrXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLCAxMCk7XG5cbiAgICBjb25zb2xlLnRpbWUoXCJtYW5kZWxicm90LXBhcmFsbGVsXCIpO1xuICAgIHBhcmFsbGVsTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgeyBtYXhWYWx1ZXNQZXJUYXNrIH0pXG4gICAgICAgIC5zdWJzY3JpYmUoKGxpbmVzLCBpbmRleCwgYmxvY2tTaXplKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgbWFuZGVsYnJvdENvbnRleHQhLnB1dEltYWdlRGF0YShuZXcgSW1hZ2VEYXRhKGxpbmVzW2ldLCBtYW5kZWxicm90Q2FudmFzLndpZHRoLCAxKSwgMCwgaW5kZXggKiBibG9ja1NpemUgKyBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4gY29uc29sZS50aW1lRW5kKFwibWFuZGVsYnJvdC1wYXJhbGxlbFwiKSwgcmVhc29uID0+IGNvbnNvbGUuZXJyb3IocmVhc29uKSk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYW5kZWxicm90LXJ1bi1zeW5jXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgbWFuZGVsYnJvdENvbnRleHQhLnB1dEltYWdlRGF0YShtYW5kZWxicm90Q29udGV4dCEuY3JlYXRlSW1hZ2VEYXRhKG1hbmRlbGJyb3RDYW52YXMud2lkdGgsIG1hbmRlbGJyb3RDYW52YXMuaGVpZ2h0KSwgMCwgMCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc29sZS50aW1lKFwibWFuZGVsYnJvdC1zeW5jXCIpO1xuICAgICAgICBzeW5jTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgZnVuY3Rpb24gKGxpbmUsIHkpIHtcbiAgICAgICAgICAgIG1hbmRlbGJyb3RDb250ZXh0IS5wdXRJbWFnZURhdGEobmV3IEltYWdlRGF0YShsaW5lLCBtYW5kZWxicm90Q2FudmFzLndpZHRoLCAxKSwgMCwgeSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLnRpbWVFbmQoXCJtYW5kZWxicm90LXN5bmNcIik7XG4gICAgfSwgMCk7XG5cbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21vbnRlY2FybG8tcnVuLXN5bmNcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLnRpbWUoXCJtb250ZWNhcmxvLXN5bmNcIik7XG4gICAgY29uc3QgcmVzdWx0ID0gc3luY01vbnRlQ2FybG8obW9udGVDYXJsb09wdGlvbnMpO1xuICAgIGNvbnNvbGUudGltZUVuZChcIm1vbnRlY2FybG8tc3luY1wiKTtcbiAgICBwYWludE1vbnRlQ2FybG9SZXN1bHQocmVzdWx0KTtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbW9udGVjYXJsby1ydW4tcGFyYWxsZWxcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLnRpbWUoXCJtb250ZWNhcmxvLXBhcmFsbGVsXCIpO1xuICAgIHBhcmFsbGVsTW9udGVDYXJsbyhtb250ZUNhcmxvT3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZChcIm1vbnRlY2FybG8tcGFyYWxsZWxcIik7XG4gICAgICAgIHBhaW50TW9udGVDYXJsb1Jlc3VsdChyZXN1bHQpO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xuICAgIH0pO1xufSk7XG5cbmZ1bmN0aW9uIHBhaW50TW9udGVDYXJsb1Jlc3VsdChyZXN1bHRzOiBJUHJvamVjdFJlc3VsdFtdKSB7XG4gICAgd2hpbGUgKG1vbnRlQ2FybG9UYWJsZS5yb3dzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbW9udGVDYXJsb1RhYmxlLmRlbGV0ZVJvdygxKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IG1vbnRlQ2FybG9UYWJsZS5pbnNlcnRSb3coKTtcbiAgICAgICAgcm93Lmluc2VydENlbGwoKS5pbm5lclRleHQgPSByZXN1bHQucHJvamVjdC5zdGFydFllYXIudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICAgICAgcm93Lmluc2VydENlbGwoKS5pbm5lclRleHQgPSByZXN1bHQucHJvamVjdC50b3RhbEFtb3VudC50b0xvY2FsZVN0cmluZygpO1xuXG4gICAgICAgIGZvciAoY29uc3QgZ3JvdXBOYW1lIG9mIFtcImdyZWVuXCIsIFwieWVsbG93XCIsIFwiZ3JheVwiLCBcInJlZFwiXSkge1xuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSByZXN1bHQuZ3JvdXBzLmZpbmQoZyA9PiBnLm5hbWUgPT09IGdyb3VwTmFtZSk7XG4gICAgICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpLmlubmVyVGV4dCA9IGdyb3VwID8gKGdyb3VwLnBlcmNlbnRhZ2UgKiAxMDApLnRvRml4ZWQoMikgOiBcIi1cIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3Qga25pZ2h0Qm9hcmRSZXN1bHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2tuaWdodC1ib2FyZC1yZXN1bHRcIikgYXMgSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIja25pZ2h0LXJ1bi1zeW5jXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYm9hcmRTaXplID0gcGFyc2VJbnQoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIja25pZ2h0LWJvYXJkLXNpemVcIikgIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLCAxMCk7XG4gICAga25pZ2h0Qm9hcmRSZXN1bHQuaW5uZXJUZXh0ID0gXCJDYWxjdWxhdGluZy4uLlwiO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUudGltZShcImtuaWdodC1ydW4tc3luY1wiKTtcbiAgICAgICAgY29uc3Qgc29sdXRpb25zID0gc3luY0tuaWdodFRvdXJzKHsgeDogMCwgeTogMH0sIGJvYXJkU2l6ZSk7XG4gICAgICAgIGNvbnNvbGUudGltZUVuZChcImtuaWdodC1ydW4tc3luY1wiKTtcblxuICAgICAgICBrbmlnaHRCb2FyZFJlc3VsdC5pbm5lclRleHQgPSBgRm91bmQgJHtzb2x1dGlvbnN9IHNvbHV0aW9ucyBmb3IgJHtib2FyZFNpemV9eCR7Ym9hcmRTaXplfSBib2FyZGA7XG4gICAgfSwgMCk7XG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNrbmlnaHQtcnVuLXBhcmFsbGVsXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYm9hcmRTaXplID0gcGFyc2VJbnQoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIja25pZ2h0LWJvYXJkLXNpemVcIikgIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLCAxMCk7XG4gICAga25pZ2h0Qm9hcmRSZXN1bHQuaW5uZXJUZXh0ID0gXCJDYWxjdWxhdGluZy4uLlwiO1xuXG4gICAgY29uc29sZS50aW1lKFwia25pZ2h0LXJ1bi1wYXJhbGxlbFwiKTtcbiAgICBwYXJhbGxlbEtuaWdodFRvdXIoeyB4OiAwLCB5OiAwfSwgYm9hcmRTaXplKVxuICAgICAgICAudGhlbihzb2x1dGlvbnMgPT4ge1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKFwia25pZ2h0LXJ1bi1wYXJhbGxlbFwiKTtcbiAgICAgICAgICAgIGtuaWdodEJvYXJkUmVzdWx0LmlubmVyVGV4dCA9IGBGb3VuZCAke3NvbHV0aW9uc30gc29sdXRpb25zIGZvciAke2JvYXJkU2l6ZX14JHtib2FyZFNpemV9IGJvYXJkYDtcbiAgICAgICAgfSwgKHJlYXNvbikgPT4gY29uc29sZS5sb2cocmVhc29uKSk7XG59KTtcblxuZnVuY3Rpb24gb25UcmFuc3BpbGVkQ2hhbmdlZCh0cmFuc3BpbGVkOiBib29sZWFuKSB7XG4gICAgaWYgKHRyYW5zcGlsZWQpIHtcbiAgICAgICAgcGFyYWxsZWxNYW5kZWxicm90ID0gdHJhbnNwaWxlZFBhcmFsbGVsTWFuZGVsYnJvdDtcbiAgICAgICAgcGFyYWxsZWxLbmlnaHRUb3VyID0gdHJhbnNwaWxlZFBhcmFsbGVsS25pZ2h0VG91cjtcbiAgICAgICAgc3luY01vbnRlQ2FybG8gPSBzaW1Kc01vbnRlQ2FybG87XG4gICAgICAgIHBhcmFsbGVsTW9udGVDYXJsbyA9IHRyYW5zcGlsZWRQYXJhbGxlbE1vbnRlQ2FybG87XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYWxsZWxNYW5kZWxicm90ID0gZHluYW1pY1BhcmFsbGVsTWFuZGVsYnJvdDtcbiAgICAgICAgcGFyYWxsZWxLbmlnaHRUb3VyID0gZHluYW1pY0tuaWdodFRvdXI7XG4gICAgICAgIHN5bmNNb250ZUNhcmxvID0gcmFuZG9tTW9udGVDYXJsbztcbiAgICAgICAgcGFyYWxsZWxNb250ZUNhcmxvID0gZHluYW1pY1BhcmFsbGVsTW9udGVDYXJsbztcbiAgICB9XG59XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdHJhbnNwaWxlZC1wYXJhbGxlbFwiKSEuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KSB7XG4gICAgY29uc3QgdHJhbnNwaWxlZCA9IChldmVudC5jdXJyZW50VGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XG4gICAgb25UcmFuc3BpbGVkQ2hhbmdlZCh0cmFuc3BpbGVkKTtcbn0pO1xuXG5vblRyYW5zcGlsZWRDaGFuZ2VkKHRydWUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Jyb3dzZXItZXhhbXBsZS50cyJdLCJzb3VyY2VSb290IjoiIn0=