/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/vm.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/compiler/codegen/index.js":
/*!***************************************!*\
  !*** ./src/compiler/codegen/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = generate;

/**
 * Created by Sandon on 2017/5/9.
 */
function generate(ast) {}

/***/ }),

/***/ "./src/compiler/helper.js":
/*!********************************!*\
  !*** ./src/compiler/helper.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAndRemoveAttr = getAndRemoveAttr;

/**
 * Created by Sandon on 2017/5/16.
 */
function getAndRemoveAttr(el, name) {
  let val;
  const attrsList = el.attrsList;

  for (let i = 0, len = attrsList.length; i !== len; i++) {
    if (attrsList[i].name === name) {
      val = attrsList[i].value;
      attrsList.splice(i, 1);
      break;
    }
  }

  return val;
}

/***/ }),

/***/ "./src/compiler/index.js":
/*!*******************************!*\
  !*** ./src/compiler/index.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;

var _parser = __webpack_require__(/*! ./parser */ "./src/compiler/parser/index.js");

var _codegen = __webpack_require__(/*! ./codegen */ "./src/compiler/codegen/index.js");

/**
 * Created by Sandon on 2017/5/2.
 */
function compile(template) {
  const ast = (0, _parser.parse)(template.trim());
  const code = (0, _codegen.generate)(ast);
  return {
    ast,
    render: code.render
  };
}

/***/ }),

/***/ "./src/compiler/parser/html-parser.js":
/*!********************************************!*\
  !*** ./src/compiler/parser/html-parser.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHTML = parseHTML;

/**
 * Created by Sandon on 2017/5/2.
 */
// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

function parseHTML(html, options) {
  const stack = [];
  let index = 0; // relative to original html string

  let last, lastTag;

  while (html) {
    last = html;
    let textEnd = html.indexOf('<'); // relative to html string in this while loop

    if (textEnd === 0) {
      // End tag:
      const endTagMatch = html.match(endTag);

      if (endTagMatch) {
        const curIndex = index;
        advance(endTagMatch[0].length);
        parseEndTag(endTagMatch[1], curIndex, index);
        continue;
      } // Start tag:


      const startTagMatch = parseStartTag();

      if (startTagMatch) {
        handleStartTag(startTagMatch);
        continue;
      }
    }

    let rest, next;

    if (textEnd >= 0) {
      // rest = html.slice(textEnd)
      // while (
      //   !endTag.test(rest) &&
      //   !startTagOpen.test(rest)
      //   ) {
      //   // < in plain text, be forgiving and treat it as text
      //   next = rest.indexOf('<', 1) // relative to 'rest'
      //   if (next < 0) {
      //     textEnd = html.length
      //     break
      //   }
      //   textEnd += next
      //   rest = html.slice(textEnd)
      // }
      options.chars(html.substring(0, textEnd));
      advance(textEnd);
    }

    if (textEnd < 0) {
      options.chars(html);
      html = '';
    }
  } // Clean up any remaining tags


  parseEndTag();

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen);

    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      let end, attr;

      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }

      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function handleStartTag(match) {
    const tagName = match.tagName;
    const unary = !!match.unarySlash;
    const attrs = match.attrs.map(args => {
      return {
        name: args[1],
        value: args[3] || args[4] || args[5] || ''
      };
    });

    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCasedTag: tagName.toLowerCase(),
        attrs: attrs
      });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag(tagName, start, end) {
    let pos, lowerCasedTagName;
    if (start == null) start = index;
    if (end == null) end = index; // Find the closest opened tag of the same type

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();

      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break;
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (let i = stack.length - 1; i >= pos; i--) {
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      } // Remove the open elements from the stack


      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    }
  }
}

/***/ }),

/***/ "./src/compiler/parser/index.js":
/*!**************************************!*\
  !*** ./src/compiler/parser/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

var _htmlParser = __webpack_require__(/*! ./html-parser */ "./src/compiler/parser/html-parser.js");

var _helper = __webpack_require__(/*! ../helper */ "./src/compiler/helper.js");

/**
 * Created by Sandon on 2017/5/2.
 */
function parse(template) {
  let root;
  let currentParent;
  (0, _htmlParser.parseHtml)(template, {
    start(tag, attrs, unary) {
      let element = {
        type: 1,
        tag,
        attrsList: attrs,
        parent: currentParent,
        children: []
      };
      processFor(element);
      processIf(element, currentParent);

      if (!root) {
        root = element;
      }

      if (currentParent) {
        currentParent.children.push(element);
      }

      if (!unary) {
        currentParent = element;
      }
    },

    end() {
      currentParent = currentParent.parent;
    },

    chars(text) {
      if (!currentParent) {
        return;
      }

      if (text) {
        let exp = parseText(text);

        if (exp) {
          currentParent.children.push({
            type: 2,
            // literal expression
            expression: exp
          });
        } else {
          currentParent.children.push({
            type: 3,
            // normal text
            text
          });
        }
      }
    }

  });
  return root;
}
/**
 *  (item, key, index) in itemList
 *  el.for = 'itemList'
 *  el.alias = 'item'
 *  el.iterator1 = 'key'
 *  el.iterator2 = 'index'
 */


function processFor(el) {
  let exp;

  if (exp = (0, _helper.getAndRemoveAttr)(el, 'v-for')) {
    const res = parseFor(exp);

    if (res) {
      Object.assign(el, res);
    }
  }
}

function parseFor(exp) {
  const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  const stripParensRE = /^\(|\)$/g;
  const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/; // (item, key, index) in itemList

  const inMatch = exp.match(forAliasRE);
  if (!inMatch) return;
  const res = {};
  res.for = inMatch[2].trim(); // 'itemList'

  const alias = inMatch[1].trim().replace(stripParensRE, ''); // (item, key, index) => item, key, index

  const iteratorMatch = alias.match(forIteratorRE);

  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim(); // 'item'

    res.iterator1 = iteratorMatch[1].trim(); // 'key'

    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim(); // 'index'
    }
  } else {
    res.alias = alias;
  }

  return res;
}

function processIf(el, parent) {
  let exp;

  if (exp = (0, _helper.getAndRemoveAttr)(el, 'v-if')) {
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else if (exp = (0, _helper.getAndRemoveAttr)(el, 'v-else-if')) {
    const prev = findPrevElement(parent.children);
    prev && addIfCondition(prev, {
      exp: exp,
      block: el
    });
  } else if (exp = (0, _helper.getAndRemoveAttr)(el, 'v-else')) {
    const prev = findPrevElement(parent.children);
    prev && addIfCondition(prev, {
      exp: exp,
      block: el
    });
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }

  el.ifConditions.push(condition);
}

function findPrevElement(children) {
  let i = children.length;

  while (i--) {
    if (children[i].type === 1) {
      return children[i];
    } else {
      children.pop();
    }
  }
}
/**
 * text parser
 * 'abc{{name}}xyz' => '"abc"+_s(name)+"xyz"'
 */


function parseText(text) {
  const tagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  if (!tagRE.test(text)) {
    return;
  }

  let lastIndex = tagRE.lastIndex = 0;
  let match;
  let tokens = [];

  while (match = tagRE.exec(text)) {
    // there are normal text before {{
    if (match.index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, match.index)));
    } // token in expression


    tokens.push(`_s(${match[1].trim()})`);
    lastIndex = tagRE.lastIndex;
  } // there are normal text after }}


  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }

  return tokens.join('+');
} // console.log(parseText('abc{{name}}xyz'))

/***/ }),

/***/ "./src/reactive-object/array.js":
/*!**************************************!*\
  !*** ./src/reactive-object/array.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Created by Sandon on 2017/3/18.
 */
const originArrayProto = Array.prototype;
const reactiveArrayProto = exports.reactiveArrayProto = Object.create(originArrayProto);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  // console.log('method:' + method)
  const originMethod = originArrayProto[method];
  Object.defineProperty(reactiveArrayProto, method, {
    value: function () {
      const result = originMethod.apply(this, arguments);

      this.__reactiveObject__.dep.notify();

      return result;
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
});

/***/ }),

/***/ "./src/reactive-object/dep.js":
/*!************************************!*\
  !*** ./src/reactive-object/dep.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by Sandon on 2017/3/4.
 */

/**
 * A dep is an observable that can have multiple
 * watchers(directives in template or watchers bound manually) subscribing to it.
 */
class Dep {
  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  constructor() {
    _defineProperty(this, "subs", []);
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    // stablize the subscriber list first
    const subs = this.subs.slice();
    subs.forEach(sub => sub.update());
  }

}

exports.default = Dep;

_defineProperty(Dep, "target", null);

_defineProperty(Dep, "_targetStack", []);

_defineProperty(Dep, "pushTarget", function (targetWatcher) {
  Dep._targetStack.push(Dep.target);

  Dep.target = targetWatcher;
});

_defineProperty(Dep, "popTarget", function () {
  Dep.target = Dep._targetStack.pop();
});

/***/ }),

/***/ "./src/reactive-object/index.js":
/*!**************************************!*\
  !*** ./src/reactive-object/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineReactive = defineReactive;
exports.convert = convert;

var _dep = __webpack_require__(/*! ./dep */ "./src/reactive-object/dep.js");

var _dep2 = _interopRequireDefault(_dep);

var _util = __webpack_require__(/*! ../util */ "./src/util/index.js");

