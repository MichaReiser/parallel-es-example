/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [], result;
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules, executeModules);
/******/ 		while(resolves.length)
/******/ 			resolves.shift()();
/******/ 		if(executeModules) {
/******/ 			for(i=0; i < executeModules.length; i++) {
/******/ 				result = __webpack_require__(__webpack_require__.s = executeModules[i]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	};
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// objects to store loaded and loading chunks
/******/ 	var installedChunks = {
/******/ 		2: 0
/******/ 	};
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
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return Promise.resolve();
/******/
/******/ 		// an Promise means "currently loading".
/******/ 		if(installedChunks[chunkId]) {
/******/ 			return installedChunks[chunkId][2];
/******/ 		}
/******/ 		// start chunk loading
/******/ 		var head = document.getElementsByTagName('head')[0];
/******/ 		var script = document.createElement('script');
/******/ 		script.type = 'text/javascript';
/******/ 		script.charset = 'utf-8';
/******/ 		script.async = true;
/******/ 		script.timeout = 120000;
/******/
/******/ 		script.src = __webpack_require__.p + "" + chunkId + ".js";
/******/ 		var timeout = setTimeout(onScriptComplete, 120000);
/******/ 		script.onerror = script.onload = onScriptComplete;
/******/ 		function onScriptComplete() {
/******/ 			// avoid mem leaks in IE.
/******/ 			script.onerror = script.onload = null;
/******/ 			clearTimeout(timeout);
/******/ 			var chunk = installedChunks[chunkId];
/******/ 			if(chunk !== 0) {
/******/ 				if(chunk) chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
/******/ 				installedChunks[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		head.appendChild(script);
/******/
/******/ 		var promise = new Promise(function(resolve, reject) {
/******/ 			installedChunks[chunkId] = [resolve, reject];
/******/ 		});
/******/ 		return installedChunks[chunkId][2] = promise;
/******/ 	};
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
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/* unknown exports provided */
/* exports used: default */
/*!*********************************************************!*\
  !*** ./~/parallel-es/dist/browser-commonjs.parallel.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

!function(t,n){ true?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports["parallel-es"]=n():t["parallel-es"]=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var e={};return n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,n,e){Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=170)}(function(t){for(var n in t)if(Object.prototype.hasOwnProperty.call(t,n))switch(typeof t[n]){case"function":break;case"object":t[n]=function(n){var e=n.slice(1),r=t[n[0]];return function(t,n,i){r.apply(this,[t,n,i].concat(e))}}(t[n]);break;default:t[n]=t[t[n]]}return t}([function(t,n){"use strict";n.__esModule=!0,n["default"]=function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(72),o=r(i);n["default"]=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o["default"])(t,r.key,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}()},function(t,n){var e=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=e)},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n,e){var r=e(47)("wks"),i=e(31),o=e(3).Symbol,u="function"==typeof o,a=t.exports=function(t){return r[t]||(r[t]=u&&o[t]||(u?o:i)("Symbol."+t))};a.store=r},function(t,n,e){t.exports=!e(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n,e){var r=e(7),i=e(41),o=e(30),u=Object.defineProperty;n.f=e(5)?Object.defineProperty:function(t,n,e){if(r(t),n=o(n,!0),r(e),i)try{return u(t,n,e)}catch(a){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(11);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,n,e){var r=e(3),i=e(2),o=e(14),u=e(10),a="prototype",c=function(t,n,e){var s,f,l,h=t&c.F,d=t&c.G,v=t&c.S,p=t&c.P,y=t&c.B,m=t&c.W,k=d?i:i[n]||(i[n]={}),_=k[a],g=d?r:v?r[n]:(r[n]||{})[a];d&&(e=n);for(s in e)f=!h&&g&&void 0!==g[s],f&&s in k||(l=f?g[s]:e[s],k[s]=d&&"function"!=typeof g[s]?e[s]:y&&f?o(l,r):m&&g[s]==l?function(t){var n=function(n,e,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,r)}return t.apply(this,arguments)};return n[a]=t[a],n}(l):p&&"function"==typeof l?o(Function.call,l):l,p&&((k.virtual||(k.virtual={}))[s]=l,t&c.R&&_&&!_[s]&&u(_,s,l)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o);e.d(n,"a",function(){return a});var a=function(){function t(n,e){i()(this,t),this.func=n,this.params=e}return u()(t,null,[{key:"create",value:function(n){for(var e=arguments.length,r=Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];return new t(n,r)}},{key:"createUnchecked",value:function(n){for(var e=arguments.length,r=Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];return new t(n,r)}}]),t}()},function(t,n,e){var r=e(6),i=e(18);t.exports=e(5)?function(t,n,e){return r.f(t,n,i(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,e){var r=e(81),i=e(39);t.exports=function(t){return r(i(t))}},function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},function(t,n,e){var r=e(24);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,i){return t.call(n,e,r,i)}}return function(){return t.apply(n,arguments)}}},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},function(t,n,e){"use strict";function r(t,n){return{_______isFunctionId:!0,identifier:t+"-"+n}}function i(t){return!!t&&t._______isFunctionId===!0}n.a=r,n.b=i},function(t,n,e){t.exports={"default":e(123),__esModule:!0}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,e){"use strict";var r=e(16);e.d(n,"a",function(){return i});var i={FILTER:e.i(r.a)("parallel",0),IDENTITY:e.i(r.a)("parallel",1),MAP:e.i(r.a)("parallel",2),PARALLEL_JOB_EXECUTOR:e.i(r.a)("parallel",3),RANGE:e.i(r.a)("parallel",4),REDUCE:e.i(r.a)("parallel",5),TIMES:e.i(r.a)("parallel",6),TO_ITERATOR:e.i(r.a)("parallel",7)}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n){t.exports={}},function(t,n,e){var r=e(89),i=e(40);t.exports=Object.keys||function(t){return r(t,i)}},function(t,n,e){"use strict";var r=e(17),i=e.n(r),o=e(38),u=e.n(o),a=e(0),c=e.n(a),s=e(1),f=e.n(s),l=e(111),h=e(110);e.d(n,"a",function(){return d});var d=function(){function t(n){var e=this;c()(this,t),this.nextHandlers=[];var r=function(t,n,r){return e._next(t,n,r)},i=function(t){return e.reject(t)},o=function(t){return e.resolve(t)};n(r,o,i),this.promise=new u.a(function(t,n){e.resolve=t,e.reject=n})}return f()(t,[{key:"subscribe",value:function(t,n,e){return this.nextHandlers.push(t),(n||e)&&this.promise.then(e,n),this}},{key:"then",value:function(t,n){return this.promise.then(t,n)}},{key:"catch",value:function(t){return this.promise["catch"](t)}},{key:"_next",value:function(t,n,e){var r=!0,o=!1,u=void 0;try{for(var a,c=i()(this.nextHandlers);!(r=(a=c.next()).done);r=!0){var s=a.value;s.apply(void 0,arguments)}}catch(f){o=!0,u=f}finally{try{!r&&c["return"]&&c["return"]()}finally{if(o)throw u}}}}],[{key:"transform",value:function(n,e){var r=void 0,i=void 0,o=void 0,u=new t(function(t,n,e){r=t,i=n,o=e});return n.subscribe(r,o,function(t){return i(e(t))}),u}},{key:"fromTasks",value:function(t,n){return 0===t.length?new h.a(n.apply(void 0,[[]])):new l.a(t,n)}}]),t}()},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n,e){var r=e(11),i=e(3).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,n){t.exports=!0},function(t,n){n.f={}.propertyIsEnumerable},function(t,n,e){var r=e(6).f,i=e(15),o=e(4)("toStringTag");t.exports=function(t,n,e){t&&!i(t=e?t:t.prototype,o)&&r(t,o,{configurable:!0,value:n})}},function(t,n,e){var r=e(39);t.exports=function(t){return Object(r(t))}},function(t,n,e){var r=e(11);t.exports=function(t,n){if(!r(t))return t;var e,i;if(n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;if("function"==typeof(e=t.valueOf)&&!r(i=e.call(t)))return i;if(!n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},function(t,n,e){"use strict";var r=e(153)(!0);e(84)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})})},function(t,n,e){"use strict";var r=e(63),i=(e.n(r),e(56)),o=(e.n(i),e(59)),u=(e.n(o),e(60)),a=(e.n(u),e(62)),c=(e.n(a),e(64)),s=(e.n(c),e(61)),f=(e.n(s),e(65));e.n(f);e.o(r,"IParallel")&&e.d(n,"a",function(){return r.IParallel}),e.o(i,"IParallelChain")&&e.d(n,"b",function(){return i.IParallelChain}),e.o(o,"IParallelTaskEnvironment")&&e.d(n,"c",function(){return o.IParallelTaskEnvironment}),e.o(o,"IParallelEnvironment")&&e.d(n,"d",function(){return o.IParallelEnvironment}),e.o(u,"IParallelJob")&&e.d(n,"e",function(){return u.IParallelJob}),e.o(a,"IParallelOptions")&&e.d(n,"f",function(){return a.IParallelOptions}),e.o(a,"IDefaultInitializedParallelOptions")&&e.d(n,"g",function(){return a.IDefaultInitializedParallelOptions}),e.o(c,"IParallelJobScheduler")&&e.d(n,"h",function(){return c.IParallelJobScheduler}),e.o(s,"IParallelOperation")&&e.d(n,"i",function(){return s.IParallelOperation}),e.o(s,"ISerializedParallelOperation")&&e.d(n,"j",function(){return s.ISerializedParallelOperation}),e.o(f,"IParallelStream")&&e.d(n,"k",function(){return f.IParallelStream})},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o);e.d(n,"a",function(){return a});var a=function(){function t(n){i()(this,t),this.functionRegistry=n}return u()(t,[{key:"serializeFunctionCall",value:function(t){var n=this.functionRegistry.getOrSetId(t.func);return{______serializedFunctionCall:!0,functionId:n,parameters:t.params}}}]),t}()},function(t,n,e){"use strict";function r(t){return!!t&&t.______serializedFunctionCall===!0}n.a=r},function(t,n,e){"use strict";function r(t){if(0===t.length)return[];var n=o()(t),e=n[0],r=n.slice(1);return Array.prototype.concat.apply(e,r)}var i=e(75),o=e.n(i),u=e(17);e.n(u);n.a=r},function(t,n,e){t.exports={"default":e(129),__esModule:!0}},function(t,n,e){t.exports={"default":e(131),__esModule:!0}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,n,e){t.exports=!e(5)&&!e(13)(function(){return 7!=Object.defineProperty(e(25)("div"),"a",{get:function(){return 7}}).a})},function(t,n,e){var r=e(7),i=e(148),o=e(40),u=e(46)("IE_PROTO"),a=function(){},c="prototype",s=function(){var t,n=e(25)("iframe"),r=o.length,i="<",u=">";for(n.style.display="none",e(80).appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write(i+"script"+u+"document.F=Object"+i+"/script"+u),t.close(),s=t.F;r--;)delete s[c][o[r]];return s()};t.exports=Object.create||function(t,n){var e;return null!==t?(a[c]=r(t),e=new a,a[c]=null,e[u]=t):e=s(),void 0===n?e:i(e,n)}},function(t,n,e){var r=e(27),i=e(18),o=e(12),u=e(30),a=e(15),c=e(41),s=Object.getOwnPropertyDescriptor;n.f=e(5)?s:function(t,n){if(t=o(t),n=u(n,!0),c)try{return s(t,n)}catch(e){}if(a(t,n))return i(!r.f.call(t,n),t[n])}},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n,e){var r=e(8),i=e(2),o=e(13);t.exports=function(t,n){var e=(i.Object||{})[t]||Object[t],u={};u[t]=n(e),r(r.S+r.F*o(function(){e(1)}),"Object",u)}},function(t,n,e){var r=e(47)("keys"),i=e(31);t.exports=function(t){return r[t]||(r[t]=i(t))}},function(t,n,e){var r=e(3),i="__core-js_shared__",o=r[i]||(r[i]={});t.exports=function(t){return o[t]||(o[t]={})}},function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},function(t,n,e){var r=e(48),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0}},function(t,n,e){var r=e(3),i=e(2),o=e(26),u=e(51),a=e(6).f;t.exports=function(t){var n=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in n||a(n,t,{value:u.f(t)})}},function(t,n,e){n.f=e(4)},function(t,n,e){var r=e(79),i=e(4)("iterator"),o=e(21);t.exports=e(2).getIteratorMethod=function(t){if(void 0!=t)return t[i]||t["@@iterator"]||o[r(t)]}},function(t,n,e){e(157);for(var r=e(3),i=e(10),o=e(21),u=e(4)("toStringTag"),a=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],c=0;c<5;c++){var s=a[c],f=r[s],l=f&&f.prototype;l&&!l[u]&&i(l,u,s),o[s]=o.Array}},function(t,n,e){"use strict";var r=e(33),i=e(66),o=(e.n(i),e(67)),u=(e.n(o),e(55)),a=(e.n(u),e(16)),c=e(9),s=e(35),f=e(34),l=e(68),h=(e.n(l),e(33));e.d(n,"a",function(){return r.a}),e.o(i,"ITaskDefinition")&&e.d(n,"b",function(){return i.ITaskDefinition}),e.o(o,"ITask")&&e.d(n,"c",function(){return o.ITask}),e.o(u,"IFunctionDefinition")&&e.d(n,"d",function(){return u.IFunctionDefinition}),e.d(n,"e",function(){return a.IFunctionId}),e.d(n,"f",function(){return a.b}),e.d(n,"g",function(){return c.a}),e.d(n,"h",function(){return s.ISerializedFunctionCall}),e.d(n,"i",function(){return s.a}),e.d(n,"j",function(){return f.a}),e.o(l,"IThreadPool")&&e.d(n,"k",function(){return l.IThreadPool}),e.d(n,"l",function(){return h.b}),e.d(n,"m",function(){return h.c}),e.d(n,"n",function(){return h.d}),e.d(n,"o",function(){return h.e}),e.d(n,"p",function(){return h.f}),e.d(n,"q",function(){return h.g}),e.d(n,"r",function(){return h.h}),e.d(n,"s",function(){return h.i}),e.d(n,"t",function(){return h.j}),e.d(n,"u",function(){return h.k})},function(t,n){},function(t,n){},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(102);e.d(n,"a",function(){return c});var c=function(){function t(n,e,r){i()(this,t),this.options=e,this.environment=r,this.stream=n}return u()(t,[{key:"resolve",value:function(){return this}},{key:"chainOperation",value:function(t){return new a.a(this.stream,this.options,this.environment,[t])}},{key:"addEnvironment",value:function(t){return new a.a(this.stream,this.options,this.environment.add(t))}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(19),c=e(9);e.d(n,"a",function(){return s});var s=function(){function t(n){i()(this,t),this.collection=n}return u()(t,[{key:"serializeSlice",value:function(t,n,e){var r=n*t,i=r+n;return e.serializeFunctionCall(c.a.createUnchecked(a.a.TO_ITERATOR,this.collection.slice(r,i)))}},{key:"length",get:function(){return this.collection.length}}]),t}()},56,56,function(t,n){},56,56,56,56,55,55,56,function(t,n,e){"use strict";function r(t){return{type:d.InitializeWorker,workerId:t}}function i(t){return{task:t,type:d.ScheduleTask}}function o(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];return{functions:t,missingFunctions:e,type:d.FunctionResponse}}function u(){return{type:d.Stop}}function a(t){return t.type===d.FunctionRequest}function c(t){return t.type===d.WorkerResult}function s(t){return t.type===d.FunctionExecutionError}var f=e(114),l=(e.n(f),e(117)),h=(e.n(l),e(17));e.n(h);n.e=r,n.f=i,n.d=o,n.g=u,n.a=a,n.b=c,n.c=s;var d;!function(t){t[t.InitializeWorker=0]="InitializeWorker",t[t.ScheduleTask=1]="ScheduleTask",t[t.FunctionRequest=2]="FunctionRequest",t[t.FunctionResponse=3]="FunctionResponse",t[t.WorkerResult=4]="WorkerResult",t[t.FunctionExecutionError=5]="FunctionExecutionError",t[t.Stop=6]="Stop"}(d||(d={}))},function(t,n,e){t.exports={"default":e(122),__esModule:!0}},function(t,n,e){t.exports={"default":e(125),__esModule:!0}},function(t,n,e){t.exports={"default":e(78),__esModule:!0}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(118),o=r(i),u=e(115),a=r(u),c=e(77),s=r(c);n["default"]=function(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+("undefined"==typeof n?"undefined":(0,s["default"])(n)));t.prototype=(0,a["default"])(n&&n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),n&&(o["default"]?(0,o["default"])(t,n):t.__proto__=n)}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(77),o=r(i);n["default"]=function(t,n){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!==("undefined"==typeof n?"undefined":(0,o["default"])(n))&&"function"!=typeof n?t:n}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(70),o=r(i);n["default"]=function(t){return Array.isArray(t)?t:(0,o["default"])(t)}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(70),o=r(i);n["default"]=function(t){if(Array.isArray(t)){for(var n=0,e=Array(t.length);n<t.length;n++)e[n]=t[n];return e}return(0,o["default"])(t)}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(120),o=r(i),u=e(119),a=r(u),c="function"==typeof a["default"]&&"symbol"==typeof o["default"]?function(t){return typeof t}:function(t){return t&&"function"==typeof a["default"]&&t.constructor===a["default"]?"symbol":typeof t};n["default"]="function"==typeof a["default"]&&"symbol"===c(o["default"])?function(t){return"undefined"==typeof t?"undefined":c(t)}:function(t){return t&&"function"==typeof a["default"]&&t.constructor===a["default"]?"symbol":"undefined"==typeof t?"undefined":c(t)}},function(t,n,e){e(92);var r=e(2).Object;t.exports=function(t,n,e){return r.defineProperty(t,n,e)}},function(t,n,e){var r=e(20),i=e(4)("toStringTag"),o="Arguments"==r(function(){return arguments}()),u=function(t,n){try{return t[n]}catch(e){}};t.exports=function(t){var n,e,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=u(n=Object(t),i))?e:o?r(n):"Object"==(a=r(n))&&"function"==typeof n.callee?"Arguments":a}},function(t,n,e){t.exports=e(3).document&&document.documentElement},function(t,n,e){var r=e(20);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,n,e){var r=e(21),i=e(4)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)}},function(t,n,e){var r=e(7);t.exports=function(t,n,e,i){try{return i?n(r(e)[0],e[1]):n(e)}catch(o){var u=t["return"];throw void 0!==u&&r(u.call(t)),o}}},function(t,n,e){"use strict";var r=e(26),i=e(8),o=e(90),u=e(10),a=e(15),c=e(21),s=e(142),f=e(28),l=e(88),h=e(4)("iterator"),d=!([].keys&&"next"in[].keys()),v="@@iterator",p="keys",y="values",m=function(){return this};t.exports=function(t,n,e,k,_,g,w){s(e,n,k);var b,x,O,P=function(t){if(!d&&t in T)return T[t];switch(t){case p:return function(){return new e(this,t)};case y:return function(){return new e(this,t)}}return function(){return new e(this,t)}},I=n+" Iterator",S=_==y,E=!1,T=t.prototype,j=T[h]||T[v]||_&&T[_],M=j||P(_),F=_?S?P("entries"):M:void 0,C="Array"==n?T.entries||j:j;if(C&&(O=l(C.call(new t)),O!==Object.prototype&&(f(O,I,!0),r||a(O,h)||u(O,h,m))),S&&j&&j.name!==y&&(E=!0,M=function(){return j.call(this)}),r&&!w||!d&&!E&&T[h]||u(T,h,M),c[n]=M,c[I]=m,_)if(b={values:S?M:P(y),keys:g?M:P(p),entries:F},w)for(x in b)x in T||o(T,x,b[x]);else i(i.P+i.F*(d||E),n,b);return b}},function(t,n,e){var r=e(4)("iterator"),i=!1;try{var o=[7][r]();o["return"]=function(){i=!0},Array.from(o,function(){throw 2})}catch(u){}t.exports=function(t,n){if(!n&&!i)return!1;var e=!1;try{var o=[7],u=o[r]();u.next=function(){return{done:e=!0}},o[r]=function(){return u},t(o)}catch(a){}return e}},function(t,n,e){var r=e(12),i=e(87).f,o={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(t){try{return i(t)}catch(n){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==o.call(t)?a(t):i(r(t))}},function(t,n,e){var r=e(89),i=e(40).concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,i)}},function(t,n,e){var r=e(15),i=e(29),o=e(46)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t),r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,n,e){var r=e(15),i=e(12),o=e(136)(!1),u=e(46)("IE_PROTO");t.exports=function(t,n){var e,a=i(t),c=0,s=[];for(e in a)e!=u&&r(a,e)&&s.push(e);for(;n.length>c;)r(a,e=n[c++])&&(~o(s,e)||s.push(e));return s}},function(t,n,e){t.exports=e(10)},function(t,n,e){var r,i,o,u=e(14),a=e(140),c=e(80),s=e(25),f=e(3),l=f.process,h=f.setImmediate,d=f.clearImmediate,v=f.MessageChannel,p=0,y={},m="onreadystatechange",k=function(){var t=+this;if(y.hasOwnProperty(t)){var n=y[t];delete y[t],n()}},_=function(t){k.call(t.data)};h&&d||(h=function(t){for(var n=[],e=1;arguments.length>e;)n.push(arguments[e++]);return y[++p]=function(){a("function"==typeof t?t:Function(t),n)},r(p),p},d=function(t){delete y[t]},"process"==e(20)(l)?r=function(t){l.nextTick(u(k,t,1))}:v?(i=new v,o=i.port2,i.port1.onmessage=_,r=u(o.postMessage,o,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",_,!1)):r=m in s("script")?function(t){c.appendChild(s("script"))[m]=function(){c.removeChild(this),k.call(t)}}:function(t){setTimeout(u(k,t,1),0)}),t.exports={set:h,clear:d}},function(t,n,e){var r=e(8);r(r.S+r.F*!e(5),"Object",{defineProperty:e(6).f})},61,function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(101);e.d(n,"a",function(){return s});var c=e(168),s=function(){function t(n){i()(this,t),this.functionLookupTable=n}return u()(t,[{key:"spawn",value:function(){if(!window.Worker)throw new Error("Missing Web Worker support");var t=new c,n=new a.a(t,this.functionLookupTable);return n.initialize(),n}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(113),c=e(16);e.d(n,"a",function(){return s});var s=function(){function t(){i()(this,t),this.ids=new a.a,this.definitions=new a.a,this.lastId=0}return u()(t,[{key:"getOrSetId",value:function(t){if(e.i(c.b)(t))return t;var n=t.toString(),r=this.ids.get(n);return"undefined"==typeof r&&(r=e.i(c.a)("dynamic",++this.lastId),this.initDefinition(t,r)),r}},{key:"getDefinition",value:function(t){return this.definitions.get(t.identifier)}},{key:"initDefinition",value:function(t,n){var e=t.toString(),r=e.substring(e.indexOf("function")+9,e.indexOf("(")).trim(),i=e.substring(e.indexOf("(")+1,e.indexOf(")")).split(","),o=e.substring(e.indexOf("{")+1,e.lastIndexOf("}")).trim(),u={argumentNames:i.map(function(t){return t.trim()}),body:o,id:n,name:"anonymous"!==r?r:void 0};this.ids.set(e,n),this.definitions.set(n.identifier,u)}}]),t}()},function(t,n,e){"use strict";function r(t){function n(n){if(n){if(n.hasOwnProperty("threadPool")&&"undefined"==typeof n.threadPool)throw new Error("The thread pool is mandatory and cannot be unset");if(n.hasOwnProperty("maxConcurrencyLevel")&&"number"!=typeof n.maxConcurrencyLevel)throw new Error("The maxConcurrencyLevel is mandatory and has to be a number")}return o()({},t,n)}return{defaultOptions:function(e){return e?void(t=n(e)):o()({},t)},from:function(t,r){return e.i(s.a)(new u.a(t),n(r))},range:function(t,r,i,o){var u=a.a.create(t,r,i);return e.i(s.a)(u,n(o))},times:function(t,r,i,o){return i?e.i(s.a)(c.a.create(t,r),n(o),i):e.i(s.a)(c.a.create(t,r),n(o))},schedule:function(n){for(var r,i=arguments.length,o=Array(i>1?i-1:0),u=1;u<i;u++)o[u-1]=arguments[u];if(e.i(f.b)(n)){var a;return(a=t.threadPool).schedule.apply(a,[n].concat(o))}return(r=t.threadPool).schedule.apply(r,[n].concat(o))}}}var i=e(71),o=e.n(i),u=e(58),a=e(106),c=e(107),s=e(103),f=e(16);e.d(n,"a",function(){return r})},function(t,n,e){"use strict";var r=e(37),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(74),f=e.n(s),l=e(73),h=e.n(l),d=e(109);e.d(n,"a",function(){return v});var v=function(t){function n(){return u()(this,n),f()(this,(n.__proto__||i()(n)).apply(this,arguments))}return h()(n,t),c()(n,[{key:"getScheduling",value:function(t,n){var e=t/(4*n.maxConcurrencyLevel);return n.minValuesPerTask&&(e=Math.min(Math.max(e,n.minValuesPerTask),t)),n.maxValuesPerTask&&(e=Math.min(e,n.maxValuesPerTask)),{numberOfTasks:0===e?0:Math.round(t/e),valuesPerTask:Math.ceil(e)}}}]),n}(d.a)},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(112),c=e(9);e.d(n,"a",function(){return s});var s=function(){function t(n,e,r){i()(this,t),this.workerThreadFactory=n,this.functionCallSerializer=e,this.workers=[],this.idleWorkers=[],this.queue=[],this.lastTaskId=-1,this.concurrencyLimit=r.maxConcurrencyLevel}return u()(t,[{key:"schedule",value:function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];var i=this.functionCallSerializer.serializeFunctionCall(c.a.createUnchecked.apply(c.a,[t].concat(e))),o={main:i,usedFunctionIds:[i.functionId]};return this.scheduleTask(o)}},{key:"scheduleTask",value:function(t){var n=this;t.id=++this.lastTaskId;var e=new a.a(t);return e.always(function(){return n._releaseWorker(e)}),this.queue.unshift(e),this._schedulePendingTasks(),e}},{key:"getFunctionSerializer",value:function(){return this.functionCallSerializer}},{key:"_releaseWorker",value:function(t){var n=t.releaseWorker();this.idleWorkers.push(n),this._schedulePendingTasks()}},{key:"_schedulePendingTasks",value:function(){for(;this.queue.length;){var t=void 0;if(0===this.idleWorkers.length&&this.workers.length<this.concurrencyLimit?(t=this.workerThreadFactory.spawn(),this.workers.push(t)):this.idleWorkers.length>0&&(t=this.idleWorkers.pop()),!t)return;var n=this.queue.pop();n.runOn(t)}}}]),t}()},function(t,n,e){"use strict";var r=e(96),i=e(98),o=e(97),u=e(95),a=e(34),c=e(94),s=e(54);e.d(n,"IParallel",function(){return s.a}),e.d(n,"ITaskDefinition",function(){return s.b}),e.d(n,"ITask",function(){return s.c}),e.d(n,"IFunctionDefinition",function(){return s.d}),e.d(n,"IFunctionId",function(){return s.e}),e.d(n,"isFunctionId",function(){return s.f}),e.d(n,"FunctionCall",function(){return s.g}),e.d(n,"ISerializedFunctionCall",function(){return s.h}),e.d(n,"isSerializedFunctionCall",function(){return s.i}),e.d(n,"FunctionCallSerializer",function(){return s.j}),e.d(n,"IThreadPool",function(){return s.k}),e.d(n,"IParallelChain",function(){return s.l}),e.d(n,"IParallelTaskEnvironment",function(){return s.m}),e.d(n,"IParallelEnvironment",function(){return s.n}),e.d(n,"IParallelJob",function(){return s.o}),e.d(n,"IParallelOptions",function(){return s.p}),e.d(n,"IDefaultInitializedParallelOptions",function(){return s.q}),e.d(n,"IParallelJobScheduler",function(){return s.r}),e.d(n,"IParallelOperation",function(){return s.s}),e.d(n,"ISerializedParallelOperation",function(){return s.t}),e.d(n,"IParallelStream",function(){return s.u});var f=new u.a,l=window.navigator.hardwareConcurrency||4,h=new a.a(f),d=new i.a(new c.a(f),h,{maxConcurrencyLevel:l}),v=e.i(r.a)({maxConcurrencyLevel:l,scheduler:new o.a,threadPool:d});n["default"]=v},function(t,n,e){"use strict";var r=e(17),i=e.n(r),o=e(37),u=e.n(o),a=e(74),c=e.n(a),s=e(121),f=e.n(s),l=e(73),h=e.n(l),d=e(0),v=e.n(d),p=e(1),y=e.n(p),m=e(69);e.d(n,"a",function(){return k}),e.d(n,"b",function(){return _});var k=function(){function t(n){v()(this,t),this.name=n}return y()(t,[{key:"onMessage",value:function(t){throw new Error("Browser worker thread in state '"+this.name+"' cannot handle the received message ("+t.data.type+").")}},{key:"onError",value:function(t){console.error("Processing error on worker slave",t.error)}}]),t}(),_=function(t){function n(t,e,r){v()(this,n);var i=c()(this,(n.__proto__||u()(n)).call(this,"executing"));return i.callback=t,i.functionRegistry=e,i.worker=r,i}return h()(n,t),y()(n,[{key:"onMessage",value:function(t){var r=t.data;e.i(m.a)(r)?this.handleFunctionRequest(r):e.i(m.b)(r)?this.callback(void 0,r.result):e.i(m.c)(r)?this.callback(r.error,void 0):f()(n.prototype.__proto__||u()(n.prototype),"onMessage",this).call(this,t)}},{key:"onError",value:function(t){this.callback(t.error,void 0)}},{key:"handleFunctionRequest",value:function(t){var n=[],e=[],r=!0,o=!1,u=void 0;try{for(var a,c=i()(t.functionIds);!(r=(a=c.next()).done);r=!0){var s=a.value,f=this.functionRegistry.getDefinition(s);f?e.push(f):n.push(s)}}catch(l){o=!0,u=l}finally{try{!r&&c["return"]&&c["return"]()}finally{if(o)throw u}}this.worker.postMessage(m.d.apply(void 0,[e].concat(n)))}}]),n}(k)},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(69),c=e(100);e.d(n,"a",function(){return f});var s=0,f=function(){function t(n,e){i()(this,t),this.worker=n,this.functionLookupTable=e,this.id=++s,this.state=new c.a("default"),this.stopped=!1;var r=this;this.worker.addEventListener("message",function(){r.onWorkerMessage.apply(r,arguments)}),this.worker.addEventListener("error",function(){r.onError.apply(r,arguments)})}return u()(t,[{key:"initialize",value:function(){if("default"!==this.state.name)throw new Error("The browser worker thread can only be initialized if in state default but actual state is '"+this.state.name+"'.");this.sendMessage(e.i(a.e)(this.id)),this.state=new c.a("idle")}},{key:"run",value:function(t,n){var r=this;if("idle"!==this.state.name)throw new Error("The browser worker thread can only execute a new task if in state idle but actual state is '"+this.state.name+"'.");this.sendMessage(e.i(a.f)(t));var i=function(t,e){r.stopped?r.state=new c.a("stopped"):r.state=new c.a("idle"),n(t,e)};this.state=new c.b(i,this.functionLookupTable,this.worker)}},{key:"stop",value:function(){this.stopped||(this.sendMessage(e.i(a.g)()),this.stopped=!0,"executing"!==this.state.name&&(this.state=new c.a("stopped")))}},{key:"toString",value:function(){return"BrowserWorkerThread { id: "+this.id+", state: "+this.state.name}},{key:"onWorkerMessage",value:function(t){this.state.onMessage(t)}},{key:"onError",value:function(t){this.state.onError(t),this.state=new c.a("errored")}},{key:"sendMessage",value:function(t){this.worker.postMessage(t)}}]),t}()},function(t,n,e){"use strict";var r=e(76),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(57),f=e(58),l=e(36),h=e(23);e.d(n,"a",function(){return d});var d=function(){function t(n,e,r){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[];u()(this,t),this.previousStream=n,this.options=e,this.environment=r,this.operations=i}return c()(t,[{key:"resolve",value:function n(){var t=this,e=void 0,n=void 0,r=void 0,i=new h.a(function(t,i,o){e=t,n=i,r=o});return this.previousStream.then(function(i){var o=t.options.scheduler.schedule({environment:t.environment,generator:new f.a(i),operations:t.operations,options:t.options}),u=h.a.fromTasks(o,l.a);u.subscribe(e,r,n)},r),new s.a(i,this.options,this.environment)}},{key:"chainOperation",value:function(n){return new t(this.previousStream,this.options,this.environment,[].concat(i()(this.operations),[n]))}},{key:"addEnvironment",value:function(n){return new t(this.previousStream,this.options,this.environment.add(n),this.operations)}}]),t}()},function(t,n,e){"use strict";function r(t,n,e){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],a=void 0;e instanceof Array?(a=void 0,r=e):a=e;var c=new o.a(new i.a(t,n,u.a.of(),r));return a?c.inEnvironment(a):c}var i=e(105),o=e(104),u=e(108);n.a=r},function(t,n,e){"use strict";var r=e(17),i=e.n(r),o=e(75),u=e.n(o),a=e(0),c=e.n(a),s=e(1),f=e.n(s),l=e(19),h=e(9),d=e(23);e.d(n,"a",function(){return v});var v=function(){function t(n){c()(this,t),this.state=n}return f()(t,[{key:"inEnvironment",value:function(n){var e=void 0;if("function"==typeof n){for(var r=arguments.length,i=Array(r>1?r-1:0),o=1;o<r;o++)i[o-1]=arguments[o];e=h.a.createUnchecked.apply(h.a,[n].concat(i))}else e=n;return new t(this.state.addEnvironment(e))}},{key:"map",value:function(t){return this._chain(h.a.createUnchecked(l.a.MAP),h.a.createUnchecked(t))}},{key:"reduce",value:function(t,n,e){var r=e||n,o=this._chain(h.a.createUnchecked(l.a.REDUCE,t),h.a.createUnchecked(n)).resolveChain();return d.a.transform(o,function(n){if(0===n.length)return t;var e=u()(n),o=e[0],a=e.slice(1),c=o,s=!0,f=!1,l=void 0;try{for(var h,d=i()(a);!(s=(h=d.next()).done);s=!0){var v=h.value;c=r(c,v)}}catch(p){f=!0,l=p}finally{try{!s&&d["return"]&&d["return"]()}finally{if(f)throw l}}return c})}},{key:"filter",value:function(t){return this._chain(h.a.createUnchecked(l.a.FILTER),h.a.createUnchecked(t))}},{key:"subscribe",value:function(t,n,e){return this.resolveChain().subscribe(t,n,e)}},{key:"then",value:function(t,n){return this.resolveChain().then(t,n)}},{key:"catch",value:function(t){return this.resolveChain()["catch"](t)}},{key:"resolveChain",value:function(){var t=this.state=this.state.resolve();return t.stream}},{key:"_chain",value:function(n,e){
var r={iterator:n,iteratee:e};return new t(this.state.chainOperation(r))}}]),t}()},function(t,n,e){"use strict";var r=e(76),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(57),f=e(23),l=e(36);e.d(n,"a",function(){return h});var h=function(){function t(n,e,r,i){u()(this,t),this.generator=n,this.options=e,this.environment=r,this.operations=i}return c()(t,[{key:"resolve",value:function(){var t=this.options.scheduler.schedule({environment:this.environment,generator:this.generator,operations:this.operations,options:this.options});return new s.a(f.a.fromTasks(t,l.a),this.options,this.environment)}},{key:"chainOperation",value:function(n){return new t(this.generator,this.options,this.environment,[].concat(i()(this.operations),[n]))}},{key:"addEnvironment",value:function(n){return new t(this.generator,this.options,this.environment.add(n),this.operations)}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(19),c=e(9);e.d(n,"a",function(){return s});var s=function(){function t(n,e,r){i()(this,t),this.start=n,this.end=e,this.step=r}return u()(t,[{key:"serializeSlice",value:function(t,n,e){var r=n*this.step,i=this.start+t*r,o=Math.min(i+r,this.end);return e.serializeFunctionCall(c.a.createUnchecked(a.a.RANGE,i,o,this.step))}},{key:"length",get:function(){return Math.ceil((this.end-this.start)/this.step)}}],[{key:"create",value:function(n,e,r){return"undefined"==typeof e&&(e=n,n=0),"undefined"==typeof r&&(r=e<n?-1:1),new t(n,e,r)}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(19),c=e(9),s=e(16);e.d(n,"a",function(){return f});var f=function(){function t(n,e){i()(this,t),this.times=n,this.iteratee=e}return u()(t,[{key:"serializeSlice",value:function(t,n,e){var r=t*n,i=Math.min(r+n,this.times),o=e.serializeFunctionCall(this.iteratee);return e.serializeFunctionCall(c.a.create(a.a.TIMES,r,i,o))}},{key:"length",get:function(){return this.times}}],[{key:"create",value:function(n,r){var i=void 0;return i=e.i(s.b)(r)||"function"==typeof r?c.a.createUnchecked(r):c.a.create(a.a.IDENTITY,r),new t(n,i)}}]),t}()},function(t,n,e){"use strict";var r=e(71),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(9);e.d(n,"a",function(){return f});var f=function(){function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];u()(this,t),this.environments=n}return c()(t,[{key:"add",value:function(n){var e=this.environments.slice();return n instanceof s.a||!(this.environments.length>0)||this.environments[this.environments.length-1]instanceof s.a?e.push(n):e[e.length-1]=i()({},e[e.length-1],n),new t(e)}},{key:"toJSON",value:function(t){return this.environments.map(function(n){return n instanceof s.a?t.serializeFunctionCall(n):n})}}],[{key:"of",value:function(n){var e=t.EMPTY;return n?e.add(n):e}}]),t}();f.EMPTY=new f},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(9),c=e(19),s=e(36),f=e(35);e.d(n,"a",function(){return l});var l=function(){function t(){i()(this,t)}return u()(t,[{key:"schedule",value:function(t){var n=this.getTaskDefinitions(t);return n.map(function(n){return t.options.threadPool.scheduleTask(n)})}},{key:"getTaskDefinitions",value:function(t){var n=this.getScheduling(t.generator.length,t.options),r=t.options.threadPool.getFunctionSerializer(),i=t.environment.toJSON(r),o=this.serializeOperations(t.operations,r),u=[c.a.PARALLEL_JOB_EXECUTOR].concat(e.i(s.a)(o.map(function(t){return[t.iteratee.functionId,t.iterator.functionId]})));i.forEach(function(t){e.i(f.a)(t)&&u.push(t.functionId)});for(var l=[],h=0;h<n.numberOfTasks;++h){var d=t.generator.serializeSlice(h,n.valuesPerTask,r),v={environments:i,generator:d,operations:o,taskIndex:h,valuesPerTask:n.valuesPerTask},p={main:r.serializeFunctionCall(a.a.createUnchecked(c.a.PARALLEL_JOB_EXECUTOR,v)),taskIndex:h,usedFunctionIds:[d.functionId].concat(u),valuesPerTask:n.valuesPerTask};l.push(p)}return l}},{key:"serializeOperations",value:function(t,n){return t.map(function(t){return{iteratee:n.serializeFunctionCall(t.iteratee),iterator:n.serializeFunctionCall(t.iterator)}})}}]),t}()},function(t,n,e){"use strict";var r=e(38),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a);e.d(n,"a",function(){return s});var s=function(){function t(n){u()(this,t),this.promise=i.a.resolve(n)}return c()(t,[{key:"subscribe",value:function(t,n,e){return(e||n)&&this.promise.then(e,n),this}},{key:"then",value:function(t,n){return this.promise.then(t,n)}},{key:"catch",value:function(t){return this.promise["catch"](t)}}]),t}()},function(t,n,e){"use strict";var r=e(17),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(23);e.d(n,"a",function(){return f});var f=function(){function t(n,e){var r=this;u()(this,t),this.failed=!1,this.tasks=n,this.joiner=e,this.subResults=new Array(n.length),this.pending=n.length,this.innerStream=new s.a(function(t,n,e){r.next=t,r.resolve=n,r.reject=e});var o=!0,a=!1,c=void 0;try{for(var f,l=function(){var t=f.value;t.then(function(n){return r._taskCompleted(n,t.definition)},function(t){return r._taskFailed(t)})},h=i()(n);!(o=(f=h.next()).done);o=!0)l()}catch(d){a=!0,c=d}finally{try{!o&&h["return"]&&h["return"]()}finally{if(a)throw c}}}return c()(t,[{key:"subscribe",value:function(t,n,e){return this.innerStream.subscribe(t,n,e),this}},{key:"then",value:function(t,n){return this.innerStream.then(t,n)}},{key:"catch",value:function(t){return this.innerStream["catch"](t)}},{key:"_taskCompleted",value:function(t,n){if(0===this.pending)throw new Error("Stream already resolved but taskCompleted called one more time");--this.pending,this.subResults[n.taskIndex]=t,this.failed||(this.next(t,n.taskIndex,n.valuesPerTask),0===this.pending&&this.resolve(this.joiner.apply(void 0,[this.subResults])))}},{key:"_taskFailed",value:function(t){if(this.failed!==!0){this.failed=!0;for(var n=0;n<this.tasks.length;++n)"undefined"==typeof this.subResults[n]&&this.tasks[n].cancel();this.reject(t)}}}]),t}()},function(t,n,e){"use strict";var r=e(38),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a);e.d(n,"a",function(){return s});var s=function(){function t(n){var e=this;u()(this,t),this.definition=n,this.isCancellationRequested=!1,this.isCanceled=!1,this.promise=new i.a(function(t,n){e.resolve=t,e.reject=n})}return c()(t,[{key:"runOn",value:function(t){var n=this;if(this.worker=t,this.isCancellationRequested)this._taskCompleted(void 0);else{var e=function(t,e){t?n.reject(t):n._taskCompleted(e)};this.worker.run(this.definition,e)}}},{key:"releaseWorker",value:function(){if(!this.worker)throw new Error("Cannot release a worker task that has no assigned worker thread.");var t=this.worker;return this.worker=void 0,t}},{key:"then",value:function(t,n){return n?this.promise.then(t,n):this.promise.then(t)}},{key:"catch",value:function(t){return this.promise["catch"](t)}},{key:"cancel",value:function(){this.isCancellationRequested=!0}},{key:"always",value:function(t){this.promise.then(t,t)}},{key:"_taskCompleted",value:function(t){this.isCancellationRequested?(this.isCanceled=!0,this.reject("Task has been canceled")):this.resolve(t)}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o);e.d(n,"a",function(){return a});var a=function(){function t(){i()(this,t),this.data={}}return u()(t,[{key:"get",value:function(t){var n=this.toInternalKey(t);return this.has(t)?this.data[n]:void 0}},{key:"has",value:function(t){return this.hasOwnProperty.call(this.data,this.toInternalKey(t))}},{key:"set",value:function(t,n){this.data[this.toInternalKey(t)]=n}},{key:"clear",value:function(){this.data={}}},{key:"toInternalKey",value:function(t){return"@"+t}}]),t}()},function(t,n,e){t.exports={"default":e(124),__esModule:!0}},function(t,n,e){t.exports={"default":e(126),__esModule:!0}},function(t,n,e){t.exports={"default":e(127),__esModule:!0}},function(t,n,e){t.exports={"default":e(128),__esModule:!0}},function(t,n,e){t.exports={"default":e(130),__esModule:!0}},function(t,n,e){t.exports={"default":e(132),__esModule:!0}},function(t,n,e){t.exports={"default":e(133),__esModule:!0}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(37),o=r(i),u=e(116),a=r(u);n["default"]=function c(t,n,e){null===t&&(t=Function.prototype);var r=(0,a["default"])(t,n);if(void 0===r){var i=(0,o["default"])(t);return null===i?void 0:c(i,n,e)}if("value"in r)return r.value;var u=r.get;if(void 0!==u)return u.call(e)}},function(t,n,e){e(32),e(156),t.exports=e(2).Array.from},function(t,n,e){e(53),e(32),t.exports=e(155)},function(t,n,e){var r=e(2),i=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return i.stringify.apply(i,arguments)}},function(t,n,e){e(158),t.exports=e(2).Object.assign},function(t,n,e){e(159);var r=e(2).Object;t.exports=function(t,n){return r.create(t,n)}},function(t,n,e){e(160);var r=e(2).Object;t.exports=function(t,n){return r.getOwnPropertyDescriptor(t,n)}},function(t,n,e){e(161);var r=e(2).Object;t.exports=function(t){return r.getOwnPropertyNames(t)}},function(t,n,e){e(162),t.exports=e(2).Object.getPrototypeOf},function(t,n,e){e(163),t.exports=e(2).Object.setPrototypeOf},function(t,n,e){e(93),e(32),e(53),e(164),t.exports=e(2).Promise},function(t,n,e){e(165),e(93),e(166),e(167),t.exports=e(2).Symbol},function(t,n,e){e(32),e(53),t.exports=e(51).f("iterator")},function(t,n){t.exports=function(){}},function(t,n){t.exports=function(t,n,e,r){if(!(t instanceof n)||void 0!==r&&r in t)throw TypeError(e+": incorrect invocation!");return t}},function(t,n,e){var r=e(12),i=e(49),o=e(154);t.exports=function(t){return function(n,e,u){var a,c=r(n),s=i(c.length),f=o(u,s);if(t&&e!=e){for(;s>f;)if(a=c[f++],a!=a)return!0}else for(;s>f;f++)if((t||f in c)&&c[f]===e)return t||f||0;return!t&&-1}}},function(t,n,e){"use strict";var r=e(6),i=e(18);t.exports=function(t,n,e){n in t?r.f(t,n,i(0,e)):t[n]=e}},function(t,n,e){var r=e(22),i=e(44),o=e(27);t.exports=function(t){var n=r(t),e=i.f;if(e)for(var u,a=e(t),c=o.f,s=0;a.length>s;)c.call(t,u=a[s++])&&n.push(u);return n}},function(t,n,e){var r=e(14),i=e(83),o=e(82),u=e(7),a=e(49),c=e(52),s={},f={},n=t.exports=function(t,n,e,l,h){var d,v,p,y,m=h?function(){return t}:c(t),k=r(e,l,n?2:1),_=0;if("function"!=typeof m)throw TypeError(t+" is not iterable!");if(o(m)){for(d=a(t.length);d>_;_++)if(y=n?k(u(v=t[_])[0],v[1]):k(t[_]),y===s||y===f)return y}else for(p=m.call(t);!(v=p.next()).done;)if(y=i(p,k,v.value,n),y===s||y===f)return y};n.BREAK=s,n.RETURN=f},function(t,n){t.exports=function(t,n,e){var r=void 0===e;switch(n.length){case 0:return r?t():t.call(e);case 1:return r?t(n[0]):t.call(e,n[0]);case 2:return r?t(n[0],n[1]):t.call(e,n[0],n[1]);case 3:return r?t(n[0],n[1],n[2]):t.call(e,n[0],n[1],n[2]);case 4:return r?t(n[0],n[1],n[2],n[3]):t.call(e,n[0],n[1],n[2],n[3])}return t.apply(e,n)}},function(t,n,e){var r=e(20);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,n,e){"use strict";var r=e(42),i=e(18),o=e(28),u={};e(10)(u,e(4)("iterator"),function(){return this}),t.exports=function(t,n,e){t.prototype=r(u,{next:i(1,e)}),o(t,n+" Iterator")}},function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},function(t,n,e){var r=e(22),i=e(12);t.exports=function(t,n){for(var e,o=i(t),u=r(o),a=u.length,c=0;a>c;)if(o[e=u[c++]]===n)return e}},function(t,n,e){var r=e(31)("meta"),i=e(11),o=e(15),u=e(6).f,a=0,c=Object.isExtensible||function(){return!0},s=!e(13)(function(){return c(Object.preventExtensions({}))}),f=function(t){u(t,r,{value:{i:"O"+ ++a,w:{}}})},l=function(t,n){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,r)){if(!c(t))return"F";if(!n)return"E";f(t)}return t[r].i},h=function(t,n){if(!o(t,r)){if(!c(t))return!0;if(!n)return!1;f(t)}return t[r].w},d=function(t){return s&&v.NEED&&c(t)&&!o(t,r)&&f(t),t},v=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:h,onFreeze:d}},function(t,n,e){var r=e(3),i=e(91).set,o=r.MutationObserver||r.WebKitMutationObserver,u=r.process,a=r.Promise,c="process"==e(20)(u);t.exports=function(){var t,n,e,s=function(){var r,i;for(c&&(r=u.domain)&&r.exit();t;){i=t.fn,t=t.next;try{i()}catch(o){throw t?e():n=void 0,o}}n=void 0,r&&r.enter()};if(c)e=function(){u.nextTick(s)};else if(o){var f=!0,l=document.createTextNode("");new o(s).observe(l,{characterData:!0}),e=function(){l.data=f=!f}}else if(a&&a.resolve){var h=a.resolve();e=function(){h.then(s)}}else e=function(){i.call(r,s)};return function(r){var i={fn:r,next:void 0};n&&(n.next=i),t||(t=i,e()),n=i}}},function(t,n,e){"use strict";var r=e(22),i=e(44),o=e(27),u=e(29),a=e(81),c=Object.assign;t.exports=!c||e(13)(function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach(function(t){n[t]=t}),7!=c({},t)[e]||Object.keys(c({},n)).join("")!=r})?function(t,n){for(var e=u(t),c=arguments.length,s=1,f=i.f,l=o.f;c>s;)for(var h,d=a(arguments[s++]),v=f?r(d).concat(f(d)):r(d),p=v.length,y=0;p>y;)l.call(d,h=v[y++])&&(e[h]=d[h]);return e}:c},function(t,n,e){var r=e(6),i=e(7),o=e(22);t.exports=e(5)?Object.defineProperties:function(t,n){i(t);for(var e,u=o(n),a=u.length,c=0;a>c;)r.f(t,e=u[c++],n[e]);return t}},function(t,n,e){var r=e(10);t.exports=function(t,n,e){for(var i in n)e&&t[i]?t[i]=n[i]:r(t,i,n[i]);return t}},function(t,n,e){var r=e(11),i=e(7),o=function(t,n){if(i(t),!r(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,r){try{r=e(14)(Function.call,e(43).f(Object.prototype,"__proto__").set,2),r(t,[]),n=!(t instanceof Array)}catch(i){n=!0}return function(t,e){return o(t,e),n?t.__proto__=e:r(t,e),t}}({},!1):void 0),check:o}},function(t,n,e){"use strict";var r=e(3),i=e(2),o=e(6),u=e(5),a=e(4)("species");t.exports=function(t){var n="function"==typeof i[t]?i[t]:r[t];u&&n&&!n[a]&&o.f(n,a,{configurable:!0,get:function(){return this}})}},function(t,n,e){var r=e(7),i=e(24),o=e(4)("species");t.exports=function(t,n){var e,u=r(t).constructor;return void 0===u||void 0==(e=r(u)[o])?n:i(e)}},function(t,n,e){var r=e(48),i=e(39);t.exports=function(t){return function(n,e){var o,u,a=String(i(n)),c=r(e),s=a.length;return c<0||c>=s?t?"":void 0:(o=a.charCodeAt(c),o<55296||o>56319||c+1===s||(u=a.charCodeAt(c+1))<56320||u>57343?t?a.charAt(c):o:t?a.slice(c,c+2):(o-55296<<10)+(u-56320)+65536)}}},function(t,n,e){var r=e(48),i=Math.max,o=Math.min;t.exports=function(t,n){return t=r(t),t<0?i(t+n,0):o(t,n)}},function(t,n,e){var r=e(7),i=e(52);t.exports=e(2).getIterator=function(t){var n=i(t);if("function"!=typeof n)throw TypeError(t+" is not iterable!");return r(n.call(t))}},function(t,n,e){"use strict";var r=e(14),i=e(8),o=e(29),u=e(83),a=e(82),c=e(49),s=e(137),f=e(52);i(i.S+i.F*!e(85)(function(t){Array.from(t)}),"Array",{from:function(t){var n,e,i,l,h=o(t),d="function"==typeof this?this:Array,v=arguments.length,p=v>1?arguments[1]:void 0,y=void 0!==p,m=0,k=f(h);if(y&&(p=r(p,v>2?arguments[2]:void 0,2)),void 0==k||d==Array&&a(k))for(n=c(h.length),e=new d(n);n>m;m++)s(e,m,y?p(h[m],m):h[m]);else for(l=k.call(h),e=new d;!(i=l.next()).done;m++)s(e,m,y?u(l,p,[i.value,m],!0):i.value);return e.length=m,e}})},function(t,n,e){"use strict";var r=e(134),i=e(143),o=e(21),u=e(12);t.exports=e(84)(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,i(1)):"keys"==n?i(0,e):"values"==n?i(0,t[e]):i(0,[e,t[e]])},"values"),o.Arguments=o.Array,r("keys"),r("values"),r("entries")},function(t,n,e){var r=e(8);r(r.S+r.F,"Object",{assign:e(147)})},function(t,n,e){var r=e(8);r(r.S,"Object",{create:e(42)})},function(t,n,e){var r=e(12),i=e(43).f;e(45)("getOwnPropertyDescriptor",function(){return function(t,n){return i(r(t),n)}})},function(t,n,e){e(45)("getOwnPropertyNames",function(){return e(86).f})},function(t,n,e){var r=e(29),i=e(88);e(45)("getPrototypeOf",function(){return function(t){return i(r(t))}})},function(t,n,e){var r=e(8);r(r.S,"Object",{setPrototypeOf:e(150).set})},function(t,n,e){"use strict";var r,i,o,u=e(26),a=e(3),c=e(14),s=e(79),f=e(8),l=e(11),h=e(24),d=e(135),v=e(139),p=e(152),y=e(91).set,m=e(146)(),k="Promise",_=a.TypeError,g=a.process,w=a[k],g=a.process,b="process"==s(g),x=function(){},O=!!function(){try{var t=w.resolve(1),n=(t.constructor={})[e(4)("species")]=function(t){t(x,x)};return(b||"function"==typeof PromiseRejectionEvent)&&t.then(x)instanceof n}catch(r){}}(),P=function(t,n){return t===n||t===w&&n===o},I=function(t){var n;return!(!l(t)||"function"!=typeof(n=t.then))&&n},S=function(t){return P(w,t)?new E(t):new i(t)},E=i=function(t){var n,e;this.promise=new t(function(t,r){if(void 0!==n||void 0!==e)throw _("Bad Promise constructor");n=t,e=r}),this.resolve=h(n),this.reject=h(e)},T=function(t){try{t()}catch(n){return{error:n}}},j=function(t,n){if(!t._n){t._n=!0;var e=t._c;m(function(){for(var r=t._v,i=1==t._s,o=0,u=function(n){var e,o,u=i?n.ok:n.fail,a=n.resolve,c=n.reject,s=n.domain;try{u?(i||(2==t._h&&C(t),t._h=1),u===!0?e=r:(s&&s.enter(),e=u(r),s&&s.exit()),e===n.promise?c(_("Promise-chain cycle")):(o=I(e))?o.call(e,a,c):a(e)):c(r)}catch(f){c(f)}};e.length>o;)u(e[o++]);t._c=[],t._n=!1,n&&!t._h&&M(t)})}},M=function(t){y.call(a,function(){var n,e,r,i=t._v;if(F(t)&&(n=T(function(){b?g.emit("unhandledRejection",i,t):(e=a.onunhandledrejection)?e({promise:t,reason:i}):(r=a.console)&&r.error&&r.error("Unhandled promise rejection",i)}),t._h=b||F(t)?2:1),t._a=void 0,n)throw n.error})},F=function(t){if(1==t._h)return!1;for(var n,e=t._a||t._c,r=0;e.length>r;)if(n=e[r++],n.fail||!F(n.promise))return!1;return!0},C=function(t){y.call(a,function(){var n;b?g.emit("rejectionHandled",t):(n=a.onrejectionhandled)&&n({promise:t,reason:t._v})})},A=function(t){var n=this;n._d||(n._d=!0,n=n._w||n,n._v=t,n._s=2,n._a||(n._a=n._c.slice()),j(n,!0))},R=function(t){var n,e=this;if(!e._d){e._d=!0,e=e._w||e;try{if(e===t)throw _("Promise can't be resolved itself");(n=I(t))?m(function(){var r={_w:e,_d:!1};try{n.call(t,c(R,r,1),c(A,r,1))}catch(i){A.call(r,i)}}):(e._v=t,e._s=1,j(e,!1))}catch(r){A.call({_w:e,_d:!1},r)}}};O||(w=function(t){d(this,w,k,"_h"),h(t),r.call(this);try{t(c(R,this,1),c(A,this,1))}catch(n){A.call(this,n)}},r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},r.prototype=e(149)(w.prototype,{then:function(t,n){var e=S(p(this,w));return e.ok="function"!=typeof t||t,e.fail="function"==typeof n&&n,e.domain=b?g.domain:void 0,this._c.push(e),this._a&&this._a.push(e),this._s&&j(this,!1),e.promise},"catch":function(t){return this.then(void 0,t)}}),E=function(){var t=new r;this.promise=t,this.resolve=c(R,t,1),this.reject=c(A,t,1)}),f(f.G+f.W+f.F*!O,{Promise:w}),e(28)(w,k),e(151)(k),o=e(2)[k],f(f.S+f.F*!O,k,{reject:function(t){var n=S(this),e=n.reject;return e(t),n.promise}}),f(f.S+f.F*(u||!O),k,{resolve:function(t){if(t instanceof w&&P(t.constructor,this))return t;var n=S(this),e=n.resolve;return e(t),n.promise}}),f(f.S+f.F*!(O&&e(85)(function(t){w.all(t)["catch"](x)})),k,{all:function(t){var n=this,e=S(n),r=e.resolve,i=e.reject,o=T(function(){var e=[],o=0,u=1;v(t,!1,function(t){var a=o++,c=!1;e.push(void 0),u++,n.resolve(t).then(function(t){c||(c=!0,e[a]=t,--u||r(e))},i)}),--u||r(e)});return o&&i(o.error),e.promise},race:function(t){var n=this,e=S(n),r=e.reject,i=T(function(){v(t,!1,function(t){n.resolve(t).then(e.resolve,r)})});return i&&r(i.error),e.promise}})},function(t,n,e){"use strict";var r=e(3),i=e(15),o=e(5),u=e(8),a=e(90),c=e(145).KEY,s=e(13),f=e(47),l=e(28),h=e(31),d=e(4),v=e(51),p=e(50),y=e(144),m=e(138),k=e(141),_=e(7),g=e(12),w=e(30),b=e(18),x=e(42),O=e(86),P=e(43),I=e(6),S=e(22),E=P.f,T=I.f,j=O.f,M=r.Symbol,F=r.JSON,C=F&&F.stringify,A="prototype",R=d("_hidden"),z=d("toPrimitive"),L={}.propertyIsEnumerable,W=f("symbol-registry"),N=f("symbols"),D=f("op-symbols"),U=Object[A],J="function"==typeof M,q=r.QObject,B=!q||!q[A]||!q[A].findChild,K=o&&s(function(){return 7!=x(T({},"a",{get:function(){return T(this,"a",{value:7}).a}})).a})?function(t,n,e){var r=E(U,n);r&&delete U[n],T(t,n,e),r&&t!==U&&T(U,n,r)}:T,G=function(t){var n=N[t]=x(M[A]);return n._k=t,n},Y=J&&"symbol"==typeof M.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof M},H=function(t,n,e){return t===U&&H(D,n,e),_(t),n=w(n,!0),_(e),i(N,n)?(e.enumerable?(i(t,R)&&t[R][n]&&(t[R][n]=!1),e=x(e,{enumerable:b(0,!1)})):(i(t,R)||T(t,R,b(1,{})),t[R][n]=!0),K(t,n,e)):T(t,n,e)},V=function(t,n){_(t);for(var e,r=m(n=g(n)),i=0,o=r.length;o>i;)H(t,e=r[i++],n[e]);return t},X=function(t,n){return void 0===n?x(t):V(x(t),n)},Q=function(t){var n=L.call(this,t=w(t,!0));return!(this===U&&i(N,t)&&!i(D,t))&&(!(n||!i(this,t)||!i(N,t)||i(this,R)&&this[R][t])||n)},Z=function(t,n){if(t=g(t),n=w(n,!0),t!==U||!i(N,n)||i(D,n)){var e=E(t,n);return!e||!i(N,n)||i(t,R)&&t[R][n]||(e.enumerable=!0),e}},$=function(t){for(var n,e=j(g(t)),r=[],o=0;e.length>o;)i(N,n=e[o++])||n==R||n==c||r.push(n);return r},tt=function(t){for(var n,e=t===U,r=j(e?D:g(t)),o=[],u=0;r.length>u;)!i(N,n=r[u++])||e&&!i(U,n)||o.push(N[n]);return o};J||(M=function(){if(this instanceof M)throw TypeError("Symbol is not a constructor!");var t=h(arguments.length>0?arguments[0]:void 0),n=function(e){this===U&&n.call(D,e),i(this,R)&&i(this[R],t)&&(this[R][t]=!1),K(this,t,b(1,e))};return o&&B&&K(U,t,{configurable:!0,set:n}),G(t)},a(M[A],"toString",function(){return this._k}),P.f=Z,I.f=H,e(87).f=O.f=$,e(27).f=Q,e(44).f=tt,o&&!e(26)&&a(U,"propertyIsEnumerable",Q,!0),v.f=function(t){return G(d(t))}),u(u.G+u.W+u.F*!J,{Symbol:M});for(var nt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;nt.length>et;)d(nt[et++]);for(var nt=S(d.store),et=0;nt.length>et;)p(nt[et++]);u(u.S+u.F*!J,"Symbol",{"for":function(t){return i(W,t+="")?W[t]:W[t]=M(t)},keyFor:function(t){if(Y(t))return y(W,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){B=!0},useSimple:function(){B=!1}}),u(u.S+u.F*!J,"Object",{create:X,defineProperty:H,defineProperties:V,getOwnPropertyDescriptor:Z,getOwnPropertyNames:$,getOwnPropertySymbols:tt}),F&&u(u.S+u.F*(!J||s(function(){var t=M();return"[null]"!=C([t])||"{}"!=C({a:t})||"{}"!=C(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!Y(t)){for(var n,e,r=[t],i=1;arguments.length>i;)r.push(arguments[i++]);return n=r[1],"function"==typeof n&&(e=n),!e&&k(n)||(n=function(t,n){if(e&&(n=e.call(this,t,n)),!Y(n))return n}),r[1]=n,C.apply(F,r)}}}),M[A][z]||e(10)(M[A],z,M[A].valueOf),l(M,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(t,n,e){e(50)("asyncIterator")},function(t,n,e){e(50)("observable")},function(t,n,e){t.exports=function(){return new Worker(e.p+"worker-slave.parallel.js")}},,function(t,n,e){var r=e(99)["default"];t.exports=r}]))});
//# sourceMappingURL=browser-commonjs.parallel.js.map

/***/ },
/* 1 */
/* exports provided: knightTours, parallelKnightTours */
/* exports used: parallelKnightTours */
/*!*************************************!*\
  !*** ./src/dynamic/knights-tour.ts ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es__ = __webpack_require__(/*! parallel-es */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_parallel_es__);
/* unused harmony export knightTours */
/* harmony export (immutable) */ exports["a"] = parallelKnightTours;

function createEnvironment(boardSize) {
    var board = new Array(boardSize * boardSize);
    board.fill(0);
    return {
        board: board,
        boardSize: boardSize
    };
}
function knightTours(startPath, environment) {
    var moves = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }];
    var boardSize = environment.boardSize;
    var board = environment.board;
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
        var _stack = stack[stack.length - 1];
        var coordinate = _stack.coordinate;
        var n = _stack.n;

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
function parallelKnightTours(start, boardSize, options) {
    function successors(coordinate) {
        var moves = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }];
        var result = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = moves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var move = _step.value;

                var successor = { x: coordinate.x + move.x, y: coordinate.y + move.y };
                var accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize && successor.y < boardSize && (successor.x !== start.x || successor.y !== start.y) && successor.x !== coordinate.x && successor.y !== coordinate.y;
                if (accessible) {
                    result.push(successor);
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

        return result;
    }
    function computeStartFields() {
        var result = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = successors(start)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var directSuccessor = _step2.value;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = successors(directSuccessor)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var indirectSuccessor = _step3.value;

                        result.push([start, directSuccessor, indirectSuccessor]);
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

        return result;
    }
    var total = 0;
    var startTime = performance.now();
    return __WEBPACK_IMPORTED_MODULE_0_parallel_es___default.a.from(computeStartFields(), options).inEnvironment(createEnvironment, boardSize).map(knightTours).reduce(0, function (memo, count) {
        return memo + count;
    }).subscribe(function (subResults) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = subResults[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var tours = _step4.value;

                total += tours;
            }
            /* tslint:disable:no-console */
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

        console.log(total / (performance.now() - startTime) * 1000 + " results per second");
    });
}

