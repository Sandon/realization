'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Sandon on 2017/3/4.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


exports.defineReactive = defineReactive;
exports.convert = convert;

var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

var _util = require('../util');

var _array = require('./array');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactiveObject = function () {
  function ReactiveObject(val) {
    _classCallCheck(this, ReactiveObject);

    this.value = val;
    // a Dep for the object self
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
    // array is handled different from normal object
    if (Array.isArray(val)) {
      this.observeArray(val)
    } else {
      this.walk(val)
    }
    */
    this.walk(val);
  }

  _createClass(ReactiveObject, [{
    key: 'walk',
    value: function walk(obj) {
      Object.keys(obj).forEach(function (key) {
        return defineReactive(obj, key, obj[key]);
      });
    }
  }, {
    key: 'observeArray',
    value: function observeArray(arr) {
      arr.forEach(function (item) {
        return convert(item);
      });
    }
  }]);

  return ReactiveObject;
}();

// add getter/setter for every key/value pair in object
// in getter: collect the dependency relationships for data (watchers depend on data)
// in setter: notify watchers to update when data changes


exports.default = ReactiveObject;
function defineReactive(obj, key, val) {
  var childObj = convert(val);
  var dep = new _dep2.default(); // a Dep for the key-value pair of object
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (_dep2.default.target) {
        // watcher depends on the key-value pair of the object
        dep.addSub(_dep2.default.target);

        // watcher depends on the value responding to the key.
        // this will be used when manipulate a array (push,pop etc) or add/delete a property on object(array)
        childObj && childObj.dep.addSub(_dep2.default.target);

        // if the value responding to the key is a Array,
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
}

// convert a normal object to ReactiveObject
function convert(val, vm) {
  if (!val || 'object' !== (typeof val === 'undefined' ? 'undefined' : _typeof(val))) return;

  if (val.__reactiveObject__) return val.__reactiveObject__;

  return new ReactiveObject(val);
}

function dependArray(arr) {
  arr.forEach(function (ele) {
    ele && ele.__reactiveObject__ && ele.__reactiveObject__.dep.addSub(_dep2.default.target);
    Array.isArray(ele) && dependArray(ele);
  });
}