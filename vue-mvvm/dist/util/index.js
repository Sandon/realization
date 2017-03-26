'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lang = require('./lang');

Object.keys(_lang).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _lang[key];
    }
  });
});