/***/ },
/* 2 */
/* exports provided: createMandelOptions, computeMandelbrotLine, parallelMandelbrot, syncMandelbrot */
/* exports used: createMandelOptions, syncMandelbrot, parallelMandelbrot */
/*!***********************************!*\
  !*** ./src/dynamic/mandelbrot.ts ***!
  \***********************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es__ = __webpack_require__(/*! parallel-es */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_parallel_es__);
/* harmony export (immutable) */ exports["a"] = createMandelOptions;
/* unused harmony export computeMandelbrotLine */
/* harmony export (immutable) */ exports["c"] = parallelMandelbrot;
/* harmony export (immutable) */ exports["b"] = syncMandelbrot;

function createMandelOptions(imageWidth, imageHeight, iterations) {
    // X axis shows real numbers, y axis imaginary
    var min = { i: -1.2, real: -2.0 };
    var max = { i: 0, real: 1.0 };
    max.i = min.i + (max.real - min.real) * imageHeight / imageWidth;
    var scalingFactor = {
        i: (max.i - min.i) / (imageHeight - 1),
        real: (max.real - min.real) / (imageWidth - 1)
    };
    return {
        imageHeight: imageHeight,
        imageWidth: imageWidth,
        iterations: iterations,
        max: max,
        min: min,
        scalingFactor: scalingFactor
    };
}
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
        return { z: z, n: n };
    }
    var line = new Uint8ClampedArray(options.imageWidth * 4);
    var cI = options.max.i - y * options.scalingFactor.i;
    for (var x = 0; x < options.imageWidth; ++x) {
        var c = {
            i: cI,
            real: options.min.real + x * options.scalingFactor.real
        };

        var _calculateZ = calculateZ(c);

        var n = _calculateZ.n;

        var base = x * 4;
        /* tslint:disable:no-bitwise */
        line[base] = n & 0xFF;
        line[base + 1] = n & 0xFF00;
        line[base + 2] = n & 0xFF0000;
        line[base + 3] = 255;
    }
    return line;
}
function parallelMandelbrot(mandelbrotOptions, options) {
    return __WEBPACK_IMPORTED_MODULE_0_parallel_es___default.a.range(0, mandelbrotOptions.imageHeight, 1, options).inEnvironment(mandelbrotOptions).map(computeMandelbrotLine);
}
function syncMandelbrot(mandelbrotOptions, callback) {
    for (var y = 0; y < mandelbrotOptions.imageHeight; ++y) {
        var line = computeMandelbrotLine(y, mandelbrotOptions);
        callback(line, y);
    }
}

/***/ },
/* 3 */
/* exports provided: syncMonteCarlo, parallelMonteCarlo */
/* exports used: syncMonteCarlo, parallelMonteCarlo */
/*!************************************!*\
  !*** ./src/dynamic/monte-carlo.ts ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es__ = __webpack_require__(/*! parallel-es */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_parallel_es__);
/* harmony export (immutable) */ exports["a"] = syncMonteCarlo;
/* harmony export (immutable) */ exports["b"] = parallelMonteCarlo;

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
                indices[relativeYear] = Math.round(currentPortfolioValue);
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
    for (var i = 0; i < projects.length; ++i) {
        var project = projects[i];
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
        for (var i = 0; i < projectsSameYear.length; ++i) {
            var otherProject = projectsSameYear[i];
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
function syncMonteCarlo(options) {
    var environment = createMonteCarloEnvironment(initializeOptions(options));
    var projects = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = options.projects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var project = _step.value;

            projects.push(calculateProject(project, environment));
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

    return projects;
}
function parallelMonteCarlo(userOptions) {
    var options = initializeOptions(userOptions);
    return __WEBPACK_IMPORTED_MODULE_0_parallel_es___default.a.from(options.projects, { minValuesPerTask: 2 }).inEnvironment(createMonteCarloEnvironment, options).map(calculateProject);
}

/***/ },
/* 4 */
/* exports provided: knightTours, syncKnightTours, parallelKnightTours */
/* exports used: parallelKnightTours, syncKnightTours */
/*!****************************************!*\
  !*** ./src/transpiled/knights-tour.ts ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es__ = __webpack_require__(/*! parallel-es */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_parallel_es__);
/* unused harmony export knightTours */
/* harmony export (immutable) */ exports["b"] = syncKnightTours;
/* harmony export (immutable) */ exports["a"] = parallelKnightTours;

function createEnvironment(boardSize) {
    var board = new Array(boardSize * boardSize);
    board.fill(0);
    return {
        board: board,
        boardSize: boardSize
    };
}
function knightTours(startPath, environment) {
    var moves = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }];
    var boardSize = environment.boardSize;
    var board = environment.board;
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
        var _stack = stack[stack.length - 1];
        var coordinate = _stack.coordinate;
        var n = _stack.n;

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
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = moves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var move = _step.value;

                var successor = { x: coordinate.x + move.x, y: coordinate.y + move.y };
                // not outside of board and not yet accessed
                var accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize && successor.y < boardSize && board[successor.x * boardSize + successor.y] === 0;
                if (accessible) {
                    stack.push({ coordinate: successor, n: n + 1 });
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
    return results;
}
function syncKnightTours(start, boardSize) {
    var environment = createEnvironment(boardSize);
    return knightTours([start], environment);
}
function parallelKnightTours(start, boardSize, options) {
    function successors(coordinate) {
        var moves = [{ x: -2, y: -1 }, { x: -2, y: 1 }, { x: -1, y: -2 }, { x: -1, y: 2 }, { x: 1, y: -2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: 2, y: 1 }];
        var result = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = moves[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var move = _step2.value;

                var successor = { x: coordinate.x + move.x, y: coordinate.y + move.y };
                var accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize && successor.y < boardSize && (successor.x !== start.x || successor.y !== start.y) && successor.x !== coordinate.x && successor.y !== coordinate.y;
                if (accessible) {
                    result.push(successor);
                }
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

        return result;
    }
    function computeStartFields() {
        var result = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = successors(start)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var directSuccessor = _step3.value;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = successors(directSuccessor)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var indirectSuccessor = _step4.value;

                        result.push([start, directSuccessor, indirectSuccessor]);
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

        return result;
    }
    var total = 0;
    var startTime = performance.now();
    return __WEBPACK_IMPORTED_MODULE_0_parallel_es___default.a.from(computeStartFields(), options).inEnvironment({
        functionId: {
            identifier: "static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/knights-tour.ts/createEnvironment",
            _______isFunctionId: true
        },
        parameters: [boardSize],
        ______serializedFunctionCall: true
    }).map({
        identifier: "static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/knights-tour.ts/knightTours",
        _______isFunctionId: true
    }).reduce(0, {
        identifier: "static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/knights-tour.ts/_anonymous",
        _______isFunctionId: true
    }, function (memo, count) {
        return memo + count;
    }).subscribe(function (subResults) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = subResults[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var tours = _step5.value;

                total += tours;
            }
            /* tslint:disable:no-console */
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

        console.log(total / (performance.now() - startTime) * 1000 + " results per second");
    });
}

/***/ },
/* 5 */
/* exports provided: mandelbrot */
/* exports used: mandelbrot */
/*!**************************************!*\
  !*** ./src/transpiled/mandelbrot.ts ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es__ = __webpack_require__(/*! parallel-es */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_parallel_es__);
/* harmony export (immutable) */ exports["a"] = mandelbrot;

function mandelbrot(_ref, options) {
    var imageWidth = _ref.imageWidth;
    var imageHeight = _ref.imageHeight;
    var iterations = _ref.iterations;

    // X axis shows real numbers, y axis imaginary
    var min = { i: -1.2, real: -2.0 };
    var max = { i: 0, real: 1.0 };
    max.i = min.i + (max.real - min.real) * imageHeight / imageWidth;
    var scalingFactor = {
        i: (max.i - min.i) / (imageHeight - 1),
        real: (max.real - min.real) / (imageWidth - 1)
    };
    function calculateZ(c) {
        var z = { i: c.i, real: c.real };
        var n = 0;
        for (; n < iterations; ++n) {
            if (z.real * z.real + z.i * z.i > 4) {
                break;
            }
            // z ** 2 + c
            var zI = z.i;
            z.i = 2 * z.real * z.i + c.i;
            z.real = z.real * z.real - zI * zI + c.real;
        }
        return n;
    }

    function _environmentExtractor() {
        return {
            imageWidth: imageWidth,
            max: max,
            scalingFactor: scalingFactor,
            min: min,
            iterations: iterations
        };
    }

    return __WEBPACK_IMPORTED_MODULE_0_parallel_es___default.a.range(0, imageHeight, 1, options).inEnvironment(_environmentExtractor()).map({
        identifier: "static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/mandelbrot.ts/_anonymous",
        _______isFunctionId: true
    });
}

/***/ },
/* 6 */
/* exports provided: syncMonteCarlo, parallelMonteCarlo */
/* exports used: parallelMonteCarlo, syncMonteCarlo */
/*!***************************************!*\
  !*** ./src/transpiled/monte-carlo.ts ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es__ = __webpack_require__(/*! parallel-es */ 0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_parallel_es___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_parallel_es__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_simjs_random__ = __webpack_require__(/*! simjs-random */ 12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_simjs_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_simjs_random__);
