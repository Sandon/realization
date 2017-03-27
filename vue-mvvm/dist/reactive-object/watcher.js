'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Sandon on 2017/3/4.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
  function Watcher(vm, expOrFn, cb) {
    _classCallCheck(this, Watcher);

    this.cb = cb;
    this.vm = vm;
    this.expOrFn = expOrFn;
    // trigger getter function to be executed to collect dependency
    this.value = this.get();
  }

  _createClass(Watcher, [{
    key: 'get',
    value: function get() {
      _dep2.default.pushTarget(this);
      var val = (0, _util.parsePath)(this.expOrFn)(this.vm._data);
      _dep2.default.popTarget();
      return val;
    }
  }, {
    key: 'update',
    value: function update(imperative) {
      this.run(imperative);
    }
  }, {
    key: 'run',
    value: function run(imperative) {
      var newVal = this.get();
      if (imperative || this.value !== newVal) {
        this.value = newVal;
        this.cb.call(this.vm);
      }
    }
  }]);

  return Watcher;
}();

exports.default = Watcher;