var _array = __webpack_require__(/*! ./array */ "./src/reactive-object/array.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ReactiveObject {
  constructor(val) {
    _defineProperty(this, "value", void 0);

    _defineProperty(this, "dep", void 0);

    this.value = val; // a Dep for the object self when manipulate a array (push,pop etc) or add/delete a property on object(array)

    this.dep = new _dep2.default();
    Object.defineProperty(val, '__reactiveObject__', {
      value: this,
      enumerable: false,
      writable: true,
      configurable: true
    });

    if (Array.isArray(val)) {
      (0, _util.augment)(val, _array.reactiveArrayProto);
    }
    /*
    // array is handled different from normal object for performance
    if (Array.isArray(val)) {
      this.observeArray(val)
    } else {
      this.walk(val)
    }
    */


    this.walk(val);
  }

  walk(obj) {
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
  }

  observeArray(arr) {
    arr.forEach(item => convert(item));
  }

}

exports.default = ReactiveObject; // add getter/setter for every key/value pair in object
// in getter: collect the dependency relationships for data (watchers depend on data)
// in setter: notify watchers to update when data changes

function defineReactive(obj, key, val) {
  let childObj = convert(val);
  const dep = new _dep2.default(); // a Dep for the key-value pair of object

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (_dep2.default.target) {
        // watcher depends on the key-value pair of the object
        dep.addSub(_dep2.default.target); // watcher depends on the value responding to the key.
        // this will be used when manipulate a array (push,pop etc) or add/delete a property on object(array)

        childObj && childObj.dep.addSub(_dep2.default.target); // if the value responding to the key is a Array,
        // dive into it to collect dependencies.
        // but why? because when converting to ReactiveObject
        // array is treated different from common object?
        // Array.isArray(val) && dependArray(val)
      }

      return val;
    },
    set: function reactiveSetter(newVal) {
      if (val === newVal) return;
      val = newVal;
      childObj = convert(val);
      dep.notify();
    }
  });
} // convert a normal object to ReactiveObject


function convert(val, vm) {
  if (!val || 'object' !== typeof val) return;
  if (val.__reactiveObject__) return val.__reactiveObject__;
  return new ReactiveObject(val);
}

function dependArray(arr) {
  arr.forEach(ele => {
    ele && ele.__reactiveObject__ && ele.__reactiveObject__.dep.addSub(_dep2.default.target);
    Array.isArray(ele) && dependArray(ele);
  });
}

/***/ }),

/***/ "./src/reactive-object/watcher.js":
/*!****************************************!*\
  !*** ./src/reactive-object/watcher.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dep = __webpack_require__(/*! ./dep */ "./src/reactive-object/dep.js");

var _dep2 = _interopRequireDefault(_dep);

var _util = __webpack_require__(/*! ../util */ "./src/util/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Sandon on 2017/3/4.
 */
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.cb = cb;
    this.vm = vm;
    this.getter = typeof expOrFn === 'function' ? expOrFn : (0, _util.parsePath)(expOrFn); // trigger getter function to be executed to collect dependency

    this.value = this.get();
  }

  get() {
    _dep2.default.pushTarget(this);

    const val = this.getter.call(this.vm, this.vm); // parsePath(this.expOrFn)(this.vm._data)

    _dep2.default.popTarget();

    return val;
  }

  update() {
    this.run();
  }

  run() {
    const newVal = this.get();

    if (this.value !== newVal) {
      const oldValue = this.value;
      this.value = newVal;
      this.cb && this.cb.call(this.vm, newVal, oldValue);
    }
  }

}

exports.default = Watcher;

/***/ }),

/***/ "./src/util/common.js":
/*!****************************!*\
  !*** ./src/util/common.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPrimitive = isPrimitive;

/**
 * Created by lipeng on 2018/11/28.
 */
function isPrimitive(value) {
  const type = typeof value;
  return type === 'string' || type === 'number' || type === 'symbol' || type === 'boolean';
}

/***/ }),

/***/ "./src/util/env.js":
/*!*************************!*\
  !*** ./src/util/env.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Created by Sandon on 2017/3/26.
 */
const hasProto = exports.hasProto = '__proto__' in {};

/***/ }),

/***/ "./src/util/index.js":
/*!***************************!*\
  !*** ./src/util/index.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lang = __webpack_require__(/*! ./lang */ "./src/util/lang.js");

Object.keys(_lang).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _lang[key];
    }
  });
});

var _env = __webpack_require__(/*! ./env */ "./src/util/env.js");

Object.keys(_env).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _env[key];
    }
  });
});

var _common = __webpack_require__(/*! ./common */ "./src/util/common.js");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});

/***/ }),

/***/ "./src/util/lang.js":
/*!**************************!*\
  !*** ./src/util/lang.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePath = parsePath;
exports.augment = augment;

var _env = __webpack_require__(/*! ./env */ "./src/util/env.js");

/**
 * Created by Sandon on 2017/3/26.
 */
function parsePath(path) {
  // case like: b[0][2].z[0].w
  const segments = path.split(/[\[\]\.]/).filter(ele => ele !== "");
  const len = segments.length;
  return function (vm) {
    let obj = vm._data;

    for (let i = 0; i !== len; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }

    return obj;
  };
}

function augment(target, src) {
  if (_env.hasProto) {
    target.__proto__ = src;
  } else {
    Object.getOwnPropertyNames(src).forEach(key => {
      Object.defineProperty(target, key, {
        value: src[key],
        enumerable: false,
        writable: true,
        configurable: true
      });
    });
  }
}

/***/ }),

/***/ "./src/vdom/create-element.js":
/*!************************************!*\
  !*** ./src/vdom/create-element.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = createElement;

var _vnode = __webpack_require__(/*! ./vnode */ "./src/vdom/vnode.js");

var _vnode2 = _interopRequireDefault(_vnode);

var _common = __webpack_require__(/*! ../util/common */ "./src/util/common.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by lipeng on 2018/11/28.
 */
function createElement(context, tag, data, children) {
  // normalize children
  if (children) {
    children = normalizeChildren(children);
  } // create VNode


  let vnode;

  if (typeof tag === 'string') {
    vnode = new _vnode2.default(tag, data, children, undefined, undefined, context);
  }

  return vnode;
}

function normalizeChildren(children) {
  if ((0, _common.isPrimitive)(children)) {
    return [new _vnode2.default(undefined, undefined, undefined, String(children))];
  } else if (Array.isArray(children)) {
    return children.map(child => {
      if ((0, _common.isPrimitive)(child)) {
        return new _vnode2.default(undefined, undefined, undefined, String(child));
      }

      return child;
    });
  }
}

function normalizeArrayChildren(children) {
  return children.map(child => {
    if ((0, _common.isPrimitive)(child)) {
      return new _vnode2.default(undefined, undefined, undefined, String(child));
    }

    return child;
  });
}

/***/ }),

/***/ "./src/vdom/vnode.js":
/*!***************************!*\
  !*** ./src/vdom/vnode.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Created by lipeng on 2018/11/27.
 */
class VNode {
  constructor(tag, data, children, text, elm, context) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.context = context;
  }

}

exports.default = VNode;

/***/ }),

/***/ "./src/vm.js":
/*!*******************!*\
  !*** ./src/vm.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _watcher = __webpack_require__(/*! ./reactive-object/watcher */ "./src/reactive-object/watcher.js");

var _watcher2 = _interopRequireDefault(_watcher);

var _reactiveObject = __webpack_require__(/*! ./reactive-object */ "./src/reactive-object/index.js");

var _index = __webpack_require__(/*! ./compiler/index */ "./src/compiler/index.js");

var _vnode = __webpack_require__(/*! ./vdom/vnode */ "./src/vdom/vnode.js");

var _vnode2 = _interopRequireDefault(_vnode);

