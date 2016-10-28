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
        result += ': ' + join(error);
      } else {
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
      'version': '2.1.1'
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
        suite.add("parallel-dynamic: " + title, function (deferred) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__dynamic_knights_tour__["a" /* parallelKnightTours */])({ x: 0, y: 0 }, boardSize).then(function () {
                return deferred.resolve();
            }, function () {
                return deferred.resolve();
            });
        }, { defer: true });
        suite.add("parallel-transpiled: " + title, function (deferred) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__transpiled_knights_tour__["a" /* parallelKnightTours */])({ x: 0, y: 0 }, boardSize).then(function () {
                return deferred.resolve();
            }, function () {
                return deferred.resolve();
            });
        }, { defer: true });
        suite.add("paralleljs: " + title, function (deferred) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__paralleljs_knights_tour__["a" /* parallelJSKnightTours */])({ x: 0, y: 0 }, boardSize).then(function (result) {
                console.log(result);deferred.resolve();
            }, function () {
                return deferred.resolve();
            });
        }, { defer: true });
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
    suite.add("parallel-dynamic: Monte Carlo Math.random " + configName, function (deferred) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__dynamic_monte_carlo__["b" /* parallelMonteCarlo */])(runOptions).then(function () {
            return deferred.resolve();
        }, function () {
            return deferred.resolve();
        });
    }, { defer: true });
    suite.add("sync: Monte Carlo simjs " + configName, function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["b" /* syncMonteCarlo */])(options);
    });
    suite.add("parallel-transpiled: Monte Carlo simjs " + configName, function (deferred) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__transpiled_monte_carlo__["a" /* parallelMonteCarlo */])(runOptions).then(function () {
            return deferred.resolve();
        }, function () {
            return deferred.resolve();
        });
    }, { defer: true });
    suite.add("paralleljs: Monte Carlo simjs " + configName, function (deferred) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__paralleljs_monte_carlo__["a" /* parallelJSMonteCarlo */])(runOptions).then(function () {
            return deferred.resolve();
        }, function (error) {
            console.error("Test failed", error);
            deferred.resolve();
        });
    }, { defer: true });
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
    var _arr = [1, 4, 8, 16];
    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
        var numberOfProjects = _arr[_i2];var _arr2 = [Math.pow(10, 4), Math.pow(10, 5), Math.pow(10, 6)];

        for (var _i3 = 0; _i3 < _arr2.length; _i3++) {
            var numRuns = _arr2[_i3];
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
        var title = "Mandelbrot " + mandelbrotOptions.imageWidth + "x" + mandelbrotOptions.imageHeight + ", " + mandelbrotOptions.iterations + " (" + maxValuesPerTask + ")";
        suite.add("parallel-dynamic: " + title, function (deferred) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_mandelbrot__["c" /* parallelMandelbrot */])(mandelbrotOptions, { maxValuesPerTask: maxValuesPerTask }).then(function () {
                return deferred.resolve();
            }, function () {
                return deferred.resolve();
            });
        }, { defer: true });
        suite.add("parallel-transpiled: " + title, function (deferred) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__transpiled_mandelbrot__["a" /* mandelbrot */])(mandelbrotOptions, { maxValuesPerTask: maxValuesPerTask }).then(function () {
                return deferred.resolve();
            }, function () {
                return deferred.resolve();
            });
        }, { defer: true });
    };

    for (var _i4 = 0; _i4 < _arr3.length; _i4++) {
        _loop2();
    }
    suite.add("paralleljs: Mandelbrot " + mandelbrotWidth + "x" + mandelbrotHeight + ", " + mandelbrotIterations, function (deferred) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__paralleljs_mandelbrot__["a" /* parallelJSMandelbrot */])(mandelbrotOptions).then(function () {
            return deferred.resolve();
        }, function (error) {
            console.error("Test failed", error);
            deferred.resolve();
        });
    }, { defer: true });
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
    row.cells[2].textContent = benchmark.stats.deviation.toFixed(4);
    row.cells[3].textContent = benchmark.stats.mean.toFixed(4);
    row.cells[4].textContent = benchmark.stats.moe.toFixed(4);
    row.cells[5].textContent = benchmark.stats.rme.toFixed(4);
    row.cells[6].textContent = benchmark.stats.sem.toFixed(4);
    row.cells[7].textContent = benchmark.stats.variance.toFixed(4);
    row.cells[8].textContent = benchmark.stats.sample.length.toFixed(0);
    row.cells[9].textContent = benchmark.hz.toFixed(4);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L3BhcmFsbGVsanMvbGliL3BhcmFsbGVsLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJhbGxlbGpzL2tuaWdodHMtdG91ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyYWxsZWxqcy9tYW5kZWxicm90LnRzIiwid2VicGFjazovLy8uL3NyYy9wYXJhbGxlbGpzL21vbnRlLWNhcmxvLnRzIiwid2VicGFjazovLy8uL34vYmVuY2htYXJrL2JlbmNobWFyay5qcyIsIndlYnBhY2s6Ly8vLi9+L3BsYXRmb3JtL3BsYXRmb3JtLmpzIiwid2VicGFjazovLy8uL34vcGFyYWxsZWxqcy9saWIvZXZhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGVyZm9ybWFuY2UtbWVhc3VyZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDs7QUFFeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsNEJBQTRCO0FBQzlDO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQSxtQkFBbUIsZ0NBQWdDO0FBQ25EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRyxpQ0FBaUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQ0FBcUMsa0JBQWtCOztBQUV2RDtBQUNBO0FB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O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LE1BQU07QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDJCQUEyQjtBQUNuRCxxQkFBcUIsNkRBQTZEO0FBQ2xGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QiwwQkFBMEI7QUFDMUIsNEJBQTRCO0FBQzVCLDhCQUE4QjtBQUM5Qix5QkFBeUI7QUFDekI7QUFDQSxtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCLGVBQWU7QUFDZixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxZQUFZO0FBQ1osVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7O3NEQzF2RkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxHQUFHO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtGQUFrRjs7QUFFbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUZBQXlGO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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TUFBRyxHQUFZLGNBQVksVUFBRyxHQUFRLFFBQ25EO0FBQUM7QUFFRCx3QkFBcUM7QUFDakMsUUFBYyxXQUFrQjtBQUU1QixTQUFDLElBQUssSUFBSSxHQUFHLElBQVEsT0FBRSxFQUFHLEdBQUc7QUFDckIsaUJBQUs7QUFDQSx1QkFBTSxLQUFNLE1BQUssS0FBUyxXQUFNO0FBQzlCLHlCQUFNLEtBQU0sTUFBSyxLQUFTLFdBRTdDO0FBSmtCO0FBSWpCO0FBRUssV0FDVjtBQUFDLEMiLCJmaWxlIjoicGVyZm9ybWFuY2UtbWVhc3VyZW1lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsi77u/KGZ1bmN0aW9uICgpIHtcblx0dmFyIGlzQ29tbW9uSlMgPSB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cztcblx0dmFyIGlzTm9kZSA9ICEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdGhpcyA9PT0gd2luZG93KTtcblx0dmFyIHNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZSB8fCBmdW5jdGlvbiAoY2IpIHtcblx0XHRzZXRUaW1lb3V0KGNiLCAwKTtcblx0fTtcblx0dmFyIFdvcmtlciA9IGlzTm9kZSA/IHJlcXVpcmUoX19kaXJuYW1lICsgJy9Xb3JrZXIuanMnKSA6IHNlbGYuV29ya2VyO1xuXHR2YXIgVVJMID0gdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnID8gKHNlbGYuVVJMID8gc2VsZi5VUkwgOiBzZWxmLndlYmtpdFVSTCkgOiBudWxsO1xuXHR2YXIgX3N1cHBvcnRzID0gKGlzTm9kZSB8fCBzZWxmLldvcmtlcikgPyB0cnVlIDogZmFsc2U7IC8vIG5vZGUgYWx3YXlzIHN1cHBvcnRzIHBhcmFsbGVsXG5cblx0ZnVuY3Rpb24gZXh0ZW5kKGZyb20sIHRvKSB7XG5cdFx0aWYgKCF0bykgdG8gPSB7fTtcblx0XHRmb3IgKHZhciBpIGluIGZyb20pIHtcblx0XHRcdGlmICh0b1tpXSA9PT0gdW5kZWZpbmVkKSB0b1tpXSA9IGZyb21baV07XG5cdFx0fVxuXHRcdHJldHVybiB0bztcblx0fVxuXG5cdGZ1bmN0aW9uIE9wZXJhdGlvbigpIHtcblx0XHR0aGlzLl9jYWxsYmFja3MgPSBbXTtcblx0XHR0aGlzLl9lcnJDYWxsYmFja3MgPSBbXTtcblxuXHRcdHRoaXMuX3Jlc29sdmVkID0gMDtcblx0XHR0aGlzLl9yZXN1bHQgPSBudWxsO1xuXHR9XG5cblx0T3BlcmF0aW9uLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24gKGVyciwgcmVzKSB7XG5cdFx0aWYgKCFlcnIpIHtcblx0XHRcdHRoaXMuX3Jlc29sdmVkID0gMTtcblx0XHRcdHRoaXMuX3Jlc3VsdCA9IHJlcztcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9jYWxsYmFja3MubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dGhpcy5fY2FsbGJhY2tzW2ldKHJlcyk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3Jlc29sdmVkID0gMjtcblx0XHRcdHRoaXMuX3Jlc3VsdCA9IGVycjtcblxuXHRcdFx0Zm9yICh2YXIgaUUgPSAwOyBpRSA8IHRoaXMuX2VyckNhbGxiYWNrcy5sZW5ndGg7ICsraUUpIHtcblx0XHRcdFx0dGhpcy5fZXJyQ2FsbGJhY2tzW2lFXShlcnIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX2NhbGxiYWNrcyA9IFtdO1xuXHRcdHRoaXMuX2VyckNhbGxiYWNrcyA9IFtdO1xuXHR9O1xuXG5cdE9wZXJhdGlvbi5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChjYiwgZXJyQ2IpIHtcblx0XHRpZiAodGhpcy5fcmVzb2x2ZWQgPT09IDEpIHsgLy8gcmVzdWx0XG5cdFx0XHRpZiAoY2IpIHtcblx0XHRcdFx0Y2IodGhpcy5fcmVzdWx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fcmVzb2x2ZWQgPT09IDIpIHsgLy8gZXJyb3Jcblx0XHRcdGlmIChlcnJDYikge1xuXHRcdFx0XHRlcnJDYih0aGlzLl9yZXN1bHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmIChjYikge1xuXHRcdFx0dGhpcy5fY2FsbGJhY2tzW3RoaXMuX2NhbGxiYWNrcy5sZW5ndGhdID0gY2I7XG5cdFx0fVxuXG5cdFx0aWYgKGVyckNiKSB7XG5cdFx0XHR0aGlzLl9lcnJDYWxsYmFja3NbdGhpcy5fZXJyQ2FsbGJhY2tzLmxlbmd0aF0gPSBlcnJDYjtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0dmFyIGRlZmF1bHRzID0ge1xuXHRcdGV2YWxQYXRoOiBpc05vZGUgPyBfX2Rpcm5hbWUgKyAnL2V2YWwuanMnIDogbnVsbCxcblx0XHRtYXhXb3JrZXJzOiBpc05vZGUgPyByZXF1aXJlKCdvcycpLmNwdXMoKS5sZW5ndGggOiAobmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3kgfHwgNCksXG5cdFx0c3luY2hyb25vdXM6IHRydWUsXG5cdFx0ZW52OiB7fSxcblx0XHRlbnZOYW1lc3BhY2U6ICdlbnYnXG5cdH07XG5cblx0ZnVuY3Rpb24gUGFyYWxsZWwoZGF0YSwgb3B0aW9ucykge1xuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0dGhpcy5vcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcblx0XHR0aGlzLm9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb24oKTtcblx0XHR0aGlzLm9wZXJhdGlvbi5yZXNvbHZlKG51bGwsIHRoaXMuZGF0YSk7XG5cdFx0dGhpcy5yZXF1aXJlZFNjcmlwdHMgPSBbXTtcblx0XHR0aGlzLnJlcXVpcmVkRnVuY3Rpb25zID0gW107XG5cdH1cblxuXHQvLyBzdGF0aWMgbWV0aG9kXG5cdFBhcmFsbGVsLmlzU3VwcG9ydGVkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX3N1cHBvcnRzOyB9XG5cblx0UGFyYWxsZWwucHJvdG90eXBlLmdldFdvcmtlclNvdXJjZSA9IGZ1bmN0aW9uIChjYiwgZW52KSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHZhciBwcmVTdHIgPSAnJztcblx0XHR2YXIgaSA9IDA7XG5cdFx0aWYgKCFpc05vZGUgJiYgdGhpcy5yZXF1aXJlZFNjcmlwdHMubGVuZ3RoICE9PSAwKSB7XG5cdFx0XHRwcmVTdHIgKz0gJ2ltcG9ydFNjcmlwdHMoXCInICsgdGhpcy5yZXF1aXJlZFNjcmlwdHMuam9pbignXCIsXCInKSArICdcIik7XFxyXFxuJztcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5yZXF1aXJlZEZ1bmN0aW9ucy5sZW5ndGg7ICsraSkge1xuXHRcdFx0aWYgKHRoaXMucmVxdWlyZWRGdW5jdGlvbnNbaV0ubmFtZSkge1xuXHRcdFx0XHRwcmVTdHIgKz0gJ3ZhciAnICsgdGhpcy5yZXF1aXJlZEZ1bmN0aW9uc1tpXS5uYW1lICsgJyA9ICcgKyB0aGlzLnJlcXVpcmVkRnVuY3Rpb25zW2ldLmZuLnRvU3RyaW5nKCkgKyAnOyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwcmVTdHIgKz0gdGhpcy5yZXF1aXJlZEZ1bmN0aW9uc1tpXS5mbi50b1N0cmluZygpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGVudiA9IEpTT04uc3RyaW5naWZ5KGVudiB8fCB7fSk7XG5cblx0XHR2YXIgbnMgPSB0aGlzLm9wdGlvbnMuZW52TmFtZXNwYWNlO1xuXG5cdFx0aWYgKGlzTm9kZSkge1xuXHRcdFx0cmV0dXJuIHByZVN0ciArICdwcm9jZXNzLm9uKFwibWVzc2FnZVwiLCBmdW5jdGlvbihlKSB7Z2xvYmFsLicgKyBucyArICcgPSAnICsgZW52ICsgJztwcm9jZXNzLnNlbmQoSlNPTi5zdHJpbmdpZnkoKCcgKyBjYi50b1N0cmluZygpICsgJykoSlNPTi5wYXJzZShlKS5kYXRhKSkpfSknO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gcHJlU3RyICsgJ3NlbGYub25tZXNzYWdlID0gZnVuY3Rpb24oZSkge3ZhciBnbG9iYWwgPSB7fTsgZ2xvYmFsLicgKyBucyArICcgPSAnICsgZW52ICsgJztzZWxmLnBvc3RNZXNzYWdlKCgnICsgY2IudG9TdHJpbmcoKSArICcpKGUuZGF0YSkpfSc7XG5cdFx0fVxuXHR9O1xuXG5cdFBhcmFsbGVsLnByb3RvdHlwZS5yZXF1aXJlID0gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSxcblx0XHRcdGZ1bmM7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdGZ1bmMgPSBhcmdzW2ldO1xuXG5cdFx0XHRpZiAodHlwZW9mIGZ1bmMgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMucmVxdWlyZWRTY3JpcHRzLnB1c2goZnVuYyk7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBmdW5jID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHRoaXMucmVxdWlyZWRGdW5jdGlvbnMucHVzaCh7IGZuOiBmdW5jIH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgZnVuYyA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0dGhpcy5yZXF1aXJlZEZ1bmN0aW9ucy5wdXNoKGZ1bmMpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9O1xuXG5cdFBhcmFsbGVsLnByb3RvdHlwZS5fc3Bhd25Xb3JrZXIgPSBmdW5jdGlvbiAoY2IsIGVudikge1xuXHRcdHZhciB3cms7XG5cdFx0dmFyIHNyYyA9IHRoaXMuZ2V0V29ya2VyU291cmNlKGNiLCBlbnYpO1xuXHRcdGlmIChpc05vZGUpIHtcblx0XHRcdHdyayA9IG5ldyBXb3JrZXIodGhpcy5vcHRpb25zLmV2YWxQYXRoKTtcblx0XHRcdHdyay5wb3N0TWVzc2FnZShzcmMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoV29ya2VyID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKHRoaXMucmVxdWlyZWRTY3JpcHRzLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZXZhbFBhdGggIT09IG51bGwpIHtcblx0XHRcdFx0XHRcdHdyayA9IG5ldyBXb3JrZXIodGhpcy5vcHRpb25zLmV2YWxQYXRoKTtcblx0XHRcdFx0XHRcdHdyay5wb3N0TWVzc2FnZShzcmMpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgdXNlIHJlcXVpcmVkIHNjcmlwdHMgd2l0aG91dCBldmFsLmpzIScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICghVVJMKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGNyZWF0ZSBhIGJsb2IgVVJMIGluIHRoaXMgYnJvd3NlciEnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtzcmNdLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH0pO1xuXHRcdFx0XHRcdHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdFx0XHRcdFx0d3JrID0gbmV3IFdvcmtlcih1cmwpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdGlmICh0aGlzLm9wdGlvbnMuZXZhbFBhdGggIT09IG51bGwpIHsgLy8gYmxvYi91cmwgdW5zdXBwb3J0ZWQsIGNyb3NzLW9yaWdpbiBlcnJvclxuXHRcdFx0XHRcdHdyayA9IG5ldyBXb3JrZXIodGhpcy5vcHRpb25zLmV2YWxQYXRoKTtcblx0XHRcdFx0XHR3cmsucG9zdE1lc3NhZ2Uoc3JjKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aHJvdyBlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHdyaztcblx0fTtcblxuXHRQYXJhbGxlbC5wcm90b3R5cGUuc3Bhd24gPSBmdW5jdGlvbiAoY2IsIGVudikge1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHR2YXIgbmV3T3AgPSBuZXcgT3BlcmF0aW9uKCk7XG5cblx0XHRlbnYgPSBleHRlbmQodGhpcy5vcHRpb25zLmVudiwgZW52IHx8IHt9KTtcblxuXHRcdHRoaXMub3BlcmF0aW9uLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHdyayA9IHRoYXQuX3NwYXduV29ya2VyKGNiLCBlbnYpO1xuXHRcdFx0aWYgKHdyayAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHdyay5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG5cdFx0XHRcdFx0d3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0XHRcdHRoYXQuZGF0YSA9IG1zZy5kYXRhO1xuXHRcdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhKTtcblx0XHRcdFx0fTtcblx0XHRcdFx0d3JrLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRcdHdyay50ZXJtaW5hdGUoKTtcblx0XHRcdFx0XHRuZXdPcC5yZXNvbHZlKGUsIG51bGwpO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHR3cmsucG9zdE1lc3NhZ2UodGhhdC5kYXRhKTtcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5vcHRpb25zLnN5bmNocm9ub3VzKSB7XG5cdFx0XHRcdHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHRoYXQuZGF0YSA9IGNiKHRoYXQuZGF0YSk7XG5cdFx0XHRcdFx0XHRuZXdPcC5yZXNvbHZlKG51bGwsIHRoYXQuZGF0YSk7XG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0bmV3T3AucmVzb2x2ZShlLCBudWxsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXb3JrZXJzIGRvIG5vdCBleGlzdCBhbmQgc3luY2hyb25vdXMgb3BlcmF0aW9uIG5vdCBhbGxvd2VkIScpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub3BlcmF0aW9uID0gbmV3T3A7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0UGFyYWxsZWwucHJvdG90eXBlLl9zcGF3bk1hcFdvcmtlciA9IGZ1bmN0aW9uIChpLCBjYiwgZG9uZSwgZW52LCB3cmspIHtcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cblx0XHRpZiAoIXdyaykgd3JrID0gdGhhdC5fc3Bhd25Xb3JrZXIoY2IsIGVudik7XG5cblx0XHRpZiAod3JrICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHdyay5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVtpXSA9IG1zZy5kYXRhO1xuXHRcdFx0XHRkb25lKG51bGwsIHdyayk7XG5cdFx0XHR9O1xuXHRcdFx0d3JrLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR3cmsudGVybWluYXRlKCk7XG5cdFx0XHRcdGRvbmUoZSk7XG5cdFx0XHR9O1xuXHRcdFx0d3JrLnBvc3RNZXNzYWdlKHRoYXQuZGF0YVtpXSk7XG5cdFx0fSBlbHNlIGlmICh0aGF0Lm9wdGlvbnMuc3luY2hyb25vdXMpIHtcblx0XHRcdHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVtpXSA9IGNiKHRoYXQuZGF0YVtpXSk7XG5cdFx0XHRcdGRvbmUoKTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dvcmtlcnMgZG8gbm90IGV4aXN0IGFuZCBzeW5jaHJvbm91cyBvcGVyYXRpb24gbm90IGFsbG93ZWQhJyk7XG5cdFx0fVxuXHR9O1xuXG5cdFBhcmFsbGVsLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAoY2IsIGVudikge1xuXHRcdGVudiA9IGV4dGVuZCh0aGlzLm9wdGlvbnMuZW52LCBlbnYgfHwge30pO1xuXG5cdFx0aWYgKCF0aGlzLmRhdGEubGVuZ3RoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zcGF3bihjYiwgZW52KTtcblx0XHR9XG5cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0dmFyIHN0YXJ0ZWRPcHMgPSAwO1xuXHRcdHZhciBkb25lT3BzID0gMDtcblx0XHRmdW5jdGlvbiBkb25lKGVyciwgd3JrKSB7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUoZXJyLCBudWxsKTtcblx0XHRcdH0gZWxzZSBpZiAoKytkb25lT3BzID09PSB0aGF0LmRhdGEubGVuZ3RoKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhKTtcblx0XHRcdFx0aWYgKHdyaykgd3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0fSBlbHNlIGlmIChzdGFydGVkT3BzIDwgdGhhdC5kYXRhLmxlbmd0aCkge1xuXHRcdFx0XHR0aGF0Ll9zcGF3bk1hcFdvcmtlcihzdGFydGVkT3BzKyssIGNiLCBkb25lLCBlbnYsIHdyayk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAod3JrKSB3cmsudGVybWluYXRlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIG5ld09wID0gbmV3IE9wZXJhdGlvbigpO1xuXHRcdHRoaXMub3BlcmF0aW9uLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0Zm9yICg7IHN0YXJ0ZWRPcHMgLSBkb25lT3BzIDwgdGhhdC5vcHRpb25zLm1heFdvcmtlcnMgJiYgc3RhcnRlZE9wcyA8IHRoYXQuZGF0YS5sZW5ndGg7ICsrc3RhcnRlZE9wcykge1xuXHRcdFx0XHR0aGF0Ll9zcGF3bk1hcFdvcmtlcihzdGFydGVkT3BzLCBjYiwgZG9uZSwgZW52KTtcblx0XHRcdH1cblx0XHR9LCBmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRuZXdPcC5yZXNvbHZlKGVyciwgbnVsbCk7XG5cdFx0fSk7XG5cdFx0dGhpcy5vcGVyYXRpb24gPSBuZXdPcDtcblx0XHRyZXR1cm4gdGhpcztcblx0fTtcblxuXHRQYXJhbGxlbC5wcm90b3R5cGUuX3NwYXduUmVkdWNlV29ya2VyID0gZnVuY3Rpb24gKGRhdGEsIGNiLCBkb25lLCBlbnYsIHdyaykge1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRpZiAoIXdyaykgd3JrID0gdGhhdC5fc3Bhd25Xb3JrZXIoY2IsIGVudik7XG5cblx0XHRpZiAod3JrICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHdyay5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobXNnKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVt0aGF0LmRhdGEubGVuZ3RoXSA9IG1zZy5kYXRhO1xuXHRcdFx0XHRkb25lKG51bGwsIHdyayk7XG5cdFx0XHR9O1xuXHRcdFx0d3JrLm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHR3cmsudGVybWluYXRlKCk7XG5cdFx0XHRcdGRvbmUoZSwgbnVsbCk7XG5cdFx0XHR9XG5cdFx0XHR3cmsucG9zdE1lc3NhZ2UoZGF0YSk7XG5cdFx0fSBlbHNlIGlmICh0aGF0Lm9wdGlvbnMuc3luY2hyb25vdXMpIHtcblx0XHRcdHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHRoYXQuZGF0YVt0aGF0LmRhdGEubGVuZ3RoXSA9IGNiKGRhdGEpO1xuXHRcdFx0XHRkb25lKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdXb3JrZXJzIGRvIG5vdCBleGlzdCBhbmQgc3luY2hyb25vdXMgb3BlcmF0aW9uIG5vdCBhbGxvd2VkIScpO1xuXHRcdH1cblx0fTtcblxuXHRQYXJhbGxlbC5wcm90b3R5cGUucmVkdWNlID0gZnVuY3Rpb24gKGNiLCBlbnYpIHtcblx0XHRlbnYgPSBleHRlbmQodGhpcy5vcHRpb25zLmVudiwgZW52IHx8IHt9KTtcblxuXHRcdGlmICghdGhpcy5kYXRhLmxlbmd0aCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IHJlZHVjZSBub24tYXJyYXkgZGF0YScpO1xuXHRcdH1cblxuXHRcdHZhciBydW5uaW5nV29ya2VycyA9IDA7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdGZ1bmN0aW9uIGRvbmUoZXJyLCB3cmspIHtcblx0XHRcdC0tcnVubmluZ1dvcmtlcnM7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUoZXJyLCBudWxsKTtcblx0XHRcdH0gZWxzZSBpZiAodGhhdC5kYXRhLmxlbmd0aCA9PT0gMSAmJiBydW5uaW5nV29ya2VycyA9PT0gMCkge1xuXHRcdFx0XHR0aGF0LmRhdGEgPSB0aGF0LmRhdGFbMF07XG5cdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhKTtcblx0XHRcdFx0aWYgKHdyaykgd3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0fSBlbHNlIGlmICh0aGF0LmRhdGEubGVuZ3RoID4gMSkge1xuXHRcdFx0XHQrK3J1bm5pbmdXb3JrZXJzO1xuXHRcdFx0XHR0aGF0Ll9zcGF3blJlZHVjZVdvcmtlcihbdGhhdC5kYXRhWzBdLCB0aGF0LmRhdGFbMV1dLCBjYiwgZG9uZSwgZW52LCB3cmspO1xuXHRcdFx0XHR0aGF0LmRhdGEuc3BsaWNlKDAsIDIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHdyaykgd3JrLnRlcm1pbmF0ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBuZXdPcCA9IG5ldyBPcGVyYXRpb24oKTtcblx0XHR0aGlzLm9wZXJhdGlvbi50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0aGF0LmRhdGEubGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdG5ld09wLnJlc29sdmUobnVsbCwgdGhhdC5kYXRhWzBdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhhdC5vcHRpb25zLm1heFdvcmtlcnMgJiYgaSA8IE1hdGguZmxvb3IodGhhdC5kYXRhLmxlbmd0aCAvIDIpIDsgKytpKSB7XG5cdFx0XHRcdFx0KytydW5uaW5nV29ya2Vycztcblx0XHRcdFx0XHR0aGF0Ll9zcGF3blJlZHVjZVdvcmtlcihbdGhhdC5kYXRhW2kgKiAyXSwgdGhhdC5kYXRhW2kgKiAyICsgMV1dLCBjYiwgZG9uZSwgZW52KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoYXQuZGF0YS5zcGxpY2UoMCwgaSAqIDIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub3BlcmF0aW9uID0gbmV3T3A7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0UGFyYWxsZWwucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAoY2IsIGVyckNiKSB7XG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHZhciBuZXdPcCA9IG5ldyBPcGVyYXRpb24oKTtcblx0XHRlcnJDYiA9IHR5cGVvZiBlcnJDYiA9PT0gJ2Z1bmN0aW9uJyA/IGVyckNiIDogZnVuY3Rpb24oKXt9O1xuXG5cdFx0dGhpcy5vcGVyYXRpb24udGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgcmV0RGF0YTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aWYgKGNiKSB7XG5cdFx0XHRcdFx0cmV0RGF0YSA9IGNiKHRoYXQuZGF0YSk7XG5cdFx0XHRcdFx0aWYgKHJldERhdGEgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhID0gcmV0RGF0YTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCB0aGF0LmRhdGEpO1xuXHRcdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0XHRpZiAoZXJyQ2IpIHtcblx0XHRcdFx0XHRyZXREYXRhID0gZXJyQ2IoZSk7XG5cdFx0XHRcdFx0aWYgKHJldERhdGEgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0dGhhdC5kYXRhID0gcmV0RGF0YTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRuZXdPcC5yZXNvbHZlKG51bGwsIHRoYXQuZGF0YSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdGlmIChlcnJDYikge1xuXHRcdFx0XHR2YXIgcmV0RGF0YSA9IGVyckNiKGVycik7XG5cdFx0XHRcdGlmIChyZXREYXRhICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHR0aGF0LmRhdGEgPSByZXREYXRhO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCB0aGF0LmRhdGEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3T3AucmVzb2x2ZShudWxsLCBlcnIpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHRoaXMub3BlcmF0aW9uID0gbmV3T3A7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0aWYgKGlzQ29tbW9uSlMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFBhcmFsbGVsO1xuXHR9IGVsc2Uge1xuXHRcdHNlbGYuUGFyYWxsZWwgPSBQYXJhbGxlbDtcblx0fVxufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9wYXJhbGxlbGpzL2xpYi9wYXJhbGxlbC5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBQYXJhbGxlbCA9IHJlcXVpcmUoXCJwYXJhbGxlbGpzXCIpO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb29yZGluYXRlIHtcbiAgICByZWFkb25seSB4OiBudW1iZXI7XG4gICAgcmVhZG9ubHkgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElLbmlnaHRUb3VyRW52aXJvbm1lbnQge1xuICAgIGJvYXJkU2l6ZTogbnVtYmVyO1xuICAgIGJvYXJkOiBudW1iZXJbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtuaWdodFRvdXJzKHN0YXJ0UGF0aDogSUNvb3JkaW5hdGVbXSwgYm9hcmRTaXplOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IG1vdmVzID0gW1xuICAgICAgICB7IHg6IC0yLCB5OiAtMSB9LCB7IHg6IC0yLCB5OiAxfSwgeyB4OiAtMSwgeTogLTIgfSwgeyB4OiAtMSwgeTogMiB9LFxuICAgICAgICB7IHg6IDEsIHk6IC0yIH0sIHsgeDogMSwgeTogMn0sIHsgeDogMiwgeTogLTEgfSwgeyB4OiAyLCB5OiAxIH1cbiAgICBdO1xuXG4gICAgY29uc3QgYm9hcmQ6IG51bWJlcltdID0gbmV3IEFycmF5KGJvYXJkU2l6ZSAqIGJvYXJkU2l6ZSk7XG4gICAgYm9hcmQuZmlsbCgwKTtcblxuICAgIGNvbnN0IG51bWJlck9mRmllbGRzID0gYm9hcmRTaXplICogYm9hcmRTaXplO1xuICAgIGxldCByZXN1bHRzOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiB7IGNvb3JkaW5hdGU6IElDb29yZGluYXRlLCBuOiBudW1iZXIgfVtdID0gc3RhcnRQYXRoLm1hcCgocG9zLCBpbmRleCkgPT4gKHsgY29vcmRpbmF0ZTogcG9zLCBuOiBpbmRleCArIDEgfSkpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0UGF0aC5sZW5ndGggLSAxOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBzdGFydFBhdGhbaW5kZXhdLnggKiBib2FyZFNpemUgKyBzdGFydFBhdGhbaW5kZXhdLnk7XG4gICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZSwgbiB9ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBjb29yZGluYXRlLnggKiBib2FyZFNpemUgKyBjb29yZGluYXRlLnk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2ZpZWxkSW5kZXhdICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBiYWNrIHRyYWNraW5nXG4gICAgICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IDA7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW50cnlcbiAgICAgICAgaWYgKG4gPT09IG51bWJlck9mRmllbGRzKSB7XG4gICAgICAgICAgICArK3Jlc3VsdHM7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBuITtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gbW92ZXNbaV07XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3IgPSB7IHg6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55IH07XG4gICAgICAgICAgICAvLyBub3Qgb3V0c2lkZSBvZiBib2FyZCBhbmQgbm90IHlldCBhY2Nlc3NlZFxuICAgICAgICAgICAgY29uc3QgYWNjZXNzaWJsZSA9IHN1Y2Nlc3Nvci54ID49IDAgJiYgc3VjY2Vzc29yLnkgPj0gMCAmJiBzdWNjZXNzb3IueCA8IGJvYXJkU2l6ZSAmJiAgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiYgYm9hcmRbc3VjY2Vzc29yLnggKiBib2FyZFNpemUgKyBzdWNjZXNzb3IueV0gPT09IDA7XG5cbiAgICAgICAgICAgIGlmIChhY2Nlc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh7IGNvb3JkaW5hdGU6IHN1Y2Nlc3NvciwgbjogbiArIDEgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuZGVjbGFyZSBjb25zdCBnbG9iYWw6IHsgZW52OiB7IGJvYXJkU2l6ZTogbnVtYmVyIH19O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxKU0tuaWdodFRvdXJzKHN0YXJ0OiBJQ29vcmRpbmF0ZSwgYm9hcmRTaXplOiBudW1iZXIpOiBQcm9taXNlTGlrZTxudW1iZXI+IHtcblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3NvcnMoY29vcmRpbmF0ZTogSUNvb3JkaW5hdGUpIHtcbiAgICAgICAgY29uc3QgbW92ZXMgPSBbXG4gICAgICAgICAgICB7eDogLTIsIHk6IC0xfSwge3g6IC0yLCB5OiAxfSwge3g6IC0xLCB5OiAtMn0sIHt4OiAtMSwgeTogMn0sXG4gICAgICAgICAgICB7eDogMSwgeTogLTJ9LCB7eDogMSwgeTogMn0sIHt4OiAyLCB5OiAtMX0sIHt4OiAyLCB5OiAxfVxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXN1bHQ6IElDb29yZGluYXRlW10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gbW92ZXNbaV07XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3IgPSB7eDogY29vcmRpbmF0ZS54ICsgbW92ZS54LCB5OiBjb29yZGluYXRlLnkgKyBtb3ZlLnl9O1xuICAgICAgICAgICAgY29uc3QgYWNjZXNzaWJsZSA9IHN1Y2Nlc3Nvci54ID49IDAgJiYgc3VjY2Vzc29yLnkgPj0gMCAmJiBzdWNjZXNzb3IueCA8IGJvYXJkU2l6ZSAmJiBzdWNjZXNzb3IueSA8IGJvYXJkU2l6ZSAmJlxuICAgICAgICAgICAgICAgIChzdWNjZXNzb3IueCAhPT0gc3RhcnQueCB8fCBzdWNjZXNzb3IueSAhPT0gc3RhcnQueSkgJiYgKHN1Y2Nlc3Nvci54ICE9PSBjb29yZGluYXRlLnggJiYgc3VjY2Vzc29yLnkgIT09IGNvb3JkaW5hdGUueSk7XG4gICAgICAgICAgICBpZiAoYWNjZXNzaWJsZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHN1Y2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVTdGFydEZpZWxkcygpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJQ29vcmRpbmF0ZVtdW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBkaXJlY3RTdWNjZXNzb3Igb2Ygc3VjY2Vzc29ycyhzdGFydCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaW5kaXJlY3RTdWNjZXNzb3Igb2Ygc3VjY2Vzc29ycyhkaXJlY3RTdWNjZXNzb3IpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goW3N0YXJ0LCBkaXJlY3RTdWNjZXNzb3IsIGluZGlyZWN0U3VjY2Vzc29yXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFBhcmFsbGVsKGNvbXB1dGVTdGFydEZpZWxkcygpLCB7IGVudjogeyBib2FyZFNpemUgfX0pXG4gICAgICAgIC5yZXF1aXJlKGtuaWdodFRvdXJzKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChzdGFydEZpZWxkOiBJQ29vcmRpbmF0ZVtdKSB7XG4gICAgICAgICAgICByZXR1cm4ga25pZ2h0VG91cnMoc3RhcnRGaWVsZCwgZ2xvYmFsLmVudi5ib2FyZFNpemUpO1xuICAgICAgICB9KVxuICAgICAgICAucmVkdWNlKGZ1bmN0aW9uICh0b3Vyc1BlclJ1bjogbnVtYmVyW10pIHtcbiAgICAgICAgICAgIHJldHVybiB0b3Vyc1BlclJ1bi5yZWR1Y2UoKG1lbW8sIGN1cnJlbnQpID0+IG1lbW8gKyBjdXJyZW50LCAwKTtcbiAgICAgICAgfSk7XG5cbiAgICAvLyBUaGUgcmVkdWNlIG9wZXJhdGlvbiBuZWVkcyB0byB3YWl0IHVudGlsIHRoZSBtYXAgb3BlcmF0aW9uIGlzIGNvbXBsZXRlLCBzd2l0Y2hlcyBiYWNrIHRvIHRoZSBtYWluIHRocmVhZCBhbmQgdGhlblxuICAgIC8vIGEgbmV3IHdvcmtlciBpcyBzcGF3bmVkIGZvciBlYWNoIHJlZHVjZSBzdGVwLCBlLmcuIGZvciBbMSwgMiwgMywgNCwgNSwgNl0gdGhlIHRocmVlIHdvcmtlcnMgd2l0aCBbMSwgMl0sIFszLCA0XSwgWzUsIDZdXG4gICAgLy8gdGhlbiB0aGUgc3ViIHNlcXVlbnQgd29ya2VycyBbMywgN10gYW5kIGZpbmFsbHksIFsxMCwgMTFdIGFyZSBzcGF3bmVkLi4uXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFyYWxsZWxqcy9rbmlnaHRzLXRvdXIudHMiLCJjb25zdCBQYXJhbGxlbCA9IHJlcXVpcmUoXCJwYXJhbGxlbGpzXCIpO1xuaW1wb3J0ICogYXMgXyBmcm9tIFwibG9kYXNoXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbXBsZXhOdW1iZXIge1xuICAgIGk6IG51bWJlcjtcbiAgICByZWFsOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1hbmRlbGJyb3RPcHRpb25zIHtcbiAgICBpbWFnZUhlaWdodDogbnVtYmVyO1xuICAgIGltYWdlV2lkdGg6IG51bWJlcjtcbiAgICBpdGVyYXRpb25zOiBudW1iZXI7XG4gICAgbWF4OiBJQ29tcGxleE51bWJlcjtcbiAgICBtaW46IElDb21wbGV4TnVtYmVyO1xuICAgIHNjYWxpbmdGYWN0b3I6IElDb21wbGV4TnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZU1hbmRlbGJyb3RMaW5lKHk6IG51bWJlciwgb3B0aW9uczogSU1hbmRlbGJyb3RPcHRpb25zKTogVWludDhDbGFtcGVkQXJyYXkge1xuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVooYzogSUNvbXBsZXhOdW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB6ID0geyBpOiBjLmksIHJlYWw6IGMucmVhbCB9O1xuICAgICAgICBsZXQgbiA9IDA7XG5cbiAgICAgICAgZm9yICg7IG4gPCBvcHRpb25zLml0ZXJhdGlvbnM7ICsrbikge1xuICAgICAgICAgICAgaWYgKHoucmVhbCAqKiAyICsgei5pICoqIDIgPiA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHogKiogMiArIGNcbiAgICAgICAgICAgIGNvbnN0IHpJID0gei5pO1xuICAgICAgICAgICAgei5pID0gMiAqIHoucmVhbCAqIHouaSArIGMuaTtcbiAgICAgICAgICAgIHoucmVhbCA9IHoucmVhbCAqKiAyIC0gekkgKiogMiArIGMucmVhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmUgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkob3B0aW9ucy5pbWFnZVdpZHRoICogNCk7XG4gICAgY29uc3QgY0kgPSBvcHRpb25zLm1heC5pIC0geSAqIG9wdGlvbnMuc2NhbGluZ0ZhY3Rvci5pO1xuXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBvcHRpb25zLmltYWdlV2lkdGg7ICsreCkge1xuICAgICAgICBjb25zdCBjID0ge1xuICAgICAgICAgICAgaTogY0ksXG4gICAgICAgICAgICByZWFsOiBvcHRpb25zLm1pbi5yZWFsICsgeCAqIG9wdGlvbnMuc2NhbGluZ0ZhY3Rvci5yZWFsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgbiA9IGNhbGN1bGF0ZVooYyk7XG4gICAgICAgIGNvbnN0IGJhc2UgPSB4ICogNDtcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xuICAgICAgICBsaW5lW2Jhc2VdID0gbiAmIDB4RkY7XG4gICAgICAgIGxpbmVbYmFzZSArIDFdID0gbiAmIDB4RkYwMDtcbiAgICAgICAgbGluZVtiYXNlICsgMl0gPSBuICYgMHhGRjAwMDA7XG4gICAgICAgIGxpbmVbYmFzZSArIDNdID0gMjU1O1xuICAgIH1cbiAgICByZXR1cm4gbGluZTtcbn1cblxuZGVjbGFyZSBjb25zdCBnbG9iYWw6IHsgZW52OiBJTWFuZGVsYnJvdE9wdGlvbnN9O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxKU01hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnM6IElNYW5kZWxicm90T3B0aW9ucykge1xuICAgIGNvbnN0IGxpbmVzID0gXy5yYW5nZShtYW5kZWxicm90T3B0aW9ucy5pbWFnZUhlaWdodCk7XG4gICAgcmV0dXJuIG5ldyBQYXJhbGxlbChsaW5lcywgeyBlbnY6IG1hbmRlbGJyb3RPcHRpb25zIH0pLnJlcXVpcmUoY29tcHV0ZU1hbmRlbGJyb3RMaW5lKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChsaW5lOiBudW1iZXIpOiBVaW50OENsYW1wZWRBcnJheSB7XG4gICAgICAgICAgICByZXR1cm4gY29tcHV0ZU1hbmRlbGJyb3RMaW5lKGxpbmUsIGdsb2JhbC5lbnYpO1xuICAgICAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYXJhbGxlbGpzL21hbmRlbGJyb3QudHMiLCJjb25zdCBQYXJhbGxlbCA9IHJlcXVpcmUoXCJwYXJhbGxlbGpzXCIpO1xuaW1wb3J0IHtEaWN0aW9uYXJ5fSBmcm9tIFwibG9kYXNoXCI7XG5cblxuLyogdHNsaW50OmRpc2FibGU6bm8tdmFyLXJlcXVpcmVzICovXG4vLyBkZWNsYXJlIGZ1bmN0aW9uIHJlcXVpcmUobmFtZTogc3RyaW5nKTogYW55O1xuLy8gY29uc3QgUmFuZG9tID0gcmVxdWlyZShcInNpbWpzLXJhbmRvbVwiKTtcbi8vIGNvbnN0IHJhbmRvbSA9IG5ldyBSYW5kb20oMTApO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0IHtcbiAgICBzdGFydFllYXI6IG51bWJlcjtcbiAgICB0b3RhbEFtb3VudDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUJ1Y2tldCB7XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG5cbiAgICBzdWJCdWNrZXRzOiB7IFtncm91cE5hbWU6IHN0cmluZ106IHsgZ3JvdXA6IHN0cmluZzsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyIH0gfTtcbn1cblxuaW50ZXJmYWNlIElHcm91cCB7XG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBuYW1lIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGdyb3VwXG4gICAgICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBhIHNlcGFyYXRvciBsaW5lIGJlZW4gZHJhd24gZm9yIHRoaXMgZ3JvdXA/XG4gICAgICovXG4gICAgc2VwYXJhdG9yOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIHBlcmNlbnRhZ2Ugb2YgdmFsdWVzIGluIHRoaXMgZ3JvdXAgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBzaW11bGF0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgcGVyY2VudGFnZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1pbmltdW0gdmFsdWUgdGhhdCBpcyBzdGlsbCBwYXJ0IG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBmcm9tPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBtYXhpbXVtIHZhbHVlIChleGNsdXNpdmUpIHRoYXQgZGVmaW5lcyB0aGUgdXBwZXIgZW5kIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICB0bz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUHJvamVjdFJlc3VsdCB7XG4gICAgLyoqXG4gICAgICogVGhlIG1pbmltYWwgc2ltdWxhdGVkIHZhbHVlIGZvciB0aGlzIHByb2plY3RcbiAgICAgKi9cbiAgICBtaW46IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW1hbCBzaW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBtYXg6IG51bWJlcjtcblxuICAgIC8qKiBUaGUgbWVkaWFuIG9mIHRoZSB2YWx1ZXMgZm91bmQgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1lZGlhbjogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB3aGVyZSB0aGUgMi8zIG9mIHRoZSBzaW11bGF0ZWQgdmFsdWVzIHN0YXJ0IC8gZW5kLlxuICAgICAqL1xuICAgIHR3b1RoaXJkOiB7XG4gICAgICAgIG1pbjogbnVtYmVyO1xuICAgICAgICBtYXg6IG51bWJlcjtcbiAgICB9O1xuXG4gICAgYnVja2V0czogSUJ1Y2tldFtdO1xuXG4gICAgZ3JvdXBzOiBJR3JvdXBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9qZWN0XG4gICAgICovXG4gICAgcHJvamVjdDogSVByb2plY3Q7XG59XG5cbmludGVyZmFjZSBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT47XG4gICAgc2ltdWxhdGVkVmFsdWVzOiBudW1iZXJbXVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzPzogbnVtYmVyO1xuICAgIG51bVJ1bnM/OiBudW1iZXI7XG4gICAgcHJvamVjdHM/OiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ/OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U/OiBudW1iZXI7XG4gICAgc2VlZD86IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5PzogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBwcm9qZWN0czogSVByb2plY3RbXTtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U6IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHRhc2tJbmRleD86IG51bWJlcjtcbiAgICB2YWx1ZXNQZXJXb3JrZXI/OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgdm9sYXRpbGl0eTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogMTAwMDAwMCxcbiAgICAgICAgbGlxdWlkaXR5OiAxMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAsXG4gICAgICAgIG51bVllYXJzOiAxMCxcbiAgICAgICAgcGVyZm9ybWFuY2U6IDAsXG4gICAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgICAgc2VlZDogdW5kZWZpbmVkLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjAxXG4gICAgfSwgb3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChvcHRpb25zOiBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpOiBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBjb25zdCByYW5kb20gPSBuZXcgKHNlbGYgYXMgYW55KS5SYW5kb20oKTtcblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBtb250ZSBjYXJsbyBzaW11bGF0aW9uIGZvciBhbGwgeWVhcnMgYW5kIG51bSBydW5zLlxuICAgICAqIEBwYXJhbSBjYXNoRmxvd3MgdGhlIGNhc2ggZmxvd3NcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW11bXX0gdGhlIHNpbXVsYXRlZCBvdXRjb21lcyBncm91cGVkIGJ5IHllYXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93czogbnVtYmVyW10sIG51bVllYXJzOiBudW1iZXIpOiBudW1iZXJbXVtdICB7XG4gICAgICAgIGZ1bmN0aW9uIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXM6IG51bWJlcltdKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50O1xuICAgICAgICAgICAgbGV0IHByZXZpb3VzWWVhckluZGV4ID0gMTAwO1xuXG4gICAgICAgICAgICBmb3IgKGxldCByZWxhdGl2ZVllYXIgPSAwOyByZWxhdGl2ZVllYXIgPCBpbmRpY2VzLmxlbmd0aDsgKytyZWxhdGl2ZVllYXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhckluZGV4ID0gaW5kaWNlc1tyZWxhdGl2ZVllYXJdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhc2hGbG93U3RhcnRPZlllYXIgPSByZWxhdGl2ZVllYXIgPT09IDAgPyAwIDogY2FzaEZsb3dzW3JlbGF0aXZlWWVhciAtIDFdO1xuXG4gICAgICAgICAgICAgICAgLy8gc2NhbGUgY3VycmVudCB2YWx1ZSB3aXRoIHBlcmZvcm1hbmNlIGdhaW4gYWNjb3JkaW5nIHRvIGluZGV4XG4gICAgICAgICAgICAgICAgY29uc3QgcGVyZm9ybWFuY2UgPSBjdXJyZW50WWVhckluZGV4IC8gcHJldmlvdXNZZWFySW5kZXg7XG4gICAgICAgICAgICAgICAgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gKGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSArIGNhc2hGbG93U3RhcnRPZlllYXIpICogcGVyZm9ybWFuY2U7XG5cbiAgICAgICAgICAgICAgICBpbmRpY2VzW3JlbGF0aXZlWWVhcl0gPSAgMSArIHJhbmRvbS5ub3JtYWwocGVyZm9ybWFuY2UsIG9wdGlvbnMudm9sYXRpbGl0eSk7XG5cbiAgICAgICAgICAgICAgICBwcmV2aW91c1llYXJJbmRleCA9IGN1cnJlbnRZZWFySW5kZXg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBpbmRpY2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG9wdGlvbnMubnVtWWVhcnMpO1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8PSBudW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICByZXN1bHRbeWVhcl0gPSBuZXcgQXJyYXkob3B0aW9ucy5udW1SdW5zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IHJ1biA9IDA7IHJ1biA8IG9wdGlvbnMubnVtUnVuczsgcnVuKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSBbMTAwXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbnVtWWVhcnM7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHJhbmRvbVBlcmZvcm1hbmNlID0gMSArIHJhbmRvbS5ub3JtYWwob3B0aW9ucy5wZXJmb3JtYW5jZSwgb3B0aW9ucy52b2xhdGlsaXR5KTtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21QZXJmb3JtYW5jZSA9IDEgKyBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChpbmRpY2VzW2kgLSAxXSAqIHJhbmRvbVBlcmZvcm1hbmNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29udmVydCB0aGUgcmVsYXRpdmUgdmFsdWVzIGZyb20gYWJvdmUgdG8gYWJzb2x1dGUgdmFsdWVzLlxuICAgICAgICAgICAgdG9BYnNvbHV0ZUluZGljZXMoaW5kaWNlcyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsreWVhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdFt5ZWFyXVtydW5dID0gaW5kaWNlc1t5ZWFyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvamVjdHNUb0Nhc2hGbG93cygpIHtcbiAgICAgICAgY29uc3QgY2FzaEZsb3dzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IG9wdGlvbnMubnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdHNCeVRoaXNZZWFyID0gcHJvamVjdHNCeVN0YXJ0WWVhclt5ZWFyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IGNhc2hGbG93ID0gLXByb2plY3RzQnlUaGlzWWVhci5yZWR1Y2UoKG1lbW8sIHByb2plY3QpID0+IG1lbW8gKyBwcm9qZWN0LnRvdGFsQW1vdW50LCAwKTtcbiAgICAgICAgICAgIGNhc2hGbG93cy5wdXNoKGNhc2hGbG93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FzaEZsb3dzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lKGNhc2hGbG93czogbnVtYmVyW10pIHtcbiAgICAgICAgY29uc3Qgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdID0gW107XG5cbiAgICAgICAgbGV0IGludmVzdG1lbnRBbW91bnRMZWZ0ID0gb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50O1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IG9wdGlvbnMubnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgaW52ZXN0bWVudEFtb3VudExlZnQgPSBpbnZlc3RtZW50QW1vdW50TGVmdCArIGNhc2hGbG93c1t5ZWFyXTtcbiAgICAgICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLnB1c2goaW52ZXN0bWVudEFtb3VudExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub0ludGVyZXN0UmVmZXJlbmNlTGluZTtcbiAgICB9XG5cbiAgICBsZXQgcHJvamVjdHNUb1NpbXVsYXRlOiBJUHJvamVjdFtdID0gb3B0aW9ucy5wcm9qZWN0cztcblxuICAgIGlmIChvcHRpb25zLnRhc2tJbmRleCAmJiBvcHRpb25zLnZhbHVlc1Blcldvcmtlcikge1xuICAgICAgICBwcm9qZWN0c1RvU2ltdWxhdGUgPSBvcHRpb25zLnByb2plY3RzLnNsaWNlKG9wdGlvbnMudGFza0luZGV4ICogb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIsIChvcHRpb25zLnRhc2tJbmRleCArIDEpICogb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb2plY3RzID0gb3B0aW9ucy5wcm9qZWN0cy5zb3J0KChhLCBiKSA9PiBhLnN0YXJ0WWVhciAtIGIuc3RhcnRZZWFyKTtcblxuICAgIC8vIEdyb3VwIHByb2plY3RzIGJ5IHN0YXJ0WWVhciwgdXNlIGxvZGFzaCBncm91cEJ5IGluc3RlYWRcbiAgICBjb25zdCBwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9qZWN0IG9mIHByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdID0gcHJvamVjdHNCeVN0YXJ0WWVhcltwcm9qZWN0LnN0YXJ0WWVhcl0gfHwgW107XG4gICAgICAgIGFyci5wdXNoKHByb2plY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhc2hGbG93cyA9IHByb2plY3RzVG9DYXNoRmxvd3MoKTtcbiAgICBjb25zdCBub0ludGVyZXN0UmVmZXJlbmNlTGluZSA9IGNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lKGNhc2hGbG93cyk7XG5cbiAgICBjb25zdCBudW1ZZWFycyA9IHByb2plY3RzVG9TaW11bGF0ZS5yZWR1Y2UoKG1lbW8sIHByb2plY3QpID0+IE1hdGgubWF4KG1lbW8sIHByb2plY3Quc3RhcnRZZWFyKSwgMCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbnZlc3RtZW50QW1vdW50OiBvcHRpb25zLmludmVzdG1lbnRBbW91bnQsXG4gICAgICAgIGxpcXVpZGl0eTogb3B0aW9ucy5saXF1aWRpdHksXG4gICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLFxuICAgICAgICBudW1SdW5zOiBvcHRpb25zLm51bVJ1bnMsXG4gICAgICAgIG51bVllYXJzLFxuICAgICAgICBwcm9qZWN0c0J5U3RhcnRZZWFyLFxuICAgICAgICBzaW11bGF0ZWRWYWx1ZXM6IHNpbXVsYXRlT3V0Y29tZXMoY2FzaEZsb3dzLCBudW1ZZWFycylcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVQcm9qZWN0KHByb2plY3Q6IElQcm9qZWN0LCBlbnZpcm9ubWVudDogSU1vbnRlQ2FybG9FbnZpcm9ubWVudCk6IElQcm9qZWN0UmVzdWx0IHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfQlVDS0VUUyA9IDEwO1xuICAgIGZ1bmN0aW9uIGdyb3VwRm9yVmFsdWUodmFsdWU6IG51bWJlciwgZ3JvdXBzOiBJR3JvdXBbXSk6IElHcm91cCB7XG4gICAgICAgIHJldHVybiBncm91cHMuZmluZChncm91cCA9PiAodHlwZW9mIGdyb3VwLmZyb20gPT09IFwidW5kZWZpbmVkXCIgfHwgZ3JvdXAuZnJvbSA8PSB2YWx1ZSkgJiYgKHR5cGVvZiBncm91cC50byA9PT0gXCJ1bmRlZmluZWRcIiB8fCBncm91cC50byA+IHZhbHVlKSkhO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUdyb3VwcyhyZXF1aXJlZEFtb3VudDogbnVtYmVyLCBub0ludGVyZXN0UmVmZXJlbmNlOiBudW1iZXIpOiBJR3JvdXBbXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIlppZWwgZXJyZWljaGJhclwiLCBmcm9tOiByZXF1aXJlZEFtb3VudCwgbmFtZTogXCJncmVlblwiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IHRydWV9LFxuICAgICAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJtaXQgWnVzYXR6bGlxdWlkaXTDpHQgZXJyZWljaGJhclwiLCBmcm9tOiByZXF1aXJlZEFtb3VudCAtIGVudmlyb25tZW50LmxpcXVpZGl0eSwgbmFtZTogXCJ5ZWxsb3dcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiB0cnVlLCB0bzogcmVxdWlyZWRBbW91bnQgfSxcbiAgICAgICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhclwiLCBmcm9tOiBub0ludGVyZXN0UmVmZXJlbmNlLCBuYW1lOiBcImdyYXlcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IHJlcXVpcmVkQW1vdW50IC0gZW52aXJvbm1lbnQubGlxdWlkaXR5IH0sXG4gICAgICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIm5pY2h0IGVycmVpY2hiYXIsIG1pdCBWZXJsdXN0XCIsIG5hbWU6IFwicmVkXCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogZmFsc2UsIHRvOiBub0ludGVyZXN0UmVmZXJlbmNlIH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVSZXF1aXJlZEFtb3VudCgpIHtcbiAgICAgICAgbGV0IGFtb3VudCA9IHByb2plY3QudG90YWxBbW91bnQ7XG4gICAgICAgIGNvbnN0IHByb2plY3RzU2FtZVllYXIgPSBlbnZpcm9ubWVudC5wcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXTtcblxuICAgICAgICBmb3IgKGNvbnN0IG90aGVyUHJvamVjdCBvZiBwcm9qZWN0c1NhbWVZZWFyKSB7XG4gICAgICAgICAgICBpZiAob3RoZXJQcm9qZWN0ID09PSBwcm9qZWN0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbW91bnQgKz0gb3RoZXJQcm9qZWN0LnRvdGFsQW1vdW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbW91bnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWVkaWFuKHZhbHVlczogbnVtYmVyW10pIHtcbiAgICAgICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3IodmFsdWVzLmxlbmd0aCAvIDIpO1xuXG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoICUgMikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlc1toYWxmXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAodmFsdWVzW2hhbGYgLSAxXSArIHZhbHVlc1toYWxmXSkgLyAyLjA7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWlyZWRBbW91bnQgPSBjYWxjdWxhdGVSZXF1aXJlZEFtb3VudCgpO1xuICAgIGNvbnN0IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyID0gZW52aXJvbm1lbnQuc2ltdWxhdGVkVmFsdWVzW3Byb2plY3Quc3RhcnRZZWFyXTtcbiAgICBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBncm91cHMgPSBjcmVhdGVHcm91cHMocmVxdWlyZWRBbW91bnQsIGVudmlyb25tZW50Lm5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lW3Byb2plY3Quc3RhcnRZZWFyXSk7XG4gICAgY29uc3QgdmFsdWVzQnlHcm91cDogeyBbZ3JvdXBOYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuICAgIGNvbnN0IGJ1Y2tldFNpemUgPSBNYXRoLnJvdW5kKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAvIE5VTUJFUl9PRl9CVUNLRVRTKTtcbiAgICBjb25zdCBidWNrZXRzOiBJQnVja2V0W10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoOyBpICs9IGJ1Y2tldFNpemUpIHtcbiAgICAgICAgY29uc3QgYnVja2V0OiBJQnVja2V0ID0ge1xuICAgICAgICAgICAgbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLFxuICAgICAgICAgICAgbWluOiBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgICAgICAgICAgc3ViQnVja2V0czoge31cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBqID0gaTsgaiA8IGkgKyBidWNrZXRTaXplOyArK2opIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbal07XG4gICAgICAgICAgICBidWNrZXQubWluID0gTWF0aC5taW4oYnVja2V0Lm1pbiwgdmFsdWUpO1xuICAgICAgICAgICAgYnVja2V0Lm1heCA9IE1hdGgubWF4KGJ1Y2tldC5tYXgsIHZhbHVlKTtcblxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSBncm91cEZvclZhbHVlKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW2pdLCBncm91cHMpO1xuICAgICAgICAgICAgdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSA9ICh2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdIHx8IDApICsgMTtcbiAgICAgICAgICAgIGNvbnN0IHN1YkJ1Y2tldCA9IGJ1Y2tldC5zdWJCdWNrZXRzW2dyb3VwLm5hbWVdID0gYnVja2V0LnN1YkJ1Y2tldHNbZ3JvdXAubmFtZV0gfHwgeyBncm91cDogZ3JvdXAubmFtZSwgbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLCBtaW46IE51bWJlci5NQVhfVkFMVUUgfTtcbiAgICAgICAgICAgIHN1YkJ1Y2tldC5taW4gPSBNYXRoLm1pbihzdWJCdWNrZXQubWluLCB2YWx1ZSk7XG4gICAgICAgICAgICBzdWJCdWNrZXQubWF4ID0gTWF0aC5tYXgoc3ViQnVja2V0Lm1heCwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnVja2V0cy5wdXNoKGJ1Y2tldCk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9uRW1wdHlHcm91cHMgPSBncm91cHMuZmlsdGVyKGdyb3VwID0+ICEhdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSk7XG4gICAgbm9uRW1wdHlHcm91cHMuZm9yRWFjaChncm91cCA9PiBncm91cC5wZXJjZW50YWdlID0gdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSAvIHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCk7XG5cbiAgICBjb25zdCBvbmVTaXh0aCA9IE1hdGgucm91bmQoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC8gNik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnVja2V0cyxcbiAgICAgICAgZ3JvdXBzOiBub25FbXB0eUdyb3VwcyxcbiAgICAgICAgbWF4OiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLSAxXSxcbiAgICAgICAgbWVkaWFuOiBtZWRpYW4oc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIpLFxuICAgICAgICBtaW46IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyWzBdLFxuICAgICAgICBwcm9qZWN0LFxuICAgICAgICB0d29UaGlyZDoge1xuICAgICAgICAgICAgbWF4OiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLSBvbmVTaXh0aF0sXG4gICAgICAgICAgICBtaW46IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW29uZVNpeHRoXVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZGVjbGFyZSBjb25zdCBnbG9iYWw6IHtvcHRpb25zOiBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnN9O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxKU01vbnRlQ2FybG8odXNlck9wdGlvbnM/OiBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGluaXRpYWxpemVPcHRpb25zKHVzZXJPcHRpb25zKTtcblxuICAgIC8vIEFycmF5IG5lZWRzIHRvIGJlIGNsb25lZCwgb3RoZXJ3aXNlIHRoZSBvcmlnaW5hbCBhcnJheSBpcyBtYW5pcHVsYXRlZCFcbiAgICByZXR1cm4gbmV3IFBhcmFsbGVsKG9wdGlvbnMucHJvamVjdHMuc2xpY2UoKSwge1xuICAgICAgICAgICAgZXZhbFBhdGg6IFwiLi9cIiArIHJlcXVpcmUoXCJmaWxlIXBhcmFsbGVsanMvbGliL2V2YWwuanNcIiksXG4gICAgICAgICAgICBlbnY6IG9wdGlvbnMsXG4gICAgICAgICAgICBlbnZOYW1lc3BhY2U6IFwib3B0aW9uc1wiXG4gICAgICAgIH0pXG4gICAgICAgIC5yZXF1aXJlKFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL212YXJzaG5leS9zaW1qcy1zb3VyY2UvbWFzdGVyL3NyYy9yYW5kb20uanNcIikgLy8gdGhlIG9uZSBmcm9tIG5vZGUgdXNlcyBtb2R1bGUgc3ludGF4XG4gICAgICAgIC5yZXF1aXJlKGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudClcbiAgICAgICAgLnJlcXVpcmUoY2FsY3VsYXRlUHJvamVjdClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAocHJvamVjdDogSVByb2plY3QpOiBJUHJvamVjdFJlc3VsdCB7XG4gICAgICAgICAgICBjb25zdCBlbnYgPSBjcmVhdGVNb250ZUNhcmxvRW52aXJvbm1lbnQoZ2xvYmFsLm9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGN1bGF0ZVByb2plY3QocHJvamVjdCwgZW52KTtcbiAgICAgICAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFyYWxsZWxqcy9tb250ZS1jYXJsby50cyIsIi8qIVxuICogQmVuY2htYXJrLmpzIDxodHRwczovL2JlbmNobWFya2pzLmNvbS8+XG4gKiBDb3B5cmlnaHQgMjAxMC0yMDE2IE1hdGhpYXMgQnluZW5zIDxodHRwczovL210aHMuYmUvPlxuICogQmFzZWQgb24gSlNMaXRtdXMuanMsIGNvcHlyaWdodCBSb2JlcnQgS2llZmZlciA8aHR0cDovL2Jyb29mYS5jb20vPlxuICogTW9kaWZpZWQgYnkgSm9obi1EYXZpZCBEYWx0b24gPGh0dHA6Ly9hbGx5b3VjYW5sZWV0LmNvbS8+XG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbXRocy5iZS9taXQ+XG4gKi9cbjsoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKiogVXNlZCBhcyBhIHNhZmUgcmVmZXJlbmNlIGZvciBgdW5kZWZpbmVkYCBpbiBwcmUgRVM1IGVudmlyb25tZW50cy4gKi9cbiAgdmFyIHVuZGVmaW5lZDtcblxuICAvKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBPYmplY3QuICovXG4gIHZhciBvYmplY3RUeXBlcyA9IHtcbiAgICAnZnVuY3Rpb24nOiB0cnVlLFxuICAgICdvYmplY3QnOiB0cnVlXG4gIH07XG5cbiAgLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG4gIHZhciByb290ID0gKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdykgfHwgdGhpcztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGRlZmluZWAuICovXG4gIHZhciBmcmVlRGVmaW5lID0gdHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQgJiYgZGVmaW5lO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG4gIHZhciBmcmVlRXhwb3J0cyA9IG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgLiAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWwpKSB7XG4gICAgcm9vdCA9IGZyZWVHbG9iYWw7XG4gIH1cblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHJlcXVpcmVgLiAqL1xuICB2YXIgZnJlZVJlcXVpcmUgPSB0eXBlb2YgcmVxdWlyZSA9PSAnZnVuY3Rpb24nICYmIHJlcXVpcmU7XG5cbiAgLyoqIFVzZWQgdG8gYXNzaWduIGVhY2ggYmVuY2htYXJrIGFuIGluY3JlbWVudGVkIGlkLiAqL1xuICB2YXIgY291bnRlciA9IDA7XG5cbiAgLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbiAgdmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHMgJiYgZnJlZUV4cG9ydHM7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0IHByaW1pdGl2ZSB0eXBlcy4gKi9cbiAgdmFyIHJlUHJpbWl0aXZlID0gL14oPzpib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkKSQvO1xuXG4gIC8qKiBVc2VkIHRvIG1ha2UgZXZlcnkgY29tcGlsZWQgdGVzdCB1bmlxdWUuICovXG4gIHZhciB1aWRDb3VudGVyID0gMDtcblxuICAvKiogVXNlZCB0byBhc3NpZ24gZGVmYXVsdCBgY29udGV4dGAgb2JqZWN0IHByb3BlcnRpZXMuICovXG4gIHZhciBjb250ZXh0UHJvcHMgPSBbXG4gICAgJ0FycmF5JywgJ0RhdGUnLCAnRnVuY3Rpb24nLCAnTWF0aCcsICdPYmplY3QnLCAnUmVnRXhwJywgJ1N0cmluZycsICdfJyxcbiAgICAnY2xlYXJUaW1lb3V0JywgJ2Nocm9tZScsICdjaHJvbWl1bScsICdkb2N1bWVudCcsICduYXZpZ2F0b3InLCAncGhhbnRvbScsXG4gICAgJ3BsYXRmb3JtJywgJ3Byb2Nlc3MnLCAncnVudGltZScsICdzZXRUaW1lb3V0J1xuICBdO1xuXG4gIC8qKiBVc2VkIHRvIGF2b2lkIGh6IG9mIEluZmluaXR5LiAqL1xuICB2YXIgZGl2aXNvcnMgPSB7XG4gICAgJzEnOiA0MDk2LFxuICAgICcyJzogNTEyLFxuICAgICczJzogNjQsXG4gICAgJzQnOiA4LFxuICAgICc1JzogMFxuICB9O1xuXG4gIC8qKlxuICAgKiBULURpc3RyaWJ1dGlvbiB0d28tdGFpbGVkIGNyaXRpY2FsIHZhbHVlcyBmb3IgOTUlIGNvbmZpZGVuY2UuXG4gICAqIEZvciBtb3JlIGluZm8gc2VlIGh0dHA6Ly93d3cuaXRsLm5pc3QuZ292L2Rpdjg5OC9oYW5kYm9vay9lZGEvc2VjdGlvbjMvZWRhMzY3Mi5odG0uXG4gICAqL1xuICB2YXIgdFRhYmxlID0ge1xuICAgICcxJzogIDEyLjcwNiwgJzInOiAgNC4zMDMsICczJzogIDMuMTgyLCAnNCc6ICAyLjc3NiwgJzUnOiAgMi41NzEsICc2JzogIDIuNDQ3LFxuICAgICc3JzogIDIuMzY1LCAgJzgnOiAgMi4zMDYsICc5JzogIDIuMjYyLCAnMTAnOiAyLjIyOCwgJzExJzogMi4yMDEsICcxMic6IDIuMTc5LFxuICAgICcxMyc6IDIuMTYsICAgJzE0JzogMi4xNDUsICcxNSc6IDIuMTMxLCAnMTYnOiAyLjEyLCAgJzE3JzogMi4xMSwgICcxOCc6IDIuMTAxLFxuICAgICcxOSc6IDIuMDkzLCAgJzIwJzogMi4wODYsICcyMSc6IDIuMDgsICAnMjInOiAyLjA3NCwgJzIzJzogMi4wNjksICcyNCc6IDIuMDY0LFxuICAgICcyNSc6IDIuMDYsICAgJzI2JzogMi4wNTYsICcyNyc6IDIuMDUyLCAnMjgnOiAyLjA0OCwgJzI5JzogMi4wNDUsICczMCc6IDIuMDQyLFxuICAgICdpbmZpbml0eSc6IDEuOTZcbiAgfTtcblxuICAvKipcbiAgICogQ3JpdGljYWwgTWFubi1XaGl0bmV5IFUtdmFsdWVzIGZvciA5NSUgY29uZmlkZW5jZS5cbiAgICogRm9yIG1vcmUgaW5mbyBzZWUgaHR0cDovL3d3dy5zYWJ1cmNoaWxsLmNvbS9JQmJpb2xvZ3kvc3RhdHMvMDAzLmh0bWwuXG4gICAqL1xuICB2YXIgdVRhYmxlID0ge1xuICAgICc1JzogIFswLCAxLCAyXSxcbiAgICAnNic6ICBbMSwgMiwgMywgNV0sXG4gICAgJzcnOiAgWzEsIDMsIDUsIDYsIDhdLFxuICAgICc4JzogIFsyLCA0LCA2LCA4LCAxMCwgMTNdLFxuICAgICc5JzogIFsyLCA0LCA3LCAxMCwgMTIsIDE1LCAxN10sXG4gICAgJzEwJzogWzMsIDUsIDgsIDExLCAxNCwgMTcsIDIwLCAyM10sXG4gICAgJzExJzogWzMsIDYsIDksIDEzLCAxNiwgMTksIDIzLCAyNiwgMzBdLFxuICAgICcxMic6IFs0LCA3LCAxMSwgMTQsIDE4LCAyMiwgMjYsIDI5LCAzMywgMzddLFxuICAgICcxMyc6IFs0LCA4LCAxMiwgMTYsIDIwLCAyNCwgMjgsIDMzLCAzNywgNDEsIDQ1XSxcbiAgICAnMTQnOiBbNSwgOSwgMTMsIDE3LCAyMiwgMjYsIDMxLCAzNiwgNDAsIDQ1LCA1MCwgNTVdLFxuICAgICcxNSc6IFs1LCAxMCwgMTQsIDE5LCAyNCwgMjksIDM0LCAzOSwgNDQsIDQ5LCA1NCwgNTksIDY0XSxcbiAgICAnMTYnOiBbNiwgMTEsIDE1LCAyMSwgMjYsIDMxLCAzNywgNDIsIDQ3LCA1MywgNTksIDY0LCA3MCwgNzVdLFxuICAgICcxNyc6IFs2LCAxMSwgMTcsIDIyLCAyOCwgMzQsIDM5LCA0NSwgNTEsIDU3LCA2MywgNjcsIDc1LCA4MSwgODddLFxuICAgICcxOCc6IFs3LCAxMiwgMTgsIDI0LCAzMCwgMzYsIDQyLCA0OCwgNTUsIDYxLCA2NywgNzQsIDgwLCA4NiwgOTMsIDk5XSxcbiAgICAnMTknOiBbNywgMTMsIDE5LCAyNSwgMzIsIDM4LCA0NSwgNTIsIDU4LCA2NSwgNzIsIDc4LCA4NSwgOTIsIDk5LCAxMDYsIDExM10sXG4gICAgJzIwJzogWzgsIDE0LCAyMCwgMjcsIDM0LCA0MSwgNDgsIDU1LCA2MiwgNjksIDc2LCA4MywgOTAsIDk4LCAxMDUsIDExMiwgMTE5LCAxMjddLFxuICAgICcyMSc6IFs4LCAxNSwgMjIsIDI5LCAzNiwgNDMsIDUwLCA1OCwgNjUsIDczLCA4MCwgODgsIDk2LCAxMDMsIDExMSwgMTE5LCAxMjYsIDEzNCwgMTQyXSxcbiAgICAnMjInOiBbOSwgMTYsIDIzLCAzMCwgMzgsIDQ1LCA1MywgNjEsIDY5LCA3NywgODUsIDkzLCAxMDEsIDEwOSwgMTE3LCAxMjUsIDEzMywgMTQxLCAxNTAsIDE1OF0sXG4gICAgJzIzJzogWzksIDE3LCAyNCwgMzIsIDQwLCA0OCwgNTYsIDY0LCA3MywgODEsIDg5LCA5OCwgMTA2LCAxMTUsIDEyMywgMTMyLCAxNDAsIDE0OSwgMTU3LCAxNjYsIDE3NV0sXG4gICAgJzI0JzogWzEwLCAxNywgMjUsIDMzLCA0MiwgNTAsIDU5LCA2NywgNzYsIDg1LCA5NCwgMTAyLCAxMTEsIDEyMCwgMTI5LCAxMzgsIDE0NywgMTU2LCAxNjUsIDE3NCwgMTgzLCAxOTJdLFxuICAgICcyNSc6IFsxMCwgMTgsIDI3LCAzNSwgNDQsIDUzLCA2MiwgNzEsIDgwLCA4OSwgOTgsIDEwNywgMTE3LCAxMjYsIDEzNSwgMTQ1LCAxNTQsIDE2MywgMTczLCAxODIsIDE5MiwgMjAxLCAyMTFdLFxuICAgICcyNic6IFsxMSwgMTksIDI4LCAzNywgNDYsIDU1LCA2NCwgNzQsIDgzLCA5MywgMTAyLCAxMTIsIDEyMiwgMTMyLCAxNDEsIDE1MSwgMTYxLCAxNzEsIDE4MSwgMTkxLCAyMDAsIDIxMCwgMjIwLCAyMzBdLFxuICAgICcyNyc6IFsxMSwgMjAsIDI5LCAzOCwgNDgsIDU3LCA2NywgNzcsIDg3LCA5NywgMTA3LCAxMTgsIDEyNSwgMTM4LCAxNDcsIDE1OCwgMTY4LCAxNzgsIDE4OCwgMTk5LCAyMDksIDIxOSwgMjMwLCAyNDAsIDI1MF0sXG4gICAgJzI4JzogWzEyLCAyMSwgMzAsIDQwLCA1MCwgNjAsIDcwLCA4MCwgOTAsIDEwMSwgMTExLCAxMjIsIDEzMiwgMTQzLCAxNTQsIDE2NCwgMTc1LCAxODYsIDE5NiwgMjA3LCAyMTgsIDIyOCwgMjM5LCAyNTAsIDI2MSwgMjcyXSxcbiAgICAnMjknOiBbMTMsIDIyLCAzMiwgNDIsIDUyLCA2MiwgNzMsIDgzLCA5NCwgMTA1LCAxMTYsIDEyNywgMTM4LCAxNDksIDE2MCwgMTcxLCAxODIsIDE5MywgMjA0LCAyMTUsIDIyNiwgMjM4LCAyNDksIDI2MCwgMjcxLCAyODIsIDI5NF0sXG4gICAgJzMwJzogWzEzLCAyMywgMzMsIDQzLCA1NCwgNjUsIDc2LCA4NywgOTgsIDEwOSwgMTIwLCAxMzEsIDE0MywgMTU0LCAxNjYsIDE3NywgMTg5LCAyMDAsIDIxMiwgMjIzLCAyMzUsIDI0NywgMjU4LCAyNzAsIDI4MiwgMjkzLCAzMDUsIDMxN11cbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGBCZW5jaG1hcmtgIGZ1bmN0aW9uIHVzaW5nIHRoZSBnaXZlbiBgY29udGV4dGAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0PXJvb3RdIFRoZSBjb250ZXh0IG9iamVjdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGEgbmV3IGBCZW5jaG1hcmtgIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gcnVuSW5Db250ZXh0KGNvbnRleHQpIHtcbiAgICAvLyBFeGl0IGVhcmx5IGlmIHVuYWJsZSB0byBhY3F1aXJlIGxvZGFzaC5cbiAgICB2YXIgXyA9IGNvbnRleHQgJiYgY29udGV4dC5fIHx8IHJlcXVpcmUoJ2xvZGFzaCcpIHx8IHJvb3QuXztcbiAgICBpZiAoIV8pIHtcbiAgICAgIEJlbmNobWFyay5ydW5JbkNvbnRleHQgPSBydW5JbkNvbnRleHQ7XG4gICAgICByZXR1cm4gQmVuY2htYXJrO1xuICAgIH1cbiAgICAvLyBBdm9pZCBpc3N1ZXMgd2l0aCBzb21lIEVTMyBlbnZpcm9ubWVudHMgdGhhdCBhdHRlbXB0IHRvIHVzZSB2YWx1ZXMsIG5hbWVkXG4gICAgLy8gYWZ0ZXIgYnVpbHQtaW4gY29uc3RydWN0b3JzIGxpa2UgYE9iamVjdGAsIGZvciB0aGUgY3JlYXRpb24gb2YgbGl0ZXJhbHMuXG4gICAgLy8gRVM1IGNsZWFycyB0aGlzIHVwIGJ5IHN0YXRpbmcgdGhhdCBsaXRlcmFscyBtdXN0IHVzZSBidWlsdC1pbiBjb25zdHJ1Y3RvcnMuXG4gICAgLy8gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTEuMS41LlxuICAgIGNvbnRleHQgPSBjb250ZXh0ID8gXy5kZWZhdWx0cyhyb290Lk9iamVjdCgpLCBjb250ZXh0LCBfLnBpY2socm9vdCwgY29udGV4dFByb3BzKSkgOiByb290O1xuXG4gICAgLyoqIE5hdGl2ZSBjb25zdHJ1Y3RvciByZWZlcmVuY2VzLiAqL1xuICAgIHZhciBBcnJheSA9IGNvbnRleHQuQXJyYXksXG4gICAgICAgIERhdGUgPSBjb250ZXh0LkRhdGUsXG4gICAgICAgIEZ1bmN0aW9uID0gY29udGV4dC5GdW5jdGlvbixcbiAgICAgICAgTWF0aCA9IGNvbnRleHQuTWF0aCxcbiAgICAgICAgT2JqZWN0ID0gY29udGV4dC5PYmplY3QsXG4gICAgICAgIFJlZ0V4cCA9IGNvbnRleHQuUmVnRXhwLFxuICAgICAgICBTdHJpbmcgPSBjb250ZXh0LlN0cmluZztcblxuICAgIC8qKiBVc2VkIGZvciBgQXJyYXlgIGFuZCBgT2JqZWN0YCBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbiAgICB2YXIgYXJyYXlSZWYgPSBbXSxcbiAgICAgICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gICAgLyoqIE5hdGl2ZSBtZXRob2Qgc2hvcnRjdXRzLiAqL1xuICAgIHZhciBhYnMgPSBNYXRoLmFicyxcbiAgICAgICAgY2xlYXJUaW1lb3V0ID0gY29udGV4dC5jbGVhclRpbWVvdXQsXG4gICAgICAgIGZsb29yID0gTWF0aC5mbG9vcixcbiAgICAgICAgbG9nID0gTWF0aC5sb2csXG4gICAgICAgIG1heCA9IE1hdGgubWF4LFxuICAgICAgICBtaW4gPSBNYXRoLm1pbixcbiAgICAgICAgcG93ID0gTWF0aC5wb3csXG4gICAgICAgIHB1c2ggPSBhcnJheVJlZi5wdXNoLFxuICAgICAgICBzZXRUaW1lb3V0ID0gY29udGV4dC5zZXRUaW1lb3V0LFxuICAgICAgICBzaGlmdCA9IGFycmF5UmVmLnNoaWZ0LFxuICAgICAgICBzbGljZSA9IGFycmF5UmVmLnNsaWNlLFxuICAgICAgICBzcXJ0ID0gTWF0aC5zcXJ0LFxuICAgICAgICB0b1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nLFxuICAgICAgICB1bnNoaWZ0ID0gYXJyYXlSZWYudW5zaGlmdDtcblxuICAgIC8qKiBVc2VkIHRvIGF2b2lkIGluY2x1c2lvbiBpbiBCcm93c2VyaWZpZWQgYnVuZGxlcy4gKi9cbiAgICB2YXIgcmVxID0gcmVxdWlyZTtcblxuICAgIC8qKiBEZXRlY3QgRE9NIGRvY3VtZW50IG9iamVjdC4gKi9cbiAgICB2YXIgZG9jID0gaXNIb3N0VHlwZShjb250ZXh0LCAnZG9jdW1lbnQnKSAmJiBjb250ZXh0LmRvY3VtZW50O1xuXG4gICAgLyoqIFVzZWQgdG8gYWNjZXNzIFdhZGUgU2ltbW9ucycgTm9kZS5qcyBgbWljcm90aW1lYCBtb2R1bGUuICovXG4gICAgdmFyIG1pY3JvdGltZU9iamVjdCA9IHJlcSgnbWljcm90aW1lJyk7XG5cbiAgICAvKiogVXNlZCB0byBhY2Nlc3MgTm9kZS5qcydzIGhpZ2ggcmVzb2x1dGlvbiB0aW1lci4gKi9cbiAgICB2YXIgcHJvY2Vzc09iamVjdCA9IGlzSG9zdFR5cGUoY29udGV4dCwgJ3Byb2Nlc3MnKSAmJiBjb250ZXh0LnByb2Nlc3M7XG5cbiAgICAvKiogVXNlZCB0byBwcmV2ZW50IGEgYHJlbW92ZUNoaWxkYCBtZW1vcnkgbGVhayBpbiBJRSA8IDkuICovXG4gICAgdmFyIHRyYXNoID0gZG9jICYmIGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIC8qKiBVc2VkIHRvIGludGVncml0eSBjaGVjayBjb21waWxlZCB0ZXN0cy4gKi9cbiAgICB2YXIgdWlkID0gJ3VpZCcgKyBfLm5vdygpO1xuXG4gICAgLyoqIFVzZWQgdG8gYXZvaWQgaW5maW5pdGUgcmVjdXJzaW9uIHdoZW4gbWV0aG9kcyBjYWxsIGVhY2ggb3RoZXIuICovXG4gICAgdmFyIGNhbGxlZEJ5ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgdXNlZCB0byBmbGFnIGVudmlyb25tZW50cy9mZWF0dXJlcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgdmFyIHN1cHBvcnQgPSB7fTtcblxuICAgIChmdW5jdGlvbigpIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlY3QgaWYgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5zdXBwb3J0XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgIHN1cHBvcnQuYnJvd3NlciA9IGRvYyAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICduYXZpZ2F0b3InKSAmJiAhaXNIb3N0VHlwZShjb250ZXh0LCAncGhhbnRvbScpO1xuXG4gICAgICAvKipcbiAgICAgICAqIERldGVjdCBpZiB0aGUgVGltZXJzIEFQSSBleGlzdHMuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5zdXBwb3J0XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgIHN1cHBvcnQudGltZW91dCA9IGlzSG9zdFR5cGUoY29udGV4dCwgJ3NldFRpbWVvdXQnKSAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICdjbGVhclRpbWVvdXQnKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlY3QgaWYgZnVuY3Rpb24gZGVjb21waWxhdGlvbiBpcyBzdXBwb3J0LlxuICAgICAgICpcbiAgICAgICAqIEBuYW1lIGRlY29tcGlsYXRpb25cbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuc3VwcG9ydFxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICB0cnkge1xuICAgICAgICAvLyBTYWZhcmkgMi54IHJlbW92ZXMgY29tbWFzIGluIG9iamVjdCBsaXRlcmFscyBmcm9tIGBGdW5jdGlvbiN0b1N0cmluZ2AgcmVzdWx0cy5cbiAgICAgICAgLy8gU2VlIGh0dHA6Ly93ZWJrLml0LzExNjA5IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICAgIC8vIEZpcmVmb3ggMy42IGFuZCBPcGVyYSA5LjI1IHN0cmlwIGdyb3VwaW5nIHBhcmVudGhlc2VzIGZyb20gYEZ1bmN0aW9uI3RvU3RyaW5nYCByZXN1bHRzLlxuICAgICAgICAvLyBTZWUgaHR0cDovL2J1Z3ppbC5sYS81NTk0MzggZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgICAgc3VwcG9ydC5kZWNvbXBpbGF0aW9uID0gRnVuY3Rpb24oXG4gICAgICAgICAgKCdyZXR1cm4gKCcgKyAoZnVuY3Rpb24oeCkgeyByZXR1cm4geyAneCc6ICcnICsgKDEgKyB4KSArICcnLCAneSc6IDAgfTsgfSkgKyAnKScpXG4gICAgICAgICAgLy8gQXZvaWQgaXNzdWVzIHdpdGggY29kZSBhZGRlZCBieSBJc3RhbmJ1bC5cbiAgICAgICAgICAucmVwbGFjZSgvX19jb3ZfX1teO10rOy9nLCAnJylcbiAgICAgICAgKSgpKDApLnggPT09ICcxJztcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBzdXBwb3J0LmRlY29tcGlsYXRpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9KCkpO1xuXG4gICAgLyoqXG4gICAgICogVGltZXIgb2JqZWN0IHVzZWQgYnkgYGNsb2NrKClgIGFuZCBgRGVmZXJyZWQjcmVzb2x2ZWAuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciB0aW1lciA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdGltZXIgbmFtZXNwYWNlIG9iamVjdCBvciBjb25zdHJ1Y3Rvci5cbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogQG1lbWJlck9mIHRpbWVyXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258T2JqZWN0fVxuICAgICAgICovXG4gICAgICAnbnMnOiBEYXRlLFxuXG4gICAgICAvKipcbiAgICAgICAqIFN0YXJ0cyB0aGUgZGVmZXJyZWQgdGltZXIuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBtZW1iZXJPZiB0aW1lclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRlZmVycmVkIFRoZSBkZWZlcnJlZCBpbnN0YW5jZS5cbiAgICAgICAqL1xuICAgICAgJ3N0YXJ0JzogbnVsbCwgLy8gTGF6eSBkZWZpbmVkIGluIGBjbG9jaygpYC5cblxuICAgICAgLyoqXG4gICAgICAgKiBTdG9wcyB0aGUgZGVmZXJyZWQgdGltZXIuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBtZW1iZXJPZiB0aW1lclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRlZmVycmVkIFRoZSBkZWZlcnJlZCBpbnN0YW5jZS5cbiAgICAgICAqL1xuICAgICAgJ3N0b3AnOiBudWxsIC8vIExhenkgZGVmaW5lZCBpbiBgY2xvY2soKWAuXG4gICAgfTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBCZW5jaG1hcmsgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBOb3RlOiBUaGUgQmVuY2htYXJrIGNvbnN0cnVjdG9yIGV4cG9zZXMgYSBoYW5kZnVsIG9mIGxvZGFzaCBtZXRob2RzIHRvXG4gICAgICogbWFrZSB3b3JraW5nIHdpdGggYXJyYXlzLCBjb2xsZWN0aW9ucywgYW5kIG9iamVjdHMgZWFzaWVyLiBUaGUgbG9kYXNoXG4gICAgICogbWV0aG9kcyBhcmU6XG4gICAgICogW2BlYWNoL2ZvckVhY2hgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNmb3JFYWNoKSwgW2Bmb3JPd25gXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNmb3JPd24pLFxuICAgICAqIFtgaGFzYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjaGFzKSwgW2BpbmRleE9mYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjaW5kZXhPZiksXG4gICAgICogW2BtYXBgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNtYXApLCBhbmQgW2ByZWR1Y2VgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNyZWR1Y2UpXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgdG8gaWRlbnRpZnkgdGhlIGJlbmNobWFyay5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZm4gVGhlIHRlc3QgdG8gYmVuY2htYXJrLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlICh0aGUgYG5ld2Agb3BlcmF0b3IgaXMgb3B0aW9uYWwpXG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyayhmbik7XG4gICAgICpcbiAgICAgKiAvLyBvciB1c2luZyBhIG5hbWUgZmlyc3RcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKCdmb28nLCBmbik7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKCdmb28nLCBmbiwge1xuICAgICAqXG4gICAgICogICAvLyBkaXNwbGF5ZWQgYnkgYEJlbmNobWFyayN0b1N0cmluZ2AgaWYgYG5hbWVgIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgKiAgICdpZCc6ICd4eXonLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIHN0YXJ0cyBydW5uaW5nXG4gICAgICogICAnb25TdGFydCc6IG9uU3RhcnQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCBhZnRlciBlYWNoIHJ1biBjeWNsZVxuICAgICAqICAgJ29uQ3ljbGUnOiBvbkN5Y2xlLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiBhYm9ydGVkXG4gICAgICogICAnb25BYm9ydCc6IG9uQWJvcnQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIGEgdGVzdCBlcnJvcnNcbiAgICAgKiAgICdvbkVycm9yJzogb25FcnJvcixcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gcmVzZXRcbiAgICAgKiAgICdvblJlc2V0Jzogb25SZXNldCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBjb21wbGV0ZXMgcnVubmluZ1xuICAgICAqICAgJ29uQ29tcGxldGUnOiBvbkNvbXBsZXRlLFxuICAgICAqXG4gICAgICogICAvLyBjb21waWxlZC9jYWxsZWQgYmVmb3JlIHRoZSB0ZXN0IGxvb3BcbiAgICAgKiAgICdzZXR1cCc6IHNldHVwLFxuICAgICAqXG4gICAgICogICAvLyBjb21waWxlZC9jYWxsZWQgYWZ0ZXIgdGhlIHRlc3QgbG9vcFxuICAgICAqICAgJ3RlYXJkb3duJzogdGVhcmRvd25cbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIG9yIG5hbWUgYW5kIG9wdGlvbnNcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKCdmb28nLCB7XG4gICAgICpcbiAgICAgKiAgIC8vIGEgZmxhZyB0byBpbmRpY2F0ZSB0aGUgYmVuY2htYXJrIGlzIGRlZmVycmVkXG4gICAgICogICAnZGVmZXInOiB0cnVlLFxuICAgICAqXG4gICAgICogICAvLyBiZW5jaG1hcmsgdGVzdCBmdW5jdGlvblxuICAgICAqICAgJ2ZuJzogZnVuY3Rpb24oZGVmZXJyZWQpIHtcbiAgICAgKiAgICAgLy8gY2FsbCBgRGVmZXJyZWQjcmVzb2x2ZWAgd2hlbiB0aGUgZGVmZXJyZWQgdGVzdCBpcyBmaW5pc2hlZFxuICAgICAqICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICogICB9XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiAvLyBvciBvcHRpb25zIG9ubHlcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKHtcbiAgICAgKlxuICAgICAqICAgLy8gYmVuY2htYXJrIG5hbWVcbiAgICAgKiAgICduYW1lJzogJ2ZvbycsXG4gICAgICpcbiAgICAgKiAgIC8vIGJlbmNobWFyayB0ZXN0IGFzIGEgc3RyaW5nXG4gICAgICogICAnZm4nOiAnWzEsMiwzLDRdLnNvcnQoKSdcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIGEgdGVzdCdzIGB0aGlzYCBiaW5kaW5nIGlzIHNldCB0byB0aGUgYmVuY2htYXJrIGluc3RhbmNlXG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyaygnZm9vJywgZnVuY3Rpb24oKSB7XG4gICAgICogICAnTXkgbmFtZSBpcyAnLmNvbmNhdCh0aGlzLm5hbWUpOyAvLyBcIk15IG5hbWUgaXMgZm9vXCJcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBCZW5jaG1hcmsobmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXM7XG5cbiAgICAgIC8vIEFsbG93IGluc3RhbmNlIGNyZWF0aW9uIHdpdGhvdXQgdGhlIGBuZXdgIG9wZXJhdG9yLlxuICAgICAgaWYgKCEoYmVuY2ggaW5zdGFuY2VvZiBCZW5jaG1hcmspKSB7XG4gICAgICAgIHJldHVybiBuZXcgQmVuY2htYXJrKG5hbWUsIGZuLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIC8vIDEgYXJndW1lbnQgKG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gbmFtZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKF8uaXNGdW5jdGlvbihuYW1lKSkge1xuICAgICAgICAvLyAyIGFyZ3VtZW50cyAoZm4sIG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gZm47XG4gICAgICAgIGZuID0gbmFtZTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKF8uaXNQbGFpbk9iamVjdChmbikpIHtcbiAgICAgICAgLy8gMiBhcmd1bWVudHMgKG5hbWUsIG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gZm47XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICAgICAgYmVuY2gubmFtZSA9IG5hbWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gMyBhcmd1bWVudHMgKG5hbWUsIGZuIFssIG9wdGlvbnNdKS5cbiAgICAgICAgYmVuY2gubmFtZSA9IG5hbWU7XG4gICAgICB9XG4gICAgICBzZXRPcHRpb25zKGJlbmNoLCBvcHRpb25zKTtcblxuICAgICAgYmVuY2guaWQgfHwgKGJlbmNoLmlkID0gKytjb3VudGVyKTtcbiAgICAgIGJlbmNoLmZuID09IG51bGwgJiYgKGJlbmNoLmZuID0gZm4pO1xuXG4gICAgICBiZW5jaC5zdGF0cyA9IGNsb25lRGVlcChiZW5jaC5zdGF0cyk7XG4gICAgICBiZW5jaC50aW1lcyA9IGNsb25lRGVlcChiZW5jaC50aW1lcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIERlZmVycmVkIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjbG9uZSBUaGUgY2xvbmVkIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBEZWZlcnJlZChjbG9uZSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gdGhpcztcbiAgICAgIGlmICghKGRlZmVycmVkIGluc3RhbmNlb2YgRGVmZXJyZWQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGVmZXJyZWQoY2xvbmUpO1xuICAgICAgfVxuICAgICAgZGVmZXJyZWQuYmVuY2htYXJrID0gY2xvbmU7XG4gICAgICBjbG9jayhkZWZlcnJlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIEV2ZW50IGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFdmVudCh0eXBlKSB7XG4gICAgICB2YXIgZXZlbnQgPSB0aGlzO1xuICAgICAgaWYgKHR5cGUgaW5zdGFuY2VvZiBFdmVudCkge1xuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoZXZlbnQgaW5zdGFuY2VvZiBFdmVudClcbiAgICAgICAgPyBfLmFzc2lnbihldmVudCwgeyAndGltZVN0YW1wJzogXy5ub3coKSB9LCB0eXBlb2YgdHlwZSA9PSAnc3RyaW5nJyA/IHsgJ3R5cGUnOiB0eXBlIH0gOiB0eXBlKVxuICAgICAgICA6IG5ldyBFdmVudCh0eXBlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgU3VpdGUgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBOb3RlOiBFYWNoIFN1aXRlIGluc3RhbmNlIGhhcyBhIGhhbmRmdWwgb2Ygd3JhcHBlZCBsb2Rhc2ggbWV0aG9kcyB0b1xuICAgICAqIG1ha2Ugd29ya2luZyB3aXRoIFN1aXRlcyBlYXNpZXIuIFRoZSB3cmFwcGVkIGxvZGFzaCBtZXRob2RzIGFyZTpcbiAgICAgKiBbYGVhY2gvZm9yRWFjaGBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI2ZvckVhY2gpLCBbYGluZGV4T2ZgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNpbmRleE9mKSxcbiAgICAgKiBbYG1hcGBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI21hcCksIGFuZCBbYHJlZHVjZWBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI3JlZHVjZSlcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgdG8gaWRlbnRpZnkgdGhlIHN1aXRlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlICh0aGUgYG5ld2Agb3BlcmF0b3IgaXMgb3B0aW9uYWwpXG4gICAgICogdmFyIHN1aXRlID0gbmV3IEJlbmNobWFyay5TdWl0ZTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHVzaW5nIGEgbmFtZSBmaXJzdFxuICAgICAqIHZhciBzdWl0ZSA9IG5ldyBCZW5jaG1hcmsuU3VpdGUoJ2ZvbycpO1xuICAgICAqXG4gICAgICogLy8gb3Igd2l0aCBvcHRpb25zXG4gICAgICogdmFyIHN1aXRlID0gbmV3IEJlbmNobWFyay5TdWl0ZSgnZm9vJywge1xuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiB0aGUgc3VpdGUgc3RhcnRzIHJ1bm5pbmdcbiAgICAgKiAgICdvblN0YXJ0Jzogb25TdGFydCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIGJldHdlZW4gcnVubmluZyBiZW5jaG1hcmtzXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIGFib3J0ZWRcbiAgICAgKiAgICdvbkFib3J0Jzogb25BYm9ydCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gYSB0ZXN0IGVycm9yc1xuICAgICAqICAgJ29uRXJyb3InOiBvbkVycm9yLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiByZXNldFxuICAgICAqICAgJ29uUmVzZXQnOiBvblJlc2V0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiB0aGUgc3VpdGUgY29tcGxldGVzIHJ1bm5pbmdcbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFN1aXRlKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzdWl0ZSA9IHRoaXM7XG5cbiAgICAgIC8vIEFsbG93IGluc3RhbmNlIGNyZWF0aW9uIHdpdGhvdXQgdGhlIGBuZXdgIG9wZXJhdG9yLlxuICAgICAgaWYgKCEoc3VpdGUgaW5zdGFuY2VvZiBTdWl0ZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWl0ZShuYW1lLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgICBpZiAoXy5pc1BsYWluT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIC8vIDEgYXJndW1lbnQgKG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gbmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIDIgYXJndW1lbnRzIChuYW1lIFssIG9wdGlvbnNdKS5cbiAgICAgICAgc3VpdGUubmFtZSA9IG5hbWU7XG4gICAgICB9XG4gICAgICBzZXRPcHRpb25zKHN1aXRlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uY2xvbmVEZWVwYCB3aGljaCBvbmx5IGNsb25lcyBhcnJheXMgYW5kIHBsYWluXG4gICAgICogb2JqZWN0cyBhc3NpZ25pbmcgYWxsIG90aGVyIHZhbHVlcyBieSByZWZlcmVuY2UuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICAgICAqIEByZXR1cm5zIHsqfSBUaGUgY2xvbmVkIHZhbHVlLlxuICAgICAqL1xuICAgIHZhciBjbG9uZURlZXAgPSBfLnBhcnRpYWwoXy5jbG9uZURlZXBXaXRoLCBfLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgLy8gT25seSBjbG9uZSBwcmltaXRpdmVzLCBhcnJheXMsIGFuZCBwbGFpbiBvYmplY3RzLlxuICAgICAgcmV0dXJuIChfLmlzT2JqZWN0KHZhbHVlKSAmJiAhXy5pc0FycmF5KHZhbHVlKSAmJiAhXy5pc1BsYWluT2JqZWN0KHZhbHVlKSlcbiAgICAgICAgPyB2YWx1ZVxuICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiBmcm9tIHRoZSBnaXZlbiBhcmd1bWVudHMgc3RyaW5nIGFuZCBib2R5LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYXJncyBUaGUgY29tbWEgc2VwYXJhdGVkIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYm9keSBUaGUgZnVuY3Rpb24gYm9keS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb24oKSB7XG4gICAgICAvLyBMYXp5IGRlZmluZS5cbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24oYXJncywgYm9keSkge1xuICAgICAgICB2YXIgcmVzdWx0LFxuICAgICAgICAgICAgYW5jaG9yID0gZnJlZURlZmluZSA/IGZyZWVEZWZpbmUuYW1kIDogQmVuY2htYXJrLFxuICAgICAgICAgICAgcHJvcCA9IHVpZCArICdjcmVhdGVGdW5jdGlvbic7XG5cbiAgICAgICAgcnVuU2NyaXB0KChmcmVlRGVmaW5lID8gJ2RlZmluZS5hbWQuJyA6ICdCZW5jaG1hcmsuJykgKyBwcm9wICsgJz1mdW5jdGlvbignICsgYXJncyArICcpeycgKyBib2R5ICsgJ30nKTtcbiAgICAgICAgcmVzdWx0ID0gYW5jaG9yW3Byb3BdO1xuICAgICAgICBkZWxldGUgYW5jaG9yW3Byb3BdO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICAgIC8vIEZpeCBKYWVnZXJNb25rZXkgYnVnLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHA6Ly9idWd6aWwubGEvNjM5NzIwLlxuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBzdXBwb3J0LmJyb3dzZXIgJiYgKGNyZWF0ZUZ1bmN0aW9uKCcnLCAncmV0dXJuXCInICsgdWlkICsgJ1wiJykgfHwgXy5ub29wKSgpID09IHVpZCA/IGNyZWF0ZUZ1bmN0aW9uIDogRnVuY3Rpb247XG4gICAgICByZXR1cm4gY3JlYXRlRnVuY3Rpb24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxheSB0aGUgZXhlY3V0aW9uIG9mIGEgZnVuY3Rpb24gYmFzZWQgb24gdGhlIGJlbmNobWFyaydzIGBkZWxheWAgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBiZW5jaCBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmbiBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWxheShiZW5jaCwgZm4pIHtcbiAgICAgIGJlbmNoLl90aW1lcklkID0gXy5kZWxheShmbiwgYmVuY2guZGVsYXkgKiAxZTMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3lzIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gZGVzdHJveS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZXN0cm95RWxlbWVudChlbGVtZW50KSB7XG4gICAgICB0cmFzaC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgIHRyYXNoLmlubmVySFRNTCA9ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5hbWUgb2YgdGhlIGZpcnN0IGFyZ3VtZW50IGZyb20gYSBmdW5jdGlvbidzIHNvdXJjZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBhcmd1bWVudCBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEZpcnN0QXJndW1lbnQoZm4pIHtcbiAgICAgIHJldHVybiAoIV8uaGFzKGZuLCAndG9TdHJpbmcnKSAmJlxuICAgICAgICAoL15bXFxzKF0qZnVuY3Rpb25bXihdKlxcKChbXlxccywpXSspLy5leGVjKGZuKSB8fCAwKVsxXSkgfHwgJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgdGhlIGFyaXRobWV0aWMgbWVhbiBvZiBhIHNhbXBsZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gc2FtcGxlIFRoZSBzYW1wbGUuXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIG1lYW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TWVhbihzYW1wbGUpIHtcbiAgICAgIHJldHVybiAoXy5yZWR1Y2Uoc2FtcGxlLCBmdW5jdGlvbihzdW0sIHgpIHtcbiAgICAgICAgcmV0dXJuIHN1bSArIHg7XG4gICAgICB9KSAvIHNhbXBsZS5sZW5ndGgpIHx8IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc291cmNlIGNvZGUgb2YgYSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmdW5jdGlvbidzIHNvdXJjZSBjb2RlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFNvdXJjZShmbikge1xuICAgICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgICAgaWYgKGlzU3RyaW5nYWJsZShmbikpIHtcbiAgICAgICAgcmVzdWx0ID0gU3RyaW5nKGZuKTtcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5kZWNvbXBpbGF0aW9uKSB7XG4gICAgICAgIC8vIEVzY2FwZSB0aGUgYHtgIGZvciBGaXJlZm94IDEuXG4gICAgICAgIHJlc3VsdCA9IF8ucmVzdWx0KC9eW157XStcXHsoW1xcc1xcU10qKVxcfVxccyokLy5leGVjKGZuKSwgMSk7XG4gICAgICB9XG4gICAgICAvLyBUcmltIHN0cmluZy5cbiAgICAgIHJlc3VsdCA9IChyZXN1bHQgfHwgJycpLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcblxuICAgICAgLy8gRGV0ZWN0IHN0cmluZ3MgY29udGFpbmluZyBvbmx5IHRoZSBcInVzZSBzdHJpY3RcIiBkaXJlY3RpdmUuXG4gICAgICByZXR1cm4gL14oPzpcXC9cXCorW1xcd1xcV10qP1xcKlxcL3xcXC9cXC8uKj9bXFxuXFxyXFx1MjAyOFxcdTIwMjldfFxccykqKFtcIiddKXVzZSBzdHJpY3RcXDE7PyQvLnRlc3QocmVzdWx0KVxuICAgICAgICA/ICcnXG4gICAgICAgIDogcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhbiBvYmplY3QgaXMgb2YgdGhlIHNwZWNpZmllZCBjbGFzcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGNsYXNzLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWUgaXMgb2YgdGhlIHNwZWNpZmllZCBjbGFzcywgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzQ2xhc3NPZih2YWx1ZSwgbmFtZSkge1xuICAgICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gJ1tvYmplY3QgJyArIG5hbWUgKyAnXSc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXG4gICAgICogZGF0YSB0eXBlLiBUaGUgb2JqZWN0cyB3ZSBhcmUgY29uY2VybmVkIHdpdGggdXN1YWxseSByZXR1cm4gbm9uLXByaW1pdGl2ZVxuICAgICAqIHR5cGVzIG9mIFwib2JqZWN0XCIsIFwiZnVuY3Rpb25cIiwgb3IgXCJ1bmtub3duXCIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBvd25lciBvZiB0aGUgcHJvcGVydHkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IHZhbHVlIGlzIGEgbm9uLXByaW1pdGl2ZSwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV07XG4gICAgICByZXR1cm4gIXJlUHJpbWl0aXZlLnRlc3QodHlwZSkgJiYgKHR5cGUgIT0gJ29iamVjdCcgfHwgISFvYmplY3RbcHJvcGVydHldKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSB2YWx1ZSBjYW4gYmUgc2FmZWx5IGNvZXJjZWQgdG8gYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWUgY2FuIGJlIGNvZXJjZWQsIGVsc2UgYGZhbHNlYC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc1N0cmluZ2FibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBfLmlzU3RyaW5nKHZhbHVlKSB8fCAoXy5oYXModmFsdWUsICd0b1N0cmluZycpICYmIF8uaXNGdW5jdGlvbih2YWx1ZS50b1N0cmluZykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgd3JhcHBlciBhcm91bmQgYHJlcXVpcmVgIHRvIHN1cHByZXNzIGBtb2R1bGUgbWlzc2luZ2AgZXJyb3JzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgVGhlIG1vZHVsZSBpZC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gVGhlIGV4cG9ydGVkIG1vZHVsZSBvciBgbnVsbGAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVxdWlyZShpZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZyZWVFeHBvcnRzICYmIGZyZWVSZXF1aXJlKGlkKTtcbiAgICAgIH0gY2F0Y2goZSkge31cbiAgICAgIHJldHVybiByZXN1bHQgfHwgbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIGEgc25pcHBldCBvZiBKYXZhU2NyaXB0IHZpYSBzY3JpcHQgaW5qZWN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSBUaGUgY29kZSB0byBydW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gcnVuU2NyaXB0KGNvZGUpIHtcbiAgICAgIHZhciBhbmNob3IgPSBmcmVlRGVmaW5lID8gZGVmaW5lLmFtZCA6IEJlbmNobWFyayxcbiAgICAgICAgICBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudCgnc2NyaXB0JyksXG4gICAgICAgICAgc2libGluZyA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF0sXG4gICAgICAgICAgcGFyZW50ID0gc2libGluZy5wYXJlbnROb2RlLFxuICAgICAgICAgIHByb3AgPSB1aWQgKyAncnVuU2NyaXB0JyxcbiAgICAgICAgICBwcmVmaXggPSAnKCcgKyAoZnJlZURlZmluZSA/ICdkZWZpbmUuYW1kLicgOiAnQmVuY2htYXJrLicpICsgcHJvcCArICd8fGZ1bmN0aW9uKCl7fSkoKTsnO1xuXG4gICAgICAvLyBGaXJlZm94IDIuMC4wLjIgY2Fubm90IHVzZSBzY3JpcHQgaW5qZWN0aW9uIGFzIGludGVuZGVkIGJlY2F1c2UgaXQgZXhlY3V0ZXNcbiAgICAgIC8vIGFzeW5jaHJvbm91c2x5LCBidXQgdGhhdCdzIE9LIGJlY2F1c2Ugc2NyaXB0IGluamVjdGlvbiBpcyBvbmx5IHVzZWQgdG8gYXZvaWRcbiAgICAgIC8vIHRoZSBwcmV2aW91c2x5IGNvbW1lbnRlZCBKYWVnZXJNb25rZXkgYnVnLlxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBpbnNlcnRlZCBzY3JpcHQgKmJlZm9yZSogcnVubmluZyB0aGUgY29kZSB0byBhdm9pZCBkaWZmZXJlbmNlc1xuICAgICAgICAvLyBpbiB0aGUgZXhwZWN0ZWQgc2NyaXB0IGVsZW1lbnQgY291bnQvb3JkZXIgb2YgdGhlIGRvY3VtZW50LlxuICAgICAgICBzY3JpcHQuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKHByZWZpeCArIGNvZGUpKTtcbiAgICAgICAgYW5jaG9yW3Byb3BdID0gZnVuY3Rpb24oKSB7IGRlc3Ryb3lFbGVtZW50KHNjcmlwdCk7IH07XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LmNsb25lTm9kZShmYWxzZSk7XG4gICAgICAgIHNpYmxpbmcgPSBudWxsO1xuICAgICAgICBzY3JpcHQudGV4dCA9IGNvZGU7XG4gICAgICB9XG4gICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKHNjcmlwdCwgc2libGluZyk7XG4gICAgICBkZWxldGUgYW5jaG9yW3Byb3BdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgaGVscGVyIGZ1bmN0aW9uIGZvciBzZXR0aW5nIG9wdGlvbnMvZXZlbnQgaGFuZGxlcnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGJlbmNobWFyayBvciBzdWl0ZSBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldE9wdGlvbnMob2JqZWN0LCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb2JqZWN0Lm9wdGlvbnMgPSBfLmFzc2lnbih7fSwgY2xvbmVEZWVwKG9iamVjdC5jb25zdHJ1Y3Rvci5vcHRpb25zKSwgY2xvbmVEZWVwKG9wdGlvbnMpKTtcblxuICAgICAgXy5mb3JPd24ob3B0aW9ucywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgICAgaWYgKC9eb25bQS1aXS8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICBfLmVhY2goa2V5LnNwbGl0KCcgJyksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgICBvYmplY3Qub24oa2V5LnNsaWNlKDIpLnRvTG93ZXJDYXNlKCksIHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIV8uaGFzKG9iamVjdCwga2V5KSkge1xuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBjbG9uZURlZXAodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBjeWNsaW5nL2NvbXBsZXRpbmcgdGhlIGRlZmVycmVkIGJlbmNobWFyay5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNvbHZlKCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gdGhpcyxcbiAgICAgICAgICBjbG9uZSA9IGRlZmVycmVkLmJlbmNobWFyayxcbiAgICAgICAgICBiZW5jaCA9IGNsb25lLl9vcmlnaW5hbDtcblxuICAgICAgaWYgKGJlbmNoLmFib3J0ZWQpIHtcbiAgICAgICAgLy8gY3ljbGUoKSAtPiBjbG9uZSBjeWNsZS9jb21wbGV0ZSBldmVudCAtPiBjb21wdXRlKCkncyBpbnZva2VkIGJlbmNoLnJ1bigpIGN5Y2xlL2NvbXBsZXRlLlxuICAgICAgICBkZWZlcnJlZC50ZWFyZG93bigpO1xuICAgICAgICBjbG9uZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGN5Y2xlKGRlZmVycmVkKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCsrZGVmZXJyZWQuY3ljbGVzIDwgY2xvbmUuY291bnQpIHtcbiAgICAgICAgY2xvbmUuY29tcGlsZWQuY2FsbChkZWZlcnJlZCwgY29udGV4dCwgdGltZXIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRpbWVyLnN0b3AoZGVmZXJyZWQpO1xuICAgICAgICBkZWZlcnJlZC50ZWFyZG93bigpO1xuICAgICAgICBkZWxheShjbG9uZSwgZnVuY3Rpb24oKSB7IGN5Y2xlKGRlZmVycmVkKTsgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQSBnZW5lcmljIGBBcnJheSNmaWx0ZXJgIGxpa2UgbWV0aG9kLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24vYWxpYXMgY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBvZiB2YWx1ZXMgdGhhdCBwYXNzZWQgY2FsbGJhY2sgZmlsdGVyLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBnZXQgb2RkIG51bWJlcnNcbiAgICAgKiBCZW5jaG1hcmsuZmlsdGVyKFsxLCAyLCAzLCA0LCA1XSwgZnVuY3Rpb24obikge1xuICAgICAqICAgcmV0dXJuIG4gJSAyO1xuICAgICAqIH0pOyAvLyAtPiBbMSwgMywgNV07XG4gICAgICpcbiAgICAgKiAvLyBnZXQgZmFzdGVzdCBiZW5jaG1hcmtzXG4gICAgICogQmVuY2htYXJrLmZpbHRlcihiZW5jaGVzLCAnZmFzdGVzdCcpO1xuICAgICAqXG4gICAgICogLy8gZ2V0IHNsb3dlc3QgYmVuY2htYXJrc1xuICAgICAqIEJlbmNobWFyay5maWx0ZXIoYmVuY2hlcywgJ3Nsb3dlc3QnKTtcbiAgICAgKlxuICAgICAqIC8vIGdldCBiZW5jaG1hcmtzIHRoYXQgY29tcGxldGVkIHdpdGhvdXQgZXJyb3JpbmdcbiAgICAgKiBCZW5jaG1hcmsuZmlsdGVyKGJlbmNoZXMsICdzdWNjZXNzZnVsJyk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyKGFycmF5LCBjYWxsYmFjaykge1xuICAgICAgaWYgKGNhbGxiYWNrID09PSAnc3VjY2Vzc2Z1bCcpIHtcbiAgICAgICAgLy8gQ2FsbGJhY2sgdG8gZXhjbHVkZSB0aG9zZSB0aGF0IGFyZSBlcnJvcmVkLCB1bnJ1biwgb3IgaGF2ZSBoeiBvZiBJbmZpbml0eS5cbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbihiZW5jaCkge1xuICAgICAgICAgIHJldHVybiBiZW5jaC5jeWNsZXMgJiYgXy5pc0Zpbml0ZShiZW5jaC5oeikgJiYgIWJlbmNoLmVycm9yO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoY2FsbGJhY2sgPT09ICdmYXN0ZXN0JyB8fCBjYWxsYmFjayA9PT0gJ3Nsb3dlc3QnKSB7XG4gICAgICAgIC8vIEdldCBzdWNjZXNzZnVsLCBzb3J0IGJ5IHBlcmlvZCArIG1hcmdpbiBvZiBlcnJvciwgYW5kIGZpbHRlciBmYXN0ZXN0L3Nsb3dlc3QuXG4gICAgICAgIHZhciByZXN1bHQgPSBmaWx0ZXIoYXJyYXksICdzdWNjZXNzZnVsJykuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgYSA9IGEuc3RhdHM7IGIgPSBiLnN0YXRzO1xuICAgICAgICAgIHJldHVybiAoYS5tZWFuICsgYS5tb2UgPiBiLm1lYW4gKyBiLm1vZSA/IDEgOiAtMSkgKiAoY2FsbGJhY2sgPT09ICdmYXN0ZXN0JyA/IDEgOiAtMSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBfLmZpbHRlcihyZXN1bHQsIGZ1bmN0aW9uKGJlbmNoKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFswXS5jb21wYXJlKGJlbmNoKSA9PSAwO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgbnVtYmVyIHRvIGEgbW9yZSByZWFkYWJsZSBjb21tYS1zZXBhcmF0ZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIFRoZSBudW1iZXIgdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbW9yZSByZWFkYWJsZSBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZm9ybWF0TnVtYmVyKG51bWJlcikge1xuICAgICAgbnVtYmVyID0gU3RyaW5nKG51bWJlcikuc3BsaXQoJy4nKTtcbiAgICAgIHJldHVybiBudW1iZXJbMF0ucmVwbGFjZSgvKD89KD86XFxkezN9KSskKSg/IVxcYikvZywgJywnKSArXG4gICAgICAgIChudW1iZXJbMV0gPyAnLicgKyBudW1iZXJbMV0gOiAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyBhIG1ldGhvZCBvbiBhbGwgaXRlbXMgaW4gYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGJlbmNoZXMgQXJyYXkgb2YgYmVuY2htYXJrcyB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBtZXRob2QgdG8gaW52b2tlIE9SIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIG1ldGhvZCB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHJldHVybmVkIGZyb20gZWFjaCBtZXRob2QgaW52b2tlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gaW52b2tlIGByZXNldGAgb24gYWxsIGJlbmNobWFya3NcbiAgICAgKiBCZW5jaG1hcmsuaW52b2tlKGJlbmNoZXMsICdyZXNldCcpO1xuICAgICAqXG4gICAgICogLy8gaW52b2tlIGBlbWl0YCB3aXRoIGFyZ3VtZW50c1xuICAgICAqIEJlbmNobWFyay5pbnZva2UoYmVuY2hlcywgJ2VtaXQnLCAnY29tcGxldGUnLCBsaXN0ZW5lcik7XG4gICAgICpcbiAgICAgKiAvLyBpbnZva2UgYHJ1bih0cnVlKWAsIHRyZWF0IGJlbmNobWFya3MgYXMgYSBxdWV1ZSwgYW5kIHJlZ2lzdGVyIGludm9rZSBjYWxsYmFja3NcbiAgICAgKiBCZW5jaG1hcmsuaW52b2tlKGJlbmNoZXMsIHtcbiAgICAgKlxuICAgICAqICAgLy8gaW52b2tlIHRoZSBgcnVuYCBtZXRob2RcbiAgICAgKiAgICduYW1lJzogJ3J1bicsXG4gICAgICpcbiAgICAgKiAgIC8vIHBhc3MgYSBzaW5nbGUgYXJndW1lbnRcbiAgICAgKiAgICdhcmdzJzogdHJ1ZSxcbiAgICAgKlxuICAgICAqICAgLy8gdHJlYXQgYXMgcXVldWUsIHJlbW92aW5nIGJlbmNobWFya3MgZnJvbSBmcm9udCBvZiBgYmVuY2hlc2AgdW50aWwgZW1wdHlcbiAgICAgKiAgICdxdWV1ZWQnOiB0cnVlLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgYmVmb3JlIGFueSBiZW5jaG1hcmtzIGhhdmUgYmVlbiBpbnZva2VkLlxuICAgICAqICAgJ29uU3RhcnQnOiBvblN0YXJ0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgYmV0d2VlbiBpbnZva2luZyBiZW5jaG1hcmtzXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCBhZnRlciBhbGwgYmVuY2htYXJrcyBoYXZlIGJlZW4gaW52b2tlZC5cbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludm9rZShiZW5jaGVzLCBuYW1lKSB7XG4gICAgICB2YXIgYXJncyxcbiAgICAgICAgICBiZW5jaCxcbiAgICAgICAgICBxdWV1ZWQsXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBldmVudFByb3BzID0geyAnY3VycmVudFRhcmdldCc6IGJlbmNoZXMgfSxcbiAgICAgICAgICBvcHRpb25zID0geyAnb25TdGFydCc6IF8ubm9vcCwgJ29uQ3ljbGUnOiBfLm5vb3AsICdvbkNvbXBsZXRlJzogXy5ub29wIH0sXG4gICAgICAgICAgcmVzdWx0ID0gXy50b0FycmF5KGJlbmNoZXMpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEludm9rZXMgdGhlIG1ldGhvZCBvZiB0aGUgY3VycmVudCBvYmplY3QgYW5kIGlmIHN5bmNocm9ub3VzLCBmZXRjaGVzIHRoZSBuZXh0LlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBleGVjdXRlKCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzLFxuICAgICAgICAgICAgYXN5bmMgPSBpc0FzeW5jKGJlbmNoKTtcblxuICAgICAgICBpZiAoYXN5bmMpIHtcbiAgICAgICAgICAvLyBVc2UgYGdldE5leHRgIGFzIHRoZSBmaXJzdCBsaXN0ZW5lci5cbiAgICAgICAgICBiZW5jaC5vbignY29tcGxldGUnLCBnZXROZXh0KTtcbiAgICAgICAgICBsaXN0ZW5lcnMgPSBiZW5jaC5ldmVudHMuY29tcGxldGU7XG4gICAgICAgICAgbGlzdGVuZXJzLnNwbGljZSgwLCAwLCBsaXN0ZW5lcnMucG9wKCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEV4ZWN1dGUgbWV0aG9kLlxuICAgICAgICByZXN1bHRbaW5kZXhdID0gXy5pc0Z1bmN0aW9uKGJlbmNoICYmIGJlbmNoW25hbWVdKSA/IGJlbmNoW25hbWVdLmFwcGx5KGJlbmNoLCBhcmdzKSA6IHVuZGVmaW5lZDtcbiAgICAgICAgLy8gSWYgc3luY2hyb25vdXMgcmV0dXJuIGB0cnVlYCB1bnRpbCBmaW5pc2hlZC5cbiAgICAgICAgcmV0dXJuICFhc3luYyAmJiBnZXROZXh0KCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRmV0Y2hlcyB0aGUgbmV4dCBiZW5jaCBvciBleGVjdXRlcyBgb25Db21wbGV0ZWAgY2FsbGJhY2suXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGdldE5leHQoZXZlbnQpIHtcbiAgICAgICAgdmFyIGN5Y2xlRXZlbnQsXG4gICAgICAgICAgICBsYXN0ID0gYmVuY2gsXG4gICAgICAgICAgICBhc3luYyA9IGlzQXN5bmMobGFzdCk7XG5cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgbGFzdC5vZmYoJ2NvbXBsZXRlJywgZ2V0TmV4dCk7XG4gICAgICAgICAgbGFzdC5lbWl0KCdjb21wbGV0ZScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVtaXQgXCJjeWNsZVwiIGV2ZW50LlxuICAgICAgICBldmVudFByb3BzLnR5cGUgPSAnY3ljbGUnO1xuICAgICAgICBldmVudFByb3BzLnRhcmdldCA9IGxhc3Q7XG4gICAgICAgIGN5Y2xlRXZlbnQgPSBFdmVudChldmVudFByb3BzKTtcbiAgICAgICAgb3B0aW9ucy5vbkN5Y2xlLmNhbGwoYmVuY2hlcywgY3ljbGVFdmVudCk7XG5cbiAgICAgICAgLy8gQ2hvb3NlIG5leHQgYmVuY2htYXJrIGlmIG5vdCBleGl0aW5nIGVhcmx5LlxuICAgICAgICBpZiAoIWN5Y2xlRXZlbnQuYWJvcnRlZCAmJiByYWlzZUluZGV4KCkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgYmVuY2ggPSBxdWV1ZWQgPyBiZW5jaGVzWzBdIDogcmVzdWx0W2luZGV4XTtcbiAgICAgICAgICBpZiAoaXNBc3luYyhiZW5jaCkpIHtcbiAgICAgICAgICAgIGRlbGF5KGJlbmNoLCBleGVjdXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoYXN5bmMpIHtcbiAgICAgICAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gaWYgcHJldmlvdXNseSBhc3luY2hyb25vdXMgYnV0IG5vdyBzeW5jaHJvbm91cy5cbiAgICAgICAgICAgIHdoaWxlIChleGVjdXRlKCkpIHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29udGludWUgc3luY2hyb25vdXMgZXhlY3V0aW9uLlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEVtaXQgXCJjb21wbGV0ZVwiIGV2ZW50LlxuICAgICAgICAgIGV2ZW50UHJvcHMudHlwZSA9ICdjb21wbGV0ZSc7XG4gICAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlLmNhbGwoYmVuY2hlcywgRXZlbnQoZXZlbnRQcm9wcykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gdXNlZCBhcyBhIGxpc3RlbmVyIGBldmVudC5hYm9ydGVkID0gdHJ1ZWAgd2lsbCBjYW5jZWwgdGhlIHJlc3Qgb2ZcbiAgICAgICAgLy8gdGhlIFwiY29tcGxldGVcIiBsaXN0ZW5lcnMgYmVjYXVzZSB0aGV5IHdlcmUgYWxyZWFkeSBjYWxsZWQgYWJvdmUgYW5kIHdoZW5cbiAgICAgICAgLy8gdXNlZCBhcyBwYXJ0IG9mIGBnZXROZXh0YCB0aGUgYHJldHVybiBmYWxzZWAgd2lsbCBleGl0IHRoZSBleGVjdXRpb24gd2hpbGUtbG9vcC5cbiAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgZXZlbnQuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hlY2tzIGlmIGludm9raW5nIGBCZW5jaG1hcmsjcnVuYCB3aXRoIGFzeW5jaHJvbm91cyBjeWNsZXMuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGlzQXN5bmMob2JqZWN0KSB7XG4gICAgICAgIC8vIEF2b2lkIHVzaW5nIGBpbnN0YW5jZW9mYCBoZXJlIGJlY2F1c2Ugb2YgSUUgbWVtb3J5IGxlYWsgaXNzdWVzIHdpdGggaG9zdCBvYmplY3RzLlxuICAgICAgICB2YXIgYXN5bmMgPSBhcmdzWzBdICYmIGFyZ3NbMF0uYXN5bmM7XG4gICAgICAgIHJldHVybiBuYW1lID09ICdydW4nICYmIChvYmplY3QgaW5zdGFuY2VvZiBCZW5jaG1hcmspICYmXG4gICAgICAgICAgKChhc3luYyA9PSBudWxsID8gb2JqZWN0Lm9wdGlvbnMuYXN5bmMgOiBhc3luYykgJiYgc3VwcG9ydC50aW1lb3V0IHx8IG9iamVjdC5kZWZlcik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUmFpc2VzIGBpbmRleGAgdG8gdGhlIG5leHQgZGVmaW5lZCBpbmRleCBvciByZXR1cm5zIGBmYWxzZWAuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHJhaXNlSW5kZXgoKSB7XG4gICAgICAgIGluZGV4Kys7XG5cbiAgICAgICAgLy8gSWYgcXVldWVkIHJlbW92ZSB0aGUgcHJldmlvdXMgYmVuY2guXG4gICAgICAgIGlmIChxdWV1ZWQgJiYgaW5kZXggPiAwKSB7XG4gICAgICAgICAgc2hpZnQuY2FsbChiZW5jaGVzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIHRoZSBsYXN0IGluZGV4IHRoZW4gcmV0dXJuIGBmYWxzZWAuXG4gICAgICAgIHJldHVybiAocXVldWVkID8gYmVuY2hlcy5sZW5ndGggOiBpbmRleCA8IHJlc3VsdC5sZW5ndGgpXG4gICAgICAgICAgPyBpbmRleFxuICAgICAgICAgIDogKGluZGV4ID0gZmFsc2UpO1xuICAgICAgfVxuICAgICAgLy8gSnVnZ2xlIGFyZ3VtZW50cy5cbiAgICAgIGlmIChfLmlzU3RyaW5nKG5hbWUpKSB7XG4gICAgICAgIC8vIDIgYXJndW1lbnRzIChhcnJheSwgbmFtZSkuXG4gICAgICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAyIGFyZ3VtZW50cyAoYXJyYXksIG9wdGlvbnMpLlxuICAgICAgICBvcHRpb25zID0gXy5hc3NpZ24ob3B0aW9ucywgbmFtZSk7XG4gICAgICAgIG5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgICAgIGFyZ3MgPSBfLmlzQXJyYXkoYXJncyA9ICdhcmdzJyBpbiBvcHRpb25zID8gb3B0aW9ucy5hcmdzIDogW10pID8gYXJncyA6IFthcmdzXTtcbiAgICAgICAgcXVldWVkID0gb3B0aW9ucy5xdWV1ZWQ7XG4gICAgICB9XG4gICAgICAvLyBTdGFydCBpdGVyYXRpbmcgb3ZlciB0aGUgYXJyYXkuXG4gICAgICBpZiAocmFpc2VJbmRleCgpICE9PSBmYWxzZSkge1xuICAgICAgICAvLyBFbWl0IFwic3RhcnRcIiBldmVudC5cbiAgICAgICAgYmVuY2ggPSByZXN1bHRbaW5kZXhdO1xuICAgICAgICBldmVudFByb3BzLnR5cGUgPSAnc3RhcnQnO1xuICAgICAgICBldmVudFByb3BzLnRhcmdldCA9IGJlbmNoO1xuICAgICAgICBvcHRpb25zLm9uU3RhcnQuY2FsbChiZW5jaGVzLCBFdmVudChldmVudFByb3BzKSk7XG5cbiAgICAgICAgLy8gRW5kIGVhcmx5IGlmIHRoZSBzdWl0ZSB3YXMgYWJvcnRlZCBpbiBhbiBcIm9uU3RhcnRcIiBsaXN0ZW5lci5cbiAgICAgICAgaWYgKG5hbWUgPT0gJ3J1bicgJiYgKGJlbmNoZXMgaW5zdGFuY2VvZiBTdWl0ZSkgJiYgYmVuY2hlcy5hYm9ydGVkKSB7XG4gICAgICAgICAgLy8gRW1pdCBcImN5Y2xlXCIgZXZlbnQuXG4gICAgICAgICAgZXZlbnRQcm9wcy50eXBlID0gJ2N5Y2xlJztcbiAgICAgICAgICBvcHRpb25zLm9uQ3ljbGUuY2FsbChiZW5jaGVzLCBFdmVudChldmVudFByb3BzKSk7XG4gICAgICAgICAgLy8gRW1pdCBcImNvbXBsZXRlXCIgZXZlbnQuXG4gICAgICAgICAgZXZlbnRQcm9wcy50eXBlID0gJ2NvbXBsZXRlJztcbiAgICAgICAgICBvcHRpb25zLm9uQ29tcGxldGUuY2FsbChiZW5jaGVzLCBFdmVudChldmVudFByb3BzKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RhcnQgbWV0aG9kIGV4ZWN1dGlvbi5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaWYgKGlzQXN5bmMoYmVuY2gpKSB7XG4gICAgICAgICAgICBkZWxheShiZW5jaCwgZXhlY3V0ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChleGVjdXRlKCkpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzdHJpbmcgb2Ygam9pbmVkIGFycmF5IHZhbHVlcyBvciBvYmplY3Qga2V5LXZhbHVlIHBhaXJzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gb3BlcmF0ZSBvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3NlcGFyYXRvcjE9JywnXSBUaGUgc2VwYXJhdG9yIHVzZWQgYmV0d2VlbiBrZXktdmFsdWUgcGFpcnMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzZXBhcmF0b3IyPSc6ICddIFRoZSBzZXBhcmF0b3IgdXNlZCBiZXR3ZWVuIGtleXMgYW5kIHZhbHVlcy5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgam9pbmVkIHJlc3VsdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBqb2luKG9iamVjdCwgc2VwYXJhdG9yMSwgc2VwYXJhdG9yMikge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICAgIGxlbmd0aCA9IChvYmplY3QgPSBPYmplY3Qob2JqZWN0KSkubGVuZ3RoLFxuICAgICAgICAgIGFycmF5TGlrZSA9IGxlbmd0aCA9PT0gbGVuZ3RoID4+PiAwO1xuXG4gICAgICBzZXBhcmF0b3IyIHx8IChzZXBhcmF0b3IyID0gJzogJyk7XG4gICAgICBfLmVhY2gob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGFycmF5TGlrZSA/IHZhbHVlIDoga2V5ICsgc2VwYXJhdG9yMiArIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKHNlcGFyYXRvcjEgfHwgJywnKTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBYm9ydHMgYWxsIGJlbmNobWFya3MgaW4gdGhlIHN1aXRlLlxuICAgICAqXG4gICAgICogQG5hbWUgYWJvcnRcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHN1aXRlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFib3J0U3VpdGUoKSB7XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIHJlc2V0dGluZyA9IGNhbGxlZEJ5LnJlc2V0U3VpdGU7XG5cbiAgICAgIGlmIChzdWl0ZS5ydW5uaW5nKSB7XG4gICAgICAgIGV2ZW50ID0gRXZlbnQoJ2Fib3J0Jyk7XG4gICAgICAgIHN1aXRlLmVtaXQoZXZlbnQpO1xuICAgICAgICBpZiAoIWV2ZW50LmNhbmNlbGxlZCB8fCByZXNldHRpbmcpIHtcbiAgICAgICAgICAvLyBBdm9pZCBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgY2FsbGVkQnkuYWJvcnRTdWl0ZSA9IHRydWU7XG4gICAgICAgICAgc3VpdGUucmVzZXQoKTtcbiAgICAgICAgICBkZWxldGUgY2FsbGVkQnkuYWJvcnRTdWl0ZTtcblxuICAgICAgICAgIGlmICghcmVzZXR0aW5nKSB7XG4gICAgICAgICAgICBzdWl0ZS5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGludm9rZShzdWl0ZSwgJ2Fib3J0Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIHRlc3QgdG8gdGhlIGJlbmNobWFyayBzdWl0ZS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIG5hbWUgdG8gaWRlbnRpZnkgdGhlIGJlbmNobWFyay5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gZm4gVGhlIHRlc3QgdG8gYmVuY2htYXJrLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHN1aXRlIGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBiYXNpYyB1c2FnZVxuICAgICAqIHN1aXRlLmFkZChmbik7XG4gICAgICpcbiAgICAgKiAvLyBvciB1c2luZyBhIG5hbWUgZmlyc3RcbiAgICAgKiBzdWl0ZS5hZGQoJ2ZvbycsIGZuKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHdpdGggb3B0aW9uc1xuICAgICAqIHN1aXRlLmFkZCgnZm9vJywgZm4sIHtcbiAgICAgKiAgICdvbkN5Y2xlJzogb25DeWNsZSxcbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gb3IgbmFtZSBhbmQgb3B0aW9uc1xuICAgICAqIHN1aXRlLmFkZCgnZm9vJywge1xuICAgICAqICAgJ2ZuJzogZm4sXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGVcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIG9yIG9wdGlvbnMgb25seVxuICAgICAqIHN1aXRlLmFkZCh7XG4gICAgICogICAnbmFtZSc6ICdmb28nLFxuICAgICAqICAgJ2ZuJzogZm4sXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGVcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhZGQobmFtZSwgZm4sIG9wdGlvbnMpIHtcbiAgICAgIHZhciBzdWl0ZSA9IHRoaXMsXG4gICAgICAgICAgYmVuY2ggPSBuZXcgQmVuY2htYXJrKG5hbWUsIGZuLCBvcHRpb25zKSxcbiAgICAgICAgICBldmVudCA9IEV2ZW50KHsgJ3R5cGUnOiAnYWRkJywgJ3RhcmdldCc6IGJlbmNoIH0pO1xuXG4gICAgICBpZiAoc3VpdGUuZW1pdChldmVudCksICFldmVudC5jYW5jZWxsZWQpIHtcbiAgICAgICAgc3VpdGUucHVzaChiZW5jaCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBzdWl0ZSB3aXRoIGNsb25lZCBiZW5jaG1hcmtzLlxuICAgICAqXG4gICAgICogQG5hbWUgY2xvbmVcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyBvYmplY3QgdG8gb3ZlcndyaXRlIGNsb25lZCBvcHRpb25zLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBuZXcgc3VpdGUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xvbmVTdWl0ZShvcHRpb25zKSB7XG4gICAgICB2YXIgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIHJlc3VsdCA9IG5ldyBzdWl0ZS5jb25zdHJ1Y3RvcihfLmFzc2lnbih7fSwgc3VpdGUub3B0aW9ucywgb3B0aW9ucykpO1xuXG4gICAgICAvLyBDb3B5IG93biBwcm9wZXJ0aWVzLlxuICAgICAgXy5mb3JPd24oc3VpdGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhyZXN1bHQsIGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlICYmIF8uaXNGdW5jdGlvbih2YWx1ZS5jbG9uZSlcbiAgICAgICAgICAgID8gdmFsdWUuY2xvbmUoKVxuICAgICAgICAgICAgOiBjbG9uZURlZXAodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYEFycmF5I2ZpbHRlcmAgbGlrZSBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBmaWx0ZXJcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGNhbGxiYWNrIFRoZSBmdW5jdGlvbi9hbGlhcyBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIG5ldyBzdWl0ZSBvZiBiZW5jaG1hcmtzIHRoYXQgcGFzc2VkIGNhbGxiYWNrIGZpbHRlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXJTdWl0ZShjYWxsYmFjaykge1xuICAgICAgdmFyIHN1aXRlID0gdGhpcyxcbiAgICAgICAgICByZXN1bHQgPSBuZXcgc3VpdGUuY29uc3RydWN0b3Ioc3VpdGUub3B0aW9ucyk7XG5cbiAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgZmlsdGVyKHN1aXRlLCBjYWxsYmFjaykpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgYWxsIGJlbmNobWFya3MgaW4gdGhlIHN1aXRlLlxuICAgICAqXG4gICAgICogQG5hbWUgcmVzZXRcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHN1aXRlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc2V0U3VpdGUoKSB7XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIGFib3J0aW5nID0gY2FsbGVkQnkuYWJvcnRTdWl0ZTtcblxuICAgICAgaWYgKHN1aXRlLnJ1bm5pbmcgJiYgIWFib3J0aW5nKSB7XG4gICAgICAgIC8vIE5vIHdvcnJpZXMsIGByZXNldFN1aXRlKClgIGlzIGNhbGxlZCB3aXRoaW4gYGFib3J0U3VpdGUoKWAuXG4gICAgICAgIGNhbGxlZEJ5LnJlc2V0U3VpdGUgPSB0cnVlO1xuICAgICAgICBzdWl0ZS5hYm9ydCgpO1xuICAgICAgICBkZWxldGUgY2FsbGVkQnkucmVzZXRTdWl0ZTtcbiAgICAgIH1cbiAgICAgIC8vIFJlc2V0IGlmIHRoZSBzdGF0ZSBoYXMgY2hhbmdlZC5cbiAgICAgIGVsc2UgaWYgKChzdWl0ZS5hYm9ydGVkIHx8IHN1aXRlLnJ1bm5pbmcpICYmXG4gICAgICAgICAgKHN1aXRlLmVtaXQoZXZlbnQgPSBFdmVudCgncmVzZXQnKSksICFldmVudC5jYW5jZWxsZWQpKSB7XG4gICAgICAgIHN1aXRlLmFib3J0ZWQgPSBzdWl0ZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICghYWJvcnRpbmcpIHtcbiAgICAgICAgICBpbnZva2Uoc3VpdGUsICdyZXNldCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVucyB0aGUgc3VpdGUuXG4gICAgICpcbiAgICAgKiBAbmFtZSBydW5cbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc3VpdGUgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlXG4gICAgICogc3VpdGUucnVuKCk7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiBzdWl0ZS5ydW4oeyAnYXN5bmMnOiB0cnVlLCAncXVldWVkJzogdHJ1ZSB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBydW5TdWl0ZShvcHRpb25zKSB7XG4gICAgICB2YXIgc3VpdGUgPSB0aGlzO1xuXG4gICAgICBzdWl0ZS5yZXNldCgpO1xuICAgICAgc3VpdGUucnVubmluZyA9IHRydWU7XG4gICAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXG4gICAgICBpbnZva2Uoc3VpdGUsIHtcbiAgICAgICAgJ25hbWUnOiAncnVuJyxcbiAgICAgICAgJ2FyZ3MnOiBvcHRpb25zLFxuICAgICAgICAncXVldWVkJzogb3B0aW9ucy5xdWV1ZWQsXG4gICAgICAgICdvblN0YXJ0JzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBzdWl0ZS5lbWl0KGV2ZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgJ29uQ3ljbGUnOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHZhciBiZW5jaCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICBpZiAoYmVuY2guZXJyb3IpIHtcbiAgICAgICAgICAgIHN1aXRlLmVtaXQoeyAndHlwZSc6ICdlcnJvcicsICd0YXJnZXQnOiBiZW5jaCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3VpdGUuZW1pdChldmVudCk7XG4gICAgICAgICAgZXZlbnQuYWJvcnRlZCA9IHN1aXRlLmFib3J0ZWQ7XG4gICAgICAgIH0sXG4gICAgICAgICdvbkNvbXBsZXRlJzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBzdWl0ZS5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgc3VpdGUuZW1pdChldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHN1aXRlO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIGFsbCByZWdpc3RlcmVkIGxpc3RlbmVycyBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50IHR5cGUuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLCBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IHR5cGUgVGhlIGV2ZW50IHR5cGUgb3Igb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbGFzdCBsaXN0ZW5lciBleGVjdXRlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlbWl0KHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMsXG4gICAgICAgICAgb2JqZWN0ID0gdGhpcyxcbiAgICAgICAgICBldmVudCA9IEV2ZW50KHR5cGUpLFxuICAgICAgICAgIGV2ZW50cyA9IG9iamVjdC5ldmVudHMsXG4gICAgICAgICAgYXJncyA9IChhcmd1bWVudHNbMF0gPSBldmVudCwgYXJndW1lbnRzKTtcblxuICAgICAgZXZlbnQuY3VycmVudFRhcmdldCB8fCAoZXZlbnQuY3VycmVudFRhcmdldCA9IG9iamVjdCk7XG4gICAgICBldmVudC50YXJnZXQgfHwgKGV2ZW50LnRhcmdldCA9IG9iamVjdCk7XG4gICAgICBkZWxldGUgZXZlbnQucmVzdWx0O1xuXG4gICAgICBpZiAoZXZlbnRzICYmIChsaXN0ZW5lcnMgPSBfLmhhcyhldmVudHMsIGV2ZW50LnR5cGUpICYmIGV2ZW50c1tldmVudC50eXBlXSkpIHtcbiAgICAgICAgXy5lYWNoKGxpc3RlbmVycy5zbGljZSgpLCBmdW5jdGlvbihsaXN0ZW5lcikge1xuICAgICAgICAgIGlmICgoZXZlbnQucmVzdWx0ID0gbGlzdGVuZXIuYXBwbHkob2JqZWN0LCBhcmdzKSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBldmVudC5jYW5jZWxsZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gIWV2ZW50LmFib3J0ZWQ7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV2ZW50LnJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGV2ZW50IGxpc3RlbmVycyBmb3IgYSBnaXZlbiB0eXBlIHRoYXQgY2FuIGJlIG1hbmlwdWxhdGVkXG4gICAgICogdG8gYWRkIG9yIHJlbW92ZSBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLCBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBsaXN0ZW5lcnMgYXJyYXkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLFxuICAgICAgICAgIGV2ZW50cyA9IG9iamVjdC5ldmVudHMgfHwgKG9iamVjdC5ldmVudHMgPSB7fSk7XG5cbiAgICAgIHJldHVybiBfLmhhcyhldmVudHMsIHR5cGUpID8gZXZlbnRzW3R5cGVdIDogKGV2ZW50c1t0eXBlXSA9IFtdKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnJlZ2lzdGVycyBhIGxpc3RlbmVyIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50IHR5cGUocyksXG4gICAgICogb3IgdW5yZWdpc3RlcnMgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudCB0eXBlKHMpLFxuICAgICAqIG9yIHVucmVnaXN0ZXJzIGFsbCBsaXN0ZW5lcnMgZm9yIGFsbCBldmVudCB0eXBlcy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmssIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdHlwZV0gVGhlIGV2ZW50IHR5cGUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2xpc3RlbmVyXSBUaGUgZnVuY3Rpb24gdG8gdW5yZWdpc3Rlci5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgY3VycmVudCBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhIGxpc3RlbmVyIGZvciBhbiBldmVudCB0eXBlXG4gICAgICogYmVuY2gub2ZmKCdjeWNsZScsIGxpc3RlbmVyKTtcbiAgICAgKlxuICAgICAqIC8vIHVucmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgbXVsdGlwbGUgZXZlbnQgdHlwZXNcbiAgICAgKiBiZW5jaC5vZmYoJ3N0YXJ0IGN5Y2xlJywgbGlzdGVuZXIpO1xuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhbGwgbGlzdGVuZXJzIGZvciBhbiBldmVudCB0eXBlXG4gICAgICogYmVuY2gub2ZmKCdjeWNsZScpO1xuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhbGwgbGlzdGVuZXJzIGZvciBtdWx0aXBsZSBldmVudCB0eXBlc1xuICAgICAqIGJlbmNoLm9mZignc3RhcnQgY3ljbGUgY29tcGxldGUnKTtcbiAgICAgKlxuICAgICAqIC8vIHVucmVnaXN0ZXIgYWxsIGxpc3RlbmVycyBmb3IgYWxsIGV2ZW50IHR5cGVzXG4gICAgICogYmVuY2gub2ZmKCk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gb2ZmKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gdGhpcyxcbiAgICAgICAgICBldmVudHMgPSBvYmplY3QuZXZlbnRzO1xuXG4gICAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuICAgICAgXy5lYWNoKHR5cGUgPyB0eXBlLnNwbGl0KCcgJykgOiBldmVudHMsIGZ1bmN0aW9uKGxpc3RlbmVycywgdHlwZSkge1xuICAgICAgICB2YXIgaW5kZXg7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdHlwZSA9IGxpc3RlbmVycztcbiAgICAgICAgICBsaXN0ZW5lcnMgPSBfLmhhcyhldmVudHMsIHR5cGUpICYmIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgaWYgKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBpbmRleCA9IF8uaW5kZXhPZihsaXN0ZW5lcnMsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBsaXN0ZW5lciBmb3IgdGhlIHNwZWNpZmllZCBldmVudCB0eXBlKHMpLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyaywgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIGV2ZW50IHR5cGUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgVGhlIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBjdXJyZW50IGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyByZWdpc3RlciBhIGxpc3RlbmVyIGZvciBhbiBldmVudCB0eXBlXG4gICAgICogYmVuY2gub24oJ2N5Y2xlJywgbGlzdGVuZXIpO1xuICAgICAqXG4gICAgICogLy8gcmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgbXVsdGlwbGUgZXZlbnQgdHlwZXNcbiAgICAgKiBiZW5jaC5vbignc3RhcnQgY3ljbGUnLCBsaXN0ZW5lcik7XG4gICAgICovXG4gICAgZnVuY3Rpb24gb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLFxuICAgICAgICAgIGV2ZW50cyA9IG9iamVjdC5ldmVudHMgfHwgKG9iamVjdC5ldmVudHMgPSB7fSk7XG5cbiAgICAgIF8uZWFjaCh0eXBlLnNwbGl0KCcgJyksIGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgKF8uaGFzKGV2ZW50cywgdHlwZSlcbiAgICAgICAgICA/IGV2ZW50c1t0eXBlXVxuICAgICAgICAgIDogKGV2ZW50c1t0eXBlXSA9IFtdKVxuICAgICAgICApLnB1c2gobGlzdGVuZXIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEFib3J0cyB0aGUgYmVuY2htYXJrIHdpdGhvdXQgcmVjb3JkaW5nIHRpbWVzLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWJvcnQoKSB7XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgYmVuY2ggPSB0aGlzLFxuICAgICAgICAgIHJlc2V0dGluZyA9IGNhbGxlZEJ5LnJlc2V0O1xuXG4gICAgICBpZiAoYmVuY2gucnVubmluZykge1xuICAgICAgICBldmVudCA9IEV2ZW50KCdhYm9ydCcpO1xuICAgICAgICBiZW5jaC5lbWl0KGV2ZW50KTtcbiAgICAgICAgaWYgKCFldmVudC5jYW5jZWxsZWQgfHwgcmVzZXR0aW5nKSB7XG4gICAgICAgICAgLy8gQXZvaWQgaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgIGNhbGxlZEJ5LmFib3J0ID0gdHJ1ZTtcbiAgICAgICAgICBiZW5jaC5yZXNldCgpO1xuICAgICAgICAgIGRlbGV0ZSBjYWxsZWRCeS5hYm9ydDtcblxuICAgICAgICAgIGlmIChzdXBwb3J0LnRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChiZW5jaC5fdGltZXJJZCk7XG4gICAgICAgICAgICBkZWxldGUgYmVuY2guX3RpbWVySWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghcmVzZXR0aW5nKSB7XG4gICAgICAgICAgICBiZW5jaC5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGJlbmNoLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZW5jaDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGJlbmNobWFyayB1c2luZyB0aGUgc2FtZSB0ZXN0IGFuZCBvcHRpb25zLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0IHRvIG92ZXJ3cml0ZSBjbG9uZWQgb3B0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbmV3IGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGJpemFycm8gPSBiZW5jaC5jbG9uZSh7XG4gICAgICogICAnbmFtZSc6ICdkb3BwZWxnYW5nZXInXG4gICAgICogfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xvbmUob3B0aW9ucykge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcyxcbiAgICAgICAgICByZXN1bHQgPSBuZXcgYmVuY2guY29uc3RydWN0b3IoXy5hc3NpZ24oe30sIGJlbmNoLCBvcHRpb25zKSk7XG5cbiAgICAgIC8vIENvcnJlY3QgdGhlIGBvcHRpb25zYCBvYmplY3QuXG4gICAgICByZXN1bHQub3B0aW9ucyA9IF8uYXNzaWduKHt9LCBjbG9uZURlZXAoYmVuY2gub3B0aW9ucyksIGNsb25lRGVlcChvcHRpb25zKSk7XG5cbiAgICAgIC8vIENvcHkgb3duIGN1c3RvbSBwcm9wZXJ0aWVzLlxuICAgICAgXy5mb3JPd24oYmVuY2gsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFfLmhhcyhyZXN1bHQsIGtleSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IGNsb25lRGVlcCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgaWYgYSBiZW5jaG1hcmsgaXMgZmFzdGVyIHRoYW4gYW5vdGhlci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIGJlbmNobWFyayB0byBjb21wYXJlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYC0xYCBpZiBzbG93ZXIsIGAxYCBpZiBmYXN0ZXIsIGFuZCBgMGAgaWYgaW5kZXRlcm1pbmF0ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb21wYXJlKG90aGVyKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzO1xuXG4gICAgICAvLyBFeGl0IGVhcmx5IGlmIGNvbXBhcmluZyB0aGUgc2FtZSBiZW5jaG1hcmsuXG4gICAgICBpZiAoYmVuY2ggPT0gb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICB2YXIgY3JpdGljYWwsXG4gICAgICAgICAgelN0YXQsXG4gICAgICAgICAgc2FtcGxlMSA9IGJlbmNoLnN0YXRzLnNhbXBsZSxcbiAgICAgICAgICBzYW1wbGUyID0gb3RoZXIuc3RhdHMuc2FtcGxlLFxuICAgICAgICAgIHNpemUxID0gc2FtcGxlMS5sZW5ndGgsXG4gICAgICAgICAgc2l6ZTIgPSBzYW1wbGUyLmxlbmd0aCxcbiAgICAgICAgICBtYXhTaXplID0gbWF4KHNpemUxLCBzaXplMiksXG4gICAgICAgICAgbWluU2l6ZSA9IG1pbihzaXplMSwgc2l6ZTIpLFxuICAgICAgICAgIHUxID0gZ2V0VShzYW1wbGUxLCBzYW1wbGUyKSxcbiAgICAgICAgICB1MiA9IGdldFUoc2FtcGxlMiwgc2FtcGxlMSksXG4gICAgICAgICAgdSA9IG1pbih1MSwgdTIpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRTY29yZSh4QSwgc2FtcGxlQikge1xuICAgICAgICByZXR1cm4gXy5yZWR1Y2Uoc2FtcGxlQiwgZnVuY3Rpb24odG90YWwsIHhCKSB7XG4gICAgICAgICAgcmV0dXJuIHRvdGFsICsgKHhCID4geEEgPyAwIDogeEIgPCB4QSA/IDEgOiAwLjUpO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0VShzYW1wbGVBLCBzYW1wbGVCKSB7XG4gICAgICAgIHJldHVybiBfLnJlZHVjZShzYW1wbGVBLCBmdW5jdGlvbih0b3RhbCwgeEEpIHtcbiAgICAgICAgICByZXR1cm4gdG90YWwgKyBnZXRTY29yZSh4QSwgc2FtcGxlQik7XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRaKHUpIHtcbiAgICAgICAgcmV0dXJuICh1IC0gKChzaXplMSAqIHNpemUyKSAvIDIpKSAvIHNxcnQoKHNpemUxICogc2l6ZTIgKiAoc2l6ZTEgKyBzaXplMiArIDEpKSAvIDEyKTtcbiAgICAgIH1cbiAgICAgIC8vIFJlamVjdCB0aGUgbnVsbCBoeXBvdGhlc2lzIHRoZSB0d28gc2FtcGxlcyBjb21lIGZyb20gdGhlXG4gICAgICAvLyBzYW1lIHBvcHVsYXRpb24gKGkuZS4gaGF2ZSB0aGUgc2FtZSBtZWRpYW4pIGlmLi4uXG4gICAgICBpZiAoc2l6ZTEgKyBzaXplMiA+IDMwKSB7XG4gICAgICAgIC8vIC4uLnRoZSB6LXN0YXQgaXMgZ3JlYXRlciB0aGFuIDEuOTYgb3IgbGVzcyB0aGFuIC0xLjk2XG4gICAgICAgIC8vIGh0dHA6Ly93d3cuc3RhdGlzdGljc2xlY3R1cmVzLmNvbS90b3BpY3MvbWFubndoaXRuZXl1L1xuICAgICAgICB6U3RhdCA9IGdldFoodSk7XG4gICAgICAgIHJldHVybiBhYnMoelN0YXQpID4gMS45NiA/ICh1ID09IHUxID8gMSA6IC0xKSA6IDA7XG4gICAgICB9XG4gICAgICAvLyAuLi50aGUgVSB2YWx1ZSBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdGhlIGNyaXRpY2FsIFUgdmFsdWUuXG4gICAgICBjcml0aWNhbCA9IG1heFNpemUgPCA1IHx8IG1pblNpemUgPCAzID8gMCA6IHVUYWJsZVttYXhTaXplXVttaW5TaXplIC0gM107XG4gICAgICByZXR1cm4gdSA8PSBjcml0aWNhbCA/ICh1ID09IHUxID8gMSA6IC0xKSA6IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXQgcHJvcGVydGllcyBhbmQgYWJvcnQgaWYgcnVubmluZy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcztcbiAgICAgIGlmIChiZW5jaC5ydW5uaW5nICYmICFjYWxsZWRCeS5hYm9ydCkge1xuICAgICAgICAvLyBObyB3b3JyaWVzLCBgcmVzZXQoKWAgaXMgY2FsbGVkIHdpdGhpbiBgYWJvcnQoKWAuXG4gICAgICAgIGNhbGxlZEJ5LnJlc2V0ID0gdHJ1ZTtcbiAgICAgICAgYmVuY2guYWJvcnQoKTtcbiAgICAgICAgZGVsZXRlIGNhbGxlZEJ5LnJlc2V0O1xuICAgICAgICByZXR1cm4gYmVuY2g7XG4gICAgICB9XG4gICAgICB2YXIgZXZlbnQsXG4gICAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICAgIGNoYW5nZXMgPSBbXSxcbiAgICAgICAgICBxdWV1ZSA9IFtdO1xuXG4gICAgICAvLyBBIG5vbi1yZWN1cnNpdmUgc29sdXRpb24gdG8gY2hlY2sgaWYgcHJvcGVydGllcyBoYXZlIGNoYW5nZWQuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL3d3dy5qc2xhYi5kay9hcnRpY2xlcy9ub24ucmVjdXJzaXZlLnByZW9yZGVyLnRyYXZlcnNhbC5wYXJ0NC5cbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAnZGVzdGluYXRpb24nOiBiZW5jaCxcbiAgICAgICAgJ3NvdXJjZSc6IF8uYXNzaWduKHt9LCBjbG9uZURlZXAoYmVuY2guY29uc3RydWN0b3IucHJvdG90eXBlKSwgY2xvbmVEZWVwKGJlbmNoLm9wdGlvbnMpKVxuICAgICAgfTtcblxuICAgICAgZG8ge1xuICAgICAgICBfLmZvck93bihkYXRhLnNvdXJjZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgIHZhciBjaGFuZ2VkLFxuICAgICAgICAgICAgICBkZXN0aW5hdGlvbiA9IGRhdGEuZGVzdGluYXRpb24sXG4gICAgICAgICAgICAgIGN1cnJWYWx1ZSA9IGRlc3RpbmF0aW9uW2tleV07XG5cbiAgICAgICAgICAvLyBTa2lwIHBzZXVkbyBwcml2YXRlIHByb3BlcnRpZXMgbGlrZSBgX3RpbWVySWRgIHdoaWNoIGNvdWxkIGJlIGFcbiAgICAgICAgICAvLyBKYXZhIG9iamVjdCBpbiBlbnZpcm9ubWVudHMgbGlrZSBSaW5nb0pTLlxuICAgICAgICAgIGlmIChrZXkuY2hhckF0KDApID09ICdfJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhbiBhcnJheSB2YWx1ZSBoYXMgY2hhbmdlZCB0byBhIG5vbi1hcnJheSB2YWx1ZS5cbiAgICAgICAgICAgICAgaWYgKCFfLmlzQXJyYXkoY3VyclZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZWQgPSBjdXJyVmFsdWUgPSBbXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhbiBhcnJheSBoYXMgY2hhbmdlZCBpdHMgbGVuZ3RoLlxuICAgICAgICAgICAgICBpZiAoY3VyclZhbHVlLmxlbmd0aCAhPSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VkID0gY3VyclZhbHVlID0gY3VyclZhbHVlLnNsaWNlKDAsIHZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY3VyclZhbHVlLmxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW4gb2JqZWN0IGhhcyBjaGFuZ2VkIHRvIGEgbm9uLW9iamVjdCB2YWx1ZS5cbiAgICAgICAgICAgIGVsc2UgaWYgKCFjdXJyVmFsdWUgfHwgdHlwZW9mIGN1cnJWYWx1ZSAhPSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICBjaGFuZ2VkID0gY3VyclZhbHVlID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSZWdpc3RlciBhIGNoYW5nZWQgb2JqZWN0LlxuICAgICAgICAgICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHsgJ2Rlc3RpbmF0aW9uJzogZGVzdGluYXRpb24sICdrZXknOiBrZXksICd2YWx1ZSc6IGN1cnJWYWx1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHF1ZXVlLnB1c2goeyAnZGVzdGluYXRpb24nOiBjdXJyVmFsdWUsICdzb3VyY2UnOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUmVnaXN0ZXIgYSBjaGFuZ2VkIHByaW1pdGl2ZS5cbiAgICAgICAgICBlbHNlIGlmICh2YWx1ZSAhPT0gY3VyclZhbHVlICYmICEodmFsdWUgPT0gbnVsbCB8fCBfLmlzRnVuY3Rpb24odmFsdWUpKSkge1xuICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHsgJ2Rlc3RpbmF0aW9uJzogZGVzdGluYXRpb24sICdrZXknOiBrZXksICd2YWx1ZSc6IHZhbHVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB3aGlsZSAoKGRhdGEgPSBxdWV1ZVtpbmRleCsrXSkpO1xuXG4gICAgICAvLyBJZiBjaGFuZ2VkIGVtaXQgdGhlIGByZXNldGAgZXZlbnQgYW5kIGlmIGl0IGlzbid0IGNhbmNlbGxlZCByZXNldCB0aGUgYmVuY2htYXJrLlxuICAgICAgaWYgKGNoYW5nZXMubGVuZ3RoICYmIChiZW5jaC5lbWl0KGV2ZW50ID0gRXZlbnQoJ3Jlc2V0JykpLCAhZXZlbnQuY2FuY2VsbGVkKSkge1xuICAgICAgICBfLmVhY2goY2hhbmdlcywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGRhdGEuZGVzdGluYXRpb25bZGF0YS5rZXldID0gZGF0YS52YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVuY2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzcGxheXMgcmVsZXZhbnQgYmVuY2htYXJrIGluZm9ybWF0aW9uIHdoZW4gY29lcmNlZCB0byBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHRvU3RyaW5nXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9TdHJpbmdCZW5jaCgpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXMsXG4gICAgICAgICAgZXJyb3IgPSBiZW5jaC5lcnJvcixcbiAgICAgICAgICBoeiA9IGJlbmNoLmh6LFxuICAgICAgICAgIGlkID0gYmVuY2guaWQsXG4gICAgICAgICAgc3RhdHMgPSBiZW5jaC5zdGF0cyxcbiAgICAgICAgICBzaXplID0gc3RhdHMuc2FtcGxlLmxlbmd0aCxcbiAgICAgICAgICBwbSA9ICdcXHhiMScsXG4gICAgICAgICAgcmVzdWx0ID0gYmVuY2gubmFtZSB8fCAoXy5pc05hTihpZCkgPyBpZCA6ICc8VGVzdCAjJyArIGlkICsgJz4nKTtcblxuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHJlc3VsdCArPSAnOiAnICsgam9pbihlcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgKz0gJyB4ICcgKyBmb3JtYXROdW1iZXIoaHoudG9GaXhlZChoeiA8IDEwMCA/IDIgOiAwKSkgKyAnIG9wcy9zZWMgJyArIHBtICtcbiAgICAgICAgICBzdGF0cy5ybWUudG9GaXhlZCgyKSArICclICgnICsgc2l6ZSArICcgcnVuJyArIChzaXplID09IDEgPyAnJyA6ICdzJykgKyAnIHNhbXBsZWQpJztcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ2xvY2tzIHRoZSB0aW1lIHRha2VuIHRvIGV4ZWN1dGUgYSB0ZXN0IHBlciBjeWNsZSAoc2VjcykuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBiZW5jaCBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSB0aW1lIHRha2VuLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsb2NrKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSBCZW5jaG1hcmsub3B0aW9ucyxcbiAgICAgICAgICB0ZW1wbGF0ZURhdGEgPSB7fSxcbiAgICAgICAgICB0aW1lcnMgPSBbeyAnbnMnOiB0aW1lci5ucywgJ3Jlcyc6IG1heCgwLjAwMTUsIGdldFJlcygnbXMnKSksICd1bml0JzogJ21zJyB9XTtcblxuICAgICAgLy8gTGF6eSBkZWZpbmUgZm9yIGhpLXJlcyB0aW1lcnMuXG4gICAgICBjbG9jayA9IGZ1bmN0aW9uKGNsb25lKSB7XG4gICAgICAgIHZhciBkZWZlcnJlZDtcblxuICAgICAgICBpZiAoY2xvbmUgaW5zdGFuY2VvZiBEZWZlcnJlZCkge1xuICAgICAgICAgIGRlZmVycmVkID0gY2xvbmU7XG4gICAgICAgICAgY2xvbmUgPSBkZWZlcnJlZC5iZW5jaG1hcms7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJlbmNoID0gY2xvbmUuX29yaWdpbmFsLFxuICAgICAgICAgICAgc3RyaW5nYWJsZSA9IGlzU3RyaW5nYWJsZShiZW5jaC5mbiksXG4gICAgICAgICAgICBjb3VudCA9IGJlbmNoLmNvdW50ID0gY2xvbmUuY291bnQsXG4gICAgICAgICAgICBkZWNvbXBpbGFibGUgPSBzdHJpbmdhYmxlIHx8IChzdXBwb3J0LmRlY29tcGlsYXRpb24gJiYgKGNsb25lLnNldHVwICE9PSBfLm5vb3AgfHwgY2xvbmUudGVhcmRvd24gIT09IF8ubm9vcCkpLFxuICAgICAgICAgICAgaWQgPSBiZW5jaC5pZCxcbiAgICAgICAgICAgIG5hbWUgPSBiZW5jaC5uYW1lIHx8ICh0eXBlb2YgaWQgPT0gJ251bWJlcicgPyAnPFRlc3QgIycgKyBpZCArICc+JyA6IGlkKSxcbiAgICAgICAgICAgIHJlc3VsdCA9IDA7XG5cbiAgICAgICAgLy8gSW5pdCBgbWluVGltZWAgaWYgbmVlZGVkLlxuICAgICAgICBjbG9uZS5taW5UaW1lID0gYmVuY2gubWluVGltZSB8fCAoYmVuY2gubWluVGltZSA9IGJlbmNoLm9wdGlvbnMubWluVGltZSA9IG9wdGlvbnMubWluVGltZSk7XG5cbiAgICAgICAgLy8gQ29tcGlsZSBpbiBzZXR1cC90ZWFyZG93biBmdW5jdGlvbnMgYW5kIHRoZSB0ZXN0IGxvb3AuXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBjb21waWxlZCB0ZXN0LCBpbnN0ZWFkIG9mIHVzaW5nIHRoZSBjYWNoZWQgYGJlbmNoLmNvbXBpbGVkYCxcbiAgICAgICAgLy8gdG8gYXZvaWQgcG90ZW50aWFsIGVuZ2luZSBvcHRpbWl6YXRpb25zIGVuYWJsZWQgb3ZlciB0aGUgbGlmZSBvZiB0aGUgdGVzdC5cbiAgICAgICAgdmFyIGZ1bmNCb2R5ID0gZGVmZXJyZWRcbiAgICAgICAgICA/ICd2YXIgZCM9dGhpcywke2ZuQXJnfT1kIyxtIz1kIy5iZW5jaG1hcmsuX29yaWdpbmFsLGYjPW0jLmZuLHN1Iz1tIy5zZXR1cCx0ZCM9bSMudGVhcmRvd247JyArXG4gICAgICAgICAgICAvLyBXaGVuIGBkZWZlcnJlZC5jeWNsZXNgIGlzIGAwYCB0aGVuLi4uXG4gICAgICAgICAgICAnaWYoIWQjLmN5Y2xlcyl7JyArXG4gICAgICAgICAgICAvLyBzZXQgYGRlZmVycmVkLmZuYCxcbiAgICAgICAgICAgICdkIy5mbj1mdW5jdGlvbigpe3ZhciAke2ZuQXJnfT1kIztpZih0eXBlb2YgZiM9PVwiZnVuY3Rpb25cIil7dHJ5eyR7Zm59XFxufWNhdGNoKGUjKXtmIyhkIyl9fWVsc2V7JHtmbn1cXG59fTsnICtcbiAgICAgICAgICAgIC8vIHNldCBgZGVmZXJyZWQudGVhcmRvd25gLFxuICAgICAgICAgICAgJ2QjLnRlYXJkb3duPWZ1bmN0aW9uKCl7ZCMuY3ljbGVzPTA7aWYodHlwZW9mIHRkIz09XCJmdW5jdGlvblwiKXt0cnl7JHt0ZWFyZG93bn1cXG59Y2F0Y2goZSMpe3RkIygpfX1lbHNleyR7dGVhcmRvd259XFxufX07JyArXG4gICAgICAgICAgICAvLyBleGVjdXRlIHRoZSBiZW5jaG1hcmsncyBgc2V0dXBgLFxuICAgICAgICAgICAgJ2lmKHR5cGVvZiBzdSM9PVwiZnVuY3Rpb25cIil7dHJ5eyR7c2V0dXB9XFxufWNhdGNoKGUjKXtzdSMoKX19ZWxzZXske3NldHVwfVxcbn07JyArXG4gICAgICAgICAgICAvLyBzdGFydCB0aW1lcixcbiAgICAgICAgICAgICd0Iy5zdGFydChkIyk7JyArXG4gICAgICAgICAgICAvLyBhbmQgdGhlbiBleGVjdXRlIGBkZWZlcnJlZC5mbmAgYW5kIHJldHVybiBhIGR1bW15IG9iamVjdC5cbiAgICAgICAgICAgICd9ZCMuZm4oKTtyZXR1cm57dWlkOlwiJHt1aWR9XCJ9J1xuXG4gICAgICAgICAgOiAndmFyIHIjLHMjLG0jPXRoaXMsZiM9bSMuZm4saSM9bSMuY291bnQsbiM9dCMubnM7JHtzZXR1cH1cXG4ke2JlZ2lufTsnICtcbiAgICAgICAgICAgICd3aGlsZShpIy0tKXske2ZufVxcbn0ke2VuZH07JHt0ZWFyZG93bn1cXG5yZXR1cm57ZWxhcHNlZDpyIyx1aWQ6XCIke3VpZH1cIn0nO1xuXG4gICAgICAgIHZhciBjb21waWxlZCA9IGJlbmNoLmNvbXBpbGVkID0gY2xvbmUuY29tcGlsZWQgPSBjcmVhdGVDb21waWxlZChiZW5jaCwgZGVjb21waWxhYmxlLCBkZWZlcnJlZCwgZnVuY0JvZHkpLFxuICAgICAgICAgICAgaXNFbXB0eSA9ICEodGVtcGxhdGVEYXRhLmZuIHx8IHN0cmluZ2FibGUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgICAgICAgIC8vIEZpcmVmb3ggbWF5IHJlbW92ZSBkZWFkIGNvZGUgZnJvbSBgRnVuY3Rpb24jdG9TdHJpbmdgIHJlc3VsdHMuXG4gICAgICAgICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL2J1Z3ppbC5sYS81MzYwODUuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSB0ZXN0IFwiJyArIG5hbWUgKyAnXCIgaXMgZW1wdHkuIFRoaXMgbWF5IGJlIHRoZSByZXN1bHQgb2YgZGVhZCBjb2RlIHJlbW92YWwuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKCFkZWZlcnJlZCkge1xuICAgICAgICAgICAgLy8gUHJldGVzdCB0byBkZXRlcm1pbmUgaWYgY29tcGlsZWQgY29kZSBleGl0cyBlYXJseSwgdXN1YWxseSBieSBhXG4gICAgICAgICAgICAvLyByb2d1ZSBgcmV0dXJuYCBzdGF0ZW1lbnQsIGJ5IGNoZWNraW5nIGZvciBhIHJldHVybiBvYmplY3Qgd2l0aCB0aGUgdWlkLlxuICAgICAgICAgICAgYmVuY2guY291bnQgPSAxO1xuICAgICAgICAgICAgY29tcGlsZWQgPSBkZWNvbXBpbGFibGUgJiYgKGNvbXBpbGVkLmNhbGwoYmVuY2gsIGNvbnRleHQsIHRpbWVyKSB8fCB7fSkudWlkID09IHRlbXBsYXRlRGF0YS51aWQgJiYgY29tcGlsZWQ7XG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IGNvdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgY29tcGlsZWQgPSBudWxsO1xuICAgICAgICAgIGNsb25lLmVycm9yID0gZSB8fCBuZXcgRXJyb3IoU3RyaW5nKGUpKTtcbiAgICAgICAgICBiZW5jaC5jb3VudCA9IGNvdW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIEZhbGxiYWNrIHdoZW4gYSB0ZXN0IGV4aXRzIGVhcmx5IG9yIGVycm9ycyBkdXJpbmcgcHJldGVzdC5cbiAgICAgICAgaWYgKCFjb21waWxlZCAmJiAhZGVmZXJyZWQgJiYgIWlzRW1wdHkpIHtcbiAgICAgICAgICBmdW5jQm9keSA9IChcbiAgICAgICAgICAgIHN0cmluZ2FibGUgfHwgKGRlY29tcGlsYWJsZSAmJiAhY2xvbmUuZXJyb3IpXG4gICAgICAgICAgICAgID8gJ2Z1bmN0aW9uIGYjKCl7JHtmbn1cXG59dmFyIHIjLHMjLG0jPXRoaXMsaSM9bSMuY291bnQnXG4gICAgICAgICAgICAgIDogJ3ZhciByIyxzIyxtIz10aGlzLGYjPW0jLmZuLGkjPW0jLmNvdW50J1xuICAgICAgICAgICAgKSArXG4gICAgICAgICAgICAnLG4jPXQjLm5zOyR7c2V0dXB9XFxuJHtiZWdpbn07bSMuZiM9ZiM7d2hpbGUoaSMtLSl7bSMuZiMoKX0ke2VuZH07JyArXG4gICAgICAgICAgICAnZGVsZXRlIG0jLmYjOyR7dGVhcmRvd259XFxucmV0dXJue2VsYXBzZWQ6ciN9JztcblxuICAgICAgICAgIGNvbXBpbGVkID0gY3JlYXRlQ29tcGlsZWQoYmVuY2gsIGRlY29tcGlsYWJsZSwgZGVmZXJyZWQsIGZ1bmNCb2R5KTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBQcmV0ZXN0IG9uZSBtb3JlIHRpbWUgdG8gY2hlY2sgZm9yIGVycm9ycy5cbiAgICAgICAgICAgIGJlbmNoLmNvdW50ID0gMTtcbiAgICAgICAgICAgIGNvbXBpbGVkLmNhbGwoYmVuY2gsIGNvbnRleHQsIHRpbWVyKTtcbiAgICAgICAgICAgIGJlbmNoLmNvdW50ID0gY291bnQ7XG4gICAgICAgICAgICBkZWxldGUgY2xvbmUuZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGJlbmNoLmNvdW50ID0gY291bnQ7XG4gICAgICAgICAgICBpZiAoIWNsb25lLmVycm9yKSB7XG4gICAgICAgICAgICAgIGNsb25lLmVycm9yID0gZSB8fCBuZXcgRXJyb3IoU3RyaW5nKGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbm8gZXJyb3JzIHJ1biB0aGUgZnVsbCB0ZXN0IGxvb3AuXG4gICAgICAgIGlmICghY2xvbmUuZXJyb3IpIHtcbiAgICAgICAgICBjb21waWxlZCA9IGJlbmNoLmNvbXBpbGVkID0gY2xvbmUuY29tcGlsZWQgPSBjcmVhdGVDb21waWxlZChiZW5jaCwgZGVjb21waWxhYmxlLCBkZWZlcnJlZCwgZnVuY0JvZHkpO1xuICAgICAgICAgIHJlc3VsdCA9IGNvbXBpbGVkLmNhbGwoZGVmZXJyZWQgfHwgYmVuY2gsIGNvbnRleHQsIHRpbWVyKS5lbGFwc2VkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSBjb21waWxlZCBmdW5jdGlvbiBmcm9tIHRoZSBnaXZlbiBmdW5jdGlvbiBgYm9keWAuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvbXBpbGVkKGJlbmNoLCBkZWNvbXBpbGFibGUsIGRlZmVycmVkLCBib2R5KSB7XG4gICAgICAgIHZhciBmbiA9IGJlbmNoLmZuLFxuICAgICAgICAgICAgZm5BcmcgPSBkZWZlcnJlZCA/IGdldEZpcnN0QXJndW1lbnQoZm4pIHx8ICdkZWZlcnJlZCcgOiAnJztcblxuICAgICAgICB0ZW1wbGF0ZURhdGEudWlkID0gdWlkICsgdWlkQ291bnRlcisrO1xuXG4gICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICdzZXR1cCc6IGRlY29tcGlsYWJsZSA/IGdldFNvdXJjZShiZW5jaC5zZXR1cCkgOiBpbnRlcnBvbGF0ZSgnbSMuc2V0dXAoKScpLFxuICAgICAgICAgICdmbic6IGRlY29tcGlsYWJsZSA/IGdldFNvdXJjZShmbikgOiBpbnRlcnBvbGF0ZSgnbSMuZm4oJyArIGZuQXJnICsgJyknKSxcbiAgICAgICAgICAnZm5BcmcnOiBmbkFyZyxcbiAgICAgICAgICAndGVhcmRvd24nOiBkZWNvbXBpbGFibGUgPyBnZXRTb3VyY2UoYmVuY2gudGVhcmRvd24pIDogaW50ZXJwb2xhdGUoJ20jLnRlYXJkb3duKCknKVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBVc2UgQVBJIG9mIGNob3NlbiB0aW1lci5cbiAgICAgICAgaWYgKHRpbWVyLnVuaXQgPT0gJ25zJykge1xuICAgICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICAgJ2JlZ2luJzogaW50ZXJwb2xhdGUoJ3MjPW4jKCknKSxcbiAgICAgICAgICAgICdlbmQnOiBpbnRlcnBvbGF0ZSgnciM9biMocyMpO3IjPXIjWzBdKyhyI1sxXS8xZTkpJylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aW1lci51bml0ID09ICd1cycpIHtcbiAgICAgICAgICBpZiAodGltZXIubnMuc3RvcCkge1xuICAgICAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgICAgICdiZWdpbic6IGludGVycG9sYXRlKCdzIz1uIy5zdGFydCgpJyksXG4gICAgICAgICAgICAgICdlbmQnOiBpbnRlcnBvbGF0ZSgnciM9biMubWljcm9zZWNvbmRzKCkvMWU2JylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAgICAgJ2JlZ2luJzogaW50ZXJwb2xhdGUoJ3MjPW4jKCknKSxcbiAgICAgICAgICAgICAgJ2VuZCc6IGludGVycG9sYXRlKCdyIz0obiMoKS1zIykvMWU2JylcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aW1lci5ucy5ub3cpIHtcbiAgICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAgICdiZWdpbic6IGludGVycG9sYXRlKCdzIz1uIy5ub3coKScpLFxuICAgICAgICAgICAgJ2VuZCc6IGludGVycG9sYXRlKCdyIz0obiMubm93KCktcyMpLzFlMycpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgICAnYmVnaW4nOiBpbnRlcnBvbGF0ZSgncyM9bmV3IG4jKCkuZ2V0VGltZSgpJyksXG4gICAgICAgICAgICAnZW5kJzogaW50ZXJwb2xhdGUoJ3IjPShuZXcgbiMoKS5nZXRUaW1lKCktcyMpLzFlMycpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGVmaW5lIGB0aW1lcmAgbWV0aG9kcy5cbiAgICAgICAgdGltZXIuc3RhcnQgPSBjcmVhdGVGdW5jdGlvbihcbiAgICAgICAgICBpbnRlcnBvbGF0ZSgnbyMnKSxcbiAgICAgICAgICBpbnRlcnBvbGF0ZSgndmFyIG4jPXRoaXMubnMsJHtiZWdpbn07byMuZWxhcHNlZD0wO28jLnRpbWVTdGFtcD1zIycpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGltZXIuc3RvcCA9IGNyZWF0ZUZ1bmN0aW9uKFxuICAgICAgICAgIGludGVycG9sYXRlKCdvIycpLFxuICAgICAgICAgIGludGVycG9sYXRlKCd2YXIgbiM9dGhpcy5ucyxzIz1vIy50aW1lU3RhbXAsJHtlbmR9O28jLmVsYXBzZWQ9ciMnKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENyZWF0ZSBjb21waWxlZCB0ZXN0LlxuICAgICAgICByZXR1cm4gY3JlYXRlRnVuY3Rpb24oXG4gICAgICAgICAgaW50ZXJwb2xhdGUoJ3dpbmRvdyx0IycpLFxuICAgICAgICAgICd2YXIgZ2xvYmFsID0gd2luZG93LCBjbGVhclRpbWVvdXQgPSBnbG9iYWwuY2xlYXJUaW1lb3V0LCBzZXRUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXQ7XFxuJyArXG4gICAgICAgICAgaW50ZXJwb2xhdGUoYm9keSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHZXRzIHRoZSBjdXJyZW50IHRpbWVyJ3MgbWluaW11bSByZXNvbHV0aW9uIChzZWNzKS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZ2V0UmVzKHVuaXQpIHtcbiAgICAgICAgdmFyIG1lYXN1cmVkLFxuICAgICAgICAgICAgYmVnaW4sXG4gICAgICAgICAgICBjb3VudCA9IDMwLFxuICAgICAgICAgICAgZGl2aXNvciA9IDFlMyxcbiAgICAgICAgICAgIG5zID0gdGltZXIubnMsXG4gICAgICAgICAgICBzYW1wbGUgPSBbXTtcblxuICAgICAgICAvLyBHZXQgYXZlcmFnZSBzbWFsbGVzdCBtZWFzdXJhYmxlIHRpbWUuXG4gICAgICAgIHdoaWxlIChjb3VudC0tKSB7XG4gICAgICAgICAgaWYgKHVuaXQgPT0gJ3VzJykge1xuICAgICAgICAgICAgZGl2aXNvciA9IDFlNjtcbiAgICAgICAgICAgIGlmIChucy5zdG9wKSB7XG4gICAgICAgICAgICAgIG5zLnN0YXJ0KCk7XG4gICAgICAgICAgICAgIHdoaWxlICghKG1lYXN1cmVkID0gbnMubWljcm9zZWNvbmRzKCkpKSB7fVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYmVnaW4gPSBucygpO1xuICAgICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9IG5zKCkgLSBiZWdpbikpIHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHVuaXQgPT0gJ25zJykge1xuICAgICAgICAgICAgZGl2aXNvciA9IDFlOTtcbiAgICAgICAgICAgIGJlZ2luID0gKGJlZ2luID0gbnMoKSlbMF0gKyAoYmVnaW5bMV0gLyBkaXZpc29yKTtcbiAgICAgICAgICAgIHdoaWxlICghKG1lYXN1cmVkID0gKChtZWFzdXJlZCA9IG5zKCkpWzBdICsgKG1lYXN1cmVkWzFdIC8gZGl2aXNvcikpIC0gYmVnaW4pKSB7fVxuICAgICAgICAgICAgZGl2aXNvciA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKG5zLm5vdykge1xuICAgICAgICAgICAgYmVnaW4gPSBucy5ub3coKTtcbiAgICAgICAgICAgIHdoaWxlICghKG1lYXN1cmVkID0gbnMubm93KCkgLSBiZWdpbikpIHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYmVnaW4gPSBuZXcgbnMoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9IG5ldyBucygpLmdldFRpbWUoKSAtIGJlZ2luKSkge31cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIGJyb2tlbiB0aW1lcnMuXG4gICAgICAgICAgaWYgKG1lYXN1cmVkID4gMCkge1xuICAgICAgICAgICAgc2FtcGxlLnB1c2gobWVhc3VyZWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzYW1wbGUucHVzaChJbmZpbml0eSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ29udmVydCB0byBzZWNvbmRzLlxuICAgICAgICByZXR1cm4gZ2V0TWVhbihzYW1wbGUpIC8gZGl2aXNvcjtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBJbnRlcnBvbGF0ZXMgYSBnaXZlbiB0ZW1wbGF0ZSBzdHJpbmcuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGludGVycG9sYXRlKHN0cmluZykge1xuICAgICAgICAvLyBSZXBsYWNlcyBhbGwgb2NjdXJyZW5jZXMgb2YgYCNgIHdpdGggYSB1bmlxdWUgbnVtYmVyIGFuZCB0ZW1wbGF0ZSB0b2tlbnMgd2l0aCBjb250ZW50LlxuICAgICAgICByZXR1cm4gXy50ZW1wbGF0ZShzdHJpbmcucmVwbGFjZSgvXFwjL2csIC9cXGQrLy5leGVjKHRlbXBsYXRlRGF0YS51aWQpKSkodGVtcGxhdGVEYXRhKTtcbiAgICAgIH1cblxuICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgLy8gRGV0ZWN0IENocm9tZSdzIG1pY3Jvc2Vjb25kIHRpbWVyOlxuICAgICAgLy8gZW5hYmxlIGJlbmNobWFya2luZyB2aWEgdGhlIC0tZW5hYmxlLWJlbmNobWFya2luZyBjb21tYW5kXG4gICAgICAvLyBsaW5lIHN3aXRjaCBpbiBhdCBsZWFzdCBDaHJvbWUgNyB0byB1c2UgY2hyb21lLkludGVydmFsXG4gICAgICB0cnkge1xuICAgICAgICBpZiAoKHRpbWVyLm5zID0gbmV3IChjb250ZXh0LmNocm9tZSB8fCBjb250ZXh0LmNocm9taXVtKS5JbnRlcnZhbCkpIHtcbiAgICAgICAgICB0aW1lcnMucHVzaCh7ICducyc6IHRpbWVyLm5zLCAncmVzJzogZ2V0UmVzKCd1cycpLCAndW5pdCc6ICd1cycgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2goZSkge31cblxuICAgICAgLy8gRGV0ZWN0IE5vZGUuanMncyBuYW5vc2Vjb25kIHJlc29sdXRpb24gdGltZXIgYXZhaWxhYmxlIGluIE5vZGUuanMgPj0gMC44LlxuICAgICAgaWYgKHByb2Nlc3NPYmplY3QgJiYgdHlwZW9mICh0aW1lci5ucyA9IHByb2Nlc3NPYmplY3QuaHJ0aW1lKSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRpbWVycy5wdXNoKHsgJ25zJzogdGltZXIubnMsICdyZXMnOiBnZXRSZXMoJ25zJyksICd1bml0JzogJ25zJyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIERldGVjdCBXYWRlIFNpbW1vbnMnIE5vZGUuanMgYG1pY3JvdGltZWAgbW9kdWxlLlxuICAgICAgaWYgKG1pY3JvdGltZU9iamVjdCAmJiB0eXBlb2YgKHRpbWVyLm5zID0gbWljcm90aW1lT2JqZWN0Lm5vdykgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aW1lcnMucHVzaCh7ICducyc6IHRpbWVyLm5zLCAgJ3Jlcyc6IGdldFJlcygndXMnKSwgJ3VuaXQnOiAndXMnIH0pO1xuICAgICAgfVxuICAgICAgLy8gUGljayB0aW1lciB3aXRoIGhpZ2hlc3QgcmVzb2x1dGlvbi5cbiAgICAgIHRpbWVyID0gXy5taW5CeSh0aW1lcnMsICdyZXMnKTtcblxuICAgICAgLy8gRXJyb3IgaWYgdGhlcmUgYXJlIG5vIHdvcmtpbmcgdGltZXJzLlxuICAgICAgaWYgKHRpbWVyLnJlcyA9PSBJbmZpbml0eSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JlbmNobWFyay5qcyB3YXMgdW5hYmxlIHRvIGZpbmQgYSB3b3JraW5nIHRpbWVyLicpO1xuICAgICAgfVxuICAgICAgLy8gUmVzb2x2ZSB0aW1lIHNwYW4gcmVxdWlyZWQgdG8gYWNoaWV2ZSBhIHBlcmNlbnQgdW5jZXJ0YWludHkgb2YgYXQgbW9zdCAxJS5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwOi8vc3BpZmYucml0LmVkdS9jbGFzc2VzL3BoeXMyNzMvdW5jZXJ0L3VuY2VydC5odG1sLlxuICAgICAgb3B0aW9ucy5taW5UaW1lIHx8IChvcHRpb25zLm1pblRpbWUgPSBtYXgodGltZXIucmVzIC8gMiAvIDAuMDEsIDAuMDUpKTtcbiAgICAgIHJldHVybiBjbG9jay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHN0YXRzIG9uIGJlbmNobWFyayByZXN1bHRzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYmVuY2ggVGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29tcHV0ZShiZW5jaCwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblxuICAgICAgdmFyIGFzeW5jID0gb3B0aW9ucy5hc3luYyxcbiAgICAgICAgICBlbGFwc2VkID0gMCxcbiAgICAgICAgICBpbml0Q291bnQgPSBiZW5jaC5pbml0Q291bnQsXG4gICAgICAgICAgbWluU2FtcGxlcyA9IGJlbmNoLm1pblNhbXBsZXMsXG4gICAgICAgICAgcXVldWUgPSBbXSxcbiAgICAgICAgICBzYW1wbGUgPSBiZW5jaC5zdGF0cy5zYW1wbGU7XG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyBhIGNsb25lIHRvIHRoZSBxdWV1ZS5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZW5xdWV1ZSgpIHtcbiAgICAgICAgcXVldWUucHVzaChiZW5jaC5jbG9uZSh7XG4gICAgICAgICAgJ19vcmlnaW5hbCc6IGJlbmNoLFxuICAgICAgICAgICdldmVudHMnOiB7XG4gICAgICAgICAgICAnYWJvcnQnOiBbdXBkYXRlXSxcbiAgICAgICAgICAgICdjeWNsZSc6IFt1cGRhdGVdLFxuICAgICAgICAgICAgJ2Vycm9yJzogW3VwZGF0ZV0sXG4gICAgICAgICAgICAnc3RhcnQnOiBbdXBkYXRlXVxuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFVwZGF0ZXMgdGhlIGNsb25lL29yaWdpbmFsIGJlbmNobWFya3MgdG8ga2VlcCB0aGVpciBkYXRhIGluIHN5bmMuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZShldmVudCkge1xuICAgICAgICB2YXIgY2xvbmUgPSB0aGlzLFxuICAgICAgICAgICAgdHlwZSA9IGV2ZW50LnR5cGU7XG5cbiAgICAgICAgaWYgKGJlbmNoLnJ1bm5pbmcpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PSAnc3RhcnQnKSB7XG4gICAgICAgICAgICAvLyBOb3RlOiBgY2xvbmUubWluVGltZWAgcHJvcCBpcyBpbml0ZWQgaW4gYGNsb2NrKClgLlxuICAgICAgICAgICAgY2xvbmUuY291bnQgPSBiZW5jaC5pbml0Q291bnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICBiZW5jaC5lcnJvciA9IGNsb25lLmVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ2Fib3J0Jykge1xuICAgICAgICAgICAgICBiZW5jaC5hYm9ydCgpO1xuICAgICAgICAgICAgICBiZW5jaC5lbWl0KCdjeWNsZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IGV2ZW50LnRhcmdldCA9IGJlbmNoO1xuICAgICAgICAgICAgICBiZW5jaC5lbWl0KGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYmVuY2guYWJvcnRlZCkge1xuICAgICAgICAgIC8vIENsZWFyIGFib3J0IGxpc3RlbmVycyB0byBhdm9pZCB0cmlnZ2VyaW5nIGJlbmNoJ3MgYWJvcnQvY3ljbGUgYWdhaW4uXG4gICAgICAgICAgY2xvbmUuZXZlbnRzLmFib3J0Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgY2xvbmUuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIERldGVybWluZXMgaWYgbW9yZSBjbG9uZXMgc2hvdWxkIGJlIHF1ZXVlZCBvciBpZiBjeWNsaW5nIHNob3VsZCBzdG9wLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBldmFsdWF0ZShldmVudCkge1xuICAgICAgICB2YXIgY3JpdGljYWwsXG4gICAgICAgICAgICBkZixcbiAgICAgICAgICAgIG1lYW4sXG4gICAgICAgICAgICBtb2UsXG4gICAgICAgICAgICBybWUsXG4gICAgICAgICAgICBzZCxcbiAgICAgICAgICAgIHNlbSxcbiAgICAgICAgICAgIHZhcmlhbmNlLFxuICAgICAgICAgICAgY2xvbmUgPSBldmVudC50YXJnZXQsXG4gICAgICAgICAgICBkb25lID0gYmVuY2guYWJvcnRlZCxcbiAgICAgICAgICAgIG5vdyA9IF8ubm93KCksXG4gICAgICAgICAgICBzaXplID0gc2FtcGxlLnB1c2goY2xvbmUudGltZXMucGVyaW9kKSxcbiAgICAgICAgICAgIG1heGVkT3V0ID0gc2l6ZSA+PSBtaW5TYW1wbGVzICYmIChlbGFwc2VkICs9IG5vdyAtIGNsb25lLnRpbWVzLnRpbWVTdGFtcCkgLyAxZTMgPiBiZW5jaC5tYXhUaW1lLFxuICAgICAgICAgICAgdGltZXMgPSBiZW5jaC50aW1lcyxcbiAgICAgICAgICAgIHZhck9mID0gZnVuY3Rpb24oc3VtLCB4KSB7IHJldHVybiBzdW0gKyBwb3coeCAtIG1lYW4sIDIpOyB9O1xuXG4gICAgICAgIC8vIEV4aXQgZWFybHkgZm9yIGFib3J0ZWQgb3IgdW5jbG9ja2FibGUgdGVzdHMuXG4gICAgICAgIGlmIChkb25lIHx8IGNsb25lLmh6ID09IEluZmluaXR5KSB7XG4gICAgICAgICAgbWF4ZWRPdXQgPSAhKHNpemUgPSBzYW1wbGUubGVuZ3RoID0gcXVldWUubGVuZ3RoID0gMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRvbmUpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBzYW1wbGUgbWVhbiAoZXN0aW1hdGUgb2YgdGhlIHBvcHVsYXRpb24gbWVhbikuXG4gICAgICAgICAgbWVhbiA9IGdldE1lYW4oc2FtcGxlKTtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBzYW1wbGUgdmFyaWFuY2UgKGVzdGltYXRlIG9mIHRoZSBwb3B1bGF0aW9uIHZhcmlhbmNlKS5cbiAgICAgICAgICB2YXJpYW5jZSA9IF8ucmVkdWNlKHNhbXBsZSwgdmFyT2YsIDApIC8gKHNpemUgLSAxKSB8fCAwO1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24gKGVzdGltYXRlIG9mIHRoZSBwb3B1bGF0aW9uIHN0YW5kYXJkIGRldmlhdGlvbikuXG4gICAgICAgICAgc2QgPSBzcXJ0KHZhcmlhbmNlKTtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBzdGFuZGFyZCBlcnJvciBvZiB0aGUgbWVhbiAoYS5rLmEuIHRoZSBzdGFuZGFyZCBkZXZpYXRpb24gb2YgdGhlIHNhbXBsaW5nIGRpc3RyaWJ1dGlvbiBvZiB0aGUgc2FtcGxlIG1lYW4pLlxuICAgICAgICAgIHNlbSA9IHNkIC8gc3FydChzaXplKTtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBkZWdyZWVzIG9mIGZyZWVkb20uXG4gICAgICAgICAgZGYgPSBzaXplIC0gMTtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBjcml0aWNhbCB2YWx1ZS5cbiAgICAgICAgICBjcml0aWNhbCA9IHRUYWJsZVtNYXRoLnJvdW5kKGRmKSB8fCAxXSB8fCB0VGFibGUuaW5maW5pdHk7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgbWFyZ2luIG9mIGVycm9yLlxuICAgICAgICAgIG1vZSA9IHNlbSAqIGNyaXRpY2FsO1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHJlbGF0aXZlIG1hcmdpbiBvZiBlcnJvci5cbiAgICAgICAgICBybWUgPSAobW9lIC8gbWVhbikgKiAxMDAgfHwgMDtcblxuICAgICAgICAgIF8uYXNzaWduKGJlbmNoLnN0YXRzLCB7XG4gICAgICAgICAgICAnZGV2aWF0aW9uJzogc2QsXG4gICAgICAgICAgICAnbWVhbic6IG1lYW4sXG4gICAgICAgICAgICAnbW9lJzogbW9lLFxuICAgICAgICAgICAgJ3JtZSc6IHJtZSxcbiAgICAgICAgICAgICdzZW0nOiBzZW0sXG4gICAgICAgICAgICAndmFyaWFuY2UnOiB2YXJpYW5jZVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gQWJvcnQgdGhlIGN5Y2xlIGxvb3Agd2hlbiB0aGUgbWluaW11bSBzYW1wbGUgc2l6ZSBoYXMgYmVlbiBjb2xsZWN0ZWRcbiAgICAgICAgICAvLyBhbmQgdGhlIGVsYXBzZWQgdGltZSBleGNlZWRzIHRoZSBtYXhpbXVtIHRpbWUgYWxsb3dlZCBwZXIgYmVuY2htYXJrLlxuICAgICAgICAgIC8vIFdlIGRvbid0IGNvdW50IGN5Y2xlIGRlbGF5cyB0b3dhcmQgdGhlIG1heCB0aW1lIGJlY2F1c2UgZGVsYXlzIG1heSBiZVxuICAgICAgICAgIC8vIGluY3JlYXNlZCBieSBicm93c2VycyB0aGF0IGNsYW1wIHRpbWVvdXRzIGZvciBpbmFjdGl2ZSB0YWJzLiBGb3IgbW9yZVxuICAgICAgICAgIC8vIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi93aW5kb3cuc2V0VGltZW91dCNJbmFjdGl2ZV90YWJzLlxuICAgICAgICAgIGlmIChtYXhlZE91dCkge1xuICAgICAgICAgICAgLy8gUmVzZXQgdGhlIGBpbml0Q291bnRgIGluIGNhc2UgdGhlIGJlbmNobWFyayBpcyByZXJ1bi5cbiAgICAgICAgICAgIGJlbmNoLmluaXRDb3VudCA9IGluaXRDb3VudDtcbiAgICAgICAgICAgIGJlbmNoLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgdGltZXMuZWxhcHNlZCA9IChub3cgLSB0aW1lcy50aW1lU3RhbXApIC8gMWUzO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYmVuY2guaHogIT0gSW5maW5pdHkpIHtcbiAgICAgICAgICAgIGJlbmNoLmh6ID0gMSAvIG1lYW47XG4gICAgICAgICAgICB0aW1lcy5jeWNsZSA9IG1lYW4gKiBiZW5jaC5jb3VudDtcbiAgICAgICAgICAgIHRpbWVzLnBlcmlvZCA9IG1lYW47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRpbWUgcGVybWl0cywgaW5jcmVhc2Ugc2FtcGxlIHNpemUgdG8gcmVkdWNlIHRoZSBtYXJnaW4gb2YgZXJyb3IuXG4gICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPCAyICYmICFtYXhlZE91dCkge1xuICAgICAgICAgIGVucXVldWUoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBYm9ydCB0aGUgYGludm9rZWAgY3ljbGUgd2hlbiBkb25lLlxuICAgICAgICBldmVudC5hYm9ydGVkID0gZG9uZTtcbiAgICAgIH1cblxuICAgICAgLy8gSW5pdCBxdWV1ZSBhbmQgYmVnaW4uXG4gICAgICBlbnF1ZXVlKCk7XG4gICAgICBpbnZva2UocXVldWUsIHtcbiAgICAgICAgJ25hbWUnOiAncnVuJyxcbiAgICAgICAgJ2FyZ3MnOiB7ICdhc3luYyc6IGFzeW5jIH0sXG4gICAgICAgICdxdWV1ZWQnOiB0cnVlLFxuICAgICAgICAnb25DeWNsZSc6IGV2YWx1YXRlLFxuICAgICAgICAnb25Db21wbGV0ZSc6IGZ1bmN0aW9uKCkgeyBiZW5jaC5lbWl0KCdjb21wbGV0ZScpOyB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDeWNsZXMgYSBiZW5jaG1hcmsgdW50aWwgYSBydW4gYGNvdW50YCBjYW4gYmUgZXN0YWJsaXNoZWQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjbG9uZSBUaGUgY2xvbmVkIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3ljbGUoY2xvbmUsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cbiAgICAgIHZhciBkZWZlcnJlZDtcbiAgICAgIGlmIChjbG9uZSBpbnN0YW5jZW9mIERlZmVycmVkKSB7XG4gICAgICAgIGRlZmVycmVkID0gY2xvbmU7XG4gICAgICAgIGNsb25lID0gY2xvbmUuYmVuY2htYXJrO1xuICAgICAgfVxuICAgICAgdmFyIGNsb2NrZWQsXG4gICAgICAgICAgY3ljbGVzLFxuICAgICAgICAgIGRpdmlzb3IsXG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgbWluVGltZSxcbiAgICAgICAgICBwZXJpb2QsXG4gICAgICAgICAgYXN5bmMgPSBvcHRpb25zLmFzeW5jLFxuICAgICAgICAgIGJlbmNoID0gY2xvbmUuX29yaWdpbmFsLFxuICAgICAgICAgIGNvdW50ID0gY2xvbmUuY291bnQsXG4gICAgICAgICAgdGltZXMgPSBjbG9uZS50aW1lcztcblxuICAgICAgLy8gQ29udGludWUsIGlmIG5vdCBhYm9ydGVkIGJldHdlZW4gY3ljbGVzLlxuICAgICAgaWYgKGNsb25lLnJ1bm5pbmcpIHtcbiAgICAgICAgLy8gYG1pblRpbWVgIGlzIHNldCB0byBgQmVuY2htYXJrLm9wdGlvbnMubWluVGltZWAgaW4gYGNsb2NrKClgLlxuICAgICAgICBjeWNsZXMgPSArK2Nsb25lLmN5Y2xlcztcbiAgICAgICAgY2xvY2tlZCA9IGRlZmVycmVkID8gZGVmZXJyZWQuZWxhcHNlZCA6IGNsb2NrKGNsb25lKTtcbiAgICAgICAgbWluVGltZSA9IGNsb25lLm1pblRpbWU7XG5cbiAgICAgICAgaWYgKGN5Y2xlcyA+IGJlbmNoLmN5Y2xlcykge1xuICAgICAgICAgIGJlbmNoLmN5Y2xlcyA9IGN5Y2xlcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xvbmUuZXJyb3IpIHtcbiAgICAgICAgICBldmVudCA9IEV2ZW50KCdlcnJvcicpO1xuICAgICAgICAgIGV2ZW50Lm1lc3NhZ2UgPSBjbG9uZS5lcnJvcjtcbiAgICAgICAgICBjbG9uZS5lbWl0KGV2ZW50KTtcbiAgICAgICAgICBpZiAoIWV2ZW50LmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgY2xvbmUuYWJvcnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIENvbnRpbnVlLCBpZiBub3QgZXJyb3JlZC5cbiAgICAgIGlmIChjbG9uZS5ydW5uaW5nKSB7XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHRpbWUgdGFrZW4gdG8gY29tcGxldGUgbGFzdCB0ZXN0IGN5Y2xlLlxuICAgICAgICBiZW5jaC50aW1lcy5jeWNsZSA9IHRpbWVzLmN5Y2xlID0gY2xvY2tlZDtcbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc2Vjb25kcyBwZXIgb3BlcmF0aW9uLlxuICAgICAgICBwZXJpb2QgPSBiZW5jaC50aW1lcy5wZXJpb2QgPSB0aW1lcy5wZXJpb2QgPSBjbG9ja2VkIC8gY291bnQ7XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIG9wcyBwZXIgc2Vjb25kLlxuICAgICAgICBiZW5jaC5oeiA9IGNsb25lLmh6ID0gMSAvIHBlcmlvZDtcbiAgICAgICAgLy8gQXZvaWQgd29ya2luZyBvdXIgd2F5IHVwIHRvIHRoaXMgbmV4dCB0aW1lLlxuICAgICAgICBiZW5jaC5pbml0Q291bnQgPSBjbG9uZS5pbml0Q291bnQgPSBjb3VudDtcbiAgICAgICAgLy8gRG8gd2UgbmVlZCB0byBkbyBhbm90aGVyIGN5Y2xlP1xuICAgICAgICBjbG9uZS5ydW5uaW5nID0gY2xvY2tlZCA8IG1pblRpbWU7XG5cbiAgICAgICAgaWYgKGNsb25lLnJ1bm5pbmcpIHtcbiAgICAgICAgICAvLyBUZXN0cyBtYXkgY2xvY2sgYXQgYDBgIHdoZW4gYGluaXRDb3VudGAgaXMgYSBzbWFsbCBudW1iZXIsXG4gICAgICAgICAgLy8gdG8gYXZvaWQgdGhhdCB3ZSBzZXQgaXRzIGNvdW50IHRvIHNvbWV0aGluZyBhIGJpdCBoaWdoZXIuXG4gICAgICAgICAgaWYgKCFjbG9ja2VkICYmIChkaXZpc29yID0gZGl2aXNvcnNbY2xvbmUuY3ljbGVzXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgY291bnQgPSBmbG9vcig0ZTYgLyBkaXZpc29yKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQ2FsY3VsYXRlIGhvdyBtYW55IG1vcmUgaXRlcmF0aW9ucyBpdCB3aWxsIHRha2UgdG8gYWNoaWV2ZSB0aGUgYG1pblRpbWVgLlxuICAgICAgICAgIGlmIChjb3VudCA8PSBjbG9uZS5jb3VudCkge1xuICAgICAgICAgICAgY291bnQgKz0gTWF0aC5jZWlsKChtaW5UaW1lIC0gY2xvY2tlZCkgLyBwZXJpb2QpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbG9uZS5ydW5uaW5nID0gY291bnQgIT0gSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFNob3VsZCB3ZSBleGl0IGVhcmx5P1xuICAgICAgZXZlbnQgPSBFdmVudCgnY3ljbGUnKTtcbiAgICAgIGNsb25lLmVtaXQoZXZlbnQpO1xuICAgICAgaWYgKGV2ZW50LmFib3J0ZWQpIHtcbiAgICAgICAgY2xvbmUuYWJvcnQoKTtcbiAgICAgIH1cbiAgICAgIC8vIEZpZ3VyZSBvdXQgd2hhdCB0byBkbyBuZXh0LlxuICAgICAgaWYgKGNsb25lLnJ1bm5pbmcpIHtcbiAgICAgICAgLy8gU3RhcnQgYSBuZXcgY3ljbGUuXG4gICAgICAgIGNsb25lLmNvdW50ID0gY291bnQ7XG4gICAgICAgIGlmIChkZWZlcnJlZCkge1xuICAgICAgICAgIGNsb25lLmNvbXBpbGVkLmNhbGwoZGVmZXJyZWQsIGNvbnRleHQsIHRpbWVyKTtcbiAgICAgICAgfSBlbHNlIGlmIChhc3luYykge1xuICAgICAgICAgIGRlbGF5KGNsb25lLCBmdW5jdGlvbigpIHsgY3ljbGUoY2xvbmUsIG9wdGlvbnMpOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjeWNsZShjbG9uZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyBGaXggVHJhY2VNb25rZXkgYnVnIGFzc29jaWF0ZWQgd2l0aCBjbG9jayBmYWxsYmFja3MuXG4gICAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwOi8vYnVnemlsLmxhLzUwOTA2OS5cbiAgICAgICAgaWYgKHN1cHBvcnQuYnJvd3Nlcikge1xuICAgICAgICAgIHJ1blNjcmlwdCh1aWQgKyAnPTE7ZGVsZXRlICcgKyB1aWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdlJ3JlIGRvbmUuXG4gICAgICAgIGNsb25lLmVtaXQoJ2NvbXBsZXRlJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogUnVucyB0aGUgYmVuY2htYXJrLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gYmFzaWMgdXNhZ2VcbiAgICAgKiBiZW5jaC5ydW4oKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHdpdGggb3B0aW9uc1xuICAgICAqIGJlbmNoLnJ1bih7ICdhc3luYyc6IHRydWUgfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gcnVuKG9wdGlvbnMpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXMsXG4gICAgICAgICAgZXZlbnQgPSBFdmVudCgnc3RhcnQnKTtcblxuICAgICAgLy8gU2V0IGBydW5uaW5nYCB0byBgZmFsc2VgIHNvIGByZXNldCgpYCB3b24ndCBjYWxsIGBhYm9ydCgpYC5cbiAgICAgIGJlbmNoLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgIGJlbmNoLnJlc2V0KCk7XG4gICAgICBiZW5jaC5ydW5uaW5nID0gdHJ1ZTtcblxuICAgICAgYmVuY2guY291bnQgPSBiZW5jaC5pbml0Q291bnQ7XG4gICAgICBiZW5jaC50aW1lcy50aW1lU3RhbXAgPSBfLm5vdygpO1xuICAgICAgYmVuY2guZW1pdChldmVudCk7XG5cbiAgICAgIGlmICghZXZlbnQuY2FuY2VsbGVkKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7ICdhc3luYyc6ICgob3B0aW9ucyA9IG9wdGlvbnMgJiYgb3B0aW9ucy5hc3luYykgPT0gbnVsbCA/IGJlbmNoLmFzeW5jIDogb3B0aW9ucykgJiYgc3VwcG9ydC50aW1lb3V0IH07XG5cbiAgICAgICAgLy8gRm9yIGNsb25lcyBjcmVhdGVkIHdpdGhpbiBgY29tcHV0ZSgpYC5cbiAgICAgICAgaWYgKGJlbmNoLl9vcmlnaW5hbCkge1xuICAgICAgICAgIGlmIChiZW5jaC5kZWZlcikge1xuICAgICAgICAgICAgRGVmZXJyZWQoYmVuY2gpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjeWNsZShiZW5jaCwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEZvciBvcmlnaW5hbCBiZW5jaG1hcmtzLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjb21wdXRlKGJlbmNoLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlbmNoO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIEZpcmVmb3ggMSBlcnJvbmVvdXNseSBkZWZpbmVzIHZhcmlhYmxlIGFuZCBhcmd1bWVudCBuYW1lcyBvZiBmdW5jdGlvbnMgb25cbiAgICAvLyB0aGUgZnVuY3Rpb24gaXRzZWxmIGFzIG5vbi1jb25maWd1cmFibGUgcHJvcGVydGllcyB3aXRoIGB1bmRlZmluZWRgIHZhbHVlcy5cbiAgICAvLyBUaGUgYnVnZ2luZXNzIGNvbnRpbnVlcyBhcyB0aGUgYEJlbmNobWFya2AgY29uc3RydWN0b3IgaGFzIGFuIGFyZ3VtZW50XG4gICAgLy8gbmFtZWQgYG9wdGlvbnNgIGFuZCBGaXJlZm94IDEgd2lsbCBub3QgYXNzaWduIGEgdmFsdWUgdG8gYEJlbmNobWFyay5vcHRpb25zYCxcbiAgICAvLyBtYWtpbmcgaXQgbm9uLXdyaXRhYmxlIGluIHRoZSBwcm9jZXNzLCB1bmxlc3MgaXQgaXMgdGhlIGZpcnN0IHByb3BlcnR5XG4gICAgLy8gYXNzaWduZWQgYnkgZm9yLWluIGxvb3Agb2YgYF8uYXNzaWduKClgLlxuICAgIF8uYXNzaWduKEJlbmNobWFyaywge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBkZWZhdWx0IG9wdGlvbnMgY29waWVkIGJ5IGJlbmNobWFyayBpbnN0YW5jZXMuXG4gICAgICAgKlxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdvcHRpb25zJzoge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBiZW5jaG1hcmsgY3ljbGVzIHdpbGwgZXhlY3V0ZSBhc3luY2hyb25vdXNseVxuICAgICAgICAgKiBieSBkZWZhdWx0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKi9cbiAgICAgICAgJ2FzeW5jJzogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IHRoZSBiZW5jaG1hcmsgY2xvY2sgaXMgZGVmZXJyZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqL1xuICAgICAgICAnZGVmZXInOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRlbGF5IGJldHdlZW4gdGVzdCBjeWNsZXMgKHNlY3MpLlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnZGVsYXknOiAwLjAwNSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheWVkIGJ5IGBCZW5jaG1hcmsjdG9TdHJpbmdgIHdoZW4gYSBgbmFtZWAgaXMgbm90IGF2YWlsYWJsZVxuICAgICAgICAgKiAoYXV0by1nZW5lcmF0ZWQgaWYgYWJzZW50KS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgJ2lkJzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBudW1iZXIgb2YgdGltZXMgdG8gZXhlY3V0ZSBhIHRlc3Qgb24gYSBiZW5jaG1hcmsncyBmaXJzdCBjeWNsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ2luaXRDb3VudCc6IDEsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBtYXhpbXVtIHRpbWUgYSBiZW5jaG1hcmsgaXMgYWxsb3dlZCB0byBydW4gYmVmb3JlIGZpbmlzaGluZyAoc2VjcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIE5vdGU6IEN5Y2xlIGRlbGF5cyBhcmVuJ3QgY291bnRlZCB0b3dhcmQgdGhlIG1heGltdW0gdGltZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21heFRpbWUnOiA1LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbWluaW11bSBzYW1wbGUgc2l6ZSByZXF1aXJlZCB0byBwZXJmb3JtIHN0YXRpc3RpY2FsIGFuYWx5c2lzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnbWluU2FtcGxlcyc6IDUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lIG5lZWRlZCB0byByZWR1Y2UgdGhlIHBlcmNlbnQgdW5jZXJ0YWludHkgb2YgbWVhc3VyZW1lbnQgdG8gMSUgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnbWluVGltZSc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBiZW5jaG1hcmsuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgICduYW1lJzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIGlzIGFib3J0ZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uQWJvcnQnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgY29tcGxldGVzIHJ1bm5pbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uQ29tcGxldGUnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCBhZnRlciBlYWNoIHJ1biBjeWNsZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnb25DeWNsZSc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gZXZlbnQgbGlzdGVuZXIgY2FsbGVkIHdoZW4gYSB0ZXN0IGVycm9ycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnb25FcnJvcic6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gZXZlbnQgbGlzdGVuZXIgY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBpcyByZXNldC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnb25SZXNldCc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gZXZlbnQgbGlzdGVuZXIgY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBzdGFydHMgcnVubmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnb25TdGFydCc6IHVuZGVmaW5lZFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQbGF0Zm9ybSBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGRlc2NyaWJpbmcgdGhpbmdzIGxpa2UgYnJvd3NlciBuYW1lLFxuICAgICAgICogdmVyc2lvbiwgYW5kIG9wZXJhdGluZyBzeXN0ZW0uIFNlZSBbYHBsYXRmb3JtLmpzYF0oaHR0cHM6Ly9tdGhzLmJlL3BsYXRmb3JtKS5cbiAgICAgICAqXG4gICAgICAgKiBAc3RhdGljXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ3BsYXRmb3JtJzogY29udGV4dC5wbGF0Zm9ybSB8fCByZXF1aXJlKCdwbGF0Zm9ybScpIHx8ICh7XG4gICAgICAgICdkZXNjcmlwdGlvbic6IGNvbnRleHQubmF2aWdhdG9yICYmIGNvbnRleHQubmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBudWxsLFxuICAgICAgICAnbGF5b3V0JzogbnVsbCxcbiAgICAgICAgJ3Byb2R1Y3QnOiBudWxsLFxuICAgICAgICAnbmFtZSc6IG51bGwsXG4gICAgICAgICdtYW51ZmFjdHVyZXInOiBudWxsLFxuICAgICAgICAnb3MnOiBudWxsLFxuICAgICAgICAncHJlcmVsZWFzZSc6IG51bGwsXG4gICAgICAgICd2ZXJzaW9uJzogbnVsbCxcbiAgICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBzZW1hbnRpYyB2ZXJzaW9uIG51bWJlci5cbiAgICAgICAqXG4gICAgICAgKiBAc3RhdGljXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqL1xuICAgICAgJ3ZlcnNpb24nOiAnMi4xLjEnXG4gICAgfSk7XG5cbiAgICBfLmFzc2lnbihCZW5jaG1hcmssIHtcbiAgICAgICdmaWx0ZXInOiBmaWx0ZXIsXG4gICAgICAnZm9ybWF0TnVtYmVyJzogZm9ybWF0TnVtYmVyLFxuICAgICAgJ2ludm9rZSc6IGludm9rZSxcbiAgICAgICdqb2luJzogam9pbixcbiAgICAgICdydW5JbkNvbnRleHQnOiBydW5JbkNvbnRleHQsXG4gICAgICAnc3VwcG9ydCc6IHN1cHBvcnRcbiAgICB9KTtcblxuICAgIC8vIEFkZCBsb2Rhc2ggbWV0aG9kcyB0byBCZW5jaG1hcmsuXG4gICAgXy5lYWNoKFsnZWFjaCcsICdmb3JFYWNoJywgJ2Zvck93bicsICdoYXMnLCAnaW5kZXhPZicsICdtYXAnLCAncmVkdWNlJ10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIEJlbmNobWFya1ttZXRob2ROYW1lXSA9IF9bbWV0aG9kTmFtZV07XG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBfLmFzc2lnbihCZW5jaG1hcmsucHJvdG90eXBlLCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG51bWJlciBvZiB0aW1lcyBhIHRlc3Qgd2FzIGV4ZWN1dGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnY291bnQnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgY3ljbGVzIHBlcmZvcm1lZCB3aGlsZSBiZW5jaG1hcmtpbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICdjeWNsZXMnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgZXhlY3V0aW9ucyBwZXIgc2Vjb25kLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnaHonOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjb21waWxlZCB0ZXN0IGZ1bmN0aW9uLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIHtGdW5jdGlvbnxzdHJpbmd9XG4gICAgICAgKi9cbiAgICAgICdjb21waWxlZCc6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZXJyb3Igb2JqZWN0IGlmIHRoZSB0ZXN0IGZhaWxlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ2Vycm9yJzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSB0ZXN0IHRvIGJlbmNobWFyay5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258c3RyaW5nfVxuICAgICAgICovXG4gICAgICAnZm4nOiB1bmRlZmluZWQsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBiZW5jaG1hcmsgaXMgYWJvcnRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdhYm9ydGVkJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBiZW5jaG1hcmsgaXMgcnVubmluZy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdydW5uaW5nJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogQ29tcGlsZWQgaW50byB0aGUgdGVzdCBhbmQgZXhlY3V0ZWQgaW1tZWRpYXRlbHkgKipiZWZvcmUqKiB0aGUgdGVzdCBsb29wLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIHtGdW5jdGlvbnxzdHJpbmd9XG4gICAgICAgKiBAZXhhbXBsZVxuICAgICAgICpcbiAgICAgICAqIC8vIGJhc2ljIHVzYWdlXG4gICAgICAgKiB2YXIgYmVuY2ggPSBCZW5jaG1hcmsoe1xuICAgICAgICogICAnc2V0dXAnOiBmdW5jdGlvbigpIHtcbiAgICAgICAqICAgICB2YXIgYyA9IHRoaXMuY291bnQsXG4gICAgICAgKiAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgICAgKiAgICAgd2hpbGUgKGMtLSkge1xuICAgICAgICogICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICAgKiAgICAgfVxuICAgICAgICogICB9LFxuICAgICAgICogICAnZm4nOiBmdW5jdGlvbigpIHtcbiAgICAgICAqICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQubGFzdENoaWxkKTtcbiAgICAgICAqICAgfVxuICAgICAgICogfSk7XG4gICAgICAgKlxuICAgICAgICogLy8gY29tcGlsZXMgdG8gc29tZXRoaW5nIGxpa2U6XG4gICAgICAgKiB2YXIgYyA9IHRoaXMuY291bnQsXG4gICAgICAgKiAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICAgICAqIHdoaWxlIChjLS0pIHtcbiAgICAgICAqICAgZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICAgKiB9XG4gICAgICAgKiB2YXIgc3RhcnQgPSBuZXcgRGF0ZTtcbiAgICAgICAqIHdoaWxlIChjb3VudC0tKSB7XG4gICAgICAgKiAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5sYXN0Q2hpbGQpO1xuICAgICAgICogfVxuICAgICAgICogdmFyIGVuZCA9IG5ldyBEYXRlIC0gc3RhcnQ7XG4gICAgICAgKlxuICAgICAgICogLy8gb3IgdXNpbmcgc3RyaW5nc1xuICAgICAgICogdmFyIGJlbmNoID0gQmVuY2htYXJrKHtcbiAgICAgICAqICAgJ3NldHVwJzogJ1xcXG4gICAgICAgKiAgICAgdmFyIGEgPSAwO1xcblxcXG4gICAgICAgKiAgICAgKGZ1bmN0aW9uKCkge1xcblxcXG4gICAgICAgKiAgICAgICAoZnVuY3Rpb24oKSB7XFxuXFxcbiAgICAgICAqICAgICAgICAgKGZ1bmN0aW9uKCkgeycsXG4gICAgICAgKiAgICdmbic6ICdhICs9IDE7JyxcbiAgICAgICAqICAgJ3RlYXJkb3duJzogJ1xcXG4gICAgICAgKiAgICAgICAgICB9KCkpXFxuXFxcbiAgICAgICAqICAgICAgICB9KCkpXFxuXFxcbiAgICAgICAqICAgICAgfSgpKSdcbiAgICAgICAqIH0pO1xuICAgICAgICpcbiAgICAgICAqIC8vIGNvbXBpbGVzIHRvIHNvbWV0aGluZyBsaWtlOlxuICAgICAgICogdmFyIGEgPSAwO1xuICAgICAgICogKGZ1bmN0aW9uKCkge1xuICAgICAgICogICAoZnVuY3Rpb24oKSB7XG4gICAgICAgKiAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICogICAgICAgdmFyIHN0YXJ0ID0gbmV3IERhdGU7XG4gICAgICAgKiAgICAgICB3aGlsZSAoY291bnQtLSkge1xuICAgICAgICogICAgICAgICBhICs9IDE7XG4gICAgICAgKiAgICAgICB9XG4gICAgICAgKiAgICAgICB2YXIgZW5kID0gbmV3IERhdGUgLSBzdGFydDtcbiAgICAgICAqICAgICB9KCkpXG4gICAgICAgKiAgIH0oKSlcbiAgICAgICAqIH0oKSlcbiAgICAgICAqL1xuICAgICAgJ3NldHVwJzogXy5ub29wLFxuXG4gICAgICAvKipcbiAgICAgICAqIENvbXBpbGVkIGludG8gdGhlIHRlc3QgYW5kIGV4ZWN1dGVkIGltbWVkaWF0ZWx5ICoqYWZ0ZXIqKiB0aGUgdGVzdCBsb29wLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIHtGdW5jdGlvbnxzdHJpbmd9XG4gICAgICAgKi9cbiAgICAgICd0ZWFyZG93bic6IF8ubm9vcCxcblxuICAgICAgLyoqXG4gICAgICAgKiBBbiBvYmplY3Qgb2Ygc3RhdHMgaW5jbHVkaW5nIG1lYW4sIG1hcmdpbiBvciBlcnJvciwgYW5kIHN0YW5kYXJkIGRldmlhdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ3N0YXRzJzoge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbWFyZ2luIG9mIGVycm9yLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21vZSc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZWxhdGl2ZSBtYXJnaW4gb2YgZXJyb3IgKGV4cHJlc3NlZCBhcyBhIHBlcmNlbnRhZ2Ugb2YgdGhlIG1lYW4pLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ3JtZSc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzdGFuZGFyZCBlcnJvciBvZiB0aGUgbWVhbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdzZW0nOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdkZXZpYXRpb24nOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2FtcGxlIGFyaXRobWV0aWMgbWVhbiAoc2VjcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnbWVhbic6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBhcnJheSBvZiBzYW1wbGVkIHBlcmlvZHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgQXJyYXlcbiAgICAgICAgICovXG4gICAgICAgICdzYW1wbGUnOiBbXSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNhbXBsZSB2YXJpYW5jZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICd2YXJpYW5jZSc6IDBcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQW4gb2JqZWN0IG9mIHRpbWluZyBkYXRhIGluY2x1ZGluZyBjeWNsZSwgZWxhcHNlZCwgcGVyaW9kLCBzdGFydCwgYW5kIHN0b3AuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICd0aW1lcyc6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRpbWUgdGFrZW4gdG8gY29tcGxldGUgdGhlIGxhc3QgY3ljbGUgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3RpbWVzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ2N5Y2xlJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRpbWUgdGFrZW4gdG8gY29tcGxldGUgdGhlIGJlbmNobWFyayAoc2VjcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjdGltZXNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnZWxhcHNlZCc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lIHRha2VuIHRvIGV4ZWN1dGUgdGhlIHRlc3Qgb25jZSAoc2VjcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjdGltZXNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAncGVyaW9kJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSB0aW1lc3RhbXAgb2Ygd2hlbiB0aGUgYmVuY2htYXJrIHN0YXJ0ZWQgKG1zKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayN0aW1lc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICd0aW1lU3RhbXAnOiAwXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBfLmFzc2lnbihCZW5jaG1hcmsucHJvdG90eXBlLCB7XG4gICAgICAnYWJvcnQnOiBhYm9ydCxcbiAgICAgICdjbG9uZSc6IGNsb25lLFxuICAgICAgJ2NvbXBhcmUnOiBjb21wYXJlLFxuICAgICAgJ2VtaXQnOiBlbWl0LFxuICAgICAgJ2xpc3RlbmVycyc6IGxpc3RlbmVycyxcbiAgICAgICdvZmYnOiBvZmYsXG4gICAgICAnb24nOiBvbixcbiAgICAgICdyZXNldCc6IHJlc2V0LFxuICAgICAgJ3J1bic6IHJ1bixcbiAgICAgICd0b1N0cmluZyc6IHRvU3RyaW5nQmVuY2hcbiAgICB9KTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIF8uYXNzaWduKERlZmVycmVkLnByb3RvdHlwZSwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBkZWZlcnJlZCBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5EZWZlcnJlZFxuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdiZW5jaG1hcmsnOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgZGVmZXJyZWQgY3ljbGVzIHBlcmZvcm1lZCB3aGlsZSBiZW5jaG1hcmtpbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5EZWZlcnJlZFxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICdjeWNsZXMnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSB0aW1lIHRha2VuIHRvIGNvbXBsZXRlIHRoZSBkZWZlcnJlZCBiZW5jaG1hcmsgKHNlY3MpLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnZWxhcHNlZCc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSB0aW1lc3RhbXAgb2Ygd2hlbiB0aGUgZGVmZXJyZWQgYmVuY2htYXJrIHN0YXJ0ZWQgKG1zKS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkRlZmVycmVkXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ3RpbWVTdGFtcCc6IDBcbiAgICB9KTtcblxuICAgIF8uYXNzaWduKERlZmVycmVkLnByb3RvdHlwZSwge1xuICAgICAgJ3Jlc29sdmUnOiByZXNvbHZlXG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBfLmFzc2lnbihFdmVudC5wcm90b3R5cGUsIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIGVtaXR0ZXJzIGxpc3RlbmVyIGl0ZXJhdGlvbiBpcyBhYm9ydGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgJ2Fib3J0ZWQnOiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIGRlZmF1bHQgYWN0aW9uIGlzIGNhbmNlbGxlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdjYW5jZWxsZWQnOiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgb2JqZWN0IHdob3NlIGxpc3RlbmVycyBhcmUgY3VycmVudGx5IGJlaW5nIHByb2Nlc3NlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ2N1cnJlbnRUYXJnZXQnOiB1bmRlZmluZWQsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbGFzdCBleGVjdXRlZCBsaXN0ZW5lci5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBNaXhlZFxuICAgICAgICovXG4gICAgICAncmVzdWx0JzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBvYmplY3QgdG8gd2hpY2ggdGhlIGV2ZW50IHdhcyBvcmlnaW5hbGx5IGVtaXR0ZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICd0YXJnZXQnOiB1bmRlZmluZWQsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSB0aW1lc3RhbXAgb2Ygd2hlbiB0aGUgZXZlbnQgd2FzIGNyZWF0ZWQgKG1zKS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ3RpbWVTdGFtcCc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGV2ZW50IHR5cGUuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKi9cbiAgICAgICd0eXBlJzogJydcbiAgICB9KTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IG9wdGlvbnMgY29waWVkIGJ5IHN1aXRlIGluc3RhbmNlcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgU3VpdGUub3B0aW9ucyA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgc3VpdGUuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZS5vcHRpb25zXG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqL1xuICAgICAgJ25hbWUnOiB1bmRlZmluZWRcbiAgICB9O1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgXy5hc3NpZ24oU3VpdGUucHJvdG90eXBlLCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG51bWJlciBvZiBiZW5jaG1hcmtzIGluIHRoZSBzdWl0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2xlbmd0aCc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBzdWl0ZSBpcyBhYm9ydGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgJ2Fib3J0ZWQnOiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIHN1aXRlIGlzIHJ1bm5pbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAncnVubmluZyc6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBfLmFzc2lnbihTdWl0ZS5wcm90b3R5cGUsIHtcbiAgICAgICdhYm9ydCc6IGFib3J0U3VpdGUsXG4gICAgICAnYWRkJzogYWRkLFxuICAgICAgJ2Nsb25lJzogY2xvbmVTdWl0ZSxcbiAgICAgICdlbWl0JzogZW1pdCxcbiAgICAgICdmaWx0ZXInOiBmaWx0ZXJTdWl0ZSxcbiAgICAgICdqb2luJzogYXJyYXlSZWYuam9pbixcbiAgICAgICdsaXN0ZW5lcnMnOiBsaXN0ZW5lcnMsXG4gICAgICAnb2ZmJzogb2ZmLFxuICAgICAgJ29uJzogb24sXG4gICAgICAncG9wJzogYXJyYXlSZWYucG9wLFxuICAgICAgJ3B1c2gnOiBwdXNoLFxuICAgICAgJ3Jlc2V0JzogcmVzZXRTdWl0ZSxcbiAgICAgICdydW4nOiBydW5TdWl0ZSxcbiAgICAgICdyZXZlcnNlJzogYXJyYXlSZWYucmV2ZXJzZSxcbiAgICAgICdzaGlmdCc6IHNoaWZ0LFxuICAgICAgJ3NsaWNlJzogc2xpY2UsXG4gICAgICAnc29ydCc6IGFycmF5UmVmLnNvcnQsXG4gICAgICAnc3BsaWNlJzogYXJyYXlSZWYuc3BsaWNlLFxuICAgICAgJ3Vuc2hpZnQnOiB1bnNoaWZ0XG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBFeHBvc2UgRGVmZXJyZWQsIEV2ZW50LCBhbmQgU3VpdGUuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLCB7XG4gICAgICAnRGVmZXJyZWQnOiBEZWZlcnJlZCxcbiAgICAgICdFdmVudCc6IEV2ZW50LFxuICAgICAgJ1N1aXRlJzogU3VpdGVcbiAgICB9KTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIEFkZCBsb2Rhc2ggbWV0aG9kcyBhcyBTdWl0ZSBtZXRob2RzLlxuICAgIF8uZWFjaChbJ2VhY2gnLCAnZm9yRWFjaCcsICdpbmRleE9mJywgJ21hcCcsICdyZWR1Y2UnXSwgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW21ldGhvZE5hbWVdO1xuICAgICAgU3VpdGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzID0gW3RoaXNdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KF8sIGFyZ3MpO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIEF2b2lkIGFycmF5LWxpa2Ugb2JqZWN0IGJ1Z3Mgd2l0aCBgQXJyYXkjc2hpZnRgIGFuZCBgQXJyYXkjc3BsaWNlYFxuICAgIC8vIGluIEZpcmVmb3ggPCAxMCBhbmQgSUUgPCA5LlxuICAgIF8uZWFjaChbJ3BvcCcsICdzaGlmdCcsICdzcGxpY2UnXSwgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBhcnJheVJlZlttZXRob2ROYW1lXTtcblxuICAgICAgU3VpdGUucHJvdG90eXBlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMsXG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHZhbHVlLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICBkZWxldGUgdmFsdWVbMF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBBdm9pZCBidWdneSBgQXJyYXkjdW5zaGlmdGAgaW4gSUUgPCA4IHdoaWNoIGRvZXNuJ3QgcmV0dXJuIHRoZSBuZXdcbiAgICAvLyBsZW5ndGggb2YgdGhlIGFycmF5LlxuICAgIFN1aXRlLnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdmFsdWUgPSB0aGlzO1xuICAgICAgdW5zaGlmdC5hcHBseSh2YWx1ZSwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB2YWx1ZS5sZW5ndGg7XG4gICAgfTtcblxuICAgIHJldHVybiBCZW5jaG1hcms7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBFeHBvcnQgQmVuY2htYXJrLlxuICAvLyBTb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBjb25kaXRpb24gcGF0dGVybnMgbGlrZSB0aGUgZm9sbG93aW5nOlxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBEZWZpbmUgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSBzbywgdGhyb3VnaCBwYXRoIG1hcHBpbmcsIGl0IGNhbiBiZSBhbGlhc2VkLlxuICAgIGRlZmluZShbJ2xvZGFzaCcsICdwbGF0Zm9ybSddLCBmdW5jdGlvbihfLCBwbGF0Zm9ybSkge1xuICAgICAgcmV0dXJuIHJ1bkluQ29udGV4dCh7XG4gICAgICAgICdfJzogXyxcbiAgICAgICAgJ3BsYXRmb3JtJzogcGxhdGZvcm1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIHZhciBCZW5jaG1hcmsgPSBydW5JbkNvbnRleHQoKTtcblxuICAgIC8vIENoZWNrIGZvciBgZXhwb3J0c2AgYWZ0ZXIgYGRlZmluZWAgaW4gY2FzZSBhIGJ1aWxkIG9wdGltaXplciBhZGRzIGFuIGBleHBvcnRzYCBvYmplY3QuXG4gICAgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcbiAgICAgIC8vIEV4cG9ydCBmb3IgTm9kZS5qcy5cbiAgICAgIGlmIChtb2R1bGVFeHBvcnRzKSB7XG4gICAgICAgIChmcmVlTW9kdWxlLmV4cG9ydHMgPSBCZW5jaG1hcmspLkJlbmNobWFyayA9IEJlbmNobWFyaztcbiAgICAgIH1cbiAgICAgIC8vIEV4cG9ydCBmb3IgQ29tbW9uSlMgc3VwcG9ydC5cbiAgICAgIGZyZWVFeHBvcnRzLkJlbmNobWFyayA9IEJlbmNobWFyaztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBFeHBvcnQgdG8gdGhlIGdsb2JhbCBvYmplY3QuXG4gICAgICByb290LkJlbmNobWFyayA9IEJlbmNobWFyaztcbiAgICB9XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYmVuY2htYXJrL2JlbmNobWFyay5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyohXG4gKiBQbGF0Zm9ybS5qcyB2MS4zLjEgPGh0dHA6Ly9tdGhzLmJlL3BsYXRmb3JtPlxuICogQ29weXJpZ2h0IDIwMTQtMjAxNiBCZW5qYW1pbiBUYW4gPGh0dHBzOi8vZDEwLmdpdGh1Yi5pby8+XG4gKiBDb3B5cmlnaHQgMjAxMS0yMDEzIEpvaG4tRGF2aWQgRGFsdG9uIDxodHRwOi8vYWxseW91Y2FubGVldC5jb20vPlxuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbXRocy5iZS9taXQ+XG4gKi9cbjsoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBgT2JqZWN0YCAqL1xuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgICAnb2JqZWN0JzogdHJ1ZVxuICB9O1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0ICovXG4gIHZhciByb290ID0gKG9iamVjdFR5cGVzW3R5cGVvZiB3aW5kb3ddICYmIHdpbmRvdykgfHwgdGhpcztcblxuICAvKiogQmFja3VwIHBvc3NpYmxlIGdsb2JhbCBvYmplY3QgKi9cbiAgdmFyIG9sZFJvb3QgPSByb290O1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AgKi9cbiAgdmFyIGZyZWVFeHBvcnRzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgICovXG4gIHZhciBmcmVlTW9kdWxlID0gb2JqZWN0VHlwZXNbdHlwZW9mIG1vZHVsZV0gJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMgb3IgQnJvd3NlcmlmaWVkIGNvZGUgYW5kIHVzZSBpdCBhcyBgcm9vdGAgKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSBmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlICYmIHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuICBpZiAoZnJlZUdsb2JhbCAmJiAoZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC5zZWxmID09PSBmcmVlR2xvYmFsKSkge1xuICAgIHJvb3QgPSBmcmVlR2xvYmFsO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYXMgdGhlIG1heGltdW0gbGVuZ3RoIG9mIGFuIGFycmF5LWxpa2Ugb2JqZWN0LlxuICAgKiBTZWUgdGhlIFtFUzYgc3BlY10oaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpXG4gICAqIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICB2YXIgbWF4U2FmZUludGVnZXIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4gIC8qKiBPcGVyYSByZWdleHAgKi9cbiAgdmFyIHJlT3BlcmEgPSAvXFxiT3BlcmEvO1xuXG4gIC8qKiBQb3NzaWJsZSBnbG9iYWwgb2JqZWN0ICovXG4gIHZhciB0aGlzQmluZGluZyA9IHRoaXM7XG5cbiAgLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyAqL1xuICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIGNoZWNrIGZvciBvd24gcHJvcGVydGllcyBvZiBhbiBvYmplY3QgKi9cbiAgdmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgdmFsdWVzICovXG4gIHZhciB0b1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDYXBpdGFsaXplcyBhIHN0cmluZyB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNhcGl0YWxpemUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjYXBpdGFsaXplZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICAgIHN0cmluZyA9IFN0cmluZyhzdHJpbmcpO1xuICAgIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG4gIH1cblxuICAvKipcbiAgICogQSB1dGlsaXR5IGZ1bmN0aW9uIHRvIGNsZWFuIHVwIHRoZSBPUyBuYW1lLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3MgVGhlIE9TIG5hbWUgdG8gY2xlYW4gdXAuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbcGF0dGVybl0gQSBgUmVnRXhwYCBwYXR0ZXJuIG1hdGNoaW5nIHRoZSBPUyBuYW1lLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2xhYmVsXSBBIGxhYmVsIGZvciB0aGUgT1MuXG4gICAqL1xuICBmdW5jdGlvbiBjbGVhbnVwT1Mob3MsIHBhdHRlcm4sIGxhYmVsKSB7XG4gICAgLy8gcGxhdGZvcm0gdG9rZW5zIGRlZmluZWQgYXRcbiAgICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1Mzc1MDMoVlMuODUpLmFzcHhcbiAgICAvLyBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDA4MTEyMjA1Mzk1MC9odHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1Mzc1MDMoVlMuODUpLmFzcHhcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICc2LjQnOiAgJzEwJyxcbiAgICAgICc2LjMnOiAgJzguMScsXG4gICAgICAnNi4yJzogICc4JyxcbiAgICAgICc2LjEnOiAgJ1NlcnZlciAyMDA4IFIyIC8gNycsXG4gICAgICAnNi4wJzogICdTZXJ2ZXIgMjAwOCAvIFZpc3RhJyxcbiAgICAgICc1LjInOiAgJ1NlcnZlciAyMDAzIC8gWFAgNjQtYml0JyxcbiAgICAgICc1LjEnOiAgJ1hQJyxcbiAgICAgICc1LjAxJzogJzIwMDAgU1AxJyxcbiAgICAgICc1LjAnOiAgJzIwMDAnLFxuICAgICAgJzQuMCc6ICAnTlQnLFxuICAgICAgJzQuOTAnOiAnTUUnXG4gICAgfTtcbiAgICAvLyBkZXRlY3QgV2luZG93cyB2ZXJzaW9uIGZyb20gcGxhdGZvcm0gdG9rZW5zXG4gICAgaWYgKHBhdHRlcm4gJiYgbGFiZWwgJiYgL15XaW4vaS50ZXN0KG9zKSAmJlxuICAgICAgICAoZGF0YSA9IGRhdGFbMC8qT3BlcmEgOS4yNSBmaXgqLywgL1tcXGQuXSskLy5leGVjKG9zKV0pKSB7XG4gICAgICBvcyA9ICdXaW5kb3dzICcgKyBkYXRhO1xuICAgIH1cbiAgICAvLyBjb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwXG4gICAgb3MgPSBTdHJpbmcob3MpO1xuXG4gICAgaWYgKHBhdHRlcm4gJiYgbGFiZWwpIHtcbiAgICAgIG9zID0gb3MucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgbGFiZWwpO1xuICAgIH1cblxuICAgIG9zID0gZm9ybWF0KFxuICAgICAgb3MucmVwbGFjZSgvIGNlJC9pLCAnIENFJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYmhwdy9pLCAnd2ViJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hY2ludG9zaFxcYi8sICdNYWMgT1MnKVxuICAgICAgICAucmVwbGFjZSgvX1Bvd2VyUENcXGIvaSwgJyBPUycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoT1MgWCkgW14gXFxkXSsvaSwgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYk1hYyAoT1MgWClcXGIvLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFwvKFxcZCkvLCAnICQxJylcbiAgICAgICAgLnJlcGxhY2UoL18vZywgJy4nKVxuICAgICAgICAucmVwbGFjZSgvKD86IEJlUEN8WyAuXSpmY1sgXFxkLl0rKSQvaSwgJycpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJ4ODZcXC42NFxcYi9naSwgJ3g4Nl82NCcpXG4gICAgICAgIC5yZXBsYWNlKC9cXGIoV2luZG93cyBQaG9uZSkgT1NcXGIvLCAnJDEnKVxuICAgICAgICAuc3BsaXQoJyBvbiAnKVswXVxuICAgICk7XG5cbiAgICByZXR1cm4gb3M7XG4gIH1cblxuICAvKipcbiAgICogQW4gaXRlcmF0aW9uIHV0aWxpdHkgZm9yIGFycmF5cyBhbmQgb2JqZWN0cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gZWFjaChvYmplY3QsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG9iamVjdCA/IG9iamVjdC5sZW5ndGggOiAwO1xuXG4gICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID4gLTEgJiYgbGVuZ3RoIDw9IG1heFNhZmVJbnRlZ2VyKSB7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBjYWxsYmFjayhvYmplY3RbaW5kZXhdLCBpbmRleCwgb2JqZWN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yT3duKG9iamVjdCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmltIGFuZCBjb25kaXRpb25hbGx5IGNhcGl0YWxpemUgc3RyaW5nIHZhbHVlcy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGZvcm1hdC5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGZvcm1hdHRlZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBmb3JtYXQoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gdHJpbShzdHJpbmcpO1xuICAgIHJldHVybiAvXig/OndlYk9TfGkoPzpPU3xQKSkvLnRlc3Qoc3RyaW5nKVxuICAgICAgPyBzdHJpbmdcbiAgICAgIDogY2FwaXRhbGl6ZShzdHJpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMsIGV4ZWN1dGluZyB0aGUgYGNhbGxiYWNrYCBmb3IgZWFjaC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIGV4ZWN1dGVkIHBlciBvd24gcHJvcGVydHkuXG4gICAqL1xuICBmdW5jdGlvbiBmb3JPd24ob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgICBjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5LCBvYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBpbnRlcm5hbCBgW1tDbGFzc11dYCBvZiBhIHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGBbW0NsYXNzXV1gLlxuICAgKi9cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NPZih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PSBudWxsXG4gICAgICA/IGNhcGl0YWxpemUodmFsdWUpXG4gICAgICA6IHRvU3RyaW5nLmNhbGwodmFsdWUpLnNsaWNlKDgsIC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIb3N0IG9iamVjdHMgY2FuIHJldHVybiB0eXBlIHZhbHVlcyB0aGF0IGFyZSBkaWZmZXJlbnQgZnJvbSB0aGVpciBhY3R1YWxcbiAgICogZGF0YSB0eXBlLiBUaGUgb2JqZWN0cyB3ZSBhcmUgY29uY2VybmVkIHdpdGggdXN1YWxseSByZXR1cm4gbm9uLXByaW1pdGl2ZVxuICAgKiB0eXBlcyBvZiBcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCIsIG9yIFwidW5rbm93blwiLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgb3duZXIgb2YgdGhlIHByb3BlcnR5LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHByb3BlcnR5IHZhbHVlIGlzIGEgbm9uLXByaW1pdGl2ZSwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gaXNIb3N0VHlwZShvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgdmFyIHR5cGUgPSBvYmplY3QgIT0gbnVsbCA/IHR5cGVvZiBvYmplY3RbcHJvcGVydHldIDogJ251bWJlcic7XG4gICAgcmV0dXJuICEvXig/OmJvb2xlYW58bnVtYmVyfHN0cmluZ3x1bmRlZmluZWQpJC8udGVzdCh0eXBlKSAmJlxuICAgICAgKHR5cGUgPT0gJ29iamVjdCcgPyAhIW9iamVjdFtwcm9wZXJ0eV0gOiB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmVwYXJlcyBhIHN0cmluZyBmb3IgdXNlIGluIGEgYFJlZ0V4cGAgYnkgbWFraW5nIGh5cGhlbnMgYW5kIHNwYWNlcyBvcHRpb25hbC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHF1YWxpZnkuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBxdWFsaWZpZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gcXVhbGlmeShzdHJpbmcpIHtcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvKFsgLV0pKD8hJCkvZywgJyQxPycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgYmFyZS1ib25lcyBgQXJyYXkjcmVkdWNlYCBsaWtlIHV0aWxpdHkgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMgeyp9IFRoZSBhY2N1bXVsYXRlZCByZXN1bHQuXG4gICAqL1xuICBmdW5jdGlvbiByZWR1Y2UoYXJyYXksIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFjY3VtdWxhdG9yID0gbnVsbDtcbiAgICBlYWNoKGFycmF5LCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgYXJyYXkpO1xuICAgIH0pO1xuICAgIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UgZnJvbSBhIHN0cmluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIHRyaW0uXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0cmltbWVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHRyaW0oc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoL14gK3wgKyQvZywgJycpO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgcGxhdGZvcm0gb2JqZWN0LlxuICAgKlxuICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBbdWE9bmF2aWdhdG9yLnVzZXJBZ2VudF0gVGhlIHVzZXIgYWdlbnQgc3RyaW5nIG9yXG4gICAqICBjb250ZXh0IG9iamVjdC5cbiAgICogQHJldHVybnMge09iamVjdH0gQSBwbGF0Zm9ybSBvYmplY3QuXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZSh1YSkge1xuXG4gICAgLyoqIFRoZSBlbnZpcm9ubWVudCBjb250ZXh0IG9iamVjdCAqL1xuICAgIHZhciBjb250ZXh0ID0gcm9vdDtcblxuICAgIC8qKiBVc2VkIHRvIGZsYWcgd2hlbiBhIGN1c3RvbSBjb250ZXh0IGlzIHByb3ZpZGVkICovXG4gICAgdmFyIGlzQ3VzdG9tQ29udGV4dCA9IHVhICYmIHR5cGVvZiB1YSA9PSAnb2JqZWN0JyAmJiBnZXRDbGFzc09mKHVhKSAhPSAnU3RyaW5nJztcblxuICAgIC8vIGp1Z2dsZSBhcmd1bWVudHNcbiAgICBpZiAoaXNDdXN0b21Db250ZXh0KSB7XG4gICAgICBjb250ZXh0ID0gdWE7XG4gICAgICB1YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqIEJyb3dzZXIgbmF2aWdhdG9yIG9iamVjdCAqL1xuICAgIHZhciBuYXYgPSBjb250ZXh0Lm5hdmlnYXRvciB8fCB7fTtcblxuICAgIC8qKiBCcm93c2VyIHVzZXIgYWdlbnQgc3RyaW5nICovXG4gICAgdmFyIHVzZXJBZ2VudCA9IG5hdi51c2VyQWdlbnQgfHwgJyc7XG5cbiAgICB1YSB8fCAodWEgPSB1c2VyQWdlbnQpO1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGB0aGlzQmluZGluZ2AgaXMgdGhlIFtNb2R1bGVTY29wZV0gKi9cbiAgICB2YXIgaXNNb2R1bGVTY29wZSA9IGlzQ3VzdG9tQ29udGV4dCB8fCB0aGlzQmluZGluZyA9PSBvbGRSb290O1xuXG4gICAgLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGJyb3dzZXIgaXMgbGlrZSBDaHJvbWUgKi9cbiAgICB2YXIgbGlrZUNocm9tZSA9IGlzQ3VzdG9tQ29udGV4dFxuICAgICAgPyAhIW5hdi5saWtlQ2hyb21lXG4gICAgICA6IC9cXGJDaHJvbWVcXGIvLnRlc3QodWEpICYmICEvaW50ZXJuYWx8XFxuL2kudGVzdCh0b1N0cmluZy50b1N0cmluZygpKTtcblxuICAgIC8qKiBJbnRlcm5hbCBgW1tDbGFzc11dYCB2YWx1ZSBzaG9ydGN1dHMgKi9cbiAgICB2YXIgb2JqZWN0Q2xhc3MgPSAnT2JqZWN0JyxcbiAgICAgICAgYWlyUnVudGltZUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnU2NyaXB0QnJpZGdpbmdQcm94eU9iamVjdCcsXG4gICAgICAgIGVudmlyb0NsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnRW52aXJvbm1lbnQnLFxuICAgICAgICBqYXZhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIGNvbnRleHQuamF2YSkgPyAnSmF2YVBhY2thZ2UnIDogZ2V0Q2xhc3NPZihjb250ZXh0LmphdmEpLFxuICAgICAgICBwaGFudG9tQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdSdW50aW1lT2JqZWN0JztcblxuICAgIC8qKiBEZXRlY3QgSmF2YSBlbnZpcm9ubWVudCAqL1xuICAgIHZhciBqYXZhID0gL1xcYkphdmEvLnRlc3QoamF2YUNsYXNzKSAmJiBjb250ZXh0LmphdmE7XG5cbiAgICAvKiogRGV0ZWN0IFJoaW5vICovXG4gICAgdmFyIHJoaW5vID0gamF2YSAmJiBnZXRDbGFzc09mKGNvbnRleHQuZW52aXJvbm1lbnQpID09IGVudmlyb0NsYXNzO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBhbHBoYSAqL1xuICAgIHZhciBhbHBoYSA9IGphdmEgPyAnYScgOiAnXFx1MDNiMSc7XG5cbiAgICAvKiogQSBjaGFyYWN0ZXIgdG8gcmVwcmVzZW50IGJldGEgKi9cbiAgICB2YXIgYmV0YSA9IGphdmEgPyAnYicgOiAnXFx1MDNiMic7XG5cbiAgICAvKiogQnJvd3NlciBkb2N1bWVudCBvYmplY3QgKi9cbiAgICB2YXIgZG9jID0gY29udGV4dC5kb2N1bWVudCB8fCB7fTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBPcGVyYSBicm93c2VyIChQcmVzdG8tYmFzZWQpXG4gICAgICogaHR0cDovL3d3dy5ob3d0b2NyZWF0ZS5jby51ay9vcGVyYVN0dWZmL29wZXJhT2JqZWN0Lmh0bWxcbiAgICAgKiBodHRwOi8vZGV2Lm9wZXJhLmNvbS9hcnRpY2xlcy92aWV3L29wZXJhLW1pbmktd2ViLWNvbnRlbnQtYXV0aG9yaW5nLWd1aWRlbGluZXMvI29wZXJhbWluaVxuICAgICAqL1xuICAgIHZhciBvcGVyYSA9IGNvbnRleHQub3BlcmFtaW5pIHx8IGNvbnRleHQub3BlcmE7XG5cbiAgICAvKiogT3BlcmEgYFtbQ2xhc3NdXWAgKi9cbiAgICB2YXIgb3BlcmFDbGFzcyA9IHJlT3BlcmEudGVzdChvcGVyYUNsYXNzID0gKGlzQ3VzdG9tQ29udGV4dCAmJiBvcGVyYSkgPyBvcGVyYVsnW1tDbGFzc11dJ10gOiBnZXRDbGFzc09mKG9wZXJhKSlcbiAgICAgID8gb3BlcmFDbGFzc1xuICAgICAgOiAob3BlcmEgPSBudWxsKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKiBUZW1wb3JhcnkgdmFyaWFibGUgdXNlZCBvdmVyIHRoZSBzY3JpcHQncyBsaWZldGltZSAqL1xuICAgIHZhciBkYXRhO1xuXG4gICAgLyoqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlICovXG4gICAgdmFyIGFyY2ggPSB1YTtcblxuICAgIC8qKiBQbGF0Zm9ybSBkZXNjcmlwdGlvbiBhcnJheSAqL1xuICAgIHZhciBkZXNjcmlwdGlvbiA9IFtdO1xuXG4gICAgLyoqIFBsYXRmb3JtIGFscGhhL2JldGEgaW5kaWNhdG9yICovXG4gICAgdmFyIHByZXJlbGVhc2UgPSBudWxsO1xuXG4gICAgLyoqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGVudmlyb25tZW50IGZlYXR1cmVzIHNob3VsZCBiZSB1c2VkIHRvIHJlc29sdmUgdGhlIHBsYXRmb3JtICovXG4gICAgdmFyIHVzZUZlYXR1cmVzID0gdWEgPT0gdXNlckFnZW50O1xuXG4gICAgLyoqIFRoZSBicm93c2VyL2Vudmlyb25tZW50IHZlcnNpb24gKi9cbiAgICB2YXIgdmVyc2lvbiA9IHVzZUZlYXR1cmVzICYmIG9wZXJhICYmIHR5cGVvZiBvcGVyYS52ZXJzaW9uID09ICdmdW5jdGlvbicgJiYgb3BlcmEudmVyc2lvbigpO1xuXG4gICAgLyoqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgT1MgZW5kcyB3aXRoIFwiLyBWZXJzaW9uXCIgKi9cbiAgICB2YXIgaXNTcGVjaWFsQ2FzZWRPUztcblxuICAgIC8qIERldGVjdGFibGUgbGF5b3V0IGVuZ2luZXMgKG9yZGVyIGlzIGltcG9ydGFudCkgKi9cbiAgICB2YXIgbGF5b3V0ID0gZ2V0TGF5b3V0KFtcbiAgICAgICdUcmlkZW50JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1dlYktpdCcsICdwYXR0ZXJuJzogJ0FwcGxlV2ViS2l0JyB9LFxuICAgICAgJ2lDYWInLFxuICAgICAgJ1ByZXN0bycsXG4gICAgICAnTmV0RnJvbnQnLFxuICAgICAgJ1Rhc21hbicsXG4gICAgICAnS0hUTUwnLFxuICAgICAgJ0dlY2tvJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBicm93c2VyIG5hbWVzIChvcmRlciBpcyBpbXBvcnRhbnQpICovXG4gICAgdmFyIG5hbWUgPSBnZXROYW1lKFtcbiAgICAgICdBZG9iZSBBSVInLFxuICAgICAgJ0Fyb3JhJyxcbiAgICAgICdBdmFudCBCcm93c2VyJyxcbiAgICAgICdCcmVhY2gnLFxuICAgICAgJ0NhbWlubycsXG4gICAgICAnRXBpcGhhbnknLFxuICAgICAgJ0Zlbm5lYycsXG4gICAgICAnRmxvY2snLFxuICAgICAgJ0dhbGVvbicsXG4gICAgICAnR3JlZW5Ccm93c2VyJyxcbiAgICAgICdpQ2FiJyxcbiAgICAgICdJY2V3ZWFzZWwnLFxuICAgICAgeyAnbGFiZWwnOiAnU1JXYXJlIElyb24nLCAncGF0dGVybic6ICdJcm9uJyB9LFxuICAgICAgJ0stTWVsZW9uJyxcbiAgICAgICdLb25xdWVyb3InLFxuICAgICAgJ0x1bmFzY2FwZScsXG4gICAgICAnTWF4dGhvbicsXG4gICAgICAnTWlkb3JpJyxcbiAgICAgICdOb29rIEJyb3dzZXInLFxuICAgICAgJ1BoYW50b21KUycsXG4gICAgICAnUmF2ZW4nLFxuICAgICAgJ1Jla29ucScsXG4gICAgICAnUm9ja01lbHQnLFxuICAgICAgJ1NlYU1vbmtleScsXG4gICAgICB7ICdsYWJlbCc6ICdTaWxrJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ1NsZWlwbmlyJyxcbiAgICAgICdTbGltQnJvd3NlcicsXG4gICAgICAnU3VucmlzZScsXG4gICAgICAnU3dpZnRmb3gnLFxuICAgICAgJ1dlYlBvc2l0aXZlJyxcbiAgICAgICdPcGVyYSBNaW5pJyxcbiAgICAgIHsgJ2xhYmVsJzogJ09wZXJhIE1pbmknLCAncGF0dGVybic6ICdPUGlPUycgfSxcbiAgICAgICdPcGVyYScsXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYScsICdwYXR0ZXJuJzogJ09QUicgfSxcbiAgICAgICdDaHJvbWUnLFxuICAgICAgeyAnbGFiZWwnOiAnQ2hyb21lIE1vYmlsZScsICdwYXR0ZXJuJzogJyg/OkNyaU9TfENyTW8pJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnRmlyZWZveCcsICdwYXR0ZXJuJzogJyg/OkZpcmVmb3h8TWluZWZpZWxkKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnSUVNb2JpbGUnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdJRScsICdwYXR0ZXJuJzogJ01TSUUnIH0sXG4gICAgICAnU2FmYXJpJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBwcm9kdWN0cyAob3JkZXIgaXMgaW1wb3J0YW50KSAqL1xuICAgIHZhciBwcm9kdWN0ID0gZ2V0UHJvZHVjdChbXG4gICAgICB7ICdsYWJlbCc6ICdCbGFja0JlcnJ5JywgJ3BhdHRlcm4nOiAnQkIxMCcgfSxcbiAgICAgICdCbGFja0JlcnJ5JyxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTJywgJ3BhdHRlcm4nOiAnR1QtSTkwMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzInLCAncGF0dGVybic6ICdHVC1JOTEwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTMycsICdwYXR0ZXJuJzogJ0dULUk5MzAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFM0JywgJ3BhdHRlcm4nOiAnR1QtSTk1MDAnIH0sXG4gICAgICAnR29vZ2xlIFRWJyxcbiAgICAgICdMdW1pYScsXG4gICAgICAnaVBhZCcsXG4gICAgICAnaVBvZCcsXG4gICAgICAnaVBob25lJyxcbiAgICAgICdLaW5kbGUnLFxuICAgICAgeyAnbGFiZWwnOiAnS2luZGxlIEZpcmUnLCAncGF0dGVybic6ICcoPzpDbG91ZDl8U2lsay1BY2NlbGVyYXRlZCknIH0sXG4gICAgICAnTm9vaycsXG4gICAgICAnUGxheUJvb2snLFxuICAgICAgJ1BsYXlTdGF0aW9uIDQnLFxuICAgICAgJ1BsYXlTdGF0aW9uIDMnLFxuICAgICAgJ1BsYXlTdGF0aW9uIFZpdGEnLFxuICAgICAgJ1RvdWNoUGFkJyxcbiAgICAgICdUcmFuc2Zvcm1lcicsXG4gICAgICB7ICdsYWJlbCc6ICdXaWkgVScsICdwYXR0ZXJuJzogJ1dpaVUnIH0sXG4gICAgICAnV2lpJyxcbiAgICAgICdYYm94IE9uZScsXG4gICAgICB7ICdsYWJlbCc6ICdYYm94IDM2MCcsICdwYXR0ZXJuJzogJ1hib3gnIH0sXG4gICAgICAnWG9vbSdcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgbWFudWZhY3R1cmVycyAqL1xuICAgIHZhciBtYW51ZmFjdHVyZXIgPSBnZXRNYW51ZmFjdHVyZXIoe1xuICAgICAgJ0FwcGxlJzogeyAnaVBhZCc6IDEsICdpUGhvbmUnOiAxLCAnaVBvZCc6IDEgfSxcbiAgICAgICdBbWF6b24nOiB7ICdLaW5kbGUnOiAxLCAnS2luZGxlIEZpcmUnOiAxIH0sXG4gICAgICAnQXN1cyc6IHsgJ1RyYW5zZm9ybWVyJzogMSB9LFxuICAgICAgJ0Jhcm5lcyAmIE5vYmxlJzogeyAnTm9vayc6IDEgfSxcbiAgICAgICdCbGFja0JlcnJ5JzogeyAnUGxheUJvb2snOiAxIH0sXG4gICAgICAnR29vZ2xlJzogeyAnR29vZ2xlIFRWJzogMSB9LFxuICAgICAgJ0hQJzogeyAnVG91Y2hQYWQnOiAxIH0sXG4gICAgICAnSFRDJzoge30sXG4gICAgICAnTEcnOiB7fSxcbiAgICAgICdNaWNyb3NvZnQnOiB7ICdYYm94JzogMSwgJ1hib3ggT25lJzogMSB9LFxuICAgICAgJ01vdG9yb2xhJzogeyAnWG9vbSc6IDEgfSxcbiAgICAgICdOaW50ZW5kbyc6IHsgJ1dpaSBVJzogMSwgICdXaWknOiAxIH0sXG4gICAgICAnTm9raWEnOiB7ICdMdW1pYSc6IDEgfSxcbiAgICAgICdTYW1zdW5nJzogeyAnR2FsYXh5IFMnOiAxLCAnR2FsYXh5IFMyJzogMSwgJ0dhbGF4eSBTMyc6IDEsICdHYWxheHkgUzQnOiAxIH0sXG4gICAgICAnU29ueSc6IHsgJ1BsYXlTdGF0aW9uIDQnOiAxLCAnUGxheVN0YXRpb24gMyc6IDEsICdQbGF5U3RhdGlvbiBWaXRhJzogMSB9XG4gICAgfSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIE9TZXMgKG9yZGVyIGlzIGltcG9ydGFudCkgKi9cbiAgICB2YXIgb3MgPSBnZXRPUyhbXG4gICAgICAnV2luZG93cyBQaG9uZSAnLFxuICAgICAgJ0FuZHJvaWQnLFxuICAgICAgJ0NlbnRPUycsXG4gICAgICAnRGViaWFuJyxcbiAgICAgICdGZWRvcmEnLFxuICAgICAgJ0ZyZWVCU0QnLFxuICAgICAgJ0dlbnRvbycsXG4gICAgICAnSGFpa3UnLFxuICAgICAgJ0t1YnVudHUnLFxuICAgICAgJ0xpbnV4IE1pbnQnLFxuICAgICAgJ1JlZCBIYXQnLFxuICAgICAgJ1N1U0UnLFxuICAgICAgJ1VidW50dScsXG4gICAgICAnWHVidW50dScsXG4gICAgICAnQ3lnd2luJyxcbiAgICAgICdTeW1iaWFuIE9TJyxcbiAgICAgICdocHdPUycsXG4gICAgICAnd2ViT1MgJyxcbiAgICAgICd3ZWJPUycsXG4gICAgICAnVGFibGV0IE9TJyxcbiAgICAgICdMaW51eCcsXG4gICAgICAnTWFjIE9TIFgnLFxuICAgICAgJ01hY2ludG9zaCcsXG4gICAgICAnTWFjJyxcbiAgICAgICdXaW5kb3dzIDk4OycsXG4gICAgICAnV2luZG93cyAnXG4gICAgXSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgbGF5b3V0IGVuZ2luZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBsYXlvdXQgZW5naW5lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldExheW91dChndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcbiAgICAgICAgICBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpXG4gICAgICAgICkgKyAnXFxcXGInLCAnaScpLmV4ZWModWEpICYmIChndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgbWFudWZhY3R1cmVyIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBvYmplY3Qgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBtYW51ZmFjdHVyZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TWFudWZhY3R1cmVyKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgICAgIC8vIGxvb2t1cCB0aGUgbWFudWZhY3R1cmVyIGJ5IHByb2R1Y3Qgb3Igc2NhbiB0aGUgVUEgZm9yIHRoZSBtYW51ZmFjdHVyZXJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCAoXG4gICAgICAgICAgdmFsdWVbcHJvZHVjdF0gfHxcbiAgICAgICAgICB2YWx1ZVswLypPcGVyYSA5LjI1IGZpeCovLCAvXlthLXpdKyg/OiArW2Etel0rXFxiKSovaS5leGVjKHByb2R1Y3QpXSB8fFxuICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcXVhbGlmeShrZXkpICsgJyg/OlxcXFxifFxcXFx3KlxcXFxkKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgKSAmJiBrZXk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgYnJvd3NlciBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIGJyb3dzZXIgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXROYW1lKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IFJlZ0V4cCgnXFxcXGInICsgKFxuICAgICAgICAgIGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcylcbiAgICAgICAgKSArICdcXFxcYicsICdpJykuZXhlYyh1YSkgJiYgKGd1ZXNzLmxhYmVsIHx8IGd1ZXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBPUyBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIE9TIG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0T1MoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKTtcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgKHJlc3VsdCA9XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcoPzovW1xcXFxkLl0rfFsgXFxcXHcuXSopJywgJ2knKS5leGVjKHVhKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgIHJlc3VsdCA9IGNsZWFudXBPUyhyZXN1bHQsIHBhdHRlcm4sIGd1ZXNzLmxhYmVsIHx8IGd1ZXNzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIHByb2R1Y3QgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBwcm9kdWN0IG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0UHJvZHVjdChndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpO1xuICAgICAgICBpZiAoIXJlc3VsdCAmJiAocmVzdWx0ID1cbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyAqXFxcXGQrWy5cXFxcd19dKicsICdpJykuZXhlYyh1YSkgfHxcbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/OjsgKig/OlthLXpdK1tfLV0pP1thLXpdK1xcXFxkK3xbXiAoKTstXSopJywgJ2knKS5leGVjKHVhKVxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgIC8vIHNwbGl0IGJ5IGZvcndhcmQgc2xhc2ggYW5kIGFwcGVuZCBwcm9kdWN0IHZlcnNpb24gaWYgbmVlZGVkXG4gICAgICAgICAgaWYgKChyZXN1bHQgPSBTdHJpbmcoKGd1ZXNzLmxhYmVsICYmICFSZWdFeHAocGF0dGVybiwgJ2knKS50ZXN0KGd1ZXNzLmxhYmVsKSkgPyBndWVzcy5sYWJlbCA6IHJlc3VsdCkuc3BsaXQoJy8nKSlbMV0gJiYgIS9bXFxkLl0rLy50ZXN0KHJlc3VsdFswXSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFswXSArPSAnICcgKyByZXN1bHRbMV07XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGNvcnJlY3QgY2hhcmFjdGVyIGNhc2UgYW5kIGNsZWFudXBcbiAgICAgICAgICBndWVzcyA9IGd1ZXNzLmxhYmVsIHx8IGd1ZXNzO1xuICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdChyZXN1bHRbMF1cbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cChwYXR0ZXJuLCAnaScpLCBndWVzcylcbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cCgnOyAqKD86JyArIGd1ZXNzICsgJ1tfLV0pPycsICdpJyksICcgJylcbiAgICAgICAgICAgIC5yZXBsYWNlKFJlZ0V4cCgnKCcgKyBndWVzcyArICcpWy1fLl0/KFxcXFx3KScsICdpJyksICckMSAkMicpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIHZlcnNpb24gdXNpbmcgYW4gYXJyYXkgb2YgVUEgcGF0dGVybnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhdHRlcm5zIEFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIHZlcnNpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0VmVyc2lvbihwYXR0ZXJucykge1xuICAgICAgcmV0dXJuIHJlZHVjZShwYXR0ZXJucywgZnVuY3Rpb24ocmVzdWx0LCBwYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgKFJlZ0V4cChwYXR0ZXJuICtcbiAgICAgICAgICAnKD86LVtcXFxcZC5dKy98KD86IGZvciBbXFxcXHctXSspP1sgLy1dKShbXFxcXGQuXStbXiAoKTsvXy1dKiknLCAnaScpLmV4ZWModWEpIHx8IDApWzFdIHx8IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGBwbGF0Zm9ybS5kZXNjcmlwdGlvbmAgd2hlbiB0aGUgcGxhdGZvcm0gb2JqZWN0IGlzIGNvZXJjZWQgdG8gYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAbmFtZSB0b1N0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgYHBsYXRmb3JtLmRlc2NyaXB0aW9uYCBpZiBhdmFpbGFibGUsIGVsc2UgYW4gZW1wdHkgc3RyaW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvU3RyaW5nUGxhdGZvcm0oKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbiB8fCAnJztcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBjb252ZXJ0IGxheW91dCB0byBhbiBhcnJheSBzbyB3ZSBjYW4gYWRkIGV4dHJhIGRldGFpbHNcbiAgICBsYXlvdXQgJiYgKGxheW91dCA9IFtsYXlvdXRdKTtcblxuICAgIC8vIGRldGVjdCBwcm9kdWN0IG5hbWVzIHRoYXQgY29udGFpbiB0aGVpciBtYW51ZmFjdHVyZXIncyBuYW1lXG4gICAgaWYgKG1hbnVmYWN0dXJlciAmJiAhcHJvZHVjdCkge1xuICAgICAgcHJvZHVjdCA9IGdldFByb2R1Y3QoW21hbnVmYWN0dXJlcl0pO1xuICAgIH1cbiAgICAvLyBjbGVhbiB1cCBHb29nbGUgVFZcbiAgICBpZiAoKGRhdGEgPSAvXFxiR29vZ2xlIFRWXFxiLy5leGVjKHByb2R1Y3QpKSkge1xuICAgICAgcHJvZHVjdCA9IGRhdGFbMF07XG4gICAgfVxuICAgIC8vIGRldGVjdCBzaW11bGF0b3JzXG4gICAgaWYgKC9cXGJTaW11bGF0b3JcXGIvaS50ZXN0KHVhKSkge1xuICAgICAgcHJvZHVjdCA9IChwcm9kdWN0ID8gcHJvZHVjdCArICcgJyA6ICcnKSArICdTaW11bGF0b3InO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgT3BlcmEgTWluaSA4KyBydW5uaW5nIGluIFR1cmJvL1VuY29tcHJlc3NlZCBtb2RlIG9uIGlPU1xuICAgIGlmIChuYW1lID09ICdPcGVyYSBNaW5pJyAmJiAvXFxiT1BpT1NcXGIvLnRlc3QodWEpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdydW5uaW5nIGluIFR1cmJvL1VuY29tcHJlc3NlZCBtb2RlJyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBpT1NcbiAgICBpZiAoL15pUC8udGVzdChwcm9kdWN0KSkge1xuICAgICAgbmFtZSB8fCAobmFtZSA9ICdTYWZhcmknKTtcbiAgICAgIG9zID0gJ2lPUycgKyAoKGRhdGEgPSAvIE9TIChbXFxkX10rKS9pLmV4ZWModWEpKVxuICAgICAgICA/ICcgJyArIGRhdGFbMV0ucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgICAgIDogJycpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgS3VidW50dVxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0tvbnF1ZXJvcicgJiYgIS9idW50dS9pLnRlc3Qob3MpKSB7XG4gICAgICBvcyA9ICdLdWJ1bnR1JztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IEFuZHJvaWQgYnJvd3NlcnNcbiAgICBlbHNlIGlmIChtYW51ZmFjdHVyZXIgJiYgbWFudWZhY3R1cmVyICE9ICdHb29nbGUnICYmXG4gICAgICAgICgoL0Nocm9tZS8udGVzdChuYW1lKSAmJiAhL1xcYk1vYmlsZSBTYWZhcmlcXGIvaS50ZXN0KHVhKSkgfHwgL1xcYlZpdGFcXGIvLnRlc3QocHJvZHVjdCkpKSB7XG4gICAgICBuYW1lID0gJ0FuZHJvaWQgQnJvd3Nlcic7XG4gICAgICBvcyA9IC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSA/IG9zIDogJ0FuZHJvaWQnO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgZmFsc2UgcG9zaXRpdmVzIGZvciBGaXJlZm94L1NhZmFyaVxuICAgIGVsc2UgaWYgKCFuYW1lIHx8IChkYXRhID0gIS9cXGJNaW5lZmllbGRcXGJ8XFwoQW5kcm9pZDsvaS50ZXN0KHVhKSAmJiAvXFxiKD86RmlyZWZveHxTYWZhcmkpXFxiLy5leGVjKG5hbWUpKSkge1xuICAgICAgLy8gZXNjYXBlIHRoZSBgL2AgZm9yIEZpcmVmb3ggMVxuICAgICAgaWYgKG5hbWUgJiYgIXByb2R1Y3QgJiYgL1tcXC8sXXxeW14oXSs/XFwpLy50ZXN0KHVhLnNsaWNlKHVhLmluZGV4T2YoZGF0YSArICcvJykgKyA4KSkpIHtcbiAgICAgICAgLy8gY2xlYXIgbmFtZSBvZiBmYWxzZSBwb3NpdGl2ZXNcbiAgICAgICAgbmFtZSA9IG51bGw7XG4gICAgICB9XG4gICAgICAvLyByZWFzc2lnbiBhIGdlbmVyaWMgbmFtZVxuICAgICAgaWYgKChkYXRhID0gcHJvZHVjdCB8fCBtYW51ZmFjdHVyZXIgfHwgb3MpICYmXG4gICAgICAgICAgKHByb2R1Y3QgfHwgbWFudWZhY3R1cmVyIHx8IC9cXGIoPzpBbmRyb2lkfFN5bWJpYW4gT1N8VGFibGV0IE9TfHdlYk9TKVxcYi8udGVzdChvcykpKSB7XG4gICAgICAgIG5hbWUgPSAvW2Etel0rKD86IEhhdCk/L2kuZXhlYygvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgPyBvcyA6IGRhdGEpICsgJyBCcm93c2VyJztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZGV0ZWN0IEZpcmVmb3ggT1NcbiAgICBpZiAoKGRhdGEgPSAvXFwoKE1vYmlsZXxUYWJsZXQpLio/RmlyZWZveFxcYi9pLmV4ZWModWEpKSAmJiBkYXRhWzFdKSB7XG4gICAgICBvcyA9ICdGaXJlZm94IE9TJztcbiAgICAgIGlmICghcHJvZHVjdCkge1xuICAgICAgICBwcm9kdWN0ID0gZGF0YVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZGV0ZWN0IG5vbi1PcGVyYSB2ZXJzaW9ucyAob3JkZXIgaXMgaW1wb3J0YW50KVxuICAgIGlmICghdmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IGdldFZlcnNpb24oW1xuICAgICAgICAnKD86Q2xvdWQ5fENyaU9TfENyTW98SUVNb2JpbGV8SXJvbnxPcGVyYSA/TWluaXxPUGlPU3xPUFJ8UmF2ZW58U2lsayg/IS9bXFxcXGQuXSskKSknLFxuICAgICAgICAnVmVyc2lvbicsXG4gICAgICAgIHF1YWxpZnkobmFtZSksXG4gICAgICAgICcoPzpGaXJlZm94fE1pbmVmaWVsZHxOZXRGcm9udCknXG4gICAgICBdKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IHN0dWJib3JuIGxheW91dCBlbmdpbmVzXG4gICAgaWYgKGxheW91dCA9PSAnaUNhYicgJiYgcGFyc2VGbG9hdCh2ZXJzaW9uKSA+IDMpIHtcbiAgICAgIGxheW91dCA9IFsnV2ViS2l0J107XG4gICAgfSBlbHNlIGlmIChcbiAgICAgICAgbGF5b3V0ICE9ICdUcmlkZW50JyAmJlxuICAgICAgICAoZGF0YSA9XG4gICAgICAgICAgL1xcYk9wZXJhXFxiLy50ZXN0KG5hbWUpICYmICgvXFxiT1BSXFxiLy50ZXN0KHVhKSA/ICdCbGluaycgOiAnUHJlc3RvJykgfHxcbiAgICAgICAgICAvXFxiKD86TWlkb3JpfE5vb2t8U2FmYXJpKVxcYi9pLnRlc3QodWEpICYmICdXZWJLaXQnIHx8XG4gICAgICAgICAgIWxheW91dCAmJiAvXFxiTVNJRVxcYi9pLnRlc3QodWEpICYmIChvcyA9PSAnTWFjIE9TJyA/ICdUYXNtYW4nIDogJ1RyaWRlbnQnKVxuICAgICAgICApXG4gICAgKSB7XG4gICAgICBsYXlvdXQgPSBbZGF0YV07XG4gICAgfVxuICAgIC8vIGRldGVjdCBOZXRGcm9udCBvbiBQbGF5U3RhdGlvblxuICAgIGVsc2UgaWYgKC9cXGJQbGF5U3RhdGlvblxcYig/ISBWaXRhXFxiKS9pLnRlc3QobmFtZSkgJiYgbGF5b3V0ID09ICdXZWJLaXQnKSB7XG4gICAgICBsYXlvdXQgPSBbJ05ldEZyb250J107XG4gICAgfVxuICAgIC8vIGRldGVjdCBXaW5kb3dzIFBob25lIDcgZGVza3RvcCBtb2RlXG4gICAgaWYgKG5hbWUgPT0gJ0lFJyAmJiAoZGF0YSA9ICgvOyAqKD86WEJMV1B8WnVuZVdQKShcXGQrKS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lICcgKyAoL1xcKyQvLnRlc3QoZGF0YSkgPyBkYXRhIDogZGF0YSArICcueCcpO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBXaW5kb3dzIFBob25lIDgrIGRlc2t0b3AgbW9kZVxuICAgIGVsc2UgaWYgKC9cXGJXUERlc2t0b3BcXGIvaS50ZXN0KHVhKSkge1xuICAgICAgbmFtZSA9ICdJRSBNb2JpbGUnO1xuICAgICAgb3MgPSAnV2luZG93cyBQaG9uZSA4Kyc7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIHZlcnNpb24gfHwgKHZlcnNpb24gPSAoL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkgfHwgMClbMV0pO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgSUUgMTEgYW5kIGFib3ZlXG4gICAgZWxzZSBpZiAobmFtZSAhPSAnSUUnICYmIGxheW91dCA9PSAnVHJpZGVudCcgJiYgKGRhdGEgPSAvXFxicnY6KFtcXGQuXSspLy5leGVjKHVhKSkpIHtcbiAgICAgIGlmICghL1xcYldQRGVza3RvcFxcYi9pLnRlc3QodWEpKSB7XG4gICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnaWRlbnRpZnlpbmcgYXMgJyArIG5hbWUgKyAodmVyc2lvbiA/ICcgJyArIHZlcnNpb24gOiAnJykpO1xuICAgICAgICB9XG4gICAgICAgIG5hbWUgPSAnSUUnO1xuICAgICAgfVxuICAgICAgdmVyc2lvbiA9IGRhdGFbMV07XG4gICAgfVxuICAgIC8vIGRldGVjdCBNaWNyb3NvZnQgRWRnZVxuICAgIGVsc2UgaWYgKChuYW1lID09ICdDaHJvbWUnIHx8IG5hbWUgIT0gJ0lFJykgJiYgKGRhdGEgPSAvXFxiRWRnZVxcLyhbXFxkLl0rKS8uZXhlYyh1YSkpKSB7XG4gICAgICBuYW1lID0gJ01pY3Jvc29mdCBFZGdlJztcbiAgICAgIHZlcnNpb24gPSBkYXRhWzFdO1xuICAgICAgbGF5b3V0ID0gWydUcmlkZW50J107XG4gICAgfVxuICAgIC8vIGxldmVyYWdlIGVudmlyb25tZW50IGZlYXR1cmVzXG4gICAgaWYgKHVzZUZlYXR1cmVzKSB7XG4gICAgICAvLyBkZXRlY3Qgc2VydmVyLXNpZGUgZW52aXJvbm1lbnRzXG4gICAgICAvLyBSaGlubyBoYXMgYSBnbG9iYWwgZnVuY3Rpb24gd2hpbGUgb3RoZXJzIGhhdmUgYSBnbG9iYWwgb2JqZWN0XG4gICAgICBpZiAoaXNIb3N0VHlwZShjb250ZXh0LCAnZ2xvYmFsJykpIHtcbiAgICAgICAgaWYgKGphdmEpIHtcbiAgICAgICAgICBkYXRhID0gamF2YS5sYW5nLlN5c3RlbTtcbiAgICAgICAgICBhcmNoID0gZGF0YS5nZXRQcm9wZXJ0eSgnb3MuYXJjaCcpO1xuICAgICAgICAgIG9zID0gb3MgfHwgZGF0YS5nZXRQcm9wZXJ0eSgnb3MubmFtZScpICsgJyAnICsgZGF0YS5nZXRQcm9wZXJ0eSgnb3MudmVyc2lvbicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc01vZHVsZVNjb3BlICYmIGlzSG9zdFR5cGUoY29udGV4dCwgJ3N5c3RlbScpICYmIChkYXRhID0gW2NvbnRleHQuc3lzdGVtXSlbMF0pIHtcbiAgICAgICAgICBvcyB8fCAob3MgPSBkYXRhWzBdLm9zIHx8IG51bGwpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkYXRhWzFdID0gY29udGV4dC5yZXF1aXJlKCdyaW5nby9lbmdpbmUnKS52ZXJzaW9uO1xuICAgICAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uam9pbignLicpO1xuICAgICAgICAgICAgbmFtZSA9ICdSaW5nb0pTJztcbiAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGlmIChkYXRhWzBdLmdsb2JhbC5zeXN0ZW0gPT0gY29udGV4dC5zeXN0ZW0pIHtcbiAgICAgICAgICAgICAgbmFtZSA9ICdOYXJ3aGFsJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNvbnRleHQucHJvY2VzcyA9PSAnb2JqZWN0JyAmJiAoZGF0YSA9IGNvbnRleHQucHJvY2VzcykpIHtcbiAgICAgICAgICBuYW1lID0gJ05vZGUuanMnO1xuICAgICAgICAgIGFyY2ggPSBkYXRhLmFyY2g7XG4gICAgICAgICAgb3MgPSBkYXRhLnBsYXRmb3JtO1xuICAgICAgICAgIHZlcnNpb24gPSAvW1xcZC5dKy8uZXhlYyhkYXRhLnZlcnNpb24pWzBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJoaW5vKSB7XG4gICAgICAgICAgbmFtZSA9ICdSaGlubyc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGRldGVjdCBBZG9iZSBBSVJcbiAgICAgIGVsc2UgaWYgKGdldENsYXNzT2YoKGRhdGEgPSBjb250ZXh0LnJ1bnRpbWUpKSA9PSBhaXJSdW50aW1lQ2xhc3MpIHtcbiAgICAgICAgbmFtZSA9ICdBZG9iZSBBSVInO1xuICAgICAgICBvcyA9IGRhdGEuZmxhc2guc3lzdGVtLkNhcGFiaWxpdGllcy5vcztcbiAgICAgIH1cbiAgICAgIC8vIGRldGVjdCBQaGFudG9tSlNcbiAgICAgIGVsc2UgaWYgKGdldENsYXNzT2YoKGRhdGEgPSBjb250ZXh0LnBoYW50b20pKSA9PSBwaGFudG9tQ2xhc3MpIHtcbiAgICAgICAgbmFtZSA9ICdQaGFudG9tSlMnO1xuICAgICAgICB2ZXJzaW9uID0gKGRhdGEgPSBkYXRhLnZlcnNpb24gfHwgbnVsbCkgJiYgKGRhdGEubWFqb3IgKyAnLicgKyBkYXRhLm1pbm9yICsgJy4nICsgZGF0YS5wYXRjaCk7XG4gICAgICB9XG4gICAgICAvLyBkZXRlY3QgSUUgY29tcGF0aWJpbGl0eSBtb2Rlc1xuICAgICAgZWxzZSBpZiAodHlwZW9mIGRvYy5kb2N1bWVudE1vZGUgPT0gJ251bWJlcicgJiYgKGRhdGEgPSAvXFxiVHJpZGVudFxcLyhcXGQrKS9pLmV4ZWModWEpKSkge1xuICAgICAgICAvLyB3ZSdyZSBpbiBjb21wYXRpYmlsaXR5IG1vZGUgd2hlbiB0aGUgVHJpZGVudCB2ZXJzaW9uICsgNCBkb2Vzbid0XG4gICAgICAgIC8vIGVxdWFsIHRoZSBkb2N1bWVudCBtb2RlXG4gICAgICAgIHZlcnNpb24gPSBbdmVyc2lvbiwgZG9jLmRvY3VtZW50TW9kZV07XG4gICAgICAgIGlmICgoZGF0YSA9ICtkYXRhWzFdICsgNCkgIT0gdmVyc2lvblsxXSkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ0lFICcgKyB2ZXJzaW9uWzFdICsgJyBtb2RlJyk7XG4gICAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnJyk7XG4gICAgICAgICAgdmVyc2lvblsxXSA9IGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgdmVyc2lvbiA9IG5hbWUgPT0gJ0lFJyA/IFN0cmluZyh2ZXJzaW9uWzFdLnRvRml4ZWQoMSkpIDogdmVyc2lvblswXTtcbiAgICAgIH1cbiAgICAgIG9zID0gb3MgJiYgZm9ybWF0KG9zKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IHByZXJlbGVhc2UgcGhhc2VzXG4gICAgaWYgKHZlcnNpb24gJiYgKGRhdGEgPVxuICAgICAgICAgIC8oPzpbYWJdfGRwfHByZXxbYWJdXFxkK3ByZSkoPzpcXGQrXFwrPyk/JC9pLmV4ZWModmVyc2lvbikgfHxcbiAgICAgICAgICAvKD86YWxwaGF8YmV0YSkoPzogP1xcZCk/L2kuZXhlYyh1YSArICc7JyArICh1c2VGZWF0dXJlcyAmJiBuYXYuYXBwTWlub3JWZXJzaW9uKSkgfHxcbiAgICAgICAgICAvXFxiTWluZWZpZWxkXFxiL2kudGVzdCh1YSkgJiYgJ2EnXG4gICAgICAgICkpIHtcbiAgICAgIHByZXJlbGVhc2UgPSAvYi9pLnRlc3QoZGF0YSkgPyAnYmV0YScgOiAnYWxwaGEnO1xuICAgICAgdmVyc2lvbiA9IHZlcnNpb24ucmVwbGFjZShSZWdFeHAoZGF0YSArICdcXFxcKz8kJyksICcnKSArXG4gICAgICAgIChwcmVyZWxlYXNlID09ICdiZXRhJyA/IGJldGEgOiBhbHBoYSkgKyAoL1xcZCtcXCs/Ly5leGVjKGRhdGEpIHx8ICcnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IEZpcmVmb3ggTW9iaWxlXG4gICAgaWYgKG5hbWUgPT0gJ0Zlbm5lYycgfHwgbmFtZSA9PSAnRmlyZWZveCcgJiYgL1xcYig/OkFuZHJvaWR8RmlyZWZveCBPUylcXGIvLnRlc3Qob3MpKSB7XG4gICAgICBuYW1lID0gJ0ZpcmVmb3ggTW9iaWxlJztcbiAgICB9XG4gICAgLy8gb2JzY3VyZSBNYXh0aG9uJ3MgdW5yZWxpYWJsZSB2ZXJzaW9uXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnTWF4dGhvbicgJiYgdmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IHZlcnNpb24ucmVwbGFjZSgvXFwuW1xcZC5dKy8sICcueCcpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgU2lsayBkZXNrdG9wL2FjY2VsZXJhdGVkIG1vZGVzXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnU2lsaycpIHtcbiAgICAgIGlmICghL1xcYk1vYmkvaS50ZXN0KHVhKSkge1xuICAgICAgICBvcyA9ICdBbmRyb2lkJztcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICB9XG4gICAgICBpZiAoL0FjY2VsZXJhdGVkICo9ICp0cnVlL2kudGVzdCh1YSkpIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnYWNjZWxlcmF0ZWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZGV0ZWN0IFhib3ggMzYwIGFuZCBYYm94IE9uZVxuICAgIGVsc2UgaWYgKC9cXGJYYm94XFxiL2kudGVzdChwcm9kdWN0KSkge1xuICAgICAgb3MgPSBudWxsO1xuICAgICAgaWYgKHByb2R1Y3QgPT0gJ1hib3ggMzYwJyAmJiAvXFxiSUVNb2JpbGVcXGIvLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ21vYmlsZSBtb2RlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGFkZCBtb2JpbGUgcG9zdGZpeFxuICAgIGVsc2UgaWYgKCgvXig/OkNocm9tZXxJRXxPcGVyYSkkLy50ZXN0KG5hbWUpIHx8IG5hbWUgJiYgIXByb2R1Y3QgJiYgIS9Ccm93c2VyfE1vYmkvLnRlc3QobmFtZSkpICYmXG4gICAgICAgIChvcyA9PSAnV2luZG93cyBDRScgfHwgL01vYmkvaS50ZXN0KHVhKSkpIHtcbiAgICAgIG5hbWUgKz0gJyBNb2JpbGUnO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgSUUgcGxhdGZvcm0gcHJldmlld1xuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ0lFJyAmJiB1c2VGZWF0dXJlcyAmJiBjb250ZXh0LmV4dGVybmFsID09PSBudWxsKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdwbGF0Zm9ybSBwcmV2aWV3Jyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBCbGFja0JlcnJ5IE9TIHZlcnNpb25cbiAgICAvLyBodHRwOi8vZG9jcy5ibGFja2JlcnJ5LmNvbS9lbi9kZXZlbG9wZXJzL2RlbGl2ZXJhYmxlcy8xODE2OS9IVFRQX2hlYWRlcnNfc2VudF9ieV9CQl9Ccm93c2VyXzEyMzQ5MTFfMTEuanNwXG4gICAgZWxzZSBpZiAoKC9cXGJCbGFja0JlcnJ5XFxiLy50ZXN0KHByb2R1Y3QpIHx8IC9cXGJCQjEwXFxiLy50ZXN0KHVhKSkgJiYgKGRhdGEgPVxuICAgICAgICAgIChSZWdFeHAocHJvZHVjdC5yZXBsYWNlKC8gKy9nLCAnIConKSArICcvKFsuXFxcXGRdKyknLCAnaScpLmV4ZWModWEpIHx8IDApWzFdIHx8XG4gICAgICAgICAgdmVyc2lvblxuICAgICAgICApKSB7XG4gICAgICBkYXRhID0gW2RhdGEsIC9CQjEwLy50ZXN0KHVhKV07XG4gICAgICBvcyA9IChkYXRhWzFdID8gKHByb2R1Y3QgPSBudWxsLCBtYW51ZmFjdHVyZXIgPSAnQmxhY2tCZXJyeScpIDogJ0RldmljZSBTb2Z0d2FyZScpICsgJyAnICsgZGF0YVswXTtcbiAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgT3BlcmEgaWRlbnRpZnlpbmcvbWFza2luZyBpdHNlbGYgYXMgYW5vdGhlciBicm93c2VyXG4gICAgLy8gaHR0cDovL3d3dy5vcGVyYS5jb20vc3VwcG9ydC9rYi92aWV3Lzg0My9cbiAgICBlbHNlIGlmICh0aGlzICE9IGZvck93biAmJiAoXG4gICAgICAgICAgcHJvZHVjdCAhPSAnV2lpJyAmJiAoXG4gICAgICAgICAgICAodXNlRmVhdHVyZXMgJiYgb3BlcmEpIHx8XG4gICAgICAgICAgICAoL09wZXJhLy50ZXN0KG5hbWUpICYmIC9cXGIoPzpNU0lFfEZpcmVmb3gpXFxiL2kudGVzdCh1YSkpIHx8XG4gICAgICAgICAgICAobmFtZSA9PSAnRmlyZWZveCcgJiYgL1xcYk9TIFggKD86XFxkK1xcLil7Mix9Ly50ZXN0KG9zKSkgfHxcbiAgICAgICAgICAgIChuYW1lID09ICdJRScgJiYgKFxuICAgICAgICAgICAgICAob3MgJiYgIS9eV2luLy50ZXN0KG9zKSAmJiB2ZXJzaW9uID4gNS41KSB8fFxuICAgICAgICAgICAgICAvXFxiV2luZG93cyBYUFxcYi8udGVzdChvcykgJiYgdmVyc2lvbiA+IDggfHxcbiAgICAgICAgICAgICAgdmVyc2lvbiA9PSA4ICYmICEvXFxiVHJpZGVudFxcYi8udGVzdCh1YSlcbiAgICAgICAgICAgICkpXG4gICAgICAgICAgKVxuICAgICAgICApICYmICFyZU9wZXJhLnRlc3QoKGRhdGEgPSBwYXJzZS5jYWxsKGZvck93biwgdWEucmVwbGFjZShyZU9wZXJhLCAnJykgKyAnOycpKSkgJiYgZGF0YS5uYW1lKSB7XG5cbiAgICAgIC8vIHdoZW4gXCJpbmRlbnRpZnlpbmdcIiwgdGhlIFVBIGNvbnRhaW5zIGJvdGggT3BlcmEgYW5kIHRoZSBvdGhlciBicm93c2VyJ3MgbmFtZVxuICAgICAgZGF0YSA9ICdpbmcgYXMgJyArIGRhdGEubmFtZSArICgoZGF0YSA9IGRhdGEudmVyc2lvbikgPyAnICcgKyBkYXRhIDogJycpO1xuICAgICAgaWYgKHJlT3BlcmEudGVzdChuYW1lKSkge1xuICAgICAgICBpZiAoL1xcYklFXFxiLy50ZXN0KGRhdGEpICYmIG9zID09ICdNYWMgT1MnKSB7XG4gICAgICAgICAgb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEgPSAnaWRlbnRpZnknICsgZGF0YTtcbiAgICAgIH1cbiAgICAgIC8vIHdoZW4gXCJtYXNraW5nXCIsIHRoZSBVQSBjb250YWlucyBvbmx5IHRoZSBvdGhlciBicm93c2VyJ3MgbmFtZVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRhdGEgPSAnbWFzaycgKyBkYXRhO1xuICAgICAgICBpZiAob3BlcmFDbGFzcykge1xuICAgICAgICAgIG5hbWUgPSBmb3JtYXQob3BlcmFDbGFzcy5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmFtZSA9ICdPcGVyYSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9cXGJJRVxcYi8udGVzdChkYXRhKSkge1xuICAgICAgICAgIG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXVzZUZlYXR1cmVzKSB7XG4gICAgICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxheW91dCA9IFsnUHJlc3RvJ107XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKGRhdGEpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgV2ViS2l0IE5pZ2h0bHkgYW5kIGFwcHJveGltYXRlIENocm9tZS9TYWZhcmkgdmVyc2lvbnNcbiAgICBpZiAoKGRhdGEgPSAoL1xcYkFwcGxlV2ViS2l0XFwvKFtcXGQuXStcXCs/KS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgLy8gY29ycmVjdCBidWlsZCBmb3IgbnVtZXJpYyBjb21wYXJpc29uXG4gICAgICAvLyAoZS5nLiBcIjUzMi41XCIgYmVjb21lcyBcIjUzMi4wNVwiKVxuICAgICAgZGF0YSA9IFtwYXJzZUZsb2F0KGRhdGEucmVwbGFjZSgvXFwuKFxcZCkkLywgJy4wJDEnKSksIGRhdGFdO1xuICAgICAgLy8gbmlnaHRseSBidWlsZHMgYXJlIHBvc3RmaXhlZCB3aXRoIGEgYCtgXG4gICAgICBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiBkYXRhWzFdLnNsaWNlKC0xKSA9PSAnKycpIHtcbiAgICAgICAgbmFtZSA9ICdXZWJLaXQgTmlnaHRseSc7XG4gICAgICAgIHByZXJlbGVhc2UgPSAnYWxwaGEnO1xuICAgICAgICB2ZXJzaW9uID0gZGF0YVsxXS5zbGljZSgwLCAtMSk7XG4gICAgICB9XG4gICAgICAvLyBjbGVhciBpbmNvcnJlY3QgYnJvd3NlciB2ZXJzaW9uc1xuICAgICAgZWxzZSBpZiAodmVyc2lvbiA9PSBkYXRhWzFdIHx8XG4gICAgICAgICAgdmVyc2lvbiA9PSAoZGF0YVsyXSA9ICgvXFxiU2FmYXJpXFwvKFtcXGQuXStcXCs/KS9pLmV4ZWModWEpIHx8IDApWzFdKSkge1xuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIHVzZSB0aGUgZnVsbCBDaHJvbWUgdmVyc2lvbiB3aGVuIGF2YWlsYWJsZVxuICAgICAgZGF0YVsxXSA9ICgvXFxiQ2hyb21lXFwvKFtcXGQuXSspL2kuZXhlYyh1YSkgfHwgMClbMV07XG4gICAgICAvLyBkZXRlY3QgQmxpbmsgbGF5b3V0IGVuZ2luZVxuICAgICAgaWYgKGRhdGFbMF0gPT0gNTM3LjM2ICYmIGRhdGFbMl0gPT0gNTM3LjM2ICYmIHBhcnNlRmxvYXQoZGF0YVsxXSkgPj0gMjggJiYgbmFtZSAhPSAnSUUnICYmIG5hbWUgIT0gJ01pY3Jvc29mdCBFZGdlJykge1xuICAgICAgICBsYXlvdXQgPSBbJ0JsaW5rJ107XG4gICAgICB9XG4gICAgICAvLyBkZXRlY3QgSmF2YVNjcmlwdENvcmVcbiAgICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjc2ODQ3NC9ob3ctY2FuLWktZGV0ZWN0LXdoaWNoLWphdmFzY3JpcHQtZW5naW5lLXY4LW9yLWpzYy1pcy11c2VkLWF0LXJ1bnRpbWUtaW4tYW5kcm9pXG4gICAgICBpZiAoIXVzZUZlYXR1cmVzIHx8ICghbGlrZUNocm9tZSAmJiAhZGF0YVsxXSkpIHtcbiAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnbGlrZSBTYWZhcmknKTtcbiAgICAgICAgZGF0YSA9IChkYXRhID0gZGF0YVswXSwgZGF0YSA8IDQwMCA/IDEgOiBkYXRhIDwgNTAwID8gMiA6IGRhdGEgPCA1MjYgPyAzIDogZGF0YSA8IDUzMyA/IDQgOiBkYXRhIDwgNTM0ID8gJzQrJyA6IGRhdGEgPCA1MzUgPyA1IDogZGF0YSA8IDUzNyA/IDYgOiBkYXRhIDwgNTM4ID8gNyA6IGRhdGEgPCA2MDEgPyA4IDogJzgnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJ2xpa2UgQ2hyb21lJyk7XG4gICAgICAgIGRhdGEgPSBkYXRhWzFdIHx8IChkYXRhID0gZGF0YVswXSwgZGF0YSA8IDUzMCA/IDEgOiBkYXRhIDwgNTMyID8gMiA6IGRhdGEgPCA1MzIuMDUgPyAzIDogZGF0YSA8IDUzMyA/IDQgOiBkYXRhIDwgNTM0LjAzID8gNSA6IGRhdGEgPCA1MzQuMDcgPyA2IDogZGF0YSA8IDUzNC4xMCA/IDcgOiBkYXRhIDwgNTM0LjEzID8gOCA6IGRhdGEgPCA1MzQuMTYgPyA5IDogZGF0YSA8IDUzNC4yNCA/IDEwIDogZGF0YSA8IDUzNC4zMCA/IDExIDogZGF0YSA8IDUzNS4wMSA/IDEyIDogZGF0YSA8IDUzNS4wMiA/ICcxMysnIDogZGF0YSA8IDUzNS4wNyA/IDE1IDogZGF0YSA8IDUzNS4xMSA/IDE2IDogZGF0YSA8IDUzNS4xOSA/IDE3IDogZGF0YSA8IDUzNi4wNSA/IDE4IDogZGF0YSA8IDUzNi4xMCA/IDE5IDogZGF0YSA8IDUzNy4wMSA/IDIwIDogZGF0YSA8IDUzNy4xMSA/ICcyMSsnIDogZGF0YSA8IDUzNy4xMyA/IDIzIDogZGF0YSA8IDUzNy4xOCA/IDI0IDogZGF0YSA8IDUzNy4yNCA/IDI1IDogZGF0YSA8IDUzNy4zNiA/IDI2IDogbGF5b3V0ICE9ICdCbGluaycgPyAnMjcnIDogJzI4Jyk7XG4gICAgICB9XG4gICAgICAvLyBhZGQgdGhlIHBvc3RmaXggb2YgXCIueFwiIG9yIFwiK1wiIGZvciBhcHByb3hpbWF0ZSB2ZXJzaW9uc1xuICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gKz0gJyAnICsgKGRhdGEgKz0gdHlwZW9mIGRhdGEgPT0gJ251bWJlcicgPyAnLngnIDogL1suK10vLnRlc3QoZGF0YSkgPyAnJyA6ICcrJykpO1xuICAgICAgLy8gb2JzY3VyZSB2ZXJzaW9uIGZvciBzb21lIFNhZmFyaSAxLTIgcmVsZWFzZXNcbiAgICAgIGlmIChuYW1lID09ICdTYWZhcmknICYmICghdmVyc2lvbiB8fCBwYXJzZUludCh2ZXJzaW9uKSA+IDQ1KSkge1xuICAgICAgICB2ZXJzaW9uID0gZGF0YTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZGV0ZWN0IE9wZXJhIGRlc2t0b3AgbW9kZXNcbiAgICBpZiAobmFtZSA9PSAnT3BlcmEnICYmICAoZGF0YSA9IC9cXGJ6Ym92fHp2YXYkLy5leGVjKG9zKSkpIHtcbiAgICAgIG5hbWUgKz0gJyAnO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICBpZiAoZGF0YSA9PSAnenZhdicpIHtcbiAgICAgICAgbmFtZSArPSAnTWluaSc7XG4gICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmFtZSArPSAnTW9iaWxlJztcbiAgICAgIH1cbiAgICAgIG9zID0gb3MucmVwbGFjZShSZWdFeHAoJyAqJyArIGRhdGEgKyAnJCcpLCAnJyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBDaHJvbWUgZGVza3RvcCBtb2RlXG4gICAgZWxzZSBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiAvXFxiQ2hyb21lXFxiLy5leGVjKGxheW91dCAmJiBsYXlvdXRbMV0pKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIG5hbWUgPSAnQ2hyb21lIE1vYmlsZSc7XG4gICAgICB2ZXJzaW9uID0gbnVsbDtcblxuICAgICAgaWYgKC9cXGJPUyBYXFxiLy50ZXN0KG9zKSkge1xuICAgICAgICBtYW51ZmFjdHVyZXIgPSAnQXBwbGUnO1xuICAgICAgICBvcyA9ICdpT1MgNC4zKyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHN0cmlwIGluY29ycmVjdCBPUyB2ZXJzaW9uc1xuICAgIGlmICh2ZXJzaW9uICYmIHZlcnNpb24uaW5kZXhPZigoZGF0YSA9IC9bXFxkLl0rJC8uZXhlYyhvcykpKSA9PSAwICYmXG4gICAgICAgIHVhLmluZGV4T2YoJy8nICsgZGF0YSArICctJykgPiAtMSkge1xuICAgICAgb3MgPSB0cmltKG9zLnJlcGxhY2UoZGF0YSwgJycpKTtcbiAgICB9XG4gICAgLy8gYWRkIGxheW91dCBlbmdpbmVcbiAgICBpZiAobGF5b3V0ICYmICEvXFxiKD86QXZhbnR8Tm9vaylcXGIvLnRlc3QobmFtZSkgJiYgKFxuICAgICAgICAvQnJvd3NlcnxMdW5hc2NhcGV8TWF4dGhvbi8udGVzdChuYW1lKSB8fFxuICAgICAgICAvXig/OkFkb2JlfEFyb3JhfEJyZWFjaHxNaWRvcml8T3BlcmF8UGhhbnRvbXxSZWtvbnF8Um9ja3xTbGVpcG5pcnxXZWIpLy50ZXN0KG5hbWUpICYmIGxheW91dFsxXSkpIHtcbiAgICAgIC8vIGRvbid0IGFkZCBsYXlvdXQgZGV0YWlscyB0byBkZXNjcmlwdGlvbiBpZiB0aGV5IGFyZSBmYWxzZXlcbiAgICAgIChkYXRhID0gbGF5b3V0W2xheW91dC5sZW5ndGggLSAxXSkgJiYgZGVzY3JpcHRpb24ucHVzaChkYXRhKTtcbiAgICB9XG4gICAgLy8gY29tYmluZSBjb250ZXh0dWFsIGluZm9ybWF0aW9uXG4gICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aCkge1xuICAgICAgZGVzY3JpcHRpb24gPSBbJygnICsgZGVzY3JpcHRpb24uam9pbignOyAnKSArICcpJ107XG4gICAgfVxuICAgIC8vIGFwcGVuZCBtYW51ZmFjdHVyZXJcbiAgICBpZiAobWFudWZhY3R1cmVyICYmIHByb2R1Y3QgJiYgcHJvZHVjdC5pbmRleE9mKG1hbnVmYWN0dXJlcikgPCAwKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCdvbiAnICsgbWFudWZhY3R1cmVyKTtcbiAgICB9XG4gICAgLy8gYXBwZW5kIHByb2R1Y3RcbiAgICBpZiAocHJvZHVjdCkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgoL15vbiAvLnRlc3QoZGVzY3JpcHRpb25bZGVzY3JpcHRpb24ubGVuZ3RoIC0xXSkgPyAnJyA6ICdvbiAnKSArIHByb2R1Y3QpO1xuICAgIH1cbiAgICAvLyBwYXJzZSBPUyBpbnRvIGFuIG9iamVjdFxuICAgIGlmIChvcykge1xuICAgICAgZGF0YSA9IC8gKFtcXGQuK10rKSQvLmV4ZWMob3MpO1xuICAgICAgaXNTcGVjaWFsQ2FzZWRPUyA9IGRhdGEgJiYgb3MuY2hhckF0KG9zLmxlbmd0aCAtIGRhdGFbMF0ubGVuZ3RoIC0gMSkgPT0gJy8nO1xuICAgICAgb3MgPSB7XG4gICAgICAgICdhcmNoaXRlY3R1cmUnOiAzMixcbiAgICAgICAgJ2ZhbWlseSc6IChkYXRhICYmICFpc1NwZWNpYWxDYXNlZE9TKSA/IG9zLnJlcGxhY2UoZGF0YVswXSwgJycpIDogb3MsXG4gICAgICAgICd2ZXJzaW9uJzogZGF0YSA/IGRhdGFbMV0gOiBudWxsLFxuICAgICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdmVyc2lvbiA9IHRoaXMudmVyc2lvbjtcbiAgICAgICAgICByZXR1cm4gdGhpcy5mYW1pbHkgKyAoKHZlcnNpb24gJiYgIWlzU3BlY2lhbENhc2VkT1MpID8gJyAnICsgdmVyc2lvbiA6ICcnKSArICh0aGlzLmFyY2hpdGVjdHVyZSA9PSA2NCA/ICcgNjQtYml0JyA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gICAgLy8gYWRkIGJyb3dzZXIvT1MgYXJjaGl0ZWN0dXJlXG4gICAgaWYgKChkYXRhID0gL1xcYig/OkFNRHxJQXxXaW58V09XfHg4Nl98eCk2NFxcYi9pLmV4ZWMoYXJjaCkpICYmICEvXFxiaTY4NlxcYi9pLnRlc3QoYXJjaCkpIHtcbiAgICAgIGlmIChvcykge1xuICAgICAgICBvcy5hcmNoaXRlY3R1cmUgPSA2NDtcbiAgICAgICAgb3MuZmFtaWx5ID0gb3MuZmFtaWx5LnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhKSwgJycpO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICAgIG5hbWUgJiYgKC9cXGJXT1c2NFxcYi9pLnRlc3QodWEpIHx8XG4gICAgICAgICAgKHVzZUZlYXR1cmVzICYmIC9cXHcoPzo4NnwzMikkLy50ZXN0KG5hdi5jcHVDbGFzcyB8fCBuYXYucGxhdGZvcm0pICYmICEvXFxiV2luNjQ7IHg2NFxcYi9pLnRlc3QodWEpKSlcbiAgICAgICkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCczMi1iaXQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1YSB8fCAodWEgPSBudWxsKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF0Zm9ybSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciBwbGF0Zm9ybSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXRmb3JtIGRlc2NyaXB0aW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5kZXNjcmlwdGlvbiA9IHVhO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGJyb3dzZXIncyBsYXlvdXQgZW5naW5lLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5sYXlvdXQgPSBsYXlvdXQgJiYgbGF5b3V0WzBdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHByb2R1Y3QncyBtYW51ZmFjdHVyZXIuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm1hbnVmYWN0dXJlciA9IG1hbnVmYWN0dXJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBicm93c2VyL2Vudmlyb25tZW50LlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5uYW1lID0gbmFtZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbHBoYS9iZXRhIHJlbGVhc2UgaW5kaWNhdG9yLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5wcmVyZWxlYXNlID0gcHJlcmVsZWFzZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0IGhvc3RpbmcgdGhlIGJyb3dzZXIuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnByb2R1Y3QgPSBwcm9kdWN0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJyb3dzZXIncyB1c2VyIGFnZW50IHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0udWEgPSB1YTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBicm93c2VyL2Vudmlyb25tZW50IHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnZlcnNpb24gPSBuYW1lICYmIHZlcnNpb247XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgb3BlcmF0aW5nIHN5c3RlbS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm9zID0gb3MgfHwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBDUFUgYXJjaGl0ZWN0dXJlIHRoZSBPUyBpcyBidWlsdCBmb3IuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBudW1iZXJ8bnVsbFxuICAgICAgICovXG4gICAgICAnYXJjaGl0ZWN0dXJlJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZmFtaWx5IG9mIHRoZSBPUy5cbiAgICAgICAqXG4gICAgICAgKiBDb21tb24gdmFsdWVzIGluY2x1ZGU6XG4gICAgICAgKiBcIldpbmRvd3NcIiwgXCJXaW5kb3dzIFNlcnZlciAyMDA4IFIyIC8gN1wiLCBcIldpbmRvd3MgU2VydmVyIDIwMDggLyBWaXN0YVwiLFxuICAgICAgICogXCJXaW5kb3dzIFhQXCIsIFwiT1MgWFwiLCBcIlVidW50dVwiLCBcIkRlYmlhblwiLCBcIkZlZG9yYVwiLCBcIlJlZCBIYXRcIiwgXCJTdVNFXCIsXG4gICAgICAgKiBcIkFuZHJvaWRcIiwgXCJpT1NcIiBhbmQgXCJXaW5kb3dzIFBob25lXCJcbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICAgKi9cbiAgICAgICdmYW1pbHknOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSB2ZXJzaW9uIG9mIHRoZSBPUy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICAgKi9cbiAgICAgICd2ZXJzaW9uJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRoZSBPUyBzdHJpbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgT1Mgc3RyaW5nLlxuICAgICAgICovXG4gICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHsgcmV0dXJuICdudWxsJzsgfVxuICAgIH07XG5cbiAgICBwbGF0Zm9ybS5wYXJzZSA9IHBhcnNlO1xuICAgIHBsYXRmb3JtLnRvU3RyaW5nID0gdG9TdHJpbmdQbGF0Zm9ybTtcblxuICAgIGlmIChwbGF0Zm9ybS52ZXJzaW9uKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KHZlcnNpb24pO1xuICAgIH1cbiAgICBpZiAocGxhdGZvcm0ubmFtZSkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdChuYW1lKTtcbiAgICB9XG4gICAgaWYgKG9zICYmIG5hbWUgJiYgIShvcyA9PSBTdHJpbmcob3MpLnNwbGl0KCcgJylbMF0gJiYgKG9zID09IG5hbWUuc3BsaXQoJyAnKVswXSB8fCBwcm9kdWN0KSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2gocHJvZHVjdCA/ICcoJyArIG9zICsgJyknIDogJ29uICcgKyBvcyk7XG4gICAgfVxuICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICAgIHBsYXRmb3JtLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24uam9pbignICcpO1xuICAgIH1cbiAgICByZXR1cm4gcGxhdGZvcm07XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBleHBvcnQgcGxhdGZvcm1cbiAgLy8gc29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3IgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gZGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28sIHRocm91Z2ggcGF0aCBtYXBwaW5nLCBpdCBjYW4gYmUgYWxpYXNlZFxuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBwYXJzZSgpO1xuICAgIH0pO1xuICB9XG4gIC8vIGNoZWNrIGZvciBgZXhwb3J0c2AgYWZ0ZXIgYGRlZmluZWAgaW4gY2FzZSBhIGJ1aWxkIG9wdGltaXplciBhZGRzIGFuIGBleHBvcnRzYCBvYmplY3RcbiAgZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuICAgIC8vIGluIE5hcndoYWwsIE5vZGUuanMsIFJoaW5vIC1yZXF1aXJlLCBvciBSaW5nb0pTXG4gICAgZm9yT3duKHBhcnNlKCksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgIGZyZWVFeHBvcnRzW2tleV0gPSB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuICAvLyBpbiBhIGJyb3dzZXIgb3IgUmhpbm9cbiAgZWxzZSB7XG4gICAgcm9vdC5wbGF0Zm9ybSA9IHBhcnNlKCk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcGxhdGZvcm0vcGxhdGZvcm0uanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImFhOGNiNWZiYzcxMGM3ZGRlZDk3M2EzNDFjZWQyZTY2LmpzXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ZpbGUtbG9hZGVyIS4vfi9wYXJhbGxlbGpzL2xpYi9ldmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgKiBhcyBfIGZyb20gXCJsb2Rhc2hcIjtcbi8qIHRzbGludDpkaXNhYmxlOm5vLXZhci1yZXF1aXJlcyAqL1xuaW1wb3J0ICogYXMgYmVuY2htYXJrIGZyb20gXCJiZW5jaG1hcmtcIjtcbmNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZShcInBsYXRmb3JtXCIpO1xuLyogdHNsaW50OmVuYWJsZTpuby12YXItcmVxdWlyZXMgKi9cblxuaW1wb3J0IHttYW5kZWxicm90IGFzIHRyYW5zcGlsZWRQYXJhbGxlbE1hbmRlbGJyb3R9IGZyb20gXCIuL3RyYW5zcGlsZWQvbWFuZGVsYnJvdFwiO1xuaW1wb3J0IHtzeW5jS25pZ2h0VG91cnMsIHBhcmFsbGVsS25pZ2h0VG91cnMgYXMgdHJhbnNwaWxlZFBhcmFsbGVsS25pZ2h0VG91cnN9IGZyb20gXCIuL3RyYW5zcGlsZWQva25pZ2h0cy10b3VyXCI7XG5pbXBvcnQge3N5bmNNb250ZUNhcmxvIGFzIHNpbUpzTW9udGVDYXJsbywgcGFyYWxsZWxNb250ZUNhcmxvIGFzIHNpbUpzUGFyYWxsZWxNb250ZUNhcmxvfSBmcm9tIFwiLi90cmFuc3BpbGVkL21vbnRlLWNhcmxvXCI7XG5cbmltcG9ydCB7cGFyYWxsZWxLbmlnaHRUb3VycyBhcyBkeW5hbWljUGFyYWxsZWxLbmlnaHRUb3Vyc30gZnJvbSBcIi4vZHluYW1pYy9rbmlnaHRzLXRvdXJcIjtcbmltcG9ydCB7Y3JlYXRlTWFuZGVsT3B0aW9ucywgcGFyYWxsZWxNYW5kZWxicm90IGFzIGR5bmFtaWNQYXJhbGxlbE1hbmRlbGJyb3QsIHN5bmNNYW5kZWxicm90fSBmcm9tIFwiLi9keW5hbWljL21hbmRlbGJyb3RcIjtcbmltcG9ydCB7SU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucywgc3luY01vbnRlQ2FybG8gYXMgcmFuZG9tTW9udGVDYXJsbywgcGFyYWxsZWxNb250ZUNhcmxvIGFzIHJhbmRvbVBhcmFsbGVsTW9udGVDYXJsbywgSVByb2plY3R9IGZyb20gXCIuL2R5bmFtaWMvbW9udGUtY2FybG9cIjtcblxuaW1wb3J0IHtwYXJhbGxlbEpTTWFuZGVsYnJvdH0gZnJvbSBcIi4vcGFyYWxsZWxqcy9tYW5kZWxicm90XCI7XG5pbXBvcnQge3BhcmFsbGVsSlNNb250ZUNhcmxvfSBmcm9tIFwiLi9wYXJhbGxlbGpzL21vbnRlLWNhcmxvXCI7XG5pbXBvcnQge3BhcmFsbGVsSlNLbmlnaHRUb3Vyc30gZnJvbSBcIi4vcGFyYWxsZWxqcy9rbmlnaHRzLXRvdXJcIjtcblxubGV0IEJlbmNobWFyayA9IChiZW5jaG1hcmsgYXMgYW55KS5ydW5JbkNvbnRleHQoeyBfIH0pO1xuKHdpbmRvdyBhcyBhbnkpLkJlbmNobWFyayA9IEJlbmNobWFyaztcblxuY29uc3QgcnVuQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNydW5cIikgYXMgSFRNTElucHV0RWxlbWVudDtcbmNvbnN0IG91dHB1dFRhYmxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvdXRwdXQtdGFibGVcIikgYXMgSFRNTFRhYmxlRWxlbWVudDtcbmNvbnN0IGpzb25PdXRwdXRGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjanNvbi1vdXRwdXRcIikgYXMgSFRNTEVsZW1lbnQ7XG5cbmNvbnN0IHNldENoZWNrYm94ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbaWQqPVwiLXNldFwiXScpIGFzIE5vZGVMaXN0T2Y8SFRNTElucHV0RWxlbWVudD47XG5cbmNvbnN0IGtuaWdodFJ1bm5lcjZ4NiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIja25pZ2h0LXJ1bm5lci02LTZcIikgYXMgSFRNTElucHV0RWxlbWVudDtcblxudHlwZSBEZWZlcnJlZCA9IHsgcmVzb2x2ZTogKCkgPT4gdm9pZCB9O1xuXG5mdW5jdGlvbiBhZGRLbmlnaHRCb2FyZFRlc3RzKHN1aXRlOiBiZW5jaG1hcmsuU3VpdGUpIHtcbiAgICBjb25zdCBib2FyZFNpemVzID0ga25pZ2h0UnVubmVyNng2LmNoZWNrZWQgPyBbNSwgNl0gOiBbNV07XG5cbiAgICBmb3IgKGNvbnN0IGJvYXJkU2l6ZSBvZiBib2FyZFNpemVzKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gYEtuaWdodHMgVG91ciAoJHtib2FyZFNpemV9eCR7Ym9hcmRTaXplfSlgO1xuICAgICAgICBzdWl0ZS5hZGQoYHN5bmM6ICR7dGl0bGV9YCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3luY0tuaWdodFRvdXJzKHt4OiAwLCB5OiAwfSwgYm9hcmRTaXplKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3VpdGUuYWRkKGBwYXJhbGxlbC1keW5hbWljOiAke3RpdGxlfWAsIGZ1bmN0aW9uIChkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIGR5bmFtaWNQYXJhbGxlbEtuaWdodFRvdXJzKHt4OiAwLCB5OiAwfSwgYm9hcmRTaXplKS50aGVuKCgpID0+IGRlZmVycmVkLnJlc29sdmUoKSwgKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9KTtcblxuICAgICAgICBzdWl0ZS5hZGQoYHBhcmFsbGVsLXRyYW5zcGlsZWQ6ICR7dGl0bGV9YCwgZnVuY3Rpb24gKGRlZmVycmVkOiBEZWZlcnJlZCkge1xuICAgICAgICAgICAgdHJhbnNwaWxlZFBhcmFsbGVsS25pZ2h0VG91cnMoe3g6IDAsIHk6IDB9LCBib2FyZFNpemUpLnRoZW4oKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpLCAoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCkpO1xuICAgICAgICB9LCB7IGRlZmVyOiB0cnVlIH0pO1xuXG4gICAgICAgIHN1aXRlLmFkZChgcGFyYWxsZWxqczogJHt0aXRsZX1gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICBwYXJhbGxlbEpTS25pZ2h0VG91cnMoe3g6IDAsIHk6IDB9LCBib2FyZFNpemUpLnRoZW4oKHJlc3VsdCkgPT4geyBjb25zb2xlLmxvZyhyZXN1bHQpOyBkZWZlcnJlZC5yZXNvbHZlKCkgfSwgKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE1vbnRlQ2FybG9UZXN0KHN1aXRlOiBiZW5jaG1hcmsuU3VpdGUsIG9wdGlvbnM6IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMgJiB7bnVtYmVyT2ZQcm9qZWN0czogbnVtYmVyLCBudW1SdW5zOiBudW1iZXJ9KSB7XG4gICAgY29uc3QgcnVuT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywge1xuICAgICAgICBwcm9qZWN0czogY3JlYXRlUHJvamVjdHMob3B0aW9ucy5udW1iZXJPZlByb2plY3RzKVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29uZmlnTmFtZSA9IGAocHJvamVjdHM6ICR7b3B0aW9ucy5udW1iZXJPZlByb2plY3RzfSwgcnVuczogJHtvcHRpb25zLm51bVJ1bnMudG9Mb2NhbGVTdHJpbmcoKX0pYDtcblxuICAgIHN1aXRlLmFkZChgc3luYzogTW9udGUgQ2FybG8gTWF0aC5yYW5kb20gJHtjb25maWdOYW1lfWAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmFuZG9tTW9udGVDYXJsbyhvcHRpb25zKTtcbiAgICB9KTtcblxuICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtZHluYW1pYzogTW9udGUgQ2FybG8gTWF0aC5yYW5kb20gJHtjb25maWdOYW1lfWAsXG4gICAgICAgIGZ1bmN0aW9uIChkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb21QYXJhbGxlbE1vbnRlQ2FybG8ocnVuT3B0aW9ucykudGhlbigoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCksICgpID0+IGRlZmVycmVkLnJlc29sdmUoKSk7XG4gICAgICAgIH0sIHsgZGVmZXI6IHRydWUgfVxuICAgICk7XG5cbiAgICBzdWl0ZS5hZGQoYHN5bmM6IE1vbnRlIENhcmxvIHNpbWpzICR7Y29uZmlnTmFtZX1gLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNpbUpzTW9udGVDYXJsbyhvcHRpb25zKTtcbiAgICB9KTtcblxuICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtdHJhbnNwaWxlZDogTW9udGUgQ2FybG8gc2ltanMgJHtjb25maWdOYW1lfWAsXG4gICAgICAgIGZ1bmN0aW9uIChkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzaW1Kc1BhcmFsbGVsTW9udGVDYXJsbyhydW5PcHRpb25zKS50aGVuKCgpID0+IGRlZmVycmVkLnJlc29sdmUoKSwgKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9XG4gICAgKTtcblxuICAgIHN1aXRlLmFkZChgcGFyYWxsZWxqczogTW9udGUgQ2FybG8gc2ltanMgJHtjb25maWdOYW1lfWAsIGZ1bmN0aW9uIChkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgcGFyYWxsZWxKU01vbnRlQ2FybG8ocnVuT3B0aW9ucykudGhlbigoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCksIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVGVzdCBmYWlsZWRcIiwgZXJyb3IpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpXG4gICAgICAgIH0pO1xuICAgIH0sIHsgZGVmZXI6IHRydWUgfSlcbn1cblxuZnVuY3Rpb24gYWRkTW9udGVDYXJsb1Rlc3RzKHN1aXRlOiBiZW5jaG1hcmsuU3VpdGUpIHtcbiAgICBjb25zdCBtb250ZUNhcmxvT3B0aW9ucyA9IHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogNjIwMDAwLFxuICAgICAgICBudW1SdW5zOiAxMDAwMDAsXG4gICAgICAgIG51bVllYXJzOiAxNSxcbiAgICAgICAgcGVyZm9ybWFuY2U6IDAuMDM0MDAwMCxcbiAgICAgICAgc2VlZDogMTAsXG4gICAgICAgIHZvbGF0aWxpdHk6IDAuMDg5NjAwMFxuICAgIH07XG5cbiAgICBmb3IgKGNvbnN0IG51bWJlck9mUHJvamVjdHMgb2YgIFsxLCA0LCA4LCAxNl0pIHtcbiAgICAgICAgZm9yIChjb25zdCBudW1SdW5zIG9mIFsxMCAqKiA0LCAxMCAqKiA1LCAxMCAqKiA2XSkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG1vbnRlQ2FybG9PcHRpb25zLCB7IG51bWJlck9mUHJvamVjdHMsIG51bVJ1bnMgfSk7XG4gICAgICAgICAgICBhZGRNb250ZUNhcmxvVGVzdChzdWl0ZSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE1hbmRlbGJyb3RUZXN0cyhzdWl0ZTogYmVuY2htYXJrLlN1aXRlKSB7XG4gICAgY29uc3QgbWFuZGVsYnJvdEhlaWdodCA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3QtaGVpZ2h0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLCAxMCk7XG4gICAgY29uc3QgbWFuZGVsYnJvdFdpZHRoID0gcGFyc2VJbnQoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFuZGVsYnJvdC13aWR0aFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuICAgIGNvbnN0IG1hbmRlbGJyb3RJdGVyYXRpb25zID0gcGFyc2VJbnQoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFuZGVsYnJvdC1pdGVyYXRpb25zXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLCAxMCk7XG5cbiAgICBjb25zdCBtYW5kZWxicm90T3B0aW9ucyA9IGNyZWF0ZU1hbmRlbE9wdGlvbnMobWFuZGVsYnJvdFdpZHRoLCBtYW5kZWxicm90SGVpZ2h0LCBtYW5kZWxicm90SXRlcmF0aW9ucyk7XG5cbiAgICBzdWl0ZS5hZGQoYHN5bmM6IE1hbmRlbGJyb3QgJHttYW5kZWxicm90V2lkdGh9eCR7bWFuZGVsYnJvdEhlaWdodH0sICR7bWFuZGVsYnJvdEl0ZXJhdGlvbnN9YCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzeW5jTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgKCkgPT4gdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3QgbWF4VmFsdWVzUGVyVGFzayBvZiBbdW5kZWZpbmVkLCAxLCA3NSwgMTUwLCAzMDAsIDYwMCwgMTIwMF0pIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBgTWFuZGVsYnJvdCAke21hbmRlbGJyb3RPcHRpb25zLmltYWdlV2lkdGh9eCR7bWFuZGVsYnJvdE9wdGlvbnMuaW1hZ2VIZWlnaHR9LCAke21hbmRlbGJyb3RPcHRpb25zLml0ZXJhdGlvbnN9ICgke21heFZhbHVlc1BlclRhc2t9KWA7XG4gICAgICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtZHluYW1pYzogJHt0aXRsZX1gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZHluYW1pY1BhcmFsbGVsTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgeyBtYXhWYWx1ZXNQZXJUYXNrIH0pLnRoZW4oKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpLCAoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCkpO1xuICAgICAgICB9LCB7IGRlZmVyOiB0cnVlIH0pO1xuXG4gICAgICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtdHJhbnNwaWxlZDogJHt0aXRsZX1gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNwaWxlZFBhcmFsbGVsTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgeyBtYXhWYWx1ZXNQZXJUYXNrIH0pLnRoZW4oKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpLCAoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCkpO1xuICAgICAgICB9LCB7IGRlZmVyOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIHN1aXRlLmFkZChgcGFyYWxsZWxqczogTWFuZGVsYnJvdCAke21hbmRlbGJyb3RXaWR0aH14JHttYW5kZWxicm90SGVpZ2h0fSwgJHttYW5kZWxicm90SXRlcmF0aW9uc31gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgIHBhcmFsbGVsSlNNYW5kZWxicm90KG1hbmRlbGJyb3RPcHRpb25zKS50aGVuKCgpID0+IGRlZmVycmVkLnJlc29sdmUoKSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUZXN0IGZhaWxlZFwiLCBlcnJvcik7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKClcbiAgICAgICAgfSk7XG4gICAgfSwgeyBkZWZlcjogdHJ1ZSB9KTtcbn1cblxuZnVuY3Rpb24gbWVhc3VyZSgpIHtcbiAgICBjb25zdCBhbGxUZXN0c1N1aXRlID0gbmV3IEJlbmNobWFyay5TdWl0ZSgpO1xuXG4gICAgYWRkTW9udGVDYXJsb1Rlc3RzKGFsbFRlc3RzU3VpdGUpO1xuICAgIGFkZE1hbmRlbGJyb3RUZXN0cyhhbGxUZXN0c1N1aXRlKTtcbiAgICBhZGRLbmlnaHRCb2FyZFRlc3RzKGFsbFRlc3RzU3VpdGUpO1xuXG4gICAgY29uc3Qgc3VpdGUgPSBhbGxUZXN0c1N1aXRlLmZpbHRlcigoYmVuY2htYXJrOiBiZW5jaG1hcmsgICYge25hbWU6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2V0Q2hlY2tib3hlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgY2hlY2tib3ggPSBzZXRDaGVja2JveGVzW2ldO1xuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBjaGVja2JveC5pZC5zcGxpdChcIi1cIik7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gcGFydHMuc2xpY2UoMCwgcGFydHMubGVuZ3RoIC0gMSkuam9pbihcIi1cIik7XG5cbiAgICAgICAgICAgIGlmIChjaGVja2JveC5jaGVja2VkICYmIGJlbmNobWFyay5uYW1lLnN0YXJ0c1dpdGgobmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBzdWl0ZS5vbihcImN5Y2xlXCIsIGZ1bmN0aW9uIChldmVudDogYmVuY2htYXJrLkV2ZW50KSB7XG4gICAgICAgIGFwcGVuZFRlc3RSZXN1bHRzKGV2ZW50KTtcbiAgICB9KTtcblxuICAgIHN1aXRlLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKGV2ZW50OiBiZW5jaG1hcmsuRXZlbnQpIHtcbiAgICAgICAgY29uc3QgYmVuY2htYXJrcyA9IChldmVudC5jdXJyZW50VGFyZ2V0IGFzIGJlbmNobWFyay5TdWl0ZSkubWFwKChiZW5jaG1hcms6IGJlbmNobWFyayAmIHtuYW1lOiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbmZvOiBiZW5jaG1hcmsudG9TdHJpbmcsXG4gICAgICAgICAgICAgICAgbmFtZTogYmVuY2htYXJrLm5hbWUsXG4gICAgICAgICAgICAgICAgc3RhdHM6IGJlbmNobWFyay5zdGF0cyxcbiAgICAgICAgICAgICAgICB0aW1lczogYmVuY2htYXJrLnRpbWVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBqc29uT3V0cHV0RmllbGQudGV4dENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSh7IGJlbmNobWFya3MsIHBsYXRmb3JtfSwgdW5kZWZpbmVkLCBcIiAgICBcIik7XG4gICAgICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgc3VpdGUub24oXCJzdGFydFwiLCBpbml0UmVzdWx0VGFibGUpO1xuXG4gICAgc3VpdGUucnVuKHthc3luYzogdHJ1ZSB9KTtcbn1cblxucnVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgbWVhc3VyZSgpO1xufSk7XG5cbmZ1bmN0aW9uIGluaXRSZXN1bHRUYWJsZShldmVudDogYmVuY2htYXJrLkV2ZW50KSB7XG4gICAgY2xlYXJPdXRwdXRUYWJsZSgpO1xuXG4gICAgZnVuY3Rpb24gY2xlYXJPdXRwdXRUYWJsZSgpIHtcbiAgICAgICAgd2hpbGUgKG91dHB1dFRhYmxlLnRCb2RpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgb3V0cHV0VGFibGUucmVtb3ZlQ2hpbGQob3V0cHV0VGFibGUudEJvZGllc1swXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gb3V0cHV0VGFibGUuY3JlYXRlVEJvZHkoKTtcbiAgICAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBBcnJheTxiZW5jaG1hcmsuT3B0aW9ucz4pLmZvckVhY2goc3VpdGUgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSBib2R5Lmluc2VydFJvdygpO1xuICAgICAgICBjb25zdCBbc2V0LCAuLi5uYW1lUGFydHNdID0gc3VpdGUubmFtZSEuc3BsaXQoXCI6XCIpO1xuXG4gICAgICAgIHJvdy5pbnNlcnRDZWxsKCkudGV4dENvbnRlbnQgPSBzZXQ7XG4gICAgICAgIHJvdy5pbnNlcnRDZWxsKCkudGV4dENvbnRlbnQgPSBuYW1lUGFydHMuam9pbihcIjpcIik7XG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSAob3V0cHV0VGFibGUudEhlYWQucm93c1swXSBhcyBIVE1MVGFibGVSb3dFbGVtZW50KS5jZWxscy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29sdW1uczsgKytpKSB7XG4gICAgICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZFRlc3RSZXN1bHRzKGV2ZW50OiBiZW5jaG1hcmsuRXZlbnQpIHtcbiAgICBjb25zdCBib2R5ID0gb3V0cHV0VGFibGUudEJvZGllc1swXSBhcyBIVE1MVGFibGVTZWN0aW9uRWxlbWVudDtcbiAgICBjb25zdCBiZW5jaG1hcmsgPSBldmVudC50YXJnZXQgYXMgKGJlbmNobWFyayk7XG4gICAgY29uc3QgaW5kZXggPSAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBBcnJheTxiZW5jaG1hcms+KS5pbmRleE9mKGJlbmNobWFyayk7XG4gICAgY29uc3Qgcm93ID0gYm9keS5yb3dzW2luZGV4XSBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuXG4gICAgcm93LmNlbGxzWzJdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLmRldmlhdGlvbi50b0ZpeGVkKDQpO1xuICAgIHJvdy5jZWxsc1szXS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy5tZWFuLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzRdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLm1vZS50b0ZpeGVkKDQpO1xuICAgIHJvdy5jZWxsc1s1XS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy5ybWUudG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbNl0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMuc2VtLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzddLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLnZhcmlhbmNlLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzhdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLnNhbXBsZS5sZW5ndGgudG9GaXhlZCgwKTtcbiAgICByb3cuY2VsbHNbOV0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuaHoudG9GaXhlZCg0KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlUHJvamVjdHMoY291bnQ6IG51bWJlcik6IElQcm9qZWN0W10ge1xuICAgIGNvbnN0IHByb2plY3RzOiBJUHJvamVjdFtdID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyArK2kpIHtcbiAgICAgICAgcHJvamVjdHMucHVzaCh7XG4gICAgICAgICAgICBzdGFydFllYXI6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDE1KSxcbiAgICAgICAgICAgIHRvdGFsQW1vdW50OiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9qZWN0cztcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wZXJmb3JtYW5jZS1tZWFzdXJlbWVudC50cyJdLCJzb3VyY2VSb290IjoiIn0=