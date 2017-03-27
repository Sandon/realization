'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by Sandon on 2017/3/18.
 */
var originArrayProto = Array.prototype;
var reactiveArrayProto = exports.reactiveArrayProto = Object.create(originArrayProto);['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
  // console.log('method:' + method)
  var originMethod = originArrayProto[method];
  Object.defineProperty(reactiveArrayProto, method, {
    value: function value() {
      var result = originMethod.apply(this, arguments);
      this.__reactiveObject__.dep.notify(true);
      return result;
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
});