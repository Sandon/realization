"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Sandon on 2017/3/4.
 */
/**
 * A dep is an observable that can have multiple
 * watchers(directives in template or watchers bound manually) subscribing to it.
 */
var Dep = function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.subs = [];
  }
  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.


  _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }
  }, {
    key: "notify",
    value: function notify() {
      // stablize the subscriber list first
      var subs = this.subs.slice();
      subs.forEach(function (sub) {
        return sub.update();
      });
    }
  }]);

  return Dep;
}();

Dep.target = null;
Dep._targetStack = [];

Dep.pushTarget = function (targetWatcher) {
  Dep._targetStack.push(Dep.target);
  Dep.target = targetWatcher;
};

Dep.popTarget = function () {
  Dep.target = Dep._targetStack.pop();
};

exports.default = Dep;