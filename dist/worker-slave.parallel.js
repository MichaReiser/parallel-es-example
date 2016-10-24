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
    /* harmony export (immutable) */exports["e"] = workerResultMessage;
    /* harmony export (immutable) */exports["f"] = functionExecutionError;
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
        return { functions: functions, type: WorkerMessageType.FunctionResponse };
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
                    this.slave.postMessage(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["e" /* workerResultMessage */])(result));
                } catch (error) {
                    this.slave.postMessage(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__common_worker_worker_messages__["f" /* functionExecutionError */])(error));
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
                    for (var _len2 = arguments.length, additionalParams = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                        additionalParams[_key2] = arguments[_key2];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDIzODFkMDA4YzNkNDRkYjVmMGYiLCJ3ZWJwYWNrOi8vLy4vfi9zaW1qcy1yYW5kb20vc2ltanMtcmFuZG9tLmpzIiwid2VicGFjazovLy8uL3dlYnBhY2s6L3dlYnBhY2svYm9vdHN0cmFwIGJmMTlkMDI5MmNmODdlMDc5ZDVkIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vdXRpbC9hcnJheXMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9mdW5jdGlvbi9zZXJpYWxpemVkLWZ1bmN0aW9uLWNhbGwudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9icm93c2VyLXdvcmtlci1zbGF2ZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL3NsYXZlLWZ1bmN0aW9uLWxvb2t1cC10YWJsZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLXN0YXRlcy50cyIsIndlYnBhY2s6Ly8vd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWNhbGwtZGVzZXJpYWxpemVyLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24taWQudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9maWx0ZXItaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9tYXAtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC1qb2ItZXhlY3V0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9wYXJhbGxlbC13b3JrZXItZnVuY3Rpb25zLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcmFuZ2UtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yZWR1Y2UtaXRlcmF0b3IudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL2lkZW50aXR5LnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9jb21tb24vdXRpbC9zaW1wbGUtbWFwLnRzIiwid2VicGFjazovLy93ZWJwYWNrOi8vL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhbnNwaWxlZC9tYW5kZWxicm90LnRzIiwid2VicGFjazovLy8uL3NyYy90cmFuc3BpbGVkL2tuaWdodHMtdG91ci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHJhbnNwaWxlZC9tb250ZS1jYXJsby50cyJdLCJuYW1lcyI6WyJpbnN0YWxsZWRNb2R1bGVzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiZXhwb3J0cyIsIm1vZHVsZSIsImkiLCJsIiwibW9kdWxlcyIsImNhbGwiLCJtIiwiYyIsInZhbHVlIiwiZCIsIm5hbWUiLCJnZXR0ZXIiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImVudW1lcmFibGUiLCJnZXQiLCJuIiwiX19lc01vZHVsZSIsImdldERlZmF1bHQiLCJnZXRNb2R1bGVFeHBvcnRzIiwibyIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsInRvSXRlcmF0b3IiLCJkYXRhIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJ0b0FycmF5IiwicmVzdWx0IiwiY3VycmVudCIsIm5leHQiLCJkb25lIiwicHVzaCIsImZsYXR0ZW5BcnJheSIsImRlZXBBcnJheSIsImxlbmd0aCIsImhlYWQiLCJ0YWlsIiwiQXJyYXkiLCJjb25jYXQiLCJhcHBseSIsImlzU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCIsInBvdGVudGlhbEZ1bmMiLCJfX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsIiwiaXNTdG9wTWVzc3NhZ2UiLCJXb3JrZXJNZXNzYWdlVHlwZSIsImluaXRpYWxpemVXb3JrZXJNZXNzYWdlIiwiaWQiLCJ0eXBlIiwiSW5pdGlhbGl6ZVdvcmtlciIsIndvcmtlcklkIiwic2NoZWR1bGVUYXNrTWVzc2FnZSIsInRhc2siLCJTY2hlZHVsZVRhc2siLCJyZXF1ZXN0RnVuY3Rpb25NZXNzYWdlIiwiZnVuY3Rpb25JZCIsIm90aGVyRnVuY3Rpb25JZHMiLCJmdW5jdGlvbklkcyIsIkZ1bmN0aW9uUmVxdWVzdCIsImZ1bmN0aW9uUmVzcG9uc2VNZXNzYWdlIiwiZnVuY3Rpb25zIiwiRnVuY3Rpb25SZXNwb25zZSIsIndvcmtlclJlc3VsdE1lc3NhZ2UiLCJXb3JrZXJSZXN1bHQiLCJmdW5jdGlvbkV4ZWN1dGlvbkVycm9yIiwiZXJyb3IiLCJlcnJvck9iamVjdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJwcm9wIiwiSlNPTiIsInN0cmluZ2lmeSIsIkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3IiLCJzdG9wTWVzc2FnZSIsIlN0b3AiLCJpc1NjaGVkdWxlVGFzayIsIm1lc3NhZ2UiLCJpc0luaXRpYWxpemVNZXNzYWdlIiwiaXNGdW5jdGlvblJlcXVlc3QiLCJpc0Z1bmN0aW9uUmVzcG9uc2UiLCJpc1dvcmtlclJlc3VsdCIsImlzRnVuY3Rpb25FeGVjdXRpb25FcnJvciIsIkJyb3dzZXJXb3JrZXJTbGF2ZSIsImZ1bmN0aW9uQ2FjaGUiLCJOdW1iZXIiLCJOYU4iLCJzdGF0ZSIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fYnJvd3Nlcl93b3JrZXJfc2xhdmVfc3RhdGVzX18iLCJlbnRlciIsImV2ZW50IiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19jb21tb25fd29ya2VyX3dvcmtlcl9tZXNzYWdlc19fIiwiY2xvc2UiLCJvbk1lc3NhZ2UiLCJFcnJvciIsInBvc3RNZXNzYWdlIiwiU2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlIiwiY2FjaGUiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX3V0aWxfc2ltcGxlX21hcF9fIiwiaWRlbnRpZmllciIsImRlZmluaXRpb24iLCJmIiwiRnVuY3Rpb24iLCJhcmd1bWVudE5hbWVzIiwiYm9keSIsInNldCIsImZ1bmMiLCJoYXMiLCJyZWdpc3RlclN0YXRpY1BhcmFsbGVsRnVuY3Rpb25zIiwibG9va3VwVGFibGUiLCJyZWdpc3RlclN0YXRpY0Z1bmN0aW9uIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19wYXJhbGxlbF93b3JrZXJfZnVuY3Rpb25zX18iLCJJREVOVElUWSIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fdXRpbF9pZGVudGl0eV9fIiwiRklMVEVSIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8yX19maWx0ZXJfaXRlcmF0b3JfXyIsIk1BUCIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfM19fbWFwX2l0ZXJhdG9yX18iLCJQQVJBTExFTF9KT0JfRVhFQ1VUT1IiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzRfX3BhcmFsbGVsX2pvYl9leGVjdXRvcl9fIiwiUkFOR0UiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzVfX3JhbmdlX2l0ZXJhdG9yX18iLCJSRURVQ0UiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzZfX3JlZHVjZV9pdGVyYXRvcl9fIiwiVE9fSVRFUkFUT1IiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzdfX3V0aWxfYXJyYXlzX18iLCJCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSIsInNsYXZlIiwiRGVmYXVsdEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19jb21tb25fd29ya2VyX3dvcmtlcl9tZXNzYWdlc19fIiwiY2hhbmdlU3RhdGUiLCJJZGxlQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJtaXNzaW5nRnVuY3Rpb25zIiwidXNlZEZ1bmN0aW9uSWRzIiwiZmlsdGVyIiwiRXhlY3V0ZUZ1bmN0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJXYWl0aW5nRm9yRnVuY3Rpb25EZWZpbml0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUiLCJyZWdpc3RlckZ1bmN0aW9uIiwiZnVuY3Rpb25EZXNlcmlhbGl6ZXIiLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX2NvbW1vbl9mdW5jdGlvbl9mdW5jdGlvbl9jYWxsX2Rlc2VyaWFsaXplcl9fIiwibWFpbiIsImRlc2VyaWFsaXplRnVuY3Rpb25DYWxsIiwiZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIiwiRnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIiwiZnVuY3Rpb25Mb29rdXBUYWJsZSIsImZ1bmN0aW9uQ2FsbCIsImRlc2VyaWFsaXplUGFyYW1zIiwiZ2V0RnVuY3Rpb24iLCJwYXJhbXMiLCJwYXJhbWV0ZXJzIiwibWFwIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19zZXJpYWxpemVkX2Z1bmN0aW9uX2NhbGxfXyIsInBhcmFtIiwiYWRkaXRpb25hbFBhcmFtcyIsInVuZGVmaW5lZCIsIm5hbWVzcGFjZSIsIl9fX19fX19pc0Z1bmN0aW9uSWQiLCJpc0Z1bmN0aW9uSWQiLCJvYmoiLCJmaWx0ZXJJdGVyYXRvciIsInByZWRpY2F0ZSIsImVudiIsIm1hcEl0ZXJhdG9yIiwiaXRlcmF0ZWUiLCJjcmVhdGVUYXNrRW52aXJvbm1lbnQiLCJ0YXNrRW52aXJvbm1lbnQiLCJlbnZpcm9ubWVudHMiLCJlbnZpcm9ubWVudCIsImN1cnJlbnRFbnZpcm9ubWVudCIsIl9fV0VCUEFDS19JTVBPUlRFRF9NT0RVTEVfMV9fZnVuY3Rpb25fc2VyaWFsaXplZF9mdW5jdGlvbl9jYWxsX18iLCJhc3NpZ24iLCJ0YXNrSW5kZXgiLCJ2YWx1ZXNQZXJUYXNrIiwicGFyYWxsZWxKb2JFeGVjdXRvciIsImdlbmVyYXRvckZ1bmN0aW9uIiwiZ2VuZXJhdG9yIiwib3BlcmF0aW9ucyIsIm9wZXJhdGlvbiIsIml0ZXJhdG9yRnVuY3Rpb24iLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfX3V0aWxfYXJyYXlzX18iLCJQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19mdW5jdGlvbl9mdW5jdGlvbl9pZF9fIiwiVElNRVMiLCJyYW5nZUl0ZXJhdG9yIiwic3RhcnQiLCJlbmQiLCJzdGVwIiwicmVkdWNlSXRlcmF0b3IiLCJkZWZhdWx0VmFsdWUiLCJhY2N1bXVsYXRlZFZhbHVlIiwiaWRlbnRpdHkiLCJlbGVtZW50IiwiU2ltcGxlTWFwIiwia2V5IiwiaW50ZXJuYWxLZXkiLCJ0b0ludGVybmFsS2V5Iiwic2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8xX19jb21tb25fZnVuY3Rpb25fc2xhdmVfZnVuY3Rpb25fbG9va3VwX3RhYmxlX18iLCJfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzJfX2NvbW1vbl9wYXJhbGxlbF9zbGF2ZV9yZWdpc3Rlcl9wYXJhbGxlbF93b3JrZXJfZnVuY3Rpb25zX18iLCJ6IiwicmVhbCIsIml0ZXJhdGlvbnMiLCJ6SSIsInkiLCJsaW5lIiwiVWludDhDbGFtcGVkQXJyYXkiLCJjSSIsIngiLCJpbWFnZVdpZHRoIiwiYmFzZSIsIm1lbW8iLCJjb3VudCIsImtuaWdodFRvdXJzIiwic3RhcnRQYXRoIiwibW92ZXMiLCJib2FyZFNpemUiLCJib2FyZCIsIm51bWJlck9mRmllbGRzIiwicmVzdWx0cyIsInN0YWNrIiwicG9zIiwiaW5kZXgiLCJjb29yZGluYXRlIiwiZmllbGRJbmRleCIsInBvcCIsIm1vdmUiLCJzdWNjZXNzb3IiLCJhY2Nlc3NpYmxlIiwiY3JlYXRlRW52aXJvbm1lbnQiLCJmaWxsIiwiY2FsY3VsYXRlUmVxdWlyZWRBbW91bnQiLCJwcm9qZWN0IiwicHJvamVjdHNCeVN0YXJ0WWVhciIsImFtb3VudCIsInRvdGFsQW1vdW50IiwicHJvamVjdHNTYW1lWWVhciIsInN0YXJ0WWVhciIsIm90aGVyUHJvamVjdCIsImNyZWF0ZUdyb3VwcyIsInJlcXVpcmVkQW1vdW50Iiwibm9JbnRlcmVzdFJlZmVyZW5jZSIsImxpcXVpZGl0eSIsImRlc2NyaXB0aW9uIiwiZnJvbSIsInBlcmNlbnRhZ2UiLCJzZXBhcmF0b3IiLCJ0byIsImdyb3VwRm9yVmFsdWUiLCJncm91cHMiLCJmaW5kIiwiZ3JvdXAiLCJtZWRpYW4iLCJ2YWx1ZXMiLCJoYWxmIiwiTWF0aCIsImZsb29yIiwiY2FsY3VsYXRlUHJvamVjdCIsIk5VTUJFUl9PRl9CVUNLRVRTIiwic2ltdWxhdGVkVmFsdWVzVGhpc1llYXIiLCJzaW11bGF0ZWRWYWx1ZXMiLCJzb3J0IiwiYSIsImIiLCJub0ludGVyZXN0UmVmZXJlbmNlTGluZSIsInZhbHVlc0J5R3JvdXAiLCJidWNrZXRTaXplIiwicm91bmQiLCJidWNrZXRzIiwiYnVja2V0IiwibWF4IiwiTUlOX1ZBTFVFIiwibWluIiwiTUFYX1ZBTFVFIiwic3ViQnVja2V0cyIsImoiLCJzdWJCdWNrZXQiLCJub25FbXB0eUdyb3VwcyIsImZvckVhY2giLCJvbmVTaXh0aCIsInR3b1RoaXJkIiwiY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50Iiwib3B0aW9ucyIsInByb2plY3RzVG9DYXNoRmxvd3MiLCJudW1ZZWFycyIsImNhc2hGbG93cyIsInllYXIiLCJwcm9qZWN0c0J5VGhpc1llYXIiLCJjYXNoRmxvdyIsInJlZHVjZSIsImNhbGN1bGF0ZU5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lIiwiaW52ZXN0bWVudEFtb3VudCIsImludmVzdG1lbnRBbW91bnRMZWZ0IiwidG9BYnNvbHV0ZUluZGljZXMiLCJpbmRpY2VzIiwiY3VycmVudFBvcnRmb2xpb1ZhbHVlIiwicHJldmlvdXNZZWFySW5kZXgiLCJyZWxhdGl2ZVllYXIiLCJjdXJyZW50WWVhckluZGV4IiwiY2FzaEZsb3dTdGFydE9mWWVhciIsInBlcmZvcm1hbmNlIiwic2ltdWxhdGVPdXRjb21lcyIsIm51bVJ1bnMiLCJ2b2xhdGlsaXR5IiwicmFuZG9tIiwicnVuIiwicmFuZG9tUGVyZm9ybWFuY2UiLCJub3JtYWwiLCJwcm9qZWN0c1RvU2ltdWxhdGUiLCJwcm9qZWN0cyIsInZhbHVlc1BlcldvcmtlciIsInNsaWNlIiwiYXJyIiwiX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX19icm93c2VyX3dvcmtlcl9zbGF2ZV9fIiwib25tZXNzYWdlIiwiYXJndW1lbnRzIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFF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QU1xRCxZQUFZRixvQkFBb0JsRCxtQkFBcEIsRUFBeUNpRCxRQUFRRSxRQUFqRCxDQUFsQixDQUNBLElBQU1wQiwwQkFBMEIwQixpQ0FBaUNMLFNBQWpDLEVBQTRDSCxRQUFRUyxnQkFBcEQsRUFBc0VULFFBQVFFLFFBQTlFLENBQWhDLENBRUEsSUFBTUEsV0FBV3dCLG1CQUFtQm5CLE1BQW5CLENBQTBCLFVBQUM5RSxJQUFELEVBQU9xQixPQUFQO0FBQUEsdUJBQW1CdUIsS0FBS2UsR0FBTCxDQUFTM0QsSUFBVCxFQUFlcUIsUUFBUUssU0FBdkIsQ0FBbkI7QUFBQSxhQUExQixFQUFnRixDQUFoRixDQUFqQixDQUVBLE9BQU8sRUFDSHNELGtCQUFrQlQsUUFBUVMsZ0JBRHZCLEVBRUhqRCxXQUFXd0MsUUFBUXhDLFNBRmhCLEVBR0hzQixnREFIRyxFQUlIc0MsU0FBU3BCLFFBQVFvQixPQUpkLEVBS0hsQixrQkFMRyxFQU1IbkQsd0NBTkcsRUFPSDJCLGlCQUFpQnlDLGlCQUFpQmhCLFNBQWpCLEVBQTRCSCxRQUFRUyxnQkFBcEMsRUFBc0RULE9BQXRELENBUGQsRUFBUDtBQVNIOzs7V0FzQ0R6Qjs7OztXQTVJQXdCOzs7QUh0SEEsUUFBTXpKLFFBQVEsSUFBSXlMLG9EQUFBLDZCQUFKLENBQXVCcEgsd0JBQXZCLENBQWQ7QUFDQXFILGdCQUFZO0FBQ1IxTCxjQUFNbEMsU0FBTixDQUFnQm5ELEtBQWhCLENBQXNCcUYsS0FBdEIsRUFBNkIyTCxTQUE3QjtBQUNILEtBRkQiLCJmaWxlIjoid29ya2VyLXNsYXZlLnBhcmFsbGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vcnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9yeSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0fSk7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQyMzgxZDAwOGMzZDQ0ZGI1ZjBmIiwiLyohXG4gKiBSYW5kb20uanMgdmVyc2lvbiAwLjIuNlxuICogY3VybCBodHRwOi8vc2ltanMuY29tL19kb3dubG9hZHMvcmFuZG9tLTAuMjYtZGVidWcuanNcbiAqL1xuXG4gLyoqIFJhbmRvbS5qcyBsaWJyYXJ5LlxuICpcbiAqIFRoZSBjb2RlIGlzIGxpY2Vuc2VkIGFzIExHUEwuXG4qL1xuXG4vKlxuICAgQSBDLXByb2dyYW0gZm9yIE1UMTk5MzcsIHdpdGggaW5pdGlhbGl6YXRpb24gaW1wcm92ZWQgMjAwMi8xLzI2LlxuICAgQ29kZWQgYnkgVGFrdWppIE5pc2hpbXVyYSBhbmQgTWFrb3RvIE1hdHN1bW90by5cblxuICAgQmVmb3JlIHVzaW5nLCBpbml0aWFsaXplIHRoZSBzdGF0ZSBieSB1c2luZyBpbml0X2dlbnJhbmQoc2VlZClcbiAgIG9yIGluaXRfYnlfYXJyYXkoaW5pdF9rZXksIGtleV9sZW5ndGgpLlxuXG4gICBDb3B5cmlnaHQgKEMpIDE5OTcgLSAyMDAyLCBNYWtvdG8gTWF0c3Vtb3RvIGFuZCBUYWt1amkgTmlzaGltdXJhLFxuICAgQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuICAgUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gICBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnNcbiAgIGFyZSBtZXQ6XG5cbiAgICAgMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuXG4gICAgIDIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuICAgICAzLiBUaGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgbm90IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlXG4gICAgICAgIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlblxuICAgICAgICBwZXJtaXNzaW9uLlxuXG4gICBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gICBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gICBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAgIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiAgSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUlxuICAgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXG4gICBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sXG4gICBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1JcbiAgIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcbiAgIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG4gICBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAgIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuXG5cbiAgIEFueSBmZWVkYmFjayBpcyB2ZXJ5IHdlbGNvbWUuXG4gICBodHRwOi8vd3d3Lm1hdGguc2NpLmhpcm9zaGltYS11LmFjLmpwL35tLW1hdC9NVC9lbXQuaHRtbFxuICAgZW1haWw6IG0tbWF0IEAgbWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAgKHJlbW92ZSBzcGFjZSlcbiAqL1xuXG52YXIgUmFuZG9tID0gZnVuY3Rpb24oc2VlZCkge1xuXHRzZWVkID0gKHNlZWQgPT09IHVuZGVmaW5lZCkgPyAobmV3IERhdGUoKSkuZ2V0VGltZSgpIDogc2VlZDtcblx0aWYgKHR5cGVvZihzZWVkKSAhPT0gJ251bWJlcicgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHx8IE1hdGguY2VpbChzZWVkKSAhPSBNYXRoLmZsb29yKHNlZWQpKSB7ICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoXCJzZWVkIHZhbHVlIG11c3QgYmUgYW4gaW50ZWdlclwiKTsgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXG5cdC8qIFBlcmlvZCBwYXJhbWV0ZXJzICovXG5cdHRoaXMuTiA9IDYyNDtcblx0dGhpcy5NID0gMzk3O1xuXHR0aGlzLk1BVFJJWF9BID0gMHg5OTA4YjBkZjsgICAvKiBjb25zdGFudCB2ZWN0b3IgYSAqL1xuXHR0aGlzLlVQUEVSX01BU0sgPSAweDgwMDAwMDAwOyAvKiBtb3N0IHNpZ25pZmljYW50IHctciBiaXRzICovXG5cdHRoaXMuTE9XRVJfTUFTSyA9IDB4N2ZmZmZmZmY7IC8qIGxlYXN0IHNpZ25pZmljYW50IHIgYml0cyAqL1xuXG5cdHRoaXMubXQgPSBuZXcgQXJyYXkodGhpcy5OKTsgLyogdGhlIGFycmF5IGZvciB0aGUgc3RhdGUgdmVjdG9yICovXG5cdHRoaXMubXRpPXRoaXMuTisxOyAvKiBtdGk9PU4rMSBtZWFucyBtdFtOXSBpcyBub3QgaW5pdGlhbGl6ZWQgKi9cblxuXHQvL3RoaXMuaW5pdF9nZW5yYW5kKHNlZWQpO1xuXHR0aGlzLmluaXRfYnlfYXJyYXkoW3NlZWRdLCAxKTtcbn07XG5cbi8qIGluaXRpYWxpemVzIG10W05dIHdpdGggYSBzZWVkICovXG5SYW5kb20ucHJvdG90eXBlLmluaXRfZ2VucmFuZCA9IGZ1bmN0aW9uKHMpIHtcblx0dGhpcy5tdFswXSA9IHMgPj4+IDA7XG5cdGZvciAodGhpcy5tdGk9MTsgdGhpcy5tdGk8dGhpcy5OOyB0aGlzLm10aSsrKSB7XG5cdFx0dmFyIHMgPSB0aGlzLm10W3RoaXMubXRpLTFdIF4gKHRoaXMubXRbdGhpcy5tdGktMV0gPj4+IDMwKTtcblx0XHR0aGlzLm10W3RoaXMubXRpXSA9ICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxODEyNDMzMjUzKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTgxMjQzMzI1Mylcblx0XHQrIHRoaXMubXRpO1xuXHRcdC8qIFNlZSBLbnV0aCBUQU9DUCBWb2wyLiAzcmQgRWQuIFAuMTA2IGZvciBtdWx0aXBsaWVyLiAqL1xuXHRcdC8qIEluIHRoZSBwcmV2aW91cyB2ZXJzaW9ucywgTVNCcyBvZiB0aGUgc2VlZCBhZmZlY3QgICAqL1xuXHRcdC8qIG9ubHkgTVNCcyBvZiB0aGUgYXJyYXkgbXRbXS4gICAgICAgICAgICAgICAgICAgICAgICAqL1xuXHRcdC8qIDIwMDIvMDEvMDkgbW9kaWZpZWQgYnkgTWFrb3RvIE1hdHN1bW90byAgICAgICAgICAgICAqL1xuXHRcdHRoaXMubXRbdGhpcy5tdGldID4+Pj0gMDtcblx0XHQvKiBmb3IgPjMyIGJpdCBtYWNoaW5lcyAqL1xuXHR9XG59O1xuXG4vKiBpbml0aWFsaXplIGJ5IGFuIGFycmF5IHdpdGggYXJyYXktbGVuZ3RoICovXG4vKiBpbml0X2tleSBpcyB0aGUgYXJyYXkgZm9yIGluaXRpYWxpemluZyBrZXlzICovXG4vKiBrZXlfbGVuZ3RoIGlzIGl0cyBsZW5ndGggKi9cbi8qIHNsaWdodCBjaGFuZ2UgZm9yIEMrKywgMjAwNC8yLzI2ICovXG5SYW5kb20ucHJvdG90eXBlLmluaXRfYnlfYXJyYXkgPSBmdW5jdGlvbihpbml0X2tleSwga2V5X2xlbmd0aCkge1xuXHR2YXIgaSwgaiwgaztcblx0dGhpcy5pbml0X2dlbnJhbmQoMTk2NTAyMTgpO1xuXHRpPTE7IGo9MDtcblx0ayA9ICh0aGlzLk4+a2V5X2xlbmd0aCA/IHRoaXMuTiA6IGtleV9sZW5ndGgpO1xuXHRmb3IgKDsgazsgay0tKSB7XG5cdFx0dmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XG5cdFx0dGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE2NjQ1MjUpIDw8IDE2KSArICgocyAmIDB4MDAwMGZmZmYpICogMTY2NDUyNSkpKVxuXHRcdCsgaW5pdF9rZXlbal0gKyBqOyAvKiBub24gbGluZWFyICovXG5cdFx0dGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG5cdFx0aSsrOyBqKys7XG5cdFx0aWYgKGk+PXRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4tMV07IGk9MTsgfVxuXHRcdGlmIChqPj1rZXlfbGVuZ3RoKSBqPTA7XG5cdH1cblx0Zm9yIChrPXRoaXMuTi0xOyBrOyBrLS0pIHtcblx0XHR2YXIgcyA9IHRoaXMubXRbaS0xXSBeICh0aGlzLm10W2ktMV0gPj4+IDMwKTtcblx0XHR0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTU2NjA4Mzk0MSkgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE1NjYwODM5NDEpKVxuXHRcdC0gaTsgLyogbm9uIGxpbmVhciAqL1xuXHRcdHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuXHRcdGkrKztcblx0XHRpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XG5cdH1cblxuXHR0aGlzLm10WzBdID0gMHg4MDAwMDAwMDsgLyogTVNCIGlzIDE7IGFzc3VyaW5nIG5vbi16ZXJvIGluaXRpYWwgYXJyYXkgKi9cbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMHhmZmZmZmZmZl0taW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9pbnQzMiA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgeTtcblx0dmFyIG1hZzAxID0gbmV3IEFycmF5KDB4MCwgdGhpcy5NQVRSSVhfQSk7XG5cdC8qIG1hZzAxW3hdID0geCAqIE1BVFJJWF9BICBmb3IgeD0wLDEgKi9cblxuXHRpZiAodGhpcy5tdGkgPj0gdGhpcy5OKSB7IC8qIGdlbmVyYXRlIE4gd29yZHMgYXQgb25lIHRpbWUgKi9cblx0XHR2YXIga2s7XG5cblx0XHRpZiAodGhpcy5tdGkgPT0gdGhpcy5OKzEpICAgLyogaWYgaW5pdF9nZW5yYW5kKCkgaGFzIG5vdCBiZWVuIGNhbGxlZCwgKi9cblx0XHRcdHRoaXMuaW5pdF9nZW5yYW5kKDU0ODkpOyAvKiBhIGRlZmF1bHQgaW5pdGlhbCBzZWVkIGlzIHVzZWQgKi9cblxuXHRcdGZvciAoa2s9MDtrazx0aGlzLk4tdGhpcy5NO2trKyspIHtcblx0XHRcdHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xuXHRcdFx0dGhpcy5tdFtra10gPSB0aGlzLm10W2trK3RoaXMuTV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblx0XHR9XG5cdFx0Zm9yICg7a2s8dGhpcy5OLTE7a2srKykge1xuXHRcdFx0eSA9ICh0aGlzLm10W2trXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10W2trKzFdJnRoaXMuTE9XRVJfTUFTSyk7XG5cdFx0XHR0aGlzLm10W2trXSA9IHRoaXMubXRba2srKHRoaXMuTS10aGlzLk4pXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXHRcdH1cblx0XHR5ID0gKHRoaXMubXRbdGhpcy5OLTFdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRbMF0mdGhpcy5MT1dFUl9NQVNLKTtcblx0XHR0aGlzLm10W3RoaXMuTi0xXSA9IHRoaXMubXRbdGhpcy5NLTFdIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cblx0XHR0aGlzLm10aSA9IDA7XG5cdH1cblxuXHR5ID0gdGhpcy5tdFt0aGlzLm10aSsrXTtcblxuXHQvKiBUZW1wZXJpbmcgKi9cblx0eSBePSAoeSA+Pj4gMTEpO1xuXHR5IF49ICh5IDw8IDcpICYgMHg5ZDJjNTY4MDtcblx0eSBePSAoeSA8PCAxNSkgJiAweGVmYzYwMDAwO1xuXHR5IF49ICh5ID4+PiAxOCk7XG5cblx0cmV0dXJuIHkgPj4+IDA7XG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4N2ZmZmZmZmZdLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfaW50MzEgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICh0aGlzLmdlbnJhbmRfaW50MzIoKT4+PjEpO1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxXS1yZWFsLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfcmVhbDEgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5NS4wKTtcblx0LyogZGl2aWRlZCBieSAyXjMyLTEgKi9cbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMSktcmVhbC1pbnRlcnZhbCAqL1xuUmFuZG9tLnByb3RvdHlwZS5yYW5kb20gPSBmdW5jdGlvbigpIHtcblx0aWYgKHRoaXMucHl0aG9uQ29tcGF0aWJpbGl0eSkge1xuXHRcdGlmICh0aGlzLnNraXApIHtcblx0XHRcdHRoaXMuZ2VucmFuZF9pbnQzMigpO1xuXHRcdH1cblx0XHR0aGlzLnNraXAgPSB0cnVlO1xuXHR9XG5cdHJldHVybiB0aGlzLmdlbnJhbmRfaW50MzIoKSooMS4wLzQyOTQ5NjcyOTYuMCk7XG5cdC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiAoMCwxKS1yZWFsLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfcmVhbDMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuICh0aGlzLmdlbnJhbmRfaW50MzIoKSArIDAuNSkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuXHQvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMSkgd2l0aCA1My1iaXQgcmVzb2x1dGlvbiovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfcmVzNTMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGE9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj41LCBiPXRoaXMuZ2VucmFuZF9pbnQzMigpPj4+Njtcblx0cmV0dXJuKGEqNjcxMDg4NjQuMCtiKSooMS4wLzkwMDcxOTkyNTQ3NDA5OTIuMCk7XG59O1xuXG4vKiBUaGVzZSByZWFsIHZlcnNpb25zIGFyZSBkdWUgdG8gSXNha3UgV2FkYSwgMjAwMi8wMS8wOSBhZGRlZCAqL1xuXG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblJhbmRvbS5wcm90b3R5cGUuTE9HNCA9IE1hdGgubG9nKDQuMCk7XG5SYW5kb20ucHJvdG90eXBlLlNHX01BR0lDQ09OU1QgPSAxLjAgKyBNYXRoLmxvZyg0LjUpO1xuXG5SYW5kb20ucHJvdG90eXBlLmV4cG9uZW50aWFsID0gZnVuY3Rpb24gKGxhbWJkYSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcImV4cG9uZW50aWFsKCkgbXVzdCBcIiAgICAgLy8gQVJHX0NIRUNLXG5cdFx0XHRcdCsgXCIgYmUgY2FsbGVkIHdpdGggJ2xhbWJkYScgcGFyYW1ldGVyXCIpOyAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdHZhciByID0gdGhpcy5yYW5kb20oKTtcblx0cmV0dXJuIC1NYXRoLmxvZyhyKSAvIGxhbWJkYTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUuZ2FtbWEgPSBmdW5jdGlvbiAoYWxwaGEsIGJldGEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJnYW1tYSgpIG11c3QgYmUgY2FsbGVkXCIgIC8vIEFSR19DSEVDS1xuXHRcdFx0XHQrIFwiIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVyc1wiKTsgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHQvKiBCYXNlZCBvbiBQeXRob24gMi42IHNvdXJjZSBjb2RlIG9mIHJhbmRvbS5weS5cblx0ICovXG5cblx0aWYgKGFscGhhID4gMS4wKSB7XG5cdFx0dmFyIGFpbnYgPSBNYXRoLnNxcnQoMi4wICogYWxwaGEgLSAxLjApO1xuXHRcdHZhciBiYmIgPSBhbHBoYSAtIHRoaXMuTE9HNDtcblx0XHR2YXIgY2NjID0gYWxwaGEgKyBhaW52O1xuXG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0XHRpZiAoKHUxIDwgMWUtNykgfHwgKHUgPiAwLjk5OTk5OTkpKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHUyID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcblx0XHRcdHZhciB2ID0gTWF0aC5sb2codTEgLyAoMS4wIC0gdTEpKSAvIGFpbnY7XG5cdFx0XHR2YXIgeCA9IGFscGhhICogTWF0aC5leHAodik7XG5cdFx0XHR2YXIgeiA9IHUxICogdTEgKiB1Mjtcblx0XHRcdHZhciByID0gYmJiICsgY2NjICogdiAtIHg7XG5cdFx0XHRpZiAoKHIgKyB0aGlzLlNHX01BR0lDQ09OU1QgLSA0LjUgKiB6ID49IDAuMCkgfHwgKHIgPj0gTWF0aC5sb2coeikpKSB7XG5cdFx0XHRcdHJldHVybiB4ICogYmV0YTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAoYWxwaGEgPT0gMS4wKSB7XG5cdFx0dmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdHdoaWxlICh1IDw9IDFlLTcpIHtcblx0XHRcdHUgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdH1cblx0XHRyZXR1cm4gLSBNYXRoLmxvZyh1KSAqIGJldGE7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdHZhciB1ID0gdGhpcy5yYW5kb20oKTtcblx0XHRcdHZhciBiID0gKE1hdGguRSArIGFscGhhKSAvIE1hdGguRTtcblx0XHRcdHZhciBwID0gYiAqIHU7XG5cdFx0XHRpZiAocCA8PSAxLjApIHtcblx0XHRcdFx0dmFyIHggPSBNYXRoLnBvdyhwLCAxLjAgLyBhbHBoYSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgeCA9IC0gTWF0aC5sb2coKGIgLSBwKSAvIGFscGhhKTtcblx0XHRcdH1cblx0XHRcdHZhciB1MSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0XHRpZiAocCA+IDEuMCkge1xuXHRcdFx0XHRpZiAodTEgPD0gTWF0aC5wb3coeCwgKGFscGhhIC0gMS4wKSkpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh1MSA8PSBNYXRoLmV4cCgteCkpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB4ICogYmV0YTtcblx0fVxuXG59O1xuXG5SYW5kb20ucHJvdG90eXBlLm5vcm1hbCA9IGZ1bmN0aW9uIChtdSwgc2lnbWEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwibm9ybWFsKCkgbXVzdCBiZSBjYWxsZWRcIiAgLy8gQVJHX0NIRUNLXG5cdFx0XHRcdCsgXCIgd2l0aCBtdSBhbmQgc2lnbWEgcGFyYW1ldGVyc1wiKTsgICAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHR2YXIgeiA9IHRoaXMubGFzdE5vcm1hbDtcblx0dGhpcy5sYXN0Tm9ybWFsID0gTmFOO1xuXHRpZiAoIXopIHtcblx0XHR2YXIgYSA9IHRoaXMucmFuZG9tKCkgKiAyICogTWF0aC5QSTtcblx0XHR2YXIgYiA9IE1hdGguc3FydCgtMi4wICogTWF0aC5sb2coMS4wIC0gdGhpcy5yYW5kb20oKSkpO1xuXHRcdHogPSBNYXRoLmNvcyhhKSAqIGI7XG5cdFx0dGhpcy5sYXN0Tm9ybWFsID0gTWF0aC5zaW4oYSkgKiBiO1xuXHR9XG5cdHJldHVybiBtdSArIHogKiBzaWdtYTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUucGFyZXRvID0gZnVuY3Rpb24gKGFscGhhKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwicGFyZXRvKCkgbXVzdCBiZSBjYWxsZWRcIiAvLyBBUkdfQ0hFQ0tcblx0XHRcdFx0KyBcIiB3aXRoIGFscGhhIHBhcmFtZXRlclwiKTsgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHR2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG5cdHJldHVybiAxLjAgLyBNYXRoLnBvdygoMSAtIHUpLCAxLjAgLyBhbHBoYSk7XG59O1xuXG5SYW5kb20ucHJvdG90eXBlLnRyaWFuZ3VsYXIgPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyLCBtb2RlKSB7XG5cdC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVHJpYW5ndWxhcl9kaXN0cmlidXRpb25cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMykgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJ0cmlhbmd1bGFyKCkgbXVzdCBiZSBjYWxsZWRcIiAvLyBBUkdfQ0hFQ0tcblx0XHQrIFwiIHdpdGggbG93ZXIsIHVwcGVyIGFuZCBtb2RlIHBhcmFtZXRlcnNcIik7ICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblx0dmFyIGMgPSAobW9kZSAtIGxvd2VyKSAvICh1cHBlciAtIGxvd2VyKTtcblx0dmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuXG5cdGlmICh1IDw9IGMpIHtcblx0XHRyZXR1cm4gbG93ZXIgKyBNYXRoLnNxcnQodSAqICh1cHBlciAtIGxvd2VyKSAqIChtb2RlIC0gbG93ZXIpKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gdXBwZXIgLSBNYXRoLnNxcnQoKDEgLSB1KSAqICh1cHBlciAtIGxvd2VyKSAqICh1cHBlciAtIG1vZGUpKTtcblx0fVxufTtcblxuUmFuZG9tLnByb3RvdHlwZS51bmlmb3JtID0gZnVuY3Rpb24gKGxvd2VyLCB1cHBlcikge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcInVuaWZvcm0oKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdCsgXCIgd2l0aCBsb3dlciBhbmQgdXBwZXIgcGFyYW1ldGVyc1wiKTsgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0cmV0dXJuIGxvd2VyICsgdGhpcy5yYW5kb20oKSAqICh1cHBlciAtIGxvd2VyKTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUud2VpYnVsbCA9IGZ1bmN0aW9uIChhbHBoYSwgYmV0YSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcIndlaWJ1bGwoKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdCsgXCIgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzXCIpOyAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHR2YXIgdSA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG5cdHJldHVybiBhbHBoYSAqIE1hdGgucG93KC1NYXRoLmxvZyh1KSwgMS4wIC8gYmV0YSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJhbmRvbTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc2ltanMtcmFuZG9tL3NpbWpzLXJhbmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9yeSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb3J5IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTcpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGJmMTlkMDI5MmNmODdlMDc5ZDVkXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vd2VicGFjazovd2VicGFjay9ib290c3RyYXAgYmYxOWQwMjkyY2Y4N2UwNzlkNWQiLCIvKipcbiAqIENyZWF0ZXMgYW4gaXRlcmF0b3IgdGhhdCBpdGVyYXRlcyBvdmVyIHRoZSBnaXZlbiBhcnJheVxuICogQHBhcmFtIGRhdGEgdGhlIGFycmF5XG4gKiBAcGFyYW0gVCBlbGVtZW50IHR5cGVcbiAqIEByZXR1cm5zIHRoZSBpdGVyYXRvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9JdGVyYXRvcjxUPihkYXRhOiBUW10pOiBJdGVyYXRvcjxUPiB7XG4gICAgcmV0dXJuIGRhdGFbU3ltYm9sLml0ZXJhdG9yXSgpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBnaXZlbiBpdGVyYXRvciB0byBhbiBhcnJheVxuICogQHBhcmFtIGl0ZXJhdG9yIHRoZSBpdGVyYXRvciB0aGF0IGlzIHRvIGJlIGNvbnZlcnRlZCBpbnRvIGFuIGFycmF5XG4gKiBAcGFyYW0gVCBlbGVtZW50IHR5cGVcbiAqIEByZXR1cm5zIHtUW119IHRoZSBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZ2l2ZW4gaXRlcmF0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXk8VD4oaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+KTogVFtdIHtcbiAgICBjb25zdCByZXN1bHQ6IFRbXSA9IFtdO1xuICAgIGxldCBjdXJyZW50OiBJdGVyYXRvclJlc3VsdDxUPjtcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1jb25kaXRpb25hbC1hc3NpZ25tZW50ICovXG4gICAgd2hpbGUgKCEoY3VycmVudCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICByZXN1bHQucHVzaChjdXJyZW50LnZhbHVlIGFzIFQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEZsYXR0ZW5zIHRoZSBnaXZlbiBhcnJheS5cbiAqIEBwYXJhbSBkZWVwQXJyYXkgdGhlIGFycmF5IHRvIGZsYXR0ZW5cbiAqIEBwYXJhbSB0eXBlIG9mIHRoZSBhcnJheSBlbGVtZW50c1xuICogQHJldHVybnMgcmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgdmFsdWVzIGNvbnRhaW5lZCBpbiB0aGUgc3ViIGFycmF5cyBvZiBkZWVwIGFycmF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkFycmF5PFQ+KGRlZXBBcnJheTogVFtdW10pOiBUW10ge1xuICAgIGlmIChkZWVwQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBbaGVhZCwgLi4udGFpbF0gPSBkZWVwQXJyYXk7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoaGVhZCwgdGFpbCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3V0aWwvYXJyYXlzLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL2FycmF5cy50cyIsIi8qKlxuICogQG1vZHVsZSBwYXJhbGxlbFxuICovXG4vKiogKi9cblxuaW1wb3J0IHtJRnVuY3Rpb25JZH0gZnJvbSBcIi4vZnVuY3Rpb24taWRcIjtcblxuLyoqXG4gKiBTZXJpYWxpemVkIHJlcHJlc2VudGF0aW9uIG9mIGEgZnVuY3Rpb24gY2FsbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElTZXJpYWxpemVkRnVuY3Rpb25DYWxsIHtcbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGZ1bmN0aW9uIHRvIGludm9rZSAoe0BsaW5rIElGdW5jdGlvbkRlZmluaXRpb24uaWR9KVxuICAgICAqL1xuICAgIGZ1bmN0aW9uSWQ6IElGdW5jdGlvbklkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgZnVuY3Rpb24gd2hlbiBjYWxsZWRcbiAgICAgKi9cbiAgICByZWFkb25seSBwYXJhbWV0ZXJzOiBhbnlbXTtcblxuICAgIC8qKlxuICAgICAqIE1hcmtlciB0aGF0IGluZGljYXRlcyB0aGF0IHRoaXMgb2JqZWN0IGlzIGEgc2VyaWFsaXplZCBmdW5jdGlvbiBjYWxsXG4gICAgICovXG4gICAgcmVhZG9ubHkgX19fX19fc2VyaWFsaXplZEZ1bmN0aW9uQ2FsbDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgc2VyaWFsaXplZCBmdW5jdGlvbiBjYWxsXG4gKiBAcGFyYW0gcG90ZW50aWFsRnVuYyBhIHBvdGVudGlhbGx5IHNlcmlhbGl6ZWQgZnVuY3Rpb24gY2FsbFxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQgaXMgYSBzZXJpYWxpemVkIGZ1bmN0aW9uIGNhbGwsIGZhbHNlIG90aGVyd2lzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsKHBvdGVudGlhbEZ1bmM6IGFueSk6IHBvdGVudGlhbEZ1bmMgaXMgSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGwge1xuICAgIHJldHVybiAhIXBvdGVudGlhbEZ1bmMgJiYgcG90ZW50aWFsRnVuYy5fX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsID09PSB0cnVlO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9mdW5jdGlvbi9zZXJpYWxpemVkLWZ1bmN0aW9uLWNhbGwudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL3NlcmlhbGl6ZWQtZnVuY3Rpb24tY2FsbC50cyIsImltcG9ydCB7SVRhc2tEZWZpbml0aW9ufSBmcm9tIFwiLi4vdGFzay90YXNrLWRlZmluaXRpb25cIjtcbmltcG9ydCB7SUZ1bmN0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4uL2Z1bmN0aW9uL2Z1bmN0aW9uLWRlZmludGlvblwiO1xuaW1wb3J0IHtJRnVuY3Rpb25JZH0gZnJvbSBcIi4uL2Z1bmN0aW9uL2Z1bmN0aW9uLWlkXCI7XG5cbi8qKlxuICogTWVzc2FnZSB0eXBlc1xuICovXG5leHBvcnQgY29uc3QgZW51bSBXb3JrZXJNZXNzYWdlVHlwZSB7XG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgZmFjYWRlIHRvIHRoZSB3b3JrZXIgc2xhdmUgdG8gaW5pdGlhbGl6ZSB0aGUgc2xhdmUuXG4gICAgICovXG4gICAgSW5pdGlhbGl6ZVdvcmtlcixcblxuICAgIC8qKlxuICAgICAqIFNlbnQgZnJvbSB0aGUgd29ya2VyIGZhY2FkZSB0byB0aGUgd29ya2VyIHNsYXZlIHRvIHNjaGVkdWxlIGEgbmV3IHRhc2sgb24gdGhlIHNsYXZlLlxuICAgICAqL1xuICAgIFNjaGVkdWxlVGFzayxcblxuICAgIC8qKlxuICAgICAqIFNlbmQgZnJvbSB0aGUgd29ya2VyIHNsYXZlIHRvIHRoZSB3b3JrZXIgdGhyZWFkIHRvIHJlcXVlc3QgdGhlIGRlZmluaXRpb24gb2YgYSBmdW5jdGlvbiBuZWVkZWQgdG8gZXhlY3V0ZSBhIHNjaGVkdWxlZCB0YXNrXG4gICAgICovXG4gICAgRnVuY3Rpb25SZXF1ZXN0LFxuXG4gICAgLyoqXG4gICAgICogU2VuZCBmcm9tIHRoZSB3b3JrZXIgdGhyZWFkIHRvIHRoZSB3b3JrZXIgc2xhdmUgYXMgcmVzcG9uc2UgdG8gYSB7QGxpbmsgV29ya2VyTWVzc2FnZVR5cGUuRnVuY3Rpb25SZXF1ZXN0fS4gSW5jbHVkZXNcbiAgICAgKiB0aGUgZGVmaW5pdGlvbnMgb2YgYWxsIHJlcXVlc3RlZCBmdW5jdGlvbnNcbiAgICAgKi9cbiAgICBGdW5jdGlvblJlc3BvbnNlLFxuXG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgc2xhdmUgdG8gdGhlIHdvcmtlciB0aHJlYWQgY29udGFpbmluZyB0aGUgY29tcHV0ZWQgcmVzdWx0XG4gICAgICovXG4gICAgV29ya2VyUmVzdWx0LFxuXG4gICAgLyoqXG4gICAgICogU2VudCBmcm9tIHRoZSB3b3JrZXIgc2xhdmUgdG8gdGhlIHdvcmtlciB0aHJlYWQgZm9yIHRoZSBjYXNlIGFuIGVycm9yIG9jY3VycmVkIGR1cmluZyB0aGUgZXZhbHVhdGlvbiBvZiB0aGUgc2NoZWR1bGVkIHRhc2suXG4gICAgICovXG4gICAgRnVuY3Rpb25FeGVjdXRpb25FcnJvcixcblxuICAgIC8qKlxuICAgICAqIFNlbnQgZnJvbSB0aGUgd29ya2VyIHRocmVhZCB0byB0aGUgd29ya2VyIHNsYXZlIHRvIHJlcXVlc3QgdGhlIHNsYXZlIHRvIHRlcm1pbmF0ZS5cbiAgICAgKi9cbiAgICBTdG9wXG59XG5cbi8qKlxuICogTWVzc2FnZSB0aGF0IGlzIGV4Y2hhbmdlZCBiZXR3ZWVuIGEgd29ya2VyIHNsYXZlIGFuZCB0aGUgd29ya2VyIHRocmVhZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJV29ya2VyTWVzc2FnZSB7XG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIG1lc3NhZ2UuXG4gICAgICovXG4gICAgdHlwZTogV29ya2VyTWVzc2FnZVR5cGU7XG59XG5cbi8qKlxuICogU2VudCB0byBpbml0aWFsaXplIHRoZSB3b3JrZXIgc2xhdmUgYW5kIGFzc2lnbnMgdGhlIGdpdmVuIHVuaXF1ZSBpZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElJbml0aWFsaXplV29ya2VyTWVzc2FnZSBleHRlbmRzIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBVbmlxdWUgaWQgb2YgdGhlIHdvcmtlciAoZmFjYWRlIC8gc2xhdmUpXG4gICAgICovXG4gICAgd29ya2VySWQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZXMgdGhlIGdpdmVuIHRhc2sgb24gdGhlIHdvcmtlciBzbGF2ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU2NoZWR1bGVUYXNrTWVzc2FnZSBleHRlbmRzIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBUYXNrIHRvIGV4ZWN1dGUgb24gdGhlIHdvcmtlciBzbGF2ZVxuICAgICAqL1xuICAgIHRhc2s6IElUYXNrRGVmaW5pdGlvbjtcbn1cblxuLyoqXG4gKiBTZW50IGJ5IHRoZSB3b3JrZXIgc2xhdmUgdG8gcmVxdWVzdCB0aGUgZnVuY3Rpb24gZGVmaW5pdGlvbnMgd2l0aCB0aGUgZ2l2ZW4gaWRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvblJlcXVlc3QgZXh0ZW5kcyBJV29ya2VyTWVzc2FnZSB7XG4gICAgLyoqXG4gICAgICogVGhlIGlkcyBvZiB0aGUgcmVxdWVzdGVkIGZ1bmN0aW9uc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uSWRzOiBJRnVuY3Rpb25JZFtdO1xufVxuXG4vKipcbiAqIFJlc3BvbnNlIHRvIGEge0BsaW5rIElGdW5jdGlvblJlcXVlc3R9LiBDb250YWlucyB0aGUgZGVmaW5pdGlvbnMgZm9yIGFsbCByZXF1ZXN0ZWQgZnVuY3Rpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvblJlc3BvbnNlIGV4dGVuZHMgSVdvcmtlck1lc3NhZ2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBkZWZpbml0aW9uIG9mIHRoZSByZXF1ZXN0ZWQgZnVuY3Rpb25zXG4gICAgICovXG4gICAgZnVuY3Rpb25zOiBJRnVuY3Rpb25EZWZpbml0aW9uW107XG59XG5cbi8qKlxuICogU2VudCBmcm9tIHRoZSB3b3JrZXIgc2xhdmUgdG8gdGhlIHdvcmtlciB0aHJlYWQgdG8gcmVwb3J0IHRoZSBjb21wdXRlZCByZXN1bHQuXG4gKiBUaGVyZWFmdGVyLCB0aGUgd29ya2VyIHNsYXZlIGlzIHJlYWR5IHRvIGFjY2VwdCBmdXJ0aGVyIHRhc2tzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElXb3JrZXJSZXN1bHRNZXNzYWdlIGV4dGVuZHMgSVdvcmtlck1lc3NhZ2Uge1xuICAgIC8qKlxuICAgICAqIFRoZSBjb21wdXRlZCByZXN1bHQgZm9yIHRoZSB7QGxpbmsgSVNjaGVkdWxlVGFza01lc3NhZ2V9XG4gICAgICovXG4gICAgcmVzdWx0OiBhbnk7XG59XG5cbi8qKlxuICogU2VudCBmcm9tIHRoZSB3b3JrZXIgdG8gcmVwb3J0IGFuIGVycm9yIGR1cmluZyB0aGUgZXhlY3V0aW9uIG9mIHRoZSBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRnVuY3Rpb25FeGVjdXRpb25FcnJvciBleHRlbmRzIElXb3JrZXJNZXNzYWdlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgb2NjdXJyZWQgZXJyb3IuIE5vdCBhbiBpbnN0YW5jZSBvZiBFcnJvci4gRXJyb3IgaXMgbm90IGNsb25lYWJsZS5cbiAgICAgKi9cbiAgICBlcnJvcjogYW55O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gaW5pdGlhbGl6ZSB3b3JrZXIgbWVzc2FnZVxuICogQHBhcmFtIGlkIHRoZSB1bmlxdWUgaWQgb2YgdGhlIHdvcmtlclxuICogQHJldHVybnMgdGhlIGluaXRpYWxpemUgd29ya2VyIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVXb3JrZXJNZXNzYWdlKGlkOiBudW1iZXIpOiBJSW5pdGlhbGl6ZVdvcmtlck1lc3NhZ2Uge1xuICAgIHJldHVybiB7IHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLkluaXRpYWxpemVXb3JrZXIsIHdvcmtlcklkOiBpZCB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtZXNzYWdlIHRvIHNjaGVkdWxlIHRoZSBnaXZlbiB0YXNrIG9uIGEgd29ya2VyIHNsYXZlXG4gKiBAcGFyYW0gdGFzayB0aGUgdGFzayB0byBzY2hlZHVsZVxuICogQHJldHVybnMgdGhlIHNjaGVkdWxlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlVGFza01lc3NhZ2UodGFzazogSVRhc2tEZWZpbml0aW9uKTogSVNjaGVkdWxlVGFza01lc3NhZ2Uge1xuICAgIHJldHVybiB7IHRhc2ssIHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLlNjaGVkdWxlVGFza307XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiB7QGxpbmsgSUZ1bmN0aW9uUmVxdWVzdH0gbWVzc2FnZSB0aGF0IHJlcXVlc3RzIHRoZSBnaXZlbiBmdW5jdGlvbiBpZHMgZnJvbSB0aGUgd29ya2VyIHRocmVhZFxuICogQHBhcmFtIGZ1bmN0aW9uSWQgdGhlIGlkIG9mIGEgZnVuY3Rpb24gdG8gcmVxdWVzdFxuICogQHBhcmFtIG90aGVyRnVuY3Rpb25JZHMgYWRkaXRpb25hbCBpZHMgdG8gcmVxdWVzdCBmcm9tIHRoZSB3b3JrZXIgc2xhdmVcbiAqIEByZXR1cm5zIHRoZSBmdW5jdGlvbiByZXF1ZXN0IG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RGdW5jdGlvbk1lc3NhZ2UoZnVuY3Rpb25JZDogSUZ1bmN0aW9uSWQsIC4uLm90aGVyRnVuY3Rpb25JZHM6IElGdW5jdGlvbklkW10pOiBJRnVuY3Rpb25SZXF1ZXN0IHtcbiAgICByZXR1cm4geyBmdW5jdGlvbklkczogW2Z1bmN0aW9uSWQsIC4uLm90aGVyRnVuY3Rpb25JZHNdLCB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvblJlcXVlc3QgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gcmVzcG9uc2UgbWVzc2FnZSBjb250YWluaW5nIHRoZSBwYXNzZWQgZnVuY3Rpb24gZGVmaW5pdGlvbnNcbiAqIEBwYXJhbSBmdW5jdGlvbnMgdGhlIGZ1bmN0aW9uIGRlZmluaXRpb25zIHRvIHJlc3BvbmQgdG8gdGhlIHdvcmtlciBzbGF2ZVxuICogQHJldHVybnMgdGhlIGZ1bmN0aW9uIHJlc3BvbnNlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZ1bmN0aW9uUmVzcG9uc2VNZXNzYWdlKGZ1bmN0aW9uczogSUZ1bmN0aW9uRGVmaW5pdGlvbltdKTogSUZ1bmN0aW9uUmVzcG9uc2Uge1xuICAgIHJldHVybiB7IGZ1bmN0aW9ucywgdHlwZTogV29ya2VyTWVzc2FnZVR5cGUuRnVuY3Rpb25SZXNwb25zZSB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB3b3JrZXIgcmVzdWx0IG1lc3NhZ2UgZm9yIHRoZSBnaXZlbiByZXN1bHRcbiAqIEBwYXJhbSByZXN1bHQgdGhlIGNvbXB1dGVkIHJlc3VsdCBmb3IgdGhlIHNjaGVkdWxlZCB0YXNrXG4gKiBAcmV0dXJucyB0aGUgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gd29ya2VyUmVzdWx0TWVzc2FnZShyZXN1bHQ6IGFueSk6IElXb3JrZXJSZXN1bHRNZXNzYWdlIHtcbiAgICByZXR1cm4geyByZXN1bHQsIHR5cGU6IFdvcmtlck1lc3NhZ2VUeXBlLldvcmtlclJlc3VsdCB9O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiBleGVjdXRpb24gZXJyb3IgbWVzc2FnZSBjb250YWluaW5nIHRoZSBnaXZlbiBlcnJvclxuICogQHBhcmFtIGVycm9yIHRoZSBlcnJvciBvYmplY3QgdGhyb3duIGJ5IHRoZSB0YXNrIGNvbXB1dGF0aW9uXG4gKiBAcmV0dXJucyB0aGUgbWVzc2FnZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZnVuY3Rpb25FeGVjdXRpb25FcnJvcihlcnJvcjogRXJyb3IpOiBJRnVuY3Rpb25FeGVjdXRpb25FcnJvciB7XG4gICAgbGV0IGVycm9yT2JqZWN0OiB7W3Byb3A6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuICAgIGZvciAoY29uc3QgcHJvcCBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhlcnJvcikpIHtcbiAgICAgICAgZXJyb3JPYmplY3RbcHJvcF0gPSBKU09OLnN0cmluZ2lmeSgoZXJyb3IgYXMgYW55KVtwcm9wXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgZXJyb3I6IGVycm9yT2JqZWN0LCB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvbkV4ZWN1dGlvbkVycm9yIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0b3AgbWVzc2FnZVxuICogQHJldHVybnMgdGhlIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3BNZXNzYWdlKCk6IElXb3JrZXJNZXNzYWdlIHtcbiAgICByZXR1cm4geyB0eXBlOiBXb3JrZXJNZXNzYWdlVHlwZS5TdG9wIH07XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElTY2hlZHVsZVRhc2tNZXNzYWdlfSBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGFuIHtAbGluayBJU2NoZWR1bGVUYXNrTWVzc2FnZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2NoZWR1bGVUYXNrKG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJU2NoZWR1bGVUYXNrTWVzc2FnZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuU2NoZWR1bGVUYXNrO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGFuIHtAbGluayBJSW5pdGlhbGl6ZVdvcmtlck1lc3NhZ2V9IG1lc3NhZ2VcbiAqIEBwYXJhbSBtZXNzYWdlIHRoZSBtZXNzYWdlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSB7QGNvZGUgdHJ1ZX0gaWYgdGhlIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElJbml0aWFsaXplV29ya2VyTWVzc2FnZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5pdGlhbGl6ZU1lc3NhZ2UobWVzc2FnZTogSVdvcmtlck1lc3NhZ2UpOiBtZXNzYWdlIGlzIElJbml0aWFsaXplV29ya2VyTWVzc2FnZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuSW5pdGlhbGl6ZVdvcmtlcjtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uUmVxdWVzdH0gbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uUmVxdWVzdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb25SZXF1ZXN0KG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJRnVuY3Rpb25SZXF1ZXN0IHtcbiAgICByZXR1cm4gbWVzc2FnZS50eXBlID09PSBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvblJlcXVlc3Q7XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElGdW5jdGlvblJlc3BvbnNlfSBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGFuIHtAbGluayBJRnVuY3Rpb25SZXNwb25zZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb25SZXNwb25zZShtZXNzYWdlOiBJV29ya2VyTWVzc2FnZSk6IG1lc3NhZ2UgaXMgSUZ1bmN0aW9uUmVzcG9uc2Uge1xuICAgIHJldHVybiBtZXNzYWdlLnR5cGUgPT09IFdvcmtlck1lc3NhZ2VUeXBlLkZ1bmN0aW9uUmVzcG9uc2U7XG59XG5cbi8qKlxuICogVGVzdHMgaWYgdGhlIGdpdmVuIG1lc3NhZ2UgaXMgYW4ge0BsaW5rIElXb3JrZXJSZXN1bHRNZXNzYWdlfSBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGFuIHtAbGluayBJV29ya2VyUmVzdWx0TWVzc2FnZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzV29ya2VyUmVzdWx0KG1lc3NhZ2U6IElXb3JrZXJNZXNzYWdlKTogbWVzc2FnZSBpcyBJV29ya2VyUmVzdWx0TWVzc2FnZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UudHlwZSA9PT0gV29ya2VyTWVzc2FnZVR5cGUuV29ya2VyUmVzdWx0O1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGFuIHtAbGluayBJRnVuY3Rpb25FeGVjdXRpb25FcnJvcn0gbWVzc2FnZVxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IHtAY29kZSB0cnVlfSBpZiB0aGUgbWVzc2FnZSBpcyBhbiB7QGxpbmsgSUZ1bmN0aW9uRXhlY3V0aW9uRXJyb3J9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uRXhlY3V0aW9uRXJyb3IobWVzc2FnZTogSVdvcmtlck1lc3NhZ2UpOiBtZXNzYWdlIGlzIElGdW5jdGlvbkV4ZWN1dGlvbkVycm9yIHtcbiAgICByZXR1cm4gbWVzc2FnZS50eXBlID09PSBXb3JrZXJNZXNzYWdlVHlwZS5GdW5jdGlvbkV4ZWN1dGlvbkVycm9yO1xufVxuXG4vKipcbiAqIFRlc3RzIGlmIHRoZSBnaXZlbiBtZXNzYWdlIGlzIGEgc3RvcCBtZXNzYWdlXG4gKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0ge0Bjb2RlIHRydWV9IGlmIHRoZSBtZXNzYWdlIGlzIGEgc3RvcCBtZXNzYWdlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1N0b3BNZXNzc2FnZShtZXNzYWdlOiBJV29ya2VyTWVzc2FnZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtZXNzYWdlLnR5cGUgPT09IFdvcmtlck1lc3NhZ2VUeXBlLlN0b3A7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3dvcmtlci93b3JrZXItbWVzc2FnZXMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3dvcmtlci93b3JrZXItbWVzc2FnZXMudHMiLCJpbXBvcnQge2lzU3RvcE1lc3NzYWdlfSBmcm9tIFwiLi4vLi4vY29tbW9uL3dvcmtlci93b3JrZXItbWVzc2FnZXNcIjtcbmltcG9ydCB7RGVmYXVsdEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlLCBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZX0gZnJvbSBcIi4vYnJvd3Nlci13b3JrZXItc2xhdmUtc3RhdGVzXCI7XG5pbXBvcnQge1NsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZX0gZnJvbSBcIi4uLy4uL2NvbW1vbi9mdW5jdGlvbi9zbGF2ZS1mdW5jdGlvbi1sb29rdXAtdGFibGVcIjtcblxuZGVjbGFyZSBmdW5jdGlvbiBwb3N0TWVzc2FnZShkYXRhOiBhbnkpOiB2b2lkO1xuXG4vKipcbiAqIFdvcmtlciB0aHJlYWQgZW5kcG9pbnQgZXhlY3V0ZWQgaW4gdGhlIHdlYiB3b3JrZXIgdGhyZWFkLlxuICogRXhlY3V0ZXMgdGhlIHRhc2tzIGFzc2lnbmVkIGJ5IHRoZSB0aHJlYWQgcG9vbCB2aWEgdGhlIHtAbGluayBCcm93c2VyV29ya2VyVGhyZWFkfS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJyb3dzZXJXb3JrZXJTbGF2ZSB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdW5pcXVlIGlkIG9mIHRoZSBzbGF2ZSBpbnN0YW5jZVxuICAgICAqL1xuICAgIHB1YmxpYyBpZDogbnVtYmVyID0gTnVtYmVyLk5hTjtcblxuICAgIHByaXZhdGUgc3RhdGU6IEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlID0gbmV3IERlZmF1bHRCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzKTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBmdW5jdGlvbkNhY2hlOiBTbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhlIHN0YXRlIG9mIHRoZSBzbGF2ZSB0byB0aGUgbmV3IHN0YXRlXG4gICAgICogQHBhcmFtIHN0YXRlIHRoZSBuZXcgc3RhdGUgdG8gYXNzaWduXG4gICAgICovXG4gICAgcHVibGljIGNoYW5nZVN0YXRlKHN0YXRlOiBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMuc3RhdGUuZW50ZXIoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlZCB3aGVuIHRoZSBzbGF2ZSByZWNlaXZlcyBhIG1lc3NhZ2UgZnJvbSB0aGUgdWktdGhyZWFkXG4gICAgICogQHBhcmFtIGV2ZW50IHRoZSByZWNlaXZlZCBtZXNzYWdlXG4gICAgICovXG4gICAgcHVibGljIG9uTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChpc1N0b3BNZXNzc2FnZShldmVudC5kYXRhKSkge1xuICAgICAgICAgICAgY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5vbk1lc3NhZ2UoZXZlbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1lc3NhZ2Ugd2l0aCB0eXBlICR7ZXZlbnQuZGF0YS50eXBlfSBjYW5ub3QgYmUgaGFuZGxlZCBieSBzbGF2ZSAke3RoaXN9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcG9zdE1lc3NhZ2UobWVzc2FnZTogYW55KTogdm9pZCB7XG4gICAgICAgIHBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYEJyb3dzZXJTbGF2ZSB7IGlkOiAke3RoaXMuaWR9LCBzdGF0ZTogJyR7dGhpcy5zdGF0ZS5uYW1lfScgfWA7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2Jyb3dzZXIvd29ya2VyLXNsYXZlL2Jyb3dzZXItd29ya2VyLXNsYXZlLnRzIiwiaW1wb3J0IHtJRnVuY3Rpb25Mb29rdXBUYWJsZX0gZnJvbSBcIi4vZnVuY3Rpb24tbG9va3VwLXRhYmxlXCI7XG5pbXBvcnQge0lGdW5jdGlvbkRlZmluaXRpb259IGZyb20gXCIuL2Z1bmN0aW9uLWRlZmludGlvblwiO1xuaW1wb3J0IHtJRnVuY3Rpb25JZH0gZnJvbSBcIi4vZnVuY3Rpb24taWRcIjtcbmltcG9ydCB7U2ltcGxlTWFwfSBmcm9tIFwiLi4vdXRpbC9zaW1wbGUtbWFwXCI7XG5cbi8qKlxuICogQ2FjaGUgdXNlZCBieSBlYWNoIHdvcmtlciBzbGF2ZSB0byBjYWNoZSB0aGUgcmVjZWl2ZWQgZnVuY3Rpb25zLlxuICogQ2FjaGluZyB0aGUgZnVuY3Rpb25zIGhhcyB0aGUgYWR2YW50YWdlIHRoYXQgZnVuY3Rpb24gb25seSBpcyBzZXJpYWxpemVkLCB0cmFuc21pdHRlZCBhbmQgZGVzZXJpYWxpemVkIG9uY2UuIFRoaXMgYWxzb1xuICogaGFzIHRoZSBhZHZhbnRhZ2UsIHRoYXQgdGhlIGZ1bmN0aW9uIGluc3RhbmNlIHN0YXlzIHRoZSBzYW1lIGFuZCB0aGVyZWZvcmUgY2FuIGJlIG9wdGltaXplZCBieSB0aGUgcnVudGltZSBzeXN0ZW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBTbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUgaW1wbGVtZW50cyBJRnVuY3Rpb25Mb29rdXBUYWJsZSB7XG4gICAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBTaW1wbGVNYXA8c3RyaW5nLCBGdW5jdGlvbj4oKTtcblxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIHRoZSBmdW5jaXRvbiB3aXRoIHRoZSBnaXZuZSBpZFxuICAgICAqIEBwYXJhbSBpZCB0aGUgaWQgb2YgdGhlIGZ1bmN0aW9uIHRvIHJlc29sdmVcbiAgICAgKiBAcmV0dXJucyB0aGUgcmVzb2x2ZWQgZnVuY3Rpb24gb3IgdW5kZWZpbmVkIGlmIG5vdCBrbm93blxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRGdW5jdGlvbihpZDogSUZ1bmN0aW9uSWQpOiBGdW5jdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldChpZC5pZGVudGlmaWVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcnMgYSBuZXcgZnVuY3Rpb24gaW4gdGhlIGNhY2hlXG4gICAgICogQHBhcmFtIGRlZmluaXRpb24gdGhlIGRlZmluaXRpb24gb2YgdGhlIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG4gICAgICogQHJldHVybnMgdGhlIHJlZ2lzdGVyZWQgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVnaXN0ZXJGdW5jdGlvbihkZWZpbml0aW9uOiBJRnVuY3Rpb25EZWZpbml0aW9uKTogRnVuY3Rpb24ge1xuICAgICAgICBjb25zdCBmID0gRnVuY3Rpb24uYXBwbHkobnVsbCwgWy4uLmRlZmluaXRpb24uYXJndW1lbnROYW1lcywgZGVmaW5pdGlvbi5ib2R5XSk7XG4gICAgICAgIHRoaXMuY2FjaGUuc2V0KGRlZmluaXRpb24uaWQuaWRlbnRpZmllciwgZik7XG4gICAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWdpc3RlclN0YXRpY0Z1bmN0aW9uKGlkOiBJRnVuY3Rpb25JZCwgZnVuYzogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKGlkKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZ2l2ZW4gZnVuY3Rpb24gaWQgJyR7aWQuaWRlbnRpZmllcn0nIGlzIGFscmVhZHkgdXNlZCBieSBhbm90aGVyIGZ1bmN0aW9uIHJlZ2lzdHJhdGlvbiwgdGhlIGlkIG5lZWRzIHRvIGJlIHVuaXF1ZS5gKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhY2hlLnNldChpZC5pZGVudGlmaWVyLCBmdW5jKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBpZiB0aGUgY2FjaGUgY29udGFpbnMgYSBmdW5jdGlvbiB3aXRoIHRoZSBnaXZlbiBpZFxuICAgICAqIEBwYXJhbSBpZCB0aGUgaWQgb2YgdGhlIGZ1bmN0aW9uIHRvIHRlc3QgZm9yIGV4aXN0ZW5jZVxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGNhY2hlIGNvbnRhaW5zIGEgZnVuY3Rpb24gd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzKGlkOiBJRnVuY3Rpb25JZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZS5oYXMoaWQuaWRlbnRpZmllcik7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2NvbW1vbi9mdW5jdGlvbi9zbGF2ZS1mdW5jdGlvbi1sb29rdXAtdGFibGUudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL3NsYXZlLWZ1bmN0aW9uLWxvb2t1cC10YWJsZS50cyIsImltcG9ydCB7SUZ1bmN0aW9uTG9va3VwVGFibGV9IGZyb20gXCIuLi8uLi9mdW5jdGlvbi9mdW5jdGlvbi1sb29rdXAtdGFibGVcIjtcbmltcG9ydCB7UGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkc30gZnJvbSBcIi4vcGFyYWxsZWwtd29ya2VyLWZ1bmN0aW9uc1wiO1xuaW1wb3J0IHtpZGVudGl0eX0gZnJvbSBcIi4uLy4uL3V0aWwvaWRlbnRpdHlcIjtcbmltcG9ydCB7ZmlsdGVySXRlcmF0b3J9IGZyb20gXCIuL2ZpbHRlci1pdGVyYXRvclwiO1xuaW1wb3J0IHttYXBJdGVyYXRvcn0gZnJvbSBcIi4vbWFwLWl0ZXJhdG9yXCI7XG5pbXBvcnQge3BhcmFsbGVsSm9iRXhlY3V0b3J9IGZyb20gXCIuL3BhcmFsbGVsLWpvYi1leGVjdXRvclwiO1xuaW1wb3J0IHtyYW5nZUl0ZXJhdG9yfSBmcm9tIFwiLi9yYW5nZS1pdGVyYXRvclwiO1xuaW1wb3J0IHtyZWR1Y2VJdGVyYXRvcn0gZnJvbSBcIi4vcmVkdWNlLWl0ZXJhdG9yXCI7XG5pbXBvcnQge3RvSXRlcmF0b3J9IGZyb20gXCIuLi8uLi91dGlsL2FycmF5c1wiO1xuXG4vKipcbiAqIFJlZ2lzdGVycyB0aGUgc3RhdGljIHBhcmFsbGVsIGZ1bmN0aW9uc1xuICogQHBhcmFtIGxvb2t1cFRhYmxlIHRoZSB0YWJsZSBpbnRvIHdoaWNoIHRoZSBmdW5jdGlvbiBzaG91bGQgYmUgcmVnaXN0ZXJlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJTdGF0aWNQYXJhbGxlbEZ1bmN0aW9ucyhsb29rdXBUYWJsZTogSUZ1bmN0aW9uTG9va3VwVGFibGUpIHtcbiAgICBsb29rdXBUYWJsZS5yZWdpc3RlclN0YXRpY0Z1bmN0aW9uKFBhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHMuSURFTlRJVFksIGlkZW50aXR5KTtcbiAgICBsb29rdXBUYWJsZS5yZWdpc3RlclN0YXRpY0Z1bmN0aW9uKFBhcmFsbGVsV29ya2VyRnVuY3Rpb25JZHMuRklMVEVSLCBmaWx0ZXJJdGVyYXRvcik7XG4gICAgbG9va3VwVGFibGUucmVnaXN0ZXJTdGF0aWNGdW5jdGlvbihQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzLk1BUCwgbWFwSXRlcmF0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5QQVJBTExFTF9KT0JfRVhFQ1VUT1IsIHBhcmFsbGVsSm9iRXhlY3V0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5SQU5HRSwgcmFuZ2VJdGVyYXRvcik7XG4gICAgbG9va3VwVGFibGUucmVnaXN0ZXJTdGF0aWNGdW5jdGlvbihQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzLlJFRFVDRSwgcmVkdWNlSXRlcmF0b3IpO1xuICAgIGxvb2t1cFRhYmxlLnJlZ2lzdGVyU3RhdGljRnVuY3Rpb24oUGFyYWxsZWxXb3JrZXJGdW5jdGlvbklkcy5UT19JVEVSQVRPUiwgdG9JdGVyYXRvcik7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHMiLCJpbXBvcnQge0Z1bmN0aW9uQ2FsbERlc2VyaWFsaXplcn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9mdW5jdGlvbi9mdW5jdGlvbi1jYWxsLWRlc2VyaWFsaXplclwiO1xuaW1wb3J0IHtJVGFza0RlZmluaXRpb259IGZyb20gXCIuLi8uLi9jb21tb24vdGFzay90YXNrLWRlZmluaXRpb25cIjtcbmltcG9ydCB7SUZ1bmN0aW9uRGVmaW5pdGlvbn0gZnJvbSBcIi4uLy4uL2NvbW1vbi9mdW5jdGlvbi9mdW5jdGlvbi1kZWZpbnRpb25cIjtcbmltcG9ydCB7XG4gICAgZnVuY3Rpb25FeGVjdXRpb25FcnJvciwgaXNGdW5jdGlvblJlc3BvbnNlLCBpc0luaXRpYWxpemVNZXNzYWdlLCBpc1NjaGVkdWxlVGFzaywgcmVxdWVzdEZ1bmN0aW9uTWVzc2FnZSxcbiAgICB3b3JrZXJSZXN1bHRNZXNzYWdlIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi93b3JrZXIvd29ya2VyLW1lc3NhZ2VzXCI7XG5pbXBvcnQge0Jyb3dzZXJXb3JrZXJTbGF2ZX0gZnJvbSBcIi4vYnJvd3Nlci13b3JrZXItc2xhdmVcIjtcblxuLyoqXG4gKiBTdGF0ZSBvZiB0aGUgYnJvd3NlciB3b3JrZXIgc2xhdmUuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHJvdGVjdGVkIHNsYXZlOiBCcm93c2VyV29ya2VyU2xhdmUpIHt9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlZCB3aGVuIHRoZSBzbGF2ZSBjaGFuZ2VzIGl0cyBzdGF0ZSB0byB0aGlzIHN0YXRlLlxuICAgICAqL1xuICAgIHB1YmxpYyBlbnRlcigpOiB2b2lkIHtcbiAgICAgICAgLy8gaW50ZW50aW9uYWxseSBlbXB0eVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVkIHdoZW5ldmVyIHRoZSBzbGF2ZSByZWNlaXZlcyBhIG1lc3NhZ2UgZnJvbSB0aGUgdWktdGhyZWFkIHdoaWxlIGJlaW5nIGluIHRoaXMgc3RhdGVcbiAgICAgKiBAcGFyYW0gZXZlbnQgdGhlIHJlY2VpdmVkIG1lc3NhZ2VcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgc3RhdGUgaGFzIGhhbmRsZWQgdGhlIG1lc3NhZ2UsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cbn1cblxuLyoqXG4gKiBJbml0aWFsIHN0YXRlIG9mIGEgc2xhdmUuIFRoZSBzbGF2ZSBpcyB3YWl0aW5nIGZvciB0aGUgaW5pdGlhbGl6YXRpb24gbWVzc2FnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIERlZmF1bHRCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSBleHRlbmRzIEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIHtcbiAgICAgICBjb25zdHJ1Y3RvcihzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlKSB7XG4gICAgICAgIHN1cGVyKFwiRGVmYXVsdFwiLCBzbGF2ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChpc0luaXRpYWxpemVNZXNzYWdlKGV2ZW50LmRhdGEpKSB7XG4gICAgICAgICAgICB0aGlzLnNsYXZlLmlkID0gZXZlbnQuZGF0YS53b3JrZXJJZDtcbiAgICAgICAgICAgIHRoaXMuc2xhdmUuY2hhbmdlU3RhdGUobmV3IElkbGVCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzLnNsYXZlKSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBzbGF2ZSBpcyB3YWl0aW5nIGZvciB3b3JrIGZyb20gdGhlIHVpLXRocmVhZC5cbiAqL1xuZXhwb3J0IGNsYXNzIElkbGVCcm93c2VyV29ya2VyU2xhdmVTdGF0ZSBleHRlbmRzIEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIHtcbiAgICBjb25zdHJ1Y3RvcihzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlKSB7XG4gICAgICAgIHN1cGVyKFwiSWRsZVwiLCBzbGF2ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uTWVzc2FnZShldmVudDogTWVzc2FnZUV2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghaXNTY2hlZHVsZVRhc2soZXZlbnQuZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhc2s6IElUYXNrRGVmaW5pdGlvbiA9IGV2ZW50LmRhdGEudGFzaztcbiAgICAgICAgY29uc3QgbWlzc2luZ0Z1bmN0aW9ucyA9IHRhc2sudXNlZEZ1bmN0aW9uSWRzLmZpbHRlcihpZCA9PiAhdGhpcy5zbGF2ZS5mdW5jdGlvbkNhY2hlLmhhcyhpZCkpO1xuXG4gICAgICAgIGlmIChtaXNzaW5nRnVuY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5jaGFuZ2VTdGF0ZShuZXcgRXhlY3V0ZUZ1bmN0aW9uQnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcy5zbGF2ZSwgdGFzaykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgWyBoZWFkLCAuLi50YWlsIF0gPSBtaXNzaW5nRnVuY3Rpb25zO1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5wb3N0TWVzc2FnZShyZXF1ZXN0RnVuY3Rpb25NZXNzYWdlKGhlYWQsIC4uLnRhaWwpKTtcbiAgICAgICAgICAgIHRoaXMuc2xhdmUuY2hhbmdlU3RhdGUobmV3IFdhaXRpbmdGb3JGdW5jdGlvbkRlZmluaXRpb25Ccm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzLnNsYXZlLCB0YXNrKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIHNsYXZlIGlzIHdhaXRpbmcgZm9yIHRoZSBkZWZpbml0aW9uIG9mIHRoZSByZXF1ZXN0ZWQgZnVuY3Rpb24gdGhhdCBpcyBuZWVkZWQgdG8gZXhlY3V0ZSB0aGUgYXNzaWduZWQgdGFzay5cbiAqL1xuZXhwb3J0IGNsYXNzIFdhaXRpbmdGb3JGdW5jdGlvbkRlZmluaXRpb25Ccm93c2VyV29ya2VyU2xhdmVTdGF0ZSBleHRlbmRzIEJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIHtcbiAgICBjb25zdHJ1Y3RvcihzbGF2ZTogQnJvd3NlcldvcmtlclNsYXZlLCBwcml2YXRlIHRhc2s6IElUYXNrRGVmaW5pdGlvbikge1xuICAgICAgICBzdXBlcihcIldhaXRpbmdGb3JGdW5jdGlvbkRlZmluaXRpb25cIiwgc2xhdmUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk1lc3NhZ2UoZXZlbnQ6IE1lc3NhZ2VFdmVudCk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb25SZXNwb25zZShtZXNzYWdlKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBkZWZpbml0aW9uIG9mIG1lc3NhZ2UuZnVuY3Rpb25zIGFzIElGdW5jdGlvbkRlZmluaXRpb25bXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xhdmUuZnVuY3Rpb25DYWNoZS5yZWdpc3RlckZ1bmN0aW9uKGRlZmluaXRpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNsYXZlLmNoYW5nZVN0YXRlKG5ldyBFeGVjdXRlRnVuY3Rpb25Ccm93c2VyV29ya2VyU2xhdmVTdGF0ZSh0aGlzLnNsYXZlLCB0aGlzLnRhc2spKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhlIHNsYXZlIGlzIGV4ZWN1dGluZyB0aGUgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNsYXNzIEV4ZWN1dGVGdW5jdGlvbkJyb3dzZXJXb3JrZXJTbGF2ZVN0YXRlIGV4dGVuZHMgQnJvd3NlcldvcmtlclNsYXZlU3RhdGUge1xuICAgIGNvbnN0cnVjdG9yKHNsYXZlOiBCcm93c2VyV29ya2VyU2xhdmUsIHByaXZhdGUgdGFzazogSVRhc2tEZWZpbml0aW9uKSB7XG4gICAgICAgIHN1cGVyKFwiRXhlY3V0aW5nXCIsIHNsYXZlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZW50ZXIoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZ1bmN0aW9uRGVzZXJpYWxpemVyID0gbmV3IEZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplcih0aGlzLnNsYXZlLmZ1bmN0aW9uQ2FjaGUpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBtYWluID0gZnVuY3Rpb25EZXNlcmlhbGl6ZXIuZGVzZXJpYWxpemVGdW5jdGlvbkNhbGwodGhpcy50YXNrLm1haW4pO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbWFpbih7ZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyOiBmdW5jdGlvbkRlc2VyaWFsaXplcn0pO1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5wb3N0TWVzc2FnZSh3b3JrZXJSZXN1bHRNZXNzYWdlKHJlc3VsdCkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5zbGF2ZS5wb3N0TWVzc2FnZShmdW5jdGlvbkV4ZWN1dGlvbkVycm9yKGVycm9yKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNsYXZlLmNoYW5nZVN0YXRlKG5ldyBJZGxlQnJvd3NlcldvcmtlclNsYXZlU3RhdGUodGhpcy5zbGF2ZSkpO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9icm93c2VyL3dvcmtlci1zbGF2ZS9icm93c2VyLXdvcmtlci1zbGF2ZS1zdGF0ZXMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvYnJvd3Nlci93b3JrZXItc2xhdmUvYnJvd3Nlci13b3JrZXItc2xhdmUtc3RhdGVzLnRzIiwiaW1wb3J0IHtJRnVuY3Rpb25Mb29rdXBUYWJsZX0gZnJvbSBcIi4vZnVuY3Rpb24tbG9va3VwLXRhYmxlXCI7XG5pbXBvcnQge0lTZXJpYWxpemVkRnVuY3Rpb25DYWxsLCBpc1NlcmlhbGl6ZWRGdW5jdGlvbkNhbGx9IGZyb20gXCIuL3NlcmlhbGl6ZWQtZnVuY3Rpb24tY2FsbFwiO1xuXG4vKipcbiAqIERlc2VyaWFsaXplciBmb3IgYSB7QGxpbmsgSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGx9LlxuICovXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGRlc2VyaWFsaXplciB0aGF0IHVzZXMgdGhlIGdpdmVuIGZ1bmN0aW9uIGxvb2t1cCB0YWJsZSB0byByZXRyaWV2ZSB0aGUgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gaWRcbiAgICAgKiBAcGFyYW0gZnVuY3Rpb25Mb29rdXBUYWJsZSB0aGUgbG9va3VwIHRhYmxlIHRvIHVzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZnVuY3Rpb25Mb29rdXBUYWJsZTogSUZ1bmN0aW9uTG9va3VwVGFibGUpIHt9XG5cbiAgICAvKipcbiAgICAgKiBEZXNlcmlhbGl6ZXMgdGhlIGZ1bmN0aW9uIGNhbGwgaW50byBhIGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIGZ1bmN0aW9uQ2FsbCB0aGUgZnVuY3Rpb24gY2FsbCB0byBkZXNlcmlhbGl6ZVxuICAgICAqIEBwYXJhbSBkZXNlcmlhbGl6ZVBhcmFtcyBpbmRpY2F0b3IgaWYgdGhlIHBhcmFtZXRlcnMgcGFzc2VkIHRvIHRoZSBzZXJpYWxpemVkIGZ1bmN0aW9uIHNob3VsZCBiZSBkZXNlcmFpbGl6ZWQgdG9vXG4gICAgICogQHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGNhbiBiZSBjYWxsZWQgd2l0aCBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgKHRoZSBwYXJhbXMgZnJvbSB0aGUgc2VyaWFsaXplZCBmdW5jdGlvbiBjYWxscyBhcmUgcHJlcGVuZGVkIHRvIHRoZSBwYXNzZWQgcGFyYW1ldGVycylcbiAgICAgKi9cbiAgICBwdWJsaWMgZGVzZXJpYWxpemVGdW5jdGlvbkNhbGw8VFJlc3VsdD4oZnVuY3Rpb25DYWxsOiBJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCwgZGVzZXJpYWxpemVQYXJhbXMgPSBmYWxzZSk6ICguLi5hZGRpdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4gVFJlc3VsdCB7XG4gICAgICAgIGNvbnN0IGZ1bmMgPSB0aGlzLmZ1bmN0aW9uTG9va3VwVGFibGUuZ2V0RnVuY3Rpb24oZnVuY3Rpb25DYWxsLmZ1bmN0aW9uSWQpO1xuICAgICAgICBpZiAoIWZ1bmMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIGZ1bmN0aW9uIHdpdGggdGhlIGlkICR7ZnVuY3Rpb25DYWxsLmZ1bmN0aW9uSWQuaWRlbnRpZmllcn0gY291bGQgbm90IGJlIHJldHJpZXZlZCB3aGlsZSBkZXNlcmlhbGl6aW5nIHRoZSBmdW5jdGlvbiBjYWxsLiBJcyB0aGUgZnVuY3Rpb24gY29ycmVjdGx5IHJlZ2lzdGVyZWQ/YCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGFyYW1zID0gZnVuY3Rpb25DYWxsLnBhcmFtZXRlcnMgfHwgW107XG5cbiAgICAgICAgaWYgKGRlc2VyaWFsaXplUGFyYW1zKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMubWFwKHBhcmFtID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsKHBhcmFtKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kZXNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbChwYXJhbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hZGRpdGlvbmFsUGFyYW1zOiBhbnlbXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMuY29uY2F0KGFkZGl0aW9uYWxQYXJhbXMpKSBhcyBUUmVzdWx0O1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24tY2FsbC1kZXNlcmlhbGl6ZXIudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWNhbGwtZGVzZXJpYWxpemVyLnRzIiwiLyoqXG4gKiBAbW9kdWxlIHBhcmFsbGVsXG4gKi9cbi8qKiAqL1xuXG4vKipcbiAqIElkZW50aWZpZXIgZm9yIGEgc2VyaWFsaXplZCBmdW5jdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvbklkIHtcbiAgICAvKipcbiAgICAgKiBUaGUgZ2xvYmFsbHkgdW5pcXVlIGlkZW50aWZpZXJcbiAgICAgKi9cbiAgICBpZGVudGlmaWVyOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBGbGFnIHRoYXQgaW5kaWNhdGVzIHRoYXQgdGhpcyBpcyBhIGZ1bmN0aW9uIGlkXG4gICAgICovXG4gICAgX19fX19fX2lzRnVuY3Rpb25JZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gaWRcbiAqIEBwYXJhbSBuYW1lc3BhY2UgdGhlIG5hbWVzcGFjZSBvZiB0aGUgaWRcbiAqIEBwYXJhbSBpZCB0aGUgdW5pcXVlIGlkIGZvciB0aGlzIG5hbWVzcGFjZVxuICogQHJldHVybnMgdGhlIGZ1bmN0aW9uIGlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmdW5jdGlvbklkKG5hbWVzcGFjZTogc3RyaW5nLCBpZDogbnVtYmVyKTogSUZ1bmN0aW9uSWQge1xuICAgIHJldHVybiB7XG4gICAgICAgIF9fX19fX19pc0Z1bmN0aW9uSWQ6IHRydWUsXG4gICAgICAgIGlkZW50aWZpZXI6IGAke25hbWVzcGFjZX0tJHtpZH1gXG4gICAgfTtcbn1cblxuLyoqXG4gKiBUZXN0cyBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgZnVuY3Rpb24gaWRcbiAqIEBwYXJhbSBvYmogdGhlIG9iamVjdCB0byB0ZXN0IGZvclxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgb2JqZWN0IGlzICBhIGZ1bmN0aW9uIGlkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uSWQob2JqOiBhbnkpOiBvYmogaXMgSUZ1bmN0aW9uSWQge1xuICAgIHJldHVybiAhIW9iaiAmJiBvYmouX19fX19fX2lzRnVuY3Rpb25JZCA9PT0gdHJ1ZTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vZnVuY3Rpb24vZnVuY3Rpb24taWQudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL2Z1bmN0aW9uL2Z1bmN0aW9uLWlkLnRzIiwiaW1wb3J0IHtJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnR9IGZyb20gXCIuLi9cIjtcbi8qKlxuICogUmV0dXJucyBhIG5ldyBpdGVyYXRvciB0aGF0IG9ubHkgY29udGFpbnMgYWxsIGVsZW1lbnRzIGZvciB3aGljaCB0aGUgZ2l2ZW4gcHJlZGljYXRlIHJldHVybnMgdHJ1ZVxuICogQHBhcmFtIGl0ZXJhdG9yIHRoZSBpdGVyYXRvciB0byBmaWx0ZXJcbiAqIEBwYXJhbSBwcmVkaWNhdGUgdGhlIHByZWRpY2F0ZSB0byB1c2UgZm9yIGZpbHRlcmluZyB0aGUgZWxlbWVudHNcbiAqIEBwYXJhbSBlbnYgdGhlIGVudmlyb25tZW50IG9mIHRoZSBqb2JcbiAqIEBwYXJhbSBUIHR5cGUgb2YgdGhlIGVsZW1lbnRzIHRvIGZpbHRlclxuICogQHJldHVybnMgYW4gaXRlcmF0b3Igb25seSBjb250YWluaW5nIHRoZSBlbGVtZW50cyB3aGVyZSB0aGUgcHJlZGljYXRlIGlzIHRydWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckl0ZXJhdG9yPFQ+KGl0ZXJhdG9yOiBJdGVyYXRvcjxUPiwgcHJlZGljYXRlOiAodGhpczogdm9pZCwgdmFsdWU6IFQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KSA9PiBib29sZWFuLCBlbnY6IElQYXJhbGxlbFRhc2tFbnZpcm9ubWVudCk6IEl0ZXJhdG9yPFQ+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuZXh0KCkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnQ6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tY29uZGl0aW9uYWwtYXNzaWdubWVudCAqL1xuICAgICAgICAgICAgd2hpbGUgKCEoY3VycmVudCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcmVkaWNhdGUoY3VycmVudC52YWx1ZSwgZW52KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvZmlsdGVyLWl0ZXJhdG9yLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9maWx0ZXItaXRlcmF0b3IudHMiLCJpbXBvcnQge0lQYXJhbGxlbFRhc2tFbnZpcm9ubWVudH0gZnJvbSBcIi4uL1wiO1xuLyoqXG4gKiBQZXJmb3JtcyB0aGUgbWFwIG9wZXJhdGlvblxuICogQHBhcmFtIGl0ZXJhdG9yIHRoZSBpdGVyYXRvciBvZiB0aGUgcHJldmlvdXMgc3RlcFxuICogQHBhcmFtIGl0ZXJhdGVlIHRoZSBpdGVyYXRlZSB0byBhcHBseSB0byBlYWNoIGVsZW1lbnQgaW4gdGhlIGl0ZXJhdG9yXG4gKiBAcGFyYW0gZW52IHRoZSBlbnZpcm9ubWVudCBvZiB0aGUgam9iXG4gKiBAcGFyYW0gVCB0aGUgdHlwZSBvZiB0aGUgaW5wdXQgZWxlbWVudHNcbiAqIEBwYXJhbSBUUmVzdWx0IHRoZSB0eXBlIG9mIHRoZSByZXR1cm5lZCBlbGVtZW50IG9mIHRoZSBpdGVyYXRlZVxuICogQHJldHVybnMgYSBuZXcgaXRlcmF0b3Igd2hlcmUgZWFjaCBlbGVtZW50IGhhcyBiZWVuIG1hcHBlZCB1c2luZyB0aGUgaXRlcmF0ZWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcEl0ZXJhdG9yPFQsIFRSZXN1bHQ+KGl0ZXJhdG9yOiBJdGVyYXRvcjxUPiwgaXRlcmF0ZWU6ICh0aGlzOiB2b2lkLCB2YWx1ZTogVCwgZW52OiBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnQpID0+IFRSZXN1bHQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KTogSXRlcmF0b3I8VFJlc3VsdD4ge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VFJlc3VsdD4ge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9IGFzIEl0ZXJhdG9yUmVzdWx0PFRSZXN1bHQ+O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkb25lOiByZXN1bHQuZG9uZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogaXRlcmF0ZWUocmVzdWx0LnZhbHVlLCBlbnYpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvbWFwLWl0ZXJhdG9yLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9tYXAtaXRlcmF0b3IudHMiLCJpbXBvcnQge3RvQXJyYXl9IGZyb20gXCIuLi8uLi91dGlsL2FycmF5c1wiO1xuaW1wb3J0IHtGdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXJ9IGZyb20gXCIuLi8uLi9mdW5jdGlvbi9mdW5jdGlvbi1jYWxsLWRlc2VyaWFsaXplclwiO1xuaW1wb3J0IHtJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCwgaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsfSBmcm9tIFwiLi4vLi4vZnVuY3Rpb24vc2VyaWFsaXplZC1mdW5jdGlvbi1jYWxsXCI7XG5pbXBvcnQge0lTZXJpYWxpemVkUGFyYWxsZWxPcGVyYXRpb24sIElQYXJhbGxlbEVudmlyb25tZW50LCBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnR9IGZyb20gXCIuLi9cIjtcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBwYXJhbGxlbCBvcGVyYXRpb24gdG8gcGVyZm9ybVxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQYXJhbGxlbEpvYkRlZmluaXRpb24ge1xuICAgIC8qKlxuICAgICAqIFRoZSBnZW5lcmF0b3IgdGhhdCBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgYXJyYXkgdGhhdCBpcyBcIm1hbmlwdWxhdGVkXCIgYnkgYXBwbHlpbmcgdGhlIGdpdmVuIGFjdGlvbnMuXG4gICAgICovXG4gICAgZ2VuZXJhdG9yOiBJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvcGVyYXRpb25zIHRvIHBlcmZvcm0gb24gdGhlIGFycmF5IGVsZW1lbnRzXG4gICAgICovXG4gICAgb3BlcmF0aW9uczogSVNlcmlhbGl6ZWRQYXJhbGxlbE9wZXJhdGlvbltdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGVudmlyb25tZW50cy4gT2JqZWN0IGhhc2ggdGhhdCBpcyBwYXNzZWQgdG8gYWxsIGl0ZXJhdGVlIGZ1bmN0aW9ucyBhbmQgYWxsb3dzIHRvIGFjY2VzcyBleHRlcm5hbCBkYXRhXG4gICAgICovXG4gICAgZW52aXJvbm1lbnRzOiBBcnJheTxJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbCB8IElQYXJhbGxlbEVudmlyb25tZW50PjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBqb2ItcmVsYXRpdmUgaW5kZXggb2YgdGhlIHRhc2tcbiAgICAgKi9cbiAgICB0YXNrSW5kZXg6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgdmFsdWVzIHByb2Nlc3NlZCBieSBlYWNoIHRhc2sgKGF0IG1vc3QpXG4gICAgICovXG4gICAgdmFsdWVzUGVyVGFzazogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUYXNrRW52aXJvbm1lbnQoZGVmaW5pdGlvbjogSVBhcmFsbGVsSm9iRGVmaW5pdGlvbiwgZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyOiBGdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIpOiBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnQge1xuICAgIGxldCB0YXNrRW52aXJvbm1lbnQ6IElQYXJhbGxlbEVudmlyb25tZW50ID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGVudmlyb25tZW50IG9mIGRlZmluaXRpb24uZW52aXJvbm1lbnRzKSB7XG4gICAgICAgIGxldCBjdXJyZW50RW52aXJvbm1lbnQ6IElQYXJhbGxlbEVudmlyb25tZW50O1xuICAgICAgICBpZiAoaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsKGVudmlyb25tZW50KSkge1xuICAgICAgICAgICAgY3VycmVudEVudmlyb25tZW50ID0gZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyLmRlc2VyaWFsaXplRnVuY3Rpb25DYWxsKGVudmlyb25tZW50KSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudEVudmlyb25tZW50ID0gZW52aXJvbm1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0YXNrRW52aXJvbm1lbnQsIGN1cnJlbnRFbnZpcm9ubWVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHsgdGFza0luZGV4OiBkZWZpbml0aW9uLnRhc2tJbmRleCwgdmFsdWVzUGVyVGFzazogZGVmaW5pdGlvbi52YWx1ZXNQZXJUYXNrIH0sIHRhc2tFbnZpcm9ubWVudCk7XG59XG5cbi8qKlxuICogTWFpbiBjb29yZGluYXRpb24gZnVuY3Rpb24gZm9yIGFueSBvcGVyYXRpb24gcGVyZm9ybWVkIHVzaW5nIHtAbGluayBJUGFyYWxsZWx9LlxuICogQHBhcmFtIGRlZmluaXRpb24gdGhlIGRlZmluaXRpb24gb2YgdGhlIG9wZXJhdGlvbiB0byBwZXJmb3JtZWRcbiAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgcGFzc2VkIGZyb20gdGhlIHRocmVhZCBwb29sXG4gKiBAcGFyYW0gVCB0eXBlIG9mIHRoZSBlbGVtZW50cyBjcmVhdGVkIGJ5IHRoZSBnZW5lcmF0b3JcbiAqIEBwYXJhbSBUUmVzdWx0IHR5cGUgb2YgdGhlIHJlc3VsdGluZyBlbGVtZW50c1xuICogQHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uIGZyb20gdGhpcyB3b3JrZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsSm9iRXhlY3V0b3I8VCwgVFJlc3VsdD4oZGVmaW5pdGlvbjogSVBhcmFsbGVsSm9iRGVmaW5pdGlvbiwgeyBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIgfTogeyBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXI6IEZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplciB9KTogVFJlc3VsdFtdIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IGNyZWF0ZVRhc2tFbnZpcm9ubWVudChkZWZpbml0aW9uLCBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIpO1xuICAgIGNvbnN0IGdlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb25DYWxsRGVzZXJpYWxpemVyLmRlc2VyaWFsaXplRnVuY3Rpb25DYWxsKGRlZmluaXRpb24uZ2VuZXJhdG9yLCB0cnVlKTtcbiAgICBsZXQgaXRlcmF0b3IgPSBnZW5lcmF0b3JGdW5jdGlvbihlbnZpcm9ubWVudCkgYXMgSXRlcmF0b3I8VD47XG5cbiAgICBmb3IgKGNvbnN0IG9wZXJhdGlvbiBvZiBkZWZpbml0aW9uLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgY29uc3QgaXRlcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uQ2FsbERlc2VyaWFsaXplci5kZXNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbDxJdGVyYXRvcjxUPj4ob3BlcmF0aW9uLml0ZXJhdG9yKTtcbiAgICAgICAgY29uc3QgaXRlcmF0ZWUgPSBmdW5jdGlvbkNhbGxEZXNlcmlhbGl6ZXIuZGVzZXJpYWxpemVGdW5jdGlvbkNhbGwob3BlcmF0aW9uLml0ZXJhdGVlKTtcbiAgICAgICAgaXRlcmF0b3IgPSBpdGVyYXRvckZ1bmN0aW9uKGl0ZXJhdG9yLCBpdGVyYXRlZSwgZW52aXJvbm1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0FycmF5PFRSZXN1bHQ+KGl0ZXJhdG9yIGFzIGFueSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3BhcmFsbGVsLWpvYi1leGVjdXRvci50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcGFyYWxsZWwtam9iLWV4ZWN1dG9yLnRzIiwiaW1wb3J0IHtmdW5jdGlvbklkLCBJRnVuY3Rpb25JZH0gZnJvbSBcIi4uLy4uL2Z1bmN0aW9uL2Z1bmN0aW9uLWlkXCI7XG5cbmV4cG9ydCBjb25zdCBQYXJhbGxlbFdvcmtlckZ1bmN0aW9uSWRzID0ge1xuICAgIEZJTFRFUjogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDApIGFzIElGdW5jdGlvbklkLFxuICAgIElERU5USVRZOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgMSksXG4gICAgTUFQOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgMiksXG4gICAgUEFSQUxMRUxfSk9CX0VYRUNVVE9SOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgMyksXG4gICAgUkFOR0U6IGZ1bmN0aW9uSWQoXCJwYXJhbGxlbFwiLCA0KSxcbiAgICBSRURVQ0U6IGZ1bmN0aW9uSWQoXCJwYXJhbGxlbFwiLCA1KSxcbiAgICBUSU1FUzogZnVuY3Rpb25JZChcInBhcmFsbGVsXCIsIDYpLFxuICAgIFRPX0lURVJBVE9SOiBmdW5jdGlvbklkKFwicGFyYWxsZWxcIiwgNylcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3BhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3BhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnMudHMiLCIvKipcbiAqIEdlbmVyYXRvciBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgYW4gaXRlcmF0b3IgY29udGFpbmluZyBhbGwgZWxlbWVudHMgaW4gdGhlIHJhbmdlIFtzdGFydCwgZW5kKSB3aXRoIGEgc3RlcCBzaXplIG9mIHN0ZXAuXG4gKiBAcGFyYW0gc3RhcnQgc3RhcnQgdmFsdWUgb2YgdGhlIHJhbmdlIChpbmNsdXNpdmUpXG4gKiBAcGFyYW0gZW5kIGVuZCB2YWx1ZSBvZiB0aGUgcmFuZ2UgKGV4Y2x1c2l2ZSlcbiAqIEBwYXJhbSBzdGVwIHN0ZXAgc2l6ZSBiZXR3ZWVuIHR3byB2YWx1ZXNcbiAqIEByZXR1cm5zIGl0ZXJhdG9yIHdpdGggdGhlIHZhbHVlcyBbc3RhcnQsIGVuZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlSXRlcmF0b3Ioc3RhcnQ6IG51bWJlciwgZW5kOiBudW1iZXIsIHN0ZXA6IG51bWJlcik6IEl0ZXJhdG9yPG51bWJlcj4ge1xuICAgIGxldCBuZXh0ID0gc3RhcnQ7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxudW1iZXI+IHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gbmV4dDtcbiAgICAgICAgICAgIG5leHQgPSBjdXJyZW50ICsgc3RlcDtcbiAgICAgICAgICAgIGlmIChjdXJyZW50IDwgZW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UsIHZhbHVlOiBjdXJyZW50IH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlIH0gYXMgSXRlcmF0b3JSZXN1bHQ8bnVtYmVyPjtcbiAgICAgICAgfVxuICAgIH07XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JhbmdlLWl0ZXJhdG9yLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi9wYXJhbGxlbC9zbGF2ZS9yYW5nZS1pdGVyYXRvci50cyIsImltcG9ydCB7SVBhcmFsbGVsVGFza0Vudmlyb25tZW50fSBmcm9tIFwiLi4vXCI7XG5pbXBvcnQge3RvSXRlcmF0b3J9IGZyb20gXCIuLi8uLi91dGlsL2FycmF5c1wiO1xuLyoqXG4gKiBSZWR1Y2VzIHRoZSBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gaXRlcmF0b3IgdG8gYSBzaW5nbGUgdmFsdWUgYnkgYXBwbHlpbmcgdGhlIGdpdmVuIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudFxuICogQHBhcmFtIGRlZmF1bHRWYWx1ZSBhIGRlZmF1bHQgdmFsdWUgdGhhdCBpcyBhcyBhY2N1bXVsYXRvciBvciBmb3IgdGhlIGNhc2UgdGhhdCB0aGUgaXRlcmF0b3IgaXMgZW1wdHlcbiAqIEBwYXJhbSBpdGVyYXRvciB0aGUgaXRlcmF0b3Igd2l0aCB0aGUgdmFsdWVzIHRvIHJlZHVjZVxuICogQHBhcmFtIGl0ZXJhdGVlIGl0ZXJhdGVlIHRoYXQgaXMgYXBwbGllZCBmb3IgZWFjaCBlbGVtZW50LiBUaGUgaXRlcmF0ZWUgaXMgcGFzc2VkIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZSAoc3VtIG9mIGFsbCBwcmV2aW91cyB2YWx1ZXMpXG4gKiBhbmQgdGhlIGN1cnJlbnQgZWxlbWVudCBhbmQgaGFzIHRvIHJldHVybiBhIG5ldyBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAqIEBwYXJhbSBlbnYgdGhlIGVudmlyb25tZW50IG9mIHRoZSBqb2JcbiAqIEBwYXJhbSBUIHR5cGUgb2YgdGhlIGVsZW1lbnRzIHRvIHByb2Nlc3NcbiAqIEBwYXJhbSBUUmVzdWx0IHR5cGUgb2YgdGhlIHJlZHVjZWQgdmFsdWVcbiAqIEByZXR1cm5zIGFuIGFycmF5IHdpdGggYSBzaW5nbGUgdmFsdWUsIHRoZSByZWR1Y2VkIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VJdGVyYXRvcjxULCBUUmVzdWx0PihkZWZhdWx0VmFsdWU6IFRSZXN1bHQsIGl0ZXJhdG9yOiBJdGVyYXRvcjxUPiwgaXRlcmF0ZWU6ICh0aGlzOiB2b2lkLCBhY2N1bXVsYXRlZFZhbHVlOiBUUmVzdWx0LCB2YWx1ZTogVCB8IHVuZGVmaW5lZCwgZW52OiBJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnQpID0+IFRSZXN1bHQsIGVudjogSVBhcmFsbGVsVGFza0Vudmlyb25tZW50KTogSXRlcmF0b3I8VFJlc3VsdD4ge1xuICAgIGxldCBhY2N1bXVsYXRlZFZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIGxldCBjdXJyZW50OiBJdGVyYXRvclJlc3VsdDxUPjtcblxuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWNvbmRpdGlvbmFsLWFzc2lnbm1lbnQgKi9cbiAgICB3aGlsZSAoIShjdXJyZW50ID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGFjY3VtdWxhdGVkVmFsdWUgPSBpdGVyYXRlZShhY2N1bXVsYXRlZFZhbHVlLCBjdXJyZW50LnZhbHVlLCBlbnYpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0l0ZXJhdG9yKFthY2N1bXVsYXRlZFZhbHVlXSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZHVjZS1pdGVyYXRvci50c1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrOi8vL3NyYy9jb21tb24vcGFyYWxsZWwvc2xhdmUvcmVkdWNlLWl0ZXJhdG9yLnRzIiwiLyoqXG4gKiBpZGVudGl0eSBmdW5jdGlvbi4gUmV0dXJucyB0aGUgcGFzc2VkIGluIHZhbHVlXG4gKiBAcGFyYW0gZWxlbWVudCB0aGUgdmFsdWUgdG8gcmV0dXJuXG4gKiBAcGFyYW0gVCB0eXBlIG9mIHRoZSBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZGVudGl0eTxUPihlbGVtZW50OiBUKTogVCB7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvY29tbW9uL3V0aWwvaWRlbnRpdHkudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvY29tbW9uL3V0aWwvaWRlbnRpdHkudHMiLCIvKipcbiAqIEEgdmVyeSBzaW1wbGUgaW1wbGVtZW50YXRpb24gb2YgYSBtYXAuIERvIG5vdCB1c2Ugd2l0aCBjb21wbGV4IG9iamVjdHMgYXMgS2V5LlxuICogQHBhcmFtIEsgdHlwZSBvZiB0aGUga2V5XG4gKiBAcGFyYW0gViB0eXBlIG9mIHRoZSB2YWx1ZVxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlTWFwPEssIFY+IHtcbiAgICBwcml2YXRlIGRhdGE6IHsgW2tleTogc3RyaW5nXTogViB9ID0ge307XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIGtleSBpZiBhdmFpbGFibGVcbiAgICAgKiBAcGFyYW0ga2V5IHRoZSBrZXkgdG8gbG9vayB1cFxuICAgICAqIEByZXR1cm5zIHRoZSBsb29rZWQgdXAgdmFsdWUgb3IgdW5kZWZpbmVkIGlmIHRoZSBtYXAgZG9lcyBub3QgY29udGFpbiBhbnkgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiBrZXlcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0KGtleTogSyk6IFYgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBpbnRlcm5hbEtleSA9IHRoaXMudG9JbnRlcm5hbEtleShrZXkpO1xuICAgICAgICByZXR1cm4gdGhpcy5oYXMoa2V5KSA/IHRoaXMuZGF0YVtpbnRlcm5hbEtleV0gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgdGhlIG1hcCBjb250YWlucyB2YWx1ZSBzdG9yZWQgYnkgdGhlIGdpdmVuIGtleVxuICAgICAqIEBwYXJhbSBrZXkgdGhlIGtleVxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIG1hcCBjb250YWlucyBhIHZhbHVlIGJ5IHRoZSBnaXZlbiBrZXksIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBoYXMoa2V5OiBLKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5kYXRhLCB0aGlzLnRvSW50ZXJuYWxLZXkoa2V5KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXkuIElmIHRoZSBtYXAgYWxyZWFkeSBjb250YWlucyBhIHZhbHVlIHN0b3JlZCBieSB0aGUgZ2l2ZW4ga2V5LCB0aGVuIHRoaXMgdmFsdWUgaXNcbiAgICAgKiBvdmVycmlkZGVuXG4gICAgICogQHBhcmFtIGtleSB0aGUga2V5XG4gICAgICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byBhc3NvY2lhdGUgd2l0aCB0aGUgZ2l2ZW4ga2V5XG4gICAgICovXG4gICAgcHVibGljIHNldChrZXk6IEssIHZhbHVlOiBWKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0YVt0aGlzLnRvSW50ZXJuYWxLZXkoa2V5KV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgYWxsIHZhbHVlcyBmcm9tIHRoZSBtYXBcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xuICAgIH1cblxuICAgIHByaXZhdGUgdG9JbnRlcm5hbEtleShrZXk6IEspOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYEAke2tleX1gO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9jb21tb24vdXRpbC9zaW1wbGUtbWFwLnRzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2s6Ly8vc3JjL2NvbW1vbi91dGlsL3NpbXBsZS1tYXAudHMiLCJpbXBvcnQge0Jyb3dzZXJXb3JrZXJTbGF2ZX0gZnJvbSBcIi4vYnJvd3Nlci13b3JrZXItc2xhdmVcIjtcbmltcG9ydCB7U2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlfSBmcm9tIFwiLi4vLi4vY29tbW9uL2Z1bmN0aW9uL3NsYXZlLWZ1bmN0aW9uLWxvb2t1cC10YWJsZVwiO1xuaW1wb3J0IHtyZWdpc3RlclN0YXRpY1BhcmFsbGVsRnVuY3Rpb25zfSBmcm9tIFwiLi4vLi4vY29tbW9uL3BhcmFsbGVsL3NsYXZlL3JlZ2lzdGVyLXBhcmFsbGVsLXdvcmtlci1mdW5jdGlvbnNcIjtcblxuY29uc3Qgc2xhdmVGdW5jdGlvbkxvb2t1cFRhYmxlID0gbmV3IFNsYXZlRnVuY3Rpb25Mb29rdXBUYWJsZSgpO1xucmVnaXN0ZXJTdGF0aWNQYXJhbGxlbEZ1bmN0aW9ucyhzbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUpO1xuXG4vKiogQHByZXNlcnZlIFdPUktFUl9TTEFWRV9TVEFUSUNfRlVOQ1RJT05TX1BMQUNFSE9MREVSICovXG5cbmNvbnN0IHNsYXZlID0gbmV3IEJyb3dzZXJXb3JrZXJTbGF2ZShzbGF2ZUZ1bmN0aW9uTG9va3VwVGFibGUpO1xub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIHNsYXZlLm9uTWVzc2FnZS5hcHBseShzbGF2ZSwgYXJndW1lbnRzKTtcbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3RzbGludC1sb2FkZXIhLi9zcmMvYnJvd3Nlci93b3JrZXItc2xhdmUvaW5kZXgudHNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjazovLy9zcmMvYnJvd3Nlci93b3JrZXItc2xhdmUvaW5kZXgudHMiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcbmltcG9ydCB7SU1hbmRlbGJyb3RPcHRpb25zfSBmcm9tIFwiLi4vZHluYW1pYy9tYW5kZWxicm90XCI7XG5cbmludGVyZmFjZSBJQ29tcGxleE51bWJlciB7XG4gICAgaTogbnVtYmVyO1xuICAgIHJlYWw6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hbmRlbGJyb3QoeyBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgaXRlcmF0aW9ucyB9OiBJTWFuZGVsYnJvdE9wdGlvbnMsIG9wdGlvbnM/OiBJUGFyYWxsZWxPcHRpb25zKSB7XG4gICAgLy8gWCBheGlzIHNob3dzIHJlYWwgbnVtYmVycywgeSBheGlzIGltYWdpbmFyeVxuICAgIGNvbnN0IG1pbiA9IHsgaTogLTEuMiwgcmVhbDogLTIuMCB9O1xuICAgIGNvbnN0IG1heCA9IHsgaTogMCwgcmVhbDogMS4wIH07XG4gICAgbWF4LmkgPSBtaW4uaSArIChtYXgucmVhbCAtIG1pbi5yZWFsKSAqIGltYWdlSGVpZ2h0IC8gaW1hZ2VXaWR0aDtcblxuICAgIGNvbnN0IHNjYWxpbmdGYWN0b3IgPSB7XG4gICAgICAgIGk6IChtYXguaSAtIG1pbi5pKSAvIChpbWFnZUhlaWdodCAtIDEpLFxuICAgICAgICByZWFsOiAobWF4LnJlYWwgLSBtaW4ucmVhbCkgLyAoaW1hZ2VXaWR0aCAtIDEpXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVooYzogSUNvbXBsZXhOdW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB6ID0geyBpOiBjLmksIHJlYWw6IGMucmVhbCB9O1xuICAgICAgICBsZXQgbiA9IDA7XG5cbiAgICAgICAgZm9yICg7IG4gPCBpdGVyYXRpb25zOyArK24pIHtcbiAgICAgICAgICAgIGlmICh6LnJlYWwgKiB6LnJlYWwgKyB6LmkgKiB6LmkgPiA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHogKiogMiArIGNcbiAgICAgICAgICAgIGNvbnN0IHpJID0gei5pO1xuICAgICAgICAgICAgei5pID0gMiAqIHoucmVhbCAqIHouaSArIGMuaTtcbiAgICAgICAgICAgIHoucmVhbCA9IHoucmVhbCAqIHoucmVhbCAtIHpJICogekkgKyBjLnJlYWw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYWxsZWxcbiAgICAgICAgLnJhbmdlKDAsIGltYWdlSGVpZ2h0LCAxLCBvcHRpb25zKVxuICAgICAgICAubWFwKHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShpbWFnZVdpZHRoICogNCk7XG4gICAgICAgICAgICBjb25zdCBjSSA9IG1heC5pIC0geSAqIHNjYWxpbmdGYWN0b3IuaTtcblxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBpbWFnZVdpZHRoOyArK3gpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0ge1xuICAgICAgICAgICAgICAgICAgICBpOiBjSSxcbiAgICAgICAgICAgICAgICAgICAgcmVhbDogbWluLnJlYWwgKyB4ICogc2NhbGluZ0ZhY3Rvci5yZWFsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG4gPSBjYWxjdWxhdGVaKGMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2UgPSB4ICogNDtcbiAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXG4gICAgICAgICAgICAgICAgbGluZVtiYXNlXSA9IG4gJiAweEZGO1xuICAgICAgICAgICAgICAgIGxpbmVbYmFzZSArIDFdID0gbiAmIDB4RkYwMDtcbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2UgKyAyXSA9IG4gJiAweEZGMDAwMDtcbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2UgKyAzXSA9IDI1NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaW5lO1xuICAgICAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90cmFuc3BpbGVkL21hbmRlbGJyb3QudHMiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ29vcmRpbmF0ZSB7XG4gICAgcmVhZG9ubHkgeDogbnVtYmVyO1xuICAgIHJlYWRvbmx5IHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJS25pZ2h0VG91ckVudmlyb25tZW50IHtcbiAgICBib2FyZFNpemU6IG51bWJlcjtcbiAgICBib2FyZDogbnVtYmVyW107XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVudmlyb25tZW50KGJvYXJkU2l6ZTogbnVtYmVyKTogSUtuaWdodFRvdXJFbnZpcm9ubWVudCB7XG4gICAgY29uc3QgYm9hcmQ6IG51bWJlcltdID0gbmV3IEFycmF5KGJvYXJkU2l6ZSAqIGJvYXJkU2l6ZSk7XG4gICAgYm9hcmQuZmlsbCgwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBib2FyZCxcbiAgICAgICAgYm9hcmRTaXplXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtuaWdodFRvdXJzKHN0YXJ0UGF0aDogSUNvb3JkaW5hdGVbXSwgZW52aXJvbm1lbnQ6IElLbmlnaHRUb3VyRW52aXJvbm1lbnQpOiBudW1iZXIge1xuICAgIGNvbnN0IG1vdmVzID0gW1xuICAgICAgICB7IHg6IC0yLCB5OiAtMSB9LCB7IHg6IC0yLCB5OiAxfSwgeyB4OiAtMSwgeTogLTIgfSwgeyB4OiAtMSwgeTogMiB9LFxuICAgICAgICB7IHg6IDEsIHk6IC0yIH0sIHsgeDogMSwgeTogMn0sIHsgeDogMiwgeTogLTEgfSwgeyB4OiAyLCB5OiAxIH1cbiAgICBdO1xuICAgIGNvbnN0IGJvYXJkU2l6ZSA9IGVudmlyb25tZW50LmJvYXJkU2l6ZTtcbiAgICBjb25zdCBib2FyZCA9IGVudmlyb25tZW50LmJvYXJkO1xuICAgIGNvbnN0IG51bWJlck9mRmllbGRzID0gYm9hcmRTaXplICogYm9hcmRTaXplO1xuICAgIGxldCByZXN1bHRzOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiB7IGNvb3JkaW5hdGU6IElDb29yZGluYXRlLCBuOiBudW1iZXIgfVtdID0gc3RhcnRQYXRoLm1hcCgocG9zLCBpbmRleCkgPT4gKHsgY29vcmRpbmF0ZTogcG9zLCBuOiBpbmRleCArIDEgfSkpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0UGF0aC5sZW5ndGggLSAxOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBzdGFydFBhdGhbaW5kZXhdLnggKiBib2FyZFNpemUgKyBzdGFydFBhdGhbaW5kZXhdLnk7XG4gICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZSwgbiB9ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBjb29yZGluYXRlLnggKiBib2FyZFNpemUgKyBjb29yZGluYXRlLnk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2ZpZWxkSW5kZXhdICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBiYWNrIHRyYWNraW5nXG4gICAgICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IDA7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW50cnlcbiAgICAgICAgaWYgKG4gPT09IG51bWJlck9mRmllbGRzKSB7XG4gICAgICAgICAgICArK3Jlc3VsdHM7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBuITtcblxuICAgICAgICBmb3IgKGNvbnN0IG1vdmUgb2YgbW92ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NvciA9IHsgeDogY29vcmRpbmF0ZS54ICsgbW92ZS54LCB5OiBjb29yZGluYXRlLnkgKyBtb3ZlLnkgfTtcbiAgICAgICAgICAgIC8vIG5vdCBvdXRzaWRlIG9mIGJvYXJkIGFuZCBub3QgeWV0IGFjY2Vzc2VkXG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NpYmxlID0gc3VjY2Vzc29yLnggPj0gMCAmJiBzdWNjZXNzb3IueSA+PSAwICYmIHN1Y2Nlc3Nvci54IDwgYm9hcmRTaXplICYmICBzdWNjZXNzb3IueSA8IGJvYXJkU2l6ZSAmJiBib2FyZFtzdWNjZXNzb3IueCAqIGJvYXJkU2l6ZSArIHN1Y2Nlc3Nvci55XSA9PT0gMDtcblxuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHsgY29vcmRpbmF0ZTogc3VjY2Vzc29yLCBuOiBuICsgMSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY0tuaWdodFRvdXJzKHN0YXJ0OiBJQ29vcmRpbmF0ZSwgYm9hcmRTaXplOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gY3JlYXRlRW52aXJvbm1lbnQoYm9hcmRTaXplKTtcbiAgICByZXR1cm4ga25pZ2h0VG91cnMoW3N0YXJ0XSwgZW52aXJvbm1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxLbmlnaHRUb3VycyhzdGFydDogSUNvb3JkaW5hdGUsIGJvYXJkU2l6ZTogbnVtYmVyLCBvcHRpb25zPzogSVBhcmFsbGVsT3B0aW9ucyk6IFByb21pc2VMaWtlPG51bWJlcj4ge1xuXG4gICAgZnVuY3Rpb24gc3VjY2Vzc29ycyhjb29yZGluYXRlOiBJQ29vcmRpbmF0ZSkge1xuICAgICAgICBjb25zdCBtb3ZlcyA9IFtcbiAgICAgICAgICAgIHt4OiAtMiwgeTogLTF9LCB7eDogLTIsIHk6IDF9LCB7eDogLTEsIHk6IC0yfSwge3g6IC0xLCB5OiAyfSxcbiAgICAgICAgICAgIHt4OiAxLCB5OiAtMn0sIHt4OiAxLCB5OiAyfSwge3g6IDIsIHk6IC0xfSwge3g6IDIsIHk6IDF9XG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgbW92ZSBvZiBtb3Zlcykge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc29yID0ge3g6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55fTtcbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc2libGUgPSBzdWNjZXNzb3IueCA+PSAwICYmIHN1Y2Nlc3Nvci55ID49IDAgJiYgc3VjY2Vzc29yLnggPCBib2FyZFNpemUgJiYgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiZcbiAgICAgICAgICAgICAgICAoc3VjY2Vzc29yLnggIT09IHN0YXJ0LnggfHwgc3VjY2Vzc29yLnkgIT09IHN0YXJ0LnkpICYmIChzdWNjZXNzb3IueCAhPT0gY29vcmRpbmF0ZS54ICYmIHN1Y2Nlc3Nvci55ICE9PSBjb29yZGluYXRlLnkpO1xuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChzdWNjZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlU3RhcnRGaWVsZHMoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoc3RhcnQpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGluZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoZGlyZWN0U3VjY2Vzc29yKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFtzdGFydCwgZGlyZWN0U3VjY2Vzc29yLCBpbmRpcmVjdFN1Y2Nlc3Nvcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBsZXQgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5mcm9tKGNvbXB1dGVTdGFydEZpZWxkcygpLCBvcHRpb25zKVxuICAgICAgICAuaW5FbnZpcm9ubWVudChjcmVhdGVFbnZpcm9ubWVudCwgYm9hcmRTaXplKVxuICAgICAgICAubWFwPG51bWJlcj4oa25pZ2h0VG91cnMpXG4gICAgICAgIC5yZWR1Y2UoMCwgKG1lbW8sIGNvdW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbWVtbyArIGNvdW50O1xuICAgICAgICB9KVxuICAgICAgICAuc3Vic2NyaWJlKHN1YlJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0b3VycyBvZiBzdWJSZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgKz0gdG91cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1jb25zb2xlICovXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0b3RhbCAvIChwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0VGltZSkgKiAxMDAwfSByZXN1bHRzIHBlciBzZWNvbmRgKTtcbiAgICAgICAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdHJhbnNwaWxlZC9rbmlnaHRzLXRvdXIudHMiLCJpbXBvcnQgcGFyYWxsZWwgZnJvbSBcInBhcmFsbGVsLWVzXCI7XG5pbXBvcnQge0RpY3Rpb25hcnl9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBSYW5kb20gZnJvbSBcInNpbWpzLXJhbmRvbVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0IHtcbiAgICBzdGFydFllYXI6IG51bWJlcjtcbiAgICB0b3RhbEFtb3VudDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUJ1Y2tldCB7XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG5cbiAgICBzdWJCdWNrZXRzOiB7IFtncm91cE5hbWU6IHN0cmluZ106IHsgZ3JvdXA6IHN0cmluZzsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyIH0gfTtcbn1cblxuaW50ZXJmYWNlIElHcm91cCB7XG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBuYW1lIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGdyb3VwXG4gICAgICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBhIHNlcGFyYXRvciBsaW5lIGJlZW4gZHJhd24gZm9yIHRoaXMgZ3JvdXA/XG4gICAgICovXG4gICAgc2VwYXJhdG9yOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIHBlcmNlbnRhZ2Ugb2YgdmFsdWVzIGluIHRoaXMgZ3JvdXAgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBzaW11bGF0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgcGVyY2VudGFnZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1pbmltdW0gdmFsdWUgdGhhdCBpcyBzdGlsbCBwYXJ0IG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBmcm9tPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBtYXhpbXVtIHZhbHVlIChleGNsdXNpdmUpIHRoYXQgZGVmaW5lcyB0aGUgdXBwZXIgZW5kIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICB0bz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUHJvamVjdFJlc3VsdCB7XG4gICAgLyoqXG4gICAgICogVGhlIG1pbmltYWwgc2ltdWxhdGVkIHZhbHVlIGZvciB0aGlzIHByb2plY3RcbiAgICAgKi9cbiAgICBtaW46IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW1hbCBzaW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBtYXg6IG51bWJlcjtcblxuICAgIC8qKiBUaGUgbWVkaWFuIG9mIHRoZSB2YWx1ZXMgZm91bmQgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1lZGlhbjogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB3aGVyZSB0aGUgMi8zIG9mIHRoZSBzaW11bGF0ZWQgdmFsdWVzIHN0YXJ0IC8gZW5kLlxuICAgICAqL1xuICAgIHR3b1RoaXJkOiB7XG4gICAgICAgIG1pbjogbnVtYmVyO1xuICAgICAgICBtYXg6IG51bWJlcjtcbiAgICB9O1xuXG4gICAgYnVja2V0czogSUJ1Y2tldFtdO1xuXG4gICAgZ3JvdXBzOiBJR3JvdXBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9qZWN0XG4gICAgICovXG4gICAgcHJvamVjdDogSVByb2plY3Q7XG59XG5cbmludGVyZmFjZSBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT47XG4gICAgc2ltdWxhdGVkVmFsdWVzOiBudW1iZXJbXVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzPzogbnVtYmVyO1xuICAgIG51bVJ1bnM/OiBudW1iZXI7XG4gICAgcHJvamVjdHM/OiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ/OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U/OiBudW1iZXI7XG4gICAgc2VlZD86IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5PzogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBwcm9qZWN0czogSVByb2plY3RbXTtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U6IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHRhc2tJbmRleD86IG51bWJlcjtcbiAgICB2YWx1ZXNQZXJXb3JrZXI/OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgdm9sYXRpbGl0eTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogMTAwMDAwMCxcbiAgICAgICAgbGlxdWlkaXR5OiAxMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAsXG4gICAgICAgIG51bVllYXJzOiAxMCxcbiAgICAgICAgcGVyZm9ybWFuY2U6IDAsXG4gICAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgICAgc2VlZDogdW5kZWZpbmVkLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjAxXG4gICAgfSwgb3B0aW9ucyk7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50KG9wdGlvbnM6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElNb250ZUNhcmxvRW52aXJvbm1lbnQge1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdHNUb0Nhc2hGbG93cyhwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+LCBudW1ZZWFyczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNhc2hGbG93czogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBudW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0c0J5VGhpc1llYXIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3llYXJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgY2FzaEZsb3cgPSAtcHJvamVjdHNCeVRoaXNZZWFyLnJlZHVjZSgobWVtbywgcHJvamVjdCkgPT4gbWVtbyArIHByb2plY3QudG90YWxBbW91bnQsIDApO1xuICAgICAgICAgICAgY2FzaEZsb3dzLnB1c2goY2FzaEZsb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYXNoRmxvd3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCBudW1ZZWFyczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBpbnZlc3RtZW50QW1vdW50TGVmdCA9IGludmVzdG1lbnRBbW91bnQ7XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgaW52ZXN0bWVudEFtb3VudExlZnQgPSBpbnZlc3RtZW50QW1vdW50TGVmdCArIGNhc2hGbG93c1t5ZWFyXTtcbiAgICAgICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLnB1c2goaW52ZXN0bWVudEFtb3VudExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub0ludGVyZXN0UmVmZXJlbmNlTGluZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0Fic29sdXRlSW5kaWNlcyhpbmRpY2VzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCBjYXNoRmxvd3M6IG51bWJlcltdKSB7XG4gICAgICAgIGxldCBjdXJyZW50UG9ydGZvbGlvVmFsdWUgPSBpbnZlc3RtZW50QW1vdW50O1xuICAgICAgICBsZXQgcHJldmlvdXNZZWFySW5kZXggPSAxMDA7XG5cbiAgICAgICAgZm9yIChsZXQgcmVsYXRpdmVZZWFyID0gMDsgcmVsYXRpdmVZZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsrcmVsYXRpdmVZZWFyKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhckluZGV4ID0gaW5kaWNlc1tyZWxhdGl2ZVllYXJdO1xuICAgICAgICAgICAgY29uc3QgY2FzaEZsb3dTdGFydE9mWWVhciA9IHJlbGF0aXZlWWVhciA9PT0gMCA/IDAgOiBjYXNoRmxvd3NbcmVsYXRpdmVZZWFyIC0gMV07XG5cbiAgICAgICAgICAgIC8vIHNjYWxlIGN1cnJlbnQgdmFsdWUgd2l0aCBwZXJmb3JtYW5jZSBnYWluIGFjY29yZGluZyB0byBpbmRleFxuICAgICAgICAgICAgY29uc3QgcGVyZm9ybWFuY2UgPSBjdXJyZW50WWVhckluZGV4IC8gcHJldmlvdXNZZWFySW5kZXg7XG4gICAgICAgICAgICBjdXJyZW50UG9ydGZvbGlvVmFsdWUgPSAoY3VycmVudFBvcnRmb2xpb1ZhbHVlICsgY2FzaEZsb3dTdGFydE9mWWVhcikgKiBwZXJmb3JtYW5jZTtcblxuICAgICAgICAgICAgaW5kaWNlc1tyZWxhdGl2ZVllYXJdID0gTWF0aC5yb3VuZChjdXJyZW50UG9ydGZvbGlvVmFsdWUpO1xuICAgICAgICAgICAgcHJldmlvdXNZZWFySW5kZXggPSBjdXJyZW50WWVhckluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGljZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgdGhlIG1vbnRlIGNhcmxvIHNpbXVsYXRpb24gZm9yIGFsbCB5ZWFycyBhbmQgbnVtIHJ1bnMuXG4gICAgICogQHBhcmFtIGNhc2hGbG93cyB0aGUgY2FzaCBmbG93c1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXVtdfSB0aGUgc2ltdWxhdGVkIG91dGNvbWVzIGdyb3VwZWQgYnkgeWVhclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNpbXVsYXRlT3V0Y29tZXMoY2FzaEZsb3dzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCB7IG51bVJ1bnMsIG51bVllYXJzLCB2b2xhdGlsaXR5LCBwZXJmb3JtYW5jZSB9OiB7IG51bVJ1bnM6IG51bWJlciwgbnVtWWVhcnM6IG51bWJlciwgdm9sYXRpbGl0eTogbnVtYmVyLCBwZXJmb3JtYW5jZTogbnVtYmVyfSk6IG51bWJlcltdW10gIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG51bVllYXJzKTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPD0gbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgcmVzdWx0W3llYXJdID0gbmV3IEFycmF5KG51bVJ1bnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmFuZG9tID0gbmV3IFJhbmRvbSgxMCk7XG4gICAgICAgIGZvciAobGV0IHJ1biA9IDA7IHJ1biA8IG51bVJ1bnM7IHJ1bisrKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzID0gWzEwMF07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bVllYXJzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21QZXJmb3JtYW5jZSA9IDEgKyByYW5kb20ubm9ybWFsKHBlcmZvcm1hbmNlLCB2b2xhdGlsaXR5KTtcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kaWNlc1tpIC0gMV0gKiByYW5kb21QZXJmb3JtYW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdGhlIHJlbGF0aXZlIHZhbHVlcyBmcm9tIGFib3ZlIHRvIGFic29sdXRlIHZhbHVlcy5cbiAgICAgICAgICAgIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXMsIGludmVzdG1lbnRBbW91bnQsIGNhc2hGbG93cyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsreWVhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdFt5ZWFyXVtydW5dID0gaW5kaWNlc1t5ZWFyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGV0IHByb2plY3RzVG9TaW11bGF0ZTogSVByb2plY3RbXSA9IG9wdGlvbnMucHJvamVjdHM7XG5cbiAgICBpZiAob3B0aW9ucy50YXNrSW5kZXggJiYgb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIpIHtcbiAgICAgICAgcHJvamVjdHNUb1NpbXVsYXRlID0gb3B0aW9ucy5wcm9qZWN0cy5zbGljZShvcHRpb25zLnRhc2tJbmRleCAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyLCAob3B0aW9ucy50YXNrSW5kZXggKyAxKSAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9qZWN0cyA9IG9wdGlvbnMucHJvamVjdHMuc29ydCgoYSwgYikgPT4gYS5zdGFydFllYXIgLSBiLnN0YXJ0WWVhcik7XG5cbiAgICAvLyBHcm91cCBwcm9qZWN0cyBieSBzdGFydFllYXIsIHVzZSBsb2Rhc2ggZ3JvdXBCeSBpbnN0ZWFkXG4gICAgY29uc3QgcHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICBjb25zdCBhcnIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXSA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdIHx8IFtdO1xuICAgICAgICBhcnIucHVzaChwcm9qZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBjYXNoRmxvd3MgPSBwcm9qZWN0c1RvQ2FzaEZsb3dzKHByb2plY3RzQnlTdGFydFllYXIsIG9wdGlvbnMubnVtWWVhcnMpO1xuICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lID0gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzLCBvcHRpb25zLmludmVzdG1lbnRBbW91bnQsIG9wdGlvbnMubnVtWWVhcnMpO1xuXG4gICAgY29uc3QgbnVtWWVhcnMgPSBwcm9qZWN0c1RvU2ltdWxhdGUucmVkdWNlKChtZW1vLCBwcm9qZWN0KSA9PiBNYXRoLm1heChtZW1vLCBwcm9qZWN0LnN0YXJ0WWVhciksIDApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LFxuICAgICAgICBsaXF1aWRpdHk6IG9wdGlvbnMubGlxdWlkaXR5LFxuICAgICAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZSxcbiAgICAgICAgbnVtUnVuczogb3B0aW9ucy5udW1SdW5zLFxuICAgICAgICBudW1ZZWFycyxcbiAgICAgICAgcHJvamVjdHNCeVN0YXJ0WWVhcixcbiAgICAgICAgc2ltdWxhdGVkVmFsdWVzOiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93cywgb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LCBvcHRpb25zKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdyb3VwRm9yVmFsdWUodmFsdWU6IG51bWJlciwgZ3JvdXBzOiBJR3JvdXBbXSk6IElHcm91cCB7XG4gICAgcmV0dXJuIGdyb3Vwcy5maW5kKGdyb3VwID0+ICh0eXBlb2YgZ3JvdXAuZnJvbSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBncm91cC5mcm9tIDw9IHZhbHVlKSAmJiAodHlwZW9mIGdyb3VwLnRvID09PSBcInVuZGVmaW5lZFwiIHx8IGdyb3VwLnRvID4gdmFsdWUpKSE7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdyb3VwcyhyZXF1aXJlZEFtb3VudDogbnVtYmVyLCBub0ludGVyZXN0UmVmZXJlbmNlOiBudW1iZXIsIGxpcXVpZGl0eTogbnVtYmVyKTogSUdyb3VwW10ge1xuICAgIHJldHVybiBbXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwiWmllbCBlcnJlaWNoYmFyXCIsIGZyb206IHJlcXVpcmVkQW1vdW50LCBuYW1lOiBcImdyZWVuXCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZX0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibWl0IFp1c2F0emxpcXVpZGl0w6R0IGVycmVpY2hiYXJcIiwgZnJvbTogcmVxdWlyZWRBbW91bnQgLSBsaXF1aWRpdHksIG5hbWU6IFwieWVsbG93XCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZSwgdG86IHJlcXVpcmVkQW1vdW50IH0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhclwiLCBmcm9tOiBub0ludGVyZXN0UmVmZXJlbmNlLCBuYW1lOiBcImdyYXlcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IHJlcXVpcmVkQW1vdW50IC0gbGlxdWlkaXR5IH0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhciwgbWl0IFZlcmx1c3RcIiwgbmFtZTogXCJyZWRcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IG5vSW50ZXJlc3RSZWZlcmVuY2UgfVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KHByb2plY3Q6IElQcm9qZWN0LCBwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+KSB7XG4gICAgbGV0IGFtb3VudCA9IHByb2plY3QudG90YWxBbW91bnQ7XG4gICAgY29uc3QgcHJvamVjdHNTYW1lWWVhciA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdO1xuXG4gICAgZm9yIChjb25zdCBvdGhlclByb2plY3Qgb2YgcHJvamVjdHNTYW1lWWVhcikge1xuICAgICAgICBpZiAob3RoZXJQcm9qZWN0ID09PSBwcm9qZWN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhbW91bnQgKz0gb3RoZXJQcm9qZWN0LnRvdGFsQW1vdW50O1xuICAgIH1cbiAgICByZXR1cm4gYW1vdW50O1xufVxuXG5mdW5jdGlvbiBtZWRpYW4odmFsdWVzOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IGhhbGYgPSBNYXRoLmZsb29yKHZhbHVlcy5sZW5ndGggLyAyKTtcblxuICAgIGlmICh2YWx1ZXMubGVuZ3RoICUgMikge1xuICAgICAgICByZXR1cm4gdmFsdWVzW2hhbGZdO1xuICAgIH1cblxuICAgIHJldHVybiAodmFsdWVzW2hhbGYgLSAxXSArIHZhbHVlc1toYWxmXSkgLyAyLjA7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVByb2plY3QocHJvamVjdDogSVByb2plY3QsIGVudmlyb25tZW50OiBJTW9udGVDYXJsb0Vudmlyb25tZW50KTogSVByb2plY3RSZXN1bHQge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9CVUNLRVRTID0gMTA7XG5cbiAgICBjb25zdCByZXF1aXJlZEFtb3VudCA9IGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KHByb2plY3QsIGVudmlyb25tZW50LnByb2plY3RzQnlTdGFydFllYXIpO1xuICAgIGNvbnN0IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyID0gZW52aXJvbm1lbnQuc2ltdWxhdGVkVmFsdWVzW3Byb2plY3Quc3RhcnRZZWFyXTtcbiAgICBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBncm91cHMgPSBjcmVhdGVHcm91cHMocmVxdWlyZWRBbW91bnQsIGVudmlyb25tZW50Lm5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lW3Byb2plY3Quc3RhcnRZZWFyXSwgZW52aXJvbm1lbnQubGlxdWlkaXR5KTtcbiAgICBjb25zdCB2YWx1ZXNCeUdyb3VwOiB7IFtncm91cE5hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gICAgY29uc3QgYnVja2V0U2l6ZSA9IE1hdGgucm91bmQoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC8gTlVNQkVSX09GX0JVQ0tFVFMpO1xuICAgIGNvbnN0IGJ1Y2tldHM6IElCdWNrZXRbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGg7IGkgKz0gYnVja2V0U2l6ZSkge1xuICAgICAgICBjb25zdCBidWNrZXQ6IElCdWNrZXQgPSB7XG4gICAgICAgICAgICBtYXg6IE51bWJlci5NSU5fVkFMVUUsXG4gICAgICAgICAgICBtaW46IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgICBzdWJCdWNrZXRzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIGJ1Y2tldFNpemU7ICsraikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltqXTtcbiAgICAgICAgICAgIGJ1Y2tldC5taW4gPSBNYXRoLm1pbihidWNrZXQubWluLCB2YWx1ZSk7XG4gICAgICAgICAgICBidWNrZXQubWF4ID0gTWF0aC5tYXgoYnVja2V0Lm1heCwgdmFsdWUpO1xuXG4gICAgICAgICAgICBjb25zdCBncm91cCA9IGdyb3VwRm9yVmFsdWUoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbal0sIGdyb3Vwcyk7XG4gICAgICAgICAgICB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdID0gKHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICAgICAgY29uc3Qgc3ViQnVja2V0ID0gYnVja2V0LnN1YkJ1Y2tldHNbZ3JvdXAubmFtZV0gPSBidWNrZXQuc3ViQnVja2V0c1tncm91cC5uYW1lXSB8fCB7IGdyb3VwOiBncm91cC5uYW1lLCBtYXg6IE51bWJlci5NSU5fVkFMVUUsIG1pbjogTnVtYmVyLk1BWF9WQUxVRSB9O1xuICAgICAgICAgICAgc3ViQnVja2V0Lm1pbiA9IE1hdGgubWluKHN1YkJ1Y2tldC5taW4sIHZhbHVlKTtcbiAgICAgICAgICAgIHN1YkJ1Y2tldC5tYXggPSBNYXRoLm1heChzdWJCdWNrZXQubWF4LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBidWNrZXRzLnB1c2goYnVja2V0KTtcbiAgICB9XG5cbiAgICBjb25zdCBub25FbXB0eUdyb3VwcyA9IGdyb3Vwcy5maWx0ZXIoZ3JvdXAgPT4gISF2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdKTtcbiAgICBub25FbXB0eUdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IGdyb3VwLnBlcmNlbnRhZ2UgPSB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdIC8gc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoKTtcblxuICAgIGNvbnN0IG9uZVNpeHRoID0gTWF0aC5yb3VuZChzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLyA2KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBidWNrZXRzLFxuICAgICAgICBncm91cHM6IG5vbkVtcHR5R3JvdXBzLFxuICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIDFdLFxuICAgICAgICBtZWRpYW46IG1lZGlhbihzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhciksXG4gICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbMF0sXG4gICAgICAgIHByb2plY3QsXG4gICAgICAgIHR3b1RoaXJkOiB7XG4gICAgICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIG9uZVNpeHRoXSxcbiAgICAgICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbb25lU2l4dGhdXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY01vbnRlQ2FybG8ob3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKSk7XG5cbiAgICBsZXQgcHJvamVjdHM6IElQcm9qZWN0UmVzdWx0W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHByb2plY3Qgb2Ygb3B0aW9ucyEucHJvamVjdHMhKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goY2FsY3VsYXRlUHJvamVjdChwcm9qZWN0LCBlbnZpcm9ubWVudCkpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9qZWN0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsTW9udGVDYXJsbyh1c2VyT3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gaW5pdGlhbGl6ZU9wdGlvbnModXNlck9wdGlvbnMpO1xuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAuZnJvbShvcHRpb25zLnByb2plY3RzLCB7IG1pblZhbHVlc1BlclRhc2s6IDIgfSlcbiAgICAgICAgLmluRW52aXJvbm1lbnQoY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50LCBvcHRpb25zKVxuICAgICAgICAubWFwKGNhbGN1bGF0ZVByb2plY3QpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RyYW5zcGlsZWQvbW9udGUtY2FybG8udHMiXSwic291cmNlUm9vdCI6IiJ9