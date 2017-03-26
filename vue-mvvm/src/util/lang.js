/**
 * Created by Sandon on 2017/3/26.
 */
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