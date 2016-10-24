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

!function(t,n){ true?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports["parallel-es"]=n():t["parallel-es"]=n()}(this,function(){return function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var e={};return n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,n,e){Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=170)}(function(t){for(var n in t)if(Object.prototype.hasOwnProperty.call(t,n))switch(typeof t[n]){case"function":break;case"object":t[n]=function(n){var e=n.slice(1),r=t[n[0]];return function(t,n,i){r.apply(this,[t,n,i].concat(e))}}(t[n]);break;default:t[n]=t[t[n]]}return t}([function(t,n){"use strict";n.__esModule=!0,n["default"]=function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(72),o=r(i);n["default"]=function(){function t(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o["default"])(t,r.key,r)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}()},function(t,n){var e=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=e)},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n,e){var r=e(47)("wks"),i=e(31),o=e(3).Symbol,u="function"==typeof o,a=t.exports=function(t){return r[t]||(r[t]=u&&o[t]||(u?o:i)("Symbol."+t))};a.store=r},function(t,n,e){t.exports=!e(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,n,e){var r=e(7),i=e(41),o=e(30),u=Object.defineProperty;n.f=e(5)?Object.defineProperty:function(t,n,e){if(r(t),n=o(n,!0),r(e),i)try{return u(t,n,e)}catch(a){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(11);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,n,e){var r=e(3),i=e(2),o=e(14),u=e(10),a="prototype",c=function(t,n,e){var s,f,l,h=t&c.F,d=t&c.G,v=t&c.S,p=t&c.P,y=t&c.B,m=t&c.W,k=d?i:i[n]||(i[n]={}),_=k[a],g=d?r:v?r[n]:(r[n]||{})[a];d&&(e=n);for(s in e)f=!h&&g&&void 0!==g[s],f&&s in k||(l=f?g[s]:e[s],k[s]=d&&"function"!=typeof g[s]?e[s]:y&&f?o(l,r):m&&g[s]==l?function(t){var n=function(n,e,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,r)}return t.apply(this,arguments)};return n[a]=t[a],n}(l):p&&"function"==typeof l?o(Function.call,l):l,p&&((k.virtual||(k.virtual={}))[s]=l,t&c.R&&_&&!_[s]&&u(_,s,l)))};c.F=1,c.G=2,c.S=4,c.P=8,c.B=16,c.W=32,c.U=64,c.R=128,t.exports=c},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o);e.d(n,"a",function(){return a});var a=function(){function t(n,e){i()(this,t),this.func=n,this.params=e}return u()(t,null,[{key:"create",value:function(n){for(var e=arguments.length,r=Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];return new t(n,r)}},{key:"createUnchecked",value:function(n){for(var e=arguments.length,r=Array(e>1?e-1:0),i=1;i<e;i++)r[i-1]=arguments[i];return new t(n,r)}}]),t}()},function(t,n,e){var r=e(6),i=e(17);t.exports=e(5)?function(t,n,e){return r.f(t,n,i(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n,e){var r=e(81),i=e(39);t.exports=function(t){return r(i(t))}},function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},function(t,n,e){var r=e(24);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,i){return t.call(n,e,r,i)}}return function(){return t.apply(n,arguments)}}},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},function(t,n,e){"use strict";function r(t,n){return{_______isFunctionId:!0,identifier:t+"-"+n}}function i(t){return!!t&&t._______isFunctionId===!0}n.a=r,n.b=i},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,e){"use strict";var r=e(16);e.d(n,"a",function(){return i});var i={FILTER:e.i(r.a)("parallel",0),IDENTITY:e.i(r.a)("parallel",1),MAP:e.i(r.a)("parallel",2),PARALLEL_JOB_EXECUTOR:e.i(r.a)("parallel",3),RANGE:e.i(r.a)("parallel",4),REDUCE:e.i(r.a)("parallel",5),TIMES:e.i(r.a)("parallel",6),TO_ITERATOR:e.i(r.a)("parallel",7)}},function(t,n,e){t.exports={"default":e(123),__esModule:!0}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n){t.exports={}},function(t,n,e){var r=e(89),i=e(40);t.exports=Object.keys||function(t){return r(t,i)}},function(t,n,e){"use strict";var r=e(19),i=e.n(r),o=e(38),u=e.n(o),a=e(0),c=e.n(a),s=e(1),f=e.n(s),l=e(111),h=e(110);e.d(n,"a",function(){return d});var d=function(){function t(n){var e=this;c()(this,t),this.nextHandlers=[];var r=function(t,n,r){return e._next(t,n,r)},i=function(t){return e.reject(t)},o=function(t){return e.resolve(t)};n(r,o,i),this.promise=new u.a(function(t,n){e.resolve=t,e.reject=n})}return f()(t,[{key:"subscribe",value:function(t,n,e){return this.nextHandlers.push(t),(n||e)&&this.promise.then(e,n),this}},{key:"then",value:function(t,n){return this.promise.then(t,n)}},{key:"catch",value:function(t){return this.promise["catch"](t)}},{key:"_next",value:function(t,n,e){var r=!0,o=!1,u=void 0;try{for(var a,c=i()(this.nextHandlers);!(r=(a=c.next()).done);r=!0){var s=a.value;s.apply(void 0,arguments)}}catch(f){o=!0,u=f}finally{try{!r&&c["return"]&&c["return"]()}finally{if(o)throw u}}}}],[{key:"transform",value:function(n,e){var r=void 0,i=void 0,o=void 0,u=new t(function(t,n,e){r=t,i=n,o=e});return n.subscribe(r,o,function(t){return i(e(t))}),u}},{key:"fromTasks",value:function(t,n){return 0===t.length?new h.a(n.apply(void 0,[[]])):new l.a(t,n)}}]),t}()},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n,e){var r=e(11),i=e(3).document,o=r(i)&&r(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,n){t.exports=!0},function(t,n){n.f={}.propertyIsEnumerable},function(t,n,e){var r=e(6).f,i=e(15),o=e(4)("toStringTag");t.exports=function(t,n,e){t&&!i(t=e?t:t.prototype,o)&&r(t,o,{configurable:!0,value:n})}},function(t,n,e){var r=e(39);t.exports=function(t){return Object(r(t))}},function(t,n,e){var r=e(11);t.exports=function(t,n){if(!r(t))return t;var e,i;if(n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;if("function"==typeof(e=t.valueOf)&&!r(i=e.call(t)))return i;if(!n&&"function"==typeof(e=t.toString)&&!r(i=e.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},function(t,n,e){"use strict";var r=e(153)(!0);e(84)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})})},function(t,n,e){"use strict";var r=e(63),i=(e.n(r),e(56)),o=(e.n(i),e(59)),u=(e.n(o),e(60)),a=(e.n(u),e(62)),c=(e.n(a),e(64)),s=(e.n(c),e(61)),f=(e.n(s),e(65));e.n(f);e.o(r,"IParallel")&&e.d(n,"a",function(){return r.IParallel}),e.o(i,"IParallelChain")&&e.d(n,"b",function(){return i.IParallelChain}),e.o(o,"IParallelTaskEnvironment")&&e.d(n,"c",function(){return o.IParallelTaskEnvironment}),e.o(o,"IParallelEnvironment")&&e.d(n,"d",function(){return o.IParallelEnvironment}),e.o(u,"IParallelJob")&&e.d(n,"e",function(){return u.IParallelJob}),e.o(a,"IParallelOptions")&&e.d(n,"f",function(){return a.IParallelOptions}),e.o(a,"IDefaultInitializedParallelOptions")&&e.d(n,"g",function(){return a.IDefaultInitializedParallelOptions}),e.o(c,"IParallelJobScheduler")&&e.d(n,"h",function(){return c.IParallelJobScheduler}),e.o(s,"IParallelOperation")&&e.d(n,"i",function(){return s.IParallelOperation}),e.o(s,"ISerializedParallelOperation")&&e.d(n,"j",function(){return s.ISerializedParallelOperation}),e.o(f,"IParallelStream")&&e.d(n,"k",function(){return f.IParallelStream})},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o);e.d(n,"a",function(){return a});var a=function(){function t(n){i()(this,t),this.functionRegistry=n}return u()(t,[{key:"serializeFunctionCall",value:function(t){var n=this.functionRegistry.getOrSetId(t.func);return{______serializedFunctionCall:!0,functionId:n,parameters:t.params}}}]),t}()},function(t,n,e){"use strict";function r(t){return!!t&&t.______serializedFunctionCall===!0}n.a=r},function(t,n,e){"use strict";function r(t){if(0===t.length)return[];var n=o()(t),e=n[0],r=n.slice(1);return Array.prototype.concat.apply(e,r)}var i=e(75),o=e.n(i),u=e(19);e.n(u);n.a=r},function(t,n,e){t.exports={"default":e(129),__esModule:!0}},function(t,n,e){t.exports={"default":e(131),__esModule:!0}},function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,n,e){t.exports=!e(5)&&!e(13)(function(){return 7!=Object.defineProperty(e(25)("div"),"a",{get:function(){return 7}}).a})},function(t,n,e){var r=e(7),i=e(148),o=e(40),u=e(46)("IE_PROTO"),a=function(){},c="prototype",s=function(){var t,n=e(25)("iframe"),r=o.length,i="<",u=">";for(n.style.display="none",e(80).appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write(i+"script"+u+"document.F=Object"+i+"/script"+u),t.close(),s=t.F;r--;)delete s[c][o[r]];return s()};t.exports=Object.create||function(t,n){var e;return null!==t?(a[c]=r(t),e=new a,a[c]=null,e[u]=t):e=s(),void 0===n?e:i(e,n)}},function(t,n,e){var r=e(27),i=e(17),o=e(12),u=e(30),a=e(15),c=e(41),s=Object.getOwnPropertyDescriptor;n.f=e(5)?s:function(t,n){if(t=o(t),n=u(n,!0),c)try{return s(t,n)}catch(e){}if(a(t,n))return i(!r.f.call(t,n),t[n])}},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n,e){var r=e(8),i=e(2),o=e(13);t.exports=function(t,n){var e=(i.Object||{})[t]||Object[t],u={};u[t]=n(e),r(r.S+r.F*o(function(){e(1)}),"Object",u)}},function(t,n,e){var r=e(47)("keys"),i=e(31);t.exports=function(t){return r[t]||(r[t]=i(t))}},function(t,n,e){var r=e(3),i="__core-js_shared__",o=r[i]||(r[i]={});t.exports=function(t){return o[t]||(o[t]={})}},function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},function(t,n,e){var r=e(48),i=Math.min;t.exports=function(t){return t>0?i(r(t),9007199254740991):0}},function(t,n,e){var r=e(3),i=e(2),o=e(26),u=e(51),a=e(6).f;t.exports=function(t){var n=i.Symbol||(i.Symbol=o?{}:r.Symbol||{});"_"==t.charAt(0)||t in n||a(n,t,{value:u.f(t)})}},function(t,n,e){n.f=e(4)},function(t,n,e){var r=e(79),i=e(4)("iterator"),o=e(21);t.exports=e(2).getIteratorMethod=function(t){if(void 0!=t)return t[i]||t["@@iterator"]||o[r(t)]}},function(t,n,e){e(157);for(var r=e(3),i=e(10),o=e(21),u=e(4)("toStringTag"),a=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],c=0;c<5;c++){var s=a[c],f=r[s],l=f&&f.prototype;l&&!l[u]&&i(l,u,s),o[s]=o.Array}},function(t,n,e){"use strict";var r=e(33),i=e(66),o=(e.n(i),e(67)),u=(e.n(o),e(55)),a=(e.n(u),e(16)),c=e(9),s=e(35),f=e(34),l=e(68),h=(e.n(l),e(33));e.d(n,"a",function(){return r.a}),e.o(i,"ITaskDefinition")&&e.d(n,"b",function(){return i.ITaskDefinition}),e.o(o,"ITask")&&e.d(n,"c",function(){return o.ITask}),e.o(u,"IFunctionDefinition")&&e.d(n,"d",function(){return u.IFunctionDefinition}),e.d(n,"e",function(){return a.IFunctionId}),e.d(n,"f",function(){return a.b}),e.d(n,"g",function(){return c.a}),e.d(n,"h",function(){return s.ISerializedFunctionCall}),e.d(n,"i",function(){return s.a}),e.d(n,"j",function(){return f.a}),e.o(l,"IThreadPool")&&e.d(n,"k",function(){return l.IThreadPool}),e.d(n,"l",function(){return h.b}),e.d(n,"m",function(){return h.c}),e.d(n,"n",function(){return h.d}),e.d(n,"o",function(){return h.e}),e.d(n,"p",function(){return h.f}),e.d(n,"q",function(){return h.g}),e.d(n,"r",function(){return h.h}),e.d(n,"s",function(){return h.i}),e.d(n,"t",function(){return h.j}),e.d(n,"u",function(){return h.k})},function(t,n){},function(t,n){},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(102);e.d(n,"a",function(){return c});var c=function(){function t(n,e,r){i()(this,t),this.options=e,this.environment=r,this.stream=n}return u()(t,[{key:"resolve",value:function(){return this}},{key:"chainOperation",value:function(t){return new a.a(this.stream,this.options,this.environment,[t])}},{key:"addEnvironment",value:function(t){return new a.a(this.stream,this.options,this.environment.add(t))}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(18),c=e(9);e.d(n,"a",function(){return s});var s=function(){function t(n){i()(this,t),this.collection=n}return u()(t,[{key:"serializeSlice",value:function(t,n,e){var r=n*t,i=r+n;return e.serializeFunctionCall(c.a.createUnchecked(a.a.TO_ITERATOR,this.collection.slice(r,i)))}},{key:"length",get:function(){return this.collection.length}}]),t}()},56,56,function(t,n){},56,56,56,56,55,55,56,function(t,n,e){"use strict";function r(t){return{type:d.InitializeWorker,workerId:t}}function i(t){return{task:t,type:d.ScheduleTask}}function o(t){return{functions:t,type:d.FunctionResponse}}function u(){return{type:d.Stop}}function a(t){return t.type===d.FunctionRequest}function c(t){return t.type===d.WorkerResult}function s(t){return t.type===d.FunctionExecutionError}var f=e(114),l=(e.n(f),e(117)),h=(e.n(l),e(19));e.n(h);n.e=r,n.f=i,n.b=o,n.g=u,n.a=a,n.c=c,n.d=s;var d;!function(t){t[t.InitializeWorker=0]="InitializeWorker",t[t.ScheduleTask=1]="ScheduleTask",t[t.FunctionRequest=2]="FunctionRequest",t[t.FunctionResponse=3]="FunctionResponse",t[t.WorkerResult=4]="WorkerResult",t[t.FunctionExecutionError=5]="FunctionExecutionError",t[t.Stop=6]="Stop"}(d||(d={}))},function(t,n,e){t.exports={"default":e(122),__esModule:!0}},function(t,n,e){t.exports={"default":e(125),__esModule:!0}},function(t,n,e){t.exports={"default":e(78),__esModule:!0}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(118),o=r(i),u=e(115),a=r(u),c=e(77),s=r(c);n["default"]=function(t,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+("undefined"==typeof n?"undefined":(0,s["default"])(n)));t.prototype=(0,a["default"])(n&&n.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),n&&(o["default"]?(0,o["default"])(t,n):t.__proto__=n)}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(77),o=r(i);n["default"]=function(t,n){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!==("undefined"==typeof n?"undefined":(0,o["default"])(n))&&"function"!=typeof n?t:n}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(70),o=r(i);n["default"]=function(t){return Array.isArray(t)?t:(0,o["default"])(t)}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(70),o=r(i);n["default"]=function(t){if(Array.isArray(t)){for(var n=0,e=Array(t.length);n<t.length;n++)e[n]=t[n];return e}return(0,o["default"])(t)}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(120),o=r(i),u=e(119),a=r(u),c="function"==typeof a["default"]&&"symbol"==typeof o["default"]?function(t){return typeof t}:function(t){return t&&"function"==typeof a["default"]&&t.constructor===a["default"]?"symbol":typeof t};n["default"]="function"==typeof a["default"]&&"symbol"===c(o["default"])?function(t){return"undefined"==typeof t?"undefined":c(t)}:function(t){return t&&"function"==typeof a["default"]&&t.constructor===a["default"]?"symbol":"undefined"==typeof t?"undefined":c(t)}},function(t,n,e){e(92);var r=e(2).Object;t.exports=function(t,n,e){return r.defineProperty(t,n,e)}},function(t,n,e){var r=e(20),i=e(4)("toStringTag"),o="Arguments"==r(function(){return arguments}()),u=function(t,n){try{return t[n]}catch(e){}};t.exports=function(t){var n,e,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=u(n=Object(t),i))?e:o?r(n):"Object"==(a=r(n))&&"function"==typeof n.callee?"Arguments":a}},function(t,n,e){t.exports=e(3).document&&document.documentElement},function(t,n,e){var r=e(20);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,n,e){var r=e(21),i=e(4)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||o[i]===t)}},function(t,n,e){var r=e(7);t.exports=function(t,n,e,i){try{return i?n(r(e)[0],e[1]):n(e)}catch(o){var u=t["return"];throw void 0!==u&&r(u.call(t)),o}}},function(t,n,e){"use strict";var r=e(26),i=e(8),o=e(90),u=e(10),a=e(15),c=e(21),s=e(142),f=e(28),l=e(88),h=e(4)("iterator"),d=!([].keys&&"next"in[].keys()),v="@@iterator",p="keys",y="values",m=function(){return this};t.exports=function(t,n,e,k,_,g,w){s(e,n,k);var b,x,O,P=function(t){if(!d&&t in T)return T[t];switch(t){case p:return function(){return new e(this,t)};case y:return function(){return new e(this,t)}}return function(){return new e(this,t)}},I=n+" Iterator",S=_==y,E=!1,T=t.prototype,j=T[h]||T[v]||_&&T[_],M=j||P(_),F=_?S?P("entries"):M:void 0,C="Array"==n?T.entries||j:j;if(C&&(O=l(C.call(new t)),O!==Object.prototype&&(f(O,I,!0),r||a(O,h)||u(O,h,m))),S&&j&&j.name!==y&&(E=!0,M=function(){return j.call(this)}),r&&!w||!d&&!E&&T[h]||u(T,h,M),c[n]=M,c[I]=m,_)if(b={values:S?M:P(y),keys:g?M:P(p),entries:F},w)for(x in b)x in T||o(T,x,b[x]);else i(i.P+i.F*(d||E),n,b);return b}},function(t,n,e){var r=e(4)("iterator"),i=!1;try{var o=[7][r]();o["return"]=function(){i=!0},Array.from(o,function(){throw 2})}catch(u){}t.exports=function(t,n){if(!n&&!i)return!1;var e=!1;try{var o=[7],u=o[r]();u.next=function(){return{done:e=!0}},o[r]=function(){return u},t(o)}catch(a){}return e}},function(t,n,e){var r=e(12),i=e(87).f,o={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(t){try{return i(t)}catch(n){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==o.call(t)?a(t):i(r(t))}},function(t,n,e){var r=e(89),i=e(40).concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,i)}},function(t,n,e){var r=e(15),i=e(29),o=e(46)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=i(t),r(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,n,e){var r=e(15),i=e(12),o=e(136)(!1),u=e(46)("IE_PROTO");t.exports=function(t,n){var e,a=i(t),c=0,s=[];for(e in a)e!=u&&r(a,e)&&s.push(e);for(;n.length>c;)r(a,e=n[c++])&&(~o(s,e)||s.push(e));return s}},function(t,n,e){t.exports=e(10)},function(t,n,e){var r,i,o,u=e(14),a=e(140),c=e(80),s=e(25),f=e(3),l=f.process,h=f.setImmediate,d=f.clearImmediate,v=f.MessageChannel,p=0,y={},m="onreadystatechange",k=function(){var t=+this;if(y.hasOwnProperty(t)){var n=y[t];delete y[t],n()}},_=function(t){k.call(t.data)};h&&d||(h=function(t){for(var n=[],e=1;arguments.length>e;)n.push(arguments[e++]);return y[++p]=function(){a("function"==typeof t?t:Function(t),n)},r(p),p},d=function(t){delete y[t]},"process"==e(20)(l)?r=function(t){l.nextTick(u(k,t,1))}:v?(i=new v,o=i.port2,i.port1.onmessage=_,r=u(o.postMessage,o,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(t){f.postMessage(t+"","*")},f.addEventListener("message",_,!1)):r=m in s("script")?function(t){c.appendChild(s("script"))[m]=function(){c.removeChild(this),k.call(t)}}:function(t){setTimeout(u(k,t,1),0)}),t.exports={set:h,clear:d}},function(t,n,e){var r=e(8);r(r.S+r.F*!e(5),"Object",{defineProperty:e(6).f})},61,function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(101);e.d(n,"a",function(){return s});var c=e(168),s=function(){function t(n){i()(this,t),this.functionLookupTable=n}return u()(t,[{key:"spawn",value:function(){if(!window.Worker)throw new Error("Missing Web Worker support");var t=new c,n=new a.a(t,this.functionLookupTable);return n.initialize(),n}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(113),c=e(16);e.d(n,"a",function(){return s});var s=function(){function t(){i()(this,t),this.ids=new a.a,this.definitions=new a.a,this.lastId=0}return u()(t,[{key:"getOrSetId",value:function(t){if(e.i(c.b)(t))return t;var n=t.toString(),r=this.ids.get(n);return"undefined"==typeof r&&(r=e.i(c.a)("dynamic",++this.lastId),this.initDefinition(t,r)),r}},{key:"getDefinition",value:function(t){return this.definitions.get(t.identifier)}},{key:"initDefinition",value:function(t,n){var e=t.toString(),r=e.substring(e.indexOf("function")+9,e.indexOf("(")).trim(),i=e.substring(e.indexOf("(")+1,e.indexOf(")")).split(","),o=e.substring(e.indexOf("{")+1,e.lastIndexOf("}")).trim(),u={argumentNames:i.map(function(t){return t.trim()}),body:o,id:n,name:"anonymous"!==r?r:void 0};this.ids.set(e,n),this.definitions.set(n.identifier,u)}}]),t}()},function(t,n,e){"use strict";function r(t){function n(n){if(n){if(n.hasOwnProperty("threadPool")&&"undefined"==typeof n.threadPool)throw new Error("The thread pool is mandatory and cannot be unset");if(n.hasOwnProperty("maxConcurrencyLevel")&&"number"!=typeof n.maxConcurrencyLevel)throw new Error("The maxConcurrencyLevel is mandatory and has to be a number")}return o()({},t,n)}return{defaultOptions:function(e){return e?void(t=n(e)):o()({},t)},from:function(t,r){return e.i(s.a)(new u.a(t),n(r))},range:function(t,r,i,o){var u=a.a.create(t,r,i);return e.i(s.a)(u,n(o))},times:function(t,r,i,o){return i?e.i(s.a)(c.a.create(t,r),n(o),i):e.i(s.a)(c.a.create(t,r),n(o))},schedule:function(n){for(var r,i=arguments.length,o=Array(i>1?i-1:0),u=1;u<i;u++)o[u-1]=arguments[u];if(e.i(f.b)(n)){var a;return(a=t.threadPool).schedule.apply(a,[n].concat(o))}return(r=t.threadPool).schedule.apply(r,[n].concat(o))}}}var i=e(71),o=e.n(i),u=e(58),a=e(106),c=e(107),s=e(103),f=e(16);e.d(n,"a",function(){return r})},function(t,n,e){"use strict";var r=e(37),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(74),f=e.n(s),l=e(73),h=e.n(l),d=e(109);e.d(n,"a",function(){return v});var v=function(t){function n(){return u()(this,n),f()(this,(n.__proto__||i()(n)).apply(this,arguments))}return h()(n,t),c()(n,[{key:"getScheduling",value:function(t,n){var e=t/(4*n.maxConcurrencyLevel);return n.minValuesPerTask&&(e=Math.min(Math.max(e,n.minValuesPerTask),t)),n.maxValuesPerTask&&(e=Math.min(e,n.maxValuesPerTask)),{numberOfTasks:0===e?0:Math.round(t/e),valuesPerTask:Math.ceil(e)}}}]),n}(d.a)},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(112),c=e(9);e.d(n,"a",function(){return s});var s=function(){function t(n,e,r){i()(this,t),this.workerThreadFactory=n,this.functionCallSerializer=e,this.workers=[],this.idleWorkers=[],this.queue=[],this.lastTaskId=-1,this.concurrencyLimit=r.maxConcurrencyLevel}return u()(t,[{key:"schedule",value:function(t){for(var n=arguments.length,e=Array(n>1?n-1:0),r=1;r<n;r++)e[r-1]=arguments[r];var i=this.functionCallSerializer.serializeFunctionCall(c.a.createUnchecked.apply(c.a,[t].concat(e))),o={main:i,usedFunctionIds:[i.functionId]};return this.scheduleTask(o)}},{key:"scheduleTask",value:function(t){var n=this;t.id=++this.lastTaskId;var e=new a.a(t);return e.always(function(){return n._releaseWorker(e)}),this.queue.unshift(e),this._schedulePendingTasks(),e}},{key:"getFunctionSerializer",value:function(){return this.functionCallSerializer}},{key:"_releaseWorker",value:function(t){var n=t.releaseWorker();this.idleWorkers.push(n),this._schedulePendingTasks()}},{key:"_schedulePendingTasks",value:function(){for(;this.queue.length;){var t=void 0;if(0===this.idleWorkers.length&&this.workers.length<this.concurrencyLimit?(t=this.workerThreadFactory.spawn(),this.workers.push(t)):this.idleWorkers.length>0&&(t=this.idleWorkers.pop()),!t)return;var n=this.queue.pop();n.runOn(t)}}}]),t}()},function(t,n,e){"use strict";var r=e(96),i=e(98),o=e(97),u=e(95),a=e(34),c=e(94),s=e(54);e.d(n,"IParallel",function(){return s.a}),e.d(n,"ITaskDefinition",function(){return s.b}),e.d(n,"ITask",function(){return s.c}),e.d(n,"IFunctionDefinition",function(){return s.d}),e.d(n,"IFunctionId",function(){return s.e}),e.d(n,"isFunctionId",function(){return s.f}),e.d(n,"FunctionCall",function(){return s.g}),e.d(n,"ISerializedFunctionCall",function(){return s.h}),e.d(n,"isSerializedFunctionCall",function(){return s.i}),e.d(n,"FunctionCallSerializer",function(){return s.j}),e.d(n,"IThreadPool",function(){return s.k}),e.d(n,"IParallelChain",function(){return s.l}),e.d(n,"IParallelTaskEnvironment",function(){return s.m}),e.d(n,"IParallelEnvironment",function(){return s.n}),e.d(n,"IParallelJob",function(){return s.o}),e.d(n,"IParallelOptions",function(){return s.p}),e.d(n,"IDefaultInitializedParallelOptions",function(){return s.q}),e.d(n,"IParallelJobScheduler",function(){return s.r}),e.d(n,"IParallelOperation",function(){return s.s}),e.d(n,"ISerializedParallelOperation",function(){return s.t}),e.d(n,"IParallelStream",function(){return s.u});var f=new u.a,l=window.navigator.hardwareConcurrency||4,h=new a.a(f),d=new i.a(new c.a(f),h,{maxConcurrencyLevel:l}),v=e.i(r.a)({maxConcurrencyLevel:l,scheduler:new o.a,threadPool:d});n["default"]=v},function(t,n,e){"use strict";var r=e(37),i=e.n(r),o=e(74),u=e.n(o),a=e(121),c=e.n(a),s=e(73),f=e.n(s),l=e(0),h=e.n(l),d=e(1),v=e.n(d),p=e(69);e.d(n,"a",function(){return y}),e.d(n,"b",function(){return m});var y=function(){function t(n){h()(this,t),this.name=n}return v()(t,[{key:"onMessage",value:function(t){throw new Error("Browser worker thread in state '"+this.name+"' cannot handle the received message ("+t.data.type+").")}},{key:"onError",value:function(t){console.error("Processing error on worker slave",t.error)}}]),t}(),m=function(t){function n(t,e,r){h()(this,n);var o=u()(this,(n.__proto__||i()(n)).call(this,"executing"));return o.callback=t,o.functionRegistry=e,o.worker=r,o}return f()(n,t),v()(n,[{key:"onMessage",value:function(t){var r=this,o=t.data;if(e.i(p.a)(o)){var u=o.functionIds.map(function(t){var n=r.functionRegistry.getDefinition(t);if(!n)throw Error(r+" requested unknown function with id "+t);return n});this.worker.postMessage(e.i(p.b)(u))}else e.i(p.c)(o)?this.callback(void 0,o.result):e.i(p.d)(o)?this.callback(o.error,void 0):c()(n.prototype.__proto__||i()(n.prototype),"onMessage",this).call(this,t)}},{key:"onError",value:function(t){this.callback(t.error,void 0)}}]),n}(y)},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(69),c=e(100);e.d(n,"a",function(){return f});var s=0,f=function(){function t(n,e){i()(this,t),this.worker=n,this.functionLookupTable=e,this.id=++s,this.state=new c.a("default"),this.stopped=!1;var r=this;this.worker.addEventListener("message",function(){r.onWorkerMessage.apply(r,arguments)}),this.worker.addEventListener("error",function(){r.onError.apply(r,arguments)})}return u()(t,[{key:"initialize",value:function(){if("default"!==this.state.name)throw new Error("The browser worker thread can only be initialized if in state default but actual state is '"+this.state.name+"'.");this.sendMessage(e.i(a.e)(this.id)),this.state=new c.a("idle")}},{key:"run",value:function(t,n){var r=this;if("idle"!==this.state.name)throw new Error("The browser worker thread can only execute a new task if in state idle but actual state is '"+this.state.name+"'.");this.sendMessage(e.i(a.f)(t));var i=function(t,e){r.stopped?r.state=new c.a("stopped"):r.state=new c.a("idle"),n(t,e)};this.state=new c.b(i,this.functionLookupTable,this.worker)}},{key:"stop",value:function(){this.stopped||(this.sendMessage(e.i(a.g)()),this.stopped=!0,"executing"!==this.state.name&&(this.state=new c.a("stopped")))}},{key:"toString",value:function(){return"BrowserWorkerThread { id: "+this.id+", state: "+this.state.name}},{key:"onWorkerMessage",value:function(t){this.state.onMessage(t)}},{key:"onError",value:function(t){this.state.onError(t),this.state=new c.a("errored")}},{key:"sendMessage",value:function(t){this.worker.postMessage(t)}}]),t}()},function(t,n,e){"use strict";var r=e(76),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(57),f=e(58),l=e(36),h=e(23);e.d(n,"a",function(){return d});var d=function(){function t(n,e,r){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[];u()(this,t),this.previousStream=n,this.options=e,this.environment=r,this.operations=i}return c()(t,[{key:"resolve",value:function n(){var t=this,e=void 0,n=void 0,r=void 0,i=new h.a(function(t,i,o){e=t,n=i,r=o});return this.previousStream.then(function(i){var o=t.options.scheduler.schedule({environment:t.environment,generator:new f.a(i),operations:t.operations,options:t.options}),u=h.a.fromTasks(o,l.a);u.subscribe(e,r,n)},r),new s.a(i,this.options,this.environment)}},{key:"chainOperation",value:function(n){return new t(this.previousStream,this.options,this.environment,[].concat(i()(this.operations),[n]))}},{key:"addEnvironment",value:function(n){return new t(this.previousStream,this.options,this.environment.add(n),this.operations)}}]),t}()},function(t,n,e){"use strict";function r(t,n,e){var r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],a=void 0;e instanceof Array?(a=void 0,r=e):a=e;var c=new o.a(new i.a(t,n,u.a.of(),r));return a?c.inEnvironment(a):c}var i=e(105),o=e(104),u=e(108);n.a=r},function(t,n,e){"use strict";var r=e(19),i=e.n(r),o=e(75),u=e.n(o),a=e(0),c=e.n(a),s=e(1),f=e.n(s),l=e(18),h=e(9),d=e(23);e.d(n,"a",function(){return v});var v=function(){function t(n){c()(this,t),this.state=n}return f()(t,[{key:"inEnvironment",value:function(n){var e=void 0;if("function"==typeof n){for(var r=arguments.length,i=Array(r>1?r-1:0),o=1;o<r;o++)i[o-1]=arguments[o];e=h.a.createUnchecked.apply(h.a,[n].concat(i))}else e=n;return new t(this.state.addEnvironment(e))}},{key:"map",value:function(t){return this._chain(h.a.createUnchecked(l.a.MAP),h.a.createUnchecked(t))}},{key:"reduce",value:function(t,n,e){var r=e||n,o=this._chain(h.a.createUnchecked(l.a.REDUCE,t),h.a.createUnchecked(n)).resolveChain();return d.a.transform(o,function(n){if(0===n.length)return t;var e=u()(n),o=e[0],a=e.slice(1),c=o,s=!0,f=!1,l=void 0;try{for(var h,d=i()(a);!(s=(h=d.next()).done);s=!0){var v=h.value;c=r(c,v)}}catch(p){f=!0,l=p}finally{try{!s&&d["return"]&&d["return"]()}finally{if(f)throw l}}return c})}},{key:"filter",value:function(t){return this._chain(h.a.createUnchecked(l.a.FILTER),h.a.createUnchecked(t))}},{key:"subscribe",value:function(t,n,e){return this.resolveChain().subscribe(t,n,e)}},{key:"then",value:function(t,n){return this.resolveChain().then(t,n)}},{key:"catch",value:function(t){return this.resolveChain()["catch"](t)}},{key:"resolveChain",value:function(){var t=this.state=this.state.resolve();return t.stream}},{key:"_chain",value:function(n,e){var r={iterator:n,iteratee:e};return new t(this.state.chainOperation(r))}}]),t}()},function(t,n,e){"use strict";var r=e(76),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(57),f=e(23),l=e(36);e.d(n,"a",function(){return h});var h=function(){function t(n,e,r,i){u()(this,t),this.generator=n,this.options=e,
this.environment=r,this.operations=i}return c()(t,[{key:"resolve",value:function(){var t=this.options.scheduler.schedule({environment:this.environment,generator:this.generator,operations:this.operations,options:this.options});return new s.a(f.a.fromTasks(t,l.a),this.options,this.environment)}},{key:"chainOperation",value:function(n){return new t(this.generator,this.options,this.environment,[].concat(i()(this.operations),[n]))}},{key:"addEnvironment",value:function(n){return new t(this.generator,this.options,this.environment.add(n),this.operations)}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(18),c=e(9);e.d(n,"a",function(){return s});var s=function(){function t(n,e,r){i()(this,t),this.start=n,this.end=e,this.step=r}return u()(t,[{key:"serializeSlice",value:function(t,n,e){var r=n*this.step,i=this.start+t*r,o=Math.min(i+r,this.end);return e.serializeFunctionCall(c.a.createUnchecked(a.a.RANGE,i,o,this.step))}},{key:"length",get:function(){return Math.ceil((this.end-this.start)/this.step)}}],[{key:"create",value:function(n,e,r){return"undefined"==typeof e&&(e=n,n=0),"undefined"==typeof r&&(r=e<n?-1:1),new t(n,e,r)}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(18),c=e(9),s=e(16);e.d(n,"a",function(){return f});var f=function(){function t(n,e){i()(this,t),this.times=n,this.iteratee=e}return u()(t,[{key:"serializeSlice",value:function(t,n,e){var r=t*n,i=Math.min(r+n,this.times),o=e.serializeFunctionCall(this.iteratee);return e.serializeFunctionCall(c.a.create(a.a.TIMES,r,i,o))}},{key:"length",get:function(){return this.times}}],[{key:"create",value:function(n,r){var i=void 0;return i=e.i(s.b)(r)||"function"==typeof r?c.a.createUnchecked(r):c.a.create(a.a.IDENTITY,r),new t(n,i)}}]),t}()},function(t,n,e){"use strict";var r=e(71),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(9);e.d(n,"a",function(){return f});var f=function(){function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];u()(this,t),this.environments=n}return c()(t,[{key:"add",value:function(n){var e=this.environments.slice();return n instanceof s.a||!(this.environments.length>0)||this.environments[this.environments.length-1]instanceof s.a?e.push(n):e[e.length-1]=i()({},e[e.length-1],n),new t(e)}},{key:"toJSON",value:function(t){return this.environments.map(function(n){return n instanceof s.a?t.serializeFunctionCall(n):n})}}],[{key:"of",value:function(n){var e=t.EMPTY;return n?e.add(n):e}}]),t}();f.EMPTY=new f},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o),a=e(9),c=e(18),s=e(36),f=e(35);e.d(n,"a",function(){return l});var l=function(){function t(){i()(this,t)}return u()(t,[{key:"schedule",value:function(t){var n=this.getTaskDefinitions(t);return n.map(function(n){return t.options.threadPool.scheduleTask(n)})}},{key:"getTaskDefinitions",value:function(t){var n=this.getScheduling(t.generator.length,t.options),r=t.options.threadPool.getFunctionSerializer(),i=t.environment.toJSON(r),o=this.serializeOperations(t.operations,r),u=[c.a.PARALLEL_JOB_EXECUTOR].concat(e.i(s.a)(o.map(function(t){return[t.iteratee.functionId,t.iterator.functionId]})));i.forEach(function(t){e.i(f.a)(t)&&u.push(t.functionId)});for(var l=[],h=0;h<n.numberOfTasks;++h){var d=t.generator.serializeSlice(h,n.valuesPerTask,r),v={environments:i,generator:d,operations:o,taskIndex:h,valuesPerTask:n.valuesPerTask},p={main:r.serializeFunctionCall(a.a.createUnchecked(c.a.PARALLEL_JOB_EXECUTOR,v)),taskIndex:h,usedFunctionIds:[d.functionId].concat(u),valuesPerTask:n.valuesPerTask};l.push(p)}return l}},{key:"serializeOperations",value:function(t,n){return t.map(function(t){return{iteratee:n.serializeFunctionCall(t.iteratee),iterator:n.serializeFunctionCall(t.iterator)}})}}]),t}()},function(t,n,e){"use strict";var r=e(38),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a);e.d(n,"a",function(){return s});var s=function(){function t(n){u()(this,t),this.promise=i.a.resolve(n)}return c()(t,[{key:"subscribe",value:function(t,n,e){return(e||n)&&this.promise.then(e,n),this}},{key:"then",value:function(t,n){return this.promise.then(t,n)}},{key:"catch",value:function(t){return this.promise["catch"](t)}}]),t}()},function(t,n,e){"use strict";var r=e(19),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a),s=e(23);e.d(n,"a",function(){return f});var f=function(){function t(n,e){var r=this;u()(this,t),this.failed=!1,this.tasks=n,this.joiner=e,this.subResults=new Array(n.length),this.pending=n.length,this.innerStream=new s.a(function(t,n,e){r.next=t,r.resolve=n,r.reject=e});var o=!0,a=!1,c=void 0;try{for(var f,l=function(){var t=f.value;t.then(function(n){return r._taskCompleted(n,t.definition)},function(t){return r._taskFailed(t)})},h=i()(n);!(o=(f=h.next()).done);o=!0)l()}catch(d){a=!0,c=d}finally{try{!o&&h["return"]&&h["return"]()}finally{if(a)throw c}}}return c()(t,[{key:"subscribe",value:function(t,n,e){return this.innerStream.subscribe(t,n,e),this}},{key:"then",value:function(t,n){return this.innerStream.then(t,n)}},{key:"catch",value:function(t){return this.innerStream["catch"](t)}},{key:"_taskCompleted",value:function(t,n){if(0===this.pending)throw new Error("Stream already resolved but taskCompleted called one more time");--this.pending,this.subResults[n.taskIndex]=t,this.failed||(this.next(t,n.taskIndex,n.valuesPerTask),0===this.pending&&this.resolve(this.joiner.apply(void 0,[this.subResults])))}},{key:"_taskFailed",value:function(t){if(this.failed!==!0){this.failed=!0;for(var n=0;n<this.tasks.length;++n)"undefined"==typeof this.subResults[n]&&this.tasks[n].cancel();this.reject(t)}}}]),t}()},function(t,n,e){"use strict";var r=e(38),i=e.n(r),o=e(0),u=e.n(o),a=e(1),c=e.n(a);e.d(n,"a",function(){return s});var s=function(){function t(n){var e=this;u()(this,t),this.definition=n,this.isCancellationRequested=!1,this.isCanceled=!1,this.promise=new i.a(function(t,n){e.resolve=t,e.reject=n})}return c()(t,[{key:"runOn",value:function(t){var n=this;if(this.worker=t,this.isCancellationRequested)this._taskCompleted(void 0);else{var e=function(t,e){t?n.reject(t):n._taskCompleted(e)};this.worker.run(this.definition,e)}}},{key:"releaseWorker",value:function(){if(!this.worker)throw new Error("Cannot release a worker task that has no assigned worker thread.");var t=this.worker;return this.worker=void 0,t}},{key:"then",value:function(t,n){return n?this.promise.then(t,n):this.promise.then(t)}},{key:"catch",value:function(t){return this.promise["catch"](t)}},{key:"cancel",value:function(){this.isCancellationRequested=!0}},{key:"always",value:function(t){this.promise.then(t,t)}},{key:"_taskCompleted",value:function(t){this.isCancellationRequested?(this.isCanceled=!0,this.reject("Task has been canceled")):this.resolve(t)}}]),t}()},function(t,n,e){"use strict";var r=e(0),i=e.n(r),o=e(1),u=e.n(o);e.d(n,"a",function(){return a});var a=function(){function t(){i()(this,t),this.data={}}return u()(t,[{key:"get",value:function(t){var n=this.toInternalKey(t);return this.has(t)?this.data[n]:void 0}},{key:"has",value:function(t){return this.hasOwnProperty.call(this.data,this.toInternalKey(t))}},{key:"set",value:function(t,n){this.data[this.toInternalKey(t)]=n}},{key:"clear",value:function(){this.data={}}},{key:"toInternalKey",value:function(t){return"@"+t}}]),t}()},function(t,n,e){t.exports={"default":e(124),__esModule:!0}},function(t,n,e){t.exports={"default":e(126),__esModule:!0}},function(t,n,e){t.exports={"default":e(127),__esModule:!0}},function(t,n,e){t.exports={"default":e(128),__esModule:!0}},function(t,n,e){t.exports={"default":e(130),__esModule:!0}},function(t,n,e){t.exports={"default":e(132),__esModule:!0}},function(t,n,e){t.exports={"default":e(133),__esModule:!0}},function(t,n,e){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=e(37),o=r(i),u=e(116),a=r(u);n["default"]=function c(t,n,e){null===t&&(t=Function.prototype);var r=(0,a["default"])(t,n);if(void 0===r){var i=(0,o["default"])(t);return null===i?void 0:c(i,n,e)}if("value"in r)return r.value;var u=r.get;if(void 0!==u)return u.call(e)}},function(t,n,e){e(32),e(156),t.exports=e(2).Array.from},function(t,n,e){e(53),e(32),t.exports=e(155)},function(t,n,e){var r=e(2),i=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(t){return i.stringify.apply(i,arguments)}},function(t,n,e){e(158),t.exports=e(2).Object.assign},function(t,n,e){e(159);var r=e(2).Object;t.exports=function(t,n){return r.create(t,n)}},function(t,n,e){e(160);var r=e(2).Object;t.exports=function(t,n){return r.getOwnPropertyDescriptor(t,n)}},function(t,n,e){e(161);var r=e(2).Object;t.exports=function(t){return r.getOwnPropertyNames(t)}},function(t,n,e){e(162),t.exports=e(2).Object.getPrototypeOf},function(t,n,e){e(163),t.exports=e(2).Object.setPrototypeOf},function(t,n,e){e(93),e(32),e(53),e(164),t.exports=e(2).Promise},function(t,n,e){e(165),e(93),e(166),e(167),t.exports=e(2).Symbol},function(t,n,e){e(32),e(53),t.exports=e(51).f("iterator")},function(t,n){t.exports=function(){}},function(t,n){t.exports=function(t,n,e,r){if(!(t instanceof n)||void 0!==r&&r in t)throw TypeError(e+": incorrect invocation!");return t}},function(t,n,e){var r=e(12),i=e(49),o=e(154);t.exports=function(t){return function(n,e,u){var a,c=r(n),s=i(c.length),f=o(u,s);if(t&&e!=e){for(;s>f;)if(a=c[f++],a!=a)return!0}else for(;s>f;f++)if((t||f in c)&&c[f]===e)return t||f||0;return!t&&-1}}},function(t,n,e){"use strict";var r=e(6),i=e(17);t.exports=function(t,n,e){n in t?r.f(t,n,i(0,e)):t[n]=e}},function(t,n,e){var r=e(22),i=e(44),o=e(27);t.exports=function(t){var n=r(t),e=i.f;if(e)for(var u,a=e(t),c=o.f,s=0;a.length>s;)c.call(t,u=a[s++])&&n.push(u);return n}},function(t,n,e){var r=e(14),i=e(83),o=e(82),u=e(7),a=e(49),c=e(52),s={},f={},n=t.exports=function(t,n,e,l,h){var d,v,p,y,m=h?function(){return t}:c(t),k=r(e,l,n?2:1),_=0;if("function"!=typeof m)throw TypeError(t+" is not iterable!");if(o(m)){for(d=a(t.length);d>_;_++)if(y=n?k(u(v=t[_])[0],v[1]):k(t[_]),y===s||y===f)return y}else for(p=m.call(t);!(v=p.next()).done;)if(y=i(p,k,v.value,n),y===s||y===f)return y};n.BREAK=s,n.RETURN=f},function(t,n){t.exports=function(t,n,e){var r=void 0===e;switch(n.length){case 0:return r?t():t.call(e);case 1:return r?t(n[0]):t.call(e,n[0]);case 2:return r?t(n[0],n[1]):t.call(e,n[0],n[1]);case 3:return r?t(n[0],n[1],n[2]):t.call(e,n[0],n[1],n[2]);case 4:return r?t(n[0],n[1],n[2],n[3]):t.call(e,n[0],n[1],n[2],n[3])}return t.apply(e,n)}},function(t,n,e){var r=e(20);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,n,e){"use strict";var r=e(42),i=e(17),o=e(28),u={};e(10)(u,e(4)("iterator"),function(){return this}),t.exports=function(t,n,e){t.prototype=r(u,{next:i(1,e)}),o(t,n+" Iterator")}},function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},function(t,n,e){var r=e(22),i=e(12);t.exports=function(t,n){for(var e,o=i(t),u=r(o),a=u.length,c=0;a>c;)if(o[e=u[c++]]===n)return e}},function(t,n,e){var r=e(31)("meta"),i=e(11),o=e(15),u=e(6).f,a=0,c=Object.isExtensible||function(){return!0},s=!e(13)(function(){return c(Object.preventExtensions({}))}),f=function(t){u(t,r,{value:{i:"O"+ ++a,w:{}}})},l=function(t,n){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,r)){if(!c(t))return"F";if(!n)return"E";f(t)}return t[r].i},h=function(t,n){if(!o(t,r)){if(!c(t))return!0;if(!n)return!1;f(t)}return t[r].w},d=function(t){return s&&v.NEED&&c(t)&&!o(t,r)&&f(t),t},v=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:h,onFreeze:d}},function(t,n,e){var r=e(3),i=e(91).set,o=r.MutationObserver||r.WebKitMutationObserver,u=r.process,a=r.Promise,c="process"==e(20)(u);t.exports=function(){var t,n,e,s=function(){var r,i;for(c&&(r=u.domain)&&r.exit();t;){i=t.fn,t=t.next;try{i()}catch(o){throw t?e():n=void 0,o}}n=void 0,r&&r.enter()};if(c)e=function(){u.nextTick(s)};else if(o){var f=!0,l=document.createTextNode("");new o(s).observe(l,{characterData:!0}),e=function(){l.data=f=!f}}else if(a&&a.resolve){var h=a.resolve();e=function(){h.then(s)}}else e=function(){i.call(r,s)};return function(r){var i={fn:r,next:void 0};n&&(n.next=i),t||(t=i,e()),n=i}}},function(t,n,e){"use strict";var r=e(22),i=e(44),o=e(27),u=e(29),a=e(81),c=Object.assign;t.exports=!c||e(13)(function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach(function(t){n[t]=t}),7!=c({},t)[e]||Object.keys(c({},n)).join("")!=r})?function(t,n){for(var e=u(t),c=arguments.length,s=1,f=i.f,l=o.f;c>s;)for(var h,d=a(arguments[s++]),v=f?r(d).concat(f(d)):r(d),p=v.length,y=0;p>y;)l.call(d,h=v[y++])&&(e[h]=d[h]);return e}:c},function(t,n,e){var r=e(6),i=e(7),o=e(22);t.exports=e(5)?Object.defineProperties:function(t,n){i(t);for(var e,u=o(n),a=u.length,c=0;a>c;)r.f(t,e=u[c++],n[e]);return t}},function(t,n,e){var r=e(10);t.exports=function(t,n,e){for(var i in n)e&&t[i]?t[i]=n[i]:r(t,i,n[i]);return t}},function(t,n,e){var r=e(11),i=e(7),o=function(t,n){if(i(t),!r(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,r){try{r=e(14)(Function.call,e(43).f(Object.prototype,"__proto__").set,2),r(t,[]),n=!(t instanceof Array)}catch(i){n=!0}return function(t,e){return o(t,e),n?t.__proto__=e:r(t,e),t}}({},!1):void 0),check:o}},function(t,n,e){"use strict";var r=e(3),i=e(2),o=e(6),u=e(5),a=e(4)("species");t.exports=function(t){var n="function"==typeof i[t]?i[t]:r[t];u&&n&&!n[a]&&o.f(n,a,{configurable:!0,get:function(){return this}})}},function(t,n,e){var r=e(7),i=e(24),o=e(4)("species");t.exports=function(t,n){var e,u=r(t).constructor;return void 0===u||void 0==(e=r(u)[o])?n:i(e)}},function(t,n,e){var r=e(48),i=e(39);t.exports=function(t){return function(n,e){var o,u,a=String(i(n)),c=r(e),s=a.length;return c<0||c>=s?t?"":void 0:(o=a.charCodeAt(c),o<55296||o>56319||c+1===s||(u=a.charCodeAt(c+1))<56320||u>57343?t?a.charAt(c):o:t?a.slice(c,c+2):(o-55296<<10)+(u-56320)+65536)}}},function(t,n,e){var r=e(48),i=Math.max,o=Math.min;t.exports=function(t,n){return t=r(t),t<0?i(t+n,0):o(t,n)}},function(t,n,e){var r=e(7),i=e(52);t.exports=e(2).getIterator=function(t){var n=i(t);if("function"!=typeof n)throw TypeError(t+" is not iterable!");return r(n.call(t))}},function(t,n,e){"use strict";var r=e(14),i=e(8),o=e(29),u=e(83),a=e(82),c=e(49),s=e(137),f=e(52);i(i.S+i.F*!e(85)(function(t){Array.from(t)}),"Array",{from:function(t){var n,e,i,l,h=o(t),d="function"==typeof this?this:Array,v=arguments.length,p=v>1?arguments[1]:void 0,y=void 0!==p,m=0,k=f(h);if(y&&(p=r(p,v>2?arguments[2]:void 0,2)),void 0==k||d==Array&&a(k))for(n=c(h.length),e=new d(n);n>m;m++)s(e,m,y?p(h[m],m):h[m]);else for(l=k.call(h),e=new d;!(i=l.next()).done;m++)s(e,m,y?u(l,p,[i.value,m],!0):i.value);return e.length=m,e}})},function(t,n,e){"use strict";var r=e(134),i=e(143),o=e(21),u=e(12);t.exports=e(84)(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,i(1)):"keys"==n?i(0,e):"values"==n?i(0,t[e]):i(0,[e,t[e]])},"values"),o.Arguments=o.Array,r("keys"),r("values"),r("entries")},function(t,n,e){var r=e(8);r(r.S+r.F,"Object",{assign:e(147)})},function(t,n,e){var r=e(8);r(r.S,"Object",{create:e(42)})},function(t,n,e){var r=e(12),i=e(43).f;e(45)("getOwnPropertyDescriptor",function(){return function(t,n){return i(r(t),n)}})},function(t,n,e){e(45)("getOwnPropertyNames",function(){return e(86).f})},function(t,n,e){var r=e(29),i=e(88);e(45)("getPrototypeOf",function(){return function(t){return i(r(t))}})},function(t,n,e){var r=e(8);r(r.S,"Object",{setPrototypeOf:e(150).set})},function(t,n,e){"use strict";var r,i,o,u=e(26),a=e(3),c=e(14),s=e(79),f=e(8),l=e(11),h=e(24),d=e(135),v=e(139),p=e(152),y=e(91).set,m=e(146)(),k="Promise",_=a.TypeError,g=a.process,w=a[k],g=a.process,b="process"==s(g),x=function(){},O=!!function(){try{var t=w.resolve(1),n=(t.constructor={})[e(4)("species")]=function(t){t(x,x)};return(b||"function"==typeof PromiseRejectionEvent)&&t.then(x)instanceof n}catch(r){}}(),P=function(t,n){return t===n||t===w&&n===o},I=function(t){var n;return!(!l(t)||"function"!=typeof(n=t.then))&&n},S=function(t){return P(w,t)?new E(t):new i(t)},E=i=function(t){var n,e;this.promise=new t(function(t,r){if(void 0!==n||void 0!==e)throw _("Bad Promise constructor");n=t,e=r}),this.resolve=h(n),this.reject=h(e)},T=function(t){try{t()}catch(n){return{error:n}}},j=function(t,n){if(!t._n){t._n=!0;var e=t._c;m(function(){for(var r=t._v,i=1==t._s,o=0,u=function(n){var e,o,u=i?n.ok:n.fail,a=n.resolve,c=n.reject,s=n.domain;try{u?(i||(2==t._h&&C(t),t._h=1),u===!0?e=r:(s&&s.enter(),e=u(r),s&&s.exit()),e===n.promise?c(_("Promise-chain cycle")):(o=I(e))?o.call(e,a,c):a(e)):c(r)}catch(f){c(f)}};e.length>o;)u(e[o++]);t._c=[],t._n=!1,n&&!t._h&&M(t)})}},M=function(t){y.call(a,function(){var n,e,r,i=t._v;if(F(t)&&(n=T(function(){b?g.emit("unhandledRejection",i,t):(e=a.onunhandledrejection)?e({promise:t,reason:i}):(r=a.console)&&r.error&&r.error("Unhandled promise rejection",i)}),t._h=b||F(t)?2:1),t._a=void 0,n)throw n.error})},F=function(t){if(1==t._h)return!1;for(var n,e=t._a||t._c,r=0;e.length>r;)if(n=e[r++],n.fail||!F(n.promise))return!1;return!0},C=function(t){y.call(a,function(){var n;b?g.emit("rejectionHandled",t):(n=a.onrejectionhandled)&&n({promise:t,reason:t._v})})},A=function(t){var n=this;n._d||(n._d=!0,n=n._w||n,n._v=t,n._s=2,n._a||(n._a=n._c.slice()),j(n,!0))},R=function(t){var n,e=this;if(!e._d){e._d=!0,e=e._w||e;try{if(e===t)throw _("Promise can't be resolved itself");(n=I(t))?m(function(){var r={_w:e,_d:!1};try{n.call(t,c(R,r,1),c(A,r,1))}catch(i){A.call(r,i)}}):(e._v=t,e._s=1,j(e,!1))}catch(r){A.call({_w:e,_d:!1},r)}}};O||(w=function(t){d(this,w,k,"_h"),h(t),r.call(this);try{t(c(R,this,1),c(A,this,1))}catch(n){A.call(this,n)}},r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},r.prototype=e(149)(w.prototype,{then:function(t,n){var e=S(p(this,w));return e.ok="function"!=typeof t||t,e.fail="function"==typeof n&&n,e.domain=b?g.domain:void 0,this._c.push(e),this._a&&this._a.push(e),this._s&&j(this,!1),e.promise},"catch":function(t){return this.then(void 0,t)}}),E=function(){var t=new r;this.promise=t,this.resolve=c(R,t,1),this.reject=c(A,t,1)}),f(f.G+f.W+f.F*!O,{Promise:w}),e(28)(w,k),e(151)(k),o=e(2)[k],f(f.S+f.F*!O,k,{reject:function(t){var n=S(this),e=n.reject;return e(t),n.promise}}),f(f.S+f.F*(u||!O),k,{resolve:function(t){if(t instanceof w&&P(t.constructor,this))return t;var n=S(this),e=n.resolve;return e(t),n.promise}}),f(f.S+f.F*!(O&&e(85)(function(t){w.all(t)["catch"](x)})),k,{all:function(t){var n=this,e=S(n),r=e.resolve,i=e.reject,o=T(function(){var e=[],o=0,u=1;v(t,!1,function(t){var a=o++,c=!1;e.push(void 0),u++,n.resolve(t).then(function(t){c||(c=!0,e[a]=t,--u||r(e))},i)}),--u||r(e)});return o&&i(o.error),e.promise},race:function(t){var n=this,e=S(n),r=e.reject,i=T(function(){v(t,!1,function(t){n.resolve(t).then(e.resolve,r)})});return i&&r(i.error),e.promise}})},function(t,n,e){"use strict";var r=e(3),i=e(15),o=e(5),u=e(8),a=e(90),c=e(145).KEY,s=e(13),f=e(47),l=e(28),h=e(31),d=e(4),v=e(51),p=e(50),y=e(144),m=e(138),k=e(141),_=e(7),g=e(12),w=e(30),b=e(17),x=e(42),O=e(86),P=e(43),I=e(6),S=e(22),E=P.f,T=I.f,j=O.f,M=r.Symbol,F=r.JSON,C=F&&F.stringify,A="prototype",R=d("_hidden"),z=d("toPrimitive"),L={}.propertyIsEnumerable,W=f("symbol-registry"),N=f("symbols"),D=f("op-symbols"),U=Object[A],J="function"==typeof M,q=r.QObject,B=!q||!q[A]||!q[A].findChild,K=o&&s(function(){return 7!=x(T({},"a",{get:function(){return T(this,"a",{value:7}).a}})).a})?function(t,n,e){var r=E(U,n);r&&delete U[n],T(t,n,e),r&&t!==U&&T(U,n,r)}:T,G=function(t){var n=N[t]=x(M[A]);return n._k=t,n},Y=J&&"symbol"==typeof M.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof M},H=function(t,n,e){return t===U&&H(D,n,e),_(t),n=w(n,!0),_(e),i(N,n)?(e.enumerable?(i(t,R)&&t[R][n]&&(t[R][n]=!1),e=x(e,{enumerable:b(0,!1)})):(i(t,R)||T(t,R,b(1,{})),t[R][n]=!0),K(t,n,e)):T(t,n,e)},V=function(t,n){_(t);for(var e,r=m(n=g(n)),i=0,o=r.length;o>i;)H(t,e=r[i++],n[e]);return t},X=function(t,n){return void 0===n?x(t):V(x(t),n)},Q=function(t){var n=L.call(this,t=w(t,!0));return!(this===U&&i(N,t)&&!i(D,t))&&(!(n||!i(this,t)||!i(N,t)||i(this,R)&&this[R][t])||n)},Z=function(t,n){if(t=g(t),n=w(n,!0),t!==U||!i(N,n)||i(D,n)){var e=E(t,n);return!e||!i(N,n)||i(t,R)&&t[R][n]||(e.enumerable=!0),e}},$=function(t){for(var n,e=j(g(t)),r=[],o=0;e.length>o;)i(N,n=e[o++])||n==R||n==c||r.push(n);return r},tt=function(t){for(var n,e=t===U,r=j(e?D:g(t)),o=[],u=0;r.length>u;)!i(N,n=r[u++])||e&&!i(U,n)||o.push(N[n]);return o};J||(M=function(){if(this instanceof M)throw TypeError("Symbol is not a constructor!");var t=h(arguments.length>0?arguments[0]:void 0),n=function(e){this===U&&n.call(D,e),i(this,R)&&i(this[R],t)&&(this[R][t]=!1),K(this,t,b(1,e))};return o&&B&&K(U,t,{configurable:!0,set:n}),G(t)},a(M[A],"toString",function(){return this._k}),P.f=Z,I.f=H,e(87).f=O.f=$,e(27).f=Q,e(44).f=tt,o&&!e(26)&&a(U,"propertyIsEnumerable",Q,!0),v.f=function(t){return G(d(t))}),u(u.G+u.W+u.F*!J,{Symbol:M});for(var nt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;nt.length>et;)d(nt[et++]);for(var nt=S(d.store),et=0;nt.length>et;)p(nt[et++]);u(u.S+u.F*!J,"Symbol",{"for":function(t){return i(W,t+="")?W[t]:W[t]=M(t)},keyFor:function(t){if(Y(t))return y(W,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){B=!0},useSimple:function(){B=!1}}),u(u.S+u.F*!J,"Object",{create:X,defineProperty:H,defineProperties:V,getOwnPropertyDescriptor:Z,getOwnPropertyNames:$,getOwnPropertySymbols:tt}),F&&u(u.S+u.F*(!J||s(function(){var t=M();return"[null]"!=C([t])||"{}"!=C({a:t})||"{}"!=C(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!Y(t)){for(var n,e,r=[t],i=1;arguments.length>i;)r.push(arguments[i++]);return n=r[1],"function"==typeof n&&(e=n),!e&&k(n)||(n=function(t,n){if(e&&(n=e.call(this,t,n)),!Y(n))return n}),r[1]=n,C.apply(F,r)}}}),M[A][z]||e(10)(M[A],z,M[A].valueOf),l(M,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(t,n,e){e(50)("asyncIterator")},function(t,n,e){e(50)("observable")},function(t,n,e){t.exports=function(){return new Worker(e.p+"worker-slave.parallel.js")}},,function(t,n,e){var r=e(99)["default"];t.exports=r}]))});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGNhYTUxYWQxYTZkNDBhOWJmZTIiLCJ3ZWJwYWNrOi8vLy4vfi9wYXJhbGxlbC1lcy9kaXN0L2Jyb3dzZXItY29tbW9uanMucGFyYWxsZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2R5bmFtaWMva25pZ2h0cy10b3VyLnRzIiwid2VicGFjazovLy8uL3NyYy9keW5hbWljL21hbmRlbGJyb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2R5bmFtaWMvbW9udGUtY2FybG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RyYW5zcGlsZWQva25pZ2h0cy10b3VyLnRzIiwid2VicGFjazovLy8uL3NyYy90cmFuc3BpbGVkL21hbmRlbGJyb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RyYW5zcGlsZWQvbW9udGUtY2FybG8udHMiLCJ3ZWJwYWNrOi8vLy4vfi9zaW1qcy1yYW5kb20vc2ltanMtcmFuZG9tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUSxvQkFBb0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFZLDJCQUEyQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QjtBQUNBLHVDQUF1QztBQUN2QyxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBLHdCIiwiZmlsZSI6ImNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xuIFx0dmFyIHBhcmVudEpzb25wRnVuY3Rpb24gPSB3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSnNvbnBcIl0gPSBmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhjaHVua0lkcywgbW9yZU1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzKSB7XG4gXHRcdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuIFx0XHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcbiBcdFx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXSwgcmVzdWx0O1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pXG4gXHRcdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBleGVjdXRlTW9kdWxlcyk7XG4gXHRcdHdoaWxlKHJlc29sdmVzLmxlbmd0aClcbiBcdFx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG4gXHRcdGlmKGV4ZWN1dGVNb2R1bGVzKSB7XG4gXHRcdFx0Zm9yKGk9MDsgaSA8IGV4ZWN1dGVNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gXHRcdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGV4ZWN1dGVNb2R1bGVzW2ldKTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0cmV0dXJuIHJlc3VsdDtcbiBcdH07XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIG9iamVjdHMgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0MjogMFxuIFx0fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuIFx0Ly8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuIFx0Ly8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSBmdW5jdGlvbiByZXF1aXJlRW5zdXJlKGNodW5rSWQpIHtcbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKVxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuIFx0XHQvLyBhbiBQcm9taXNlIG1lYW5zIFwiY3VycmVudGx5IGxvYWRpbmdcIi5cbiBcdFx0aWYoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZENodW5rc1tjaHVua0lkXVsyXTtcbiBcdFx0fVxuIFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuIFx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuIFx0XHRzY3JpcHQuY2hhcnNldCA9ICd1dGYtOCc7XG4gXHRcdHNjcmlwdC5hc3luYyA9IHRydWU7XG4gXHRcdHNjcmlwdC50aW1lb3V0ID0gMTIwMDAwO1xuXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLmpzXCI7XG4gXHRcdHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChvblNjcmlwdENvbXBsZXRlLCAxMjAwMDApO1xuIFx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBvblNjcmlwdENvbXBsZXRlO1xuIFx0XHRmdW5jdGlvbiBvblNjcmlwdENvbXBsZXRlKCkge1xuIFx0XHRcdC8vIGF2b2lkIG1lbSBsZWFrcyBpbiBJRS5cbiBcdFx0XHRzY3JpcHQub25lcnJvciA9IHNjcmlwdC5vbmxvYWQgPSBudWxsO1xuIFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiBcdFx0XHR2YXIgY2h1bmsgPSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHRcdFx0aWYoY2h1bmsgIT09IDApIHtcbiBcdFx0XHRcdGlmKGNodW5rKSBjaHVua1sxXShuZXcgRXJyb3IoJ0xvYWRpbmcgY2h1bmsgJyArIGNodW5rSWQgKyAnIGZhaWxlZC4nKSk7XG4gXHRcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSB1bmRlZmluZWQ7XG4gXHRcdFx0fVxuIFx0XHR9O1xuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbiBcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSBbcmVzb2x2ZSwgcmVqZWN0XTtcbiBcdFx0fSk7XG4gXHRcdHJldHVybiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMl0gPSBwcm9taXNlO1xuIFx0fTtcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb3J5IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vcnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gb24gZXJyb3IgZnVuY3Rpb24gZm9yIGFzeW5jIGxvYWRpbmdcbiBcdF9fd2VicGFja19yZXF1aXJlX18ub2UgPSBmdW5jdGlvbihlcnIpIHsgY29uc29sZS5lcnJvcihlcnIpOyB0aHJvdyBlcnI7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMGNhYTUxYWQxYTZkNDBhOWJmZTIiLCIhZnVuY3Rpb24odCxuKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1uKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxuKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzW1wicGFyYWxsZWwtZXNcIl09bigpOnRbXCJwYXJhbGxlbC1lc1wiXT1uKCl9KHRoaXMsZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7ZnVuY3Rpb24gbihyKXtpZihlW3JdKXJldHVybiBlW3JdLmV4cG9ydHM7dmFyIGk9ZVtyXT17aTpyLGw6ITEsZXhwb3J0czp7fX07cmV0dXJuIHRbcl0uY2FsbChpLmV4cG9ydHMsaSxpLmV4cG9ydHMsbiksaS5sPSEwLGkuZXhwb3J0c312YXIgZT17fTtyZXR1cm4gbi5tPXQsbi5jPWUsbi5pPWZ1bmN0aW9uKHQpe3JldHVybiB0fSxuLmQ9ZnVuY3Rpb24odCxuLGUpe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LG4se2NvbmZpZ3VyYWJsZTohMSxlbnVtZXJhYmxlOiEwLGdldDplfSl9LG4ubj1mdW5jdGlvbih0KXt2YXIgZT10JiZ0Ll9fZXNNb2R1bGU/ZnVuY3Rpb24oKXtyZXR1cm4gdFtcImRlZmF1bHRcIl19OmZ1bmN0aW9uKCl7cmV0dXJuIHR9O3JldHVybiBuLmQoZSxcImFcIixlKSxlfSxuLm89ZnVuY3Rpb24odCxuKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbil9LG4ucD1cIlwiLG4obi5zPTE3MCl9KGZ1bmN0aW9uKHQpe2Zvcih2YXIgbiBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG4pKXN3aXRjaCh0eXBlb2YgdFtuXSl7Y2FzZVwiZnVuY3Rpb25cIjpicmVhaztjYXNlXCJvYmplY3RcIjp0W25dPWZ1bmN0aW9uKG4pe3ZhciBlPW4uc2xpY2UoMSkscj10W25bMF1dO3JldHVybiBmdW5jdGlvbih0LG4saSl7ci5hcHBseSh0aGlzLFt0LG4saV0uY29uY2F0KGUpKX19KHRbbl0pO2JyZWFrO2RlZmF1bHQ6dFtuXT10W3Rbbl1dfXJldHVybiB0fShbZnVuY3Rpb24odCxuKXtcInVzZSBzdHJpY3RcIjtuLl9fZXNNb2R1bGU9ITAsbltcImRlZmF1bHRcIl09ZnVuY3Rpb24odCxuKXtpZighKHQgaW5zdGFuY2VvZiBuKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1uLl9fZXNNb2R1bGU9ITA7dmFyIGk9ZSg3Miksbz1yKGkpO25bXCJkZWZhdWx0XCJdPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0LG4pe2Zvcih2YXIgZT0wO2U8bi5sZW5ndGg7ZSsrKXt2YXIgcj1uW2VdO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSwoMCxvW1wiZGVmYXVsdFwiXSkodCxyLmtleSxyKX19cmV0dXJuIGZ1bmN0aW9uKG4sZSxyKXtyZXR1cm4gZSYmdChuLnByb3RvdHlwZSxlKSxyJiZ0KG4sciksbn19KCl9LGZ1bmN0aW9uKHQsbil7dmFyIGU9dC5leHBvcnRzPXt2ZXJzaW9uOlwiMi40LjBcIn07XCJudW1iZXJcIj09dHlwZW9mIF9fZSYmKF9fZT1lKX0sZnVuY3Rpb24odCxuKXt2YXIgZT10LmV4cG9ydHM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93Lk1hdGg9PU1hdGg/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiZzZWxmLk1hdGg9PU1hdGg/c2VsZjpGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XCJudW1iZXJcIj09dHlwZW9mIF9fZyYmKF9fZz1lKX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNDcpKFwid2tzXCIpLGk9ZSgzMSksbz1lKDMpLlN5bWJvbCx1PVwiZnVuY3Rpb25cIj09dHlwZW9mIG8sYT10LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIHJbdF18fChyW3RdPXUmJm9bdF18fCh1P286aSkoXCJTeW1ib2wuXCIrdCkpfTthLnN0b3JlPXJ9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9IWUoMTMpKGZ1bmN0aW9uKCl7cmV0dXJuIDchPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSxcImFcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIDd9fSkuYX0pfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg3KSxpPWUoNDEpLG89ZSgzMCksdT1PYmplY3QuZGVmaW5lUHJvcGVydHk7bi5mPWUoNSk/T2JqZWN0LmRlZmluZVByb3BlcnR5OmZ1bmN0aW9uKHQsbixlKXtpZihyKHQpLG49byhuLCEwKSxyKGUpLGkpdHJ5e3JldHVybiB1KHQsbixlKX1jYXRjaChhKXt9aWYoXCJnZXRcImluIGV8fFwic2V0XCJpbiBlKXRocm93IFR5cGVFcnJvcihcIkFjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIVwiKTtyZXR1cm5cInZhbHVlXCJpbiBlJiYodFtuXT1lLnZhbHVlKSx0fX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTEpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtpZighcih0KSl0aHJvdyBUeXBlRXJyb3IodCtcIiBpcyBub3QgYW4gb2JqZWN0IVwiKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDMpLGk9ZSgyKSxvPWUoMTQpLHU9ZSgxMCksYT1cInByb3RvdHlwZVwiLGM9ZnVuY3Rpb24odCxuLGUpe3ZhciBzLGYsbCxoPXQmYy5GLGQ9dCZjLkcsdj10JmMuUyxwPXQmYy5QLHk9dCZjLkIsbT10JmMuVyxrPWQ/aTppW25dfHwoaVtuXT17fSksXz1rW2FdLGc9ZD9yOnY/cltuXToocltuXXx8e30pW2FdO2QmJihlPW4pO2ZvcihzIGluIGUpZj0haCYmZyYmdm9pZCAwIT09Z1tzXSxmJiZzIGluIGt8fChsPWY/Z1tzXTplW3NdLGtbc109ZCYmXCJmdW5jdGlvblwiIT10eXBlb2YgZ1tzXT9lW3NdOnkmJmY/byhsLHIpOm0mJmdbc109PWw/ZnVuY3Rpb24odCl7dmFyIG49ZnVuY3Rpb24obixlLHIpe2lmKHRoaXMgaW5zdGFuY2VvZiB0KXtzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7Y2FzZSAwOnJldHVybiBuZXcgdDtjYXNlIDE6cmV0dXJuIG5ldyB0KG4pO2Nhc2UgMjpyZXR1cm4gbmV3IHQobixlKX1yZXR1cm4gbmV3IHQobixlLHIpfXJldHVybiB0LmFwcGx5KHRoaXMsYXJndW1lbnRzKX07cmV0dXJuIG5bYV09dFthXSxufShsKTpwJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBsP28oRnVuY3Rpb24uY2FsbCxsKTpsLHAmJigoay52aXJ0dWFsfHwoay52aXJ0dWFsPXt9KSlbc109bCx0JmMuUiYmXyYmIV9bc10mJnUoXyxzLGwpKSl9O2MuRj0xLGMuRz0yLGMuUz00LGMuUD04LGMuQj0xNixjLlc9MzIsYy5VPTY0LGMuUj0xMjgsdC5leHBvcnRzPWN9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBhfSk7dmFyIGE9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSl7aSgpKHRoaXMsdCksdGhpcy5mdW5jPW4sdGhpcy5wYXJhbXM9ZX1yZXR1cm4gdSgpKHQsbnVsbCxbe2tleTpcImNyZWF0ZVwiLHZhbHVlOmZ1bmN0aW9uKG4pe2Zvcih2YXIgZT1hcmd1bWVudHMubGVuZ3RoLHI9QXJyYXkoZT4xP2UtMTowKSxpPTE7aTxlO2krKylyW2ktMV09YXJndW1lbnRzW2ldO3JldHVybiBuZXcgdChuLHIpfX0se2tleTpcImNyZWF0ZVVuY2hlY2tlZFwiLHZhbHVlOmZ1bmN0aW9uKG4pe2Zvcih2YXIgZT1hcmd1bWVudHMubGVuZ3RoLHI9QXJyYXkoZT4xP2UtMTowKSxpPTE7aTxlO2krKylyW2ktMV09YXJndW1lbnRzW2ldO3JldHVybiBuZXcgdChuLHIpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg2KSxpPWUoMTcpO3QuZXhwb3J0cz1lKDUpP2Z1bmN0aW9uKHQsbixlKXtyZXR1cm4gci5mKHQsbixpKDEsZSkpfTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuIHRbbl09ZSx0fX0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIHQ/bnVsbCE9PXQ6XCJmdW5jdGlvblwiPT10eXBlb2YgdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDgxKSxpPWUoMzkpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gcihpKHQpKX19LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4hIXQoKX1jYXRjaChuKXtyZXR1cm4hMH19fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyNCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlKXtpZihyKHQpLHZvaWQgMD09PW4pcmV0dXJuIHQ7c3dpdGNoKGUpe2Nhc2UgMTpyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIHQuY2FsbChuLGUpfTtjYXNlIDI6cmV0dXJuIGZ1bmN0aW9uKGUscil7cmV0dXJuIHQuY2FsbChuLGUscil9O2Nhc2UgMzpyZXR1cm4gZnVuY3Rpb24oZSxyLGkpe3JldHVybiB0LmNhbGwobixlLHIsaSl9fXJldHVybiBmdW5jdGlvbigpe3JldHVybiB0LmFwcGx5KG4sYXJndW1lbnRzKX19fSxmdW5jdGlvbih0LG4pe3ZhciBlPXt9Lmhhc093blByb3BlcnR5O3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe3JldHVybiBlLmNhbGwodCxuKX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsbil7cmV0dXJue19fX19fX19pc0Z1bmN0aW9uSWQ6ITAsaWRlbnRpZmllcjp0K1wiLVwiK259fWZ1bmN0aW9uIGkodCl7cmV0dXJuISF0JiZ0Ll9fX19fX19pc0Z1bmN0aW9uSWQ9PT0hMH1uLmE9cixuLmI9aX0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXtyZXR1cm57ZW51bWVyYWJsZTohKDEmdCksY29uZmlndXJhYmxlOiEoMiZ0KSx3cml0YWJsZTohKDQmdCksdmFsdWU6bn19fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgxNik7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gaX0pO3ZhciBpPXtGSUxURVI6ZS5pKHIuYSkoXCJwYXJhbGxlbFwiLDApLElERU5USVRZOmUuaShyLmEpKFwicGFyYWxsZWxcIiwxKSxNQVA6ZS5pKHIuYSkoXCJwYXJhbGxlbFwiLDIpLFBBUkFMTEVMX0pPQl9FWEVDVVRPUjplLmkoci5hKShcInBhcmFsbGVsXCIsMyksUkFOR0U6ZS5pKHIuYSkoXCJwYXJhbGxlbFwiLDQpLFJFRFVDRTplLmkoci5hKShcInBhcmFsbGVsXCIsNSksVElNRVM6ZS5pKHIuYSkoXCJwYXJhbGxlbFwiLDYpLFRPX0lURVJBVE9SOmUuaShyLmEpKFwicGFyYWxsZWxcIiw3KX19LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTIzKSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuKXt2YXIgZT17fS50b1N0cmluZzt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIGUuY2FsbCh0KS5zbGljZSg4LC0xKX19LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPXt9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg4OSksaT1lKDQwKTt0LmV4cG9ydHM9T2JqZWN0LmtleXN8fGZ1bmN0aW9uKHQpe3JldHVybiByKHQsaSl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgxOSksaT1lLm4ociksbz1lKDM4KSx1PWUubihvKSxhPWUoMCksYz1lLm4oYSkscz1lKDEpLGY9ZS5uKHMpLGw9ZSgxMTEpLGg9ZSgxMTApO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGR9KTt2YXIgZD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobil7dmFyIGU9dGhpcztjKCkodGhpcyx0KSx0aGlzLm5leHRIYW5kbGVycz1bXTt2YXIgcj1mdW5jdGlvbih0LG4scil7cmV0dXJuIGUuX25leHQodCxuLHIpfSxpPWZ1bmN0aW9uKHQpe3JldHVybiBlLnJlamVjdCh0KX0sbz1mdW5jdGlvbih0KXtyZXR1cm4gZS5yZXNvbHZlKHQpfTtuKHIsbyxpKSx0aGlzLnByb21pc2U9bmV3IHUuYShmdW5jdGlvbih0LG4pe2UucmVzb2x2ZT10LGUucmVqZWN0PW59KX1yZXR1cm4gZigpKHQsW3trZXk6XCJzdWJzY3JpYmVcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuIHRoaXMubmV4dEhhbmRsZXJzLnB1c2godCksKG58fGUpJiZ0aGlzLnByb21pc2UudGhlbihlLG4pLHRoaXN9fSx7a2V5OlwidGhlblwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7cmV0dXJuIHRoaXMucHJvbWlzZS50aGVuKHQsbil9fSx7a2V5OlwiY2F0Y2hcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wcm9taXNlW1wiY2F0Y2hcIl0odCl9fSx7a2V5OlwiX25leHRcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7dmFyIHI9ITAsbz0hMSx1PXZvaWQgMDt0cnl7Zm9yKHZhciBhLGM9aSgpKHRoaXMubmV4dEhhbmRsZXJzKTshKHI9KGE9Yy5uZXh0KCkpLmRvbmUpO3I9ITApe3ZhciBzPWEudmFsdWU7cy5hcHBseSh2b2lkIDAsYXJndW1lbnRzKX19Y2F0Y2goZil7bz0hMCx1PWZ9ZmluYWxseXt0cnl7IXImJmNbXCJyZXR1cm5cIl0mJmNbXCJyZXR1cm5cIl0oKX1maW5hbGx5e2lmKG8pdGhyb3cgdX19fX1dLFt7a2V5OlwidHJhbnNmb3JtXCIsdmFsdWU6ZnVuY3Rpb24obixlKXt2YXIgcj12b2lkIDAsaT12b2lkIDAsbz12b2lkIDAsdT1uZXcgdChmdW5jdGlvbih0LG4sZSl7cj10LGk9bixvPWV9KTtyZXR1cm4gbi5zdWJzY3JpYmUocixvLGZ1bmN0aW9uKHQpe3JldHVybiBpKGUodCkpfSksdX19LHtrZXk6XCJmcm9tVGFza3NcIix2YWx1ZTpmdW5jdGlvbih0LG4pe3JldHVybiAwPT09dC5sZW5ndGg/bmV3IGguYShuLmFwcGx5KHZvaWQgMCxbW11dKSk6bmV3IGwuYSh0LG4pfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXRocm93IFR5cGVFcnJvcih0K1wiIGlzIG5vdCBhIGZ1bmN0aW9uIVwiKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDExKSxpPWUoMykuZG9jdW1lbnQsbz1yKGkpJiZyKGkuY3JlYXRlRWxlbWVudCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBvP2kuY3JlYXRlRWxlbWVudCh0KTp7fX19LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPSEwfSxmdW5jdGlvbih0LG4pe24uZj17fS5wcm9wZXJ0eUlzRW51bWVyYWJsZX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNikuZixpPWUoMTUpLG89ZSg0KShcInRvU3RyaW5nVGFnXCIpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4sZSl7dCYmIWkodD1lP3Q6dC5wcm90b3R5cGUsbykmJnIodCxvLHtjb25maWd1cmFibGU6ITAsdmFsdWU6bn0pfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMzkpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gT2JqZWN0KHIodCkpfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTEpO3QuZXhwb3J0cz1mdW5jdGlvbih0LG4pe2lmKCFyKHQpKXJldHVybiB0O3ZhciBlLGk7aWYobiYmXCJmdW5jdGlvblwiPT10eXBlb2YoZT10LnRvU3RyaW5nKSYmIXIoaT1lLmNhbGwodCkpKXJldHVybiBpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mKGU9dC52YWx1ZU9mKSYmIXIoaT1lLmNhbGwodCkpKXJldHVybiBpO2lmKCFuJiZcImZ1bmN0aW9uXCI9PXR5cGVvZihlPXQudG9TdHJpbmcpJiYhcihpPWUuY2FsbCh0KSkpcmV0dXJuIGk7dGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpfX0sZnVuY3Rpb24odCxuKXt2YXIgZT0wLHI9TWF0aC5yYW5kb20oKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuXCJTeW1ib2woXCIuY29uY2F0KHZvaWQgMD09PXQ/XCJcIjp0LFwiKV9cIiwoKytlK3IpLnRvU3RyaW5nKDM2KSl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgxNTMpKCEwKTtlKDg0KShTdHJpbmcsXCJTdHJpbmdcIixmdW5jdGlvbih0KXt0aGlzLl90PVN0cmluZyh0KSx0aGlzLl9pPTB9LGZ1bmN0aW9uKCl7dmFyIHQsbj10aGlzLl90LGU9dGhpcy5faTtyZXR1cm4gZT49bi5sZW5ndGg/e3ZhbHVlOnZvaWQgMCxkb25lOiEwfToodD1yKG4sZSksdGhpcy5faSs9dC5sZW5ndGgse3ZhbHVlOnQsZG9uZTohMX0pfSl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDYzKSxpPShlLm4ociksZSg1NikpLG89KGUubihpKSxlKDU5KSksdT0oZS5uKG8pLGUoNjApKSxhPShlLm4odSksZSg2MikpLGM9KGUubihhKSxlKDY0KSkscz0oZS5uKGMpLGUoNjEpKSxmPShlLm4ocyksZSg2NSkpO2UubihmKTtlLm8ocixcIklQYXJhbGxlbFwiKSYmZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gci5JUGFyYWxsZWx9KSxlLm8oaSxcIklQYXJhbGxlbENoYWluXCIpJiZlLmQobixcImJcIixmdW5jdGlvbigpe3JldHVybiBpLklQYXJhbGxlbENoYWlufSksZS5vKG8sXCJJUGFyYWxsZWxUYXNrRW52aXJvbm1lbnRcIikmJmUuZChuLFwiY1wiLGZ1bmN0aW9uKCl7cmV0dXJuIG8uSVBhcmFsbGVsVGFza0Vudmlyb25tZW50fSksZS5vKG8sXCJJUGFyYWxsZWxFbnZpcm9ubWVudFwiKSYmZS5kKG4sXCJkXCIsZnVuY3Rpb24oKXtyZXR1cm4gby5JUGFyYWxsZWxFbnZpcm9ubWVudH0pLGUubyh1LFwiSVBhcmFsbGVsSm9iXCIpJiZlLmQobixcImVcIixmdW5jdGlvbigpe3JldHVybiB1LklQYXJhbGxlbEpvYn0pLGUubyhhLFwiSVBhcmFsbGVsT3B0aW9uc1wiKSYmZS5kKG4sXCJmXCIsZnVuY3Rpb24oKXtyZXR1cm4gYS5JUGFyYWxsZWxPcHRpb25zfSksZS5vKGEsXCJJRGVmYXVsdEluaXRpYWxpemVkUGFyYWxsZWxPcHRpb25zXCIpJiZlLmQobixcImdcIixmdW5jdGlvbigpe3JldHVybiBhLklEZWZhdWx0SW5pdGlhbGl6ZWRQYXJhbGxlbE9wdGlvbnN9KSxlLm8oYyxcIklQYXJhbGxlbEpvYlNjaGVkdWxlclwiKSYmZS5kKG4sXCJoXCIsZnVuY3Rpb24oKXtyZXR1cm4gYy5JUGFyYWxsZWxKb2JTY2hlZHVsZXJ9KSxlLm8ocyxcIklQYXJhbGxlbE9wZXJhdGlvblwiKSYmZS5kKG4sXCJpXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5JUGFyYWxsZWxPcGVyYXRpb259KSxlLm8ocyxcIklTZXJpYWxpemVkUGFyYWxsZWxPcGVyYXRpb25cIikmJmUuZChuLFwialwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuSVNlcmlhbGl6ZWRQYXJhbGxlbE9wZXJhdGlvbn0pLGUubyhmLFwiSVBhcmFsbGVsU3RyZWFtXCIpJiZlLmQobixcImtcIixmdW5jdGlvbigpe3JldHVybiBmLklQYXJhbGxlbFN0cmVhbX0pfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gYX0pO3ZhciBhPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXtpKCkodGhpcyx0KSx0aGlzLmZ1bmN0aW9uUmVnaXN0cnk9bn1yZXR1cm4gdSgpKHQsW3trZXk6XCJzZXJpYWxpemVGdW5jdGlvbkNhbGxcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmZ1bmN0aW9uUmVnaXN0cnkuZ2V0T3JTZXRJZCh0LmZ1bmMpO3JldHVybntfX19fX19zZXJpYWxpemVkRnVuY3Rpb25DYWxsOiEwLGZ1bmN0aW9uSWQ6bixwYXJhbWV0ZXJzOnQucGFyYW1zfX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuISF0JiZ0Ll9fX19fX3NlcmlhbGl6ZWRGdW5jdGlvbkNhbGw9PT0hMH1uLmE9cn0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7aWYoMD09PXQubGVuZ3RoKXJldHVybltdO3ZhciBuPW8oKSh0KSxlPW5bMF0scj1uLnNsaWNlKDEpO3JldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KGUscil9dmFyIGk9ZSg3NSksbz1lLm4oaSksdT1lKDE5KTtlLm4odSk7bi5hPXJ9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTI5KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMzEpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbih0KXtpZih2b2lkIDA9PXQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiK3QpO3JldHVybiB0fX0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9XCJjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2ZcIi5zcGxpdChcIixcIil9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9IWUoNSkmJiFlKDEzKShmdW5jdGlvbigpe3JldHVybiA3IT1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSgyNSkoXCJkaXZcIiksXCJhXCIse2dldDpmdW5jdGlvbigpe3JldHVybiA3fX0pLmF9KX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNyksaT1lKDE0OCksbz1lKDQwKSx1PWUoNDYpKFwiSUVfUFJPVE9cIiksYT1mdW5jdGlvbigpe30sYz1cInByb3RvdHlwZVwiLHM9ZnVuY3Rpb24oKXt2YXIgdCxuPWUoMjUpKFwiaWZyYW1lXCIpLHI9by5sZW5ndGgsaT1cIjxcIix1PVwiPlwiO2ZvcihuLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZSg4MCkuYXBwZW5kQ2hpbGQobiksbi5zcmM9XCJqYXZhc2NyaXB0OlwiLHQ9bi5jb250ZW50V2luZG93LmRvY3VtZW50LHQub3BlbigpLHQud3JpdGUoaStcInNjcmlwdFwiK3UrXCJkb2N1bWVudC5GPU9iamVjdFwiK2krXCIvc2NyaXB0XCIrdSksdC5jbG9zZSgpLHM9dC5GO3ItLTspZGVsZXRlIHNbY11bb1tyXV07cmV0dXJuIHMoKX07dC5leHBvcnRzPU9iamVjdC5jcmVhdGV8fGZ1bmN0aW9uKHQsbil7dmFyIGU7cmV0dXJuIG51bGwhPT10PyhhW2NdPXIodCksZT1uZXcgYSxhW2NdPW51bGwsZVt1XT10KTplPXMoKSx2b2lkIDA9PT1uP2U6aShlLG4pfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMjcpLGk9ZSgxNyksbz1lKDEyKSx1PWUoMzApLGE9ZSgxNSksYz1lKDQxKSxzPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7bi5mPWUoNSk/czpmdW5jdGlvbih0LG4pe2lmKHQ9byh0KSxuPXUobiwhMCksYyl0cnl7cmV0dXJuIHModCxuKX1jYXRjaChlKXt9aWYoYSh0LG4pKXJldHVybiBpKCFyLmYuY2FsbCh0LG4pLHRbbl0pfX0sZnVuY3Rpb24odCxuKXtuLmY9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sc30sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoOCksaT1lKDIpLG89ZSgxMyk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbil7dmFyIGU9KGkuT2JqZWN0fHx7fSlbdF18fE9iamVjdFt0XSx1PXt9O3VbdF09bihlKSxyKHIuUytyLkYqbyhmdW5jdGlvbigpe2UoMSl9KSxcIk9iamVjdFwiLHUpfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNDcpKFwia2V5c1wiKSxpPWUoMzEpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gclt0XXx8KHJbdF09aSh0KSl9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgzKSxpPVwiX19jb3JlLWpzX3NoYXJlZF9fXCIsbz1yW2ldfHwocltpXT17fSk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBvW3RdfHwob1t0XT17fSl9fSxmdW5jdGlvbih0LG4pe3ZhciBlPU1hdGguY2VpbCxyPU1hdGguZmxvb3I7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBpc05hTih0PSt0KT8wOih0PjA/cjplKSh0KX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDQ4KSxpPU1hdGgubWluO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gdD4wP2kocih0KSw5MDA3MTk5MjU0NzQwOTkxKTowfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMyksaT1lKDIpLG89ZSgyNiksdT1lKDUxKSxhPWUoNikuZjt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIG49aS5TeW1ib2x8fChpLlN5bWJvbD1vP3t9OnIuU3ltYm9sfHx7fSk7XCJfXCI9PXQuY2hhckF0KDApfHx0IGluIG58fGEobix0LHt2YWx1ZTp1LmYodCl9KX19LGZ1bmN0aW9uKHQsbixlKXtuLmY9ZSg0KX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNzkpLGk9ZSg0KShcIml0ZXJhdG9yXCIpLG89ZSgyMSk7dC5leHBvcnRzPWUoMikuZ2V0SXRlcmF0b3JNZXRob2Q9ZnVuY3Rpb24odCl7aWYodm9pZCAwIT10KXJldHVybiB0W2ldfHx0W1wiQEBpdGVyYXRvclwiXXx8b1tyKHQpXX19LGZ1bmN0aW9uKHQsbixlKXtlKDE1Nyk7Zm9yKHZhciByPWUoMyksaT1lKDEwKSxvPWUoMjEpLHU9ZSg0KShcInRvU3RyaW5nVGFnXCIpLGE9W1wiTm9kZUxpc3RcIixcIkRPTVRva2VuTGlzdFwiLFwiTWVkaWFMaXN0XCIsXCJTdHlsZVNoZWV0TGlzdFwiLFwiQ1NTUnVsZUxpc3RcIl0sYz0wO2M8NTtjKyspe3ZhciBzPWFbY10sZj1yW3NdLGw9ZiYmZi5wcm90b3R5cGU7bCYmIWxbdV0mJmkobCx1LHMpLG9bc109by5BcnJheX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDMzKSxpPWUoNjYpLG89KGUubihpKSxlKDY3KSksdT0oZS5uKG8pLGUoNTUpKSxhPShlLm4odSksZSgxNikpLGM9ZSg5KSxzPWUoMzUpLGY9ZSgzNCksbD1lKDY4KSxoPShlLm4obCksZSgzMykpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHIuYX0pLGUubyhpLFwiSVRhc2tEZWZpbml0aW9uXCIpJiZlLmQobixcImJcIixmdW5jdGlvbigpe3JldHVybiBpLklUYXNrRGVmaW5pdGlvbn0pLGUubyhvLFwiSVRhc2tcIikmJmUuZChuLFwiY1wiLGZ1bmN0aW9uKCl7cmV0dXJuIG8uSVRhc2t9KSxlLm8odSxcIklGdW5jdGlvbkRlZmluaXRpb25cIikmJmUuZChuLFwiZFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHUuSUZ1bmN0aW9uRGVmaW5pdGlvbn0pLGUuZChuLFwiZVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGEuSUZ1bmN0aW9uSWR9KSxlLmQobixcImZcIixmdW5jdGlvbigpe3JldHVybiBhLmJ9KSxlLmQobixcImdcIixmdW5jdGlvbigpe3JldHVybiBjLmF9KSxlLmQobixcImhcIixmdW5jdGlvbigpe3JldHVybiBzLklTZXJpYWxpemVkRnVuY3Rpb25DYWxsfSksZS5kKG4sXCJpXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5hfSksZS5kKG4sXCJqXCIsZnVuY3Rpb24oKXtyZXR1cm4gZi5hfSksZS5vKGwsXCJJVGhyZWFkUG9vbFwiKSYmZS5kKG4sXCJrXCIsZnVuY3Rpb24oKXtyZXR1cm4gbC5JVGhyZWFkUG9vbH0pLGUuZChuLFwibFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguYn0pLGUuZChuLFwibVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguY30pLGUuZChuLFwiblwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZH0pLGUuZChuLFwib1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZX0pLGUuZChuLFwicFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZn0pLGUuZChuLFwicVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguZ30pLGUuZChuLFwiclwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguaH0pLGUuZChuLFwic1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGguaX0pLGUuZChuLFwidFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGguan0pLGUuZChuLFwidVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGgua30pfSxmdW5jdGlvbih0LG4pe30sZnVuY3Rpb24odCxuKXt9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoMTAyKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBjfSk7dmFyIGM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSxyKXtpKCkodGhpcyx0KSx0aGlzLm9wdGlvbnM9ZSx0aGlzLmVudmlyb25tZW50PXIsdGhpcy5zdHJlYW09bn1yZXR1cm4gdSgpKHQsW3trZXk6XCJyZXNvbHZlXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc319LHtrZXk6XCJjaGFpbk9wZXJhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBuZXcgYS5hKHRoaXMuc3RyZWFtLHRoaXMub3B0aW9ucyx0aGlzLmVudmlyb25tZW50LFt0XSl9fSx7a2V5OlwiYWRkRW52aXJvbm1lbnRcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gbmV3IGEuYSh0aGlzLnN0cmVhbSx0aGlzLm9wdGlvbnMsdGhpcy5lbnZpcm9ubWVudC5hZGQodCkpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyksYT1lKDE4KSxjPWUoOSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gc30pO3ZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXtpKCkodGhpcyx0KSx0aGlzLmNvbGxlY3Rpb249bn1yZXR1cm4gdSgpKHQsW3trZXk6XCJzZXJpYWxpemVTbGljZVwiLHZhbHVlOmZ1bmN0aW9uKHQsbixlKXt2YXIgcj1uKnQsaT1yK247cmV0dXJuIGUuc2VyaWFsaXplRnVuY3Rpb25DYWxsKGMuYS5jcmVhdGVVbmNoZWNrZWQoYS5hLlRPX0lURVJBVE9SLHRoaXMuY29sbGVjdGlvbi5zbGljZShyLGkpKSl9fSx7a2V5OlwibGVuZ3RoXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29sbGVjdGlvbi5sZW5ndGh9fV0pLHR9KCl9LDU2LDU2LGZ1bmN0aW9uKHQsbil7fSw1Niw1Niw1Niw1Niw1NSw1NSw1NixmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm57dHlwZTpkLkluaXRpYWxpemVXb3JrZXIsd29ya2VySWQ6dH19ZnVuY3Rpb24gaSh0KXtyZXR1cm57dGFzazp0LHR5cGU6ZC5TY2hlZHVsZVRhc2t9fWZ1bmN0aW9uIG8odCl7cmV0dXJue2Z1bmN0aW9uczp0LHR5cGU6ZC5GdW5jdGlvblJlc3BvbnNlfX1mdW5jdGlvbiB1KCl7cmV0dXJue3R5cGU6ZC5TdG9wfX1mdW5jdGlvbiBhKHQpe3JldHVybiB0LnR5cGU9PT1kLkZ1bmN0aW9uUmVxdWVzdH1mdW5jdGlvbiBjKHQpe3JldHVybiB0LnR5cGU9PT1kLldvcmtlclJlc3VsdH1mdW5jdGlvbiBzKHQpe3JldHVybiB0LnR5cGU9PT1kLkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3J9dmFyIGY9ZSgxMTQpLGw9KGUubihmKSxlKDExNykpLGg9KGUubihsKSxlKDE5KSk7ZS5uKGgpO24uZT1yLG4uZj1pLG4uYj1vLG4uZz11LG4uYT1hLG4uYz1jLG4uZD1zO3ZhciBkOyFmdW5jdGlvbih0KXt0W3QuSW5pdGlhbGl6ZVdvcmtlcj0wXT1cIkluaXRpYWxpemVXb3JrZXJcIix0W3QuU2NoZWR1bGVUYXNrPTFdPVwiU2NoZWR1bGVUYXNrXCIsdFt0LkZ1bmN0aW9uUmVxdWVzdD0yXT1cIkZ1bmN0aW9uUmVxdWVzdFwiLHRbdC5GdW5jdGlvblJlc3BvbnNlPTNdPVwiRnVuY3Rpb25SZXNwb25zZVwiLHRbdC5Xb3JrZXJSZXN1bHQ9NF09XCJXb3JrZXJSZXN1bHRcIix0W3QuRnVuY3Rpb25FeGVjdXRpb25FcnJvcj01XT1cIkZ1bmN0aW9uRXhlY3V0aW9uRXJyb3JcIix0W3QuU3RvcD02XT1cIlN0b3BcIn0oZHx8KGQ9e30pKX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMjIpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7dC5leHBvcnRzPXtcImRlZmF1bHRcIjplKDEyNSksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoNzgpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fW4uX19lc01vZHVsZT0hMDt2YXIgaT1lKDExOCksbz1yKGkpLHU9ZSgxMTUpLGE9cih1KSxjPWUoNzcpLHM9cihjKTtuW1wiZGVmYXVsdFwiXT1mdW5jdGlvbih0LG4pe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4mJm51bGwhPT1uKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiKyhcInVuZGVmaW5lZFwiPT10eXBlb2Ygbj9cInVuZGVmaW5lZFwiOigwLHNbXCJkZWZhdWx0XCJdKShuKSkpO3QucHJvdG90eXBlPSgwLGFbXCJkZWZhdWx0XCJdKShuJiZuLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksbiYmKG9bXCJkZWZhdWx0XCJdPygwLG9bXCJkZWZhdWx0XCJdKSh0LG4pOnQuX19wcm90b19fPW4pfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1uLl9fZXNNb2R1bGU9ITA7dmFyIGk9ZSg3Nyksbz1yKGkpO25bXCJkZWZhdWx0XCJdPWZ1bmN0aW9uKHQsbil7aWYoIXQpdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO3JldHVybiFufHxcIm9iamVjdFwiIT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBuP1widW5kZWZpbmVkXCI6KDAsb1tcImRlZmF1bHRcIl0pKG4pKSYmXCJmdW5jdGlvblwiIT10eXBlb2Ygbj90Om59fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fW4uX19lc01vZHVsZT0hMDt2YXIgaT1lKDcwKSxvPXIoaSk7bltcImRlZmF1bHRcIl09ZnVuY3Rpb24odCl7cmV0dXJuIEFycmF5LmlzQXJyYXkodCk/dDooMCxvW1wiZGVmYXVsdFwiXSkodCl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e1wiZGVmYXVsdFwiOnR9fW4uX19lc01vZHVsZT0hMDt2YXIgaT1lKDcwKSxvPXIoaSk7bltcImRlZmF1bHRcIl09ZnVuY3Rpb24odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBuPTAsZT1BcnJheSh0Lmxlbmd0aCk7bjx0Lmxlbmd0aDtuKyspZVtuXT10W25dO3JldHVybiBlfXJldHVybigwLG9bXCJkZWZhdWx0XCJdKSh0KX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7XCJkZWZhdWx0XCI6dH19bi5fX2VzTW9kdWxlPSEwO3ZhciBpPWUoMTIwKSxvPXIoaSksdT1lKDExOSksYT1yKHUpLGM9XCJmdW5jdGlvblwiPT10eXBlb2YgYVtcImRlZmF1bHRcIl0mJlwic3ltYm9sXCI9PXR5cGVvZiBvW1wiZGVmYXVsdFwiXT9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhW1wiZGVmYXVsdFwiXSYmdC5jb25zdHJ1Y3Rvcj09PWFbXCJkZWZhdWx0XCJdP1wic3ltYm9sXCI6dHlwZW9mIHR9O25bXCJkZWZhdWx0XCJdPVwiZnVuY3Rpb25cIj09dHlwZW9mIGFbXCJkZWZhdWx0XCJdJiZcInN5bWJvbFwiPT09YyhvW1wiZGVmYXVsdFwiXSk/ZnVuY3Rpb24odCl7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpjKHQpfTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgYVtcImRlZmF1bHRcIl0mJnQuY29uc3RydWN0b3I9PT1hW1wiZGVmYXVsdFwiXT9cInN5bWJvbFwiOlwidW5kZWZpbmVkXCI9PXR5cGVvZiB0P1widW5kZWZpbmVkXCI6Yyh0KX19LGZ1bmN0aW9uKHQsbixlKXtlKDkyKTt2YXIgcj1lKDIpLk9iamVjdDt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuLGUpe3JldHVybiByLmRlZmluZVByb3BlcnR5KHQsbixlKX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDIwKSxpPWUoNCkoXCJ0b1N0cmluZ1RhZ1wiKSxvPVwiQXJndW1lbnRzXCI9PXIoZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzfSgpKSx1PWZ1bmN0aW9uKHQsbil7dHJ5e3JldHVybiB0W25dfWNhdGNoKGUpe319O3QuZXhwb3J0cz1mdW5jdGlvbih0KXt2YXIgbixlLGE7cmV0dXJuIHZvaWQgMD09PXQ/XCJVbmRlZmluZWRcIjpudWxsPT09dD9cIk51bGxcIjpcInN0cmluZ1wiPT10eXBlb2YoZT11KG49T2JqZWN0KHQpLGkpKT9lOm8/cihuKTpcIk9iamVjdFwiPT0oYT1yKG4pKSYmXCJmdW5jdGlvblwiPT10eXBlb2Ygbi5jYWxsZWU/XCJBcmd1bWVudHNcIjphfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz1lKDMpLmRvY3VtZW50JiZkb2N1bWVudC5kb2N1bWVudEVsZW1lbnR9LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDIwKTt0LmV4cG9ydHM9T2JqZWN0KFwielwiKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKT9PYmplY3Q6ZnVuY3Rpb24odCl7cmV0dXJuXCJTdHJpbmdcIj09cih0KT90LnNwbGl0KFwiXCIpOk9iamVjdCh0KX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDIxKSxpPWUoNCkoXCJpdGVyYXRvclwiKSxvPUFycmF5LnByb3RvdHlwZTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIHZvaWQgMCE9PXQmJihyLkFycmF5PT09dHx8b1tpXT09PXQpfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNyk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlLGkpe3RyeXtyZXR1cm4gaT9uKHIoZSlbMF0sZVsxXSk6bihlKX1jYXRjaChvKXt2YXIgdT10W1wicmV0dXJuXCJdO3Rocm93IHZvaWQgMCE9PXUmJnIodS5jYWxsKHQpKSxvfX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDI2KSxpPWUoOCksbz1lKDkwKSx1PWUoMTApLGE9ZSgxNSksYz1lKDIxKSxzPWUoMTQyKSxmPWUoMjgpLGw9ZSg4OCksaD1lKDQpKFwiaXRlcmF0b3JcIiksZD0hKFtdLmtleXMmJlwibmV4dFwiaW5bXS5rZXlzKCkpLHY9XCJAQGl0ZXJhdG9yXCIscD1cImtleXNcIix5PVwidmFsdWVzXCIsbT1mdW5jdGlvbigpe3JldHVybiB0aGlzfTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuLGUsayxfLGcsdyl7cyhlLG4sayk7dmFyIGIseCxPLFA9ZnVuY3Rpb24odCl7aWYoIWQmJnQgaW4gVClyZXR1cm4gVFt0XTtzd2l0Y2godCl7Y2FzZSBwOnJldHVybiBmdW5jdGlvbigpe3JldHVybiBuZXcgZSh0aGlzLHQpfTtjYXNlIHk6cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBlKHRoaXMsdCl9fXJldHVybiBmdW5jdGlvbigpe3JldHVybiBuZXcgZSh0aGlzLHQpfX0sST1uK1wiIEl0ZXJhdG9yXCIsUz1fPT15LEU9ITEsVD10LnByb3RvdHlwZSxqPVRbaF18fFRbdl18fF8mJlRbX10sTT1qfHxQKF8pLEY9Xz9TP1AoXCJlbnRyaWVzXCIpOk06dm9pZCAwLEM9XCJBcnJheVwiPT1uP1QuZW50cmllc3x8ajpqO2lmKEMmJihPPWwoQy5jYWxsKG5ldyB0KSksTyE9PU9iamVjdC5wcm90b3R5cGUmJihmKE8sSSwhMCkscnx8YShPLGgpfHx1KE8saCxtKSkpLFMmJmomJmoubmFtZSE9PXkmJihFPSEwLE09ZnVuY3Rpb24oKXtyZXR1cm4gai5jYWxsKHRoaXMpfSksciYmIXd8fCFkJiYhRSYmVFtoXXx8dShULGgsTSksY1tuXT1NLGNbSV09bSxfKWlmKGI9e3ZhbHVlczpTP006UCh5KSxrZXlzOmc/TTpQKHApLGVudHJpZXM6Rn0sdylmb3IoeCBpbiBiKXggaW4gVHx8byhULHgsYlt4XSk7ZWxzZSBpKGkuUCtpLkYqKGR8fEUpLG4sYik7cmV0dXJuIGJ9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg0KShcIml0ZXJhdG9yXCIpLGk9ITE7dHJ5e3ZhciBvPVs3XVtyXSgpO29bXCJyZXR1cm5cIl09ZnVuY3Rpb24oKXtpPSEwfSxBcnJheS5mcm9tKG8sZnVuY3Rpb24oKXt0aHJvdyAyfSl9Y2F0Y2godSl7fXQuZXhwb3J0cz1mdW5jdGlvbih0LG4pe2lmKCFuJiYhaSlyZXR1cm4hMTt2YXIgZT0hMTt0cnl7dmFyIG89WzddLHU9b1tyXSgpO3UubmV4dD1mdW5jdGlvbigpe3JldHVybntkb25lOmU9ITB9fSxvW3JdPWZ1bmN0aW9uKCl7cmV0dXJuIHV9LHQobyl9Y2F0Y2goYSl7fXJldHVybiBlfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTIpLGk9ZSg4NykuZixvPXt9LnRvU3RyaW5nLHU9XCJvYmplY3RcIj09dHlwZW9mIHdpbmRvdyYmd2luZG93JiZPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcz9PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpOltdLGE9ZnVuY3Rpb24odCl7dHJ5e3JldHVybiBpKHQpfWNhdGNoKG4pe3JldHVybiB1LnNsaWNlKCl9fTt0LmV4cG9ydHMuZj1mdW5jdGlvbih0KXtyZXR1cm4gdSYmXCJbb2JqZWN0IFdpbmRvd11cIj09by5jYWxsKHQpP2EodCk6aShyKHQpKX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDg5KSxpPWUoNDApLmNvbmNhdChcImxlbmd0aFwiLFwicHJvdG90eXBlXCIpO24uZj1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc3x8ZnVuY3Rpb24odCl7cmV0dXJuIHIodCxpKX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDE1KSxpPWUoMjkpLG89ZSg0NikoXCJJRV9QUk9UT1wiKSx1PU9iamVjdC5wcm90b3R5cGU7dC5leHBvcnRzPU9iamVjdC5nZXRQcm90b3R5cGVPZnx8ZnVuY3Rpb24odCl7cmV0dXJuIHQ9aSh0KSxyKHQsbyk/dFtvXTpcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LmNvbnN0cnVjdG9yJiZ0IGluc3RhbmNlb2YgdC5jb25zdHJ1Y3Rvcj90LmNvbnN0cnVjdG9yLnByb3RvdHlwZTp0IGluc3RhbmNlb2YgT2JqZWN0P3U6bnVsbH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDE1KSxpPWUoMTIpLG89ZSgxMzYpKCExKSx1PWUoNDYpKFwiSUVfUFJPVE9cIik7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbil7dmFyIGUsYT1pKHQpLGM9MCxzPVtdO2ZvcihlIGluIGEpZSE9dSYmcihhLGUpJiZzLnB1c2goZSk7Zm9yKDtuLmxlbmd0aD5jOylyKGEsZT1uW2MrK10pJiYofm8ocyxlKXx8cy5wdXNoKGUpKTtyZXR1cm4gc319LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9ZSgxMCl9LGZ1bmN0aW9uKHQsbixlKXt2YXIgcixpLG8sdT1lKDE0KSxhPWUoMTQwKSxjPWUoODApLHM9ZSgyNSksZj1lKDMpLGw9Zi5wcm9jZXNzLGg9Zi5zZXRJbW1lZGlhdGUsZD1mLmNsZWFySW1tZWRpYXRlLHY9Zi5NZXNzYWdlQ2hhbm5lbCxwPTAseT17fSxtPVwib25yZWFkeXN0YXRlY2hhbmdlXCIsaz1mdW5jdGlvbigpe3ZhciB0PSt0aGlzO2lmKHkuaGFzT3duUHJvcGVydHkodCkpe3ZhciBuPXlbdF07ZGVsZXRlIHlbdF0sbigpfX0sXz1mdW5jdGlvbih0KXtrLmNhbGwodC5kYXRhKX07aCYmZHx8KGg9ZnVuY3Rpb24odCl7Zm9yKHZhciBuPVtdLGU9MTthcmd1bWVudHMubGVuZ3RoPmU7KW4ucHVzaChhcmd1bWVudHNbZSsrXSk7cmV0dXJuIHlbKytwXT1mdW5jdGlvbigpe2EoXCJmdW5jdGlvblwiPT10eXBlb2YgdD90OkZ1bmN0aW9uKHQpLG4pfSxyKHApLHB9LGQ9ZnVuY3Rpb24odCl7ZGVsZXRlIHlbdF19LFwicHJvY2Vzc1wiPT1lKDIwKShsKT9yPWZ1bmN0aW9uKHQpe2wubmV4dFRpY2sodShrLHQsMSkpfTp2PyhpPW5ldyB2LG89aS5wb3J0MixpLnBvcnQxLm9ubWVzc2FnZT1fLHI9dShvLnBvc3RNZXNzYWdlLG8sMSkpOmYuYWRkRXZlbnRMaXN0ZW5lciYmXCJmdW5jdGlvblwiPT10eXBlb2YgcG9zdE1lc3NhZ2UmJiFmLmltcG9ydFNjcmlwdHM/KHI9ZnVuY3Rpb24odCl7Zi5wb3N0TWVzc2FnZSh0K1wiXCIsXCIqXCIpfSxmLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsXywhMSkpOnI9bSBpbiBzKFwic2NyaXB0XCIpP2Z1bmN0aW9uKHQpe2MuYXBwZW5kQ2hpbGQocyhcInNjcmlwdFwiKSlbbV09ZnVuY3Rpb24oKXtjLnJlbW92ZUNoaWxkKHRoaXMpLGsuY2FsbCh0KX19OmZ1bmN0aW9uKHQpe3NldFRpbWVvdXQodShrLHQsMSksMCl9KSx0LmV4cG9ydHM9e3NldDpoLGNsZWFyOmR9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg4KTtyKHIuUytyLkYqIWUoNSksXCJPYmplY3RcIix7ZGVmaW5lUHJvcGVydHk6ZSg2KS5mfSl9LDYxLGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoMTAxKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBzfSk7dmFyIGM9ZSgxNjgpLHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4pe2koKSh0aGlzLHQpLHRoaXMuZnVuY3Rpb25Mb29rdXBUYWJsZT1ufXJldHVybiB1KCkodCxbe2tleTpcInNwYXduXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZighd2luZG93Lldvcmtlcil0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIFdlYiBXb3JrZXIgc3VwcG9ydFwiKTt2YXIgdD1uZXcgYyxuPW5ldyBhLmEodCx0aGlzLmZ1bmN0aW9uTG9va3VwVGFibGUpO3JldHVybiBuLmluaXRpYWxpemUoKSxufX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyksYT1lKDExMyksYz1lKDE2KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBzfSk7dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7aSgpKHRoaXMsdCksdGhpcy5pZHM9bmV3IGEuYSx0aGlzLmRlZmluaXRpb25zPW5ldyBhLmEsdGhpcy5sYXN0SWQ9MH1yZXR1cm4gdSgpKHQsW3trZXk6XCJnZXRPclNldElkXCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYoZS5pKGMuYikodCkpcmV0dXJuIHQ7dmFyIG49dC50b1N0cmluZygpLHI9dGhpcy5pZHMuZ2V0KG4pO3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiByJiYocj1lLmkoYy5hKShcImR5bmFtaWNcIiwrK3RoaXMubGFzdElkKSx0aGlzLmluaXREZWZpbml0aW9uKHQscikpLHJ9fSx7a2V5OlwiZ2V0RGVmaW5pdGlvblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmRlZmluaXRpb25zLmdldCh0LmlkZW50aWZpZXIpfX0se2tleTpcImluaXREZWZpbml0aW9uXCIsdmFsdWU6ZnVuY3Rpb24odCxuKXt2YXIgZT10LnRvU3RyaW5nKCkscj1lLnN1YnN0cmluZyhlLmluZGV4T2YoXCJmdW5jdGlvblwiKSs5LGUuaW5kZXhPZihcIihcIikpLnRyaW0oKSxpPWUuc3Vic3RyaW5nKGUuaW5kZXhPZihcIihcIikrMSxlLmluZGV4T2YoXCIpXCIpKS5zcGxpdChcIixcIiksbz1lLnN1YnN0cmluZyhlLmluZGV4T2YoXCJ7XCIpKzEsZS5sYXN0SW5kZXhPZihcIn1cIikpLnRyaW0oKSx1PXthcmd1bWVudE5hbWVzOmkubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LnRyaW0oKX0pLGJvZHk6byxpZDpuLG5hbWU6XCJhbm9ueW1vdXNcIiE9PXI/cjp2b2lkIDB9O3RoaXMuaWRzLnNldChlLG4pLHRoaXMuZGVmaW5pdGlvbnMuc2V0KG4uaWRlbnRpZmllcix1KX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7ZnVuY3Rpb24gbihuKXtpZihuKXtpZihuLmhhc093blByb3BlcnR5KFwidGhyZWFkUG9vbFwiKSYmXCJ1bmRlZmluZWRcIj09dHlwZW9mIG4udGhyZWFkUG9vbCl0aHJvdyBuZXcgRXJyb3IoXCJUaGUgdGhyZWFkIHBvb2wgaXMgbWFuZGF0b3J5IGFuZCBjYW5ub3QgYmUgdW5zZXRcIik7aWYobi5oYXNPd25Qcm9wZXJ0eShcIm1heENvbmN1cnJlbmN5TGV2ZWxcIikmJlwibnVtYmVyXCIhPXR5cGVvZiBuLm1heENvbmN1cnJlbmN5TGV2ZWwpdGhyb3cgbmV3IEVycm9yKFwiVGhlIG1heENvbmN1cnJlbmN5TGV2ZWwgaXMgbWFuZGF0b3J5IGFuZCBoYXMgdG8gYmUgYSBudW1iZXJcIil9cmV0dXJuIG8oKSh7fSx0LG4pfXJldHVybntkZWZhdWx0T3B0aW9uczpmdW5jdGlvbihlKXtyZXR1cm4gZT92b2lkKHQ9bihlKSk6bygpKHt9LHQpfSxmcm9tOmZ1bmN0aW9uKHQscil7cmV0dXJuIGUuaShzLmEpKG5ldyB1LmEodCksbihyKSl9LHJhbmdlOmZ1bmN0aW9uKHQscixpLG8pe3ZhciB1PWEuYS5jcmVhdGUodCxyLGkpO3JldHVybiBlLmkocy5hKSh1LG4obykpfSx0aW1lczpmdW5jdGlvbih0LHIsaSxvKXtyZXR1cm4gaT9lLmkocy5hKShjLmEuY3JlYXRlKHQsciksbihvKSxpKTplLmkocy5hKShjLmEuY3JlYXRlKHQsciksbihvKSl9LHNjaGVkdWxlOmZ1bmN0aW9uKG4pe2Zvcih2YXIgcixpPWFyZ3VtZW50cy5sZW5ndGgsbz1BcnJheShpPjE/aS0xOjApLHU9MTt1PGk7dSsrKW9bdS0xXT1hcmd1bWVudHNbdV07aWYoZS5pKGYuYikobikpe3ZhciBhO3JldHVybihhPXQudGhyZWFkUG9vbCkuc2NoZWR1bGUuYXBwbHkoYSxbbl0uY29uY2F0KG8pKX1yZXR1cm4ocj10LnRocmVhZFBvb2wpLnNjaGVkdWxlLmFwcGx5KHIsW25dLmNvbmNhdChvKSl9fX12YXIgaT1lKDcxKSxvPWUubihpKSx1PWUoNTgpLGE9ZSgxMDYpLGM9ZSgxMDcpLHM9ZSgxMDMpLGY9ZSgxNik7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gcn0pfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgzNyksaT1lLm4ociksbz1lKDApLHU9ZS5uKG8pLGE9ZSgxKSxjPWUubihhKSxzPWUoNzQpLGY9ZS5uKHMpLGw9ZSg3MyksaD1lLm4obCksZD1lKDEwOSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gdn0pO3ZhciB2PWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4oKXtyZXR1cm4gdSgpKHRoaXMsbiksZigpKHRoaXMsKG4uX19wcm90b19ffHxpKCkobikpLmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9cmV0dXJuIGgoKShuLHQpLGMoKShuLFt7a2V5OlwiZ2V0U2NoZWR1bGluZ1wiLHZhbHVlOmZ1bmN0aW9uKHQsbil7dmFyIGU9dC8oNCpuLm1heENvbmN1cnJlbmN5TGV2ZWwpO3JldHVybiBuLm1pblZhbHVlc1BlclRhc2smJihlPU1hdGgubWluKE1hdGgubWF4KGUsbi5taW5WYWx1ZXNQZXJUYXNrKSx0KSksbi5tYXhWYWx1ZXNQZXJUYXNrJiYoZT1NYXRoLm1pbihlLG4ubWF4VmFsdWVzUGVyVGFzaykpLHtudW1iZXJPZlRhc2tzOjA9PT1lPzA6TWF0aC5yb3VuZCh0L2UpLHZhbHVlc1BlclRhc2s6TWF0aC5jZWlsKGUpfX19XSksbn0oZC5hKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMCksaT1lLm4ociksbz1lKDEpLHU9ZS5uKG8pLGE9ZSgxMTIpLGM9ZSg5KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBzfSk7dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSxyKXtpKCkodGhpcyx0KSx0aGlzLndvcmtlclRocmVhZEZhY3Rvcnk9bix0aGlzLmZ1bmN0aW9uQ2FsbFNlcmlhbGl6ZXI9ZSx0aGlzLndvcmtlcnM9W10sdGhpcy5pZGxlV29ya2Vycz1bXSx0aGlzLnF1ZXVlPVtdLHRoaXMubGFzdFRhc2tJZD0tMSx0aGlzLmNvbmN1cnJlbmN5TGltaXQ9ci5tYXhDb25jdXJyZW5jeUxldmVsfXJldHVybiB1KCkodCxbe2tleTpcInNjaGVkdWxlXCIsdmFsdWU6ZnVuY3Rpb24odCl7Zm9yKHZhciBuPWFyZ3VtZW50cy5sZW5ndGgsZT1BcnJheShuPjE/bi0xOjApLHI9MTtyPG47cisrKWVbci0xXT1hcmd1bWVudHNbcl07dmFyIGk9dGhpcy5mdW5jdGlvbkNhbGxTZXJpYWxpemVyLnNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbChjLmEuY3JlYXRlVW5jaGVja2VkLmFwcGx5KGMuYSxbdF0uY29uY2F0KGUpKSksbz17bWFpbjppLHVzZWRGdW5jdGlvbklkczpbaS5mdW5jdGlvbklkXX07cmV0dXJuIHRoaXMuc2NoZWR1bGVUYXNrKG8pfX0se2tleTpcInNjaGVkdWxlVGFza1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXM7dC5pZD0rK3RoaXMubGFzdFRhc2tJZDt2YXIgZT1uZXcgYS5hKHQpO3JldHVybiBlLmFsd2F5cyhmdW5jdGlvbigpe3JldHVybiBuLl9yZWxlYXNlV29ya2VyKGUpfSksdGhpcy5xdWV1ZS51bnNoaWZ0KGUpLHRoaXMuX3NjaGVkdWxlUGVuZGluZ1Rhc2tzKCksZX19LHtrZXk6XCJnZXRGdW5jdGlvblNlcmlhbGl6ZXJcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLmZ1bmN0aW9uQ2FsbFNlcmlhbGl6ZXJ9fSx7a2V5OlwiX3JlbGVhc2VXb3JrZXJcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgbj10LnJlbGVhc2VXb3JrZXIoKTt0aGlzLmlkbGVXb3JrZXJzLnB1c2gobiksdGhpcy5fc2NoZWR1bGVQZW5kaW5nVGFza3MoKX19LHtrZXk6XCJfc2NoZWR1bGVQZW5kaW5nVGFza3NcIix2YWx1ZTpmdW5jdGlvbigpe2Zvcig7dGhpcy5xdWV1ZS5sZW5ndGg7KXt2YXIgdD12b2lkIDA7aWYoMD09PXRoaXMuaWRsZVdvcmtlcnMubGVuZ3RoJiZ0aGlzLndvcmtlcnMubGVuZ3RoPHRoaXMuY29uY3VycmVuY3lMaW1pdD8odD10aGlzLndvcmtlclRocmVhZEZhY3Rvcnkuc3Bhd24oKSx0aGlzLndvcmtlcnMucHVzaCh0KSk6dGhpcy5pZGxlV29ya2Vycy5sZW5ndGg+MCYmKHQ9dGhpcy5pZGxlV29ya2Vycy5wb3AoKSksIXQpcmV0dXJuO3ZhciBuPXRoaXMucXVldWUucG9wKCk7bi5ydW5Pbih0KX19fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDk2KSxpPWUoOTgpLG89ZSg5NyksdT1lKDk1KSxhPWUoMzQpLGM9ZSg5NCkscz1lKDU0KTtlLmQobixcIklQYXJhbGxlbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuYX0pLGUuZChuLFwiSVRhc2tEZWZpbml0aW9uXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5ifSksZS5kKG4sXCJJVGFza1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuY30pLGUuZChuLFwiSUZ1bmN0aW9uRGVmaW5pdGlvblwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuZH0pLGUuZChuLFwiSUZ1bmN0aW9uSWRcIixmdW5jdGlvbigpe3JldHVybiBzLmV9KSxlLmQobixcImlzRnVuY3Rpb25JZFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuZn0pLGUuZChuLFwiRnVuY3Rpb25DYWxsXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5nfSksZS5kKG4sXCJJU2VyaWFsaXplZEZ1bmN0aW9uQ2FsbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMuaH0pLGUuZChuLFwiaXNTZXJpYWxpemVkRnVuY3Rpb25DYWxsXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5pfSksZS5kKG4sXCJGdW5jdGlvbkNhbGxTZXJpYWxpemVyXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5qfSksZS5kKG4sXCJJVGhyZWFkUG9vbFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMua30pLGUuZChuLFwiSVBhcmFsbGVsQ2hhaW5cIixmdW5jdGlvbigpe3JldHVybiBzLmx9KSxlLmQobixcIklQYXJhbGxlbFRhc2tFbnZpcm9ubWVudFwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMubX0pLGUuZChuLFwiSVBhcmFsbGVsRW52aXJvbm1lbnRcIixmdW5jdGlvbigpe3JldHVybiBzLm59KSxlLmQobixcIklQYXJhbGxlbEpvYlwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMub30pLGUuZChuLFwiSVBhcmFsbGVsT3B0aW9uc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHMucH0pLGUuZChuLFwiSURlZmF1bHRJbml0aWFsaXplZFBhcmFsbGVsT3B0aW9uc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIHMucX0pLGUuZChuLFwiSVBhcmFsbGVsSm9iU2NoZWR1bGVyXCIsZnVuY3Rpb24oKXtyZXR1cm4gcy5yfSksZS5kKG4sXCJJUGFyYWxsZWxPcGVyYXRpb25cIixmdW5jdGlvbigpe3JldHVybiBzLnN9KSxlLmQobixcIklTZXJpYWxpemVkUGFyYWxsZWxPcGVyYXRpb25cIixmdW5jdGlvbigpe3JldHVybiBzLnR9KSxlLmQobixcIklQYXJhbGxlbFN0cmVhbVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHMudX0pO3ZhciBmPW5ldyB1LmEsbD13aW5kb3cubmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3l8fDQsaD1uZXcgYS5hKGYpLGQ9bmV3IGkuYShuZXcgYy5hKGYpLGgse21heENvbmN1cnJlbmN5TGV2ZWw6bH0pLHY9ZS5pKHIuYSkoe21heENvbmN1cnJlbmN5TGV2ZWw6bCxzY2hlZHVsZXI6bmV3IG8uYSx0aHJlYWRQb29sOmR9KTtuW1wiZGVmYXVsdFwiXT12fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgzNyksaT1lLm4ociksbz1lKDc0KSx1PWUubihvKSxhPWUoMTIxKSxjPWUubihhKSxzPWUoNzMpLGY9ZS5uKHMpLGw9ZSgwKSxoPWUubihsKSxkPWUoMSksdj1lLm4oZCkscD1lKDY5KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiB5fSksZS5kKG4sXCJiXCIsZnVuY3Rpb24oKXtyZXR1cm4gbX0pO3ZhciB5PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXtoKCkodGhpcyx0KSx0aGlzLm5hbWU9bn1yZXR1cm4gdigpKHQsW3trZXk6XCJvbk1lc3NhZ2VcIix2YWx1ZTpmdW5jdGlvbih0KXt0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIHdvcmtlciB0aHJlYWQgaW4gc3RhdGUgJ1wiK3RoaXMubmFtZStcIicgY2Fubm90IGhhbmRsZSB0aGUgcmVjZWl2ZWQgbWVzc2FnZSAoXCIrdC5kYXRhLnR5cGUrXCIpLlwiKX19LHtrZXk6XCJvbkVycm9yXCIsdmFsdWU6ZnVuY3Rpb24odCl7Y29uc29sZS5lcnJvcihcIlByb2Nlc3NpbmcgZXJyb3Igb24gd29ya2VyIHNsYXZlXCIsdC5lcnJvcil9fV0pLHR9KCksbT1mdW5jdGlvbih0KXtmdW5jdGlvbiBuKHQsZSxyKXtoKCkodGhpcyxuKTt2YXIgbz11KCkodGhpcywobi5fX3Byb3RvX198fGkoKShuKSkuY2FsbCh0aGlzLFwiZXhlY3V0aW5nXCIpKTtyZXR1cm4gby5jYWxsYmFjaz10LG8uZnVuY3Rpb25SZWdpc3RyeT1lLG8ud29ya2VyPXIsb31yZXR1cm4gZigpKG4sdCksdigpKG4sW3trZXk6XCJvbk1lc3NhZ2VcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgcj10aGlzLG89dC5kYXRhO2lmKGUuaShwLmEpKG8pKXt2YXIgdT1vLmZ1bmN0aW9uSWRzLm1hcChmdW5jdGlvbih0KXt2YXIgbj1yLmZ1bmN0aW9uUmVnaXN0cnkuZ2V0RGVmaW5pdGlvbih0KTtpZighbil0aHJvdyBFcnJvcihyK1wiIHJlcXVlc3RlZCB1bmtub3duIGZ1bmN0aW9uIHdpdGggaWQgXCIrdCk7cmV0dXJuIG59KTt0aGlzLndvcmtlci5wb3N0TWVzc2FnZShlLmkocC5iKSh1KSl9ZWxzZSBlLmkocC5jKShvKT90aGlzLmNhbGxiYWNrKHZvaWQgMCxvLnJlc3VsdCk6ZS5pKHAuZCkobyk/dGhpcy5jYWxsYmFjayhvLmVycm9yLHZvaWQgMCk6YygpKG4ucHJvdG90eXBlLl9fcHJvdG9fX3x8aSgpKG4ucHJvdG90eXBlKSxcIm9uTWVzc2FnZVwiLHRoaXMpLmNhbGwodGhpcyx0KX19LHtrZXk6XCJvbkVycm9yXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5jYWxsYmFjayh0LmVycm9yLHZvaWQgMCl9fV0pLG59KHkpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyksYT1lKDY5KSxjPWUoMTAwKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBmfSk7dmFyIHM9MCxmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuLGUpe2koKSh0aGlzLHQpLHRoaXMud29ya2VyPW4sdGhpcy5mdW5jdGlvbkxvb2t1cFRhYmxlPWUsdGhpcy5pZD0rK3MsdGhpcy5zdGF0ZT1uZXcgYy5hKFwiZGVmYXVsdFwiKSx0aGlzLnN0b3BwZWQ9ITE7dmFyIHI9dGhpczt0aGlzLndvcmtlci5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGZ1bmN0aW9uKCl7ci5vbldvcmtlck1lc3NhZ2UuYXBwbHkocixhcmd1bWVudHMpfSksdGhpcy53b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsZnVuY3Rpb24oKXtyLm9uRXJyb3IuYXBwbHkocixhcmd1bWVudHMpfSl9cmV0dXJuIHUoKSh0LFt7a2V5OlwiaW5pdGlhbGl6ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoXCJkZWZhdWx0XCIhPT10aGlzLnN0YXRlLm5hbWUpdGhyb3cgbmV3IEVycm9yKFwiVGhlIGJyb3dzZXIgd29ya2VyIHRocmVhZCBjYW4gb25seSBiZSBpbml0aWFsaXplZCBpZiBpbiBzdGF0ZSBkZWZhdWx0IGJ1dCBhY3R1YWwgc3RhdGUgaXMgJ1wiK3RoaXMuc3RhdGUubmFtZStcIicuXCIpO3RoaXMuc2VuZE1lc3NhZ2UoZS5pKGEuZSkodGhpcy5pZCkpLHRoaXMuc3RhdGU9bmV3IGMuYShcImlkbGVcIil9fSx7a2V5OlwicnVuXCIsdmFsdWU6ZnVuY3Rpb24odCxuKXt2YXIgcj10aGlzO2lmKFwiaWRsZVwiIT09dGhpcy5zdGF0ZS5uYW1lKXRocm93IG5ldyBFcnJvcihcIlRoZSBicm93c2VyIHdvcmtlciB0aHJlYWQgY2FuIG9ubHkgZXhlY3V0ZSBhIG5ldyB0YXNrIGlmIGluIHN0YXRlIGlkbGUgYnV0IGFjdHVhbCBzdGF0ZSBpcyAnXCIrdGhpcy5zdGF0ZS5uYW1lK1wiJy5cIik7dGhpcy5zZW5kTWVzc2FnZShlLmkoYS5mKSh0KSk7dmFyIGk9ZnVuY3Rpb24odCxlKXtyLnN0b3BwZWQ/ci5zdGF0ZT1uZXcgYy5hKFwic3RvcHBlZFwiKTpyLnN0YXRlPW5ldyBjLmEoXCJpZGxlXCIpLG4odCxlKX07dGhpcy5zdGF0ZT1uZXcgYy5iKGksdGhpcy5mdW5jdGlvbkxvb2t1cFRhYmxlLHRoaXMud29ya2VyKX19LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnN0b3BwZWR8fCh0aGlzLnNlbmRNZXNzYWdlKGUuaShhLmcpKCkpLHRoaXMuc3RvcHBlZD0hMCxcImV4ZWN1dGluZ1wiIT09dGhpcy5zdGF0ZS5uYW1lJiYodGhpcy5zdGF0ZT1uZXcgYy5hKFwic3RvcHBlZFwiKSkpfX0se2tleTpcInRvU3RyaW5nXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm5cIkJyb3dzZXJXb3JrZXJUaHJlYWQgeyBpZDogXCIrdGhpcy5pZCtcIiwgc3RhdGU6IFwiK3RoaXMuc3RhdGUubmFtZX19LHtrZXk6XCJvbldvcmtlck1lc3NhZ2VcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnN0YXRlLm9uTWVzc2FnZSh0KX19LHtrZXk6XCJvbkVycm9yXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5zdGF0ZS5vbkVycm9yKHQpLHRoaXMuc3RhdGU9bmV3IGMuYShcImVycm9yZWRcIil9fSx7a2V5Olwic2VuZE1lc3NhZ2VcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLndvcmtlci5wb3N0TWVzc2FnZSh0KX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoNzYpLGk9ZS5uKHIpLG89ZSgwKSx1PWUubihvKSxhPWUoMSksYz1lLm4oYSkscz1lKDU3KSxmPWUoNTgpLGw9ZSgzNiksaD1lKDIzKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBkfSk7dmFyIGQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSxyKXt2YXIgaT1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106W107dSgpKHRoaXMsdCksdGhpcy5wcmV2aW91c1N0cmVhbT1uLHRoaXMub3B0aW9ucz1lLHRoaXMuZW52aXJvbm1lbnQ9cix0aGlzLm9wZXJhdGlvbnM9aX1yZXR1cm4gYygpKHQsW3trZXk6XCJyZXNvbHZlXCIsdmFsdWU6ZnVuY3Rpb24gbigpe3ZhciB0PXRoaXMsZT12b2lkIDAsbj12b2lkIDAscj12b2lkIDAsaT1uZXcgaC5hKGZ1bmN0aW9uKHQsaSxvKXtlPXQsbj1pLHI9b30pO3JldHVybiB0aGlzLnByZXZpb3VzU3RyZWFtLnRoZW4oZnVuY3Rpb24oaSl7dmFyIG89dC5vcHRpb25zLnNjaGVkdWxlci5zY2hlZHVsZSh7ZW52aXJvbm1lbnQ6dC5lbnZpcm9ubWVudCxnZW5lcmF0b3I6bmV3IGYuYShpKSxvcGVyYXRpb25zOnQub3BlcmF0aW9ucyxvcHRpb25zOnQub3B0aW9uc30pLHU9aC5hLmZyb21UYXNrcyhvLGwuYSk7dS5zdWJzY3JpYmUoZSxyLG4pfSxyKSxuZXcgcy5hKGksdGhpcy5vcHRpb25zLHRoaXMuZW52aXJvbm1lbnQpfX0se2tleTpcImNoYWluT3BlcmF0aW9uXCIsdmFsdWU6ZnVuY3Rpb24obil7cmV0dXJuIG5ldyB0KHRoaXMucHJldmlvdXNTdHJlYW0sdGhpcy5vcHRpb25zLHRoaXMuZW52aXJvbm1lbnQsW10uY29uY2F0KGkoKSh0aGlzLm9wZXJhdGlvbnMpLFtuXSkpfX0se2tleTpcImFkZEVudmlyb25tZW50XCIsdmFsdWU6ZnVuY3Rpb24obil7cmV0dXJuIG5ldyB0KHRoaXMucHJldmlvdXNTdHJlYW0sdGhpcy5vcHRpb25zLHRoaXMuZW52aXJvbm1lbnQuYWRkKG4pLHRoaXMub3BlcmF0aW9ucyl9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsbixlKXt2YXIgcj1hcmd1bWVudHMubGVuZ3RoPjMmJnZvaWQgMCE9PWFyZ3VtZW50c1szXT9hcmd1bWVudHNbM106W10sYT12b2lkIDA7ZSBpbnN0YW5jZW9mIEFycmF5PyhhPXZvaWQgMCxyPWUpOmE9ZTt2YXIgYz1uZXcgby5hKG5ldyBpLmEodCxuLHUuYS5vZigpLHIpKTtyZXR1cm4gYT9jLmluRW52aXJvbm1lbnQoYSk6Y312YXIgaT1lKDEwNSksbz1lKDEwNCksdT1lKDEwOCk7bi5hPXJ9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDE5KSxpPWUubihyKSxvPWUoNzUpLHU9ZS5uKG8pLGE9ZSgwKSxjPWUubihhKSxzPWUoMSksZj1lLm4ocyksbD1lKDE4KSxoPWUoOSksZD1lKDIzKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiB2fSk7dmFyIHY9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4pe2MoKSh0aGlzLHQpLHRoaXMuc3RhdGU9bn1yZXR1cm4gZigpKHQsW3trZXk6XCJpbkVudmlyb25tZW50XCIsdmFsdWU6ZnVuY3Rpb24obil7dmFyIGU9dm9pZCAwO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG4pe2Zvcih2YXIgcj1hcmd1bWVudHMubGVuZ3RoLGk9QXJyYXkocj4xP3ItMTowKSxvPTE7bzxyO28rKylpW28tMV09YXJndW1lbnRzW29dO2U9aC5hLmNyZWF0ZVVuY2hlY2tlZC5hcHBseShoLmEsW25dLmNvbmNhdChpKSl9ZWxzZSBlPW47cmV0dXJuIG5ldyB0KHRoaXMuc3RhdGUuYWRkRW52aXJvbm1lbnQoZSkpfX0se2tleTpcIm1hcFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9jaGFpbihoLmEuY3JlYXRlVW5jaGVja2VkKGwuYS5NQVApLGguYS5jcmVhdGVVbmNoZWNrZWQodCkpfX0se2tleTpcInJlZHVjZVwiLHZhbHVlOmZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lfHxuLG89dGhpcy5fY2hhaW4oaC5hLmNyZWF0ZVVuY2hlY2tlZChsLmEuUkVEVUNFLHQpLGguYS5jcmVhdGVVbmNoZWNrZWQobikpLnJlc29sdmVDaGFpbigpO3JldHVybiBkLmEudHJhbnNmb3JtKG8sZnVuY3Rpb24obil7aWYoMD09PW4ubGVuZ3RoKXJldHVybiB0O3ZhciBlPXUoKShuKSxvPWVbMF0sYT1lLnNsaWNlKDEpLGM9byxzPSEwLGY9ITEsbD12b2lkIDA7dHJ5e2Zvcih2YXIgaCxkPWkoKShhKTshKHM9KGg9ZC5uZXh0KCkpLmRvbmUpO3M9ITApe3ZhciB2PWgudmFsdWU7Yz1yKGMsdil9fWNhdGNoKHApe2Y9ITAsbD1wfWZpbmFsbHl7dHJ5eyFzJiZkW1wicmV0dXJuXCJdJiZkW1wicmV0dXJuXCJdKCl9ZmluYWxseXtpZihmKXRocm93IGx9fXJldHVybiBjfSl9fSx7a2V5OlwiZmlsdGVyXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2NoYWluKGguYS5jcmVhdGVVbmNoZWNrZWQobC5hLkZJTFRFUiksaC5hLmNyZWF0ZVVuY2hlY2tlZCh0KSl9fSx7a2V5Olwic3Vic2NyaWJlXCIsdmFsdWU6ZnVuY3Rpb24odCxuLGUpe3JldHVybiB0aGlzLnJlc29sdmVDaGFpbigpLnN1YnNjcmliZSh0LG4sZSl9fSx7a2V5OlwidGhlblwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7cmV0dXJuIHRoaXMucmVzb2x2ZUNoYWluKCkudGhlbih0LG4pfX0se2tleTpcImNhdGNoXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucmVzb2x2ZUNoYWluKClbXCJjYXRjaFwiXSh0KX19LHtrZXk6XCJyZXNvbHZlQ2hhaW5cIix2YWx1ZTpmdW5jdGlvbigpe3ZhciB0PXRoaXMuc3RhdGU9dGhpcy5zdGF0ZS5yZXNvbHZlKCk7cmV0dXJuIHQuc3RyZWFtfX0se2tleTpcIl9jaGFpblwiLHZhbHVlOmZ1bmN0aW9uKG4sZSl7dmFyIHI9e2l0ZXJhdG9yOm4saXRlcmF0ZWU6ZX07cmV0dXJuIG5ldyB0KHRoaXMuc3RhdGUuY2hhaW5PcGVyYXRpb24ocikpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSg3NiksaT1lLm4ociksbz1lKDApLHU9ZS5uKG8pLGE9ZSgxKSxjPWUubihhKSxzPWUoNTcpLGY9ZSgyMyksbD1lKDM2KTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBofSk7dmFyIGg9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4sZSxyLGkpe3UoKSh0aGlzLHQpLHRoaXMuZ2VuZXJhdG9yPW4sdGhpcy5vcHRpb25zPWUsXG50aGlzLmVudmlyb25tZW50PXIsdGhpcy5vcGVyYXRpb25zPWl9cmV0dXJuIGMoKSh0LFt7a2V5OlwicmVzb2x2ZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5vcHRpb25zLnNjaGVkdWxlci5zY2hlZHVsZSh7ZW52aXJvbm1lbnQ6dGhpcy5lbnZpcm9ubWVudCxnZW5lcmF0b3I6dGhpcy5nZW5lcmF0b3Isb3BlcmF0aW9uczp0aGlzLm9wZXJhdGlvbnMsb3B0aW9uczp0aGlzLm9wdGlvbnN9KTtyZXR1cm4gbmV3IHMuYShmLmEuZnJvbVRhc2tzKHQsbC5hKSx0aGlzLm9wdGlvbnMsdGhpcy5lbnZpcm9ubWVudCl9fSx7a2V5OlwiY2hhaW5PcGVyYXRpb25cIix2YWx1ZTpmdW5jdGlvbihuKXtyZXR1cm4gbmV3IHQodGhpcy5nZW5lcmF0b3IsdGhpcy5vcHRpb25zLHRoaXMuZW52aXJvbm1lbnQsW10uY29uY2F0KGkoKSh0aGlzLm9wZXJhdGlvbnMpLFtuXSkpfX0se2tleTpcImFkZEVudmlyb25tZW50XCIsdmFsdWU6ZnVuY3Rpb24obil7cmV0dXJuIG5ldyB0KHRoaXMuZ2VuZXJhdG9yLHRoaXMub3B0aW9ucyx0aGlzLmVudmlyb25tZW50LmFkZChuKSx0aGlzLm9wZXJhdGlvbnMpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgwKSxpPWUubihyKSxvPWUoMSksdT1lLm4obyksYT1lKDE4KSxjPWUoOSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gc30pO3ZhciBzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuLGUscil7aSgpKHRoaXMsdCksdGhpcy5zdGFydD1uLHRoaXMuZW5kPWUsdGhpcy5zdGVwPXJ9cmV0dXJuIHUoKSh0LFt7a2V5Olwic2VyaWFsaXplU2xpY2VcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7dmFyIHI9bip0aGlzLnN0ZXAsaT10aGlzLnN0YXJ0K3QqcixvPU1hdGgubWluKGkrcix0aGlzLmVuZCk7cmV0dXJuIGUuc2VyaWFsaXplRnVuY3Rpb25DYWxsKGMuYS5jcmVhdGVVbmNoZWNrZWQoYS5hLlJBTkdFLGksbyx0aGlzLnN0ZXApKX19LHtrZXk6XCJsZW5ndGhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gTWF0aC5jZWlsKCh0aGlzLmVuZC10aGlzLnN0YXJ0KS90aGlzLnN0ZXApfX1dLFt7a2V5OlwiY3JlYXRlXCIsdmFsdWU6ZnVuY3Rpb24obixlLHIpe3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBlJiYoZT1uLG49MCksXCJ1bmRlZmluZWRcIj09dHlwZW9mIHImJihyPWU8bj8tMToxKSxuZXcgdChuLGUscil9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoMTgpLGM9ZSg5KSxzPWUoMTYpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGZ9KTt2YXIgZj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobixlKXtpKCkodGhpcyx0KSx0aGlzLnRpbWVzPW4sdGhpcy5pdGVyYXRlZT1lfXJldHVybiB1KCkodCxbe2tleTpcInNlcmlhbGl6ZVNsaWNlXCIsdmFsdWU6ZnVuY3Rpb24odCxuLGUpe3ZhciByPXQqbixpPU1hdGgubWluKHIrbix0aGlzLnRpbWVzKSxvPWUuc2VyaWFsaXplRnVuY3Rpb25DYWxsKHRoaXMuaXRlcmF0ZWUpO3JldHVybiBlLnNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbChjLmEuY3JlYXRlKGEuYS5USU1FUyxyLGksbykpfX0se2tleTpcImxlbmd0aFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnRpbWVzfX1dLFt7a2V5OlwiY3JlYXRlXCIsdmFsdWU6ZnVuY3Rpb24obixyKXt2YXIgaT12b2lkIDA7cmV0dXJuIGk9ZS5pKHMuYikocil8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHI/Yy5hLmNyZWF0ZVVuY2hlY2tlZChyKTpjLmEuY3JlYXRlKGEuYS5JREVOVElUWSxyKSxuZXcgdChuLGkpfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSg3MSksaT1lLm4ociksbz1lKDApLHU9ZS5uKG8pLGE9ZSgxKSxjPWUubihhKSxzPWUoOSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gZn0pO3ZhciBmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3ZhciBuPWFyZ3VtZW50cy5sZW5ndGg+MCYmdm9pZCAwIT09YXJndW1lbnRzWzBdP2FyZ3VtZW50c1swXTpbXTt1KCkodGhpcyx0KSx0aGlzLmVudmlyb25tZW50cz1ufXJldHVybiBjKCkodCxbe2tleTpcImFkZFwiLHZhbHVlOmZ1bmN0aW9uKG4pe3ZhciBlPXRoaXMuZW52aXJvbm1lbnRzLnNsaWNlKCk7cmV0dXJuIG4gaW5zdGFuY2VvZiBzLmF8fCEodGhpcy5lbnZpcm9ubWVudHMubGVuZ3RoPjApfHx0aGlzLmVudmlyb25tZW50c1t0aGlzLmVudmlyb25tZW50cy5sZW5ndGgtMV1pbnN0YW5jZW9mIHMuYT9lLnB1c2gobik6ZVtlLmxlbmd0aC0xXT1pKCkoe30sZVtlLmxlbmd0aC0xXSxuKSxuZXcgdChlKX19LHtrZXk6XCJ0b0pTT05cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5lbnZpcm9ubWVudHMubWFwKGZ1bmN0aW9uKG4pe3JldHVybiBuIGluc3RhbmNlb2Ygcy5hP3Quc2VyaWFsaXplRnVuY3Rpb25DYWxsKG4pOm59KX19XSxbe2tleTpcIm9mXCIsdmFsdWU6ZnVuY3Rpb24obil7dmFyIGU9dC5FTVBUWTtyZXR1cm4gbj9lLmFkZChuKTplfX1dKSx0fSgpO2YuRU1QVFk9bmV3IGZ9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDApLGk9ZS5uKHIpLG89ZSgxKSx1PWUubihvKSxhPWUoOSksYz1lKDE4KSxzPWUoMzYpLGY9ZSgzNSk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gbH0pO3ZhciBsPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe2koKSh0aGlzLHQpfXJldHVybiB1KCkodCxbe2tleTpcInNjaGVkdWxlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIG49dGhpcy5nZXRUYXNrRGVmaW5pdGlvbnModCk7cmV0dXJuIG4ubWFwKGZ1bmN0aW9uKG4pe3JldHVybiB0Lm9wdGlvbnMudGhyZWFkUG9vbC5zY2hlZHVsZVRhc2sobil9KX19LHtrZXk6XCJnZXRUYXNrRGVmaW5pdGlvbnNcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgbj10aGlzLmdldFNjaGVkdWxpbmcodC5nZW5lcmF0b3IubGVuZ3RoLHQub3B0aW9ucykscj10Lm9wdGlvbnMudGhyZWFkUG9vbC5nZXRGdW5jdGlvblNlcmlhbGl6ZXIoKSxpPXQuZW52aXJvbm1lbnQudG9KU09OKHIpLG89dGhpcy5zZXJpYWxpemVPcGVyYXRpb25zKHQub3BlcmF0aW9ucyxyKSx1PVtjLmEuUEFSQUxMRUxfSk9CX0VYRUNVVE9SXS5jb25jYXQoZS5pKHMuYSkoby5tYXAoZnVuY3Rpb24odCl7cmV0dXJuW3QuaXRlcmF0ZWUuZnVuY3Rpb25JZCx0Lml0ZXJhdG9yLmZ1bmN0aW9uSWRdfSkpKTtpLmZvckVhY2goZnVuY3Rpb24odCl7ZS5pKGYuYSkodCkmJnUucHVzaCh0LmZ1bmN0aW9uSWQpfSk7Zm9yKHZhciBsPVtdLGg9MDtoPG4ubnVtYmVyT2ZUYXNrczsrK2gpe3ZhciBkPXQuZ2VuZXJhdG9yLnNlcmlhbGl6ZVNsaWNlKGgsbi52YWx1ZXNQZXJUYXNrLHIpLHY9e2Vudmlyb25tZW50czppLGdlbmVyYXRvcjpkLG9wZXJhdGlvbnM6byx0YXNrSW5kZXg6aCx2YWx1ZXNQZXJUYXNrOm4udmFsdWVzUGVyVGFza30scD17bWFpbjpyLnNlcmlhbGl6ZUZ1bmN0aW9uQ2FsbChhLmEuY3JlYXRlVW5jaGVja2VkKGMuYS5QQVJBTExFTF9KT0JfRVhFQ1VUT1IsdikpLHRhc2tJbmRleDpoLHVzZWRGdW5jdGlvbklkczpbZC5mdW5jdGlvbklkXS5jb25jYXQodSksdmFsdWVzUGVyVGFzazpuLnZhbHVlc1BlclRhc2t9O2wucHVzaChwKX1yZXR1cm4gbH19LHtrZXk6XCJzZXJpYWxpemVPcGVyYXRpb25zXCIsdmFsdWU6ZnVuY3Rpb24odCxuKXtyZXR1cm4gdC5tYXAoZnVuY3Rpb24odCl7cmV0dXJue2l0ZXJhdGVlOm4uc2VyaWFsaXplRnVuY3Rpb25DYWxsKHQuaXRlcmF0ZWUpLGl0ZXJhdG9yOm4uc2VyaWFsaXplRnVuY3Rpb25DYWxsKHQuaXRlcmF0b3IpfX0pfX1dKSx0fSgpfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgzOCksaT1lLm4ociksbz1lKDApLHU9ZS5uKG8pLGE9ZSgxKSxjPWUubihhKTtlLmQobixcImFcIixmdW5jdGlvbigpe3JldHVybiBzfSk7dmFyIHM9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KG4pe3UoKSh0aGlzLHQpLHRoaXMucHJvbWlzZT1pLmEucmVzb2x2ZShuKX1yZXR1cm4gYygpKHQsW3trZXk6XCJzdWJzY3JpYmVcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuKGV8fG4pJiZ0aGlzLnByb21pc2UudGhlbihlLG4pLHRoaXN9fSx7a2V5OlwidGhlblwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7cmV0dXJuIHRoaXMucHJvbWlzZS50aGVuKHQsbil9fSx7a2V5OlwiY2F0Y2hcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wcm9taXNlW1wiY2F0Y2hcIl0odCl9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDE5KSxpPWUubihyKSxvPWUoMCksdT1lLm4obyksYT1lKDEpLGM9ZS5uKGEpLHM9ZSgyMyk7ZS5kKG4sXCJhXCIsZnVuY3Rpb24oKXtyZXR1cm4gZn0pO3ZhciBmPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuLGUpe3ZhciByPXRoaXM7dSgpKHRoaXMsdCksdGhpcy5mYWlsZWQ9ITEsdGhpcy50YXNrcz1uLHRoaXMuam9pbmVyPWUsdGhpcy5zdWJSZXN1bHRzPW5ldyBBcnJheShuLmxlbmd0aCksdGhpcy5wZW5kaW5nPW4ubGVuZ3RoLHRoaXMuaW5uZXJTdHJlYW09bmV3IHMuYShmdW5jdGlvbih0LG4sZSl7ci5uZXh0PXQsci5yZXNvbHZlPW4sci5yZWplY3Q9ZX0pO3ZhciBvPSEwLGE9ITEsYz12b2lkIDA7dHJ5e2Zvcih2YXIgZixsPWZ1bmN0aW9uKCl7dmFyIHQ9Zi52YWx1ZTt0LnRoZW4oZnVuY3Rpb24obil7cmV0dXJuIHIuX3Rhc2tDb21wbGV0ZWQobix0LmRlZmluaXRpb24pfSxmdW5jdGlvbih0KXtyZXR1cm4gci5fdGFza0ZhaWxlZCh0KX0pfSxoPWkoKShuKTshKG89KGY9aC5uZXh0KCkpLmRvbmUpO289ITApbCgpfWNhdGNoKGQpe2E9ITAsYz1kfWZpbmFsbHl7dHJ5eyFvJiZoW1wicmV0dXJuXCJdJiZoW1wicmV0dXJuXCJdKCl9ZmluYWxseXtpZihhKXRocm93IGN9fX1yZXR1cm4gYygpKHQsW3trZXk6XCJzdWJzY3JpYmVcIix2YWx1ZTpmdW5jdGlvbih0LG4sZSl7cmV0dXJuIHRoaXMuaW5uZXJTdHJlYW0uc3Vic2NyaWJlKHQsbixlKSx0aGlzfX0se2tleTpcInRoZW5cIix2YWx1ZTpmdW5jdGlvbih0LG4pe3JldHVybiB0aGlzLmlubmVyU3RyZWFtLnRoZW4odCxuKX19LHtrZXk6XCJjYXRjaFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmlubmVyU3RyZWFtW1wiY2F0Y2hcIl0odCl9fSx7a2V5OlwiX3Rhc2tDb21wbGV0ZWRcIix2YWx1ZTpmdW5jdGlvbih0LG4pe2lmKDA9PT10aGlzLnBlbmRpbmcpdGhyb3cgbmV3IEVycm9yKFwiU3RyZWFtIGFscmVhZHkgcmVzb2x2ZWQgYnV0IHRhc2tDb21wbGV0ZWQgY2FsbGVkIG9uZSBtb3JlIHRpbWVcIik7LS10aGlzLnBlbmRpbmcsdGhpcy5zdWJSZXN1bHRzW24udGFza0luZGV4XT10LHRoaXMuZmFpbGVkfHwodGhpcy5uZXh0KHQsbi50YXNrSW5kZXgsbi52YWx1ZXNQZXJUYXNrKSwwPT09dGhpcy5wZW5kaW5nJiZ0aGlzLnJlc29sdmUodGhpcy5qb2luZXIuYXBwbHkodm9pZCAwLFt0aGlzLnN1YlJlc3VsdHNdKSkpfX0se2tleTpcIl90YXNrRmFpbGVkXCIsdmFsdWU6ZnVuY3Rpb24odCl7aWYodGhpcy5mYWlsZWQhPT0hMCl7dGhpcy5mYWlsZWQ9ITA7Zm9yKHZhciBuPTA7bjx0aGlzLnRhc2tzLmxlbmd0aDsrK24pXCJ1bmRlZmluZWRcIj09dHlwZW9mIHRoaXMuc3ViUmVzdWx0c1tuXSYmdGhpcy50YXNrc1tuXS5jYW5jZWwoKTt0aGlzLnJlamVjdCh0KX19fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDM4KSxpPWUubihyKSxvPWUoMCksdT1lLm4obyksYT1lKDEpLGM9ZS5uKGEpO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIHN9KTt2YXIgcz1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobil7dmFyIGU9dGhpczt1KCkodGhpcyx0KSx0aGlzLmRlZmluaXRpb249bix0aGlzLmlzQ2FuY2VsbGF0aW9uUmVxdWVzdGVkPSExLHRoaXMuaXNDYW5jZWxlZD0hMSx0aGlzLnByb21pc2U9bmV3IGkuYShmdW5jdGlvbih0LG4pe2UucmVzb2x2ZT10LGUucmVqZWN0PW59KX1yZXR1cm4gYygpKHQsW3trZXk6XCJydW5PblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXM7aWYodGhpcy53b3JrZXI9dCx0aGlzLmlzQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKXRoaXMuX3Rhc2tDb21wbGV0ZWQodm9pZCAwKTtlbHNle3ZhciBlPWZ1bmN0aW9uKHQsZSl7dD9uLnJlamVjdCh0KTpuLl90YXNrQ29tcGxldGVkKGUpfTt0aGlzLndvcmtlci5ydW4odGhpcy5kZWZpbml0aW9uLGUpfX19LHtrZXk6XCJyZWxlYXNlV29ya2VyXCIsdmFsdWU6ZnVuY3Rpb24oKXtpZighdGhpcy53b3JrZXIpdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJlbGVhc2UgYSB3b3JrZXIgdGFzayB0aGF0IGhhcyBubyBhc3NpZ25lZCB3b3JrZXIgdGhyZWFkLlwiKTt2YXIgdD10aGlzLndvcmtlcjtyZXR1cm4gdGhpcy53b3JrZXI9dm9pZCAwLHR9fSx7a2V5OlwidGhlblwiLHZhbHVlOmZ1bmN0aW9uKHQsbil7cmV0dXJuIG4/dGhpcy5wcm9taXNlLnRoZW4odCxuKTp0aGlzLnByb21pc2UudGhlbih0KX19LHtrZXk6XCJjYXRjaFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnByb21pc2VbXCJjYXRjaFwiXSh0KX19LHtrZXk6XCJjYW5jZWxcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQ9ITB9fSx7a2V5OlwiYWx3YXlzXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5wcm9taXNlLnRoZW4odCx0KX19LHtrZXk6XCJfdGFza0NvbXBsZXRlZFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuaXNDYW5jZWxsYXRpb25SZXF1ZXN0ZWQ/KHRoaXMuaXNDYW5jZWxlZD0hMCx0aGlzLnJlamVjdChcIlRhc2sgaGFzIGJlZW4gY2FuY2VsZWRcIikpOnRoaXMucmVzb2x2ZSh0KX19XSksdH0oKX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMCksaT1lLm4ociksbz1lKDEpLHU9ZS5uKG8pO2UuZChuLFwiYVwiLGZ1bmN0aW9uKCl7cmV0dXJuIGF9KTt2YXIgYT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtpKCkodGhpcyx0KSx0aGlzLmRhdGE9e319cmV0dXJuIHUoKSh0LFt7a2V5OlwiZ2V0XCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIG49dGhpcy50b0ludGVybmFsS2V5KHQpO3JldHVybiB0aGlzLmhhcyh0KT90aGlzLmRhdGFbbl06dm9pZCAwfX0se2tleTpcImhhc1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5kYXRhLHRoaXMudG9JbnRlcm5hbEtleSh0KSl9fSx7a2V5Olwic2V0XCIsdmFsdWU6ZnVuY3Rpb24odCxuKXt0aGlzLmRhdGFbdGhpcy50b0ludGVybmFsS2V5KHQpXT1ufX0se2tleTpcImNsZWFyXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmRhdGE9e319fSx7a2V5OlwidG9JbnRlcm5hbEtleVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVyblwiQFwiK3R9fV0pLHR9KCl9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTI0KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMjYpLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7dC5leHBvcnRzPXtcImRlZmF1bHRcIjplKDEyNyksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTI4KSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe3QuZXhwb3J0cz17XCJkZWZhdWx0XCI6ZSgxMzApLF9fZXNNb2R1bGU6ITB9fSxmdW5jdGlvbih0LG4sZSl7dC5leHBvcnRzPXtcImRlZmF1bHRcIjplKDEzMiksX19lc01vZHVsZTohMH19LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9e1wiZGVmYXVsdFwiOmUoMTMzKSxfX2VzTW9kdWxlOiEwfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntcImRlZmF1bHRcIjp0fX1uLl9fZXNNb2R1bGU9ITA7dmFyIGk9ZSgzNyksbz1yKGkpLHU9ZSgxMTYpLGE9cih1KTtuW1wiZGVmYXVsdFwiXT1mdW5jdGlvbiBjKHQsbixlKXtudWxsPT09dCYmKHQ9RnVuY3Rpb24ucHJvdG90eXBlKTt2YXIgcj0oMCxhW1wiZGVmYXVsdFwiXSkodCxuKTtpZih2b2lkIDA9PT1yKXt2YXIgaT0oMCxvW1wiZGVmYXVsdFwiXSkodCk7cmV0dXJuIG51bGw9PT1pP3ZvaWQgMDpjKGksbixlKX1pZihcInZhbHVlXCJpbiByKXJldHVybiByLnZhbHVlO3ZhciB1PXIuZ2V0O2lmKHZvaWQgMCE9PXUpcmV0dXJuIHUuY2FsbChlKX19LGZ1bmN0aW9uKHQsbixlKXtlKDMyKSxlKDE1NiksdC5leHBvcnRzPWUoMikuQXJyYXkuZnJvbX0sZnVuY3Rpb24odCxuLGUpe2UoNTMpLGUoMzIpLHQuZXhwb3J0cz1lKDE1NSl9LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDIpLGk9ci5KU09OfHwoci5KU09OPXtzdHJpbmdpZnk6SlNPTi5zdHJpbmdpZnl9KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7cmV0dXJuIGkuc3RyaW5naWZ5LmFwcGx5KGksYXJndW1lbnRzKX19LGZ1bmN0aW9uKHQsbixlKXtlKDE1OCksdC5leHBvcnRzPWUoMikuT2JqZWN0LmFzc2lnbn0sZnVuY3Rpb24odCxuLGUpe2UoMTU5KTt2YXIgcj1lKDIpLk9iamVjdDt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXtyZXR1cm4gci5jcmVhdGUodCxuKX19LGZ1bmN0aW9uKHQsbixlKXtlKDE2MCk7dmFyIHI9ZSgyKS5PYmplY3Q7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHIuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbil9fSxmdW5jdGlvbih0LG4sZSl7ZSgxNjEpO3ZhciByPWUoMikuT2JqZWN0O3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gci5nZXRPd25Qcm9wZXJ0eU5hbWVzKHQpfX0sZnVuY3Rpb24odCxuLGUpe2UoMTYyKSx0LmV4cG9ydHM9ZSgyKS5PYmplY3QuZ2V0UHJvdG90eXBlT2Z9LGZ1bmN0aW9uKHQsbixlKXtlKDE2MyksdC5leHBvcnRzPWUoMikuT2JqZWN0LnNldFByb3RvdHlwZU9mfSxmdW5jdGlvbih0LG4sZSl7ZSg5MyksZSgzMiksZSg1MyksZSgxNjQpLHQuZXhwb3J0cz1lKDIpLlByb21pc2V9LGZ1bmN0aW9uKHQsbixlKXtlKDE2NSksZSg5MyksZSgxNjYpLGUoMTY3KSx0LmV4cG9ydHM9ZSgyKS5TeW1ib2x9LGZ1bmN0aW9uKHQsbixlKXtlKDMyKSxlKDUzKSx0LmV4cG9ydHM9ZSg1MSkuZihcIml0ZXJhdG9yXCIpfSxmdW5jdGlvbih0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbigpe319LGZ1bmN0aW9uKHQsbil7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlLHIpe2lmKCEodCBpbnN0YW5jZW9mIG4pfHx2b2lkIDAhPT1yJiZyIGluIHQpdGhyb3cgVHlwZUVycm9yKGUrXCI6IGluY29ycmVjdCBpbnZvY2F0aW9uIVwiKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDEyKSxpPWUoNDkpLG89ZSgxNTQpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24obixlLHUpe3ZhciBhLGM9cihuKSxzPWkoYy5sZW5ndGgpLGY9byh1LHMpO2lmKHQmJmUhPWUpe2Zvcig7cz5mOylpZihhPWNbZisrXSxhIT1hKXJldHVybiEwfWVsc2UgZm9yKDtzPmY7ZisrKWlmKCh0fHxmIGluIGMpJiZjW2ZdPT09ZSlyZXR1cm4gdHx8Znx8MDtyZXR1cm4hdCYmLTF9fX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoNiksaT1lKDE3KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuLGUpe24gaW4gdD9yLmYodCxuLGkoMCxlKSk6dFtuXT1lfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMjIpLGk9ZSg0NCksbz1lKDI3KTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIG49cih0KSxlPWkuZjtpZihlKWZvcih2YXIgdSxhPWUodCksYz1vLmYscz0wO2EubGVuZ3RoPnM7KWMuY2FsbCh0LHU9YVtzKytdKSYmbi5wdXNoKHUpO3JldHVybiBufX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTQpLGk9ZSg4Myksbz1lKDgyKSx1PWUoNyksYT1lKDQ5KSxjPWUoNTIpLHM9e30sZj17fSxuPXQuZXhwb3J0cz1mdW5jdGlvbih0LG4sZSxsLGgpe3ZhciBkLHYscCx5LG09aD9mdW5jdGlvbigpe3JldHVybiB0fTpjKHQpLGs9cihlLGwsbj8yOjEpLF89MDtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBtKXRocm93IFR5cGVFcnJvcih0K1wiIGlzIG5vdCBpdGVyYWJsZSFcIik7aWYobyhtKSl7Zm9yKGQ9YSh0Lmxlbmd0aCk7ZD5fO18rKylpZih5PW4/ayh1KHY9dFtfXSlbMF0sdlsxXSk6ayh0W19dKSx5PT09c3x8eT09PWYpcmV0dXJuIHl9ZWxzZSBmb3IocD1tLmNhbGwodCk7ISh2PXAubmV4dCgpKS5kb25lOylpZih5PWkocCxrLHYudmFsdWUsbikseT09PXN8fHk9PT1mKXJldHVybiB5fTtuLkJSRUFLPXMsbi5SRVRVUk49Zn0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuLGUpe3ZhciByPXZvaWQgMD09PWU7c3dpdGNoKG4ubGVuZ3RoKXtjYXNlIDA6cmV0dXJuIHI/dCgpOnQuY2FsbChlKTtjYXNlIDE6cmV0dXJuIHI/dChuWzBdKTp0LmNhbGwoZSxuWzBdKTtjYXNlIDI6cmV0dXJuIHI/dChuWzBdLG5bMV0pOnQuY2FsbChlLG5bMF0sblsxXSk7Y2FzZSAzOnJldHVybiByP3QoblswXSxuWzFdLG5bMl0pOnQuY2FsbChlLG5bMF0sblsxXSxuWzJdKTtjYXNlIDQ6cmV0dXJuIHI/dChuWzBdLG5bMV0sblsyXSxuWzNdKTp0LmNhbGwoZSxuWzBdLG5bMV0sblsyXSxuWzNdKX1yZXR1cm4gdC5hcHBseShlLG4pfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMjApO3QuZXhwb3J0cz1BcnJheS5pc0FycmF5fHxmdW5jdGlvbih0KXtyZXR1cm5cIkFycmF5XCI9PXIodCl9fSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSg0MiksaT1lKDE3KSxvPWUoMjgpLHU9e307ZSgxMCkodSxlKDQpKFwiaXRlcmF0b3JcIiksZnVuY3Rpb24oKXtyZXR1cm4gdGhpc30pLHQuZXhwb3J0cz1mdW5jdGlvbih0LG4sZSl7dC5wcm90b3R5cGU9cih1LHtuZXh0OmkoMSxlKX0pLG8odCxuK1wiIEl0ZXJhdG9yXCIpfX0sZnVuY3Rpb24odCxuKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXtyZXR1cm57dmFsdWU6bixkb25lOiEhdH19fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgyMiksaT1lKDEyKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXtmb3IodmFyIGUsbz1pKHQpLHU9cihvKSxhPXUubGVuZ3RoLGM9MDthPmM7KWlmKG9bZT11W2MrK11dPT09bilyZXR1cm4gZX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDMxKShcIm1ldGFcIiksaT1lKDExKSxvPWUoMTUpLHU9ZSg2KS5mLGE9MCxjPU9iamVjdC5pc0V4dGVuc2libGV8fGZ1bmN0aW9uKCl7cmV0dXJuITB9LHM9IWUoMTMpKGZ1bmN0aW9uKCl7cmV0dXJuIGMoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSl9KSxmPWZ1bmN0aW9uKHQpe3UodCxyLHt2YWx1ZTp7aTpcIk9cIisgKythLHc6e319fSl9LGw9ZnVuY3Rpb24odCxuKXtpZighaSh0KSlyZXR1cm5cInN5bWJvbFwiPT10eXBlb2YgdD90OihcInN0cmluZ1wiPT10eXBlb2YgdD9cIlNcIjpcIlBcIikrdDtpZighbyh0LHIpKXtpZighYyh0KSlyZXR1cm5cIkZcIjtpZighbilyZXR1cm5cIkVcIjtmKHQpfXJldHVybiB0W3JdLml9LGg9ZnVuY3Rpb24odCxuKXtpZighbyh0LHIpKXtpZighYyh0KSlyZXR1cm4hMDtpZighbilyZXR1cm4hMTtmKHQpfXJldHVybiB0W3JdLnd9LGQ9ZnVuY3Rpb24odCl7cmV0dXJuIHMmJnYuTkVFRCYmYyh0KSYmIW8odCxyKSYmZih0KSx0fSx2PXQuZXhwb3J0cz17S0VZOnIsTkVFRDohMSxmYXN0S2V5OmwsZ2V0V2VhazpoLG9uRnJlZXplOmR9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgzKSxpPWUoOTEpLnNldCxvPXIuTXV0YXRpb25PYnNlcnZlcnx8ci5XZWJLaXRNdXRhdGlvbk9ic2VydmVyLHU9ci5wcm9jZXNzLGE9ci5Qcm9taXNlLGM9XCJwcm9jZXNzXCI9PWUoMjApKHUpO3QuZXhwb3J0cz1mdW5jdGlvbigpe3ZhciB0LG4sZSxzPWZ1bmN0aW9uKCl7dmFyIHIsaTtmb3IoYyYmKHI9dS5kb21haW4pJiZyLmV4aXQoKTt0Oyl7aT10LmZuLHQ9dC5uZXh0O3RyeXtpKCl9Y2F0Y2gobyl7dGhyb3cgdD9lKCk6bj12b2lkIDAsb319bj12b2lkIDAsciYmci5lbnRlcigpfTtpZihjKWU9ZnVuY3Rpb24oKXt1Lm5leHRUaWNrKHMpfTtlbHNlIGlmKG8pe3ZhciBmPSEwLGw9ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7bmV3IG8ocykub2JzZXJ2ZShsLHtjaGFyYWN0ZXJEYXRhOiEwfSksZT1mdW5jdGlvbigpe2wuZGF0YT1mPSFmfX1lbHNlIGlmKGEmJmEucmVzb2x2ZSl7dmFyIGg9YS5yZXNvbHZlKCk7ZT1mdW5jdGlvbigpe2gudGhlbihzKX19ZWxzZSBlPWZ1bmN0aW9uKCl7aS5jYWxsKHIscyl9O3JldHVybiBmdW5jdGlvbihyKXt2YXIgaT17Zm46cixuZXh0OnZvaWQgMH07biYmKG4ubmV4dD1pKSx0fHwodD1pLGUoKSksbj1pfX19LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcj1lKDIyKSxpPWUoNDQpLG89ZSgyNyksdT1lKDI5KSxhPWUoODEpLGM9T2JqZWN0LmFzc2lnbjt0LmV4cG9ydHM9IWN8fGUoMTMpKGZ1bmN0aW9uKCl7dmFyIHQ9e30sbj17fSxlPVN5bWJvbCgpLHI9XCJhYmNkZWZnaGlqa2xtbm9wcXJzdFwiO3JldHVybiB0W2VdPTcsci5zcGxpdChcIlwiKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe25bdF09dH0pLDchPWMoe30sdClbZV18fE9iamVjdC5rZXlzKGMoe30sbikpLmpvaW4oXCJcIikhPXJ9KT9mdW5jdGlvbih0LG4pe2Zvcih2YXIgZT11KHQpLGM9YXJndW1lbnRzLmxlbmd0aCxzPTEsZj1pLmYsbD1vLmY7Yz5zOylmb3IodmFyIGgsZD1hKGFyZ3VtZW50c1tzKytdKSx2PWY/cihkKS5jb25jYXQoZihkKSk6cihkKSxwPXYubGVuZ3RoLHk9MDtwPnk7KWwuY2FsbChkLGg9dlt5KytdKSYmKGVbaF09ZFtoXSk7cmV0dXJuIGV9OmN9LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDYpLGk9ZSg3KSxvPWUoMjIpO3QuZXhwb3J0cz1lKDUpP09iamVjdC5kZWZpbmVQcm9wZXJ0aWVzOmZ1bmN0aW9uKHQsbil7aSh0KTtmb3IodmFyIGUsdT1vKG4pLGE9dS5sZW5ndGgsYz0wO2E+Yzspci5mKHQsZT11W2MrK10sbltlXSk7cmV0dXJuIHR9fSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSgxMCk7dC5leHBvcnRzPWZ1bmN0aW9uKHQsbixlKXtmb3IodmFyIGkgaW4gbillJiZ0W2ldP3RbaV09bltpXTpyKHQsaSxuW2ldKTtyZXR1cm4gdH19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDExKSxpPWUoNyksbz1mdW5jdGlvbih0LG4pe2lmKGkodCksIXIobikmJm51bGwhPT1uKXRocm93IFR5cGVFcnJvcihuK1wiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKX07dC5leHBvcnRzPXtzZXQ6T2JqZWN0LnNldFByb3RvdHlwZU9mfHwoXCJfX3Byb3RvX19cImlue30/ZnVuY3Rpb24odCxuLHIpe3RyeXtyPWUoMTQpKEZ1bmN0aW9uLmNhbGwsZSg0MykuZihPYmplY3QucHJvdG90eXBlLFwiX19wcm90b19fXCIpLnNldCwyKSxyKHQsW10pLG49ISh0IGluc3RhbmNlb2YgQXJyYXkpfWNhdGNoKGkpe249ITB9cmV0dXJuIGZ1bmN0aW9uKHQsZSl7cmV0dXJuIG8odCxlKSxuP3QuX19wcm90b19fPWU6cih0LGUpLHR9fSh7fSwhMSk6dm9pZCAwKSxjaGVjazpvfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMyksaT1lKDIpLG89ZSg2KSx1PWUoNSksYT1lKDQpKFwic3BlY2llc1wiKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCl7dmFyIG49XCJmdW5jdGlvblwiPT10eXBlb2YgaVt0XT9pW3RdOnJbdF07dSYmbiYmIW5bYV0mJm8uZihuLGEse2NvbmZpZ3VyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpc319KX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDcpLGk9ZSgyNCksbz1lKDQpKFwic3BlY2llc1wiKTt0LmV4cG9ydHM9ZnVuY3Rpb24odCxuKXt2YXIgZSx1PXIodCkuY29uc3RydWN0b3I7cmV0dXJuIHZvaWQgMD09PXV8fHZvaWQgMD09KGU9cih1KVtvXSk/bjppKGUpfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNDgpLGk9ZSgzOSk7dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbihuLGUpe3ZhciBvLHUsYT1TdHJpbmcoaShuKSksYz1yKGUpLHM9YS5sZW5ndGg7cmV0dXJuIGM8MHx8Yz49cz90P1wiXCI6dm9pZCAwOihvPWEuY2hhckNvZGVBdChjKSxvPDU1Mjk2fHxvPjU2MzE5fHxjKzE9PT1zfHwodT1hLmNoYXJDb2RlQXQoYysxKSk8NTYzMjB8fHU+NTczNDM/dD9hLmNoYXJBdChjKTpvOnQ/YS5zbGljZShjLGMrMik6KG8tNTUyOTY8PDEwKSsodS01NjMyMCkrNjU1MzYpfX19LGZ1bmN0aW9uKHQsbixlKXt2YXIgcj1lKDQ4KSxpPU1hdGgubWF4LG89TWF0aC5taW47dC5leHBvcnRzPWZ1bmN0aW9uKHQsbil7cmV0dXJuIHQ9cih0KSx0PDA/aSh0K24sMCk6byh0LG4pfX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoNyksaT1lKDUyKTt0LmV4cG9ydHM9ZSgyKS5nZXRJdGVyYXRvcj1mdW5jdGlvbih0KXt2YXIgbj1pKHQpO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4pdGhyb3cgVHlwZUVycm9yKHQrXCIgaXMgbm90IGl0ZXJhYmxlIVwiKTtyZXR1cm4gcihuLmNhbGwodCkpfX0sZnVuY3Rpb24odCxuLGUpe1widXNlIHN0cmljdFwiO3ZhciByPWUoMTQpLGk9ZSg4KSxvPWUoMjkpLHU9ZSg4MyksYT1lKDgyKSxjPWUoNDkpLHM9ZSgxMzcpLGY9ZSg1Mik7aShpLlMraS5GKiFlKDg1KShmdW5jdGlvbih0KXtBcnJheS5mcm9tKHQpfSksXCJBcnJheVwiLHtmcm9tOmZ1bmN0aW9uKHQpe3ZhciBuLGUsaSxsLGg9byh0KSxkPVwiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXM/dGhpczpBcnJheSx2PWFyZ3VtZW50cy5sZW5ndGgscD12PjE/YXJndW1lbnRzWzFdOnZvaWQgMCx5PXZvaWQgMCE9PXAsbT0wLGs9ZihoKTtpZih5JiYocD1yKHAsdj4yP2FyZ3VtZW50c1syXTp2b2lkIDAsMikpLHZvaWQgMD09a3x8ZD09QXJyYXkmJmEoaykpZm9yKG49YyhoLmxlbmd0aCksZT1uZXcgZChuKTtuPm07bSsrKXMoZSxtLHk/cChoW21dLG0pOmhbbV0pO2Vsc2UgZm9yKGw9ay5jYWxsKGgpLGU9bmV3IGQ7IShpPWwubmV4dCgpKS5kb25lO20rKylzKGUsbSx5P3UobCxwLFtpLnZhbHVlLG1dLCEwKTppLnZhbHVlKTtyZXR1cm4gZS5sZW5ndGg9bSxlfX0pfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgxMzQpLGk9ZSgxNDMpLG89ZSgyMSksdT1lKDEyKTt0LmV4cG9ydHM9ZSg4NCkoQXJyYXksXCJBcnJheVwiLGZ1bmN0aW9uKHQsbil7dGhpcy5fdD11KHQpLHRoaXMuX2k9MCx0aGlzLl9rPW59LGZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5fdCxuPXRoaXMuX2ssZT10aGlzLl9pKys7cmV0dXJuIXR8fGU+PXQubGVuZ3RoPyh0aGlzLl90PXZvaWQgMCxpKDEpKTpcImtleXNcIj09bj9pKDAsZSk6XCJ2YWx1ZXNcIj09bj9pKDAsdFtlXSk6aSgwLFtlLHRbZV1dKX0sXCJ2YWx1ZXNcIiksby5Bcmd1bWVudHM9by5BcnJheSxyKFwia2V5c1wiKSxyKFwidmFsdWVzXCIpLHIoXCJlbnRyaWVzXCIpfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg4KTtyKHIuUytyLkYsXCJPYmplY3RcIix7YXNzaWduOmUoMTQ3KX0pfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg4KTtyKHIuUyxcIk9iamVjdFwiLHtjcmVhdGU6ZSg0Mil9KX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMTIpLGk9ZSg0MykuZjtlKDQ1KShcImdldE93blByb3BlcnR5RGVzY3JpcHRvclwiLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQsbil7cmV0dXJuIGkocih0KSxuKX19KX0sZnVuY3Rpb24odCxuLGUpe2UoNDUpKFwiZ2V0T3duUHJvcGVydHlOYW1lc1wiLGZ1bmN0aW9uKCl7cmV0dXJuIGUoODYpLmZ9KX0sZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoMjkpLGk9ZSg4OCk7ZSg0NSkoXCJnZXRQcm90b3R5cGVPZlwiLGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBpKHIodCkpfX0pfSxmdW5jdGlvbih0LG4sZSl7dmFyIHI9ZSg4KTtyKHIuUyxcIk9iamVjdFwiLHtzZXRQcm90b3R5cGVPZjplKDE1MCkuc2V0fSl9LGZ1bmN0aW9uKHQsbixlKXtcInVzZSBzdHJpY3RcIjt2YXIgcixpLG8sdT1lKDI2KSxhPWUoMyksYz1lKDE0KSxzPWUoNzkpLGY9ZSg4KSxsPWUoMTEpLGg9ZSgyNCksZD1lKDEzNSksdj1lKDEzOSkscD1lKDE1MikseT1lKDkxKS5zZXQsbT1lKDE0NikoKSxrPVwiUHJvbWlzZVwiLF89YS5UeXBlRXJyb3IsZz1hLnByb2Nlc3Msdz1hW2tdLGc9YS5wcm9jZXNzLGI9XCJwcm9jZXNzXCI9PXMoZykseD1mdW5jdGlvbigpe30sTz0hIWZ1bmN0aW9uKCl7dHJ5e3ZhciB0PXcucmVzb2x2ZSgxKSxuPSh0LmNvbnN0cnVjdG9yPXt9KVtlKDQpKFwic3BlY2llc1wiKV09ZnVuY3Rpb24odCl7dCh4LHgpfTtyZXR1cm4oYnx8XCJmdW5jdGlvblwiPT10eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50KSYmdC50aGVuKHgpaW5zdGFuY2VvZiBufWNhdGNoKHIpe319KCksUD1mdW5jdGlvbih0LG4pe3JldHVybiB0PT09bnx8dD09PXcmJm49PT1vfSxJPWZ1bmN0aW9uKHQpe3ZhciBuO3JldHVybiEoIWwodCl8fFwiZnVuY3Rpb25cIiE9dHlwZW9mKG49dC50aGVuKSkmJm59LFM9ZnVuY3Rpb24odCl7cmV0dXJuIFAodyx0KT9uZXcgRSh0KTpuZXcgaSh0KX0sRT1pPWZ1bmN0aW9uKHQpe3ZhciBuLGU7dGhpcy5wcm9taXNlPW5ldyB0KGZ1bmN0aW9uKHQscil7aWYodm9pZCAwIT09bnx8dm9pZCAwIT09ZSl0aHJvdyBfKFwiQmFkIFByb21pc2UgY29uc3RydWN0b3JcIik7bj10LGU9cn0pLHRoaXMucmVzb2x2ZT1oKG4pLHRoaXMucmVqZWN0PWgoZSl9LFQ9ZnVuY3Rpb24odCl7dHJ5e3QoKX1jYXRjaChuKXtyZXR1cm57ZXJyb3I6bn19fSxqPWZ1bmN0aW9uKHQsbil7aWYoIXQuX24pe3QuX249ITA7dmFyIGU9dC5fYzttKGZ1bmN0aW9uKCl7Zm9yKHZhciByPXQuX3YsaT0xPT10Ll9zLG89MCx1PWZ1bmN0aW9uKG4pe3ZhciBlLG8sdT1pP24ub2s6bi5mYWlsLGE9bi5yZXNvbHZlLGM9bi5yZWplY3Qscz1uLmRvbWFpbjt0cnl7dT8oaXx8KDI9PXQuX2gmJkModCksdC5faD0xKSx1PT09ITA/ZT1yOihzJiZzLmVudGVyKCksZT11KHIpLHMmJnMuZXhpdCgpKSxlPT09bi5wcm9taXNlP2MoXyhcIlByb21pc2UtY2hhaW4gY3ljbGVcIikpOihvPUkoZSkpP28uY2FsbChlLGEsYyk6YShlKSk6YyhyKX1jYXRjaChmKXtjKGYpfX07ZS5sZW5ndGg+bzspdShlW28rK10pO3QuX2M9W10sdC5fbj0hMSxuJiYhdC5faCYmTSh0KX0pfX0sTT1mdW5jdGlvbih0KXt5LmNhbGwoYSxmdW5jdGlvbigpe3ZhciBuLGUscixpPXQuX3Y7aWYoRih0KSYmKG49VChmdW5jdGlvbigpe2I/Zy5lbWl0KFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsaSx0KTooZT1hLm9udW5oYW5kbGVkcmVqZWN0aW9uKT9lKHtwcm9taXNlOnQscmVhc29uOml9KToocj1hLmNvbnNvbGUpJiZyLmVycm9yJiZyLmVycm9yKFwiVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uXCIsaSl9KSx0Ll9oPWJ8fEYodCk/MjoxKSx0Ll9hPXZvaWQgMCxuKXRocm93IG4uZXJyb3J9KX0sRj1mdW5jdGlvbih0KXtpZigxPT10Ll9oKXJldHVybiExO2Zvcih2YXIgbixlPXQuX2F8fHQuX2Mscj0wO2UubGVuZ3RoPnI7KWlmKG49ZVtyKytdLG4uZmFpbHx8IUYobi5wcm9taXNlKSlyZXR1cm4hMTtyZXR1cm4hMH0sQz1mdW5jdGlvbih0KXt5LmNhbGwoYSxmdW5jdGlvbigpe3ZhciBuO2I/Zy5lbWl0KFwicmVqZWN0aW9uSGFuZGxlZFwiLHQpOihuPWEub25yZWplY3Rpb25oYW5kbGVkKSYmbih7cHJvbWlzZTp0LHJlYXNvbjp0Ll92fSl9KX0sQT1mdW5jdGlvbih0KXt2YXIgbj10aGlzO24uX2R8fChuLl9kPSEwLG49bi5fd3x8bixuLl92PXQsbi5fcz0yLG4uX2F8fChuLl9hPW4uX2Muc2xpY2UoKSksaihuLCEwKSl9LFI9ZnVuY3Rpb24odCl7dmFyIG4sZT10aGlzO2lmKCFlLl9kKXtlLl9kPSEwLGU9ZS5fd3x8ZTt0cnl7aWYoZT09PXQpdGhyb3cgXyhcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpOyhuPUkodCkpP20oZnVuY3Rpb24oKXt2YXIgcj17X3c6ZSxfZDohMX07dHJ5e24uY2FsbCh0LGMoUixyLDEpLGMoQSxyLDEpKX1jYXRjaChpKXtBLmNhbGwocixpKX19KTooZS5fdj10LGUuX3M9MSxqKGUsITEpKX1jYXRjaChyKXtBLmNhbGwoe193OmUsX2Q6ITF9LHIpfX19O098fCh3PWZ1bmN0aW9uKHQpe2QodGhpcyx3LGssXCJfaFwiKSxoKHQpLHIuY2FsbCh0aGlzKTt0cnl7dChjKFIsdGhpcywxKSxjKEEsdGhpcywxKSl9Y2F0Y2gobil7QS5jYWxsKHRoaXMsbil9fSxyPWZ1bmN0aW9uKHQpe3RoaXMuX2M9W10sdGhpcy5fYT12b2lkIDAsdGhpcy5fcz0wLHRoaXMuX2Q9ITEsdGhpcy5fdj12b2lkIDAsdGhpcy5faD0wLHRoaXMuX249ITF9LHIucHJvdG90eXBlPWUoMTQ5KSh3LnByb3RvdHlwZSx7dGhlbjpmdW5jdGlvbih0LG4pe3ZhciBlPVMocCh0aGlzLHcpKTtyZXR1cm4gZS5vaz1cImZ1bmN0aW9uXCIhPXR5cGVvZiB0fHx0LGUuZmFpbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZuLGUuZG9tYWluPWI/Zy5kb21haW46dm9pZCAwLHRoaXMuX2MucHVzaChlKSx0aGlzLl9hJiZ0aGlzLl9hLnB1c2goZSksdGhpcy5fcyYmaih0aGlzLCExKSxlLnByb21pc2V9LFwiY2F0Y2hcIjpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy50aGVuKHZvaWQgMCx0KX19KSxFPWZ1bmN0aW9uKCl7dmFyIHQ9bmV3IHI7dGhpcy5wcm9taXNlPXQsdGhpcy5yZXNvbHZlPWMoUix0LDEpLHRoaXMucmVqZWN0PWMoQSx0LDEpfSksZihmLkcrZi5XK2YuRiohTyx7UHJvbWlzZTp3fSksZSgyOCkodyxrKSxlKDE1MSkoayksbz1lKDIpW2tdLGYoZi5TK2YuRiohTyxrLHtyZWplY3Q6ZnVuY3Rpb24odCl7dmFyIG49Uyh0aGlzKSxlPW4ucmVqZWN0O3JldHVybiBlKHQpLG4ucHJvbWlzZX19KSxmKGYuUytmLkYqKHV8fCFPKSxrLHtyZXNvbHZlOmZ1bmN0aW9uKHQpe2lmKHQgaW5zdGFuY2VvZiB3JiZQKHQuY29uc3RydWN0b3IsdGhpcykpcmV0dXJuIHQ7dmFyIG49Uyh0aGlzKSxlPW4ucmVzb2x2ZTtyZXR1cm4gZSh0KSxuLnByb21pc2V9fSksZihmLlMrZi5GKiEoTyYmZSg4NSkoZnVuY3Rpb24odCl7dy5hbGwodClbXCJjYXRjaFwiXSh4KX0pKSxrLHthbGw6ZnVuY3Rpb24odCl7dmFyIG49dGhpcyxlPVMobikscj1lLnJlc29sdmUsaT1lLnJlamVjdCxvPVQoZnVuY3Rpb24oKXt2YXIgZT1bXSxvPTAsdT0xO3YodCwhMSxmdW5jdGlvbih0KXt2YXIgYT1vKyssYz0hMTtlLnB1c2godm9pZCAwKSx1Kyssbi5yZXNvbHZlKHQpLnRoZW4oZnVuY3Rpb24odCl7Y3x8KGM9ITAsZVthXT10LC0tdXx8cihlKSl9LGkpfSksLS11fHxyKGUpfSk7cmV0dXJuIG8mJmkoby5lcnJvciksZS5wcm9taXNlfSxyYWNlOmZ1bmN0aW9uKHQpe3ZhciBuPXRoaXMsZT1TKG4pLHI9ZS5yZWplY3QsaT1UKGZ1bmN0aW9uKCl7dih0LCExLGZ1bmN0aW9uKHQpe24ucmVzb2x2ZSh0KS50aGVuKGUucmVzb2x2ZSxyKX0pfSk7cmV0dXJuIGkmJnIoaS5lcnJvciksZS5wcm9taXNlfX0pfSxmdW5jdGlvbih0LG4sZSl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZSgzKSxpPWUoMTUpLG89ZSg1KSx1PWUoOCksYT1lKDkwKSxjPWUoMTQ1KS5LRVkscz1lKDEzKSxmPWUoNDcpLGw9ZSgyOCksaD1lKDMxKSxkPWUoNCksdj1lKDUxKSxwPWUoNTApLHk9ZSgxNDQpLG09ZSgxMzgpLGs9ZSgxNDEpLF89ZSg3KSxnPWUoMTIpLHc9ZSgzMCksYj1lKDE3KSx4PWUoNDIpLE89ZSg4NiksUD1lKDQzKSxJPWUoNiksUz1lKDIyKSxFPVAuZixUPUkuZixqPU8uZixNPXIuU3ltYm9sLEY9ci5KU09OLEM9RiYmRi5zdHJpbmdpZnksQT1cInByb3RvdHlwZVwiLFI9ZChcIl9oaWRkZW5cIiksej1kKFwidG9QcmltaXRpdmVcIiksTD17fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxXPWYoXCJzeW1ib2wtcmVnaXN0cnlcIiksTj1mKFwic3ltYm9sc1wiKSxEPWYoXCJvcC1zeW1ib2xzXCIpLFU9T2JqZWN0W0FdLEo9XCJmdW5jdGlvblwiPT10eXBlb2YgTSxxPXIuUU9iamVjdCxCPSFxfHwhcVtBXXx8IXFbQV0uZmluZENoaWxkLEs9byYmcyhmdW5jdGlvbigpe3JldHVybiA3IT14KFQoe30sXCJhXCIse2dldDpmdW5jdGlvbigpe3JldHVybiBUKHRoaXMsXCJhXCIse3ZhbHVlOjd9KS5hfX0pKS5hfSk/ZnVuY3Rpb24odCxuLGUpe3ZhciByPUUoVSxuKTtyJiZkZWxldGUgVVtuXSxUKHQsbixlKSxyJiZ0IT09VSYmVChVLG4scil9OlQsRz1mdW5jdGlvbih0KXt2YXIgbj1OW3RdPXgoTVtBXSk7cmV0dXJuIG4uX2s9dCxufSxZPUomJlwic3ltYm9sXCI9PXR5cGVvZiBNLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVyblwic3ltYm9sXCI9PXR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIE19LEg9ZnVuY3Rpb24odCxuLGUpe3JldHVybiB0PT09VSYmSChELG4sZSksXyh0KSxuPXcobiwhMCksXyhlKSxpKE4sbik/KGUuZW51bWVyYWJsZT8oaSh0LFIpJiZ0W1JdW25dJiYodFtSXVtuXT0hMSksZT14KGUse2VudW1lcmFibGU6YigwLCExKX0pKTooaSh0LFIpfHxUKHQsUixiKDEse30pKSx0W1JdW25dPSEwKSxLKHQsbixlKSk6VCh0LG4sZSl9LFY9ZnVuY3Rpb24odCxuKXtfKHQpO2Zvcih2YXIgZSxyPW0obj1nKG4pKSxpPTAsbz1yLmxlbmd0aDtvPmk7KUgodCxlPXJbaSsrXSxuW2VdKTtyZXR1cm4gdH0sWD1mdW5jdGlvbih0LG4pe3JldHVybiB2b2lkIDA9PT1uP3godCk6Vih4KHQpLG4pfSxRPWZ1bmN0aW9uKHQpe3ZhciBuPUwuY2FsbCh0aGlzLHQ9dyh0LCEwKSk7cmV0dXJuISh0aGlzPT09VSYmaShOLHQpJiYhaShELHQpKSYmKCEobnx8IWkodGhpcyx0KXx8IWkoTix0KXx8aSh0aGlzLFIpJiZ0aGlzW1JdW3RdKXx8bil9LFo9ZnVuY3Rpb24odCxuKXtpZih0PWcodCksbj13KG4sITApLHQhPT1VfHwhaShOLG4pfHxpKEQsbikpe3ZhciBlPUUodCxuKTtyZXR1cm4hZXx8IWkoTixuKXx8aSh0LFIpJiZ0W1JdW25dfHwoZS5lbnVtZXJhYmxlPSEwKSxlfX0sJD1mdW5jdGlvbih0KXtmb3IodmFyIG4sZT1qKGcodCkpLHI9W10sbz0wO2UubGVuZ3RoPm87KWkoTixuPWVbbysrXSl8fG49PVJ8fG49PWN8fHIucHVzaChuKTtyZXR1cm4gcn0sdHQ9ZnVuY3Rpb24odCl7Zm9yKHZhciBuLGU9dD09PVUscj1qKGU/RDpnKHQpKSxvPVtdLHU9MDtyLmxlbmd0aD51OykhaShOLG49clt1KytdKXx8ZSYmIWkoVSxuKXx8by5wdXNoKE5bbl0pO3JldHVybiBvfTtKfHwoTT1mdW5jdGlvbigpe2lmKHRoaXMgaW5zdGFuY2VvZiBNKXRocm93IFR5cGVFcnJvcihcIlN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciFcIik7dmFyIHQ9aChhcmd1bWVudHMubGVuZ3RoPjA/YXJndW1lbnRzWzBdOnZvaWQgMCksbj1mdW5jdGlvbihlKXt0aGlzPT09VSYmbi5jYWxsKEQsZSksaSh0aGlzLFIpJiZpKHRoaXNbUl0sdCkmJih0aGlzW1JdW3RdPSExKSxLKHRoaXMsdCxiKDEsZSkpfTtyZXR1cm4gbyYmQiYmSyhVLHQse2NvbmZpZ3VyYWJsZTohMCxzZXQ6bn0pLEcodCl9LGEoTVtBXSxcInRvU3RyaW5nXCIsZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fa30pLFAuZj1aLEkuZj1ILGUoODcpLmY9Ty5mPSQsZSgyNykuZj1RLGUoNDQpLmY9dHQsbyYmIWUoMjYpJiZhKFUsXCJwcm9wZXJ0eUlzRW51bWVyYWJsZVwiLFEsITApLHYuZj1mdW5jdGlvbih0KXtyZXR1cm4gRyhkKHQpKX0pLHUodS5HK3UuVyt1LkYqIUose1N5bWJvbDpNfSk7Zm9yKHZhciBudD1cImhhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzXCIuc3BsaXQoXCIsXCIpLGV0PTA7bnQubGVuZ3RoPmV0OylkKG50W2V0KytdKTtmb3IodmFyIG50PVMoZC5zdG9yZSksZXQ9MDtudC5sZW5ndGg+ZXQ7KXAobnRbZXQrK10pO3UodS5TK3UuRiohSixcIlN5bWJvbFwiLHtcImZvclwiOmZ1bmN0aW9uKHQpe3JldHVybiBpKFcsdCs9XCJcIik/V1t0XTpXW3RdPU0odCl9LGtleUZvcjpmdW5jdGlvbih0KXtpZihZKHQpKXJldHVybiB5KFcsdCk7dGhyb3cgVHlwZUVycm9yKHQrXCIgaXMgbm90IGEgc3ltYm9sIVwiKX0sdXNlU2V0dGVyOmZ1bmN0aW9uKCl7Qj0hMH0sdXNlU2ltcGxlOmZ1bmN0aW9uKCl7Qj0hMX19KSx1KHUuUyt1LkYqIUosXCJPYmplY3RcIix7Y3JlYXRlOlgsZGVmaW5lUHJvcGVydHk6SCxkZWZpbmVQcm9wZXJ0aWVzOlYsZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOlosZ2V0T3duUHJvcGVydHlOYW1lczokLGdldE93blByb3BlcnR5U3ltYm9sczp0dH0pLEYmJnUodS5TK3UuRiooIUp8fHMoZnVuY3Rpb24oKXt2YXIgdD1NKCk7cmV0dXJuXCJbbnVsbF1cIiE9QyhbdF0pfHxcInt9XCIhPUMoe2E6dH0pfHxcInt9XCIhPUMoT2JqZWN0KHQpKX0pKSxcIkpTT05cIix7c3RyaW5naWZ5OmZ1bmN0aW9uKHQpe2lmKHZvaWQgMCE9PXQmJiFZKHQpKXtmb3IodmFyIG4sZSxyPVt0XSxpPTE7YXJndW1lbnRzLmxlbmd0aD5pOylyLnB1c2goYXJndW1lbnRzW2krK10pO3JldHVybiBuPXJbMV0sXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKGU9biksIWUmJmsobil8fChuPWZ1bmN0aW9uKHQsbil7aWYoZSYmKG49ZS5jYWxsKHRoaXMsdCxuKSksIVkobikpcmV0dXJuIG59KSxyWzFdPW4sQy5hcHBseShGLHIpfX19KSxNW0FdW3pdfHxlKDEwKShNW0FdLHosTVtBXS52YWx1ZU9mKSxsKE0sXCJTeW1ib2xcIiksbChNYXRoLFwiTWF0aFwiLCEwKSxsKHIuSlNPTixcIkpTT05cIiwhMCl9LGZ1bmN0aW9uKHQsbixlKXtlKDUwKShcImFzeW5jSXRlcmF0b3JcIil9LGZ1bmN0aW9uKHQsbixlKXtlKDUwKShcIm9ic2VydmFibGVcIil9LGZ1bmN0aW9uKHQsbixlKXt0LmV4cG9ydHM9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IFdvcmtlcihlLnArXCJ3b3JrZXItc2xhdmUucGFyYWxsZWwuanNcIil9fSwsZnVuY3Rpb24odCxuLGUpe3ZhciByPWUoOTkpW1wiZGVmYXVsdFwiXTt0LmV4cG9ydHM9cn1dKSl9KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJyb3dzZXItY29tbW9uanMucGFyYWxsZWwuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3BhcmFsbGVsLWVzL2Rpc3QvYnJvd3Nlci1jb21tb25qcy5wYXJhbGxlbC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDIiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ29vcmRpbmF0ZSB7XG4gICAgcmVhZG9ubHkgeDogbnVtYmVyO1xuICAgIHJlYWRvbmx5IHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJS25pZ2h0VG91ckVudmlyb25tZW50IHtcbiAgICBib2FyZFNpemU6IG51bWJlcjtcbiAgICBib2FyZDogbnVtYmVyW107XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVudmlyb25tZW50KGJvYXJkU2l6ZTogbnVtYmVyKTogSUtuaWdodFRvdXJFbnZpcm9ubWVudCB7XG4gICAgY29uc3QgYm9hcmQ6IG51bWJlcltdID0gbmV3IEFycmF5KGJvYXJkU2l6ZSAqIGJvYXJkU2l6ZSk7XG4gICAgYm9hcmQuZmlsbCgwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBib2FyZCxcbiAgICAgICAgYm9hcmRTaXplXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtuaWdodFRvdXJzKHN0YXJ0UGF0aDogSUNvb3JkaW5hdGVbXSwgZW52aXJvbm1lbnQ6IElLbmlnaHRUb3VyRW52aXJvbm1lbnQpOiBudW1iZXIge1xuICAgIGNvbnN0IG1vdmVzID0gW1xuICAgICAgICB7IHg6IC0yLCB5OiAtMSB9LCB7IHg6IC0yLCB5OiAxfSwgeyB4OiAtMSwgeTogLTIgfSwgeyB4OiAtMSwgeTogMiB9LFxuICAgICAgICB7IHg6IDEsIHk6IC0yIH0sIHsgeDogMSwgeTogMn0sIHsgeDogMiwgeTogLTEgfSwgeyB4OiAyLCB5OiAxIH1cbiAgICBdO1xuICAgIGNvbnN0IGJvYXJkU2l6ZSA9IGVudmlyb25tZW50LmJvYXJkU2l6ZTtcbiAgICBjb25zdCBib2FyZCA9IGVudmlyb25tZW50LmJvYXJkO1xuICAgIGNvbnN0IG51bWJlck9mRmllbGRzID0gYm9hcmRTaXplICogYm9hcmRTaXplO1xuICAgIGxldCByZXN1bHRzOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiB7IGNvb3JkaW5hdGU6IElDb29yZGluYXRlLCBuOiBudW1iZXIgfVtdID0gc3RhcnRQYXRoLm1hcCgocG9zLCBpbmRleCkgPT4gKHsgY29vcmRpbmF0ZTogcG9zLCBuOiBpbmRleCArIDEgfSkpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0UGF0aC5sZW5ndGggLSAxOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBzdGFydFBhdGhbaW5kZXhdLnggKiBib2FyZFNpemUgKyBzdGFydFBhdGhbaW5kZXhdLnk7XG4gICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZSwgbiB9ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBjb29yZGluYXRlLnggKiBib2FyZFNpemUgKyBjb29yZGluYXRlLnk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2ZpZWxkSW5kZXhdICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBiYWNrIHRyYWNraW5nXG4gICAgICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IDA7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW50cnlcbiAgICAgICAgaWYgKG4gPT09IG51bWJlck9mRmllbGRzKSB7XG4gICAgICAgICAgICArK3Jlc3VsdHM7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBuITtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vdmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gbW92ZXNbaV07XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3IgPSB7IHg6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55IH07XG4gICAgICAgICAgICAvLyBub3Qgb3V0c2lkZSBvZiBib2FyZCBhbmQgbm90IHlldCBhY2Nlc3NlZFxuICAgICAgICAgICAgY29uc3QgYWNjZXNzaWJsZSA9IHN1Y2Nlc3Nvci54ID49IDAgJiYgc3VjY2Vzc29yLnkgPj0gMCAmJiBzdWNjZXNzb3IueCA8IGJvYXJkU2l6ZSAmJiAgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiYgYm9hcmRbc3VjY2Vzc29yLnggKiBib2FyZFNpemUgKyBzdWNjZXNzb3IueV0gPT09IDA7XG5cbiAgICAgICAgICAgIGlmIChhY2Nlc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaCh7IGNvb3JkaW5hdGU6IHN1Y2Nlc3NvciwgbjogbiArIDEgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsS25pZ2h0VG91cnMoc3RhcnQ6IElDb29yZGluYXRlLCBib2FyZFNpemU6IG51bWJlciwgb3B0aW9ucz86IElQYXJhbGxlbE9wdGlvbnMpOiBQcm9taXNlTGlrZTxudW1iZXI+IHtcblxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3NvcnMoY29vcmRpbmF0ZTogSUNvb3JkaW5hdGUpIHtcbiAgICAgICAgY29uc3QgbW92ZXMgPSBbXG4gICAgICAgICAgICB7eDogLTIsIHk6IC0xfSwge3g6IC0yLCB5OiAxfSwge3g6IC0xLCB5OiAtMn0sIHt4OiAtMSwgeTogMn0sXG4gICAgICAgICAgICB7eDogMSwgeTogLTJ9LCB7eDogMSwgeTogMn0sIHt4OiAyLCB5OiAtMX0sIHt4OiAyLCB5OiAxfVxuICAgICAgICBdO1xuICAgICAgICBjb25zdCByZXN1bHQ6IElDb29yZGluYXRlW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IG1vdmUgb2YgbW92ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NvciA9IHt4OiBjb29yZGluYXRlLnggKyBtb3ZlLngsIHk6IGNvb3JkaW5hdGUueSArIG1vdmUueX07XG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NpYmxlID0gc3VjY2Vzc29yLnggPj0gMCAmJiBzdWNjZXNzb3IueSA+PSAwICYmIHN1Y2Nlc3Nvci54IDwgYm9hcmRTaXplICYmIHN1Y2Nlc3Nvci55IDwgYm9hcmRTaXplICYmXG4gICAgICAgICAgICAgICAgKHN1Y2Nlc3Nvci54ICE9PSBzdGFydC54IHx8IHN1Y2Nlc3Nvci55ICE9PSBzdGFydC55KSAmJiAoc3VjY2Vzc29yLnggIT09IGNvb3JkaW5hdGUueCAmJiBzdWNjZXNzb3IueSAhPT0gY29vcmRpbmF0ZS55KTtcbiAgICAgICAgICAgIGlmIChhY2Nlc3NpYmxlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goc3VjY2Vzc29yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZVN0YXJ0RmllbGRzKCkge1xuICAgICAgICBjb25zdCByZXN1bHQ6IElDb29yZGluYXRlW11bXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGRpcmVjdFN1Y2Nlc3NvciBvZiBzdWNjZXNzb3JzKHN0YXJ0KSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpbmRpcmVjdFN1Y2Nlc3NvciBvZiBzdWNjZXNzb3JzKGRpcmVjdFN1Y2Nlc3NvcikpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChbc3RhcnQsIGRpcmVjdFN1Y2Nlc3NvciwgaW5kaXJlY3RTdWNjZXNzb3JdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgbGV0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAuZnJvbShjb21wdXRlU3RhcnRGaWVsZHMoKSwgb3B0aW9ucylcbiAgICAgICAgLmluRW52aXJvbm1lbnQoY3JlYXRlRW52aXJvbm1lbnQsIGJvYXJkU2l6ZSlcbiAgICAgICAgLm1hcChrbmlnaHRUb3VycylcbiAgICAgICAgLnJlZHVjZSgwLCAobWVtbywgY291bnQpID0+IG1lbW8gKyBjb3VudClcbiAgICAgICAgLnN1YnNjcmliZShzdWJSZXN1bHRzID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdG91cnMgb2Ygc3ViUmVzdWx0cykge1xuICAgICAgICAgICAgICAgIHRvdGFsICs9IHRvdXJzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tY29uc29sZSAqL1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7dG90YWwgLyAocGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFRpbWUpICogMTAwMH0gcmVzdWx0cyBwZXIgc2Vjb25kYCk7XG4gICAgICAgIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2R5bmFtaWMva25pZ2h0cy10b3VyLnRzIiwiaW1wb3J0IHBhcmFsbGVsLCB7SVBhcmFsbGVsT3B0aW9uc30gZnJvbSBcInBhcmFsbGVsLWVzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbXBsZXhOdW1iZXIge1xuICAgIGk6IG51bWJlcjtcbiAgICByZWFsOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1hbmRlbGJyb3RPcHRpb25zIHtcbiAgICBpbWFnZUhlaWdodDogbnVtYmVyO1xuICAgIGltYWdlV2lkdGg6IG51bWJlcjtcbiAgICBpdGVyYXRpb25zOiBudW1iZXI7XG4gICAgbWF4OiBJQ29tcGxleE51bWJlcjtcbiAgICBtaW46IElDb21wbGV4TnVtYmVyO1xuICAgIHNjYWxpbmdGYWN0b3I6IElDb21wbGV4TnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWFuZGVsT3B0aW9ucyhpbWFnZVdpZHRoOiBudW1iZXIsIGltYWdlSGVpZ2h0OiBudW1iZXIsIGl0ZXJhdGlvbnM6IG51bWJlcik6IElNYW5kZWxicm90T3B0aW9ucyB7XG4gICAgLy8gWCBheGlzIHNob3dzIHJlYWwgbnVtYmVycywgeSBheGlzIGltYWdpbmFyeVxuICAgIGNvbnN0IG1pbiA9IHsgaTogLTEuMiwgcmVhbDogLTIuMCB9O1xuICAgIGNvbnN0IG1heCA9IHsgaTogMCwgcmVhbDogMS4wIH07XG4gICAgbWF4LmkgPSBtaW4uaSArIChtYXgucmVhbCAtIG1pbi5yZWFsKSAqIGltYWdlSGVpZ2h0IC8gaW1hZ2VXaWR0aDtcblxuICAgIGNvbnN0IHNjYWxpbmdGYWN0b3IgPSB7XG4gICAgICAgIGk6IChtYXguaSAtIG1pbi5pKSAvIChpbWFnZUhlaWdodCAtIDEpLFxuICAgICAgICByZWFsOiAobWF4LnJlYWwgLSBtaW4ucmVhbCkgLyAoaW1hZ2VXaWR0aCAtIDEpXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGltYWdlSGVpZ2h0LFxuICAgICAgICBpbWFnZVdpZHRoLFxuICAgICAgICBpdGVyYXRpb25zLFxuICAgICAgICBtYXgsXG4gICAgICAgIG1pbixcbiAgICAgICAgc2NhbGluZ0ZhY3RvclxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wdXRlTWFuZGVsYnJvdExpbmUoeTogbnVtYmVyLCBvcHRpb25zOiBJTWFuZGVsYnJvdE9wdGlvbnMpOiBVaW50OENsYW1wZWRBcnJheSB7XG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlWihjOiBJQ29tcGxleE51bWJlcik6IHsgejogSUNvbXBsZXhOdW1iZXIsIG46IG51bWJlciB9IHtcbiAgICAgICAgY29uc3QgeiA9IHsgaTogYy5pLCByZWFsOiBjLnJlYWwgfTtcbiAgICAgICAgbGV0IG4gPSAwO1xuXG4gICAgICAgIGZvciAoOyBuIDwgb3B0aW9ucy5pdGVyYXRpb25zOyArK24pIHtcbiAgICAgICAgICAgIGlmICh6LnJlYWwgKiogMiArIHouaSAqKiAyID4gNCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB6ICoqIDIgKyBjXG4gICAgICAgICAgICBjb25zdCB6SSA9IHouaTtcbiAgICAgICAgICAgIHouaSA9IDIgKiB6LnJlYWwgKiB6LmkgKyBjLmk7XG4gICAgICAgICAgICB6LnJlYWwgPSB6LnJlYWwgKiogMiAtIHpJICoqIDIgKyBjLnJlYWw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyB6LCBuIH07XG4gICAgfVxuXG4gICAgY29uc3QgbGluZSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShvcHRpb25zLmltYWdlV2lkdGggKiA0KTtcbiAgICBjb25zdCBjSSA9IG9wdGlvbnMubWF4LmkgLSB5ICogb3B0aW9ucy5zY2FsaW5nRmFjdG9yLmk7XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG9wdGlvbnMuaW1hZ2VXaWR0aDsgKyt4KSB7XG4gICAgICAgIGNvbnN0IGMgPSB7XG4gICAgICAgICAgICBpOiBjSSxcbiAgICAgICAgICAgIHJlYWw6IG9wdGlvbnMubWluLnJlYWwgKyB4ICogb3B0aW9ucy5zY2FsaW5nRmFjdG9yLnJlYWxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB7IG4gfSA9IGNhbGN1bGF0ZVooYyk7XG4gICAgICAgIGNvbnN0IGJhc2UgPSB4ICogNDtcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xuICAgICAgICBsaW5lW2Jhc2VdID0gbiAmIDB4RkY7XG4gICAgICAgIGxpbmVbYmFzZSArIDFdID0gbiAmIDB4RkYwMDtcbiAgICAgICAgbGluZVtiYXNlICsgMl0gPSBuICYgMHhGRjAwMDA7XG4gICAgICAgIGxpbmVbYmFzZSArIDNdID0gMjU1O1xuICAgIH1cbiAgICByZXR1cm4gbGluZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9uczogSU1hbmRlbGJyb3RPcHRpb25zLCBvcHRpb25zPzogSVBhcmFsbGVsT3B0aW9ucykge1xuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAucmFuZ2UoMCwgbWFuZGVsYnJvdE9wdGlvbnMuaW1hZ2VIZWlnaHQsIDEsIG9wdGlvbnMpXG4gICAgICAgIC5pbkVudmlyb25tZW50KG1hbmRlbGJyb3RPcHRpb25zKVxuICAgICAgICAubWFwKGNvbXB1dGVNYW5kZWxicm90TGluZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW5jTWFuZGVsYnJvdChtYW5kZWxicm90T3B0aW9uczogSU1hbmRlbGJyb3RPcHRpb25zLCBjYWxsYmFjazogKGxpbmU6IFVpbnQ4Q2xhbXBlZEFycmF5LCB5OiBudW1iZXIpID0+IHZvaWQpIHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IG1hbmRlbGJyb3RPcHRpb25zLmltYWdlSGVpZ2h0OyArK3kpIHtcbiAgICAgICAgY29uc3QgbGluZSA9IGNvbXB1dGVNYW5kZWxicm90TGluZSh5LCBtYW5kZWxicm90T3B0aW9ucyk7XG4gICAgICAgIGNhbGxiYWNrKGxpbmUsIHkpO1xuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9keW5hbWljL21hbmRlbGJyb3QudHMiLCJpbXBvcnQgcGFyYWxsZWwgZnJvbSBcInBhcmFsbGVsLWVzXCI7XG5pbXBvcnQge0RpY3Rpb25hcnl9IGZyb20gXCJsb2Rhc2hcIjtcblxuLyogdHNsaW50OmRpc2FibGU6bm8tdmFyLXJlcXVpcmVzICovXG4vLyBkZWNsYXJlIGZ1bmN0aW9uIHJlcXVpcmUobmFtZTogc3RyaW5nKTogYW55O1xuLy8gY29uc3QgUmFuZG9tID0gcmVxdWlyZShcInNpbWpzLXJhbmRvbVwiKTtcbi8vIGNvbnN0IHJhbmRvbSA9IG5ldyBSYW5kb20oMTApO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0IHtcbiAgICBzdGFydFllYXI6IG51bWJlcjtcbiAgICB0b3RhbEFtb3VudDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUJ1Y2tldCB7XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG5cbiAgICBzdWJCdWNrZXRzOiB7IFtncm91cE5hbWU6IHN0cmluZ106IHsgZ3JvdXA6IHN0cmluZzsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyIH0gfTtcbn1cblxuaW50ZXJmYWNlIElHcm91cCB7XG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBuYW1lIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGdyb3VwXG4gICAgICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBhIHNlcGFyYXRvciBsaW5lIGJlZW4gZHJhd24gZm9yIHRoaXMgZ3JvdXA/XG4gICAgICovXG4gICAgc2VwYXJhdG9yOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIHBlcmNlbnRhZ2Ugb2YgdmFsdWVzIGluIHRoaXMgZ3JvdXAgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBzaW11bGF0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgcGVyY2VudGFnZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1pbmltdW0gdmFsdWUgdGhhdCBpcyBzdGlsbCBwYXJ0IG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBmcm9tPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBtYXhpbXVtIHZhbHVlIChleGNsdXNpdmUpIHRoYXQgZGVmaW5lcyB0aGUgdXBwZXIgZW5kIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICB0bz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUHJvamVjdFJlc3VsdCB7XG4gICAgLyoqXG4gICAgICogVGhlIG1pbmltYWwgc2ltdWxhdGVkIHZhbHVlIGZvciB0aGlzIHByb2plY3RcbiAgICAgKi9cbiAgICBtaW46IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW1hbCBzaW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBtYXg6IG51bWJlcjtcblxuICAgIC8qKiBUaGUgbWVkaWFuIG9mIHRoZSB2YWx1ZXMgZm91bmQgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1lZGlhbjogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB3aGVyZSB0aGUgMi8zIG9mIHRoZSBzaW11bGF0ZWQgdmFsdWVzIHN0YXJ0IC8gZW5kLlxuICAgICAqL1xuICAgIHR3b1RoaXJkOiB7XG4gICAgICAgIG1pbjogbnVtYmVyO1xuICAgICAgICBtYXg6IG51bWJlcjtcbiAgICB9O1xuXG4gICAgYnVja2V0czogSUJ1Y2tldFtdO1xuXG4gICAgZ3JvdXBzOiBJR3JvdXBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9qZWN0XG4gICAgICovXG4gICAgcHJvamVjdDogSVByb2plY3Q7XG59XG5cbmludGVyZmFjZSBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT47XG4gICAgc2ltdWxhdGVkVmFsdWVzOiBudW1iZXJbXVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzPzogbnVtYmVyO1xuICAgIG51bVJ1bnM/OiBudW1iZXI7XG4gICAgcHJvamVjdHM/OiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ/OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U/OiBudW1iZXI7XG4gICAgc2VlZD86IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5PzogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBwcm9qZWN0czogSVByb2plY3RbXTtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U6IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHRhc2tJbmRleD86IG51bWJlcjtcbiAgICB2YWx1ZXNQZXJXb3JrZXI/OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgdm9sYXRpbGl0eTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogMTAwMDAwMCxcbiAgICAgICAgbGlxdWlkaXR5OiAxMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAsXG4gICAgICAgIG51bVllYXJzOiAxMCxcbiAgICAgICAgcGVyZm9ybWFuY2U6IDAsXG4gICAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgICAgc2VlZDogdW5kZWZpbmVkLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjAxXG4gICAgfSwgb3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChvcHRpb25zOiBJSW5pdGlhbGl6ZWRNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpOiBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICAvKipcbiAgICAgKiBQZXJmb3JtcyB0aGUgbW9udGUgY2FybG8gc2ltdWxhdGlvbiBmb3IgYWxsIHllYXJzIGFuZCBudW0gcnVucy5cbiAgICAgKiBAcGFyYW0gY2FzaEZsb3dzIHRoZSBjYXNoIGZsb3dzXG4gICAgICogQHJldHVybnMge251bWJlcltdW119IHRoZSBzaW11bGF0ZWQgb3V0Y29tZXMgZ3JvdXBlZCBieSB5ZWFyXG4gICAgICovXG4gICAgZnVuY3Rpb24gc2ltdWxhdGVPdXRjb21lcyhjYXNoRmxvd3M6IG51bWJlcltdLCBudW1ZZWFyczogbnVtYmVyKTogbnVtYmVyW11bXSAge1xuICAgICAgICBmdW5jdGlvbiB0b0Fic29sdXRlSW5kaWNlcyhpbmRpY2VzOiBudW1iZXJbXSkge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSA9IG9wdGlvbnMuaW52ZXN0bWVudEFtb3VudDtcbiAgICAgICAgICAgIGxldCBwcmV2aW91c1llYXJJbmRleCA9IDEwMDtcblxuICAgICAgICAgICAgZm9yIChsZXQgcmVsYXRpdmVZZWFyID0gMDsgcmVsYXRpdmVZZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsrcmVsYXRpdmVZZWFyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFllYXJJbmRleCA9IGluZGljZXNbcmVsYXRpdmVZZWFyXTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYXNoRmxvd1N0YXJ0T2ZZZWFyID0gcmVsYXRpdmVZZWFyID09PSAwID8gMCA6IGNhc2hGbG93c1tyZWxhdGl2ZVllYXIgLSAxXTtcblxuICAgICAgICAgICAgICAgIC8vIHNjYWxlIGN1cnJlbnQgdmFsdWUgd2l0aCBwZXJmb3JtYW5jZSBnYWluIGFjY29yZGluZyB0byBpbmRleFxuICAgICAgICAgICAgICAgIGNvbnN0IHBlcmZvcm1hbmNlID0gY3VycmVudFllYXJJbmRleCAvIHByZXZpb3VzWWVhckluZGV4O1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQb3J0Zm9saW9WYWx1ZSA9IChjdXJyZW50UG9ydGZvbGlvVmFsdWUgKyBjYXNoRmxvd1N0YXJ0T2ZZZWFyKSAqIHBlcmZvcm1hbmNlO1xuXG4gICAgICAgICAgICAgICAgaW5kaWNlc1tyZWxhdGl2ZVllYXJdID0gTWF0aC5yb3VuZChjdXJyZW50UG9ydGZvbGlvVmFsdWUpO1xuICAgICAgICAgICAgICAgIHByZXZpb3VzWWVhckluZGV4ID0gY3VycmVudFllYXJJbmRleDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGluZGljZXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQ6IG51bWJlcltdW10gPSBuZXcgQXJyYXkob3B0aW9ucy5udW1ZZWFycyk7XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDw9IG51bVllYXJzOyArK3llYXIpIHtcbiAgICAgICAgICAgIHJlc3VsdFt5ZWFyXSA9IG5ldyBBcnJheShvcHRpb25zLm51bVJ1bnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgcnVuID0gMDsgcnVuIDwgb3B0aW9ucy5udW1SdW5zOyBydW4rKykge1xuICAgICAgICAgICAgY29uc3QgaW5kaWNlcyA9IFsxMDBdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8PSBudW1ZZWFyczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc3QgcmFuZG9tUGVyZm9ybWFuY2UgPSAxICsgcmFuZG9tLm5vcm1hbChvcHRpb25zLnBlcmZvcm1hbmNlLCBvcHRpb25zLnZvbGF0aWxpdHkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRvbVBlcmZvcm1hbmNlID0gMSArIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgaW5kaWNlcy5wdXNoKGluZGljZXNbaSAtIDFdICogcmFuZG9tUGVyZm9ybWFuY2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjb252ZXJ0IHRoZSByZWxhdGl2ZSB2YWx1ZXMgZnJvbSBhYm92ZSB0byBhYnNvbHV0ZSB2YWx1ZXMuXG4gICAgICAgICAgICB0b0Fic29sdXRlSW5kaWNlcyhpbmRpY2VzKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBpbmRpY2VzLmxlbmd0aDsgKyt5ZWFyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3llYXJdW3J1bl0gPSBpbmRpY2VzW3llYXJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9qZWN0c1RvQ2FzaEZsb3dzKCkge1xuICAgICAgICBjb25zdCBjYXNoRmxvd3M6IG51bWJlcltdID0gW107XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgb3B0aW9ucy5udW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0c0J5VGhpc1llYXIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3llYXJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgY2FzaEZsb3cgPSAtcHJvamVjdHNCeVRoaXNZZWFyLnJlZHVjZSgobWVtbywgcHJvamVjdCkgPT4gbWVtbyArIHByb2plY3QudG90YWxBbW91bnQsIDApO1xuICAgICAgICAgICAgY2FzaEZsb3dzLnB1c2goY2FzaEZsb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYXNoRmxvd3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzOiBudW1iZXJbXSkge1xuICAgICAgICBjb25zdCBub0ludGVyZXN0UmVmZXJlbmNlTGluZTogbnVtYmVyW10gPSBbXTtcblxuICAgICAgICBsZXQgaW52ZXN0bWVudEFtb3VudExlZnQgPSBvcHRpb25zLmludmVzdG1lbnRBbW91bnQ7XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgb3B0aW9ucy5udW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICBpbnZlc3RtZW50QW1vdW50TGVmdCA9IGludmVzdG1lbnRBbW91bnRMZWZ0ICsgY2FzaEZsb3dzW3llYXJdO1xuICAgICAgICAgICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUucHVzaChpbnZlc3RtZW50QW1vdW50TGVmdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lO1xuICAgIH1cblxuICAgIGxldCBwcm9qZWN0c1RvU2ltdWxhdGU6IElQcm9qZWN0W10gPSBvcHRpb25zLnByb2plY3RzO1xuXG4gICAgaWYgKG9wdGlvbnMudGFza0luZGV4ICYmIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyKSB7XG4gICAgICAgIHByb2plY3RzVG9TaW11bGF0ZSA9IG9wdGlvbnMucHJvamVjdHMuc2xpY2Uob3B0aW9ucy50YXNrSW5kZXggKiBvcHRpb25zLnZhbHVlc1BlcldvcmtlciwgKG9wdGlvbnMudGFza0luZGV4ICsgMSkgKiBvcHRpb25zLnZhbHVlc1Blcldvcmtlcik7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvamVjdHMgPSBvcHRpb25zLnByb2plY3RzLnNvcnQoKGEsIGIpID0+IGEuc3RhcnRZZWFyIC0gYi5zdGFydFllYXIpO1xuXG4gICAgLy8gR3JvdXAgcHJvamVjdHMgYnkgc3RhcnRZZWFyLCB1c2UgbG9kYXNoIGdyb3VwQnkgaW5zdGVhZFxuICAgIGNvbnN0IHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT4gPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c1tpXTtcbiAgICAgICAgY29uc3QgYXJyID0gcHJvamVjdHNCeVN0YXJ0WWVhcltwcm9qZWN0LnN0YXJ0WWVhcl0gPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXSB8fCBbXTtcbiAgICAgICAgYXJyLnB1c2gocHJvamVjdCk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FzaEZsb3dzID0gcHJvamVjdHNUb0Nhc2hGbG93cygpO1xuICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lID0gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzKTtcblxuICAgIGNvbnN0IG51bVllYXJzID0gcHJvamVjdHNUb1NpbXVsYXRlLnJlZHVjZSgobWVtbywgcHJvamVjdCkgPT4gTWF0aC5tYXgobWVtbywgcHJvamVjdC5zdGFydFllYXIpLCAwKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGludmVzdG1lbnRBbW91bnQ6IG9wdGlvbnMuaW52ZXN0bWVudEFtb3VudCxcbiAgICAgICAgbGlxdWlkaXR5OiBvcHRpb25zLmxpcXVpZGl0eSxcbiAgICAgICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUsXG4gICAgICAgIG51bVJ1bnM6IG9wdGlvbnMubnVtUnVucyxcbiAgICAgICAgbnVtWWVhcnMsXG4gICAgICAgIHByb2plY3RzQnlTdGFydFllYXIsXG4gICAgICAgIHNpbXVsYXRlZFZhbHVlczogc2ltdWxhdGVPdXRjb21lcyhjYXNoRmxvd3MsIG51bVllYXJzKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVByb2plY3QocHJvamVjdDogSVByb2plY3QsIGVudmlyb25tZW50OiBJTW9udGVDYXJsb0Vudmlyb25tZW50KTogSVByb2plY3RSZXN1bHQge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9CVUNLRVRTID0gMTA7XG4gICAgZnVuY3Rpb24gZ3JvdXBGb3JWYWx1ZSh2YWx1ZTogbnVtYmVyLCBncm91cHM6IElHcm91cFtdKTogSUdyb3VwIHtcbiAgICAgICAgcmV0dXJuIGdyb3Vwcy5maW5kKGdyb3VwID0+ICh0eXBlb2YgZ3JvdXAuZnJvbSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBncm91cC5mcm9tIDw9IHZhbHVlKSAmJiAodHlwZW9mIGdyb3VwLnRvID09PSBcInVuZGVmaW5lZFwiIHx8IGdyb3VwLnRvID4gdmFsdWUpKSE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlR3JvdXBzKHJlcXVpcmVkQW1vdW50OiBudW1iZXIsIG5vSW50ZXJlc3RSZWZlcmVuY2U6IG51bWJlcik6IElHcm91cFtdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHsgZGVzY3JpcHRpb246IFwiWmllbCBlcnJlaWNoYmFyXCIsIGZyb206IHJlcXVpcmVkQW1vdW50LCBuYW1lOiBcImdyZWVuXCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZX0sXG4gICAgICAgICAgICB7IGRlc2NyaXB0aW9uOiBcIm1pdCBadXNhdHpsaXF1aWRpdMOkdCBlcnJlaWNoYmFyXCIsIGZyb206IHJlcXVpcmVkQW1vdW50IC0gZW52aXJvbm1lbnQubGlxdWlkaXR5LCBuYW1lOiBcInllbGxvd1wiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IHRydWUsIHRvOiByZXF1aXJlZEFtb3VudCB9LFxuICAgICAgICAgICAgeyBkZXNjcmlwdGlvbjogXCJuaWNodCBlcnJlaWNoYmFyXCIsIGZyb206IG5vSW50ZXJlc3RSZWZlcmVuY2UsIG5hbWU6IFwiZ3JheVwiLCBwZXJjZW50YWdlOiAwLCBzZXBhcmF0b3I6IGZhbHNlLCB0bzogcmVxdWlyZWRBbW91bnQgLSBlbnZpcm9ubWVudC5saXF1aWRpdHkgfSxcbiAgICAgICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhciwgbWl0IFZlcmx1c3RcIiwgbmFtZTogXCJyZWRcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IG5vSW50ZXJlc3RSZWZlcmVuY2UgfVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KCkge1xuICAgICAgICBsZXQgYW1vdW50ID0gcHJvamVjdC50b3RhbEFtb3VudDtcbiAgICAgICAgY29uc3QgcHJvamVjdHNTYW1lWWVhciA9IGVudmlyb25tZW50LnByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHNTYW1lWWVhci5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3Qgb3RoZXJQcm9qZWN0ID0gcHJvamVjdHNTYW1lWWVhcltpXTtcbiAgICAgICAgICAgIGlmIChvdGhlclByb2plY3QgPT09IHByb2plY3QpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFtb3VudCArPSBvdGhlclByb2plY3QudG90YWxBbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFtb3VudDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtZWRpYW4odmFsdWVzOiBudW1iZXJbXSkge1xuICAgICAgICBjb25zdCBoYWxmID0gTWF0aC5mbG9vcih2YWx1ZXMubGVuZ3RoIC8gMik7XG5cbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggJSAyKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVzW2hhbGZdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZXNbaGFsZiAtIDFdICsgdmFsdWVzW2hhbGZdKSAvIDIuMDtcbiAgICB9XG5cbiAgICBjb25zdCByZXF1aXJlZEFtb3VudCA9IGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KCk7XG4gICAgY29uc3Qgc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIgPSBlbnZpcm9ubWVudC5zaW11bGF0ZWRWYWx1ZXNbcHJvamVjdC5zdGFydFllYXJdO1xuICAgIHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICAgIGNvbnN0IGdyb3VwcyA9IGNyZWF0ZUdyb3VwcyhyZXF1aXJlZEFtb3VudCwgZW52aXJvbm1lbnQubm9JbnRlcmVzdFJlZmVyZW5jZUxpbmVbcHJvamVjdC5zdGFydFllYXJdKTtcbiAgICBjb25zdCB2YWx1ZXNCeUdyb3VwOiB7IFtncm91cE5hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gICAgY29uc3QgYnVja2V0U2l6ZSA9IE1hdGgucm91bmQoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC8gTlVNQkVSX09GX0JVQ0tFVFMpO1xuICAgIGNvbnN0IGJ1Y2tldHM6IElCdWNrZXRbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGg7IGkgKz0gYnVja2V0U2l6ZSkge1xuICAgICAgICBjb25zdCBidWNrZXQ6IElCdWNrZXQgPSB7XG4gICAgICAgICAgICBtYXg6IE51bWJlci5NSU5fVkFMVUUsXG4gICAgICAgICAgICBtaW46IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgICBzdWJCdWNrZXRzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIGJ1Y2tldFNpemU7ICsraikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltqXTtcbiAgICAgICAgICAgIGJ1Y2tldC5taW4gPSBNYXRoLm1pbihidWNrZXQubWluLCB2YWx1ZSk7XG4gICAgICAgICAgICBidWNrZXQubWF4ID0gTWF0aC5tYXgoYnVja2V0Lm1heCwgdmFsdWUpO1xuXG4gICAgICAgICAgICBjb25zdCBncm91cCA9IGdyb3VwRm9yVmFsdWUoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbal0sIGdyb3Vwcyk7XG4gICAgICAgICAgICB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdID0gKHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICAgICAgY29uc3Qgc3ViQnVja2V0ID0gYnVja2V0LnN1YkJ1Y2tldHNbZ3JvdXAubmFtZV0gPSBidWNrZXQuc3ViQnVja2V0c1tncm91cC5uYW1lXSB8fCB7IGdyb3VwOiBncm91cC5uYW1lLCBtYXg6IE51bWJlci5NSU5fVkFMVUUsIG1pbjogTnVtYmVyLk1BWF9WQUxVRSB9O1xuICAgICAgICAgICAgc3ViQnVja2V0Lm1pbiA9IE1hdGgubWluKHN1YkJ1Y2tldC5taW4sIHZhbHVlKTtcbiAgICAgICAgICAgIHN1YkJ1Y2tldC5tYXggPSBNYXRoLm1heChzdWJCdWNrZXQubWF4LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBidWNrZXRzLnB1c2goYnVja2V0KTtcbiAgICB9XG5cbiAgICBjb25zdCBub25FbXB0eUdyb3VwcyA9IGdyb3Vwcy5maWx0ZXIoZ3JvdXAgPT4gISF2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdKTtcbiAgICBub25FbXB0eUdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IGdyb3VwLnBlcmNlbnRhZ2UgPSB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdIC8gc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoKTtcblxuICAgIGNvbnN0IG9uZVNpeHRoID0gTWF0aC5yb3VuZChzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLyA2KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBidWNrZXRzLFxuICAgICAgICBncm91cHM6IG5vbkVtcHR5R3JvdXBzLFxuICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIDFdLFxuICAgICAgICBtZWRpYW46IG1lZGlhbihzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhciksXG4gICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbMF0sXG4gICAgICAgIHByb2plY3QsXG4gICAgICAgIHR3b1RoaXJkOiB7XG4gICAgICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIG9uZVNpeHRoXSxcbiAgICAgICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbb25lU2l4dGhdXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY01vbnRlQ2FybG8ob3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKSk7XG5cbiAgICBsZXQgcHJvamVjdHM6IElQcm9qZWN0UmVzdWx0W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHByb2plY3Qgb2Ygb3B0aW9ucyEucHJvamVjdHMhKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goY2FsY3VsYXRlUHJvamVjdChwcm9qZWN0LCBlbnZpcm9ubWVudCkpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9qZWN0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsTW9udGVDYXJsbyh1c2VyT3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gaW5pdGlhbGl6ZU9wdGlvbnModXNlck9wdGlvbnMpO1xuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAuZnJvbShvcHRpb25zLnByb2plY3RzLCB7IG1pblZhbHVlc1BlclRhc2s6IDIgfSlcbiAgICAgICAgLmluRW52aXJvbm1lbnQoY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50LCBvcHRpb25zKVxuICAgICAgICAubWFwKGNhbGN1bGF0ZVByb2plY3QpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2R5bmFtaWMvbW9udGUtY2FybG8udHMiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ29vcmRpbmF0ZSB7XG4gICAgcmVhZG9ubHkgeDogbnVtYmVyO1xuICAgIHJlYWRvbmx5IHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJS25pZ2h0VG91ckVudmlyb25tZW50IHtcbiAgICBib2FyZFNpemU6IG51bWJlcjtcbiAgICBib2FyZDogbnVtYmVyW107XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVudmlyb25tZW50KGJvYXJkU2l6ZTogbnVtYmVyKTogSUtuaWdodFRvdXJFbnZpcm9ubWVudCB7XG4gICAgY29uc3QgYm9hcmQ6IG51bWJlcltdID0gbmV3IEFycmF5KGJvYXJkU2l6ZSAqIGJvYXJkU2l6ZSk7XG4gICAgYm9hcmQuZmlsbCgwKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBib2FyZCxcbiAgICAgICAgYm9hcmRTaXplXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtuaWdodFRvdXJzKHN0YXJ0UGF0aDogSUNvb3JkaW5hdGVbXSwgZW52aXJvbm1lbnQ6IElLbmlnaHRUb3VyRW52aXJvbm1lbnQpOiBudW1iZXIge1xuICAgIGNvbnN0IG1vdmVzID0gW1xuICAgICAgICB7IHg6IC0yLCB5OiAtMSB9LCB7IHg6IC0yLCB5OiAxfSwgeyB4OiAtMSwgeTogLTIgfSwgeyB4OiAtMSwgeTogMiB9LFxuICAgICAgICB7IHg6IDEsIHk6IC0yIH0sIHsgeDogMSwgeTogMn0sIHsgeDogMiwgeTogLTEgfSwgeyB4OiAyLCB5OiAxIH1cbiAgICBdO1xuICAgIGNvbnN0IGJvYXJkU2l6ZSA9IGVudmlyb25tZW50LmJvYXJkU2l6ZTtcbiAgICBjb25zdCBib2FyZCA9IGVudmlyb25tZW50LmJvYXJkO1xuICAgIGNvbnN0IG51bWJlck9mRmllbGRzID0gYm9hcmRTaXplICogYm9hcmRTaXplO1xuICAgIGxldCByZXN1bHRzOiBudW1iZXIgPSAwO1xuICAgIGNvbnN0IHN0YWNrOiB7IGNvb3JkaW5hdGU6IElDb29yZGluYXRlLCBuOiBudW1iZXIgfVtdID0gc3RhcnRQYXRoLm1hcCgocG9zLCBpbmRleCkgPT4gKHsgY29vcmRpbmF0ZTogcG9zLCBuOiBpbmRleCArIDEgfSkpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0YXJ0UGF0aC5sZW5ndGggLSAxOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBzdGFydFBhdGhbaW5kZXhdLnggKiBib2FyZFNpemUgKyBzdGFydFBhdGhbaW5kZXhdLnk7XG4gICAgICAgIGJvYXJkW2ZpZWxkSW5kZXhdID0gaW5kZXggKyAxO1xuICAgIH1cblxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZSwgbiB9ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpZWxkSW5kZXggPSBjb29yZGluYXRlLnggKiBib2FyZFNpemUgKyBjb29yZGluYXRlLnk7XG5cbiAgICAgICAgaWYgKGJvYXJkW2ZpZWxkSW5kZXhdICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBiYWNrIHRyYWNraW5nXG4gICAgICAgICAgICBib2FyZFtmaWVsZEluZGV4XSA9IDA7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgdmFsdWVcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZW50cnlcbiAgICAgICAgaWYgKG4gPT09IG51bWJlck9mRmllbGRzKSB7XG4gICAgICAgICAgICArK3Jlc3VsdHM7XG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9hcmRbZmllbGRJbmRleF0gPSBuITtcblxuICAgICAgICBmb3IgKGNvbnN0IG1vdmUgb2YgbW92ZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NvciA9IHsgeDogY29vcmRpbmF0ZS54ICsgbW92ZS54LCB5OiBjb29yZGluYXRlLnkgKyBtb3ZlLnkgfTtcbiAgICAgICAgICAgIC8vIG5vdCBvdXRzaWRlIG9mIGJvYXJkIGFuZCBub3QgeWV0IGFjY2Vzc2VkXG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NpYmxlID0gc3VjY2Vzc29yLnggPj0gMCAmJiBzdWNjZXNzb3IueSA+PSAwICYmIHN1Y2Nlc3Nvci54IDwgYm9hcmRTaXplICYmICBzdWNjZXNzb3IueSA8IGJvYXJkU2l6ZSAmJiBib2FyZFtzdWNjZXNzb3IueCAqIGJvYXJkU2l6ZSArIHN1Y2Nlc3Nvci55XSA9PT0gMDtcblxuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHsgY29vcmRpbmF0ZTogc3VjY2Vzc29yLCBuOiBuICsgMSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY0tuaWdodFRvdXJzKHN0YXJ0OiBJQ29vcmRpbmF0ZSwgYm9hcmRTaXplOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gY3JlYXRlRW52aXJvbm1lbnQoYm9hcmRTaXplKTtcbiAgICByZXR1cm4ga25pZ2h0VG91cnMoW3N0YXJ0XSwgZW52aXJvbm1lbnQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYWxsZWxLbmlnaHRUb3VycyhzdGFydDogSUNvb3JkaW5hdGUsIGJvYXJkU2l6ZTogbnVtYmVyLCBvcHRpb25zPzogSVBhcmFsbGVsT3B0aW9ucyk6IFByb21pc2VMaWtlPG51bWJlcj4ge1xuXG4gICAgZnVuY3Rpb24gc3VjY2Vzc29ycyhjb29yZGluYXRlOiBJQ29vcmRpbmF0ZSkge1xuICAgICAgICBjb25zdCBtb3ZlcyA9IFtcbiAgICAgICAgICAgIHt4OiAtMiwgeTogLTF9LCB7eDogLTIsIHk6IDF9LCB7eDogLTEsIHk6IC0yfSwge3g6IC0xLCB5OiAyfSxcbiAgICAgICAgICAgIHt4OiAxLCB5OiAtMn0sIHt4OiAxLCB5OiAyfSwge3g6IDIsIHk6IC0xfSwge3g6IDIsIHk6IDF9XG4gICAgICAgIF07XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgbW92ZSBvZiBtb3Zlcykge1xuICAgICAgICAgICAgY29uc3Qgc3VjY2Vzc29yID0ge3g6IGNvb3JkaW5hdGUueCArIG1vdmUueCwgeTogY29vcmRpbmF0ZS55ICsgbW92ZS55fTtcbiAgICAgICAgICAgIGNvbnN0IGFjY2Vzc2libGUgPSBzdWNjZXNzb3IueCA+PSAwICYmIHN1Y2Nlc3Nvci55ID49IDAgJiYgc3VjY2Vzc29yLnggPCBib2FyZFNpemUgJiYgc3VjY2Vzc29yLnkgPCBib2FyZFNpemUgJiZcbiAgICAgICAgICAgICAgICAoc3VjY2Vzc29yLnggIT09IHN0YXJ0LnggfHwgc3VjY2Vzc29yLnkgIT09IHN0YXJ0LnkpICYmIChzdWNjZXNzb3IueCAhPT0gY29vcmRpbmF0ZS54ICYmIHN1Y2Nlc3Nvci55ICE9PSBjb29yZGluYXRlLnkpO1xuICAgICAgICAgICAgaWYgKGFjY2Vzc2libGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChzdWNjZXNzb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wdXRlU3RhcnRGaWVsZHMoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogSUNvb3JkaW5hdGVbXVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoc3RhcnQpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGluZGlyZWN0U3VjY2Vzc29yIG9mIHN1Y2Nlc3NvcnMoZGlyZWN0U3VjY2Vzc29yKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFtzdGFydCwgZGlyZWN0U3VjY2Vzc29yLCBpbmRpcmVjdFN1Y2Nlc3Nvcl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsID0gMDtcbiAgICBsZXQgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgcmV0dXJuIHBhcmFsbGVsXG4gICAgICAgIC5mcm9tKGNvbXB1dGVTdGFydEZpZWxkcygpLCBvcHRpb25zKVxuICAgICAgICAuaW5FbnZpcm9ubWVudChjcmVhdGVFbnZpcm9ubWVudCwgYm9hcmRTaXplKVxuICAgICAgICAubWFwPG51bWJlcj4oa25pZ2h0VG91cnMpXG4gICAgICAgIC5yZWR1Y2UoMCwgKG1lbW8sIGNvdW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbWVtbyArIGNvdW50O1xuICAgICAgICB9KVxuICAgICAgICAuc3Vic2NyaWJlKHN1YlJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCB0b3VycyBvZiBzdWJSZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgdG90YWwgKz0gdG91cnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1jb25zb2xlICovXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHt0b3RhbCAvIChwZXJmb3JtYW5jZS5ub3coKSAtIHN0YXJ0VGltZSkgKiAxMDAwfSByZXN1bHRzIHBlciBzZWNvbmRgKTtcbiAgICAgICAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdHJhbnNwaWxlZC9rbmlnaHRzLXRvdXIudHMiLCJpbXBvcnQgcGFyYWxsZWwsIHtJUGFyYWxsZWxPcHRpb25zfSBmcm9tIFwicGFyYWxsZWwtZXNcIjtcbmltcG9ydCB7SU1hbmRlbGJyb3RPcHRpb25zfSBmcm9tIFwiLi4vZHluYW1pYy9tYW5kZWxicm90XCI7XG5cbmludGVyZmFjZSBJQ29tcGxleE51bWJlciB7XG4gICAgaTogbnVtYmVyO1xuICAgIHJlYWw6IG51bWJlcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hbmRlbGJyb3QoeyBpbWFnZVdpZHRoLCBpbWFnZUhlaWdodCwgaXRlcmF0aW9ucyB9OiBJTWFuZGVsYnJvdE9wdGlvbnMsIG9wdGlvbnM/OiBJUGFyYWxsZWxPcHRpb25zKSB7XG4gICAgLy8gWCBheGlzIHNob3dzIHJlYWwgbnVtYmVycywgeSBheGlzIGltYWdpbmFyeVxuICAgIGNvbnN0IG1pbiA9IHsgaTogLTEuMiwgcmVhbDogLTIuMCB9O1xuICAgIGNvbnN0IG1heCA9IHsgaTogMCwgcmVhbDogMS4wIH07XG4gICAgbWF4LmkgPSBtaW4uaSArIChtYXgucmVhbCAtIG1pbi5yZWFsKSAqIGltYWdlSGVpZ2h0IC8gaW1hZ2VXaWR0aDtcblxuICAgIGNvbnN0IHNjYWxpbmdGYWN0b3IgPSB7XG4gICAgICAgIGk6IChtYXguaSAtIG1pbi5pKSAvIChpbWFnZUhlaWdodCAtIDEpLFxuICAgICAgICByZWFsOiAobWF4LnJlYWwgLSBtaW4ucmVhbCkgLyAoaW1hZ2VXaWR0aCAtIDEpXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVooYzogSUNvbXBsZXhOdW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCB6ID0geyBpOiBjLmksIHJlYWw6IGMucmVhbCB9O1xuICAgICAgICBsZXQgbiA9IDA7XG5cbiAgICAgICAgZm9yICg7IG4gPCBpdGVyYXRpb25zOyArK24pIHtcbiAgICAgICAgICAgIGlmICh6LnJlYWwgKiB6LnJlYWwgKyB6LmkgKiB6LmkgPiA0KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHogKiogMiArIGNcbiAgICAgICAgICAgIGNvbnN0IHpJID0gei5pO1xuICAgICAgICAgICAgei5pID0gMiAqIHoucmVhbCAqIHouaSArIGMuaTtcbiAgICAgICAgICAgIHoucmVhbCA9IHoucmVhbCAqIHoucmVhbCAtIHpJICogekkgKyBjLnJlYWw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyYWxsZWxcbiAgICAgICAgLnJhbmdlKDAsIGltYWdlSGVpZ2h0LCAxLCBvcHRpb25zKVxuICAgICAgICAubWFwKHkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShpbWFnZVdpZHRoICogNCk7XG4gICAgICAgICAgICBjb25zdCBjSSA9IG1heC5pIC0geSAqIHNjYWxpbmdGYWN0b3IuaTtcblxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBpbWFnZVdpZHRoOyArK3gpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjID0ge1xuICAgICAgICAgICAgICAgICAgICBpOiBjSSxcbiAgICAgICAgICAgICAgICAgICAgcmVhbDogbWluLnJlYWwgKyB4ICogc2NhbGluZ0ZhY3Rvci5yZWFsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG4gPSBjYWxjdWxhdGVaKGMpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJhc2UgPSB4ICogNDtcbiAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXG4gICAgICAgICAgICAgICAgbGluZVtiYXNlXSA9IG4gJiAweEZGO1xuICAgICAgICAgICAgICAgIGxpbmVbYmFzZSArIDFdID0gbiAmIDB4RkYwMDtcbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2UgKyAyXSA9IG4gJiAweEZGMDAwMDtcbiAgICAgICAgICAgICAgICBsaW5lW2Jhc2UgKyAzXSA9IDI1NTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsaW5lO1xuICAgICAgICB9KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90cmFuc3BpbGVkL21hbmRlbGJyb3QudHMiLCJpbXBvcnQgcGFyYWxsZWwgZnJvbSBcInBhcmFsbGVsLWVzXCI7XG5pbXBvcnQge0RpY3Rpb25hcnl9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCBSYW5kb20gZnJvbSBcInNpbWpzLXJhbmRvbVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9qZWN0IHtcbiAgICBzdGFydFllYXI6IG51bWJlcjtcbiAgICB0b3RhbEFtb3VudDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUJ1Y2tldCB7XG4gICAgbWluOiBudW1iZXI7XG4gICAgbWF4OiBudW1iZXI7XG5cbiAgICBzdWJCdWNrZXRzOiB7IFtncm91cE5hbWU6IHN0cmluZ106IHsgZ3JvdXA6IHN0cmluZzsgbWluOiBudW1iZXIsIG1heDogbnVtYmVyIH0gfTtcbn1cblxuaW50ZXJmYWNlIElHcm91cCB7XG4gICAgLyoqXG4gICAgICogVGhlIHVuaXF1ZSBuYW1lIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGdyb3VwXG4gICAgICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFNob3VsZCBhIHNlcGFyYXRvciBsaW5lIGJlZW4gZHJhd24gZm9yIHRoaXMgZ3JvdXA/XG4gICAgICovXG4gICAgc2VwYXJhdG9yOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIHBlcmNlbnRhZ2Ugb2YgdmFsdWVzIGluIHRoaXMgZ3JvdXAgdG8gdGhlIHRvdGFsIG51bWJlciBvZiBzaW11bGF0ZWQgdmFsdWVzXG4gICAgICovXG4gICAgcGVyY2VudGFnZTogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hhdHMgdGhlIG1pbmltdW0gdmFsdWUgdGhhdCBpcyBzdGlsbCBwYXJ0IG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICBmcm9tPzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIFdoYXRzIHRoZSBtYXhpbXVtIHZhbHVlIChleGNsdXNpdmUpIHRoYXQgZGVmaW5lcyB0aGUgdXBwZXIgZW5kIG9mIHRoaXMgZ3JvdXBcbiAgICAgKi9cbiAgICB0bz86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUHJvamVjdFJlc3VsdCB7XG4gICAgLyoqXG4gICAgICogVGhlIG1pbmltYWwgc2ltdWxhdGVkIHZhbHVlIGZvciB0aGlzIHByb2plY3RcbiAgICAgKi9cbiAgICBtaW46IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW1hbCBzaW11bGF0ZWQgdmFsdWVcbiAgICAgKi9cbiAgICBtYXg6IG51bWJlcjtcblxuICAgIC8qKiBUaGUgbWVkaWFuIG9mIHRoZSB2YWx1ZXMgZm91bmQgZm9yIHRoaXMgcHJvamVjdFxuICAgICAqL1xuICAgIG1lZGlhbjogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyB3aGVyZSB0aGUgMi8zIG9mIHRoZSBzaW11bGF0ZWQgdmFsdWVzIHN0YXJ0IC8gZW5kLlxuICAgICAqL1xuICAgIHR3b1RoaXJkOiB7XG4gICAgICAgIG1pbjogbnVtYmVyO1xuICAgICAgICBtYXg6IG51bWJlcjtcbiAgICB9O1xuXG4gICAgYnVja2V0czogSUJ1Y2tldFtdO1xuXG4gICAgZ3JvdXBzOiBJR3JvdXBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9qZWN0XG4gICAgICovXG4gICAgcHJvamVjdDogSVByb2plY3Q7XG59XG5cbmludGVyZmFjZSBJTW9udGVDYXJsb0Vudmlyb25tZW50IHtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgbm9JbnRlcmVzdFJlZmVyZW5jZUxpbmU6IG51bWJlcltdO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIHByb2plY3RzQnlTdGFydFllYXI6IERpY3Rpb25hcnk8SVByb2plY3RbXT47XG4gICAgc2ltdWxhdGVkVmFsdWVzOiBudW1iZXJbXVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMge1xuICAgIG51bVllYXJzPzogbnVtYmVyO1xuICAgIG51bVJ1bnM/OiBudW1iZXI7XG4gICAgcHJvamVjdHM/OiBJUHJvamVjdFtdO1xuICAgIGludmVzdG1lbnRBbW91bnQ/OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U/OiBudW1iZXI7XG4gICAgc2VlZD86IG51bWJlcjtcbiAgICB2b2xhdGlsaXR5OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5PzogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSUluaXRpYWxpemVkTW9udGVDYXJsb1NpbXVsYXRpb25PcHRpb25zIHtcbiAgICBudW1ZZWFyczogbnVtYmVyO1xuICAgIG51bVJ1bnM6IG51bWJlcjtcbiAgICBwcm9qZWN0czogSVByb2plY3RbXTtcbiAgICBpbnZlc3RtZW50QW1vdW50OiBudW1iZXI7XG4gICAgcGVyZm9ybWFuY2U6IG51bWJlcjtcbiAgICBzZWVkPzogbnVtYmVyO1xuICAgIHRhc2tJbmRleD86IG51bWJlcjtcbiAgICB2YWx1ZXNQZXJXb3JrZXI/OiBudW1iZXI7XG4gICAgbGlxdWlkaXR5OiBudW1iZXI7XG4gICAgdm9sYXRpbGl0eTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zPzogSU1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogMTAwMDAwMCxcbiAgICAgICAgbGlxdWlkaXR5OiAxMDAwMCxcbiAgICAgICAgbnVtUnVuczogMTAwMDAsXG4gICAgICAgIG51bVllYXJzOiAxMCxcbiAgICAgICAgcGVyZm9ybWFuY2U6IDAsXG4gICAgICAgIHByb2plY3RzOiBbXSxcbiAgICAgICAgc2VlZDogdW5kZWZpbmVkLFxuICAgICAgICB2b2xhdGlsaXR5OiAwLjAxXG4gICAgfSwgb3B0aW9ucyk7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50KG9wdGlvbnM6IElJbml0aWFsaXplZE1vbnRlQ2FybG9TaW11bGF0aW9uT3B0aW9ucyk6IElNb250ZUNhcmxvRW52aXJvbm1lbnQge1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdHNUb0Nhc2hGbG93cyhwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+LCBudW1ZZWFyczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGNhc2hGbG93czogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPCBudW1ZZWFyczsgKyt5ZWFyKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0c0J5VGhpc1llYXIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3llYXJdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgY2FzaEZsb3cgPSAtcHJvamVjdHNCeVRoaXNZZWFyLnJlZHVjZSgobWVtbywgcHJvamVjdCkgPT4gbWVtbyArIHByb2plY3QudG90YWxBbW91bnQsIDApO1xuICAgICAgICAgICAgY2FzaEZsb3dzLnB1c2goY2FzaEZsb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYXNoRmxvd3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCBudW1ZZWFyczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgICAgIGxldCBpbnZlc3RtZW50QW1vdW50TGVmdCA9IGludmVzdG1lbnRBbW91bnQ7XG4gICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgaW52ZXN0bWVudEFtb3VudExlZnQgPSBpbnZlc3RtZW50QW1vdW50TGVmdCArIGNhc2hGbG93c1t5ZWFyXTtcbiAgICAgICAgICAgIG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lLnB1c2goaW52ZXN0bWVudEFtb3VudExlZnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub0ludGVyZXN0UmVmZXJlbmNlTGluZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0Fic29sdXRlSW5kaWNlcyhpbmRpY2VzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCBjYXNoRmxvd3M6IG51bWJlcltdKSB7XG4gICAgICAgIGxldCBjdXJyZW50UG9ydGZvbGlvVmFsdWUgPSBpbnZlc3RtZW50QW1vdW50O1xuICAgICAgICBsZXQgcHJldmlvdXNZZWFySW5kZXggPSAxMDA7XG5cbiAgICAgICAgZm9yIChsZXQgcmVsYXRpdmVZZWFyID0gMDsgcmVsYXRpdmVZZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsrcmVsYXRpdmVZZWFyKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50WWVhckluZGV4ID0gaW5kaWNlc1tyZWxhdGl2ZVllYXJdO1xuICAgICAgICAgICAgY29uc3QgY2FzaEZsb3dTdGFydE9mWWVhciA9IHJlbGF0aXZlWWVhciA9PT0gMCA/IDAgOiBjYXNoRmxvd3NbcmVsYXRpdmVZZWFyIC0gMV07XG5cbiAgICAgICAgICAgIC8vIHNjYWxlIGN1cnJlbnQgdmFsdWUgd2l0aCBwZXJmb3JtYW5jZSBnYWluIGFjY29yZGluZyB0byBpbmRleFxuICAgICAgICAgICAgY29uc3QgcGVyZm9ybWFuY2UgPSBjdXJyZW50WWVhckluZGV4IC8gcHJldmlvdXNZZWFySW5kZXg7XG4gICAgICAgICAgICBjdXJyZW50UG9ydGZvbGlvVmFsdWUgPSAoY3VycmVudFBvcnRmb2xpb1ZhbHVlICsgY2FzaEZsb3dTdGFydE9mWWVhcikgKiBwZXJmb3JtYW5jZTtcblxuICAgICAgICAgICAgaW5kaWNlc1tyZWxhdGl2ZVllYXJdID0gTWF0aC5yb3VuZChjdXJyZW50UG9ydGZvbGlvVmFsdWUpO1xuICAgICAgICAgICAgcHJldmlvdXNZZWFySW5kZXggPSBjdXJyZW50WWVhckluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGljZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgdGhlIG1vbnRlIGNhcmxvIHNpbXVsYXRpb24gZm9yIGFsbCB5ZWFycyBhbmQgbnVtIHJ1bnMuXG4gICAgICogQHBhcmFtIGNhc2hGbG93cyB0aGUgY2FzaCBmbG93c1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXVtdfSB0aGUgc2ltdWxhdGVkIG91dGNvbWVzIGdyb3VwZWQgYnkgeWVhclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNpbXVsYXRlT3V0Y29tZXMoY2FzaEZsb3dzOiBudW1iZXJbXSwgaW52ZXN0bWVudEFtb3VudDogbnVtYmVyLCB7IG51bVJ1bnMsIG51bVllYXJzLCB2b2xhdGlsaXR5LCBwZXJmb3JtYW5jZSB9OiB7IG51bVJ1bnM6IG51bWJlciwgbnVtWWVhcnM6IG51bWJlciwgdm9sYXRpbGl0eTogbnVtYmVyLCBwZXJmb3JtYW5jZTogbnVtYmVyfSk6IG51bWJlcltdW10gIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBudW1iZXJbXVtdID0gbmV3IEFycmF5KG51bVllYXJzKTtcbiAgICAgICAgZm9yIChsZXQgeWVhciA9IDA7IHllYXIgPD0gbnVtWWVhcnM7ICsreWVhcikge1xuICAgICAgICAgICAgcmVzdWx0W3llYXJdID0gbmV3IEFycmF5KG51bVJ1bnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmFuZG9tID0gbmV3IFJhbmRvbSgxMCk7XG4gICAgICAgIGZvciAobGV0IHJ1biA9IDA7IHJ1biA8IG51bVJ1bnM7IHJ1bisrKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzID0gWzEwMF07XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bVllYXJzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb21QZXJmb3JtYW5jZSA9IDEgKyByYW5kb20ubm9ybWFsKHBlcmZvcm1hbmNlLCB2b2xhdGlsaXR5KTtcbiAgICAgICAgICAgICAgICBpbmRpY2VzLnB1c2goaW5kaWNlc1tpIC0gMV0gKiByYW5kb21QZXJmb3JtYW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnZlcnQgdGhlIHJlbGF0aXZlIHZhbHVlcyBmcm9tIGFib3ZlIHRvIGFic29sdXRlIHZhbHVlcy5cbiAgICAgICAgICAgIHRvQWJzb2x1dGVJbmRpY2VzKGluZGljZXMsIGludmVzdG1lbnRBbW91bnQsIGNhc2hGbG93cyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHllYXIgPSAwOyB5ZWFyIDwgaW5kaWNlcy5sZW5ndGg7ICsreWVhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdFt5ZWFyXVtydW5dID0gaW5kaWNlc1t5ZWFyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbGV0IHByb2plY3RzVG9TaW11bGF0ZTogSVByb2plY3RbXSA9IG9wdGlvbnMucHJvamVjdHM7XG5cbiAgICBpZiAob3B0aW9ucy50YXNrSW5kZXggJiYgb3B0aW9ucy52YWx1ZXNQZXJXb3JrZXIpIHtcbiAgICAgICAgcHJvamVjdHNUb1NpbXVsYXRlID0gb3B0aW9ucy5wcm9qZWN0cy5zbGljZShvcHRpb25zLnRhc2tJbmRleCAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyLCAob3B0aW9ucy50YXNrSW5kZXggKyAxKSAqIG9wdGlvbnMudmFsdWVzUGVyV29ya2VyKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9qZWN0cyA9IG9wdGlvbnMucHJvamVjdHMuc29ydCgoYSwgYikgPT4gYS5zdGFydFllYXIgLSBiLnN0YXJ0WWVhcik7XG5cbiAgICAvLyBHcm91cCBwcm9qZWN0cyBieSBzdGFydFllYXIsIHVzZSBsb2Rhc2ggZ3JvdXBCeSBpbnN0ZWFkXG4gICAgY29uc3QgcHJvamVjdHNCeVN0YXJ0WWVhcjogRGljdGlvbmFyeTxJUHJvamVjdFtdPiA9IHt9O1xuICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICBjb25zdCBhcnIgPSBwcm9qZWN0c0J5U3RhcnRZZWFyW3Byb2plY3Quc3RhcnRZZWFyXSA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdIHx8IFtdO1xuICAgICAgICBhcnIucHVzaChwcm9qZWN0KTtcbiAgICB9XG5cbiAgICBjb25zdCBjYXNoRmxvd3MgPSBwcm9qZWN0c1RvQ2FzaEZsb3dzKHByb2plY3RzQnlTdGFydFllYXIsIG9wdGlvbnMubnVtWWVhcnMpO1xuICAgIGNvbnN0IG5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lID0gY2FsY3VsYXRlTm9JbnRlcmVzdFJlZmVyZW5jZUxpbmUoY2FzaEZsb3dzLCBvcHRpb25zLmludmVzdG1lbnRBbW91bnQsIG9wdGlvbnMubnVtWWVhcnMpO1xuXG4gICAgY29uc3QgbnVtWWVhcnMgPSBwcm9qZWN0c1RvU2ltdWxhdGUucmVkdWNlKChtZW1vLCBwcm9qZWN0KSA9PiBNYXRoLm1heChtZW1vLCBwcm9qZWN0LnN0YXJ0WWVhciksIDApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW52ZXN0bWVudEFtb3VudDogb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LFxuICAgICAgICBsaXF1aWRpdHk6IG9wdGlvbnMubGlxdWlkaXR5LFxuICAgICAgICBub0ludGVyZXN0UmVmZXJlbmNlTGluZSxcbiAgICAgICAgbnVtUnVuczogb3B0aW9ucy5udW1SdW5zLFxuICAgICAgICBudW1ZZWFycyxcbiAgICAgICAgcHJvamVjdHNCeVN0YXJ0WWVhcixcbiAgICAgICAgc2ltdWxhdGVkVmFsdWVzOiBzaW11bGF0ZU91dGNvbWVzKGNhc2hGbG93cywgb3B0aW9ucy5pbnZlc3RtZW50QW1vdW50LCBvcHRpb25zKVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGdyb3VwRm9yVmFsdWUodmFsdWU6IG51bWJlciwgZ3JvdXBzOiBJR3JvdXBbXSk6IElHcm91cCB7XG4gICAgcmV0dXJuIGdyb3Vwcy5maW5kKGdyb3VwID0+ICh0eXBlb2YgZ3JvdXAuZnJvbSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBncm91cC5mcm9tIDw9IHZhbHVlKSAmJiAodHlwZW9mIGdyb3VwLnRvID09PSBcInVuZGVmaW5lZFwiIHx8IGdyb3VwLnRvID4gdmFsdWUpKSE7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdyb3VwcyhyZXF1aXJlZEFtb3VudDogbnVtYmVyLCBub0ludGVyZXN0UmVmZXJlbmNlOiBudW1iZXIsIGxpcXVpZGl0eTogbnVtYmVyKTogSUdyb3VwW10ge1xuICAgIHJldHVybiBbXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwiWmllbCBlcnJlaWNoYmFyXCIsIGZyb206IHJlcXVpcmVkQW1vdW50LCBuYW1lOiBcImdyZWVuXCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZX0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibWl0IFp1c2F0emxpcXVpZGl0w6R0IGVycmVpY2hiYXJcIiwgZnJvbTogcmVxdWlyZWRBbW91bnQgLSBsaXF1aWRpdHksIG5hbWU6IFwieWVsbG93XCIsIHBlcmNlbnRhZ2U6IDAsIHNlcGFyYXRvcjogdHJ1ZSwgdG86IHJlcXVpcmVkQW1vdW50IH0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhclwiLCBmcm9tOiBub0ludGVyZXN0UmVmZXJlbmNlLCBuYW1lOiBcImdyYXlcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IHJlcXVpcmVkQW1vdW50IC0gbGlxdWlkaXR5IH0sXG4gICAgICAgIHsgZGVzY3JpcHRpb246IFwibmljaHQgZXJyZWljaGJhciwgbWl0IFZlcmx1c3RcIiwgbmFtZTogXCJyZWRcIiwgcGVyY2VudGFnZTogMCwgc2VwYXJhdG9yOiBmYWxzZSwgdG86IG5vSW50ZXJlc3RSZWZlcmVuY2UgfVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KHByb2plY3Q6IElQcm9qZWN0LCBwcm9qZWN0c0J5U3RhcnRZZWFyOiBEaWN0aW9uYXJ5PElQcm9qZWN0W10+KSB7XG4gICAgbGV0IGFtb3VudCA9IHByb2plY3QudG90YWxBbW91bnQ7XG4gICAgY29uc3QgcHJvamVjdHNTYW1lWWVhciA9IHByb2plY3RzQnlTdGFydFllYXJbcHJvamVjdC5zdGFydFllYXJdO1xuXG4gICAgZm9yIChjb25zdCBvdGhlclByb2plY3Qgb2YgcHJvamVjdHNTYW1lWWVhcikge1xuICAgICAgICBpZiAob3RoZXJQcm9qZWN0ID09PSBwcm9qZWN0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhbW91bnQgKz0gb3RoZXJQcm9qZWN0LnRvdGFsQW1vdW50O1xuICAgIH1cbiAgICByZXR1cm4gYW1vdW50O1xufVxuXG5mdW5jdGlvbiBtZWRpYW4odmFsdWVzOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IGhhbGYgPSBNYXRoLmZsb29yKHZhbHVlcy5sZW5ndGggLyAyKTtcblxuICAgIGlmICh2YWx1ZXMubGVuZ3RoICUgMikge1xuICAgICAgICByZXR1cm4gdmFsdWVzW2hhbGZdO1xuICAgIH1cblxuICAgIHJldHVybiAodmFsdWVzW2hhbGYgLSAxXSArIHZhbHVlc1toYWxmXSkgLyAyLjA7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVByb2plY3QocHJvamVjdDogSVByb2plY3QsIGVudmlyb25tZW50OiBJTW9udGVDYXJsb0Vudmlyb25tZW50KTogSVByb2plY3RSZXN1bHQge1xuICAgIGNvbnN0IE5VTUJFUl9PRl9CVUNLRVRTID0gMTA7XG5cbiAgICBjb25zdCByZXF1aXJlZEFtb3VudCA9IGNhbGN1bGF0ZVJlcXVpcmVkQW1vdW50KHByb2plY3QsIGVudmlyb25tZW50LnByb2plY3RzQnlTdGFydFllYXIpO1xuICAgIGNvbnN0IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyID0gZW52aXJvbm1lbnQuc2ltdWxhdGVkVmFsdWVzW3Byb2plY3Quc3RhcnRZZWFyXTtcbiAgICBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG5cbiAgICBjb25zdCBncm91cHMgPSBjcmVhdGVHcm91cHMocmVxdWlyZWRBbW91bnQsIGVudmlyb25tZW50Lm5vSW50ZXJlc3RSZWZlcmVuY2VMaW5lW3Byb2plY3Quc3RhcnRZZWFyXSwgZW52aXJvbm1lbnQubGlxdWlkaXR5KTtcbiAgICBjb25zdCB2YWx1ZXNCeUdyb3VwOiB7IFtncm91cE5hbWU6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gICAgY29uc3QgYnVja2V0U2l6ZSA9IE1hdGgucm91bmQoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoIC8gTlVNQkVSX09GX0JVQ0tFVFMpO1xuICAgIGNvbnN0IGJ1Y2tldHM6IElCdWNrZXRbXSA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGg7IGkgKz0gYnVja2V0U2l6ZSkge1xuICAgICAgICBjb25zdCBidWNrZXQ6IElCdWNrZXQgPSB7XG4gICAgICAgICAgICBtYXg6IE51bWJlci5NSU5fVkFMVUUsXG4gICAgICAgICAgICBtaW46IE51bWJlci5NQVhfVkFMVUUsXG4gICAgICAgICAgICBzdWJCdWNrZXRzOiB7fVxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIGJ1Y2tldFNpemU7ICsraikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhcltqXTtcbiAgICAgICAgICAgIGJ1Y2tldC5taW4gPSBNYXRoLm1pbihidWNrZXQubWluLCB2YWx1ZSk7XG4gICAgICAgICAgICBidWNrZXQubWF4ID0gTWF0aC5tYXgoYnVja2V0Lm1heCwgdmFsdWUpO1xuXG4gICAgICAgICAgICBjb25zdCBncm91cCA9IGdyb3VwRm9yVmFsdWUoc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbal0sIGdyb3Vwcyk7XG4gICAgICAgICAgICB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdID0gKHZhbHVlc0J5R3JvdXBbZ3JvdXAubmFtZV0gfHwgMCkgKyAxO1xuICAgICAgICAgICAgY29uc3Qgc3ViQnVja2V0ID0gYnVja2V0LnN1YkJ1Y2tldHNbZ3JvdXAubmFtZV0gPSBidWNrZXQuc3ViQnVja2V0c1tncm91cC5uYW1lXSB8fCB7IGdyb3VwOiBncm91cC5uYW1lLCBtYXg6IE51bWJlci5NSU5fVkFMVUUsIG1pbjogTnVtYmVyLk1BWF9WQUxVRSB9O1xuICAgICAgICAgICAgc3ViQnVja2V0Lm1pbiA9IE1hdGgubWluKHN1YkJ1Y2tldC5taW4sIHZhbHVlKTtcbiAgICAgICAgICAgIHN1YkJ1Y2tldC5tYXggPSBNYXRoLm1heChzdWJCdWNrZXQubWF4LCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBidWNrZXRzLnB1c2goYnVja2V0KTtcbiAgICB9XG5cbiAgICBjb25zdCBub25FbXB0eUdyb3VwcyA9IGdyb3Vwcy5maWx0ZXIoZ3JvdXAgPT4gISF2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdKTtcbiAgICBub25FbXB0eUdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IGdyb3VwLnBlcmNlbnRhZ2UgPSB2YWx1ZXNCeUdyb3VwW2dyb3VwLm5hbWVdIC8gc2ltdWxhdGVkVmFsdWVzVGhpc1llYXIubGVuZ3RoKTtcblxuICAgIGNvbnN0IG9uZVNpeHRoID0gTWF0aC5yb3VuZChzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhci5sZW5ndGggLyA2KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBidWNrZXRzLFxuICAgICAgICBncm91cHM6IG5vbkVtcHR5R3JvdXBzLFxuICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIDFdLFxuICAgICAgICBtZWRpYW46IG1lZGlhbihzaW11bGF0ZWRWYWx1ZXNUaGlzWWVhciksXG4gICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbMF0sXG4gICAgICAgIHByb2plY3QsXG4gICAgICAgIHR3b1RoaXJkOiB7XG4gICAgICAgICAgICBtYXg6IHNpbXVsYXRlZFZhbHVlc1RoaXNZZWFyW3NpbXVsYXRlZFZhbHVlc1RoaXNZZWFyLmxlbmd0aCAtIG9uZVNpeHRoXSxcbiAgICAgICAgICAgIG1pbjogc2ltdWxhdGVkVmFsdWVzVGhpc1llYXJbb25lU2l4dGhdXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3luY01vbnRlQ2FybG8ob3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IGNyZWF0ZU1vbnRlQ2FybG9FbnZpcm9ubWVudChpbml0aWFsaXplT3B0aW9ucyhvcHRpb25zKSk7XG5cbiAgICBsZXQgcHJvamVjdHM6IElQcm9qZWN0UmVzdWx0W10gPSBbXTtcbiAgICBmb3IgKGNvbnN0IHByb2plY3Qgb2Ygb3B0aW9ucyEucHJvamVjdHMhKSB7XG4gICAgICAgIHByb2plY3RzLnB1c2goY2FsY3VsYXRlUHJvamVjdChwcm9qZWN0LCBlbnZpcm9ubWVudCkpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9qZWN0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcmFsbGVsTW9udGVDYXJsbyh1c2VyT3B0aW9ucz86IElNb250ZUNhcmxvU2ltdWxhdGlvbk9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHRpb25zID0gaW5pdGlhbGl6ZU9wdGlvbnModXNlck9wdGlvbnMpO1xuICAgIHJldHVybiBwYXJhbGxlbFxuICAgICAgICAuZnJvbShvcHRpb25zLnByb2plY3RzLCB7IG1pblZhbHVlc1BlclRhc2s6IDIgfSlcbiAgICAgICAgLmluRW52aXJvbm1lbnQoY3JlYXRlTW9udGVDYXJsb0Vudmlyb25tZW50LCBvcHRpb25zKVxuICAgICAgICAubWFwKGNhbGN1bGF0ZVByb2plY3QpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RyYW5zcGlsZWQvbW9udGUtY2FybG8udHMiLCIvKiFcbiAqIFJhbmRvbS5qcyB2ZXJzaW9uIDAuMi42XG4gKiBjdXJsIGh0dHA6Ly9zaW1qcy5jb20vX2Rvd25sb2Fkcy9yYW5kb20tMC4yNi1kZWJ1Zy5qc1xuICovXG5cbiAvKiogUmFuZG9tLmpzIGxpYnJhcnkuXG4gKlxuICogVGhlIGNvZGUgaXMgbGljZW5zZWQgYXMgTEdQTC5cbiovXG5cbi8qXG4gICBBIEMtcHJvZ3JhbSBmb3IgTVQxOTkzNywgd2l0aCBpbml0aWFsaXphdGlvbiBpbXByb3ZlZCAyMDAyLzEvMjYuXG4gICBDb2RlZCBieSBUYWt1amkgTmlzaGltdXJhIGFuZCBNYWtvdG8gTWF0c3Vtb3RvLlxuXG4gICBCZWZvcmUgdXNpbmcsIGluaXRpYWxpemUgdGhlIHN0YXRlIGJ5IHVzaW5nIGluaXRfZ2VucmFuZChzZWVkKVxuICAgb3IgaW5pdF9ieV9hcnJheShpbml0X2tleSwga2V5X2xlbmd0aCkuXG5cbiAgIENvcHlyaWdodCAoQykgMTk5NyAtIDIwMDIsIE1ha290byBNYXRzdW1vdG8gYW5kIFRha3VqaSBOaXNoaW11cmEsXG4gICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuXG4gICBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXRcbiAgIG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uc1xuICAgYXJlIG1ldDpcblxuICAgICAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG5cbiAgICAgMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZVxuICAgICAgICBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuXG4gICAgIDMuIFRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBub3QgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGVcbiAgICAgICAgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuXG4gICAgICAgIHBlcm1pc3Npb24uXG5cbiAgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAgIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAgIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICAgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SXG4gICBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcbiAgIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTyxcbiAgIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUlxuICAgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxuICAgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcbiAgIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICAgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG5cblxuICAgQW55IGZlZWRiYWNrIGlzIHZlcnkgd2VsY29tZS5cbiAgIGh0dHA6Ly93d3cubWF0aC5zY2kuaGlyb3NoaW1hLXUuYWMuanAvfm0tbWF0L01UL2VtdC5odG1sXG4gICBlbWFpbDogbS1tYXQgQCBtYXRoLnNjaS5oaXJvc2hpbWEtdS5hYy5qcCAocmVtb3ZlIHNwYWNlKVxuICovXG5cbnZhciBSYW5kb20gPSBmdW5jdGlvbihzZWVkKSB7XG5cdHNlZWQgPSAoc2VlZCA9PT0gdW5kZWZpbmVkKSA/IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgOiBzZWVkO1xuXHRpZiAodHlwZW9mKHNlZWQpICE9PSAnbnVtYmVyJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0fHwgTWF0aC5jZWlsKHNlZWQpICE9IE1hdGguZmxvb3Ioc2VlZCkpIHsgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihcInNlZWQgdmFsdWUgbXVzdCBiZSBhbiBpbnRlZ2VyXCIpOyAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cblx0LyogUGVyaW9kIHBhcmFtZXRlcnMgKi9cblx0dGhpcy5OID0gNjI0O1xuXHR0aGlzLk0gPSAzOTc7XG5cdHRoaXMuTUFUUklYX0EgPSAweDk5MDhiMGRmOyAgIC8qIGNvbnN0YW50IHZlY3RvciBhICovXG5cdHRoaXMuVVBQRVJfTUFTSyA9IDB4ODAwMDAwMDA7IC8qIG1vc3Qgc2lnbmlmaWNhbnQgdy1yIGJpdHMgKi9cblx0dGhpcy5MT1dFUl9NQVNLID0gMHg3ZmZmZmZmZjsgLyogbGVhc3Qgc2lnbmlmaWNhbnQgciBiaXRzICovXG5cblx0dGhpcy5tdCA9IG5ldyBBcnJheSh0aGlzLk4pOyAvKiB0aGUgYXJyYXkgZm9yIHRoZSBzdGF0ZSB2ZWN0b3IgKi9cblx0dGhpcy5tdGk9dGhpcy5OKzE7IC8qIG10aT09TisxIG1lYW5zIG10W05dIGlzIG5vdCBpbml0aWFsaXplZCAqL1xuXG5cdC8vdGhpcy5pbml0X2dlbnJhbmQoc2VlZCk7XG5cdHRoaXMuaW5pdF9ieV9hcnJheShbc2VlZF0sIDEpO1xufTtcblxuLyogaW5pdGlhbGl6ZXMgbXRbTl0gd2l0aCBhIHNlZWQgKi9cblJhbmRvbS5wcm90b3R5cGUuaW5pdF9nZW5yYW5kID0gZnVuY3Rpb24ocykge1xuXHR0aGlzLm10WzBdID0gcyA+Pj4gMDtcblx0Zm9yICh0aGlzLm10aT0xOyB0aGlzLm10aTx0aGlzLk47IHRoaXMubXRpKyspIHtcblx0XHR2YXIgcyA9IHRoaXMubXRbdGhpcy5tdGktMV0gXiAodGhpcy5tdFt0aGlzLm10aS0xXSA+Pj4gMzApO1xuXHRcdHRoaXMubXRbdGhpcy5tdGldID0gKCgoKChzICYgMHhmZmZmMDAwMCkgPj4+IDE2KSAqIDE4MTI0MzMyNTMpIDw8IDE2KSArIChzICYgMHgwMDAwZmZmZikgKiAxODEyNDMzMjUzKVxuXHRcdCsgdGhpcy5tdGk7XG5cdFx0LyogU2VlIEtudXRoIFRBT0NQIFZvbDIuIDNyZCBFZC4gUC4xMDYgZm9yIG11bHRpcGxpZXIuICovXG5cdFx0LyogSW4gdGhlIHByZXZpb3VzIHZlcnNpb25zLCBNU0JzIG9mIHRoZSBzZWVkIGFmZmVjdCAgICovXG5cdFx0Lyogb25seSBNU0JzIG9mIHRoZSBhcnJheSBtdFtdLiAgICAgICAgICAgICAgICAgICAgICAgICovXG5cdFx0LyogMjAwMi8wMS8wOSBtb2RpZmllZCBieSBNYWtvdG8gTWF0c3Vtb3RvICAgICAgICAgICAgICovXG5cdFx0dGhpcy5tdFt0aGlzLm10aV0gPj4+PSAwO1xuXHRcdC8qIGZvciA+MzIgYml0IG1hY2hpbmVzICovXG5cdH1cbn07XG5cbi8qIGluaXRpYWxpemUgYnkgYW4gYXJyYXkgd2l0aCBhcnJheS1sZW5ndGggKi9cbi8qIGluaXRfa2V5IGlzIHRoZSBhcnJheSBmb3IgaW5pdGlhbGl6aW5nIGtleXMgKi9cbi8qIGtleV9sZW5ndGggaXMgaXRzIGxlbmd0aCAqL1xuLyogc2xpZ2h0IGNoYW5nZSBmb3IgQysrLCAyMDA0LzIvMjYgKi9cblJhbmRvbS5wcm90b3R5cGUuaW5pdF9ieV9hcnJheSA9IGZ1bmN0aW9uKGluaXRfa2V5LCBrZXlfbGVuZ3RoKSB7XG5cdHZhciBpLCBqLCBrO1xuXHR0aGlzLmluaXRfZ2VucmFuZCgxOTY1MDIxOCk7XG5cdGk9MTsgaj0wO1xuXHRrID0gKHRoaXMuTj5rZXlfbGVuZ3RoID8gdGhpcy5OIDoga2V5X2xlbmd0aCk7XG5cdGZvciAoOyBrOyBrLS0pIHtcblx0XHR2YXIgcyA9IHRoaXMubXRbaS0xXSBeICh0aGlzLm10W2ktMV0gPj4+IDMwKTtcblx0XHR0aGlzLm10W2ldID0gKHRoaXMubXRbaV0gXiAoKCgoKHMgJiAweGZmZmYwMDAwKSA+Pj4gMTYpICogMTY2NDUyNSkgPDwgMTYpICsgKChzICYgMHgwMDAwZmZmZikgKiAxNjY0NTI1KSkpXG5cdFx0KyBpbml0X2tleVtqXSArIGo7IC8qIG5vbiBsaW5lYXIgKi9cblx0XHR0aGlzLm10W2ldID4+Pj0gMDsgLyogZm9yIFdPUkRTSVpFID4gMzIgbWFjaGluZXMgKi9cblx0XHRpKys7IGorKztcblx0XHRpZiAoaT49dGhpcy5OKSB7IHRoaXMubXRbMF0gPSB0aGlzLm10W3RoaXMuTi0xXTsgaT0xOyB9XG5cdFx0aWYgKGo+PWtleV9sZW5ndGgpIGo9MDtcblx0fVxuXHRmb3IgKGs9dGhpcy5OLTE7IGs7IGstLSkge1xuXHRcdHZhciBzID0gdGhpcy5tdFtpLTFdIF4gKHRoaXMubXRbaS0xXSA+Pj4gMzApO1xuXHRcdHRoaXMubXRbaV0gPSAodGhpcy5tdFtpXSBeICgoKCgocyAmIDB4ZmZmZjAwMDApID4+PiAxNikgKiAxNTY2MDgzOTQxKSA8PCAxNikgKyAocyAmIDB4MDAwMGZmZmYpICogMTU2NjA4Mzk0MSkpXG5cdFx0LSBpOyAvKiBub24gbGluZWFyICovXG5cdFx0dGhpcy5tdFtpXSA+Pj49IDA7IC8qIGZvciBXT1JEU0laRSA+IDMyIG1hY2hpbmVzICovXG5cdFx0aSsrO1xuXHRcdGlmIChpPj10aGlzLk4pIHsgdGhpcy5tdFswXSA9IHRoaXMubXRbdGhpcy5OLTFdOyBpPTE7IH1cblx0fVxuXG5cdHRoaXMubXRbMF0gPSAweDgwMDAwMDAwOyAvKiBNU0IgaXMgMTsgYXNzdXJpbmcgbm9uLXplcm8gaW5pdGlhbCBhcnJheSAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwweGZmZmZmZmZmXS1pbnRlcnZhbCAqL1xuUmFuZG9tLnByb3RvdHlwZS5nZW5yYW5kX2ludDMyID0gZnVuY3Rpb24oKSB7XG5cdHZhciB5O1xuXHR2YXIgbWFnMDEgPSBuZXcgQXJyYXkoMHgwLCB0aGlzLk1BVFJJWF9BKTtcblx0LyogbWFnMDFbeF0gPSB4ICogTUFUUklYX0EgIGZvciB4PTAsMSAqL1xuXG5cdGlmICh0aGlzLm10aSA+PSB0aGlzLk4pIHsgLyogZ2VuZXJhdGUgTiB3b3JkcyBhdCBvbmUgdGltZSAqL1xuXHRcdHZhciBraztcblxuXHRcdGlmICh0aGlzLm10aSA9PSB0aGlzLk4rMSkgICAvKiBpZiBpbml0X2dlbnJhbmQoKSBoYXMgbm90IGJlZW4gY2FsbGVkLCAqL1xuXHRcdFx0dGhpcy5pbml0X2dlbnJhbmQoNTQ4OSk7IC8qIGEgZGVmYXVsdCBpbml0aWFsIHNlZWQgaXMgdXNlZCAqL1xuXG5cdFx0Zm9yIChraz0wO2trPHRoaXMuTi10aGlzLk07a2srKykge1xuXHRcdFx0eSA9ICh0aGlzLm10W2trXSZ0aGlzLlVQUEVSX01BU0spfCh0aGlzLm10W2trKzFdJnRoaXMuTE9XRVJfTUFTSyk7XG5cdFx0XHR0aGlzLm10W2trXSA9IHRoaXMubXRba2srdGhpcy5NXSBeICh5ID4+PiAxKSBeIG1hZzAxW3kgJiAweDFdO1xuXHRcdH1cblx0XHRmb3IgKDtrazx0aGlzLk4tMTtraysrKSB7XG5cdFx0XHR5ID0gKHRoaXMubXRba2tdJnRoaXMuVVBQRVJfTUFTSyl8KHRoaXMubXRba2srMV0mdGhpcy5MT1dFUl9NQVNLKTtcblx0XHRcdHRoaXMubXRba2tdID0gdGhpcy5tdFtraysodGhpcy5NLXRoaXMuTildIF4gKHkgPj4+IDEpIF4gbWFnMDFbeSAmIDB4MV07XG5cdFx0fVxuXHRcdHkgPSAodGhpcy5tdFt0aGlzLk4tMV0mdGhpcy5VUFBFUl9NQVNLKXwodGhpcy5tdFswXSZ0aGlzLkxPV0VSX01BU0spO1xuXHRcdHRoaXMubXRbdGhpcy5OLTFdID0gdGhpcy5tdFt0aGlzLk0tMV0gXiAoeSA+Pj4gMSkgXiBtYWcwMVt5ICYgMHgxXTtcblxuXHRcdHRoaXMubXRpID0gMDtcblx0fVxuXG5cdHkgPSB0aGlzLm10W3RoaXMubXRpKytdO1xuXG5cdC8qIFRlbXBlcmluZyAqL1xuXHR5IF49ICh5ID4+PiAxMSk7XG5cdHkgXj0gKHkgPDwgNykgJiAweDlkMmM1NjgwO1xuXHR5IF49ICh5IDw8IDE1KSAmIDB4ZWZjNjAwMDA7XG5cdHkgXj0gKHkgPj4+IDE4KTtcblxuXHRyZXR1cm4geSA+Pj4gMDtcbn07XG5cbi8qIGdlbmVyYXRlcyBhIHJhbmRvbSBudW1iZXIgb24gWzAsMHg3ZmZmZmZmZl0taW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9pbnQzMSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpPj4+MSk7XG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uIFswLDFdLXJlYWwtaW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9yZWFsMSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5nZW5yYW5kX2ludDMyKCkqKDEuMC80Mjk0OTY3Mjk1LjApO1xuXHQvKiBkaXZpZGVkIGJ5IDJeMzItMSAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxKS1yZWFsLWludGVydmFsICovXG5SYW5kb20ucHJvdG90eXBlLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5weXRob25Db21wYXRpYmlsaXR5KSB7XG5cdFx0aWYgKHRoaXMuc2tpcCkge1xuXHRcdFx0dGhpcy5nZW5yYW5kX2ludDMyKCk7XG5cdFx0fVxuXHRcdHRoaXMuc2tpcCA9IHRydWU7XG5cdH1cblx0cmV0dXJuIHRoaXMuZ2VucmFuZF9pbnQzMigpKigxLjAvNDI5NDk2NzI5Ni4wKTtcblx0LyogZGl2aWRlZCBieSAyXjMyICovXG59O1xuXG4vKiBnZW5lcmF0ZXMgYSByYW5kb20gbnVtYmVyIG9uICgwLDEpLXJlYWwtaW50ZXJ2YWwgKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9yZWFsMyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gKHRoaXMuZ2VucmFuZF9pbnQzMigpICsgMC41KSooMS4wLzQyOTQ5NjcyOTYuMCk7XG5cdC8qIGRpdmlkZWQgYnkgMl4zMiAqL1xufTtcblxuLyogZ2VuZXJhdGVzIGEgcmFuZG9tIG51bWJlciBvbiBbMCwxKSB3aXRoIDUzLWJpdCByZXNvbHV0aW9uKi9cblJhbmRvbS5wcm90b3R5cGUuZ2VucmFuZF9yZXM1MyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgYT10aGlzLmdlbnJhbmRfaW50MzIoKT4+PjUsIGI9dGhpcy5nZW5yYW5kX2ludDMyKCk+Pj42O1xuXHRyZXR1cm4oYSo2NzEwODg2NC4wK2IpKigxLjAvOTAwNzE5OTI1NDc0MDk5Mi4wKTtcbn07XG5cbi8qIFRoZXNlIHJlYWwgdmVyc2lvbnMgYXJlIGR1ZSB0byBJc2FrdSBXYWRhLCAyMDAyLzAxLzA5IGFkZGVkICovXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuUmFuZG9tLnByb3RvdHlwZS5MT0c0ID0gTWF0aC5sb2coNC4wKTtcblJhbmRvbS5wcm90b3R5cGUuU0dfTUFHSUNDT05TVCA9IDEuMCArIE1hdGgubG9nKDQuNSk7XG5cblJhbmRvbS5wcm90b3R5cGUuZXhwb25lbnRpYWwgPSBmdW5jdGlvbiAobGFtYmRhKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwiZXhwb25lbnRpYWwoKSBtdXN0IFwiICAgICAvLyBBUkdfQ0hFQ0tcblx0XHRcdFx0KyBcIiBiZSBjYWxsZWQgd2l0aCAnbGFtYmRhJyBwYXJhbWV0ZXJcIik7IC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cblx0dmFyIHIgPSB0aGlzLnJhbmRvbSgpO1xuXHRyZXR1cm4gLU1hdGgubG9nKHIpIC8gbGFtYmRhO1xufTtcblxuUmFuZG9tLnByb3RvdHlwZS5nYW1tYSA9IGZ1bmN0aW9uIChhbHBoYSwgYmV0YSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcImdhbW1hKCkgbXVzdCBiZSBjYWxsZWRcIiAgLy8gQVJHX0NIRUNLXG5cdFx0XHRcdCsgXCIgd2l0aCBhbHBoYSBhbmQgYmV0YSBwYXJhbWV0ZXJzXCIpOyAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdC8qIEJhc2VkIG9uIFB5dGhvbiAyLjYgc291cmNlIGNvZGUgb2YgcmFuZG9tLnB5LlxuXHQgKi9cblxuXHRpZiAoYWxwaGEgPiAxLjApIHtcblx0XHR2YXIgYWludiA9IE1hdGguc3FydCgyLjAgKiBhbHBoYSAtIDEuMCk7XG5cdFx0dmFyIGJiYiA9IGFscGhhIC0gdGhpcy5MT0c0O1xuXHRcdHZhciBjY2MgPSBhbHBoYSArIGFpbnY7XG5cblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdFx0dmFyIHUxID0gdGhpcy5yYW5kb20oKTtcblx0XHRcdGlmICgodTEgPCAxZS03KSB8fCAodSA+IDAuOTk5OTk5OSkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgdTIgPSAxLjAgLSB0aGlzLnJhbmRvbSgpO1xuXHRcdFx0dmFyIHYgPSBNYXRoLmxvZyh1MSAvICgxLjAgLSB1MSkpIC8gYWludjtcblx0XHRcdHZhciB4ID0gYWxwaGEgKiBNYXRoLmV4cCh2KTtcblx0XHRcdHZhciB6ID0gdTEgKiB1MSAqIHUyO1xuXHRcdFx0dmFyIHIgPSBiYmIgKyBjY2MgKiB2IC0geDtcblx0XHRcdGlmICgociArIHRoaXMuU0dfTUFHSUNDT05TVCAtIDQuNSAqIHogPj0gMC4wKSB8fCAociA+PSBNYXRoLmxvZyh6KSkpIHtcblx0XHRcdFx0cmV0dXJuIHggKiBiZXRhO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmIChhbHBoYSA9PSAxLjApIHtcblx0XHR2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0d2hpbGUgKHUgPD0gMWUtNykge1xuXHRcdFx0dSA9IHRoaXMucmFuZG9tKCk7XG5cdFx0fVxuXHRcdHJldHVybiAtIE1hdGgubG9nKHUpICogYmV0YTtcblx0fSBlbHNlIHtcblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdFx0dmFyIHUgPSB0aGlzLnJhbmRvbSgpO1xuXHRcdFx0dmFyIGIgPSAoTWF0aC5FICsgYWxwaGEpIC8gTWF0aC5FO1xuXHRcdFx0dmFyIHAgPSBiICogdTtcblx0XHRcdGlmIChwIDw9IDEuMCkge1xuXHRcdFx0XHR2YXIgeCA9IE1hdGgucG93KHAsIDEuMCAvIGFscGhhKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB4ID0gLSBNYXRoLmxvZygoYiAtIHApIC8gYWxwaGEpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHUxID0gdGhpcy5yYW5kb20oKTtcblx0XHRcdGlmIChwID4gMS4wKSB7XG5cdFx0XHRcdGlmICh1MSA8PSBNYXRoLnBvdyh4LCAoYWxwaGEgLSAxLjApKSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKHUxIDw9IE1hdGguZXhwKC14KSkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHggKiBiZXRhO1xuXHR9XG5cbn07XG5cblJhbmRvbS5wcm90b3R5cGUubm9ybWFsID0gZnVuY3Rpb24gKG11LCBzaWdtYSkge1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAyKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJub3JtYWwoKSBtdXN0IGJlIGNhbGxlZFwiICAvLyBBUkdfQ0hFQ0tcblx0XHRcdFx0KyBcIiB3aXRoIG11IGFuZCBzaWdtYSBwYXJhbWV0ZXJzXCIpOyAgICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdHZhciB6ID0gdGhpcy5sYXN0Tm9ybWFsO1xuXHR0aGlzLmxhc3ROb3JtYWwgPSBOYU47XG5cdGlmICgheikge1xuXHRcdHZhciBhID0gdGhpcy5yYW5kb20oKSAqIDIgKiBNYXRoLlBJO1xuXHRcdHZhciBiID0gTWF0aC5zcXJ0KC0yLjAgKiBNYXRoLmxvZygxLjAgLSB0aGlzLnJhbmRvbSgpKSk7XG5cdFx0eiA9IE1hdGguY29zKGEpICogYjtcblx0XHR0aGlzLmxhc3ROb3JtYWwgPSBNYXRoLnNpbihhKSAqIGI7XG5cdH1cblx0cmV0dXJuIG11ICsgeiAqIHNpZ21hO1xufTtcblxuUmFuZG9tLnByb3RvdHlwZS5wYXJldG8gPSBmdW5jdGlvbiAoYWxwaGEpIHtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkgeyAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0XHR0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJwYXJldG8oKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdFx0XHQrIFwiIHdpdGggYWxwaGEgcGFyYW1ldGVyXCIpOyAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXG5cdHZhciB1ID0gdGhpcy5yYW5kb20oKTtcblx0cmV0dXJuIDEuMCAvIE1hdGgucG93KCgxIC0gdSksIDEuMCAvIGFscGhhKTtcbn07XG5cblJhbmRvbS5wcm90b3R5cGUudHJpYW5ndWxhciA9IGZ1bmN0aW9uIChsb3dlciwgdXBwZXIsIG1vZGUpIHtcblx0Ly8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Ucmlhbmd1bGFyX2Rpc3RyaWJ1dGlvblxuXHRpZiAoYXJndW1lbnRzLmxlbmd0aCAhPSAzKSB7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRcdHRocm93IG5ldyBTeW50YXhFcnJvcihcInRyaWFuZ3VsYXIoKSBtdXN0IGJlIGNhbGxlZFwiIC8vIEFSR19DSEVDS1xuXHRcdCsgXCIgd2l0aCBsb3dlciwgdXBwZXIgYW5kIG1vZGUgcGFyYW1ldGVyc1wiKTsgICAgLy8gQVJHX0NIRUNLXG5cdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBUkdfQ0hFQ0tcblxuXHR2YXIgYyA9IChtb2RlIC0gbG93ZXIpIC8gKHVwcGVyIC0gbG93ZXIpO1xuXHR2YXIgdSA9IHRoaXMucmFuZG9tKCk7XG5cblx0aWYgKHUgPD0gYykge1xuXHRcdHJldHVybiBsb3dlciArIE1hdGguc3FydCh1ICogKHVwcGVyIC0gbG93ZXIpICogKG1vZGUgLSBsb3dlcikpO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB1cHBlciAtIE1hdGguc3FydCgoMSAtIHUpICogKHVwcGVyIC0gbG93ZXIpICogKHVwcGVyIC0gbW9kZSkpO1xuXHR9XG59O1xuXG5SYW5kb20ucHJvdG90eXBlLnVuaWZvcm0gPSBmdW5jdGlvbiAobG93ZXIsIHVwcGVyKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwidW5pZm9ybSgpIG11c3QgYmUgY2FsbGVkXCIgLy8gQVJHX0NIRUNLXG5cdFx0KyBcIiB3aXRoIGxvd2VyIGFuZCB1cHBlciBwYXJhbWV0ZXJzXCIpOyAgICAvLyBBUkdfQ0hFQ0tcblx0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFSR19DSEVDS1xuXHRyZXR1cm4gbG93ZXIgKyB0aGlzLnJhbmRvbSgpICogKHVwcGVyIC0gbG93ZXIpO1xufTtcblxuUmFuZG9tLnByb3RvdHlwZS53ZWlidWxsID0gZnVuY3Rpb24gKGFscGhhLCBiZXRhKSB7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdFx0dGhyb3cgbmV3IFN5bnRheEVycm9yKFwid2VpYnVsbCgpIG11c3QgYmUgY2FsbGVkXCIgLy8gQVJHX0NIRUNLXG5cdFx0KyBcIiB3aXRoIGFscGhhIGFuZCBiZXRhIHBhcmFtZXRlcnNcIik7ICAgIC8vIEFSR19DSEVDS1xuXHR9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQVJHX0NIRUNLXG5cdHZhciB1ID0gMS4wIC0gdGhpcy5yYW5kb20oKTtcblx0cmV0dXJuIGFscGhhICogTWF0aC5wb3coLU1hdGgubG9nKHUpLCAxLjAgLyBiZXRhKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zaW1qcy1yYW5kb20vc2ltanMtcmFuZG9tLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDIiXSwic291cmNlUm9vdCI6IiJ9