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
function generate(ast) {
  let code = ast ? genElement(ast) : '_c("div")';
  code = `with(this){return ${code}}`;
  return {
    render: new Function(code)
  };
}

function genElement(el) {
  if (el.for && !el.forProcessed) {
    return genFor(el);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el);
  } else {
    // component or element
    if (el.component) {// component
    } else {
      // element
      const data = genData(el) || null;
      const children = genChildren(el) || null;
      return `_c('${el.tag}',${data}, ${children})`;
    }
  }
}

function genFor(el) {
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';
  el.forProcessed = true;
  return `..._l((${el.for}),function(${el.alias}${iterator1}${iterator2}){` + `return ${genElement(el)}` + `})`;
}

function genIf(el) {
  el.ifProcessed = true;
  return genIfConditions(el.ifConditions.slice());
}

function genIfConditions(conditions) {
  if (!conditions.length) {
    return '_e()';
  }

  const condition = conditions.shift();

  if (condition.exp) {
    // if or else-if
    return `(${condition.exp})?${genElement(condition.block)}:${genIfConditions(conditions)}`;
  } else {
    // else
    return genElement(condition.block);
  }
}

function genChildren(el) {
  const children = el.children;

  if (children.length) {
    return `[${children.map(c => genNode(c)).join(',')}]`;
  }
}

function genNode(el) {
  if (el.type === 1) {
    return genElement(el);
  } else if (el.type === 2) {
    // literal expression, remember literal expression is like '_s(name)' format
    return `_v(${el.expression})`;
  } else {
    // normal text
    return `_v(${JSON.stringify(el.text)})`;
  }
}

function genData(el) {}

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
exports.default = parseHTML;

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

var _htmlParser = __webpack_require__(/*! ./html-parser.js */ "./src/compiler/parser/html-parser.js");

var _htmlParser2 = _interopRequireDefault(_htmlParser);

