'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Sandon on 2017/3/5.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _watcher = require('./reactive-object/watcher');

var _watcher2 = _interopRequireDefault(_watcher);

var _reactiveObject = require('./reactive-object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vm = function () {
  function Vm() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Vm);

    this.$options = options;
    this._data = this.$options.data;
    this._proxy();
    (0, _reactiveObject.convert)(this._data, this);
  }

  _createClass(Vm, [{
    key: '_proxy',
    value: function _proxy() {
      var self = this;
      Object.keys(this._data).forEach(function (key) {
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
  }, {
    key: '$watch',
    value: function $watch(expOrFn, cb) {
      new _watcher2.default(this, expOrFn, cb);
    }
  }]);

  return Vm;
}();

exports.default = Vm;