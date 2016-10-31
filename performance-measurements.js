webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/* unknown exports provided */
/* all exports used */
/*!**************************************!*\
  !*** ./~/paralleljs/lib/parallel.js ***!
  \**************************************/
/***/ function(module, exports) {

﻿(function () {
	var isCommonJS = typeof module !== 'undefined' && module.exports;
	var isNode = !(typeof window !== 'undefined' && this === window);
	var setImmediate = setImmediate || function (cb) {
		setTimeout(cb, 0);
	};
	var Worker = isNode ? require(__dirname + '/Worker.js') : self.Worker;
	var URL = typeof self !== 'undefined' ? (self.URL ? self.URL : self.webkitURL) : null;
	var _supports = (isNode || self.Worker) ? true : false; // node always supports parallel

	function extend(from, to) {
		if (!to) to = {};
		for (var i in from) {
			if (to[i] === undefined) to[i] = from[i];
		}
		return to;
	}

	function Operation() {
		this._callbacks = [];
		this._errCallbacks = [];

		this._resolved = 0;
		this._result = null;
	}

	Operation.prototype.resolve = function (err, res) {
		if (!err) {
			this._resolved = 1;
			this._result = res;

			for (var i = 0; i < this._callbacks.length; ++i) {
				this._callbacks[i](res);
			}
		} else {
			this._resolved = 2;
			this._result = err;

			for (var iE = 0; iE < this._errCallbacks.length; ++iE) {
				this._errCallbacks[iE](err);
			}
		}

		this._callbacks = [];
		this._errCallbacks = [];
	};

	Operation.prototype.then = function (cb, errCb) {
		if (this._resolved === 1) { // result
			if (cb) {
				cb(this._result);
			}

			return;
		} else if (this._resolved === 2) { // error
			if (errCb) {
				errCb(this._result);
			}
			return;
		}

		if (cb) {
			this._callbacks[this._callbacks.length] = cb;
		}

		if (errCb) {
			this._errCallbacks[this._errCallbacks.length] = errCb;
		}
		return this;
	};

	var defaults = {
		evalPath: isNode ? __dirname + '/eval.js' : null,
		maxWorkers: isNode ? require('os').cpus().length : (navigator.hardwareConcurrency || 4),
		synchronous: true,
		env: {},
		envNamespace: 'env'
	};

	function Parallel(data, options) {
		this.data = data;
		this.options = extend(defaults, options);
		this.operation = new Operation();
		this.operation.resolve(null, this.data);
		this.requiredScripts = [];
		this.requiredFunctions = [];
	}

	// static method
	Parallel.isSupported = function () { return _supports; }

	Parallel.prototype.getWorkerSource = function (cb, env) {
		var that = this;
		var preStr = '';
		var i = 0;
		if (!isNode && this.requiredScripts.length !== 0) {
			preStr += 'importScripts("' + this.requiredScripts.join('","') + '");\r\n';
		}

		for (i = 0; i < this.requiredFunctions.length; ++i) {
			if (this.requiredFunctions[i].name) {
				preStr += 'var ' + this.requiredFunctions[i].name + ' = ' + this.requiredFunctions[i].fn.toString() + ';';
			} else {
				preStr += this.requiredFunctions[i].fn.toString();
			}
		}

		env = JSON.stringify(env || {});

		var ns = this.options.envNamespace;

		if (isNode) {
			return preStr + 'process.on("message", function(e) {global.' + ns + ' = ' + env + ';process.send(JSON.stringify((' + cb.toString() + ')(JSON.parse(e).data)))})';
		} else {
			return preStr + 'self.onmessage = function(e) {var global = {}; global.' + ns + ' = ' + env + ';self.postMessage((' + cb.toString() + ')(e.data))}';
		}
	};

	Parallel.prototype.require = function () {
		var args = Array.prototype.slice.call(arguments, 0),
			func;

		for (var i = 0; i < args.length; i++) {
			func = args[i];

			if (typeof func === 'string') {
				this.requiredScripts.push(func);
			} else if (typeof func === 'function') {
				this.requiredFunctions.push({ fn: func });
			} else if (typeof func === 'object') {
				this.requiredFunctions.push(func);
			}
		}

		return this;
	};

	Parallel.prototype._spawnWorker = function (cb, env) {
		var wrk;
		var src = this.getWorkerSource(cb, env);
		if (isNode) {
			wrk = new Worker(this.options.evalPath);
			wrk.postMessage(src);
		} else {
			if (Worker === undefined) {
				return undefined;
			}

			try {
				if (this.requiredScripts.length !== 0) {
					if (this.options.evalPath !== null) {
						wrk = new Worker(this.options.evalPath);
						wrk.postMessage(src);
					} else {
						throw new Error('Can\'t use required scripts without eval.js!');
					}
				} else if (!URL) {
					throw new Error('Can\'t create a blob URL in this browser!');
				} else {
					var blob = new Blob([src], { type: 'text/javascript' });
					var url = URL.createObjectURL(blob);

					wrk = new Worker(url);
				}
			} catch (e) {
				if (this.options.evalPath !== null) { // blob/url unsupported, cross-origin error
					wrk = new Worker(this.options.evalPath);
					wrk.postMessage(src);
				} else {
					throw e;
				}
			}
		}

		return wrk;
	};

	Parallel.prototype.spawn = function (cb, env) {
		var that = this;
		var newOp = new Operation();

		env = extend(this.options.env, env || {});

		this.operation.then(function () {
			var wrk = that._spawnWorker(cb, env);
			if (wrk !== undefined) {
				wrk.onmessage = function (msg) {
					wrk.terminate();
					that.data = msg.data;
					newOp.resolve(null, that.data);
				};
				wrk.onerror = function (e) {
					wrk.terminate();
					newOp.resolve(e, null);
				};
				wrk.postMessage(that.data);
			} else if (that.options.synchronous) {
				setImmediate(function () {
					try {
						that.data = cb(that.data);
						newOp.resolve(null, that.data);
					} catch (e) {
						newOp.resolve(e, null);
					}
				});
			} else {
				throw new Error('Workers do not exist and synchronous operation not allowed!');
			}
		});
		this.operation = newOp;
		return this;
	};

	Parallel.prototype._spawnMapWorker = function (i, cb, done, env, wrk) {
		var that = this;

		if (!wrk) wrk = that._spawnWorker(cb, env);

		if (wrk !== undefined) {
			wrk.onmessage = function (msg) {
				that.data[i] = msg.data;
				done(null, wrk);
			};
			wrk.onerror = function (e) {
				wrk.terminate();
				done(e);
			};
			wrk.postMessage(that.data[i]);
		} else if (that.options.synchronous) {
			setImmediate(function () {
				that.data[i] = cb(that.data[i]);
				done();
			});
		} else {
			throw new Error('Workers do not exist and synchronous operation not allowed!');
		}
	};

	Parallel.prototype.map = function (cb, env) {
		env = extend(this.options.env, env || {});

		if (!this.data.length) {
			return this.spawn(cb, env);
		}

		var that = this;
		var startedOps = 0;
		var doneOps = 0;
		function done(err, wrk) {
			if (err) {
				newOp.resolve(err, null);
			} else if (++doneOps === that.data.length) {
				newOp.resolve(null, that.data);
				if (wrk) wrk.terminate();
			} else if (startedOps < that.data.length) {
				that._spawnMapWorker(startedOps++, cb, done, env, wrk);
			} else {
				if (wrk) wrk.terminate();
			}
		}

		var newOp = new Operation();
		this.operation.then(function () {
			for (; startedOps - doneOps < that.options.maxWorkers && startedOps < that.data.length; ++startedOps) {
				that._spawnMapWorker(startedOps, cb, done, env);
			}
		}, function (err) {
			newOp.resolve(err, null);
		});
		this.operation = newOp;
		return this;
	};

	Parallel.prototype._spawnReduceWorker = function (data, cb, done, env, wrk) {
		var that = this;
		if (!wrk) wrk = that._spawnWorker(cb, env);

		if (wrk !== undefined) {
			wrk.onmessage = function (msg) {
				that.data[that.data.length] = msg.data;
				done(null, wrk);
			};
			wrk.onerror = function (e) {
				wrk.terminate();
				done(e, null);
			}
			wrk.postMessage(data);
		} else if (that.options.synchronous) {
			setImmediate(function () {
				that.data[that.data.length] = cb(data);
				done();
			});
		} else {
			throw new Error('Workers do not exist and synchronous operation not allowed!');
		}
	};

	Parallel.prototype.reduce = function (cb, env) {
		env = extend(this.options.env, env || {});

		if (!this.data.length) {
			throw new Error('Can\'t reduce non-array data');
		}

		var runningWorkers = 0;
		var that = this;
		function done(err, wrk) {
			--runningWorkers;
			if (err) {
				newOp.resolve(err, null);
			} else if (that.data.length === 1 && runningWorkers === 0) {
				that.data = that.data[0];
				newOp.resolve(null, that.data);
				if (wrk) wrk.terminate();
			} else if (that.data.length > 1) {
				++runningWorkers;
				that._spawnReduceWorker([that.data[0], that.data[1]], cb, done, env, wrk);
				that.data.splice(0, 2);
			} else {
				if (wrk) wrk.terminate();
			}
		}

		var newOp = new Operation();
		this.operation.then(function () {
			if (that.data.length === 1) {
				newOp.resolve(null, that.data[0]);
			} else {
				for (var i = 0; i < that.options.maxWorkers && i < Math.floor(that.data.length / 2) ; ++i) {
					++runningWorkers;
					that._spawnReduceWorker([that.data[i * 2], that.data[i * 2 + 1]], cb, done, env);
				}

				that.data.splice(0, i * 2);
			}
		});
		this.operation = newOp;
		return this;
	};

	Parallel.prototype.then = function (cb, errCb) {
		var that = this;
		var newOp = new Operation();
		errCb = typeof errCb === 'function' ? errCb : function(){};

		this.operation.then(function () {
			var retData;

			try {
				if (cb) {
					retData = cb(that.data);
					if (retData !== undefined) {
						that.data = retData;
					}
				}
				newOp.resolve(null, that.data);
			} catch (e) {
				if (errCb) {
					retData = errCb(e);
					if (retData !== undefined) {
						that.data = retData;
					}

					newOp.resolve(null, that.data);
				} else {
					newOp.resolve(null, e);
				}
			}
		}, function (err) {
			if (errCb) {
				var retData = errCb(err);
				if (retData !== undefined) {
					that.data = retData;
				}

				newOp.resolve(null, that.data);
			} else {
				newOp.resolve(null, err);
			}
		});
		this.operation = newOp;
		return this;
	};

	if (isCommonJS) {
		module.exports = Parallel;
	} else {
		self.Parallel = Parallel;
	}
})();


/***/ },
/* 10 */,
/* 11 */
/* exports provided: knightTours, parallelJSKnightTours */
/* exports used: parallelJSKnightTours */
/*!****************************************!*\
  !*** ./src/paralleljs/knights-tour.ts ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* unused harmony export knightTours */
/* harmony export (immutable) */ exports["a"] = parallelJSKnightTours;
var Parallel = __webpack_require__(/*! paralleljs */ 9);
function knightTours(startPath, boardSize) {
    var moves = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }];
    var board = new Array(boardSize * boardSize);
    board.fill(0);
    var numberOfFields = boardSize * boardSize;
    var results = 0;
    var stack = startPath.map(function (pos, index) {
        return { coordinate: pos, n: index + 1 };
    });
    for (var index = 0; index < startPath.length - 1; ++index) {
        var fieldIndex = startPath[index].x * boardSize + startPath[index].y;
        board[fieldIndex] = index + 1;
    }
    while (stack.length > 0) {
        var _stack = stack[stack.length - 1],
            coordinate = _stack.coordinate,
            n = _stack.n;

        var _fieldIndex = coordinate.x * boardSize + coordinate.y;
        if (board[_fieldIndex] !== 0) {
            // back tracking
            board[_fieldIndex] = 0;
            stack.pop(); // remove current value
            continue;
        }
        // entry
        if (n === numberOfFields) {
            ++results;
            stack.pop();
            continue;
        }
        board[_fieldIndex] = n;
        for (var i = 0; i < moves.length; ++i) {
            var move = moves[i];
            var successor = { x: coordinate.x + move.x, y: coordinate.y + move.y };
            // not outside of board and not yet accessed
            var accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize && successor.y < boardSize && board[successor.x * boardSize + successor.y] === 0;
            if (accessible) {
                stack.push({ coordinate: successor, n: n + 1 });
            }
        }
    }
    return results;
}
function parallelJSKnightTours(start, boardSize) {
    function successors(coordinate) {
        var moves = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }];
        var result = [];
        for (var i = 0; i < moves.length; ++i) {
            var move = moves[i];
            var successor = { x: coordinate.x + move.x, y: coordinate.y + move.y };
            var accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize && successor.y < boardSize && (successor.x !== start.x || successor.y !== start.y) && successor.x !== coordinate.x && successor.y !== coordinate.y;
            if (accessible) {
                result.push(successor);
            }
        }
        return result;
    }
    function computeStartFields() {
        var result = [];
        for (var _iterator = successors(start), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var directSuccessor = _ref;

            for (var _iterator2 = successors(directSuccessor), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var indirectSuccessor = _ref2;

                result.push([start, directSuccessor, indirectSuccessor]);
            }
        }
        return result;
    }
    return new Parallel(computeStartFields(), { env: { boardSize: boardSize } }).require(knightTours).map(function (startField) {
        return knightTours(startField, global.env.boardSize);
    }).reduce(function (toursPerRun) {
        return toursPerRun.reduce(function (memo, current) {
            return memo + current;
        }, 0);
    });
    // The reduce operation needs to wait until the map operation is complete, switches back to the main thread and then
    // a new worker is spawned for each reduce step, e.g. for [1, 2, 3, 4, 5, 6] the three workers with [1, 2], [3, 4], [5, 6]
    // then the sub sequent workers [3, 7] and finally, [10, 11] are spawned...
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/buildin/global.js */ 1)))

/***/ },
/* 12 */
/* exports provided: computeMandelbrotLine, parallelJSMandelbrot */
/* exports used: parallelJSMandelbrot */
/*!**************************************!*\
  !*** ./src/paralleljs/mandelbrot.ts ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(/*! lodash */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* unused harmony export computeMandelbrotLine */
/* harmony export (immutable) */ exports["a"] = parallelJSMandelbrot;
var Parallel = __webpack_require__(/*! paralleljs */ 9);

function computeMandelbrotLine(y, options) {
    function calculateZ(c) {
        var z = { i: c.i, real: c.real };
        var n = 0;
        for (; n < options.iterations; ++n) {
            if (Math.pow(z.real, 2) + Math.pow(z.i, 2) > 4) {
                break;
            }
            // z ** 2 + c
            var zI = z.i;
            z.i = 2 * z.real * z.i + c.i;
            z.real = Math.pow(z.real, 2) - Math.pow(zI, 2) + c.real;
        }
        return n;
    }
    var line = new Uint8ClampedArray(options.imageWidth * 4);
    var cI = options.max.i - y * options.scalingFactor.i;
    for (var x = 0; x < options.imageWidth; ++x) {
        var c = {
            i: cI,
            real: options.min.real + x * options.scalingFactor.real
        };
        var n = calculateZ(c);
        var base = x * 4;
        /* tslint:disable:no-bitwise */
        line[base] = n & 0xFF;
        line[base + 1] = n & 0xFF00;
        line[base + 2] = n & 0xFF0000;
        line[base + 3] = 255;
    }
    return line;
}
function parallelJSMandelbrot(mandelbrotOptions) {
    var lines = __WEBPACK_IMPORTED_MODULE_0_lodash__["range"](mandelbrotOptions.imageHeight);
    return new Parallel(lines, { env: mandelbrotOptions }).require(computeMandelbrotLine).map(function (line) {
        return computeMandelbrotLine(line, global.env);
    });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/buildin/global.js */ 1)))

/***/ },
/* 13 */
/* exports provided: parallelJSMonteCarlo */
/* exports used: parallelJSMonteCarlo */
/*!***************************************!*\
  !*** ./src/paralleljs/monte-carlo.ts ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (immutable) */ exports["a"] = parallelJSMonteCarlo;
var Parallel = __webpack_require__(/*! paralleljs */ 9);
function initializeOptions(options) {
    return Object.assign({}, {
        investmentAmount: 1000000,
        liquidity: 10000,
        numRuns: 10000,
        numYears: 10,
        performance: 0,
        projects: [],
        seed: undefined,
        volatility: 0.01
    }, options);
}
function createMonteCarloEnvironment(options) {
    var random = new self.Random();
    /**
     * Performs the monte carlo simulation for all years and num runs.
     * @param cashFlows the cash flows
     * @returns {number[][]} the simulated outcomes grouped by year
     */
    function simulateOutcomes(cashFlows, numYears) {
        function toAbsoluteIndices(indices) {
            var currentPortfolioValue = options.investmentAmount;
            var previousYearIndex = 100;
            for (var relativeYear = 0; relativeYear < indices.length; ++relativeYear) {
                var currentYearIndex = indices[relativeYear];
                var cashFlowStartOfYear = relativeYear === 0 ? 0 : cashFlows[relativeYear - 1];
                // scale current value with performance gain according to index
                var performance = currentYearIndex / previousYearIndex;
                currentPortfolioValue = (currentPortfolioValue + cashFlowStartOfYear) * performance;
                indices[relativeYear] = 1 + random.normal(performance, options.volatility);
                previousYearIndex = currentYearIndex;
            }
            return indices;
        }
        var result = new Array(options.numYears);
        for (var year = 0; year <= numYears; ++year) {
            result[year] = new Array(options.numRuns);
        }
        for (var run = 0; run < options.numRuns; run++) {
            var indices = [100];
            for (var i = 1; i <= numYears; i++) {
                // const randomPerformance = 1 + random.normal(options.performance, options.volatility);
                var randomPerformance = 1 + Math.random();
                indices.push(indices[i - 1] * randomPerformance);
            }
            // convert the relative values from above to absolute values.
            toAbsoluteIndices(indices);
            for (var _year = 0; _year < indices.length; ++_year) {
                result[_year][run] = indices[_year];
            }
        }
        return result;
    }
    function projectsToCashFlows() {
        var cashFlows = [];
        for (var year = 0; year < options.numYears; ++year) {
            var projectsByThisYear = projectsByStartYear[year] || [];
            var cashFlow = -projectsByThisYear.reduce(function (memo, project) {
                return memo + project.totalAmount;
            }, 0);
            cashFlows.push(cashFlow);
        }
        return cashFlows;
    }
    function calculateNoInterestReferenceLine(cashFlows) {
        var noInterestReferenceLine = [];
        var investmentAmountLeft = options.investmentAmount;
        for (var year = 0; year < options.numYears; ++year) {
            investmentAmountLeft = investmentAmountLeft + cashFlows[year];
            noInterestReferenceLine.push(investmentAmountLeft);
        }
        return noInterestReferenceLine;
    }
    var projectsToSimulate = options.projects;
    if (options.taskIndex && options.valuesPerWorker) {
        projectsToSimulate = options.projects.slice(options.taskIndex * options.valuesPerWorker, (options.taskIndex + 1) * options.valuesPerWorker);
    }
    var projects = options.projects.sort(function (a, b) {
        return a.startYear - b.startYear;
    });
    // Group projects by startYear, use lodash groupBy instead
    var projectsByStartYear = {};
    for (var _iterator = projects, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
        }

        var project = _ref;

        var arr = projectsByStartYear[project.startYear] = projectsByStartYear[project.startYear] || [];
        arr.push(project);
    }
    var cashFlows = projectsToCashFlows();
    var noInterestReferenceLine = calculateNoInterestReferenceLine(cashFlows);
    var numYears = projectsToSimulate.reduce(function (memo, project) {
        return Math.max(memo, project.startYear);
    }, 0);
    return {
        investmentAmount: options.investmentAmount,
        liquidity: options.liquidity,
        noInterestReferenceLine: noInterestReferenceLine,
        numRuns: options.numRuns,
        numYears: numYears,
        projectsByStartYear: projectsByStartYear,
        simulatedValues: simulateOutcomes(cashFlows, numYears)
    };
}
function calculateProject(project, environment) {
    var NUMBER_OF_BUCKETS = 10;
    function groupForValue(value, groups) {
        return groups.find(function (group) {
            return (typeof group.from === "undefined" || group.from <= value) && (typeof group.to === "undefined" || group.to > value);
        });
    }
    function createGroups(requiredAmount, noInterestReference) {
        return [{ description: "Ziel erreichbar", from: requiredAmount, name: "green", percentage: 0, separator: true }, { description: "mit Zusatzliquidität erreichbar", from: requiredAmount - environment.liquidity, name: "yellow", percentage: 0, separator: true, to: requiredAmount }, { description: "nicht erreichbar", from: noInterestReference, name: "gray", percentage: 0, separator: false, to: requiredAmount - environment.liquidity }, { description: "nicht erreichbar, mit Verlust", name: "red", percentage: 0, separator: false, to: noInterestReference }];
    }
    function calculateRequiredAmount() {
        var amount = project.totalAmount;
        var projectsSameYear = environment.projectsByStartYear[project.startYear];
        for (var _iterator2 = projectsSameYear, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var otherProject = _ref2;

            if (otherProject === project) {
                break;
            }
            amount += otherProject.totalAmount;
        }
        return amount;
    }
    function median(values) {
        var half = Math.floor(values.length / 2);
        if (values.length % 2) {
            return values[half];
        }
        return (values[half - 1] + values[half]) / 2.0;
    }
    var requiredAmount = calculateRequiredAmount();
    var simulatedValuesThisYear = environment.simulatedValues[project.startYear];
    simulatedValuesThisYear.sort(function (a, b) {
        return a - b;
    });
    var groups = createGroups(requiredAmount, environment.noInterestReferenceLine[project.startYear]);
    var valuesByGroup = {};
    var bucketSize = Math.round(simulatedValuesThisYear.length / NUMBER_OF_BUCKETS);
    var buckets = [];
    for (var i = 0; i < simulatedValuesThisYear.length; i += bucketSize) {
        var bucket = {
            max: Number.MIN_VALUE,
            min: Number.MAX_VALUE,
            subBuckets: {}
        };
        for (var j = i; j < i + bucketSize; ++j) {
            var value = simulatedValuesThisYear[j];
            bucket.min = Math.min(bucket.min, value);
            bucket.max = Math.max(bucket.max, value);
            var group = groupForValue(simulatedValuesThisYear[j], groups);
            valuesByGroup[group.name] = (valuesByGroup[group.name] || 0) + 1;
            var subBucket = bucket.subBuckets[group.name] = bucket.subBuckets[group.name] || { group: group.name, max: Number.MIN_VALUE, min: Number.MAX_VALUE };
            subBucket.min = Math.min(subBucket.min, value);
            subBucket.max = Math.max(subBucket.max, value);
        }
        buckets.push(bucket);
    }
    var nonEmptyGroups = groups.filter(function (group) {
        return !!valuesByGroup[group.name];
    });
    nonEmptyGroups.forEach(function (group) {
        return group.percentage = valuesByGroup[group.name] / simulatedValuesThisYear.length;
    });
    var oneSixth = Math.round(simulatedValuesThisYear.length / 6);
    return {
        buckets: buckets,
        groups: nonEmptyGroups,
        max: simulatedValuesThisYear[simulatedValuesThisYear.length - 1],
        median: median(simulatedValuesThisYear),
        min: simulatedValuesThisYear[0],
        project: project,
        twoThird: {
            max: simulatedValuesThisYear[simulatedValuesThisYear.length - oneSixth],
            min: simulatedValuesThisYear[oneSixth]
        }
    };
}
function parallelJSMonteCarlo(userOptions) {
    var options = initializeOptions(userOptions);
    // Array needs to be cloned, otherwise the original array is manipulated!
    return new Parallel(options.projects.slice(), {
        evalPath: "./" + __webpack_require__(/*! file!paralleljs/lib/eval.js */ 16),
        env: options,
        envNamespace: "options"
    }).require("https://raw.githubusercontent.com/mvarshney/simjs-source/master/src/random.js") // the one from node uses module syntax
    .require(createMonteCarloEnvironment).require(calculateProject).map(function (project) {
        var env = createMonteCarloEnvironment(global.options);
        return calculateProject(project, env);
    });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/buildin/global.js */ 1)))

/***/ },
/* 14 */
/* unknown exports provided */
/* exports used: runInContext */
/*!**********************************!*\
  !*** ./~/benchmark/benchmark.js ***!
  \**********************************/
/***/ function(module, exports) {

/*!
 * Benchmark.js <https://benchmarkjs.com/>
 * Copyright 2010-2016 Mathias Bynens <https://mths.be/>
 * Based on JSLitmus.js, copyright Robert Kieffer <http://broofa.com/>
 * Modified by John-David Dalton <http://allyoucanleet.com/>
 * Available under MIT license <https://mths.be/mit>
 */
;(function() {
  'use strict';

  /** Used as a safe reference for `undefined` in pre ES5 environments. */
  var undefined;

  /** Used to determine if values are of the language type Object. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used as a reference to the global object. */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `define`. */
  var freeDefine = typeof define == 'function' && typeof define.amd == 'object' && define.amd && define;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /** Detect free variable `require`. */
  var freeRequire = typeof require == 'function' && require;

  /** Used to assign each benchmark an incremented id. */
  var counter = 0;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Used to detect primitive types. */
  var rePrimitive = /^(?:boolean|number|string|undefined)$/;

  /** Used to make every compiled test unique. */
  var uidCounter = 0;

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'Date', 'Function', 'Math', 'Object', 'RegExp', 'String', '_',
    'clearTimeout', 'chrome', 'chromium', 'document', 'navigator', 'phantom',
    'platform', 'process', 'runtime', 'setTimeout'
  ];

  /** Used to avoid hz of Infinity. */
  var divisors = {
    '1': 4096,
    '2': 512,
    '3': 64,
    '4': 8,
    '5': 0
  };

  /**
   * T-Distribution two-tailed critical values for 95% confidence.
   * For more info see http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm.
   */
  var tTable = {
    '1':  12.706, '2':  4.303, '3':  3.182, '4':  2.776, '5':  2.571, '6':  2.447,
    '7':  2.365,  '8':  2.306, '9':  2.262, '10': 2.228, '11': 2.201, '12': 2.179,
    '13': 2.16,   '14': 2.145, '15': 2.131, '16': 2.12,  '17': 2.11,  '18': 2.101,
    '19': 2.093,  '20': 2.086, '21': 2.08,  '22': 2.074, '23': 2.069, '24': 2.064,
    '25': 2.06,   '26': 2.056, '27': 2.052, '28': 2.048, '29': 2.045, '30': 2.042,
    'infinity': 1.96
  };

  /**
   * Critical Mann-Whitney U-values for 95% confidence.
   * For more info see http://www.saburchill.com/IBbiology/stats/003.html.
   */
  var uTable = {
    '5':  [0, 1, 2],
    '6':  [1, 2, 3, 5],
    '7':  [1, 3, 5, 6, 8],
    '8':  [2, 4, 6, 8, 10, 13],
    '9':  [2, 4, 7, 10, 12, 15, 17],
    '10': [3, 5, 8, 11, 14, 17, 20, 23],
    '11': [3, 6, 9, 13, 16, 19, 23, 26, 30],
    '12': [4, 7, 11, 14, 18, 22, 26, 29, 33, 37],
    '13': [4, 8, 12, 16, 20, 24, 28, 33, 37, 41, 45],
    '14': [5, 9, 13, 17, 22, 26, 31, 36, 40, 45, 50, 55],
    '15': [5, 10, 14, 19, 24, 29, 34, 39, 44, 49, 54, 59, 64],
    '16': [6, 11, 15, 21, 26, 31, 37, 42, 47, 53, 59, 64, 70, 75],
    '17': [6, 11, 17, 22, 28, 34, 39, 45, 51, 57, 63, 67, 75, 81, 87],
    '18': [7, 12, 18, 24, 30, 36, 42, 48, 55, 61, 67, 74, 80, 86, 93, 99],
    '19': [7, 13, 19, 25, 32, 38, 45, 52, 58, 65, 72, 78, 85, 92, 99, 106, 113],
    '20': [8, 14, 20, 27, 34, 41, 48, 55, 62, 69, 76, 83, 90, 98, 105, 112, 119, 127],
    '21': [8, 15, 22, 29, 36, 43, 50, 58, 65, 73, 80, 88, 96, 103, 111, 119, 126, 134, 142],
    '22': [9, 16, 23, 30, 38, 45, 53, 61, 69, 77, 85, 93, 101, 109, 117, 125, 133, 141, 150, 158],
    '23': [9, 17, 24, 32, 40, 48, 56, 64, 73, 81, 89, 98, 106, 115, 123, 132, 140, 149, 157, 166, 175],
    '24': [10, 17, 25, 33, 42, 50, 59, 67, 76, 85, 94, 102, 111, 120, 129, 138, 147, 156, 165, 174, 183, 192],
    '25': [10, 18, 27, 35, 44, 53, 62, 71, 80, 89, 98, 107, 117, 126, 135, 145, 154, 163, 173, 182, 192, 201, 211],
    '26': [11, 19, 28, 37, 46, 55, 64, 74, 83, 93, 102, 112, 122, 132, 141, 151, 161, 171, 181, 191, 200, 210, 220, 230],
    '27': [11, 20, 29, 38, 48, 57, 67, 77, 87, 97, 107, 118, 125, 138, 147, 158, 168, 178, 188, 199, 209, 219, 230, 240, 250],
    '28': [12, 21, 30, 40, 50, 60, 70, 80, 90, 101, 111, 122, 132, 143, 154, 164, 175, 186, 196, 207, 218, 228, 239, 250, 261, 272],
    '29': [13, 22, 32, 42, 52, 62, 73, 83, 94, 105, 116, 127, 138, 149, 160, 171, 182, 193, 204, 215, 226, 238, 249, 260, 271, 282, 294],
    '30': [13, 23, 33, 43, 54, 65, 76, 87, 98, 109, 120, 131, 143, 154, 166, 177, 189, 200, 212, 223, 235, 247, 258, 270, 282, 293, 305, 317]
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `Benchmark` function using the given `context` object.
   *
   * @static
   * @memberOf Benchmark
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `Benchmark` function.
   */
  function runInContext(context) {
    // Exit early if unable to acquire lodash.
    var _ = context && context._ || require('lodash') || root._;
    if (!_) {
      Benchmark.runInContext = runInContext;
      return Benchmark;
    }
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String;

    /** Used for `Array` and `Object` method references. */
    var arrayRef = [],
        objectProto = Object.prototype;

    /** Native method shortcuts. */
    var abs = Math.abs,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        log = Math.log,
        max = Math.max,
        min = Math.min,
        pow = Math.pow,
        push = arrayRef.push,
        setTimeout = context.setTimeout,
        shift = arrayRef.shift,
        slice = arrayRef.slice,
        sqrt = Math.sqrt,
        toString = objectProto.toString,
        unshift = arrayRef.unshift;

    /** Used to avoid inclusion in Browserified bundles. */
    var req = require;

    /** Detect DOM document object. */
    var doc = isHostType(context, 'document') && context.document;

    /** Used to access Wade Simmons' Node.js `microtime` module. */
    var microtimeObject = req('microtime');

    /** Used to access Node.js's high resolution timer. */
    var processObject = isHostType(context, 'process') && context.process;

    /** Used to prevent a `removeChild` memory leak in IE < 9. */
    var trash = doc && doc.createElement('div');

    /** Used to integrity check compiled tests. */
    var uid = 'uid' + _.now();

    /** Used to avoid infinite recursion when methods call each other. */
    var calledBy = {};

    /**
     * An object used to flag environments/features.
     *
     * @static
     * @memberOf Benchmark
     * @type Object
     */
    var support = {};

    (function() {

      /**
       * Detect if running in a browser environment.
       *
       * @memberOf Benchmark.support
       * @type boolean
       */
      support.browser = doc && isHostType(context, 'navigator') && !isHostType(context, 'phantom');

      /**
       * Detect if the Timers API exists.
       *
       * @memberOf Benchmark.support
       * @type boolean
       */
      support.timeout = isHostType(context, 'setTimeout') && isHostType(context, 'clearTimeout');

      /**
       * Detect if function decompilation is support.
       *
       * @name decompilation
       * @memberOf Benchmark.support
       * @type boolean
       */
      try {
        // Safari 2.x removes commas in object literals from `Function#toString` results.
        // See http://webk.it/11609 for more details.
        // Firefox 3.6 and Opera 9.25 strip grouping parentheses from `Function#toString` results.
        // See http://bugzil.la/559438 for more details.
        support.decompilation = Function(
          ('return (' + (function(x) { return { 'x': '' + (1 + x) + '', 'y': 0 }; }) + ')')
          // Avoid issues with code added by Istanbul.
          .replace(/__cov__[^;]+;/g, '')
        )()(0).x === '1';
      } catch(e) {
        support.decompilation = false;
      }
    }());

    /**
     * Timer object used by `clock()` and `Deferred#resolve`.
     *
     * @private
     * @type Object
     */
    var timer = {

      /**
       * The timer namespace object or constructor.
       *
       * @private
       * @memberOf timer
       * @type {Function|Object}
       */
      'ns': Date,

      /**
       * Starts the deferred timer.
       *
       * @private
       * @memberOf timer
       * @param {Object} deferred The deferred instance.
       */
      'start': null, // Lazy defined in `clock()`.

      /**
       * Stops the deferred timer.
       *
       * @private
       * @memberOf timer
       * @param {Object} deferred The deferred instance.
       */
      'stop': null // Lazy defined in `clock()`.
    };

    /*------------------------------------------------------------------------*/

    /**
     * The Benchmark constructor.
     *
     * Note: The Benchmark constructor exposes a handful of lodash methods to
     * make working with arrays, collections, and objects easier. The lodash
     * methods are:
     * [`each/forEach`](https://lodash.com/docs#forEach), [`forOwn`](https://lodash.com/docs#forOwn),
     * [`has`](https://lodash.com/docs#has), [`indexOf`](https://lodash.com/docs#indexOf),
     * [`map`](https://lodash.com/docs#map), and [`reduce`](https://lodash.com/docs#reduce)
     *
     * @constructor
     * @param {string} name A name to identify the benchmark.
     * @param {Function|string} fn The test to benchmark.
     * @param {Object} [options={}] Options object.
     * @example
     *
     * // basic usage (the `new` operator is optional)
     * var bench = new Benchmark(fn);
     *
     * // or using a name first
     * var bench = new Benchmark('foo', fn);
     *
     * // or with options
     * var bench = new Benchmark('foo', fn, {
     *
     *   // displayed by `Benchmark#toString` if `name` is not available
     *   'id': 'xyz',
     *
     *   // called when the benchmark starts running
     *   'onStart': onStart,
     *
     *   // called after each run cycle
     *   'onCycle': onCycle,
     *
     *   // called when aborted
     *   'onAbort': onAbort,
     *
     *   // called when a test errors
     *   'onError': onError,
     *
     *   // called when reset
     *   'onReset': onReset,
     *
     *   // called when the benchmark completes running
     *   'onComplete': onComplete,
     *
     *   // compiled/called before the test loop
     *   'setup': setup,
     *
     *   // compiled/called after the test loop
     *   'teardown': teardown
     * });
     *
     * // or name and options
     * var bench = new Benchmark('foo', {
     *
     *   // a flag to indicate the benchmark is deferred
     *   'defer': true,
     *
     *   // benchmark test function
     *   'fn': function(deferred) {
     *     // call `Deferred#resolve` when the deferred test is finished
     *     deferred.resolve();
     *   }
     * });
     *
     * // or options only
     * var bench = new Benchmark({
     *
     *   // benchmark name
     *   'name': 'foo',
     *
     *   // benchmark test as a string
     *   'fn': '[1,2,3,4].sort()'
     * });
     *
     * // a test's `this` binding is set to the benchmark instance
     * var bench = new Benchmark('foo', function() {
     *   'My name is '.concat(this.name); // "My name is foo"
     * });
     */
    function Benchmark(name, fn, options) {
      var bench = this;

      // Allow instance creation without the `new` operator.
      if (!(bench instanceof Benchmark)) {
        return new Benchmark(name, fn, options);
      }
      // Juggle arguments.
      if (_.isPlainObject(name)) {
        // 1 argument (options).
        options = name;
      }
      else if (_.isFunction(name)) {
        // 2 arguments (fn, options).
        options = fn;
        fn = name;
      }
      else if (_.isPlainObject(fn)) {
        // 2 arguments (name, options).
        options = fn;
        fn = null;
        bench.name = name;
      }
      else {
        // 3 arguments (name, fn [, options]).
        bench.name = name;
      }
      setOptions(bench, options);

      bench.id || (bench.id = ++counter);
      bench.fn == null && (bench.fn = fn);

      bench.stats = cloneDeep(bench.stats);
      bench.times = cloneDeep(bench.times);
    }

    /**
     * The Deferred constructor.
     *
     * @constructor
     * @memberOf Benchmark
     * @param {Object} clone The cloned benchmark instance.
     */
    function Deferred(clone) {
      var deferred = this;
      if (!(deferred instanceof Deferred)) {
        return new Deferred(clone);
      }
      deferred.benchmark = clone;
      clock(deferred);
    }

    /**
     * The Event constructor.
     *
     * @constructor
     * @memberOf Benchmark
     * @param {Object|string} type The event type.
     */
    function Event(type) {
      var event = this;
      if (type instanceof Event) {
        return type;
      }
      return (event instanceof Event)
        ? _.assign(event, { 'timeStamp': _.now() }, typeof type == 'string' ? { 'type': type } : type)
        : new Event(type);
    }

    /**
     * The Suite constructor.
     *
     * Note: Each Suite instance has a handful of wrapped lodash methods to
     * make working with Suites easier. The wrapped lodash methods are:
     * [`each/forEach`](https://lodash.com/docs#forEach), [`indexOf`](https://lodash.com/docs#indexOf),
     * [`map`](https://lodash.com/docs#map), and [`reduce`](https://lodash.com/docs#reduce)
     *
     * @constructor
     * @memberOf Benchmark
     * @param {string} name A name to identify the suite.
     * @param {Object} [options={}] Options object.
     * @example
     *
     * // basic usage (the `new` operator is optional)
     * var suite = new Benchmark.Suite;
     *
     * // or using a name first
     * var suite = new Benchmark.Suite('foo');
     *
     * // or with options
     * var suite = new Benchmark.Suite('foo', {
     *
     *   // called when the suite starts running
     *   'onStart': onStart,
     *
     *   // called between running benchmarks
     *   'onCycle': onCycle,
     *
     *   // called when aborted
     *   'onAbort': onAbort,
     *
     *   // called when a test errors
     *   'onError': onError,
     *
     *   // called when reset
     *   'onReset': onReset,
     *
     *   // called when the suite completes running
     *   'onComplete': onComplete
     * });
     */
    function Suite(name, options) {
      var suite = this;

      // Allow instance creation without the `new` operator.
      if (!(suite instanceof Suite)) {
        return new Suite(name, options);
      }
      // Juggle arguments.
      if (_.isPlainObject(name)) {
        // 1 argument (options).
        options = name;
      } else {
        // 2 arguments (name [, options]).
        suite.name = name;
      }
      setOptions(suite, options);
    }

    /*------------------------------------------------------------------------*/

    /**
     * A specialized version of `_.cloneDeep` which only clones arrays and plain
     * objects assigning all other values by reference.
     *
     * @private
     * @param {*} value The value to clone.
     * @returns {*} The cloned value.
     */
    var cloneDeep = _.partial(_.cloneDeepWith, _, function(value) {
      // Only clone primitives, arrays, and plain objects.
      return (_.isObject(value) && !_.isArray(value) && !_.isPlainObject(value))
        ? value
        : undefined;
    });

    /**
     * Creates a function from the given arguments string and body.
     *
     * @private
     * @param {string} args The comma separated function arguments.
     * @param {string} body The function body.
     * @returns {Function} The new function.
     */
    function createFunction() {
      // Lazy define.
      createFunction = function(args, body) {
        var result,
            anchor = freeDefine ? freeDefine.amd : Benchmark,
            prop = uid + 'createFunction';

        runScript((freeDefine ? 'define.amd.' : 'Benchmark.') + prop + '=function(' + args + '){' + body + '}');
        result = anchor[prop];
        delete anchor[prop];
        return result;
      };
      // Fix JaegerMonkey bug.
      // For more information see http://bugzil.la/639720.
      createFunction = support.browser && (createFunction('', 'return"' + uid + '"') || _.noop)() == uid ? createFunction : Function;
      return createFunction.apply(null, arguments);
    }

    /**
     * Delay the execution of a function based on the benchmark's `delay` property.
     *
     * @private
     * @param {Object} bench The benchmark instance.
     * @param {Object} fn The function to execute.
     */
    function delay(bench, fn) {
      bench._timerId = _.delay(fn, bench.delay * 1e3);
    }

    /**
     * Destroys the given element.
     *
     * @private
     * @param {Element} element The element to destroy.
     */
    function destroyElement(element) {
      trash.appendChild(element);
      trash.innerHTML = '';
    }

    /**
     * Gets the name of the first argument from a function's source.
     *
     * @private
     * @param {Function} fn The function.
     * @returns {string} The argument name.
     */
    function getFirstArgument(fn) {
      return (!_.has(fn, 'toString') &&
        (/^[\s(]*function[^(]*\(([^\s,)]+)/.exec(fn) || 0)[1]) || '';
    }

    /**
     * Computes the arithmetic mean of a sample.
     *
     * @private
     * @param {Array} sample The sample.
     * @returns {number} The mean.
     */
    function getMean(sample) {
      return (_.reduce(sample, function(sum, x) {
        return sum + x;
      }) / sample.length) || 0;
    }

    /**
     * Gets the source code of a function.
     *
     * @private
     * @param {Function} fn The function.
     * @returns {string} The function's source code.
     */
    function getSource(fn) {
      var result = '';
      if (isStringable(fn)) {
        result = String(fn);
      } else if (support.decompilation) {
        // Escape the `{` for Firefox 1.
        result = _.result(/^[^{]+\{([\s\S]*)\}\s*$/.exec(fn), 1);
      }
      // Trim string.
      result = (result || '').replace(/^\s+|\s+$/g, '');

      // Detect strings containing only the "use strict" directive.
      return /^(?:\/\*+[\w\W]*?\*\/|\/\/.*?[\n\r\u2028\u2029]|\s)*(["'])use strict\1;?$/.test(result)
        ? ''
        : result;
    }

    /**
     * Checks if an object is of the specified class.
     *
     * @private
     * @param {*} value The value to check.
     * @param {string} name The name of the class.
     * @returns {boolean} Returns `true` if the value is of the specified class, else `false`.
     */
    function isClassOf(value, name) {
      return value != null && toString.call(value) == '[object ' + name + ']';
    }

    /**
     * Host objects can return type values that are different from their actual
     * data type. The objects we are concerned with usually return non-primitive
     * types of "object", "function", or "unknown".
     *
     * @private
     * @param {*} object The owner of the property.
     * @param {string} property The property to check.
     * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
     */
    function isHostType(object, property) {
      if (object == null) {
        return false;
      }
      var type = typeof object[property];
      return !rePrimitive.test(type) && (type != 'object' || !!object[property]);
    }

    /**
     * Checks if a value can be safely coerced to a string.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the value can be coerced, else `false`.
     */
    function isStringable(value) {
      return _.isString(value) || (_.has(value, 'toString') && _.isFunction(value.toString));
    }

    /**
     * A wrapper around `require` to suppress `module missing` errors.
     *
     * @private
     * @param {string} id The module id.
     * @returns {*} The exported module or `null`.
     */
    function require(id) {
      try {
        var result = freeExports && freeRequire(id);
      } catch(e) {}
      return result || null;
    }

    /**
     * Runs a snippet of JavaScript via script injection.
     *
     * @private
     * @param {string} code The code to run.
     */
    function runScript(code) {
      var anchor = freeDefine ? define.amd : Benchmark,
          script = doc.createElement('script'),
          sibling = doc.getElementsByTagName('script')[0],
          parent = sibling.parentNode,
          prop = uid + 'runScript',
          prefix = '(' + (freeDefine ? 'define.amd.' : 'Benchmark.') + prop + '||function(){})();';

      // Firefox 2.0.0.2 cannot use script injection as intended because it executes
      // asynchronously, but that's OK because script injection is only used to avoid
      // the previously commented JaegerMonkey bug.
      try {
        // Remove the inserted script *before* running the code to avoid differences
        // in the expected script element count/order of the document.
        script.appendChild(doc.createTextNode(prefix + code));
        anchor[prop] = function() { destroyElement(script); };
      } catch(e) {
        parent = parent.cloneNode(false);
        sibling = null;
        script.text = code;
      }
      parent.insertBefore(script, sibling);
      delete anchor[prop];
    }

    /**
     * A helper function for setting options/event handlers.
     *
     * @private
     * @param {Object} object The benchmark or suite instance.
     * @param {Object} [options={}] Options object.
     */
    function setOptions(object, options) {
      options = object.options = _.assign({}, cloneDeep(object.constructor.options), cloneDeep(options));

      _.forOwn(options, function(value, key) {
        if (value != null) {
          // Add event listeners.
          if (/^on[A-Z]/.test(key)) {
            _.each(key.split(' '), function(key) {
              object.on(key.slice(2).toLowerCase(), value);
            });
          } else if (!_.has(object, key)) {
            object[key] = cloneDeep(value);
          }
        }
      });
    }

    /*------------------------------------------------------------------------*/

    /**
     * Handles cycling/completing the deferred benchmark.
     *
     * @memberOf Benchmark.Deferred
     */
    function resolve() {
      var deferred = this,
          clone = deferred.benchmark,
          bench = clone._original;

      if (bench.aborted) {
        // cycle() -> clone cycle/complete event -> compute()'s invoked bench.run() cycle/complete.
        deferred.teardown();
        clone.running = false;
        cycle(deferred);
      }
      else if (++deferred.cycles < clone.count) {
        clone.compiled.call(deferred, context, timer);
      }
      else {
        timer.stop(deferred);
        deferred.teardown();
        delay(clone, function() { cycle(deferred); });
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * A generic `Array#filter` like method.
     *
     * @static
     * @memberOf Benchmark
     * @param {Array} array The array to iterate over.
     * @param {Function|string} callback The function/alias called per iteration.
     * @returns {Array} A new array of values that passed callback filter.
     * @example
     *
     * // get odd numbers
     * Benchmark.filter([1, 2, 3, 4, 5], function(n) {
     *   return n % 2;
     * }); // -> [1, 3, 5];
     *
     * // get fastest benchmarks
     * Benchmark.filter(benches, 'fastest');
     *
     * // get slowest benchmarks
     * Benchmark.filter(benches, 'slowest');
     *
     * // get benchmarks that completed without erroring
     * Benchmark.filter(benches, 'successful');
     */
    function filter(array, callback) {
      if (callback === 'successful') {
        // Callback to exclude those that are errored, unrun, or have hz of Infinity.
        callback = function(bench) {
          return bench.cycles && _.isFinite(bench.hz) && !bench.error;
        };
      }
      else if (callback === 'fastest' || callback === 'slowest') {
        // Get successful, sort by period + margin of error, and filter fastest/slowest.
        var result = filter(array, 'successful').sort(function(a, b) {
          a = a.stats; b = b.stats;
          return (a.mean + a.moe > b.mean + b.moe ? 1 : -1) * (callback === 'fastest' ? 1 : -1);
        });

        return _.filter(result, function(bench) {
          return result[0].compare(bench) == 0;
        });
      }
      return _.filter(array, callback);
    }

    /**
     * Converts a number to a more readable comma-separated string representation.
     *
     * @static
     * @memberOf Benchmark
     * @param {number} number The number to convert.
     * @returns {string} The more readable string representation.
     */
    function formatNumber(number) {
      number = String(number).split('.');
      return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') +
        (number[1] ? '.' + number[1] : '');
    }

    /**
     * Invokes a method on all items in an array.
     *
     * @static
     * @memberOf Benchmark
     * @param {Array} benches Array of benchmarks to iterate over.
     * @param {Object|string} name The name of the method to invoke OR options object.
     * @param {...*} [args] Arguments to invoke the method with.
     * @returns {Array} A new array of values returned from each method invoked.
     * @example
     *
     * // invoke `reset` on all benchmarks
     * Benchmark.invoke(benches, 'reset');
     *
     * // invoke `emit` with arguments
     * Benchmark.invoke(benches, 'emit', 'complete', listener);
     *
     * // invoke `run(true)`, treat benchmarks as a queue, and register invoke callbacks
     * Benchmark.invoke(benches, {
     *
     *   // invoke the `run` method
     *   'name': 'run',
     *
     *   // pass a single argument
     *   'args': true,
     *
     *   // treat as queue, removing benchmarks from front of `benches` until empty
     *   'queued': true,
     *
     *   // called before any benchmarks have been invoked.
     *   'onStart': onStart,
     *
     *   // called between invoking benchmarks
     *   'onCycle': onCycle,
     *
     *   // called after all benchmarks have been invoked.
     *   'onComplete': onComplete
     * });
     */
    function invoke(benches, name) {
      var args,
          bench,
          queued,
          index = -1,
          eventProps = { 'currentTarget': benches },
          options = { 'onStart': _.noop, 'onCycle': _.noop, 'onComplete': _.noop },
          result = _.toArray(benches);

      /**
       * Invokes the method of the current object and if synchronous, fetches the next.
       */
      function execute() {
        var listeners,
            async = isAsync(bench);

        if (async) {
          // Use `getNext` as the first listener.
          bench.on('complete', getNext);
          listeners = bench.events.complete;
          listeners.splice(0, 0, listeners.pop());
        }
        // Execute method.
        result[index] = _.isFunction(bench && bench[name]) ? bench[name].apply(bench, args) : undefined;
        // If synchronous return `true` until finished.
        return !async && getNext();
      }

      /**
       * Fetches the next bench or executes `onComplete` callback.
       */
      function getNext(event) {
        var cycleEvent,
            last = bench,
            async = isAsync(last);

        if (async) {
          last.off('complete', getNext);
          last.emit('complete');
        }
        // Emit "cycle" event.
        eventProps.type = 'cycle';
        eventProps.target = last;
        cycleEvent = Event(eventProps);
        options.onCycle.call(benches, cycleEvent);

        // Choose next benchmark if not exiting early.
        if (!cycleEvent.aborted && raiseIndex() !== false) {
          bench = queued ? benches[0] : result[index];
          if (isAsync(bench)) {
            delay(bench, execute);
          }
          else if (async) {
            // Resume execution if previously asynchronous but now synchronous.
            while (execute()) {}
          }
          else {
            // Continue synchronous execution.
            return true;
          }
        } else {
          // Emit "complete" event.
          eventProps.type = 'complete';
          options.onComplete.call(benches, Event(eventProps));
        }
        // When used as a listener `event.aborted = true` will cancel the rest of
        // the "complete" listeners because they were already called above and when
        // used as part of `getNext` the `return false` will exit the execution while-loop.
        if (event) {
          event.aborted = true;
        } else {
          return false;
        }
      }

      /**
       * Checks if invoking `Benchmark#run` with asynchronous cycles.
       */
      function isAsync(object) {
        // Avoid using `instanceof` here because of IE memory leak issues with host objects.
        var async = args[0] && args[0].async;
        return name == 'run' && (object instanceof Benchmark) &&
          ((async == null ? object.options.async : async) && support.timeout || object.defer);
      }

      /**
       * Raises `index` to the next defined index or returns `false`.
       */
      function raiseIndex() {
        index++;

        // If queued remove the previous bench.
        if (queued && index > 0) {
          shift.call(benches);
        }
        // If we reached the last index then return `false`.
        return (queued ? benches.length : index < result.length)
          ? index
          : (index = false);
      }
      // Juggle arguments.
      if (_.isString(name)) {
        // 2 arguments (array, name).
        args = slice.call(arguments, 2);
      } else {
        // 2 arguments (array, options).
        options = _.assign(options, name);
        name = options.name;
        args = _.isArray(args = 'args' in options ? options.args : []) ? args : [args];
        queued = options.queued;
      }
      // Start iterating over the array.
      if (raiseIndex() !== false) {
        // Emit "start" event.
        bench = result[index];
        eventProps.type = 'start';
        eventProps.target = bench;
        options.onStart.call(benches, Event(eventProps));

        // End early if the suite was aborted in an "onStart" listener.
        if (name == 'run' && (benches instanceof Suite) && benches.aborted) {
          // Emit "cycle" event.
          eventProps.type = 'cycle';
          options.onCycle.call(benches, Event(eventProps));
          // Emit "complete" event.
          eventProps.type = 'complete';
          options.onComplete.call(benches, Event(eventProps));
        }
        // Start method execution.
        else {
          if (isAsync(bench)) {
            delay(bench, execute);
          } else {
            while (execute()) {}
          }
        }
      }
      return result;
    }

    /**
     * Creates a string of joined array values or object key-value pairs.
     *
     * @static
     * @memberOf Benchmark
     * @param {Array|Object} object The object to operate on.
     * @param {string} [separator1=','] The separator used between key-value pairs.
     * @param {string} [separator2=': '] The separator used between keys and values.
     * @returns {string} The joined result.
     */
    function join(object, separator1, separator2) {
      var result = [],
          length = (object = Object(object)).length,
          arrayLike = length === length >>> 0;

      separator2 || (separator2 = ': ');
      _.each(object, function(value, key) {
        result.push(arrayLike ? value : key + separator2 + value);
      });
      return result.join(separator1 || ',');
    }

    /*------------------------------------------------------------------------*/

    /**
     * Aborts all benchmarks in the suite.
     *
     * @name abort
     * @memberOf Benchmark.Suite
     * @returns {Object} The suite instance.
     */
    function abortSuite() {
      var event,
          suite = this,
          resetting = calledBy.resetSuite;

      if (suite.running) {
        event = Event('abort');
        suite.emit(event);
        if (!event.cancelled || resetting) {
          // Avoid infinite recursion.
          calledBy.abortSuite = true;
          suite.reset();
          delete calledBy.abortSuite;

          if (!resetting) {
            suite.aborted = true;
            invoke(suite, 'abort');
          }
        }
      }
      return suite;
    }

    /**
     * Adds a test to the benchmark suite.
     *
     * @memberOf Benchmark.Suite
     * @param {string} name A name to identify the benchmark.
     * @param {Function|string} fn The test to benchmark.
     * @param {Object} [options={}] Options object.
     * @returns {Object} The suite instance.
     * @example
     *
     * // basic usage
     * suite.add(fn);
     *
     * // or using a name first
     * suite.add('foo', fn);
     *
     * // or with options
     * suite.add('foo', fn, {
     *   'onCycle': onCycle,
     *   'onComplete': onComplete
     * });
     *
     * // or name and options
     * suite.add('foo', {
     *   'fn': fn,
     *   'onCycle': onCycle,
     *   'onComplete': onComplete
     * });
     *
     * // or options only
     * suite.add({
     *   'name': 'foo',
     *   'fn': fn,
     *   'onCycle': onCycle,
     *   'onComplete': onComplete
     * });
     */
    function add(name, fn, options) {
      var suite = this,
          bench = new Benchmark(name, fn, options),
          event = Event({ 'type': 'add', 'target': bench });

      if (suite.emit(event), !event.cancelled) {
        suite.push(bench);
      }
      return suite;
    }

    /**
     * Creates a new suite with cloned benchmarks.
     *
     * @name clone
     * @memberOf Benchmark.Suite
     * @param {Object} options Options object to overwrite cloned options.
     * @returns {Object} The new suite instance.
     */
    function cloneSuite(options) {
      var suite = this,
          result = new suite.constructor(_.assign({}, suite.options, options));

      // Copy own properties.
      _.forOwn(suite, function(value, key) {
        if (!_.has(result, key)) {
          result[key] = value && _.isFunction(value.clone)
            ? value.clone()
            : cloneDeep(value);
        }
      });
      return result;
    }

    /**
     * An `Array#filter` like method.
     *
     * @name filter
     * @memberOf Benchmark.Suite
     * @param {Function|string} callback The function/alias called per iteration.
     * @returns {Object} A new suite of benchmarks that passed callback filter.
     */
    function filterSuite(callback) {
      var suite = this,
          result = new suite.constructor(suite.options);

      result.push.apply(result, filter(suite, callback));
      return result;
    }

    /**
     * Resets all benchmarks in the suite.
     *
     * @name reset
     * @memberOf Benchmark.Suite
     * @returns {Object} The suite instance.
     */
    function resetSuite() {
      var event,
          suite = this,
          aborting = calledBy.abortSuite;

      if (suite.running && !aborting) {
        // No worries, `resetSuite()` is called within `abortSuite()`.
        calledBy.resetSuite = true;
        suite.abort();
        delete calledBy.resetSuite;
      }
      // Reset if the state has changed.
      else if ((suite.aborted || suite.running) &&
          (suite.emit(event = Event('reset')), !event.cancelled)) {
        suite.aborted = suite.running = false;
        if (!aborting) {
          invoke(suite, 'reset');
        }
      }
      return suite;
    }

    /**
     * Runs the suite.
     *
     * @name run
     * @memberOf Benchmark.Suite
     * @param {Object} [options={}] Options object.
     * @returns {Object} The suite instance.
     * @example
     *
     * // basic usage
     * suite.run();
     *
     * // or with options
     * suite.run({ 'async': true, 'queued': true });
     */
    function runSuite(options) {
      var suite = this;

      suite.reset();
      suite.running = true;
      options || (options = {});

      invoke(suite, {
        'name': 'run',
        'args': options,
        'queued': options.queued,
        'onStart': function(event) {
          suite.emit(event);
        },
        'onCycle': function(event) {
          var bench = event.target;
          if (bench.error) {
            suite.emit({ 'type': 'error', 'target': bench });
          }
          suite.emit(event);
          event.aborted = suite.aborted;
        },
        'onComplete': function(event) {
          suite.running = false;
          suite.emit(event);
        }
      });
      return suite;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Executes all registered listeners of the specified event type.
     *
     * @memberOf Benchmark, Benchmark.Suite
     * @param {Object|string} type The event type or object.
     * @param {...*} [args] Arguments to invoke the listener with.
     * @returns {*} Returns the return value of the last listener executed.
     */
    function emit(type) {
      var listeners,
          object = this,
          event = Event(type),
          events = object.events,
          args = (arguments[0] = event, arguments);

      event.currentTarget || (event.currentTarget = object);
      event.target || (event.target = object);
      delete event.result;

      if (events && (listeners = _.has(events, event.type) && events[event.type])) {
        _.each(listeners.slice(), function(listener) {
          if ((event.result = listener.apply(object, args)) === false) {
            event.cancelled = true;
          }
          return !event.aborted;
        });
      }
      return event.result;
    }

    /**
     * Returns an array of event listeners for a given type that can be manipulated
     * to add or remove listeners.
     *
     * @memberOf Benchmark, Benchmark.Suite
     * @param {string} type The event type.
     * @returns {Array} The listeners array.
     */
    function listeners(type) {
      var object = this,
          events = object.events || (object.events = {});

      return _.has(events, type) ? events[type] : (events[type] = []);
    }

    /**
     * Unregisters a listener for the specified event type(s),
     * or unregisters all listeners for the specified event type(s),
     * or unregisters all listeners for all event types.
     *
     * @memberOf Benchmark, Benchmark.Suite
     * @param {string} [type] The event type.
     * @param {Function} [listener] The function to unregister.
     * @returns {Object} The current instance.
     * @example
     *
     * // unregister a listener for an event type
     * bench.off('cycle', listener);
     *
     * // unregister a listener for multiple event types
     * bench.off('start cycle', listener);
     *
     * // unregister all listeners for an event type
     * bench.off('cycle');
     *
     * // unregister all listeners for multiple event types
     * bench.off('start cycle complete');
     *
     * // unregister all listeners for all event types
     * bench.off();
     */
    function off(type, listener) {
      var object = this,
          events = object.events;

      if (!events) {
        return object;
      }
      _.each(type ? type.split(' ') : events, function(listeners, type) {
        var index;
        if (typeof listeners == 'string') {
          type = listeners;
          listeners = _.has(events, type) && events[type];
        }
        if (listeners) {
          if (listener) {
            index = _.indexOf(listeners, listener);
            if (index > -1) {
              listeners.splice(index, 1);
            }
          } else {
            listeners.length = 0;
          }
        }
      });
      return object;
    }

    /**
     * Registers a listener for the specified event type(s).
     *
     * @memberOf Benchmark, Benchmark.Suite
     * @param {string} type The event type.
     * @param {Function} listener The function to register.
     * @returns {Object} The current instance.
     * @example
     *
     * // register a listener for an event type
     * bench.on('cycle', listener);
     *
     * // register a listener for multiple event types
     * bench.on('start cycle', listener);
     */
    function on(type, listener) {
      var object = this,
          events = object.events || (object.events = {});

      _.each(type.split(' '), function(type) {
        (_.has(events, type)
          ? events[type]
          : (events[type] = [])
        ).push(listener);
      });
      return object;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Aborts the benchmark without recording times.
     *
     * @memberOf Benchmark
     * @returns {Object} The benchmark instance.
     */
    function abort() {
      var event,
          bench = this,
          resetting = calledBy.reset;

      if (bench.running) {
        event = Event('abort');
        bench.emit(event);
        if (!event.cancelled || resetting) {
          // Avoid infinite recursion.
          calledBy.abort = true;
          bench.reset();
          delete calledBy.abort;

          if (support.timeout) {
            clearTimeout(bench._timerId);
            delete bench._timerId;
          }
          if (!resetting) {
            bench.aborted = true;
            bench.running = false;
          }
        }
      }
      return bench;
    }

    /**
     * Creates a new benchmark using the same test and options.
     *
     * @memberOf Benchmark
     * @param {Object} options Options object to overwrite cloned options.
     * @returns {Object} The new benchmark instance.
     * @example
     *
     * var bizarro = bench.clone({
     *   'name': 'doppelganger'
     * });
     */
    function clone(options) {
      var bench = this,
          result = new bench.constructor(_.assign({}, bench, options));

      // Correct the `options` object.
      result.options = _.assign({}, cloneDeep(bench.options), cloneDeep(options));

      // Copy own custom properties.
      _.forOwn(bench, function(value, key) {
        if (!_.has(result, key)) {
          result[key] = cloneDeep(value);
        }
      });

      return result;
    }

    /**
     * Determines if a benchmark is faster than another.
     *
     * @memberOf Benchmark
     * @param {Object} other The benchmark to compare.
     * @returns {number} Returns `-1` if slower, `1` if faster, and `0` if indeterminate.
     */
    function compare(other) {
      var bench = this;

      // Exit early if comparing the same benchmark.
      if (bench == other) {
        return 0;
      }
      var critical,
          zStat,
          sample1 = bench.stats.sample,
          sample2 = other.stats.sample,
          size1 = sample1.length,
          size2 = sample2.length,
          maxSize = max(size1, size2),
          minSize = min(size1, size2),
          u1 = getU(sample1, sample2),
          u2 = getU(sample2, sample1),
          u = min(u1, u2);

      function getScore(xA, sampleB) {
        return _.reduce(sampleB, function(total, xB) {
          return total + (xB > xA ? 0 : xB < xA ? 1 : 0.5);
        }, 0);
      }

      function getU(sampleA, sampleB) {
        return _.reduce(sampleA, function(total, xA) {
          return total + getScore(xA, sampleB);
        }, 0);
      }

      function getZ(u) {
        return (u - ((size1 * size2) / 2)) / sqrt((size1 * size2 * (size1 + size2 + 1)) / 12);
      }
      // Reject the null hypothesis the two samples come from the
      // same population (i.e. have the same median) if...
      if (size1 + size2 > 30) {
        // ...the z-stat is greater than 1.96 or less than -1.96
        // http://www.statisticslectures.com/topics/mannwhitneyu/
        zStat = getZ(u);
        return abs(zStat) > 1.96 ? (u == u1 ? 1 : -1) : 0;
      }
      // ...the U value is less than or equal the critical U value.
      critical = maxSize < 5 || minSize < 3 ? 0 : uTable[maxSize][minSize - 3];
      return u <= critical ? (u == u1 ? 1 : -1) : 0;
    }

    /**
     * Reset properties and abort if running.
     *
     * @memberOf Benchmark
     * @returns {Object} The benchmark instance.
     */
    function reset() {
      var bench = this;
      if (bench.running && !calledBy.abort) {
        // No worries, `reset()` is called within `abort()`.
        calledBy.reset = true;
        bench.abort();
        delete calledBy.reset;
        return bench;
      }
      var event,
          index = 0,
          changes = [],
          queue = [];

      // A non-recursive solution to check if properties have changed.
      // For more information see http://www.jslab.dk/articles/non.recursive.preorder.traversal.part4.
      var data = {
        'destination': bench,
        'source': _.assign({}, cloneDeep(bench.constructor.prototype), cloneDeep(bench.options))
      };

      do {
        _.forOwn(data.source, function(value, key) {
          var changed,
              destination = data.destination,
              currValue = destination[key];

          // Skip pseudo private properties like `_timerId` which could be a
          // Java object in environments like RingoJS.
          if (key.charAt(0) == '_') {
            return;
          }
          if (value && typeof value == 'object') {
            if (_.isArray(value)) {
              // Check if an array value has changed to a non-array value.
              if (!_.isArray(currValue)) {
                changed = currValue = [];
              }
              // Check if an array has changed its length.
              if (currValue.length != value.length) {
                changed = currValue = currValue.slice(0, value.length);
                currValue.length = value.length;
              }
            }
            // Check if an object has changed to a non-object value.
            else if (!currValue || typeof currValue != 'object') {
              changed = currValue = {};
            }
            // Register a changed object.
            if (changed) {
              changes.push({ 'destination': destination, 'key': key, 'value': currValue });
            }
            queue.push({ 'destination': currValue, 'source': value });
          }
          // Register a changed primitive.
          else if (value !== currValue && !(value == null || _.isFunction(value))) {
            changes.push({ 'destination': destination, 'key': key, 'value': value });
          }
        });
      }
      while ((data = queue[index++]));

      // If changed emit the `reset` event and if it isn't cancelled reset the benchmark.
      if (changes.length && (bench.emit(event = Event('reset')), !event.cancelled)) {
        _.each(changes, function(data) {
          data.destination[data.key] = data.value;
        });
      }
      return bench;
    }

    /**
     * Displays relevant benchmark information when coerced to a string.
     *
     * @name toString
     * @memberOf Benchmark
     * @returns {string} A string representation of the benchmark instance.
     */
    function toStringBench() {
      var bench = this,
          error = bench.error,
          hz = bench.hz,
          id = bench.id,
          stats = bench.stats,
          size = stats.sample.length,
          pm = '\xb1',
          result = bench.name || (_.isNaN(id) ? id : '<Test #' + id + '>');

      if (error) {
        var errorStr;
        if (!_.isObject(error)) {
          errorStr = String(error);
        } else if (!_.isError(Error)) {
          errorStr = join(error);
        } else {
          // Error#name and Error#message properties are non-enumerable.
          errorStr = join(_.assign({ 'name': error.name, 'message': error.message }, error));
        }
        result += ': ' + errorStr;
      }
      else {
        result += ' x ' + formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ops/sec ' + pm +
          stats.rme.toFixed(2) + '% (' + size + ' run' + (size == 1 ? '' : 's') + ' sampled)';
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Clocks the time taken to execute a test per cycle (secs).
     *
     * @private
     * @param {Object} bench The benchmark instance.
     * @returns {number} The time taken.
     */
    function clock() {
      var options = Benchmark.options,
          templateData = {},
          timers = [{ 'ns': timer.ns, 'res': max(0.0015, getRes('ms')), 'unit': 'ms' }];

      // Lazy define for hi-res timers.
      clock = function(clone) {
        var deferred;

        if (clone instanceof Deferred) {
          deferred = clone;
          clone = deferred.benchmark;
        }
        var bench = clone._original,
            stringable = isStringable(bench.fn),
            count = bench.count = clone.count,
            decompilable = stringable || (support.decompilation && (clone.setup !== _.noop || clone.teardown !== _.noop)),
            id = bench.id,
            name = bench.name || (typeof id == 'number' ? '<Test #' + id + '>' : id),
            result = 0;

        // Init `minTime` if needed.
        clone.minTime = bench.minTime || (bench.minTime = bench.options.minTime = options.minTime);

        // Compile in setup/teardown functions and the test loop.
        // Create a new compiled test, instead of using the cached `bench.compiled`,
        // to avoid potential engine optimizations enabled over the life of the test.
        var funcBody = deferred
          ? 'var d#=this,${fnArg}=d#,m#=d#.benchmark._original,f#=m#.fn,su#=m#.setup,td#=m#.teardown;' +
            // When `deferred.cycles` is `0` then...
            'if(!d#.cycles){' +
            // set `deferred.fn`,
            'd#.fn=function(){var ${fnArg}=d#;if(typeof f#=="function"){try{${fn}\n}catch(e#){f#(d#)}}else{${fn}\n}};' +
            // set `deferred.teardown`,
            'd#.teardown=function(){d#.cycles=0;if(typeof td#=="function"){try{${teardown}\n}catch(e#){td#()}}else{${teardown}\n}};' +
            // execute the benchmark's `setup`,
            'if(typeof su#=="function"){try{${setup}\n}catch(e#){su#()}}else{${setup}\n};' +
            // start timer,
            't#.start(d#);' +
            // and then execute `deferred.fn` and return a dummy object.
            '}d#.fn();return{uid:"${uid}"}'

          : 'var r#,s#,m#=this,f#=m#.fn,i#=m#.count,n#=t#.ns;${setup}\n${begin};' +
            'while(i#--){${fn}\n}${end};${teardown}\nreturn{elapsed:r#,uid:"${uid}"}';

        var compiled = bench.compiled = clone.compiled = createCompiled(bench, decompilable, deferred, funcBody),
            isEmpty = !(templateData.fn || stringable);

        try {
          if (isEmpty) {
            // Firefox may remove dead code from `Function#toString` results.
            // For more information see http://bugzil.la/536085.
            throw new Error('The test "' + name + '" is empty. This may be the result of dead code removal.');
          }
          else if (!deferred) {
            // Pretest to determine if compiled code exits early, usually by a
            // rogue `return` statement, by checking for a return object with the uid.
            bench.count = 1;
            compiled = decompilable && (compiled.call(bench, context, timer) || {}).uid == templateData.uid && compiled;
            bench.count = count;
          }
        } catch(e) {
          compiled = null;
          clone.error = e || new Error(String(e));
          bench.count = count;
        }
        // Fallback when a test exits early or errors during pretest.
        if (!compiled && !deferred && !isEmpty) {
          funcBody = (
            stringable || (decompilable && !clone.error)
              ? 'function f#(){${fn}\n}var r#,s#,m#=this,i#=m#.count'
              : 'var r#,s#,m#=this,f#=m#.fn,i#=m#.count'
            ) +
            ',n#=t#.ns;${setup}\n${begin};m#.f#=f#;while(i#--){m#.f#()}${end};' +
            'delete m#.f#;${teardown}\nreturn{elapsed:r#}';

          compiled = createCompiled(bench, decompilable, deferred, funcBody);

          try {
            // Pretest one more time to check for errors.
            bench.count = 1;
            compiled.call(bench, context, timer);
            bench.count = count;
            delete clone.error;
          }
          catch(e) {
            bench.count = count;
            if (!clone.error) {
              clone.error = e || new Error(String(e));
            }
          }
        }
        // If no errors run the full test loop.
        if (!clone.error) {
          compiled = bench.compiled = clone.compiled = createCompiled(bench, decompilable, deferred, funcBody);
          result = compiled.call(deferred || bench, context, timer).elapsed;
        }
        return result;
      };

      /*----------------------------------------------------------------------*/

      /**
       * Creates a compiled function from the given function `body`.
       */
      function createCompiled(bench, decompilable, deferred, body) {
        var fn = bench.fn,
            fnArg = deferred ? getFirstArgument(fn) || 'deferred' : '';

        templateData.uid = uid + uidCounter++;

        _.assign(templateData, {
          'setup': decompilable ? getSource(bench.setup) : interpolate('m#.setup()'),
          'fn': decompilable ? getSource(fn) : interpolate('m#.fn(' + fnArg + ')'),
          'fnArg': fnArg,
          'teardown': decompilable ? getSource(bench.teardown) : interpolate('m#.teardown()')
        });

        // Use API of chosen timer.
        if (timer.unit == 'ns') {
          _.assign(templateData, {
            'begin': interpolate('s#=n#()'),
            'end': interpolate('r#=n#(s#);r#=r#[0]+(r#[1]/1e9)')
          });
        }
        else if (timer.unit == 'us') {
          if (timer.ns.stop) {
            _.assign(templateData, {
              'begin': interpolate('s#=n#.start()'),
              'end': interpolate('r#=n#.microseconds()/1e6')
            });
          } else {
            _.assign(templateData, {
              'begin': interpolate('s#=n#()'),
              'end': interpolate('r#=(n#()-s#)/1e6')
            });
          }
        }
        else if (timer.ns.now) {
          _.assign(templateData, {
            'begin': interpolate('s#=n#.now()'),
            'end': interpolate('r#=(n#.now()-s#)/1e3')
          });
        }
        else {
          _.assign(templateData, {
            'begin': interpolate('s#=new n#().getTime()'),
            'end': interpolate('r#=(new n#().getTime()-s#)/1e3')
          });
        }
        // Define `timer` methods.
        timer.start = createFunction(
          interpolate('o#'),
          interpolate('var n#=this.ns,${begin};o#.elapsed=0;o#.timeStamp=s#')
        );

        timer.stop = createFunction(
          interpolate('o#'),
          interpolate('var n#=this.ns,s#=o#.timeStamp,${end};o#.elapsed=r#')
        );

        // Create compiled test.
        return createFunction(
          interpolate('window,t#'),
          'var global = window, clearTimeout = global.clearTimeout, setTimeout = global.setTimeout;\n' +
          interpolate(body)
        );
      }

      /**
       * Gets the current timer's minimum resolution (secs).
       */
      function getRes(unit) {
        var measured,
            begin,
            count = 30,
            divisor = 1e3,
            ns = timer.ns,
            sample = [];

        // Get average smallest measurable time.
        while (count--) {
          if (unit == 'us') {
            divisor = 1e6;
            if (ns.stop) {
              ns.start();
              while (!(measured = ns.microseconds())) {}
            } else {
              begin = ns();
              while (!(measured = ns() - begin)) {}
            }
          }
          else if (unit == 'ns') {
            divisor = 1e9;
            begin = (begin = ns())[0] + (begin[1] / divisor);
            while (!(measured = ((measured = ns())[0] + (measured[1] / divisor)) - begin)) {}
            divisor = 1;
          }
          else if (ns.now) {
            begin = ns.now();
            while (!(measured = ns.now() - begin)) {}
          }
          else {
            begin = new ns().getTime();
            while (!(measured = new ns().getTime() - begin)) {}
          }
          // Check for broken timers.
          if (measured > 0) {
            sample.push(measured);
          } else {
            sample.push(Infinity);
            break;
          }
        }
        // Convert to seconds.
        return getMean(sample) / divisor;
      }

      /**
       * Interpolates a given template string.
       */
      function interpolate(string) {
        // Replaces all occurrences of `#` with a unique number and template tokens with content.
        return _.template(string.replace(/\#/g, /\d+/.exec(templateData.uid)))(templateData);
      }

      /*----------------------------------------------------------------------*/

      // Detect Chrome's microsecond timer:
      // enable benchmarking via the --enable-benchmarking command
      // line switch in at least Chrome 7 to use chrome.Interval
      try {
        if ((timer.ns = new (context.chrome || context.chromium).Interval)) {
          timers.push({ 'ns': timer.ns, 'res': getRes('us'), 'unit': 'us' });
        }
      } catch(e) {}

      // Detect Node.js's nanosecond resolution timer available in Node.js >= 0.8.
      if (processObject && typeof (timer.ns = processObject.hrtime) == 'function') {
        timers.push({ 'ns': timer.ns, 'res': getRes('ns'), 'unit': 'ns' });
      }
      // Detect Wade Simmons' Node.js `microtime` module.
      if (microtimeObject && typeof (timer.ns = microtimeObject.now) == 'function') {
        timers.push({ 'ns': timer.ns,  'res': getRes('us'), 'unit': 'us' });
      }
      // Pick timer with highest resolution.
      timer = _.minBy(timers, 'res');

      // Error if there are no working timers.
      if (timer.res == Infinity) {
        throw new Error('Benchmark.js was unable to find a working timer.');
      }
      // Resolve time span required to achieve a percent uncertainty of at most 1%.
      // For more information see http://spiff.rit.edu/classes/phys273/uncert/uncert.html.
      options.minTime || (options.minTime = max(timer.res / 2 / 0.01, 0.05));
      return clock.apply(null, arguments);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Computes stats on benchmark results.
     *
     * @private
     * @param {Object} bench The benchmark instance.
     * @param {Object} options The options object.
     */
    function compute(bench, options) {
      options || (options = {});

      var async = options.async,
          elapsed = 0,
          initCount = bench.initCount,
          minSamples = bench.minSamples,
          queue = [],
          sample = bench.stats.sample;

      /**
       * Adds a clone to the queue.
       */
      function enqueue() {
        queue.push(bench.clone({
          '_original': bench,
          'events': {
            'abort': [update],
            'cycle': [update],
            'error': [update],
            'start': [update]
          }
        }));
      }

      /**
       * Updates the clone/original benchmarks to keep their data in sync.
       */
      function update(event) {
        var clone = this,
            type = event.type;

        if (bench.running) {
          if (type == 'start') {
            // Note: `clone.minTime` prop is inited in `clock()`.
            clone.count = bench.initCount;
          }
          else {
            if (type == 'error') {
              bench.error = clone.error;
            }
            if (type == 'abort') {
              bench.abort();
              bench.emit('cycle');
            } else {
              event.currentTarget = event.target = bench;
              bench.emit(event);
            }
          }
        } else if (bench.aborted) {
          // Clear abort listeners to avoid triggering bench's abort/cycle again.
          clone.events.abort.length = 0;
          clone.abort();
        }
      }

      /**
       * Determines if more clones should be queued or if cycling should stop.
       */
      function evaluate(event) {
        var critical,
            df,
            mean,
            moe,
            rme,
            sd,
            sem,
            variance,
            clone = event.target,
            done = bench.aborted,
            now = _.now(),
            size = sample.push(clone.times.period),
            maxedOut = size >= minSamples && (elapsed += now - clone.times.timeStamp) / 1e3 > bench.maxTime,
            times = bench.times,
            varOf = function(sum, x) { return sum + pow(x - mean, 2); };

        // Exit early for aborted or unclockable tests.
        if (done || clone.hz == Infinity) {
          maxedOut = !(size = sample.length = queue.length = 0);
        }

        if (!done) {
          // Compute the sample mean (estimate of the population mean).
          mean = getMean(sample);
          // Compute the sample variance (estimate of the population variance).
          variance = _.reduce(sample, varOf, 0) / (size - 1) || 0;
          // Compute the sample standard deviation (estimate of the population standard deviation).
          sd = sqrt(variance);
          // Compute the standard error of the mean (a.k.a. the standard deviation of the sampling distribution of the sample mean).
          sem = sd / sqrt(size);
          // Compute the degrees of freedom.
          df = size - 1;
          // Compute the critical value.
          critical = tTable[Math.round(df) || 1] || tTable.infinity;
          // Compute the margin of error.
          moe = sem * critical;
          // Compute the relative margin of error.
          rme = (moe / mean) * 100 || 0;

          _.assign(bench.stats, {
            'deviation': sd,
            'mean': mean,
            'moe': moe,
            'rme': rme,
            'sem': sem,
            'variance': variance
          });

          // Abort the cycle loop when the minimum sample size has been collected
          // and the elapsed time exceeds the maximum time allowed per benchmark.
          // We don't count cycle delays toward the max time because delays may be
          // increased by browsers that clamp timeouts for inactive tabs. For more
          // information see https://developer.mozilla.org/en/window.setTimeout#Inactive_tabs.
          if (maxedOut) {
            // Reset the `initCount` in case the benchmark is rerun.
            bench.initCount = initCount;
            bench.running = false;
            done = true;
            times.elapsed = (now - times.timeStamp) / 1e3;
          }
          if (bench.hz != Infinity) {
            bench.hz = 1 / mean;
            times.cycle = mean * bench.count;
            times.period = mean;
          }
        }
        // If time permits, increase sample size to reduce the margin of error.
        if (queue.length < 2 && !maxedOut) {
          enqueue();
        }
        // Abort the `invoke` cycle when done.
        event.aborted = done;
      }

      // Init queue and begin.
      enqueue();
      invoke(queue, {
        'name': 'run',
        'args': { 'async': async },
        'queued': true,
        'onCycle': evaluate,
        'onComplete': function() { bench.emit('complete'); }
      });
    }

    /*------------------------------------------------------------------------*/

    /**
     * Cycles a benchmark until a run `count` can be established.
     *
     * @private
     * @param {Object} clone The cloned benchmark instance.
     * @param {Object} options The options object.
     */
    function cycle(clone, options) {
      options || (options = {});

      var deferred;
      if (clone instanceof Deferred) {
        deferred = clone;
        clone = clone.benchmark;
      }
      var clocked,
          cycles,
          divisor,
          event,
          minTime,
          period,
          async = options.async,
          bench = clone._original,
          count = clone.count,
          times = clone.times;

      // Continue, if not aborted between cycles.
      if (clone.running) {
        // `minTime` is set to `Benchmark.options.minTime` in `clock()`.
        cycles = ++clone.cycles;
        clocked = deferred ? deferred.elapsed : clock(clone);
        minTime = clone.minTime;

        if (cycles > bench.cycles) {
          bench.cycles = cycles;
        }
        if (clone.error) {
          event = Event('error');
          event.message = clone.error;
          clone.emit(event);
          if (!event.cancelled) {
            clone.abort();
          }
        }
      }
      // Continue, if not errored.
      if (clone.running) {
        // Compute the time taken to complete last test cycle.
        bench.times.cycle = times.cycle = clocked;
        // Compute the seconds per operation.
        period = bench.times.period = times.period = clocked / count;
        // Compute the ops per second.
        bench.hz = clone.hz = 1 / period;
        // Avoid working our way up to this next time.
        bench.initCount = clone.initCount = count;
        // Do we need to do another cycle?
        clone.running = clocked < minTime;

        if (clone.running) {
          // Tests may clock at `0` when `initCount` is a small number,
          // to avoid that we set its count to something a bit higher.
          if (!clocked && (divisor = divisors[clone.cycles]) != null) {
            count = floor(4e6 / divisor);
          }
          // Calculate how many more iterations it will take to achieve the `minTime`.
          if (count <= clone.count) {
            count += Math.ceil((minTime - clocked) / period);
          }
          clone.running = count != Infinity;
        }
      }
      // Should we exit early?
      event = Event('cycle');
      clone.emit(event);
      if (event.aborted) {
        clone.abort();
      }
      // Figure out what to do next.
      if (clone.running) {
        // Start a new cycle.
        clone.count = count;
        if (deferred) {
          clone.compiled.call(deferred, context, timer);
        } else if (async) {
          delay(clone, function() { cycle(clone, options); });
        } else {
          cycle(clone);
        }
      }
      else {
        // Fix TraceMonkey bug associated with clock fallbacks.
        // For more information see http://bugzil.la/509069.
        if (support.browser) {
          runScript(uid + '=1;delete ' + uid);
        }
        // We're done.
        clone.emit('complete');
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Runs the benchmark.
     *
     * @memberOf Benchmark
     * @param {Object} [options={}] Options object.
     * @returns {Object} The benchmark instance.
     * @example
     *
     * // basic usage
     * bench.run();
     *
     * // or with options
     * bench.run({ 'async': true });
     */
    function run(options) {
      var bench = this,
          event = Event('start');

      // Set `running` to `false` so `reset()` won't call `abort()`.
      bench.running = false;
      bench.reset();
      bench.running = true;

      bench.count = bench.initCount;
      bench.times.timeStamp = _.now();
      bench.emit(event);

      if (!event.cancelled) {
        options = { 'async': ((options = options && options.async) == null ? bench.async : options) && support.timeout };

        // For clones created within `compute()`.
        if (bench._original) {
          if (bench.defer) {
            Deferred(bench);
          } else {
            cycle(bench, options);
          }
        }
        // For original benchmarks.
        else {
          compute(bench, options);
        }
      }
      return bench;
    }

    /*------------------------------------------------------------------------*/

    // Firefox 1 erroneously defines variable and argument names of functions on
    // the function itself as non-configurable properties with `undefined` values.
    // The bugginess continues as the `Benchmark` constructor has an argument
    // named `options` and Firefox 1 will not assign a value to `Benchmark.options`,
    // making it non-writable in the process, unless it is the first property
    // assigned by for-in loop of `_.assign()`.
    _.assign(Benchmark, {

      /**
       * The default options copied by benchmark instances.
       *
       * @static
       * @memberOf Benchmark
       * @type Object
       */
      'options': {

        /**
         * A flag to indicate that benchmark cycles will execute asynchronously
         * by default.
         *
         * @memberOf Benchmark.options
         * @type boolean
         */
        'async': false,

        /**
         * A flag to indicate that the benchmark clock is deferred.
         *
         * @memberOf Benchmark.options
         * @type boolean
         */
        'defer': false,

        /**
         * The delay between test cycles (secs).
         * @memberOf Benchmark.options
         * @type number
         */
        'delay': 0.005,

        /**
         * Displayed by `Benchmark#toString` when a `name` is not available
         * (auto-generated if absent).
         *
         * @memberOf Benchmark.options
         * @type string
         */
        'id': undefined,

        /**
         * The default number of times to execute a test on a benchmark's first cycle.
         *
         * @memberOf Benchmark.options
         * @type number
         */
        'initCount': 1,

        /**
         * The maximum time a benchmark is allowed to run before finishing (secs).
         *
         * Note: Cycle delays aren't counted toward the maximum time.
         *
         * @memberOf Benchmark.options
         * @type number
         */
        'maxTime': 5,

        /**
         * The minimum sample size required to perform statistical analysis.
         *
         * @memberOf Benchmark.options
         * @type number
         */
        'minSamples': 5,

        /**
         * The time needed to reduce the percent uncertainty of measurement to 1% (secs).
         *
         * @memberOf Benchmark.options
         * @type number
         */
        'minTime': 0,

        /**
         * The name of the benchmark.
         *
         * @memberOf Benchmark.options
         * @type string
         */
        'name': undefined,

        /**
         * An event listener called when the benchmark is aborted.
         *
         * @memberOf Benchmark.options
         * @type Function
         */
        'onAbort': undefined,

        /**
         * An event listener called when the benchmark completes running.
         *
         * @memberOf Benchmark.options
         * @type Function
         */
        'onComplete': undefined,

        /**
         * An event listener called after each run cycle.
         *
         * @memberOf Benchmark.options
         * @type Function
         */
        'onCycle': undefined,

        /**
         * An event listener called when a test errors.
         *
         * @memberOf Benchmark.options
         * @type Function
         */
        'onError': undefined,

        /**
         * An event listener called when the benchmark is reset.
         *
         * @memberOf Benchmark.options
         * @type Function
         */
        'onReset': undefined,

        /**
         * An event listener called when the benchmark starts running.
         *
         * @memberOf Benchmark.options
         * @type Function
         */
        'onStart': undefined
      },

      /**
       * Platform object with properties describing things like browser name,
       * version, and operating system. See [`platform.js`](https://mths.be/platform).
       *
       * @static
       * @memberOf Benchmark
       * @type Object
       */
      'platform': context.platform || require('platform') || ({
        'description': context.navigator && context.navigator.userAgent || null,
        'layout': null,
        'product': null,
        'name': null,
        'manufacturer': null,
        'os': null,
        'prerelease': null,
        'version': null,
        'toString': function() {
          return this.description || '';
        }
      }),

      /**
       * The semantic version number.
       *
       * @static
       * @memberOf Benchmark
       * @type string
       */
      'version': '2.1.2'
    });

    _.assign(Benchmark, {
      'filter': filter,
      'formatNumber': formatNumber,
      'invoke': invoke,
      'join': join,
      'runInContext': runInContext,
      'support': support
    });

    // Add lodash methods to Benchmark.
    _.each(['each', 'forEach', 'forOwn', 'has', 'indexOf', 'map', 'reduce'], function(methodName) {
      Benchmark[methodName] = _[methodName];
    });

    /*------------------------------------------------------------------------*/

    _.assign(Benchmark.prototype, {

      /**
       * The number of times a test was executed.
       *
       * @memberOf Benchmark
       * @type number
       */
      'count': 0,

      /**
       * The number of cycles performed while benchmarking.
       *
       * @memberOf Benchmark
       * @type number
       */
      'cycles': 0,

      /**
       * The number of executions per second.
       *
       * @memberOf Benchmark
       * @type number
       */
      'hz': 0,

      /**
       * The compiled test function.
       *
       * @memberOf Benchmark
       * @type {Function|string}
       */
      'compiled': undefined,

      /**
       * The error object if the test failed.
       *
       * @memberOf Benchmark
       * @type Object
       */
      'error': undefined,

      /**
       * The test to benchmark.
       *
       * @memberOf Benchmark
       * @type {Function|string}
       */
      'fn': undefined,

      /**
       * A flag to indicate if the benchmark is aborted.
       *
       * @memberOf Benchmark
       * @type boolean
       */
      'aborted': false,

      /**
       * A flag to indicate if the benchmark is running.
       *
       * @memberOf Benchmark
       * @type boolean
       */
      'running': false,

      /**
       * Compiled into the test and executed immediately **before** the test loop.
       *
       * @memberOf Benchmark
       * @type {Function|string}
       * @example
       *
       * // basic usage
       * var bench = Benchmark({
       *   'setup': function() {
       *     var c = this.count,
       *         element = document.getElementById('container');
       *     while (c--) {
       *       element.appendChild(document.createElement('div'));
       *     }
       *   },
       *   'fn': function() {
       *     element.removeChild(element.lastChild);
       *   }
       * });
       *
       * // compiles to something like:
       * var c = this.count,
       *     element = document.getElementById('container');
       * while (c--) {
       *   element.appendChild(document.createElement('div'));
       * }
       * var start = new Date;
       * while (count--) {
       *   element.removeChild(element.lastChild);
       * }
       * var end = new Date - start;
       *
       * // or using strings
       * var bench = Benchmark({
       *   'setup': '\
       *     var a = 0;\n\
       *     (function() {\n\
       *       (function() {\n\
       *         (function() {',
       *   'fn': 'a += 1;',
       *   'teardown': '\
       *          }())\n\
       *        }())\n\
       *      }())'
       * });
       *
       * // compiles to something like:
       * var a = 0;
       * (function() {
       *   (function() {
       *     (function() {
       *       var start = new Date;
       *       while (count--) {
       *         a += 1;
       *       }
       *       var end = new Date - start;
       *     }())
       *   }())
       * }())
       */
      'setup': _.noop,

      /**
       * Compiled into the test and executed immediately **after** the test loop.
       *
       * @memberOf Benchmark
       * @type {Function|string}
       */
      'teardown': _.noop,

      /**
       * An object of stats including mean, margin or error, and standard deviation.
       *
       * @memberOf Benchmark
       * @type Object
       */
      'stats': {

        /**
         * The margin of error.
         *
         * @memberOf Benchmark#stats
         * @type number
         */
        'moe': 0,

        /**
         * The relative margin of error (expressed as a percentage of the mean).
         *
         * @memberOf Benchmark#stats
         * @type number
         */
        'rme': 0,

        /**
         * The standard error of the mean.
         *
         * @memberOf Benchmark#stats
         * @type number
         */
        'sem': 0,

        /**
         * The sample standard deviation.
         *
         * @memberOf Benchmark#stats
         * @type number
         */
        'deviation': 0,

        /**
         * The sample arithmetic mean (secs).
         *
         * @memberOf Benchmark#stats
         * @type number
         */
        'mean': 0,

        /**
         * The array of sampled periods.
         *
         * @memberOf Benchmark#stats
         * @type Array
         */
        'sample': [],

        /**
         * The sample variance.
         *
         * @memberOf Benchmark#stats
         * @type number
         */
        'variance': 0
      },

      /**
       * An object of timing data including cycle, elapsed, period, start, and stop.
       *
       * @memberOf Benchmark
       * @type Object
       */
      'times': {

        /**
         * The time taken to complete the last cycle (secs).
         *
         * @memberOf Benchmark#times
         * @type number
         */
        'cycle': 0,

        /**
         * The time taken to complete the benchmark (secs).
         *
         * @memberOf Benchmark#times
         * @type number
         */
        'elapsed': 0,

        /**
         * The time taken to execute the test once (secs).
         *
         * @memberOf Benchmark#times
         * @type number
         */
        'period': 0,

        /**
         * A timestamp of when the benchmark started (ms).
         *
         * @memberOf Benchmark#times
         * @type number
         */
        'timeStamp': 0
      }
    });

    _.assign(Benchmark.prototype, {
      'abort': abort,
      'clone': clone,
      'compare': compare,
      'emit': emit,
      'listeners': listeners,
      'off': off,
      'on': on,
      'reset': reset,
      'run': run,
      'toString': toStringBench
    });

    /*------------------------------------------------------------------------*/

    _.assign(Deferred.prototype, {

      /**
       * The deferred benchmark instance.
       *
       * @memberOf Benchmark.Deferred
       * @type Object
       */
      'benchmark': null,

      /**
       * The number of deferred cycles performed while benchmarking.
       *
       * @memberOf Benchmark.Deferred
       * @type number
       */
      'cycles': 0,

      /**
       * The time taken to complete the deferred benchmark (secs).
       *
       * @memberOf Benchmark.Deferred
       * @type number
       */
      'elapsed': 0,

      /**
       * A timestamp of when the deferred benchmark started (ms).
       *
       * @memberOf Benchmark.Deferred
       * @type number
       */
      'timeStamp': 0
    });

    _.assign(Deferred.prototype, {
      'resolve': resolve
    });

    /*------------------------------------------------------------------------*/

    _.assign(Event.prototype, {

      /**
       * A flag to indicate if the emitters listener iteration is aborted.
       *
       * @memberOf Benchmark.Event
       * @type boolean
       */
      'aborted': false,

      /**
       * A flag to indicate if the default action is cancelled.
       *
       * @memberOf Benchmark.Event
       * @type boolean
       */
      'cancelled': false,

      /**
       * The object whose listeners are currently being processed.
       *
       * @memberOf Benchmark.Event
       * @type Object
       */
      'currentTarget': undefined,

      /**
       * The return value of the last executed listener.
       *
       * @memberOf Benchmark.Event
       * @type Mixed
       */
      'result': undefined,

      /**
       * The object to which the event was originally emitted.
       *
       * @memberOf Benchmark.Event
       * @type Object
       */
      'target': undefined,

      /**
       * A timestamp of when the event was created (ms).
       *
       * @memberOf Benchmark.Event
       * @type number
       */
      'timeStamp': 0,

      /**
       * The event type.
       *
       * @memberOf Benchmark.Event
       * @type string
       */
      'type': ''
    });

    /*------------------------------------------------------------------------*/

    /**
     * The default options copied by suite instances.
     *
     * @static
     * @memberOf Benchmark.Suite
     * @type Object
     */
    Suite.options = {

      /**
       * The name of the suite.
       *
       * @memberOf Benchmark.Suite.options
       * @type string
       */
      'name': undefined
    };

    /*------------------------------------------------------------------------*/

    _.assign(Suite.prototype, {

      /**
       * The number of benchmarks in the suite.
       *
       * @memberOf Benchmark.Suite
       * @type number
       */
      'length': 0,

      /**
       * A flag to indicate if the suite is aborted.
       *
       * @memberOf Benchmark.Suite
       * @type boolean
       */
      'aborted': false,

      /**
       * A flag to indicate if the suite is running.
       *
       * @memberOf Benchmark.Suite
       * @type boolean
       */
      'running': false
    });

    _.assign(Suite.prototype, {
      'abort': abortSuite,
      'add': add,
      'clone': cloneSuite,
      'emit': emit,
      'filter': filterSuite,
      'join': arrayRef.join,
      'listeners': listeners,
      'off': off,
      'on': on,
      'pop': arrayRef.pop,
      'push': push,
      'reset': resetSuite,
      'run': runSuite,
      'reverse': arrayRef.reverse,
      'shift': shift,
      'slice': slice,
      'sort': arrayRef.sort,
      'splice': arrayRef.splice,
      'unshift': unshift
    });

    /*------------------------------------------------------------------------*/

    // Expose Deferred, Event, and Suite.
    _.assign(Benchmark, {
      'Deferred': Deferred,
      'Event': Event,
      'Suite': Suite
    });

    /*------------------------------------------------------------------------*/

    // Add lodash methods as Suite methods.
    _.each(['each', 'forEach', 'indexOf', 'map', 'reduce'], function(methodName) {
      var func = _[methodName];
      Suite.prototype[methodName] = function() {
        var args = [this];
        push.apply(args, arguments);
        return func.apply(_, args);
      };
    });

    // Avoid array-like object bugs with `Array#shift` and `Array#splice`
    // in Firefox < 10 and IE < 9.
    _.each(['pop', 'shift', 'splice'], function(methodName) {
      var func = arrayRef[methodName];

      Suite.prototype[methodName] = function() {
        var value = this,
            result = func.apply(value, arguments);

        if (value.length === 0) {
          delete value[0];
        }
        return result;
      };
    });

    // Avoid buggy `Array#unshift` in IE < 8 which doesn't return the new
    // length of the array.
    Suite.prototype.unshift = function() {
      var value = this;
      unshift.apply(value, arguments);
      return value.length;
    };

    return Benchmark;
  }

  /*--------------------------------------------------------------------------*/

  // Export Benchmark.
  // Some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Define as an anonymous module so, through path mapping, it can be aliased.
    define(['lodash', 'platform'], function(_, platform) {
      return runInContext({
        '_': _,
        'platform': platform
      });
    });
  }
  else {
    var Benchmark = runInContext();

    // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
    if (freeExports && freeModule) {
      // Export for Node.js.
      if (moduleExports) {
        (freeModule.exports = Benchmark).Benchmark = Benchmark;
      }
      // Export for CommonJS support.
      freeExports.Benchmark = Benchmark;
    }
    else {
      // Export to the global object.
      root.Benchmark = Benchmark;
    }
  }
}.call(this));


/***/ },
/* 15 */
/* unknown exports provided */
/* all exports used */
/*!********************************!*\
  !*** ./~/platform/platform.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Platform.js v1.3.1 <http://mths.be/platform>
 * Copyright 2014-2016 Benjamin Tan <https://d10.github.io/>
 * Copyright 2011-2013 John-David Dalton <http://allyoucanleet.com/>
 * Available under MIT license <http://mths.be/mit>
 */
;(function() {
  'use strict';

  /** Used to determine if values are of the language type `Object` */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Backup possible global object */
  var oldRoot = root;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /**
   * Used as the maximum length of an array-like object.
   * See the [ES6 spec](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   */
  var maxSafeInteger = Math.pow(2, 53) - 1;

  /** Opera regexp */
  var reOpera = /\bOpera/;

  /** Possible global object */
  var thisBinding = this;

  /** Used for native method references */
  var objectProto = Object.prototype;

  /** Used to check for own properties of an object */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to resolve the internal `[[Class]]` of values */
  var toString = objectProto.toString;

  /*--------------------------------------------------------------------------*/

  /**
   * Capitalizes a string value.
   *
   * @private
   * @param {string} string The string to capitalize.
   * @returns {string} The capitalized string.
   */
  function capitalize(string) {
    string = String(string);
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /**
   * A utility function to clean up the OS name.
   *
   * @private
   * @param {string} os The OS name to clean up.
   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
   * @param {string} [label] A label for the OS.
   */
  function cleanupOS(os, pattern, label) {
    // platform tokens defined at
    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    var data = {
      '6.4':  '10',
      '6.3':  '8.1',
      '6.2':  '8',
      '6.1':  'Server 2008 R2 / 7',
      '6.0':  'Server 2008 / Vista',
      '5.2':  'Server 2003 / XP 64-bit',
      '5.1':  'XP',
      '5.01': '2000 SP1',
      '5.0':  '2000',
      '4.0':  'NT',
      '4.90': 'ME'
    };
    // detect Windows version from platform tokens
    if (pattern && label && /^Win/i.test(os) &&
        (data = data[0/*Opera 9.25 fix*/, /[\d.]+$/.exec(os)])) {
      os = 'Windows ' + data;
    }
    // correct character case and cleanup
    os = String(os);

    if (pattern && label) {
      os = os.replace(RegExp(pattern, 'i'), label);
    }

    os = format(
      os.replace(/ ce$/i, ' CE')
        .replace(/\bhpw/i, 'web')
        .replace(/\bMacintosh\b/, 'Mac OS')
        .replace(/_PowerPC\b/i, ' OS')
        .replace(/\b(OS X) [^ \d]+/i, '$1')
        .replace(/\bMac (OS X)\b/, '$1')
        .replace(/\/(\d)/, ' $1')
        .replace(/_/g, '.')
        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
        .replace(/\bx86\.64\b/gi, 'x86_64')
        .replace(/\b(Windows Phone) OS\b/, '$1')
        .split(' on ')[0]
    );

    return os;
  }

  /**
   * An iteration utility for arrays and objects.
   *
   * @private
   * @param {Array|Object} object The object to iterate over.
   * @param {Function} callback The function called per iteration.
   */
  function each(object, callback) {
    var index = -1,
        length = object ? object.length : 0;

    if (typeof length == 'number' && length > -1 && length <= maxSafeInteger) {
      while (++index < length) {
        callback(object[index], index, object);
      }
    } else {
      forOwn(object, callback);
    }
  }

  /**
   * Trim and conditionally capitalize string values.
   *
   * @private
   * @param {string} string The string to format.
   * @returns {string} The formatted string.
   */
  function format(string) {
    string = trim(string);
    return /^(?:webOS|i(?:OS|P))/.test(string)
      ? string
      : capitalize(string);
  }

  /**
   * Iterates over an object's own properties, executing the `callback` for each.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} callback The function executed per own property.
   */
  function forOwn(object, callback) {
    for (var key in object) {
      if (hasOwnProperty.call(object, key)) {
        callback(object[key], key, object);
      }
    }
  }

  /**
   * Gets the internal `[[Class]]` of a value.
   *
   * @private
   * @param {*} value The value.
   * @returns {string} The `[[Class]]`.
   */
  function getClassOf(value) {
    return value == null
      ? capitalize(value)
      : toString.call(value).slice(8, -1);
  }

  /**
   * Host objects can return type values that are different from their actual
   * data type. The objects we are concerned with usually return non-primitive
   * types of "object", "function", or "unknown".
   *
   * @private
   * @param {*} object The owner of the property.
   * @param {string} property The property to check.
   * @returns {boolean} Returns `true` if the property value is a non-primitive, else `false`.
   */
  function isHostType(object, property) {
    var type = object != null ? typeof object[property] : 'number';
    return !/^(?:boolean|number|string|undefined)$/.test(type) &&
      (type == 'object' ? !!object[property] : true);
  }

  /**
   * Prepares a string for use in a `RegExp` by making hyphens and spaces optional.
   *
   * @private
   * @param {string} string The string to qualify.
   * @returns {string} The qualified string.
   */
  function qualify(string) {
    return String(string).replace(/([ -])(?!$)/g, '$1?');
  }

  /**
   * A bare-bones `Array#reduce` like utility function.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {*} The accumulated result.
   */
  function reduce(array, callback) {
    var accumulator = null;
    each(array, function(value, index) {
      accumulator = callback(accumulator, value, index, array);
    });
    return accumulator;
  }

  /**
   * Removes leading and trailing whitespace from a string.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} The trimmed string.
   */
  function trim(string) {
    return String(string).replace(/^ +| +$/g, '');
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a new platform object.
   *
   * @memberOf platform
   * @param {Object|string} [ua=navigator.userAgent] The user agent string or
   *  context object.
   * @returns {Object} A platform object.
   */
  function parse(ua) {

    /** The environment context object */
    var context = root;

    /** Used to flag when a custom context is provided */
    var isCustomContext = ua && typeof ua == 'object' && getClassOf(ua) != 'String';

    // juggle arguments
    if (isCustomContext) {
      context = ua;
      ua = null;
    }

    /** Browser navigator object */
    var nav = context.navigator || {};

    /** Browser user agent string */
    var userAgent = nav.userAgent || '';

    ua || (ua = userAgent);

    /** Used to flag when `thisBinding` is the [ModuleScope] */
    var isModuleScope = isCustomContext || thisBinding == oldRoot;

    /** Used to detect if browser is like Chrome */
    var likeChrome = isCustomContext
      ? !!nav.likeChrome
      : /\bChrome\b/.test(ua) && !/internal|\n/i.test(toString.toString());

    /** Internal `[[Class]]` value shortcuts */
    var objectClass = 'Object',
        airRuntimeClass = isCustomContext ? objectClass : 'ScriptBridgingProxyObject',
        enviroClass = isCustomContext ? objectClass : 'Environment',
        javaClass = (isCustomContext && context.java) ? 'JavaPackage' : getClassOf(context.java),
        phantomClass = isCustomContext ? objectClass : 'RuntimeObject';

    /** Detect Java environment */
    var java = /\bJava/.test(javaClass) && context.java;

    /** Detect Rhino */
    var rhino = java && getClassOf(context.environment) == enviroClass;

    /** A character to represent alpha */
    var alpha = java ? 'a' : '\u03b1';

    /** A character to represent beta */
    var beta = java ? 'b' : '\u03b2';

    /** Browser document object */
    var doc = context.document || {};

    /**
     * Detect Opera browser (Presto-based)
     * http://www.howtocreate.co.uk/operaStuff/operaObject.html
     * http://dev.opera.com/articles/view/opera-mini-web-content-authoring-guidelines/#operamini
     */
    var opera = context.operamini || context.opera;

    /** Opera `[[Class]]` */
    var operaClass = reOpera.test(operaClass = (isCustomContext && opera) ? opera['[[Class]]'] : getClassOf(opera))
      ? operaClass
      : (opera = null);

    /*------------------------------------------------------------------------*/

    /** Temporary variable used over the script's lifetime */
    var data;

    /** The CPU architecture */
    var arch = ua;

    /** Platform description array */
    var description = [];

    /** Platform alpha/beta indicator */
    var prerelease = null;

    /** A flag to indicate that environment features should be used to resolve the platform */
    var useFeatures = ua == userAgent;

    /** The browser/environment version */
    var version = useFeatures && opera && typeof opera.version == 'function' && opera.version();

    /** A flag to indicate if the OS ends with "/ Version" */
    var isSpecialCasedOS;

    /* Detectable layout engines (order is important) */
    var layout = getLayout([
      'Trident',
      { 'label': 'WebKit', 'pattern': 'AppleWebKit' },
      'iCab',
      'Presto',
      'NetFront',
      'Tasman',
      'KHTML',
      'Gecko'
    ]);

    /* Detectable browser names (order is important) */
    var name = getName([
      'Adobe AIR',
      'Arora',
      'Avant Browser',
      'Breach',
      'Camino',
      'Epiphany',
      'Fennec',
      'Flock',
      'Galeon',
      'GreenBrowser',
      'iCab',
      'Iceweasel',
      { 'label': 'SRWare Iron', 'pattern': 'Iron' },
      'K-Meleon',
      'Konqueror',
      'Lunascape',
      'Maxthon',
      'Midori',
      'Nook Browser',
      'PhantomJS',
      'Raven',
      'Rekonq',
      'RockMelt',
      'SeaMonkey',
      { 'label': 'Silk', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Sleipnir',
      'SlimBrowser',
      'Sunrise',
      'Swiftfox',
      'WebPositive',
      'Opera Mini',
      { 'label': 'Opera Mini', 'pattern': 'OPiOS' },
      'Opera',
      { 'label': 'Opera', 'pattern': 'OPR' },
      'Chrome',
      { 'label': 'Chrome Mobile', 'pattern': '(?:CriOS|CrMo)' },
      { 'label': 'Firefox', 'pattern': '(?:Firefox|Minefield)' },
      { 'label': 'IE', 'pattern': 'IEMobile' },
      { 'label': 'IE', 'pattern': 'MSIE' },
      'Safari'
    ]);

    /* Detectable products (order is important) */
    var product = getProduct([
      { 'label': 'BlackBerry', 'pattern': 'BB10' },
      'BlackBerry',
      { 'label': 'Galaxy S', 'pattern': 'GT-I9000' },
      { 'label': 'Galaxy S2', 'pattern': 'GT-I9100' },
      { 'label': 'Galaxy S3', 'pattern': 'GT-I9300' },
      { 'label': 'Galaxy S4', 'pattern': 'GT-I9500' },
      'Google TV',
      'Lumia',
      'iPad',
      'iPod',
      'iPhone',
      'Kindle',
      { 'label': 'Kindle Fire', 'pattern': '(?:Cloud9|Silk-Accelerated)' },
      'Nook',
      'PlayBook',
      'PlayStation 4',
      'PlayStation 3',
      'PlayStation Vita',
      'TouchPad',
      'Transformer',
      { 'label': 'Wii U', 'pattern': 'WiiU' },
      'Wii',
      'Xbox One',
      { 'label': 'Xbox 360', 'pattern': 'Xbox' },
      'Xoom'
    ]);

    /* Detectable manufacturers */
    var manufacturer = getManufacturer({
      'Apple': { 'iPad': 1, 'iPhone': 1, 'iPod': 1 },
      'Amazon': { 'Kindle': 1, 'Kindle Fire': 1 },
      'Asus': { 'Transformer': 1 },
      'Barnes & Noble': { 'Nook': 1 },
      'BlackBerry': { 'PlayBook': 1 },
      'Google': { 'Google TV': 1 },
      'HP': { 'TouchPad': 1 },
      'HTC': {},
      'LG': {},
      'Microsoft': { 'Xbox': 1, 'Xbox One': 1 },
      'Motorola': { 'Xoom': 1 },
      'Nintendo': { 'Wii U': 1,  'Wii': 1 },
      'Nokia': { 'Lumia': 1 },
      'Samsung': { 'Galaxy S': 1, 'Galaxy S2': 1, 'Galaxy S3': 1, 'Galaxy S4': 1 },
      'Sony': { 'PlayStation 4': 1, 'PlayStation 3': 1, 'PlayStation Vita': 1 }
    });

    /* Detectable OSes (order is important) */
    var os = getOS([
      'Windows Phone ',
      'Android',
      'CentOS',
      'Debian',
      'Fedora',
      'FreeBSD',
      'Gentoo',
      'Haiku',
      'Kubuntu',
      'Linux Mint',
      'Red Hat',
      'SuSE',
      'Ubuntu',
      'Xubuntu',
      'Cygwin',
      'Symbian OS',
      'hpwOS',
      'webOS ',
      'webOS',
      'Tablet OS',
      'Linux',
      'Mac OS X',
      'Macintosh',
      'Mac',
      'Windows 98;',
      'Windows '
    ]);

    /*------------------------------------------------------------------------*/

    /**
     * Picks the layout engine from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected layout engine.
     */
    function getLayout(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the manufacturer from an array of guesses.
     *
     * @private
     * @param {Array} guesses An object of guesses.
     * @returns {null|string} The detected manufacturer.
     */
    function getManufacturer(guesses) {
      return reduce(guesses, function(result, value, key) {
        // lookup the manufacturer by product or scan the UA for the manufacturer
        return result || (
          value[product] ||
          value[0/*Opera 9.25 fix*/, /^[a-z]+(?: +[a-z]+\b)*/i.exec(product)] ||
          RegExp('\\b' + qualify(key) + '(?:\\b|\\w*\\d)', 'i').exec(ua)
        ) && key;
      });
    }

    /**
     * Picks the browser name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected browser name.
     */
    function getName(guesses) {
      return reduce(guesses, function(result, guess) {
        return result || RegExp('\\b' + (
          guess.pattern || qualify(guess)
        ) + '\\b', 'i').exec(ua) && (guess.label || guess);
      });
    }

    /**
     * Picks the OS name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected OS name.
     */
    function getOS(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua)
            )) {
          result = cleanupOS(result, pattern, guess.label || guess);
        }
        return result;
      });
    }

    /**
     * Picks the product name from an array of guesses.
     *
     * @private
     * @param {Array} guesses An array of guesses.
     * @returns {null|string} The detected product name.
     */
    function getProduct(guesses) {
      return reduce(guesses, function(result, guess) {
        var pattern = guess.pattern || qualify(guess);
        if (!result && (result =
              RegExp('\\b' + pattern + ' *\\d+[.\\w_]*', 'i').exec(ua) ||
              RegExp('\\b' + pattern + '(?:; *(?:[a-z]+[_-])?[a-z]+\\d+|[^ ();-]*)', 'i').exec(ua)
            )) {
          // split by forward slash and append product version if needed
          if ((result = String((guess.label && !RegExp(pattern, 'i').test(guess.label)) ? guess.label : result).split('/'))[1] && !/[\d.]+/.test(result[0])) {
            result[0] += ' ' + result[1];
          }
          // correct character case and cleanup
          guess = guess.label || guess;
          result = format(result[0]
            .replace(RegExp(pattern, 'i'), guess)
            .replace(RegExp('; *(?:' + guess + '[_-])?', 'i'), ' ')
            .replace(RegExp('(' + guess + ')[-_.]?(\\w)', 'i'), '$1 $2'));
        }
        return result;
      });
    }

    /**
     * Resolves the version using an array of UA patterns.
     *
     * @private
     * @param {Array} patterns An array of UA patterns.
     * @returns {null|string} The detected version.
     */
    function getVersion(patterns) {
      return reduce(patterns, function(result, pattern) {
        return result || (RegExp(pattern +
          '(?:-[\\d.]+/|(?: for [\\w-]+)?[ /-])([\\d.]+[^ ();/_-]*)', 'i').exec(ua) || 0)[1] || null;
      });
    }

    /**
     * Returns `platform.description` when the platform object is coerced to a string.
     *
     * @name toString
     * @memberOf platform
     * @returns {string} Returns `platform.description` if available, else an empty string.
     */
    function toStringPlatform() {
      return this.description || '';
    }

    /*------------------------------------------------------------------------*/

    // convert layout to an array so we can add extra details
    layout && (layout = [layout]);

    // detect product names that contain their manufacturer's name
    if (manufacturer && !product) {
      product = getProduct([manufacturer]);
    }
    // clean up Google TV
    if ((data = /\bGoogle TV\b/.exec(product))) {
      product = data[0];
    }
    // detect simulators
    if (/\bSimulator\b/i.test(ua)) {
      product = (product ? product + ' ' : '') + 'Simulator';
    }
    // detect Opera Mini 8+ running in Turbo/Uncompressed mode on iOS
    if (name == 'Opera Mini' && /\bOPiOS\b/.test(ua)) {
      description.push('running in Turbo/Uncompressed mode');
    }
    // detect iOS
    if (/^iP/.test(product)) {
      name || (name = 'Safari');
      os = 'iOS' + ((data = / OS ([\d_]+)/i.exec(ua))
        ? ' ' + data[1].replace(/_/g, '.')
        : '');
    }
    // detect Kubuntu
    else if (name == 'Konqueror' && !/buntu/i.test(os)) {
      os = 'Kubuntu';
    }
    // detect Android browsers
    else if (manufacturer && manufacturer != 'Google' &&
        ((/Chrome/.test(name) && !/\bMobile Safari\b/i.test(ua)) || /\bVita\b/.test(product))) {
      name = 'Android Browser';
      os = /\bAndroid\b/.test(os) ? os : 'Android';
    }
    // detect false positives for Firefox/Safari
    else if (!name || (data = !/\bMinefield\b|\(Android;/i.test(ua) && /\b(?:Firefox|Safari)\b/.exec(name))) {
      // escape the `/` for Firefox 1
      if (name && !product && /[\/,]|^[^(]+?\)/.test(ua.slice(ua.indexOf(data + '/') + 8))) {
        // clear name of false positives
        name = null;
      }
      // reassign a generic name
      if ((data = product || manufacturer || os) &&
          (product || manufacturer || /\b(?:Android|Symbian OS|Tablet OS|webOS)\b/.test(os))) {
        name = /[a-z]+(?: Hat)?/i.exec(/\bAndroid\b/.test(os) ? os : data) + ' Browser';
      }
    }
    // detect Firefox OS
    if ((data = /\((Mobile|Tablet).*?Firefox\b/i.exec(ua)) && data[1]) {
      os = 'Firefox OS';
      if (!product) {
        product = data[1];
      }
    }
    // detect non-Opera versions (order is important)
    if (!version) {
      version = getVersion([
        '(?:Cloud9|CriOS|CrMo|IEMobile|Iron|Opera ?Mini|OPiOS|OPR|Raven|Silk(?!/[\\d.]+$))',
        'Version',
        qualify(name),
        '(?:Firefox|Minefield|NetFront)'
      ]);
    }
    // detect stubborn layout engines
    if (layout == 'iCab' && parseFloat(version) > 3) {
      layout = ['WebKit'];
    } else if (
        layout != 'Trident' &&
        (data =
          /\bOpera\b/.test(name) && (/\bOPR\b/.test(ua) ? 'Blink' : 'Presto') ||
          /\b(?:Midori|Nook|Safari)\b/i.test(ua) && 'WebKit' ||
          !layout && /\bMSIE\b/i.test(ua) && (os == 'Mac OS' ? 'Tasman' : 'Trident')
        )
    ) {
      layout = [data];
    }
    // detect NetFront on PlayStation
    else if (/\bPlayStation\b(?! Vita\b)/i.test(name) && layout == 'WebKit') {
      layout = ['NetFront'];
    }
    // detect Windows Phone 7 desktop mode
    if (name == 'IE' && (data = (/; *(?:XBLWP|ZuneWP)(\d+)/i.exec(ua) || 0)[1])) {
      name += ' Mobile';
      os = 'Windows Phone ' + (/\+$/.test(data) ? data : data + '.x');
      description.unshift('desktop mode');
    }
    // detect Windows Phone 8+ desktop mode
    else if (/\bWPDesktop\b/i.test(ua)) {
      name = 'IE Mobile';
      os = 'Windows Phone 8+';
      description.unshift('desktop mode');
      version || (version = (/\brv:([\d.]+)/.exec(ua) || 0)[1]);
    }
    // detect IE 11 and above
    else if (name != 'IE' && layout == 'Trident' && (data = /\brv:([\d.]+)/.exec(ua))) {
      if (!/\bWPDesktop\b/i.test(ua)) {
        if (name) {
          description.push('identifying as ' + name + (version ? ' ' + version : ''));
        }
        name = 'IE';
      }
      version = data[1];
    }
    // detect Microsoft Edge
    else if ((name == 'Chrome' || name != 'IE') && (data = /\bEdge\/([\d.]+)/.exec(ua))) {
      name = 'Microsoft Edge';
      version = data[1];
      layout = ['Trident'];
    }
    // leverage environment features
    if (useFeatures) {
      // detect server-side environments
      // Rhino has a global function while others have a global object
      if (isHostType(context, 'global')) {
        if (java) {
          data = java.lang.System;
          arch = data.getProperty('os.arch');
          os = os || data.getProperty('os.name') + ' ' + data.getProperty('os.version');
        }
        if (isModuleScope && isHostType(context, 'system') && (data = [context.system])[0]) {
          os || (os = data[0].os || null);
          try {
            data[1] = context.require('ringo/engine').version;
            version = data[1].join('.');
            name = 'RingoJS';
          } catch(e) {
            if (data[0].global.system == context.system) {
              name = 'Narwhal';
            }
          }
        }
        else if (typeof context.process == 'object' && (data = context.process)) {
          name = 'Node.js';
          arch = data.arch;
          os = data.platform;
          version = /[\d.]+/.exec(data.version)[0];
        }
        else if (rhino) {
          name = 'Rhino';
        }
      }
      // detect Adobe AIR
      else if (getClassOf((data = context.runtime)) == airRuntimeClass) {
        name = 'Adobe AIR';
        os = data.flash.system.Capabilities.os;
      }
      // detect PhantomJS
      else if (getClassOf((data = context.phantom)) == phantomClass) {
        name = 'PhantomJS';
        version = (data = data.version || null) && (data.major + '.' + data.minor + '.' + data.patch);
      }
      // detect IE compatibility modes
      else if (typeof doc.documentMode == 'number' && (data = /\bTrident\/(\d+)/i.exec(ua))) {
        // we're in compatibility mode when the Trident version + 4 doesn't
        // equal the document mode
        version = [version, doc.documentMode];
        if ((data = +data[1] + 4) != version[1]) {
          description.push('IE ' + version[1] + ' mode');
          layout && (layout[1] = '');
          version[1] = data;
        }
        version = name == 'IE' ? String(version[1].toFixed(1)) : version[0];
      }
      os = os && format(os);
    }
    // detect prerelease phases
    if (version && (data =
          /(?:[ab]|dp|pre|[ab]\d+pre)(?:\d+\+?)?$/i.exec(version) ||
          /(?:alpha|beta)(?: ?\d)?/i.exec(ua + ';' + (useFeatures && nav.appMinorVersion)) ||
          /\bMinefield\b/i.test(ua) && 'a'
        )) {
      prerelease = /b/i.test(data) ? 'beta' : 'alpha';
      version = version.replace(RegExp(data + '\\+?$'), '') +
        (prerelease == 'beta' ? beta : alpha) + (/\d+\+?/.exec(data) || '');
    }
    // detect Firefox Mobile
    if (name == 'Fennec' || name == 'Firefox' && /\b(?:Android|Firefox OS)\b/.test(os)) {
      name = 'Firefox Mobile';
    }
    // obscure Maxthon's unreliable version
    else if (name == 'Maxthon' && version) {
      version = version.replace(/\.[\d.]+/, '.x');
    }
    // detect Silk desktop/accelerated modes
    else if (name == 'Silk') {
      if (!/\bMobi/i.test(ua)) {
        os = 'Android';
        description.unshift('desktop mode');
      }
      if (/Accelerated *= *true/i.test(ua)) {
        description.unshift('accelerated');
      }
    }
    // detect Xbox 360 and Xbox One
    else if (/\bXbox\b/i.test(product)) {
      os = null;
      if (product == 'Xbox 360' && /\bIEMobile\b/.test(ua)) {
        description.unshift('mobile mode');
      }
    }
    // add mobile postfix
    else if ((/^(?:Chrome|IE|Opera)$/.test(name) || name && !product && !/Browser|Mobi/.test(name)) &&
        (os == 'Windows CE' || /Mobi/i.test(ua))) {
      name += ' Mobile';
    }
    // detect IE platform preview
    else if (name == 'IE' && useFeatures && context.external === null) {
      description.unshift('platform preview');
    }
    // detect BlackBerry OS version
    // http://docs.blackberry.com/en/developers/deliverables/18169/HTTP_headers_sent_by_BB_Browser_1234911_11.jsp
    else if ((/\bBlackBerry\b/.test(product) || /\bBB10\b/.test(ua)) && (data =
          (RegExp(product.replace(/ +/g, ' *') + '/([.\\d]+)', 'i').exec(ua) || 0)[1] ||
          version
        )) {
      data = [data, /BB10/.test(ua)];
      os = (data[1] ? (product = null, manufacturer = 'BlackBerry') : 'Device Software') + ' ' + data[0];
      version = null;
    }
    // detect Opera identifying/masking itself as another browser
    // http://www.opera.com/support/kb/view/843/
    else if (this != forOwn && (
          product != 'Wii' && (
            (useFeatures && opera) ||
            (/Opera/.test(name) && /\b(?:MSIE|Firefox)\b/i.test(ua)) ||
            (name == 'Firefox' && /\bOS X (?:\d+\.){2,}/.test(os)) ||
            (name == 'IE' && (
              (os && !/^Win/.test(os) && version > 5.5) ||
              /\bWindows XP\b/.test(os) && version > 8 ||
              version == 8 && !/\bTrident\b/.test(ua)
            ))
          )
        ) && !reOpera.test((data = parse.call(forOwn, ua.replace(reOpera, '') + ';'))) && data.name) {

      // when "indentifying", the UA contains both Opera and the other browser's name
      data = 'ing as ' + data.name + ((data = data.version) ? ' ' + data : '');
      if (reOpera.test(name)) {
        if (/\bIE\b/.test(data) && os == 'Mac OS') {
          os = null;
        }
        data = 'identify' + data;
      }
      // when "masking", the UA contains only the other browser's name
      else {
        data = 'mask' + data;
        if (operaClass) {
          name = format(operaClass.replace(/([a-z])([A-Z])/g, '$1 $2'));
        } else {
          name = 'Opera';
        }
        if (/\bIE\b/.test(data)) {
          os = null;
        }
        if (!useFeatures) {
          version = null;
        }
      }
      layout = ['Presto'];
      description.push(data);
    }
    // detect WebKit Nightly and approximate Chrome/Safari versions
    if ((data = (/\bAppleWebKit\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
      // correct build for numeric comparison
      // (e.g. "532.5" becomes "532.05")
      data = [parseFloat(data.replace(/\.(\d)$/, '.0$1')), data];
      // nightly builds are postfixed with a `+`
      if (name == 'Safari' && data[1].slice(-1) == '+') {
        name = 'WebKit Nightly';
        prerelease = 'alpha';
        version = data[1].slice(0, -1);
      }
      // clear incorrect browser versions
      else if (version == data[1] ||
          version == (data[2] = (/\bSafari\/([\d.]+\+?)/i.exec(ua) || 0)[1])) {
        version = null;
      }
      // use the full Chrome version when available
      data[1] = (/\bChrome\/([\d.]+)/i.exec(ua) || 0)[1];
      // detect Blink layout engine
      if (data[0] == 537.36 && data[2] == 537.36 && parseFloat(data[1]) >= 28 && name != 'IE' && name != 'Microsoft Edge') {
        layout = ['Blink'];
      }
      // detect JavaScriptCore
      // http://stackoverflow.com/questions/6768474/how-can-i-detect-which-javascript-engine-v8-or-jsc-is-used-at-runtime-in-androi
      if (!useFeatures || (!likeChrome && !data[1])) {
        layout && (layout[1] = 'like Safari');
        data = (data = data[0], data < 400 ? 1 : data < 500 ? 2 : data < 526 ? 3 : data < 533 ? 4 : data < 534 ? '4+' : data < 535 ? 5 : data < 537 ? 6 : data < 538 ? 7 : data < 601 ? 8 : '8');
      } else {
        layout && (layout[1] = 'like Chrome');
        data = data[1] || (data = data[0], data < 530 ? 1 : data < 532 ? 2 : data < 532.05 ? 3 : data < 533 ? 4 : data < 534.03 ? 5 : data < 534.07 ? 6 : data < 534.10 ? 7 : data < 534.13 ? 8 : data < 534.16 ? 9 : data < 534.24 ? 10 : data < 534.30 ? 11 : data < 535.01 ? 12 : data < 535.02 ? '13+' : data < 535.07 ? 15 : data < 535.11 ? 16 : data < 535.19 ? 17 : data < 536.05 ? 18 : data < 536.10 ? 19 : data < 537.01 ? 20 : data < 537.11 ? '21+' : data < 537.13 ? 23 : data < 537.18 ? 24 : data < 537.24 ? 25 : data < 537.36 ? 26 : layout != 'Blink' ? '27' : '28');
      }
      // add the postfix of ".x" or "+" for approximate versions
      layout && (layout[1] += ' ' + (data += typeof data == 'number' ? '.x' : /[.+]/.test(data) ? '' : '+'));
      // obscure version for some Safari 1-2 releases
      if (name == 'Safari' && (!version || parseInt(version) > 45)) {
        version = data;
      }
    }
    // detect Opera desktop modes
    if (name == 'Opera' &&  (data = /\bzbov|zvav$/.exec(os))) {
      name += ' ';
      description.unshift('desktop mode');
      if (data == 'zvav') {
        name += 'Mini';
        version = null;
      } else {
        name += 'Mobile';
      }
      os = os.replace(RegExp(' *' + data + '$'), '');
    }
    // detect Chrome desktop mode
    else if (name == 'Safari' && /\bChrome\b/.exec(layout && layout[1])) {
      description.unshift('desktop mode');
      name = 'Chrome Mobile';
      version = null;

      if (/\bOS X\b/.test(os)) {
        manufacturer = 'Apple';
        os = 'iOS 4.3+';
      } else {
        os = null;
      }
    }
    // strip incorrect OS versions
    if (version && version.indexOf((data = /[\d.]+$/.exec(os))) == 0 &&
        ua.indexOf('/' + data + '-') > -1) {
      os = trim(os.replace(data, ''));
    }
    // add layout engine
    if (layout && !/\b(?:Avant|Nook)\b/.test(name) && (
        /Browser|Lunascape|Maxthon/.test(name) ||
        /^(?:Adobe|Arora|Breach|Midori|Opera|Phantom|Rekonq|Rock|Sleipnir|Web)/.test(name) && layout[1])) {
      // don't add layout details to description if they are falsey
      (data = layout[layout.length - 1]) && description.push(data);
    }
    // combine contextual information
    if (description.length) {
      description = ['(' + description.join('; ') + ')'];
    }
    // append manufacturer
    if (manufacturer && product && product.indexOf(manufacturer) < 0) {
      description.push('on ' + manufacturer);
    }
    // append product
    if (product) {
      description.push((/^on /.test(description[description.length -1]) ? '' : 'on ') + product);
    }
    // parse OS into an object
    if (os) {
      data = / ([\d.+]+)$/.exec(os);
      isSpecialCasedOS = data && os.charAt(os.length - data[0].length - 1) == '/';
      os = {
        'architecture': 32,
        'family': (data && !isSpecialCasedOS) ? os.replace(data[0], '') : os,
        'version': data ? data[1] : null,
        'toString': function() {
          var version = this.version;
          return this.family + ((version && !isSpecialCasedOS) ? ' ' + version : '') + (this.architecture == 64 ? ' 64-bit' : '');
        }
      };
    }
    // add browser/OS architecture
    if ((data = /\b(?:AMD|IA|Win|WOW|x86_|x)64\b/i.exec(arch)) && !/\bi686\b/i.test(arch)) {
      if (os) {
        os.architecture = 64;
        os.family = os.family.replace(RegExp(' *' + data), '');
      }
      if (
          name && (/\bWOW64\b/i.test(ua) ||
          (useFeatures && /\w(?:86|32)$/.test(nav.cpuClass || nav.platform) && !/\bWin64; x64\b/i.test(ua)))
      ) {
        description.unshift('32-bit');
      }
    }

    ua || (ua = null);

    /*------------------------------------------------------------------------*/

    /**
     * The platform object.
     *
     * @name platform
     * @type Object
     */
    var platform = {};

    /**
     * The platform description.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.description = ua;

    /**
     * The name of the browser's layout engine.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.layout = layout && layout[0];

    /**
     * The name of the product's manufacturer.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.manufacturer = manufacturer;

    /**
     * The name of the browser/environment.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.name = name;

    /**
     * The alpha/beta release indicator.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.prerelease = prerelease;

    /**
     * The name of the product hosting the browser.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.product = product;

    /**
     * The browser's user agent string.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.ua = ua;

    /**
     * The browser/environment version.
     *
     * @memberOf platform
     * @type string|null
     */
    platform.version = name && version;

    /**
     * The name of the operating system.
     *
     * @memberOf platform
     * @type Object
     */
    platform.os = os || {

      /**
       * The CPU architecture the OS is built for.
       *
       * @memberOf platform.os
       * @type number|null
       */
      'architecture': null,

      /**
       * The family of the OS.
       *
       * Common values include:
       * "Windows", "Windows Server 2008 R2 / 7", "Windows Server 2008 / Vista",
       * "Windows XP", "OS X", "Ubuntu", "Debian", "Fedora", "Red Hat", "SuSE",
       * "Android", "iOS" and "Windows Phone"
       *
       * @memberOf platform.os
       * @type string|null
       */
      'family': null,

      /**
       * The version of the OS.
       *
       * @memberOf platform.os
       * @type string|null
       */
      'version': null,

      /**
       * Returns the OS string.
       *
       * @memberOf platform.os
       * @returns {string} The OS string.
       */
      'toString': function() { return 'null'; }
    };

    platform.parse = parse;
    platform.toString = toStringPlatform;

    if (platform.version) {
      description.unshift(version);
    }
    if (platform.name) {
      description.unshift(name);
    }
    if (os && name && !(os == String(os).split(' ')[0] && (os == name.split(' ')[0] || product))) {
      description.push(product ? '(' + os + ')' : 'on ' + os);
    }
    if (description.length) {
      platform.description = description.join(' ');
    }
    return platform;
  }

  /*--------------------------------------------------------------------------*/

  // export platform
  // some AMD build optimizers, like r.js, check for condition patterns like the following:
  if (true) {
    // define as an anonymous module so, through path mapping, it can be aliased
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return parse();
    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Narwhal, Node.js, Rhino -require, or RingoJS
    forOwn(parse(), function(value, key) {
      freeExports[key] = value;
    });
  }
  // in a browser or Rhino
  else {
    root.platform = parse();
  }
}.call(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/module.js */ 10)(module), __webpack_require__(/*! (webpack)/buildin/global.js */ 1)))

/***/ },
/* 16 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************!*\
  !*** ./~/file-loader!./~/paralleljs/lib/eval.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "aa8cb5fbc710c7dded973a341ced2e66.js";

/***/ },
/* 17 */,
/* 18 */,
/* 19 */
/* unknown exports provided */
/* all exports used */
/*!****************************************!*\
  !*** ./src/performance-measurement.ts ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(/*! lodash */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_benchmark__ = __webpack_require__(/*! benchmark */ 14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_benchmark___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_benchmark__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__transpiled_mandelbrot__ = __webpack_require__(/*! ./transpiled/mandelbrot */ 7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__transpiled_knights_tour__ = __webpack_require__(/*! ./transpiled/knights-tour */ 6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__ = __webpack_require__(/*! ./transpiled/monte-carlo */ 8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dynamic_knights_tour__ = __webpack_require__(/*! ./dynamic/knights-tour */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dynamic_mandelbrot__ = __webpack_require__(/*! ./dynamic/mandelbrot */ 4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__dynamic_monte_carlo__ = __webpack_require__(/*! ./dynamic/monte-carlo */ 5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__paralleljs_mandelbrot__ = __webpack_require__(/*! ./paralleljs/mandelbrot */ 12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__paralleljs_monte_carlo__ = __webpack_require__(/*! ./paralleljs/monte-carlo */ 13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__paralleljs_knights_tour__ = __webpack_require__(/*! ./paralleljs/knights-tour */ 11);


var platform = __webpack_require__(/*! platform */ 15);









var Benchmark = __WEBPACK_IMPORTED_MODULE_1_benchmark__["runInContext"]({ _: __WEBPACK_IMPORTED_MODULE_0_lodash__ });
window.Benchmark = Benchmark;
var runButton = document.querySelector("#run");
var outputTable = document.querySelector("#output-table");
var jsonOutputField = document.querySelector("#json-output");
var setCheckboxes = document.querySelectorAll('[id*="-set"]');
var knightRunner6x6 = document.querySelector("#knight-runner-6-6");
function addAsyncTest(suite, title, fn) {
    suite.add(title, function (deferred) {
        var benchmark = this;
        fn.apply(undefined, []).then(function () {
            deferred.resolve();
        }, function (error) {
            console.error(error);
            benchmark.error = error;
            deferred.resolve();
        });
    }, {
        defer: true
    });
}
function addKnightBoardTests(suite) {
    var boardSizes = knightRunner6x6.checked ? [5, 6] : [5];

    var _loop = function _loop() {
        if (_isArray) {
            if (_i >= _iterator.length) return "break";
            _ref = _iterator[_i++];
        } else {
            _i = _iterator.next();
            if (_i.done) return "break";
            _ref = _i.value;
        }

        var boardSize = _ref;

        var title = "Knights Tour (" + boardSize + "x" + boardSize + ")";
        suite.add("sync: " + title, function () {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__transpiled_knights_tour__["b" /* syncKnightTours */])({ x: 0, y: 0 }, boardSize);
        });
        addAsyncTest(suite, "parallel-dynamic: " + title, function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__dynamic_knights_tour__["a" /* parallelKnightTours */])({ x: 0, y: 0 }, boardSize);
        });
        addAsyncTest(suite, "parallel-transpiled: " + title, function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__transpiled_knights_tour__["a" /* parallelKnightTours */])({ x: 0, y: 0 }, boardSize);
        });
        addAsyncTest(suite, "paralleljs: " + title, function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__paralleljs_knights_tour__["a" /* parallelJSKnightTours */])({ x: 0, y: 0 }, boardSize);
        });
    };

    for (var _iterator = boardSizes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        var _ret = _loop();

        if (_ret === "break") break;
    }
}
function addMonteCarloTest(suite, options) {
    var runOptions = Object.assign(options, {
        projects: createProjects(options.numberOfProjects)
    });
    var configName = "(projects: " + options.numberOfProjects + ", runs: " + options.numRuns.toLocaleString() + ")";
    suite.add("sync: Monte Carlo Math.random " + configName, function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__dynamic_monte_carlo__["a" /* syncMonteCarlo */])(options);
    });
    addAsyncTest(suite, "parallel-dynamic: Monte Carlo Math.random " + configName, function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__dynamic_monte_carlo__["b" /* parallelMonteCarlo */])(runOptions);
    });
    suite.add("sync: Monte Carlo simjs " + configName, function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["b" /* syncMonteCarlo */])(options);
    });
    addAsyncTest(suite, "parallel-transpiled: Monte Carlo simjs " + configName, function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["a" /* parallelMonteCarlo */])(runOptions);
    });
    addAsyncTest(suite, "paralleljs: Monte Carlo simjs " + configName, function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__paralleljs_monte_carlo__["a" /* parallelJSMonteCarlo */])(runOptions);
    });
}
function addMonteCarloTests(suite) {
    var monteCarloOptions = {
        investmentAmount: 620000,
        numRuns: 100000,
        numYears: 15,
        performance: 0.0340000,
        seed: 10,
        volatility: 0.0896000
    };
    var _arr = [Math.pow(10, 4), Math.pow(10, 5)];
    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
        var numRuns = _arr[_i2];var _arr2 = [1, 4, 8, 16];

        for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
            var numberOfProjects = _arr2[_i3];
            var options = Object.assign({}, monteCarloOptions, { numberOfProjects: numberOfProjects, numRuns: numRuns });
            addMonteCarloTest(suite, options);
        }
    }
}
function addMandelbrotTests(suite) {
    var mandelbrotHeight = parseInt(document.querySelector("#mandelbrot-height").value, 10);
    var mandelbrotWidth = parseInt(document.querySelector("#mandelbrot-width").value, 10);
    var mandelbrotIterations = parseInt(document.querySelector("#mandelbrot-iterations").value, 10);
    var mandelbrotOptions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_mandelbrot__["a" /* createMandelOptions */])(mandelbrotWidth, mandelbrotHeight, mandelbrotIterations);
    suite.add("sync: Mandelbrot " + mandelbrotWidth + "x" + mandelbrotHeight + ", " + mandelbrotIterations, function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_mandelbrot__["b" /* syncMandelbrot */])(mandelbrotOptions, function () {
            return undefined;
        });
    });
    var _arr3 = [undefined, 1, 75, 150, 300, 600, 1200];

    var _loop2 = function _loop2() {
        var maxValuesPerTask = _arr3[_i4];
        var title = "Mandelbrot " + mandelbrotOptions.imageWidth + "x" + mandelbrotOptions.imageHeight + ", " + mandelbrotOptions.iterations;
        if (maxValuesPerTask) {
            title += " (" + maxValuesPerTask + ")";
        }
        addAsyncTest(suite, "parallel-dynamic: " + title, function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_mandelbrot__["c" /* parallelMandelbrot */])(mandelbrotOptions, { maxValuesPerTask: maxValuesPerTask });
        });
        addAsyncTest(suite, "parallel-transpiled: " + title, function () {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__transpiled_mandelbrot__["a" /* mandelbrot */])(mandelbrotOptions, { maxValuesPerTask: maxValuesPerTask });
        });
    };

    for (var _i4 = 0; _i4 < _arr3.length; _i4++) {
        _loop2();
    }
    addAsyncTest(suite, "paralleljs: Mandelbrot " + mandelbrotWidth + "x" + mandelbrotHeight + ", " + mandelbrotIterations, function () {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__paralleljs_mandelbrot__["a" /* parallelJSMandelbrot */])(mandelbrotOptions);
    });
}
function measure() {
    var allTestsSuite = new Benchmark.Suite();
    addMonteCarloTests(allTestsSuite);
    addMandelbrotTests(allTestsSuite);
    addKnightBoardTests(allTestsSuite);
    var suite = allTestsSuite.filter(function (benchmark) {
        for (var i = 0; i < setCheckboxes.length; ++i) {
            var checkbox = setCheckboxes[i];
            var parts = checkbox.id.split("-");
            var name = parts.slice(0, parts.length - 1).join("-");
            if (checkbox.checked && benchmark.name.startsWith(name)) {
                return true;
            }
        }
        return false;
    });
    suite.forEach(function (benchmark) {
        var index = suite.indexOf(benchmark);
        benchmark.on("cycle", function () {
            var body = outputTable.tBodies[0];
            var row = body.rows[index];
            row.cells[2].textContent = benchmark.stats.sample.length + 1 + "";
        });
    });
    suite.on("cycle", function (event) {
        appendTestResults(event);
    });
    suite.on("complete", function (event) {
        var benchmarks = event.currentTarget.map(function (benchmark) {
            return {
                info: benchmark.toString,
                name: benchmark.name,
                stats: benchmark.stats,
                times: benchmark.times
            };
        });
        jsonOutputField.textContent = JSON.stringify({ benchmarks: benchmarks, platform: platform }, undefined, "    ");
        runButton.disabled = false;
    });
    suite.on("start", initResultTable);
    suite.run({ async: true });
}
runButton.addEventListener("click", function (event) {
    event.preventDefault();
    runButton.disabled = true;
    measure();
});
function initResultTable(event) {
    clearOutputTable();
    function clearOutputTable() {
        while (outputTable.tBodies.length > 0) {
            outputTable.removeChild(outputTable.tBodies[0]);
        }
    }
    var body = outputTable.createTBody();
    event.currentTarget.forEach(function (suite) {
        var row = body.insertRow();

        var _suite$name$split = suite.name.split(":"),
            set = _suite$name$split[0],
            nameParts = _suite$name$split.slice(1);

        row.insertCell().textContent = set;
        row.insertCell().textContent = nameParts.join(":");
        var columns = outputTable.tHead.rows[0].cells.length;
        for (var i = 0; i < columns; ++i) {
            row.insertCell();
        }
    });
}
function appendTestResults(event) {
    var body = outputTable.tBodies[0];
    var benchmark = event.target;
    var index = event.currentTarget.indexOf(benchmark);
    var row = body.rows[index];
    row.cells[3].textContent = benchmark.stats.deviation.toFixed(4);
    row.cells[4].textContent = benchmark.stats.mean.toFixed(4);
    row.cells[5].textContent = benchmark.stats.moe.toFixed(4);
    row.cells[6].textContent = benchmark.stats.rme.toFixed(4);
    row.cells[7].textContent = benchmark.stats.sem.toFixed(4);
    row.cells[8].textContent = benchmark.stats.variance.toFixed(4);
    row.cells[9].textContent = benchmark.stats.sample.length.toFixed(0);
    row.cells[10].textContent = benchmark.hz.toFixed(4);
}
function createProjects(count) {
    var projects = [];
    for (var i = 0; i < count; ++i) {
        projects.push({
            startYear: Math.round(Math.random() * 15),
            totalAmount: Math.round(Math.random() * 100000)
        });
    }
    return projects;
}

/***/ }
],[19]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L3BhcmFsbGVsanMvbGliL3BhcmFsbGVsLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJhbGxlbGpzL2tuaWdodHMtdG91ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyYWxsZWxqcy9tYW5kZWxicm90LnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJhbGxlbGpzL21vbnRlLWNhcmxvLnRzIiwid2VicGFjazovLy8uL34vYmVuY2htYXJrL2JlbmNobWFyay5qcyIsIndlYnBhY2s6Ly8vLi9+L3BsYXRmb3JtL3BsYXRmb3JtLmpzIiwid2VicGFjazovLy8uL34vcGFyYWxsZWxqcy9saWIvZXZhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGVyZm9ybWFuY2UtbWVhc3VyZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDs7QUFFeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsNEJBQTRCO0FBQzlDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxpQ0FBaUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsa0JBQWtCOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFOztBQUVBLGFBQWEsbUNBQW1DO0FBQ2hEO0FBQ0EsNEdBQTRHO0FBQzVHLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDOztBQUVoQzs7QUFFQTtBQUNBLHVEQUF1RCxnQ0FBZ0MsMEVBQTBFO0FBQ2pLLEdBQUc7QUFDSCxrREFBa0QsZ0JBQWdCLGlDQUFpQyxrREFBa0Q7QUFDcko7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLGlCQUFpQjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLGlDQUFpQyxXQUFXO0FBQzVDLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTCxpQ0FBaUMsMEJBQTBCO0FBQzNEOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0oseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMENBQTBDOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMENBQTBDOztBQUUxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTLGlGQUFpRjtBQUMxRjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQ0FBMEM7O0FBRTFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osbUJBQW1CLHNFQUFzRTtBQUN6RjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDcllEO0FBQUEsSUFBYyxXQUFVLG9CQUFlO0FBWXZDLHFCQUFvRCxXQUFtQjtBQUNuRSxRQUFXLFFBQUcsQ0FDVixFQUFHLEdBQUUsQ0FBRSxHQUFHLEdBQUUsQ0FBSSxLQUFFLEVBQUcsR0FBRSxDQUFFLEdBQUcsR0FBSSxLQUFFLEVBQUcsR0FBRSxDQUFFLEdBQUcsR0FBRSxDQUFJLEtBQUUsRUFBRyxHQUFFLENBQUUsR0FBRyxHQUFLLEtBQ25FLEVBQUcsR0FBRyxHQUFHLEdBQUUsQ0FBSSxLQUFFLEVBQUcsR0FBRyxHQUFHLEdBQUksS0FBRSxFQUFHLEdBQUcsR0FBRyxHQUFFLENBQUksS0FBRSxFQUFHLEdBQUcsR0FBRyxHQUM1RDtBQUVGLFFBQVcsUUFBYSxJQUFTLE1BQVUsWUFBYztBQUNwRCxVQUFLLEtBQUk7QUFFZCxRQUFvQixpQkFBWSxZQUFhO0FBQzdDLFFBQVcsVUFBYTtBQUN4QixRQUFXLGtCQUEwRCxjQUFLLEtBQVk7QUFBaEIsZUFBaUIsRUFBWSxZQUFLLEtBQUcsR0FBTyxRQUFTO0tBQTFEO0FBRTdELFNBQUMsSUFBUyxRQUFJLEdBQU8sUUFBWSxVQUFPLFNBQUksR0FBRSxFQUFPLE9BQUc7QUFDeEQsWUFBZ0IsYUFBWSxVQUFPLE9BQUUsSUFBWSxZQUFZLFVBQU8sT0FBRztBQUNsRSxjQUFZLGNBQVEsUUFDN0I7QUFBQztBQUVELFdBQVksTUFBTyxTQUFJO0FBQ2IscUJBQXlCLE1BQU0sTUFBTyxTQUFNO1lBQWhDO1lBQUs7O0FBQ3ZCLFlBQWdCLGNBQWEsV0FBRSxJQUFZLFlBQWEsV0FBRztBQUV4RCxZQUFNLE1BQVksaUJBQU87QUFDUjtBQUNYLGtCQUFZLGVBQUs7QUFDakIsa0JBQU8sTUFIYyxDQUdVO0FBRXhDO0FBQUM7QUFFTztBQUNMLFlBQUUsTUFBb0IsZ0JBQUU7QUFDdkIsY0FBVTtBQUNMLGtCQUFPO0FBRWhCO0FBQUM7QUFFSSxjQUFZLGVBQU07QUFFbkIsYUFBQyxJQUFLLElBQUksR0FBRyxJQUFRLE1BQU8sUUFBRSxFQUFHLEdBQUc7QUFDcEMsZ0JBQVUsT0FBUSxNQUFJO0FBQ3RCLGdCQUFlLFlBQUcsRUFBRyxHQUFZLFdBQUUsSUFBTyxLQUFFLEdBQUcsR0FBWSxXQUFFLElBQU8sS0FBSztBQUM3QjtBQUM1QyxnQkFBZ0IsYUFBWSxVQUFFLEtBQUssS0FBYSxVQUFFLEtBQUssS0FBYSxVQUFFLElBQVksYUFBYyxVQUFFLElBQVksYUFBUyxNQUFVLFVBQUUsSUFBWSxZQUFZLFVBQUcsT0FBTztBQUVsSyxnQkFBWSxZQUFFO0FBQ1Isc0JBQUssS0FBQyxFQUFZLFlBQVcsV0FBRyxHQUFHLElBQzVDO0FBQ0o7QUFDSjtBQUFDO0FBRUssV0FDVjtBQUFDO0FBSUQsK0JBQXdELE9BQW1CO0FBRXZFLHdCQUEyQztBQUN2QyxZQUFXLFFBQUcsQ0FDVixFQUFFLEdBQUUsQ0FBRSxHQUFHLEdBQUUsQ0FBRyxLQUFFLEVBQUUsR0FBRSxDQUFFLEdBQUcsR0FBSSxLQUFFLEVBQUUsR0FBRSxDQUFFLEdBQUcsR0FBRSxDQUFHLEtBQUUsRUFBRSxHQUFFLENBQUUsR0FBRyxHQUFJLEtBQzVELEVBQUUsR0FBRyxHQUFHLEdBQUUsQ0FBRyxLQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUksS0FBRSxFQUFFLEdBQUcsR0FBRyxHQUFFLENBQUcsS0FBRSxFQUFFLEdBQUcsR0FBRyxHQUN0RDtBQUNGLFlBQVksU0FBcUI7QUFFN0IsYUFBQyxJQUFLLElBQUksR0FBRyxJQUFRLE1BQU8sUUFBRSxFQUFHLEdBQUc7QUFDcEMsZ0JBQVUsT0FBUSxNQUFJO0FBQ3RCLGdCQUFlLFlBQUcsRUFBRSxHQUFZLFdBQUUsSUFBTyxLQUFFLEdBQUcsR0FBWSxXQUFFLElBQU8sS0FBSTtBQUN2RSxnQkFBZ0IsYUFBWSxVQUFFLEtBQUssS0FBYSxVQUFFLEtBQUssS0FBYSxVQUFFLElBQVksYUFBYSxVQUFFLElBQzdGLGNBQVUsVUFBRSxNQUFVLE1BQUUsS0FBYSxVQUFFLE1BQVUsTUFBTyxNQUFVLFVBQUUsTUFBZSxXQUFFLEtBQWEsVUFBRSxNQUFlLFdBQUk7QUFDeEgsZ0JBQVksWUFBRTtBQUNQLHVCQUFLLEtBQ2Y7QUFDSjtBQUFDO0FBRUssZUFDVjtBQUFDO0FBRUQ7QUFDSSxZQUFZLFNBQXVCO0FBQzlCLDZCQUFtQyxXQUFRO0FBQUU7Ozs7Ozs7Ozs7O2dCQUF4Qjs7QUFDakIsa0NBQXFDLFdBQWtCO0FBQUU7Ozs7Ozs7Ozs7O29CQUFsQzs7QUFDbEIsdUJBQUssS0FBQyxDQUFNLE9BQWlCLGlCQUN2QztBQUNKO0FBQUM7QUFDSyxlQUNWO0FBQUM7QUFFSyxlQUFhLFNBQXFCLHNCQUFFLEVBQUssS0FBRSxFQUFlLDBCQUNwRCxRQUFhLGFBQ2pCLElBQUMsVUFBbUM7QUFDOUIsZUFBWSxZQUFXLFlBQVEsT0FBSSxJQUM3QztBQUFFLEtBSkMsRUFLSSxPQUFDLFVBQStCO0FBQzdCLDJCQUFtQixpQkFBTSxNQUFTO0FBQWQsbUJBQXVCLE9BQVU7U0FBekMsRUFDdEI7QUFBRztBQUU2RztBQUNNO0FBRTlIO0FBQUMsQzs7Ozs7Ozs7Ozs7Ozs7OztBQy9HRDtBQUFBLElBQWMsV0FBVSxvQkFBZTtBQUNaO0FBZ0IzQiwrQkFBK0MsR0FBNkI7QUFDeEUsd0JBQXFDO0FBQ2pDLFlBQU8sSUFBRyxFQUFHLEdBQUcsRUFBRSxHQUFNLE1BQUcsRUFBUTtBQUNuQyxZQUFLLElBQUs7QUFFTCxlQUFHLElBQVUsUUFBVyxZQUFFLEVBQUcsR0FBRztBQUM5QixnQkFBQyxTQUFDLEVBQUssTUFBSyxLQUFHLFNBQUMsRUFBRSxHQUFLLEtBQUssR0FBRTtBQUVqQztBQUFDO0FBRVk7QUFDYixnQkFBUSxLQUFJLEVBQUc7QUFDZCxjQUFFLElBQUksSUFBSSxFQUFLLE9BQUksRUFBRSxJQUFJLEVBQUc7QUFDNUIsY0FBSyxPQUFHLFNBQUMsRUFBSyxNQUFLLEtBQUcsU0FBRSxJQUFLLEtBQUksRUFDdEM7QUFBQztBQUVLLGVBQ1Y7QUFBQztBQUVELFFBQVUsT0FBRyxJQUFxQixrQkFBUSxRQUFXLGFBQU07QUFDM0QsUUFBUSxLQUFVLFFBQUksSUFBRSxJQUFJLElBQVUsUUFBYyxjQUFHO0FBRW5ELFNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBVSxRQUFXLFlBQUUsRUFBRyxHQUFHO0FBQzFDLFlBQU87QUFDRixlQUFJO0FBQ0Qsa0JBQVMsUUFBSSxJQUFLLE9BQUksSUFBVSxRQUFjLGNBQ3BEO0FBSFE7QUFLVixZQUFPLElBQWEsV0FBSTtBQUN4QixZQUFVLE9BQUksSUFBSztBQUNZO0FBQzNCLGFBQU0sUUFBSSxJQUFRO0FBQ2xCLGFBQUssT0FBSyxLQUFJLElBQVU7QUFDeEIsYUFBSyxPQUFLLEtBQUksSUFBWTtBQUMxQixhQUFLLE9BQUssS0FDbEI7QUFBQztBQUNLLFdBQ1Y7QUFBQztBQUlELDhCQUEwRTtBQUN0RSxRQUFXLFFBQUksNkNBQU0sQ0FBa0Isa0JBQWM7QUFDL0MsZUFBYSxTQUFNLE9BQUUsRUFBSyxLQUFzQixxQkFBUSxRQUF1Qix1QkFDN0UsSUFBQyxVQUFzQjtBQUNqQixlQUFzQixzQkFBSyxNQUFRLE9BQzdDO0FBQ1IsS0FKVztBQUlWLEM7Ozs7Ozs7Ozs7Ozs7OENDaEVEO0FBQUEsSUFBYyxXQUFVLG9CQUFlO0FBc0h2QywyQkFBaUU7QUFDdkQsa0JBQWMsT0FBRztBQUNILDBCQUFTO0FBQ2hCLG1CQUFPO0FBQ1QsaUJBQU87QUFDTixrQkFBSTtBQUNELHFCQUFHO0FBQ04sa0JBQUk7QUFDUixjQUFXO0FBQ0wsb0JBQ2I7QUFUd0IsS0FBWixFQVVqQjtBQUFDO0FBRUQscUNBQXFGO0FBQ2pGLFFBQVksU0FBRyxJQUFpQixLQUFVO0FBTXZDOzs7OztBQUNILDhCQUE2QyxXQUFrQjtBQUMzRCxtQ0FBNEM7QUFDeEMsZ0JBQXlCLHdCQUFVLFFBQWtCO0FBQ3JELGdCQUFxQixvQkFBTztBQUV4QixpQkFBQyxJQUFnQixlQUFJLEdBQWMsZUFBVSxRQUFPLFFBQUUsRUFBYyxjQUFHO0FBQ3ZFLG9CQUFzQixtQkFBVSxRQUFlO0FBQy9DLG9CQUF5QixzQkFBZSxpQkFBTSxJQUFJLElBQVksVUFBYSxlQUFNO0FBRWxCO0FBQy9ELG9CQUFpQixjQUFtQixtQkFBcUI7QUFDcEMsd0NBQUcsQ0FBc0Isd0JBQXVCLHVCQUFlO0FBRTdFLHdCQUFjLGdCQUFLLElBQVMsT0FBTyxPQUFZLGFBQVMsUUFBYTtBQUUzRCxvQ0FDckI7QUFBQztBQUVLLG1CQUNWO0FBQUM7QUFFRCxZQUFZLFNBQWUsSUFBUyxNQUFRLFFBQVc7QUFDbkQsYUFBQyxJQUFRLE9BQUksR0FBTSxRQUFZLFVBQUUsRUFBTSxNQUFHO0FBQ3BDLG1CQUFNLFFBQUcsSUFBUyxNQUFRLFFBQ3BDO0FBQUM7QUFFRyxhQUFDLElBQU8sTUFBSSxHQUFLLE1BQVUsUUFBUSxTQUFPLE9BQUc7QUFDN0MsZ0JBQWEsVUFBRyxDQUFNO0FBRWxCLGlCQUFDLElBQUssSUFBSSxHQUFHLEtBQVksVUFBSyxLQUFHO0FBQ3VEO0FBQ3hGLG9CQUF1QixvQkFBSSxJQUFPLEtBQVU7QUFDckMsd0JBQUssS0FBUSxRQUFFLElBQUssS0FDL0I7QUFBQztBQUU0RDtBQUM1Qyw4QkFBVTtBQUV2QixpQkFBQyxJQUFRLFFBQUksR0FBTSxRQUFVLFFBQU8sUUFBRSxFQUFNLE9BQUc7QUFDekMsdUJBQU0sT0FBSyxPQUFVLFFBQy9CO0FBQ0o7QUFBQztBQUVLLGVBQ1Y7QUFBQztBQUVEO0FBQ0ksWUFBZSxZQUFnQjtBQUMzQixhQUFDLElBQVEsT0FBSSxHQUFNLE9BQVUsUUFBUyxVQUFFLEVBQU0sTUFBRztBQUNqRCxnQkFBd0IscUJBQXNCLG9CQUFNLFNBQU87QUFDM0QsZ0JBQWMsV0FBRyxvQkFBMEIsaUJBQU0sTUFBUztBQUFkLHVCQUF1QixPQUFVLFFBQVk7YUFBckQsRUFBMEQ7QUFDckYsc0JBQUssS0FDbEI7QUFBQztBQUNLLGVBQ1Y7QUFBQztBQUVELDhDQUE2RDtBQUN6RCxZQUE2QiwwQkFBZ0I7QUFFN0MsWUFBd0IsdUJBQVUsUUFBa0I7QUFDaEQsYUFBQyxJQUFRLE9BQUksR0FBTSxPQUFVLFFBQVMsVUFBRSxFQUFNLE1BQUc7QUFDN0IsbUNBQXVCLHVCQUFZLFVBQU87QUFDdkMsb0NBQUssS0FDaEM7QUFBQztBQUNLLGVBQ1Y7QUFBQztBQUVELFFBQXNCLHFCQUFzQixRQUFVO0FBRW5ELFFBQVEsUUFBVSxhQUFXLFFBQWlCLGlCQUFFO0FBQzdCLDZCQUFVLFFBQVMsU0FBTSxNQUFRLFFBQVUsWUFBVSxRQUFnQixpQkFBRSxDQUFRLFFBQVUsWUFBSyxLQUFVLFFBQzlIO0FBQUM7QUFFRCxRQUFjLG1CQUFtQixTQUFLLGVBQUcsR0FBRztBQUFMLGVBQVcsRUFBVSxZQUFJLEVBQVk7S0FBcEQ7QUFFa0M7QUFDMUQsUUFBeUIsc0JBQThCO0FBQ2xELHlCQUEwQjtBQUFFOzs7Ozs7Ozs7OztZQUFmOztBQUNkLFlBQVMsTUFBc0Isb0JBQVEsUUFBVyxhQUFzQixvQkFBUSxRQUFXLGNBQU87QUFDL0YsWUFBSyxLQUNaO0FBQUM7QUFFRCxRQUFlLFlBQXlCO0FBQ3hDLFFBQTZCLDBCQUFtQyxpQ0FBWTtBQUU1RSxRQUFjLDhCQUE0QixpQkFBTSxNQUFTO0FBQWQsZUFBdUIsS0FBSSxJQUFLLE1BQVMsUUFBVztLQUE1RCxFQUFpRTtBQUU5RjtBQUNjLDBCQUFTLFFBQWlCO0FBQ2pDLG1CQUFTLFFBQVU7QUFDTDtBQUNoQixpQkFBUyxRQUFRO0FBQ2hCO0FBQ1c7QUFDSix5QkFBa0IsaUJBQVUsV0FFbkQ7QUFUVztBQVNWO0FBRUQsMEJBQTJDLFNBQXFDO0FBQzVFLFFBQXVCLG9CQUFNO0FBQzdCLDJCQUFvQyxPQUFrQjtBQUM1QyxzQkFBWTtBQUFNLG1CQUFJLENBQUMsT0FBWSxNQUFLLFNBQWdCLGVBQVMsTUFBSyxRQUFjLFdBQUMsT0FBWSxNQUFHLE9BQWdCLGVBQVMsTUFBRyxLQUMxSTtTQURpQjtBQUNoQjtBQUVELDBCQUE0QyxnQkFBNkI7QUFDL0QsZUFBQyxDQUNILEVBQWEsYUFBbUIsbUJBQU0sTUFBZ0IsZ0JBQU0sTUFBUyxTQUFZLFlBQUcsR0FBVyxXQUFPLFFBQ3RHLEVBQWEsYUFBbUMsbUNBQU0sTUFBZ0IsaUJBQWMsWUFBVSxXQUFNLE1BQVUsVUFBWSxZQUFHLEdBQVcsV0FBTSxNQUFJLElBQWtCLGtCQUNwSyxFQUFhLGFBQW9CLG9CQUFNLE1BQXFCLHFCQUFNLE1BQVEsUUFBWSxZQUFHLEdBQVcsV0FBTyxPQUFJLElBQWdCLGlCQUFjLFlBQVksYUFDekosRUFBYSxhQUFpQyxpQ0FBTSxNQUFPLE9BQVksWUFBRyxHQUFXLFdBQU8sT0FBSSxJQUV4RztBQUFDO0FBRUQ7QUFDSSxZQUFVLFNBQVUsUUFBYTtBQUNqQyxZQUFzQixtQkFBYyxZQUFvQixvQkFBUSxRQUFZO0FBRXZFLDhCQUF1QztBQUFFOzs7Ozs7Ozs7OztnQkFBdkI7O0FBQ2hCLGdCQUFhLGlCQUFhLFNBQUU7QUFFL0I7QUFBQztBQUNLLHNCQUFnQixhQUMxQjtBQUFDO0FBQ0ssZUFDVjtBQUFDO0FBRUQsb0JBQWdDO0FBQzVCLFlBQVUsT0FBTyxLQUFNLE1BQU8sT0FBTyxTQUFNO0FBRXhDLFlBQU8sT0FBTyxTQUFLLEdBQUU7QUFDZCxtQkFBTyxPQUNqQjtBQUFDO0FBRUssZUFBQyxDQUFPLE9BQUssT0FBSyxLQUFTLE9BQU8sU0FDNUM7QUFBQztBQUVELFFBQW9CLGlCQUE2QjtBQUNqRCxRQUE2QiwwQkFBYyxZQUFnQixnQkFBUSxRQUFZO0FBQ3hELDRCQUFLLGVBQUcsR0FBRztBQUFMLGVBQVcsSUFBTTs7QUFFOUMsUUFBWSxTQUFlLGFBQWUsZ0JBQWEsWUFBd0Isd0JBQVEsUUFBYTtBQUNwRyxRQUFtQixnQkFBdUM7QUFDMUQsUUFBZ0IsYUFBTyxLQUFNLE1BQXdCLHdCQUFPLFNBQXNCO0FBQ2xGLFFBQWEsVUFBaUI7QUFFMUIsU0FBQyxJQUFLLElBQUksR0FBRyxJQUEwQix3QkFBTyxRQUFHLEtBQWMsWUFBRztBQUNsRSxZQUFZO0FBQ0wsaUJBQVEsT0FBVTtBQUNsQixpQkFBUSxPQUFVO0FBQ1gsd0JBQ1o7QUFKc0I7QUFNcEIsYUFBQyxJQUFLLElBQUksR0FBRyxJQUFJLElBQWEsWUFBRSxFQUFHLEdBQUc7QUFDdEMsZ0JBQVcsUUFBMEIsd0JBQUk7QUFDbkMsbUJBQUksTUFBTyxLQUFJLElBQU8sT0FBSSxLQUFTO0FBQ25DLG1CQUFJLE1BQU8sS0FBSSxJQUFPLE9BQUksS0FBUztBQUV6QyxnQkFBVyxRQUFnQixjQUF3Qix3QkFBRyxJQUFVO0FBQ25ELDBCQUFNLE1BQU0sUUFBRyxDQUFjLGNBQU0sTUFBTSxTQUFNLEtBQUs7QUFDakUsZ0JBQWUsWUFBUyxPQUFXLFdBQU0sTUFBTSxRQUFTLE9BQVcsV0FBTSxNQUFNLFNBQUksRUFBTyxPQUFPLE1BQUssTUFBSyxLQUFRLE9BQVUsV0FBSyxLQUFRLE9BQWE7QUFDOUksc0JBQUksTUFBTyxLQUFJLElBQVUsVUFBSSxLQUFTO0FBQ3RDLHNCQUFJLE1BQU8sS0FBSSxJQUFVLFVBQUksS0FDMUM7QUFBQztBQUVNLGdCQUFLLEtBQ2hCO0FBQUM7QUFFRCxRQUFvQix3QkFBZ0I7QUFBTSxlQUFJLENBQUMsQ0FBYyxjQUFNLE1BQVE7S0FBOUM7QUFDZixtQkFBUTtBQUFNLGVBQVMsTUFBVyxhQUFnQixjQUFNLE1BQU0sUUFBMEIsd0JBQVM7O0FBRS9HLFFBQWMsV0FBTyxLQUFNLE1BQXdCLHdCQUFPLFNBQU07QUFDMUQ7QUFDSztBQUNELGdCQUFnQjtBQUNuQixhQUF5Qix3QkFBd0Isd0JBQU8sU0FBSztBQUMxRCxnQkFBUSxPQUF5QjtBQUNwQyxhQUF5Qix3QkFBRztBQUN4QjtBQUNDO0FBQ0QsaUJBQXlCLHdCQUF3Qix3QkFBTyxTQUFZO0FBQ3BFLGlCQUF5Qix3QkFHeEM7QUFMa0I7QUFQUDtBQVlWO0FBSUQsOEJBQStFO0FBQzNFLFFBQWEsVUFBb0Isa0JBQWM7QUFFMEI7QUFDbkUsZUFBYSxTQUFRLFFBQVMsU0FBUTtBQUM1QixrQkFBTSxPQUFVLG9CQUErQjtBQUNwRCxhQUFTO0FBQ0Esc0JBQ2Q7QUFKd0MsT0FLbEMsUUFBaUYsaUZBQXdDO0FBTDlILEtBTUssUUFBNkIsNkJBQzdCLFFBQWtCLGtCQUN0QixJQUFDLFVBQTJCO0FBQzVCLFlBQVMsTUFBOEIsNEJBQU8sT0FBVTtBQUNsRCxlQUFpQixpQkFBUSxTQUNuQztBQUNSO0FBQUMsQzs7Ozs7Ozs7Ozs7O0FDdFZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LE1BQU07QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRCxxQkFBcUIsNkRBQTZEO0FBQ2xGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkIsMEJBQTBCO0FBQzFCLDRCQUE0QjtBQUM1Qiw4QkFBOEI7QUFDOUIseUJBQXlCO0FBQ3pCO0FBQ0EsbUJBQW1CO0FBQ25CLGlCQUFpQjtBQUNqQixlQUFlO0FBQ2YsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsWUFBWTtBQUNaLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7OztzRENwd0ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsR0FBRztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBa0Y7O0FBRWxGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RjtBQUN6RjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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VjtBQUFDLEMiLCJmaWxlIjoicGVyZm9ybWFuY2UtbWVhc3VyZW1lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsi77u/KGZ1bmN0aW9uICgpIHtcblx0dmFyIGlzQ29tbW9uSlMgPSB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cztcblx0dmFyIGlzTm9kZSA9ICEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcyA9PT0gd2luZG93KTtcblx0dmFyIHNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZSB8fCBmdW5jdGlvbiAoY2IpIHtcblx0XHRzZXRUaW1lb3V0KGNiLCAwKTtcblx0fTtcblx0dmFyIFdvcmtlciA9IGlzTm9kZSA/IHJlcXVpcmUoX19kaXJuYW1lICsgJy9Xb3JrZXIuanMnKSA6IHNlbGYuV29ya2VyO1xuXHR2YXIgVVJMID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gKHNlbGYuVVJMID8gc2VsZi5VUkwgOiBzZWxmLndlYmtpdFVSTCkgOiBudWxsO1xuXHR2YXIgX3N1cHBvcnRzID0gKGlzTm9kZSB8fCBzZWxmLldvcmtlcikgPyB0cnVlIDogZmFsc2U7IC8vIG5vZGUgYWx3YXlzIHN1cHBvcnRzIHBhcmFsbGVsXG5cblx0ZnVuY3Rpb24gZXh0ZW5kKGZyb20sIHRvKSB7XG5cdFx0aWYgKCF0bykgdG8gPSB7fTtcblx0XHRmb3IgKHZhciBpIGluIGZyb20pIHtcblx0XHRcdGlmICh0b1tpXSA9PT0gdW5kZWZpbmVkKSB0b1tpXSA9IGZyb21baV07XG5cdFx0fVxuXHRcdHJldHVybiB0bztcblx0fVxuXG5cdGZ1bmN0aW9uIE9wZXJhdGlvbigpIHtcblx0XHR0aGlzLl9jYWxsYmFja3MgPSBbXTtcblx0XHR0aGlzLl9lcnJDYWxsYmFja3MgPSBbXTtcblxuXHRcdHRoaXMuX3Jlc29sdmVkID0gMDtcblx0XHR0aGlzLl9yZXN1bHQgPSBudWxsO1xuXHR9XG5cblx0T3BlcmF0aW9uLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24gKGVyciwgcmVzKSB7XG5cdFx0aWYgKCFlcnIpIHtcblx0XHRcdHRoaXMuX3Jlc29sdmVkID0gMTtcblx0XHRcdHRoaXMuX3Jlc3VsdCA9IHJlcztcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9jYWxsYmFja3MubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dGhpcy5fY2FsbGJhY2tzW2ldKHJlcyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3Jlc29sdmVkID0gMjtcblx0XHRcdHRoaXMuX3Jlc3VsdCA9IGVycjtcblxuXHRcdFx0Zm9yICh2YXIgaUUgPSAwOyBpRSA8IHRoaXMuX2VyckNhbGxiYWNrcy5sZW5ndGg7ICsraUUpIHtcblx0XHRcdFx0dGhpcy5fZXJyQ2FsbGJhY2tzW2lFXShlcnIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuXHRcdHRoaXMuX2VyckNhbGxiYWNrcyA9IFtdO1xuXHR9O1xuXG5cdE9wZXJhdGlvbi5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChjYiwgZXJyQ2IpIHtcblx0XHRpZiAodGhpcy5fcmVzb2x2ZWQgPT09IDEpIHsgLy8gcmVzdWx0XG5cdFx0XHRpZiAoY2IpIHtcblx0XHRcdFx0Y2IodGhpcy5fcmVzdWx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fcmVzb2x2ZWQgPT09IDIpIHsgLy8gZXJyb3Jcblx0XHRcdGlmIChlcnJDYikge1xuXHRcdFx0XHRlcnJDYih0aGlzLl9yZXN1bHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChjYikge1xuXHRcdFx0dGhpcy5fY2FsbGJhY2tzW3RoaXMuX2NhbGxiYWNrcy5sZW5ndGhdID0gY2I7XG5cdFx0fVxuXG5cdFx0aWYgKGVyckNiKSB7XG5cdFx0XHR0aGlzLl9lcnJDYWxsYmFja3NbdGhpcy5fZXJyQ2FsbGJhY2tzLmxlbmd0aF0gPSBlcnJDYjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdGV2YWxQYXRoOiBpc05vZGUgPyBfX2Rpcm5hbWUgKyAnL2V2YWwuanMnIDogbnVsbCxcblx0XHRtYXhXb3JrZXJzOiBpc05vZGUgPyByZXF1aXJlKCdvcycpLmNwdXMoKS5sZW5ndGggOiAobmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3kgfHwgNCksXG5cdFx0c3luY2hyb25vdXM6IHRydWUsXG5cdFx0ZW52OiB7fSxcblx0XHRlbnZOYW1lc3BhY2U6ICdlbnYnXG5cdH07XG5cblx0ZnVuY3Rpb24gUGFyYWxsZWwoZGF0YSwgb3B0aW9ucykge1xuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0dGhpcy5vcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcblx0XHR0aGlzLm9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb24oKTtcblx0XHR0aGlzLm9wZXJhdGlvbi5yZXNvbHZlKG51bGwsIHRoaXMuZGF0YSk7XG5cdFx0dGhpcy5yZXF1aXJlZFNjcmlwdHMgPSBbXTtcblx0XHR0aGlzLnJlcXVpcmVkRnVuY3Rpb25zID0gW107XG5cdH1cblxuXHQvLyBzdGF0aWMgbWV0aG9kXG5cdFBhcmFsbGVsLmlzU3VwcG9ydGVkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3N1cHBvcnRzOyB9XG5cblx0UGFyYWxsZWwucHJvdG90eXBlLmdldFdvcmtlclNvdXJjZSA9IGZ1bmN0aW9uIChjYiwgZW52KSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHZhciBwcmVTdHIgPSAnJztcblx0XHR2YXIgaSA9IDA7XG5cdFx0aWYgKCFpc05vZGUgJiYgdGhpcy5yZXF1aXJlZFNjcmlwdHMubGVuZ3RoICE9PSAwKSB7XG5cdFx0XHRwcmVTdHIgKz0gJ2ltcG9ydFNjcmlwdHMoXCInICsgdGhpcy5yZXF1aXJlZFNjcmlwdHMuam9pbignXCIsXCInKSArICdcIik7XFxyXFxuJztcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5yZXF1aXJlZEZ1bmN0aW9ucy5sZW5ndGg7ICsraSkge1xuXHRcdFx0aWYgKHRoaXMucmVxdWlyZWRGdW5jdGlvbnNbaV0ubmFtZSkge1xuXHRcdFx0XHRwcmVTdHIgKz0gJ3ZhciAnICsgdGhpcy5yZXF1aXJlZEZ1bmN0aW9uc1tpXS5uYW1lICsgJyA9ICcgKyB0aGlzLnJlcXVpcmVkRnVuY3Rpb25zW2ldLmZuLnRvU3RyaW5nKCkgKyAnOyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmVTdHIgKz0gdGhpcy5yZXF1aXJlZEZ1bmN0aW9uc1tpXS5mbi50b1N0cmluZygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGVudiA9IEpTT04uc3RyaW5naWZ5KGVudiB8fCB7fSk7XG5cblx0XHR2YXIgbnMgPSB0aGlzLm9wdGlvbnMuZW52TmFtZXNwYWNlO1xuXG5cdFx0aWYgKGlzTm9kZSkge1xuXHRcdFx0cmV0dXJuIHByZVN0ciArICdwcm9jZXNzLm9uKFwibWVzc2FnZVwiLCBmdW5jdGlvbihlKSB7Z2xvYmFsLicgKyBucyArICcgPSAnICsgZW52ICsgJztwcm9jZXNzLnNlbmQoSlNPTi5zdHJpbmdpZnkoKCcgKyBjYi50b1N0cmluZygpICsgJykoSlNPTi5wYXJzZShlKS5kYXRhKSkpfSknO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gcHJlU3RyICsgJ3NlbGYub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge3ZhciBnbG9iYWwgPSB7fTsgZ2xvYmFsLicgKyBucyArICcgPSAnICsgZW52ICsgJztzZWxmLnBvc3RNZXNzYWdlKCgnICsgY2IudG9TdHJpbmcoKSArICcpKGUuZGF0YSkpfSc7XG5cdFx0fVxuXHR9O1xuXG5cdFBhcmFsbGVsLnByb3RvdHlwZS5yZXF1aXJlID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSxcblx0XHRcdGZ1bmM7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdGZ1bmMgPSBhcmdzW2ldO1xuXG5cdFx0XHRpZiAodHlwZW9mIGZ1bmMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMucmVxdWlyZWRTY3JpcHRzLnB1c2goZnVuYyk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXMucmVxdWlyZWRGdW5jdGlvbnMucHVzaCh7IGZuOiBmdW5jIH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZnVuYyA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0dGhpcy5yZXF1aXJlZEZ1bmN0aW9ucy5wdXNoKGZ1bmMpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFBhcmFsbGVsLnByb3RvdHlwZS5fc3Bhd25Xb3JrZXIgPSBmdW5jdGlvbiAoY2IsIGVudikge1xuXHRcdHZhciB3cms7XG5cdFx0dmFyIHNyYyA9IHRoaXMuZ2V0V29ya2VyU291cmNlKGNiLCBlbnYpO1xuXHRcdGlmIChpc05vZGUpIHtcblx0XHRcdHdyayA9IG5ldyBXb3JrZXIodGhpcy5vcHRpb25zLmV2YWxQYXRoKTtcblx0XHRcdHdyay5wb3N0TWVzc2FnZShzcmMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoV29ya2VyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHRoaXMucmVxdWlyZWRTY3JpcHRzLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZXZhbFBhdGggIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdHdyayA9IG5ldyBXb3JrZXIodGhpcy5vcHRpb25zLmV2YWxQYXRoKTtcblx0XHRcdFx0XHRcdHdyay5wb3N0TWVzc2FnZShzcmMpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgdXNlIHJlcXVpcmVkIHNjcmlwdHMgd2l0aG91dCBldmFsLmpzIScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICghVVJMKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGNyZWF0ZSBhIGJsb2IgVVJMIGluIHRoaXMgYnJvd3NlciEnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtzcmNdLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH0pO1xuXHRcdFx0XHRcdHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdFx0XHRcdFx0d3JrID0gbmV3IFdvcmtlcih1cmwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZXZhbFBhdGggIT09IG51bGwpIHsgLy8gYmxvYi91cmwgdW5zdXBwb3J0ZWQsIGNyb3NzLW9yaWdpbiBlcnJvclxuXHRcdFx0XHRcdHdyayA9IG5ldyBXb3JrZXIodGhpcy5vcHRpb25zLmV2YWxQYXRoKTtcblx0XHRcdFx0XHR3cmsucG9zdE1lc3NhZ2Uoc3JjKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHdyaztcblx0fTtcblxuXHRQYXJhbGxlbC5wcm90b3R5cGUuc3Bhd24gPSBmdW5jdGlvbiAoY2IsIGVudikge1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHR2YXIgbmV3T3AgPSBuZXcgT3BlcmF0aW9uKCk7XG5cblx0XHRlbnYgPSBleHRlbmQodGhpcy5vcHRpb25zLmVudiwgZW52IHx8IHt9KTtcblxuXHRcdHRoaXMub3BlcmF0aW9uLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHdyayA9IHRoYXQuX3NwYXduV29ya2VyKGNiLCBlbnYpO1xuXHRcdFx0aWYgKHdyayAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHdyay5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG5cdFx0XHRcdFx0d3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0XHRcdHRoYXQuZGF0YSA9IG1zZy5kYXRhO1xuXHRcdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0d3JrLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdHdyay50ZXJtaW5hdGUoKTtcblx0XHRcdFx0XHRuZXdPcC5yZXNvbHZlKGUsIG51bGwpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR3cmsucG9zdE1lc3NhZ2UodGhhdC5kYXRhKTtcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5vcHRpb25zLnN5bmNocm9ub3VzKSB7XG5cdFx0XHRcdHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YSA9IGNiKHRoYXQuZGF0YSk7XG5cdFx0XHRcdFx0XHRuZXdPcC5yZXNvbHZlKG51bGwsIHRoYXQuZGF0YSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0bmV3T3AucmVzb2x2ZShlLCBudWxsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXb3JrZXJzIGRvIG5vdCBleGlzdCBhbmQgc3luY2hyb25vdXMgb3BlcmF0aW9uIG5vdCBhbGxvd2VkIScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub3BlcmF0aW9uID0gbmV3T3A7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0UGFyYWxsZWwucHJvdG90eXBlLl9zcGF3bk1hcFdvcmtlciA9IGZ1bmN0aW9uIChpLCBjYiwgZG9uZSwgZW52LCB3cmspIHtcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRpZiAoIXdyaykgd3JrID0gdGhhdC5fc3Bhd25Xb3JrZXIoY2IsIGVudik7XG5cblx0XHRpZiAod3JrICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHdyay5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVtpXSA9IG1zZy5kYXRhO1xuXHRcdFx0XHRkb25lKG51bGwsIHdyayk7XG5cdFx0XHR9O1xuXHRcdFx0d3JrLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR3cmsudGVybWluYXRlKCk7XG5cdFx0XHRcdGRvbmUoZSk7XG5cdFx0XHR9O1xuXHRcdFx0d3JrLnBvc3RNZXNzYWdlKHRoYXQuZGF0YVtpXSk7XG5cdFx0fSBlbHNlIGlmICh0aGF0Lm9wdGlvbnMuc3luY2hyb25vdXMpIHtcblx0XHRcdHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVtpXSA9IGNiKHRoYXQuZGF0YVtpXSk7XG5cdFx0XHRcdGRvbmUoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dvcmtlcnMgZG8gbm90IGV4aXN0IGFuZCBzeW5jaHJvbm91cyBvcGVyYXRpb24gbm90IGFsbG93ZWQhJyk7XG5cdFx0fVxuXHR9O1xuXG5cdFBhcmFsbGVsLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAoY2IsIGVudikge1xuXHRcdGVudiA9IGV4dGVuZCh0aGlzLm9wdGlvbnMuZW52LCBlbnYgfHwge30pO1xuXG5cdFx0aWYgKCF0aGlzLmRhdGEubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zcGF3bihjYiwgZW52KTtcblx0XHR9XG5cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0dmFyIHN0YXJ0ZWRPcHMgPSAwO1xuXHRcdHZhciBkb25lT3BzID0gMDtcblx0XHRmdW5jdGlvbiBkb25lKGVyciwgd3JrKSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUoZXJyLCBudWxsKTtcblx0XHRcdH0gZWxzZSBpZiAoKytkb25lT3BzID09PSB0aGF0LmRhdGEubGVuZ3RoKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhKTtcblx0XHRcdFx0aWYgKHdyaykgd3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0fSBlbHNlIGlmIChzdGFydGVkT3BzIDwgdGhhdC5kYXRhLmxlbmd0aCkge1xuXHRcdFx0XHR0aGF0Ll9zcGF3bk1hcFdvcmtlcihzdGFydGVkT3BzKyssIGNiLCBkb25lLCBlbnYsIHdyayk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAod3JrKSB3cmsudGVybWluYXRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIG5ld09wID0gbmV3IE9wZXJhdGlvbigpO1xuXHRcdHRoaXMub3BlcmF0aW9uLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0Zm9yICg7IHN0YXJ0ZWRPcHMgLSBkb25lT3BzIDwgdGhhdC5vcHRpb25zLm1heFdvcmtlcnMgJiYgc3RhcnRlZE9wcyA8IHRoYXQuZGF0YS5sZW5ndGg7ICsrc3RhcnRlZE9wcykge1xuXHRcdFx0XHR0aGF0Ll9zcGF3bk1hcFdvcmtlcihzdGFydGVkT3BzLCBjYiwgZG9uZSwgZW52KTtcblx0XHRcdH1cblx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRuZXdPcC5yZXNvbHZlKGVyciwgbnVsbCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5vcGVyYXRpb24gPSBuZXdPcDtcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRQYXJhbGxlbC5wcm90b3R5cGUuX3NwYXduUmVkdWNlV29ya2VyID0gZnVuY3Rpb24gKGRhdGEsIGNiLCBkb25lLCBlbnYsIHdyaykge1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRpZiAoIXdyaykgd3JrID0gdGhhdC5fc3Bhd25Xb3JrZXIoY2IsIGVudik7XG5cblx0XHRpZiAod3JrICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHdyay5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVt0aGF0LmRhdGEubGVuZ3RoXSA9IG1zZy5kYXRhO1xuXHRcdFx0XHRkb25lKG51bGwsIHdyayk7XG5cdFx0XHR9O1xuXHRcdFx0d3JrLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR3cmsudGVybWluYXRlKCk7XG5cdFx0XHRcdGRvbmUoZSwgbnVsbCk7XG5cdFx0XHR9XG5cdFx0XHR3cmsucG9zdE1lc3NhZ2UoZGF0YSk7XG5cdFx0fSBlbHNlIGlmICh0aGF0Lm9wdGlvbnMuc3luY2hyb25vdXMpIHtcblx0XHRcdHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVt0aGF0LmRhdGEubGVuZ3RoXSA9IGNiKGRhdGEpO1xuXHRcdFx0XHRkb25lKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXb3JrZXJzIGRvIG5vdCBleGlzdCBhbmQgc3luY2hyb25vdXMgb3BlcmF0aW9uIG5vdCBhbGxvd2VkIScpO1xuXHRcdH1cblx0fTtcblxuXHRQYXJhbGxlbC5wcm90b3R5cGUucmVkdWNlID0gZnVuY3Rpb24gKGNiLCBlbnYpIHtcblx0XHRlbnYgPSBleHRlbmQodGhpcy5vcHRpb25zLmVudiwgZW52IHx8IHt9KTtcblxuXHRcdGlmICghdGhpcy5kYXRhLmxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IHJlZHVjZSBub24tYXJyYXkgZGF0YScpO1xuXHRcdH1cblxuXHRcdHZhciBydW5uaW5nV29ya2VycyA9IDA7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdGZ1bmN0aW9uIGRvbmUoZXJyLCB3cmspIHtcblx0XHRcdC0tcnVubmluZ1dvcmtlcnM7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUoZXJyLCBudWxsKTtcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5kYXRhLmxlbmd0aCA9PT0gMSAmJiBydW5uaW5nV29ya2VycyA9PT0gMCkge1xuXHRcdFx0XHR0aGF0LmRhdGEgPSB0aGF0LmRhdGFbMF07XG5cdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhKTtcblx0XHRcdFx0aWYgKHdyaykgd3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGF0LmRhdGEubGVuZ3RoID4gMSkge1xuXHRcdFx0XHQrK3J1bm5pbmdXb3JrZXJzO1xuXHRcdFx0XHR0aGF0Ll9zcGF3blJlZHVjZVdvcmtlcihbdGhhdC5kYXRhWzBdLCB0aGF0LmRhdGFbMV1dLCBjYiwgZG9uZSwgZW52LCB3cmspO1xuXHRcdFx0XHR0aGF0LmRhdGEuc3BsaWNlKDAsIDIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHdyaykgd3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBuZXdPcCA9IG5ldyBPcGVyYXRpb24oKTtcblx0XHR0aGlzLm9wZXJhdGlvbi50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0aGF0LmRhdGEubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhWzBdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhhdC5vcHRpb25zLm1heFdvcmtlcnMgJiYgaSA8IE1hdGguZmxvb3IodGhhdC5kYXRhLmxlbmd0aCAvIDIpIDsgKytpKSB7XG5cdFx0XHRcdFx0KytydW5uaW5nV29ya2Vycztcblx0XHRcdFx0XHR0aGF0Ll9zcGF3blJlZHVjZVdvcmtlcihbdGhhdC5kYXRhW2kgKiAyXSwgdGhhdC5kYXRhW2kgKiAyICsgMV1dLCBjYiwgZG9uZSwgZW52KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoYXQuZGF0YS5zcGxpY2UoMCwgaSAqIDIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub3BlcmF0aW9uID0gbmV3T3A7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0UGFyYWxsZWwucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAoY2IsIGVyckNiKSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHZhciBuZXdPcCA9IG5ldyBPcGVyYXRpb24oKTtcblx0XHRlcnJDYiA9IHR5cGVvZiBlcnJDYiA9PT0gJ2Z1bmN0aW9uJyA/IGVyckNiIDogZnVuY3Rpb24oKXt9O1xuXG5cdFx0dGhpcy5vcGVyYXRpb24udGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgcmV0RGF0YTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKGNiKSB7XG5cdFx0XHRcdFx0cmV0RGF0YSA9IGNiKHRoYXQuZGF0YSk7XG5cdFx0XHRcdFx0aWYgKHJldERhdGEgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhID0gcmV0RGF0YTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCB0aGF0LmRhdGEpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRpZiAoZXJyQ2IpIHtcblx0XHRcdFx0XHRyZXREYXRhID0gZXJyQ2IoZSk7XG5cdFx0XHRcdFx0aWYgKHJldERhdGEgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhID0gcmV0RGF0YTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRuZXdPcC5yZXNvbHZlKG51bGwsIHRoYXQuZGF0YSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGlmIChlcnJDYikge1xuXHRcdFx0XHR2YXIgcmV0RGF0YSA9IGVyckNiKGVycik7XG5cdFx0XHRcdGlmIChyZXREYXRhICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR0aGF0LmRhdGEgPSByZXREYXRhO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCB0aGF0LmRhdGEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCBlcnIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub3BlcmF0aW9uID0gbmV3T3A7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0aWYgKGlzQ29tbW9uSlMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFBhcmFsbGVsO1xuXHR9IGVsc2Uge1xuXHRcdHNlbGYuUGFyYWxsZWwgPSBQYXJhbGxlbDtcblx0fVxufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9wYXJhbGxlbGpzL2xpYi9wYXJhbGxlbC5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBQYXJhbGxlbCA9IHJlcXVpcmUoXCJwYXJhbGxlbGpzXCIpO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb29yZGluYXRlIHtcbiAgICByZWFkb25seSB4OiBudW1iZXI7XG4gICAgcmVhZG9ubHkgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElLbmlnaHRUb3VyRW52aXJvbm1lbnQge1xuICAgIGJvYXJkU2l6ZTogbnVtYmVyO1xuICAgIGJvYXJkOiBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtuaWdodFRvdXJzKHN0YXJ0UGF0aDogSUNvb3JkaW5hdGVbXSwgYm9hcmRTaXplOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IG1vdmVzID0gW1xuICAgICAgICB7IHg6IC0yLCB5OiAtMSB9LCB7IHg6IC0yLCB5OiAxfSwgeyB4OiAtMSwgeTogLTIgfSwgeyB4OiAtMSwgeTogMiB9LFxuICAgICAgICB7IHg6IDEsIHk6IC0yIH0sIHsgeDogMSwgeTogMn0sIHsgeDogMiwgeTogLTEgfSwgeyB4OiAyLCB5OiAxIH1cbiAgICBdO1xuXG4gICAgY29uc3QgYm9hcmQ6IG51bWJlcltdID0gbmV3IEFycmF5KGJvYXJkU2l6ZSAqIGJvYXJkU2l6ZSk7XG4gICAgYm9hcmQuZmlsbCgwKTtcblxuICAgIGNvbnN0IG51bWJlck9mRmllbGRzID0gYm9hcmRTaXplICogYm9hcmRTaXplO1xuICAgIGxldCByZXN1bHRzOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiB7IGNvb3JkaW5hdGU6IElDb29yZGluYXRlLCBuOiBudW1iZXIgfVtdID0gc3RhcnRQYXRoLm1hcCgocG9zLCBpbmRleCkgPT4gKHsgY29vcmRpbmF0ZTogcG9zLCBuOiBpbmRleCArIDEgfSkpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0UGF0aC5sZW5ndGggLSAxOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBzdGFydFBhdGhbaW5kZXhdLnggKiBib2FyZFNpemUgKyBzdGFydFBhdGhbaW5kZXhdLnk7XG4gICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZSwgbiB9ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBjb29yZGluYXRlLnggKiBib2FyZFNpemUgKyBjb29yZGluYXRlLnk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2ZpZWxkSW5kZXhdICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBiYWNrIHRyYWNraW5nXG4gICAgICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IDA7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW50cnlcbiAgICAgICAgaWYgKG4gPT09IG51bWJlck9mRmllbGRzKSB7XG4gICAgICAgICAgICArK3Jlc3VsdHM7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBuITtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gbW92ZXNbaV07XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3IgPSB7IHg6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55IH07XG4gICAgICAgICAgICAvLyBub3Qgb3V0c2lkZSBvZiBib2FyZCBhbmQgbm90IHlldCBhY2Nlc3NlZFxuICAgICAgICAgICAgY29uc3QgYWNjZXNzaWJsZSA9IHN1Y2Nlc3Nvci54ID49IDAgJiYgc3VjY2Vzc29yLnkgPj0gMCAmJiBzdWNjZXNzb3IueCA8IGJvYXJkU2l6ZSAmJiAgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiYgYm9hcmRbc3VjY2Vzc29yLnggKiBib2FyZFNpemUgKyBzdWNjZXNzb3IueV0gPT09IDA7XG5cbiAgICAgICAgICAgIGlmIChhY2Nlc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh7IGNvb3JkaW5hdGU6IHN1Y2Nlc3NvciwgbjogbiArIDEgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuZGVjbGFyZSBjb25zdCBnbG9iYWw6IHsgZW52OiB7IGJvYXJkU2l6ZTogbnVtYmVyIH19O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxKU0tuaWdodFRvdXJzKHN0YXJ0OiBJQ29vcmRpbmF0ZSwgYm9hcmRTaXplOiBudW1iZXIpOiBQcm9taXNlTGlrZTxudW1iZXI+IHtcblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3NvcnMoY29vcmRpbmF0ZTogSUNvb3JkaW5hdGUpIHtcbiAgICAgICAgY29uc3QgbW92ZXMgPSBbXG4gICAgICAgICAgICB7eDogLTIsIHk6IC0xfSwge3g6IC0yLCB5OiAxfSwge3g6IC0xLCB5OiAtMn0sIHt4OiAtMSwgeTogMn0sXG4gICAgICAgICAgICB7eDogMSwgeTogLTJ9LCB7eDogMSwgeTogMn0sIHt4OiAyLCB5OiAtMX0sIHt4OiAyLCB5OiAxfVxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXN1bHQ6IElDb29yZGluYXRlW10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gbW92ZXNbaV07XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3IgPSB7eDogY29vcmRpbmF0ZS54ICsgbW92ZS54LCB5OiBjb29yZGluYXRlLnkgKyBtb3ZlLnl9O1xuICAgICAgICAgICAgY29uc3QgYWNjZXNzaWJsZSA9IHN1Y2Nlc3Nvci54ID49IDAgJiYgc3VjY2Vzc29yLnkgPj0gMCAmJiBzdWNjZXNzb3IueCA8IGJvYXJkU2l6ZSAmJiBzdWNjZXNzb3IueSA8IGJvYXJkU2l6ZSAmJlxuICAgICAgICAgICAgICAgIChzdWNjZXNzb3IueCAhPT0gc3RhcnQueCB8fCBzdWNjZXNzb3IueSAhPT0gc3RhcnQueSkgJiYgKHN1Y2Nlc3Nvci54ICE9PSBjb29yZGluYXRlLnggJiYgc3VjY2Vzc29yLnkgIT09IGNvb3JkaW5hdGUueSk7XG4gICAgICAgICAgICBpZiAoYWNjZXNzaWJsZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHN1Y2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVTdGFydEZpZWxkcygpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJQ29vcmRpbmF0ZVtdW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBkaXJlY3RTdWNjZXNzb3Igb2Ygc3VjY2Vzc29ycyhzdGFydCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaW5kaXJlY3RTdWNjZXNzb3Igb2Ygc3VjY2Vzc29ycyhkaXJlY3RTdWNjZXNzb3IpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goW3N0YXJ0LCBkaXJlY3RTdWNjZXNzb3IsIGluZGlyZWN0U3VjY2Vzc29yXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhcmFsbGVsKGNvbXB1dGVTdGFydEZpZWxkcygpLCB7IGVudjogeyBib2FyZFNpemUgfX0pXG4gICAgICAgIC5yZXF1aXJlKGtuaWdodFRvdXJzKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChzdGFydEZpZWxkOiBJQ29vcmRpbmF0ZVtdKSB7XG4gICAgICAgICAgICByZXR1cm4ga25pZ2h0VG91cnMoc3RhcnRGaWVsZCwgZ2xvYmFsLmVudi5ib2FyZFNpemUpO1xuICAgICAgICB9KVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uICh0b3Vyc1BlclJ1bjogbnVtYmVyW10pIHtcbiAgICAgICAgICAgIHJldHVybiB0b3Vyc1BlclJ1bi5yZWR1Y2UoKG1lbW8sIGN1cnJlbnQpID0+IG1lbW8gKyBjdXJyZW50LCAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBUaGUgcmVkdWNlIG9wZXJhdGlvbiBuZWVkcyB0byB3YWl0IHVudGlsIHRoZSBtYXAgb3BlcmF0aW9uIGlzIGNvbXBsZXRlLCBzd2l0Y2hlcyBiYWNrIHRvIHRoZSBtYWluIHRocmVhZCBhbmQgdGhlblxuICAgIC8vIGEgbmV3IHdvcmtlciBpcyBzcGF3bmVkIGZvciBlYWNoIHJlZHVjZSBzdGVwLCBlLmcuIGZvciBbMSwgMiwgMywgNCwgNSwgNl0gdGhlIHRocmVlIHdvcmtlcnMgd2l0aCBbMSwgMl0sIFszLCA0XSwgWzUsIDZdXG4gICAgLy8gdGhlbiB0aGUgc3ViIHNlcXVlbnQgd29ya2VycyBbMywgN10gYW5kIGZpbmFsbHksIFsxMCwgMTFdIGFyZSBzcGF3bmVkLi4uXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFyYWxsZWxqcy9rbmlnaHRzLXRvdXIudHMiLCJjb25zdCBQYXJhbGxlbCA9IHJlcXVpcmUoXCJwYXJhbGxlbGpzXCIpO1xuaW1wb3J0ICogYXMgXyBmcm9tIFwibG9kYXNoXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbXBsZXhOdW1iZXIge1xuICAgIGk6IG51bWJlcjtcbiAgICByZWFsOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1hbmRlbGJyb3RPcHRpb25zIHtcbiAgICBpbWFnZUhlaWdodDogbnVtYmVyO1xuICAgIGltYWdlV2lkdGg6IG51bWJlcjtcbiAgICBpdGVyYXRpb25zOiBudW1iZXI7XG4gICAgbWF4OiBJQ29tcGxleE51bWJlcjtcbiAgICBtaW46IElDb21wbGV4TnVtYmVyO1xuICAgIHNjYWxpbmdGYWN0b3I6IElDb21wbGV4TnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZU1hbmRlbGJyb3RMaW5lKHk6IG51bWJlciwgb3B0aW9uczogSU1hbmRlbGJyb3RPcHRpb25zKTogVWludDhDbGFtcGVkQXJyYXkge1xuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVooYzogSUNvbXBsZXhOdW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB6ID0geyBpOiBjLmksIHJlYWw6IGMucmVhbCB9O1xuICAgICAgICBsZXQgbiA9IDA7XG5cbiAgICAgICAgZm9yICg7IG4gPCBvcHRpb25zLml0ZXJhdGlvbnM7ICsrbikge1xuICAgICAgICAgICAgaWYgKHoucmVhbCAqKiAyICsgei5pICoqIDIgPiA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHogKiogMiArIGNcbiAgICAgICAgICAgIGNvbnN0IHpJID0gei5pO1xuICAgICAgICAgICAgei5pID0gMiAqIHoucmVhbCAqIHouaSArIGMuaTtcbiAgICAgICAgICAgIHoucmVhbCA9IHoucmVhbCAqKiAyIC0gekkgKiogMiArIGMucmVhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmUgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkob3B0aW9ucy5pbWFnZVdpZHRoICogNCk7XG4gICAgY29uc3QgY0kgPSBvcHRpb25zLm1heC5pIC0geSAqIG9wdGlvbnMuc2NhbGluZ0ZhY3Rvci5pO1xuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBvcHRpb25zLmltYWdlV2lkdGg7ICsreCkge1xuICAgICAgICBjb25zdCBjID0ge1xuICAgICAgICAgICAgaTogY0ksXG4gICAgICAgICAgICByZWFsOiBvcHRpb25zLm1pbi5yZWFsICsgeCAqIG9wdGlvbnMuc2NhbGluZ0ZhY3Rvci5yZWFsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgbiA9IGNhbGN1bGF0ZVooYyk7XG4gICAgICAgIGNvbnN0IGJhc2UgPSB4ICogNDtcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xuICAgICAgICBsaW5lW2Jhc2VdID0gbiAmIDB4RkY7XG4gICAgICAgIGxpbmVbYmFzZSArIDFdID0gbiAmIDB4RkYwMDtcbiAgICAgICAgbGluZVtiYXNlICsgMl0gPSBuICYgMHhGRjAwMDA7XG4gICAgICAgIGxpbmVbYmFzZSArIDNdID0gMjU1O1xuICAgIH1cbiAgICByZXR1cm4gbGluZTtcbn1cblxuZGVjbGFyZSBjb25zdCBnbG9iYWw6IHsgZW52OiBJTWFuZGVsYnJvdE9wdGlvbnN9O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxKU01hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnM6IElNYW5kZWxicm90T3B0aW9ucykge1xuICAgIGNvbnN0IGxpbmVzID0gXy5yYW5nZShtYW5kZWxicm90T3B0aW9ucy5pbWFnZUhlaWdodCk7XG4gICAgcmV0dXJuIG5ldyBQYXJhbGxlbChsaW5lcywgeyBlbnY6IG1hbmRlbGJyb3RPcHRpb25zIH0pLnJlcXVpcmUoY29tcHV0ZU1hbmRlbGJyb3RMaW5lKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChsaW5lOiBudW1iZXIpOiBVaW50OENsYW1wZWRBcnJheSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZU1hbmRlbGJyb3RMaW5lKGxpbmUsIGdsb2JhbC5lbnYpO1xuICAgICAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYXJhbGxlbGpzL21hbmRlbGJyb3QudHMiLCJjb25zdCBQYXJhbGxlbCA9IHJlcXVpcmUoXCJwYXJhbGxlbGpzXCIpO1xuaW1wb3J0IHtEaWN0aW9uYXJ5fSBmcm9tIFwibG9kYXNoXCI7XG5cblxuLyogdHNsaW50OmRpc2FibGU6bm8tdmFyLXJlcXVpcmVzICovXG4vLyBkZWNsYXJlIGZ1bmN0aW9uIHJlcXVpcmUobmFtZTogc3RyaW5nKTogYW55O1xuLy8gY29uc3QgUmFuZG9tID0gcmVxdWlyZShcInNpbWpzLXJhbmRvbVwiKTtcbi8vIGNvbnN0IHJhbmRvbSA9IG5ldyBSYW5kb20oMTApO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0IHtcbiAgICBzdGFydFllYXI6IG51bWJlcjtcbiAgICB0b3RhbEFtb3VudDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUJ1Y2tldCB7XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG5cbiAgICBzdWJCdWNrZXRzOiB7IFtncm91cE5hbWU6IHN0cmluZ106IHsgZ3JvdXA6IHN0cmluZzsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyIH0gfTtcbn1cblxuaW50ZXJmYWNlIElHcm91cCB7XG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBuYW1lIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGdyb3VwXG4gICAgICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBhIHNlcGFyYXRvciBsaW5lIGJlZW4gZHJhd24gZm9yIHRoaXMgZ3JvdXA/XG4gICAgICovXG4gICAgc2VwYXJhdG9yOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIHBlcmNlbnRhZ2Ugb2YgdmFsdWVzIGluIHRoaXMgZ3JvdXAgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBzaW11bGF0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgcGVyY2VudGFnZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1pbmltdW0gdmFsdWUgdGhhdCBpcyBzdGlsbCBwYXJ0IG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBmcm9tPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBtYXhpbXVtIHZhbHVlIChleGNsdXNpdmUpIHRoYXQgZGVmaW5lcyB0aGUgdXBwZXIgZW5kIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICB0bz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUHJvamVjdFJlc3VsdCB7XG4gICAgLyoqXG4gICAgICogVGhlIG1pbmltYWwgc2ltdWxhdGVkIHZhbHVlIGZvciB0aGlzIHByb2plY3RcbiAgICAgKi9cbiAgICBtaW46IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW1hbCBzaW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBtYXg6IG51bWJlcjtcblxuICAgIC8qKiBUaGUgbWVkaWFuIG9mIHRoZSB2YWx1ZXMgZm91bmQgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1lZGlhbjogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB3aGVyZSB0aGUgMi8zIG9mIHRoZSBzaW11bGF0ZWQgdmFsdWVzIHN0YXJ0IC8gZW5kLlxuICAgICAqL1xuICAgIHR3b1RoaXJkOiB7XG4gICAgICAgIG1pbjogbnVtYmVyO1xuICAgICAgICBtYXg6IG51bWJlcjtcbiAgICB9O1xuXG4gICAgYnVja2V0czogSUJ1Y2tldFtdO1xuXG4gICAgZ3JvdXBzOiBJR3JvdXBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9qZWN0XG4gICAgICovXG4gICAgcHJvamVjdDogSVByb2plY3Q7XG59XG5cbmludGVyZmFjZSBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT47XG4gICAgc2ltdWxhdGVkVmFsdWVzOiBudW1iZXJbXVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzPzogbnVtYmVyO1xuICAgIG51bVJ1bnM/OiBudW1iZXI7XG4gICAgcHJvamVjdHM/OiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ/OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U/OiBudW1iZXI7XG4gICAgc2VlZD86IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5PzogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBwcm9qZWN0czogSVByb2plY3RbXTtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U6IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHRhc2tJbmRleD86IG51bWJlcjtcbiAgICB2YWx1ZXNQZXJXb3JrZXI/OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgdm9sYXRpbGl0eTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogMTAwMDAwMCxcbiAgICAgICAgbGlxdWlkaXR5OiAxMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAsXG4gICAgICAgIG51bVllYXJzOiAxMCxcbiAgICAgICAgcGVyZm9ybWFuY2U6IDAsXG4gICAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgICAgc2VlZDogdW5kZWZpbmVkLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjAxXG4gICAgfSwgb3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChvcHRpb25zOiBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpOiBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBjb25zdCByYW5kb20gPSBuZXcgKHNlbGYgYXMgYW55KS5SYW5kb20oKTtcblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBtb250ZSBjYXJsbyBzaW11bGF0aW9uIGZvciBhbGwgeWVhcnMgYW5kIG51bSBydW5zLlxuICAgICAqIEBwYXJhbSBjYXNoRmxvd3MgdGhlIGNhc2ggZmxvd3NcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW11bXX0gdGhlIHNpbXVsYXRlZCBvdXRjb21lcyBncm91cGVkIGJ5IHllYXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93czogbnVtYmVyW10sIG51bVllYXJzOiBudW1iZXIpOiBudW1iZXJbXVtdICB7XG4gICAgICAgIGZ1bmN0aW9uIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXM6IG51bWJlcltdKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50O1xuICAgICAgICAgICAgbGV0IHByZXZpb3VzWWVhckluZGV4ID0gMTAwO1xuXG4gICAgICAgICAgICBmb3IgKGxldCByZWxhdGl2ZVllYXIgPSAwOyByZWxhdGl2ZVllYXIgPCBpbmRpY2VzLmxlbmd0aDsgKytyZWxhdGl2ZVllYXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhckluZGV4ID0gaW5kaWNlc1tyZWxhdGl2ZVllYXJdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhc2hGbG93U3RhcnRPZlllYXIgPSByZWxhdGl2ZVllYXIgPT09IDAgPyAwIDogY2FzaEZsb3dzW3JlbGF0aXZlWWVhciAtIDFdO1xuXG4gICAgICAgICAgICAgICAgLy8gc2NhbGUgY3VycmVudCB2YWx1ZSB3aXRoIHBlcmZvcm1hbmNlIGdhaW4gYWNjb3JkaW5nIHRvIGluZGV4XG4gICAgICAgICAgICAgICAgY29uc3QgcGVyZm9ybWFuY2UgPSBjdXJyZW50WWVhckluZGV4IC8gcHJldmlvdXNZZWFySW5kZXg7XG4gICAgICAgICAgICAgICAgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gKGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSArIGNhc2hGbG93U3RhcnRPZlllYXIpICogcGVyZm9ybWFuY2U7XG5cbiAgICAgICAgICAgICAgICBpbmRpY2VzW3JlbGF0aXZlWWVhcl0gPSAgMSArIHJhbmRvbS5ub3JtYWwocGVyZm9ybWFuY2UsIG9wdGlvbnMudm9sYXRpbGl0eSk7XG5cbiAgICAgICAgICAgICAgICBwcmV2aW91c1llYXJJbmRleCA9IGN1cnJlbnRZZWFySW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpbmRpY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG9wdGlvbnMubnVtWWVhcnMpO1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8PSBudW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICByZXN1bHRbeWVhcl0gPSBuZXcgQXJyYXkob3B0aW9ucy5udW1SdW5zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHJ1biA9IDA7IHJ1biA8IG9wdGlvbnMubnVtUnVuczsgcnVuKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSBbMTAwXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbnVtWWVhcnM7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHJhbmRvbVBlcmZvcm1hbmNlID0gMSArIHJhbmRvbS5ub3JtYWwob3B0aW9ucy5wZXJmb3JtYW5jZSwgb3B0aW9ucy52b2xhdGlsaXR5KTtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21QZXJmb3JtYW5jZSA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChpbmRpY2VzW2kgLSAxXSAqIHJhbmRvbVBlcmZvcm1hbmNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29udmVydCB0aGUgcmVsYXRpdmUgdmFsdWVzIGZyb20gYWJvdmUgdG8gYWJzb2x1dGUgdmFsdWVzLlxuICAgICAgICAgICAgdG9BYnNvbHV0ZUluZGljZXMoaW5kaWNlcyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsreWVhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdFt5ZWFyXVtydW5dID0gaW5kaWNlc1t5ZWFyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvamVjdHNUb0Nhc2hGbG93cygpIHtcbiAgICAgICAgY29uc3QgY2FzaEZsb3dzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IG9wdGlvbnMubnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdHNCeVRoaXNZZWFyID0gcHJvamVjdHNCeVN0YXJ0WWVhclt5ZWFyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IGNhc2hGbG93ID0gLXByb2plY3RzQnlUaGlzWWVhci5yZWR1Y2UoKG1lbW8sIHByb2plY3QpID0+IG1lbW8gKyBwcm9qZWN0LnRvdGFsQW1vdW50LCAwKTtcbiAgICAgICAgICAgIGNhc2hGbG93cy5wdXNoKGNhc2hGbG93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FzaEZsb3dzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lKGNhc2hGbG93czogbnVtYmVyW10pIHtcbiAgICAgICAgY29uc3Qgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdID0gW107XG5cbiAgICAgICAgbGV0IGludmVzdG1lbnRBbW91bnRMZWZ0ID0gb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50O1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IG9wdGlvbnMubnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgaW52ZXN0bWVudEFtb3VudExlZnQgPSBpbnZlc3RtZW50QW1vdW50TGVmdCArIGNhc2hGbG93c1t5ZWFyXTtcbiAgICAgICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLnB1c2goaW52ZXN0bWVudEFtb3VudExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub0ludGVyZXN0UmVmZXJlbmNlTGluZTtcbiAgICB9XG5cbiAgICBsZXQgcHJvamVjdHNUb1NpbXVsYXRlOiBJUHJvamVjdFtdID0gb3B0aW9ucy5wcm9qZWN0cztcblxuICAgIGlmIChvcHRpb25zLnRhc2tJbmRleCAmJiBvcHRpb25zLnZhbHVlc1Blcldvcmtlcikge1xuICAgICAgICBwcm9qZWN0c1RvU2ltdWxhdGUgPSBvcHRpb25zLnByb2plY3RzLnNsaWNlKG9wdGlvbnMudGFza0luZGV4ICogb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIsIChvcHRpb25zLnRhc2tJbmRleCArIDEpICogb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb2plY3RzID0gb3B0aW9ucy5wcm9qZWN0cy5zb3J0KChhLCBiKSA9PiBhLnN0YXJ0WWVhciAtIGIuc3RhcnRZZWFyKTtcblxuICAgIC8vIEdyb3VwIHByb2plY3RzIGJ5IHN0YXJ0WWVhciwgdXNlIGxvZGFzaCBncm91cEJ5IGluc3RlYWRcbiAgICBjb25zdCBwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9qZWN0IG9mIHByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdID0gcHJvamVjdHNCeVN0YXJ0WWVhcltwcm9qZWN0LnN0YXJ0WWVhcl0gfHwgW107XG4gICAgICAgIGFyci5wdXNoKHByb2plY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhc2hGbG93cyA9IHByb2plY3RzVG9DYXNoRmxvd3MoKTtcbiAgICBjb25zdCBub0ludGVyZXN0UmVmZXJlbmNlTGluZSA9IGNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lKGNhc2hGbG93cyk7XG5cbiAgICBjb25zdCBudW1ZZWFycyA9IHByb2plY3RzVG9TaW11bGF0ZS5yZWR1Y2UoKG1lbW8sIHByb2plY3QpID0+IE1hdGgubWF4KG1lbW8sIHByb2plY3Quc3RhcnRZZWFyKSwgMCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbnZlc3RtZW50QW1vdW50OiBvcHRpb25zLmludmVzdG1lbnRBbW91bnQsXG4gICAgICAgIGxpcXVpZGl0eTogb3B0aW9ucy5saXF1aWRpdHksXG4gICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLFxuICAgICAgICBudW1SdW5zOiBvcHRpb25zLm51bVJ1bnMsXG4gICAgICAgIG51bVllYXJzLFxuICAgICAgICBwcm9qZWN0c0J5U3RhcnRZZWFyLFxuICAgICAgICBzaW11bGF0ZWRWYWx1ZXM6IHNpbXVsYXRlT3V0Y29tZXMoY2FzaEZsb3dzLCBudW1ZZWFycylcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVQcm9qZWN0KHByb2plY3Q6IElQcm9qZWN0LCBlbnZpcm9ubWVudDogSU1vbnRlQ2FybG9FbnZpcm9ubWVudCk6IElQcm9qZWN0UmVzdWx0IHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfQlVDS0VUUyA9IDEwO1xuICAgIGZ1bmN0aW9uIGdyb3VwRm9yVmFsdWUodmFsdWU6IG51bWJlciwgZ3JvdXBzOiBJR3JvdXBbXSk6IElHcm91cCB7XG4gICAgICAgIHJldHVybiBncm91cHMuZmluZChncm91cCA9PiAodHlwZW9mIGdyb3VwLmZyb20gPT09IFwidW5kZWZpbmVkXCIgfHwgZ3JvdXAuZnJvbSA8PSB2YWx1ZSkgJiYgKHR5cGVvZiBncm91cC50byA9PT0gXCJ1bmRlZmluZWRcIiB8fCBncm91cC50byA+IHZhbHVlKSkhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUdyb3VwcyhyZXF1aXJlZEFtb3VudDogbnVtYmVyLCBub0ludGVyZXN0UmVmZXJlbmNlOiBudW1iZXIpOiBJR3JvdXBbXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIlppZWwgZXJyZWljaGJhclwiLCBmcm9tOiByZXF1aXJlZEFtb3VudCwgbmFtZTogXCJncmVlblwiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IHRydWV9LFxuICAgICAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJtaXQgWnVzYXR6bGlxdWlkaXTDpHQgZXJyZWljaGJhclwiLCBmcm9tOiByZXF1aXJlZEFtb3VudCAtIGVudmlyb25tZW50LmxpcXVpZGl0eSwgbmFtZTogXCJ5ZWxsb3dcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiB0cnVlLCB0bzogcmVxdWlyZWRBbW91bnQgfSxcbiAgICAgICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhclwiLCBmcm9tOiBub0ludGVyZXN0UmVmZXJlbmNlLCBuYW1lOiBcImdyYXlcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IHJlcXVpcmVkQW1vdW50IC0gZW52aXJvbm1lbnQubGlxdWlkaXR5IH0sXG4gICAgICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIm5pY2h0IGVycmVpY2hiYXIsIG1pdCBWZXJsdXN0XCIsIG5hbWU6IFwicmVkXCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogZmFsc2UsIHRvOiBub0ludGVyZXN0UmVmZXJlbmNlIH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVSZXF1aXJlZEFtb3VudCgpIHtcbiAgICAgICAgbGV0IGFtb3VudCA9IHByb2plY3QudG90YWxBbW91bnQ7XG4gICAgICAgIGNvbnN0IHByb2plY3RzU2FtZVllYXIgPSBlbnZpcm9ubWVudC5wcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXTtcblxuICAgICAgICBmb3IgKGNvbnN0IG90aGVyUHJvamVjdCBvZiBwcm9qZWN0c1NhbWVZZWFyKSB7XG4gICAgICAgICAgICBpZiAob3RoZXJQcm9qZWN0ID09PSBwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbW91bnQgKz0gb3RoZXJQcm9qZWN0LnRvdGFsQW1vdW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbW91bnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVkaWFuKHZhbHVlczogbnVtYmVyW10pIHtcbiAgICAgICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3IodmFsdWVzLmxlbmd0aCAvIDIpO1xuXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoICUgMikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1toYWxmXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodmFsdWVzW2hhbGYgLSAxXSArIHZhbHVlc1toYWxmXSkgLyAyLjA7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWlyZWRBbW91bnQgPSBjYWxjdWxhdGVSZXF1aXJlZEFtb3VudCgpO1xuICAgIGNvbnN0IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyID0gZW52aXJvbm1lbnQuc2ltdWxhdGVkVmFsdWVzW3Byb2plY3Quc3RhcnRZZWFyXTtcbiAgICBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBncm91cHMgPSBjcmVhdGVHcm91cHMocmVxdWlyZWRBbW91bnQsIGVudmlyb25tZW50Lm5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lW3Byb2plY3Quc3RhcnRZZWFyXSk7XG4gICAgY29uc3QgdmFsdWVzQnlHcm91cDogeyBbZ3JvdXBOYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuICAgIGNvbnN0IGJ1Y2tldFNpemUgPSBNYXRoLnJvdW5kKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAvIE5VTUJFUl9PRl9CVUNLRVRTKTtcbiAgICBjb25zdCBidWNrZXRzOiBJQnVja2V0W10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoOyBpICs9IGJ1Y2tldFNpemUpIHtcbiAgICAgICAgY29uc3QgYnVja2V0OiBJQnVja2V0ID0ge1xuICAgICAgICAgICAgbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLFxuICAgICAgICAgICAgbWluOiBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgICAgICAgICAgc3ViQnVja2V0czoge31cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBqID0gaTsgaiA8IGkgKyBidWNrZXRTaXplOyArK2opIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbal07XG4gICAgICAgICAgICBidWNrZXQubWluID0gTWF0aC5taW4oYnVja2V0Lm1pbiwgdmFsdWUpO1xuICAgICAgICAgICAgYnVja2V0Lm1heCA9IE1hdGgubWF4KGJ1Y2tldC5tYXgsIHZhbHVlKTtcblxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSBncm91cEZvclZhbHVlKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW2pdLCBncm91cHMpO1xuICAgICAgICAgICAgdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSA9ICh2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdIHx8IDApICsgMTtcbiAgICAgICAgICAgIGNvbnN0IHN1YkJ1Y2tldCA9IGJ1Y2tldC5zdWJCdWNrZXRzW2dyb3VwLm5hbWVdID0gYnVja2V0LnN1YkJ1Y2tldHNbZ3JvdXAubmFtZV0gfHwgeyBncm91cDogZ3JvdXAubmFtZSwgbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLCBtaW46IE51bWJlci5NQVhfVkFMVUUgfTtcbiAgICAgICAgICAgIHN1YkJ1Y2tldC5taW4gPSBNYXRoLm1pbihzdWJCdWNrZXQubWluLCB2YWx1ZSk7XG4gICAgICAgICAgICBzdWJCdWNrZXQubWF4ID0gTWF0aC5tYXgoc3ViQnVja2V0Lm1heCwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnVja2V0cy5wdXNoKGJ1Y2tldCk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9uRW1wdHlHcm91cHMgPSBncm91cHMuZmlsdGVyKGdyb3VwID0+ICEhdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSk7XG4gICAgbm9uRW1wdHlHcm91cHMuZm9yRWFjaChncm91cCA9PiBncm91cC5wZXJjZW50YWdlID0gdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSAvIHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCk7XG5cbiAgICBjb25zdCBvbmVTaXh0aCA9IE1hdGgucm91bmQoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC8gNik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnVja2V0cyxcbiAgICAgICAgZ3JvdXBzOiBub25FbXB0eUdyb3VwcyxcbiAgICAgICAgbWF4OiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLSAxXSxcbiAgICAgICAgbWVkaWFuOiBtZWRpYW4oc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIpLFxuICAgICAgICBtaW46IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyWzBdLFxuICAgICAgICBwcm9qZWN0LFxuICAgICAgICB0d29UaGlyZDoge1xuICAgICAgICAgICAgbWF4OiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLSBvbmVTaXh0aF0sXG4gICAgICAgICAgICBtaW46IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW29uZVNpeHRoXVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZGVjbGFyZSBjb25zdCBnbG9iYWw6IHtvcHRpb25zOiBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnN9O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxKU01vbnRlQ2FybG8odXNlck9wdGlvbnM/OiBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGluaXRpYWxpemVPcHRpb25zKHVzZXJPcHRpb25zKTtcblxuICAgIC8vIEFycmF5IG5lZWRzIHRvIGJlIGNsb25lZCwgb3RoZXJ3aXNlIHRoZSBvcmlnaW5hbCBhcnJheSBpcyBtYW5pcHVsYXRlZCFcbiAgICByZXR1cm4gbmV3IFBhcmFsbGVsKG9wdGlvbnMucHJvamVjdHMuc2xpY2UoKSwge1xuICAgICAgICAgICAgZXZhbFBhdGg6IFwiLi9cIiArIHJlcXVpcmUoXCJmaWxlIXBhcmFsbGVsanMvbGliL2V2YWwuanNcIiksXG4gICAgICAgICAgICBlbnY6IG9wdGlvbnMsXG4gICAgICAgICAgICBlbnZOYW1lc3BhY2U6IFwib3B0aW9uc1wiXG4gICAgICAgIH0pXG4gICAgICAgIC5yZXF1aXJlKFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL212YXJzaG5leS9zaW1qcy1zb3VyY2UvbWFzdGVyL3NyYy9yYW5kb20uanNcIikgLy8gdGhlIG9uZSBmcm9tIG5vZGUgdXNlcyBtb2R1bGUgc3ludGF4XG4gICAgICAgIC5yZXF1aXJlKGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudClcbiAgICAgICAgLnJlcXVpcmUoY2FsY3VsYXRlUHJvamVjdClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAocHJvamVjdDogSVByb2plY3QpOiBJUHJvamVjdFJlc3VsdCB7XG4gICAgICAgICAgICBjb25zdCBlbnYgPSBjcmVhdGVNb250ZUNhcmxvRW52aXJvbm1lbnQoZ2xvYmFsLm9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGN1bGF0ZVByb2plY3QocHJvamVjdCwgZW52KTtcbiAgICAgICAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFyYWxsZWxqcy9tb250ZS1jYXJsby50cyIsIi8qIVxuICogQmVuY2htYXJrLmpzIDxodHRwczovL2JlbmNobWFya2pzLmNvbS8+XG4gKiBDb3B5cmlnaHQgMjAxMC0yMDE2IE1hdGhpYXMgQnluZW5zIDxodHRwczovL210aHMuYmUvPlxuICogQmFzZWQgb24gSlNMaXRtdXMuanMsIGNvcHlyaWdodCBSb2JlcnQgS2llZmZlciA8aHR0cDovL2Jyb29mYS5jb20vPlxuICogTW9kaWZpZWQgYnkgSm9obi1EYXZpZCBEYWx0b24gPGh0dHA6Ly9hbGx5b3VjYW5sZWV0LmNvbS8+XG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbXRocy5iZS9taXQ+XG4gKi9cbjsoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKiogVXNlZCBhcyBhIHNhZmUgcmVmZXJlbmNlIGZvciBgdW5kZWZpbmVkYCBpbiBwcmUgRVM1IGVudmlyb25tZW50cy4gKi9cbiAgdmFyIHVuZGVmaW5lZDtcblxuICAvKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBPYmplY3QuICovXG4gIHZhciBvYmplY3RUeXBlcyA9IHtcbiAgICAnZnVuY3Rpb24nOiB0cnVlLFxuICAgICdvYmplY3QnOiB0cnVlXG4gIH07XG5cbiAgLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciByb290ID0gKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdykgfHwgdGhpcztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGRlZmluZWAuICovXG4gIHZhciBmcmVlRGVmaW5lID0gdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQgJiYgZGVmaW5lO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG4gIHZhciBmcmVlRXhwb3J0cyA9IG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWwpKSB7XG4gICAgcm9vdCA9IGZyZWVHbG9iYWw7XG4gIH1cblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHJlcXVpcmVgLiAqL1xuICB2YXIgZnJlZVJlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSAnZnVuY3Rpb24nICYmIHJlcXVpcmU7XG5cbiAgLyoqIFVzZWQgdG8gYXNzaWduIGVhY2ggYmVuY2htYXJrIGFuIGluY3JlbWVudGVkIGlkLiAqL1xuICB2YXIgY291bnRlciA9IDA7XG5cbiAgLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbiAgdmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHMgJiYgZnJlZUV4cG9ydHM7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0IHByaW1pdGl2ZSB0eXBlcy4gKi9cbiAgdmFyIHJlUHJpbWl0aXZlID0gL14oPzpib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkKSQvO1xuXG4gIC8qKiBVc2VkIHRvIG1ha2UgZXZlcnkgY29tcGlsZWQgdGVzdCB1bmlxdWUuICovXG4gIHZhciB1aWRDb3VudGVyID0gMDtcblxuICAvKiogVXNlZCB0byBhc3NpZ24gZGVmYXVsdCBgY29udGV4dGAgb2JqZWN0IHByb3BlcnRpZXMuICovXG4gIHZhciBjb250ZXh0UHJvcHMgPSBbXG4gICAgJ0FycmF5JywgJ0RhdGUnLCAnRnVuY3Rpb24nLCAnTWF0aCcsICdPYmplY3QnLCAnUmVnRXhwJywgJ1N0cmluZycsICdfJyxcbiAgICAnY2xlYXJUaW1lb3V0JywgJ2Nocm9tZScsICdjaHJvbWl1bScsICdkb2N1bWVudCcsICduYXZpZ2F0b3InLCAncGhhbnRvbScsXG4gICAgJ3BsYXRmb3JtJywgJ3Byb2Nlc3MnLCAncnVudGltZScsICdzZXRUaW1lb3V0J1xuICBdO1xuXG4gIC8qKiBVc2VkIHRvIGF2b2lkIGh6IG9mIEluZmluaXR5LiAqL1xuICB2YXIgZGl2aXNvcnMgPSB7XG4gICAgJzEnOiA0MDk2LFxuICAgICcyJzogNTEyLFxuICAgICczJzogNjQsXG4gICAgJzQnOiA4LFxuICAgICc1JzogMFxuICB9O1xuXG4gIC8qKlxuICAgKiBULURpc3RyaWJ1dGlvbiB0d28tdGFpbGVkIGNyaXRpY2FsIHZhbHVlcyBmb3IgOTUlIGNvbmZpZGVuY2UuXG4gICAqIEZvciBtb3JlIGluZm8gc2VlIGh0dHA6Ly93d3cuaXRsLm5pc3QuZ292L2Rpdjg5OC9oYW5kYm9vay9lZGEvc2VjdGlvbjMvZWRhMzY3Mi5odG0uXG4gICAqL1xuICB2YXIgdFRhYmxlID0ge1xuICAgICcxJzogIDEyLjcwNiwgJzInOiAgNC4zMDMsICczJzogIDMuMTgyLCAnNCc6ICAyLjc3NiwgJzUnOiAgMi41NzEsICc2JzogIDIuNDQ3LFxuICAgICc3JzogIDIuMzY1LCAgJzgnOiAgMi4zMDYsICc5JzogIDIuMjYyLCAnMTAnOiAyLjIyOCwgJzExJzogMi4yMDEsICcxMic6IDIuMTc5LFxuICAgICcxMyc6IDIuMTYsICAgJzE0JzogMi4xNDUsICcxNSc6IDIuMTMxLCAnMTYnOiAyLjEyLCAgJzE3JzogMi4xMSwgICcxOCc6IDIuMTAxLFxuICAgICcxOSc6IDIuMDkzLCAgJzIwJzogMi4wODYsICcyMSc6IDIuMDgsICAnMjInOiAyLjA3NCwgJzIzJzogMi4wNjksICcyNCc6IDIuMDY0LFxuICAgICcyNSc6IDIuMDYsICAgJzI2JzogMi4wNTYsICcyNyc6IDIuMDUyLCAnMjgnOiAyLjA0OCwgJzI5JzogMi4wNDUsICczMCc6IDIuMDQyLFxuICAgICdpbmZpbml0eSc6IDEuOTZcbiAgfTtcblxuICAvKipcbiAgICogQ3JpdGljYWwgTWFubi1XaGl0bmV5IFUtdmFsdWVzIGZvciA5NSUgY29uZmlkZW5jZS5cbiAgICogRm9yIG1vcmUgaW5mbyBzZWUgaHR0cDovL3d3dy5zYWJ1cmNoaWxsLmNvbS9JQmJpb2xvZ3kvc3RhdHMvMDAzLmh0bWwuXG4gICAqL1xuICB2YXIgdVRhYmxlID0ge1xuICAgICc1JzogIFswLCAxLCAyXSxcbiAgICAnNic6ICBbMSwgMiwgMywgNV0sXG4gICAgJzcnOiAgWzEsIDMsIDUsIDYsIDhdLFxuICAgICc4JzogIFsyLCA0LCA2LCA4LCAxMCwgMTNdLFxuICAgICc5JzogIFsyLCA0LCA3LCAxMCwgMTIsIDE1LCAxN10sXG4gICAgJzEwJzogWzMsIDUsIDgsIDExLCAxNCwgMTcsIDIwLCAyM10sXG4gICAgJzExJzogWzMsIDYsIDksIDEzLCAxNiwgMTksIDIzLCAyNiwgMzBdLFxuICAgICcxMic6IFs0LCA3LCAxMSwgMTQsIDE4LCAyMiwgMjYsIDI5LCAzMywgMzddLFxuICAgICcxMyc6IFs0LCA4LCAxMiwgMTYsIDIwLCAyNCwgMjgsIDMzLCAzNywgNDEsIDQ1XSxcbiAgICAnMTQnOiBbNSwgOSwgMTMsIDE3LCAyMiwgMjYsIDMxLCAzNiwgNDAsIDQ1LCA1MCwgNTVdLFxuICAgICcxNSc6IFs1LCAxMCwgMTQsIDE5LCAyNCwgMjksIDM0LCAzOSwgNDQsIDQ5LCA1NCwgNTksIDY0XSxcbiAgICAnMTYnOiBbNiwgMTEsIDE1LCAyMSwgMjYsIDMxLCAzNywgNDIsIDQ3LCA1MywgNTksIDY0LCA3MCwgNzVdLFxuICAgICcxNyc6IFs2LCAxMSwgMTcsIDIyLCAyOCwgMzQsIDM5LCA0NSwgNTEsIDU3LCA2MywgNjcsIDc1LCA4MSwgODddLFxuICAgICcxOCc6IFs3LCAxMiwgMTgsIDI0LCAzMCwgMzYsIDQyLCA0OCwgNTUsIDYxLCA2NywgNzQsIDgwLCA4NiwgOTMsIDk5XSxcbiAgICAnMTknOiBbNywgMTMsIDE5LCAyNSwgMzIsIDM4LCA0NSwgNTIsIDU4LCA2NSwgNzIsIDc4LCA4NSwgOTIsIDk5LCAxMDYsIDExM10sXG4gICAgJzIwJzogWzgsIDE0LCAyMCwgMjcsIDM0LCA0MSwgNDgsIDU1LCA2MiwgNjksIDc2LCA4MywgOTAsIDk4LCAxMDUsIDExMiwgMTE5LCAxMjddLFxuICAgICcyMSc6IFs4LCAxNSwgMjIsIDI5LCAzNiwgNDMsIDUwLCA1OCwgNjUsIDczLCA4MCwgODgsIDk2LCAxMDMsIDExMSwgMTE5LCAxMjYsIDEzNCwgMTQyXSxcbiAgICAnMjInOiBbOSwgMTYsIDIzLCAzMCwgMzgsIDQ1LCA1MywgNjEsIDY5LCA3NywgODUsIDkzLCAxMDEsIDEwOSwgMTE3LCAxMjUsIDEzMywgMTQxLCAxNTAsIDE1OF0sXG4gICAgJzIzJzogWzksIDE3LCAyNCwgMzIsIDQwLCA0OCwgNTYsIDY0LCA3MywgODEsIDg5LCA5OCwgMTA2LCAxMTUsIDEyMywgMTMyLCAxNDAsIDE0OSwgMTU3LCAxNjYsIDE3NV0sXG4gICAgJzI0JzogWzEwLCAxNywgMjUsIDMzLCA0MiwgNTAsIDU5LCA2NywgNzYsIDg1LCA5NCwgMTAyLCAxMTEsIDEyMCwgMTI5LCAxMzgsIDE0NywgMTU2LCAxNjUsIDE3NCwgMTgzLCAxOTJdLFxuICAgICcyNSc6IFsxMCwgMTgsIDI3LCAzNSwgNDQsIDUzLCA2MiwgNzEsIDgwLCA4OSwgOTgsIDEwNywgMTE3LCAxMjYsIDEzNSwgMTQ1LCAxNTQsIDE2MywgMTczLCAxODIsIDE5MiwgMjAxLCAyMTFdLFxuICAgICcyNic6IFsxMSwgMTksIDI4LCAzNywgNDYsIDU1LCA2NCwgNzQsIDgzLCA5MywgMTAyLCAxMTIsIDEyMiwgMTMyLCAxNDEsIDE1MSwgMTYxLCAxNzEsIDE4MSwgMTkxLCAyMDAsIDIxMCwgMjIwLCAyMzBdLFxuICAgICcyNyc6IFsxMSwgMjAsIDI5LCAzOCwgNDgsIDU3LCA2NywgNzcsIDg3LCA5NywgMTA3LCAxMTgsIDEyNSwgMTM4LCAxNDcsIDE1OCwgMTY4LCAxNzgsIDE4OCwgMTk5LCAyMDksIDIxOSwgMjMwLCAyNDAsIDI1MF0sXG4gICAgJzI4JzogWzEyLCAyMSwgMzAsIDQwLCA1MCwgNjAsIDcwLCA4MCwgOTAsIDEwMSwgMTExLCAxMjIsIDEzMiwgMTQzLCAxNTQsIDE2NCwgMTc1LCAxODYsIDE5NiwgMjA3LCAyMTgsIDIyOCwgMjM5LCAyNTAsIDI2MSwgMjcyXSxcbiAgICAnMjknOiBbMTMsIDIyLCAzMiwgNDIsIDUyLCA2MiwgNzMsIDgzLCA5NCwgMTA1LCAxMTYsIDEyNywgMTM4LCAxNDksIDE2MCwgMTcxLCAxODIsIDE5MywgMjA0LCAyMTUsIDIyNiwgMjM4LCAyNDksIDI2MCwgMjcxLCAyODIsIDI5NF0sXG4gICAgJzMwJzogWzEzLCAyMywgMzMsIDQzLCA1NCwgNjUsIDc2LCA4NywgOTgsIDEwOSwgMTIwLCAxMzEsIDE0MywgMTU0LCAxNjYsIDE3NywgMTg5LCAyMDAsIDIxMiwgMjIzLCAyMzUsIDI0NywgMjU4LCAyNzAsIDI4MiwgMjkzLCAzMDUsIDMxN11cbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBCZW5jaG1hcmtgIGZ1bmN0aW9uIHVzaW5nIHRoZSBnaXZlbiBgY29udGV4dGAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0PXJvb3RdIFRoZSBjb250ZXh0IG9iamVjdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGEgbmV3IGBCZW5jaG1hcmtgIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gcnVuSW5Db250ZXh0KGNvbnRleHQpIHtcbiAgICAvLyBFeGl0IGVhcmx5IGlmIHVuYWJsZSB0byBhY3F1aXJlIGxvZGFzaC5cbiAgICB2YXIgXyA9IGNvbnRleHQgJiYgY29udGV4dC5fIHx8IHJlcXVpcmUoJ2xvZGFzaCcpIHx8IHJvb3QuXztcbiAgICBpZiAoIV8pIHtcbiAgICAgIEJlbmNobWFyay5ydW5JbkNvbnRleHQgPSBydW5JbkNvbnRleHQ7XG4gICAgICByZXR1cm4gQmVuY2htYXJrO1xuICAgIH1cbiAgICAvLyBBdm9pZCBpc3N1ZXMgd2l0aCBzb21lIEVTMyBlbnZpcm9ubWVudHMgdGhhdCBhdHRlbXB0IHRvIHVzZSB2YWx1ZXMsIG5hbWVkXG4gICAgLy8gYWZ0ZXIgYnVpbHQtaW4gY29uc3RydWN0b3JzIGxpa2UgYE9iamVjdGAsIGZvciB0aGUgY3JlYXRpb24gb2YgbGl0ZXJhbHMuXG4gICAgLy8gRVM1IGNsZWFycyB0aGlzIHVwIGJ5IHN0YXRpbmcgdGhhdCBsaXRlcmFscyBtdXN0IHVzZSBidWlsdC1pbiBjb25zdHJ1Y3RvcnMuXG4gICAgLy8gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTEuMS41LlxuICAgIGNvbnRleHQgPSBjb250ZXh0ID8gXy5kZWZhdWx0cyhyb290Lk9iamVjdCgpLCBjb250ZXh0LCBfLnBpY2socm9vdCwgY29udGV4dFByb3BzKSkgOiByb290O1xuXG4gICAgLyoqIE5hdGl2ZSBjb25zdHJ1Y3RvciByZWZlcmVuY2VzLiAqL1xuICAgIHZhciBBcnJheSA9IGNvbnRleHQuQXJyYXksXG4gICAgICAgIERhdGUgPSBjb250ZXh0LkRhdGUsXG4gICAgICAgIEZ1bmN0aW9uID0gY29udGV4dC5GdW5jdGlvbixcbiAgICAgICAgTWF0aCA9IGNvbnRleHQuTWF0aCxcbiAgICAgICAgT2JqZWN0ID0gY29udGV4dC5PYmplY3QsXG4gICAgICAgIFJlZ0V4cCA9IGNvbnRleHQuUmVnRXhwLFxuICAgICAgICBTdHJpbmcgPSBjb250ZXh0LlN0cmluZztcblxuICAgIC8qKiBVc2VkIGZvciBgQXJyYXlgIGFuZCBgT2JqZWN0YCBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbiAgICB2YXIgYXJyYXlSZWYgPSBbXSxcbiAgICAgICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gICAgLyoqIE5hdGl2ZSBtZXRob2Qgc2hvcnRjdXRzLiAqL1xuICAgIHZhciBhYnMgPSBNYXRoLmFicyxcbiAgICAgICAgY2xlYXJUaW1lb3V0ID0gY29udGV4dC5jbGVhclRpbWVvdXQsXG4gICAgICAgIGZsb29yID0gTWF0aC5mbG9vcixcbiAgICAgICAgbG9nID0gTWF0aC5sb2csXG4gICAgICAgIG1heCA9IE1hdGgubWF4LFxuICAgICAgICBtaW4gPSBNYXRoLm1pbixcbiAgICAgICAgcG93ID0gTWF0aC5wb3csXG4gICAgICAgIHB1c2ggPSBhcnJheVJlZi5wdXNoLFxuICAgICAgICBzZXRUaW1lb3V0ID0gY29udGV4dC5zZXRUaW1lb3V0LFxuICAgICAgICBzaGlmdCA9IGFycmF5UmVmLnNoaWZ0LFxuICAgICAgICBzbGljZSA9IGFycmF5UmVmLnNsaWNlLFxuICAgICAgICBzcXJ0ID0gTWF0aC5zcXJ0LFxuICAgICAgICB0b1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nLFxuICAgICAgICB1bnNoaWZ0ID0gYXJyYXlSZWYudW5zaGlmdDtcblxuICAgIC8qKiBVc2VkIHRvIGF2b2lkIGluY2x1c2lvbiBpbiBCcm93c2VyaWZpZWQgYnVuZGxlcy4gKi9cbiAgICB2YXIgcmVxID0gcmVxdWlyZTtcblxuICAgIC8qKiBEZXRlY3QgRE9NIGRvY3VtZW50IG9iamVjdC4gKi9cbiAgICB2YXIgZG9jID0gaXNIb3N0VHlwZShjb250ZXh0LCAnZG9jdW1lbnQnKSAmJiBjb250ZXh0LmRvY3VtZW50O1xuXG4gICAgLyoqIFVzZWQgdG8gYWNjZXNzIFdhZGUgU2ltbW9ucycgTm9kZS5qcyBgbWljcm90aW1lYCBtb2R1bGUuICovXG4gICAgdmFyIG1pY3JvdGltZU9iamVjdCA9IHJlcSgnbWljcm90aW1lJyk7XG5cbiAgICAvKiogVXNlZCB0byBhY2Nlc3MgTm9kZS5qcydzIGhpZ2ggcmVzb2x1dGlvbiB0aW1lci4gKi9cbiAgICB2YXIgcHJvY2Vzc09iamVjdCA9IGlzSG9zdFR5cGUoY29udGV4dCwgJ3Byb2Nlc3MnKSAmJiBjb250ZXh0LnByb2Nlc3M7XG5cbiAgICAvKiogVXNlZCB0byBwcmV2ZW50IGEgYHJlbW92ZUNoaWxkYCBtZW1vcnkgbGVhayBpbiBJRSA8IDkuICovXG4gICAgdmFyIHRyYXNoID0gZG9jICYmIGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIC8qKiBVc2VkIHRvIGludGVncml0eSBjaGVjayBjb21waWxlZCB0ZXN0cy4gKi9cbiAgICB2YXIgdWlkID0gJ3VpZCcgKyBfLm5vdygpO1xuXG4gICAgLyoqIFVzZWQgdG8gYXZvaWQgaW5maW5pdGUgcmVjdXJzaW9uIHdoZW4gbWV0aG9kcyBjYWxsIGVhY2ggb3RoZXIuICovXG4gICAgdmFyIGNhbGxlZEJ5ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgdXNlZCB0byBmbGFnIGVudmlyb25tZW50cy9mZWF0dXJlcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgdmFyIHN1cHBvcnQgPSB7fTtcblxuICAgIChmdW5jdGlvbigpIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlY3QgaWYgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5zdXBwb3J0XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgIHN1cHBvcnQuYnJvd3NlciA9IGRvYyAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICduYXZpZ2F0b3InKSAmJiAhaXNIb3N0VHlwZShjb250ZXh0LCAncGhhbnRvbScpO1xuXG4gICAgICAvKipcbiAgICAgICAqIERldGVjdCBpZiB0aGUgVGltZXJzIEFQSSBleGlzdHMuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5zdXBwb3J0XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgIHN1cHBvcnQudGltZW91dCA9IGlzSG9zdFR5cGUoY29udGV4dCwgJ3NldFRpbWVvdXQnKSAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICdjbGVhclRpbWVvdXQnKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlY3QgaWYgZnVuY3Rpb24gZGVjb21waWxhdGlvbiBpcyBzdXBwb3J0LlxuICAgICAgICpcbiAgICAgICAqIEBuYW1lIGRlY29tcGlsYXRpb25cbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuc3VwcG9ydFxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICB0cnkge1xuICAgICAgICAvLyBTYWZhcmkgMi54IHJlbW92ZXMgY29tbWFzIGluIG9iamVjdCBsaXRlcmFscyBmcm9tIGBGdW5jdGlvbiN0b1N0cmluZ2AgcmVzdWx0cy5cbiAgICAgICAgLy8gU2VlIGh0dHA6Ly93ZWJrLml0LzExNjA5IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICAgIC8vIEZpcmVmb3ggMy42IGFuZCBPcGVyYSA5LjI1IHN0cmlwIGdyb3VwaW5nIHBhcmVudGhlc2VzIGZyb20gYEZ1bmN0aW9uI3RvU3RyaW5nYCByZXN1bHRzLlxuICAgICAgICAvLyBTZWUgaHR0cDovL2J1Z3ppbC5sYS81NTk0MzggZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgICAgc3VwcG9ydC5kZWNvbXBpbGF0aW9uID0gRnVuY3Rpb24oXG4gICAgICAgICAgKCdyZXR1cm4gKCcgKyAoZnVuY3Rpb24oeCkgeyByZXR1cm4geyAneCc6ICcnICsgKDEgKyB4KSArICcnLCAneSc6IDAgfTsgfSkgKyAnKScpXG4gICAgICAgICAgLy8gQXZvaWQgaXNzdWVzIHdpdGggY29kZSBhZGRlZCBieSBJc3RhbmJ1bC5cbiAgICAgICAgICAucmVwbGFjZSgvX19jb3ZfX1teO10rOy9nLCAnJylcbiAgICAgICAgKSgpKDApLnggPT09ICcxJztcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBzdXBwb3J0LmRlY29tcGlsYXRpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KCkpO1xuXG4gICAgLyoqXG4gICAgICogVGltZXIgb2JqZWN0IHVzZWQgYnkgYGNsb2NrKClgIGFuZCBgRGVmZXJyZWQjcmVzb2x2ZWAuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciB0aW1lciA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdGltZXIgbmFtZXNwYWNlIG9iamVjdCBvciBjb25zdHJ1Y3Rvci5cbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogQG1lbWJlck9mIHRpbWVyXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258T2JqZWN0fVxuICAgICAgICovXG4gICAgICAnbnMnOiBEYXRlLFxuXG4gICAgICAvKipcbiAgICAgICAqIFN0YXJ0cyB0aGUgZGVmZXJyZWQgdGltZXIuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBtZW1iZXJPZiB0aW1lclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRlZmVycmVkIFRoZSBkZWZlcnJlZCBpbnN0YW5jZS5cbiAgICAgICAqL1xuICAgICAgJ3N0YXJ0JzogbnVsbCwgLy8gTGF6eSBkZWZpbmVkIGluIGBjbG9jaygpYC5cblxuICAgICAgLyoqXG4gICAgICAgKiBTdG9wcyB0aGUgZGVmZXJyZWQgdGltZXIuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBtZW1iZXJPZiB0aW1lclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRlZmVycmVkIFRoZSBkZWZlcnJlZCBpbnN0YW5jZS5cbiAgICAgICAqL1xuICAgICAgJ3N0b3AnOiBudWxsIC8vIExhenkgZGVmaW5lZCBpbiBgY2xvY2soKWAuXG4gICAgfTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBCZW5jaG1hcmsgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBOb3RlOiBUaGUgQmVuY2htYXJrIGNvbnN0cnVjdG9yIGV4cG9zZXMgYSBoYW5kZnVsIG9mIGxvZGFzaCBtZXRob2RzIHRvXG4gICAgICogbWFrZSB3b3JraW5nIHdpdGggYXJyYXlzLCBjb2xsZWN0aW9ucywgYW5kIG9iamVjdHMgZWFzaWVyLiBUaGUgbG9kYXNoXG4gICAgICogbWV0aG9kcyBhcmU6XG4gICAgICogW2BlYWNoL2ZvckVhY2hgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNmb3JFYWNoKSwgW2Bmb3JPd25gXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNmb3JPd24pLFxuICAgICAqIFtgaGFzYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjaGFzKSwgW2BpbmRleE9mYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjaW5kZXhPZiksXG4gICAgICogW2BtYXBgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNtYXApLCBhbmQgW2ByZWR1Y2VgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNyZWR1Y2UpXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgdG8gaWRlbnRpZnkgdGhlIGJlbmNobWFyay5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZm4gVGhlIHRlc3QgdG8gYmVuY2htYXJrLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlICh0aGUgYG5ld2Agb3BlcmF0b3IgaXMgb3B0aW9uYWwpXG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyayhmbik7XG4gICAgICpcbiAgICAgKiAvLyBvciB1c2luZyBhIG5hbWUgZmlyc3RcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKCdmb28nLCBmbik7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKCdmb28nLCBmbiwge1xuICAgICAqXG4gICAgICogICAvLyBkaXNwbGF5ZWQgYnkgYEJlbmNobWFyayN0b1N0cmluZ2AgaWYgYG5hbWVgIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgKiAgICdpZCc6ICd4eXonLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIHN0YXJ0cyBydW5uaW5nXG4gICAgICogICAnb25TdGFydCc6IG9uU3RhcnQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCBhZnRlciBlYWNoIHJ1biBjeWNsZVxuICAgICAqICAgJ29uQ3ljbGUnOiBvbkN5Y2xlLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiBhYm9ydGVkXG4gICAgICogICAnb25BYm9ydCc6IG9uQWJvcnQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIGEgdGVzdCBlcnJvcnNcbiAgICAgKiAgICdvbkVycm9yJzogb25FcnJvcixcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gcmVzZXRcbiAgICAgKiAgICdvblJlc2V0Jzogb25SZXNldCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBjb21wbGV0ZXMgcnVubmluZ1xuICAgICAqICAgJ29uQ29tcGxldGUnOiBvbkNvbXBsZXRlLFxuICAgICAqXG4gICAgICogICAvLyBjb21waWxlZC9jYWxsZWQgYmVmb3JlIHRoZSB0ZXN0IGxvb3BcbiAgICAgKiAgICdzZXR1cCc6IHNldHVwLFxuICAgICAqXG4gICAgICogICAvLyBjb21waWxlZC9jYWxsZWQgYWZ0ZXIgdGhlIHRlc3QgbG9vcFxuICAgICAqICAgJ3RlYXJkb3duJzogdGVhcmRvd25cbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIG9yIG5hbWUgYW5kIG9wdGlvbnNcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKCdmb28nLCB7XG4gICAgICpcbiAgICAgKiAgIC8vIGEgZmxhZyB0byBpbmRpY2F0ZSB0aGUgYmVuY2htYXJrIGlzIGRlZmVycmVkXG4gICAgICogICAnZGVmZXInOiB0cnVlLFxuICAgICAqXG4gICAgICogICAvLyBiZW5jaG1hcmsgdGVzdCBmdW5jdGlvblxuICAgICAqICAgJ2ZuJzogZnVuY3Rpb24oZGVmZXJyZWQpIHtcbiAgICAgKiAgICAgLy8gY2FsbCBgRGVmZXJyZWQjcmVzb2x2ZWAgd2hlbiB0aGUgZGVmZXJyZWQgdGVzdCBpcyBmaW5pc2hlZFxuICAgICAqICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICogICB9XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiAvLyBvciBvcHRpb25zIG9ubHlcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKHtcbiAgICAgKlxuICAgICAqICAgLy8gYmVuY2htYXJrIG5hbWVcbiAgICAgKiAgICduYW1lJzogJ2ZvbycsXG4gICAgICpcbiAgICAgKiAgIC8vIGJlbmNobWFyayB0ZXN0IGFzIGEgc3RyaW5nXG4gICAgICogICAnZm4nOiAnWzEsMiwzLDRdLnNvcnQoKSdcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIGEgdGVzdCdzIGB0aGlzYCBiaW5kaW5nIGlzIHNldCB0byB0aGUgYmVuY2htYXJrIGluc3RhbmNlXG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyaygnZm9vJywgZnVuY3Rpb24oKSB7XG4gICAgICogICAnTXkgbmFtZSBpcyAnLmNvbmNhdCh0aGlzLm5hbWUpOyAvLyBcIk15IG5hbWUgaXMgZm9vXCJcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBCZW5jaG1hcmsobmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXM7XG5cbiAgICAgIC8vIEFsbG93IGluc3RhbmNlIGNyZWF0aW9uIHdpdGhvdXQgdGhlIGBuZXdgIG9wZXJhdG9yLlxuICAgICAgaWYgKCEoYmVuY2ggaW5zdGFuY2VvZiBCZW5jaG1hcmspKSB7XG4gICAgICAgIHJldHVybiBuZXcgQmVuY2htYXJrKG5hbWUsIGZuLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIC8vIDEgYXJndW1lbnQgKG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gbmFtZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKF8uaXNGdW5jdGlvbihuYW1lKSkge1xuICAgICAgICAvLyAyIGFyZ3VtZW50cyAoZm4sIG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gZm47XG4gICAgICAgIGZuID0gbmFtZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKF8uaXNQbGFpbk9iamVjdChmbikpIHtcbiAgICAgICAgLy8gMiBhcmd1bWVudHMgKG5hbWUsIG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gZm47XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICAgICAgYmVuY2gubmFtZSA9IG5hbWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gMyBhcmd1bWVudHMgKG5hbWUsIGZuIFssIG9wdGlvbnNdKS5cbiAgICAgICAgYmVuY2gubmFtZSA9IG5hbWU7XG4gICAgICB9XG4gICAgICBzZXRPcHRpb25zKGJlbmNoLCBvcHRpb25zKTtcblxuICAgICAgYmVuY2guaWQgfHwgKGJlbmNoLmlkID0gKytjb3VudGVyKTtcbiAgICAgIGJlbmNoLmZuID09IG51bGwgJiYgKGJlbmNoLmZuID0gZm4pO1xuXG4gICAgICBiZW5jaC5zdGF0cyA9IGNsb25lRGVlcChiZW5jaC5zdGF0cyk7XG4gICAgICBiZW5jaC50aW1lcyA9IGNsb25lRGVlcChiZW5jaC50aW1lcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIERlZmVycmVkIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjbG9uZSBUaGUgY2xvbmVkIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBEZWZlcnJlZChjbG9uZSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gdGhpcztcbiAgICAgIGlmICghKGRlZmVycmVkIGluc3RhbmNlb2YgRGVmZXJyZWQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGVmZXJyZWQoY2xvbmUpO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQuYmVuY2htYXJrID0gY2xvbmU7XG4gICAgICBjbG9jayhkZWZlcnJlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEV2ZW50IGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFdmVudCh0eXBlKSB7XG4gICAgICB2YXIgZXZlbnQgPSB0aGlzO1xuICAgICAgaWYgKHR5cGUgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudClcbiAgICAgICAgPyBfLmFzc2lnbihldmVudCwgeyAndGltZVN0YW1wJzogXy5ub3coKSB9LCB0eXBlb2YgdHlwZSA9PSAnc3RyaW5nJyA/IHsgJ3R5cGUnOiB0eXBlIH0gOiB0eXBlKVxuICAgICAgICA6IG5ldyBFdmVudCh0eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgU3VpdGUgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBOb3RlOiBFYWNoIFN1aXRlIGluc3RhbmNlIGhhcyBhIGhhbmRmdWwgb2Ygd3JhcHBlZCBsb2Rhc2ggbWV0aG9kcyB0b1xuICAgICAqIG1ha2Ugd29ya2luZyB3aXRoIFN1aXRlcyBlYXNpZXIuIFRoZSB3cmFwcGVkIGxvZGFzaCBtZXRob2RzIGFyZTpcbiAgICAgKiBbYGVhY2gvZm9yRWFjaGBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI2ZvckVhY2gpLCBbYGluZGV4T2ZgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNpbmRleE9mKSxcbiAgICAgKiBbYG1hcGBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI21hcCksIGFuZCBbYHJlZHVjZWBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI3JlZHVjZSlcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgdG8gaWRlbnRpZnkgdGhlIHN1aXRlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlICh0aGUgYG5ld2Agb3BlcmF0b3IgaXMgb3B0aW9uYWwpXG4gICAgICogdmFyIHN1aXRlID0gbmV3IEJlbmNobWFyay5TdWl0ZTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHVzaW5nIGEgbmFtZSBmaXJzdFxuICAgICAqIHZhciBzdWl0ZSA9IG5ldyBCZW5jaG1hcmsuU3VpdGUoJ2ZvbycpO1xuICAgICAqXG4gICAgICogLy8gb3Igd2l0aCBvcHRpb25zXG4gICAgICogdmFyIHN1aXRlID0gbmV3IEJlbmNobWFyay5TdWl0ZSgnZm9vJywge1xuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiB0aGUgc3VpdGUgc3RhcnRzIHJ1bm5pbmdcbiAgICAgKiAgICdvblN0YXJ0Jzogb25TdGFydCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIGJldHdlZW4gcnVubmluZyBiZW5jaG1hcmtzXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIGFib3J0ZWRcbiAgICAgKiAgICdvbkFib3J0Jzogb25BYm9ydCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gYSB0ZXN0IGVycm9yc1xuICAgICAqICAgJ29uRXJyb3InOiBvbkVycm9yLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiByZXNldFxuICAgICAqICAgJ29uUmVzZXQnOiBvblJlc2V0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiB0aGUgc3VpdGUgY29tcGxldGVzIHJ1bm5pbmdcbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFN1aXRlKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzdWl0ZSA9IHRoaXM7XG5cbiAgICAgIC8vIEFsbG93IGluc3RhbmNlIGNyZWF0aW9uIHdpdGhvdXQgdGhlIGBuZXdgIG9wZXJhdG9yLlxuICAgICAgaWYgKCEoc3VpdGUgaW5zdGFuY2VvZiBTdWl0ZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWl0ZShuYW1lLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIC8vIDEgYXJndW1lbnQgKG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gbmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIDIgYXJndW1lbnRzIChuYW1lIFssIG9wdGlvbnNdKS5cbiAgICAgICAgc3VpdGUubmFtZSA9IG5hbWU7XG4gICAgICB9XG4gICAgICBzZXRPcHRpb25zKHN1aXRlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uY2xvbmVEZWVwYCB3aGljaCBvbmx5IGNsb25lcyBhcnJheXMgYW5kIHBsYWluXG4gICAgICogb2JqZWN0cyBhc3NpZ25pbmcgYWxsIG90aGVyIHZhbHVlcyBieSByZWZlcmVuY2UuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICAgICAqIEByZXR1cm5zIHsqfSBUaGUgY2xvbmVkIHZhbHVlLlxuICAgICAqL1xuICAgIHZhciBjbG9uZURlZXAgPSBfLnBhcnRpYWwoXy5jbG9uZURlZXBXaXRoLCBfLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgLy8gT25seSBjbG9uZSBwcmltaXRpdmVzLCBhcnJheXMsIGFuZCBwbGFpbiBvYmplY3RzLlxuICAgICAgcmV0dXJuIChfLmlzT2JqZWN0KHZhbHVlKSAmJiAhXy5pc0FycmF5KHZhbHVlKSAmJiAhXy5pc1BsYWluT2JqZWN0KHZhbHVlKSlcbiAgICAgICAgPyB2YWx1ZVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHMgc3RyaW5nIGFuZCBib2R5LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXJncyBUaGUgY29tbWEgc2VwYXJhdGVkIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYm9keSBUaGUgZnVuY3Rpb24gYm9keS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb24oKSB7XG4gICAgICAvLyBMYXp5IGRlZmluZS5cbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24oYXJncywgYm9keSkge1xuICAgICAgICB2YXIgcmVzdWx0LFxuICAgICAgICAgICAgYW5jaG9yID0gZnJlZURlZmluZSA/IGZyZWVEZWZpbmUuYW1kIDogQmVuY2htYXJrLFxuICAgICAgICAgICAgcHJvcCA9IHVpZCArICdjcmVhdGVGdW5jdGlvbic7XG5cbiAgICAgICAgcnVuU2NyaXB0KChmcmVlRGVmaW5lID8gJ2RlZmluZS5hbWQuJyA6ICdCZW5jaG1hcmsuJykgKyBwcm9wICsgJz1mdW5jdGlvbignICsgYXJncyArICcpeycgKyBib2R5ICsgJ30nKTtcbiAgICAgICAgcmVzdWx0ID0gYW5jaG9yW3Byb3BdO1xuICAgICAgICBkZWxldGUgYW5jaG9yW3Byb3BdO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICAgIC8vIEZpeCBKYWVnZXJNb25rZXkgYnVnLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHA6Ly9idWd6aWwubGEvNjM5NzIwLlxuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBzdXBwb3J0LmJyb3dzZXIgJiYgKGNyZWF0ZUZ1bmN0aW9uKCcnLCAncmV0dXJuXCInICsgdWlkICsgJ1wiJykgfHwgXy5ub29wKSgpID09IHVpZCA/IGNyZWF0ZUZ1bmN0aW9uIDogRnVuY3Rpb247XG4gICAgICByZXR1cm4gY3JlYXRlRnVuY3Rpb24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxheSB0aGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24gYmFzZWQgb24gdGhlIGJlbmNobWFyaydzIGBkZWxheWAgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBiZW5jaCBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWxheShiZW5jaCwgZm4pIHtcbiAgICAgIGJlbmNoLl90aW1lcklkID0gXy5kZWxheShmbiwgYmVuY2guZGVsYXkgKiAxZTMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3lzIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZGVzdHJveS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXN0cm95RWxlbWVudChlbGVtZW50KSB7XG4gICAgICB0cmFzaC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgIHRyYXNoLmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGZpcnN0IGFyZ3VtZW50IGZyb20gYSBmdW5jdGlvbidzIHNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBhcmd1bWVudCBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEZpcnN0QXJndW1lbnQoZm4pIHtcbiAgICAgIHJldHVybiAoIV8uaGFzKGZuLCAndG9TdHJpbmcnKSAmJlxuICAgICAgICAoL15bXFxzKF0qZnVuY3Rpb25bXihdKlxcKChbXlxccywpXSspLy5leGVjKGZuKSB8fCAwKVsxXSkgfHwgJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGFyaXRobWV0aWMgbWVhbiBvZiBhIHNhbXBsZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2FtcGxlIFRoZSBzYW1wbGUuXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIG1lYW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TWVhbihzYW1wbGUpIHtcbiAgICAgIHJldHVybiAoXy5yZWR1Y2Uoc2FtcGxlLCBmdW5jdGlvbihzdW0sIHgpIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIHg7XG4gICAgICB9KSAvIHNhbXBsZS5sZW5ndGgpIHx8IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc291cmNlIGNvZGUgb2YgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmdW5jdGlvbidzIHNvdXJjZSBjb2RlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFNvdXJjZShmbikge1xuICAgICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgICAgaWYgKGlzU3RyaW5nYWJsZShmbikpIHtcbiAgICAgICAgcmVzdWx0ID0gU3RyaW5nKGZuKTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5kZWNvbXBpbGF0aW9uKSB7XG4gICAgICAgIC8vIEVzY2FwZSB0aGUgYHtgIGZvciBGaXJlZm94IDEuXG4gICAgICAgIHJlc3VsdCA9IF8ucmVzdWx0KC9eW157XStcXHsoW1xcc1xcU10qKVxcfVxccyokLy5leGVjKGZuKSwgMSk7XG4gICAgICB9XG4gICAgICAvLyBUcmltIHN0cmluZy5cbiAgICAgIHJlc3VsdCA9IChyZXN1bHQgfHwgJycpLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcblxuICAgICAgLy8gRGV0ZWN0IHN0cmluZ3MgY29udGFpbmluZyBvbmx5IHRoZSBcInVzZSBzdHJpY3RcIiBkaXJlY3RpdmUuXG4gICAgICByZXR1cm4gL14oPzpcXC9cXCorW1xcd1xcV10qP1xcKlxcL3xcXC9cXC8uKj9bXFxuXFxyXFx1MjAyOFxcdTIwMjldfFxccykqKFtcIiddKXVzZSBzdHJpY3RcXDE7PyQvLnRlc3QocmVzdWx0KVxuICAgICAgICA/ICcnXG4gICAgICAgIDogcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhbiBvYmplY3QgaXMgb2YgdGhlIHNwZWNpZmllZCBjbGFzcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGNsYXNzLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWUgaXMgb2YgdGhlIHNwZWNpZmllZCBjbGFzcywgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQ2xhc3NPZih2YWx1ZSwgbmFtZSkge1xuICAgICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXG4gICAgICogZGF0YSB0eXBlLiBUaGUgb2JqZWN0cyB3ZSBhcmUgY29uY2VybmVkIHdpdGggdXN1YWxseSByZXR1cm4gbm9uLXByaW1pdGl2ZVxuICAgICAqIHR5cGVzIG9mIFwib2JqZWN0XCIsIFwiZnVuY3Rpb25cIiwgb3IgXCJ1bmtub3duXCIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBvd25lciBvZiB0aGUgcHJvcGVydHkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IHZhbHVlIGlzIGEgbm9uLXByaW1pdGl2ZSwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG4gICAgICByZXR1cm4gIXJlUHJpbWl0aXZlLnRlc3QodHlwZSkgJiYgKHR5cGUgIT0gJ29iamVjdCcgfHwgISFvYmplY3RbcHJvcGVydHldKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSB2YWx1ZSBjYW4gYmUgc2FmZWx5IGNvZXJjZWQgdG8gYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQsIGVsc2UgYGZhbHNlYC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1N0cmluZ2FibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBfLmlzU3RyaW5nKHZhbHVlKSB8fCAoXy5oYXModmFsdWUsICd0b1N0cmluZycpICYmIF8uaXNGdW5jdGlvbih2YWx1ZS50b1N0cmluZykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgd3JhcHBlciBhcm91bmQgYHJlcXVpcmVgIHRvIHN1cHByZXNzIGBtb2R1bGUgbWlzc2luZ2AgZXJyb3JzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIG1vZHVsZSBpZC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gVGhlIGV4cG9ydGVkIG1vZHVsZSBvciBgbnVsbGAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVxdWlyZShpZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZyZWVFeHBvcnRzICYmIGZyZWVSZXF1aXJlKGlkKTtcbiAgICAgIH0gY2F0Y2goZSkge31cbiAgICAgIHJldHVybiByZXN1bHQgfHwgbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIGEgc25pcHBldCBvZiBKYXZhU2NyaXB0IHZpYSBzY3JpcHQgaW5qZWN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSBUaGUgY29kZSB0byBydW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gcnVuU2NyaXB0KGNvZGUpIHtcbiAgICAgIHZhciBhbmNob3IgPSBmcmVlRGVmaW5lID8gZGVmaW5lLmFtZCA6IEJlbmNobWFyayxcbiAgICAgICAgICBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG4gICAgICAgICAgc2libGluZyA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF0sXG4gICAgICAgICAgcGFyZW50ID0gc2libGluZy5wYXJlbnROb2RlLFxuICAgICAgICAgIHByb3AgPSB1aWQgKyAncnVuU2NyaXB0JyxcbiAgICAgICAgICBwcmVmaXggPSAnKCcgKyAoZnJlZURlZmluZSA/ICdkZWZpbmUuYW1kLicgOiAnQmVuY2htYXJrLicpICsgcHJvcCArICd8fGZ1bmN0aW9uKCl7fSkoKTsnO1xuXG4gICAgICAvLyBGaXJlZm94IDIuMC4wLjIgY2Fubm90IHVzZSBzY3JpcHQgaW5qZWN0aW9uIGFzIGludGVuZGVkIGJlY2F1c2UgaXQgZXhlY3V0ZXNcbiAgICAgIC8vIGFzeW5jaHJvbm91c2x5LCBidXQgdGhhdCdzIE9LIGJlY2F1c2Ugc2NyaXB0IGluamVjdGlvbiBpcyBvbmx5IHVzZWQgdG8gYXZvaWRcbiAgICAgIC8vIHRoZSBwcmV2aW91c2x5IGNvbW1lbnRlZCBKYWVnZXJNb25rZXkgYnVnLlxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBpbnNlcnRlZCBzY3JpcHQgKmJlZm9yZSogcnVubmluZyB0aGUgY29kZSB0byBhdm9pZCBkaWZmZXJlbmNlc1xuICAgICAgICAvLyBpbiB0aGUgZXhwZWN0ZWQgc2NyaXB0IGVsZW1lbnQgY291bnQvb3JkZXIgb2YgdGhlIGRvY3VtZW50LlxuICAgICAgICBzY3JpcHQuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKHByZWZpeCArIGNvZGUpKTtcbiAgICAgICAgYW5jaG9yW3Byb3BdID0gZnVuY3Rpb24oKSB7IGRlc3Ryb3lFbGVtZW50KHNjcmlwdCk7IH07XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LmNsb25lTm9kZShmYWxzZSk7XG4gICAgICAgIHNpYmxpbmcgPSBudWxsO1xuICAgICAgICBzY3JpcHQudGV4dCA9IGNvZGU7XG4gICAgICB9XG4gICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgc2libGluZyk7XG4gICAgICBkZWxldGUgYW5jaG9yW3Byb3BdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgaGVscGVyIGZ1bmN0aW9uIGZvciBzZXR0aW5nIG9wdGlvbnMvZXZlbnQgaGFuZGxlcnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGJlbmNobWFyayBvciBzdWl0ZSBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldE9wdGlvbnMob2JqZWN0LCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb2JqZWN0Lm9wdGlvbnMgPSBfLmFzc2lnbih7fSwgY2xvbmVEZWVwKG9iamVjdC5jb25zdHJ1Y3Rvci5vcHRpb25zKSwgY2xvbmVEZWVwKG9wdGlvbnMpKTtcblxuICAgICAgXy5mb3JPd24ob3B0aW9ucywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgICAgaWYgKC9eb25bQS1aXS8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICBfLmVhY2goa2V5LnNwbGl0KCcgJyksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICBvYmplY3Qub24oa2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCksIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIV8uaGFzKG9iamVjdCwga2V5KSkge1xuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBjbG9uZURlZXAodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBjeWNsaW5nL2NvbXBsZXRpbmcgdGhlIGRlZmVycmVkIGJlbmNobWFyay5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlKCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gdGhpcyxcbiAgICAgICAgICBjbG9uZSA9IGRlZmVycmVkLmJlbmNobWFyayxcbiAgICAgICAgICBiZW5jaCA9IGNsb25lLl9vcmlnaW5hbDtcblxuICAgICAgaWYgKGJlbmNoLmFib3J0ZWQpIHtcbiAgICAgICAgLy8gY3ljbGUoKSAtPiBjbG9uZSBjeWNsZS9jb21wbGV0ZSBldmVudCAtPiBjb21wdXRlKCkncyBpbnZva2VkIGJlbmNoLnJ1bigpIGN5Y2xlL2NvbXBsZXRlLlxuICAgICAgICBkZWZlcnJlZC50ZWFyZG93bigpO1xuICAgICAgICBjbG9uZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGN5Y2xlKGRlZmVycmVkKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCsrZGVmZXJyZWQuY3ljbGVzIDwgY2xvbmUuY291bnQpIHtcbiAgICAgICAgY2xvbmUuY29tcGlsZWQuY2FsbChkZWZlcnJlZCwgY29udGV4dCwgdGltZXIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRpbWVyLnN0b3AoZGVmZXJyZWQpO1xuICAgICAgICBkZWZlcnJlZC50ZWFyZG93bigpO1xuICAgICAgICBkZWxheShjbG9uZSwgZnVuY3Rpb24oKSB7IGN5Y2xlKGRlZmVycmVkKTsgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQSBnZW5lcmljIGBBcnJheSNmaWx0ZXJgIGxpa2UgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24vYWxpYXMgY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBvZiB2YWx1ZXMgdGhhdCBwYXNzZWQgY2FsbGJhY2sgZmlsdGVyLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBnZXQgb2RkIG51bWJlcnNcbiAgICAgKiBCZW5jaG1hcmsuZmlsdGVyKFsxLCAyLCAzLCA0LCA1XSwgZnVuY3Rpb24obikge1xuICAgICAqICAgcmV0dXJuIG4gJSAyO1xuICAgICAqIH0pOyAvLyAtPiBbMSwgMywgNV07XG4gICAgICpcbiAgICAgKiAvLyBnZXQgZmFzdGVzdCBiZW5jaG1hcmtzXG4gICAgICogQmVuY2htYXJrLmZpbHRlcihiZW5jaGVzLCAnZmFzdGVzdCcpO1xuICAgICAqXG4gICAgICogLy8gZ2V0IHNsb3dlc3QgYmVuY2htYXJrc1xuICAgICAqIEJlbmNobWFyay5maWx0ZXIoYmVuY2hlcywgJ3Nsb3dlc3QnKTtcbiAgICAgKlxuICAgICAqIC8vIGdldCBiZW5jaG1hcmtzIHRoYXQgY29tcGxldGVkIHdpdGhvdXQgZXJyb3JpbmdcbiAgICAgKiBCZW5jaG1hcmsuZmlsdGVyKGJlbmNoZXMsICdzdWNjZXNzZnVsJyk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyKGFycmF5LCBjYWxsYmFjaykge1xuICAgICAgaWYgKGNhbGxiYWNrID09PSAnc3VjY2Vzc2Z1bCcpIHtcbiAgICAgICAgLy8gQ2FsbGJhY2sgdG8gZXhjbHVkZSB0aG9zZSB0aGF0IGFyZSBlcnJvcmVkLCB1bnJ1biwgb3IgaGF2ZSBoeiBvZiBJbmZpbml0eS5cbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbihiZW5jaCkge1xuICAgICAgICAgIHJldHVybiBiZW5jaC5jeWNsZXMgJiYgXy5pc0Zpbml0ZShiZW5jaC5oeikgJiYgIWJlbmNoLmVycm9yO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoY2FsbGJhY2sgPT09ICdmYXN0ZXN0JyB8fCBjYWxsYmFjayA9PT0gJ3Nsb3dlc3QnKSB7XG4gICAgICAgIC8vIEdldCBzdWNjZXNzZnVsLCBzb3J0IGJ5IHBlcmlvZCArIG1hcmdpbiBvZiBlcnJvciwgYW5kIGZpbHRlciBmYXN0ZXN0L3Nsb3dlc3QuXG4gICAgICAgIHZhciByZXN1bHQgPSBmaWx0ZXIoYXJyYXksICdzdWNjZXNzZnVsJykuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgYSA9IGEuc3RhdHM7IGIgPSBiLnN0YXRzO1xuICAgICAgICAgIHJldHVybiAoYS5tZWFuICsgYS5tb2UgPiBiLm1lYW4gKyBiLm1vZSA/IDEgOiAtMSkgKiAoY2FsbGJhY2sgPT09ICdmYXN0ZXN0JyA/IDEgOiAtMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBfLmZpbHRlcihyZXN1bHQsIGZ1bmN0aW9uKGJlbmNoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFswXS5jb21wYXJlKGJlbmNoKSA9PSAwO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgbnVtYmVyIHRvIGEgbW9yZSByZWFkYWJsZSBjb21tYS1zZXBhcmF0ZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbW9yZSByZWFkYWJsZSBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9ybWF0TnVtYmVyKG51bWJlcikge1xuICAgICAgbnVtYmVyID0gU3RyaW5nKG51bWJlcikuc3BsaXQoJy4nKTtcbiAgICAgIHJldHVybiBudW1iZXJbMF0ucmVwbGFjZSgvKD89KD86XFxkezN9KSskKSg/IVxcYikvZywgJywnKSArXG4gICAgICAgIChudW1iZXJbMV0gPyAnLicgKyBudW1iZXJbMV0gOiAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBhIG1ldGhvZCBvbiBhbGwgaXRlbXMgaW4gYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGJlbmNoZXMgQXJyYXkgb2YgYmVuY2htYXJrcyB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBtZXRob2QgdG8gaW52b2tlIE9SIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIG1ldGhvZCB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGZyb20gZWFjaCBtZXRob2QgaW52b2tlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gaW52b2tlIGByZXNldGAgb24gYWxsIGJlbmNobWFya3NcbiAgICAgKiBCZW5jaG1hcmsuaW52b2tlKGJlbmNoZXMsICdyZXNldCcpO1xuICAgICAqXG4gICAgICogLy8gaW52b2tlIGBlbWl0YCB3aXRoIGFyZ3VtZW50c1xuICAgICAqIEJlbmNobWFyay5pbnZva2UoYmVuY2hlcywgJ2VtaXQnLCAnY29tcGxldGUnLCBsaXN0ZW5lcik7XG4gICAgICpcbiAgICAgKiAvLyBpbnZva2UgYHJ1bih0cnVlKWAsIHRyZWF0IGJlbmNobWFya3MgYXMgYSBxdWV1ZSwgYW5kIHJlZ2lzdGVyIGludm9rZSBjYWxsYmFja3NcbiAgICAgKiBCZW5jaG1hcmsuaW52b2tlKGJlbmNoZXMsIHtcbiAgICAgKlxuICAgICAqICAgLy8gaW52b2tlIHRoZSBgcnVuYCBtZXRob2RcbiAgICAgKiAgICduYW1lJzogJ3J1bicsXG4gICAgICpcbiAgICAgKiAgIC8vIHBhc3MgYSBzaW5nbGUgYXJndW1lbnRcbiAgICAgKiAgICdhcmdzJzogdHJ1ZSxcbiAgICAgKlxuICAgICAqICAgLy8gdHJlYXQgYXMgcXVldWUsIHJlbW92aW5nIGJlbmNobWFya3MgZnJvbSBmcm9udCBvZiBgYmVuY2hlc2AgdW50aWwgZW1wdHlcbiAgICAgKiAgICdxdWV1ZWQnOiB0cnVlLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgYmVmb3JlIGFueSBiZW5jaG1hcmtzIGhhdmUgYmVlbiBpbnZva2VkLlxuICAgICAqICAgJ29uU3RhcnQnOiBvblN0YXJ0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgYmV0d2VlbiBpbnZva2luZyBiZW5jaG1hcmtzXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCBhZnRlciBhbGwgYmVuY2htYXJrcyBoYXZlIGJlZW4gaW52b2tlZC5cbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludm9rZShiZW5jaGVzLCBuYW1lKSB7XG4gICAgICB2YXIgYXJncyxcbiAgICAgICAgICBiZW5jaCxcbiAgICAgICAgICBxdWV1ZWQsXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBldmVudFByb3BzID0geyAnY3VycmVudFRhcmdldCc6IGJlbmNoZXMgfSxcbiAgICAgICAgICBvcHRpb25zID0geyAnb25TdGFydCc6IF8ubm9vcCwgJ29uQ3ljbGUnOiBfLm5vb3AsICdvbkNvbXBsZXRlJzogXy5ub29wIH0sXG4gICAgICAgICAgcmVzdWx0ID0gXy50b0FycmF5KGJlbmNoZXMpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEludm9rZXMgdGhlIG1ldGhvZCBvZiB0aGUgY3VycmVudCBvYmplY3QgYW5kIGlmIHN5bmNocm9ub3VzLCBmZXRjaGVzIHRoZSBuZXh0LlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBleGVjdXRlKCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzLFxuICAgICAgICAgICAgYXN5bmMgPSBpc0FzeW5jKGJlbmNoKTtcblxuICAgICAgICBpZiAoYXN5bmMpIHtcbiAgICAgICAgICAvLyBVc2UgYGdldE5leHRgIGFzIHRoZSBmaXJzdCBsaXN0ZW5lci5cbiAgICAgICAgICBiZW5jaC5vbignY29tcGxldGUnLCBnZXROZXh0KTtcbiAgICAgICAgICBsaXN0ZW5lcnMgPSBiZW5jaC5ldmVudHMuY29tcGxldGU7XG4gICAgICAgICAgbGlzdGVuZXJzLnNwbGljZSgwLCAwLCBsaXN0ZW5lcnMucG9wKCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEV4ZWN1dGUgbWV0aG9kLlxuICAgICAgICByZXN1bHRbaW5kZXhdID0gXy5pc0Z1bmN0aW9uKGJlbmNoICYmIGJlbmNoW25hbWVdKSA/IGJlbmNoW25hbWVdLmFwcGx5KGJlbmNoLCBhcmdzKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gSWYgc3luY2hyb25vdXMgcmV0dXJuIGB0cnVlYCB1bnRpbCBmaW5pc2hlZC5cbiAgICAgICAgcmV0dXJuICFhc3luYyAmJiBnZXROZXh0KCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRmV0Y2hlcyB0aGUgbmV4dCBiZW5jaCBvciBleGVjdXRlcyBgb25Db21wbGV0ZWAgY2FsbGJhY2suXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGdldE5leHQoZXZlbnQpIHtcbiAgICAgICAgdmFyIGN5Y2xlRXZlbnQsXG4gICAgICAgICAgICBsYXN0ID0gYmVuY2gsXG4gICAgICAgICAgICBhc3luYyA9IGlzQXN5bmMobGFzdCk7XG5cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgbGFzdC5vZmYoJ2NvbXBsZXRlJywgZ2V0TmV4dCk7XG4gICAgICAgICAgbGFzdC5lbWl0KCdjb21wbGV0ZScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVtaXQgXCJjeWNsZVwiIGV2ZW50LlxuICAgICAgICBldmVudFByb3BzLnR5cGUgPSAnY3ljbGUnO1xuICAgICAgICBldmVudFByb3BzLnRhcmdldCA9IGxhc3Q7XG4gICAgICAgIGN5Y2xlRXZlbnQgPSBFdmVudChldmVudFByb3BzKTtcbiAgICAgICAgb3B0aW9ucy5vbkN5Y2xlLmNhbGwoYmVuY2hlcywgY3ljbGVFdmVudCk7XG5cbiAgICAgICAgLy8gQ2hvb3NlIG5leHQgYmVuY2htYXJrIGlmIG5vdCBleGl0aW5nIGVhcmx5LlxuICAgICAgICBpZiAoIWN5Y2xlRXZlbnQuYWJvcnRlZCAmJiByYWlzZUluZGV4KCkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgYmVuY2ggPSBxdWV1ZWQgPyBiZW5jaGVzWzBdIDogcmVzdWx0W2luZGV4XTtcbiAgICAgICAgICBpZiAoaXNBc3luYyhiZW5jaCkpIHtcbiAgICAgICAgICAgIGRlbGF5KGJlbmNoLCBleGVjdXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoYXN5bmMpIHtcbiAgICAgICAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gaWYgcHJldmlvdXNseSBhc3luY2hyb25vdXMgYnV0IG5vdyBzeW5jaHJvbm91cy5cbiAgICAgICAgICAgIHdoaWxlIChleGVjdXRlKCkpIHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29udGludWUgc3luY2hyb25vdXMgZXhlY3V0aW9uLlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVtaXQgXCJjb21wbGV0ZVwiIGV2ZW50LlxuICAgICAgICAgIGV2ZW50UHJvcHMudHlwZSA9ICdjb21wbGV0ZSc7XG4gICAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlLmNhbGwoYmVuY2hlcywgRXZlbnQoZXZlbnRQcm9wcykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gdXNlZCBhcyBhIGxpc3RlbmVyIGBldmVudC5hYm9ydGVkID0gdHJ1ZWAgd2lsbCBjYW5jZWwgdGhlIHJlc3Qgb2ZcbiAgICAgICAgLy8gdGhlIFwiY29tcGxldGVcIiBsaXN0ZW5lcnMgYmVjYXVzZSB0aGV5IHdlcmUgYWxyZWFkeSBjYWxsZWQgYWJvdmUgYW5kIHdoZW5cbiAgICAgICAgLy8gdXNlZCBhcyBwYXJ0IG9mIGBnZXROZXh0YCB0aGUgYHJldHVybiBmYWxzZWAgd2lsbCBleGl0IHRoZSBleGVjdXRpb24gd2hpbGUtbG9vcC5cbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgZXZlbnQuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hlY2tzIGlmIGludm9raW5nIGBCZW5jaG1hcmsjcnVuYCB3aXRoIGFzeW5jaHJvbm91cyBjeWNsZXMuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGlzQXN5bmMob2JqZWN0KSB7XG4gICAgICAgIC8vIEF2b2lkIHVzaW5nIGBpbnN0YW5jZW9mYCBoZXJlIGJlY2F1c2Ugb2YgSUUgbWVtb3J5IGxlYWsgaXNzdWVzIHdpdGggaG9zdCBvYmplY3RzLlxuICAgICAgICB2YXIgYXN5bmMgPSBhcmdzWzBdICYmIGFyZ3NbMF0uYXN5bmM7XG4gICAgICAgIHJldHVybiBuYW1lID09ICdydW4nICYmIChvYmplY3QgaW5zdGFuY2VvZiBCZW5jaG1hcmspICYmXG4gICAgICAgICAgKChhc3luYyA9PSBudWxsID8gb2JqZWN0Lm9wdGlvbnMuYXN5bmMgOiBhc3luYykgJiYgc3VwcG9ydC50aW1lb3V0IHx8IG9iamVjdC5kZWZlcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUmFpc2VzIGBpbmRleGAgdG8gdGhlIG5leHQgZGVmaW5lZCBpbmRleCBvciByZXR1cm5zIGBmYWxzZWAuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJhaXNlSW5kZXgoKSB7XG4gICAgICAgIGluZGV4Kys7XG5cbiAgICAgICAgLy8gSWYgcXVldWVkIHJlbW92ZSB0aGUgcHJldmlvdXMgYmVuY2guXG4gICAgICAgIGlmIChxdWV1ZWQgJiYgaW5kZXggPiAwKSB7XG4gICAgICAgICAgc2hpZnQuY2FsbChiZW5jaGVzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIHRoZSBsYXN0IGluZGV4IHRoZW4gcmV0dXJuIGBmYWxzZWAuXG4gICAgICAgIHJldHVybiAocXVldWVkID8gYmVuY2hlcy5sZW5ndGggOiBpbmRleCA8IHJlc3VsdC5sZW5ndGgpXG4gICAgICAgICAgPyBpbmRleFxuICAgICAgICAgIDogKGluZGV4ID0gZmFsc2UpO1xuICAgICAgfVxuICAgICAgLy8gSnVnZ2xlIGFyZ3VtZW50cy5cbiAgICAgIGlmIChfLmlzU3RyaW5nKG5hbWUpKSB7XG4gICAgICAgIC8vIDIgYXJndW1lbnRzIChhcnJheSwgbmFtZSkuXG4gICAgICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAyIGFyZ3VtZW50cyAoYXJyYXksIG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gXy5hc3NpZ24ob3B0aW9ucywgbmFtZSk7XG4gICAgICAgIG5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgICAgIGFyZ3MgPSBfLmlzQXJyYXkoYXJncyA9ICdhcmdzJyBpbiBvcHRpb25zID8gb3B0aW9ucy5hcmdzIDogW10pID8gYXJncyA6IFthcmdzXTtcbiAgICAgICAgcXVldWVkID0gb3B0aW9ucy5xdWV1ZWQ7XG4gICAgICB9XG4gICAgICAvLyBTdGFydCBpdGVyYXRpbmcgb3ZlciB0aGUgYXJyYXkuXG4gICAgICBpZiAocmFpc2VJbmRleCgpICE9PSBmYWxzZSkge1xuICAgICAgICAvLyBFbWl0IFwic3RhcnRcIiBldmVudC5cbiAgICAgICAgYmVuY2ggPSByZXN1bHRbaW5kZXhdO1xuICAgICAgICBldmVudFByb3BzLnR5cGUgPSAnc3RhcnQnO1xuICAgICAgICBldmVudFByb3BzLnRhcmdldCA9IGJlbmNoO1xuICAgICAgICBvcHRpb25zLm9uU3RhcnQuY2FsbChiZW5jaGVzLCBFdmVudChldmVudFByb3BzKSk7XG5cbiAgICAgICAgLy8gRW5kIGVhcmx5IGlmIHRoZSBzdWl0ZSB3YXMgYWJvcnRlZCBpbiBhbiBcIm9uU3RhcnRcIiBsaXN0ZW5lci5cbiAgICAgICAgaWYgKG5hbWUgPT0gJ3J1bicgJiYgKGJlbmNoZXMgaW5zdGFuY2VvZiBTdWl0ZSkgJiYgYmVuY2hlcy5hYm9ydGVkKSB7XG4gICAgICAgICAgLy8gRW1pdCBcImN5Y2xlXCIgZXZlbnQuXG4gICAgICAgICAgZXZlbnRQcm9wcy50eXBlID0gJ2N5Y2xlJztcbiAgICAgICAgICBvcHRpb25zLm9uQ3ljbGUuY2FsbChiZW5jaGVzLCBFdmVudChldmVudFByb3BzKSk7XG4gICAgICAgICAgLy8gRW1pdCBcImNvbXBsZXRlXCIgZXZlbnQuXG4gICAgICAgICAgZXZlbnRQcm9wcy50eXBlID0gJ2NvbXBsZXRlJztcbiAgICAgICAgICBvcHRpb25zLm9uQ29tcGxldGUuY2FsbChiZW5jaGVzLCBFdmVudChldmVudFByb3BzKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RhcnQgbWV0aG9kIGV4ZWN1dGlvbi5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKGlzQXN5bmMoYmVuY2gpKSB7XG4gICAgICAgICAgICBkZWxheShiZW5jaCwgZXhlY3V0ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChleGVjdXRlKCkpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzdHJpbmcgb2Ygam9pbmVkIGFycmF5IHZhbHVlcyBvciBvYmplY3Qga2V5LXZhbHVlIHBhaXJzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gb3BlcmF0ZSBvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3NlcGFyYXRvcjE9JywnXSBUaGUgc2VwYXJhdG9yIHVzZWQgYmV0d2VlbiBrZXktdmFsdWUgcGFpcnMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzZXBhcmF0b3IyPSc6ICddIFRoZSBzZXBhcmF0b3IgdXNlZCBiZXR3ZWVuIGtleXMgYW5kIHZhbHVlcy5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgam9pbmVkIHJlc3VsdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBqb2luKG9iamVjdCwgc2VwYXJhdG9yMSwgc2VwYXJhdG9yMikge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgIGxlbmd0aCA9IChvYmplY3QgPSBPYmplY3Qob2JqZWN0KSkubGVuZ3RoLFxuICAgICAgICAgIGFycmF5TGlrZSA9IGxlbmd0aCA9PT0gbGVuZ3RoID4+PiAwO1xuXG4gICAgICBzZXBhcmF0b3IyIHx8IChzZXBhcmF0b3IyID0gJzogJyk7XG4gICAgICBfLmVhY2gob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGFycmF5TGlrZSA/IHZhbHVlIDoga2V5ICsgc2VwYXJhdG9yMiArIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKHNlcGFyYXRvcjEgfHwgJywnKTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBYm9ydHMgYWxsIGJlbmNobWFya3MgaW4gdGhlIHN1aXRlLlxuICAgICAqXG4gICAgICogQG5hbWUgYWJvcnRcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHN1aXRlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFib3J0U3VpdGUoKSB7XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIHJlc2V0dGluZyA9IGNhbGxlZEJ5LnJlc2V0U3VpdGU7XG5cbiAgICAgIGlmIChzdWl0ZS5ydW5uaW5nKSB7XG4gICAgICAgIGV2ZW50ID0gRXZlbnQoJ2Fib3J0Jyk7XG4gICAgICAgIHN1aXRlLmVtaXQoZXZlbnQpO1xuICAgICAgICBpZiAoIWV2ZW50LmNhbmNlbGxlZCB8fCByZXNldHRpbmcpIHtcbiAgICAgICAgICAvLyBBdm9pZCBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgY2FsbGVkQnkuYWJvcnRTdWl0ZSA9IHRydWU7XG4gICAgICAgICAgc3VpdGUucmVzZXQoKTtcbiAgICAgICAgICBkZWxldGUgY2FsbGVkQnkuYWJvcnRTdWl0ZTtcblxuICAgICAgICAgIGlmICghcmVzZXR0aW5nKSB7XG4gICAgICAgICAgICBzdWl0ZS5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGludm9rZShzdWl0ZSwgJ2Fib3J0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIHRlc3QgdG8gdGhlIGJlbmNobWFyayBzdWl0ZS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgdG8gaWRlbnRpZnkgdGhlIGJlbmNobWFyay5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZm4gVGhlIHRlc3QgdG8gYmVuY2htYXJrLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHN1aXRlIGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBiYXNpYyB1c2FnZVxuICAgICAqIHN1aXRlLmFkZChmbik7XG4gICAgICpcbiAgICAgKiAvLyBvciB1c2luZyBhIG5hbWUgZmlyc3RcbiAgICAgKiBzdWl0ZS5hZGQoJ2ZvbycsIGZuKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHdpdGggb3B0aW9uc1xuICAgICAqIHN1aXRlLmFkZCgnZm9vJywgZm4sIHtcbiAgICAgKiAgICdvbkN5Y2xlJzogb25DeWNsZSxcbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gb3IgbmFtZSBhbmQgb3B0aW9uc1xuICAgICAqIHN1aXRlLmFkZCgnZm9vJywge1xuICAgICAqICAgJ2ZuJzogZm4sXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGVcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIG9yIG9wdGlvbnMgb25seVxuICAgICAqIHN1aXRlLmFkZCh7XG4gICAgICogICAnbmFtZSc6ICdmb28nLFxuICAgICAqICAgJ2ZuJzogZm4sXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGVcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGQobmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzdWl0ZSA9IHRoaXMsXG4gICAgICAgICAgYmVuY2ggPSBuZXcgQmVuY2htYXJrKG5hbWUsIGZuLCBvcHRpb25zKSxcbiAgICAgICAgICBldmVudCA9IEV2ZW50KHsgJ3R5cGUnOiAnYWRkJywgJ3RhcmdldCc6IGJlbmNoIH0pO1xuXG4gICAgICBpZiAoc3VpdGUuZW1pdChldmVudCksICFldmVudC5jYW5jZWxsZWQpIHtcbiAgICAgICAgc3VpdGUucHVzaChiZW5jaCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzdWl0ZSB3aXRoIGNsb25lZCBiZW5jaG1hcmtzLlxuICAgICAqXG4gICAgICogQG5hbWUgY2xvbmVcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyBvYmplY3QgdG8gb3ZlcndyaXRlIGNsb25lZCBvcHRpb25zLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBuZXcgc3VpdGUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xvbmVTdWl0ZShvcHRpb25zKSB7XG4gICAgICB2YXIgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIHJlc3VsdCA9IG5ldyBzdWl0ZS5jb25zdHJ1Y3RvcihfLmFzc2lnbih7fSwgc3VpdGUub3B0aW9ucywgb3B0aW9ucykpO1xuXG4gICAgICAvLyBDb3B5IG93biBwcm9wZXJ0aWVzLlxuICAgICAgXy5mb3JPd24oc3VpdGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhyZXN1bHQsIGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlICYmIF8uaXNGdW5jdGlvbih2YWx1ZS5jbG9uZSlcbiAgICAgICAgICAgID8gdmFsdWUuY2xvbmUoKVxuICAgICAgICAgICAgOiBjbG9uZURlZXAodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYEFycmF5I2ZpbHRlcmAgbGlrZSBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBmaWx0ZXJcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGNhbGxiYWNrIFRoZSBmdW5jdGlvbi9hbGlhcyBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIG5ldyBzdWl0ZSBvZiBiZW5jaG1hcmtzIHRoYXQgcGFzc2VkIGNhbGxiYWNrIGZpbHRlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXJTdWl0ZShjYWxsYmFjaykge1xuICAgICAgdmFyIHN1aXRlID0gdGhpcyxcbiAgICAgICAgICByZXN1bHQgPSBuZXcgc3VpdGUuY29uc3RydWN0b3Ioc3VpdGUub3B0aW9ucyk7XG5cbiAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgZmlsdGVyKHN1aXRlLCBjYWxsYmFjaykpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgYWxsIGJlbmNobWFya3MgaW4gdGhlIHN1aXRlLlxuICAgICAqXG4gICAgICogQG5hbWUgcmVzZXRcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHN1aXRlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc2V0U3VpdGUoKSB7XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIGFib3J0aW5nID0gY2FsbGVkQnkuYWJvcnRTdWl0ZTtcblxuICAgICAgaWYgKHN1aXRlLnJ1bm5pbmcgJiYgIWFib3J0aW5nKSB7XG4gICAgICAgIC8vIE5vIHdvcnJpZXMsIGByZXNldFN1aXRlKClgIGlzIGNhbGxlZCB3aXRoaW4gYGFib3J0U3VpdGUoKWAuXG4gICAgICAgIGNhbGxlZEJ5LnJlc2V0U3VpdGUgPSB0cnVlO1xuICAgICAgICBzdWl0ZS5hYm9ydCgpO1xuICAgICAgICBkZWxldGUgY2FsbGVkQnkucmVzZXRTdWl0ZTtcbiAgICAgIH1cbiAgICAgIC8vIFJlc2V0IGlmIHRoZSBzdGF0ZSBoYXMgY2hhbmdlZC5cbiAgICAgIGVsc2UgaWYgKChzdWl0ZS5hYm9ydGVkIHx8IHN1aXRlLnJ1bm5pbmcpICYmXG4gICAgICAgICAgKHN1aXRlLmVtaXQoZXZlbnQgPSBFdmVudCgncmVzZXQnKSksICFldmVudC5jYW5jZWxsZWQpKSB7XG4gICAgICAgIHN1aXRlLmFib3J0ZWQgPSBzdWl0ZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghYWJvcnRpbmcpIHtcbiAgICAgICAgICBpbnZva2Uoc3VpdGUsICdyZXNldCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVucyB0aGUgc3VpdGUuXG4gICAgICpcbiAgICAgKiBAbmFtZSBydW5cbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc3VpdGUgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlXG4gICAgICogc3VpdGUucnVuKCk7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiBzdWl0ZS5ydW4oeyAnYXN5bmMnOiB0cnVlLCAncXVldWVkJzogdHJ1ZSB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBydW5TdWl0ZShvcHRpb25zKSB7XG4gICAgICB2YXIgc3VpdGUgPSB0aGlzO1xuXG4gICAgICBzdWl0ZS5yZXNldCgpO1xuICAgICAgc3VpdGUucnVubmluZyA9IHRydWU7XG4gICAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXG4gICAgICBpbnZva2Uoc3VpdGUsIHtcbiAgICAgICAgJ25hbWUnOiAncnVuJyxcbiAgICAgICAgJ2FyZ3MnOiBvcHRpb25zLFxuICAgICAgICAncXVldWVkJzogb3B0aW9ucy5xdWV1ZWQsXG4gICAgICAgICdvblN0YXJ0JzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBzdWl0ZS5lbWl0KGV2ZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgJ29uQ3ljbGUnOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHZhciBiZW5jaCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICBpZiAoYmVuY2guZXJyb3IpIHtcbiAgICAgICAgICAgIHN1aXRlLmVtaXQoeyAndHlwZSc6ICdlcnJvcicsICd0YXJnZXQnOiBiZW5jaCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3VpdGUuZW1pdChldmVudCk7XG4gICAgICAgICAgZXZlbnQuYWJvcnRlZCA9IHN1aXRlLmFib3J0ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgICdvbkNvbXBsZXRlJzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBzdWl0ZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgc3VpdGUuZW1pdChldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHN1aXRlO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIGFsbCByZWdpc3RlcmVkIGxpc3RlbmVycyBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50IHR5cGUuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLCBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IHR5cGUgVGhlIGV2ZW50IHR5cGUgb3Igb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbGFzdCBsaXN0ZW5lciBleGVjdXRlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbWl0KHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMsXG4gICAgICAgICAgb2JqZWN0ID0gdGhpcyxcbiAgICAgICAgICBldmVudCA9IEV2ZW50KHR5cGUpLFxuICAgICAgICAgIGV2ZW50cyA9IG9iamVjdC5ldmVudHMsXG4gICAgICAgICAgYXJncyA9IChhcmd1bWVudHNbMF0gPSBldmVudCwgYXJndW1lbnRzKTtcblxuICAgICAgZXZlbnQuY3VycmVudFRhcmdldCB8fCAoZXZlbnQuY3VycmVudFRhcmdldCA9IG9iamVjdCk7XG4gICAgICBldmVudC50YXJnZXQgfHwgKGV2ZW50LnRhcmdldCA9IG9iamVjdCk7XG4gICAgICBkZWxldGUgZXZlbnQucmVzdWx0O1xuXG4gICAgICBpZiAoZXZlbnRzICYmIChsaXN0ZW5lcnMgPSBfLmhhcyhldmVudHMsIGV2ZW50LnR5cGUpICYmIGV2ZW50c1tldmVudC50eXBlXSkpIHtcbiAgICAgICAgXy5lYWNoKGxpc3RlbmVycy5zbGljZSgpLCBmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICAgIGlmICgoZXZlbnQucmVzdWx0ID0gbGlzdGVuZXIuYXBwbHkob2JqZWN0LCBhcmdzKSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBldmVudC5jYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gIWV2ZW50LmFib3J0ZWQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2ZW50LnJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGV2ZW50IGxpc3RlbmVycyBmb3IgYSBnaXZlbiB0eXBlIHRoYXQgY2FuIGJlIG1hbmlwdWxhdGVkXG4gICAgICogdG8gYWRkIG9yIHJlbW92ZSBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLCBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBsaXN0ZW5lcnMgYXJyYXkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLFxuICAgICAgICAgIGV2ZW50cyA9IG9iamVjdC5ldmVudHMgfHwgKG9iamVjdC5ldmVudHMgPSB7fSk7XG5cbiAgICAgIHJldHVybiBfLmhhcyhldmVudHMsIHR5cGUpID8gZXZlbnRzW3R5cGVdIDogKGV2ZW50c1t0eXBlXSA9IFtdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnJlZ2lzdGVycyBhIGxpc3RlbmVyIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50IHR5cGUocyksXG4gICAgICogb3IgdW5yZWdpc3RlcnMgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudCB0eXBlKHMpLFxuICAgICAqIG9yIHVucmVnaXN0ZXJzIGFsbCBsaXN0ZW5lcnMgZm9yIGFsbCBldmVudCB0eXBlcy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmssIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gVGhlIGV2ZW50IHR5cGUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2xpc3RlbmVyXSBUaGUgZnVuY3Rpb24gdG8gdW5yZWdpc3Rlci5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgY3VycmVudCBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhIGxpc3RlbmVyIGZvciBhbiBldmVudCB0eXBlXG4gICAgICogYmVuY2gub2ZmKCdjeWNsZScsIGxpc3RlbmVyKTtcbiAgICAgKlxuICAgICAqIC8vIHVucmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgbXVsdGlwbGUgZXZlbnQgdHlwZXNcbiAgICAgKiBiZW5jaC5vZmYoJ3N0YXJ0IGN5Y2xlJywgbGlzdGVuZXIpO1xuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhbGwgbGlzdGVuZXJzIGZvciBhbiBldmVudCB0eXBlXG4gICAgICogYmVuY2gub2ZmKCdjeWNsZScpO1xuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhbGwgbGlzdGVuZXJzIGZvciBtdWx0aXBsZSBldmVudCB0eXBlc1xuICAgICAqIGJlbmNoLm9mZignc3RhcnQgY3ljbGUgY29tcGxldGUnKTtcbiAgICAgKlxuICAgICAqIC8vIHVucmVnaXN0ZXIgYWxsIGxpc3RlbmVycyBmb3IgYWxsIGV2ZW50IHR5cGVzXG4gICAgICogYmVuY2gub2ZmKCk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gb2ZmKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gdGhpcyxcbiAgICAgICAgICBldmVudHMgPSBvYmplY3QuZXZlbnRzO1xuXG4gICAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuICAgICAgXy5lYWNoKHR5cGUgPyB0eXBlLnNwbGl0KCcgJykgOiBldmVudHMsIGZ1bmN0aW9uKGxpc3RlbmVycywgdHlwZSkge1xuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdHlwZSA9IGxpc3RlbmVycztcbiAgICAgICAgICBsaXN0ZW5lcnMgPSBfLmhhcyhldmVudHMsIHR5cGUpICYmIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBpbmRleCA9IF8uaW5kZXhPZihsaXN0ZW5lcnMsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBsaXN0ZW5lciBmb3IgdGhlIHNwZWNpZmllZCBldmVudCB0eXBlKHMpLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyaywgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIGV2ZW50IHR5cGUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgVGhlIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBjdXJyZW50IGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyByZWdpc3RlciBhIGxpc3RlbmVyIGZvciBhbiBldmVudCB0eXBlXG4gICAgICogYmVuY2gub24oJ2N5Y2xlJywgbGlzdGVuZXIpO1xuICAgICAqXG4gICAgICogLy8gcmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgbXVsdGlwbGUgZXZlbnQgdHlwZXNcbiAgICAgKiBiZW5jaC5vbignc3RhcnQgY3ljbGUnLCBsaXN0ZW5lcik7XG4gICAgICovXG4gICAgZnVuY3Rpb24gb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLFxuICAgICAgICAgIGV2ZW50cyA9IG9iamVjdC5ldmVudHMgfHwgKG9iamVjdC5ldmVudHMgPSB7fSk7XG5cbiAgICAgIF8uZWFjaCh0eXBlLnNwbGl0KCcgJyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgKF8uaGFzKGV2ZW50cywgdHlwZSlcbiAgICAgICAgICA/IGV2ZW50c1t0eXBlXVxuICAgICAgICAgIDogKGV2ZW50c1t0eXBlXSA9IFtdKVxuICAgICAgICApLnB1c2gobGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEFib3J0cyB0aGUgYmVuY2htYXJrIHdpdGhvdXQgcmVjb3JkaW5nIHRpbWVzLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWJvcnQoKSB7XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgYmVuY2ggPSB0aGlzLFxuICAgICAgICAgIHJlc2V0dGluZyA9IGNhbGxlZEJ5LnJlc2V0O1xuXG4gICAgICBpZiAoYmVuY2gucnVubmluZykge1xuICAgICAgICBldmVudCA9IEV2ZW50KCdhYm9ydCcpO1xuICAgICAgICBiZW5jaC5lbWl0KGV2ZW50KTtcbiAgICAgICAgaWYgKCFldmVudC5jYW5jZWxsZWQgfHwgcmVzZXR0aW5nKSB7XG4gICAgICAgICAgLy8gQXZvaWQgaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgIGNhbGxlZEJ5LmFib3J0ID0gdHJ1ZTtcbiAgICAgICAgICBiZW5jaC5yZXNldCgpO1xuICAgICAgICAgIGRlbGV0ZSBjYWxsZWRCeS5hYm9ydDtcblxuICAgICAgICAgIGlmIChzdXBwb3J0LnRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChiZW5jaC5fdGltZXJJZCk7XG4gICAgICAgICAgICBkZWxldGUgYmVuY2guX3RpbWVySWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghcmVzZXR0aW5nKSB7XG4gICAgICAgICAgICBiZW5jaC5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGJlbmNoLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZW5jaDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGJlbmNobWFyayB1c2luZyB0aGUgc2FtZSB0ZXN0IGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0IHRvIG92ZXJ3cml0ZSBjbG9uZWQgb3B0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbmV3IGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGJpemFycm8gPSBiZW5jaC5jbG9uZSh7XG4gICAgICogICAnbmFtZSc6ICdkb3BwZWxnYW5nZXInXG4gICAgICogfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xvbmUob3B0aW9ucykge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcyxcbiAgICAgICAgICByZXN1bHQgPSBuZXcgYmVuY2guY29uc3RydWN0b3IoXy5hc3NpZ24oe30sIGJlbmNoLCBvcHRpb25zKSk7XG5cbiAgICAgIC8vIENvcnJlY3QgdGhlIGBvcHRpb25zYCBvYmplY3QuXG4gICAgICByZXN1bHQub3B0aW9ucyA9IF8uYXNzaWduKHt9LCBjbG9uZURlZXAoYmVuY2gub3B0aW9ucyksIGNsb25lRGVlcChvcHRpb25zKSk7XG5cbiAgICAgIC8vIENvcHkgb3duIGN1c3RvbSBwcm9wZXJ0aWVzLlxuICAgICAgXy5mb3JPd24oYmVuY2gsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhyZXN1bHQsIGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IGNsb25lRGVlcCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgaWYgYSBiZW5jaG1hcmsgaXMgZmFzdGVyIHRoYW4gYW5vdGhlci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIGJlbmNobWFyayB0byBjb21wYXJlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYC0xYCBpZiBzbG93ZXIsIGAxYCBpZiBmYXN0ZXIsIGFuZCBgMGAgaWYgaW5kZXRlcm1pbmF0ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb21wYXJlKG90aGVyKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzO1xuXG4gICAgICAvLyBFeGl0IGVhcmx5IGlmIGNvbXBhcmluZyB0aGUgc2FtZSBiZW5jaG1hcmsuXG4gICAgICBpZiAoYmVuY2ggPT0gb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICB2YXIgY3JpdGljYWwsXG4gICAgICAgICAgelN0YXQsXG4gICAgICAgICAgc2FtcGxlMSA9IGJlbmNoLnN0YXRzLnNhbXBsZSxcbiAgICAgICAgICBzYW1wbGUyID0gb3RoZXIuc3RhdHMuc2FtcGxlLFxuICAgICAgICAgIHNpemUxID0gc2FtcGxlMS5sZW5ndGgsXG4gICAgICAgICAgc2l6ZTIgPSBzYW1wbGUyLmxlbmd0aCxcbiAgICAgICAgICBtYXhTaXplID0gbWF4KHNpemUxLCBzaXplMiksXG4gICAgICAgICAgbWluU2l6ZSA9IG1pbihzaXplMSwgc2l6ZTIpLFxuICAgICAgICAgIHUxID0gZ2V0VShzYW1wbGUxLCBzYW1wbGUyKSxcbiAgICAgICAgICB1MiA9IGdldFUoc2FtcGxlMiwgc2FtcGxlMSksXG4gICAgICAgICAgdSA9IG1pbih1MSwgdTIpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRTY29yZSh4QSwgc2FtcGxlQikge1xuICAgICAgICByZXR1cm4gXy5yZWR1Y2Uoc2FtcGxlQiwgZnVuY3Rpb24odG90YWwsIHhCKSB7XG4gICAgICAgICAgcmV0dXJuIHRvdGFsICsgKHhCID4geEEgPyAwIDogeEIgPCB4QSA/IDEgOiAwLjUpO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0VShzYW1wbGVBLCBzYW1wbGVCKSB7XG4gICAgICAgIHJldHVybiBfLnJlZHVjZShzYW1wbGVBLCBmdW5jdGlvbih0b3RhbCwgeEEpIHtcbiAgICAgICAgICByZXR1cm4gdG90YWwgKyBnZXRTY29yZSh4QSwgc2FtcGxlQik7XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRaKHUpIHtcbiAgICAgICAgcmV0dXJuICh1IC0gKChzaXplMSAqIHNpemUyKSAvIDIpKSAvIHNxcnQoKHNpemUxICogc2l6ZTIgKiAoc2l6ZTEgKyBzaXplMiArIDEpKSAvIDEyKTtcbiAgICAgIH1cbiAgICAgIC8vIFJlamVjdCB0aGUgbnVsbCBoeXBvdGhlc2lzIHRoZSB0d28gc2FtcGxlcyBjb21lIGZyb20gdGhlXG4gICAgICAvLyBzYW1lIHBvcHVsYXRpb24gKGkuZS4gaGF2ZSB0aGUgc2FtZSBtZWRpYW4pIGlmLi4uXG4gICAgICBpZiAoc2l6ZTEgKyBzaXplMiA+IDMwKSB7XG4gICAgICAgIC8vIC4uLnRoZSB6LXN0YXQgaXMgZ3JlYXRlciB0aGFuIDEuOTYgb3IgbGVzcyB0aGFuIC0xLjk2XG4gICAgICAgIC8vIGh0dHA6Ly93d3cuc3RhdGlzdGljc2xlY3R1cmVzLmNvbS90b3BpY3MvbWFubndoaXRuZXl1L1xuICAgICAgICB6U3RhdCA9IGdldFoodSk7XG4gICAgICAgIHJldHVybiBhYnMoelN0YXQpID4gMS45NiA/ICh1ID09IHUxID8gMSA6IC0xKSA6IDA7XG4gICAgICB9XG4gICAgICAvLyAuLi50aGUgVSB2YWx1ZSBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdGhlIGNyaXRpY2FsIFUgdmFsdWUuXG4gICAgICBjcml0aWNhbCA9IG1heFNpemUgPCA1IHx8IG1pblNpemUgPCAzID8gMCA6IHVUYWJsZVttYXhTaXplXVttaW5TaXplIC0gM107XG4gICAgICByZXR1cm4gdSA8PSBjcml0aWNhbCA/ICh1ID09IHUxID8gMSA6IC0xKSA6IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgcHJvcGVydGllcyBhbmQgYWJvcnQgaWYgcnVubmluZy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcztcbiAgICAgIGlmIChiZW5jaC5ydW5uaW5nICYmICFjYWxsZWRCeS5hYm9ydCkge1xuICAgICAgICAvLyBObyB3b3JyaWVzLCBgcmVzZXQoKWAgaXMgY2FsbGVkIHdpdGhpbiBgYWJvcnQoKWAuXG4gICAgICAgIGNhbGxlZEJ5LnJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgYmVuY2guYWJvcnQoKTtcbiAgICAgICAgZGVsZXRlIGNhbGxlZEJ5LnJlc2V0O1xuICAgICAgICByZXR1cm4gYmVuY2g7XG4gICAgICB9XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICAgIGNoYW5nZXMgPSBbXSxcbiAgICAgICAgICBxdWV1ZSA9IFtdO1xuXG4gICAgICAvLyBBIG5vbi1yZWN1cnNpdmUgc29sdXRpb24gdG8gY2hlY2sgaWYgcHJvcGVydGllcyBoYXZlIGNoYW5nZWQuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL3d3dy5qc2xhYi5kay9hcnRpY2xlcy9ub24ucmVjdXJzaXZlLnByZW9yZGVyLnRyYXZlcnNhbC5wYXJ0NC5cbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAnZGVzdGluYXRpb24nOiBiZW5jaCxcbiAgICAgICAgJ3NvdXJjZSc6IF8uYXNzaWduKHt9LCBjbG9uZURlZXAoYmVuY2guY29uc3RydWN0b3IucHJvdG90eXBlKSwgY2xvbmVEZWVwKGJlbmNoLm9wdGlvbnMpKVxuICAgICAgfTtcblxuICAgICAgZG8ge1xuICAgICAgICBfLmZvck93bihkYXRhLnNvdXJjZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgIHZhciBjaGFuZ2VkLFxuICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IGRhdGEuZGVzdGluYXRpb24sXG4gICAgICAgICAgICAgIGN1cnJWYWx1ZSA9IGRlc3RpbmF0aW9uW2tleV07XG5cbiAgICAgICAgICAvLyBTa2lwIHBzZXVkbyBwcml2YXRlIHByb3BlcnRpZXMgbGlrZSBgX3RpbWVySWRgIHdoaWNoIGNvdWxkIGJlIGFcbiAgICAgICAgICAvLyBKYXZhIG9iamVjdCBpbiBlbnZpcm9ubWVudHMgbGlrZSBSaW5nb0pTLlxuICAgICAgICAgIGlmIChrZXkuY2hhckF0KDApID09ICdfJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhbiBhcnJheSB2YWx1ZSBoYXMgY2hhbmdlZCB0byBhIG5vbi1hcnJheSB2YWx1ZS5cbiAgICAgICAgICAgICAgaWYgKCFfLmlzQXJyYXkoY3VyclZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZWQgPSBjdXJyVmFsdWUgPSBbXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhbiBhcnJheSBoYXMgY2hhbmdlZCBpdHMgbGVuZ3RoLlxuICAgICAgICAgICAgICBpZiAoY3VyclZhbHVlLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VkID0gY3VyclZhbHVlID0gY3VyclZhbHVlLnNsaWNlKDAsIHZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY3VyclZhbHVlLmxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW4gb2JqZWN0IGhhcyBjaGFuZ2VkIHRvIGEgbm9uLW9iamVjdCB2YWx1ZS5cbiAgICAgICAgICAgIGVsc2UgaWYgKCFjdXJyVmFsdWUgfHwgdHlwZW9mIGN1cnJWYWx1ZSAhPSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICBjaGFuZ2VkID0gY3VyclZhbHVlID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZWdpc3RlciBhIGNoYW5nZWQgb2JqZWN0LlxuICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHsgJ2Rlc3RpbmF0aW9uJzogZGVzdGluYXRpb24sICdrZXknOiBrZXksICd2YWx1ZSc6IGN1cnJWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLnB1c2goeyAnZGVzdGluYXRpb24nOiBjdXJyVmFsdWUsICdzb3VyY2UnOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUmVnaXN0ZXIgYSBjaGFuZ2VkIHByaW1pdGl2ZS5cbiAgICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPT0gY3VyclZhbHVlICYmICEodmFsdWUgPT0gbnVsbCB8fCBfLmlzRnVuY3Rpb24odmFsdWUpKSkge1xuICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHsgJ2Rlc3RpbmF0aW9uJzogZGVzdGluYXRpb24sICdrZXknOiBrZXksICd2YWx1ZSc6IHZhbHVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB3aGlsZSAoKGRhdGEgPSBxdWV1ZVtpbmRleCsrXSkpO1xuXG4gICAgICAvLyBJZiBjaGFuZ2VkIGVtaXQgdGhlIGByZXNldGAgZXZlbnQgYW5kIGlmIGl0IGlzbid0IGNhbmNlbGxlZCByZXNldCB0aGUgYmVuY2htYXJrLlxuICAgICAgaWYgKGNoYW5nZXMubGVuZ3RoICYmIChiZW5jaC5lbWl0KGV2ZW50ID0gRXZlbnQoJ3Jlc2V0JykpLCAhZXZlbnQuY2FuY2VsbGVkKSkge1xuICAgICAgICBfLmVhY2goY2hhbmdlcywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGRhdGEuZGVzdGluYXRpb25bZGF0YS5rZXldID0gZGF0YS52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVuY2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheXMgcmVsZXZhbnQgYmVuY2htYXJrIGluZm9ybWF0aW9uIHdoZW4gY29lcmNlZCB0byBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHRvU3RyaW5nXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9TdHJpbmdCZW5jaCgpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXMsXG4gICAgICAgICAgZXJyb3IgPSBiZW5jaC5lcnJvcixcbiAgICAgICAgICBoeiA9IGJlbmNoLmh6LFxuICAgICAgICAgIGlkID0gYmVuY2guaWQsXG4gICAgICAgICAgc3RhdHMgPSBiZW5jaC5zdGF0cyxcbiAgICAgICAgICBzaXplID0gc3RhdHMuc2FtcGxlLmxlbmd0aCxcbiAgICAgICAgICBwbSA9ICdcXHhiMScsXG4gICAgICAgICAgcmVzdWx0ID0gYmVuY2gubmFtZSB8fCAoXy5pc05hTihpZCkgPyBpZCA6ICc8VGVzdCAjJyArIGlkICsgJz4nKTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHZhciBlcnJvclN0cjtcbiAgICAgICAgaWYgKCFfLmlzT2JqZWN0KGVycm9yKSkge1xuICAgICAgICAgIGVycm9yU3RyID0gU3RyaW5nKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmICghXy5pc0Vycm9yKEVycm9yKSkge1xuICAgICAgICAgIGVycm9yU3RyID0gam9pbihlcnJvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXJyb3IjbmFtZSBhbmQgRXJyb3IjbWVzc2FnZSBwcm9wZXJ0aWVzIGFyZSBub24tZW51bWVyYWJsZS5cbiAgICAgICAgICBlcnJvclN0ciA9IGpvaW4oXy5hc3NpZ24oeyAnbmFtZSc6IGVycm9yLm5hbWUsICdtZXNzYWdlJzogZXJyb3IubWVzc2FnZSB9LCBlcnJvcikpO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSAnOiAnICsgZXJyb3JTdHI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0ICs9ICcgeCAnICsgZm9ybWF0TnVtYmVyKGh6LnRvRml4ZWQoaHogPCAxMDAgPyAyIDogMCkpICsgJyBvcHMvc2VjICcgKyBwbSArXG4gICAgICAgICAgc3RhdHMucm1lLnRvRml4ZWQoMikgKyAnJSAoJyArIHNpemUgKyAnIHJ1bicgKyAoc2l6ZSA9PSAxID8gJycgOiAncycpICsgJyBzYW1wbGVkKSc7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENsb2NrcyB0aGUgdGltZSB0YWtlbiB0byBleGVjdXRlIGEgdGVzdCBwZXIgY3ljbGUgKHNlY3MpLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYmVuY2ggVGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgdGltZSB0YWtlbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbG9jaygpIHtcbiAgICAgIHZhciBvcHRpb25zID0gQmVuY2htYXJrLm9wdGlvbnMsXG4gICAgICAgICAgdGVtcGxhdGVEYXRhID0ge30sXG4gICAgICAgICAgdGltZXJzID0gW3sgJ25zJzogdGltZXIubnMsICdyZXMnOiBtYXgoMC4wMDE1LCBnZXRSZXMoJ21zJykpLCAndW5pdCc6ICdtcycgfV07XG5cbiAgICAgIC8vIExhenkgZGVmaW5lIGZvciBoaS1yZXMgdGltZXJzLlxuICAgICAgY2xvY2sgPSBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICB2YXIgZGVmZXJyZWQ7XG5cbiAgICAgICAgaWYgKGNsb25lIGluc3RhbmNlb2YgRGVmZXJyZWQpIHtcbiAgICAgICAgICBkZWZlcnJlZCA9IGNsb25lO1xuICAgICAgICAgIGNsb25lID0gZGVmZXJyZWQuYmVuY2htYXJrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBiZW5jaCA9IGNsb25lLl9vcmlnaW5hbCxcbiAgICAgICAgICAgIHN0cmluZ2FibGUgPSBpc1N0cmluZ2FibGUoYmVuY2guZm4pLFxuICAgICAgICAgICAgY291bnQgPSBiZW5jaC5jb3VudCA9IGNsb25lLmNvdW50LFxuICAgICAgICAgICAgZGVjb21waWxhYmxlID0gc3RyaW5nYWJsZSB8fCAoc3VwcG9ydC5kZWNvbXBpbGF0aW9uICYmIChjbG9uZS5zZXR1cCAhPT0gXy5ub29wIHx8IGNsb25lLnRlYXJkb3duICE9PSBfLm5vb3ApKSxcbiAgICAgICAgICAgIGlkID0gYmVuY2guaWQsXG4gICAgICAgICAgICBuYW1lID0gYmVuY2gubmFtZSB8fCAodHlwZW9mIGlkID09ICdudW1iZXInID8gJzxUZXN0ICMnICsgaWQgKyAnPicgOiBpZCksXG4gICAgICAgICAgICByZXN1bHQgPSAwO1xuXG4gICAgICAgIC8vIEluaXQgYG1pblRpbWVgIGlmIG5lZWRlZC5cbiAgICAgICAgY2xvbmUubWluVGltZSA9IGJlbmNoLm1pblRpbWUgfHwgKGJlbmNoLm1pblRpbWUgPSBiZW5jaC5vcHRpb25zLm1pblRpbWUgPSBvcHRpb25zLm1pblRpbWUpO1xuXG4gICAgICAgIC8vIENvbXBpbGUgaW4gc2V0dXAvdGVhcmRvd24gZnVuY3Rpb25zIGFuZCB0aGUgdGVzdCBsb29wLlxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcGlsZWQgdGVzdCwgaW5zdGVhZCBvZiB1c2luZyB0aGUgY2FjaGVkIGBiZW5jaC5jb21waWxlZGAsXG4gICAgICAgIC8vIHRvIGF2b2lkIHBvdGVudGlhbCBlbmdpbmUgb3B0aW1pemF0aW9ucyBlbmFibGVkIG92ZXIgdGhlIGxpZmUgb2YgdGhlIHRlc3QuXG4gICAgICAgIHZhciBmdW5jQm9keSA9IGRlZmVycmVkXG4gICAgICAgICAgPyAndmFyIGQjPXRoaXMsJHtmbkFyZ309ZCMsbSM9ZCMuYmVuY2htYXJrLl9vcmlnaW5hbCxmIz1tIy5mbixzdSM9bSMuc2V0dXAsdGQjPW0jLnRlYXJkb3duOycgK1xuICAgICAgICAgICAgLy8gV2hlbiBgZGVmZXJyZWQuY3ljbGVzYCBpcyBgMGAgdGhlbi4uLlxuICAgICAgICAgICAgJ2lmKCFkIy5jeWNsZXMpeycgK1xuICAgICAgICAgICAgLy8gc2V0IGBkZWZlcnJlZC5mbmAsXG4gICAgICAgICAgICAnZCMuZm49ZnVuY3Rpb24oKXt2YXIgJHtmbkFyZ309ZCM7aWYodHlwZW9mIGYjPT1cImZ1bmN0aW9uXCIpe3RyeXske2ZufVxcbn1jYXRjaChlIyl7ZiMoZCMpfX1lbHNleyR7Zm59XFxufX07JyArXG4gICAgICAgICAgICAvLyBzZXQgYGRlZmVycmVkLnRlYXJkb3duYCxcbiAgICAgICAgICAgICdkIy50ZWFyZG93bj1mdW5jdGlvbigpe2QjLmN5Y2xlcz0wO2lmKHR5cGVvZiB0ZCM9PVwiZnVuY3Rpb25cIil7dHJ5eyR7dGVhcmRvd259XFxufWNhdGNoKGUjKXt0ZCMoKX19ZWxzZXske3RlYXJkb3dufVxcbn19OycgK1xuICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgYmVuY2htYXJrJ3MgYHNldHVwYCxcbiAgICAgICAgICAgICdpZih0eXBlb2Ygc3UjPT1cImZ1bmN0aW9uXCIpe3RyeXske3NldHVwfVxcbn1jYXRjaChlIyl7c3UjKCl9fWVsc2V7JHtzZXR1cH1cXG59OycgK1xuICAgICAgICAgICAgLy8gc3RhcnQgdGltZXIsXG4gICAgICAgICAgICAndCMuc3RhcnQoZCMpOycgK1xuICAgICAgICAgICAgLy8gYW5kIHRoZW4gZXhlY3V0ZSBgZGVmZXJyZWQuZm5gIGFuZCByZXR1cm4gYSBkdW1teSBvYmplY3QuXG4gICAgICAgICAgICAnfWQjLmZuKCk7cmV0dXJue3VpZDpcIiR7dWlkfVwifSdcblxuICAgICAgICAgIDogJ3ZhciByIyxzIyxtIz10aGlzLGYjPW0jLmZuLGkjPW0jLmNvdW50LG4jPXQjLm5zOyR7c2V0dXB9XFxuJHtiZWdpbn07JyArXG4gICAgICAgICAgICAnd2hpbGUoaSMtLSl7JHtmbn1cXG59JHtlbmR9OyR7dGVhcmRvd259XFxucmV0dXJue2VsYXBzZWQ6ciMsdWlkOlwiJHt1aWR9XCJ9JztcblxuICAgICAgICB2YXIgY29tcGlsZWQgPSBiZW5jaC5jb21waWxlZCA9IGNsb25lLmNvbXBpbGVkID0gY3JlYXRlQ29tcGlsZWQoYmVuY2gsIGRlY29tcGlsYWJsZSwgZGVmZXJyZWQsIGZ1bmNCb2R5KSxcbiAgICAgICAgICAgIGlzRW1wdHkgPSAhKHRlbXBsYXRlRGF0YS5mbiB8fCBzdHJpbmdhYmxlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICAgICAgICAvLyBGaXJlZm94IG1heSByZW1vdmUgZGVhZCBjb2RlIGZyb20gYEZ1bmN0aW9uI3RvU3RyaW5nYCByZXN1bHRzLlxuICAgICAgICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHA6Ly9idWd6aWwubGEvNTM2MDg1LlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdGVzdCBcIicgKyBuYW1lICsgJ1wiIGlzIGVtcHR5LiBUaGlzIG1heSBiZSB0aGUgcmVzdWx0IG9mIGRlYWQgY29kZSByZW1vdmFsLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmICghZGVmZXJyZWQpIHtcbiAgICAgICAgICAgIC8vIFByZXRlc3QgdG8gZGV0ZXJtaW5lIGlmIGNvbXBpbGVkIGNvZGUgZXhpdHMgZWFybHksIHVzdWFsbHkgYnkgYVxuICAgICAgICAgICAgLy8gcm9ndWUgYHJldHVybmAgc3RhdGVtZW50LCBieSBjaGVja2luZyBmb3IgYSByZXR1cm4gb2JqZWN0IHdpdGggdGhlIHVpZC5cbiAgICAgICAgICAgIGJlbmNoLmNvdW50ID0gMTtcbiAgICAgICAgICAgIGNvbXBpbGVkID0gZGVjb21waWxhYmxlICYmIChjb21waWxlZC5jYWxsKGJlbmNoLCBjb250ZXh0LCB0aW1lcikgfHwge30pLnVpZCA9PSB0ZW1wbGF0ZURhdGEudWlkICYmIGNvbXBpbGVkO1xuICAgICAgICAgICAgYmVuY2guY291bnQgPSBjb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIGNvbXBpbGVkID0gbnVsbDtcbiAgICAgICAgICBjbG9uZS5lcnJvciA9IGUgfHwgbmV3IEVycm9yKFN0cmluZyhlKSk7XG4gICAgICAgICAgYmVuY2guY291bnQgPSBjb3VudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBGYWxsYmFjayB3aGVuIGEgdGVzdCBleGl0cyBlYXJseSBvciBlcnJvcnMgZHVyaW5nIHByZXRlc3QuXG4gICAgICAgIGlmICghY29tcGlsZWQgJiYgIWRlZmVycmVkICYmICFpc0VtcHR5KSB7XG4gICAgICAgICAgZnVuY0JvZHkgPSAoXG4gICAgICAgICAgICBzdHJpbmdhYmxlIHx8IChkZWNvbXBpbGFibGUgJiYgIWNsb25lLmVycm9yKVxuICAgICAgICAgICAgICA/ICdmdW5jdGlvbiBmIygpeyR7Zm59XFxufXZhciByIyxzIyxtIz10aGlzLGkjPW0jLmNvdW50J1xuICAgICAgICAgICAgICA6ICd2YXIgciMscyMsbSM9dGhpcyxmIz1tIy5mbixpIz1tIy5jb3VudCdcbiAgICAgICAgICAgICkgK1xuICAgICAgICAgICAgJyxuIz10Iy5uczske3NldHVwfVxcbiR7YmVnaW59O20jLmYjPWYjO3doaWxlKGkjLS0pe20jLmYjKCl9JHtlbmR9OycgK1xuICAgICAgICAgICAgJ2RlbGV0ZSBtIy5mIzske3RlYXJkb3dufVxcbnJldHVybntlbGFwc2VkOnIjfSc7XG5cbiAgICAgICAgICBjb21waWxlZCA9IGNyZWF0ZUNvbXBpbGVkKGJlbmNoLCBkZWNvbXBpbGFibGUsIGRlZmVycmVkLCBmdW5jQm9keSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gUHJldGVzdCBvbmUgbW9yZSB0aW1lIHRvIGNoZWNrIGZvciBlcnJvcnMuXG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IDE7XG4gICAgICAgICAgICBjb21waWxlZC5jYWxsKGJlbmNoLCBjb250ZXh0LCB0aW1lcik7XG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IGNvdW50O1xuICAgICAgICAgICAgZGVsZXRlIGNsb25lLmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IGNvdW50O1xuICAgICAgICAgICAgaWYgKCFjbG9uZS5lcnJvcikge1xuICAgICAgICAgICAgICBjbG9uZS5lcnJvciA9IGUgfHwgbmV3IEVycm9yKFN0cmluZyhlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vIGVycm9ycyBydW4gdGhlIGZ1bGwgdGVzdCBsb29wLlxuICAgICAgICBpZiAoIWNsb25lLmVycm9yKSB7XG4gICAgICAgICAgY29tcGlsZWQgPSBiZW5jaC5jb21waWxlZCA9IGNsb25lLmNvbXBpbGVkID0gY3JlYXRlQ29tcGlsZWQoYmVuY2gsIGRlY29tcGlsYWJsZSwgZGVmZXJyZWQsIGZ1bmNCb2R5KTtcbiAgICAgICAgICByZXN1bHQgPSBjb21waWxlZC5jYWxsKGRlZmVycmVkIHx8IGJlbmNoLCBjb250ZXh0LCB0aW1lcikuZWxhcHNlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcblxuICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgY29tcGlsZWQgZnVuY3Rpb24gZnJvbSB0aGUgZ2l2ZW4gZnVuY3Rpb24gYGJvZHlgLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGVDb21waWxlZChiZW5jaCwgZGVjb21waWxhYmxlLCBkZWZlcnJlZCwgYm9keSkge1xuICAgICAgICB2YXIgZm4gPSBiZW5jaC5mbixcbiAgICAgICAgICAgIGZuQXJnID0gZGVmZXJyZWQgPyBnZXRGaXJzdEFyZ3VtZW50KGZuKSB8fCAnZGVmZXJyZWQnIDogJyc7XG5cbiAgICAgICAgdGVtcGxhdGVEYXRhLnVpZCA9IHVpZCArIHVpZENvdW50ZXIrKztcblxuICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAnc2V0dXAnOiBkZWNvbXBpbGFibGUgPyBnZXRTb3VyY2UoYmVuY2guc2V0dXApIDogaW50ZXJwb2xhdGUoJ20jLnNldHVwKCknKSxcbiAgICAgICAgICAnZm4nOiBkZWNvbXBpbGFibGUgPyBnZXRTb3VyY2UoZm4pIDogaW50ZXJwb2xhdGUoJ20jLmZuKCcgKyBmbkFyZyArICcpJyksXG4gICAgICAgICAgJ2ZuQXJnJzogZm5BcmcsXG4gICAgICAgICAgJ3RlYXJkb3duJzogZGVjb21waWxhYmxlID8gZ2V0U291cmNlKGJlbmNoLnRlYXJkb3duKSA6IGludGVycG9sYXRlKCdtIy50ZWFyZG93bigpJylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVXNlIEFQSSBvZiBjaG9zZW4gdGltZXIuXG4gICAgICAgIGlmICh0aW1lci51bml0ID09ICducycpIHtcbiAgICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAgICdiZWdpbic6IGludGVycG9sYXRlKCdzIz1uIygpJyksXG4gICAgICAgICAgICAnZW5kJzogaW50ZXJwb2xhdGUoJ3IjPW4jKHMjKTtyIz1yI1swXSsociNbMV0vMWU5KScpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGltZXIudW5pdCA9PSAndXMnKSB7XG4gICAgICAgICAgaWYgKHRpbWVyLm5zLnN0b3ApIHtcbiAgICAgICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICAgICAnYmVnaW4nOiBpbnRlcnBvbGF0ZSgncyM9biMuc3RhcnQoKScpLFxuICAgICAgICAgICAgICAnZW5kJzogaW50ZXJwb2xhdGUoJ3IjPW4jLm1pY3Jvc2Vjb25kcygpLzFlNicpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgICAgICdiZWdpbic6IGludGVycG9sYXRlKCdzIz1uIygpJyksXG4gICAgICAgICAgICAgICdlbmQnOiBpbnRlcnBvbGF0ZSgnciM9KG4jKCktcyMpLzFlNicpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGltZXIubnMubm93KSB7XG4gICAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgICAnYmVnaW4nOiBpbnRlcnBvbGF0ZSgncyM9biMubm93KCknKSxcbiAgICAgICAgICAgICdlbmQnOiBpbnRlcnBvbGF0ZSgnciM9KG4jLm5vdygpLXMjKS8xZTMnKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICAgJ2JlZ2luJzogaW50ZXJwb2xhdGUoJ3MjPW5ldyBuIygpLmdldFRpbWUoKScpLFxuICAgICAgICAgICAgJ2VuZCc6IGludGVycG9sYXRlKCdyIz0obmV3IG4jKCkuZ2V0VGltZSgpLXMjKS8xZTMnKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIERlZmluZSBgdGltZXJgIG1ldGhvZHMuXG4gICAgICAgIHRpbWVyLnN0YXJ0ID0gY3JlYXRlRnVuY3Rpb24oXG4gICAgICAgICAgaW50ZXJwb2xhdGUoJ28jJyksXG4gICAgICAgICAgaW50ZXJwb2xhdGUoJ3ZhciBuIz10aGlzLm5zLCR7YmVnaW59O28jLmVsYXBzZWQ9MDtvIy50aW1lU3RhbXA9cyMnKVxuICAgICAgICApO1xuXG4gICAgICAgIHRpbWVyLnN0b3AgPSBjcmVhdGVGdW5jdGlvbihcbiAgICAgICAgICBpbnRlcnBvbGF0ZSgnbyMnKSxcbiAgICAgICAgICBpbnRlcnBvbGF0ZSgndmFyIG4jPXRoaXMubnMscyM9byMudGltZVN0YW1wLCR7ZW5kfTtvIy5lbGFwc2VkPXIjJylcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDcmVhdGUgY29tcGlsZWQgdGVzdC5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZ1bmN0aW9uKFxuICAgICAgICAgIGludGVycG9sYXRlKCd3aW5kb3csdCMnKSxcbiAgICAgICAgICAndmFyIGdsb2JhbCA9IHdpbmRvdywgY2xlYXJUaW1lb3V0ID0gZ2xvYmFsLmNsZWFyVGltZW91dCwgc2V0VGltZW91dCA9IGdsb2JhbC5zZXRUaW1lb3V0O1xcbicgK1xuICAgICAgICAgIGludGVycG9sYXRlKGJvZHkpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0cyB0aGUgY3VycmVudCB0aW1lcidzIG1pbmltdW0gcmVzb2x1dGlvbiAoc2VjcykuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGdldFJlcyh1bml0KSB7XG4gICAgICAgIHZhciBtZWFzdXJlZCxcbiAgICAgICAgICAgIGJlZ2luLFxuICAgICAgICAgICAgY291bnQgPSAzMCxcbiAgICAgICAgICAgIGRpdmlzb3IgPSAxZTMsXG4gICAgICAgICAgICBucyA9IHRpbWVyLm5zLFxuICAgICAgICAgICAgc2FtcGxlID0gW107XG5cbiAgICAgICAgLy8gR2V0IGF2ZXJhZ2Ugc21hbGxlc3QgbWVhc3VyYWJsZSB0aW1lLlxuICAgICAgICB3aGlsZSAoY291bnQtLSkge1xuICAgICAgICAgIGlmICh1bml0ID09ICd1cycpIHtcbiAgICAgICAgICAgIGRpdmlzb3IgPSAxZTY7XG4gICAgICAgICAgICBpZiAobnMuc3RvcCkge1xuICAgICAgICAgICAgICBucy5zdGFydCgpO1xuICAgICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9IG5zLm1pY3Jvc2Vjb25kcygpKSkge31cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJlZ2luID0gbnMoKTtcbiAgICAgICAgICAgICAgd2hpbGUgKCEobWVhc3VyZWQgPSBucygpIC0gYmVnaW4pKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmICh1bml0ID09ICducycpIHtcbiAgICAgICAgICAgIGRpdmlzb3IgPSAxZTk7XG4gICAgICAgICAgICBiZWdpbiA9IChiZWdpbiA9IG5zKCkpWzBdICsgKGJlZ2luWzFdIC8gZGl2aXNvcik7XG4gICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9ICgobWVhc3VyZWQgPSBucygpKVswXSArIChtZWFzdXJlZFsxXSAvIGRpdmlzb3IpKSAtIGJlZ2luKSkge31cbiAgICAgICAgICAgIGRpdmlzb3IgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChucy5ub3cpIHtcbiAgICAgICAgICAgIGJlZ2luID0gbnMubm93KCk7XG4gICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9IG5zLm5vdygpIC0gYmVnaW4pKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJlZ2luID0gbmV3IG5zKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgd2hpbGUgKCEobWVhc3VyZWQgPSBuZXcgbnMoKS5nZXRUaW1lKCkgLSBiZWdpbikpIHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENoZWNrIGZvciBicm9rZW4gdGltZXJzLlxuICAgICAgICAgIGlmIChtZWFzdXJlZCA+IDApIHtcbiAgICAgICAgICAgIHNhbXBsZS5wdXNoKG1lYXN1cmVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2FtcGxlLnB1c2goSW5maW5pdHkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENvbnZlcnQgdG8gc2Vjb25kcy5cbiAgICAgICAgcmV0dXJuIGdldE1lYW4oc2FtcGxlKSAvIGRpdmlzb3I7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogSW50ZXJwb2xhdGVzIGEgZ2l2ZW4gdGVtcGxhdGUgc3RyaW5nLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdHJpbmcpIHtcbiAgICAgICAgLy8gUmVwbGFjZXMgYWxsIG9jY3VycmVuY2VzIG9mIGAjYCB3aXRoIGEgdW5pcXVlIG51bWJlciBhbmQgdGVtcGxhdGUgdG9rZW5zIHdpdGggY29udGVudC5cbiAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUoc3RyaW5nLnJlcGxhY2UoL1xcIy9nLCAvXFxkKy8uZXhlYyh0ZW1wbGF0ZURhdGEudWlkKSkpKHRlbXBsYXRlRGF0YSk7XG4gICAgICB9XG5cbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgIC8vIERldGVjdCBDaHJvbWUncyBtaWNyb3NlY29uZCB0aW1lcjpcbiAgICAgIC8vIGVuYWJsZSBiZW5jaG1hcmtpbmcgdmlhIHRoZSAtLWVuYWJsZS1iZW5jaG1hcmtpbmcgY29tbWFuZFxuICAgICAgLy8gbGluZSBzd2l0Y2ggaW4gYXQgbGVhc3QgQ2hyb21lIDcgdG8gdXNlIGNocm9tZS5JbnRlcnZhbFxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCh0aW1lci5ucyA9IG5ldyAoY29udGV4dC5jaHJvbWUgfHwgY29udGV4dC5jaHJvbWl1bSkuSW50ZXJ2YWwpKSB7XG4gICAgICAgICAgdGltZXJzLnB1c2goeyAnbnMnOiB0aW1lci5ucywgJ3Jlcyc6IGdldFJlcygndXMnKSwgJ3VuaXQnOiAndXMnIH0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoKGUpIHt9XG5cbiAgICAgIC8vIERldGVjdCBOb2RlLmpzJ3MgbmFub3NlY29uZCByZXNvbHV0aW9uIHRpbWVyIGF2YWlsYWJsZSBpbiBOb2RlLmpzID49IDAuOC5cbiAgICAgIGlmIChwcm9jZXNzT2JqZWN0ICYmIHR5cGVvZiAodGltZXIubnMgPSBwcm9jZXNzT2JqZWN0LmhydGltZSkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aW1lcnMucHVzaCh7ICducyc6IHRpbWVyLm5zLCAncmVzJzogZ2V0UmVzKCducycpLCAndW5pdCc6ICducycgfSk7XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgV2FkZSBTaW1tb25zJyBOb2RlLmpzIGBtaWNyb3RpbWVgIG1vZHVsZS5cbiAgICAgIGlmIChtaWNyb3RpbWVPYmplY3QgJiYgdHlwZW9mICh0aW1lci5ucyA9IG1pY3JvdGltZU9iamVjdC5ub3cpID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGltZXJzLnB1c2goeyAnbnMnOiB0aW1lci5ucywgICdyZXMnOiBnZXRSZXMoJ3VzJyksICd1bml0JzogJ3VzJyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIFBpY2sgdGltZXIgd2l0aCBoaWdoZXN0IHJlc29sdXRpb24uXG4gICAgICB0aW1lciA9IF8ubWluQnkodGltZXJzLCAncmVzJyk7XG5cbiAgICAgIC8vIEVycm9yIGlmIHRoZXJlIGFyZSBubyB3b3JraW5nIHRpbWVycy5cbiAgICAgIGlmICh0aW1lci5yZXMgPT0gSW5maW5pdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCZW5jaG1hcmsuanMgd2FzIHVuYWJsZSB0byBmaW5kIGEgd29ya2luZyB0aW1lci4nKTtcbiAgICAgIH1cbiAgICAgIC8vIFJlc29sdmUgdGltZSBzcGFuIHJlcXVpcmVkIHRvIGFjaGlldmUgYSBwZXJjZW50IHVuY2VydGFpbnR5IG9mIGF0IG1vc3QgMSUuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL3NwaWZmLnJpdC5lZHUvY2xhc3Nlcy9waHlzMjczL3VuY2VydC91bmNlcnQuaHRtbC5cbiAgICAgIG9wdGlvbnMubWluVGltZSB8fCAob3B0aW9ucy5taW5UaW1lID0gbWF4KHRpbWVyLnJlcyAvIDIgLyAwLjAxLCAwLjA1KSk7XG4gICAgICByZXR1cm4gY2xvY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyBzdGF0cyBvbiBiZW5jaG1hcmsgcmVzdWx0cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJlbmNoIFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXB1dGUoYmVuY2gsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cbiAgICAgIHZhciBhc3luYyA9IG9wdGlvbnMuYXN5bmMsXG4gICAgICAgICAgZWxhcHNlZCA9IDAsXG4gICAgICAgICAgaW5pdENvdW50ID0gYmVuY2guaW5pdENvdW50LFxuICAgICAgICAgIG1pblNhbXBsZXMgPSBiZW5jaC5taW5TYW1wbGVzLFxuICAgICAgICAgIHF1ZXVlID0gW10sXG4gICAgICAgICAgc2FtcGxlID0gYmVuY2guc3RhdHMuc2FtcGxlO1xuXG4gICAgICAvKipcbiAgICAgICAqIEFkZHMgYSBjbG9uZSB0byB0aGUgcXVldWUuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGVucXVldWUoKSB7XG4gICAgICAgIHF1ZXVlLnB1c2goYmVuY2guY2xvbmUoe1xuICAgICAgICAgICdfb3JpZ2luYWwnOiBiZW5jaCxcbiAgICAgICAgICAnZXZlbnRzJzoge1xuICAgICAgICAgICAgJ2Fib3J0JzogW3VwZGF0ZV0sXG4gICAgICAgICAgICAnY3ljbGUnOiBbdXBkYXRlXSxcbiAgICAgICAgICAgICdlcnJvcic6IFt1cGRhdGVdLFxuICAgICAgICAgICAgJ3N0YXJ0JzogW3VwZGF0ZV1cbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBVcGRhdGVzIHRoZSBjbG9uZS9vcmlnaW5hbCBiZW5jaG1hcmtzIHRvIGtlZXAgdGhlaXIgZGF0YSBpbiBzeW5jLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiB1cGRhdGUoZXZlbnQpIHtcbiAgICAgICAgdmFyIGNsb25lID0gdGhpcyxcbiAgICAgICAgICAgIHR5cGUgPSBldmVudC50eXBlO1xuXG4gICAgICAgIGlmIChiZW5jaC5ydW5uaW5nKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgLy8gTm90ZTogYGNsb25lLm1pblRpbWVgIHByb3AgaXMgaW5pdGVkIGluIGBjbG9jaygpYC5cbiAgICAgICAgICAgIGNsb25lLmNvdW50ID0gYmVuY2guaW5pdENvdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgYmVuY2guZXJyb3IgPSBjbG9uZS5lcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09ICdhYm9ydCcpIHtcbiAgICAgICAgICAgICAgYmVuY2guYWJvcnQoKTtcbiAgICAgICAgICAgICAgYmVuY2guZW1pdCgnY3ljbGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBldmVudC50YXJnZXQgPSBiZW5jaDtcbiAgICAgICAgICAgICAgYmVuY2guZW1pdChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGJlbmNoLmFib3J0ZWQpIHtcbiAgICAgICAgICAvLyBDbGVhciBhYm9ydCBsaXN0ZW5lcnMgdG8gYXZvaWQgdHJpZ2dlcmluZyBiZW5jaCdzIGFib3J0L2N5Y2xlIGFnYWluLlxuICAgICAgICAgIGNsb25lLmV2ZW50cy5hYm9ydC5sZW5ndGggPSAwO1xuICAgICAgICAgIGNsb25lLmFib3J0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlcm1pbmVzIGlmIG1vcmUgY2xvbmVzIHNob3VsZCBiZSBxdWV1ZWQgb3IgaWYgY3ljbGluZyBzaG91bGQgc3RvcC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZXZhbHVhdGUoZXZlbnQpIHtcbiAgICAgICAgdmFyIGNyaXRpY2FsLFxuICAgICAgICAgICAgZGYsXG4gICAgICAgICAgICBtZWFuLFxuICAgICAgICAgICAgbW9lLFxuICAgICAgICAgICAgcm1lLFxuICAgICAgICAgICAgc2QsXG4gICAgICAgICAgICBzZW0sXG4gICAgICAgICAgICB2YXJpYW5jZSxcbiAgICAgICAgICAgIGNsb25lID0gZXZlbnQudGFyZ2V0LFxuICAgICAgICAgICAgZG9uZSA9IGJlbmNoLmFib3J0ZWQsXG4gICAgICAgICAgICBub3cgPSBfLm5vdygpLFxuICAgICAgICAgICAgc2l6ZSA9IHNhbXBsZS5wdXNoKGNsb25lLnRpbWVzLnBlcmlvZCksXG4gICAgICAgICAgICBtYXhlZE91dCA9IHNpemUgPj0gbWluU2FtcGxlcyAmJiAoZWxhcHNlZCArPSBub3cgLSBjbG9uZS50aW1lcy50aW1lU3RhbXApIC8gMWUzID4gYmVuY2gubWF4VGltZSxcbiAgICAgICAgICAgIHRpbWVzID0gYmVuY2gudGltZXMsXG4gICAgICAgICAgICB2YXJPZiA9IGZ1bmN0aW9uKHN1bSwgeCkgeyByZXR1cm4gc3VtICsgcG93KHggLSBtZWFuLCAyKTsgfTtcblxuICAgICAgICAvLyBFeGl0IGVhcmx5IGZvciBhYm9ydGVkIG9yIHVuY2xvY2thYmxlIHRlc3RzLlxuICAgICAgICBpZiAoZG9uZSB8fCBjbG9uZS5oeiA9PSBJbmZpbml0eSkge1xuICAgICAgICAgIG1heGVkT3V0ID0gIShzaXplID0gc2FtcGxlLmxlbmd0aCA9IHF1ZXVlLmxlbmd0aCA9IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIG1lYW4gKGVzdGltYXRlIG9mIHRoZSBwb3B1bGF0aW9uIG1lYW4pLlxuICAgICAgICAgIG1lYW4gPSBnZXRNZWFuKHNhbXBsZSk7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIHZhcmlhbmNlIChlc3RpbWF0ZSBvZiB0aGUgcG9wdWxhdGlvbiB2YXJpYW5jZSkuXG4gICAgICAgICAgdmFyaWFuY2UgPSBfLnJlZHVjZShzYW1wbGUsIHZhck9mLCAwKSAvIChzaXplIC0gMSkgfHwgMDtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uIChlc3RpbWF0ZSBvZiB0aGUgcG9wdWxhdGlvbiBzdGFuZGFyZCBkZXZpYXRpb24pLlxuICAgICAgICAgIHNkID0gc3FydCh2YXJpYW5jZSk7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc3RhbmRhcmQgZXJyb3Igb2YgdGhlIG1lYW4gKGEuay5hLiB0aGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIHRoZSBzYW1wbGluZyBkaXN0cmlidXRpb24gb2YgdGhlIHNhbXBsZSBtZWFuKS5cbiAgICAgICAgICBzZW0gPSBzZCAvIHNxcnQoc2l6ZSk7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgZGVncmVlcyBvZiBmcmVlZG9tLlxuICAgICAgICAgIGRmID0gc2l6ZSAtIDE7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgY3JpdGljYWwgdmFsdWUuXG4gICAgICAgICAgY3JpdGljYWwgPSB0VGFibGVbTWF0aC5yb3VuZChkZikgfHwgMV0gfHwgdFRhYmxlLmluZmluaXR5O1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIG1hcmdpbiBvZiBlcnJvci5cbiAgICAgICAgICBtb2UgPSBzZW0gKiBjcml0aWNhbDtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSByZWxhdGl2ZSBtYXJnaW4gb2YgZXJyb3IuXG4gICAgICAgICAgcm1lID0gKG1vZSAvIG1lYW4pICogMTAwIHx8IDA7XG5cbiAgICAgICAgICBfLmFzc2lnbihiZW5jaC5zdGF0cywge1xuICAgICAgICAgICAgJ2RldmlhdGlvbic6IHNkLFxuICAgICAgICAgICAgJ21lYW4nOiBtZWFuLFxuICAgICAgICAgICAgJ21vZSc6IG1vZSxcbiAgICAgICAgICAgICdybWUnOiBybWUsXG4gICAgICAgICAgICAnc2VtJzogc2VtLFxuICAgICAgICAgICAgJ3ZhcmlhbmNlJzogdmFyaWFuY2VcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIEFib3J0IHRoZSBjeWNsZSBsb29wIHdoZW4gdGhlIG1pbmltdW0gc2FtcGxlIHNpemUgaGFzIGJlZW4gY29sbGVjdGVkXG4gICAgICAgICAgLy8gYW5kIHRoZSBlbGFwc2VkIHRpbWUgZXhjZWVkcyB0aGUgbWF4aW11bSB0aW1lIGFsbG93ZWQgcGVyIGJlbmNobWFyay5cbiAgICAgICAgICAvLyBXZSBkb24ndCBjb3VudCBjeWNsZSBkZWxheXMgdG93YXJkIHRoZSBtYXggdGltZSBiZWNhdXNlIGRlbGF5cyBtYXkgYmVcbiAgICAgICAgICAvLyBpbmNyZWFzZWQgYnkgYnJvd3NlcnMgdGhhdCBjbGFtcCB0aW1lb3V0cyBmb3IgaW5hY3RpdmUgdGFicy4gRm9yIG1vcmVcbiAgICAgICAgICAvLyBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vd2luZG93LnNldFRpbWVvdXQjSW5hY3RpdmVfdGFicy5cbiAgICAgICAgICBpZiAobWF4ZWRPdXQpIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBgaW5pdENvdW50YCBpbiBjYXNlIHRoZSBiZW5jaG1hcmsgaXMgcmVydW4uXG4gICAgICAgICAgICBiZW5jaC5pbml0Q291bnQgPSBpbml0Q291bnQ7XG4gICAgICAgICAgICBiZW5jaC5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHRpbWVzLmVsYXBzZWQgPSAobm93IC0gdGltZXMudGltZVN0YW1wKSAvIDFlMztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJlbmNoLmh6ICE9IEluZmluaXR5KSB7XG4gICAgICAgICAgICBiZW5jaC5oeiA9IDEgLyBtZWFuO1xuICAgICAgICAgICAgdGltZXMuY3ljbGUgPSBtZWFuICogYmVuY2guY291bnQ7XG4gICAgICAgICAgICB0aW1lcy5wZXJpb2QgPSBtZWFuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aW1lIHBlcm1pdHMsIGluY3JlYXNlIHNhbXBsZSBzaXplIHRvIHJlZHVjZSB0aGUgbWFyZ2luIG9mIGVycm9yLlxuICAgICAgICBpZiAocXVldWUubGVuZ3RoIDwgMiAmJiAhbWF4ZWRPdXQpIHtcbiAgICAgICAgICBlbnF1ZXVlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWJvcnQgdGhlIGBpbnZva2VgIGN5Y2xlIHdoZW4gZG9uZS5cbiAgICAgICAgZXZlbnQuYWJvcnRlZCA9IGRvbmU7XG4gICAgICB9XG5cbiAgICAgIC8vIEluaXQgcXVldWUgYW5kIGJlZ2luLlxuICAgICAgZW5xdWV1ZSgpO1xuICAgICAgaW52b2tlKHF1ZXVlLCB7XG4gICAgICAgICduYW1lJzogJ3J1bicsXG4gICAgICAgICdhcmdzJzogeyAnYXN5bmMnOiBhc3luYyB9LFxuICAgICAgICAncXVldWVkJzogdHJ1ZSxcbiAgICAgICAgJ29uQ3ljbGUnOiBldmFsdWF0ZSxcbiAgICAgICAgJ29uQ29tcGxldGUnOiBmdW5jdGlvbigpIHsgYmVuY2guZW1pdCgnY29tcGxldGUnKTsgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ3ljbGVzIGEgYmVuY2htYXJrIHVudGlsIGEgcnVuIGBjb3VudGAgY2FuIGJlIGVzdGFibGlzaGVkLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2xvbmUgVGhlIGNsb25lZCBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGN5Y2xlKGNsb25lLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXG4gICAgICB2YXIgZGVmZXJyZWQ7XG4gICAgICBpZiAoY2xvbmUgaW5zdGFuY2VvZiBEZWZlcnJlZCkge1xuICAgICAgICBkZWZlcnJlZCA9IGNsb25lO1xuICAgICAgICBjbG9uZSA9IGNsb25lLmJlbmNobWFyaztcbiAgICAgIH1cbiAgICAgIHZhciBjbG9ja2VkLFxuICAgICAgICAgIGN5Y2xlcyxcbiAgICAgICAgICBkaXZpc29yLFxuICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgIG1pblRpbWUsXG4gICAgICAgICAgcGVyaW9kLFxuICAgICAgICAgIGFzeW5jID0gb3B0aW9ucy5hc3luYyxcbiAgICAgICAgICBiZW5jaCA9IGNsb25lLl9vcmlnaW5hbCxcbiAgICAgICAgICBjb3VudCA9IGNsb25lLmNvdW50LFxuICAgICAgICAgIHRpbWVzID0gY2xvbmUudGltZXM7XG5cbiAgICAgIC8vIENvbnRpbnVlLCBpZiBub3QgYWJvcnRlZCBiZXR3ZWVuIGN5Y2xlcy5cbiAgICAgIGlmIChjbG9uZS5ydW5uaW5nKSB7XG4gICAgICAgIC8vIGBtaW5UaW1lYCBpcyBzZXQgdG8gYEJlbmNobWFyay5vcHRpb25zLm1pblRpbWVgIGluIGBjbG9jaygpYC5cbiAgICAgICAgY3ljbGVzID0gKytjbG9uZS5jeWNsZXM7XG4gICAgICAgIGNsb2NrZWQgPSBkZWZlcnJlZCA/IGRlZmVycmVkLmVsYXBzZWQgOiBjbG9jayhjbG9uZSk7XG4gICAgICAgIG1pblRpbWUgPSBjbG9uZS5taW5UaW1lO1xuXG4gICAgICAgIGlmIChjeWNsZXMgPiBiZW5jaC5jeWNsZXMpIHtcbiAgICAgICAgICBiZW5jaC5jeWNsZXMgPSBjeWNsZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsb25lLmVycm9yKSB7XG4gICAgICAgICAgZXZlbnQgPSBFdmVudCgnZXJyb3InKTtcbiAgICAgICAgICBldmVudC5tZXNzYWdlID0gY2xvbmUuZXJyb3I7XG4gICAgICAgICAgY2xvbmUuZW1pdChldmVudCk7XG4gICAgICAgICAgaWYgKCFldmVudC5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIGNsb25lLmFib3J0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBDb250aW51ZSwgaWYgbm90IGVycm9yZWQuXG4gICAgICBpZiAoY2xvbmUucnVubmluZykge1xuICAgICAgICAvLyBDb21wdXRlIHRoZSB0aW1lIHRha2VuIHRvIGNvbXBsZXRlIGxhc3QgdGVzdCBjeWNsZS5cbiAgICAgICAgYmVuY2gudGltZXMuY3ljbGUgPSB0aW1lcy5jeWNsZSA9IGNsb2NrZWQ7XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHNlY29uZHMgcGVyIG9wZXJhdGlvbi5cbiAgICAgICAgcGVyaW9kID0gYmVuY2gudGltZXMucGVyaW9kID0gdGltZXMucGVyaW9kID0gY2xvY2tlZCAvIGNvdW50O1xuICAgICAgICAvLyBDb21wdXRlIHRoZSBvcHMgcGVyIHNlY29uZC5cbiAgICAgICAgYmVuY2guaHogPSBjbG9uZS5oeiA9IDEgLyBwZXJpb2Q7XG4gICAgICAgIC8vIEF2b2lkIHdvcmtpbmcgb3VyIHdheSB1cCB0byB0aGlzIG5leHQgdGltZS5cbiAgICAgICAgYmVuY2guaW5pdENvdW50ID0gY2xvbmUuaW5pdENvdW50ID0gY291bnQ7XG4gICAgICAgIC8vIERvIHdlIG5lZWQgdG8gZG8gYW5vdGhlciBjeWNsZT9cbiAgICAgICAgY2xvbmUucnVubmluZyA9IGNsb2NrZWQgPCBtaW5UaW1lO1xuXG4gICAgICAgIGlmIChjbG9uZS5ydW5uaW5nKSB7XG4gICAgICAgICAgLy8gVGVzdHMgbWF5IGNsb2NrIGF0IGAwYCB3aGVuIGBpbml0Q291bnRgIGlzIGEgc21hbGwgbnVtYmVyLFxuICAgICAgICAgIC8vIHRvIGF2b2lkIHRoYXQgd2Ugc2V0IGl0cyBjb3VudCB0byBzb21ldGhpbmcgYSBiaXQgaGlnaGVyLlxuICAgICAgICAgIGlmICghY2xvY2tlZCAmJiAoZGl2aXNvciA9IGRpdmlzb3JzW2Nsb25lLmN5Y2xlc10pICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvdW50ID0gZmxvb3IoNGU2IC8gZGl2aXNvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgbWFueSBtb3JlIGl0ZXJhdGlvbnMgaXQgd2lsbCB0YWtlIHRvIGFjaGlldmUgdGhlIGBtaW5UaW1lYC5cbiAgICAgICAgICBpZiAoY291bnQgPD0gY2xvbmUuY291bnQpIHtcbiAgICAgICAgICAgIGNvdW50ICs9IE1hdGguY2VpbCgobWluVGltZSAtIGNsb2NrZWQpIC8gcGVyaW9kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2xvbmUucnVubmluZyA9IGNvdW50ICE9IEluZmluaXR5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBTaG91bGQgd2UgZXhpdCBlYXJseT9cbiAgICAgIGV2ZW50ID0gRXZlbnQoJ2N5Y2xlJyk7XG4gICAgICBjbG9uZS5lbWl0KGV2ZW50KTtcbiAgICAgIGlmIChldmVudC5hYm9ydGVkKSB7XG4gICAgICAgIGNsb25lLmFib3J0KCk7XG4gICAgICB9XG4gICAgICAvLyBGaWd1cmUgb3V0IHdoYXQgdG8gZG8gbmV4dC5cbiAgICAgIGlmIChjbG9uZS5ydW5uaW5nKSB7XG4gICAgICAgIC8vIFN0YXJ0IGEgbmV3IGN5Y2xlLlxuICAgICAgICBjbG9uZS5jb3VudCA9IGNvdW50O1xuICAgICAgICBpZiAoZGVmZXJyZWQpIHtcbiAgICAgICAgICBjbG9uZS5jb21waWxlZC5jYWxsKGRlZmVycmVkLCBjb250ZXh0LCB0aW1lcik7XG4gICAgICAgIH0gZWxzZSBpZiAoYXN5bmMpIHtcbiAgICAgICAgICBkZWxheShjbG9uZSwgZnVuY3Rpb24oKSB7IGN5Y2xlKGNsb25lLCBvcHRpb25zKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3ljbGUoY2xvbmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gRml4IFRyYWNlTW9ua2V5IGJ1ZyBhc3NvY2lhdGVkIHdpdGggY2xvY2sgZmFsbGJhY2tzLlxuICAgICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL2J1Z3ppbC5sYS81MDkwNjkuXG4gICAgICAgIGlmIChzdXBwb3J0LmJyb3dzZXIpIHtcbiAgICAgICAgICBydW5TY3JpcHQodWlkICsgJz0xO2RlbGV0ZSAnICsgdWlkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZSdyZSBkb25lLlxuICAgICAgICBjbG9uZS5lbWl0KCdjb21wbGV0ZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFJ1bnMgdGhlIGJlbmNobWFyay5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlXG4gICAgICogYmVuY2gucnVuKCk7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiBiZW5jaC5ydW4oeyAnYXN5bmMnOiB0cnVlIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJ1bihvcHRpb25zKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzLFxuICAgICAgICAgIGV2ZW50ID0gRXZlbnQoJ3N0YXJ0Jyk7XG5cbiAgICAgIC8vIFNldCBgcnVubmluZ2AgdG8gYGZhbHNlYCBzbyBgcmVzZXQoKWAgd29uJ3QgY2FsbCBgYWJvcnQoKWAuXG4gICAgICBiZW5jaC5ydW5uaW5nID0gZmFsc2U7XG4gICAgICBiZW5jaC5yZXNldCgpO1xuICAgICAgYmVuY2gucnVubmluZyA9IHRydWU7XG5cbiAgICAgIGJlbmNoLmNvdW50ID0gYmVuY2guaW5pdENvdW50O1xuICAgICAgYmVuY2gudGltZXMudGltZVN0YW1wID0gXy5ub3coKTtcbiAgICAgIGJlbmNoLmVtaXQoZXZlbnQpO1xuXG4gICAgICBpZiAoIWV2ZW50LmNhbmNlbGxlZCkge1xuICAgICAgICBvcHRpb25zID0geyAnYXN5bmMnOiAoKG9wdGlvbnMgPSBvcHRpb25zICYmIG9wdGlvbnMuYXN5bmMpID09IG51bGwgPyBiZW5jaC5hc3luYyA6IG9wdGlvbnMpICYmIHN1cHBvcnQudGltZW91dCB9O1xuXG4gICAgICAgIC8vIEZvciBjbG9uZXMgY3JlYXRlZCB3aXRoaW4gYGNvbXB1dGUoKWAuXG4gICAgICAgIGlmIChiZW5jaC5fb3JpZ2luYWwpIHtcbiAgICAgICAgICBpZiAoYmVuY2guZGVmZXIpIHtcbiAgICAgICAgICAgIERlZmVycmVkKGJlbmNoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3ljbGUoYmVuY2gsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBGb3Igb3JpZ2luYWwgYmVuY2htYXJrcy5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29tcHV0ZShiZW5jaCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZW5jaDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBGaXJlZm94IDEgZXJyb25lb3VzbHkgZGVmaW5lcyB2YXJpYWJsZSBhbmQgYXJndW1lbnQgbmFtZXMgb2YgZnVuY3Rpb25zIG9uXG4gICAgLy8gdGhlIGZ1bmN0aW9uIGl0c2VsZiBhcyBub24tY29uZmlndXJhYmxlIHByb3BlcnRpZXMgd2l0aCBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gICAgLy8gVGhlIGJ1Z2dpbmVzcyBjb250aW51ZXMgYXMgdGhlIGBCZW5jaG1hcmtgIGNvbnN0cnVjdG9yIGhhcyBhbiBhcmd1bWVudFxuICAgIC8vIG5hbWVkIGBvcHRpb25zYCBhbmQgRmlyZWZveCAxIHdpbGwgbm90IGFzc2lnbiBhIHZhbHVlIHRvIGBCZW5jaG1hcmsub3B0aW9uc2AsXG4gICAgLy8gbWFraW5nIGl0IG5vbi13cml0YWJsZSBpbiB0aGUgcHJvY2VzcywgdW5sZXNzIGl0IGlzIHRoZSBmaXJzdCBwcm9wZXJ0eVxuICAgIC8vIGFzc2lnbmVkIGJ5IGZvci1pbiBsb29wIG9mIGBfLmFzc2lnbigpYC5cbiAgICBfLmFzc2lnbihCZW5jaG1hcmssIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCBvcHRpb25zIGNvcGllZCBieSBiZW5jaG1hcmsgaW5zdGFuY2VzLlxuICAgICAgICpcbiAgICAgICAqIEBzdGF0aWNcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnb3B0aW9ucyc6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgYmVuY2htYXJrIGN5Y2xlcyB3aWxsIGV4ZWN1dGUgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICogYnkgZGVmYXVsdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICovXG4gICAgICAgICdhc3luYyc6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCB0aGUgYmVuY2htYXJrIGNsb2NrIGlzIGRlZmVycmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKi9cbiAgICAgICAgJ2RlZmVyJzogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBkZWxheSBiZXR3ZWVuIHRlc3QgY3ljbGVzIChzZWNzKS5cbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ2RlbGF5JzogMC4wMDUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXllZCBieSBgQmVuY2htYXJrI3RvU3RyaW5nYCB3aGVuIGEgYG5hbWVgIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgICogKGF1dG8tZ2VuZXJhdGVkIGlmIGFic2VudCkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgICdpZCc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRlZmF1bHQgbnVtYmVyIG9mIHRpbWVzIHRvIGV4ZWN1dGUgYSB0ZXN0IG9uIGEgYmVuY2htYXJrJ3MgZmlyc3QgY3ljbGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdpbml0Q291bnQnOiAxLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbWF4aW11bSB0aW1lIGEgYmVuY2htYXJrIGlzIGFsbG93ZWQgdG8gcnVuIGJlZm9yZSBmaW5pc2hpbmcgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBOb3RlOiBDeWNsZSBkZWxheXMgYXJlbid0IGNvdW50ZWQgdG93YXJkIHRoZSBtYXhpbXVtIHRpbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdtYXhUaW1lJzogNSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1pbmltdW0gc2FtcGxlIHNpemUgcmVxdWlyZWQgdG8gcGVyZm9ybSBzdGF0aXN0aWNhbCBhbmFseXNpcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21pblNhbXBsZXMnOiA1LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGltZSBuZWVkZWQgdG8gcmVkdWNlIHRoZSBwZXJjZW50IHVuY2VydGFpbnR5IG9mIG1lYXN1cmVtZW50IHRvIDElIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21pblRpbWUnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYmVuY2htYXJrLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICAqL1xuICAgICAgICAnbmFtZSc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gZXZlbnQgbGlzdGVuZXIgY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBpcyBhYm9ydGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvbkFib3J0JzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIGNvbXBsZXRlcyBydW5uaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvbkNvbXBsZXRlJzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgYWZ0ZXIgZWFjaCBydW4gY3ljbGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uQ3ljbGUnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIGEgdGVzdCBlcnJvcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uRXJyb3InOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgaXMgcmVzZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uUmVzZXQnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgc3RhcnRzIHJ1bm5pbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uU3RhcnQnOiB1bmRlZmluZWRcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUGxhdGZvcm0gb2JqZWN0IHdpdGggcHJvcGVydGllcyBkZXNjcmliaW5nIHRoaW5ncyBsaWtlIGJyb3dzZXIgbmFtZSxcbiAgICAgICAqIHZlcnNpb24sIGFuZCBvcGVyYXRpbmcgc3lzdGVtLiBTZWUgW2BwbGF0Zm9ybS5qc2BdKGh0dHBzOi8vbXRocy5iZS9wbGF0Zm9ybSkuXG4gICAgICAgKlxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdwbGF0Zm9ybSc6IGNvbnRleHQucGxhdGZvcm0gfHwgcmVxdWlyZSgncGxhdGZvcm0nKSB8fCAoe1xuICAgICAgICAnZGVzY3JpcHRpb24nOiBjb250ZXh0Lm5hdmlnYXRvciAmJiBjb250ZXh0Lm5hdmlnYXRvci51c2VyQWdlbnQgfHwgbnVsbCxcbiAgICAgICAgJ2xheW91dCc6IG51bGwsXG4gICAgICAgICdwcm9kdWN0JzogbnVsbCxcbiAgICAgICAgJ25hbWUnOiBudWxsLFxuICAgICAgICAnbWFudWZhY3R1cmVyJzogbnVsbCxcbiAgICAgICAgJ29zJzogbnVsbCxcbiAgICAgICAgJ3ByZXJlbGVhc2UnOiBudWxsLFxuICAgICAgICAndmVyc2lvbic6IG51bGwsXG4gICAgICAgICd0b1N0cmluZyc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uIHx8ICcnO1xuICAgICAgICB9XG4gICAgICB9KSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuXG4gICAgICAgKlxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKi9cbiAgICAgICd2ZXJzaW9uJzogJzIuMS4yJ1xuICAgIH0pO1xuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLCB7XG4gICAgICAnZmlsdGVyJzogZmlsdGVyLFxuICAgICAgJ2Zvcm1hdE51bWJlcic6IGZvcm1hdE51bWJlcixcbiAgICAgICdpbnZva2UnOiBpbnZva2UsXG4gICAgICAnam9pbic6IGpvaW4sXG4gICAgICAncnVuSW5Db250ZXh0JzogcnVuSW5Db250ZXh0LFxuICAgICAgJ3N1cHBvcnQnOiBzdXBwb3J0XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgbG9kYXNoIG1ldGhvZHMgdG8gQmVuY2htYXJrLlxuICAgIF8uZWFjaChbJ2VhY2gnLCAnZm9yRWFjaCcsICdmb3JPd24nLCAnaGFzJywgJ2luZGV4T2YnLCAnbWFwJywgJ3JlZHVjZSddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICBCZW5jaG1hcmtbbWV0aG9kTmFtZV0gPSBfW21ldGhvZE5hbWVdO1xuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLnByb3RvdHlwZSwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgdGltZXMgYSB0ZXN0IHdhcyBleGVjdXRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2NvdW50JzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGN5Y2xlcyBwZXJmb3JtZWQgd2hpbGUgYmVuY2htYXJraW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnY3ljbGVzJzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGV4ZWN1dGlvbnMgcGVyIHNlY29uZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2h6JzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY29tcGlsZWQgdGVzdCBmdW5jdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258c3RyaW5nfVxuICAgICAgICovXG4gICAgICAnY29tcGlsZWQnOiB1bmRlZmluZWQsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGVycm9yIG9iamVjdCBpZiB0aGUgdGVzdCBmYWlsZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdlcnJvcic6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdGVzdCB0byBiZW5jaG1hcmsuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUge0Z1bmN0aW9ufHN0cmluZ31cbiAgICAgICAqL1xuICAgICAgJ2ZuJzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgYmVuY2htYXJrIGlzIGFib3J0ZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAnYWJvcnRlZCc6IGZhbHNlLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgYmVuY2htYXJrIGlzIHJ1bm5pbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAncnVubmluZyc6IGZhbHNlLFxuXG4gICAgICAvKipcbiAgICAgICAqIENvbXBpbGVkIGludG8gdGhlIHRlc3QgYW5kIGV4ZWN1dGVkIGltbWVkaWF0ZWx5ICoqYmVmb3JlKiogdGhlIHRlc3QgbG9vcC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258c3RyaW5nfVxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqXG4gICAgICAgKiAvLyBiYXNpYyB1c2FnZVxuICAgICAgICogdmFyIGJlbmNoID0gQmVuY2htYXJrKHtcbiAgICAgICAqICAgJ3NldHVwJzogZnVuY3Rpb24oKSB7XG4gICAgICAgKiAgICAgdmFyIGMgPSB0aGlzLmNvdW50LFxuICAgICAgICogICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgICAgICogICAgIHdoaWxlIChjLS0pIHtcbiAgICAgICAqICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICogICAgIH1cbiAgICAgICAqICAgfSxcbiAgICAgICAqICAgJ2ZuJzogZnVuY3Rpb24oKSB7XG4gICAgICAgKiAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50Lmxhc3RDaGlsZCk7XG4gICAgICAgKiAgIH1cbiAgICAgICAqIH0pO1xuICAgICAgICpcbiAgICAgICAqIC8vIGNvbXBpbGVzIHRvIHNvbWV0aGluZyBsaWtlOlxuICAgICAgICogdmFyIGMgPSB0aGlzLmNvdW50LFxuICAgICAgICogICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgICAgKiB3aGlsZSAoYy0tKSB7XG4gICAgICAgKiAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICogfVxuICAgICAgICogdmFyIHN0YXJ0ID0gbmV3IERhdGU7XG4gICAgICAgKiB3aGlsZSAoY291bnQtLSkge1xuICAgICAgICogICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQubGFzdENoaWxkKTtcbiAgICAgICAqIH1cbiAgICAgICAqIHZhciBlbmQgPSBuZXcgRGF0ZSAtIHN0YXJ0O1xuICAgICAgICpcbiAgICAgICAqIC8vIG9yIHVzaW5nIHN0cmluZ3NcbiAgICAgICAqIHZhciBiZW5jaCA9IEJlbmNobWFyayh7XG4gICAgICAgKiAgICdzZXR1cCc6ICdcXFxuICAgICAgICogICAgIHZhciBhID0gMDtcXG5cXFxuICAgICAgICogICAgIChmdW5jdGlvbigpIHtcXG5cXFxuICAgICAgICogICAgICAgKGZ1bmN0aW9uKCkge1xcblxcXG4gICAgICAgKiAgICAgICAgIChmdW5jdGlvbigpIHsnLFxuICAgICAgICogICAnZm4nOiAnYSArPSAxOycsXG4gICAgICAgKiAgICd0ZWFyZG93bic6ICdcXFxuICAgICAgICogICAgICAgICAgfSgpKVxcblxcXG4gICAgICAgKiAgICAgICAgfSgpKVxcblxcXG4gICAgICAgKiAgICAgIH0oKSknXG4gICAgICAgKiB9KTtcbiAgICAgICAqXG4gICAgICAgKiAvLyBjb21waWxlcyB0byBzb21ldGhpbmcgbGlrZTpcbiAgICAgICAqIHZhciBhID0gMDtcbiAgICAgICAqIChmdW5jdGlvbigpIHtcbiAgICAgICAqICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICogICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAqICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlO1xuICAgICAgICogICAgICAgd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgICAqICAgICAgICAgYSArPSAxO1xuICAgICAgICogICAgICAgfVxuICAgICAgICogICAgICAgdmFyIGVuZCA9IG5ldyBEYXRlIC0gc3RhcnQ7XG4gICAgICAgKiAgICAgfSgpKVxuICAgICAgICogICB9KCkpXG4gICAgICAgKiB9KCkpXG4gICAgICAgKi9cbiAgICAgICdzZXR1cCc6IF8ubm9vcCxcblxuICAgICAgLyoqXG4gICAgICAgKiBDb21waWxlZCBpbnRvIHRoZSB0ZXN0IGFuZCBleGVjdXRlZCBpbW1lZGlhdGVseSAqKmFmdGVyKiogdGhlIHRlc3QgbG9vcC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258c3RyaW5nfVxuICAgICAgICovXG4gICAgICAndGVhcmRvd24nOiBfLm5vb3AsXG5cbiAgICAgIC8qKlxuICAgICAgICogQW4gb2JqZWN0IG9mIHN0YXRzIGluY2x1ZGluZyBtZWFuLCBtYXJnaW4gb3IgZXJyb3IsIGFuZCBzdGFuZGFyZCBkZXZpYXRpb24uXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdzdGF0cyc6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1hcmdpbiBvZiBlcnJvci5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdtb2UnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcmVsYXRpdmUgbWFyZ2luIG9mIGVycm9yIChleHByZXNzZWQgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBtZWFuKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdybWUnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc3RhbmRhcmQgZXJyb3Igb2YgdGhlIG1lYW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnc2VtJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnZGV2aWF0aW9uJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNhbXBsZSBhcml0aG1ldGljIG1lYW4gKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21lYW4nOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYXJyYXkgb2Ygc2FtcGxlZCBwZXJpb2RzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIEFycmF5XG4gICAgICAgICAqL1xuICAgICAgICAnc2FtcGxlJzogW10sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzYW1wbGUgdmFyaWFuY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAndmFyaWFuY2UnOiAwXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFuIG9iamVjdCBvZiB0aW1pbmcgZGF0YSBpbmNsdWRpbmcgY3ljbGUsIGVsYXBzZWQsIHBlcmlvZCwgc3RhcnQsIGFuZCBzdG9wLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAndGltZXMnOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lIHRha2VuIHRvIGNvbXBsZXRlIHRoZSBsYXN0IGN5Y2xlIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayN0aW1lc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdjeWNsZSc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lIHRha2VuIHRvIGNvbXBsZXRlIHRoZSBiZW5jaG1hcmsgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3RpbWVzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ2VsYXBzZWQnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGltZSB0YWtlbiB0byBleGVjdXRlIHRoZSB0ZXN0IG9uY2UgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3RpbWVzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ3BlcmlvZCc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgdGltZXN0YW1wIG9mIHdoZW4gdGhlIGJlbmNobWFyayBzdGFydGVkIChtcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjdGltZXNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAndGltZVN0YW1wJzogMFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLnByb3RvdHlwZSwge1xuICAgICAgJ2Fib3J0JzogYWJvcnQsXG4gICAgICAnY2xvbmUnOiBjbG9uZSxcbiAgICAgICdjb21wYXJlJzogY29tcGFyZSxcbiAgICAgICdlbWl0JzogZW1pdCxcbiAgICAgICdsaXN0ZW5lcnMnOiBsaXN0ZW5lcnMsXG4gICAgICAnb2ZmJzogb2ZmLFxuICAgICAgJ29uJzogb24sXG4gICAgICAncmVzZXQnOiByZXNldCxcbiAgICAgICdydW4nOiBydW4sXG4gICAgICAndG9TdHJpbmcnOiB0b1N0cmluZ0JlbmNoXG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBfLmFzc2lnbihEZWZlcnJlZC5wcm90b3R5cGUsIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmZXJyZWQgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnYmVuY2htYXJrJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGRlZmVycmVkIGN5Y2xlcyBwZXJmb3JtZWQgd2hpbGUgYmVuY2htYXJraW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnY3ljbGVzJzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdGltZSB0YWtlbiB0byBjb21wbGV0ZSB0aGUgZGVmZXJyZWQgYmVuY2htYXJrIChzZWNzKS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkRlZmVycmVkXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2VsYXBzZWQnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgdGltZXN0YW1wIG9mIHdoZW4gdGhlIGRlZmVycmVkIGJlbmNobWFyayBzdGFydGVkIChtcykuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5EZWZlcnJlZFxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICd0aW1lU3RhbXAnOiAwXG4gICAgfSk7XG5cbiAgICBfLmFzc2lnbihEZWZlcnJlZC5wcm90b3R5cGUsIHtcbiAgICAgICdyZXNvbHZlJzogcmVzb2x2ZVxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgXy5hc3NpZ24oRXZlbnQucHJvdG90eXBlLCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBlbWl0dGVycyBsaXN0ZW5lciBpdGVyYXRpb24gaXMgYWJvcnRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdhYm9ydGVkJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBkZWZhdWx0IGFjdGlvbiBpcyBjYW5jZWxsZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAnY2FuY2VsbGVkJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG9iamVjdCB3aG9zZSBsaXN0ZW5lcnMgYXJlIGN1cnJlbnRseSBiZWluZyBwcm9jZXNzZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdjdXJyZW50VGFyZ2V0JzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGxhc3QgZXhlY3V0ZWQgbGlzdGVuZXIuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgTWl4ZWRcbiAgICAgICAqL1xuICAgICAgJ3Jlc3VsdCc6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgb2JqZWN0IHRvIHdoaWNoIHRoZSBldmVudCB3YXMgb3JpZ2luYWxseSBlbWl0dGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAndGFyZ2V0JzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgdGltZXN0YW1wIG9mIHdoZW4gdGhlIGV2ZW50IHdhcyBjcmVhdGVkIChtcykuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICd0aW1lU3RhbXAnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBldmVudCB0eXBlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICovXG4gICAgICAndHlwZSc6ICcnXG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBvcHRpb25zIGNvcGllZCBieSBzdWl0ZSBpbnN0YW5jZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIFN1aXRlLm9wdGlvbnMgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG5hbWUgb2YgdGhlIHN1aXRlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGUub3B0aW9uc1xuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKi9cbiAgICAgICduYW1lJzogdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIF8uYXNzaWduKFN1aXRlLnByb3RvdHlwZSwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgYmVuY2htYXJrcyBpbiB0aGUgc3VpdGUuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICdsZW5ndGgnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgc3VpdGUgaXMgYWJvcnRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdhYm9ydGVkJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBzdWl0ZSBpcyBydW5uaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgJ3J1bm5pbmcnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgXy5hc3NpZ24oU3VpdGUucHJvdG90eXBlLCB7XG4gICAgICAnYWJvcnQnOiBhYm9ydFN1aXRlLFxuICAgICAgJ2FkZCc6IGFkZCxcbiAgICAgICdjbG9uZSc6IGNsb25lU3VpdGUsXG4gICAgICAnZW1pdCc6IGVtaXQsXG4gICAgICAnZmlsdGVyJzogZmlsdGVyU3VpdGUsXG4gICAgICAnam9pbic6IGFycmF5UmVmLmpvaW4sXG4gICAgICAnbGlzdGVuZXJzJzogbGlzdGVuZXJzLFxuICAgICAgJ29mZic6IG9mZixcbiAgICAgICdvbic6IG9uLFxuICAgICAgJ3BvcCc6IGFycmF5UmVmLnBvcCxcbiAgICAgICdwdXNoJzogcHVzaCxcbiAgICAgICdyZXNldCc6IHJlc2V0U3VpdGUsXG4gICAgICAncnVuJzogcnVuU3VpdGUsXG4gICAgICAncmV2ZXJzZSc6IGFycmF5UmVmLnJldmVyc2UsXG4gICAgICAnc2hpZnQnOiBzaGlmdCxcbiAgICAgICdzbGljZSc6IHNsaWNlLFxuICAgICAgJ3NvcnQnOiBhcnJheVJlZi5zb3J0LFxuICAgICAgJ3NwbGljZSc6IGFycmF5UmVmLnNwbGljZSxcbiAgICAgICd1bnNoaWZ0JzogdW5zaGlmdFxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gRXhwb3NlIERlZmVycmVkLCBFdmVudCwgYW5kIFN1aXRlLlxuICAgIF8uYXNzaWduKEJlbmNobWFyaywge1xuICAgICAgJ0RlZmVycmVkJzogRGVmZXJyZWQsXG4gICAgICAnRXZlbnQnOiBFdmVudCxcbiAgICAgICdTdWl0ZSc6IFN1aXRlXG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBBZGQgbG9kYXNoIG1ldGhvZHMgYXMgU3VpdGUgbWV0aG9kcy5cbiAgICBfLmVhY2goWydlYWNoJywgJ2ZvckVhY2gnLCAnaW5kZXhPZicsICdtYXAnLCAncmVkdWNlJ10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1ttZXRob2ROYW1lXTtcbiAgICAgIFN1aXRlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseShfLCBhcmdzKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBBdm9pZCBhcnJheS1saWtlIG9iamVjdCBidWdzIHdpdGggYEFycmF5I3NoaWZ0YCBhbmQgYEFycmF5I3NwbGljZWBcbiAgICAvLyBpbiBGaXJlZm94IDwgMTAgYW5kIElFIDwgOS5cbiAgICBfLmVhY2goWydwb3AnLCAnc2hpZnQnLCAnc3BsaWNlJ10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gYXJyYXlSZWZbbWV0aG9kTmFtZV07XG5cbiAgICAgIFN1aXRlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLFxuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh2YWx1ZSwgYXJndW1lbnRzKTtcblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZGVsZXRlIHZhbHVlWzBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gQXZvaWQgYnVnZ3kgYEFycmF5I3Vuc2hpZnRgIGluIElFIDwgOCB3aGljaCBkb2Vzbid0IHJldHVybiB0aGUgbmV3XG4gICAgLy8gbGVuZ3RoIG9mIHRoZSBhcnJheS5cbiAgICBTdWl0ZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gdGhpcztcbiAgICAgIHVuc2hpZnQuYXBwbHkodmFsdWUsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoO1xuICAgIH07XG5cbiAgICByZXR1cm4gQmVuY2htYXJrO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gRXhwb3J0IEJlbmNobWFyay5cbiAgLy8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3IgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gRGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28sIHRocm91Z2ggcGF0aCBtYXBwaW5nLCBpdCBjYW4gYmUgYWxpYXNlZC5cbiAgICBkZWZpbmUoWydsb2Rhc2gnLCAncGxhdGZvcm0nXSwgZnVuY3Rpb24oXywgcGxhdGZvcm0pIHtcbiAgICAgIHJldHVybiBydW5JbkNvbnRleHQoe1xuICAgICAgICAnXyc6IF8sXG4gICAgICAgICdwbGF0Zm9ybSc6IHBsYXRmb3JtXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgQmVuY2htYXJrID0gcnVuSW5Db250ZXh0KCk7XG5cbiAgICAvLyBDaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0LlxuICAgIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgICAvLyBFeHBvcnQgZm9yIE5vZGUuanMuXG4gICAgICBpZiAobW9kdWxlRXhwb3J0cykge1xuICAgICAgICAoZnJlZU1vZHVsZS5leHBvcnRzID0gQmVuY2htYXJrKS5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG4gICAgICB9XG4gICAgICAvLyBFeHBvcnQgZm9yIENvbW1vbkpTIHN1cHBvcnQuXG4gICAgICBmcmVlRXhwb3J0cy5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gRXhwb3J0IHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICAgICAgcm9vdC5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG4gICAgfVxuICB9XG59LmNhbGwodGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JlbmNobWFyay9iZW5jaG1hcmsuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogUGxhdGZvcm0uanMgdjEuMy4xIDxodHRwOi8vbXRocy5iZS9wbGF0Zm9ybT5cbiAqIENvcHlyaWdodCAyMDE0LTIwMTYgQmVuamFtaW4gVGFuIDxodHRwczovL2QxMC5naXRodWIuaW8vPlxuICogQ29weXJpZ2h0IDIwMTEtMjAxMyBKb2huLURhdmlkIERhbHRvbiA8aHR0cDovL2FsbHlvdWNhbmxlZXQuY29tLz5cbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL210aHMuYmUvbWl0PlxuICovXG47KGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgYE9iamVjdGAgKi9cbiAgdmFyIG9iamVjdFR5cGVzID0ge1xuICAgICdmdW5jdGlvbic6IHRydWUsXG4gICAgJ29iamVjdCc6IHRydWVcbiAgfTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIEJhY2t1cCBwb3NzaWJsZSBnbG9iYWwgb2JqZWN0ICovXG4gIHZhciBvbGRSb290ID0gcm9vdDtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgICovXG4gIHZhciBmcmVlRXhwb3J0cyA9IG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYCAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgICovXG4gIHZhciBmcmVlR2xvYmFsID0gZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcbiAgaWYgKGZyZWVHbG9iYWwgJiYgKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbCkpIHtcbiAgICByb290ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGFzIHRoZSBtYXhpbXVtIGxlbmd0aCBvZiBhbiBhcnJheS1saWtlIG9iamVjdC5cbiAgICogU2VlIHRoZSBbRVM2IHNwZWNdKGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKVxuICAgKiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKi9cbiAgdmFyIG1heFNhZmVJbnRlZ2VyID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuICAvKiogT3BlcmEgcmVnZXhwICovXG4gIHZhciByZU9wZXJhID0gL1xcYk9wZXJhLztcblxuICAvKiogUG9zc2libGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgdGhpc0JpbmRpbmcgPSB0aGlzO1xuXG4gIC8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgKi9cbiAgdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICAvKiogVXNlZCB0byBjaGVjayBmb3Igb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0ICovXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIHZhbHVlcyAqL1xuICB2YXIgdG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ2FwaXRhbGl6ZXMgYSBzdHJpbmcgdmFsdWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjYXBpdGFsaXplLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY2FwaXRhbGl6ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKTtcbiAgICByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgdXRpbGl0eSBmdW5jdGlvbiB0byBjbGVhbiB1cCB0aGUgT1MgbmFtZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9zIFRoZSBPUyBuYW1lIHRvIGNsZWFuIHVwLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3BhdHRlcm5dIEEgYFJlZ0V4cGAgcGF0dGVybiBtYXRjaGluZyB0aGUgT1MgbmFtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtsYWJlbF0gQSBsYWJlbCBmb3IgdGhlIE9TLlxuICAgKi9cbiAgZnVuY3Rpb24gY2xlYW51cE9TKG9zLCBwYXR0ZXJuLCBsYWJlbCkge1xuICAgIC8vIHBsYXRmb3JtIHRva2VucyBkZWZpbmVkIGF0XG4gICAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgLy8gaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAwODExMjIwNTM5NTAvaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAnNi40JzogICcxMCcsXG4gICAgICAnNi4zJzogICc4LjEnLFxuICAgICAgJzYuMic6ICAnOCcsXG4gICAgICAnNi4xJzogICdTZXJ2ZXIgMjAwOCBSMiAvIDcnLFxuICAgICAgJzYuMCc6ICAnU2VydmVyIDIwMDggLyBWaXN0YScsXG4gICAgICAnNS4yJzogICdTZXJ2ZXIgMjAwMyAvIFhQIDY0LWJpdCcsXG4gICAgICAnNS4xJzogICdYUCcsXG4gICAgICAnNS4wMSc6ICcyMDAwIFNQMScsXG4gICAgICAnNS4wJzogICcyMDAwJyxcbiAgICAgICc0LjAnOiAgJ05UJyxcbiAgICAgICc0LjkwJzogJ01FJ1xuICAgIH07XG4gICAgLy8gZGV0ZWN0IFdpbmRvd3MgdmVyc2lvbiBmcm9tIHBsYXRmb3JtIHRva2Vuc1xuICAgIGlmIChwYXR0ZXJuICYmIGxhYmVsICYmIC9eV2luL2kudGVzdChvcykgJiZcbiAgICAgICAgKGRhdGEgPSBkYXRhWzAvKk9wZXJhIDkuMjUgZml4Ki8sIC9bXFxkLl0rJC8uZXhlYyhvcyldKSkge1xuICAgICAgb3MgPSAnV2luZG93cyAnICsgZGF0YTtcbiAgICB9XG4gICAgLy8gY29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cFxuICAgIG9zID0gU3RyaW5nKG9zKTtcblxuICAgIGlmIChwYXR0ZXJuICYmIGxhYmVsKSB7XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKHBhdHRlcm4sICdpJyksIGxhYmVsKTtcbiAgICB9XG5cbiAgICBvcyA9IGZvcm1hdChcbiAgICAgIG9zLnJlcGxhY2UoLyBjZSQvaSwgJyBDRScpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJocHcvaSwgJ3dlYicpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWNpbnRvc2hcXGIvLCAnTWFjIE9TJylcbiAgICAgICAgLnJlcGxhY2UoL19Qb3dlclBDXFxiL2ksICcgT1MnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKE9TIFgpIFteIFxcZF0rL2ksICckMScpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWMgKE9TIFgpXFxiLywgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcLyhcXGQpLywgJyAkMScpXG4gICAgICAgIC5yZXBsYWNlKC9fL2csICcuJylcbiAgICAgICAgLnJlcGxhY2UoLyg/OiBCZVBDfFsgLl0qZmNbIFxcZC5dKykkL2ksICcnKVxuICAgICAgICAucmVwbGFjZSgvXFxieDg2XFwuNjRcXGIvZ2ksICd4ODZfNjQnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKFdpbmRvd3MgUGhvbmUpIE9TXFxiLywgJyQxJylcbiAgICAgICAgLnNwbGl0KCcgb24gJylbMF1cbiAgICApO1xuXG4gICAgcmV0dXJuIG9zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGl0ZXJhdGlvbiB1dGlsaXR5IGZvciBhcnJheXMgYW5kIG9iamVjdHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2gob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcblxuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+IC0xICYmIGxlbmd0aCA8PSBtYXhTYWZlSW50ZWdlcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2luZGV4XSwgaW5kZXgsIG9iamVjdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvck93bihvYmplY3QsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpbSBhbmQgY29uZGl0aW9uYWxseSBjYXBpdGFsaXplIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBmb3JtYXQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gZm9ybWF0KHN0cmluZykge1xuICAgIHN0cmluZyA9IHRyaW0oc3RyaW5nKTtcbiAgICByZXR1cm4gL14oPzp3ZWJPU3xpKD86T1N8UCkpLy50ZXN0KHN0cmluZylcbiAgICAgID8gc3RyaW5nXG4gICAgICA6IGNhcGl0YWxpemUoc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLCBleGVjdXRpbmcgdGhlIGBjYWxsYmFja2AgZm9yIGVhY2guXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBleGVjdXRlZCBwZXIgb3duIHByb3BlcnR5LlxuICAgKi9cbiAgZnVuY3Rpb24gZm9yT3duKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgYSB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBgW1tDbGFzc11dYC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldENsYXNzT2YodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBjYXBpdGFsaXplKHZhbHVlKVxuICAgICAgOiB0b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSk7XG4gIH1cblxuICAvKipcbiAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXG4gICAqIGRhdGEgdHlwZS4gVGhlIG9iamVjdHMgd2UgYXJlIGNvbmNlcm5lZCB3aXRoIHVzdWFsbHkgcmV0dXJuIG5vbi1wcmltaXRpdmVcbiAgICogdHlwZXMgb2YgXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiLCBvciBcInVua25vd25cIi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIG93bmVyIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpcyBhIG5vbi1wcmltaXRpdmUsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHZhciB0eXBlID0gb2JqZWN0ICE9IG51bGwgPyB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA6ICdudW1iZXInO1xuICAgIHJldHVybiAhL14oPzpib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkKSQvLnRlc3QodHlwZSkgJiZcbiAgICAgICh0eXBlID09ICdvYmplY3QnID8gISFvYmplY3RbcHJvcGVydHldIDogdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZXMgYSBzdHJpbmcgZm9yIHVzZSBpbiBhIGBSZWdFeHBgIGJ5IG1ha2luZyBoeXBoZW5zIGFuZCBzcGFjZXMgb3B0aW9uYWwuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBxdWFsaWZ5LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcXVhbGlmaWVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHF1YWxpZnkoc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoLyhbIC1dKSg/ISQpL2csICckMT8nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGJhcmUtYm9uZXMgYEFycmF5I3JlZHVjZWAgbGlrZSB1dGlsaXR5IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHsqfSBUaGUgYWNjdW11bGF0ZWQgcmVzdWx0LlxuICAgKi9cbiAgZnVuY3Rpb24gcmVkdWNlKGFycmF5LCBjYWxsYmFjaykge1xuICAgIHZhciBhY2N1bXVsYXRvciA9IG51bGw7XG4gICAgZWFjaChhcnJheSwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGFycmF5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlIGZyb20gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdHJpbW1lZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiB0cmltKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9eICt8ICskL2csICcnKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBsYXRmb3JtIG9iamVjdC5cbiAgICpcbiAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gW3VhPW5hdmlnYXRvci51c2VyQWdlbnRdIFRoZSB1c2VyIGFnZW50IHN0cmluZyBvclxuICAgKiAgY29udGV4dCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEEgcGxhdGZvcm0gb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2UodWEpIHtcblxuICAgIC8qKiBUaGUgZW52aXJvbm1lbnQgY29udGV4dCBvYmplY3QgKi9cbiAgICB2YXIgY29udGV4dCA9IHJvb3Q7XG5cbiAgICAvKiogVXNlZCB0byBmbGFnIHdoZW4gYSBjdXN0b20gY29udGV4dCBpcyBwcm92aWRlZCAqL1xuICAgIHZhciBpc0N1c3RvbUNvbnRleHQgPSB1YSAmJiB0eXBlb2YgdWEgPT0gJ29iamVjdCcgJiYgZ2V0Q2xhc3NPZih1YSkgIT0gJ1N0cmluZyc7XG5cbiAgICAvLyBqdWdnbGUgYXJndW1lbnRzXG4gICAgaWYgKGlzQ3VzdG9tQ29udGV4dCkge1xuICAgICAgY29udGV4dCA9IHVhO1xuICAgICAgdWEgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBCcm93c2VyIG5hdmlnYXRvciBvYmplY3QgKi9cbiAgICB2YXIgbmF2ID0gY29udGV4dC5uYXZpZ2F0b3IgfHwge307XG5cbiAgICAvKiogQnJvd3NlciB1c2VyIGFnZW50IHN0cmluZyAqL1xuICAgIHZhciB1c2VyQWdlbnQgPSBuYXYudXNlckFnZW50IHx8ICcnO1xuXG4gICAgdWEgfHwgKHVhID0gdXNlckFnZW50KTtcblxuICAgIC8qKiBVc2VkIHRvIGZsYWcgd2hlbiBgdGhpc0JpbmRpbmdgIGlzIHRoZSBbTW9kdWxlU2NvcGVdICovXG4gICAgdmFyIGlzTW9kdWxlU2NvcGUgPSBpc0N1c3RvbUNvbnRleHQgfHwgdGhpc0JpbmRpbmcgPT0gb2xkUm9vdDtcblxuICAgIC8qKiBVc2VkIHRvIGRldGVjdCBpZiBicm93c2VyIGlzIGxpa2UgQ2hyb21lICovXG4gICAgdmFyIGxpa2VDaHJvbWUgPSBpc0N1c3RvbUNvbnRleHRcbiAgICAgID8gISFuYXYubGlrZUNocm9tZVxuICAgICAgOiAvXFxiQ2hyb21lXFxiLy50ZXN0KHVhKSAmJiAhL2ludGVybmFsfFxcbi9pLnRlc3QodG9TdHJpbmcudG9TdHJpbmcoKSk7XG5cbiAgICAvKiogSW50ZXJuYWwgYFtbQ2xhc3NdXWAgdmFsdWUgc2hvcnRjdXRzICovXG4gICAgdmFyIG9iamVjdENsYXNzID0gJ09iamVjdCcsXG4gICAgICAgIGFpclJ1bnRpbWVDbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ1NjcmlwdEJyaWRnaW5nUHJveHlPYmplY3QnLFxuICAgICAgICBlbnZpcm9DbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ0Vudmlyb25tZW50JyxcbiAgICAgICAgamF2YUNsYXNzID0gKGlzQ3VzdG9tQ29udGV4dCAmJiBjb250ZXh0LmphdmEpID8gJ0phdmFQYWNrYWdlJyA6IGdldENsYXNzT2YoY29udGV4dC5qYXZhKSxcbiAgICAgICAgcGhhbnRvbUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnUnVudGltZU9iamVjdCc7XG5cbiAgICAvKiogRGV0ZWN0IEphdmEgZW52aXJvbm1lbnQgKi9cbiAgICB2YXIgamF2YSA9IC9cXGJKYXZhLy50ZXN0KGphdmFDbGFzcykgJiYgY29udGV4dC5qYXZhO1xuXG4gICAgLyoqIERldGVjdCBSaGlubyAqL1xuICAgIHZhciByaGlubyA9IGphdmEgJiYgZ2V0Q2xhc3NPZihjb250ZXh0LmVudmlyb25tZW50KSA9PSBlbnZpcm9DbGFzcztcblxuICAgIC8qKiBBIGNoYXJhY3RlciB0byByZXByZXNlbnQgYWxwaGEgKi9cbiAgICB2YXIgYWxwaGEgPSBqYXZhID8gJ2EnIDogJ1xcdTAzYjEnO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBiZXRhICovXG4gICAgdmFyIGJldGEgPSBqYXZhID8gJ2InIDogJ1xcdTAzYjInO1xuXG4gICAgLyoqIEJyb3dzZXIgZG9jdW1lbnQgb2JqZWN0ICovXG4gICAgdmFyIGRvYyA9IGNvbnRleHQuZG9jdW1lbnQgfHwge307XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgT3BlcmEgYnJvd3NlciAoUHJlc3RvLWJhc2VkKVxuICAgICAqIGh0dHA6Ly93d3cuaG93dG9jcmVhdGUuY28udWsvb3BlcmFTdHVmZi9vcGVyYU9iamVjdC5odG1sXG4gICAgICogaHR0cDovL2Rldi5vcGVyYS5jb20vYXJ0aWNsZXMvdmlldy9vcGVyYS1taW5pLXdlYi1jb250ZW50LWF1dGhvcmluZy1ndWlkZWxpbmVzLyNvcGVyYW1pbmlcbiAgICAgKi9cbiAgICB2YXIgb3BlcmEgPSBjb250ZXh0Lm9wZXJhbWluaSB8fCBjb250ZXh0Lm9wZXJhO1xuXG4gICAgLyoqIE9wZXJhIGBbW0NsYXNzXV1gICovXG4gICAgdmFyIG9wZXJhQ2xhc3MgPSByZU9wZXJhLnRlc3Qob3BlcmFDbGFzcyA9IChpc0N1c3RvbUNvbnRleHQgJiYgb3BlcmEpID8gb3BlcmFbJ1tbQ2xhc3NdXSddIDogZ2V0Q2xhc3NPZihvcGVyYSkpXG4gICAgICA/IG9wZXJhQ2xhc3NcbiAgICAgIDogKG9wZXJhID0gbnVsbCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKiogVGVtcG9yYXJ5IHZhcmlhYmxlIHVzZWQgb3ZlciB0aGUgc2NyaXB0J3MgbGlmZXRpbWUgKi9cbiAgICB2YXIgZGF0YTtcblxuICAgIC8qKiBUaGUgQ1BVIGFyY2hpdGVjdHVyZSAqL1xuICAgIHZhciBhcmNoID0gdWE7XG5cbiAgICAvKiogUGxhdGZvcm0gZGVzY3JpcHRpb24gYXJyYXkgKi9cbiAgICB2YXIgZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIC8qKiBQbGF0Zm9ybSBhbHBoYS9iZXRhIGluZGljYXRvciAqL1xuICAgIHZhciBwcmVyZWxlYXNlID0gbnVsbDtcblxuICAgIC8qKiBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBlbnZpcm9ubWVudCBmZWF0dXJlcyBzaG91bGQgYmUgdXNlZCB0byByZXNvbHZlIHRoZSBwbGF0Zm9ybSAqL1xuICAgIHZhciB1c2VGZWF0dXJlcyA9IHVhID09IHVzZXJBZ2VudDtcblxuICAgIC8qKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uICovXG4gICAgdmFyIHZlcnNpb24gPSB1c2VGZWF0dXJlcyAmJiBvcGVyYSAmJiB0eXBlb2Ygb3BlcmEudmVyc2lvbiA9PSAnZnVuY3Rpb24nICYmIG9wZXJhLnZlcnNpb24oKTtcblxuICAgIC8qKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIE9TIGVuZHMgd2l0aCBcIi8gVmVyc2lvblwiICovXG4gICAgdmFyIGlzU3BlY2lhbENhc2VkT1M7XG5cbiAgICAvKiBEZXRlY3RhYmxlIGxheW91dCBlbmdpbmVzIChvcmRlciBpcyBpbXBvcnRhbnQpICovXG4gICAgdmFyIGxheW91dCA9IGdldExheW91dChbXG4gICAgICAnVHJpZGVudCcsXG4gICAgICB7ICdsYWJlbCc6ICdXZWJLaXQnLCAncGF0dGVybic6ICdBcHBsZVdlYktpdCcgfSxcbiAgICAgICdpQ2FiJyxcbiAgICAgICdQcmVzdG8nLFxuICAgICAgJ05ldEZyb250JyxcbiAgICAgICdUYXNtYW4nLFxuICAgICAgJ0tIVE1MJyxcbiAgICAgICdHZWNrbydcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgYnJvd3NlciBuYW1lcyAob3JkZXIgaXMgaW1wb3J0YW50KSAqL1xuICAgIHZhciBuYW1lID0gZ2V0TmFtZShbXG4gICAgICAnQWRvYmUgQUlSJyxcbiAgICAgICdBcm9yYScsXG4gICAgICAnQXZhbnQgQnJvd3NlcicsXG4gICAgICAnQnJlYWNoJyxcbiAgICAgICdDYW1pbm8nLFxuICAgICAgJ0VwaXBoYW55JyxcbiAgICAgICdGZW5uZWMnLFxuICAgICAgJ0Zsb2NrJyxcbiAgICAgICdHYWxlb24nLFxuICAgICAgJ0dyZWVuQnJvd3NlcicsXG4gICAgICAnaUNhYicsXG4gICAgICAnSWNld2Vhc2VsJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NSV2FyZSBJcm9uJywgJ3BhdHRlcm4nOiAnSXJvbicgfSxcbiAgICAgICdLLU1lbGVvbicsXG4gICAgICAnS29ucXVlcm9yJyxcbiAgICAgICdMdW5hc2NhcGUnLFxuICAgICAgJ01heHRob24nLFxuICAgICAgJ01pZG9yaScsXG4gICAgICAnTm9vayBCcm93c2VyJyxcbiAgICAgICdQaGFudG9tSlMnLFxuICAgICAgJ1JhdmVuJyxcbiAgICAgICdSZWtvbnEnLFxuICAgICAgJ1JvY2tNZWx0JyxcbiAgICAgICdTZWFNb25rZXknLFxuICAgICAgeyAnbGFiZWwnOiAnU2lsaycsICdwYXR0ZXJuJzogJyg/OkNsb3VkOXxTaWxrLUFjY2VsZXJhdGVkKScgfSxcbiAgICAgICdTbGVpcG5pcicsXG4gICAgICAnU2xpbUJyb3dzZXInLFxuICAgICAgJ1N1bnJpc2UnLFxuICAgICAgJ1N3aWZ0Zm94JyxcbiAgICAgICdXZWJQb3NpdGl2ZScsXG4gICAgICAnT3BlcmEgTWluaScsXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYSBNaW5pJywgJ3BhdHRlcm4nOiAnT1BpT1MnIH0sXG4gICAgICAnT3BlcmEnLFxuICAgICAgeyAnbGFiZWwnOiAnT3BlcmEnLCAncGF0dGVybic6ICdPUFInIH0sXG4gICAgICAnQ2hyb21lJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZSBNb2JpbGUnLCAncGF0dGVybic6ICcoPzpDcmlPU3xDck1vKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0ZpcmVmb3gnLCAncGF0dGVybic6ICcoPzpGaXJlZm94fE1pbmVmaWVsZCknIH0sXG4gICAgICB7ICdsYWJlbCc6ICdJRScsICdwYXR0ZXJuJzogJ0lFTW9iaWxlJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnSUUnLCAncGF0dGVybic6ICdNU0lFJyB9LFxuICAgICAgJ1NhZmFyaSdcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgcHJvZHVjdHMgKG9yZGVyIGlzIGltcG9ydGFudCkgKi9cbiAgICB2YXIgcHJvZHVjdCA9IGdldFByb2R1Y3QoW1xuICAgICAgeyAnbGFiZWwnOiAnQmxhY2tCZXJyeScsICdwYXR0ZXJuJzogJ0JCMTAnIH0sXG4gICAgICAnQmxhY2tCZXJyeScsXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUycsICdwYXR0ZXJuJzogJ0dULUk5MDAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMyJywgJ3BhdHRlcm4nOiAnR1QtSTkxMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzMnLCAncGF0dGVybic6ICdHVC1JOTMwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNCcsICdwYXR0ZXJuJzogJ0dULUk5NTAwJyB9LFxuICAgICAgJ0dvb2dsZSBUVicsXG4gICAgICAnTHVtaWEnLFxuICAgICAgJ2lQYWQnLFxuICAgICAgJ2lQb2QnLFxuICAgICAgJ2lQaG9uZScsXG4gICAgICAnS2luZGxlJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0tpbmRsZSBGaXJlJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ05vb2snLFxuICAgICAgJ1BsYXlCb29rJyxcbiAgICAgICdQbGF5U3RhdGlvbiA0JyxcbiAgICAgICdQbGF5U3RhdGlvbiAzJyxcbiAgICAgICdQbGF5U3RhdGlvbiBWaXRhJyxcbiAgICAgICdUb3VjaFBhZCcsXG4gICAgICAnVHJhbnNmb3JtZXInLFxuICAgICAgeyAnbGFiZWwnOiAnV2lpIFUnLCAncGF0dGVybic6ICdXaWlVJyB9LFxuICAgICAgJ1dpaScsXG4gICAgICAnWGJveCBPbmUnLFxuICAgICAgeyAnbGFiZWwnOiAnWGJveCAzNjAnLCAncGF0dGVybic6ICdYYm94JyB9LFxuICAgICAgJ1hvb20nXG4gICAgXSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIG1hbnVmYWN0dXJlcnMgKi9cbiAgICB2YXIgbWFudWZhY3R1cmVyID0gZ2V0TWFudWZhY3R1cmVyKHtcbiAgICAgICdBcHBsZSc6IHsgJ2lQYWQnOiAxLCAnaVBob25lJzogMSwgJ2lQb2QnOiAxIH0sXG4gICAgICAnQW1hem9uJzogeyAnS2luZGxlJzogMSwgJ0tpbmRsZSBGaXJlJzogMSB9LFxuICAgICAgJ0FzdXMnOiB7ICdUcmFuc2Zvcm1lcic6IDEgfSxcbiAgICAgICdCYXJuZXMgJiBOb2JsZSc6IHsgJ05vb2snOiAxIH0sXG4gICAgICAnQmxhY2tCZXJyeSc6IHsgJ1BsYXlCb29rJzogMSB9LFxuICAgICAgJ0dvb2dsZSc6IHsgJ0dvb2dsZSBUVic6IDEgfSxcbiAgICAgICdIUCc6IHsgJ1RvdWNoUGFkJzogMSB9LFxuICAgICAgJ0hUQyc6IHt9LFxuICAgICAgJ0xHJzoge30sXG4gICAgICAnTWljcm9zb2Z0JzogeyAnWGJveCc6IDEsICdYYm94IE9uZSc6IDEgfSxcbiAgICAgICdNb3Rvcm9sYSc6IHsgJ1hvb20nOiAxIH0sXG4gICAgICAnTmludGVuZG8nOiB7ICdXaWkgVSc6IDEsICAnV2lpJzogMSB9LFxuICAgICAgJ05va2lhJzogeyAnTHVtaWEnOiAxIH0sXG4gICAgICAnU2Ftc3VuZyc6IHsgJ0dhbGF4eSBTJzogMSwgJ0dhbGF4eSBTMic6IDEsICdHYWxheHkgUzMnOiAxLCAnR2FsYXh5IFM0JzogMSB9LFxuICAgICAgJ1NvbnknOiB7ICdQbGF5U3RhdGlvbiA0JzogMSwgJ1BsYXlTdGF0aW9uIDMnOiAxLCAnUGxheVN0YXRpb24gVml0YSc6IDEgfVxuICAgIH0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBPU2VzIChvcmRlciBpcyBpbXBvcnRhbnQpICovXG4gICAgdmFyIG9zID0gZ2V0T1MoW1xuICAgICAgJ1dpbmRvd3MgUGhvbmUgJyxcbiAgICAgICdBbmRyb2lkJyxcbiAgICAgICdDZW50T1MnLFxuICAgICAgJ0RlYmlhbicsXG4gICAgICAnRmVkb3JhJyxcbiAgICAgICdGcmVlQlNEJyxcbiAgICAgICdHZW50b28nLFxuICAgICAgJ0hhaWt1JyxcbiAgICAgICdLdWJ1bnR1JyxcbiAgICAgICdMaW51eCBNaW50JyxcbiAgICAgICdSZWQgSGF0JyxcbiAgICAgICdTdVNFJyxcbiAgICAgICdVYnVudHUnLFxuICAgICAgJ1h1YnVudHUnLFxuICAgICAgJ0N5Z3dpbicsXG4gICAgICAnU3ltYmlhbiBPUycsXG4gICAgICAnaHB3T1MnLFxuICAgICAgJ3dlYk9TICcsXG4gICAgICAnd2ViT1MnLFxuICAgICAgJ1RhYmxldCBPUycsXG4gICAgICAnTGludXgnLFxuICAgICAgJ01hYyBPUyBYJyxcbiAgICAgICdNYWNpbnRvc2gnLFxuICAgICAgJ01hYycsXG4gICAgICAnV2luZG93cyA5ODsnLFxuICAgICAgJ1dpbmRvd3MgJ1xuICAgIF0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGxheW91dCBlbmdpbmUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbGF5b3V0IGVuZ2luZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRMYXlvdXQoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgUmVnRXhwKCdcXFxcYicgKyAoXG4gICAgICAgICAgZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKVxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIG1hbnVmYWN0dXJlciBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gb2JqZWN0IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbWFudWZhY3R1cmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE1hbnVmYWN0dXJlcihndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgICAgICAvLyBsb29rdXAgdGhlIG1hbnVmYWN0dXJlciBieSBwcm9kdWN0IG9yIHNjYW4gdGhlIFVBIGZvciB0aGUgbWFudWZhY3R1cmVyXG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgKFxuICAgICAgICAgIHZhbHVlW3Byb2R1Y3RdIHx8XG4gICAgICAgICAgdmFsdWVbMC8qT3BlcmEgOS4yNSBmaXgqLywgL15bYS16XSsoPzogK1thLXpdK1xcYikqL2kuZXhlYyhwcm9kdWN0KV0gfHxcbiAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHF1YWxpZnkoa2V5KSArICcoPzpcXFxcYnxcXFxcdypcXFxcZCknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICkgJiYga2V5O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGJyb3dzZXIgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBicm93c2VyIG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TmFtZShndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcbiAgICAgICAgICBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpXG4gICAgICAgICkgKyAnXFxcXGInLCAnaScpLmV4ZWModWEpICYmIChndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgT1MgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBPUyBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9TKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnKD86L1tcXFxcZC5dK3xbIFxcXFx3Ll0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICByZXN1bHQgPSBjbGVhbnVwT1MocmVzdWx0LCBwYXR0ZXJuLCBndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBwcm9kdWN0IG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgcHJvZHVjdCBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFByb2R1Y3QoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKTtcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgKHJlc3VsdCA9XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcgKlxcXFxkK1suXFxcXHdfXSonLCAnaScpLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcoPzo7ICooPzpbYS16XStbXy1dKT9bYS16XStcXFxcZCt8W14gKCk7LV0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAvLyBzcGxpdCBieSBmb3J3YXJkIHNsYXNoIGFuZCBhcHBlbmQgcHJvZHVjdCB2ZXJzaW9uIGlmIG5lZWRlZFxuICAgICAgICAgIGlmICgocmVzdWx0ID0gU3RyaW5nKChndWVzcy5sYWJlbCAmJiAhUmVnRXhwKHBhdHRlcm4sICdpJykudGVzdChndWVzcy5sYWJlbCkpID8gZ3Vlc3MubGFiZWwgOiByZXN1bHQpLnNwbGl0KCcvJykpWzFdICYmICEvW1xcZC5dKy8udGVzdChyZXN1bHRbMF0pKSB7XG4gICAgICAgICAgICByZXN1bHRbMF0gKz0gJyAnICsgcmVzdWx0WzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBjb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwXG4gICAgICAgICAgZ3Vlc3MgPSBndWVzcy5sYWJlbCB8fCBndWVzcztcbiAgICAgICAgICByZXN1bHQgPSBmb3JtYXQocmVzdWx0WzBdXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgZ3Vlc3MpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJzsgKig/OicgKyBndWVzcyArICdbXy1dKT8nLCAnaScpLCAnICcpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJygnICsgZ3Vlc3MgKyAnKVstXy5dPyhcXFxcdyknLCAnaScpLCAnJDEgJDInKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIHRoZSB2ZXJzaW9uIHVzaW5nIGFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYXR0ZXJucyBBbiBhcnJheSBvZiBVQSBwYXR0ZXJucy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCB2ZXJzaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFZlcnNpb24ocGF0dGVybnMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UocGF0dGVybnMsIGZ1bmN0aW9uKHJlc3VsdCwgcGF0dGVybikge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChSZWdFeHAocGF0dGVybiArXG4gICAgICAgICAgJyg/Oi1bXFxcXGQuXSsvfCg/OiBmb3IgW1xcXFx3LV0rKT9bIC8tXSkoW1xcXFxkLl0rW14gKCk7L18tXSopJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fCBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgcGxhdGZvcm0uZGVzY3JpcHRpb25gIHdoZW4gdGhlIHBsYXRmb3JtIG9iamVjdCBpcyBjb2VyY2VkIHRvIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG5hbWUgdG9TdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIGBwbGF0Zm9ybS5kZXNjcmlwdGlvbmAgaWYgYXZhaWxhYmxlLCBlbHNlIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b1N0cmluZ1BsYXRmb3JtKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gY29udmVydCBsYXlvdXQgdG8gYW4gYXJyYXkgc28gd2UgY2FuIGFkZCBleHRyYSBkZXRhaWxzXG4gICAgbGF5b3V0ICYmIChsYXlvdXQgPSBbbGF5b3V0XSk7XG5cbiAgICAvLyBkZXRlY3QgcHJvZHVjdCBuYW1lcyB0aGF0IGNvbnRhaW4gdGhlaXIgbWFudWZhY3R1cmVyJ3MgbmFtZVxuICAgIGlmIChtYW51ZmFjdHVyZXIgJiYgIXByb2R1Y3QpIHtcbiAgICAgIHByb2R1Y3QgPSBnZXRQcm9kdWN0KFttYW51ZmFjdHVyZXJdKTtcbiAgICB9XG4gICAgLy8gY2xlYW4gdXAgR29vZ2xlIFRWXG4gICAgaWYgKChkYXRhID0gL1xcYkdvb2dsZSBUVlxcYi8uZXhlYyhwcm9kdWN0KSkpIHtcbiAgICAgIHByb2R1Y3QgPSBkYXRhWzBdO1xuICAgIH1cbiAgICAvLyBkZXRlY3Qgc2ltdWxhdG9yc1xuICAgIGlmICgvXFxiU2ltdWxhdG9yXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgIHByb2R1Y3QgPSAocHJvZHVjdCA/IHByb2R1Y3QgKyAnICcgOiAnJykgKyAnU2ltdWxhdG9yJztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IE9wZXJhIE1pbmkgOCsgcnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZSBvbiBpT1NcbiAgICBpZiAobmFtZSA9PSAnT3BlcmEgTWluaScgJiYgL1xcYk9QaU9TXFxiLy50ZXN0KHVhKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgncnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZScpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgaU9TXG4gICAgaWYgKC9eaVAvLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIG5hbWUgfHwgKG5hbWUgPSAnU2FmYXJpJyk7XG4gICAgICBvcyA9ICdpT1MnICsgKChkYXRhID0gLyBPUyAoW1xcZF9dKykvaS5leGVjKHVhKSlcbiAgICAgICAgPyAnICcgKyBkYXRhWzFdLnJlcGxhY2UoL18vZywgJy4nKVxuICAgICAgICA6ICcnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IEt1YnVudHVcbiAgICBlbHNlIGlmIChuYW1lID09ICdLb25xdWVyb3InICYmICEvYnVudHUvaS50ZXN0KG9zKSkge1xuICAgICAgb3MgPSAnS3VidW50dSc7XG4gICAgfVxuICAgIC8vIGRldGVjdCBBbmRyb2lkIGJyb3dzZXJzXG4gICAgZWxzZSBpZiAobWFudWZhY3R1cmVyICYmIG1hbnVmYWN0dXJlciAhPSAnR29vZ2xlJyAmJlxuICAgICAgICAoKC9DaHJvbWUvLnRlc3QobmFtZSkgJiYgIS9cXGJNb2JpbGUgU2FmYXJpXFxiL2kudGVzdCh1YSkpIHx8IC9cXGJWaXRhXFxiLy50ZXN0KHByb2R1Y3QpKSkge1xuICAgICAgbmFtZSA9ICdBbmRyb2lkIEJyb3dzZXInO1xuICAgICAgb3MgPSAvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgPyBvcyA6ICdBbmRyb2lkJztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IGZhbHNlIHBvc2l0aXZlcyBmb3IgRmlyZWZveC9TYWZhcmlcbiAgICBlbHNlIGlmICghbmFtZSB8fCAoZGF0YSA9ICEvXFxiTWluZWZpZWxkXFxifFxcKEFuZHJvaWQ7L2kudGVzdCh1YSkgJiYgL1xcYig/OkZpcmVmb3h8U2FmYXJpKVxcYi8uZXhlYyhuYW1lKSkpIHtcbiAgICAgIC8vIGVzY2FwZSB0aGUgYC9gIGZvciBGaXJlZm94IDFcbiAgICAgIGlmIChuYW1lICYmICFwcm9kdWN0ICYmIC9bXFwvLF18XlteKF0rP1xcKS8udGVzdCh1YS5zbGljZSh1YS5pbmRleE9mKGRhdGEgKyAnLycpICsgOCkpKSB7XG4gICAgICAgIC8vIGNsZWFyIG5hbWUgb2YgZmFsc2UgcG9zaXRpdmVzXG4gICAgICAgIG5hbWUgPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gcmVhc3NpZ24gYSBnZW5lcmljIG5hbWVcbiAgICAgIGlmICgoZGF0YSA9IHByb2R1Y3QgfHwgbWFudWZhY3R1cmVyIHx8IG9zKSAmJlxuICAgICAgICAgIChwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCAvXFxiKD86QW5kcm9pZHxTeW1iaWFuIE9TfFRhYmxldCBPU3x3ZWJPUylcXGIvLnRlc3Qob3MpKSkge1xuICAgICAgICBuYW1lID0gL1thLXpdKyg/OiBIYXQpPy9pLmV4ZWMoL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpID8gb3MgOiBkYXRhKSArICcgQnJvd3Nlcic7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBGaXJlZm94IE9TXG4gICAgaWYgKChkYXRhID0gL1xcKChNb2JpbGV8VGFibGV0KS4qP0ZpcmVmb3hcXGIvaS5leGVjKHVhKSkgJiYgZGF0YVsxXSkge1xuICAgICAgb3MgPSAnRmlyZWZveCBPUyc7XG4gICAgICBpZiAoIXByb2R1Y3QpIHtcbiAgICAgICAgcHJvZHVjdCA9IGRhdGFbMV07XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBub24tT3BlcmEgdmVyc2lvbnMgKG9yZGVyIGlzIGltcG9ydGFudClcbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSBnZXRWZXJzaW9uKFtcbiAgICAgICAgJyg/OkNsb3VkOXxDcmlPU3xDck1vfElFTW9iaWxlfElyb258T3BlcmEgP01pbml8T1BpT1N8T1BSfFJhdmVufFNpbGsoPyEvW1xcXFxkLl0rJCkpJyxcbiAgICAgICAgJ1ZlcnNpb24nLFxuICAgICAgICBxdWFsaWZ5KG5hbWUpLFxuICAgICAgICAnKD86RmlyZWZveHxNaW5lZmllbGR8TmV0RnJvbnQpJ1xuICAgICAgXSk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBzdHViYm9ybiBsYXlvdXQgZW5naW5lc1xuICAgIGlmIChsYXlvdXQgPT0gJ2lDYWInICYmIHBhcnNlRmxvYXQodmVyc2lvbikgPiAzKSB7XG4gICAgICBsYXlvdXQgPSBbJ1dlYktpdCddO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGxheW91dCAhPSAnVHJpZGVudCcgJiZcbiAgICAgICAgKGRhdGEgPVxuICAgICAgICAgIC9cXGJPcGVyYVxcYi8udGVzdChuYW1lKSAmJiAoL1xcYk9QUlxcYi8udGVzdCh1YSkgPyAnQmxpbmsnIDogJ1ByZXN0bycpIHx8XG4gICAgICAgICAgL1xcYig/Ok1pZG9yaXxOb29rfFNhZmFyaSlcXGIvaS50ZXN0KHVhKSAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgICFsYXlvdXQgJiYgL1xcYk1TSUVcXGIvaS50ZXN0KHVhKSAmJiAob3MgPT0gJ01hYyBPUycgPyAnVGFzbWFuJyA6ICdUcmlkZW50JylcbiAgICAgICAgKVxuICAgICkge1xuICAgICAgbGF5b3V0ID0gW2RhdGFdO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgTmV0RnJvbnQgb24gUGxheVN0YXRpb25cbiAgICBlbHNlIGlmICgvXFxiUGxheVN0YXRpb25cXGIoPyEgVml0YVxcYikvaS50ZXN0KG5hbWUpICYmIGxheW91dCA9PSAnV2ViS2l0Jykge1xuICAgICAgbGF5b3V0ID0gWydOZXRGcm9udCddO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgV2luZG93cyBQaG9uZSA3IGRlc2t0b3AgbW9kZVxuICAgIGlmIChuYW1lID09ICdJRScgJiYgKGRhdGEgPSAoLzsgKig/OlhCTFdQfFp1bmVXUCkoXFxkKykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIG5hbWUgKz0gJyBNb2JpbGUnO1xuICAgICAgb3MgPSAnV2luZG93cyBQaG9uZSAnICsgKC9cXCskLy50ZXN0KGRhdGEpID8gZGF0YSA6IGRhdGEgKyAnLngnKTtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgV2luZG93cyBQaG9uZSA4KyBkZXNrdG9wIG1vZGVcbiAgICBlbHNlIGlmICgvXFxiV1BEZXNrdG9wXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgIG5hbWUgPSAnSUUgTW9iaWxlJztcbiAgICAgIG9zID0gJ1dpbmRvd3MgUGhvbmUgOCsnO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICB2ZXJzaW9uIHx8ICh2ZXJzaW9uID0gKC9cXGJydjooW1xcZC5dKykvLmV4ZWModWEpIHx8IDApWzFdKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IElFIDExIGFuZCBhYm92ZVxuICAgIGVsc2UgaWYgKG5hbWUgIT0gJ0lFJyAmJiBsYXlvdXQgPT0gJ1RyaWRlbnQnICYmIChkYXRhID0gL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkpKSB7XG4gICAgICBpZiAoIS9cXGJXUERlc2t0b3BcXGIvaS50ZXN0KHVhKSkge1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzICcgKyBuYW1lICsgKHZlcnNpb24gPyAnICcgKyB2ZXJzaW9uIDogJycpKTtcbiAgICAgICAgfVxuICAgICAgICBuYW1lID0gJ0lFJztcbiAgICAgIH1cbiAgICAgIHZlcnNpb24gPSBkYXRhWzFdO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgTWljcm9zb2Z0IEVkZ2VcbiAgICBlbHNlIGlmICgobmFtZSA9PSAnQ2hyb21lJyB8fCBuYW1lICE9ICdJRScpICYmIChkYXRhID0gL1xcYkVkZ2VcXC8oW1xcZC5dKykvLmV4ZWModWEpKSkge1xuICAgICAgbmFtZSA9ICdNaWNyb3NvZnQgRWRnZSc7XG4gICAgICB2ZXJzaW9uID0gZGF0YVsxXTtcbiAgICAgIGxheW91dCA9IFsnVHJpZGVudCddO1xuICAgIH1cbiAgICAvLyBsZXZlcmFnZSBlbnZpcm9ubWVudCBmZWF0dXJlc1xuICAgIGlmICh1c2VGZWF0dXJlcykge1xuICAgICAgLy8gZGV0ZWN0IHNlcnZlci1zaWRlIGVudmlyb25tZW50c1xuICAgICAgLy8gUmhpbm8gaGFzIGEgZ2xvYmFsIGZ1bmN0aW9uIHdoaWxlIG90aGVycyBoYXZlIGEgZ2xvYmFsIG9iamVjdFxuICAgICAgaWYgKGlzSG9zdFR5cGUoY29udGV4dCwgJ2dsb2JhbCcpKSB7XG4gICAgICAgIGlmIChqYXZhKSB7XG4gICAgICAgICAgZGF0YSA9IGphdmEubGFuZy5TeXN0ZW07XG4gICAgICAgICAgYXJjaCA9IGRhdGEuZ2V0UHJvcGVydHkoJ29zLmFyY2gnKTtcbiAgICAgICAgICBvcyA9IG9zIHx8IGRhdGEuZ2V0UHJvcGVydHkoJ29zLm5hbWUnKSArICcgJyArIGRhdGEuZ2V0UHJvcGVydHkoJ29zLnZlcnNpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2R1bGVTY29wZSAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICdzeXN0ZW0nKSAmJiAoZGF0YSA9IFtjb250ZXh0LnN5c3RlbV0pWzBdKSB7XG4gICAgICAgICAgb3MgfHwgKG9zID0gZGF0YVswXS5vcyB8fCBudWxsKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YVsxXSA9IGNvbnRleHQucmVxdWlyZSgncmluZ28vZW5naW5lJykudmVyc2lvbjtcbiAgICAgICAgICAgIHZlcnNpb24gPSBkYXRhWzFdLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIG5hbWUgPSAnUmluZ29KUyc7XG4gICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVswXS5nbG9iYWwuc3lzdGVtID09IGNvbnRleHQuc3lzdGVtKSB7XG4gICAgICAgICAgICAgIG5hbWUgPSAnTmFyd2hhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0LnByb2Nlc3MgPT0gJ29iamVjdCcgJiYgKGRhdGEgPSBjb250ZXh0LnByb2Nlc3MpKSB7XG4gICAgICAgICAgbmFtZSA9ICdOb2RlLmpzJztcbiAgICAgICAgICBhcmNoID0gZGF0YS5hcmNoO1xuICAgICAgICAgIG9zID0gZGF0YS5wbGF0Zm9ybTtcbiAgICAgICAgICB2ZXJzaW9uID0gL1tcXGQuXSsvLmV4ZWMoZGF0YS52ZXJzaW9uKVswXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyaGlubykge1xuICAgICAgICAgIG5hbWUgPSAnUmhpbm8nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBkZXRlY3QgQWRvYmUgQUlSXG4gICAgICBlbHNlIGlmIChnZXRDbGFzc09mKChkYXRhID0gY29udGV4dC5ydW50aW1lKSkgPT0gYWlyUnVudGltZUNsYXNzKSB7XG4gICAgICAgIG5hbWUgPSAnQWRvYmUgQUlSJztcbiAgICAgICAgb3MgPSBkYXRhLmZsYXNoLnN5c3RlbS5DYXBhYmlsaXRpZXMub3M7XG4gICAgICB9XG4gICAgICAvLyBkZXRlY3QgUGhhbnRvbUpTXG4gICAgICBlbHNlIGlmIChnZXRDbGFzc09mKChkYXRhID0gY29udGV4dC5waGFudG9tKSkgPT0gcGhhbnRvbUNsYXNzKSB7XG4gICAgICAgIG5hbWUgPSAnUGhhbnRvbUpTJztcbiAgICAgICAgdmVyc2lvbiA9IChkYXRhID0gZGF0YS52ZXJzaW9uIHx8IG51bGwpICYmIChkYXRhLm1ham9yICsgJy4nICsgZGF0YS5taW5vciArICcuJyArIGRhdGEucGF0Y2gpO1xuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IElFIGNvbXBhdGliaWxpdHkgbW9kZXNcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2MuZG9jdW1lbnRNb2RlID09ICdudW1iZXInICYmIChkYXRhID0gL1xcYlRyaWRlbnRcXC8oXFxkKykvaS5leGVjKHVhKSkpIHtcbiAgICAgICAgLy8gd2UncmUgaW4gY29tcGF0aWJpbGl0eSBtb2RlIHdoZW4gdGhlIFRyaWRlbnQgdmVyc2lvbiArIDQgZG9lc24ndFxuICAgICAgICAvLyBlcXVhbCB0aGUgZG9jdW1lbnQgbW9kZVxuICAgICAgICB2ZXJzaW9uID0gW3ZlcnNpb24sIGRvYy5kb2N1bWVudE1vZGVdO1xuICAgICAgICBpZiAoKGRhdGEgPSArZGF0YVsxXSArIDQpICE9IHZlcnNpb25bMV0pIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdJRSAnICsgdmVyc2lvblsxXSArICcgbW9kZScpO1xuICAgICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJycpO1xuICAgICAgICAgIHZlcnNpb25bMV0gPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHZlcnNpb24gPSBuYW1lID09ICdJRScgPyBTdHJpbmcodmVyc2lvblsxXS50b0ZpeGVkKDEpKSA6IHZlcnNpb25bMF07XG4gICAgICB9XG4gICAgICBvcyA9IG9zICYmIGZvcm1hdChvcyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBwcmVyZWxlYXNlIHBoYXNlc1xuICAgIGlmICh2ZXJzaW9uICYmIChkYXRhID1cbiAgICAgICAgICAvKD86W2FiXXxkcHxwcmV8W2FiXVxcZCtwcmUpKD86XFxkK1xcKz8pPyQvaS5leGVjKHZlcnNpb24pIHx8XG4gICAgICAgICAgLyg/OmFscGhhfGJldGEpKD86ID9cXGQpPy9pLmV4ZWModWEgKyAnOycgKyAodXNlRmVhdHVyZXMgJiYgbmF2LmFwcE1pbm9yVmVyc2lvbikpIHx8XG4gICAgICAgICAgL1xcYk1pbmVmaWVsZFxcYi9pLnRlc3QodWEpICYmICdhJ1xuICAgICAgICApKSB7XG4gICAgICBwcmVyZWxlYXNlID0gL2IvaS50ZXN0KGRhdGEpID8gJ2JldGEnIDogJ2FscGhhJztcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoUmVnRXhwKGRhdGEgKyAnXFxcXCs/JCcpLCAnJykgK1xuICAgICAgICAocHJlcmVsZWFzZSA9PSAnYmV0YScgPyBiZXRhIDogYWxwaGEpICsgKC9cXGQrXFwrPy8uZXhlYyhkYXRhKSB8fCAnJyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBGaXJlZm94IE1vYmlsZVxuICAgIGlmIChuYW1lID09ICdGZW5uZWMnIHx8IG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGIoPzpBbmRyb2lkfEZpcmVmb3ggT1MpXFxiLy50ZXN0KG9zKSkge1xuICAgICAgbmFtZSA9ICdGaXJlZm94IE1vYmlsZSc7XG4gICAgfVxuICAgIC8vIG9ic2N1cmUgTWF4dGhvbidzIHVucmVsaWFibGUgdmVyc2lvblxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ01heHRob24nICYmIHZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoL1xcLltcXGQuXSsvLCAnLngnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IFNpbGsgZGVza3RvcC9hY2NlbGVyYXRlZCBtb2Rlc1xuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1NpbGsnKSB7XG4gICAgICBpZiAoIS9cXGJNb2JpL2kudGVzdCh1YSkpIHtcbiAgICAgICAgb3MgPSAnQW5kcm9pZCc7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgfVxuICAgICAgaWYgKC9BY2NlbGVyYXRlZCAqPSAqdHJ1ZS9pLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2FjY2VsZXJhdGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBYYm94IDM2MCBhbmQgWGJveCBPbmVcbiAgICBlbHNlIGlmICgvXFxiWGJveFxcYi9pLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIG9zID0gbnVsbDtcbiAgICAgIGlmIChwcm9kdWN0ID09ICdYYm94IDM2MCcgJiYgL1xcYklFTW9iaWxlXFxiLy50ZXN0KHVhKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdtb2JpbGUgbW9kZScpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhZGQgbW9iaWxlIHBvc3RmaXhcbiAgICBlbHNlIGlmICgoL14oPzpDaHJvbWV8SUV8T3BlcmEpJC8udGVzdChuYW1lKSB8fCBuYW1lICYmICFwcm9kdWN0ICYmICEvQnJvd3NlcnxNb2JpLy50ZXN0KG5hbWUpKSAmJlxuICAgICAgICAob3MgPT0gJ1dpbmRvd3MgQ0UnIHx8IC9Nb2JpL2kudGVzdCh1YSkpKSB7XG4gICAgICBuYW1lICs9ICcgTW9iaWxlJztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IElFIHBsYXRmb3JtIHByZXZpZXdcbiAgICBlbHNlIGlmIChuYW1lID09ICdJRScgJiYgdXNlRmVhdHVyZXMgJiYgY29udGV4dC5leHRlcm5hbCA9PT0gbnVsbCkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgncGxhdGZvcm0gcHJldmlldycpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgQmxhY2tCZXJyeSBPUyB2ZXJzaW9uXG4gICAgLy8gaHR0cDovL2RvY3MuYmxhY2tiZXJyeS5jb20vZW4vZGV2ZWxvcGVycy9kZWxpdmVyYWJsZXMvMTgxNjkvSFRUUF9oZWFkZXJzX3NlbnRfYnlfQkJfQnJvd3Nlcl8xMjM0OTExXzExLmpzcFxuICAgIGVsc2UgaWYgKCgvXFxiQmxhY2tCZXJyeVxcYi8udGVzdChwcm9kdWN0KSB8fCAvXFxiQkIxMFxcYi8udGVzdCh1YSkpICYmIChkYXRhID1cbiAgICAgICAgICAoUmVnRXhwKHByb2R1Y3QucmVwbGFjZSgvICsvZywgJyAqJykgKyAnLyhbLlxcXFxkXSspJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fFxuICAgICAgICAgIHZlcnNpb25cbiAgICAgICAgKSkge1xuICAgICAgZGF0YSA9IFtkYXRhLCAvQkIxMC8udGVzdCh1YSldO1xuICAgICAgb3MgPSAoZGF0YVsxXSA/IChwcm9kdWN0ID0gbnVsbCwgbWFudWZhY3R1cmVyID0gJ0JsYWNrQmVycnknKSA6ICdEZXZpY2UgU29mdHdhcmUnKSArICcgJyArIGRhdGFbMF07XG4gICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IE9wZXJhIGlkZW50aWZ5aW5nL21hc2tpbmcgaXRzZWxmIGFzIGFub3RoZXIgYnJvd3NlclxuICAgIC8vIGh0dHA6Ly93d3cub3BlcmEuY29tL3N1cHBvcnQva2Ivdmlldy84NDMvXG4gICAgZWxzZSBpZiAodGhpcyAhPSBmb3JPd24gJiYgKFxuICAgICAgICAgIHByb2R1Y3QgIT0gJ1dpaScgJiYgKFxuICAgICAgICAgICAgKHVzZUZlYXR1cmVzICYmIG9wZXJhKSB8fFxuICAgICAgICAgICAgKC9PcGVyYS8udGVzdChuYW1lKSAmJiAvXFxiKD86TVNJRXxGaXJlZm94KVxcYi9pLnRlc3QodWEpKSB8fFxuICAgICAgICAgICAgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGJPUyBYICg/OlxcZCtcXC4pezIsfS8udGVzdChvcykpIHx8XG4gICAgICAgICAgICAobmFtZSA9PSAnSUUnICYmIChcbiAgICAgICAgICAgICAgKG9zICYmICEvXldpbi8udGVzdChvcykgJiYgdmVyc2lvbiA+IDUuNSkgfHxcbiAgICAgICAgICAgICAgL1xcYldpbmRvd3MgWFBcXGIvLnRlc3Qob3MpICYmIHZlcnNpb24gPiA4IHx8XG4gICAgICAgICAgICAgIHZlcnNpb24gPT0gOCAmJiAhL1xcYlRyaWRlbnRcXGIvLnRlc3QodWEpXG4gICAgICAgICAgICApKVxuICAgICAgICAgIClcbiAgICAgICAgKSAmJiAhcmVPcGVyYS50ZXN0KChkYXRhID0gcGFyc2UuY2FsbChmb3JPd24sIHVhLnJlcGxhY2UocmVPcGVyYSwgJycpICsgJzsnKSkpICYmIGRhdGEubmFtZSkge1xuXG4gICAgICAvLyB3aGVuIFwiaW5kZW50aWZ5aW5nXCIsIHRoZSBVQSBjb250YWlucyBib3RoIE9wZXJhIGFuZCB0aGUgb3RoZXIgYnJvd3NlcidzIG5hbWVcbiAgICAgIGRhdGEgPSAnaW5nIGFzICcgKyBkYXRhLm5hbWUgKyAoKGRhdGEgPSBkYXRhLnZlcnNpb24pID8gJyAnICsgZGF0YSA6ICcnKTtcbiAgICAgIGlmIChyZU9wZXJhLnRlc3QobmFtZSkpIHtcbiAgICAgICAgaWYgKC9cXGJJRVxcYi8udGVzdChkYXRhKSAmJiBvcyA9PSAnTWFjIE9TJykge1xuICAgICAgICAgIG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkYXRhID0gJ2lkZW50aWZ5JyArIGRhdGE7XG4gICAgICB9XG4gICAgICAvLyB3aGVuIFwibWFza2luZ1wiLCB0aGUgVUEgY29udGFpbnMgb25seSB0aGUgb3RoZXIgYnJvd3NlcidzIG5hbWVcbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0gJ21hc2snICsgZGF0YTtcbiAgICAgICAgaWYgKG9wZXJhQ2xhc3MpIHtcbiAgICAgICAgICBuYW1lID0gZm9ybWF0KG9wZXJhQ2xhc3MucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSAnT3BlcmEnO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkpIHtcbiAgICAgICAgICBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1c2VGZWF0dXJlcykge1xuICAgICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsYXlvdXQgPSBbJ1ByZXN0byddO1xuICAgICAgZGVzY3JpcHRpb24ucHVzaChkYXRhKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IFdlYktpdCBOaWdodGx5IGFuZCBhcHByb3hpbWF0ZSBDaHJvbWUvU2FmYXJpIHZlcnNpb25zXG4gICAgaWYgKChkYXRhID0gKC9cXGJBcHBsZVdlYktpdFxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIC8vIGNvcnJlY3QgYnVpbGQgZm9yIG51bWVyaWMgY29tcGFyaXNvblxuICAgICAgLy8gKGUuZy4gXCI1MzIuNVwiIGJlY29tZXMgXCI1MzIuMDVcIilcbiAgICAgIGRhdGEgPSBbcGFyc2VGbG9hdChkYXRhLnJlcGxhY2UoL1xcLihcXGQpJC8sICcuMCQxJykpLCBkYXRhXTtcbiAgICAgIC8vIG5pZ2h0bHkgYnVpbGRzIGFyZSBwb3N0Zml4ZWQgd2l0aCBhIGArYFxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgZGF0YVsxXS5zbGljZSgtMSkgPT0gJysnKSB7XG4gICAgICAgIG5hbWUgPSAnV2ViS2l0IE5pZ2h0bHknO1xuICAgICAgICBwcmVyZWxlYXNlID0gJ2FscGhhJztcbiAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgLy8gY2xlYXIgaW5jb3JyZWN0IGJyb3dzZXIgdmVyc2lvbnNcbiAgICAgIGVsc2UgaWYgKHZlcnNpb24gPT0gZGF0YVsxXSB8fFxuICAgICAgICAgIHZlcnNpb24gPT0gKGRhdGFbMl0gPSAoL1xcYlNhZmFyaVxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICAvLyB1c2UgdGhlIGZ1bGwgQ2hyb21lIHZlcnNpb24gd2hlbiBhdmFpbGFibGVcbiAgICAgIGRhdGFbMV0gPSAoL1xcYkNocm9tZVxcLyhbXFxkLl0rKS9pLmV4ZWModWEpIHx8IDApWzFdO1xuICAgICAgLy8gZGV0ZWN0IEJsaW5rIGxheW91dCBlbmdpbmVcbiAgICAgIGlmIChkYXRhWzBdID09IDUzNy4zNiAmJiBkYXRhWzJdID09IDUzNy4zNiAmJiBwYXJzZUZsb2F0KGRhdGFbMV0pID49IDI4ICYmIG5hbWUgIT0gJ0lFJyAmJiBuYW1lICE9ICdNaWNyb3NvZnQgRWRnZScpIHtcbiAgICAgICAgbGF5b3V0ID0gWydCbGluayddO1xuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IEphdmFTY3JpcHRDb3JlXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY3Njg0NzQvaG93LWNhbi1pLWRldGVjdC13aGljaC1qYXZhc2NyaXB0LWVuZ2luZS12OC1vci1qc2MtaXMtdXNlZC1hdC1ydW50aW1lLWluLWFuZHJvaVxuICAgICAgaWYgKCF1c2VGZWF0dXJlcyB8fCAoIWxpa2VDaHJvbWUgJiYgIWRhdGFbMV0pKSB7XG4gICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJ2xpa2UgU2FmYXJpJyk7XG4gICAgICAgIGRhdGEgPSAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA0MDAgPyAxIDogZGF0YSA8IDUwMCA/IDIgOiBkYXRhIDwgNTI2ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNCA/ICc0KycgOiBkYXRhIDwgNTM1ID8gNSA6IGRhdGEgPCA1MzcgPyA2IDogZGF0YSA8IDUzOCA/IDcgOiBkYXRhIDwgNjAxID8gOCA6ICc4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICdsaWtlIENocm9tZScpO1xuICAgICAgICBkYXRhID0gZGF0YVsxXSB8fCAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA1MzAgPyAxIDogZGF0YSA8IDUzMiA/IDIgOiBkYXRhIDwgNTMyLjA1ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNC4wMyA/IDUgOiBkYXRhIDwgNTM0LjA3ID8gNiA6IGRhdGEgPCA1MzQuMTAgPyA3IDogZGF0YSA8IDUzNC4xMyA/IDggOiBkYXRhIDwgNTM0LjE2ID8gOSA6IGRhdGEgPCA1MzQuMjQgPyAxMCA6IGRhdGEgPCA1MzQuMzAgPyAxMSA6IGRhdGEgPCA1MzUuMDEgPyAxMiA6IGRhdGEgPCA1MzUuMDIgPyAnMTMrJyA6IGRhdGEgPCA1MzUuMDcgPyAxNSA6IGRhdGEgPCA1MzUuMTEgPyAxNiA6IGRhdGEgPCA1MzUuMTkgPyAxNyA6IGRhdGEgPCA1MzYuMDUgPyAxOCA6IGRhdGEgPCA1MzYuMTAgPyAxOSA6IGRhdGEgPCA1MzcuMDEgPyAyMCA6IGRhdGEgPCA1MzcuMTEgPyAnMjErJyA6IGRhdGEgPCA1MzcuMTMgPyAyMyA6IGRhdGEgPCA1MzcuMTggPyAyNCA6IGRhdGEgPCA1MzcuMjQgPyAyNSA6IGRhdGEgPCA1MzcuMzYgPyAyNiA6IGxheW91dCAhPSAnQmxpbmsnID8gJzI3JyA6ICcyOCcpO1xuICAgICAgfVxuICAgICAgLy8gYWRkIHRoZSBwb3N0Zml4IG9mIFwiLnhcIiBvciBcIitcIiBmb3IgYXBwcm94aW1hdGUgdmVyc2lvbnNcbiAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdICs9ICcgJyArIChkYXRhICs9IHR5cGVvZiBkYXRhID09ICdudW1iZXInID8gJy54JyA6IC9bLitdLy50ZXN0KGRhdGEpID8gJycgOiAnKycpKTtcbiAgICAgIC8vIG9ic2N1cmUgdmVyc2lvbiBmb3Igc29tZSBTYWZhcmkgMS0yIHJlbGVhc2VzXG4gICAgICBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiAoIXZlcnNpb24gfHwgcGFyc2VJbnQodmVyc2lvbikgPiA0NSkpIHtcbiAgICAgICAgdmVyc2lvbiA9IGRhdGE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBPcGVyYSBkZXNrdG9wIG1vZGVzXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhJyAmJiAgKGRhdGEgPSAvXFxiemJvdnx6dmF2JC8uZXhlYyhvcykpKSB7XG4gICAgICBuYW1lICs9ICcgJztcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgaWYgKGRhdGEgPT0gJ3p2YXYnKSB7XG4gICAgICAgIG5hbWUgKz0gJ01pbmknO1xuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgKz0gJ01vYmlsZSc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhICsgJyQnKSwgJycpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgQ2hyb21lIGRlc2t0b3AgbW9kZVxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgL1xcYkNocm9tZVxcYi8uZXhlYyhsYXlvdXQgJiYgbGF5b3V0WzFdKSkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICBuYW1lID0gJ0Nocm9tZSBNb2JpbGUnO1xuICAgICAgdmVyc2lvbiA9IG51bGw7XG5cbiAgICAgIGlmICgvXFxiT1MgWFxcYi8udGVzdChvcykpIHtcbiAgICAgICAgbWFudWZhY3R1cmVyID0gJ0FwcGxlJztcbiAgICAgICAgb3MgPSAnaU9TIDQuMysnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBzdHJpcCBpbmNvcnJlY3QgT1MgdmVyc2lvbnNcbiAgICBpZiAodmVyc2lvbiAmJiB2ZXJzaW9uLmluZGV4T2YoKGRhdGEgPSAvW1xcZC5dKyQvLmV4ZWMob3MpKSkgPT0gMCAmJlxuICAgICAgICB1YS5pbmRleE9mKCcvJyArIGRhdGEgKyAnLScpID4gLTEpIHtcbiAgICAgIG9zID0gdHJpbShvcy5yZXBsYWNlKGRhdGEsICcnKSk7XG4gICAgfVxuICAgIC8vIGFkZCBsYXlvdXQgZW5naW5lXG4gICAgaWYgKGxheW91dCAmJiAhL1xcYig/OkF2YW50fE5vb2spXFxiLy50ZXN0KG5hbWUpICYmIChcbiAgICAgICAgL0Jyb3dzZXJ8THVuYXNjYXBlfE1heHRob24vLnRlc3QobmFtZSkgfHxcbiAgICAgICAgL14oPzpBZG9iZXxBcm9yYXxCcmVhY2h8TWlkb3JpfE9wZXJhfFBoYW50b218UmVrb25xfFJvY2t8U2xlaXBuaXJ8V2ViKS8udGVzdChuYW1lKSAmJiBsYXlvdXRbMV0pKSB7XG4gICAgICAvLyBkb24ndCBhZGQgbGF5b3V0IGRldGFpbHMgdG8gZGVzY3JpcHRpb24gaWYgdGhleSBhcmUgZmFsc2V5XG4gICAgICAoZGF0YSA9IGxheW91dFtsYXlvdXQubGVuZ3RoIC0gMV0pICYmIGRlc2NyaXB0aW9uLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIC8vIGNvbWJpbmUgY29udGV4dHVhbCBpbmZvcm1hdGlvblxuICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gWycoJyArIGRlc2NyaXB0aW9uLmpvaW4oJzsgJykgKyAnKSddO1xuICAgIH1cbiAgICAvLyBhcHBlbmQgbWFudWZhY3R1cmVyXG4gICAgaWYgKG1hbnVmYWN0dXJlciAmJiBwcm9kdWN0ICYmIHByb2R1Y3QuaW5kZXhPZihtYW51ZmFjdHVyZXIpIDwgMCkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgnb24gJyArIG1hbnVmYWN0dXJlcik7XG4gICAgfVxuICAgIC8vIGFwcGVuZCBwcm9kdWN0XG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goKC9eb24gLy50ZXN0KGRlc2NyaXB0aW9uW2Rlc2NyaXB0aW9uLmxlbmd0aCAtMV0pID8gJycgOiAnb24gJykgKyBwcm9kdWN0KTtcbiAgICB9XG4gICAgLy8gcGFyc2UgT1MgaW50byBhbiBvYmplY3RcbiAgICBpZiAob3MpIHtcbiAgICAgIGRhdGEgPSAvIChbXFxkLitdKykkLy5leGVjKG9zKTtcbiAgICAgIGlzU3BlY2lhbENhc2VkT1MgPSBkYXRhICYmIG9zLmNoYXJBdChvcy5sZW5ndGggLSBkYXRhWzBdLmxlbmd0aCAtIDEpID09ICcvJztcbiAgICAgIG9zID0ge1xuICAgICAgICAnYXJjaGl0ZWN0dXJlJzogMzIsXG4gICAgICAgICdmYW1pbHknOiAoZGF0YSAmJiAhaXNTcGVjaWFsQ2FzZWRPUykgPyBvcy5yZXBsYWNlKGRhdGFbMF0sICcnKSA6IG9zLFxuICAgICAgICAndmVyc2lvbic6IGRhdGEgPyBkYXRhWzFdIDogbnVsbCxcbiAgICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZlcnNpb24gPSB0aGlzLnZlcnNpb247XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmFtaWx5ICsgKCh2ZXJzaW9uICYmICFpc1NwZWNpYWxDYXNlZE9TKSA/ICcgJyArIHZlcnNpb24gOiAnJykgKyAodGhpcy5hcmNoaXRlY3R1cmUgPT0gNjQgPyAnIDY0LWJpdCcgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIC8vIGFkZCBicm93c2VyL09TIGFyY2hpdGVjdHVyZVxuICAgIGlmICgoZGF0YSA9IC9cXGIoPzpBTUR8SUF8V2lufFdPV3x4ODZffHgpNjRcXGIvaS5leGVjKGFyY2gpKSAmJiAhL1xcYmk2ODZcXGIvaS50ZXN0KGFyY2gpKSB7XG4gICAgICBpZiAob3MpIHtcbiAgICAgICAgb3MuYXJjaGl0ZWN0dXJlID0gNjQ7XG4gICAgICAgIG9zLmZhbWlseSA9IG9zLmZhbWlseS5yZXBsYWNlKFJlZ0V4cCgnIConICsgZGF0YSksICcnKTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgICBuYW1lICYmICgvXFxiV09XNjRcXGIvaS50ZXN0KHVhKSB8fFxuICAgICAgICAgICh1c2VGZWF0dXJlcyAmJiAvXFx3KD86ODZ8MzIpJC8udGVzdChuYXYuY3B1Q2xhc3MgfHwgbmF2LnBsYXRmb3JtKSAmJiAhL1xcYldpbjY0OyB4NjRcXGIvaS50ZXN0KHVhKSkpXG4gICAgICApIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnMzItYml0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdWEgfHwgKHVhID0gbnVsbCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxhdGZvcm0gb2JqZWN0LlxuICAgICAqXG4gICAgICogQG5hbWUgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcGxhdGZvcm0gPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF0Zm9ybSBkZXNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0uZGVzY3JpcHRpb24gPSB1YTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBicm93c2VyJ3MgbGF5b3V0IGVuZ2luZS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubGF5b3V0ID0gbGF5b3V0ICYmIGxheW91dFswXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0J3MgbWFudWZhY3R1cmVyLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5tYW51ZmFjdHVyZXIgPSBtYW51ZmFjdHVyZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3Nlci9lbnZpcm9ubWVudC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWxwaGEvYmV0YSByZWxlYXNlIGluZGljYXRvci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ucHJlcmVsZWFzZSA9IHByZXJlbGVhc2U7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvZHVjdCBob3N0aW5nIHRoZSBicm93c2VyLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5wcm9kdWN0ID0gcHJvZHVjdDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBicm93c2VyJ3MgdXNlciBhZ2VudCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnVhID0gdWE7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS52ZXJzaW9uID0gbmFtZSAmJiB2ZXJzaW9uO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG9wZXJhdGluZyBzeXN0ZW0uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5vcyA9IG9zIHx8IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgQ1BVIGFyY2hpdGVjdHVyZSB0aGUgT1MgaXMgYnVpbHQgZm9yLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHR5cGUgbnVtYmVyfG51bGxcbiAgICAgICAqL1xuICAgICAgJ2FyY2hpdGVjdHVyZSc6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGZhbWlseSBvZiB0aGUgT1MuXG4gICAgICAgKlxuICAgICAgICogQ29tbW9uIHZhbHVlcyBpbmNsdWRlOlxuICAgICAgICogXCJXaW5kb3dzXCIsIFwiV2luZG93cyBTZXJ2ZXIgMjAwOCBSMiAvIDdcIiwgXCJXaW5kb3dzIFNlcnZlciAyMDA4IC8gVmlzdGFcIixcbiAgICAgICAqIFwiV2luZG93cyBYUFwiLCBcIk9TIFhcIiwgXCJVYnVudHVcIiwgXCJEZWJpYW5cIiwgXCJGZWRvcmFcIiwgXCJSZWQgSGF0XCIsIFwiU3VTRVwiLFxuICAgICAgICogXCJBbmRyb2lkXCIsIFwiaU9TXCIgYW5kIFwiV2luZG93cyBQaG9uZVwiXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAnZmFtaWx5JzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgT1MuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAndmVyc2lvbic6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgT1Mgc3RyaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIE9TIHN0cmluZy5cbiAgICAgICAqL1xuICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7IHJldHVybiAnbnVsbCc7IH1cbiAgICB9O1xuXG4gICAgcGxhdGZvcm0ucGFyc2UgPSBwYXJzZTtcbiAgICBwbGF0Zm9ybS50b1N0cmluZyA9IHRvU3RyaW5nUGxhdGZvcm07XG5cbiAgICBpZiAocGxhdGZvcm0udmVyc2lvbikge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCh2ZXJzaW9uKTtcbiAgICB9XG4gICAgaWYgKHBsYXRmb3JtLm5hbWUpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQobmFtZSk7XG4gICAgfVxuICAgIGlmIChvcyAmJiBuYW1lICYmICEob3MgPT0gU3RyaW5nKG9zKS5zcGxpdCgnICcpWzBdICYmIChvcyA9PSBuYW1lLnNwbGl0KCcgJylbMF0gfHwgcHJvZHVjdCkpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKHByb2R1Y3QgPyAnKCcgKyBvcyArICcpJyA6ICdvbiAnICsgb3MpO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBwbGF0Zm9ybS5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLmpvaW4oJyAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHBsYXRmb3JtO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gZXhwb3J0IHBsYXRmb3JtXG4gIC8vIHNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIGRlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlIGFsaWFzZWRcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGFyc2UoKTtcbiAgICB9KTtcbiAgfVxuICAvLyBjaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0XG4gIGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcbiAgICAvLyBpbiBOYXJ3aGFsLCBOb2RlLmpzLCBSaGlubyAtcmVxdWlyZSwgb3IgUmluZ29KU1xuICAgIGZvck93bihwYXJzZSgpLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBmcmVlRXhwb3J0c1trZXldID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cbiAgLy8gaW4gYSBicm93c2VyIG9yIFJoaW5vXG4gIGVsc2Uge1xuICAgIHJvb3QucGxhdGZvcm0gPSBwYXJzZSgpO1xuICB9XG59LmNhbGwodGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3BsYXRmb3JtL3BsYXRmb3JtLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJhYThjYjVmYmM3MTBjN2RkZWQ5NzNhMzQxY2VkMmU2Ni5qc1wiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9maWxlLWxvYWRlciEuL34vcGFyYWxsZWxqcy9saWIvZXZhbC5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgXyBmcm9tIFwibG9kYXNoXCI7XG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby12YXItcmVxdWlyZXMgKi9cbmltcG9ydCAqIGFzIGJlbmNobWFyayBmcm9tIFwiYmVuY2htYXJrXCI7XG5jb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoXCJwbGF0Zm9ybVwiKTtcbi8qIHRzbGludDplbmFibGU6bm8tdmFyLXJlcXVpcmVzICovXG5cbmltcG9ydCB7bWFuZGVsYnJvdCBhcyB0cmFuc3BpbGVkUGFyYWxsZWxNYW5kZWxicm90fSBmcm9tIFwiLi90cmFuc3BpbGVkL21hbmRlbGJyb3RcIjtcbmltcG9ydCB7c3luY0tuaWdodFRvdXJzLCBwYXJhbGxlbEtuaWdodFRvdXJzIGFzIHRyYW5zcGlsZWRQYXJhbGxlbEtuaWdodFRvdXJzfSBmcm9tIFwiLi90cmFuc3BpbGVkL2tuaWdodHMtdG91clwiO1xuaW1wb3J0IHtzeW5jTW9udGVDYXJsbyBhcyBzaW1Kc01vbnRlQ2FybG8sIHBhcmFsbGVsTW9udGVDYXJsbyBhcyBzaW1Kc1BhcmFsbGVsTW9udGVDYXJsb30gZnJvbSBcIi4vdHJhbnNwaWxlZC9tb250ZS1jYXJsb1wiO1xuXG5pbXBvcnQge3BhcmFsbGVsS25pZ2h0VG91cnMgYXMgZHluYW1pY1BhcmFsbGVsS25pZ2h0VG91cnN9IGZyb20gXCIuL2R5bmFtaWMva25pZ2h0cy10b3VyXCI7XG5pbXBvcnQge2NyZWF0ZU1hbmRlbE9wdGlvbnMsIHBhcmFsbGVsTWFuZGVsYnJvdCBhcyBkeW5hbWljUGFyYWxsZWxNYW5kZWxicm90LCBzeW5jTWFuZGVsYnJvdH0gZnJvbSBcIi4vZHluYW1pYy9tYW5kZWxicm90XCI7XG5pbXBvcnQge0lNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMsIHN5bmNNb250ZUNhcmxvIGFzIHJhbmRvbU1vbnRlQ2FybG8sIHBhcmFsbGVsTW9udGVDYXJsbyBhcyByYW5kb21QYXJhbGxlbE1vbnRlQ2FybG8sIElQcm9qZWN0fSBmcm9tIFwiLi9keW5hbWljL21vbnRlLWNhcmxvXCI7XG5cbmltcG9ydCB7cGFyYWxsZWxKU01hbmRlbGJyb3R9IGZyb20gXCIuL3BhcmFsbGVsanMvbWFuZGVsYnJvdFwiO1xuaW1wb3J0IHtwYXJhbGxlbEpTTW9udGVDYXJsb30gZnJvbSBcIi4vcGFyYWxsZWxqcy9tb250ZS1jYXJsb1wiO1xuaW1wb3J0IHtwYXJhbGxlbEpTS25pZ2h0VG91cnN9IGZyb20gXCIuL3BhcmFsbGVsanMva25pZ2h0cy10b3VyXCI7XG5cbmxldCBCZW5jaG1hcmsgPSAoYmVuY2htYXJrIGFzIGFueSkucnVuSW5Db250ZXh0KHsgXyB9KTtcbih3aW5kb3cgYXMgYW55KS5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG5cbmNvbnN0IHJ1bkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcnVuXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5jb25zdCBvdXRwdXRUYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0LXRhYmxlXCIpIGFzIEhUTUxUYWJsZUVsZW1lbnQ7XG5jb25zdCBqc29uT3V0cHV0RmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pzb24tb3V0cHV0XCIpIGFzIEhUTUxFbGVtZW50O1xuXG5jb25zdCBzZXRDaGVja2JveGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2lkKj1cIi1zZXRcIl0nKSBhcyBOb2RlTGlzdE9mPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG5jb25zdCBrbmlnaHRSdW5uZXI2eDYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2tuaWdodC1ydW5uZXItNi02XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbnR5cGUgRGVmZXJyZWQgPSB7IHJlc29sdmU6ICgpID0+IHZvaWQgfTtcblxuZnVuY3Rpb24gYWRkQXN5bmNUZXN0KHN1aXRlOiBiZW5jaG1hcmsuU3VpdGUsIHRpdGxlOiBzdHJpbmcsIGZuOiAodGhpczogdW5kZWZpbmVkKSA9PiBQcm9taXNlTGlrZTxhbnk+KSB7XG4gICAgc3VpdGUuYWRkKHRpdGxlLCBmdW5jdGlvbiAodGhpczogYmVuY2htYXJrLCBkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgY29uc3QgYmVuY2htYXJrID0gdGhpcztcbiAgICAgICAgZm4uYXBwbHkodW5kZWZpbmVkLCBbXSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHsgZGVmZXJyZWQucmVzb2x2ZSgpIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yOiBhbnkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIGJlbmNobWFyay5lcnJvciA9IGVycm9yO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICB9LCB7XG4gICAgICAgIGRlZmVyOiB0cnVlXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gYWRkS25pZ2h0Qm9hcmRUZXN0cyhzdWl0ZTogYmVuY2htYXJrLlN1aXRlKSB7XG4gICAgY29uc3QgYm9hcmRTaXplcyA9IGtuaWdodFJ1bm5lcjZ4Ni5jaGVja2VkID8gWzUsIDZdIDogWzVdO1xuXG4gICAgZm9yIChjb25zdCBib2FyZFNpemUgb2YgYm9hcmRTaXplcykge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGBLbmlnaHRzIFRvdXIgKCR7Ym9hcmRTaXplfXgke2JvYXJkU2l6ZX0pYDtcbiAgICAgICAgc3VpdGUuYWRkKGBzeW5jOiAke3RpdGxlfWAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN5bmNLbmlnaHRUb3Vycyh7eDogMCwgeTogMH0sIGJvYXJkU2l6ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFkZEFzeW5jVGVzdChzdWl0ZSwgYHBhcmFsbGVsLWR5bmFtaWM6ICR7dGl0bGV9YCwgKCkgPT4gZHluYW1pY1BhcmFsbGVsS25pZ2h0VG91cnMoe3g6IDAsIHk6IDB9LCBib2FyZFNpemUpKTtcbiAgICAgICAgYWRkQXN5bmNUZXN0KHN1aXRlLCBgcGFyYWxsZWwtdHJhbnNwaWxlZDogJHt0aXRsZX1gLCAoKSA9PiB0cmFuc3BpbGVkUGFyYWxsZWxLbmlnaHRUb3Vycyh7eDogMCwgeTogMH0sIGJvYXJkU2l6ZSkpO1xuICAgICAgICBhZGRBc3luY1Rlc3Qoc3VpdGUsIGBwYXJhbGxlbGpzOiAke3RpdGxlfWAsICgpID0+IHBhcmFsbGVsSlNLbmlnaHRUb3Vycyh7eDogMCwgeTogMH0sIGJvYXJkU2l6ZSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkTW9udGVDYXJsb1Rlc3Qoc3VpdGU6IGJlbmNobWFyay5TdWl0ZSwgb3B0aW9uczogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyAmIHtudW1iZXJPZlByb2plY3RzOiBudW1iZXIsIG51bVJ1bnM6IG51bWJlcn0pIHtcbiAgICBjb25zdCBydW5PcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7XG4gICAgICAgIHByb2plY3RzOiBjcmVhdGVQcm9qZWN0cyhvcHRpb25zLm51bWJlck9mUHJvamVjdHMpXG4gICAgfSk7XG5cbiAgICBjb25zdCBjb25maWdOYW1lID0gYChwcm9qZWN0czogJHtvcHRpb25zLm51bWJlck9mUHJvamVjdHN9LCBydW5zOiAke29wdGlvbnMubnVtUnVucy50b0xvY2FsZVN0cmluZygpfSlgO1xuXG4gICAgc3VpdGUuYWRkKGBzeW5jOiBNb250ZSBDYXJsbyBNYXRoLnJhbmRvbSAke2NvbmZpZ05hbWV9YCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByYW5kb21Nb250ZUNhcmxvKG9wdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgYWRkQXN5bmNUZXN0KHN1aXRlLCBgcGFyYWxsZWwtZHluYW1pYzogTW9udGUgQ2FybG8gTWF0aC5yYW5kb20gJHtjb25maWdOYW1lfWAsICgpID0+IHJhbmRvbVBhcmFsbGVsTW9udGVDYXJsbyhydW5PcHRpb25zKSk7XG4gICAgc3VpdGUuYWRkKGBzeW5jOiBNb250ZSBDYXJsbyBzaW1qcyAke2NvbmZpZ05hbWV9YCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzaW1Kc01vbnRlQ2FybG8ob3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgICBhZGRBc3luY1Rlc3Qoc3VpdGUsIGBwYXJhbGxlbC10cmFuc3BpbGVkOiBNb250ZSBDYXJsbyBzaW1qcyAke2NvbmZpZ05hbWV9YCwgKCkgPT4gc2ltSnNQYXJhbGxlbE1vbnRlQ2FybG8ocnVuT3B0aW9ucykpO1xuICAgIGFkZEFzeW5jVGVzdChzdWl0ZSwgYHBhcmFsbGVsanM6IE1vbnRlIENhcmxvIHNpbWpzICR7Y29uZmlnTmFtZX1gLCAoKSA9PiBwYXJhbGxlbEpTTW9udGVDYXJsbyhydW5PcHRpb25zKSk7XG59XG5cbmZ1bmN0aW9uIGFkZE1vbnRlQ2FybG9UZXN0cyhzdWl0ZTogYmVuY2htYXJrLlN1aXRlKSB7XG4gICAgY29uc3QgbW9udGVDYXJsb09wdGlvbnMgPSB7XG4gICAgICAgIGludmVzdG1lbnRBbW91bnQ6IDYyMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAwLFxuICAgICAgICBudW1ZZWFyczogMTUsXG4gICAgICAgIHBlcmZvcm1hbmNlOiAwLjAzNDAwMDAsXG4gICAgICAgIHNlZWQ6IDEwLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjA4OTYwMDBcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBudW1SdW5zIG9mIFsxMCAqKiA0LCAxMCAqKiA1XSkge1xuICAgICAgICBmb3IgKGNvbnN0IG51bWJlck9mUHJvamVjdHMgb2YgIFsxLCA0LCA4LCAxNl0pIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb250ZUNhcmxvT3B0aW9ucywgeyBudW1iZXJPZlByb2plY3RzLCBudW1SdW5zIH0pO1xuICAgICAgICAgICAgYWRkTW9udGVDYXJsb1Rlc3Qoc3VpdGUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRNYW5kZWxicm90VGVzdHMoc3VpdGU6IGJlbmNobWFyay5TdWl0ZSkge1xuICAgIGNvbnN0IG1hbmRlbGJyb3RIZWlnaHQgPSBwYXJzZUludCgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYW5kZWxicm90LWhlaWdodFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuICAgIGNvbnN0IG1hbmRlbGJyb3RXaWR0aCA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3Qtd2lkdGhcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUsIDEwKTtcbiAgICBjb25zdCBtYW5kZWxicm90SXRlcmF0aW9ucyA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3QtaXRlcmF0aW9uc1wiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuXG4gICAgY29uc3QgbWFuZGVsYnJvdE9wdGlvbnMgPSBjcmVhdGVNYW5kZWxPcHRpb25zKG1hbmRlbGJyb3RXaWR0aCwgbWFuZGVsYnJvdEhlaWdodCwgbWFuZGVsYnJvdEl0ZXJhdGlvbnMpO1xuXG4gICAgc3VpdGUuYWRkKGBzeW5jOiBNYW5kZWxicm90ICR7bWFuZGVsYnJvdFdpZHRofXgke21hbmRlbGJyb3RIZWlnaHR9LCAke21hbmRlbGJyb3RJdGVyYXRpb25zfWAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3luY01hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnMsICgpID0+IHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IG1heFZhbHVlc1BlclRhc2sgb2YgW3VuZGVmaW5lZCwgMSwgNzUsIDE1MCwgMzAwLCA2MDAsIDEyMDBdKSB7XG4gICAgICAgIGxldCB0aXRsZSA9IGBNYW5kZWxicm90ICR7bWFuZGVsYnJvdE9wdGlvbnMuaW1hZ2VXaWR0aH14JHttYW5kZWxicm90T3B0aW9ucy5pbWFnZUhlaWdodH0sICR7bWFuZGVsYnJvdE9wdGlvbnMuaXRlcmF0aW9uc31gO1xuICAgICAgICBpZiAobWF4VmFsdWVzUGVyVGFzaykge1xuICAgICAgICAgICAgdGl0bGUgKz0gYCAoJHttYXhWYWx1ZXNQZXJUYXNrfSlgO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkQXN5bmNUZXN0KHN1aXRlLCBgcGFyYWxsZWwtZHluYW1pYzogJHt0aXRsZX1gLCAoKSA9PiBkeW5hbWljUGFyYWxsZWxNYW5kZWxicm90KG1hbmRlbGJyb3RPcHRpb25zLCB7IG1heFZhbHVlc1BlclRhc2sgfSkpO1xuICAgICAgICBhZGRBc3luY1Rlc3Qoc3VpdGUsIGBwYXJhbGxlbC10cmFuc3BpbGVkOiAke3RpdGxlfWAsICgpID0+IHRyYW5zcGlsZWRQYXJhbGxlbE1hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnMsIHsgbWF4VmFsdWVzUGVyVGFzayB9KSk7XG4gICAgfVxuXG4gICAgYWRkQXN5bmNUZXN0KHN1aXRlLCBgcGFyYWxsZWxqczogTWFuZGVsYnJvdCAke21hbmRlbGJyb3RXaWR0aH14JHttYW5kZWxicm90SGVpZ2h0fSwgJHttYW5kZWxicm90SXRlcmF0aW9uc31gLCAoKSA9PiBwYXJhbGxlbEpTTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucykpO1xufVxuXG5mdW5jdGlvbiBtZWFzdXJlKCkge1xuICAgIGNvbnN0IGFsbFRlc3RzU3VpdGUgPSBuZXcgQmVuY2htYXJrLlN1aXRlKCk7XG5cbiAgICBhZGRNb250ZUNhcmxvVGVzdHMoYWxsVGVzdHNTdWl0ZSk7XG4gICAgYWRkTWFuZGVsYnJvdFRlc3RzKGFsbFRlc3RzU3VpdGUpO1xuICAgIGFkZEtuaWdodEJvYXJkVGVzdHMoYWxsVGVzdHNTdWl0ZSk7XG5cbiAgICBjb25zdCBzdWl0ZSA9IGFsbFRlc3RzU3VpdGUuZmlsdGVyKChiZW5jaG1hcms6IGJlbmNobWFyayAgJiB7bmFtZTogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXRDaGVja2JveGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBjaGVja2JveCA9IHNldENoZWNrYm94ZXNbaV07XG4gICAgICAgICAgICBjb25zdCBwYXJ0cyA9IGNoZWNrYm94LmlkLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBwYXJ0cy5zbGljZSgwLCBwYXJ0cy5sZW5ndGggLSAxKS5qb2luKFwiLVwiKTtcblxuICAgICAgICAgICAgaWYgKGNoZWNrYm94LmNoZWNrZWQgJiYgYmVuY2htYXJrLm5hbWUuc3RhcnRzV2l0aChuYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIHN1aXRlLmZvckVhY2goKGJlbmNobWFyazogYmVuY2htYXJrKSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc3VpdGUuaW5kZXhPZihiZW5jaG1hcmspO1xuXG4gICAgICAgIGJlbmNobWFyay5vbihcImN5Y2xlXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHkgPSBvdXRwdXRUYWJsZS50Qm9kaWVzWzBdIGFzIEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50O1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gYm9keS5yb3dzW2luZGV4XSBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgcm93LmNlbGxzWzJdLnRleHRDb250ZW50ID0gKGJlbmNobWFyay5zdGF0cy5zYW1wbGUubGVuZ3RoICsgMSkgKyBcIlwiO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHN1aXRlLm9uKFwiY3ljbGVcIiwgZnVuY3Rpb24gKGV2ZW50OiBiZW5jaG1hcmsuRXZlbnQpIHtcbiAgICAgICAgYXBwZW5kVGVzdFJlc3VsdHMoZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgc3VpdGUub24oXCJjb21wbGV0ZVwiLCBmdW5jdGlvbiAoZXZlbnQ6IGJlbmNobWFyay5FdmVudCkge1xuICAgICAgICBjb25zdCBiZW5jaG1hcmtzID0gKGV2ZW50LmN1cnJlbnRUYXJnZXQgYXMgYmVuY2htYXJrLlN1aXRlKS5tYXAoKGJlbmNobWFyazogYmVuY2htYXJrICYge25hbWU6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGluZm86IGJlbmNobWFyay50b1N0cmluZyxcbiAgICAgICAgICAgICAgICBuYW1lOiBiZW5jaG1hcmsubmFtZSxcbiAgICAgICAgICAgICAgICBzdGF0czogYmVuY2htYXJrLnN0YXRzLFxuICAgICAgICAgICAgICAgIHRpbWVzOiBiZW5jaG1hcmsudGltZXNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGpzb25PdXRwdXRGaWVsZC50ZXh0Q29udGVudCA9IEpTT04uc3RyaW5naWZ5KHsgYmVuY2htYXJrcywgcGxhdGZvcm19LCB1bmRlZmluZWQsIFwiICAgIFwiKTtcbiAgICAgICAgcnVuQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBzdWl0ZS5vbihcInN0YXJ0XCIsIGluaXRSZXN1bHRUYWJsZSk7XG5cbiAgICBzdWl0ZS5ydW4oe2FzeW5jOiB0cnVlIH0pO1xufVxuXG5ydW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudDogTW91c2VFdmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgcnVuQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBtZWFzdXJlKCk7XG59KTtcblxuZnVuY3Rpb24gaW5pdFJlc3VsdFRhYmxlKGV2ZW50OiBiZW5jaG1hcmsuRXZlbnQpIHtcbiAgICBjbGVhck91dHB1dFRhYmxlKCk7XG5cbiAgICBmdW5jdGlvbiBjbGVhck91dHB1dFRhYmxlKCkge1xuICAgICAgICB3aGlsZSAob3V0cHV0VGFibGUudEJvZGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBvdXRwdXRUYWJsZS5yZW1vdmVDaGlsZChvdXRwdXRUYWJsZS50Qm9kaWVzWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGJvZHkgPSBvdXRwdXRUYWJsZS5jcmVhdGVUQm9keSgpO1xuICAgIChldmVudC5jdXJyZW50VGFyZ2V0IGFzIEFycmF5PGJlbmNobWFyay5PcHRpb25zPikuZm9yRWFjaChzdWl0ZSA9PiB7XG4gICAgICAgIGNvbnN0IHJvdyA9IGJvZHkuaW5zZXJ0Um93KCk7XG4gICAgICAgIGNvbnN0IFtzZXQsIC4uLm5hbWVQYXJ0c10gPSBzdWl0ZS5uYW1lIS5zcGxpdChcIjpcIik7XG5cbiAgICAgICAgcm93Lmluc2VydENlbGwoKS50ZXh0Q29udGVudCA9IHNldDtcbiAgICAgICAgcm93Lmluc2VydENlbGwoKS50ZXh0Q29udGVudCA9IG5hbWVQYXJ0cy5qb2luKFwiOlwiKTtcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IChvdXRwdXRUYWJsZS50SGVhZC5yb3dzWzBdIGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQpLmNlbGxzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW5zOyArK2kpIHtcbiAgICAgICAgICAgIHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kVGVzdFJlc3VsdHMoZXZlbnQ6IGJlbmNobWFyay5FdmVudCkge1xuICAgIGNvbnN0IGJvZHkgPSBvdXRwdXRUYWJsZS50Qm9kaWVzWzBdIGFzIEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50O1xuICAgIGNvbnN0IGJlbmNobWFyayA9IGV2ZW50LnRhcmdldCBhcyAoYmVuY2htYXJrKTtcbiAgICBjb25zdCBpbmRleCA9IChldmVudC5jdXJyZW50VGFyZ2V0IGFzIEFycmF5PGJlbmNobWFyaz4pLmluZGV4T2YoYmVuY2htYXJrKTtcbiAgICBjb25zdCByb3cgPSBib2R5LnJvd3NbaW5kZXhdIGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG5cbiAgICByb3cuY2VsbHNbM10udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMuZGV2aWF0aW9uLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzRdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLm1lYW4udG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbNV0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMubW9lLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzZdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLnJtZS50b0ZpeGVkKDQpO1xuICAgIHJvdy5jZWxsc1s3XS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy5zZW0udG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbOF0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMudmFyaWFuY2UudG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbOV0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMuc2FtcGxlLmxlbmd0aC50b0ZpeGVkKDApO1xuICAgIHJvdy5jZWxsc1sxMF0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuaHoudG9GaXhlZCg0KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdHMoY291bnQ6IG51bWJlcik6IElQcm9qZWN0W10ge1xuICAgIGNvbnN0IHByb2plY3RzOiBJUHJvamVjdFtdID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgcHJvamVjdHMucHVzaCh7XG4gICAgICAgICAgICBzdGFydFllYXI6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE1KSxcbiAgICAgICAgICAgIHRvdGFsQW1vdW50OiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9qZWN0cztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wZXJmb3JtYW5jZS1tZWFzdXJlbWVudC50cyJdLCJzb3VyY2VSb290IjoiIn0=