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
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_monte_carlo__["a" /* syncMonteCarlo */])(options);
    });
    suite.add("parallel-dynamic: Monte Carlo Math.random " + configName, function (deferred) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__dynamic_monte_carlo__["b" /* parallelMonteCarlo */])(runOptions).then(function () {
            return deferred.resolve();
        }, function () {
            return deferred.reject();
        });
    }, { defer: true });
    suite.add("sync: Monte Carlo simjs " + configName, function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__transpiled_monte_carlo__["b" /* syncMonteCarlo */])(options);
    });
    suite.add("parallel-transpiled: Monte Carlo simjs " + configName, function (deferred) {
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
    var mandelbrotOptions = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__dynamic_mandelbrot__["a" /* createMandelOptions */])(mandelbrotWidth, mandelbrotHeight, mandelbrotIterations);
    suite.add("sync: Mandelbrot " + mandelbrotWidth + "x" + mandelbrotHeight + ", " + mandelbrotIterations, function () {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__dynamic_mandelbrot__["b" /* syncMandelbrot */])(mandelbrotOptions, function () {
            return undefined;
        });
    });
    var _arr3 = [undefined, 1, 75, 150, 300, 600, 1200];

    var _loop2 = function _loop2() {
        var maxValuesPerTask = _arr3[_i4];
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

    for (var _i4 = 0; _i4 < _arr3.length; _i4++) {
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

},[14]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2JlbmNobWFyay9iZW5jaG1hcmsuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wbGF0Zm9ybS9wbGF0Zm9ybS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGVyZm9ybWFuY2UtbWVhc3VyZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsU0FBUyxrQ0FBa0MsRUFBRTtBQUNuRjtBQUNBLDhCQUE4QixHQUFHO0FBQ2pDO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxnQkFBZ0I7QUFDL0IsZUFBZSxPQUFPLFlBQVk7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekMsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxjQUFjO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHVCQUF1Qiw2QkFBNkIsZUFBZTtBQUM5RjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTyxZQUFZO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QiwwQkFBMEI7QUFDMUIsNEJBQTRCO0FBQzVCLDhCQUE4QjtBQUM5Qix5QkFBeUI7QUFDekI7QUFDQSxtQkFBbUI7QUFDbkIsaUJBQWlCO0FBQ2pCLGVBQWU7QUFDZixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxZQUFZO0FBQ1osVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztzREMxdkZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsYUFBYTtBQUMxQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsRUFBRTtBQUNmLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxFQUFFO0FBQ2YsYUFBYSxPQUFPO0FBQ3BCLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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dHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJlbmNobWFyay5qcyA8aHR0cHM6Ly9iZW5jaG1hcmtqcy5jb20vPlxuICogQ29weXJpZ2h0IDIwMTAtMjAxNiBNYXRoaWFzIEJ5bmVucyA8aHR0cHM6Ly9tdGhzLmJlLz5cbiAqIEJhc2VkIG9uIEpTTGl0bXVzLmpzLCBjb3B5cmlnaHQgUm9iZXJ0IEtpZWZmZXIgPGh0dHA6Ly9icm9vZmEuY29tLz5cbiAqIE1vZGlmaWVkIGJ5IEpvaG4tRGF2aWQgRGFsdG9uIDxodHRwOi8vYWxseW91Y2FubGVldC5jb20vPlxuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL210aHMuYmUvbWl0PlxuICovXG47KGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqIFVzZWQgYXMgYSBzYWZlIHJlZmVyZW5jZSBmb3IgYHVuZGVmaW5lZGAgaW4gcHJlIEVTNSBlbnZpcm9ubWVudHMuICovXG4gIHZhciB1bmRlZmluZWQ7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgT2JqZWN0LiAqL1xuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgICAnb2JqZWN0JzogdHJ1ZVxuICB9O1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBkZWZpbmVgLiAqL1xuICB2YXIgZnJlZURlZmluZSA9IHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kICYmIGRlZmluZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xuICB2YXIgZnJlZUV4cG9ydHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbiAgdmFyIGZyZWVNb2R1bGUgPSBvYmplY3RUeXBlc1t0eXBlb2YgbW9kdWxlXSAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcyBvciBCcm93c2VyaWZpZWQgY29kZSBhbmQgdXNlIGl0IGFzIGByb290YC4gKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSBmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlICYmIHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsO1xuICBpZiAoZnJlZUdsb2JhbCAmJiAoZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC5zZWxmID09PSBmcmVlR2xvYmFsKSkge1xuICAgIHJvb3QgPSBmcmVlR2xvYmFsO1xuICB9XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGByZXF1aXJlYC4gKi9cbiAgdmFyIGZyZWVSZXF1aXJlID0gdHlwZW9mIHJlcXVpcmUgPT0gJ2Z1bmN0aW9uJyAmJiByZXF1aXJlO1xuXG4gIC8qKiBVc2VkIHRvIGFzc2lnbiBlYWNoIGJlbmNobWFyayBhbiBpbmNyZW1lbnRlZCBpZC4gKi9cbiAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gIC8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG4gIHZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzICYmIGZyZWVFeHBvcnRzO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVjdCBwcmltaXRpdmUgdHlwZXMuICovXG4gIHZhciByZVByaW1pdGl2ZSA9IC9eKD86Ym9vbGVhbnxudW1iZXJ8c3RyaW5nfHVuZGVmaW5lZCkkLztcblxuICAvKiogVXNlZCB0byBtYWtlIGV2ZXJ5IGNvbXBpbGVkIHRlc3QgdW5pcXVlLiAqL1xuICB2YXIgdWlkQ291bnRlciA9IDA7XG5cbiAgLyoqIFVzZWQgdG8gYXNzaWduIGRlZmF1bHQgYGNvbnRleHRgIG9iamVjdCBwcm9wZXJ0aWVzLiAqL1xuICB2YXIgY29udGV4dFByb3BzID0gW1xuICAgICdBcnJheScsICdEYXRlJywgJ0Z1bmN0aW9uJywgJ01hdGgnLCAnT2JqZWN0JywgJ1JlZ0V4cCcsICdTdHJpbmcnLCAnXycsXG4gICAgJ2NsZWFyVGltZW91dCcsICdjaHJvbWUnLCAnY2hyb21pdW0nLCAnZG9jdW1lbnQnLCAnbmF2aWdhdG9yJywgJ3BoYW50b20nLFxuICAgICdwbGF0Zm9ybScsICdwcm9jZXNzJywgJ3J1bnRpbWUnLCAnc2V0VGltZW91dCdcbiAgXTtcblxuICAvKiogVXNlZCB0byBhdm9pZCBoeiBvZiBJbmZpbml0eS4gKi9cbiAgdmFyIGRpdmlzb3JzID0ge1xuICAgICcxJzogNDA5NixcbiAgICAnMic6IDUxMixcbiAgICAnMyc6IDY0LFxuICAgICc0JzogOCxcbiAgICAnNSc6IDBcbiAgfTtcblxuICAvKipcbiAgICogVC1EaXN0cmlidXRpb24gdHdvLXRhaWxlZCBjcml0aWNhbCB2YWx1ZXMgZm9yIDk1JSBjb25maWRlbmNlLlxuICAgKiBGb3IgbW9yZSBpbmZvIHNlZSBodHRwOi8vd3d3Lml0bC5uaXN0Lmdvdi9kaXY4OTgvaGFuZGJvb2svZWRhL3NlY3Rpb24zL2VkYTM2NzIuaHRtLlxuICAgKi9cbiAgdmFyIHRUYWJsZSA9IHtcbiAgICAnMSc6ICAxMi43MDYsICcyJzogIDQuMzAzLCAnMyc6ICAzLjE4MiwgJzQnOiAgMi43NzYsICc1JzogIDIuNTcxLCAnNic6ICAyLjQ0NyxcbiAgICAnNyc6ICAyLjM2NSwgICc4JzogIDIuMzA2LCAnOSc6ICAyLjI2MiwgJzEwJzogMi4yMjgsICcxMSc6IDIuMjAxLCAnMTInOiAyLjE3OSxcbiAgICAnMTMnOiAyLjE2LCAgICcxNCc6IDIuMTQ1LCAnMTUnOiAyLjEzMSwgJzE2JzogMi4xMiwgICcxNyc6IDIuMTEsICAnMTgnOiAyLjEwMSxcbiAgICAnMTknOiAyLjA5MywgICcyMCc6IDIuMDg2LCAnMjEnOiAyLjA4LCAgJzIyJzogMi4wNzQsICcyMyc6IDIuMDY5LCAnMjQnOiAyLjA2NCxcbiAgICAnMjUnOiAyLjA2LCAgICcyNic6IDIuMDU2LCAnMjcnOiAyLjA1MiwgJzI4JzogMi4wNDgsICcyOSc6IDIuMDQ1LCAnMzAnOiAyLjA0MixcbiAgICAnaW5maW5pdHknOiAxLjk2XG4gIH07XG5cbiAgLyoqXG4gICAqIENyaXRpY2FsIE1hbm4tV2hpdG5leSBVLXZhbHVlcyBmb3IgOTUlIGNvbmZpZGVuY2UuXG4gICAqIEZvciBtb3JlIGluZm8gc2VlIGh0dHA6Ly93d3cuc2FidXJjaGlsbC5jb20vSUJiaW9sb2d5L3N0YXRzLzAwMy5odG1sLlxuICAgKi9cbiAgdmFyIHVUYWJsZSA9IHtcbiAgICAnNSc6ICBbMCwgMSwgMl0sXG4gICAgJzYnOiAgWzEsIDIsIDMsIDVdLFxuICAgICc3JzogIFsxLCAzLCA1LCA2LCA4XSxcbiAgICAnOCc6ICBbMiwgNCwgNiwgOCwgMTAsIDEzXSxcbiAgICAnOSc6ICBbMiwgNCwgNywgMTAsIDEyLCAxNSwgMTddLFxuICAgICcxMCc6IFszLCA1LCA4LCAxMSwgMTQsIDE3LCAyMCwgMjNdLFxuICAgICcxMSc6IFszLCA2LCA5LCAxMywgMTYsIDE5LCAyMywgMjYsIDMwXSxcbiAgICAnMTInOiBbNCwgNywgMTEsIDE0LCAxOCwgMjIsIDI2LCAyOSwgMzMsIDM3XSxcbiAgICAnMTMnOiBbNCwgOCwgMTIsIDE2LCAyMCwgMjQsIDI4LCAzMywgMzcsIDQxLCA0NV0sXG4gICAgJzE0JzogWzUsIDksIDEzLCAxNywgMjIsIDI2LCAzMSwgMzYsIDQwLCA0NSwgNTAsIDU1XSxcbiAgICAnMTUnOiBbNSwgMTAsIDE0LCAxOSwgMjQsIDI5LCAzNCwgMzksIDQ0LCA0OSwgNTQsIDU5LCA2NF0sXG4gICAgJzE2JzogWzYsIDExLCAxNSwgMjEsIDI2LCAzMSwgMzcsIDQyLCA0NywgNTMsIDU5LCA2NCwgNzAsIDc1XSxcbiAgICAnMTcnOiBbNiwgMTEsIDE3LCAyMiwgMjgsIDM0LCAzOSwgNDUsIDUxLCA1NywgNjMsIDY3LCA3NSwgODEsIDg3XSxcbiAgICAnMTgnOiBbNywgMTIsIDE4LCAyNCwgMzAsIDM2LCA0MiwgNDgsIDU1LCA2MSwgNjcsIDc0LCA4MCwgODYsIDkzLCA5OV0sXG4gICAgJzE5JzogWzcsIDEzLCAxOSwgMjUsIDMyLCAzOCwgNDUsIDUyLCA1OCwgNjUsIDcyLCA3OCwgODUsIDkyLCA5OSwgMTA2LCAxMTNdLFxuICAgICcyMCc6IFs4LCAxNCwgMjAsIDI3LCAzNCwgNDEsIDQ4LCA1NSwgNjIsIDY5LCA3NiwgODMsIDkwLCA5OCwgMTA1LCAxMTIsIDExOSwgMTI3XSxcbiAgICAnMjEnOiBbOCwgMTUsIDIyLCAyOSwgMzYsIDQzLCA1MCwgNTgsIDY1LCA3MywgODAsIDg4LCA5NiwgMTAzLCAxMTEsIDExOSwgMTI2LCAxMzQsIDE0Ml0sXG4gICAgJzIyJzogWzksIDE2LCAyMywgMzAsIDM4LCA0NSwgNTMsIDYxLCA2OSwgNzcsIDg1LCA5MywgMTAxLCAxMDksIDExNywgMTI1LCAxMzMsIDE0MSwgMTUwLCAxNThdLFxuICAgICcyMyc6IFs5LCAxNywgMjQsIDMyLCA0MCwgNDgsIDU2LCA2NCwgNzMsIDgxLCA4OSwgOTgsIDEwNiwgMTE1LCAxMjMsIDEzMiwgMTQwLCAxNDksIDE1NywgMTY2LCAxNzVdLFxuICAgICcyNCc6IFsxMCwgMTcsIDI1LCAzMywgNDIsIDUwLCA1OSwgNjcsIDc2LCA4NSwgOTQsIDEwMiwgMTExLCAxMjAsIDEyOSwgMTM4LCAxNDcsIDE1NiwgMTY1LCAxNzQsIDE4MywgMTkyXSxcbiAgICAnMjUnOiBbMTAsIDE4LCAyNywgMzUsIDQ0LCA1MywgNjIsIDcxLCA4MCwgODksIDk4LCAxMDcsIDExNywgMTI2LCAxMzUsIDE0NSwgMTU0LCAxNjMsIDE3MywgMTgyLCAxOTIsIDIwMSwgMjExXSxcbiAgICAnMjYnOiBbMTEsIDE5LCAyOCwgMzcsIDQ2LCA1NSwgNjQsIDc0LCA4MywgOTMsIDEwMiwgMTEyLCAxMjIsIDEzMiwgMTQxLCAxNTEsIDE2MSwgMTcxLCAxODEsIDE5MSwgMjAwLCAyMTAsIDIyMCwgMjMwXSxcbiAgICAnMjcnOiBbMTEsIDIwLCAyOSwgMzgsIDQ4LCA1NywgNjcsIDc3LCA4NywgOTcsIDEwNywgMTE4LCAxMjUsIDEzOCwgMTQ3LCAxNTgsIDE2OCwgMTc4LCAxODgsIDE5OSwgMjA5LCAyMTksIDIzMCwgMjQwLCAyNTBdLFxuICAgICcyOCc6IFsxMiwgMjEsIDMwLCA0MCwgNTAsIDYwLCA3MCwgODAsIDkwLCAxMDEsIDExMSwgMTIyLCAxMzIsIDE0MywgMTU0LCAxNjQsIDE3NSwgMTg2LCAxOTYsIDIwNywgMjE4LCAyMjgsIDIzOSwgMjUwLCAyNjEsIDI3Ml0sXG4gICAgJzI5JzogWzEzLCAyMiwgMzIsIDQyLCA1MiwgNjIsIDczLCA4MywgOTQsIDEwNSwgMTE2LCAxMjcsIDEzOCwgMTQ5LCAxNjAsIDE3MSwgMTgyLCAxOTMsIDIwNCwgMjE1LCAyMjYsIDIzOCwgMjQ5LCAyNjAsIDI3MSwgMjgyLCAyOTRdLFxuICAgICczMCc6IFsxMywgMjMsIDMzLCA0MywgNTQsIDY1LCA3NiwgODcsIDk4LCAxMDksIDEyMCwgMTMxLCAxNDMsIDE1NCwgMTY2LCAxNzcsIDE4OSwgMjAwLCAyMTIsIDIyMywgMjM1LCAyNDcsIDI1OCwgMjcwLCAyODIsIDI5MywgMzA1LCAzMTddXG4gIH07XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBgQmVuY2htYXJrYCBmdW5jdGlvbiB1c2luZyB0aGUgZ2l2ZW4gYGNvbnRleHRgIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29udGV4dD1yb290XSBUaGUgY29udGV4dCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBhIG5ldyBgQmVuY2htYXJrYCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHJ1bkluQ29udGV4dChjb250ZXh0KSB7XG4gICAgLy8gRXhpdCBlYXJseSBpZiB1bmFibGUgdG8gYWNxdWlyZSBsb2Rhc2guXG4gICAgdmFyIF8gPSBjb250ZXh0ICYmIGNvbnRleHQuXyB8fCByZXF1aXJlKCdsb2Rhc2gnKSB8fCByb290Ll87XG4gICAgaWYgKCFfKSB7XG4gICAgICBCZW5jaG1hcmsucnVuSW5Db250ZXh0ID0gcnVuSW5Db250ZXh0O1xuICAgICAgcmV0dXJuIEJlbmNobWFyaztcbiAgICB9XG4gICAgLy8gQXZvaWQgaXNzdWVzIHdpdGggc29tZSBFUzMgZW52aXJvbm1lbnRzIHRoYXQgYXR0ZW1wdCB0byB1c2UgdmFsdWVzLCBuYW1lZFxuICAgIC8vIGFmdGVyIGJ1aWx0LWluIGNvbnN0cnVjdG9ycyBsaWtlIGBPYmplY3RgLCBmb3IgdGhlIGNyZWF0aW9uIG9mIGxpdGVyYWxzLlxuICAgIC8vIEVTNSBjbGVhcnMgdGhpcyB1cCBieSBzdGF0aW5nIHRoYXQgbGl0ZXJhbHMgbXVzdCB1c2UgYnVpbHQtaW4gY29uc3RydWN0b3JzLlxuICAgIC8vIFNlZSBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDExLjEuNS5cbiAgICBjb250ZXh0ID0gY29udGV4dCA/IF8uZGVmYXVsdHMocm9vdC5PYmplY3QoKSwgY29udGV4dCwgXy5waWNrKHJvb3QsIGNvbnRleHRQcm9wcykpIDogcm9vdDtcblxuICAgIC8qKiBOYXRpdmUgY29uc3RydWN0b3IgcmVmZXJlbmNlcy4gKi9cbiAgICB2YXIgQXJyYXkgPSBjb250ZXh0LkFycmF5LFxuICAgICAgICBEYXRlID0gY29udGV4dC5EYXRlLFxuICAgICAgICBGdW5jdGlvbiA9IGNvbnRleHQuRnVuY3Rpb24sXG4gICAgICAgIE1hdGggPSBjb250ZXh0Lk1hdGgsXG4gICAgICAgIE9iamVjdCA9IGNvbnRleHQuT2JqZWN0LFxuICAgICAgICBSZWdFeHAgPSBjb250ZXh0LlJlZ0V4cCxcbiAgICAgICAgU3RyaW5nID0gY29udGV4dC5TdHJpbmc7XG5cbiAgICAvKiogVXNlZCBmb3IgYEFycmF5YCBhbmQgYE9iamVjdGAgbWV0aG9kIHJlZmVyZW5jZXMuICovXG4gICAgdmFyIGFycmF5UmVmID0gW10sXG4gICAgICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICAgIC8qKiBOYXRpdmUgbWV0aG9kIHNob3J0Y3V0cy4gKi9cbiAgICB2YXIgYWJzID0gTWF0aC5hYnMsXG4gICAgICAgIGNsZWFyVGltZW91dCA9IGNvbnRleHQuY2xlYXJUaW1lb3V0LFxuICAgICAgICBmbG9vciA9IE1hdGguZmxvb3IsXG4gICAgICAgIGxvZyA9IE1hdGgubG9nLFxuICAgICAgICBtYXggPSBNYXRoLm1heCxcbiAgICAgICAgbWluID0gTWF0aC5taW4sXG4gICAgICAgIHBvdyA9IE1hdGgucG93LFxuICAgICAgICBwdXNoID0gYXJyYXlSZWYucHVzaCxcbiAgICAgICAgc2V0VGltZW91dCA9IGNvbnRleHQuc2V0VGltZW91dCxcbiAgICAgICAgc2hpZnQgPSBhcnJheVJlZi5zaGlmdCxcbiAgICAgICAgc2xpY2UgPSBhcnJheVJlZi5zbGljZSxcbiAgICAgICAgc3FydCA9IE1hdGguc3FydCxcbiAgICAgICAgdG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZyxcbiAgICAgICAgdW5zaGlmdCA9IGFycmF5UmVmLnVuc2hpZnQ7XG5cbiAgICAvKiogVXNlZCB0byBhdm9pZCBpbmNsdXNpb24gaW4gQnJvd3NlcmlmaWVkIGJ1bmRsZXMuICovXG4gICAgdmFyIHJlcSA9IHJlcXVpcmU7XG5cbiAgICAvKiogRGV0ZWN0IERPTSBkb2N1bWVudCBvYmplY3QuICovXG4gICAgdmFyIGRvYyA9IGlzSG9zdFR5cGUoY29udGV4dCwgJ2RvY3VtZW50JykgJiYgY29udGV4dC5kb2N1bWVudDtcblxuICAgIC8qKiBVc2VkIHRvIGFjY2VzcyBXYWRlIFNpbW1vbnMnIE5vZGUuanMgYG1pY3JvdGltZWAgbW9kdWxlLiAqL1xuICAgIHZhciBtaWNyb3RpbWVPYmplY3QgPSByZXEoJ21pY3JvdGltZScpO1xuXG4gICAgLyoqIFVzZWQgdG8gYWNjZXNzIE5vZGUuanMncyBoaWdoIHJlc29sdXRpb24gdGltZXIuICovXG4gICAgdmFyIHByb2Nlc3NPYmplY3QgPSBpc0hvc3RUeXBlKGNvbnRleHQsICdwcm9jZXNzJykgJiYgY29udGV4dC5wcm9jZXNzO1xuXG4gICAgLyoqIFVzZWQgdG8gcHJldmVudCBhIGByZW1vdmVDaGlsZGAgbWVtb3J5IGxlYWsgaW4gSUUgPCA5LiAqL1xuICAgIHZhciB0cmFzaCA9IGRvYyAmJiBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAvKiogVXNlZCB0byBpbnRlZ3JpdHkgY2hlY2sgY29tcGlsZWQgdGVzdHMuICovXG4gICAgdmFyIHVpZCA9ICd1aWQnICsgXy5ub3coKTtcblxuICAgIC8qKiBVc2VkIHRvIGF2b2lkIGluZmluaXRlIHJlY3Vyc2lvbiB3aGVuIG1ldGhvZHMgY2FsbCBlYWNoIG90aGVyLiAqL1xuICAgIHZhciBjYWxsZWRCeSA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQW4gb2JqZWN0IHVzZWQgdG8gZmxhZyBlbnZpcm9ubWVudHMvZmVhdHVyZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciBzdXBwb3J0ID0ge307XG5cbiAgICAoZnVuY3Rpb24oKSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogRGV0ZWN0IGlmIHJ1bm5pbmcgaW4gYSBicm93c2VyIGVudmlyb25tZW50LlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuc3VwcG9ydFxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICBzdXBwb3J0LmJyb3dzZXIgPSBkb2MgJiYgaXNIb3N0VHlwZShjb250ZXh0LCAnbmF2aWdhdG9yJykgJiYgIWlzSG9zdFR5cGUoY29udGV4dCwgJ3BoYW50b20nKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlY3QgaWYgdGhlIFRpbWVycyBBUEkgZXhpc3RzLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuc3VwcG9ydFxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICBzdXBwb3J0LnRpbWVvdXQgPSBpc0hvc3RUeXBlKGNvbnRleHQsICdzZXRUaW1lb3V0JykgJiYgaXNIb3N0VHlwZShjb250ZXh0LCAnY2xlYXJUaW1lb3V0Jyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRGV0ZWN0IGlmIGZ1bmN0aW9uIGRlY29tcGlsYXRpb24gaXMgc3VwcG9ydC5cbiAgICAgICAqXG4gICAgICAgKiBAbmFtZSBkZWNvbXBpbGF0aW9uXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLnN1cHBvcnRcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gU2FmYXJpIDIueCByZW1vdmVzIGNvbW1hcyBpbiBvYmplY3QgbGl0ZXJhbHMgZnJvbSBgRnVuY3Rpb24jdG9TdHJpbmdgIHJlc3VsdHMuXG4gICAgICAgIC8vIFNlZSBodHRwOi8vd2Viay5pdC8xMTYwOSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgICAvLyBGaXJlZm94IDMuNiBhbmQgT3BlcmEgOS4yNSBzdHJpcCBncm91cGluZyBwYXJlbnRoZXNlcyBmcm9tIGBGdW5jdGlvbiN0b1N0cmluZ2AgcmVzdWx0cy5cbiAgICAgICAgLy8gU2VlIGh0dHA6Ly9idWd6aWwubGEvNTU5NDM4IGZvciBtb3JlIGRldGFpbHMuXG4gICAgICAgIHN1cHBvcnQuZGVjb21waWxhdGlvbiA9IEZ1bmN0aW9uKFxuICAgICAgICAgICgncmV0dXJuICgnICsgKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHsgJ3gnOiAnJyArICgxICsgeCkgKyAnJywgJ3knOiAwIH07IH0pICsgJyknKVxuICAgICAgICAgIC8vIEF2b2lkIGlzc3VlcyB3aXRoIGNvZGUgYWRkZWQgYnkgSXN0YW5idWwuXG4gICAgICAgICAgLnJlcGxhY2UoL19fY292X19bXjtdKzsvZywgJycpXG4gICAgICAgICkoKSgwKS54ID09PSAnMSc7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgc3VwcG9ydC5kZWNvbXBpbGF0aW9uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSgpKTtcblxuICAgIC8qKlxuICAgICAqIFRpbWVyIG9iamVjdCB1c2VkIGJ5IGBjbG9jaygpYCBhbmQgYERlZmVycmVkI3Jlc29sdmVgLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgdGltZXIgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIHRpbWVyIG5hbWVzcGFjZSBvYmplY3Qgb3IgY29uc3RydWN0b3IuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBtZW1iZXJPZiB0aW1lclxuICAgICAgICogQHR5cGUge0Z1bmN0aW9ufE9iamVjdH1cbiAgICAgICAqL1xuICAgICAgJ25zJzogRGF0ZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTdGFydHMgdGhlIGRlZmVycmVkIHRpbWVyLlxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAbWVtYmVyT2YgdGltZXJcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZlcnJlZCBUaGUgZGVmZXJyZWQgaW5zdGFuY2UuXG4gICAgICAgKi9cbiAgICAgICdzdGFydCc6IG51bGwsIC8vIExhenkgZGVmaW5lZCBpbiBgY2xvY2soKWAuXG5cbiAgICAgIC8qKlxuICAgICAgICogU3RvcHMgdGhlIGRlZmVycmVkIHRpbWVyLlxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAbWVtYmVyT2YgdGltZXJcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZlcnJlZCBUaGUgZGVmZXJyZWQgaW5zdGFuY2UuXG4gICAgICAgKi9cbiAgICAgICdzdG9wJzogbnVsbCAvLyBMYXp5IGRlZmluZWQgaW4gYGNsb2NrKClgLlxuICAgIH07XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgQmVuY2htYXJrIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogTm90ZTogVGhlIEJlbmNobWFyayBjb25zdHJ1Y3RvciBleHBvc2VzIGEgaGFuZGZ1bCBvZiBsb2Rhc2ggbWV0aG9kcyB0b1xuICAgICAqIG1ha2Ugd29ya2luZyB3aXRoIGFycmF5cywgY29sbGVjdGlvbnMsIGFuZCBvYmplY3RzIGVhc2llci4gVGhlIGxvZGFzaFxuICAgICAqIG1ldGhvZHMgYXJlOlxuICAgICAqIFtgZWFjaC9mb3JFYWNoYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjZm9yRWFjaCksIFtgZm9yT3duYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjZm9yT3duKSxcbiAgICAgKiBbYGhhc2BdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI2hhcyksIFtgaW5kZXhPZmBdKGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI2luZGV4T2YpLFxuICAgICAqIFtgbWFwYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjbWFwKSwgYW5kIFtgcmVkdWNlYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjcmVkdWNlKVxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgQSBuYW1lIHRvIGlkZW50aWZ5IHRoZSBiZW5jaG1hcmsuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGZuIFRoZSB0ZXN0IHRvIGJlbmNobWFyay5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBiYXNpYyB1c2FnZSAodGhlIGBuZXdgIG9wZXJhdG9yIGlzIG9wdGlvbmFsKVxuICAgICAqIHZhciBiZW5jaCA9IG5ldyBCZW5jaG1hcmsoZm4pO1xuICAgICAqXG4gICAgICogLy8gb3IgdXNpbmcgYSBuYW1lIGZpcnN0XG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyaygnZm9vJywgZm4pO1xuICAgICAqXG4gICAgICogLy8gb3Igd2l0aCBvcHRpb25zXG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyaygnZm9vJywgZm4sIHtcbiAgICAgKlxuICAgICAqICAgLy8gZGlzcGxheWVkIGJ5IGBCZW5jaG1hcmsjdG9TdHJpbmdgIGlmIGBuYW1lYCBpcyBub3QgYXZhaWxhYmxlXG4gICAgICogICAnaWQnOiAneHl6JyxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBzdGFydHMgcnVubmluZ1xuICAgICAqICAgJ29uU3RhcnQnOiBvblN0YXJ0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgYWZ0ZXIgZWFjaCBydW4gY3ljbGVcbiAgICAgKiAgICdvbkN5Y2xlJzogb25DeWNsZSxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gYWJvcnRlZFxuICAgICAqICAgJ29uQWJvcnQnOiBvbkFib3J0LFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiBhIHRlc3QgZXJyb3JzXG4gICAgICogICAnb25FcnJvcic6IG9uRXJyb3IsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIHJlc2V0XG4gICAgICogICAnb25SZXNldCc6IG9uUmVzZXQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgY29tcGxldGVzIHJ1bm5pbmdcbiAgICAgKiAgICdvbkNvbXBsZXRlJzogb25Db21wbGV0ZSxcbiAgICAgKlxuICAgICAqICAgLy8gY29tcGlsZWQvY2FsbGVkIGJlZm9yZSB0aGUgdGVzdCBsb29wXG4gICAgICogICAnc2V0dXAnOiBzZXR1cCxcbiAgICAgKlxuICAgICAqICAgLy8gY29tcGlsZWQvY2FsbGVkIGFmdGVyIHRoZSB0ZXN0IGxvb3BcbiAgICAgKiAgICd0ZWFyZG93bic6IHRlYXJkb3duXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiAvLyBvciBuYW1lIGFuZCBvcHRpb25zXG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyaygnZm9vJywge1xuICAgICAqXG4gICAgICogICAvLyBhIGZsYWcgdG8gaW5kaWNhdGUgdGhlIGJlbmNobWFyayBpcyBkZWZlcnJlZFxuICAgICAqICAgJ2RlZmVyJzogdHJ1ZSxcbiAgICAgKlxuICAgICAqICAgLy8gYmVuY2htYXJrIHRlc3QgZnVuY3Rpb25cbiAgICAgKiAgICdmbic6IGZ1bmN0aW9uKGRlZmVycmVkKSB7XG4gICAgICogICAgIC8vIGNhbGwgYERlZmVycmVkI3Jlc29sdmVgIHdoZW4gdGhlIGRlZmVycmVkIHRlc3QgaXMgZmluaXNoZWRcbiAgICAgKiAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAqICAgfVxuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogLy8gb3Igb3B0aW9ucyBvbmx5XG4gICAgICogdmFyIGJlbmNoID0gbmV3IEJlbmNobWFyayh7XG4gICAgICpcbiAgICAgKiAgIC8vIGJlbmNobWFyayBuYW1lXG4gICAgICogICAnbmFtZSc6ICdmb28nLFxuICAgICAqXG4gICAgICogICAvLyBiZW5jaG1hcmsgdGVzdCBhcyBhIHN0cmluZ1xuICAgICAqICAgJ2ZuJzogJ1sxLDIsMyw0XS5zb3J0KCknXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiAvLyBhIHRlc3QncyBgdGhpc2AgYmluZGluZyBpcyBzZXQgdG8gdGhlIGJlbmNobWFyayBpbnN0YW5jZVxuICAgICAqIHZhciBiZW5jaCA9IG5ldyBCZW5jaG1hcmsoJ2ZvbycsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgJ015IG5hbWUgaXMgJy5jb25jYXQodGhpcy5uYW1lKTsgLy8gXCJNeSBuYW1lIGlzIGZvb1wiXG4gICAgICogfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gQmVuY2htYXJrKG5hbWUsIGZuLCBvcHRpb25zKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzO1xuXG4gICAgICAvLyBBbGxvdyBpbnN0YW5jZSBjcmVhdGlvbiB3aXRob3V0IHRoZSBgbmV3YCBvcGVyYXRvci5cbiAgICAgIGlmICghKGJlbmNoIGluc3RhbmNlb2YgQmVuY2htYXJrKSkge1xuICAgICAgICByZXR1cm4gbmV3IEJlbmNobWFyayhuYW1lLCBmbiwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICAvLyBKdWdnbGUgYXJndW1lbnRzLlxuICAgICAgaWYgKF8uaXNQbGFpbk9iamVjdChuYW1lKSkge1xuICAgICAgICAvLyAxIGFyZ3VtZW50IChvcHRpb25zKS5cbiAgICAgICAgb3B0aW9ucyA9IG5hbWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChfLmlzRnVuY3Rpb24obmFtZSkpIHtcbiAgICAgICAgLy8gMiBhcmd1bWVudHMgKGZuLCBvcHRpb25zKS5cbiAgICAgICAgb3B0aW9ucyA9IGZuO1xuICAgICAgICBmbiA9IG5hbWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChfLmlzUGxhaW5PYmplY3QoZm4pKSB7XG4gICAgICAgIC8vIDIgYXJndW1lbnRzIChuYW1lLCBvcHRpb25zKS5cbiAgICAgICAgb3B0aW9ucyA9IGZuO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgICAgIGJlbmNoLm5hbWUgPSBuYW1lO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIDMgYXJndW1lbnRzIChuYW1lLCBmbiBbLCBvcHRpb25zXSkuXG4gICAgICAgIGJlbmNoLm5hbWUgPSBuYW1lO1xuICAgICAgfVxuICAgICAgc2V0T3B0aW9ucyhiZW5jaCwgb3B0aW9ucyk7XG5cbiAgICAgIGJlbmNoLmlkIHx8IChiZW5jaC5pZCA9ICsrY291bnRlcik7XG4gICAgICBiZW5jaC5mbiA9PSBudWxsICYmIChiZW5jaC5mbiA9IGZuKTtcblxuICAgICAgYmVuY2guc3RhdHMgPSBjbG9uZURlZXAoYmVuY2guc3RhdHMpO1xuICAgICAgYmVuY2gudGltZXMgPSBjbG9uZURlZXAoYmVuY2gudGltZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBEZWZlcnJlZCBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2xvbmUgVGhlIGNsb25lZCBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gRGVmZXJyZWQoY2xvbmUpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IHRoaXM7XG4gICAgICBpZiAoIShkZWZlcnJlZCBpbnN0YW5jZW9mIERlZmVycmVkKSkge1xuICAgICAgICByZXR1cm4gbmV3IERlZmVycmVkKGNsb25lKTtcbiAgICAgIH1cbiAgICAgIGRlZmVycmVkLmJlbmNobWFyayA9IGNsb25lO1xuICAgICAgY2xvY2soZGVmZXJyZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBFdmVudCBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IHR5cGUgVGhlIGV2ZW50IHR5cGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gRXZlbnQodHlwZSkge1xuICAgICAgdmFyIGV2ZW50ID0gdGhpcztcbiAgICAgIGlmICh0eXBlIGluc3RhbmNlb2YgRXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpXG4gICAgICAgID8gXy5hc3NpZ24oZXZlbnQsIHsgJ3RpbWVTdGFtcCc6IF8ubm93KCkgfSwgdHlwZW9mIHR5cGUgPT0gJ3N0cmluZycgPyB7ICd0eXBlJzogdHlwZSB9IDogdHlwZSlcbiAgICAgICAgOiBuZXcgRXZlbnQodHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIFN1aXRlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogTm90ZTogRWFjaCBTdWl0ZSBpbnN0YW5jZSBoYXMgYSBoYW5kZnVsIG9mIHdyYXBwZWQgbG9kYXNoIG1ldGhvZHMgdG9cbiAgICAgKiBtYWtlIHdvcmtpbmcgd2l0aCBTdWl0ZXMgZWFzaWVyLiBUaGUgd3JhcHBlZCBsb2Rhc2ggbWV0aG9kcyBhcmU6XG4gICAgICogW2BlYWNoL2ZvckVhY2hgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNmb3JFYWNoKSwgW2BpbmRleE9mYF0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjaW5kZXhPZiksXG4gICAgICogW2BtYXBgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNtYXApLCBhbmQgW2ByZWR1Y2VgXShodHRwczovL2xvZGFzaC5jb20vZG9jcyNyZWR1Y2UpXG4gICAgICpcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgQSBuYW1lIHRvIGlkZW50aWZ5IHRoZSBzdWl0ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBiYXNpYyB1c2FnZSAodGhlIGBuZXdgIG9wZXJhdG9yIGlzIG9wdGlvbmFsKVxuICAgICAqIHZhciBzdWl0ZSA9IG5ldyBCZW5jaG1hcmsuU3VpdGU7XG4gICAgICpcbiAgICAgKiAvLyBvciB1c2luZyBhIG5hbWUgZmlyc3RcbiAgICAgKiB2YXIgc3VpdGUgPSBuZXcgQmVuY2htYXJrLlN1aXRlKCdmb28nKTtcbiAgICAgKlxuICAgICAqIC8vIG9yIHdpdGggb3B0aW9uc1xuICAgICAqIHZhciBzdWl0ZSA9IG5ldyBCZW5jaG1hcmsuU3VpdGUoJ2ZvbycsIHtcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gdGhlIHN1aXRlIHN0YXJ0cyBydW5uaW5nXG4gICAgICogICAnb25TdGFydCc6IG9uU3RhcnQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCBiZXR3ZWVuIHJ1bm5pbmcgYmVuY2htYXJrc1xuICAgICAqICAgJ29uQ3ljbGUnOiBvbkN5Y2xlLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgd2hlbiBhYm9ydGVkXG4gICAgICogICAnb25BYm9ydCc6IG9uQWJvcnQsXG4gICAgICpcbiAgICAgKiAgIC8vIGNhbGxlZCB3aGVuIGEgdGVzdCBlcnJvcnNcbiAgICAgKiAgICdvbkVycm9yJzogb25FcnJvcixcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gcmVzZXRcbiAgICAgKiAgICdvblJlc2V0Jzogb25SZXNldCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIHdoZW4gdGhlIHN1aXRlIGNvbXBsZXRlcyBydW5uaW5nXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGVcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBTdWl0ZShuYW1lLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc3VpdGUgPSB0aGlzO1xuXG4gICAgICAvLyBBbGxvdyBpbnN0YW5jZSBjcmVhdGlvbiB3aXRob3V0IHRoZSBgbmV3YCBvcGVyYXRvci5cbiAgICAgIGlmICghKHN1aXRlIGluc3RhbmNlb2YgU3VpdGUpKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3VpdGUobmFtZSwgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgICAvLyBKdWdnbGUgYXJndW1lbnRzLlxuICAgICAgaWYgKF8uaXNQbGFpbk9iamVjdChuYW1lKSkge1xuICAgICAgICAvLyAxIGFyZ3VtZW50IChvcHRpb25zKS5cbiAgICAgICAgb3B0aW9ucyA9IG5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyAyIGFyZ3VtZW50cyAobmFtZSBbLCBvcHRpb25zXSkuXG4gICAgICAgIHN1aXRlLm5hbWUgPSBuYW1lO1xuICAgICAgfVxuICAgICAgc2V0T3B0aW9ucyhzdWl0ZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmNsb25lRGVlcGAgd2hpY2ggb25seSBjbG9uZXMgYXJyYXlzIGFuZCBwbGFpblxuICAgICAqIG9iamVjdHMgYXNzaWduaW5nIGFsbCBvdGhlciB2YWx1ZXMgYnkgcmVmZXJlbmNlLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAgICAgKiBAcmV0dXJucyB7Kn0gVGhlIGNsb25lZCB2YWx1ZS5cbiAgICAgKi9cbiAgICB2YXIgY2xvbmVEZWVwID0gXy5wYXJ0aWFsKF8uY2xvbmVEZWVwV2l0aCwgXywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIC8vIE9ubHkgY2xvbmUgcHJpbWl0aXZlcywgYXJyYXlzLCBhbmQgcGxhaW4gb2JqZWN0cy5cbiAgICAgIHJldHVybiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgIV8uaXNBcnJheSh2YWx1ZSkgJiYgIV8uaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICAgICAgID8gdmFsdWVcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gZnJvbSB0aGUgZ2l2ZW4gYXJndW1lbnRzIHN0cmluZyBhbmQgYm9keS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFyZ3MgVGhlIGNvbW1hIHNlcGFyYXRlZCBmdW5jdGlvbiBhcmd1bWVudHMuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGJvZHkgVGhlIGZ1bmN0aW9uIGJvZHkuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBUaGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uKCkge1xuICAgICAgLy8gTGF6eSBkZWZpbmUuXG4gICAgICBjcmVhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uKGFyZ3MsIGJvZHkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCxcbiAgICAgICAgICAgIGFuY2hvciA9IGZyZWVEZWZpbmUgPyBmcmVlRGVmaW5lLmFtZCA6IEJlbmNobWFyayxcbiAgICAgICAgICAgIHByb3AgPSB1aWQgKyAnY3JlYXRlRnVuY3Rpb24nO1xuXG4gICAgICAgIHJ1blNjcmlwdCgoZnJlZURlZmluZSA/ICdkZWZpbmUuYW1kLicgOiAnQmVuY2htYXJrLicpICsgcHJvcCArICc9ZnVuY3Rpb24oJyArIGFyZ3MgKyAnKXsnICsgYm9keSArICd9Jyk7XG4gICAgICAgIHJlc3VsdCA9IGFuY2hvcltwcm9wXTtcbiAgICAgICAgZGVsZXRlIGFuY2hvcltwcm9wXTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH07XG4gICAgICAvLyBGaXggSmFlZ2VyTW9ua2V5IGJ1Zy5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwOi8vYnVnemlsLmxhLzYzOTcyMC5cbiAgICAgIGNyZWF0ZUZ1bmN0aW9uID0gc3VwcG9ydC5icm93c2VyICYmIChjcmVhdGVGdW5jdGlvbignJywgJ3JldHVyblwiJyArIHVpZCArICdcIicpIHx8IF8ubm9vcCkoKSA9PSB1aWQgPyBjcmVhdGVGdW5jdGlvbiA6IEZ1bmN0aW9uO1xuICAgICAgcmV0dXJuIGNyZWF0ZUZ1bmN0aW9uLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVsYXkgdGhlIGV4ZWN1dGlvbiBvZiBhIGZ1bmN0aW9uIGJhc2VkIG9uIHRoZSBiZW5jaG1hcmsncyBgZGVsYXlgIHByb3BlcnR5LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYmVuY2ggVGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZm4gVGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVsYXkoYmVuY2gsIGZuKSB7XG4gICAgICBiZW5jaC5fdGltZXJJZCA9IF8uZGVsYXkoZm4sIGJlbmNoLmRlbGF5ICogMWUzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95cyB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50IFRoZSBlbGVtZW50IHRvIGRlc3Ryb3kuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVzdHJveUVsZW1lbnQoZWxlbWVudCkge1xuICAgICAgdHJhc2guYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICB0cmFzaC5pbm5lckhUTUwgPSAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBmaXJzdCBhcmd1bWVudCBmcm9tIGEgZnVuY3Rpb24ncyBzb3VyY2UuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgYXJndW1lbnQgbmFtZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRGaXJzdEFyZ3VtZW50KGZuKSB7XG4gICAgICByZXR1cm4gKCFfLmhhcyhmbiwgJ3RvU3RyaW5nJykgJiZcbiAgICAgICAgKC9eW1xccyhdKmZ1bmN0aW9uW14oXSpcXCgoW15cXHMsKV0rKS8uZXhlYyhmbikgfHwgMClbMV0pIHx8ICcnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbXB1dGVzIHRoZSBhcml0aG1ldGljIG1lYW4gb2YgYSBzYW1wbGUuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNhbXBsZSBUaGUgc2FtcGxlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBtZWFuLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE1lYW4oc2FtcGxlKSB7XG4gICAgICByZXR1cm4gKF8ucmVkdWNlKHNhbXBsZSwgZnVuY3Rpb24oc3VtLCB4KSB7XG4gICAgICAgIHJldHVybiBzdW0gKyB4O1xuICAgICAgfSkgLyBzYW1wbGUubGVuZ3RoKSB8fCAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNvdXJjZSBjb2RlIG9mIGEgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZnVuY3Rpb24ncyBzb3VyY2UgY29kZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTb3VyY2UoZm4pIHtcbiAgICAgIHZhciByZXN1bHQgPSAnJztcbiAgICAgIGlmIChpc1N0cmluZ2FibGUoZm4pKSB7XG4gICAgICAgIHJlc3VsdCA9IFN0cmluZyhmbik7XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuZGVjb21waWxhdGlvbikge1xuICAgICAgICAvLyBFc2NhcGUgdGhlIGB7YCBmb3IgRmlyZWZveCAxLlxuICAgICAgICByZXN1bHQgPSBfLnJlc3VsdCgvXltee10rXFx7KFtcXHNcXFNdKilcXH1cXHMqJC8uZXhlYyhmbiksIDEpO1xuICAgICAgfVxuICAgICAgLy8gVHJpbSBzdHJpbmcuXG4gICAgICByZXN1bHQgPSAocmVzdWx0IHx8ICcnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG5cbiAgICAgIC8vIERldGVjdCBzdHJpbmdzIGNvbnRhaW5pbmcgb25seSB0aGUgXCJ1c2Ugc3RyaWN0XCIgZGlyZWN0aXZlLlxuICAgICAgcmV0dXJuIC9eKD86XFwvXFwqK1tcXHdcXFddKj9cXCpcXC98XFwvXFwvLio/W1xcblxcclxcdTIwMjhcXHUyMDI5XXxcXHMpKihbXCInXSl1c2Ugc3RyaWN0XFwxOz8kLy50ZXN0KHJlc3VsdClcbiAgICAgICAgPyAnJ1xuICAgICAgICA6IHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYW4gb2JqZWN0IGlzIG9mIHRoZSBzcGVjaWZpZWQgY2xhc3MuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBjbGFzcy5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlIGlzIG9mIHRoZSBzcGVjaWZpZWQgY2xhc3MsIGVsc2UgYGZhbHNlYC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0NsYXNzT2YodmFsdWUsIG5hbWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhvc3Qgb2JqZWN0cyBjYW4gcmV0dXJuIHR5cGUgdmFsdWVzIHRoYXQgYXJlIGRpZmZlcmVudCBmcm9tIHRoZWlyIGFjdHVhbFxuICAgICAqIGRhdGEgdHlwZS4gVGhlIG9iamVjdHMgd2UgYXJlIGNvbmNlcm5lZCB3aXRoIHVzdWFsbHkgcmV0dXJuIG5vbi1wcmltaXRpdmVcbiAgICAgKiB0eXBlcyBvZiBcIm9iamVjdFwiLCBcImZ1bmN0aW9uXCIsIG9yIFwidW5rbm93blwiLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgb3duZXIgb2YgdGhlIHByb3BlcnR5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSBUaGUgcHJvcGVydHkgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpcyBhIG5vbi1wcmltaXRpdmUsIGVsc2UgYGZhbHNlYC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0hvc3RUeXBlKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgdHlwZSA9IHR5cGVvZiBvYmplY3RbcHJvcGVydHldO1xuICAgICAgcmV0dXJuICFyZVByaW1pdGl2ZS50ZXN0KHR5cGUpICYmICh0eXBlICE9ICdvYmplY3QnIHx8ICEhb2JqZWN0W3Byb3BlcnR5XSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgdmFsdWUgY2FuIGJlIHNhZmVseSBjb2VyY2VkIHRvIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlIGNhbiBiZSBjb2VyY2VkLCBlbHNlIGBmYWxzZWAuXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNTdHJpbmdhYmxlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gXy5pc1N0cmluZyh2YWx1ZSkgfHwgKF8uaGFzKHZhbHVlLCAndG9TdHJpbmcnKSAmJiBfLmlzRnVuY3Rpb24odmFsdWUudG9TdHJpbmcpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIHdyYXBwZXIgYXJvdW5kIGByZXF1aXJlYCB0byBzdXBwcmVzcyBgbW9kdWxlIG1pc3NpbmdgIGVycm9ycy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFRoZSBtb2R1bGUgaWQuXG4gICAgICogQHJldHVybnMgeyp9IFRoZSBleHBvcnRlZCBtb2R1bGUgb3IgYG51bGxgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlcXVpcmUoaWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBmcmVlRXhwb3J0cyAmJiBmcmVlUmVxdWlyZShpZCk7XG4gICAgICB9IGNhdGNoKGUpIHt9XG4gICAgICByZXR1cm4gcmVzdWx0IHx8IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVucyBhIHNuaXBwZXQgb2YgSmF2YVNjcmlwdCB2aWEgc2NyaXB0IGluamVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgVGhlIGNvZGUgdG8gcnVuLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJ1blNjcmlwdChjb2RlKSB7XG4gICAgICB2YXIgYW5jaG9yID0gZnJlZURlZmluZSA/IGRlZmluZS5hbWQgOiBCZW5jaG1hcmssXG4gICAgICAgICAgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuICAgICAgICAgIHNpYmxpbmcgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpWzBdLFxuICAgICAgICAgIHBhcmVudCA9IHNpYmxpbmcucGFyZW50Tm9kZSxcbiAgICAgICAgICBwcm9wID0gdWlkICsgJ3J1blNjcmlwdCcsXG4gICAgICAgICAgcHJlZml4ID0gJygnICsgKGZyZWVEZWZpbmUgPyAnZGVmaW5lLmFtZC4nIDogJ0JlbmNobWFyay4nKSArIHByb3AgKyAnfHxmdW5jdGlvbigpe30pKCk7JztcblxuICAgICAgLy8gRmlyZWZveCAyLjAuMC4yIGNhbm5vdCB1c2Ugc2NyaXB0IGluamVjdGlvbiBhcyBpbnRlbmRlZCBiZWNhdXNlIGl0IGV4ZWN1dGVzXG4gICAgICAvLyBhc3luY2hyb25vdXNseSwgYnV0IHRoYXQncyBPSyBiZWNhdXNlIHNjcmlwdCBpbmplY3Rpb24gaXMgb25seSB1c2VkIHRvIGF2b2lkXG4gICAgICAvLyB0aGUgcHJldmlvdXNseSBjb21tZW50ZWQgSmFlZ2VyTW9ua2V5IGJ1Zy5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgaW5zZXJ0ZWQgc2NyaXB0ICpiZWZvcmUqIHJ1bm5pbmcgdGhlIGNvZGUgdG8gYXZvaWQgZGlmZmVyZW5jZXNcbiAgICAgICAgLy8gaW4gdGhlIGV4cGVjdGVkIHNjcmlwdCBlbGVtZW50IGNvdW50L29yZGVyIG9mIHRoZSBkb2N1bWVudC5cbiAgICAgICAgc2NyaXB0LmFwcGVuZENoaWxkKGRvYy5jcmVhdGVUZXh0Tm9kZShwcmVmaXggKyBjb2RlKSk7XG4gICAgICAgIGFuY2hvcltwcm9wXSA9IGZ1bmN0aW9uKCkgeyBkZXN0cm95RWxlbWVudChzY3JpcHQpOyB9O1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5jbG9uZU5vZGUoZmFsc2UpO1xuICAgICAgICBzaWJsaW5nID0gbnVsbDtcbiAgICAgICAgc2NyaXB0LnRleHQgPSBjb2RlO1xuICAgICAgfVxuICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShzY3JpcHQsIHNpYmxpbmcpO1xuICAgICAgZGVsZXRlIGFuY2hvcltwcm9wXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGhlbHBlciBmdW5jdGlvbiBmb3Igc2V0dGluZyBvcHRpb25zL2V2ZW50IGhhbmRsZXJzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBiZW5jaG1hcmsgb3Igc3VpdGUgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zIG9iamVjdC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXRPcHRpb25zKG9iamVjdCwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9iamVjdC5vcHRpb25zID0gXy5hc3NpZ24oe30sIGNsb25lRGVlcChvYmplY3QuY29uc3RydWN0b3Iub3B0aW9ucyksIGNsb25lRGVlcChvcHRpb25zKSk7XG5cbiAgICAgIF8uZm9yT3duKG9wdGlvbnMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzLlxuICAgICAgICAgIGlmICgvXm9uW0EtWl0vLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgXy5lYWNoKGtleS5zcGxpdCgnICcpLCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgICAgb2JqZWN0Lm9uKGtleS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFfLmhhcyhvYmplY3QsIGtleSkpIHtcbiAgICAgICAgICAgIG9iamVjdFtrZXldID0gY2xvbmVEZWVwKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgY3ljbGluZy9jb21wbGV0aW5nIHRoZSBkZWZlcnJlZCBiZW5jaG1hcmsuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkRlZmVycmVkXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVzb2x2ZSgpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IHRoaXMsXG4gICAgICAgICAgY2xvbmUgPSBkZWZlcnJlZC5iZW5jaG1hcmssXG4gICAgICAgICAgYmVuY2ggPSBjbG9uZS5fb3JpZ2luYWw7XG5cbiAgICAgIGlmIChiZW5jaC5hYm9ydGVkKSB7XG4gICAgICAgIC8vIGN5Y2xlKCkgLT4gY2xvbmUgY3ljbGUvY29tcGxldGUgZXZlbnQgLT4gY29tcHV0ZSgpJ3MgaW52b2tlZCBiZW5jaC5ydW4oKSBjeWNsZS9jb21wbGV0ZS5cbiAgICAgICAgZGVmZXJyZWQudGVhcmRvd24oKTtcbiAgICAgICAgY2xvbmUucnVubmluZyA9IGZhbHNlO1xuICAgICAgICBjeWNsZShkZWZlcnJlZCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICgrK2RlZmVycmVkLmN5Y2xlcyA8IGNsb25lLmNvdW50KSB7XG4gICAgICAgIGNsb25lLmNvbXBpbGVkLmNhbGwoZGVmZXJyZWQsIGNvbnRleHQsIHRpbWVyKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aW1lci5zdG9wKGRlZmVycmVkKTtcbiAgICAgICAgZGVmZXJyZWQudGVhcmRvd24oKTtcbiAgICAgICAgZGVsYXkoY2xvbmUsIGZ1bmN0aW9uKCkgeyBjeWNsZShkZWZlcnJlZCk7IH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIEEgZ2VuZXJpYyBgQXJyYXkjZmlsdGVyYCBsaWtlIG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ30gY2FsbGJhY2sgVGhlIGZ1bmN0aW9uL2FsaWFzIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gQSBuZXcgYXJyYXkgb2YgdmFsdWVzIHRoYXQgcGFzc2VkIGNhbGxiYWNrIGZpbHRlci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gZ2V0IG9kZCBudW1iZXJzXG4gICAgICogQmVuY2htYXJrLmZpbHRlcihbMSwgMiwgMywgNCwgNV0sIGZ1bmN0aW9uKG4pIHtcbiAgICAgKiAgIHJldHVybiBuICUgMjtcbiAgICAgKiB9KTsgLy8gLT4gWzEsIDMsIDVdO1xuICAgICAqXG4gICAgICogLy8gZ2V0IGZhc3Rlc3QgYmVuY2htYXJrc1xuICAgICAqIEJlbmNobWFyay5maWx0ZXIoYmVuY2hlcywgJ2Zhc3Rlc3QnKTtcbiAgICAgKlxuICAgICAqIC8vIGdldCBzbG93ZXN0IGJlbmNobWFya3NcbiAgICAgKiBCZW5jaG1hcmsuZmlsdGVyKGJlbmNoZXMsICdzbG93ZXN0Jyk7XG4gICAgICpcbiAgICAgKiAvLyBnZXQgYmVuY2htYXJrcyB0aGF0IGNvbXBsZXRlZCB3aXRob3V0IGVycm9yaW5nXG4gICAgICogQmVuY2htYXJrLmZpbHRlcihiZW5jaGVzLCAnc3VjY2Vzc2Z1bCcpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlcihhcnJheSwgY2FsbGJhY2spIHtcbiAgICAgIGlmIChjYWxsYmFjayA9PT0gJ3N1Y2Nlc3NmdWwnKSB7XG4gICAgICAgIC8vIENhbGxiYWNrIHRvIGV4Y2x1ZGUgdGhvc2UgdGhhdCBhcmUgZXJyb3JlZCwgdW5ydW4sIG9yIGhhdmUgaHogb2YgSW5maW5pdHkuXG4gICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oYmVuY2gpIHtcbiAgICAgICAgICByZXR1cm4gYmVuY2guY3ljbGVzICYmIF8uaXNGaW5pdGUoYmVuY2guaHopICYmICFiZW5jaC5lcnJvcjtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGNhbGxiYWNrID09PSAnZmFzdGVzdCcgfHwgY2FsbGJhY2sgPT09ICdzbG93ZXN0Jykge1xuICAgICAgICAvLyBHZXQgc3VjY2Vzc2Z1bCwgc29ydCBieSBwZXJpb2QgKyBtYXJnaW4gb2YgZXJyb3IsIGFuZCBmaWx0ZXIgZmFzdGVzdC9zbG93ZXN0LlxuICAgICAgICB2YXIgcmVzdWx0ID0gZmlsdGVyKGFycmF5LCAnc3VjY2Vzc2Z1bCcpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIGEgPSBhLnN0YXRzOyBiID0gYi5zdGF0cztcbiAgICAgICAgICByZXR1cm4gKGEubWVhbiArIGEubW9lID4gYi5tZWFuICsgYi5tb2UgPyAxIDogLTEpICogKGNhbGxiYWNrID09PSAnZmFzdGVzdCcgPyAxIDogLTEpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gXy5maWx0ZXIocmVzdWx0LCBmdW5jdGlvbihiZW5jaCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHRbMF0uY29tcGFyZShiZW5jaCkgPT0gMDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhIG51bWJlciB0byBhIG1vcmUgcmVhZGFibGUgY29tbWEtc2VwYXJhdGVkIHN0cmluZyByZXByZXNlbnRhdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciBUaGUgbnVtYmVyIHRvIGNvbnZlcnQuXG4gICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIG1vcmUgcmVhZGFibGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvcm1hdE51bWJlcihudW1iZXIpIHtcbiAgICAgIG51bWJlciA9IFN0cmluZyhudW1iZXIpLnNwbGl0KCcuJyk7XG4gICAgICByZXR1cm4gbnVtYmVyWzBdLnJlcGxhY2UoLyg/PSg/OlxcZHszfSkrJCkoPyFcXGIpL2csICcsJykgK1xuICAgICAgICAobnVtYmVyWzFdID8gJy4nICsgbnVtYmVyWzFdIDogJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgYSBtZXRob2Qgb24gYWxsIGl0ZW1zIGluIGFuIGFycmF5LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBiZW5jaGVzIEFycmF5IG9mIGJlbmNobWFya3MgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRvIGludm9rZSBPUiBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmdzXSBBcmd1bWVudHMgdG8gaW52b2tlIHRoZSBtZXRob2Qgd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IEEgbmV3IGFycmF5IG9mIHZhbHVlcyByZXR1cm5lZCBmcm9tIGVhY2ggbWV0aG9kIGludm9rZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGludm9rZSBgcmVzZXRgIG9uIGFsbCBiZW5jaG1hcmtzXG4gICAgICogQmVuY2htYXJrLmludm9rZShiZW5jaGVzLCAncmVzZXQnKTtcbiAgICAgKlxuICAgICAqIC8vIGludm9rZSBgZW1pdGAgd2l0aCBhcmd1bWVudHNcbiAgICAgKiBCZW5jaG1hcmsuaW52b2tlKGJlbmNoZXMsICdlbWl0JywgJ2NvbXBsZXRlJywgbGlzdGVuZXIpO1xuICAgICAqXG4gICAgICogLy8gaW52b2tlIGBydW4odHJ1ZSlgLCB0cmVhdCBiZW5jaG1hcmtzIGFzIGEgcXVldWUsIGFuZCByZWdpc3RlciBpbnZva2UgY2FsbGJhY2tzXG4gICAgICogQmVuY2htYXJrLmludm9rZShiZW5jaGVzLCB7XG4gICAgICpcbiAgICAgKiAgIC8vIGludm9rZSB0aGUgYHJ1bmAgbWV0aG9kXG4gICAgICogICAnbmFtZSc6ICdydW4nLFxuICAgICAqXG4gICAgICogICAvLyBwYXNzIGEgc2luZ2xlIGFyZ3VtZW50XG4gICAgICogICAnYXJncyc6IHRydWUsXG4gICAgICpcbiAgICAgKiAgIC8vIHRyZWF0IGFzIHF1ZXVlLCByZW1vdmluZyBiZW5jaG1hcmtzIGZyb20gZnJvbnQgb2YgYGJlbmNoZXNgIHVudGlsIGVtcHR5XG4gICAgICogICAncXVldWVkJzogdHJ1ZSxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIGJlZm9yZSBhbnkgYmVuY2htYXJrcyBoYXZlIGJlZW4gaW52b2tlZC5cbiAgICAgKiAgICdvblN0YXJ0Jzogb25TdGFydCxcbiAgICAgKlxuICAgICAqICAgLy8gY2FsbGVkIGJldHdlZW4gaW52b2tpbmcgYmVuY2htYXJrc1xuICAgICAqICAgJ29uQ3ljbGUnOiBvbkN5Y2xlLFxuICAgICAqXG4gICAgICogICAvLyBjYWxsZWQgYWZ0ZXIgYWxsIGJlbmNobWFya3MgaGF2ZSBiZWVuIGludm9rZWQuXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGVcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbnZva2UoYmVuY2hlcywgbmFtZSkge1xuICAgICAgdmFyIGFyZ3MsXG4gICAgICAgICAgYmVuY2gsXG4gICAgICAgICAgcXVldWVkLFxuICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgZXZlbnRQcm9wcyA9IHsgJ2N1cnJlbnRUYXJnZXQnOiBiZW5jaGVzIH0sXG4gICAgICAgICAgb3B0aW9ucyA9IHsgJ29uU3RhcnQnOiBfLm5vb3AsICdvbkN5Y2xlJzogXy5ub29wLCAnb25Db21wbGV0ZSc6IF8ubm9vcCB9LFxuICAgICAgICAgIHJlc3VsdCA9IF8udG9BcnJheShiZW5jaGVzKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBJbnZva2VzIHRoZSBtZXRob2Qgb2YgdGhlIGN1cnJlbnQgb2JqZWN0IGFuZCBpZiBzeW5jaHJvbm91cywgZmV0Y2hlcyB0aGUgbmV4dC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZXhlY3V0ZSgpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyxcbiAgICAgICAgICAgIGFzeW5jID0gaXNBc3luYyhiZW5jaCk7XG5cbiAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgLy8gVXNlIGBnZXROZXh0YCBhcyB0aGUgZmlyc3QgbGlzdGVuZXIuXG4gICAgICAgICAgYmVuY2gub24oJ2NvbXBsZXRlJywgZ2V0TmV4dCk7XG4gICAgICAgICAgbGlzdGVuZXJzID0gYmVuY2guZXZlbnRzLmNvbXBsZXRlO1xuICAgICAgICAgIGxpc3RlbmVycy5zcGxpY2UoMCwgMCwgbGlzdGVuZXJzLnBvcCgpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFeGVjdXRlIG1ldGhvZC5cbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IF8uaXNGdW5jdGlvbihiZW5jaCAmJiBiZW5jaFtuYW1lXSkgPyBiZW5jaFtuYW1lXS5hcHBseShiZW5jaCwgYXJncykgOiB1bmRlZmluZWQ7XG4gICAgICAgIC8vIElmIHN5bmNocm9ub3VzIHJldHVybiBgdHJ1ZWAgdW50aWwgZmluaXNoZWQuXG4gICAgICAgIHJldHVybiAhYXN5bmMgJiYgZ2V0TmV4dCgpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEZldGNoZXMgdGhlIG5leHQgYmVuY2ggb3IgZXhlY3V0ZXMgYG9uQ29tcGxldGVgIGNhbGxiYWNrLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBnZXROZXh0KGV2ZW50KSB7XG4gICAgICAgIHZhciBjeWNsZUV2ZW50LFxuICAgICAgICAgICAgbGFzdCA9IGJlbmNoLFxuICAgICAgICAgICAgYXN5bmMgPSBpc0FzeW5jKGxhc3QpO1xuXG4gICAgICAgIGlmIChhc3luYykge1xuICAgICAgICAgIGxhc3Qub2ZmKCdjb21wbGV0ZScsIGdldE5leHQpO1xuICAgICAgICAgIGxhc3QuZW1pdCgnY29tcGxldGUnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbWl0IFwiY3ljbGVcIiBldmVudC5cbiAgICAgICAgZXZlbnRQcm9wcy50eXBlID0gJ2N5Y2xlJztcbiAgICAgICAgZXZlbnRQcm9wcy50YXJnZXQgPSBsYXN0O1xuICAgICAgICBjeWNsZUV2ZW50ID0gRXZlbnQoZXZlbnRQcm9wcyk7XG4gICAgICAgIG9wdGlvbnMub25DeWNsZS5jYWxsKGJlbmNoZXMsIGN5Y2xlRXZlbnQpO1xuXG4gICAgICAgIC8vIENob29zZSBuZXh0IGJlbmNobWFyayBpZiBub3QgZXhpdGluZyBlYXJseS5cbiAgICAgICAgaWYgKCFjeWNsZUV2ZW50LmFib3J0ZWQgJiYgcmFpc2VJbmRleCgpICE9PSBmYWxzZSkge1xuICAgICAgICAgIGJlbmNoID0gcXVldWVkID8gYmVuY2hlc1swXSA6IHJlc3VsdFtpbmRleF07XG4gICAgICAgICAgaWYgKGlzQXN5bmMoYmVuY2gpKSB7XG4gICAgICAgICAgICBkZWxheShiZW5jaCwgZXhlY3V0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGlmIHByZXZpb3VzbHkgYXN5bmNocm9ub3VzIGJ1dCBub3cgc3luY2hyb25vdXMuXG4gICAgICAgICAgICB3aGlsZSAoZXhlY3V0ZSgpKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIENvbnRpbnVlIHN5bmNocm9ub3VzIGV4ZWN1dGlvbi5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBFbWl0IFwiY29tcGxldGVcIiBldmVudC5cbiAgICAgICAgICBldmVudFByb3BzLnR5cGUgPSAnY29tcGxldGUnO1xuICAgICAgICAgIG9wdGlvbnMub25Db21wbGV0ZS5jYWxsKGJlbmNoZXMsIEV2ZW50KGV2ZW50UHJvcHMpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXaGVuIHVzZWQgYXMgYSBsaXN0ZW5lciBgZXZlbnQuYWJvcnRlZCA9IHRydWVgIHdpbGwgY2FuY2VsIHRoZSByZXN0IG9mXG4gICAgICAgIC8vIHRoZSBcImNvbXBsZXRlXCIgbGlzdGVuZXJzIGJlY2F1c2UgdGhleSB3ZXJlIGFscmVhZHkgY2FsbGVkIGFib3ZlIGFuZCB3aGVuXG4gICAgICAgIC8vIHVzZWQgYXMgcGFydCBvZiBgZ2V0TmV4dGAgdGhlIGByZXR1cm4gZmFsc2VgIHdpbGwgZXhpdCB0aGUgZXhlY3V0aW9uIHdoaWxlLWxvb3AuXG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgIGV2ZW50LmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrcyBpZiBpbnZva2luZyBgQmVuY2htYXJrI3J1bmAgd2l0aCBhc3luY2hyb25vdXMgY3ljbGVzLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBpc0FzeW5jKG9iamVjdCkge1xuICAgICAgICAvLyBBdm9pZCB1c2luZyBgaW5zdGFuY2VvZmAgaGVyZSBiZWNhdXNlIG9mIElFIG1lbW9yeSBsZWFrIGlzc3VlcyB3aXRoIGhvc3Qgb2JqZWN0cy5cbiAgICAgICAgdmFyIGFzeW5jID0gYXJnc1swXSAmJiBhcmdzWzBdLmFzeW5jO1xuICAgICAgICByZXR1cm4gbmFtZSA9PSAncnVuJyAmJiAob2JqZWN0IGluc3RhbmNlb2YgQmVuY2htYXJrKSAmJlxuICAgICAgICAgICgoYXN5bmMgPT0gbnVsbCA/IG9iamVjdC5vcHRpb25zLmFzeW5jIDogYXN5bmMpICYmIHN1cHBvcnQudGltZW91dCB8fCBvYmplY3QuZGVmZXIpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJhaXNlcyBgaW5kZXhgIHRvIHRoZSBuZXh0IGRlZmluZWQgaW5kZXggb3IgcmV0dXJucyBgZmFsc2VgLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiByYWlzZUluZGV4KCkge1xuICAgICAgICBpbmRleCsrO1xuXG4gICAgICAgIC8vIElmIHF1ZXVlZCByZW1vdmUgdGhlIHByZXZpb3VzIGJlbmNoLlxuICAgICAgICBpZiAocXVldWVkICYmIGluZGV4ID4gMCkge1xuICAgICAgICAgIHNoaWZ0LmNhbGwoYmVuY2hlcyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCB0aGUgbGFzdCBpbmRleCB0aGVuIHJldHVybiBgZmFsc2VgLlxuICAgICAgICByZXR1cm4gKHF1ZXVlZCA/IGJlbmNoZXMubGVuZ3RoIDogaW5kZXggPCByZXN1bHQubGVuZ3RoKVxuICAgICAgICAgID8gaW5kZXhcbiAgICAgICAgICA6IChpbmRleCA9IGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIC8vIEp1Z2dsZSBhcmd1bWVudHMuXG4gICAgICBpZiAoXy5pc1N0cmluZyhuYW1lKSkge1xuICAgICAgICAvLyAyIGFyZ3VtZW50cyAoYXJyYXksIG5hbWUpLlxuICAgICAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gMiBhcmd1bWVudHMgKGFycmF5LCBvcHRpb25zKS5cbiAgICAgICAgb3B0aW9ucyA9IF8uYXNzaWduKG9wdGlvbnMsIG5hbWUpO1xuICAgICAgICBuYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgICAgICBhcmdzID0gXy5pc0FycmF5KGFyZ3MgPSAnYXJncycgaW4gb3B0aW9ucyA/IG9wdGlvbnMuYXJncyA6IFtdKSA/IGFyZ3MgOiBbYXJnc107XG4gICAgICAgIHF1ZXVlZCA9IG9wdGlvbnMucXVldWVkO1xuICAgICAgfVxuICAgICAgLy8gU3RhcnQgaXRlcmF0aW5nIG92ZXIgdGhlIGFycmF5LlxuICAgICAgaWYgKHJhaXNlSW5kZXgoKSAhPT0gZmFsc2UpIHtcbiAgICAgICAgLy8gRW1pdCBcInN0YXJ0XCIgZXZlbnQuXG4gICAgICAgIGJlbmNoID0gcmVzdWx0W2luZGV4XTtcbiAgICAgICAgZXZlbnRQcm9wcy50eXBlID0gJ3N0YXJ0JztcbiAgICAgICAgZXZlbnRQcm9wcy50YXJnZXQgPSBiZW5jaDtcbiAgICAgICAgb3B0aW9ucy5vblN0YXJ0LmNhbGwoYmVuY2hlcywgRXZlbnQoZXZlbnRQcm9wcykpO1xuXG4gICAgICAgIC8vIEVuZCBlYXJseSBpZiB0aGUgc3VpdGUgd2FzIGFib3J0ZWQgaW4gYW4gXCJvblN0YXJ0XCIgbGlzdGVuZXIuXG4gICAgICAgIGlmIChuYW1lID09ICdydW4nICYmIChiZW5jaGVzIGluc3RhbmNlb2YgU3VpdGUpICYmIGJlbmNoZXMuYWJvcnRlZCkge1xuICAgICAgICAgIC8vIEVtaXQgXCJjeWNsZVwiIGV2ZW50LlxuICAgICAgICAgIGV2ZW50UHJvcHMudHlwZSA9ICdjeWNsZSc7XG4gICAgICAgICAgb3B0aW9ucy5vbkN5Y2xlLmNhbGwoYmVuY2hlcywgRXZlbnQoZXZlbnRQcm9wcykpO1xuICAgICAgICAgIC8vIEVtaXQgXCJjb21wbGV0ZVwiIGV2ZW50LlxuICAgICAgICAgIGV2ZW50UHJvcHMudHlwZSA9ICdjb21wbGV0ZSc7XG4gICAgICAgICAgb3B0aW9ucy5vbkNvbXBsZXRlLmNhbGwoYmVuY2hlcywgRXZlbnQoZXZlbnRQcm9wcykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFN0YXJ0IG1ldGhvZCBleGVjdXRpb24uXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChpc0FzeW5jKGJlbmNoKSkge1xuICAgICAgICAgICAgZGVsYXkoYmVuY2gsIGV4ZWN1dGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aGlsZSAoZXhlY3V0ZSgpKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgc3RyaW5nIG9mIGpvaW5lZCBhcnJheSB2YWx1ZXMgb3Igb2JqZWN0IGtleS12YWx1ZSBwYWlycy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG9wZXJhdGUgb24uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtzZXBhcmF0b3IxPScsJ10gVGhlIHNlcGFyYXRvciB1c2VkIGJldHdlZW4ga2V5LXZhbHVlIHBhaXJzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbc2VwYXJhdG9yMj0nOiAnXSBUaGUgc2VwYXJhdG9yIHVzZWQgYmV0d2VlbiBrZXlzIGFuZCB2YWx1ZXMuXG4gICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIGpvaW5lZCByZXN1bHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gam9pbihvYmplY3QsIHNlcGFyYXRvcjEsIHNlcGFyYXRvcjIpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgICBsZW5ndGggPSAob2JqZWN0ID0gT2JqZWN0KG9iamVjdCkpLmxlbmd0aCxcbiAgICAgICAgICBhcnJheUxpa2UgPSBsZW5ndGggPT09IGxlbmd0aCA+Pj4gMDtcblxuICAgICAgc2VwYXJhdG9yMiB8fCAoc2VwYXJhdG9yMiA9ICc6ICcpO1xuICAgICAgXy5lYWNoKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXN1bHQucHVzaChhcnJheUxpa2UgPyB2YWx1ZSA6IGtleSArIHNlcGFyYXRvcjIgKyB2YWx1ZSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQuam9pbihzZXBhcmF0b3IxIHx8ICcsJyk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQWJvcnRzIGFsbCBiZW5jaG1hcmtzIGluIHRoZSBzdWl0ZS5cbiAgICAgKlxuICAgICAqIEBuYW1lIGFib3J0XG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzdWl0ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhYm9ydFN1aXRlKCkge1xuICAgICAgdmFyIGV2ZW50LFxuICAgICAgICAgIHN1aXRlID0gdGhpcyxcbiAgICAgICAgICByZXNldHRpbmcgPSBjYWxsZWRCeS5yZXNldFN1aXRlO1xuXG4gICAgICBpZiAoc3VpdGUucnVubmluZykge1xuICAgICAgICBldmVudCA9IEV2ZW50KCdhYm9ydCcpO1xuICAgICAgICBzdWl0ZS5lbWl0KGV2ZW50KTtcbiAgICAgICAgaWYgKCFldmVudC5jYW5jZWxsZWQgfHwgcmVzZXR0aW5nKSB7XG4gICAgICAgICAgLy8gQXZvaWQgaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgIGNhbGxlZEJ5LmFib3J0U3VpdGUgPSB0cnVlO1xuICAgICAgICAgIHN1aXRlLnJlc2V0KCk7XG4gICAgICAgICAgZGVsZXRlIGNhbGxlZEJ5LmFib3J0U3VpdGU7XG5cbiAgICAgICAgICBpZiAoIXJlc2V0dGluZykge1xuICAgICAgICAgICAgc3VpdGUuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICBpbnZva2Uoc3VpdGUsICdhYm9ydCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN1aXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSB0ZXN0IHRvIHRoZSBiZW5jaG1hcmsgc3VpdGUuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgQSBuYW1lIHRvIGlkZW50aWZ5IHRoZSBiZW5jaG1hcmsuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IGZuIFRoZSB0ZXN0IHRvIGJlbmNobWFyay5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzdWl0ZSBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gYmFzaWMgdXNhZ2VcbiAgICAgKiBzdWl0ZS5hZGQoZm4pO1xuICAgICAqXG4gICAgICogLy8gb3IgdXNpbmcgYSBuYW1lIGZpcnN0XG4gICAgICogc3VpdGUuYWRkKCdmb28nLCBmbik7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiBzdWl0ZS5hZGQoJ2ZvbycsIGZuLCB7XG4gICAgICogICAnb25DeWNsZSc6IG9uQ3ljbGUsXG4gICAgICogICAnb25Db21wbGV0ZSc6IG9uQ29tcGxldGVcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIG9yIG5hbWUgYW5kIG9wdGlvbnNcbiAgICAgKiBzdWl0ZS5hZGQoJ2ZvbycsIHtcbiAgICAgKiAgICdmbic6IGZuLFxuICAgICAqICAgJ29uQ3ljbGUnOiBvbkN5Y2xlLFxuICAgICAqICAgJ29uQ29tcGxldGUnOiBvbkNvbXBsZXRlXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiAvLyBvciBvcHRpb25zIG9ubHlcbiAgICAgKiBzdWl0ZS5hZGQoe1xuICAgICAqICAgJ25hbWUnOiAnZm9vJyxcbiAgICAgKiAgICdmbic6IGZuLFxuICAgICAqICAgJ29uQ3ljbGUnOiBvbkN5Y2xlLFxuICAgICAqICAgJ29uQ29tcGxldGUnOiBvbkNvbXBsZXRlXG4gICAgICogfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gYWRkKG5hbWUsIGZuLCBvcHRpb25zKSB7XG4gICAgICB2YXIgc3VpdGUgPSB0aGlzLFxuICAgICAgICAgIGJlbmNoID0gbmV3IEJlbmNobWFyayhuYW1lLCBmbiwgb3B0aW9ucyksXG4gICAgICAgICAgZXZlbnQgPSBFdmVudCh7ICd0eXBlJzogJ2FkZCcsICd0YXJnZXQnOiBiZW5jaCB9KTtcblxuICAgICAgaWYgKHN1aXRlLmVtaXQoZXZlbnQpLCAhZXZlbnQuY2FuY2VsbGVkKSB7XG4gICAgICAgIHN1aXRlLnB1c2goYmVuY2gpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN1aXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgc3VpdGUgd2l0aCBjbG9uZWQgYmVuY2htYXJrcy5cbiAgICAgKlxuICAgICAqIEBuYW1lIGNsb25lXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0IHRvIG92ZXJ3cml0ZSBjbG9uZWQgb3B0aW9ucy5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbmV3IHN1aXRlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsb25lU3VpdGUob3B0aW9ucykge1xuICAgICAgdmFyIHN1aXRlID0gdGhpcyxcbiAgICAgICAgICByZXN1bHQgPSBuZXcgc3VpdGUuY29uc3RydWN0b3IoXy5hc3NpZ24oe30sIHN1aXRlLm9wdGlvbnMsIG9wdGlvbnMpKTtcblxuICAgICAgLy8gQ29weSBvd24gcHJvcGVydGllcy5cbiAgICAgIF8uZm9yT3duKHN1aXRlLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICghXy5oYXMocmVzdWx0LCBrZXkpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZSAmJiBfLmlzRnVuY3Rpb24odmFsdWUuY2xvbmUpXG4gICAgICAgICAgICA/IHZhbHVlLmNsb25lKClcbiAgICAgICAgICAgIDogY2xvbmVEZWVwKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIGBBcnJheSNmaWx0ZXJgIGxpa2UgbWV0aG9kLlxuICAgICAqXG4gICAgICogQG5hbWUgZmlsdGVyXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBjYWxsYmFjayBUaGUgZnVuY3Rpb24vYWxpYXMgY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHJldHVybnMge09iamVjdH0gQSBuZXcgc3VpdGUgb2YgYmVuY2htYXJrcyB0aGF0IHBhc3NlZCBjYWxsYmFjayBmaWx0ZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyU3VpdGUoY2FsbGJhY2spIHtcbiAgICAgIHZhciBzdWl0ZSA9IHRoaXMsXG4gICAgICAgICAgcmVzdWx0ID0gbmV3IHN1aXRlLmNvbnN0cnVjdG9yKHN1aXRlLm9wdGlvbnMpO1xuXG4gICAgICByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIGZpbHRlcihzdWl0ZSwgY2FsbGJhY2spKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIGFsbCBiZW5jaG1hcmtzIGluIHRoZSBzdWl0ZS5cbiAgICAgKlxuICAgICAqIEBuYW1lIHJlc2V0XG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBzdWl0ZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNldFN1aXRlKCkge1xuICAgICAgdmFyIGV2ZW50LFxuICAgICAgICAgIHN1aXRlID0gdGhpcyxcbiAgICAgICAgICBhYm9ydGluZyA9IGNhbGxlZEJ5LmFib3J0U3VpdGU7XG5cbiAgICAgIGlmIChzdWl0ZS5ydW5uaW5nICYmICFhYm9ydGluZykge1xuICAgICAgICAvLyBObyB3b3JyaWVzLCBgcmVzZXRTdWl0ZSgpYCBpcyBjYWxsZWQgd2l0aGluIGBhYm9ydFN1aXRlKClgLlxuICAgICAgICBjYWxsZWRCeS5yZXNldFN1aXRlID0gdHJ1ZTtcbiAgICAgICAgc3VpdGUuYWJvcnQoKTtcbiAgICAgICAgZGVsZXRlIGNhbGxlZEJ5LnJlc2V0U3VpdGU7XG4gICAgICB9XG4gICAgICAvLyBSZXNldCBpZiB0aGUgc3RhdGUgaGFzIGNoYW5nZWQuXG4gICAgICBlbHNlIGlmICgoc3VpdGUuYWJvcnRlZCB8fCBzdWl0ZS5ydW5uaW5nKSAmJlxuICAgICAgICAgIChzdWl0ZS5lbWl0KGV2ZW50ID0gRXZlbnQoJ3Jlc2V0JykpLCAhZXZlbnQuY2FuY2VsbGVkKSkge1xuICAgICAgICBzdWl0ZS5hYm9ydGVkID0gc3VpdGUucnVubmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoIWFib3J0aW5nKSB7XG4gICAgICAgICAgaW52b2tlKHN1aXRlLCAncmVzZXQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN1aXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1bnMgdGhlIHN1aXRlLlxuICAgICAqXG4gICAgICogQG5hbWUgcnVuXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucyBvYmplY3QuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIHN1aXRlIGluc3RhbmNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyBiYXNpYyB1c2FnZVxuICAgICAqIHN1aXRlLnJ1bigpO1xuICAgICAqXG4gICAgICogLy8gb3Igd2l0aCBvcHRpb25zXG4gICAgICogc3VpdGUucnVuKHsgJ2FzeW5jJzogdHJ1ZSwgJ3F1ZXVlZCc6IHRydWUgfSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gcnVuU3VpdGUob3B0aW9ucykge1xuICAgICAgdmFyIHN1aXRlID0gdGhpcztcblxuICAgICAgc3VpdGUucmVzZXQoKTtcbiAgICAgIHN1aXRlLnJ1bm5pbmcgPSB0cnVlO1xuICAgICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcblxuICAgICAgaW52b2tlKHN1aXRlLCB7XG4gICAgICAgICduYW1lJzogJ3J1bicsXG4gICAgICAgICdhcmdzJzogb3B0aW9ucyxcbiAgICAgICAgJ3F1ZXVlZCc6IG9wdGlvbnMucXVldWVkLFxuICAgICAgICAnb25TdGFydCc6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgc3VpdGUuZW1pdChldmVudCk7XG4gICAgICAgIH0sXG4gICAgICAgICdvbkN5Y2xlJzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICB2YXIgYmVuY2ggPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgaWYgKGJlbmNoLmVycm9yKSB7XG4gICAgICAgICAgICBzdWl0ZS5lbWl0KHsgJ3R5cGUnOiAnZXJyb3InLCAndGFyZ2V0JzogYmVuY2ggfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1aXRlLmVtaXQoZXZlbnQpO1xuICAgICAgICAgIGV2ZW50LmFib3J0ZWQgPSBzdWl0ZS5hYm9ydGVkO1xuICAgICAgICB9LFxuICAgICAgICAnb25Db21wbGV0ZSc6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgc3VpdGUucnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIHN1aXRlLmVtaXQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzdWl0ZTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlcyBhbGwgcmVnaXN0ZXJlZCBsaXN0ZW5lcnMgb2YgdGhlIHNwZWNpZmllZCBldmVudCB0eXBlLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyaywgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSB0eXBlIFRoZSBldmVudCB0eXBlIG9yIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmdzXSBBcmd1bWVudHMgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGxhc3QgbGlzdGVuZXIgZXhlY3V0ZWQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLFxuICAgICAgICAgIG9iamVjdCA9IHRoaXMsXG4gICAgICAgICAgZXZlbnQgPSBFdmVudCh0eXBlKSxcbiAgICAgICAgICBldmVudHMgPSBvYmplY3QuZXZlbnRzLFxuICAgICAgICAgIGFyZ3MgPSAoYXJndW1lbnRzWzBdID0gZXZlbnQsIGFyZ3VtZW50cyk7XG5cbiAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQgfHwgKGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBvYmplY3QpO1xuICAgICAgZXZlbnQudGFyZ2V0IHx8IChldmVudC50YXJnZXQgPSBvYmplY3QpO1xuICAgICAgZGVsZXRlIGV2ZW50LnJlc3VsdDtcblxuICAgICAgaWYgKGV2ZW50cyAmJiAobGlzdGVuZXJzID0gXy5oYXMoZXZlbnRzLCBldmVudC50eXBlKSAmJiBldmVudHNbZXZlbnQudHlwZV0pKSB7XG4gICAgICAgIF8uZWFjaChsaXN0ZW5lcnMuc2xpY2UoKSwgZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgICAgICAgICBpZiAoKGV2ZW50LnJlc3VsdCA9IGxpc3RlbmVyLmFwcGx5KG9iamVjdCwgYXJncykpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZXZlbnQuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICFldmVudC5hYm9ydGVkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldmVudC5yZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBvZiBldmVudCBsaXN0ZW5lcnMgZm9yIGEgZ2l2ZW4gdHlwZSB0aGF0IGNhbiBiZSBtYW5pcHVsYXRlZFxuICAgICAqIHRvIGFkZCBvciByZW1vdmUgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyaywgQmVuY2htYXJrLlN1aXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgVGhlIGV2ZW50IHR5cGUuXG4gICAgICogQHJldHVybnMge0FycmF5fSBUaGUgbGlzdGVuZXJzIGFycmF5LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gdGhpcyxcbiAgICAgICAgICBldmVudHMgPSBvYmplY3QuZXZlbnRzIHx8IChvYmplY3QuZXZlbnRzID0ge30pO1xuXG4gICAgICByZXR1cm4gXy5oYXMoZXZlbnRzLCB0eXBlKSA/IGV2ZW50c1t0eXBlXSA6IChldmVudHNbdHlwZV0gPSBbXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5yZWdpc3RlcnMgYSBsaXN0ZW5lciBmb3IgdGhlIHNwZWNpZmllZCBldmVudCB0eXBlKHMpLFxuICAgICAqIG9yIHVucmVnaXN0ZXJzIGFsbCBsaXN0ZW5lcnMgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQgdHlwZShzKSxcbiAgICAgKiBvciB1bnJlZ2lzdGVycyBhbGwgbGlzdGVuZXJzIGZvciBhbGwgZXZlbnQgdHlwZXMuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLCBCZW5jaG1hcmsuU3VpdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3R5cGVdIFRoZSBldmVudCB0eXBlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtsaXN0ZW5lcl0gVGhlIGZ1bmN0aW9uIHRvIHVucmVnaXN0ZXIuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGN1cnJlbnQgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIHVucmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgYW4gZXZlbnQgdHlwZVxuICAgICAqIGJlbmNoLm9mZignY3ljbGUnLCBsaXN0ZW5lcik7XG4gICAgICpcbiAgICAgKiAvLyB1bnJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIG11bHRpcGxlIGV2ZW50IHR5cGVzXG4gICAgICogYmVuY2gub2ZmKCdzdGFydCBjeWNsZScsIGxpc3RlbmVyKTtcbiAgICAgKlxuICAgICAqIC8vIHVucmVnaXN0ZXIgYWxsIGxpc3RlbmVycyBmb3IgYW4gZXZlbnQgdHlwZVxuICAgICAqIGJlbmNoLm9mZignY3ljbGUnKTtcbiAgICAgKlxuICAgICAqIC8vIHVucmVnaXN0ZXIgYWxsIGxpc3RlbmVycyBmb3IgbXVsdGlwbGUgZXZlbnQgdHlwZXNcbiAgICAgKiBiZW5jaC5vZmYoJ3N0YXJ0IGN5Y2xlIGNvbXBsZXRlJyk7XG4gICAgICpcbiAgICAgKiAvLyB1bnJlZ2lzdGVyIGFsbCBsaXN0ZW5lcnMgZm9yIGFsbCBldmVudCB0eXBlc1xuICAgICAqIGJlbmNoLm9mZigpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9mZih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIG9iamVjdCA9IHRoaXMsXG4gICAgICAgICAgZXZlbnRzID0gb2JqZWN0LmV2ZW50cztcblxuICAgICAgaWYgKCFldmVudHMpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH1cbiAgICAgIF8uZWFjaCh0eXBlID8gdHlwZS5zcGxpdCgnICcpIDogZXZlbnRzLCBmdW5jdGlvbihsaXN0ZW5lcnMsIHR5cGUpIHtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgIHR5cGUgPSBsaXN0ZW5lcnM7XG4gICAgICAgICAgbGlzdGVuZXJzID0gXy5oYXMoZXZlbnRzLCB0eXBlKSAmJiBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgaW5kZXggPSBfLmluZGV4T2YobGlzdGVuZXJzLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgbGlzdGVuZXIgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnQgdHlwZShzKS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmssIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSBldmVudCB0eXBlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIFRoZSBmdW5jdGlvbiB0byByZWdpc3Rlci5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgY3VycmVudCBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogLy8gcmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgYW4gZXZlbnQgdHlwZVxuICAgICAqIGJlbmNoLm9uKCdjeWNsZScsIGxpc3RlbmVyKTtcbiAgICAgKlxuICAgICAqIC8vIHJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIG11bHRpcGxlIGV2ZW50IHR5cGVzXG4gICAgICogYmVuY2gub24oJ3N0YXJ0IGN5Y2xlJywgbGlzdGVuZXIpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgb2JqZWN0ID0gdGhpcyxcbiAgICAgICAgICBldmVudHMgPSBvYmplY3QuZXZlbnRzIHx8IChvYmplY3QuZXZlbnRzID0ge30pO1xuXG4gICAgICBfLmVhY2godHlwZS5zcGxpdCgnICcpLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIChfLmhhcyhldmVudHMsIHR5cGUpXG4gICAgICAgICAgPyBldmVudHNbdHlwZV1cbiAgICAgICAgICA6IChldmVudHNbdHlwZV0gPSBbXSlcbiAgICAgICAgKS5wdXNoKGxpc3RlbmVyKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBYm9ydHMgdGhlIGJlbmNobWFyayB3aXRob3V0IHJlY29yZGluZyB0aW1lcy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFib3J0KCkge1xuICAgICAgdmFyIGV2ZW50LFxuICAgICAgICAgIGJlbmNoID0gdGhpcyxcbiAgICAgICAgICByZXNldHRpbmcgPSBjYWxsZWRCeS5yZXNldDtcblxuICAgICAgaWYgKGJlbmNoLnJ1bm5pbmcpIHtcbiAgICAgICAgZXZlbnQgPSBFdmVudCgnYWJvcnQnKTtcbiAgICAgICAgYmVuY2guZW1pdChldmVudCk7XG4gICAgICAgIGlmICghZXZlbnQuY2FuY2VsbGVkIHx8IHJlc2V0dGluZykge1xuICAgICAgICAgIC8vIEF2b2lkIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICAgICAgICBjYWxsZWRCeS5hYm9ydCA9IHRydWU7XG4gICAgICAgICAgYmVuY2gucmVzZXQoKTtcbiAgICAgICAgICBkZWxldGUgY2FsbGVkQnkuYWJvcnQ7XG5cbiAgICAgICAgICBpZiAoc3VwcG9ydC50aW1lb3V0KSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoYmVuY2guX3RpbWVySWQpO1xuICAgICAgICAgICAgZGVsZXRlIGJlbmNoLl90aW1lcklkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXJlc2V0dGluZykge1xuICAgICAgICAgICAgYmVuY2guYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICBiZW5jaC5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYmVuY2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBiZW5jaG1hcmsgdXNpbmcgdGhlIHNhbWUgdGVzdCBhbmQgb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIG9iamVjdCB0byBvdmVyd3JpdGUgY2xvbmVkIG9wdGlvbnMuXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIG5ldyBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBiaXphcnJvID0gYmVuY2guY2xvbmUoe1xuICAgICAqICAgJ25hbWUnOiAnZG9wcGVsZ2FuZ2VyJ1xuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNsb25lKG9wdGlvbnMpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXMsXG4gICAgICAgICAgcmVzdWx0ID0gbmV3IGJlbmNoLmNvbnN0cnVjdG9yKF8uYXNzaWduKHt9LCBiZW5jaCwgb3B0aW9ucykpO1xuXG4gICAgICAvLyBDb3JyZWN0IHRoZSBgb3B0aW9uc2Agb2JqZWN0LlxuICAgICAgcmVzdWx0Lm9wdGlvbnMgPSBfLmFzc2lnbih7fSwgY2xvbmVEZWVwKGJlbmNoLm9wdGlvbnMpLCBjbG9uZURlZXAob3B0aW9ucykpO1xuXG4gICAgICAvLyBDb3B5IG93biBjdXN0b20gcHJvcGVydGllcy5cbiAgICAgIF8uZm9yT3duKGJlbmNoLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICghXy5oYXMocmVzdWx0LCBrZXkpKSB7XG4gICAgICAgICAgcmVzdWx0W2tleV0gPSBjbG9uZURlZXAodmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIGlmIGEgYmVuY2htYXJrIGlzIGZhc3RlciB0aGFuIGFub3RoZXIuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBiZW5jaG1hcmsgdG8gY29tcGFyZS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGAtMWAgaWYgc2xvd2VyLCBgMWAgaWYgZmFzdGVyLCBhbmQgYDBgIGlmIGluZGV0ZXJtaW5hdGUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gY29tcGFyZShvdGhlcikge1xuICAgICAgdmFyIGJlbmNoID0gdGhpcztcblxuICAgICAgLy8gRXhpdCBlYXJseSBpZiBjb21wYXJpbmcgdGhlIHNhbWUgYmVuY2htYXJrLlxuICAgICAgaWYgKGJlbmNoID09IG90aGVyKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgdmFyIGNyaXRpY2FsLFxuICAgICAgICAgIHpTdGF0LFxuICAgICAgICAgIHNhbXBsZTEgPSBiZW5jaC5zdGF0cy5zYW1wbGUsXG4gICAgICAgICAgc2FtcGxlMiA9IG90aGVyLnN0YXRzLnNhbXBsZSxcbiAgICAgICAgICBzaXplMSA9IHNhbXBsZTEubGVuZ3RoLFxuICAgICAgICAgIHNpemUyID0gc2FtcGxlMi5sZW5ndGgsXG4gICAgICAgICAgbWF4U2l6ZSA9IG1heChzaXplMSwgc2l6ZTIpLFxuICAgICAgICAgIG1pblNpemUgPSBtaW4oc2l6ZTEsIHNpemUyKSxcbiAgICAgICAgICB1MSA9IGdldFUoc2FtcGxlMSwgc2FtcGxlMiksXG4gICAgICAgICAgdTIgPSBnZXRVKHNhbXBsZTIsIHNhbXBsZTEpLFxuICAgICAgICAgIHUgPSBtaW4odTEsIHUyKTtcblxuICAgICAgZnVuY3Rpb24gZ2V0U2NvcmUoeEEsIHNhbXBsZUIpIHtcbiAgICAgICAgcmV0dXJuIF8ucmVkdWNlKHNhbXBsZUIsIGZ1bmN0aW9uKHRvdGFsLCB4Qikge1xuICAgICAgICAgIHJldHVybiB0b3RhbCArICh4QiA+IHhBID8gMCA6IHhCIDwgeEEgPyAxIDogMC41KTtcbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFUoc2FtcGxlQSwgc2FtcGxlQikge1xuICAgICAgICByZXR1cm4gXy5yZWR1Y2Uoc2FtcGxlQSwgZnVuY3Rpb24odG90YWwsIHhBKSB7XG4gICAgICAgICAgcmV0dXJuIHRvdGFsICsgZ2V0U2NvcmUoeEEsIHNhbXBsZUIpO1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0Wih1KSB7XG4gICAgICAgIHJldHVybiAodSAtICgoc2l6ZTEgKiBzaXplMikgLyAyKSkgLyBzcXJ0KChzaXplMSAqIHNpemUyICogKHNpemUxICsgc2l6ZTIgKyAxKSkgLyAxMik7XG4gICAgICB9XG4gICAgICAvLyBSZWplY3QgdGhlIG51bGwgaHlwb3RoZXNpcyB0aGUgdHdvIHNhbXBsZXMgY29tZSBmcm9tIHRoZVxuICAgICAgLy8gc2FtZSBwb3B1bGF0aW9uIChpLmUuIGhhdmUgdGhlIHNhbWUgbWVkaWFuKSBpZi4uLlxuICAgICAgaWYgKHNpemUxICsgc2l6ZTIgPiAzMCkge1xuICAgICAgICAvLyAuLi50aGUgei1zdGF0IGlzIGdyZWF0ZXIgdGhhbiAxLjk2IG9yIGxlc3MgdGhhbiAtMS45NlxuICAgICAgICAvLyBodHRwOi8vd3d3LnN0YXRpc3RpY3NsZWN0dXJlcy5jb20vdG9waWNzL21hbm53aGl0bmV5dS9cbiAgICAgICAgelN0YXQgPSBnZXRaKHUpO1xuICAgICAgICByZXR1cm4gYWJzKHpTdGF0KSA+IDEuOTYgPyAodSA9PSB1MSA/IDEgOiAtMSkgOiAwO1xuICAgICAgfVxuICAgICAgLy8gLi4udGhlIFUgdmFsdWUgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRoZSBjcml0aWNhbCBVIHZhbHVlLlxuICAgICAgY3JpdGljYWwgPSBtYXhTaXplIDwgNSB8fCBtaW5TaXplIDwgMyA/IDAgOiB1VGFibGVbbWF4U2l6ZV1bbWluU2l6ZSAtIDNdO1xuICAgICAgcmV0dXJuIHUgPD0gY3JpdGljYWwgPyAodSA9PSB1MSA/IDEgOiAtMSkgOiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc2V0IHByb3BlcnRpZXMgYW5kIGFib3J0IGlmIHJ1bm5pbmcuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICogQHJldHVybnMge09iamVjdH0gVGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgIHZhciBiZW5jaCA9IHRoaXM7XG4gICAgICBpZiAoYmVuY2gucnVubmluZyAmJiAhY2FsbGVkQnkuYWJvcnQpIHtcbiAgICAgICAgLy8gTm8gd29ycmllcywgYHJlc2V0KClgIGlzIGNhbGxlZCB3aXRoaW4gYGFib3J0KClgLlxuICAgICAgICBjYWxsZWRCeS5yZXNldCA9IHRydWU7XG4gICAgICAgIGJlbmNoLmFib3J0KCk7XG4gICAgICAgIGRlbGV0ZSBjYWxsZWRCeS5yZXNldDtcbiAgICAgICAgcmV0dXJuIGJlbmNoO1xuICAgICAgfVxuICAgICAgdmFyIGV2ZW50LFxuICAgICAgICAgIGluZGV4ID0gMCxcbiAgICAgICAgICBjaGFuZ2VzID0gW10sXG4gICAgICAgICAgcXVldWUgPSBbXTtcblxuICAgICAgLy8gQSBub24tcmVjdXJzaXZlIHNvbHV0aW9uIHRvIGNoZWNrIGlmIHByb3BlcnRpZXMgaGF2ZSBjaGFuZ2VkLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHA6Ly93d3cuanNsYWIuZGsvYXJ0aWNsZXMvbm9uLnJlY3Vyc2l2ZS5wcmVvcmRlci50cmF2ZXJzYWwucGFydDQuXG4gICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgJ2Rlc3RpbmF0aW9uJzogYmVuY2gsXG4gICAgICAgICdzb3VyY2UnOiBfLmFzc2lnbih7fSwgY2xvbmVEZWVwKGJlbmNoLmNvbnN0cnVjdG9yLnByb3RvdHlwZSksIGNsb25lRGVlcChiZW5jaC5vcHRpb25zKSlcbiAgICAgIH07XG5cbiAgICAgIGRvIHtcbiAgICAgICAgXy5mb3JPd24oZGF0YS5zb3VyY2UsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICB2YXIgY2hhbmdlZCxcbiAgICAgICAgICAgICAgZGVzdGluYXRpb24gPSBkYXRhLmRlc3RpbmF0aW9uLFxuICAgICAgICAgICAgICBjdXJyVmFsdWUgPSBkZXN0aW5hdGlvbltrZXldO1xuXG4gICAgICAgICAgLy8gU2tpcCBwc2V1ZG8gcHJpdmF0ZSBwcm9wZXJ0aWVzIGxpa2UgYF90aW1lcklkYCB3aGljaCBjb3VsZCBiZSBhXG4gICAgICAgICAgLy8gSmF2YSBvYmplY3QgaW4gZW52aXJvbm1lbnRzIGxpa2UgUmluZ29KUy5cbiAgICAgICAgICBpZiAoa2V5LmNoYXJBdCgwKSA9PSAnXycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW4gYXJyYXkgdmFsdWUgaGFzIGNoYW5nZWQgdG8gYSBub24tYXJyYXkgdmFsdWUuXG4gICAgICAgICAgICAgIGlmICghXy5pc0FycmF5KGN1cnJWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VkID0gY3VyclZhbHVlID0gW107XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYW4gYXJyYXkgaGFzIGNoYW5nZWQgaXRzIGxlbmd0aC5cbiAgICAgICAgICAgICAgaWYgKGN1cnJWYWx1ZS5sZW5ndGggIT0gdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlZCA9IGN1cnJWYWx1ZSA9IGN1cnJWYWx1ZS5zbGljZSgwLCB2YWx1ZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGN1cnJWYWx1ZS5sZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGFuIG9iamVjdCBoYXMgY2hhbmdlZCB0byBhIG5vbi1vYmplY3QgdmFsdWUuXG4gICAgICAgICAgICBlbHNlIGlmICghY3VyclZhbHVlIHx8IHR5cGVvZiBjdXJyVmFsdWUgIT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgY2hhbmdlZCA9IGN1cnJWYWx1ZSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVnaXN0ZXIgYSBjaGFuZ2VkIG9iamVjdC5cbiAgICAgICAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgICAgICAgIGNoYW5nZXMucHVzaCh7ICdkZXN0aW5hdGlvbic6IGRlc3RpbmF0aW9uLCAna2V5Jzoga2V5LCAndmFsdWUnOiBjdXJyVmFsdWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKHsgJ2Rlc3RpbmF0aW9uJzogY3VyclZhbHVlLCAnc291cmNlJzogdmFsdWUgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFJlZ2lzdGVyIGEgY2hhbmdlZCBwcmltaXRpdmUuXG4gICAgICAgICAgZWxzZSBpZiAodmFsdWUgIT09IGN1cnJWYWx1ZSAmJiAhKHZhbHVlID09IG51bGwgfHwgXy5pc0Z1bmN0aW9uKHZhbHVlKSkpIHtcbiAgICAgICAgICAgIGNoYW5nZXMucHVzaCh7ICdkZXN0aW5hdGlvbic6IGRlc3RpbmF0aW9uLCAna2V5Jzoga2V5LCAndmFsdWUnOiB2YWx1ZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgd2hpbGUgKChkYXRhID0gcXVldWVbaW5kZXgrK10pKTtcblxuICAgICAgLy8gSWYgY2hhbmdlZCBlbWl0IHRoZSBgcmVzZXRgIGV2ZW50IGFuZCBpZiBpdCBpc24ndCBjYW5jZWxsZWQgcmVzZXQgdGhlIGJlbmNobWFyay5cbiAgICAgIGlmIChjaGFuZ2VzLmxlbmd0aCAmJiAoYmVuY2guZW1pdChldmVudCA9IEV2ZW50KCdyZXNldCcpKSwgIWV2ZW50LmNhbmNlbGxlZCkpIHtcbiAgICAgICAgXy5lYWNoKGNoYW5nZXMsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICBkYXRhLmRlc3RpbmF0aW9uW2RhdGEua2V5XSA9IGRhdGEudmFsdWU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJlbmNoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERpc3BsYXlzIHJlbGV2YW50IGJlbmNobWFyayBpbmZvcm1hdGlvbiB3aGVuIGNvZXJjZWQgdG8gYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAbmFtZSB0b1N0cmluZ1xuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRvU3RyaW5nQmVuY2goKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzLFxuICAgICAgICAgIGVycm9yID0gYmVuY2guZXJyb3IsXG4gICAgICAgICAgaHogPSBiZW5jaC5oeixcbiAgICAgICAgICBpZCA9IGJlbmNoLmlkLFxuICAgICAgICAgIHN0YXRzID0gYmVuY2guc3RhdHMsXG4gICAgICAgICAgc2l6ZSA9IHN0YXRzLnNhbXBsZS5sZW5ndGgsXG4gICAgICAgICAgcG0gPSAnXFx4YjEnLFxuICAgICAgICAgIHJlc3VsdCA9IGJlbmNoLm5hbWUgfHwgKF8uaXNOYU4oaWQpID8gaWQgOiAnPFRlc3QgIycgKyBpZCArICc+Jyk7XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXN1bHQgKz0gJzogJyArIGpvaW4oZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ICs9ICcgeCAnICsgZm9ybWF0TnVtYmVyKGh6LnRvRml4ZWQoaHogPCAxMDAgPyAyIDogMCkpICsgJyBvcHMvc2VjICcgKyBwbSArXG4gICAgICAgICAgc3RhdHMucm1lLnRvRml4ZWQoMikgKyAnJSAoJyArIHNpemUgKyAnIHJ1bicgKyAoc2l6ZSA9PSAxID8gJycgOiAncycpICsgJyBzYW1wbGVkKSc7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENsb2NrcyB0aGUgdGltZSB0YWtlbiB0byBleGVjdXRlIGEgdGVzdCBwZXIgY3ljbGUgKHNlY3MpLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYmVuY2ggVGhlIGJlbmNobWFyayBpbnN0YW5jZS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgdGltZSB0YWtlbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbG9jaygpIHtcbiAgICAgIHZhciBvcHRpb25zID0gQmVuY2htYXJrLm9wdGlvbnMsXG4gICAgICAgICAgdGVtcGxhdGVEYXRhID0ge30sXG4gICAgICAgICAgdGltZXJzID0gW3sgJ25zJzogdGltZXIubnMsICdyZXMnOiBtYXgoMC4wMDE1LCBnZXRSZXMoJ21zJykpLCAndW5pdCc6ICdtcycgfV07XG5cbiAgICAgIC8vIExhenkgZGVmaW5lIGZvciBoaS1yZXMgdGltZXJzLlxuICAgICAgY2xvY2sgPSBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICB2YXIgZGVmZXJyZWQ7XG5cbiAgICAgICAgaWYgKGNsb25lIGluc3RhbmNlb2YgRGVmZXJyZWQpIHtcbiAgICAgICAgICBkZWZlcnJlZCA9IGNsb25lO1xuICAgICAgICAgIGNsb25lID0gZGVmZXJyZWQuYmVuY2htYXJrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBiZW5jaCA9IGNsb25lLl9vcmlnaW5hbCxcbiAgICAgICAgICAgIHN0cmluZ2FibGUgPSBpc1N0cmluZ2FibGUoYmVuY2guZm4pLFxuICAgICAgICAgICAgY291bnQgPSBiZW5jaC5jb3VudCA9IGNsb25lLmNvdW50LFxuICAgICAgICAgICAgZGVjb21waWxhYmxlID0gc3RyaW5nYWJsZSB8fCAoc3VwcG9ydC5kZWNvbXBpbGF0aW9uICYmIChjbG9uZS5zZXR1cCAhPT0gXy5ub29wIHx8IGNsb25lLnRlYXJkb3duICE9PSBfLm5vb3ApKSxcbiAgICAgICAgICAgIGlkID0gYmVuY2guaWQsXG4gICAgICAgICAgICBuYW1lID0gYmVuY2gubmFtZSB8fCAodHlwZW9mIGlkID09ICdudW1iZXInID8gJzxUZXN0ICMnICsgaWQgKyAnPicgOiBpZCksXG4gICAgICAgICAgICByZXN1bHQgPSAwO1xuXG4gICAgICAgIC8vIEluaXQgYG1pblRpbWVgIGlmIG5lZWRlZC5cbiAgICAgICAgY2xvbmUubWluVGltZSA9IGJlbmNoLm1pblRpbWUgfHwgKGJlbmNoLm1pblRpbWUgPSBiZW5jaC5vcHRpb25zLm1pblRpbWUgPSBvcHRpb25zLm1pblRpbWUpO1xuXG4gICAgICAgIC8vIENvbXBpbGUgaW4gc2V0dXAvdGVhcmRvd24gZnVuY3Rpb25zIGFuZCB0aGUgdGVzdCBsb29wLlxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgY29tcGlsZWQgdGVzdCwgaW5zdGVhZCBvZiB1c2luZyB0aGUgY2FjaGVkIGBiZW5jaC5jb21waWxlZGAsXG4gICAgICAgIC8vIHRvIGF2b2lkIHBvdGVudGlhbCBlbmdpbmUgb3B0aW1pemF0aW9ucyBlbmFibGVkIG92ZXIgdGhlIGxpZmUgb2YgdGhlIHRlc3QuXG4gICAgICAgIHZhciBmdW5jQm9keSA9IGRlZmVycmVkXG4gICAgICAgICAgPyAndmFyIGQjPXRoaXMsJHtmbkFyZ309ZCMsbSM9ZCMuYmVuY2htYXJrLl9vcmlnaW5hbCxmIz1tIy5mbixzdSM9bSMuc2V0dXAsdGQjPW0jLnRlYXJkb3duOycgK1xuICAgICAgICAgICAgLy8gV2hlbiBgZGVmZXJyZWQuY3ljbGVzYCBpcyBgMGAgdGhlbi4uLlxuICAgICAgICAgICAgJ2lmKCFkIy5jeWNsZXMpeycgK1xuICAgICAgICAgICAgLy8gc2V0IGBkZWZlcnJlZC5mbmAsXG4gICAgICAgICAgICAnZCMuZm49ZnVuY3Rpb24oKXt2YXIgJHtmbkFyZ309ZCM7aWYodHlwZW9mIGYjPT1cImZ1bmN0aW9uXCIpe3RyeXske2ZufVxcbn1jYXRjaChlIyl7ZiMoZCMpfX1lbHNleyR7Zm59XFxufX07JyArXG4gICAgICAgICAgICAvLyBzZXQgYGRlZmVycmVkLnRlYXJkb3duYCxcbiAgICAgICAgICAgICdkIy50ZWFyZG93bj1mdW5jdGlvbigpe2QjLmN5Y2xlcz0wO2lmKHR5cGVvZiB0ZCM9PVwiZnVuY3Rpb25cIil7dHJ5eyR7dGVhcmRvd259XFxufWNhdGNoKGUjKXt0ZCMoKX19ZWxzZXske3RlYXJkb3dufVxcbn19OycgK1xuICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgYmVuY2htYXJrJ3MgYHNldHVwYCxcbiAgICAgICAgICAgICdpZih0eXBlb2Ygc3UjPT1cImZ1bmN0aW9uXCIpe3RyeXske3NldHVwfVxcbn1jYXRjaChlIyl7c3UjKCl9fWVsc2V7JHtzZXR1cH1cXG59OycgK1xuICAgICAgICAgICAgLy8gc3RhcnQgdGltZXIsXG4gICAgICAgICAgICAndCMuc3RhcnQoZCMpOycgK1xuICAgICAgICAgICAgLy8gYW5kIHRoZW4gZXhlY3V0ZSBgZGVmZXJyZWQuZm5gIGFuZCByZXR1cm4gYSBkdW1teSBvYmplY3QuXG4gICAgICAgICAgICAnfWQjLmZuKCk7cmV0dXJue3VpZDpcIiR7dWlkfVwifSdcblxuICAgICAgICAgIDogJ3ZhciByIyxzIyxtIz10aGlzLGYjPW0jLmZuLGkjPW0jLmNvdW50LG4jPXQjLm5zOyR7c2V0dXB9XFxuJHtiZWdpbn07JyArXG4gICAgICAgICAgICAnd2hpbGUoaSMtLSl7JHtmbn1cXG59JHtlbmR9OyR7dGVhcmRvd259XFxucmV0dXJue2VsYXBzZWQ6ciMsdWlkOlwiJHt1aWR9XCJ9JztcblxuICAgICAgICB2YXIgY29tcGlsZWQgPSBiZW5jaC5jb21waWxlZCA9IGNsb25lLmNvbXBpbGVkID0gY3JlYXRlQ29tcGlsZWQoYmVuY2gsIGRlY29tcGlsYWJsZSwgZGVmZXJyZWQsIGZ1bmNCb2R5KSxcbiAgICAgICAgICAgIGlzRW1wdHkgPSAhKHRlbXBsYXRlRGF0YS5mbiB8fCBzdHJpbmdhYmxlKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChpc0VtcHR5KSB7XG4gICAgICAgICAgICAvLyBGaXJlZm94IG1heSByZW1vdmUgZGVhZCBjb2RlIGZyb20gYEZ1bmN0aW9uI3RvU3RyaW5nYCByZXN1bHRzLlxuICAgICAgICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIGh0dHA6Ly9idWd6aWwubGEvNTM2MDg1LlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdGVzdCBcIicgKyBuYW1lICsgJ1wiIGlzIGVtcHR5LiBUaGlzIG1heSBiZSB0aGUgcmVzdWx0IG9mIGRlYWQgY29kZSByZW1vdmFsLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmICghZGVmZXJyZWQpIHtcbiAgICAgICAgICAgIC8vIFByZXRlc3QgdG8gZGV0ZXJtaW5lIGlmIGNvbXBpbGVkIGNvZGUgZXhpdHMgZWFybHksIHVzdWFsbHkgYnkgYVxuICAgICAgICAgICAgLy8gcm9ndWUgYHJldHVybmAgc3RhdGVtZW50LCBieSBjaGVja2luZyBmb3IgYSByZXR1cm4gb2JqZWN0IHdpdGggdGhlIHVpZC5cbiAgICAgICAgICAgIGJlbmNoLmNvdW50ID0gMTtcbiAgICAgICAgICAgIGNvbXBpbGVkID0gZGVjb21waWxhYmxlICYmIChjb21waWxlZC5jYWxsKGJlbmNoLCBjb250ZXh0LCB0aW1lcikgfHwge30pLnVpZCA9PSB0ZW1wbGF0ZURhdGEudWlkICYmIGNvbXBpbGVkO1xuICAgICAgICAgICAgYmVuY2guY291bnQgPSBjb3VudDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIGNvbXBpbGVkID0gbnVsbDtcbiAgICAgICAgICBjbG9uZS5lcnJvciA9IGUgfHwgbmV3IEVycm9yKFN0cmluZyhlKSk7XG4gICAgICAgICAgYmVuY2guY291bnQgPSBjb3VudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBGYWxsYmFjayB3aGVuIGEgdGVzdCBleGl0cyBlYXJseSBvciBlcnJvcnMgZHVyaW5nIHByZXRlc3QuXG4gICAgICAgIGlmICghY29tcGlsZWQgJiYgIWRlZmVycmVkICYmICFpc0VtcHR5KSB7XG4gICAgICAgICAgZnVuY0JvZHkgPSAoXG4gICAgICAgICAgICBzdHJpbmdhYmxlIHx8IChkZWNvbXBpbGFibGUgJiYgIWNsb25lLmVycm9yKVxuICAgICAgICAgICAgICA/ICdmdW5jdGlvbiBmIygpeyR7Zm59XFxufXZhciByIyxzIyxtIz10aGlzLGkjPW0jLmNvdW50J1xuICAgICAgICAgICAgICA6ICd2YXIgciMscyMsbSM9dGhpcyxmIz1tIy5mbixpIz1tIy5jb3VudCdcbiAgICAgICAgICAgICkgK1xuICAgICAgICAgICAgJyxuIz10Iy5uczske3NldHVwfVxcbiR7YmVnaW59O20jLmYjPWYjO3doaWxlKGkjLS0pe20jLmYjKCl9JHtlbmR9OycgK1xuICAgICAgICAgICAgJ2RlbGV0ZSBtIy5mIzske3RlYXJkb3dufVxcbnJldHVybntlbGFwc2VkOnIjfSc7XG5cbiAgICAgICAgICBjb21waWxlZCA9IGNyZWF0ZUNvbXBpbGVkKGJlbmNoLCBkZWNvbXBpbGFibGUsIGRlZmVycmVkLCBmdW5jQm9keSk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gUHJldGVzdCBvbmUgbW9yZSB0aW1lIHRvIGNoZWNrIGZvciBlcnJvcnMuXG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IDE7XG4gICAgICAgICAgICBjb21waWxlZC5jYWxsKGJlbmNoLCBjb250ZXh0LCB0aW1lcik7XG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IGNvdW50O1xuICAgICAgICAgICAgZGVsZXRlIGNsb25lLmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICBiZW5jaC5jb3VudCA9IGNvdW50O1xuICAgICAgICAgICAgaWYgKCFjbG9uZS5lcnJvcikge1xuICAgICAgICAgICAgICBjbG9uZS5lcnJvciA9IGUgfHwgbmV3IEVycm9yKFN0cmluZyhlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vIGVycm9ycyBydW4gdGhlIGZ1bGwgdGVzdCBsb29wLlxuICAgICAgICBpZiAoIWNsb25lLmVycm9yKSB7XG4gICAgICAgICAgY29tcGlsZWQgPSBiZW5jaC5jb21waWxlZCA9IGNsb25lLmNvbXBpbGVkID0gY3JlYXRlQ29tcGlsZWQoYmVuY2gsIGRlY29tcGlsYWJsZSwgZGVmZXJyZWQsIGZ1bmNCb2R5KTtcbiAgICAgICAgICByZXN1bHQgPSBjb21waWxlZC5jYWxsKGRlZmVycmVkIHx8IGJlbmNoLCBjb250ZXh0LCB0aW1lcikuZWxhcHNlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcblxuICAgICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgY29tcGlsZWQgZnVuY3Rpb24gZnJvbSB0aGUgZ2l2ZW4gZnVuY3Rpb24gYGJvZHlgLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBjcmVhdGVDb21waWxlZChiZW5jaCwgZGVjb21waWxhYmxlLCBkZWZlcnJlZCwgYm9keSkge1xuICAgICAgICB2YXIgZm4gPSBiZW5jaC5mbixcbiAgICAgICAgICAgIGZuQXJnID0gZGVmZXJyZWQgPyBnZXRGaXJzdEFyZ3VtZW50KGZuKSB8fCAnZGVmZXJyZWQnIDogJyc7XG5cbiAgICAgICAgdGVtcGxhdGVEYXRhLnVpZCA9IHVpZCArIHVpZENvdW50ZXIrKztcblxuICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAnc2V0dXAnOiBkZWNvbXBpbGFibGUgPyBnZXRTb3VyY2UoYmVuY2guc2V0dXApIDogaW50ZXJwb2xhdGUoJ20jLnNldHVwKCknKSxcbiAgICAgICAgICAnZm4nOiBkZWNvbXBpbGFibGUgPyBnZXRTb3VyY2UoZm4pIDogaW50ZXJwb2xhdGUoJ20jLmZuKCcgKyBmbkFyZyArICcpJyksXG4gICAgICAgICAgJ2ZuQXJnJzogZm5BcmcsXG4gICAgICAgICAgJ3RlYXJkb3duJzogZGVjb21waWxhYmxlID8gZ2V0U291cmNlKGJlbmNoLnRlYXJkb3duKSA6IGludGVycG9sYXRlKCdtIy50ZWFyZG93bigpJylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVXNlIEFQSSBvZiBjaG9zZW4gdGltZXIuXG4gICAgICAgIGlmICh0aW1lci51bml0ID09ICducycpIHtcbiAgICAgICAgICBfLmFzc2lnbih0ZW1wbGF0ZURhdGEsIHtcbiAgICAgICAgICAgICdiZWdpbic6IGludGVycG9sYXRlKCdzIz1uIygpJyksXG4gICAgICAgICAgICAnZW5kJzogaW50ZXJwb2xhdGUoJ3IjPW4jKHMjKTtyIz1yI1swXSsociNbMV0vMWU5KScpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGltZXIudW5pdCA9PSAndXMnKSB7XG4gICAgICAgICAgaWYgKHRpbWVyLm5zLnN0b3ApIHtcbiAgICAgICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICAgICAnYmVnaW4nOiBpbnRlcnBvbGF0ZSgncyM9biMuc3RhcnQoKScpLFxuICAgICAgICAgICAgICAnZW5kJzogaW50ZXJwb2xhdGUoJ3IjPW4jLm1pY3Jvc2Vjb25kcygpLzFlNicpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgICAgICdiZWdpbic6IGludGVycG9sYXRlKCdzIz1uIygpJyksXG4gICAgICAgICAgICAgICdlbmQnOiBpbnRlcnBvbGF0ZSgnciM9KG4jKCktcyMpLzFlNicpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGltZXIubnMubm93KSB7XG4gICAgICAgICAgXy5hc3NpZ24odGVtcGxhdGVEYXRhLCB7XG4gICAgICAgICAgICAnYmVnaW4nOiBpbnRlcnBvbGF0ZSgncyM9biMubm93KCknKSxcbiAgICAgICAgICAgICdlbmQnOiBpbnRlcnBvbGF0ZSgnciM9KG4jLm5vdygpLXMjKS8xZTMnKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIF8uYXNzaWduKHRlbXBsYXRlRGF0YSwge1xuICAgICAgICAgICAgJ2JlZ2luJzogaW50ZXJwb2xhdGUoJ3MjPW5ldyBuIygpLmdldFRpbWUoKScpLFxuICAgICAgICAgICAgJ2VuZCc6IGludGVycG9sYXRlKCdyIz0obmV3IG4jKCkuZ2V0VGltZSgpLXMjKS8xZTMnKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIERlZmluZSBgdGltZXJgIG1ldGhvZHMuXG4gICAgICAgIHRpbWVyLnN0YXJ0ID0gY3JlYXRlRnVuY3Rpb24oXG4gICAgICAgICAgaW50ZXJwb2xhdGUoJ28jJyksXG4gICAgICAgICAgaW50ZXJwb2xhdGUoJ3ZhciBuIz10aGlzLm5zLCR7YmVnaW59O28jLmVsYXBzZWQ9MDtvIy50aW1lU3RhbXA9cyMnKVxuICAgICAgICApO1xuXG4gICAgICAgIHRpbWVyLnN0b3AgPSBjcmVhdGVGdW5jdGlvbihcbiAgICAgICAgICBpbnRlcnBvbGF0ZSgnbyMnKSxcbiAgICAgICAgICBpbnRlcnBvbGF0ZSgndmFyIG4jPXRoaXMubnMscyM9byMudGltZVN0YW1wLCR7ZW5kfTtvIy5lbGFwc2VkPXIjJylcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDcmVhdGUgY29tcGlsZWQgdGVzdC5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZ1bmN0aW9uKFxuICAgICAgICAgIGludGVycG9sYXRlKCd3aW5kb3csdCMnKSxcbiAgICAgICAgICAndmFyIGdsb2JhbCA9IHdpbmRvdywgY2xlYXJUaW1lb3V0ID0gZ2xvYmFsLmNsZWFyVGltZW91dCwgc2V0VGltZW91dCA9IGdsb2JhbC5zZXRUaW1lb3V0O1xcbicgK1xuICAgICAgICAgIGludGVycG9sYXRlKGJvZHkpXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0cyB0aGUgY3VycmVudCB0aW1lcidzIG1pbmltdW0gcmVzb2x1dGlvbiAoc2VjcykuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGdldFJlcyh1bml0KSB7XG4gICAgICAgIHZhciBtZWFzdXJlZCxcbiAgICAgICAgICAgIGJlZ2luLFxuICAgICAgICAgICAgY291bnQgPSAzMCxcbiAgICAgICAgICAgIGRpdmlzb3IgPSAxZTMsXG4gICAgICAgICAgICBucyA9IHRpbWVyLm5zLFxuICAgICAgICAgICAgc2FtcGxlID0gW107XG5cbiAgICAgICAgLy8gR2V0IGF2ZXJhZ2Ugc21hbGxlc3QgbWVhc3VyYWJsZSB0aW1lLlxuICAgICAgICB3aGlsZSAoY291bnQtLSkge1xuICAgICAgICAgIGlmICh1bml0ID09ICd1cycpIHtcbiAgICAgICAgICAgIGRpdmlzb3IgPSAxZTY7XG4gICAgICAgICAgICBpZiAobnMuc3RvcCkge1xuICAgICAgICAgICAgICBucy5zdGFydCgpO1xuICAgICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9IG5zLm1pY3Jvc2Vjb25kcygpKSkge31cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJlZ2luID0gbnMoKTtcbiAgICAgICAgICAgICAgd2hpbGUgKCEobWVhc3VyZWQgPSBucygpIC0gYmVnaW4pKSB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmICh1bml0ID09ICducycpIHtcbiAgICAgICAgICAgIGRpdmlzb3IgPSAxZTk7XG4gICAgICAgICAgICBiZWdpbiA9IChiZWdpbiA9IG5zKCkpWzBdICsgKGJlZ2luWzFdIC8gZGl2aXNvcik7XG4gICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9ICgobWVhc3VyZWQgPSBucygpKVswXSArIChtZWFzdXJlZFsxXSAvIGRpdmlzb3IpKSAtIGJlZ2luKSkge31cbiAgICAgICAgICAgIGRpdmlzb3IgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChucy5ub3cpIHtcbiAgICAgICAgICAgIGJlZ2luID0gbnMubm93KCk7XG4gICAgICAgICAgICB3aGlsZSAoIShtZWFzdXJlZCA9IG5zLm5vdygpIC0gYmVnaW4pKSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJlZ2luID0gbmV3IG5zKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgd2hpbGUgKCEobWVhc3VyZWQgPSBuZXcgbnMoKS5nZXRUaW1lKCkgLSBiZWdpbikpIHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENoZWNrIGZvciBicm9rZW4gdGltZXJzLlxuICAgICAgICAgIGlmIChtZWFzdXJlZCA+IDApIHtcbiAgICAgICAgICAgIHNhbXBsZS5wdXNoKG1lYXN1cmVkKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2FtcGxlLnB1c2goSW5maW5pdHkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENvbnZlcnQgdG8gc2Vjb25kcy5cbiAgICAgICAgcmV0dXJuIGdldE1lYW4oc2FtcGxlKSAvIGRpdmlzb3I7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogSW50ZXJwb2xhdGVzIGEgZ2l2ZW4gdGVtcGxhdGUgc3RyaW5nLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdHJpbmcpIHtcbiAgICAgICAgLy8gUmVwbGFjZXMgYWxsIG9jY3VycmVuY2VzIG9mIGAjYCB3aXRoIGEgdW5pcXVlIG51bWJlciBhbmQgdGVtcGxhdGUgdG9rZW5zIHdpdGggY29udGVudC5cbiAgICAgICAgcmV0dXJuIF8udGVtcGxhdGUoc3RyaW5nLnJlcGxhY2UoL1xcIy9nLCAvXFxkKy8uZXhlYyh0ZW1wbGF0ZURhdGEudWlkKSkpKHRlbXBsYXRlRGF0YSk7XG4gICAgICB9XG5cbiAgICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAgIC8vIERldGVjdCBDaHJvbWUncyBtaWNyb3NlY29uZCB0aW1lcjpcbiAgICAgIC8vIGVuYWJsZSBiZW5jaG1hcmtpbmcgdmlhIHRoZSAtLWVuYWJsZS1iZW5jaG1hcmtpbmcgY29tbWFuZFxuICAgICAgLy8gbGluZSBzd2l0Y2ggaW4gYXQgbGVhc3QgQ2hyb21lIDcgdG8gdXNlIGNocm9tZS5JbnRlcnZhbFxuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCh0aW1lci5ucyA9IG5ldyAoY29udGV4dC5jaHJvbWUgfHwgY29udGV4dC5jaHJvbWl1bSkuSW50ZXJ2YWwpKSB7XG4gICAgICAgICAgdGltZXJzLnB1c2goeyAnbnMnOiB0aW1lci5ucywgJ3Jlcyc6IGdldFJlcygndXMnKSwgJ3VuaXQnOiAndXMnIH0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoKGUpIHt9XG5cbiAgICAgIC8vIERldGVjdCBOb2RlLmpzJ3MgbmFub3NlY29uZCByZXNvbHV0aW9uIHRpbWVyIGF2YWlsYWJsZSBpbiBOb2RlLmpzID49IDAuOC5cbiAgICAgIGlmIChwcm9jZXNzT2JqZWN0ICYmIHR5cGVvZiAodGltZXIubnMgPSBwcm9jZXNzT2JqZWN0LmhydGltZSkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aW1lcnMucHVzaCh7ICducyc6IHRpbWVyLm5zLCAncmVzJzogZ2V0UmVzKCducycpLCAndW5pdCc6ICducycgfSk7XG4gICAgICB9XG4gICAgICAvLyBEZXRlY3QgV2FkZSBTaW1tb25zJyBOb2RlLmpzIGBtaWNyb3RpbWVgIG1vZHVsZS5cbiAgICAgIGlmIChtaWNyb3RpbWVPYmplY3QgJiYgdHlwZW9mICh0aW1lci5ucyA9IG1pY3JvdGltZU9iamVjdC5ub3cpID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGltZXJzLnB1c2goeyAnbnMnOiB0aW1lci5ucywgICdyZXMnOiBnZXRSZXMoJ3VzJyksICd1bml0JzogJ3VzJyB9KTtcbiAgICAgIH1cbiAgICAgIC8vIFBpY2sgdGltZXIgd2l0aCBoaWdoZXN0IHJlc29sdXRpb24uXG4gICAgICB0aW1lciA9IF8ubWluQnkodGltZXJzLCAncmVzJyk7XG5cbiAgICAgIC8vIEVycm9yIGlmIHRoZXJlIGFyZSBubyB3b3JraW5nIHRpbWVycy5cbiAgICAgIGlmICh0aW1lci5yZXMgPT0gSW5maW5pdHkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdCZW5jaG1hcmsuanMgd2FzIHVuYWJsZSB0byBmaW5kIGEgd29ya2luZyB0aW1lci4nKTtcbiAgICAgIH1cbiAgICAgIC8vIFJlc29sdmUgdGltZSBzcGFuIHJlcXVpcmVkIHRvIGFjaGlldmUgYSBwZXJjZW50IHVuY2VydGFpbnR5IG9mIGF0IG1vc3QgMSUuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL3NwaWZmLnJpdC5lZHUvY2xhc3Nlcy9waHlzMjczL3VuY2VydC91bmNlcnQuaHRtbC5cbiAgICAgIG9wdGlvbnMubWluVGltZSB8fCAob3B0aW9ucy5taW5UaW1lID0gbWF4KHRpbWVyLnJlcyAvIDIgLyAwLjAxLCAwLjA1KSk7XG4gICAgICByZXR1cm4gY2xvY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDb21wdXRlcyBzdGF0cyBvbiBiZW5jaG1hcmsgcmVzdWx0cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGJlbmNoIFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXB1dGUoYmVuY2gsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG5cbiAgICAgIHZhciBhc3luYyA9IG9wdGlvbnMuYXN5bmMsXG4gICAgICAgICAgZWxhcHNlZCA9IDAsXG4gICAgICAgICAgaW5pdENvdW50ID0gYmVuY2guaW5pdENvdW50LFxuICAgICAgICAgIG1pblNhbXBsZXMgPSBiZW5jaC5taW5TYW1wbGVzLFxuICAgICAgICAgIHF1ZXVlID0gW10sXG4gICAgICAgICAgc2FtcGxlID0gYmVuY2guc3RhdHMuc2FtcGxlO1xuXG4gICAgICAvKipcbiAgICAgICAqIEFkZHMgYSBjbG9uZSB0byB0aGUgcXVldWUuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIGVucXVldWUoKSB7XG4gICAgICAgIHF1ZXVlLnB1c2goYmVuY2guY2xvbmUoe1xuICAgICAgICAgICdfb3JpZ2luYWwnOiBiZW5jaCxcbiAgICAgICAgICAnZXZlbnRzJzoge1xuICAgICAgICAgICAgJ2Fib3J0JzogW3VwZGF0ZV0sXG4gICAgICAgICAgICAnY3ljbGUnOiBbdXBkYXRlXSxcbiAgICAgICAgICAgICdlcnJvcic6IFt1cGRhdGVdLFxuICAgICAgICAgICAgJ3N0YXJ0JzogW3VwZGF0ZV1cbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBVcGRhdGVzIHRoZSBjbG9uZS9vcmlnaW5hbCBiZW5jaG1hcmtzIHRvIGtlZXAgdGhlaXIgZGF0YSBpbiBzeW5jLlxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiB1cGRhdGUoZXZlbnQpIHtcbiAgICAgICAgdmFyIGNsb25lID0gdGhpcyxcbiAgICAgICAgICAgIHR5cGUgPSBldmVudC50eXBlO1xuXG4gICAgICAgIGlmIChiZW5jaC5ydW5uaW5nKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT0gJ3N0YXJ0Jykge1xuICAgICAgICAgICAgLy8gTm90ZTogYGNsb25lLm1pblRpbWVgIHByb3AgaXMgaW5pdGVkIGluIGBjbG9jaygpYC5cbiAgICAgICAgICAgIGNsb25lLmNvdW50ID0gYmVuY2guaW5pdENvdW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlID09ICdlcnJvcicpIHtcbiAgICAgICAgICAgICAgYmVuY2guZXJyb3IgPSBjbG9uZS5lcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlID09ICdhYm9ydCcpIHtcbiAgICAgICAgICAgICAgYmVuY2guYWJvcnQoKTtcbiAgICAgICAgICAgICAgYmVuY2guZW1pdCgnY3ljbGUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSBldmVudC50YXJnZXQgPSBiZW5jaDtcbiAgICAgICAgICAgICAgYmVuY2guZW1pdChldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGJlbmNoLmFib3J0ZWQpIHtcbiAgICAgICAgICAvLyBDbGVhciBhYm9ydCBsaXN0ZW5lcnMgdG8gYXZvaWQgdHJpZ2dlcmluZyBiZW5jaCdzIGFib3J0L2N5Y2xlIGFnYWluLlxuICAgICAgICAgIGNsb25lLmV2ZW50cy5hYm9ydC5sZW5ndGggPSAwO1xuICAgICAgICAgIGNsb25lLmFib3J0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlcm1pbmVzIGlmIG1vcmUgY2xvbmVzIHNob3VsZCBiZSBxdWV1ZWQgb3IgaWYgY3ljbGluZyBzaG91bGQgc3RvcC5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gZXZhbHVhdGUoZXZlbnQpIHtcbiAgICAgICAgdmFyIGNyaXRpY2FsLFxuICAgICAgICAgICAgZGYsXG4gICAgICAgICAgICBtZWFuLFxuICAgICAgICAgICAgbW9lLFxuICAgICAgICAgICAgcm1lLFxuICAgICAgICAgICAgc2QsXG4gICAgICAgICAgICBzZW0sXG4gICAgICAgICAgICB2YXJpYW5jZSxcbiAgICAgICAgICAgIGNsb25lID0gZXZlbnQudGFyZ2V0LFxuICAgICAgICAgICAgZG9uZSA9IGJlbmNoLmFib3J0ZWQsXG4gICAgICAgICAgICBub3cgPSBfLm5vdygpLFxuICAgICAgICAgICAgc2l6ZSA9IHNhbXBsZS5wdXNoKGNsb25lLnRpbWVzLnBlcmlvZCksXG4gICAgICAgICAgICBtYXhlZE91dCA9IHNpemUgPj0gbWluU2FtcGxlcyAmJiAoZWxhcHNlZCArPSBub3cgLSBjbG9uZS50aW1lcy50aW1lU3RhbXApIC8gMWUzID4gYmVuY2gubWF4VGltZSxcbiAgICAgICAgICAgIHRpbWVzID0gYmVuY2gudGltZXMsXG4gICAgICAgICAgICB2YXJPZiA9IGZ1bmN0aW9uKHN1bSwgeCkgeyByZXR1cm4gc3VtICsgcG93KHggLSBtZWFuLCAyKTsgfTtcblxuICAgICAgICAvLyBFeGl0IGVhcmx5IGZvciBhYm9ydGVkIG9yIHVuY2xvY2thYmxlIHRlc3RzLlxuICAgICAgICBpZiAoZG9uZSB8fCBjbG9uZS5oeiA9PSBJbmZpbml0eSkge1xuICAgICAgICAgIG1heGVkT3V0ID0gIShzaXplID0gc2FtcGxlLmxlbmd0aCA9IHF1ZXVlLmxlbmd0aCA9IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIG1lYW4gKGVzdGltYXRlIG9mIHRoZSBwb3B1bGF0aW9uIG1lYW4pLlxuICAgICAgICAgIG1lYW4gPSBnZXRNZWFuKHNhbXBsZSk7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc2FtcGxlIHZhcmlhbmNlIChlc3RpbWF0ZSBvZiB0aGUgcG9wdWxhdGlvbiB2YXJpYW5jZSkuXG4gICAgICAgICAgdmFyaWFuY2UgPSBfLnJlZHVjZShzYW1wbGUsIHZhck9mLCAwKSAvIChzaXplIC0gMSkgfHwgMDtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSBzYW1wbGUgc3RhbmRhcmQgZGV2aWF0aW9uIChlc3RpbWF0ZSBvZiB0aGUgcG9wdWxhdGlvbiBzdGFuZGFyZCBkZXZpYXRpb24pLlxuICAgICAgICAgIHNkID0gc3FydCh2YXJpYW5jZSk7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgc3RhbmRhcmQgZXJyb3Igb2YgdGhlIG1lYW4gKGEuay5hLiB0aGUgc3RhbmRhcmQgZGV2aWF0aW9uIG9mIHRoZSBzYW1wbGluZyBkaXN0cmlidXRpb24gb2YgdGhlIHNhbXBsZSBtZWFuKS5cbiAgICAgICAgICBzZW0gPSBzZCAvIHNxcnQoc2l6ZSk7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgZGVncmVlcyBvZiBmcmVlZG9tLlxuICAgICAgICAgIGRmID0gc2l6ZSAtIDE7XG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgY3JpdGljYWwgdmFsdWUuXG4gICAgICAgICAgY3JpdGljYWwgPSB0VGFibGVbTWF0aC5yb3VuZChkZikgfHwgMV0gfHwgdFRhYmxlLmluZmluaXR5O1xuICAgICAgICAgIC8vIENvbXB1dGUgdGhlIG1hcmdpbiBvZiBlcnJvci5cbiAgICAgICAgICBtb2UgPSBzZW0gKiBjcml0aWNhbDtcbiAgICAgICAgICAvLyBDb21wdXRlIHRoZSByZWxhdGl2ZSBtYXJnaW4gb2YgZXJyb3IuXG4gICAgICAgICAgcm1lID0gKG1vZSAvIG1lYW4pICogMTAwIHx8IDA7XG5cbiAgICAgICAgICBfLmFzc2lnbihiZW5jaC5zdGF0cywge1xuICAgICAgICAgICAgJ2RldmlhdGlvbic6IHNkLFxuICAgICAgICAgICAgJ21lYW4nOiBtZWFuLFxuICAgICAgICAgICAgJ21vZSc6IG1vZSxcbiAgICAgICAgICAgICdybWUnOiBybWUsXG4gICAgICAgICAgICAnc2VtJzogc2VtLFxuICAgICAgICAgICAgJ3ZhcmlhbmNlJzogdmFyaWFuY2VcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIEFib3J0IHRoZSBjeWNsZSBsb29wIHdoZW4gdGhlIG1pbmltdW0gc2FtcGxlIHNpemUgaGFzIGJlZW4gY29sbGVjdGVkXG4gICAgICAgICAgLy8gYW5kIHRoZSBlbGFwc2VkIHRpbWUgZXhjZWVkcyB0aGUgbWF4aW11bSB0aW1lIGFsbG93ZWQgcGVyIGJlbmNobWFyay5cbiAgICAgICAgICAvLyBXZSBkb24ndCBjb3VudCBjeWNsZSBkZWxheXMgdG93YXJkIHRoZSBtYXggdGltZSBiZWNhdXNlIGRlbGF5cyBtYXkgYmVcbiAgICAgICAgICAvLyBpbmNyZWFzZWQgYnkgYnJvd3NlcnMgdGhhdCBjbGFtcCB0aW1lb3V0cyBmb3IgaW5hY3RpdmUgdGFicy4gRm9yIG1vcmVcbiAgICAgICAgICAvLyBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vd2luZG93LnNldFRpbWVvdXQjSW5hY3RpdmVfdGFicy5cbiAgICAgICAgICBpZiAobWF4ZWRPdXQpIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBgaW5pdENvdW50YCBpbiBjYXNlIHRoZSBiZW5jaG1hcmsgaXMgcmVydW4uXG4gICAgICAgICAgICBiZW5jaC5pbml0Q291bnQgPSBpbml0Q291bnQ7XG4gICAgICAgICAgICBiZW5jaC5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHRpbWVzLmVsYXBzZWQgPSAobm93IC0gdGltZXMudGltZVN0YW1wKSAvIDFlMztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGJlbmNoLmh6ICE9IEluZmluaXR5KSB7XG4gICAgICAgICAgICBiZW5jaC5oeiA9IDEgLyBtZWFuO1xuICAgICAgICAgICAgdGltZXMuY3ljbGUgPSBtZWFuICogYmVuY2guY291bnQ7XG4gICAgICAgICAgICB0aW1lcy5wZXJpb2QgPSBtZWFuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aW1lIHBlcm1pdHMsIGluY3JlYXNlIHNhbXBsZSBzaXplIHRvIHJlZHVjZSB0aGUgbWFyZ2luIG9mIGVycm9yLlxuICAgICAgICBpZiAocXVldWUubGVuZ3RoIDwgMiAmJiAhbWF4ZWRPdXQpIHtcbiAgICAgICAgICBlbnF1ZXVlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWJvcnQgdGhlIGBpbnZva2VgIGN5Y2xlIHdoZW4gZG9uZS5cbiAgICAgICAgZXZlbnQuYWJvcnRlZCA9IGRvbmU7XG4gICAgICB9XG5cbiAgICAgIC8vIEluaXQgcXVldWUgYW5kIGJlZ2luLlxuICAgICAgZW5xdWV1ZSgpO1xuICAgICAgaW52b2tlKHF1ZXVlLCB7XG4gICAgICAgICduYW1lJzogJ3J1bicsXG4gICAgICAgICdhcmdzJzogeyAnYXN5bmMnOiBhc3luYyB9LFxuICAgICAgICAncXVldWVkJzogdHJ1ZSxcbiAgICAgICAgJ29uQ3ljbGUnOiBldmFsdWF0ZSxcbiAgICAgICAgJ29uQ29tcGxldGUnOiBmdW5jdGlvbigpIHsgYmVuY2guZW1pdCgnY29tcGxldGUnKTsgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ3ljbGVzIGEgYmVuY2htYXJrIHVudGlsIGEgcnVuIGBjb3VudGAgY2FuIGJlIGVzdGFibGlzaGVkLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2xvbmUgVGhlIGNsb25lZCBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGN5Y2xlKGNsb25lLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuXG4gICAgICB2YXIgZGVmZXJyZWQ7XG4gICAgICBpZiAoY2xvbmUgaW5zdGFuY2VvZiBEZWZlcnJlZCkge1xuICAgICAgICBkZWZlcnJlZCA9IGNsb25lO1xuICAgICAgICBjbG9uZSA9IGNsb25lLmJlbmNobWFyaztcbiAgICAgIH1cbiAgICAgIHZhciBjbG9ja2VkLFxuICAgICAgICAgIGN5Y2xlcyxcbiAgICAgICAgICBkaXZpc29yLFxuICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgIG1pblRpbWUsXG4gICAgICAgICAgcGVyaW9kLFxuICAgICAgICAgIGFzeW5jID0gb3B0aW9ucy5hc3luYyxcbiAgICAgICAgICBiZW5jaCA9IGNsb25lLl9vcmlnaW5hbCxcbiAgICAgICAgICBjb3VudCA9IGNsb25lLmNvdW50LFxuICAgICAgICAgIHRpbWVzID0gY2xvbmUudGltZXM7XG5cbiAgICAgIC8vIENvbnRpbnVlLCBpZiBub3QgYWJvcnRlZCBiZXR3ZWVuIGN5Y2xlcy5cbiAgICAgIGlmIChjbG9uZS5ydW5uaW5nKSB7XG4gICAgICAgIC8vIGBtaW5UaW1lYCBpcyBzZXQgdG8gYEJlbmNobWFyay5vcHRpb25zLm1pblRpbWVgIGluIGBjbG9jaygpYC5cbiAgICAgICAgY3ljbGVzID0gKytjbG9uZS5jeWNsZXM7XG4gICAgICAgIGNsb2NrZWQgPSBkZWZlcnJlZCA/IGRlZmVycmVkLmVsYXBzZWQgOiBjbG9jayhjbG9uZSk7XG4gICAgICAgIG1pblRpbWUgPSBjbG9uZS5taW5UaW1lO1xuXG4gICAgICAgIGlmIChjeWNsZXMgPiBiZW5jaC5jeWNsZXMpIHtcbiAgICAgICAgICBiZW5jaC5jeWNsZXMgPSBjeWNsZXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsb25lLmVycm9yKSB7XG4gICAgICAgICAgZXZlbnQgPSBFdmVudCgnZXJyb3InKTtcbiAgICAgICAgICBldmVudC5tZXNzYWdlID0gY2xvbmUuZXJyb3I7XG4gICAgICAgICAgY2xvbmUuZW1pdChldmVudCk7XG4gICAgICAgICAgaWYgKCFldmVudC5jYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIGNsb25lLmFib3J0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBDb250aW51ZSwgaWYgbm90IGVycm9yZWQuXG4gICAgICBpZiAoY2xvbmUucnVubmluZykge1xuICAgICAgICAvLyBDb21wdXRlIHRoZSB0aW1lIHRha2VuIHRvIGNvbXBsZXRlIGxhc3QgdGVzdCBjeWNsZS5cbiAgICAgICAgYmVuY2gudGltZXMuY3ljbGUgPSB0aW1lcy5jeWNsZSA9IGNsb2NrZWQ7XG4gICAgICAgIC8vIENvbXB1dGUgdGhlIHNlY29uZHMgcGVyIG9wZXJhdGlvbi5cbiAgICAgICAgcGVyaW9kID0gYmVuY2gudGltZXMucGVyaW9kID0gdGltZXMucGVyaW9kID0gY2xvY2tlZCAvIGNvdW50O1xuICAgICAgICAvLyBDb21wdXRlIHRoZSBvcHMgcGVyIHNlY29uZC5cbiAgICAgICAgYmVuY2guaHogPSBjbG9uZS5oeiA9IDEgLyBwZXJpb2Q7XG4gICAgICAgIC8vIEF2b2lkIHdvcmtpbmcgb3VyIHdheSB1cCB0byB0aGlzIG5leHQgdGltZS5cbiAgICAgICAgYmVuY2guaW5pdENvdW50ID0gY2xvbmUuaW5pdENvdW50ID0gY291bnQ7XG4gICAgICAgIC8vIERvIHdlIG5lZWQgdG8gZG8gYW5vdGhlciBjeWNsZT9cbiAgICAgICAgY2xvbmUucnVubmluZyA9IGNsb2NrZWQgPCBtaW5UaW1lO1xuXG4gICAgICAgIGlmIChjbG9uZS5ydW5uaW5nKSB7XG4gICAgICAgICAgLy8gVGVzdHMgbWF5IGNsb2NrIGF0IGAwYCB3aGVuIGBpbml0Q291bnRgIGlzIGEgc21hbGwgbnVtYmVyLFxuICAgICAgICAgIC8vIHRvIGF2b2lkIHRoYXQgd2Ugc2V0IGl0cyBjb3VudCB0byBzb21ldGhpbmcgYSBiaXQgaGlnaGVyLlxuICAgICAgICAgIGlmICghY2xvY2tlZCAmJiAoZGl2aXNvciA9IGRpdmlzb3JzW2Nsb25lLmN5Y2xlc10pICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvdW50ID0gZmxvb3IoNGU2IC8gZGl2aXNvcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIENhbGN1bGF0ZSBob3cgbWFueSBtb3JlIGl0ZXJhdGlvbnMgaXQgd2lsbCB0YWtlIHRvIGFjaGlldmUgdGhlIGBtaW5UaW1lYC5cbiAgICAgICAgICBpZiAoY291bnQgPD0gY2xvbmUuY291bnQpIHtcbiAgICAgICAgICAgIGNvdW50ICs9IE1hdGguY2VpbCgobWluVGltZSAtIGNsb2NrZWQpIC8gcGVyaW9kKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2xvbmUucnVubmluZyA9IGNvdW50ICE9IEluZmluaXR5O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBTaG91bGQgd2UgZXhpdCBlYXJseT9cbiAgICAgIGV2ZW50ID0gRXZlbnQoJ2N5Y2xlJyk7XG4gICAgICBjbG9uZS5lbWl0KGV2ZW50KTtcbiAgICAgIGlmIChldmVudC5hYm9ydGVkKSB7XG4gICAgICAgIGNsb25lLmFib3J0KCk7XG4gICAgICB9XG4gICAgICAvLyBGaWd1cmUgb3V0IHdoYXQgdG8gZG8gbmV4dC5cbiAgICAgIGlmIChjbG9uZS5ydW5uaW5nKSB7XG4gICAgICAgIC8vIFN0YXJ0IGEgbmV3IGN5Y2xlLlxuICAgICAgICBjbG9uZS5jb3VudCA9IGNvdW50O1xuICAgICAgICBpZiAoZGVmZXJyZWQpIHtcbiAgICAgICAgICBjbG9uZS5jb21waWxlZC5jYWxsKGRlZmVycmVkLCBjb250ZXh0LCB0aW1lcik7XG4gICAgICAgIH0gZWxzZSBpZiAoYXN5bmMpIHtcbiAgICAgICAgICBkZWxheShjbG9uZSwgZnVuY3Rpb24oKSB7IGN5Y2xlKGNsb25lLCBvcHRpb25zKTsgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3ljbGUoY2xvbmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy8gRml4IFRyYWNlTW9ua2V5IGJ1ZyBhc3NvY2lhdGVkIHdpdGggY2xvY2sgZmFsbGJhY2tzLlxuICAgICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cDovL2J1Z3ppbC5sYS81MDkwNjkuXG4gICAgICAgIGlmIChzdXBwb3J0LmJyb3dzZXIpIHtcbiAgICAgICAgICBydW5TY3JpcHQodWlkICsgJz0xO2RlbGV0ZSAnICsgdWlkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXZSdyZSBkb25lLlxuICAgICAgICBjbG9uZS5lbWl0KCdjb21wbGV0ZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFJ1bnMgdGhlIGJlbmNobWFyay5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBiZW5jaG1hcmsgaW5zdGFuY2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGJhc2ljIHVzYWdlXG4gICAgICogYmVuY2gucnVuKCk7XG4gICAgICpcbiAgICAgKiAvLyBvciB3aXRoIG9wdGlvbnNcbiAgICAgKiBiZW5jaC5ydW4oeyAnYXN5bmMnOiB0cnVlIH0pO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJ1bihvcHRpb25zKSB7XG4gICAgICB2YXIgYmVuY2ggPSB0aGlzLFxuICAgICAgICAgIGV2ZW50ID0gRXZlbnQoJ3N0YXJ0Jyk7XG5cbiAgICAgIC8vIFNldCBgcnVubmluZ2AgdG8gYGZhbHNlYCBzbyBgcmVzZXQoKWAgd29uJ3QgY2FsbCBgYWJvcnQoKWAuXG4gICAgICBiZW5jaC5ydW5uaW5nID0gZmFsc2U7XG4gICAgICBiZW5jaC5yZXNldCgpO1xuICAgICAgYmVuY2gucnVubmluZyA9IHRydWU7XG5cbiAgICAgIGJlbmNoLmNvdW50ID0gYmVuY2guaW5pdENvdW50O1xuICAgICAgYmVuY2gudGltZXMudGltZVN0YW1wID0gXy5ub3coKTtcbiAgICAgIGJlbmNoLmVtaXQoZXZlbnQpO1xuXG4gICAgICBpZiAoIWV2ZW50LmNhbmNlbGxlZCkge1xuICAgICAgICBvcHRpb25zID0geyAnYXN5bmMnOiAoKG9wdGlvbnMgPSBvcHRpb25zICYmIG9wdGlvbnMuYXN5bmMpID09IG51bGwgPyBiZW5jaC5hc3luYyA6IG9wdGlvbnMpICYmIHN1cHBvcnQudGltZW91dCB9O1xuXG4gICAgICAgIC8vIEZvciBjbG9uZXMgY3JlYXRlZCB3aXRoaW4gYGNvbXB1dGUoKWAuXG4gICAgICAgIGlmIChiZW5jaC5fb3JpZ2luYWwpIHtcbiAgICAgICAgICBpZiAoYmVuY2guZGVmZXIpIHtcbiAgICAgICAgICAgIERlZmVycmVkKGJlbmNoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3ljbGUoYmVuY2gsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBGb3Igb3JpZ2luYWwgYmVuY2htYXJrcy5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29tcHV0ZShiZW5jaCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiZW5jaDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBGaXJlZm94IDEgZXJyb25lb3VzbHkgZGVmaW5lcyB2YXJpYWJsZSBhbmQgYXJndW1lbnQgbmFtZXMgb2YgZnVuY3Rpb25zIG9uXG4gICAgLy8gdGhlIGZ1bmN0aW9uIGl0c2VsZiBhcyBub24tY29uZmlndXJhYmxlIHByb3BlcnRpZXMgd2l0aCBgdW5kZWZpbmVkYCB2YWx1ZXMuXG4gICAgLy8gVGhlIGJ1Z2dpbmVzcyBjb250aW51ZXMgYXMgdGhlIGBCZW5jaG1hcmtgIGNvbnN0cnVjdG9yIGhhcyBhbiBhcmd1bWVudFxuICAgIC8vIG5hbWVkIGBvcHRpb25zYCBhbmQgRmlyZWZveCAxIHdpbGwgbm90IGFzc2lnbiBhIHZhbHVlIHRvIGBCZW5jaG1hcmsub3B0aW9uc2AsXG4gICAgLy8gbWFraW5nIGl0IG5vbi13cml0YWJsZSBpbiB0aGUgcHJvY2VzcywgdW5sZXNzIGl0IGlzIHRoZSBmaXJzdCBwcm9wZXJ0eVxuICAgIC8vIGFzc2lnbmVkIGJ5IGZvci1pbiBsb29wIG9mIGBfLmFzc2lnbigpYC5cbiAgICBfLmFzc2lnbihCZW5jaG1hcmssIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmYXVsdCBvcHRpb25zIGNvcGllZCBieSBiZW5jaG1hcmsgaW5zdGFuY2VzLlxuICAgICAgICpcbiAgICAgICAqIEBzdGF0aWNcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnb3B0aW9ucyc6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIHRoYXQgYmVuY2htYXJrIGN5Y2xlcyB3aWxsIGV4ZWN1dGUgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICogYnkgZGVmYXVsdC5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAgICovXG4gICAgICAgICdhc3luYyc6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCB0aGUgYmVuY2htYXJrIGNsb2NrIGlzIGRlZmVycmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAgKi9cbiAgICAgICAgJ2RlZmVyJzogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBkZWxheSBiZXR3ZWVuIHRlc3QgY3ljbGVzIChzZWNzKS5cbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ2RlbGF5JzogMC4wMDUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXllZCBieSBgQmVuY2htYXJrI3RvU3RyaW5nYCB3aGVuIGEgYG5hbWVgIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgICogKGF1dG8tZ2VuZXJhdGVkIGlmIGFic2VudCkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgICdpZCc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRlZmF1bHQgbnVtYmVyIG9mIHRpbWVzIHRvIGV4ZWN1dGUgYSB0ZXN0IG9uIGEgYmVuY2htYXJrJ3MgZmlyc3QgY3ljbGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdpbml0Q291bnQnOiAxLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbWF4aW11bSB0aW1lIGEgYmVuY2htYXJrIGlzIGFsbG93ZWQgdG8gcnVuIGJlZm9yZSBmaW5pc2hpbmcgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBOb3RlOiBDeWNsZSBkZWxheXMgYXJlbid0IGNvdW50ZWQgdG93YXJkIHRoZSBtYXhpbXVtIHRpbWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdtYXhUaW1lJzogNSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1pbmltdW0gc2FtcGxlIHNpemUgcmVxdWlyZWQgdG8gcGVyZm9ybSBzdGF0aXN0aWNhbCBhbmFseXNpcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21pblNhbXBsZXMnOiA1LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGltZSBuZWVkZWQgdG8gcmVkdWNlIHRoZSBwZXJjZW50IHVuY2VydGFpbnR5IG9mIG1lYXN1cmVtZW50IHRvIDElIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5vcHRpb25zXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21pblRpbWUnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYmVuY2htYXJrLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgICAqL1xuICAgICAgICAnbmFtZSc6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQW4gZXZlbnQgbGlzdGVuZXIgY2FsbGVkIHdoZW4gdGhlIGJlbmNobWFyayBpcyBhYm9ydGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvbkFib3J0JzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgd2hlbiB0aGUgYmVuY2htYXJrIGNvbXBsZXRlcyBydW5uaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLm9wdGlvbnNcbiAgICAgICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgICAgICovXG4gICAgICAgICdvbkNvbXBsZXRlJzogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbiBldmVudCBsaXN0ZW5lciBjYWxsZWQgYWZ0ZXIgZWFjaCBydW4gY3ljbGUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uQ3ljbGUnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIGEgdGVzdCBlcnJvcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uRXJyb3InOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgaXMgcmVzZXQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uUmVzZXQnOiB1bmRlZmluZWQsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFuIGV2ZW50IGxpc3RlbmVyIGNhbGxlZCB3aGVuIHRoZSBiZW5jaG1hcmsgc3RhcnRzIHJ1bm5pbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsub3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgJ29uU3RhcnQnOiB1bmRlZmluZWRcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUGxhdGZvcm0gb2JqZWN0IHdpdGggcHJvcGVydGllcyBkZXNjcmliaW5nIHRoaW5ncyBsaWtlIGJyb3dzZXIgbmFtZSxcbiAgICAgICAqIHZlcnNpb24sIGFuZCBvcGVyYXRpbmcgc3lzdGVtLiBTZWUgW2BwbGF0Zm9ybS5qc2BdKGh0dHBzOi8vbXRocy5iZS9wbGF0Zm9ybSkuXG4gICAgICAgKlxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdwbGF0Zm9ybSc6IGNvbnRleHQucGxhdGZvcm0gfHwgcmVxdWlyZSgncGxhdGZvcm0nKSB8fCAoe1xuICAgICAgICAnZGVzY3JpcHRpb24nOiBjb250ZXh0Lm5hdmlnYXRvciAmJiBjb250ZXh0Lm5hdmlnYXRvci51c2VyQWdlbnQgfHwgbnVsbCxcbiAgICAgICAgJ2xheW91dCc6IG51bGwsXG4gICAgICAgICdwcm9kdWN0JzogbnVsbCxcbiAgICAgICAgJ25hbWUnOiBudWxsLFxuICAgICAgICAnbWFudWZhY3R1cmVyJzogbnVsbCxcbiAgICAgICAgJ29zJzogbnVsbCxcbiAgICAgICAgJ3ByZXJlbGVhc2UnOiBudWxsLFxuICAgICAgICAndmVyc2lvbic6IG51bGwsXG4gICAgICAgICd0b1N0cmluZyc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uIHx8ICcnO1xuICAgICAgICB9XG4gICAgICB9KSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuXG4gICAgICAgKlxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKi9cbiAgICAgICd2ZXJzaW9uJzogJzIuMS4xJ1xuICAgIH0pO1xuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLCB7XG4gICAgICAnZmlsdGVyJzogZmlsdGVyLFxuICAgICAgJ2Zvcm1hdE51bWJlcic6IGZvcm1hdE51bWJlcixcbiAgICAgICdpbnZva2UnOiBpbnZva2UsXG4gICAgICAnam9pbic6IGpvaW4sXG4gICAgICAncnVuSW5Db250ZXh0JzogcnVuSW5Db250ZXh0LFxuICAgICAgJ3N1cHBvcnQnOiBzdXBwb3J0XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgbG9kYXNoIG1ldGhvZHMgdG8gQmVuY2htYXJrLlxuICAgIF8uZWFjaChbJ2VhY2gnLCAnZm9yRWFjaCcsICdmb3JPd24nLCAnaGFzJywgJ2luZGV4T2YnLCAnbWFwJywgJ3JlZHVjZSddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICBCZW5jaG1hcmtbbWV0aG9kTmFtZV0gPSBfW21ldGhvZE5hbWVdO1xuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLnByb3RvdHlwZSwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgdGltZXMgYSB0ZXN0IHdhcyBleGVjdXRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2NvdW50JzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGN5Y2xlcyBwZXJmb3JtZWQgd2hpbGUgYmVuY2htYXJraW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnY3ljbGVzJzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGV4ZWN1dGlvbnMgcGVyIHNlY29uZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2h6JzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY29tcGlsZWQgdGVzdCBmdW5jdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258c3RyaW5nfVxuICAgICAgICovXG4gICAgICAnY29tcGlsZWQnOiB1bmRlZmluZWQsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGVycm9yIG9iamVjdCBpZiB0aGUgdGVzdCBmYWlsZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdlcnJvcic6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdGVzdCB0byBiZW5jaG1hcmsuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUge0Z1bmN0aW9ufHN0cmluZ31cbiAgICAgICAqL1xuICAgICAgJ2ZuJzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgYmVuY2htYXJrIGlzIGFib3J0ZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAnYWJvcnRlZCc6IGZhbHNlLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgYmVuY2htYXJrIGlzIHJ1bm5pbmcuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAncnVubmluZyc6IGZhbHNlLFxuXG4gICAgICAvKipcbiAgICAgICAqIENvbXBpbGVkIGludG8gdGhlIHRlc3QgYW5kIGV4ZWN1dGVkIGltbWVkaWF0ZWx5ICoqYmVmb3JlKiogdGhlIHRlc3QgbG9vcC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258c3RyaW5nfVxuICAgICAgICogQGV4YW1wbGVcbiAgICAgICAqXG4gICAgICAgKiAvLyBiYXNpYyB1c2FnZVxuICAgICAgICogdmFyIGJlbmNoID0gQmVuY2htYXJrKHtcbiAgICAgICAqICAgJ3NldHVwJzogZnVuY3Rpb24oKSB7XG4gICAgICAgKiAgICAgdmFyIGMgPSB0aGlzLmNvdW50LFxuICAgICAgICogICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuICAgICAgICogICAgIHdoaWxlIChjLS0pIHtcbiAgICAgICAqICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICogICAgIH1cbiAgICAgICAqICAgfSxcbiAgICAgICAqICAgJ2ZuJzogZnVuY3Rpb24oKSB7XG4gICAgICAgKiAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50Lmxhc3RDaGlsZCk7XG4gICAgICAgKiAgIH1cbiAgICAgICAqIH0pO1xuICAgICAgICpcbiAgICAgICAqIC8vIGNvbXBpbGVzIHRvIHNvbWV0aGluZyBsaWtlOlxuICAgICAgICogdmFyIGMgPSB0aGlzLmNvdW50LFxuICAgICAgICogICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG4gICAgICAgKiB3aGlsZSAoYy0tKSB7XG4gICAgICAgKiAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICogfVxuICAgICAgICogdmFyIHN0YXJ0ID0gbmV3IERhdGU7XG4gICAgICAgKiB3aGlsZSAoY291bnQtLSkge1xuICAgICAgICogICBlbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQubGFzdENoaWxkKTtcbiAgICAgICAqIH1cbiAgICAgICAqIHZhciBlbmQgPSBuZXcgRGF0ZSAtIHN0YXJ0O1xuICAgICAgICpcbiAgICAgICAqIC8vIG9yIHVzaW5nIHN0cmluZ3NcbiAgICAgICAqIHZhciBiZW5jaCA9IEJlbmNobWFyayh7XG4gICAgICAgKiAgICdzZXR1cCc6ICdcXFxuICAgICAgICogICAgIHZhciBhID0gMDtcXG5cXFxuICAgICAgICogICAgIChmdW5jdGlvbigpIHtcXG5cXFxuICAgICAgICogICAgICAgKGZ1bmN0aW9uKCkge1xcblxcXG4gICAgICAgKiAgICAgICAgIChmdW5jdGlvbigpIHsnLFxuICAgICAgICogICAnZm4nOiAnYSArPSAxOycsXG4gICAgICAgKiAgICd0ZWFyZG93bic6ICdcXFxuICAgICAgICogICAgICAgICAgfSgpKVxcblxcXG4gICAgICAgKiAgICAgICAgfSgpKVxcblxcXG4gICAgICAgKiAgICAgIH0oKSknXG4gICAgICAgKiB9KTtcbiAgICAgICAqXG4gICAgICAgKiAvLyBjb21waWxlcyB0byBzb21ldGhpbmcgbGlrZTpcbiAgICAgICAqIHZhciBhID0gMDtcbiAgICAgICAqIChmdW5jdGlvbigpIHtcbiAgICAgICAqICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICogICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAqICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlO1xuICAgICAgICogICAgICAgd2hpbGUgKGNvdW50LS0pIHtcbiAgICAgICAqICAgICAgICAgYSArPSAxO1xuICAgICAgICogICAgICAgfVxuICAgICAgICogICAgICAgdmFyIGVuZCA9IG5ldyBEYXRlIC0gc3RhcnQ7XG4gICAgICAgKiAgICAgfSgpKVxuICAgICAgICogICB9KCkpXG4gICAgICAgKiB9KCkpXG4gICAgICAgKi9cbiAgICAgICdzZXR1cCc6IF8ubm9vcCxcblxuICAgICAgLyoqXG4gICAgICAgKiBDb21waWxlZCBpbnRvIHRoZSB0ZXN0IGFuZCBleGVjdXRlZCBpbW1lZGlhdGVseSAqKmFmdGVyKiogdGhlIHRlc3QgbG9vcC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrXG4gICAgICAgKiBAdHlwZSB7RnVuY3Rpb258c3RyaW5nfVxuICAgICAgICovXG4gICAgICAndGVhcmRvd24nOiBfLm5vb3AsXG5cbiAgICAgIC8qKlxuICAgICAgICogQW4gb2JqZWN0IG9mIHN0YXRzIGluY2x1ZGluZyBtZWFuLCBtYXJnaW4gb3IgZXJyb3IsIGFuZCBzdGFuZGFyZCBkZXZpYXRpb24uXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFya1xuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdzdGF0cyc6IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIG1hcmdpbiBvZiBlcnJvci5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdtb2UnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcmVsYXRpdmUgbWFyZ2luIG9mIGVycm9yIChleHByZXNzZWQgYXMgYSBwZXJjZW50YWdlIG9mIHRoZSBtZWFuKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayNzdGF0c1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdybWUnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc3RhbmRhcmQgZXJyb3Igb2YgdGhlIG1lYW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnc2VtJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNhbXBsZSBzdGFuZGFyZCBkZXZpYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAnZGV2aWF0aW9uJzogMCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNhbXBsZSBhcml0aG1ldGljIG1lYW4gKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ21lYW4nOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYXJyYXkgb2Ygc2FtcGxlZCBwZXJpb2RzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3N0YXRzXG4gICAgICAgICAqIEB0eXBlIEFycmF5XG4gICAgICAgICAqL1xuICAgICAgICAnc2FtcGxlJzogW10sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzYW1wbGUgdmFyaWFuY2UuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjc3RhdHNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAndmFyaWFuY2UnOiAwXG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFuIG9iamVjdCBvZiB0aW1pbmcgZGF0YSBpbmNsdWRpbmcgY3ljbGUsIGVsYXBzZWQsIHBlcmlvZCwgc3RhcnQsIGFuZCBzdG9wLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmtcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAndGltZXMnOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lIHRha2VuIHRvIGNvbXBsZXRlIHRoZSBsYXN0IGN5Y2xlIChzZWNzKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyayN0aW1lc1xuICAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgICovXG4gICAgICAgICdjeWNsZSc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lIHRha2VuIHRvIGNvbXBsZXRlIHRoZSBiZW5jaG1hcmsgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3RpbWVzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ2VsYXBzZWQnOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgdGltZSB0YWtlbiB0byBleGVjdXRlIHRoZSB0ZXN0IG9uY2UgKHNlY3MpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrI3RpbWVzXG4gICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAgKi9cbiAgICAgICAgJ3BlcmlvZCc6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgdGltZXN0YW1wIG9mIHdoZW4gdGhlIGJlbmNobWFyayBzdGFydGVkIChtcykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsjdGltZXNcbiAgICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICAqL1xuICAgICAgICAndGltZVN0YW1wJzogMFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgXy5hc3NpZ24oQmVuY2htYXJrLnByb3RvdHlwZSwge1xuICAgICAgJ2Fib3J0JzogYWJvcnQsXG4gICAgICAnY2xvbmUnOiBjbG9uZSxcbiAgICAgICdjb21wYXJlJzogY29tcGFyZSxcbiAgICAgICdlbWl0JzogZW1pdCxcbiAgICAgICdsaXN0ZW5lcnMnOiBsaXN0ZW5lcnMsXG4gICAgICAnb2ZmJzogb2ZmLFxuICAgICAgJ29uJzogb24sXG4gICAgICAncmVzZXQnOiByZXNldCxcbiAgICAgICdydW4nOiBydW4sXG4gICAgICAndG9TdHJpbmcnOiB0b1N0cmluZ0JlbmNoXG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICBfLmFzc2lnbihEZWZlcnJlZC5wcm90b3R5cGUsIHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgZGVmZXJyZWQgYmVuY2htYXJrIGluc3RhbmNlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAnYmVuY2htYXJrJzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbnVtYmVyIG9mIGRlZmVycmVkIGN5Y2xlcyBwZXJmb3JtZWQgd2hpbGUgYmVuY2htYXJraW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRGVmZXJyZWRcbiAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICovXG4gICAgICAnY3ljbGVzJzogMCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdGltZSB0YWtlbiB0byBjb21wbGV0ZSB0aGUgZGVmZXJyZWQgYmVuY2htYXJrIChzZWNzKS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkRlZmVycmVkXG4gICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAqL1xuICAgICAgJ2VsYXBzZWQnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgdGltZXN0YW1wIG9mIHdoZW4gdGhlIGRlZmVycmVkIGJlbmNobWFyayBzdGFydGVkIChtcykuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5EZWZlcnJlZFxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICd0aW1lU3RhbXAnOiAwXG4gICAgfSk7XG5cbiAgICBfLmFzc2lnbihEZWZlcnJlZC5wcm90b3R5cGUsIHtcbiAgICAgICdyZXNvbHZlJzogcmVzb2x2ZVxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgXy5hc3NpZ24oRXZlbnQucHJvdG90eXBlLCB7XG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBlbWl0dGVycyBsaXN0ZW5lciBpdGVyYXRpb24gaXMgYWJvcnRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLkV2ZW50XG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdhYm9ydGVkJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBkZWZhdWx0IGFjdGlvbiBpcyBjYW5jZWxsZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICovXG4gICAgICAnY2FuY2VsbGVkJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG9iamVjdCB3aG9zZSBsaXN0ZW5lcnMgYXJlIGN1cnJlbnRseSBiZWluZyBwcm9jZXNzZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgT2JqZWN0XG4gICAgICAgKi9cbiAgICAgICdjdXJyZW50VGFyZ2V0JzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGxhc3QgZXhlY3V0ZWQgbGlzdGVuZXIuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgTWl4ZWRcbiAgICAgICAqL1xuICAgICAgJ3Jlc3VsdCc6IHVuZGVmaW5lZCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgb2JqZWN0IHRvIHdoaWNoIHRoZSBldmVudCB3YXMgb3JpZ2luYWxseSBlbWl0dGVkLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAgICovXG4gICAgICAndGFyZ2V0JzogdW5kZWZpbmVkLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgdGltZXN0YW1wIG9mIHdoZW4gdGhlIGV2ZW50IHdhcyBjcmVhdGVkIChtcykuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5FdmVudFxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICd0aW1lU3RhbXAnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBldmVudCB0eXBlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuRXZlbnRcbiAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICovXG4gICAgICAndHlwZSc6ICcnXG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCBvcHRpb25zIGNvcGllZCBieSBzdWl0ZSBpbnN0YW5jZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIFN1aXRlLm9wdGlvbnMgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIG5hbWUgb2YgdGhlIHN1aXRlLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGUub3B0aW9uc1xuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKi9cbiAgICAgICduYW1lJzogdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIF8uYXNzaWduKFN1aXRlLnByb3RvdHlwZSwge1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBudW1iZXIgb2YgYmVuY2htYXJrcyBpbiB0aGUgc3VpdGUuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIEJlbmNobWFyay5TdWl0ZVxuICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgKi9cbiAgICAgICdsZW5ndGgnOiAwLFxuXG4gICAgICAvKipcbiAgICAgICAqIEEgZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgc3VpdGUgaXMgYWJvcnRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgQmVuY2htYXJrLlN1aXRlXG4gICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgKi9cbiAgICAgICdhYm9ydGVkJzogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogQSBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBzdWl0ZSBpcyBydW5uaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBCZW5jaG1hcmsuU3VpdGVcbiAgICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgICAqL1xuICAgICAgJ3J1bm5pbmcnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgXy5hc3NpZ24oU3VpdGUucHJvdG90eXBlLCB7XG4gICAgICAnYWJvcnQnOiBhYm9ydFN1aXRlLFxuICAgICAgJ2FkZCc6IGFkZCxcbiAgICAgICdjbG9uZSc6IGNsb25lU3VpdGUsXG4gICAgICAnZW1pdCc6IGVtaXQsXG4gICAgICAnZmlsdGVyJzogZmlsdGVyU3VpdGUsXG4gICAgICAnam9pbic6IGFycmF5UmVmLmpvaW4sXG4gICAgICAnbGlzdGVuZXJzJzogbGlzdGVuZXJzLFxuICAgICAgJ29mZic6IG9mZixcbiAgICAgICdvbic6IG9uLFxuICAgICAgJ3BvcCc6IGFycmF5UmVmLnBvcCxcbiAgICAgICdwdXNoJzogcHVzaCxcbiAgICAgICdyZXNldCc6IHJlc2V0U3VpdGUsXG4gICAgICAncnVuJzogcnVuU3VpdGUsXG4gICAgICAncmV2ZXJzZSc6IGFycmF5UmVmLnJldmVyc2UsXG4gICAgICAnc2hpZnQnOiBzaGlmdCxcbiAgICAgICdzbGljZSc6IHNsaWNlLFxuICAgICAgJ3NvcnQnOiBhcnJheVJlZi5zb3J0LFxuICAgICAgJ3NwbGljZSc6IGFycmF5UmVmLnNwbGljZSxcbiAgICAgICd1bnNoaWZ0JzogdW5zaGlmdFxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gRXhwb3NlIERlZmVycmVkLCBFdmVudCwgYW5kIFN1aXRlLlxuICAgIF8uYXNzaWduKEJlbmNobWFyaywge1xuICAgICAgJ0RlZmVycmVkJzogRGVmZXJyZWQsXG4gICAgICAnRXZlbnQnOiBFdmVudCxcbiAgICAgICdTdWl0ZSc6IFN1aXRlXG4gICAgfSk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBBZGQgbG9kYXNoIG1ldGhvZHMgYXMgU3VpdGUgbWV0aG9kcy5cbiAgICBfLmVhY2goWydlYWNoJywgJ2ZvckVhY2gnLCAnaW5kZXhPZicsICdtYXAnLCAncmVkdWNlJ10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gX1ttZXRob2ROYW1lXTtcbiAgICAgIFN1aXRlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseShfLCBhcmdzKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBBdm9pZCBhcnJheS1saWtlIG9iamVjdCBidWdzIHdpdGggYEFycmF5I3NoaWZ0YCBhbmQgYEFycmF5I3NwbGljZWBcbiAgICAvLyBpbiBGaXJlZm94IDwgMTAgYW5kIElFIDwgOS5cbiAgICBfLmVhY2goWydwb3AnLCAnc2hpZnQnLCAnc3BsaWNlJ10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBmdW5jID0gYXJyYXlSZWZbbWV0aG9kTmFtZV07XG5cbiAgICAgIFN1aXRlLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLFxuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh2YWx1ZSwgYXJndW1lbnRzKTtcblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgZGVsZXRlIHZhbHVlWzBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gQXZvaWQgYnVnZ3kgYEFycmF5I3Vuc2hpZnRgIGluIElFIDwgOCB3aGljaCBkb2Vzbid0IHJldHVybiB0aGUgbmV3XG4gICAgLy8gbGVuZ3RoIG9mIHRoZSBhcnJheS5cbiAgICBTdWl0ZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHZhbHVlID0gdGhpcztcbiAgICAgIHVuc2hpZnQuYXBwbHkodmFsdWUsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gdmFsdWUubGVuZ3RoO1xuICAgIH07XG5cbiAgICByZXR1cm4gQmVuY2htYXJrO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gRXhwb3J0IEJlbmNobWFyay5cbiAgLy8gU29tZSBBTUQgYnVpbGQgb3B0aW1pemVycywgbGlrZSByLmpzLCBjaGVjayBmb3IgY29uZGl0aW9uIHBhdHRlcm5zIGxpa2UgdGhlIGZvbGxvd2luZzpcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gRGVmaW5lIGFzIGFuIGFub255bW91cyBtb2R1bGUgc28sIHRocm91Z2ggcGF0aCBtYXBwaW5nLCBpdCBjYW4gYmUgYWxpYXNlZC5cbiAgICBkZWZpbmUoWydsb2Rhc2gnLCAncGxhdGZvcm0nXSwgZnVuY3Rpb24oXywgcGxhdGZvcm0pIHtcbiAgICAgIHJldHVybiBydW5JbkNvbnRleHQoe1xuICAgICAgICAnXyc6IF8sXG4gICAgICAgICdwbGF0Zm9ybSc6IHBsYXRmb3JtXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICB2YXIgQmVuY2htYXJrID0gcnVuSW5Db250ZXh0KCk7XG5cbiAgICAvLyBDaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0LlxuICAgIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgICAvLyBFeHBvcnQgZm9yIE5vZGUuanMuXG4gICAgICBpZiAobW9kdWxlRXhwb3J0cykge1xuICAgICAgICAoZnJlZU1vZHVsZS5leHBvcnRzID0gQmVuY2htYXJrKS5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG4gICAgICB9XG4gICAgICAvLyBFeHBvcnQgZm9yIENvbW1vbkpTIHN1cHBvcnQuXG4gICAgICBmcmVlRXhwb3J0cy5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gRXhwb3J0IHRvIHRoZSBnbG9iYWwgb2JqZWN0LlxuICAgICAgcm9vdC5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG4gICAgfVxuICB9XG59LmNhbGwodGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2JlbmNobWFyay9iZW5jaG1hcmsuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIVxuICogUGxhdGZvcm0uanMgdjEuMy4xIDxodHRwOi8vbXRocy5iZS9wbGF0Zm9ybT5cbiAqIENvcHlyaWdodCAyMDE0LTIwMTYgQmVuamFtaW4gVGFuIDxodHRwczovL2QxMC5naXRodWIuaW8vPlxuICogQ29weXJpZ2h0IDIwMTEtMjAxMyBKb2huLURhdmlkIERhbHRvbiA8aHR0cDovL2FsbHlvdWNhbmxlZXQuY29tLz5cbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL210aHMuYmUvbWl0PlxuICovXG47KGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgYE9iamVjdGAgKi9cbiAgdmFyIG9iamVjdFR5cGVzID0ge1xuICAgICdmdW5jdGlvbic6IHRydWUsXG4gICAgJ29iamVjdCc6IHRydWVcbiAgfTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIEJhY2t1cCBwb3NzaWJsZSBnbG9iYWwgb2JqZWN0ICovXG4gIHZhciBvbGRSb290ID0gcm9vdDtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgICovXG4gIHZhciBmcmVlRXhwb3J0cyA9IG9iamVjdFR5cGVzW3R5cGVvZiBleHBvcnRzXSAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYCAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzIG9yIEJyb3dzZXJpZmllZCBjb2RlIGFuZCB1c2UgaXQgYXMgYHJvb3RgICovXG4gIHZhciBmcmVlR2xvYmFsID0gZnJlZUV4cG9ydHMgJiYgZnJlZU1vZHVsZSAmJiB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbDtcbiAgaWYgKGZyZWVHbG9iYWwgJiYgKGZyZWVHbG9iYWwuZ2xvYmFsID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwud2luZG93ID09PSBmcmVlR2xvYmFsIHx8IGZyZWVHbG9iYWwuc2VsZiA9PT0gZnJlZUdsb2JhbCkpIHtcbiAgICByb290ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGFzIHRoZSBtYXhpbXVtIGxlbmd0aCBvZiBhbiBhcnJheS1saWtlIG9iamVjdC5cbiAgICogU2VlIHRoZSBbRVM2IHNwZWNdKGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKVxuICAgKiBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKi9cbiAgdmFyIG1heFNhZmVJbnRlZ2VyID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuICAvKiogT3BlcmEgcmVnZXhwICovXG4gIHZhciByZU9wZXJhID0gL1xcYk9wZXJhLztcblxuICAvKiogUG9zc2libGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgdGhpc0JpbmRpbmcgPSB0aGlzO1xuXG4gIC8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgKi9cbiAgdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICAvKiogVXNlZCB0byBjaGVjayBmb3Igb3duIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0ICovXG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIGBbW0NsYXNzXV1gIG9mIHZhbHVlcyAqL1xuICB2YXIgdG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ2FwaXRhbGl6ZXMgYSBzdHJpbmcgdmFsdWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjYXBpdGFsaXplLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY2FwaXRhbGl6ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyaW5nKTtcbiAgICByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgdXRpbGl0eSBmdW5jdGlvbiB0byBjbGVhbiB1cCB0aGUgT1MgbmFtZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9zIFRoZSBPUyBuYW1lIHRvIGNsZWFuIHVwLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3BhdHRlcm5dIEEgYFJlZ0V4cGAgcGF0dGVybiBtYXRjaGluZyB0aGUgT1MgbmFtZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtsYWJlbF0gQSBsYWJlbCBmb3IgdGhlIE9TLlxuICAgKi9cbiAgZnVuY3Rpb24gY2xlYW51cE9TKG9zLCBwYXR0ZXJuLCBsYWJlbCkge1xuICAgIC8vIHBsYXRmb3JtIHRva2VucyBkZWZpbmVkIGF0XG4gICAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgLy8gaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAwODExMjIwNTM5NTAvaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM3NTAzKFZTLjg1KS5hc3B4XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAnNi40JzogICcxMCcsXG4gICAgICAnNi4zJzogICc4LjEnLFxuICAgICAgJzYuMic6ICAnOCcsXG4gICAgICAnNi4xJzogICdTZXJ2ZXIgMjAwOCBSMiAvIDcnLFxuICAgICAgJzYuMCc6ICAnU2VydmVyIDIwMDggLyBWaXN0YScsXG4gICAgICAnNS4yJzogICdTZXJ2ZXIgMjAwMyAvIFhQIDY0LWJpdCcsXG4gICAgICAnNS4xJzogICdYUCcsXG4gICAgICAnNS4wMSc6ICcyMDAwIFNQMScsXG4gICAgICAnNS4wJzogICcyMDAwJyxcbiAgICAgICc0LjAnOiAgJ05UJyxcbiAgICAgICc0LjkwJzogJ01FJ1xuICAgIH07XG4gICAgLy8gZGV0ZWN0IFdpbmRvd3MgdmVyc2lvbiBmcm9tIHBsYXRmb3JtIHRva2Vuc1xuICAgIGlmIChwYXR0ZXJuICYmIGxhYmVsICYmIC9eV2luL2kudGVzdChvcykgJiZcbiAgICAgICAgKGRhdGEgPSBkYXRhWzAvKk9wZXJhIDkuMjUgZml4Ki8sIC9bXFxkLl0rJC8uZXhlYyhvcyldKSkge1xuICAgICAgb3MgPSAnV2luZG93cyAnICsgZGF0YTtcbiAgICB9XG4gICAgLy8gY29ycmVjdCBjaGFyYWN0ZXIgY2FzZSBhbmQgY2xlYW51cFxuICAgIG9zID0gU3RyaW5nKG9zKTtcblxuICAgIGlmIChwYXR0ZXJuICYmIGxhYmVsKSB7XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKHBhdHRlcm4sICdpJyksIGxhYmVsKTtcbiAgICB9XG5cbiAgICBvcyA9IGZvcm1hdChcbiAgICAgIG9zLnJlcGxhY2UoLyBjZSQvaSwgJyBDRScpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJocHcvaSwgJ3dlYicpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWNpbnRvc2hcXGIvLCAnTWFjIE9TJylcbiAgICAgICAgLnJlcGxhY2UoL19Qb3dlclBDXFxiL2ksICcgT1MnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKE9TIFgpIFteIFxcZF0rL2ksICckMScpXG4gICAgICAgIC5yZXBsYWNlKC9cXGJNYWMgKE9TIFgpXFxiLywgJyQxJylcbiAgICAgICAgLnJlcGxhY2UoL1xcLyhcXGQpLywgJyAkMScpXG4gICAgICAgIC5yZXBsYWNlKC9fL2csICcuJylcbiAgICAgICAgLnJlcGxhY2UoLyg/OiBCZVBDfFsgLl0qZmNbIFxcZC5dKykkL2ksICcnKVxuICAgICAgICAucmVwbGFjZSgvXFxieDg2XFwuNjRcXGIvZ2ksICd4ODZfNjQnKVxuICAgICAgICAucmVwbGFjZSgvXFxiKFdpbmRvd3MgUGhvbmUpIE9TXFxiLywgJyQxJylcbiAgICAgICAgLnNwbGl0KCcgb24gJylbMF1cbiAgICApO1xuXG4gICAgcmV0dXJuIG9zO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGl0ZXJhdGlvbiB1dGlsaXR5IGZvciBhcnJheXMgYW5kIG9iamVjdHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2gob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBvYmplY3QgPyBvYmplY3QubGVuZ3RoIDogMDtcblxuICAgIGlmICh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInICYmIGxlbmd0aCA+IC0xICYmIGxlbmd0aCA8PSBtYXhTYWZlSW50ZWdlcikge1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2luZGV4XSwgaW5kZXgsIG9iamVjdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvck93bihvYmplY3QsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpbSBhbmQgY29uZGl0aW9uYWxseSBjYXBpdGFsaXplIHN0cmluZyB2YWx1ZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBmb3JtYXQuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gZm9ybWF0KHN0cmluZykge1xuICAgIHN0cmluZyA9IHRyaW0oc3RyaW5nKTtcbiAgICByZXR1cm4gL14oPzp3ZWJPU3xpKD86T1N8UCkpLy50ZXN0KHN0cmluZylcbiAgICAgID8gc3RyaW5nXG4gICAgICA6IGNhcGl0YWxpemUoc3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLCBleGVjdXRpbmcgdGhlIGBjYWxsYmFja2AgZm9yIGVhY2guXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiBleGVjdXRlZCBwZXIgb3duIHByb3BlcnR5LlxuICAgKi9cbiAgZnVuY3Rpb24gZm9yT3duKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgICAgY2FsbGJhY2sob2JqZWN0W2tleV0sIGtleSwgb2JqZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgaW50ZXJuYWwgYFtbQ2xhc3NdXWAgb2YgYSB2YWx1ZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBgW1tDbGFzc11dYC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldENsYXNzT2YodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT0gbnVsbFxuICAgICAgPyBjYXBpdGFsaXplKHZhbHVlKVxuICAgICAgOiB0b1N0cmluZy5jYWxsKHZhbHVlKS5zbGljZSg4LCAtMSk7XG4gIH1cblxuICAvKipcbiAgICogSG9zdCBvYmplY3RzIGNhbiByZXR1cm4gdHlwZSB2YWx1ZXMgdGhhdCBhcmUgZGlmZmVyZW50IGZyb20gdGhlaXIgYWN0dWFsXG4gICAqIGRhdGEgdHlwZS4gVGhlIG9iamVjdHMgd2UgYXJlIGNvbmNlcm5lZCB3aXRoIHVzdWFsbHkgcmV0dXJuIG5vbi1wcmltaXRpdmVcbiAgICogdHlwZXMgb2YgXCJvYmplY3RcIiwgXCJmdW5jdGlvblwiLCBvciBcInVua25vd25cIi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIG93bmVyIG9mIHRoZSBwcm9wZXJ0eS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFRoZSBwcm9wZXJ0eSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBwcm9wZXJ0eSB2YWx1ZSBpcyBhIG5vbi1wcmltaXRpdmUsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzSG9zdFR5cGUob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHZhciB0eXBlID0gb2JqZWN0ICE9IG51bGwgPyB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA6ICdudW1iZXInO1xuICAgIHJldHVybiAhL14oPzpib29sZWFufG51bWJlcnxzdHJpbmd8dW5kZWZpbmVkKSQvLnRlc3QodHlwZSkgJiZcbiAgICAgICh0eXBlID09ICdvYmplY3QnID8gISFvYmplY3RbcHJvcGVydHldIDogdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZXMgYSBzdHJpbmcgZm9yIHVzZSBpbiBhIGBSZWdFeHBgIGJ5IG1ha2luZyBoeXBoZW5zIGFuZCBzcGFjZXMgb3B0aW9uYWwuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBxdWFsaWZ5LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcXVhbGlmaWVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHF1YWxpZnkoc3RyaW5nKSB7XG4gICAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoLyhbIC1dKSg/ISQpL2csICckMT8nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGJhcmUtYm9uZXMgYEFycmF5I3JlZHVjZWAgbGlrZSB1dGlsaXR5IGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAqIEByZXR1cm5zIHsqfSBUaGUgYWNjdW11bGF0ZWQgcmVzdWx0LlxuICAgKi9cbiAgZnVuY3Rpb24gcmVkdWNlKGFycmF5LCBjYWxsYmFjaykge1xuICAgIHZhciBhY2N1bXVsYXRvciA9IG51bGw7XG4gICAgZWFjaChhcnJheSwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICBhY2N1bXVsYXRvciA9IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGFycmF5KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlIGZyb20gYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdHJpbW1lZCBzdHJpbmcuXG4gICAqL1xuICBmdW5jdGlvbiB0cmltKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9eICt8ICskL2csICcnKTtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IHBsYXRmb3JtIG9iamVjdC5cbiAgICpcbiAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gW3VhPW5hdmlnYXRvci51c2VyQWdlbnRdIFRoZSB1c2VyIGFnZW50IHN0cmluZyBvclxuICAgKiAgY29udGV4dCBvYmplY3QuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IEEgcGxhdGZvcm0gb2JqZWN0LlxuICAgKi9cbiAgZnVuY3Rpb24gcGFyc2UodWEpIHtcblxuICAgIC8qKiBUaGUgZW52aXJvbm1lbnQgY29udGV4dCBvYmplY3QgKi9cbiAgICB2YXIgY29udGV4dCA9IHJvb3Q7XG5cbiAgICAvKiogVXNlZCB0byBmbGFnIHdoZW4gYSBjdXN0b20gY29udGV4dCBpcyBwcm92aWRlZCAqL1xuICAgIHZhciBpc0N1c3RvbUNvbnRleHQgPSB1YSAmJiB0eXBlb2YgdWEgPT0gJ29iamVjdCcgJiYgZ2V0Q2xhc3NPZih1YSkgIT0gJ1N0cmluZyc7XG5cbiAgICAvLyBqdWdnbGUgYXJndW1lbnRzXG4gICAgaWYgKGlzQ3VzdG9tQ29udGV4dCkge1xuICAgICAgY29udGV4dCA9IHVhO1xuICAgICAgdWEgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKiBCcm93c2VyIG5hdmlnYXRvciBvYmplY3QgKi9cbiAgICB2YXIgbmF2ID0gY29udGV4dC5uYXZpZ2F0b3IgfHwge307XG5cbiAgICAvKiogQnJvd3NlciB1c2VyIGFnZW50IHN0cmluZyAqL1xuICAgIHZhciB1c2VyQWdlbnQgPSBuYXYudXNlckFnZW50IHx8ICcnO1xuXG4gICAgdWEgfHwgKHVhID0gdXNlckFnZW50KTtcblxuICAgIC8qKiBVc2VkIHRvIGZsYWcgd2hlbiBgdGhpc0JpbmRpbmdgIGlzIHRoZSBbTW9kdWxlU2NvcGVdICovXG4gICAgdmFyIGlzTW9kdWxlU2NvcGUgPSBpc0N1c3RvbUNvbnRleHQgfHwgdGhpc0JpbmRpbmcgPT0gb2xkUm9vdDtcblxuICAgIC8qKiBVc2VkIHRvIGRldGVjdCBpZiBicm93c2VyIGlzIGxpa2UgQ2hyb21lICovXG4gICAgdmFyIGxpa2VDaHJvbWUgPSBpc0N1c3RvbUNvbnRleHRcbiAgICAgID8gISFuYXYubGlrZUNocm9tZVxuICAgICAgOiAvXFxiQ2hyb21lXFxiLy50ZXN0KHVhKSAmJiAhL2ludGVybmFsfFxcbi9pLnRlc3QodG9TdHJpbmcudG9TdHJpbmcoKSk7XG5cbiAgICAvKiogSW50ZXJuYWwgYFtbQ2xhc3NdXWAgdmFsdWUgc2hvcnRjdXRzICovXG4gICAgdmFyIG9iamVjdENsYXNzID0gJ09iamVjdCcsXG4gICAgICAgIGFpclJ1bnRpbWVDbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ1NjcmlwdEJyaWRnaW5nUHJveHlPYmplY3QnLFxuICAgICAgICBlbnZpcm9DbGFzcyA9IGlzQ3VzdG9tQ29udGV4dCA/IG9iamVjdENsYXNzIDogJ0Vudmlyb25tZW50JyxcbiAgICAgICAgamF2YUNsYXNzID0gKGlzQ3VzdG9tQ29udGV4dCAmJiBjb250ZXh0LmphdmEpID8gJ0phdmFQYWNrYWdlJyA6IGdldENsYXNzT2YoY29udGV4dC5qYXZhKSxcbiAgICAgICAgcGhhbnRvbUNsYXNzID0gaXNDdXN0b21Db250ZXh0ID8gb2JqZWN0Q2xhc3MgOiAnUnVudGltZU9iamVjdCc7XG5cbiAgICAvKiogRGV0ZWN0IEphdmEgZW52aXJvbm1lbnQgKi9cbiAgICB2YXIgamF2YSA9IC9cXGJKYXZhLy50ZXN0KGphdmFDbGFzcykgJiYgY29udGV4dC5qYXZhO1xuXG4gICAgLyoqIERldGVjdCBSaGlubyAqL1xuICAgIHZhciByaGlubyA9IGphdmEgJiYgZ2V0Q2xhc3NPZihjb250ZXh0LmVudmlyb25tZW50KSA9PSBlbnZpcm9DbGFzcztcblxuICAgIC8qKiBBIGNoYXJhY3RlciB0byByZXByZXNlbnQgYWxwaGEgKi9cbiAgICB2YXIgYWxwaGEgPSBqYXZhID8gJ2EnIDogJ1xcdTAzYjEnO1xuXG4gICAgLyoqIEEgY2hhcmFjdGVyIHRvIHJlcHJlc2VudCBiZXRhICovXG4gICAgdmFyIGJldGEgPSBqYXZhID8gJ2InIDogJ1xcdTAzYjInO1xuXG4gICAgLyoqIEJyb3dzZXIgZG9jdW1lbnQgb2JqZWN0ICovXG4gICAgdmFyIGRvYyA9IGNvbnRleHQuZG9jdW1lbnQgfHwge307XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgT3BlcmEgYnJvd3NlciAoUHJlc3RvLWJhc2VkKVxuICAgICAqIGh0dHA6Ly93d3cuaG93dG9jcmVhdGUuY28udWsvb3BlcmFTdHVmZi9vcGVyYU9iamVjdC5odG1sXG4gICAgICogaHR0cDovL2Rldi5vcGVyYS5jb20vYXJ0aWNsZXMvdmlldy9vcGVyYS1taW5pLXdlYi1jb250ZW50LWF1dGhvcmluZy1ndWlkZWxpbmVzLyNvcGVyYW1pbmlcbiAgICAgKi9cbiAgICB2YXIgb3BlcmEgPSBjb250ZXh0Lm9wZXJhbWluaSB8fCBjb250ZXh0Lm9wZXJhO1xuXG4gICAgLyoqIE9wZXJhIGBbW0NsYXNzXV1gICovXG4gICAgdmFyIG9wZXJhQ2xhc3MgPSByZU9wZXJhLnRlc3Qob3BlcmFDbGFzcyA9IChpc0N1c3RvbUNvbnRleHQgJiYgb3BlcmEpID8gb3BlcmFbJ1tbQ2xhc3NdXSddIDogZ2V0Q2xhc3NPZihvcGVyYSkpXG4gICAgICA/IG9wZXJhQ2xhc3NcbiAgICAgIDogKG9wZXJhID0gbnVsbCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKiogVGVtcG9yYXJ5IHZhcmlhYmxlIHVzZWQgb3ZlciB0aGUgc2NyaXB0J3MgbGlmZXRpbWUgKi9cbiAgICB2YXIgZGF0YTtcblxuICAgIC8qKiBUaGUgQ1BVIGFyY2hpdGVjdHVyZSAqL1xuICAgIHZhciBhcmNoID0gdWE7XG5cbiAgICAvKiogUGxhdGZvcm0gZGVzY3JpcHRpb24gYXJyYXkgKi9cbiAgICB2YXIgZGVzY3JpcHRpb24gPSBbXTtcblxuICAgIC8qKiBQbGF0Zm9ybSBhbHBoYS9iZXRhIGluZGljYXRvciAqL1xuICAgIHZhciBwcmVyZWxlYXNlID0gbnVsbDtcblxuICAgIC8qKiBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBlbnZpcm9ubWVudCBmZWF0dXJlcyBzaG91bGQgYmUgdXNlZCB0byByZXNvbHZlIHRoZSBwbGF0Zm9ybSAqL1xuICAgIHZhciB1c2VGZWF0dXJlcyA9IHVhID09IHVzZXJBZ2VudDtcblxuICAgIC8qKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uICovXG4gICAgdmFyIHZlcnNpb24gPSB1c2VGZWF0dXJlcyAmJiBvcGVyYSAmJiB0eXBlb2Ygb3BlcmEudmVyc2lvbiA9PSAnZnVuY3Rpb24nICYmIG9wZXJhLnZlcnNpb24oKTtcblxuICAgIC8qKiBBIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIE9TIGVuZHMgd2l0aCBcIi8gVmVyc2lvblwiICovXG4gICAgdmFyIGlzU3BlY2lhbENhc2VkT1M7XG5cbiAgICAvKiBEZXRlY3RhYmxlIGxheW91dCBlbmdpbmVzIChvcmRlciBpcyBpbXBvcnRhbnQpICovXG4gICAgdmFyIGxheW91dCA9IGdldExheW91dChbXG4gICAgICAnVHJpZGVudCcsXG4gICAgICB7ICdsYWJlbCc6ICdXZWJLaXQnLCAncGF0dGVybic6ICdBcHBsZVdlYktpdCcgfSxcbiAgICAgICdpQ2FiJyxcbiAgICAgICdQcmVzdG8nLFxuICAgICAgJ05ldEZyb250JyxcbiAgICAgICdUYXNtYW4nLFxuICAgICAgJ0tIVE1MJyxcbiAgICAgICdHZWNrbydcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgYnJvd3NlciBuYW1lcyAob3JkZXIgaXMgaW1wb3J0YW50KSAqL1xuICAgIHZhciBuYW1lID0gZ2V0TmFtZShbXG4gICAgICAnQWRvYmUgQUlSJyxcbiAgICAgICdBcm9yYScsXG4gICAgICAnQXZhbnQgQnJvd3NlcicsXG4gICAgICAnQnJlYWNoJyxcbiAgICAgICdDYW1pbm8nLFxuICAgICAgJ0VwaXBoYW55JyxcbiAgICAgICdGZW5uZWMnLFxuICAgICAgJ0Zsb2NrJyxcbiAgICAgICdHYWxlb24nLFxuICAgICAgJ0dyZWVuQnJvd3NlcicsXG4gICAgICAnaUNhYicsXG4gICAgICAnSWNld2Vhc2VsJyxcbiAgICAgIHsgJ2xhYmVsJzogJ1NSV2FyZSBJcm9uJywgJ3BhdHRlcm4nOiAnSXJvbicgfSxcbiAgICAgICdLLU1lbGVvbicsXG4gICAgICAnS29ucXVlcm9yJyxcbiAgICAgICdMdW5hc2NhcGUnLFxuICAgICAgJ01heHRob24nLFxuICAgICAgJ01pZG9yaScsXG4gICAgICAnTm9vayBCcm93c2VyJyxcbiAgICAgICdQaGFudG9tSlMnLFxuICAgICAgJ1JhdmVuJyxcbiAgICAgICdSZWtvbnEnLFxuICAgICAgJ1JvY2tNZWx0JyxcbiAgICAgICdTZWFNb25rZXknLFxuICAgICAgeyAnbGFiZWwnOiAnU2lsaycsICdwYXR0ZXJuJzogJyg/OkNsb3VkOXxTaWxrLUFjY2VsZXJhdGVkKScgfSxcbiAgICAgICdTbGVpcG5pcicsXG4gICAgICAnU2xpbUJyb3dzZXInLFxuICAgICAgJ1N1bnJpc2UnLFxuICAgICAgJ1N3aWZ0Zm94JyxcbiAgICAgICdXZWJQb3NpdGl2ZScsXG4gICAgICAnT3BlcmEgTWluaScsXG4gICAgICB7ICdsYWJlbCc6ICdPcGVyYSBNaW5pJywgJ3BhdHRlcm4nOiAnT1BpT1MnIH0sXG4gICAgICAnT3BlcmEnLFxuICAgICAgeyAnbGFiZWwnOiAnT3BlcmEnLCAncGF0dGVybic6ICdPUFInIH0sXG4gICAgICAnQ2hyb21lJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0Nocm9tZSBNb2JpbGUnLCAncGF0dGVybic6ICcoPzpDcmlPU3xDck1vKScgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0ZpcmVmb3gnLCAncGF0dGVybic6ICcoPzpGaXJlZm94fE1pbmVmaWVsZCknIH0sXG4gICAgICB7ICdsYWJlbCc6ICdJRScsICdwYXR0ZXJuJzogJ0lFTW9iaWxlJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnSUUnLCAncGF0dGVybic6ICdNU0lFJyB9LFxuICAgICAgJ1NhZmFyaSdcbiAgICBdKTtcblxuICAgIC8qIERldGVjdGFibGUgcHJvZHVjdHMgKG9yZGVyIGlzIGltcG9ydGFudCkgKi9cbiAgICB2YXIgcHJvZHVjdCA9IGdldFByb2R1Y3QoW1xuICAgICAgeyAnbGFiZWwnOiAnQmxhY2tCZXJyeScsICdwYXR0ZXJuJzogJ0JCMTAnIH0sXG4gICAgICAnQmxhY2tCZXJyeScsXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUycsICdwYXR0ZXJuJzogJ0dULUk5MDAwJyB9LFxuICAgICAgeyAnbGFiZWwnOiAnR2FsYXh5IFMyJywgJ3BhdHRlcm4nOiAnR1QtSTkxMDAnIH0sXG4gICAgICB7ICdsYWJlbCc6ICdHYWxheHkgUzMnLCAncGF0dGVybic6ICdHVC1JOTMwMCcgfSxcbiAgICAgIHsgJ2xhYmVsJzogJ0dhbGF4eSBTNCcsICdwYXR0ZXJuJzogJ0dULUk5NTAwJyB9LFxuICAgICAgJ0dvb2dsZSBUVicsXG4gICAgICAnTHVtaWEnLFxuICAgICAgJ2lQYWQnLFxuICAgICAgJ2lQb2QnLFxuICAgICAgJ2lQaG9uZScsXG4gICAgICAnS2luZGxlJyxcbiAgICAgIHsgJ2xhYmVsJzogJ0tpbmRsZSBGaXJlJywgJ3BhdHRlcm4nOiAnKD86Q2xvdWQ5fFNpbGstQWNjZWxlcmF0ZWQpJyB9LFxuICAgICAgJ05vb2snLFxuICAgICAgJ1BsYXlCb29rJyxcbiAgICAgICdQbGF5U3RhdGlvbiA0JyxcbiAgICAgICdQbGF5U3RhdGlvbiAzJyxcbiAgICAgICdQbGF5U3RhdGlvbiBWaXRhJyxcbiAgICAgICdUb3VjaFBhZCcsXG4gICAgICAnVHJhbnNmb3JtZXInLFxuICAgICAgeyAnbGFiZWwnOiAnV2lpIFUnLCAncGF0dGVybic6ICdXaWlVJyB9LFxuICAgICAgJ1dpaScsXG4gICAgICAnWGJveCBPbmUnLFxuICAgICAgeyAnbGFiZWwnOiAnWGJveCAzNjAnLCAncGF0dGVybic6ICdYYm94JyB9LFxuICAgICAgJ1hvb20nXG4gICAgXSk7XG5cbiAgICAvKiBEZXRlY3RhYmxlIG1hbnVmYWN0dXJlcnMgKi9cbiAgICB2YXIgbWFudWZhY3R1cmVyID0gZ2V0TWFudWZhY3R1cmVyKHtcbiAgICAgICdBcHBsZSc6IHsgJ2lQYWQnOiAxLCAnaVBob25lJzogMSwgJ2lQb2QnOiAxIH0sXG4gICAgICAnQW1hem9uJzogeyAnS2luZGxlJzogMSwgJ0tpbmRsZSBGaXJlJzogMSB9LFxuICAgICAgJ0FzdXMnOiB7ICdUcmFuc2Zvcm1lcic6IDEgfSxcbiAgICAgICdCYXJuZXMgJiBOb2JsZSc6IHsgJ05vb2snOiAxIH0sXG4gICAgICAnQmxhY2tCZXJyeSc6IHsgJ1BsYXlCb29rJzogMSB9LFxuICAgICAgJ0dvb2dsZSc6IHsgJ0dvb2dsZSBUVic6IDEgfSxcbiAgICAgICdIUCc6IHsgJ1RvdWNoUGFkJzogMSB9LFxuICAgICAgJ0hUQyc6IHt9LFxuICAgICAgJ0xHJzoge30sXG4gICAgICAnTWljcm9zb2Z0JzogeyAnWGJveCc6IDEsICdYYm94IE9uZSc6IDEgfSxcbiAgICAgICdNb3Rvcm9sYSc6IHsgJ1hvb20nOiAxIH0sXG4gICAgICAnTmludGVuZG8nOiB7ICdXaWkgVSc6IDEsICAnV2lpJzogMSB9LFxuICAgICAgJ05va2lhJzogeyAnTHVtaWEnOiAxIH0sXG4gICAgICAnU2Ftc3VuZyc6IHsgJ0dhbGF4eSBTJzogMSwgJ0dhbGF4eSBTMic6IDEsICdHYWxheHkgUzMnOiAxLCAnR2FsYXh5IFM0JzogMSB9LFxuICAgICAgJ1NvbnknOiB7ICdQbGF5U3RhdGlvbiA0JzogMSwgJ1BsYXlTdGF0aW9uIDMnOiAxLCAnUGxheVN0YXRpb24gVml0YSc6IDEgfVxuICAgIH0pO1xuXG4gICAgLyogRGV0ZWN0YWJsZSBPU2VzIChvcmRlciBpcyBpbXBvcnRhbnQpICovXG4gICAgdmFyIG9zID0gZ2V0T1MoW1xuICAgICAgJ1dpbmRvd3MgUGhvbmUgJyxcbiAgICAgICdBbmRyb2lkJyxcbiAgICAgICdDZW50T1MnLFxuICAgICAgJ0RlYmlhbicsXG4gICAgICAnRmVkb3JhJyxcbiAgICAgICdGcmVlQlNEJyxcbiAgICAgICdHZW50b28nLFxuICAgICAgJ0hhaWt1JyxcbiAgICAgICdLdWJ1bnR1JyxcbiAgICAgICdMaW51eCBNaW50JyxcbiAgICAgICdSZWQgSGF0JyxcbiAgICAgICdTdVNFJyxcbiAgICAgICdVYnVudHUnLFxuICAgICAgJ1h1YnVudHUnLFxuICAgICAgJ0N5Z3dpbicsXG4gICAgICAnU3ltYmlhbiBPUycsXG4gICAgICAnaHB3T1MnLFxuICAgICAgJ3dlYk9TICcsXG4gICAgICAnd2ViT1MnLFxuICAgICAgJ1RhYmxldCBPUycsXG4gICAgICAnTGludXgnLFxuICAgICAgJ01hYyBPUyBYJyxcbiAgICAgICdNYWNpbnRvc2gnLFxuICAgICAgJ01hYycsXG4gICAgICAnV2luZG93cyA5ODsnLFxuICAgICAgJ1dpbmRvd3MgJ1xuICAgIF0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGxheW91dCBlbmdpbmUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbGF5b3V0IGVuZ2luZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRMYXlvdXQoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgUmVnRXhwKCdcXFxcYicgKyAoXG4gICAgICAgICAgZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKVxuICAgICAgICApICsgJ1xcXFxiJywgJ2knKS5leGVjKHVhKSAmJiAoZ3Vlc3MubGFiZWwgfHwgZ3Vlc3MpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIG1hbnVmYWN0dXJlciBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gb2JqZWN0IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgbWFudWZhY3R1cmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE1hbnVmYWN0dXJlcihndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgICAgICAvLyBsb29rdXAgdGhlIG1hbnVmYWN0dXJlciBieSBwcm9kdWN0IG9yIHNjYW4gdGhlIFVBIGZvciB0aGUgbWFudWZhY3R1cmVyXG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgKFxuICAgICAgICAgIHZhbHVlW3Byb2R1Y3RdIHx8XG4gICAgICAgICAgdmFsdWVbMC8qT3BlcmEgOS4yNSBmaXgqLywgL15bYS16XSsoPzogK1thLXpdK1xcYikqL2kuZXhlYyhwcm9kdWN0KV0gfHxcbiAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHF1YWxpZnkoa2V5KSArICcoPzpcXFxcYnxcXFxcdypcXFxcZCknLCAnaScpLmV4ZWModWEpXG4gICAgICAgICkgJiYga2V5O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdGhlIGJyb3dzZXIgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBicm93c2VyIG5hbWUuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0TmFtZShndWVzc2VzKSB7XG4gICAgICByZXR1cm4gcmVkdWNlKGd1ZXNzZXMsIGZ1bmN0aW9uKHJlc3VsdCwgZ3Vlc3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCB8fCBSZWdFeHAoJ1xcXFxiJyArIChcbiAgICAgICAgICBndWVzcy5wYXR0ZXJuIHx8IHF1YWxpZnkoZ3Vlc3MpXG4gICAgICAgICkgKyAnXFxcXGInLCAnaScpLmV4ZWModWEpICYmIChndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQaWNrcyB0aGUgT1MgbmFtZSBmcm9tIGFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGd1ZXNzZXMgQW4gYXJyYXkgb2YgZ3Vlc3Nlcy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCBPUyBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldE9TKGd1ZXNzZXMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UoZ3Vlc3NlcywgZnVuY3Rpb24ocmVzdWx0LCBndWVzcykge1xuICAgICAgICB2YXIgcGF0dGVybiA9IGd1ZXNzLnBhdHRlcm4gfHwgcXVhbGlmeShndWVzcyk7XG4gICAgICAgIGlmICghcmVzdWx0ICYmIChyZXN1bHQgPVxuICAgICAgICAgICAgICBSZWdFeHAoJ1xcXFxiJyArIHBhdHRlcm4gKyAnKD86L1tcXFxcZC5dK3xbIFxcXFx3Ll0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICByZXN1bHQgPSBjbGVhbnVwT1MocmVzdWx0LCBwYXR0ZXJuLCBndWVzcy5sYWJlbCB8fCBndWVzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBpY2tzIHRoZSBwcm9kdWN0IG5hbWUgZnJvbSBhbiBhcnJheSBvZiBndWVzc2VzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBndWVzc2VzIEFuIGFycmF5IG9mIGd1ZXNzZXMuXG4gICAgICogQHJldHVybnMge251bGx8c3RyaW5nfSBUaGUgZGV0ZWN0ZWQgcHJvZHVjdCBuYW1lLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFByb2R1Y3QoZ3Vlc3Nlcykge1xuICAgICAgcmV0dXJuIHJlZHVjZShndWVzc2VzLCBmdW5jdGlvbihyZXN1bHQsIGd1ZXNzKSB7XG4gICAgICAgIHZhciBwYXR0ZXJuID0gZ3Vlc3MucGF0dGVybiB8fCBxdWFsaWZ5KGd1ZXNzKTtcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgKHJlc3VsdCA9XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcgKlxcXFxkK1suXFxcXHdfXSonLCAnaScpLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAgIFJlZ0V4cCgnXFxcXGInICsgcGF0dGVybiArICcoPzo7ICooPzpbYS16XStbXy1dKT9bYS16XStcXFxcZCt8W14gKCk7LV0qKScsICdpJykuZXhlYyh1YSlcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAvLyBzcGxpdCBieSBmb3J3YXJkIHNsYXNoIGFuZCBhcHBlbmQgcHJvZHVjdCB2ZXJzaW9uIGlmIG5lZWRlZFxuICAgICAgICAgIGlmICgocmVzdWx0ID0gU3RyaW5nKChndWVzcy5sYWJlbCAmJiAhUmVnRXhwKHBhdHRlcm4sICdpJykudGVzdChndWVzcy5sYWJlbCkpID8gZ3Vlc3MubGFiZWwgOiByZXN1bHQpLnNwbGl0KCcvJykpWzFdICYmICEvW1xcZC5dKy8udGVzdChyZXN1bHRbMF0pKSB7XG4gICAgICAgICAgICByZXN1bHRbMF0gKz0gJyAnICsgcmVzdWx0WzFdO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBjb3JyZWN0IGNoYXJhY3RlciBjYXNlIGFuZCBjbGVhbnVwXG4gICAgICAgICAgZ3Vlc3MgPSBndWVzcy5sYWJlbCB8fCBndWVzcztcbiAgICAgICAgICByZXN1bHQgPSBmb3JtYXQocmVzdWx0WzBdXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAocGF0dGVybiwgJ2knKSwgZ3Vlc3MpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJzsgKig/OicgKyBndWVzcyArICdbXy1dKT8nLCAnaScpLCAnICcpXG4gICAgICAgICAgICAucmVwbGFjZShSZWdFeHAoJygnICsgZ3Vlc3MgKyAnKVstXy5dPyhcXFxcdyknLCAnaScpLCAnJDEgJDInKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIHRoZSB2ZXJzaW9uIHVzaW5nIGFuIGFycmF5IG9mIFVBIHBhdHRlcm5zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYXR0ZXJucyBBbiBhcnJheSBvZiBVQSBwYXR0ZXJucy5cbiAgICAgKiBAcmV0dXJucyB7bnVsbHxzdHJpbmd9IFRoZSBkZXRlY3RlZCB2ZXJzaW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFZlcnNpb24ocGF0dGVybnMpIHtcbiAgICAgIHJldHVybiByZWR1Y2UocGF0dGVybnMsIGZ1bmN0aW9uKHJlc3VsdCwgcGF0dGVybikge1xuICAgICAgICByZXR1cm4gcmVzdWx0IHx8IChSZWdFeHAocGF0dGVybiArXG4gICAgICAgICAgJyg/Oi1bXFxcXGQuXSsvfCg/OiBmb3IgW1xcXFx3LV0rKT9bIC8tXSkoW1xcXFxkLl0rW14gKCk7L18tXSopJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fCBudWxsO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgcGxhdGZvcm0uZGVzY3JpcHRpb25gIHdoZW4gdGhlIHBsYXRmb3JtIG9iamVjdCBpcyBjb2VyY2VkIHRvIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQG5hbWUgdG9TdHJpbmdcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIGBwbGF0Zm9ybS5kZXNjcmlwdGlvbmAgaWYgYXZhaWxhYmxlLCBlbHNlIGFuIGVtcHR5IHN0cmluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b1N0cmluZ1BsYXRmb3JtKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLy8gY29udmVydCBsYXlvdXQgdG8gYW4gYXJyYXkgc28gd2UgY2FuIGFkZCBleHRyYSBkZXRhaWxzXG4gICAgbGF5b3V0ICYmIChsYXlvdXQgPSBbbGF5b3V0XSk7XG5cbiAgICAvLyBkZXRlY3QgcHJvZHVjdCBuYW1lcyB0aGF0IGNvbnRhaW4gdGhlaXIgbWFudWZhY3R1cmVyJ3MgbmFtZVxuICAgIGlmIChtYW51ZmFjdHVyZXIgJiYgIXByb2R1Y3QpIHtcbiAgICAgIHByb2R1Y3QgPSBnZXRQcm9kdWN0KFttYW51ZmFjdHVyZXJdKTtcbiAgICB9XG4gICAgLy8gY2xlYW4gdXAgR29vZ2xlIFRWXG4gICAgaWYgKChkYXRhID0gL1xcYkdvb2dsZSBUVlxcYi8uZXhlYyhwcm9kdWN0KSkpIHtcbiAgICAgIHByb2R1Y3QgPSBkYXRhWzBdO1xuICAgIH1cbiAgICAvLyBkZXRlY3Qgc2ltdWxhdG9yc1xuICAgIGlmICgvXFxiU2ltdWxhdG9yXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgIHByb2R1Y3QgPSAocHJvZHVjdCA/IHByb2R1Y3QgKyAnICcgOiAnJykgKyAnU2ltdWxhdG9yJztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IE9wZXJhIE1pbmkgOCsgcnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZSBvbiBpT1NcbiAgICBpZiAobmFtZSA9PSAnT3BlcmEgTWluaScgJiYgL1xcYk9QaU9TXFxiLy50ZXN0KHVhKSkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgncnVubmluZyBpbiBUdXJiby9VbmNvbXByZXNzZWQgbW9kZScpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgaU9TXG4gICAgaWYgKC9eaVAvLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIG5hbWUgfHwgKG5hbWUgPSAnU2FmYXJpJyk7XG4gICAgICBvcyA9ICdpT1MnICsgKChkYXRhID0gLyBPUyAoW1xcZF9dKykvaS5leGVjKHVhKSlcbiAgICAgICAgPyAnICcgKyBkYXRhWzFdLnJlcGxhY2UoL18vZywgJy4nKVxuICAgICAgICA6ICcnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IEt1YnVudHVcbiAgICBlbHNlIGlmIChuYW1lID09ICdLb25xdWVyb3InICYmICEvYnVudHUvaS50ZXN0KG9zKSkge1xuICAgICAgb3MgPSAnS3VidW50dSc7XG4gICAgfVxuICAgIC8vIGRldGVjdCBBbmRyb2lkIGJyb3dzZXJzXG4gICAgZWxzZSBpZiAobWFudWZhY3R1cmVyICYmIG1hbnVmYWN0dXJlciAhPSAnR29vZ2xlJyAmJlxuICAgICAgICAoKC9DaHJvbWUvLnRlc3QobmFtZSkgJiYgIS9cXGJNb2JpbGUgU2FmYXJpXFxiL2kudGVzdCh1YSkpIHx8IC9cXGJWaXRhXFxiLy50ZXN0KHByb2R1Y3QpKSkge1xuICAgICAgbmFtZSA9ICdBbmRyb2lkIEJyb3dzZXInO1xuICAgICAgb3MgPSAvXFxiQW5kcm9pZFxcYi8udGVzdChvcykgPyBvcyA6ICdBbmRyb2lkJztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IGZhbHNlIHBvc2l0aXZlcyBmb3IgRmlyZWZveC9TYWZhcmlcbiAgICBlbHNlIGlmICghbmFtZSB8fCAoZGF0YSA9ICEvXFxiTWluZWZpZWxkXFxifFxcKEFuZHJvaWQ7L2kudGVzdCh1YSkgJiYgL1xcYig/OkZpcmVmb3h8U2FmYXJpKVxcYi8uZXhlYyhuYW1lKSkpIHtcbiAgICAgIC8vIGVzY2FwZSB0aGUgYC9gIGZvciBGaXJlZm94IDFcbiAgICAgIGlmIChuYW1lICYmICFwcm9kdWN0ICYmIC9bXFwvLF18XlteKF0rP1xcKS8udGVzdCh1YS5zbGljZSh1YS5pbmRleE9mKGRhdGEgKyAnLycpICsgOCkpKSB7XG4gICAgICAgIC8vIGNsZWFyIG5hbWUgb2YgZmFsc2UgcG9zaXRpdmVzXG4gICAgICAgIG5hbWUgPSBudWxsO1xuICAgICAgfVxuICAgICAgLy8gcmVhc3NpZ24gYSBnZW5lcmljIG5hbWVcbiAgICAgIGlmICgoZGF0YSA9IHByb2R1Y3QgfHwgbWFudWZhY3R1cmVyIHx8IG9zKSAmJlxuICAgICAgICAgIChwcm9kdWN0IHx8IG1hbnVmYWN0dXJlciB8fCAvXFxiKD86QW5kcm9pZHxTeW1iaWFuIE9TfFRhYmxldCBPU3x3ZWJPUylcXGIvLnRlc3Qob3MpKSkge1xuICAgICAgICBuYW1lID0gL1thLXpdKyg/OiBIYXQpPy9pLmV4ZWMoL1xcYkFuZHJvaWRcXGIvLnRlc3Qob3MpID8gb3MgOiBkYXRhKSArICcgQnJvd3Nlcic7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBGaXJlZm94IE9TXG4gICAgaWYgKChkYXRhID0gL1xcKChNb2JpbGV8VGFibGV0KS4qP0ZpcmVmb3hcXGIvaS5leGVjKHVhKSkgJiYgZGF0YVsxXSkge1xuICAgICAgb3MgPSAnRmlyZWZveCBPUyc7XG4gICAgICBpZiAoIXByb2R1Y3QpIHtcbiAgICAgICAgcHJvZHVjdCA9IGRhdGFbMV07XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBub24tT3BlcmEgdmVyc2lvbnMgKG9yZGVyIGlzIGltcG9ydGFudClcbiAgICBpZiAoIXZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSBnZXRWZXJzaW9uKFtcbiAgICAgICAgJyg/OkNsb3VkOXxDcmlPU3xDck1vfElFTW9iaWxlfElyb258T3BlcmEgP01pbml8T1BpT1N8T1BSfFJhdmVufFNpbGsoPyEvW1xcXFxkLl0rJCkpJyxcbiAgICAgICAgJ1ZlcnNpb24nLFxuICAgICAgICBxdWFsaWZ5KG5hbWUpLFxuICAgICAgICAnKD86RmlyZWZveHxNaW5lZmllbGR8TmV0RnJvbnQpJ1xuICAgICAgXSk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBzdHViYm9ybiBsYXlvdXQgZW5naW5lc1xuICAgIGlmIChsYXlvdXQgPT0gJ2lDYWInICYmIHBhcnNlRmxvYXQodmVyc2lvbikgPiAzKSB7XG4gICAgICBsYXlvdXQgPSBbJ1dlYktpdCddO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGxheW91dCAhPSAnVHJpZGVudCcgJiZcbiAgICAgICAgKGRhdGEgPVxuICAgICAgICAgIC9cXGJPcGVyYVxcYi8udGVzdChuYW1lKSAmJiAoL1xcYk9QUlxcYi8udGVzdCh1YSkgPyAnQmxpbmsnIDogJ1ByZXN0bycpIHx8XG4gICAgICAgICAgL1xcYig/Ok1pZG9yaXxOb29rfFNhZmFyaSlcXGIvaS50ZXN0KHVhKSAmJiAnV2ViS2l0JyB8fFxuICAgICAgICAgICFsYXlvdXQgJiYgL1xcYk1TSUVcXGIvaS50ZXN0KHVhKSAmJiAob3MgPT0gJ01hYyBPUycgPyAnVGFzbWFuJyA6ICdUcmlkZW50JylcbiAgICAgICAgKVxuICAgICkge1xuICAgICAgbGF5b3V0ID0gW2RhdGFdO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgTmV0RnJvbnQgb24gUGxheVN0YXRpb25cbiAgICBlbHNlIGlmICgvXFxiUGxheVN0YXRpb25cXGIoPyEgVml0YVxcYikvaS50ZXN0KG5hbWUpICYmIGxheW91dCA9PSAnV2ViS2l0Jykge1xuICAgICAgbGF5b3V0ID0gWydOZXRGcm9udCddO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgV2luZG93cyBQaG9uZSA3IGRlc2t0b3AgbW9kZVxuICAgIGlmIChuYW1lID09ICdJRScgJiYgKGRhdGEgPSAoLzsgKig/OlhCTFdQfFp1bmVXUCkoXFxkKykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIG5hbWUgKz0gJyBNb2JpbGUnO1xuICAgICAgb3MgPSAnV2luZG93cyBQaG9uZSAnICsgKC9cXCskLy50ZXN0KGRhdGEpID8gZGF0YSA6IGRhdGEgKyAnLngnKTtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgV2luZG93cyBQaG9uZSA4KyBkZXNrdG9wIG1vZGVcbiAgICBlbHNlIGlmICgvXFxiV1BEZXNrdG9wXFxiL2kudGVzdCh1YSkpIHtcbiAgICAgIG5hbWUgPSAnSUUgTW9iaWxlJztcbiAgICAgIG9zID0gJ1dpbmRvd3MgUGhvbmUgOCsnO1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICB2ZXJzaW9uIHx8ICh2ZXJzaW9uID0gKC9cXGJydjooW1xcZC5dKykvLmV4ZWModWEpIHx8IDApWzFdKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IElFIDExIGFuZCBhYm92ZVxuICAgIGVsc2UgaWYgKG5hbWUgIT0gJ0lFJyAmJiBsYXlvdXQgPT0gJ1RyaWRlbnQnICYmIChkYXRhID0gL1xcYnJ2OihbXFxkLl0rKS8uZXhlYyh1YSkpKSB7XG4gICAgICBpZiAoIS9cXGJXUERlc2t0b3BcXGIvaS50ZXN0KHVhKSkge1xuICAgICAgICBpZiAobmFtZSkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uLnB1c2goJ2lkZW50aWZ5aW5nIGFzICcgKyBuYW1lICsgKHZlcnNpb24gPyAnICcgKyB2ZXJzaW9uIDogJycpKTtcbiAgICAgICAgfVxuICAgICAgICBuYW1lID0gJ0lFJztcbiAgICAgIH1cbiAgICAgIHZlcnNpb24gPSBkYXRhWzFdO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgTWljcm9zb2Z0IEVkZ2VcbiAgICBlbHNlIGlmICgobmFtZSA9PSAnQ2hyb21lJyB8fCBuYW1lICE9ICdJRScpICYmIChkYXRhID0gL1xcYkVkZ2VcXC8oW1xcZC5dKykvLmV4ZWModWEpKSkge1xuICAgICAgbmFtZSA9ICdNaWNyb3NvZnQgRWRnZSc7XG4gICAgICB2ZXJzaW9uID0gZGF0YVsxXTtcbiAgICAgIGxheW91dCA9IFsnVHJpZGVudCddO1xuICAgIH1cbiAgICAvLyBsZXZlcmFnZSBlbnZpcm9ubWVudCBmZWF0dXJlc1xuICAgIGlmICh1c2VGZWF0dXJlcykge1xuICAgICAgLy8gZGV0ZWN0IHNlcnZlci1zaWRlIGVudmlyb25tZW50c1xuICAgICAgLy8gUmhpbm8gaGFzIGEgZ2xvYmFsIGZ1bmN0aW9uIHdoaWxlIG90aGVycyBoYXZlIGEgZ2xvYmFsIG9iamVjdFxuICAgICAgaWYgKGlzSG9zdFR5cGUoY29udGV4dCwgJ2dsb2JhbCcpKSB7XG4gICAgICAgIGlmIChqYXZhKSB7XG4gICAgICAgICAgZGF0YSA9IGphdmEubGFuZy5TeXN0ZW07XG4gICAgICAgICAgYXJjaCA9IGRhdGEuZ2V0UHJvcGVydHkoJ29zLmFyY2gnKTtcbiAgICAgICAgICBvcyA9IG9zIHx8IGRhdGEuZ2V0UHJvcGVydHkoJ29zLm5hbWUnKSArICcgJyArIGRhdGEuZ2V0UHJvcGVydHkoJ29zLnZlcnNpb24nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNNb2R1bGVTY29wZSAmJiBpc0hvc3RUeXBlKGNvbnRleHQsICdzeXN0ZW0nKSAmJiAoZGF0YSA9IFtjb250ZXh0LnN5c3RlbV0pWzBdKSB7XG4gICAgICAgICAgb3MgfHwgKG9zID0gZGF0YVswXS5vcyB8fCBudWxsKTtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YVsxXSA9IGNvbnRleHQucmVxdWlyZSgncmluZ28vZW5naW5lJykudmVyc2lvbjtcbiAgICAgICAgICAgIHZlcnNpb24gPSBkYXRhWzFdLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIG5hbWUgPSAnUmluZ29KUyc7XG4gICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVswXS5nbG9iYWwuc3lzdGVtID09IGNvbnRleHQuc3lzdGVtKSB7XG4gICAgICAgICAgICAgIG5hbWUgPSAnTmFyd2hhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb250ZXh0LnByb2Nlc3MgPT0gJ29iamVjdCcgJiYgKGRhdGEgPSBjb250ZXh0LnByb2Nlc3MpKSB7XG4gICAgICAgICAgbmFtZSA9ICdOb2RlLmpzJztcbiAgICAgICAgICBhcmNoID0gZGF0YS5hcmNoO1xuICAgICAgICAgIG9zID0gZGF0YS5wbGF0Zm9ybTtcbiAgICAgICAgICB2ZXJzaW9uID0gL1tcXGQuXSsvLmV4ZWMoZGF0YS52ZXJzaW9uKVswXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyaGlubykge1xuICAgICAgICAgIG5hbWUgPSAnUmhpbm8nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBkZXRlY3QgQWRvYmUgQUlSXG4gICAgICBlbHNlIGlmIChnZXRDbGFzc09mKChkYXRhID0gY29udGV4dC5ydW50aW1lKSkgPT0gYWlyUnVudGltZUNsYXNzKSB7XG4gICAgICAgIG5hbWUgPSAnQWRvYmUgQUlSJztcbiAgICAgICAgb3MgPSBkYXRhLmZsYXNoLnN5c3RlbS5DYXBhYmlsaXRpZXMub3M7XG4gICAgICB9XG4gICAgICAvLyBkZXRlY3QgUGhhbnRvbUpTXG4gICAgICBlbHNlIGlmIChnZXRDbGFzc09mKChkYXRhID0gY29udGV4dC5waGFudG9tKSkgPT0gcGhhbnRvbUNsYXNzKSB7XG4gICAgICAgIG5hbWUgPSAnUGhhbnRvbUpTJztcbiAgICAgICAgdmVyc2lvbiA9IChkYXRhID0gZGF0YS52ZXJzaW9uIHx8IG51bGwpICYmIChkYXRhLm1ham9yICsgJy4nICsgZGF0YS5taW5vciArICcuJyArIGRhdGEucGF0Y2gpO1xuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IElFIGNvbXBhdGliaWxpdHkgbW9kZXNcbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkb2MuZG9jdW1lbnRNb2RlID09ICdudW1iZXInICYmIChkYXRhID0gL1xcYlRyaWRlbnRcXC8oXFxkKykvaS5leGVjKHVhKSkpIHtcbiAgICAgICAgLy8gd2UncmUgaW4gY29tcGF0aWJpbGl0eSBtb2RlIHdoZW4gdGhlIFRyaWRlbnQgdmVyc2lvbiArIDQgZG9lc24ndFxuICAgICAgICAvLyBlcXVhbCB0aGUgZG9jdW1lbnQgbW9kZVxuICAgICAgICB2ZXJzaW9uID0gW3ZlcnNpb24sIGRvYy5kb2N1bWVudE1vZGVdO1xuICAgICAgICBpZiAoKGRhdGEgPSArZGF0YVsxXSArIDQpICE9IHZlcnNpb25bMV0pIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbi5wdXNoKCdJRSAnICsgdmVyc2lvblsxXSArICcgbW9kZScpO1xuICAgICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJycpO1xuICAgICAgICAgIHZlcnNpb25bMV0gPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHZlcnNpb24gPSBuYW1lID09ICdJRScgPyBTdHJpbmcodmVyc2lvblsxXS50b0ZpeGVkKDEpKSA6IHZlcnNpb25bMF07XG4gICAgICB9XG4gICAgICBvcyA9IG9zICYmIGZvcm1hdChvcyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBwcmVyZWxlYXNlIHBoYXNlc1xuICAgIGlmICh2ZXJzaW9uICYmIChkYXRhID1cbiAgICAgICAgICAvKD86W2FiXXxkcHxwcmV8W2FiXVxcZCtwcmUpKD86XFxkK1xcKz8pPyQvaS5leGVjKHZlcnNpb24pIHx8XG4gICAgICAgICAgLyg/OmFscGhhfGJldGEpKD86ID9cXGQpPy9pLmV4ZWModWEgKyAnOycgKyAodXNlRmVhdHVyZXMgJiYgbmF2LmFwcE1pbm9yVmVyc2lvbikpIHx8XG4gICAgICAgICAgL1xcYk1pbmVmaWVsZFxcYi9pLnRlc3QodWEpICYmICdhJ1xuICAgICAgICApKSB7XG4gICAgICBwcmVyZWxlYXNlID0gL2IvaS50ZXN0KGRhdGEpID8gJ2JldGEnIDogJ2FscGhhJztcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoUmVnRXhwKGRhdGEgKyAnXFxcXCs/JCcpLCAnJykgK1xuICAgICAgICAocHJlcmVsZWFzZSA9PSAnYmV0YScgPyBiZXRhIDogYWxwaGEpICsgKC9cXGQrXFwrPy8uZXhlYyhkYXRhKSB8fCAnJyk7XG4gICAgfVxuICAgIC8vIGRldGVjdCBGaXJlZm94IE1vYmlsZVxuICAgIGlmIChuYW1lID09ICdGZW5uZWMnIHx8IG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGIoPzpBbmRyb2lkfEZpcmVmb3ggT1MpXFxiLy50ZXN0KG9zKSkge1xuICAgICAgbmFtZSA9ICdGaXJlZm94IE1vYmlsZSc7XG4gICAgfVxuICAgIC8vIG9ic2N1cmUgTWF4dGhvbidzIHVucmVsaWFibGUgdmVyc2lvblxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ01heHRob24nICYmIHZlcnNpb24pIHtcbiAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnJlcGxhY2UoL1xcLltcXGQuXSsvLCAnLngnKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IFNpbGsgZGVza3RvcC9hY2NlbGVyYXRlZCBtb2Rlc1xuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1NpbGsnKSB7XG4gICAgICBpZiAoIS9cXGJNb2JpL2kudGVzdCh1YSkpIHtcbiAgICAgICAgb3MgPSAnQW5kcm9pZCc7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgfVxuICAgICAgaWYgKC9BY2NlbGVyYXRlZCAqPSAqdHJ1ZS9pLnRlc3QodWEpKSB7XG4gICAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2FjY2VsZXJhdGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBYYm94IDM2MCBhbmQgWGJveCBPbmVcbiAgICBlbHNlIGlmICgvXFxiWGJveFxcYi9pLnRlc3QocHJvZHVjdCkpIHtcbiAgICAgIG9zID0gbnVsbDtcbiAgICAgIGlmIChwcm9kdWN0ID09ICdYYm94IDM2MCcgJiYgL1xcYklFTW9iaWxlXFxiLy50ZXN0KHVhKSkge1xuICAgICAgICBkZXNjcmlwdGlvbi51bnNoaWZ0KCdtb2JpbGUgbW9kZScpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBhZGQgbW9iaWxlIHBvc3RmaXhcbiAgICBlbHNlIGlmICgoL14oPzpDaHJvbWV8SUV8T3BlcmEpJC8udGVzdChuYW1lKSB8fCBuYW1lICYmICFwcm9kdWN0ICYmICEvQnJvd3NlcnxNb2JpLy50ZXN0KG5hbWUpKSAmJlxuICAgICAgICAob3MgPT0gJ1dpbmRvd3MgQ0UnIHx8IC9Nb2JpL2kudGVzdCh1YSkpKSB7XG4gICAgICBuYW1lICs9ICcgTW9iaWxlJztcbiAgICB9XG4gICAgLy8gZGV0ZWN0IElFIHBsYXRmb3JtIHByZXZpZXdcbiAgICBlbHNlIGlmIChuYW1lID09ICdJRScgJiYgdXNlRmVhdHVyZXMgJiYgY29udGV4dC5leHRlcm5hbCA9PT0gbnVsbCkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgncGxhdGZvcm0gcHJldmlldycpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgQmxhY2tCZXJyeSBPUyB2ZXJzaW9uXG4gICAgLy8gaHR0cDovL2RvY3MuYmxhY2tiZXJyeS5jb20vZW4vZGV2ZWxvcGVycy9kZWxpdmVyYWJsZXMvMTgxNjkvSFRUUF9oZWFkZXJzX3NlbnRfYnlfQkJfQnJvd3Nlcl8xMjM0OTExXzExLmpzcFxuICAgIGVsc2UgaWYgKCgvXFxiQmxhY2tCZXJyeVxcYi8udGVzdChwcm9kdWN0KSB8fCAvXFxiQkIxMFxcYi8udGVzdCh1YSkpICYmIChkYXRhID1cbiAgICAgICAgICAoUmVnRXhwKHByb2R1Y3QucmVwbGFjZSgvICsvZywgJyAqJykgKyAnLyhbLlxcXFxkXSspJywgJ2knKS5leGVjKHVhKSB8fCAwKVsxXSB8fFxuICAgICAgICAgIHZlcnNpb25cbiAgICAgICAgKSkge1xuICAgICAgZGF0YSA9IFtkYXRhLCAvQkIxMC8udGVzdCh1YSldO1xuICAgICAgb3MgPSAoZGF0YVsxXSA/IChwcm9kdWN0ID0gbnVsbCwgbWFudWZhY3R1cmVyID0gJ0JsYWNrQmVycnknKSA6ICdEZXZpY2UgU29mdHdhcmUnKSArICcgJyArIGRhdGFbMF07XG4gICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IE9wZXJhIGlkZW50aWZ5aW5nL21hc2tpbmcgaXRzZWxmIGFzIGFub3RoZXIgYnJvd3NlclxuICAgIC8vIGh0dHA6Ly93d3cub3BlcmEuY29tL3N1cHBvcnQva2Ivdmlldy84NDMvXG4gICAgZWxzZSBpZiAodGhpcyAhPSBmb3JPd24gJiYgKFxuICAgICAgICAgIHByb2R1Y3QgIT0gJ1dpaScgJiYgKFxuICAgICAgICAgICAgKHVzZUZlYXR1cmVzICYmIG9wZXJhKSB8fFxuICAgICAgICAgICAgKC9PcGVyYS8udGVzdChuYW1lKSAmJiAvXFxiKD86TVNJRXxGaXJlZm94KVxcYi9pLnRlc3QodWEpKSB8fFxuICAgICAgICAgICAgKG5hbWUgPT0gJ0ZpcmVmb3gnICYmIC9cXGJPUyBYICg/OlxcZCtcXC4pezIsfS8udGVzdChvcykpIHx8XG4gICAgICAgICAgICAobmFtZSA9PSAnSUUnICYmIChcbiAgICAgICAgICAgICAgKG9zICYmICEvXldpbi8udGVzdChvcykgJiYgdmVyc2lvbiA+IDUuNSkgfHxcbiAgICAgICAgICAgICAgL1xcYldpbmRvd3MgWFBcXGIvLnRlc3Qob3MpICYmIHZlcnNpb24gPiA4IHx8XG4gICAgICAgICAgICAgIHZlcnNpb24gPT0gOCAmJiAhL1xcYlRyaWRlbnRcXGIvLnRlc3QodWEpXG4gICAgICAgICAgICApKVxuICAgICAgICAgIClcbiAgICAgICAgKSAmJiAhcmVPcGVyYS50ZXN0KChkYXRhID0gcGFyc2UuY2FsbChmb3JPd24sIHVhLnJlcGxhY2UocmVPcGVyYSwgJycpICsgJzsnKSkpICYmIGRhdGEubmFtZSkge1xuXG4gICAgICAvLyB3aGVuIFwiaW5kZW50aWZ5aW5nXCIsIHRoZSBVQSBjb250YWlucyBib3RoIE9wZXJhIGFuZCB0aGUgb3RoZXIgYnJvd3NlcidzIG5hbWVcbiAgICAgIGRhdGEgPSAnaW5nIGFzICcgKyBkYXRhLm5hbWUgKyAoKGRhdGEgPSBkYXRhLnZlcnNpb24pID8gJyAnICsgZGF0YSA6ICcnKTtcbiAgICAgIGlmIChyZU9wZXJhLnRlc3QobmFtZSkpIHtcbiAgICAgICAgaWYgKC9cXGJJRVxcYi8udGVzdChkYXRhKSAmJiBvcyA9PSAnTWFjIE9TJykge1xuICAgICAgICAgIG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkYXRhID0gJ2lkZW50aWZ5JyArIGRhdGE7XG4gICAgICB9XG4gICAgICAvLyB3aGVuIFwibWFza2luZ1wiLCB0aGUgVUEgY29udGFpbnMgb25seSB0aGUgb3RoZXIgYnJvd3NlcidzIG5hbWVcbiAgICAgIGVsc2Uge1xuICAgICAgICBkYXRhID0gJ21hc2snICsgZGF0YTtcbiAgICAgICAgaWYgKG9wZXJhQ2xhc3MpIHtcbiAgICAgICAgICBuYW1lID0gZm9ybWF0KG9wZXJhQ2xhc3MucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSAnT3BlcmEnO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvXFxiSUVcXGIvLnRlc3QoZGF0YSkpIHtcbiAgICAgICAgICBvcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF1c2VGZWF0dXJlcykge1xuICAgICAgICAgIHZlcnNpb24gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsYXlvdXQgPSBbJ1ByZXN0byddO1xuICAgICAgZGVzY3JpcHRpb24ucHVzaChkYXRhKTtcbiAgICB9XG4gICAgLy8gZGV0ZWN0IFdlYktpdCBOaWdodGx5IGFuZCBhcHByb3hpbWF0ZSBDaHJvbWUvU2FmYXJpIHZlcnNpb25zXG4gICAgaWYgKChkYXRhID0gKC9cXGJBcHBsZVdlYktpdFxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgIC8vIGNvcnJlY3QgYnVpbGQgZm9yIG51bWVyaWMgY29tcGFyaXNvblxuICAgICAgLy8gKGUuZy4gXCI1MzIuNVwiIGJlY29tZXMgXCI1MzIuMDVcIilcbiAgICAgIGRhdGEgPSBbcGFyc2VGbG9hdChkYXRhLnJlcGxhY2UoL1xcLihcXGQpJC8sICcuMCQxJykpLCBkYXRhXTtcbiAgICAgIC8vIG5pZ2h0bHkgYnVpbGRzIGFyZSBwb3N0Zml4ZWQgd2l0aCBhIGArYFxuICAgICAgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgZGF0YVsxXS5zbGljZSgtMSkgPT0gJysnKSB7XG4gICAgICAgIG5hbWUgPSAnV2ViS2l0IE5pZ2h0bHknO1xuICAgICAgICBwcmVyZWxlYXNlID0gJ2FscGhhJztcbiAgICAgICAgdmVyc2lvbiA9IGRhdGFbMV0uc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgICAgLy8gY2xlYXIgaW5jb3JyZWN0IGJyb3dzZXIgdmVyc2lvbnNcbiAgICAgIGVsc2UgaWYgKHZlcnNpb24gPT0gZGF0YVsxXSB8fFxuICAgICAgICAgIHZlcnNpb24gPT0gKGRhdGFbMl0gPSAoL1xcYlNhZmFyaVxcLyhbXFxkLl0rXFwrPykvaS5leGVjKHVhKSB8fCAwKVsxXSkpIHtcbiAgICAgICAgdmVyc2lvbiA9IG51bGw7XG4gICAgICB9XG4gICAgICAvLyB1c2UgdGhlIGZ1bGwgQ2hyb21lIHZlcnNpb24gd2hlbiBhdmFpbGFibGVcbiAgICAgIGRhdGFbMV0gPSAoL1xcYkNocm9tZVxcLyhbXFxkLl0rKS9pLmV4ZWModWEpIHx8IDApWzFdO1xuICAgICAgLy8gZGV0ZWN0IEJsaW5rIGxheW91dCBlbmdpbmVcbiAgICAgIGlmIChkYXRhWzBdID09IDUzNy4zNiAmJiBkYXRhWzJdID09IDUzNy4zNiAmJiBwYXJzZUZsb2F0KGRhdGFbMV0pID49IDI4ICYmIG5hbWUgIT0gJ0lFJyAmJiBuYW1lICE9ICdNaWNyb3NvZnQgRWRnZScpIHtcbiAgICAgICAgbGF5b3V0ID0gWydCbGluayddO1xuICAgICAgfVxuICAgICAgLy8gZGV0ZWN0IEphdmFTY3JpcHRDb3JlXG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzY3Njg0NzQvaG93LWNhbi1pLWRldGVjdC13aGljaC1qYXZhc2NyaXB0LWVuZ2luZS12OC1vci1qc2MtaXMtdXNlZC1hdC1ydW50aW1lLWluLWFuZHJvaVxuICAgICAgaWYgKCF1c2VGZWF0dXJlcyB8fCAoIWxpa2VDaHJvbWUgJiYgIWRhdGFbMV0pKSB7XG4gICAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdID0gJ2xpa2UgU2FmYXJpJyk7XG4gICAgICAgIGRhdGEgPSAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA0MDAgPyAxIDogZGF0YSA8IDUwMCA/IDIgOiBkYXRhIDwgNTI2ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNCA/ICc0KycgOiBkYXRhIDwgNTM1ID8gNSA6IGRhdGEgPCA1MzcgPyA2IDogZGF0YSA8IDUzOCA/IDcgOiBkYXRhIDwgNjAxID8gOCA6ICc4Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsYXlvdXQgJiYgKGxheW91dFsxXSA9ICdsaWtlIENocm9tZScpO1xuICAgICAgICBkYXRhID0gZGF0YVsxXSB8fCAoZGF0YSA9IGRhdGFbMF0sIGRhdGEgPCA1MzAgPyAxIDogZGF0YSA8IDUzMiA/IDIgOiBkYXRhIDwgNTMyLjA1ID8gMyA6IGRhdGEgPCA1MzMgPyA0IDogZGF0YSA8IDUzNC4wMyA/IDUgOiBkYXRhIDwgNTM0LjA3ID8gNiA6IGRhdGEgPCA1MzQuMTAgPyA3IDogZGF0YSA8IDUzNC4xMyA/IDggOiBkYXRhIDwgNTM0LjE2ID8gOSA6IGRhdGEgPCA1MzQuMjQgPyAxMCA6IGRhdGEgPCA1MzQuMzAgPyAxMSA6IGRhdGEgPCA1MzUuMDEgPyAxMiA6IGRhdGEgPCA1MzUuMDIgPyAnMTMrJyA6IGRhdGEgPCA1MzUuMDcgPyAxNSA6IGRhdGEgPCA1MzUuMTEgPyAxNiA6IGRhdGEgPCA1MzUuMTkgPyAxNyA6IGRhdGEgPCA1MzYuMDUgPyAxOCA6IGRhdGEgPCA1MzYuMTAgPyAxOSA6IGRhdGEgPCA1MzcuMDEgPyAyMCA6IGRhdGEgPCA1MzcuMTEgPyAnMjErJyA6IGRhdGEgPCA1MzcuMTMgPyAyMyA6IGRhdGEgPCA1MzcuMTggPyAyNCA6IGRhdGEgPCA1MzcuMjQgPyAyNSA6IGRhdGEgPCA1MzcuMzYgPyAyNiA6IGxheW91dCAhPSAnQmxpbmsnID8gJzI3JyA6ICcyOCcpO1xuICAgICAgfVxuICAgICAgLy8gYWRkIHRoZSBwb3N0Zml4IG9mIFwiLnhcIiBvciBcIitcIiBmb3IgYXBwcm94aW1hdGUgdmVyc2lvbnNcbiAgICAgIGxheW91dCAmJiAobGF5b3V0WzFdICs9ICcgJyArIChkYXRhICs9IHR5cGVvZiBkYXRhID09ICdudW1iZXInID8gJy54JyA6IC9bLitdLy50ZXN0KGRhdGEpID8gJycgOiAnKycpKTtcbiAgICAgIC8vIG9ic2N1cmUgdmVyc2lvbiBmb3Igc29tZSBTYWZhcmkgMS0yIHJlbGVhc2VzXG4gICAgICBpZiAobmFtZSA9PSAnU2FmYXJpJyAmJiAoIXZlcnNpb24gfHwgcGFyc2VJbnQodmVyc2lvbikgPiA0NSkpIHtcbiAgICAgICAgdmVyc2lvbiA9IGRhdGE7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGRldGVjdCBPcGVyYSBkZXNrdG9wIG1vZGVzXG4gICAgaWYgKG5hbWUgPT0gJ09wZXJhJyAmJiAgKGRhdGEgPSAvXFxiemJvdnx6dmF2JC8uZXhlYyhvcykpKSB7XG4gICAgICBuYW1lICs9ICcgJztcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQoJ2Rlc2t0b3AgbW9kZScpO1xuICAgICAgaWYgKGRhdGEgPT0gJ3p2YXYnKSB7XG4gICAgICAgIG5hbWUgKz0gJ01pbmknO1xuICAgICAgICB2ZXJzaW9uID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5hbWUgKz0gJ01vYmlsZSc7XG4gICAgICB9XG4gICAgICBvcyA9IG9zLnJlcGxhY2UoUmVnRXhwKCcgKicgKyBkYXRhICsgJyQnKSwgJycpO1xuICAgIH1cbiAgICAvLyBkZXRlY3QgQ2hyb21lIGRlc2t0b3AgbW9kZVxuICAgIGVsc2UgaWYgKG5hbWUgPT0gJ1NhZmFyaScgJiYgL1xcYkNocm9tZVxcYi8uZXhlYyhsYXlvdXQgJiYgbGF5b3V0WzFdKSkge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnZGVza3RvcCBtb2RlJyk7XG4gICAgICBuYW1lID0gJ0Nocm9tZSBNb2JpbGUnO1xuICAgICAgdmVyc2lvbiA9IG51bGw7XG5cbiAgICAgIGlmICgvXFxiT1MgWFxcYi8udGVzdChvcykpIHtcbiAgICAgICAgbWFudWZhY3R1cmVyID0gJ0FwcGxlJztcbiAgICAgICAgb3MgPSAnaU9TIDQuMysnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBzdHJpcCBpbmNvcnJlY3QgT1MgdmVyc2lvbnNcbiAgICBpZiAodmVyc2lvbiAmJiB2ZXJzaW9uLmluZGV4T2YoKGRhdGEgPSAvW1xcZC5dKyQvLmV4ZWMob3MpKSkgPT0gMCAmJlxuICAgICAgICB1YS5pbmRleE9mKCcvJyArIGRhdGEgKyAnLScpID4gLTEpIHtcbiAgICAgIG9zID0gdHJpbShvcy5yZXBsYWNlKGRhdGEsICcnKSk7XG4gICAgfVxuICAgIC8vIGFkZCBsYXlvdXQgZW5naW5lXG4gICAgaWYgKGxheW91dCAmJiAhL1xcYig/OkF2YW50fE5vb2spXFxiLy50ZXN0KG5hbWUpICYmIChcbiAgICAgICAgL0Jyb3dzZXJ8THVuYXNjYXBlfE1heHRob24vLnRlc3QobmFtZSkgfHxcbiAgICAgICAgL14oPzpBZG9iZXxBcm9yYXxCcmVhY2h8TWlkb3JpfE9wZXJhfFBoYW50b218UmVrb25xfFJvY2t8U2xlaXBuaXJ8V2ViKS8udGVzdChuYW1lKSAmJiBsYXlvdXRbMV0pKSB7XG4gICAgICAvLyBkb24ndCBhZGQgbGF5b3V0IGRldGFpbHMgdG8gZGVzY3JpcHRpb24gaWYgdGhleSBhcmUgZmFsc2V5XG4gICAgICAoZGF0YSA9IGxheW91dFtsYXlvdXQubGVuZ3RoIC0gMV0pICYmIGRlc2NyaXB0aW9uLnB1c2goZGF0YSk7XG4gICAgfVxuICAgIC8vIGNvbWJpbmUgY29udGV4dHVhbCBpbmZvcm1hdGlvblxuICAgIGlmIChkZXNjcmlwdGlvbi5sZW5ndGgpIHtcbiAgICAgIGRlc2NyaXB0aW9uID0gWycoJyArIGRlc2NyaXB0aW9uLmpvaW4oJzsgJykgKyAnKSddO1xuICAgIH1cbiAgICAvLyBhcHBlbmQgbWFudWZhY3R1cmVyXG4gICAgaWYgKG1hbnVmYWN0dXJlciAmJiBwcm9kdWN0ICYmIHByb2R1Y3QuaW5kZXhPZihtYW51ZmFjdHVyZXIpIDwgMCkge1xuICAgICAgZGVzY3JpcHRpb24ucHVzaCgnb24gJyArIG1hbnVmYWN0dXJlcik7XG4gICAgfVxuICAgIC8vIGFwcGVuZCBwcm9kdWN0XG4gICAgaWYgKHByb2R1Y3QpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnB1c2goKC9eb24gLy50ZXN0KGRlc2NyaXB0aW9uW2Rlc2NyaXB0aW9uLmxlbmd0aCAtMV0pID8gJycgOiAnb24gJykgKyBwcm9kdWN0KTtcbiAgICB9XG4gICAgLy8gcGFyc2UgT1MgaW50byBhbiBvYmplY3RcbiAgICBpZiAob3MpIHtcbiAgICAgIGRhdGEgPSAvIChbXFxkLitdKykkLy5leGVjKG9zKTtcbiAgICAgIGlzU3BlY2lhbENhc2VkT1MgPSBkYXRhICYmIG9zLmNoYXJBdChvcy5sZW5ndGggLSBkYXRhWzBdLmxlbmd0aCAtIDEpID09ICcvJztcbiAgICAgIG9zID0ge1xuICAgICAgICAnYXJjaGl0ZWN0dXJlJzogMzIsXG4gICAgICAgICdmYW1pbHknOiAoZGF0YSAmJiAhaXNTcGVjaWFsQ2FzZWRPUykgPyBvcy5yZXBsYWNlKGRhdGFbMF0sICcnKSA6IG9zLFxuICAgICAgICAndmVyc2lvbic6IGRhdGEgPyBkYXRhWzFdIDogbnVsbCxcbiAgICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZlcnNpb24gPSB0aGlzLnZlcnNpb247XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZmFtaWx5ICsgKCh2ZXJzaW9uICYmICFpc1NwZWNpYWxDYXNlZE9TKSA/ICcgJyArIHZlcnNpb24gOiAnJykgKyAodGhpcy5hcmNoaXRlY3R1cmUgPT0gNjQgPyAnIDY0LWJpdCcgOiAnJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIC8vIGFkZCBicm93c2VyL09TIGFyY2hpdGVjdHVyZVxuICAgIGlmICgoZGF0YSA9IC9cXGIoPzpBTUR8SUF8V2lufFdPV3x4ODZffHgpNjRcXGIvaS5leGVjKGFyY2gpKSAmJiAhL1xcYmk2ODZcXGIvaS50ZXN0KGFyY2gpKSB7XG4gICAgICBpZiAob3MpIHtcbiAgICAgICAgb3MuYXJjaGl0ZWN0dXJlID0gNjQ7XG4gICAgICAgIG9zLmZhbWlseSA9IG9zLmZhbWlseS5yZXBsYWNlKFJlZ0V4cCgnIConICsgZGF0YSksICcnKTtcbiAgICAgIH1cbiAgICAgIGlmIChcbiAgICAgICAgICBuYW1lICYmICgvXFxiV09XNjRcXGIvaS50ZXN0KHVhKSB8fFxuICAgICAgICAgICh1c2VGZWF0dXJlcyAmJiAvXFx3KD86ODZ8MzIpJC8udGVzdChuYXYuY3B1Q2xhc3MgfHwgbmF2LnBsYXRmb3JtKSAmJiAhL1xcYldpbjY0OyB4NjRcXGIvaS50ZXN0KHVhKSkpXG4gICAgICApIHtcbiAgICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCgnMzItYml0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdWEgfHwgKHVhID0gbnVsbCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxhdGZvcm0gb2JqZWN0LlxuICAgICAqXG4gICAgICogQG5hbWUgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcGxhdGZvcm0gPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF0Zm9ybSBkZXNjcmlwdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0uZGVzY3JpcHRpb24gPSB1YTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBicm93c2VyJ3MgbGF5b3V0IGVuZ2luZS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubGF5b3V0ID0gbGF5b3V0ICYmIGxheW91dFswXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwcm9kdWN0J3MgbWFudWZhY3R1cmVyLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5tYW51ZmFjdHVyZXIgPSBtYW51ZmFjdHVyZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgYnJvd3Nlci9lbnZpcm9ubWVudC5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ubmFtZSA9IG5hbWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYWxwaGEvYmV0YSByZWxlYXNlIGluZGljYXRvci5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybVxuICAgICAqIEB0eXBlIHN0cmluZ3xudWxsXG4gICAgICovXG4gICAgcGxhdGZvcm0ucHJlcmVsZWFzZSA9IHByZXJlbGVhc2U7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvZHVjdCBob3N0aW5nIHRoZSBicm93c2VyLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5wcm9kdWN0ID0gcHJvZHVjdDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBicm93c2VyJ3MgdXNlciBhZ2VudCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAqL1xuICAgIHBsYXRmb3JtLnVhID0gdWE7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYnJvd3Nlci9lbnZpcm9ubWVudCB2ZXJzaW9uLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIHBsYXRmb3JtXG4gICAgICogQHR5cGUgc3RyaW5nfG51bGxcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS52ZXJzaW9uID0gbmFtZSAmJiB2ZXJzaW9uO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG9wZXJhdGluZyBzeXN0ZW0uXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgcGxhdGZvcm1cbiAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgKi9cbiAgICBwbGF0Zm9ybS5vcyA9IG9zIHx8IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgQ1BVIGFyY2hpdGVjdHVyZSB0aGUgT1MgaXMgYnVpbHQgZm9yLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHR5cGUgbnVtYmVyfG51bGxcbiAgICAgICAqL1xuICAgICAgJ2FyY2hpdGVjdHVyZSc6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGZhbWlseSBvZiB0aGUgT1MuXG4gICAgICAgKlxuICAgICAgICogQ29tbW9uIHZhbHVlcyBpbmNsdWRlOlxuICAgICAgICogXCJXaW5kb3dzXCIsIFwiV2luZG93cyBTZXJ2ZXIgMjAwOCBSMiAvIDdcIiwgXCJXaW5kb3dzIFNlcnZlciAyMDA4IC8gVmlzdGFcIixcbiAgICAgICAqIFwiV2luZG93cyBYUFwiLCBcIk9TIFhcIiwgXCJVYnVudHVcIiwgXCJEZWJpYW5cIiwgXCJGZWRvcmFcIiwgXCJSZWQgSGF0XCIsIFwiU3VTRVwiLFxuICAgICAgICogXCJBbmRyb2lkXCIsIFwiaU9TXCIgYW5kIFwiV2luZG93cyBQaG9uZVwiXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAnZmFtaWx5JzogbnVsbCxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgdmVyc2lvbiBvZiB0aGUgT1MuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIHBsYXRmb3JtLm9zXG4gICAgICAgKiBAdHlwZSBzdHJpbmd8bnVsbFxuICAgICAgICovXG4gICAgICAndmVyc2lvbic6IG51bGwsXG5cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0aGUgT1Mgc3RyaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBtZW1iZXJPZiBwbGF0Zm9ybS5vc1xuICAgICAgICogQHJldHVybnMge3N0cmluZ30gVGhlIE9TIHN0cmluZy5cbiAgICAgICAqL1xuICAgICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oKSB7IHJldHVybiAnbnVsbCc7IH1cbiAgICB9O1xuXG4gICAgcGxhdGZvcm0ucGFyc2UgPSBwYXJzZTtcbiAgICBwbGF0Zm9ybS50b1N0cmluZyA9IHRvU3RyaW5nUGxhdGZvcm07XG5cbiAgICBpZiAocGxhdGZvcm0udmVyc2lvbikge1xuICAgICAgZGVzY3JpcHRpb24udW5zaGlmdCh2ZXJzaW9uKTtcbiAgICB9XG4gICAgaWYgKHBsYXRmb3JtLm5hbWUpIHtcbiAgICAgIGRlc2NyaXB0aW9uLnVuc2hpZnQobmFtZSk7XG4gICAgfVxuICAgIGlmIChvcyAmJiBuYW1lICYmICEob3MgPT0gU3RyaW5nKG9zKS5zcGxpdCgnICcpWzBdICYmIChvcyA9PSBuYW1lLnNwbGl0KCcgJylbMF0gfHwgcHJvZHVjdCkpKSB7XG4gICAgICBkZXNjcmlwdGlvbi5wdXNoKHByb2R1Y3QgPyAnKCcgKyBvcyArICcpJyA6ICdvbiAnICsgb3MpO1xuICAgIH1cbiAgICBpZiAoZGVzY3JpcHRpb24ubGVuZ3RoKSB7XG4gICAgICBwbGF0Zm9ybS5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLmpvaW4oJyAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHBsYXRmb3JtO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gZXhwb3J0IHBsYXRmb3JtXG4gIC8vIHNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIGNvbmRpdGlvbiBwYXR0ZXJucyBsaWtlIHRoZSBmb2xsb3dpbmc6XG4gIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIGRlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlIGFsaWFzZWRcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcGFyc2UoKTtcbiAgICB9KTtcbiAgfVxuICAvLyBjaGVjayBmb3IgYGV4cG9ydHNgIGFmdGVyIGBkZWZpbmVgIGluIGNhc2UgYSBidWlsZCBvcHRpbWl6ZXIgYWRkcyBhbiBgZXhwb3J0c2Agb2JqZWN0XG4gIGVsc2UgaWYgKGZyZWVFeHBvcnRzICYmIGZyZWVNb2R1bGUpIHtcbiAgICAvLyBpbiBOYXJ3aGFsLCBOb2RlLmpzLCBSaGlubyAtcmVxdWlyZSwgb3IgUmluZ29KU1xuICAgIGZvck93bihwYXJzZSgpLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBmcmVlRXhwb3J0c1trZXldID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cbiAgLy8gaW4gYSBicm93c2VyIG9yIFJoaW5vXG4gIGVsc2Uge1xuICAgIHJvb3QucGxhdGZvcm0gPSBwYXJzZSgpO1xuICB9XG59LmNhbGwodGhpcykpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3BsYXRmb3JtL3BsYXRmb3JtLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgKiBhcyBfIGZyb20gXCJsb2Rhc2hcIjtcbi8qIHRzbGludDpkaXNhYmxlOm5vLXZhci1yZXF1aXJlcyAqL1xuaW1wb3J0ICogYXMgYmVuY2htYXJrIGZyb20gXCJiZW5jaG1hcmtcIjtcbmNvbnN0IHBsYXRmb3JtID0gcmVxdWlyZShcInBsYXRmb3JtXCIpO1xuLyogdHNsaW50OmVuYWJsZTpuby12YXItcmVxdWlyZXMgKi9cblxuaW1wb3J0IHtjcmVhdGVNYW5kZWxPcHRpb25zLCBwYXJhbGxlbE1hbmRlbGJyb3QgYXMgZHluYW1pY1BhcmFsbGVsTWFuZGVsYnJvdCwgc3luY01hbmRlbGJyb3R9IGZyb20gXCIuL2R5bmFtaWMvbWFuZGVsYnJvdFwiO1xuaW1wb3J0IHttYW5kZWxicm90IGFzIHRyYW5zcGlsZWRQYXJhbGxlbE1hbmRlbGJyb3R9IGZyb20gXCIuL3RyYW5zcGlsZWQvbWFuZGVsYnJvdFwiO1xuaW1wb3J0IHtzeW5jS25pZ2h0VG91cnMsIHBhcmFsbGVsS25pZ2h0VG91cnMgYXMgdHJhbnNwaWxlZFBhcmFsbGVsS25pZ2h0VG91cnN9IGZyb20gXCIuL3RyYW5zcGlsZWQva25pZ2h0cy10b3VyXCI7XG5pbXBvcnQge3BhcmFsbGVsS25pZ2h0VG91cnMgYXMgZHluYW1pY1BhcmFsbGVsS25pZ2h0VG91cnN9IGZyb20gXCIuL2R5bmFtaWMva25pZ2h0cy10b3VyXCI7XG5pbXBvcnQge0lNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMsIHN5bmNNb250ZUNhcmxvIGFzIHJhbmRvbU1vbnRlQ2FybG8sIHBhcmFsbGVsTW9udGVDYXJsbyBhcyByYW5kb21QYXJhbGxlbE1vbnRlQ2FybG8sIElQcm9qZWN0fSBmcm9tIFwiLi9keW5hbWljL21vbnRlLWNhcmxvXCI7XG5pbXBvcnQge3N5bmNNb250ZUNhcmxvIGFzIHNpbUpzTW9udGVDYXJsbywgcGFyYWxsZWxNb250ZUNhcmxvIGFzIHNpbUpzUGFyYWxsZWxNb250ZUNhcmxvfSBmcm9tIFwiLi90cmFuc3BpbGVkL21vbnRlLWNhcmxvXCI7XG5cbmxldCBCZW5jaG1hcmsgPSAoYmVuY2htYXJrIGFzIGFueSkucnVuSW5Db250ZXh0KHsgXyB9KTtcbih3aW5kb3cgYXMgYW55KS5CZW5jaG1hcmsgPSBCZW5jaG1hcms7XG5cbmNvbnN0IHJ1bkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcnVuXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5jb25zdCBvdXRwdXRUYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3V0cHV0LXRhYmxlXCIpIGFzIEhUTUxUYWJsZUVsZW1lbnQ7XG5jb25zdCBqc29uT3V0cHV0RmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2pzb24tb3V0cHV0XCIpIGFzIEhUTUxFbGVtZW50O1xuXG5jb25zdCBzeW5jQ2hlY2tib3ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N5bmNcIikgYXMgSFRNTElucHV0RWxlbWVudDtcbmNvbnN0IHBhcmFsbGVsRHluYW1pY0NoZWNrYm94ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwYXJhbGxlbC1lcy1keW5hbWljXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5jb25zdCBwYXJhbGxlbFRyYW5zcGlsZWRDaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGFyYWxsZWwtZXMtdHJhbnNwaWxlZFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG5jb25zdCBrbmlnaHRSdW5uZXI2eDYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2tuaWdodC1ydW5uZXItNi02XCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbnR5cGUgRGVmZXJyZWQgPSB7IHJlc29sdmU6ICgpID0+IHZvaWQsIHJlamVjdDogKCkgPT4gdm9pZCB9O1xuXG5mdW5jdGlvbiBhZGRLbmlnaHRCb2FyZFRlc3RzKHN1aXRlOiBiZW5jaG1hcmsuU3VpdGUpIHtcbiAgICBjb25zdCBib2FyZFNpemVzID0ga25pZ2h0UnVubmVyNng2LmNoZWNrZWQgPyBbNSwgNl0gOiBbNV07XG5cbiAgICBmb3IgKGNvbnN0IGJvYXJkU2l6ZSBvZiBib2FyZFNpemVzKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gYEtuaWdodHMgVG91ciAoJHtib2FyZFNpemV9eCR7Ym9hcmRTaXplfSlgO1xuICAgICAgICBzdWl0ZS5hZGQoYHN5bmM6ICR7dGl0bGV9YCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3luY0tuaWdodFRvdXJzKHt4OiAwLCB5OiAwfSwgYm9hcmRTaXplKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc3VpdGUuYWRkKGBwYXJhbGxlbC1keW5hbWljOiAke3RpdGxlfWAsIGZ1bmN0aW9uIChkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIGR5bmFtaWNQYXJhbGxlbEtuaWdodFRvdXJzKHt4OiAwLCB5OiAwfSwgYm9hcmRTaXplKS50aGVuKCgpID0+IGRlZmVycmVkLnJlc29sdmUoKSwgKCkgPT4gZGVmZXJyZWQucmVqZWN0KCkpO1xuICAgICAgICB9LCB7IGRlZmVyOiB0cnVlIH0pO1xuXG4gICAgICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtdHJhbnNwaWxlZDogJHt0aXRsZX1gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICB0cmFuc3BpbGVkUGFyYWxsZWxLbmlnaHRUb3Vycyh7eDogMCwgeTogMH0sIGJvYXJkU2l6ZSkudGhlbigoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCksICgpID0+IGRlZmVycmVkLnJlamVjdCgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE1vbnRlQ2FybG9UZXN0KHN1aXRlOiBiZW5jaG1hcmsuU3VpdGUsIG9wdGlvbnM6IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMgJiB7bnVtYmVyT2ZQcm9qZWN0czogbnVtYmVyLCBudW1SdW5zOiBudW1iZXJ9KSB7XG4gICAgY29uc3QgcnVuT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywge1xuICAgICAgICBwcm9qZWN0czogY3JlYXRlUHJvamVjdHMob3B0aW9ucy5udW1iZXJPZlByb2plY3RzKVxuICAgIH0pO1xuXG4gICAgY29uc3QgY29uZmlnTmFtZSA9IGAocHJvamVjdHM6ICR7b3B0aW9ucy5udW1iZXJPZlByb2plY3RzfSwgcnVuczogJHtvcHRpb25zLm51bVJ1bnMudG9Mb2NhbGVTdHJpbmcoKX0pYDtcblxuICAgIHN1aXRlLmFkZChgc3luYzogTW9udGUgQ2FybG8gTWF0aC5yYW5kb20gJHtjb25maWdOYW1lfWAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmFuZG9tTW9udGVDYXJsbyhvcHRpb25zKTtcbiAgICB9KTtcblxuICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtZHluYW1pYzogTW9udGUgQ2FybG8gTWF0aC5yYW5kb20gJHtjb25maWdOYW1lfWAsXG4gICAgICAgIGZ1bmN0aW9uIChkZWZlcnJlZDogRGVmZXJyZWQpIHtcbiAgICAgICAgICAgIHJldHVybiByYW5kb21QYXJhbGxlbE1vbnRlQ2FybG8ocnVuT3B0aW9ucykudGhlbigoKSA9PiBkZWZlcnJlZC5yZXNvbHZlKCksICgpID0+IGRlZmVycmVkLnJlamVjdCgpKTtcbiAgICAgICAgfSwgeyBkZWZlcjogdHJ1ZSB9XG4gICAgKTtcblxuICAgIHN1aXRlLmFkZChgc3luYzogTW9udGUgQ2FybG8gc2ltanMgJHtjb25maWdOYW1lfWAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2ltSnNNb250ZUNhcmxvKG9wdGlvbnMpO1xuICAgIH0pO1xuXG4gICAgc3VpdGUuYWRkKGBwYXJhbGxlbC10cmFuc3BpbGVkOiBNb250ZSBDYXJsbyBzaW1qcyAke2NvbmZpZ05hbWV9YCxcbiAgICAgICAgZnVuY3Rpb24gKGRlZmVycmVkOiBEZWZlcnJlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHNpbUpzUGFyYWxsZWxNb250ZUNhcmxvKHJ1bk9wdGlvbnMpLnRoZW4oKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpLCAoKSA9PiBkZWZlcnJlZC5yZWplY3QoKSk7XG4gICAgICAgIH0sIHsgZGVmZXI6IHRydWUgfVxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGFkZE1vbnRlQ2FybG9UZXN0cyhzdWl0ZTogYmVuY2htYXJrLlN1aXRlKSB7XG4gICAgY29uc3QgbW9udGVDYXJsb09wdGlvbnMgPSB7XG4gICAgICAgIGludmVzdG1lbnRBbW91bnQ6IDYyMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAwLFxuICAgICAgICBudW1ZZWFyczogMTUsXG4gICAgICAgIHBlcmZvcm1hbmNlOiAwLjAzNDAwMDAsXG4gICAgICAgIHNlZWQ6IDEwLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjA4OTYwMDBcbiAgICB9O1xuXG4gICAgZm9yIChjb25zdCBudW1iZXJPZlByb2plY3RzIG9mICBbMSwgNCwgOCwgMTZdKSB7XG4gICAgICAgIGZvciAoY29uc3QgbnVtUnVucyBvZiBbMTAgKiogNCwgMTAgKiogNSwgMTAgKiogNl0pIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb250ZUNhcmxvT3B0aW9ucywgeyBudW1iZXJPZlByb2plY3RzLCBudW1SdW5zIH0pO1xuICAgICAgICAgICAgYWRkTW9udGVDYXJsb1Rlc3Qoc3VpdGUsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRNYW5kZWxicm90VGVzdHMoc3VpdGU6IGJlbmNobWFyay5TdWl0ZSkge1xuICAgIGNvbnN0IG1hbmRlbGJyb3RIZWlnaHQgPSBwYXJzZUludCgoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYW5kZWxicm90LWhlaWdodFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuICAgIGNvbnN0IG1hbmRlbGJyb3RXaWR0aCA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3Qtd2lkdGhcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUsIDEwKTtcbiAgICBjb25zdCBtYW5kZWxicm90SXRlcmF0aW9ucyA9IHBhcnNlSW50KChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21hbmRlbGJyb3QtaXRlcmF0aW9uc1wiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgMTApO1xuXG4gICAgY29uc3QgbWFuZGVsYnJvdE9wdGlvbnMgPSBjcmVhdGVNYW5kZWxPcHRpb25zKG1hbmRlbGJyb3RXaWR0aCwgbWFuZGVsYnJvdEhlaWdodCwgbWFuZGVsYnJvdEl0ZXJhdGlvbnMpO1xuXG4gICAgc3VpdGUuYWRkKGBzeW5jOiBNYW5kZWxicm90ICR7bWFuZGVsYnJvdFdpZHRofXgke21hbmRlbGJyb3RIZWlnaHR9LCAke21hbmRlbGJyb3RJdGVyYXRpb25zfWAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3luY01hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnMsICgpID0+IHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBmb3IgKGNvbnN0IG1heFZhbHVlc1BlclRhc2sgb2YgW3VuZGVmaW5lZCwgMSwgNzUsIDE1MCwgMzAwLCA2MDAsIDEyMDBdKSB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gYE1hbmRlbGJyb3QgJHttYW5kZWxicm90T3B0aW9ucy5pbWFnZVdpZHRofXgke21hbmRlbGJyb3RPcHRpb25zLmltYWdlSGVpZ2h0fSwgJHttYW5kZWxicm90T3B0aW9ucy5pdGVyYXRpb25zfSAoJHttYXhWYWx1ZXNQZXJUYXNrfSlgO1xuICAgICAgICBzdWl0ZS5hZGQoYHBhcmFsbGVsLWR5bmFtaWM6ICR7dGl0bGV9YCwgZnVuY3Rpb24gKGRlZmVycmVkOiBEZWZlcnJlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGR5bmFtaWNQYXJhbGxlbE1hbmRlbGJyb3QobWFuZGVsYnJvdE9wdGlvbnMsIHsgbWF4VmFsdWVzUGVyVGFzayB9KS50aGVuKCgpID0+IGRlZmVycmVkLnJlc29sdmUoKSwgKCkgPT4gZGVmZXJyZWQucmVqZWN0KCkpO1xuICAgICAgICB9LCB7IGRlZmVyOiB0cnVlIH0pO1xuXG4gICAgICAgIHN1aXRlLmFkZChgcGFyYWxsZWwtdHJhbnNwaWxlZDogJHt0aXRsZX1gLCBmdW5jdGlvbiAoZGVmZXJyZWQ6IERlZmVycmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNwaWxlZFBhcmFsbGVsTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9ucywgeyBtYXhWYWx1ZXNQZXJUYXNrIH0pLnRoZW4oKCkgPT4gZGVmZXJyZWQucmVzb2x2ZSgpLCAoKSA9PiBkZWZlcnJlZC5yZWplY3QoKSk7XG4gICAgICAgIH0sIHsgZGVmZXI6IHRydWUgfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtZWFzdXJlKCkge1xuICAgIGNvbnN0IGFsbFRlc3RzU3VpdGUgPSBuZXcgQmVuY2htYXJrLlN1aXRlKCk7XG5cbiAgICBhZGRNb250ZUNhcmxvVGVzdHMoYWxsVGVzdHNTdWl0ZSk7XG4gICAgYWRkTWFuZGVsYnJvdFRlc3RzKGFsbFRlc3RzU3VpdGUpO1xuICAgIGFkZEtuaWdodEJvYXJkVGVzdHMoYWxsVGVzdHNTdWl0ZSk7XG5cbiAgICBjb25zdCBzdWl0ZSA9IGFsbFRlc3RzU3VpdGUuZmlsdGVyKChiZW5jaG1hcms6IGJlbmNobWFyayAgJiB7bmFtZTogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIHN5bmNDaGVja2JveC5jaGVja2VkICYmIGJlbmNobWFyay5uYW1lLnN0YXJ0c1dpdGgoXCJzeW5jXCIpIHx8XG4gICAgICAgICAgICBwYXJhbGxlbER5bmFtaWNDaGVja2JveC5jaGVja2VkICYmIGJlbmNobWFyay5uYW1lLnN0YXJ0c1dpdGgoXCJwYXJhbGxlbC1keW5hbWljXCIpIHx8XG4gICAgICAgICAgICBwYXJhbGxlbFRyYW5zcGlsZWRDaGVja2JveC5jaGVja2VkICYmIGJlbmNobWFyay5uYW1lLnN0YXJ0c1dpdGgoXCJwYXJhbGxlbC10cmFuc3BpbGVkXCIpO1xuICAgIH0pO1xuXG4gICAgc3VpdGUub24oXCJjeWNsZVwiLCBmdW5jdGlvbiAoZXZlbnQ6IGJlbmNobWFyay5FdmVudCkge1xuICAgICAgICBhcHBlbmRUZXN0UmVzdWx0cyhldmVudCk7XG4gICAgfSk7XG5cbiAgICBzdWl0ZS5vbihcImNvbXBsZXRlXCIsIGZ1bmN0aW9uIChldmVudDogYmVuY2htYXJrLkV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGJlbmNobWFya3MgPSAoZXZlbnQuY3VycmVudFRhcmdldCBhcyBiZW5jaG1hcmsuU3VpdGUpLm1hcCgoYmVuY2htYXJrOiBiZW5jaG1hcmsgJiB7bmFtZTogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5mbzogYmVuY2htYXJrLnRvU3RyaW5nLFxuICAgICAgICAgICAgICAgIG5hbWU6IGJlbmNobWFyay5uYW1lLFxuICAgICAgICAgICAgICAgIHN0YXRzOiBiZW5jaG1hcmsuc3RhdHMsXG4gICAgICAgICAgICAgICAgdGltZXM6IGJlbmNobWFyay50aW1lc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAganNvbk91dHB1dEZpZWxkLnRleHRDb250ZW50ID0gSlNPTi5zdHJpbmdpZnkoeyBiZW5jaG1hcmtzLCBwbGF0Zm9ybX0sIHVuZGVmaW5lZCwgXCIgICAgXCIpO1xuICAgICAgICBydW5CdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcblxuICAgIHN1aXRlLm9uKFwic3RhcnRcIiwgaW5pdFJlc3VsdFRhYmxlKTtcblxuICAgIHN1aXRlLnJ1bih7YXN5bmM6IHRydWUgfSk7XG59XG5cbnJ1bkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBydW5CdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIG1lYXN1cmUoKTtcbn0pO1xuXG5mdW5jdGlvbiBpbml0UmVzdWx0VGFibGUoZXZlbnQ6IGJlbmNobWFyay5FdmVudCkge1xuICAgIGNsZWFyT3V0cHV0VGFibGUoKTtcblxuICAgIGZ1bmN0aW9uIGNsZWFyT3V0cHV0VGFibGUoKSB7XG4gICAgICAgIHdoaWxlIChvdXRwdXRUYWJsZS50Qm9kaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG91dHB1dFRhYmxlLnJlbW92ZUNoaWxkKG91dHB1dFRhYmxlLnRCb2RpZXNbMF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgYm9keSA9IG91dHB1dFRhYmxlLmNyZWF0ZVRCb2R5KCk7XG4gICAgKGV2ZW50LmN1cnJlbnRUYXJnZXQgYXMgQXJyYXk8YmVuY2htYXJrLk9wdGlvbnM+KS5mb3JFYWNoKHN1aXRlID0+IHtcbiAgICAgICAgY29uc3Qgcm93ID0gYm9keS5pbnNlcnRSb3coKTtcbiAgICAgICAgY29uc3QgW3NldCwgLi4ubmFtZVBhcnRzXSA9IHN1aXRlLm5hbWUhLnNwbGl0KFwiOlwiKTtcblxuICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpLnRleHRDb250ZW50ID0gc2V0O1xuICAgICAgICByb3cuaW5zZXJ0Q2VsbCgpLnRleHRDb250ZW50ID0gbmFtZVBhcnRzLmpvaW4oXCI6XCIpO1xuICAgICAgICBjb25zdCBjb2x1bW5zID0gKG91dHB1dFRhYmxlLnRIZWFkLnJvd3NbMF0gYXMgSFRNTFRhYmxlUm93RWxlbWVudCkuY2VsbHMubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbHVtbnM7ICsraSkge1xuICAgICAgICAgICAgcm93Lmluc2VydENlbGwoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRUZXN0UmVzdWx0cyhldmVudDogYmVuY2htYXJrLkV2ZW50KSB7XG4gICAgY29uc3QgYm9keSA9IG91dHB1dFRhYmxlLnRCb2RpZXNbMF0gYXMgSFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ7XG4gICAgY29uc3QgYmVuY2htYXJrID0gZXZlbnQudGFyZ2V0IGFzIChiZW5jaG1hcmspO1xuICAgIGNvbnN0IGluZGV4ID0gKGV2ZW50LmN1cnJlbnRUYXJnZXQgYXMgQXJyYXk8YmVuY2htYXJrPikuaW5kZXhPZihiZW5jaG1hcmspO1xuICAgIGNvbnN0IHJvdyA9IGJvZHkucm93c1tpbmRleF0gYXMgSFRNTFRhYmxlUm93RWxlbWVudDtcblxuICAgIHJvdy5jZWxsc1syXS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy5kZXZpYXRpb24udG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbM10udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMubWVhbi50b0ZpeGVkKDQpO1xuICAgIHJvdy5jZWxsc1s0XS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy5tb2UudG9GaXhlZCg0KTtcbiAgICByb3cuY2VsbHNbNV0udGV4dENvbnRlbnQgPSBiZW5jaG1hcmsuc3RhdHMucm1lLnRvRml4ZWQoNCk7XG4gICAgcm93LmNlbGxzWzZdLnRleHRDb250ZW50ID0gYmVuY2htYXJrLnN0YXRzLnNlbS50b0ZpeGVkKDQpO1xuICAgIHJvdy5jZWxsc1s3XS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy52YXJpYW5jZS50b0ZpeGVkKDQpO1xuICAgIHJvdy5jZWxsc1s4XS50ZXh0Q29udGVudCA9IGJlbmNobWFyay5zdGF0cy5zYW1wbGUubGVuZ3RoLnRvRml4ZWQoMCk7XG4gICAgcm93LmNlbGxzWzldLnRleHRDb250ZW50ID0gYmVuY2htYXJrLmh6LnRvRml4ZWQoNCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByb2plY3RzKGNvdW50OiBudW1iZXIpOiBJUHJvamVjdFtdIHtcbiAgICBjb25zdCBwcm9qZWN0czogSVByb2plY3RbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgKytpKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goe1xuICAgICAgICAgICAgc3RhcnRZZWFyOiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxNSksXG4gICAgICAgICAgICB0b3RhbEFtb3VudDogTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDAwKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvamVjdHM7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGVyZm9ybWFuY2UtbWVhc3VyZW1lbnQudHMiXSwic291cmNlUm9vdCI6IiJ9