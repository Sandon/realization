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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReactiveObject = function () {
  function ReactiveObject(val) {
    _classCallCheck(this, ReactiveObject);

    this.value = val;
    this.walk(val);
  }

  _createClass(ReactiveObject, [{
    key: 'walk',
    value: function walk(obj) {
      Object.keys(obj).forEach(function (key) {
        return defineReactive(obj, key, obj[key]);
      });
    }
  }]);

  return ReactiveObject;
}();

exports.default = ReactiveObject;
function defineReactive(obj, key, val) {
  var childObj = convert(val);
  var dep = new _dep2.default();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (_dep2.default.target) dep.addSub(_dep2.default.target);
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (val === newVal) return;
      val = newVal;
      childObj = convert(val);
      console.log(dep);
      debugger;
      dep.notify();
    }
  });
}

function convert(val, vm) {
  if (!val || 'object' !== (typeof val === 'undefined' ? 'undefined' : _typeof(val))) return;

  return new ReactiveObject(val);
}