var _helper = __webpack_require__(/*! ../helper */ "./src/compiler/helper.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Sandon on 2017/5/2.
 */
function parse(template) {
  let root;
  let currentParent;
  (0, _htmlParser2.default)(template, {
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
        if (element.elseif || element.else) {// nothing
        } else {
          currentParent.children.push(element);
        }
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
    el.if = true;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else if (exp = (0, _helper.getAndRemoveAttr)(el, 'v-else-if')) {
    el.elseif = true;
    const prev = findPrevElement(parent.children);
    prev && addIfCondition(prev, {
      exp: exp,
      block: el
    });
  } else if ((exp = (0, _helper.getAndRemoveAttr)(el, 'v-else')) !== undefined) {
    el.else = true;
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
exports.isObject = isObject;
exports.toString = toString;

/**
 * Created by Sandon on 2017/3/26.
 */
function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function toString(val) {
  return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
}

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
exports.createTextVNode = createTextVNode;

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

function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, String(text));
}

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

var _index2 = __webpack_require__(/*! ./util/index */ "./src/util/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Vm {
  constructor(options = {}) {
    _defineProperty(this, "_v", _vnode.createTextVNode);

    _defineProperty(this, "_s", _index2.toString);

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

    if (!this.$options.render) {
      const {
        render
      } = (0, _index.compile)(this.$options.template);
      this.$options.render = render;
    } // render to vnode tree, patch and add watcher


    const updateComponent = () => {
      this._update(this._render());
    };

    this._watcher = new _watcher2.default(this, updateComponent, null);

    if (this.$vnode == null) {
      this._isMounted = true;
    }
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
  } // render helpers


  $createElement(tag, data, children) {
    return (0, _createElement.createElement)(this, tag, data, children);
  }

  _c(tag, data, children) {
    return (0, _createElement.createElement)(this, tag, data, children);
  }

  _l(val, renderFn) {
    let ret;

    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);

      for (let i = 0, l = val.length; i < l; i++) {
        ret[i] = renderFn(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);

      for (let i = 0; i < val; i++) {
        ret[i] = renderFn(i + 1, i);
      }
    } else if ((0, _index2.isObject)(val)) {
      let keys = Object.keys(val);
      ret = new Array(keys.length);

      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderFn(val[key], key, i);
      }
    }

    return ret;
  }

  _e() {
    return (0, _vnode.createTextVNode)('');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL2NvZGVnZW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL2hlbHBlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL3BhcnNlci9odG1sLXBhcnNlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvcGFyc2VyL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9yZWFjdGl2ZS1vYmplY3QvYXJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0aXZlLW9iamVjdC9kZXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0aXZlLW9iamVjdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3RpdmUtb2JqZWN0L3dhdGNoZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsL2Vudi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbC9sYW5nLmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL2NyZWF0ZS1lbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL3Zub2RlLmpzIiwid2VicGFjazovLy8uL3NyYy92bS5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZSIsImFzdCIsImNvZGUiLCJnZW5FbGVtZW50IiwicmVuZGVyIiwiRnVuY3Rpb24iLCJlbCIsImZvciIsImZvclByb2Nlc3NlZCIsImdlbkZvciIsImlmIiwiaWZQcm9jZXNzZWQiLCJnZW5JZiIsImNvbXBvbmVudCIsImRhdGEiLCJnZW5EYXRhIiwiY2hpbGRyZW4iLCJnZW5DaGlsZHJlbiIsInRhZyIsIml0ZXJhdG9yMSIsIml0ZXJhdG9yMiIsImFsaWFzIiwiZ2VuSWZDb25kaXRpb25zIiwiaWZDb25kaXRpb25zIiwic2xpY2UiLCJjb25kaXRpb25zIiwibGVuZ3RoIiwiY29uZGl0aW9uIiwic2hpZnQiLCJleHAiLCJibG9jayIsIm1hcCIsImMiLCJnZW5Ob2RlIiwiam9pbiIsInR5cGUiLCJleHByZXNzaW9uIiwiSlNPTiIsInN0cmluZ2lmeSIsInRleHQiLCJnZXRBbmRSZW1vdmVBdHRyIiwibmFtZSIsInZhbCIsImF0dHJzTGlzdCIsImkiLCJsZW4iLCJ2YWx1ZSIsInNwbGljZSIsImNvbXBpbGUiLCJ0ZW1wbGF0ZSIsInRyaW0iLCJwYXJzZUhUTUwiLCJhdHRyaWJ1dGUiLCJuY25hbWUiLCJxbmFtZUNhcHR1cmUiLCJzdGFydFRhZ09wZW4iLCJSZWdFeHAiLCJzdGFydFRhZ0Nsb3NlIiwiZW5kVGFnIiwiaHRtbCIsIm9wdGlvbnMiLCJzdGFjayIsImluZGV4IiwibGFzdCIsImxhc3RUYWciLCJ0ZXh0RW5kIiwiaW5kZXhPZiIsImVuZFRhZ01hdGNoIiwibWF0Y2giLCJjdXJJbmRleCIsImFkdmFuY2UiLCJwYXJzZUVuZFRhZyIsInN0YXJ0VGFnTWF0Y2giLCJwYXJzZVN0YXJ0VGFnIiwiaGFuZGxlU3RhcnRUYWciLCJyZXN0IiwibmV4dCIsImNoYXJzIiwic3Vic3RyaW5nIiwibiIsInN0YXJ0IiwidGFnTmFtZSIsImF0dHJzIiwiZW5kIiwiYXR0ciIsInB1c2giLCJ1bmFyeVNsYXNoIiwidW5hcnkiLCJhcmdzIiwibG93ZXJDYXNlZFRhZyIsInRvTG93ZXJDYXNlIiwicG9zIiwibG93ZXJDYXNlZFRhZ05hbWUiLCJwYXJzZSIsInJvb3QiLCJjdXJyZW50UGFyZW50IiwiZWxlbWVudCIsInBhcmVudCIsInByb2Nlc3NGb3IiLCJwcm9jZXNzSWYiLCJlbHNlaWYiLCJlbHNlIiwicGFyc2VUZXh0IiwicmVzIiwicGFyc2VGb3IiLCJPYmplY3QiLCJhc3NpZ24iLCJmb3JBbGlhc1JFIiwic3RyaXBQYXJlbnNSRSIsImZvckl0ZXJhdG9yUkUiLCJpbk1hdGNoIiwicmVwbGFjZSIsIml0ZXJhdG9yTWF0Y2giLCJhZGRJZkNvbmRpdGlvbiIsInByZXYiLCJmaW5kUHJldkVsZW1lbnQiLCJ1bmRlZmluZWQiLCJwb3AiLCJ0YWdSRSIsInRlc3QiLCJsYXN0SW5kZXgiLCJ0b2tlbnMiLCJleGVjIiwib3JpZ2luQXJyYXlQcm90byIsIkFycmF5IiwicHJvdG90eXBlIiwicmVhY3RpdmVBcnJheVByb3RvIiwiY3JlYXRlIiwiZm9yRWFjaCIsIm1ldGhvZCIsIm9yaWdpbk1ldGhvZCIsImRlZmluZVByb3BlcnR5IiwicmVzdWx0IiwiYXBwbHkiLCJhcmd1bWVudHMiLCJfX3JlYWN0aXZlT2JqZWN0X18iLCJkZXAiLCJub3RpZnkiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJjb25maWd1cmFibGUiLCJEZXAiLCJjb25zdHJ1Y3RvciIsImFkZFN1YiIsInN1YiIsInN1YnMiLCJ1cGRhdGUiLCJ0YXJnZXRXYXRjaGVyIiwiX3RhcmdldFN0YWNrIiwidGFyZ2V0IiwiZGVmaW5lUmVhY3RpdmUiLCJjb252ZXJ0IiwiUmVhY3RpdmVPYmplY3QiLCJpc0FycmF5Iiwid2FsayIsIm9iaiIsImtleXMiLCJrZXkiLCJvYnNlcnZlQXJyYXkiLCJhcnIiLCJpdGVtIiwiY2hpbGRPYmoiLCJnZXQiLCJyZWFjdGl2ZUdldHRlciIsInNldCIsInJlYWN0aXZlU2V0dGVyIiwibmV3VmFsIiwidm0iLCJkZXBlbmRBcnJheSIsImVsZSIsIldhdGNoZXIiLCJleHBPckZuIiwiY2IiLCJnZXR0ZXIiLCJwdXNoVGFyZ2V0IiwiY2FsbCIsInBvcFRhcmdldCIsInJ1biIsIm9sZFZhbHVlIiwiaXNQcmltaXRpdmUiLCJoYXNQcm90byIsImlzT2JqZWN0IiwidG9TdHJpbmciLCJTdHJpbmciLCJwYXJzZVBhdGgiLCJhdWdtZW50IiwicGF0aCIsInNlZ21lbnRzIiwic3BsaXQiLCJmaWx0ZXIiLCJfZGF0YSIsInNyYyIsIl9fcHJvdG9fXyIsImdldE93blByb3BlcnR5TmFtZXMiLCJjcmVhdGVFbGVtZW50IiwiY29udGV4dCIsIm5vcm1hbGl6ZUNoaWxkcmVuIiwidm5vZGUiLCJWTm9kZSIsImNoaWxkIiwiY3JlYXRlVGV4dFZOb2RlIiwiZWxtIiwiVm0iLCIkb3B0aW9ucyIsIl9wcm94eSIsInNlbGYiLCJwcm94eUdldHRlciIsInByb3h5U2V0dGVyIiwiJHdhdGNoIiwiJG1vdW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiJGVsIiwidXBkYXRlQ29tcG9uZW50IiwiX3VwZGF0ZSIsIl9yZW5kZXIiLCJfd2F0Y2hlciIsIiR2bm9kZSIsIl9pc01vdW50ZWQiLCJfcGFyZW50Vm5vZGUiLCIkY3JlYXRlRWxlbWVudCIsInByZXZFbCIsInByZXZWbm9kZSIsIl92bm9kZSIsIl9fcGF0Y2hfXyIsIm9sZFZub2RlIiwiaW5zZXJ0ZWRWbm9kZVF1ZXVlIiwiaXNSZWFsRWxlbWVudCIsIm5vZGVUeXBlIiwib2xkRWxtIiwicGFyZW50RWxtIiwicGFyZW50RWxlbWVudCIsImNyZWF0ZUVsbSIsIm5leHRTaWJsaW5nIiwicmVtb3ZlQ2hpbGQiLCJfYyIsIl9sIiwicmVuZGVyRm4iLCJyZXQiLCJsIiwiX2UiLCJyZWZFbG0iLCJjcmVhdGVDaGlsZHJlbiIsImluc2VydEJlZm9yZSIsImNyZWF0ZVRleHROb2RlIiwiYXBwZW5kQ2hpbGQiLCJ3aW5kb3ciLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUMvRWdCQSxRLEdBQUFBLFE7O0FBSGhCOzs7QUFHTyxTQUFTQSxRQUFULENBQW1CQyxHQUFuQixFQUF3QjtBQUM3QixNQUFJQyxJQUFJLEdBQUdELEdBQUcsR0FBR0UsVUFBVSxDQUFDRixHQUFELENBQWIsR0FBcUIsV0FBbkM7QUFDQUMsTUFBSSxHQUFJLHFCQUFvQkEsSUFBSyxHQUFqQztBQUNBLFNBQU87QUFDTEUsVUFBTSxFQUFFLElBQUlDLFFBQUosQ0FBYUgsSUFBYjtBQURILEdBQVA7QUFHRDs7QUFFRCxTQUFTQyxVQUFULENBQXFCRyxFQUFyQixFQUF5QjtBQUN2QixNQUFJQSxFQUFFLENBQUNDLEdBQUgsSUFBVSxDQUFDRCxFQUFFLENBQUNFLFlBQWxCLEVBQWdDO0FBQzlCLFdBQU9DLE1BQU0sQ0FBQ0gsRUFBRCxDQUFiO0FBQ0QsR0FGRCxNQUVPLElBQUlBLEVBQUUsQ0FBQ0ksRUFBSCxJQUFTLENBQUNKLEVBQUUsQ0FBQ0ssV0FBakIsRUFBOEI7QUFDbkMsV0FBT0MsS0FBSyxDQUFDTixFQUFELENBQVo7QUFDRCxHQUZNLE1BRUE7QUFDTDtBQUNBLFFBQUlBLEVBQUUsQ0FBQ08sU0FBUCxFQUFrQixDQUNoQjtBQUNELEtBRkQsTUFFTztBQUNMO0FBQ0EsWUFBTUMsSUFBSSxHQUFHQyxPQUFPLENBQUNULEVBQUQsQ0FBUCxJQUFlLElBQTVCO0FBQ0EsWUFBTVUsUUFBUSxHQUFHQyxXQUFXLENBQUNYLEVBQUQsQ0FBWCxJQUFtQixJQUFwQztBQUNBLGFBQVEsT0FBTUEsRUFBRSxDQUFDWSxHQUFJLEtBQUlKLElBQUssS0FBSUUsUUFBUyxHQUEzQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFTUCxNQUFULENBQWlCSCxFQUFqQixFQUFxQjtBQUNuQixRQUFNYSxTQUFTLEdBQUdiLEVBQUUsQ0FBQ2EsU0FBSCxHQUFnQixJQUFHYixFQUFFLENBQUNhLFNBQVUsRUFBaEMsR0FBb0MsRUFBdEQ7QUFDQSxRQUFNQyxTQUFTLEdBQUdkLEVBQUUsQ0FBQ2MsU0FBSCxHQUFnQixJQUFHZCxFQUFFLENBQUNjLFNBQVUsRUFBaEMsR0FBb0MsRUFBdEQ7QUFFQWQsSUFBRSxDQUFDRSxZQUFILEdBQWtCLElBQWxCO0FBQ0EsU0FBUSxVQUFTRixFQUFFLENBQUNDLEdBQUksY0FBYUQsRUFBRSxDQUFDZSxLQUFNLEdBQUVGLFNBQVUsR0FBRUMsU0FBVSxJQUEvRCxHQUNKLFVBQVNqQixVQUFVLENBQUNHLEVBQUQsQ0FBSyxFQURwQixHQUVKLElBRkg7QUFHRDs7QUFFRCxTQUFTTSxLQUFULENBQWdCTixFQUFoQixFQUFvQjtBQUNsQkEsSUFBRSxDQUFDSyxXQUFILEdBQWlCLElBQWpCO0FBQ0EsU0FBT1csZUFBZSxDQUFDaEIsRUFBRSxDQUFDaUIsWUFBSCxDQUFnQkMsS0FBaEIsRUFBRCxDQUF0QjtBQUNEOztBQUNELFNBQVNGLGVBQVQsQ0FBMEJHLFVBQTFCLEVBQXNDO0FBQ3BDLE1BQUksQ0FBQ0EsVUFBVSxDQUFDQyxNQUFoQixFQUF3QjtBQUN0QixXQUFPLE1BQVA7QUFDRDs7QUFDRCxRQUFNQyxTQUFTLEdBQUdGLFVBQVUsQ0FBQ0csS0FBWCxFQUFsQjs7QUFDQSxNQUFJRCxTQUFTLENBQUNFLEdBQWQsRUFBbUI7QUFDakI7QUFDQSxXQUFRLElBQUdGLFNBQVMsQ0FBQ0UsR0FBSSxLQUFJMUIsVUFBVSxDQUFDd0IsU0FBUyxDQUFDRyxLQUFYLENBQWtCLElBQUdSLGVBQWUsQ0FBQ0csVUFBRCxDQUFhLEVBQXhGO0FBQ0QsR0FIRCxNQUdPO0FBQ0w7QUFDQSxXQUFPdEIsVUFBVSxDQUFDd0IsU0FBUyxDQUFDRyxLQUFYLENBQWpCO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTYixXQUFULENBQXNCWCxFQUF0QixFQUEwQjtBQUN4QixRQUFNVSxRQUFRLEdBQUdWLEVBQUUsQ0FBQ1UsUUFBcEI7O0FBQ0EsTUFBSUEsUUFBUSxDQUFDVSxNQUFiLEVBQXFCO0FBQ25CLFdBQVEsSUFBR1YsUUFBUSxDQUFDZSxHQUFULENBQWFDLENBQUMsSUFBSUMsT0FBTyxDQUFDRCxDQUFELENBQXpCLEVBQThCRSxJQUE5QixDQUFtQyxHQUFuQyxDQUF3QyxHQUFuRDtBQUNEO0FBQ0Y7O0FBQ0QsU0FBU0QsT0FBVCxDQUFrQjNCLEVBQWxCLEVBQXNCO0FBQ3BCLE1BQUlBLEVBQUUsQ0FBQzZCLElBQUgsS0FBWSxDQUFoQixFQUFtQjtBQUNqQixXQUFPaEMsVUFBVSxDQUFDRyxFQUFELENBQWpCO0FBQ0QsR0FGRCxNQUVPLElBQUlBLEVBQUUsQ0FBQzZCLElBQUgsS0FBWSxDQUFoQixFQUFtQjtBQUN4QjtBQUNBLFdBQVEsTUFBSzdCLEVBQUUsQ0FBQzhCLFVBQVcsR0FBM0I7QUFDRCxHQUhNLE1BR0E7QUFDTDtBQUNBLFdBQVEsTUFBS0MsSUFBSSxDQUFDQyxTQUFMLENBQWVoQyxFQUFFLENBQUNpQyxJQUFsQixDQUF3QixHQUFyQztBQUNEO0FBQ0Y7O0FBRUQsU0FBU3hCLE9BQVQsQ0FBa0JULEVBQWxCLEVBQXNCLENBRXJCLEM7Ozs7Ozs7Ozs7Ozs7Ozs7O1FDMUVla0MsZ0IsR0FBQUEsZ0I7O0FBSGhCOzs7QUFHTyxTQUFTQSxnQkFBVCxDQUEyQmxDLEVBQTNCLEVBQStCbUMsSUFBL0IsRUFBcUM7QUFDMUMsTUFBSUMsR0FBSjtBQUNBLFFBQU1DLFNBQVMsR0FBR3JDLEVBQUUsQ0FBQ3FDLFNBQXJCOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQVIsRUFBV0MsR0FBRyxHQUFHRixTQUFTLENBQUNqQixNQUFoQyxFQUF3Q2tCLENBQUMsS0FBS0MsR0FBOUMsRUFBbURELENBQUMsRUFBcEQsRUFBd0Q7QUFDdEQsUUFBSUQsU0FBUyxDQUFDQyxDQUFELENBQVQsQ0FBYUgsSUFBYixLQUFzQkEsSUFBMUIsRUFBZ0M7QUFDOUJDLFNBQUcsR0FBR0MsU0FBUyxDQUFDQyxDQUFELENBQVQsQ0FBYUUsS0FBbkI7QUFDQUgsZUFBUyxDQUFDSSxNQUFWLENBQWlCSCxDQUFqQixFQUFvQixDQUFwQjtBQUNBO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPRixHQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUNSZU0sTyxHQUFBQSxPOztBQUhoQjs7QUFDQTs7QUFKQTs7O0FBTU8sU0FBU0EsT0FBVCxDQUFrQkMsUUFBbEIsRUFBNEI7QUFDakMsUUFBTWhELEdBQUcsR0FBRyxtQkFBTWdELFFBQVEsQ0FBQ0MsSUFBVCxFQUFOLENBQVo7QUFDQSxRQUFNaEQsSUFBSSxHQUFHLHVCQUFTRCxHQUFULENBQWI7QUFFQSxTQUFPO0FBQ0xBLE9BREs7QUFFTEcsVUFBTSxFQUFFRixJQUFJLENBQUNFO0FBRlIsR0FBUDtBQUlELEM7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQ0R1QitDLFM7O0FBYnhCOzs7QUFJQTtBQUNBLE1BQU1DLFNBQVMsR0FBRywyRUFBbEI7QUFFQSxNQUFNQyxNQUFNLEdBQUcsdUJBQWY7QUFDQSxNQUFNQyxZQUFZLEdBQUksT0FBTUQsTUFBTyxRQUFPQSxNQUFPLEdBQWpEO0FBQ0EsTUFBTUUsWUFBWSxHQUFHLElBQUlDLE1BQUosQ0FBWSxLQUFJRixZQUFhLEVBQTdCLENBQXJCO0FBQ0EsTUFBTUcsYUFBYSxHQUFHLFlBQXRCO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLElBQUlGLE1BQUosQ0FBWSxRQUFPRixZQUFhLFFBQWhDLENBQWY7O0FBRWUsU0FBU0gsU0FBVCxDQUFvQlEsSUFBcEIsRUFBMEJDLE9BQTFCLEVBQW1DO0FBQ2hELFFBQU1DLEtBQUssR0FBRyxFQUFkO0FBQ0EsTUFBSUMsS0FBSyxHQUFHLENBQVosQ0FGZ0QsQ0FFbEM7O0FBQ2QsTUFBSUMsSUFBSixFQUFVQyxPQUFWOztBQUNBLFNBQU9MLElBQVAsRUFBYTtBQUNYSSxRQUFJLEdBQUdKLElBQVA7QUFFQSxRQUFJTSxPQUFPLEdBQUdOLElBQUksQ0FBQ08sT0FBTCxDQUFhLEdBQWIsQ0FBZCxDQUhXLENBR3FCOztBQUNoQyxRQUFJRCxPQUFPLEtBQUssQ0FBaEIsRUFBbUI7QUFDakI7QUFDQSxZQUFNRSxXQUFXLEdBQUdSLElBQUksQ0FBQ1MsS0FBTCxDQUFXVixNQUFYLENBQXBCOztBQUNBLFVBQUlTLFdBQUosRUFBaUI7QUFDZixjQUFNRSxRQUFRLEdBQUdQLEtBQWpCO0FBQ0FRLGVBQU8sQ0FBQ0gsV0FBVyxDQUFDLENBQUQsQ0FBWCxDQUFlekMsTUFBaEIsQ0FBUDtBQUNBNkMsbUJBQVcsQ0FBQ0osV0FBVyxDQUFDLENBQUQsQ0FBWixFQUFpQkUsUUFBakIsRUFBMkJQLEtBQTNCLENBQVg7QUFDQTtBQUNELE9BUmdCLENBVWpCOzs7QUFDQSxZQUFNVSxhQUFhLEdBQUdDLGFBQWEsRUFBbkM7O0FBQ0EsVUFBSUQsYUFBSixFQUFtQjtBQUNqQkUsc0JBQWMsQ0FBQ0YsYUFBRCxDQUFkO0FBQ0E7QUFDRDtBQUNGOztBQUVELFFBQUlHLElBQUosRUFBVUMsSUFBVjs7QUFDQSxRQUFJWCxPQUFPLElBQUksQ0FBZixFQUFrQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FMLGFBQU8sQ0FBQ2lCLEtBQVIsQ0FBY2xCLElBQUksQ0FBQ21CLFNBQUwsQ0FBZSxDQUFmLEVBQWtCYixPQUFsQixDQUFkO0FBQ0FLLGFBQU8sQ0FBQ0wsT0FBRCxDQUFQO0FBQ0Q7O0FBRUQsUUFBSUEsT0FBTyxHQUFHLENBQWQsRUFBaUI7QUFDZkwsYUFBTyxDQUFDaUIsS0FBUixDQUFjbEIsSUFBZDtBQUNBQSxVQUFJLEdBQUcsRUFBUDtBQUNEO0FBQ0YsR0FsRCtDLENBb0RoRDs7O0FBQ0FZLGFBQVc7O0FBRVgsV0FBU0QsT0FBVCxDQUFrQlMsQ0FBbEIsRUFBcUI7QUFDbkJqQixTQUFLLElBQUlpQixDQUFUO0FBQ0FwQixRQUFJLEdBQUdBLElBQUksQ0FBQ21CLFNBQUwsQ0FBZUMsQ0FBZixDQUFQO0FBQ0Q7O0FBRUQsV0FBU04sYUFBVCxHQUEwQjtBQUN4QixVQUFNTyxLQUFLLEdBQUdyQixJQUFJLENBQUNTLEtBQUwsQ0FBV2IsWUFBWCxDQUFkOztBQUNBLFFBQUl5QixLQUFKLEVBQVc7QUFDVCxZQUFNWixLQUFLLEdBQUc7QUFDWmEsZUFBTyxFQUFFRCxLQUFLLENBQUMsQ0FBRCxDQURGO0FBRVpFLGFBQUssRUFBRSxFQUZLO0FBR1pGLGFBQUssRUFBRWxCO0FBSEssT0FBZDtBQUtBUSxhQUFPLENBQUNVLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU3RELE1BQVYsQ0FBUDtBQUNBLFVBQUl5RCxHQUFKLEVBQVNDLElBQVQ7O0FBQ0EsYUFBTyxFQUFFRCxHQUFHLEdBQUd4QixJQUFJLENBQUNTLEtBQUwsQ0FBV1gsYUFBWCxDQUFSLE1BQXVDMkIsSUFBSSxHQUFHekIsSUFBSSxDQUFDUyxLQUFMLENBQVdoQixTQUFYLENBQTlDLENBQVAsRUFBNkU7QUFDM0VrQixlQUFPLENBQUNjLElBQUksQ0FBQyxDQUFELENBQUosQ0FBUTFELE1BQVQsQ0FBUDtBQUNBMEMsYUFBSyxDQUFDYyxLQUFOLENBQVlHLElBQVosQ0FBaUJELElBQWpCO0FBQ0Q7O0FBQ0QsVUFBSUQsR0FBSixFQUFTO0FBQ1BmLGFBQUssQ0FBQ2tCLFVBQU4sR0FBbUJILEdBQUcsQ0FBQyxDQUFELENBQXRCO0FBQ0FiLGVBQU8sQ0FBQ2EsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPekQsTUFBUixDQUFQO0FBQ0EwQyxhQUFLLENBQUNlLEdBQU4sR0FBWXJCLEtBQVo7QUFDQSxlQUFPTSxLQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFdBQVNNLGNBQVQsQ0FBeUJOLEtBQXpCLEVBQWdDO0FBQzlCLFVBQU1hLE9BQU8sR0FBR2IsS0FBSyxDQUFDYSxPQUF0QjtBQUNBLFVBQU1NLEtBQUssR0FBRyxDQUFDLENBQUNuQixLQUFLLENBQUNrQixVQUF0QjtBQUVBLFVBQU1KLEtBQUssR0FBR2QsS0FBSyxDQUFDYyxLQUFOLENBQVluRCxHQUFaLENBQWlCeUQsSUFBRCxJQUFVO0FBQ3RDLGFBQU87QUFDTC9DLFlBQUksRUFBRStDLElBQUksQ0FBQyxDQUFELENBREw7QUFFTDFDLGFBQUssRUFBRTBDLElBQUksQ0FBQyxDQUFELENBQUosSUFBV0EsSUFBSSxDQUFDLENBQUQsQ0FBZixJQUFzQkEsSUFBSSxDQUFDLENBQUQsQ0FBMUIsSUFBaUM7QUFGbkMsT0FBUDtBQUlELEtBTGEsQ0FBZDs7QUFPQSxRQUFJLENBQUNELEtBQUwsRUFBWTtBQUNWMUIsV0FBSyxDQUFDd0IsSUFBTixDQUFXO0FBQUVuRSxXQUFHLEVBQUUrRCxPQUFQO0FBQWdCUSxxQkFBYSxFQUFFUixPQUFPLENBQUNTLFdBQVIsRUFBL0I7QUFBc0RSLGFBQUssRUFBRUE7QUFBN0QsT0FBWDtBQUNBbEIsYUFBTyxHQUFHaUIsT0FBVjtBQUNEOztBQUVELFFBQUlyQixPQUFPLENBQUNvQixLQUFaLEVBQW1CO0FBQ2pCcEIsYUFBTyxDQUFDb0IsS0FBUixDQUFjQyxPQUFkLEVBQXVCQyxLQUF2QixFQUE4QkssS0FBOUIsRUFBcUNuQixLQUFLLENBQUNZLEtBQTNDLEVBQWtEWixLQUFLLENBQUNlLEdBQXhEO0FBQ0Q7QUFDRjs7QUFFRCxXQUFTWixXQUFULENBQXNCVSxPQUF0QixFQUErQkQsS0FBL0IsRUFBc0NHLEdBQXRDLEVBQTJDO0FBQ3pDLFFBQUlRLEdBQUosRUFBU0MsaUJBQVQ7QUFDQSxRQUFJWixLQUFLLElBQUksSUFBYixFQUFtQkEsS0FBSyxHQUFHbEIsS0FBUjtBQUNuQixRQUFJcUIsR0FBRyxJQUFJLElBQVgsRUFBaUJBLEdBQUcsR0FBR3JCLEtBQU4sQ0FId0IsQ0FLekM7O0FBQ0EsUUFBSW1CLE9BQUosRUFBYTtBQUNYVyx1QkFBaUIsR0FBR1gsT0FBTyxDQUFDUyxXQUFSLEVBQXBCOztBQUNBLFdBQUtDLEdBQUcsR0FBRzlCLEtBQUssQ0FBQ25DLE1BQU4sR0FBZSxDQUExQixFQUE2QmlFLEdBQUcsSUFBSSxDQUFwQyxFQUF1Q0EsR0FBRyxFQUExQyxFQUE4QztBQUM1QyxZQUFJOUIsS0FBSyxDQUFDOEIsR0FBRCxDQUFMLENBQVdGLGFBQVgsS0FBNkJHLGlCQUFqQyxFQUFvRDtBQUNsRDtBQUNEO0FBQ0Y7QUFDRixLQVBELE1BT087QUFDTDtBQUNBRCxTQUFHLEdBQUcsQ0FBTjtBQUNEOztBQUVELFFBQUlBLEdBQUcsSUFBSSxDQUFYLEVBQWM7QUFDWjtBQUNBLFdBQUssSUFBSS9DLENBQUMsR0FBR2lCLEtBQUssQ0FBQ25DLE1BQU4sR0FBZSxDQUE1QixFQUErQmtCLENBQUMsSUFBSStDLEdBQXBDLEVBQXlDL0MsQ0FBQyxFQUExQyxFQUE4QztBQUM1QyxZQUFJZ0IsT0FBTyxDQUFDdUIsR0FBWixFQUFpQjtBQUNmdkIsaUJBQU8sQ0FBQ3VCLEdBQVIsQ0FBWXRCLEtBQUssQ0FBQ2pCLENBQUQsQ0FBTCxDQUFTMUIsR0FBckIsRUFBMEI4RCxLQUExQixFQUFpQ0csR0FBakM7QUFDRDtBQUNGLE9BTlcsQ0FRWjs7O0FBQ0F0QixXQUFLLENBQUNuQyxNQUFOLEdBQWVpRSxHQUFmO0FBQ0EzQixhQUFPLEdBQUcyQixHQUFHLElBQUk5QixLQUFLLENBQUM4QixHQUFHLEdBQUcsQ0FBUCxDQUFMLENBQWV6RSxHQUFoQztBQUNEO0FBQ0Y7QUFDRixDOzs7Ozs7Ozs7Ozs7Ozs7OztRQy9JZTJFLEssR0FBQUEsSzs7QUFGaEI7Ozs7QUFDQTs7OztBQUpBOzs7QUFLTyxTQUFTQSxLQUFULENBQWU1QyxRQUFmLEVBQXlCO0FBQzlCLE1BQUk2QyxJQUFKO0FBQ0EsTUFBSUMsYUFBSjtBQUNBLDRCQUFVOUMsUUFBVixFQUFvQjtBQUNsQitCLFNBQUssQ0FBRTlELEdBQUYsRUFBT2dFLEtBQVAsRUFBY0ssS0FBZCxFQUFxQjtBQUN4QixVQUFJUyxPQUFPLEdBQUc7QUFDWjdELFlBQUksRUFBRSxDQURNO0FBRVpqQixXQUZZO0FBR1p5QixpQkFBUyxFQUFFdUMsS0FIQztBQUlaZSxjQUFNLEVBQUVGLGFBSkk7QUFLWi9FLGdCQUFRLEVBQUU7QUFMRSxPQUFkO0FBUUFrRixnQkFBVSxDQUFDRixPQUFELENBQVY7QUFDQUcsZUFBUyxDQUFDSCxPQUFELEVBQVVELGFBQVYsQ0FBVDs7QUFFQSxVQUFJLENBQUNELElBQUwsRUFBVztBQUNUQSxZQUFJLEdBQUdFLE9BQVA7QUFDRDs7QUFFRCxVQUFJRCxhQUFKLEVBQW1CO0FBQ2pCLFlBQUlDLE9BQU8sQ0FBQ0ksTUFBUixJQUFrQkosT0FBTyxDQUFDSyxJQUE5QixFQUFvQyxDQUNsQztBQUNELFNBRkQsTUFFTztBQUNMTix1QkFBYSxDQUFDL0UsUUFBZCxDQUF1QnFFLElBQXZCLENBQTRCVyxPQUE1QjtBQUNEO0FBQ0Y7O0FBRUQsVUFBSSxDQUFDVCxLQUFMLEVBQVk7QUFDVlEscUJBQWEsR0FBR0MsT0FBaEI7QUFDRDtBQUNGLEtBNUJpQjs7QUE2QmxCYixPQUFHLEdBQUk7QUFDTFksbUJBQWEsR0FBR0EsYUFBYSxDQUFDRSxNQUE5QjtBQUNELEtBL0JpQjs7QUFnQ2xCcEIsU0FBSyxDQUFFdEMsSUFBRixFQUFRO0FBQ1gsVUFBSSxDQUFDd0QsYUFBTCxFQUFvQjtBQUFDO0FBQU87O0FBQzVCLFVBQUl4RCxJQUFKLEVBQVU7QUFDUixZQUFJVixHQUFHLEdBQUd5RSxTQUFTLENBQUMvRCxJQUFELENBQW5COztBQUNBLFlBQUlWLEdBQUosRUFBUztBQUNQa0UsdUJBQWEsQ0FBQy9FLFFBQWQsQ0FBdUJxRSxJQUF2QixDQUE0QjtBQUMxQmxELGdCQUFJLEVBQUUsQ0FEb0I7QUFDakI7QUFDVEMsc0JBQVUsRUFBRVA7QUFGYyxXQUE1QjtBQUlELFNBTEQsTUFLTztBQUNMa0UsdUJBQWEsQ0FBQy9FLFFBQWQsQ0FBdUJxRSxJQUF2QixDQUE0QjtBQUMxQmxELGdCQUFJLEVBQUUsQ0FEb0I7QUFDakI7QUFDVEk7QUFGMEIsV0FBNUI7QUFJRDtBQUNGO0FBQ0Y7O0FBaERpQixHQUFwQjtBQWtEQSxTQUFPdUQsSUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7OztBQU9BLFNBQVNJLFVBQVQsQ0FBcUI1RixFQUFyQixFQUF5QjtBQUN2QixNQUFJdUIsR0FBSjs7QUFDQSxNQUFLQSxHQUFHLEdBQUcsOEJBQWlCdkIsRUFBakIsRUFBcUIsT0FBckIsQ0FBWCxFQUEyQztBQUN6QyxVQUFNaUcsR0FBRyxHQUFHQyxRQUFRLENBQUMzRSxHQUFELENBQXBCOztBQUNBLFFBQUkwRSxHQUFKLEVBQVM7QUFDUEUsWUFBTSxDQUFDQyxNQUFQLENBQWNwRyxFQUFkLEVBQWtCaUcsR0FBbEI7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0QsU0FBU0MsUUFBVCxDQUFtQjNFLEdBQW5CLEVBQXdCO0FBQ3RCLFFBQU04RSxVQUFVLEdBQUcsb0NBQW5CO0FBQ0EsUUFBTUMsYUFBYSxHQUFHLFVBQXRCO0FBQ0EsUUFBTUMsYUFBYSxHQUFHLGdDQUF0QixDQUhzQixDQUt0Qjs7QUFFQSxRQUFNQyxPQUFPLEdBQUdqRixHQUFHLENBQUN1QyxLQUFKLENBQVV1QyxVQUFWLENBQWhCO0FBQ0EsTUFBSSxDQUFDRyxPQUFMLEVBQWM7QUFDZCxRQUFNUCxHQUFHLEdBQUcsRUFBWjtBQUNBQSxLQUFHLENBQUNoRyxHQUFKLEdBQVV1RyxPQUFPLENBQUMsQ0FBRCxDQUFQLENBQVc1RCxJQUFYLEVBQVYsQ0FWc0IsQ0FVTTs7QUFDNUIsUUFBTTdCLEtBQUssR0FBR3lGLE9BQU8sQ0FBQyxDQUFELENBQVAsQ0FBVzVELElBQVgsR0FBa0I2RCxPQUFsQixDQUEwQkgsYUFBMUIsRUFBeUMsRUFBekMsQ0FBZCxDQVhzQixDQVdxQzs7QUFDM0QsUUFBTUksYUFBYSxHQUFHM0YsS0FBSyxDQUFDK0MsS0FBTixDQUFZeUMsYUFBWixDQUF0Qjs7QUFDQSxNQUFJRyxhQUFKLEVBQW1CO0FBQ2pCVCxPQUFHLENBQUNsRixLQUFKLEdBQVlBLEtBQUssQ0FBQzBGLE9BQU4sQ0FBY0YsYUFBZCxFQUE2QixFQUE3QixFQUFpQzNELElBQWpDLEVBQVosQ0FEaUIsQ0FDbUM7O0FBQ3BEcUQsT0FBRyxDQUFDcEYsU0FBSixHQUFnQjZGLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUI5RCxJQUFqQixFQUFoQixDQUZpQixDQUV1Qjs7QUFDeEMsUUFBSThELGFBQWEsQ0FBQyxDQUFELENBQWpCLEVBQXNCO0FBQ3BCVCxTQUFHLENBQUNuRixTQUFKLEdBQWdCNEYsYUFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQjlELElBQWpCLEVBQWhCLENBRG9CLENBQ29CO0FBQ3pDO0FBQ0YsR0FORCxNQU1PO0FBQ0xxRCxPQUFHLENBQUNsRixLQUFKLEdBQVlBLEtBQVo7QUFDRDs7QUFDRCxTQUFPa0YsR0FBUDtBQUNEOztBQUVELFNBQVNKLFNBQVQsQ0FBb0I3RixFQUFwQixFQUF3QjJGLE1BQXhCLEVBQWdDO0FBQzlCLE1BQUlwRSxHQUFKOztBQUNBLE1BQUlBLEdBQUcsR0FBRyw4QkFBaUJ2QixFQUFqQixFQUFxQixNQUFyQixDQUFWLEVBQXdDO0FBQ3RDQSxNQUFFLENBQUNJLEVBQUgsR0FBUSxJQUFSO0FBQ0F1RyxrQkFBYyxDQUFDM0csRUFBRCxFQUFLO0FBQ2pCdUIsU0FBRyxFQUFFQSxHQURZO0FBRWpCQyxXQUFLLEVBQUV4QjtBQUZVLEtBQUwsQ0FBZDtBQUlELEdBTkQsTUFNTyxJQUFJdUIsR0FBRyxHQUFHLDhCQUFpQnZCLEVBQWpCLEVBQXFCLFdBQXJCLENBQVYsRUFBNkM7QUFDbERBLE1BQUUsQ0FBQzhGLE1BQUgsR0FBWSxJQUFaO0FBQ0EsVUFBTWMsSUFBSSxHQUFHQyxlQUFlLENBQUVsQixNQUFNLENBQUNqRixRQUFULENBQTVCO0FBQ0FrRyxRQUFJLElBQUlELGNBQWMsQ0FBQ0MsSUFBRCxFQUFPO0FBQzNCckYsU0FBRyxFQUFFQSxHQURzQjtBQUUzQkMsV0FBSyxFQUFFeEI7QUFGb0IsS0FBUCxDQUF0QjtBQUlELEdBUE0sTUFPQSxJQUFJLENBQUN1QixHQUFHLEdBQUcsOEJBQWlCdkIsRUFBakIsRUFBcUIsUUFBckIsQ0FBUCxNQUEyQzhHLFNBQS9DLEVBQTBEO0FBQy9EOUcsTUFBRSxDQUFDK0YsSUFBSCxHQUFVLElBQVY7QUFDQSxVQUFNYSxJQUFJLEdBQUdDLGVBQWUsQ0FBRWxCLE1BQU0sQ0FBQ2pGLFFBQVQsQ0FBNUI7QUFDQWtHLFFBQUksSUFBSUQsY0FBYyxDQUFDQyxJQUFELEVBQU87QUFDM0JyRixTQUFHLEVBQUVBLEdBRHNCO0FBRTNCQyxXQUFLLEVBQUV4QjtBQUZvQixLQUFQLENBQXRCO0FBSUQ7QUFDRjs7QUFDRCxTQUFTMkcsY0FBVCxDQUF5QjNHLEVBQXpCLEVBQTZCcUIsU0FBN0IsRUFBd0M7QUFDdEMsTUFBSSxDQUFDckIsRUFBRSxDQUFDaUIsWUFBUixFQUFzQjtBQUNwQmpCLE1BQUUsQ0FBQ2lCLFlBQUgsR0FBa0IsRUFBbEI7QUFDRDs7QUFDRGpCLElBQUUsQ0FBQ2lCLFlBQUgsQ0FBZ0I4RCxJQUFoQixDQUFxQjFELFNBQXJCO0FBQ0Q7O0FBQ0QsU0FBU3dGLGVBQVQsQ0FBMEJuRyxRQUExQixFQUFvQztBQUNsQyxNQUFJNEIsQ0FBQyxHQUFHNUIsUUFBUSxDQUFDVSxNQUFqQjs7QUFDQSxTQUFPa0IsQ0FBQyxFQUFSLEVBQVk7QUFDVixRQUFJNUIsUUFBUSxDQUFDNEIsQ0FBRCxDQUFSLENBQVlULElBQVosS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUIsYUFBT25CLFFBQVEsQ0FBQzRCLENBQUQsQ0FBZjtBQUNELEtBRkQsTUFFTztBQUNMNUIsY0FBUSxDQUFDcUcsR0FBVDtBQUNEO0FBQ0Y7QUFDRjtBQUVEOzs7Ozs7QUFJQSxTQUFTZixTQUFULENBQW9CL0QsSUFBcEIsRUFBMEI7QUFDeEIsUUFBTStFLEtBQUssR0FBRywwQkFBZDs7QUFDQSxNQUFJLENBQUNBLEtBQUssQ0FBQ0MsSUFBTixDQUFXaEYsSUFBWCxDQUFMLEVBQXVCO0FBQUU7QUFBUTs7QUFFakMsTUFBSWlGLFNBQVMsR0FBR0YsS0FBSyxDQUFDRSxTQUFOLEdBQWtCLENBQWxDO0FBQ0EsTUFBSXBELEtBQUo7QUFDQSxNQUFJcUQsTUFBTSxHQUFHLEVBQWI7O0FBQ0EsU0FBUXJELEtBQUssR0FBR2tELEtBQUssQ0FBQ0ksSUFBTixDQUFXbkYsSUFBWCxDQUFoQixFQUFtQztBQUNqQztBQUNBLFFBQUk2QixLQUFLLENBQUNOLEtBQU4sR0FBYzBELFNBQWxCLEVBQTZCO0FBQzNCQyxZQUFNLENBQUNwQyxJQUFQLENBQVloRCxJQUFJLENBQUNDLFNBQUwsQ0FBZUMsSUFBSSxDQUFDZixLQUFMLENBQVdnRyxTQUFYLEVBQXNCcEQsS0FBSyxDQUFDTixLQUE1QixDQUFmLENBQVo7QUFDRCxLQUpnQyxDQU1qQzs7O0FBQ0EyRCxVQUFNLENBQUNwQyxJQUFQLENBQWEsTUFBS2pCLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU2xCLElBQVQsRUFBZ0IsR0FBbEM7QUFFQXNFLGFBQVMsR0FBR0YsS0FBSyxDQUFDRSxTQUFsQjtBQUNELEdBakJ1QixDQW1CeEI7OztBQUNBLE1BQUlBLFNBQVMsR0FBR2pGLElBQUksQ0FBQ2IsTUFBckIsRUFBNkI7QUFDM0IrRixVQUFNLENBQUNwQyxJQUFQLENBQVloRCxJQUFJLENBQUNDLFNBQUwsQ0FBZUMsSUFBSSxDQUFDZixLQUFMLENBQVdnRyxTQUFYLENBQWYsQ0FBWjtBQUNEOztBQUVELFNBQU9DLE1BQU0sQ0FBQ3ZGLElBQVAsQ0FBWSxHQUFaLENBQVA7QUFDRCxDLENBQ0QsMkM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdLQTs7O0FBR0EsTUFBTXlGLGdCQUFnQixHQUFHQyxLQUFLLENBQUNDLFNBQS9CO0FBQ08sTUFBTUMsa0JBQWtCLFdBQWxCQSxrQkFBa0IsR0FBR3JCLE1BQU0sQ0FBQ3NCLE1BQVAsQ0FBY0osZ0JBQWQsQ0FBM0I7QUFFTixDQUFDLE1BQUQsRUFBUyxLQUFULEVBQWdCLE9BQWhCLEVBQXlCLFNBQXpCLEVBQW9DLFFBQXBDLEVBQThDLE1BQTlDLEVBQXNELFNBQXRELEVBQWlFSyxPQUFqRSxDQUF5RUMsTUFBTSxJQUFJO0FBQ2xGO0FBQ0EsUUFBTUMsWUFBWSxHQUFHUCxnQkFBZ0IsQ0FBQ00sTUFBRCxDQUFyQztBQUNBeEIsUUFBTSxDQUFDMEIsY0FBUCxDQUFzQkwsa0JBQXRCLEVBQTBDRyxNQUExQyxFQUFrRDtBQUNoRG5GLFNBQUssRUFBRSxZQUFZO0FBQ2pCLFlBQU1zRixNQUFNLEdBQUdGLFlBQVksQ0FBQ0csS0FBYixDQUFtQixJQUFuQixFQUF5QkMsU0FBekIsQ0FBZjs7QUFDQSxXQUFLQyxrQkFBTCxDQUF3QkMsR0FBeEIsQ0FBNEJDLE1BQTVCOztBQUNBLGFBQU9MLE1BQVA7QUFDRCxLQUwrQztBQU1oRE0sY0FBVSxFQUFFLEtBTm9DO0FBT2hEQyxZQUFRLEVBQUUsSUFQc0M7QUFRaERDLGdCQUFZLEVBQUU7QUFSa0MsR0FBbEQ7QUFVRCxDQWJBLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkQ7Ozs7QUFHQTs7OztBQUllLE1BQU1DLEdBQU4sQ0FBVTtBQUN2QjtBQUNBO0FBQ0E7QUFZQUMsYUFBVyxHQUFJO0FBQUEsa0NBRFIsRUFDUTtBQUNkOztBQUNEQyxRQUFNLENBQUVDLEdBQUYsRUFBTztBQUNYLFNBQUtDLElBQUwsQ0FBVTVELElBQVYsQ0FBZTJELEdBQWY7QUFDRDs7QUFDRFAsUUFBTSxHQUFJO0FBQ1I7QUFDQSxVQUFNUSxJQUFJLEdBQUcsS0FBS0EsSUFBTCxDQUFVekgsS0FBVixFQUFiO0FBQ0F5SCxRQUFJLENBQUNqQixPQUFMLENBQWFnQixHQUFHLElBQUlBLEdBQUcsQ0FBQ0UsTUFBSixFQUFwQjtBQUNEOztBQXhCc0I7O2tCQUFKTCxHOztnQkFBQUEsRyxZQUlILEk7O2dCQUpHQSxHLGtCQUtHLEU7O2dCQUxIQSxHLGdCQU1DLFVBQVVNLGFBQVYsRUFBeUI7QUFDM0NOLEtBQUcsQ0FBQ08sWUFBSixDQUFpQi9ELElBQWpCLENBQXNCd0QsR0FBRyxDQUFDUSxNQUExQjs7QUFDQVIsS0FBRyxDQUFDUSxNQUFKLEdBQWFGLGFBQWI7QUFDRCxDOztnQkFUa0JOLEcsZUFVQSxZQUFZO0FBQzdCQSxLQUFHLENBQUNRLE1BQUosR0FBYVIsR0FBRyxDQUFDTyxZQUFKLENBQWlCL0IsR0FBakIsRUFBYjtBQUNELEM7Ozs7Ozs7Ozs7Ozs7Ozs7O1FDeUJhaUMsYyxHQUFBQSxjO1FBbUNBQyxPLEdBQUFBLE87O0FBNUVoQjs7OztBQUNBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQyxjQUFOLENBQXFCO0FBR2xDVixhQUFXLENBQUVwRyxHQUFGLEVBQU87QUFBQTs7QUFBQTs7QUFDaEIsU0FBS0ksS0FBTCxHQUFhSixHQUFiLENBRGdCLENBRWhCOztBQUNBLFNBQUs4RixHQUFMLEdBQVcsSUFBSUssYUFBSixFQUFYO0FBQ0FwQyxVQUFNLENBQUMwQixjQUFQLENBQXNCekYsR0FBdEIsRUFBMkIsb0JBQTNCLEVBQWlEO0FBQy9DSSxXQUFLLEVBQUUsSUFEd0M7QUFFL0M0RixnQkFBVSxFQUFFLEtBRm1DO0FBRy9DQyxjQUFRLEVBQUUsSUFIcUM7QUFJL0NDLGtCQUFZLEVBQUU7QUFKaUMsS0FBakQ7O0FBTUEsUUFBSWhCLEtBQUssQ0FBQzZCLE9BQU4sQ0FBYy9HLEdBQWQsQ0FBSixFQUF3QjtBQUN0Qix5QkFBUUEsR0FBUixFQUFhb0YseUJBQWI7QUFDRDtBQUNEOzs7Ozs7Ozs7O0FBUUEsU0FBSzRCLElBQUwsQ0FBVWhILEdBQVY7QUFDRDs7QUFDRGdILE1BQUksQ0FBRUMsR0FBRixFQUFPO0FBQ1RsRCxVQUFNLENBQUNtRCxJQUFQLENBQVlELEdBQVosRUFBaUIzQixPQUFqQixDQUF5QjZCLEdBQUcsSUFBSVAsY0FBYyxDQUFDSyxHQUFELEVBQU1FLEdBQU4sRUFBV0YsR0FBRyxDQUFDRSxHQUFELENBQWQsQ0FBOUM7QUFDRDs7QUFDREMsY0FBWSxDQUFFQyxHQUFGLEVBQU87QUFDakJBLE9BQUcsQ0FBQy9CLE9BQUosQ0FBWWdDLElBQUksSUFBSVQsT0FBTyxDQUFDUyxJQUFELENBQTNCO0FBQ0Q7O0FBL0JpQzs7a0JBQWZSLGMsRUFrQ3JCO0FBQ0E7QUFDQTs7QUFDTyxTQUFTRixjQUFULENBQXdCSyxHQUF4QixFQUE2QkUsR0FBN0IsRUFBa0NuSCxHQUFsQyxFQUF1QztBQUM1QyxNQUFJdUgsUUFBUSxHQUFHVixPQUFPLENBQUM3RyxHQUFELENBQXRCO0FBQ0EsUUFBTThGLEdBQUcsR0FBRyxJQUFJSyxhQUFKLEVBQVosQ0FGNEMsQ0FFdEI7O0FBQ3RCcEMsUUFBTSxDQUFDMEIsY0FBUCxDQUFzQndCLEdBQXRCLEVBQTJCRSxHQUEzQixFQUFnQztBQUM5Qm5CLGNBQVUsRUFBRSxJQURrQjtBQUU5QkUsZ0JBQVksRUFBRSxJQUZnQjtBQUc5QnNCLE9BQUcsRUFBRSxTQUFTQyxjQUFULEdBQTJCO0FBQzlCLFVBQUl0QixjQUFJUSxNQUFSLEVBQWdCO0FBQ2Q7QUFDQWIsV0FBRyxDQUFDTyxNQUFKLENBQVdGLGNBQUlRLE1BQWYsRUFGYyxDQUlkO0FBQ0E7O0FBQ0FZLGdCQUFRLElBQUlBLFFBQVEsQ0FBQ3pCLEdBQVQsQ0FBYU8sTUFBYixDQUFvQkYsY0FBSVEsTUFBeEIsQ0FBWixDQU5jLENBUWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNEOztBQUVELGFBQU8zRyxHQUFQO0FBQ0QsS0FwQjZCO0FBcUI5QjBILE9BQUcsRUFBRSxTQUFTQyxjQUFULENBQXlCQyxNQUF6QixFQUFpQztBQUNwQyxVQUFJNUgsR0FBRyxLQUFLNEgsTUFBWixFQUNFO0FBQ0Y1SCxTQUFHLEdBQUc0SCxNQUFOO0FBQ0FMLGNBQVEsR0FBR1YsT0FBTyxDQUFDN0csR0FBRCxDQUFsQjtBQUNBOEYsU0FBRyxDQUFDQyxNQUFKO0FBQ0Q7QUEzQjZCLEdBQWhDO0FBNkJELEMsQ0FFRDs7O0FBQ08sU0FBU2MsT0FBVCxDQUFpQjdHLEdBQWpCLEVBQXNCNkgsRUFBdEIsRUFBMEI7QUFDL0IsTUFBSSxDQUFDN0gsR0FBRCxJQUFRLGFBQWEsT0FBT0EsR0FBaEMsRUFDRTtBQUVGLE1BQUlBLEdBQUcsQ0FBQzZGLGtCQUFSLEVBQ0UsT0FBTzdGLEdBQUcsQ0FBQzZGLGtCQUFYO0FBRUYsU0FBTyxJQUFJaUIsY0FBSixDQUFtQjlHLEdBQW5CLENBQVA7QUFDRDs7QUFFRCxTQUFTOEgsV0FBVCxDQUFxQlQsR0FBckIsRUFBMEI7QUFDeEJBLEtBQUcsQ0FBQy9CLE9BQUosQ0FBWXlDLEdBQUcsSUFBSTtBQUNqQkEsT0FBRyxJQUFJQSxHQUFHLENBQUNsQyxrQkFBWCxJQUFpQ2tDLEdBQUcsQ0FBQ2xDLGtCQUFKLENBQXVCQyxHQUF2QixDQUEyQk8sTUFBM0IsQ0FBa0NGLGNBQUlRLE1BQXRDLENBQWpDO0FBQ0F6QixTQUFLLENBQUM2QixPQUFOLENBQWNnQixHQUFkLEtBQXNCRCxXQUFXLENBQUNDLEdBQUQsQ0FBakM7QUFDRCxHQUhEO0FBSUQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0ZEOzs7O0FBQ0E7Ozs7QUFKQTs7O0FBTWUsTUFBTUMsT0FBTixDQUFjO0FBQzNCNUIsYUFBVyxDQUFFeUIsRUFBRixFQUFNSSxPQUFOLEVBQWVDLEVBQWYsRUFBbUI7QUFDNUIsU0FBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS0wsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS00sTUFBTCxHQUFjLE9BQU9GLE9BQVAsS0FBbUIsVUFBbkIsR0FBZ0NBLE9BQWhDLEdBQTBDLHFCQUFVQSxPQUFWLENBQXhELENBSDRCLENBSTVCOztBQUNBLFNBQUs3SCxLQUFMLEdBQWEsS0FBS29ILEdBQUwsRUFBYjtBQUNEOztBQUNEQSxLQUFHLEdBQUk7QUFDTHJCLGtCQUFJaUMsVUFBSixDQUFlLElBQWY7O0FBQ0EsVUFBTXBJLEdBQUcsR0FBRyxLQUFLbUksTUFBTCxDQUFZRSxJQUFaLENBQWlCLEtBQUtSLEVBQXRCLEVBQTBCLEtBQUtBLEVBQS9CLENBQVosQ0FGSyxDQUUwQzs7QUFDL0MxQixrQkFBSW1DLFNBQUo7O0FBQ0EsV0FBT3RJLEdBQVA7QUFDRDs7QUFDRHdHLFFBQU0sR0FBSTtBQUNSLFNBQUsrQixHQUFMO0FBQ0Q7O0FBQ0RBLEtBQUcsR0FBSTtBQUNMLFVBQU1YLE1BQU0sR0FBRyxLQUFLSixHQUFMLEVBQWY7O0FBQ0EsUUFBSSxLQUFLcEgsS0FBTCxLQUFld0gsTUFBbkIsRUFBMkI7QUFDekIsWUFBTVksUUFBUSxHQUFHLEtBQUtwSSxLQUF0QjtBQUNBLFdBQUtBLEtBQUwsR0FBYXdILE1BQWI7QUFDQSxXQUFLTSxFQUFMLElBQVcsS0FBS0EsRUFBTCxDQUFRRyxJQUFSLENBQWEsS0FBS1IsRUFBbEIsRUFBc0JELE1BQXRCLEVBQThCWSxRQUE5QixDQUFYO0FBQ0Q7QUFDRjs7QUF4QjBCOztrQkFBUlIsTzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUNITFMsVyxHQUFBQSxXOztBQUhoQjs7O0FBR08sU0FBU0EsV0FBVCxDQUFzQnJJLEtBQXRCLEVBQTZCO0FBQ2xDLFFBQU1YLElBQUksR0FBRyxPQUFPVyxLQUFwQjtBQUNBLFNBQ0VYLElBQUksS0FBSyxRQUFULElBQ0FBLElBQUksS0FBSyxRQURULElBRUFBLElBQUksS0FBSyxRQUZULElBR0FBLElBQUksS0FBSyxTQUpYO0FBTUQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWEQ7OztBQUdPLE1BQU1pSixRQUFRLFdBQVJBLFFBQVEsR0FBRyxlQUFlLEVBQWhDLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQVA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO1FBRWdCQyxRLEdBQUFBLFE7UUFHQUMsUSxHQUFBQSxROztBQVZoQjs7O0FBT08sU0FBU0QsUUFBVCxDQUFtQjFCLEdBQW5CLEVBQXdCO0FBQzdCLFNBQU9BLEdBQUcsS0FBSyxJQUFSLElBQWdCLE9BQU9BLEdBQVAsS0FBZSxRQUF0QztBQUNEOztBQUNNLFNBQVMyQixRQUFULENBQW1CNUksR0FBbkIsRUFBd0I7QUFDN0IsU0FBT0EsR0FBRyxJQUFJLElBQVAsR0FDSCxFQURHLEdBRUgsT0FBT0EsR0FBUCxLQUFlLFFBQWYsR0FDRUwsSUFBSSxDQUFDQyxTQUFMLENBQWVJLEdBQWYsRUFBb0IsSUFBcEIsRUFBMEIsQ0FBMUIsQ0FERixHQUVFNkksTUFBTSxDQUFDN0ksR0FBRCxDQUpaO0FBS0QsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUNYZThJLFMsR0FBQUEsUztRQWNBQyxPLEdBQUFBLE87O0FBaEJoQjs7QUFIQTs7O0FBS08sU0FBU0QsU0FBVCxDQUFtQkUsSUFBbkIsRUFBeUI7QUFDOUI7QUFDQSxRQUFNQyxRQUFRLEdBQUdELElBQUksQ0FBQ0UsS0FBTCxDQUFXLFVBQVgsRUFBdUJDLE1BQXZCLENBQThCcEIsR0FBRyxJQUFJQSxHQUFHLEtBQUssRUFBN0MsQ0FBakI7QUFDQSxRQUFNNUgsR0FBRyxHQUFHOEksUUFBUSxDQUFDakssTUFBckI7QUFDQSxTQUFPLFVBQVU2SSxFQUFWLEVBQWM7QUFDbkIsUUFBSVosR0FBRyxHQUFHWSxFQUFFLENBQUN1QixLQUFiOztBQUNBLFNBQUssSUFBSWxKLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEtBQUtDLEdBQXRCLEVBQTJCRCxDQUFDLEVBQTVCLEVBQWdDO0FBQzlCLFVBQUksQ0FBQytHLEdBQUwsRUFBVTtBQUNWQSxTQUFHLEdBQUdBLEdBQUcsQ0FBQ2dDLFFBQVEsQ0FBQy9JLENBQUQsQ0FBVCxDQUFUO0FBQ0Q7O0FBQ0QsV0FBTytHLEdBQVA7QUFDRCxHQVBEO0FBUUQ7O0FBRU0sU0FBUzhCLE9BQVQsQ0FBa0JwQyxNQUFsQixFQUEwQjBDLEdBQTFCLEVBQStCO0FBQ3BDLE1BQUlYLGFBQUosRUFBYztBQUNaL0IsVUFBTSxDQUFDMkMsU0FBUCxHQUFtQkQsR0FBbkI7QUFDRCxHQUZELE1BRU87QUFDTHRGLFVBQU0sQ0FBQ3dGLG1CQUFQLENBQTJCRixHQUEzQixFQUFnQy9ELE9BQWhDLENBQXlDNkIsR0FBRCxJQUFTO0FBQy9DcEQsWUFBTSxDQUFDMEIsY0FBUCxDQUFzQmtCLE1BQXRCLEVBQThCUSxHQUE5QixFQUFtQztBQUNqQy9HLGFBQUssRUFBRWlKLEdBQUcsQ0FBQ2xDLEdBQUQsQ0FEdUI7QUFFakNuQixrQkFBVSxFQUFFLEtBRnFCO0FBR2pDQyxnQkFBUSxFQUFFLElBSHVCO0FBSWpDQyxvQkFBWSxFQUFFO0FBSm1CLE9BQW5DO0FBTUQsS0FQRDtBQVFEO0FBQ0YsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUMxQmVzRCxhLEdBQUFBLGE7O0FBSGhCOzs7O0FBQ0E7Ozs7QUFKQTs7O0FBTU8sU0FBU0EsYUFBVCxDQUF3QkMsT0FBeEIsRUFBaUNqTCxHQUFqQyxFQUFzQ0osSUFBdEMsRUFBNENFLFFBQTVDLEVBQXNEO0FBQzNEO0FBQ0EsTUFBSUEsUUFBSixFQUFjO0FBQ1pBLFlBQVEsR0FBR29MLGlCQUFpQixDQUFDcEwsUUFBRCxDQUE1QjtBQUNELEdBSjBELENBTTNEOzs7QUFDQSxNQUFJcUwsS0FBSjs7QUFDQSxNQUFJLE9BQU9uTCxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0JtTCxTQUFLLEdBQUcsSUFBSUMsZUFBSixDQUFVcEwsR0FBVixFQUFlSixJQUFmLEVBQXFCRSxRQUFyQixFQUErQm9HLFNBQS9CLEVBQTBDQSxTQUExQyxFQUFxRCtFLE9BQXJELENBQVI7QUFDRDs7QUFFRCxTQUFPRSxLQUFQO0FBQ0Q7O0FBRUQsU0FBU0QsaUJBQVQsQ0FBNEJwTCxRQUE1QixFQUFzQztBQUNwQyxNQUFJLHlCQUFZQSxRQUFaLENBQUosRUFBMkI7QUFDekIsV0FBTyxDQUFDLElBQUlzTCxlQUFKLENBQVVsRixTQUFWLEVBQXFCQSxTQUFyQixFQUFnQ0EsU0FBaEMsRUFBMkNtRSxNQUFNLENBQUN2SyxRQUFELENBQWpELENBQUQsQ0FBUDtBQUNELEdBRkQsTUFFTyxJQUFJNEcsS0FBSyxDQUFDNkIsT0FBTixDQUFjekksUUFBZCxDQUFKLEVBQTZCO0FBQ2xDLFdBQU9BLFFBQVEsQ0FBQ2UsR0FBVCxDQUFjd0ssS0FBRCxJQUFXO0FBQzdCLFVBQUkseUJBQVlBLEtBQVosQ0FBSixFQUF3QjtBQUN0QixlQUFPLElBQUlELGVBQUosQ0FBVWxGLFNBQVYsRUFBcUJBLFNBQXJCLEVBQWdDQSxTQUFoQyxFQUEyQ21FLE1BQU0sQ0FBQ2dCLEtBQUQsQ0FBakQsQ0FBUDtBQUNEOztBQUNELGFBQU9BLEtBQVA7QUFDRCxLQUxNLENBQVA7QUFNRDtBQUNGLEM7Ozs7Ozs7Ozs7Ozs7Ozs7O1FDbkJlQyxlLEdBQUFBLGU7O0FBYmhCOzs7QUFHZSxNQUFNRixLQUFOLENBQVk7QUFDekJ4RCxhQUFXLENBQUU1SCxHQUFGLEVBQU9KLElBQVAsRUFBYUUsUUFBYixFQUF1QnVCLElBQXZCLEVBQTZCa0ssR0FBN0IsRUFBa0NOLE9BQWxDLEVBQTJDO0FBQ3BELFNBQUtqTCxHQUFMLEdBQVdBLEdBQVg7QUFDQSxTQUFLSixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLRSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFNBQUt1QixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLa0ssR0FBTCxHQUFXQSxHQUFYO0FBQ0EsU0FBS04sT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7O0FBUndCOztrQkFBTkcsSzs7QUFVZCxTQUFTRSxlQUFULENBQTBCakssSUFBMUIsRUFBZ0M7QUFDckMsU0FBTyxJQUFJK0osS0FBSixDQUFVbEYsU0FBVixFQUFxQkEsU0FBckIsRUFBZ0NBLFNBQWhDLEVBQTJDbUUsTUFBTSxDQUFDaEosSUFBRCxDQUFqRCxDQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkQ7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFQSxNQUFNbUssRUFBTixDQUFTO0FBQ1A1RCxhQUFXLENBQUVsRixPQUFPLEdBQUcsRUFBWixFQUFnQjtBQUFBLGdDQWlIdEI0SSxzQkFqSHNCOztBQUFBLGdDQWtIdEJsQixnQkFsSHNCOztBQUN6QixTQUFLcUIsUUFBTCxHQUFnQi9JLE9BQWhCO0FBQ0EsU0FBS2tJLEtBQUwsR0FBYSxLQUFLYSxRQUFMLENBQWM3TCxJQUEzQjs7QUFDQSxTQUFLOEwsTUFBTDs7QUFDQSxpQ0FBUSxLQUFLZCxLQUFiLEVBQW9CLElBQXBCLEVBSnlCLENBSUM7QUFDM0I7O0FBQ0RjLFFBQU0sR0FBSTtBQUNSLFFBQUtDLElBQUksR0FBRyxJQUFaO0FBQ0FwRyxVQUFNLENBQUNtRCxJQUFQLENBQVksS0FBS2tDLEtBQWpCLEVBQXdCOUQsT0FBeEIsQ0FBZ0M2QixHQUFHLElBQUk7QUFDckNwRCxZQUFNLENBQUMwQixjQUFQLENBQXNCMEUsSUFBdEIsRUFBNEJoRCxHQUE1QixFQUFpQztBQUMvQm5CLGtCQUFVLEVBQUUsSUFEbUI7QUFFL0JFLG9CQUFZLEVBQUUsSUFGaUI7QUFHL0JzQixXQUFHLEVBQUUsU0FBUzRDLFdBQVQsR0FBdUI7QUFDMUIsaUJBQU9ELElBQUksQ0FBQ2YsS0FBTCxDQUFXakMsR0FBWCxDQUFQO0FBQ0QsU0FMOEI7QUFNL0JPLFdBQUcsRUFBRSxTQUFTMkMsV0FBVCxDQUFzQnpDLE1BQXRCLEVBQThCO0FBQ2pDdUMsY0FBSSxDQUFDZixLQUFMLENBQVdqQyxHQUFYLElBQWtCUyxNQUFsQjtBQUNEO0FBUjhCLE9BQWpDO0FBVUQsS0FYRDtBQVlEOztBQUNEMEMsUUFBTSxDQUFFckMsT0FBRixFQUFXQyxFQUFYLEVBQWU7QUFDbkIsUUFBSUYsaUJBQUosQ0FBWSxJQUFaLEVBQWtCQyxPQUFsQixFQUEyQkMsRUFBM0I7QUFDRDs7QUFDRHFDLFFBQU0sQ0FBRTNNLEVBQUYsRUFBTTtBQUNWQSxNQUFFLEdBQUc0TSxRQUFRLENBQUNDLGFBQVQsQ0FBdUI3TSxFQUF2QixDQUFMO0FBQ0EsU0FBSzhNLEdBQUwsR0FBVzlNLEVBQVgsQ0FGVSxDQUlWOztBQUNBLFFBQUksQ0FBQyxLQUFLcU0sUUFBTCxDQUFjdk0sTUFBbkIsRUFBMkI7QUFDekIsWUFBTTtBQUFFQTtBQUFGLFVBQWEsb0JBQVEsS0FBS3VNLFFBQUwsQ0FBYzFKLFFBQXRCLENBQW5CO0FBQ0EsV0FBSzBKLFFBQUwsQ0FBY3ZNLE1BQWQsR0FBdUJBLE1BQXZCO0FBQ0QsS0FSUyxDQVVWOzs7QUFDQSxVQUFNaU4sZUFBZSxHQUFHLE1BQU07QUFDNUIsV0FBS0MsT0FBTCxDQUFhLEtBQUtDLE9BQUwsRUFBYjtBQUNELEtBRkQ7O0FBR0EsU0FBS0MsUUFBTCxHQUFnQixJQUFJOUMsaUJBQUosQ0FBWSxJQUFaLEVBQWtCMkMsZUFBbEIsRUFBbUMsSUFBbkMsQ0FBaEI7O0FBRUEsUUFBSSxLQUFLSSxNQUFMLElBQWUsSUFBbkIsRUFBeUI7QUFDdkIsV0FBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNEO0FBQ0Y7O0FBQ0RILFNBQU8sR0FBSTtBQUNULFVBQU1oRCxFQUFFLEdBQUcsSUFBWDtBQUNBLFVBQU07QUFBRW5LLFlBQUY7QUFBVXVOO0FBQVYsUUFBMkJwRCxFQUFFLENBQUNvQyxRQUFwQztBQUVBcEMsTUFBRSxDQUFDa0QsTUFBSCxHQUFZRSxZQUFaO0FBQ0EsVUFBTXRCLEtBQUssR0FBR2pNLE1BQU0sQ0FBQzJLLElBQVAsQ0FBWVIsRUFBWixFQUFnQkEsRUFBRSxDQUFDcUQsY0FBbkIsQ0FBZDtBQUNBdkIsU0FBSyxDQUFDcEcsTUFBTixHQUFlMEgsWUFBZjtBQUNBLFdBQU90QixLQUFQO0FBQ0Q7O0FBQ0RpQixTQUFPLENBQUVqQixLQUFGLEVBQVM7QUFDZCxVQUFNOUIsRUFBRSxHQUFHLElBQVg7QUFDQSxVQUFNc0QsTUFBTSxHQUFHdEQsRUFBRSxDQUFDNkMsR0FBbEI7QUFDQSxVQUFNVSxTQUFTLEdBQUd2RCxFQUFFLENBQUN3RCxNQUFyQjtBQUNBeEQsTUFBRSxDQUFDd0QsTUFBSCxHQUFZMUIsS0FBWjs7QUFDQSxRQUFJLENBQUN5QixTQUFMLEVBQWdCO0FBQ2Q7QUFDQXZELFFBQUUsQ0FBQzZDLEdBQUgsR0FBUzdDLEVBQUUsQ0FBQ3lELFNBQUgsQ0FBYXpELEVBQUUsQ0FBQzZDLEdBQWhCLEVBQXFCZixLQUFyQixDQUFUO0FBQ0QsS0FIRCxNQUdPO0FBQ0w7QUFDQTlCLFFBQUUsQ0FBQzZDLEdBQUgsR0FBUzdDLEVBQUUsQ0FBQ3lELFNBQUgsQ0FBYUYsU0FBYixFQUF3QnpCLEtBQXhCLENBQVQ7QUFDRDtBQUNGOztBQUNEMkIsV0FBUyxDQUFFQyxRQUFGLEVBQVk1QixLQUFaLEVBQW1CO0FBQzFCLFVBQU02QixrQkFBa0IsR0FBRyxFQUEzQjtBQUNBLFVBQU1DLGFBQWEsR0FBR0YsUUFBUSxDQUFDRyxRQUFULEtBQXNCaEgsU0FBNUM7O0FBQ0EsUUFBSStHLGFBQUosRUFBbUI7QUFDakJGLGNBQVEsR0FBRyxJQUFJM0IsZUFBSixDQUFVMkIsUUFBUSxDQUFDaEosT0FBVCxDQUFpQlMsV0FBakIsRUFBVixFQUEwQyxFQUExQyxFQUE4QyxFQUE5QyxFQUFrRDBCLFNBQWxELEVBQTZENkcsUUFBN0QsQ0FBWDtBQUNEOztBQUNELFVBQU1JLE1BQU0sR0FBR0osUUFBUSxDQUFDeEIsR0FBeEI7QUFDQSxVQUFNNkIsU0FBUyxHQUFHRCxNQUFNLENBQUNFLGFBQXpCLENBUDBCLENBUzFCOztBQUNBQyxhQUFTLENBQUNuQyxLQUFELEVBQVE2QixrQkFBUixFQUE0QkksU0FBNUIsRUFBdUNELE1BQU0sQ0FBQ0ksV0FBOUMsQ0FBVCxDQVYwQixDQVkxQjs7QUFDQUgsYUFBUyxJQUFJQSxTQUFTLENBQUNJLFdBQVYsQ0FBc0JULFFBQVEsQ0FBQ3hCLEdBQS9CLENBQWI7QUFFQSxXQUFPSixLQUFLLENBQUNJLEdBQWI7QUFDRCxHQW5GTSxDQXFGUDs7O0FBQ0FtQixnQkFBYyxDQUFFMU0sR0FBRixFQUFPSixJQUFQLEVBQWFFLFFBQWIsRUFBdUI7QUFDbkMsV0FBTyxrQ0FBYyxJQUFkLEVBQW9CRSxHQUFwQixFQUF5QkosSUFBekIsRUFBK0JFLFFBQS9CLENBQVA7QUFDRDs7QUFDRDJOLElBQUUsQ0FBRXpOLEdBQUYsRUFBT0osSUFBUCxFQUFhRSxRQUFiLEVBQXVCO0FBQ3ZCLFdBQU8sa0NBQWMsSUFBZCxFQUFvQkUsR0FBcEIsRUFBeUJKLElBQXpCLEVBQStCRSxRQUEvQixDQUFQO0FBQ0Q7O0FBQ0Q0TixJQUFFLENBQUVsTSxHQUFGLEVBQU9tTSxRQUFQLEVBQWlCO0FBQ2pCLFFBQUlDLEdBQUo7O0FBQ0EsUUFBSWxILEtBQUssQ0FBQzZCLE9BQU4sQ0FBYy9HLEdBQWQsS0FBc0IsT0FBT0EsR0FBUCxLQUFlLFFBQXpDLEVBQW1EO0FBQ2pEb00sU0FBRyxHQUFHLElBQUlsSCxLQUFKLENBQVVsRixHQUFHLENBQUNoQixNQUFkLENBQU47O0FBQ0EsV0FBSyxJQUFJa0IsQ0FBQyxHQUFHLENBQVIsRUFBV21NLENBQUMsR0FBR3JNLEdBQUcsQ0FBQ2hCLE1BQXhCLEVBQWdDa0IsQ0FBQyxHQUFHbU0sQ0FBcEMsRUFBdUNuTSxDQUFDLEVBQXhDLEVBQTRDO0FBQzFDa00sV0FBRyxDQUFDbE0sQ0FBRCxDQUFILEdBQVNpTSxRQUFRLENBQUNuTSxHQUFHLENBQUNFLENBQUQsQ0FBSixFQUFTQSxDQUFULENBQWpCO0FBQ0Q7QUFDRixLQUxELE1BS08sSUFBSSxPQUFPRixHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDbENvTSxTQUFHLEdBQUcsSUFBSWxILEtBQUosQ0FBVWxGLEdBQVYsQ0FBTjs7QUFDQSxXQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLEdBQXBCLEVBQXlCRSxDQUFDLEVBQTFCLEVBQThCO0FBQzVCa00sV0FBRyxDQUFDbE0sQ0FBRCxDQUFILEdBQVNpTSxRQUFRLENBQUNqTSxDQUFDLEdBQUcsQ0FBTCxFQUFRQSxDQUFSLENBQWpCO0FBQ0Q7QUFDRixLQUxNLE1BS0EsSUFBSSxzQkFBU0YsR0FBVCxDQUFKLEVBQW1CO0FBQ3hCLFVBQUlrSCxJQUFJLEdBQUduRCxNQUFNLENBQUNtRCxJQUFQLENBQVlsSCxHQUFaLENBQVg7QUFDQW9NLFNBQUcsR0FBRyxJQUFJbEgsS0FBSixDQUFVZ0MsSUFBSSxDQUFDbEksTUFBZixDQUFOOztBQUNBLFdBQUssSUFBSWtCLENBQUMsR0FBRyxDQUFSLEVBQVdtTSxDQUFDLEdBQUduRixJQUFJLENBQUNsSSxNQUF6QixFQUFpQ2tCLENBQUMsR0FBR21NLENBQXJDLEVBQXdDbk0sQ0FBQyxFQUF6QyxFQUE2QztBQUMzQyxjQUFNaUgsR0FBRyxHQUFHRCxJQUFJLENBQUNoSCxDQUFELENBQWhCO0FBQ0FrTSxXQUFHLENBQUNsTSxDQUFELENBQUgsR0FBU2lNLFFBQVEsQ0FBQ25NLEdBQUcsQ0FBQ21ILEdBQUQsQ0FBSixFQUFXQSxHQUFYLEVBQWdCakgsQ0FBaEIsQ0FBakI7QUFDRDtBQUNGOztBQUNELFdBQU9rTSxHQUFQO0FBQ0Q7O0FBR0RFLElBQUUsR0FBSTtBQUNKLFdBQU8sNEJBQWdCLEVBQWhCLENBQVA7QUFDRDs7QUF0SE07O0FBd0hULFNBQVNSLFNBQVQsQ0FBb0JuQyxLQUFwQixFQUEyQjZCLGtCQUEzQixFQUErQ0ksU0FBL0MsRUFBMERXLE1BQTFELEVBQWtFO0FBQ2hFLFFBQU1uTyxJQUFJLEdBQUd1TCxLQUFLLENBQUN2TCxJQUFuQjtBQUNBLFFBQU1FLFFBQVEsR0FBR3FMLEtBQUssQ0FBQ3JMLFFBQXZCO0FBQ0EsUUFBTUUsR0FBRyxHQUFHbUwsS0FBSyxDQUFDbkwsR0FBbEI7O0FBRUEsTUFBSUEsR0FBSixFQUFTO0FBQ1BtTCxTQUFLLENBQUNJLEdBQU4sR0FBWVMsUUFBUSxDQUFDaEIsYUFBVCxDQUF1QmhMLEdBQXZCLENBQVo7QUFDQWdPLGtCQUFjLENBQUM3QyxLQUFELEVBQVFyTCxRQUFSLEVBQWtCa04sa0JBQWxCLENBQWQ7QUFDQUksYUFBUyxDQUFDYSxZQUFWLENBQXVCOUMsS0FBSyxDQUFDSSxHQUE3QixFQUFrQ3dDLE1BQWxDO0FBQ0QsR0FKRCxNQUlPO0FBQ0w1QyxTQUFLLENBQUNJLEdBQU4sR0FBWVMsUUFBUSxDQUFDa0MsY0FBVCxDQUF3Qi9DLEtBQUssQ0FBQzlKLElBQTlCLENBQVo7QUFDQStMLGFBQVMsQ0FBQ2EsWUFBVixDQUF1QjlDLEtBQUssQ0FBQ0ksR0FBN0IsRUFBa0N3QyxNQUFsQztBQUNEO0FBQ0Y7O0FBRUQsU0FBU0MsY0FBVCxDQUF5QjdDLEtBQXpCLEVBQWdDckwsUUFBaEMsRUFBMENrTixrQkFBMUMsRUFBOEQ7QUFDNUQsUUFBTS9MLElBQUksR0FBRyxPQUFPa0ssS0FBSyxDQUFDOUosSUFBMUI7O0FBQ0EsTUFBSXFGLEtBQUssQ0FBQzZCLE9BQU4sQ0FBY3pJLFFBQWQsQ0FBSixFQUE2QjtBQUMzQkEsWUFBUSxDQUFDZ0gsT0FBVCxDQUFpQixDQUFDdUUsS0FBRCxFQUFRekksS0FBUixLQUFrQjtBQUNqQzBLLGVBQVMsQ0FBQ2pDLEtBQUQsRUFBUTJCLGtCQUFSLEVBQTRCN0IsS0FBSyxDQUFDSSxHQUFsQyxFQUF1QyxJQUF2QyxDQUFUO0FBQ0QsS0FGRDtBQUdELEdBSkQsTUFJTyxJQUFJdEssSUFBSSxLQUFLLFFBQVQsSUFBcUJBLElBQUksS0FBSyxRQUE5QixJQUEwQ0EsSUFBSSxLQUFLLFNBQXZELEVBQWtFO0FBQ3ZFa0ssU0FBSyxDQUFDSSxHQUFOLENBQVU0QyxXQUFWLENBQXNCbkMsUUFBUSxDQUFDa0MsY0FBVCxDQUF3QjdELE1BQU0sQ0FBQ2MsS0FBSyxDQUFDOUosSUFBUCxDQUE5QixDQUF0QjtBQUNEO0FBQ0Y7O2tCQUVjbUssRTs7QUFFZixJQUFJLE9BQU80QyxNQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDQSxRQUFNLENBQUMsSUFBRCxDQUFOLEdBQWU1QyxFQUFmO0FBQ0QsQ0FGRCxNQUVPO0FBQ0w2QyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxRQUFaO0FBQ0QsQyIsImZpbGUiOiJ2bS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3ZtLmpzXCIpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzUvOS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlIChhc3QpIHtcbiAgbGV0IGNvZGUgPSBhc3QgPyBnZW5FbGVtZW50KGFzdCkgOiAnX2MoXCJkaXZcIiknXG4gIGNvZGUgPSBgd2l0aCh0aGlzKXtyZXR1cm4gJHtjb2RlfX1gXG4gIHJldHVybiB7XG4gICAgcmVuZGVyOiBuZXcgRnVuY3Rpb24oY29kZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBnZW5FbGVtZW50IChlbCkge1xuICBpZiAoZWwuZm9yICYmICFlbC5mb3JQcm9jZXNzZWQpIHtcbiAgICByZXR1cm4gZ2VuRm9yKGVsKVxuICB9IGVsc2UgaWYgKGVsLmlmICYmICFlbC5pZlByb2Nlc3NlZCkge1xuICAgIHJldHVybiBnZW5JZihlbClcbiAgfSBlbHNlIHtcbiAgICAvLyBjb21wb25lbnQgb3IgZWxlbWVudFxuICAgIGlmIChlbC5jb21wb25lbnQpIHtcbiAgICAgIC8vIGNvbXBvbmVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBlbGVtZW50XG4gICAgICBjb25zdCBkYXRhID0gZ2VuRGF0YShlbCkgfHwgbnVsbFxuICAgICAgY29uc3QgY2hpbGRyZW4gPSBnZW5DaGlsZHJlbihlbCkgfHwgbnVsbFxuICAgICAgcmV0dXJuIGBfYygnJHtlbC50YWd9Jywke2RhdGF9LCAke2NoaWxkcmVufSlgXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdlbkZvciAoZWwpIHtcbiAgY29uc3QgaXRlcmF0b3IxID0gZWwuaXRlcmF0b3IxID8gYCwke2VsLml0ZXJhdG9yMX1gIDogJydcbiAgY29uc3QgaXRlcmF0b3IyID0gZWwuaXRlcmF0b3IyID8gYCwke2VsLml0ZXJhdG9yMn1gIDogJydcblxuICBlbC5mb3JQcm9jZXNzZWQgPSB0cnVlXG4gIHJldHVybiBgLi4uX2woKCR7ZWwuZm9yfSksZnVuY3Rpb24oJHtlbC5hbGlhc30ke2l0ZXJhdG9yMX0ke2l0ZXJhdG9yMn0pe2AgK1xuICAgIGByZXR1cm4gJHtnZW5FbGVtZW50KGVsKX1gICtcbiAgICBgfSlgXG59XG5cbmZ1bmN0aW9uIGdlbklmIChlbCkge1xuICBlbC5pZlByb2Nlc3NlZCA9IHRydWVcbiAgcmV0dXJuIGdlbklmQ29uZGl0aW9ucyhlbC5pZkNvbmRpdGlvbnMuc2xpY2UoKSlcbn1cbmZ1bmN0aW9uIGdlbklmQ29uZGl0aW9ucyAoY29uZGl0aW9ucykge1xuICBpZiAoIWNvbmRpdGlvbnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICdfZSgpJ1xuICB9XG4gIGNvbnN0IGNvbmRpdGlvbiA9IGNvbmRpdGlvbnMuc2hpZnQoKVxuICBpZiAoY29uZGl0aW9uLmV4cCkge1xuICAgIC8vIGlmIG9yIGVsc2UtaWZcbiAgICByZXR1cm4gYCgke2NvbmRpdGlvbi5leHB9KT8ke2dlbkVsZW1lbnQoY29uZGl0aW9uLmJsb2NrKX06JHtnZW5JZkNvbmRpdGlvbnMoY29uZGl0aW9ucyl9YFxuICB9IGVsc2Uge1xuICAgIC8vIGVsc2VcbiAgICByZXR1cm4gZ2VuRWxlbWVudChjb25kaXRpb24uYmxvY2spXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuQ2hpbGRyZW4gKGVsKSB7XG4gIGNvbnN0IGNoaWxkcmVuID0gZWwuY2hpbGRyZW5cbiAgaWYgKGNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHJldHVybiBgWyR7Y2hpbGRyZW4ubWFwKGMgPT4gZ2VuTm9kZShjKSkuam9pbignLCcpfV1gXG4gIH1cbn1cbmZ1bmN0aW9uIGdlbk5vZGUgKGVsKSB7XG4gIGlmIChlbC50eXBlID09PSAxKSB7XG4gICAgcmV0dXJuIGdlbkVsZW1lbnQoZWwpXG4gIH0gZWxzZSBpZiAoZWwudHlwZSA9PT0gMikge1xuICAgIC8vIGxpdGVyYWwgZXhwcmVzc2lvbiwgcmVtZW1iZXIgbGl0ZXJhbCBleHByZXNzaW9uIGlzIGxpa2UgJ19zKG5hbWUpJyBmb3JtYXRcbiAgICByZXR1cm4gYF92KCR7ZWwuZXhwcmVzc2lvbn0pYFxuICB9IGVsc2Uge1xuICAgIC8vIG5vcm1hbCB0ZXh0XG4gICAgcmV0dXJuIGBfdigke0pTT04uc3RyaW5naWZ5KGVsLnRleHQpfSlgXG4gIH1cbn1cblxuZnVuY3Rpb24gZ2VuRGF0YSAoZWwpIHtcblxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzUvMTYuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbmRSZW1vdmVBdHRyIChlbCwgbmFtZSkge1xuICBsZXQgdmFsXG4gIGNvbnN0IGF0dHJzTGlzdCA9IGVsLmF0dHJzTGlzdFxuICBmb3IgKGxldCBpID0gMCwgbGVuID0gYXR0cnNMaXN0Lmxlbmd0aDsgaSAhPT0gbGVuOyBpKyspIHtcbiAgICBpZiAoYXR0cnNMaXN0W2ldLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgIHZhbCA9IGF0dHJzTGlzdFtpXS52YWx1ZVxuICAgICAgYXR0cnNMaXN0LnNwbGljZShpLCAxKVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzUvMi5cbiAqL1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICcuL3BhcnNlcidcbmltcG9ydCAgeyBnZW5lcmF0ZSB9IGZyb20gJy4vY29kZWdlbidcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUgKHRlbXBsYXRlKSB7XG4gIGNvbnN0IGFzdCA9IHBhcnNlKHRlbXBsYXRlLnRyaW0oKSlcbiAgY29uc3QgY29kZSA9IGdlbmVyYXRlKGFzdClcblxuICByZXR1cm4ge1xuICAgIGFzdCxcbiAgICByZW5kZXI6IGNvZGUucmVuZGVyLFxuICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvNS8yLlxuICovXG5cbi8vIFJlZ3VsYXIgRXhwcmVzc2lvbnMgZm9yIHBhcnNpbmcgdGFncyBhbmQgYXR0cmlidXRlc1xuY29uc3QgYXR0cmlidXRlID0gL15cXHMqKFteXFxzXCInPD5cXC89XSspKD86XFxzKig9KVxccyooPzpcIihbXlwiXSopXCIrfCcoW14nXSopJyt8KFteXFxzXCInPTw+YF0rKSkpPy9cblxuY29uc3QgbmNuYW1lID0gJ1thLXpBLVpfXVtcXFxcd1xcXFwtXFxcXC5dKidcbmNvbnN0IHFuYW1lQ2FwdHVyZSA9IGAoKD86JHtuY25hbWV9XFxcXDopPyR7bmNuYW1lfSlgXG5jb25zdCBzdGFydFRhZ09wZW4gPSBuZXcgUmVnRXhwKGBePCR7cW5hbWVDYXB0dXJlfWApXG5jb25zdCBzdGFydFRhZ0Nsb3NlID0gL15cXHMqKFxcLz8pPi9cbmNvbnN0IGVuZFRhZyA9IG5ldyBSZWdFeHAoYF48XFxcXC8ke3FuYW1lQ2FwdHVyZX1bXj5dKj5gKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZUhUTUwgKGh0bWwsIG9wdGlvbnMpIHtcbiAgY29uc3Qgc3RhY2sgPSBbXVxuICBsZXQgaW5kZXggPSAwIC8vIHJlbGF0aXZlIHRvIG9yaWdpbmFsIGh0bWwgc3RyaW5nXG4gIGxldCBsYXN0LCBsYXN0VGFnXG4gIHdoaWxlIChodG1sKSB7XG4gICAgbGFzdCA9IGh0bWxcblxuICAgIGxldCB0ZXh0RW5kID0gaHRtbC5pbmRleE9mKCc8JykgLy8gcmVsYXRpdmUgdG8gaHRtbCBzdHJpbmcgaW4gdGhpcyB3aGlsZSBsb29wXG4gICAgaWYgKHRleHRFbmQgPT09IDApIHtcbiAgICAgIC8vIEVuZCB0YWc6XG4gICAgICBjb25zdCBlbmRUYWdNYXRjaCA9IGh0bWwubWF0Y2goZW5kVGFnKVxuICAgICAgaWYgKGVuZFRhZ01hdGNoKSB7XG4gICAgICAgIGNvbnN0IGN1ckluZGV4ID0gaW5kZXhcbiAgICAgICAgYWR2YW5jZShlbmRUYWdNYXRjaFswXS5sZW5ndGgpXG4gICAgICAgIHBhcnNlRW5kVGFnKGVuZFRhZ01hdGNoWzFdLCBjdXJJbmRleCwgaW5kZXgpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIFN0YXJ0IHRhZzpcbiAgICAgIGNvbnN0IHN0YXJ0VGFnTWF0Y2ggPSBwYXJzZVN0YXJ0VGFnKClcbiAgICAgIGlmIChzdGFydFRhZ01hdGNoKSB7XG4gICAgICAgIGhhbmRsZVN0YXJ0VGFnKHN0YXJ0VGFnTWF0Y2gpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlc3QsIG5leHRcbiAgICBpZiAodGV4dEVuZCA+PSAwKSB7XG4gICAgICAvLyByZXN0ID0gaHRtbC5zbGljZSh0ZXh0RW5kKVxuICAgICAgLy8gd2hpbGUgKFxuICAgICAgLy8gICAhZW5kVGFnLnRlc3QocmVzdCkgJiZcbiAgICAgIC8vICAgIXN0YXJ0VGFnT3Blbi50ZXN0KHJlc3QpXG4gICAgICAvLyAgICkge1xuICAgICAgLy8gICAvLyA8IGluIHBsYWluIHRleHQsIGJlIGZvcmdpdmluZyBhbmQgdHJlYXQgaXQgYXMgdGV4dFxuICAgICAgLy8gICBuZXh0ID0gcmVzdC5pbmRleE9mKCc8JywgMSkgLy8gcmVsYXRpdmUgdG8gJ3Jlc3QnXG4gICAgICAvLyAgIGlmIChuZXh0IDwgMCkge1xuICAgICAgLy8gICAgIHRleHRFbmQgPSBodG1sLmxlbmd0aFxuICAgICAgLy8gICAgIGJyZWFrXG4gICAgICAvLyAgIH1cbiAgICAgIC8vICAgdGV4dEVuZCArPSBuZXh0XG4gICAgICAvLyAgIHJlc3QgPSBodG1sLnNsaWNlKHRleHRFbmQpXG4gICAgICAvLyB9XG4gICAgICBvcHRpb25zLmNoYXJzKGh0bWwuc3Vic3RyaW5nKDAsIHRleHRFbmQpKVxuICAgICAgYWR2YW5jZSh0ZXh0RW5kKVxuICAgIH1cblxuICAgIGlmICh0ZXh0RW5kIDwgMCkge1xuICAgICAgb3B0aW9ucy5jaGFycyhodG1sKVxuICAgICAgaHRtbCA9ICcnXG4gICAgfVxuICB9XG5cbiAgLy8gQ2xlYW4gdXAgYW55IHJlbWFpbmluZyB0YWdzXG4gIHBhcnNlRW5kVGFnKClcblxuICBmdW5jdGlvbiBhZHZhbmNlIChuKSB7XG4gICAgaW5kZXggKz0gblxuICAgIGh0bWwgPSBodG1sLnN1YnN0cmluZyhuKVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VTdGFydFRhZyAoKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBodG1sLm1hdGNoKHN0YXJ0VGFnT3BlbilcbiAgICBpZiAoc3RhcnQpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0ge1xuICAgICAgICB0YWdOYW1lOiBzdGFydFsxXSxcbiAgICAgICAgYXR0cnM6IFtdLFxuICAgICAgICBzdGFydDogaW5kZXhcbiAgICAgIH1cbiAgICAgIGFkdmFuY2Uoc3RhcnRbMF0ubGVuZ3RoKVxuICAgICAgbGV0IGVuZCwgYXR0clxuICAgICAgd2hpbGUgKCEoZW5kID0gaHRtbC5tYXRjaChzdGFydFRhZ0Nsb3NlKSkgJiYgKGF0dHIgPSBodG1sLm1hdGNoKGF0dHJpYnV0ZSkpKSB7XG4gICAgICAgIGFkdmFuY2UoYXR0clswXS5sZW5ndGgpXG4gICAgICAgIG1hdGNoLmF0dHJzLnB1c2goYXR0cilcbiAgICAgIH1cbiAgICAgIGlmIChlbmQpIHtcbiAgICAgICAgbWF0Y2gudW5hcnlTbGFzaCA9IGVuZFsxXVxuICAgICAgICBhZHZhbmNlKGVuZFswXS5sZW5ndGgpXG4gICAgICAgIG1hdGNoLmVuZCA9IGluZGV4XG4gICAgICAgIHJldHVybiBtYXRjaFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVN0YXJ0VGFnIChtYXRjaCkge1xuICAgIGNvbnN0IHRhZ05hbWUgPSBtYXRjaC50YWdOYW1lXG4gICAgY29uc3QgdW5hcnkgPSAhIW1hdGNoLnVuYXJ5U2xhc2hcblxuICAgIGNvbnN0IGF0dHJzID0gbWF0Y2guYXR0cnMubWFwKChhcmdzKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBhcmdzWzFdLFxuICAgICAgICB2YWx1ZTogYXJnc1szXSB8fCBhcmdzWzRdIHx8IGFyZ3NbNV0gfHwgJydcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKCF1bmFyeSkge1xuICAgICAgc3RhY2sucHVzaCh7IHRhZzogdGFnTmFtZSwgbG93ZXJDYXNlZFRhZzogdGFnTmFtZS50b0xvd2VyQ2FzZSgpLCBhdHRyczogYXR0cnMgfSlcbiAgICAgIGxhc3RUYWcgPSB0YWdOYW1lXG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc3RhcnQpIHtcbiAgICAgIG9wdGlvbnMuc3RhcnQodGFnTmFtZSwgYXR0cnMsIHVuYXJ5LCBtYXRjaC5zdGFydCwgbWF0Y2guZW5kKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRW5kVGFnICh0YWdOYW1lLCBzdGFydCwgZW5kKSB7XG4gICAgbGV0IHBvcywgbG93ZXJDYXNlZFRhZ05hbWVcbiAgICBpZiAoc3RhcnQgPT0gbnVsbCkgc3RhcnQgPSBpbmRleFxuICAgIGlmIChlbmQgPT0gbnVsbCkgZW5kID0gaW5kZXhcblxuICAgIC8vIEZpbmQgdGhlIGNsb3Nlc3Qgb3BlbmVkIHRhZyBvZiB0aGUgc2FtZSB0eXBlXG4gICAgaWYgKHRhZ05hbWUpIHtcbiAgICAgIGxvd2VyQ2FzZWRUYWdOYW1lID0gdGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBmb3IgKHBvcyA9IHN0YWNrLmxlbmd0aCAtIDE7IHBvcyA+PSAwOyBwb3MtLSkge1xuICAgICAgICBpZiAoc3RhY2tbcG9zXS5sb3dlckNhc2VkVGFnID09PSBsb3dlckNhc2VkVGFnTmFtZSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm8gdGFnIG5hbWUgaXMgcHJvdmlkZWQsIGNsZWFuIHNob3BcbiAgICAgIHBvcyA9IDBcbiAgICB9XG5cbiAgICBpZiAocG9zID49IDApIHtcbiAgICAgIC8vIENsb3NlIGFsbCB0aGUgb3BlbiBlbGVtZW50cywgdXAgdGhlIHN0YWNrXG4gICAgICBmb3IgKGxldCBpID0gc3RhY2subGVuZ3RoIC0gMTsgaSA+PSBwb3M7IGktLSkge1xuICAgICAgICBpZiAob3B0aW9ucy5lbmQpIHtcbiAgICAgICAgICBvcHRpb25zLmVuZChzdGFja1tpXS50YWcsIHN0YXJ0LCBlbmQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIHRoZSBvcGVuIGVsZW1lbnRzIGZyb20gdGhlIHN0YWNrXG4gICAgICBzdGFjay5sZW5ndGggPSBwb3NcbiAgICAgIGxhc3RUYWcgPSBwb3MgJiYgc3RhY2tbcG9zIC0gMV0udGFnXG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvNS8yLlxuICovXG5pbXBvcnQgcGFyc2VIdG1sIGZyb20gJy4vaHRtbC1wYXJzZXIuanMnXG5pbXBvcnQge2dldEFuZFJlbW92ZUF0dHJ9IGZyb20gJy4uL2hlbHBlcidcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZSh0ZW1wbGF0ZSkge1xuICBsZXQgcm9vdFxuICBsZXQgY3VycmVudFBhcmVudFxuICBwYXJzZUh0bWwodGVtcGxhdGUsIHtcbiAgICBzdGFydCAodGFnLCBhdHRycywgdW5hcnkpIHtcbiAgICAgIGxldCBlbGVtZW50ID0ge1xuICAgICAgICB0eXBlOiAxLFxuICAgICAgICB0YWcsXG4gICAgICAgIGF0dHJzTGlzdDogYXR0cnMsXG4gICAgICAgIHBhcmVudDogY3VycmVudFBhcmVudCxcbiAgICAgICAgY2hpbGRyZW46IFtdXG4gICAgICB9XG5cbiAgICAgIHByb2Nlc3NGb3IoZWxlbWVudClcbiAgICAgIHByb2Nlc3NJZihlbGVtZW50LCBjdXJyZW50UGFyZW50KVxuXG4gICAgICBpZiAoIXJvb3QpIHtcbiAgICAgICAgcm9vdCA9IGVsZW1lbnRcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRQYXJlbnQpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuZWxzZWlmIHx8IGVsZW1lbnQuZWxzZSkge1xuICAgICAgICAgIC8vIG5vdGhpbmdcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkcmVuLnB1c2goZWxlbWVudClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXVuYXJ5KSB7XG4gICAgICAgIGN1cnJlbnRQYXJlbnQgPSBlbGVtZW50XG4gICAgICB9XG4gICAgfSxcbiAgICBlbmQgKCkge1xuICAgICAgY3VycmVudFBhcmVudCA9IGN1cnJlbnRQYXJlbnQucGFyZW50XG4gICAgfSxcbiAgICBjaGFycyAodGV4dCkge1xuICAgICAgaWYgKCFjdXJyZW50UGFyZW50KSB7cmV0dXJufVxuICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgbGV0IGV4cCA9IHBhcnNlVGV4dCh0ZXh0KVxuICAgICAgICBpZiAoZXhwKSB7XG4gICAgICAgICAgY3VycmVudFBhcmVudC5jaGlsZHJlbi5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IDIsIC8vIGxpdGVyYWwgZXhwcmVzc2lvblxuICAgICAgICAgICAgZXhwcmVzc2lvbjogZXhwXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJyZW50UGFyZW50LmNoaWxkcmVuLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogMywgLy8gbm9ybWFsIHRleHRcbiAgICAgICAgICAgIHRleHRcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxuICByZXR1cm4gcm9vdFxufVxuXG4vKipcbiAqICAoaXRlbSwga2V5LCBpbmRleCkgaW4gaXRlbUxpc3RcbiAqICBlbC5mb3IgPSAnaXRlbUxpc3QnXG4gKiAgZWwuYWxpYXMgPSAnaXRlbSdcbiAqICBlbC5pdGVyYXRvcjEgPSAna2V5J1xuICogIGVsLml0ZXJhdG9yMiA9ICdpbmRleCdcbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc0ZvciAoZWwpIHtcbiAgbGV0IGV4cFxuICBpZiAoKGV4cCA9IGdldEFuZFJlbW92ZUF0dHIoZWwsICd2LWZvcicpKSkge1xuICAgIGNvbnN0IHJlcyA9IHBhcnNlRm9yKGV4cClcbiAgICBpZiAocmVzKSB7XG4gICAgICBPYmplY3QuYXNzaWduKGVsLCByZXMpXG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBwYXJzZUZvciAoZXhwKSB7XG4gIGNvbnN0IGZvckFsaWFzUkUgPSAvKFtcXHNcXFNdKj8pXFxzKyg/OmlufG9mKVxccysoW1xcc1xcU10qKS9cbiAgY29uc3Qgc3RyaXBQYXJlbnNSRSA9IC9eXFwofFxcKSQvZ1xuICBjb25zdCBmb3JJdGVyYXRvclJFID0gLywoW14sXFx9XFxdXSopKD86LChbXixcXH1cXF1dKikpPyQvXG5cbiAgLy8gKGl0ZW0sIGtleSwgaW5kZXgpIGluIGl0ZW1MaXN0XG5cbiAgY29uc3QgaW5NYXRjaCA9IGV4cC5tYXRjaChmb3JBbGlhc1JFKVxuICBpZiAoIWluTWF0Y2gpIHJldHVyblxuICBjb25zdCByZXMgPSB7fVxuICByZXMuZm9yID0gaW5NYXRjaFsyXS50cmltKCkgLy8gJ2l0ZW1MaXN0J1xuICBjb25zdCBhbGlhcyA9IGluTWF0Y2hbMV0udHJpbSgpLnJlcGxhY2Uoc3RyaXBQYXJlbnNSRSwgJycpIC8vIChpdGVtLCBrZXksIGluZGV4KSA9PiBpdGVtLCBrZXksIGluZGV4XG4gIGNvbnN0IGl0ZXJhdG9yTWF0Y2ggPSBhbGlhcy5tYXRjaChmb3JJdGVyYXRvclJFKVxuICBpZiAoaXRlcmF0b3JNYXRjaCkge1xuICAgIHJlcy5hbGlhcyA9IGFsaWFzLnJlcGxhY2UoZm9ySXRlcmF0b3JSRSwgJycpLnRyaW0oKSAvLyAnaXRlbSdcbiAgICByZXMuaXRlcmF0b3IxID0gaXRlcmF0b3JNYXRjaFsxXS50cmltKCkgLy8gJ2tleSdcbiAgICBpZiAoaXRlcmF0b3JNYXRjaFsyXSkge1xuICAgICAgcmVzLml0ZXJhdG9yMiA9IGl0ZXJhdG9yTWF0Y2hbMl0udHJpbSgpIC8vICdpbmRleCdcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLmFsaWFzID0gYWxpYXNcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHByb2Nlc3NJZiAoZWwsIHBhcmVudCkge1xuICBsZXQgZXhwXG4gIGlmIChleHAgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1pZicpKSB7XG4gICAgZWwuaWYgPSB0cnVlXG4gICAgYWRkSWZDb25kaXRpb24oZWwsIHtcbiAgICAgIGV4cDogZXhwLFxuICAgICAgYmxvY2s6IGVsXG4gICAgfSlcbiAgfSBlbHNlIGlmIChleHAgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1lbHNlLWlmJykpIHtcbiAgICBlbC5lbHNlaWYgPSB0cnVlXG4gICAgY29uc3QgcHJldiA9IGZpbmRQcmV2RWxlbWVudCggcGFyZW50LmNoaWxkcmVuKVxuICAgIHByZXYgJiYgYWRkSWZDb25kaXRpb24ocHJldiwge1xuICAgICAgZXhwOiBleHAsXG4gICAgICBibG9jazogZWxcbiAgICB9KVxuICB9IGVsc2UgaWYgKChleHAgPSBnZXRBbmRSZW1vdmVBdHRyKGVsLCAndi1lbHNlJykpICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbC5lbHNlID0gdHJ1ZVxuICAgIGNvbnN0IHByZXYgPSBmaW5kUHJldkVsZW1lbnQoIHBhcmVudC5jaGlsZHJlbilcbiAgICBwcmV2ICYmIGFkZElmQ29uZGl0aW9uKHByZXYsIHtcbiAgICAgIGV4cDogZXhwLFxuICAgICAgYmxvY2s6IGVsXG4gICAgfSlcbiAgfVxufVxuZnVuY3Rpb24gYWRkSWZDb25kaXRpb24gKGVsLCBjb25kaXRpb24pIHtcbiAgaWYgKCFlbC5pZkNvbmRpdGlvbnMpIHtcbiAgICBlbC5pZkNvbmRpdGlvbnMgPSBbXVxuICB9XG4gIGVsLmlmQ29uZGl0aW9ucy5wdXNoKGNvbmRpdGlvbilcbn1cbmZ1bmN0aW9uIGZpbmRQcmV2RWxlbWVudCAoY2hpbGRyZW4pIHtcbiAgbGV0IGkgPSBjaGlsZHJlbi5sZW5ndGhcbiAgd2hpbGUgKGktLSkge1xuICAgIGlmIChjaGlsZHJlbltpXS50eXBlID09PSAxKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5baV1cbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGRyZW4ucG9wKClcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiB0ZXh0IHBhcnNlclxuICogJ2FiY3t7bmFtZX19eHl6JyA9PiAnXCJhYmNcIitfcyhuYW1lKStcInh5elwiJ1xuICovXG5mdW5jdGlvbiBwYXJzZVRleHQgKHRleHQpIHtcbiAgY29uc3QgdGFnUkUgPSAvXFx7XFx7KCg/Oi58XFxyP1xcbikrPylcXH1cXH0vZ1xuICBpZiAoIXRhZ1JFLnRlc3QodGV4dCkpIHsgcmV0dXJuIH1cblxuICBsZXQgbGFzdEluZGV4ID0gdGFnUkUubGFzdEluZGV4ID0gMFxuICBsZXQgbWF0Y2hcbiAgbGV0IHRva2VucyA9IFtdXG4gIHdoaWxlICgobWF0Y2ggPSB0YWdSRS5leGVjKHRleHQpKSkge1xuICAgIC8vIHRoZXJlIGFyZSBub3JtYWwgdGV4dCBiZWZvcmUge3tcbiAgICBpZiAobWF0Y2guaW5kZXggPiBsYXN0SW5kZXgpIHtcbiAgICAgIHRva2Vucy5wdXNoKEpTT04uc3RyaW5naWZ5KHRleHQuc2xpY2UobGFzdEluZGV4LCBtYXRjaC5pbmRleCkpKVxuICAgIH1cblxuICAgIC8vIHRva2VuIGluIGV4cHJlc3Npb25cbiAgICB0b2tlbnMucHVzaChgX3MoJHttYXRjaFsxXS50cmltKCl9KWApXG5cbiAgICBsYXN0SW5kZXggPSB0YWdSRS5sYXN0SW5kZXhcbiAgfVxuXG4gIC8vIHRoZXJlIGFyZSBub3JtYWwgdGV4dCBhZnRlciB9fVxuICBpZiAobGFzdEluZGV4IDwgdGV4dC5sZW5ndGgpIHtcbiAgICB0b2tlbnMucHVzaChKU09OLnN0cmluZ2lmeSh0ZXh0LnNsaWNlKGxhc3RJbmRleCkpKVxuICB9XG5cbiAgcmV0dXJuIHRva2Vucy5qb2luKCcrJylcbn1cbi8vIGNvbnNvbGUubG9nKHBhcnNlVGV4dCgnYWJje3tuYW1lfX14eXonKSkiLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvMy8xOC5cbiAqL1xuY29uc3Qgb3JpZ2luQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZVxuZXhwb3J0IGNvbnN0IHJlYWN0aXZlQXJyYXlQcm90byA9IE9iamVjdC5jcmVhdGUob3JpZ2luQXJyYXlQcm90bylcbiAgXG47WydwdXNoJywgJ3BvcCcsICdzaGlmdCcsICd1bnNoaWZ0JywgJ3NwbGljZScsICdzb3J0JywgJ3JldmVyc2UnXS5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gIC8vIGNvbnNvbGUubG9nKCdtZXRob2Q6JyArIG1ldGhvZClcbiAgY29uc3Qgb3JpZ2luTWV0aG9kID0gb3JpZ2luQXJyYXlQcm90b1ttZXRob2RdXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZWFjdGl2ZUFycmF5UHJvdG8sIG1ldGhvZCwge1xuICAgIHZhbHVlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBvcmlnaW5NZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgdGhpcy5fX3JlYWN0aXZlT2JqZWN0X18uZGVwLm5vdGlmeSgpXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcbn0pXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvMy80LlxuICovXG4vKipcbiAqIEEgZGVwIGlzIGFuIG9ic2VydmFibGUgdGhhdCBjYW4gaGF2ZSBtdWx0aXBsZVxuICogd2F0Y2hlcnMoZGlyZWN0aXZlcyBpbiB0ZW1wbGF0ZSBvciB3YXRjaGVycyBib3VuZCBtYW51YWxseSkgc3Vic2NyaWJpbmcgdG8gaXQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlcCB7XG4gIC8vIHRoZSBjdXJyZW50IHRhcmdldCB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZC5cbiAgLy8gdGhpcyBpcyBnbG9iYWxseSB1bmlxdWUgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvbmx5IG9uZVxuICAvLyB3YXRjaGVyIGJlaW5nIGV2YWx1YXRlZCBhdCBhbnkgdGltZS5cbiAgc3RhdGljIHRhcmdldCA9IG51bGxcbiAgc3RhdGljIF90YXJnZXRTdGFjayA9IFtdXG4gIHN0YXRpYyBwdXNoVGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldFdhdGNoZXIpIHtcbiAgICBEZXAuX3RhcmdldFN0YWNrLnB1c2goRGVwLnRhcmdldClcbiAgICBEZXAudGFyZ2V0ID0gdGFyZ2V0V2F0Y2hlclxuICB9XG4gIHN0YXRpYyBwb3BUYXJnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgRGVwLnRhcmdldCA9IERlcC5fdGFyZ2V0U3RhY2sucG9wKClcbiAgfVxuICBcbiAgc3VicyA9IFtdXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgfVxuICBhZGRTdWIgKHN1Yikge1xuICAgIHRoaXMuc3Vicy5wdXNoKHN1YilcbiAgfVxuICBub3RpZnkgKCkge1xuICAgIC8vIHN0YWJsaXplIHRoZSBzdWJzY3JpYmVyIGxpc3QgZmlyc3RcbiAgICBjb25zdCBzdWJzID0gdGhpcy5zdWJzLnNsaWNlKClcbiAgICBzdWJzLmZvckVhY2goc3ViID0+IHN1Yi51cGRhdGUoKSlcbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzMvNC5cbiAqL1xuaW1wb3J0IERlcCBmcm9tICcuL2RlcCdcbmltcG9ydCB7YXVnbWVudH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCB7cmVhY3RpdmVBcnJheVByb3RvfSBmcm9tICcuL2FycmF5J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWFjdGl2ZU9iamVjdCB7XG4gIHZhbHVlXG4gIGRlcFxuICBjb25zdHJ1Y3RvciAodmFsKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbFxuICAgIC8vIGEgRGVwIGZvciB0aGUgb2JqZWN0IHNlbGYgd2hlbiBtYW5pcHVsYXRlIGEgYXJyYXkgKHB1c2gscG9wIGV0Yykgb3IgYWRkL2RlbGV0ZSBhIHByb3BlcnR5IG9uIG9iamVjdChhcnJheSlcbiAgICB0aGlzLmRlcCA9IG5ldyBEZXAoKVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2YWwsICdfX3JlYWN0aXZlT2JqZWN0X18nLCB7XG4gICAgICB2YWx1ZTogdGhpcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIGF1Z21lbnQodmFsLCByZWFjdGl2ZUFycmF5UHJvdG8pXG4gICAgfVxuICAgIC8qXG4gICAgLy8gYXJyYXkgaXMgaGFuZGxlZCBkaWZmZXJlbnQgZnJvbSBub3JtYWwgb2JqZWN0IGZvciBwZXJmb3JtYW5jZVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZUFycmF5KHZhbClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53YWxrKHZhbClcbiAgICB9XG4gICAgKi9cbiAgICB0aGlzLndhbGsodmFsKVxuICB9XG4gIHdhbGsgKG9iaikge1xuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4gZGVmaW5lUmVhY3RpdmUob2JqLCBrZXksIG9ialtrZXldKSlcbiAgfVxuICBvYnNlcnZlQXJyYXkgKGFycikge1xuICAgIGFyci5mb3JFYWNoKGl0ZW0gPT4gY29udmVydChpdGVtKSlcbiAgfVxufVxuXG4vLyBhZGQgZ2V0dGVyL3NldHRlciBmb3IgZXZlcnkga2V5L3ZhbHVlIHBhaXIgaW4gb2JqZWN0XG4vLyBpbiBnZXR0ZXI6IGNvbGxlY3QgdGhlIGRlcGVuZGVuY3kgcmVsYXRpb25zaGlwcyBmb3IgZGF0YSAod2F0Y2hlcnMgZGVwZW5kIG9uIGRhdGEpXG4vLyBpbiBzZXR0ZXI6IG5vdGlmeSB3YXRjaGVycyB0byB1cGRhdGUgd2hlbiBkYXRhIGNoYW5nZXNcbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVSZWFjdGl2ZShvYmosIGtleSwgdmFsKSB7XG4gIGxldCBjaGlsZE9iaiA9IGNvbnZlcnQodmFsKVxuICBjb25zdCBkZXAgPSBuZXcgRGVwKCkgLy8gYSBEZXAgZm9yIHRoZSBrZXktdmFsdWUgcGFpciBvZiBvYmplY3RcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZUdldHRlciAoKSB7XG4gICAgICBpZiAoRGVwLnRhcmdldCkge1xuICAgICAgICAvLyB3YXRjaGVyIGRlcGVuZHMgb24gdGhlIGtleS12YWx1ZSBwYWlyIG9mIHRoZSBvYmplY3RcbiAgICAgICAgZGVwLmFkZFN1YihEZXAudGFyZ2V0KVxuICAgICAgICBcbiAgICAgICAgLy8gd2F0Y2hlciBkZXBlbmRzIG9uIHRoZSB2YWx1ZSByZXNwb25kaW5nIHRvIHRoZSBrZXkuXG4gICAgICAgIC8vIHRoaXMgd2lsbCBiZSB1c2VkIHdoZW4gbWFuaXB1bGF0ZSBhIGFycmF5IChwdXNoLHBvcCBldGMpIG9yIGFkZC9kZWxldGUgYSBwcm9wZXJ0eSBvbiBvYmplY3QoYXJyYXkpXG4gICAgICAgIGNoaWxkT2JqICYmIGNoaWxkT2JqLmRlcC5hZGRTdWIoRGVwLnRhcmdldClcbiAgXG4gICAgICAgIC8vIGlmIHRoZSB2YWx1ZSByZXNwb25kaW5nIHRvIHRoZSBrZXkgaXMgYSBBcnJheSxcbiAgICAgICAgLy8gZGl2ZSBpbnRvIGl0IHRvIGNvbGxlY3QgZGVwZW5kZW5jaWVzLlxuICAgICAgICAvLyBidXQgd2h5PyBiZWNhdXNlIHdoZW4gY29udmVydGluZyB0byBSZWFjdGl2ZU9iamVjdFxuICAgICAgICAvLyBhcnJheSBpcyB0cmVhdGVkIGRpZmZlcmVudCBmcm9tIGNvbW1vbiBvYmplY3Q/XG4gICAgICAgIC8vIEFycmF5LmlzQXJyYXkodmFsKSAmJiBkZXBlbmRBcnJheSh2YWwpXG4gICAgICB9XG4gICAgICAgIFxuICAgICAgcmV0dXJuIHZhbFxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlciAobmV3VmFsKSB7XG4gICAgICBpZiAodmFsID09PSBuZXdWYWwpXG4gICAgICAgIHJldHVyblxuICAgICAgdmFsID0gbmV3VmFsXG4gICAgICBjaGlsZE9iaiA9IGNvbnZlcnQodmFsKVxuICAgICAgZGVwLm5vdGlmeSgpXG4gICAgfVxuICB9KVxufVxuXG4vLyBjb252ZXJ0IGEgbm9ybWFsIG9iamVjdCB0byBSZWFjdGl2ZU9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnQodmFsLCB2bSkge1xuICBpZiAoIXZhbCB8fCAnb2JqZWN0JyAhPT0gdHlwZW9mIHZhbClcbiAgICByZXR1cm5cbiAgXG4gIGlmICh2YWwuX19yZWFjdGl2ZU9iamVjdF9fKVxuICAgIHJldHVybiB2YWwuX19yZWFjdGl2ZU9iamVjdF9fXG4gIFxuICByZXR1cm4gbmV3IFJlYWN0aXZlT2JqZWN0KHZhbClcbn1cblxuZnVuY3Rpb24gZGVwZW5kQXJyYXkoYXJyKSB7XG4gIGFyci5mb3JFYWNoKGVsZSA9PiB7XG4gICAgZWxlICYmIGVsZS5fX3JlYWN0aXZlT2JqZWN0X18gJiYgZWxlLl9fcmVhY3RpdmVPYmplY3RfXy5kZXAuYWRkU3ViKERlcC50YXJnZXQpXG4gICAgQXJyYXkuaXNBcnJheShlbGUpICYmIGRlcGVuZEFycmF5KGVsZSlcbiAgfSlcbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBTYW5kb24gb24gMjAxNy8zLzQuXG4gKi9cbmltcG9ydCBEZXAgZnJvbSAnLi9kZXAnXG5pbXBvcnQge3BhcnNlUGF0aH0gZnJvbSAnLi4vdXRpbCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2hlciB7XG4gIGNvbnN0cnVjdG9yICh2bSwgZXhwT3JGbiwgY2IpIHtcbiAgICB0aGlzLmNiID0gY2JcbiAgICB0aGlzLnZtID0gdm1cbiAgICB0aGlzLmdldHRlciA9IHR5cGVvZiBleHBPckZuID09PSAnZnVuY3Rpb24nID8gZXhwT3JGbiA6IHBhcnNlUGF0aChleHBPckZuKVxuICAgIC8vIHRyaWdnZXIgZ2V0dGVyIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHRvIGNvbGxlY3QgZGVwZW5kZW5jeVxuICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldCgpXG4gIH1cbiAgZ2V0ICgpIHtcbiAgICBEZXAucHVzaFRhcmdldCh0aGlzKVxuICAgIGNvbnN0IHZhbCA9IHRoaXMuZ2V0dGVyLmNhbGwodGhpcy52bSwgdGhpcy52bSkgLy8gcGFyc2VQYXRoKHRoaXMuZXhwT3JGbikodGhpcy52bS5fZGF0YSlcbiAgICBEZXAucG9wVGFyZ2V0KClcbiAgICByZXR1cm4gdmFsXG4gIH1cbiAgdXBkYXRlICgpIHtcbiAgICB0aGlzLnJ1bigpXG4gIH1cbiAgcnVuICgpIHtcbiAgICBjb25zdCBuZXdWYWwgPSB0aGlzLmdldCgpXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IG5ld1ZhbCkge1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLnZhbHVlXG4gICAgICB0aGlzLnZhbHVlID0gbmV3VmFsXG4gICAgICB0aGlzLmNiICYmIHRoaXMuY2IuY2FsbCh0aGlzLnZtLCBuZXdWYWwsIG9sZFZhbHVlKVxuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGxpcGVuZyBvbiAyMDE4LzExLzI4LlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUgKHZhbHVlKSB7XG4gIGNvbnN0IHR5cGUgPSB0eXBlb2YgdmFsdWVcbiAgcmV0dXJuIChcbiAgICB0eXBlID09PSAnc3RyaW5nJyB8fFxuICAgIHR5cGUgPT09ICdudW1iZXInIHx8XG4gICAgdHlwZSA9PT0gJ3N5bWJvbCcgfHxcbiAgICB0eXBlID09PSAnYm9vbGVhbidcbiAgKVxufSIsIi8qKlxuICogQ3JlYXRlZCBieSBTYW5kb24gb24gMjAxNy8zLzI2LlxuICovXG5leHBvcnQgY29uc3QgaGFzUHJvdG8gPSAnX19wcm90b19fJyBpbiB7fVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzMvMjYuXG4gKi9cbmV4cG9ydCAqIGZyb20gJy4vbGFuZydcbmV4cG9ydCAqIGZyb20gJy4vZW52J1xuZXhwb3J0ICogZnJvbSAnLi9jb21tb24nXG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAob2JqKSB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcbn1cbmV4cG9ydCBmdW5jdGlvbiB0b1N0cmluZyAodmFsKSB7XG4gIHJldHVybiB2YWwgPT0gbnVsbFxuICAgID8gJydcbiAgICA6IHR5cGVvZiB2YWwgPT09ICdvYmplY3QnXG4gICAgICA/IEpTT04uc3RyaW5naWZ5KHZhbCwgbnVsbCwgMilcbiAgICAgIDogU3RyaW5nKHZhbClcbn0iLCIvKipcbiAqIENyZWF0ZWQgYnkgU2FuZG9uIG9uIDIwMTcvMy8yNi5cbiAqL1xuaW1wb3J0IHtoYXNQcm90b30gZnJvbSAnLi9lbnYnXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVBhdGgocGF0aCkge1xuICAvLyBjYXNlIGxpa2U6IGJbMF1bMl0uelswXS53XG4gIGNvbnN0IHNlZ21lbnRzID0gcGF0aC5zcGxpdCgvW1xcW1xcXVxcLl0vKS5maWx0ZXIoZWxlID0+IGVsZSAhPT0gXCJcIilcbiAgY29uc3QgbGVuID0gc2VnbWVudHMubGVuZ3RoXG4gIHJldHVybiBmdW5jdGlvbiAodm0pIHtcbiAgICBsZXQgb2JqID0gdm0uX2RhdGFcbiAgICBmb3IgKGxldCBpID0gMDsgaSAhPT0gbGVuOyBpKyspIHtcbiAgICAgIGlmICghb2JqKSByZXR1cm5cbiAgICAgIG9iaiA9IG9ialtzZWdtZW50c1tpXV1cbiAgICB9XG4gICAgcmV0dXJuIG9ialxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdWdtZW50ICh0YXJnZXQsIHNyYykge1xuICBpZiAoaGFzUHJvdG8pIHtcbiAgICB0YXJnZXQuX19wcm90b19fID0gc3JjXG4gIH0gZWxzZSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc3JjKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgICB2YWx1ZTogc3JjW2tleV0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbn1cbiIsIi8qKlxuICogQ3JlYXRlZCBieSBsaXBlbmcgb24gMjAxOC8xMS8yOC5cbiAqL1xuaW1wb3J0IFZOb2RlIGZyb20gXCIuL3Zub2RlXCJcbmltcG9ydCB7IGlzUHJpbWl0aXZlIH0gZnJvbSAnLi4vdXRpbC9jb21tb24nXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50IChjb250ZXh0LCB0YWcsIGRhdGEsIGNoaWxkcmVuKSB7XG4gIC8vIG5vcm1hbGl6ZSBjaGlsZHJlblxuICBpZiAoY2hpbGRyZW4pIHtcbiAgICBjaGlsZHJlbiA9IG5vcm1hbGl6ZUNoaWxkcmVuKGNoaWxkcmVuKVxuICB9XG5cbiAgLy8gY3JlYXRlIFZOb2RlXG4gIGxldCB2bm9kZVxuICBpZiAodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpIHtcbiAgICB2bm9kZSA9IG5ldyBWTm9kZSh0YWcsIGRhdGEsIGNoaWxkcmVuLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29udGV4dClcbiAgfVxuXG4gIHJldHVybiB2bm9kZVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVDaGlsZHJlbiAoY2hpbGRyZW4pIHtcbiAgaWYgKGlzUHJpbWl0aXZlKGNoaWxkcmVuKSkge1xuICAgIHJldHVybiBbbmV3IFZOb2RlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIFN0cmluZyhjaGlsZHJlbikpXVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IHtcbiAgICAgIGlmIChpc1ByaW1pdGl2ZShjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBTdHJpbmcoY2hpbGQpKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNoaWxkXG4gICAgfSlcbiAgfVxufVxuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGxpcGVuZyBvbiAyMDE4LzExLzI3LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWTm9kZSB7XG4gIGNvbnN0cnVjdG9yICh0YWcsIGRhdGEsIGNoaWxkcmVuLCB0ZXh0LCBlbG0sIGNvbnRleHQpIHtcbiAgICB0aGlzLnRhZyA9IHRhZ1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcbiAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW5cbiAgICB0aGlzLnRleHQgPSB0ZXh0XG4gICAgdGhpcy5lbG0gPSBlbG1cbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZXh0Vk5vZGUgKHRleHQpIHtcbiAgcmV0dXJuIG5ldyBWTm9kZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBTdHJpbmcodGV4dCkpXG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IFNhbmRvbiBvbiAyMDE3LzMvNS5cbiAqL1xuaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9yZWFjdGl2ZS1vYmplY3Qvd2F0Y2hlcidcbmltcG9ydCB7IGNvbnZlcnQgfSBmcm9tICcuL3JlYWN0aXZlLW9iamVjdCdcbmltcG9ydCB7IGNvbXBpbGUgfSBmcm9tICcuL2NvbXBpbGVyL2luZGV4J1xuaW1wb3J0IFZOb2RlLCB7IGNyZWF0ZVRleHRWTm9kZSB9IGZyb20gJy4vdmRvbS92bm9kZSdcbmltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuL3Zkb20vY3JlYXRlLWVsZW1lbnQnXG5pbXBvcnQgeyBpc09iamVjdCwgdG9TdHJpbmcgfSBmcm9tICcuL3V0aWwvaW5kZXgnXG5cbmNsYXNzIFZtIHtcbiAgY29uc3RydWN0b3IgKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuJG9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5fZGF0YSA9IHRoaXMuJG9wdGlvbnMuZGF0YVxuICAgIHRoaXMuX3Byb3h5KClcbiAgICBjb252ZXJ0KHRoaXMuX2RhdGEsIHRoaXMpIC8vIGNvbnZlcnQgdGhpcy5fZGF0YSB0byByZWFjdGl2ZVxuICB9XG4gIF9wcm94eSAoKSB7XG4gICAgbGV0ICBzZWxmID0gdGhpc1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCBrZXksIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIHByb3h5R2V0dGVyKCkge1xuICAgICAgICAgIHJldHVybiBzZWxmLl9kYXRhW2tleV1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiBwcm94eVNldHRlciAobmV3VmFsKSB7XG4gICAgICAgICAgc2VsZi5fZGF0YVtrZXldID0gbmV3VmFsXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICAkd2F0Y2ggKGV4cE9yRm4sIGNiKSB7XG4gICAgbmV3IFdhdGNoZXIodGhpcywgZXhwT3JGbiwgY2IpXG4gIH1cbiAgJG1vdW50IChlbCkge1xuICAgIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbClcbiAgICB0aGlzLiRlbCA9IGVsXG5cbiAgICAvLyBjb252ZXJ0IHRlbXBsYXRlIHRvIHJlbmRlciBmdW5jdGlvblxuICAgIGlmICghdGhpcy4kb3B0aW9ucy5yZW5kZXIpIHtcbiAgICAgIGNvbnN0IHsgcmVuZGVyIH0gPSBjb21waWxlKHRoaXMuJG9wdGlvbnMudGVtcGxhdGUpXG4gICAgICB0aGlzLiRvcHRpb25zLnJlbmRlciA9IHJlbmRlclxuICAgIH1cblxuICAgIC8vIHJlbmRlciB0byB2bm9kZSB0cmVlLCBwYXRjaCBhbmQgYWRkIHdhdGNoZXJcbiAgICBjb25zdCB1cGRhdGVDb21wb25lbnQgPSAoKSA9PiB7XG4gICAgICB0aGlzLl91cGRhdGUodGhpcy5fcmVuZGVyKCkpXG4gICAgfVxuICAgIHRoaXMuX3dhdGNoZXIgPSBuZXcgV2F0Y2hlcih0aGlzLCB1cGRhdGVDb21wb25lbnQsIG51bGwpXG5cbiAgICBpZiAodGhpcy4kdm5vZGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5faXNNb3VudGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBfcmVuZGVyICgpIHtcbiAgICBjb25zdCB2bSA9IHRoaXNcbiAgICBjb25zdCB7IHJlbmRlciwgX3BhcmVudFZub2RlIH0gPSB2bS4kb3B0aW9uc1xuXG4gICAgdm0uJHZub2RlID0gX3BhcmVudFZub2RlXG4gICAgY29uc3Qgdm5vZGUgPSByZW5kZXIuY2FsbCh2bSwgdm0uJGNyZWF0ZUVsZW1lbnQpXG4gICAgdm5vZGUucGFyZW50ID0gX3BhcmVudFZub2RlXG4gICAgcmV0dXJuIHZub2RlXG4gIH1cbiAgX3VwZGF0ZSAodm5vZGUpIHtcbiAgICBjb25zdCB2bSA9IHRoaXNcbiAgICBjb25zdCBwcmV2RWwgPSB2bS4kZWxcbiAgICBjb25zdCBwcmV2Vm5vZGUgPSB2bS5fdm5vZGVcbiAgICB2bS5fdm5vZGUgPSB2bm9kZVxuICAgIGlmICghcHJldlZub2RlKSB7XG4gICAgICAvLyBmaXJzdCByZW5kZXJcbiAgICAgIHZtLiRlbCA9IHZtLl9fcGF0Y2hfXyh2bS4kZWwsIHZub2RlKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB1cGRhdGVcbiAgICAgIHZtLiRlbCA9IHZtLl9fcGF0Y2hfXyhwcmV2Vm5vZGUsIHZub2RlKVxuICAgIH1cbiAgfVxuICBfX3BhdGNoX18gKG9sZFZub2RlLCB2bm9kZSkge1xuICAgIGNvbnN0IGluc2VydGVkVm5vZGVRdWV1ZSA9IFtdXG4gICAgY29uc3QgaXNSZWFsRWxlbWVudCA9IG9sZFZub2RlLm5vZGVUeXBlICE9PSB1bmRlZmluZWRcbiAgICBpZiAoaXNSZWFsRWxlbWVudCkge1xuICAgICAgb2xkVm5vZGUgPSBuZXcgVk5vZGUob2xkVm5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCB7fSwgW10sIHVuZGVmaW5lZCwgb2xkVm5vZGUpXG4gICAgfVxuICAgIGNvbnN0IG9sZEVsbSA9IG9sZFZub2RlLmVsbVxuICAgIGNvbnN0IHBhcmVudEVsbSA9IG9sZEVsbS5wYXJlbnRFbGVtZW50XG5cbiAgICAvLyBjcmVhdGUgd2hvbGUgZG9tIHRyZWUgcmVjdXJzaXZlbHlcbiAgICBjcmVhdGVFbG0odm5vZGUsIGluc2VydGVkVm5vZGVRdWV1ZSwgcGFyZW50RWxtLCBvbGRFbG0ubmV4dFNpYmxpbmcpXG5cbiAgICAvLyByZW1vdmUgb2xkIGRvbVxuICAgIHBhcmVudEVsbSAmJiBwYXJlbnRFbG0ucmVtb3ZlQ2hpbGQob2xkVm5vZGUuZWxtKVxuXG4gICAgcmV0dXJuIHZub2RlLmVsbVxuICB9XG5cbiAgLy8gcmVuZGVyIGhlbHBlcnNcbiAgJGNyZWF0ZUVsZW1lbnQgKHRhZywgZGF0YSwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gY3JlYXRlRWxlbWVudCh0aGlzLCB0YWcsIGRhdGEsIGNoaWxkcmVuKVxuICB9XG4gIF9jICh0YWcsIGRhdGEsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQodGhpcywgdGFnLCBkYXRhLCBjaGlsZHJlbilcbiAgfVxuICBfbCAodmFsLCByZW5kZXJGbikge1xuICAgIGxldCByZXRcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpIHx8IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXQgPSBuZXcgQXJyYXkodmFsLmxlbmd0aClcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gdmFsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICByZXRbaV0gPSByZW5kZXJGbih2YWxbaV0sIGkpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0ID0gbmV3IEFycmF5KHZhbClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsOyBpKyspIHtcbiAgICAgICAgcmV0W2ldID0gcmVuZGVyRm4oaSArIDEsIGkpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc09iamVjdCh2YWwpKSB7XG4gICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHZhbClcbiAgICAgIHJldCA9IG5ldyBBcnJheShrZXlzLmxlbmd0aClcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXVxuICAgICAgICByZXRbaV0gPSByZW5kZXJGbih2YWxba2V5XSwga2V5LCBpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0XG4gIH1cbiAgX3YgPSBjcmVhdGVUZXh0Vk5vZGVcbiAgX3MgPSB0b1N0cmluZ1xuICBfZSAoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVRleHRWTm9kZSgnJylcbiAgfVxufVxuZnVuY3Rpb24gY3JlYXRlRWxtICh2bm9kZSwgaW5zZXJ0ZWRWbm9kZVF1ZXVlLCBwYXJlbnRFbG0sIHJlZkVsbSkge1xuICBjb25zdCBkYXRhID0gdm5vZGUuZGF0YVxuICBjb25zdCBjaGlsZHJlbiA9IHZub2RlLmNoaWxkcmVuXG4gIGNvbnN0IHRhZyA9IHZub2RlLnRhZ1xuXG4gIGlmICh0YWcpIHtcbiAgICB2bm9kZS5lbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZylcbiAgICBjcmVhdGVDaGlsZHJlbih2bm9kZSwgY2hpbGRyZW4sIGluc2VydGVkVm5vZGVRdWV1ZSlcbiAgICBwYXJlbnRFbG0uaW5zZXJ0QmVmb3JlKHZub2RlLmVsbSwgcmVmRWxtKVxuICB9IGVsc2Uge1xuICAgIHZub2RlLmVsbSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpXG4gICAgcGFyZW50RWxtLmluc2VydEJlZm9yZSh2bm9kZS5lbG0sIHJlZkVsbSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDaGlsZHJlbiAodm5vZGUsIGNoaWxkcmVuLCBpbnNlcnRlZFZub2RlUXVldWUpIHtcbiAgY29uc3QgdHlwZSA9IHR5cGVvZiB2bm9kZS50ZXh0XG4gIGlmIChBcnJheS5pc0FycmF5KGNoaWxkcmVuKSkge1xuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkLCBpbmRleCkgPT4ge1xuICAgICAgY3JlYXRlRWxtKGNoaWxkLCBpbnNlcnRlZFZub2RlUXVldWUsIHZub2RlLmVsbSwgbnVsbClcbiAgICB9KVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8IHR5cGUgPT09ICdib29sZWFuJykge1xuICAgIHZub2RlLmVsbS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShTdHJpbmcodm5vZGUudGV4dCkpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZtXG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB3aW5kb3dbJ1ZtJ10gPSBWbVxufSBlbHNlIHtcbiAgY29uc29sZS5sb2coJ3NlcnZlcicpXG59XG4iXSwic291cmNlUm9vdCI6IiJ9