var _createElement = __webpack_require__(/*! ./vdom/create-element */ "./src/vdom/create-element.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Sandon on 2017/3/5.
 */
class Vm {
  constructor(options = {}) {
    this.$options = options;
    this._data = this.$options.data;

    this._proxy();

    (0, _reactiveObject.convert)(this._data, this); // convert this._data to reactive
  }

  _proxy() {
    let self = this;
    Object.keys(this._data).forEach(key => {
      Object.defineProperty(self, key, {
        enumerable: true,
        configurable: true,
        get: function proxyGetter() {
          return self._data[key];
        },
        set: function proxySetter(newVal) {
          self._data[key] = newVal;
        }
      });
    });
  }

  $watch(expOrFn, cb) {
    new _watcher2.default(this, expOrFn, cb);
  }

  $mount(el) {
    el = document.querySelector(el);
    this.$el = el; // convert template to render function
    // const { render } = compile(this.$options.template)
    // this.$options.render = render
    // render to vnode tree, patch and add watcher

    const updateComponent = () => {
      this._update(this._render());
    };

    this._watcher = new _watcher2.default(this, updateComponent, null);

    if (this.$vnode == null) {
      this._isMounted = true;
    }
  }

  $createElement(tag, data, children) {
    return (0, _createElement.createElement)(this, tag, data, children);
  }

  _render() {
    const vm = this;
    const {
      render,
      _parentVnode
    } = vm.$options;
    vm.$vnode = _parentVnode;
    const vnode = render.call(vm, vm.$createElement);
    vnode.parent = _parentVnode;
    return vnode;
  }

  _update(vnode) {
    const vm = this;
    const prevEl = vm.$el;
    const prevVnode = vm._vnode;
    vm._vnode = vnode;

    if (!prevVnode) {
      // first render
      vm.$el = vm.__patch__(vm.$el, vnode);
    } else {
      // update
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
  }

  __patch__(oldVnode, vnode) {
    const insertedVnodeQueue = [];
    const isRealElement = oldVnode.nodeType !== undefined;

    if (isRealElement) {
      oldVnode = new _vnode2.default(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
    }

    const oldElm = oldVnode.elm;
    const parentElm = oldElm.parentElement; // create whole dom tree recursively

    createElm(vnode, insertedVnodeQueue, parentElm, oldElm.nextSibling); // remove old dom

    parentElm && parentElm.removeChild(oldVnode.elm);
    return vnode.elm;
  }

}

function createElm(vnode, insertedVnodeQueue, parentElm, refElm) {
  const data = vnode.data;
  const children = vnode.children;
  const tag = vnode.tag;

  if (tag) {
    vnode.elm = document.createElement(tag);
    createChildren(vnode, children, insertedVnodeQueue);
    parentElm.insertBefore(vnode.elm, refElm);
  } else {
    vnode.elm = document.createTextNode(vnode.text);
    parentElm.insertBefore(vnode.elm, refElm);
  }
}

function createChildren(vnode, children, insertedVnodeQueue) {
  const type = typeof vnode.text;

  if (Array.isArray(children)) {
    children.forEach((child, index) => {
      createElm(child, insertedVnodeQueue, vnode.elm, null);
    });
  } else if (type === 'string' || type === 'number' || type === 'boolean') {
    vnode.elm.appendChild(document.createTextNode(String(vnode.text)));
  }
}

exports.default = Vm;

if (typeof window !== 'undefined') {
  window['Vm'] = Vm;
} else {
  console.log('server');
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL2NvZGVnZW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL2hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL3BhcnNlci9odG1sLXBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvcGFyc2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9yZWFjdGl2ZS1vYmplY3QvYXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0aXZlLW9iamVjdC9kZXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0aXZlLW9iamVjdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3RpdmUtb2JqZWN0L3dhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9sYW5nLmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL2NyZWF0ZS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL3Zub2RlLmpzIiwid2VicGFjazovLy8uL3NyYy92bS5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZSIsImFzdCIsImdldEFuZFJlbW92ZUF0dHIiLCJlbCIsIm5hbWUiLCJ2YWwiLCJhdHRyc0xpc3QiLCJpIiwibGVuIiwibGVuZ3RoIiwidmFsdWUiLCJzcGxpY2UiLCJjb21waWxlIiwidGVtcGxhdGUiLCJ0cmltIiwiY29kZSIsInJlbmRlciIsInBhcnNlSFRNTCIsImF0dHJpYnV0ZSIsIm5jbmFtZSIsInFuYW1lQ2FwdHVyZSIsInN0YXJ0VGFnT3BlbiIsIlJlZ0V4cCIsInN0YXJ0VGFnQ2xvc2UiLCJlbmRUYWciLCJodG1sIiwib3B0aW9ucyIsInN0YWNrIiwiaW5kZXgiLCJsYXN0IiwibGFzdFRhZyIsInRleHRFbmQiLCJpbmRleE9mIiwiZW5kVGFnTWF0Y2giLCJtYXRjaCIsImN1ckluZGV4IiwiYWR2YW5jZSIsInBhcnNlRW5kVGFnIiwic3RhcnRUYWdNYXRjaCIsInBhcnNlU3RhcnRUYWciLCJoYW5kbGVTdGFydFRhZyIsInJlc3QiLCJuZXh0IiwiY2hhcnMiLCJzdWJzdHJpbmciLCJuIiwic3RhcnQiLCJ0YWdOYW1lIiwiYXR0cnMiLCJlbmQiLCJhdHRyIiwicHVzaCIsInVuYXJ5U2xhc2giLCJ1bmFyeSIsIm1hcCIsImFyZ3MiLCJ0YWciLCJsb3dlckNhc2VkVGFnIiwidG9Mb3dlckNhc2UiLCJwb3MiLCJsb3dlckNhc2VkVGFnTmFtZSIsInBhcnNlIiwicm9vdCIsImN1cnJlbnRQYXJlbnQiLCJlbGVtZW50IiwidHlwZSIsInBhcmVudCIsImNoaWxkcmVuIiwicHJvY2Vzc0ZvciIsInByb2Nlc3NJZiIsInRleHQiLCJleHAiLCJwYXJzZVRleHQiLCJleHByZXNzaW9uIiwicmVzIiwicGFyc2VGb3IiLCJPYmplY3QiLCJhc3NpZ24iLCJmb3JBbGlhc1JFIiwic3RyaXBQYXJlbnNSRSIsImZvckl0ZXJhdG9yUkUiLCJpbk1hdGNoIiwiZm9yIiwiYWxpYXMiLCJyZXBsYWNlIiwiaXRlcmF0b3JNYXRjaCIsIml0ZXJhdG9yMSIsIml0ZXJhdG9yMiIsImFkZElmQ29uZGl0aW9uIiwiYmxvY2siLCJwcmV2IiwiZmluZFByZXZFbGVtZW50IiwiY29uZGl0aW9uIiwiaWZDb25kaXRpb25zIiwicG9wIiwidGFnUkUiLCJ0ZXN0IiwibGFzdEluZGV4IiwidG9rZW5zIiwiZXhlYyIsIkpTT04iLCJzdHJpbmdpZnkiLCJzbGljZSIsImpvaW4iLCJvcmlnaW5BcnJheVByb3RvIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJyZWFjdGl2ZUFycmF5UHJvdG8iLCJjcmVhdGUiLCJmb3JFYWNoIiwibWV0aG9kIiwib3JpZ2luTWV0aG9kIiwiZGVmaW5lUHJvcGVydHkiLCJyZXN1bHQiLCJhcHBseSIsImFyZ3VtZW50cyIsIl9fcmVhY3RpdmVPYmplY3RfXyIsImRlcCIsIm5vdGlmeSIsImVudW1lcmFibGUiLCJ3cml0YWJsZSIsImNvbmZpZ3VyYWJsZSIsIkRlcCIsImNvbnN0cnVjdG9yIiwiYWRkU3ViIiwic3ViIiwic3VicyIsInVwZGF0ZSIsInRhcmdldFdhdGNoZXIiLCJfdGFyZ2V0U3RhY2siLCJ0YXJnZXQiLCJkZWZpbmVSZWFjdGl2ZSIsImNvbnZlcnQiLCJSZWFjdGl2ZU9iamVjdCIsImlzQXJyYXkiLCJ3YWxrIiwib2JqIiwia2V5cyIsImtleSIsIm9ic2VydmVBcnJheSIsImFyciIsIml0ZW0iLCJjaGlsZE9iaiIsImdldCIsInJlYWN0aXZlR2V0dGVyIiwic2V0IiwicmVhY3RpdmVTZXR0ZXIiLCJuZXdWYWwiLCJ2bSIsImRlcGVuZEFycmF5IiwiZWxlIiwiV2F0Y2hlciIsImV4cE9yRm4iLCJjYiIsImdldHRlciIsInB1c2hUYXJnZXQiLCJjYWxsIiwicG9wVGFyZ2V0IiwicnVuIiwib2xkVmFsdWUiLCJpc1ByaW1pdGl2ZSIsImhhc1Byb3RvIiwicGFyc2VQYXRoIiwiYXVnbWVudCIsInBhdGgiLCJzZWdtZW50cyIsInNwbGl0IiwiZmlsdGVyIiwiX2RhdGEiLCJzcmMiLCJfX3Byb3RvX18iLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiY3JlYXRlRWxlbWVudCIsImNvbnRleHQiLCJkYXRhIiwibm9ybWFsaXplQ2hpbGRyZW4iLCJ2bm9kZSIsIlZOb2RlIiwidW5kZWZpbmVkIiwiU3RyaW5nIiwiY2hpbGQiLCJub3JtYWxpemVBcnJheUNoaWxkcmVuIiwiZWxtIiwiVm0iLCIkb3B0aW9ucyIsIl9wcm94eSIsInNlbGYiLCJwcm94eUdldHRlciIsInByb3h5U2V0dGVyIiwiJHdhdGNoIiwiJG1vdW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGVsIiwidXBkYXRlQ29tcG9uZW50IiwiX3VwZGF0ZSIsIl9yZW5kZXIiLCJfd2F0Y2hlciIsIiR2bm9kZSIsIl9pc01vdW50ZWQiLCIkY3JlYXRlRWxlbWVudCIsIl9wYXJlbnRWbm9kZSIsInByZXZFbCIsInByZXZWbm9kZSIsIl92bm9kZSIsIl9fcGF0Y2hfXyIsIm9sZFZub2RlIiwiaW5zZXJ0ZWRWbm9kZVF1ZXVlIiwiaXNSZWFsRWxlbWVudCIsIm5vZGVUeXBlIiwib2xkRWxtIiwicGFyZW50RWxtIiwicGFyZW50RWxlbWVudCIsImNyZWF0ZUVsbSIsIm5leHRTaWJsaW5nIiwicmVtb3ZlQ2hpbGQiLCJyZWZFbG0iLCJjcmVhdGVDaGlsZHJlbiIsImluc2VydEJlZm9yZSIsImNyZWF0ZVRleHROb2RlIiwiYXBwZW5kQ2hpbGQiLCJ3aW5kb3ciLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUMvRWdCQSxRLEdBQUFBLFE7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QU4sQ0FBY25FLFFBQWQsQ0FBSixFQUE2QjtBQUMzQkEsWUFBUSxDQUFDMEMsT0FBVCxDQUFpQixDQUFDdUUsS0FBRCxFQUFReEosS0FBUixLQUFrQjtBQUNqQ3lMLGVBQVMsQ0FBQ2pDLEtBQUQsRUFBUTJCLGtCQUFSLEVBQTRCL0IsS0FBSyxDQUFDTSxHQUFsQyxFQUF1QyxJQUF2QyxDQUFUO0FBQ0QsS0FGRDtBQUdELEdBSkQsTUFJTyxJQUFJckgsSUFBSSxLQUFLLFFBQVQsSUFBcUJBLElBQUksS0FBSyxRQUE5QixJQUEwQ0EsSUFBSSxLQUFLLFNBQXZELEVBQWtFO0FBQ3ZFK0csU0FBSyxDQUFDTSxHQUFOLENBQVVzQyxXQUFWLENBQXNCN0IsUUFBUSxDQUFDNEIsY0FBVCxDQUF3QnhDLE1BQU0sQ0FBQ0gsS0FBSyxDQUFDMUcsSUFBUCxDQUE5QixDQUF0QjtBQUNEO0FBQ0Y7O2tCQUVjaUgsRTs7QUFFZixJQUFJLE9BQU9zQyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDQSxRQUFNLENBQUMsSUFBRCxDQUFOLEdBQWV0QyxFQUFmO0FBQ0QsQ0FGRCxNQUVPO0FBQ0x1QyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxRQUFaO0FBQ0QsQyIsImZpbGUiOiJ2bS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3ZtLmpzXCIpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzUvOS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlIChhc3QpIHtcblxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzUvMTYuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbmRSZW1vdmVBdHRyIChlbCwgbmFtZSkge1xuICBsZXQgdmFsXG4gIGNvbnN0IGF0dHJzTGlzdCA9IGVsLmF0dHJzTGlzdFxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXR0cnNMaXN0Lmxlbmd0aDsgaSAhPT0gbGVuOyBpKyspIHtcbiAgICBpZiAoYXR0cnNMaXN0W2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHZhbCA9IGF0dHJzTGlzdFtpXS52YWx1ZVxuICAgICAgYXR0cnNMaXN0LnNwbGljZShpLCAxKVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzUvMi5cbiAqL1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICcuL3BhcnNlcidcbmltcG9ydCAgeyBnZW5lcmF0ZSB9IGZyb20gJy4vY29kZWdlbidcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUgKHRlbXBsYXRlKSB7XG4gIGNvbnN0IGFzdCA9IHBhcnNlKHRlbXBsYXRlLnRyaW0oKSlcbiAgY29uc3QgY29kZSA9IGdlbmVyYXRlKGFzdClcblxuICByZXR1cm4ge1xuICAgIGFzdCxcbiAgICByZW5kZXI6IGNvZGUucmVuZGVyLFxuICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvNS8yLlxuICovXG5cbi8vIFJlZ3VsYXIgRXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgdGFncyBhbmQgYXR0cmlidXRlc1xuY29uc3QgYXR0cmlidXRlID0gL15cXHMqKFteXFxzXCInPD5cXC89XSspKD86XFxzKig9KVxccyooPzpcIihbXlwiXSopXCIrfCcoW14nXSopJyt8KFteXFxzXCInPTw+YF0rKSkpPy9cblxuY29uc3QgbmNuYW1lID0gJ1thLXpBLVpfXVtcXFxcd1xcXFwtXFxcXC5dKidcbmNvbnN0IHFuYW1lQ2FwdHVyZSA9IGAoKD86JHtuY25hbWV9XFxcXDopPyR7bmNuYW1lfSlgXG5jb25zdCBzdGFydFRhZ09wZW4gPSBuZXcgUmVnRXhwKGBePCR7cW5hbWVDYXB0dXJlfWApXG5jb25zdCBzdGFydFRhZ0Nsb3NlID0gL15cXHMqKFxcLz8pPi9cbmNvbnN0IGVuZFRhZyA9IG5ldyBSZWdFeHAoYF48XFxcXC8ke3FuYW1lQ2FwdHVyZX1bXj5dKj5gKVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VIVE1MIChodG1sLCBvcHRpb25zKSB7XG4gIGNvbnN0IHN0YWNrID0gW11cbiAgbGV0IGluZGV4ID0gMCAvLyByZWxhdGl2ZSB0byBvcmlnaW5hbCBodG1sIHN0cmluZ1xuICBsZXQgbGFzdCwgbGFzdFRhZ1xuICB3aGlsZSAoaHRtbCkge1xuICAgIGxhc3QgPSBodG1sXG5cbiAgICBsZXQgdGV4dEVuZCA9IGh0bWwuaW5kZXhPZignPCcpIC8vIHJlbGF0aXZlIHRvIGh0bWwgc3RyaW5nIGluIHRoaXMgd2hpbGUgbG9vcFxuICAgIGlmICh0ZXh0RW5kID09PSAwKSB7XG4gICAgICAvLyBFbmQgdGFnOlxuICAgICAgY29uc3QgZW5kVGFnTWF0Y2ggPSBodG1sLm1hdGNoKGVuZFRhZylcbiAgICAgIGlmIChlbmRUYWdNYXRjaCkge1xuICAgICAgICBjb25zdCBjdXJJbmRleCA9IGluZGV4XG4gICAgICAgIGFkdmFuY2UoZW5kVGFnTWF0Y2hbMF0ubGVuZ3RoKVxuICAgICAgICBwYXJzZUVuZFRhZyhlbmRUYWdNYXRjaFsxXSwgY3VySW5kZXgsIGluZGV4KVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBTdGFydCB0YWc6XG4gICAgICBjb25zdCBzdGFydFRhZ01hdGNoID0gcGFyc2VTdGFydFRhZygpXG4gICAgICBpZiAoc3RhcnRUYWdNYXRjaCkge1xuICAgICAgICBoYW5kbGVTdGFydFRhZyhzdGFydFRhZ01hdGNoKVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZXN0LCBuZXh0XG4gICAgaWYgKHRleHRFbmQgPj0gMCkge1xuICAgICAgLy8gcmVzdCA9IGh0bWwuc2xpY2UodGV4dEVuZClcbiAgICAgIC8vIHdoaWxlIChcbiAgICAgIC8vICAgIWVuZFRhZy50ZXN0KHJlc3QpICYmXG4gICAgICAvLyAgICFzdGFydFRhZ09wZW4udGVzdChyZXN0KVxuICAgICAgLy8gICApIHtcbiAgICAgIC8vICAgLy8gPCBpbiBwbGFpbiB0ZXh0LCBiZSBmb3JnaXZpbmcgYW5kIHRyZWF0IGl0IGFzIHRleHRcbiAgICAgIC8vICAgbmV4dCA9IHJlc3QuaW5kZXhPZignPCcsIDEpIC8vIHJlbGF0aXZlIHRvICdyZXN0J1xuICAgICAgLy8gICBpZiAobmV4dCA8IDApIHtcbiAgICAgIC8vICAgICB0ZXh0RW5kID0gaHRtbC5sZW5ndGhcbiAgICAgIC8vICAgICBicmVha1xuICAgICAgLy8gICB9XG4gICAgICAvLyAgIHRleHRFbmQgKz0gbmV4dFxuICAgICAgLy8gICByZXN0ID0gaHRtbC5zbGljZSh0ZXh0RW5kKVxuICAgICAgLy8gfVxuICAgICAgb3B0aW9ucy5jaGFycyhodG1sLnN1YnN0cmluZygwLCB0ZXh0RW5kKSlcbiAgICAgIGFkdmFuY2UodGV4dEVuZClcbiAgICB9XG5cbiAgICBpZiAodGV4dEVuZCA8IDApIHtcbiAgICAgIG9wdGlvbnMuY2hhcnMoaHRtbClcbiAgICAgIGh0bWwgPSAnJ1xuICAgIH1cbiAgfVxuXG4gIC8vIENsZWFuIHVwIGFueSByZW1haW5pbmcgdGFnc1xuICBwYXJzZUVuZFRhZygpXG5cbiAgZnVuY3Rpb24gYWR2YW5jZSAobikge1xuICAgIGluZGV4ICs9IG5cbiAgICBodG1sID0gaHRtbC5zdWJzdHJpbmcobilcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU3RhcnRUYWcgKCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gaHRtbC5tYXRjaChzdGFydFRhZ09wZW4pXG4gICAgaWYgKHN0YXJ0KSB7XG4gICAgICBjb25zdCBtYXRjaCA9IHtcbiAgICAgICAgdGFnTmFtZTogc3RhcnRbMV0sXG4gICAgICAgIGF0dHJzOiBbXSxcbiAgICAgICAgc3RhcnQ6IGluZGV4XG4gICAgICB9XG4gICAgICBhZHZhbmNlKHN0YXJ0WzBdLmxlbmd0aClcbiAgICAgIGxldCBlbmQsIGF0dHJcbiAgICAgIHdoaWxlICghKGVuZCA9IGh0bWwubWF0Y2goc3RhcnRUYWdDbG9zZSkpICYmIChhdHRyID0gaHRtbC5tYXRjaChhdHRyaWJ1dGUpKSkge1xuICAgICAgICBhZHZhbmNlKGF0dHJbMF0ubGVuZ3RoKVxuICAgICAgICBtYXRjaC5hdHRycy5wdXNoKGF0dHIpXG4gICAgICB9XG4gICAgICBpZiAoZW5kKSB7XG4gICAgICAgIG1hdGNoLnVuYXJ5U2xhc2ggPSBlbmRbMV1cbiAgICAgICAgYWR2YW5jZShlbmRbMF0ubGVuZ3RoKVxuICAgICAgICBtYXRjaC5lbmQgPSBpbmRleFxuICAgICAgICByZXR1cm4gbWF0Y2hcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVTdGFydFRhZyAobWF0Y2gpIHtcbiAgICBjb25zdCB0YWdOYW1lID0gbWF0Y2gudGFnTmFtZVxuICAgIGNvbnN0IHVuYXJ5ID0gISFtYXRjaC51bmFyeVNsYXNoXG5cbiAgICBjb25zdCBhdHRycyA9IG1hdGNoLmF0dHJzLm1hcCgoYXJncykgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogYXJnc1sxXSxcbiAgICAgICAgdmFsdWU6IGFyZ3NbM10gfHwgYXJnc1s0XSB8fCBhcmdzWzVdIHx8ICcnXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICghdW5hcnkpIHtcbiAgICAgIHN0YWNrLnB1c2goeyB0YWc6IHRhZ05hbWUsIGxvd2VyQ2FzZWRUYWc6IHRhZ05hbWUudG9Mb3dlckNhc2UoKSwgYXR0cnM6IGF0dHJzIH0pXG4gICAgICBsYXN0VGFnID0gdGFnTmFtZVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7XG4gICAgICBvcHRpb25zLnN0YXJ0KHRhZ05hbWUsIGF0dHJzLCB1bmFyeSwgbWF0Y2guc3RhcnQsIG1hdGNoLmVuZClcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUVuZFRhZyAodGFnTmFtZSwgc3RhcnQsIGVuZCkge1xuICAgIGxldCBwb3MsIGxvd2VyQ2FzZWRUYWdOYW1lXG4gICAgaWYgKHN0YXJ0ID09IG51bGwpIHN0YXJ0ID0gaW5kZXhcbiAgICBpZiAoZW5kID09IG51bGwpIGVuZCA9IGluZGV4XG5cbiAgICAvLyBGaW5kIHRoZSBjbG9zZXN0IG9wZW5lZCB0YWcgb2YgdGhlIHNhbWUgdHlwZVxuICAgIGlmICh0YWdOYW1lKSB7XG4gICAgICBsb3dlckNhc2VkVGFnTmFtZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgZm9yIChwb3MgPSBzdGFjay5sZW5ndGggLSAxOyBwb3MgPj0gMDsgcG9zLS0pIHtcbiAgICAgICAgaWYgKHN0YWNrW3Bvc10ubG93ZXJDYXNlZFRhZyA9PT0gbG93ZXJDYXNlZFRhZ05hbWUpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIG5vIHRhZyBuYW1lIGlzIHByb3ZpZGVkLCBjbGVhbiBzaG9wXG4gICAgICBwb3MgPSAwXG4gICAgfVxuXG4gICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAvLyBDbG9zZSBhbGwgdGhlIG9wZW4gZWxlbWVudHMsIHVwIHRoZSBzdGFja1xuICAgICAgZm9yIChsZXQgaSA9IHN0YWNrLmxlbmd0aCAtIDE7IGkgPj0gcG9zOyBpLS0pIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZW5kKSB7XG4gICAgICAgICAgb3B0aW9ucy5lbmQoc3RhY2tbaV0udGFnLCBzdGFydCwgZW5kKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJlbW92ZSB0aGUgb3BlbiBlbGVtZW50cyBmcm9tIHRoZSBzdGFja1xuICAgICAgc3RhY2subGVuZ3RoID0gcG9zXG4gICAgICBsYXN0VGFnID0gcG9zICYmIHN0YWNrW3BvcyAtIDFdLnRhZ1xuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzUvMi5cbiAqL1xuaW1wb3J0IHsgcGFyc2VIdG1sIH0gZnJvbSAnLi9odG1sLXBhcnNlcidcbmltcG9ydCB7Z2V0QW5kUmVtb3ZlQXR0cn0gZnJvbSAnLi4vaGVscGVyJ1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKHRlbXBsYXRlKSB7XG4gIGxldCByb290XG4gIGxldCBjdXJyZW50UGFyZW50XG4gIHBhcnNlSHRtbCh0ZW1wbGF0ZSwge1xuICAgIHN0YXJ0ICh0YWcsIGF0dHJzLCB1bmFyeSkge1xuICAgICAgbGV0IGVsZW1lbnQgPSB7XG4gICAgICAgIHR5cGU6IDEsXG4gICAgICAgIHRhZyxcbiAgICAgICAgYXR0cnNMaXN0OiBhdHRycyxcbiAgICAgICAgcGFyZW50OiBjdXJyZW50UGFyZW50LFxuICAgICAgICBjaGlsZHJlbjogW11cbiAgICAgIH1cblxuICAgICAgcHJvY2Vzc0ZvcihlbGVtZW50KVxuICAgICAgcHJvY2Vzc0lmKGVsZW1lbnQsIGN1cnJlbnRQYXJlbnQpXG5cbiAgICAgIGlmICghcm9vdCkge1xuICAgICAgICByb290ID0gZWxlbWVudFxuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFBhcmVudCkge1xuICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkcmVuLnB1c2goZWxlbWVudClcbiAgICAgIH1cblxuICAgICAgaWYgKCF1bmFyeSkge1xuICAgICAgICBjdXJyZW50UGFyZW50ID0gZWxlbWVudFxuICAgICAgfVxuICAgIH0sXG4gICAgZW5kICgpIHtcbiAgICAgIGN1cnJlbnRQYXJlbnQgPSBjdXJyZW50UGFyZW50LnBhcmVudFxuICAgIH0sXG4gICAgY2hhcnMgKHRleHQpIHtcbiAgICAgIGlmICghY3VycmVudFBhcmVudCkge3JldHVybn1cbiAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgIGxldCBleHAgPSBwYXJzZVRleHQodGV4dClcbiAgICAgICAgaWYgKGV4cCkge1xuICAgICAgICAgIGN1cnJlbnRQYXJlbnQuY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAyLCAvLyBsaXRlcmFsIGV4cHJlc3Npb25cbiAgICAgICAgICAgIGV4cHJlc3Npb246IGV4cFxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IDMsIC8vIG5vcm1hbCB0ZXh0XG4gICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHJvb3Rcbn1cblxuLyoqXG4gKiAgKGl0ZW0sIGtleSwgaW5kZXgpIGluIGl0ZW1MaXN0XG4gKiAgZWwuZm9yID0gJ2l0ZW1MaXN0J1xuICogIGVsLmFsaWFzID0gJ2l0ZW0nXG4gKiAgZWwuaXRlcmF0b3IxID0gJ2tleSdcbiAqICBlbC5pdGVyYXRvcjIgPSAnaW5kZXgnXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NGb3IgKGVsKSB7XG4gIGxldCBleHBcbiAgaWYgKChleHAgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1mb3InKSkpIHtcbiAgICBjb25zdCByZXMgPSBwYXJzZUZvcihleHApXG4gICAgaWYgKHJlcykge1xuICAgICAgT2JqZWN0LmFzc2lnbihlbCwgcmVzKVxuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gcGFyc2VGb3IgKGV4cCkge1xuICBjb25zdCBmb3JBbGlhc1JFID0gLyhbXFxzXFxTXSo/KVxccysoPzppbnxvZilcXHMrKFtcXHNcXFNdKikvXG4gIGNvbnN0IHN0cmlwUGFyZW5zUkUgPSAvXlxcKHxcXCkkL2dcbiAgY29uc3QgZm9ySXRlcmF0b3JSRSA9IC8sKFteLFxcfVxcXV0qKSg/OiwoW14sXFx9XFxdXSopKT8kL1xuXG4gIC8vIChpdGVtLCBrZXksIGluZGV4KSBpbiBpdGVtTGlzdFxuXG4gIGNvbnN0IGluTWF0Y2ggPSBleHAubWF0Y2goZm9yQWxpYXNSRSlcbiAgaWYgKCFpbk1hdGNoKSByZXR1cm5cbiAgY29uc3QgcmVzID0ge31cbiAgcmVzLmZvciA9IGluTWF0Y2hbMl0udHJpbSgpIC8vICdpdGVtTGlzdCdcbiAgY29uc3QgYWxpYXMgPSBpbk1hdGNoWzFdLnRyaW0oKS5yZXBsYWNlKHN0cmlwUGFyZW5zUkUsICcnKSAvLyAoaXRlbSwga2V5LCBpbmRleCkgPT4gaXRlbSwga2V5LCBpbmRleFxuICBjb25zdCBpdGVyYXRvck1hdGNoID0gYWxpYXMubWF0Y2goZm9ySXRlcmF0b3JSRSlcbiAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcbiAgICByZXMuYWxpYXMgPSBhbGlhcy5yZXBsYWNlKGZvckl0ZXJhdG9yUkUsICcnKS50cmltKCkgLy8gJ2l0ZW0nXG4gICAgcmVzLml0ZXJhdG9yMSA9IGl0ZXJhdG9yTWF0Y2hbMV0udHJpbSgpIC8vICdrZXknXG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2hbMl0pIHtcbiAgICAgIHJlcy5pdGVyYXRvcjIgPSBpdGVyYXRvck1hdGNoWzJdLnRyaW0oKSAvLyAnaW5kZXgnXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcy5hbGlhcyA9IGFsaWFzXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBwcm9jZXNzSWYgKGVsLCBwYXJlbnQpIHtcbiAgbGV0IGV4cFxuICBpZiAoZXhwID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtaWYnKSkge1xuICAgIGFkZElmQ29uZGl0aW9uKGVsLCB7XG4gICAgICBleHA6IGV4cCxcbiAgICAgIGJsb2NrOiBlbFxuICAgIH0pXG4gIH0gZWxzZSBpZiAoZXhwID0gZ2V0QW5kUmVtb3ZlQXR0cihlbCwgJ3YtZWxzZS1pZicpKSB7XG4gICAgY29uc3QgcHJldiA9IGZpbmRQcmV2RWxlbWVudCggcGFyZW50LmNoaWxkcmVuKVxuICAgIHByZXYgJiYgYWRkSWZDb25kaXRpb24ocHJldiwge1xuICAgICAgZXhwOiBleHAsXG4gICAgICBibG9jazogZWxcbiAgICB9KVxuICB9IGVsc2UgaWYgKGV4cCA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWVsc2UnKSkge1xuICAgIGNvbnN0IHByZXYgPSBmaW5kUHJldkVsZW1lbnQoIHBhcmVudC5jaGlsZHJlbilcbiAgICBwcmV2ICYmIGFkZElmQ29uZGl0aW9uKHByZXYsIHtcbiAgICAgIGV4cDogZXhwLFxuICAgICAgYmxvY2s6IGVsXG4gICAgfSlcbiAgfVxufVxuZnVuY3Rpb24gYWRkSWZDb25kaXRpb24gKGVsLCBjb25kaXRpb24pIHtcbiAgaWYgKCFlbC5pZkNvbmRpdGlvbnMpIHtcbiAgICBlbC5pZkNvbmRpdGlvbnMgPSBbXVxuICB9XG4gIGVsLmlmQ29uZGl0aW9ucy5wdXNoKGNvbmRpdGlvbilcbn1cbmZ1bmN0aW9uIGZpbmRQcmV2RWxlbWVudCAoY2hpbGRyZW4pIHtcbiAgbGV0IGkgPSBjaGlsZHJlbi5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChjaGlsZHJlbltpXS50eXBlID09PSAxKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5baV1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRyZW4ucG9wKClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiB0ZXh0IHBhcnNlclxuICogJ2FiY3t7bmFtZX19eHl6JyA9PiAnXCJhYmNcIitfcyhuYW1lKStcInh5elwiJ1xuICovXG5mdW5jdGlvbiBwYXJzZVRleHQgKHRleHQpIHtcbiAgY29uc3QgdGFnUkUgPSAvXFx7XFx7KCg/Oi58XFxyP1xcbikrPylcXH1cXH0vZ1xuICBpZiAoIXRhZ1JFLnRlc3QodGV4dCkpIHsgcmV0dXJuIH1cblxuICBsZXQgbGFzdEluZGV4ID0gdGFnUkUubGFzdEluZGV4ID0gMFxuICBsZXQgbWF0Y2hcbiAgbGV0IHRva2VucyA9IFtdXG4gIHdoaWxlICgobWF0Y2ggPSB0YWdSRS5leGVjKHRleHQpKSkge1xuICAgIC8vIHRoZXJlIGFyZSBub3JtYWwgdGV4dCBiZWZvcmUge3tcbiAgICBpZiAobWF0Y2guaW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICAgIHRva2Vucy5wdXNoKEpTT04uc3RyaW5naWZ5KHRleHQuc2xpY2UobGFzdEluZGV4LCBtYXRjaC5pbmRleCkpKVxuICAgIH1cblxuICAgIC8vIHRva2VuIGluIGV4cHJlc3Npb25cbiAgICB0b2tlbnMucHVzaChgX3MoJHttYXRjaFsxXS50cmltKCl9KWApXG5cbiAgICBsYXN0SW5kZXggPSB0YWdSRS5sYXN0SW5kZXhcbiAgfVxuXG4gIC8vIHRoZXJlIGFyZSBub3JtYWwgdGV4dCBhZnRlciB9fVxuICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcbiAgICB0b2tlbnMucHVzaChKU09OLnN0cmluZ2lmeSh0ZXh0LnNsaWNlKGxhc3RJbmRleCkpKVxuICB9XG5cbiAgcmV0dXJuIHRva2Vucy5qb2luKCcrJylcbn1cbi8vIGNvbnNvbGUubG9nKHBhcnNlVGV4dCgnYWJje3tuYW1lfX14eXonKSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvMy8xOC5cbiAqL1xuY29uc3Qgb3JpZ2luQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZVxuZXhwb3J0IGNvbnN0IHJlYWN0aXZlQXJyYXlQcm90byA9IE9iamVjdC5jcmVhdGUob3JpZ2luQXJyYXlQcm90bylcbiAgXG47WydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NwbGljZScsICdzb3J0JywgJ3JldmVyc2UnXS5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gIC8vIGNvbnNvbGUubG9nKCdtZXRob2Q6JyArIG1ldGhvZClcbiAgY29uc3Qgb3JpZ2luTWV0aG9kID0gb3JpZ2luQXJyYXlQcm90b1ttZXRob2RdXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZWFjdGl2ZUFycmF5UHJvdG8sIG1ldGhvZCwge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBvcmlnaW5NZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgdGhpcy5fX3JlYWN0aXZlT2JqZWN0X18uZGVwLm5vdGlmeSgpXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn0pXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvMy80LlxuICovXG4vKipcbiAqIEEgZGVwIGlzIGFuIG9ic2VydmFibGUgdGhhdCBjYW4gaGF2ZSBtdWx0aXBsZVxuICogd2F0Y2hlcnMoZGlyZWN0aXZlcyBpbiB0ZW1wbGF0ZSBvciB3YXRjaGVycyBib3VuZCBtYW51YWxseSkgc3Vic2NyaWJpbmcgdG8gaXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlcCB7XG4gIC8vIHRoZSBjdXJyZW50IHRhcmdldCB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZC5cbiAgLy8gdGhpcyBpcyBnbG9iYWxseSB1bmlxdWUgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvbmx5IG9uZVxuICAvLyB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZCBhdCBhbnkgdGltZS5cbiAgc3RhdGljIHRhcmdldCA9IG51bGxcbiAgc3RhdGljIF90YXJnZXRTdGFjayA9IFtdXG4gIHN0YXRpYyBwdXNoVGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldFdhdGNoZXIpIHtcbiAgICBEZXAuX3RhcmdldFN0YWNrLnB1c2goRGVwLnRhcmdldClcbiAgICBEZXAudGFyZ2V0ID0gdGFyZ2V0V2F0Y2hlclxuICB9XG4gIHN0YXRpYyBwb3BUYXJnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgRGVwLnRhcmdldCA9IERlcC5fdGFyZ2V0U3RhY2sucG9wKClcbiAgfVxuICBcbiAgc3VicyA9IFtdXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgfVxuICBhZGRTdWIgKHN1Yikge1xuICAgIHRoaXMuc3Vicy5wdXNoKHN1YilcbiAgfVxuICBub3RpZnkgKCkge1xuICAgIC8vIHN0YWJsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcbiAgICBjb25zdCBzdWJzID0gdGhpcy5zdWJzLnNsaWNlKClcbiAgICBzdWJzLmZvckVhY2goc3ViID0+IHN1Yi51cGRhdGUoKSlcbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzMvNC5cbiAqL1xuaW1wb3J0IERlcCBmcm9tICcuL2RlcCdcbmltcG9ydCB7YXVnbWVudH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCB7cmVhY3RpdmVBcnJheVByb3RvfSBmcm9tICcuL2FycmF5J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdGl2ZU9iamVjdCB7XG4gIHZhbHVlXG4gIGRlcFxuICBjb25zdHJ1Y3RvciAodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbFxuICAgIC8vIGEgRGVwIGZvciB0aGUgb2JqZWN0IHNlbGYgd2hlbiBtYW5pcHVsYXRlIGEgYXJyYXkgKHB1c2gscG9wIGV0Yykgb3IgYWRkL2RlbGV0ZSBhIHByb3BlcnR5IG9uIG9iamVjdChhcnJheSlcbiAgICB0aGlzLmRlcCA9IG5ldyBEZXAoKVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWwsICdfX3JlYWN0aXZlT2JqZWN0X18nLCB7XG4gICAgICB2YWx1ZTogdGhpcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIGF1Z21lbnQodmFsLCByZWFjdGl2ZUFycmF5UHJvdG8pXG4gICAgfVxuICAgIC8qXG4gICAgLy8gYXJyYXkgaXMgaGFuZGxlZCBkaWZmZXJlbnQgZnJvbSBub3JtYWwgb2JqZWN0IGZvciBwZXJmb3JtYW5jZVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53YWxrKHZhbClcbiAgICB9XG4gICAgKi9cbiAgICB0aGlzLndhbGsodmFsKVxuICB9XG4gIHdhbGsgKG9iaikge1xuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4gZGVmaW5lUmVhY3RpdmUob2JqLCBrZXksIG9ialtrZXldKSlcbiAgfVxuICBvYnNlcnZlQXJyYXkgKGFycikge1xuICAgIGFyci5mb3JFYWNoKGl0ZW0gPT4gY29udmVydChpdGVtKSlcbiAgfVxufVxuXG4vLyBhZGQgZ2V0dGVyL3NldHRlciBmb3IgZXZlcnkga2V5L3ZhbHVlIHBhaXIgaW4gb2JqZWN0XG4vLyBpbiBnZXR0ZXI6IGNvbGxlY3QgdGhlIGRlcGVuZGVuY3kgcmVsYXRpb25zaGlwcyBmb3IgZGF0YSAod2F0Y2hlcnMgZGVwZW5kIG9uIGRhdGEpXG4vLyBpbiBzZXR0ZXI6IG5vdGlmeSB3YXRjaGVycyB0byB1cGRhdGUgd2hlbiBkYXRhIGNoYW5nZXNcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVSZWFjdGl2ZShvYmosIGtleSwgdmFsKSB7XG4gIGxldCBjaGlsZE9iaiA9IGNvbnZlcnQodmFsKVxuICBjb25zdCBkZXAgPSBuZXcgRGVwKCkgLy8gYSBEZXAgZm9yIHRoZSBrZXktdmFsdWUgcGFpciBvZiBvYmplY3RcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZUdldHRlciAoKSB7XG4gICAgICBpZiAoRGVwLnRhcmdldCkge1xuICAgICAgICAvLyB3YXRjaGVyIGRlcGVuZHMgb24gdGhlIGtleS12YWx1ZSBwYWlyIG9mIHRoZSBvYmplY3RcbiAgICAgICAgZGVwLmFkZFN1YihEZXAudGFyZ2V0KVxuICAgICAgICBcbiAgICAgICAgLy8gd2F0Y2hlciBkZXBlbmRzIG9uIHRoZSB2YWx1ZSByZXNwb25kaW5nIHRvIHRoZSBrZXkuXG4gICAgICAgIC8vIHRoaXMgd2lsbCBiZSB1c2VkIHdoZW4gbWFuaXB1bGF0ZSBhIGFycmF5IChwdXNoLHBvcCBldGMpIG9yIGFkZC9kZWxldGUgYSBwcm9wZXJ0eSBvbiBvYmplY3QoYXJyYXkpXG4gICAgICAgIGNoaWxkT2JqICYmIGNoaWxkT2JqLmRlcC5hZGRTdWIoRGVwLnRhcmdldClcbiAgXG4gICAgICAgIC8vIGlmIHRoZSB2YWx1ZSByZXNwb25kaW5nIHRvIHRoZSBrZXkgaXMgYSBBcnJheSxcbiAgICAgICAgLy8gZGl2ZSBpbnRvIGl0IHRvIGNvbGxlY3QgZGVwZW5kZW5jaWVzLlxuICAgICAgICAvLyBidXQgd2h5PyBiZWNhdXNlIHdoZW4gY29udmVydGluZyB0byBSZWFjdGl2ZU9iamVjdFxuICAgICAgICAvLyBhcnJheSBpcyB0cmVhdGVkIGRpZmZlcmVudCBmcm9tIGNvbW1vbiBvYmplY3Q/XG4gICAgICAgIC8vIEFycmF5LmlzQXJyYXkodmFsKSAmJiBkZXBlbmRBcnJheSh2YWwpXG4gICAgICB9XG4gICAgICAgIFxuICAgICAgcmV0dXJuIHZhbFxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlciAobmV3VmFsKSB7XG4gICAgICBpZiAodmFsID09PSBuZXdWYWwpXG4gICAgICAgIHJldHVyblxuICAgICAgdmFsID0gbmV3VmFsXG4gICAgICBjaGlsZE9iaiA9IGNvbnZlcnQodmFsKVxuICAgICAgZGVwLm5vdGlmeSgpXG4gICAgfVxuICB9KVxufVxuXG4vLyBjb252ZXJ0IGEgbm9ybWFsIG9iamVjdCB0byBSZWFjdGl2ZU9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnQodmFsLCB2bSkge1xuICBpZiAoIXZhbCB8fCAnb2JqZWN0JyAhPT0gdHlwZW9mIHZhbClcbiAgICByZXR1cm5cbiAgXG4gIGlmICh2YWwuX19yZWFjdGl2ZU9iamVjdF9fKVxuICAgIHJldHVybiB2YWwuX19yZWFjdGl2ZU9iamVjdF9fXG4gIFxuICByZXR1cm4gbmV3IFJlYWN0aXZlT2JqZWN0KHZhbClcbn1cblxuZnVuY3Rpb24gZGVwZW5kQXJyYXkoYXJyKSB7XG4gIGFyci5mb3JFYWNoKGVsZSA9PiB7XG4gICAgZWxlICYmIGVsZS5fX3JlYWN0aXZlT2JqZWN0X18gJiYgZWxlLl9fcmVhY3RpdmVPYmplY3RfXy5kZXAuYWRkU3ViKERlcC50YXJnZXQpXG4gICAgQXJyYXkuaXNBcnJheShlbGUpICYmIGRlcGVuZEFycmF5KGVsZSlcbiAgfSlcbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBTYW5kb24gb24gMjAxNy8zLzQuXG4gKi9cbmltcG9ydCBEZXAgZnJvbSAnLi9kZXAnXG5pbXBvcnQge3BhcnNlUGF0aH0gZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yICh2bSwgZXhwT3JGbiwgY2IpIHtcbiAgICB0aGlzLmNiID0gY2JcbiAgICB0aGlzLnZtID0gdm1cbiAgICB0aGlzLmdldHRlciA9IHR5cGVvZiBleHBPckZuID09PSAnZnVuY3Rpb24nID8gZXhwT3JGbiA6IHBhcnNlUGF0aChleHBPckZuKVxuICAgIC8vIHRyaWdnZXIgZ2V0dGVyIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHRvIGNvbGxlY3QgZGVwZW5kZW5jeVxuICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldCgpXG4gIH1cbiAgZ2V0ICgpIHtcbiAgICBEZXAucHVzaFRhcmdldCh0aGlzKVxuICAgIGNvbnN0IHZhbCA9IHRoaXMuZ2V0dGVyLmNhbGwodGhpcy52bSwgdGhpcy52bSkgLy8gcGFyc2VQYXRoKHRoaXMuZXhwT3JGbikodGhpcy52bS5fZGF0YSlcbiAgICBEZXAucG9wVGFyZ2V0KClcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgdXBkYXRlICgpIHtcbiAgICB0aGlzLnJ1bigpXG4gIH1cbiAgcnVuICgpIHtcbiAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmdldCgpXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IG5ld1ZhbCkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICB0aGlzLnZhbHVlID0gbmV3VmFsXG4gICAgICB0aGlzLmNiICYmIHRoaXMuY2IuY2FsbCh0aGlzLnZtLCBuZXdWYWwsIG9sZFZhbHVlKVxuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGxpcGVuZyBvbiAyMDE4LzExLzI4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUgKHZhbHVlKSB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWVcbiAgcmV0dXJuIChcbiAgICB0eXBlID09PSAnc3RyaW5nJyB8fFxuICAgIHR5cGUgPT09ICdudW1iZXInIHx8XG4gICAgdHlwZSA9PT0gJ3N5bWJvbCcgfHxcbiAgICB0eXBlID09PSAnYm9vbGVhbidcbiAgKVxufSIsIi8qKlxuICogQ3JlYXRlZCBieSBTYW5kb24gb24gMjAxNy8zLzI2LlxuICovXG5leHBvcnQgY29uc3QgaGFzUHJvdG8gPSAnX19wcm90b19fJyBpbiB7fVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzMvMjYuXG4gKi9cbmV4cG9ydCAqIGZyb20gJy4vbGFuZydcbmV4cG9ydCAqIGZyb20gJy4vZW52J1xuZXhwb3J0ICogZnJvbSAnLi9jb21tb24nIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzMvMjYuXG4gKi9cbmltcG9ydCB7aGFzUHJvdG99IGZyb20gJy4vZW52J1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGgpIHtcbiAgLy8gY2FzZSBsaWtlOiBiWzBdWzJdLnpbMF0ud1xuICBjb25zdCBzZWdtZW50cyA9IHBhdGguc3BsaXQoL1tcXFtcXF1cXC5dLykuZmlsdGVyKGVsZSA9PiBlbGUgIT09IFwiXCIpXG4gIGNvbnN0IGxlbiA9IHNlZ21lbnRzLmxlbmd0aFxuICByZXR1cm4gZnVuY3Rpb24gKHZtKSB7XG4gICAgbGV0IG9iaiA9IHZtLl9kYXRhXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoIW9iaikgcmV0dXJuXG4gICAgICBvYmogPSBvYmpbc2VnbWVudHNbaV1dXG4gICAgfVxuICAgIHJldHVybiBvYmpcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXVnbWVudCAodGFyZ2V0LCBzcmMpIHtcbiAgaWYgKGhhc1Byb3RvKSB7XG4gICAgdGFyZ2V0Ll9fcHJvdG9fXyA9IHNyY1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNyYykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgdmFsdWU6IHNyY1trZXldLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgbGlwZW5nIG9uIDIwMTgvMTEvMjguXG4gKi9cbmltcG9ydCBWTm9kZSBmcm9tIFwiLi92bm9kZVwiXG5pbXBvcnQgeyBpc1ByaW1pdGl2ZSB9IGZyb20gJy4uL3V0aWwvY29tbW9uJ1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAoY29udGV4dCwgdGFnLCBkYXRhLCBjaGlsZHJlbikge1xuICAvLyBub3JtYWxpemUgY2hpbGRyZW5cbiAgaWYgKGNoaWxkcmVuKSB7XG4gICAgY2hpbGRyZW4gPSBub3JtYWxpemVDaGlsZHJlbihjaGlsZHJlbilcbiAgfVxuXG4gIC8vIGNyZWF0ZSBWTm9kZVxuICBsZXQgdm5vZGVcbiAgaWYgKHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnKSB7XG4gICAgdm5vZGUgPSBuZXcgVk5vZGUodGFnLCBkYXRhLCBjaGlsZHJlbiwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGNvbnRleHQpXG4gIH1cblxuICByZXR1cm4gdm5vZGVcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ2hpbGRyZW4gKGNoaWxkcmVuKSB7XG4gIGlmIChpc1ByaW1pdGl2ZShjaGlsZHJlbikpIHtcbiAgICByZXR1cm4gW25ldyBWTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBTdHJpbmcoY2hpbGRyZW4pKV1cbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIHJldHVybiBjaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICBpZiAoaXNQcmltaXRpdmUoY2hpbGQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgVk5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgU3RyaW5nKGNoaWxkKSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGlsZFxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXlDaGlsZHJlbiAoY2hpbGRyZW4pIHtcbiAgcmV0dXJuIGNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IHtcbiAgICBpZiAoaXNQcmltaXRpdmUoY2hpbGQpKSB7XG4gICAgICByZXR1cm4gbmV3IFZOb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFN0cmluZyhjaGlsZCkpXG4gICAgfVxuICAgIHJldHVybiBjaGlsZFxuICB9KVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGxpcGVuZyBvbiAyMDE4LzExLzI3LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWTm9kZSB7XG4gIGNvbnN0cnVjdG9yICh0YWcsIGRhdGEsIGNoaWxkcmVuLCB0ZXh0LCBlbG0sIGNvbnRleHQpIHtcbiAgICB0aGlzLnRhZyA9IHRhZ1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW5cbiAgICB0aGlzLnRleHQgPSB0ZXh0XG4gICAgdGhpcy5lbG0gPSBlbG1cbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG4gIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBTYW5kb24gb24gMjAxNy8zLzUuXG4gKi9cbmltcG9ydCBXYXRjaGVyIGZyb20gJy4vcmVhY3RpdmUtb2JqZWN0L3dhdGNoZXInXG5pbXBvcnQgeyBjb252ZXJ0IH0gZnJvbSAnLi9yZWFjdGl2ZS1vYmplY3QnXG5pbXBvcnQgeyBjb21waWxlIH0gZnJvbSAnLi9jb21waWxlci9pbmRleCdcbmltcG9ydCBWTm9kZSBmcm9tICcuL3Zkb20vdm5vZGUnXG5pbXBvcnQgeyBjcmVhdGVFbGVtZW50IH0gZnJvbSAnLi92ZG9tL2NyZWF0ZS1lbGVtZW50J1xuXG5jbGFzcyBWbSB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLiRvcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuX2RhdGEgPSB0aGlzLiRvcHRpb25zLmRhdGFcbiAgICB0aGlzLl9wcm94eSgpXG4gICAgY29udmVydCh0aGlzLl9kYXRhLCB0aGlzKSAvLyBjb252ZXJ0IHRoaXMuX2RhdGEgdG8gcmVhY3RpdmVcbiAgfVxuICBfcHJveHkgKCkge1xuICAgIGxldCAgc2VsZiA9IHRoaXNcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwga2V5LCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBwcm94eUdldHRlcigpIHtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fZGF0YVtrZXldXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gcHJveHlTZXR0ZXIgKG5ld1ZhbCkge1xuICAgICAgICAgIHNlbGYuX2RhdGFba2V5XSA9IG5ld1ZhbFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgJHdhdGNoIChleHBPckZuLCBjYikge1xuICAgIG5ldyBXYXRjaGVyKHRoaXMsIGV4cE9yRm4sIGNiKVxuICB9XG4gICRtb3VudCAoZWwpIHtcbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpXG4gICAgdGhpcy4kZWwgPSBlbFxuXG4gICAgLy8gY29udmVydCB0ZW1wbGF0ZSB0byByZW5kZXIgZnVuY3Rpb25cbiAgICAvLyBjb25zdCB7IHJlbmRlciB9ID0gY29tcGlsZSh0aGlzLiRvcHRpb25zLnRlbXBsYXRlKVxuICAgIC8vIHRoaXMuJG9wdGlvbnMucmVuZGVyID0gcmVuZGVyXG5cbiAgICAvLyByZW5kZXIgdG8gdm5vZGUgdHJlZSwgcGF0Y2ggYW5kIGFkZCB3YXRjaGVyXG4gICAgY29uc3QgdXBkYXRlQ29tcG9uZW50ID0gKCkgPT4ge1xuICAgICAgdGhpcy5fdXBkYXRlKHRoaXMuX3JlbmRlcigpKVxuICAgIH1cbiAgICB0aGlzLl93YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcywgdXBkYXRlQ29tcG9uZW50LCBudWxsKVxuXG4gICAgaWYgKHRoaXMuJHZub2RlID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2lzTW91bnRlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgJGNyZWF0ZUVsZW1lbnQgKHRhZywgZGF0YSwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudCh0aGlzLCB0YWcsIGRhdGEsIGNoaWxkcmVuKVxuICB9XG4gIF9yZW5kZXIgKCkge1xuICAgIGNvbnN0IHZtID0gdGhpc1xuICAgIGNvbnN0IHsgcmVuZGVyLCBfcGFyZW50Vm5vZGUgfSA9IHZtLiRvcHRpb25zXG5cbiAgICB2bS4kdm5vZGUgPSBfcGFyZW50Vm5vZGVcbiAgICBjb25zdCB2bm9kZSA9IHJlbmRlci5jYWxsKHZtLCB2bS4kY3JlYXRlRWxlbWVudClcbiAgICB2bm9kZS5wYXJlbnQgPSBfcGFyZW50Vm5vZGVcbiAgICByZXR1cm4gdm5vZGVcbiAgfVxuICBfdXBkYXRlICh2bm9kZSkge1xuICAgIGNvbnN0IHZtID0gdGhpc1xuICAgIGNvbnN0IHByZXZFbCA9IHZtLiRlbFxuICAgIGNvbnN0IHByZXZWbm9kZSA9IHZtLl92bm9kZVxuICAgIHZtLl92bm9kZSA9IHZub2RlXG4gICAgaWYgKCFwcmV2Vm5vZGUpIHtcbiAgICAgIC8vIGZpcnN0IHJlbmRlclxuICAgICAgdm0uJGVsID0gdm0uX19wYXRjaF9fKHZtLiRlbCwgdm5vZGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHVwZGF0ZVxuICAgICAgdm0uJGVsID0gdm0uX19wYXRjaF9fKHByZXZWbm9kZSwgdm5vZGUpXG4gICAgfVxuICB9XG4gIF9fcGF0Y2hfXyAob2xkVm5vZGUsIHZub2RlKSB7XG4gICAgY29uc3QgaW5zZXJ0ZWRWbm9kZVF1ZXVlID0gW11cbiAgICBjb25zdCBpc1JlYWxFbGVtZW50ID0gb2xkVm5vZGUubm9kZVR5cGUgIT09IHVuZGVmaW5lZFxuICAgIGlmIChpc1JlYWxFbGVtZW50KSB7XG4gICAgICBvbGRWbm9kZSA9IG5ldyBWTm9kZShvbGRWbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKCksIHt9LCBbXSwgdW5kZWZpbmVkLCBvbGRWbm9kZSlcbiAgICB9XG4gICAgY29uc3Qgb2xkRWxtID0gb2xkVm5vZGUuZWxtXG4gICAgY29uc3QgcGFyZW50RWxtID0gb2xkRWxtLnBhcmVudEVsZW1lbnRcblxuICAgIC8vIGNyZWF0ZSB3aG9sZSBkb20gdHJlZSByZWN1cnNpdmVseVxuICAgIGNyZWF0ZUVsbSh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIG9sZEVsbS5uZXh0U2libGluZylcblxuICAgIC8vIHJlbW92ZSBvbGQgZG9tXG4gICAgcGFyZW50RWxtICYmIHBhcmVudEVsbS5yZW1vdmVDaGlsZChvbGRWbm9kZS5lbG0pXG5cbiAgICByZXR1cm4gdm5vZGUuZWxtXG4gIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZUVsbSAodm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCByZWZFbG0pIHtcbiAgY29uc3QgZGF0YSA9IHZub2RlLmRhdGFcbiAgY29uc3QgY2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlblxuICBjb25zdCB0YWcgPSB2bm9kZS50YWdcblxuICBpZiAodGFnKSB7XG4gICAgdm5vZGUuZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpXG4gICAgY3JlYXRlQ2hpbGRyZW4odm5vZGUsIGNoaWxkcmVuLCBpbnNlcnRlZFZub2RlUXVldWUpXG4gICAgcGFyZW50RWxtLmluc2VydEJlZm9yZSh2bm9kZS5lbG0sIHJlZkVsbSlcbiAgfSBlbHNlIHtcbiAgICB2bm9kZS5lbG0gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZS50ZXh0KVxuICAgIHBhcmVudEVsbS5pbnNlcnRCZWZvcmUodm5vZGUuZWxtLCByZWZFbG0pXG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2hpbGRyZW4gKHZub2RlLCBjaGlsZHJlbiwgaW5zZXJ0ZWRWbm9kZVF1ZXVlKSB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlb2Ygdm5vZGUudGV4dFxuICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgIGNyZWF0ZUVsbShjaGlsZCwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCB2bm9kZS5lbG0sIG51bGwpXG4gICAgfSlcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnbnVtYmVyJyB8fCB0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICB2bm9kZS5lbG0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoU3RyaW5nKHZub2RlLnRleHQpKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWbVxuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd2luZG93WydWbSddID0gVm1cbn0gZWxzZSB7XG4gIGNvbnNvbGUubG9nKCdzZXJ2ZXInKVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==