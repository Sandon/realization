"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePath = parsePath;
exports.augment = augment;

var _env = require("./env");

function parsePath(path) {
  // case like: b[0][2].z[0].w
  var segments = path.split(/[\[\]\.]/).filter(function (ele) {
    return ele !== "";
  });
  var len = segments.length;
  return function (obj) {
    for (var i = 0; i !== len; i++) {
      if (!obj) return;
      obj = obj[segments[i]];
    }
    return obj;
  };
} /**
   * Created by Sandon on 2017/3/26.
   */
function augment(target, src) {
  if (_env.hasProto) {
    target.__proto__ = src;
  } else {
    Object.getOwnPropertyNames(src).forEach(function (key) {
      Object.defineProperty(target, key, {
        value: src[key],
        enumerable: false,
        writable: true,
        configurable: true
      });
    });
  }
}