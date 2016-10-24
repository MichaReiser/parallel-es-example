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

            function _calculateZWrapper() {
                "use strict";

                var callee = _calculateZ;
                var $_args_len = arguments.length;
                var $_len = ($_args_len < callee.length ? callee.length : $_args_len) + 1;
                var args = new Array($_len);

                for (var $_i = 0; $_i < $_args_len; ++$_i) {
                    args[$_i] = arguments[$_i];
                }

                args[$_len - 1] = _environment;
                return callee.apply(this, args);
            }

            var line = new Uint8ClampedArray(_environment.imageWidth * 4);var cI = _environment.max.i - y * _environment.scalingFactor.i;for (var x = 0; x < _environment.imageWidth; ++x) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTlmY2JlZGE4MTUzYzY1NmM3NWUiLCJ3ZWJwYWNrOi8vLy4vfi9zaW1qcy1yYW5kb20vc2ltanMtcmFuZG9tLmpzIiwid2VicGFjazovLy8uL3dlYnBhY2s6L3dlYnBhY2svYm9vdHN0cmFwIDk1MGEyZjgyODQyZjgzODU3NGZkIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vdXRpbC9hcnJheXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9mdW5jdGlvbi9zZXJpYWxpemVkLWZ1bmN0aW9uLWNhbGwudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9icm93c2VyLXdvcmtlci1zbGF2ZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL3NsYXZlLWZ1bmN0aW9uLWxvb2t1cC10YWJsZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLXN0YXRlcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWNhbGwtZGVzZXJpYWxpemVyLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24taWQudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9maWx0ZXItaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9tYXAtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC1qb2ItZXhlY3V0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcmFuZ2UtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yZWR1Y2UtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL2lkZW50aXR5LnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vdXRpbC9zaW1wbGUtbWFwLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhbnNwaWxlZC9tYW5kZWxicm90LnRzIiwid2VicGFjazovLy8uL3NyYy90cmFuc3BpbGVkL2tuaWdodHMtdG91ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhbnNwaWxlZC9tb250ZS1jYXJsby50cyJdLCJuYW1lcyI6WyJpbnN0YWxsZWRNb2R1bGVzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiZXhwb3J0cyIsIm1vZHVsZSIsImkiLCJsIiwibW9kdWxlcyIsImNhbGwiLCJtIiwiYyIsInZhbHVlIiwiZCIsIm5hbWUiLCJnZXR0ZXIiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJnZXQiLCJuIiwiX19lc01vZHVsZSIsImdldERlZmF1bHQiLCJnZXRNb2R1bGVFeHBvcnRzIiwibyIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsInRvSXRlcmF0b3IiLCJkYXRhIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJ0b0FycmF5IiwicmVzdWx0IiwiY3VycmVudCIsIm5leHQiLCJkb25lIiwicHVzaCIsImZsYXR0ZW5BcnJheSIsImRlZXBBcnJheSIsImxlbmd0aCIsImhlYWQiLCJ0YWlsIiwiQXJyYXkiLCJjb25jYXQiLCJhcHBseSIsImlzU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCIsInBvdGVudGlhbEZ1bmMiLCJfX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsIiwiaXNTdG9wTWVzc3NhZ2UiLCJXb3JrZXJNZXNzYWdlVHlwZSIsImluaXRpYWxpemVXb3JrZXJNZXNzYWdlIiwiaWQiLCJ0eXBlIiwiSW5pdGlhbGl6ZVdvcmtlciIsIndvcmtlcklkIiwic2NoZWR1bGVUYXNrTWVzc2FnZSIsInRhc2siLCJTY2hlZHVsZVRhc2siLCJyZXF1ZXN0RnVuY3Rpb25NZXNzYWdlIiwiZnVuY3Rpb25JZCIsIm90aGVyRnVuY3Rpb25JZHMiLCJmdW5jdGlvbklkcyIsIkZ1bmN0aW9uUmVxdWVzdCIsImZ1bmN0aW9uUmVzcG9uc2VNZXNzYWdlIiwiZnVuY3Rpb25zIiwibWlzc2luZ0Z1bmN0aW9uSWRzIiwibWlzc2luZ0Z1bmN0aW9ucyIsIkZ1bmN0aW9uUmVzcG9uc2UiLCJ3b3JrZXJSZXN1bHRNZXNzYWdlIiwiV29ya2VyUmVzdWx0IiwiZnVuY3Rpb25FeGVjdXRpb25FcnJvciIsImVycm9yIiwiZXJyb3JPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwicHJvcCIsIkpTT04iLCJzdHJpbmdpZnkiLCJGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwic3RvcE1lc3NhZ2UiLCJTdG9wIiwiaXNTY2hlZHVsZVRhc2siLCJtZXNzYWdlIiwiaXNJbml0aWFsaXplTWVzc2FnZSIsImlzRnVuY3Rpb25SZXF1ZXN0IiwiaXNGdW5jdGlvblJlc3BvbnNlIiwiaXNXb3JrZXJSZXN1bHQiLCJpc0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IiLCJCcm93c2VyV29ya2VyU2xhdmUiLCJmdW5jdGlvbkNhY2hlIiwiTnVtYmVyIiwiTmFOIiwic3RhdGUiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX2Jyb3dzZXJfd29ya2VyX3NsYXZlX3N0YXRlc19fIiwiZW50ZXIiLCJldmVudCIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fY29tbW9uX3dvcmtlcl93b3JrZXJfbWVzc2FnZXNfXyIsImNsb3NlIiwib25NZXNzYWdlIiwiRXJyb3IiLCJwb3N0TWVzc2FnZSIsIlNsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZSIsImNhY2hlIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX191dGlsX3NpbXBsZV9tYXBfXyIsImlkZW50aWZpZXIiLCJkZWZpbml0aW9uIiwiZiIsIkZ1bmN0aW9uIiwiYXJndW1lbnROYW1lcyIsImJvZHkiLCJzZXQiLCJmdW5jIiwiaGFzIiwicmVnaXN0ZXJTdGF0aWNQYXJhbGxlbEZ1bmN0aW9ucyIsImxvb2t1cFRhYmxlIiwicmVnaXN0ZXJTdGF0aWNGdW5jdGlvbiIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMF9fcGFyYWxsZWxfd29ya2VyX2Z1bmN0aW9uc19fIiwiSURFTlRJVFkiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzFfX3V0aWxfaWRlbnRpdHlfXyIsIkZJTFRFUiIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMl9fZmlsdGVyX2l0ZXJhdG9yX18iLCJNQVAiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzNfX21hcF9pdGVyYXRvcl9fIiwiUEFSQUxMRUxfSk9CX0VYRUNVVE9SIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV80X19wYXJhbGxlbF9qb2JfZXhlY3V0b3JfXyIsIlJBTkdFIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV81X19yYW5nZV9pdGVyYXRvcl9fIiwiUkVEVUNFIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV82X19yZWR1Y2VfaXRlcmF0b3JfXyIsIlRPX0lURVJBVE9SIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV83X191dGlsX2FycmF5c19fIiwiQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJzbGF2ZSIsIkRlZmF1bHRCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fY29tbW9uX3dvcmtlcl93b3JrZXJfbWVzc2FnZXNfXyIsImNoYW5nZVN0YXRlIiwiSWRsZUJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIiwidXNlZEZ1bmN0aW9uSWRzIiwiZmlsdGVyIiwiRXhlY3V0ZUZ1bmN0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJXYWl0aW5nRm9yRnVuY3Rpb25EZWZpbml0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJpZGVudGlmaWVycyIsIm1hcCIsImpvaW4iLCJyZWdpc3RlckZ1bmN0aW9uIiwiZnVuY3Rpb25EZXNlcmlhbGl6ZXIiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX2NvbW1vbl9mdW5jdGlvbl9mdW5jdGlvbl9jYWxsX2Rlc2VyaWFsaXplcl9fIiwibWFpbiIsImRlc2VyaWFsaXplRnVuY3Rpb25DYWxsIiwiZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIiwiRnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIiwiZnVuY3Rpb25Mb29rdXBUYWJsZSIsImZ1bmN0aW9uQ2FsbCIsImRlc2VyaWFsaXplUGFyYW1zIiwiZ2V0RnVuY3Rpb24iLCJwYXJhbXMiLCJwYXJhbWV0ZXJzIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19zZXJpYWxpemVkX2Z1bmN0aW9uX2NhbGxfXyIsInBhcmFtIiwiYWRkaXRpb25hbFBhcmFtcyIsInVuZGVmaW5lZCIsIm5hbWVzcGFjZSIsIl9fX19fX19pc0Z1bmN0aW9uSWQiLCJpc0Z1bmN0aW9uSWQiLCJvYmoiLCJmaWx0ZXJJdGVyYXRvciIsInByZWRpY2F0ZSIsImVudiIsIm1hcEl0ZXJhdG9yIiwiaXRlcmF0ZWUiLCJjcmVhdGVUYXNrRW52aXJvbm1lbnQiLCJ0YXNrRW52aXJvbm1lbnQiLCJlbnZpcm9ubWVudHMiLCJlbnZpcm9ubWVudCIsImN1cnJlbnRFbnZpcm9ubWVudCIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fZnVuY3Rpb25fc2VyaWFsaXplZF9mdW5jdGlvbl9jYWxsX18iLCJhc3NpZ24iLCJ0YXNrSW5kZXgiLCJ2YWx1ZXNQZXJUYXNrIiwicGFyYWxsZWxKb2JFeGVjdXRvciIsImdlbmVyYXRvckZ1bmN0aW9uIiwiZ2VuZXJhdG9yIiwib3BlcmF0aW9ucyIsIm9wZXJhdGlvbiIsIml0ZXJhdG9yRnVuY3Rpb24iLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX3V0aWxfYXJyYXlzX18iLCJQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19mdW5jdGlvbl9mdW5jdGlvbl9pZF9fIiwiVElNRVMiLCJyYW5nZUl0ZXJhdG9yIiwic3RhcnQiLCJlbmQiLCJzdGVwIiwicmVkdWNlSXRlcmF0b3IiLCJkZWZhdWx0VmFsdWUiLCJhY2N1bXVsYXRlZFZhbHVlIiwiaWRlbnRpdHkiLCJlbGVtZW50IiwiU2ltcGxlTWFwIiwia2V5IiwiaW50ZXJuYWxLZXkiLCJ0b0ludGVybmFsS2V5Iiwic2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19jb21tb25fZnVuY3Rpb25fc2xhdmVfZnVuY3Rpb25fbG9va3VwX3RhYmxlX18iLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfX2NvbW1vbl9wYXJhbGxlbF9zbGF2ZV9yZWdpc3Rlcl9wYXJhbGxlbF93b3JrZXJfZnVuY3Rpb25zX18iLCJ6IiwicmVhbCIsIml0ZXJhdGlvbnMiLCJ6SSIsInkiLCJsaW5lIiwiVWludDhDbGFtcGVkQXJyYXkiLCJjSSIsIngiLCJpbWFnZVdpZHRoIiwiYmFzZSIsIm1lbW8iLCJjb3VudCIsImtuaWdodFRvdXJzIiwic3RhcnRQYXRoIiwibW92ZXMiLCJib2FyZFNpemUiLCJib2FyZCIsIm51bWJlck9mRmllbGRzIiwicmVzdWx0cyIsInN0YWNrIiwicG9zIiwiaW5kZXgiLCJjb29yZGluYXRlIiwiZmllbGRJbmRleCIsInBvcCIsIm1vdmUiLCJzdWNjZXNzb3IiLCJhY2Nlc3NpYmxlIiwiY3JlYXRlRW52aXJvbm1lbnQiLCJmaWxsIiwiY2FsY3VsYXRlUmVxdWlyZWRBbW91bnQiLCJwcm9qZWN0IiwicHJvamVjdHNCeVN0YXJ0WWVhciIsImFtb3VudCIsInRvdGFsQW1vdW50IiwicHJvamVjdHNTYW1lWWVhciIsInN0YXJ0WWVhciIsIm90aGVyUHJvamVjdCIsImNyZWF0ZUdyb3VwcyIsInJlcXVpcmVkQW1vdW50Iiwibm9JbnRlcmVzdFJlZmVyZW5jZSIsImxpcXVpZGl0eSIsImRlc2NyaXB0aW9uIiwiZnJvbSIsInBlcmNlbnRhZ2UiLCJzZXBhcmF0b3IiLCJ0byIsImdyb3VwRm9yVmFsdWUiLCJncm91cHMiLCJmaW5kIiwiZ3JvdXAiLCJtZWRpYW4iLCJ2YWx1ZXMiLCJoYWxmIiwiTWF0aCIsImZsb29yIiwiY2FsY3VsYXRlUHJvamVjdCIsIk5VTUJFUl9PRl9CVUNLRVRTIiwic2ltdWxhdGVkVmFsdWVzVGhpc1llYXIiLCJzaW11bGF0ZWRWYWx1ZXMiLCJzb3J0IiwiYSIsImIiLCJub0ludGVyZXN0UmVmZXJlbmNlTGluZSIsInZhbHVlc0J5R3JvdXAiLCJidWNrZXRTaXplIiwicm91bmQiLCJidWNrZXRzIiwiYnVja2V0IiwibWF4IiwiTUlOX1ZBTFVFIiwibWluIiwiTUFYX1ZBTFVFIiwic3ViQnVja2V0cyIsImoiLCJzdWJCdWNrZXQiLCJub25FbXB0eUdyb3VwcyIsImZvckVhY2giLCJvbmVTaXh0aCIsInR3b1RoaXJkIiwiY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50Iiwib3B0aW9ucyIsInByb2plY3RzVG9DYXNoRmxvd3MiLCJudW1ZZWFycyIsImNhc2hGbG93cyIsInllYXIiLCJwcm9qZWN0c0J5VGhpc1llYXIiLCJjYXNoRmxvdyIsInJlZHVjZSIsImNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lIiwiaW52ZXN0bWVudEFtb3VudCIsImludmVzdG1lbnRBbW91bnRMZWZ0IiwidG9BYnNvbHV0ZUluZGljZXMiLCJpbmRpY2VzIiwiY3VycmVudFBvcnRmb2xpb1ZhbHVlIiwicHJldmlvdXNZZWFySW5kZXgiLCJyZWxhdGl2ZVllYXIiLCJjdXJyZW50WWVhckluZGV4IiwiY2FzaEZsb3dTdGFydE9mWWVhciIsInBlcmZvcm1hbmNlIiwic2ltdWxhdGVPdXRjb21lcyIsIm51bVJ1bnMiLCJ2b2xhdGlsaXR5IiwicmFuZG9tIiwicnVuIiwicmFuZG9tUGVyZm9ybWFuY2UiLCJub3JtYWwiLCJwcm9qZWN0c1RvU2ltdWxhdGUiLCJwcm9qZWN0cyIsInZhbHVlc1BlcldvcmtlciIsInNsaWNlIiwiYXJyIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19icm93c2VyX3dvcmtlcl9zbGF2ZV9fIiwib25tZXNzYWdlIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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QUhHLEVBSUhzQyxTQUFTcEIsUUFBUW9CLE9BSmQsRUFLSGxCLGtCQUxHLEVBTUhuRCx3Q0FORyxFQU9IMkIsaUJBQWlCeUMsaUJBQWlCaEIsU0FBakIsRUFBNEJILFFBQVFTLGdCQUFwQyxFQUFzRFQsT0FBdEQsQ0FQZCxFQUFQO0FBU0g7OztXQXNDRHpCOzs7O1dBNUlBd0I7OztBSHRIQSxRQUFNMUosUUFBUSxJQUFJMEwsb0RBQUEsNkJBQUosQ0FBdUJwSCx3QkFBdkIsQ0FBZDtBQUNBcUgsZ0JBQVk7QUFDUjNMLGNBQU1sQyxTQUFOLENBQWdCckQsS0FBaEIsQ0FBc0J1RixLQUF0QixFQUE2QjRMLFNBQTdCO0FBQ0gsS0FGRCIsImZpbGUiOiJ3b3JrZXItc2xhdmUucGFyYWxsZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9yeSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb3J5IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTlmY2JlZGE4MTUzYzY1NmM3NWUiLCIvKiFcbiAqIFJhbmRvbS5qcyB2ZXJzaW9uIDAuMi42XG4gKiBjdXJsIGh0dHA6Ly9zaW1qcy5jb20vX2Rvd25sb2Fkcy9yYW5kb20tMC4yNi1kZWJ1Zy5qc1xuICovXG5cbiAvKiogUmFuZG9tLmpzIGxpYnJhcnkuXG4gKlxuICogVGhlIGNvZGUgaXMgbGljZW5zZWQgYXMgTEdQTC5cbiovXG5cbi8qXG4gICBBIEMtcHJvZ3JhbSBmb3IgTVQxOTkzNywgd2l0aCBpbml0aWFsaXphdGlvbiBpbXByb3ZlZCAyMDAyLzEvMjYuXG4gICBDb2RlZCBieSBUYWt1amkgTmlzaGltdXJhIGFuZCBNYWtvdG8gTWF0c3Vtb3RvLlxuXG4gICBCZWZvcmUgdXNpbmcsIGluaXRpYWxpemUgdGhlIHN0YXRlIGJ5IHVzaW5nIGluaXRfZ2VucmFuZChzZWVkKVxuICAgb3IgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkuXG5cbiAgIENvcHlyaWdodCAoQykgMTk5NyAtIDIwMDIsIE1ha290byBNYXRzdW1vdG8gYW5kIFRha3VqaSBOaXNoaW11cmEsXG4gICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG4gICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uc1xuICAgYXJlIG1ldDpcblxuICAgICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG5cbiAgICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuICAgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG4gICAgIDMuIFRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBub3QgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGVcbiAgICAgICAgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuXG4gICAgICAgIHBlcm1pc3Npb24uXG5cbiAgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAgIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAgIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICAgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SXG4gICBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcbiAgIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTyxcbiAgIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUlxuICAgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxuICAgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcbiAgIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG5cblxuICAgQW55IGZlZWRiYWNrIGlzIHZlcnkgd2VsY29tZS5cbiAgIGh0dHA6Ly93d3cubWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAvfm0tbWF0L01UL2VtdC5odG1sXG4gICBlbWFpbDogbS1tYXQgQCBtYXRoLnNjaS5oaXJvc2hpbWEtdS5hYy5qcCAocmVtb3ZlIHNwYWNlKVxuICovXG5cbnZhciBSYW5kb20gPSBmdW5jdGlvbihzZWVkKSB7XG5cdHNlZWQgPSAoc2VlZCA9PT0gdW5kZWZpbmVkKSA/IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgOiBzZWVkO1xuXHRpZiAodHlwZW9mKHNlZWQpICE9PSAnbnVtYmVyJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0fHwgTWF0aC5jZWlsKHNlZWQpICE9IE1hdGguZmxvb3Ioc2VlZCkpIHsgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcInNlZWQgdmFsdWUgbXVzdCBiZSBhbiBpbnRlZ2VyXCIpOyAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cblx0LyogUGVyaW9kIHBhcmFtZXRlcnMgKi9cblx0dGhpcy5OID0gNjI0O1xuXHR0aGlzLk0gPSAzOTc7XG5cdHRoaXMuTUFUUklYX0EgPSAweDk5MDhiMGRmOyAgIC8qIGNvbnN0YW50IHZlY3RvciBhICovXG5cdHRoaXMuVVBQRVJfTUFTSyA9IDB4ODAwMDAwMDA7IC8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cblx0dGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsgLyogbGVhc3Qgc2lnbmlmaWNhbnQgciBiaXRzICovXG5cblx0dGhpcy5tdCA9IG5ldyBBcnJheSh0aGlzLk4pOyAvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgKi9cblx0dGhpcy5tdGk9dGhpcy5OKzE7IC8qIG10aT09TisxIG1lYW5zIG10W05dIGlzIG5vdCBpbml0aWFsaXplZCAqL1xuXG5cdC8vdGhpcy5pbml0X2dlbnJhbmQoc2VlZCk7XG5cdHRoaXMuaW5pdF9ieV9hcnJheShbc2VlZF0sIDEpO1xufTtcblxuLyogaW5pdGlhbGl6ZXMgbXRbTl0gd2l0aCBhIHNlZWQgKi9cblJhbmRvbS5wcm90b3R5cGUuaW5pdF9nZW5yYW5kID0gZnVuY3Rpb24ocykge1xuXHR0aGlzLm10WzBdID0gcyA+Pj4gMDtcblx0Zm9yICh0aGlzLm10aT0xOyB0aGlzLm10aTx0aGlzLk47IHRoaXMubXRpKyspIHtcblx0XHR2YXIgcyA9IHRoaXMubXRbdGhpcy5tdGktMV0gXiAodGhpcy5tdFt0aGlzLm10aS0xXSA+Pj4gMzApO1xuXHRcdHRoaXMubXRbdGhpcy5tdGldID0gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE4MTI0MzMyNTMpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxODEyNDMzMjUzKVxuXHRcdCsgdGhpcy5tdGk7XG5cdFx0LyogU2VlIEtudXRoIFRBT0NQIFZvbDIuIDNyZCBFZC4gUC4xMDYgZm9yIG11bHRpcGxpZXIuICovXG5cdFx0LyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXG5cdFx0Lyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFx0LyogMjAwMi8wMS8wOSBtb2RpZmllZCBieSBNYWtvdG8gTWF0c3Vtb3RvICAgICAgICAgICAgICovXG5cdFx0dGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xuXHRcdC8qIGZvciA+MzIgYml0IG1hY2hpbmVzICovXG5cdH1cbn07XG5cbi8qIGluaXRpYWxpemUgYnkgYW4gYXJyYXkgd2l0aCBhcnJheS1sZW5ndGggKi9cbi8qIGluaXRfa2V5IGlzIHRoZSBhcnJheSBmb3IgaW5pdGlhbGl6aW5nIGtleXMgKi9cbi8qIGtleV9sZW5ndGggaXMgaXRzIGxlbmd0aCAqL1xuLyogc2xpZ2h0IGNoYW5nZSBmb3IgQysrLCAyMDA0LzIvMjYgKi9cblJhbmRvbS5wcm90b3R5cGUuaW5pdF9ieV9hcnJheSA9IGZ1bmN0aW9uKGluaXRfa2V5LCBrZXlfbGVuZ3RoKSB7XG5cdHZhciBpLCBqLCBrO1xuXHR0aGlzLmluaXRfZ2VucmFuZCgxOTY1MDIxOCk7XG5cdGk9MTsgaj0wO1xuXHRrID0gKHRoaXMuTj5rZXlfbGVuZ3RoID8gdGhpcy5OIDoga2V5X2xlbmd0aCk7XG5cdGZvciAoOyBrOyBrLS0pIHtcblx0XHR2YXIgcyA9IHRoaXMubXRbaS0xXSBeICh0aGlzLm10W2ktMV0gPj4+IDMwKTtcblx0XHR0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXG5cdFx0KyBpbml0X2tleVtqXSArIGo7IC8qIG5vbiBsaW5lYXIgKi9cblx0XHR0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cblx0XHRpKys7IGorKztcblx0XHRpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XG5cdFx0aWYgKGo+PWtleV9sZW5ndGgpIGo9MDtcblx0fVxuXHRmb3IgKGs9dGhpcy5OLTE7IGs7IGstLSkge1xuXHRcdHZhciBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApO1xuXHRcdHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXG5cdFx0LSBpOyAvKiBub24gbGluZWFyICovXG5cdFx0dGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG5cdFx0aSsrO1xuXHRcdGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cblx0fVxuXG5cdHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwweGZmZmZmZmZmXS1pbnRlcnZhbCAqL1xuUmFuZG9tLnByb3RvdHlwZS5nZW5yYW5kX2ludDMyID0gZnVuY3Rpb24oKSB7XG5cdHZhciB5O1xuXHR2YXIgbWFnMDEgPSBuZXcgQXJyYXkoMHgwLCB0aGlzLk1BVFJJWF9BKTtcblx0LyogbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMSAqL1xuXG5cdGlmICh0aGlzLm10aSA+PSB0aGlzLk4pIHsgLyogZ2VuZXJhdGUgTiB3b3JkcyBhdCBvbmUgdGltZSAqL1xuXHRcdHZhciBraztcblxuXHRcdGlmICh0aGlzLm10aSA9PSB0aGlzLk4rMSkgICAvKiBpZiBpbml0X2dlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLCAqL1xuXHRcdFx0dGhpcy5pbml0X2dlbnJhbmQoNTQ4OSk7IC8qIGEgZGVmYXVsdCBpbml0aWFsIHNlZWQgaXMgdXNlZCAqL1xuXG5cdFx0Zm9yIChraz0wO2trPHRoaXMuTi10aGlzLk07a2srKykge1xuXHRcdFx0eSA9ICh0aGlzLm10W2trXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10W2trKzFdJnRoaXMuTE9XRVJfTUFTSyk7XG5cdFx0XHR0aGlzLm10W2trXSA9IHRoaXMubXRba2srdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXHRcdH1cblx0XHRmb3IgKDtrazx0aGlzLk4tMTtraysrKSB7XG5cdFx0XHR5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcblx0XHRcdHRoaXMubXRba2tdID0gdGhpcy5tdFtraysodGhpcy5NLXRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cdFx0fVxuXHRcdHkgPSAodGhpcy5tdFt0aGlzLk4tMV0mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFswXSZ0aGlzLkxPV0VSX01BU0spO1xuXHRcdHRoaXMubXRbdGhpcy5OLTFdID0gdGhpcy5tdFt0aGlzLk0tMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblxuXHRcdHRoaXMubXRpID0gMDtcblx0fVxuXG5cdHkgPSB0aGlzLm10W3RoaXMubXRpKytdO1xuXG5cdC8qIFRlbXBlcmluZyAqL1xuXHR5IF49ICh5ID4+PiAxMSk7XG5cdHkgXj0gKHkgPDwgNykgJiAweDlkMmM1NjgwO1xuXHR5IF49ICh5IDw8IDE1KSAmIDB4ZWZjNjAwMDA7XG5cdHkgXj0gKHkgPj4+IDE4KTtcblxuXHRyZXR1cm4geSA+Pj4gMDtcbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMHg3ZmZmZmZmZl0taW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9pbnQzMSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpPj4+MSk7XG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDFdLXJlYWwtaW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9yZWFsMSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk1LjApO1xuXHQvKiBkaXZpZGVkIGJ5IDJeMzItMSAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxKS1yZWFsLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5weXRob25Db21wYXRpYmlsaXR5KSB7XG5cdFx0aWYgKHRoaXMuc2tpcCkge1xuXHRcdFx0dGhpcy5nZW5yYW5kX2ludDMyKCk7XG5cdFx0fVxuXHRcdHRoaXMuc2tpcCA9IHRydWU7XG5cdH1cblx0cmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5Ni4wKTtcblx0LyogZGl2aWRlZCBieSAyXjMyICovXG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uICgwLDEpLXJlYWwtaW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9yZWFsMyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpICsgMC41KSooMS4wLzQyOTQ5NjcyOTYuMCk7XG5cdC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxKSB3aXRoIDUzLWJpdCByZXNvbHV0aW9uKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9yZXM1MyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYT10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjUsIGI9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj42O1xuXHRyZXR1cm4oYSo2NzEwODg2NC4wK2IpKigxLjAvOTAwNzE5OTI1NDc0MDk5Mi4wKTtcbn07XG5cbi8qIFRoZXNlIHJlYWwgdmVyc2lvbnMgYXJlIGR1ZSB0byBJc2FrdSBXYWRhLCAyMDAyLzAxLzA5IGFkZGVkICovXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuUmFuZG9tLnByb3RvdHlwZS5MT0c0ID0gTWF0aC5sb2coNC4wKTtcblJhbmRvbS5wcm90b3R5cGUuU0dfTUFHSUNDT05TVCA9IDEuMCArIE1hdGgubG9nKDQuNSk7XG5cblJhbmRvbS5wcm90b3R5cGUuZXhwb25lbnRpYWwgPSBmdW5jdGlvbiAobGFtYmRhKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwiZXhwb25lbnRpYWwoKSBtdXN0IFwiICAgICAvLyBBUkdfQ0hFQ0tcblx0XHRcdFx0KyBcIiBiZSBjYWxsZWQgd2l0aCAnbGFtYmRhJyBwYXJhbWV0ZXJcIik7IC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblx0dmFyIHIgPSB0aGlzLnJhbmRvbSgpO1xuXHRyZXR1cm4gLU1hdGgubG9nKHIpIC8gbGFtYmRhO1xufTtcblxuUmFuZG9tLnByb3RvdHlwZS5nYW1tYSA9IGZ1bmN0aW9uIChhbHBoYSwgYmV0YSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcImdhbW1hKCkgbXVzdCBiZSBjYWxsZWRcIiAgLy8gQVJHX0NIRUNLXG5cdFx0XHRcdCsgXCIgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzXCIpOyAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdC8qIEJhc2VkIG9uIFB5dGhvbiAyLjYgc291cmNlIGNvZGUgb2YgcmFuZG9tLnB5LlxuXHQgKi9cblxuXHRpZiAoYWxwaGEgPiAxLjApIHtcblx0XHR2YXIgYWludiA9IE1hdGguc3FydCgyLjAgKiBhbHBoYSAtIDEuMCk7XG5cdFx0dmFyIGJiYiA9IGFscGhhIC0gdGhpcy5MT0c0O1xuXHRcdHZhciBjY2MgPSBhbHBoYSArIGFpbnY7XG5cblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdFx0dmFyIHUxID0gdGhpcy5yYW5kb20oKTtcblx0XHRcdGlmICgodTEgPCAxZS03KSB8fCAodSA+IDAuOTk5OTk5OSkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdTIgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuXHRcdFx0dmFyIHYgPSBNYXRoLmxvZyh1MSAvICgxLjAgLSB1MSkpIC8gYWludjtcblx0XHRcdHZhciB4ID0gYWxwaGEgKiBNYXRoLmV4cCh2KTtcblx0XHRcdHZhciB6ID0gdTEgKiB1MSAqIHUyO1xuXHRcdFx0dmFyIHIgPSBiYmIgKyBjY2MgKiB2IC0geDtcblx0XHRcdGlmICgociArIHRoaXMuU0dfTUFHSUNDT05TVCAtIDQuNSAqIHogPj0gMC4wKSB8fCAociA+PSBNYXRoLmxvZyh6KSkpIHtcblx0XHRcdFx0cmV0dXJuIHggKiBiZXRhO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmIChhbHBoYSA9PSAxLjApIHtcblx0XHR2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0d2hpbGUgKHUgPD0gMWUtNykge1xuXHRcdFx0dSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0fVxuXHRcdHJldHVybiAtIE1hdGgubG9nKHUpICogYmV0YTtcblx0fSBlbHNlIHtcblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdFx0dmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdFx0dmFyIGIgPSAoTWF0aC5FICsgYWxwaGEpIC8gTWF0aC5FO1xuXHRcdFx0dmFyIHAgPSBiICogdTtcblx0XHRcdGlmIChwIDw9IDEuMCkge1xuXHRcdFx0XHR2YXIgeCA9IE1hdGgucG93KHAsIDEuMCAvIGFscGhhKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB4ID0gLSBNYXRoLmxvZygoYiAtIHApIC8gYWxwaGEpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHUxID0gdGhpcy5yYW5kb20oKTtcblx0XHRcdGlmIChwID4gMS4wKSB7XG5cdFx0XHRcdGlmICh1MSA8PSBNYXRoLnBvdyh4LCAoYWxwaGEgLSAxLjApKSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHUxIDw9IE1hdGguZXhwKC14KSkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHggKiBiZXRhO1xuXHR9XG5cbn07XG5cblJhbmRvbS5wcm90b3R5cGUubm9ybWFsID0gZnVuY3Rpb24gKG11LCBzaWdtYSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJub3JtYWwoKSBtdXN0IGJlIGNhbGxlZFwiICAvLyBBUkdfQ0hFQ0tcblx0XHRcdFx0KyBcIiB3aXRoIG11IGFuZCBzaWdtYSBwYXJhbWV0ZXJzXCIpOyAgICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdHZhciB6ID0gdGhpcy5sYXN0Tm9ybWFsO1xuXHR0aGlzLmxhc3ROb3JtYWwgPSBOYU47XG5cdGlmICgheikge1xuXHRcdHZhciBhID0gdGhpcy5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuXHRcdHZhciBiID0gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZygxLjAgLSB0aGlzLnJhbmRvbSgpKSk7XG5cdFx0eiA9IE1hdGguY29zKGEpICogYjtcblx0XHR0aGlzLmxhc3ROb3JtYWwgPSBNYXRoLnNpbihhKSAqIGI7XG5cdH1cblx0cmV0dXJuIG11ICsgeiAqIHNpZ21hO1xufTtcblxuUmFuZG9tLnByb3RvdHlwZS5wYXJldG8gPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJwYXJldG8oKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdFx0XHQrIFwiIHdpdGggYWxwaGEgcGFyYW1ldGVyXCIpOyAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdHZhciB1ID0gdGhpcy5yYW5kb20oKTtcblx0cmV0dXJuIDEuMCAvIE1hdGgucG93KCgxIC0gdSksIDEuMCAvIGFscGhhKTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUudHJpYW5ndWxhciA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIsIG1vZGUpIHtcblx0Ly8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Ucmlhbmd1bGFyX2Rpc3RyaWJ1dGlvblxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAzKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcInRyaWFuZ3VsYXIoKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdCsgXCIgd2l0aCBsb3dlciwgdXBwZXIgYW5kIG1vZGUgcGFyYW1ldGVyc1wiKTsgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHR2YXIgYyA9IChtb2RlIC0gbG93ZXIpIC8gKHVwcGVyIC0gbG93ZXIpO1xuXHR2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG5cblx0aWYgKHUgPD0gYykge1xuXHRcdHJldHVybiBsb3dlciArIE1hdGguc3FydCh1ICogKHVwcGVyIC0gbG93ZXIpICogKG1vZGUgLSBsb3dlcikpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB1cHBlciAtIE1hdGguc3FydCgoMSAtIHUpICogKHVwcGVyIC0gbG93ZXIpICogKHVwcGVyIC0gbW9kZSkpO1xuXHR9XG59O1xuXG5SYW5kb20ucHJvdG90eXBlLnVuaWZvcm0gPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwidW5pZm9ybSgpIG11c3QgYmUgY2FsbGVkXCIgLy8gQVJHX0NIRUNLXG5cdFx0KyBcIiB3aXRoIGxvd2VyIGFuZCB1cHBlciBwYXJhbWV0ZXJzXCIpOyAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRyZXR1cm4gbG93ZXIgKyB0aGlzLnJhbmRvbSgpICogKHVwcGVyIC0gbG93ZXIpO1xufTtcblxuUmFuZG9tLnByb3RvdHlwZS53ZWlidWxsID0gZnVuY3Rpb24gKGFscGhhLCBiZXRhKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwid2VpYnVsbCgpIG11c3QgYmUgY2FsbGVkXCIgLy8gQVJHX0NIRUNLXG5cdFx0KyBcIiB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnNcIik7ICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdHZhciB1ID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcblx0cmV0dXJuIGFscGhhICogTWF0aC5wb3coLU1hdGgubG9nKHUpLCAxLjAgLyBiZXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zaW1qcy1yYW5kb20vc2ltanMtcmFuZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb3J5IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vcnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTUwYTJmODI4NDJmODM4NTc0ZmRcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi93ZWJwYWNrOi93ZWJwYWNrL2Jvb3RzdHJhcCA5NTBhMmY4Mjg0MmY4Mzg1NzRmZCIsIi8qKlxuICogQ3JlYXRlcyBhbiBpdGVyYXRvciB0aGF0IGl0ZXJhdGVzIG92ZXIgdGhlIGdpdmVuIGFycmF5XG4gKiBAcGFyYW0gZGF0YSB0aGUgYXJyYXlcbiAqIEBwYXJhbSBUIGVsZW1lbnQgdHlwZVxuICogQHJldHVybnMgdGhlIGl0ZXJhdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0l0ZXJhdG9yPFQ+KGRhdGE6IFRbXSk6IEl0ZXJhdG9yPFQ+IHtcbiAgICByZXR1cm4gZGF0YVtTeW1ib2wuaXRlcmF0b3JdKCk7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGdpdmVuIGl0ZXJhdG9yIHRvIGFuIGFycmF5XG4gKiBAcGFyYW0gaXRlcmF0b3IgdGhlIGl0ZXJhdG9yIHRoYXQgaXMgdG8gYmUgY29udmVydGVkIGludG8gYW4gYXJyYXlcbiAqIEBwYXJhbSBUIGVsZW1lbnQgdHlwZVxuICogQHJldHVybnMge1RbXX0gdGhlIGFycmF5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBnaXZlbiBpdGVyYXRvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheTxUPihpdGVyYXRvcjogSXRlcmF0b3I8VD4pOiBUW10ge1xuICAgIGNvbnN0IHJlc3VsdDogVFtdID0gW107XG4gICAgbGV0IGN1cnJlbnQ6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnQgKi9cbiAgICB3aGlsZSAoIShjdXJyZW50ID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnQudmFsdWUgYXMgVCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogRmxhdHRlbnMgdGhlIGdpdmVuIGFycmF5LlxuICogQHBhcmFtIGRlZXBBcnJheSB0aGUgYXJyYXkgdG8gZmxhdHRlblxuICogQHBhcmFtIHR5cGUgb2YgdGhlIGFycmF5IGVsZW1lbnRzXG4gKiBAcmV0dXJucyByZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSB2YWx1ZXMgY29udGFpbmVkIGluIHRoZSBzdWIgYXJyYXlzIG9mIGRlZXAgYXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuQXJyYXk8VD4oZGVlcEFycmF5OiBUW11bXSk6IFRbXSB7XG4gICAgaWYgKGRlZXBBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IFtoZWFkLCAuLi50YWlsXSA9IGRlZXBBcnJheTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShoZWFkLCB0YWlsKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vdXRpbC9hcnJheXMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3V0aWwvYXJyYXlzLnRzIiwiLyoqXG4gKiBAbW9kdWxlIHBhcmFsbGVsXG4gKi9cbi8qKiAqL1xuXG5pbXBvcnQge0lGdW5jdGlvbklkfSBmcm9tIFwiLi9mdW5jdGlvbi1pZFwiO1xuXG4vKipcbiAqIFNlcmlhbGl6ZWQgcmVwcmVzZW50YXRpb24gb2YgYSBmdW5jdGlvbiBjYWxsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGwge1xuICAgIC8qKlxuICAgICAqIFRoZSBpZCBvZiB0aGUgZnVuY3Rpb24gdG8gaW52b2tlICh7QGxpbmsgSUZ1bmN0aW9uRGVmaW5pdGlvbi5pZH0pXG4gICAgICovXG4gICAgZnVuY3Rpb25JZDogSUZ1bmN0aW9uSWQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGFyYW1ldGVycyB0byBwYXNzIHRvIHRoZSBmdW5jdGlvbiB3aGVuIGNhbGxlZFxuICAgICAqL1xuICAgIHJlYWRvbmx5IHBhcmFtZXRlcnM6IGFueVtdO1xuXG4gICAgLyoqXG4gICAgICogTWFya2VyIHRoYXQgaW5kaWNhdGVzIHRoYXQgdGhpcyBvYmplY3QgaXMgYSBzZXJpYWxpemVkIGZ1bmN0aW9uIGNhbGxcbiAgICAgKi9cbiAgICByZWFkb25seSBfX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBvYmplY3QgaXMgYSBzZXJpYWxpemVkIGZ1bmN0aW9uIGNhbGxcbiAqIEBwYXJhbSBwb3RlbnRpYWxGdW5jIGEgcG90ZW50aWFsbHkgc2VyaWFsaXplZCBmdW5jdGlvbiBjYWxsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpdCBpcyBhIHNlcmlhbGl6ZWQgZnVuY3Rpb24gY2FsbCwgZmFsc2Ugb3RoZXJ3aXNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NlcmlhbGl6ZWRGdW5jdGlvbkNhbGwocG90ZW50aWFsRnVuYzogYW55KTogcG90ZW50aWFsRnVuYyBpcyBJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCB7XG4gICAgcmV0dXJuICEhcG90ZW50aWFsRnVuYyAmJiBwb3RlbnRpYWxGdW5jLl9fX19fX3NlcmlhbGl6ZWRGdW5jdGlvbkNhbGwgPT09IHRydWU7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL2Z1bmN0aW9uL3NlcmlhbGl6ZWQtZnVuY3Rpb24tY2FsbC50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vZnVuY3Rpb24vc2VyaWFsaXplZC1mdW5jdGlvbi1jYWxsLnRzIiwiaW1wb3J0IHtJVGFza0RlZmluaXRpb259IGZyb20gXCIuLi90YXNrL3Rhc2stZGVmaW5pdGlvblwiO1xuaW1wb3J0IHtJRnVuY3Rpb25EZWZpbml0aW9ufSBmcm9tIFwiLi4vZnVuY3Rpb24vZnVuY3Rpb24tZGVmaW50aW9uXCI7XG5pbXBvcnQge0lGdW5jdGlvbklkfSBmcm9tIFwiLi4vZnVuY3Rpb24vZnVuY3Rpb24taWRcIjtcblxuLyoqXG4gKiBNZXNzYWdlIHR5cGVzXG4gKi9cbmV4cG9ydCBjb25zdCBlbnVtIFdvcmtlck1lc3NhZ2VUeXBlIHtcbiAgICAvKipcbiAgICAgKiBTZW50IGZyb20gdGhlIHdvcmtlciBmYWNhZGUgdG8gdGhlIHdvcmtlciBzbGF2ZSB0byBpbml0aWFsaXplIHRoZSBzbGF2ZS5cbiAgICAgKi9cbiAgICBJbml0aWFsaXplV29ya2VyLFxuXG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgZmFjYWRlIHRvIHRoZSB3b3JrZXIgc2xhdmUgdG8gc2NoZWR1bGUgYSBuZXcgdGFzayBvbiB0aGUgc2xhdmUuXG4gICAgICovXG4gICAgU2NoZWR1bGVUYXNrLFxuXG4gICAgLyoqXG4gICAgICogU2VuZCBmcm9tIHRoZSB3b3JrZXIgc2xhdmUgdG8gdGhlIHdvcmtlciB0aHJlYWQgdG8gcmVxdWVzdCB0aGUgZGVmaW5pdGlvbiBvZiBhIGZ1bmN0aW9uIG5lZWRlZCB0byBleGVjdXRlIGEgc2NoZWR1bGVkIHRhc2tcbiAgICAgKi9cbiAgICBGdW5jdGlvblJlcXVlc3QsXG5cbiAgICAvKipcbiAgICAgKiBTZW5kIGZyb20gdGhlIHdvcmtlciB0aHJlYWQgdG8gdGhlIHdvcmtlciBzbGF2ZSBhcyByZXNwb25zZSB0byBhIHtAbGluayBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvblJlcXVlc3R9LiBJbmNsdWRlc1xuICAgICAqIHRoZSBkZWZpbml0aW9ucyBvZiBhbGwgcmVxdWVzdGVkIGZ1bmN0aW9uc1xuICAgICAqL1xuICAgIEZ1bmN0aW9uUmVzcG9uc2UsXG5cbiAgICAvKipcbiAgICAgKiBTZW50IGZyb20gdGhlIHdvcmtlciBzbGF2ZSB0byB0aGUgd29ya2VyIHRocmVhZCBjb250YWluaW5nIHRoZSBjb21wdXRlZCByZXN1bHRcbiAgICAgKi9cbiAgICBXb3JrZXJSZXN1bHQsXG5cbiAgICAvKipcbiAgICAgKiBTZW50IGZyb20gdGhlIHdvcmtlciBzbGF2ZSB0byB0aGUgd29ya2VyIHRocmVhZCBmb3IgdGhlIGNhc2UgYW4gZXJyb3Igb2NjdXJyZWQgZHVyaW5nIHRoZSBldmFsdWF0aW9uIG9mIHRoZSBzY2hlZHVsZWQgdGFzay5cbiAgICAgKi9cbiAgICBGdW5jdGlvbkV4ZWN1dGlvbkVycm9yLFxuXG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgdGhyZWFkIHRvIHRoZSB3b3JrZXIgc2xhdmUgdG8gcmVxdWVzdCB0aGUgc2xhdmUgdG8gdGVybWluYXRlLlxuICAgICAqL1xuICAgIFN0b3Bcbn1cblxuLyoqXG4gKiBNZXNzYWdlIHRoYXQgaXMgZXhjaGFuZ2VkIGJldHdlZW4gYSB3b3JrZXIgc2xhdmUgYW5kIHRoZSB3b3JrZXIgdGhyZWFkLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdHlwZSBvZiB0aGUgbWVzc2FnZS5cbiAgICAgKi9cbiAgICB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZTtcbn1cblxuLyoqXG4gKiBTZW50IHRvIGluaXRpYWxpemUgdGhlIHdvcmtlciBzbGF2ZSBhbmQgYXNzaWducyB0aGUgZ2l2ZW4gdW5pcXVlIGlkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUluaXRpYWxpemVXb3JrZXJNZXNzYWdlIGV4dGVuZHMgSVdvcmtlck1lc3NhZ2Uge1xuICAgIC8qKlxuICAgICAqIFVuaXF1ZSBpZCBvZiB0aGUgd29ya2VyIChmYWNhZGUgLyBzbGF2ZSlcbiAgICAgKi9cbiAgICB3b3JrZXJJZDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFNjaGVkdWxlcyB0aGUgZ2l2ZW4gdGFzayBvbiB0aGUgd29ya2VyIHNsYXZlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTY2hlZHVsZVRhc2tNZXNzYWdlIGV4dGVuZHMgSVdvcmtlck1lc3NhZ2Uge1xuICAgIC8qKlxuICAgICAqIFRhc2sgdG8gZXhlY3V0ZSBvbiB0aGUgd29ya2VyIHNsYXZlXG4gICAgICovXG4gICAgdGFzazogSVRhc2tEZWZpbml0aW9uO1xufVxuXG4vKipcbiAqIFNlbnQgYnkgdGhlIHdvcmtlciBzbGF2ZSB0byByZXF1ZXN0IHRoZSBmdW5jdGlvbiBkZWZpbml0aW9ucyB3aXRoIHRoZSBnaXZlbiBpZHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUZ1bmN0aW9uUmVxdWVzdCBleHRlbmRzIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgaWRzIG9mIHRoZSByZXF1ZXN0ZWQgZnVuY3Rpb25zXG4gICAgICovXG4gICAgZnVuY3Rpb25JZHM6IElGdW5jdGlvbklkW107XG59XG5cbi8qKlxuICogUmVzcG9uc2UgdG8gYSB7QGxpbmsgSUZ1bmN0aW9uUmVxdWVzdH0uIENvbnRhaW5zIHRoZSBkZWZpbml0aW9ucyBmb3IgYWxsIHJlcXVlc3RlZCBmdW5jdGlvbnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUZ1bmN0aW9uUmVzcG9uc2UgZXh0ZW5kcyBJV29ya2VyTWVzc2FnZSB7XG4gICAgLyoqXG4gICAgICogVGhlIGRlZmluaXRpb24gb2YgdGhlIHJlcXVlc3RlZCBmdW5jdGlvbnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbnM6IElGdW5jdGlvbkRlZmluaXRpb25bXTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IGNvbnRhaW5pbmcgdGhlIGlkcyBvZiB0aGUgZnVuY3Rpb25zIHRoYXQgY291bGQgbm90IGJlIHJlc29sdmVkXG4gICAgICovXG4gICAgbWlzc2luZ0Z1bmN0aW9uczogSUZ1bmN0aW9uSWRbXTtcbn1cblxuLyoqXG4gKiBTZW50IGZyb20gdGhlIHdvcmtlciBzbGF2ZSB0byB0aGUgd29ya2VyIHRocmVhZCB0byByZXBvcnQgdGhlIGNvbXB1dGVkIHJlc3VsdC5cbiAqIFRoZXJlYWZ0ZXIsIHRoZSB3b3JrZXIgc2xhdmUgaXMgcmVhZHkgdG8gYWNjZXB0IGZ1cnRoZXIgdGFza3MuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVdvcmtlclJlc3VsdE1lc3NhZ2UgZXh0ZW5kcyBJV29ya2VyTWVzc2FnZSB7XG4gICAgLyoqXG4gICAgICogVGhlIGNvbXB1dGVkIHJlc3VsdCBmb3IgdGhlIHtAbGluayBJU2NoZWR1bGVUYXNrTWVzc2FnZX1cbiAgICAgKi9cbiAgICByZXN1bHQ6IGFueTtcbn1cblxuLyoqXG4gKiBTZW50IGZyb20gdGhlIHdvcmtlciB0byByZXBvcnQgYW4gZXJyb3IgZHVyaW5nIHRoZSBleGVjdXRpb24gb2YgdGhlIGZ1bmN0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIGV4dGVuZHMgSVdvcmtlck1lc3NhZ2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBvY2N1cnJlZCBlcnJvci4gTm90IGFuIGluc3RhbmNlIG9mIEVycm9yLiBFcnJvciBpcyBub3QgY2xvbmVhYmxlLlxuICAgICAqL1xuICAgIGVycm9yOiBhbnk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBpbml0aWFsaXplIHdvcmtlciBtZXNzYWdlXG4gKiBAcGFyYW0gaWQgdGhlIHVuaXF1ZSBpZCBvZiB0aGUgd29ya2VyXG4gKiBAcmV0dXJucyB0aGUgaW5pdGlhbGl6ZSB3b3JrZXIgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVdvcmtlck1lc3NhZ2UoaWQ6IG51bWJlcik6IElJbml0aWFsaXplV29ya2VyTWVzc2FnZSB7XG4gICAgcmV0dXJuIHsgdHlwZTogV29ya2VyTWVzc2FnZVR5cGUuSW5pdGlhbGl6ZVdvcmtlciwgd29ya2VySWQ6IGlkIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1lc3NhZ2UgdG8gc2NoZWR1bGUgdGhlIGdpdmVuIHRhc2sgb24gYSB3b3JrZXIgc2xhdmVcbiAqIEBwYXJhbSB0YXNrIHRoZSB0YXNrIHRvIHNjaGVkdWxlXG4gKiBAcmV0dXJucyB0aGUgc2NoZWR1bGUgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVUYXNrTWVzc2FnZSh0YXNrOiBJVGFza0RlZmluaXRpb24pOiBJU2NoZWR1bGVUYXNrTWVzc2FnZSB7XG4gICAgcmV0dXJuIHsgdGFzaywgdHlwZTogV29ya2VyTWVzc2FnZVR5cGUuU2NoZWR1bGVUYXNrfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIHtAbGluayBJRnVuY3Rpb25SZXF1ZXN0fSBtZXNzYWdlIHRoYXQgcmVxdWVzdHMgdGhlIGdpdmVuIGZ1bmN0aW9uIGlkcyBmcm9tIHRoZSB3b3JrZXIgdGhyZWFkXG4gKiBAcGFyYW0gZnVuY3Rpb25JZCB0aGUgaWQgb2YgYSBmdW5jdGlvbiB0byByZXF1ZXN0XG4gKiBAcGFyYW0gb3RoZXJGdW5jdGlvbklkcyBhZGRpdGlvbmFsIGlkcyB0byByZXF1ZXN0IGZyb20gdGhlIHdvcmtlciBzbGF2ZVxuICogQHJldHVybnMgdGhlIGZ1bmN0aW9uIHJlcXVlc3QgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdEZ1bmN0aW9uTWVzc2FnZShmdW5jdGlvbklkOiBJRnVuY3Rpb25JZCwgLi4ub3RoZXJGdW5jdGlvbklkczogSUZ1bmN0aW9uSWRbXSk6IElGdW5jdGlvblJlcXVlc3Qge1xuICAgIHJldHVybiB7IGZ1bmN0aW9uSWRzOiBbZnVuY3Rpb25JZCwgLi4ub3RoZXJGdW5jdGlvbklkc10sIHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLkZ1bmN0aW9uUmVxdWVzdCB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiByZXNwb25zZSBtZXNzYWdlIGNvbnRhaW5pbmcgdGhlIHBhc3NlZCBmdW5jdGlvbiBkZWZpbml0aW9uc1xuICogQHBhcmFtIGZ1bmN0aW9ucyB0aGUgZnVuY3Rpb24gZGVmaW5pdGlvbnMgdG8gcmVzcG9uZCB0byB0aGUgd29ya2VyIHNsYXZlXG4gKiBAcmV0dXJucyB0aGUgZnVuY3Rpb24gcmVzcG9uc2UgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25SZXNwb25zZU1lc3NhZ2UoZnVuY3Rpb25zOiBJRnVuY3Rpb25EZWZpbml0aW9uW10sIC4uLm1pc3NpbmdGdW5jdGlvbklkczogSUZ1bmN0aW9uSWRbXSk6IElGdW5jdGlvblJlc3BvbnNlIHtcbiAgICByZXR1cm4geyBmdW5jdGlvbnMsIG1pc3NpbmdGdW5jdGlvbnM6IG1pc3NpbmdGdW5jdGlvbklkcywgdHlwZTogV29ya2VyTWVzc2FnZVR5cGUuRnVuY3Rpb25SZXNwb25zZSB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB3b3JrZXIgcmVzdWx0IG1lc3NhZ2UgZm9yIHRoZSBnaXZlbiByZXN1bHRcbiAqIEBwYXJhbSByZXN1bHQgdGhlIGNvbXB1dGVkIHJlc3VsdCBmb3IgdGhlIHNjaGVkdWxlZCB0YXNrXG4gKiBAcmV0dXJucyB0aGUgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gd29ya2VyUmVzdWx0TWVzc2FnZShyZXN1bHQ6IGFueSk6IElXb3JrZXJSZXN1bHRNZXNzYWdlIHtcbiAgICByZXR1cm4geyByZXN1bHQsIHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLldvcmtlclJlc3VsdCB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBleGVjdXRpb24gZXJyb3IgbWVzc2FnZSBjb250YWluaW5nIHRoZSBnaXZlbiBlcnJvclxuICogQHBhcmFtIGVycm9yIHRoZSBlcnJvciBvYmplY3QgdGhyb3duIGJ5IHRoZSB0YXNrIGNvbXB1dGF0aW9uXG4gKiBAcmV0dXJucyB0aGUgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25FeGVjdXRpb25FcnJvcihlcnJvcjogRXJyb3IpOiBJRnVuY3Rpb25FeGVjdXRpb25FcnJvciB7XG4gICAgbGV0IGVycm9yT2JqZWN0OiB7W3Byb3A6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuICAgIGZvciAoY29uc3QgcHJvcCBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhlcnJvcikpIHtcbiAgICAgICAgZXJyb3JPYmplY3RbcHJvcF0gPSBKU09OLnN0cmluZ2lmeSgoZXJyb3IgYXMgYW55KVtwcm9wXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZXJyb3I6IGVycm9yT2JqZWN0LCB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvbkV4ZWN1dGlvbkVycm9yIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0b3AgbWVzc2FnZVxuICogQHJldHVybnMgdGhlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3BNZXNzYWdlKCk6IElXb3JrZXJNZXNzYWdlIHtcbiAgICByZXR1cm4geyB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZS5TdG9wIH07XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElTY2hlZHVsZVRhc2tNZXNzYWdlfSBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGFuIHtAbGluayBJU2NoZWR1bGVUYXNrTWVzc2FnZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2NoZWR1bGVUYXNrKG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJU2NoZWR1bGVUYXNrTWVzc2FnZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuU2NoZWR1bGVUYXNrO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGFuIHtAbGluayBJSW5pdGlhbGl6ZVdvcmtlck1lc3NhZ2V9IG1lc3NhZ2VcbiAqIEBwYXJhbSBtZXNzYWdlIHRoZSBtZXNzYWdlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSB7QGNvZGUgdHJ1ZX0gaWYgdGhlIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElJbml0aWFsaXplV29ya2VyTWVzc2FnZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5pdGlhbGl6ZU1lc3NhZ2UobWVzc2FnZTogSVdvcmtlck1lc3NhZ2UpOiBtZXNzYWdlIGlzIElJbml0aWFsaXplV29ya2VyTWVzc2FnZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuSW5pdGlhbGl6ZVdvcmtlcjtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uUmVxdWVzdH0gbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uUmVxdWVzdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb25SZXF1ZXN0KG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJRnVuY3Rpb25SZXF1ZXN0IHtcbiAgICByZXR1cm4gbWVzc2FnZS50eXBlID09PSBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvblJlcXVlc3Q7XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElGdW5jdGlvblJlc3BvbnNlfSBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGFuIHtAbGluayBJRnVuY3Rpb25SZXNwb25zZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb25SZXNwb25zZShtZXNzYWdlOiBJV29ya2VyTWVzc2FnZSk6IG1lc3NhZ2UgaXMgSUZ1bmN0aW9uUmVzcG9uc2Uge1xuICAgIHJldHVybiBtZXNzYWdlLnR5cGUgPT09IFdvcmtlck1lc3NhZ2VUeXBlLkZ1bmN0aW9uUmVzcG9uc2U7XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElXb3JrZXJSZXN1bHRNZXNzYWdlfSBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGFuIHtAbGluayBJV29ya2VyUmVzdWx0TWVzc2FnZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV29ya2VyUmVzdWx0KG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJV29ya2VyUmVzdWx0TWVzc2FnZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuV29ya2VyUmVzdWx0O1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGFuIHtAbGluayBJRnVuY3Rpb25FeGVjdXRpb25FcnJvcn0gbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uRXhlY3V0aW9uRXJyb3J9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IobWVzc2FnZTogSVdvcmtlck1lc3NhZ2UpOiBtZXNzYWdlIGlzIElGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIHtcbiAgICByZXR1cm4gbWVzc2FnZS50eXBlID09PSBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvbkV4ZWN1dGlvbkVycm9yO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGEgc3RvcCBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGEgc3RvcCBtZXNzYWdlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0b3BNZXNzc2FnZShtZXNzYWdlOiBJV29ya2VyTWVzc2FnZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtZXNzYWdlLnR5cGUgPT09IFdvcmtlck1lc3NhZ2VUeXBlLlN0b3A7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3dvcmtlci93b3JrZXItbWVzc2FnZXMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3dvcmtlci93b3JrZXItbWVzc2FnZXMudHMiLCJpbXBvcnQge2lzU3RvcE1lc3NzYWdlfSBmcm9tIFwiLi4vLi4vY29tbW9uL3dvcmtlci93b3JrZXItbWVzc2FnZXNcIjtcbmltcG9ydCB7RGVmYXVsdEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlLCBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZX0gZnJvbSBcIi4vYnJvd3Nlci13b3JrZXItc2xhdmUtc3RhdGVzXCI7XG5pbXBvcnQge1NsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZX0gZnJvbSBcIi4uLy4uL2NvbW1vbi9mdW5jdGlvbi9zbGF2ZS1mdW5jdGlvbi1sb29rdXAtdGFibGVcIjtcblxuZGVjbGFyZSBmdW5jdGlvbiBwb3N0TWVzc2FnZShkYXRhOiBhbnkpOiB2b2lkO1xuXG4vKipcbiAqIFdvcmtlciB0aHJlYWQgZW5kcG9pbnQgZXhlY3V0ZWQgaW4gdGhlIHdlYiB3b3JrZXIgdGhyZWFkLlxuICogRXhlY3V0ZXMgdGhlIHRhc2tzIGFzc2lnbmVkIGJ5IHRoZSB0aHJlYWQgcG9vbCB2aWEgdGhlIHtAbGluayBCcm93c2VyV29ya2VyVGhyZWFkfS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJyb3dzZXJXb3JrZXJTbGF2ZSB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdW5pcXVlIGlkIG9mIHRoZSBzbGF2ZSBpbnN0YW5jZVxuICAgICAqL1xuICAgIHB1YmxpYyBpZDogbnVtYmVyID0gTnVtYmVyLk5hTjtcblxuICAgIHByaXZhdGUgc3RhdGU6IEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlID0gbmV3IERlZmF1bHRCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzKTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBmdW5jdGlvbkNhY2hlOiBTbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHN0YXRlIG9mIHRoZSBzbGF2ZSB0byB0aGUgbmV3IHN0YXRlXG4gICAgICogQHBhcmFtIHN0YXRlIHRoZSBuZXcgc3RhdGUgdG8gYXNzaWduXG4gICAgICovXG4gICAgcHVibGljIGNoYW5nZVN0YXRlKHN0YXRlOiBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMuc3RhdGUuZW50ZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlZCB3aGVuIHRoZSBzbGF2ZSByZWNlaXZlcyBhIG1lc3NhZ2UgZnJvbSB0aGUgdWktdGhyZWFkXG4gICAgICogQHBhcmFtIGV2ZW50IHRoZSByZWNlaXZlZCBtZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIG9uTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChpc1N0b3BNZXNzc2FnZShldmVudC5kYXRhKSkge1xuICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5vbk1lc3NhZ2UoZXZlbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1lc3NhZ2Ugd2l0aCB0eXBlICR7ZXZlbnQuZGF0YS50eXBlfSBjYW5ub3QgYmUgaGFuZGxlZCBieSBzbGF2ZSAke3RoaXN9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcG9zdE1lc3NhZ2UobWVzc2FnZTogYW55KTogdm9pZCB7XG4gICAgICAgIHBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYEJyb3dzZXJTbGF2ZSB7IGlkOiAke3RoaXMuaWR9LCBzdGF0ZTogJyR7dGhpcy5zdGF0ZS5uYW1lfScgfWA7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLnRzIiwiaW1wb3J0IHtJRnVuY3Rpb25Mb29rdXBUYWJsZX0gZnJvbSBcIi4vZnVuY3Rpb24tbG9va3VwLXRhYmxlXCI7XG5pbXBvcnQge0lGdW5jdGlvbkRlZmluaXRpb259IGZyb20gXCIuL2Z1bmN0aW9uLWRlZmludGlvblwiO1xuaW1wb3J0IHtJRnVuY3Rpb25JZH0gZnJvbSBcIi4vZnVuY3Rpb24taWRcIjtcbmltcG9ydCB7U2ltcGxlTWFwfSBmcm9tIFwiLi4vdXRpbC9zaW1wbGUtbWFwXCI7XG5cbi8qKlxuICogQ2FjaGUgdXNlZCBieSBlYWNoIHdvcmtlciBzbGF2ZSB0byBjYWNoZSB0aGUgcmVjZWl2ZWQgZnVuY3Rpb25zLlxuICogQ2FjaGluZyB0aGUgZnVuY3Rpb25zIGhhcyB0aGUgYWR2YW50YWdlIHRoYXQgZnVuY3Rpb24gb25seSBpcyBzZXJpYWxpemVkLCB0cmFuc21pdHRlZCBhbmQgZGVzZXJpYWxpemVkIG9uY2UuIFRoaXMgYWxzb1xuICogaGFzIHRoZSBhZHZhbnRhZ2UsIHRoYXQgdGhlIGZ1bmN0aW9uIGluc3RhbmNlIHN0YXlzIHRoZSBzYW1lIGFuZCB0aGVyZWZvcmUgY2FuIGJlIG9wdGltaXplZCBieSB0aGUgcnVudGltZSBzeXN0ZW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBTbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUgaW1wbGVtZW50cyBJRnVuY3Rpb25Mb29rdXBUYWJsZSB7XG4gICAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBTaW1wbGVNYXA8c3RyaW5nLCBGdW5jdGlvbj4oKTtcblxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIHRoZSBmdW5jaXRvbiB3aXRoIHRoZSBnaXZuZSBpZFxuICAgICAqIEBwYXJhbSBpZCB0aGUgaWQgb2YgdGhlIGZ1bmN0aW9uIHRvIHJlc29sdmVcbiAgICAgKiBAcmV0dXJucyB0aGUgcmVzb2x2ZWQgZnVuY3Rpb24gb3IgdW5kZWZpbmVkIGlmIG5vdCBrbm93blxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRGdW5jdGlvbihpZDogSUZ1bmN0aW9uSWQpOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldChpZC5pZGVudGlmaWVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBuZXcgZnVuY3Rpb24gaW4gdGhlIGNhY2hlXG4gICAgICogQHBhcmFtIGRlZmluaXRpb24gdGhlIGRlZmluaXRpb24gb2YgdGhlIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG4gICAgICogQHJldHVybnMgdGhlIHJlZ2lzdGVyZWQgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJGdW5jdGlvbihkZWZpbml0aW9uOiBJRnVuY3Rpb25EZWZpbml0aW9uKTogRnVuY3Rpb24ge1xuICAgICAgICBjb25zdCBmID0gRnVuY3Rpb24uYXBwbHkobnVsbCwgWy4uLmRlZmluaXRpb24uYXJndW1lbnROYW1lcywgZGVmaW5pdGlvbi5ib2R5XSk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2V0KGRlZmluaXRpb24uaWQuaWRlbnRpZmllciwgZik7XG4gICAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3RlclN0YXRpY0Z1bmN0aW9uKGlkOiBJRnVuY3Rpb25JZCwgZnVuYzogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGlkKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZ2l2ZW4gZnVuY3Rpb24gaWQgJyR7aWQuaWRlbnRpZmllcn0nIGlzIGFscmVhZHkgdXNlZCBieSBhbm90aGVyIGZ1bmN0aW9uIHJlZ2lzdHJhdGlvbiwgdGhlIGlkIG5lZWRzIHRvIGJlIHVuaXF1ZS5gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhY2hlLnNldChpZC5pZGVudGlmaWVyLCBmdW5jKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBpZiB0aGUgY2FjaGUgY29udGFpbnMgYSBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBpZFxuICAgICAqIEBwYXJhbSBpZCB0aGUgaWQgb2YgdGhlIGZ1bmN0aW9uIHRvIHRlc3QgZm9yIGV4aXN0ZW5jZVxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNhY2hlIGNvbnRhaW5zIGEgZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzKGlkOiBJRnVuY3Rpb25JZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5oYXMoaWQuaWRlbnRpZmllcik7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9mdW5jdGlvbi9zbGF2ZS1mdW5jdGlvbi1sb29rdXAtdGFibGUudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL3NsYXZlLWZ1bmN0aW9uLWxvb2t1cC10YWJsZS50cyIsImltcG9ydCB7SUZ1bmN0aW9uTG9va3VwVGFibGV9IGZyb20gXCIuLi8uLi9mdW5jdGlvbi9mdW5jdGlvbi1sb29rdXAtdGFibGVcIjtcbmltcG9ydCB7UGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkc30gZnJvbSBcIi4vcGFyYWxsZWwtd29ya2VyLWZ1bmN0aW9uc1wiO1xuaW1wb3J0IHtpZGVudGl0eX0gZnJvbSBcIi4uLy4uL3V0aWwvaWRlbnRpdHlcIjtcbmltcG9ydCB7ZmlsdGVySXRlcmF0b3J9IGZyb20gXCIuL2ZpbHRlci1pdGVyYXRvclwiO1xuaW1wb3J0IHttYXBJdGVyYXRvcn0gZnJvbSBcIi4vbWFwLWl0ZXJhdG9yXCI7XG5pbXBvcnQge3BhcmFsbGVsSm9iRXhlY3V0b3J9IGZyb20gXCIuL3BhcmFsbGVsLWpvYi1leGVjdXRvclwiO1xuaW1wb3J0IHtyYW5nZUl0ZXJhdG9yfSBmcm9tIFwiLi9yYW5nZS1pdGVyYXRvclwiO1xuaW1wb3J0IHtyZWR1Y2VJdGVyYXRvcn0gZnJvbSBcIi4vcmVkdWNlLWl0ZXJhdG9yXCI7XG5pbXBvcnQge3RvSXRlcmF0b3J9IGZyb20gXCIuLi8uLi91dGlsL2FycmF5c1wiO1xuXG4vKipcbiAqIFJlZ2lzdGVycyB0aGUgc3RhdGljIHBhcmFsbGVsIGZ1bmN0aW9uc1xuICogQHBhcmFtIGxvb2t1cFRhYmxlIHRoZSB0YWJsZSBpbnRvIHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJTdGF0aWNQYXJhbGxlbEZ1bmN0aW9ucyhsb29rdXBUYWJsZTogSUZ1bmN0aW9uTG9va3VwVGFibGUpIHtcbiAgICBsb29rdXBUYWJsZS5yZWdpc3RlclN0YXRpY0Z1bmN0aW9uKFBhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHMuSURFTlRJVFksIGlkZW50aXR5KTtcbiAgICBsb29rdXBUYWJsZS5yZWdpc3RlclN0YXRpY0Z1bmN0aW9uKFBhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHMuRklMVEVSLCBmaWx0ZXJJdGVyYXRvcik7XG4gICAgbG9va3VwVGFibGUucmVnaXN0ZXJTdGF0aWNGdW5jdGlvbihQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzLk1BUCwgbWFwSXRlcmF0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5QQVJBTExFTF9KT0JfRVhFQ1VUT1IsIHBhcmFsbGVsSm9iRXhlY3V0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5SQU5HRSwgcmFuZ2VJdGVyYXRvcik7XG4gICAgbG9va3VwVGFibGUucmVnaXN0ZXJTdGF0aWNGdW5jdGlvbihQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzLlJFRFVDRSwgcmVkdWNlSXRlcmF0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5UT19JVEVSQVRPUiwgdG9JdGVyYXRvcik7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHMiLCJpbXBvcnQge0Z1bmN0aW9uQ2FsbERlc2VyaWFsaXplcn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9mdW5jdGlvbi9mdW5jdGlvbi1jYWxsLWRlc2VyaWFsaXplclwiO1xuaW1wb3J0IHtJVGFza0RlZmluaXRpb259IGZyb20gXCIuLi8uLi9jb21tb24vdGFzay90YXNrLWRlZmluaXRpb25cIjtcbmltcG9ydCB7SUZ1bmN0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9mdW5jdGlvbi9mdW5jdGlvbi1kZWZpbnRpb25cIjtcbmltcG9ydCB7XG4gICAgZnVuY3Rpb25FeGVjdXRpb25FcnJvciwgaXNGdW5jdGlvblJlc3BvbnNlLCBpc0luaXRpYWxpemVNZXNzYWdlLCBpc1NjaGVkdWxlVGFzaywgcmVxdWVzdEZ1bmN0aW9uTWVzc2FnZSxcbiAgICB3b3JrZXJSZXN1bHRNZXNzYWdlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzXCI7XG5pbXBvcnQge0Jyb3dzZXJXb3JrZXJTbGF2ZX0gZnJvbSBcIi4vYnJvd3Nlci13b3JrZXItc2xhdmVcIjtcblxuLyoqXG4gKiBTdGF0ZSBvZiB0aGUgYnJvd3NlciB3b3JrZXIgc2xhdmUuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHJvdGVjdGVkIHNsYXZlOiBCcm93c2VyV29ya2VyU2xhdmUpIHt9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlZCB3aGVuIHRoZSBzbGF2ZSBjaGFuZ2VzIGl0cyBzdGF0ZSB0byB0aGlzIHN0YXRlLlxuICAgICAqL1xuICAgIHB1YmxpYyBlbnRlcigpOiB2b2lkIHtcbiAgICAgICAgLy8gaW50ZW50aW9uYWxseSBlbXB0eVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVkIHdoZW5ldmVyIHRoZSBzbGF2ZSByZWNlaXZlcyBhIG1lc3NhZ2UgZnJvbSB0aGUgdWktdGhyZWFkIHdoaWxlIGJlaW5nIGluIHRoaXMgc3RhdGVcbiAgICAgKiBAcGFyYW0gZXZlbnQgdGhlIHJlY2VpdmVkIG1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgc3RhdGUgaGFzIGhhbmRsZWQgdGhlIG1lc3NhZ2UsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cbn1cblxuLyoqXG4gKiBJbml0aWFsIHN0YXRlIG9mIGEgc2xhdmUuIFRoZSBzbGF2ZSBpcyB3YWl0aW5nIGZvciB0aGUgaW5pdGlhbGl6YXRpb24gbWVzc2FnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSBleHRlbmRzIEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIHtcbiAgICAgICBjb25zdHJ1Y3RvcihzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlKSB7XG4gICAgICAgIHN1cGVyKFwiRGVmYXVsdFwiLCBzbGF2ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChpc0luaXRpYWxpemVNZXNzYWdlKGV2ZW50LmRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnNsYXZlLmlkID0gZXZlbnQuZGF0YS53b3JrZXJJZDtcbiAgICAgICAgICAgIHRoaXMuc2xhdmUuY2hhbmdlU3RhdGUobmV3IElkbGVCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzLnNsYXZlKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBzbGF2ZSBpcyB3YWl0aW5nIGZvciB3b3JrIGZyb20gdGhlIHVpLXRocmVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIElkbGVCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSBleHRlbmRzIEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIHtcbiAgICBjb25zdHJ1Y3RvcihzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlKSB7XG4gICAgICAgIHN1cGVyKFwiSWRsZVwiLCBzbGF2ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXNTY2hlZHVsZVRhc2soZXZlbnQuZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhc2s6IElUYXNrRGVmaW5pdGlvbiA9IGV2ZW50LmRhdGEudGFzaztcbiAgICAgICAgY29uc3QgbWlzc2luZ0Z1bmN0aW9ucyA9IHRhc2sudXNlZEZ1bmN0aW9uSWRzLmZpbHRlcihpZCA9PiAhdGhpcy5zbGF2ZS5mdW5jdGlvbkNhY2hlLmhhcyhpZCkpO1xuXG4gICAgICAgIGlmIChtaXNzaW5nRnVuY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5jaGFuZ2VTdGF0ZShuZXcgRXhlY3V0ZUZ1bmN0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcy5zbGF2ZSwgdGFzaykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgWyBoZWFkLCAuLi50YWlsIF0gPSBtaXNzaW5nRnVuY3Rpb25zO1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5wb3N0TWVzc2FnZShyZXF1ZXN0RnVuY3Rpb25NZXNzYWdlKGhlYWQsIC4uLnRhaWwpKTtcbiAgICAgICAgICAgIHRoaXMuc2xhdmUuY2hhbmdlU3RhdGUobmV3IFdhaXRpbmdGb3JGdW5jdGlvbkRlZmluaXRpb25Ccm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzLnNsYXZlLCB0YXNrKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIHNsYXZlIGlzIHdhaXRpbmcgZm9yIHRoZSBkZWZpbml0aW9uIG9mIHRoZSByZXF1ZXN0ZWQgZnVuY3Rpb24gdGhhdCBpcyBuZWVkZWQgdG8gZXhlY3V0ZSB0aGUgYXNzaWduZWQgdGFzay5cbiAqL1xuZXhwb3J0IGNsYXNzIFdhaXRpbmdGb3JGdW5jdGlvbkRlZmluaXRpb25Ccm93c2VyV29ya2VyU2xhdmVTdGF0ZSBleHRlbmRzIEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIHtcbiAgICBjb25zdHJ1Y3RvcihzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlLCBwcml2YXRlIHRhc2s6IElUYXNrRGVmaW5pdGlvbikge1xuICAgICAgICBzdXBlcihcIldhaXRpbmdGb3JGdW5jdGlvbkRlZmluaXRpb25cIiwgc2xhdmUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb25SZXNwb25zZShtZXNzYWdlKSkge1xuICAgICAgICAgICAgaWYgKG1lc3NhZ2UubWlzc2luZ0Z1bmN0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWRlbnRpZmllcnMgPSBtZXNzYWdlLm1pc3NpbmdGdW5jdGlvbnMubWFwKGZ1bmN0aW9uSWQgPT4gZnVuY3Rpb25JZC5pZGVudGlmaWVyKS5qb2luKFwiLCBcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGF2ZS5wb3N0TWVzc2FnZShmdW5jdGlvbkV4ZWN1dGlvbkVycm9yKG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIGlkcyBbJHtpZGVudGlmaWVyc31dIGNvdWxkIG5vdCBiZSByZXNvbHZlZCBieSBzbGF2ZSAke3RoaXMuc2xhdmUuaWR9LmApKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGF2ZS5jaGFuZ2VTdGF0ZShuZXcgSWRsZUJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlKHRoaXMuc2xhdmUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBkZWZpbml0aW9uIG9mIG1lc3NhZ2UuZnVuY3Rpb25zIGFzIElGdW5jdGlvbkRlZmluaXRpb25bXSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNsYXZlLmZ1bmN0aW9uQ2FjaGUucmVnaXN0ZXJGdW5jdGlvbihkZWZpbml0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNsYXZlLmNoYW5nZVN0YXRlKG5ldyBFeGVjdXRlRnVuY3Rpb25Ccm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzLnNsYXZlLCB0aGlzLnRhc2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIHNsYXZlIGlzIGV4ZWN1dGluZyB0aGUgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEV4ZWN1dGVGdW5jdGlvbkJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIGV4dGVuZHMgQnJvd3NlcldvcmtlclNsYXZlU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKHNsYXZlOiBCcm93c2VyV29ya2VyU2xhdmUsIHByaXZhdGUgdGFzazogSVRhc2tEZWZpbml0aW9uKSB7XG4gICAgICAgIHN1cGVyKFwiRXhlY3V0aW5nXCIsIHNsYXZlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW50ZXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZ1bmN0aW9uRGVzZXJpYWxpemVyID0gbmV3IEZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplcih0aGlzLnNsYXZlLmZ1bmN0aW9uQ2FjaGUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBtYWluID0gZnVuY3Rpb25EZXNlcmlhbGl6ZXIuZGVzZXJpYWxpemVGdW5jdGlvbkNhbGwodGhpcy50YXNrLm1haW4pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbWFpbih7ZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyOiBmdW5jdGlvbkRlc2VyaWFsaXplcn0pO1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5wb3N0TWVzc2FnZSh3b3JrZXJSZXN1bHRNZXNzYWdlKHJlc3VsdCkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5wb3N0TWVzc2FnZShmdW5jdGlvbkV4ZWN1dGlvbkVycm9yKGVycm9yKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNsYXZlLmNoYW5nZVN0YXRlKG5ldyBJZGxlQnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcy5zbGF2ZSkpO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9icm93c2VyLXdvcmtlci1zbGF2ZS1zdGF0ZXMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvYnJvd3Nlci93b3JrZXItc2xhdmUvYnJvd3Nlci13b3JrZXItc2xhdmUtc3RhdGVzLnRzIiwiaW1wb3J0IHtJRnVuY3Rpb25Mb29rdXBUYWJsZX0gZnJvbSBcIi4vZnVuY3Rpb24tbG9va3VwLXRhYmxlXCI7XG5pbXBvcnQge0lTZXJpYWxpemVkRnVuY3Rpb25DYWxsLCBpc1NlcmlhbGl6ZWRGdW5jdGlvbkNhbGx9IGZyb20gXCIuL3NlcmlhbGl6ZWQtZnVuY3Rpb24tY2FsbFwiO1xuXG4vKipcbiAqIERlc2VyaWFsaXplciBmb3IgYSB7QGxpbmsgSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGx9LlxuICovXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGRlc2VyaWFsaXplciB0aGF0IHVzZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIGxvb2t1cCB0YWJsZSB0byByZXRyaWV2ZSB0aGUgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gaWRcbiAgICAgKiBAcGFyYW0gZnVuY3Rpb25Mb29rdXBUYWJsZSB0aGUgbG9va3VwIHRhYmxlIHRvIHVzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZnVuY3Rpb25Mb29rdXBUYWJsZTogSUZ1bmN0aW9uTG9va3VwVGFibGUpIHt9XG5cbiAgICAvKipcbiAgICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGZ1bmN0aW9uIGNhbGwgaW50byBhIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIGZ1bmN0aW9uQ2FsbCB0aGUgZnVuY3Rpb24gY2FsbCB0byBkZXNlcmlhbGl6ZVxuICAgICAqIEBwYXJhbSBkZXNlcmlhbGl6ZVBhcmFtcyBpbmRpY2F0b3IgaWYgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvIHRoZSBzZXJpYWxpemVkIGZ1bmN0aW9uIHNob3VsZCBiZSBkZXNlcmFpbGl6ZWQgdG9vXG4gICAgICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgd2l0aCBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgKHRoZSBwYXJhbXMgZnJvbSB0aGUgc2VyaWFsaXplZCBmdW5jdGlvbiBjYWxscyBhcmUgcHJlcGVuZGVkIHRvIHRoZSBwYXNzZWQgcGFyYW1ldGVycylcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzZXJpYWxpemVGdW5jdGlvbkNhbGw8VFJlc3VsdD4oZnVuY3Rpb25DYWxsOiBJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCwgZGVzZXJpYWxpemVQYXJhbXMgPSBmYWxzZSk6ICguLi5hZGRpdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4gVFJlc3VsdCB7XG4gICAgICAgIGNvbnN0IGZ1bmMgPSB0aGlzLmZ1bmN0aW9uTG9va3VwVGFibGUuZ2V0RnVuY3Rpb24oZnVuY3Rpb25DYWxsLmZ1bmN0aW9uSWQpO1xuICAgICAgICBpZiAoIWZ1bmMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIHdpdGggdGhlIGlkICR7ZnVuY3Rpb25DYWxsLmZ1bmN0aW9uSWQuaWRlbnRpZmllcn0gY291bGQgbm90IGJlIHJldHJpZXZlZCB3aGlsZSBkZXNlcmlhbGl6aW5nIHRoZSBmdW5jdGlvbiBjYWxsLiBJcyB0aGUgZnVuY3Rpb24gY29ycmVjdGx5IHJlZ2lzdGVyZWQ/YCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyYW1zID0gZnVuY3Rpb25DYWxsLnBhcmFtZXRlcnMgfHwgW107XG5cbiAgICAgICAgaWYgKGRlc2VyaWFsaXplUGFyYW1zKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsKHBhcmFtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kZXNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbChwYXJhbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hZGRpdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMuY29uY2F0KGFkZGl0aW9uYWxQYXJhbXMpKSBhcyBUUmVzdWx0O1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24tY2FsbC1kZXNlcmlhbGl6ZXIudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWNhbGwtZGVzZXJpYWxpemVyLnRzIiwiLyoqXG4gKiBAbW9kdWxlIHBhcmFsbGVsXG4gKi9cbi8qKiAqL1xuXG4vKipcbiAqIElkZW50aWZpZXIgZm9yIGEgc2VyaWFsaXplZCBmdW5jdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvbklkIHtcbiAgICAvKipcbiAgICAgKiBUaGUgZ2xvYmFsbHkgdW5pcXVlIGlkZW50aWZpZXJcbiAgICAgKi9cbiAgICBpZGVudGlmaWVyOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBGbGFnIHRoYXQgaW5kaWNhdGVzIHRoYXQgdGhpcyBpcyBhIGZ1bmN0aW9uIGlkXG4gICAgICovXG4gICAgX19fX19fX2lzRnVuY3Rpb25JZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gaWRcbiAqIEBwYXJhbSBuYW1lc3BhY2UgdGhlIG5hbWVzcGFjZSBvZiB0aGUgaWRcbiAqIEBwYXJhbSBpZCB0aGUgdW5pcXVlIGlkIGZvciB0aGlzIG5hbWVzcGFjZVxuICogQHJldHVybnMgdGhlIGZ1bmN0aW9uIGlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbklkKG5hbWVzcGFjZTogc3RyaW5nLCBpZDogbnVtYmVyKTogSUZ1bmN0aW9uSWQge1xuICAgIHJldHVybiB7XG4gICAgICAgIF9fX19fX19pc0Z1bmN0aW9uSWQ6IHRydWUsXG4gICAgICAgIGlkZW50aWZpZXI6IGAke25hbWVzcGFjZX0tJHtpZH1gXG4gICAgfTtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgZnVuY3Rpb24gaWRcbiAqIEBwYXJhbSBvYmogdGhlIG9iamVjdCB0byB0ZXN0IGZvclxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzICBhIGZ1bmN0aW9uIGlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uSWQob2JqOiBhbnkpOiBvYmogaXMgSUZ1bmN0aW9uSWQge1xuICAgIHJldHVybiAhIW9iaiAmJiBvYmouX19fX19fX2lzRnVuY3Rpb25JZCA9PT0gdHJ1ZTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24taWQudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWlkLnRzIiwiaW1wb3J0IHtJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnR9IGZyb20gXCIuLi9cIjtcbi8qKlxuICogUmV0dXJucyBhIG5ldyBpdGVyYXRvciB0aGF0IG9ubHkgY29udGFpbnMgYWxsIGVsZW1lbnRzIGZvciB3aGljaCB0aGUgZ2l2ZW4gcHJlZGljYXRlIHJldHVybnMgdHJ1ZVxuICogQHBhcmFtIGl0ZXJhdG9yIHRoZSBpdGVyYXRvciB0byBmaWx0ZXJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgdGhlIHByZWRpY2F0ZSB0byB1c2UgZm9yIGZpbHRlcmluZyB0aGUgZWxlbWVudHNcbiAqIEBwYXJhbSBlbnYgdGhlIGVudmlyb25tZW50IG9mIHRoZSBqb2JcbiAqIEBwYXJhbSBUIHR5cGUgb2YgdGhlIGVsZW1lbnRzIHRvIGZpbHRlclxuICogQHJldHVybnMgYW4gaXRlcmF0b3Igb25seSBjb250YWluaW5nIHRoZSBlbGVtZW50cyB3aGVyZSB0aGUgcHJlZGljYXRlIGlzIHRydWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckl0ZXJhdG9yPFQ+KGl0ZXJhdG9yOiBJdGVyYXRvcjxUPiwgcHJlZGljYXRlOiAodGhpczogdm9pZCwgdmFsdWU6IFQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KSA9PiBib29sZWFuLCBlbnY6IElQYXJhbGxlbFRhc2tFbnZpcm9ubWVudCk6IEl0ZXJhdG9yPFQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuZXh0KCkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tY29uZGl0aW9uYWwtYXNzaWdubWVudCAqL1xuICAgICAgICAgICAgd2hpbGUgKCEoY3VycmVudCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoY3VycmVudC52YWx1ZSwgZW52KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvZmlsdGVyLWl0ZXJhdG9yLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9maWx0ZXItaXRlcmF0b3IudHMiLCJpbXBvcnQge0lQYXJhbGxlbFRhc2tFbnZpcm9ubWVudH0gZnJvbSBcIi4uL1wiO1xuLyoqXG4gKiBQZXJmb3JtcyB0aGUgbWFwIG9wZXJhdGlvblxuICogQHBhcmFtIGl0ZXJhdG9yIHRoZSBpdGVyYXRvciBvZiB0aGUgcHJldmlvdXMgc3RlcFxuICogQHBhcmFtIGl0ZXJhdGVlIHRoZSBpdGVyYXRlZSB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQgaW4gdGhlIGl0ZXJhdG9yXG4gKiBAcGFyYW0gZW52IHRoZSBlbnZpcm9ubWVudCBvZiB0aGUgam9iXG4gKiBAcGFyYW0gVCB0aGUgdHlwZSBvZiB0aGUgaW5wdXQgZWxlbWVudHNcbiAqIEBwYXJhbSBUUmVzdWx0IHRoZSB0eXBlIG9mIHRoZSByZXR1cm5lZCBlbGVtZW50IG9mIHRoZSBpdGVyYXRlZVxuICogQHJldHVybnMgYSBuZXcgaXRlcmF0b3Igd2hlcmUgZWFjaCBlbGVtZW50IGhhcyBiZWVuIG1hcHBlZCB1c2luZyB0aGUgaXRlcmF0ZWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcEl0ZXJhdG9yPFQsIFRSZXN1bHQ+KGl0ZXJhdG9yOiBJdGVyYXRvcjxUPiwgaXRlcmF0ZWU6ICh0aGlzOiB2b2lkLCB2YWx1ZTogVCwgZW52OiBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnQpID0+IFRSZXN1bHQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KTogSXRlcmF0b3I8VFJlc3VsdD4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VFJlc3VsdD4ge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9IGFzIEl0ZXJhdG9yUmVzdWx0PFRSZXN1bHQ+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkb25lOiByZXN1bHQuZG9uZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlcmF0ZWUocmVzdWx0LnZhbHVlLCBlbnYpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvbWFwLWl0ZXJhdG9yLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9tYXAtaXRlcmF0b3IudHMiLCJpbXBvcnQge3RvQXJyYXl9IGZyb20gXCIuLi8uLi91dGlsL2FycmF5c1wiO1xuaW1wb3J0IHtGdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXJ9IGZyb20gXCIuLi8uLi9mdW5jdGlvbi9mdW5jdGlvbi1jYWxsLWRlc2VyaWFsaXplclwiO1xuaW1wb3J0IHtJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCwgaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsfSBmcm9tIFwiLi4vLi4vZnVuY3Rpb24vc2VyaWFsaXplZC1mdW5jdGlvbi1jYWxsXCI7XG5pbXBvcnQge0lTZXJpYWxpemVkUGFyYWxsZWxPcGVyYXRpb24sIElQYXJhbGxlbEVudmlyb25tZW50LCBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnR9IGZyb20gXCIuLi9cIjtcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBwYXJhbGxlbCBvcGVyYXRpb24gdG8gcGVyZm9ybVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQYXJhbGxlbEpvYkRlZmluaXRpb24ge1xuICAgIC8qKlxuICAgICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgYXJyYXkgdGhhdCBpcyBcIm1hbmlwdWxhdGVkXCIgYnkgYXBwbHlpbmcgdGhlIGdpdmVuIGFjdGlvbnMuXG4gICAgICovXG4gICAgZ2VuZXJhdG9yOiBJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvcGVyYXRpb25zIHRvIHBlcmZvcm0gb24gdGhlIGFycmF5IGVsZW1lbnRzXG4gICAgICovXG4gICAgb3BlcmF0aW9uczogSVNlcmlhbGl6ZWRQYXJhbGxlbE9wZXJhdGlvbltdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGVudmlyb25tZW50cy4gT2JqZWN0IGhhc2ggdGhhdCBpcyBwYXNzZWQgdG8gYWxsIGl0ZXJhdGVlIGZ1bmN0aW9ucyBhbmQgYWxsb3dzIHRvIGFjY2VzcyBleHRlcm5hbCBkYXRhXG4gICAgICovXG4gICAgZW52aXJvbm1lbnRzOiBBcnJheTxJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCB8IElQYXJhbGxlbEVudmlyb25tZW50PjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBqb2ItcmVsYXRpdmUgaW5kZXggb2YgdGhlIHRhc2tcbiAgICAgKi9cbiAgICB0YXNrSW5kZXg6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgdmFsdWVzIHByb2Nlc3NlZCBieSBlYWNoIHRhc2sgKGF0IG1vc3QpXG4gICAgICovXG4gICAgdmFsdWVzUGVyVGFzazogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUYXNrRW52aXJvbm1lbnQoZGVmaW5pdGlvbjogSVBhcmFsbGVsSm9iRGVmaW5pdGlvbiwgZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyOiBGdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIpOiBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnQge1xuICAgIGxldCB0YXNrRW52aXJvbm1lbnQ6IElQYXJhbGxlbEVudmlyb25tZW50ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGVudmlyb25tZW50IG9mIGRlZmluaXRpb24uZW52aXJvbm1lbnRzKSB7XG4gICAgICAgIGxldCBjdXJyZW50RW52aXJvbm1lbnQ6IElQYXJhbGxlbEVudmlyb25tZW50O1xuICAgICAgICBpZiAoaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsKGVudmlyb25tZW50KSkge1xuICAgICAgICAgICAgY3VycmVudEVudmlyb25tZW50ID0gZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyLmRlc2VyaWFsaXplRnVuY3Rpb25DYWxsKGVudmlyb25tZW50KSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudEVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0YXNrRW52aXJvbm1lbnQsIGN1cnJlbnRFbnZpcm9ubWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHsgdGFza0luZGV4OiBkZWZpbml0aW9uLnRhc2tJbmRleCwgdmFsdWVzUGVyVGFzazogZGVmaW5pdGlvbi52YWx1ZXNQZXJUYXNrIH0sIHRhc2tFbnZpcm9ubWVudCk7XG59XG5cbi8qKlxuICogTWFpbiBjb29yZGluYXRpb24gZnVuY3Rpb24gZm9yIGFueSBvcGVyYXRpb24gcGVyZm9ybWVkIHVzaW5nIHtAbGluayBJUGFyYWxsZWx9LlxuICogQHBhcmFtIGRlZmluaXRpb24gdGhlIGRlZmluaXRpb24gb2YgdGhlIG9wZXJhdGlvbiB0byBwZXJmb3JtZWRcbiAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgcGFzc2VkIGZyb20gdGhlIHRocmVhZCBwb29sXG4gKiBAcGFyYW0gVCB0eXBlIG9mIHRoZSBlbGVtZW50cyBjcmVhdGVkIGJ5IHRoZSBnZW5lcmF0b3JcbiAqIEBwYXJhbSBUUmVzdWx0IHR5cGUgb2YgdGhlIHJlc3VsdGluZyBlbGVtZW50c1xuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uIGZyb20gdGhpcyB3b3JrZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsSm9iRXhlY3V0b3I8VCwgVFJlc3VsdD4oZGVmaW5pdGlvbjogSVBhcmFsbGVsSm9iRGVmaW5pdGlvbiwgeyBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIgfTogeyBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXI6IEZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplciB9KTogVFJlc3VsdFtdIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IGNyZWF0ZVRhc2tFbnZpcm9ubWVudChkZWZpbml0aW9uLCBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIpO1xuICAgIGNvbnN0IGdlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyLmRlc2VyaWFsaXplRnVuY3Rpb25DYWxsKGRlZmluaXRpb24uZ2VuZXJhdG9yLCB0cnVlKTtcbiAgICBsZXQgaXRlcmF0b3IgPSBnZW5lcmF0b3JGdW5jdGlvbihlbnZpcm9ubWVudCkgYXMgSXRlcmF0b3I8VD47XG5cbiAgICBmb3IgKGNvbnN0IG9wZXJhdGlvbiBvZiBkZWZpbml0aW9uLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgY29uc3QgaXRlcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplci5kZXNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbDxJdGVyYXRvcjxUPj4ob3BlcmF0aW9uLml0ZXJhdG9yKTtcbiAgICAgICAgY29uc3QgaXRlcmF0ZWUgPSBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIuZGVzZXJpYWxpemVGdW5jdGlvbkNhbGwob3BlcmF0aW9uLml0ZXJhdGVlKTtcbiAgICAgICAgaXRlcmF0b3IgPSBpdGVyYXRvckZ1bmN0aW9uKGl0ZXJhdG9yLCBpdGVyYXRlZSwgZW52aXJvbm1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0FycmF5PFRSZXN1bHQ+KGl0ZXJhdG9yIGFzIGFueSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3BhcmFsbGVsLWpvYi1leGVjdXRvci50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcGFyYWxsZWwtam9iLWV4ZWN1dG9yLnRzIiwiaW1wb3J0IHtmdW5jdGlvbklkLCBJRnVuY3Rpb25JZH0gZnJvbSBcIi4uLy4uL2Z1bmN0aW9uL2Z1bmN0aW9uLWlkXCI7XG5cbmV4cG9ydCBjb25zdCBQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzID0ge1xuICAgIEZJTFRFUjogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDApIGFzIElGdW5jdGlvbklkLFxuICAgIElERU5USVRZOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgMSksXG4gICAgTUFQOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgMiksXG4gICAgUEFSQUxMRUxfSk9CX0VYRUNVVE9SOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgMyksXG4gICAgUkFOR0U6IGZ1bmN0aW9uSWQoXCJwYXJhbGxlbFwiLCA0KSxcbiAgICBSRURVQ0U6IGZ1bmN0aW9uSWQoXCJwYXJhbGxlbFwiLCA1KSxcbiAgICBUSU1FUzogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDYpLFxuICAgIFRPX0lURVJBVE9SOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgNylcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3BhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3BhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHMiLCIvKipcbiAqIEdlbmVyYXRvciBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYW4gaXRlcmF0b3IgY29udGFpbmluZyBhbGwgZWxlbWVudHMgaW4gdGhlIHJhbmdlIFtzdGFydCwgZW5kKSB3aXRoIGEgc3RlcCBzaXplIG9mIHN0ZXAuXG4gKiBAcGFyYW0gc3RhcnQgc3RhcnQgdmFsdWUgb2YgdGhlIHJhbmdlIChpbmNsdXNpdmUpXG4gKiBAcGFyYW0gZW5kIGVuZCB2YWx1ZSBvZiB0aGUgcmFuZ2UgKGV4Y2x1c2l2ZSlcbiAqIEBwYXJhbSBzdGVwIHN0ZXAgc2l6ZSBiZXR3ZWVuIHR3byB2YWx1ZXNcbiAqIEByZXR1cm5zIGl0ZXJhdG9yIHdpdGggdGhlIHZhbHVlcyBbc3RhcnQsIGVuZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlSXRlcmF0b3Ioc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIHN0ZXA6IG51bWJlcik6IEl0ZXJhdG9yPG51bWJlcj4ge1xuICAgIGxldCBuZXh0ID0gc3RhcnQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxudW1iZXI+IHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gbmV4dDtcbiAgICAgICAgICAgIG5leHQgPSBjdXJyZW50ICsgc3RlcDtcbiAgICAgICAgICAgIGlmIChjdXJyZW50IDwgZW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBjdXJyZW50IH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlIH0gYXMgSXRlcmF0b3JSZXN1bHQ8bnVtYmVyPjtcbiAgICAgICAgfVxuICAgIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JhbmdlLWl0ZXJhdG9yLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yYW5nZS1pdGVyYXRvci50cyIsImltcG9ydCB7SVBhcmFsbGVsVGFza0Vudmlyb25tZW50fSBmcm9tIFwiLi4vXCI7XG5pbXBvcnQge3RvSXRlcmF0b3J9IGZyb20gXCIuLi8uLi91dGlsL2FycmF5c1wiO1xuLyoqXG4gKiBSZWR1Y2VzIHRoZSBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gaXRlcmF0b3IgdG8gYSBzaW5nbGUgdmFsdWUgYnkgYXBwbHlpbmcgdGhlIGdpdmVuIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudFxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBhIGRlZmF1bHQgdmFsdWUgdGhhdCBpcyBhcyBhY2N1bXVsYXRvciBvciBmb3IgdGhlIGNhc2UgdGhhdCB0aGUgaXRlcmF0b3IgaXMgZW1wdHlcbiAqIEBwYXJhbSBpdGVyYXRvciB0aGUgaXRlcmF0b3Igd2l0aCB0aGUgdmFsdWVzIHRvIHJlZHVjZVxuICogQHBhcmFtIGl0ZXJhdGVlIGl0ZXJhdGVlIHRoYXQgaXMgYXBwbGllZCBmb3IgZWFjaCBlbGVtZW50LiBUaGUgaXRlcmF0ZWUgaXMgcGFzc2VkIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZSAoc3VtIG9mIGFsbCBwcmV2aW91cyB2YWx1ZXMpXG4gKiBhbmQgdGhlIGN1cnJlbnQgZWxlbWVudCBhbmQgaGFzIHRvIHJldHVybiBhIG5ldyBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBwYXJhbSBlbnYgdGhlIGVudmlyb25tZW50IG9mIHRoZSBqb2JcbiAqIEBwYXJhbSBUIHR5cGUgb2YgdGhlIGVsZW1lbnRzIHRvIHByb2Nlc3NcbiAqIEBwYXJhbSBUUmVzdWx0IHR5cGUgb2YgdGhlIHJlZHVjZWQgdmFsdWVcbiAqIEByZXR1cm5zIGFuIGFycmF5IHdpdGggYSBzaW5nbGUgdmFsdWUsIHRoZSByZWR1Y2VkIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VJdGVyYXRvcjxULCBUUmVzdWx0PihkZWZhdWx0VmFsdWU6IFRSZXN1bHQsIGl0ZXJhdG9yOiBJdGVyYXRvcjxUPiwgaXRlcmF0ZWU6ICh0aGlzOiB2b2lkLCBhY2N1bXVsYXRlZFZhbHVlOiBUUmVzdWx0LCB2YWx1ZTogVCB8IHVuZGVmaW5lZCwgZW52OiBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnQpID0+IFRSZXN1bHQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KTogSXRlcmF0b3I8VFJlc3VsdD4ge1xuICAgIGxldCBhY2N1bXVsYXRlZFZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIGxldCBjdXJyZW50OiBJdGVyYXRvclJlc3VsdDxUPjtcblxuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnQgKi9cbiAgICB3aGlsZSAoIShjdXJyZW50ID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGFjY3VtdWxhdGVkVmFsdWUgPSBpdGVyYXRlZShhY2N1bXVsYXRlZFZhbHVlLCBjdXJyZW50LnZhbHVlLCBlbnYpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0l0ZXJhdG9yKFthY2N1bXVsYXRlZFZhbHVlXSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZHVjZS1pdGVyYXRvci50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcmVkdWNlLWl0ZXJhdG9yLnRzIiwiLyoqXG4gKiBpZGVudGl0eSBmdW5jdGlvbi4gUmV0dXJucyB0aGUgcGFzc2VkIGluIHZhbHVlXG4gKiBAcGFyYW0gZWxlbWVudCB0aGUgdmFsdWUgdG8gcmV0dXJuXG4gKiBAcGFyYW0gVCB0eXBlIG9mIHRoZSBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eTxUPihlbGVtZW50OiBUKTogVCB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3V0aWwvaWRlbnRpdHkudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3V0aWwvaWRlbnRpdHkudHMiLCIvKipcbiAqIEEgdmVyeSBzaW1wbGUgaW1wbGVtZW50YXRpb24gb2YgYSBtYXAuIERvIG5vdCB1c2Ugd2l0aCBjb21wbGV4IG9iamVjdHMgYXMgS2V5LlxuICogQHBhcmFtIEsgdHlwZSBvZiB0aGUga2V5XG4gKiBAcGFyYW0gViB0eXBlIG9mIHRoZSB2YWx1ZVxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlTWFwPEssIFY+IHtcbiAgICBwcml2YXRlIGRhdGE6IHsgW2tleTogc3RyaW5nXTogViB9ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIGtleSBpZiBhdmFpbGFibGVcbiAgICAgKiBAcGFyYW0ga2V5IHRoZSBrZXkgdG8gbG9vayB1cFxuICAgICAqIEByZXR1cm5zIHRoZSBsb29rZWQgdXAgdmFsdWUgb3IgdW5kZWZpbmVkIGlmIHRoZSBtYXAgZG9lcyBub3QgY29udGFpbiBhbnkgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBrZXlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBpbnRlcm5hbEtleSA9IHRoaXMudG9JbnRlcm5hbEtleShrZXkpO1xuICAgICAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuZGF0YVtpbnRlcm5hbEtleV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgdGhlIG1hcCBjb250YWlucyB2YWx1ZSBzdG9yZWQgYnkgdGhlIGdpdmVuIGtleVxuICAgICAqIEBwYXJhbSBrZXkgdGhlIGtleVxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG1hcCBjb250YWlucyBhIHZhbHVlIGJ5IHRoZSBnaXZlbiBrZXksIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBoYXMoa2V5OiBLKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5kYXRhLCB0aGlzLnRvSW50ZXJuYWxLZXkoa2V5KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXkuIElmIHRoZSBtYXAgYWxyZWFkeSBjb250YWlucyBhIHZhbHVlIHN0b3JlZCBieSB0aGUgZ2l2ZW4ga2V5LCB0aGVuIHRoaXMgdmFsdWUgaXNcbiAgICAgKiBvdmVycmlkZGVuXG4gICAgICogQHBhcmFtIGtleSB0aGUga2V5XG4gICAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gICAgICovXG4gICAgcHVibGljIHNldChrZXk6IEssIHZhbHVlOiBWKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLnRvSW50ZXJuYWxLZXkoa2V5KV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgYWxsIHZhbHVlcyBmcm9tIHRoZSBtYXBcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9JbnRlcm5hbEtleShrZXk6IEspOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYEAke2tleX1gO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vdXRpbC9zaW1wbGUtbWFwLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL3NpbXBsZS1tYXAudHMiLCJpbXBvcnQge0Jyb3dzZXJXb3JrZXJTbGF2ZX0gZnJvbSBcIi4vYnJvd3Nlci13b3JrZXItc2xhdmVcIjtcbmltcG9ydCB7U2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlfSBmcm9tIFwiLi4vLi4vY29tbW9uL2Z1bmN0aW9uL3NsYXZlLWZ1bmN0aW9uLWxvb2t1cC10YWJsZVwiO1xuaW1wb3J0IHtyZWdpc3RlclN0YXRpY1BhcmFsbGVsRnVuY3Rpb25zfSBmcm9tIFwiLi4vLi4vY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnNcIjtcblxuY29uc3Qgc2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlID0gbmV3IFNsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZSgpO1xucmVnaXN0ZXJTdGF0aWNQYXJhbGxlbEZ1bmN0aW9ucyhzbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUpO1xuXG4vKiogQHByZXNlcnZlIFdPUktFUl9TTEFWRV9TVEFUSUNfRlVOQ1RJT05TX1BMQUNFSE9MREVSICovXG5cbmNvbnN0IHNsYXZlID0gbmV3IEJyb3dzZXJXb3JrZXJTbGF2ZShzbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUpO1xub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIHNsYXZlLm9uTWVzc2FnZS5hcHBseShzbGF2ZSwgYXJndW1lbnRzKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvYnJvd3Nlci93b3JrZXItc2xhdmUvaW5kZXgudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvYnJvd3Nlci93b3JrZXItc2xhdmUvaW5kZXgudHMiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcbmltcG9ydCB7SU1hbmRlbGJyb3RPcHRpb25zfSBmcm9tIFwiLi4vZHluYW1pYy9tYW5kZWxicm90XCI7XG5cbmludGVyZmFjZSBJQ29tcGxleE51bWJlciB7XG4gICAgaTogbnVtYmVyO1xuICAgIHJlYWw6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hbmRlbGJyb3QoeyBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgaXRlcmF0aW9ucyB9OiBJTWFuZGVsYnJvdE9wdGlvbnMsIG9wdGlvbnM/OiBJUGFyYWxsZWxPcHRpb25zKSB7XG4gICAgLy8gWCBheGlzIHNob3dzIHJlYWwgbnVtYmVycywgeSBheGlzIGltYWdpbmFyeVxuICAgIGNvbnN0IG1pbiA9IHsgaTogLTEuMiwgcmVhbDogLTIuMCB9O1xuICAgIGNvbnN0IG1heCA9IHsgaTogMCwgcmVhbDogMS4wIH07XG4gICAgbWF4LmkgPSBtaW4uaSArIChtYXgucmVhbCAtIG1pbi5yZWFsKSAqIGltYWdlSGVpZ2h0IC8gaW1hZ2VXaWR0aDtcblxuICAgIGNvbnN0IHNjYWxpbmdGYWN0b3IgPSB7XG4gICAgICAgIGk6IChtYXguaSAtIG1pbi5pKSAvIChpbWFnZUhlaWdodCAtIDEpLFxuICAgICAgICByZWFsOiAobWF4LnJlYWwgLSBtaW4ucmVhbCkgLyAoaW1hZ2VXaWR0aCAtIDEpXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVooYzogSUNvbXBsZXhOdW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB6ID0geyBpOiBjLmksIHJlYWw6IGMucmVhbCB9O1xuICAgICAgICBsZXQgbiA9IDA7XG5cbiAgICAgICAgZm9yICg7IG4gPCBpdGVyYXRpb25zOyArK24pIHtcbiAgICAgICAgICAgIGlmICh6LnJlYWwgKiB6LnJlYWwgKyB6LmkgKiB6LmkgPiA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHogKiogMiArIGNcbiAgICAgICAgICAgIGNvbnN0IHpJID0gei5pO1xuICAgICAgICAgICAgei5pID0gMiAqIHoucmVhbCAqIHouaSArIGMuaTtcbiAgICAgICAgICAgIHoucmVhbCA9IHoucmVhbCAqIHoucmVhbCAtIHpJICogekkgKyBjLnJlYWw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYWxsZWxcbiAgICAgICAgLnJhbmdlKDAsIGltYWdlSGVpZ2h0LCAxLCBvcHRpb25zKVxuICAgICAgICAubWFwKHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShpbWFnZVdpZHRoICogNCk7XG4gICAgICAgICAgICBjb25zdCBjSSA9IG1heC5pIC0geSAqIHNjYWxpbmdGYWN0b3IuaTtcblxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBpbWFnZVdpZHRoOyArK3gpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0ge1xuICAgICAgICAgICAgICAgICAgICBpOiBjSSxcbiAgICAgICAgICAgICAgICAgICAgcmVhbDogbWluLnJlYWwgKyB4ICogc2NhbGluZ0ZhY3Rvci5yZWFsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG4gPSBjYWxjdWxhdGVaKGMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2UgPSB4ICogNDtcbiAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXG4gICAgICAgICAgICAgICAgbGluZVtiYXNlXSA9IG4gJiAweEZGO1xuICAgICAgICAgICAgICAgIGxpbmVbYmFzZSArIDFdID0gbiAmIDB4RkYwMDtcbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2UgKyAyXSA9IG4gJiAweEZGMDAwMDtcbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2UgKyAzXSA9IDI1NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaW5lO1xuICAgICAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90cmFuc3BpbGVkL21hbmRlbGJyb3QudHMiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ29vcmRpbmF0ZSB7XG4gICAgcmVhZG9ubHkgeDogbnVtYmVyO1xuICAgIHJlYWRvbmx5IHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJS25pZ2h0VG91ckVudmlyb25tZW50IHtcbiAgICBib2FyZFNpemU6IG51bWJlcjtcbiAgICBib2FyZDogbnVtYmVyW107XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVudmlyb25tZW50KGJvYXJkU2l6ZTogbnVtYmVyKTogSUtuaWdodFRvdXJFbnZpcm9ubWVudCB7XG4gICAgY29uc3QgYm9hcmQ6IG51bWJlcltdID0gbmV3IEFycmF5KGJvYXJkU2l6ZSAqIGJvYXJkU2l6ZSk7XG4gICAgYm9hcmQuZmlsbCgwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBib2FyZCxcbiAgICAgICAgYm9hcmRTaXplXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtuaWdodFRvdXJzKHN0YXJ0UGF0aDogSUNvb3JkaW5hdGVbXSwgZW52aXJvbm1lbnQ6IElLbmlnaHRUb3VyRW52aXJvbm1lbnQpOiBudW1iZXIge1xuICAgIGNvbnN0IG1vdmVzID0gW1xuICAgICAgICB7IHg6IC0yLCB5OiAtMSB9LCB7IHg6IC0yLCB5OiAxfSwgeyB4OiAtMSwgeTogLTIgfSwgeyB4OiAtMSwgeTogMiB9LFxuICAgICAgICB7IHg6IDEsIHk6IC0yIH0sIHsgeDogMSwgeTogMn0sIHsgeDogMiwgeTogLTEgfSwgeyB4OiAyLCB5OiAxIH1cbiAgICBdO1xuICAgIGNvbnN0IGJvYXJkU2l6ZSA9IGVudmlyb25tZW50LmJvYXJkU2l6ZTtcbiAgICBjb25zdCBib2FyZCA9IGVudmlyb25tZW50LmJvYXJkO1xuICAgIGNvbnN0IG51bWJlck9mRmllbGRzID0gYm9hcmRTaXplICogYm9hcmRTaXplO1xuICAgIGxldCByZXN1bHRzOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiB7IGNvb3JkaW5hdGU6IElDb29yZGluYXRlLCBuOiBudW1iZXIgfVtdID0gc3RhcnRQYXRoLm1hcCgocG9zLCBpbmRleCkgPT4gKHsgY29vcmRpbmF0ZTogcG9zLCBuOiBpbmRleCArIDEgfSkpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0UGF0aC5sZW5ndGggLSAxOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBzdGFydFBhdGhbaW5kZXhdLnggKiBib2FyZFNpemUgKyBzdGFydFBhdGhbaW5kZXhdLnk7XG4gICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZSwgbiB9ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBjb29yZGluYXRlLnggKiBib2FyZFNpemUgKyBjb29yZGluYXRlLnk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2ZpZWxkSW5kZXhdICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBiYWNrIHRyYWNraW5nXG4gICAgICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IDA7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW50cnlcbiAgICAgICAgaWYgKG4gPT09IG51bWJlck9mRmllbGRzKSB7XG4gICAgICAgICAgICArK3Jlc3VsdHM7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBuITtcblxuICAgICAgICBmb3IgKGNvbnN0IG1vdmUgb2YgbW92ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NvciA9IHsgeDogY29vcmRpbmF0ZS54ICsgbW92ZS54LCB5OiBjb29yZGluYXRlLnkgKyBtb3ZlLnkgfTtcbiAgICAgICAgICAgIC8vIG5vdCBvdXRzaWRlIG9mIGJvYXJkIGFuZCBub3QgeWV0IGFjY2Vzc2VkXG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NpYmxlID0gc3VjY2Vzc29yLnggPj0gMCAmJiBzdWNjZXNzb3IueSA+PSAwICYmIHN1Y2Nlc3Nvci54IDwgYm9hcmRTaXplICYmICBzdWNjZXNzb3IueSA8IGJvYXJkU2l6ZSAmJiBib2FyZFtzdWNjZXNzb3IueCAqIGJvYXJkU2l6ZSArIHN1Y2Nlc3Nvci55XSA9PT0gMDtcblxuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHsgY29vcmRpbmF0ZTogc3VjY2Vzc29yLCBuOiBuICsgMSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY0tuaWdodFRvdXJzKHN0YXJ0OiBJQ29vcmRpbmF0ZSwgYm9hcmRTaXplOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gY3JlYXRlRW52aXJvbm1lbnQoYm9hcmRTaXplKTtcbiAgICByZXR1cm4ga25pZ2h0VG91cnMoW3N0YXJ0XSwgZW52aXJvbm1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxLbmlnaHRUb3VycyhzdGFydDogSUNvb3JkaW5hdGUsIGJvYXJkU2l6ZTogbnVtYmVyLCBvcHRpb25zPzogSVBhcmFsbGVsT3B0aW9ucyk6IFByb21pc2VMaWtlPG51bWJlcj4ge1xuXG4gICAgZnVuY3Rpb24gc3VjY2Vzc29ycyhjb29yZGluYXRlOiBJQ29vcmRpbmF0ZSkge1xuICAgICAgICBjb25zdCBtb3ZlcyA9IFtcbiAgICAgICAgICAgIHt4OiAtMiwgeTogLTF9LCB7eDogLTIsIHk6IDF9LCB7eDogLTEsIHk6IC0yfSwge3g6IC0xLCB5OiAyfSxcbiAgICAgICAgICAgIHt4OiAxLCB5OiAtMn0sIHt4OiAxLCB5OiAyfSwge3g6IDIsIHk6IC0xfSwge3g6IDIsIHk6IDF9XG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgbW92ZSBvZiBtb3Zlcykge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc29yID0ge3g6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55fTtcbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc2libGUgPSBzdWNjZXNzb3IueCA+PSAwICYmIHN1Y2Nlc3Nvci55ID49IDAgJiYgc3VjY2Vzc29yLnggPCBib2FyZFNpemUgJiYgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiZcbiAgICAgICAgICAgICAgICAoc3VjY2Vzc29yLnggIT09IHN0YXJ0LnggfHwgc3VjY2Vzc29yLnkgIT09IHN0YXJ0LnkpICYmIChzdWNjZXNzb3IueCAhPT0gY29vcmRpbmF0ZS54ICYmIHN1Y2Nlc3Nvci55ICE9PSBjb29yZGluYXRlLnkpO1xuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChzdWNjZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlU3RhcnRGaWVsZHMoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoc3RhcnQpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGluZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoZGlyZWN0U3VjY2Vzc29yKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFtzdGFydCwgZGlyZWN0U3VjY2Vzc29yLCBpbmRpcmVjdFN1Y2Nlc3Nvcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBsZXQgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5mcm9tKGNvbXB1dGVTdGFydEZpZWxkcygpLCBvcHRpb25zKVxuICAgICAgICAuaW5FbnZpcm9ubWVudChjcmVhdGVFbnZpcm9ubWVudCwgYm9hcmRTaXplKVxuICAgICAgICAubWFwPG51bWJlcj4oa25pZ2h0VG91cnMpXG4gICAgICAgIC5yZWR1Y2UoMCwgKG1lbW8sIGNvdW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbWVtbyArIGNvdW50O1xuICAgICAgICB9KVxuICAgICAgICAuc3Vic2NyaWJlKHN1YlJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0b3VycyBvZiBzdWJSZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgKz0gdG91cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1jb25zb2xlICovXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0b3RhbCAvIChwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0VGltZSkgKiAxMDAwfSByZXN1bHRzIHBlciBzZWNvbmRgKTtcbiAgICAgICAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdHJhbnNwaWxlZC9rbmlnaHRzLXRvdXIudHMiLCJpbXBvcnQgcGFyYWxsZWwgZnJvbSBcInBhcmFsbGVsLWVzXCI7XG5pbXBvcnQge0RpY3Rpb25hcnl9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBSYW5kb20gZnJvbSBcInNpbWpzLXJhbmRvbVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0IHtcbiAgICBzdGFydFllYXI6IG51bWJlcjtcbiAgICB0b3RhbEFtb3VudDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUJ1Y2tldCB7XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG5cbiAgICBzdWJCdWNrZXRzOiB7IFtncm91cE5hbWU6IHN0cmluZ106IHsgZ3JvdXA6IHN0cmluZzsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyIH0gfTtcbn1cblxuaW50ZXJmYWNlIElHcm91cCB7XG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBuYW1lIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGdyb3VwXG4gICAgICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBhIHNlcGFyYXRvciBsaW5lIGJlZW4gZHJhd24gZm9yIHRoaXMgZ3JvdXA/XG4gICAgICovXG4gICAgc2VwYXJhdG9yOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIHBlcmNlbnRhZ2Ugb2YgdmFsdWVzIGluIHRoaXMgZ3JvdXAgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBzaW11bGF0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgcGVyY2VudGFnZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1pbmltdW0gdmFsdWUgdGhhdCBpcyBzdGlsbCBwYXJ0IG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBmcm9tPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBtYXhpbXVtIHZhbHVlIChleGNsdXNpdmUpIHRoYXQgZGVmaW5lcyB0aGUgdXBwZXIgZW5kIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICB0bz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUHJvamVjdFJlc3VsdCB7XG4gICAgLyoqXG4gICAgICogVGhlIG1pbmltYWwgc2ltdWxhdGVkIHZhbHVlIGZvciB0aGlzIHByb2plY3RcbiAgICAgKi9cbiAgICBtaW46IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW1hbCBzaW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBtYXg6IG51bWJlcjtcblxuICAgIC8qKiBUaGUgbWVkaWFuIG9mIHRoZSB2YWx1ZXMgZm91bmQgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1lZGlhbjogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB3aGVyZSB0aGUgMi8zIG9mIHRoZSBzaW11bGF0ZWQgdmFsdWVzIHN0YXJ0IC8gZW5kLlxuICAgICAqL1xuICAgIHR3b1RoaXJkOiB7XG4gICAgICAgIG1pbjogbnVtYmVyO1xuICAgICAgICBtYXg6IG51bWJlcjtcbiAgICB9O1xuXG4gICAgYnVja2V0czogSUJ1Y2tldFtdO1xuXG4gICAgZ3JvdXBzOiBJR3JvdXBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9qZWN0XG4gICAgICovXG4gICAgcHJvamVjdDogSVByb2plY3Q7XG59XG5cbmludGVyZmFjZSBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT47XG4gICAgc2ltdWxhdGVkVmFsdWVzOiBudW1iZXJbXVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzPzogbnVtYmVyO1xuICAgIG51bVJ1bnM/OiBudW1iZXI7XG4gICAgcHJvamVjdHM/OiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ/OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U/OiBudW1iZXI7XG4gICAgc2VlZD86IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5PzogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBwcm9qZWN0czogSVByb2plY3RbXTtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U6IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHRhc2tJbmRleD86IG51bWJlcjtcbiAgICB2YWx1ZXNQZXJXb3JrZXI/OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgdm9sYXRpbGl0eTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogMTAwMDAwMCxcbiAgICAgICAgbGlxdWlkaXR5OiAxMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAsXG4gICAgICAgIG51bVllYXJzOiAxMCxcbiAgICAgICAgcGVyZm9ybWFuY2U6IDAsXG4gICAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgICAgc2VlZDogdW5kZWZpbmVkLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjAxXG4gICAgfSwgb3B0aW9ucyk7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50KG9wdGlvbnM6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElNb250ZUNhcmxvRW52aXJvbm1lbnQge1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdHNUb0Nhc2hGbG93cyhwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+LCBudW1ZZWFyczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNhc2hGbG93czogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBudW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0c0J5VGhpc1llYXIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3llYXJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgY2FzaEZsb3cgPSAtcHJvamVjdHNCeVRoaXNZZWFyLnJlZHVjZSgobWVtbywgcHJvamVjdCkgPT4gbWVtbyArIHByb2plY3QudG90YWxBbW91bnQsIDApO1xuICAgICAgICAgICAgY2FzaEZsb3dzLnB1c2goY2FzaEZsb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYXNoRmxvd3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCBudW1ZZWFyczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBpbnZlc3RtZW50QW1vdW50TGVmdCA9IGludmVzdG1lbnRBbW91bnQ7XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgaW52ZXN0bWVudEFtb3VudExlZnQgPSBpbnZlc3RtZW50QW1vdW50TGVmdCArIGNhc2hGbG93c1t5ZWFyXTtcbiAgICAgICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLnB1c2goaW52ZXN0bWVudEFtb3VudExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub0ludGVyZXN0UmVmZXJlbmNlTGluZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0Fic29sdXRlSW5kaWNlcyhpbmRpY2VzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCBjYXNoRmxvd3M6IG51bWJlcltdKSB7XG4gICAgICAgIGxldCBjdXJyZW50UG9ydGZvbGlvVmFsdWUgPSBpbnZlc3RtZW50QW1vdW50O1xuICAgICAgICBsZXQgcHJldmlvdXNZZWFySW5kZXggPSAxMDA7XG5cbiAgICAgICAgZm9yIChsZXQgcmVsYXRpdmVZZWFyID0gMDsgcmVsYXRpdmVZZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsrcmVsYXRpdmVZZWFyKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhckluZGV4ID0gaW5kaWNlc1tyZWxhdGl2ZVllYXJdO1xuICAgICAgICAgICAgY29uc3QgY2FzaEZsb3dTdGFydE9mWWVhciA9IHJlbGF0aXZlWWVhciA9PT0gMCA/IDAgOiBjYXNoRmxvd3NbcmVsYXRpdmVZZWFyIC0gMV07XG5cbiAgICAgICAgICAgIC8vIHNjYWxlIGN1cnJlbnQgdmFsdWUgd2l0aCBwZXJmb3JtYW5jZSBnYWluIGFjY29yZGluZyB0byBpbmRleFxuICAgICAgICAgICAgY29uc3QgcGVyZm9ybWFuY2UgPSBjdXJyZW50WWVhckluZGV4IC8gcHJldmlvdXNZZWFySW5kZXg7XG4gICAgICAgICAgICBjdXJyZW50UG9ydGZvbGlvVmFsdWUgPSAoY3VycmVudFBvcnRmb2xpb1ZhbHVlICsgY2FzaEZsb3dTdGFydE9mWWVhcikgKiBwZXJmb3JtYW5jZTtcblxuICAgICAgICAgICAgaW5kaWNlc1tyZWxhdGl2ZVllYXJdID0gTWF0aC5yb3VuZChjdXJyZW50UG9ydGZvbGlvVmFsdWUpO1xuICAgICAgICAgICAgcHJldmlvdXNZZWFySW5kZXggPSBjdXJyZW50WWVhckluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGljZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgdGhlIG1vbnRlIGNhcmxvIHNpbXVsYXRpb24gZm9yIGFsbCB5ZWFycyBhbmQgbnVtIHJ1bnMuXG4gICAgICogQHBhcmFtIGNhc2hGbG93cyB0aGUgY2FzaCBmbG93c1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXVtdfSB0aGUgc2ltdWxhdGVkIG91dGNvbWVzIGdyb3VwZWQgYnkgeWVhclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNpbXVsYXRlT3V0Y29tZXMoY2FzaEZsb3dzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCB7IG51bVJ1bnMsIG51bVllYXJzLCB2b2xhdGlsaXR5LCBwZXJmb3JtYW5jZSB9OiB7IG51bVJ1bnM6IG51bWJlciwgbnVtWWVhcnM6IG51bWJlciwgdm9sYXRpbGl0eTogbnVtYmVyLCBwZXJmb3JtYW5jZTogbnVtYmVyfSk6IG51bWJlcltdW10gIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG51bVllYXJzKTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPD0gbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgcmVzdWx0W3llYXJdID0gbmV3IEFycmF5KG51bVJ1bnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmFuZG9tID0gbmV3IFJhbmRvbSgxMCk7XG4gICAgICAgIGZvciAobGV0IHJ1biA9IDA7IHJ1biA8IG51bVJ1bnM7IHJ1bisrKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzID0gWzEwMF07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bVllYXJzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21QZXJmb3JtYW5jZSA9IDEgKyByYW5kb20ubm9ybWFsKHBlcmZvcm1hbmNlLCB2b2xhdGlsaXR5KTtcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kaWNlc1tpIC0gMV0gKiByYW5kb21QZXJmb3JtYW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdGhlIHJlbGF0aXZlIHZhbHVlcyBmcm9tIGFib3ZlIHRvIGFic29sdXRlIHZhbHVlcy5cbiAgICAgICAgICAgIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXMsIGludmVzdG1lbnRBbW91bnQsIGNhc2hGbG93cyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsreWVhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdFt5ZWFyXVtydW5dID0gaW5kaWNlc1t5ZWFyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGV0IHByb2plY3RzVG9TaW11bGF0ZTogSVByb2plY3RbXSA9IG9wdGlvbnMucHJvamVjdHM7XG5cbiAgICBpZiAob3B0aW9ucy50YXNrSW5kZXggJiYgb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIpIHtcbiAgICAgICAgcHJvamVjdHNUb1NpbXVsYXRlID0gb3B0aW9ucy5wcm9qZWN0cy5zbGljZShvcHRpb25zLnRhc2tJbmRleCAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyLCAob3B0aW9ucy50YXNrSW5kZXggKyAxKSAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9qZWN0cyA9IG9wdGlvbnMucHJvamVjdHMuc29ydCgoYSwgYikgPT4gYS5zdGFydFllYXIgLSBiLnN0YXJ0WWVhcik7XG5cbiAgICAvLyBHcm91cCBwcm9qZWN0cyBieSBzdGFydFllYXIsIHVzZSBsb2Rhc2ggZ3JvdXBCeSBpbnN0ZWFkXG4gICAgY29uc3QgcHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICBjb25zdCBhcnIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXSA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdIHx8IFtdO1xuICAgICAgICBhcnIucHVzaChwcm9qZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBjYXNoRmxvd3MgPSBwcm9qZWN0c1RvQ2FzaEZsb3dzKHByb2plY3RzQnlTdGFydFllYXIsIG9wdGlvbnMubnVtWWVhcnMpO1xuICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lID0gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzLCBvcHRpb25zLmludmVzdG1lbnRBbW91bnQsIG9wdGlvbnMubnVtWWVhcnMpO1xuXG4gICAgY29uc3QgbnVtWWVhcnMgPSBwcm9qZWN0c1RvU2ltdWxhdGUucmVkdWNlKChtZW1vLCBwcm9qZWN0KSA9PiBNYXRoLm1heChtZW1vLCBwcm9qZWN0LnN0YXJ0WWVhciksIDApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LFxuICAgICAgICBsaXF1aWRpdHk6IG9wdGlvbnMubGlxdWlkaXR5LFxuICAgICAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZSxcbiAgICAgICAgbnVtUnVuczogb3B0aW9ucy5udW1SdW5zLFxuICAgICAgICBudW1ZZWFycyxcbiAgICAgICAgcHJvamVjdHNCeVN0YXJ0WWVhcixcbiAgICAgICAgc2ltdWxhdGVkVmFsdWVzOiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93cywgb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LCBvcHRpb25zKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdyb3VwRm9yVmFsdWUodmFsdWU6IG51bWJlciwgZ3JvdXBzOiBJR3JvdXBbXSk6IElHcm91cCB7XG4gICAgcmV0dXJuIGdyb3Vwcy5maW5kKGdyb3VwID0+ICh0eXBlb2YgZ3JvdXAuZnJvbSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBncm91cC5mcm9tIDw9IHZhbHVlKSAmJiAodHlwZW9mIGdyb3VwLnRvID09PSBcInVuZGVmaW5lZFwiIHx8IGdyb3VwLnRvID4gdmFsdWUpKSE7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdyb3VwcyhyZXF1aXJlZEFtb3VudDogbnVtYmVyLCBub0ludGVyZXN0UmVmZXJlbmNlOiBudW1iZXIsIGxpcXVpZGl0eTogbnVtYmVyKTogSUdyb3VwW10ge1xuICAgIHJldHVybiBbXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwiWmllbCBlcnJlaWNoYmFyXCIsIGZyb206IHJlcXVpcmVkQW1vdW50LCBuYW1lOiBcImdyZWVuXCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZX0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibWl0IFp1c2F0emxpcXVpZGl0w6R0IGVycmVpY2hiYXJcIiwgZnJvbTogcmVxdWlyZWRBbW91bnQgLSBsaXF1aWRpdHksIG5hbWU6IFwieWVsbG93XCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZSwgdG86IHJlcXVpcmVkQW1vdW50IH0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhclwiLCBmcm9tOiBub0ludGVyZXN0UmVmZXJlbmNlLCBuYW1lOiBcImdyYXlcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IHJlcXVpcmVkQW1vdW50IC0gbGlxdWlkaXR5IH0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhciwgbWl0IFZlcmx1c3RcIiwgbmFtZTogXCJyZWRcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IG5vSW50ZXJlc3RSZWZlcmVuY2UgfVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KHByb2plY3Q6IElQcm9qZWN0LCBwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+KSB7XG4gICAgbGV0IGFtb3VudCA9IHByb2plY3QudG90YWxBbW91bnQ7XG4gICAgY29uc3QgcHJvamVjdHNTYW1lWWVhciA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdO1xuXG4gICAgZm9yIChjb25zdCBvdGhlclByb2plY3Qgb2YgcHJvamVjdHNTYW1lWWVhcikge1xuICAgICAgICBpZiAob3RoZXJQcm9qZWN0ID09PSBwcm9qZWN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhbW91bnQgKz0gb3RoZXJQcm9qZWN0LnRvdGFsQW1vdW50O1xuICAgIH1cbiAgICByZXR1cm4gYW1vdW50O1xufVxuXG5mdW5jdGlvbiBtZWRpYW4odmFsdWVzOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IGhhbGYgPSBNYXRoLmZsb29yKHZhbHVlcy5sZW5ndGggLyAyKTtcblxuICAgIGlmICh2YWx1ZXMubGVuZ3RoICUgMikge1xuICAgICAgICByZXR1cm4gdmFsdWVzW2hhbGZdO1xuICAgIH1cblxuICAgIHJldHVybiAodmFsdWVzW2hhbGYgLSAxXSArIHZhbHVlc1toYWxmXSkgLyAyLjA7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVByb2plY3QocHJvamVjdDogSVByb2plY3QsIGVudmlyb25tZW50OiBJTW9udGVDYXJsb0Vudmlyb25tZW50KTogSVByb2plY3RSZXN1bHQge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9CVUNLRVRTID0gMTA7XG5cbiAgICBjb25zdCByZXF1aXJlZEFtb3VudCA9IGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KHByb2plY3QsIGVudmlyb25tZW50LnByb2plY3RzQnlTdGFydFllYXIpO1xuICAgIGNvbnN0IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyID0gZW52aXJvbm1lbnQuc2ltdWxhdGVkVmFsdWVzW3Byb2plY3Quc3RhcnRZZWFyXTtcbiAgICBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBncm91cHMgPSBjcmVhdGVHcm91cHMocmVxdWlyZWRBbW91bnQsIGVudmlyb25tZW50Lm5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lW3Byb2plY3Quc3RhcnRZZWFyXSwgZW52aXJvbm1lbnQubGlxdWlkaXR5KTtcbiAgICBjb25zdCB2YWx1ZXNCeUdyb3VwOiB7IFtncm91cE5hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gICAgY29uc3QgYnVja2V0U2l6ZSA9IE1hdGgucm91bmQoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC8gTlVNQkVSX09GX0JVQ0tFVFMpO1xuICAgIGNvbnN0IGJ1Y2tldHM6IElCdWNrZXRbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGg7IGkgKz0gYnVja2V0U2l6ZSkge1xuICAgICAgICBjb25zdCBidWNrZXQ6IElCdWNrZXQgPSB7XG4gICAgICAgICAgICBtYXg6IE51bWJlci5NSU5fVkFMVUUsXG4gICAgICAgICAgICBtaW46IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgICBzdWJCdWNrZXRzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIGJ1Y2tldFNpemU7ICsraikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltqXTtcbiAgICAgICAgICAgIGJ1Y2tldC5taW4gPSBNYXRoLm1pbihidWNrZXQubWluLCB2YWx1ZSk7XG4gICAgICAgICAgICBidWNrZXQubWF4ID0gTWF0aC5tYXgoYnVja2V0Lm1heCwgdmFsdWUpO1xuXG4gICAgICAgICAgICBjb25zdCBncm91cCA9IGdyb3VwRm9yVmFsdWUoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbal0sIGdyb3Vwcyk7XG4gICAgICAgICAgICB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdID0gKHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICAgICAgY29uc3Qgc3ViQnVja2V0ID0gYnVja2V0LnN1YkJ1Y2tldHNbZ3JvdXAubmFtZV0gPSBidWNrZXQuc3ViQnVja2V0c1tncm91cC5uYW1lXSB8fCB7IGdyb3VwOiBncm91cC5uYW1lLCBtYXg6IE51bWJlci5NSU5fVkFMVUUsIG1pbjogTnVtYmVyLk1BWF9WQUxVRSB9O1xuICAgICAgICAgICAgc3ViQnVja2V0Lm1pbiA9IE1hdGgubWluKHN1YkJ1Y2tldC5taW4sIHZhbHVlKTtcbiAgICAgICAgICAgIHN1YkJ1Y2tldC5tYXggPSBNYXRoLm1heChzdWJCdWNrZXQubWF4LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBidWNrZXRzLnB1c2goYnVja2V0KTtcbiAgICB9XG5cbiAgICBjb25zdCBub25FbXB0eUdyb3VwcyA9IGdyb3Vwcy5maWx0ZXIoZ3JvdXAgPT4gISF2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdKTtcbiAgICBub25FbXB0eUdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IGdyb3VwLnBlcmNlbnRhZ2UgPSB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdIC8gc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoKTtcblxuICAgIGNvbnN0IG9uZVNpeHRoID0gTWF0aC5yb3VuZChzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLyA2KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBidWNrZXRzLFxuICAgICAgICBncm91cHM6IG5vbkVtcHR5R3JvdXBzLFxuICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIDFdLFxuICAgICAgICBtZWRpYW46IG1lZGlhbihzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhciksXG4gICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbMF0sXG4gICAgICAgIHByb2plY3QsXG4gICAgICAgIHR3b1RoaXJkOiB7XG4gICAgICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIG9uZVNpeHRoXSxcbiAgICAgICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbb25lU2l4dGhdXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY01vbnRlQ2FybG8ob3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKSk7XG5cbiAgICBsZXQgcHJvamVjdHM6IElQcm9qZWN0UmVzdWx0W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHByb2plY3Qgb2Ygb3B0aW9ucyEucHJvamVjdHMhKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goY2FsY3VsYXRlUHJvamVjdChwcm9qZWN0LCBlbnZpcm9ubWVudCkpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9qZWN0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsTW9udGVDYXJsbyh1c2VyT3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gaW5pdGlhbGl6ZU9wdGlvbnModXNlck9wdGlvbnMpO1xuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAuZnJvbShvcHRpb25zLnByb2plY3RzLCB7IG1pblZhbHVlc1BlclRhc2s6IDIgfSlcbiAgICAgICAgLmluRW52aXJvbm1lbnQoY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50LCBvcHRpb25zKVxuICAgICAgICAubWFwKGNhbGN1bGF0ZVByb2plY3QpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RyYW5zcGlsZWQvbW9udGUtY2FybG8udHMiXSwic291cmNlUm9vdCI6IiJ9