/**
 * Created by Sandon on 2017/3/26.
 */
export * from './lang'
export * from './env'
export * from './common'

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
export function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}