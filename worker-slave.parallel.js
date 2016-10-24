/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* exports used: default */
/*!****************************************!*\
  !*** ./~/simjs-random/simjs-random.js ***!
  \****************************************/
/***/ function(module, exports) {

/*!
 * Random.js version 0.2.6
 * curl http://simjs.com/_downloads/random-0.26-debug.js
 */

 /** Random.js library.
 *
 * The code is licensed as LGPL.
*/

/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
 */

var Random = function(seed) {
	seed = (seed === undefined) ? (new Date()).getTime() : seed;
	if (typeof(seed) !== 'number'                             // ARG_CHECK
		|| Math.ceil(seed) != Math.floor(seed)) {             // ARG_CHECK
		throw new TypeError("seed value must be an integer"); // ARG_CHECK
	}                                                         // ARG_CHECK


	/* Period parameters */
	this.N = 624;
	this.M = 397;
	this.MATRIX_A = 0x9908b0df;   /* constant vector a */
	this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
	this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

	this.mt = new Array(this.N); /* the array for the state vector */
	this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

	//this.init_genrand(seed);
	this.init_by_array([seed], 1);
};

/* initializes mt[N] with a seed */
Random.prototype.init_genrand = function(s) {
	this.mt[0] = s >>> 0;
	for (this.mti=1; this.mti<this.N; this.mti++) {
		var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
		+ this.mti;
		/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
		/* In the previous versions, MSBs of the seed affect   */
		/* only MSBs of the array mt[].                        */
		/* 2002/01/09 modified by Makoto Matsumoto             */
		this.mt[this.mti] >>>= 0;
		/* for >32 bit machines */
	}
};

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
Random.prototype.init_by_array = function(init_key, key_length) {
	var i, j, k;
	this.init_genrand(19650218);
	i=1; j=0;
	k = (this.N>key_length ? this.N : key_length);
	for (; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
		+ init_key[j] + j; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++; j++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		if (j>=key_length) j=0;
	}
	for (k=this.N-1; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
		- i; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
	}

	this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
};

/* generates a random number on [0,0xffffffff]-interval */
Random.prototype.genrand_int32 = function() {
	var y;
	var mag01 = new Array(0x0, this.MATRIX_A);
	/* mag01[x] = x * MATRIX_A  for x=0,1 */

	if (this.mti >= this.N) { /* generate N words at one time */
		var kk;

		if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
			this.init_genrand(5489); /* a default initial seed is used */

		for (kk=0;kk<this.N-this.M;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		for (;kk<this.N-1;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
		this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	/* Tempering */
	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return y >>> 0;
};

/* generates a random number on [0,0x7fffffff]-interval */
Random.prototype.genrand_int31 = function() {
	return (this.genrand_int32()>>>1);
};

/* generates a random number on [0,1]-real-interval */
Random.prototype.genrand_real1 = function() {
	return this.genrand_int32()*(1.0/4294967295.0);
	/* divided by 2^32-1 */
};

/* generates a random number on [0,1)-real-interval */
Random.prototype.random = function() {
	if (this.pythonCompatibility) {
		if (this.skip) {
			this.genrand_int32();
		}
		this.skip = true;
	}
	return this.genrand_int32()*(1.0/4294967296.0);
	/* divided by 2^32 */
};

/* generates a random number on (0,1)-real-interval */
Random.prototype.genrand_real3 = function() {
	return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
	/* divided by 2^32 */
};

/* generates a random number on [0,1) with 53-bit resolution*/
Random.prototype.genrand_res53 = function() {
	var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
	return(a*67108864.0+b)*(1.0/9007199254740992.0);
};

/* These real versions are due to Isaku Wada, 2002/01/09 added */


/**************************************************************************/
Random.prototype.LOG4 = Math.log(4.0);
Random.prototype.SG_MAGICCONST = 1.0 + Math.log(4.5);

Random.prototype.exponential = function (lambda) {
	if (arguments.length != 1) {                         // ARG_CHECK
		throw new SyntaxError("exponential() must "     // ARG_CHECK
				+ " be called with 'lambda' parameter"); // ARG_CHECK
	}                                                   // ARG_CHECK

	var r = this.random();
	return -Math.log(r) / lambda;
};

Random.prototype.gamma = function (alpha, beta) {
	if (arguments.length != 2) {                         // ARG_CHECK
		throw new SyntaxError("gamma() must be called"  // ARG_CHECK
				+ " with alpha and beta parameters"); // ARG_CHECK
	}                                                   // ARG_CHECK

	/* Based on Python 2.6 source code of random.py.
	 */

	if (alpha > 1.0) {
		var ainv = Math.sqrt(2.0 * alpha - 1.0);
		var bbb = alpha - this.LOG4;
		var ccc = alpha + ainv;

		while (true) {
			var u1 = this.random();
			if ((u1 < 1e-7) || (u > 0.9999999)) {
				continue;
			}
			var u2 = 1.0 - this.random();
			var v = Math.log(u1 / (1.0 - u1)) / ainv;
			var x = alpha * Math.exp(v);
			var z = u1 * u1 * u2;
			var r = bbb + ccc * v - x;
			if ((r + this.SG_MAGICCONST - 4.5 * z >= 0.0) || (r >= Math.log(z))) {
				return x * beta;
			}
		}
	} else if (alpha == 1.0) {
		var u = this.random();
		while (u <= 1e-7) {
			u = this.random();
		}
		return - Math.log(u) * beta;
	} else {
		while (true) {
			var u = this.random();
			var b = (Math.E + alpha) / Math.E;
			var p = b * u;
			if (p <= 1.0) {
				var x = Math.pow(p, 1.0 / alpha);
			} else {
				var x = - Math.log((b - p) / alpha);
			}
			var u1 = this.random();
			if (p > 1.0) {
				if (u1 <= Math.pow(x, (alpha - 1.0))) {
					break;
				}
			} else if (u1 <= Math.exp(-x)) {
				break;
			}
		}
		return x * beta;
	}

};

Random.prototype.normal = function (mu, sigma) {
	if (arguments.length != 2) {                          // ARG_CHECK
		throw new SyntaxError("normal() must be called"  // ARG_CHECK
				+ " with mu and sigma parameters");      // ARG_CHECK
	}                                                    // ARG_CHECK

	var z = this.lastNormal;
	this.lastNormal = NaN;
	if (!z) {
		var a = this.random() * 2 * Math.PI;
		var b = Math.sqrt(-2.0 * Math.log(1.0 - this.random()));
		z = Math.cos(a) * b;
		this.lastNormal = Math.sin(a) * b;
	}
	return mu + z * sigma;
};

Random.prototype.pareto = function (alpha) {
	if (arguments.length != 1) {                         // ARG_CHECK
		throw new SyntaxError("pareto() must be called" // ARG_CHECK
				+ " with alpha parameter");             // ARG_CHECK
	}                                                   // ARG_CHECK

	var u = this.random();
	return 1.0 / Math.pow((1 - u), 1.0 / alpha);
};

Random.prototype.triangular = function (lower, upper, mode) {
	// http://en.wikipedia.org/wiki/Triangular_distribution
	if (arguments.length != 3) {                         // ARG_CHECK
		throw new SyntaxError("triangular() must be called" // ARG_CHECK
		+ " with lower, upper and mode parameters");    // ARG_CHECK
	}                                                   // ARG_CHECK

	var c = (mode - lower) / (upper - lower);
	var u = this.random();

	if (u <= c) {
		return lower + Math.sqrt(u * (upper - lower) * (mode - lower));
	} else {
		return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode));
	}
};

Random.prototype.uniform = function (lower, upper) {
	if (arguments.length != 2) {                         // ARG_CHECK
		throw new SyntaxError("uniform() must be called" // ARG_CHECK
		+ " with lower and upper parameters");    // ARG_CHECK
	}                                                   // ARG_CHECK
	return lower + this.random() * (upper - lower);
};

Random.prototype.weibull = function (alpha, beta) {
	if (arguments.length != 2) {                         // ARG_CHECK
		throw new SyntaxError("weibull() must be called" // ARG_CHECK
		+ " with alpha and beta parameters");    // ARG_CHECK
	}                                                   // ARG_CHECK
	var u = 1.0 - this.random();
	return alpha * Math.pow(-Math.log(u), 1.0 / beta);
};

module.exports = Random;

/***/ },
/* 1 */
/* unknown exports provided */
/* all exports used */
/*!**************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./~/babel-loader?{"presets":[["es2015",{"modules":false}]],"babelrc":false,"plugins":["/home/travis/build/DatenMetzgerX/parallel-es-example/~/babel-plugin-parallel-es/dist/src/worker-rewriter/worker-rewriter-plugin.js"]}!./~/parallel-es/dist/worker-slave.parallel-es6.js ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_simjs_random__ = __webpack_require__(/*! simjs-random */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_simjs_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_simjs_random__);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/******/(function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/var installedModules = {};
    /******/
    /******/ // The require function
    /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId])
            /******/return installedModules[moduleId].exports;
        /******/
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
            /******/i: moduleId,
            /******/l: false,
            /******/exports: {}
            /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/__webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/__webpack_require__.c = installedModules;
    /******/
    /******/ // identity function for calling harmory imports with the correct context
    /******/__webpack_require__.i = function (value) {
        return value;
    };
    /******/
    /******/ // define getter function for harmory exports
    /******/__webpack_require__.d = function (exports, name, getter) {
        /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
        /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
            return module['default'];
        } :
        /******/function getModuleExports() {
            return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/__webpack_require__.p = "";
    /******/
    /******/ // Load entry module and return exports
    /******/return __webpack_require__(__webpack_require__.s = 17);
    /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    exports["b"] = toIterator;
    /* harmony export (immutable) */exports["a"] = toArray;
    /* unused harmony export flattenArray */
    /**
     * Creates an iterator that iterates over the given array
     * @param data the array
     * @param T element type
     * @returns the iterator
     */
    function toIterator(data) {
        return data[Symbol.iterator]();
    }
    /**
     * Converts the given iterator to an array
     * @param iterator the iterator that is to be converted into an array
     * @param T element type
     * @returns {T[]} the array representation of the given iterator
     */
    function toArray(iterator) {
        var result = [];
        var current = void 0;
        /* tslint:disable:no-conditional-assignment */
        while (!(current = iterator.next()).done) {
            result.push(current.value);
        }
        return result;
    }
    /**
     * Flattens the given array.
     * @param deepArray the array to flatten
     * @param type of the array elements
     * @returns returns an array containing all the values contained in the sub arrays of deep array.
     */
    function flattenArray(deepArray) {
        if (deepArray.length === 0) {
            return [];
        }

        var _deepArray = _toArray(deepArray);

        var head = _deepArray[0];

        var tail = _deepArray.slice(1);

        return Array.prototype.concat.apply(head, tail);
    }

    /***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    exports["a"] = isSerializedFunctionCall;
    /**
     * @module parallel
     */
    /** */
    /**
     * Tests if the given object is a serialized function call
     * @param potentialFunc a potentially serialized function call
     * @returns {boolean} true if it is a serialized function call, false otherwise
     */
    function isSerializedFunctionCall(potentialFunc) {
        return !!potentialFunc && potentialFunc.______serializedFunctionCall === true;
    }

    /***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* unused harmony export WorkerMessageType */
    /* unused harmony export initializeWorkerMessage */
    /* unused harmony export scheduleTaskMessage */
    /* harmony export (immutable) */
    exports["c"] = requestFunctionMessage;
    /* unused harmony export functionResponseMessage */
    /* harmony export (immutable) */exports["f"] = workerResultMessage;
    /* harmony export (immutable) */exports["e"] = functionExecutionError;
    /* unused harmony export stopMessage */
    /* harmony export (immutable) */exports["b"] = isScheduleTask;
    /* harmony export (immutable) */exports["a"] = isInitializeMessage;
    /* unused harmony export isFunctionRequest */
    /* harmony export (immutable) */exports["d"] = isFunctionResponse;
    /* unused harmony export isWorkerResult */
    /* unused harmony export isFunctionExecutionError */
    /* harmony export (immutable) */exports["g"] = isStopMesssage;
    /**
     * Message types
     */
    var WorkerMessageType;
    (function (WorkerMessageType) {
        /**
         * Sent from the worker facade to the worker slave to initialize the slave.
         */
        WorkerMessageType[WorkerMessageType["InitializeWorker"] = 0] = "InitializeWorker";
        /**
         * Sent from the worker facade to the worker slave to schedule a new task on the slave.
         */
        WorkerMessageType[WorkerMessageType["ScheduleTask"] = 1] = "ScheduleTask";
        /**
         * Send from the worker slave to the worker thread to request the definition of a function needed to execute a scheduled task
         */
        WorkerMessageType[WorkerMessageType["FunctionRequest"] = 2] = "FunctionRequest";
        /**
         * Send from the worker thread to the worker slave as response to a {@link WorkerMessageType.FunctionRequest}. Includes
         * the definitions of all requested functions
         */
        WorkerMessageType[WorkerMessageType["FunctionResponse"] = 3] = "FunctionResponse";
        /**
         * Sent from the worker slave to the worker thread containing the computed result
         */
        WorkerMessageType[WorkerMessageType["WorkerResult"] = 4] = "WorkerResult";
        /**
         * Sent from the worker slave to the worker thread for the case an error occurred during the evaluation of the scheduled task.
         */
        WorkerMessageType[WorkerMessageType["FunctionExecutionError"] = 5] = "FunctionExecutionError";
        /**
         * Sent from the worker thread to the worker slave to request the slave to terminate.
         */
        WorkerMessageType[WorkerMessageType["Stop"] = 6] = "Stop";
    })(WorkerMessageType || (WorkerMessageType = {}));
    /**
     * Creates an initialize worker message
     * @param id the unique id of the worker
     * @returns the initialize worker message
     */
    function initializeWorkerMessage(id) {
        return { type: WorkerMessageType.InitializeWorker, workerId: id };
    }
    /**
     * Creates a message to schedule the given task on a worker slave
     * @param task the task to schedule
     * @returns the schedule message
     */
    function scheduleTaskMessage(task) {
        return { task: task, type: WorkerMessageType.ScheduleTask };
    }
    /**
     * Creates an {@link IFunctionRequest} message that requests the given function ids from the worker thread
     * @param functionId the id of a function to request
     * @param otherFunctionIds additional ids to request from the worker slave
     * @returns the function request message
     */
    function requestFunctionMessage(functionId) {
        for (var _len = arguments.length, otherFunctionIds = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            otherFunctionIds[_key - 1] = arguments[_key];
        }

        return { functionIds: [functionId].concat(otherFunctionIds), type: WorkerMessageType.FunctionRequest };
    }
    /**
     * Creates a function response message containing the passed function definitions
     * @param functions the function definitions to respond to the worker slave
     * @returns the function response message
     */
    function functionResponseMessage(functions) {
        for (var _len2 = arguments.length, missingFunctionIds = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            missingFunctionIds[_key2 - 1] = arguments[_key2];
        }

        return { functions: functions, missingFunctions: missingFunctionIds, type: WorkerMessageType.FunctionResponse };
    }
    /**
     * Creates a worker result message for the given result
     * @param result the computed result for the scheduled task
     * @returns the message
     */
    function workerResultMessage(result) {
        return { result: result, type: WorkerMessageType.WorkerResult };
    }
    /**
     * Creates a function execution error message containing the given error
     * @param error the error object thrown by the task computation
     * @returns the message
     */
    function functionExecutionError(error) {
        var errorObject = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.getOwnPropertyNames(error)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var prop = _step.value;

                errorObject[prop] = JSON.stringify(error[prop]);
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

        return { error: errorObject, type: WorkerMessageType.FunctionExecutionError };
    }
    /**
     * Creates a stop message
     * @returns the message
     */
    function stopMessage() {
        return { type: WorkerMessageType.Stop };
    }
    /**
     * Tests if the given message is an {@link IScheduleTaskMessage} message
     * @param message the message to test
     * @returns {boolean} {@code true} if the message is an {@link IScheduleTaskMessage}
     */
    function isScheduleTask(message) {
        return message.type === WorkerMessageType.ScheduleTask;
    }
    /**
     * Tests if the given message is an {@link IInitializeWorkerMessage} message
     * @param message the message to test
     * @returns {boolean} {@code true} if the message is an {@link IInitializeWorkerMessage}
     */
    function isInitializeMessage(message) {
        return message.type === WorkerMessageType.InitializeWorker;
    }
    /**
     * Tests if the given message is an {@link IFunctionRequest} message
     * @param message the message to test
     * @returns {boolean} {@code true} if the message is an {@link IFunctionRequest}
     */
    function isFunctionRequest(message) {
        return message.type === WorkerMessageType.FunctionRequest;
    }
    /**
     * Tests if the given message is an {@link IFunctionResponse} message
     * @param message the message to test
     * @returns {boolean} {@code true} if the message is an {@link IFunctionResponse}
     */
    function isFunctionResponse(message) {
        return message.type === WorkerMessageType.FunctionResponse;
    }
    /**
     * Tests if the given message is an {@link IWorkerResultMessage} message
     * @param message the message to test
     * @returns {boolean} {@code true} if the message is an {@link IWorkerResultMessage}
     */
    function isWorkerResult(message) {
        return message.type === WorkerMessageType.WorkerResult;
    }
    /**
     * Tests if the given message is an {@link IFunctionExecutionError} message
     * @param message the message to test
     * @returns {boolean} {@code true} if the message is an {@link IFunctionExecutionError}
     */
    function isFunctionExecutionError(message) {
        return message.type === WorkerMessageType.FunctionExecutionError;
    }
    /**
     * Tests if the given message is a stop message
     * @param message the message to test
     * @returns {boolean} {@code true} if the message is a stop message
     */
    function isStopMesssage(message) {
        return message.type === WorkerMessageType.Stop;
    }

    /***/
},
/* 3 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__common_worker_worker_messages__ = __webpack_require__(2);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__browser_worker_slave_states__ = __webpack_require__(6);

    /**
     * Worker thread endpoint executed in the web worker thread.
     * Executes the tasks assigned by the thread pool via the {@link BrowserWorkerThread}.
     */

    var BrowserWorkerSlave = function () {
        function BrowserWorkerSlave(functionCache) {
            _classCallCheck(this, BrowserWorkerSlave);

            this.functionCache = functionCache;
            /**
             * The unique id of the slave instance
             */
            this.id = Number.NaN;
            this.state = new __WEBPACK_IMPORTED_MODULE_1__browser_worker_slave_states__["a" /* DefaultBrowserWorkerSlaveState */](this);
        }
        /**
         * Changes the state of the slave to the new state
         * @param state the new state to assign
         */


        _createClass(BrowserWorkerSlave, [{
            key: 'changeState',
            value: function changeState(state) {
                this.state = state;
                this.state.enter();
            }
            /**
             * Executed when the slave receives a message from the ui-thread
             * @param event the received message
             */

        }, {
            key: 'onMessage',
            value: function onMessage(event) {
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__common_worker_worker_messages__["g" /* isStopMesssage */])(event.data)) {
                    close();
                } else if (!this.state.onMessage(event)) {
                    throw new Error('Message with type ' + event.data.type + ' cannot be handled by slave ' + this);
                }
            }
        }, {
            key: 'postMessage',
            value: function (_postMessage) {
                function postMessage(_x) {
                    return _postMessage.apply(this, arguments);
                }

                postMessage.toString = function () {
                    return _postMessage.toString();
                };

                return postMessage;
            }(function (message) {
                postMessage(message);
            })
        }, {
            key: 'toString',
            value: function toString() {
                return 'BrowserSlave { id: ' + this.id + ', state: \'' + this.state.name + '\' }';
            }
        }]);

        return BrowserWorkerSlave;
    }();
    /* harmony export (immutable) */

    exports["a"] = BrowserWorkerSlave;

    /***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__util_simple_map__ = __webpack_require__(16);

    /**
     * Cache used by each worker slave to cache the received functions.
     * Caching the functions has the advantage that function only is serialized, transmitted and deserialized once. This also
     * has the advantage, that the function instance stays the same and therefore can be optimized by the runtime system.
     */

    var SlaveFunctionLookupTable = function () {
        function SlaveFunctionLookupTable() {
            _classCallCheck(this, SlaveFunctionLookupTable);

            this.cache = new __WEBPACK_IMPORTED_MODULE_0__util_simple_map__["a" /* SimpleMap */]();
        }
        /**
         * Resolves the funciton with the givne id
         * @param id the id of the function to resolve
         * @returns the resolved function or undefined if not known
         */


        _createClass(SlaveFunctionLookupTable, [{
            key: 'getFunction',
            value: function getFunction(id) {
                return this.cache.get(id.identifier);
            }
            /**
             * Registers a new function in the cache
             * @param definition the definition of the function to register
             * @returns the registered function
             */

        }, {
            key: 'registerFunction',
            value: function registerFunction(definition) {
                var f = Function.apply(null, [].concat(_toConsumableArray(definition.argumentNames), [definition.body]));
                this.cache.set(definition.id.identifier, f);
                return f;
            }
        }, {
            key: 'registerStaticFunction',
            value: function registerStaticFunction(id, func) {
                if (this.has(id)) {
                    throw new Error('The given function id \'' + id.identifier + '\' is already used by another function registration, the id needs to be unique.');
                }
                this.cache.set(id.identifier, func);
            }
            /**
             * Tests if the cache contains a function with the given id
             * @param id the id of the function to test for existence
             * @returns true if the cache contains a function with the given id
             */

        }, {
            key: 'has',
            value: function has(id) {
                return this.cache.has(id.identifier);
            }
        }]);

        return SlaveFunctionLookupTable;
    }();
    /* harmony export (immutable) */

    exports["a"] = SlaveFunctionLookupTable;

    /***/
},
/* 5 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__ = __webpack_require__(12);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__util_identity__ = __webpack_require__(15);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__filter_iterator__ = __webpack_require__(9);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__map_iterator__ = __webpack_require__(10);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__parallel_job_executor__ = __webpack_require__(11);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__range_iterator__ = __webpack_require__(13);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_6__reduce_iterator__ = __webpack_require__(14);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_7__util_arrays__ = __webpack_require__(0);
    /* harmony export (immutable) */exports["a"] = registerStaticParallelFunctions;

    /**
     * Registers the static parallel functions
     * @param lookupTable the table into which the function should be registered
     */
    function registerStaticParallelFunctions(lookupTable) {
        lookupTable.registerStaticFunction(__WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__["a" /* ParallelWorkerFunctionIds */].IDENTITY, __WEBPACK_IMPORTED_MODULE_1__util_identity__["a" /* identity */]);
        lookupTable.registerStaticFunction(__WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__["a" /* ParallelWorkerFunctionIds */].FILTER, __WEBPACK_IMPORTED_MODULE_2__filter_iterator__["a" /* filterIterator */]);
        lookupTable.registerStaticFunction(__WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__["a" /* ParallelWorkerFunctionIds */].MAP, __WEBPACK_IMPORTED_MODULE_3__map_iterator__["a" /* mapIterator */]);
        lookupTable.registerStaticFunction(__WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__["a" /* ParallelWorkerFunctionIds */].PARALLEL_JOB_EXECUTOR, __WEBPACK_IMPORTED_MODULE_4__parallel_job_executor__["a" /* parallelJobExecutor */]);
        lookupTable.registerStaticFunction(__WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__["a" /* ParallelWorkerFunctionIds */].RANGE, __WEBPACK_IMPORTED_MODULE_5__range_iterator__["a" /* rangeIterator */]);
        lookupTable.registerStaticFunction(__WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__["a" /* ParallelWorkerFunctionIds */].REDUCE, __WEBPACK_IMPORTED_MODULE_6__reduce_iterator__["a" /* reduceIterator */]);
        lookupTable.registerStaticFunction(__WEBPACK_IMPORTED_MODULE_0__parallel_worker_functions__["a" /* ParallelWorkerFunctionIds */].TO_ITERATOR, __WEBPACK_IMPORTED_MODULE_7__util_arrays__["b" /* toIterator */]);
    }

    /***/
},
/* 6 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__common_function_function_call_deserializer__ = __webpack_require__(7);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__ = __webpack_require__(2);

    /**
     * State of the browser worker slave.
     */

    var BrowserWorkerSlaveState = function () {
        function BrowserWorkerSlaveState(name, slave) {
            _classCallCheck(this, BrowserWorkerSlaveState);

            this.name = name;
            this.slave = slave;
        }
        /**
         * Executed when the slave changes its state to this state.
         */


        _createClass(BrowserWorkerSlaveState, [{
            key: 'enter',
            value: function enter() {}
            // intentionally empty

            /**
             * Executed whenever the slave receives a message from the ui-thread while being in this state
             * @param event the received message
             * @returns {boolean} true if the state has handled the message, false otherwise
             */

        }, {
            key: 'onMessage',
            value: function onMessage(event) {
                return false;
            }
        }]);

        return BrowserWorkerSlaveState;
    }();
    /* unused harmony export BrowserWorkerSlaveState */

    /**
     * Initial state of a slave. The slave is waiting for the initialization message.
     */


    var DefaultBrowserWorkerSlaveState = function (_BrowserWorkerSlaveSt) {
        _inherits(DefaultBrowserWorkerSlaveState, _BrowserWorkerSlaveSt);

        function DefaultBrowserWorkerSlaveState(slave) {
            _classCallCheck(this, DefaultBrowserWorkerSlaveState);

            return _possibleConstructorReturn(this, (DefaultBrowserWorkerSlaveState.__proto__ || Object.getPrototypeOf(DefaultBrowserWorkerSlaveState)).call(this, "Default", slave));
        }

        _createClass(DefaultBrowserWorkerSlaveState, [{
            key: 'onMessage',
            value: function onMessage(event) {
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["a" /* isInitializeMessage */])(event.data)) {
                    this.slave.id = event.data.workerId;
                    this.slave.changeState(new IdleBrowserWorkerSlaveState(this.slave));
                    return true;
                }
                return false;
            }
        }]);

        return DefaultBrowserWorkerSlaveState;
    }(BrowserWorkerSlaveState);
    /* harmony export (immutable) */

    exports["a"] = DefaultBrowserWorkerSlaveState;

    /**
     * The slave is waiting for work from the ui-thread.
     */

    var IdleBrowserWorkerSlaveState = function (_BrowserWorkerSlaveSt2) {
        _inherits(IdleBrowserWorkerSlaveState, _BrowserWorkerSlaveSt2);

        function IdleBrowserWorkerSlaveState(slave) {
            _classCallCheck(this, IdleBrowserWorkerSlaveState);

            return _possibleConstructorReturn(this, (IdleBrowserWorkerSlaveState.__proto__ || Object.getPrototypeOf(IdleBrowserWorkerSlaveState)).call(this, "Idle", slave));
        }

        _createClass(IdleBrowserWorkerSlaveState, [{
            key: 'onMessage',
            value: function onMessage(event) {
                var _this3 = this;

                if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["b" /* isScheduleTask */])(event.data)) {
                    return false;
                }
                var task = event.data.task;
                var missingFunctions = task.usedFunctionIds.filter(function (id) {
                    return !_this3.slave.functionCache.has(id);
                });
                if (missingFunctions.length === 0) {
                    this.slave.changeState(new ExecuteFunctionBrowserWorkerSlaveState(this.slave, task));
                } else {
                    var _missingFunctions = _toArray(missingFunctions);

                    var head = _missingFunctions[0];

                    var tail = _missingFunctions.slice(1);

                    this.slave.postMessage(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["c" /* requestFunctionMessage */]).apply(undefined, [head].concat(_toConsumableArray(tail))));
                    this.slave.changeState(new WaitingForFunctionDefinitionBrowserWorkerSlaveState(this.slave, task));
                }
                return true;
            }
        }]);

        return IdleBrowserWorkerSlaveState;
    }(BrowserWorkerSlaveState);
    /* unused harmony export IdleBrowserWorkerSlaveState */

    /**
     * The slave is waiting for the definition of the requested function that is needed to execute the assigned task.
     */


    var WaitingForFunctionDefinitionBrowserWorkerSlaveState = function (_BrowserWorkerSlaveSt3) {
        _inherits(WaitingForFunctionDefinitionBrowserWorkerSlaveState, _BrowserWorkerSlaveSt3);

        function WaitingForFunctionDefinitionBrowserWorkerSlaveState(slave, task) {
            _classCallCheck(this, WaitingForFunctionDefinitionBrowserWorkerSlaveState);

            var _this4 = _possibleConstructorReturn(this, (WaitingForFunctionDefinitionBrowserWorkerSlaveState.__proto__ || Object.getPrototypeOf(WaitingForFunctionDefinitionBrowserWorkerSlaveState)).call(this, "WaitingForFunctionDefinition", slave));

            _this4.task = task;
            return _this4;
        }

        _createClass(WaitingForFunctionDefinitionBrowserWorkerSlaveState, [{
            key: 'onMessage',
            value: function onMessage(event) {
                var message = event.data;
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["d" /* isFunctionResponse */])(message)) {
                    if (message.missingFunctions.length > 0) {
                        var identifiers = message.missingFunctions.map(function (functionId) {
                            return functionId.identifier;
                        }).join(", ");
                        this.slave.postMessage(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["e" /* functionExecutionError */])(new Error('The function ids [' + identifiers + '] could not be resolved by slave ' + this.slave.id + '.')));
                        this.slave.changeState(new IdleBrowserWorkerSlaveState(this.slave));
                    } else {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = message.functions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var definition = _step2.value;

                                this.slave.functionCache.registerFunction(definition);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        this.slave.changeState(new ExecuteFunctionBrowserWorkerSlaveState(this.slave, this.task));
                    }
                    return true;
                }
                return false;
            }
        }]);

        return WaitingForFunctionDefinitionBrowserWorkerSlaveState;
    }(BrowserWorkerSlaveState);
    /* unused harmony export WaitingForFunctionDefinitionBrowserWorkerSlaveState */

    /**
     * The slave is executing the function
     */


    var ExecuteFunctionBrowserWorkerSlaveState = function (_BrowserWorkerSlaveSt4) {
        _inherits(ExecuteFunctionBrowserWorkerSlaveState, _BrowserWorkerSlaveSt4);

        function ExecuteFunctionBrowserWorkerSlaveState(slave, task) {
            _classCallCheck(this, ExecuteFunctionBrowserWorkerSlaveState);

            var _this5 = _possibleConstructorReturn(this, (ExecuteFunctionBrowserWorkerSlaveState.__proto__ || Object.getPrototypeOf(ExecuteFunctionBrowserWorkerSlaveState)).call(this, "Executing", slave));

            _this5.task = task;
            return _this5;
        }

        _createClass(ExecuteFunctionBrowserWorkerSlaveState, [{
            key: 'enter',
            value: function enter() {
                var functionDeserializer = new __WEBPACK_IMPORTED_MODULE_0__common_function_function_call_deserializer__["a" /* FunctionCallDeserializer */](this.slave.functionCache);
                try {
                    var main = functionDeserializer.deserializeFunctionCall(this.task.main);
                    var result = main({ functionCallDeserializer: functionDeserializer });
                    this.slave.postMessage(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["f" /* workerResultMessage */])(result));
                } catch (error) {
                    this.slave.postMessage(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["e" /* functionExecutionError */])(error));
                }
                this.slave.changeState(new IdleBrowserWorkerSlaveState(this.slave));
            }
        }]);

        return ExecuteFunctionBrowserWorkerSlaveState;
    }(BrowserWorkerSlaveState);
    /* unused harmony export ExecuteFunctionBrowserWorkerSlaveState */

    /***/
},
/* 7 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__serialized_function_call__ = __webpack_require__(1);

    /**
     * Deserializer for a {@link ISerializedFunctionCall}.
     */

    var FunctionCallDeserializer = function () {
        /**
         * Creates a new deserializer that uses the given function lookup table to retrieve the function for a given id
         * @param functionLookupTable the lookup table to use
         */
        function FunctionCallDeserializer(functionLookupTable) {
            _classCallCheck(this, FunctionCallDeserializer);

            this.functionLookupTable = functionLookupTable;
        }
        /**
         * Deserializes the function call into a function
         * @param functionCall the function call to deserialize
         * @param deserializeParams indicator if the parameters passed to the serialized function should be deserailized too
         * @returns a function that can be called with additional parameters (the params from the serialized function calls are prepended to the passed parameters)
         */


        _createClass(FunctionCallDeserializer, [{
            key: 'deserializeFunctionCall',
            value: function deserializeFunctionCall(functionCall) {
                var _this6 = this;

                var deserializeParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                var func = this.functionLookupTable.getFunction(functionCall.functionId);
                if (!func) {
                    throw new Error('The function with the id ' + functionCall.functionId.identifier + ' could not be retrieved while deserializing the function call. Is the function correctly registered?');
                }
                var params = functionCall.parameters || [];
                if (deserializeParams) {
                    params = params.map(function (param) {
                        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__serialized_function_call__["a" /* isSerializedFunctionCall */])(param)) {
                            return _this6.deserializeFunctionCall(param);
                        }
                        return param;
                    });
                }
                return function () {
                    for (var _len3 = arguments.length, additionalParams = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                        additionalParams[_key3] = arguments[_key3];
                    }

                    return func.apply(undefined, params.concat(additionalParams));
                };
            }
        }]);

        return FunctionCallDeserializer;
    }();
    /* harmony export (immutable) */

    exports["a"] = FunctionCallDeserializer;

    /***/
},
/* 8 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    exports["a"] = functionId;
    /* unused harmony export isFunctionId */
    /**
     * @module parallel
     */
    /** */
    /**
     * Creates a function id
     * @param namespace the namespace of the id
     * @param id the unique id for this namespace
     * @returns the function id
     */
    function functionId(namespace, id) {
        return {
            _______isFunctionId: true,
            identifier: namespace + '-' + id
        };
    }
    /**
     * Tests if the given object is a function id
     * @param obj the object to test for
     * @returns true if the object is  a function id
     */
    function isFunctionId(obj) {
        return !!obj && obj._______isFunctionId === true;
    }

    /***/
},
/* 9 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    exports["a"] = filterIterator;
    /**
     * Returns a new iterator that only contains all elements for which the given predicate returns true
     * @param iterator the iterator to filter
     * @param predicate the predicate to use for filtering the elements
     * @param env the environment of the job
     * @param T type of the elements to filter
     * @returns an iterator only containing the elements where the predicate is true
     */
    function filterIterator(iterator, predicate, env) {
        return {
            next: function next() {
                var current = void 0;
                /* tslint:disable:no-conditional-assignment */
                while (!(current = iterator.next()).done) {
                    if (predicate(current.value, env)) {
                        return current;
                    }
                }
                return current;
            }
        };
    }

    /***/
},
/* 10 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    exports["a"] = mapIterator;
    /**
     * Performs the map operation
     * @param iterator the iterator of the previous step
     * @param iteratee the iteratee to apply to each element in the iterator
     * @param env the environment of the job
     * @param T the type of the input elements
     * @param TResult the type of the returned element of the iteratee
     * @returns a new iterator where each element has been mapped using the iteratee
     */
    function mapIterator(iterator, iteratee, env) {
        return {
            next: function next() {
                var result = iterator.next();
                if (result.done) {
                    return { done: true };
                }
                return {
                    done: result.done,
                    value: iteratee(result.value, env)
                };
            }
        };
    }

    /***/
},
/* 11 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__util_arrays__ = __webpack_require__(0);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__function_serialized_function_call__ = __webpack_require__(1);
    /* harmony export (immutable) */exports["a"] = parallelJobExecutor;

    function createTaskEnvironment(definition, functionCallDeserializer) {
        var taskEnvironment = {};
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = definition.environments[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var environment = _step3.value;

                var currentEnvironment = void 0;
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__function_serialized_function_call__["a" /* isSerializedFunctionCall */])(environment)) {
                    currentEnvironment = functionCallDeserializer.deserializeFunctionCall(environment)();
                } else {
                    currentEnvironment = environment;
                }
                Object.assign(taskEnvironment, currentEnvironment);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        return Object.assign({}, { taskIndex: definition.taskIndex, valuesPerTask: definition.valuesPerTask }, taskEnvironment);
    }
    /**
     * Main coordination function for any operation performed using {@link IParallel}.
     * @param definition the definition of the operation to performed
     * @param options options passed from the thread pool
     * @param T type of the elements created by the generator
     * @param TResult type of the resulting elements
     * @returns the result of the operation from this worker
     */
    function parallelJobExecutor(definition, _ref) {
        var functionCallDeserializer = _ref.functionCallDeserializer;

        var environment = createTaskEnvironment(definition, functionCallDeserializer);
        var generatorFunction = functionCallDeserializer.deserializeFunctionCall(definition.generator, true);
        var iterator = generatorFunction(environment);
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = definition.operations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var operation = _step4.value;

                var iteratorFunction = functionCallDeserializer.deserializeFunctionCall(operation.iterator);
                var iteratee = functionCallDeserializer.deserializeFunctionCall(operation.iteratee);
                iterator = iteratorFunction(iterator, iteratee, environment);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_arrays__["a" /* toArray */])(iterator);
    }

    /***/
},
/* 12 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__function_function_id__ = __webpack_require__(8);

    var ParallelWorkerFunctionIds = {
        FILTER: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 0),
        IDENTITY: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 1),
        MAP: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 2),
        PARALLEL_JOB_EXECUTOR: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 3),
        RANGE: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 4),
        REDUCE: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 5),
        TIMES: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 6),
        TO_ITERATOR: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__function_function_id__["a" /* functionId */])("parallel", 7)
    };
    /* harmony export (immutable) */exports["a"] = ParallelWorkerFunctionIds;

    /***/
},
/* 13 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    exports["a"] = rangeIterator;
    /**
     * Generator function that creates an iterator containing all elements in the range [start, end) with a step size of step.
     * @param start start value of the range (inclusive)
     * @param end end value of the range (exclusive)
     * @param step step size between two values
     * @returns iterator with the values [start, end)
     */
    function rangeIterator(start, end, step) {
        var _next = start;
        return {
            next: function next() {
                var current = _next;
                _next = current + step;
                if (current < end) {
                    return { done: false, value: current };
                }
                return { done: true };
            }
        };
    }

    /***/
},
/* 14 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__util_arrays__ = __webpack_require__(0);
    /* harmony export (immutable) */exports["a"] = reduceIterator;

    /**
     * Reduces the elements of the given iterator to a single value by applying the given iteratee to each element
     * @param defaultValue a default value that is as accumulator or for the case that the iterator is empty
     * @param iterator the iterator with the values to reduce
     * @param iteratee iteratee that is applied for each element. The iteratee is passed the accumulated value (sum of all previous values)
     * and the current element and has to return a new accumulated value.
     * @param env the environment of the job
     * @param T type of the elements to process
     * @param TResult type of the reduced value
     * @returns an array with a single value, the reduced value
     */
    function reduceIterator(defaultValue, iterator, iteratee, env) {
        var accumulatedValue = defaultValue;
        var current = void 0;
        /* tslint:disable:no-conditional-assignment */
        while (!(current = iterator.next()).done) {
            accumulatedValue = iteratee(accumulatedValue, current.value, env);
        }
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util_arrays__["b" /* toIterator */])([accumulatedValue]);
    }

    /***/
},
/* 15 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony export (immutable) */
    exports["a"] = identity;
    /**
     * identity function. Returns the passed in value
     * @param element the value to return
     * @param T type of the element
     */
    function identity(element) {
        return element;
    }

    /***/
},
/* 16 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /**
     * A very simple implementation of a map. Do not use with complex objects as Key.
     * @param K type of the key
     * @param V type of the value
     */

    var SimpleMap = function () {
        function SimpleMap() {
            _classCallCheck(this, SimpleMap);

            this.data = {};
        }
        /**
         * Gets the value for the given key if available
         * @param key the key to look up
         * @returns the looked up value or undefined if the map does not contain any value associated with the given key
         */


        _createClass(SimpleMap, [{
            key: 'get',
            value: function get(key) {
                var internalKey = this.toInternalKey(key);
                return this.has(key) ? this.data[internalKey] : undefined;
            }
            /**
             * Tests if the map contains value stored by the given key
             * @param key the key
             * @returns true if the map contains a value by the given key, false otherwise
             */

        }, {
            key: 'has',
            value: function has(key) {
                return this.hasOwnProperty.call(this.data, this.toInternalKey(key));
            }
            /**
             * Sets the value for the given key. If the map already contains a value stored by the given key, then this value is
             * overridden
             * @param key the key
             * @param value the value to associate with the given key
             */

        }, {
            key: 'set',
            value: function set(key, value) {
                this.data[this.toInternalKey(key)] = value;
            }
            /**
             * Clears all values from the map
             */

        }, {
            key: 'clear',
            value: function clear() {
                this.data = {};
            }
        }, {
            key: 'toInternalKey',
            value: function toInternalKey(key) {
                return '@' + key;
            }
        }]);

        return SimpleMap;
    }();
    /* harmony export (immutable) */

    exports["a"] = SimpleMap;

    /***/
},
/* 17 */
/***/function (module, exports, __webpack_require__) {

    "use strict";
    /* harmony import */
    var __WEBPACK_IMPORTED_MODULE_0__browser_worker_slave__ = __webpack_require__(3);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__common_function_slave_function_lookup_table__ = __webpack_require__(4);
    /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__common_parallel_slave_register_parallel_worker_functions__ = __webpack_require__(5);

    var slaveFunctionLookupTable = new __WEBPACK_IMPORTED_MODULE_1__common_function_slave_function_lookup_table__["a" /* SlaveFunctionLookupTable */]();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_parallel_slave_register_parallel_worker_functions__["a" /* registerStaticParallelFunctions */])(slaveFunctionLookupTable);

    /*/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/mandelbrot.ts*/(function () {
        function _calculateZ(c) {
            var _environment = arguments[arguments.length - 1];
            var z = { i: c.i, real: c.real };var n = 0;for (; n < _environment.iterations; ++n) {
                if (z.real * z.real + z.i * z.i > 4) {
                    break;
                } // z ** 2 + c
                var zI = z.i;z.i = 2 * z.real * z.i + c.i;z.real = z.real * z.real - zI * zI + c.real;
            }return n;
        }
        function _anonymous(y) {
            var _environment = arguments[arguments.length - 1];
            var line = new Uint8ClampedArray(_environment.imageWidth * 4);var cI = _environment.max.i - y * _environment.scalingFactor.i;for (var x = 0; x < _environment.imageWidth; ++x) {
                var _calculateZWrapper = function _calculateZWrapper() {
                    var callee = _calculateZ;
                    var args = Array.prototype.slice.call(arguments);
                    args.length = args.length < callee.length ? callee.length : args.length;
                    args.push(_environment);
                    return callee.apply(this, args);
                };

                var c = { i: cI, real: _environment.min.real + x * _environment.scalingFactor.real };var n = _calculateZWrapper(c);var base = x * 4; /* tslint:disable:no-bitwise */line[base] = n & 0xFF;line[base + 1] = n & 0xFF00;line[base + 2] = n & 0xFF0000;line[base + 3] = 255;
            }return line;
        }

        slaveFunctionLookupTable.registerStaticFunction({
            identifier: 'static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/mandelbrot.ts/_anonymous',
            _______isFunctionId: true
        }, _anonymous);
    })();

    /*/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/knights-tour.ts*/(function () {
        function _anonymous(memo, count) {
            return memo + count;
        }

        function knightTours(startPath, environment) {
            var moves = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }];var boardSize = environment.boardSize;var board = environment.board;var numberOfFields = boardSize * boardSize;var results = 0;var stack = startPath.map(function (pos, index) {
                return { coordinate: pos, n: index + 1 };
            });for (var index = 0; index < startPath.length - 1; ++index) {
                var fieldIndex = startPath[index].x * boardSize + startPath[index].y;board[fieldIndex] = index + 1;
            }while (stack.length > 0) {
                var _stack = stack[stack.length - 1];
                var coordinate = _stack.coordinate;
                var n = _stack.n;
                var _fieldIndex = coordinate.x * boardSize + coordinate.y;if (board[_fieldIndex] !== 0) {
                    // back tracking
                    board[_fieldIndex] = 0;stack.pop(); // remove current value
                    continue;
                } // entry
                if (n === numberOfFields) {
                    ++results;stack.pop();continue;
                }board[_fieldIndex] = n;var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = moves[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var move = _step5.value;
                        var successor = { x: coordinate.x + move.x, y: coordinate.y + move.y }; // not outside of board and not yet accessed
                        var accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize && successor.y < boardSize && board[successor.x * boardSize + successor.y] === 0;if (accessible) {
                            stack.push({ coordinate: successor, n: n + 1 });
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }return results;
        }function createEnvironment(boardSize) {
            var board = new Array(boardSize * boardSize);board.fill(0);return { board: board, boardSize: boardSize };
        }slaveFunctionLookupTable.registerStaticFunction({
            identifier: 'static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/knights-tour.ts/_anonymous',
            _______isFunctionId: true
        }, _anonymous);
        slaveFunctionLookupTable.registerStaticFunction({
            identifier: 'static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/knights-tour.ts/knightTours',
            _______isFunctionId: true
        }, knightTours);
        slaveFunctionLookupTable.registerStaticFunction({
            identifier: 'static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/knights-tour.ts/createEnvironment',
            _______isFunctionId: true
        }, createEnvironment);
    })();

    /*/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/monte-carlo.ts*/(function () {
        function calculateRequiredAmount(project, projectsByStartYear) {
            var amount = project.totalAmount;var projectsSameYear = projectsByStartYear[project.startYear];var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = projectsSameYear[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var otherProject = _step6.value;
                    if (otherProject === project) {
                        break;
                    }amount += otherProject.totalAmount;
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return amount;
        }function createGroups(requiredAmount, noInterestReference, liquidity) {
            return [{ description: "Ziel erreichbar", from: requiredAmount, name: "green", percentage: 0, separator: true }, { description: "mit Zusatzliquidität erreichbar", from: requiredAmount - liquidity, name: "yellow", percentage: 0, separator: true, to: requiredAmount }, { description: "nicht erreichbar", from: noInterestReference, name: "gray", percentage: 0, separator: false, to: requiredAmount - liquidity }, { description: "nicht erreichbar, mit Verlust", name: "red", percentage: 0, separator: false, to: noInterestReference }];
        }function groupForValue(value, groups) {
            return groups.find(function (group) {
                return (typeof group.from === "undefined" || group.from <= value) && (typeof group.to === "undefined" || group.to > value);
            });
        }function median(values) {
            var half = Math.floor(values.length / 2);if (values.length % 2) {
                return values[half];
            }return (values[half - 1] + values[half]) / 2.0;
        }function calculateProject(project, environment) {
            var NUMBER_OF_BUCKETS = 10;var requiredAmount = calculateRequiredAmount(project, environment.projectsByStartYear);var simulatedValuesThisYear = environment.simulatedValues[project.startYear];simulatedValuesThisYear.sort(function (a, b) {
                return a - b;
            });var groups = createGroups(requiredAmount, environment.noInterestReferenceLine[project.startYear], environment.liquidity);var valuesByGroup = {};var bucketSize = Math.round(simulatedValuesThisYear.length / NUMBER_OF_BUCKETS);var buckets = [];for (var i = 0; i < simulatedValuesThisYear.length; i += bucketSize) {
                var bucket = { max: Number.MIN_VALUE, min: Number.MAX_VALUE, subBuckets: {} };for (var j = i; j < i + bucketSize; ++j) {
                    var value = simulatedValuesThisYear[j];bucket.min = Math.min(bucket.min, value);bucket.max = Math.max(bucket.max, value);var group = groupForValue(simulatedValuesThisYear[j], groups);valuesByGroup[group.name] = (valuesByGroup[group.name] || 0) + 1;var subBucket = bucket.subBuckets[group.name] = bucket.subBuckets[group.name] || { group: group.name, max: Number.MIN_VALUE, min: Number.MAX_VALUE };subBucket.min = Math.min(subBucket.min, value);subBucket.max = Math.max(subBucket.max, value);
                }buckets.push(bucket);
            }var nonEmptyGroups = groups.filter(function (group) {
                return !!valuesByGroup[group.name];
            });nonEmptyGroups.forEach(function (group) {
                return group.percentage = valuesByGroup[group.name] / simulatedValuesThisYear.length;
            });var oneSixth = Math.round(simulatedValuesThisYear.length / 6);return { buckets: buckets, groups: nonEmptyGroups, max: simulatedValuesThisYear[simulatedValuesThisYear.length - 1], median: median(simulatedValuesThisYear), min: simulatedValuesThisYear[0], project: project, twoThird: { max: simulatedValuesThisYear[simulatedValuesThisYear.length - oneSixth], min: simulatedValuesThisYear[oneSixth] } };
        }function createMonteCarloEnvironment(options) {
            function projectsToCashFlows(projectsByStartYear, numYears) {
                var cashFlows = [];for (var year = 0; year < numYears; ++year) {
                    var projectsByThisYear = projectsByStartYear[year] || [];var cashFlow = -projectsByThisYear.reduce(function (memo, project) {
                        return memo + project.totalAmount;
                    }, 0);cashFlows.push(cashFlow);
                }return cashFlows;
            }function calculateNoInterestReferenceLine(cashFlows, investmentAmount, numYears) {
                var noInterestReferenceLine = [];var investmentAmountLeft = investmentAmount;for (var year = 0; year < numYears; ++year) {
                    investmentAmountLeft = investmentAmountLeft + cashFlows[year];noInterestReferenceLine.push(investmentAmountLeft);
                }return noInterestReferenceLine;
            }function toAbsoluteIndices(indices, investmentAmount, cashFlows) {
                var currentPortfolioValue = investmentAmount;var previousYearIndex = 100;for (var relativeYear = 0; relativeYear < indices.length; ++relativeYear) {
                    var currentYearIndex = indices[relativeYear];var cashFlowStartOfYear = relativeYear === 0 ? 0 : cashFlows[relativeYear - 1]; // scale current value with performance gain according to index
                    var performance = currentYearIndex / previousYearIndex;currentPortfolioValue = (currentPortfolioValue + cashFlowStartOfYear) * performance;indices[relativeYear] = Math.round(currentPortfolioValue);previousYearIndex = currentYearIndex;
                }return indices;
            } /**
               * Performs the monte carlo simulation for all years and num runs.
               * @param cashFlows the cash flows
               * @returns {number[][]} the simulated outcomes grouped by year
               */function simulateOutcomes(cashFlows, investmentAmount, _ref2) {
                var numRuns = _ref2.numRuns;
                var numYears = _ref2.numYears;
                var volatility = _ref2.volatility;
                var performance = _ref2.performance;
                var result = new Array(numYears);for (var year = 0; year <= numYears; ++year) {
                    result[year] = new Array(numRuns);
                }var random = new __WEBPACK_IMPORTED_MODULE_0_simjs_random___default.a(10);for (var run = 0; run < numRuns; run++) {
                    var indices = [100];for (var i = 1; i <= numYears; i++) {
                        var randomPerformance = 1 + random.normal(performance, volatility);indices.push(indices[i - 1] * randomPerformance);
                    } // convert the relative values from above to absolute values.
                    toAbsoluteIndices(indices, investmentAmount, cashFlows);for (var _year = 0; _year < indices.length; ++_year) {
                        result[_year][run] = indices[_year];
                    }
                }return result;
            }var projectsToSimulate = options.projects;if (options.taskIndex && options.valuesPerWorker) {
                projectsToSimulate = options.projects.slice(options.taskIndex * options.valuesPerWorker, (options.taskIndex + 1) * options.valuesPerWorker);
            }var projects = options.projects.sort(function (a, b) {
                return a.startYear - b.startYear;
            }); // Group projects by startYear, use lodash groupBy instead
            var projectsByStartYear = {};var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = projects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var project = _step7.value;
                    var arr = projectsByStartYear[project.startYear] = projectsByStartYear[project.startYear] || [];arr.push(project);
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            var cashFlows = projectsToCashFlows(projectsByStartYear, options.numYears);var noInterestReferenceLine = calculateNoInterestReferenceLine(cashFlows, options.investmentAmount, options.numYears);var numYears = projectsToSimulate.reduce(function (memo, project) {
                return Math.max(memo, project.startYear);
            }, 0);return { investmentAmount: options.investmentAmount, liquidity: options.liquidity, noInterestReferenceLine: noInterestReferenceLine, numRuns: options.numRuns, numYears: numYears, projectsByStartYear: projectsByStartYear, simulatedValues: simulateOutcomes(cashFlows, options.investmentAmount, options) };
        }slaveFunctionLookupTable.registerStaticFunction({
            identifier: 'static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/monte-carlo.ts/calculateProject',
            _______isFunctionId: true
        }, calculateProject);
        slaveFunctionLookupTable.registerStaticFunction({
            identifier: 'static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/monte-carlo.ts/createMonteCarloEnvironment',
            _______isFunctionId: true
        }, createMonteCarloEnvironment);
    })();

    var slave = new __WEBPACK_IMPORTED_MODULE_0__browser_worker_slave__["a" /* BrowserWorkerSlave */](slaveFunctionLookupTable);
    onmessage = function onmessage() {
        slave.onMessage.apply(slave, arguments);
    };

    /***/
}
/******/]);

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTgzMzlhNWYwNDFhZmViZDY1NjciLCJ3ZWJwYWNrOi8vLy4vfi9zaW1qcy1yYW5kb20vc2ltanMtcmFuZG9tLmpzIiwid2VicGFjazovLy8uL3dlYnBhY2s6L3dlYnBhY2svYm9vdHN0cmFwIDk1MGEyZjgyODQyZjgzODU3NGZkIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vdXRpbC9hcnJheXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9mdW5jdGlvbi9zZXJpYWxpemVkLWZ1bmN0aW9uLWNhbGwudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9icm93c2VyLXdvcmtlci1zbGF2ZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL3NsYXZlLWZ1bmN0aW9uLWxvb2t1cC10YWJsZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLXN0YXRlcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWNhbGwtZGVzZXJpYWxpemVyLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24taWQudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9maWx0ZXItaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9tYXAtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC1qb2ItZXhlY3V0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcmFuZ2UtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yZWR1Y2UtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL2lkZW50aXR5LnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vdXRpbC9zaW1wbGUtbWFwLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhbnNwaWxlZC9tYW5kZWxicm90LnRzIiwid2VicGFjazovLy8uL3NyYy90cmFuc3BpbGVkL2tuaWdodHMtdG91ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhbnNwaWxlZC9tb250ZS1jYXJsby50cyJdLCJuYW1lcyI6WyJpbnN0YWxsZWRNb2R1bGVzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiZXhwb3J0cyIsIm1vZHVsZSIsImkiLCJsIiwibW9kdWxlcyIsImNhbGwiLCJtIiwiYyIsInZhbHVlIiwiZCIsIm5hbWUiLCJnZXR0ZXIiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJnZXQiLCJuIiwiX19lc01vZHVsZSIsImdldERlZmF1bHQiLCJnZXRNb2R1bGVFeHBvcnRzIiwibyIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsInRvSXRlcmF0b3IiLCJkYXRhIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJ0b0FycmF5IiwicmVzdWx0IiwiY3VycmVudCIsIm5leHQiLCJkb25lIiwicHVzaCIsImZsYXR0ZW5BcnJheSIsImRlZXBBcnJheSIsImxlbmd0aCIsImhlYWQiLCJ0YWlsIiwiQXJyYXkiLCJjb25jYXQiLCJhcHBseSIsImlzU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCIsInBvdGVudGlhbEZ1bmMiLCJfX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsIiwiaXNTdG9wTWVzc3NhZ2UiLCJXb3JrZXJNZXNzYWdlVHlwZSIsImluaXRpYWxpemVXb3JrZXJNZXNzYWdlIiwiaWQiLCJ0eXBlIiwiSW5pdGlhbGl6ZVdvcmtlciIsIndvcmtlcklkIiwic2NoZWR1bGVUYXNrTWVzc2FnZSIsInRhc2siLCJTY2hlZHVsZVRhc2siLCJyZXF1ZXN0RnVuY3Rpb25NZXNzYWdlIiwiZnVuY3Rpb25JZCIsIm90aGVyRnVuY3Rpb25JZHMiLCJmdW5jdGlvbklkcyIsIkZ1bmN0aW9uUmVxdWVzdCIsImZ1bmN0aW9uUmVzcG9uc2VNZXNzYWdlIiwiZnVuY3Rpb25zIiwibWlzc2luZ0Z1bmN0aW9uSWRzIiwibWlzc2luZ0Z1bmN0aW9ucyIsIkZ1bmN0aW9uUmVzcG9uc2UiLCJ3b3JrZXJSZXN1bHRNZXNzYWdlIiwiV29ya2VyUmVzdWx0IiwiZnVuY3Rpb25FeGVjdXRpb25FcnJvciIsImVycm9yIiwiZXJyb3JPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwicHJvcCIsIkpTT04iLCJzdHJpbmdpZnkiLCJGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwic3RvcE1lc3NhZ2UiLCJTdG9wIiwiaXNTY2hlZHVsZVRhc2siLCJtZXNzYWdlIiwiaXNJbml0aWFsaXplTWVzc2FnZSIsImlzRnVuY3Rpb25SZXF1ZXN0IiwiaXNGdW5jdGlvblJlc3BvbnNlIiwiaXNXb3JrZXJSZXN1bHQiLCJpc0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IiLCJCcm93c2VyV29ya2VyU2xhdmUiLCJmdW5jdGlvbkNhY2hlIiwiTnVtYmVyIiwiTmFOIiwic3RhdGUiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX2Jyb3dzZXJfd29ya2VyX3NsYXZlX3N0YXRlc19fIiwiZW50ZXIiLCJldmVudCIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fY29tbW9uX3dvcmtlcl93b3JrZXJfbWVzc2FnZXNfXyIsImNsb3NlIiwib25NZXNzYWdlIiwiRXJyb3IiLCJwb3N0TWVzc2FnZSIsIlNsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZSIsImNhY2hlIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX191dGlsX3NpbXBsZV9tYXBfXyIsImlkZW50aWZpZXIiLCJkZWZpbml0aW9uIiwiZiIsIkZ1bmN0aW9uIiwiYXJndW1lbnROYW1lcyIsImJvZHkiLCJzZXQiLCJmdW5jIiwiaGFzIiwicmVnaXN0ZXJTdGF0aWNQYXJhbGxlbEZ1bmN0aW9ucyIsImxvb2t1cFRhYmxlIiwicmVnaXN0ZXJTdGF0aWNGdW5jdGlvbiIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fcGFyYWxsZWxfd29ya2VyX2Z1bmN0aW9uc19fIiwiSURFTlRJVFkiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX3V0aWxfaWRlbnRpdHlfXyIsIkZJTFRFUiIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fZmlsdGVyX2l0ZXJhdG9yX18iLCJNQVAiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzNfX21hcF9pdGVyYXRvcl9fIiwiUEFSQUxMRUxfSk9CX0VYRUNVVE9SIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X19wYXJhbGxlbF9qb2JfZXhlY3V0b3JfXyIsIlJBTkdFIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV81X19yYW5nZV9pdGVyYXRvcl9fIiwiUkVEVUNFIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV82X19yZWR1Y2VfaXRlcmF0b3JfXyIsIlRPX0lURVJBVE9SIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV83X191dGlsX2FycmF5c19fIiwiQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJzbGF2ZSIsIkRlZmF1bHRCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fY29tbW9uX3dvcmtlcl93b3JrZXJfbWVzc2FnZXNfXyIsImNoYW5nZVN0YXRlIiwiSWRsZUJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIiwidXNlZEZ1bmN0aW9uSWRzIiwiZmlsdGVyIiwiRXhlY3V0ZUZ1bmN0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJXYWl0aW5nRm9yRnVuY3Rpb25EZWZpbml0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJpZGVudGlmaWVycyIsIm1hcCIsImpvaW4iLCJyZWdpc3RlckZ1bmN0aW9uIiwiZnVuY3Rpb25EZXNlcmlhbGl6ZXIiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX2NvbW1vbl9mdW5jdGlvbl9mdW5jdGlvbl9jYWxsX2Rlc2VyaWFsaXplcl9fIiwibWFpbiIsImRlc2VyaWFsaXplRnVuY3Rpb25DYWxsIiwiZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIiwiRnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIiwiZnVuY3Rpb25Mb29rdXBUYWJsZSIsImZ1bmN0aW9uQ2FsbCIsImRlc2VyaWFsaXplUGFyYW1zIiwiZ2V0RnVuY3Rpb24iLCJwYXJhbXMiLCJwYXJhbWV0ZXJzIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19zZXJpYWxpemVkX2Z1bmN0aW9uX2NhbGxfXyIsInBhcmFtIiwiYWRkaXRpb25hbFBhcmFtcyIsInVuZGVmaW5lZCIsIm5hbWVzcGFjZSIsIl9fX19fX19pc0Z1bmN0aW9uSWQiLCJpc0Z1bmN0aW9uSWQiLCJvYmoiLCJmaWx0ZXJJdGVyYXRvciIsInByZWRpY2F0ZSIsImVudiIsIm1hcEl0ZXJhdG9yIiwiaXRlcmF0ZWUiLCJjcmVhdGVUYXNrRW52aXJvbm1lbnQiLCJ0YXNrRW52aXJvbm1lbnQiLCJlbnZpcm9ubWVudHMiLCJlbnZpcm9ubWVudCIsImN1cnJlbnRFbnZpcm9ubWVudCIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fZnVuY3Rpb25fc2VyaWFsaXplZF9mdW5jdGlvbl9jYWxsX18iLCJhc3NpZ24iLCJ0YXNrSW5kZXgiLCJ2YWx1ZXNQZXJUYXNrIiwicGFyYWxsZWxKb2JFeGVjdXRvciIsImdlbmVyYXRvckZ1bmN0aW9uIiwiZ2VuZXJhdG9yIiwib3BlcmF0aW9ucyIsIm9wZXJhdGlvbiIsIml0ZXJhdG9yRnVuY3Rpb24iLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX3V0aWxfYXJyYXlzX18iLCJQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19mdW5jdGlvbl9mdW5jdGlvbl9pZF9fIiwiVElNRVMiLCJyYW5nZUl0ZXJhdG9yIiwic3RhcnQiLCJlbmQiLCJzdGVwIiwicmVkdWNlSXRlcmF0b3IiLCJkZWZhdWx0VmFsdWUiLCJhY2N1bXVsYXRlZFZhbHVlIiwiaWRlbnRpdHkiLCJlbGVtZW50IiwiU2ltcGxlTWFwIiwia2V5IiwiaW50ZXJuYWxLZXkiLCJ0b0ludGVybmFsS2V5Iiwic2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19jb21tb25fZnVuY3Rpb25fc2xhdmVfZnVuY3Rpb25fbG9va3VwX3RhYmxlX18iLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfX2NvbW1vbl9wYXJhbGxlbF9zbGF2ZV9yZWdpc3Rlcl9wYXJhbGxlbF93b3JrZXJfZnVuY3Rpb25zX18iLCJ6IiwicmVhbCIsIml0ZXJhdGlvbnMiLCJ6SSIsInkiLCJsaW5lIiwiVWludDhDbGFtcGVkQXJyYXkiLCJjSSIsIngiLCJpbWFnZVdpZHRoIiwiYmFzZSIsIm1lbW8iLCJjb3VudCIsImtuaWdodFRvdXJzIiwic3RhcnRQYXRoIiwibW92ZXMiLCJib2FyZFNpemUiLCJib2FyZCIsIm51bWJlck9mRmllbGRzIiwicmVzdWx0cyIsInN0YWNrIiwicG9zIiwiaW5kZXgiLCJjb29yZGluYXRlIiwiZmllbGRJbmRleCIsInBvcCIsIm1vdmUiLCJzdWNjZXNzb3IiLCJhY2Nlc3NpYmxlIiwiY3JlYXRlRW52aXJvbm1lbnQiLCJmaWxsIiwiY2FsY3VsYXRlUmVxdWlyZWRBbW91bnQiLCJwcm9qZWN0IiwicHJvamVjdHNCeVN0YXJ0WWVhciIsImFtb3VudCIsInRvdGFsQW1vdW50IiwicHJvamVjdHNTYW1lWWVhciIsInN0YXJ0WWVhciIsIm90aGVyUHJvamVjdCIsImNyZWF0ZUdyb3VwcyIsInJlcXVpcmVkQW1vdW50Iiwibm9JbnRlcmVzdFJlZmVyZW5jZSIsImxpcXVpZGl0eSIsImRlc2NyaXB0aW9uIiwiZnJvbSIsInBlcmNlbnRhZ2UiLCJzZXBhcmF0b3IiLCJ0byIsImdyb3VwRm9yVmFsdWUiLCJncm91cHMiLCJmaW5kIiwiZ3JvdXAiLCJtZWRpYW4iLCJ2YWx1ZXMiLCJoYWxmIiwiTWF0aCIsImZsb29yIiwiY2FsY3VsYXRlUHJvamVjdCIsIk5VTUJFUl9PRl9CVUNLRVRTIiwic2ltdWxhdGVkVmFsdWVzVGhpc1llYXIiLCJzaW11bGF0ZWRWYWx1ZXMiLCJzb3J0IiwiYSIsImIiLCJub0ludGVyZXN0UmVmZXJlbmNlTGluZSIsInZhbHVlc0J5R3JvdXAiLCJidWNrZXRTaXplIiwicm91bmQiLCJidWNrZXRzIiwiYnVja2V0IiwibWF4IiwiTUlOX1ZBTFVFIiwibWluIiwiTUFYX1ZBTFVFIiwic3ViQnVja2V0cyIsImoiLCJzdWJCdWNrZXQiLCJub25FbXB0eUdyb3VwcyIsImZvckVhY2giLCJvbmVTaXh0aCIsInR3b1RoaXJkIiwiY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50Iiwib3B0aW9ucyIsInByb2plY3RzVG9DYXNoRmxvd3MiLCJudW1ZZWFycyIsImNhc2hGbG93cyIsInllYXIiLCJwcm9qZWN0c0J5VGhpc1llYXIiLCJjYXNoRmxvdyIsInJlZHVjZSIsImNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lIiwiaW52ZXN0bWVudEFtb3VudCIsImludmVzdG1lbnRBbW91bnRMZWZ0IiwidG9BYnNvbHV0ZUluZGljZXMiLCJpbmRpY2VzIiwiY3VycmVudFBvcnRmb2xpb1ZhbHVlIiwicHJldmlvdXNZZWFySW5kZXgiLCJyZWxhdGl2ZVllYXIiLCJjdXJyZW50WWVhckluZGV4IiwiY2FzaEZsb3dTdGFydE9mWWVhciIsInBlcmZvcm1hbmNlIiwic2ltdWxhdGVPdXRjb21lcyIsIm51bVJ1bnMiLCJ2b2xhdGlsaXR5IiwicmFuZG9tIiwicnVuIiwicmFuZG9tUGVyZm9ybWFuY2UiLCJub3JtYWwiLCJwcm9qZWN0c1RvU2ltdWxhdGUiLCJwcm9qZWN0cyIsInZhbHVlc1BlcldvcmtlciIsInNsaWNlIiwiYXJyIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19icm93c2VyX3dvcmtlcl9zbGF2ZV9fIiwib25tZXNzYWdlIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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LEVBS0hsQixrQkFMRyxFQU1IbkQsd0NBTkcsRUFPSDJCLGlCQUFpQnlDLGlCQUFpQmhCLFNBQWpCLEVBQTRCSCxRQUFRUyxnQkFBcEMsRUFBc0RULE9BQXRELENBUGQsRUFBUDtBQVNIOzs7V0FzQ0R6Qjs7OztXQTVJQXdCOzs7QUh0SEEsUUFBTTFKLFFBQVEsSUFBSTBMLG9EQUFBLDZCQUFKLENBQXVCcEgsd0JBQXZCLENBQWQ7QUFDQXFILGdCQUFZO0FBQ1IzTCxjQUFNbEMsU0FBTixDQUFnQnJELEtBQWhCLENBQXNCdUYsS0FBdEIsRUFBNkI0TCxTQUE3QjtBQUNILEtBRkQiLCJmaWxlIjoid29ya2VyLXNsYXZlLnBhcmFsbGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vcnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9yeSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0fSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk4MzM5YTVmMDQxYWZlYmQ2NTY3IiwiLyohXG4gKiBSYW5kb20uanMgdmVyc2lvbiAwLjIuNlxuICogY3VybCBodHRwOi8vc2ltanMuY29tL19kb3dubG9hZHMvcmFuZG9tLTAuMjYtZGVidWcuanNcbiAqL1xuXG4gLyoqIFJhbmRvbS5qcyBsaWJyYXJ5LlxuICpcbiAqIFRoZSBjb2RlIGlzIGxpY2Vuc2VkIGFzIExHUEwuXG4qL1xuXG4vKlxuICAgQSBDLXByb2dyYW0gZm9yIE1UMTk5MzcsIHdpdGggaW5pdGlhbGl6YXRpb24gaW1wcm92ZWQgMjAwMi8xLzI2LlxuICAgQ29kZWQgYnkgVGFrdWppIE5pc2hpbXVyYSBhbmQgTWFrb3RvIE1hdHN1bW90by5cblxuICAgQmVmb3JlIHVzaW5nLCBpbml0aWFsaXplIHRoZSBzdGF0ZSBieSB1c2luZyBpbml0X2dlbnJhbmQoc2VlZClcbiAgIG9yIGluaXRfYnlfYXJyYXkoaW5pdF9rZXksIGtleV9sZW5ndGgpLlxuXG4gICBDb3B5cmlnaHQgKEMpIDE5OTcgLSAyMDAyLCBNYWtvdG8gTWF0c3Vtb3RvIGFuZCBUYWt1amkgTmlzaGltdXJhLFxuICAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnNcbiAgIGFyZSBtZXQ6XG5cbiAgICAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuXG4gICAgIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuICAgICAzLiBUaGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlXG4gICAgICAgIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlblxuICAgICAgICBwZXJtaXNzaW9uLlxuXG4gICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gICBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gICBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAgIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUlxuICAgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXG4gICBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sXG4gICBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1JcbiAgIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcbiAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG4gICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAgIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuXG5cbiAgIEFueSBmZWVkYmFjayBpcyB2ZXJ5IHdlbGNvbWUuXG4gICBodHRwOi8vd3d3Lm1hdGguc2NpLmhpcm9zaGltYS11LmFjLmpwL35tLW1hdC9NVC9lbXQuaHRtbFxuICAgZW1haWw6IG0tbWF0IEAgbWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAgKHJlbW92ZSBzcGFjZSlcbiAqL1xuXG52YXIgUmFuZG9tID0gZnVuY3Rpb24oc2VlZCkge1xuXHRzZWVkID0gKHNlZWQgPT09IHVuZGVmaW5lZCkgPyAobmV3IERhdGUoKSkuZ2V0VGltZSgpIDogc2VlZDtcblx0aWYgKHR5cGVvZihzZWVkKSAhPT0gJ251bWJlcicgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHx8IE1hdGguY2VpbChzZWVkKSAhPSBNYXRoLmZsb29yKHNlZWQpKSB7ICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJzZWVkIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlclwiKTsgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXG5cdC8qIFBlcmlvZCBwYXJhbWV0ZXJzICovXG5cdHRoaXMuTiA9IDYyNDtcblx0dGhpcy5NID0gMzk3O1xuXHR0aGlzLk1BVFJJWF9BID0gMHg5OTA4YjBkZjsgICAvKiBjb25zdGFudCB2ZWN0b3IgYSAqL1xuXHR0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOyAvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG5cdHRoaXMuTE9XRVJfTUFTSyA9IDB4N2ZmZmZmZmY7IC8qIGxlYXN0IHNpZ25pZmljYW50IHIgYml0cyAqL1xuXG5cdHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsgLyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXG5cdHRoaXMubXRpPXRoaXMuTisxOyAvKiBtdGk9PU4rMSBtZWFucyBtdFtOXSBpcyBub3QgaW5pdGlhbGl6ZWQgKi9cblxuXHQvL3RoaXMuaW5pdF9nZW5yYW5kKHNlZWQpO1xuXHR0aGlzLmluaXRfYnlfYXJyYXkoW3NlZWRdLCAxKTtcbn07XG5cbi8qIGluaXRpYWxpemVzIG10W05dIHdpdGggYSBzZWVkICovXG5SYW5kb20ucHJvdG90eXBlLmluaXRfZ2VucmFuZCA9IGZ1bmN0aW9uKHMpIHtcblx0dGhpcy5tdFswXSA9IHMgPj4+IDA7XG5cdGZvciAodGhpcy5tdGk9MTsgdGhpcy5tdGk8dGhpcy5OOyB0aGlzLm10aSsrKSB7XG5cdFx0dmFyIHMgPSB0aGlzLm10W3RoaXMubXRpLTFdIF4gKHRoaXMubXRbdGhpcy5tdGktMV0gPj4+IDMwKTtcblx0XHR0aGlzLm10W3RoaXMubXRpXSA9ICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxODEyNDMzMjUzKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTgxMjQzMzI1Mylcblx0XHQrIHRoaXMubXRpO1xuXHRcdC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xuXHRcdC8qIEluIHRoZSBwcmV2aW91cyB2ZXJzaW9ucywgTVNCcyBvZiB0aGUgc2VlZCBhZmZlY3QgICAqL1xuXHRcdC8qIG9ubHkgTVNCcyBvZiB0aGUgYXJyYXkgbXRbXS4gICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcdC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xuXHRcdHRoaXMubXRbdGhpcy5tdGldID4+Pj0gMDtcblx0XHQvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xuXHR9XG59O1xuXG4vKiBpbml0aWFsaXplIGJ5IGFuIGFycmF5IHdpdGggYXJyYXktbGVuZ3RoICovXG4vKiBpbml0X2tleSBpcyB0aGUgYXJyYXkgZm9yIGluaXRpYWxpemluZyBrZXlzICovXG4vKiBrZXlfbGVuZ3RoIGlzIGl0cyBsZW5ndGggKi9cbi8qIHNsaWdodCBjaGFuZ2UgZm9yIEMrKywgMjAwNC8yLzI2ICovXG5SYW5kb20ucHJvdG90eXBlLmluaXRfYnlfYXJyYXkgPSBmdW5jdGlvbihpbml0X2tleSwga2V5X2xlbmd0aCkge1xuXHR2YXIgaSwgaiwgaztcblx0dGhpcy5pbml0X2dlbnJhbmQoMTk2NTAyMTgpO1xuXHRpPTE7IGo9MDtcblx0ayA9ICh0aGlzLk4+a2V5X2xlbmd0aCA/IHRoaXMuTiA6IGtleV9sZW5ndGgpO1xuXHRmb3IgKDsgazsgay0tKSB7XG5cdFx0dmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XG5cdFx0dGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE2NjQ1MjUpIDw8IDE2KSArICgocyAmIDB4MDAwMGZmZmYpICogMTY2NDUyNSkpKVxuXHRcdCsgaW5pdF9rZXlbal0gKyBqOyAvKiBub24gbGluZWFyICovXG5cdFx0dGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG5cdFx0aSsrOyBqKys7XG5cdFx0aWYgKGk+PXRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4tMV07IGk9MTsgfVxuXHRcdGlmIChqPj1rZXlfbGVuZ3RoKSBqPTA7XG5cdH1cblx0Zm9yIChrPXRoaXMuTi0xOyBrOyBrLS0pIHtcblx0XHR2YXIgcyA9IHRoaXMubXRbaS0xXSBeICh0aGlzLm10W2ktMV0gPj4+IDMwKTtcblx0XHR0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKVxuXHRcdC0gaTsgLyogbm9uIGxpbmVhciAqL1xuXHRcdHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuXHRcdGkrKztcblx0XHRpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XG5cdH1cblxuXHR0aGlzLm10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi9cbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMHhmZmZmZmZmZl0taW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9pbnQzMiA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgeTtcblx0dmFyIG1hZzAxID0gbmV3IEFycmF5KDB4MCwgdGhpcy5NQVRSSVhfQSk7XG5cdC8qIG1hZzAxW3hdID0geCAqIE1BVFJJWF9BICBmb3IgeD0wLDEgKi9cblxuXHRpZiAodGhpcy5tdGkgPj0gdGhpcy5OKSB7IC8qIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWUgKi9cblx0XHR2YXIga2s7XG5cblx0XHRpZiAodGhpcy5tdGkgPT0gdGhpcy5OKzEpICAgLyogaWYgaW5pdF9nZW5yYW5kKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCwgKi9cblx0XHRcdHRoaXMuaW5pdF9nZW5yYW5kKDU0ODkpOyAvKiBhIGRlZmF1bHQgaW5pdGlhbCBzZWVkIGlzIHVzZWQgKi9cblxuXHRcdGZvciAoa2s9MDtrazx0aGlzLk4tdGhpcy5NO2trKyspIHtcblx0XHRcdHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xuXHRcdFx0dGhpcy5tdFtra10gPSB0aGlzLm10W2trK3RoaXMuTV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblx0XHR9XG5cdFx0Zm9yICg7a2s8dGhpcy5OLTE7a2srKykge1xuXHRcdFx0eSA9ICh0aGlzLm10W2trXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10W2trKzFdJnRoaXMuTE9XRVJfTUFTSyk7XG5cdFx0XHR0aGlzLm10W2trXSA9IHRoaXMubXRba2srKHRoaXMuTS10aGlzLk4pXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXHRcdH1cblx0XHR5ID0gKHRoaXMubXRbdGhpcy5OLTFdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRbMF0mdGhpcy5MT1dFUl9NQVNLKTtcblx0XHR0aGlzLm10W3RoaXMuTi0xXSA9IHRoaXMubXRbdGhpcy5NLTFdIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cblx0XHR0aGlzLm10aSA9IDA7XG5cdH1cblxuXHR5ID0gdGhpcy5tdFt0aGlzLm10aSsrXTtcblxuXHQvKiBUZW1wZXJpbmcgKi9cblx0eSBePSAoeSA+Pj4gMTEpO1xuXHR5IF49ICh5IDw8IDcpICYgMHg5ZDJjNTY4MDtcblx0eSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xuXHR5IF49ICh5ID4+PiAxOCk7XG5cblx0cmV0dXJuIHkgPj4+IDA7XG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4N2ZmZmZmZmZdLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfaW50MzEgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICh0aGlzLmdlbnJhbmRfaW50MzIoKT4+PjEpO1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxXS1yZWFsLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfcmVhbDEgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5NS4wKTtcblx0LyogZGl2aWRlZCBieSAyXjMyLTEgKi9cbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMSktcmVhbC1pbnRlcnZhbCAqL1xuUmFuZG9tLnByb3RvdHlwZS5yYW5kb20gPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMucHl0aG9uQ29tcGF0aWJpbGl0eSkge1xuXHRcdGlmICh0aGlzLnNraXApIHtcblx0XHRcdHRoaXMuZ2VucmFuZF9pbnQzMigpO1xuXHRcdH1cblx0XHR0aGlzLnNraXAgPSB0cnVlO1xuXHR9XG5cdHJldHVybiB0aGlzLmdlbnJhbmRfaW50MzIoKSooMS4wLzQyOTQ5NjcyOTYuMCk7XG5cdC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiAoMCwxKS1yZWFsLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfcmVhbDMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICh0aGlzLmdlbnJhbmRfaW50MzIoKSArIDAuNSkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuXHQvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMSkgd2l0aCA1My1iaXQgcmVzb2x1dGlvbiovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfcmVzNTMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGE9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj41LCBiPXRoaXMuZ2VucmFuZF9pbnQzMigpPj4+Njtcblx0cmV0dXJuKGEqNjcxMDg4NjQuMCtiKSooMS4wLzkwMDcxOTkyNTQ3NDA5OTIuMCk7XG59O1xuXG4vKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblJhbmRvbS5wcm90b3R5cGUuTE9HNCA9IE1hdGgubG9nKDQuMCk7XG5SYW5kb20ucHJvdG90eXBlLlNHX01BR0lDQ09OU1QgPSAxLjAgKyBNYXRoLmxvZyg0LjUpO1xuXG5SYW5kb20ucHJvdG90eXBlLmV4cG9uZW50aWFsID0gZnVuY3Rpb24gKGxhbWJkYSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcImV4cG9uZW50aWFsKCkgbXVzdCBcIiAgICAgLy8gQVJHX0NIRUNLXG5cdFx0XHRcdCsgXCIgYmUgY2FsbGVkIHdpdGggJ2xhbWJkYScgcGFyYW1ldGVyXCIpOyAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdHZhciByID0gdGhpcy5yYW5kb20oKTtcblx0cmV0dXJuIC1NYXRoLmxvZyhyKSAvIGxhbWJkYTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUuZ2FtbWEgPSBmdW5jdGlvbiAoYWxwaGEsIGJldGEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJnYW1tYSgpIG11c3QgYmUgY2FsbGVkXCIgIC8vIEFSR19DSEVDS1xuXHRcdFx0XHQrIFwiIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVyc1wiKTsgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHQvKiBCYXNlZCBvbiBQeXRob24gMi42IHNvdXJjZSBjb2RlIG9mIHJhbmRvbS5weS5cblx0ICovXG5cblx0aWYgKGFscGhhID4gMS4wKSB7XG5cdFx0dmFyIGFpbnYgPSBNYXRoLnNxcnQoMi4wICogYWxwaGEgLSAxLjApO1xuXHRcdHZhciBiYmIgPSBhbHBoYSAtIHRoaXMuTE9HNDtcblx0XHR2YXIgY2NjID0gYWxwaGEgKyBhaW52O1xuXG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0XHRpZiAoKHUxIDwgMWUtNykgfHwgKHUgPiAwLjk5OTk5OTkpKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHUyID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcblx0XHRcdHZhciB2ID0gTWF0aC5sb2codTEgLyAoMS4wIC0gdTEpKSAvIGFpbnY7XG5cdFx0XHR2YXIgeCA9IGFscGhhICogTWF0aC5leHAodik7XG5cdFx0XHR2YXIgeiA9IHUxICogdTEgKiB1Mjtcblx0XHRcdHZhciByID0gYmJiICsgY2NjICogdiAtIHg7XG5cdFx0XHRpZiAoKHIgKyB0aGlzLlNHX01BR0lDQ09OU1QgLSA0LjUgKiB6ID49IDAuMCkgfHwgKHIgPj0gTWF0aC5sb2coeikpKSB7XG5cdFx0XHRcdHJldHVybiB4ICogYmV0YTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAoYWxwaGEgPT0gMS4wKSB7XG5cdFx0dmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdHdoaWxlICh1IDw9IDFlLTcpIHtcblx0XHRcdHUgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gLSBNYXRoLmxvZyh1KSAqIGJldGE7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdHZhciB1ID0gdGhpcy5yYW5kb20oKTtcblx0XHRcdHZhciBiID0gKE1hdGguRSArIGFscGhhKSAvIE1hdGguRTtcblx0XHRcdHZhciBwID0gYiAqIHU7XG5cdFx0XHRpZiAocCA8PSAxLjApIHtcblx0XHRcdFx0dmFyIHggPSBNYXRoLnBvdyhwLCAxLjAgLyBhbHBoYSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgeCA9IC0gTWF0aC5sb2coKGIgLSBwKSAvIGFscGhhKTtcblx0XHRcdH1cblx0XHRcdHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0XHRpZiAocCA+IDEuMCkge1xuXHRcdFx0XHRpZiAodTEgPD0gTWF0aC5wb3coeCwgKGFscGhhIC0gMS4wKSkpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh1MSA8PSBNYXRoLmV4cCgteCkpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB4ICogYmV0YTtcblx0fVxuXG59O1xuXG5SYW5kb20ucHJvdG90eXBlLm5vcm1hbCA9IGZ1bmN0aW9uIChtdSwgc2lnbWEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwibm9ybWFsKCkgbXVzdCBiZSBjYWxsZWRcIiAgLy8gQVJHX0NIRUNLXG5cdFx0XHRcdCsgXCIgd2l0aCBtdSBhbmQgc2lnbWEgcGFyYW1ldGVyc1wiKTsgICAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHR2YXIgeiA9IHRoaXMubGFzdE5vcm1hbDtcblx0dGhpcy5sYXN0Tm9ybWFsID0gTmFOO1xuXHRpZiAoIXopIHtcblx0XHR2YXIgYSA9IHRoaXMucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcblx0XHR2YXIgYiA9IE1hdGguc3FydCgtMi4wICogTWF0aC5sb2coMS4wIC0gdGhpcy5yYW5kb20oKSkpO1xuXHRcdHogPSBNYXRoLmNvcyhhKSAqIGI7XG5cdFx0dGhpcy5sYXN0Tm9ybWFsID0gTWF0aC5zaW4oYSkgKiBiO1xuXHR9XG5cdHJldHVybiBtdSArIHogKiBzaWdtYTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUucGFyZXRvID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwicGFyZXRvKCkgbXVzdCBiZSBjYWxsZWRcIiAvLyBBUkdfQ0hFQ0tcblx0XHRcdFx0KyBcIiB3aXRoIGFscGhhIHBhcmFtZXRlclwiKTsgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHR2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG5cdHJldHVybiAxLjAgLyBNYXRoLnBvdygoMSAtIHUpLCAxLjAgLyBhbHBoYSk7XG59O1xuXG5SYW5kb20ucHJvdG90eXBlLnRyaWFuZ3VsYXIgPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyLCBtb2RlKSB7XG5cdC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVHJpYW5ndWxhcl9kaXN0cmlidXRpb25cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMykgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJ0cmlhbmd1bGFyKCkgbXVzdCBiZSBjYWxsZWRcIiAvLyBBUkdfQ0hFQ0tcblx0XHQrIFwiIHdpdGggbG93ZXIsIHVwcGVyIGFuZCBtb2RlIHBhcmFtZXRlcnNcIik7ICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblx0dmFyIGMgPSAobW9kZSAtIGxvd2VyKSAvICh1cHBlciAtIGxvd2VyKTtcblx0dmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuXG5cdGlmICh1IDw9IGMpIHtcblx0XHRyZXR1cm4gbG93ZXIgKyBNYXRoLnNxcnQodSAqICh1cHBlciAtIGxvd2VyKSAqIChtb2RlIC0gbG93ZXIpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdXBwZXIgLSBNYXRoLnNxcnQoKDEgLSB1KSAqICh1cHBlciAtIGxvd2VyKSAqICh1cHBlciAtIG1vZGUpKTtcblx0fVxufTtcblxuUmFuZG9tLnByb3RvdHlwZS51bmlmb3JtID0gZnVuY3Rpb24gKGxvd2VyLCB1cHBlcikge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcInVuaWZvcm0oKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdCsgXCIgd2l0aCBsb3dlciBhbmQgdXBwZXIgcGFyYW1ldGVyc1wiKTsgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0cmV0dXJuIGxvd2VyICsgdGhpcy5yYW5kb20oKSAqICh1cHBlciAtIGxvd2VyKTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUud2VpYnVsbCA9IGZ1bmN0aW9uIChhbHBoYSwgYmV0YSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcIndlaWJ1bGwoKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdCsgXCIgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzXCIpOyAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHR2YXIgdSA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG5cdHJldHVybiBhbHBoYSAqIE1hdGgucG93KC1NYXRoLmxvZyh1KSwgMS4wIC8gYmV0YSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc2ltanMtcmFuZG9tL3NpbWpzLXJhbmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9yeSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb3J5IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk1MGEyZjgyODQyZjgzODU3NGZkXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vd2VicGFjazovd2VicGFjay9ib290c3RyYXAgOTUwYTJmODI4NDJmODM4NTc0ZmQiLCIvKipcbiAqIENyZWF0ZXMgYW4gaXRlcmF0b3IgdGhhdCBpdGVyYXRlcyBvdmVyIHRoZSBnaXZlbiBhcnJheVxuICogQHBhcmFtIGRhdGEgdGhlIGFycmF5XG4gKiBAcGFyYW0gVCBlbGVtZW50IHR5cGVcbiAqIEByZXR1cm5zIHRoZSBpdGVyYXRvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9JdGVyYXRvcjxUPihkYXRhOiBUW10pOiBJdGVyYXRvcjxUPiB7XG4gICAgcmV0dXJuIGRhdGFbU3ltYm9sLml0ZXJhdG9yXSgpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBnaXZlbiBpdGVyYXRvciB0byBhbiBhcnJheVxuICogQHBhcmFtIGl0ZXJhdG9yIHRoZSBpdGVyYXRvciB0aGF0IGlzIHRvIGJlIGNvbnZlcnRlZCBpbnRvIGFuIGFycmF5XG4gKiBAcGFyYW0gVCBlbGVtZW50IHR5cGVcbiAqIEByZXR1cm5zIHtUW119IHRoZSBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gaXRlcmF0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXk8VD4oaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+KTogVFtdIHtcbiAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50OiBJdGVyYXRvclJlc3VsdDxUPjtcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1jb25kaXRpb25hbC1hc3NpZ25tZW50ICovXG4gICAgd2hpbGUgKCEoY3VycmVudCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICByZXN1bHQucHVzaChjdXJyZW50LnZhbHVlIGFzIFQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZsYXR0ZW5zIHRoZSBnaXZlbiBhcnJheS5cbiAqIEBwYXJhbSBkZWVwQXJyYXkgdGhlIGFycmF5IHRvIGZsYXR0ZW5cbiAqIEBwYXJhbSB0eXBlIG9mIHRoZSBhcnJheSBlbGVtZW50c1xuICogQHJldHVybnMgcmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgdmFsdWVzIGNvbnRhaW5lZCBpbiB0aGUgc3ViIGFycmF5cyBvZiBkZWVwIGFycmF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkFycmF5PFQ+KGRlZXBBcnJheTogVFtdW10pOiBUW10ge1xuICAgIGlmIChkZWVwQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBbaGVhZCwgLi4udGFpbF0gPSBkZWVwQXJyYXk7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoaGVhZCwgdGFpbCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3V0aWwvYXJyYXlzLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL2FycmF5cy50cyIsIi8qKlxuICogQG1vZHVsZSBwYXJhbGxlbFxuICovXG4vKiogKi9cblxuaW1wb3J0IHtJRnVuY3Rpb25JZH0gZnJvbSBcIi4vZnVuY3Rpb24taWRcIjtcblxuLyoqXG4gKiBTZXJpYWxpemVkIHJlcHJlc2VudGF0aW9uIG9mIGEgZnVuY3Rpb24gY2FsbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTZXJpYWxpemVkRnVuY3Rpb25DYWxsIHtcbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGZ1bmN0aW9uIHRvIGludm9rZSAoe0BsaW5rIElGdW5jdGlvbkRlZmluaXRpb24uaWR9KVxuICAgICAqL1xuICAgIGZ1bmN0aW9uSWQ6IElGdW5jdGlvbklkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgZnVuY3Rpb24gd2hlbiBjYWxsZWRcbiAgICAgKi9cbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBhbnlbXTtcblxuICAgIC8qKlxuICAgICAqIE1hcmtlciB0aGF0IGluZGljYXRlcyB0aGF0IHRoaXMgb2JqZWN0IGlzIGEgc2VyaWFsaXplZCBmdW5jdGlvbiBjYWxsXG4gICAgICovXG4gICAgcmVhZG9ubHkgX19fX19fc2VyaWFsaXplZEZ1bmN0aW9uQ2FsbDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgc2VyaWFsaXplZCBmdW5jdGlvbiBjYWxsXG4gKiBAcGFyYW0gcG90ZW50aWFsRnVuYyBhIHBvdGVudGlhbGx5IHNlcmlhbGl6ZWQgZnVuY3Rpb24gY2FsbFxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQgaXMgYSBzZXJpYWxpemVkIGZ1bmN0aW9uIGNhbGwsIGZhbHNlIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsKHBvdGVudGlhbEZ1bmM6IGFueSk6IHBvdGVudGlhbEZ1bmMgaXMgSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGwge1xuICAgIHJldHVybiAhIXBvdGVudGlhbEZ1bmMgJiYgcG90ZW50aWFsRnVuYy5fX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsID09PSB0cnVlO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9mdW5jdGlvbi9zZXJpYWxpemVkLWZ1bmN0aW9uLWNhbGwudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL3NlcmlhbGl6ZWQtZnVuY3Rpb24tY2FsbC50cyIsImltcG9ydCB7SVRhc2tEZWZpbml0aW9ufSBmcm9tIFwiLi4vdGFzay90YXNrLWRlZmluaXRpb25cIjtcbmltcG9ydCB7SUZ1bmN0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4uL2Z1bmN0aW9uL2Z1bmN0aW9uLWRlZmludGlvblwiO1xuaW1wb3J0IHtJRnVuY3Rpb25JZH0gZnJvbSBcIi4uL2Z1bmN0aW9uL2Z1bmN0aW9uLWlkXCI7XG5cbi8qKlxuICogTWVzc2FnZSB0eXBlc1xuICovXG5leHBvcnQgY29uc3QgZW51bSBXb3JrZXJNZXNzYWdlVHlwZSB7XG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgZmFjYWRlIHRvIHRoZSB3b3JrZXIgc2xhdmUgdG8gaW5pdGlhbGl6ZSB0aGUgc2xhdmUuXG4gICAgICovXG4gICAgSW5pdGlhbGl6ZVdvcmtlcixcblxuICAgIC8qKlxuICAgICAqIFNlbnQgZnJvbSB0aGUgd29ya2VyIGZhY2FkZSB0byB0aGUgd29ya2VyIHNsYXZlIHRvIHNjaGVkdWxlIGEgbmV3IHRhc2sgb24gdGhlIHNsYXZlLlxuICAgICAqL1xuICAgIFNjaGVkdWxlVGFzayxcblxuICAgIC8qKlxuICAgICAqIFNlbmQgZnJvbSB0aGUgd29ya2VyIHNsYXZlIHRvIHRoZSB3b3JrZXIgdGhyZWFkIHRvIHJlcXVlc3QgdGhlIGRlZmluaXRpb24gb2YgYSBmdW5jdGlvbiBuZWVkZWQgdG8gZXhlY3V0ZSBhIHNjaGVkdWxlZCB0YXNrXG4gICAgICovXG4gICAgRnVuY3Rpb25SZXF1ZXN0LFxuXG4gICAgLyoqXG4gICAgICogU2VuZCBmcm9tIHRoZSB3b3JrZXIgdGhyZWFkIHRvIHRoZSB3b3JrZXIgc2xhdmUgYXMgcmVzcG9uc2UgdG8gYSB7QGxpbmsgV29ya2VyTWVzc2FnZVR5cGUuRnVuY3Rpb25SZXF1ZXN0fS4gSW5jbHVkZXNcbiAgICAgKiB0aGUgZGVmaW5pdGlvbnMgb2YgYWxsIHJlcXVlc3RlZCBmdW5jdGlvbnNcbiAgICAgKi9cbiAgICBGdW5jdGlvblJlc3BvbnNlLFxuXG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgc2xhdmUgdG8gdGhlIHdvcmtlciB0aHJlYWQgY29udGFpbmluZyB0aGUgY29tcHV0ZWQgcmVzdWx0XG4gICAgICovXG4gICAgV29ya2VyUmVzdWx0LFxuXG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgc2xhdmUgdG8gdGhlIHdvcmtlciB0aHJlYWQgZm9yIHRoZSBjYXNlIGFuIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgZXZhbHVhdGlvbiBvZiB0aGUgc2NoZWR1bGVkIHRhc2suXG4gICAgICovXG4gICAgRnVuY3Rpb25FeGVjdXRpb25FcnJvcixcblxuICAgIC8qKlxuICAgICAqIFNlbnQgZnJvbSB0aGUgd29ya2VyIHRocmVhZCB0byB0aGUgd29ya2VyIHNsYXZlIHRvIHJlcXVlc3QgdGhlIHNsYXZlIHRvIHRlcm1pbmF0ZS5cbiAgICAgKi9cbiAgICBTdG9wXG59XG5cbi8qKlxuICogTWVzc2FnZSB0aGF0IGlzIGV4Y2hhbmdlZCBiZXR3ZWVuIGEgd29ya2VyIHNsYXZlIGFuZCB0aGUgd29ya2VyIHRocmVhZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJV29ya2VyTWVzc2FnZSB7XG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIG1lc3NhZ2UuXG4gICAgICovXG4gICAgdHlwZTogV29ya2VyTWVzc2FnZVR5cGU7XG59XG5cbi8qKlxuICogU2VudCB0byBpbml0aWFsaXplIHRoZSB3b3JrZXIgc2xhdmUgYW5kIGFzc2lnbnMgdGhlIGdpdmVuIHVuaXF1ZSBpZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElJbml0aWFsaXplV29ya2VyTWVzc2FnZSBleHRlbmRzIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBVbmlxdWUgaWQgb2YgdGhlIHdvcmtlciAoZmFjYWRlIC8gc2xhdmUpXG4gICAgICovXG4gICAgd29ya2VySWQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZXMgdGhlIGdpdmVuIHRhc2sgb24gdGhlIHdvcmtlciBzbGF2ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2NoZWR1bGVUYXNrTWVzc2FnZSBleHRlbmRzIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBUYXNrIHRvIGV4ZWN1dGUgb24gdGhlIHdvcmtlciBzbGF2ZVxuICAgICAqL1xuICAgIHRhc2s6IElUYXNrRGVmaW5pdGlvbjtcbn1cblxuLyoqXG4gKiBTZW50IGJ5IHRoZSB3b3JrZXIgc2xhdmUgdG8gcmVxdWVzdCB0aGUgZnVuY3Rpb24gZGVmaW5pdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gaWRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvblJlcXVlc3QgZXh0ZW5kcyBJV29ya2VyTWVzc2FnZSB7XG4gICAgLyoqXG4gICAgICogVGhlIGlkcyBvZiB0aGUgcmVxdWVzdGVkIGZ1bmN0aW9uc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uSWRzOiBJRnVuY3Rpb25JZFtdO1xufVxuXG4vKipcbiAqIFJlc3BvbnNlIHRvIGEge0BsaW5rIElGdW5jdGlvblJlcXVlc3R9LiBDb250YWlucyB0aGUgZGVmaW5pdGlvbnMgZm9yIGFsbCByZXF1ZXN0ZWQgZnVuY3Rpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvblJlc3BvbnNlIGV4dGVuZHMgSVdvcmtlck1lc3NhZ2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBkZWZpbml0aW9uIG9mIHRoZSByZXF1ZXN0ZWQgZnVuY3Rpb25zXG4gICAgICovXG4gICAgZnVuY3Rpb25zOiBJRnVuY3Rpb25EZWZpbml0aW9uW107XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBjb250YWluaW5nIHRoZSBpZHMgb2YgdGhlIGZ1bmN0aW9ucyB0aGF0IGNvdWxkIG5vdCBiZSByZXNvbHZlZFxuICAgICAqL1xuICAgIG1pc3NpbmdGdW5jdGlvbnM6IElGdW5jdGlvbklkW107XG59XG5cbi8qKlxuICogU2VudCBmcm9tIHRoZSB3b3JrZXIgc2xhdmUgdG8gdGhlIHdvcmtlciB0aHJlYWQgdG8gcmVwb3J0IHRoZSBjb21wdXRlZCByZXN1bHQuXG4gKiBUaGVyZWFmdGVyLCB0aGUgd29ya2VyIHNsYXZlIGlzIHJlYWR5IHRvIGFjY2VwdCBmdXJ0aGVyIHRhc2tzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElXb3JrZXJSZXN1bHRNZXNzYWdlIGV4dGVuZHMgSVdvcmtlck1lc3NhZ2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBjb21wdXRlZCByZXN1bHQgZm9yIHRoZSB7QGxpbmsgSVNjaGVkdWxlVGFza01lc3NhZ2V9XG4gICAgICovXG4gICAgcmVzdWx0OiBhbnk7XG59XG5cbi8qKlxuICogU2VudCBmcm9tIHRoZSB3b3JrZXIgdG8gcmVwb3J0IGFuIGVycm9yIGR1cmluZyB0aGUgZXhlY3V0aW9uIG9mIHRoZSBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRnVuY3Rpb25FeGVjdXRpb25FcnJvciBleHRlbmRzIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgb2NjdXJyZWQgZXJyb3IuIE5vdCBhbiBpbnN0YW5jZSBvZiBFcnJvci4gRXJyb3IgaXMgbm90IGNsb25lYWJsZS5cbiAgICAgKi9cbiAgICBlcnJvcjogYW55O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gaW5pdGlhbGl6ZSB3b3JrZXIgbWVzc2FnZVxuICogQHBhcmFtIGlkIHRoZSB1bmlxdWUgaWQgb2YgdGhlIHdvcmtlclxuICogQHJldHVybnMgdGhlIGluaXRpYWxpemUgd29ya2VyIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVXb3JrZXJNZXNzYWdlKGlkOiBudW1iZXIpOiBJSW5pdGlhbGl6ZVdvcmtlck1lc3NhZ2Uge1xuICAgIHJldHVybiB7IHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLkluaXRpYWxpemVXb3JrZXIsIHdvcmtlcklkOiBpZCB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtZXNzYWdlIHRvIHNjaGVkdWxlIHRoZSBnaXZlbiB0YXNrIG9uIGEgd29ya2VyIHNsYXZlXG4gKiBAcGFyYW0gdGFzayB0aGUgdGFzayB0byBzY2hlZHVsZVxuICogQHJldHVybnMgdGhlIHNjaGVkdWxlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlVGFza01lc3NhZ2UodGFzazogSVRhc2tEZWZpbml0aW9uKTogSVNjaGVkdWxlVGFza01lc3NhZ2Uge1xuICAgIHJldHVybiB7IHRhc2ssIHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLlNjaGVkdWxlVGFza307XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiB7QGxpbmsgSUZ1bmN0aW9uUmVxdWVzdH0gbWVzc2FnZSB0aGF0IHJlcXVlc3RzIHRoZSBnaXZlbiBmdW5jdGlvbiBpZHMgZnJvbSB0aGUgd29ya2VyIHRocmVhZFxuICogQHBhcmFtIGZ1bmN0aW9uSWQgdGhlIGlkIG9mIGEgZnVuY3Rpb24gdG8gcmVxdWVzdFxuICogQHBhcmFtIG90aGVyRnVuY3Rpb25JZHMgYWRkaXRpb25hbCBpZHMgdG8gcmVxdWVzdCBmcm9tIHRoZSB3b3JrZXIgc2xhdmVcbiAqIEByZXR1cm5zIHRoZSBmdW5jdGlvbiByZXF1ZXN0IG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RGdW5jdGlvbk1lc3NhZ2UoZnVuY3Rpb25JZDogSUZ1bmN0aW9uSWQsIC4uLm90aGVyRnVuY3Rpb25JZHM6IElGdW5jdGlvbklkW10pOiBJRnVuY3Rpb25SZXF1ZXN0IHtcbiAgICByZXR1cm4geyBmdW5jdGlvbklkczogW2Z1bmN0aW9uSWQsIC4uLm90aGVyRnVuY3Rpb25JZHNdLCB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvblJlcXVlc3QgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gcmVzcG9uc2UgbWVzc2FnZSBjb250YWluaW5nIHRoZSBwYXNzZWQgZnVuY3Rpb24gZGVmaW5pdGlvbnNcbiAqIEBwYXJhbSBmdW5jdGlvbnMgdGhlIGZ1bmN0aW9uIGRlZmluaXRpb25zIHRvIHJlc3BvbmQgdG8gdGhlIHdvcmtlciBzbGF2ZVxuICogQHJldHVybnMgdGhlIGZ1bmN0aW9uIHJlc3BvbnNlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZ1bmN0aW9uUmVzcG9uc2VNZXNzYWdlKGZ1bmN0aW9uczogSUZ1bmN0aW9uRGVmaW5pdGlvbltdLCAuLi5taXNzaW5nRnVuY3Rpb25JZHM6IElGdW5jdGlvbklkW10pOiBJRnVuY3Rpb25SZXNwb25zZSB7XG4gICAgcmV0dXJuIHsgZnVuY3Rpb25zLCBtaXNzaW5nRnVuY3Rpb25zOiBtaXNzaW5nRnVuY3Rpb25JZHMsIHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLkZ1bmN0aW9uUmVzcG9uc2UgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgd29ya2VyIHJlc3VsdCBtZXNzYWdlIGZvciB0aGUgZ2l2ZW4gcmVzdWx0XG4gKiBAcGFyYW0gcmVzdWx0IHRoZSBjb21wdXRlZCByZXN1bHQgZm9yIHRoZSBzY2hlZHVsZWQgdGFza1xuICogQHJldHVybnMgdGhlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdvcmtlclJlc3VsdE1lc3NhZ2UocmVzdWx0OiBhbnkpOiBJV29ya2VyUmVzdWx0TWVzc2FnZSB7XG4gICAgcmV0dXJuIHsgcmVzdWx0LCB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZS5Xb3JrZXJSZXN1bHQgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gZXhlY3V0aW9uIGVycm9yIG1lc3NhZ2UgY29udGFpbmluZyB0aGUgZ2l2ZW4gZXJyb3JcbiAqIEBwYXJhbSBlcnJvciB0aGUgZXJyb3Igb2JqZWN0IHRocm93biBieSB0aGUgdGFzayBjb21wdXRhdGlvblxuICogQHJldHVybnMgdGhlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IoZXJyb3I6IEVycm9yKTogSUZ1bmN0aW9uRXhlY3V0aW9uRXJyb3Ige1xuICAgIGxldCBlcnJvck9iamVjdDoge1twcm9wOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHByb3Agb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZXJyb3IpKSB7XG4gICAgICAgIGVycm9yT2JqZWN0W3Byb3BdID0gSlNPTi5zdHJpbmdpZnkoKGVycm9yIGFzIGFueSlbcHJvcF0pO1xuICAgIH1cblxuICAgIHJldHVybiB7IGVycm9yOiBlcnJvck9iamVjdCwgdHlwZTogV29ya2VyTWVzc2FnZVR5cGUuRnVuY3Rpb25FeGVjdXRpb25FcnJvciB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBzdG9wIG1lc3NhZ2VcbiAqIEByZXR1cm5zIHRoZSBtZXNzYWdlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdG9wTWVzc2FnZSgpOiBJV29ya2VyTWVzc2FnZSB7XG4gICAgcmV0dXJuIHsgdHlwZTogV29ya2VyTWVzc2FnZVR5cGUuU3RvcCB9O1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGFuIHtAbGluayBJU2NoZWR1bGVUYXNrTWVzc2FnZX0gbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhbiB7QGxpbmsgSVNjaGVkdWxlVGFza01lc3NhZ2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NjaGVkdWxlVGFzayhtZXNzYWdlOiBJV29ya2VyTWVzc2FnZSk6IG1lc3NhZ2UgaXMgSVNjaGVkdWxlVGFza01lc3NhZ2Uge1xuICAgIHJldHVybiBtZXNzYWdlLnR5cGUgPT09IFdvcmtlck1lc3NhZ2VUeXBlLlNjaGVkdWxlVGFzaztcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUluaXRpYWxpemVXb3JrZXJNZXNzYWdlfSBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGFuIHtAbGluayBJSW5pdGlhbGl6ZVdvcmtlck1lc3NhZ2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0luaXRpYWxpemVNZXNzYWdlKG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJSW5pdGlhbGl6ZVdvcmtlck1lc3NhZ2Uge1xuICAgIHJldHVybiBtZXNzYWdlLnR5cGUgPT09IFdvcmtlck1lc3NhZ2VUeXBlLkluaXRpYWxpemVXb3JrZXI7XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElGdW5jdGlvblJlcXVlc3R9IG1lc3NhZ2VcbiAqIEBwYXJhbSBtZXNzYWdlIHRoZSBtZXNzYWdlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSB7QGNvZGUgdHJ1ZX0gaWYgdGhlIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElGdW5jdGlvblJlcXVlc3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uUmVxdWVzdChtZXNzYWdlOiBJV29ya2VyTWVzc2FnZSk6IG1lc3NhZ2UgaXMgSUZ1bmN0aW9uUmVxdWVzdCB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuRnVuY3Rpb25SZXF1ZXN0O1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGFuIHtAbGluayBJRnVuY3Rpb25SZXNwb25zZX0gbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uUmVzcG9uc2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uUmVzcG9uc2UobWVzc2FnZTogSVdvcmtlck1lc3NhZ2UpOiBtZXNzYWdlIGlzIElGdW5jdGlvblJlc3BvbnNlIHtcbiAgICByZXR1cm4gbWVzc2FnZS50eXBlID09PSBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvblJlc3BvbnNlO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGFuIHtAbGluayBJV29ya2VyUmVzdWx0TWVzc2FnZX0gbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhbiB7QGxpbmsgSVdvcmtlclJlc3VsdE1lc3NhZ2V9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1dvcmtlclJlc3VsdChtZXNzYWdlOiBJV29ya2VyTWVzc2FnZSk6IG1lc3NhZ2UgaXMgSVdvcmtlclJlc3VsdE1lc3NhZ2Uge1xuICAgIHJldHVybiBtZXNzYWdlLnR5cGUgPT09IFdvcmtlck1lc3NhZ2VUeXBlLldvcmtlclJlc3VsdDtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uRXhlY3V0aW9uRXJyb3J9IG1lc3NhZ2VcbiAqIEBwYXJhbSBtZXNzYWdlIHRoZSBtZXNzYWdlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSB7QGNvZGUgdHJ1ZX0gaWYgdGhlIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElGdW5jdGlvbkV4ZWN1dGlvbkVycm9yfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbkV4ZWN1dGlvbkVycm9yKG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJRnVuY3Rpb25FeGVjdXRpb25FcnJvciB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuRnVuY3Rpb25FeGVjdXRpb25FcnJvcjtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gbWVzc2FnZSBpcyBhIHN0b3AgbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhIHN0b3AgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTdG9wTWVzc3NhZ2UobWVzc2FnZTogSVdvcmtlck1lc3NhZ2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbWVzc2FnZS50eXBlID09PSBXb3JrZXJNZXNzYWdlVHlwZS5TdG9wO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzLnRzIiwiaW1wb3J0IHtpc1N0b3BNZXNzc2FnZX0gZnJvbSBcIi4uLy4uL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzXCI7XG5pbXBvcnQge0RlZmF1bHRCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSwgQnJvd3NlcldvcmtlclNsYXZlU3RhdGV9IGZyb20gXCIuL2Jyb3dzZXItd29ya2VyLXNsYXZlLXN0YXRlc1wiO1xuaW1wb3J0IHtTbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGV9IGZyb20gXCIuLi8uLi9jb21tb24vZnVuY3Rpb24vc2xhdmUtZnVuY3Rpb24tbG9va3VwLXRhYmxlXCI7XG5cbmRlY2xhcmUgZnVuY3Rpb24gcG9zdE1lc3NhZ2UoZGF0YTogYW55KTogdm9pZDtcblxuLyoqXG4gKiBXb3JrZXIgdGhyZWFkIGVuZHBvaW50IGV4ZWN1dGVkIGluIHRoZSB3ZWIgd29ya2VyIHRocmVhZC5cbiAqIEV4ZWN1dGVzIHRoZSB0YXNrcyBhc3NpZ25lZCBieSB0aGUgdGhyZWFkIHBvb2wgdmlhIHRoZSB7QGxpbmsgQnJvd3NlcldvcmtlclRocmVhZH0uXG4gKi9cbmV4cG9ydCBjbGFzcyBCcm93c2VyV29ya2VyU2xhdmUge1xuXG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBpZCBvZiB0aGUgc2xhdmUgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaWQ6IG51bWJlciA9IE51bWJlci5OYU47XG5cbiAgICBwcml2YXRlIHN0YXRlOiBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSA9IG5ldyBEZWZhdWx0QnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcyk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZnVuY3Rpb25DYWNoZTogU2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSBzdGF0ZSBvZiB0aGUgc2xhdmUgdG8gdGhlIG5ldyBzdGF0ZVxuICAgICAqIEBwYXJhbSBzdGF0ZSB0aGUgbmV3IHN0YXRlIHRvIGFzc2lnblxuICAgICAqL1xuICAgIHB1YmxpYyBjaGFuZ2VTdGF0ZShzdGF0ZTogQnJvd3NlcldvcmtlclNsYXZlU3RhdGUpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLnN0YXRlLmVudGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZWQgd2hlbiB0aGUgc2xhdmUgcmVjZWl2ZXMgYSBtZXNzYWdlIGZyb20gdGhlIHVpLXRocmVhZFxuICAgICAqIEBwYXJhbSBldmVudCB0aGUgcmVjZWl2ZWQgbWVzc2FnZVxuICAgICAqL1xuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoaXNTdG9wTWVzc3NhZ2UoZXZlbnQuZGF0YSkpIHtcbiAgICAgICAgICAgIGNsb3NlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUub25NZXNzYWdlKGV2ZW50KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNZXNzYWdlIHdpdGggdHlwZSAke2V2ZW50LmRhdGEudHlwZX0gY2Fubm90IGJlIGhhbmRsZWQgYnkgc2xhdmUgJHt0aGlzfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHBvc3RNZXNzYWdlKG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuICAgICAgICBwb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBCcm93c2VyU2xhdmUgeyBpZDogJHt0aGlzLmlkfSwgc3RhdGU6ICcke3RoaXMuc3RhdGUubmFtZX0nIH1gO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9icm93c2VyLXdvcmtlci1zbGF2ZS50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9icm93c2VyLXdvcmtlci1zbGF2ZS50cyIsImltcG9ydCB7SUZ1bmN0aW9uTG9va3VwVGFibGV9IGZyb20gXCIuL2Z1bmN0aW9uLWxvb2t1cC10YWJsZVwiO1xuaW1wb3J0IHtJRnVuY3Rpb25EZWZpbml0aW9ufSBmcm9tIFwiLi9mdW5jdGlvbi1kZWZpbnRpb25cIjtcbmltcG9ydCB7SUZ1bmN0aW9uSWR9IGZyb20gXCIuL2Z1bmN0aW9uLWlkXCI7XG5pbXBvcnQge1NpbXBsZU1hcH0gZnJvbSBcIi4uL3V0aWwvc2ltcGxlLW1hcFwiO1xuXG4vKipcbiAqIENhY2hlIHVzZWQgYnkgZWFjaCB3b3JrZXIgc2xhdmUgdG8gY2FjaGUgdGhlIHJlY2VpdmVkIGZ1bmN0aW9ucy5cbiAqIENhY2hpbmcgdGhlIGZ1bmN0aW9ucyBoYXMgdGhlIGFkdmFudGFnZSB0aGF0IGZ1bmN0aW9uIG9ubHkgaXMgc2VyaWFsaXplZCwgdHJhbnNtaXR0ZWQgYW5kIGRlc2VyaWFsaXplZCBvbmNlLiBUaGlzIGFsc29cbiAqIGhhcyB0aGUgYWR2YW50YWdlLCB0aGF0IHRoZSBmdW5jdGlvbiBpbnN0YW5jZSBzdGF5cyB0aGUgc2FtZSBhbmQgdGhlcmVmb3JlIGNhbiBiZSBvcHRpbWl6ZWQgYnkgdGhlIHJ1bnRpbWUgc3lzdGVtLlxuICovXG5leHBvcnQgY2xhc3MgU2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlIGltcGxlbWVudHMgSUZ1bmN0aW9uTG9va3VwVGFibGUge1xuICAgIHByaXZhdGUgY2FjaGUgPSBuZXcgU2ltcGxlTWFwPHN0cmluZywgRnVuY3Rpb24+KCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlcyB0aGUgZnVuY2l0b24gd2l0aCB0aGUgZ2l2bmUgaWRcbiAgICAgKiBAcGFyYW0gaWQgdGhlIGlkIG9mIHRoZSBmdW5jdGlvbiB0byByZXNvbHZlXG4gICAgICogQHJldHVybnMgdGhlIHJlc29sdmVkIGZ1bmN0aW9uIG9yIHVuZGVmaW5lZCBpZiBub3Qga25vd25cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0RnVuY3Rpb24oaWQ6IElGdW5jdGlvbklkKTogRnVuY3Rpb24gfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXQoaWQuaWRlbnRpZmllcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgbmV3IGZ1bmN0aW9uIGluIHRoZSBjYWNoZVxuICAgICAqIEBwYXJhbSBkZWZpbml0aW9uIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBmdW5jdGlvbiB0byByZWdpc3RlclxuICAgICAqIEByZXR1cm5zIHRoZSByZWdpc3RlcmVkIGZ1bmN0aW9uXG4gICAgICovXG4gICAgcHVibGljIHJlZ2lzdGVyRnVuY3Rpb24oZGVmaW5pdGlvbjogSUZ1bmN0aW9uRGVmaW5pdGlvbik6IEZ1bmN0aW9uIHtcbiAgICAgICAgY29uc3QgZiA9IEZ1bmN0aW9uLmFwcGx5KG51bGwsIFsuLi5kZWZpbml0aW9uLmFyZ3VtZW50TmFtZXMsIGRlZmluaXRpb24uYm9keV0pO1xuICAgICAgICB0aGlzLmNhY2hlLnNldChkZWZpbml0aW9uLmlkLmlkZW50aWZpZXIsIGYpO1xuICAgICAgICByZXR1cm4gZjtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVnaXN0ZXJTdGF0aWNGdW5jdGlvbihpZDogSUZ1bmN0aW9uSWQsIGZ1bmM6IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmhhcyhpZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGdpdmVuIGZ1bmN0aW9uIGlkICcke2lkLmlkZW50aWZpZXJ9JyBpcyBhbHJlYWR5IHVzZWQgYnkgYW5vdGhlciBmdW5jdGlvbiByZWdpc3RyYXRpb24sIHRoZSBpZCBuZWVkcyB0byBiZSB1bmlxdWUuYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWNoZS5zZXQoaWQuaWRlbnRpZmllciwgZnVuYyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgdGhlIGNhY2hlIGNvbnRhaW5zIGEgZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICAgKiBAcGFyYW0gaWQgdGhlIGlkIG9mIHRoZSBmdW5jdGlvbiB0byB0ZXN0IGZvciBleGlzdGVuY2VcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjYWNoZSBjb250YWlucyBhIGZ1bmN0aW9uIHdpdGggdGhlIGdpdmVuIGlkXG4gICAgICovXG4gICAgcHVibGljIGhhcyhpZDogSUZ1bmN0aW9uSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGUuaGFzKGlkLmlkZW50aWZpZXIpO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vZnVuY3Rpb24vc2xhdmUtZnVuY3Rpb24tbG9va3VwLXRhYmxlLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9mdW5jdGlvbi9zbGF2ZS1mdW5jdGlvbi1sb29rdXAtdGFibGUudHMiLCJpbXBvcnQge0lGdW5jdGlvbkxvb2t1cFRhYmxlfSBmcm9tIFwiLi4vLi4vZnVuY3Rpb24vZnVuY3Rpb24tbG9va3VwLXRhYmxlXCI7XG5pbXBvcnQge1BhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHN9IGZyb20gXCIuL3BhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnNcIjtcbmltcG9ydCB7aWRlbnRpdHl9IGZyb20gXCIuLi8uLi91dGlsL2lkZW50aXR5XCI7XG5pbXBvcnQge2ZpbHRlckl0ZXJhdG9yfSBmcm9tIFwiLi9maWx0ZXItaXRlcmF0b3JcIjtcbmltcG9ydCB7bWFwSXRlcmF0b3J9IGZyb20gXCIuL21hcC1pdGVyYXRvclwiO1xuaW1wb3J0IHtwYXJhbGxlbEpvYkV4ZWN1dG9yfSBmcm9tIFwiLi9wYXJhbGxlbC1qb2ItZXhlY3V0b3JcIjtcbmltcG9ydCB7cmFuZ2VJdGVyYXRvcn0gZnJvbSBcIi4vcmFuZ2UtaXRlcmF0b3JcIjtcbmltcG9ydCB7cmVkdWNlSXRlcmF0b3J9IGZyb20gXCIuL3JlZHVjZS1pdGVyYXRvclwiO1xuaW1wb3J0IHt0b0l0ZXJhdG9yfSBmcm9tIFwiLi4vLi4vdXRpbC9hcnJheXNcIjtcblxuLyoqXG4gKiBSZWdpc3RlcnMgdGhlIHN0YXRpYyBwYXJhbGxlbCBmdW5jdGlvbnNcbiAqIEBwYXJhbSBsb29rdXBUYWJsZSB0aGUgdGFibGUgaW50byB3aGljaCB0aGUgZnVuY3Rpb24gc2hvdWxkIGJlIHJlZ2lzdGVyZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyU3RhdGljUGFyYWxsZWxGdW5jdGlvbnMobG9va3VwVGFibGU6IElGdW5jdGlvbkxvb2t1cFRhYmxlKSB7XG4gICAgbG9va3VwVGFibGUucmVnaXN0ZXJTdGF0aWNGdW5jdGlvbihQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzLklERU5USVRZLCBpZGVudGl0eSk7XG4gICAgbG9va3VwVGFibGUucmVnaXN0ZXJTdGF0aWNGdW5jdGlvbihQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzLkZJTFRFUiwgZmlsdGVySXRlcmF0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5NQVAsIG1hcEl0ZXJhdG9yKTtcbiAgICBsb29rdXBUYWJsZS5yZWdpc3RlclN0YXRpY0Z1bmN0aW9uKFBhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHMuUEFSQUxMRUxfSk9CX0VYRUNVVE9SLCBwYXJhbGxlbEpvYkV4ZWN1dG9yKTtcbiAgICBsb29rdXBUYWJsZS5yZWdpc3RlclN0YXRpY0Z1bmN0aW9uKFBhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHMuUkFOR0UsIHJhbmdlSXRlcmF0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5SRURVQ0UsIHJlZHVjZUl0ZXJhdG9yKTtcbiAgICBsb29rdXBUYWJsZS5yZWdpc3RlclN0YXRpY0Z1bmN0aW9uKFBhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHMuVE9fSVRFUkFUT1IsIHRvSXRlcmF0b3IpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yZWdpc3Rlci1wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yZWdpc3Rlci1wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zLnRzIiwiaW1wb3J0IHtGdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXJ9IGZyb20gXCIuLi8uLi9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24tY2FsbC1kZXNlcmlhbGl6ZXJcIjtcbmltcG9ydCB7SVRhc2tEZWZpbml0aW9ufSBmcm9tIFwiLi4vLi4vY29tbW9uL3Rhc2svdGFzay1kZWZpbml0aW9uXCI7XG5pbXBvcnQge0lGdW5jdGlvbkRlZmluaXRpb259IGZyb20gXCIuLi8uLi9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24tZGVmaW50aW9uXCI7XG5pbXBvcnQge1xuICAgIGZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IsIGlzRnVuY3Rpb25SZXNwb25zZSwgaXNJbml0aWFsaXplTWVzc2FnZSwgaXNTY2hlZHVsZVRhc2ssIHJlcXVlc3RGdW5jdGlvbk1lc3NhZ2UsXG4gICAgd29ya2VyUmVzdWx0TWVzc2FnZSB9IGZyb20gXCIuLi8uLi9jb21tb24vd29ya2VyL3dvcmtlci1tZXNzYWdlc1wiO1xuaW1wb3J0IHtCcm93c2VyV29ya2VyU2xhdmV9IGZyb20gXCIuL2Jyb3dzZXItd29ya2VyLXNsYXZlXCI7XG5cbi8qKlxuICogU3RhdGUgb2YgdGhlIGJyb3dzZXIgd29ya2VyIHNsYXZlLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQnJvd3NlcldvcmtlclNsYXZlU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3RlY3RlZCBzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlKSB7fVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZWQgd2hlbiB0aGUgc2xhdmUgY2hhbmdlcyBpdHMgc3RhdGUgdG8gdGhpcyBzdGF0ZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZW50ZXIoKTogdm9pZCB7XG4gICAgICAgIC8vIGludGVudGlvbmFsbHkgZW1wdHlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlZCB3aGVuZXZlciB0aGUgc2xhdmUgcmVjZWl2ZXMgYSBtZXNzYWdlIGZyb20gdGhlIHVpLXRocmVhZCB3aGlsZSBiZWluZyBpbiB0aGlzIHN0YXRlXG4gICAgICogQHBhcmFtIGV2ZW50IHRoZSByZWNlaXZlZCBtZXNzYWdlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIHN0YXRlIGhhcyBoYW5kbGVkIHRoZSBtZXNzYWdlLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgb25NZXNzYWdlKGV2ZW50OiBNZXNzYWdlRXZlbnQpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XG59XG5cbi8qKlxuICogSW5pdGlhbCBzdGF0ZSBvZiBhIHNsYXZlLiBUaGUgc2xhdmUgaXMgd2FpdGluZyBmb3IgdGhlIGluaXRpYWxpemF0aW9uIG1lc3NhZ2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBEZWZhdWx0QnJvd3NlcldvcmtlclNsYXZlU3RhdGUgZXh0ZW5kcyBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSB7XG4gICAgICAgY29uc3RydWN0b3Ioc2xhdmU6IEJyb3dzZXJXb3JrZXJTbGF2ZSkge1xuICAgICAgICBzdXBlcihcIkRlZmF1bHRcIiwgc2xhdmUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoaXNJbml0aWFsaXplTWVzc2FnZShldmVudC5kYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5pZCA9IGV2ZW50LmRhdGEud29ya2VySWQ7XG4gICAgICAgICAgICB0aGlzLnNsYXZlLmNoYW5nZVN0YXRlKG5ldyBJZGxlQnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcy5zbGF2ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgc2xhdmUgaXMgd2FpdGluZyBmb3Igd29yayBmcm9tIHRoZSB1aS10aHJlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBJZGxlQnJvd3NlcldvcmtlclNsYXZlU3RhdGUgZXh0ZW5kcyBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSB7XG4gICAgY29uc3RydWN0b3Ioc2xhdmU6IEJyb3dzZXJXb3JrZXJTbGF2ZSkge1xuICAgICAgICBzdXBlcihcIklkbGVcIiwgc2xhdmUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIWlzU2NoZWR1bGVUYXNrKGV2ZW50LmRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YXNrOiBJVGFza0RlZmluaXRpb24gPSBldmVudC5kYXRhLnRhc2s7XG4gICAgICAgIGNvbnN0IG1pc3NpbmdGdW5jdGlvbnMgPSB0YXNrLnVzZWRGdW5jdGlvbklkcy5maWx0ZXIoaWQgPT4gIXRoaXMuc2xhdmUuZnVuY3Rpb25DYWNoZS5oYXMoaWQpKTtcblxuICAgICAgICBpZiAobWlzc2luZ0Z1bmN0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2xhdmUuY2hhbmdlU3RhdGUobmV3IEV4ZWN1dGVGdW5jdGlvbkJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlKHRoaXMuc2xhdmUsIHRhc2spKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IFsgaGVhZCwgLi4udGFpbCBdID0gbWlzc2luZ0Z1bmN0aW9ucztcbiAgICAgICAgICAgIHRoaXMuc2xhdmUucG9zdE1lc3NhZ2UocmVxdWVzdEZ1bmN0aW9uTWVzc2FnZShoZWFkLCAuLi50YWlsKSk7XG4gICAgICAgICAgICB0aGlzLnNsYXZlLmNoYW5nZVN0YXRlKG5ldyBXYWl0aW5nRm9yRnVuY3Rpb25EZWZpbml0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcy5zbGF2ZSwgdGFzaykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBzbGF2ZSBpcyB3YWl0aW5nIGZvciB0aGUgZGVmaW5pdGlvbiBvZiB0aGUgcmVxdWVzdGVkIGZ1bmN0aW9uIHRoYXQgaXMgbmVlZGVkIHRvIGV4ZWN1dGUgdGhlIGFzc2lnbmVkIHRhc2suXG4gKi9cbmV4cG9ydCBjbGFzcyBXYWl0aW5nRm9yRnVuY3Rpb25EZWZpbml0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUgZXh0ZW5kcyBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSB7XG4gICAgY29uc3RydWN0b3Ioc2xhdmU6IEJyb3dzZXJXb3JrZXJTbGF2ZSwgcHJpdmF0ZSB0YXNrOiBJVGFza0RlZmluaXRpb24pIHtcbiAgICAgICAgc3VwZXIoXCJXYWl0aW5nRm9yRnVuY3Rpb25EZWZpbml0aW9uXCIsIHNsYXZlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25NZXNzYWdlKGV2ZW50OiBNZXNzYWdlRXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uUmVzcG9uc2UobWVzc2FnZSkpIHtcbiAgICAgICAgICAgIGlmIChtZXNzYWdlLm1pc3NpbmdGdW5jdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkZW50aWZpZXJzID0gbWVzc2FnZS5taXNzaW5nRnVuY3Rpb25zLm1hcChmdW5jdGlvbklkID0+IGZ1bmN0aW9uSWQuaWRlbnRpZmllcikuam9pbihcIiwgXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2xhdmUucG9zdE1lc3NhZ2UoZnVuY3Rpb25FeGVjdXRpb25FcnJvcihuZXcgRXJyb3IoYFRoZSBmdW5jdGlvbiBpZHMgWyR7aWRlbnRpZmllcnN9XSBjb3VsZCBub3QgYmUgcmVzb2x2ZWQgYnkgc2xhdmUgJHt0aGlzLnNsYXZlLmlkfS5gKSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2xhdmUuY2hhbmdlU3RhdGUobmV3IElkbGVCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzLnNsYXZlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgZGVmaW5pdGlvbiBvZiBtZXNzYWdlLmZ1bmN0aW9ucyBhcyBJRnVuY3Rpb25EZWZpbml0aW9uW10pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGF2ZS5mdW5jdGlvbkNhY2hlLnJlZ2lzdGVyRnVuY3Rpb24oZGVmaW5pdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zbGF2ZS5jaGFuZ2VTdGF0ZShuZXcgRXhlY3V0ZUZ1bmN0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcy5zbGF2ZSwgdGhpcy50YXNrKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBzbGF2ZSBpcyBleGVjdXRpbmcgdGhlIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBFeGVjdXRlRnVuY3Rpb25Ccm93c2VyV29ya2VyU2xhdmVTdGF0ZSBleHRlbmRzIEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIHtcbiAgICBjb25zdHJ1Y3RvcihzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlLCBwcml2YXRlIHRhc2s6IElUYXNrRGVmaW5pdGlvbikge1xuICAgICAgICBzdXBlcihcIkV4ZWN1dGluZ1wiLCBzbGF2ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGVudGVyKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBmdW5jdGlvbkRlc2VyaWFsaXplciA9IG5ldyBGdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIodGhpcy5zbGF2ZS5mdW5jdGlvbkNhY2hlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgbWFpbiA9IGZ1bmN0aW9uRGVzZXJpYWxpemVyLmRlc2VyaWFsaXplRnVuY3Rpb25DYWxsKHRoaXMudGFzay5tYWluKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG1haW4oe2Z1bmN0aW9uQ2FsbERlc2VyaWFsaXplcjogZnVuY3Rpb25EZXNlcmlhbGl6ZXJ9KTtcbiAgICAgICAgICAgIHRoaXMuc2xhdmUucG9zdE1lc3NhZ2Uod29ya2VyUmVzdWx0TWVzc2FnZShyZXN1bHQpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuc2xhdmUucG9zdE1lc3NhZ2UoZnVuY3Rpb25FeGVjdXRpb25FcnJvcihlcnJvcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGF2ZS5jaGFuZ2VTdGF0ZShuZXcgSWRsZUJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlKHRoaXMuc2xhdmUpKTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvYnJvd3Nlci93b3JrZXItc2xhdmUvYnJvd3Nlci13b3JrZXItc2xhdmUtc3RhdGVzLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLXN0YXRlcy50cyIsImltcG9ydCB7SUZ1bmN0aW9uTG9va3VwVGFibGV9IGZyb20gXCIuL2Z1bmN0aW9uLWxvb2t1cC10YWJsZVwiO1xuaW1wb3J0IHtJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCwgaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsfSBmcm9tIFwiLi9zZXJpYWxpemVkLWZ1bmN0aW9uLWNhbGxcIjtcblxuLyoqXG4gKiBEZXNlcmlhbGl6ZXIgZm9yIGEge0BsaW5rIElTZXJpYWxpemVkRnVuY3Rpb25DYWxsfS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBkZXNlcmlhbGl6ZXIgdGhhdCB1c2VzIHRoZSBnaXZlbiBmdW5jdGlvbiBsb29rdXAgdGFibGUgdG8gcmV0cmlldmUgdGhlIGZ1bmN0aW9uIGZvciBhIGdpdmVuIGlkXG4gICAgICogQHBhcmFtIGZ1bmN0aW9uTG9va3VwVGFibGUgdGhlIGxvb2t1cCB0YWJsZSB0byB1c2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZ1bmN0aW9uTG9va3VwVGFibGU6IElGdW5jdGlvbkxvb2t1cFRhYmxlKSB7fVxuXG4gICAgLyoqXG4gICAgICogRGVzZXJpYWxpemVzIHRoZSBmdW5jdGlvbiBjYWxsIGludG8gYSBmdW5jdGlvblxuICAgICAqIEBwYXJhbSBmdW5jdGlvbkNhbGwgdGhlIGZ1bmN0aW9uIGNhbGwgdG8gZGVzZXJpYWxpemVcbiAgICAgKiBAcGFyYW0gZGVzZXJpYWxpemVQYXJhbXMgaW5kaWNhdG9yIGlmIHRoZSBwYXJhbWV0ZXJzIHBhc3NlZCB0byB0aGUgc2VyaWFsaXplZCBmdW5jdGlvbiBzaG91bGQgYmUgZGVzZXJhaWxpemVkIHRvb1xuICAgICAqIEByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHdpdGggYWRkaXRpb25hbCBwYXJhbWV0ZXJzICh0aGUgcGFyYW1zIGZyb20gdGhlIHNlcmlhbGl6ZWQgZnVuY3Rpb24gY2FsbHMgYXJlIHByZXBlbmRlZCB0byB0aGUgcGFzc2VkIHBhcmFtZXRlcnMpXG4gICAgICovXG4gICAgcHVibGljIGRlc2VyaWFsaXplRnVuY3Rpb25DYWxsPFRSZXN1bHQ+KGZ1bmN0aW9uQ2FsbDogSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGwsIGRlc2VyaWFsaXplUGFyYW1zID0gZmFsc2UpOiAoLi4uYWRkaXRpb25hbFBhcmFtczogYW55W10pID0+IFRSZXN1bHQge1xuICAgICAgICBjb25zdCBmdW5jID0gdGhpcy5mdW5jdGlvbkxvb2t1cFRhYmxlLmdldEZ1bmN0aW9uKGZ1bmN0aW9uQ2FsbC5mdW5jdGlvbklkKTtcbiAgICAgICAgaWYgKCFmdW5jKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpZCAke2Z1bmN0aW9uQ2FsbC5mdW5jdGlvbklkLmlkZW50aWZpZXJ9IGNvdWxkIG5vdCBiZSByZXRyaWV2ZWQgd2hpbGUgZGVzZXJpYWxpemluZyB0aGUgZnVuY3Rpb24gY2FsbC4gSXMgdGhlIGZ1bmN0aW9uIGNvcnJlY3RseSByZWdpc3RlcmVkP2ApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBhcmFtcyA9IGZ1bmN0aW9uQ2FsbC5wYXJhbWV0ZXJzIHx8IFtdO1xuXG4gICAgICAgIGlmIChkZXNlcmlhbGl6ZVBhcmFtcykge1xuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLm1hcChwYXJhbSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlzU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbChwYXJhbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVzZXJpYWxpemVGdW5jdGlvbkNhbGwocGFyYW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYWRkaXRpb25hbFBhcmFtczogYW55W10pIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgcGFyYW1zLmNvbmNhdChhZGRpdGlvbmFsUGFyYW1zKSkgYXMgVFJlc3VsdDtcbiAgICAgICAgfTtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWNhbGwtZGVzZXJpYWxpemVyLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9mdW5jdGlvbi9mdW5jdGlvbi1jYWxsLWRlc2VyaWFsaXplci50cyIsIi8qKlxuICogQG1vZHVsZSBwYXJhbGxlbFxuICovXG4vKiogKi9cblxuLyoqXG4gKiBJZGVudGlmaWVyIGZvciBhIHNlcmlhbGl6ZWQgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRnVuY3Rpb25JZCB7XG4gICAgLyoqXG4gICAgICogVGhlIGdsb2JhbGx5IHVuaXF1ZSBpZGVudGlmaWVyXG4gICAgICovXG4gICAgaWRlbnRpZmllcjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogRmxhZyB0aGF0IGluZGljYXRlcyB0aGF0IHRoaXMgaXMgYSBmdW5jdGlvbiBpZFxuICAgICAqL1xuICAgIF9fX19fX19pc0Z1bmN0aW9uSWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGlkXG4gKiBAcGFyYW0gbmFtZXNwYWNlIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGlkXG4gKiBAcGFyYW0gaWQgdGhlIHVuaXF1ZSBpZCBmb3IgdGhpcyBuYW1lc3BhY2VcbiAqIEByZXR1cm5zIHRoZSBmdW5jdGlvbiBpZFxuICovXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25JZChuYW1lc3BhY2U6IHN0cmluZywgaWQ6IG51bWJlcik6IElGdW5jdGlvbklkIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfX19fX19faXNGdW5jdGlvbklkOiB0cnVlLFxuICAgICAgICBpZGVudGlmaWVyOiBgJHtuYW1lc3BhY2V9LSR7aWR9YFxuICAgIH07XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhIGZ1bmN0aW9uIGlkXG4gKiBAcGFyYW0gb2JqIHRoZSBvYmplY3QgdG8gdGVzdCBmb3JcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG9iamVjdCBpcyAgYSBmdW5jdGlvbiBpZFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbklkKG9iajogYW55KTogb2JqIGlzIElGdW5jdGlvbklkIHtcbiAgICByZXR1cm4gISFvYmogJiYgb2JqLl9fX19fX19pc0Z1bmN0aW9uSWQgPT09IHRydWU7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWlkLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9mdW5jdGlvbi9mdW5jdGlvbi1pZC50cyIsImltcG9ydCB7SVBhcmFsbGVsVGFza0Vudmlyb25tZW50fSBmcm9tIFwiLi4vXCI7XG4vKipcbiAqIFJldHVybnMgYSBuZXcgaXRlcmF0b3IgdGhhdCBvbmx5IGNvbnRhaW5zIGFsbCBlbGVtZW50cyBmb3Igd2hpY2ggdGhlIGdpdmVuIHByZWRpY2F0ZSByZXR1cm5zIHRydWVcbiAqIEBwYXJhbSBpdGVyYXRvciB0aGUgaXRlcmF0b3IgdG8gZmlsdGVyXG4gKiBAcGFyYW0gcHJlZGljYXRlIHRoZSBwcmVkaWNhdGUgdG8gdXNlIGZvciBmaWx0ZXJpbmcgdGhlIGVsZW1lbnRzXG4gKiBAcGFyYW0gZW52IHRoZSBlbnZpcm9ubWVudCBvZiB0aGUgam9iXG4gKiBAcGFyYW0gVCB0eXBlIG9mIHRoZSBlbGVtZW50cyB0byBmaWx0ZXJcbiAqIEByZXR1cm5zIGFuIGl0ZXJhdG9yIG9ubHkgY29udGFpbmluZyB0aGUgZWxlbWVudHMgd2hlcmUgdGhlIHByZWRpY2F0ZSBpcyB0cnVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJJdGVyYXRvcjxUPihpdGVyYXRvcjogSXRlcmF0b3I8VD4sIHByZWRpY2F0ZTogKHRoaXM6IHZvaWQsIHZhbHVlOiBULCBlbnY6IElQYXJhbGxlbFRhc2tFbnZpcm9ubWVudCkgPT4gYm9vbGVhbiwgZW52OiBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnQpOiBJdGVyYXRvcjxUPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmV4dCgpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50OiBJdGVyYXRvclJlc3VsdDxUPjtcbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnQgKi9cbiAgICAgICAgICAgIHdoaWxlICghKGN1cnJlbnQgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJlZGljYXRlKGN1cnJlbnQudmFsdWUsIGVudikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgfVxuICAgIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL2ZpbHRlci1pdGVyYXRvci50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvZmlsdGVyLWl0ZXJhdG9yLnRzIiwiaW1wb3J0IHtJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnR9IGZyb20gXCIuLi9cIjtcbi8qKlxuICogUGVyZm9ybXMgdGhlIG1hcCBvcGVyYXRpb25cbiAqIEBwYXJhbSBpdGVyYXRvciB0aGUgaXRlcmF0b3Igb2YgdGhlIHByZXZpb3VzIHN0ZXBcbiAqIEBwYXJhbSBpdGVyYXRlZSB0aGUgaXRlcmF0ZWUgdG8gYXBwbHkgdG8gZWFjaCBlbGVtZW50IGluIHRoZSBpdGVyYXRvclxuICogQHBhcmFtIGVudiB0aGUgZW52aXJvbm1lbnQgb2YgdGhlIGpvYlxuICogQHBhcmFtIFQgdGhlIHR5cGUgb2YgdGhlIGlucHV0IGVsZW1lbnRzXG4gKiBAcGFyYW0gVFJlc3VsdCB0aGUgdHlwZSBvZiB0aGUgcmV0dXJuZWQgZWxlbWVudCBvZiB0aGUgaXRlcmF0ZWVcbiAqIEByZXR1cm5zIGEgbmV3IGl0ZXJhdG9yIHdoZXJlIGVhY2ggZWxlbWVudCBoYXMgYmVlbiBtYXBwZWQgdXNpbmcgdGhlIGl0ZXJhdGVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBJdGVyYXRvcjxULCBUUmVzdWx0PihpdGVyYXRvcjogSXRlcmF0b3I8VD4sIGl0ZXJhdGVlOiAodGhpczogdm9pZCwgdmFsdWU6IFQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KSA9PiBUUmVzdWx0LCBlbnY6IElQYXJhbGxlbFRhc2tFbnZpcm9ubWVudCk6IEl0ZXJhdG9yPFRSZXN1bHQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFRSZXN1bHQ+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUgfSBhcyBJdGVyYXRvclJlc3VsdDxUUmVzdWx0PjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZG9uZTogcmVzdWx0LmRvbmUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGl0ZXJhdGVlKHJlc3VsdC52YWx1ZSwgZW52KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL21hcC1pdGVyYXRvci50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvbWFwLWl0ZXJhdG9yLnRzIiwiaW1wb3J0IHt0b0FycmF5fSBmcm9tIFwiLi4vLi4vdXRpbC9hcnJheXNcIjtcbmltcG9ydCB7RnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyfSBmcm9tIFwiLi4vLi4vZnVuY3Rpb24vZnVuY3Rpb24tY2FsbC1kZXNlcmlhbGl6ZXJcIjtcbmltcG9ydCB7SVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGwsIGlzU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbH0gZnJvbSBcIi4uLy4uL2Z1bmN0aW9uL3NlcmlhbGl6ZWQtZnVuY3Rpb24tY2FsbFwiO1xuaW1wb3J0IHtJU2VyaWFsaXplZFBhcmFsbGVsT3BlcmF0aW9uLCBJUGFyYWxsZWxFbnZpcm9ubWVudCwgSVBhcmFsbGVsVGFza0Vudmlyb25tZW50fSBmcm9tIFwiLi4vXCI7XG5cbi8qKlxuICogRGVmaW5lcyB0aGUgcGFyYWxsZWwgb3BlcmF0aW9uIHRvIHBlcmZvcm1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJUGFyYWxsZWxKb2JEZWZpbml0aW9uIHtcbiAgICAvKipcbiAgICAgKiBUaGUgZ2VuZXJhdG9yIHRoYXQgaXMgdXNlZCB0byBjcmVhdGUgdGhlIGFycmF5IHRoYXQgaXMgXCJtYW5pcHVsYXRlZFwiIGJ5IGFwcGx5aW5nIHRoZSBnaXZlbiBhY3Rpb25zLlxuICAgICAqL1xuICAgIGdlbmVyYXRvcjogSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3BlcmF0aW9ucyB0byBwZXJmb3JtIG9uIHRoZSBhcnJheSBlbGVtZW50c1xuICAgICAqL1xuICAgIG9wZXJhdGlvbnM6IElTZXJpYWxpemVkUGFyYWxsZWxPcGVyYXRpb25bXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBlbnZpcm9ubWVudHMuIE9iamVjdCBoYXNoIHRoYXQgaXMgcGFzc2VkIHRvIGFsbCBpdGVyYXRlZSBmdW5jdGlvbnMgYW5kIGFsbG93cyB0byBhY2Nlc3MgZXh0ZXJuYWwgZGF0YVxuICAgICAqL1xuICAgIGVudmlyb25tZW50czogQXJyYXk8SVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGwgfCBJUGFyYWxsZWxFbnZpcm9ubWVudD47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgam9iLXJlbGF0aXZlIGluZGV4IG9mIHRoZSB0YXNrXG4gICAgICovXG4gICAgdGFza0luZGV4OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIHZhbHVlcyBwcm9jZXNzZWQgYnkgZWFjaCB0YXNrIChhdCBtb3N0KVxuICAgICAqL1xuICAgIHZhbHVlc1BlclRhc2s6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGFza0Vudmlyb25tZW50KGRlZmluaXRpb246IElQYXJhbGxlbEpvYkRlZmluaXRpb24sIGZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplcjogRnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyKTogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50IHtcbiAgICBsZXQgdGFza0Vudmlyb25tZW50OiBJUGFyYWxsZWxFbnZpcm9ubWVudCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBlbnZpcm9ubWVudCBvZiBkZWZpbml0aW9uLmVudmlyb25tZW50cykge1xuICAgICAgICBsZXQgY3VycmVudEVudmlyb25tZW50OiBJUGFyYWxsZWxFbnZpcm9ubWVudDtcbiAgICAgICAgaWYgKGlzU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbChlbnZpcm9ubWVudCkpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFbnZpcm9ubWVudCA9IGZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplci5kZXNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbChlbnZpcm9ubWVudCkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRFbnZpcm9ubWVudCA9IGVudmlyb25tZW50O1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGFza0Vudmlyb25tZW50LCBjdXJyZW50RW52aXJvbm1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7IHRhc2tJbmRleDogZGVmaW5pdGlvbi50YXNrSW5kZXgsIHZhbHVlc1BlclRhc2s6IGRlZmluaXRpb24udmFsdWVzUGVyVGFzayB9LCB0YXNrRW52aXJvbm1lbnQpO1xufVxuXG4vKipcbiAqIE1haW4gY29vcmRpbmF0aW9uIGZ1bmN0aW9uIGZvciBhbnkgb3BlcmF0aW9uIHBlcmZvcm1lZCB1c2luZyB7QGxpbmsgSVBhcmFsbGVsfS5cbiAqIEBwYXJhbSBkZWZpbml0aW9uIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBvcGVyYXRpb24gdG8gcGVyZm9ybWVkXG4gKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIHBhc3NlZCBmcm9tIHRoZSB0aHJlYWQgcG9vbFxuICogQHBhcmFtIFQgdHlwZSBvZiB0aGUgZWxlbWVudHMgY3JlYXRlZCBieSB0aGUgZ2VuZXJhdG9yXG4gKiBAcGFyYW0gVFJlc3VsdCB0eXBlIG9mIHRoZSByZXN1bHRpbmcgZWxlbWVudHNcbiAqIEByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIG9wZXJhdGlvbiBmcm9tIHRoaXMgd29ya2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbEpvYkV4ZWN1dG9yPFQsIFRSZXN1bHQ+KGRlZmluaXRpb246IElQYXJhbGxlbEpvYkRlZmluaXRpb24sIHsgZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIH06IHsgZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyOiBGdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIgfSk6IFRSZXN1bHRbXSB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBjcmVhdGVUYXNrRW52aXJvbm1lbnQoZGVmaW5pdGlvbiwgZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyKTtcbiAgICBjb25zdCBnZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplci5kZXNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbChkZWZpbml0aW9uLmdlbmVyYXRvciwgdHJ1ZSk7XG4gICAgbGV0IGl0ZXJhdG9yID0gZ2VuZXJhdG9yRnVuY3Rpb24oZW52aXJvbm1lbnQpIGFzIEl0ZXJhdG9yPFQ+O1xuXG4gICAgZm9yIChjb25zdCBvcGVyYXRpb24gb2YgZGVmaW5pdGlvbi5vcGVyYXRpb25zKSB7XG4gICAgICAgIGNvbnN0IGl0ZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIuZGVzZXJpYWxpemVGdW5jdGlvbkNhbGw8SXRlcmF0b3I8VD4+KG9wZXJhdGlvbi5pdGVyYXRvcik7XG4gICAgICAgIGNvbnN0IGl0ZXJhdGVlID0gZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyLmRlc2VyaWFsaXplRnVuY3Rpb25DYWxsKG9wZXJhdGlvbi5pdGVyYXRlZSk7XG4gICAgICAgIGl0ZXJhdG9yID0gaXRlcmF0b3JGdW5jdGlvbihpdGVyYXRvciwgaXRlcmF0ZWUsIGVudmlyb25tZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9BcnJheTxUUmVzdWx0PihpdGVyYXRvciBhcyBhbnkpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC1qb2ItZXhlY3V0b3IudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3BhcmFsbGVsLWpvYi1leGVjdXRvci50cyIsImltcG9ydCB7ZnVuY3Rpb25JZCwgSUZ1bmN0aW9uSWR9IGZyb20gXCIuLi8uLi9mdW5jdGlvbi9mdW5jdGlvbi1pZFwiO1xuXG5leHBvcnQgY29uc3QgUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcyA9IHtcbiAgICBGSUxURVI6IGZ1bmN0aW9uSWQoXCJwYXJhbGxlbFwiLCAwKSBhcyBJRnVuY3Rpb25JZCxcbiAgICBJREVOVElUWTogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDEpLFxuICAgIE1BUDogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDIpLFxuICAgIFBBUkFMTEVMX0pPQl9FWEVDVVRPUjogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDMpLFxuICAgIFJBTkdFOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgNCksXG4gICAgUkVEVUNFOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgNSksXG4gICAgVElNRVM6IGZ1bmN0aW9uSWQoXCJwYXJhbGxlbFwiLCA2KSxcbiAgICBUT19JVEVSQVRPUjogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDcpXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zLnRzIiwiLyoqXG4gKiBHZW5lcmF0b3IgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIGFuIGl0ZXJhdG9yIGNvbnRhaW5pbmcgYWxsIGVsZW1lbnRzIGluIHRoZSByYW5nZSBbc3RhcnQsIGVuZCkgd2l0aCBhIHN0ZXAgc2l6ZSBvZiBzdGVwLlxuICogQHBhcmFtIHN0YXJ0IHN0YXJ0IHZhbHVlIG9mIHRoZSByYW5nZSAoaW5jbHVzaXZlKVxuICogQHBhcmFtIGVuZCBlbmQgdmFsdWUgb2YgdGhlIHJhbmdlIChleGNsdXNpdmUpXG4gKiBAcGFyYW0gc3RlcCBzdGVwIHNpemUgYmV0d2VlbiB0d28gdmFsdWVzXG4gKiBAcmV0dXJucyBpdGVyYXRvciB3aXRoIHRoZSB2YWx1ZXMgW3N0YXJ0LCBlbmQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5nZUl0ZXJhdG9yKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBzdGVwOiBudW1iZXIpOiBJdGVyYXRvcjxudW1iZXI+IHtcbiAgICBsZXQgbmV4dCA9IHN0YXJ0O1xuICAgIHJldHVybiB7XG4gICAgICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8bnVtYmVyPiB7XG4gICAgICAgICAgICBsZXQgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICBuZXh0ID0gY3VycmVudCArIHN0ZXA7XG4gICAgICAgICAgICBpZiAoY3VycmVudCA8IGVuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlLCB2YWx1ZTogY3VycmVudCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9IGFzIEl0ZXJhdG9yUmVzdWx0PG51bWJlcj47XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yYW5nZS1pdGVyYXRvci50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcmFuZ2UtaXRlcmF0b3IudHMiLCJpbXBvcnQge0lQYXJhbGxlbFRhc2tFbnZpcm9ubWVudH0gZnJvbSBcIi4uL1wiO1xuaW1wb3J0IHt0b0l0ZXJhdG9yfSBmcm9tIFwiLi4vLi4vdXRpbC9hcnJheXNcIjtcbi8qKlxuICogUmVkdWNlcyB0aGUgZWxlbWVudHMgb2YgdGhlIGdpdmVuIGl0ZXJhdG9yIHRvIGEgc2luZ2xlIHZhbHVlIGJ5IGFwcGx5aW5nIHRoZSBnaXZlbiBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnRcbiAqIEBwYXJhbSBkZWZhdWx0VmFsdWUgYSBkZWZhdWx0IHZhbHVlIHRoYXQgaXMgYXMgYWNjdW11bGF0b3Igb3IgZm9yIHRoZSBjYXNlIHRoYXQgdGhlIGl0ZXJhdG9yIGlzIGVtcHR5XG4gKiBAcGFyYW0gaXRlcmF0b3IgdGhlIGl0ZXJhdG9yIHdpdGggdGhlIHZhbHVlcyB0byByZWR1Y2VcbiAqIEBwYXJhbSBpdGVyYXRlZSBpdGVyYXRlZSB0aGF0IGlzIGFwcGxpZWQgZm9yIGVhY2ggZWxlbWVudC4gVGhlIGl0ZXJhdGVlIGlzIHBhc3NlZCB0aGUgYWNjdW11bGF0ZWQgdmFsdWUgKHN1bSBvZiBhbGwgcHJldmlvdXMgdmFsdWVzKVxuICogYW5kIHRoZSBjdXJyZW50IGVsZW1lbnQgYW5kIGhhcyB0byByZXR1cm4gYSBuZXcgYWNjdW11bGF0ZWQgdmFsdWUuXG4gKiBAcGFyYW0gZW52IHRoZSBlbnZpcm9ubWVudCBvZiB0aGUgam9iXG4gKiBAcGFyYW0gVCB0eXBlIG9mIHRoZSBlbGVtZW50cyB0byBwcm9jZXNzXG4gKiBAcGFyYW0gVFJlc3VsdCB0eXBlIG9mIHRoZSByZWR1Y2VkIHZhbHVlXG4gKiBAcmV0dXJucyBhbiBhcnJheSB3aXRoIGEgc2luZ2xlIHZhbHVlLCB0aGUgcmVkdWNlZCB2YWx1ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlSXRlcmF0b3I8VCwgVFJlc3VsdD4oZGVmYXVsdFZhbHVlOiBUUmVzdWx0LCBpdGVyYXRvcjogSXRlcmF0b3I8VD4sIGl0ZXJhdGVlOiAodGhpczogdm9pZCwgYWNjdW11bGF0ZWRWYWx1ZTogVFJlc3VsdCwgdmFsdWU6IFQgfCB1bmRlZmluZWQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KSA9PiBUUmVzdWx0LCBlbnY6IElQYXJhbGxlbFRhc2tFbnZpcm9ubWVudCk6IEl0ZXJhdG9yPFRSZXN1bHQ+IHtcbiAgICBsZXQgYWNjdW11bGF0ZWRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICBsZXQgY3VycmVudDogSXRlcmF0b3JSZXN1bHQ8VD47XG5cbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1jb25kaXRpb25hbC1hc3NpZ25tZW50ICovXG4gICAgd2hpbGUgKCEoY3VycmVudCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBhY2N1bXVsYXRlZFZhbHVlID0gaXRlcmF0ZWUoYWNjdW11bGF0ZWRWYWx1ZSwgY3VycmVudC52YWx1ZSwgZW52KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9JdGVyYXRvcihbYWNjdW11bGF0ZWRWYWx1ZV0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yZWR1Y2UtaXRlcmF0b3IudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZHVjZS1pdGVyYXRvci50cyIsIi8qKlxuICogaWRlbnRpdHkgZnVuY3Rpb24uIFJldHVybnMgdGhlIHBhc3NlZCBpbiB2YWx1ZVxuICogQHBhcmFtIGVsZW1lbnQgdGhlIHZhbHVlIHRvIHJldHVyblxuICogQHBhcmFtIFQgdHlwZSBvZiB0aGUgZWxlbWVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gaWRlbnRpdHk8VD4oZWxlbWVudDogVCk6IFQge1xuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi91dGlsL2lkZW50aXR5LnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL2lkZW50aXR5LnRzIiwiLyoqXG4gKiBBIHZlcnkgc2ltcGxlIGltcGxlbWVudGF0aW9uIG9mIGEgbWFwLiBEbyBub3QgdXNlIHdpdGggY29tcGxleCBvYmplY3RzIGFzIEtleS5cbiAqIEBwYXJhbSBLIHR5cGUgb2YgdGhlIGtleVxuICogQHBhcmFtIFYgdHlwZSBvZiB0aGUgdmFsdWVcbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZU1hcDxLLCBWPiB7XG4gICAgcHJpdmF0ZSBkYXRhOiB7IFtrZXk6IHN0cmluZ106IFYgfSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXkgaWYgYXZhaWxhYmxlXG4gICAgICogQHBhcmFtIGtleSB0aGUga2V5IHRvIGxvb2sgdXBcbiAgICAgKiBAcmV0dXJucyB0aGUgbG9va2VkIHVwIHZhbHVlIG9yIHVuZGVmaW5lZCBpZiB0aGUgbWFwIGRvZXMgbm90IGNvbnRhaW4gYW55IHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gICAgICovXG4gICAgcHVibGljIGdldChrZXk6IEspOiBWIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgaW50ZXJuYWxLZXkgPSB0aGlzLnRvSW50ZXJuYWxLZXkoa2V5KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzKGtleSkgPyB0aGlzLmRhdGFbaW50ZXJuYWxLZXldIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3RzIGlmIHRoZSBtYXAgY29udGFpbnMgdmFsdWUgc3RvcmVkIGJ5IHRoZSBnaXZlbiBrZXlcbiAgICAgKiBAcGFyYW0ga2V5IHRoZSBrZXlcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBtYXAgY29udGFpbnMgYSB2YWx1ZSBieSB0aGUgZ2l2ZW4ga2V5LCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzKGtleTogSyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuZGF0YSwgdGhpcy50b0ludGVybmFsS2V5KGtleSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4ga2V5LiBJZiB0aGUgbWFwIGFscmVhZHkgY29udGFpbnMgYSB2YWx1ZSBzdG9yZWQgYnkgdGhlIGdpdmVuIGtleSwgdGhlbiB0aGlzIHZhbHVlIGlzXG4gICAgICogb3ZlcnJpZGRlblxuICAgICAqIEBwYXJhbSBrZXkgdGhlIGtleVxuICAgICAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGdpdmVuIGtleVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXQoa2V5OiBLLCB2YWx1ZTogVik6IHZvaWQge1xuICAgICAgICB0aGlzLmRhdGFbdGhpcy50b0ludGVybmFsS2V5KGtleSldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2xlYXJzIGFsbCB2YWx1ZXMgZnJvbSB0aGUgbWFwXG4gICAgICovXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHRvSW50ZXJuYWxLZXkoa2V5OiBLKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBAJHtrZXl9YDtcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3V0aWwvc2ltcGxlLW1hcC50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vdXRpbC9zaW1wbGUtbWFwLnRzIiwiaW1wb3J0IHtCcm93c2VyV29ya2VyU2xhdmV9IGZyb20gXCIuL2Jyb3dzZXItd29ya2VyLXNsYXZlXCI7XG5pbXBvcnQge1NsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZX0gZnJvbSBcIi4uLy4uL2NvbW1vbi9mdW5jdGlvbi9zbGF2ZS1mdW5jdGlvbi1sb29rdXAtdGFibGVcIjtcbmltcG9ydCB7cmVnaXN0ZXJTdGF0aWNQYXJhbGxlbEZ1bmN0aW9uc30gZnJvbSBcIi4uLy4uL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yZWdpc3Rlci1wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zXCI7XG5cbmNvbnN0IHNsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZSA9IG5ldyBTbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUoKTtcbnJlZ2lzdGVyU3RhdGljUGFyYWxsZWxGdW5jdGlvbnMoc2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlKTtcblxuLyoqIEBwcmVzZXJ2ZSBXT1JLRVJfU0xBVkVfU1RBVElDX0ZVTkNUSU9OU19QTEFDRUhPTERFUiAqL1xuXG5jb25zdCBzbGF2ZSA9IG5ldyBCcm93c2VyV29ya2VyU2xhdmUoc2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlKTtcbm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBzbGF2ZS5vbk1lc3NhZ2UuYXBwbHkoc2xhdmUsIGFyZ3VtZW50cyk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2luZGV4LnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2luZGV4LnRzIiwiaW1wb3J0IHBhcmFsbGVsLCB7SVBhcmFsbGVsT3B0aW9uc30gZnJvbSBcInBhcmFsbGVsLWVzXCI7XG5pbXBvcnQge0lNYW5kZWxicm90T3B0aW9uc30gZnJvbSBcIi4uL2R5bmFtaWMvbWFuZGVsYnJvdFwiO1xuXG5pbnRlcmZhY2UgSUNvbXBsZXhOdW1iZXIge1xuICAgIGk6IG51bWJlcjtcbiAgICByZWFsOiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYW5kZWxicm90KHsgaW1hZ2VXaWR0aCwgaW1hZ2VIZWlnaHQsIGl0ZXJhdGlvbnMgfTogSU1hbmRlbGJyb3RPcHRpb25zLCBvcHRpb25zPzogSVBhcmFsbGVsT3B0aW9ucykge1xuICAgIC8vIFggYXhpcyBzaG93cyByZWFsIG51bWJlcnMsIHkgYXhpcyBpbWFnaW5hcnlcbiAgICBjb25zdCBtaW4gPSB7IGk6IC0xLjIsIHJlYWw6IC0yLjAgfTtcbiAgICBjb25zdCBtYXggPSB7IGk6IDAsIHJlYWw6IDEuMCB9O1xuICAgIG1heC5pID0gbWluLmkgKyAobWF4LnJlYWwgLSBtaW4ucmVhbCkgKiBpbWFnZUhlaWdodCAvIGltYWdlV2lkdGg7XG5cbiAgICBjb25zdCBzY2FsaW5nRmFjdG9yID0ge1xuICAgICAgICBpOiAobWF4LmkgLSBtaW4uaSkgLyAoaW1hZ2VIZWlnaHQgLSAxKSxcbiAgICAgICAgcmVhbDogKG1heC5yZWFsIC0gbWluLnJlYWwpIC8gKGltYWdlV2lkdGggLSAxKVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVaKGM6IElDb21wbGV4TnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgeiA9IHsgaTogYy5pLCByZWFsOiBjLnJlYWwgfTtcbiAgICAgICAgbGV0IG4gPSAwO1xuXG4gICAgICAgIGZvciAoOyBuIDwgaXRlcmF0aW9uczsgKytuKSB7XG4gICAgICAgICAgICBpZiAoei5yZWFsICogei5yZWFsICsgei5pICogei5pID4gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB6ICoqIDIgKyBjXG4gICAgICAgICAgICBjb25zdCB6SSA9IHouaTtcbiAgICAgICAgICAgIHouaSA9IDIgKiB6LnJlYWwgKiB6LmkgKyBjLmk7XG4gICAgICAgICAgICB6LnJlYWwgPSB6LnJlYWwgKiB6LnJlYWwgLSB6SSAqIHpJICsgYy5yZWFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5yYW5nZSgwLCBpbWFnZUhlaWdodCwgMSwgb3B0aW9ucylcbiAgICAgICAgLm1hcCh5ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkoaW1hZ2VXaWR0aCAqIDQpO1xuICAgICAgICAgICAgY29uc3QgY0kgPSBtYXguaSAtIHkgKiBzY2FsaW5nRmFjdG9yLmk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgaW1hZ2VXaWR0aDsgKyt4KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYyA9IHtcbiAgICAgICAgICAgICAgICAgICAgaTogY0ksXG4gICAgICAgICAgICAgICAgICAgIHJlYWw6IG1pbi5yZWFsICsgeCAqIHNjYWxpbmdGYWN0b3IucmVhbFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuID0gY2FsY3VsYXRlWihjKTtcbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlID0geCAqIDQ7XG4gICAgICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xuICAgICAgICAgICAgICAgIGxpbmVbYmFzZV0gPSBuICYgMHhGRjtcbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2UgKyAxXSA9IG4gJiAweEZGMDA7XG4gICAgICAgICAgICAgICAgbGluZVtiYXNlICsgMl0gPSBuICYgMHhGRjAwMDA7XG4gICAgICAgICAgICAgICAgbGluZVtiYXNlICsgM10gPSAyNTU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGluZTtcbiAgICAgICAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdHJhbnNwaWxlZC9tYW5kZWxicm90LnRzIiwiaW1wb3J0IHBhcmFsbGVsLCB7SVBhcmFsbGVsT3B0aW9uc30gZnJvbSBcInBhcmFsbGVsLWVzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvb3JkaW5hdGUge1xuICAgIHJlYWRvbmx5IHg6IG51bWJlcjtcbiAgICByZWFkb25seSB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUtuaWdodFRvdXJFbnZpcm9ubWVudCB7XG4gICAgYm9hcmRTaXplOiBudW1iZXI7XG4gICAgYm9hcmQ6IG51bWJlcltdO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbnZpcm9ubWVudChib2FyZFNpemU6IG51bWJlcik6IElLbmlnaHRUb3VyRW52aXJvbm1lbnQge1xuICAgIGNvbnN0IGJvYXJkOiBudW1iZXJbXSA9IG5ldyBBcnJheShib2FyZFNpemUgKiBib2FyZFNpemUpO1xuICAgIGJvYXJkLmZpbGwoMCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYm9hcmQsXG4gICAgICAgIGJvYXJkU2l6ZVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrbmlnaHRUb3VycyhzdGFydFBhdGg6IElDb29yZGluYXRlW10sIGVudmlyb25tZW50OiBJS25pZ2h0VG91ckVudmlyb25tZW50KTogbnVtYmVyIHtcbiAgICBjb25zdCBtb3ZlcyA9IFtcbiAgICAgICAgeyB4OiAtMiwgeTogLTEgfSwgeyB4OiAtMiwgeTogMX0sIHsgeDogLTEsIHk6IC0yIH0sIHsgeDogLTEsIHk6IDIgfSxcbiAgICAgICAgeyB4OiAxLCB5OiAtMiB9LCB7IHg6IDEsIHk6IDJ9LCB7IHg6IDIsIHk6IC0xIH0sIHsgeDogMiwgeTogMSB9XG4gICAgXTtcbiAgICBjb25zdCBib2FyZFNpemUgPSBlbnZpcm9ubWVudC5ib2FyZFNpemU7XG4gICAgY29uc3QgYm9hcmQgPSBlbnZpcm9ubWVudC5ib2FyZDtcbiAgICBjb25zdCBudW1iZXJPZkZpZWxkcyA9IGJvYXJkU2l6ZSAqIGJvYXJkU2l6ZTtcbiAgICBsZXQgcmVzdWx0czogbnVtYmVyID0gMDtcbiAgICBjb25zdCBzdGFjazogeyBjb29yZGluYXRlOiBJQ29vcmRpbmF0ZSwgbjogbnVtYmVyIH1bXSA9IHN0YXJ0UGF0aC5tYXAoKHBvcywgaW5kZXgpID0+ICh7IGNvb3JkaW5hdGU6IHBvcywgbjogaW5kZXggKyAxIH0pKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBzdGFydFBhdGgubGVuZ3RoIC0gMTsgKytpbmRleCkge1xuICAgICAgICBjb25zdCBmaWVsZEluZGV4ID0gc3RhcnRQYXRoW2luZGV4XS54ICogYm9hcmRTaXplICsgc3RhcnRQYXRoW2luZGV4XS55O1xuICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IGluZGV4ICsgMTtcbiAgICB9XG5cbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB7IGNvb3JkaW5hdGUsIG4gfSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICBjb25zdCBmaWVsZEluZGV4ID0gY29vcmRpbmF0ZS54ICogYm9hcmRTaXplICsgY29vcmRpbmF0ZS55O1xuXG4gICAgICAgIGlmIChib2FyZFtmaWVsZEluZGV4XSAhPT0gMCkge1xuICAgICAgICAgICAgLy8gYmFjayB0cmFja2luZ1xuICAgICAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSAwO1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7IC8vIHJlbW92ZSBjdXJyZW50IHZhbHVlXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVudHJ5XG4gICAgICAgIGlmIChuID09PSBudW1iZXJPZkZpZWxkcykge1xuICAgICAgICAgICAgKytyZXN1bHRzO1xuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gbiE7XG5cbiAgICAgICAgZm9yIChjb25zdCBtb3ZlIG9mIG1vdmVzKSB7XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3IgPSB7IHg6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55IH07XG4gICAgICAgICAgICAvLyBub3Qgb3V0c2lkZSBvZiBib2FyZCBhbmQgbm90IHlldCBhY2Nlc3NlZFxuICAgICAgICAgICAgY29uc3QgYWNjZXNzaWJsZSA9IHN1Y2Nlc3Nvci54ID49IDAgJiYgc3VjY2Vzc29yLnkgPj0gMCAmJiBzdWNjZXNzb3IueCA8IGJvYXJkU2l6ZSAmJiAgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiYgYm9hcmRbc3VjY2Vzc29yLnggKiBib2FyZFNpemUgKyBzdWNjZXNzb3IueV0gPT09IDA7XG5cbiAgICAgICAgICAgIGlmIChhY2Nlc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh7IGNvb3JkaW5hdGU6IHN1Y2Nlc3NvciwgbjogbiArIDEgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bmNLbmlnaHRUb3VycyhzdGFydDogSUNvb3JkaW5hdGUsIGJvYXJkU2l6ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IGNyZWF0ZUVudmlyb25tZW50KGJvYXJkU2l6ZSk7XG4gICAgcmV0dXJuIGtuaWdodFRvdXJzKFtzdGFydF0sIGVudmlyb25tZW50KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsS25pZ2h0VG91cnMoc3RhcnQ6IElDb29yZGluYXRlLCBib2FyZFNpemU6IG51bWJlciwgb3B0aW9ucz86IElQYXJhbGxlbE9wdGlvbnMpOiBQcm9taXNlTGlrZTxudW1iZXI+IHtcblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3NvcnMoY29vcmRpbmF0ZTogSUNvb3JkaW5hdGUpIHtcbiAgICAgICAgY29uc3QgbW92ZXMgPSBbXG4gICAgICAgICAgICB7eDogLTIsIHk6IC0xfSwge3g6IC0yLCB5OiAxfSwge3g6IC0xLCB5OiAtMn0sIHt4OiAtMSwgeTogMn0sXG4gICAgICAgICAgICB7eDogMSwgeTogLTJ9LCB7eDogMSwgeTogMn0sIHt4OiAyLCB5OiAtMX0sIHt4OiAyLCB5OiAxfVxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXN1bHQ6IElDb29yZGluYXRlW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IG1vdmUgb2YgbW92ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NvciA9IHt4OiBjb29yZGluYXRlLnggKyBtb3ZlLngsIHk6IGNvb3JkaW5hdGUueSArIG1vdmUueX07XG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NpYmxlID0gc3VjY2Vzc29yLnggPj0gMCAmJiBzdWNjZXNzb3IueSA+PSAwICYmIHN1Y2Nlc3Nvci54IDwgYm9hcmRTaXplICYmIHN1Y2Nlc3Nvci55IDwgYm9hcmRTaXplICYmXG4gICAgICAgICAgICAgICAgKHN1Y2Nlc3Nvci54ICE9PSBzdGFydC54IHx8IHN1Y2Nlc3Nvci55ICE9PSBzdGFydC55KSAmJiAoc3VjY2Vzc29yLnggIT09IGNvb3JkaW5hdGUueCAmJiBzdWNjZXNzb3IueSAhPT0gY29vcmRpbmF0ZS55KTtcbiAgICAgICAgICAgIGlmIChhY2Nlc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goc3VjY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZVN0YXJ0RmllbGRzKCkge1xuICAgICAgICBjb25zdCByZXN1bHQ6IElDb29yZGluYXRlW11bXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGRpcmVjdFN1Y2Nlc3NvciBvZiBzdWNjZXNzb3JzKHN0YXJ0KSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpbmRpcmVjdFN1Y2Nlc3NvciBvZiBzdWNjZXNzb3JzKGRpcmVjdFN1Y2Nlc3NvcikpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChbc3RhcnQsIGRpcmVjdFN1Y2Nlc3NvciwgaW5kaXJlY3RTdWNjZXNzb3JdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgbGV0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAuZnJvbShjb21wdXRlU3RhcnRGaWVsZHMoKSwgb3B0aW9ucylcbiAgICAgICAgLmluRW52aXJvbm1lbnQoY3JlYXRlRW52aXJvbm1lbnQsIGJvYXJkU2l6ZSlcbiAgICAgICAgLm1hcDxudW1iZXI+KGtuaWdodFRvdXJzKVxuICAgICAgICAucmVkdWNlKDAsIChtZW1vLCBjb3VudCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG1lbW8gKyBjb3VudDtcbiAgICAgICAgfSlcbiAgICAgICAgLnN1YnNjcmliZShzdWJSZXN1bHRzID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdG91cnMgb2Ygc3ViUmVzdWx0cykge1xuICAgICAgICAgICAgICAgIHRvdGFsICs9IHRvdXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tY29uc29sZSAqL1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dG90YWwgLyAocGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFRpbWUpICogMTAwMH0gcmVzdWx0cyBwZXIgc2Vjb25kYCk7XG4gICAgICAgIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RyYW5zcGlsZWQva25pZ2h0cy10b3VyLnRzIiwiaW1wb3J0IHBhcmFsbGVsIGZyb20gXCJwYXJhbGxlbC1lc1wiO1xuaW1wb3J0IHtEaWN0aW9uYXJ5fSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgUmFuZG9tIGZyb20gXCJzaW1qcy1yYW5kb21cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJUHJvamVjdCB7XG4gICAgc3RhcnRZZWFyOiBudW1iZXI7XG4gICAgdG90YWxBbW91bnQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElCdWNrZXQge1xuICAgIG1pbjogbnVtYmVyO1xuICAgIG1heDogbnVtYmVyO1xuXG4gICAgc3ViQnVja2V0czogeyBbZ3JvdXBOYW1lOiBzdHJpbmddOiB7IGdyb3VwOiBzdHJpbmc7IG1pbjogbnVtYmVyLCBtYXg6IG51bWJlciB9IH07XG59XG5cbmludGVyZmFjZSBJR3JvdXAge1xuICAgIC8qKlxuICAgICAqIFRoZSB1bmlxdWUgbmFtZSBvZiB0aGlzIGdyb3VwXG4gICAgICovXG4gICAgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBncm91cFxuICAgICAqL1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgYSBzZXBhcmF0b3IgbGluZSBiZWVuIGRyYXduIGZvciB0aGlzIGdyb3VwP1xuICAgICAqL1xuICAgIHNlcGFyYXRvcjogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBwZXJjZW50YWdlIG9mIHZhbHVlcyBpbiB0aGlzIGdyb3VwIHRvIHRoZSB0b3RhbCBudW1iZXIgb2Ygc2ltdWxhdGVkIHZhbHVlc1xuICAgICAqL1xuICAgIHBlcmNlbnRhZ2U6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBtaW5pbXVtIHZhbHVlIHRoYXQgaXMgc3RpbGwgcGFydCBvZiB0aGlzIGdyb3VwXG4gICAgICovXG4gICAgZnJvbT86IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBXaGF0cyB0aGUgbWF4aW11bSB2YWx1ZSAoZXhjbHVzaXZlKSB0aGF0IGRlZmluZXMgdGhlIHVwcGVyIGVuZCBvZiB0aGlzIGdyb3VwXG4gICAgICovXG4gICAgdG8/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb2plY3RSZXN1bHQge1xuICAgIC8qKlxuICAgICAqIFRoZSBtaW5pbWFsIHNpbXVsYXRlZCB2YWx1ZSBmb3IgdGhpcyBwcm9qZWN0XG4gICAgICovXG4gICAgbWluOiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogVGhlIG1heGltYWwgc2ltdWxhdGVkIHZhbHVlXG4gICAgICovXG4gICAgbWF4OiBudW1iZXI7XG5cbiAgICAvKiogVGhlIG1lZGlhbiBvZiB0aGUgdmFsdWVzIGZvdW5kIGZvciB0aGlzIHByb2plY3RcbiAgICAgKi9cbiAgICBtZWRpYW46IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgd2hlcmUgdGhlIDIvMyBvZiB0aGUgc2ltdWxhdGVkIHZhbHVlcyBzdGFydCAvIGVuZC5cbiAgICAgKi9cbiAgICB0d29UaGlyZDoge1xuICAgICAgICBtaW46IG51bWJlcjtcbiAgICAgICAgbWF4OiBudW1iZXI7XG4gICAgfTtcblxuICAgIGJ1Y2tldHM6IElCdWNrZXRbXTtcblxuICAgIGdyb3VwczogSUdyb3VwW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcHJvamVjdFxuICAgICAqL1xuICAgIHByb2plY3Q6IElQcm9qZWN0O1xufVxuXG5pbnRlcmZhY2UgSU1vbnRlQ2FybG9FbnZpcm9ubWVudCB7XG4gICAgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyO1xuICAgIGxpcXVpZGl0eTogbnVtYmVyO1xuICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lOiBudW1iZXJbXTtcbiAgICBudW1SdW5zOiBudW1iZXI7XG4gICAgbnVtWWVhcnM6IG51bWJlcjtcbiAgICBwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+O1xuICAgIHNpbXVsYXRlZFZhbHVlczogbnVtYmVyW11bXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICBudW1ZZWFycz86IG51bWJlcjtcbiAgICBudW1SdW5zPzogbnVtYmVyO1xuICAgIHByb2plY3RzPzogSVByb2plY3RbXTtcbiAgICBpbnZlc3RtZW50QW1vdW50PzogbnVtYmVyO1xuICAgIHBlcmZvcm1hbmNlPzogbnVtYmVyO1xuICAgIHNlZWQ/OiBudW1iZXI7XG4gICAgdm9sYXRpbGl0eTogbnVtYmVyO1xuICAgIGxpcXVpZGl0eT86IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgbnVtWWVhcnM6IG51bWJlcjtcbiAgICBudW1SdW5zOiBudW1iZXI7XG4gICAgcHJvamVjdHM6IElQcm9qZWN0W107XG4gICAgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyO1xuICAgIHBlcmZvcm1hbmNlOiBudW1iZXI7XG4gICAgc2VlZD86IG51bWJlcjtcbiAgICB0YXNrSW5kZXg/OiBudW1iZXI7XG4gICAgdmFsdWVzUGVyV29ya2VyPzogbnVtYmVyO1xuICAgIGxpcXVpZGl0eTogbnVtYmVyO1xuICAgIHZvbGF0aWxpdHk6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZU9wdGlvbnMob3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpOiBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgIGludmVzdG1lbnRBbW91bnQ6IDEwMDAwMDAsXG4gICAgICAgIGxpcXVpZGl0eTogMTAwMDAsXG4gICAgICAgIG51bVJ1bnM6IDEwMDAwLFxuICAgICAgICBudW1ZZWFyczogMTAsXG4gICAgICAgIHBlcmZvcm1hbmNlOiAwLFxuICAgICAgICBwcm9qZWN0czogW10sXG4gICAgICAgIHNlZWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdm9sYXRpbGl0eTogMC4wMVxuICAgIH0sIG9wdGlvbnMpO1xufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChvcHRpb25zOiBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpOiBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcblxuICAgIGZ1bmN0aW9uIHByb2plY3RzVG9DYXNoRmxvd3MocHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPiwgbnVtWWVhcnM6IG51bWJlcikge1xuICAgICAgICBjb25zdCBjYXNoRmxvd3M6IG51bWJlcltdID0gW107XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdHNCeVRoaXNZZWFyID0gcHJvamVjdHNCeVN0YXJ0WWVhclt5ZWFyXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IGNhc2hGbG93ID0gLXByb2plY3RzQnlUaGlzWWVhci5yZWR1Y2UoKG1lbW8sIHByb2plY3QpID0+IG1lbW8gKyBwcm9qZWN0LnRvdGFsQW1vdW50LCAwKTtcbiAgICAgICAgICAgIGNhc2hGbG93cy5wdXNoKGNhc2hGbG93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FzaEZsb3dzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lKGNhc2hGbG93czogbnVtYmVyW10sIGludmVzdG1lbnRBbW91bnQ6IG51bWJlciwgbnVtWWVhcnM6IG51bWJlcikge1xuICAgICAgICBjb25zdCBub0ludGVyZXN0UmVmZXJlbmNlTGluZTogbnVtYmVyW10gPSBbXTtcblxuICAgICAgICBsZXQgaW52ZXN0bWVudEFtb3VudExlZnQgPSBpbnZlc3RtZW50QW1vdW50O1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IG51bVllYXJzOyArK3llYXIpIHtcbiAgICAgICAgICAgIGludmVzdG1lbnRBbW91bnRMZWZ0ID0gaW52ZXN0bWVudEFtb3VudExlZnQgKyBjYXNoRmxvd3NbeWVhcl07XG4gICAgICAgICAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZS5wdXNoKGludmVzdG1lbnRBbW91bnRMZWZ0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9BYnNvbHV0ZUluZGljZXMoaW5kaWNlczogbnVtYmVyW10sIGludmVzdG1lbnRBbW91bnQ6IG51bWJlciwgY2FzaEZsb3dzOiBudW1iZXJbXSkge1xuICAgICAgICBsZXQgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gaW52ZXN0bWVudEFtb3VudDtcbiAgICAgICAgbGV0IHByZXZpb3VzWWVhckluZGV4ID0gMTAwO1xuXG4gICAgICAgIGZvciAobGV0IHJlbGF0aXZlWWVhciA9IDA7IHJlbGF0aXZlWWVhciA8IGluZGljZXMubGVuZ3RoOyArK3JlbGF0aXZlWWVhcikge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXJJbmRleCA9IGluZGljZXNbcmVsYXRpdmVZZWFyXTtcbiAgICAgICAgICAgIGNvbnN0IGNhc2hGbG93U3RhcnRPZlllYXIgPSByZWxhdGl2ZVllYXIgPT09IDAgPyAwIDogY2FzaEZsb3dzW3JlbGF0aXZlWWVhciAtIDFdO1xuXG4gICAgICAgICAgICAvLyBzY2FsZSBjdXJyZW50IHZhbHVlIHdpdGggcGVyZm9ybWFuY2UgZ2FpbiBhY2NvcmRpbmcgdG8gaW5kZXhcbiAgICAgICAgICAgIGNvbnN0IHBlcmZvcm1hbmNlID0gY3VycmVudFllYXJJbmRleCAvIHByZXZpb3VzWWVhckluZGV4O1xuICAgICAgICAgICAgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gKGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSArIGNhc2hGbG93U3RhcnRPZlllYXIpICogcGVyZm9ybWFuY2U7XG5cbiAgICAgICAgICAgIGluZGljZXNbcmVsYXRpdmVZZWFyXSA9IE1hdGgucm91bmQoY3VycmVudFBvcnRmb2xpb1ZhbHVlKTtcbiAgICAgICAgICAgIHByZXZpb3VzWWVhckluZGV4ID0gY3VycmVudFllYXJJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRpY2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBtb250ZSBjYXJsbyBzaW11bGF0aW9uIGZvciBhbGwgeWVhcnMgYW5kIG51bSBydW5zLlxuICAgICAqIEBwYXJhbSBjYXNoRmxvd3MgdGhlIGNhc2ggZmxvd3NcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW11bXX0gdGhlIHNpbXVsYXRlZCBvdXRjb21lcyBncm91cGVkIGJ5IHllYXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93czogbnVtYmVyW10sIGludmVzdG1lbnRBbW91bnQ6IG51bWJlciwgeyBudW1SdW5zLCBudW1ZZWFycywgdm9sYXRpbGl0eSwgcGVyZm9ybWFuY2UgfTogeyBudW1SdW5zOiBudW1iZXIsIG51bVllYXJzOiBudW1iZXIsIHZvbGF0aWxpdHk6IG51bWJlciwgcGVyZm9ybWFuY2U6IG51bWJlcn0pOiBudW1iZXJbXVtdICB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogbnVtYmVyW11bXSA9IG5ldyBBcnJheShudW1ZZWFycyk7XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDw9IG51bVllYXJzOyArK3llYXIpIHtcbiAgICAgICAgICAgIHJlc3VsdFt5ZWFyXSA9IG5ldyBBcnJheShudW1SdW5zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IG5ldyBSYW5kb20oMTApO1xuICAgICAgICBmb3IgKGxldCBydW4gPSAwOyBydW4gPCBudW1SdW5zOyBydW4rKykge1xuICAgICAgICAgICAgY29uc3QgaW5kaWNlcyA9IFsxMDBdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBudW1ZZWFyczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tUGVyZm9ybWFuY2UgPSAxICsgcmFuZG9tLm5vcm1hbChwZXJmb3JtYW5jZSwgdm9sYXRpbGl0eSk7XG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGluZGljZXNbaSAtIDFdICogcmFuZG9tUGVyZm9ybWFuY2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IHRoZSByZWxhdGl2ZSB2YWx1ZXMgZnJvbSBhYm92ZSB0byBhYnNvbHV0ZSB2YWx1ZXMuXG4gICAgICAgICAgICB0b0Fic29sdXRlSW5kaWNlcyhpbmRpY2VzLCBpbnZlc3RtZW50QW1vdW50LCBjYXNoRmxvd3MpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IGluZGljZXMubGVuZ3RoOyArK3llYXIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbeWVhcl1bcnVuXSA9IGluZGljZXNbeWVhcl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGxldCBwcm9qZWN0c1RvU2ltdWxhdGU6IElQcm9qZWN0W10gPSBvcHRpb25zLnByb2plY3RzO1xuXG4gICAgaWYgKG9wdGlvbnMudGFza0luZGV4ICYmIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyKSB7XG4gICAgICAgIHByb2plY3RzVG9TaW11bGF0ZSA9IG9wdGlvbnMucHJvamVjdHMuc2xpY2Uob3B0aW9ucy50YXNrSW5kZXggKiBvcHRpb25zLnZhbHVlc1BlcldvcmtlciwgKG9wdGlvbnMudGFza0luZGV4ICsgMSkgKiBvcHRpb25zLnZhbHVlc1Blcldvcmtlcik7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvamVjdHMgPSBvcHRpb25zLnByb2plY3RzLnNvcnQoKGEsIGIpID0+IGEuc3RhcnRZZWFyIC0gYi5zdGFydFllYXIpO1xuXG4gICAgLy8gR3JvdXAgcHJvamVjdHMgYnkgc3RhcnRZZWFyLCB1c2UgbG9kYXNoIGdyb3VwQnkgaW5zdGVhZFxuICAgIGNvbnN0IHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT4gPSB7fTtcbiAgICBmb3IgKGNvbnN0IHByb2plY3Qgb2YgcHJvamVjdHMpIHtcbiAgICAgICAgY29uc3QgYXJyID0gcHJvamVjdHNCeVN0YXJ0WWVhcltwcm9qZWN0LnN0YXJ0WWVhcl0gPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXSB8fCBbXTtcbiAgICAgICAgYXJyLnB1c2gocHJvamVjdCk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FzaEZsb3dzID0gcHJvamVjdHNUb0Nhc2hGbG93cyhwcm9qZWN0c0J5U3RhcnRZZWFyLCBvcHRpb25zLm51bVllYXJzKTtcbiAgICBjb25zdCBub0ludGVyZXN0UmVmZXJlbmNlTGluZSA9IGNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lKGNhc2hGbG93cywgb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LCBvcHRpb25zLm51bVllYXJzKTtcblxuICAgIGNvbnN0IG51bVllYXJzID0gcHJvamVjdHNUb1NpbXVsYXRlLnJlZHVjZSgobWVtbywgcHJvamVjdCkgPT4gTWF0aC5tYXgobWVtbywgcHJvamVjdC5zdGFydFllYXIpLCAwKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGludmVzdG1lbnRBbW91bnQ6IG9wdGlvbnMuaW52ZXN0bWVudEFtb3VudCxcbiAgICAgICAgbGlxdWlkaXR5OiBvcHRpb25zLmxpcXVpZGl0eSxcbiAgICAgICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUsXG4gICAgICAgIG51bVJ1bnM6IG9wdGlvbnMubnVtUnVucyxcbiAgICAgICAgbnVtWWVhcnMsXG4gICAgICAgIHByb2plY3RzQnlTdGFydFllYXIsXG4gICAgICAgIHNpbXVsYXRlZFZhbHVlczogc2ltdWxhdGVPdXRjb21lcyhjYXNoRmxvd3MsIG9wdGlvbnMuaW52ZXN0bWVudEFtb3VudCwgb3B0aW9ucylcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBncm91cEZvclZhbHVlKHZhbHVlOiBudW1iZXIsIGdyb3VwczogSUdyb3VwW10pOiBJR3JvdXAge1xuICAgIHJldHVybiBncm91cHMuZmluZChncm91cCA9PiAodHlwZW9mIGdyb3VwLmZyb20gPT09IFwidW5kZWZpbmVkXCIgfHwgZ3JvdXAuZnJvbSA8PSB2YWx1ZSkgJiYgKHR5cGVvZiBncm91cC50byA9PT0gXCJ1bmRlZmluZWRcIiB8fCBncm91cC50byA+IHZhbHVlKSkhO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVHcm91cHMocmVxdWlyZWRBbW91bnQ6IG51bWJlciwgbm9JbnRlcmVzdFJlZmVyZW5jZTogbnVtYmVyLCBsaXF1aWRpdHk6IG51bWJlcik6IElHcm91cFtdIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIlppZWwgZXJyZWljaGJhclwiLCBmcm9tOiByZXF1aXJlZEFtb3VudCwgbmFtZTogXCJncmVlblwiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IHRydWV9LFxuICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIm1pdCBadXNhdHpsaXF1aWRpdMOkdCBlcnJlaWNoYmFyXCIsIGZyb206IHJlcXVpcmVkQW1vdW50IC0gbGlxdWlkaXR5LCBuYW1lOiBcInllbGxvd1wiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IHRydWUsIHRvOiByZXF1aXJlZEFtb3VudCB9LFxuICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIm5pY2h0IGVycmVpY2hiYXJcIiwgZnJvbTogbm9JbnRlcmVzdFJlZmVyZW5jZSwgbmFtZTogXCJncmF5XCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogZmFsc2UsIHRvOiByZXF1aXJlZEFtb3VudCAtIGxpcXVpZGl0eSB9LFxuICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIm5pY2h0IGVycmVpY2hiYXIsIG1pdCBWZXJsdXN0XCIsIG5hbWU6IFwicmVkXCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogZmFsc2UsIHRvOiBub0ludGVyZXN0UmVmZXJlbmNlIH1cbiAgICBdO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVSZXF1aXJlZEFtb3VudChwcm9qZWN0OiBJUHJvamVjdCwgcHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPikge1xuICAgIGxldCBhbW91bnQgPSBwcm9qZWN0LnRvdGFsQW1vdW50O1xuICAgIGNvbnN0IHByb2plY3RzU2FtZVllYXIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXTtcblxuICAgIGZvciAoY29uc3Qgb3RoZXJQcm9qZWN0IG9mIHByb2plY3RzU2FtZVllYXIpIHtcbiAgICAgICAgaWYgKG90aGVyUHJvamVjdCA9PT0gcHJvamVjdCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYW1vdW50ICs9IG90aGVyUHJvamVjdC50b3RhbEFtb3VudDtcbiAgICB9XG4gICAgcmV0dXJuIGFtb3VudDtcbn1cblxuZnVuY3Rpb24gbWVkaWFuKHZhbHVlczogbnVtYmVyW10pIHtcbiAgICBjb25zdCBoYWxmID0gTWF0aC5mbG9vcih2YWx1ZXMubGVuZ3RoIC8gMik7XG5cbiAgICBpZiAodmFsdWVzLmxlbmd0aCAlIDIpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlc1toYWxmXTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHZhbHVlc1toYWxmIC0gMV0gKyB2YWx1ZXNbaGFsZl0pIC8gMi4wO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVQcm9qZWN0KHByb2plY3Q6IElQcm9qZWN0LCBlbnZpcm9ubWVudDogSU1vbnRlQ2FybG9FbnZpcm9ubWVudCk6IElQcm9qZWN0UmVzdWx0IHtcbiAgICBjb25zdCBOVU1CRVJfT0ZfQlVDS0VUUyA9IDEwO1xuXG4gICAgY29uc3QgcmVxdWlyZWRBbW91bnQgPSBjYWxjdWxhdGVSZXF1aXJlZEFtb3VudChwcm9qZWN0LCBlbnZpcm9ubWVudC5wcm9qZWN0c0J5U3RhcnRZZWFyKTtcbiAgICBjb25zdCBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhciA9IGVudmlyb25tZW50LnNpbXVsYXRlZFZhbHVlc1twcm9qZWN0LnN0YXJ0WWVhcl07XG4gICAgc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuXG4gICAgY29uc3QgZ3JvdXBzID0gY3JlYXRlR3JvdXBzKHJlcXVpcmVkQW1vdW50LCBlbnZpcm9ubWVudC5ub0ludGVyZXN0UmVmZXJlbmNlTGluZVtwcm9qZWN0LnN0YXJ0WWVhcl0sIGVudmlyb25tZW50LmxpcXVpZGl0eSk7XG4gICAgY29uc3QgdmFsdWVzQnlHcm91cDogeyBbZ3JvdXBOYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IHt9O1xuICAgIGNvbnN0IGJ1Y2tldFNpemUgPSBNYXRoLnJvdW5kKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAvIE5VTUJFUl9PRl9CVUNLRVRTKTtcbiAgICBjb25zdCBidWNrZXRzOiBJQnVja2V0W10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoOyBpICs9IGJ1Y2tldFNpemUpIHtcbiAgICAgICAgY29uc3QgYnVja2V0OiBJQnVja2V0ID0ge1xuICAgICAgICAgICAgbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLFxuICAgICAgICAgICAgbWluOiBOdW1iZXIuTUFYX1ZBTFVFLFxuICAgICAgICAgICAgc3ViQnVja2V0czoge31cbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBqID0gaTsgaiA8IGkgKyBidWNrZXRTaXplOyArK2opIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbal07XG4gICAgICAgICAgICBidWNrZXQubWluID0gTWF0aC5taW4oYnVja2V0Lm1pbiwgdmFsdWUpO1xuICAgICAgICAgICAgYnVja2V0Lm1heCA9IE1hdGgubWF4KGJ1Y2tldC5tYXgsIHZhbHVlKTtcblxuICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSBncm91cEZvclZhbHVlKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW2pdLCBncm91cHMpO1xuICAgICAgICAgICAgdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSA9ICh2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdIHx8IDApICsgMTtcbiAgICAgICAgICAgIGNvbnN0IHN1YkJ1Y2tldCA9IGJ1Y2tldC5zdWJCdWNrZXRzW2dyb3VwLm5hbWVdID0gYnVja2V0LnN1YkJ1Y2tldHNbZ3JvdXAubmFtZV0gfHwgeyBncm91cDogZ3JvdXAubmFtZSwgbWF4OiBOdW1iZXIuTUlOX1ZBTFVFLCBtaW46IE51bWJlci5NQVhfVkFMVUUgfTtcbiAgICAgICAgICAgIHN1YkJ1Y2tldC5taW4gPSBNYXRoLm1pbihzdWJCdWNrZXQubWluLCB2YWx1ZSk7XG4gICAgICAgICAgICBzdWJCdWNrZXQubWF4ID0gTWF0aC5tYXgoc3ViQnVja2V0Lm1heCwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnVja2V0cy5wdXNoKGJ1Y2tldCk7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9uRW1wdHlHcm91cHMgPSBncm91cHMuZmlsdGVyKGdyb3VwID0+ICEhdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSk7XG4gICAgbm9uRW1wdHlHcm91cHMuZm9yRWFjaChncm91cCA9PiBncm91cC5wZXJjZW50YWdlID0gdmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSAvIHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCk7XG5cbiAgICBjb25zdCBvbmVTaXh0aCA9IE1hdGgucm91bmQoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC8gNik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnVja2V0cyxcbiAgICAgICAgZ3JvdXBzOiBub25FbXB0eUdyb3VwcyxcbiAgICAgICAgbWF4OiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLSAxXSxcbiAgICAgICAgbWVkaWFuOiBtZWRpYW4oc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIpLFxuICAgICAgICBtaW46IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyWzBdLFxuICAgICAgICBwcm9qZWN0LFxuICAgICAgICB0d29UaGlyZDoge1xuICAgICAgICAgICAgbWF4OiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLSBvbmVTaXh0aF0sXG4gICAgICAgICAgICBtaW46IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW29uZVNpeHRoXVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bmNNb250ZUNhcmxvKG9wdGlvbnM/OiBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zKSB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBjcmVhdGVNb250ZUNhcmxvRW52aXJvbm1lbnQoaW5pdGlhbGl6ZU9wdGlvbnMob3B0aW9ucykpO1xuXG4gICAgbGV0IHByb2plY3RzOiBJUHJvamVjdFJlc3VsdFtdID0gW107XG4gICAgZm9yIChjb25zdCBwcm9qZWN0IG9mIG9wdGlvbnMhLnByb2plY3RzISkge1xuICAgICAgICBwcm9qZWN0cy5wdXNoKGNhbGN1bGF0ZVByb2plY3QocHJvamVjdCwgZW52aXJvbm1lbnQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvamVjdHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbE1vbnRlQ2FybG8odXNlck9wdGlvbnM/OiBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGluaXRpYWxpemVPcHRpb25zKHVzZXJPcHRpb25zKTtcbiAgICByZXR1cm4gcGFyYWxsZWxcbiAgICAgICAgLmZyb20ob3B0aW9ucy5wcm9qZWN0cywgeyBtaW5WYWx1ZXNQZXJUYXNrOiAyIH0pXG4gICAgICAgIC5pbkVudmlyb25tZW50KGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudCwgb3B0aW9ucylcbiAgICAgICAgLm1hcChjYWxjdWxhdGVQcm9qZWN0KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90cmFuc3BpbGVkL21vbnRlLWNhcmxvLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==