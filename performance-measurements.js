webpackJsonp([0],{

/***/ 10:
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

/***/ 11:
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/module.js */ 9)(module), __webpack_require__(/*! (webpack)/buildin/global.js */ 8)))

/***/ },

/***/ 14:
/* unknown exports provided */
/* all exports used */
/*!****************************************!*\
  !*** ./src/performance-measurement.ts ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(/*! lodash */ 7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_benchmark__ = __webpack_require__(/*! benchmark */ 10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_benchmark___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_benchmark__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dynamic_mandelbrot__ = __webpack_require__(/*! ./dynamic/mandelbrot */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__transpiled_mandelbrot__ = __webpack_require__(/*! ./transpiled/mandelbrot */ 5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__transpiled_knights_tour__ = __webpack_require__(/*! ./transpiled/knights-tour */ 4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__dynamic_knights_tour__ = __webpack_require__(/*! ./dynamic/knights-tour */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dynamic_monte_carlo__ = __webpack_require__(/*! ./dynamic/monte-carlo */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__transpiled_monte_carlo__ = __webpack_require__(/*! ./transpiled/monte-carlo */ 6);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();



var platform = __webpack_require__(/*! platform */ 11);






var Benchmark = __WEBPACK_IMPORTED_MODULE_1_benchmark__["runInContext"]({ _: __WEBPACK_IMPORTED_MODULE_0_lodash__ });
window.Benchmark = Benchmark;
var runButton = document.querySelector("#run");
var outputTable = document.querySelector("#output-table");
var jsonOutputField = document.querySelector("#json-output");
var syncCheckbox = document.querySelector("#sync");
var parallelDynamicCheckbox = document.querySelector("#parallel-es-dynamic");
var parallelTranspiledCheckbox = document.querySelector("#parallel-es-transpiled");
var knightRunner6x6 = document.querySelector("#knight-runner-6-6");
function addKnightBoardTests(suite) {
    var boardSizes = knightRunner6x6.checked ? [5, 6] : [5];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        var _loop = function _loop() {
            var boardSize = _step.value;

            var title = "Knights Tour (" + boardSize + "x" + boardSize + ")";
            suite.add("sync: " + title, function () {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__transpiled_knights_tour__["b" /* syncKnightTours */])({ x: 0, y: 0 }, boardSize);
            });
            suite.add("parallel-dynamic: " + title, function (deferred) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__dynamic_knights_tour__["a" /* parallelKnightTours */])({ x: 0, y: 0 }, boardSize).then(function () {
                    return deferred.resolve();
                }, function () {
                    return deferred.reject();
                });
            }, { defer: true });
            suite.add("parallel-transpiled: " + title, function (deferred) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__transpiled_knights_tour__["a" /* parallelKnightTours */])({ x: 0, y: 0 }, boardSize).then(function () {
                    return deferred.resolve();
                }, function () {
                    return deferred.reject();
                });
            }, { defer: true });
        };

        for (var _iterator = boardSizes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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
function addMonteCarloTest(suite, options, numberOfProjects) {
    var runOptions = Object.assign(options, {
        projects: createProjects(numberOfProjects)
    });
    suite.add("sync: Monte Carlo " + numberOfProjects + " Math.random", function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_monte_carlo__["a" /* syncMonteCarlo */])(options);
    });
    suite.add("parallel-dynamic: Monte Carlo " + numberOfProjects + " Math.random", function (deferred) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_monte_carlo__["b" /* parallelMonteCarlo */])(runOptions).then(function () {
            return deferred.resolve();
        }, function () {
            return deferred.reject();
        });
    }, { defer: true });
    suite.add("sync: Monte Carlo " + numberOfProjects + " simjs", function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__transpiled_monte_carlo__["b" /* syncMonteCarlo */])(options);
    });
    suite.add("parallel-transpiled: Monte Carlo " + numberOfProjects + " simjs", function (deferred) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__transpiled_monte_carlo__["a" /* parallelMonteCarlo */])(runOptions).then(function () {
            return deferred.resolve();
        }, function () {
            return deferred.reject();
        });
    }, { defer: true });
}
function addMonteCarloTests(suite) {
    var monteCarloOptions = {
        investmentAmount: 620000,
        numRuns: 10000,
        numYears: 15,
        performance: 0.0340000,
        seed: 10,
        volatility: 0.0896000
    };
    var _arr = [1, 2, 4, 6, 8, 10, 15];
    for (var _i = 0; _i < _arr.length; _i++) {
        var numberOfProjects = _arr[_i];
        addMonteCarloTest(suite, monteCarloOptions, numberOfProjects);
    }
}
function addMandelbrotTests(suite) {
    var mandelbrotHeight = parseInt(document.querySelector("#mandelbrot-height").value, 10);
    var mandelbrotWidth = parseInt(document.querySelector("#mandelbrot-width").value, 10);
    var mandelbrotIterations = parseInt(document.querySelector("#mandelbrot-iterations").value, 10);
    var mandelbrotOptions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__dynamic_mandelbrot__["a" /* createMandelOptions */])(mandelbrotWidth, mandelbrotHeight, mandelbrotIterations);
    suite.add("sync: Mandelbrot " + mandelbrotWidth + "x" + mandelbrotHeight + ", " + mandelbrotIterations, function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__dynamic_mandelbrot__["b" /* syncMandelbrot */])(mandelbrotOptions, function () {
            return undefined;
        });
    });
    var _arr2 = [undefined, 1, 75, 150, 300, 600, 1200];

    var _loop2 = function _loop2() {
        var maxValuesPerTask = _arr2[_i2];
        var title = "Mandelbrot " + mandelbrotOptions.imageWidth + "x" + mandelbrotOptions.imageHeight + ", " + mandelbrotOptions.iterations + " (" + maxValuesPerTask + ")";
        suite.add("parallel-dynamic: " + title, function (deferred) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__dynamic_mandelbrot__["c" /* parallelMandelbrot */])(mandelbrotOptions, { maxValuesPerTask: maxValuesPerTask }).then(function () {
                return deferred.resolve();
            }, function () {
                return deferred.reject();
            });
        }, { defer: true });
        suite.add("parallel-transpiled: " + title, function (deferred) {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__transpiled_mandelbrot__["a" /* mandelbrot */])(mandelbrotOptions, { maxValuesPerTask: maxValuesPerTask }).then(function () {
                return deferred.resolve();
            }, function () {
                return deferred.reject();
            });
        }, { defer: true });
    };

    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        _loop2();
    }
}
function measure() {
    var allTestsSuite = new Benchmark.Suite();
    addMonteCarloTests(allTestsSuite);
    addMandelbrotTests(allTestsSuite);
    addKnightBoardTests(allTestsSuite);
    var suite = allTestsSuite.filter(function (benchmark) {
        return syncCheckbox.checked && benchmark.name.startsWith("sync") || parallelDynamicCheckbox.checked && benchmark.name.startsWith("parallel-dynamic") || parallelTranspiledCheckbox.checked && benchmark.name.startsWith("parallel-transpiled");
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
            _suite$name$split2 = _slicedToArray(_suite$name$split, 2),
            set = _suite$name$split2[0],
            name = _suite$name$split2[1];

        row.insertCell().textContent = set;
        row.insertCell().textContent = name;
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
    row.cells[1].textContent = benchmark.stats.deviation.toFixed(4);
    row.cells[2].textContent = benchmark.stats.mean.toFixed(4);
    row.cells[3].textContent = benchmark.stats.moe.toFixed(4);
    row.cells[4].textContent = benchmark.stats.rme.toFixed(4);
    row.cells[5].textContent = benchmark.stats.sem.toFixed(4);
    row.cells[6].textContent = benchmark.stats.variance.toFixed(4);
    row.cells[7].textContent = benchmark.stats.sample.length.toFixed(0);
    row.cells[8].textContent = benchmark.hz.toFixed(4);
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

},[14]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2JlbmNobWFyay9iZW5jaG1hcmsuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wbGF0Zm9ybS9wbGF0Zm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGVyZm9ybWFuY2UtbWVhc3VyZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsU0FBUyxrQ0FBa0MsRUFBRTtBQUNuRjtBQUNBLDhCQUE4QixHQUFHO0FBQ2pDO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxnQkFBZ0I7QUFDL0IsZUFBZSxPQUFPLFlBQVk7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekMsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHVCQUF1Qiw2QkFBNkIsZUFBZTtBQUM5RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTyxZQUFZO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QiwwQkFBMEI7QUFDMUIsNEJBQTRCO0FBQzVCLDhCQUE4QjtBQUM5Qix5QkFBeUI7QUFDekI7QUFDQSxtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCLGVBQWU7QUFDZixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxZQUFZO0FBQ1osVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztzREMxdkZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsRUFBRTtBQUNmLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxFQUFFO0FBQ2YsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RyxJQUFVLFNBQUUsRUFBRyxHQUFHO0FBQzVCLGdCQUNQO0FBQ0o7QUFDSjtBQUFDO0FBRUQsMkJBQWlEO0FBQzdDLFFBQVUsT0FBYyxZQUFRLFFBQStCO0FBQy9ELFFBQWUsWUFBUSxNQUF1QjtBQUM5QyxRQUFXLFFBQVMsTUFBbUMsY0FBUSxRQUFZO0FBQzNFLFFBQVMsTUFBTyxLQUFLLEtBQStCO0FBRWpELFFBQU0sTUFBRyxHQUFZLGNBQVksVUFBTSxNQUFVLFVBQVEsUUFBSTtBQUM3RCxRQUFNLE1BQUcsR0FBWSxjQUFZLFVBQU0sTUFBSyxLQUFRLFFBQUk7QUFDeEQsUUFBTSxNQUFHLEdBQVksY0FBWSxVQUFNLE1BQUksSUFBUSxRQUFJO0FBQ3ZELFFBQU0sTUFBRyxHQUFZLGNBQVksVUFBTSxNQUFJLElBQVEsUUFBSTtBQUN2RCxRQUFNLE1BQUcsR0FBWSxjQUFZLFVBQU0sTUFBSSxJQUFRLFFBQUk7QUFDdkQsUUFBTSxNQUFHLEdBQVksY0FBWSxVQUFNLE1BQVMsU0FBUSxRQUFJO0FBQzVELFFBQU0sTUFBRyxHQUFZLGNBQVksVUFBTSxNQUFPLE9BQU8sT0FBUSxRQUFJO0FBQ2pFLFFBQU0sTUFBRyxHQUFZLGNBQVksVUFBRyxHQUFRLFFBQ25EO0FBQUM7QUFFRCx3QkFBcUM7QUFDakMsUUFBYyxXQUFrQjtBQUU1QixTQUFDLElBQUssSUFBSSxHQUFHLElBQVEsT0FBRSxFQUFHLEdBQUc7QUFDckIsaUJBQUs7QUFDQSx1QkFBTSxLQUFNLE1BQUssS0FBUyxXQUFNO0FBQzlCLHlCQUFNLEtBQU0sTUFBSyxLQUFTLFdBRTdDO0FBSmtCO0FBSWpCO0FBRUssV0FDVjtBQUFDLEMiLCJmaWxlIjoicGVyZm9ybWFuY2UtbWVhc3VyZW1lbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBCZW5jaG1hcmsuanMgPGh0dHBzOi8vYmVuY2htYXJranMuY29tLz5cbiAqIENvcHlyaWdodCAyMDEwLTIwMTYgTWF0aGlhcyBCeW5lbnMgPGh0dHBzOi8vbXRocy5iZS8+XG4gKiBCYXNlZCBvbiBKU0xpdG11cy5qcywgY29weXJpZ2h0IFJvYmVydCBLaWVmZmVyIDxodHRwOi8vYnJvb2ZhLmNvbS8+XG4gKiBNb2RpZmllZCBieSBKb2huLURhdmlkIERhbHRvbiA8aHR0cDovL2FsbHlvdWNhbmxlZXQuY29tLz5cbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9tdGhzLmJlL21pdD5cbiAqL1xuOyhmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKiBVc2VkIGFzIGEgc2FmZSByZWZlcmVuY2UgZm9yIGB1bmRlZmluZWRgIGluIHByZSBFUzUgZW52aXJvbm1lbnRzLiAqL1xuICB2YXIgdW5kZWZpbmVkO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIE9iamVjdC4gKi9cbiAgdmFyIG9iamVjdFR5cGVzID0ge1xuICAgICdmdW5jdGlvbic6IHRydWUsXG4gICAgJ29iamVjdCc6IHRydWVcbiAgfTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbiAgdmFyIHJvb3QgPSAob2JqZWN0VHlwZXNbdHlwZW9mIHdpbmRvd10gJiYgd2luZG93KSB8fCB0aGlzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZGVmaW5lYC4gKi9cbiAgdmFyIGZyZWVEZWZpbmUgPSB0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCAmJiBkZWZpbmU7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbiAgdmFyIGZyZWVFeHBvcnRzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGV4cG9ydHNdICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG4gIHZhciBmcmVlTW9kdWxlID0gb2JqZWN0VHlwZXNbdHlwZW9mIG1vZHVsZV0gJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMgb3IgQnJvd3NlcmlmaWVkIGNvZGUgYW5kIHVzZSBpdCBhcyBgcm9vdGAuICovXG4gIHZhciBmcmVlR2xvYmFsID0gZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcbiAgaWYgKGZyZWVHbG9iYWwgJiYgKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbCkpIHtcbiAgICByb290ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcmVxdWlyZWAuICovXG4gIHZhciBmcmVlUmVxdWlyZSA9IHR5cGVvZiByZXF1aXJlID09ICdmdW5jdGlvbicgJiYgcmVxdWlyZTtcblxuICAvKiogVXNlZCB0byBhc3NpZ24gZWFjaCBiZW5jaG1hcmsgYW4gaW5jcmVtZW50ZWQgaWQuICovXG4gIHZhciBjb3VudGVyID0gMDtcblxuICAvKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xuICB2YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cyAmJiBmcmVlRXhwb3J0cztcblxuICAvKiogVXNlZCB0byBkZXRlY3QgcHJpbWl0aXZlIHR5cGVzLiAqL1xuICB2YXIgcmVQcmltaXRpdmUgPSAvXig/OmJvb2xlYW58bnVtYmVyfHN0cmluZ3x1bmRlZmluZWQpJC87XG5cbiAgLyoqIFVzZWQgdG8gbWFrZSBldmVyeSBjb21waWxlZCB0ZXN0IHVuaXF1ZS4gKi9cbiAgdmFyIHVpZENvdW50ZXIgPSAwO1xuXG4gIC8qKiBVc2VkIHRvIGFzc2lnbiBkZWZhdWx0IGBjb250ZXh0YCBvYmplY3QgcHJvcGVydGllcy4gKi9cbiAgdmFyIGNvbnRleHRQcm9wcyA9IFtcbiAgICAnQXJyYXknLCAnRGF0ZScsICdGdW5jdGlvbicsICdNYXRoJywgJ09iamVjdCcsICdSZWdFeHAnLCAnU3RyaW5nJywgJ18nLFxuICAgICdjbGVhclRpbWVvdXQnLCAnY2hyb21lJywgJ2Nocm9taXVtJywgJ2RvY3VtZW50JywgJ25hdmlnYXRvcicsICdwaGFudG9tJyxcbiAgICAncGxhdGZvcm0nLCAncHJvY2VzcycsICdydW50aW1lJywgJ3NldFRpbWVvdXQnXG4gIF07XG5cbiAgLyoqIFVzZWQgdG8gYXZvaWQgaHogb2YgSW5maW5pdHkuICovXG4gIHZhciBkaXZpc29ycyA9IHtcbiAgICAnMSc6IDQwOTYsXG4gICAgJzInOiA1MTIsXG4gICAgJzMnOiA2NCxcbiAgICAnNCc6IDgsXG4gICAgJzUnOiAwXG4gIH07XG5cbiAgLyoqXG4gICAqIFQtRGlzdHJpYnV0aW9uIHR3by10YWlsZWQgY3JpdGljYWwgdmFsdWVzIGZvciA5NSUgY29uZmlkZW5jZS5cbiAgICogRm9yIG1vcmUgaW5mbyBzZWUgaHR0cDovL3d3dy5pdGwubmlzdC5nb3YvZGl2ODk4L2hhbmRib29rL2VkYS9zZWN0aW9uMy9lZGEzNjcyLmh0bS5cbiAgICovXG4gIHZhciB0VGFibGUgPSB7XG4gICAgJzEnOiAgMTIuNzA2LCAnMic6ICA0LjMwMywgJzMnOiAgMy4xODIsICc0JzogIDIuNzc2LCAnNSc6ICAyLjU3MSwgJzYnOiAgMi40NDcsXG4gICAgJzcnOiAgMi4zNjUsICAnOCc6ICAyLjMwNiwgJzknOiAgMi4yNjIsICcxMCc6IDIuMjI4LCAnMTEnOiAyLjIwMSwgJzEyJzogMi4xNzksXG4gICAgJzEzJzogMi4xNiwgICAnMTQnOiAyLjE0NSwgJzE1JzogMi4xMzEsICcxNic6IDIuMTIsICAnMTcnOiAyLjExLCAgJzE4JzogMi4xMDEsXG4gICAgJzE5JzogMi4wOTMsICAnMjAnOiAyLjA4NiwgJzIxJzogMi4wOCwgICcyMic6IDIuMDc0LCAnMjMnOiAyLjA2OSwgJzI0JzogMi4wNjQsXG4gICAgJzI1JzogMi4wNiwgICAnMjYnOiAyLjA1NiwgJzI3JzogMi4wNTIsICcyOCc6IDIuMDQ4LCAnMjknOiAyLjA0NSwgJzMwJzogMi4wNDIsXG4gICAgJ2luZmluaXR5JzogMS45NlxuICB9O1xuXG4gIC8qKlxuICAgKiBDcml0aWNhbCBNYW5uLVdoaXRuZXkgVS12YWx1ZXMgZm9yIDk1JSBjb25maWRlbmNlLlxuICAgKiBGb3IgbW9yZSBpbmZvIHNlZSBodHRwOi8vd3d3LnNhYnVyY2hpbGwuY29tL0lCYmlvbG9neS9zdGF0cy8wMDMuaHRtbC5cbiAgICovXG4gIHZhciB1VGFibGUgPSB7XG4gICAgJzUnOiAgWzAsIDEsIDJdLFxuICAgICc2JzogIFsxLCAyLCAzLCA1XSxcbiAgICAnNyc6ICBbMSwgMywgNSwgNiwgOF0sXG4gICAgJzgnOiAgWzIsIDQsIDYsIDgsIDEwLCAxM10sXG4gICAgJzknOiAgWzIsIDQsIDcsIDEwLCAxMiwgMTUsIDE3XSxcbiAgICAnMTAnOiBbMywgNSwgOCwgMTEsIDE0LCAxNywgMjAsIDIzXSxcbiAgICAnMTEnOiBbMywgNiwgOSwgMTMsIDE2LCAxOSwgMjMsIDI2LCAzMF0sXG4gICAgJzEyJzogWzQsIDcsIDExLCAxNCwgMTgsIDIyLCAyNiwgMjksIDMzLCAzN10sXG4gICAgJzEzJzogWzQsIDgsIDEyLCAxNiwgMjAsIDI0LCAyOCwgMzMsIDM3LCA0MSwgNDVdLFxuICAgICcxNCc6IFs1LCA5LCAxMywgMTcsIDIyLCAyNiwgMzEsIDM2LCA0MCwgNDUsIDUwLCA1NV0sXG4gICAgJzE1JzogWzUsIDEwLCAxNCwgMTksIDI0LCAyOSwgMzQsIDM5LCA0NCwgNDksIDU0LCA1OSwgNjRdLFxuICAgICcxNic6IFs2LCAxMSwgMTUsIDIxLCAyNiwgMzEsIDM3LCA0MiwgNDcsIDUzLCA1OSwgNjQsIDcwLCA3NV0sXG4gICAgJzE3JzogWzYsIDExLCAxNywgMjIsIDI4LCAzNCwgMzksIDQ1LCA1MSwgNTcsIDYzLCA2NywgNzUsIDgxLCA4N10sXG4gICAgJzE4JzogWzcsIDEyLCAxOCwgMjQsIDMwLCAzNiwgNDIsIDQ4LCA1NSwgNjEsIDY3LCA3NCwgODAsIDg2LCA5MywgOTldLFxuICAgICcxOSc6IFs3LCAxMywgMTksIDI1LCAzMiwgMzgsIDQ1LCA1MiwgNTgsIDY1LCA3MiwgNzgsIDg1LCA5MiwgOTksIDEwNiwgMTEzXSxcbiAgICAnMjAnOiBbOCwgMTQsIDIwLCAyNywgMzQsIDQxLCA0OCwgNTUsIDYyLCA2OSwgNzYsIDgzLCA5MCwgOTgsIDEwNSwgMTEyLCAxMTksIDEyN10sXG4gICAgJzIxJzogWzgsIDE1LCAyMiwgMjksIDM2LCA0MywgNTAsIDU4LCA2NSwgNzMsIDgwLCA4OCwgOTYsIDEwMywgMTExLCAxMTksIDEyNiwgMTM0LCAxNDJdLFxuICAgICcyMic6IFs5LCAxNiwgMjMsIDMwLCAzOCwgNDUsIDUzLCA2MSwgNjksIDc3LCA4NSwgOTMsIDEwMSwgMTA5LCAxMTcsIDEyNSwgMTMzLCAxNDEsIDE1MCwgMTU4XSxcbiAgICAnMjMnOiBbOSwgMTcsIDI0LCAzMiwgNDAsIDQ4LCA1NiwgNjQsIDczLCA4MSwgODksIDk4LCAxMDYsIDExNSwgMTIzLCAxMzIsIDE0MCwgMTQ5LCAxNTcsIDE2NiwgMTc1XSxcbiAgICAnMjQnOiBbMTAsIDE3LCAyNSwgMzMsIDQyLCA1MCwgNTksIDY3LCA3NiwgODUsIDk0LCAxMDIsIDExMSwgMTIwLCAxMjksIDEzOCwgMTQ3LCAxNTYsIDE2NSwgMTc0LCAxODMsIDE5Ml0sXG4gICAgJzI1JzogWzEwLCAxOCwgMjcsIDM1LCA0NCwgNTMsIDYyLCA3MSwgODAsIDg5LCA5OCwgMTA3LCAxMTcsIDEyNiwgMTM1LCAxNDUsIDE1NCwgMTYzLCAxNzMsIDE4MiwgMTkyLCAyMDEsIDIxMV0sXG4gICAgJzI2JzogWzExLCAxOSwgMjgsIDM3LCA0NiwgNTUsIDY0LCA3NCwgODMsIDkzLCAxMDIsIDExMiwgMTIyLCAxMzIsIDE0MSwgMTUxLCAxNjEsIDE3MSwgMTgxLCAxOTEsIDIwMCwgMjEwLCAyMjAsIDIzMF0sXG4gICAgJzI3JzogWzExLCAyMCwgMjksIDM4LCA0OCwgNTcsIDY3LCA3NywgODcsIDk3LCAxMDcsIDExOCwgMTI1LCAxMzgsIDE0NywgMTU4LCAxNjgsIDE3OCwgMTg4LCAxOTksIDIwOSwgMjE5LCAyMzAsIDI0MCwgMjUwXSxcbiAgICAnMjgnOiBbMTIsIDIxLCAzMCwgNDAsIDUwLCA2MCwgNzAsIDgwLCA5MCwgMTAxLCAxMTEsIDEyMiwgMTMyLCAxNDMsIDE1NCwgMTY0LCAxNzUsIDE4NiwgMTk2LCAyMDcsIDIxOCwgMjI4LCAyMzksIDI1MCwgMjYxLCAyNzJdLFxuICAgICcyOSc6IFsxMywgMjIsIDMyLCA0MiwgNTIsIDYyLCA3MywgODMsIDk0LCAxMDUsIDExNiwgMTI3LCAxMzgsIDE0OSwgMTYwLCAxNzEsIDE4MiwgMTkzLCAyMDQsIDIxNSwgMjI2LCAyMzgsIDI0OSwgMjYwLCAyNzEsIDI4MiwgMjk0XSxcbiAgICAnMzAnOiBbMTMsIDIzLCAzMywgNDMsIDU0LCA2NSwgNzYsIDg3LCA5OCwgMTA5LCAxMjAsIDEzMSwgMTQzLCAxNTQsIDE2NiwgMTc3LCAxODksIDIwMCwgMjEyLCAyMjMsIDIzNSwgMjQ3LCAyNTgsIDI3MCwgMjgyLCAyOTMsIDMwNSwgMzE3XVxuICB9O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYEJlbmNobWFya2AgZnVuY3Rpb24gdXNpbmcgdGhlIGdpdmVuIGBjb250ZXh0YCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbnRleHQ9cm9vdF0gVGhlIGNvbnRleHQgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYSBuZXcgYEJlbmNobWFya2AgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBydW5JbkNvbnRleHQoY29udGV4dCkge1xuICAgIC8vIEV4aXQgZWFybHkgaWYgdW5hYmxlIHRvIGFjcXVpcmUgbG9kYXNoLlxuICAgIHZhciBfID0gY29udGV4dCAmJiBjb250ZXh0Ll8gfHwgcmVxdWlyZSgnbG9kYXNoJykgfHwgcm9vdC5fO1xuICAgIGlmICghXykge1xuICAgICAgQmVuY2htYXJrLnJ1bkluQ29udGV4dCA9IHJ1bkluQ29udGV4dDtcbiAgICAgIHJldHVybiBCZW5jaG1hcms7XG4gICAgfVxuICAgIC8vIEF2b2lkIGlzc3VlcyB3aXRoIHNvbWUgRVMzIGVudmlyb25tZW50cyB0aGF0IGF0dGVtcHQgdG8gdXNlIHZhbHVlcywgbmFtZWRcbiAgICAvLyBhZnRlciBidWlsdC1pbiBjb25zdHJ1Y3RvcnMgbGlrZSBgT2JqZWN0YCwgZm9yIHRoZSBjcmVhdGlvbiBvZiBsaXRlcmFscy5cbiAgICAvLyBFUzUgY2xlYXJzIHRoaXMgdXAgYnkgc3RhdGluZyB0aGF0IGxpdGVyYWxzIG11c3QgdXNlIGJ1aWx0LWluIGNvbnN0cnVjdG9ycy5cbiAgICAvLyBTZWUgaHR0cDovL2VzNS5naXRodWIuaW8vI3gxMS4xLjUuXG4gICAgY29udGV4dCA9IGNvbnRleHQgPyBfLmRlZmF1bHRzKHJvb3QuT2JqZWN0KCksIGNvbnRleHQsIF8ucGljayhyb290LCBjb250ZXh0UHJvcHMpKSA6IHJvb3Q7XG5cbiAgICAvKiogTmF0aXZlIGNvbnN0cnVjdG9yIHJlZmVyZW5jZXMuICovXG4gICAgdmFyIEFycmF5ID0gY29udGV4dC5BcnJheSxcbiAgICAgICAgRGF0ZSA9IGNvbnRleHQuRGF0ZSxcbiAgICAgICAgRnVuY3Rpb24gPSBjb250ZXh0LkZ1bmN0aW9uLFxuICAgICAgICBNYXRoID0gY29udGV4dC5NYXRoLFxuICAgICAgICBPYmplY3QgPSBjb250ZXh0Lk9iamVjdCxcbiAgICAgICAgUmVnRXhwID0gY29udGV4dC5SZWdFeHAsXG4gICAgICAgIFN0cmluZyA9IGNvbnRleHQuU3RyaW5nO1xuXG4gICAgLyoqIFVzZWQgZm9yIGBBcnJheWAgYW5kIGBPYmplY3RgIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuICAgIHZhciBhcnJheVJlZiA9IFtdLFxuICAgICAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgICAvKiogTmF0aXZlIG1ldGhvZCBzaG9ydGN1dHMuICovXG4gICAgdmFyIGFicyA9IE1hdGguYWJzLFxuICAgICAgICBjbGVhclRpbWVvdXQgPSBjb250ZXh0LmNsZWFyVGltZW91dCxcbiAgICAgICAgZmxvb3IgPSBNYXRoLmZsb29yLFxuICAgICAgICBsb2cgPSBNYXRoLmxvZyxcbiAgICAgICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgICAgIG1pbiA9IE1hdGgubWluLFxuICAgICAgICBwb3cgPSBNYXRoLnBvdyxcbiAgICAgICAgcHVzaCA9IGFycmF5UmVmLnB1c2gsXG4gICAgICAgIHNldFRpbWVvdXQgPSBjb250ZXh0LnNldFRpbWVvdXQsXG4gICAgICAgIHNoaWZ0ID0gYXJyYXlSZWYuc2hpZnQsXG4gICAgICAgIHNsaWNlID0gYXJyYXlSZWYuc2xpY2UsXG4gICAgICAgIHNxcnQgPSBNYXRoLnNxcnQsXG4gICAgICAgIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmcsXG4gICAgICAgIHVuc2hpZnQgPSBhcnJheVJlZi51bnNoaWZ0O1xuXG4gICAgLyoqIFVzZWQgdG8gYXZvaWQgaW5jbHVzaW9uIGluIEJyb3dzZXJpZmllZCBidW5kbGVzLiAqL1xuICAgIHZhciByZXEgPSByZXF1aXJlO1xuXG4gICAgLyoqIERldGVjdCBET00gZG9jdW1lbnQgb2JqZWN0LiAqL1xuICAgIHZhciBkb2MgPSBpc0hvc3RUeXBlKGNvbnRleHQsICdkb2N1bWVudCcpICYmIGNvbnRleHQuZG9jdW1lbnQ7XG5cbiAgICAvKiogVXNlZCB0byBhY2Nlc3MgV2FkZSBTaW1tb25zJyBOb2RlLmpzIGBtaWNyb3RpbWVgIG1vZHVsZS4gKi9cbiAgICB2YXIgbWljcm90aW1lT2JqZWN0ID0gcmVxKCdtaWNyb3RpbWUnKTtcblxuICAgIC8qKiBVc2VkIHRvIGFjY2VzcyBOb2RlLmpzJ3MgaGlnaCByZXNvbHV0aW9uIHRpbWVyLiAqL1xuICAgIHZhciBwcm9jZXNzT2JqZWN0ID0gaXNIb3N0VHlwZShjb250ZXh0LCAncHJvY2VzcycpICYmIGNvbnRleHQucHJvY2VzcztcblxuICAgIC8qKiBVc2VkIHRvIHByZXZlbnQgYSBgcmVtb3ZlQ2hpbGRgIG1lbW9yeSBsZWFrIGluIElFIDwgOS4gKi9cbiAgICB2YXIgdHJhc2ggPSBkb2MgJiYgZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgLyoqIFVzZWQgdG8gaW50ZWdyaXR5IGNoZWNrIGNvbXBpbGVkIHRlc3RzLiAqL1xuICAgIHZhciB1aWQgPSAndWlkJyArIF8ubm93KCk7XG5cbiAgICAvKiogVXNlZCB0byBhdm9pZCBpbmZpbml0ZSByZWN1cnNpb24gd2hlbiBtZXRob2RzIGNhbGwgZWFjaCBvdGhlci4gKi9cbiAgICB2YXIgY2FsbGVkQnkgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCB1c2VkIHRvIGZsYWcgZW52aXJvbm1lbnRzL2ZlYXR1cmVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgc3VwcG9ydCA9IHt9O1xuXG4gICAgKGZ1bmN0aW9uKCkge1xuXG4gICAgICAvKipcbiAgICAgICAqIERldGVjdCBpZiBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLnN1cHBvcnRcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgc3VwcG9ydC5icm93c2VyID0gZG9jICYmIGlzSG9zdFR5cGUoY29udGV4dCwgJ25hdmlnYXRvcicpICYmICFpc0hvc3RUeXBlKGNvbnRleHQsICdwaGFudG9tJyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRGV0ZWN0IGlmIHRoZSBUaW1lcnMgQVBJIGV4aXN0cy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLnN1cHBvcnRcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgc3VwcG9ydC50aW1lb3V0ID0gaXNIb3N0VHlwZShjb250ZXh0LCAnc2V0VGltZW91dCcpICYmIGlzSG9zdFR5cGUoY29udGV4dCwgJ2NsZWFyVGltZW91dCcpO1xuXG4gICAgICAvKipcbiAgICAgICAqIERldGVjdCBpZiBmdW5jdGlvbiBkZWNvbXBpbGF0aW9uIGlzIHN1cHBvcnQuXG4gICAgICAgKlxuICAgICAgICogQG5hbWUgZGVjb21waWxhdGlvblxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5zdXBwb3J0XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFNhZmFyaSAyLnggcmVtb3ZlcyBjb21tYXMgaW4gb2JqZWN0IGxpdGVyYWxzIGZyb20gYEZ1bmN0aW9uI3RvU3RyaW5nYCByZXN1bHRzLlxuICAgICAgICAvLyBTZWUgaHR0cDovL3dlYmsuaXQvMTE2MDkgZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgICAgLy8gRmlyZWZveCAzLjYgYW5kIE9wZXJhIDkuMjUgc3RyaXAgZ3JvdXBpbmcgcGFyZW50aGVzZXMgZnJvbSBgRnVuY3Rpb24jdG9TdHJpbmdgIHJlc3VsdHMuXG4gICAgICAgIC8vIFNlZSBodHRwOi8vYnVnemlsLmxhLzU1OTQzOCBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgICBzdXBwb3J0LmRlY29tcGlsYXRpb24gPSBGdW5jdGlvbihcbiAgICAgICAgICAoJ3JldHVybiAoJyArIChmdW5jdGlvbih4KSB7IHJldHVybiB7ICd4JzogJycgKyAoMSArIHgpICsgJycsICd5JzogMCB9OyB9KSArICcpJylcbiAgICAgICAgICAvLyBBdm9pZCBpc3N1ZXMgd2l0aCBjb2RlIGFkZGVkIGJ5IElzdGFuYnVsLlxuICAgICAgICAgIC5yZXBsYWNlKC9fX2Nvdl9fW147XSs7L2csICcnKVxuICAgICAgICApKCkoMCkueCA9PT0gJzEnO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHN1cHBvcnQuZGVjb21waWxhdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0oKSk7XG5cbiAgICAvKipcbiAgICAgKiBUaW1lciBvYmplY3QgdXNlZCBieSBgY2xvY2soKWAgYW5kIGBEZWZlcnJlZCNyZXNvbHZlYC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgdmFyIHRpbWVyID0ge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSB0aW1lciBuYW1lc3BhY2Ugb2JqZWN0IG9yIGNvbnN0cnVjdG9yLlxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAbWVtYmVyT2YgdGltZXJcbiAgICAgICAqIEB0eXBlIHtGdW5jdGlvbnxPYmplY3R9XG4gICAgICAgKi9cbiAgICAgICducyc6IERhdGUsXG5cbiAgICAgIC8qKlxuICAgICAgICogU3RhcnRzIHRoZSBkZWZlcnJlZCB0aW1lci5cbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogQG1lbWJlck9mIHRpbWVyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmZXJyZWQgVGhlIGRlZmVycmVkIGluc3RhbmNlLlxuICAgICAgICovXG4gICAgICAnc3RhcnQnOiBudWxsLCAvLyBMYXp5IGRlZmluZWQgaW4gYGNsb2NrKClgLlxuXG4gICAgICAvKipcbiAgICAgICAqIFN0b3BzIHRoZSBkZWZlcnJlZCB0aW1lci5cbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogQG1lbWJlck9mIHRpbWVyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVmZXJyZWQgVGhlIGRlZmVycmVkIGluc3RhbmNlLlxuICAgICAgICovXG4gICAgICAnc3RvcCc6IG51bGwgLy8gTGF6eSBkZWZpbmVkIGluIGBjbG9jaygpYC5cbiAgICB9O1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogVGhlIEJlbmNobWFyayBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIE5vdGU6IFRoZSBCZW5jaG1hcmsgY29uc3RydWN0b3IgZXhwb3NlcyBhIGhhbmRmdWwgb2YgbG9kYXNoIG1ldGhvZHMgdG9cbiAgICAgKiBtYWtlIHdvcmtpbmcgd2l0aCBhcnJheXMsIGNvbGxlY3Rpb25zLCBhbmQgb2JqZWN0cyBlYXNpZXIuIFRoZSBsb2Rhc2hcbiAgICAgKiBtZXRob2RzIGFyZTpcbiAgICAgKiBbYGVhY2gvZm9yRWFjaGBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI2ZvckVhY2gpLCBbYGZvck93bmBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI2Zvck93biksXG4gICAgICogW2BoYXNgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNoYXMpLCBbYGluZGV4T2ZgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNpbmRleE9mKSxcbiAgICAgKiBbYG1hcGBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI21hcCksIGFuZCBbYHJlZHVjZWBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI3JlZHVjZSlcbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEEgbmFtZSB0byBpZGVudGlmeSB0aGUgYmVuY2htYXJrLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmbiBUaGUgdGVzdCB0byBiZW5jaG1hcmsuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gYmFzaWMgdXNhZ2UgKHRoZSBgbmV3YCBvcGVyYXRvciBpcyBvcHRpb25hbClcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKGZuKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHVzaW5nIGEgbmFtZSBmaXJzdFxuICAgICAqIHZhciBiZW5jaCA9IG5ldyBCZW5jaG1hcmsoJ2ZvbycsIGZuKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHdpdGggb3B0aW9uc1xuICAgICAqIHZhciBiZW5jaCA9IG5ldyBCZW5jaG1hcmsoJ2ZvbycsIGZuLCB7XG4gICAgICpcbiAgICAgKiAgIC8vIGRpc3BsYXllZCBieSBgQmVuY2htYXJrI3RvU3RyaW5nYCBpZiBgbmFtZWAgaXMgbm90IGF2YWlsYWJsZVxuICAgICAqICAgJ2lkJzogJ3h5eicsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgc3RhcnRzIHJ1bm5pbmdcbiAgICAgKiAgICdvblN0YXJ0Jzogb25TdGFydCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIGFmdGVyIGVhY2ggcnVuIGN5Y2xlXG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIGFib3J0ZWRcbiAgICAgKiAgICdvbkFib3J0Jzogb25BYm9ydCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gYSB0ZXN0IGVycm9yc1xuICAgICAqICAgJ29uRXJyb3InOiBvbkVycm9yLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiByZXNldFxuICAgICAqICAgJ29uUmVzZXQnOiBvblJlc2V0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIGNvbXBsZXRlcyBydW5uaW5nXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGUsXG4gICAgICpcbiAgICAgKiAgIC8vIGNvbXBpbGVkL2NhbGxlZCBiZWZvcmUgdGhlIHRlc3QgbG9vcFxuICAgICAqICAgJ3NldHVwJzogc2V0dXAsXG4gICAgICpcbiAgICAgKiAgIC8vIGNvbXBpbGVkL2NhbGxlZCBhZnRlciB0aGUgdGVzdCBsb29wXG4gICAgICogICAndGVhcmRvd24nOiB0ZWFyZG93blxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gb3IgbmFtZSBhbmQgb3B0aW9uc1xuICAgICAqIHZhciBiZW5jaCA9IG5ldyBCZW5jaG1hcmsoJ2ZvbycsIHtcbiAgICAgKlxuICAgICAqICAgLy8gYSBmbGFnIHRvIGluZGljYXRlIHRoZSBiZW5jaG1hcmsgaXMgZGVmZXJyZWRcbiAgICAgKiAgICdkZWZlcic6IHRydWUsXG4gICAgICpcbiAgICAgKiAgIC8vIGJlbmNobWFyayB0ZXN0IGZ1bmN0aW9uXG4gICAgICogICAnZm4nOiBmdW5jdGlvbihkZWZlcnJlZCkge1xuICAgICAqICAgICAvLyBjYWxsIGBEZWZlcnJlZCNyZXNvbHZlYCB3aGVuIHRoZSBkZWZlcnJlZCB0ZXN0IGlzIGZpbmlzaGVkXG4gICAgICogICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIG9yIG9wdGlvbnMgb25seVxuICAgICAqIHZhciBiZW5jaCA9IG5ldyBCZW5jaG1hcmsoe1xuICAgICAqXG4gICAgICogICAvLyBiZW5jaG1hcmsgbmFtZVxuICAgICAqICAgJ25hbWUnOiAnZm9vJyxcbiAgICAgKlxuICAgICAqICAgLy8gYmVuY2htYXJrIHRlc3QgYXMgYSBzdHJpbmdcbiAgICAgKiAgICdmbic6ICdbMSwyLDMsNF0uc29ydCgpJ1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gYSB0ZXN0J3MgYHRoaXNgIGJpbmRpbmcgaXMgc2V0IHRvIHRoZSBiZW5jaG1hcmsgaW5zdGFuY2VcbiAgICAgKiB2YXIgYmVuY2ggPSBuZXcgQmVuY2htYXJrKCdmb28nLCBmdW5jdGlvbigpIHtcbiAgICAgKiAgICdNeSBuYW1lIGlzICcuY29uY2F0KHRoaXMubmFtZSk7IC8vIFwiTXkgbmFtZSBpcyBmb29cIlxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIEJlbmNobWFyayhuYW1lLCBmbiwgb3B0aW9ucykge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcztcblxuICAgICAgLy8gQWxsb3cgaW5zdGFuY2UgY3JlYXRpb24gd2l0aG91dCB0aGUgYG5ld2Agb3BlcmF0b3IuXG4gICAgICBpZiAoIShiZW5jaCBpbnN0YW5jZW9mIEJlbmNobWFyaykpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCZW5jaG1hcmsobmFtZSwgZm4sIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgLy8gSnVnZ2xlIGFyZ3VtZW50cy5cbiAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QobmFtZSkpIHtcbiAgICAgICAgLy8gMSBhcmd1bWVudCAob3B0aW9ucykuXG4gICAgICAgIG9wdGlvbnMgPSBuYW1lO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKG5hbWUpKSB7XG4gICAgICAgIC8vIDIgYXJndW1lbnRzIChmbiwgb3B0aW9ucykuXG4gICAgICAgIG9wdGlvbnMgPSBmbjtcbiAgICAgICAgZm4gPSBuYW1lO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoXy5pc1BsYWluT2JqZWN0KGZuKSkge1xuICAgICAgICAvLyAyIGFyZ3VtZW50cyAobmFtZSwgb3B0aW9ucykuXG4gICAgICAgIG9wdGlvbnMgPSBmbjtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgICAgICBiZW5jaC5uYW1lID0gbmFtZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICAvLyAzIGFyZ3VtZW50cyAobmFtZSwgZm4gWywgb3B0aW9uc10pLlxuICAgICAgICBiZW5jaC5uYW1lID0gbmFtZTtcbiAgICAgIH1cbiAgICAgIHNldE9wdGlvbnMoYmVuY2gsIG9wdGlvbnMpO1xuXG4gICAgICBiZW5jaC5pZCB8fCAoYmVuY2guaWQgPSArK2NvdW50ZXIpO1xuICAgICAgYmVuY2guZm4gPT0gbnVsbCAmJiAoYmVuY2guZm4gPSBmbik7XG5cbiAgICAgIGJlbmNoLnN0YXRzID0gY2xvbmVEZWVwKGJlbmNoLnN0YXRzKTtcbiAgICAgIGJlbmNoLnRpbWVzID0gY2xvbmVEZWVwKGJlbmNoLnRpbWVzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRGVmZXJyZWQgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNsb25lIFRoZSBjbG9uZWQgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIERlZmVycmVkKGNsb25lKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSB0aGlzO1xuICAgICAgaWYgKCEoZGVmZXJyZWQgaW5zdGFuY2VvZiBEZWZlcnJlZCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEZWZlcnJlZChjbG9uZSk7XG4gICAgICB9XG4gICAgICBkZWZlcnJlZC5iZW5jaG1hcmsgPSBjbG9uZTtcbiAgICAgIGNsb2NrKGRlZmVycmVkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRXZlbnQgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSB0eXBlIFRoZSBldmVudCB0eXBlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEV2ZW50KHR5cGUpIHtcbiAgICAgIHZhciBldmVudCA9IHRoaXM7XG4gICAgICBpZiAodHlwZSBpbnN0YW5jZW9mIEV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChldmVudCBpbnN0YW5jZW9mIEV2ZW50KVxuICAgICAgICA/IF8uYXNzaWduKGV2ZW50LCB7ICd0aW1lU3RhbXAnOiBfLm5vdygpIH0sIHR5cGVvZiB0eXBlID09ICdzdHJpbmcnID8geyAndHlwZSc6IHR5cGUgfSA6IHR5cGUpXG4gICAgICAgIDogbmV3IEV2ZW50KHR5cGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBTdWl0ZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIE5vdGU6IEVhY2ggU3VpdGUgaW5zdGFuY2UgaGFzIGEgaGFuZGZ1bCBvZiB3cmFwcGVkIGxvZGFzaCBtZXRob2RzIHRvXG4gICAgICogbWFrZSB3b3JraW5nIHdpdGggU3VpdGVzIGVhc2llci4gVGhlIHdyYXBwZWQgbG9kYXNoIG1ldGhvZHMgYXJlOlxuICAgICAqIFtgZWFjaC9mb3JFYWNoYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjZm9yRWFjaCksIFtgaW5kZXhPZmBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI2luZGV4T2YpLFxuICAgICAqIFtgbWFwYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjbWFwKSwgYW5kIFtgcmVkdWNlYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjcmVkdWNlKVxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEEgbmFtZSB0byBpZGVudGlmeSB0aGUgc3VpdGUuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gYmFzaWMgdXNhZ2UgKHRoZSBgbmV3YCBvcGVyYXRvciBpcyBvcHRpb25hbClcbiAgICAgKiB2YXIgc3VpdGUgPSBuZXcgQmVuY2htYXJrLlN1aXRlO1xuICAgICAqXG4gICAgICogLy8gb3IgdXNpbmcgYSBuYW1lIGZpcnN0XG4gICAgICogdmFyIHN1aXRlID0gbmV3IEJlbmNobWFyay5TdWl0ZSgnZm9vJyk7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiB2YXIgc3VpdGUgPSBuZXcgQmVuY2htYXJrLlN1aXRlKCdmb28nLCB7XG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIHRoZSBzdWl0ZSBzdGFydHMgcnVubmluZ1xuICAgICAqICAgJ29uU3RhcnQnOiBvblN0YXJ0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgYmV0d2VlbiBydW5uaW5nIGJlbmNobWFya3NcbiAgICAgKiAgICdvbkN5Y2xlJzogb25DeWNsZSxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gYWJvcnRlZFxuICAgICAqICAgJ29uQWJvcnQnOiBvbkFib3J0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiBhIHRlc3QgZXJyb3JzXG4gICAgICogICAnb25FcnJvcic6IG9uRXJyb3IsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIHJlc2V0XG4gICAgICogICAnb25SZXNldCc6IG9uUmVzZXQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIHRoZSBzdWl0ZSBjb21wbGV0ZXMgcnVubmluZ1xuICAgICAqICAgJ29uQ29tcGxldGUnOiBvbkNvbXBsZXRlXG4gICAgICogfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gU3VpdGUobmFtZSwgb3B0aW9ucykge1xuICAgICAgdmFyIHN1aXRlID0gdGhpcztcblxuICAgICAgLy8gQWxsb3cgaW5zdGFuY2UgY3JlYXRpb24gd2l0aG91dCB0aGUgYG5ld2Agb3BlcmF0b3IuXG4gICAgICBpZiAoIShzdWl0ZSBpbnN0YW5jZW9mIFN1aXRlKSkge1xuICAgICAgICByZXR1cm4gbmV3IFN1aXRlKG5hbWUsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgLy8gSnVnZ2xlIGFyZ3VtZW50cy5cbiAgICAgIGlmIChfLmlzUGxhaW5PYmplY3QobmFtZSkpIHtcbiAgICAgICAgLy8gMSBhcmd1bWVudCAob3B0aW9ucykuXG4gICAgICAgIG9wdGlvbnMgPSBuYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gMiBhcmd1bWVudHMgKG5hbWUgWywgb3B0aW9uc10pLlxuICAgICAgICBzdWl0ZS5uYW1lID0gbmFtZTtcbiAgICAgIH1cbiAgICAgIHNldE9wdGlvbnMoc3VpdGUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5jbG9uZURlZXBgIHdoaWNoIG9ubHkgY2xvbmVzIGFycmF5cyBhbmQgcGxhaW5cbiAgICAgKiBvYmplY3RzIGFzc2lnbmluZyBhbGwgb3RoZXIgdmFsdWVzIGJ5IHJlZmVyZW5jZS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAgICogQHJldHVybnMgeyp9IFRoZSBjbG9uZWQgdmFsdWUuXG4gICAgICovXG4gICAgdmFyIGNsb25lRGVlcCA9IF8ucGFydGlhbChfLmNsb25lRGVlcFdpdGgsIF8sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAvLyBPbmx5IGNsb25lIHByaW1pdGl2ZXMsIGFycmF5cywgYW5kIHBsYWluIG9iamVjdHMuXG4gICAgICByZXR1cm4gKF8uaXNPYmplY3QodmFsdWUpICYmICFfLmlzQXJyYXkodmFsdWUpICYmICFfLmlzUGxhaW5PYmplY3QodmFsdWUpKVxuICAgICAgICA/IHZhbHVlXG4gICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGZyb20gdGhlIGdpdmVuIGFyZ3VtZW50cyBzdHJpbmcgYW5kIGJvZHkuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhcmdzIFRoZSBjb21tYSBzZXBhcmF0ZWQgZnVuY3Rpb24gYXJndW1lbnRzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBib2R5IFRoZSBmdW5jdGlvbiBib2R5LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gVGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVGdW5jdGlvbigpIHtcbiAgICAgIC8vIExhenkgZGVmaW5lLlxuICAgICAgY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbihhcmdzLCBib2R5KSB7XG4gICAgICAgIHZhciByZXN1bHQsXG4gICAgICAgICAgICBhbmNob3IgPSBmcmVlRGVmaW5lID8gZnJlZURlZmluZS5hbWQgOiBCZW5jaG1hcmssXG4gICAgICAgICAgICBwcm9wID0gdWlkICsgJ2NyZWF0ZUZ1bmN0aW9uJztcblxuICAgICAgICBydW5TY3JpcHQoKGZyZWVEZWZpbmUgPyAnZGVmaW5lLmFtZC4nIDogJ0JlbmNobWFyay4nKSArIHByb3AgKyAnPWZ1bmN0aW9uKCcgKyBhcmdzICsgJyl7JyArIGJvZHkgKyAnfScpO1xuICAgICAgICByZXN1bHQgPSBhbmNob3JbcHJvcF07XG4gICAgICAgIGRlbGV0ZSBhbmNob3JbcHJvcF07XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgICAgLy8gRml4IEphZWdlck1vbmtleSBidWcuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL2J1Z3ppbC5sYS82Mzk3MjAuXG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IHN1cHBvcnQuYnJvd3NlciAmJiAoY3JlYXRlRnVuY3Rpb24oJycsICdyZXR1cm5cIicgKyB1aWQgKyAnXCInKSB8fCBfLm5vb3ApKCkgPT0gdWlkID8gY3JlYXRlRnVuY3Rpb24gOiBGdW5jdGlvbjtcbiAgICAgIHJldHVybiBjcmVhdGVGdW5jdGlvbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGF5IHRoZSBleGVjdXRpb24gb2YgYSBmdW5jdGlvbiBiYXNlZCBvbiB0aGUgYmVuY2htYXJrJ3MgYGRlbGF5YCBwcm9wZXJ0eS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJlbmNoIFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGZuIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlbGF5KGJlbmNoLCBmbikge1xuICAgICAgYmVuY2guX3RpbWVySWQgPSBfLmRlbGF5KGZuLCBiZW5jaC5kZWxheSAqIDFlMyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveXMgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBkZXN0cm95LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlc3Ryb3lFbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgIHRyYXNoLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgdHJhc2guaW5uZXJIVE1MID0gJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgbmFtZSBvZiB0aGUgZmlyc3QgYXJndW1lbnQgZnJvbSBhIGZ1bmN0aW9uJ3Mgc291cmNlLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24uXG4gICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGFyZ3VtZW50IG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RBcmd1bWVudChmbikge1xuICAgICAgcmV0dXJuICghXy5oYXMoZm4sICd0b1N0cmluZycpICYmXG4gICAgICAgICgvXltcXHMoXSpmdW5jdGlvblteKF0qXFwoKFteXFxzLCldKykvLmV4ZWMoZm4pIHx8IDApWzFdKSB8fCAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyB0aGUgYXJpdGhtZXRpYyBtZWFuIG9mIGEgc2FtcGxlLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzYW1wbGUgVGhlIHNhbXBsZS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbWVhbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRNZWFuKHNhbXBsZSkge1xuICAgICAgcmV0dXJuIChfLnJlZHVjZShzYW1wbGUsIGZ1bmN0aW9uKHN1bSwgeCkge1xuICAgICAgICByZXR1cm4gc3VtICsgeDtcbiAgICAgIH0pIC8gc2FtcGxlLmxlbmd0aCkgfHwgMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzb3VyY2UgY29kZSBvZiBhIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24uXG4gICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGZ1bmN0aW9uJ3Mgc291cmNlIGNvZGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0U291cmNlKGZuKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICBpZiAoaXNTdHJpbmdhYmxlKGZuKSkge1xuICAgICAgICByZXN1bHQgPSBTdHJpbmcoZm4pO1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmRlY29tcGlsYXRpb24pIHtcbiAgICAgICAgLy8gRXNjYXBlIHRoZSBge2AgZm9yIEZpcmVmb3ggMS5cbiAgICAgICAgcmVzdWx0ID0gXy5yZXN1bHQoL15bXntdK1xceyhbXFxzXFxTXSopXFx9XFxzKiQvLmV4ZWMoZm4pLCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIFRyaW0gc3RyaW5nLlxuICAgICAgcmVzdWx0ID0gKHJlc3VsdCB8fCAnJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuXG4gICAgICAvLyBEZXRlY3Qgc3RyaW5ncyBjb250YWluaW5nIG9ubHkgdGhlIFwidXNlIHN0cmljdFwiIGRpcmVjdGl2ZS5cbiAgICAgIHJldHVybiAvXig/OlxcL1xcKitbXFx3XFxXXSo/XFwqXFwvfFxcL1xcLy4qP1tcXG5cXHJcXHUyMDI4XFx1MjAyOV18XFxzKSooW1wiJ10pdXNlIHN0cmljdFxcMTs/JC8udGVzdChyZXN1bHQpXG4gICAgICAgID8gJydcbiAgICAgICAgOiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGFuIG9iamVjdCBpcyBvZiB0aGUgc3BlY2lmaWVkIGNsYXNzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgY2xhc3MuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZSBpcyBvZiB0aGUgc3BlY2lmaWVkIGNsYXNzLCBlbHNlIGBmYWxzZWAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNDbGFzc09mKHZhbHVlLCBuYW1lKSB7XG4gICAgICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIb3N0IG9iamVjdHMgY2FuIHJldHVybiB0eXBlIHZhbHVlcyB0aGF0IGFyZSBkaWZmZXJlbnQgZnJvbSB0aGVpciBhY3R1YWxcbiAgICAgKiBkYXRhIHR5cGUuIFRoZSBvYmplY3RzIHdlIGFyZSBjb25jZXJuZWQgd2l0aCB1c3VhbGx5IHJldHVybiBub24tcHJpbWl0aXZlXG4gICAgICogdHlwZXMgb2YgXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiLCBvciBcInVua25vd25cIi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIG93bmVyIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIHByb3BlcnR5IHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgcHJvcGVydHkgdmFsdWUgaXMgYSBub24tcHJpbWl0aXZlLCBlbHNlIGBmYWxzZWAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNIb3N0VHlwZShvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XTtcbiAgICAgIHJldHVybiAhcmVQcmltaXRpdmUudGVzdCh0eXBlKSAmJiAodHlwZSAhPSAnb2JqZWN0JyB8fCAhIW9iamVjdFtwcm9wZXJ0eV0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhIHZhbHVlIGNhbiBiZSBzYWZlbHkgY29lcmNlZCB0byBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZSBjYW4gYmUgY29lcmNlZCwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU3RyaW5nYWJsZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIF8uaXNTdHJpbmcodmFsdWUpIHx8IChfLmhhcyh2YWx1ZSwgJ3RvU3RyaW5nJykgJiYgXy5pc0Z1bmN0aW9uKHZhbHVlLnRvU3RyaW5nKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSB3cmFwcGVyIGFyb3VuZCBgcmVxdWlyZWAgdG8gc3VwcHJlc3MgYG1vZHVsZSBtaXNzaW5nYCBlcnJvcnMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgbW9kdWxlIGlkLlxuICAgICAqIEByZXR1cm5zIHsqfSBUaGUgZXhwb3J0ZWQgbW9kdWxlIG9yIGBudWxsYC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXF1aXJlKGlkKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZnJlZUV4cG9ydHMgJiYgZnJlZVJlcXVpcmUoaWQpO1xuICAgICAgfSBjYXRjaChlKSB7fVxuICAgICAgcmV0dXJuIHJlc3VsdCB8fCBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1bnMgYSBzbmlwcGV0IG9mIEphdmFTY3JpcHQgdmlhIHNjcmlwdCBpbmplY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIFRoZSBjb2RlIHRvIHJ1bi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBydW5TY3JpcHQoY29kZSkge1xuICAgICAgdmFyIGFuY2hvciA9IGZyZWVEZWZpbmUgPyBkZWZpbmUuYW1kIDogQmVuY2htYXJrLFxuICAgICAgICAgIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSxcbiAgICAgICAgICBzaWJsaW5nID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXSxcbiAgICAgICAgICBwYXJlbnQgPSBzaWJsaW5nLnBhcmVudE5vZGUsXG4gICAgICAgICAgcHJvcCA9IHVpZCArICdydW5TY3JpcHQnLFxuICAgICAgICAgIHByZWZpeCA9ICcoJyArIChmcmVlRGVmaW5lID8gJ2RlZmluZS5hbWQuJyA6ICdCZW5jaG1hcmsuJykgKyBwcm9wICsgJ3x8ZnVuY3Rpb24oKXt9KSgpOyc7XG5cbiAgICAgIC8vIEZpcmVmb3ggMi4wLjAuMiBjYW5ub3QgdXNlIHNjcmlwdCBpbmplY3Rpb24gYXMgaW50ZW5kZWQgYmVjYXVzZSBpdCBleGVjdXRlc1xuICAgICAgLy8gYXN5bmNocm9ub3VzbHksIGJ1dCB0aGF0J3MgT0sgYmVjYXVzZSBzY3JpcHQgaW5qZWN0aW9uIGlzIG9ubHkgdXNlZCB0byBhdm9pZFxuICAgICAgLy8gdGhlIHByZXZpb3VzbHkgY29tbWVudGVkIEphZWdlck1vbmtleSBidWcuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGluc2VydGVkIHNjcmlwdCAqYmVmb3JlKiBydW5uaW5nIHRoZSBjb2RlIHRvIGF2b2lkIGRpZmZlcmVuY2VzXG4gICAgICAgIC8vIGluIHRoZSBleHBlY3RlZCBzY3JpcHQgZWxlbWVudCBjb3VudC9vcmRlciBvZiB0aGUgZG9jdW1lbnQuXG4gICAgICAgIHNjcmlwdC5hcHBlbmRDaGlsZChkb2MuY3JlYXRlVGV4dE5vZGUocHJlZml4ICsgY29kZSkpO1xuICAgICAgICBhbmNob3JbcHJvcF0gPSBmdW5jdGlvbigpIHsgZGVzdHJveUVsZW1lbnQoc2NyaXB0KTsgfTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQuY2xvbmVOb2RlKGZhbHNlKTtcbiAgICAgICAgc2libGluZyA9IG51bGw7XG4gICAgICAgIHNjcmlwdC50ZXh0ID0gY29kZTtcbiAgICAgIH1cbiAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUoc2NyaXB0LCBzaWJsaW5nKTtcbiAgICAgIGRlbGV0ZSBhbmNob3JbcHJvcF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBoZWxwZXIgZnVuY3Rpb24gZm9yIHNldHRpbmcgb3B0aW9ucy9ldmVudCBoYW5kbGVycy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgYmVuY2htYXJrIG9yIHN1aXRlIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0T3B0aW9ucyhvYmplY3QsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvYmplY3Qub3B0aW9ucyA9IF8uYXNzaWduKHt9LCBjbG9uZURlZXAob2JqZWN0LmNvbnN0cnVjdG9yLm9wdGlvbnMpLCBjbG9uZURlZXAob3B0aW9ucykpO1xuXG4gICAgICBfLmZvck93bihvcHRpb25zLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycy5cbiAgICAgICAgICBpZiAoL15vbltBLVpdLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgIF8uZWFjaChrZXkuc3BsaXQoJyAnKSwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICAgIG9iamVjdC5vbihrZXkuc2xpY2UoMikudG9Mb3dlckNhc2UoKSwgdmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIGlmICghXy5oYXMob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IGNsb25lRGVlcCh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGN5Y2xpbmcvY29tcGxldGluZyB0aGUgZGVmZXJyZWQgYmVuY2htYXJrLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5EZWZlcnJlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc29sdmUoKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSB0aGlzLFxuICAgICAgICAgIGNsb25lID0gZGVmZXJyZWQuYmVuY2htYXJrLFxuICAgICAgICAgIGJlbmNoID0gY2xvbmUuX29yaWdpbmFsO1xuXG4gICAgICBpZiAoYmVuY2guYWJvcnRlZCkge1xuICAgICAgICAvLyBjeWNsZSgpIC0+IGNsb25lIGN5Y2xlL2NvbXBsZXRlIGV2ZW50IC0+IGNvbXB1dGUoKSdzIGludm9rZWQgYmVuY2gucnVuKCkgY3ljbGUvY29tcGxldGUuXG4gICAgICAgIGRlZmVycmVkLnRlYXJkb3duKCk7XG4gICAgICAgIGNsb25lLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgY3ljbGUoZGVmZXJyZWQpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoKytkZWZlcnJlZC5jeWNsZXMgPCBjbG9uZS5jb3VudCkge1xuICAgICAgICBjbG9uZS5jb21waWxlZC5jYWxsKGRlZmVycmVkLCBjb250ZXh0LCB0aW1lcik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGltZXIuc3RvcChkZWZlcnJlZCk7XG4gICAgICAgIGRlZmVycmVkLnRlYXJkb3duKCk7XG4gICAgICAgIGRlbGF5KGNsb25lLCBmdW5jdGlvbigpIHsgY3ljbGUoZGVmZXJyZWQpOyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBIGdlbmVyaWMgYEFycmF5I2ZpbHRlcmAgbGlrZSBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGNhbGxiYWNrIFRoZSBmdW5jdGlvbi9hbGlhcyBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyB0aGF0IHBhc3NlZCBjYWxsYmFjayBmaWx0ZXIuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGdldCBvZGQgbnVtYmVyc1xuICAgICAqIEJlbmNobWFyay5maWx0ZXIoWzEsIDIsIDMsIDQsIDVdLCBmdW5jdGlvbihuKSB7XG4gICAgICogICByZXR1cm4gbiAlIDI7XG4gICAgICogfSk7IC8vIC0+IFsxLCAzLCA1XTtcbiAgICAgKlxuICAgICAqIC8vIGdldCBmYXN0ZXN0IGJlbmNobWFya3NcbiAgICAgKiBCZW5jaG1hcmsuZmlsdGVyKGJlbmNoZXMsICdmYXN0ZXN0Jyk7XG4gICAgICpcbiAgICAgKiAvLyBnZXQgc2xvd2VzdCBiZW5jaG1hcmtzXG4gICAgICogQmVuY2htYXJrLmZpbHRlcihiZW5jaGVzLCAnc2xvd2VzdCcpO1xuICAgICAqXG4gICAgICogLy8gZ2V0IGJlbmNobWFya3MgdGhhdCBjb21wbGV0ZWQgd2l0aG91dCBlcnJvcmluZ1xuICAgICAqIEJlbmNobWFyay5maWx0ZXIoYmVuY2hlcywgJ3N1Y2Nlc3NmdWwnKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaWx0ZXIoYXJyYXksIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoY2FsbGJhY2sgPT09ICdzdWNjZXNzZnVsJykge1xuICAgICAgICAvLyBDYWxsYmFjayB0byBleGNsdWRlIHRob3NlIHRoYXQgYXJlIGVycm9yZWQsIHVucnVuLCBvciBoYXZlIGh6IG9mIEluZmluaXR5LlxuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKGJlbmNoKSB7XG4gICAgICAgICAgcmV0dXJuIGJlbmNoLmN5Y2xlcyAmJiBfLmlzRmluaXRlKGJlbmNoLmh6KSAmJiAhYmVuY2guZXJyb3I7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChjYWxsYmFjayA9PT0gJ2Zhc3Rlc3QnIHx8IGNhbGxiYWNrID09PSAnc2xvd2VzdCcpIHtcbiAgICAgICAgLy8gR2V0IHN1Y2Nlc3NmdWwsIHNvcnQgYnkgcGVyaW9kICsgbWFyZ2luIG9mIGVycm9yLCBhbmQgZmlsdGVyIGZhc3Rlc3Qvc2xvd2VzdC5cbiAgICAgICAgdmFyIHJlc3VsdCA9IGZpbHRlcihhcnJheSwgJ3N1Y2Nlc3NmdWwnKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICBhID0gYS5zdGF0czsgYiA9IGIuc3RhdHM7XG4gICAgICAgICAgcmV0dXJuIChhLm1lYW4gKyBhLm1vZSA+IGIubWVhbiArIGIubW9lID8gMSA6IC0xKSAqIChjYWxsYmFjayA9PT0gJ2Zhc3Rlc3QnID8gMSA6IC0xKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHJlc3VsdCwgZnVuY3Rpb24oYmVuY2gpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0WzBdLmNvbXBhcmUoYmVuY2gpID09IDA7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydHMgYSBudW1iZXIgdG8gYSBtb3JlIHJlYWRhYmxlIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgVGhlIG51bWJlciB0byBjb252ZXJ0LlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBtb3JlIHJlYWRhYmxlIHN0cmluZyByZXByZXNlbnRhdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmb3JtYXROdW1iZXIobnVtYmVyKSB7XG4gICAgICBudW1iZXIgPSBTdHJpbmcobnVtYmVyKS5zcGxpdCgnLicpO1xuICAgICAgcmV0dXJuIG51bWJlclswXS5yZXBsYWNlKC8oPz0oPzpcXGR7M30pKyQpKD8hXFxiKS9nLCAnLCcpICtcbiAgICAgICAgKG51bWJlclsxXSA/ICcuJyArIG51bWJlclsxXSA6ICcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIGEgbWV0aG9kIG9uIGFsbCBpdGVtcyBpbiBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtBcnJheX0gYmVuY2hlcyBBcnJheSBvZiBiZW5jaG1hcmtzIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBpbnZva2UgT1Igb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnc10gQXJndW1lbnRzIHRvIGludm9rZSB0aGUgbWV0aG9kIHdpdGguXG4gICAgICogQHJldHVybnMge0FycmF5fSBBIG5ldyBhcnJheSBvZiB2YWx1ZXMgcmV0dXJuZWQgZnJvbSBlYWNoIG1ldGhvZCBpbnZva2VkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBpbnZva2UgYHJlc2V0YCBvbiBhbGwgYmVuY2htYXJrc1xuICAgICAqIEJlbmNobWFyay5pbnZva2UoYmVuY2hlcywgJ3Jlc2V0Jyk7XG4gICAgICpcbiAgICAgKiAvLyBpbnZva2UgYGVtaXRgIHdpdGggYXJndW1lbnRzXG4gICAgICogQmVuY2htYXJrLmludm9rZShiZW5jaGVzLCAnZW1pdCcsICdjb21wbGV0ZScsIGxpc3RlbmVyKTtcbiAgICAgKlxuICAgICAqIC8vIGludm9rZSBgcnVuKHRydWUpYCwgdHJlYXQgYmVuY2htYXJrcyBhcyBhIHF1ZXVlLCBhbmQgcmVnaXN0ZXIgaW52b2tlIGNhbGxiYWNrc1xuICAgICAqIEJlbmNobWFyay5pbnZva2UoYmVuY2hlcywge1xuICAgICAqXG4gICAgICogICAvLyBpbnZva2UgdGhlIGBydW5gIG1ldGhvZFxuICAgICAqICAgJ25hbWUnOiAncnVuJyxcbiAgICAgKlxuICAgICAqICAgLy8gcGFzcyBhIHNpbmdsZSBhcmd1bWVudFxuICAgICAqICAgJ2FyZ3MnOiB0cnVlLFxuICAgICAqXG4gICAgICogICAvLyB0cmVhdCBhcyBxdWV1ZSwgcmVtb3ZpbmcgYmVuY2htYXJrcyBmcm9tIGZyb250IG9mIGBiZW5jaGVzYCB1bnRpbCBlbXB0eVxuICAgICAqICAgJ3F1ZXVlZCc6IHRydWUsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCBiZWZvcmUgYW55IGJlbmNobWFya3MgaGF2ZSBiZWVuIGludm9rZWQuXG4gICAgICogICAnb25TdGFydCc6IG9uU3RhcnQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCBiZXR3ZWVuIGludm9raW5nIGJlbmNobWFya3NcbiAgICAgKiAgICdvbkN5Y2xlJzogb25DeWNsZSxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIGFmdGVyIGFsbCBiZW5jaG1hcmtzIGhhdmUgYmVlbiBpbnZva2VkLlxuICAgICAqICAgJ29uQ29tcGxldGUnOiBvbkNvbXBsZXRlXG4gICAgICogfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52b2tlKGJlbmNoZXMsIG5hbWUpIHtcbiAgICAgIHZhciBhcmdzLFxuICAgICAgICAgIGJlbmNoLFxuICAgICAgICAgIHF1ZXVlZCxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGV2ZW50UHJvcHMgPSB7ICdjdXJyZW50VGFyZ2V0JzogYmVuY2hlcyB9LFxuICAgICAgICAgIG9wdGlvbnMgPSB7ICdvblN0YXJ0JzogXy5ub29wLCAnb25DeWNsZSc6IF8ubm9vcCwgJ29uQ29tcGxldGUnOiBfLm5vb3AgfSxcbiAgICAgICAgICByZXN1bHQgPSBfLnRvQXJyYXkoYmVuY2hlcyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogSW52b2tlcyB0aGUgbWV0aG9kIG9mIHRoZSBjdXJyZW50IG9iamVjdCBhbmQgaWYgc3luY2hyb25vdXMsIGZldGNoZXMgdGhlIG5leHQuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGV4ZWN1dGUoKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMsXG4gICAgICAgICAgICBhc3luYyA9IGlzQXN5bmMoYmVuY2gpO1xuXG4gICAgICAgIGlmIChhc3luYykge1xuICAgICAgICAgIC8vIFVzZSBgZ2V0TmV4dGAgYXMgdGhlIGZpcnN0IGxpc3RlbmVyLlxuICAgICAgICAgIGJlbmNoLm9uKCdjb21wbGV0ZScsIGdldE5leHQpO1xuICAgICAgICAgIGxpc3RlbmVycyA9IGJlbmNoLmV2ZW50cy5jb21wbGV0ZTtcbiAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKDAsIDAsIGxpc3RlbmVycy5wb3AoKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXhlY3V0ZSBtZXRob2QuXG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBfLmlzRnVuY3Rpb24oYmVuY2ggJiYgYmVuY2hbbmFtZV0pID8gYmVuY2hbbmFtZV0uYXBwbHkoYmVuY2gsIGFyZ3MpIDogdW5kZWZpbmVkO1xuICAgICAgICAvLyBJZiBzeW5jaHJvbm91cyByZXR1cm4gYHRydWVgIHVudGlsIGZpbmlzaGVkLlxuICAgICAgICByZXR1cm4gIWFzeW5jICYmIGdldE5leHQoKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBGZXRjaGVzIHRoZSBuZXh0IGJlbmNoIG9yIGV4ZWN1dGVzIGBvbkNvbXBsZXRlYCBjYWxsYmFjay5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZ2V0TmV4dChldmVudCkge1xuICAgICAgICB2YXIgY3ljbGVFdmVudCxcbiAgICAgICAgICAgIGxhc3QgPSBiZW5jaCxcbiAgICAgICAgICAgIGFzeW5jID0gaXNBc3luYyhsYXN0KTtcblxuICAgICAgICBpZiAoYXN5bmMpIHtcbiAgICAgICAgICBsYXN0Lm9mZignY29tcGxldGUnLCBnZXROZXh0KTtcbiAgICAgICAgICBsYXN0LmVtaXQoJ2NvbXBsZXRlJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW1pdCBcImN5Y2xlXCIgZXZlbnQuXG4gICAgICAgIGV2ZW50UHJvcHMudHlwZSA9ICdjeWNsZSc7XG4gICAgICAgIGV2ZW50UHJvcHMudGFyZ2V0ID0gbGFzdDtcbiAgICAgICAgY3ljbGVFdmVudCA9IEV2ZW50KGV2ZW50UHJvcHMpO1xuICAgICAgICBvcHRpb25zLm9uQ3ljbGUuY2FsbChiZW5jaGVzLCBjeWNsZUV2ZW50KTtcblxuICAgICAgICAvLyBDaG9vc2UgbmV4dCBiZW5jaG1hcmsgaWYgbm90IGV4aXRpbmcgZWFybHkuXG4gICAgICAgIGlmICghY3ljbGVFdmVudC5hYm9ydGVkICYmIHJhaXNlSW5kZXgoKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBiZW5jaCA9IHF1ZXVlZCA/IGJlbmNoZXNbMF0gOiByZXN1bHRbaW5kZXhdO1xuICAgICAgICAgIGlmIChpc0FzeW5jKGJlbmNoKSkge1xuICAgICAgICAgICAgZGVsYXkoYmVuY2gsIGV4ZWN1dGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChhc3luYykge1xuICAgICAgICAgICAgLy8gUmVzdW1lIGV4ZWN1dGlvbiBpZiBwcmV2aW91c2x5IGFzeW5jaHJvbm91cyBidXQgbm93IHN5bmNocm9ub3VzLlxuICAgICAgICAgICAgd2hpbGUgKGV4ZWN1dGUoKSkge31cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBDb250aW51ZSBzeW5jaHJvbm91cyBleGVjdXRpb24uXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRW1pdCBcImNvbXBsZXRlXCIgZXZlbnQuXG4gICAgICAgICAgZXZlbnRQcm9wcy50eXBlID0gJ2NvbXBsZXRlJztcbiAgICAgICAgICBvcHRpb25zLm9uQ29tcGxldGUuY2FsbChiZW5jaGVzLCBFdmVudChldmVudFByb3BzKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiB1c2VkIGFzIGEgbGlzdGVuZXIgYGV2ZW50LmFib3J0ZWQgPSB0cnVlYCB3aWxsIGNhbmNlbCB0aGUgcmVzdCBvZlxuICAgICAgICAvLyB0aGUgXCJjb21wbGV0ZVwiIGxpc3RlbmVycyBiZWNhdXNlIHRoZXkgd2VyZSBhbHJlYWR5IGNhbGxlZCBhYm92ZSBhbmQgd2hlblxuICAgICAgICAvLyB1c2VkIGFzIHBhcnQgb2YgYGdldE5leHRgIHRoZSBgcmV0dXJuIGZhbHNlYCB3aWxsIGV4aXQgdGhlIGV4ZWN1dGlvbiB3aGlsZS1sb29wLlxuICAgICAgICBpZiAoZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDaGVja3MgaWYgaW52b2tpbmcgYEJlbmNobWFyayNydW5gIHdpdGggYXN5bmNocm9ub3VzIGN5Y2xlcy5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gaXNBc3luYyhvYmplY3QpIHtcbiAgICAgICAgLy8gQXZvaWQgdXNpbmcgYGluc3RhbmNlb2ZgIGhlcmUgYmVjYXVzZSBvZiBJRSBtZW1vcnkgbGVhayBpc3N1ZXMgd2l0aCBob3N0IG9iamVjdHMuXG4gICAgICAgIHZhciBhc3luYyA9IGFyZ3NbMF0gJiYgYXJnc1swXS5hc3luYztcbiAgICAgICAgcmV0dXJuIG5hbWUgPT0gJ3J1bicgJiYgKG9iamVjdCBpbnN0YW5jZW9mIEJlbmNobWFyaykgJiZcbiAgICAgICAgICAoKGFzeW5jID09IG51bGwgPyBvYmplY3Qub3B0aW9ucy5hc3luYyA6IGFzeW5jKSAmJiBzdXBwb3J0LnRpbWVvdXQgfHwgb2JqZWN0LmRlZmVyKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBSYWlzZXMgYGluZGV4YCB0byB0aGUgbmV4dCBkZWZpbmVkIGluZGV4IG9yIHJldHVybnMgYGZhbHNlYC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gcmFpc2VJbmRleCgpIHtcbiAgICAgICAgaW5kZXgrKztcblxuICAgICAgICAvLyBJZiBxdWV1ZWQgcmVtb3ZlIHRoZSBwcmV2aW91cyBiZW5jaC5cbiAgICAgICAgaWYgKHF1ZXVlZCAmJiBpbmRleCA+IDApIHtcbiAgICAgICAgICBzaGlmdC5jYWxsKGJlbmNoZXMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIHJlYWNoZWQgdGhlIGxhc3QgaW5kZXggdGhlbiByZXR1cm4gYGZhbHNlYC5cbiAgICAgICAgcmV0dXJuIChxdWV1ZWQgPyBiZW5jaGVzLmxlbmd0aCA6IGluZGV4IDwgcmVzdWx0Lmxlbmd0aClcbiAgICAgICAgICA/IGluZGV4XG4gICAgICAgICAgOiAoaW5kZXggPSBmYWxzZSk7XG4gICAgICB9XG4gICAgICAvLyBKdWdnbGUgYXJndW1lbnRzLlxuICAgICAgaWYgKF8uaXNTdHJpbmcobmFtZSkpIHtcbiAgICAgICAgLy8gMiBhcmd1bWVudHMgKGFycmF5LCBuYW1lKS5cbiAgICAgICAgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIDIgYXJndW1lbnRzIChhcnJheSwgb3B0aW9ucykuXG4gICAgICAgIG9wdGlvbnMgPSBfLmFzc2lnbihvcHRpb25zLCBuYW1lKTtcbiAgICAgICAgbmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICAgICAgYXJncyA9IF8uaXNBcnJheShhcmdzID0gJ2FyZ3MnIGluIG9wdGlvbnMgPyBvcHRpb25zLmFyZ3MgOiBbXSkgPyBhcmdzIDogW2FyZ3NdO1xuICAgICAgICBxdWV1ZWQgPSBvcHRpb25zLnF1ZXVlZDtcbiAgICAgIH1cbiAgICAgIC8vIFN0YXJ0IGl0ZXJhdGluZyBvdmVyIHRoZSBhcnJheS5cbiAgICAgIGlmIChyYWlzZUluZGV4KCkgIT09IGZhbHNlKSB7XG4gICAgICAgIC8vIEVtaXQgXCJzdGFydFwiIGV2ZW50LlxuICAgICAgICBiZW5jaCA9IHJlc3VsdFtpbmRleF07XG4gICAgICAgIGV2ZW50UHJvcHMudHlwZSA9ICdzdGFydCc7XG4gICAgICAgIGV2ZW50UHJvcHMudGFyZ2V0ID0gYmVuY2g7XG4gICAgICAgIG9wdGlvbnMub25TdGFydC5jYWxsKGJlbmNoZXMsIEV2ZW50KGV2ZW50UHJvcHMpKTtcblxuICAgICAgICAvLyBFbmQgZWFybHkgaWYgdGhlIHN1aXRlIHdhcyBhYm9ydGVkIGluIGFuIFwib25TdGFydFwiIGxpc3RlbmVyLlxuICAgICAgICBpZiAobmFtZSA9PSAncnVuJyAmJiAoYmVuY2hlcyBpbnN0YW5jZW9mIFN1aXRlKSAmJiBiZW5jaGVzLmFib3J0ZWQpIHtcbiAgICAgICAgICAvLyBFbWl0IFwiY3ljbGVcIiBldmVudC5cbiAgICAgICAgICBldmVudFByb3BzLnR5cGUgPSAnY3ljbGUnO1xuICAgICAgICAgIG9wdGlvbnMub25DeWNsZS5jYWxsKGJlbmNoZXMsIEV2ZW50KGV2ZW50UHJvcHMpKTtcbiAgICAgICAgICAvLyBFbWl0IFwiY29tcGxldGVcIiBldmVudC5cbiAgICAgICAgICBldmVudFByb3BzLnR5cGUgPSAnY29tcGxldGUnO1xuICAgICAgICAgIG9wdGlvbnMub25Db21wbGV0ZS5jYWxsKGJlbmNoZXMsIEV2ZW50KGV2ZW50UHJvcHMpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdGFydCBtZXRob2QgZXhlY3V0aW9uLlxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNBc3luYyhiZW5jaCkpIHtcbiAgICAgICAgICAgIGRlbGF5KGJlbmNoLCBleGVjdXRlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2hpbGUgKGV4ZWN1dGUoKSkge31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHN0cmluZyBvZiBqb2luZWQgYXJyYXkgdmFsdWVzIG9yIG9iamVjdCBrZXktdmFsdWUgcGFpcnMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBvcGVyYXRlIG9uLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbc2VwYXJhdG9yMT0nLCddIFRoZSBzZXBhcmF0b3IgdXNlZCBiZXR3ZWVuIGtleS12YWx1ZSBwYWlycy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3NlcGFyYXRvcjI9JzogJ10gVGhlIHNlcGFyYXRvciB1c2VkIGJldHdlZW4ga2V5cyBhbmQgdmFsdWVzLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBqb2luZWQgcmVzdWx0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGpvaW4ob2JqZWN0LCBzZXBhcmF0b3IxLCBzZXBhcmF0b3IyKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgICAgbGVuZ3RoID0gKG9iamVjdCA9IE9iamVjdChvYmplY3QpKS5sZW5ndGgsXG4gICAgICAgICAgYXJyYXlMaWtlID0gbGVuZ3RoID09PSBsZW5ndGggPj4+IDA7XG5cbiAgICAgIHNlcGFyYXRvcjIgfHwgKHNlcGFyYXRvcjIgPSAnOiAnKTtcbiAgICAgIF8uZWFjaChvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goYXJyYXlMaWtlID8gdmFsdWUgOiBrZXkgKyBzZXBhcmF0b3IyICsgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0LmpvaW4oc2VwYXJhdG9yMSB8fCAnLCcpO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEFib3J0cyBhbGwgYmVuY2htYXJrcyBpbiB0aGUgc3VpdGUuXG4gICAgICpcbiAgICAgKiBAbmFtZSBhYm9ydFxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc3VpdGUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWJvcnRTdWl0ZSgpIHtcbiAgICAgIHZhciBldmVudCxcbiAgICAgICAgICBzdWl0ZSA9IHRoaXMsXG4gICAgICAgICAgcmVzZXR0aW5nID0gY2FsbGVkQnkucmVzZXRTdWl0ZTtcblxuICAgICAgaWYgKHN1aXRlLnJ1bm5pbmcpIHtcbiAgICAgICAgZXZlbnQgPSBFdmVudCgnYWJvcnQnKTtcbiAgICAgICAgc3VpdGUuZW1pdChldmVudCk7XG4gICAgICAgIGlmICghZXZlbnQuY2FuY2VsbGVkIHx8IHJlc2V0dGluZykge1xuICAgICAgICAgIC8vIEF2b2lkIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICAgICAgICBjYWxsZWRCeS5hYm9ydFN1aXRlID0gdHJ1ZTtcbiAgICAgICAgICBzdWl0ZS5yZXNldCgpO1xuICAgICAgICAgIGRlbGV0ZSBjYWxsZWRCeS5hYm9ydFN1aXRlO1xuXG4gICAgICAgICAgaWYgKCFyZXNldHRpbmcpIHtcbiAgICAgICAgICAgIHN1aXRlLmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaW52b2tlKHN1aXRlLCAnYWJvcnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdWl0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgdGVzdCB0byB0aGUgYmVuY2htYXJrIHN1aXRlLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEEgbmFtZSB0byBpZGVudGlmeSB0aGUgYmVuY2htYXJrLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmbiBUaGUgdGVzdCB0byBiZW5jaG1hcmsuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc3VpdGUgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlXG4gICAgICogc3VpdGUuYWRkKGZuKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHVzaW5nIGEgbmFtZSBmaXJzdFxuICAgICAqIHN1aXRlLmFkZCgnZm9vJywgZm4pO1xuICAgICAqXG4gICAgICogLy8gb3Igd2l0aCBvcHRpb25zXG4gICAgICogc3VpdGUuYWRkKCdmb28nLCBmbiwge1xuICAgICAqICAgJ29uQ3ljbGUnOiBvbkN5Y2xlLFxuICAgICAqICAgJ29uQ29tcGxldGUnOiBvbkNvbXBsZXRlXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiAvLyBvciBuYW1lIGFuZCBvcHRpb25zXG4gICAgICogc3VpdGUuYWRkKCdmb28nLCB7XG4gICAgICogICAnZm4nOiBmbixcbiAgICAgKiAgICdvbkN5Y2xlJzogb25DeWNsZSxcbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gb3Igb3B0aW9ucyBvbmx5XG4gICAgICogc3VpdGUuYWRkKHtcbiAgICAgKiAgICduYW1lJzogJ2ZvbycsXG4gICAgICogICAnZm4nOiBmbixcbiAgICAgKiAgICdvbkN5Y2xlJzogb25DeWNsZSxcbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZVxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZChuYW1lLCBmbiwgb3B0aW9ucykge1xuICAgICAgdmFyIHN1aXRlID0gdGhpcyxcbiAgICAgICAgICBiZW5jaCA9IG5ldyBCZW5jaG1hcmsobmFtZSwgZm4sIG9wdGlvbnMpLFxuICAgICAgICAgIGV2ZW50ID0gRXZlbnQoeyAndHlwZSc6ICdhZGQnLCAndGFyZ2V0JzogYmVuY2ggfSk7XG5cbiAgICAgIGlmIChzdWl0ZS5lbWl0KGV2ZW50KSwgIWV2ZW50LmNhbmNlbGxlZCkge1xuICAgICAgICBzdWl0ZS5wdXNoKGJlbmNoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdWl0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHN1aXRlIHdpdGggY2xvbmVkIGJlbmNobWFya3MuXG4gICAgICpcbiAgICAgKiBAbmFtZSBjbG9uZVxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIG9iamVjdCB0byBvdmVyd3JpdGUgY2xvbmVkIG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIG5ldyBzdWl0ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbG9uZVN1aXRlKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzdWl0ZSA9IHRoaXMsXG4gICAgICAgICAgcmVzdWx0ID0gbmV3IHN1aXRlLmNvbnN0cnVjdG9yKF8uYXNzaWduKHt9LCBzdWl0ZS5vcHRpb25zLCBvcHRpb25zKSk7XG5cbiAgICAgIC8vIENvcHkgb3duIHByb3BlcnRpZXMuXG4gICAgICBfLmZvck93bihzdWl0ZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIV8uaGFzKHJlc3VsdCwga2V5KSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWUgJiYgXy5pc0Z1bmN0aW9uKHZhbHVlLmNsb25lKVxuICAgICAgICAgICAgPyB2YWx1ZS5jbG9uZSgpXG4gICAgICAgICAgICA6IGNsb25lRGVlcCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBgQXJyYXkjZmlsdGVyYCBsaWtlIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBuYW1lIGZpbHRlclxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uL2FsaWFzIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IEEgbmV3IHN1aXRlIG9mIGJlbmNobWFya3MgdGhhdCBwYXNzZWQgY2FsbGJhY2sgZmlsdGVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlclN1aXRlKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIHJlc3VsdCA9IG5ldyBzdWl0ZS5jb25zdHJ1Y3RvcihzdWl0ZS5vcHRpb25zKTtcblxuICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBmaWx0ZXIoc3VpdGUsIGNhbGxiYWNrKSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyBhbGwgYmVuY2htYXJrcyBpbiB0aGUgc3VpdGUuXG4gICAgICpcbiAgICAgKiBAbmFtZSByZXNldFxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc3VpdGUgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzZXRTdWl0ZSgpIHtcbiAgICAgIHZhciBldmVudCxcbiAgICAgICAgICBzdWl0ZSA9IHRoaXMsXG4gICAgICAgICAgYWJvcnRpbmcgPSBjYWxsZWRCeS5hYm9ydFN1aXRlO1xuXG4gICAgICBpZiAoc3VpdGUucnVubmluZyAmJiAhYWJvcnRpbmcpIHtcbiAgICAgICAgLy8gTm8gd29ycmllcywgYHJlc2V0U3VpdGUoKWAgaXMgY2FsbGVkIHdpdGhpbiBgYWJvcnRTdWl0ZSgpYC5cbiAgICAgICAgY2FsbGVkQnkucmVzZXRTdWl0ZSA9IHRydWU7XG4gICAgICAgIHN1aXRlLmFib3J0KCk7XG4gICAgICAgIGRlbGV0ZSBjYWxsZWRCeS5yZXNldFN1aXRlO1xuICAgICAgfVxuICAgICAgLy8gUmVzZXQgaWYgdGhlIHN0YXRlIGhhcyBjaGFuZ2VkLlxuICAgICAgZWxzZSBpZiAoKHN1aXRlLmFib3J0ZWQgfHwgc3VpdGUucnVubmluZykgJiZcbiAgICAgICAgICAoc3VpdGUuZW1pdChldmVudCA9IEV2ZW50KCdyZXNldCcpKSwgIWV2ZW50LmNhbmNlbGxlZCkpIHtcbiAgICAgICAgc3VpdGUuYWJvcnRlZCA9IHN1aXRlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFhYm9ydGluZykge1xuICAgICAgICAgIGludm9rZShzdWl0ZSwgJ3Jlc2V0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdWl0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIHRoZSBzdWl0ZS5cbiAgICAgKlxuICAgICAqIEBuYW1lIHJ1blxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzdWl0ZSBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gYmFzaWMgdXNhZ2VcbiAgICAgKiBzdWl0ZS5ydW4oKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHdpdGggb3B0aW9uc1xuICAgICAqIHN1aXRlLnJ1bih7ICdhc3luYyc6IHRydWUsICdxdWV1ZWQnOiB0cnVlIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJ1blN1aXRlKG9wdGlvbnMpIHtcbiAgICAgIHZhciBzdWl0ZSA9IHRoaXM7XG5cbiAgICAgIHN1aXRlLnJlc2V0KCk7XG4gICAgICBzdWl0ZS5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cbiAgICAgIGludm9rZShzdWl0ZSwge1xuICAgICAgICAnbmFtZSc6ICdydW4nLFxuICAgICAgICAnYXJncyc6IG9wdGlvbnMsXG4gICAgICAgICdxdWV1ZWQnOiBvcHRpb25zLnF1ZXVlZCxcbiAgICAgICAgJ29uU3RhcnQnOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHN1aXRlLmVtaXQoZXZlbnQpO1xuICAgICAgICB9LFxuICAgICAgICAnb25DeWNsZSc6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIGJlbmNoID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgIGlmIChiZW5jaC5lcnJvcikge1xuICAgICAgICAgICAgc3VpdGUuZW1pdCh7ICd0eXBlJzogJ2Vycm9yJywgJ3RhcmdldCc6IGJlbmNoIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdWl0ZS5lbWl0KGV2ZW50KTtcbiAgICAgICAgICBldmVudC5hYm9ydGVkID0gc3VpdGUuYWJvcnRlZDtcbiAgICAgICAgfSxcbiAgICAgICAgJ29uQ29tcGxldGUnOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgIHN1aXRlLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICBzdWl0ZS5lbWl0KGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gc3VpdGU7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZXMgYWxsIHJlZ2lzdGVyZWQgbGlzdGVuZXJzIG9mIHRoZSBzcGVjaWZpZWQgZXZlbnQgdHlwZS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmssIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZSBvciBvYmplY3QuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnc10gQXJndW1lbnRzIHRvIGludm9rZSB0aGUgbGlzdGVuZXIgd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBsYXN0IGxpc3RlbmVyIGV4ZWN1dGVkLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycyxcbiAgICAgICAgICBvYmplY3QgPSB0aGlzLFxuICAgICAgICAgIGV2ZW50ID0gRXZlbnQodHlwZSksXG4gICAgICAgICAgZXZlbnRzID0gb2JqZWN0LmV2ZW50cyxcbiAgICAgICAgICBhcmdzID0gKGFyZ3VtZW50c1swXSA9IGV2ZW50LCBhcmd1bWVudHMpO1xuXG4gICAgICBldmVudC5jdXJyZW50VGFyZ2V0IHx8IChldmVudC5jdXJyZW50VGFyZ2V0ID0gb2JqZWN0KTtcbiAgICAgIGV2ZW50LnRhcmdldCB8fCAoZXZlbnQudGFyZ2V0ID0gb2JqZWN0KTtcbiAgICAgIGRlbGV0ZSBldmVudC5yZXN1bHQ7XG5cbiAgICAgIGlmIChldmVudHMgJiYgKGxpc3RlbmVycyA9IF8uaGFzKGV2ZW50cywgZXZlbnQudHlwZSkgJiYgZXZlbnRzW2V2ZW50LnR5cGVdKSkge1xuICAgICAgICBfLmVhY2gobGlzdGVuZXJzLnNsaWNlKCksIGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gICAgICAgICAgaWYgKChldmVudC5yZXN1bHQgPSBsaXN0ZW5lci5hcHBseShvYmplY3QsIGFyZ3MpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGV2ZW50LmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAhZXZlbnQuYWJvcnRlZDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXZlbnQucmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gYXJyYXkgb2YgZXZlbnQgbGlzdGVuZXJzIGZvciBhIGdpdmVuIHR5cGUgdGhhdCBjYW4gYmUgbWFuaXB1bGF0ZWRcbiAgICAgKiB0byBhZGQgb3IgcmVtb3ZlIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmssIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSBldmVudCB0eXBlLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGxpc3RlbmVycyBhcnJheS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIG9iamVjdCA9IHRoaXMsXG4gICAgICAgICAgZXZlbnRzID0gb2JqZWN0LmV2ZW50cyB8fCAob2JqZWN0LmV2ZW50cyA9IHt9KTtcblxuICAgICAgcmV0dXJuIF8uaGFzKGV2ZW50cywgdHlwZSkgPyBldmVudHNbdHlwZV0gOiAoZXZlbnRzW3R5cGVdID0gW10pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVucmVnaXN0ZXJzIGEgbGlzdGVuZXIgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQgdHlwZShzKSxcbiAgICAgKiBvciB1bnJlZ2lzdGVycyBhbGwgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50IHR5cGUocyksXG4gICAgICogb3IgdW5yZWdpc3RlcnMgYWxsIGxpc3RlbmVycyBmb3IgYWxsIGV2ZW50IHR5cGVzLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyaywgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0eXBlXSBUaGUgZXZlbnQgdHlwZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbbGlzdGVuZXJdIFRoZSBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBjdXJyZW50IGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyB1bnJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGFuIGV2ZW50IHR5cGVcbiAgICAgKiBiZW5jaC5vZmYoJ2N5Y2xlJywgbGlzdGVuZXIpO1xuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhIGxpc3RlbmVyIGZvciBtdWx0aXBsZSBldmVudCB0eXBlc1xuICAgICAqIGJlbmNoLm9mZignc3RhcnQgY3ljbGUnLCBsaXN0ZW5lcik7XG4gICAgICpcbiAgICAgKiAvLyB1bnJlZ2lzdGVyIGFsbCBsaXN0ZW5lcnMgZm9yIGFuIGV2ZW50IHR5cGVcbiAgICAgKiBiZW5jaC5vZmYoJ2N5Y2xlJyk7XG4gICAgICpcbiAgICAgKiAvLyB1bnJlZ2lzdGVyIGFsbCBsaXN0ZW5lcnMgZm9yIG11bHRpcGxlIGV2ZW50IHR5cGVzXG4gICAgICogYmVuY2gub2ZmKCdzdGFydCBjeWNsZSBjb21wbGV0ZScpO1xuICAgICAqXG4gICAgICogLy8gdW5yZWdpc3RlciBhbGwgbGlzdGVuZXJzIGZvciBhbGwgZXZlbnQgdHlwZXNcbiAgICAgKiBiZW5jaC5vZmYoKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvZmYodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLFxuICAgICAgICAgIGV2ZW50cyA9IG9iamVjdC5ldmVudHM7XG5cbiAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9XG4gICAgICBfLmVhY2godHlwZSA/IHR5cGUuc3BsaXQoJyAnKSA6IGV2ZW50cywgZnVuY3Rpb24obGlzdGVuZXJzLCB0eXBlKSB7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICB0eXBlID0gbGlzdGVuZXJzO1xuICAgICAgICAgIGxpc3RlbmVycyA9IF8uaGFzKGV2ZW50cywgdHlwZSkgJiYgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGluZGV4ID0gXy5pbmRleE9mKGxpc3RlbmVycywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIGxpc3RlbmVyIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50IHR5cGUocykuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLCBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSBUaGUgZXZlbnQgdHlwZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBUaGUgZnVuY3Rpb24gdG8gcmVnaXN0ZXIuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGN1cnJlbnQgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIHJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGFuIGV2ZW50IHR5cGVcbiAgICAgKiBiZW5jaC5vbignY3ljbGUnLCBsaXN0ZW5lcik7XG4gICAgICpcbiAgICAgKiAvLyByZWdpc3RlciBhIGxpc3RlbmVyIGZvciBtdWx0aXBsZSBldmVudCB0eXBlc1xuICAgICAqIGJlbmNoLm9uKCdzdGFydCBjeWNsZScsIGxpc3RlbmVyKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvbih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIG9iamVjdCA9IHRoaXMsXG4gICAgICAgICAgZXZlbnRzID0gb2JqZWN0LmV2ZW50cyB8fCAob2JqZWN0LmV2ZW50cyA9IHt9KTtcblxuICAgICAgXy5lYWNoKHR5cGUuc3BsaXQoJyAnKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICAoXy5oYXMoZXZlbnRzLCB0eXBlKVxuICAgICAgICAgID8gZXZlbnRzW3R5cGVdXG4gICAgICAgICAgOiAoZXZlbnRzW3R5cGVdID0gW10pXG4gICAgICAgICkucHVzaChsaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQWJvcnRzIHRoZSBiZW5jaG1hcmsgd2l0aG91dCByZWNvcmRpbmcgdGltZXMuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhYm9ydCgpIHtcbiAgICAgIHZhciBldmVudCxcbiAgICAgICAgICBiZW5jaCA9IHRoaXMsXG4gICAgICAgICAgcmVzZXR0aW5nID0gY2FsbGVkQnkucmVzZXQ7XG5cbiAgICAgIGlmIChiZW5jaC5ydW5uaW5nKSB7XG4gICAgICAgIGV2ZW50ID0gRXZlbnQoJ2Fib3J0Jyk7XG4gICAgICAgIGJlbmNoLmVtaXQoZXZlbnQpO1xuICAgICAgICBpZiAoIWV2ZW50LmNhbmNlbGxlZCB8fCByZXNldHRpbmcpIHtcbiAgICAgICAgICAvLyBBdm9pZCBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgY2FsbGVkQnkuYWJvcnQgPSB0cnVlO1xuICAgICAgICAgIGJlbmNoLnJlc2V0KCk7XG4gICAgICAgICAgZGVsZXRlIGNhbGxlZEJ5LmFib3J0O1xuXG4gICAgICAgICAgaWYgKHN1cHBvcnQudGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGJlbmNoLl90aW1lcklkKTtcbiAgICAgICAgICAgIGRlbGV0ZSBiZW5jaC5fdGltZXJJZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFyZXNldHRpbmcpIHtcbiAgICAgICAgICAgIGJlbmNoLmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgYmVuY2gucnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGJlbmNoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgYmVuY2htYXJrIHVzaW5nIHRoZSBzYW1lIHRlc3QgYW5kIG9wdGlvbnMuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyBvYmplY3QgdG8gb3ZlcndyaXRlIGNsb25lZCBvcHRpb25zLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBuZXcgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgYml6YXJybyA9IGJlbmNoLmNsb25lKHtcbiAgICAgKiAgICduYW1lJzogJ2RvcHBlbGdhbmdlcidcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbG9uZShvcHRpb25zKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzLFxuICAgICAgICAgIHJlc3VsdCA9IG5ldyBiZW5jaC5jb25zdHJ1Y3RvcihfLmFzc2lnbih7fSwgYmVuY2gsIG9wdGlvbnMpKTtcblxuICAgICAgLy8gQ29ycmVjdCB0aGUgYG9wdGlvbnNgIG9iamVjdC5cbiAgICAgIHJlc3VsdC5vcHRpb25zID0gXy5hc3NpZ24oe30sIGNsb25lRGVlcChiZW5jaC5vcHRpb25zKSwgY2xvbmVEZWVwKG9wdGlvbnMpKTtcblxuICAgICAgLy8gQ29weSBvd24gY3VzdG9tIHByb3BlcnRpZXMuXG4gICAgICBfLmZvck93bihiZW5jaCwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIV8uaGFzKHJlc3VsdCwga2V5KSkge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gY2xvbmVEZWVwKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyBpZiBhIGJlbmNobWFyayBpcyBmYXN0ZXIgdGhhbiBhbm90aGVyLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgYmVuY2htYXJrIHRvIGNvbXBhcmUuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgLTFgIGlmIHNsb3dlciwgYDFgIGlmIGZhc3RlciwgYW5kIGAwYCBpZiBpbmRldGVybWluYXRlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBhcmUob3RoZXIpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXM7XG5cbiAgICAgIC8vIEV4aXQgZWFybHkgaWYgY29tcGFyaW5nIHRoZSBzYW1lIGJlbmNobWFyay5cbiAgICAgIGlmIChiZW5jaCA9PSBvdGhlcikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIHZhciBjcml0aWNhbCxcbiAgICAgICAgICB6U3RhdCxcbiAgICAgICAgICBzYW1wbGUxID0gYmVuY2guc3RhdHMuc2FtcGxlLFxuICAgICAgICAgIHNhbXBsZTIgPSBvdGhlci5zdGF0cy5zYW1wbGUsXG4gICAgICAgICAgc2l6ZTEgPSBzYW1wbGUxLmxlbmd0aCxcbiAgICAgICAgICBzaXplMiA9IHNhbXBsZTIubGVuZ3RoLFxuICAgICAgICAgIG1heFNpemUgPSBtYXgoc2l6ZTEsIHNpemUyKSxcbiAgICAgICAgICBtaW5TaXplID0gbWluKHNpemUxLCBzaXplMiksXG4gICAgICAgICAgdTEgPSBnZXRVKHNhbXBsZTEsIHNhbXBsZTIpLFxuICAgICAgICAgIHUyID0gZ2V0VShzYW1wbGUyLCBzYW1wbGUxKSxcbiAgICAgICAgICB1ID0gbWluKHUxLCB1Mik7XG5cbiAgICAgIGZ1bmN0aW9uIGdldFNjb3JlKHhBLCBzYW1wbGVCKSB7XG4gICAgICAgIHJldHVybiBfLnJlZHVjZShzYW1wbGVCLCBmdW5jdGlvbih0b3RhbCwgeEIpIHtcbiAgICAgICAgICByZXR1cm4gdG90YWwgKyAoeEIgPiB4QSA/IDAgOiB4QiA8IHhBID8gMSA6IDAuNSk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBnZXRVKHNhbXBsZUEsIHNhbXBsZUIpIHtcbiAgICAgICAgcmV0dXJuIF8ucmVkdWNlKHNhbXBsZUEsIGZ1bmN0aW9uKHRvdGFsLCB4QSkge1xuICAgICAgICAgIHJldHVybiB0b3RhbCArIGdldFNjb3JlKHhBLCBzYW1wbGVCKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFoodSkge1xuICAgICAgICByZXR1cm4gKHUgLSAoKHNpemUxICogc2l6ZTIpIC8gMikpIC8gc3FydCgoc2l6ZTEgKiBzaXplMiAqIChzaXplMSArIHNpemUyICsgMSkpIC8gMTIpO1xuICAgICAgfVxuICAgICAgLy8gUmVqZWN0IHRoZSBudWxsIGh5cG90aGVzaXMgdGhlIHR3byBzYW1wbGVzIGNvbWUgZnJvbSB0aGVcbiAgICAgIC8vIHNhbWUgcG9wdWxhdGlvbiAoaS5lLiBoYXZlIHRoZSBzYW1lIG1lZGlhbikgaWYuLi5cbiAgICAgIGlmIChzaXplMSArIHNpemUyID4gMzApIHtcbiAgICAgICAgLy8gLi4udGhlIHotc3RhdCBpcyBncmVhdGVyIHRoYW4gMS45NiBvciBsZXNzIHRoYW4gLTEuOTZcbiAgICAgICAgLy8gaHR0cDovL3d3dy5zdGF0aXN0aWNzbGVjdHVyZXMuY29tL3RvcGljcy9tYW5ud2hpdG5leXUvXG4gICAgICAgIHpTdGF0ID0gZ2V0Wih1KTtcbiAgICAgICAgcmV0dXJuIGFicyh6U3RhdCkgPiAxLjk2ID8gKHUgPT0gdTEgPyAxIDogLTEpIDogMDtcbiAgICAgIH1cbiAgICAgIC8vIC4uLnRoZSBVIHZhbHVlIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0aGUgY3JpdGljYWwgVSB2YWx1ZS5cbiAgICAgIGNyaXRpY2FsID0gbWF4U2l6ZSA8IDUgfHwgbWluU2l6ZSA8IDMgPyAwIDogdVRhYmxlW21heFNpemVdW21pblNpemUgLSAzXTtcbiAgICAgIHJldHVybiB1IDw9IGNyaXRpY2FsID8gKHUgPT0gdTEgPyAxIDogLTEpIDogMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNldCBwcm9wZXJ0aWVzIGFuZCBhYm9ydCBpZiBydW5uaW5nLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzO1xuICAgICAgaWYgKGJlbmNoLnJ1bm5pbmcgJiYgIWNhbGxlZEJ5LmFib3J0KSB7XG4gICAgICAgIC8vIE5vIHdvcnJpZXMsIGByZXNldCgpYCBpcyBjYWxsZWQgd2l0aGluIGBhYm9ydCgpYC5cbiAgICAgICAgY2FsbGVkQnkucmVzZXQgPSB0cnVlO1xuICAgICAgICBiZW5jaC5hYm9ydCgpO1xuICAgICAgICBkZWxldGUgY2FsbGVkQnkucmVzZXQ7XG4gICAgICAgIHJldHVybiBiZW5jaDtcbiAgICAgIH1cbiAgICAgIHZhciBldmVudCxcbiAgICAgICAgICBpbmRleCA9IDAsXG4gICAgICAgICAgY2hhbmdlcyA9IFtdLFxuICAgICAgICAgIHF1ZXVlID0gW107XG5cbiAgICAgIC8vIEEgbm9uLXJlY3Vyc2l2ZSBzb2x1dGlvbiB0byBjaGVjayBpZiBwcm9wZXJ0aWVzIGhhdmUgY2hhbmdlZC5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwOi8vd3d3LmpzbGFiLmRrL2FydGljbGVzL25vbi5yZWN1cnNpdmUucHJlb3JkZXIudHJhdmVyc2FsLnBhcnQ0LlxuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICdkZXN0aW5hdGlvbic6IGJlbmNoLFxuICAgICAgICAnc291cmNlJzogXy5hc3NpZ24oe30sIGNsb25lRGVlcChiZW5jaC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpLCBjbG9uZURlZXAoYmVuY2gub3B0aW9ucykpXG4gICAgICB9O1xuXG4gICAgICBkbyB7XG4gICAgICAgIF8uZm9yT3duKGRhdGEuc291cmNlLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgdmFyIGNoYW5nZWQsXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uID0gZGF0YS5kZXN0aW5hdGlvbixcbiAgICAgICAgICAgICAgY3VyclZhbHVlID0gZGVzdGluYXRpb25ba2V5XTtcblxuICAgICAgICAgIC8vIFNraXAgcHNldWRvIHByaXZhdGUgcHJvcGVydGllcyBsaWtlIGBfdGltZXJJZGAgd2hpY2ggY291bGQgYmUgYVxuICAgICAgICAgIC8vIEphdmEgb2JqZWN0IGluIGVudmlyb25tZW50cyBsaWtlIFJpbmdvSlMuXG4gICAgICAgICAgaWYgKGtleS5jaGFyQXQoMCkgPT0gJ18nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFuIGFycmF5IHZhbHVlIGhhcyBjaGFuZ2VkIHRvIGEgbm9uLWFycmF5IHZhbHVlLlxuICAgICAgICAgICAgICBpZiAoIV8uaXNBcnJheShjdXJyVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlZCA9IGN1cnJWYWx1ZSA9IFtdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFuIGFycmF5IGhhcyBjaGFuZ2VkIGl0cyBsZW5ndGguXG4gICAgICAgICAgICAgIGlmIChjdXJyVmFsdWUubGVuZ3RoICE9IHZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNoYW5nZWQgPSBjdXJyVmFsdWUgPSBjdXJyVmFsdWUuc2xpY2UoMCwgdmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBjdXJyVmFsdWUubGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBhbiBvYmplY3QgaGFzIGNoYW5nZWQgdG8gYSBub24tb2JqZWN0IHZhbHVlLlxuICAgICAgICAgICAgZWxzZSBpZiAoIWN1cnJWYWx1ZSB8fCB0eXBlb2YgY3VyclZhbHVlICE9ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgIGNoYW5nZWQgPSBjdXJyVmFsdWUgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlZ2lzdGVyIGEgY2hhbmdlZCBvYmplY3QuXG4gICAgICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgICAgICBjaGFuZ2VzLnB1c2goeyAnZGVzdGluYXRpb24nOiBkZXN0aW5hdGlvbiwgJ2tleSc6IGtleSwgJ3ZhbHVlJzogY3VyclZhbHVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcXVldWUucHVzaCh7ICdkZXN0aW5hdGlvbic6IGN1cnJWYWx1ZSwgJ3NvdXJjZSc6IHZhbHVlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBSZWdpc3RlciBhIGNoYW5nZWQgcHJpbWl0aXZlLlxuICAgICAgICAgIGVsc2UgaWYgKHZhbHVlICE9PSBjdXJyVmFsdWUgJiYgISh2YWx1ZSA9PSBudWxsIHx8IF8uaXNGdW5jdGlvbih2YWx1ZSkpKSB7XG4gICAgICAgICAgICBjaGFuZ2VzLnB1c2goeyAnZGVzdGluYXRpb24nOiBkZXN0aW5hdGlvbiwgJ2tleSc6IGtleSwgJ3ZhbHVlJzogdmFsdWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICgoZGF0YSA9IHF1ZXVlW2luZGV4KytdKSk7XG5cbiAgICAgIC8vIElmIGNoYW5nZWQgZW1pdCB0aGUgYHJlc2V0YCBldmVudCBhbmQgaWYgaXQgaXNuJ3QgY2FuY2VsbGVkIHJlc2V0IHRoZSBiZW5jaG1hcmsuXG4gICAgICBpZiAoY2hhbmdlcy5sZW5ndGggJiYgKGJlbmNoLmVtaXQoZXZlbnQgPSBFdmVudCgncmVzZXQnKSksICFldmVudC5jYW5jZWxsZWQpKSB7XG4gICAgICAgIF8uZWFjaChjaGFuZ2VzLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgZGF0YS5kZXN0aW5hdGlvbltkYXRhLmtleV0gPSBkYXRhLnZhbHVlO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiZW5jaDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaXNwbGF5cyByZWxldmFudCBiZW5jaG1hcmsgaW5mb3JtYXRpb24gd2hlbiBjb2VyY2VkIHRvIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG5hbWUgdG9TdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHJldHVybnMge3N0cmluZ30gQSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b1N0cmluZ0JlbmNoKCkge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcyxcbiAgICAgICAgICBlcnJvciA9IGJlbmNoLmVycm9yLFxuICAgICAgICAgIGh6ID0gYmVuY2guaHosXG4gICAgICAgICAgaWQgPSBiZW5jaC5pZCxcbiAgICAgICAgICBzdGF0cyA9IGJlbmNoLnN0YXRzLFxuICAgICAgICAgIHNpemUgPSBzdGF0cy5zYW1wbGUubGVuZ3RoLFxuICAgICAgICAgIHBtID0gJ1xceGIxJyxcbiAgICAgICAgICByZXN1bHQgPSBiZW5jaC5uYW1lIHx8IChfLmlzTmFOKGlkKSA/IGlkIDogJzxUZXN0ICMnICsgaWQgKyAnPicpO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmVzdWx0ICs9ICc6ICcgKyBqb2luKGVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCArPSAnIHggJyArIGZvcm1hdE51bWJlcihoei50b0ZpeGVkKGh6IDwgMTAwID8gMiA6IDApKSArICcgb3BzL3NlYyAnICsgcG0gK1xuICAgICAgICAgIHN0YXRzLnJtZS50b0ZpeGVkKDIpICsgJyUgKCcgKyBzaXplICsgJyBydW4nICsgKHNpemUgPT0gMSA/ICcnIDogJ3MnKSArICcgc2FtcGxlZCknO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDbG9ja3MgdGhlIHRpbWUgdGFrZW4gdG8gZXhlY3V0ZSBhIHRlc3QgcGVyIGN5Y2xlIChzZWNzKS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJlbmNoIFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHRpbWUgdGFrZW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xvY2soKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IEJlbmNobWFyay5vcHRpb25zLFxuICAgICAgICAgIHRlbXBsYXRlRGF0YSA9IHt9LFxuICAgICAgICAgIHRpbWVycyA9IFt7ICducyc6IHRpbWVyLm5zLCAncmVzJzogbWF4KDAuMDAxNSwgZ2V0UmVzKCdtcycpKSwgJ3VuaXQnOiAnbXMnIH1dO1xuXG4gICAgICAvLyBMYXp5IGRlZmluZSBmb3IgaGktcmVzIHRpbWVycy5cbiAgICAgIGNsb2NrID0gZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgdmFyIGRlZmVycmVkO1xuXG4gICAgICAgIGlmIChjbG9uZSBpbnN0YW5jZW9mIERlZmVycmVkKSB7XG4gICAgICAgICAgZGVmZXJyZWQgPSBjbG9uZTtcbiAgICAgICAgICBjbG9uZSA9IGRlZmVycmVkLmJlbmNobWFyaztcbiAgICAgICAgfVxuICAgICAgICB2YXIgYmVuY2ggPSBjbG9uZS5fb3JpZ2luYWwsXG4gICAgICAgICAgICBzdHJpbmdhYmxlID0gaXNTdHJpbmdhYmxlKGJlbmNoLmZuKSxcbiAgICAgICAgICAgIGNvdW50ID0gYmVuY2guY291bnQgPSBjbG9uZS5jb3VudCxcbiAgICAgICAgICAgIGRlY29tcGlsYWJsZSA9IHN0cmluZ2FibGUgfHwgKHN1cHBvcnQuZGVjb21waWxhdGlvbiAmJiAoY2xvbmUuc2V0dXAgIT09IF8ubm9vcCB8fCBjbG9uZS50ZWFyZG93biAhPT0gXy5ub29wKSksXG4gICAgICAgICAgICBpZCA9IGJlbmNoLmlkLFxuICAgICAgICAgICAgbmFtZSA9IGJlbmNoLm5hbWUgfHwgKHR5cGVvZiBpZCA9PSAnbnVtYmVyJyA/ICc8VGVzdCAjJyArIGlkICsgJz4nIDogaWQpLFxuICAgICAgICAgICAgcmVzdWx0ID0gMDtcblxuICAgICAgICAvLyBJbml0IGBtaW5UaW1lYCBpZiBuZWVkZWQuXG4gICAgICAgIGNsb25lLm1pblRpbWUgPSBiZW5jaC5taW5UaW1lIHx8IChiZW5jaC5taW5UaW1lID0gYmVuY2gub3B0aW9ucy5taW5UaW1lID0gb3B0aW9ucy5taW5UaW1lKTtcblxuICAgICAgICAvLyBDb21waWxlIGluIHNldHVwL3RlYXJkb3duIGZ1bmN0aW9ucyBhbmQgdGhlIHRlc3QgbG9vcC5cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNvbXBpbGVkIHRlc3QsIGluc3RlYWQgb2YgdXNpbmcgdGhlIGNhY2hlZCBgYmVuY2guY29tcGlsZWRgLFxuICAgICAgICAvLyB0byBhdm9pZCBwb3RlbnRpYWwgZW5naW5lIG9wdGltaXphdGlvbnMgZW5hYmxlZCBvdmVyIHRoZSBsaWZlIG9mIHRoZSB0ZXN0LlxuICAgICAgICB2YXIgZnVuY0JvZHkgPSBkZWZlcnJlZFxuICAgICAgICAgID8gJ3ZhciBkIz10aGlzLCR7Zm5Bcmd9PWQjLG0jPWQjLmJlbmNobWFyay5fb3JpZ2luYWwsZiM9bSMuZm4sc3UjPW0jLnNldHVwLHRkIz1tIy50ZWFyZG93bjsnICtcbiAgICAgICAgICAgIC8vIFdoZW4gYGRlZmVycmVkLmN5Y2xlc2AgaXMgYDBgIHRoZW4uLi5cbiAgICAgICAgICAgICdpZighZCMuY3ljbGVzKXsnICtcbiAgICAgICAgICAgIC8vIHNldCBgZGVmZXJyZWQuZm5gLFxuICAgICAgICAgICAgJ2QjLmZuPWZ1bmN0aW9uKCl7dmFyICR7Zm5Bcmd9PWQjO2lmKHR5cGVvZiBmIz09XCJmdW5jdGlvblwiKXt0cnl7JHtmbn1cXG59Y2F0Y2goZSMpe2YjKGQjKX19ZWxzZXske2ZufVxcbn19OycgK1xuICAgICAgICAgICAgLy8gc2V0IGBkZWZlcnJlZC50ZWFyZG93bmAsXG4gICAgICAgICAgICAnZCMudGVhcmRvd249ZnVuY3Rpb24oKXtkIy5jeWNsZXM9MDtpZih0eXBlb2YgdGQjPT1cImZ1bmN0aW9uXCIpe3RyeXske3RlYXJkb3dufVxcbn1jYXRjaChlIyl7dGQjKCl9fWVsc2V7JHt0ZWFyZG93bn1cXG59fTsnICtcbiAgICAgICAgICAgIC8vIGV4ZWN1dGUgdGhlIGJlbmNobWFyaydzIGBzZXR1cGAsXG4gICAgICAgICAgICAnaWYodHlwZW9mIHN1Iz09XCJmdW5jdGlvblwiKXt0cnl7JHtzZXR1cH1cXG59Y2F0Y2goZSMpe3N1IygpfX1lbHNleyR7c2V0dXB9XFxufTsnICtcbiAgICAgICAgICAgIC8vIHN0YXJ0IHRpbWVyLFxuICAgICAgICAgICAgJ3QjLnN0YXJ0KGQjKTsnICtcbiAgICAgICAgICAgIC8vIGFuZCB0aGVuIGV4ZWN1dGUgYGRlZmVycmVkLmZuYCBhbmQgcmV0dXJuIGEgZHVtbXkgb2JqZWN0LlxuICAgICAgICAgICAgJ31kIy5mbigpO3JldHVybnt1aWQ6XCIke3VpZH1cIn0nXG5cbiAgICAgICAgICA6ICd2YXIgciMscyMsbSM9dGhpcyxmIz1tIy5mbixpIz1tIy5jb3VudCxuIz10Iy5uczske3NldHVwfVxcbiR7YmVnaW59OycgK1xuICAgICAgICAgICAgJ3doaWxlKGkjLS0peyR7Zm59XFxufSR7ZW5kfTske3RlYXJkb3dufVxcbnJldHVybntlbGFwc2VkOnIjLHVpZDpcIiR7dWlkfVwifSc7XG5cbiAgICAgICAgdmFyIGNvbXBpbGVkID0gYmVuY2guY29tcGlsZWQgPSBjbG9uZS5jb21waWxlZCA9IGNyZWF0ZUNvbXBpbGVkKGJlbmNoLCBkZWNvbXBpbGFibGUsIGRlZmVycmVkLCBmdW5jQm9keSksXG4gICAgICAgICAgICBpc0VtcHR5ID0gISh0ZW1wbGF0ZURhdGEuZm4gfHwgc3RyaW5nYWJsZSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoaXNFbXB0eSkge1xuICAgICAgICAgICAgLy8gRmlyZWZveCBtYXkgcmVtb3ZlIGRlYWQgY29kZSBmcm9tIGBGdW5jdGlvbiN0b1N0cmluZ2AgcmVzdWx0cy5cbiAgICAgICAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwOi8vYnVnemlsLmxhLzUzNjA4NS5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHRlc3QgXCInICsgbmFtZSArICdcIiBpcyBlbXB0eS4gVGhpcyBtYXkgYmUgdGhlIHJlc3VsdCBvZiBkZWFkIGNvZGUgcmVtb3ZhbC4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoIWRlZmVycmVkKSB7XG4gICAgICAgICAgICAvLyBQcmV0ZXN0IHRvIGRldGVybWluZSBpZiBjb21waWxlZCBjb2RlIGV4aXRzIGVhcmx5LCB1c3VhbGx5IGJ5IGFcbiAgICAgICAgICAgIC8vIHJvZ3VlIGByZXR1cm5gIHN0YXRlbWVudCwgYnkgY2hlY2tpbmcgZm9yIGEgcmV0dXJuIG9iamVjdCB3aXRoIHRoZSB1aWQuXG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IDE7XG4gICAgICAgICAgICBjb21waWxlZCA9IGRlY29tcGlsYWJsZSAmJiAoY29tcGlsZWQuY2FsbChiZW5jaCwgY29udGV4dCwgdGltZXIpIHx8IHt9KS51aWQgPT0gdGVtcGxhdGVEYXRhLnVpZCAmJiBjb21waWxlZDtcbiAgICAgICAgICAgIGJlbmNoLmNvdW50ID0gY291bnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICBjb21waWxlZCA9IG51bGw7XG4gICAgICAgICAgY2xvbmUuZXJyb3IgPSBlIHx8IG5ldyBFcnJvcihTdHJpbmcoZSkpO1xuICAgICAgICAgIGJlbmNoLmNvdW50ID0gY291bnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRmFsbGJhY2sgd2hlbiBhIHRlc3QgZXhpdHMgZWFybHkgb3IgZXJyb3JzIGR1cmluZyBwcmV0ZXN0LlxuICAgICAgICBpZiAoIWNvbXBpbGVkICYmICFkZWZlcnJlZCAmJiAhaXNFbXB0eSkge1xuICAgICAgICAgIGZ1bmNCb2R5ID0gKFxuICAgICAgICAgICAgc3RyaW5nYWJsZSB8fCAoZGVjb21waWxhYmxlICYmICFjbG9uZS5lcnJvcilcbiAgICAgICAgICAgICAgPyAnZnVuY3Rpb24gZiMoKXske2ZufVxcbn12YXIgciMscyMsbSM9dGhpcyxpIz1tIy5jb3VudCdcbiAgICAgICAgICAgICAgOiAndmFyIHIjLHMjLG0jPXRoaXMsZiM9bSMuZm4saSM9bSMuY291bnQnXG4gICAgICAgICAgICApICtcbiAgICAgICAgICAgICcsbiM9dCMubnM7JHtzZXR1cH1cXG4ke2JlZ2lufTttIy5mIz1mIzt3aGlsZShpIy0tKXttIy5mIygpfSR7ZW5kfTsnICtcbiAgICAgICAgICAgICdkZWxldGUgbSMuZiM7JHt0ZWFyZG93bn1cXG5yZXR1cm57ZWxhcHNlZDpyI30nO1xuXG4gICAgICAgICAgY29tcGlsZWQgPSBjcmVhdGVDb21waWxlZChiZW5jaCwgZGVjb21waWxhYmxlLCBkZWZlcnJlZCwgZnVuY0JvZHkpO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFByZXRlc3Qgb25lIG1vcmUgdGltZSB0byBjaGVjayBmb3IgZXJyb3JzLlxuICAgICAgICAgICAgYmVuY2guY291bnQgPSAxO1xuICAgICAgICAgICAgY29tcGlsZWQuY2FsbChiZW5jaCwgY29udGV4dCwgdGltZXIpO1xuICAgICAgICAgICAgYmVuY2guY291bnQgPSBjb3VudDtcbiAgICAgICAgICAgIGRlbGV0ZSBjbG9uZS5lcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgYmVuY2guY291bnQgPSBjb3VudDtcbiAgICAgICAgICAgIGlmICghY2xvbmUuZXJyb3IpIHtcbiAgICAgICAgICAgICAgY2xvbmUuZXJyb3IgPSBlIHx8IG5ldyBFcnJvcihTdHJpbmcoZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBubyBlcnJvcnMgcnVuIHRoZSBmdWxsIHRlc3QgbG9vcC5cbiAgICAgICAgaWYgKCFjbG9uZS5lcnJvcikge1xuICAgICAgICAgIGNvbXBpbGVkID0gYmVuY2guY29tcGlsZWQgPSBjbG9uZS5jb21waWxlZCA9IGNyZWF0ZUNvbXBpbGVkKGJlbmNoLCBkZWNvbXBpbGFibGUsIGRlZmVycmVkLCBmdW5jQm9keSk7XG4gICAgICAgICAgcmVzdWx0ID0gY29tcGlsZWQuY2FsbChkZWZlcnJlZCB8fCBiZW5jaCwgY29udGV4dCwgdGltZXIpLmVsYXBzZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG5cbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhIGNvbXBpbGVkIGZ1bmN0aW9uIGZyb20gdGhlIGdpdmVuIGZ1bmN0aW9uIGBib2R5YC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gY3JlYXRlQ29tcGlsZWQoYmVuY2gsIGRlY29tcGlsYWJsZSwgZGVmZXJyZWQsIGJvZHkpIHtcbiAgICAgICAgdmFyIGZuID0gYmVuY2guZm4sXG4gICAgICAgICAgICBmbkFyZyA9IGRlZmVycmVkID8gZ2V0Rmlyc3RBcmd1bWVudChmbikgfHwgJ2RlZmVycmVkJyA6ICcnO1xuXG4gICAgICAgIHRlbXBsYXRlRGF0YS51aWQgPSB1aWQgKyB1aWRDb3VudGVyKys7XG5cbiAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgJ3NldHVwJzogZGVjb21waWxhYmxlID8gZ2V0U291cmNlKGJlbmNoLnNldHVwKSA6IGludGVycG9sYXRlKCdtIy5zZXR1cCgpJyksXG4gICAgICAgICAgJ2ZuJzogZGVjb21waWxhYmxlID8gZ2V0U291cmNlKGZuKSA6IGludGVycG9sYXRlKCdtIy5mbignICsgZm5BcmcgKyAnKScpLFxuICAgICAgICAgICdmbkFyZyc6IGZuQXJnLFxuICAgICAgICAgICd0ZWFyZG93bic6IGRlY29tcGlsYWJsZSA/IGdldFNvdXJjZShiZW5jaC50ZWFyZG93bikgOiBpbnRlcnBvbGF0ZSgnbSMudGVhcmRvd24oKScpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFVzZSBBUEkgb2YgY2hvc2VuIHRpbWVyLlxuICAgICAgICBpZiAodGltZXIudW5pdCA9PSAnbnMnKSB7XG4gICAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgICAnYmVnaW4nOiBpbnRlcnBvbGF0ZSgncyM9biMoKScpLFxuICAgICAgICAgICAgJ2VuZCc6IGludGVycG9sYXRlKCdyIz1uIyhzIyk7ciM9ciNbMF0rKHIjWzFdLzFlOSknKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRpbWVyLnVuaXQgPT0gJ3VzJykge1xuICAgICAgICAgIGlmICh0aW1lci5ucy5zdG9wKSB7XG4gICAgICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAgICAgJ2JlZ2luJzogaW50ZXJwb2xhdGUoJ3MjPW4jLnN0YXJ0KCknKSxcbiAgICAgICAgICAgICAgJ2VuZCc6IGludGVycG9sYXRlKCdyIz1uIy5taWNyb3NlY29uZHMoKS8xZTYnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICAgICAnYmVnaW4nOiBpbnRlcnBvbGF0ZSgncyM9biMoKScpLFxuICAgICAgICAgICAgICAnZW5kJzogaW50ZXJwb2xhdGUoJ3IjPShuIygpLXMjKS8xZTYnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRpbWVyLm5zLm5vdykge1xuICAgICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICAgJ2JlZ2luJzogaW50ZXJwb2xhdGUoJ3MjPW4jLm5vdygpJyksXG4gICAgICAgICAgICAnZW5kJzogaW50ZXJwb2xhdGUoJ3IjPShuIy5ub3coKS1zIykvMWUzJylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAgICdiZWdpbic6IGludGVycG9sYXRlKCdzIz1uZXcgbiMoKS5nZXRUaW1lKCknKSxcbiAgICAgICAgICAgICdlbmQnOiBpbnRlcnBvbGF0ZSgnciM9KG5ldyBuIygpLmdldFRpbWUoKS1zIykvMWUzJylcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEZWZpbmUgYHRpbWVyYCBtZXRob2RzLlxuICAgICAgICB0aW1lci5zdGFydCA9IGNyZWF0ZUZ1bmN0aW9uKFxuICAgICAgICAgIGludGVycG9sYXRlKCdvIycpLFxuICAgICAgICAgIGludGVycG9sYXRlKCd2YXIgbiM9dGhpcy5ucywke2JlZ2lufTtvIy5lbGFwc2VkPTA7byMudGltZVN0YW1wPXMjJylcbiAgICAgICAgKTtcblxuICAgICAgICB0aW1lci5zdG9wID0gY3JlYXRlRnVuY3Rpb24oXG4gICAgICAgICAgaW50ZXJwb2xhdGUoJ28jJyksXG4gICAgICAgICAgaW50ZXJwb2xhdGUoJ3ZhciBuIz10aGlzLm5zLHMjPW8jLnRpbWVTdGFtcCwke2VuZH07byMuZWxhcHNlZD1yIycpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGNvbXBpbGVkIHRlc3QuXG4gICAgICAgIHJldHVybiBjcmVhdGVGdW5jdGlvbihcbiAgICAgICAgICBpbnRlcnBvbGF0ZSgnd2luZG93LHQjJyksXG4gICAgICAgICAgJ3ZhciBnbG9iYWwgPSB3aW5kb3csIGNsZWFyVGltZW91dCA9IGdsb2JhbC5jbGVhclRpbWVvdXQsIHNldFRpbWVvdXQgPSBnbG9iYWwuc2V0VGltZW91dDtcXG4nICtcbiAgICAgICAgICBpbnRlcnBvbGF0ZShib2R5KVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEdldHMgdGhlIGN1cnJlbnQgdGltZXIncyBtaW5pbXVtIHJlc29sdXRpb24gKHNlY3MpLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBnZXRSZXModW5pdCkge1xuICAgICAgICB2YXIgbWVhc3VyZWQsXG4gICAgICAgICAgICBiZWdpbixcbiAgICAgICAgICAgIGNvdW50ID0gMzAsXG4gICAgICAgICAgICBkaXZpc29yID0gMWUzLFxuICAgICAgICAgICAgbnMgPSB0aW1lci5ucyxcbiAgICAgICAgICAgIHNhbXBsZSA9IFtdO1xuXG4gICAgICAgIC8vIEdldCBhdmVyYWdlIHNtYWxsZXN0IG1lYXN1cmFibGUgdGltZS5cbiAgICAgICAgd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgICAgICBpZiAodW5pdCA9PSAndXMnKSB7XG4gICAgICAgICAgICBkaXZpc29yID0gMWU2O1xuICAgICAgICAgICAgaWYgKG5zLnN0b3ApIHtcbiAgICAgICAgICAgICAgbnMuc3RhcnQoKTtcbiAgICAgICAgICAgICAgd2hpbGUgKCEobWVhc3VyZWQgPSBucy5taWNyb3NlY29uZHMoKSkpIHt9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBiZWdpbiA9IG5zKCk7XG4gICAgICAgICAgICAgIHdoaWxlICghKG1lYXN1cmVkID0gbnMoKSAtIGJlZ2luKSkge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAodW5pdCA9PSAnbnMnKSB7XG4gICAgICAgICAgICBkaXZpc29yID0gMWU5O1xuICAgICAgICAgICAgYmVnaW4gPSAoYmVnaW4gPSBucygpKVswXSArIChiZWdpblsxXSAvIGRpdmlzb3IpO1xuICAgICAgICAgICAgd2hpbGUgKCEobWVhc3VyZWQgPSAoKG1lYXN1cmVkID0gbnMoKSlbMF0gKyAobWVhc3VyZWRbMV0gLyBkaXZpc29yKSkgLSBiZWdpbikpIHt9XG4gICAgICAgICAgICBkaXZpc29yID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAobnMubm93KSB7XG4gICAgICAgICAgICBiZWdpbiA9IG5zLm5vdygpO1xuICAgICAgICAgICAgd2hpbGUgKCEobWVhc3VyZWQgPSBucy5ub3coKSAtIGJlZ2luKSkge31cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBiZWdpbiA9IG5ldyBucygpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHdoaWxlICghKG1lYXN1cmVkID0gbmV3IG5zKCkuZ2V0VGltZSgpIC0gYmVnaW4pKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDaGVjayBmb3IgYnJva2VuIHRpbWVycy5cbiAgICAgICAgICBpZiAobWVhc3VyZWQgPiAwKSB7XG4gICAgICAgICAgICBzYW1wbGUucHVzaChtZWFzdXJlZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhbXBsZS5wdXNoKEluZmluaXR5KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDb252ZXJ0IHRvIHNlY29uZHMuXG4gICAgICAgIHJldHVybiBnZXRNZWFuKHNhbXBsZSkgLyBkaXZpc29yO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEludGVycG9sYXRlcyBhIGdpdmVuIHRlbXBsYXRlIHN0cmluZy5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gaW50ZXJwb2xhdGUoc3RyaW5nKSB7XG4gICAgICAgIC8vIFJlcGxhY2VzIGFsbCBvY2N1cnJlbmNlcyBvZiBgI2Agd2l0aCBhIHVuaXF1ZSBudW1iZXIgYW5kIHRlbXBsYXRlIHRva2VucyB3aXRoIGNvbnRlbnQuXG4gICAgICAgIHJldHVybiBfLnRlbXBsYXRlKHN0cmluZy5yZXBsYWNlKC9cXCMvZywgL1xcZCsvLmV4ZWModGVtcGxhdGVEYXRhLnVpZCkpKSh0ZW1wbGF0ZURhdGEpO1xuICAgICAgfVxuXG4gICAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgICAvLyBEZXRlY3QgQ2hyb21lJ3MgbWljcm9zZWNvbmQgdGltZXI6XG4gICAgICAvLyBlbmFibGUgYmVuY2htYXJraW5nIHZpYSB0aGUgLS1lbmFibGUtYmVuY2htYXJraW5nIGNvbW1hbmRcbiAgICAgIC8vIGxpbmUgc3dpdGNoIGluIGF0IGxlYXN0IENocm9tZSA3IHRvIHVzZSBjaHJvbWUuSW50ZXJ2YWxcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICgodGltZXIubnMgPSBuZXcgKGNvbnRleHQuY2hyb21lIHx8IGNvbnRleHQuY2hyb21pdW0pLkludGVydmFsKSkge1xuICAgICAgICAgIHRpbWVycy5wdXNoKHsgJ25zJzogdGltZXIubnMsICdyZXMnOiBnZXRSZXMoJ3VzJyksICd1bml0JzogJ3VzJyB9KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaChlKSB7fVxuXG4gICAgICAvLyBEZXRlY3QgTm9kZS5qcydzIG5hbm9zZWNvbmQgcmVzb2x1dGlvbiB0aW1lciBhdmFpbGFibGUgaW4gTm9kZS5qcyA+PSAwLjguXG4gICAgICBpZiAocHJvY2Vzc09iamVjdCAmJiB0eXBlb2YgKHRpbWVyLm5zID0gcHJvY2Vzc09iamVjdC5ocnRpbWUpID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGltZXJzLnB1c2goeyAnbnMnOiB0aW1lci5ucywgJ3Jlcyc6IGdldFJlcygnbnMnKSwgJ3VuaXQnOiAnbnMnIH0pO1xuICAgICAgfVxuICAgICAgLy8gRGV0ZWN0IFdhZGUgU2ltbW9ucycgTm9kZS5qcyBgbWljcm90aW1lYCBtb2R1bGUuXG4gICAgICBpZiAobWljcm90aW1lT2JqZWN0ICYmIHR5cGVvZiAodGltZXIubnMgPSBtaWNyb3RpbWVPYmplY3Qubm93KSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRpbWVycy5wdXNoKHsgJ25zJzogdGltZXIubnMsICAncmVzJzogZ2V0UmVzKCd1cycpLCAndW5pdCc6ICd1cycgfSk7XG4gICAgICB9XG4gICAgICAvLyBQaWNrIHRpbWVyIHdpdGggaGlnaGVzdCByZXNvbHV0aW9uLlxuICAgICAgdGltZXIgPSBfLm1pbkJ5KHRpbWVycywgJ3JlcycpO1xuXG4gICAgICAvLyBFcnJvciBpZiB0aGVyZSBhcmUgbm8gd29ya2luZyB0aW1lcnMuXG4gICAgICBpZiAodGltZXIucmVzID09IEluZmluaXR5KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQmVuY2htYXJrLmpzIHdhcyB1bmFibGUgdG8gZmluZCBhIHdvcmtpbmcgdGltZXIuJyk7XG4gICAgICB9XG4gICAgICAvLyBSZXNvbHZlIHRpbWUgc3BhbiByZXF1aXJlZCB0byBhY2hpZXZlIGEgcGVyY2VudCB1bmNlcnRhaW50eSBvZiBhdCBtb3N0IDElLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHA6Ly9zcGlmZi5yaXQuZWR1L2NsYXNzZXMvcGh5czI3My91bmNlcnQvdW5jZXJ0Lmh0bWwuXG4gICAgICBvcHRpb25zLm1pblRpbWUgfHwgKG9wdGlvbnMubWluVGltZSA9IG1heCh0aW1lci5yZXMgLyAyIC8gMC4wMSwgMC4wNSkpO1xuICAgICAgcmV0dXJuIGNsb2NrLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZXMgc3RhdHMgb24gYmVuY2htYXJrIHJlc3VsdHMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBiZW5jaCBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb21wdXRlKGJlbmNoLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXG4gICAgICB2YXIgYXN5bmMgPSBvcHRpb25zLmFzeW5jLFxuICAgICAgICAgIGVsYXBzZWQgPSAwLFxuICAgICAgICAgIGluaXRDb3VudCA9IGJlbmNoLmluaXRDb3VudCxcbiAgICAgICAgICBtaW5TYW1wbGVzID0gYmVuY2gubWluU2FtcGxlcyxcbiAgICAgICAgICBxdWV1ZSA9IFtdLFxuICAgICAgICAgIHNhbXBsZSA9IGJlbmNoLnN0YXRzLnNhbXBsZTtcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGRzIGEgY2xvbmUgdG8gdGhlIHF1ZXVlLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBlbnF1ZXVlKCkge1xuICAgICAgICBxdWV1ZS5wdXNoKGJlbmNoLmNsb25lKHtcbiAgICAgICAgICAnX29yaWdpbmFsJzogYmVuY2gsXG4gICAgICAgICAgJ2V2ZW50cyc6IHtcbiAgICAgICAgICAgICdhYm9ydCc6IFt1cGRhdGVdLFxuICAgICAgICAgICAgJ2N5Y2xlJzogW3VwZGF0ZV0sXG4gICAgICAgICAgICAnZXJyb3InOiBbdXBkYXRlXSxcbiAgICAgICAgICAgICdzdGFydCc6IFt1cGRhdGVdXG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogVXBkYXRlcyB0aGUgY2xvbmUvb3JpZ2luYWwgYmVuY2htYXJrcyB0byBrZWVwIHRoZWlyIGRhdGEgaW4gc3luYy5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gdXBkYXRlKGV2ZW50KSB7XG4gICAgICAgIHZhciBjbG9uZSA9IHRoaXMsXG4gICAgICAgICAgICB0eXBlID0gZXZlbnQudHlwZTtcblxuICAgICAgICBpZiAoYmVuY2gucnVubmluZykge1xuICAgICAgICAgIGlmICh0eXBlID09ICdzdGFydCcpIHtcbiAgICAgICAgICAgIC8vIE5vdGU6IGBjbG9uZS5taW5UaW1lYCBwcm9wIGlzIGluaXRlZCBpbiBgY2xvY2soKWAuXG4gICAgICAgICAgICBjbG9uZS5jb3VudCA9IGJlbmNoLmluaXRDb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnZXJyb3InKSB7XG4gICAgICAgICAgICAgIGJlbmNoLmVycm9yID0gY2xvbmUuZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZSA9PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICAgIGJlbmNoLmFib3J0KCk7XG4gICAgICAgICAgICAgIGJlbmNoLmVtaXQoJ2N5Y2xlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gZXZlbnQudGFyZ2V0ID0gYmVuY2g7XG4gICAgICAgICAgICAgIGJlbmNoLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChiZW5jaC5hYm9ydGVkKSB7XG4gICAgICAgICAgLy8gQ2xlYXIgYWJvcnQgbGlzdGVuZXJzIHRvIGF2b2lkIHRyaWdnZXJpbmcgYmVuY2gncyBhYm9ydC9jeWNsZSBhZ2Fpbi5cbiAgICAgICAgICBjbG9uZS5ldmVudHMuYWJvcnQubGVuZ3RoID0gMDtcbiAgICAgICAgICBjbG9uZS5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRGV0ZXJtaW5lcyBpZiBtb3JlIGNsb25lcyBzaG91bGQgYmUgcXVldWVkIG9yIGlmIGN5Y2xpbmcgc2hvdWxkIHN0b3AuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGV2YWx1YXRlKGV2ZW50KSB7XG4gICAgICAgIHZhciBjcml0aWNhbCxcbiAgICAgICAgICAgIGRmLFxuICAgICAgICAgICAgbWVhbixcbiAgICAgICAgICAgIG1vZSxcbiAgICAgICAgICAgIHJtZSxcbiAgICAgICAgICAgIHNkLFxuICAgICAgICAgICAgc2VtLFxuICAgICAgICAgICAgdmFyaWFuY2UsXG4gICAgICAgICAgICBjbG9uZSA9IGV2ZW50LnRhcmdldCxcbiAgICAgICAgICAgIGRvbmUgPSBiZW5jaC5hYm9ydGVkLFxuICAgICAgICAgICAgbm93ID0gXy5ub3coKSxcbiAgICAgICAgICAgIHNpemUgPSBzYW1wbGUucHVzaChjbG9uZS50aW1lcy5wZXJpb2QpLFxuICAgICAgICAgICAgbWF4ZWRPdXQgPSBzaXplID49IG1pblNhbXBsZXMgJiYgKGVsYXBzZWQgKz0gbm93IC0gY2xvbmUudGltZXMudGltZVN0YW1wKSAvIDFlMyA+IGJlbmNoLm1heFRpbWUsXG4gICAgICAgICAgICB0aW1lcyA9IGJlbmNoLnRpbWVzLFxuICAgICAgICAgICAgdmFyT2YgPSBmdW5jdGlvbihzdW0sIHgpIHsgcmV0dXJuIHN1bSArIHBvdyh4IC0gbWVhbiwgMik7IH07XG5cbiAgICAgICAgLy8gRXhpdCBlYXJseSBmb3IgYWJvcnRlZCBvciB1bmNsb2NrYWJsZSB0ZXN0cy5cbiAgICAgICAgaWYgKGRvbmUgfHwgY2xvbmUuaHogPT0gSW5maW5pdHkpIHtcbiAgICAgICAgICBtYXhlZE91dCA9ICEoc2l6ZSA9IHNhbXBsZS5sZW5ndGggPSBxdWV1ZS5sZW5ndGggPSAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHNhbXBsZSBtZWFuIChlc3RpbWF0ZSBvZiB0aGUgcG9wdWxhdGlvbiBtZWFuKS5cbiAgICAgICAgICBtZWFuID0gZ2V0TWVhbihzYW1wbGUpO1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHNhbXBsZSB2YXJpYW5jZSAoZXN0aW1hdGUgb2YgdGhlIHBvcHVsYXRpb24gdmFyaWFuY2UpLlxuICAgICAgICAgIHZhcmlhbmNlID0gXy5yZWR1Y2Uoc2FtcGxlLCB2YXJPZiwgMCkgLyAoc2l6ZSAtIDEpIHx8IDA7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIHN0YW5kYXJkIGRldmlhdGlvbiAoZXN0aW1hdGUgb2YgdGhlIHBvcHVsYXRpb24gc3RhbmRhcmQgZGV2aWF0aW9uKS5cbiAgICAgICAgICBzZCA9IHNxcnQodmFyaWFuY2UpO1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIHN0YW5kYXJkIGVycm9yIG9mIHRoZSBtZWFuIChhLmsuYS4gdGhlIHN0YW5kYXJkIGRldmlhdGlvbiBvZiB0aGUgc2FtcGxpbmcgZGlzdHJpYnV0aW9uIG9mIHRoZSBzYW1wbGUgbWVhbikuXG4gICAgICAgICAgc2VtID0gc2QgLyBzcXJ0KHNpemUpO1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIGRlZ3JlZXMgb2YgZnJlZWRvbS5cbiAgICAgICAgICBkZiA9IHNpemUgLSAxO1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIGNyaXRpY2FsIHZhbHVlLlxuICAgICAgICAgIGNyaXRpY2FsID0gdFRhYmxlW01hdGgucm91bmQoZGYpIHx8IDFdIHx8IHRUYWJsZS5pbmZpbml0eTtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBtYXJnaW4gb2YgZXJyb3IuXG4gICAgICAgICAgbW9lID0gc2VtICogY3JpdGljYWw7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcmVsYXRpdmUgbWFyZ2luIG9mIGVycm9yLlxuICAgICAgICAgIHJtZSA9IChtb2UgLyBtZWFuKSAqIDEwMCB8fCAwO1xuXG4gICAgICAgICAgXy5hc3NpZ24oYmVuY2guc3RhdHMsIHtcbiAgICAgICAgICAgICdkZXZpYXRpb24nOiBzZCxcbiAgICAgICAgICAgICdtZWFuJzogbWVhbixcbiAgICAgICAgICAgICdtb2UnOiBtb2UsXG4gICAgICAgICAgICAncm1lJzogcm1lLFxuICAgICAgICAgICAgJ3NlbSc6IHNlbSxcbiAgICAgICAgICAgICd2YXJpYW5jZSc6IHZhcmlhbmNlXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBBYm9ydCB0aGUgY3ljbGUgbG9vcCB3aGVuIHRoZSBtaW5pbXVtIHNhbXBsZSBzaXplIGhhcyBiZWVuIGNvbGxlY3RlZFxuICAgICAgICAgIC8vIGFuZCB0aGUgZWxhcHNlZCB0aW1lIGV4Y2VlZHMgdGhlIG1heGltdW0gdGltZSBhbGxvd2VkIHBlciBiZW5jaG1hcmsuXG4gICAgICAgICAgLy8gV2UgZG9uJ3QgY291bnQgY3ljbGUgZGVsYXlzIHRvd2FyZCB0aGUgbWF4IHRpbWUgYmVjYXVzZSBkZWxheXMgbWF5IGJlXG4gICAgICAgICAgLy8gaW5jcmVhc2VkIGJ5IGJyb3dzZXJzIHRoYXQgY2xhbXAgdGltZW91dHMgZm9yIGluYWN0aXZlIHRhYnMuIEZvciBtb3JlXG4gICAgICAgICAgLy8gaW5mb3JtYXRpb24gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL3dpbmRvdy5zZXRUaW1lb3V0I0luYWN0aXZlX3RhYnMuXG4gICAgICAgICAgaWYgKG1heGVkT3V0KSB7XG4gICAgICAgICAgICAvLyBSZXNldCB0aGUgYGluaXRDb3VudGAgaW4gY2FzZSB0aGUgYmVuY2htYXJrIGlzIHJlcnVuLlxuICAgICAgICAgICAgYmVuY2guaW5pdENvdW50ID0gaW5pdENvdW50O1xuICAgICAgICAgICAgYmVuY2gucnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICB0aW1lcy5lbGFwc2VkID0gKG5vdyAtIHRpbWVzLnRpbWVTdGFtcCkgLyAxZTM7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChiZW5jaC5oeiAhPSBJbmZpbml0eSkge1xuICAgICAgICAgICAgYmVuY2guaHogPSAxIC8gbWVhbjtcbiAgICAgICAgICAgIHRpbWVzLmN5Y2xlID0gbWVhbiAqIGJlbmNoLmNvdW50O1xuICAgICAgICAgICAgdGltZXMucGVyaW9kID0gbWVhbjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGltZSBwZXJtaXRzLCBpbmNyZWFzZSBzYW1wbGUgc2l6ZSB0byByZWR1Y2UgdGhlIG1hcmdpbiBvZiBlcnJvci5cbiAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA8IDIgJiYgIW1heGVkT3V0KSB7XG4gICAgICAgICAgZW5xdWV1ZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFib3J0IHRoZSBgaW52b2tlYCBjeWNsZSB3aGVuIGRvbmUuXG4gICAgICAgIGV2ZW50LmFib3J0ZWQgPSBkb25lO1xuICAgICAgfVxuXG4gICAgICAvLyBJbml0IHF1ZXVlIGFuZCBiZWdpbi5cbiAgICAgIGVucXVldWUoKTtcbiAgICAgIGludm9rZShxdWV1ZSwge1xuICAgICAgICAnbmFtZSc6ICdydW4nLFxuICAgICAgICAnYXJncyc6IHsgJ2FzeW5jJzogYXN5bmMgfSxcbiAgICAgICAgJ3F1ZXVlZCc6IHRydWUsXG4gICAgICAgICdvbkN5Y2xlJzogZXZhbHVhdGUsXG4gICAgICAgICdvbkNvbXBsZXRlJzogZnVuY3Rpb24oKSB7IGJlbmNoLmVtaXQoJ2NvbXBsZXRlJyk7IH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEN5Y2xlcyBhIGJlbmNobWFyayB1bnRpbCBhIHJ1biBgY291bnRgIGNhbiBiZSBlc3RhYmxpc2hlZC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNsb25lIFRoZSBjbG9uZWQgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjeWNsZShjbG9uZSwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblxuICAgICAgdmFyIGRlZmVycmVkO1xuICAgICAgaWYgKGNsb25lIGluc3RhbmNlb2YgRGVmZXJyZWQpIHtcbiAgICAgICAgZGVmZXJyZWQgPSBjbG9uZTtcbiAgICAgICAgY2xvbmUgPSBjbG9uZS5iZW5jaG1hcms7XG4gICAgICB9XG4gICAgICB2YXIgY2xvY2tlZCxcbiAgICAgICAgICBjeWNsZXMsXG4gICAgICAgICAgZGl2aXNvcixcbiAgICAgICAgICBldmVudCxcbiAgICAgICAgICBtaW5UaW1lLFxuICAgICAgICAgIHBlcmlvZCxcbiAgICAgICAgICBhc3luYyA9IG9wdGlvbnMuYXN5bmMsXG4gICAgICAgICAgYmVuY2ggPSBjbG9uZS5fb3JpZ2luYWwsXG4gICAgICAgICAgY291bnQgPSBjbG9uZS5jb3VudCxcbiAgICAgICAgICB0aW1lcyA9IGNsb25lLnRpbWVzO1xuXG4gICAgICAvLyBDb250aW51ZSwgaWYgbm90IGFib3J0ZWQgYmV0d2VlbiBjeWNsZXMuXG4gICAgICBpZiAoY2xvbmUucnVubmluZykge1xuICAgICAgICAvLyBgbWluVGltZWAgaXMgc2V0IHRvIGBCZW5jaG1hcmsub3B0aW9ucy5taW5UaW1lYCBpbiBgY2xvY2soKWAuXG4gICAgICAgIGN5Y2xlcyA9ICsrY2xvbmUuY3ljbGVzO1xuICAgICAgICBjbG9ja2VkID0gZGVmZXJyZWQgPyBkZWZlcnJlZC5lbGFwc2VkIDogY2xvY2soY2xvbmUpO1xuICAgICAgICBtaW5UaW1lID0gY2xvbmUubWluVGltZTtcblxuICAgICAgICBpZiAoY3ljbGVzID4gYmVuY2guY3ljbGVzKSB7XG4gICAgICAgICAgYmVuY2guY3ljbGVzID0gY3ljbGVzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjbG9uZS5lcnJvcikge1xuICAgICAgICAgIGV2ZW50ID0gRXZlbnQoJ2Vycm9yJyk7XG4gICAgICAgICAgZXZlbnQubWVzc2FnZSA9IGNsb25lLmVycm9yO1xuICAgICAgICAgIGNsb25lLmVtaXQoZXZlbnQpO1xuICAgICAgICAgIGlmICghZXZlbnQuY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICBjbG9uZS5hYm9ydCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQ29udGludWUsIGlmIG5vdCBlcnJvcmVkLlxuICAgICAgaWYgKGNsb25lLnJ1bm5pbmcpIHtcbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgdGltZSB0YWtlbiB0byBjb21wbGV0ZSBsYXN0IHRlc3QgY3ljbGUuXG4gICAgICAgIGJlbmNoLnRpbWVzLmN5Y2xlID0gdGltZXMuY3ljbGUgPSBjbG9ja2VkO1xuICAgICAgICAvLyBDb21wdXRlIHRoZSBzZWNvbmRzIHBlciBvcGVyYXRpb24uXG4gICAgICAgIHBlcmlvZCA9IGJlbmNoLnRpbWVzLnBlcmlvZCA9IHRpbWVzLnBlcmlvZCA9IGNsb2NrZWQgLyBjb3VudDtcbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgb3BzIHBlciBzZWNvbmQuXG4gICAgICAgIGJlbmNoLmh6ID0gY2xvbmUuaHogPSAxIC8gcGVyaW9kO1xuICAgICAgICAvLyBBdm9pZCB3b3JraW5nIG91ciB3YXkgdXAgdG8gdGhpcyBuZXh0IHRpbWUuXG4gICAgICAgIGJlbmNoLmluaXRDb3VudCA9IGNsb25lLmluaXRDb3VudCA9IGNvdW50O1xuICAgICAgICAvLyBEbyB3ZSBuZWVkIHRvIGRvIGFub3RoZXIgY3ljbGU/XG4gICAgICAgIGNsb25lLnJ1bm5pbmcgPSBjbG9ja2VkIDwgbWluVGltZTtcblxuICAgICAgICBpZiAoY2xvbmUucnVubmluZykge1xuICAgICAgICAgIC8vIFRlc3RzIG1heSBjbG9jayBhdCBgMGAgd2hlbiBgaW5pdENvdW50YCBpcyBhIHNtYWxsIG51bWJlcixcbiAgICAgICAgICAvLyB0byBhdm9pZCB0aGF0IHdlIHNldCBpdHMgY291bnQgdG8gc29tZXRoaW5nIGEgYml0IGhpZ2hlci5cbiAgICAgICAgICBpZiAoIWNsb2NrZWQgJiYgKGRpdmlzb3IgPSBkaXZpc29yc1tjbG9uZS5jeWNsZXNdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb3VudCA9IGZsb29yKDRlNiAvIGRpdmlzb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBDYWxjdWxhdGUgaG93IG1hbnkgbW9yZSBpdGVyYXRpb25zIGl0IHdpbGwgdGFrZSB0byBhY2hpZXZlIHRoZSBgbWluVGltZWAuXG4gICAgICAgICAgaWYgKGNvdW50IDw9IGNsb25lLmNvdW50KSB7XG4gICAgICAgICAgICBjb3VudCArPSBNYXRoLmNlaWwoKG1pblRpbWUgLSBjbG9ja2VkKSAvIHBlcmlvZCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNsb25lLnJ1bm5pbmcgPSBjb3VudCAhPSBJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gU2hvdWxkIHdlIGV4aXQgZWFybHk/XG4gICAgICBldmVudCA9IEV2ZW50KCdjeWNsZScpO1xuICAgICAgY2xvbmUuZW1pdChldmVudCk7XG4gICAgICBpZiAoZXZlbnQuYWJvcnRlZCkge1xuICAgICAgICBjbG9uZS5hYm9ydCgpO1xuICAgICAgfVxuICAgICAgLy8gRmlndXJlIG91dCB3aGF0IHRvIGRvIG5leHQuXG4gICAgICBpZiAoY2xvbmUucnVubmluZykge1xuICAgICAgICAvLyBTdGFydCBhIG5ldyBjeWNsZS5cbiAgICAgICAgY2xvbmUuY291bnQgPSBjb3VudDtcbiAgICAgICAgaWYgKGRlZmVycmVkKSB7XG4gICAgICAgICAgY2xvbmUuY29tcGlsZWQuY2FsbChkZWZlcnJlZCwgY29udGV4dCwgdGltZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgZGVsYXkoY2xvbmUsIGZ1bmN0aW9uKCkgeyBjeWNsZShjbG9uZSwgb3B0aW9ucyk7IH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN5Y2xlKGNsb25lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIEZpeCBUcmFjZU1vbmtleSBidWcgYXNzb2NpYXRlZCB3aXRoIGNsb2NrIGZhbGxiYWNrcy5cbiAgICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHA6Ly9idWd6aWwubGEvNTA5MDY5LlxuICAgICAgICBpZiAoc3VwcG9ydC5icm93c2VyKSB7XG4gICAgICAgICAgcnVuU2NyaXB0KHVpZCArICc9MTtkZWxldGUgJyArIHVpZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2UncmUgZG9uZS5cbiAgICAgICAgY2xvbmUuZW1pdCgnY29tcGxldGUnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBSdW5zIHRoZSBiZW5jaG1hcmsuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBiYXNpYyB1c2FnZVxuICAgICAqIGJlbmNoLnJ1bigpO1xuICAgICAqXG4gICAgICogLy8gb3Igd2l0aCBvcHRpb25zXG4gICAgICogYmVuY2gucnVuKHsgJ2FzeW5jJzogdHJ1ZSB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBydW4ob3B0aW9ucykge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcyxcbiAgICAgICAgICBldmVudCA9IEV2ZW50KCdzdGFydCcpO1xuXG4gICAgICAvLyBTZXQgYHJ1bm5pbmdgIHRvIGBmYWxzZWAgc28gYHJlc2V0KClgIHdvbid0IGNhbGwgYGFib3J0KClgLlxuICAgICAgYmVuY2gucnVubmluZyA9IGZhbHNlO1xuICAgICAgYmVuY2gucmVzZXQoKTtcbiAgICAgIGJlbmNoLnJ1bm5pbmcgPSB0cnVlO1xuXG4gICAgICBiZW5jaC5jb3VudCA9IGJlbmNoLmluaXRDb3VudDtcbiAgICAgIGJlbmNoLnRpbWVzLnRpbWVTdGFtcCA9IF8ubm93KCk7XG4gICAgICBiZW5jaC5lbWl0KGV2ZW50KTtcblxuICAgICAgaWYgKCFldmVudC5jYW5jZWxsZWQpIHtcbiAgICAgICAgb3B0aW9ucyA9IHsgJ2FzeW5jJzogKChvcHRpb25zID0gb3B0aW9ucyAmJiBvcHRpb25zLmFzeW5jKSA9PSBudWxsID8gYmVuY2guYXN5bmMgOiBvcHRpb25zKSAmJiBzdXBwb3J0LnRpbWVvdXQgfTtcblxuICAgICAgICAvLyBGb3IgY2xvbmVzIGNyZWF0ZWQgd2l0aGluIGBjb21wdXRlKClgLlxuICAgICAgICBpZiAoYmVuY2guX29yaWdpbmFsKSB7XG4gICAgICAgICAgaWYgKGJlbmNoLmRlZmVyKSB7XG4gICAgICAgICAgICBEZWZlcnJlZChiZW5jaCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN5Y2xlKGJlbmNoLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRm9yIG9yaWdpbmFsIGJlbmNobWFya3MuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbXB1dGUoYmVuY2gsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVuY2g7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gRmlyZWZveCAxIGVycm9uZW91c2x5IGRlZmluZXMgdmFyaWFibGUgYW5kIGFyZ3VtZW50IG5hbWVzIG9mIGZ1bmN0aW9ucyBvblxuICAgIC8vIHRoZSBmdW5jdGlvbiBpdHNlbGYgYXMgbm9uLWNvbmZpZ3VyYWJsZSBwcm9wZXJ0aWVzIHdpdGggYHVuZGVmaW5lZGAgdmFsdWVzLlxuICAgIC8vIFRoZSBidWdnaW5lc3MgY29udGludWVzIGFzIHRoZSBgQmVuY2htYXJrYCBjb25zdHJ1Y3RvciBoYXMgYW4gYXJndW1lbnRcbiAgICAvLyBuYW1lZCBgb3B0aW9uc2AgYW5kIEZpcmVmb3ggMSB3aWxsIG5vdCBhc3NpZ24gYSB2YWx1ZSB0byBgQmVuY2htYXJrLm9wdGlvbnNgLFxuICAgIC8vIG1ha2luZyBpdCBub24td3JpdGFibGUgaW4gdGhlIHByb2Nlc3MsIHVubGVzcyBpdCBpcyB0aGUgZmlyc3QgcHJvcGVydHlcbiAgICAvLyBhc3NpZ25lZCBieSBmb3ItaW4gbG9vcCBvZiBgXy5hc3NpZ24oKWAuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGRlZmF1bHQgb3B0aW9ucyBjb3BpZWQgYnkgYmVuY2htYXJrIGluc3RhbmNlcy5cbiAgICAgICAqXG4gICAgICAgKiBAc3RhdGljXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ29wdGlvbnMnOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB0aGF0IGJlbmNobWFyayBjeWNsZXMgd2lsbCBleGVjdXRlIGFzeW5jaHJvbm91c2x5XG4gICAgICAgICAqIGJ5IGRlZmF1bHQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICAqL1xuICAgICAgICAnYXN5bmMnOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgdGhlIGJlbmNobWFyayBjbG9jayBpcyBkZWZlcnJlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICovXG4gICAgICAgICdkZWZlcic6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZGVsYXkgYmV0d2VlbiB0ZXN0IGN5Y2xlcyAoc2VjcykuXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdkZWxheSc6IDAuMDA1LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwbGF5ZWQgYnkgYEJlbmNobWFyayN0b1N0cmluZ2Agd2hlbiBhIGBuYW1lYCBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgICAqIChhdXRvLWdlbmVyYXRlZCBpZiBhYnNlbnQpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICAqL1xuICAgICAgICAnaWQnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBkZWZhdWx0IG51bWJlciBvZiB0aW1lcyB0byBleGVjdXRlIGEgdGVzdCBvbiBhIGJlbmNobWFyaydzIGZpcnN0IGN5Y2xlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnaW5pdENvdW50JzogMSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1heGltdW0gdGltZSBhIGJlbmNobWFyayBpcyBhbGxvd2VkIHRvIHJ1biBiZWZvcmUgZmluaXNoaW5nIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogTm90ZTogQ3ljbGUgZGVsYXlzIGFyZW4ndCBjb3VudGVkIHRvd2FyZCB0aGUgbWF4aW11bSB0aW1lLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnbWF4VGltZSc6IDUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBtaW5pbXVtIHNhbXBsZSBzaXplIHJlcXVpcmVkIHRvIHBlcmZvcm0gc3RhdGlzdGljYWwgYW5hbHlzaXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdtaW5TYW1wbGVzJzogNSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRpbWUgbmVlZGVkIHRvIHJlZHVjZSB0aGUgcGVyY2VudCB1bmNlcnRhaW50eSBvZiBtZWFzdXJlbWVudCB0byAxJSAoc2VjcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdtaW5UaW1lJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG5hbWUgb2YgdGhlIGJlbmNobWFyay5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgJ25hbWUnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgaXMgYWJvcnRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnb25BYm9ydCc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gZXZlbnQgbGlzdGVuZXIgY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBjb21wbGV0ZXMgcnVubmluZy5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnb25Db21wbGV0ZSc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gZXZlbnQgbGlzdGVuZXIgY2FsbGVkIGFmdGVyIGVhY2ggcnVuIGN5Y2xlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvbkN5Y2xlJzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgd2hlbiBhIHRlc3QgZXJyb3JzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvbkVycm9yJzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIGlzIHJlc2V0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvblJlc2V0JzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIHN0YXJ0cyBydW5uaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvblN0YXJ0JzogdW5kZWZpbmVkXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFBsYXRmb3JtIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZGVzY3JpYmluZyB0aGluZ3MgbGlrZSBicm93c2VyIG5hbWUsXG4gICAgICAgKiB2ZXJzaW9uLCBhbmQgb3BlcmF0aW5nIHN5c3RlbS4gU2VlIFtgcGxhdGZvcm0uanNgXShodHRwczovL210aHMuYmUvcGxhdGZvcm0pLlxuICAgICAgICpcbiAgICAgICAqIEBzdGF0aWNcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAncGxhdGZvcm0nOiBjb250ZXh0LnBsYXRmb3JtIHx8IHJlcXVpcmUoJ3BsYXRmb3JtJykgfHwgKHtcbiAgICAgICAgJ2Rlc2NyaXB0aW9uJzogY29udGV4dC5uYXZpZ2F0b3IgJiYgY29udGV4dC5uYXZpZ2F0b3IudXNlckFnZW50IHx8IG51bGwsXG4gICAgICAgICdsYXlvdXQnOiBudWxsLFxuICAgICAgICAncHJvZHVjdCc6IG51bGwsXG4gICAgICAgICduYW1lJzogbnVsbCxcbiAgICAgICAgJ21hbnVmYWN0dXJlcic6IG51bGwsXG4gICAgICAgICdvcyc6IG51bGwsXG4gICAgICAgICdwcmVyZWxlYXNlJzogbnVsbCxcbiAgICAgICAgJ3ZlcnNpb24nOiBudWxsLFxuICAgICAgICAndG9TdHJpbmcnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kZXNjcmlwdGlvbiB8fCAnJztcbiAgICAgICAgfVxuICAgICAgfSksXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIHNlbWFudGljIHZlcnNpb24gbnVtYmVyLlxuICAgICAgICpcbiAgICAgICAqIEBzdGF0aWNcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICovXG4gICAgICAndmVyc2lvbic6ICcyLjEuMSdcbiAgICB9KTtcblxuICAgIF8uYXNzaWduKEJlbmNobWFyaywge1xuICAgICAgJ2ZpbHRlcic6IGZpbHRlcixcbiAgICAgICdmb3JtYXROdW1iZXInOiBmb3JtYXROdW1iZXIsXG4gICAgICAnaW52b2tlJzogaW52b2tlLFxuICAgICAgJ2pvaW4nOiBqb2luLFxuICAgICAgJ3J1bkluQ29udGV4dCc6IHJ1bkluQ29udGV4dCxcbiAgICAgICdzdXBwb3J0Jzogc3VwcG9ydFxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGxvZGFzaCBtZXRob2RzIHRvIEJlbmNobWFyay5cbiAgICBfLmVhY2goWydlYWNoJywgJ2ZvckVhY2gnLCAnZm9yT3duJywgJ2hhcycsICdpbmRleE9mJywgJ21hcCcsICdyZWR1Y2UnXSwgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgQmVuY2htYXJrW21ldGhvZE5hbWVdID0gX1ttZXRob2ROYW1lXTtcbiAgICB9KTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIF8uYXNzaWduKEJlbmNobWFyay5wcm90b3R5cGUsIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIHRpbWVzIGEgdGVzdCB3YXMgZXhlY3V0ZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICdjb3VudCc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG51bWJlciBvZiBjeWNsZXMgcGVyZm9ybWVkIHdoaWxlIGJlbmNobWFya2luZy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2N5Y2xlcyc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG51bWJlciBvZiBleGVjdXRpb25zIHBlciBzZWNvbmQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICdoeic6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGNvbXBpbGVkIHRlc3QgZnVuY3Rpb24uXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUge0Z1bmN0aW9ufHN0cmluZ31cbiAgICAgICAqL1xuICAgICAgJ2NvbXBpbGVkJzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBlcnJvciBvYmplY3QgaWYgdGhlIHRlc3QgZmFpbGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnZXJyb3InOiB1bmRlZmluZWQsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIHRlc3QgdG8gYmVuY2htYXJrLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIHtGdW5jdGlvbnxzdHJpbmd9XG4gICAgICAgKi9cbiAgICAgICdmbic6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIGJlbmNobWFyayBpcyBhYm9ydGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgJ2Fib3J0ZWQnOiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIGJlbmNobWFyayBpcyBydW5uaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgJ3J1bm5pbmcnOiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDb21waWxlZCBpbnRvIHRoZSB0ZXN0IGFuZCBleGVjdXRlZCBpbW1lZGlhdGVseSAqKmJlZm9yZSoqIHRoZSB0ZXN0IGxvb3AuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUge0Z1bmN0aW9ufHN0cmluZ31cbiAgICAgICAqIEBleGFtcGxlXG4gICAgICAgKlxuICAgICAgICogLy8gYmFzaWMgdXNhZ2VcbiAgICAgICAqIHZhciBiZW5jaCA9IEJlbmNobWFyayh7XG4gICAgICAgKiAgICdzZXR1cCc6IGZ1bmN0aW9uKCkge1xuICAgICAgICogICAgIHZhciBjID0gdGhpcy5jb3VudCxcbiAgICAgICAqICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICAgICAqICAgICB3aGlsZSAoYy0tKSB7XG4gICAgICAgKiAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAgICAqICAgICB9XG4gICAgICAgKiAgIH0sXG4gICAgICAgKiAgICdmbic6IGZ1bmN0aW9uKCkge1xuICAgICAgICogICAgIGVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbWVudC5sYXN0Q2hpbGQpO1xuICAgICAgICogICB9XG4gICAgICAgKiB9KTtcbiAgICAgICAqXG4gICAgICAgKiAvLyBjb21waWxlcyB0byBzb21ldGhpbmcgbGlrZTpcbiAgICAgICAqIHZhciBjID0gdGhpcy5jb3VudCxcbiAgICAgICAqICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgICAgICogd2hpbGUgKGMtLSkge1xuICAgICAgICogICBlbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAgICAqIH1cbiAgICAgICAqIHZhciBzdGFydCA9IG5ldyBEYXRlO1xuICAgICAgICogd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgICAqICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50Lmxhc3RDaGlsZCk7XG4gICAgICAgKiB9XG4gICAgICAgKiB2YXIgZW5kID0gbmV3IERhdGUgLSBzdGFydDtcbiAgICAgICAqXG4gICAgICAgKiAvLyBvciB1c2luZyBzdHJpbmdzXG4gICAgICAgKiB2YXIgYmVuY2ggPSBCZW5jaG1hcmsoe1xuICAgICAgICogICAnc2V0dXAnOiAnXFxcbiAgICAgICAqICAgICB2YXIgYSA9IDA7XFxuXFxcbiAgICAgICAqICAgICAoZnVuY3Rpb24oKSB7XFxuXFxcbiAgICAgICAqICAgICAgIChmdW5jdGlvbigpIHtcXG5cXFxuICAgICAgICogICAgICAgICAoZnVuY3Rpb24oKSB7JyxcbiAgICAgICAqICAgJ2ZuJzogJ2EgKz0gMTsnLFxuICAgICAgICogICAndGVhcmRvd24nOiAnXFxcbiAgICAgICAqICAgICAgICAgIH0oKSlcXG5cXFxuICAgICAgICogICAgICAgIH0oKSlcXG5cXFxuICAgICAgICogICAgICB9KCkpJ1xuICAgICAgICogfSk7XG4gICAgICAgKlxuICAgICAgICogLy8gY29tcGlsZXMgdG8gc29tZXRoaW5nIGxpa2U6XG4gICAgICAgKiB2YXIgYSA9IDA7XG4gICAgICAgKiAoZnVuY3Rpb24oKSB7XG4gICAgICAgKiAgIChmdW5jdGlvbigpIHtcbiAgICAgICAqICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgKiAgICAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZTtcbiAgICAgICAqICAgICAgIHdoaWxlIChjb3VudC0tKSB7XG4gICAgICAgKiAgICAgICAgIGEgKz0gMTtcbiAgICAgICAqICAgICAgIH1cbiAgICAgICAqICAgICAgIHZhciBlbmQgPSBuZXcgRGF0ZSAtIHN0YXJ0O1xuICAgICAgICogICAgIH0oKSlcbiAgICAgICAqICAgfSgpKVxuICAgICAgICogfSgpKVxuICAgICAgICovXG4gICAgICAnc2V0dXAnOiBfLm5vb3AsXG5cbiAgICAgIC8qKlxuICAgICAgICogQ29tcGlsZWQgaW50byB0aGUgdGVzdCBhbmQgZXhlY3V0ZWQgaW1tZWRpYXRlbHkgKiphZnRlcioqIHRoZSB0ZXN0IGxvb3AuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUge0Z1bmN0aW9ufHN0cmluZ31cbiAgICAgICAqL1xuICAgICAgJ3RlYXJkb3duJzogXy5ub29wLFxuXG4gICAgICAvKipcbiAgICAgICAqIEFuIG9iamVjdCBvZiBzdGF0cyBpbmNsdWRpbmcgbWVhbiwgbWFyZ2luIG9yIGVycm9yLCBhbmQgc3RhbmRhcmQgZGV2aWF0aW9uLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnc3RhdHMnOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBtYXJnaW4gb2YgZXJyb3IuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnbW9lJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHJlbGF0aXZlIG1hcmdpbiBvZiBlcnJvciAoZXhwcmVzc2VkIGFzIGEgcGVyY2VudGFnZSBvZiB0aGUgbWVhbikuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAncm1lJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHN0YW5kYXJkIGVycm9yIG9mIHRoZSBtZWFuLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ3NlbSc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ2RldmlhdGlvbic6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzYW1wbGUgYXJpdGhtZXRpYyBtZWFuIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdtZWFuJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGFycmF5IG9mIHNhbXBsZWQgcGVyaW9kcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBBcnJheVxuICAgICAgICAgKi9cbiAgICAgICAgJ3NhbXBsZSc6IFtdLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2FtcGxlIHZhcmlhbmNlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ3ZhcmlhbmNlJzogMFxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBbiBvYmplY3Qgb2YgdGltaW5nIGRhdGEgaW5jbHVkaW5nIGN5Y2xlLCBlbGFwc2VkLCBwZXJpb2QsIHN0YXJ0LCBhbmQgc3RvcC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ3RpbWVzJzoge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGltZSB0YWtlbiB0byBjb21wbGV0ZSB0aGUgbGFzdCBjeWNsZSAoc2VjcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjdGltZXNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnY3ljbGUnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGltZSB0YWtlbiB0byBjb21wbGV0ZSB0aGUgYmVuY2htYXJrIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayN0aW1lc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdlbGFwc2VkJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHRpbWUgdGFrZW4gdG8gZXhlY3V0ZSB0aGUgdGVzdCBvbmNlIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayN0aW1lc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdwZXJpb2QnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIHRpbWVzdGFtcCBvZiB3aGVuIHRoZSBiZW5jaG1hcmsgc3RhcnRlZCAobXMpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3RpbWVzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ3RpbWVTdGFtcCc6IDBcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIF8uYXNzaWduKEJlbmNobWFyay5wcm90b3R5cGUsIHtcbiAgICAgICdhYm9ydCc6IGFib3J0LFxuICAgICAgJ2Nsb25lJzogY2xvbmUsXG4gICAgICAnY29tcGFyZSc6IGNvbXBhcmUsXG4gICAgICAnZW1pdCc6IGVtaXQsXG4gICAgICAnbGlzdGVuZXJzJzogbGlzdGVuZXJzLFxuICAgICAgJ29mZic6IG9mZixcbiAgICAgICdvbic6IG9uLFxuICAgICAgJ3Jlc2V0JzogcmVzZXQsXG4gICAgICAncnVuJzogcnVuLFxuICAgICAgJ3RvU3RyaW5nJzogdG9TdHJpbmdCZW5jaFxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgXy5hc3NpZ24oRGVmZXJyZWQucHJvdG90eXBlLCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGRlZmVycmVkIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkRlZmVycmVkXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ2JlbmNobWFyayc6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG51bWJlciBvZiBkZWZlcnJlZCBjeWNsZXMgcGVyZm9ybWVkIHdoaWxlIGJlbmNobWFya2luZy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkRlZmVycmVkXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2N5Y2xlcyc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIHRpbWUgdGFrZW4gdG8gY29tcGxldGUgdGhlIGRlZmVycmVkIGJlbmNobWFyayAoc2VjcykuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5EZWZlcnJlZFxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICdlbGFwc2VkJzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBBIHRpbWVzdGFtcCBvZiB3aGVuIHRoZSBkZWZlcnJlZCBiZW5jaG1hcmsgc3RhcnRlZCAobXMpLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAndGltZVN0YW1wJzogMFxuICAgIH0pO1xuXG4gICAgXy5hc3NpZ24oRGVmZXJyZWQucHJvdG90eXBlLCB7XG4gICAgICAncmVzb2x2ZSc6IHJlc29sdmVcbiAgICB9KTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIF8uYXNzaWduKEV2ZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgZW1pdHRlcnMgbGlzdGVuZXIgaXRlcmF0aW9uIGlzIGFib3J0ZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAnYWJvcnRlZCc6IGZhbHNlLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgZGVmYXVsdCBhY3Rpb24gaXMgY2FuY2VsbGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgJ2NhbmNlbGxlZCc6IGZhbHNlLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBvYmplY3Qgd2hvc2UgbGlzdGVuZXJzIGFyZSBjdXJyZW50bHkgYmVpbmcgcHJvY2Vzc2VkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnY3VycmVudFRhcmdldCc6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBsYXN0IGV4ZWN1dGVkIGxpc3RlbmVyLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIE1peGVkXG4gICAgICAgKi9cbiAgICAgICdyZXN1bHQnOiB1bmRlZmluZWQsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG9iamVjdCB0byB3aGljaCB0aGUgZXZlbnQgd2FzIG9yaWdpbmFsbHkgZW1pdHRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ3RhcmdldCc6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBBIHRpbWVzdGFtcCBvZiB3aGVuIHRoZSBldmVudCB3YXMgY3JlYXRlZCAobXMpLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAndGltZVN0YW1wJzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZXZlbnQgdHlwZS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAqL1xuICAgICAgJ3R5cGUnOiAnJ1xuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgb3B0aW9ucyBjb3BpZWQgYnkgc3VpdGUgaW5zdGFuY2VzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICBTdWl0ZS5vcHRpb25zID0ge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBzdWl0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlLm9wdGlvbnNcbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICovXG4gICAgICAnbmFtZSc6IHVuZGVmaW5lZFxuICAgIH07XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBfLmFzc2lnbihTdWl0ZS5wcm90b3R5cGUsIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGJlbmNobWFya3MgaW4gdGhlIHN1aXRlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnbGVuZ3RoJzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIHN1aXRlIGlzIGFib3J0ZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAnYWJvcnRlZCc6IGZhbHNlLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgc3VpdGUgaXMgcnVubmluZy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdydW5uaW5nJzogZmFsc2VcbiAgICB9KTtcblxuICAgIF8uYXNzaWduKFN1aXRlLnByb3RvdHlwZSwge1xuICAgICAgJ2Fib3J0JzogYWJvcnRTdWl0ZSxcbiAgICAgICdhZGQnOiBhZGQsXG4gICAgICAnY2xvbmUnOiBjbG9uZVN1aXRlLFxuICAgICAgJ2VtaXQnOiBlbWl0LFxuICAgICAgJ2ZpbHRlcic6IGZpbHRlclN1aXRlLFxuICAgICAgJ2pvaW4nOiBhcnJheVJlZi5qb2luLFxuICAgICAgJ2xpc3RlbmVycyc6IGxpc3RlbmVycyxcbiAgICAgICdvZmYnOiBvZmYsXG4gICAgICAnb24nOiBvbixcbiAgICAgICdwb3AnOiBhcnJheVJlZi5wb3AsXG4gICAgICAncHVzaCc6IHB1c2gsXG4gICAgICAncmVzZXQnOiByZXNldFN1aXRlLFxuICAgICAgJ3J1bic6IHJ1blN1aXRlLFxuICAgICAgJ3JldmVyc2UnOiBhcnJheVJlZi5yZXZlcnNlLFxuICAgICAgJ3NoaWZ0Jzogc2hpZnQsXG4gICAgICAnc2xpY2UnOiBzbGljZSxcbiAgICAgICdzb3J0JzogYXJyYXlSZWYuc29ydCxcbiAgICAgICdzcGxpY2UnOiBhcnJheVJlZi5zcGxpY2UsXG4gICAgICAndW5zaGlmdCc6IHVuc2hpZnRcbiAgICB9KTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIEV4cG9zZSBEZWZlcnJlZCwgRXZlbnQsIGFuZCBTdWl0ZS5cbiAgICBfLmFzc2lnbihCZW5jaG1hcmssIHtcbiAgICAgICdEZWZlcnJlZCc6IERlZmVycmVkLFxuICAgICAgJ0V2ZW50JzogRXZlbnQsXG4gICAgICAnU3VpdGUnOiBTdWl0ZVxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gQWRkIGxvZGFzaCBtZXRob2RzIGFzIFN1aXRlIG1ldGhvZHMuXG4gICAgXy5lYWNoKFsnZWFjaCcsICdmb3JFYWNoJywgJ2luZGV4T2YnLCAnbWFwJywgJ3JlZHVjZSddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbWV0aG9kTmFtZV07XG4gICAgICBTdWl0ZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpc107XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoXywgYXJncyk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gQXZvaWQgYXJyYXktbGlrZSBvYmplY3QgYnVncyB3aXRoIGBBcnJheSNzaGlmdGAgYW5kIGBBcnJheSNzcGxpY2VgXG4gICAgLy8gaW4gRmlyZWZveCA8IDEwIGFuZCBJRSA8IDkuXG4gICAgXy5lYWNoKFsncG9wJywgJ3NoaWZ0JywgJ3NwbGljZSddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IGFycmF5UmVmW21ldGhvZE5hbWVdO1xuXG4gICAgICBTdWl0ZS5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcyxcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIGRlbGV0ZSB2YWx1ZVswXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIEF2b2lkIGJ1Z2d5IGBBcnJheSN1bnNoaWZ0YCBpbiBJRSA8IDggd2hpY2ggZG9lc24ndCByZXR1cm4gdGhlIG5ld1xuICAgIC8vIGxlbmd0aCBvZiB0aGUgYXJyYXkuXG4gICAgU3VpdGUucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXM7XG4gICAgICB1bnNoaWZ0LmFwcGx5KHZhbHVlLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHZhbHVlLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEJlbmNobWFyaztcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIEV4cG9ydCBCZW5jaG1hcmsuXG4gIC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIERlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlIGFsaWFzZWQuXG4gICAgZGVmaW5lKFsnbG9kYXNoJywgJ3BsYXRmb3JtJ10sIGZ1bmN0aW9uKF8sIHBsYXRmb3JtKSB7XG4gICAgICByZXR1cm4gcnVuSW5Db250ZXh0KHtcbiAgICAgICAgJ18nOiBfLFxuICAgICAgICAncGxhdGZvcm0nOiBwbGF0Zm9ybVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIEJlbmNobWFyayA9IHJ1bkluQ29udGV4dCgpO1xuXG4gICAgLy8gQ2hlY2sgZm9yIGBleHBvcnRzYCBhZnRlciBgZGVmaW5lYCBpbiBjYXNlIGEgYnVpbGQgb3B0aW1pemVyIGFkZHMgYW4gYGV4cG9ydHNgIG9iamVjdC5cbiAgICBpZiAoZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSkge1xuICAgICAgLy8gRXhwb3J0IGZvciBOb2RlLmpzLlxuICAgICAgaWYgKG1vZHVsZUV4cG9ydHMpIHtcbiAgICAgICAgKGZyZWVNb2R1bGUuZXhwb3J0cyA9IEJlbmNobWFyaykuQmVuY2htYXJrID0gQmVuY2htYXJrO1xuICAgICAgfVxuICAgICAgLy8gRXhwb3J0IGZvciBDb21tb25KUyBzdXBwb3J0LlxuICAgICAgZnJlZUV4cG9ydHMuQmVuY2htYXJrID0gQmVuY2htYXJrO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIEV4cG9ydCB0byB0aGUgZ2xvYmFsIG9iamVjdC5cbiAgICAgIHJvb3QuQmVuY2htYXJrID0gQmVuY2htYXJrO1xuICAgIH1cbiAgfVxufS5jYWxsKHRoaXMpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9iZW5jaG1hcmsvYmVuY2htYXJrLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIFBsYXRmb3JtLmpzIHYxLjMuMSA8aHR0cDovL210aHMuYmUvcGxhdGZvcm0+XG4gKiBDb3B5cmlnaHQgMjAxNC0yMDE2IEJlbmphbWluIFRhbiA8aHR0cHM6Ly9kMTAuZ2l0aHViLmlvLz5cbiAqIENvcHlyaWdodCAyMDExLTIwMTMgSm9obi1EYXZpZCBEYWx0b24gPGh0dHA6Ly9hbGx5b3VjYW5sZWV0LmNvbS8+XG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9tdGhzLmJlL21pdD5cbiAqL1xuOyhmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIGBPYmplY3RgICovXG4gIHZhciBvYmplY3RUeXBlcyA9IHtcbiAgICAnZnVuY3Rpb24nOiB0cnVlLFxuICAgICdvYmplY3QnOiB0cnVlXG4gIH07XG5cbiAgLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QgKi9cbiAgdmFyIHJvb3QgPSAob2JqZWN0VHlwZXNbdHlwZW9mIHdpbmRvd10gJiYgd2luZG93KSB8fCB0aGlzO1xuXG4gIC8qKiBCYWNrdXAgcG9zc2libGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgb2xkUm9vdCA9IHJvb3Q7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYCAqL1xuICB2YXIgZnJlZUV4cG9ydHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cztcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAgKi9cbiAgdmFyIGZyZWVNb2R1bGUgPSBvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcyBvciBCcm93c2VyaWZpZWQgY29kZSBhbmQgdXNlIGl0IGFzIGByb290YCAqL1xuICB2YXIgZnJlZUdsb2JhbCA9IGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUgJiYgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLnNlbGYgPT09IGZyZWVHbG9iYWwpKSB7XG4gICAgcm9vdCA9IGZyZWVHbG9iYWw7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBhcyB0aGUgbWF4aW11bSBsZW5ndGggb2YgYW4gYXJyYXktbGlrZSBvYmplY3QuXG4gICAqIFNlZSB0aGUgW0VTNiBzcGVjXShodHRwOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aClcbiAgICogZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIHZhciBtYXhTYWZlSW50ZWdlciA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbiAgLyoqIE9wZXJhIHJlZ2V4cCAqL1xuICB2YXIgcmVPcGVyYSA9IC9cXGJPcGVyYS87XG5cbiAgLyoqIFBvc3NpYmxlIGdsb2JhbCBvYmplY3QgKi9cbiAgdmFyIHRoaXNCaW5kaW5nID0gdGhpcztcblxuICAvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzICovXG4gIHZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbiAgLyoqIFVzZWQgdG8gY2hlY2sgZm9yIG93biBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCAqL1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvKiogVXNlZCB0byByZXNvbHZlIHRoZSBpbnRlcm5hbCBgW1tDbGFzc11dYCBvZiB2YWx1ZXMgKi9cbiAgdmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENhcGl0YWxpemVzIGEgc3RyaW5nIHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY2FwaXRhbGl6ZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGNhcGl0YWxpemVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gU3RyaW5nKHN0cmluZyk7XG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHV0aWxpdHkgZnVuY3Rpb24gdG8gY2xlYW4gdXAgdGhlIE9TIG5hbWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcyBUaGUgT1MgbmFtZSB0byBjbGVhbiB1cC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtwYXR0ZXJuXSBBIGBSZWdFeHBgIHBhdHRlcm4gbWF0Y2hpbmcgdGhlIE9TIG5hbWUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbGFiZWxdIEEgbGFiZWwgZm9yIHRoZSBPUy5cbiAgICovXG4gIGZ1bmN0aW9uIGNsZWFudXBPUyhvcywgcGF0dGVybiwgbGFiZWwpIHtcbiAgICAvLyBwbGF0Zm9ybSB0b2tlbnMgZGVmaW5lZCBhdFxuICAgIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNzUwMyhWUy44NSkuYXNweFxuICAgIC8vIGh0dHA6Ly93ZWIuYXJjaGl2ZS5vcmcvd2ViLzIwMDgxMTIyMDUzOTUwL2h0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNzUwMyhWUy44NSkuYXNweFxuICAgIHZhciBkYXRhID0ge1xuICAgICAgJzYuNCc6ICAnMTAnLFxuICAgICAgJzYuMyc6ICAnOC4xJyxcbiAgICAgICc2LjInOiAgJzgnLFxuICAgICAgJzYuMSc6ICAnU2VydmVyIDIwMDggUjIgLyA3JyxcbiAgICAgICc2LjAnOiAgJ1NlcnZlciAyMDA4IC8gVmlzdGEnLFxuICAgICAgJzUuMic6ICAnU2VydmVyIDIwMDMgLyBYUCA2NC1iaXQnLFxuICAgICAgJzUuMSc6ICAnWFAnLFxuICAgICAgJzUuMDEnOiAnMjAwMCBTUDEnLFxuICAgICAgJzUuMCc6ICAnMjAwMCcsXG4gICAgICAnNC4wJzogICdOVCcsXG4gICAgICAnNC45MCc6ICdNRSdcbiAgICB9O1xuICAgIC8vIGRldGVjdCBXaW5kb3dzIHZlcnNpb24gZnJvbSBwbGF0Zm9ybSB0b2tlbnNcbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCAmJiAvXldpbi9pLnRlc3Qob3MpICYmXG4gICAgICAgIChkYXRhID0gZGF0YVswLypPcGVyYSA5LjI1IGZpeCovLCAvW1xcZC5dKyQvLmV4ZWMob3MpXSkpIHtcbiAgICAgIG9zID0gJ1dpbmRvd3MgJyArIGRhdGE7XG4gICAgfVxuICAgIC8vIGNvcnJlY3QgY2hhcmFjdGVyIGNhc2UgYW5kIGNsZWFudXBcbiAgICBvcyA9IFN0cmluZyhvcyk7XG5cbiAgICBpZiAocGF0dGVybiAmJiBsYWJlbCkge1xuICAgICAgb3MgPSBvcy5yZXBsYWNlKFJlZ0V4cChwYXR0ZXJuLCAnaScpLCBsYWJlbCk7XG4gICAgfVxuXG4gICAgb3MgPSBmb3JtYXQoXG4gICAgICBvcy5yZXBsYWNlKC8gY2UkL2ksICcgQ0UnKVxuICAgICAgICAucmVwbGFjZSgvXFxiaHB3L2ksICd3ZWInKVxuICAgICAgICAucmVwbGFjZSgvXFxiTWFjaW50b3NoXFxiLywgJ01hYyBPUycpXG4gICAgICAgIC5yZXBsYWNlKC9fUG93ZXJQQ1xcYi9pLCAnIE9TJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYihPUyBYKSBbXiBcXGRdKy9pLCAnJDEnKVxuICAgICAgICAucmVwbGFjZSgvXFxiTWFjIChPUyBYKVxcYi8sICckMScpXG4gICAgICAgIC5yZXBsYWNlKC9cXC8oXFxkKS8sICcgJDEnKVxuICAgICAgICAucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgICAgIC5yZXBsYWNlKC8oPzogQmVQQ3xbIC5dKmZjWyBcXGQuXSspJC9pLCAnJylcbiAgICAgICAgLnJlcGxhY2UoL1xcYng4NlxcLjY0XFxiL2dpLCAneDg2XzY0JylcbiAgICAgICAgLnJlcGxhY2UoL1xcYihXaW5kb3dzIFBob25lKSBPU1xcYi8sICckMScpXG4gICAgICAgIC5zcGxpdCgnIG9uICcpWzBdXG4gICAgKTtcblxuICAgIHJldHVybiBvcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBpdGVyYXRpb24gdXRpbGl0eSBmb3IgYXJyYXlzIGFuZCBvYmplY3RzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqL1xuICBmdW5jdGlvbiBlYWNoKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gb2JqZWN0ID8gb2JqZWN0Lmxlbmd0aCA6IDA7XG5cbiAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPiAtMSAmJiBsZW5ndGggPD0gbWF4U2FmZUludGVnZXIpIHtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iamVjdFtpbmRleF0sIGluZGV4LCBvYmplY3QpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3JPd24ob2JqZWN0LCBjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaW0gYW5kIGNvbmRpdGlvbmFsbHkgY2FwaXRhbGl6ZSBzdHJpbmcgdmFsdWVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gZm9ybWF0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGZvcm1hdChzdHJpbmcpIHtcbiAgICBzdHJpbmcgPSB0cmltKHN0cmluZyk7XG4gICAgcmV0dXJuIC9eKD86d2ViT1N8aSg/Ok9TfFApKS8udGVzdChzdHJpbmcpXG4gICAgICA/IHN0cmluZ1xuICAgICAgOiBjYXBpdGFsaXplKHN0cmluZyk7XG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciBhbiBvYmplY3QncyBvd24gcHJvcGVydGllcywgZXhlY3V0aW5nIHRoZSBgY2FsbGJhY2tgIGZvciBlYWNoLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gZXhlY3V0ZWQgcGVyIG93biBwcm9wZXJ0eS5cbiAgICovXG4gIGZ1bmN0aW9uIGZvck93bihvYmplY3QsIGNhbGxiYWNrKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgIGNhbGxiYWNrKG9iamVjdFtrZXldLCBrZXksIG9iamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIGEgdmFsdWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYFtbQ2xhc3NdXWAuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRDbGFzc09mKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGxcbiAgICAgID8gY2FwaXRhbGl6ZSh2YWx1ZSlcbiAgICAgIDogdG9TdHJpbmcuY2FsbCh2YWx1ZSkuc2xpY2UoOCwgLTEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhvc3Qgb2JqZWN0cyBjYW4gcmV0dXJuIHR5cGUgdmFsdWVzIHRoYXQgYXJlIGRpZmZlcmVudCBmcm9tIHRoZWlyIGFjdHVhbFxuICAgKiBkYXRhIHR5cGUuIFRoZSBvYmplY3RzIHdlIGFyZSBjb25jZXJuZWQgd2l0aCB1c3VhbGx5IHJldHVybiBub24tcHJpbWl0aXZlXG4gICAqIHR5cGVzIG9mIFwib2JqZWN0XCIsIFwiZnVuY3Rpb25cIiwgb3IgXCJ1bmtub3duXCIuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBvd25lciBvZiB0aGUgcHJvcGVydHkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgcHJvcGVydHkgdmFsdWUgaXMgYSBub24tcHJpbWl0aXZlLCBlbHNlIGBmYWxzZWAuXG4gICAqL1xuICBmdW5jdGlvbiBpc0hvc3RUeXBlKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICB2YXIgdHlwZSA9IG9iamVjdCAhPSBudWxsID8gdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV0gOiAnbnVtYmVyJztcbiAgICByZXR1cm4gIS9eKD86Ym9vbGVhbnxudW1iZXJ8c3RyaW5nfHVuZGVmaW5lZCkkLy50ZXN0KHR5cGUpICYmXG4gICAgICAodHlwZSA9PSAnb2JqZWN0JyA/ICEhb2JqZWN0W3Byb3BlcnR5XSA6IHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXBhcmVzIGEgc3RyaW5nIGZvciB1c2UgaW4gYSBgUmVnRXhwYCBieSBtYWtpbmcgaHlwaGVucyBhbmQgc3BhY2VzIG9wdGlvbmFsLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gcXVhbGlmeS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHF1YWxpZmllZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiBxdWFsaWZ5KHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC8oWyAtXSkoPyEkKS9nLCAnJDE/Jyk7XG4gIH1cblxuICAvKipcbiAgICogQSBiYXJlLWJvbmVzIGBBcnJheSNyZWR1Y2VgIGxpa2UgdXRpbGl0eSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgKiBAcmV0dXJucyB7Kn0gVGhlIGFjY3VtdWxhdGVkIHJlc3VsdC5cbiAgICovXG4gIGZ1bmN0aW9uIHJlZHVjZShhcnJheSwgY2FsbGJhY2spIHtcbiAgICB2YXIgYWNjdW11bGF0b3IgPSBudWxsO1xuICAgIGVhY2goYXJyYXksIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgYWNjdW11bGF0b3IgPSBjYWxsYmFjayhhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBhcnJheSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZSBmcm9tIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIHRyaW1tZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gdHJpbShzdHJpbmcpIHtcbiAgICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZSgvXiArfCArJC9nLCAnJyk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBwbGF0Zm9ybSBvYmplY3QuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IFt1YT1uYXZpZ2F0b3IudXNlckFnZW50XSBUaGUgdXNlciBhZ2VudCBzdHJpbmcgb3JcbiAgICogIGNvbnRleHQgb2JqZWN0LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBBIHBsYXRmb3JtIG9iamVjdC5cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlKHVhKSB7XG5cbiAgICAvKiogVGhlIGVudmlyb25tZW50IGNvbnRleHQgb2JqZWN0ICovXG4gICAgdmFyIGNvbnRleHQgPSByb290O1xuXG4gICAgLyoqIFVzZWQgdG8gZmxhZyB3aGVuIGEgY3VzdG9tIGNvbnRleHQgaXMgcHJvdmlkZWQgKi9cbiAgICB2YXIgaXNDdXN0b21Db250ZXh0ID0gdWEgJiYgdHlwZW9mIHVhID09ICdvYmplY3QnICYmIGdldENsYXNzT2YodWEpICE9ICdTdHJpbmcnO1xuXG4gICAgLy8ganVnZ2xlIGFyZ3VtZW50c1xuICAgIGlmIChpc0N1c3RvbUNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQgPSB1YTtcbiAgICAgIHVhID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiogQnJvd3NlciBuYXZpZ2F0b3Igb2JqZWN0ICovXG4gICAgdmFyIG5hdiA9IGNvbnRleHQubmF2aWdhdG9yIHx8IHt9O1xuXG4gICAgLyoqIEJyb3dzZXIgdXNlciBhZ2VudCBzdHJpbmcgKi9cbiAgICB2YXIgdXNlckFnZW50ID0gbmF2LnVzZXJBZ2VudCB8fCAnJztcblxuICAgIHVhIHx8ICh1YSA9IHVzZXJBZ2VudCk7XG5cbiAgICAvKiogVXNlZCB0byBmbGFnIHdoZW4gYHRoaXNCaW5kaW5nYCBpcyB0aGUgW01vZHVsZVNjb3BlXSAqL1xuICAgIHZhciBpc01vZHVsZVNjb3BlID0gaXNDdXN0b21Db250ZXh0IHx8IHRoaXNCaW5kaW5nID09IG9sZFJvb3Q7XG5cbiAgICAvKiogVXNlZCB0byBkZXRlY3QgaWYgYnJvd3NlciBpcyBsaWtlIENocm9tZSAqL1xuICAgIHZhciBsaWtlQ2hyb21lID0gaXNDdXN0b21Db250ZXh0XG4gICAgICA/ICEhbmF2Lmxpa2VDaHJvbWVcbiAgICAgIDogL1xcYkNocm9tZVxcYi8udGVzdCh1YSkgJiYgIS9pbnRlcm5hbHxcXG4vaS50ZXN0KHRvU3RyaW5nLnRvU3RyaW5nKCkpO1xuXG4gICAgLyoqIEludGVybmFsIGBbW0NsYXNzXV1gIHZhbHVlIHNob3J0Y3V0cyAqL1xuICAgIHZhciBvYmplY3RDbGFzcyA9ICdPYmplY3QnLFxuICAgICAgICBhaXJSdW50aW1lQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdTY3JpcHRCcmlkZ2luZ1Byb3h5T2JqZWN0JyxcbiAgICAgICAgZW52aXJvQ2xhc3MgPSBpc0N1c3RvbUNvbnRleHQgPyBvYmplY3RDbGFzcyA6ICdFbnZpcm9ubWVudCcsXG4gICAgICAgIGphdmFDbGFzcyA9IChpc0N1c3RvbUNvbnRleHQgJiYgY29udGV4dC5qYXZhKSA/ICdKYXZhUGFja2FnZScgOiBnZXRDbGFzc09mKGNvbnRleHQuamF2YSksXG4gICAgICAgIHBoYW50b21DbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ1J1bnRpbWVPYmplY3QnO1xuXG4gICAgLyoqIERldGVjdCBKYXZhIGVudmlyb25tZW50ICovXG4gICAgdmFyIGphdmEgPSAvXFxiSmF2YS8udGVzdChqYXZhQ2xhc3MpICYmIGNvbnRleHQuamF2YTtcblxuICAgIC8qKiBEZXRlY3QgUmhpbm8gKi9cbiAgICB2YXIgcmhpbm8gPSBqYXZhICYmIGdldENsYXNzT2YoY29udGV4dC5lbnZpcm9ubWVudCkgPT0gZW52aXJvQ2xhc3M7XG5cbiAgICAvKiogQSBjaGFyYWN0ZXIgdG8gcmVwcmVzZW50IGFscGhhICovXG4gICAgdmFyIGFscGhhID0gamF2YSA/ICdhJyA6ICdcXHUwM2IxJztcblxuICAgIC8qKiBBIGNoYXJhY3RlciB0byByZXByZXNlbnQgYmV0YSAqL1xuICAgIHZhciBiZXRhID0gamF2YSA/ICdiJyA6ICdcXHUwM2IyJztcblxuICAgIC8qKiBCcm93c2VyIGRvY3VtZW50IG9iamVjdCAqL1xuICAgIHZhciBkb2MgPSBjb250ZXh0LmRvY3VtZW50IHx8IHt9O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IE9wZXJhIGJyb3dzZXIgKFByZXN0by1iYXNlZClcbiAgICAgKiBodHRwOi8vd3d3Lmhvd3RvY3JlYXRlLmNvLnVrL29wZXJhU3R1ZmYvb3BlcmFPYmplY3QuaHRtbFxuICAgICAqIGh0dHA6Ly9kZXYub3BlcmEuY29tL2FydGljbGVzL3ZpZXcvb3BlcmEtbWluaS13ZWItY29udGVudC1hdXRob3JpbmctZ3VpZGVsaW5lcy8jb3BlcmFtaW5pXG4gICAgICovXG4gICAgdmFyIG9wZXJhID0gY29udGV4dC5vcGVyYW1pbmkgfHwgY29udGV4dC5vcGVyYTtcblxuICAgIC8qKiBPcGVyYSBgW1tDbGFzc11dYCAqL1xuICAgIHZhciBvcGVyYUNsYXNzID0gcmVPcGVyYS50ZXN0KG9wZXJhQ2xhc3MgPSAoaXNDdXN0b21Db250ZXh0ICYmIG9wZXJhKSA/IG9wZXJhWydbW0NsYXNzXV0nXSA6IGdldENsYXNzT2Yob3BlcmEpKVxuICAgICAgPyBvcGVyYUNsYXNzXG4gICAgICA6IChvcGVyYSA9IG51bGwpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqIFRlbXBvcmFyeSB2YXJpYWJsZSB1c2VkIG92ZXIgdGhlIHNjcmlwdCdzIGxpZmV0aW1lICovXG4gICAgdmFyIGRhdGE7XG5cbiAgICAvKiogVGhlIENQVSBhcmNoaXRlY3R1cmUgKi9cbiAgICB2YXIgYXJjaCA9IHVhO1xuXG4gICAgLyoqIFBsYXRmb3JtIGRlc2NyaXB0aW9uIGFycmF5ICovXG4gICAgdmFyIGRlc2NyaXB0aW9uID0gW107XG5cbiAgICAvKiogUGxhdGZvcm0gYWxwaGEvYmV0YSBpbmRpY2F0b3IgKi9cbiAgICB2YXIgcHJlcmVsZWFzZSA9IG51bGw7XG5cbiAgICAvKiogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgZW52aXJvbm1lbnQgZmVhdHVyZXMgc2hvdWxkIGJlIHVzZWQgdG8gcmVzb2x2ZSB0aGUgcGxhdGZvcm0gKi9cbiAgICB2YXIgdXNlRmVhdHVyZXMgPSB1YSA9PSB1c2VyQWdlbnQ7XG5cbiAgICAvKiogVGhlIGJyb3dzZXIvZW52aXJvbm1lbnQgdmVyc2lvbiAqL1xuICAgIHZhciB2ZXJzaW9uID0gdXNlRmVhdHVyZXMgJiYgb3BlcmEgJiYgdHlwZW9mIG9wZXJhLnZlcnNpb24gPT0gJ2Z1bmN0aW9uJyAmJiBvcGVyYS52ZXJzaW9uKCk7XG5cbiAgICAvKiogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBPUyBlbmRzIHdpdGggXCIvIFZlcnNpb25cIiAqL1xuICAgIHZhciBpc1NwZWNpYWxDYXNlZE9TO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBsYXlvdXQgZW5naW5lcyAob3JkZXIgaXMgaW1wb3J0YW50KSAqL1xuICAgIHZhciBsYXlvdXQgPSBnZXRMYXlvdXQoW1xuICAgICAgJ1RyaWRlbnQnLFxuICAgICAgeyAnbGFiZWwnOiAnV2ViS2l0JywgJ3BhdHRlcm4nOiAnQXBwbGVXZWJLaXQnIH0sXG4gICAgICAnaUNhYicsXG4gICAgICAnUHJlc3RvJyxcbiAgICAgICdOZXRGcm9udCcsXG4gICAgICAnVGFzbWFuJyxcbiAgICAgICdLSFRNTCcsXG4gICAgICAnR2Vja28nXG4gICAgXSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIGJyb3dzZXIgbmFtZXMgKG9yZGVyIGlzIGltcG9ydGFudCkgKi9cbiAgICB2YXIgbmFtZSA9IGdldE5hbWUoW1xuICAgICAgJ0Fkb2JlIEFJUicsXG4gICAgICAnQXJvcmEnLFxuICAgICAgJ0F2YW50IEJyb3dzZXInLFxuICAgICAgJ0JyZWFjaCcsXG4gICAgICAnQ2FtaW5vJyxcbiAgICAgICdFcGlwaGFueScsXG4gICAgICAnRmVubmVjJyxcbiAgICAgICdGbG9jaycsXG4gICAgICAnR2FsZW9uJyxcbiAgICAgICdHcmVlbkJyb3dzZXInLFxuICAgICAgJ2lDYWInLFxuICAgICAgJ0ljZXdlYXNlbCcsXG4gICAgICB7ICdsYWJlbCc6ICdTUldhcmUgSXJvbicsICdwYXR0ZXJuJzogJ0lyb24nIH0sXG4gICAgICAnSy1NZWxlb24nLFxuICAgICAgJ0tvbnF1ZXJvcicsXG4gICAgICAnTHVuYXNjYXBlJyxcbiAgICAgICdNYXh0aG9uJyxcbiAgICAgICdNaWRvcmknLFxuICAgICAgJ05vb2sgQnJvd3NlcicsXG4gICAgICAnUGhhbnRvbUpTJyxcbiAgICAgICdSYXZlbicsXG4gICAgICAnUmVrb25xJyxcbiAgICAgICdSb2NrTWVsdCcsXG4gICAgICAnU2VhTW9ua2V5JyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NpbGsnLCAncGF0dGVybic6ICcoPzpDbG91ZDl8U2lsay1BY2NlbGVyYXRlZCknIH0sXG4gICAgICAnU2xlaXBuaXInLFxuICAgICAgJ1NsaW1Ccm93c2VyJyxcbiAgICAgICdTdW5yaXNlJyxcbiAgICAgICdTd2lmdGZveCcsXG4gICAgICAnV2ViUG9zaXRpdmUnLFxuICAgICAgJ09wZXJhIE1pbmknLFxuICAgICAgeyAnbGFiZWwnOiAnT3BlcmEgTWluaScsICdwYXR0ZXJuJzogJ09QaU9TJyB9LFxuICAgICAgJ09wZXJhJyxcbiAgICAgIHsgJ2xhYmVsJzogJ09wZXJhJywgJ3BhdHRlcm4nOiAnT1BSJyB9LFxuICAgICAgJ0Nocm9tZScsXG4gICAgICB7ICdsYWJlbCc6ICdDaHJvbWUgTW9iaWxlJywgJ3BhdHRlcm4nOiAnKD86Q3JpT1N8Q3JNbyknIH0sXG4gICAgICB7ICdsYWJlbCc6ICdGaXJlZm94JywgJ3BhdHRlcm4nOiAnKD86RmlyZWZveHxNaW5lZmllbGQpJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnSUUnLCAncGF0dGVybic6ICdJRU1vYmlsZScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0lFJywgJ3BhdHRlcm4nOiAnTVNJRScgfSxcbiAgICAgICdTYWZhcmknXG4gICAgXSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIHByb2R1Y3RzIChvcmRlciBpcyBpbXBvcnRhbnQpICovXG4gICAgdmFyIHByb2R1Y3QgPSBnZXRQcm9kdWN0KFtcbiAgICAgIHsgJ2xhYmVsJzogJ0JsYWNrQmVycnknLCAncGF0dGVybic6ICdCQjEwJyB9LFxuICAgICAgJ0JsYWNrQmVycnknLFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMnLCAncGF0dGVybic6ICdHVC1JOTAwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTMicsICdwYXR0ZXJuJzogJ0dULUk5MTAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMzJywgJ3BhdHRlcm4nOiAnR1QtSTkzMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzQnLCAncGF0dGVybic6ICdHVC1JOTUwMCcgfSxcbiAgICAgICdHb29nbGUgVFYnLFxuICAgICAgJ0x1bWlhJyxcbiAgICAgICdpUGFkJyxcbiAgICAgICdpUG9kJyxcbiAgICAgICdpUGhvbmUnLFxuICAgICAgJ0tpbmRsZScsXG4gICAgICB7ICdsYWJlbCc6ICdLaW5kbGUgRmlyZScsICdwYXR0ZXJuJzogJyg/OkNsb3VkOXxTaWxrLUFjY2VsZXJhdGVkKScgfSxcbiAgICAgICdOb29rJyxcbiAgICAgICdQbGF5Qm9vaycsXG4gICAgICAnUGxheVN0YXRpb24gNCcsXG4gICAgICAnUGxheVN0YXRpb24gMycsXG4gICAgICAnUGxheVN0YXRpb24gVml0YScsXG4gICAgICAnVG91Y2hQYWQnLFxuICAgICAgJ1RyYW5zZm9ybWVyJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1dpaSBVJywgJ3BhdHRlcm4nOiAnV2lpVScgfSxcbiAgICAgICdXaWknLFxuICAgICAgJ1hib3ggT25lJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1hib3ggMzYwJywgJ3BhdHRlcm4nOiAnWGJveCcgfSxcbiAgICAgICdYb29tJ1xuICAgIF0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBtYW51ZmFjdHVyZXJzICovXG4gICAgdmFyIG1hbnVmYWN0dXJlciA9IGdldE1hbnVmYWN0dXJlcih7XG4gICAgICAnQXBwbGUnOiB7ICdpUGFkJzogMSwgJ2lQaG9uZSc6IDEsICdpUG9kJzogMSB9LFxuICAgICAgJ0FtYXpvbic6IHsgJ0tpbmRsZSc6IDEsICdLaW5kbGUgRmlyZSc6IDEgfSxcbiAgICAgICdBc3VzJzogeyAnVHJhbnNmb3JtZXInOiAxIH0sXG4gICAgICAnQmFybmVzICYgTm9ibGUnOiB7ICdOb29rJzogMSB9LFxuICAgICAgJ0JsYWNrQmVycnknOiB7ICdQbGF5Qm9vayc6IDEgfSxcbiAgICAgICdHb29nbGUnOiB7ICdHb29nbGUgVFYnOiAxIH0sXG4gICAgICAnSFAnOiB7ICdUb3VjaFBhZCc6IDEgfSxcbiAgICAgICdIVEMnOiB7fSxcbiAgICAgICdMRyc6IHt9LFxuICAgICAgJ01pY3Jvc29mdCc6IHsgJ1hib3gnOiAxLCAnWGJveCBPbmUnOiAxIH0sXG4gICAgICAnTW90b3JvbGEnOiB7ICdYb29tJzogMSB9LFxuICAgICAgJ05pbnRlbmRvJzogeyAnV2lpIFUnOiAxLCAgJ1dpaSc6IDEgfSxcbiAgICAgICdOb2tpYSc6IHsgJ0x1bWlhJzogMSB9LFxuICAgICAgJ1NhbXN1bmcnOiB7ICdHYWxheHkgUyc6IDEsICdHYWxheHkgUzInOiAxLCAnR2FsYXh5IFMzJzogMSwgJ0dhbGF4eSBTNCc6IDEgfSxcbiAgICAgICdTb255JzogeyAnUGxheVN0YXRpb24gNCc6IDEsICdQbGF5U3RhdGlvbiAzJzogMSwgJ1BsYXlTdGF0aW9uIFZpdGEnOiAxIH1cbiAgICB9KTtcblxuICAgIC8qIERldGVjdGFibGUgT1NlcyAob3JkZXIgaXMgaW1wb3J0YW50KSAqL1xuICAgIHZhciBvcyA9IGdldE9TKFtcbiAgICAgICdXaW5kb3dzIFBob25lICcsXG4gICAgICAnQW5kcm9pZCcsXG4gICAgICAnQ2VudE9TJyxcbiAgICAgICdEZWJpYW4nLFxuICAgICAgJ0ZlZG9yYScsXG4gICAgICAnRnJlZUJTRCcsXG4gICAgICAnR2VudG9vJyxcbiAgICAgICdIYWlrdScsXG4gICAgICAnS3VidW50dScsXG4gICAgICAnTGludXggTWludCcsXG4gICAgICAnUmVkIEhhdCcsXG4gICAgICAnU3VTRScsXG4gICAgICAnVWJ1bnR1JyxcbiAgICAgICdYdWJ1bnR1JyxcbiAgICAgICdDeWd3aW4nLFxuICAgICAgJ1N5bWJpYW4gT1MnLFxuICAgICAgJ2hwd09TJyxcbiAgICAgICd3ZWJPUyAnLFxuICAgICAgJ3dlYk9TJyxcbiAgICAgICdUYWJsZXQgT1MnLFxuICAgICAgJ0xpbnV4JyxcbiAgICAgICdNYWMgT1MgWCcsXG4gICAgICAnTWFjaW50b3NoJyxcbiAgICAgICdNYWMnLFxuICAgICAgJ1dpbmRvd3MgOTg7JyxcbiAgICAgICdXaW5kb3dzICdcbiAgICBdKTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBsYXlvdXQgZW5naW5lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIGxheW91dCBlbmdpbmUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TGF5b3V0KGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IFJlZ0V4cCgnXFxcXGInICsgKFxuICAgICAgICAgIGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcylcbiAgICAgICAgKSArICdcXFxcYicsICdpJykuZXhlYyh1YSkgJiYgKGd1ZXNzLmxhYmVsIHx8IGd1ZXNzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBtYW51ZmFjdHVyZXIgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIG9iamVjdCBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIG1hbnVmYWN0dXJlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRNYW51ZmFjdHVyZXIoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICAgICAgLy8gbG9va3VwIHRoZSBtYW51ZmFjdHVyZXIgYnkgcHJvZHVjdCBvciBzY2FuIHRoZSBVQSBmb3IgdGhlIG1hbnVmYWN0dXJlclxuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChcbiAgICAgICAgICB2YWx1ZVtwcm9kdWN0XSB8fFxuICAgICAgICAgIHZhbHVlWzAvKk9wZXJhIDkuMjUgZml4Ki8sIC9eW2Etel0rKD86ICtbYS16XStcXGIpKi9pLmV4ZWMocHJvZHVjdCldIHx8XG4gICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBxdWFsaWZ5KGtleSkgKyAnKD86XFxcXGJ8XFxcXHcqXFxcXGQpJywgJ2knKS5leGVjKHVhKVxuICAgICAgICApICYmIGtleTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBicm93c2VyIG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgYnJvd3NlciBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE5hbWUoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgUmVnRXhwKCdcXFxcYicgKyAoXG4gICAgICAgICAgZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKVxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIE9TIG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgT1MgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRPUyhndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpO1xuICAgICAgICBpZiAoIXJlc3VsdCAmJiAocmVzdWx0ID1cbiAgICAgICAgICAgICAgUmVnRXhwKCdcXFxcYicgKyBwYXR0ZXJuICsgJyg/Oi9bXFxcXGQuXSt8WyBcXFxcdy5dKiknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgcmVzdWx0ID0gY2xlYW51cE9TKHJlc3VsdCwgcGF0dGVybiwgZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgcHJvZHVjdCBuYW1lIGZyb20gYW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3Vlc3NlcyBBbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqIEByZXR1cm5zIHtudWxsfHN0cmluZ30gVGhlIGRldGVjdGVkIHByb2R1Y3QgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRQcm9kdWN0KGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnICpcXFxcZCtbLlxcXFx3X10qJywgJ2knKS5leGVjKHVhKSB8fFxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnKD86OyAqKD86W2Etel0rW18tXSk/W2Etel0rXFxcXGQrfFteICgpOy1dKiknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICAgICApKSB7XG4gICAgICAgICAgLy8gc3BsaXQgYnkgZm9yd2FyZCBzbGFzaCBhbmQgYXBwZW5kIHByb2R1Y3QgdmVyc2lvbiBpZiBuZWVkZWRcbiAgICAgICAgICBpZiAoKHJlc3VsdCA9IFN0cmluZygoZ3Vlc3MubGFiZWwgJiYgIVJlZ0V4cChwYXR0ZXJuLCAnaScpLnRlc3QoZ3Vlc3MubGFiZWwpKSA/IGd1ZXNzLmxhYmVsIDogcmVzdWx0KS5zcGxpdCgnLycpKVsxXSAmJiAhL1tcXGQuXSsvLnRlc3QocmVzdWx0WzBdKSkge1xuICAgICAgICAgICAgcmVzdWx0WzBdICs9ICcgJyArIHJlc3VsdFsxXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gY29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cFxuICAgICAgICAgIGd1ZXNzID0gZ3Vlc3MubGFiZWwgfHwgZ3Vlc3M7XG4gICAgICAgICAgcmVzdWx0ID0gZm9ybWF0KHJlc3VsdFswXVxuICAgICAgICAgICAgLnJlcGxhY2UoUmVnRXhwKHBhdHRlcm4sICdpJyksIGd1ZXNzKVxuICAgICAgICAgICAgLnJlcGxhY2UoUmVnRXhwKCc7ICooPzonICsgZ3Vlc3MgKyAnW18tXSk/JywgJ2knKSwgJyAnKVxuICAgICAgICAgICAgLnJlcGxhY2UoUmVnRXhwKCcoJyArIGd1ZXNzICsgJylbLV8uXT8oXFxcXHcpJywgJ2knKSwgJyQxICQyJykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlcyB0aGUgdmVyc2lvbiB1c2luZyBhbiBhcnJheSBvZiBVQSBwYXR0ZXJucy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGF0dGVybnMgQW4gYXJyYXkgb2YgVUEgcGF0dGVybnMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgdmVyc2lvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRWZXJzaW9uKHBhdHRlcm5zKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKHBhdHRlcm5zLCBmdW5jdGlvbihyZXN1bHQsIHBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCAoUmVnRXhwKHBhdHRlcm4gK1xuICAgICAgICAgICcoPzotW1xcXFxkLl0rL3woPzogZm9yIFtcXFxcdy1dKyk/WyAvLV0pKFtcXFxcZC5dK1teICgpOy9fLV0qKScsICdpJykuZXhlYyh1YSkgfHwgMClbMV0gfHwgbnVsbDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHBsYXRmb3JtLmRlc2NyaXB0aW9uYCB3aGVuIHRoZSBwbGF0Zm9ybSBvYmplY3QgaXMgY29lcmNlZCB0byBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHRvU3RyaW5nXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyBgcGxhdGZvcm0uZGVzY3JpcHRpb25gIGlmIGF2YWlsYWJsZSwgZWxzZSBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdG9TdHJpbmdQbGF0Zm9ybSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uIHx8ICcnO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIGNvbnZlcnQgbGF5b3V0IHRvIGFuIGFycmF5IHNvIHdlIGNhbiBhZGQgZXh0cmEgZGV0YWlsc1xuICAgIGxheW91dCAmJiAobGF5b3V0ID0gW2xheW91dF0pO1xuXG4gICAgLy8gZGV0ZWN0IHByb2R1Y3QgbmFtZXMgdGhhdCBjb250YWluIHRoZWlyIG1hbnVmYWN0dXJlcidzIG5hbWVcbiAgICBpZiAobWFudWZhY3R1cmVyICYmICFwcm9kdWN0KSB7XG4gICAgICBwcm9kdWN0ID0gZ2V0UHJvZHVjdChbbWFudWZhY3R1cmVyXSk7XG4gICAgfVxuICAgIC8vIGNsZWFuIHVwIEdvb2dsZSBUVlxuICAgIGlmICgoZGF0YSA9IC9cXGJHb29nbGUgVFZcXGIvLmV4ZWMocHJvZHVjdCkpKSB7XG4gICAgICBwcm9kdWN0ID0gZGF0YVswXTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IHNpbXVsYXRvcnNcbiAgICBpZiAoL1xcYlNpbXVsYXRvclxcYi9pLnRlc3QodWEpKSB7XG4gICAgICBwcm9kdWN0ID0gKHByb2R1Y3QgPyBwcm9kdWN0ICsgJyAnIDogJycpICsgJ1NpbXVsYXRvcic7XG4gICAgfVxuICAgIC8vIGRldGVjdCBPcGVyYSBNaW5pIDgrIHJ1bm5pbmcgaW4gVHVyYm8vVW5jb21wcmVzc2VkIG1vZGUgb24gaU9TXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhIE1pbmknICYmIC9cXGJPUGlPU1xcYi8udGVzdCh1YSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ3J1bm5pbmcgaW4gVHVyYm8vVW5jb21wcmVzc2VkIG1vZGUnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IGlPU1xuICAgIGlmICgvXmlQLy50ZXN0KHByb2R1Y3QpKSB7XG4gICAgICBuYW1lIHx8IChuYW1lID0gJ1NhZmFyaScpO1xuICAgICAgb3MgPSAnaU9TJyArICgoZGF0YSA9IC8gT1MgKFtcXGRfXSspL2kuZXhlYyh1YSkpXG4gICAgICAgID8gJyAnICsgZGF0YVsxXS5yZXBsYWNlKC9fL2csICcuJylcbiAgICAgICAgOiAnJyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBLdWJ1bnR1XG4gICAgZWxzZSBpZiAobmFtZSA9PSAnS29ucXVlcm9yJyAmJiAhL2J1bnR1L2kudGVzdChvcykpIHtcbiAgICAgIG9zID0gJ0t1YnVudHUnO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgQW5kcm9pZCBicm93c2Vyc1xuICAgIGVsc2UgaWYgKG1hbnVmYWN0dXJlciAmJiBtYW51ZmFjdHVyZXIgIT0gJ0dvb2dsZScgJiZcbiAgICAgICAgKCgvQ2hyb21lLy50ZXN0KG5hbWUpICYmICEvXFxiTW9iaWxlIFNhZmFyaVxcYi9pLnRlc3QodWEpKSB8fCAvXFxiVml0YVxcYi8udGVzdChwcm9kdWN0KSkpIHtcbiAgICAgIG5hbWUgPSAnQW5kcm9pZCBCcm93c2VyJztcbiAgICAgIG9zID0gL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpID8gb3MgOiAnQW5kcm9pZCc7XG4gICAgfVxuICAgIC8vIGRldGVjdCBmYWxzZSBwb3NpdGl2ZXMgZm9yIEZpcmVmb3gvU2FmYXJpXG4gICAgZWxzZSBpZiAoIW5hbWUgfHwgKGRhdGEgPSAhL1xcYk1pbmVmaWVsZFxcYnxcXChBbmRyb2lkOy9pLnRlc3QodWEpICYmIC9cXGIoPzpGaXJlZm94fFNhZmFyaSlcXGIvLmV4ZWMobmFtZSkpKSB7XG4gICAgICAvLyBlc2NhcGUgdGhlIGAvYCBmb3IgRmlyZWZveCAxXG4gICAgICBpZiAobmFtZSAmJiAhcHJvZHVjdCAmJiAvW1xcLyxdfF5bXihdKz9cXCkvLnRlc3QodWEuc2xpY2UodWEuaW5kZXhPZihkYXRhICsgJy8nKSArIDgpKSkge1xuICAgICAgICAvLyBjbGVhciBuYW1lIG9mIGZhbHNlIHBvc2l0aXZlc1xuICAgICAgICBuYW1lID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIHJlYXNzaWduIGEgZ2VuZXJpYyBuYW1lXG4gICAgICBpZiAoKGRhdGEgPSBwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCBvcykgJiZcbiAgICAgICAgICAocHJvZHVjdCB8fCBtYW51ZmFjdHVyZXIgfHwgL1xcYig/OkFuZHJvaWR8U3ltYmlhbiBPU3xUYWJsZXQgT1N8d2ViT1MpXFxiLy50ZXN0KG9zKSkpIHtcbiAgICAgICAgbmFtZSA9IC9bYS16XSsoPzogSGF0KT8vaS5leGVjKC9cXGJBbmRyb2lkXFxiLy50ZXN0KG9zKSA/IG9zIDogZGF0YSkgKyAnIEJyb3dzZXInO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBkZXRlY3QgRmlyZWZveCBPU1xuICAgIGlmICgoZGF0YSA9IC9cXCgoTW9iaWxlfFRhYmxldCkuKj9GaXJlZm94XFxiL2kuZXhlYyh1YSkpICYmIGRhdGFbMV0pIHtcbiAgICAgIG9zID0gJ0ZpcmVmb3ggT1MnO1xuICAgICAgaWYgKCFwcm9kdWN0KSB7XG4gICAgICAgIHByb2R1Y3QgPSBkYXRhWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBkZXRlY3Qgbm9uLU9wZXJhIHZlcnNpb25zIChvcmRlciBpcyBpbXBvcnRhbnQpXG4gICAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgICB2ZXJzaW9uID0gZ2V0VmVyc2lvbihbXG4gICAgICAgICcoPzpDbG91ZDl8Q3JpT1N8Q3JNb3xJRU1vYmlsZXxJcm9ufE9wZXJhID9NaW5pfE9QaU9TfE9QUnxSYXZlbnxTaWxrKD8hL1tcXFxcZC5dKyQpKScsXG4gICAgICAgICdWZXJzaW9uJyxcbiAgICAgICAgcXVhbGlmeShuYW1lKSxcbiAgICAgICAgJyg/OkZpcmVmb3h8TWluZWZpZWxkfE5ldEZyb250KSdcbiAgICAgIF0pO1xuICAgIH1cbiAgICAvLyBkZXRlY3Qgc3R1YmJvcm4gbGF5b3V0IGVuZ2luZXNcbiAgICBpZiAobGF5b3V0ID09ICdpQ2FiJyAmJiBwYXJzZUZsb2F0KHZlcnNpb24pID4gMykge1xuICAgICAgbGF5b3V0ID0gWydXZWJLaXQnXTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICBsYXlvdXQgIT0gJ1RyaWRlbnQnICYmXG4gICAgICAgIChkYXRhID1cbiAgICAgICAgICAvXFxiT3BlcmFcXGIvLnRlc3QobmFtZSkgJiYgKC9cXGJPUFJcXGIvLnRlc3QodWEpID8gJ0JsaW5rJyA6ICdQcmVzdG8nKSB8fFxuICAgICAgICAgIC9cXGIoPzpNaWRvcml8Tm9va3xTYWZhcmkpXFxiL2kudGVzdCh1YSkgJiYgJ1dlYktpdCcgfHxcbiAgICAgICAgICAhbGF5b3V0ICYmIC9cXGJNU0lFXFxiL2kudGVzdCh1YSkgJiYgKG9zID09ICdNYWMgT1MnID8gJ1Rhc21hbicgOiAnVHJpZGVudCcpXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgIGxheW91dCA9IFtkYXRhXTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IE5ldEZyb250IG9uIFBsYXlTdGF0aW9uXG4gICAgZWxzZSBpZiAoL1xcYlBsYXlTdGF0aW9uXFxiKD8hIFZpdGFcXGIpL2kudGVzdChuYW1lKSAmJiBsYXlvdXQgPT0gJ1dlYktpdCcpIHtcbiAgICAgIGxheW91dCA9IFsnTmV0RnJvbnQnXTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IFdpbmRvd3MgUGhvbmUgNyBkZXNrdG9wIG1vZGVcbiAgICBpZiAobmFtZSA9PSAnSUUnICYmIChkYXRhID0gKC87ICooPzpYQkxXUHxadW5lV1ApKFxcZCspL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICBuYW1lICs9ICcgTW9iaWxlJztcbiAgICAgIG9zID0gJ1dpbmRvd3MgUGhvbmUgJyArICgvXFwrJC8udGVzdChkYXRhKSA/IGRhdGEgOiBkYXRhICsgJy54Jyk7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IFdpbmRvd3MgUGhvbmUgOCsgZGVza3RvcCBtb2RlXG4gICAgZWxzZSBpZiAoL1xcYldQRGVza3RvcFxcYi9pLnRlc3QodWEpKSB7XG4gICAgICBuYW1lID0gJ0lFIE1vYmlsZSc7XG4gICAgICBvcyA9ICdXaW5kb3dzIFBob25lIDgrJztcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgdmVyc2lvbiB8fCAodmVyc2lvbiA9ICgvXFxicnY6KFtcXGQuXSspLy5leGVjKHVhKSB8fCAwKVsxXSk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBJRSAxMSBhbmQgYWJvdmVcbiAgICBlbHNlIGlmIChuYW1lICE9ICdJRScgJiYgbGF5b3V0ID09ICdUcmlkZW50JyAmJiAoZGF0YSA9IC9cXGJydjooW1xcZC5dKykvLmV4ZWModWEpKSkge1xuICAgICAgaWYgKCEvXFxiV1BEZXNrdG9wXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdpZGVudGlmeWluZyBhcyAnICsgbmFtZSArICh2ZXJzaW9uID8gJyAnICsgdmVyc2lvbiA6ICcnKSk7XG4gICAgICAgIH1cbiAgICAgICAgbmFtZSA9ICdJRSc7XG4gICAgICB9XG4gICAgICB2ZXJzaW9uID0gZGF0YVsxXTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IE1pY3Jvc29mdCBFZGdlXG4gICAgZWxzZSBpZiAoKG5hbWUgPT0gJ0Nocm9tZScgfHwgbmFtZSAhPSAnSUUnKSAmJiAoZGF0YSA9IC9cXGJFZGdlXFwvKFtcXGQuXSspLy5leGVjKHVhKSkpIHtcbiAgICAgIG5hbWUgPSAnTWljcm9zb2Z0IEVkZ2UnO1xuICAgICAgdmVyc2lvbiA9IGRhdGFbMV07XG4gICAgICBsYXlvdXQgPSBbJ1RyaWRlbnQnXTtcbiAgICB9XG4gICAgLy8gbGV2ZXJhZ2UgZW52aXJvbm1lbnQgZmVhdHVyZXNcbiAgICBpZiAodXNlRmVhdHVyZXMpIHtcbiAgICAgIC8vIGRldGVjdCBzZXJ2ZXItc2lkZSBlbnZpcm9ubWVudHNcbiAgICAgIC8vIFJoaW5vIGhhcyBhIGdsb2JhbCBmdW5jdGlvbiB3aGlsZSBvdGhlcnMgaGF2ZSBhIGdsb2JhbCBvYmplY3RcbiAgICAgIGlmIChpc0hvc3RUeXBlKGNvbnRleHQsICdnbG9iYWwnKSkge1xuICAgICAgICBpZiAoamF2YSkge1xuICAgICAgICAgIGRhdGEgPSBqYXZhLmxhbmcuU3lzdGVtO1xuICAgICAgICAgIGFyY2ggPSBkYXRhLmdldFByb3BlcnR5KCdvcy5hcmNoJyk7XG4gICAgICAgICAgb3MgPSBvcyB8fCBkYXRhLmdldFByb3BlcnR5KCdvcy5uYW1lJykgKyAnICcgKyBkYXRhLmdldFByb3BlcnR5KCdvcy52ZXJzaW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTW9kdWxlU2NvcGUgJiYgaXNIb3N0VHlwZShjb250ZXh0LCAnc3lzdGVtJykgJiYgKGRhdGEgPSBbY29udGV4dC5zeXN0ZW1dKVswXSkge1xuICAgICAgICAgIG9zIHx8IChvcyA9IGRhdGFbMF0ub3MgfHwgbnVsbCk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGFbMV0gPSBjb250ZXh0LnJlcXVpcmUoJ3JpbmdvL2VuZ2luZScpLnZlcnNpb247XG4gICAgICAgICAgICB2ZXJzaW9uID0gZGF0YVsxXS5qb2luKCcuJyk7XG4gICAgICAgICAgICBuYW1lID0gJ1JpbmdvSlMnO1xuICAgICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgaWYgKGRhdGFbMF0uZ2xvYmFsLnN5c3RlbSA9PSBjb250ZXh0LnN5c3RlbSkge1xuICAgICAgICAgICAgICBuYW1lID0gJ05hcndoYWwnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY29udGV4dC5wcm9jZXNzID09ICdvYmplY3QnICYmIChkYXRhID0gY29udGV4dC5wcm9jZXNzKSkge1xuICAgICAgICAgIG5hbWUgPSAnTm9kZS5qcyc7XG4gICAgICAgICAgYXJjaCA9IGRhdGEuYXJjaDtcbiAgICAgICAgICBvcyA9IGRhdGEucGxhdGZvcm07XG4gICAgICAgICAgdmVyc2lvbiA9IC9bXFxkLl0rLy5leGVjKGRhdGEudmVyc2lvbilbMF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmhpbm8pIHtcbiAgICAgICAgICBuYW1lID0gJ1JoaW5vJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IEFkb2JlIEFJUlxuICAgICAgZWxzZSBpZiAoZ2V0Q2xhc3NPZigoZGF0YSA9IGNvbnRleHQucnVudGltZSkpID09IGFpclJ1bnRpbWVDbGFzcykge1xuICAgICAgICBuYW1lID0gJ0Fkb2JlIEFJUic7XG4gICAgICAgIG9zID0gZGF0YS5mbGFzaC5zeXN0ZW0uQ2FwYWJpbGl0aWVzLm9zO1xuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IFBoYW50b21KU1xuICAgICAgZWxzZSBpZiAoZ2V0Q2xhc3NPZigoZGF0YSA9IGNvbnRleHQucGhhbnRvbSkpID09IHBoYW50b21DbGFzcykge1xuICAgICAgICBuYW1lID0gJ1BoYW50b21KUyc7XG4gICAgICAgIHZlcnNpb24gPSAoZGF0YSA9IGRhdGEudmVyc2lvbiB8fCBudWxsKSAmJiAoZGF0YS5tYWpvciArICcuJyArIGRhdGEubWlub3IgKyAnLicgKyBkYXRhLnBhdGNoKTtcbiAgICAgIH1cbiAgICAgIC8vIGRldGVjdCBJRSBjb21wYXRpYmlsaXR5IG1vZGVzXG4gICAgICBlbHNlIGlmICh0eXBlb2YgZG9jLmRvY3VtZW50TW9kZSA9PSAnbnVtYmVyJyAmJiAoZGF0YSA9IC9cXGJUcmlkZW50XFwvKFxcZCspL2kuZXhlYyh1YSkpKSB7XG4gICAgICAgIC8vIHdlJ3JlIGluIGNvbXBhdGliaWxpdHkgbW9kZSB3aGVuIHRoZSBUcmlkZW50IHZlcnNpb24gKyA0IGRvZXNuJ3RcbiAgICAgICAgLy8gZXF1YWwgdGhlIGRvY3VtZW50IG1vZGVcbiAgICAgICAgdmVyc2lvbiA9IFt2ZXJzaW9uLCBkb2MuZG9jdW1lbnRNb2RlXTtcbiAgICAgICAgaWYgKChkYXRhID0gK2RhdGFbMV0gKyA0KSAhPSB2ZXJzaW9uWzFdKSB7XG4gICAgICAgICAgZGVzY3JpcHRpb24ucHVzaCgnSUUgJyArIHZlcnNpb25bMV0gKyAnIG1vZGUnKTtcbiAgICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICcnKTtcbiAgICAgICAgICB2ZXJzaW9uWzFdID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICB2ZXJzaW9uID0gbmFtZSA9PSAnSUUnID8gU3RyaW5nKHZlcnNpb25bMV0udG9GaXhlZCgxKSkgOiB2ZXJzaW9uWzBdO1xuICAgICAgfVxuICAgICAgb3MgPSBvcyAmJiBmb3JtYXQob3MpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgcHJlcmVsZWFzZSBwaGFzZXNcbiAgICBpZiAodmVyc2lvbiAmJiAoZGF0YSA9XG4gICAgICAgICAgLyg/OlthYl18ZHB8cHJlfFthYl1cXGQrcHJlKSg/OlxcZCtcXCs/KT8kL2kuZXhlYyh2ZXJzaW9uKSB8fFxuICAgICAgICAgIC8oPzphbHBoYXxiZXRhKSg/OiA/XFxkKT8vaS5leGVjKHVhICsgJzsnICsgKHVzZUZlYXR1cmVzICYmIG5hdi5hcHBNaW5vclZlcnNpb24pKSB8fFxuICAgICAgICAgIC9cXGJNaW5lZmllbGRcXGIvaS50ZXN0KHVhKSAmJiAnYSdcbiAgICAgICAgKSkge1xuICAgICAgcHJlcmVsZWFzZSA9IC9iL2kudGVzdChkYXRhKSA/ICdiZXRhJyA6ICdhbHBoYSc7XG4gICAgICB2ZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKFJlZ0V4cChkYXRhICsgJ1xcXFwrPyQnKSwgJycpICtcbiAgICAgICAgKHByZXJlbGVhc2UgPT0gJ2JldGEnID8gYmV0YSA6IGFscGhhKSArICgvXFxkK1xcKz8vLmV4ZWMoZGF0YSkgfHwgJycpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgRmlyZWZveCBNb2JpbGVcbiAgICBpZiAobmFtZSA9PSAnRmVubmVjJyB8fCBuYW1lID09ICdGaXJlZm94JyAmJiAvXFxiKD86QW5kcm9pZHxGaXJlZm94IE9TKVxcYi8udGVzdChvcykpIHtcbiAgICAgIG5hbWUgPSAnRmlyZWZveCBNb2JpbGUnO1xuICAgIH1cbiAgICAvLyBvYnNjdXJlIE1heHRob24ncyB1bnJlbGlhYmxlIHZlcnNpb25cbiAgICBlbHNlIGlmIChuYW1lID09ICdNYXh0aG9uJyAmJiB2ZXJzaW9uKSB7XG4gICAgICB2ZXJzaW9uID0gdmVyc2lvbi5yZXBsYWNlKC9cXC5bXFxkLl0rLywgJy54Jyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBTaWxrIGRlc2t0b3AvYWNjZWxlcmF0ZWQgbW9kZXNcbiAgICBlbHNlIGlmIChuYW1lID09ICdTaWxrJykge1xuICAgICAgaWYgKCEvXFxiTW9iaS9pLnRlc3QodWEpKSB7XG4gICAgICAgIG9zID0gJ0FuZHJvaWQnO1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIH1cbiAgICAgIGlmICgvQWNjZWxlcmF0ZWQgKj0gKnRydWUvaS50ZXN0KHVhKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdhY2NlbGVyYXRlZCcpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBkZXRlY3QgWGJveCAzNjAgYW5kIFhib3ggT25lXG4gICAgZWxzZSBpZiAoL1xcYlhib3hcXGIvaS50ZXN0KHByb2R1Y3QpKSB7XG4gICAgICBvcyA9IG51bGw7XG4gICAgICBpZiAocHJvZHVjdCA9PSAnWGJveCAzNjAnICYmIC9cXGJJRU1vYmlsZVxcYi8udGVzdCh1YSkpIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnbW9iaWxlIG1vZGUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gYWRkIG1vYmlsZSBwb3N0Zml4XG4gICAgZWxzZSBpZiAoKC9eKD86Q2hyb21lfElFfE9wZXJhKSQvLnRlc3QobmFtZSkgfHwgbmFtZSAmJiAhcHJvZHVjdCAmJiAhL0Jyb3dzZXJ8TW9iaS8udGVzdChuYW1lKSkgJiZcbiAgICAgICAgKG9zID09ICdXaW5kb3dzIENFJyB8fCAvTW9iaS9pLnRlc3QodWEpKSkge1xuICAgICAgbmFtZSArPSAnIE1vYmlsZSc7XG4gICAgfVxuICAgIC8vIGRldGVjdCBJRSBwbGF0Zm9ybSBwcmV2aWV3XG4gICAgZWxzZSBpZiAobmFtZSA9PSAnSUUnICYmIHVzZUZlYXR1cmVzICYmIGNvbnRleHQuZXh0ZXJuYWwgPT09IG51bGwpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ3BsYXRmb3JtIHByZXZpZXcnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IEJsYWNrQmVycnkgT1MgdmVyc2lvblxuICAgIC8vIGh0dHA6Ly9kb2NzLmJsYWNrYmVycnkuY29tL2VuL2RldmVsb3BlcnMvZGVsaXZlcmFibGVzLzE4MTY5L0hUVFBfaGVhZGVyc19zZW50X2J5X0JCX0Jyb3dzZXJfMTIzNDkxMV8xMS5qc3BcbiAgICBlbHNlIGlmICgoL1xcYkJsYWNrQmVycnlcXGIvLnRlc3QocHJvZHVjdCkgfHwgL1xcYkJCMTBcXGIvLnRlc3QodWEpKSAmJiAoZGF0YSA9XG4gICAgICAgICAgKFJlZ0V4cChwcm9kdWN0LnJlcGxhY2UoLyArL2csICcgKicpICsgJy8oWy5cXFxcZF0rKScsICdpJykuZXhlYyh1YSkgfHwgMClbMV0gfHxcbiAgICAgICAgICB2ZXJzaW9uXG4gICAgICAgICkpIHtcbiAgICAgIGRhdGEgPSBbZGF0YSwgL0JCMTAvLnRlc3QodWEpXTtcbiAgICAgIG9zID0gKGRhdGFbMV0gPyAocHJvZHVjdCA9IG51bGwsIG1hbnVmYWN0dXJlciA9ICdCbGFja0JlcnJ5JykgOiAnRGV2aWNlIFNvZnR3YXJlJykgKyAnICcgKyBkYXRhWzBdO1xuICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgfVxuICAgIC8vIGRldGVjdCBPcGVyYSBpZGVudGlmeWluZy9tYXNraW5nIGl0c2VsZiBhcyBhbm90aGVyIGJyb3dzZXJcbiAgICAvLyBodHRwOi8vd3d3Lm9wZXJhLmNvbS9zdXBwb3J0L2tiL3ZpZXcvODQzL1xuICAgIGVsc2UgaWYgKHRoaXMgIT0gZm9yT3duICYmIChcbiAgICAgICAgICBwcm9kdWN0ICE9ICdXaWknICYmIChcbiAgICAgICAgICAgICh1c2VGZWF0dXJlcyAmJiBvcGVyYSkgfHxcbiAgICAgICAgICAgICgvT3BlcmEvLnRlc3QobmFtZSkgJiYgL1xcYig/Ok1TSUV8RmlyZWZveClcXGIvaS50ZXN0KHVhKSkgfHxcbiAgICAgICAgICAgIChuYW1lID09ICdGaXJlZm94JyAmJiAvXFxiT1MgWCAoPzpcXGQrXFwuKXsyLH0vLnRlc3Qob3MpKSB8fFxuICAgICAgICAgICAgKG5hbWUgPT0gJ0lFJyAmJiAoXG4gICAgICAgICAgICAgIChvcyAmJiAhL15XaW4vLnRlc3Qob3MpICYmIHZlcnNpb24gPiA1LjUpIHx8XG4gICAgICAgICAgICAgIC9cXGJXaW5kb3dzIFhQXFxiLy50ZXN0KG9zKSAmJiB2ZXJzaW9uID4gOCB8fFxuICAgICAgICAgICAgICB2ZXJzaW9uID09IDggJiYgIS9cXGJUcmlkZW50XFxiLy50ZXN0KHVhKVxuICAgICAgICAgICAgKSlcbiAgICAgICAgICApXG4gICAgICAgICkgJiYgIXJlT3BlcmEudGVzdCgoZGF0YSA9IHBhcnNlLmNhbGwoZm9yT3duLCB1YS5yZXBsYWNlKHJlT3BlcmEsICcnKSArICc7JykpKSAmJiBkYXRhLm5hbWUpIHtcblxuICAgICAgLy8gd2hlbiBcImluZGVudGlmeWluZ1wiLCB0aGUgVUEgY29udGFpbnMgYm90aCBPcGVyYSBhbmQgdGhlIG90aGVyIGJyb3dzZXIncyBuYW1lXG4gICAgICBkYXRhID0gJ2luZyBhcyAnICsgZGF0YS5uYW1lICsgKChkYXRhID0gZGF0YS52ZXJzaW9uKSA/ICcgJyArIGRhdGEgOiAnJyk7XG4gICAgICBpZiAocmVPcGVyYS50ZXN0KG5hbWUpKSB7XG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkgJiYgb3MgPT0gJ01hYyBPUycpIHtcbiAgICAgICAgICBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YSA9ICdpZGVudGlmeScgKyBkYXRhO1xuICAgICAgfVxuICAgICAgLy8gd2hlbiBcIm1hc2tpbmdcIiwgdGhlIFVBIGNvbnRhaW5zIG9ubHkgdGhlIG90aGVyIGJyb3dzZXIncyBuYW1lXG4gICAgICBlbHNlIHtcbiAgICAgICAgZGF0YSA9ICdtYXNrJyArIGRhdGE7XG4gICAgICAgIGlmIChvcGVyYUNsYXNzKSB7XG4gICAgICAgICAgbmFtZSA9IGZvcm1hdChvcGVyYUNsYXNzLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuYW1lID0gJ09wZXJhJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoL1xcYklFXFxiLy50ZXN0KGRhdGEpKSB7XG4gICAgICAgICAgb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdXNlRmVhdHVyZXMpIHtcbiAgICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGF5b3V0ID0gWydQcmVzdG8nXTtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBXZWJLaXQgTmlnaHRseSBhbmQgYXBwcm94aW1hdGUgQ2hyb21lL1NhZmFyaSB2ZXJzaW9uc1xuICAgIGlmICgoZGF0YSA9ICgvXFxiQXBwbGVXZWJLaXRcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAvLyBjb3JyZWN0IGJ1aWxkIGZvciBudW1lcmljIGNvbXBhcmlzb25cbiAgICAgIC8vIChlLmcuIFwiNTMyLjVcIiBiZWNvbWVzIFwiNTMyLjA1XCIpXG4gICAgICBkYXRhID0gW3BhcnNlRmxvYXQoZGF0YS5yZXBsYWNlKC9cXC4oXFxkKSQvLCAnLjAkMScpKSwgZGF0YV07XG4gICAgICAvLyBuaWdodGx5IGJ1aWxkcyBhcmUgcG9zdGZpeGVkIHdpdGggYSBgK2BcbiAgICAgIGlmIChuYW1lID09ICdTYWZhcmknICYmIGRhdGFbMV0uc2xpY2UoLTEpID09ICcrJykge1xuICAgICAgICBuYW1lID0gJ1dlYktpdCBOaWdodGx5JztcbiAgICAgICAgcHJlcmVsZWFzZSA9ICdhbHBoYSc7XG4gICAgICAgIHZlcnNpb24gPSBkYXRhWzFdLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICAgIC8vIGNsZWFyIGluY29ycmVjdCBicm93c2VyIHZlcnNpb25zXG4gICAgICBlbHNlIGlmICh2ZXJzaW9uID09IGRhdGFbMV0gfHxcbiAgICAgICAgICB2ZXJzaW9uID09IChkYXRhWzJdID0gKC9cXGJTYWZhcmlcXC8oW1xcZC5dK1xcKz8pL2kuZXhlYyh1YSkgfHwgMClbMV0pKSB7XG4gICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gdXNlIHRoZSBmdWxsIENocm9tZSB2ZXJzaW9uIHdoZW4gYXZhaWxhYmxlXG4gICAgICBkYXRhWzFdID0gKC9cXGJDaHJvbWVcXC8oW1xcZC5dKykvaS5leGVjKHVhKSB8fCAwKVsxXTtcbiAgICAgIC8vIGRldGVjdCBCbGluayBsYXlvdXQgZW5naW5lXG4gICAgICBpZiAoZGF0YVswXSA9PSA1MzcuMzYgJiYgZGF0YVsyXSA9PSA1MzcuMzYgJiYgcGFyc2VGbG9hdChkYXRhWzFdKSA+PSAyOCAmJiBuYW1lICE9ICdJRScgJiYgbmFtZSAhPSAnTWljcm9zb2Z0IEVkZ2UnKSB7XG4gICAgICAgIGxheW91dCA9IFsnQmxpbmsnXTtcbiAgICAgIH1cbiAgICAgIC8vIGRldGVjdCBKYXZhU2NyaXB0Q29yZVxuICAgICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82NzY4NDc0L2hvdy1jYW4taS1kZXRlY3Qtd2hpY2gtamF2YXNjcmlwdC1lbmdpbmUtdjgtb3ItanNjLWlzLXVzZWQtYXQtcnVudGltZS1pbi1hbmRyb2lcbiAgICAgIGlmICghdXNlRmVhdHVyZXMgfHwgKCFsaWtlQ2hyb21lICYmICFkYXRhWzFdKSkge1xuICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICdsaWtlIFNhZmFyaScpO1xuICAgICAgICBkYXRhID0gKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNDAwID8gMSA6IGRhdGEgPCA1MDAgPyAyIDogZGF0YSA8IDUyNiA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQgPyAnNCsnIDogZGF0YSA8IDUzNSA/IDUgOiBkYXRhIDwgNTM3ID8gNiA6IGRhdGEgPCA1MzggPyA3IDogZGF0YSA8IDYwMSA/IDggOiAnOCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGF5b3V0ICYmIChsYXlvdXRbMV0gPSAnbGlrZSBDaHJvbWUnKTtcbiAgICAgICAgZGF0YSA9IGRhdGFbMV0gfHwgKGRhdGEgPSBkYXRhWzBdLCBkYXRhIDwgNTMwID8gMSA6IGRhdGEgPCA1MzIgPyAyIDogZGF0YSA8IDUzMi4wNSA/IDMgOiBkYXRhIDwgNTMzID8gNCA6IGRhdGEgPCA1MzQuMDMgPyA1IDogZGF0YSA8IDUzNC4wNyA/IDYgOiBkYXRhIDwgNTM0LjEwID8gNyA6IGRhdGEgPCA1MzQuMTMgPyA4IDogZGF0YSA8IDUzNC4xNiA/IDkgOiBkYXRhIDwgNTM0LjI0ID8gMTAgOiBkYXRhIDwgNTM0LjMwID8gMTEgOiBkYXRhIDwgNTM1LjAxID8gMTIgOiBkYXRhIDwgNTM1LjAyID8gJzEzKycgOiBkYXRhIDwgNTM1LjA3ID8gMTUgOiBkYXRhIDwgNTM1LjExID8gMTYgOiBkYXRhIDwgNTM1LjE5ID8gMTcgOiBkYXRhIDwgNTM2LjA1ID8gMTggOiBkYXRhIDwgNTM2LjEwID8gMTkgOiBkYXRhIDwgNTM3LjAxID8gMjAgOiBkYXRhIDwgNTM3LjExID8gJzIxKycgOiBkYXRhIDwgNTM3LjEzID8gMjMgOiBkYXRhIDwgNTM3LjE4ID8gMjQgOiBkYXRhIDwgNTM3LjI0ID8gMjUgOiBkYXRhIDwgNTM3LjM2ID8gMjYgOiBsYXlvdXQgIT0gJ0JsaW5rJyA/ICcyNycgOiAnMjgnKTtcbiAgICAgIH1cbiAgICAgIC8vIGFkZCB0aGUgcG9zdGZpeCBvZiBcIi54XCIgb3IgXCIrXCIgZm9yIGFwcHJveGltYXRlIHZlcnNpb25zXG4gICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSArPSAnICcgKyAoZGF0YSArPSB0eXBlb2YgZGF0YSA9PSAnbnVtYmVyJyA/ICcueCcgOiAvWy4rXS8udGVzdChkYXRhKSA/ICcnIDogJysnKSk7XG4gICAgICAvLyBvYnNjdXJlIHZlcnNpb24gZm9yIHNvbWUgU2FmYXJpIDEtMiByZWxlYXNlc1xuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgKCF2ZXJzaW9uIHx8IHBhcnNlSW50KHZlcnNpb24pID4gNDUpKSB7XG4gICAgICAgIHZlcnNpb24gPSBkYXRhO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBkZXRlY3QgT3BlcmEgZGVza3RvcCBtb2Rlc1xuICAgIGlmIChuYW1lID09ICdPcGVyYScgJiYgIChkYXRhID0gL1xcYnpib3Z8enZhdiQvLmV4ZWMob3MpKSkge1xuICAgICAgbmFtZSArPSAnICc7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdkZXNrdG9wIG1vZGUnKTtcbiAgICAgIGlmIChkYXRhID09ICd6dmF2Jykge1xuICAgICAgICBuYW1lICs9ICdNaW5pJztcbiAgICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuYW1lICs9ICdNb2JpbGUnO1xuICAgICAgfVxuICAgICAgb3MgPSBvcy5yZXBsYWNlKFJlZ0V4cCgnIConICsgZGF0YSArICckJyksICcnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IENocm9tZSBkZXNrdG9wIG1vZGVcbiAgICBlbHNlIGlmIChuYW1lID09ICdTYWZhcmknICYmIC9cXGJDaHJvbWVcXGIvLmV4ZWMobGF5b3V0ICYmIGxheW91dFsxXSkpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgbmFtZSA9ICdDaHJvbWUgTW9iaWxlJztcbiAgICAgIHZlcnNpb24gPSBudWxsO1xuXG4gICAgICBpZiAoL1xcYk9TIFhcXGIvLnRlc3Qob3MpKSB7XG4gICAgICAgIG1hbnVmYWN0dXJlciA9ICdBcHBsZSc7XG4gICAgICAgIG9zID0gJ2lPUyA0LjMrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9zID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc3RyaXAgaW5jb3JyZWN0IE9TIHZlcnNpb25zXG4gICAgaWYgKHZlcnNpb24gJiYgdmVyc2lvbi5pbmRleE9mKChkYXRhID0gL1tcXGQuXSskLy5leGVjKG9zKSkpID09IDAgJiZcbiAgICAgICAgdWEuaW5kZXhPZignLycgKyBkYXRhICsgJy0nKSA+IC0xKSB7XG4gICAgICBvcyA9IHRyaW0ob3MucmVwbGFjZShkYXRhLCAnJykpO1xuICAgIH1cbiAgICAvLyBhZGQgbGF5b3V0IGVuZ2luZVxuICAgIGlmIChsYXlvdXQgJiYgIS9cXGIoPzpBdmFudHxOb29rKVxcYi8udGVzdChuYW1lKSAmJiAoXG4gICAgICAgIC9Ccm93c2VyfEx1bmFzY2FwZXxNYXh0aG9uLy50ZXN0KG5hbWUpIHx8XG4gICAgICAgIC9eKD86QWRvYmV8QXJvcmF8QnJlYWNofE1pZG9yaXxPcGVyYXxQaGFudG9tfFJla29ucXxSb2NrfFNsZWlwbmlyfFdlYikvLnRlc3QobmFtZSkgJiYgbGF5b3V0WzFdKSkge1xuICAgICAgLy8gZG9uJ3QgYWRkIGxheW91dCBkZXRhaWxzIHRvIGRlc2NyaXB0aW9uIGlmIHRoZXkgYXJlIGZhbHNleVxuICAgICAgKGRhdGEgPSBsYXlvdXRbbGF5b3V0Lmxlbmd0aCAtIDFdKSAmJiBkZXNjcmlwdGlvbi5wdXNoKGRhdGEpO1xuICAgIH1cbiAgICAvLyBjb21iaW5lIGNvbnRleHR1YWwgaW5mb3JtYXRpb25cbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBkZXNjcmlwdGlvbiA9IFsnKCcgKyBkZXNjcmlwdGlvbi5qb2luKCc7ICcpICsgJyknXTtcbiAgICB9XG4gICAgLy8gYXBwZW5kIG1hbnVmYWN0dXJlclxuICAgIGlmIChtYW51ZmFjdHVyZXIgJiYgcHJvZHVjdCAmJiBwcm9kdWN0LmluZGV4T2YobWFudWZhY3R1cmVyKSA8IDApIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ29uICcgKyBtYW51ZmFjdHVyZXIpO1xuICAgIH1cbiAgICAvLyBhcHBlbmQgcHJvZHVjdFxuICAgIGlmIChwcm9kdWN0KSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKCgvXm9uIC8udGVzdChkZXNjcmlwdGlvbltkZXNjcmlwdGlvbi5sZW5ndGggLTFdKSA/ICcnIDogJ29uICcpICsgcHJvZHVjdCk7XG4gICAgfVxuICAgIC8vIHBhcnNlIE9TIGludG8gYW4gb2JqZWN0XG4gICAgaWYgKG9zKSB7XG4gICAgICBkYXRhID0gLyAoW1xcZC4rXSspJC8uZXhlYyhvcyk7XG4gICAgICBpc1NwZWNpYWxDYXNlZE9TID0gZGF0YSAmJiBvcy5jaGFyQXQob3MubGVuZ3RoIC0gZGF0YVswXS5sZW5ndGggLSAxKSA9PSAnLyc7XG4gICAgICBvcyA9IHtcbiAgICAgICAgJ2FyY2hpdGVjdHVyZSc6IDMyLFxuICAgICAgICAnZmFtaWx5JzogKGRhdGEgJiYgIWlzU3BlY2lhbENhc2VkT1MpID8gb3MucmVwbGFjZShkYXRhWzBdLCAnJykgOiBvcyxcbiAgICAgICAgJ3ZlcnNpb24nOiBkYXRhID8gZGF0YVsxXSA6IG51bGwsXG4gICAgICAgICd0b1N0cmluZyc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2ZXJzaW9uID0gdGhpcy52ZXJzaW9uO1xuICAgICAgICAgIHJldHVybiB0aGlzLmZhbWlseSArICgodmVyc2lvbiAmJiAhaXNTcGVjaWFsQ2FzZWRPUykgPyAnICcgKyB2ZXJzaW9uIDogJycpICsgKHRoaXMuYXJjaGl0ZWN0dXJlID09IDY0ID8gJyA2NC1iaXQnIDogJycpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBhZGQgYnJvd3Nlci9PUyBhcmNoaXRlY3R1cmVcbiAgICBpZiAoKGRhdGEgPSAvXFxiKD86QU1EfElBfFdpbnxXT1d8eDg2X3x4KTY0XFxiL2kuZXhlYyhhcmNoKSkgJiYgIS9cXGJpNjg2XFxiL2kudGVzdChhcmNoKSkge1xuICAgICAgaWYgKG9zKSB7XG4gICAgICAgIG9zLmFyY2hpdGVjdHVyZSA9IDY0O1xuICAgICAgICBvcy5mYW1pbHkgPSBvcy5mYW1pbHkucmVwbGFjZShSZWdFeHAoJyAqJyArIGRhdGEpLCAnJyk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICAgbmFtZSAmJiAoL1xcYldPVzY0XFxiL2kudGVzdCh1YSkgfHxcbiAgICAgICAgICAodXNlRmVhdHVyZXMgJiYgL1xcdyg/Ojg2fDMyKSQvLnRlc3QobmF2LmNwdUNsYXNzIHx8IG5hdi5wbGF0Zm9ybSkgJiYgIS9cXGJXaW42NDsgeDY0XFxiL2kudGVzdCh1YSkpKVxuICAgICAgKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJzMyLWJpdCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHVhIHx8ICh1YSA9IG51bGwpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXRmb3JtIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBuYW1lIHBsYXRmb3JtXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgdmFyIHBsYXRmb3JtID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxhdGZvcm0gZGVzY3JpcHRpb24uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLmRlc2NyaXB0aW9uID0gdWE7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3NlcidzIGxheW91dCBlbmdpbmUuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLmxheW91dCA9IGxheW91dCAmJiBsYXlvdXRbMF07XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvZHVjdCdzIG1hbnVmYWN0dXJlci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubWFudWZhY3R1cmVyID0gbWFudWZhY3R1cmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIGJyb3dzZXIvZW52aXJvbm1lbnQuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLm5hbWUgPSBuYW1lO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFscGhhL2JldGEgcmVsZWFzZSBpbmRpY2F0b3IuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnByZXJlbGVhc2UgPSBwcmVyZWxlYXNlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHByb2R1Y3QgaG9zdGluZyB0aGUgYnJvd3Nlci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ucHJvZHVjdCA9IHByb2R1Y3Q7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYnJvd3NlcidzIHVzZXIgYWdlbnQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS51YSA9IHVhO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGJyb3dzZXIvZW52aXJvbm1lbnQgdmVyc2lvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0udmVyc2lvbiA9IG5hbWUgJiYgdmVyc2lvbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBvcGVyYXRpbmcgc3lzdGVtLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgcGxhdGZvcm0ub3MgPSBvcyB8fCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIENQVSBhcmNoaXRlY3R1cmUgdGhlIE9TIGlzIGJ1aWx0IGZvci5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEB0eXBlIG51bWJlcnxudWxsXG4gICAgICAgKi9cbiAgICAgICdhcmNoaXRlY3R1cmUnOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBmYW1pbHkgb2YgdGhlIE9TLlxuICAgICAgICpcbiAgICAgICAqIENvbW1vbiB2YWx1ZXMgaW5jbHVkZTpcbiAgICAgICAqIFwiV2luZG93c1wiLCBcIldpbmRvd3MgU2VydmVyIDIwMDggUjIgLyA3XCIsIFwiV2luZG93cyBTZXJ2ZXIgMjAwOCAvIFZpc3RhXCIsXG4gICAgICAgKiBcIldpbmRvd3MgWFBcIiwgXCJPUyBYXCIsIFwiVWJ1bnR1XCIsIFwiRGViaWFuXCIsIFwiRmVkb3JhXCIsIFwiUmVkIEhhdFwiLCBcIlN1U0VcIixcbiAgICAgICAqIFwiQW5kcm9pZFwiLCBcImlPU1wiIGFuZCBcIldpbmRvd3MgUGhvbmVcIlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgICAqL1xuICAgICAgJ2ZhbWlseSc6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIHZlcnNpb24gb2YgdGhlIE9TLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgICAqL1xuICAgICAgJ3ZlcnNpb24nOiBudWxsLFxuXG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgdGhlIE9TIHN0cmluZy5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm0ub3NcbiAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBPUyBzdHJpbmcuXG4gICAgICAgKi9cbiAgICAgICd0b1N0cmluZyc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ251bGwnOyB9XG4gICAgfTtcblxuICAgIHBsYXRmb3JtLnBhcnNlID0gcGFyc2U7XG4gICAgcGxhdGZvcm0udG9TdHJpbmcgPSB0b1N0cmluZ1BsYXRmb3JtO1xuXG4gICAgaWYgKHBsYXRmb3JtLnZlcnNpb24pIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQodmVyc2lvbik7XG4gICAgfVxuICAgIGlmIChwbGF0Zm9ybS5uYW1lKSB7XG4gICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KG5hbWUpO1xuICAgIH1cbiAgICBpZiAob3MgJiYgbmFtZSAmJiAhKG9zID09IFN0cmluZyhvcykuc3BsaXQoJyAnKVswXSAmJiAob3MgPT0gbmFtZS5zcGxpdCgnICcpWzBdIHx8IHByb2R1Y3QpKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaChwcm9kdWN0ID8gJygnICsgb3MgKyAnKScgOiAnb24gJyArIG9zKTtcbiAgICB9XG4gICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aCkge1xuICAgICAgcGxhdGZvcm0uZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbi5qb2luKCcgJyk7XG4gICAgfVxuICAgIHJldHVybiBwbGF0Zm9ybTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8vIGV4cG9ydCBwbGF0Zm9ybVxuICAvLyBzb21lIEFNRCBidWlsZCBvcHRpbWl6ZXJzLCBsaWtlIHIuanMsIGNoZWNrIGZvciBjb25kaXRpb24gcGF0dGVybnMgbGlrZSB0aGUgZm9sbG93aW5nOlxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBkZWZpbmUgYXMgYW4gYW5vbnltb3VzIG1vZHVsZSBzbywgdGhyb3VnaCBwYXRoIG1hcHBpbmcsIGl0IGNhbiBiZSBhbGlhc2VkXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHBhcnNlKCk7XG4gICAgfSk7XG4gIH1cbiAgLy8gY2hlY2sgZm9yIGBleHBvcnRzYCBhZnRlciBgZGVmaW5lYCBpbiBjYXNlIGEgYnVpbGQgb3B0aW1pemVyIGFkZHMgYW4gYGV4cG9ydHNgIG9iamVjdFxuICBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgLy8gaW4gTmFyd2hhbCwgTm9kZS5qcywgUmhpbm8gLXJlcXVpcmUsIG9yIFJpbmdvSlNcbiAgICBmb3JPd24ocGFyc2UoKSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgZnJlZUV4cG9ydHNba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG4gIC8vIGluIGEgYnJvd3NlciBvciBSaGlub1xuICBlbHNlIHtcbiAgICByb290LnBsYXRmb3JtID0gcGFyc2UoKTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9wbGF0Zm9ybS9wbGF0Zm9ybS5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgXyBmcm9tIFwibG9kYXNoXCI7XG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby12YXItcmVxdWlyZXMgKi9cbmltcG9ydCAqIGFzIGJlbmNobWFyayBmcm9tIFwiYmVuY2htYXJrXCI7XG5jb25zdCBwbGF0Zm9ybSA9IHJlcXVpcmUoXCJwbGF0Zm9ybVwiKTtcbi8qIHRzbGludDplbmFibGU6bm8tdmFyLXJlcXVpcmVzICovXG5cbmltcG9ydCB7Y3JlYXRlTWFuZGVsT3B0aW9ucywgcGFyYWxsZWxNYW5kZWxicm90IGFzIGR5bmFtaWNQYXJhbGxlbE1hbmRlbGJyb3QsIHN5bmNNYW5kZWxicm90fSBmcm9tIFwiLi9keW5hbWljL21hbmRlbGJyb3RcIjtcbmltcG9ydCB7bWFuZGVsYnJvdCBhcyB0cmFuc3BpbGVkUGFyYWxsZWxNYW5kZWxicm90fSBmcm9tIFwiLi90cmFuc3BpbGVkL21hbmRlbGJyb3RcIjtcbmltcG9ydCB7c3luY0tuaWdodFRvdXJzLCBwYXJhbGxlbEtuaWdodFRvdXJzIGFzIHRyYW5zcGlsZWRQYXJhbGxlbEtuaWdodFRvdXJzfSBmcm9tIFwiLi90cmFuc3BpbGVkL2tuaWdodHMtdG91clwiO1xuaW1wb3J0IHtwYXJhbGxlbEtuaWdodFRvdXJzIGFzIGR5bmFtaWNQYXJhbGxlbEtuaWdodFRvdXJzfSBmcm9tIFwiLi9keW5hbWljL2tuaWdodHMtdG91clwiO1xuaW1wb3J0IHtJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zLCBzeW5jTW9udGVDYXJsbyBhcyByYW5kb21Nb250ZUNhcmxvLCBwYXJhbGxlbE1vbnRlQ2FybG8gYXMgcmFuZG9tUGFyYWxsZWxNb250ZUNhcmxvLCBJUHJvamVjdH0gZnJvbSBcIi4vZHluYW1pYy9tb250ZS1jYXJsb1wiO1xuaW1wb3J0IHtzeW5jTW9udGVDYXJsbyBhcyBzaW1Kc01vbnRlQ2FybG8sIHBhcmFsbGVsTW9udGVDYXJsbyBhcyBzaW1Kc1BhcmFsbGVsTW9udGVDYXJsb30gZnJvbSBcIi4vdHJhbnNwaWxlZC9tb250ZS1jYXJsb1wiO1xuXG5sZXQgQmVuY2htYXJrID0gKGJlbmNobWFyayBhcyBhbnkpLnJ1bkluQ29udGV4dCh7IF8gfSk7XG4od2luZG93IGFzIGFueSkuQmVuY2htYXJrID0gQmVuY2htYXJrO1xuXG5jb25zdCBydW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3J1blwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuY29uc3Qgb3V0cHV0VGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI291dHB1dC10YWJsZVwiKSBhcyBIVE1MVGFibGVFbGVtZW50O1xuY29uc3QganNvbk91dHB1dEZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqc29uLW91dHB1dFwiKSBhcyBIVE1MRWxlbWVudDtcblxuY29uc3Qgc3luY0NoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzeW5jXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5jb25zdCBwYXJhbGxlbER5bmFtaWNDaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGFyYWxsZWwtZXMtZHluYW1pY1wiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuY29uc3QgcGFyYWxsZWxUcmFuc3BpbGVkQ2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BhcmFsbGVsLWVzLXRyYW5zcGlsZWRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcblxuY29uc3Qga25pZ2h0UnVubmVyNng2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNrbmlnaHQtcnVubmVyLTYtNlwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG50eXBlIERlZmVycmVkID0geyByZXNvbHZlOiAoKSA9PiB2b2lkLCByZWplY3Q6ICgpID0+IHZvaWQgfTtcblxuZnVuY3Rpb24gYWRkS25pZ2h0Qm9hcmRUZXN0cyhzdWl0ZTogYmVuY2htYXJrLlN1aXRlKSB7XG4gICAgY29uc3QgYm9hcmRTaXplcyA9IGtuaWdodFJ1bm5lcjZ4Ni5jaGVja2VkID8gWzUsIDZdIDogWzVdO1xuXG4gICAgZm9yIChjb25zdCBib2FyZFNpemUgb2YgYm9hcmRTaXplcykge1xuICAgICAgICBjb25zdCB0aXRsZSA9IGBLbmlnaHRzIFRvdXIgKCR7Ym9hcmRTaXplfXgke2JvYXJkU2l6ZX0pYDtcbiAgICAgICAgc3VpdGUuYWRkKGBzeW5jOiAke3RpdGxlfWAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN5bmNLbmlnaHRUb3Vycyh7eDogMCwgeTogMH0sIGJvYXJkU2l6ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtZHluYW1pYzogJHt0aXRsZX1gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICBkeW5hbWljUGFyYWxsZWxLbmlnaHRUb3Vycyh7eDogMCwgeTogMH0sIGJvYXJkU2l6ZSkudGhlbigoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCksICgpID0+IGRlZmVycmVkLnJlamVjdCgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9KTtcblxuICAgICAgICBzdWl0ZS5hZGQoYHBhcmFsbGVsLXRyYW5zcGlsZWQ6ICR7dGl0bGV9YCwgZnVuY3Rpb24gKGRlZmVycmVkOiBEZWZlcnJlZCkge1xuICAgICAgICAgICAgdHJhbnNwaWxlZFBhcmFsbGVsS25pZ2h0VG91cnMoe3g6IDAsIHk6IDB9LCBib2FyZFNpemUpLnRoZW4oKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpLCAoKSA9PiBkZWZlcnJlZC5yZWplY3QoKSk7XG4gICAgICAgIH0sIHsgZGVmZXI6IHRydWUgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRNb250ZUNhcmxvVGVzdChzdWl0ZTogYmVuY2htYXJrLlN1aXRlLCBvcHRpb25zOiBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zLCBudW1iZXJPZlByb2plY3RzOiBudW1iZXIpIHtcbiAgICBjb25zdCBydW5PcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7XG4gICAgICAgIHByb2plY3RzOiBjcmVhdGVQcm9qZWN0cyhudW1iZXJPZlByb2plY3RzKVxuICAgIH0pO1xuXG4gICAgc3VpdGUuYWRkKGBzeW5jOiBNb250ZSBDYXJsbyAke251bWJlck9mUHJvamVjdHN9IE1hdGgucmFuZG9tYCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByYW5kb21Nb250ZUNhcmxvKG9wdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgc3VpdGUuYWRkKGBwYXJhbGxlbC1keW5hbWljOiBNb250ZSBDYXJsbyAke251bWJlck9mUHJvamVjdHN9IE1hdGgucmFuZG9tYCxcbiAgICAgICAgZnVuY3Rpb24gKGRlZmVycmVkOiBEZWZlcnJlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbVBhcmFsbGVsTW9udGVDYXJsbyhydW5PcHRpb25zKS50aGVuKCgpID0+IGRlZmVycmVkLnJlc29sdmUoKSwgKCkgPT4gZGVmZXJyZWQucmVqZWN0KCkpO1xuICAgICAgICB9LCB7IGRlZmVyOiB0cnVlIH1cbiAgICApO1xuXG4gICAgc3VpdGUuYWRkKGBzeW5jOiBNb250ZSBDYXJsbyAke251bWJlck9mUHJvamVjdHN9IHNpbWpzYCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzaW1Kc01vbnRlQ2FybG8ob3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgICBzdWl0ZS5hZGQoYHBhcmFsbGVsLXRyYW5zcGlsZWQ6IE1vbnRlIENhcmxvICR7bnVtYmVyT2ZQcm9qZWN0c30gc2ltanNgLFxuICAgICAgICBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gc2ltSnNQYXJhbGxlbE1vbnRlQ2FybG8ocnVuT3B0aW9ucykudGhlbigoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCksICgpID0+IGRlZmVycmVkLnJlamVjdCgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9XG4gICAgKTtcbn1cblxuZnVuY3Rpb24gYWRkTW9udGVDYXJsb1Rlc3RzKHN1aXRlOiBiZW5jaG1hcmsuU3VpdGUpIHtcbiAgICBjb25zdCBtb250ZUNhcmxvT3B0aW9ucyA9IHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogNjIwMDAwLFxuICAgICAgICBudW1SdW5zOiAxMDAwMCxcbiAgICAgICAgbnVtWWVhcnM6IDE1LFxuICAgICAgICBwZXJmb3JtYW5jZTogMC4wMzQwMDAwLFxuICAgICAgICBzZWVkOiAxMCxcbiAgICAgICAgdm9sYXRpbGl0eTogMC4wODk2MDAwXG4gICAgfTtcblxuICAgIGZvciAoY29uc3QgbnVtYmVyT2ZQcm9qZWN0cyBvZiAgWzEsIDIsIDQsIDYsIDgsIDEwLCAxNV0pIHtcbiAgICAgICAgYWRkTW9udGVDYXJsb1Rlc3Qoc3VpdGUsIG1vbnRlQ2FybG9PcHRpb25zLCBudW1iZXJPZlByb2plY3RzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE1hbmRlbGJyb3RUZXN0cyhzdWl0ZTogYmVuY2htYXJrLlN1aXRlKSB7XG4gICAgY29uc3QgbWFuZGVsYnJvdEhlaWdodCA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3QtaGVpZ2h0XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLCAxMCk7XG4gICAgY29uc3QgbWFuZGVsYnJvdFdpZHRoID0gcGFyc2VJbnQoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFuZGVsYnJvdC13aWR0aFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuICAgIGNvbnN0IG1hbmRlbGJyb3RJdGVyYXRpb25zID0gcGFyc2VJbnQoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFuZGVsYnJvdC1pdGVyYXRpb25zXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlLCAxMCk7XG5cbiAgICBjb25zdCBtYW5kZWxicm90T3B0aW9ucyA9IGNyZWF0ZU1hbmRlbE9wdGlvbnMobWFuZGVsYnJvdFdpZHRoLCBtYW5kZWxicm90SGVpZ2h0LCBtYW5kZWxicm90SXRlcmF0aW9ucyk7XG5cbiAgICBzdWl0ZS5hZGQoYHN5bmM6IE1hbmRlbGJyb3QgJHttYW5kZWxicm90V2lkdGh9eCR7bWFuZGVsYnJvdEhlaWdodH0sICR7bWFuZGVsYnJvdEl0ZXJhdGlvbnN9YCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzeW5jTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgKCkgPT4gdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGZvciAoY29uc3QgbWF4VmFsdWVzUGVyVGFzayBvZiBbdW5kZWZpbmVkLCAxLCA3NSwgMTUwLCAzMDAsIDYwMCwgMTIwMF0pIHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBgTWFuZGVsYnJvdCAke21hbmRlbGJyb3RPcHRpb25zLmltYWdlV2lkdGh9eCR7bWFuZGVsYnJvdE9wdGlvbnMuaW1hZ2VIZWlnaHR9LCAke21hbmRlbGJyb3RPcHRpb25zLml0ZXJhdGlvbnN9ICgke21heFZhbHVlc1BlclRhc2t9KWA7XG4gICAgICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtZHluYW1pYzogJHt0aXRsZX1gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZHluYW1pY1BhcmFsbGVsTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgeyBtYXhWYWx1ZXNQZXJUYXNrIH0pLnRoZW4oKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpLCAoKSA9PiBkZWZlcnJlZC5yZWplY3QoKSk7XG4gICAgICAgIH0sIHsgZGVmZXI6IHRydWUgfSk7XG5cbiAgICAgICAgc3VpdGUuYWRkKGBwYXJhbGxlbC10cmFuc3BpbGVkOiAke3RpdGxlfWAsIGZ1bmN0aW9uIChkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc3BpbGVkUGFyYWxsZWxNYW5kZWxicm90KG1hbmRlbGJyb3RPcHRpb25zLCB7IG1heFZhbHVlc1BlclRhc2sgfSkudGhlbigoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCksICgpID0+IGRlZmVycmVkLnJlamVjdCgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1lYXN1cmUoKSB7XG4gICAgY29uc3QgYWxsVGVzdHNTdWl0ZSA9IG5ldyBCZW5jaG1hcmsuU3VpdGUoKTtcblxuICAgIGFkZE1vbnRlQ2FybG9UZXN0cyhhbGxUZXN0c1N1aXRlKTtcbiAgICBhZGRNYW5kZWxicm90VGVzdHMoYWxsVGVzdHNTdWl0ZSk7XG4gICAgYWRkS25pZ2h0Qm9hcmRUZXN0cyhhbGxUZXN0c1N1aXRlKTtcblxuICAgIGNvbnN0IHN1aXRlID0gYWxsVGVzdHNTdWl0ZS5maWx0ZXIoKGJlbmNobWFyazogYmVuY2htYXJrICAmIHtuYW1lOiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICByZXR1cm4gc3luY0NoZWNrYm94LmNoZWNrZWQgJiYgYmVuY2htYXJrLm5hbWUuc3RhcnRzV2l0aChcInN5bmNcIikgfHxcbiAgICAgICAgICAgIHBhcmFsbGVsRHluYW1pY0NoZWNrYm94LmNoZWNrZWQgJiYgYmVuY2htYXJrLm5hbWUuc3RhcnRzV2l0aChcInBhcmFsbGVsLWR5bmFtaWNcIikgfHxcbiAgICAgICAgICAgIHBhcmFsbGVsVHJhbnNwaWxlZENoZWNrYm94LmNoZWNrZWQgJiYgYmVuY2htYXJrLm5hbWUuc3RhcnRzV2l0aChcInBhcmFsbGVsLXRyYW5zcGlsZWRcIik7XG4gICAgfSk7XG5cbiAgICBzdWl0ZS5vbihcImN5Y2xlXCIsIGZ1bmN0aW9uIChldmVudDogYmVuY2htYXJrLkV2ZW50KSB7XG4gICAgICAgIGFwcGVuZFRlc3RSZXN1bHRzKGV2ZW50KTtcbiAgICB9KTtcblxuICAgIHN1aXRlLm9uKFwiY29tcGxldGVcIiwgZnVuY3Rpb24gKGV2ZW50OiBiZW5jaG1hcmsuRXZlbnQpIHtcbiAgICAgICAgY29uc3QgYmVuY2htYXJrcyA9IChldmVudC5jdXJyZW50VGFyZ2V0IGFzIGJlbmNobWFyay5TdWl0ZSkubWFwKChiZW5jaG1hcms6IGJlbmNobWFyayAmIHtuYW1lOiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbmZvOiBiZW5jaG1hcmsudG9TdHJpbmcsXG4gICAgICAgICAgICAgICAgbmFtZTogYmVuY2htYXJrLm5hbWUsXG4gICAgICAgICAgICAgICAgc3RhdHM6IGJlbmNobWFyay5zdGF0cyxcbiAgICAgICAgICAgICAgICB0aW1lczogYmVuY2htYXJrLnRpbWVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBqc29uT3V0cHV0RmllbGQudGV4dENvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSh7IGJlbmNobWFya3MsIHBsYXRmb3JtfSwgdW5kZWZpbmVkLCBcIiAgICBcIik7XG4gICAgICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgc3VpdGUub24oXCJzdGFydFwiLCBpbml0UmVzdWx0VGFibGUpO1xuXG4gICAgc3VpdGUucnVuKHthc3luYzogdHJ1ZSB9KTtcbn1cblxucnVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgbWVhc3VyZSgpO1xufSk7XG5cbmZ1bmN0aW9uIGluaXRSZXN1bHRUYWJsZShldmVudDogYmVuY2htYXJrLkV2ZW50KSB7XG4gICAgY2xlYXJPdXRwdXRUYWJsZSgpO1xuXG4gICAgZnVuY3Rpb24gY2xlYXJPdXRwdXRUYWJsZSgpIHtcbiAgICAgICAgd2hpbGUgKG91dHB1dFRhYmxlLnRCb2RpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgb3V0cHV0VGFibGUucmVtb3ZlQ2hpbGQob3V0cHV0VGFibGUudEJvZGllc1swXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBib2R5ID0gb3V0cHV0VGFibGUuY3JlYXRlVEJvZHkoKTtcbiAgICAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBBcnJheTxiZW5jaG1hcmsuT3B0aW9ucz4pLmZvckVhY2goc3VpdGUgPT4ge1xuICAgICAgICBjb25zdCByb3cgPSBib2R5Lmluc2VydFJvdygpO1xuICAgICAgICBjb25zdCBbc2V0LCBuYW1lXSA9IHN1aXRlLm5hbWUhLnNwbGl0KFwiOlwiKTtcblxuICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpLnRleHRDb250ZW50ID0gc2V0O1xuICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpLnRleHRDb250ZW50ID0gbmFtZTtcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IChvdXRwdXRUYWJsZS50SGVhZC5yb3dzWzBdIGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQpLmNlbGxzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb2x1bW5zOyArK2kpIHtcbiAgICAgICAgICAgIHJvdy5pbnNlcnRDZWxsKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kVGVzdFJlc3VsdHMoZXZlbnQ6IGJlbmNobWFyay5FdmVudCkge1xuICAgIGNvbnN0IGJvZHkgPSBvdXRwdXRUYWJsZS50Qm9kaWVzWzBdIGFzIEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50O1xuICAgIGNvbnN0IGJlbmNobWFyayA9IGV2ZW50LnRhcmdldCBhcyAoYmVuY2htYXJrKTtcbiAgICBjb25zdCBpbmRleCA9IChldmVudC5jdXJyZW50VGFyZ2V0IGFzIEFycmF5PGJlbmNobWFyaz4pLmluZGV4T2YoYmVuY2htYXJrKTtcbiAgICBjb25zdCByb3cgPSBib2R5LnJvd3NbaW5kZXhdIGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG5cbiAgICByb3cuY2VsbHNbMV0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMuZGV2aWF0aW9uLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzJdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLm1lYW4udG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbM10udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMubW9lLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzRdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLnJtZS50b0ZpeGVkKDQpO1xuICAgIHJvdy5jZWxsc1s1XS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy5zZW0udG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbNl0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMudmFyaWFuY2UudG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbN10udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMuc2FtcGxlLmxlbmd0aC50b0ZpeGVkKDApO1xuICAgIHJvdy5jZWxsc1s4XS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5oei50b0ZpeGVkKDQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQcm9qZWN0cyhjb3VudDogbnVtYmVyKTogSVByb2plY3RbXSB7XG4gICAgY29uc3QgcHJvamVjdHM6IElQcm9qZWN0W10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgICBwcm9qZWN0cy5wdXNoKHtcbiAgICAgICAgICAgIHN0YXJ0WWVhcjogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTUpLFxuICAgICAgICAgICAgdG90YWxBbW91bnQ6IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwMClcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3RzO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BlcmZvcm1hbmNlLW1lYXN1cmVtZW50LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==