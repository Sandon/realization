/**
 * Created by Sandon on 2017/3/26.
 */
import {hasProto} from './env'

export function parsePath(path) {
  // case like: b[0][2].z[0].w
  const segments = path.split(/[\[\]\.]/).filter(ele => ele !== "")
  const len = segments.length
  return function (obj) {
    for (let i = 0; i !== len; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}

export function augment (target, src) {
  if (hasProto) {
    target.__proto__ = src
  } else {
    Object.getOwnPropertyNames(src).forEach((key) => {
      Object.defineProperty(target, key, {
        value: src[key],
        enumerable: false,
        writable: true,
        configurable: true
      })
    })
  }
}