/* harmony export (immutable) */ exports["b"] = syncMonteCarlo;
/* harmony export (immutable) */ exports["a"] = parallelMonteCarlo;


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
    function projectsToCashFlows(projectsByStartYear, numYears) {
        var cashFlows = [];
        for (var year = 0; year < numYears; ++year) {
            var projectsByThisYear = projectsByStartYear[year] || [];
            var cashFlow = -projectsByThisYear.reduce(function (memo, project) {
                return memo + project.totalAmount;
            }, 0);
            cashFlows.push(cashFlow);
        }
        return cashFlows;
    }
    function calculateNoInterestReferenceLine(cashFlows, investmentAmount, numYears) {
        var noInterestReferenceLine = [];
        var investmentAmountLeft = investmentAmount;
        for (var year = 0; year < numYears; ++year) {
            investmentAmountLeft = investmentAmountLeft + cashFlows[year];
            noInterestReferenceLine.push(investmentAmountLeft);
        }
        return noInterestReferenceLine;
    }
    function toAbsoluteIndices(indices, investmentAmount, cashFlows) {
        var currentPortfolioValue = investmentAmount;
        var previousYearIndex = 100;
        for (var relativeYear = 0; relativeYear < indices.length; ++relativeYear) {
            var currentYearIndex = indices[relativeYear];
            var cashFlowStartOfYear = relativeYear === 0 ? 0 : cashFlows[relativeYear - 1];
            // scale current value with performance gain according to index
            var performance = currentYearIndex / previousYearIndex;
            currentPortfolioValue = (currentPortfolioValue + cashFlowStartOfYear) * performance;
            indices[relativeYear] = Math.round(currentPortfolioValue);
            previousYearIndex = currentYearIndex;
        }
        return indices;
    }
    /**
     * Performs the monte carlo simulation for all years and num runs.
     * @param cashFlows the cash flows
     * @returns {number[][]} the simulated outcomes grouped by year
     */
    function simulateOutcomes(cashFlows, investmentAmount, _ref) {
        var numRuns = _ref.numRuns;
        var numYears = _ref.numYears;
        var volatility = _ref.volatility;
        var performance = _ref.performance;

        var result = new Array(numYears);
        for (var year = 0; year <= numYears; ++year) {
            result[year] = new Array(numRuns);
        }
        var random = new __WEBPACK_IMPORTED_MODULE_1_simjs_random___default.a(10);
        for (var run = 0; run < numRuns; run++) {
            var indices = [100];
            for (var i = 1; i <= numYears; i++) {
                var randomPerformance = 1 + random.normal(performance, volatility);
                indices.push(indices[i - 1] * randomPerformance);
            }
            // convert the relative values from above to absolute values.
            toAbsoluteIndices(indices, investmentAmount, cashFlows);
            for (var _year = 0; _year < indices.length; ++_year) {
                result[_year][run] = indices[_year];
            }
        }
        return result;
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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = projects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var project = _step.value;

            var arr = projectsByStartYear[project.startYear] = projectsByStartYear[project.startYear] || [];
            arr.push(project);
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

    var cashFlows = projectsToCashFlows(projectsByStartYear, options.numYears);
    var noInterestReferenceLine = calculateNoInterestReferenceLine(cashFlows, options.investmentAmount, options.numYears);
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
        simulatedValues: simulateOutcomes(cashFlows, options.investmentAmount, options)
    };
}
function groupForValue(value, groups) {
    return groups.find(function (group) {
        return (typeof group.from === "undefined" || group.from <= value) && (typeof group.to === "undefined" || group.to > value);
    });
}
function createGroups(requiredAmount, noInterestReference, liquidity) {
    return [{ description: "Ziel erreichbar", from: requiredAmount, name: "green", percentage: 0, separator: true }, { description: "mit Zusatzliquidität erreichbar", from: requiredAmount - liquidity, name: "yellow", percentage: 0, separator: true, to: requiredAmount }, { description: "nicht erreichbar", from: noInterestReference, name: "gray", percentage: 0, separator: false, to: requiredAmount - liquidity }, { description: "nicht erreichbar, mit Verlust", name: "red", percentage: 0, separator: false, to: noInterestReference }];
}
function calculateRequiredAmount(project, projectsByStartYear) {
    var amount = project.totalAmount;
    var projectsSameYear = projectsByStartYear[project.startYear];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = projectsSameYear[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var otherProject = _step2.value;

            if (otherProject === project) {
                break;
            }
            amount += otherProject.totalAmount;
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

    return amount;
}
function median(values) {
    var half = Math.floor(values.length / 2);
    if (values.length % 2) {
        return values[half];
    }
    return (values[half - 1] + values[half]) / 2.0;
}
function calculateProject(project, environment) {
    var NUMBER_OF_BUCKETS = 10;
    var requiredAmount = calculateRequiredAmount(project, environment.projectsByStartYear);
    var simulatedValuesThisYear = environment.simulatedValues[project.startYear];
    simulatedValuesThisYear.sort(function (a, b) {
        return a - b;
    });
    var groups = createGroups(requiredAmount, environment.noInterestReferenceLine[project.startYear], environment.liquidity);
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
function syncMonteCarlo(options) {
    var environment = createMonteCarloEnvironment(initializeOptions(options));
    var projects = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = options.projects[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var project = _step3.value;

            projects.push(calculateProject(project, environment));
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

    return projects;
}
function parallelMonteCarlo(userOptions) {
    var options = initializeOptions(userOptions);
    return __WEBPACK_IMPORTED_MODULE_0_parallel_es___default.a.from(options.projects, { minValuesPerTask: 2 }).inEnvironment({
        functionId: {
            identifier: "static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/monte-carlo.ts/createMonteCarloEnvironment",
            _______isFunctionId: true
        },
        parameters: [options],
        ______serializedFunctionCall: true
    }).map({
        identifier: "static:/home/travis/build/DatenMetzgerX/parallel-es-example/src/transpiled/monte-carlo.ts/calculateProject",
        _______isFunctionId: true
    });
}

/***/ },
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
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

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWViM2IzNjA1NjM0NTMzMDcxNWQiLCJ3ZWJwYWNrOi8vLy4vfi9wYXJhbGxlbC1lcy9kaXN0L2Jyb3dzZXItY29tbW9uanMucGFyYWxsZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2R5bmFtaWMva25pZ2h0cy10b3VyLnRzIiwid2VicGFjazovLy8uL3NyYy9keW5hbWljL21hbmRlbGJyb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2R5bmFtaWMvbW9udGUtY2FybG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RyYW5zcGlsZWQva25pZ2h0cy10b3VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFuc3BpbGVkL21hbmRlbGJyb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RyYW5zcGlsZWQvbW9udGUtY2FybG8udHMiLCJ3ZWJwYWNrOi8vLy4vfi9zaW1qcy1yYW5kb20vc2ltanMtcmFuZG9tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFZLDJCQUEyQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUE2QjtBQUM3QjtBQUNBLHdDQUF3QztBQUN4QyxFQUFFO0FBQ0Y7QUFDQTs7QUFFQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBLHVDQUF1QztBQUN2QyxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBLHdCIiwiZmlsZSI6ImNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzKSB7XG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXSwgcmVzdWx0O1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aClcbiBcdFx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG4gXHRcdGlmKGV4ZWN1dGVNb2R1bGVzKSB7XG4gXHRcdFx0Zm9yKGk9MDsgaSA8IGV4ZWN1dGVNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGV4ZWN1dGVNb2R1bGVzW2ldKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0cmV0dXJuIHJlc3VsdDtcbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdHMgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0MjogMFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQpIHtcbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKVxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuIFx0XHQvLyBhbiBQcm9taXNlIG1lYW5zIFwiY3VycmVudGx5IGxvYWRpbmdcIi5cbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZENodW5rc1tjaHVua0lkXVsyXTtcbiBcdFx0fVxuIFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuIFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG4gXHRcdHNjcmlwdC50aW1lb3V0ID0gMTIwMDAwO1xuXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLmpzXCI7XG4gXHRcdHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChvblNjcmlwdENvbXBsZXRlLCAxMjAwMDApO1xuIFx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBvblNjcmlwdENvbXBsZXRlO1xuIFx0XHRmdW5jdGlvbiBvblNjcmlwdENvbXBsZXRlKCkge1xuIFx0XHRcdC8vIGF2b2lkIG1lbSBsZWFrcyBpbiBJRS5cbiBcdFx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBudWxsO1xuIFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiBcdFx0XHR2YXIgY2h1bmsgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHRcdFx0aWYoY2h1bmsgIT09IDApIHtcbiBcdFx0XHRcdGlmKGNodW5rKSBjaHVua1sxXShuZXcgRXJyb3IoJ0xvYWRpbmcgY2h1bmsgJyArIGNodW5rSWQgKyAnIGZhaWxlZC4nKSk7XG4gXHRcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSB1bmRlZmluZWQ7XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbiBcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbcmVzb2x2ZSwgcmVqZWN0XTtcbiBcdFx0fSk7XG4gXHRcdHJldHVybiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMl0gPSBwcm9taXNlO1xuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb3J5IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vcnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gb24gZXJyb3IgZnVuY3Rpb24gZm9yIGFzeW5jIGxvYWRpbmdcbiBcdF9fd2VicGFja19yZXF1aXJlX18ub2UgPSBmdW5jdGlvbihlcnIpIHsgY29uc29sZS5lcnJvcihlcnIpOyB0aHJvdyBlcnI7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWViM2IzNjA1NjM0NTMzMDcxNWQiLCIhZnVuY3Rpb24odCxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1uKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxuKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzW1wicGFyYWxsZWwtZXNcIl09bigpOnRbXCJwYXJhbGxlbC1lc1wiXT1uKCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7ZnVuY3Rpb24gbihyKXtpZihlW3JdKXJldHVybiBlW3JdLmV4cG9ydHM7dmFyIGk9ZVtyXT17aTpyLGw6ITEsZXhwb3J0czp7fX07cmV0dXJuIHRbcl0uY2FsbChpLmV4cG9ydHMsaSxpLmV4cG9ydHMsbiksaS5sPSEwLGkuZXhwb3J0c312YXIgZT17fTtyZXR1cm4gbi5tPXQsbi5jPWUsbi5pPWZ1bmN0aW9uKHQpe3JldHVybiB0fSxuLmQ9ZnVuY3Rpb24odCxuLGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LG4se2NvbmZpZ3VyYWJsZTohMSxlbnVtZXJhYmxlOiEwLGdldDplfSl9LG4ubj1mdW5jdGlvbih0KXt2YXIgZT10JiZ0Ll9fZXNNb2R1bGU/ZnVuY3Rpb24oKXtyZXR1cm4gdFtcImRlZmF1bHRcIl19OmZ1bmN0aW9uKCl7cmV0dXJuIHR9O3JldHVybiBuLmQoZSxcImFcIixlKSxlfSxuLm89ZnVuY3Rpb24odCxuKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbil9LG4ucD1cIlwiLG4obi5zPTE3MCl9KGZ1bmN0aW9uKHQpe2Zvcih2YXIgbiBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pKXN3aXRjaCh0eXBlb2YgdFtuXSl7Y2FzZVwiZnVuY3Rpb25cIjpicmVhaztjYXNlXCJvYmplY3RcIjp0W25dPWZ1bmN0aW9uKG4pe3ZhciBlPW4uc2xpY2UoMSkscj10W25bMF1dO3JldHVybiBmdW5jdGlvbih0LG4saSl7ci5hcHBseSh0aGlzLFt0LG4saV0uY29uY2F0KGUpKX19KHRbbl0pO2JyZWFrO2RlZmF1bHQ6dFtuXT10W3Rbbl1dfXJldHVybiB0fShbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjtuLl9fZXNNb2R1bGU9ITAsbltcImRlZmF1bHRcIl09ZnVuY3Rpb24odCxuKXtpZighKHQgaW5zdGFuY2VvZiBuKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1uLl9fZXNNb2R1bGU9ITA7dmFyIGk9ZSg3Miksbz1yKGkpO25bXCJkZWZhdWx0XCJdPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LG4pe2Zvcih2YXIgZT0wO2U8bi5sZW5ndGg7ZSsrKXt2YXIgcj1uW2VdO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSwoMCxvW1wiZGVmYXVsdFwiXSkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gZSYmdChuLnByb3RvdHlwZSxlKSxyJiZ0KG4sciksbn19KCl9LGZ1bmN0aW9uKHQsbil7dmFyIGU9dC5leHBvcnRzPXt2ZXJzaW9uOlwiMi40LjBcIn07XCJudW1iZXJcIj09dHlwZW9mIF9fZSYmKF9fZT1lKX0sZnVuY3Rpb24odCxuKXt2YXIgZT10LmV4cG9ydHM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93Lk1hdGg9PU1hdGg/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiZzZWxmLk1hdGg9PU1hdGg/c2VsZjpGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XCJudW1iZXJcIj09dHlwZW9mIF9fZyYmKF9fZz1lKX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNDcpKFwid2tzXCIpLGk9ZSgzMSksbz1lKDMpLlN5bWJvbCx1PVwiZnVuY3Rpb25cIj09dHlwZW9mIG8sYT10LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIHJbdF18fChyW3RdPXUmJm9bdF18fCh1P286aSkoXCJTeW1ib2wuXCIrdCkpfTthLnN0b3JlPXJ9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9IWUoMTMpKGZ1bmN0aW9uKCl7cmV0dXJuIDchPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSxcImFcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIDd9fSkuYX0pfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg3KSxpPWUoNDEpLG89ZSgzMCksdT1PYmplY3QuZGVmaW5lUHJvcGVydHk7bi5mPWUoNSk/T2JqZWN0LmRlZmluZVByb3BlcnR5OmZ1bmN0aW9uKHQsbixlKXtpZihyKHQpLG49byhuLCEwKSxyKGUpLGkpdHJ5e3JldHVybiB1KHQsbixlKX1jYXRjaChhKXt9aWYoXCJnZXRcImluIGV8fFwic2V0XCJpbiBlKXRocm93IFR5cGVFcnJvcihcIkFjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIVwiKTtyZXR1cm5cInZhbHVlXCJpbiBlJiYodFtuXT1lLnZhbHVlKSx0fX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTEpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtpZighcih0KSl0aHJvdyBUeXBlRXJyb3IodCtcIiBpcyBub3QgYW4gb2JqZWN0IVwiKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDMpLGk9ZSgyKSxvPWUoMTQpLHU9ZSgxMCksYT1cInByb3RvdHlwZVwiLGM9ZnVuY3Rpb24odCxuLGUpe3ZhciBzLGYsbCxoPXQmYy5GLGQ9dCZjLkcsdj10JmMuUyxwPXQmYy5QLHk9dCZjLkIsbT10JmMuVyxrPWQ/aTppW25dfHwoaVtuXT17fSksXz1rW2FdLGc9ZD9yOnY/cltuXToocltuXXx8e30pW2FdO2QmJihlPW4pO2ZvcihzIGluIGUpZj0haCYmZyYmdm9pZCAwIT09Z1tzXSxmJiZzIGluIGt8fChsPWY/Z1tzXTplW3NdLGtbc109ZCYmXCJmdW5jdGlvblwiIT10eXBlb2YgZ1tzXT9lW3NdOnkmJmY/byhsLHIpOm0mJmdbc109PWw/ZnVuY3Rpb24odCl7dmFyIG49ZnVuY3Rpb24obixlLHIpe2lmKHRoaXMgaW5zdGFuY2VvZiB0KXtzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7Y2FzZSAwOnJldHVybiBuZXcgdDtjYXNlIDE6cmV0dXJuIG5ldyB0KG4pO2Nhc2UgMjpyZXR1cm4gbmV3IHQobixlKX1yZXR1cm4gbmV3IHQobixlLHIpfXJldHVybiB0LmFwcGx5KHRoaXMsYXJndW1lbnRzKX07cmV0dXJuIG5bYV09dFthXSxufShsKTpwJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP28oRnVuY3Rpb24uY2FsbCxsKTpsLHAmJigoay52aXJ0dWFsfHwoay52aXJ0dWFsPXt9KSlbc109bCx0JmMuUiYmXyYmIV9bc10mJnUoXyxzLGwpKSl9O2MuRj0xLGMuRz0yLGMuUz00LGMuUD04LGMuQj0xNixjLlc9MzIsYy5VPTY0LGMuUj0xMjgsdC5leHBvcnRzPWN9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBhfSk7dmFyIGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSl7aSgpKHRoaXMsdCksdGhpcy5mdW5jPW4sdGhpcy5wYXJhbXM9ZX1yZXR1cm4gdSgpKHQsbnVsbCxbe2tleTpcImNyZWF0ZVwiLHZhbHVlOmZ1bmN0aW9uKG4pe2Zvcih2YXIgZT1hcmd1bWVudHMubGVuZ3RoLHI9QXJyYXkoZT4xP2UtMTowKSxpPTE7aTxlO2krKylyW2ktMV09YXJndW1lbnRzW2ldO3JldHVybiBuZXcgdChuLHIpfX0se2tleTpcImNyZWF0ZVVuY2hlY2tlZFwiLHZhbHVlOmZ1bmN0aW9uKG4pe2Zvcih2YXIgZT1hcmd1bWVudHMubGVuZ3RoLHI9QXJyYXkoZT4xP2UtMTowKSxpPTE7aTxlO2krKylyW2ktMV09YXJndW1lbnRzW2ldO3JldHVybiBuZXcgdChuLHIpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg2KSxpPWUoMTgpO3QuZXhwb3J0cz1lKDUpP2Z1bmN0aW9uKHQsbixlKXtyZXR1cm4gci5mKHQsbixpKDEsZSkpfTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuIHRbbl09ZSx0fX0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIHQ/bnVsbCE9PXQ6XCJmdW5jdGlvblwiPT10eXBlb2YgdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDgxKSxpPWUoMzkpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gcihpKHQpKX19LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4hIXQoKX1jYXRjaChuKXtyZXR1cm4hMH19fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyNCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlKXtpZihyKHQpLHZvaWQgMD09PW4pcmV0dXJuIHQ7c3dpdGNoKGUpe2Nhc2UgMTpyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIHQuY2FsbChuLGUpfTtjYXNlIDI6cmV0dXJuIGZ1bmN0aW9uKGUscil7cmV0dXJuIHQuY2FsbChuLGUscil9O2Nhc2UgMzpyZXR1cm4gZnVuY3Rpb24oZSxyLGkpe3JldHVybiB0LmNhbGwobixlLHIsaSl9fXJldHVybiBmdW5jdGlvbigpe3JldHVybiB0LmFwcGx5KG4sYXJndW1lbnRzKX19fSxmdW5jdGlvbih0LG4pe3ZhciBlPXt9Lmhhc093blByb3BlcnR5O3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe3JldHVybiBlLmNhbGwodCxuKX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsbil7cmV0dXJue19fX19fX19pc0Z1bmN0aW9uSWQ6ITAsaWRlbnRpZmllcjp0K1wiLVwiK259fWZ1bmN0aW9uIGkodCl7cmV0dXJuISF0JiZ0Ll9fX19fX19pc0Z1bmN0aW9uSWQ9PT0hMH1uLmE9cixuLmI9aX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMjMpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe3JldHVybntlbnVtZXJhYmxlOiEoMSZ0KSxjb25maWd1cmFibGU6ISgyJnQpLHdyaXRhYmxlOiEoNCZ0KSx2YWx1ZTpufX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDE2KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBpfSk7dmFyIGk9e0ZJTFRFUjplLmkoci5hKShcInBhcmFsbGVsXCIsMCksSURFTlRJVFk6ZS5pKHIuYSkoXCJwYXJhbGxlbFwiLDEpLE1BUDplLmkoci5hKShcInBhcmFsbGVsXCIsMiksUEFSQUxMRUxfSk9CX0VYRUNVVE9SOmUuaShyLmEpKFwicGFyYWxsZWxcIiwzKSxSQU5HRTplLmkoci5hKShcInBhcmFsbGVsXCIsNCksUkVEVUNFOmUuaShyLmEpKFwicGFyYWxsZWxcIiw1KSxUSU1FUzplLmkoci5hKShcInBhcmFsbGVsXCIsNiksVE9fSVRFUkFUT1I6ZS5pKHIuYSkoXCJwYXJhbGxlbFwiLDcpfX0sZnVuY3Rpb24odCxuKXt2YXIgZT17fS50b1N0cmluZzt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIGUuY2FsbCh0KS5zbGljZSg4LC0xKX19LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPXt9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg4OSksaT1lKDQwKTt0LmV4cG9ydHM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKHQpe3JldHVybiByKHQsaSl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgxNyksaT1lLm4ociksbz1lKDM4KSx1PWUubihvKSxhPWUoMCksYz1lLm4oYSkscz1lKDEpLGY9ZS5uKHMpLGw9ZSgxMTEpLGg9ZSgxMTApO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGR9KTt2YXIgZD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobil7dmFyIGU9dGhpcztjKCkodGhpcyx0KSx0aGlzLm5leHRIYW5kbGVycz1bXTt2YXIgcj1mdW5jdGlvbih0LG4scil7cmV0dXJuIGUuX25leHQodCxuLHIpfSxpPWZ1bmN0aW9uKHQpe3JldHVybiBlLnJlamVjdCh0KX0sbz1mdW5jdGlvbih0KXtyZXR1cm4gZS5yZXNvbHZlKHQpfTtuKHIsbyxpKSx0aGlzLnByb21pc2U9bmV3IHUuYShmdW5jdGlvbih0LG4pe2UucmVzb2x2ZT10LGUucmVqZWN0PW59KX1yZXR1cm4gZigpKHQsW3trZXk6XCJzdWJzY3JpYmVcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuIHRoaXMubmV4dEhhbmRsZXJzLnB1c2godCksKG58fGUpJiZ0aGlzLnByb21pc2UudGhlbihlLG4pLHRoaXN9fSx7a2V5OlwidGhlblwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7cmV0dXJuIHRoaXMucHJvbWlzZS50aGVuKHQsbil9fSx7a2V5OlwiY2F0Y2hcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wcm9taXNlW1wiY2F0Y2hcIl0odCl9fSx7a2V5OlwiX25leHRcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7dmFyIHI9ITAsbz0hMSx1PXZvaWQgMDt0cnl7Zm9yKHZhciBhLGM9aSgpKHRoaXMubmV4dEhhbmRsZXJzKTshKHI9KGE9Yy5uZXh0KCkpLmRvbmUpO3I9ITApe3ZhciBzPWEudmFsdWU7cy5hcHBseSh2b2lkIDAsYXJndW1lbnRzKX19Y2F0Y2goZil7bz0hMCx1PWZ9ZmluYWxseXt0cnl7IXImJmNbXCJyZXR1cm5cIl0mJmNbXCJyZXR1cm5cIl0oKX1maW5hbGx5e2lmKG8pdGhyb3cgdX19fX1dLFt7a2V5OlwidHJhbnNmb3JtXCIsdmFsdWU6ZnVuY3Rpb24obixlKXt2YXIgcj12b2lkIDAsaT12b2lkIDAsbz12b2lkIDAsdT1uZXcgdChmdW5jdGlvbih0LG4sZSl7cj10LGk9bixvPWV9KTtyZXR1cm4gbi5zdWJzY3JpYmUocixvLGZ1bmN0aW9uKHQpe3JldHVybiBpKGUodCkpfSksdX19LHtrZXk6XCJmcm9tVGFza3NcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3JldHVybiAwPT09dC5sZW5ndGg/bmV3IGguYShuLmFwcGx5KHZvaWQgMCxbW11dKSk6bmV3IGwuYSh0LG4pfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXRocm93IFR5cGVFcnJvcih0K1wiIGlzIG5vdCBhIGZ1bmN0aW9uIVwiKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDExKSxpPWUoMykuZG9jdW1lbnQsbz1yKGkpJiZyKGkuY3JlYXRlRWxlbWVudCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBvP2kuY3JlYXRlRWxlbWVudCh0KTp7fX19LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPSEwfSxmdW5jdGlvbih0LG4pe24uZj17fS5wcm9wZXJ0eUlzRW51bWVyYWJsZX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNikuZixpPWUoMTUpLG89ZSg0KShcInRvU3RyaW5nVGFnXCIpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4sZSl7dCYmIWkodD1lP3Q6dC5wcm90b3R5cGUsbykmJnIodCxvLHtjb25maWd1cmFibGU6ITAsdmFsdWU6bn0pfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMzkpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gT2JqZWN0KHIodCkpfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTEpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe2lmKCFyKHQpKXJldHVybiB0O3ZhciBlLGk7aWYobiYmXCJmdW5jdGlvblwiPT10eXBlb2YoZT10LnRvU3RyaW5nKSYmIXIoaT1lLmNhbGwodCkpKXJldHVybiBpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mKGU9dC52YWx1ZU9mKSYmIXIoaT1lLmNhbGwodCkpKXJldHVybiBpO2lmKCFuJiZcImZ1bmN0aW9uXCI9PXR5cGVvZihlPXQudG9TdHJpbmcpJiYhcihpPWUuY2FsbCh0KSkpcmV0dXJuIGk7dGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpfX0sZnVuY3Rpb24odCxuKXt2YXIgZT0wLHI9TWF0aC5yYW5kb20oKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuXCJTeW1ib2woXCIuY29uY2F0KHZvaWQgMD09PXQ/XCJcIjp0LFwiKV9cIiwoKytlK3IpLnRvU3RyaW5nKDM2KSl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgxNTMpKCEwKTtlKDg0KShTdHJpbmcsXCJTdHJpbmdcIixmdW5jdGlvbih0KXt0aGlzLl90PVN0cmluZyh0KSx0aGlzLl9pPTB9LGZ1bmN0aW9uKCl7dmFyIHQsbj10aGlzLl90LGU9dGhpcy5faTtyZXR1cm4gZT49bi5sZW5ndGg/e3ZhbHVlOnZvaWQgMCxkb25lOiEwfToodD1yKG4sZSksdGhpcy5faSs9dC5sZW5ndGgse3ZhbHVlOnQsZG9uZTohMX0pfSl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDYzKSxpPShlLm4ociksZSg1NikpLG89KGUubihpKSxlKDU5KSksdT0oZS5uKG8pLGUoNjApKSxhPShlLm4odSksZSg2MikpLGM9KGUubihhKSxlKDY0KSkscz0oZS5uKGMpLGUoNjEpKSxmPShlLm4ocyksZSg2NSkpO2UubihmKTtlLm8ocixcIklQYXJhbGxlbFwiKSYmZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gci5JUGFyYWxsZWx9KSxlLm8oaSxcIklQYXJhbGxlbENoYWluXCIpJiZlLmQobixcImJcIixmdW5jdGlvbigpe3JldHVybiBpLklQYXJhbGxlbENoYWlufSksZS5vKG8sXCJJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnRcIikmJmUuZChuLFwiY1wiLGZ1bmN0aW9uKCl7cmV0dXJuIG8uSVBhcmFsbGVsVGFza0Vudmlyb25tZW50fSksZS5vKG8sXCJJUGFyYWxsZWxFbnZpcm9ubWVudFwiKSYmZS5kKG4sXCJkXCIsZnVuY3Rpb24oKXtyZXR1cm4gby5JUGFyYWxsZWxFbnZpcm9ubWVudH0pLGUubyh1LFwiSVBhcmFsbGVsSm9iXCIpJiZlLmQobixcImVcIixmdW5jdGlvbigpe3JldHVybiB1LklQYXJhbGxlbEpvYn0pLGUubyhhLFwiSVBhcmFsbGVsT3B0aW9uc1wiKSYmZS5kKG4sXCJmXCIsZnVuY3Rpb24oKXtyZXR1cm4gYS5JUGFyYWxsZWxPcHRpb25zfSksZS5vKGEsXCJJRGVmYXVsdEluaXRpYWxpemVkUGFyYWxsZWxPcHRpb25zXCIpJiZlLmQobixcImdcIixmdW5jdGlvbigpe3JldHVybiBhLklEZWZhdWx0SW5pdGlhbGl6ZWRQYXJhbGxlbE9wdGlvbnN9KSxlLm8oYyxcIklQYXJhbGxlbEpvYlNjaGVkdWxlclwiKSYmZS5kKG4sXCJoXCIsZnVuY3Rpb24oKXtyZXR1cm4gYy5JUGFyYWxsZWxKb2JTY2hlZHVsZXJ9KSxlLm8ocyxcIklQYXJhbGxlbE9wZXJhdGlvblwiKSYmZS5kKG4sXCJpXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5JUGFyYWxsZWxPcGVyYXRpb259KSxlLm8ocyxcIklTZXJpYWxpemVkUGFyYWxsZWxPcGVyYXRpb25cIikmJmUuZChuLFwialwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuSVNlcmlhbGl6ZWRQYXJhbGxlbE9wZXJhdGlvbn0pLGUubyhmLFwiSVBhcmFsbGVsU3RyZWFtXCIpJiZlLmQobixcImtcIixmdW5jdGlvbigpe3JldHVybiBmLklQYXJhbGxlbFN0cmVhbX0pfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gYX0pO3ZhciBhPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXtpKCkodGhpcyx0KSx0aGlzLmZ1bmN0aW9uUmVnaXN0cnk9bn1yZXR1cm4gdSgpKHQsW3trZXk6XCJzZXJpYWxpemVGdW5jdGlvbkNhbGxcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmZ1bmN0aW9uUmVnaXN0cnkuZ2V0T3JTZXRJZCh0LmZ1bmMpO3JldHVybntfX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsOiEwLGZ1bmN0aW9uSWQ6bixwYXJhbWV0ZXJzOnQucGFyYW1zfX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuISF0JiZ0Ll9fX19fX3NlcmlhbGl6ZWRGdW5jdGlvbkNhbGw9PT0hMH1uLmE9cn0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7aWYoMD09PXQubGVuZ3RoKXJldHVybltdO3ZhciBuPW8oKSh0KSxlPW5bMF0scj1uLnNsaWNlKDEpO3JldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KGUscil9dmFyIGk9ZSg3NSksbz1lLm4oaSksdT1lKDE3KTtlLm4odSk7bi5hPXJ9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTI5KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMzEpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbih0KXtpZih2b2lkIDA9PXQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiK3QpO3JldHVybiB0fX0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9XCJjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2ZcIi5zcGxpdChcIixcIil9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9IWUoNSkmJiFlKDEzKShmdW5jdGlvbigpe3JldHVybiA3IT1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSgyNSkoXCJkaXZcIiksXCJhXCIse2dldDpmdW5jdGlvbigpe3JldHVybiA3fX0pLmF9KX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNyksaT1lKDE0OCksbz1lKDQwKSx1PWUoNDYpKFwiSUVfUFJPVE9cIiksYT1mdW5jdGlvbigpe30sYz1cInByb3RvdHlwZVwiLHM9ZnVuY3Rpb24oKXt2YXIgdCxuPWUoMjUpKFwiaWZyYW1lXCIpLHI9by5sZW5ndGgsaT1cIjxcIix1PVwiPlwiO2ZvcihuLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZSg4MCkuYXBwZW5kQ2hpbGQobiksbi5zcmM9XCJqYXZhc2NyaXB0OlwiLHQ9bi5jb250ZW50V2luZG93LmRvY3VtZW50LHQub3BlbigpLHQud3JpdGUoaStcInNjcmlwdFwiK3UrXCJkb2N1bWVudC5GPU9iamVjdFwiK2krXCIvc2NyaXB0XCIrdSksdC5jbG9zZSgpLHM9dC5GO3ItLTspZGVsZXRlIHNbY11bb1tyXV07cmV0dXJuIHMoKX07dC5leHBvcnRzPU9iamVjdC5jcmVhdGV8fGZ1bmN0aW9uKHQsbil7dmFyIGU7cmV0dXJuIG51bGwhPT10PyhhW2NdPXIodCksZT1uZXcgYSxhW2NdPW51bGwsZVt1XT10KTplPXMoKSx2b2lkIDA9PT1uP2U6aShlLG4pfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMjcpLGk9ZSgxOCksbz1lKDEyKSx1PWUoMzApLGE9ZSgxNSksYz1lKDQxKSxzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7bi5mPWUoNSk/czpmdW5jdGlvbih0LG4pe2lmKHQ9byh0KSxuPXUobiwhMCksYyl0cnl7cmV0dXJuIHModCxuKX1jYXRjaChlKXt9aWYoYSh0LG4pKXJldHVybiBpKCFyLmYuY2FsbCh0LG4pLHRbbl0pfX0sZnVuY3Rpb24odCxuKXtuLmY9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc30sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoOCksaT1lKDIpLG89ZSgxMyk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbil7dmFyIGU9KGkuT2JqZWN0fHx7fSlbdF18fE9iamVjdFt0XSx1PXt9O3VbdF09bihlKSxyKHIuUytyLkYqbyhmdW5jdGlvbigpe2UoMSl9KSxcIk9iamVjdFwiLHUpfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNDcpKFwia2V5c1wiKSxpPWUoMzEpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gclt0XXx8KHJbdF09aSh0KSl9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgzKSxpPVwiX19jb3JlLWpzX3NoYXJlZF9fXCIsbz1yW2ldfHwocltpXT17fSk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBvW3RdfHwob1t0XT17fSl9fSxmdW5jdGlvbih0LG4pe3ZhciBlPU1hdGguY2VpbCxyPU1hdGguZmxvb3I7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBpc05hTih0PSt0KT8wOih0PjA/cjplKSh0KX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDQ4KSxpPU1hdGgubWluO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gdD4wP2kocih0KSw5MDA3MTk5MjU0NzQwOTkxKTowfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMyksaT1lKDIpLG89ZSgyNiksdT1lKDUxKSxhPWUoNikuZjt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIG49aS5TeW1ib2x8fChpLlN5bWJvbD1vP3t9OnIuU3ltYm9sfHx7fSk7XCJfXCI9PXQuY2hhckF0KDApfHx0IGluIG58fGEobix0LHt2YWx1ZTp1LmYodCl9KX19LGZ1bmN0aW9uKHQsbixlKXtuLmY9ZSg0KX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNzkpLGk9ZSg0KShcIml0ZXJhdG9yXCIpLG89ZSgyMSk7dC5leHBvcnRzPWUoMikuZ2V0SXRlcmF0b3JNZXRob2Q9ZnVuY3Rpb24odCl7aWYodm9pZCAwIT10KXJldHVybiB0W2ldfHx0W1wiQEBpdGVyYXRvclwiXXx8b1tyKHQpXX19LGZ1bmN0aW9uKHQsbixlKXtlKDE1Nyk7Zm9yKHZhciByPWUoMyksaT1lKDEwKSxvPWUoMjEpLHU9ZSg0KShcInRvU3RyaW5nVGFnXCIpLGE9W1wiTm9kZUxpc3RcIixcIkRPTVRva2VuTGlzdFwiLFwiTWVkaWFMaXN0XCIsXCJTdHlsZVNoZWV0TGlzdFwiLFwiQ1NTUnVsZUxpc3RcIl0sYz0wO2M8NTtjKyspe3ZhciBzPWFbY10sZj1yW3NdLGw9ZiYmZi5wcm90b3R5cGU7bCYmIWxbdV0mJmkobCx1LHMpLG9bc109by5BcnJheX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDMzKSxpPWUoNjYpLG89KGUubihpKSxlKDY3KSksdT0oZS5uKG8pLGUoNTUpKSxhPShlLm4odSksZSgxNikpLGM9ZSg5KSxzPWUoMzUpLGY9ZSgzNCksbD1lKDY4KSxoPShlLm4obCksZSgzMykpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHIuYX0pLGUubyhpLFwiSVRhc2tEZWZpbml0aW9uXCIpJiZlLmQobixcImJcIixmdW5jdGlvbigpe3JldHVybiBpLklUYXNrRGVmaW5pdGlvbn0pLGUubyhvLFwiSVRhc2tcIikmJmUuZChuLFwiY1wiLGZ1bmN0aW9uKCl7cmV0dXJuIG8uSVRhc2t9KSxlLm8odSxcIklGdW5jdGlvbkRlZmluaXRpb25cIikmJmUuZChuLFwiZFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHUuSUZ1bmN0aW9uRGVmaW5pdGlvbn0pLGUuZChuLFwiZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGEuSUZ1bmN0aW9uSWR9KSxlLmQobixcImZcIixmdW5jdGlvbigpe3JldHVybiBhLmJ9KSxlLmQobixcImdcIixmdW5jdGlvbigpe3JldHVybiBjLmF9KSxlLmQobixcImhcIixmdW5jdGlvbigpe3JldHVybiBzLklTZXJpYWxpemVkRnVuY3Rpb25DYWxsfSksZS5kKG4sXCJpXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5hfSksZS5kKG4sXCJqXCIsZnVuY3Rpb24oKXtyZXR1cm4gZi5hfSksZS5vKGwsXCJJVGhyZWFkUG9vbFwiKSYmZS5kKG4sXCJrXCIsZnVuY3Rpb24oKXtyZXR1cm4gbC5JVGhyZWFkUG9vbH0pLGUuZChuLFwibFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguYn0pLGUuZChuLFwibVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguY30pLGUuZChuLFwiblwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZH0pLGUuZChuLFwib1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZX0pLGUuZChuLFwicFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZn0pLGUuZChuLFwicVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZ30pLGUuZChuLFwiclwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguaH0pLGUuZChuLFwic1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGguaX0pLGUuZChuLFwidFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguan0pLGUuZChuLFwidVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGgua30pfSxmdW5jdGlvbih0LG4pe30sZnVuY3Rpb24odCxuKXt9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoMTAyKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBjfSk7dmFyIGM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSxyKXtpKCkodGhpcyx0KSx0aGlzLm9wdGlvbnM9ZSx0aGlzLmVudmlyb25tZW50PXIsdGhpcy5zdHJlYW09bn1yZXR1cm4gdSgpKHQsW3trZXk6XCJyZXNvbHZlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc319LHtrZXk6XCJjaGFpbk9wZXJhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBuZXcgYS5hKHRoaXMuc3RyZWFtLHRoaXMub3B0aW9ucyx0aGlzLmVudmlyb25tZW50LFt0XSl9fSx7a2V5OlwiYWRkRW52aXJvbm1lbnRcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gbmV3IGEuYSh0aGlzLnN0cmVhbSx0aGlzLm9wdGlvbnMsdGhpcy5lbnZpcm9ubWVudC5hZGQodCkpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyksYT1lKDE5KSxjPWUoOSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gc30pO3ZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXtpKCkodGhpcyx0KSx0aGlzLmNvbGxlY3Rpb249bn1yZXR1cm4gdSgpKHQsW3trZXk6XCJzZXJpYWxpemVTbGljZVwiLHZhbHVlOmZ1bmN0aW9uKHQsbixlKXt2YXIgcj1uKnQsaT1yK247cmV0dXJuIGUuc2VyaWFsaXplRnVuY3Rpb25DYWxsKGMuYS5jcmVhdGVVbmNoZWNrZWQoYS5hLlRPX0lURVJBVE9SLHRoaXMuY29sbGVjdGlvbi5zbGljZShyLGkpKSl9fSx7a2V5OlwibGVuZ3RoXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29sbGVjdGlvbi5sZW5ndGh9fV0pLHR9KCl9LDU2LDU2LGZ1bmN0aW9uKHQsbil7fSw1Niw1Niw1Niw1Niw1NSw1NSw1NixmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm57dHlwZTpkLkluaXRpYWxpemVXb3JrZXIsd29ya2VySWQ6dH19ZnVuY3Rpb24gaSh0KXtyZXR1cm57dGFzazp0LHR5cGU6ZC5TY2hlZHVsZVRhc2t9fWZ1bmN0aW9uIG8odCl7Zm9yKHZhciBuPWFyZ3VtZW50cy5sZW5ndGgsZT1BcnJheShuPjE/bi0xOjApLHI9MTtyPG47cisrKWVbci0xXT1hcmd1bWVudHNbcl07cmV0dXJue2Z1bmN0aW9uczp0LG1pc3NpbmdGdW5jdGlvbnM6ZSx0eXBlOmQuRnVuY3Rpb25SZXNwb25zZX19ZnVuY3Rpb24gdSgpe3JldHVybnt0eXBlOmQuU3RvcH19ZnVuY3Rpb24gYSh0KXtyZXR1cm4gdC50eXBlPT09ZC5GdW5jdGlvblJlcXVlc3R9ZnVuY3Rpb24gYyh0KXtyZXR1cm4gdC50eXBlPT09ZC5Xb3JrZXJSZXN1bHR9ZnVuY3Rpb24gcyh0KXtyZXR1cm4gdC50eXBlPT09ZC5GdW5jdGlvbkV4ZWN1dGlvbkVycm9yfXZhciBmPWUoMTE0KSxsPShlLm4oZiksZSgxMTcpKSxoPShlLm4obCksZSgxNykpO2UubihoKTtuLmU9cixuLmY9aSxuLmQ9byxuLmc9dSxuLmE9YSxuLmI9YyxuLmM9czt2YXIgZDshZnVuY3Rpb24odCl7dFt0LkluaXRpYWxpemVXb3JrZXI9MF09XCJJbml0aWFsaXplV29ya2VyXCIsdFt0LlNjaGVkdWxlVGFzaz0xXT1cIlNjaGVkdWxlVGFza1wiLHRbdC5GdW5jdGlvblJlcXVlc3Q9Ml09XCJGdW5jdGlvblJlcXVlc3RcIix0W3QuRnVuY3Rpb25SZXNwb25zZT0zXT1cIkZ1bmN0aW9uUmVzcG9uc2VcIix0W3QuV29ya2VyUmVzdWx0PTRdPVwiV29ya2VyUmVzdWx0XCIsdFt0LkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3I9NV09XCJGdW5jdGlvbkV4ZWN1dGlvbkVycm9yXCIsdFt0LlN0b3A9Nl09XCJTdG9wXCJ9KGR8fChkPXt9KSl9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTIyKSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMjUpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7dC5leHBvcnRzPXtcImRlZmF1bHRcIjplKDc4KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1uLl9fZXNNb2R1bGU9ITA7dmFyIGk9ZSgxMTgpLG89cihpKSx1PWUoMTE1KSxhPXIodSksYz1lKDc3KSxzPXIoYyk7bltcImRlZmF1bHRcIl09ZnVuY3Rpb24odCxuKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBuJiZudWxsIT09bil0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIisoXCJ1bmRlZmluZWRcIj09dHlwZW9mIG4/XCJ1bmRlZmluZWRcIjooMCxzW1wiZGVmYXVsdFwiXSkobikpKTt0LnByb3RvdHlwZT0oMCxhW1wiZGVmYXVsdFwiXSkobiYmbi5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LGVudW1lcmFibGU6ITEsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLG4mJihvW1wiZGVmYXVsdFwiXT8oMCxvW1wiZGVmYXVsdFwiXSkodCxuKTp0Ll9fcHJvdG9fXz1uKX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19bi5fX2VzTW9kdWxlPSEwO3ZhciBpPWUoNzcpLG89cihpKTtuW1wiZGVmYXVsdFwiXT1mdW5jdGlvbih0LG4pe2lmKCF0KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4hbnx8XCJvYmplY3RcIiE9PShcInVuZGVmaW5lZFwiPT10eXBlb2Ygbj9cInVuZGVmaW5lZFwiOigwLG9bXCJkZWZhdWx0XCJdKShuKSkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIG4/dDpufX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1uLl9fZXNNb2R1bGU9ITA7dmFyIGk9ZSg3MCksbz1yKGkpO25bXCJkZWZhdWx0XCJdPWZ1bmN0aW9uKHQpe3JldHVybiBBcnJheS5pc0FycmF5KHQpP3Q6KDAsb1tcImRlZmF1bHRcIl0pKHQpfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1uLl9fZXNNb2R1bGU9ITA7dmFyIGk9ZSg3MCksbz1yKGkpO25bXCJkZWZhdWx0XCJdPWZ1bmN0aW9uKHQpe2lmKEFycmF5LmlzQXJyYXkodCkpe2Zvcih2YXIgbj0wLGU9QXJyYXkodC5sZW5ndGgpO248dC5sZW5ndGg7bisrKWVbbl09dFtuXTtyZXR1cm4gZX1yZXR1cm4oMCxvW1wiZGVmYXVsdFwiXSkodCl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fW4uX19lc01vZHVsZT0hMDt2YXIgaT1lKDEyMCksbz1yKGkpLHU9ZSgxMTkpLGE9cih1KSxjPVwiZnVuY3Rpb25cIj09dHlwZW9mIGFbXCJkZWZhdWx0XCJdJiZcInN5bWJvbFwiPT10eXBlb2Ygb1tcImRlZmF1bHRcIl0/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgYVtcImRlZmF1bHRcIl0mJnQuY29uc3RydWN0b3I9PT1hW1wiZGVmYXVsdFwiXT9cInN5bWJvbFwiOnR5cGVvZiB0fTtuW1wiZGVmYXVsdFwiXT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBhW1wiZGVmYXVsdFwiXSYmXCJzeW1ib2xcIj09PWMob1tcImRlZmF1bHRcIl0pP2Z1bmN0aW9uKHQpe3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6Yyh0KX06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGFbXCJkZWZhdWx0XCJdJiZ0LmNvbnN0cnVjdG9yPT09YVtcImRlZmF1bHRcIl0/XCJzeW1ib2xcIjpcInVuZGVmaW5lZFwiPT10eXBlb2YgdD9cInVuZGVmaW5lZFwiOmModCl9fSxmdW5jdGlvbih0LG4sZSl7ZSg5Mik7dmFyIHI9ZSgyKS5PYmplY3Q7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlKXtyZXR1cm4gci5kZWZpbmVQcm9wZXJ0eSh0LG4sZSl9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyMCksaT1lKDQpKFwidG9TdHJpbmdUYWdcIiksbz1cIkFyZ3VtZW50c1wiPT1yKGZ1bmN0aW9uKCl7cmV0dXJuIGFyZ3VtZW50c30oKSksdT1mdW5jdGlvbih0LG4pe3RyeXtyZXR1cm4gdFtuXX1jYXRjaChlKXt9fTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIG4sZSxhO3JldHVybiB2b2lkIDA9PT10P1wiVW5kZWZpbmVkXCI6bnVsbD09PXQ/XCJOdWxsXCI6XCJzdHJpbmdcIj09dHlwZW9mKGU9dShuPU9iamVjdCh0KSxpKSk/ZTpvP3Iobik6XCJPYmplY3RcIj09KGE9cihuKSkmJlwiZnVuY3Rpb25cIj09dHlwZW9mIG4uY2FsbGVlP1wiQXJndW1lbnRzXCI6YX19LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9ZSgzKS5kb2N1bWVudCYmZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyMCk7dC5leHBvcnRzPU9iamVjdChcInpcIikucHJvcGVydHlJc0VudW1lcmFibGUoMCk/T2JqZWN0OmZ1bmN0aW9uKHQpe3JldHVyblwiU3RyaW5nXCI9PXIodCk/dC5zcGxpdChcIlwiKTpPYmplY3QodCl9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyMSksaT1lKDQpKFwiaXRlcmF0b3JcIiksbz1BcnJheS5wcm90b3R5cGU7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiB2b2lkIDAhPT10JiYoci5BcnJheT09PXR8fG9baV09PT10KX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDcpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4sZSxpKXt0cnl7cmV0dXJuIGk/bihyKGUpWzBdLGVbMV0pOm4oZSl9Y2F0Y2gobyl7dmFyIHU9dFtcInJldHVyblwiXTt0aHJvdyB2b2lkIDAhPT11JiZyKHUuY2FsbCh0KSksb319fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgyNiksaT1lKDgpLG89ZSg5MCksdT1lKDEwKSxhPWUoMTUpLGM9ZSgyMSkscz1lKDE0MiksZj1lKDI4KSxsPWUoODgpLGg9ZSg0KShcIml0ZXJhdG9yXCIpLGQ9IShbXS5rZXlzJiZcIm5leHRcImluW10ua2V5cygpKSx2PVwiQEBpdGVyYXRvclwiLHA9XCJrZXlzXCIseT1cInZhbHVlc1wiLG09ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc307dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlLGssXyxnLHcpe3MoZSxuLGspO3ZhciBiLHgsTyxQPWZ1bmN0aW9uKHQpe2lmKCFkJiZ0IGluIFQpcmV0dXJuIFRbdF07c3dpdGNoKHQpe2Nhc2UgcDpyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGUodGhpcyx0KX07Y2FzZSB5OnJldHVybiBmdW5jdGlvbigpe3JldHVybiBuZXcgZSh0aGlzLHQpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGUodGhpcyx0KX19LEk9bitcIiBJdGVyYXRvclwiLFM9Xz09eSxFPSExLFQ9dC5wcm90b3R5cGUsaj1UW2hdfHxUW3ZdfHxfJiZUW19dLE09anx8UChfKSxGPV8/Uz9QKFwiZW50cmllc1wiKTpNOnZvaWQgMCxDPVwiQXJyYXlcIj09bj9ULmVudHJpZXN8fGo6ajtpZihDJiYoTz1sKEMuY2FsbChuZXcgdCkpLE8hPT1PYmplY3QucHJvdG90eXBlJiYoZihPLEksITApLHJ8fGEoTyxoKXx8dShPLGgsbSkpKSxTJiZqJiZqLm5hbWUhPT15JiYoRT0hMCxNPWZ1bmN0aW9uKCl7cmV0dXJuIGouY2FsbCh0aGlzKX0pLHImJiF3fHwhZCYmIUUmJlRbaF18fHUoVCxoLE0pLGNbbl09TSxjW0ldPW0sXylpZihiPXt2YWx1ZXM6Uz9NOlAoeSksa2V5czpnP006UChwKSxlbnRyaWVzOkZ9LHcpZm9yKHggaW4gYil4IGluIFR8fG8oVCx4LGJbeF0pO2Vsc2UgaShpLlAraS5GKihkfHxFKSxuLGIpO3JldHVybiBifX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNCkoXCJpdGVyYXRvclwiKSxpPSExO3RyeXt2YXIgbz1bN11bcl0oKTtvW1wicmV0dXJuXCJdPWZ1bmN0aW9uKCl7aT0hMH0sQXJyYXkuZnJvbShvLGZ1bmN0aW9uKCl7dGhyb3cgMn0pfWNhdGNoKHUpe310LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXtpZighbiYmIWkpcmV0dXJuITE7dmFyIGU9ITE7dHJ5e3ZhciBvPVs3XSx1PW9bcl0oKTt1Lm5leHQ9ZnVuY3Rpb24oKXtyZXR1cm57ZG9uZTplPSEwfX0sb1tyXT1mdW5jdGlvbigpe3JldHVybiB1fSx0KG8pfWNhdGNoKGEpe31yZXR1cm4gZX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDEyKSxpPWUoODcpLmYsbz17fS50b1N0cmluZyx1PVwib2JqZWN0XCI9PXR5cGVvZiB3aW5kb3cmJndpbmRvdyYmT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM/T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KTpbXSxhPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4gaSh0KX1jYXRjaChuKXtyZXR1cm4gdS5zbGljZSgpfX07dC5leHBvcnRzLmY9ZnVuY3Rpb24odCl7cmV0dXJuIHUmJlwiW29iamVjdCBXaW5kb3ddXCI9PW8uY2FsbCh0KT9hKHQpOmkocih0KSl9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg4OSksaT1lKDQwKS5jb25jYXQoXCJsZW5ndGhcIixcInByb3RvdHlwZVwiKTtuLmY9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXN8fGZ1bmN0aW9uKHQpe3JldHVybiByKHQsaSl9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgxNSksaT1lKDI5KSxvPWUoNDYpKFwiSUVfUFJPVE9cIiksdT1PYmplY3QucHJvdG90eXBlO3QuZXhwb3J0cz1PYmplY3QuZ2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKHQpe3JldHVybiB0PWkodCkscih0LG8pP3Rbb106XCJmdW5jdGlvblwiPT10eXBlb2YgdC5jb25zdHJ1Y3RvciYmdCBpbnN0YW5jZW9mIHQuY29uc3RydWN0b3I/dC5jb25zdHJ1Y3Rvci5wcm90b3R5cGU6dCBpbnN0YW5jZW9mIE9iamVjdD91Om51bGx9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgxNSksaT1lKDEyKSxvPWUoMTM2KSghMSksdT1lKDQ2KShcIklFX1BST1RPXCIpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe3ZhciBlLGE9aSh0KSxjPTAscz1bXTtmb3IoZSBpbiBhKWUhPXUmJnIoYSxlKSYmcy5wdXNoKGUpO2Zvcig7bi5sZW5ndGg+YzspcihhLGU9bltjKytdKSYmKH5vKHMsZSl8fHMucHVzaChlKSk7cmV0dXJuIHN9fSxmdW5jdGlvbih0LG4sZSl7dC5leHBvcnRzPWUoMTApfSxmdW5jdGlvbih0LG4sZSl7dmFyIHIsaSxvLHU9ZSgxNCksYT1lKDE0MCksYz1lKDgwKSxzPWUoMjUpLGY9ZSgzKSxsPWYucHJvY2VzcyxoPWYuc2V0SW1tZWRpYXRlLGQ9Zi5jbGVhckltbWVkaWF0ZSx2PWYuTWVzc2FnZUNoYW5uZWwscD0wLHk9e30sbT1cIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGs9ZnVuY3Rpb24oKXt2YXIgdD0rdGhpcztpZih5Lmhhc093blByb3BlcnR5KHQpKXt2YXIgbj15W3RdO2RlbGV0ZSB5W3RdLG4oKX19LF89ZnVuY3Rpb24odCl7ay5jYWxsKHQuZGF0YSl9O2gmJmR8fChoPWZ1bmN0aW9uKHQpe2Zvcih2YXIgbj1bXSxlPTE7YXJndW1lbnRzLmxlbmd0aD5lOyluLnB1c2goYXJndW1lbnRzW2UrK10pO3JldHVybiB5WysrcF09ZnVuY3Rpb24oKXthKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dDpGdW5jdGlvbih0KSxuKX0scihwKSxwfSxkPWZ1bmN0aW9uKHQpe2RlbGV0ZSB5W3RdfSxcInByb2Nlc3NcIj09ZSgyMCkobCk/cj1mdW5jdGlvbih0KXtsLm5leHRUaWNrKHUoayx0LDEpKX06dj8oaT1uZXcgdixvPWkucG9ydDIsaS5wb3J0MS5vbm1lc3NhZ2U9XyxyPXUoby5wb3N0TWVzc2FnZSxvLDEpKTpmLmFkZEV2ZW50TGlzdGVuZXImJlwiZnVuY3Rpb25cIj09dHlwZW9mIHBvc3RNZXNzYWdlJiYhZi5pbXBvcnRTY3JpcHRzPyhyPWZ1bmN0aW9uKHQpe2YucG9zdE1lc3NhZ2UodCtcIlwiLFwiKlwiKX0sZi5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLF8sITEpKTpyPW0gaW4gcyhcInNjcmlwdFwiKT9mdW5jdGlvbih0KXtjLmFwcGVuZENoaWxkKHMoXCJzY3JpcHRcIikpW21dPWZ1bmN0aW9uKCl7Yy5yZW1vdmVDaGlsZCh0aGlzKSxrLmNhbGwodCl9fTpmdW5jdGlvbih0KXtzZXRUaW1lb3V0KHUoayx0LDEpLDApfSksdC5leHBvcnRzPXtzZXQ6aCxjbGVhcjpkfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoOCk7cihyLlMrci5GKiFlKDUpLFwiT2JqZWN0XCIse2RlZmluZVByb3BlcnR5OmUoNikuZn0pfSw2MSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyksYT1lKDEwMSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gc30pO3ZhciBjPWUoMTY4KSxzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXtpKCkodGhpcyx0KSx0aGlzLmZ1bmN0aW9uTG9va3VwVGFibGU9bn1yZXR1cm4gdSgpKHQsW3trZXk6XCJzcGF3blwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoIXdpbmRvdy5Xb3JrZXIpdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyBXZWIgV29ya2VyIHN1cHBvcnRcIik7dmFyIHQ9bmV3IGMsbj1uZXcgYS5hKHQsdGhpcy5mdW5jdGlvbkxvb2t1cFRhYmxlKTtyZXR1cm4gbi5pbml0aWFsaXplKCksbn19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMCksaT1lLm4ociksbz1lKDEpLHU9ZS5uKG8pLGE9ZSgxMTMpLGM9ZSgxNik7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gc30pO3ZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe2koKSh0aGlzLHQpLHRoaXMuaWRzPW5ldyBhLmEsdGhpcy5kZWZpbml0aW9ucz1uZXcgYS5hLHRoaXMubGFzdElkPTB9cmV0dXJuIHUoKSh0LFt7a2V5OlwiZ2V0T3JTZXRJZFwiLHZhbHVlOmZ1bmN0aW9uKHQpe2lmKGUuaShjLmIpKHQpKXJldHVybiB0O3ZhciBuPXQudG9TdHJpbmcoKSxyPXRoaXMuaWRzLmdldChuKTtyZXR1cm5cInVuZGVmaW5lZFwiPT10eXBlb2YgciYmKHI9ZS5pKGMuYSkoXCJkeW5hbWljXCIsKyt0aGlzLmxhc3RJZCksdGhpcy5pbml0RGVmaW5pdGlvbih0LHIpKSxyfX0se2tleTpcImdldERlZmluaXRpb25cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5kZWZpbml0aW9ucy5nZXQodC5pZGVudGlmaWVyKX19LHtrZXk6XCJpbml0RGVmaW5pdGlvblwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7dmFyIGU9dC50b1N0cmluZygpLHI9ZS5zdWJzdHJpbmcoZS5pbmRleE9mKFwiZnVuY3Rpb25cIikrOSxlLmluZGV4T2YoXCIoXCIpKS50cmltKCksaT1lLnN1YnN0cmluZyhlLmluZGV4T2YoXCIoXCIpKzEsZS5pbmRleE9mKFwiKVwiKSkuc3BsaXQoXCIsXCIpLG89ZS5zdWJzdHJpbmcoZS5pbmRleE9mKFwie1wiKSsxLGUubGFzdEluZGV4T2YoXCJ9XCIpKS50cmltKCksdT17YXJndW1lbnROYW1lczppLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC50cmltKCl9KSxib2R5Om8saWQ6bixuYW1lOlwiYW5vbnltb3VzXCIhPT1yP3I6dm9pZCAwfTt0aGlzLmlkcy5zZXQoZSxuKSx0aGlzLmRlZmluaXRpb25zLnNldChuLmlkZW50aWZpZXIsdSl9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe2Z1bmN0aW9uIG4obil7aWYobil7aWYobi5oYXNPd25Qcm9wZXJ0eShcInRocmVhZFBvb2xcIikmJlwidW5kZWZpbmVkXCI9PXR5cGVvZiBuLnRocmVhZFBvb2wpdGhyb3cgbmV3IEVycm9yKFwiVGhlIHRocmVhZCBwb29sIGlzIG1hbmRhdG9yeSBhbmQgY2Fubm90IGJlIHVuc2V0XCIpO2lmKG4uaGFzT3duUHJvcGVydHkoXCJtYXhDb25jdXJyZW5jeUxldmVsXCIpJiZcIm51bWJlclwiIT10eXBlb2Ygbi5tYXhDb25jdXJyZW5jeUxldmVsKXRocm93IG5ldyBFcnJvcihcIlRoZSBtYXhDb25jdXJyZW5jeUxldmVsIGlzIG1hbmRhdG9yeSBhbmQgaGFzIHRvIGJlIGEgbnVtYmVyXCIpfXJldHVybiBvKCkoe30sdCxuKX1yZXR1cm57ZGVmYXVsdE9wdGlvbnM6ZnVuY3Rpb24oZSl7cmV0dXJuIGU/dm9pZCh0PW4oZSkpOm8oKSh7fSx0KX0sZnJvbTpmdW5jdGlvbih0LHIpe3JldHVybiBlLmkocy5hKShuZXcgdS5hKHQpLG4ocikpfSxyYW5nZTpmdW5jdGlvbih0LHIsaSxvKXt2YXIgdT1hLmEuY3JlYXRlKHQscixpKTtyZXR1cm4gZS5pKHMuYSkodSxuKG8pKX0sdGltZXM6ZnVuY3Rpb24odCxyLGksbyl7cmV0dXJuIGk/ZS5pKHMuYSkoYy5hLmNyZWF0ZSh0LHIpLG4obyksaSk6ZS5pKHMuYSkoYy5hLmNyZWF0ZSh0LHIpLG4obykpfSxzY2hlZHVsZTpmdW5jdGlvbihuKXtmb3IodmFyIHIsaT1hcmd1bWVudHMubGVuZ3RoLG89QXJyYXkoaT4xP2ktMTowKSx1PTE7dTxpO3UrKylvW3UtMV09YXJndW1lbnRzW3VdO2lmKGUuaShmLmIpKG4pKXt2YXIgYTtyZXR1cm4oYT10LnRocmVhZFBvb2wpLnNjaGVkdWxlLmFwcGx5KGEsW25dLmNvbmNhdChvKSl9cmV0dXJuKHI9dC50aHJlYWRQb29sKS5zY2hlZHVsZS5hcHBseShyLFtuXS5jb25jYXQobykpfX19dmFyIGk9ZSg3MSksbz1lLm4oaSksdT1lKDU4KSxhPWUoMTA2KSxjPWUoMTA3KSxzPWUoMTAzKSxmPWUoMTYpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHJ9KX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMzcpLGk9ZS5uKHIpLG89ZSgwKSx1PWUubihvKSxhPWUoMSksYz1lLm4oYSkscz1lKDc0KSxmPWUubihzKSxsPWUoNzMpLGg9ZS5uKGwpLGQ9ZSgxMDkpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHZ9KTt2YXIgdj1mdW5jdGlvbih0KXtmdW5jdGlvbiBuKCl7cmV0dXJuIHUoKSh0aGlzLG4pLGYoKSh0aGlzLChuLl9fcHJvdG9fX3x8aSgpKG4pKS5hcHBseSh0aGlzLGFyZ3VtZW50cykpfXJldHVybiBoKCkobix0KSxjKCkobixbe2tleTpcImdldFNjaGVkdWxpbmdcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3ZhciBlPXQvKDQqbi5tYXhDb25jdXJyZW5jeUxldmVsKTtyZXR1cm4gbi5taW5WYWx1ZXNQZXJUYXNrJiYoZT1NYXRoLm1pbihNYXRoLm1heChlLG4ubWluVmFsdWVzUGVyVGFzayksdCkpLG4ubWF4VmFsdWVzUGVyVGFzayYmKGU9TWF0aC5taW4oZSxuLm1heFZhbHVlc1BlclRhc2spKSx7bnVtYmVyT2ZUYXNrczowPT09ZT8wOk1hdGgucm91bmQodC9lKSx2YWx1ZXNQZXJUYXNrOk1hdGguY2VpbChlKX19fV0pLG59KGQuYSl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoMTEyKSxjPWUoOSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gc30pO3ZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuLGUscil7aSgpKHRoaXMsdCksdGhpcy53b3JrZXJUaHJlYWRGYWN0b3J5PW4sdGhpcy5mdW5jdGlvbkNhbGxTZXJpYWxpemVyPWUsdGhpcy53b3JrZXJzPVtdLHRoaXMuaWRsZVdvcmtlcnM9W10sdGhpcy5xdWV1ZT1bXSx0aGlzLmxhc3RUYXNrSWQ9LTEsdGhpcy5jb25jdXJyZW5jeUxpbWl0PXIubWF4Q29uY3VycmVuY3lMZXZlbH1yZXR1cm4gdSgpKHQsW3trZXk6XCJzY2hlZHVsZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe2Zvcih2YXIgbj1hcmd1bWVudHMubGVuZ3RoLGU9QXJyYXkobj4xP24tMTowKSxyPTE7cjxuO3IrKyllW3ItMV09YXJndW1lbnRzW3JdO3ZhciBpPXRoaXMuZnVuY3Rpb25DYWxsU2VyaWFsaXplci5zZXJpYWxpemVGdW5jdGlvbkNhbGwoYy5hLmNyZWF0ZVVuY2hlY2tlZC5hcHBseShjLmEsW3RdLmNvbmNhdChlKSkpLG89e21haW46aSx1c2VkRnVuY3Rpb25JZHM6W2kuZnVuY3Rpb25JZF19O3JldHVybiB0aGlzLnNjaGVkdWxlVGFzayhvKX19LHtrZXk6XCJzY2hlZHVsZVRhc2tcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgbj10aGlzO3QuaWQ9Kyt0aGlzLmxhc3RUYXNrSWQ7dmFyIGU9bmV3IGEuYSh0KTtyZXR1cm4gZS5hbHdheXMoZnVuY3Rpb24oKXtyZXR1cm4gbi5fcmVsZWFzZVdvcmtlcihlKX0pLHRoaXMucXVldWUudW5zaGlmdChlKSx0aGlzLl9zY2hlZHVsZVBlbmRpbmdUYXNrcygpLGV9fSx7a2V5OlwiZ2V0RnVuY3Rpb25TZXJpYWxpemVyXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5mdW5jdGlvbkNhbGxTZXJpYWxpemVyfX0se2tleTpcIl9yZWxlYXNlV29ya2VyXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIG49dC5yZWxlYXNlV29ya2VyKCk7dGhpcy5pZGxlV29ya2Vycy5wdXNoKG4pLHRoaXMuX3NjaGVkdWxlUGVuZGluZ1Rhc2tzKCl9fSx7a2V5OlwiX3NjaGVkdWxlUGVuZGluZ1Rhc2tzXCIsdmFsdWU6ZnVuY3Rpb24oKXtmb3IoO3RoaXMucXVldWUubGVuZ3RoOyl7dmFyIHQ9dm9pZCAwO2lmKDA9PT10aGlzLmlkbGVXb3JrZXJzLmxlbmd0aCYmdGhpcy53b3JrZXJzLmxlbmd0aDx0aGlzLmNvbmN1cnJlbmN5TGltaXQ/KHQ9dGhpcy53b3JrZXJUaHJlYWRGYWN0b3J5LnNwYXduKCksdGhpcy53b3JrZXJzLnB1c2godCkpOnRoaXMuaWRsZVdvcmtlcnMubGVuZ3RoPjAmJih0PXRoaXMuaWRsZVdvcmtlcnMucG9wKCkpLCF0KXJldHVybjt2YXIgbj10aGlzLnF1ZXVlLnBvcCgpO24ucnVuT24odCl9fX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSg5NiksaT1lKDk4KSxvPWUoOTcpLHU9ZSg5NSksYT1lKDM0KSxjPWUoOTQpLHM9ZSg1NCk7ZS5kKG4sXCJJUGFyYWxsZWxcIixmdW5jdGlvbigpe3JldHVybiBzLmF9KSxlLmQobixcIklUYXNrRGVmaW5pdGlvblwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuYn0pLGUuZChuLFwiSVRhc2tcIixmdW5jdGlvbigpe3JldHVybiBzLmN9KSxlLmQobixcIklGdW5jdGlvbkRlZmluaXRpb25cIixmdW5jdGlvbigpe3JldHVybiBzLmR9KSxlLmQobixcIklGdW5jdGlvbklkXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5lfSksZS5kKG4sXCJpc0Z1bmN0aW9uSWRcIixmdW5jdGlvbigpe3JldHVybiBzLmZ9KSxlLmQobixcIkZ1bmN0aW9uQ2FsbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuZ30pLGUuZChuLFwiSVNlcmlhbGl6ZWRGdW5jdGlvbkNhbGxcIixmdW5jdGlvbigpe3JldHVybiBzLmh9KSxlLmQobixcImlzU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuaX0pLGUuZChuLFwiRnVuY3Rpb25DYWxsU2VyaWFsaXplclwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuan0pLGUuZChuLFwiSVRocmVhZFBvb2xcIixmdW5jdGlvbigpe3JldHVybiBzLmt9KSxlLmQobixcIklQYXJhbGxlbENoYWluXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5sfSksZS5kKG4sXCJJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnRcIixmdW5jdGlvbigpe3JldHVybiBzLm19KSxlLmQobixcIklQYXJhbGxlbEVudmlyb25tZW50XCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5ufSksZS5kKG4sXCJJUGFyYWxsZWxKb2JcIixmdW5jdGlvbigpe3JldHVybiBzLm99KSxlLmQobixcIklQYXJhbGxlbE9wdGlvbnNcIixmdW5jdGlvbigpe3JldHVybiBzLnB9KSxlLmQobixcIklEZWZhdWx0SW5pdGlhbGl6ZWRQYXJhbGxlbE9wdGlvbnNcIixmdW5jdGlvbigpe3JldHVybiBzLnF9KSxlLmQobixcIklQYXJhbGxlbEpvYlNjaGVkdWxlclwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMucn0pLGUuZChuLFwiSVBhcmFsbGVsT3BlcmF0aW9uXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5zfSksZS5kKG4sXCJJU2VyaWFsaXplZFBhcmFsbGVsT3BlcmF0aW9uXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy50fSksZS5kKG4sXCJJUGFyYWxsZWxTdHJlYW1cIixmdW5jdGlvbigpe3JldHVybiBzLnV9KTt2YXIgZj1uZXcgdS5hLGw9d2luZG93Lm5hdmlnYXRvci5oYXJkd2FyZUNvbmN1cnJlbmN5fHw0LGg9bmV3IGEuYShmKSxkPW5ldyBpLmEobmV3IGMuYShmKSxoLHttYXhDb25jdXJyZW5jeUxldmVsOmx9KSx2PWUuaShyLmEpKHttYXhDb25jdXJyZW5jeUxldmVsOmwsc2NoZWR1bGVyOm5ldyBvLmEsdGhyZWFkUG9vbDpkfSk7bltcImRlZmF1bHRcIl09dn0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMTcpLGk9ZS5uKHIpLG89ZSgzNyksdT1lLm4obyksYT1lKDc0KSxjPWUubihhKSxzPWUoMTIxKSxmPWUubihzKSxsPWUoNzMpLGg9ZS5uKGwpLGQ9ZSgwKSx2PWUubihkKSxwPWUoMSkseT1lLm4ocCksbT1lKDY5KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBrfSksZS5kKG4sXCJiXCIsZnVuY3Rpb24oKXtyZXR1cm4gX30pO3ZhciBrPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXt2KCkodGhpcyx0KSx0aGlzLm5hbWU9bn1yZXR1cm4geSgpKHQsW3trZXk6XCJvbk1lc3NhZ2VcIix2YWx1ZTpmdW5jdGlvbih0KXt0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIHdvcmtlciB0aHJlYWQgaW4gc3RhdGUgJ1wiK3RoaXMubmFtZStcIicgY2Fubm90IGhhbmRsZSB0aGUgcmVjZWl2ZWQgbWVzc2FnZSAoXCIrdC5kYXRhLnR5cGUrXCIpLlwiKX19LHtrZXk6XCJvbkVycm9yXCIsdmFsdWU6ZnVuY3Rpb24odCl7Y29uc29sZS5lcnJvcihcIlByb2Nlc3NpbmcgZXJyb3Igb24gd29ya2VyIHNsYXZlXCIsdC5lcnJvcil9fV0pLHR9KCksXz1mdW5jdGlvbih0KXtmdW5jdGlvbiBuKHQsZSxyKXt2KCkodGhpcyxuKTt2YXIgaT1jKCkodGhpcywobi5fX3Byb3RvX198fHUoKShuKSkuY2FsbCh0aGlzLFwiZXhlY3V0aW5nXCIpKTtyZXR1cm4gaS5jYWxsYmFjaz10LGkuZnVuY3Rpb25SZWdpc3RyeT1lLGkud29ya2VyPXIsaX1yZXR1cm4gaCgpKG4sdCkseSgpKG4sW3trZXk6XCJvbk1lc3NhZ2VcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgcj10LmRhdGE7ZS5pKG0uYSkocik/dGhpcy5oYW5kbGVGdW5jdGlvblJlcXVlc3Qocik6ZS5pKG0uYikocik/dGhpcy5jYWxsYmFjayh2b2lkIDAsci5yZXN1bHQpOmUuaShtLmMpKHIpP3RoaXMuY2FsbGJhY2soci5lcnJvcix2b2lkIDApOmYoKShuLnByb3RvdHlwZS5fX3Byb3RvX198fHUoKShuLnByb3RvdHlwZSksXCJvbk1lc3NhZ2VcIix0aGlzKS5jYWxsKHRoaXMsdCl9fSx7a2V5Olwib25FcnJvclwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuY2FsbGJhY2sodC5lcnJvcix2b2lkIDApfX0se2tleTpcImhhbmRsZUZ1bmN0aW9uUmVxdWVzdFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBuPVtdLGU9W10scj0hMCxvPSExLHU9dm9pZCAwO3RyeXtmb3IodmFyIGEsYz1pKCkodC5mdW5jdGlvbklkcyk7IShyPShhPWMubmV4dCgpKS5kb25lKTtyPSEwKXt2YXIgcz1hLnZhbHVlLGY9dGhpcy5mdW5jdGlvblJlZ2lzdHJ5LmdldERlZmluaXRpb24ocyk7Zj9lLnB1c2goZik6bi5wdXNoKHMpfX1jYXRjaChsKXtvPSEwLHU9bH1maW5hbGx5e3RyeXshciYmY1tcInJldHVyblwiXSYmY1tcInJldHVyblwiXSgpfWZpbmFsbHl7aWYobyl0aHJvdyB1fX10aGlzLndvcmtlci5wb3N0TWVzc2FnZShtLmQuYXBwbHkodm9pZCAwLFtlXS5jb25jYXQobikpKX19XSksbn0oayl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoNjkpLGM9ZSgxMDApO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGZ9KTt2YXIgcz0wLGY9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSl7aSgpKHRoaXMsdCksdGhpcy53b3JrZXI9bix0aGlzLmZ1bmN0aW9uTG9va3VwVGFibGU9ZSx0aGlzLmlkPSsrcyx0aGlzLnN0YXRlPW5ldyBjLmEoXCJkZWZhdWx0XCIpLHRoaXMuc3RvcHBlZD0hMTt2YXIgcj10aGlzO3RoaXMud29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsZnVuY3Rpb24oKXtyLm9uV29ya2VyTWVzc2FnZS5hcHBseShyLGFyZ3VtZW50cyl9KSx0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIixmdW5jdGlvbigpe3Iub25FcnJvci5hcHBseShyLGFyZ3VtZW50cyl9KX1yZXR1cm4gdSgpKHQsW3trZXk6XCJpbml0aWFsaXplXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZihcImRlZmF1bHRcIiE9PXRoaXMuc3RhdGUubmFtZSl0aHJvdyBuZXcgRXJyb3IoXCJUaGUgYnJvd3NlciB3b3JrZXIgdGhyZWFkIGNhbiBvbmx5IGJlIGluaXRpYWxpemVkIGlmIGluIHN0YXRlIGRlZmF1bHQgYnV0IGFjdHVhbCBzdGF0ZSBpcyAnXCIrdGhpcy5zdGF0ZS5uYW1lK1wiJy5cIik7dGhpcy5zZW5kTWVzc2FnZShlLmkoYS5lKSh0aGlzLmlkKSksdGhpcy5zdGF0ZT1uZXcgYy5hKFwiaWRsZVwiKX19LHtrZXk6XCJydW5cIix2YWx1ZTpmdW5jdGlvbih0LG4pe3ZhciByPXRoaXM7aWYoXCJpZGxlXCIhPT10aGlzLnN0YXRlLm5hbWUpdGhyb3cgbmV3IEVycm9yKFwiVGhlIGJyb3dzZXIgd29ya2VyIHRocmVhZCBjYW4gb25seSBleGVjdXRlIGEgbmV3IHRhc2sgaWYgaW4gc3RhdGUgaWRsZSBidXQgYWN0dWFsIHN0YXRlIGlzICdcIit0aGlzLnN0YXRlLm5hbWUrXCInLlwiKTt0aGlzLnNlbmRNZXNzYWdlKGUuaShhLmYpKHQpKTt2YXIgaT1mdW5jdGlvbih0LGUpe3Iuc3RvcHBlZD9yLnN0YXRlPW5ldyBjLmEoXCJzdG9wcGVkXCIpOnIuc3RhdGU9bmV3IGMuYShcImlkbGVcIiksbih0LGUpfTt0aGlzLnN0YXRlPW5ldyBjLmIoaSx0aGlzLmZ1bmN0aW9uTG9va3VwVGFibGUsdGhpcy53b3JrZXIpfX0se2tleTpcInN0b3BcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuc3RvcHBlZHx8KHRoaXMuc2VuZE1lc3NhZ2UoZS5pKGEuZykoKSksdGhpcy5zdG9wcGVkPSEwLFwiZXhlY3V0aW5nXCIhPT10aGlzLnN0YXRlLm5hbWUmJih0aGlzLnN0YXRlPW5ldyBjLmEoXCJzdG9wcGVkXCIpKSl9fSx7a2V5OlwidG9TdHJpbmdcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVyblwiQnJvd3NlcldvcmtlclRocmVhZCB7IGlkOiBcIit0aGlzLmlkK1wiLCBzdGF0ZTogXCIrdGhpcy5zdGF0ZS5uYW1lfX0se2tleTpcIm9uV29ya2VyTWVzc2FnZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuc3RhdGUub25NZXNzYWdlKHQpfX0se2tleTpcIm9uRXJyb3JcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnN0YXRlLm9uRXJyb3IodCksdGhpcy5zdGF0ZT1uZXcgYy5hKFwiZXJyb3JlZFwiKX19LHtrZXk6XCJzZW5kTWVzc2FnZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMud29ya2VyLnBvc3RNZXNzYWdlKHQpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSg3NiksaT1lLm4ociksbz1lKDApLHU9ZS5uKG8pLGE9ZSgxKSxjPWUubihhKSxzPWUoNTcpLGY9ZSg1OCksbD1lKDM2KSxoPWUoMjMpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGR9KTt2YXIgZD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobixlLHIpe3ZhciBpPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdP2FyZ3VtZW50c1szXTpbXTt1KCkodGhpcyx0KSx0aGlzLnByZXZpb3VzU3RyZWFtPW4sdGhpcy5vcHRpb25zPWUsdGhpcy5lbnZpcm9ubWVudD1yLHRoaXMub3BlcmF0aW9ucz1pfXJldHVybiBjKCkodCxbe2tleTpcInJlc29sdmVcIix2YWx1ZTpmdW5jdGlvbiBuKCl7dmFyIHQ9dGhpcyxlPXZvaWQgMCxuPXZvaWQgMCxyPXZvaWQgMCxpPW5ldyBoLmEoZnVuY3Rpb24odCxpLG8pe2U9dCxuPWkscj1vfSk7cmV0dXJuIHRoaXMucHJldmlvdXNTdHJlYW0udGhlbihmdW5jdGlvbihpKXt2YXIgbz10Lm9wdGlvbnMuc2NoZWR1bGVyLnNjaGVkdWxlKHtlbnZpcm9ubWVudDp0LmVudmlyb25tZW50LGdlbmVyYXRvcjpuZXcgZi5hKGkpLG9wZXJhdGlvbnM6dC5vcGVyYXRpb25zLG9wdGlvbnM6dC5vcHRpb25zfSksdT1oLmEuZnJvbVRhc2tzKG8sbC5hKTt1LnN1YnNjcmliZShlLHIsbil9LHIpLG5ldyBzLmEoaSx0aGlzLm9wdGlvbnMsdGhpcy5lbnZpcm9ubWVudCl9fSx7a2V5OlwiY2hhaW5PcGVyYXRpb25cIix2YWx1ZTpmdW5jdGlvbihuKXtyZXR1cm4gbmV3IHQodGhpcy5wcmV2aW91c1N0cmVhbSx0aGlzLm9wdGlvbnMsdGhpcy5lbnZpcm9ubWVudCxbXS5jb25jYXQoaSgpKHRoaXMub3BlcmF0aW9ucyksW25dKSl9fSx7a2V5OlwiYWRkRW52aXJvbm1lbnRcIix2YWx1ZTpmdW5jdGlvbihuKXtyZXR1cm4gbmV3IHQodGhpcy5wcmV2aW91c1N0cmVhbSx0aGlzLm9wdGlvbnMsdGhpcy5lbnZpcm9ubWVudC5hZGQobiksdGhpcy5vcGVyYXRpb25zKX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCxuLGUpe3ZhciByPWFyZ3VtZW50cy5sZW5ndGg+MyYmdm9pZCAwIT09YXJndW1lbnRzWzNdP2FyZ3VtZW50c1szXTpbXSxhPXZvaWQgMDtlIGluc3RhbmNlb2YgQXJyYXk/KGE9dm9pZCAwLHI9ZSk6YT1lO3ZhciBjPW5ldyBvLmEobmV3IGkuYSh0LG4sdS5hLm9mKCkscikpO3JldHVybiBhP2MuaW5FbnZpcm9ubWVudChhKTpjfXZhciBpPWUoMTA1KSxvPWUoMTA0KSx1PWUoMTA4KTtuLmE9cn0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMTcpLGk9ZS5uKHIpLG89ZSg3NSksdT1lLm4obyksYT1lKDApLGM9ZS5uKGEpLHM9ZSgxKSxmPWUubihzKSxsPWUoMTkpLGg9ZSg5KSxkPWUoMjMpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHZ9KTt2YXIgdj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobil7YygpKHRoaXMsdCksdGhpcy5zdGF0ZT1ufXJldHVybiBmKCkodCxbe2tleTpcImluRW52aXJvbm1lbnRcIix2YWx1ZTpmdW5jdGlvbihuKXt2YXIgZT12b2lkIDA7aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygbil7Zm9yKHZhciByPWFyZ3VtZW50cy5sZW5ndGgsaT1BcnJheShyPjE/ci0xOjApLG89MTtvPHI7bysrKWlbby0xXT1hcmd1bWVudHNbb107ZT1oLmEuY3JlYXRlVW5jaGVja2VkLmFwcGx5KGguYSxbbl0uY29uY2F0KGkpKX1lbHNlIGU9bjtyZXR1cm4gbmV3IHQodGhpcy5zdGF0ZS5hZGRFbnZpcm9ubWVudChlKSl9fSx7a2V5OlwibWFwXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2NoYWluKGguYS5jcmVhdGVVbmNoZWNrZWQobC5hLk1BUCksaC5hLmNyZWF0ZVVuY2hlY2tlZCh0KSl9fSx7a2V5OlwicmVkdWNlXCIsdmFsdWU6ZnVuY3Rpb24odCxuLGUpe3ZhciByPWV8fG4sbz10aGlzLl9jaGFpbihoLmEuY3JlYXRlVW5jaGVja2VkKGwuYS5SRURVQ0UsdCksaC5hLmNyZWF0ZVVuY2hlY2tlZChuKSkucmVzb2x2ZUNoYWluKCk7cmV0dXJuIGQuYS50cmFuc2Zvcm0obyxmdW5jdGlvbihuKXtpZigwPT09bi5sZW5ndGgpcmV0dXJuIHQ7dmFyIGU9dSgpKG4pLG89ZVswXSxhPWUuc2xpY2UoMSksYz1vLHM9ITAsZj0hMSxsPXZvaWQgMDt0cnl7Zm9yKHZhciBoLGQ9aSgpKGEpOyEocz0oaD1kLm5leHQoKSkuZG9uZSk7cz0hMCl7dmFyIHY9aC52YWx1ZTtjPXIoYyx2KX19Y2F0Y2gocCl7Zj0hMCxsPXB9ZmluYWxseXt0cnl7IXMmJmRbXCJyZXR1cm5cIl0mJmRbXCJyZXR1cm5cIl0oKX1maW5hbGx5e2lmKGYpdGhyb3cgbH19cmV0dXJuIGN9KX19LHtrZXk6XCJmaWx0ZXJcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fY2hhaW4oaC5hLmNyZWF0ZVVuY2hlY2tlZChsLmEuRklMVEVSKSxoLmEuY3JlYXRlVW5jaGVja2VkKHQpKX19LHtrZXk6XCJzdWJzY3JpYmVcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuIHRoaXMucmVzb2x2ZUNoYWluKCkuc3Vic2NyaWJlKHQsbixlKX19LHtrZXk6XCJ0aGVuXCIsdmFsdWU6ZnVuY3Rpb24odCxuKXtyZXR1cm4gdGhpcy5yZXNvbHZlQ2hhaW4oKS50aGVuKHQsbil9fSx7a2V5OlwiY2F0Y2hcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5yZXNvbHZlQ2hhaW4oKVtcImNhdGNoXCJdKHQpfX0se2tleTpcInJlc29sdmVDaGFpblwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5zdGF0ZT10aGlzLnN0YXRlLnJlc29sdmUoKTtyZXR1cm4gdC5zdHJlYW19fSx7a2V5OlwiX2NoYWluXCIsdmFsdWU6ZnVuY3Rpb24obixlKXtcbnZhciByPXtpdGVyYXRvcjpuLGl0ZXJhdGVlOmV9O3JldHVybiBuZXcgdCh0aGlzLnN0YXRlLmNoYWluT3BlcmF0aW9uKHIpKX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoNzYpLGk9ZS5uKHIpLG89ZSgwKSx1PWUubihvKSxhPWUoMSksYz1lLm4oYSkscz1lKDU3KSxmPWUoMjMpLGw9ZSgzNik7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gaH0pO3ZhciBoPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuLGUscixpKXt1KCkodGhpcyx0KSx0aGlzLmdlbmVyYXRvcj1uLHRoaXMub3B0aW9ucz1lLHRoaXMuZW52aXJvbm1lbnQ9cix0aGlzLm9wZXJhdGlvbnM9aX1yZXR1cm4gYygpKHQsW3trZXk6XCJyZXNvbHZlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLm9wdGlvbnMuc2NoZWR1bGVyLnNjaGVkdWxlKHtlbnZpcm9ubWVudDp0aGlzLmVudmlyb25tZW50LGdlbmVyYXRvcjp0aGlzLmdlbmVyYXRvcixvcGVyYXRpb25zOnRoaXMub3BlcmF0aW9ucyxvcHRpb25zOnRoaXMub3B0aW9uc30pO3JldHVybiBuZXcgcy5hKGYuYS5mcm9tVGFza3ModCxsLmEpLHRoaXMub3B0aW9ucyx0aGlzLmVudmlyb25tZW50KX19LHtrZXk6XCJjaGFpbk9wZXJhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKG4pe3JldHVybiBuZXcgdCh0aGlzLmdlbmVyYXRvcix0aGlzLm9wdGlvbnMsdGhpcy5lbnZpcm9ubWVudCxbXS5jb25jYXQoaSgpKHRoaXMub3BlcmF0aW9ucyksW25dKSl9fSx7a2V5OlwiYWRkRW52aXJvbm1lbnRcIix2YWx1ZTpmdW5jdGlvbihuKXtyZXR1cm4gbmV3IHQodGhpcy5nZW5lcmF0b3IsdGhpcy5vcHRpb25zLHRoaXMuZW52aXJvbm1lbnQuYWRkKG4pLHRoaXMub3BlcmF0aW9ucyl9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoMTkpLGM9ZSg5KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBzfSk7dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSxyKXtpKCkodGhpcyx0KSx0aGlzLnN0YXJ0PW4sdGhpcy5lbmQ9ZSx0aGlzLnN0ZXA9cn1yZXR1cm4gdSgpKHQsW3trZXk6XCJzZXJpYWxpemVTbGljZVwiLHZhbHVlOmZ1bmN0aW9uKHQsbixlKXt2YXIgcj1uKnRoaXMuc3RlcCxpPXRoaXMuc3RhcnQrdCpyLG89TWF0aC5taW4oaStyLHRoaXMuZW5kKTtyZXR1cm4gZS5zZXJpYWxpemVGdW5jdGlvbkNhbGwoYy5hLmNyZWF0ZVVuY2hlY2tlZChhLmEuUkFOR0UsaSxvLHRoaXMuc3RlcCkpfX0se2tleTpcImxlbmd0aFwiLGdldDpmdW5jdGlvbigpe3JldHVybiBNYXRoLmNlaWwoKHRoaXMuZW5kLXRoaXMuc3RhcnQpL3RoaXMuc3RlcCl9fV0sW3trZXk6XCJjcmVhdGVcIix2YWx1ZTpmdW5jdGlvbihuLGUscil7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGUmJihlPW4sbj0wKSxcInVuZGVmaW5lZFwiPT10eXBlb2YgciYmKHI9ZTxuPy0xOjEpLG5ldyB0KG4sZSxyKX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMCksaT1lLm4ociksbz1lKDEpLHU9ZS5uKG8pLGE9ZSgxOSksYz1lKDkpLHM9ZSgxNik7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gZn0pO3ZhciBmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuLGUpe2koKSh0aGlzLHQpLHRoaXMudGltZXM9bix0aGlzLml0ZXJhdGVlPWV9cmV0dXJuIHUoKSh0LFt7a2V5Olwic2VyaWFsaXplU2xpY2VcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7dmFyIHI9dCpuLGk9TWF0aC5taW4ocituLHRoaXMudGltZXMpLG89ZS5zZXJpYWxpemVGdW5jdGlvbkNhbGwodGhpcy5pdGVyYXRlZSk7cmV0dXJuIGUuc2VyaWFsaXplRnVuY3Rpb25DYWxsKGMuYS5jcmVhdGUoYS5hLlRJTUVTLHIsaSxvKSl9fSx7a2V5OlwibGVuZ3RoXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudGltZXN9fV0sW3trZXk6XCJjcmVhdGVcIix2YWx1ZTpmdW5jdGlvbihuLHIpe3ZhciBpPXZvaWQgMDtyZXR1cm4gaT1lLmkocy5iKShyKXx8XCJmdW5jdGlvblwiPT10eXBlb2Ygcj9jLmEuY3JlYXRlVW5jaGVja2VkKHIpOmMuYS5jcmVhdGUoYS5hLklERU5USVRZLHIpLG5ldyB0KG4saSl9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDcxKSxpPWUubihyKSxvPWUoMCksdT1lLm4obyksYT1lKDEpLGM9ZS5uKGEpLHM9ZSg5KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBmfSk7dmFyIGY9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7dmFyIG49YXJndW1lbnRzLmxlbmd0aD4wJiZ2b2lkIDAhPT1hcmd1bWVudHNbMF0/YXJndW1lbnRzWzBdOltdO3UoKSh0aGlzLHQpLHRoaXMuZW52aXJvbm1lbnRzPW59cmV0dXJuIGMoKSh0LFt7a2V5OlwiYWRkXCIsdmFsdWU6ZnVuY3Rpb24obil7dmFyIGU9dGhpcy5lbnZpcm9ubWVudHMuc2xpY2UoKTtyZXR1cm4gbiBpbnN0YW5jZW9mIHMuYXx8ISh0aGlzLmVudmlyb25tZW50cy5sZW5ndGg+MCl8fHRoaXMuZW52aXJvbm1lbnRzW3RoaXMuZW52aXJvbm1lbnRzLmxlbmd0aC0xXWluc3RhbmNlb2Ygcy5hP2UucHVzaChuKTplW2UubGVuZ3RoLTFdPWkoKSh7fSxlW2UubGVuZ3RoLTFdLG4pLG5ldyB0KGUpfX0se2tleTpcInRvSlNPTlwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmVudmlyb25tZW50cy5tYXAoZnVuY3Rpb24obil7cmV0dXJuIG4gaW5zdGFuY2VvZiBzLmE/dC5zZXJpYWxpemVGdW5jdGlvbkNhbGwobik6bn0pfX1dLFt7a2V5Olwib2ZcIix2YWx1ZTpmdW5jdGlvbihuKXt2YXIgZT10LkVNUFRZO3JldHVybiBuP2UuYWRkKG4pOmV9fV0pLHR9KCk7Zi5FTVBUWT1uZXcgZn0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMCksaT1lLm4ociksbz1lKDEpLHU9ZS5uKG8pLGE9ZSg5KSxjPWUoMTkpLHM9ZSgzNiksZj1lKDM1KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBsfSk7dmFyIGw9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7aSgpKHRoaXMsdCl9cmV0dXJuIHUoKSh0LFt7a2V5Olwic2NoZWR1bGVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmdldFRhc2tEZWZpbml0aW9ucyh0KTtyZXR1cm4gbi5tYXAoZnVuY3Rpb24obil7cmV0dXJuIHQub3B0aW9ucy50aHJlYWRQb29sLnNjaGVkdWxlVGFzayhuKX0pfX0se2tleTpcImdldFRhc2tEZWZpbml0aW9uc1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMuZ2V0U2NoZWR1bGluZyh0LmdlbmVyYXRvci5sZW5ndGgsdC5vcHRpb25zKSxyPXQub3B0aW9ucy50aHJlYWRQb29sLmdldEZ1bmN0aW9uU2VyaWFsaXplcigpLGk9dC5lbnZpcm9ubWVudC50b0pTT04ociksbz10aGlzLnNlcmlhbGl6ZU9wZXJhdGlvbnModC5vcGVyYXRpb25zLHIpLHU9W2MuYS5QQVJBTExFTF9KT0JfRVhFQ1VUT1JdLmNvbmNhdChlLmkocy5hKShvLm1hcChmdW5jdGlvbih0KXtyZXR1cm5bdC5pdGVyYXRlZS5mdW5jdGlvbklkLHQuaXRlcmF0b3IuZnVuY3Rpb25JZF19KSkpO2kuZm9yRWFjaChmdW5jdGlvbih0KXtlLmkoZi5hKSh0KSYmdS5wdXNoKHQuZnVuY3Rpb25JZCl9KTtmb3IodmFyIGw9W10saD0wO2g8bi5udW1iZXJPZlRhc2tzOysraCl7dmFyIGQ9dC5nZW5lcmF0b3Iuc2VyaWFsaXplU2xpY2UoaCxuLnZhbHVlc1BlclRhc2ssciksdj17ZW52aXJvbm1lbnRzOmksZ2VuZXJhdG9yOmQsb3BlcmF0aW9uczpvLHRhc2tJbmRleDpoLHZhbHVlc1BlclRhc2s6bi52YWx1ZXNQZXJUYXNrfSxwPXttYWluOnIuc2VyaWFsaXplRnVuY3Rpb25DYWxsKGEuYS5jcmVhdGVVbmNoZWNrZWQoYy5hLlBBUkFMTEVMX0pPQl9FWEVDVVRPUix2KSksdGFza0luZGV4OmgsdXNlZEZ1bmN0aW9uSWRzOltkLmZ1bmN0aW9uSWRdLmNvbmNhdCh1KSx2YWx1ZXNQZXJUYXNrOm4udmFsdWVzUGVyVGFza307bC5wdXNoKHApfXJldHVybiBsfX0se2tleTpcInNlcmlhbGl6ZU9wZXJhdGlvbnNcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3JldHVybiB0Lm1hcChmdW5jdGlvbih0KXtyZXR1cm57aXRlcmF0ZWU6bi5zZXJpYWxpemVGdW5jdGlvbkNhbGwodC5pdGVyYXRlZSksaXRlcmF0b3I6bi5zZXJpYWxpemVGdW5jdGlvbkNhbGwodC5pdGVyYXRvcil9fSl9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDM4KSxpPWUubihyKSxvPWUoMCksdT1lLm4obyksYT1lKDEpLGM9ZS5uKGEpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHN9KTt2YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobil7dSgpKHRoaXMsdCksdGhpcy5wcm9taXNlPWkuYS5yZXNvbHZlKG4pfXJldHVybiBjKCkodCxbe2tleTpcInN1YnNjcmliZVwiLHZhbHVlOmZ1bmN0aW9uKHQsbixlKXtyZXR1cm4oZXx8bikmJnRoaXMucHJvbWlzZS50aGVuKGUsbiksdGhpc319LHtrZXk6XCJ0aGVuXCIsdmFsdWU6ZnVuY3Rpb24odCxuKXtyZXR1cm4gdGhpcy5wcm9taXNlLnRoZW4odCxuKX19LHtrZXk6XCJjYXRjaFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnByb21pc2VbXCJjYXRjaFwiXSh0KX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMTcpLGk9ZS5uKHIpLG89ZSgwKSx1PWUubihvKSxhPWUoMSksYz1lLm4oYSkscz1lKDIzKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBmfSk7dmFyIGY9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSl7dmFyIHI9dGhpczt1KCkodGhpcyx0KSx0aGlzLmZhaWxlZD0hMSx0aGlzLnRhc2tzPW4sdGhpcy5qb2luZXI9ZSx0aGlzLnN1YlJlc3VsdHM9bmV3IEFycmF5KG4ubGVuZ3RoKSx0aGlzLnBlbmRpbmc9bi5sZW5ndGgsdGhpcy5pbm5lclN0cmVhbT1uZXcgcy5hKGZ1bmN0aW9uKHQsbixlKXtyLm5leHQ9dCxyLnJlc29sdmU9bixyLnJlamVjdD1lfSk7dmFyIG89ITAsYT0hMSxjPXZvaWQgMDt0cnl7Zm9yKHZhciBmLGw9ZnVuY3Rpb24oKXt2YXIgdD1mLnZhbHVlO3QudGhlbihmdW5jdGlvbihuKXtyZXR1cm4gci5fdGFza0NvbXBsZXRlZChuLHQuZGVmaW5pdGlvbil9LGZ1bmN0aW9uKHQpe3JldHVybiByLl90YXNrRmFpbGVkKHQpfSl9LGg9aSgpKG4pOyEobz0oZj1oLm5leHQoKSkuZG9uZSk7bz0hMClsKCl9Y2F0Y2goZCl7YT0hMCxjPWR9ZmluYWxseXt0cnl7IW8mJmhbXCJyZXR1cm5cIl0mJmhbXCJyZXR1cm5cIl0oKX1maW5hbGx5e2lmKGEpdGhyb3cgY319fXJldHVybiBjKCkodCxbe2tleTpcInN1YnNjcmliZVwiLHZhbHVlOmZ1bmN0aW9uKHQsbixlKXtyZXR1cm4gdGhpcy5pbm5lclN0cmVhbS5zdWJzY3JpYmUodCxuLGUpLHRoaXN9fSx7a2V5OlwidGhlblwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7cmV0dXJuIHRoaXMuaW5uZXJTdHJlYW0udGhlbih0LG4pfX0se2tleTpcImNhdGNoXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuaW5uZXJTdHJlYW1bXCJjYXRjaFwiXSh0KX19LHtrZXk6XCJfdGFza0NvbXBsZXRlZFwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7aWYoMD09PXRoaXMucGVuZGluZyl0aHJvdyBuZXcgRXJyb3IoXCJTdHJlYW0gYWxyZWFkeSByZXNvbHZlZCBidXQgdGFza0NvbXBsZXRlZCBjYWxsZWQgb25lIG1vcmUgdGltZVwiKTstLXRoaXMucGVuZGluZyx0aGlzLnN1YlJlc3VsdHNbbi50YXNrSW5kZXhdPXQsdGhpcy5mYWlsZWR8fCh0aGlzLm5leHQodCxuLnRhc2tJbmRleCxuLnZhbHVlc1BlclRhc2spLDA9PT10aGlzLnBlbmRpbmcmJnRoaXMucmVzb2x2ZSh0aGlzLmpvaW5lci5hcHBseSh2b2lkIDAsW3RoaXMuc3ViUmVzdWx0c10pKSl9fSx7a2V5OlwiX3Rhc2tGYWlsZWRcIix2YWx1ZTpmdW5jdGlvbih0KXtpZih0aGlzLmZhaWxlZCE9PSEwKXt0aGlzLmZhaWxlZD0hMDtmb3IodmFyIG49MDtuPHRoaXMudGFza3MubGVuZ3RoOysrbilcInVuZGVmaW5lZFwiPT10eXBlb2YgdGhpcy5zdWJSZXN1bHRzW25dJiZ0aGlzLnRhc2tzW25dLmNhbmNlbCgpO3RoaXMucmVqZWN0KHQpfX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMzgpLGk9ZS5uKHIpLG89ZSgwKSx1PWUubihvKSxhPWUoMSksYz1lLm4oYSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gc30pO3ZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXt2YXIgZT10aGlzO3UoKSh0aGlzLHQpLHRoaXMuZGVmaW5pdGlvbj1uLHRoaXMuaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQ9ITEsdGhpcy5pc0NhbmNlbGVkPSExLHRoaXMucHJvbWlzZT1uZXcgaS5hKGZ1bmN0aW9uKHQsbil7ZS5yZXNvbHZlPXQsZS5yZWplY3Q9bn0pfXJldHVybiBjKCkodCxbe2tleTpcInJ1bk9uXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIG49dGhpcztpZih0aGlzLndvcmtlcj10LHRoaXMuaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQpdGhpcy5fdGFza0NvbXBsZXRlZCh2b2lkIDApO2Vsc2V7dmFyIGU9ZnVuY3Rpb24odCxlKXt0P24ucmVqZWN0KHQpOm4uX3Rhc2tDb21wbGV0ZWQoZSl9O3RoaXMud29ya2VyLnJ1bih0aGlzLmRlZmluaXRpb24sZSl9fX0se2tleTpcInJlbGVhc2VXb3JrZXJcIix2YWx1ZTpmdW5jdGlvbigpe2lmKCF0aGlzLndvcmtlcil0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmVsZWFzZSBhIHdvcmtlciB0YXNrIHRoYXQgaGFzIG5vIGFzc2lnbmVkIHdvcmtlciB0aHJlYWQuXCIpO3ZhciB0PXRoaXMud29ya2VyO3JldHVybiB0aGlzLndvcmtlcj12b2lkIDAsdH19LHtrZXk6XCJ0aGVuXCIsdmFsdWU6ZnVuY3Rpb24odCxuKXtyZXR1cm4gbj90aGlzLnByb21pc2UudGhlbih0LG4pOnRoaXMucHJvbWlzZS50aGVuKHQpfX0se2tleTpcImNhdGNoXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucHJvbWlzZVtcImNhdGNoXCJdKHQpfX0se2tleTpcImNhbmNlbFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5pc0NhbmNlbGxhdGlvblJlcXVlc3RlZD0hMH19LHtrZXk6XCJhbHdheXNcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnByb21pc2UudGhlbih0LHQpfX0se2tleTpcIl90YXNrQ29tcGxldGVkXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5pc0NhbmNlbGxhdGlvblJlcXVlc3RlZD8odGhpcy5pc0NhbmNlbGVkPSEwLHRoaXMucmVqZWN0KFwiVGFzayBoYXMgYmVlbiBjYW5jZWxlZFwiKSk6dGhpcy5yZXNvbHZlKHQpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gYX0pO3ZhciBhPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe2koKSh0aGlzLHQpLHRoaXMuZGF0YT17fX1yZXR1cm4gdSgpKHQsW3trZXk6XCJnZXRcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgbj10aGlzLnRvSW50ZXJuYWxLZXkodCk7cmV0dXJuIHRoaXMuaGFzKHQpP3RoaXMuZGF0YVtuXTp2b2lkIDB9fSx7a2V5OlwiaGFzXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmRhdGEsdGhpcy50b0ludGVybmFsS2V5KHQpKX19LHtrZXk6XCJzZXRcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3RoaXMuZGF0YVt0aGlzLnRvSW50ZXJuYWxLZXkodCldPW59fSx7a2V5OlwiY2xlYXJcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuZGF0YT17fX19LHtrZXk6XCJ0b0ludGVybmFsS2V5XCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJAXCIrdH19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMjQpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7dC5leHBvcnRzPXtcImRlZmF1bHRcIjplKDEyNiksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTI3KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMjgpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7dC5leHBvcnRzPXtcImRlZmF1bHRcIjplKDEzMCksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTMyKSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMzMpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fW4uX19lc01vZHVsZT0hMDt2YXIgaT1lKDM3KSxvPXIoaSksdT1lKDExNiksYT1yKHUpO25bXCJkZWZhdWx0XCJdPWZ1bmN0aW9uIGModCxuLGUpe251bGw9PT10JiYodD1GdW5jdGlvbi5wcm90b3R5cGUpO3ZhciByPSgwLGFbXCJkZWZhdWx0XCJdKSh0LG4pO2lmKHZvaWQgMD09PXIpe3ZhciBpPSgwLG9bXCJkZWZhdWx0XCJdKSh0KTtyZXR1cm4gbnVsbD09PWk/dm9pZCAwOmMoaSxuLGUpfWlmKFwidmFsdWVcImluIHIpcmV0dXJuIHIudmFsdWU7dmFyIHU9ci5nZXQ7aWYodm9pZCAwIT09dSlyZXR1cm4gdS5jYWxsKGUpfX0sZnVuY3Rpb24odCxuLGUpe2UoMzIpLGUoMTU2KSx0LmV4cG9ydHM9ZSgyKS5BcnJheS5mcm9tfSxmdW5jdGlvbih0LG4sZSl7ZSg1MyksZSgzMiksdC5leHBvcnRzPWUoMTU1KX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMiksaT1yLkpTT058fChyLkpTT049e3N0cmluZ2lmeTpKU09OLnN0cmluZ2lmeX0pO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gaS5zdHJpbmdpZnkuYXBwbHkoaSxhcmd1bWVudHMpfX0sZnVuY3Rpb24odCxuLGUpe2UoMTU4KSx0LmV4cG9ydHM9ZSgyKS5PYmplY3QuYXNzaWdufSxmdW5jdGlvbih0LG4sZSl7ZSgxNTkpO3ZhciByPWUoMikuT2JqZWN0O3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe3JldHVybiByLmNyZWF0ZSh0LG4pfX0sZnVuY3Rpb24odCxuLGUpe2UoMTYwKTt2YXIgcj1lKDIpLk9iamVjdDt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gci5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxuKX19LGZ1bmN0aW9uKHQsbixlKXtlKDE2MSk7dmFyIHI9ZSgyKS5PYmplY3Q7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiByLmdldE93blByb3BlcnR5TmFtZXModCl9fSxmdW5jdGlvbih0LG4sZSl7ZSgxNjIpLHQuZXhwb3J0cz1lKDIpLk9iamVjdC5nZXRQcm90b3R5cGVPZn0sZnVuY3Rpb24odCxuLGUpe2UoMTYzKSx0LmV4cG9ydHM9ZSgyKS5PYmplY3Quc2V0UHJvdG90eXBlT2Z9LGZ1bmN0aW9uKHQsbixlKXtlKDkzKSxlKDMyKSxlKDUzKSxlKDE2NCksdC5leHBvcnRzPWUoMikuUHJvbWlzZX0sZnVuY3Rpb24odCxuLGUpe2UoMTY1KSxlKDkzKSxlKDE2NiksZSgxNjcpLHQuZXhwb3J0cz1lKDIpLlN5bWJvbH0sZnVuY3Rpb24odCxuLGUpe2UoMzIpLGUoNTMpLHQuZXhwb3J0cz1lKDUxKS5mKFwiaXRlcmF0b3JcIil9LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPWZ1bmN0aW9uKCl7fX0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuLGUscil7aWYoISh0IGluc3RhbmNlb2Ygbil8fHZvaWQgMCE9PXImJnIgaW4gdCl0aHJvdyBUeXBlRXJyb3IoZStcIjogaW5jb3JyZWN0IGludm9jYXRpb24hXCIpO3JldHVybiB0fX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTIpLGk9ZSg0OSksbz1lKDE1NCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihuLGUsdSl7dmFyIGEsYz1yKG4pLHM9aShjLmxlbmd0aCksZj1vKHUscyk7aWYodCYmZSE9ZSl7Zm9yKDtzPmY7KWlmKGE9Y1tmKytdLGEhPWEpcmV0dXJuITB9ZWxzZSBmb3IoO3M+ZjtmKyspaWYoKHR8fGYgaW4gYykmJmNbZl09PT1lKXJldHVybiB0fHxmfHwwO3JldHVybiF0JiYtMX19fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSg2KSxpPWUoMTgpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4sZSl7biBpbiB0P3IuZih0LG4saSgwLGUpKTp0W25dPWV9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyMiksaT1lKDQ0KSxvPWUoMjcpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXt2YXIgbj1yKHQpLGU9aS5mO2lmKGUpZm9yKHZhciB1LGE9ZSh0KSxjPW8uZixzPTA7YS5sZW5ndGg+czspYy5jYWxsKHQsdT1hW3MrK10pJiZuLnB1c2godSk7cmV0dXJuIG59fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgxNCksaT1lKDgzKSxvPWUoODIpLHU9ZSg3KSxhPWUoNDkpLGM9ZSg1Mikscz17fSxmPXt9LG49dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlLGwsaCl7dmFyIGQsdixwLHksbT1oP2Z1bmN0aW9uKCl7cmV0dXJuIHR9OmModCksaz1yKGUsbCxuPzI6MSksXz0wO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIG0pdGhyb3cgVHlwZUVycm9yKHQrXCIgaXMgbm90IGl0ZXJhYmxlIVwiKTtpZihvKG0pKXtmb3IoZD1hKHQubGVuZ3RoKTtkPl87XysrKWlmKHk9bj9rKHUodj10W19dKVswXSx2WzFdKTprKHRbX10pLHk9PT1zfHx5PT09ZilyZXR1cm4geX1lbHNlIGZvcihwPW0uY2FsbCh0KTshKHY9cC5uZXh0KCkpLmRvbmU7KWlmKHk9aShwLGssdi52YWx1ZSxuKSx5PT09c3x8eT09PWYpcmV0dXJuIHl9O24uQlJFQUs9cyxuLlJFVFVSTj1mfSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbih0LG4sZSl7dmFyIHI9dm9pZCAwPT09ZTtzd2l0Y2gobi5sZW5ndGgpe2Nhc2UgMDpyZXR1cm4gcj90KCk6dC5jYWxsKGUpO2Nhc2UgMTpyZXR1cm4gcj90KG5bMF0pOnQuY2FsbChlLG5bMF0pO2Nhc2UgMjpyZXR1cm4gcj90KG5bMF0sblsxXSk6dC5jYWxsKGUsblswXSxuWzFdKTtjYXNlIDM6cmV0dXJuIHI/dChuWzBdLG5bMV0sblsyXSk6dC5jYWxsKGUsblswXSxuWzFdLG5bMl0pO2Nhc2UgNDpyZXR1cm4gcj90KG5bMF0sblsxXSxuWzJdLG5bM10pOnQuY2FsbChlLG5bMF0sblsxXSxuWzJdLG5bM10pfXJldHVybiB0LmFwcGx5KGUsbil9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyMCk7dC5leHBvcnRzPUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKHQpe3JldHVyblwiQXJyYXlcIj09cih0KX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDQyKSxpPWUoMTgpLG89ZSgyOCksdT17fTtlKDEwKSh1LGUoNCkoXCJpdGVyYXRvclwiKSxmdW5jdGlvbigpe3JldHVybiB0aGlzfSksdC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlKXt0LnByb3RvdHlwZT1yKHUse25leHQ6aSgxLGUpfSksbyh0LG4rXCIgSXRlcmF0b3JcIil9fSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe3JldHVybnt2YWx1ZTpuLGRvbmU6ISF0fX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDIyKSxpPWUoMTIpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe2Zvcih2YXIgZSxvPWkodCksdT1yKG8pLGE9dS5sZW5ndGgsYz0wO2E+YzspaWYob1tlPXVbYysrXV09PT1uKXJldHVybiBlfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMzEpKFwibWV0YVwiKSxpPWUoMTEpLG89ZSgxNSksdT1lKDYpLmYsYT0wLGM9T2JqZWN0LmlzRXh0ZW5zaWJsZXx8ZnVuY3Rpb24oKXtyZXR1cm4hMH0scz0hZSgxMykoZnVuY3Rpb24oKXtyZXR1cm4gYyhPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKX0pLGY9ZnVuY3Rpb24odCl7dSh0LHIse3ZhbHVlOntpOlwiT1wiKyArK2Esdzp7fX19KX0sbD1mdW5jdGlvbih0LG4pe2lmKCFpKHQpKXJldHVyblwic3ltYm9sXCI9PXR5cGVvZiB0P3Q6KFwic3RyaW5nXCI9PXR5cGVvZiB0P1wiU1wiOlwiUFwiKSt0O2lmKCFvKHQscikpe2lmKCFjKHQpKXJldHVyblwiRlwiO2lmKCFuKXJldHVyblwiRVwiO2YodCl9cmV0dXJuIHRbcl0uaX0saD1mdW5jdGlvbih0LG4pe2lmKCFvKHQscikpe2lmKCFjKHQpKXJldHVybiEwO2lmKCFuKXJldHVybiExO2YodCl9cmV0dXJuIHRbcl0ud30sZD1mdW5jdGlvbih0KXtyZXR1cm4gcyYmdi5ORUVEJiZjKHQpJiYhbyh0LHIpJiZmKHQpLHR9LHY9dC5leHBvcnRzPXtLRVk6cixORUVEOiExLGZhc3RLZXk6bCxnZXRXZWFrOmgsb25GcmVlemU6ZH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDMpLGk9ZSg5MSkuc2V0LG89ci5NdXRhdGlvbk9ic2VydmVyfHxyLldlYktpdE11dGF0aW9uT2JzZXJ2ZXIsdT1yLnByb2Nlc3MsYT1yLlByb21pc2UsYz1cInByb2Nlc3NcIj09ZSgyMCkodSk7dC5leHBvcnRzPWZ1bmN0aW9uKCl7dmFyIHQsbixlLHM9ZnVuY3Rpb24oKXt2YXIgcixpO2ZvcihjJiYocj11LmRvbWFpbikmJnIuZXhpdCgpO3Q7KXtpPXQuZm4sdD10Lm5leHQ7dHJ5e2koKX1jYXRjaChvKXt0aHJvdyB0P2UoKTpuPXZvaWQgMCxvfX1uPXZvaWQgMCxyJiZyLmVudGVyKCl9O2lmKGMpZT1mdW5jdGlvbigpe3UubmV4dFRpY2socyl9O2Vsc2UgaWYobyl7dmFyIGY9ITAsbD1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtuZXcgbyhzKS5vYnNlcnZlKGwse2NoYXJhY3RlckRhdGE6ITB9KSxlPWZ1bmN0aW9uKCl7bC5kYXRhPWY9IWZ9fWVsc2UgaWYoYSYmYS5yZXNvbHZlKXt2YXIgaD1hLnJlc29sdmUoKTtlPWZ1bmN0aW9uKCl7aC50aGVuKHMpfX1lbHNlIGU9ZnVuY3Rpb24oKXtpLmNhbGwocixzKX07cmV0dXJuIGZ1bmN0aW9uKHIpe3ZhciBpPXtmbjpyLG5leHQ6dm9pZCAwfTtuJiYobi5uZXh0PWkpLHR8fCh0PWksZSgpKSxuPWl9fX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMjIpLGk9ZSg0NCksbz1lKDI3KSx1PWUoMjkpLGE9ZSg4MSksYz1PYmplY3QuYXNzaWduO3QuZXhwb3J0cz0hY3x8ZSgxMykoZnVuY3Rpb24oKXt2YXIgdD17fSxuPXt9LGU9U3ltYm9sKCkscj1cImFiY2RlZmdoaWprbG1ub3BxcnN0XCI7cmV0dXJuIHRbZV09NyxyLnNwbGl0KFwiXCIpLmZvckVhY2goZnVuY3Rpb24odCl7blt0XT10fSksNyE9Yyh7fSx0KVtlXXx8T2JqZWN0LmtleXMoYyh7fSxuKSkuam9pbihcIlwiKSE9cn0pP2Z1bmN0aW9uKHQsbil7Zm9yKHZhciBlPXUodCksYz1hcmd1bWVudHMubGVuZ3RoLHM9MSxmPWkuZixsPW8uZjtjPnM7KWZvcih2YXIgaCxkPWEoYXJndW1lbnRzW3MrK10pLHY9Zj9yKGQpLmNvbmNhdChmKGQpKTpyKGQpLHA9di5sZW5ndGgseT0wO3A+eTspbC5jYWxsKGQsaD12W3krK10pJiYoZVtoXT1kW2hdKTtyZXR1cm4gZX06Y30sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNiksaT1lKDcpLG89ZSgyMik7dC5leHBvcnRzPWUoNSk/T2JqZWN0LmRlZmluZVByb3BlcnRpZXM6ZnVuY3Rpb24odCxuKXtpKHQpO2Zvcih2YXIgZSx1PW8obiksYT11Lmxlbmd0aCxjPTA7YT5jOylyLmYodCxlPXVbYysrXSxuW2VdKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDEwKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuLGUpe2Zvcih2YXIgaSBpbiBuKWUmJnRbaV0/dFtpXT1uW2ldOnIodCxpLG5baV0pO3JldHVybiB0fX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTEpLGk9ZSg3KSxvPWZ1bmN0aW9uKHQsbil7aWYoaSh0KSwhcihuKSYmbnVsbCE9PW4pdGhyb3cgVHlwZUVycm9yKG4rXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpfTt0LmV4cG9ydHM9e3NldDpPYmplY3Quc2V0UHJvdG90eXBlT2Z8fChcIl9fcHJvdG9fX1wiaW57fT9mdW5jdGlvbih0LG4scil7dHJ5e3I9ZSgxNCkoRnVuY3Rpb24uY2FsbCxlKDQzKS5mKE9iamVjdC5wcm90b3R5cGUsXCJfX3Byb3RvX19cIikuc2V0LDIpLHIodCxbXSksbj0hKHQgaW5zdGFuY2VvZiBBcnJheSl9Y2F0Y2goaSl7bj0hMH1yZXR1cm4gZnVuY3Rpb24odCxlKXtyZXR1cm4gbyh0LGUpLG4/dC5fX3Byb3RvX189ZTpyKHQsZSksdH19KHt9LCExKTp2b2lkIDApLGNoZWNrOm99fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgzKSxpPWUoMiksbz1lKDYpLHU9ZSg1KSxhPWUoNCkoXCJzcGVjaWVzXCIpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXt2YXIgbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpW3RdP2lbdF06clt0XTt1JiZuJiYhblthXSYmby5mKG4sYSx7Y29uZmlndXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzfX0pfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNyksaT1lKDI0KSxvPWUoNCkoXCJzcGVjaWVzXCIpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe3ZhciBlLHU9cih0KS5jb25zdHJ1Y3RvcjtyZXR1cm4gdm9pZCAwPT09dXx8dm9pZCAwPT0oZT1yKHUpW29dKT9uOmkoZSl9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg0OCksaT1lKDM5KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKG4sZSl7dmFyIG8sdSxhPVN0cmluZyhpKG4pKSxjPXIoZSkscz1hLmxlbmd0aDtyZXR1cm4gYzwwfHxjPj1zP3Q/XCJcIjp2b2lkIDA6KG89YS5jaGFyQ29kZUF0KGMpLG88NTUyOTZ8fG8+NTYzMTl8fGMrMT09PXN8fCh1PWEuY2hhckNvZGVBdChjKzEpKTw1NjMyMHx8dT41NzM0Mz90P2EuY2hhckF0KGMpOm86dD9hLnNsaWNlKGMsYysyKTooby01NTI5Njw8MTApKyh1LTU2MzIwKSs2NTUzNil9fX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNDgpLGk9TWF0aC5tYXgsbz1NYXRoLm1pbjt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gdD1yKHQpLHQ8MD9pKHQrbiwwKTpvKHQsbil9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg3KSxpPWUoNTIpO3QuZXhwb3J0cz1lKDIpLmdldEl0ZXJhdG9yPWZ1bmN0aW9uKHQpe3ZhciBuPWkodCk7aWYoXCJmdW5jdGlvblwiIT10eXBlb2Ygbil0aHJvdyBUeXBlRXJyb3IodCtcIiBpcyBub3QgaXRlcmFibGUhXCIpO3JldHVybiByKG4uY2FsbCh0KSl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgxNCksaT1lKDgpLG89ZSgyOSksdT1lKDgzKSxhPWUoODIpLGM9ZSg0OSkscz1lKDEzNyksZj1lKDUyKTtpKGkuUytpLkYqIWUoODUpKGZ1bmN0aW9uKHQpe0FycmF5LmZyb20odCl9KSxcIkFycmF5XCIse2Zyb206ZnVuY3Rpb24odCl7dmFyIG4sZSxpLGwsaD1vKHQpLGQ9XCJmdW5jdGlvblwiPT10eXBlb2YgdGhpcz90aGlzOkFycmF5LHY9YXJndW1lbnRzLmxlbmd0aCxwPXY+MT9hcmd1bWVudHNbMV06dm9pZCAwLHk9dm9pZCAwIT09cCxtPTAsaz1mKGgpO2lmKHkmJihwPXIocCx2PjI/YXJndW1lbnRzWzJdOnZvaWQgMCwyKSksdm9pZCAwPT1rfHxkPT1BcnJheSYmYShrKSlmb3Iobj1jKGgubGVuZ3RoKSxlPW5ldyBkKG4pO24+bTttKyspcyhlLG0seT9wKGhbbV0sbSk6aFttXSk7ZWxzZSBmb3IobD1rLmNhbGwoaCksZT1uZXcgZDshKGk9bC5uZXh0KCkpLmRvbmU7bSsrKXMoZSxtLHk/dShsLHAsW2kudmFsdWUsbV0sITApOmkudmFsdWUpO3JldHVybiBlLmxlbmd0aD1tLGV9fSl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDEzNCksaT1lKDE0Myksbz1lKDIxKSx1PWUoMTIpO3QuZXhwb3J0cz1lKDg0KShBcnJheSxcIkFycmF5XCIsZnVuY3Rpb24odCxuKXt0aGlzLl90PXUodCksdGhpcy5faT0wLHRoaXMuX2s9bn0sZnVuY3Rpb24oKXt2YXIgdD10aGlzLl90LG49dGhpcy5fayxlPXRoaXMuX2krKztyZXR1cm4hdHx8ZT49dC5sZW5ndGg/KHRoaXMuX3Q9dm9pZCAwLGkoMSkpOlwia2V5c1wiPT1uP2koMCxlKTpcInZhbHVlc1wiPT1uP2koMCx0W2VdKTppKDAsW2UsdFtlXV0pfSxcInZhbHVlc1wiKSxvLkFyZ3VtZW50cz1vLkFycmF5LHIoXCJrZXlzXCIpLHIoXCJ2YWx1ZXNcIikscihcImVudHJpZXNcIil9LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDgpO3Ioci5TK3IuRixcIk9iamVjdFwiLHthc3NpZ246ZSgxNDcpfSl9LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDgpO3Ioci5TLFwiT2JqZWN0XCIse2NyZWF0ZTplKDQyKX0pfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgxMiksaT1lKDQzKS5mO2UoNDUpKFwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yXCIsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCxuKXtyZXR1cm4gaShyKHQpLG4pfX0pfSxmdW5jdGlvbih0LG4sZSl7ZSg0NSkoXCJnZXRPd25Qcm9wZXJ0eU5hbWVzXCIsZnVuY3Rpb24oKXtyZXR1cm4gZSg4NikuZn0pfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyOSksaT1lKDg4KTtlKDQ1KShcImdldFByb3RvdHlwZU9mXCIsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIGkocih0KSl9fSl9LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDgpO3Ioci5TLFwiT2JqZWN0XCIse3NldFByb3RvdHlwZU9mOmUoMTUwKS5zZXR9KX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByLGksbyx1PWUoMjYpLGE9ZSgzKSxjPWUoMTQpLHM9ZSg3OSksZj1lKDgpLGw9ZSgxMSksaD1lKDI0KSxkPWUoMTM1KSx2PWUoMTM5KSxwPWUoMTUyKSx5PWUoOTEpLnNldCxtPWUoMTQ2KSgpLGs9XCJQcm9taXNlXCIsXz1hLlR5cGVFcnJvcixnPWEucHJvY2Vzcyx3PWFba10sZz1hLnByb2Nlc3MsYj1cInByb2Nlc3NcIj09cyhnKSx4PWZ1bmN0aW9uKCl7fSxPPSEhZnVuY3Rpb24oKXt0cnl7dmFyIHQ9dy5yZXNvbHZlKDEpLG49KHQuY29uc3RydWN0b3I9e30pW2UoNCkoXCJzcGVjaWVzXCIpXT1mdW5jdGlvbih0KXt0KHgseCl9O3JldHVybihifHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQpJiZ0LnRoZW4oeClpbnN0YW5jZW9mIG59Y2F0Y2gocil7fX0oKSxQPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQ9PT1ufHx0PT09dyYmbj09PW99LEk9ZnVuY3Rpb24odCl7dmFyIG47cmV0dXJuISghbCh0KXx8XCJmdW5jdGlvblwiIT10eXBlb2Yobj10LnRoZW4pKSYmbn0sUz1mdW5jdGlvbih0KXtyZXR1cm4gUCh3LHQpP25ldyBFKHQpOm5ldyBpKHQpfSxFPWk9ZnVuY3Rpb24odCl7dmFyIG4sZTt0aGlzLnByb21pc2U9bmV3IHQoZnVuY3Rpb24odCxyKXtpZih2b2lkIDAhPT1ufHx2b2lkIDAhPT1lKXRocm93IF8oXCJCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvclwiKTtuPXQsZT1yfSksdGhpcy5yZXNvbHZlPWgobiksdGhpcy5yZWplY3Q9aChlKX0sVD1mdW5jdGlvbih0KXt0cnl7dCgpfWNhdGNoKG4pe3JldHVybntlcnJvcjpufX19LGo9ZnVuY3Rpb24odCxuKXtpZighdC5fbil7dC5fbj0hMDt2YXIgZT10Ll9jO20oZnVuY3Rpb24oKXtmb3IodmFyIHI9dC5fdixpPTE9PXQuX3Msbz0wLHU9ZnVuY3Rpb24obil7dmFyIGUsbyx1PWk/bi5vazpuLmZhaWwsYT1uLnJlc29sdmUsYz1uLnJlamVjdCxzPW4uZG9tYWluO3RyeXt1PyhpfHwoMj09dC5faCYmQyh0KSx0Ll9oPTEpLHU9PT0hMD9lPXI6KHMmJnMuZW50ZXIoKSxlPXUocikscyYmcy5leGl0KCkpLGU9PT1uLnByb21pc2U/YyhfKFwiUHJvbWlzZS1jaGFpbiBjeWNsZVwiKSk6KG89SShlKSk/by5jYWxsKGUsYSxjKTphKGUpKTpjKHIpfWNhdGNoKGYpe2MoZil9fTtlLmxlbmd0aD5vOyl1KGVbbysrXSk7dC5fYz1bXSx0Ll9uPSExLG4mJiF0Ll9oJiZNKHQpfSl9fSxNPWZ1bmN0aW9uKHQpe3kuY2FsbChhLGZ1bmN0aW9uKCl7dmFyIG4sZSxyLGk9dC5fdjtpZihGKHQpJiYobj1UKGZ1bmN0aW9uKCl7Yj9nLmVtaXQoXCJ1bmhhbmRsZWRSZWplY3Rpb25cIixpLHQpOihlPWEub251bmhhbmRsZWRyZWplY3Rpb24pP2Uoe3Byb21pc2U6dCxyZWFzb246aX0pOihyPWEuY29uc29sZSkmJnIuZXJyb3ImJnIuZXJyb3IoXCJVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb25cIixpKX0pLHQuX2g9Ynx8Rih0KT8yOjEpLHQuX2E9dm9pZCAwLG4pdGhyb3cgbi5lcnJvcn0pfSxGPWZ1bmN0aW9uKHQpe2lmKDE9PXQuX2gpcmV0dXJuITE7Zm9yKHZhciBuLGU9dC5fYXx8dC5fYyxyPTA7ZS5sZW5ndGg+cjspaWYobj1lW3IrK10sbi5mYWlsfHwhRihuLnByb21pc2UpKXJldHVybiExO3JldHVybiEwfSxDPWZ1bmN0aW9uKHQpe3kuY2FsbChhLGZ1bmN0aW9uKCl7dmFyIG47Yj9nLmVtaXQoXCJyZWplY3Rpb25IYW5kbGVkXCIsdCk6KG49YS5vbnJlamVjdGlvbmhhbmRsZWQpJiZuKHtwcm9taXNlOnQscmVhc29uOnQuX3Z9KX0pfSxBPWZ1bmN0aW9uKHQpe3ZhciBuPXRoaXM7bi5fZHx8KG4uX2Q9ITAsbj1uLl93fHxuLG4uX3Y9dCxuLl9zPTIsbi5fYXx8KG4uX2E9bi5fYy5zbGljZSgpKSxqKG4sITApKX0sUj1mdW5jdGlvbih0KXt2YXIgbixlPXRoaXM7aWYoIWUuX2Qpe2UuX2Q9ITAsZT1lLl93fHxlO3RyeXtpZihlPT09dCl0aHJvdyBfKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7KG49SSh0KSk/bShmdW5jdGlvbigpe3ZhciByPXtfdzplLF9kOiExfTt0cnl7bi5jYWxsKHQsYyhSLHIsMSksYyhBLHIsMSkpfWNhdGNoKGkpe0EuY2FsbChyLGkpfX0pOihlLl92PXQsZS5fcz0xLGooZSwhMSkpfWNhdGNoKHIpe0EuY2FsbCh7X3c6ZSxfZDohMX0scil9fX07T3x8KHc9ZnVuY3Rpb24odCl7ZCh0aGlzLHcsayxcIl9oXCIpLGgodCksci5jYWxsKHRoaXMpO3RyeXt0KGMoUix0aGlzLDEpLGMoQSx0aGlzLDEpKX1jYXRjaChuKXtBLmNhbGwodGhpcyxuKX19LHI9ZnVuY3Rpb24odCl7dGhpcy5fYz1bXSx0aGlzLl9hPXZvaWQgMCx0aGlzLl9zPTAsdGhpcy5fZD0hMSx0aGlzLl92PXZvaWQgMCx0aGlzLl9oPTAsdGhpcy5fbj0hMX0sci5wcm90b3R5cGU9ZSgxNDkpKHcucHJvdG90eXBlLHt0aGVuOmZ1bmN0aW9uKHQsbil7dmFyIGU9UyhwKHRoaXMsdykpO3JldHVybiBlLm9rPVwiZnVuY3Rpb25cIiE9dHlwZW9mIHR8fHQsZS5mYWlsPVwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm4sZS5kb21haW49Yj9nLmRvbWFpbjp2b2lkIDAsdGhpcy5fYy5wdXNoKGUpLHRoaXMuX2EmJnRoaXMuX2EucHVzaChlKSx0aGlzLl9zJiZqKHRoaXMsITEpLGUucHJvbWlzZX0sXCJjYXRjaFwiOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnRoZW4odm9pZCAwLHQpfX0pLEU9ZnVuY3Rpb24oKXt2YXIgdD1uZXcgcjt0aGlzLnByb21pc2U9dCx0aGlzLnJlc29sdmU9YyhSLHQsMSksdGhpcy5yZWplY3Q9YyhBLHQsMSl9KSxmKGYuRytmLlcrZi5GKiFPLHtQcm9taXNlOnd9KSxlKDI4KSh3LGspLGUoMTUxKShrKSxvPWUoMilba10sZihmLlMrZi5GKiFPLGsse3JlamVjdDpmdW5jdGlvbih0KXt2YXIgbj1TKHRoaXMpLGU9bi5yZWplY3Q7cmV0dXJuIGUodCksbi5wcm9taXNlfX0pLGYoZi5TK2YuRioodXx8IU8pLGsse3Jlc29sdmU6ZnVuY3Rpb24odCl7aWYodCBpbnN0YW5jZW9mIHcmJlAodC5jb25zdHJ1Y3Rvcix0aGlzKSlyZXR1cm4gdDt2YXIgbj1TKHRoaXMpLGU9bi5yZXNvbHZlO3JldHVybiBlKHQpLG4ucHJvbWlzZX19KSxmKGYuUytmLkYqIShPJiZlKDg1KShmdW5jdGlvbih0KXt3LmFsbCh0KVtcImNhdGNoXCJdKHgpfSkpLGsse2FsbDpmdW5jdGlvbih0KXt2YXIgbj10aGlzLGU9UyhuKSxyPWUucmVzb2x2ZSxpPWUucmVqZWN0LG89VChmdW5jdGlvbigpe3ZhciBlPVtdLG89MCx1PTE7dih0LCExLGZ1bmN0aW9uKHQpe3ZhciBhPW8rKyxjPSExO2UucHVzaCh2b2lkIDApLHUrKyxuLnJlc29sdmUodCkudGhlbihmdW5jdGlvbih0KXtjfHwoYz0hMCxlW2FdPXQsLS11fHxyKGUpKX0saSl9KSwtLXV8fHIoZSl9KTtyZXR1cm4gbyYmaShvLmVycm9yKSxlLnByb21pc2V9LHJhY2U6ZnVuY3Rpb24odCl7dmFyIG49dGhpcyxlPVMobikscj1lLnJlamVjdCxpPVQoZnVuY3Rpb24oKXt2KHQsITEsZnVuY3Rpb24odCl7bi5yZXNvbHZlKHQpLnRoZW4oZS5yZXNvbHZlLHIpfSl9KTtyZXR1cm4gaSYmcihpLmVycm9yKSxlLnByb21pc2V9fSl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDMpLGk9ZSgxNSksbz1lKDUpLHU9ZSg4KSxhPWUoOTApLGM9ZSgxNDUpLktFWSxzPWUoMTMpLGY9ZSg0NyksbD1lKDI4KSxoPWUoMzEpLGQ9ZSg0KSx2PWUoNTEpLHA9ZSg1MCkseT1lKDE0NCksbT1lKDEzOCksaz1lKDE0MSksXz1lKDcpLGc9ZSgxMiksdz1lKDMwKSxiPWUoMTgpLHg9ZSg0MiksTz1lKDg2KSxQPWUoNDMpLEk9ZSg2KSxTPWUoMjIpLEU9UC5mLFQ9SS5mLGo9Ty5mLE09ci5TeW1ib2wsRj1yLkpTT04sQz1GJiZGLnN0cmluZ2lmeSxBPVwicHJvdG90eXBlXCIsUj1kKFwiX2hpZGRlblwiKSx6PWQoXCJ0b1ByaW1pdGl2ZVwiKSxMPXt9LnByb3BlcnR5SXNFbnVtZXJhYmxlLFc9ZihcInN5bWJvbC1yZWdpc3RyeVwiKSxOPWYoXCJzeW1ib2xzXCIpLEQ9ZihcIm9wLXN5bWJvbHNcIiksVT1PYmplY3RbQV0sSj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBNLHE9ci5RT2JqZWN0LEI9IXF8fCFxW0FdfHwhcVtBXS5maW5kQ2hpbGQsSz1vJiZzKGZ1bmN0aW9uKCl7cmV0dXJuIDchPXgoVCh7fSxcImFcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIFQodGhpcyxcImFcIix7dmFsdWU6N30pLmF9fSkpLmF9KT9mdW5jdGlvbih0LG4sZSl7dmFyIHI9RShVLG4pO3ImJmRlbGV0ZSBVW25dLFQodCxuLGUpLHImJnQhPT1VJiZUKFUsbixyKX06VCxHPWZ1bmN0aW9uKHQpe3ZhciBuPU5bdF09eChNW0FdKTtyZXR1cm4gbi5faz10LG59LFk9SiYmXCJzeW1ib2xcIj09dHlwZW9mIE0uaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuXCJzeW1ib2xcIj09dHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0IGluc3RhbmNlb2YgTX0sSD1mdW5jdGlvbih0LG4sZSl7cmV0dXJuIHQ9PT1VJiZIKEQsbixlKSxfKHQpLG49dyhuLCEwKSxfKGUpLGkoTixuKT8oZS5lbnVtZXJhYmxlPyhpKHQsUikmJnRbUl1bbl0mJih0W1JdW25dPSExKSxlPXgoZSx7ZW51bWVyYWJsZTpiKDAsITEpfSkpOihpKHQsUil8fFQodCxSLGIoMSx7fSkpLHRbUl1bbl09ITApLEsodCxuLGUpKTpUKHQsbixlKX0sVj1mdW5jdGlvbih0LG4pe18odCk7Zm9yKHZhciBlLHI9bShuPWcobikpLGk9MCxvPXIubGVuZ3RoO28+aTspSCh0LGU9cltpKytdLG5bZV0pO3JldHVybiB0fSxYPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHZvaWQgMD09PW4/eCh0KTpWKHgodCksbil9LFE9ZnVuY3Rpb24odCl7dmFyIG49TC5jYWxsKHRoaXMsdD13KHQsITApKTtyZXR1cm4hKHRoaXM9PT1VJiZpKE4sdCkmJiFpKEQsdCkpJiYoIShufHwhaSh0aGlzLHQpfHwhaShOLHQpfHxpKHRoaXMsUikmJnRoaXNbUl1bdF0pfHxuKX0sWj1mdW5jdGlvbih0LG4pe2lmKHQ9Zyh0KSxuPXcobiwhMCksdCE9PVV8fCFpKE4sbil8fGkoRCxuKSl7dmFyIGU9RSh0LG4pO3JldHVybiFlfHwhaShOLG4pfHxpKHQsUikmJnRbUl1bbl18fChlLmVudW1lcmFibGU9ITApLGV9fSwkPWZ1bmN0aW9uKHQpe2Zvcih2YXIgbixlPWooZyh0KSkscj1bXSxvPTA7ZS5sZW5ndGg+bzspaShOLG49ZVtvKytdKXx8bj09Unx8bj09Y3x8ci5wdXNoKG4pO3JldHVybiByfSx0dD1mdW5jdGlvbih0KXtmb3IodmFyIG4sZT10PT09VSxyPWooZT9EOmcodCkpLG89W10sdT0wO3IubGVuZ3RoPnU7KSFpKE4sbj1yW3UrK10pfHxlJiYhaShVLG4pfHxvLnB1c2goTltuXSk7cmV0dXJuIG99O0p8fChNPWZ1bmN0aW9uKCl7aWYodGhpcyBpbnN0YW5jZW9mIE0pdGhyb3cgVHlwZUVycm9yKFwiU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIVwiKTt2YXIgdD1oKGFyZ3VtZW50cy5sZW5ndGg+MD9hcmd1bWVudHNbMF06dm9pZCAwKSxuPWZ1bmN0aW9uKGUpe3RoaXM9PT1VJiZuLmNhbGwoRCxlKSxpKHRoaXMsUikmJmkodGhpc1tSXSx0KSYmKHRoaXNbUl1bdF09ITEpLEsodGhpcyx0LGIoMSxlKSl9O3JldHVybiBvJiZCJiZLKFUsdCx7Y29uZmlndXJhYmxlOiEwLHNldDpufSksRyh0KX0sYShNW0FdLFwidG9TdHJpbmdcIixmdW5jdGlvbigpe3JldHVybiB0aGlzLl9rfSksUC5mPVosSS5mPUgsZSg4NykuZj1PLmY9JCxlKDI3KS5mPVEsZSg0NCkuZj10dCxvJiYhZSgyNikmJmEoVSxcInByb3BlcnR5SXNFbnVtZXJhYmxlXCIsUSwhMCksdi5mPWZ1bmN0aW9uKHQpe3JldHVybiBHKGQodCkpfSksdSh1LkcrdS5XK3UuRiohSix7U3ltYm9sOk19KTtmb3IodmFyIG50PVwiaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXNcIi5zcGxpdChcIixcIiksZXQ9MDtudC5sZW5ndGg+ZXQ7KWQobnRbZXQrK10pO2Zvcih2YXIgbnQ9UyhkLnN0b3JlKSxldD0wO250Lmxlbmd0aD5ldDspcChudFtldCsrXSk7dSh1LlMrdS5GKiFKLFwiU3ltYm9sXCIse1wiZm9yXCI6ZnVuY3Rpb24odCl7cmV0dXJuIGkoVyx0Kz1cIlwiKT9XW3RdOldbdF09TSh0KX0sa2V5Rm9yOmZ1bmN0aW9uKHQpe2lmKFkodCkpcmV0dXJuIHkoVyx0KTt0aHJvdyBUeXBlRXJyb3IodCtcIiBpcyBub3QgYSBzeW1ib2whXCIpfSx1c2VTZXR0ZXI6ZnVuY3Rpb24oKXtCPSEwfSx1c2VTaW1wbGU6ZnVuY3Rpb24oKXtCPSExfX0pLHUodS5TK3UuRiohSixcIk9iamVjdFwiLHtjcmVhdGU6WCxkZWZpbmVQcm9wZXJ0eTpILGRlZmluZVByb3BlcnRpZXM6VixnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6WixnZXRPd25Qcm9wZXJ0eU5hbWVzOiQsZ2V0T3duUHJvcGVydHlTeW1ib2xzOnR0fSksRiYmdSh1LlMrdS5GKighSnx8cyhmdW5jdGlvbigpe3ZhciB0PU0oKTtyZXR1cm5cIltudWxsXVwiIT1DKFt0XSl8fFwie31cIiE9Qyh7YTp0fSl8fFwie31cIiE9QyhPYmplY3QodCkpfSkpLFwiSlNPTlwiLHtzdHJpbmdpZnk6ZnVuY3Rpb24odCl7aWYodm9pZCAwIT09dCYmIVkodCkpe2Zvcih2YXIgbixlLHI9W3RdLGk9MTthcmd1bWVudHMubGVuZ3RoPmk7KXIucHVzaChhcmd1bWVudHNbaSsrXSk7cmV0dXJuIG49clsxXSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYoZT1uKSwhZSYmayhuKXx8KG49ZnVuY3Rpb24odCxuKXtpZihlJiYobj1lLmNhbGwodGhpcyx0LG4pKSwhWShuKSlyZXR1cm4gbn0pLHJbMV09bixDLmFwcGx5KEYscil9fX0pLE1bQV1bel18fGUoMTApKE1bQV0seixNW0FdLnZhbHVlT2YpLGwoTSxcIlN5bWJvbFwiKSxsKE1hdGgsXCJNYXRoXCIsITApLGwoci5KU09OLFwiSlNPTlwiLCEwKX0sZnVuY3Rpb24odCxuLGUpe2UoNTApKFwiYXN5bmNJdGVyYXRvclwiKX0sZnVuY3Rpb24odCxuLGUpe2UoNTApKFwib2JzZXJ2YWJsZVwiKX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz1mdW5jdGlvbigpe3JldHVybiBuZXcgV29ya2VyKGUucCtcIndvcmtlci1zbGF2ZS5wYXJhbGxlbC5qc1wiKX19LCxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg5OSlbXCJkZWZhdWx0XCJdO3QuZXhwb3J0cz1yfV0pKX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnJvd3Nlci1jb21tb25qcy5wYXJhbGxlbC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcGFyYWxsZWwtZXMvZGlzdC9icm93c2VyLWNvbW1vbmpzLnBhcmFsbGVsLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMiIsImltcG9ydCBwYXJhbGxlbCwge0lQYXJhbGxlbE9wdGlvbnN9IGZyb20gXCJwYXJhbGxlbC1lc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb29yZGluYXRlIHtcbiAgICByZWFkb25seSB4OiBudW1iZXI7XG4gICAgcmVhZG9ubHkgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElLbmlnaHRUb3VyRW52aXJvbm1lbnQge1xuICAgIGJvYXJkU2l6ZTogbnVtYmVyO1xuICAgIGJvYXJkOiBudW1iZXJbXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRW52aXJvbm1lbnQoYm9hcmRTaXplOiBudW1iZXIpOiBJS25pZ2h0VG91ckVudmlyb25tZW50IHtcbiAgICBjb25zdCBib2FyZDogbnVtYmVyW10gPSBuZXcgQXJyYXkoYm9hcmRTaXplICogYm9hcmRTaXplKTtcbiAgICBib2FyZC5maWxsKDApO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJvYXJkLFxuICAgICAgICBib2FyZFNpemVcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24ga25pZ2h0VG91cnMoc3RhcnRQYXRoOiBJQ29vcmRpbmF0ZVtdLCBlbnZpcm9ubWVudDogSUtuaWdodFRvdXJFbnZpcm9ubWVudCk6IG51bWJlciB7XG4gICAgY29uc3QgbW92ZXMgPSBbXG4gICAgICAgIHsgeDogLTIsIHk6IC0xIH0sIHsgeDogLTIsIHk6IDF9LCB7IHg6IC0xLCB5OiAtMiB9LCB7IHg6IC0xLCB5OiAyIH0sXG4gICAgICAgIHsgeDogMSwgeTogLTIgfSwgeyB4OiAxLCB5OiAyfSwgeyB4OiAyLCB5OiAtMSB9LCB7IHg6IDIsIHk6IDEgfVxuICAgIF07XG4gICAgY29uc3QgYm9hcmRTaXplID0gZW52aXJvbm1lbnQuYm9hcmRTaXplO1xuICAgIGNvbnN0IGJvYXJkID0gZW52aXJvbm1lbnQuYm9hcmQ7XG4gICAgY29uc3QgbnVtYmVyT2ZGaWVsZHMgPSBib2FyZFNpemUgKiBib2FyZFNpemU7XG4gICAgbGV0IHJlc3VsdHM6IG51bWJlciA9IDA7XG4gICAgY29uc3Qgc3RhY2s6IHsgY29vcmRpbmF0ZTogSUNvb3JkaW5hdGUsIG46IG51bWJlciB9W10gPSBzdGFydFBhdGgubWFwKChwb3MsIGluZGV4KSA9PiAoeyBjb29yZGluYXRlOiBwb3MsIG46IGluZGV4ICsgMSB9KSk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3RhcnRQYXRoLmxlbmd0aCAtIDE7ICsraW5kZXgpIHtcbiAgICAgICAgY29uc3QgZmllbGRJbmRleCA9IHN0YXJ0UGF0aFtpbmRleF0ueCAqIGJvYXJkU2l6ZSArIHN0YXJ0UGF0aFtpbmRleF0ueTtcbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBpbmRleCArIDE7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgeyBjb29yZGluYXRlLCBuIH0gPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgZmllbGRJbmRleCA9IGNvb3JkaW5hdGUueCAqIGJvYXJkU2l6ZSArIGNvb3JkaW5hdGUueTtcblxuICAgICAgICBpZiAoYm9hcmRbZmllbGRJbmRleF0gIT09IDApIHtcbiAgICAgICAgICAgIC8vIGJhY2sgdHJhY2tpbmdcbiAgICAgICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gMDtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpOyAvLyByZW1vdmUgY3VycmVudCB2YWx1ZVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbnRyeVxuICAgICAgICBpZiAobiA9PT0gbnVtYmVyT2ZGaWVsZHMpIHtcbiAgICAgICAgICAgICsrcmVzdWx0cztcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IG4hO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW92ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG1vdmUgPSBtb3Zlc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NvciA9IHsgeDogY29vcmRpbmF0ZS54ICsgbW92ZS54LCB5OiBjb29yZGluYXRlLnkgKyBtb3ZlLnkgfTtcbiAgICAgICAgICAgIC8vIG5vdCBvdXRzaWRlIG9mIGJvYXJkIGFuZCBub3QgeWV0IGFjY2Vzc2VkXG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NpYmxlID0gc3VjY2Vzc29yLnggPj0gMCAmJiBzdWNjZXNzb3IueSA+PSAwICYmIHN1Y2Nlc3Nvci54IDwgYm9hcmRTaXplICYmICBzdWNjZXNzb3IueSA8IGJvYXJkU2l6ZSAmJiBib2FyZFtzdWNjZXNzb3IueCAqIGJvYXJkU2l6ZSArIHN1Y2Nlc3Nvci55XSA9PT0gMDtcblxuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHsgY29vcmRpbmF0ZTogc3VjY2Vzc29yLCBuOiBuICsgMSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxLbmlnaHRUb3VycyhzdGFydDogSUNvb3JkaW5hdGUsIGJvYXJkU2l6ZTogbnVtYmVyLCBvcHRpb25zPzogSVBhcmFsbGVsT3B0aW9ucyk6IFByb21pc2VMaWtlPG51bWJlcj4ge1xuXG4gICAgZnVuY3Rpb24gc3VjY2Vzc29ycyhjb29yZGluYXRlOiBJQ29vcmRpbmF0ZSkge1xuICAgICAgICBjb25zdCBtb3ZlcyA9IFtcbiAgICAgICAgICAgIHt4OiAtMiwgeTogLTF9LCB7eDogLTIsIHk6IDF9LCB7eDogLTEsIHk6IC0yfSwge3g6IC0xLCB5OiAyfSxcbiAgICAgICAgICAgIHt4OiAxLCB5OiAtMn0sIHt4OiAxLCB5OiAyfSwge3g6IDIsIHk6IC0xfSwge3g6IDIsIHk6IDF9XG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgbW92ZSBvZiBtb3Zlcykge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc29yID0ge3g6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55fTtcbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc2libGUgPSBzdWNjZXNzb3IueCA+PSAwICYmIHN1Y2Nlc3Nvci55ID49IDAgJiYgc3VjY2Vzc29yLnggPCBib2FyZFNpemUgJiYgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiZcbiAgICAgICAgICAgICAgICAoc3VjY2Vzc29yLnggIT09IHN0YXJ0LnggfHwgc3VjY2Vzc29yLnkgIT09IHN0YXJ0LnkpICYmIChzdWNjZXNzb3IueCAhPT0gY29vcmRpbmF0ZS54ICYmIHN1Y2Nlc3Nvci55ICE9PSBjb29yZGluYXRlLnkpO1xuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChzdWNjZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlU3RhcnRGaWVsZHMoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoc3RhcnQpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGluZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoZGlyZWN0U3VjY2Vzc29yKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFtzdGFydCwgZGlyZWN0U3VjY2Vzc29yLCBpbmRpcmVjdFN1Y2Nlc3Nvcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBsZXQgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5mcm9tKGNvbXB1dGVTdGFydEZpZWxkcygpLCBvcHRpb25zKVxuICAgICAgICAuaW5FbnZpcm9ubWVudChjcmVhdGVFbnZpcm9ubWVudCwgYm9hcmRTaXplKVxuICAgICAgICAubWFwKGtuaWdodFRvdXJzKVxuICAgICAgICAucmVkdWNlKDAsIChtZW1vLCBjb3VudCkgPT4gbWVtbyArIGNvdW50KVxuICAgICAgICAuc3Vic2NyaWJlKHN1YlJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0b3VycyBvZiBzdWJSZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgKz0gdG91cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1jb25zb2xlICovXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0b3RhbCAvIChwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0VGltZSkgKiAxMDAwfSByZXN1bHRzIHBlciBzZWNvbmRgKTtcbiAgICAgICAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZHluYW1pYy9rbmlnaHRzLXRvdXIudHMiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ29tcGxleE51bWJlciB7XG4gICAgaTogbnVtYmVyO1xuICAgIHJlYWw6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTWFuZGVsYnJvdE9wdGlvbnMge1xuICAgIGltYWdlSGVpZ2h0OiBudW1iZXI7XG4gICAgaW1hZ2VXaWR0aDogbnVtYmVyO1xuICAgIGl0ZXJhdGlvbnM6IG51bWJlcjtcbiAgICBtYXg6IElDb21wbGV4TnVtYmVyO1xuICAgIG1pbjogSUNvbXBsZXhOdW1iZXI7XG4gICAgc2NhbGluZ0ZhY3RvcjogSUNvbXBsZXhOdW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYW5kZWxPcHRpb25zKGltYWdlV2lkdGg6IG51bWJlciwgaW1hZ2VIZWlnaHQ6IG51bWJlciwgaXRlcmF0aW9uczogbnVtYmVyKTogSU1hbmRlbGJyb3RPcHRpb25zIHtcbiAgICAvLyBYIGF4aXMgc2hvd3MgcmVhbCBudW1iZXJzLCB5IGF4aXMgaW1hZ2luYXJ5XG4gICAgY29uc3QgbWluID0geyBpOiAtMS4yLCByZWFsOiAtMi4wIH07XG4gICAgY29uc3QgbWF4ID0geyBpOiAwLCByZWFsOiAxLjAgfTtcbiAgICBtYXguaSA9IG1pbi5pICsgKG1heC5yZWFsIC0gbWluLnJlYWwpICogaW1hZ2VIZWlnaHQgLyBpbWFnZVdpZHRoO1xuXG4gICAgY29uc3Qgc2NhbGluZ0ZhY3RvciA9IHtcbiAgICAgICAgaTogKG1heC5pIC0gbWluLmkpIC8gKGltYWdlSGVpZ2h0IC0gMSksXG4gICAgICAgIHJlYWw6IChtYXgucmVhbCAtIG1pbi5yZWFsKSAvIChpbWFnZVdpZHRoIC0gMSlcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW1hZ2VIZWlnaHQsXG4gICAgICAgIGltYWdlV2lkdGgsXG4gICAgICAgIGl0ZXJhdGlvbnMsXG4gICAgICAgIG1heCxcbiAgICAgICAgbWluLFxuICAgICAgICBzY2FsaW5nRmFjdG9yXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXB1dGVNYW5kZWxicm90TGluZSh5OiBudW1iZXIsIG9wdGlvbnM6IElNYW5kZWxicm90T3B0aW9ucyk6IFVpbnQ4Q2xhbXBlZEFycmF5IHtcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVaKGM6IElDb21wbGV4TnVtYmVyKTogeyB6OiBJQ29tcGxleE51bWJlciwgbjogbnVtYmVyIH0ge1xuICAgICAgICBjb25zdCB6ID0geyBpOiBjLmksIHJlYWw6IGMucmVhbCB9O1xuICAgICAgICBsZXQgbiA9IDA7XG5cbiAgICAgICAgZm9yICg7IG4gPCBvcHRpb25zLml0ZXJhdGlvbnM7ICsrbikge1xuICAgICAgICAgICAgaWYgKHoucmVhbCAqKiAyICsgei5pICoqIDIgPiA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHogKiogMiArIGNcbiAgICAgICAgICAgIGNvbnN0IHpJID0gei5pO1xuICAgICAgICAgICAgei5pID0gMiAqIHoucmVhbCAqIHouaSArIGMuaTtcbiAgICAgICAgICAgIHoucmVhbCA9IHoucmVhbCAqKiAyIC0gekkgKiogMiArIGMucmVhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHosIG4gfTtcbiAgICB9XG5cbiAgICBjb25zdCBsaW5lID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KG9wdGlvbnMuaW1hZ2VXaWR0aCAqIDQpO1xuICAgIGNvbnN0IGNJID0gb3B0aW9ucy5tYXguaSAtIHkgKiBvcHRpb25zLnNjYWxpbmdGYWN0b3IuaTtcblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgb3B0aW9ucy5pbWFnZVdpZHRoOyArK3gpIHtcbiAgICAgICAgY29uc3QgYyA9IHtcbiAgICAgICAgICAgIGk6IGNJLFxuICAgICAgICAgICAgcmVhbDogb3B0aW9ucy5taW4ucmVhbCArIHggKiBvcHRpb25zLnNjYWxpbmdGYWN0b3IucmVhbFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHsgbiB9ID0gY2FsY3VsYXRlWihjKTtcbiAgICAgICAgY29uc3QgYmFzZSA9IHggKiA0O1xuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXG4gICAgICAgIGxpbmVbYmFzZV0gPSBuICYgMHhGRjtcbiAgICAgICAgbGluZVtiYXNlICsgMV0gPSBuICYgMHhGRjAwO1xuICAgICAgICBsaW5lW2Jhc2UgKyAyXSA9IG4gJiAweEZGMDAwMDtcbiAgICAgICAgbGluZVtiYXNlICsgM10gPSAyNTU7XG4gICAgfVxuICAgIHJldHVybiBsaW5lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxNYW5kZWxicm90KG1hbmRlbGJyb3RPcHRpb25zOiBJTWFuZGVsYnJvdE9wdGlvbnMsIG9wdGlvbnM/OiBJUGFyYWxsZWxPcHRpb25zKSB7XG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5yYW5nZSgwLCBtYW5kZWxicm90T3B0aW9ucy5pbWFnZUhlaWdodCwgMSwgb3B0aW9ucylcbiAgICAgICAgLmluRW52aXJvbm1lbnQobWFuZGVsYnJvdE9wdGlvbnMpXG4gICAgICAgIC5tYXAoY29tcHV0ZU1hbmRlbGJyb3RMaW5lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bmNNYW5kZWxicm90KG1hbmRlbGJyb3RPcHRpb25zOiBJTWFuZGVsYnJvdE9wdGlvbnMsIGNhbGxiYWNrOiAobGluZTogVWludDhDbGFtcGVkQXJyYXksIHk6IG51bWJlcikgPT4gdm9pZCkge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgbWFuZGVsYnJvdE9wdGlvbnMuaW1hZ2VIZWlnaHQ7ICsreSkge1xuICAgICAgICBjb25zdCBsaW5lID0gY29tcHV0ZU1hbmRlbGJyb3RMaW5lKHksIG1hbmRlbGJyb3RPcHRpb25zKTtcbiAgICAgICAgY2FsbGJhY2sobGluZSwgeSk7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2R5bmFtaWMvbWFuZGVsYnJvdC50cyIsImltcG9ydCBwYXJhbGxlbCBmcm9tIFwicGFyYWxsZWwtZXNcIjtcbmltcG9ydCB7RGljdGlvbmFyeX0gZnJvbSBcImxvZGFzaFwiO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTpuby12YXItcmVxdWlyZXMgKi9cbi8vIGRlY2xhcmUgZnVuY3Rpb24gcmVxdWlyZShuYW1lOiBzdHJpbmcpOiBhbnk7XG4vLyBjb25zdCBSYW5kb20gPSByZXF1aXJlKFwic2ltanMtcmFuZG9tXCIpO1xuLy8gY29uc3QgcmFuZG9tID0gbmV3IFJhbmRvbSgxMCk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb2plY3Qge1xuICAgIHN0YXJ0WWVhcjogbnVtYmVyO1xuICAgIHRvdGFsQW1vdW50OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJQnVja2V0IHtcbiAgICBtaW46IG51bWJlcjtcbiAgICBtYXg6IG51bWJlcjtcblxuICAgIHN1YkJ1Y2tldHM6IHsgW2dyb3VwTmFtZTogc3RyaW5nXTogeyBncm91cDogc3RyaW5nOyBtaW46IG51bWJlciwgbWF4OiBudW1iZXIgfSB9O1xufVxuXG5pbnRlcmZhY2UgSUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdW5pcXVlIG5hbWUgb2YgdGhpcyBncm91cFxuICAgICAqL1xuICAgIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgZ3JvdXBcbiAgICAgKi9cbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIGEgc2VwYXJhdG9yIGxpbmUgYmVlbiBkcmF3biBmb3IgdGhpcyBncm91cD9cbiAgICAgKi9cbiAgICBzZXBhcmF0b3I6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBXaGF0cyB0aGUgcGVyY2VudGFnZSBvZiB2YWx1ZXMgaW4gdGhpcyBncm91cCB0byB0aGUgdG90YWwgbnVtYmVyIG9mIHNpbXVsYXRlZCB2YWx1ZXNcbiAgICAgKi9cbiAgICBwZXJjZW50YWdlOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBXaGF0cyB0aGUgbWluaW11bSB2YWx1ZSB0aGF0IGlzIHN0aWxsIHBhcnQgb2YgdGhpcyBncm91cFxuICAgICAqL1xuICAgIGZyb20/OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1heGltdW0gdmFsdWUgKGV4Y2x1c2l2ZSkgdGhhdCBkZWZpbmVzIHRoZSB1cHBlciBlbmQgb2YgdGhpcyBncm91cFxuICAgICAqL1xuICAgIHRvPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0UmVzdWx0IHtcbiAgICAvKipcbiAgICAgKiBUaGUgbWluaW1hbCBzaW11bGF0ZWQgdmFsdWUgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1pbjogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbWFsIHNpbXVsYXRlZCB2YWx1ZVxuICAgICAqL1xuICAgIG1heDogbnVtYmVyO1xuXG4gICAgLyoqIFRoZSBtZWRpYW4gb2YgdGhlIHZhbHVlcyBmb3VuZCBmb3IgdGhpcyBwcm9qZWN0XG4gICAgICovXG4gICAgbWVkaWFuOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHdoZXJlIHRoZSAyLzMgb2YgdGhlIHNpbXVsYXRlZCB2YWx1ZXMgc3RhcnQgLyBlbmQuXG4gICAgICovXG4gICAgdHdvVGhpcmQ6IHtcbiAgICAgICAgbWluOiBudW1iZXI7XG4gICAgICAgIG1heDogbnVtYmVyO1xuICAgIH07XG5cbiAgICBidWNrZXRzOiBJQnVja2V0W107XG5cbiAgICBncm91cHM6IElHcm91cFtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHByb2plY3RcbiAgICAgKi9cbiAgICBwcm9qZWN0OiBJUHJvamVjdDtcbn1cblxuaW50ZXJmYWNlIElNb250ZUNhcmxvRW52aXJvbm1lbnQge1xuICAgIGludmVzdG1lbnRBbW91bnQ6IG51bWJlcjtcbiAgICBsaXF1aWRpdHk6IG51bWJlcjtcbiAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZTogbnVtYmVyW107XG4gICAgbnVtUnVuczogbnVtYmVyO1xuICAgIG51bVllYXJzOiBudW1iZXI7XG4gICAgcHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPjtcbiAgICBzaW11bGF0ZWRWYWx1ZXM6IG51bWJlcltdW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgbnVtWWVhcnM/OiBudW1iZXI7XG4gICAgbnVtUnVucz86IG51bWJlcjtcbiAgICBwcm9qZWN0cz86IElQcm9qZWN0W107XG4gICAgaW52ZXN0bWVudEFtb3VudD86IG51bWJlcjtcbiAgICBwZXJmb3JtYW5jZT86IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHZvbGF0aWxpdHk6IG51bWJlcjtcbiAgICBsaXF1aWRpdHk/OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzOiBudW1iZXI7XG4gICAgbnVtUnVuczogbnVtYmVyO1xuICAgIHByb2plY3RzOiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ6IG51bWJlcjtcbiAgICBwZXJmb3JtYW5jZTogbnVtYmVyO1xuICAgIHNlZWQ/OiBudW1iZXI7XG4gICAgdGFza0luZGV4PzogbnVtYmVyO1xuICAgIHZhbHVlc1Blcldvcmtlcj86IG51bWJlcjtcbiAgICBsaXF1aWRpdHk6IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVPcHRpb25zKG9wdGlvbnM/OiBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zKTogSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICBpbnZlc3RtZW50QW1vdW50OiAxMDAwMDAwLFxuICAgICAgICBsaXF1aWRpdHk6IDEwMDAwLFxuICAgICAgICBudW1SdW5zOiAxMDAwMCxcbiAgICAgICAgbnVtWWVhcnM6IDEwLFxuICAgICAgICBwZXJmb3JtYW5jZTogMCxcbiAgICAgICAgcHJvamVjdHM6IFtdLFxuICAgICAgICBzZWVkOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbGF0aWxpdHk6IDAuMDFcbiAgICB9LCBvcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50KG9wdGlvbnM6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElNb250ZUNhcmxvRW52aXJvbm1lbnQge1xuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBtb250ZSBjYXJsbyBzaW11bGF0aW9uIGZvciBhbGwgeWVhcnMgYW5kIG51bSBydW5zLlxuICAgICAqIEBwYXJhbSBjYXNoRmxvd3MgdGhlIGNhc2ggZmxvd3NcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW11bXX0gdGhlIHNpbXVsYXRlZCBvdXRjb21lcyBncm91cGVkIGJ5IHllYXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93czogbnVtYmVyW10sIG51bVllYXJzOiBudW1iZXIpOiBudW1iZXJbXVtdICB7XG4gICAgICAgIGZ1bmN0aW9uIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXM6IG51bWJlcltdKSB7XG4gICAgICAgICAgICBsZXQgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50O1xuICAgICAgICAgICAgbGV0IHByZXZpb3VzWWVhckluZGV4ID0gMTAwO1xuXG4gICAgICAgICAgICBmb3IgKGxldCByZWxhdGl2ZVllYXIgPSAwOyByZWxhdGl2ZVllYXIgPCBpbmRpY2VzLmxlbmd0aDsgKytyZWxhdGl2ZVllYXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhckluZGV4ID0gaW5kaWNlc1tyZWxhdGl2ZVllYXJdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhc2hGbG93U3RhcnRPZlllYXIgPSByZWxhdGl2ZVllYXIgPT09IDAgPyAwIDogY2FzaEZsb3dzW3JlbGF0aXZlWWVhciAtIDFdO1xuXG4gICAgICAgICAgICAgICAgLy8gc2NhbGUgY3VycmVudCB2YWx1ZSB3aXRoIHBlcmZvcm1hbmNlIGdhaW4gYWNjb3JkaW5nIHRvIGluZGV4XG4gICAgICAgICAgICAgICAgY29uc3QgcGVyZm9ybWFuY2UgPSBjdXJyZW50WWVhckluZGV4IC8gcHJldmlvdXNZZWFySW5kZXg7XG4gICAgICAgICAgICAgICAgY3VycmVudFBvcnRmb2xpb1ZhbHVlID0gKGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSArIGNhc2hGbG93U3RhcnRPZlllYXIpICogcGVyZm9ybWFuY2U7XG5cbiAgICAgICAgICAgICAgICBpbmRpY2VzW3JlbGF0aXZlWWVhcl0gPSBNYXRoLnJvdW5kKGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSk7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNZZWFySW5kZXggPSBjdXJyZW50WWVhckluZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaW5kaWNlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdDogbnVtYmVyW11bXSA9IG5ldyBBcnJheShvcHRpb25zLm51bVllYXJzKTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPD0gbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgcmVzdWx0W3llYXJdID0gbmV3IEFycmF5KG9wdGlvbnMubnVtUnVucyk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBydW4gPSAwOyBydW4gPCBvcHRpb25zLm51bVJ1bnM7IHJ1bisrKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzID0gWzEwMF07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bVllYXJzOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zdCByYW5kb21QZXJmb3JtYW5jZSA9IDEgKyByYW5kb20ubm9ybWFsKG9wdGlvbnMucGVyZm9ybWFuY2UsIG9wdGlvbnMudm9sYXRpbGl0eSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tUGVyZm9ybWFuY2UgPSAxICsgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kaWNlc1tpIC0gMV0gKiByYW5kb21QZXJmb3JtYW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdGhlIHJlbGF0aXZlIHZhbHVlcyBmcm9tIGFib3ZlIHRvIGFic29sdXRlIHZhbHVlcy5cbiAgICAgICAgICAgIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXMpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IGluZGljZXMubGVuZ3RoOyArK3llYXIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbeWVhcl1bcnVuXSA9IGluZGljZXNbeWVhcl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2plY3RzVG9DYXNoRmxvd3MoKSB7XG4gICAgICAgIGNvbnN0IGNhc2hGbG93czogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBvcHRpb25zLm51bVllYXJzOyArK3llYXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RzQnlUaGlzWWVhciA9IHByb2plY3RzQnlTdGFydFllYXJbeWVhcl0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBjYXNoRmxvdyA9IC1wcm9qZWN0c0J5VGhpc1llYXIucmVkdWNlKChtZW1vLCBwcm9qZWN0KSA9PiBtZW1vICsgcHJvamVjdC50b3RhbEFtb3VudCwgMCk7XG4gICAgICAgICAgICBjYXNoRmxvd3MucHVzaChjYXNoRmxvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhc2hGbG93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVOb0ludGVyZXN0UmVmZXJlbmNlTGluZShjYXNoRmxvd3M6IG51bWJlcltdKSB7XG4gICAgICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBpbnZlc3RtZW50QW1vdW50TGVmdCA9IG9wdGlvbnMuaW52ZXN0bWVudEFtb3VudDtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBvcHRpb25zLm51bVllYXJzOyArK3llYXIpIHtcbiAgICAgICAgICAgIGludmVzdG1lbnRBbW91bnRMZWZ0ID0gaW52ZXN0bWVudEFtb3VudExlZnQgKyBjYXNoRmxvd3NbeWVhcl07XG4gICAgICAgICAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZS5wdXNoKGludmVzdG1lbnRBbW91bnRMZWZ0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU7XG4gICAgfVxuXG4gICAgbGV0IHByb2plY3RzVG9TaW11bGF0ZTogSVByb2plY3RbXSA9IG9wdGlvbnMucHJvamVjdHM7XG5cbiAgICBpZiAob3B0aW9ucy50YXNrSW5kZXggJiYgb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIpIHtcbiAgICAgICAgcHJvamVjdHNUb1NpbXVsYXRlID0gb3B0aW9ucy5wcm9qZWN0cy5zbGljZShvcHRpb25zLnRhc2tJbmRleCAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyLCAob3B0aW9ucy50YXNrSW5kZXggKyAxKSAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9qZWN0cyA9IG9wdGlvbnMucHJvamVjdHMuc29ydCgoYSwgYikgPT4gYS5zdGFydFllYXIgLSBiLnN0YXJ0WWVhcik7XG5cbiAgICAvLyBHcm91cCBwcm9qZWN0cyBieSBzdGFydFllYXIsIHVzZSBsb2Rhc2ggZ3JvdXBCeSBpbnN0ZWFkXG4gICAgY29uc3QgcHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPiA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzW2ldO1xuICAgICAgICBjb25zdCBhcnIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXSA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdIHx8IFtdO1xuICAgICAgICBhcnIucHVzaChwcm9qZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBjYXNoRmxvd3MgPSBwcm9qZWN0c1RvQ2FzaEZsb3dzKCk7XG4gICAgY29uc3Qgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUgPSBjYWxjdWxhdGVOb0ludGVyZXN0UmVmZXJlbmNlTGluZShjYXNoRmxvd3MpO1xuXG4gICAgY29uc3QgbnVtWWVhcnMgPSBwcm9qZWN0c1RvU2ltdWxhdGUucmVkdWNlKChtZW1vLCBwcm9qZWN0KSA9PiBNYXRoLm1heChtZW1vLCBwcm9qZWN0LnN0YXJ0WWVhciksIDApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LFxuICAgICAgICBsaXF1aWRpdHk6IG9wdGlvbnMubGlxdWlkaXR5LFxuICAgICAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZSxcbiAgICAgICAgbnVtUnVuczogb3B0aW9ucy5udW1SdW5zLFxuICAgICAgICBudW1ZZWFycyxcbiAgICAgICAgcHJvamVjdHNCeVN0YXJ0WWVhcixcbiAgICAgICAgc2ltdWxhdGVkVmFsdWVzOiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93cywgbnVtWWVhcnMpXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlUHJvamVjdChwcm9qZWN0OiBJUHJvamVjdCwgZW52aXJvbm1lbnQ6IElNb250ZUNhcmxvRW52aXJvbm1lbnQpOiBJUHJvamVjdFJlc3VsdCB7XG4gICAgY29uc3QgTlVNQkVSX09GX0JVQ0tFVFMgPSAxMDtcbiAgICBmdW5jdGlvbiBncm91cEZvclZhbHVlKHZhbHVlOiBudW1iZXIsIGdyb3VwczogSUdyb3VwW10pOiBJR3JvdXAge1xuICAgICAgICByZXR1cm4gZ3JvdXBzLmZpbmQoZ3JvdXAgPT4gKHR5cGVvZiBncm91cC5mcm9tID09PSBcInVuZGVmaW5lZFwiIHx8IGdyb3VwLmZyb20gPD0gdmFsdWUpICYmICh0eXBlb2YgZ3JvdXAudG8gPT09IFwidW5kZWZpbmVkXCIgfHwgZ3JvdXAudG8gPiB2YWx1ZSkpITtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVHcm91cHMocmVxdWlyZWRBbW91bnQ6IG51bWJlciwgbm9JbnRlcmVzdFJlZmVyZW5jZTogbnVtYmVyKTogSUdyb3VwW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJaaWVsIGVycmVpY2hiYXJcIiwgZnJvbTogcmVxdWlyZWRBbW91bnQsIG5hbWU6IFwiZ3JlZW5cIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiB0cnVlfSxcbiAgICAgICAgICAgIHsgZGVzY3JpcHRpb246IFwibWl0IFp1c2F0emxpcXVpZGl0w6R0IGVycmVpY2hiYXJcIiwgZnJvbTogcmVxdWlyZWRBbW91bnQgLSBlbnZpcm9ubWVudC5saXF1aWRpdHksIG5hbWU6IFwieWVsbG93XCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZSwgdG86IHJlcXVpcmVkQW1vdW50IH0sXG4gICAgICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIm5pY2h0IGVycmVpY2hiYXJcIiwgZnJvbTogbm9JbnRlcmVzdFJlZmVyZW5jZSwgbmFtZTogXCJncmF5XCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogZmFsc2UsIHRvOiByZXF1aXJlZEFtb3VudCAtIGVudmlyb25tZW50LmxpcXVpZGl0eSB9LFxuICAgICAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJuaWNodCBlcnJlaWNoYmFyLCBtaXQgVmVybHVzdFwiLCBuYW1lOiBcInJlZFwiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IGZhbHNlLCB0bzogbm9JbnRlcmVzdFJlZmVyZW5jZSB9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlUmVxdWlyZWRBbW91bnQoKSB7XG4gICAgICAgIGxldCBhbW91bnQgPSBwcm9qZWN0LnRvdGFsQW1vdW50O1xuICAgICAgICBjb25zdCBwcm9qZWN0c1NhbWVZZWFyID0gZW52aXJvbm1lbnQucHJvamVjdHNCeVN0YXJ0WWVhcltwcm9qZWN0LnN0YXJ0WWVhcl07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c1NhbWVZZWFyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBvdGhlclByb2plY3QgPSBwcm9qZWN0c1NhbWVZZWFyW2ldO1xuICAgICAgICAgICAgaWYgKG90aGVyUHJvamVjdCA9PT0gcHJvamVjdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW1vdW50ICs9IG90aGVyUHJvamVjdC50b3RhbEFtb3VudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW1vdW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lZGlhbih2YWx1ZXM6IG51bWJlcltdKSB7XG4gICAgICAgIGNvbnN0IGhhbGYgPSBNYXRoLmZsb29yKHZhbHVlcy5sZW5ndGggLyAyKTtcblxuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCAlIDIpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXNbaGFsZl07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHZhbHVlc1toYWxmIC0gMV0gKyB2YWx1ZXNbaGFsZl0pIC8gMi4wO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVpcmVkQW1vdW50ID0gY2FsY3VsYXRlUmVxdWlyZWRBbW91bnQoKTtcbiAgICBjb25zdCBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhciA9IGVudmlyb25tZW50LnNpbXVsYXRlZFZhbHVlc1twcm9qZWN0LnN0YXJ0WWVhcl07XG4gICAgc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuXG4gICAgY29uc3QgZ3JvdXBzID0gY3JlYXRlR3JvdXBzKHJlcXVpcmVkQW1vdW50LCBlbnZpcm9ubWVudC5ub0ludGVyZXN0UmVmZXJlbmNlTGluZVtwcm9qZWN0LnN0YXJ0WWVhcl0pO1xuICAgIGNvbnN0IHZhbHVlc0J5R3JvdXA6IHsgW2dyb3VwTmFtZTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcbiAgICBjb25zdCBidWNrZXRTaXplID0gTWF0aC5yb3VuZChzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLyBOVU1CRVJfT0ZfQlVDS0VUUyk7XG4gICAgY29uc3QgYnVja2V0czogSUJ1Y2tldFtdID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aDsgaSArPSBidWNrZXRTaXplKSB7XG4gICAgICAgIGNvbnN0IGJ1Y2tldDogSUJ1Y2tldCA9IHtcbiAgICAgICAgICAgIG1heDogTnVtYmVyLk1JTl9WQUxVRSxcbiAgICAgICAgICAgIG1pbjogTnVtYmVyLk1BWF9WQUxVRSxcbiAgICAgICAgICAgIHN1YkJ1Y2tldHM6IHt9XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCBpICsgYnVja2V0U2l6ZTsgKytqKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW2pdO1xuICAgICAgICAgICAgYnVja2V0Lm1pbiA9IE1hdGgubWluKGJ1Y2tldC5taW4sIHZhbHVlKTtcbiAgICAgICAgICAgIGJ1Y2tldC5tYXggPSBNYXRoLm1heChidWNrZXQubWF4LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gZ3JvdXBGb3JWYWx1ZShzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltqXSwgZ3JvdXBzKTtcbiAgICAgICAgICAgIHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gPSAodmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSB8fCAwKSArIDE7XG4gICAgICAgICAgICBjb25zdCBzdWJCdWNrZXQgPSBidWNrZXQuc3ViQnVja2V0c1tncm91cC5uYW1lXSA9IGJ1Y2tldC5zdWJCdWNrZXRzW2dyb3VwLm5hbWVdIHx8IHsgZ3JvdXA6IGdyb3VwLm5hbWUsIG1heDogTnVtYmVyLk1JTl9WQUxVRSwgbWluOiBOdW1iZXIuTUFYX1ZBTFVFIH07XG4gICAgICAgICAgICBzdWJCdWNrZXQubWluID0gTWF0aC5taW4oc3ViQnVja2V0Lm1pbiwgdmFsdWUpO1xuICAgICAgICAgICAgc3ViQnVja2V0Lm1heCA9IE1hdGgubWF4KHN1YkJ1Y2tldC5tYXgsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1Y2tldHMucHVzaChidWNrZXQpO1xuICAgIH1cblxuICAgIGNvbnN0IG5vbkVtcHR5R3JvdXBzID0gZ3JvdXBzLmZpbHRlcihncm91cCA9PiAhIXZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0pO1xuICAgIG5vbkVtcHR5R3JvdXBzLmZvckVhY2goZ3JvdXAgPT4gZ3JvdXAucGVyY2VudGFnZSA9IHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gLyBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGgpO1xuXG4gICAgY29uc3Qgb25lU2l4dGggPSBNYXRoLnJvdW5kKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAvIDYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJ1Y2tldHMsXG4gICAgICAgIGdyb3Vwczogbm9uRW1wdHlHcm91cHMsXG4gICAgICAgIG1heDogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC0gMV0sXG4gICAgICAgIG1lZGlhbjogbWVkaWFuKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyKSxcbiAgICAgICAgbWluOiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhclswXSxcbiAgICAgICAgcHJvamVjdCxcbiAgICAgICAgdHdvVGhpcmQ6IHtcbiAgICAgICAgICAgIG1heDogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC0gb25lU2l4dGhdLFxuICAgICAgICAgICAgbWluOiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltvbmVTaXh0aF1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW5jTW9udGVDYXJsbyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucykge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50KGluaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpKTtcblxuICAgIGxldCBwcm9qZWN0czogSVByb2plY3RSZXN1bHRbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiBvcHRpb25zIS5wcm9qZWN0cyEpIHtcbiAgICAgICAgcHJvamVjdHMucHVzaChjYWxjdWxhdGVQcm9qZWN0KHByb2plY3QsIGVudmlyb25tZW50KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3RzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxNb250ZUNhcmxvKHVzZXJPcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucykge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBpbml0aWFsaXplT3B0aW9ucyh1c2VyT3B0aW9ucyk7XG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5mcm9tKG9wdGlvbnMucHJvamVjdHMsIHsgbWluVmFsdWVzUGVyVGFzazogMiB9KVxuICAgICAgICAuaW5FbnZpcm9ubWVudChjcmVhdGVNb250ZUNhcmxvRW52aXJvbm1lbnQsIG9wdGlvbnMpXG4gICAgICAgIC5tYXAoY2FsY3VsYXRlUHJvamVjdCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZHluYW1pYy9tb250ZS1jYXJsby50cyIsImltcG9ydCBwYXJhbGxlbCwge0lQYXJhbGxlbE9wdGlvbnN9IGZyb20gXCJwYXJhbGxlbC1lc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDb29yZGluYXRlIHtcbiAgICByZWFkb25seSB4OiBudW1iZXI7XG4gICAgcmVhZG9ubHkgeTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElLbmlnaHRUb3VyRW52aXJvbm1lbnQge1xuICAgIGJvYXJkU2l6ZTogbnVtYmVyO1xuICAgIGJvYXJkOiBudW1iZXJbXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRW52aXJvbm1lbnQoYm9hcmRTaXplOiBudW1iZXIpOiBJS25pZ2h0VG91ckVudmlyb25tZW50IHtcbiAgICBjb25zdCBib2FyZDogbnVtYmVyW10gPSBuZXcgQXJyYXkoYm9hcmRTaXplICogYm9hcmRTaXplKTtcbiAgICBib2FyZC5maWxsKDApO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJvYXJkLFxuICAgICAgICBib2FyZFNpemVcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24ga25pZ2h0VG91cnMoc3RhcnRQYXRoOiBJQ29vcmRpbmF0ZVtdLCBlbnZpcm9ubWVudDogSUtuaWdodFRvdXJFbnZpcm9ubWVudCk6IG51bWJlciB7XG4gICAgY29uc3QgbW92ZXMgPSBbXG4gICAgICAgIHsgeDogLTIsIHk6IC0xIH0sIHsgeDogLTIsIHk6IDF9LCB7IHg6IC0xLCB5OiAtMiB9LCB7IHg6IC0xLCB5OiAyIH0sXG4gICAgICAgIHsgeDogMSwgeTogLTIgfSwgeyB4OiAxLCB5OiAyfSwgeyB4OiAyLCB5OiAtMSB9LCB7IHg6IDIsIHk6IDEgfVxuICAgIF07XG4gICAgY29uc3QgYm9hcmRTaXplID0gZW52aXJvbm1lbnQuYm9hcmRTaXplO1xuICAgIGNvbnN0IGJvYXJkID0gZW52aXJvbm1lbnQuYm9hcmQ7XG4gICAgY29uc3QgbnVtYmVyT2ZGaWVsZHMgPSBib2FyZFNpemUgKiBib2FyZFNpemU7XG4gICAgbGV0IHJlc3VsdHM6IG51bWJlciA9IDA7XG4gICAgY29uc3Qgc3RhY2s6IHsgY29vcmRpbmF0ZTogSUNvb3JkaW5hdGUsIG46IG51bWJlciB9W10gPSBzdGFydFBhdGgubWFwKChwb3MsIGluZGV4KSA9PiAoeyBjb29yZGluYXRlOiBwb3MsIG46IGluZGV4ICsgMSB9KSk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3RhcnRQYXRoLmxlbmd0aCAtIDE7ICsraW5kZXgpIHtcbiAgICAgICAgY29uc3QgZmllbGRJbmRleCA9IHN0YXJ0UGF0aFtpbmRleF0ueCAqIGJvYXJkU2l6ZSArIHN0YXJ0UGF0aFtpbmRleF0ueTtcbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBpbmRleCArIDE7XG4gICAgfVxuXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgeyBjb29yZGluYXRlLCBuIH0gPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgZmllbGRJbmRleCA9IGNvb3JkaW5hdGUueCAqIGJvYXJkU2l6ZSArIGNvb3JkaW5hdGUueTtcblxuICAgICAgICBpZiAoYm9hcmRbZmllbGRJbmRleF0gIT09IDApIHtcbiAgICAgICAgICAgIC8vIGJhY2sgdHJhY2tpbmdcbiAgICAgICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gMDtcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpOyAvLyByZW1vdmUgY3VycmVudCB2YWx1ZVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbnRyeVxuICAgICAgICBpZiAobiA9PT0gbnVtYmVyT2ZGaWVsZHMpIHtcbiAgICAgICAgICAgICsrcmVzdWx0cztcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IG4hO1xuXG4gICAgICAgIGZvciAoY29uc3QgbW92ZSBvZiBtb3Zlcykge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc29yID0geyB4OiBjb29yZGluYXRlLnggKyBtb3ZlLngsIHk6IGNvb3JkaW5hdGUueSArIG1vdmUueSB9O1xuICAgICAgICAgICAgLy8gbm90IG91dHNpZGUgb2YgYm9hcmQgYW5kIG5vdCB5ZXQgYWNjZXNzZWRcbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc2libGUgPSBzdWNjZXNzb3IueCA+PSAwICYmIHN1Y2Nlc3Nvci55ID49IDAgJiYgc3VjY2Vzc29yLnggPCBib2FyZFNpemUgJiYgIHN1Y2Nlc3Nvci55IDwgYm9hcmRTaXplICYmIGJvYXJkW3N1Y2Nlc3Nvci54ICogYm9hcmRTaXplICsgc3VjY2Vzc29yLnldID09PSAwO1xuXG4gICAgICAgICAgICBpZiAoYWNjZXNzaWJsZSkge1xuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2goeyBjb29yZGluYXRlOiBzdWNjZXNzb3IsIG46IG4gKyAxIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW5jS25pZ2h0VG91cnMoc3RhcnQ6IElDb29yZGluYXRlLCBib2FyZFNpemU6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBjcmVhdGVFbnZpcm9ubWVudChib2FyZFNpemUpO1xuICAgIHJldHVybiBrbmlnaHRUb3Vycyhbc3RhcnRdLCBlbnZpcm9ubWVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbGxlbEtuaWdodFRvdXJzKHN0YXJ0OiBJQ29vcmRpbmF0ZSwgYm9hcmRTaXplOiBudW1iZXIsIG9wdGlvbnM/OiBJUGFyYWxsZWxPcHRpb25zKTogUHJvbWlzZUxpa2U8bnVtYmVyPiB7XG5cbiAgICBmdW5jdGlvbiBzdWNjZXNzb3JzKGNvb3JkaW5hdGU6IElDb29yZGluYXRlKSB7XG4gICAgICAgIGNvbnN0IG1vdmVzID0gW1xuICAgICAgICAgICAge3g6IC0yLCB5OiAtMX0sIHt4OiAtMiwgeTogMX0sIHt4OiAtMSwgeTogLTJ9LCB7eDogLTEsIHk6IDJ9LFxuICAgICAgICAgICAge3g6IDEsIHk6IC0yfSwge3g6IDEsIHk6IDJ9LCB7eDogMiwgeTogLTF9LCB7eDogMiwgeTogMX1cbiAgICAgICAgXTtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJQ29vcmRpbmF0ZVtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBtb3ZlIG9mIG1vdmVzKSB7XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3IgPSB7eDogY29vcmRpbmF0ZS54ICsgbW92ZS54LCB5OiBjb29yZGluYXRlLnkgKyBtb3ZlLnl9O1xuICAgICAgICAgICAgY29uc3QgYWNjZXNzaWJsZSA9IHN1Y2Nlc3Nvci54ID49IDAgJiYgc3VjY2Vzc29yLnkgPj0gMCAmJiBzdWNjZXNzb3IueCA8IGJvYXJkU2l6ZSAmJiBzdWNjZXNzb3IueSA8IGJvYXJkU2l6ZSAmJlxuICAgICAgICAgICAgICAgIChzdWNjZXNzb3IueCAhPT0gc3RhcnQueCB8fCBzdWNjZXNzb3IueSAhPT0gc3RhcnQueSkgJiYgKHN1Y2Nlc3Nvci54ICE9PSBjb29yZGluYXRlLnggJiYgc3VjY2Vzc29yLnkgIT09IGNvb3JkaW5hdGUueSk7XG4gICAgICAgICAgICBpZiAoYWNjZXNzaWJsZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHN1Y2Nlc3Nvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVTdGFydEZpZWxkcygpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBJQ29vcmRpbmF0ZVtdW10gPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBkaXJlY3RTdWNjZXNzb3Igb2Ygc3VjY2Vzc29ycyhzdGFydCkpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaW5kaXJlY3RTdWNjZXNzb3Igb2Ygc3VjY2Vzc29ycyhkaXJlY3RTdWNjZXNzb3IpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goW3N0YXJ0LCBkaXJlY3RTdWNjZXNzb3IsIGluZGlyZWN0U3VjY2Vzc29yXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBsZXQgdG90YWwgPSAwO1xuICAgIGxldCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICByZXR1cm4gcGFyYWxsZWxcbiAgICAgICAgLmZyb20oY29tcHV0ZVN0YXJ0RmllbGRzKCksIG9wdGlvbnMpXG4gICAgICAgIC5pbkVudmlyb25tZW50KGNyZWF0ZUVudmlyb25tZW50LCBib2FyZFNpemUpXG4gICAgICAgIC5tYXA8bnVtYmVyPihrbmlnaHRUb3VycylcbiAgICAgICAgLnJlZHVjZSgwLCAobWVtbywgY291bnQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBtZW1vICsgY291bnQ7XG4gICAgICAgIH0pXG4gICAgICAgIC5zdWJzY3JpYmUoc3ViUmVzdWx0cyA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRvdXJzIG9mIHN1YlJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICB0b3RhbCArPSB0b3VycztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWNvbnNvbGUgKi9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke3RvdGFsIC8gKHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRUaW1lKSAqIDEwMDB9IHJlc3VsdHMgcGVyIHNlY29uZGApO1xuICAgICAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90cmFuc3BpbGVkL2tuaWdodHMtdG91ci50cyIsImltcG9ydCBwYXJhbGxlbCwge0lQYXJhbGxlbE9wdGlvbnN9IGZyb20gXCJwYXJhbGxlbC1lc1wiO1xuaW1wb3J0IHtJTWFuZGVsYnJvdE9wdGlvbnN9IGZyb20gXCIuLi9keW5hbWljL21hbmRlbGJyb3RcIjtcblxuaW50ZXJmYWNlIElDb21wbGV4TnVtYmVyIHtcbiAgICBpOiBudW1iZXI7XG4gICAgcmVhbDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFuZGVsYnJvdCh7IGltYWdlV2lkdGgsIGltYWdlSGVpZ2h0LCBpdGVyYXRpb25zIH06IElNYW5kZWxicm90T3B0aW9ucywgb3B0aW9ucz86IElQYXJhbGxlbE9wdGlvbnMpIHtcbiAgICAvLyBYIGF4aXMgc2hvd3MgcmVhbCBudW1iZXJzLCB5IGF4aXMgaW1hZ2luYXJ5XG4gICAgY29uc3QgbWluID0geyBpOiAtMS4yLCByZWFsOiAtMi4wIH07XG4gICAgY29uc3QgbWF4ID0geyBpOiAwLCByZWFsOiAxLjAgfTtcbiAgICBtYXguaSA9IG1pbi5pICsgKG1heC5yZWFsIC0gbWluLnJlYWwpICogaW1hZ2VIZWlnaHQgLyBpbWFnZVdpZHRoO1xuXG4gICAgY29uc3Qgc2NhbGluZ0ZhY3RvciA9IHtcbiAgICAgICAgaTogKG1heC5pIC0gbWluLmkpIC8gKGltYWdlSGVpZ2h0IC0gMSksXG4gICAgICAgIHJlYWw6IChtYXgucmVhbCAtIG1pbi5yZWFsKSAvIChpbWFnZVdpZHRoIC0gMSlcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlWihjOiBJQ29tcGxleE51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHogPSB7IGk6IGMuaSwgcmVhbDogYy5yZWFsIH07XG4gICAgICAgIGxldCBuID0gMDtcblxuICAgICAgICBmb3IgKDsgbiA8IGl0ZXJhdGlvbnM7ICsrbikge1xuICAgICAgICAgICAgaWYgKHoucmVhbCAqIHoucmVhbCArIHouaSAqIHouaSA+IDQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8geiAqKiAyICsgY1xuICAgICAgICAgICAgY29uc3QgekkgPSB6Lmk7XG4gICAgICAgICAgICB6LmkgPSAyICogei5yZWFsICogei5pICsgYy5pO1xuICAgICAgICAgICAgei5yZWFsID0gei5yZWFsICogei5yZWFsIC0gekkgKiB6SSArIGMucmVhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAucmFuZ2UoMCwgaW1hZ2VIZWlnaHQsIDEsIG9wdGlvbnMpXG4gICAgICAgIC5tYXAoeSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGltYWdlV2lkdGggKiA0KTtcbiAgICAgICAgICAgIGNvbnN0IGNJID0gbWF4LmkgLSB5ICogc2NhbGluZ0ZhY3Rvci5pO1xuXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGltYWdlV2lkdGg7ICsreCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGk6IGNJLFxuICAgICAgICAgICAgICAgICAgICByZWFsOiBtaW4ucmVhbCArIHggKiBzY2FsaW5nRmFjdG9yLnJlYWxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbiA9IGNhbGN1bGF0ZVooYyk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZSA9IHggKiA0O1xuICAgICAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2VdID0gbiAmIDB4RkY7XG4gICAgICAgICAgICAgICAgbGluZVtiYXNlICsgMV0gPSBuICYgMHhGRjAwO1xuICAgICAgICAgICAgICAgIGxpbmVbYmFzZSArIDJdID0gbiAmIDB4RkYwMDAwO1xuICAgICAgICAgICAgICAgIGxpbmVbYmFzZSArIDNdID0gMjU1O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICAgIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RyYW5zcGlsZWQvbWFuZGVsYnJvdC50cyIsImltcG9ydCBwYXJhbGxlbCBmcm9tIFwicGFyYWxsZWwtZXNcIjtcbmltcG9ydCB7RGljdGlvbmFyeX0gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IFJhbmRvbSBmcm9tIFwic2ltanMtcmFuZG9tXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb2plY3Qge1xuICAgIHN0YXJ0WWVhcjogbnVtYmVyO1xuICAgIHRvdGFsQW1vdW50OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJQnVja2V0IHtcbiAgICBtaW46IG51bWJlcjtcbiAgICBtYXg6IG51bWJlcjtcblxuICAgIHN1YkJ1Y2tldHM6IHsgW2dyb3VwTmFtZTogc3RyaW5nXTogeyBncm91cDogc3RyaW5nOyBtaW46IG51bWJlciwgbWF4OiBudW1iZXIgfSB9O1xufVxuXG5pbnRlcmZhY2UgSUdyb3VwIHtcbiAgICAvKipcbiAgICAgKiBUaGUgdW5pcXVlIG5hbWUgb2YgdGhpcyBncm91cFxuICAgICAqL1xuICAgIG5hbWU6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgZ3JvdXBcbiAgICAgKi9cbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIGEgc2VwYXJhdG9yIGxpbmUgYmVlbiBkcmF3biBmb3IgdGhpcyBncm91cD9cbiAgICAgKi9cbiAgICBzZXBhcmF0b3I6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBXaGF0cyB0aGUgcGVyY2VudGFnZSBvZiB2YWx1ZXMgaW4gdGhpcyBncm91cCB0byB0aGUgdG90YWwgbnVtYmVyIG9mIHNpbXVsYXRlZCB2YWx1ZXNcbiAgICAgKi9cbiAgICBwZXJjZW50YWdlOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBXaGF0cyB0aGUgbWluaW11bSB2YWx1ZSB0aGF0IGlzIHN0aWxsIHBhcnQgb2YgdGhpcyBncm91cFxuICAgICAqL1xuICAgIGZyb20/OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1heGltdW0gdmFsdWUgKGV4Y2x1c2l2ZSkgdGhhdCBkZWZpbmVzIHRoZSB1cHBlciBlbmQgb2YgdGhpcyBncm91cFxuICAgICAqL1xuICAgIHRvPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0UmVzdWx0IHtcbiAgICAvKipcbiAgICAgKiBUaGUgbWluaW1hbCBzaW11bGF0ZWQgdmFsdWUgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1pbjogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbWFsIHNpbXVsYXRlZCB2YWx1ZVxuICAgICAqL1xuICAgIG1heDogbnVtYmVyO1xuXG4gICAgLyoqIFRoZSBtZWRpYW4gb2YgdGhlIHZhbHVlcyBmb3VuZCBmb3IgdGhpcyBwcm9qZWN0XG4gICAgICovXG4gICAgbWVkaWFuOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIHdoZXJlIHRoZSAyLzMgb2YgdGhlIHNpbXVsYXRlZCB2YWx1ZXMgc3RhcnQgLyBlbmQuXG4gICAgICovXG4gICAgdHdvVGhpcmQ6IHtcbiAgICAgICAgbWluOiBudW1iZXI7XG4gICAgICAgIG1heDogbnVtYmVyO1xuICAgIH07XG5cbiAgICBidWNrZXRzOiBJQnVja2V0W107XG5cbiAgICBncm91cHM6IElHcm91cFtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHByb2plY3RcbiAgICAgKi9cbiAgICBwcm9qZWN0OiBJUHJvamVjdDtcbn1cblxuaW50ZXJmYWNlIElNb250ZUNhcmxvRW52aXJvbm1lbnQge1xuICAgIGludmVzdG1lbnRBbW91bnQ6IG51bWJlcjtcbiAgICBsaXF1aWRpdHk6IG51bWJlcjtcbiAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZTogbnVtYmVyW107XG4gICAgbnVtUnVuczogbnVtYmVyO1xuICAgIG51bVllYXJzOiBudW1iZXI7XG4gICAgcHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPjtcbiAgICBzaW11bGF0ZWRWYWx1ZXM6IG51bWJlcltdW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgbnVtWWVhcnM/OiBudW1iZXI7XG4gICAgbnVtUnVucz86IG51bWJlcjtcbiAgICBwcm9qZWN0cz86IElQcm9qZWN0W107XG4gICAgaW52ZXN0bWVudEFtb3VudD86IG51bWJlcjtcbiAgICBwZXJmb3JtYW5jZT86IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHZvbGF0aWxpdHk6IG51bWJlcjtcbiAgICBsaXF1aWRpdHk/OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzOiBudW1iZXI7XG4gICAgbnVtUnVuczogbnVtYmVyO1xuICAgIHByb2plY3RzOiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ6IG51bWJlcjtcbiAgICBwZXJmb3JtYW5jZTogbnVtYmVyO1xuICAgIHNlZWQ/OiBudW1iZXI7XG4gICAgdGFza0luZGV4PzogbnVtYmVyO1xuICAgIHZhbHVlc1Blcldvcmtlcj86IG51bWJlcjtcbiAgICBsaXF1aWRpdHk6IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIGluaXRpYWxpemVPcHRpb25zKG9wdGlvbnM/OiBJTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zKTogSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICBpbnZlc3RtZW50QW1vdW50OiAxMDAwMDAwLFxuICAgICAgICBsaXF1aWRpdHk6IDEwMDAwLFxuICAgICAgICBudW1SdW5zOiAxMDAwMCxcbiAgICAgICAgbnVtWWVhcnM6IDEwLFxuICAgICAgICBwZXJmb3JtYW5jZTogMCxcbiAgICAgICAgcHJvamVjdHM6IFtdLFxuICAgICAgICBzZWVkOiB1bmRlZmluZWQsXG4gICAgICAgIHZvbGF0aWxpdHk6IDAuMDFcbiAgICB9LCBvcHRpb25zKTtcbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVNb250ZUNhcmxvRW52aXJvbm1lbnQob3B0aW9uczogSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zKTogSU1vbnRlQ2FybG9FbnZpcm9ubWVudCB7XG5cbiAgICBmdW5jdGlvbiBwcm9qZWN0c1RvQ2FzaEZsb3dzKHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT4sIG51bVllYXJzOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgY2FzaEZsb3dzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8IG51bVllYXJzOyArK3llYXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RzQnlUaGlzWWVhciA9IHByb2plY3RzQnlTdGFydFllYXJbeWVhcl0gfHwgW107XG4gICAgICAgICAgICBjb25zdCBjYXNoRmxvdyA9IC1wcm9qZWN0c0J5VGhpc1llYXIucmVkdWNlKChtZW1vLCBwcm9qZWN0KSA9PiBtZW1vICsgcHJvamVjdC50b3RhbEFtb3VudCwgMCk7XG4gICAgICAgICAgICBjYXNoRmxvd3MucHVzaChjYXNoRmxvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhc2hGbG93cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVOb0ludGVyZXN0UmVmZXJlbmNlTGluZShjYXNoRmxvd3M6IG51bWJlcltdLCBpbnZlc3RtZW50QW1vdW50OiBudW1iZXIsIG51bVllYXJzOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3Qgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdID0gW107XG5cbiAgICAgICAgbGV0IGludmVzdG1lbnRBbW91bnRMZWZ0ID0gaW52ZXN0bWVudEFtb3VudDtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBudW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICBpbnZlc3RtZW50QW1vdW50TGVmdCA9IGludmVzdG1lbnRBbW91bnRMZWZ0ICsgY2FzaEZsb3dzW3llYXJdO1xuICAgICAgICAgICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUucHVzaChpbnZlc3RtZW50QW1vdW50TGVmdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXM6IG51bWJlcltdLCBpbnZlc3RtZW50QW1vdW50OiBudW1iZXIsIGNhc2hGbG93czogbnVtYmVyW10pIHtcbiAgICAgICAgbGV0IGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSA9IGludmVzdG1lbnRBbW91bnQ7XG4gICAgICAgIGxldCBwcmV2aW91c1llYXJJbmRleCA9IDEwMDtcblxuICAgICAgICBmb3IgKGxldCByZWxhdGl2ZVllYXIgPSAwOyByZWxhdGl2ZVllYXIgPCBpbmRpY2VzLmxlbmd0aDsgKytyZWxhdGl2ZVllYXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFySW5kZXggPSBpbmRpY2VzW3JlbGF0aXZlWWVhcl07XG4gICAgICAgICAgICBjb25zdCBjYXNoRmxvd1N0YXJ0T2ZZZWFyID0gcmVsYXRpdmVZZWFyID09PSAwID8gMCA6IGNhc2hGbG93c1tyZWxhdGl2ZVllYXIgLSAxXTtcblxuICAgICAgICAgICAgLy8gc2NhbGUgY3VycmVudCB2YWx1ZSB3aXRoIHBlcmZvcm1hbmNlIGdhaW4gYWNjb3JkaW5nIHRvIGluZGV4XG4gICAgICAgICAgICBjb25zdCBwZXJmb3JtYW5jZSA9IGN1cnJlbnRZZWFySW5kZXggLyBwcmV2aW91c1llYXJJbmRleDtcbiAgICAgICAgICAgIGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSA9IChjdXJyZW50UG9ydGZvbGlvVmFsdWUgKyBjYXNoRmxvd1N0YXJ0T2ZZZWFyKSAqIHBlcmZvcm1hbmNlO1xuXG4gICAgICAgICAgICBpbmRpY2VzW3JlbGF0aXZlWWVhcl0gPSBNYXRoLnJvdW5kKGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSk7XG4gICAgICAgICAgICBwcmV2aW91c1llYXJJbmRleCA9IGN1cnJlbnRZZWFySW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kaWNlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyB0aGUgbW9udGUgY2FybG8gc2ltdWxhdGlvbiBmb3IgYWxsIHllYXJzIGFuZCBudW0gcnVucy5cbiAgICAgKiBAcGFyYW0gY2FzaEZsb3dzIHRoZSBjYXNoIGZsb3dzXG4gICAgICogQHJldHVybnMge251bWJlcltdW119IHRoZSBzaW11bGF0ZWQgb3V0Y29tZXMgZ3JvdXBlZCBieSB5ZWFyXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2ltdWxhdGVPdXRjb21lcyhjYXNoRmxvd3M6IG51bWJlcltdLCBpbnZlc3RtZW50QW1vdW50OiBudW1iZXIsIHsgbnVtUnVucywgbnVtWWVhcnMsIHZvbGF0aWxpdHksIHBlcmZvcm1hbmNlIH06IHsgbnVtUnVuczogbnVtYmVyLCBudW1ZZWFyczogbnVtYmVyLCB2b2xhdGlsaXR5OiBudW1iZXIsIHBlcmZvcm1hbmNlOiBudW1iZXJ9KTogbnVtYmVyW11bXSAge1xuICAgICAgICBjb25zdCByZXN1bHQ6IG51bWJlcltdW10gPSBuZXcgQXJyYXkobnVtWWVhcnMpO1xuICAgICAgICBmb3IgKGxldCB5ZWFyID0gMDsgeWVhciA8PSBudW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICByZXN1bHRbeWVhcl0gPSBuZXcgQXJyYXkobnVtUnVucyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByYW5kb20gPSBuZXcgUmFuZG9tKDEwKTtcbiAgICAgICAgZm9yIChsZXQgcnVuID0gMDsgcnVuIDwgbnVtUnVuczsgcnVuKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGluZGljZXMgPSBbMTAwXTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbnVtWWVhcnM7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbVBlcmZvcm1hbmNlID0gMSArIHJhbmRvbS5ub3JtYWwocGVyZm9ybWFuY2UsIHZvbGF0aWxpdHkpO1xuICAgICAgICAgICAgICAgIGluZGljZXMucHVzaChpbmRpY2VzW2kgLSAxXSAqIHJhbmRvbVBlcmZvcm1hbmNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY29udmVydCB0aGUgcmVsYXRpdmUgdmFsdWVzIGZyb20gYWJvdmUgdG8gYWJzb2x1dGUgdmFsdWVzLlxuICAgICAgICAgICAgdG9BYnNvbHV0ZUluZGljZXMoaW5kaWNlcywgaW52ZXN0bWVudEFtb3VudCwgY2FzaEZsb3dzKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBpbmRpY2VzLmxlbmd0aDsgKyt5ZWFyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3llYXJdW3J1bl0gPSBpbmRpY2VzW3llYXJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBsZXQgcHJvamVjdHNUb1NpbXVsYXRlOiBJUHJvamVjdFtdID0gb3B0aW9ucy5wcm9qZWN0cztcblxuICAgIGlmIChvcHRpb25zLnRhc2tJbmRleCAmJiBvcHRpb25zLnZhbHVlc1Blcldvcmtlcikge1xuICAgICAgICBwcm9qZWN0c1RvU2ltdWxhdGUgPSBvcHRpb25zLnByb2plY3RzLnNsaWNlKG9wdGlvbnMudGFza0luZGV4ICogb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIsIChvcHRpb25zLnRhc2tJbmRleCArIDEpICogb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb2plY3RzID0gb3B0aW9ucy5wcm9qZWN0cy5zb3J0KChhLCBiKSA9PiBhLnN0YXJ0WWVhciAtIGIuc3RhcnRZZWFyKTtcblxuICAgIC8vIEdyb3VwIHByb2plY3RzIGJ5IHN0YXJ0WWVhciwgdXNlIGxvZGFzaCBncm91cEJ5IGluc3RlYWRcbiAgICBjb25zdCBwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+ID0ge307XG4gICAgZm9yIChjb25zdCBwcm9qZWN0IG9mIHByb2plY3RzKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdID0gcHJvamVjdHNCeVN0YXJ0WWVhcltwcm9qZWN0LnN0YXJ0WWVhcl0gfHwgW107XG4gICAgICAgIGFyci5wdXNoKHByb2plY3QpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhc2hGbG93cyA9IHByb2plY3RzVG9DYXNoRmxvd3MocHJvamVjdHNCeVN0YXJ0WWVhciwgb3B0aW9ucy5udW1ZZWFycyk7XG4gICAgY29uc3Qgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUgPSBjYWxjdWxhdGVOb0ludGVyZXN0UmVmZXJlbmNlTGluZShjYXNoRmxvd3MsIG9wdGlvbnMuaW52ZXN0bWVudEFtb3VudCwgb3B0aW9ucy5udW1ZZWFycyk7XG5cbiAgICBjb25zdCBudW1ZZWFycyA9IHByb2plY3RzVG9TaW11bGF0ZS5yZWR1Y2UoKG1lbW8sIHByb2plY3QpID0+IE1hdGgubWF4KG1lbW8sIHByb2plY3Quc3RhcnRZZWFyKSwgMCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBpbnZlc3RtZW50QW1vdW50OiBvcHRpb25zLmludmVzdG1lbnRBbW91bnQsXG4gICAgICAgIGxpcXVpZGl0eTogb3B0aW9ucy5saXF1aWRpdHksXG4gICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLFxuICAgICAgICBudW1SdW5zOiBvcHRpb25zLm51bVJ1bnMsXG4gICAgICAgIG51bVllYXJzLFxuICAgICAgICBwcm9qZWN0c0J5U3RhcnRZZWFyLFxuICAgICAgICBzaW11bGF0ZWRWYWx1ZXM6IHNpbXVsYXRlT3V0Y29tZXMoY2FzaEZsb3dzLCBvcHRpb25zLmludmVzdG1lbnRBbW91bnQsIG9wdGlvbnMpXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBGb3JWYWx1ZSh2YWx1ZTogbnVtYmVyLCBncm91cHM6IElHcm91cFtdKTogSUdyb3VwIHtcbiAgICByZXR1cm4gZ3JvdXBzLmZpbmQoZ3JvdXAgPT4gKHR5cGVvZiBncm91cC5mcm9tID09PSBcInVuZGVmaW5lZFwiIHx8IGdyb3VwLmZyb20gPD0gdmFsdWUpICYmICh0eXBlb2YgZ3JvdXAudG8gPT09IFwidW5kZWZpbmVkXCIgfHwgZ3JvdXAudG8gPiB2YWx1ZSkpITtcbn1cblxuZnVuY3Rpb24gY3JlYXRlR3JvdXBzKHJlcXVpcmVkQW1vdW50OiBudW1iZXIsIG5vSW50ZXJlc3RSZWZlcmVuY2U6IG51bWJlciwgbGlxdWlkaXR5OiBudW1iZXIpOiBJR3JvdXBbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJaaWVsIGVycmVpY2hiYXJcIiwgZnJvbTogcmVxdWlyZWRBbW91bnQsIG5hbWU6IFwiZ3JlZW5cIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiB0cnVlfSxcbiAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJtaXQgWnVzYXR6bGlxdWlkaXTDpHQgZXJyZWljaGJhclwiLCBmcm9tOiByZXF1aXJlZEFtb3VudCAtIGxpcXVpZGl0eSwgbmFtZTogXCJ5ZWxsb3dcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiB0cnVlLCB0bzogcmVxdWlyZWRBbW91bnQgfSxcbiAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJuaWNodCBlcnJlaWNoYmFyXCIsIGZyb206IG5vSW50ZXJlc3RSZWZlcmVuY2UsIG5hbWU6IFwiZ3JheVwiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IGZhbHNlLCB0bzogcmVxdWlyZWRBbW91bnQgLSBsaXF1aWRpdHkgfSxcbiAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJuaWNodCBlcnJlaWNoYmFyLCBtaXQgVmVybHVzdFwiLCBuYW1lOiBcInJlZFwiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IGZhbHNlLCB0bzogbm9JbnRlcmVzdFJlZmVyZW5jZSB9XG4gICAgXTtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlUmVxdWlyZWRBbW91bnQocHJvamVjdDogSVByb2plY3QsIHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT4pIHtcbiAgICBsZXQgYW1vdW50ID0gcHJvamVjdC50b3RhbEFtb3VudDtcbiAgICBjb25zdCBwcm9qZWN0c1NhbWVZZWFyID0gcHJvamVjdHNCeVN0YXJ0WWVhcltwcm9qZWN0LnN0YXJ0WWVhcl07XG5cbiAgICBmb3IgKGNvbnN0IG90aGVyUHJvamVjdCBvZiBwcm9qZWN0c1NhbWVZZWFyKSB7XG4gICAgICAgIGlmIChvdGhlclByb2plY3QgPT09IHByb2plY3QpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGFtb3VudCArPSBvdGhlclByb2plY3QudG90YWxBbW91bnQ7XG4gICAgfVxuICAgIHJldHVybiBhbW91bnQ7XG59XG5cbmZ1bmN0aW9uIG1lZGlhbih2YWx1ZXM6IG51bWJlcltdKSB7XG4gICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3IodmFsdWVzLmxlbmd0aCAvIDIpO1xuXG4gICAgaWYgKHZhbHVlcy5sZW5ndGggJSAyKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXNbaGFsZl07XG4gICAgfVxuXG4gICAgcmV0dXJuICh2YWx1ZXNbaGFsZiAtIDFdICsgdmFsdWVzW2hhbGZdKSAvIDIuMDtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlUHJvamVjdChwcm9qZWN0OiBJUHJvamVjdCwgZW52aXJvbm1lbnQ6IElNb250ZUNhcmxvRW52aXJvbm1lbnQpOiBJUHJvamVjdFJlc3VsdCB7XG4gICAgY29uc3QgTlVNQkVSX09GX0JVQ0tFVFMgPSAxMDtcblxuICAgIGNvbnN0IHJlcXVpcmVkQW1vdW50ID0gY2FsY3VsYXRlUmVxdWlyZWRBbW91bnQocHJvamVjdCwgZW52aXJvbm1lbnQucHJvamVjdHNCeVN0YXJ0WWVhcik7XG4gICAgY29uc3Qgc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIgPSBlbnZpcm9ubWVudC5zaW11bGF0ZWRWYWx1ZXNbcHJvamVjdC5zdGFydFllYXJdO1xuICAgIHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgIGNvbnN0IGdyb3VwcyA9IGNyZWF0ZUdyb3VwcyhyZXF1aXJlZEFtb3VudCwgZW52aXJvbm1lbnQubm9JbnRlcmVzdFJlZmVyZW5jZUxpbmVbcHJvamVjdC5zdGFydFllYXJdLCBlbnZpcm9ubWVudC5saXF1aWRpdHkpO1xuICAgIGNvbnN0IHZhbHVlc0J5R3JvdXA6IHsgW2dyb3VwTmFtZTogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcbiAgICBjb25zdCBidWNrZXRTaXplID0gTWF0aC5yb3VuZChzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLyBOVU1CRVJfT0ZfQlVDS0VUUyk7XG4gICAgY29uc3QgYnVja2V0czogSUJ1Y2tldFtdID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aDsgaSArPSBidWNrZXRTaXplKSB7XG4gICAgICAgIGNvbnN0IGJ1Y2tldDogSUJ1Y2tldCA9IHtcbiAgICAgICAgICAgIG1heDogTnVtYmVyLk1JTl9WQUxVRSxcbiAgICAgICAgICAgIG1pbjogTnVtYmVyLk1BWF9WQUxVRSxcbiAgICAgICAgICAgIHN1YkJ1Y2tldHM6IHt9XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCBpICsgYnVja2V0U2l6ZTsgKytqKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW2pdO1xuICAgICAgICAgICAgYnVja2V0Lm1pbiA9IE1hdGgubWluKGJ1Y2tldC5taW4sIHZhbHVlKTtcbiAgICAgICAgICAgIGJ1Y2tldC5tYXggPSBNYXRoLm1heChidWNrZXQubWF4LCB2YWx1ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gZ3JvdXBGb3JWYWx1ZShzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltqXSwgZ3JvdXBzKTtcbiAgICAgICAgICAgIHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gPSAodmFsdWVzQnlHcm91cFtncm91cC5uYW1lXSB8fCAwKSArIDE7XG4gICAgICAgICAgICBjb25zdCBzdWJCdWNrZXQgPSBidWNrZXQuc3ViQnVja2V0c1tncm91cC5uYW1lXSA9IGJ1Y2tldC5zdWJCdWNrZXRzW2dyb3VwLm5hbWVdIHx8IHsgZ3JvdXA6IGdyb3VwLm5hbWUsIG1heDogTnVtYmVyLk1JTl9WQUxVRSwgbWluOiBOdW1iZXIuTUFYX1ZBTFVFIH07XG4gICAgICAgICAgICBzdWJCdWNrZXQubWluID0gTWF0aC5taW4oc3ViQnVja2V0Lm1pbiwgdmFsdWUpO1xuICAgICAgICAgICAgc3ViQnVja2V0Lm1heCA9IE1hdGgubWF4KHN1YkJ1Y2tldC5tYXgsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJ1Y2tldHMucHVzaChidWNrZXQpO1xuICAgIH1cblxuICAgIGNvbnN0IG5vbkVtcHR5R3JvdXBzID0gZ3JvdXBzLmZpbHRlcihncm91cCA9PiAhIXZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0pO1xuICAgIG5vbkVtcHR5R3JvdXBzLmZvckVhY2goZ3JvdXAgPT4gZ3JvdXAucGVyY2VudGFnZSA9IHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gLyBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGgpO1xuXG4gICAgY29uc3Qgb25lU2l4dGggPSBNYXRoLnJvdW5kKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAvIDYpO1xuICAgIHJldHVybiB7XG4gICAgICAgIGJ1Y2tldHMsXG4gICAgICAgIGdyb3Vwczogbm9uRW1wdHlHcm91cHMsXG4gICAgICAgIG1heDogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC0gMV0sXG4gICAgICAgIG1lZGlhbjogbWVkaWFuKHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyKSxcbiAgICAgICAgbWluOiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhclswXSxcbiAgICAgICAgcHJvamVjdCxcbiAgICAgICAgdHdvVGhpcmQ6IHtcbiAgICAgICAgICAgIG1heDogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC0gb25lU2l4dGhdLFxuICAgICAgICAgICAgbWluOiBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltvbmVTaXh0aF1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW5jTW9udGVDYXJsbyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucykge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50KGluaXRpYWxpemVPcHRpb25zKG9wdGlvbnMpKTtcblxuICAgIGxldCBwcm9qZWN0czogSVByb2plY3RSZXN1bHRbXSA9IFtdO1xuICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiBvcHRpb25zIS5wcm9qZWN0cyEpIHtcbiAgICAgICAgcHJvamVjdHMucHVzaChjYWxjdWxhdGVQcm9qZWN0KHByb2plY3QsIGVudmlyb25tZW50KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3RzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxNb250ZUNhcmxvKHVzZXJPcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucykge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBpbml0aWFsaXplT3B0aW9ucyh1c2VyT3B0aW9ucyk7XG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5mcm9tKG9wdGlvbnMucHJvamVjdHMsIHsgbWluVmFsdWVzUGVyVGFzazogMiB9KVxuICAgICAgICAuaW5FbnZpcm9ubWVudChjcmVhdGVNb250ZUNhcmxvRW52aXJvbm1lbnQsIG9wdGlvbnMpXG4gICAgICAgIC5tYXAoY2FsY3VsYXRlUHJvamVjdCk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdHJhbnNwaWxlZC9tb250ZS1jYXJsby50cyIsIi8qIVxuICogUmFuZG9tLmpzIHZlcnNpb24gMC4yLjZcbiAqIGN1cmwgaHR0cDovL3NpbWpzLmNvbS9fZG93bmxvYWRzL3JhbmRvbS0wLjI2LWRlYnVnLmpzXG4gKi9cblxuIC8qKiBSYW5kb20uanMgbGlicmFyeS5cbiAqXG4gKiBUaGUgY29kZSBpcyBsaWNlbnNlZCBhcyBMR1BMLlxuKi9cblxuLypcbiAgIEEgQy1wcm9ncmFtIGZvciBNVDE5OTM3LCB3aXRoIGluaXRpYWxpemF0aW9uIGltcHJvdmVkIDIwMDIvMS8yNi5cbiAgIENvZGVkIGJ5IFRha3VqaSBOaXNoaW11cmEgYW5kIE1ha290byBNYXRzdW1vdG8uXG5cbiAgIEJlZm9yZSB1c2luZywgaW5pdGlhbGl6ZSB0aGUgc3RhdGUgYnkgdXNpbmcgaW5pdF9nZW5yYW5kKHNlZWQpXG4gICBvciBpbml0X2J5X2FycmF5KGluaXRfa2V5LCBrZXlfbGVuZ3RoKS5cblxuICAgQ29weXJpZ2h0IChDKSAxOTk3IC0gMjAwMiwgTWFrb3RvIE1hdHN1bW90byBhbmQgVGFrdWppIE5pc2hpbXVyYSxcbiAgIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbiAgIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zXG4gICBhcmUgbWV0OlxuXG4gICAgIDEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0XG4gICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cblxuICAgICAyLiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlXG4gICAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cbiAgICAgMy4gVGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IG5vdCBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZVxuICAgICAgICBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW5cbiAgICAgICAgcGVybWlzc2lvbi5cblxuICAgVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuICAgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxuICAgTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXG4gICBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1JcbiAgIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxuICAgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxuICAgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SXG4gICBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GXG4gICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xuICAgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG4gICBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cblxuXG4gICBBbnkgZmVlZGJhY2sgaXMgdmVyeSB3ZWxjb21lLlxuICAgaHR0cDovL3d3dy5tYXRoLnNjaS5oaXJvc2hpbWEtdS5hYy5qcC9+bS1tYXQvTVQvZW10Lmh0bWxcbiAgIGVtYWlsOiBtLW1hdCBAIG1hdGguc2NpLmhpcm9zaGltYS11LmFjLmpwIChyZW1vdmUgc3BhY2UpXG4gKi9cblxudmFyIFJhbmRvbSA9IGZ1bmN0aW9uKHNlZWQpIHtcblx0c2VlZCA9IChzZWVkID09PSB1bmRlZmluZWQpID8gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSA6IHNlZWQ7XG5cdGlmICh0eXBlb2Yoc2VlZCkgIT09ICdudW1iZXInICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR8fCBNYXRoLmNlaWwoc2VlZCkgIT0gTWF0aC5mbG9vcihzZWVkKSkgeyAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKFwic2VlZCB2YWx1ZSBtdXN0IGJlIGFuIGludGVnZXJcIik7IC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblxuXHQvKiBQZXJpb2QgcGFyYW1ldGVycyAqL1xuXHR0aGlzLk4gPSA2MjQ7XG5cdHRoaXMuTSA9IDM5Nztcblx0dGhpcy5NQVRSSVhfQSA9IDB4OTkwOGIwZGY7ICAgLyogY29uc3RhbnQgdmVjdG9yIGEgKi9cblx0dGhpcy5VUFBFUl9NQVNLID0gMHg4MDAwMDAwMDsgLyogbW9zdCBzaWduaWZpY2FudCB3LXIgYml0cyAqL1xuXHR0aGlzLkxPV0VSX01BU0sgPSAweDdmZmZmZmZmOyAvKiBsZWFzdCBzaWduaWZpY2FudCByIGJpdHMgKi9cblxuXHR0aGlzLm10ID0gbmV3IEFycmF5KHRoaXMuTik7IC8qIHRoZSBhcnJheSBmb3IgdGhlIHN0YXRlIHZlY3RvciAqL1xuXHR0aGlzLm10aT10aGlzLk4rMTsgLyogbXRpPT1OKzEgbWVhbnMgbXRbTl0gaXMgbm90IGluaXRpYWxpemVkICovXG5cblx0Ly90aGlzLmluaXRfZ2VucmFuZChzZWVkKTtcblx0dGhpcy5pbml0X2J5X2FycmF5KFtzZWVkXSwgMSk7XG59O1xuXG4vKiBpbml0aWFsaXplcyBtdFtOXSB3aXRoIGEgc2VlZCAqL1xuUmFuZG9tLnByb3RvdHlwZS5pbml0X2dlbnJhbmQgPSBmdW5jdGlvbihzKSB7XG5cdHRoaXMubXRbMF0gPSBzID4+PiAwO1xuXHRmb3IgKHRoaXMubXRpPTE7IHRoaXMubXRpPHRoaXMuTjsgdGhpcy5tdGkrKykge1xuXHRcdHZhciBzID0gdGhpcy5tdFt0aGlzLm10aS0xXSBeICh0aGlzLm10W3RoaXMubXRpLTFdID4+PiAzMCk7XG5cdFx0dGhpcy5tdFt0aGlzLm10aV0gPSAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTgxMjQzMzI1MykgPDwgMTYpICsgKHMgJiAweDAwMDBmZmZmKSAqIDE4MTI0MzMyNTMpXG5cdFx0KyB0aGlzLm10aTtcblx0XHQvKiBTZWUgS251dGggVEFPQ1AgVm9sMi4gM3JkIEVkLiBQLjEwNiBmb3IgbXVsdGlwbGllci4gKi9cblx0XHQvKiBJbiB0aGUgcHJldmlvdXMgdmVyc2lvbnMsIE1TQnMgb2YgdGhlIHNlZWQgYWZmZWN0ICAgKi9cblx0XHQvKiBvbmx5IE1TQnMgb2YgdGhlIGFycmF5IG10W10uICAgICAgICAgICAgICAgICAgICAgICAgKi9cblx0XHQvKiAyMDAyLzAxLzA5IG1vZGlmaWVkIGJ5IE1ha290byBNYXRzdW1vdG8gICAgICAgICAgICAgKi9cblx0XHR0aGlzLm10W3RoaXMubXRpXSA+Pj49IDA7XG5cdFx0LyogZm9yID4zMiBiaXQgbWFjaGluZXMgKi9cblx0fVxufTtcblxuLyogaW5pdGlhbGl6ZSBieSBhbiBhcnJheSB3aXRoIGFycmF5LWxlbmd0aCAqL1xuLyogaW5pdF9rZXkgaXMgdGhlIGFycmF5IGZvciBpbml0aWFsaXppbmcga2V5cyAqL1xuLyoga2V5X2xlbmd0aCBpcyBpdHMgbGVuZ3RoICovXG4vKiBzbGlnaHQgY2hhbmdlIGZvciBDKyssIDIwMDQvMi8yNiAqL1xuUmFuZG9tLnByb3RvdHlwZS5pbml0X2J5X2FycmF5ID0gZnVuY3Rpb24oaW5pdF9rZXksIGtleV9sZW5ndGgpIHtcblx0dmFyIGksIGosIGs7XG5cdHRoaXMuaW5pdF9nZW5yYW5kKDE5NjUwMjE4KTtcblx0aT0xOyBqPTA7XG5cdGsgPSAodGhpcy5OPmtleV9sZW5ndGggPyB0aGlzLk4gOiBrZXlfbGVuZ3RoKTtcblx0Zm9yICg7IGs7IGstLSkge1xuXHRcdHZhciBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApO1xuXHRcdHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNjY0NTI1KSA8PCAxNikgKyAoKHMgJiAweDAwMDBmZmZmKSAqIDE2NjQ1MjUpKSlcblx0XHQrIGluaXRfa2V5W2pdICsgajsgLyogbm9uIGxpbmVhciAqL1xuXHRcdHRoaXMubXRbaV0gPj4+PSAwOyAvKiBmb3IgV09SRFNJWkUgPiAzMiBtYWNoaW5lcyAqL1xuXHRcdGkrKzsgaisrO1xuXHRcdGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cblx0XHRpZiAoaj49a2V5X2xlbmd0aCkgaj0wO1xuXHR9XG5cdGZvciAoaz10aGlzLk4tMTsgazsgay0tKSB7XG5cdFx0dmFyIHMgPSB0aGlzLm10W2ktMV0gXiAodGhpcy5tdFtpLTFdID4+PiAzMCk7XG5cdFx0dGhpcy5tdFtpXSA9ICh0aGlzLm10W2ldIF4gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE1NjYwODM5NDEpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxNTY2MDgzOTQxKSlcblx0XHQtIGk7IC8qIG5vbiBsaW5lYXIgKi9cblx0XHR0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cblx0XHRpKys7XG5cdFx0aWYgKGk+PXRoaXMuTikgeyB0aGlzLm10WzBdID0gdGhpcy5tdFt0aGlzLk4tMV07IGk9MTsgfVxuXHR9XG5cblx0dGhpcy5tdFswXSA9IDB4ODAwMDAwMDA7IC8qIE1TQiBpcyAxOyBhc3N1cmluZyBub24temVybyBpbml0aWFsIGFycmF5ICovXG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDB4ZmZmZmZmZmZdLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLmdlbnJhbmRfaW50MzIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHk7XG5cdHZhciBtYWcwMSA9IG5ldyBBcnJheSgweDAsIHRoaXMuTUFUUklYX0EpO1xuXHQvKiBtYWcwMVt4XSA9IHggKiBNQVRSSVhfQSAgZm9yIHg9MCwxICovXG5cblx0aWYgKHRoaXMubXRpID49IHRoaXMuTikgeyAvKiBnZW5lcmF0ZSBOIHdvcmRzIGF0IG9uZSB0aW1lICovXG5cdFx0dmFyIGtrO1xuXG5cdFx0aWYgKHRoaXMubXRpID09IHRoaXMuTisxKSAgIC8qIGlmIGluaXRfZ2VucmFuZCgpIGhhcyBub3QgYmVlbiBjYWxsZWQsICovXG5cdFx0XHR0aGlzLmluaXRfZ2VucmFuZCg1NDg5KTsgLyogYSBkZWZhdWx0IGluaXRpYWwgc2VlZCBpcyB1c2VkICovXG5cblx0XHRmb3IgKGtrPTA7a2s8dGhpcy5OLXRoaXMuTTtraysrKSB7XG5cdFx0XHR5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcblx0XHRcdHRoaXMubXRba2tdID0gdGhpcy5tdFtrayt0aGlzLk1dIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cdFx0fVxuXHRcdGZvciAoO2trPHRoaXMuTi0xO2trKyspIHtcblx0XHRcdHkgPSAodGhpcy5tdFtra10mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFtraysxXSZ0aGlzLkxPV0VSX01BU0spO1xuXHRcdFx0dGhpcy5tdFtra10gPSB0aGlzLm10W2trKyh0aGlzLk0tdGhpcy5OKV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblx0XHR9XG5cdFx0eSA9ICh0aGlzLm10W3RoaXMuTi0xXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10WzBdJnRoaXMuTE9XRVJfTUFTSyk7XG5cdFx0dGhpcy5tdFt0aGlzLk4tMV0gPSB0aGlzLm10W3RoaXMuTS0xXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXG5cdFx0dGhpcy5tdGkgPSAwO1xuXHR9XG5cblx0eSA9IHRoaXMubXRbdGhpcy5tdGkrK107XG5cblx0LyogVGVtcGVyaW5nICovXG5cdHkgXj0gKHkgPj4+IDExKTtcblx0eSBePSAoeSA8PCA3KSAmIDB4OWQyYzU2ODA7XG5cdHkgXj0gKHkgPDwgMTUpICYgMHhlZmM2MDAwMDtcblx0eSBePSAoeSA+Pj4gMTgpO1xuXG5cdHJldHVybiB5ID4+PiAwO1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwweDdmZmZmZmZmXS1pbnRlcnZhbCAqL1xuUmFuZG9tLnByb3RvdHlwZS5nZW5yYW5kX2ludDMxID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCk+Pj4xKTtcbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMV0tcmVhbC1pbnRlcnZhbCAqL1xuUmFuZG9tLnByb3RvdHlwZS5nZW5yYW5kX3JlYWwxID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmdlbnJhbmRfaW50MzIoKSooMS4wLzQyOTQ5NjcyOTUuMCk7XG5cdC8qIGRpdmlkZWQgYnkgMl4zMi0xICovXG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDEpLXJlYWwtaW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUucmFuZG9tID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLnB5dGhvbkNvbXBhdGliaWxpdHkpIHtcblx0XHRpZiAodGhpcy5za2lwKSB7XG5cdFx0XHR0aGlzLmdlbnJhbmRfaW50MzIoKTtcblx0XHR9XG5cdFx0dGhpcy5za2lwID0gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk2LjApO1xuXHQvKiBkaXZpZGVkIGJ5IDJeMzIgKi9cbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gKDAsMSktcmVhbC1pbnRlcnZhbCAqL1xuUmFuZG9tLnByb3RvdHlwZS5nZW5yYW5kX3JlYWwzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiAodGhpcy5nZW5yYW5kX2ludDMyKCkgKyAwLjUpKigxLjAvNDI5NDk2NzI5Ni4wKTtcblx0LyogZGl2aWRlZCBieSAyXjMyICovXG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDEpIHdpdGggNTMtYml0IHJlc29sdXRpb24qL1xuUmFuZG9tLnByb3RvdHlwZS5nZW5yYW5kX3JlczUzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBhPXRoaXMuZ2VucmFuZF9pbnQzMigpPj4+NSwgYj10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjY7XG5cdHJldHVybihhKjY3MTA4ODY0LjArYikqKDEuMC85MDA3MTk5MjU0NzQwOTkyLjApO1xufTtcblxuLyogVGhlc2UgcmVhbCB2ZXJzaW9ucyBhcmUgZHVlIHRvIElzYWt1IFdhZGEsIDIwMDIvMDEvMDkgYWRkZWQgKi9cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5SYW5kb20ucHJvdG90eXBlLkxPRzQgPSBNYXRoLmxvZyg0LjApO1xuUmFuZG9tLnByb3RvdHlwZS5TR19NQUdJQ0NPTlNUID0gMS4wICsgTWF0aC5sb2coNC41KTtcblxuUmFuZG9tLnByb3RvdHlwZS5leHBvbmVudGlhbCA9IGZ1bmN0aW9uIChsYW1iZGEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJleHBvbmVudGlhbCgpIG11c3QgXCIgICAgIC8vIEFSR19DSEVDS1xuXHRcdFx0XHQrIFwiIGJlIGNhbGxlZCB3aXRoICdsYW1iZGEnIHBhcmFtZXRlclwiKTsgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHR2YXIgciA9IHRoaXMucmFuZG9tKCk7XG5cdHJldHVybiAtTWF0aC5sb2cocikgLyBsYW1iZGE7XG59O1xuXG5SYW5kb20ucHJvdG90eXBlLmdhbW1hID0gZnVuY3Rpb24gKGFscGhhLCBiZXRhKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwiZ2FtbWEoKSBtdXN0IGJlIGNhbGxlZFwiICAvLyBBUkdfQ0hFQ0tcblx0XHRcdFx0KyBcIiB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnNcIik7IC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblx0LyogQmFzZWQgb24gUHl0aG9uIDIuNiBzb3VyY2UgY29kZSBvZiByYW5kb20ucHkuXG5cdCAqL1xuXG5cdGlmIChhbHBoYSA+IDEuMCkge1xuXHRcdHZhciBhaW52ID0gTWF0aC5zcXJ0KDIuMCAqIGFscGhhIC0gMS4wKTtcblx0XHR2YXIgYmJiID0gYWxwaGEgLSB0aGlzLkxPRzQ7XG5cdFx0dmFyIGNjYyA9IGFscGhhICsgYWludjtcblxuXHRcdHdoaWxlICh0cnVlKSB7XG5cdFx0XHR2YXIgdTEgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdFx0aWYgKCh1MSA8IDFlLTcpIHx8ICh1ID4gMC45OTk5OTk5KSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdHZhciB1MiA9IDEuMCAtIHRoaXMucmFuZG9tKCk7XG5cdFx0XHR2YXIgdiA9IE1hdGgubG9nKHUxIC8gKDEuMCAtIHUxKSkgLyBhaW52O1xuXHRcdFx0dmFyIHggPSBhbHBoYSAqIE1hdGguZXhwKHYpO1xuXHRcdFx0dmFyIHogPSB1MSAqIHUxICogdTI7XG5cdFx0XHR2YXIgciA9IGJiYiArIGNjYyAqIHYgLSB4O1xuXHRcdFx0aWYgKChyICsgdGhpcy5TR19NQUdJQ0NPTlNUIC0gNC41ICogeiA+PSAwLjApIHx8IChyID49IE1hdGgubG9nKHopKSkge1xuXHRcdFx0XHRyZXR1cm4geCAqIGJldGE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYgKGFscGhhID09IDEuMCkge1xuXHRcdHZhciB1ID0gdGhpcy5yYW5kb20oKTtcblx0XHR3aGlsZSAodSA8PSAxZS03KSB7XG5cdFx0XHR1ID0gdGhpcy5yYW5kb20oKTtcblx0XHR9XG5cdFx0cmV0dXJuIC0gTWF0aC5sb2codSkgKiBiZXRhO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlICh0cnVlKSB7XG5cdFx0XHR2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0XHR2YXIgYiA9IChNYXRoLkUgKyBhbHBoYSkgLyBNYXRoLkU7XG5cdFx0XHR2YXIgcCA9IGIgKiB1O1xuXHRcdFx0aWYgKHAgPD0gMS4wKSB7XG5cdFx0XHRcdHZhciB4ID0gTWF0aC5wb3cocCwgMS4wIC8gYWxwaGEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHggPSAtIE1hdGgubG9nKChiIC0gcCkgLyBhbHBoYSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdTEgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdFx0aWYgKHAgPiAxLjApIHtcblx0XHRcdFx0aWYgKHUxIDw9IE1hdGgucG93KHgsIChhbHBoYSAtIDEuMCkpKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodTEgPD0gTWF0aC5leHAoLXgpKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4geCAqIGJldGE7XG5cdH1cblxufTtcblxuUmFuZG9tLnByb3RvdHlwZS5ub3JtYWwgPSBmdW5jdGlvbiAobXUsIHNpZ21hKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcIm5vcm1hbCgpIG11c3QgYmUgY2FsbGVkXCIgIC8vIEFSR19DSEVDS1xuXHRcdFx0XHQrIFwiIHdpdGggbXUgYW5kIHNpZ21hIHBhcmFtZXRlcnNcIik7ICAgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblx0dmFyIHogPSB0aGlzLmxhc3ROb3JtYWw7XG5cdHRoaXMubGFzdE5vcm1hbCA9IE5hTjtcblx0aWYgKCF6KSB7XG5cdFx0dmFyIGEgPSB0aGlzLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG5cdFx0dmFyIGIgPSBNYXRoLnNxcnQoLTIuMCAqIE1hdGgubG9nKDEuMCAtIHRoaXMucmFuZG9tKCkpKTtcblx0XHR6ID0gTWF0aC5jb3MoYSkgKiBiO1xuXHRcdHRoaXMubGFzdE5vcm1hbCA9IE1hdGguc2luKGEpICogYjtcblx0fVxuXHRyZXR1cm4gbXUgKyB6ICogc2lnbWE7XG59O1xuXG5SYW5kb20ucHJvdG90eXBlLnBhcmV0byA9IGZ1bmN0aW9uIChhbHBoYSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAxKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcInBhcmV0bygpIG11c3QgYmUgY2FsbGVkXCIgLy8gQVJHX0NIRUNLXG5cdFx0XHRcdCsgXCIgd2l0aCBhbHBoYSBwYXJhbWV0ZXJcIik7ICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblx0dmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuXHRyZXR1cm4gMS4wIC8gTWF0aC5wb3coKDEgLSB1KSwgMS4wIC8gYWxwaGEpO1xufTtcblxuUmFuZG9tLnByb3RvdHlwZS50cmlhbmd1bGFyID0gZnVuY3Rpb24gKGxvd2VyLCB1cHBlciwgbW9kZSkge1xuXHQvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RyaWFuZ3VsYXJfZGlzdHJpYnV0aW9uXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDMpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwidHJpYW5ndWxhcigpIG11c3QgYmUgY2FsbGVkXCIgLy8gQVJHX0NIRUNLXG5cdFx0KyBcIiB3aXRoIGxvd2VyLCB1cHBlciBhbmQgbW9kZSBwYXJhbWV0ZXJzXCIpOyAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdHZhciBjID0gKG1vZGUgLSBsb3dlcikgLyAodXBwZXIgLSBsb3dlcik7XG5cdHZhciB1ID0gdGhpcy5yYW5kb20oKTtcblxuXHRpZiAodSA8PSBjKSB7XG5cdFx0cmV0dXJuIGxvd2VyICsgTWF0aC5zcXJ0KHUgKiAodXBwZXIgLSBsb3dlcikgKiAobW9kZSAtIGxvd2VyKSk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHVwcGVyIC0gTWF0aC5zcXJ0KCgxIC0gdSkgKiAodXBwZXIgLSBsb3dlcikgKiAodXBwZXIgLSBtb2RlKSk7XG5cdH1cbn07XG5cblJhbmRvbS5wcm90b3R5cGUudW5pZm9ybSA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJ1bmlmb3JtKCkgbXVzdCBiZSBjYWxsZWRcIiAvLyBBUkdfQ0hFQ0tcblx0XHQrIFwiIHdpdGggbG93ZXIgYW5kIHVwcGVyIHBhcmFtZXRlcnNcIik7ICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdHJldHVybiBsb3dlciArIHRoaXMucmFuZG9tKCkgKiAodXBwZXIgLSBsb3dlcik7XG59O1xuXG5SYW5kb20ucHJvdG90eXBlLndlaWJ1bGwgPSBmdW5jdGlvbiAoYWxwaGEsIGJldGEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMikgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJ3ZWlidWxsKCkgbXVzdCBiZSBjYWxsZWRcIiAvLyBBUkdfQ0hFQ0tcblx0XHQrIFwiIHdpdGggYWxwaGEgYW5kIGJldGEgcGFyYW1ldGVyc1wiKTsgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0dmFyIHUgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuXHRyZXR1cm4gYWxwaGEgKiBNYXRoLnBvdygtTWF0aC5sb2codSksIDEuMCAvIGJldGEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb207XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3NpbWpzLXJhbmRvbS9zaW1qcy1yYW5kb20uanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMiJdLCJzb3VyY2VSb290IjoiIn0=